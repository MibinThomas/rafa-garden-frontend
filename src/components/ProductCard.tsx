"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCart } from "@/lib/CartContext";
import { useWishlist } from "@/lib/WishlistContext";
import { Product } from "@/lib/data";
import { ShoppingBasket, Heart } from "lucide-react";

export function ProductCard({ product, accentColor = "#c81c6a" }: { product: Product, accentColor?: string }) {
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
      whileHover={{ y: -8 }}
      className="group relative aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-lg transition-all duration-500 bg-black/5 flex flex-col justify-end"
    >
      <Link href={`/shop/product/${product.id}`} className="absolute inset-0 z-0">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
          priority
        />
        {/* Dark Gradient Overlay for Text Visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
      </Link>

      {/* Top Controls */}
      <div className="absolute top-4 right-4 z-20">
         <button 
           onClick={handleWishlist}
           className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 transition-all ${
             isFavorited ? "bg-white text-red-500" : "bg-black/20 text-white hover:bg-white hover:text-[#0b2b1a]"
           }`}
         >
           <Heart size={18} fill={isFavorited ? "currentColor" : "none"} />
         </button>
      </div>

      {/* Details Overlay */}
      <div className="relative z-10 p-4 sm:p-5 w-full flex flex-col pointer-events-none">
        <div className="flex justify-between items-end mb-3">
          <div className="flex-1 pr-2">
            <h3 className="font-bold text-base sm:text-lg md:text-xl text-white font-playfair tracking-tight mb-0.5 line-clamp-2 drop-shadow-lg">
              {product.name}
            </h3>
            <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/50 mb-1">
              {product.variants[0]?.size} {product.variants[0]?.unit} Series
            </p>
            <div className="flex items-center gap-1.5 overflow-hidden py-1">
               {product.variants.slice(0, 3).map((v, i) => (
                 <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/20" />
               ))}
               {product.variants.length > 3 && <span className="text-[8px] text-white/30 font-bold">+{product.variants.length - 3}</span>}
            </div>
          </div>
          
          <div className="text-right">
             <span className="block text-[9px] uppercase font-black tracking-widest text-[#b5e55b] mb-1">Price</span>
             <span className="text-xl md:text-2xl font-black text-white tabular-nums drop-shadow-md">
               <span className="text-sm mr-0.5" style={{ color: "#b5e55b" }}>₹</span>
               {currentPrice.toFixed(0)}
             </span>
          </div>
        </div>

        {/* Interaction Bar */}
        <div className="flex gap-2 pointer-events-auto mt-2">
           <button
             onClick={handleAddToCart}
             className="flex-1 py-3.5 rounded-xl text-white font-black tracking-widest uppercase text-[10px] transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl"
             style={{ backgroundColor: accentColor }}
           >
             <ShoppingBasket size={14} /> Add to Cart
           </button>
        </div>
      </div>
    </motion.div>
  );
}

