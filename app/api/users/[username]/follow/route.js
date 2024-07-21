import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }

  await dbConnect();

  try {
    const { username } = params;
    const currentUser = await User.findById(session.user.id);
    const userToFollow = await User.findOne({ username });

    if (!userToFollow) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isFollowing = currentUser.following.includes(userToFollow._id);

    if (isFollowing) {
      currentUser.following.pull(userToFollow._id);
      userToFollow.followers.pull(currentUser._id);
    } else {
      currentUser.following.push(userToFollow._id);
      userToFollow.followers.push(currentUser._id);
    }

    await currentUser.save();
    await userToFollow.save();

    return NextResponse.json({ success: true, isFollowing: !isFollowing });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}