"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CategoryHero } from "@/components/CategoryHero";
import { CategoryDetail } from "@/components/CategoryDetail";
import { HomeProductSection } from "@/components/HomeProductSection";
import { useHeaderColor } from "@/lib/HeaderColorContext";

export default function Home() {
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number | null>(null);
  const [hoveredCategoryIndex, setHoveredCategoryIndex] = useState(0);
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
                onHover={(index) => setHoveredCategoryIndex(index)}
              />
            </div>

            {/* Dynamic Product Grid Section Below Hero */}
            <div className="w-full relative z-10 bg-[#e6e7e8]">
              <HomeProductSection categoryIndex={hoveredCategoryIndex} />
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
