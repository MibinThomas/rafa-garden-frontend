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
      price: currentPrice
    }, quantity);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  // Alignment constants
  // SVG line is at x=12 in 120 viewBox (10%)
  // Left panel is 45% of card width
  // Total offset from left = 0.45 * 0.10 = 4.5%
  const alignMargin = "4.5%";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative flex flex-col h-full bg-transparent p-2 md:p-3"
    >
      <div className="flex gap-3 md:gap-5 items-stretch mb-3 md:mb-5 min-h-[180px] md:min-h-[240px]">

        {/* Left: Premium SVG Decorative Frame & Image */}
        <div className="relative w-[45%] flex-shrink-0 flex flex-col items-center">

          {/* Custom Decorative SVG Frame */}
          <div className="absolute inset-0 -z-10 pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 120 180" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <path
                d="M 12 30 V 164 C 12 172 20 176 26 176 H 82 C 88 176 92 172 92 164 V 156"
                stroke="#333333"
                strokeWidth="0.8"
                strokeOpacity="0.15"
                fill="none"
              />
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
            className="absolute top-[14px] left-[2px] z-30 w-[24px] h-[24px] rounded-full flex items-center justify-center border border-black/[0.08] bg-white transition-all hover:scale-110 active:scale-90 shadow-sm"
          >
            <Heart
              size={12}
              fill={isFavorited ? "#ef4444" : "none"}
              className={isFavorited ? "text-[#ef4444]" : "text-black/20"}
            />
          </button>

          {/* Product Image Stage */}
          <Link
            href={`/product/${product.id}`}
            className="relative w-full h-full flex items-center justify-center cursor-pointer pt-6 pb-8 px-2"
          >
            <motion.div
              className="relative w-full h-full max-h-[140px] md:max-h-[180px] z-10"
              whileHover={{ scale: 1.15, y: -5 }}
              initial={{ scale: 1.05 }}
              animate={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.1)]"
                priority
              />
            </motion.div>
          </Link>
        </div>

        {/* Right: Refined Information Panel */}
        <div className="flex flex-col flex-1 justify-center pl-1">
          {/* Title Staging */}
          <h3 className="font-avant-garde text-[0.8rem] md:text-[1.2rem] leading-tight text-[#666c75] tracking-tight mb-2">
            <span className="font-extrabold block text-[#333333] mb-0.5">Dragon</span>
            <span className="font-bold">{product.name.replace("Dragon ", "")}</span>
          </h3>

          {/* Price & Taxes Logic */}
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-[0.9rem] md:text-[1.1rem] font-bold text-[#333333] tracking-tighter">
              ₹{currentPrice.toFixed(0)}
            </span>
            <span className="text-[0.5rem] md:text-[0.6rem] text-[#333333]/40 whitespace-nowrap font-medium italic">
              incl. taxes
            </span>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={(e) => { e.stopPropagation(); if (quantity > 1) setQuantity(prev => prev - 1); }}
              className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-lg border border-black/[0.1] text-black/40 hover:text-brand-pink hover:border-brand-pink transition-all"
            >
              <Minus size={12} strokeWidth={2.5} />
            </button>
            <span className="text-[0.7rem] md:text-[0.8rem] font-bold text-[#333333] w-4 text-center font-avant-garde">
              {quantity}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); setQuantity(prev => prev + 1); }}
              className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-lg border border-black/[0.1] text-black/40 hover:text-brand-pink hover:border-brand-pink transition-all"
            >
              <Plus size={12} strokeWidth={2.5} />
            </button>
          </div>

          {/* Variants selection */}
          <div className="flex flex-row flex-wrap items-center gap-x-2 gap-y-1.5">
            {product.variants.map((v, idx) => {
              const isActive = selectedVariantIdx === idx;
              return (
                <button
                  key={idx}
                  onClick={(e) => { e.stopPropagation(); setSelectedVariantIdx(idx); }}
                  className="flex items-center gap-1 group/variant"
                >
                  <span className={`text-[0.6rem] md:text-[0.7rem] font-bold transition-colors font-avant-garde tracking-tight ${isActive ? "text-[#333333]" : "text-[#cccccc] group-hover/variant:text-[#999999]"
                    }`}>
                    {v.size}{v.unit}
                  </span>
                  <div className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full border transition-all flex items-center justify-center ${isActive ? "border-brand-pink shadow-[0_0_8px_rgba(200,28,106,0.3)]" : "border-[#cccccc] group-hover/variant:border-[#999999]"
                    }`}>
                    {isActive && (
                      <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-brand-pink" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Hub - Aligned to SVG Line */}
      <div 
        className="flex justify-start gap-1.5 md:gap-2 mt-auto"
        style={{ marginLeft: alignMargin }}
      >
        <button
          onClick={handleAddToCart}
          className="px-4 md:px-7 py-2 rounded-full text-white font-bold text-[0.55rem] md:text-[0.7rem] tracking-wider uppercase bg-brand-pink transition-all hover:brightness-110 active:scale-95 whitespace-nowrap shadow-sm"
        >
          Add to cart
        </button>
        <button
          className="px-4 md:px-7 py-2 rounded-full text-white font-bold text-[0.55rem] md:text-[0.7rem] tracking-wider uppercase bg-[#666c75] transition-all hover:bg-[#333333] active:scale-95 whitespace-nowrap shadow-sm"
        >
          Buy Now
        </button>
      </div>
    </motion.div>
  );
}

