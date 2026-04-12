"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useHeaderColor } from "@/lib/HeaderColorContext";
import { CATEGORIES } from "@/lib/data";

interface CategoryHeroProps {
  onSelect: (index: number) => void;
  onHover?: (index: number) => void;
}

export function CategoryHero({ onSelect, onHover }: CategoryHeroProps) {
  const [categories, setCategories] = useState<any[]>(CATEGORIES);
  const [hoveredIndex, setHoveredIndex] = useState<number>(0);
  const [isMounted, setIsMounted] = useState(false);
  const { setHeaderColor } = useHeaderColor();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
           const contentType = res.headers.get("content-type");
           if (contentType && contentType.includes("application/json")) {
             const data = await res.json();
             if (data && data.length > 0) setCategories(data);
           }
        }
      } catch (e) {
        console.error("Live load failed:", e);
      }
    };
    fetchCategories();
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && categories[hoveredIndex]) {
      setHeaderColor(categories[hoveredIndex].color);
      if (onHover) onHover(hoveredIndex);
    }
  }, [hoveredIndex, setHeaderColor, isMounted, categories, onHover]);

  if (!isMounted) return null;

  const getBgColor = (index: number, isHovered: boolean) => {
    if (isHovered) return categories[index].color;
    const greys = ["#f1f1f2", "#e5e5e7", "#dbdbdd", "#d1d1d3"];
    return greys[index] || "#f1f1f2";
  };

  return (
    <section className="relative w-full flex-1 px-4 pt-2 pb-8 md:px-12 flex flex-col font-sans overflow-hidden bg-[#f1f1f2]">
      <motion.div
        className="w-full flex-1 max-w-[1700px] mx-auto overflow-hidden rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.08)] grid grid-cols-1 md:grid-cols-4 relative bg-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {categories.slice(0, 4).map((cat, index) => (
          <motion.div
            key={cat.id}
            onMouseEnter={() => setHoveredIndex(index)}
            onClick={() => onSelect(index)}
            className="relative h-full flex flex-col cursor-pointer overflow-hidden border-r border-black/5 last:border-none group min-h-[600px] md:min-h-[720px]"
            animate={{
              backgroundColor: getBgColor(index, hoveredIndex === index)
            }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Content Container */}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4 md:px-8 text-center py-10">
              
              {/* Product Image Space */}
              <div className="absolute top-[12%] w-full h-[32%] flex items-center justify-center pointer-events-none" style={{ zIndex: 20 }}>
                <motion.div
                  className="relative w-full h-full"
                  initial={false}
                  animate={{
                    opacity: hoveredIndex === index ? 1 : 0,
                    scale: hoveredIndex === index ? 1.2 : 0.8,
                    y: hoveredIndex === index ? 20 : 40 // Moves slightly down on hover to be closer to text
                  }}
                  transition={{ 
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1] as const
                  }}
                >
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    className="object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.3)]"
                    priority
                  />
                </motion.div>
              </div>

              {/* Main Content Group */}
              <motion.div 
                className="flex flex-col items-center w-full z-10"
                animate={{
                  y: hoveredIndex === index ? 70 : 0 // Reduced from 85 to close the gap with the image
                }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Background Number (Watermark) */}
                <motion.div 
                  className="bg-number !static !transform-none !mb-[-1.5rem] !leading-none pointer-events-none"
                  initial={false}
                  animate={{ 
                    color: hoveredIndex === index ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)",
                    scale: hoveredIndex === index ? 1.1 : 1,
                    y: hoveredIndex === index ? -10 : 0
                  }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  style={{ zIndex: 5 }}
                >
                  {cat.id}
                </motion.div>

                {/* Heading */}
                <motion.h2
                  className="text-4xl lg:text-[4.2rem] font-bold mb-1 tracking-tighter font-avant-garde leading-[1.1] z-30"
                  animate={{
                    color: hoveredIndex === index ? "#ffffff" : "#6f7074"
                  }}
                  transition={{ duration: 0.4 }}
                >
                  {cat.title}
                </motion.h2>
                
                {/* Subtitle */}
                <motion.p
                  className="text-[0.6rem] md:text-[0.65rem] font-bold uppercase tracking-[0.2em] mb-3 font-avant-garde z-30"
                  animate={{
                    color: hoveredIndex === index ? "rgba(255,255,255,0.8)" : "#666666"
                  }}
                >
                  Pure Botanical Refreshment
                </motion.p>
                
                {/* Description */}
                <motion.p
                  className="text-[0.65rem] md:text-[0.7rem] leading-relaxed font-avant-garde px-4 md:px-6 mb-6 md:mb-8 max-w-[240px] z-30"
                  animate={{
                    color: hoveredIndex === index ? "rgba(255,255,255,0.6)" : "#999999"
                  }}
                >
                  This is a sample product details must be enter here to show the ui ux design minimal stage
                </motion.p>

                {/* Action Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center justify-between w-full max-w-[170px] md:max-w-[180px] px-6 md:px-8 py-3 rounded-full border transition-all duration-300 font-avant-garde text-[0.7rem] md:text-[0.75rem] font-medium tracking-tight z-30
                    ${hoveredIndex === index
                      ? "border-white/40 text-white bg-transparent hover:bg-white/10"
                      : "border-black/10 text-[#6f7074] hover:bg-black/5"}
                  `}
                >
                  <span>{hoveredIndex === index ? "Buy Now" : "View More"}</span>
                  <ArrowRight size={16} strokeWidth={1.5} className="ml-2" />
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
