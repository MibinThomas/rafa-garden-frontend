"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { CATEGORIES, Product, ProductVariant } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetailSection } from "@/components/ProductDetailSection";
import { useHeaderColor } from "@/lib/HeaderColorContext";

export default function ShopPage() {
  const { setIsImmersive, setHeaderColor } = useHeaderColor();
  const heroRef = useRef<HTMLElement>(null);
  
  // Dynamic State for categories
  const [categories, setCategories] = useState<any[]>(CATEGORIES);
  const [loading, setLoading] = useState(true);

  // State for active category
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const activeCategory = categories[activeCategoryIndex] || CATEGORIES[0];

  // State for spotlight featured product
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const featuredProduct = activeCategory.products[activeProductIndex] || activeCategory.products[0];

  // State for inline details section
  const [selectedGridProduct, setSelectedGridProduct] = useState<Product | null>(null);

  useEffect(() => {
    // Fetch live categories from database
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
             setCategories(data);
          }
        }
      } catch (err) {
        console.error("Failed to load dynamic categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();

    // Disable immersive hero specific behaviors globally for the shop page
    setIsImmersive(true);
    // Dynamically lock header color to active category
    setHeaderColor(activeCategory.color);
    // Reset product index when category changes
    setActiveProductIndex(0);
    setSelectedGridProduct(null);
    return () => setIsImmersive(false);
  }, [setIsImmersive, setHeaderColor, activeCategory.color]);



  const nextProduct = () => {
    setActiveProductIndex((prev) => (prev + 1) % activeCategory.products.length);
  };

  const prevProduct = () => {
    setActiveProductIndex((prev) => (prev - 1 + activeCategory.products.length) % activeCategory.products.length);
  };

  return (
    <div
      className="relative min-h-screen font-sans pb-24 transition-colors duration-1000 ease-in-out"
      style={{ backgroundColor: activeCategory.color }}
    >
      {/* Immersive Global Background Glows */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          key={"glow1-" + activeCategory.id}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3], x: [0, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[10%] w-[800px] h-[800px] rounded-full blur-[120px]"
          style={{ background: `radial-gradient(circle, ${activeCategory.color}dd 0%, transparent 70%)`, filter: "brightness(1.2) saturate(1.2)" }}
        />
        <motion.div
          key={"glow2-" + activeCategory.id}
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2], x: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[-10%] right-[5%] w-[700px] h-[700px] rounded-full blur-[120px]"
          style={{ background: `radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)` }}
        />
      </div>

      {/* Premium Hero Section - Cinematic Spotlight Redesign */}
      <motion.section
        ref={heroRef}
        className="relative w-full h-[500px] sm:h-[650px] lg:h-[850px] text-white flex items-center overflow-hidden z-10 bg-transparent"
      >

        {/* Cinematic Background Theme */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Color Tint Overlay */}
          <motion.div
            animate={{ backgroundColor: activeCategory.color }}
            className="absolute inset-0 transition-colors duration-1000 opacity-40"
          />
        </div>

        {/* Category Watermark */}
        <AnimatePresence mode="wait">
          <motion.h2
            key={activeCategory.title}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 0.1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 1.2 }}
            transition={{ duration: 1, ease: "circOut" }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-black text-[18vw] sm:text-[22vw] md:text-[20vw] leading-none select-none pointer-events-none uppercase tracking-tighter opacity-10"
          >
            {activeCategory.title}
          </motion.h2>
        </AnimatePresence>

        {/* Central Spotlight Content */}
        <div className="relative w-full h-full max-w-[1700px] mx-auto px-6 md:px-12 lg:px-24 flex items-center justify-between pointer-events-none">

          {/* Navigation Arrows */}
          <div className="absolute inset-y-0 left-6 md:left-12 flex items-center z-30 pointer-events-auto">
            <button onClick={prevProduct} className="p-4 rounded-full border border-white/20 bg-white/5 backdrop-blur-xl hover:bg-white/20 transition-all active:scale-95 group">
              <motion.span whileHover={{ x: -4 }} className="block">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
              </motion.span>
            </button>
          </div>

          <div className="absolute inset-y-0 right-6 md:right-12 flex items-center z-30 pointer-events-auto">
            {/* Category Selection stays on the far right as requested */}
            <div className="hidden lg:flex flex-col gap-2 w-full max-w-[280px]">
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold mb-4 ml-4 text-white opacity-40">Select Category</h3>
              {categories.map((cat, index) => {
                const isActive = index === activeCategoryIndex;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategoryIndex(index)}
                    style={{ backgroundColor: cat.color, borderColor: cat.color }}
                    className={`relative overflow-hidden flex items-center justify-between px-6 py-4 rounded-2xl border transition-all duration-300 group
                        ${isActive
                        ? 'backdrop-blur-md shadow-xl text-white opacity-100'
                        : 'opacity-50 hover:opacity-100 shadow-md text-white/90'
                      }
                      `}
                  >
                    <div className="relative z-10 flex items-center gap-4">
                      <span
                        className={`w-2 h-2 rounded-full transition-transform ${isActive ? 'scale-125 bg-white' : 'scale-100 bg-white/70 group-hover:bg-white'}`}
                      />
                      <span className={`font-bold tracking-[0.1em] uppercase text-xs text-white`}>
                        {cat.title}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Central Featured Product Spotlight */}
          <div className="w-full flex items-center justify-center pointer-events-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={featuredProduct.id}
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.1, y: -50 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="relative w-56 h-56 sm:w-80 sm:h-80 lg:w-[480px] lg:h-[480px] z-20 pointer-events-auto drop-shadow-2xl"
              >
                {/* Product Image */}
                <div className="absolute inset-0 z-10">
                  <Image src={featuredProduct.image} alt={featuredProduct.name} fill className="object-contain drop-shadow-2xl" />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Variant Circles next to the product as shown in design */}
            <div className="flex flex-col gap-3 ml-8 pointer-events-auto">
              {featuredProduct.variants.slice(0, 3).map((v: ProductVariant, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="w-14 h-14 rounded-full border border-white/20 bg-white/10 backdrop-blur-md flex flex-col items-center justify-center text-white"
                >
                  <span className="text-[10px] font-black uppercase tracking-tighter leading-none">{v.size}</span>
                  <span className="text-[8px] font-bold opacity-60 uppercase">{v.unit}</span>
                </motion.div>
              ))}
              {/* Next Product Dot Navigator */}
              <div className="flex justify-center mt-4 gap-1.5 px-4 h-10 items-center">
                {activeCategory.products.map((_, i) => (
                  <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === activeProductIndex ? "bg-white scale-125 shadow-lg w-4" : "bg-white/20"}`} />
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Side Arrows / Navigation */}
          <div className="absolute inset-y-0 right-6 md:right-12 flex items-center z-30 pointer-events-auto lg:hidden">
            <button onClick={nextProduct} className="p-4 rounded-full border border-white/20 bg-white/5 backdrop-blur-xl hover:bg-white/20 transition-all active:scale-95 group">
              <motion.span whileHover={{ x: 4 }} className="block">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </motion.span>
            </button>
          </div>
        </div>

        {/* Bottom Left Spotlight Details */}
        <div className="absolute bottom-12 left-6 md:left-12 lg:left-24 z-30 max-w-xl pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={"details-" + featuredProduct.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="text-3xl sm:text-5xl lg:text-8xl font-playfair font-black mb-3 lg:mb-6 tracking-tighter drop-shadow-xl leading-[0.9]">
                {featuredProduct.name}
              </h1>
              <p className="max-w-[280px] sm:max-w-lg text-sm sm:text-lg opacity-70 font-inter font-light drop-shadow-sm leading-relaxed line-clamp-2 sm:line-clamp-none">
                {featuredProduct.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>



        {/* Right Arrow for Desktop (Centered) */}
        <div className="hidden lg:flex absolute right-[250px] inset-y-0 items-center z-30 pointer-events-auto">
          <button onClick={nextProduct} className="p-4 rounded-full border border-white/20 bg-white/5 backdrop-blur-xl hover:bg-white/20 transition-all active:scale-95 group">
            <motion.span whileHover={{ x: 4 }} className="block">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </motion.span>
          </button>
        </div>

        {/* Swipe Hint for Mobile */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 lg:hidden pointer-events-none opacity-40">
          <motion.div
            animate={{ x: [-10, 10, -10] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-[10px] font-bold uppercase tracking-[0.2em]"
          >
            Swipe to explore
          </motion.div>
        </div>
      </motion.section>

      {/* Mobile Category Selection Bar */}
      <div className="lg:hidden w-full px-6 py-8 overflow-x-auto scrollbar-hide flex gap-3 z-20 relative">
        {categories.map((cat, index) => {
          const isActive = index === activeCategoryIndex;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryIndex(index)}
              style={{ backgroundColor: cat.color, borderColor: cat.color }}
              className={`relative shrink-0 flex items-center gap-3 px-6 py-3 rounded-xl border transition-all duration-300
                ${isActive
                  ? 'shadow-xl text-white opacity-100 scale-105'
                  : 'opacity-40 text-white/90 scale-100'
                }
              `}
            >
              <span className={`w-1.5 h-1.5 rounded-full bg-white ${isActive ? 'opacity-100' : 'opacity-50'}`} />
              <span className="font-bold tracking-[0.1em] uppercase text-[10px] whitespace-nowrap">
                {cat.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Collection Single View Grid */}
      <section className="max-w-[1700px] mx-auto w-full px-6 md:px-12 py-16">

        {/* Dynamic Section Header */}
        <AnimatePresence mode="wait">
          <motion.div
            key={"header-" + activeCategory.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="mb-10 flex flex-col md:flex-row items-baseline justify-between gap-4 border-b border-white/10 pb-6"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-black font-playfair tracking-tight text-white mb-2">
                {activeCategory.title}
              </h2>
              <p className="text-base text-white/70 font-inter max-w-md">
                {activeCategory.subtitle}
              </p>
            </div>
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-gray-300 whitespace-nowrap">
              {activeCategory.products.length} Products
            </span>
          </motion.div>
        </AnimatePresence>

        {/* Product Grid (Responsive: 2 cols mobile, 3 cols tablet, 5 cols desktop) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={"grid-" + activeCategory.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4 }}
          >
            {activeCategory.products && activeCategory.products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-6 items-stretch">
                {activeCategory.products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    accentColor={activeCategory.color}
                    onSelect={(p) => setSelectedGridProduct(p)}
                  />
                ))}
              </div>
            ) : (
              <div className="w-full py-24 flex items-center justify-center bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10">
                <p className="text-lg text-white/50 font-medium">Products arriving soon...</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Inline Product Detail Section */}
        <AnimatePresence mode="wait">
          {selectedGridProduct && (
            <div className="mt-8">
              <ProductDetailSection
                product={selectedGridProduct}
                categoryTitle={activeCategory.title}
                categoryColor={activeCategory.color}
                onClose={() => setSelectedGridProduct(null)}
              />
            </div>
          )}
        </AnimatePresence>

      </section>
    </div>
  );
}
