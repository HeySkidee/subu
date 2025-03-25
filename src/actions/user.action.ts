"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// to save logged in user's data in db, if already exists then don't
export async function syncUser() {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) return;

        const existingUser = await prisma.user.findUnique({
            where: {
                clerkId: userId,
            },
        });

        if (existingUser) return existingUser;

        const newUser = await prisma.user.create({
            data: {
                clerkId: userId,
                name: `${user.firstName || ""} ${user.lastName || ""}`,
                username:
                    user.username ??
                    user.emailAddresses[0].emailAddress.split("@")[0],
                email: user.emailAddresses[0].emailAddress,
                image: user.imageUrl,
            },
        });

        return newUser;
    } catch (error) {
        console.log("Error in syncUser ", error);
    }
}

export async function getUserByClerkId(clerkId: string) {
    return prisma.user.findUnique({
        where: {
            clerkId,
        },
        include: {
            _count: {
                select: {
                    followers: true,
                    following: true,
                    posts: true,
                },
            },
        },
    });
}

// taking the clerk id, using it to find the user's Id in neon db
export async function getDbUserId() {
    const { userId: clerkId } = await auth();
    if (!clerkId) return null // if user not logged in 

    const user = await getUserByClerkId(clerkId);
    if (!user) throw new Error("User not found");

    return user.id;
}

// get 3 random users excluding ourselves & users that we already follow
export async function getRandomUsers() {
    try {
        const userId = await getDbUserId();

        if(!userId) return []

        const randomUser = await prisma.user.findMany({
            where: {
                AND: [
                    { NOT: { id: userId } },
                    {
                        NOT: {
                            followers: {
                                some: {
                                    followerId: userId,
                                },
                            },
                        },
                    },
                ],
            },
            select: {
                id: true,
                name: true,
                username: true,
                image: true,
                _count: {
                    select: {
                        followers: true,
                    },
                },
            },
            take: 3,
        });

        return randomUser;
    } catch (error) {
        console.log("Error fetching random users: ", error);
        return [];
    }
}

export async function toggleFollow(targetUserId: string) {
    try {
        const userId = await getDbUserId();

        if(!userId) return;

        if (userId === targetUserId) {
            throw new Error("You cannot follow yourself");
        }

        // if targetUserId exits in follower list, try to unfollow
        const existingUser = await prisma.follows.findUnique({
            where: {
                followerId_followingId: {
                    followerId: userId,
                    followingId: targetUserId,
                },
            },
        });

        if (existingUser) {
            // unfollow
            await prisma.follows.delete({
                where: {
                    followerId_followingId: {
                        followerId: userId,
                        followingId: targetUserId,
                    },
                },
            });
        } else {
            // follow
            await prisma.$transaction([
                prisma.follows.create({
                    data: {
                        followerId: userId,
                        followingId: targetUserId,
                    },
                }),

                prisma.notification.create({
                    data: {
                        type: "FOLLOW",
                        userId: targetUserId, // user being followed
                        creatorId: userId, // user following
                    },
                }),
            ]);
        }

        revalidatePath("/")
        return { success: true };
    } catch (error) {
        console.log("Error in toggleFollow ", error);
        return { success: false, error: "Error toggline follow" };
    }
}
