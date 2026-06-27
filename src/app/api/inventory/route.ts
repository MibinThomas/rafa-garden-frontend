import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import InventoryLog from '@/models/InventoryLog';

// GET: Fetch all products with inventory data
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const lowStock = searchParams.get('lowStock');
    const search = searchParams.get('search');

    let query: any = {};
    if (category) query.category = category;
    if (status) query.stockStatus = status;
    if (lowStock === 'true') query.$expr = { $lte: ['$stock', '$lowStockThreshold'] };
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { sku: { $regex: search, $options: 'i' } }
    ];

    const products = await Product.find(query)
      .select('id name sku category stock stockStatus lowStockThreshold image updatedAt')
      .sort({ category: 1, name: 1 });

    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH: Update stock quantity for a product
export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();
    const { productId, stock, changeType, note, adminUser } = await req.json();

    if (!productId) return NextResponse.json({ error: 'productId required' }, { status: 400 });

    const product = await Product.findOne({ $or: [{ id: productId }, { _id: productId }] });
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    const previousQty = product.stock || 0;
    const newQty = typeof stock === 'number' ? stock : previousQty;

    // Auto-determine stock status
    let stockStatus = 'in-stock';
    if (newQty <= 0) stockStatus = 'out-of-stock';
    else if (newQty <= (product.lowStockThreshold || 10)) stockStatus = 'low-stock';

    const updated = await Product.findByIdAndUpdate(
      product._id,
      { stock: newQty, stockStatus },
      { new: true }
    );

    // Log the inventory change
    await InventoryLog.create({
      productId: product.id || product._id.toString(),
      productName: product.name,
      sku: product.sku || '',
      changeType: changeType || 'adjust',
      previousQty,
      newQty,
      note: note || '',
      adminUser: adminUser || 'admin',
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
