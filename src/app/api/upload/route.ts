import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Media from '@/models/Media';

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  let filename = searchParams.get('filename');

  try {
    const contentType = request.headers.get('content-type') || '';
    let body: Buffer;
    let targetFilename = filename || 'upload.jpg';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = (formData.get('file') || formData.get('image') || formData.get('upload')) as File;

      if (!file) {
        return NextResponse.json({ error: 'No file found in form data' }, { status: 400 });
      }

      targetFilename = filename || file.name || 'upload.jpg';
      const arrayBuffer = await file.arrayBuffer();
      body = Buffer.from(arrayBuffer);
    } else {
      const arrayBuffer = await request.arrayBuffer();
      body = Buffer.from(arrayBuffer);
    }

    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      throw new Error("BLOB_READ_WRITE_TOKEN is missing from environment");
    }

    const blob = await put(targetFilename, body, {
      access: 'public',
      token: token,
      addRandomSuffix: true,
    });

    // Save record to MongoDB Media collection
    try {
      await dbConnect();
      await Media.create({
        url: blob.url,
        name: targetFilename,
        size: body.length,
      });
    } catch (e) {
      console.log("Error saving media to DB:", e);
    }

    return NextResponse.json(blob);
  } catch (error: any) {
    console.error("Vercel Blob Upload Error:", error);
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}

