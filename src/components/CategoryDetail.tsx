"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CATEGORIES } from "@/lib/data";
import Image from "next/image";
import { ArrowLeft, MousePointer2, ChevronLeft, ChevronRight } from "lucide-react";

interface CategoryDetailProps {
  categoryIndex: number;
  onBack: () => void;
}

export function CategoryDetail({ categoryIndex, onBack }: CategoryDetailProps) {
  const cat = CATEGORIES[categoryIndex];
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  
  // Safe fallback if products array is empty
  const currentProduct = cat.products?.[currentProductIndex] || {
    id: "temp", name: cat.title, description: "Description unavailable.", image: cat.image, variants: []
  };

  const handleNext = () => {
    if (cat.products?.length > 1) {
      setCurrentProductIndex((prev) => (prev + 1) % cat.products.length);
    }
  };

  const handlePrev = () => {
    if (cat.products?.length > 1) {
      setCurrentProductIndex((prev) => (prev - 1 + cat.products.length) % cat.products.length);
    }
  };

  return (
    <motion.section
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] as const }}
      className="fixed inset-0 z-[60] overflow-hidden flex flex-col font-sans"
      style={{ backgroundColor: cat.color }}
    >
      {/* Minimalist Floating Back Button */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute top-6 md:top-24 left-8 md:left-16 z-40"
      >
        <button 
          onClick={onBack}
          className="flex items-center gap-3 px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white hover:text-black transition-all duration-300 group shadow-xl"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] translate-y-[0.5px]">Back to Collection</span>
        </button>
      </motion.div>

      {/* Main Content Area */}
      <div className="relative flex-1 flex items-center justify-center">
        
        {/* Huge Background Text - Fixed to Category Title */}
        <motion.h1 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="absolute inset-0 flex items-center justify-center text-[18vw] md:text-[24vw] font-black leading-none text-white select-none z-10 pointer-events-none"
        >
          {cat.title.toUpperCase()}
        </motion.h1>

        {/* Carousel Prev Button */}
        {cat.products?.length > 1 && (
           <button 
             onClick={handlePrev} 
             className="absolute left-4 md:left-24 z-40 p-3 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white hover:text-black transition duration-300 backdrop-blur-md"
           >
             <ChevronLeft size={32} />
           </button>
        )}

        {/* Central Product Image with AnimatePresence for transitions */}
        <div className="relative z-20 w-full h-[45%] md:h-[70%] lg:h-[85%] max-h-[35vh] md:max-h-none flex items-center justify-center pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentProduct.id}
              initial={{ y: 50, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -50, opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="relative w-full h-full"
            >
              <Image
                src={currentProduct.image}
                alt={currentProduct.name}
                fill
                className="object-contain drop-shadow-[0_50px_100px_rgba(0,0,0,0.4)]"
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Next Button */}
        {cat.products?.length > 1 && (
           <button 
             onClick={handleNext} 
             className="absolute right-24 md:right-32 z-40 p-3 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white hover:text-black transition duration-300 backdrop-blur-md"
           >
             <ChevronRight size={32} />
           </button>
        )}

        {/* Right Variant Selectors */}
        <div className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-30 pointer-events-auto">
          <AnimatePresence mode="wait">
            <motion.div key={currentProduct.id + "-variants"} className="flex flex-col gap-4">
              {currentProduct.variants?.map((v, idx) => (
                <motion.button
                  key={idx}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 50, opacity: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-full border-[1.5px] flex flex-col items-center justify-center text-[10px] font-bold transition-all duration-300
                    ${idx === 0 ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]" : "text-white border-white/30 hover:border-white/80 hover:bg-white/10"}
                  `}
                >
                  <span>{v.size}</span>
                  <span className="scale-90 opacity-80">{v.unit}</span>
                </motion.button>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Pagination Dots */}
        {cat.products?.length > 1 && (
          <div className="absolute bottom-32 md:bottom-36 left-1/2 -translate-x-1/2 z-40 flex gap-2">
            {cat.products.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentProductIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === currentProductIndex ? "bg-white w-6" : "bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer Info Area - Dynamic Product Info */}
      <footer className="relative z-30 w-full px-8 md:px-16 py-4 md:py-12 flex items-end justify-between text-white pointer-events-auto">
        <div className="max-w-md">
          <AnimatePresence mode="wait">
            <motion.div key={currentProduct.id + "-text"}>
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="text-3xl md:text-5xl font-light mb-3 md:mb-4 tracking-tight"
              >
                {currentProduct.name}
              </motion.h2>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-sm md:text-base opacity-80 leading-relaxed mb-4 md:mb-6 max-w-sm"
              >
                {currentProduct.description}
              </motion.p>
            </motion.div>
          </AnimatePresence>
          <motion.button
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="px-6 py-2.5 bg-white text-black font-bold rounded-full text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors shadow-xl"
          >
            Add to Cart
          </motion.button>
        </div>

        {/* Scroll Down Hint (Optional, currently just aesthetic) */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="hidden md:flex flex-col items-center gap-4 cursor-pointer hover:scale-105 transition-transform"
        >
          <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center relative overflow-hidden group">
            <motion.div 
               animate={{ y: [0, 5, 0] }}
               transition={{ duration: 2, repeat: Infinity }}
            >
              <MousePointer2 size={24} />
            </motion.div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-80">Explore More</span>
        </motion.div>
      </footer>
    </motion.section>
  );
}
