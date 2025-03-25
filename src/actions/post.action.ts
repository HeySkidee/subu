"use server";

import { revalidatePath } from "next/cache";
import { getDbUserId } from "./user.action";
import prisma from "@/lib/prisma";

export async function createPost(content: string, image: string) {
    try {
        const userId = await getDbUserId();

        if (!userId) return;

        const post = await prisma?.post.create({
            data: {
                content,
                image,
                authorId: userId,
            },
        });

        revalidatePath("/"); // purge the cache for homepage
        return { success: true, post };
    } catch (error) {
        console.error("Failed to create post: ", error);
        return { success: false, error: "Failed to create post" };
    }
}

export async function getPosts() {
    try {
        const posts = await prisma.post.findMany({
            orderBy: {
                createdAt: "desc",
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        username: true,
                    },
                },
                comments: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                username: true,
                                image: true,
                                name: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: "asc",
                    },
                },
                likes: {
                    select: {
                        userId: true,
                    },
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                    },
                },
            },
        });

        return posts;
    } catch (error) {
        console.log("Error in getPosts", error);
        throw new Error("Failed to fetch posts");
    }
}

export async function toggleLike(postId: string) {
    try {
        // check if user is logged in
        const userId = await getDbUserId();
        if (!userId) return;

        const post = await prisma.post.findUnique({
            where: { id: postId },
            select: { authorId: true },
        });

        if (!post) throw new Error("Post not found");

        // check current userId in list of likes
        const existingLikes = await prisma.like.findUnique({
            where: {
                userId_postId: {
                    userId,
                    postId,
                },
            },
        });

        // if like exists, unlike by deleting the userId from post's likes list
        if (existingLikes) {
            await prisma.like.delete({
                where: {
                    userId_postId: {
                        userId,
                        postId,
                    },
                },
            });
        } else {
            // like and create notification (only if liking someone else's post)
            await prisma.$transaction([
                prisma.like.create({
                    data: {
                        userId,
                        postId,
                    },
                }),
                ...(post.authorId !== userId // to prevent notification generation for ourselves
                    ? [
                          prisma.notification.create({
                              data: {
                                  type: "LIKE",
                                  userId: post.authorId, // recipient Id (post author)
                                  creatorId: userId, // person who liked
                                  postId,
                              },
                          }),
                      ]
                    : []),
            ]);
        }

        // forcing next.js to fetch up-to-date data next time instead of using cached data,
        // or it might show the liked post unliked coz its showing cached data:
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.log("Failed to toggle like: ", error);
        return { success: false, error: "Failed to toggle like" };
    }
}

export async function createComment(postId: string, content: string) {
    try {
        // check if authenticated user, comment and post exists:
        const userId = await getDbUserId();
        if (!userId) return;
        if (!content) throw new Error("content is required");

        const post = await prisma.post.findUnique({
            where: { id: postId },
            select: { authorId: true },
        });
        if (!post) throw new Error("Post not found");

        // create comment and notification
        const [comment] = await prisma.$transaction(async (tx) => {
            // creating comment first
            const newComment = await tx.comment.create({
                data: {
                    content,
                    authorId: userId,
                    postId,
                },
            });

            // create notification if commenting on someone else's post
            if (post.authorId !== userId) {
                await tx.notification.create({
                    data: {
                        type: "COMMENT",
                        userId: post.authorId,
                        creatorId: userId,
                        postId,
                        commentId: newComment.id,
                    },
                });
            }

            return [newComment];
        });
        revalidatePath("/");
        return { success: true, comment };
    } catch (error) {
        console.error("Failed to create comment:", error);
        return { success: false, error: "Failed to create comment" };
    }
}

export async function deletePost(postId: string) {
    try {
        const userId = await getDbUserId();

        const post = await prisma.post.findUnique({
            where: { id: postId },
            select: { authorId: true },
        });

        if (!post) throw new Error("Post not found");
        if (post.authorId !== userId) {
            throw new Error("Unauthorized - no delete permission");
        }

        await prisma.post.delete({
            where: { id: postId },
        });

        revalidatePath("/"); // purge the cache
        return { success: true };
    } catch (error) {
        console.error("Failed to delete the post: ", error);
        return { success: false, error: "Failed to delete the post" };
    }
}
