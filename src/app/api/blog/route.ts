import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import { BLOG_POSTS } from '@/lib/data';

// GET: Fetch all blog posts
export async function GET() {
  try {
    await dbConnect();
    let posts = await BlogPost.find({}).sort({ createdAt: -1 });
    
    // Seed initial data if database is empty
    if (posts.length === 0 && BLOG_POSTS.length > 0) {
      await BlogPost.insertMany(BLOG_POSTS);
      posts = await BlogPost.find({}).sort({ createdAt: -1 });
    }
    
    return NextResponse.json(posts);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Create or Update a blog post
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id, oldId, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const post = await BlogPost.findOneAndUpdate(
      { id: oldId || id },
      { id, ...updateData },
      { new: true, upsert: true }
    );

    return NextResponse.json(post);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Remove a blog post
export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await BlogPost.findOneAndDelete({ id });
    return NextResponse.json({ message: 'Blog post deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
