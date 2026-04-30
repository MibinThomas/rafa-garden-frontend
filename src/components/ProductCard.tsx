"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useCart } from "@/lib/CartContext";
import { useWishlist } from "@/lib/WishlistContext";
import { Product } from "@/lib/data";
import { Heart, Plus, Minus } from "lucide-react";
import Link from "next/link";

export function ProductCard({ product, accentColor = "#c81c6a", onSelect }: { product: Product, accentColor?: string, onSelect?: (product: Product) => void }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

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

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };



  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative flex flex-col h-full bg-[#f1f1f2] p-3 md:p-6 rounded-[24px] md:rounded-[32px] transition-all duration-500 hover:bg-[#f1f1f2] hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)]"
    >
      {/* Top: Image Stage */}
      <div className="relative w-full aspect-[4/5] flex items-center justify-center mb-4 md:mb-6">
        {/* Wishlist Heart Icon - Top Right */}
        <button
          onClick={handleWishlist}
          className="absolute top-0 right-0 z-30 w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-transparent border border-black/10 transition-all hover:scale-110 active:scale-90"
        >
          <Heart
            size={isDesktop ? 22 : 16}
            fill={isFavorited ? "#c21e5c" : "#b0b0b0"}
            className={isFavorited ? "text-[#c21e5c]" : "text-[#b0b0b0]"}
            strokeWidth={1.5}
          />
        </button>

        {/* Product Image */}
        <Link
          href={`/product/${product.id}`}
          className="relative w-full h-full flex items-center justify-center cursor-pointer z-10"
        >
          <motion.div
            className="relative w-[80%] h-[85%]"
            whileHover={{ scale: 1.08, y: -8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
              priority
            />
          </motion.div>
        </Link>
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-1">
        {/* Title */}
        <h3 className="text-[16px] md:text-[22px] font-bold text-[#4a4a4a] tracking-tight leading-tight mb-2 md:mb-4">
          {product.name}
        </h3>

        {/* Variants Selection */}
        <div className="flex items-center gap-2 md:gap-4 mb-4 md:mb-6">
          {product.variants.map((v, idx) => {
            const isActive = selectedVariantIdx === idx;
            return (
              <button
                key={idx}
                onClick={(e) => { e.stopPropagation(); setSelectedVariantIdx(idx); }}
                className="flex items-center gap-2 group/variant"
              >
                <span className={`text-[12px] md:text-[14px] font-medium transition-colors ${isActive ? "text-[#4a4a4a]" : "text-[#b0b0b0] group-hover/variant:text-[#888888]"}`}>
                  {v.size}{v.unit}
                </span>
                <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full border-2 flex items-center justify-center transition-all ${isActive ? "border-[#c21e5c]" : "border-[#e0e0e0] group-hover/variant:border-[#cccccc]"}`}>
                  {isActive && <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#c21e5c]" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2 md:gap-4 mb-6 md:mb-8">
          <button
            onClick={(e) => { e.stopPropagation(); if (quantity > 1) setQuantity(prev => prev - 1); }}
            className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-lg bg-[#f5f5f5] text-[#888888] hover:bg-[#e0e0e0] transition-colors"
          >
            <Minus size={isDesktop ? 16 : 12} strokeWidth={2.5} />
          </button>
          <span className="text-[14px] md:text-[18px] font-bold text-[#4a4a4a] min-w-[15px] md:min-w-[20px] text-center">
            {quantity}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); setQuantity(prev => prev + 1); }}
            className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-lg bg-[#f5f5f5] text-[#888888] hover:bg-[#e0e0e0] transition-colors"
          >
            <Plus size={isDesktop ? 16 : 12} strokeWidth={2.5} />
          </button>
        </div>

        {/* Bottom Row: Price & Buy Now */}
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-start">
            <span className="text-[20px] md:text-[32px] lg:text-[38px] font-bold text-[#8a8a8a] tracking-tighter leading-none">
              ₹{currentPrice.toFixed(0)}
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            className="px-4 md:px-8 py-2 md:py-3 rounded-full bg-[#c21e5c] text-white font-bold text-[13px] md:text-[16px] tracking-wide transition-all hover:bg-[#9c0045] hover:shadow-lg active:scale-95 whitespace-nowrap"
          >
            Buy Now
          </button>
        </div>
      </div>
    </motion.div>
  );
}

