import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';
import { CATEGORIES } from '@/lib/data';

export async function GET() {
  // Only allow seeding in development mode
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 });
  }

  try {
    await dbConnect();
    
    // Clear existing categories
    await Category.deleteMany({});
    
    // Insert initial categories from static data
    const result = await Category.insertMany(CATEGORIES);
    
    return NextResponse.json({ 
      success: true, 
      message: `${result.length} categories seeded successfully from data.ts`,
      data: result 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
