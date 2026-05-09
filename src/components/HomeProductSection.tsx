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

  if (!category) return null;

  const products = category.products || [];
  const [itemsPerPage, setItemsPerPage] = useState(1);

  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerPage(3);
      } else if (window.innerWidth >= 0) {
        setItemsPerPage(2);
      }
    };
    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  const maxIndex = Math.max(0, products.length - itemsPerPage);

  const handleNext = () => {
    setScrollIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const handlePrev = () => {
    setScrollIndex((prev) => Math.max(prev - 1, 0));
  };

  // Reset scroll position when category changes
  useEffect(() => {
    setScrollIndex(0);
  }, [categoryIndex, itemsPerPage]);

  return (
    <section className="bg-[#f1f1f2] pt-8 pb-8 px-6 md:px-12 lg:px-24 relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto relative z-10">
        
        {/* Header with Navigation Arrows on the right */}
        <div className="flex items-center justify-end mb-10">
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrev}
              disabled={scrollIndex === 0}
              className={`w-12 h-12 rounded-full border border-black/10 flex items-center justify-center transition-all ${
                scrollIndex === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-white hover:shadow-md active:scale-90"
              }`}
            >
              <ChevronLeft size={24} className="text-[#5d5f61]" />
            </button>
            <button
              onClick={handleNext}
              disabled={scrollIndex === maxIndex}
              className={`w-12 h-12 rounded-full border border-black/10 flex items-center justify-center transition-all ${
                scrollIndex === maxIndex ? "opacity-30 cursor-not-allowed" : "hover:bg-white hover:shadow-md active:scale-90"
              }`}
            >
              <ChevronRight size={24} className="text-[#5d5f61]" />
            </button>
          </div>
        </div>

        {/* Carousel Track */}
        <div className="relative overflow-hidden">
          <motion.div
            animate={{ x: `-${scrollIndex * (100 / itemsPerPage)}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="flex gap-4 md:gap-6 lg:gap-8"
          >
            {products.map((product: any) => (
              <div 
                key={product.id || product._id} 
                className="flex-shrink-0 w-[calc(50%-8px)] md:w-[calc(50%-12px)] lg:w-[calc(33.333%-21.33px)]"
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
