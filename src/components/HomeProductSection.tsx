"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "./ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HomeProductSectionProps {
  categories: any[];
  categoryIndex: number;
}

export function HomeProductSection({ categories, categoryIndex }: HomeProductSectionProps) {
  const category = categories[categoryIndex] || categories[0];
  const [scrollIndex, setScrollIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [config, setConfig] = useState({ items: 2, gap: 16 });

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const updateConfig = () => {
      if (window.innerWidth >= 1024) {
        setConfig({ items: 3, gap: 32 }); // lg:gap-8 is 32px
      } else if (window.innerWidth >= 768) {
        setConfig({ items: 2, gap: 24 }); // md:gap-6 is 24px
      } else {
        setConfig({ items: 2, gap: 16 }); // gap-4 is 16px
      }
    };
    updateConfig();
    window.addEventListener('resize', updateConfig);
    return () => window.removeEventListener('resize', updateConfig);
  }, []);

  if (!category) return null;

  const products = category.products || [];
  const maxIndex = Math.max(0, products.length - config.items);

  const handleNext = () => {
    setScrollIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const handlePrev = () => {
    setScrollIndex((prev) => Math.max(prev - 1, 0));
  };

  // Reset scroll position when category changes
  useEffect(() => {
    setScrollIndex(0);
  }, [categoryIndex, config.items]);

  return (
    <section className="bg-[#f1f1f2] pt-8 pb-12 px-6 md:px-12 lg:px-24 relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto relative z-10">
        
        {/* Header with Navigation Arrows on the right */}
        <div className="flex items-center justify-end mb-6 md:mb-10">
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrev}
              disabled={scrollIndex === 0}
              className={`w-10 h-10 md:w-12 md:h-12 rounded-full border border-black/10 flex items-center justify-center transition-all ${
                scrollIndex === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-white hover:shadow-md active:scale-90 bg-[#ebebeb]"
              }`}
            >
              <ChevronLeft size={isDesktop ? 20 : 16} className="text-[#5d5f61]" />
            </button>
            <button
              onClick={handleNext}
              disabled={scrollIndex === maxIndex}
              className={`w-10 h-10 md:w-12 md:h-12 rounded-full border border-black/10 flex items-center justify-center transition-all ${
                scrollIndex === maxIndex ? "opacity-30 cursor-not-allowed" : "hover:bg-white hover:shadow-md active:scale-90 bg-[#ebebeb]"
              }`}
            >
              <ChevronRight size={isDesktop ? 20 : 16} className="text-[#5d5f61]" />
            </button>
          </div>
        </div>

        {/* Carousel Track with safe-zone padding to prevent shadow/scaling clipping */}
        <div className="relative overflow-hidden -mx-4 px-4 py-8 -my-8">
          <motion.div
            animate={{ x: `calc(-${scrollIndex * (100 / config.items)}% - ${scrollIndex * (config.gap / config.items)}px)` }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="flex gap-4 md:gap-6 lg:gap-8 w-full"
          >
            {products.map((product: any) => (
              <div 
                key={product.id || product._id} 
                className="flex-shrink-0 w-[calc(50%-8px)] md:w-[calc(50%-12px)] lg:w-[calc(33.3333%-21.33px)]"
              >
                <ProductCard
                  product={product}
                  accentColor={category.color}
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
