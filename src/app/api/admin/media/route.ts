import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { list, del } from "@vercel/blob";
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
    if (!(await checkAuth())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      return NextResponse.json({ error: "BLOB_READ_WRITE_TOKEN is missing" }, { status: 500 });
    }

    const response = await list({ token });
    return NextResponse.json(response.blobs || []);
  } catch (error: any) {
    console.error("Media list error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      return NextResponse.json({ error: "BLOB_READ_WRITE_TOKEN is missing" }, { status: 500 });
    }

    await del(url, { token });
    return NextResponse.json({ success: true, message: "Media deleted successfully" });
  } catch (error: any) {
    console.error("Media delete error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
