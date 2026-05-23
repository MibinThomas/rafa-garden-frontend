"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useHeaderColor } from "@/lib/HeaderColorContext";

interface CategoryHeroProps {
  categories: any[];
  onActiveChange?: (index: number) => void;
  content?: Record<string, string>;
}

export function CategoryHero({ categories, onActiveChange, content = {} }: CategoryHeroProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number>(0);
  const [activeMobileIndex, setActiveMobileIndex] = useState<number>(0);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !categories || categories.length === 0) return null;

  const getBgColor = (index: number, isHovered: boolean) => {
    if (isHovered) return categories[index].color;
    const greys = ["#ebebeb", "#e2e2e2", "#dadada", "#d2d2d2"];
    return greys[index] || "#ebebeb";
  };

  return (
    <section className="relative w-full flex-1 p-4 md:p-6 lg:p-12 flex flex-col font-sans overflow-hidden bg-transparent">

      {/* Mobile-Only Vertical Flex Section */}
      <div className="flex md:hidden flex-col h-full w-full rounded-[5px] overflow-hidden" style={{ borderRadius: "5px" }}>
        {categories.slice(0, 4).map((cat, index) => (
          <motion.div
            key={cat.id || cat._id}
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ layout: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
            onClick={(e) => {
              if (activeMobileIndex === index) {
                router.push(`/shop?cat=${cat.title.toLowerCase()}`);
              } else {
                setActiveMobileIndex(index);
                onActiveChange?.(index);
              }
            }}
            className={`relative flex-1 flex items-center justify-between px-8 border-b transition-all duration-500 cursor-pointer overflow-hidden active:scale-[0.98] ${
              activeMobileIndex === index ? "border-white/10" : "border-black/10"
            }`}
            style={{ 
              backgroundColor: activeMobileIndex === index ? cat.color : "#f1f1f2",
              borderRadius: activeMobileIndex === index ? "10px" : "5px"
            }}
          >
            {/* Background Number */}
            <div className={`absolute left-4 top-1/2 -translate-y-1/2 text-[120px] font-black pointer-events-none select-none leading-none transition-colors duration-500 ${
              activeMobileIndex === index ? "text-white/5" : "text-black/[0.04]"
            }`}>
              {index + 1}
            </div>

            <div className="relative z-10 py-2 max-w-[65%]">
              <p className={`text-[9px] font-black capitalize tracking-[0.4em] mb-2 transition-colors duration-500 ${
                activeMobileIndex === index ? "text-white/50" : "text-black/40"
              }`}>{content["home.hero_mobile_prefix"] || "Collection"} 0{index + 1}</p>
              <h2 className={`text-4xl font-black font-brand-heading leading-tight tracking-tight transition-colors duration-500 ${
                activeMobileIndex === index ? "text-white" : "text-[#1c1c1c]"
              }`}>
                {cat.title}
              </h2>
              {activeMobileIndex === index && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="flex items-center gap-3 mt-3"
                >
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/shop?cat=${cat.title.toLowerCase()}`);
                    }}
                    className="flex items-center gap-2 text-[10px] font-black text-white capitalize tracking-[0.2em] bg-white/20 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/20 shadow-xl cursor-pointer"
                  >
                    {content["home.hero_explore_btn"] || "Explore"} <ArrowRight size={12} strokeWidth={2.5} />
                  </button>
                </motion.div>
              )}
            </div>

            {/* Product Image */}
            <div className="absolute right-0 top-0 w-[45%] h-full pointer-events-none z-20">
              <motion.div
                className="relative w-full h-full"
                animate={{
                  y: [2, -5, 2],
                  rotate: [10, 12, 10]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.5
                }}
              >
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
                  sizes="40vw"
                  priority
                />
              </motion.div>
            </div>

            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
          </motion.div>
        ))}
      </div>

      {/* Unified Desktop Header */}
      <motion.div
        className="hidden md:flex w-full flex-1 max-w-[1700px] mx-auto overflow-hidden rounded-[24px] relative bg-transparent shadow-[0_20px_40px_rgba(0,0,0,0.03)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {categories.slice(0, 4).map((cat, index) => (
          <motion.div
            key={cat.id || cat._id}
            onMouseEnter={() => setHoveredIndex(index)}
            onClick={() => router.push(`/shop?cat=${cat.title.toLowerCase()}`)}
            className="relative flex-1 h-full flex flex-col cursor-pointer overflow-hidden group"
            animate={{
              backgroundColor: getBgColor(index, hoveredIndex === index)
            }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4 md:px-8 text-center py-10">

              <div className="absolute top-[8%] w-full h-[45%] flex items-center justify-center pointer-events-none" style={{ zIndex: 20 }}>
                <motion.div
                  className="relative w-full h-full"
                  initial={false}
                  animate={{
                    opacity: hoveredIndex === index ? 1 : 0,
                    scale: hoveredIndex === index ? 1 : 0.9,
                    y: hoveredIndex === index ? 0 : 20
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
                  y: hoveredIndex === index ? 100 : 0
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
                  className="text-[0.6rem] md:text-[0.65rem] font-bold capitalize tracking-[0.2em] mb-3 font-avant-garde z-30"
                  animate={{
                    color: hoveredIndex === index ? "rgba(255,255,255,0.8)" : "#666666"
                  }}
                >
                  {cat.subtitle || content["home.hero_default_subtitle"] || "Pure Botanical Refreshment"}
                </motion.p>

                <motion.p
                  className="text-[0.65rem] md:text-[0.7rem] leading-relaxed font-avant-garde px-4 md:px-6 mb-6 md:mb-8 max-w-[240px] z-30"
                  animate={{
                    color: hoveredIndex === index ? "rgba(255,255,255,0.6)" : "#999999"
                  }}
                >
                  {cat.mobileActiveDesc || content["home.hero_default_desc"] || "Handcrafted with botanical integrity to provide a sensory experience like no other."}
                </motion.p>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/shop?cat=${cat.title.toLowerCase()}`);
                  }}
                  className={`flex items-center justify-between w-full max-w-[170px] md:max-w-[180px] px-6 md:px-8 py-3 rounded-full border transition-all duration-300 font-avant-garde text-[0.7rem] md:text-[0.75rem] font-medium tracking-tight whitespace-nowrap z-30
                    ${hoveredIndex === index
                      ? "border-white/40 text-white bg-transparent hover:bg-white/10"
                      : "border-black/10 text-[#6f7074] hover:bg-black/5"}
                  `}
                >
                  <span>{hoveredIndex === index ? (content["home.hero_buy_now_btn"] || "Buy Now") : (content["home.hero_view_more_btn"] || "View More")}</span>
                  <ArrowRight size={16} strokeWidth={1.5} className="ml-2 flex-shrink-0" />
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
