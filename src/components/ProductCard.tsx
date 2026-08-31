"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useCart } from "@/lib/CartContext";
import { useWishlist } from "@/lib/WishlistContext";
import { Product } from "@/lib/data";
import { Heart, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function ProductCard({ 
  product, 
  accentColor = "#c81c6a", 
  onSelect 
}: { 
  product: Product, 
  accentColor?: string, 
  onSelect?: (product: Product) => void 
}) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const router = useRouter();
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);

  const selectedVariant = product.variants?.[selectedVariantIdx] || product.variants?.[0];
  const currentPrice = selectedVariant?.price || (product as any).offerPrice || (product as any).price || 599.00;
  const productId = product.id || (product as any)._id || "";
  const isFavorited = isInWishlist(productId);

  const handleCardClick = (e: React.MouseEvent) => {
    if (onSelect) {
      onSelect(product);
    } else {
      router.push(`/product/${productId}`);
    }
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/product/${productId}`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(productId);
  };


  const shortDescription = product.subtitle || product.description || "Pure botanical refreshment and natural quality.";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.3 }}
      onClick={handleCardClick}
      className="group relative flex flex-col justify-between bg-white rounded-[16px] sm:rounded-[20px] p-3 sm:p-5 border-0 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300 h-full w-full font-sans cursor-pointer overflow-hidden select-none"
    >
      {/* Wishlist Favorite Button (Top Right) */}
      <button
        onClick={handleWishlist}
        aria-label="Add to wishlist"
        className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-30 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-xs"
      >
        <Heart
          size={15}
          fill={isFavorited ? accentColor : "none"}
          className={isFavorited ? "" : "text-gray-400 hover:text-gray-600"}
          style={{ color: isFavorited ? accentColor : undefined }}
          strokeWidth={2}
        />
      </button>

      {/* Product Image Section (Occupies 60-70% height) */}
      <div className="relative w-full aspect-[4/3.6] sm:aspect-[4/3.5] flex items-center justify-center p-2 sm:p-3 mb-2 sm:mb-3 bg-[#fafafa]/60 rounded-[12px] sm:rounded-[14px] overflow-hidden">
        <div className="relative w-[85%] h-[85%] sm:w-[80%] sm:h-[82%] group-hover:scale-105 transition-transform duration-300 ease-out">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.1)]"
            priority
          />
        </div>
      </div>

      {/* Content Area (Lower ~30-40%) */}
      <div className="flex flex-col flex-1 justify-between w-full space-y-1 sm:space-y-2 pt-0.5 sm:pt-1">
        <div>
          {/* Collection / Product Title */}
          <h3 className="text-xs sm:text-base lg:text-lg font-bold text-[#1d1d1f] leading-tight sm:leading-snug line-clamp-1 tracking-tight group-hover:text-[#c81c6a] transition-colors duration-200">
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-[10px] sm:text-xs text-[#6e6e73] font-normal leading-tight sm:leading-relaxed line-clamp-2 mt-0.5 sm:mt-1 min-h-[26px] sm:min-h-[34px]">
            {shortDescription}
          </p>
        </div>

        {/* Optional Variant Pills if multiple exist */}
        {product.variants.length > 1 && (
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5" onClick={(e) => e.stopPropagation()}>
            {product.variants.map((v, idx) => {
              const isActive = selectedVariantIdx === idx;
              return (
                <button
                  key={idx}
                  onClick={(e) => { e.stopPropagation(); setSelectedVariantIdx(idx); }}
                  className={`px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold transition-all ${
                    isActive 
                      ? "bg-[#1d1d1f] text-white" 
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {v.size}{v.unit}
                </button>
              );
            })}
          </div>
        )}

        {/* Bottom CTA & Price Bar */}
        <div className="flex items-center justify-between pt-1.5 sm:pt-2 border-t border-gray-100/80 mt-1 sm:mt-2 gap-1">
          {/* CTA Link: "Buy now →" */}
          <button
            onClick={handleBuyNow}
            className="inline-flex items-center gap-0.5 sm:gap-1 text-[11px] sm:text-xs md:text-sm font-semibold transition-all duration-200 group/cta cursor-pointer flex-shrink-0 whitespace-nowrap"
            style={{ color: accentColor }}
          >
            <span className="whitespace-nowrap">Buy now</span>
            <ChevronRight size={12} className="sm:w-3.5 sm:h-3.5 group-hover/cta:translate-x-0.5 transition-transform duration-200 stroke-[2.5]" />
          </button>

          {/* Price Badge */}
          <span className="text-[11px] sm:text-xs md:text-sm font-bold text-[#1d1d1f] bg-gray-100/80 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full flex-shrink-0 whitespace-nowrap">
            ₹{currentPrice.toFixed(0)}
          </span>
        </div>
      </div>
    </motion.div>

  );
}

