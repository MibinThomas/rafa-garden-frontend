import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';
import Product from '@/models/Product'; // Ensure Product model is registered for population

// GET: Fetch all categories with populated and dynamically matched products
export async function GET() {
  try {
    await dbConnect();
    
    const _ignore = Product.modelName; 

    // 1. Fetch all category documents
    const rawCategories = await Category.find({})
      .sort({ id: 1 })
      .populate('products')
      .lean();

    // 2. Fetch all product documents sorted by creation date
    const allProducts = await Product.find({}).sort({ createdAt: -1 }).lean();

    // 3. Dynamically merge products for each category
    const categoriesWithProducts = rawCategories.map((catDoc: any) => {
      const catTitleLower = (catDoc.title || "").toLowerCase().trim();
      const catIdLower = (catDoc.id || "").toLowerCase().trim();
      const catSlugLower = (catDoc.slug || "").toLowerCase().trim();

      const populatedProds = Array.isArray(catDoc.products) ? catDoc.products : [];

      // Find products in DB whose `category` field matches cat title, id, or slug
      const matchedDbProds = allProducts.filter((p: any) => {
        if (!p.category) return false;
        const pCatLower = p.category.toLowerCase().trim();
        return (
          pCatLower === catTitleLower ||
          pCatLower === catIdLower ||
          pCatLower === catSlugLower ||
          (catTitleLower && pCatLower.includes(catTitleLower)) ||
          (catTitleLower && catTitleLower.includes(pCatLower))
        );
      });

      // Deduplicate using a Map
      const productMap = new Map();

      // Add populated products first
      populatedProds.forEach((p: any) => {
        if (p && (p._id || p.id)) {
          const key = (p._id || p.id).toString();
          productMap.set(key, JSON.parse(JSON.stringify({
            ...p,
            id: p.id || p._id?.toString()
          })));
        }
      });

      // Add matching DB products (ensures newly added admin products are present)
      matchedDbProds.forEach((p: any) => {
        if (p && (p._id || p.id)) {
          const key = (p._id || p.id).toString();
          productMap.set(key, JSON.parse(JSON.stringify({
            ...p,
            id: p.id || p._id?.toString()
          })));
        }
      });

      return {
        ...JSON.parse(JSON.stringify(catDoc)),
        products: Array.from(productMap.values())
      };
    });
      
    return NextResponse.json(categoriesWithProducts);
  } catch (error: any) {
    console.error("Categories fetch error:", error);
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
    ).populate('products');

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
