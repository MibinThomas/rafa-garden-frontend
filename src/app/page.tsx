"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CategoryHero } from "@/components/CategoryHero";
import { CategoryDetail } from "@/components/CategoryDetail";
import { useHeaderColor } from "@/lib/HeaderColorContext";

export default function Home() {
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number | null>(null);
  const { setIsImmersive } = useHeaderColor();

  useEffect(() => {
    setIsImmersive(selectedCategoryIndex !== null);
  }, [selectedCategoryIndex, setIsImmersive]);

  return (
    <main className="relative h-screen flex flex-col font-sans overflow-hidden">

      <AnimatePresence mode="popLayout">
        {selectedCategoryIndex === null ? (
          <motion.div
            key="hero"
            initial={{ x: "-20%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-20%", opacity: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex-1 flex flex-col"
          >
            {/* The 4-Category Hero Redesign */}
            <CategoryHero onSelect={(index) => setSelectedCategoryIndex(index)} />
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
