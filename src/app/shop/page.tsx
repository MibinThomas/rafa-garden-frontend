"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CATEGORIES } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import { useHeaderColor } from "@/lib/HeaderColorContext";

export default function ShopPage() {
  const { setIsImmersive, setHeaderColor } = useHeaderColor();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  
  // State for active category
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const activeCategory = CATEGORIES[activeCategoryIndex];

  useEffect(() => {
    // Disable immersive hero specific behaviors globally for the shop page
    setIsImmersive(true);
    // Dynamically lock header color to active category
    setHeaderColor(activeCategory.color); 
    return () => setIsImmersive(false);
  }, [setIsImmersive, setHeaderColor, activeCategory.color]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
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
      {/* Premium Hero Section (Breadcrumb) - Dynamic Color */}
      <motion.section 
        ref={heroRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="relative w-full text-white pt-24 md:pt-28 pb-8 px-6 md:px-12 lg:px-24 flex flex-col md:flex-row items-center justify-between text-left overflow-hidden cursor-crosshair z-10 bg-transparent"
      >
        
        {/* Ambient Glows (Dragon Fruit vibes) */}
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen pointer-events-none">
           <motion.div 
             animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3], x: [0, 30, 0] }}
             transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
             className="absolute top-[10%] left-[20%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(255,0,127,0.2)_0%,transparent_70%)] blur-[60px]"
           />
           <motion.div 
             animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2], x: [0, -30, 0] }}
             transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
             className="absolute bottom-0 right-[10%] w-[350px] h-[350px] rounded-full bg-[radial-gradient(circle,rgba(181,229,91,0.15)_0%,transparent_70%)] blur-[60px]"
           />
        </div>

        {/* Fluid Mouse Cursor Glow */}
        <motion.div 
          className="absolute z-0 pointer-events-none rounded-full blur-[80px]"
          animate={{
            x: mousePosition.x - 250, // Center the 500px circle on cursor
            y: mousePosition.y - 250,
            opacity: isHovering ? 0.8 : 0,
            scale: isHovering ? 1 : 0.8,
          }}
          transition={{ type: "tween", ease: "backOut", duration: 0.5 }}
          style={{
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, rgba(255,255,255,0.25) 0%, transparent 60%)",
            mixBlendMode: "screen",
          }}
        />

        {/* Left Side Content */}
        <div className="relative z-10 w-full md:w-1/2 pt-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-black mb-3 tracking-tight drop-shadow-md">
            Shop Our <span className="opacity-90 italic">Collections</span>
          </h1>
          <p className="max-w-lg text-sm opacity-80 font-inter font-light drop-shadow-sm leading-relaxed">
            Discover a world of vibrant flavors and lush greenery. Freshness cultivated from our gardens straight to your premium lifestyle.
          </p>
        </div>

        {/* Right Side Navigation Basket */}
        <div className="relative z-20 w-full md:w-1/2 flex md:justify-end mt-8 md:mt-0 pointer-events-auto">
          <div className="flex flex-col gap-2 w-full max-w-[280px]">
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold mb-2 ml-4 text-white">Select Category</h3>
            {CATEGORIES.map((cat, index) => {
              const isActive = index === activeCategoryIndex;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategoryIndex(index)}
                  className={`relative overflow-hidden flex items-center justify-between px-6 py-3.5 rounded-2xl border transition-all duration-300 group
                    ${isActive 
                      ? 'bg-white/20 backdrop-blur-md border-white shadow-lg' 
                      : 'bg-transparent border-white/20 hover:bg-white/10 hover:border-white/40'
                    }
                  `}
                >
                  <div className="relative z-10 flex items-center gap-4">
                    <span 
                      className={`w-3 h-3 rounded-full transition-transform bg-white ${isActive ? 'scale-125' : 'scale-100 group-hover:scale-110'}`} 
                    />
                    <span className={`font-bold tracking-widest uppercase text-sm ${isActive ? 'text-white' : 'text-white/80 group-hover:text-white'}`}>
                      {cat.title}
                    </span>
                  </div>
                  
                  {isActive && (
                     <span className="relative z-10 text-[0.65rem] font-bold bg-white/30 text-white px-2 py-0.5 rounded-full">
                       {cat.products.length} items
                     </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Active Collection Single View Grid */}
      <section className="max-w-[1700px] mx-auto w-full px-6 md:px-12 py-16">
        
        {/* Dynamic Section Header */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={"header-" + activeCategory.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="mb-10 flex flex-col md:flex-row items-baseline justify-between gap-4 border-b border-white/10 pb-6"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-black font-playfair tracking-tight text-white mb-2">
                {activeCategory.title}
              </h2>
              <p className="text-base text-white/60 font-inter max-w-md">
                {activeCategory.subtitle}
              </p>
            </div>
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-white/40 whitespace-nowrap">
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
                   <ProductCard key={product.id} product={product} accentColor={activeCategory.color} />
                 ))}
               </div>
            ) : (
               <div className="w-full py-24 flex items-center justify-center bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10">
                 <p className="text-lg text-white/50 font-medium">Products arriving soon...</p>
               </div>
            )}
          </motion.div>
        </AnimatePresence>

      </section>
    </div>
  );
}
