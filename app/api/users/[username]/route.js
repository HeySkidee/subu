import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function GET(request, { params }) {
  await dbConnect();

  try {
    const { username } = params;
    const user = await User.findOne({ username })
      .select('-email')
      .populate('followers', 'name username image')
      .populate('following', 'name username image');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}