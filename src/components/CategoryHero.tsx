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

  const formatTitleWithNewline = (title: string) => {
    if (!title) return "";
    if (title.toLowerCase().includes("dragon fruit crush")) {
      return "Dragon Fruit\nCrush";
    }
    const parts = title.split(" ");
    if (parts.length > 1) {
      return `${parts[0]}\n${parts.slice(1).join(" ")}`;
    }
    return title;
  };

  return (
    <section className="relative w-full flex-1 px-4 pt-4 pb-16 md:px-6 md:pt-6 md:pb-20 lg:px-8 lg:pt-2 lg:pb-12 xl:px-12 flex flex-col font-sans overflow-hidden bg-transparent">

      {/* Redesigned Mobile & Tablet Editorial Hero: Vertically Expanding Accordion */}
      <div className="flex lg:hidden flex-col w-full gap-4 pb-12">
        {categories.slice(0, 4).map((cat, index) => {
          const isActive = activeMobileIndex === index;
          return (
            <motion.div
              key={cat.id || cat._id || index}
              layout
              onClick={() => {
                if (!isActive) {
                  setActiveMobileIndex(index);
                  onActiveChange?.(index);
                }
              }}
              className={`w-full rounded-[24px] overflow-hidden flex flex-row relative cursor-pointer select-none transition-shadow duration-300 ${
                isActive 
                  ? "h-[320px] sm:h-[360px] md:h-[420px] bg-[#e6e7e8] shadow-md z-10" 
                  : "h-[140px] sm:h-[160px] md:h-[190px] bg-[#e6e7e8] shadow-sm hover:shadow-md"
              }`}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {isActive ? (
                // Active layout: odd index (2nd, 4th) = mirrored — color panel LEFT, image RIGHT
                index % 2 === 0 ? (
                  /* Even (1st, 3rd): gray+image LEFT — color panel RIGHT */
                  <div className="flex flex-row w-full h-full">

                    {/* LEFT: gray panel — watermark + image overflows right */}
                    <div className="w-[50%] h-full relative bg-[#e6e7e8] overflow-visible">
                      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none z-0">
                        <span
                          className="font-dharma-gothic uppercase text-black/[0.07] leading-none whitespace-nowrap"
                          style={{
                            fontSize: 'clamp(5rem, 20vw, 11rem)',
                            letterSpacing: '0.05em',
                            writingMode: 'vertical-lr',
                            transform: 'rotate(180deg)',
                          }}
                        >
                          {cat.watermarkText || cat.title?.split(' ').slice(-1)[0] || cat.title}
                        </span>
                      </div>
                      {/* Image overflows to the RIGHT */}
                      <div className="absolute z-10" style={{ left: '0%', bottom: 0, width: '120%', height: '90%' }}>
                        <Image
                          src={cat.mobileHeroImage || cat.image} alt={cat.title} fill
                          className="object-contain object-bottom drop-shadow-[0_16px_32px_rgba(0,0,0,0.18)]"
                          sizes="60vw" priority
                        />
                      </div>
                    </div>

                    {/* RIGHT: color panel */}
                    <div
                      className="w-[50%] h-full rounded-[24px] flex flex-col justify-start gap-5 sm:gap-6 p-5 sm:p-6 text-white z-20 relative shadow-lg"
                      style={{ backgroundColor: cat.color }}
                    >
                      <div className="space-y-2 sm:space-y-3">
                        <h2 className="font-brand-heading font-black leading-tight whitespace-pre-line" style={{ fontSize: 'clamp(1.15rem, 4.5vw, 1.75rem)' }}>
                          {formatTitleWithNewline(cat.title)}
                        </h2>
                        <p className="text-[9px] sm:text-[10px] md:text-[11px] text-white/80 leading-relaxed font-sans font-light line-clamp-4">
                          {cat.mobileShortDesc || cat.shortDescription || cat.mobileActiveDesc || 'Discover our premium botanical collection'}
                        </p>
                      </div>
                      <div className="space-y-3 sm:space-y-5">
                        <button
                          onClick={(e) => { e.stopPropagation(); router.push(`/shop?cat=${cat.title.toLowerCase()}`); }}
                          className="flex items-center justify-between px-4 py-2 rounded-full border border-white/50 text-white font-bold active:scale-95 transition-all hover:bg-white hover:border-white"
                          style={{ fontSize: 'clamp(0.55rem, 2vw, 0.75rem)', width: 'clamp(90px, 28vw, 130px)' }}
                          onMouseEnter={e => (e.currentTarget.style.color = cat.color)}
                          onMouseLeave={e => (e.currentTarget.style.color = 'white')}
                        >
                          <span>Buy Now</span><ArrowRight size={10} />
                        </button>
                        <p className="font-brand-heading font-black leading-[1.05] text-white capitalize" style={{ fontSize: 'clamp(1rem, 4vw, 1.4rem)' }}>
                          {cat.subtitle || 'Pure\nBotanical\nRefreshment'}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Odd (2nd, 4th): color panel LEFT — gray+image RIGHT */
                  <div className="flex flex-row w-full h-full">

                    {/* LEFT: color panel */}
                    <div
                      className="w-[50%] h-full rounded-[24px] flex flex-col justify-start gap-5 sm:gap-6 p-5 sm:p-6 text-white z-20 relative shadow-lg"
                      style={{ backgroundColor: cat.color }}
                    >
                      <div className="space-y-2 sm:space-y-3">
                        <h2 className="font-brand-heading font-black leading-tight whitespace-pre-line" style={{ fontSize: 'clamp(1.15rem, 4.5vw, 1.75rem)' }}>
                          {formatTitleWithNewline(cat.title)}
                        </h2>
                        <p className="text-[9px] sm:text-[10px] md:text-[11px] text-white/80 leading-relaxed font-sans font-light line-clamp-4">
                          {cat.mobileShortDesc || cat.shortDescription || cat.mobileActiveDesc || 'Discover our premium botanical collection'}
                        </p>
                      </div>
                      <div className="space-y-3 sm:space-y-5">
                        <button
                          onClick={(e) => { e.stopPropagation(); router.push(`/shop?cat=${cat.title.toLowerCase()}`); }}
                          className="flex items-center justify-between px-4 py-2 rounded-full border border-white/50 text-white font-bold active:scale-95 transition-all hover:bg-white hover:border-white"
                          style={{ fontSize: 'clamp(0.55rem, 2vw, 0.75rem)', width: 'clamp(90px, 28vw, 130px)' }}
                          onMouseEnter={e => (e.currentTarget.style.color = cat.color)}
                          onMouseLeave={e => (e.currentTarget.style.color = 'white')}
                        >
                          <span>Buy Now</span><ArrowRight size={10} />
                        </button>
                        <p className="font-brand-heading font-black leading-[1.05] text-white capitalize" style={{ fontSize: 'clamp(1rem, 4vw, 1.4rem)' }}>
                          {cat.subtitle || 'Pure\nBotanical\nRefreshment'}
                        </p>
                      </div>
                    </div>

                    {/* RIGHT: gray panel — watermark + image overflows left */}
                    <div className="w-[50%] h-full relative bg-[#e6e7e8] overflow-visible">
                      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none z-0">
                        <span
                          className="font-dharma-gothic uppercase text-black/[0.07] leading-none whitespace-nowrap"
                          style={{
                            fontSize: 'clamp(5rem, 20vw, 11rem)',
                            letterSpacing: '0.05em',
                            writingMode: 'vertical-lr',
                            transform: 'rotate(180deg)',
                          }}
                        >
                          {cat.watermarkText || cat.title?.split(' ').slice(-1)[0] || cat.title}
                        </span>
                      </div>
                      {/* Image overflows to the LEFT */}
                      <div className="absolute z-10" style={{ right: '0%', bottom: 0, width: '120%', height: '90%' }}>
                        <Image
                          src={cat.mobileHeroImage || cat.image} alt={cat.title} fill
                          className="object-contain object-bottom drop-shadow-[0_16px_32px_rgba(0,0,0,0.18)]"
                          sizes="60vw" priority
                        />
                      </div>
                    </div>
                  </div>
                )

              ) : (
                // Inactive Card Layout: alternating image left/right
                <div className="flex flex-row w-full h-full">
                  {index % 2 === 0 ? (
                    // Text Left, Image Right
                    <>
                      <div className="w-[55%] h-full flex flex-col justify-center px-6 py-4 z-10">
                        <div className="space-y-3">
                          <h3 className="text-[#5d5f61] text-[1.575rem] sm:text-xl md:text-2xl font-black font-brand-heading leading-tight whitespace-pre-line">
                            {formatTitleWithNewline(cat.title)}
                          </h3>
                          <div 
                            className="flex items-center justify-between w-[95px] sm:w-[105px] px-3.5 py-1.5 rounded-full border border-black/10 text-[#5d5f61] text-[9px] sm:text-[10px] font-bold"
                          >
                            <span>View More</span>
                            <ArrowRight size={10} />
                          </div>
                        </div>
                      </div>
                      <div className="w-[45%] h-full relative flex items-end justify-center px-2 overflow-hidden">
                        <div className="relative w-[90%] h-[88%] z-10">
                          <Image
                            src={cat.image}
                            alt={cat.title}
                            fill
                            className="object-contain object-bottom drop-shadow-[0_4px_8px_rgba(0,0,0,0.08)]"
                            sizes="35vw"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    // Image Left, Text Right
                    <>
                      <div className="w-[45%] h-full relative flex items-end justify-center px-2 overflow-hidden">
                        <div className="relative w-[80%] h-[80%] z-10">
                          <Image
                            src={cat.image}
                            alt={cat.title}
                            fill
                            className="object-contain object-bottom drop-shadow-[0_4px_8px_rgba(0,0,0,0.08)]"
                            sizes="35vw"
                          />
                        </div>
                      </div>
                      <div className="w-[55%] h-full flex flex-col justify-center px-6 py-4 z-10">
                        <div className="space-y-3">
                          <h3 className="text-[#5d5f61] text-[1.575rem] sm:text-xl md:text-2xl font-black font-brand-heading leading-tight whitespace-pre-line">
                            {formatTitleWithNewline(cat.title)}
                          </h3>
                          <div 
                            className="flex items-center justify-between w-[95px] sm:w-[105px] px-3.5 py-1.5 rounded-full border border-black/10 text-[#5d5f61] text-[9px] sm:text-[10px] font-bold"
                          >
                            <span>View More</span>
                            <ArrowRight size={10} />
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
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
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4 md:px-6 lg:px-8 text-center py-10">

              <div className="absolute top-[5%] w-full h-[40%] flex items-center justify-center pointer-events-none" style={{ zIndex: 20 }}>
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
                  y: hoveredIndex === index ? 55 : 0
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
                  className="text-4xl lg:text-[3.8rem] xl:text-[4.2rem] font-bold mb-1 tracking-tight font-brand-heading leading-[1.1] z-30 hero-title"
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
                  className="text-[0.65rem] md:text-[0.7rem] leading-relaxed font-avant-garde px-4 md:px-6 mb-6 md:mb-8 max-w-[240px] z-30 hero-desc"
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
                  className={`flex items-center justify-between w-full max-w-[170px] md:max-w-[180px] px-6 md:px-8 py-3 rounded-full border transition-all duration-300 font-avant-garde text-[0.7rem] md:text-[0.75rem] font-medium tracking-tight whitespace-nowrap z-30 hero-button
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
