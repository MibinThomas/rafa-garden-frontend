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
    <section className="bg-[#e6e7e8] py-24 sm:py-32 px-6 md:px-12 relative overflow-hidden min-h-[80vh]">
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
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-20 gap-8">
          <motion.div
            key={category.id + "-title"}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
          >
            <span 
              className="text-[10px] font-bold uppercase tracking-[0.5em] mb-4 block"
              style={{ color: category.color }}
            >
              Curated Selection
            </span>
            <h2 className="text-4xl sm:text-6xl font-black font-avant-garde tracking-tighter leading-none">
              Explore {category.title} <span className="italic opacity-30">Series.</span>
            </h2>
          </motion.div>

          <motion.div
            key={category.id + "-desc"}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="max-w-md"
          >
            <p className="text-gray-500 font-medium font-avant-garde leading-relaxed mb-6 opacity-60">
              {category.subtitle}. Hand-harvested from our heritage sanctuaries, each product represents the pinnacle of botanical purity and craftsmanship.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-bold font-avant-garde uppercase tracking-[0.2em]" style={{ color: category.color }}>
              Shop Full Collection <ArrowRight size={14} strokeWidth={3} />
            </div>
          </motion.div>
        </div>

        {/* Dynamic Product Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={category.id + "-grid"}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10"
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
