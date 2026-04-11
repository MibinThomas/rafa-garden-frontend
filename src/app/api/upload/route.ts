import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
  }

  try {
    const arrayBuffer = await request.arrayBuffer();
    const body = Buffer.from(arrayBuffer);

    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      throw new Error("BLOB_READ_WRITE_TOKEN is missing from environment");
    }

    const blob = await put(filename, body, {
      access: 'public',
      token: token,
      addRandomSuffix: true,
    });

    return NextResponse.json(blob);
  } catch (error: any) {
    console.error("Vercel Blob Upload Error:", error);
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}
