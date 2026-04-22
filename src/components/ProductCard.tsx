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
  const [quantity, setQuantity] = useState(2);
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
      price: currentPrice
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
      className="group relative flex flex-col h-full bg-transparent p-2 md:p-4"
    >
      <div className="flex gap-2 md:gap-5 items-stretch mb-4 md:mb-6 min-h-[160px] md:min-h-[220px]">

        {/* Left: Premium SVG Decorative Frame & Image */}
        <div className="relative w-[45%] flex-shrink-0 flex flex-col items-center">

          {/* Custom Decorative SVG Frame */}
          <div className="absolute inset-0 -z-10 pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 120 180" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              {/* Main Line Path: Wraps Left, Bottom, and part of Right side */}
              {/* Vertical line starts exactly 2px below the circle boundary */}
              <path
                d="M 12 30 V 164 C 12 172 20 176 26 176 H 82 C 88 176 92 172 92 164 V 156"
                stroke="#333333"
                strokeWidth="0.8"
                strokeOpacity="0.15"
                fill="none"
              />
              {/* Neck Line extending horizontally from 2px away from the circle */}
              <path
                d="M 24 24 H 82"
                stroke="#333333"
                strokeWidth="0.8"
                strokeOpacity="0.15"
                fill="none"
              />
            </svg>
          </div>

          {/* Floating Heart Circle */}
          <button
            onClick={handleWishlist}
            className="absolute top-[14px] left-[2px] z-30 w-[20px] h-[20px] rounded-full flex items-center justify-center border border-black/[0.1] bg-[#f1f1f2] transition-all hover:bg-black/5"
          >
            <Heart
              size={10}
              fill={isFavorited ? "#ef4444" : "#cccccc"}
              color={isFavorited ? "#ef4444" : "transparent"}
              className="transition-colors"
            />
          </button>

          {/* Product Image Stage */}
          <Link
            href={`/product/${product.id}`}
            className="relative w-full h-full flex items-end justify-center cursor-pointer pt-4 pb-[25px]"
          >
            <motion.div
              className="relative w-full h-full max-h-[150px] md:max-h-[200px] z-10"
              whileHover={{ scale: (isDesktop ? 1.7 : 1.88), x: (isDesktop ? 25 : 5), y: (isDesktop ? -20 : -5) }}
              initial={{ scale: isDesktop ? 1.6 : 1.72, x: isDesktop ? 25 : 5, y: isDesktop ? -20 : -5 }}
              animate={{ scale: isDesktop ? 1.6 : 1.72, x: isDesktop ? 25 : 5, y: isDesktop ? -20 : -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.15)]"
                priority
              />
            </motion.div>
          </Link>
        </div>

        {/* Right: Refined Information Panel */}
        <div className="flex flex-col flex-1 justify-center pl-1">
          {/* Title Staging */}
          <h3 className="font-avant-garde text-[0.85rem] md:text-[1.4rem] leading-[1.05] text-[#666c75] tracking-tight mb-2 md:mb-3">
            <span className="font-extrabold block text-[#333333]">Dragon</span>
            <span className="font-bold">{product.name.replace("Dragon ", "")}</span>
          </h3>

          {/* Price & Taxes Logic */}
          <div className="flex items-baseline gap-1 mb-1 md:mb-2">
            <span className="text-[0.75rem] md:text-[1rem] font-bold text-[#333333] tracking-tighter">
              ₹{currentPrice.toFixed(0)}
            </span>
            <span className="text-[0.4rem] md:text-[0.45rem] text-[#333333]/40 whitespace-nowrap font-medium italic">
              inclusive all taxes
            </span>
          </div>

          {/* Quantity Controls (Mockup Style) */}
          <div className="flex items-center gap-1.5 md:gap-2 mb-1 md:mb-2">
            <button
              onClick={(e) => { e.stopPropagation(); if (quantity > 1) setQuantity(prev => prev - 1); }}
              className="w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-md border border-black/[0.06] text-black/40 hover:text-black/70 hover:bg-black/5 transition-all"
            >
              <Minus size={isDesktop ? 10 : 8} strokeWidth={2} />
            </button>
            <span className="text-[0.55rem] md:text-[0.65rem] font-medium text-[#666666] w-2.5 md:w-3 text-center font-playfair">
              {quantity}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); setQuantity(prev => prev + 1); }}
              className="w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-md border border-black/[0.06] text-black/40 hover:text-black/70 hover:bg-black/5 transition-all"
            >
              <Plus size={isDesktop ? 10 : 8} strokeWidth={2} />
            </button>
          </div>

          {/* Horizontal Variants selection */}
          <div className="flex flex-row flex-wrap items-center gap-x-1.5 md:gap-x-2 gap-y-1 mt-0.5 md:mt-1">
            {product.variants.map((v, idx) => {
              const isActive = selectedVariantIdx === idx;
              return (
                <button
                  key={idx}
                  onClick={(e) => { e.stopPropagation(); setSelectedVariantIdx(idx); }}
                  className="flex items-center gap-0.5 md:gap-1 group"
                >
                  <span className={`text-[0.5rem] md:text-[0.6rem] font-medium transition-colors font-avant-garde tracking-tight ${isActive ? "text-[#333333]" : "text-[#cccccc] group-hover:text-[#999999]"
                    }`}>
                    {v.size}{v.unit}
                  </span>
                  <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full border transition-all flex items-center justify-center ${isActive ? "border-[#c81c6a]" : "border-[#cccccc] group-hover:border-[#999999]"
                    }`}>
                    {isActive && (
                      <div className="w-0.5 h-0.5 md:w-1 md:h-1 rounded-full bg-[#c81c6a] shadow-[0_0_4px_#c81c6a22]" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Hub - Premium Rounded Pills (Aligned to SVG Line) */}
      <div className="flex justify-start gap-1 md:gap-2 mt-2 px-0 ml-0 md:ml-[4.5%]">
        <button
          onClick={handleAddToCart}
          className="px-3 md:px-6 py-2 rounded-full text-white font-bold text-[0.45rem] md:text-[0.62rem] tracking-[0.02em] uppercase bg-[#c81c6a] transition-all hover:scale-[1.02] active:scale-95 whitespace-nowrap"
        >
          Add to cart
        </button>
        <button
          className="px-3 md:px-6 py-2 rounded-full text-white font-bold text-[0.45rem] md:text-[0.62rem] tracking-[0.02em] uppercase bg-[#666c75] transition-all hover:scale-[1.02] active:scale-95 whitespace-nowrap"
        >
          Buy Now
        </button>
      </div>
    </motion.div>
  );
}
