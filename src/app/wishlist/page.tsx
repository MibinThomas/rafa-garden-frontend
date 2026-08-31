"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CATEGORIES, Category } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import { useWishlist } from "@/lib/WishlistContext";
import { useCart } from "@/lib/CartContext";
import { Heart, Sparkles, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function WishlistPage() {
  const { wishlistIds, clearWishlist } = useWishlist();
  const { addToCart, openCart } = useCart();
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) setCategories(data);
        }
      } catch (err) {
        console.error("Failed to fetch categories for wishlist:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const allProducts = categories.flatMap(cat => 
    (cat.products || []).map(p => ({ 
      ...p, 
      categoryColor: cat.color || "#c81c6a", 
      categoryTitle: cat.title 
    }))
  );

  const wishlistProducts = allProducts.filter(p => 
    wishlistIds.includes(p.id) || wishlistIds.includes((p as any)._id)
  );

  const handleMoveAllToCart = () => {
    wishlistProducts.forEach(product => {
      const selectedVariant = product.variants?.[0] || { size: "Standard", unit: "", price: 599 };
      const currentPrice = selectedVariant.price || (product as any).offerPrice || (product as any).price || 599;
      addToCart({
        id: `${product.id || (product as any)._id}-0`,
        name: `${product.name} (${selectedVariant.size}${selectedVariant.unit})`.trim(),
        price: currentPrice,
        image: product.image
      }, 1);
    });
    openCart();
  };

  return (
    <div className="min-h-screen bg-[#f1f1f2] font-sans selection:bg-[#c81c6a] selection:text-white">
      <main className="pt-24 md:pt-32 pb-24 px-4 sm:px-6 md:px-12 lg:px-24 max-w-[1600px] mx-auto">
        
        {/* Editorial Hero Banner */}
        <div className="relative mb-8 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10"
          >
            <div className="flex items-center gap-2 mb-2">
              <Heart size={14} fill="#c81c6a" className="text-[#c81c6a]" />
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.4em] text-[#c81c6a]">
                Saved Favourites
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black font-playfair text-[#333335] tracking-tighter leading-none mb-3">
              My Wishlist
            </h1>

            <p className="max-w-xl text-[#5d5f61]/70 text-xs sm:text-sm md:text-base font-normal leading-relaxed">
              Your personal sanctuary of saved heritage botanical products. Review, manage, or transfer items directly to your shopping bag.
            </p>
          </motion.div>

          {/* Watermark BG Text */}
          <div className="absolute top-0 right-0 pointer-events-none opacity-[0.03] select-none -mt-8 hidden lg:block">
            <h1 className="text-[180px] font-black tracking-tighter leading-none text-[#5d5f61]">WISHLIST</h1>
          </div>
        </div>

        {/* Action Bar (When items exist) */}
        {!loading && wishlistProducts.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 mb-8 border-b border-black/5">
            <span className="text-xs font-bold text-[#333] uppercase tracking-widest">
              {wishlistProducts.length} {wishlistProducts.length === 1 ? "Saved Item" : "Saved Items"}
            </span>

            <div className="flex items-center gap-3">
              <button
                onClick={handleMoveAllToCart}
                className="px-5 py-2 rounded-full bg-[#c81c6a] hover:bg-[#b0185c] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <ShoppingBag size={14} />
                <span>Move All To Cart</span>
              </button>

              <button
                onClick={clearWishlist}
                className="px-4 py-2 rounded-full bg-white hover:bg-gray-100 border border-black/10 text-gray-600 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 size={13} />
                <span>Clear All</span>
              </button>
            </div>
          </div>
        )}

        {/* Wishlist Product Grid Layout */}
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
              <p className="text-xs font-bold tracking-widest text-gray-400 capitalize">Loading Wishlist...</p>
            </motion.div>
          ) : wishlistProducts.length > 0 ? (
            <motion.div 
              key="wishlist-grid"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6"
            >
              {wishlistProducts.map((product) => (
                <ProductCard 
                  key={product.id || (product as any)._id}
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
              className="py-20 text-center bg-white/70 backdrop-blur-md rounded-3xl border border-dashed border-gray-200 px-6 max-w-md mx-auto shadow-sm"
            >
              <div className="w-16 h-16 rounded-full bg-[#c81c6a]/10 text-[#c81c6a] flex items-center justify-center mx-auto mb-4">
                <Heart size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-[#1d1d1f] mb-2 font-playfair">Your wishlist is empty</h3>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                Save your favourite botanical crushes, jams, and plants by clicking the heart icon on any product card.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#c81c6a] hover:bg-[#b0185c] text-white text-xs font-bold transition-all shadow-md"
              >
                <span>Explore Boutique</span>
                <ArrowRight size={14} />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
