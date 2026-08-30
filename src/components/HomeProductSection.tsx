"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ProductCard } from "./ProductCard";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface HomeProductSectionProps {
  categories: any[];
  categoryIndex: number;
  cardsPerScreen?: number;
  showArrows?: boolean;
  className?: string;
  categoryTitle?: string;
}

export function HomeProductSection({ 
  categories, 
  categoryIndex, 
  cardsPerScreen, 
  showArrows = true, 
  className,
  categoryTitle
}: HomeProductSectionProps) {
  const category = categories[categoryIndex] || categories[0];
  const [scrollIndex, setScrollIndex] = useState(0);
  const [config, setConfig] = useState({ items: 2, gap: 16 });
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateConfig = () => {
      if (window.innerWidth >= 1440) {
        setConfig({ items: cardsPerScreen || 5, gap: 20 });
      } else if (window.innerWidth >= 1025) {
        setConfig({ items: cardsPerScreen ? Math.min(cardsPerScreen, 4) : 4, gap: 16 });
      } else if (window.innerWidth >= 768) {
        setConfig({ items: cardsPerScreen ? Math.min(cardsPerScreen, 3) : 3, gap: 12 });
      } else {
        setConfig({ items: 2, gap: 8 });
      }
    };
    updateConfig();
    window.addEventListener('resize', updateConfig);
    return () => window.removeEventListener('resize', updateConfig);
  }, [cardsPerScreen]);

  if (!category) return null;

  const products = category.products || [];
  const maxIndex = Math.max(0, products.length - config.items);
  const displayTitle = categoryTitle || category.title || "Products";

  const handleNext = () => {
    setScrollIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setScrollIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  // Reset scroll position when category changes
  useEffect(() => {
    setScrollIndex(0);
  }, [categoryIndex, config.items]);

  // Auto-scroll carousel every 3 seconds (3000ms)
  useEffect(() => {
    if (products.length <= config.items || isPaused) return;

    const interval = setInterval(() => {
      setScrollIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, [products.length, maxIndex, config.items, isPaused]);

  // Touch Swipe Gesture Handlers for Mobile Slide Scrolling
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsPaused(false);
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (diff > 40) {
      // Swiped Left -> Next Slide
      handleNext();
    } else if (diff < -40) {
      // Swiped Right -> Prev Slide
      handlePrev();
    }
    setTouchStart(null);
  };

  return (
    <section 
      className={cn("bg-[#f1f1f2] pt-4 pb-10 px-4 sm:px-6 md:px-12 lg:px-24 relative overflow-hidden select-none", className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="max-w-[1600px] mx-auto relative z-10 flex flex-col">
        <div className="flex flex-col w-full">
          
          {/* Category Title & Arrow Nav Header */}
          <div className="flex flex-col mb-4">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-[#3a3a3c] font-brand-heading tracking-tight">
              {displayTitle}
            </h2>

            {/* Carousel Navigation Arrow Lines matching mockup */}
            <div className="flex items-center justify-between pt-2 mt-1 border-t border-gray-300">
              <button 
                type="button"
                onClick={handlePrev}
                aria-label="Previous Products"
                className="flex items-center gap-2 text-gray-500 hover:text-[#c81c6a] transition-colors group cursor-pointer"
              >
                <ArrowLeft size={18} className="stroke-[2.5] group-hover:-translate-x-1 transition-transform" />
                <span className="h-[1.5px] w-16 sm:w-32 bg-gray-400 group-hover:bg-[#c81c6a] transition-colors block" />
              </button>

              <button 
                type="button"
                onClick={handleNext}
                aria-label="Next Products"
                className="flex items-center gap-2 text-gray-500 hover:text-[#c81c6a] transition-colors group cursor-pointer"
              >
                <span className="h-[1.5px] w-16 sm:w-32 bg-gray-400 group-hover:bg-[#c81c6a] transition-colors block" />
                <ArrowRight size={18} className="stroke-[2.5] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Carousel Slide Track */}
          <div 
            ref={scrollContainerRef}
            className="relative overflow-hidden -mx-2 px-2 py-4 -my-4 touch-pan-x"
          >
            <motion.div
              animate={{ x: `calc(-${scrollIndex * (100 / config.items)}% - ${scrollIndex * (config.gap / config.items)}px)` }}
              transition={{ type: "spring", stiffness: 180, damping: 24 }}
              className="flex gap-2 md:gap-3 lg:gap-4 xl:gap-5 w-full justify-start cursor-grab active:cursor-grabbing"
            >
              {products.map((product: any) => (
                <div 
                  key={product.id || product._id} 
                  className="flex-shrink-0 w-[calc(50%-4px)] md:w-[calc(33.3333%-8px)] lg:w-[calc(25%-12px)] xl:w-[calc(20%-16px)]"
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
      </div>
    </section>
  );
}
