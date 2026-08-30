"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useCart } from "@/lib/CartContext";
import { useWishlist } from "@/lib/WishlistContext";
import { Product } from "@/lib/data";
import { Heart, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function ProductCard({ product, accentColor = "#c81c6a", onSelect }: { product: Product, accentColor?: string, onSelect?: (product: Product) => void }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const router = useRouter();
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const selectedVariant = product.variants[selectedVariantIdx] || { size: "Standard", unit: "", price: 599 };
  const currentPrice = selectedVariant.price || 599.00;
  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: `${product.id}-${selectedVariantIdx}`,
      name: `${product.name} (${selectedVariant.size} ${selectedVariant.unit})`.trim(),
      price: currentPrice,
      image: product.image
    }, quantity);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: `${product.id}-${selectedVariantIdx}`,
      name: `${product.name} (${selectedVariant.size} ${selectedVariant.unit})`.trim(),
      price: currentPrice,
      image: product.image
    }, quantity);
    router.push("/checkout");
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      className="group relative flex flex-col justify-between bg-[#f1f1f2] rounded-2xl sm:rounded-3xl p-3 sm:p-4 transition-all duration-300 h-full w-full"
    >
      {/* Wishlist Favorite Button */}
      <button
        onClick={handleWishlist}
        aria-label="Add to wishlist"
        className={`absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 z-30 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all ${
          isFavorited 
            ? "bg-[#c81c6a] text-white shadow-md shadow-[#c81c6a]/30 scale-105" 
            : "bg-[#f1f1f2] border border-black/10 text-gray-400 hover:text-[#c81c6a] hover:bg-white"
        } active:scale-90`}
      >
        <Heart
          size={13}
          fill={isFavorited ? "currentColor" : "none"}
          strokeWidth={2}
        />
      </button>

      {/* Product Image Link */}
      <Link
        href={`/product/${product.id}`}
        className="relative w-full aspect-square sm:aspect-[4/5] flex items-center justify-center p-2 rounded-xl sm:rounded-2xl bg-[#f1f1f2] mb-3 transition-colors overflow-hidden"
      >
        <motion.div
          className="relative w-[85%] h-[85%]"
          whileHover={{ scale: 1.08, y: -4 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.12)]"
            priority
          />
        </motion.div>
      </Link>

      {/* Product Information */}
      <div className="flex flex-col mt-auto w-full">
        {/* Title */}
        <Link href={`/product/${product.id}`} className="block mb-1.5 group/title">
          <h3 className="text-xs sm:text-base font-bold text-[#333335] group-hover/title:text-[#c81c6a] transition-colors leading-tight line-clamp-1">
            {product.name}
          </h3>
          <p className="text-[10px] sm:text-xs text-[#88888a] line-clamp-1 font-medium mt-0.5">
            {product.subtitle || "Nature's Sweetness"}
          </p>
        </Link>

        {/* Variant Pills & Quantity Row */}
        <div className="flex items-center justify-between gap-1.5 my-2.5 py-1.5 border-y border-black/[0.04]">
          {/* Variants Selection */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {product.variants.map((v, idx) => {
              const isActive = selectedVariantIdx === idx;
              return (
                <button
                  key={idx}
                  onClick={(e) => { e.stopPropagation(); setSelectedVariantIdx(idx); }}
                  className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold transition-all shrink-0 ${
                    isActive 
                      ? "bg-[#c81c6a] text-white shadow-xs" 
                      : "bg-white/60 text-gray-500 hover:bg-white"
                  }`}
                >
                  {v.size}{v.unit}
                </button>
              );
            })}
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-1 shrink-0 bg-white/60 rounded-lg p-0.5">
            <button
              onClick={(e) => { e.stopPropagation(); if (quantity > 1) setQuantity(prev => prev - 1); }}
              className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-md bg-white text-gray-600 shadow-xs hover:bg-gray-50 active:scale-90 transition-all border border-black/5"
            >
              <Minus size={10} strokeWidth={2.5} />
            </button>
            <span className="text-[10px] sm:text-xs font-bold text-gray-700 px-1 min-w-[14px] text-center">
              {quantity}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); setQuantity(prev => prev + 1); }}
              className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-md bg-white text-gray-600 shadow-xs hover:bg-gray-50 active:scale-90 transition-all border border-black/5"
            >
              <Plus size={10} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="flex items-center justify-between gap-2 mt-1">
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Price</span>
            <span className="text-sm sm:text-lg font-black text-[#222] font-playfair tracking-tight">
              ₹{currentPrice.toFixed(0)}
            </span>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleAddToCart}
              title="Add to Cart"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-300 text-gray-700 hover:border-[#c81c6a] hover:text-[#c81c6a] hover:bg-[#c81c6a]/5 transition-all flex items-center justify-center active:scale-90 bg-white/40"
            >
              <ShoppingBag size={14} strokeWidth={2} />
            </button>

            <button
              onClick={handleBuyNow}
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#c81c6a] text-white text-[10px] sm:text-xs font-bold tracking-wider capitalize hover:bg-[#b0185a] transition-all active:scale-95 shadow-md shadow-[#c81c6a]/20 flex items-center gap-1"
            >
              <span>Buy</span>
              <ArrowRight size={11} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
