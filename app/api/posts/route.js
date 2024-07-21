// app/api/posts/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from '@/lib/dbConnect';
import Post from '@/models/Post';
import User from '@/models/User';

export async function POST(request) {
  console.log('POST request received');
  const session = await getServerSession(authOptions);
  if (!session) {
    console.log('No session found');
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }

  await dbConnect();

  try {
    const body = await request.json();
    console.log('Request body:', body);
    const { content } = body;
    console.log('Content:', content);
    
    let user = await User.findOne({ email: session.user.email });
    console.log('User found:', user);
    
    if (!user) {
      // If user is not found, create a new one
      user = await User.create({
        name: session.user.name,
        email: session.user.email,
        image: session.user.image
      });
      console.log('New user created:', user);
    }
    
    const post = await Post.create({ content, author: user._id });
    console.log('Post created:', post);
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error in POST:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function GET() {
  console.log('GET request received');
  await dbConnect();

  try {
    const posts = await Post.find({}).sort({ createdAt: -1 }).populate('author', 'name image');
    console.log('Posts fetched:', posts);
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error in GET:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}