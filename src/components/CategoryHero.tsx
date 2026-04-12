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
    <section className="relative w-full flex-1 md:px-12 flex flex-col font-sans overflow-hidden bg-[#f1f1f2]">

      {/* Mobile-Only High-Fidelity Accordion (Directly from Mockup) */}
      <div className="flex md:hidden flex-col h-full w-full gap-2 p-2">
        {categories.slice(0, 4).map((cat, index) => {
          const isActive = hoveredIndex === index;
          return (
            <motion.div
              key={cat.id}
              onClick={() => setHoveredIndex(index)}
              className={`relative flex-1 min-h-0 w-full overflow-hidden cursor-pointer rounded-[10px]
                ${isActive ? "bg-[#e5e5e7]" : index % 2 === 0 ? "bg-[#f1f1f2]" : "bg-[#e5e5e7]"}
              `}
            >
              {/* Background Style for Active Card - Rounded Inset Panel */}
              <AnimatePresence mode="wait">
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 flex pl-3 pr-0 py-0 pointer-events-none"
                  >
                    <div className="w-[42%] h-full" />
                    <div
                      className="w-[58%] h-full rounded-l-[1.5rem] rounded-tr-[10px] rounded-br-[10px] transition-all duration-700 shadow-sm"
                      style={{ backgroundColor: cat.color }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Background Watermark Title (Active State Only) */}
              {isActive && (
                <div className="absolute inset-0 flex items-center justify-start pl-4 pointer-events-none select-none overflow-hidden h-full z-0">
                  <motion.h1 
                    layout
                    className="font-bold tracking-tighter transition-all duration-700 font-avant-garde leading-none uppercase text-[8.5rem] text-[#333333]/[0.08]"
                  >
                    {cat.id === "01" ? "Crush" : cat.id === "02" ? "Jam" : cat.id === "03" ? "Fruit" : "Plant"}
                  </motion.h1>
                </div>
              )}

              {/* Content Wrapper */}
              <div className="relative z-10 w-full h-full flex items-center px-4">

                {/* INACTIVE STATE CONTENT (Directly from Mockup) */}
                {!isActive && (
                  <div className="w-full h-full flex flex-col justify-between py-2 relative">
                    {/* Top Left Description */}
                    <div className="max-w-[120px]">
                      <p className="text-[0.4rem] leading-tight text-[#333333]/60 font-avant-garde line-clamp-2">
                        This is a sample product details must be enter here to show the ui ux design minimal stage
                      </p>
                    </div>

                    {/* Middle Left Button */}
                    <div className="my-auto">
                       <button className="flex items-center justify-between w-full max-w-[90px] px-3 py-1.5 rounded-full border border-[#333333]/30 text-[#333333] font-avant-garde text-[0.55rem] font-bold bg-transparent">
                        <span>View More</span>
                        <ArrowRight size={10} className="ml-1 opacity-60" />
                      </button>
                    </div>

                    {/* Bottom Content Group */}
                    <div className="flex items-end justify-between w-full">
                       <div className="flex flex-col gap-0.5">
                          <h3 className="text-[0.5rem] font-bold uppercase tracking-[0.15em] text-[#333333] font-avant-garde leading-tight">
                            Pure <br /> Botanical <br /> Refreshment
                          </h3>
                       </div>
                       <div className="max-w-[120px] pb-0.5">
                          <p className="text-[0.38rem] opacity-50 font-avant-garde leading-tight line-clamp-2">
                            This is a sample product details must be enter here to show the ui ux design minimal stage
                          </p>
                       </div>
                    </div>

                    {/* Redesign Watermark for Inactive State to be right-aligned and larger */}
                    <div className="absolute inset-y-0 right-[-10px] flex items-center justify-end z-0 pointer-events-none w-full h-full overflow-hidden">
                       <h1 className="text-[6rem] font-bold tracking-tighter font-avant-garde leading-none uppercase text-[#333333]/[0.15] select-none">
                          {cat.id === "01" ? "Crush" : cat.id === "02" ? "Jam" : cat.id === "03" ? "Fruit" : "Plant"}
                       </h1>
                    </div>
                  </div>
                )}

                {/* ACTIVE STATE CONTENT (High-Fidelity) */}
                {isActive && (
                  <div className="w-full h-full flex items-center">
                    {/* Left Column (Grey side) */}
                    <div className="w-[38%] flex flex-col justify-end pb-4 h-full">
                      <div className="mb-auto pt-2">
                         <h3 className="text-[0.55rem] font-bold uppercase tracking-[0.2em] text-[#333333] font-avant-garde leading-tight">
                          Pure <br /> Botanical <br /> Refreshment
                        </h3>
                      </div>
                      <p className="text-[0.42rem] leading-tight text-[#333333]/40 font-avant-garde max-w-[90px]">
                         This is a sample product details must be enter here.
                      </p>
                    </div>

                    {/* Bridge for the centered bottle */}
                    <div className="w-[12%] h-full" />

                    {/* Right Column (Inside Colored panel) */}
                    <div className="w-[50%] flex flex-col justify-center items-start text-white pl-4 pr-1">
                       <p className="text-[0.45rem] leading-tight font-avant-garde opacity-90 mb-2 line-clamp-3">
                        This is a sample product details must be enter here to show the ui ux design minimal stage
                      </p>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect(index);
                        }}
                        className="flex items-center justify-between w-full max-w-[90px] px-3 py-1.5 rounded-full border border-white/40 text-white font-avant-garde text-[0.6rem] font-bold bg-transparent backdrop-blur-sm"
                      >
                        <span>Buy Now</span>
                        <ArrowRight size={12} className="ml-1" />
                      </button>
                    </div>

                    {/* Product Image Centered on Boundary */}
                    <motion.div
                      key={cat.id + "-img-v3"}
                      initial={{ scale: 0.8, opacity: 0, x: 20 }}
                      animate={{ scale: 1.15, opacity: 1, x: 0 }}
                      className="absolute left-[30%] right-[40%] inset-y-0 flex items-center justify-center z-30 pointer-events-none"
                    >
                      <Image
                        src={cat.image}
                        alt={cat.title}
                        width={200}
                        height={350}
                        className="object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.3)]"
                        priority
                      />
                    </motion.div>

                    {/* Floating Pitayas EXACT Positions from Mockup */}
                    {index === 0 && (
                      <div className="pointer-events-none absolute inset-0 z-40">
                        {/* Top Left Pitaya */}
                        <motion.div
                          className="absolute top-[18%] left-[34%] w-10 h-10"
                          animate={{ y: [0, -8, 0], rotate: [0, 20, 0] }}
                          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <Image src="/images/hero/floatingpitaya.png" alt="" fill className="object-contain" />
                        </motion.div>

                        {/* Middle Right Pitaya */}
                        <motion.div
                          className="absolute bottom-[28%] right-[32%] w-12 h-12"
                          animate={{ y: [0, 10, 0], rotate: [0, -15, 0] }}
                          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        >
                          <Image src="/images/hero/floatingpitaya.png" alt="" fill className="object-contain" />
                        </motion.div>

                        {/* Bottom Left Pitaya */}
                        <motion.div
                          className="absolute bottom-[22%] left-[38%] w-9 h-9"
                          animate={{ y: [0, 6, 0], scale: [1, 1.1, 1] }}
                          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                        >
                          <Image src="/images/hero/floatingpitaya.png" alt="" fill className="object-contain" />
                        </motion.div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Unified Desktop Header (Hidden on Mobile) */}
      <motion.div
        className="hidden md:grid w-full flex-1 max-w-[1700px] mx-auto overflow-hidden rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.08)] grid-cols-4 relative bg-white"
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
