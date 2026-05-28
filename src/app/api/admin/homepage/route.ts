import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";
import SiteContent from "@/models/SiteContent";
import Product from "@/models/Product";
import { verifyToken } from "@/lib/auth";

// Auth helper
async function checkAuth(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin-token")?.value;
    if (!token) return false;
    const verified = await verifyToken(token);
    return !!verified;
  } catch (error) {
    console.error("Auth check failed:", error);
    return false;
  }
}

// GET: Fetch current config (draft or published) along with categories
export async function GET(req: NextRequest) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    // Ensure Product model is registered
    const _ignore = Product.modelName;

    // Fetch live categories with populated products
    const categories = await Category.find({}).populate("products");
    
    // Fetch draft and published states
    const draftContent = await SiteContent.findOne({ key: "home.cms_draft_state" });
    const publishedContent = await SiteContent.findOne({ key: "home.cms_published_state" });

    let draft = null;
    let published = null;

    if (draftContent) {
      try {
        draft = JSON.parse(draftContent.value);
      } catch (e) {
        console.error("Failed to parse draft content");
      }
    }

    if (publishedContent) {
      try {
        published = JSON.parse(publishedContent.value);
      } catch (e) {
        console.error("Failed to parse published content");
      }
    }

    // Default configuration if neither exists
    const defaultData = await createDefaultConfig(categories);

    return NextResponse.json({
      categories,
      draft: draft || defaultData,
      published: published || defaultData,
      isDirty: !!draftContent
    });
  } catch (error: any) {
    console.error("Admin homepage GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Save Draft State
export async function PUT(req: NextRequest) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const config = await req.json();

    const result = await SiteContent.findOneAndUpdate(
      { key: "home.cms_draft_state" },
      {
        value: JSON.stringify(config),
        type: "json",
        group: "home",
        label: "Homepage CMS Draft State"
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, draft: config });
  } catch (error: any) {
    console.error("Admin homepage PUT error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Publish State (Saves to published_state, updates Categories and individual SiteContent records)
export async function POST(req: NextRequest) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const config = await req.json();

    // 1. Save Published State
    await SiteContent.findOneAndUpdate(
      { key: "home.cms_published_state" },
      {
        value: JSON.stringify(config),
        type: "json",
        group: "home",
        label: "Homepage CMS Published State"
      },
      { upsert: true }
    );

    // Keep draft in sync with published
    await SiteContent.findOneAndUpdate(
      { key: "home.cms_draft_state" },
      {
        value: JSON.stringify(config),
        type: "json",
        group: "home",
        label: "Homepage CMS Draft State"
      },
      { upsert: true }
    );

    // 2. Update Category records in Mongoose
    if (config.categories && Array.isArray(config.categories)) {
      for (const catConfig of config.categories) {
        // Find existing category by id or _id
        const findQuery = catConfig._id 
          ? { _id: catConfig._id } 
          : { id: catConfig.id };

        await Category.findOneAndUpdate(
          findQuery,
          {
            title: catConfig.title,
            subtitle: catConfig.subtitle,
            image: catConfig.image,
            color: catConfig.color,
            watermarkText: catConfig.watermarkText,
            ctaText: catConfig.ctaText,
            ctaLink: catConfig.ctaLink,
            enabled: catConfig.enabled !== false,
            order: typeof catConfig.order === "number" ? catConfig.order : 0,
            isDefault: catConfig.isDefault === true,
            mobileTitle: catConfig.mobileTitle || catConfig.title,
            mobileActiveDesc: catConfig.mobileActiveDesc || catConfig.subtitle,
            mobileHeroImage: catConfig.mobileHeroImage || catConfig.image
          },
          { upsert: true }
        );
      }
    }

    // 3. Write individual keys to SiteContent for compatibility with existing components
    
    // Feature Trust Badges
    if (config.features && Array.isArray(config.features)) {
      config.features.forEach(async (f: any, idx: number) => {
        const num = idx + 1;
        if (num <= 4) {
          await SiteContent.findOneAndUpdate(
            { key: `home.trust_${num}_icon` },
            { value: f.icon || "", type: "image", group: "home", label: `Badge ${num} Icon` },
            { upsert: true }
          );
          await SiteContent.findOneAndUpdate(
            { key: `home.trust_${num}_title` },
            { value: f.title || "", type: "text", group: "home", label: `Badge ${num} Title` },
            { upsert: true }
          );
          await SiteContent.findOneAndUpdate(
            { key: `home.trust_${num}_subtitle` },
            { value: f.subtitle || "", type: "text", group: "home", label: `Badge ${num} Subtitle` },
            { upsert: true }
          );
        }
      });
    }

    // Curated Badge and Heading
    if (config.series && Array.isArray(config.series)) {
      const firstSeries = config.series[0];
      if (firstSeries) {
        await SiteContent.findOneAndUpdate(
          { key: "home.curated_badge_label" },
          { value: firstSeries.badgeText || "Curated Selection", type: "text", group: "home", label: "Curated Section Badge" },
          { upsert: true }
        );
      }
    }

    // Spacer & Layout Global Settings (Title Case format, Spacing etc.)
    if (config.settings) {
      await SiteContent.findOneAndUpdate(
        { key: "home.title_case" },
        { value: config.settings.titleCaseFormat ? "true" : "false", type: "text", group: "home", label: "Title Case Format" },
        { upsert: true }
      );
      await SiteContent.findOneAndUpdate(
        { key: "home.spacing" },
        { value: config.settings.sectionSpacing || "normal", type: "text", group: "home", label: "Section Spacing" },
        { upsert: true }
      );
    }

    return NextResponse.json({ success: true, message: "Homepage configuration published live successfully!" });
  } catch (error: any) {
    console.error("Admin homepage POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Construct default initial configuration
async function createDefaultConfig(categories: any[]) {
  // Try to load basic SiteContent values if they exist
  const contents = await SiteContent.find({ group: "home" });
  const contentMap = contents.reduce((acc: any, item: any) => {
    acc[item.key] = item.value;
    return acc;
  }, {});

  const defaultCategories = categories.map((cat, idx) => ({
    _id: cat._id?.toString() || "",
    id: cat.id || `cat-${idx}`,
    title: cat.title || "",
    subtitle: cat.subtitle || "",
    image: cat.image || "",
    color: cat.color || "#c81c6a",
    watermarkText: cat.watermarkText || cat.title?.split(" ")[0]?.toUpperCase() || "HERITAGE",
    ctaText: cat.ctaText || "Buy Now",
    ctaLink: cat.ctaLink || `/shop?cat=${cat.title?.toLowerCase()}`,
    enabled: cat.enabled !== false,
    order: typeof cat.order === "number" ? cat.order : idx,
    isDefault: cat.isDefault || idx === 0,
    mobileActiveDesc: cat.mobileActiveDesc || cat.subtitle || "",
    mobileHeroImage: cat.mobileHeroImage || cat.image || "",
    mobileTitle: cat.mobileTitle || cat.title || ""
  }));

  const defaultFeatures = [
    {
      id: "trust_1",
      icon: contentMap["home.trust_1_icon"] || "",
      title: contentMap["home.trust_1_title"] || "Delivery",
      subtitle: contentMap["home.trust_1_subtitle"] || "Available",
      enabled: true,
      order: 0
    },
    {
      id: "trust_2",
      icon: contentMap["home.trust_2_icon"] || "",
      title: contentMap["home.trust_2_title"] || "99% Customer",
      subtitle: contentMap["home.trust_2_subtitle"] || "Feedbacks",
      enabled: true,
      order: 1
    },
    {
      id: "trust_3",
      icon: contentMap["home.trust_3_icon"] || "",
      title: contentMap["home.trust_3_title"] || "Payment",
      subtitle: contentMap["home.trust_3_subtitle"] || "Secure System",
      enabled: true,
      order: 2
    },
    {
      id: "trust_4",
      icon: contentMap["home.trust_4_icon"] || "",
      title: contentMap["home.trust_4_title"] || "Only Best",
      subtitle: contentMap["home.trust_4_subtitle"] || "Brands",
      enabled: true,
      order: 3
    }
  ];

  const defaultSeries = categories.map((cat, idx) => ({
    categoryId: cat.id || `cat-${idx}`,
    heading: `Explore ${cat.title || ""} Series`,
    badgeText: contentMap["home.curated_badge_label"] || "Curated Selection",
    productIds: cat.products?.map((p: any) => p.id || p._id?.toString()) || [],
    cardsPerScreen: 5,
    showArrows: true,
    enabled: true
  }));

  const activeCat = defaultCategories.find(c => c.isDefault) || defaultCategories[0];

  return {
    hero: {
      activeCategoryId: activeCat?.id || "01",
      image: activeCat?.image || "",
      title: activeCat?.title || "Crush",
      subtitle: activeCat?.subtitle || "Pure Botanical Refreshment",
      description: activeCat?.mobileActiveDesc || "Crafted from handpicked heritage ingredients.",
      ctaText: activeCat?.ctaText || "Buy Now",
      ctaLink: activeCat?.ctaLink || "/shop?cat=crush",
      color: activeCat?.color || "#c81c6a",
      enabled: true
    },
    categories: defaultCategories,
    features: defaultFeatures,
    series: defaultSeries,
    settings: {
      titleCaseFormat: contentMap["home.title_case"] === "true",
      sectionSpacing: contentMap["home.spacing"] || "normal"
    }
  };
}
