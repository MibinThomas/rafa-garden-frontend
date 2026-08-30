import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";
import SiteContent from "@/models/SiteContent";
import Product from "@/models/Product";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Ensure Product model is registered
    const _ignore = Product.modelName;

    // Fetch live categories with populated products
    const liveCategories = await Category.find({}).sort({ id: 1 }).populate("products");

    // Try to load published homepage config
    const publishedContent = await SiteContent.findOne({ key: "home.cms_published_state" });

    if (publishedContent) {
      try {
        const config = JSON.parse(publishedContent.value);
        
        // Merge with live categories
        if (config.categories && Array.isArray(config.categories)) {
          config.categories = config.categories.map((cat: any) => {
            const liveCat = liveCategories.find(
              (lc: any) => lc.id === cat.id || lc._id?.toString() === cat._id?.toString() || lc.title?.toLowerCase() === cat.title?.toLowerCase()
            );
            if (liveCat) {
              return {
                ...cat,
                products: liveCat.products || [],
                subtitle: liveCat.subtitle || cat.subtitle || "",
                description: liveCat.description || cat.description || "",
                mobileShortDesc: liveCat.mobileShortDesc || "",
                shortDescription: liveCat.mobileShortDesc || liveCat.description || "",
                mobileActiveDesc: liveCat.mobileActiveDesc || "",
                watermarkText: liveCat.watermarkText || cat.watermarkText || "",
                color: liveCat.color || cat.color,
                image: liveCat.image || cat.image,
                mobileHeroImage: liveCat.mobileHeroImage || liveCat.image || cat.image,
                bannerImage: liveCat.bannerImage || cat.bannerImage || "",
              };
            }
            return cat;
          });
        }
        
        return NextResponse.json(config);
      } catch (e) {
        console.error("Failed to parse published homepage content", e);
      }
    }

    // Default configuration fallback
    const contents = await SiteContent.find({ group: "home" });
    const contentMap = contents.reduce((acc: any, item: any) => {
      acc[item.key] = item.value;
      return acc;
    }, {});

    const defaultCategories = liveCategories.map((cat, idx) => ({
      _id: cat._id?.toString() || "",
      id: cat.id || `0${idx + 1}`,
      title: cat.title || "",
      subtitle: cat.subtitle || "",
      description: cat.description || "",
      shortDescription: cat.mobileShortDesc || cat.description || "",
      image: cat.image || "",
      color: cat.color || "#c81c6a",
      watermarkText: cat.watermarkText || cat.title?.split(" ")[0]?.toUpperCase() || "HERITAGE",
      ctaText: cat.ctaText || "Buy Now",
      ctaLink: cat.ctaLink || `/shop?cat=${cat.title?.toLowerCase()}`,
      enabled: cat.enabled !== false,
      order: typeof cat.order === "number" ? cat.order : idx,
      isDefault: cat.isDefault || idx === 0,
      mobileActiveDesc: cat.mobileActiveDesc || "",
      mobileShortDesc: cat.mobileShortDesc || "",
      mobileHeroImage: cat.mobileHeroImage || cat.image || "",
      mobileTitle: cat.mobileTitle || cat.title || "",
      products: cat.products || []
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

    const defaultSeries = liveCategories.map((cat, idx) => ({
      categoryId: cat.id || `0${idx + 1}`,
      heading: `Explore ${cat.title || ""} Series`,
      badgeText: contentMap["home.curated_badge_label"] || "Curated Selection",
      productIds: cat.products?.map((p: any) => p.id || p._id?.toString()) || [],
      cardsPerScreen: 5,
      showArrows: true,
      enabled: true
    }));

    const activeCat = defaultCategories.find(c => c.isDefault) || defaultCategories[0];

    const defaultConfig = {
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

    return NextResponse.json(defaultConfig);
  } catch (error: any) {
    console.error("Public homepage fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
