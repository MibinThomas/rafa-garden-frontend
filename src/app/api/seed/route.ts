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
        // About Section
        { key: 'about_hero_title', value: 'The Heritage of Rafah', type: 'text', group: 'about', label: 'Hero Title' },
        { key: 'about_hero_subtitle', value: 'A legacy of botanical excellence spanning generations.', type: 'text', group: 'about', label: 'Hero Subtitle' },
        { key: 'about_story_content', value: 'Founded in the heart of lush landscapes, Rafah Garden is more than just a farm...', type: 'text', group: 'about', label: 'Story Description' },
        
        // Global
        { key: 'site_name', value: 'Rafah Garden', type: 'text', group: 'global', label: 'Site Name' },
        { key: 'contact_email', value: 'hello@rafagarden.com', type: 'text', group: 'global', label: 'Global Contact Email' },
        
        // Header
        { key: 'header_logo', value: '/images/logo/Rafah logo.webp', type: 'image', group: 'header', label: 'Main Logo (320x96px Default)' },
        { key: 'header_promo_text', value: 'Spring Harvest - Discover our newest premium dragon fruit products!', type: 'text', group: 'header', label: 'Promo Banner Text' },
        { key: 'header_phone', value: '+971 50 123 4567', type: 'text', group: 'header', label: 'Header Support Phone' },
        
        // Footer
        { key: 'footer_image', value: '/images/footer/Ui footer all products.webp', type: 'image', group: 'footer', label: 'Collage Visual (800x600px Recommended)' },
        { key: 'footer_description', value: 'Rafah Garden brings you the finest selection of premium dragon fruit products cultivated with passion and sustainable farming practices in Kasaragod, Kerala.', type: 'text', group: 'footer', label: 'Company Description' },
        { key: 'footer_address', value: 'Rafah Farms, Kasaragod, Kerala, India', type: 'text', group: 'footer', label: 'Headquarters Address' },
        { key: 'footer_newsletter_title', value: 'Join the Rafah Family', type: 'text', group: 'footer', label: 'Newsletter Title' },
        { key: 'footer_newsletter_subtitle', value: 'Subscribe to our newsletter for seasonal harvest updates, exclusive farm offers, and botanical insights.', type: 'text', group: 'footer', label: 'Newsletter Subtitle' },
        { key: 'footer_copyright', value: '© 2026 Rafah Garden. All rights reserved.', type: 'text', group: 'footer', label: 'Copyright Text' }
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
