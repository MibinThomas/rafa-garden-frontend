"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CATEGORIES } from "@/lib/data";
import { ProductCard } from "./ProductCard";
import { ArrowRight } from "lucide-react";

interface HomeProductSectionProps {
  categoryIndex: number;
}

export function HomeProductSection({ categoryIndex }: HomeProductSectionProps) {
  const category = CATEGORIES[categoryIndex];

  if (!category) return null;

  return (
    <section className="bg-[#e6e7e8] py-24 sm:py-32 px-0 md:px-12 relative overflow-hidden min-h-[80vh]">
      {/* Dynamic Background Accent */}
      <motion.div 
        key={category.id + "-accent"}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.03, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 1 }}
        className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 text-[40vw] font-black pointer-events-none select-none"
        style={{ color: category.color }}
      >
        {category.title.toUpperCase()}
      </motion.div>

      <div className="max-w-[1600px] mx-auto relative z-10">
        {/* Dynamic Product Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={category.id + "-grid"}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 lg:gap-10"
          >
            {category.products.slice(0, 4).map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                accentColor={category.color} 
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
