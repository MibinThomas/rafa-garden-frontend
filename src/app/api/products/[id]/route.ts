import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';

// GET: Fetch a single product
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Update a product
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    const body = await request.json();
    
    // Find original product to check if category changed
    const originalProduct = await Product.findById(id);
    if (!originalProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );
    
    // If category changed, update references in Category documents
    if (body.category && body.category !== originalProduct.category) {
      // Remove from old category
      await Category.findOneAndUpdate(
        { title: originalProduct.category },
        { $pull: { products: id } }
      );
      // Add to new category
      await Category.findOneAndUpdate(
        { title: body.category },
        { $addToSet: { products: id } }
      );
    }
    
    return NextResponse.json(updatedProduct);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Remove a product
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    
    // Find the product to get its category before deleting
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    // Remove reference from Category
    await Category.findOneAndUpdate(
      { title: product.category },
      { $pull: { products: id } }
    );
    
    // Delete the product
    await Product.findByIdAndDelete(id);
    
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
