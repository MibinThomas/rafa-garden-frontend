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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const { headerColor, setHeaderColor } = useHeaderColor();

  useEffect(() => {
    // Fetch live categories
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
    setHoveredIndex(0); // Default to Crush (index 0) after mount
    if (onHover) onHover(0);
  }, []);

  useEffect(() => {
    if (isMounted && hoveredIndex !== null && categories[hoveredIndex]) {
      setHeaderColor(categories[hoveredIndex].color);
      if (onHover) onHover(hoveredIndex);
    }
  }, [hoveredIndex, setHeaderColor, isMounted, categories, onHover]);

  if (!isMounted) return null; // Avoid hydration mismatch

  return (
    <section className="relative w-full flex-1 px-4 pt-[10px] pb-[10px] md:px-12 flex flex-col font-sans overflow-hidden">
      <motion.div
        animate={{ backgroundColor: "#f1f1f1" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] as const }}
        className="w-full flex-1 max-w-[1600px] mx-auto overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.1)] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 relative"
      >
        {categories.map((cat, index) => (
          <motion.div
            key={cat.id}
            onMouseEnter={() => setHoveredIndex(index)}
            onClick={() => setHoveredIndex(index)} // Critical for mobile "highlight" on tap
            className="relative min-h-[22vh] sm:min-h-0 h-full flex flex-col cursor-pointer border-b sm:border-b-0 sm:border-r border-black/5 last:border-0 overflow-hidden group bg-[#f1f1f1]"
          >
            {/* Spring-Animated Background Fill */}
            <motion.div
              className="absolute inset-0 z-0 origin-top"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: hoveredIndex === index ? 1 : 0 }}
              transition={{
                type: "spring",
                stiffness: 150,
                damping: 25,
                mass: 1,
              }}
              style={{ backgroundColor: cat.color }}
            />

            {/* Content Container */}
            <div className="relative z-30 w-full px-6 sm:px-10 md:px-14 flex flex-col h-full py-6 sm:py-10 md:py-16 mt-auto sm:mt-0">

              {/* Numbering - Moves up/fades on hover */}
              <motion.div
                className="mb-4 sm:mb-6 md:mb-8 block"
                initial={false}
                animate={{
                  opacity: 1,
                  y: hoveredIndex === index ? -15 : 0,
                  color: cat.color,
                }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
              >
                <span className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter opacity-70">{cat.id}</span>
              </motion.div>

              {/* Middle/Bottom Section: Text & Button */}
              <motion.div
                className="mt-auto relative z-40"
                animate={{
                  y: hoveredIndex === index ? 0 : -20, // Tighter offset for mobile
                  color: hoveredIndex === index ? "#ffffff" : "#000000",
                }}
                transition={{ type: "spring", stiffness: 150, damping: 22 }}
              >
                <div className="mb-4 sm:mb-6 md:mb-8">
                  <motion.h2
                    className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 tracking-tight leading-tight font-[family-name:var(--font-avant-garde)]"
                  >
                    {cat.title}
                  </motion.h2>
                  <motion.p
                    className={`text-[0.7rem] sm:text-sm md:text-base font-light tracking-wide ${hoveredIndex === index ? "opacity-80" : "opacity-40"}`}
                  >
                    {cat.subtitle}
                  </motion.p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(index);
                  }}
                  className={`flex items-center gap-2 sm:gap-3 px-5 sm:px-7 py-2.5 sm:py-3 rounded-full border transition-all duration-300 group pointer-events-auto
                    ${hoveredIndex === index
                      ? "border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white hover:text-black"
                      : "border-black/10 text-black hover:bg-black hover:text-white"}
                  `}
                >
                  <span className="text-[0.6rem] sm:text-[0.65rem] font-bold uppercase tracking-[0.2em] translate-y-[1px]">View more</span>
                  <ArrowRight size={14} className="sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </motion.button>
              </motion.div>
            </div>

            {/* Product Image Overlay - Centered with Spring Entrance */}
            <AnimatePresence>
              {hoveredIndex === index && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5, y: 50 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                    mass: 0.8,
                  }}
                  className="absolute inset-y-0 right-0 w-[60%] sm:inset-0 sm:w-full flex items-center justify-end sm:justify-center z-10 pointer-events-none pr-4 sm:pr-12 md:p-16"
                >
                  <div className="relative w-full h-full max-h-[85%] sm:max-h-[50%] md:max-h-[60%] translate-x-4 sm:translate-x-0 -translate-y-2 sm:-translate-y-12">
                    <Image
                      src={cat.image}
                      alt={cat.title}
                      fill
                      className="object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.4)]"
                      priority
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
