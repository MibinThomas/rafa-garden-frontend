"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CategoryHero } from "@/components/CategoryHero";
import { CategoryDetail } from "@/components/CategoryDetail";
import { HomeProductSection } from "@/components/HomeProductSection";
import { CuratedSeriesSection } from "@/components/CuratedSeriesSection";
import { useHeaderColor } from "@/lib/HeaderColorContext";
import { CATEGORIES as STATIC_CATEGORIES } from "@/lib/data";

export default function Home() {
  const [categories, setCategories] = useState<any[]>(STATIC_CATEGORIES);
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
      const res = await fetch("/api/categories", { 
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setCategories(data);
          // Sync header color with initial active category
          setHeaderColor(data[activeCollectionIndex]?.color || data[0].color);
        }
      }
    } catch (err: any) {
      // Only log if it's a persistent issue, not a transient network interrupt during reload
      if (err.name !== 'TypeError' || !err.message.includes('fetch')) {
        console.error("Failed to fetch live categories:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    // Refresh data every 30 seconds to keep homepage in sync
    const interval = setInterval(fetchCategories, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleCategorySelect = (index: number) => {
    setActiveCollectionIndex(index);
    // Explicitly set header color when user selects a category from the navigator
    if (categories[index]) {
      setHeaderColor(categories[index].color);
    }
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
        <div className="h-[calc(100dvh-70px)] md:h-[calc(100vh-100px)] flex flex-col pt-0 md:pt-4 overflow-hidden">
          <CategoryHero 
            categories={categories}
            onActiveChange={setActiveMobileCatIndex}
          />
        </div>

        {/* Dynamic Product Grid Section Below Hero - Now showing all categories stacked */}
        <div className="w-full relative z-10 bg-[#f1f1f2]">
          {categories.map((cat, idx) => (
            <div key={cat.id || cat._id || idx} className="mb-16 md:mb-24 last:mb-0">
              <CuratedSeriesSection 
                categoryTitle={cat.title || "Collection"} 
              />
              <HomeProductSection 
                categories={categories}
                categoryIndex={idx} 
              />
            </div>
          ))}
        </div>
      </motion.div>
    </main>
  );
}
