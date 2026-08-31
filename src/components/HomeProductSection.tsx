"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ProductCard } from "./ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
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
        setConfig({ items: cardsPerScreen ? Math.min(cardsPerScreen, 4) : 4, gap: 18 });
      } else if (window.innerWidth >= 768) {
        setConfig({ items: cardsPerScreen ? Math.min(cardsPerScreen, 3) : 3, gap: 16 });
      } else {
        setConfig({ items: 2, gap: 12 });
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

  // Auto-scroll carousel every 4 seconds (4000ms)
  useEffect(() => {
    if (products.length <= config.items || isPaused) return;

    const interval = setInterval(() => {
      setScrollIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4000);

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
      handleNext();
    } else if (diff < -40) {
      handlePrev();
    }
    setTouchStart(null);
  };

  return (
    <section 
      className={cn("bg-[#f4f4f6] pt-8 pb-14 px-4 sm:px-8 md:px-14 lg:px-24 relative overflow-hidden select-none", className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="max-w-[1600px] mx-auto relative z-10 flex flex-col">
        <div className="flex flex-col w-full">
          
          {/* Showcase Section Header matching Reference Image */}
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#1d1d1f] tracking-tight font-sans">
              {displayTitle}
            </h2>

            <Link 
              href={`/shop?cat=${category.title?.toLowerCase() || ''}`}
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#0066cc] hover:text-[#004499] hover:underline transition-all"
            >
              <span>View all {category.title?.toLowerCase() || 'collection'}</span>
              <ChevronRight size={14} className="stroke-[2.5]" />
            </Link>
          </div>

          {/* Carousel Slide Track with generous spacing */}
          <div 
            ref={scrollContainerRef}
            className="relative overflow-hidden -mx-2 px-2 py-6 -my-4 touch-pan-x"
          >
            <motion.div
              animate={{ x: `calc(-${scrollIndex * (100 / config.items)}% - ${scrollIndex * (config.gap / config.items)}px)` }}
              transition={{ type: "spring", stiffness: 180, damping: 24 }}
              className="flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-6 w-full justify-start cursor-grab active:cursor-grabbing"
            >
              {products.map((product: any) => (
                <div 
                  key={product.id || product._id} 
                  className="flex-shrink-0 w-[calc(50%-6px)] md:w-[calc(33.3333%-11px)] lg:w-[calc(25%-14px)] xl:w-[calc(20%-16px)]"
                >
                  <ProductCard
                    product={product}
                    accentColor={category.color || "#c81c6a"}
                  />
                </div>
              ))}
            </motion.div>
          </div>

          {/* Sleek Circular Navigation Control Arrows (matching reference footer pagination) */}
          {showArrows && products.length > config.items && (
            <div className="flex items-center justify-center gap-3 mt-6">
              <button 
                type="button"
                onClick={handlePrev}
                aria-label="Previous Showcase Cards"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#e8e8ed] hover:bg-[#dcdce2] active:scale-95 text-[#1d1d1f] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs"
              >
                <ChevronLeft size={20} className="stroke-[2]" />
              </button>

              <button 
                type="button"
                onClick={handleNext}
                aria-label="Next Showcase Cards"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#e8e8ed] hover:bg-[#dcdce2] active:scale-95 text-[#1d1d1f] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs"
              >
                <ChevronRight size={20} className="stroke-[2]" />
              </button>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}

