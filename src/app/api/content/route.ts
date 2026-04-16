import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import SiteContent from "@/models/SiteContent";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const group = searchParams.get("group");

    const query = group ? { group } : {};
    const content = await SiteContent.find(query).sort({ key: 1 });
    
    return NextResponse.json(content);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Support single item or array of items
    const items = Array.isArray(body) ? body : [body];
    
    const results = await Promise.all(
      items.map(async (item) => {
        const { key, value, type, group, label, hint, maxLength } = item;
        return await SiteContent.findOneAndUpdate(
          { key },
          { value, type, group, label, hint, maxLength },
          { upsert: true, new: true }
        );
      })
    );

    return NextResponse.json(results);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
