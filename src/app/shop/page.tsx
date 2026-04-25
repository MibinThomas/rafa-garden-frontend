"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CATEGORIES, Product, ProductVariant, Category } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetailSection } from "@/components/ProductDetailSection";
import { useHeaderColor } from "@/lib/HeaderColorContext";
import { useSiteSettings } from "@/lib/SiteSettingsContext";


function ShopContent() {
  const { setIsImmersive, setHeaderColor } = useHeaderColor();
  const { settings } = useSiteSettings();
  const heroRef = useRef<HTMLElement>(null);
  const searchParams = useSearchParams();


  // Dynamic State for categories
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [loading, setLoading] = useState(true);

  // Initial category from query param or settings
  useEffect(() => {
    const catParam = searchParams.get("cat");
    if (catParam) {
      const idx = CATEGORIES.findIndex(c => c.title.toLowerCase() === catParam.toLowerCase());
      if (idx !== -1) setActiveCategoryIndex(idx);
    } else if (settings['shop_default_category_index']) {
      const idx = parseInt(settings['shop_default_category_index']);
      if (!isNaN(idx)) setActiveCategoryIndex(idx);
    }
  }, [searchParams, settings]);

  // State for active category
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

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
    // Reset product index when category changes based on featured product setting
    if (activeCategory.desktopFeaturedProductId) {
      const featIdx = activeCategory.products.findIndex((p: any) => p.id === activeCategory.desktopFeaturedProductId);
      if (featIdx !== -1) setActiveProductIndex(featIdx);
      else setActiveProductIndex(0);
    } else {
      setActiveProductIndex(0);
    }

    setSelectedGridProduct(null);
    return () => setIsImmersive(false);
  }, [setIsImmersive, setHeaderColor, activeCategory.color, activeCategory.desktopFeaturedProductId, activeCategory.products]);


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
        {/* Mobile-Only Elements - Hidden on Desktop */}
        <div className="lg:hidden absolute inset-0 z-40 pointer-events-none">
          <div className="relative w-full h-full px-6 py-12">

            {/* Top Category Selection (Mobile Mockup Style) */}
            <div className="absolute top-[30px] left-0 w-full pointer-events-auto">
              <div className="flex gap-2.5 px-6 justify-center overflow-x-auto scrollbar-hide py-2">
                {categories.map((cat, idx) => {
                  const isActive = activeCategoryIndex === idx;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategoryIndex(idx)}
                      className="px-5 py-2 rounded-full border transition-all duration-300 font-bold uppercase tracking-widest text-[8.5px] whitespace-nowrap"
                      style={{
                        borderColor: cat.color,
                        color: isActive ? cat.color : '#666c75',
                        backgroundColor: '#f1f1f2',
                        opacity: isActive ? 1 : 0.8
                      }}
                    >
                      {cat.title}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Top Left Title Block (Mobile) */}
            <div className="absolute top-[110px] left-8 pointer-events-none">
              <AnimatePresence mode="wait">
                <motion.div
                  key={"title-mob-" + activeCategory.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1 className="font-avant-garde text-[2.52rem] leading-[1.05] tracking-tight drop-shadow-sm font-bold"
                    style={{ color: settings['shop_mobile_title_color'] || '#6C6D71' }}
                  >
                    {settings['shop_hero_heading_prefix'] || "Dragon"}<br />
                    <span style={{ color: activeCategory.color }}>{activeCategory.title}</span>
                  </h1>

                  <p className="text-[0.65rem] font-bold tracking-widest text-black/40 uppercase mt-2 font-avant-garde">
                    {activeCategory.subtitle || "This is a sample product details must"}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="absolute bottom-[60px] left-8 pointer-events-auto z-50">
              <h2 className="font-avant-garde font-bold text-[1.8rem] leading-[1.1] mb-2 whitespace-pre-line"
                style={{ color: settings['shop_mobile_bottom_text_color'] || '#787877' }}
              >
                {settings['shop_mobile_heading'] || "Pure\nBotanical\nRefreshment"}
              </h2>
              <p className="text-[0.6rem] leading-relaxed font-avant-garde font-bold max-w-[150px]"
                style={{ color: settings['shop_mobile_bottom_text_color'] || '#787877' }}
              >
                {settings['shop_mobile_description'] || "This is a sample product details must be enter here to show the ui ux design minimal stage"}
              </p>
            </div>


          </div>
        </div>

        {/* Mobile Dynamic Category Backdrop (Mobile Only) */}
        <div className="lg:hidden absolute inset-0 z-0 px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={"bg-" + activeCategory.title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative w-full h-full"
            >
              <Image
                src={
                  (activeCategory as any).mobileHeroImage || (
                    activeCategory.title.toLowerCase() === 'crush' ? "/images/hero/shopherocrush.webp" :
                      activeCategory.title.toLowerCase() === 'jams' ? "/images/hero/jam_premium.png" :
                        activeCategory.title.toLowerCase() === 'fruits' ? "/products/Dragon fruit png.webp" :
                          activeCategory.title.toLowerCase() === 'plants' ? "/images/hero/Plant.webp" :
                            "/images/hero/shopherocrush.webp" // Default
                  )
                }

                alt={`${activeCategory.title} backdrop`}
                fill
                className="object-contain" // Using contain to maintain aspect ratio without cropping away from the text areas
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Background Watermark (Dharma Gothic) - Properly Hidden on Mobile */}
        <div className="hidden lg:flex absolute inset-0 z-0 items-center justify-center pointer-events-none overflow-hidden">
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

            {/* Category Navigation - Aligned Top Right - Hidden on Mobile */}
            <div className="hidden lg:flex absolute top-[88px] right-[124px] md:right-[148px] pointer-events-auto">
              <div className="flex gap-3">
                {categories.map((cat, idx) => {
                  const displayTitle = cat.title;
                  const isActive = activeCategoryIndex === idx;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategoryIndex(idx)}
                      className={`px-7 py-2 rounded-full border transition-all duration-300 font-avant-garde text-[0.7rem] font-bold tracking-[0.15em] uppercase whitespace-nowrap
                        ${isActive
                          ? "shadow-sm"
                          : "hover:bg-white/5"}
                      `}
                      style={{
                        borderColor: cat.color,
                        color: isActive ? cat.color : '#666c75',
                        backgroundColor: '#f1f1f2',
                        opacity: isActive ? 1 : 0.8
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

        {/* Central Spotlight Area - Desktop View */}
        <div className="hidden lg:flex flex-1 relative w-full items-center justify-center px-6 md:px-12">

          {/* Navigation Arrows */}
          <button
            onClick={prevProduct}
            className="hidden lg:flex absolute left-4 md:left-12 p-3.5 rounded-full border border-[#333333]/15 text-[#333333]/40 hover:text-[#333333] hover:bg-white/20 transition-all z-50 group items-center justify-center"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 md:w-5 md:h-5 group-active:scale-90 transition-transform"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>

          <button
            onClick={nextProduct}
            className="hidden lg:flex absolute right-4 md:right-12 p-3.5 rounded-full border border-[#333333]/15 text-[#333333]/40 hover:text-[#333333] hover:bg-white/20 transition-all z-50 group items-center justify-center"
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

        {/* Central Spotlight Area - Mobile View removed centerpiece as per user request */}
        <div className="lg:hidden flex-1 relative w-full flex items-center justify-center px-6">
          {/* Front product images removed on mobile */}
        </div>


      </motion.section>

      {/* Mobile Category Selection Bar removed as per user request to use Top Pills only */}

      {/* Active Collection Single View Grid */}
      < section className="max-w-[1700px] mx-auto w-full px-0 md:px-12 pt-16 pb-8" >

        {/* Dynamic Section Header - Hidden on Mobile/Tab as per user request */}
        < AnimatePresence mode="wait" >
          <motion.div
            key={"header-" + activeCategory.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="hidden lg:flex mb-10 flex flex-col md:flex-row items-baseline justify-between gap-4 border-b border-white/10 pb-6"
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
            className="relative p-0 sm:p-12 md:p-16 lg:p-20 rounded-[20px] sm:rounded-[31px] overflow-hidden"
          >
            {/* Fixed Background Color */}
            <div
              className="absolute inset-0 bg-[#e6e7e8]"
            />
            {/* Subtle Inner Glow */}
            <div className="absolute inset-0 border border-white/20 rounded-[inherit] pointer-events-none" />

            {activeCategory.products && activeCategory.products.length > 0 ? (
              <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-x-2 md:gap-x-8 gap-y-12 sm:gap-y-24 items-start">
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
