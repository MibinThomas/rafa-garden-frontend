import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';
import Product from '@/models/Product';
import SiteContent from '@/models/SiteContent';
import { CATEGORIES } from '@/lib/data';
import mongoose from 'mongoose';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const force = searchParams.get('force') === 'true';

    await dbConnect();
    
    // 1. Clear existing products and categories
    // Also drop indexes to avoid legacy constraints like 'sku_1'
    try {
      await mongoose.connection.collection('products').dropIndexes();
    } catch (e) {
      console.log("No indexes to drop or collection doesn't exist yet");
    }

    await Product.deleteMany({});
    await Category.deleteMany({});
    
    // 2. Seed Products and Categories
    const seededCategories = [];
    
    for (const catData of CATEGORIES) {
      const { products: productsArray, ...categoryInfo } = catData;
      
      // Create products first
      const productDocs = await Product.insertMany(
        productsArray.map((p: any) => ({
          ...p,
          category: categoryInfo.title,
          active: true
        }))
      );
      
      // Create category with product references
      const category = await Category.create({
        ...categoryInfo,
        products: productDocs.map(p => p._id)
      });
      
      seededCategories.push(category);
    }
    
    // 3. Seed Initial Site Content if empty or forced
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
        { key: 'footer_copyright', value: '© 2026 Rafah Garden. All rights reserved.', type: 'text', group: 'footer', label: 'Copyright Text' },
        
        // Shop Page
        { key: 'shop_hero_heading_prefix', value: 'Dragon', type: 'text', group: 'shop', label: 'Hero Heading Prefix' },
        { key: 'shop_default_category_index', value: '0', type: 'text', group: 'shop', label: 'Default Active Category (Index)' },
        { key: 'shop_mobile_title_color', value: '#6C6D71', type: 'text', group: 'shop', label: 'Mobile Title Color' },
        { key: 'shop_mobile_bottom_text_color', value: '#787877', type: 'text', group: 'shop', label: 'Mobile Bottom Text Color' },
        { key: 'shop_mobile_heading', value: 'Pure\nBotanical\nRefreshment', type: 'text', group: 'shop', label: 'Mobile Bottom Heading' },
        { key: 'shop_mobile_description', value: 'This is a sample product details must be enter here to show the ui ux design minimal stage', type: 'text', group: 'shop', label: 'Mobile Bottom Description' }
      ]);
    }

    return NextResponse.json({ 
      success: true, 
      message: "Database seeded successfully with refactored product structure",
      categories: `${seededCategories.length} collections added`,
      products: "Successfully linked standalone products",
      content: contentResult.length > 0 ? `${contentResult.length} settings added` : "Skipped (already exists)"
    });
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
