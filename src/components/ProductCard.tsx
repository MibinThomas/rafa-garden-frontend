"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useCart } from "@/lib/CartContext";
import { useWishlist } from "@/lib/WishlistContext";
import { Product } from "@/lib/data";
import { ShoppingBasket, Heart } from "lucide-react";

export function ProductCard({ product, accentColor = "#c81c6a", onSelect }: { product: Product, accentColor?: string, onSelect?: (product: Product) => void }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);

  const selectedVariant = product.variants[selectedVariantIdx] || { size: "Standard", unit: "", price: 599 };
  const currentPrice = selectedVariant.price || 599.00;
  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to product page
    e.stopPropagation();
    addToCart({
      id: `${product.id}-${selectedVariantIdx}`,
      name: `${product.name} (${selectedVariant.size} ${selectedVariant.unit})`.trim(),
      price: currentPrice
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <motion.div 
      initial="initial"
      whileHover="hover"
      animate="initial"
      className="group relative flex flex-col justify-end h-full"
    >
      <motion.div 
        variants={{
          initial: { y: 0 },
          hover: { y: -10 }
        }}
        className="relative w-full aspect-[4/5] overflow-visible flex flex-col"
      >
        {/* Top Portion: Colored Background */}
        <div 
          className="absolute top-0 left-0 right-0 h-[60%] rounded-t-[2.5rem] transition-colors duration-500"
          style={{ backgroundColor: accentColor }}
        />
        
        {/* Bottom Portion: White Background */}
        <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-white rounded-b-[2.5rem] shadow-xl" />

        {/* Wishlist Button */}
        <div className="absolute top-4 right-4 z-20">
          <button 
            onClick={handleWishlist}
            className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 transition-all ${
              isFavorited ? "bg-white text-red-500 shadow-md" : "bg-white/10 text-white hover:bg-white hover:text-black"
            }`}
          >
            <Heart size={18} fill={isFavorited ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Product Image: Floating and Bleeding */}
        <button 
          onClick={() => onSelect?.(product)}
          className="absolute inset-0 z-10 flex items-center justify-center p-4 cursor-pointer border-none bg-transparent"
        >
          <div className="relative w-full h-[65%] -translate-y-[15%] group-hover:scale-110 transition-transform duration-700 ease-out">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.3)]"
              priority
            />
          </div>
        </button>

        {/* Product Details (Bottom White Part) */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 z-20 pointer-events-none">
          <div className="flex justify-between items-end w-full">
            {/* Left: Name & Variant */}
            <div className="text-left max-w-[70%]">
              <h3 className="font-bold text-[13px] sm:text-[15px] text-gray-900 font-sans tracking-tight mb-0.5 line-clamp-1">
                {product.name}
              </h3>
              <div className="flex items-center gap-1.5">
                <span className="text-[8px] sm:text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                  {selectedVariant.size} {selectedVariant.unit}
                </span>
              </div>
            </div>

            {/* Right: Price */}
            <div className="text-right">
               <p className="text-sm sm:text-lg font-medium tabular-nums flex items-start justify-end" style={{ color: accentColor }}>
                 <span className="text-[8px] mt-0.5 mr-0.5 opacity-80 font-bold">₹</span>
                 <span>{currentPrice.toFixed(0)}</span>
               </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Cart Button: Full Width */}
      <motion.div 
        variants={{
          initial: { opacity: 0, y: 10 },
          hover: { opacity: 1, y: 0 }
        }}
        transition={{ duration: 0.3 }}
        className="mt-2 px-0 pointer-events-auto"
      >
        <button
          onClick={handleAddToCart}
          className="w-full py-3.5 rounded-2xl text-white font-bold tracking-[0.2em] uppercase text-[9px] transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95"
          style={{ backgroundColor: accentColor }}
        >
          <ShoppingBasket size={12} /> Add to Cart
        </button>
      </motion.div>
    </motion.div>
  );
}

