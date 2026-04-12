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
      className="group relative flex flex-col h-full bg-transparent p-2"
    >
      {/* Top Portion: Product Showcase */}
      <div className="relative w-full aspect-[4/5] mb-1 flex items-center justify-center overflow-visible">
        {/* Decorative Frame - Adjusted to 50% width and 75% height, with active category color stroke */}
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[50%] h-[75%] rounded-[1.5rem] border transition-all duration-500 pointer-events-none" 
          style={{ borderColor: accentColor + '44' }}
        />
        
        {/* Wishlist Button - More Subtle Circular Design */}
        <div className="absolute top-0 right-0 z-30">
          <button 
            onClick={handleWishlist}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-500 border border-black/5 ${
              isFavorited 
                ? "bg-white text-red-500 shadow-xl scale-110" 
                : "bg-black/[0.03] text-black/10 hover:bg-white hover:text-black hover:scale-105"
            }`}
          >
            <Heart size={18} fill={isFavorited ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Product Image: Centered but overlapping the frame edge */}
        <button 
          onClick={() => onSelect?.(product)}
          className="relative z-10 w-full h-full flex items-center justify-center p-2 cursor-pointer border-none bg-transparent"
        >
          <motion.div 
            className="relative w-full h-[95%] -translate-y-[15px]"
            whileHover={{ scale: 1.05, y: -20 }}
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
      <div className="flex flex-col flex-1 px-1">
        <h3 className="font-heading font-bold text-xl text-[#333333] tracking-tight mb-2 leading-none">
          {product.name}
        </h3>

        {/* Dynamic Dot Selection for Variants */}
        <div className="flex items-center gap-4 mb-4">
          {product.variants.map((v, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                 e.stopPropagation();
                 setSelectedVariantIdx(idx);
              }}
              className="flex items-center gap-1.5 group cursor-pointer"
            >
              <span className={`text-[8px] font-bold uppercase tracking-widest transition-colors ${
                selectedVariantIdx === idx ? "text-[#333333]" : "text-[#333333]/30 group-hover:text-[#333333]/60"
              }`}>
                {v.size}{v.unit}
              </span>
              <div 
                className={`w-2 h-2 rounded-full border-[1.5px] transition-all duration-300 ${
                  selectedVariantIdx === idx ? "scale-110 border-transparent shadow-sm" : "border-[#333333]/15 group-hover:border-[#333333]/30"
                }`}
                style={{ 
                  backgroundColor: selectedVariantIdx === idx ? accentColor : 'transparent' 
                }}
              />
            </button>
          ))}
        </div>

        {/* Quantity Selector - Smaller */}
        <div className="flex items-center gap-4 mb-5">
          <button 
            onClick={decrementQty}
            className="w-6 h-6 flex items-center justify-center rounded-lg border border-[#333333]/5 text-[#333333]/20 hover:border-[#333333]/30 hover:text-[#333333] transition-all"
          >
            <Minus size={12} strokeWidth={2.5} />
          </button>
          <span className="text-[12px] font-bold font-avant-garde text-[#333333]/30 w-3 text-center">
            {quantity}
          </span>
          <button 
            onClick={incrementQty}
            className="w-6 h-6 flex items-center justify-center rounded-lg border border-[#333333]/5 text-[#333333]/20 hover:border-[#333333]/30 hover:text-[#333333] transition-all"
          >
            <Plus size={12} strokeWidth={2.5} />
          </button>
        </div>

        {/* Footer: Price and Action - More Compact */}
        <div className="mt-auto pt-3 flex items-center justify-between border-t border-black/5">
          <div className="flex items-start text-[#333333] font-sans">
            <span className="text-[9px] font-bold mt-1 mr-0.5 opacity-40">₹</span>
            <span className="text-xl font-bold tracking-tighter leading-none">
              {currentPrice.toFixed(0)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className="px-6 py-2 rounded-full text-white font-bold tracking-widest uppercase text-[8px] shadow-lg hover:scale-105 active:scale-95 transition-all"
            style={{ 
              backgroundColor: accentColor,
              boxShadow: `0 10px 20px ${accentColor}33`
            }}
          >
            Buy Now
          </button>
        </div>
      </div>
    </motion.div>
  );
}
