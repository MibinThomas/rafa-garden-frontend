"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useCart } from "@/lib/CartContext";
import { useWishlist } from "@/lib/WishlistContext";
import { Product } from "@/lib/data";
import { Heart, Plus, Minus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function ProductCard({ product, accentColor = "#c81c6a", onSelect }: { product: Product, accentColor?: string, onSelect?: (product: Product) => void }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const router = useRouter();
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const selectedVariant = product.variants[selectedVariantIdx] || { size: "Standard", unit: "", price: 599 };
  const currentPrice = selectedVariant.price || 599.00;
  const isFavorited = isInWishlist(product.id);

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: `${product.id}-${selectedVariantIdx}`,
      name: `${product.name} (${selectedVariant.size} ${selectedVariant.unit})`.trim(),
      price: currentPrice,
      image: product.image
    }, quantity);
    router.push("/checkout");
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col justify-between bg-[#e5e5e6] rounded-[22px] p-3.5 sm:p-4 border border-black/10 transition-all duration-300 h-full w-full"
    >
      {/* Wishlist Favorite Button (Top Right) */}
      <button
        onClick={handleWishlist}
        aria-label="Add to wishlist"
        className="absolute top-3.5 right-3.5 z-30 w-7 h-7 flex items-center justify-center transition-transform active:scale-90"
      >
        <Heart
          size={20}
          fill={isFavorited ? "#c81c6a" : "none"}
          className={isFavorited ? "text-[#c81c6a]" : "text-gray-400 hover:text-gray-600"}
          strokeWidth={1.8}
        />
      </button>

      {/* Product Image Link */}
      <Link
        href={`/product/${product.id}`}
        className="relative w-full aspect-[4/5] flex items-center justify-center p-2 mb-2 cursor-pointer"
      >
        <motion.div
          className="relative w-[85%] h-[85%]"
          whileHover={{ scale: 1.05, y: -3 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)]"
            priority
          />
        </motion.div>
      </Link>

      {/* Product Details Section */}
      <div className="flex flex-col mt-auto w-full space-y-2">
        {/* Product Name */}
        <Link href={`/product/${product.id}`} className="block">
          <h3 className="text-sm sm:text-base font-bold text-[#3a3a3c] leading-snug line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Optional Variant Pills if multiple variants exist */}
        {product.variants.length > 1 && (
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-0.5">
            {product.variants.map((v, idx) => {
              const isActive = selectedVariantIdx === idx;
              return (
                <button
                  key={idx}
                  onClick={(e) => { e.stopPropagation(); setSelectedVariantIdx(idx); }}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${
                    isActive 
                      ? "bg-[#c81c6a] text-white" 
                      : "bg-white/70 text-gray-600 hover:bg-white"
                  }`}
                >
                  {v.size}{v.unit}
                </button>
              );
            })}
          </div>
        )}

        {/* Price & Quantity Controls Row */}
        <div className="flex items-center justify-between pt-1">
          {/* Price */}
          <span className="text-xl sm:text-2xl font-black text-[#2e2e30] tracking-tight">
            ₹{currentPrice.toFixed(0)}
          </span>

          {/* Quantity Selector: - 1 + */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={(e) => { e.stopPropagation(); if (quantity > 1) setQuantity(prev => prev - 1); }}
              className="w-5 h-5 flex items-center justify-center text-[#222] hover:text-[#c81c6a] active:scale-90 transition-all"
            >
              <Minus size={16} strokeWidth={3.5} />
            </button>
            <span className="text-sm font-bold text-[#222] min-w-[12px] text-center">
              {quantity}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); setQuantity(prev => prev + 1); }}
              className="w-5 h-5 flex items-center justify-center text-[#222] hover:text-[#c81c6a] active:scale-90 transition-all"
            >
              <Plus size={16} strokeWidth={3.5} />
            </button>
          </div>
        </div>

        {/* Action Buttons Row: [ Buy Now ] [ View Details ] */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleBuyNow}
            className="w-full py-2.5 px-1.5 rounded-xl bg-[#525254] hover:bg-[#3f4042] text-white font-bold text-xs sm:text-sm transition-all active:scale-95 text-center shadow-xs"
          >
            Buy Now
          </button>

          <Link
            href={`/product/${product.id}`}
            className="w-full py-2.5 px-1.5 rounded-xl bg-[#c81c6a] hover:bg-[#b0185c] text-white font-bold text-xs sm:text-sm transition-all active:scale-95 text-center shadow-xs block"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
