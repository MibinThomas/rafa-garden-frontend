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

      {/* Redesigned Mobile & Tablet Editorial Hero */}
      <div className="flex lg:hidden flex-col w-full gap-4 pb-10">
        <AnimatePresence mode="popLayout">
          {/* 1. Active Featured Card (Full Width) */}
          {categories.slice(0, 4).map((cat, index) => {
            const isActive = activeMobileIndex === index;
            if (!isActive) return null;

            return (
              <motion.div 
                layoutId={`card-${cat.id}`}
                key={cat.id || cat._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="w-full flex rounded-2xl overflow-hidden shadow-sm relative h-[340px] md:h-[420px] bg-[#e2e2e2]"
              >
                {/* Left Side: Grey Background */}
                <motion.div layout className="w-[45%] md:w-[40%] relative flex items-center justify-center">
                  {/* Vertical background text */}
                  <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                     <span className="text-[#d0d0d0] font-black text-6xl md:text-8xl tracking-widest uppercase -rotate-90 whitespace-nowrap opacity-60">
                       {cat.watermarkText || cat.title.split(' ')[2] || cat.title.split(' ')[0] || "CRUSH"}
                     </span>
                  </div>
                  {/* Product Image */}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="absolute w-[90%] h-[90%] md:w-[85%] md:h-[85%] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                  >
                    <Image
                      src={cat.image}
                      alt={cat.title}
                      fill
                      className="object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.25)]"
                      sizes="50vw"
                      priority
                    />
                  </motion.div>
                </motion.div>

                {/* Right Side: Colored Panel */}
                <motion.div 
                  layout
                  className="flex-1 p-5 md:p-8 flex flex-col justify-center rounded-l-2xl relative z-20 shadow-[-10px_0_20px_rgba(0,0,0,0.05)]"
                  style={{ backgroundColor: cat.color || "#c81c6a" }}
                >
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                  >
                    <h2 className="text-white text-[1.6rem] md:text-[2.2rem] font-brand-heading font-black leading-[1.1] mb-3 md:mb-4">
                      {cat.title}
                    </h2>
                    <p className="text-white/90 text-[10px] md:text-[13px] leading-relaxed font-avant-garde mb-6 md:mb-8 pr-2 font-medium line-clamp-4 md:line-clamp-6">
                      {cat.mobileActiveDesc || content["home.hero_default_desc"] || "This is a sample product details must be enter here to show the ui ux design minimal stage"}
                    </p>
                  </motion.div>
                  
                  <motion.div 
                    className="mt-auto"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                  >
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/shop?cat=${cat.title.toLowerCase()}`);
                      }}
                      className="flex items-center justify-between w-[100px] md:w-[130px] px-4 md:px-6 py-2.5 md:py-3 rounded-full border border-white/40 text-white hover:bg-white/10 transition-colors text-[10px] md:text-[12px] font-bold active:scale-95"
                    >
                      <span>Buy Now</span>
                      <ArrowRight size={14} />
                    </button>
                    <h3 className="text-white text-[1rem] md:text-[1.3rem] font-black font-brand-heading leading-[1.1] mt-6 md:mt-8 whitespace-pre-line">
                      {content["home.hero_promo_text"] || "Pure\nBotanical\nRefreshment"}
                    </h3>
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })}

          {/* 2. Inactive Secondary Cards (Stacked on Mobile, 3-Column Grid on Tablet) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-2">
            {categories.slice(0, 4).map((cat, index) => {
              const isActive = activeMobileIndex === index;
              if (isActive) return null;

              const isImageLeft = index % 2 !== 0;
              const words = cat.title.split(' ');
              const rawWord = words.length > 1 ? words[words.length - 1] : words[0];
              const bgWord = index === 1 ? "" : rawWord.charAt(0).toUpperCase() + rawWord.slice(1).toLowerCase();

              return (
                <motion.div 
                  layoutId={`card-${cat.id}`}
                  key={cat.id || cat._id}
                  onClick={() => {
                    setActiveMobileIndex(index);
                    onActiveChange?.(index);
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full bg-[#dedede] rounded-2xl overflow-hidden cursor-pointer shadow-sm relative h-[160px] md:h-[220px] flex items-center"
                >
                   <div className={`w-full h-full flex ${isImageLeft ? "flex-row md:flex-col" : "flex-row-reverse md:flex-col"} relative z-10`}>
                     {/* Image side */}
                     <div className="w-[50%] md:w-full h-full md:h-[50%] relative p-2 md:p-4 flex items-center justify-center overflow-visible">
                       {/* Background faded text directly behind the image */}
                       {(cat.watermarkText || bgWord) && (
                         <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                           <span className="text-[#c8c8c8] font-black text-6xl md:text-7xl tracking-tight whitespace-nowrap">
                             {cat.watermarkText || bgWord}
                           </span>
                         </div>
                       )}
                       <div className="absolute w-[90%] h-[90%] md:w-[80%] md:h-[80%] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                         <Image
                           src={cat.image}
                           alt={cat.title}
                           fill
                           className="object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.15)]"
                           sizes="40vw"
                         />
                       </div>
                     </div>

                     {/* Text side */}
                     <div className={`w-[50%] md:w-full h-full md:h-[50%] flex flex-col justify-center md:items-center ${isImageLeft ? "pl-2 pr-6 md:px-4" : "pl-8 pr-2 md:px-4"} md:pb-4`}>
                       <h2 className="text-[#656669] text-[1.3rem] md:text-[1.1rem] font-brand-heading font-black leading-[1.1] mb-4 w-[95%] whitespace-pre-line md:text-center md:mb-3">
                         {cat.title}
                       </h2>
                       <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/shop?cat=${cat.title.toLowerCase()}`);
                          }}
                          className="flex items-center justify-between w-[100px] md:w-[110px] px-4 md:px-5 py-2 rounded-full border border-[#656669]/30 text-[#656669] hover:bg-black/5 transition-colors text-[10px] font-bold active:scale-95"
                       >
                         <span>View More</span>
                         <ArrowRight size={12} className="text-[#656669]/60" />
                       </button>
                     </div>
                   </div>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      </div>

      {/* Unified Desktop Header */}
      <motion.div
        className="hidden lg:flex w-full flex-1 max-w-[1700px] mx-auto overflow-hidden rounded-[24px] relative bg-transparent shadow-[0_20px_40px_rgba(0,0,0,0.03)]"
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
