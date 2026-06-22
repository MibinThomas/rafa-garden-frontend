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
    <section className="relative w-full flex-1 px-4 pt-4 pb-16 md:px-6 md:pt-6 md:pb-20 lg:p-12 flex flex-col font-sans overflow-hidden bg-transparent">

      {/* Redesigned Mobile & Tablet Editorial Hero: Vertically Expanding Accordion */}
      <div className="flex lg:hidden flex-col w-full h-[520px] sm:h-[580px] md:h-[680px] gap-3.5 pb-6">
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
                flexGrow: isActive ? 3.5 : 1,
              }}
              transition={{
                type: "spring",
                stiffness: 150,
                damping: 20,
              }}
              className="w-full rounded-[20px] sm:rounded-[24px] overflow-hidden cursor-pointer shadow-sm relative flex flex-row h-0 min-h-[75px] group border border-black/[0.03]"
            >
              {/* Background Color Layer */}
              <motion.div 
                className="absolute inset-0 transition-colors duration-500"
                style={{ 
                  backgroundColor: isActive ? (cat.color || "#c81c6a") : "#ffffff" 
                }}
              />

              {/* Watermark / Faded Background Text */}
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none z-0">
                <motion.span 
                  layout
                  className={`font-black uppercase tracking-[0.2em] transition-all duration-500 whitespace-nowrap
                    ${isActive 
                      ? "text-white/10 text-6xl sm:text-7xl md:text-8xl -rotate-12 scale-110" 
                      : "text-black/[0.03] text-4xl sm:text-5xl md:text-6xl rotate-0 scale-95"
                    }
                  `}
                >
                  {cat.watermarkText || bgWord}
                </motion.span>
              </div>

              {/* Left Side: Content Details */}
              <div className="w-[58%] md:w-[50%] h-full flex flex-col justify-center pl-6 pr-2 py-4 z-10 select-none">
                <div className="flex flex-col justify-center">
                  
                  {/* Category Number (Active only, animated) */}
                  <motion.span 
                    animate={{ 
                      opacity: isActive ? 0.4 : 0,
                      height: isActive ? "auto" : 0,
                      marginBottom: isActive ? 4 : 0
                    }}
                    transition={{ duration: 0.3 }}
                    className="text-white text-[9px] sm:text-[10px] md:text-xs uppercase font-black tracking-[0.2em] font-avant-garde block overflow-hidden"
                  >
                    {(index + 1).toString().padStart(2, '0')}
                  </motion.span>

                  {/* Title */}
                  <motion.h2 
                    layout="position"
                    className={`font-brand-heading font-black leading-[1.1] transition-colors duration-500
                      ${isActive 
                        ? "text-white text-xl sm:text-2xl md:text-3xl mb-1.5" 
                        : "text-[#5d5f61] text-base sm:text-lg md:text-xl mb-0.5"
                      }
                    `}
                  >
                    {cat.title}
                  </motion.h2>

                  {/* Description (Active only, animated) */}
                  <motion.p 
                    animate={{ 
                      opacity: isActive ? 0.85 : 0,
                      height: isActive ? "auto" : 0,
                      marginTop: isActive ? 4 : 0,
                      marginBottom: isActive ? 8 : 0
                    }}
                    transition={{ duration: 0.3 }}
                    className="text-white text-[10px] sm:text-xs md:text-sm leading-relaxed font-sans font-light max-w-[95%] md:max-w-[85%] overflow-hidden line-clamp-3"
                  >
                    {cat.mobileActiveDesc || content["home.hero_default_desc"] || "Pure botanical refreshment designed to nourish and elevate your space."}
                  </motion.p>

                  {/* Subtitle / Interaction Helper (Inactive only, animated) */}
                  <motion.span 
                    animate={{ 
                      opacity: isActive ? 0 : 0.6,
                      height: isActive ? 0 : "auto",
                    }}
                    transition={{ duration: 0.3 }}
                    className="text-[8px] sm:text-[9px] md:text-[10px] text-[#8e8f93] font-bold font-avant-garde tracking-widest flex items-center gap-1 overflow-hidden"
                  >
                    <span>Explore Collection</span>
                    <ArrowRight size={9} className="text-[#8e8f93]" />
                  </motion.span>
                </div>

                {/* Buy Now Button (Active only, animated) */}
                <motion.div 
                  animate={{ 
                    opacity: isActive ? 1 : 0,
                    height: isActive ? "auto" : 0,
                    marginTop: isActive ? 4 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/shop?cat=${cat.title.toLowerCase()}`);
                    }}
                    className="flex items-center justify-between w-[95px] sm:w-[105px] md:w-[125px] px-3.5 py-2 rounded-full border border-white/35 text-white text-[9px] sm:text-[10px] md:text-xs font-bold active:scale-95 transition-all hover:bg-white hover:text-black hover:border-white shadow-sm"
                  >
                    <span>Buy Now</span>
                    <ArrowRight size={11} />
                  </button>
                </motion.div>
              </div>

              {/* Right Side: Product Image */}
              <div className="w-[42%] md:w-[50%] h-full relative flex items-center justify-center pr-6 pl-2 py-4 z-10 overflow-visible select-none">
                <motion.div 
                  layout
                  className={`relative transition-all duration-500 flex items-center justify-center
                    ${isActive 
                      ? "w-[90%] h-[90%] md:w-[80%] md:h-[80%] drop-shadow-[0_20px_35px_rgba(0,0,0,0.3)] scale-110" 
                      : "w-14 h-14 sm:w-16 sm:h-16 md:w-24 md:h-24 drop-shadow-[0_4px_8px_rgba(0,0,0,0.12)] scale-100"
                    }
                  `}
                >
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 45vw, 30vw"
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
