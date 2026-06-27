import { NextResponse } from 'next/server';
import { readdirSync, existsSync } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadDir)) {
      return NextResponse.json([]);
    }

    const collectImages = (dir: string, prefix: string): string[] => {
      const results: string[] = [];
      try {
        const items = readdirSync(dir, { withFileTypes: true });
        for (const item of items) {
          if (item.isDirectory()) {
            results.push(...collectImages(path.join(dir, item.name), `${prefix}/${item.name}`));
          } else if (/\.(jpg|jpeg|png|webp|gif|svg)$/i.test(item.name)) {
            results.push(`${prefix}/${item.name}`);
          }
        }
      } catch {}
      return results;
    };

    const images = collectImages(uploadDir, '/uploads');
    return NextResponse.json(images.reverse()); // newest first
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
