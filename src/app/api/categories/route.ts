import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';

// GET: Fetch all categories
export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find({}).sort({ id: 1 });
    return NextResponse.json(categories);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Create or Update a category
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id, oldId, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const category = await Category.findOneAndUpdate(
      { id: oldId || id }, // If oldId exists (renaming), find by that. Else find by current id.
      { id, ...updateData },
      { new: true, upsert: true }
    );

    return NextResponse.json(category);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Remove a category
export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await Category.findOneAndDelete({ id });
    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
