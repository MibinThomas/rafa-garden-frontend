"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useCart } from "@/lib/CartContext";
import { useWishlist } from "@/lib/WishlistContext";
import { Product } from "@/lib/data";
import { Heart, Plus, Minus } from "lucide-react";

export function ProductCard({ product, accentColor = "#c81c6a", onSelect }: { product: Product, accentColor?: string, onSelect?: (product: Product) => void }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [quantity, setQuantity] = useState(2); // Set to 2 to match mockup

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
      className="group relative flex flex-col h-full bg-transparent p-4 md:p-6"
    >
      {/* Top Section: Showcase & Info */}
      <div className="flex gap-4 md:gap-6 items-start mb-6">
        
        {/* Left: Image Showcase with Decorative Frame */}
        <div className="relative w-[52%] md:w-[45%] aspect-[0.7] flex-shrink-0">
          {/* Decorative Frame */}
          <div className="absolute left-0 bottom-0 w-[94%] h-[92%] md:w-[85%] md:h-[85%] rounded-[1.5rem] md:rounded-[2rem] border border-black/[0.1] -z-0" />
          
          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className="absolute top-[8%] left-[0%] z-30 w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center border border-black/[0.1] bg-transparent transition-all hover:bg-black/5"
          >
            <Heart size={14} fill={isFavorited ? "#ef4444" : "#cccccc"} color={isFavorited ? "#ef4444" : "transparent"} />
          </button>

          {/* Product Image */}
          <div 
            onClick={() => onSelect?.(product)}
            className="absolute inset-x-0 -top-4 bottom-0 z-10 flex items-center justify-center cursor-pointer"
          >
            <motion.div
              className="relative w-full h-full"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.12)]"
                priority
              />
            </motion.div>
          </div>
        </div>

        {/* Right: Detailed Information */}
        <div className="flex flex-col flex-1 pt-1">
          <h3 className="font-brand-heading text-[1.5rem] md:text-[1.8rem] leading-[1.1] text-[#666c75] tracking-tight mb-4 lowercase">
            Dragon<br />
            <span>{product.name.replace("Dragon ", "")}</span>
          </h3>

          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-[1.6rem] md:text-[2rem] font-light text-[#666666]">
              ₹{currentPrice.toFixed(0)}
            </span>
            <span className="text-[0.6rem] text-[#666666]/50 whitespace-nowrap">
              inclusive all taxes
            </span>
          </div>

          {/* Quantity Controls (Boxed Style) */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={(e) => { e.stopPropagation(); if(quantity > 1) setQuantity(prev => prev - 1); }}
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-black/[0.12] text-black/60 hover:bg-black/5"
            >
              <Minus size={12} strokeWidth={2.5} />
            </button>
            <span className="text-[0.9rem] font-medium text-black/60 w-4 text-center">
              {quantity}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); setQuantity(prev => prev + 1); }}
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-black/[0.12] text-black/60 hover:bg-black/5"
            >
              <Plus size={12} strokeWidth={2.5} />
            </button>
          </div>

          {/* Variants selection */}
          <div className="flex flex-col gap-2.5">
            {product.variants.map((v, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.stopPropagation(); setSelectedVariantIdx(idx); }}
                className="flex items-center gap-2 group"
              >
                <span className={`text-[0.8rem] font-medium transition-colors ${
                  selectedVariantIdx === idx ? "text-[#a3a3a3]" : "text-[#a3a3a3]/50 group-hover:text-[#a3a3a3]"
                }`}>
                  {v.size}{v.unit}
                </span>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                  selectedVariantIdx === idx ? "border-[#c81c6a]" : "border-black/10"
                }`}>
                  {selectedVariantIdx === idx && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#c81c6a]" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Actions: Full Width Buttons */}
      <div className="flex gap-3 mt-auto">
        <button
          onClick={handleAddToCart}
          className="flex-1 py-3.5 rounded-full text-white font-bold text-[0.65rem] tracking-[0.1em] uppercase bg-[#c81c6a] shadow-lg shadow-[#c81c6a]/20 transition-all hover:scale-[1.02] active:scale-95"
        >
          Add to cart
        </button>
        <button
          className="flex-1 py-3.5 rounded-full text-white font-bold text-[0.65rem] tracking-[0.1em] uppercase bg-[#666c75] shadow-lg transition-all hover:scale-[1.02] active:scale-95"
        >
          Buy Now
        </button>
      </div>
    </motion.div>
  );
}
