"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Category } from "@/lib/data";

interface FeaturedCarouselProps {
  categories: Category[];
}

export function FeaturedCarousel({ categories }: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % categories.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + categories.length) % categories.length);
  };

  if (!categories || categories.length === 0) return null;

  const currentCategory = categories[currentIndex];

  return (
    <div className="relative w-full h-[600px] md:h-[800px] bg-[#ebebeb] overflow-hidden flex items-center justify-center">
      
      {/* Huge Background Text Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none">
        <AnimatePresence mode="popLayout">
          <motion.h1
            key={currentCategory.id}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, y: -20 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-[120px] md:text-[280px] lg:text-[400px] font-black text-[#d0d0d0]/50 tracking-tighter leading-none whitespace-nowrap capitalize"
          >
            {currentCategory.title}
          </motion.h1>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 z-20">
        <button
          onClick={prevSlide}
          className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-black/10 flex items-center justify-center text-black/30 hover:text-black/60 hover:bg-black/5 transition-all"
        >
          <ChevronLeft size={24} strokeWidth={1} />
        </button>
      </div>

      <div className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 z-20">
        <button
          onClick={nextSlide}
          className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-black/10 flex items-center justify-center text-black/30 hover:text-black/60 hover:bg-black/5 transition-all"
        >
          <ChevronRight size={24} strokeWidth={1} />
        </button>
      </div>

      {/* Central Image */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentCategory.id}
            initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-[80%] md:w-[60%] lg:w-[45%] h-[70%]"
          >
            <Image
              src={currentCategory.image}
              alt={currentCategory.title}
              fill
              className="object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.2)]"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Vertical Text (Right side) */}
      <div className="absolute right-8 md:right-24 bottom-24 md:bottom-32 z-20 origin-bottom-right -rotate-90 translate-x-1/2">
        <AnimatePresence mode="popLayout">
          <motion.p
            key={currentCategory.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-[14px] md:text-[24px] font-light text-[#b0b0b0] tracking-[0.2em] capitalize whitespace-nowrap"
          >
            {currentCategory.subtitle}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Bottom Left Small Text */}
      <div className="absolute left-8 md:left-24 bottom-8 md:bottom-12 z-20 max-w-[200px] md:max-w-[300px]">
        <p className="text-[10px] md:text-[12px] text-[#b0b0b0] font-light leading-relaxed">
          This is a sample product details must be enter here to show the ui ux design minimal stage
        </p>
      </div>

    </div>
  );
}
