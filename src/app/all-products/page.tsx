"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CATEGORIES, Product, Category } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import { Search, SlidersHorizontal, LayoutGrid, List } from "lucide-react";

export default function AllProductsPage() {
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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
                         p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || p.categoryTitle === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const uniqueCategoryTitles = ["All", ...new Set(categories.map(c => c.title))];

  return (
    <div className="min-h-screen bg-[#f1f1f2] font-sans">
      <main className="pt-32 pb-24 px-6 md:px-12 lg:px-24 max-w-[1600px] mx-auto">
        {/* Editorial Header */}
        <div className="relative mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#c81c6a] mb-4 block">
              The Botanical Archive
            </span>
            <h1 className="text-5xl md:text-8xl font-black font-playfair text-[#5d5f61] tracking-tighter leading-none mb-8">
              Full Collection
            </h1>
            <p className="max-w-2xl text-[#5d5f61]/60 text-sm md:text-lg font-medium leading-relaxed">
              Explore our complete sanctuary of heritage botanical products. From cold-pressed crushes to artisanal jams, 
              each asset is cultivated with cinematic precision and ancient wisdom.
            </p>
          </motion.div>

          {/* Background Watermark */}
          <div className="absolute top-0 right-0 pointer-events-none opacity-[0.03] select-none -mt-12 hidden md:block">
            <h1 className="text-[200px] font-black tracking-tighter leading-none text-[#5d5f61]">ARCHIVE</h1>
          </div>
        </div>

        {/* Toolbar: Search & Filter */}
        <div className="flex flex-col md:flex-row gap-8 items-center justify-between mb-16 relative z-10 py-6 border-b border-black/5">
          {/* Category Pills */}
          <div className="flex items-center gap-3 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {uniqueCategoryTitles.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  selectedCategory === cat 
                    ? "bg-[#5d5f61] text-white shadow-lg" 
                    : "bg-white text-[#5d5f61] border border-black/5 hover:border-[#c81c6a]/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-6 w-full md:w-auto">
            {/* Search Bar */}
            <div className="relative flex-1 md:w-64 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#c81c6a] transition-colors" size={16} />
              <input 
                type="text"
                placeholder="Search Archive..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-3.5 bg-white rounded-full border border-black/5 outline-none text-[11px] font-bold uppercase tracking-widest focus:ring-4 focus:ring-[#c81c6a]/5 transition-all"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="hidden md:flex items-center bg-white rounded-full border border-black/5 p-1">
              <button 
                onClick={() => setViewMode("grid")}
                className={`p-2.5 rounded-full transition-all ${viewMode === "grid" ? "bg-[#5d5f61] text-white shadow-md" : "text-gray-300 hover:text-[#5d5f61]"}`}
              >
                <LayoutGrid size={18} />
              </button>
              <button 
                onClick={() => setViewMode("list")}
                className={`p-2.5 rounded-full transition-all ${viewMode === "list" ? "bg-[#5d5f61] text-white shadow-md" : "text-gray-300 hover:text-[#5d5f61]"}`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Product Grid/List */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-32 text-center"
            >
              <div className="w-12 h-12 border-4 border-gray-100 border-t-[#c81c6a] rounded-full animate-spin mx-auto mb-6" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Syncing with Garden Database...</p>
            </motion.div>
          ) : filteredProducts.length > 0 ? (
            <motion.div 
              key={viewMode + selectedCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={viewMode === "grid" 
                ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 lg:gap-12" 
                : "flex flex-col gap-8"
              }
            >
              {filteredProducts.map((product) => (
                <div key={product.id} className={viewMode === "list" ? "max-w-4xl mx-auto w-full" : ""}>
                   <ProductCard 
                     product={product} 
                     accentColor={product.categoryColor}
                   />
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-32 text-center bg-white/40 rounded-[4rem] border border-dashed border-gray-200"
            >
              <Search size={48} className="mx-auto mb-6 text-gray-200" strokeWidth={1} />
              <h3 className="text-xl font-bold text-[#5d5f61] mb-2 uppercase tracking-tight">No botanical assets found</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Try refining your search or selecting a different category</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Background Elements */}
        <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
           <motion.div 
             animate={{ rotate: 360 }}
             transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
             className="absolute -top-[10%] -right-[5%] w-[40vw] h-[40vw] bg-[#c81c6a]/5 rounded-full blur-[120px]"
           />
           <motion.div 
             animate={{ rotate: -360 }}
             transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
             className="absolute top-[40%] -left-[10%] w-[30vw] h-[30vw] bg-[#7fa23f]/5 rounded-full blur-[100px]"
           />
        </div>
      </main>
    </div>
  );
}
