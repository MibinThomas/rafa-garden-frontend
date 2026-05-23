"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useCart } from "@/lib/CartContext";
import { useWishlist } from "@/lib/WishlistContext";
import { Product } from "@/lib/data";
import { Heart, Plus, Minus } from "lucide-react";
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
      className="group relative flex flex-col justify-between bg-[#f1f1f2] p-3 sm:p-5 md:p-8 rounded-[16px] sm:rounded-[24px] transition-all duration-500 hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)] h-full w-full snap-start"
      style={{ fontFamily: 'AvantGarde, sans-serif' }}
    >
      {/* Wishlist Heart Icon - Top Right */}
      <button
        onClick={handleWishlist}
        className="absolute top-3 right-3 sm:top-5 sm:right-5 z-30 w-7 h-7 sm:w-10 sm:h-10 xl:w-12 xl:h-12 rounded-full flex items-center justify-center bg-[#f1f1f2] border-[1.5px] border-[#b0b0b0]/40 transition-all hover:scale-105 active:scale-95 shadow-sm"
      >
        <Heart
          size={isDesktop ? 22 : 18}
          fill={isFavorited ? "#b0b0b0" : "#b0b0b0"}
          className="text-[#b0b0b0]"
          strokeWidth={1}
        />
      </button>

      {/* Product Image */}
      <Link
        href={`/product/${product.id}`}
        className="relative w-full aspect-[4/5] sm:aspect-[3/4] flex items-center justify-center cursor-pointer z-10 mb-3 sm:mb-6 xl:mb-8 mt-1"
      >
        <motion.div
          className="relative w-[95%] h-[95%] xl:w-full xl:h-full"
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.15)]"
            priority
          />
        </motion.div>
      </Link>

      <div className="flex flex-col mt-auto w-full">
        {/* Title */}
        <Link href={`/product/${product.id}`} className="group/title block cursor-pointer mb-2 sm:mb-3 xl:mb-4">
          <h3 className="text-[20px] sm:text-[32px] md:text-[40px] xl:text-[48px] 2xl:text-[56px] font-bold text-[#5d5f61] tracking-tight leading-[1.05] transition-colors break-words">
            {product.name}
          </h3>
        </Link>

        {/* Variants Selection */}
        <div className="flex flex-wrap items-center gap-3 md:gap-5 mb-5 xl:mb-8">
          {product.variants.map((v, idx) => {
            const isActive = selectedVariantIdx === idx;
            return (
              <button
                key={idx}
                onClick={(e) => { e.stopPropagation(); setSelectedVariantIdx(idx); }}
                className="flex items-center gap-1.5 sm:gap-2 group/variant"
              >
                <span className="text-[10px] sm:text-[14px] md:text-[16px] xl:text-[18px] font-normal text-[#9b9b9b] tracking-tight lowercase">
                  {v.size}{v.unit}
                </span>
                <div className={`w-3.5 h-3.5 sm:w-5 sm:h-5 xl:w-6 xl:h-6 rounded-full border-[1.5px] flex items-center justify-center transition-all ${isActive ? "border-[#d11e6d]" : "border-[#b0b0b0]"}`}>
                  {isActive && <div className="w-2 h-2 sm:w-3 sm:h-3 xl:w-3.5 xl:h-3.5 rounded-full bg-[#d11e6d]" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Quantity & Price Row */}
        <div className="flex items-center justify-between gap-2 sm:gap-4 mb-4 sm:mb-6 xl:mb-10 w-full min-w-0">
          {/* Quantity Selector */}
          <div className="flex items-center gap-1.5 sm:gap-3 md:gap-4 shrink-0">
            <button
              onClick={(e) => { e.stopPropagation(); if (quantity > 1) setQuantity(prev => prev - 1); }}
              className="w-5 h-5 sm:w-8 sm:h-8 md:w-9 md:h-9 xl:w-10 xl:h-10 flex items-center justify-center rounded-[4px] sm:rounded-[8px] border-[1.5px] border-[#5d5f61]/40 text-[#5d5f61] hover:bg-white/50 transition-all shrink-0"
            >
              <Minus size={10} className="sm:w-[14px]" strokeWidth={1.5} />
            </button>
            <span className="text-[14px] sm:text-[20px] md:text-[24px] xl:text-[28px] font-normal text-[#5d5f61] min-w-[12px] sm:min-w-[20px] md:min-w-[24px] text-center leading-none">
              {quantity}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); setQuantity(prev => prev + 1); }}
              className="w-5 h-5 sm:w-8 sm:h-8 md:w-9 md:h-9 xl:w-10 xl:h-10 flex items-center justify-center rounded-[4px] sm:rounded-[8px] border-[1.5px] border-[#5d5f61]/40 text-[#5d5f61] hover:bg-white/50 transition-all shrink-0"
            >
              <Plus size={10} className="sm:w-[14px]" strokeWidth={1.5} />
            </button>
          </div>

          {/* Price */}
          <div className="w-auto min-w-fit text-[24px] sm:text-[40px] md:text-[52px] xl:text-[64px] 2xl:text-[72px] font-normal text-[#5d5f61] leading-[0.9] tracking-tighter shrink-0 text-right pb-1">
            ₹{currentPrice.toFixed(0)}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row items-center justify-between gap-1.5 sm:gap-3 xl:gap-4 w-full">
          <button
            onClick={handleAddToCart}
            className="flex-1 w-full py-1.5 sm:py-3 xl:py-4 px-1 sm:px-2 xl:px-4 rounded-full border-[1.5px] border-[#5d5f61] text-[#5d5f61] bg-transparent font-bold text-[9px] sm:text-[13px] md:text-[14px] xl:text-[16px] tracking-wide transition-all hover:bg-[#5d5f61]/5 hover:shadow-sm active:scale-95 text-center whitespace-nowrap"
          >
            Add to Cart
          </button>
          <button
            onClick={handleAddToCart}
            className="flex-1 w-full py-1.5 sm:py-3 xl:py-4 px-1 sm:px-2 xl:px-4 rounded-full border-[1.5px] border-[#d11e6d] text-[#5d5f61] bg-transparent font-bold text-[9px] sm:text-[13px] md:text-[14px] xl:text-[16px] tracking-wide transition-all hover:bg-[#d11e6d]/5 hover:shadow-sm active:scale-95 text-center whitespace-nowrap"
          >
            Buy Now
          </button>
        </div>
      </div>
    </motion.div>
  );
}


