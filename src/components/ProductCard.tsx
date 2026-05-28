"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useCart } from "@/lib/CartContext";
import { useWishlist } from "@/lib/WishlistContext";
import { Product } from "@/lib/data";
import { Heart, Plus, Minus, ShoppingCart } from "lucide-react";
import Link from "next/link";

export function ProductCard({ product, accentColor = "#d11e6d", onSelect }: { product: Product, accentColor?: string, onSelect?: (product: Product) => void }) {
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
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative flex flex-col justify-between bg-[#f1f1f2] p-1.5 sm:p-2.5 md:p-4 rounded-[8px] sm:rounded-[12px] transition-all duration-500 hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] h-full w-full snap-start"
      style={{ fontFamily: 'AvantGarde, sans-serif' }}
    >
      <button
        onClick={handleWishlist}
        className="absolute top-1 right-1 sm:top-2.5 sm:right-2.5 z-30 w-4 h-4 sm:w-5 sm:h-5 xl:w-6 xl:h-6 rounded-full flex items-center justify-center bg-[#f1f1f2] border-[1px] border-[#b0b0b0]/30 transition-all hover:scale-105 active:scale-95 shadow-sm"
      >
        <Heart
          size={isDesktop ? 11 : 7}
          fill={isFavorited ? "#b0b0b0" : "#b0b0b0"}
          className="text-[#b0b0b0]"
          strokeWidth={1}
        />
      </button>

      {/* Product Image */}
      <Link
        href={`/product/${product.id}`}
        className="relative w-full aspect-[4/5] sm:aspect-[3/4] flex items-center justify-center cursor-pointer z-10 mb-1.5 sm:mb-3 xl:mb-4 mt-0.5"
      >
        <motion.div
          className="relative w-[95%] h-[95%] xl:w-full xl:h-full"
          whileHover={{ scale: 1.05, y: -2.5 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.15)]"
            priority
          />
        </motion.div>
      </Link>

      <div className="flex flex-col mt-auto w-full">
        {/* Title */}
        <Link href={`/product/${product.id}`} className="group/title block cursor-pointer mb-1 sm:mb-1.5 xl:mb-2">
          <h3 className="text-[10px] sm:text-[16px] md:text-[20px] xl:text-[24px] 2xl:text-[28px] font-bold text-[#5d5f61] tracking-tight leading-[1.05] transition-colors break-words">
            {product.name}
          </h3>
        </Link>

        {/* Variants Selection */}
        <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 md:gap-2.5 mb-1.5 sm:mb-2.5 xl:mb-4">
          {product.variants.map((v, idx) => {
            const isActive = selectedVariantIdx === idx;
            return (
              <button
                key={idx}
                onClick={(e) => { e.stopPropagation(); setSelectedVariantIdx(idx); }}
                className="flex items-center gap-0.5 sm:gap-1 group/variant"
              >
                <span className="text-[8px] sm:text-[9px] md:text-[10px] xl:text-[11px] font-normal text-[#9b9b9b] tracking-tight lowercase">
                  {v.size}{v.unit}
                </span>
                <div className={`w-2 h-2 sm:w-2.5 sm:h-2.5 xl:w-3 xl:h-3 rounded-full border-[1px] flex items-center justify-center transition-all ${isActive ? "border-[#d11e6d]" : "border-[#b0b0b0]"}`}>
                  {isActive && <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 xl:w-1.5 xl:h-1.5 rounded-full bg-[#d11e6d]" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Quantity & Price Row */}
        <div className="flex items-center justify-between gap-1 sm:gap-2 mb-2 sm:mb-3 xl:mb-5 w-full min-w-0">
          {/* Quantity Selector */}
          <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 shrink-0">
            <button
              onClick={(e) => { e.stopPropagation(); if (quantity > 1) setQuantity(prev => prev - 1); }}
              className="w-3 h-3 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5 xl:w-5 xl:h-5 flex items-center justify-center rounded-[3px] sm:rounded-[4px] border-[1px] border-[#5d5f61]/40 text-[#5d5f61] hover:bg-white/50 transition-all shrink-0"
            >
              <Minus size={6} className="sm:w-[8px]" strokeWidth={1.5} />
            </button>
            <span className="text-[8px] sm:text-[10px] md:text-[12px] xl:text-[14px] font-normal text-[#5d5f61] min-w-[7px] sm:min-w-[10px] md:min-w-[12px] text-center leading-none">
              {quantity}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); setQuantity(prev => prev + 1); }}
              className="w-3 h-3 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5 xl:w-5 xl:h-5 flex items-center justify-center rounded-[3px] sm:rounded-[4px] border-[1px] border-[#5d5f61]/40 text-[#5d5f61] hover:bg-white/50 transition-all shrink-0"
            >
              <Plus size={6} className="sm:w-[8px]" strokeWidth={1.5} />
            </button>
          </div>

          {/* Price */}
          <div className="w-auto min-w-fit text-[11px] sm:text-[20px] md:text-[26px] xl:text-[32px] 2xl:text-[36px] font-normal text-[#5d5f61] leading-[0.9] tracking-tighter shrink-0 text-right pb-[1px]">
            ₹{currentPrice.toFixed(0)}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row items-center justify-between gap-1 sm:gap-1.5 xl:gap-2 w-full">
          <button
            onClick={handleAddToCart}
            className="shrink-0 sm:flex-1 w-[18px] sm:w-full min-w-0 flex items-center justify-center h-[18px] sm:h-[24px] xl:h-[26px] p-0 sm:px-1.5 xl:px-2.5 rounded-full border-[1px] border-[#5d5f61] text-[#5d5f61] bg-transparent font-bold text-[8px] sm:text-[8px] md:text-[9px] xl:text-[10px] leading-none tracking-wide transition-all hover:bg-[#5d5f61]/5 hover:shadow-sm active:scale-95 whitespace-nowrap overflow-hidden"
          >
            <span className="sm:hidden flex items-center justify-center">
              <ShoppingCart size={8} strokeWidth={2} />
            </span>
            <span className="hidden sm:inline">Add to Cart</span>
          </button>
          <button
            onClick={handleAddToCart}
            className="flex-1 w-full min-w-0 flex items-center justify-center h-[18px] sm:h-[24px] xl:h-[26px] px-[2px] sm:px-1.5 xl:px-2.5 rounded-full border-[1px] border-[#d11e6d] text-[#5d5f61] bg-transparent font-bold text-[8px] sm:text-[8px] md:text-[9px] xl:text-[10px] leading-none tracking-wide transition-all hover:bg-[#d11e6d]/5 hover:shadow-sm active:scale-95 whitespace-nowrap overflow-hidden"
          >
            Buy Now
          </button>
        </div>
      </div>
    </motion.div>
  );
}


