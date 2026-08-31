"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CATEGORIES, Category } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import { Search, Sparkles, Filter, Package, ChevronDown } from "lucide-react";
import { useSearchParams } from "next/navigation";

function ShopContent() {
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const searchParams = useSearchParams();

  useEffect(() => {
    const searchFromUrl = searchParams.get("search") || searchParams.get("q");
    const catFromUrl = searchParams.get("cat") || searchParams.get("category");

    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
    }
    if (catFromUrl) {
      const match = CATEGORIES.find(
        (c) => c.title.toLowerCase() === catFromUrl.toLowerCase()
      );
      if (match) {
        setSelectedCategory(match.title);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) setCategories(data);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const allProducts = categories.flatMap(cat => 
    cat.products.map(p => ({ 
      ...p, 
      categoryColor: cat.color, 
      categoryTitle: cat.title 
    }))
  );

  const filteredProducts = allProducts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (p.subtitle && p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || p.categoryTitle === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const uniqueCategoryTitles = ["All", ...new Set(categories.map(c => c.title))];

  const getCategoryCount = (title: string) => {
    if (title === "All") return allProducts.length;
    return allProducts.filter(p => p.categoryTitle === title).length;
  };

  return (
    <main className="pt-24 md:pt-32 pb-24 px-4 sm:px-6 md:px-12 lg:px-24 max-w-[1600px] mx-auto">
      {/* Editorial Hero Banner */}
      <div className="relative mb-6 md:mb-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={14} className="text-[#c81c6a]" />
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.4em] text-[#c81c6a]">
              The Botanical Sanctuary
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black font-playfair text-[#333335] tracking-tighter leading-none mb-3">
            Shop Collection
          </h1>

          <p className="max-w-xl text-[#5d5f61]/70 text-xs sm:text-sm md:text-base font-normal leading-relaxed">
            Discover our complete sanctuary of heritage botanical products. Handcrafted cold-pressed crushes, artisanal preserves, and saplings.
          </p>
        </motion.div>

        {/* Watermark BG Text */}
        <div className="absolute top-0 right-0 pointer-events-none opacity-[0.03] select-none -mt-8 hidden lg:block">
          <h1 className="text-[180px] font-black tracking-tighter leading-none text-[#5d5f61]">BOUTIQUE</h1>
        </div>
      </div>

      {/* Compact Filter & Search Toolbar (Non-sticky natural scrolling) */}
      <div className="relative z-10 py-2.5 mb-6 border-b border-black/5 transition-all">
        <div className="flex flex-row items-center justify-between gap-2.5">
          
          {/* Category Dropdown List (Mobile & Desktop) */}
          <div className="relative flex-1 sm:flex-initial min-w-[150px] sm:min-w-[220px]">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#c81c6a] pointer-events-none flex items-center gap-1 z-10">
              <Filter size={13} strokeWidth={2.5} />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-white rounded-full border border-black/10 text-xs font-bold text-[#333335] outline-none appearance-none cursor-pointer focus:border-[#c81c6a] focus:ring-2 focus:ring-[#c81c6a]/10 transition-all shadow-xs"
            >
              {uniqueCategoryTitles.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "All" ? `All Categories (${getCategoryCount("All")})` : `${cat} (${getCategoryCount(cat)})`}
                </option>
              ))}
            </select>

            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Desktop Category Pills (Hidden on Small Screens to prevent sticky overlap) */}
          <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {uniqueCategoryTitles.map((cat) => {
              const isActive = selectedCategory === cat;
              const count = getCategoryCount(cat);
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isActive 
                      ? "bg-[#c81c6a] text-white shadow-xs" 
                      : "bg-white text-[#5d5f61] border border-black/5 hover:border-[#c81c6a]/30 hover:text-[#c81c6a]"
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? "bg-white/20 text-white" : "bg-black/5 text-gray-400"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input Bar */}
          <div className="relative flex-1 sm:w-64 sm:flex-initial">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
            <input 
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-white rounded-full border border-black/10 outline-none text-xs font-medium text-[#333] placeholder-gray-400 focus:border-[#c81c6a] focus:ring-2 focus:ring-[#c81c6a]/10 transition-all shadow-xs"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Product Grid Layout */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-24 text-center"
          >
            <div className="w-10 h-10 border-3 border-gray-200 border-t-[#c81c6a] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs font-bold tracking-widest text-gray-400 capitalize">Fetching Products...</p>
          </motion.div>
        ) : filteredProducts.length > 0 ? (
          <motion.div 
            key={selectedCategory + searchQuery}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6"
          >
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id}
                product={product} 
                accentColor={product.categoryColor}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-20 text-center bg-white/60 rounded-3xl border border-dashed border-gray-200 px-4 max-w-md mx-auto"
          >
            <Package size={40} className="mx-auto mb-4 text-gray-300" strokeWidth={1.5} />
            <h3 className="text-lg font-bold text-[#333] mb-1">No products found</h3>
            <p className="text-xs text-gray-500 mb-6">We couldn't find any products matching "{searchQuery || selectedCategory}"</p>
            <button
              onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }}
              className="px-6 py-2.5 rounded-full bg-[#c81c6a] text-white text-xs font-bold hover:bg-[#b0185a] transition-all"
            >
              Reset Filters
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default function AllProductsPage() {
  return (
    <div className="min-h-screen bg-[#f1f1f2] font-sans selection:bg-[#c81c6a] selection:text-white">
      <Suspense fallback={
        <div className="py-32 text-center text-xs font-bold text-gray-400">Loading Sanctuary...</div>
      }>
        <ShopContent />
      </Suspense>
    </div>
  );
}

