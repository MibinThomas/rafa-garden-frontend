"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CategoryHero } from "@/components/CategoryHero";
import { CategoryDetail } from "@/components/CategoryDetail";
import { HomeProductSection } from "@/components/HomeProductSection";
import { useHeaderColor } from "@/lib/HeaderColorContext";
import { CATEGORIES as STATIC_CATEGORIES } from "@/lib/data";

export default function Home() {
  const [categories, setCategories] = useState<any[]>(STATIC_CATEGORIES);
  const [activeCollectionIndex, setActiveCollectionIndex] = useState(0);
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
    } catch (err) {
      console.error("Failed to fetch live categories:", err);
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
    <main className="relative flex-1 flex flex-col font-sans bg-[#e6e7e8]">
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
          />
        </div>

        {/* Dynamic Product Grid Section Below Hero */}
        <div className="w-full relative z-10 bg-[#e6e7e8]">
          <HomeProductSection 
            categories={categories}
            categoryIndex={activeCollectionIndex} 
          />
        </div>

        {/* Desktop Horizontal Category Navigator */}
        <div className="hidden md:flex w-full bg-[#e6e7e8] py-16 items-center justify-center relative z-10 border-t border-[#333333]/5">
          <div className="flex gap-6 items-center">
            <span className="font-avant-garde font-bold text-[#333333] text-[0.65rem] tracking-[0.2em] uppercase mr-4">
              Select Collection:
            </span>
            {categories.slice(0, 4).map((cat, idx) => (
              <button
                key={cat.id || cat._id}
                onClick={() => handleCategorySelect(idx)}
                className="px-8 py-3 rounded-full border border-[#333333]/20 transition-all duration-500 font-avant-garde text-[0.7rem] font-bold tracking-[0.15em] uppercase whitespace-nowrap overflow-hidden relative group"
                style={{ color: activeCollectionIndex === idx ? cat.color : "#666666" }}
              >
                <span className="relative z-10">{cat.title}</span>
                <div 
                  className={`absolute inset-0 opacity-10 transition-opacity duration-500 ${activeCollectionIndex === idx ? 'opacity-10' : 'opacity-0'}`}
                  style={{ backgroundColor: cat.color }}
                />
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </main>
  );
}
