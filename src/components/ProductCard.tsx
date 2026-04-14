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
      price: currentPrice
    }, quantity);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const incrementQty = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity(prev => prev + 1);
  };

  const decrementQty = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative flex flex-col h-full bg-transparent p-4 md:p-6"
    >
      {/* Top Portion: Product Showcase */}
      <div className="relative w-full aspect-[3/4] mb-8 overflow-visible">
        {/* Decorative Frame */}
        <div 
          className="absolute left-[5%] top-[10%] w-[65%] h-[90%] rounded-[1.5rem] md:rounded-[2rem] border border-black/[0.08] pointer-events-none" 
        />
        
        {/* Wishlist Button */}
        <div className="absolute top-[18%] right-[5%] z-30">
          <button 
            onClick={handleWishlist}
            className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 border ${
              isFavorited 
                ? "border-red-500 bg-white" 
                : "border-black/[0.12] bg-transparent hover:bg-black/5"
            }`}
          >
            <Heart size={16} fill={isFavorited ? "#ef4444" : "#cccccc"} color={isFavorited ? "#ef4444" : "transparent"} />
          </button>
        </div>

        {/* Product Image */}
        <button 
          onClick={() => onSelect?.(product)}
          className="absolute inset-0 z-10 w-full h-full flex items-center justify-center cursor-pointer border-none bg-transparent"
        >
          <motion.div 
            className="relative w-full h-[110%] -mt-6"
            whileHover={{ scale: 1.05, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)]"
              priority
            />
          </motion.div>
        </button>
      </div>

      {/* Product Information Area */}
      <div className="flex flex-col flex-1">
        <h3 className="font-brand-heading font-medium text-[1.25rem] md:text-[1.5rem] text-[#666c75] tracking-tight mb-2 leading-none">
          {product.name}
        </h3>

        {/* Size Selection */}
        <div className="flex items-center gap-3 mb-3">
          {product.variants.map((v, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                 e.stopPropagation();
                 setSelectedVariantIdx(idx);
              }}
              className="flex items-center gap-1.5 group cursor-pointer"
            >
              <span className={`text-[10px] md:text-[11px] font-medium tracking-wide transition-colors ${
                selectedVariantIdx === idx ? "text-[#a3a3a3]" : "text-[#a3a3a3]/60 group-hover:text-[#a3a3a3]"
              }`}>
                {v.size}{v.unit}
              </span>
              <div 
                className={`w-2.5 h-2.5 rounded-full flex items-center justify-center transition-all duration-300 border-[1px] ${
                  selectedVariantIdx === idx ? "border-[#c81c6a]" : "border-[#a3a3a3]/40 group-hover:border-[#a3a3a3]/70"
                }`}
              >
                {selectedVariantIdx === idx && (
                  <div className="w-1 h-1 rounded-full bg-[#c81c6a]" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center gap-3 mb-4">
          <button 
            onClick={decrementQty}
            className="w-4 h-4 flex items-center justify-center rounded-full border border-black/20 text-[#666] hover:border-black/40 hover:text-black transition-all"
          >
            <Minus size={8} strokeWidth={1.5} />
          </button>
          <span className="text-[10px] font-medium text-[#666] w-2 text-center">
            {quantity}
          </span>
          <button 
            onClick={incrementQty}
            className="w-4 h-4 flex items-center justify-center rounded-full border border-black/20 text-[#666] hover:border-black/40 hover:text-black transition-all"
          >
            <Plus size={8} strokeWidth={1.5} />
          </button>
        </div>

        {/* Footer: Price and Action */}
        <div className="mt-auto flex items-center justify-between w-full">
          <div className="flex items-start text-[#666c75]">
            <span className="text-[0.9rem] font-light mt-1 mr-0.5 opacity-70">₹</span>
            <span className="text-[1.8rem] font-light tracking-tight leading-none">
              {currentPrice.toFixed(0)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className="px-4 py-1.5 rounded-full text-white font-bold text-[0.5rem] tracking-wider transition-transform hover:scale-105 active:scale-95"
            style={{ backgroundColor: accentColor }}
          >
            Buy Now
          </button>
        </div>
      </div>
    </motion.div>
  );
}
