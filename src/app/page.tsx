"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CategoryHero } from "@/components/CategoryHero";
import { CategoryDetail } from "@/components/CategoryDetail";
import { HomeProductSection } from "@/components/HomeProductSection";
import { useHeaderColor } from "@/lib/HeaderColorContext";
import { CATEGORIES } from "@/lib/data";

export default function Home() {
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number | null>(null);
  const [activeCollectionIndex, setActiveCollectionIndex] = useState(0);
  const { setIsImmersive } = useHeaderColor();

  useEffect(() => {
    setIsImmersive(selectedCategoryIndex !== null);
    // When in detail view, prevent body scroll
    if (selectedCategoryIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [selectedCategoryIndex, setIsImmersive]);

  return (
    <main className="relative flex-1 flex flex-col font-sans bg-[#e6e7e8]">
      <AnimatePresence mode="popLayout">
        {selectedCategoryIndex === null ? (
          <motion.div
            key="hero-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ x: "-20%", opacity: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
            className="w-full flex-1 flex flex-col h-full"
          >
            {/* Full Screen Hero Section - Hard constrained to exactly fill the screen minus header */}
            <div className="h-[calc(100dvh-70px)] md:h-[calc(100vh-100px)] flex flex-col pt-0 md:pt-4 overflow-hidden">
              <CategoryHero 
                onSelect={(index) => setSelectedCategoryIndex(index)} 
              />
            </div>

            {/* Dynamic Product Grid Section Below Hero */}
            <div className="w-full relative z-10 bg-[#e6e7e8]">
              <HomeProductSection categoryIndex={activeCollectionIndex} />
            </div>

            {/* Desktop Horizontal Category Navigator */}
            <div className="hidden md:flex w-full bg-[#e6e7e8] py-16 items-center justify-center relative z-10 border-t border-[#333333]/5">
              <div className="flex gap-6 items-center">
                <span className="font-avant-garde font-bold text-[#333333] text-[0.65rem] tracking-[0.2em] uppercase mr-4">
                  Select Collection:
                </span>
                {CATEGORIES.map((cat, idx) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCollectionIndex(idx)}
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
        ) : (
          <CategoryDetail
            key="detail"
            categoryIndex={selectedCategoryIndex as number}
            onBack={() => setSelectedCategoryIndex(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
