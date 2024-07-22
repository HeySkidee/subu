// app/api/posts/[id]/comment/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import dbConnect from '@/lib/dbConnect';
import Post from '@/models/Post';
import Comment from '@/models/Comment';
import User from '@/models/User';

export async function POST(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }

  await dbConnect();

  try {
    const { id } = params;
    const { content } = await request.json();
    const user = await User.findOne({ email: session.user.email });
    const post = await Post.findById(id);

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const comment = await Comment.create({
      content,
      author: user._id,
      post: post._id,
    });

    post.comments.push(comment._id);
    await post.save();

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}