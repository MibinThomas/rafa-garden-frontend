import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';

// GET: Fetch all products
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    await dbConnect();
    
    let query: any = {};
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const products = await Product.find(query).sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error: any) {
    console.error("Products GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Create a new product
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Create the product
    const product = await Product.create(body);
    
    // Update the corresponding category to include this product
    if (body.category) {
      await Category.findOneAndUpdate(
        { title: body.category },
        { $addToSet: { products: product._id } }
      );
    }
    
    return NextResponse.json(product);
  } catch (error: any) {
    console.error("Product creation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
