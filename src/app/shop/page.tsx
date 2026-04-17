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
  const initialIndex = catParam ? 
    CATEGORIES.findIndex(c => c.title.toLowerCase() === catParam.toLowerCase()) : 
    0;
  const safeInitialIndex = initialIndex === -1 ? 0 : initialIndex;

  // State for active category
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(safeInitialIndex);
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
      const idx = categories.findIndex(c => c.title.toLowerCase() === cat.toLowerCase());
      if (idx !== -1) {
        setActiveCategoryIndex(idx);
      }
    }
  }, [searchParams, categories]);

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
      className="relative min-h-screen font-sans pb-24 transition-colors duration-1000 ease-in-out bg-[#e6e7e8]"
    >
      {/* Editorial Hero Section - High-Fidelity Product Spotlight */}
      <motion.section
        ref={heroRef}
        className="relative w-full h-[100dvh] flex flex-col overflow-hidden z-10 mt-[50px]"
      >
        {/* Background Watermark (Dharma Gothic) */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.h1
              key={activeCategory.title}
              initial={{ opacity: 0, scale: 0.9, y: 100, x: -100 }}
              animate={{ opacity: 0.1, scale: 1.1, y: 0, x: -100 }}
              exit={{ opacity: 0, scale: 1.2, y: -100, x: -100 }}
              transition={{ duration: 0.8, ease: "circOut" }}
              className="text-[150px] sm:text-[200px] md:text-[300px] lg:text-[400px] leading-none text-[#333333] tracking-normal lowercase whitespace-nowrap opacity-5"
              style={{ fontFamily: "'DharmaGothic', sans-serif", fontWeight: 700 }}
            >
              {activeCategory.title}
            </motion.h1>
          </AnimatePresence>
        </div>

        {/* Global Alignment Container (Syncs with Header) */}
        <div className="absolute inset-x-0 top-0 bottom-0 z-40 pointer-events-none">
          <div className="max-w-[1700px] mx-auto w-full h-full relative px-6 md:px-12">

            {/* Title Block - Aligned Left with Logo */}
            <div className="absolute top-[80px] md:top-[112px] left-6 md:left-12 pointer-events-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h1 className="font-brand-heading text-[2.5rem] leading-[1.1] tracking-tight capitalize" style={{ color: activeCategory.color }}>
                    Dragon
                  </h1>
                  <h1 className="font-brand-heading text-[2.5rem] leading-[0.9] tracking-tight capitalize" style={{ color: activeCategory.color }}>
                    {activeCategory.title}
                  </h1>
                  <p className="text-[0.6rem] md:text-[0.7rem] capitalize tracking-[0.2em] text-[#333333]/60 font-avant-garde font-bold mt-4 md:mt-8 max-w-[150px] md:max-w-[200px] leading-relaxed">
                    This is a sample<br />Description for product 1....
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Category Navigation - Aligned Top Right - Hidden on Mobile */}
            <div className="hidden lg:flex absolute top-[88px] right-[124px] md:right-[148px] pointer-events-auto">
              <div className="flex gap-4">
                {categories.map((cat, idx) => {
                  const displayTitle = cat.title;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategoryIndex(idx)}
                      className={`px-8 py-2 rounded-full border transition-all duration-300 font-avant-garde text-[0.7rem] font-bold tracking-[0.15em] uppercase whitespace-nowrap
                        ${activeCategoryIndex === idx
                          ? "bg-white/10 backdrop-blur-md shadow-sm"
                          : "bg-transparent hover:bg-white/5"}
                      `}
                      style={{
                        borderColor: activeCategoryIndex === idx ? cat.color : "rgba(51, 51, 51, 0.2)",
                        color: activeCategoryIndex === idx ? cat.color : "#666666"
                      }}
                    >
                      {displayTitle}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* Central Spotlight Area */}
        <div className="flex-1 relative w-full flex items-center justify-center px-6 md:px-12">

          {/* Navigation Arrows */}
          <button
            onClick={prevProduct}
            className="absolute left-4 md:left-12 p-3.5 rounded-full border border-[#333333]/15 text-[#333333]/40 hover:text-[#333333] hover:bg-white/20 transition-all z-50 group"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 md:w-5 md:h-5 group-active:scale-90 transition-transform"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>

          <button
            onClick={nextProduct}
            className="absolute right-4 md:right-12 p-3.5 rounded-full border border-[#333333]/15 text-[#333333]/40 hover:text-[#333333] hover:bg-white/20 transition-all z-50 group"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 md:w-5 md:h-5 group-active:scale-90 transition-transform"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>

          {/* Main Product Container */}
          <div className="relative flex items-center justify-center w-full max-w-6xl h-full py-12">

            {/* Product Centerpiece - Shifted 100px Left on Desktop */}
            <div className="relative z-20 w-[200px] h-[260px] sm:w-[250px] sm:h-[350px] md:w-[338px] md:h-[52.5vh] max-h-[562px] flex justify-center items-center lg:-translate-x-[100px]">

              {/* Decorative Vertical Text - Bottom aligned parallel lines */}
              <div className="hidden lg:flex absolute bottom-[0px] right-[-260px] flex flex-row items-end gap-1.5 opacity-30 select-none pointer-events-none">
                <span className="text-[14px] font-bold uppercase tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 font-avant-garde whitespace-nowrap">Pure</span>
                <span className="text-[14px] font-bold uppercase tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 font-avant-garde whitespace-nowrap">Botanical</span>
                <span className="text-[14px] font-bold uppercase tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 font-avant-garde whitespace-nowrap">Refreshment</span>
              </div>

              <AnimatePresence mode="wait">
                {/* Decorative Pitayas - Crush Category Only */}
                {activeCategory.title === 'Crush' && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -bottom-10 -left-10 w-[115px] h-[115px] z-10"
                    >
                      <Image src="/images/hero/floatingpitaya.png" alt="" fill className="object-contain" />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -bottom-4 right-10 w-[96px] h-[96px] z-10 rotate-45"
                    >
                      <Image src="/images/hero/floatingpitaya.png" alt="" fill className="object-contain" />
                    </motion.div>
                    <motion.div
                      key={"pitaya-1"}
                      animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute -left-24 top-1/4 w-[77px] h-[77px] z-10"
                    >
                      <Image src="/images/hero/floatingpitaya.png" alt="" fill className="object-contain" />
                    </motion.div>
                    <motion.div
                      key={"pitaya-2"}
                      animate={{ y: [0, 15, 0], rotate: [0, -8, 0] }}
                      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                      className="absolute -right-20 bottom-1/3 w-[86px] h-[86px] z-10"
                    >
                      <Image src="/images/hero/floatingpitaya.png" alt="" fill className="object-contain" />
                    </motion.div>
                  </>
                )}

                {/* Main Image */}
                <motion.div
                  key={featuredProduct.id}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1.05, y: 0 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full h-full z-10"
                >
                  <Image
                    src={featuredProduct.image}
                    alt={featuredProduct.name}
                    fill
                    className="object-contain drop-shadow-[0_45px_100px_rgba(0,0,0,0.3)]"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Grouped Controls */}
        <div className="relative z-50 w-full mb-12 flex items-center justify-center">
          <div className="max-w-[1700px] w-full px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0">
            {/* Description Line (Left) */}
            <div className="max-w-[400px] text-center md:text-left">
              <p className="text-[0.6rem] md:text-[0.65rem] leading-relaxed text-[#333333]/40 font-avant-garde font-medium tracking-wider">
                This is a sample product details must be enter here to<br />show the ui ux design minimal stage
              </p>
            </div>

            {/* Hub (Grouped Right) */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-[#c81c6a]/20 text-[#c81c6a] hover:bg-[#c81c6a] hover:text-white transition-all"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
                <span className="text-2xl font-medium font-avant-garde text-[#333333]/20 w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-[#c81c6a]/20 text-[#c81c6a] hover:bg-[#c81c6a] hover:text-white transition-all"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 md:px-14 py-4 rounded-full font-avant-garde font-bold text-[0.6rem] md:text-[0.65rem] uppercase tracking-[0.2em] bg-[#666666] text-white transition-all hover:bg-[#444444] shadow-xl whitespace-nowrap">
                  Buy Now
                </button>

                <button
                  className="w-full sm:w-auto px-8 md:px-14 py-4 rounded-full font-avant-garde font-bold text-[0.6rem] md:text-[0.65rem] uppercase tracking-[0.2em] text-white transition-all shadow-xl whitespace-nowrap"
                  style={{
                    backgroundColor: activeCategory.color,
                    boxShadow: `0 20px 40px ${activeCategory.color}44`
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
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
            className="relative p-4 sm:p-12 md:p-16 lg:p-20 rounded-[20px] sm:rounded-[31px] overflow-hidden"
          >
            {/* Fixed Background Color */}
            <div
              className="absolute inset-0 bg-[#e6e7e8]"
            />
            {/* Subtle Inner Glow */}
            <div className="absolute inset-0 border border-white/20 rounded-[inherit] pointer-events-none" />

            {activeCategory.products && activeCategory.products.length > 0 ? (
              <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-8 gap-y-12 sm:gap-y-24 items-start">
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
    <Suspense fallback={<div className="min-h-screen bg-[#e6e7e8] flex items-center justify-center">Loading Shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}
