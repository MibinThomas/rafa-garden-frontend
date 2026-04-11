import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';
import SiteContent from '@/models/SiteContent';
import { CATEGORIES } from '@/lib/data';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const force = searchParams.get('force') === 'true';

    await dbConnect();
    
    // Seed Categories
    await Category.deleteMany({});
    const categoriesResult = await Category.insertMany(CATEGORIES);
    
    // Seed Initial Site Content if empty or forced
    const contentCount = await SiteContent.countDocuments();
    let contentResult = [];
    if (contentCount === 0 || force) {
      await SiteContent.deleteMany({});
      contentResult = await SiteContent.insertMany([
        { key: 'about_hero_title', value: 'The Heritage of Rafah', group: 'about' },
        { key: 'about_hero_subtitle', value: 'A legacy of botanical excellence spanning generations.', group: 'about' },
        { key: 'about_story_content', value: 'Founded in the heart of lush landscapes, Rafah Garden is more than just a farm...', group: 'about' },
        { key: 'site_name', value: 'Rafah Garden', group: 'global' },
        { key: 'contact_email', value: 'hello@rafagarden.com', group: 'global' }
      ]);
    }

    return NextResponse.json({ 
      success: true, 
      message: "Database seeded successfully",
      categories: `${categoriesResult.length} collections added`,
      content: contentResult.length > 0 ? `${contentResult.length} settings added` : "Skipped (already exists)"
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
