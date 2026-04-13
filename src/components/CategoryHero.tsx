"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

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
              className={`relative flex-1 min-h-0 w-full overflow-hidden cursor-pointer rounded-[20px] transition-all duration-700
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
                    className="absolute inset-0 flex pl-3 pr-0 py-0 pointer-events-none z-10"
                  >
                    <div className="w-[42%] h-full" />
                    <div
                      className="w-[58%] h-full rounded-l-[1.5rem] rounded-tr-[20px] rounded-br-[20px] transition-all duration-700 shadow-[0_0_20px_rgba(0,0,0,0.05)] relative"
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
                    className="font-bold tracking-tight transition-all duration-700 font-brand-heading leading-none text-[10rem] text-[#333333]/[0.10] -ml-2"
                  >
                    {cat.id === "01" ? "Crush" : cat.id === "02" ? "jams" : cat.id === "03" ? "Fruits" : "Plants"}
                  </motion.h1>
                </div>
              )}

              {/* Content Wrapper */}
              <div className="relative z-20 w-full h-full flex items-center px-4">

                {/* INACTIVE STATE CONTENT - 1:1 MATCH WITH Mockup */}
                {!isActive && (
                  <div className="w-full h-full flex flex-col justify-between py-6 px-1 relative">
                    {/* Top Left Description */}
                    <div className="max-w-[130px] opacity-60">
                      <p className="text-[6px] leading-[1.3] font-avant-garde lowercase tracking-tight">
                        This is a sample product details must be enter here to show the ui ux design minimal stage
                      </p>
                    </div>

                    {/* Middle Left Button - Reduced Size and Centered */}
                    <div className="flex-1 flex items-center justify-start w-full max-w-[130px]">
                      <button className="flex items-center justify-center gap-1.5 px-3 py-1 rounded-full border border-[#333333]/30 text-[#333333] font-avant-garde text-[0.45rem] font-bold bg-transparent group hover:bg-[#333333] hover:text-white transition-all duration-300">
                        <span>View More</span>
                        <ArrowRight size={8} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    </div>

                    {/* Bottom Content Group - EXACT 1:1 ALIGNMENT */}
                    <div className="flex items-end gap-3 mb-1">
                      <div className="shrink-0">
                        <h3 className="text-[0.45rem] font-bold tracking-[0.05em] text-[#333333] font-brand-heading leading-[1.2]">
                          Pure <br /> botanical <br /> refreshment
                        </h3>
                      </div>
                        <div className="max-w-[100px] opacity-40">
                          <p className="text-[6px] font-avant-garde leading-[1.3] line-clamp-2">
                            This is a sample product details must be enter here to show the ui ux design
                          </p>
                        </div>
                    </div>

                    {/* Large Watermark Title on the Right - Updated Color */}
                    <div className="absolute inset-y-0 right-[-10px] flex items-center justify-end z-0 pointer-events-none w-full h-full overflow-hidden">
                      <h1 className="text-[6.2rem] font-bold tracking-tight font-brand-heading leading-none text-[#6C6D71] select-none">
                        {cat.id === "02" ? "Jam" : cat.title}
                      </h1>
                    </div>
                  </div>
                )}

                {/* ACTIVE STATE CONTENT - 1:1 MATCH WITH Mockup */}
                {isActive && (
                  <div className="w-full h-full flex items-center relative">
                    {/* Left Column (Gray side) - Brand Footer */}
                    <div className="w-[42%] flex flex-col justify-end py-6 px-1 h-full">
                      <div className="flex items-end gap-3 mb-1">
                        <div className="shrink-0">
                        <h3 className="text-[0.45rem] font-bold tracking-[0.05em] text-[#333333] font-brand-heading leading-[1.2]">
                            Pure <br /> botanical <br /> refreshment
                          </h3>
                        </div>
                        <div className="max-w-[100px] opacity-40">
                          <p className="text-[6px] font-avant-garde leading-[1.3] line-clamp-2">
                            This is a sample product details must be enter here to show the ui ux design
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right Column (Inside Colored panel) - Interactive Area */}
                    <div className="w-[58%] flex flex-col justify-center items-start text-white pl-14 pr-4 h-full relative z-30">
                      <div className="max-w-[140px]">
                        <p className="text-[0.45rem] leading-[1.6] font-avant-garde opacity-90 mb-5 tracking-wide">
                          This is a sample product details must <br/> be enter here to show the ui ux <br/> design minimal stage
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/shop?cat=${index}`);
                          }}
                          className="flex mx-auto items-center justify-center gap-1.5 px-3 py-1 rounded-full border border-white/40 text-white font-avant-garde text-[0.45rem] font-bold bg-transparent backdrop-blur-sm hover:bg-white hover:text-black transition-all duration-300 group shadow-lg"
                        >
                          <span>Buy Now</span>
                          <ArrowRight size={8} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>

                    {/* Floating Pitayas EXACT Positions from Mockup */}
                    {index === 0 && (
                      <div className="pointer-events-none absolute inset-0 z-[60]">
                        {/* Top Left Pitaya */}
                        <motion.div
                          className="absolute top-[18%] left-[26%] w-10 h-10 filter blur-[1px]"
                          animate={{ y: [0, -5, 0], rotate: [0, 10, 0] }}
                          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <Image src="/images/hero/floatingpitaya.png" alt="" fill className="object-contain" />
                        </motion.div>

                        {/* Middle Left Pitaya - Near bottle waist */}
                        <motion.div
                          className="absolute bottom-[32%] left-[22%] w-12 h-12 filter blur-[2px]"
                          animate={{ y: [0, 8, 0], rotate: [0, -10, 0] }}
                          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        >
                          <Image src="/images/hero/floatingpitaya.png" alt="" fill className="object-contain" />
                        </motion.div>

                        {/* Bottom Right Pitaya - Placed above the bottle */}
                        <motion.div
                          className="absolute bottom-[22%] left-[48%] w-14 h-14 filter blur-[1.5px]"
                          animate={{ y: [0, 6, 0], scale: [1, 1.05, 1], rotate: [0, 15, 0] }}
                          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                        >
                          <Image src="/images/hero/floatingpitaya.png" alt="" fill className="object-contain" />
                        </motion.div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* =========================================================================
                 📸 MOBILE SCREEN PRODUCT IMAGE STYLING 📸
                 Edit the 'width', 'height', and 'bottom' positioning below to tweak 
                 the size and placement of the floating bottle exclusively on mobile.
              ========================================================================= */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    key={cat.id + "-mobile-img-v5"}
                    initial={{ scale: 0.8, opacity: 0, y: 50, x: "-50%" }}
                    animate={{ scale: 1.0, opacity: 1, y: 0, x: "-50%" }}
                    exit={{ scale: 0.8, opacity: 0, y: 20, x: "-50%" }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute bottom-[-10px] left-[42%] z-[50] pointer-events-none"
                  >
                    <Image
                      src={cat.image}
                      alt={cat.title}
                      width={130}
                      height={240}
                      className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)] origin-bottom"
                      priority
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              {/* ========================================================================= */}
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
                  className="text-4xl lg:text-[4.2rem] font-bold mb-1 tracking-tight font-brand-heading leading-[1.1] z-30"
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
                  onClick={(e) => {
                    if (hoveredIndex === index) {
                      e.stopPropagation();
                      router.push(`/shop?cat=${index}`);
                    }
                  }}
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
