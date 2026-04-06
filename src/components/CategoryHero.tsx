"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useHeaderColor } from "@/lib/HeaderColorContext";

export const CATEGORIES = [
  {
    id: "01",
    title: "Crush",
    subtitle: "Pure Botanical Refreshment",
    image: "/images/hero/crush_bottle.webp",
    color: "#c81c6a", // Updated Olive Green
  },
  {
    id: "02",
    title: "Jams",
    subtitle: "Deliciously Thick & Natural",
    image: "/images/hero/jam_premium.png",
    color: "#9a0c52", // Updated Maroon/Dark Berry
  },
  {
    id: "03",
    title: "Fruits",
    subtitle: "Fresh From Our Gardens",
    image: "/images/hero/fresh fruits.png",
    color: "#bbbdbf", // Updated Light Gray/Silver
  },
  {
    id: "04",
    title: "Plants",
    subtitle: "Grow Your Own Heritage",
    image: "/images/hero/plants_premium.png",
    color: "#7fa23f", // Updated Pink/Fuchsia
  },
];

interface CategoryHeroProps {
  onSelect: (index: number) => void;
}

export function CategoryHero({ onSelect }: CategoryHeroProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const { headerColor, setHeaderColor } = useHeaderColor();

  useEffect(() => {
    setIsMounted(true);
    setHoveredIndex(3); // Default to Plants (index 3) after mount
  }, []);

  useEffect(() => {
    if (isMounted && hoveredIndex !== null) {
      setHeaderColor(CATEGORIES[hoveredIndex].color);
    }
  }, [hoveredIndex, setHeaderColor, isMounted]);

  if (!isMounted) return null; // Avoid hydration mismatch

  return (
    <section className="relative w-full flex-1 px-4 pt-[10px] pb-[10px] md:px-12 flex flex-col font-sans overflow-hidden">
      <motion.div
        animate={{ backgroundColor: "#f1f1f1" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full flex-1 max-w-[1600px] mx-auto overflow-hidden rounded-[2.5rem] md:rounded-[4rem] shadow-[0_40px_100px_rgba(0,0,0,0.1)] flex flex-col md:flex-row relative"
      >
        {CATEGORIES.map((cat, index) => (
          <motion.div
            key={cat.id}
            onMouseEnter={() => setHoveredIndex(index)}
            className="relative h-full flex-1 flex flex-col cursor-pointer border-r border-black/5 last:border-r-0 overflow-hidden group bg-[#f1f1f1]"
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
            <div className={`relative z-20 w-full px-8 md:px-14 flex flex-col h-full py-12 md:py-20`}>

              {/* Numbering - Moves up/fades on hover */}
              <motion.div
                className="mb-8 block"
                initial={false}
                animate={{
                  opacity: hoveredIndex === index ? 0 : 1,
                  y: hoveredIndex === index ? -20 : 0,
                  color: cat.color,
                }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
              >
                <span className="text-4xl md:text-5xl font-bold tracking-tighter">{cat.id}</span>
              </motion.div>

              {/* Middle/Bottom Section: Text & Button */}
              <motion.div
                className="mt-auto"
                animate={{
                  y: hoveredIndex === index ? 0 : -100, // Move down on hover
                  color: hoveredIndex === index ? "#ffffff" : "#000000",
                }}
                transition={{ type: "spring", stiffness: 150, damping: 22 }}
              >
                <div className="mb-8">
                  <motion.h2
                    className="text-2xl md:text-3xl font-bold mb-2 tracking-tight leading-tight"
                  >
                    {cat.title}
                  </motion.h2>
                  <motion.p
                    className={`text-sm md:text-base font-light tracking-wide ${hoveredIndex === index ? "opacity-80" : "opacity-40"}`}
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
                  className={`flex items-center gap-3 px-7 py-3 rounded-full border transition-all duration-300 group pointer-events-auto
                    ${hoveredIndex === index
                      ? "border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white hover:text-black"
                      : "border-black/10 text-black hover:bg-black hover:text-white"}
                  `}
                >
                  <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] translate-y-[1px]">View more</span>
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
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
                  className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none p-12 md:p-16"
                >
                  <div className="relative w-full h-full max-h-[50%] md:max-h-[60%] -translate-y-12">
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
