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
      confirmedOrders,
      deliveredOrders,
      newEnquiries,
      recentOrders,
      lowStockProducts,
      revenueResult,
    ] = await Promise.all([
      Product.countDocuments({}),
      Product.countDocuments({ active: true }),
      Product.countDocuments({ stockStatus: 'out-of-stock' }),
      Product.countDocuments({ stock: { $lte: 10 } }),
      Product.countDocuments({ featured: true }),
      Category.countDocuments({}),
      Order.countDocuments({}),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'processing' }),
      Order.countDocuments({ status: 'delivered' }),
      Enquiry.countDocuments({ status: 'new' }),
      Order.find({}).sort({ createdAt: -1 }).limit(5).lean(),
      Product.find({ $or: [{ stock: { $lte: 10 } }, { stockStatus: { $in: ['low-stock', 'out-of-stock'] } }] })
        .select('name sku stock stockStatus category image')
        .limit(10)
        .lean(),
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
      ])
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    return NextResponse.json({
      revenue: totalRevenue,
      products: { total: totalProducts, active: activeProducts, outOfStock, lowStock, featured: featuredProducts },
      categories: { total: totalCategories },
      orders: { total: totalOrders, pending: pendingOrders, confirmed: confirmedOrders, delivered: deliveredOrders },
      enquiries: { new: newEnquiries },
      recentOrders,
      lowStockProducts,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
