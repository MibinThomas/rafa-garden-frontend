import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import { productsToFileContent, fileContentToProducts } from '@/lib/inventory';

// GET: Export all products to Excel or CSV
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const format = (searchParams.get('format') || 'csv') as 'xlsx' | 'csv';
    
    await dbConnect();
    const products = await Product.find({}).sort({ category: 1, id: 1 });
    
    const content = productsToFileContent(products, format);
    
    const headers: Record<string, string> = {
      'Content-Disposition': `attachment; filename=rafah-garden-inventory.${format}`
    };

    if (format === 'csv') {
      headers['Content-Type'] = 'text/csv; charset=utf-8';
    } else {
      headers['Content-Type'] = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }
    
    return new Response(content as BodyInit, { headers });
  } catch (error: any) {
    console.error("Bulk export error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Bulk import products from Excel or CSV
export async function POST(request: Request) {
  try {
    await dbConnect();
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    const arrayBuffer = await file.arrayBuffer();
    const productDataList = fileContentToProducts(arrayBuffer);
    
    const results = { updated: 0, created: 0, errors: [] as string[] };
    
    for (const item of productDataList) {
      try {
        if (!item.id || item.id === 'undefined') continue;

        const existing = await Product.findOne({ id: item.id });
        
        let savedProduct;
        if (existing) {
          savedProduct = await Product.findByIdAndUpdate(existing._id, item, { new: true });
          results.updated++;
        } else {
          savedProduct = await Product.create(item);
          results.created++;
        }
        
        if (item.category) {
          await Category.updateMany(
             { products: savedProduct._id },
             { $pull: { products: savedProduct._id } }
          );
          await Category.findOneAndUpdate(
            { title: item.category },
            { $addToSet: { products: savedProduct._id } },
            { upsert: true }
          );
        }
      } catch (err: any) {
        results.errors.push(`Error processing ${item.name} (${item.id}): ${err.message}`);
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Processed ${productDataList.length} products.`,
      summary: results
    });
  } catch (error: any) {
    console.error("Bulk import error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
