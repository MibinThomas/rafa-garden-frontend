import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SiteContent from '@/models/SiteContent';

// GET all global settings
export async function GET() {
  try {
    await dbConnect();
    const settings = await SiteContent.find({ group: 'global' }).sort({ key: 1 });
    const map: Record<string, string> = {};
    settings.forEach(s => { map[s.key] = s.value; });
    return NextResponse.json(map);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - update multiple settings at once
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    // body is { key: value, key: value, ... }
    const updates = Object.entries(body).map(([key, value]) => ({
      updateOne: {
        filter: { key },
        update: { $set: { key, value, group: 'global', type: 'text' } },
        upsert: true,
      }
    }));

    if (updates.length > 0) {
      await SiteContent.bulkWrite(updates as any);
    }

    return NextResponse.json({ message: 'Settings updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
