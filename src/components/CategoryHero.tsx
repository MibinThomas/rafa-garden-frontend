"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export const CATEGORIES = [
  {
    id: "01",
    title: "Crush",
    subtitle: "Pure Botanical Refreshment",
    image: "/images/hero/crush_bottle.png",
    color: "#7f8c42", // Olive Green from mockup
  },
  {
    id: "02",
    title: "Jams",
    subtitle: "Deliciously Thick & Natural",
    image: "/images/hero/jam_jar.png",
    color: "#8e448b", // Berry Purple from mockup
  },
  {
    id: "03",
    title: "Fruits",
    subtitle: "Fresh From Our Gardens",
    image: "/images/hero/tropical_fruits.png",
    color: "#b8860b", // Coffee/Gold from mockup
  },
  {
    id: "04",
    title: "Plants",
    subtitle: "Grow Your Own Heritage",
    image: "/images/hero/nursery_plants.png",
    color: "#d14d72", // Strawberry Pink from mockup
  },
];

export function CategoryHero({ onSelect }: { onSelect: (index: number) => void }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(3); // Default to last one as in mockup

  return (
    <section className="relative w-full h-[85vh] md:h-screen bg-[#f1f1f2] p-4 md:p-12 flex items-center justify-center font-sans">
      <div className="w-full h-full max-w-[1600px] overflow-hidden rounded-[2.5rem] md:rounded-[4rem] bg-white shadow-[0_40px_100px_rgba(0,0,0,0.1)] flex flex-col md:flex-row relative">
        {CATEGORIES.map((cat, index) => (
          <motion.div
            key={cat.id}
            onMouseEnter={() => setHoveredIndex(index)}
            onClick={() => onSelect(index)}
            className="relative h-full transition-all duration-700 ease-in-out flex flex-col cursor-pointer border-r border-black/5 last:border-r-0 overflow-hidden"
            animate={{
              flex: hoveredIndex === index ? 3 : 1,
              backgroundColor: hoveredIndex === index ? cat.color : "#ffffff",
            }}
            transition={{ type: "spring", stiffness: 200, damping: 30, mass: 1 }}
          >
            {/* Content Container */}
            <div className={`relative z-20 w-full px-8 md:px-14 flex flex-col h-full py-12 md:py-24 transition-colors duration-500 ${hoveredIndex === index ? "text-white" : "text-black"}`}>
              
              {/* Numbering at the top */}
              <motion.div 
                className="mb-8 block"
                initial={false}
                animate={{
                    color: hoveredIndex === index ? "rgba(255,255,255,0.4)" : cat.color,
                }}
              >
                <span className="text-4xl md:text-5xl font-bold tracking-tighter">{cat.id}</span>
              </motion.div>

              {/* Middle Section: Text */}
              <div className="mt-auto mb-10">
                <motion.h2 
                  className={`text-2xl md:text-4xl font-bold mb-3 tracking-tight leading-tight ${hoveredIndex === index ? "text-white" : "text-black"}`}
                  layout
                >
                  {cat.title}
                </motion.h2>
                <motion.p 
                  className={`text-sm md:text-base font-light tracking-wide ${hoveredIndex === index ? "text-white/70" : "text-black/40"}`}
                  layout
                >
                  {cat.subtitle}
                </motion.p>
              </div>

              {/* Bottom Section: Button */}
              <div className="mt-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-3 px-7 py-3 rounded-full border transition-all duration-500 group
                    ${hoveredIndex === index 
                      ? "border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white hover:text-black" 
                      : "border-black/10 text-black hover:bg-black hover:text-white"}
                  `}
                >
                  <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] translate-y-[1px]">View more</span>
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </motion.button>
              </div>
            </div>

            {/* Product Image Overlay - Appears only in the expanded state */}
            <AnimatePresence>
              {hoveredIndex === index && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.85, x: 20 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none p-12 md:p-20"
                >
                  <div className="relative w-full h-full max-h-[55%] md:max-h-[65%] mb-24 md:translate-x-16">
                    <Image
                      src={cat.image}
                      alt={cat.title}
                      fill
                      className="object-contain drop-shadow-[20px_40px_80px_rgba(0,0,0,0.3)]"
                      priority
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
