"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CategoryHero } from "@/components/CategoryHero";
import { CategoryDetail } from "@/components/CategoryDetail";
import { HomeProductSection } from "@/components/HomeProductSection";
import { CuratedSeriesSection } from "@/components/CuratedSeriesSection";
import { FeaturedCarousel } from "@/components/FeaturedCarousel";
import { TrustBadges } from "@/components/TrustBadges";
import { Testimonials } from "@/components/Testimonials";
import { useHeaderColor } from "@/lib/HeaderColorContext";
import { CATEGORIES as STATIC_CATEGORIES } from "@/lib/data";

export default function Home() {
  const [categories, setCategories] = useState<any[]>(STATIC_CATEGORIES);
  const [homeContent, setHomeContent] = useState<Record<string, string>>({});
  const [homepageConfig, setHomepageConfig] = useState<any>(null);
  const [activeCollectionIndex, setActiveCollectionIndex] = useState(0);
  const [activeMobileCatIndex, setActiveMobileCatIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const { setHeaderColor, setIsImmersive } = useHeaderColor();

  useEffect(() => {
    setIsImmersive(false);
    document.body.style.overflow = "auto";
  }, [setIsImmersive]);

  const fetchCategories = async () => {
    try {
      const [catRes, contentRes, homeConfigRes] = await Promise.all([
        fetch("/api/categories", { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } }),
        fetch("/api/content?group=home", { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } }),
        fetch("/api/homepage", { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } })
      ]);

      if (homeConfigRes.ok) {
        const homeConfigData = await homeConfigRes.json();
        setHomepageConfig(homeConfigData);
        if (homeConfigData.categories && homeConfigData.categories.length > 0) {
          const enabledCats = homeConfigData.categories
            .filter((c: any) => c.enabled !== false)
            .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
          setCategories(enabledCats);
          setHeaderColor(enabledCats[activeCollectionIndex]?.color || enabledCats[0]?.color);
        }
      }

      if (contentRes.ok) {
        const contentData = await contentRes.json();
        const contentMap = contentData.reduce((acc: any, item: any) => {
          acc[item.key] = item.value;
          return acc;
        }, {});
        setHomeContent(contentMap);
      }

      if (!homeConfigRes.ok && catRes.ok) {
        const data = await catRes.json();
        if (data && data.length > 0) {
          setCategories(data);
          setHeaderColor(data[activeCollectionIndex]?.color || data[0].color);
        }
      }
    } catch (err: any) {
      if (err.name !== 'TypeError' || !err.message.includes('fetch')) {
        console.error("Failed to fetch live categories:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    const interval = setInterval(fetchCategories, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleCategorySelect = (index: number) => {
    setActiveCollectionIndex(index);
    if (categories[index]) {
      setHeaderColor(categories[index].color);
    }
  };

  const toTitleCase = (str: string) => {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
  };

  const formatText = (text: string) => {
    if (homepageConfig?.settings?.titleCaseFormat && text) {
      return toTitleCase(text);
    }
    return text;
  };

  const getSpacingClass = (sectionName: string) => {
    const spacing = homepageConfig?.settings?.sectionSpacing || "normal";
    if (spacing === "compact") {
      if (sectionName === "series") return "pt-6 pb-1 px-6 md:px-12 lg:px-24";
      if (sectionName === "products") return "pt-4 pb-6 px-6 md:px-12 lg:px-24";
      if (sectionName === "badges") return "py-4 md:py-6 lg:py-8";
    }
    if (spacing === "spacious") {
      if (sectionName === "series") return "pt-20 pb-4 px-6 md:px-12 lg:px-24";
      if (sectionName === "products") return "pt-12 pb-20 px-6 md:px-12 lg:px-24";
      if (sectionName === "badges") return "py-12 md:py-16 lg:py-24";
    }
    return ""; // Standard values inside components
  };

  return (
    <main className="relative flex-1 flex flex-col font-sans bg-[#f1f1f2]">
      <motion.div
        key="hero-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
        className="w-full flex-1 flex flex-col h-full"
      >
        {/* Full Screen Hero Section */}
        <div className="h-auto lg:h-[calc(100vh-90px)] flex flex-col pt-0 lg:pt-1 lg:overflow-hidden">
          <CategoryHero 
            categories={categories}
            onActiveChange={setActiveMobileCatIndex}
            content={homeContent}
          />
        </div>

        {/* Trust Badges Section */}
        <TrustBadges 
          content={homeContent} 
          features={homepageConfig?.features}
          className={getSpacingClass("badges")}
        />

        {/* Dynamic Product Grid Section Below Hero - stack based on CMS */}
        <div className="w-full relative z-10 bg-[#f1f1f2]">
          {homepageConfig?.series && homepageConfig.series.length > 0 ? (
            homepageConfig.series
              .filter((ser: any) => ser.enabled !== false)
              .map((ser: any, idx: number) => {
                // Robust category matching by id, _id, title/slug, or array index fallback
                const cat = categories.find((c: any) => 
                  c.id === ser.categoryId || 
                  c._id?.toString() === ser.categoryId ||
                  (c.title && ser.categoryId && (
                    c.title.toLowerCase().includes(ser.categoryId.toLowerCase()) ||
                    ser.categoryId.toLowerCase().includes(c.title.toLowerCase().split(' ')[0])
                  ))
                ) || categories[idx] || categories[0];

                if (!cat) return null;

                // Filter products based on CMS selected product IDs
                let filteredProducts: any[] = [];
                if (Array.isArray(ser.productIds) && ser.productIds.length > 0) {
                  filteredProducts = cat.products?.filter((p: any) => 
                    ser.productIds.includes(p.id) || ser.productIds.includes(p._id?.toString())
                  ) || [];
                }

                // If filtered products is empty or not matching, fallback to all category products
                const customCat = {
                  ...cat,
                  products: (filteredProducts && filteredProducts.length > 0) ? filteredProducts : (cat.products || [])
                };

                return (
                  <div key={ser.categoryId || idx} className="mb-0 last:mb-0">
                    <HomeProductSection 
                      categories={[customCat]}
                      categoryIndex={0}
                      categoryTitle={formatText(ser.heading || cat.title)}
                      cardsPerScreen={ser.cardsPerScreen}
                      showArrows={ser.showArrows}
                      className={getSpacingClass("products")}
                    />
                  </div>
                );
              })
          ) : (
            // Fallback rendering
            categories.map((cat, idx) => (
              <div key={cat.id || cat._id || idx} className="mb-0 last:mb-0">
                <HomeProductSection 
                  categories={categories}
                  categoryIndex={idx} 
                  categoryTitle={cat.title}
                  className={getSpacingClass("products")}
                />
              </div>
            ))
          )}
        </div>

        {/* Testimonials Section */}
        <Testimonials content={homeContent} />

        {/* Featured Carousel above Footer */}
        <FeaturedCarousel categories={categories} content={homeContent} />
      </motion.div>
    </main>
  );
}
