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
      className="group relative flex flex-col bg-[#f2f2f2] p-4 md:p-6 lg:p-8 rounded-[32px] md:rounded-[40px] transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.05)] h-fit"
      style={{ fontFamily: 'AvantGarde, sans-serif' }}
    >
      {/* Top Section: Horizontal Split (Image & Info) */}
      <div className="flex flex-row gap-4 md:gap-6 lg:gap-8">
        
        {/* Left Side: Product Image & Wishlist */}
        <div className="relative flex-1 aspect-[3/5] flex items-center justify-center">
          {/* Wishlist Heart Icon - Top Left */}
          <button
            onClick={handleWishlist}
            className="absolute top-0 left-0 z-30 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-transparent border border-black/10 transition-all hover:scale-110 active:scale-90 shadow-sm"
          >
            <Heart
              size={isDesktop ? 20 : 16}
              fill={isFavorited ? "#d11e6d" : "transparent"}
              className={isFavorited ? "text-[#d11e6d]" : "text-[#707072] opacity-40"}
              strokeWidth={1.5}
            />
          </button>

          {/* Product Image */}
          <Link
            href={`/product/${product.id}`}
            className="relative w-full h-full flex items-center justify-center cursor-pointer z-10"
          >
            <motion.div
              className="relative w-full h-[90%]"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.1)]"
                priority
              />
            </motion.div>
          </Link>
        </div>

        {/* Right Side: Product Details */}
        <div className="flex-1 flex flex-col justify-center">
          {/* Title - Multi-line if needed */}
          <h3 className="text-[20px] md:text-[28px] lg:text-[36px] font-semibold text-[#5d5f61] tracking-tight leading-[1.1] mb-4">
            {product.name.split(' ').map((word, i) => (
              <span key={i} className="block">{word}</span>
            ))}
          </h3>

          {/* Price & Taxes */}
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-[18px] md:text-[24px] lg:text-[32px] font-normal text-[#5d5f61]">
              ₹{currentPrice.toFixed(0)}
            </span>
            <span className="text-[8px] md:text-[10px] text-[#b0b0b0] font-medium tracking-tight">
              inclusive all taxes
            </span>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={(e) => { e.stopPropagation(); if (quantity > 1) setQuantity(prev => prev - 1); }}
              className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-[10px] border border-black/10 text-[#707072] hover:bg-white transition-all"
            >
              <Minus size={14} strokeWidth={1.5} />
            </button>
            <span className="text-[16px] md:text-[18px] font-medium text-[#707072] min-w-[16px] text-center">
              {quantity}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); setQuantity(prev => prev + 1); }}
              className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-[10px] border border-black/10 text-[#707072] hover:bg-white transition-all"
            >
              <Plus size={14} strokeWidth={1.5} />
            </button>
          </div>

          {/* Variants Selection */}
          <div className="flex items-center gap-4 mt-auto">
            {product.variants.map((v, idx) => {
              const isActive = selectedVariantIdx === idx;
              return (
                <button
                  key={idx}
                  onClick={(e) => { e.stopPropagation(); setSelectedVariantIdx(idx); }}
                  className="flex items-center gap-2 group/variant"
                >
                  <span className={`text-[12px] md:text-[14px] font-medium transition-colors ${isActive ? "text-[#5d5f61]" : "text-[#b0b0b0]"}`}>
                    {v.size}{v.unit}
                  </span>
                  <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full border-2 flex items-center justify-center transition-all ${isActive ? "border-[#d11e6d]" : "border-[#d0d0d0]"}`}>
                    {isActive && <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#d11e6d]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Section: Action Buttons */}
      <div className="mt-8 flex items-center gap-3 w-full">
        <button
          onClick={handleAddToCart}
          className="flex-1 py-3 md:py-4 rounded-full bg-[#d11e6d] text-white font-bold text-[12px] md:text-[14px] tracking-wide transition-all hover:bg-[#b0185a] hover:shadow-lg active:scale-95 text-center"
        >
          Add to cart
        </button>
        <button
          onClick={handleAddToCart}
          className="flex-1 py-3 md:py-4 rounded-full bg-[#707072] text-white font-bold text-[12px] md:text-[14px] tracking-wide transition-all hover:bg-[#5a5a5c] hover:shadow-lg active:scale-95 text-center"
        >
          Buy Now
        </button>
      </div>
    </motion.div>
  );
}


