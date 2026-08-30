import { NextResponse } from 'next/server';
import { readdirSync, existsSync } from 'fs';
import path from 'path';
import dbConnect from '@/lib/mongodb';
import Media from '@/models/Media';
import Product from '@/models/Product';
import Category from '@/models/Category';

export async function GET() {
  try {
    const mediaSet = new Set<string>();

    // 1. Collect static images from public folder subdirectories
    const publicDir = path.join(process.cwd(), 'public');

    const scanDirectory = (dir: string, urlPrefix: string) => {
      if (!existsSync(dir)) return;
      try {
        const items = readdirSync(dir, { withFileTypes: true });
        for (const item of items) {
          const itemPath = path.join(dir, item.name);
          const currentUrl = `${urlPrefix}/${item.name}`;
          
          if (item.isDirectory()) {
            // Ignore system folders like node_modules or hidden folders
            if (!item.name.startsWith('.') && item.name !== 'node_modules') {
              scanDirectory(itemPath, currentUrl);
            }
          } else if (/\.(jpg|jpeg|png|webp|gif|svg)$/i.test(item.name)) {
            mediaSet.add(currentUrl);
          }
        }
      } catch (e) {
        console.error('Error scanning directory:', dir, e);
      }
    };

    // Scan specific subdirectories under public
    const foldersToScan = ['products', 'images', 'brand', 'uploads', 'logo'];
    for (const folder of foldersToScan) {
      scanDirectory(path.join(publicDir, folder), `/${folder}`);
    }

    // 2. Query MongoDB for uploaded media & product image URLs
    try {
      await dbConnect();
      
      const dbMedia = await Media.find({}).sort({ createdAt: -1 }).select('url');
      dbMedia.forEach(m => {
        if (m.url) mediaSet.add(m.url);
      });

      const products = await Product.find({}).select('image images');
      products.forEach(p => {
        if (p.image) mediaSet.add(p.image);
        if (Array.isArray(p.images)) {
          p.images.forEach((img: string) => { if (img) mediaSet.add(img); });
        }
      });

      const categories = await Category.find({}).select('image');
      categories.forEach(c => {
        if (c.image) mediaSet.add(c.image);
      });
    } catch (e) {
      console.log('MongoDB media fetch fallback:', e);
    }

    const allMedia = Array.from(mediaSet);
    return NextResponse.json(allMedia);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
