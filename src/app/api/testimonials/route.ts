import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";
import { verifyToken } from "@/lib/auth";

async function checkAuth(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin-token")?.value;
    if (!token) return false;
    const verified = await verifyToken(token);
    return !!verified;
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const publishOnly = searchParams.get("published") === "true";
    
    const query = publishOnly ? { isPublished: true } : {};
    const testimonials = await Testimonial.find(query).sort({ order: 1 });
    
    return NextResponse.json(testimonials);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    await dbConnect();
    const body = await req.json();
    const { _id, ...data } = body;
    
    let testimonial;
    if (_id) {
      testimonial = await Testimonial.findByIdAndUpdate(_id, data, { new: true, upsert: true });
    } else {
      testimonial = await Testimonial.create(data);
    }
    
    return NextResponse.json(testimonial);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    
    await Testimonial.findByIdAndDelete(id);
    return NextResponse.json({ message: "Testimonial deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
