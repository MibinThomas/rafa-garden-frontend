import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET() {
  try {
    await dbConnect();
    const orders = await Order.find({}).sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Check if it's a "sample" request
    if (body.sample) {
      const sampleOrder = {
        orderId: `RF-${Math.floor(1000 + Math.random() * 9000)}`,
        customer: {
          name: "Alexander Zarkov",
          email: "alexander@sanctuary.com",
          phone: "+971 50 123 4567",
          address: "The Palms, Villa 42, Dubai, UAE"
        },
        items: [
          {
            productId: "prod-1",
            name: "The Monarch High Back",
            image: "/images/products/monarch.webp",
            variant: { size: "XL", unit: "Unit", price: 1250 },
            quantity: 1
          },
          {
            productId: "prod-2",
            name: "Rafah Secret Reserve",
            image: "/images/products/jam.webp",
            variant: { size: "500", unit: "g", price: 85 },
            quantity: 2
          }
        ],
        totalAmount: 1420,
        status: 'pending',
        paymentStatus: 'paid',
        paymentMethod: 'Credit Card'
      };
      
      const order = await Order.create(sampleOrder);
      return NextResponse.json(order);
    }

    const order = await Order.create(body);
    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (id) {
      await Order.findByIdAndDelete(id);
    } else {
      await Order.deleteMany({});
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    await dbConnect();
    const { id, status, paymentStatus } = await request.json();
    const order = await Order.findByIdAndUpdate(id, { status, paymentStatus }, { new: true });
    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
