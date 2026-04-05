"use client";

import { motion } from "framer-motion";
import { CATEGORIES } from "./CategoryHero";
import Image from "next/image";
import { ShoppingCart, User, ArrowLeft, MousePointer2 } from "lucide-react";

interface CategoryDetailProps {
  categoryIndex: number;
  onBack: () => void;
}

export function CategoryDetail({ categoryIndex, onBack }: CategoryDetailProps) {
  const cat = CATEGORIES[categoryIndex];

  return (
    <motion.section
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0 z-50 overflow-hidden flex flex-col font-sans"
      style={{ backgroundColor: cat.color }}
    >
      {/* Minimalist Floating Back Button */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute top-32 left-8 md:left-16 z-40"
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
      <div className="relative flex-1 flex items-center justify-center pointer-events-none">
        
        {/* Huge Background Text */}
        <motion.h1 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="absolute inset-0 flex items-center justify-center text-[25vw] md:text-[35vw] font-black leading-none text-white select-none z-10"
        >
          {cat.title.toUpperCase()}
        </motion.h1>

        {/* Central Product Image */}
        <motion.div 
          initial={{ y: 100, opacity: 0, scale: 0.5 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 60, damping: 15, delay: 0.5 }}
          className="relative z-20 w-full h-[60%] md:h-[80%] flex items-center justify-center"
        >
          <div className="relative w-full h-full">
            <Image
              src={cat.image}
              alt={cat.title}
              fill
              className="object-contain drop-shadow-[0_50px_100px_rgba(0,0,0,0.4)]"
              priority
            />
          </div>
        </motion.div>

        {/* Right ML Selectors */}
        <div className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-30 pointer-events-auto">
          {[500, 100, 125].map((ml, idx) => (
            <motion.button
              key={ml}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 + idx * 0.1 }}
              className={`w-14 h-14 rounded-full border-[1.5px] flex flex-col items-center justify-center text-[10px] font-bold transition-all duration-300
                ${idx === 0 ? "bg-white text-black border-white" : "text-white border-white/20 hover:border-white/50"}
              `}
            >
              <span>{ml}</span>
              <span>ML</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Footer Info Area */}
      <footer className="relative z-30 w-full px-8 md:px-16 py-12 flex items-end justify-between text-white">
        <div className="max-w-md">
          <motion.h2 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-3xl md:text-5xl font-light mb-6"
          >
            {cat.id === "01" ? "Cheeky lime" : cat.title}
          </motion.h2>
          <motion.p 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-sm md:text-base opacity-70 leading-relaxed mb-8 max-w-sm"
          >
            Discover a world of vibrant flavors with our premium selection. At RAFA GARDEN, we believe in the power of nature's finest ingredients to bring you pure refreshment and wellness.
          </motion.p>
          <motion.button
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="px-8 py-3 bg-white text-black font-bold rounded-full text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors shadow-xl"
          >
            See More
          </motion.button>
        </div>

        {/* Scroll Down */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col items-center gap-4 cursor-pointer hover:scale-105 transition-transform"
        >
          <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center relative overflow-hidden group">
            <motion.div 
               animate={{ y: [0, 5, 0] }}
               transition={{ duration: 2, repeat: Infinity }}
            >
              <MousePointer2 size={24} />
            </motion.div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-80">Scroll Down</span>
        </motion.div>
      </footer>
    </motion.section>
  );
}
