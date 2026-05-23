import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import SiteContent from "@/models/SiteContent";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const homeContent = [
      // Trust Badges
      { key: "home.trust_1_icon", value: "", type: "image", group: "home", label: "Badge 1 Icon" },
      { key: "home.trust_1_title", value: "Delivery", type: "text", group: "home", label: "Badge 1 Title", maxLength: 20 },
      { key: "home.trust_1_subtitle", value: "Available", type: "text", group: "home", label: "Badge 1 Subtitle", maxLength: 20 },
      { key: "home.trust_2_icon", value: "", type: "image", group: "home", label: "Badge 2 Icon" },
      { key: "home.trust_2_title", value: "99 % Customer", type: "text", group: "home", label: "Badge 2 Title", maxLength: 20 },
      { key: "home.trust_2_subtitle", value: "Feedbacks", type: "text", group: "home", label: "Badge 2 Subtitle", maxLength: 20 },
      { key: "home.trust_3_icon", value: "", type: "image", group: "home", label: "Badge 3 Icon" },
      { key: "home.trust_3_title", value: "Payment", type: "text", group: "home", label: "Badge 3 Title", maxLength: 20 },
      { key: "home.trust_3_subtitle", value: "Secure System", type: "text", group: "home", label: "Badge 3 Subtitle", maxLength: 20 },
      { key: "home.trust_4_icon", value: "", type: "image", group: "home", label: "Badge 4 Icon" },
      { key: "home.trust_4_title", value: "Only Best", type: "text", group: "home", label: "Badge 4 Title", maxLength: 20 },
      { key: "home.trust_4_subtitle", value: "Brands", type: "text", group: "home", label: "Badge 4 Subtitle", maxLength: 20 },

      // Curated Series
      { key: "home.curated_badge_label", value: "Curated Selection", type: "text", group: "home", label: "Curated Section Badge", maxLength: 30 },
      { key: "home.curated_heading_prefix", value: "Explore", type: "text", group: "home", label: "Curated Heading Prefix", maxLength: 20 },
      { key: "home.curated_heading_suffix", value: "Series.", type: "text", group: "home", label: "Curated Heading Suffix", maxLength: 20 },

      // Featured Carousel
      { key: "home.carousel_1_image", value: "", type: "image", group: "home", label: "Carousel Slide 1 Image" },
      { key: "home.carousel_1_title", value: "", type: "text", group: "home", label: "Carousel Slide 1 Title" },
      { key: "home.carousel_1_subtitle", value: "", type: "text", group: "home", label: "Carousel Slide 1 Subtitle" },
      { key: "home.carousel_2_image", value: "", type: "image", group: "home", label: "Carousel Slide 2 Image" },
      { key: "home.carousel_2_title", value: "", type: "text", group: "home", label: "Carousel Slide 2 Title" },
      { key: "home.carousel_2_subtitle", value: "", type: "text", group: "home", label: "Carousel Slide 2 Subtitle" },
      { key: "home.carousel_3_image", value: "", type: "image", group: "home", label: "Carousel Slide 3 Image" },
      { key: "home.carousel_3_title", value: "", type: "text", group: "home", label: "Carousel Slide 3 Title" },
      { key: "home.carousel_3_subtitle", value: "", type: "text", group: "home", label: "Carousel Slide 3 Subtitle" },
      { key: "home.carousel_4_image", value: "", type: "image", group: "home", label: "Carousel Slide 4 Image" },
      { key: "home.carousel_4_title", value: "", type: "text", group: "home", label: "Carousel Slide 4 Title" },
      { key: "home.carousel_4_subtitle", value: "", type: "text", group: "home", label: "Carousel Slide 4 Subtitle" },
      
      { key: "home.carousel_footer_text", value: "This is a sample product details must be enter here to show the ui ux design minimal stage", type: "text", group: "home", label: "Carousel Footer Description" },

      // Hero Section
      { key: "home.hero_mobile_prefix", value: "Collection", type: "text", group: "home", label: "Hero Mobile Prefix", maxLength: 15 },
      { key: "home.hero_explore_btn", value: "Explore", type: "text", group: "home", label: "Mobile Explore Button", maxLength: 15 },
      { key: "home.hero_view_more_btn", value: "View More", type: "text", group: "home", label: "Desktop View More Button", maxLength: 15 },
      { key: "home.hero_buy_now_btn", value: "Buy Now", type: "text", group: "home", label: "Desktop Buy Now Button", maxLength: 15 },
      { key: "home.hero_default_subtitle", value: "Pure Botanical Refreshment", type: "text", group: "home", label: "Hero Default Subtitle", maxLength: 40 },
      { key: "home.hero_default_desc", value: "Handcrafted with botanical integrity to provide a sensory experience like no other.", type: "text", group: "home", label: "Hero Default Description" },
    ];

    for (const item of homeContent) {
      await SiteContent.findOneAndUpdate(
        { key: item.key },
        item,
        { upsert: true, new: true }
      );
    }

    return NextResponse.json({ success: true, message: "Home page CMS initialized." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
