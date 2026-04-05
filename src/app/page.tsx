"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CategoryHero } from "@/components/CategoryHero";
import { CategoryDetail } from "@/components/CategoryDetail";
export default function Home() {
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number | null>(null);

  return (
    <main className="relative min-h-screen bg-black transition-colors duration-300 flex flex-col font-sans overflow-x-hidden">
      
      <AnimatePresence mode="wait">
        {selectedCategoryIndex === null ? (
          <motion.div
            key="hero"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            {/* The 4-Category Hero Redesign */}
            <CategoryHero onSelect={(index) => setSelectedCategoryIndex(index)} />
          </motion.div>
        ) : (
          <CategoryDetail 
            key="detail" 
            categoryIndex={selectedCategoryIndex} 
            onBack={() => setSelectedCategoryIndex(null)} 
          />
        )}
      </AnimatePresence>

    </main>
  );
}
