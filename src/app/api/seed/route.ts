import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';
import Product from '@/models/Product';
import SiteContent from '@/models/SiteContent';
import Service from '@/models/Service';
import Project from '@/models/Project';
import GalleryItem from '@/models/GalleryItem';
import Testimonial from '@/models/Testimonial';
import Faq from '@/models/Faq';
import SeoSettings from '@/models/SeoSettings';
import User from '@/models/User';
import { CATEGORIES } from '@/lib/data';
import mongoose from 'mongoose';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const force = searchParams.get('force') === 'true';

    await dbConnect();

    // Seed default admin user in MongoDB
    const userCount = await User.countDocuments({});
    if (userCount === 0 || force) {
      await User.deleteMany({});
      await User.create({
        name: 'Super Admin',
        email: (process.env.ADMIN_EMAIL || 'admin@rafagarden.com').trim().toLowerCase(),
        password: (process.env.ADMIN_PASSWORD || 'Admin@1234').trim(),
        role: 'super-admin',
        active: true
      });
    }
    
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
        { key: 'global.whatsapp_order_number', value: '918550088485', type: 'text', group: 'global', label: 'WhatsApp Order Number' },
        
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

    // 4. Seed other CMS collections
    await Faq.deleteMany({});
    await Faq.insertMany([
      {
        question: "When will my botanical assets arrive?",
        answer: "Our products are harvested fresh to order. Standard shipping typically takes 3-5 business days within the region. You will receive a WhatsApp confirmation once your manifest is dispatched.",
        category: "Delivery",
        order: 1,
        isPublished: true
      },
      {
        question: "How should I care for my Rafah Garden harvests?",
        answer: "To maintain peak freshness, keep your botanical assets in a cool, dry sanctuary away from direct sunlight. For live plants, a specific care guide is included with your delivery.",
        category: "Care",
        order: 2,
        isPublished: true
      },
      {
        question: "Can I return a fresh harvest?",
        answer: "Due to the artisanal and perishable nature of our products, we only accept returns within 48 hours of delivery if the quality does not meet our heritage standards. Please contact our support collective for assistance.",
        category: "Returns",
        order: 3,
        isPublished: true
      },
      {
        question: "How do I confirm my order settlement?",
        answer: "All orders are finalized via WhatsApp. Once you place an order on the sanctuary website, our team will reach out to confirm availability and settlement details.",
        category: "Orders",
        order: 4,
        isPublished: true
      }
    ]);

    await Testimonial.deleteMany({});
    await Testimonial.insertMany([
      {
        author: "Amina Al-Mansoori",
        role: "Botanical Enthusiast",
        quote: "The quality of the pitaya is absolutely unmatched. It's a taste of pure heritage.",
        rating: 5,
        image: "/images/testimonials/avatar-1.webp",
        order: 1,
        isPublished: true
      },
      {
        author: "Marcus Chen",
        role: "Culinary Director",
        quote: "We source all our farm-to-table dragon fruits exclusively from Rafah. Phenomenal flavor profiles.",
        rating: 5,
        image: "/images/testimonials/avatar-2.webp",
        order: 2,
        isPublished: true
      }
    ]);

    await Service.deleteMany({});
    await Service.insertMany([
      {
        id: "fresh-harvests",
        title: "Heritage Harvests",
        description: "Freshly handpicked organic dragon fruits delivered directly from our soil to your sanctuary.",
        image: "/images/services/harvest.webp",
        icon: "Sprout",
        order: 1,
        isPublished: true
      },
      {
        id: "botanical-consultation",
        title: "Sanctuary Consulting",
        description: "Expert guidance on designing your own pitaya orchard and sustainable cultivation practices.",
        image: "/images/services/consulting.webp",
        icon: "Compass",
        order: 2,
        isPublished: true
      }
    ]);

    await Project.deleteMany({});
    await Project.insertMany([
      {
        id: "heritage-orchard",
        title: "The Heritage Orchard",
        subtitle: "A sustainable landscape restoration initiative",
        description: "Restoring soil fertility and establishing premium heritage pitaya cultivation.",
        content: "Detailed description of the botanical restoration project and sustainable organic farming.",
        mainImage: "/images/projects/orchard.webp",
        gallery: ["/images/projects/orchard-detail-1.webp", "/images/projects/orchard-detail-2.webp"],
        location: "Kasaragod, Kerala",
        status: "Active",
        order: 1,
        isPublished: true,
        metaTitle: "Heritage Orchard Restoration | Rafah Garden",
        metaDescription: "Explore our sustainable agricultural restoration and heritage pitaya orchard in Kasaragod."
      }
    ]);

    await GalleryItem.deleteMany({});
    await GalleryItem.insertMany([
      {
        title: "Morning Harvest",
        description: "Sunlight hitting the fresh morning harvest of red pitaya.",
        image: "/images/gallery/morning-harvest.webp",
        category: "Harvest",
        order: 1,
        isPublished: true
      },
      {
        title: "Sanctuary Gates",
        description: "The botanical entryway welcoming visitors to Rafah Garden.",
        image: "/images/gallery/sanctuary-gates.webp",
        category: "Sanctuary",
        order: 2,
        isPublished: true
      }
    ]);

    await SeoSettings.deleteMany({});
    await SeoSettings.insertMany([
      {
        page: "home",
        metaTitle: "Rafah Garden | Heritage Pitaya Sanctuary",
        metaDescription: "Experience nature's premium sweetness at our organic pitaya dragon fruit sanctuary.",
        keywords: "dragon fruit, organic pitaya, agricultural sanctuary, boutique farm, botanical refreshment",
        ogImage: "/images/og/home-og.jpg"
      },
      {
        page: "about",
        metaTitle: "The Heritage & Story | Rafah Garden",
        metaDescription: "Learn about the generations of passion and sustainable farming behind Rafah Garden.",
        keywords: "heritage, sustainable farming, organic cultivation, dragon fruit story",
        ogImage: "/images/og/about-og.jpg"
      },
      {
        page: "shop",
        metaTitle: "Shop Premium Botanical Assets | Rafah Garden",
        metaDescription: "Browse and order our fresh organic pitaya harvests, jams, and live plants online.",
        keywords: "buy dragon fruit, organic jams, live pitaya plants, storefront",
        ogImage: "/images/og/shop-og.jpg"
      },
      {
        page: "contact",
        metaTitle: "Connect With Our Sanctuary | Rafah Garden",
        metaDescription: "Reach out to the Rafah Garden collective for orders, consulting, or visitor tours.",
        keywords: "contact farm, Kasaragod farm tour, order help",
        ogImage: "/images/og/contact-og.jpg"
      },
      {
        page: "blog",
        metaTitle: "Sanctuary Stories & Updates | Rafah Garden",
        metaDescription: "Insights from the soil. Read our blog for agricultural updates, recipes, and botanical knowledge.",
        keywords: "gardening blog, dragon fruit recipes, organic farm updates",
        ogImage: "/images/og/blog-og.jpg"
      },
      {
        page: "profile",
        metaTitle: "Member Sanctuary Dashboard | Rafah Garden",
        metaDescription: "View your order status, track shipments, or get support from our help collective.",
        keywords: "customer profile, track order, help desk",
        ogImage: ""
      },
      {
        page: "checkout",
        metaTitle: "Confirm Botanical Settlement | Rafah Garden",
        metaDescription: "Verify your checkout details to reserve your freshly harvested organic pitaya.",
        keywords: "checkout, finalize order",
        ogImage: ""
      }
    ]);

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
