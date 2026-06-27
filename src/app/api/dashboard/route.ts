import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import Order from '@/models/Order';
import Enquiry from '@/models/Enquiry';

export async function GET() {
  try {
    await dbConnect();

    const [
      totalProducts,
      activeProducts,
      outOfStock,
      lowStock,
      featuredProducts,
      totalCategories,
      totalOrders,
      pendingOrders,
      newEnquiries,
      recentOrders,
      lowStockProducts,
    ] = await Promise.all([
      Product.countDocuments({}),
      Product.countDocuments({ active: true }),
      Product.countDocuments({ stockStatus: 'out-of-stock' }),
      Product.countDocuments({ stockStatus: 'low-stock' }),
      Product.countDocuments({ featured: true }),
      Category.countDocuments({}),
      Order.countDocuments({}),
      Order.countDocuments({ status: 'pending' }),
      Enquiry.countDocuments({ status: 'new' }),
      Order.find({}).sort({ createdAt: -1 }).limit(5).lean(),
      Product.find({ stockStatus: { $in: ['low-stock', 'out-of-stock'] } })
        .select('name sku stock stockStatus category')
        .limit(10)
        .lean(),
    ]);

    return NextResponse.json({
      products: { total: totalProducts, active: activeProducts, outOfStock, lowStock, featured: featuredProducts },
      categories: { total: totalCategories },
      orders: { total: totalOrders, pending: pendingOrders },
      enquiries: { new: newEnquiries },
      recentOrders,
      lowStockProducts,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
