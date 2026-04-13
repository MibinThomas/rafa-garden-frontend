"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CATEGORIES, Product, ProductVariant, Category } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetailSection } from "@/components/ProductDetailSection";
import { useHeaderColor } from "@/lib/HeaderColorContext";

function ShopContent() {
  const { setIsImmersive, setHeaderColor } = useHeaderColor();
  const heroRef = useRef<HTMLElement>(null);
  const searchParams = useSearchParams();

  // Dynamic State for categories
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [loading, setLoading] = useState(true);

  // Initial category from query param
  const catParam = searchParams.get("cat");
  const initialIndex = catParam ? parseInt(catParam) : 0;

  // State for active category
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(initialIndex);
  const activeCategory = categories[activeCategoryIndex] || CATEGORIES[0];

  // State for spotlight featured product
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const featuredProduct = activeCategory.products[activeProductIndex] || activeCategory.products[0];

  // State for inline details section
  const [selectedGridProduct, setSelectedGridProduct] = useState<Product | null>(null);

  // State for quantity selection
  const [quantity, setQuantity] = useState(2);
  // State for selected size
  const [selectedSize, setSelectedSize] = useState("500ml");

  useEffect(() => {
    // Update active category if query param changes
    const cat = searchParams.get("cat");
    if (cat !== null) {
      const idx = parseInt(cat);
      if (!isNaN(idx) && idx >= 0 && idx < categories.length) {
        setActiveCategoryIndex(idx);
      }
    }
  }, [searchParams, categories.length]);

  useEffect(() => {
    // Fetch live categories from database
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await res.json();
            if (data && data.length > 0) {
              setCategories(data);
            }
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

  // Carousel product switching logic
  const nextProduct = () => {
    setActiveProductIndex((prev) => (prev + 1) % activeCategory.products.length);
  };

  const prevProduct = () => {
    setActiveProductIndex((prev) => (prev - 1 + activeCategory.products.length) % activeCategory.products.length);
  };

  return (
    <div
      className="relative min-h-screen font-sans pb-24 transition-colors duration-1000 ease-in-out bg-[#f1f1f2]"
    >
      {/* Editorial Hero Section - High-Fidelity Product Spotlight */}
      <motion.section
        ref={heroRef}
        className="relative w-full h-[100dvh] flex flex-col overflow-hidden z-10"
      >
        {/* Background Watermark (Dharma Gothic) */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.h1
              key={activeCategory.title}
              initial={{ opacity: 0, scale: 0.9, y: 100 }}
              animate={{ opacity: 0.1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.1, y: -100 }}
              transition={{ duration: 0.8, ease: "circOut" }}
              className="font-brand-heading text-[14vw] leading-none text-[#333333] tracking-tighter"
            >
              {activeCategory.title}
            </motion.h1>
          </AnimatePresence>
        </div>

        {/* Selection Area (Top Right Viewport Hub) */}
        <div className="absolute top-32 right-6 md:right-12 lg:right-[200px] z-30 flex flex-col gap-10 items-end">

          {/* Category Navigation - Horizontal Row */}
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {categories.map((cat, idx) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryIndex(idx)}
                className={`px-8 py-2 rounded-full border transition-all duration-300 transform font-avant-garde text-[0.7rem] font-bold tracking-widest uppercase whitespace-nowrap
                  ${activeCategoryIndex === idx
                    ? "bg-white/10 backdrop-blur-md shadow-sm text-[#333333]"
                    : "bg-transparent text-[#333333]/30 hover:text-[#333333]/60"}
                `}
                style={{
                  borderColor: activeCategoryIndex === idx ? cat.color : "rgba(51, 51, 51, 0.15)",
                  color: activeCategoryIndex === idx ? cat.color : undefined
                }}
              >
                {cat.title}
              </button>
            ))}
          </div>

          {/* Size Selector - Vertical Stack as Circular Pills */}
          <div className="flex flex-col items-center gap-6">
            {["500ml", "200ml", "100ml"].map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 font-avant-garde text-[0.6rem] font-bold tracking-tight
                  ${selectedSize === size
                    ? "bg-white shadow-xl scale-110 border-transparent text-[#333333]"
                    : "bg-white/5 text-[#333333]/20 hover:text-[#333333]/40 border-[#333333]/5"}
                `}
                style={{
                  borderColor: selectedSize === size ? activeCategory.color : undefined,
                  color: selectedSize === size ? activeCategory.color : undefined
                }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Title Block (Top Left - High Fidelity) - Aligned to category navigator */}
        <div className="absolute top-48 left-6 md:left-12 lg:left-[200px] z-30">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory.id + featuredProduct.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2
                className="text-4xl md:text-5xl font-heading leading-[0.85] mb-2 text-left transition-colors duration-500"
                style={{ color: activeCategory.color }}
              >
                Dragon<br />{activeCategory.title}
              </h2>
              <p className="text-[0.6rem] uppercase tracking-[0.2em] text-[#333333]/40 font-avant-garde font-bold max-w-[180px]">
                {featuredProduct.description.slice(0, 80)}...
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Central Spotlight Area */}
        <div className="flex-1 relative w-full flex items-center justify-center px-6 md:px-12">

          {/* Navigation Arrows - Product Switching */}
          <button
            onClick={prevProduct}
            className="absolute left-6 md:left-12 p-3 rounded-full border border-[#333333]/10 bg-white/5 hover:bg-white/20 transition-all z-40 opacity-30 hover:opacity-100 group"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-active:scale-90 transition-transform"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>

          <button
            onClick={nextProduct}
            className="absolute right-6 md:right-12 p-3 rounded-full border border-[#333333]/10 bg-white/5 hover:bg-white/20 transition-all z-40 opacity-30 hover:opacity-100 group"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-active:scale-90 transition-transform"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>

          {/* Main Product Container */}
          <div className="relative flex items-center justify-center w-full max-w-6xl h-full py-12">

            {/* Product Centerpiece */}
            <div className="relative z-20 w-[300px] h-[400px] md:w-[400px] md:h-[60vh] max-h-[650px]">

              {/* Decorative Vertical Text - "Pure Botanical Refreshment" */}
              <div className="absolute -right-24 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 opacity-20 pointer-events-none select-none z-0">
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] [writing-mode:vertical-rl] rotate-180">Pure</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] [writing-mode:vertical-rl] rotate-180">Botanical</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] [writing-mode:vertical-rl] rotate-180">Refreshment</span>
              </div>

              <AnimatePresence mode="wait">
                {/* Floating Pitayas (Decorative) */}
                <motion.div
                  key={"pitaya-1-" + activeCategory.id}
                  animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -left-12 top-1/4 w-24 h-24 z-10"
                >
                  <Image src="/images/hero/floatingpitaya.png" alt="" fill className="object-contain" />
                </motion.div>
                <motion.div
                  key={"pitaya-2-" + activeCategory.id}
                  animate={{ y: [0, 15, 0], rotate: [0, -8, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -right-8 bottom-1/4 w-32 h-32 z-10"
                >
                  <Image src="/images/hero/floatingpitaya.png" alt="" fill className="object-contain" />
                </motion.div>

                {/* Main Image */}
                <motion.div
                  key={featuredProduct.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  className="relative w-full h-full z-10"
                >
                  <Image src={featuredProduct.image} alt={featuredProduct.name} fill className="object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.25)]" />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Controls and Buy Action */}
        <div className="relative z-30 w-full pb-10 px-6 md:px-12 lg:px-24 grid grid-cols-1 md:grid-cols-2 items-center">
          {/* Description Snippet (Left) */}
          <div className="max-w-[200px] hidden md:block">
            <p className="text-[0.6rem] leading-relaxed text-[#333333]/30 font-avant-garde font-bold uppercase tracking-wider">
              {featuredProduct.description.slice(0, 80)}...
            </p>
          </div>

          {/* Action Hub (Right) */}
          <div className="flex justify-end items-center gap-10">
            {/* Quantity Selector - Moved next to Buy Now */}
            <div className="flex items-center gap-6">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-[#333333]/10 text-[#333333]/20 hover:border-[#333333]/30 hover:text-[#333333]/60 transition-all"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </button>
              <span className="text-2xl font-light font-avant-garde text-[#333333]/20 w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-[#333333]/10 text-[#333333]/20 hover:border-[#333333]/30 hover:text-[#333333]/60 transition-all"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </button>
            </div>

            {/* Buy Now Button */}
            <button
              className="text-white px-10 py-4 rounded-full font-avant-garde font-bold text-sm transition-all shadow-xl hover:scale-105 active:scale-95"
              style={{
                backgroundColor: activeCategory.color,
                boxShadow: `0 20px 40px ${activeCategory.color}33`
              }}
            >
              Buy Now
            </button>
          </div>
        </div>
      </motion.section>

      {/* Mobile Category Selection Bar */}
      <div className="lg:hidden w-full px-6 py-8 overflow-x-auto scrollbar-hide flex gap-3 z-20 relative">
        {categories.map((cat: Category, index: number) => {
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
        })
        }
      </div >

      {/* Active Collection Single View Grid */}
      < section className="max-w-[1700px] mx-auto w-full px-6 md:px-12 pt-16 pb-8" >

        {/* Dynamic Section Header */}
        < AnimatePresence mode="wait" >
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
        </AnimatePresence >

        {/* Product Grid Wrapper with Premium Rounded Container */}
        < AnimatePresence mode="wait" >
          <motion.div
            key={"grid-container-" + activeCategory.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
            className="relative p-6 sm:p-12 md:p-16 lg:p-20 rounded-[3rem] sm:rounded-[5rem] overflow-hidden"
          >
            {/* Fixed Background Color */}
            <div
              className="absolute inset-0 bg-[#f1f1f2]"
            />
            {/* Subtle Inner Glow */}
            <div className="absolute inset-0 border border-white/20 rounded-[inherit] pointer-events-none" />

            {activeCategory.products && activeCategory.products.length > 0 ? (
              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-24 items-start">
                {activeCategory.products.map((product: Product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    accentColor={activeCategory.color}
                    onSelect={(p) => setSelectedGridProduct(p)}
                  />
                ))}
              </div>
            ) : (
              <div className="relative z-10 w-full py-32 flex items-center justify-center bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white/10">
                <p className="text-xl text-white/40 font-bold uppercase tracking-widest">Collection arriving soon...</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence >

        {/* Inline Product Detail Section */}
        < AnimatePresence mode="wait" >
          {selectedGridProduct && (
            <div className="mt-8">
              <ProductDetailSection
                product={selectedGridProduct}
                categoryTitle={activeCategory.title}
                categoryColor={activeCategory.color}
                onClose={() => setSelectedGridProduct(null)}
              />
            </div>
          )
          }
        </AnimatePresence >
      </section >
    </div >
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f1f1f2] flex items-center justify-center">Loading Shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}
