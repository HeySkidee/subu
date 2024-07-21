// app/api/posts/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from '@/lib/dbConnect';
import Post from '@/models/Post';
import User from '@/models/User';

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }

  await dbConnect();

  try {
    const formData = await request.formData();
    const content = formData.get('content');
    const image = formData.get('image');
    
    let imageUrl = null;
    if (image) {
      // Here you would typically upload the image to a cloud storage service
      // and get back a URL. For this example, we'll just use a placeholder.
      imageUrl = '/api/placeholder/500/300';
    }

    const user = await User.findOne({ email: session.user.email });
    const post = await Post.create({ 
      content, 
      image: imageUrl, 
      author: user._id 
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function GET(request) {
  await dbConnect();

  try {
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .populate('author', 'name username image');
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}