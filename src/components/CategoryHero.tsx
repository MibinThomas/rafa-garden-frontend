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

      {/* Mobile-Only Full-Screen Swipe Carousel */}
      <div 
        className="flex md:hidden h-full w-full overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth"
        onScroll={(e) => {
          const container = e.currentTarget;
          const slideWidth = container.clientWidth;
          const newIndex = Math.round(container.scrollLeft / slideWidth);
          if (newIndex !== hoveredIndex && newIndex >= 0 && newIndex < categories.length) {
            setHoveredIndex(newIndex);
          }
        }}
      >
        {categories.slice(0, 4).map((cat, index) => {
          return (
            <div
              key={cat.id || cat._id}
              className="min-w-full h-full snap-center snap-always relative flex flex-col overflow-hidden transition-colors duration-500"
              style={{ backgroundColor: cat.color }}
            >
              <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-6 text-center py-8">
                
                {/* Image Section */}
                <div className="relative w-full h-[45%] flex items-center justify-center mb-4">
                  <motion.div
                    className="relative w-full h-full"
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ amount: 0.5 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Image
                      src={cat.image}
                      alt={cat.title}
                      fill
                      className="object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.3)]"
                      priority={index === 0}
                    />
                  </motion.div>
                </div>

                {/* Text Content */}
                <motion.div 
                  className="flex flex-col items-center w-full z-10"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ amount: 0.5 }}
                  transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div
                    className="bg-number !static !transform-none !mb-[-1.5rem] !leading-none pointer-events-none text-white/10"
                  >
                    {cat.id || (index + 1).toString().padStart(2, '0')}
                  </div>

                  <h2 className="text-5xl font-bold mb-2 tracking-tight font-brand-heading leading-[1.1] text-white z-30">
                    {cat.title}
                  </h2>

                  <p className="text-xs font-bold uppercase tracking-[0.2em] mb-4 font-avant-garde text-white/80 z-30">
                    {cat.subtitle || "Pure Botanical Refreshment"}
                  </p>

                  <p className="text-sm leading-relaxed font-avant-garde px-4 mb-8 max-w-[300px] text-white/90 z-30">
                    {cat.mobileActiveDesc || "Handcrafted with botanical integrity to provide a sensory experience like no other."}
                  </p>

                  <button
                    onClick={() => router.push(`/shop?cat=${cat.title.toLowerCase()}`)}
                    className="flex items-center justify-between w-full max-w-[200px] px-8 py-3.5 rounded-full border border-white/40 text-white bg-white/10 hover:bg-white hover:text-black transition-all duration-300 font-avant-garde text-sm font-medium tracking-tight z-30 shadow-lg"
                  >
                    <span>Buy Now</span>
                    <ArrowRight size={16} strokeWidth={1.5} className="ml-2" />
                  </button>
                </motion.div>
              </div>

              {/* Swipe Indicator Overlay (only on first slide) */}
              {index === 0 && (
                <div className="absolute bottom-6 left-0 w-full flex justify-center items-center pointer-events-none z-50 animate-pulse opacity-70">
                  <div className="flex items-center gap-3 text-white font-avant-garde text-[10px] tracking-widest uppercase bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm">
                    <span>Swipe</span>
                    <ArrowRight size={12} />
                  </div>
                </div>
              )}
            </div>
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
