"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useHeaderColor } from "@/lib/HeaderColorContext";

interface CategoryHeroProps {
  categories: any[];
}

export function CategoryHero({ categories }: CategoryHeroProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number>(0);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !categories || categories.length === 0) return null;

  const getBgColor = (index: number, isHovered: boolean) => {
    if (isHovered) return categories[index].color;
    const greys = ["#e6e7e8", "#e5e5e7", "#dbdbdd", "#d1d1d3"];
    return greys[index] || "#e6e7e8";
  };

  return (
    <section className="relative w-full flex-1 md:px-12 flex flex-col font-sans overflow-hidden bg-[#e6e7e8]">

      {/* Mobile-Only High-Fidelity Accordion */}
      <div className="flex md:hidden flex-col h-full w-full gap-2 p-2">
        {categories.slice(0, 4).map((cat, index) => {
          const isActive = hoveredIndex === index;
          return (
            <motion.div
              key={cat.id || cat._id}
              onClick={() => setHoveredIndex(index)}
              className={`relative min-h-0 w-full overflow-hidden cursor-pointer rounded-xl transition-all duration-700
                ${isActive ? "bg-[#e5e5e7] flex-[3]" : index % 2 === 0 ? "bg-[#e6e7e8] flex-1" : "bg-[#e5e5e7] flex-1"}
              `}
            >
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
                      className="w-[58%] h-full rounded-l-xl rounded-r-xl transition-all duration-700 shadow-[0_0_20px_rgba(0,0,0,0.05)] relative"
                      style={{ backgroundColor: cat.color }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {isActive && (
                <div className="absolute inset-0 flex items-center justify-start pl-4 pointer-events-none select-none overflow-hidden h-full z-0">
                  <motion.h1
                    layout
                    className="font-bold tracking-tight transition-all duration-700 font-brand-heading leading-none text-[10rem] text-[#333333]/[0.10] -ml-2"
                  >
                    {cat.title}
                  </motion.h1>
                </div>
              )}

              <div className="relative z-20 w-full h-full flex items-center px-4">
                {!isActive && (
                  <div className="w-full h-full flex flex-col justify-between py-6 px-1 relative">
                    <div className="max-w-[150px] opacity-60">
                      <p className="text-[10px] leading-[1.3] font-avant-garde lowercase tracking-tight">
                        {cat.subtitle || "Premium botanical refreshment collection."}
                      </p>
                    </div>

                    <div className="flex-1 flex items-center justify-start w-full max-w-[130px]">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/shop?cat=${cat.title.toLowerCase()}`);
                        }}
                        className="flex items-center justify-center gap-1.5 px-3 py-1 rounded-full border border-[#333333]/30 text-[#333333] font-avant-garde text-[10px] font-bold bg-transparent group hover:bg-[#333333] hover:text-white transition-all duration-300"
                      >
                        <span>View More</span>
                        <ArrowRight size={10} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    </div>

                    <div className="flex items-end gap-3 mb-1">
                      <div className="shrink-0">
                        <h3 className="text-sm font-bold tracking-[0.05em] text-[#737478] font-brand-heading leading-[1.05] whitespace-pre-line">
                          {cat.mobileTitle || "Pure\nbotanical\nrefreshment"}
                        </h3>
                      </div>
                      <div className="max-w-[120px] opacity-40">
                        <p className="text-[10px] font-avant-garde leading-[1.3] line-clamp-2">
                          {cat.mobileShortDesc || "Experience the essence of nature in every drop."}
                        </p>
                      </div>
                    </div>

                    <div className="absolute inset-y-0 right-[-10px] flex items-center justify-end z-0 pointer-events-none w-full h-full overflow-hidden">
                      <h1 className="text-[6.2rem] font-bold tracking-tight font-brand-heading leading-none text-[#6C6D71] select-none uppercase opacity-20">
                        {cat.title}
                      </h1>
                    </div>
                  </div>
                )}

                {isActive && (
                  <div className="w-full h-full flex items-center relative">
                    <div className="w-[42%] flex flex-col justify-end py-6 px-1 h-full">
                      <div className="flex items-end gap-3 mb-1">
                        <div className="shrink-0">
                          <h3 className="text-sm font-bold tracking-[0.05em] text-[#737478] font-brand-heading leading-[1.05] whitespace-pre-line">
                            {cat.mobileTitle || "Pure\nbotanical\nrefreshment"}
                          </h3>
                        </div>
                        <div className="max-w-[120px] opacity-40">
                          <p className="text-[10px] font-avant-garde leading-[1.3] line-clamp-2">
                            {cat.mobileShortDesc || "Experience the essence of nature in every drop."}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="w-[58%] flex flex-col justify-center items-start text-white pl-12 pr-4 h-full relative z-30">
                      <div className="max-w-[160px]">
                        <p className="text-xs leading-[1.6] font-avant-garde opacity-90 mb-5 tracking-wide whitespace-pre-line">
                          {cat.mobileActiveDesc || "Handcrafted with botanical integrity to provide a sensory experience like no other."}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/shop?cat=${cat.title.toLowerCase()}`);
                          }}
                          className="flex mx-auto items-center justify-center gap-1.5 px-4 py-1.5 rounded-full border border-white/40 text-white font-avant-garde text-xs font-bold bg-transparent backdrop-blur-sm hover:bg-white hover:text-black transition-all duration-300 group shadow-lg"
                        >
                          <span>Buy Now</span>
                          <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <AnimatePresence>
                {isActive && (
                  <motion.div
                    key={(cat.id || cat._id) + "-mobile-img"}
                    initial={{ scale: 0.8, opacity: 0, y: 50, x: "-50%" }}
                    animate={{ scale: 1.0, opacity: 1, y: 0, x: "-50%" }}
                    exit={{ scale: 0.8, opacity: 0, y: 20, x: "-50%" }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute bottom-0 left-[42%] z-[50] pointer-events-none"
                  >
                    <Image
                      src={cat.image}
                      alt={cat.title}
                      width={130}
                      height={260}
                      className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)] origin-bottom"
                      priority
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Unified Desktop Header */}
      <motion.div
        className="hidden md:grid w-full flex-1 max-w-[1700px] mx-auto overflow-hidden rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.08)] grid-cols-4 relative bg-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {categories.slice(0, 4).map((cat, index) => (
          <motion.div
            key={cat.id || cat._id}
            onMouseEnter={() => setHoveredIndex(index)}
            onClick={() => router.push(`/shop?cat=${cat.title.toLowerCase()}`)}
            className="relative h-full flex flex-col cursor-pointer overflow-hidden border-r border-black/5 last:border-none group min-h-[600px] md:min-h-[720px]"
            animate={{
              backgroundColor: getBgColor(index, hoveredIndex === index)
            }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4 md:px-8 text-center py-10">

              <div className="absolute top-[12%] w-full h-[32%] flex items-center justify-center pointer-events-none" style={{ zIndex: 20 }}>
                <motion.div
                  className="relative w-full h-full"
                  initial={false}
                  animate={{
                    opacity: hoveredIndex === index ? 1 : 0,
                    scale: hoveredIndex === index ? 1.2 : 0.8,
                    y: hoveredIndex === index ? 20 : 40 
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

              <motion.div
                className="flex flex-col items-center w-full z-10"
                animate={{
                  y: hoveredIndex === index ? 70 : 0 
                }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
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
                  {cat.id || (index + 1).toString().padStart(2, '0')}
                </motion.div>

                <motion.h2
                  className="text-4xl lg:text-[4.2rem] font-bold mb-1 tracking-tight font-brand-heading leading-[1.1] z-30"
                  animate={{
                    color: hoveredIndex === index ? "#ffffff" : "#6f7074"
                  }}
                  transition={{ duration: 0.4 }}
                >
                  {cat.title}
                </motion.h2>

                <motion.p
                  className="text-[0.6rem] md:text-[0.65rem] font-bold uppercase tracking-[0.2em] mb-3 font-avant-garde z-30"
                  animate={{
                    color: hoveredIndex === index ? "rgba(255,255,255,0.8)" : "#666666"
                  }}
                >
                  {cat.subtitle || "Pure Botanical Refreshment"}
                </motion.p>

                <motion.p
                  className="text-[0.65rem] md:text-[0.7rem] leading-relaxed font-avant-garde px-4 md:px-6 mb-6 md:mb-8 max-w-[240px] z-30"
                  animate={{
                    color: hoveredIndex === index ? "rgba(255,255,255,0.6)" : "#999999"
                  }}
                >
                  {cat.mobileActiveDesc || "Handcrafted with botanical integrity to provide a sensory experience like no other."}
                </motion.p>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/shop?cat=${cat.title.toLowerCase()}`);
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
