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

      {/* Redesigned Mobile & Tablet Editorial Hero: Vertically Expanding Accordion */}
      <div className="flex lg:hidden flex-col w-full h-[540px] md:h-[680px] gap-3 pb-6">
        {categories.slice(0, 4).map((cat, index) => {
          const isActive = activeMobileIndex === index;
          const words = cat.title.split(' ');
          const rawWord = words.length > 1 ? words[words.length - 1] : words[0];
          const bgWord = rawWord.charAt(0).toUpperCase() + rawWord.slice(1).toLowerCase();

          return (
            <motion.div
              layout
              key={cat.id || cat._id}
              onClick={() => {
                setActiveMobileIndex(index);
                onActiveChange?.(index);
              }}
              style={{
                flexGrow: isActive ? 4 : 2,
              }}
              transition={{
                type: "spring",
                stiffness: 150,
                damping: 20,
              }}
              className="w-full rounded-2xl overflow-hidden cursor-pointer shadow-sm relative flex flex-row h-0 min-h-[85px] group"
            >
              {/* Background Color Layer */}
              <motion.div 
                className="absolute inset-0 transition-colors duration-500"
                style={{ 
                  backgroundColor: isActive ? (cat.color || "#c81c6a") : "#f3f4f6" 
                }}
              />

              {/* Watermark / Faded Background Text */}
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none z-0">
                <motion.span 
                  layout
                  className={`font-black uppercase tracking-widest transition-all duration-500 whitespace-nowrap
                    ${isActive 
                      ? "text-white/10 text-6xl md:text-8xl -rotate-12 scale-110" 
                      : "text-black/4 text-4xl md:text-5xl rotate-0 scale-90"
                    }
                  `}
                >
                  {cat.watermarkText || bgWord}
                </motion.span>
              </div>

              {/* Left Side: Content Details */}
              <div className="w-[60%] h-full flex flex-col justify-between p-4 md:p-6 z-10 select-none">
                <div className="flex flex-col justify-center flex-1">
                  {/* Category Number (Active only) */}
                  {isActive && (
                    <motion.span 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-white/40 text-[9px] md:text-[10px] uppercase font-bold tracking-widest mb-1 font-avant-garde"
                    >
                      {(index + 1).toString().padStart(2, '0')}
                    </motion.span>
                  )}

                  {/* Title */}
                  <motion.h2 
                    layout="position"
                    className={`font-brand-heading font-black leading-[1.1] transition-colors duration-500
                      ${isActive 
                        ? "text-white text-lg md:text-2xl mb-1.5" 
                        : "text-[#555659] text-base md:text-lg mb-0"
                      }
                    `}
                  >
                    {cat.title}
                  </motion.h2>

                  {/* Description (Active only) */}
                  {isActive && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ delay: 0.05 }}
                      className="text-white/90 text-[10px] md:text-xs leading-relaxed font-avant-garde font-medium line-clamp-3 mb-2 max-w-[95%]"
                    >
                      {cat.mobileActiveDesc || content["home.hero_default_desc"] || "Pure botanical refreshment designed to nourish and elevate your space."}
                    </motion.p>
                  )}

                  {/* Subtitle / Interaction Helper (Inactive only) */}
                  {!isActive && (
                    <span className="text-[9px] md:text-[10px] text-[#8e8f93] font-bold font-avant-garde tracking-wider flex items-center gap-1 mt-1 opacity-70 group-hover:opacity-100 transition-opacity">
                      <span>Explore Collection</span>
                      <ArrowRight size={10} className="text-[#8e8f93]" />
                    </span>
                  )}
                </div>

                {/* Buy Now Button (Active only) */}
                {isActive && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mt-1"
                  >
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/shop?cat=${cat.title.toLowerCase()}`);
                      }}
                      className="flex items-center justify-between w-[95px] md:w-[110px] px-3.5 py-2 rounded-full border border-white/35 text-white text-[9px] md:text-[10px] font-bold active:scale-95 transition-colors hover:bg-white/10"
                    >
                      <span>Buy Now</span>
                      <ArrowRight size={12} />
                    </button>
                  </motion.div>
                )}
              </div>

              {/* Right Side: Product Image */}
              <div className="w-[40%] h-full relative flex items-center justify-center p-3 z-10 overflow-visible select-none">
                <motion.div 
                  layout
                  className={`relative transition-all duration-500 flex items-center justify-center
                    ${isActive 
                      ? "w-[90%] h-[90%] drop-shadow-[0_12px_24px_rgba(0,0,0,0.25)] scale-110" 
                      : "w-16 h-16 md:w-20 md:h-20 drop-shadow-[0_4px_8px_rgba(0,0,0,0.12)] scale-100"
                    }
                  `}
                >
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-105"
                    sizes="40vw"
                    priority={index === 0}
                  />
                </motion.div>
              </div>
            </motion.div>
          );
        })}
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
