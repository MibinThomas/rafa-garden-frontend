import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/mongodb";
import SeoSettings from "@/models/SeoSettings";
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
    const page = searchParams.get("page");
    
    if (page) {
      const seo = await SeoSettings.findOne({ page });
      if (!seo) {
        // Return blank default settings instead of 404 to avoid frontend errors
        return NextResponse.json({
          page,
          metaTitle: "Rafah Garden | Heritage Pitaya Sanctuary",
          metaDescription: "Experience nature's premium sweetness at our organic pitaya dragon fruit sanctuary.",
          keywords: "dragon fruit, organic pitaya, agricultural sanctuary, boutique farm, botanical refreshment",
          ogImage: ""
        });
      }
      return NextResponse.json(seo);
    }
    
    const allSeo = await SeoSettings.find({});
    return NextResponse.json(allSeo);
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
    const { page, metaTitle, metaDescription, keywords, ogImage } = body;
    
    if (!page || !metaTitle || !metaDescription) {
      return NextResponse.json({ error: "Page, metaTitle, and metaDescription are required" }, { status: 400 });
    }
    
    const seo = await SeoSettings.findOneAndUpdate(
      { page },
      { page, metaTitle, metaDescription, keywords, ogImage },
      { new: true, upsert: true }
    );
    
    return NextResponse.json(seo);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
