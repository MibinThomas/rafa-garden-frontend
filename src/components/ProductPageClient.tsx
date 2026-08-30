"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Plus, Minus, Heart } from "lucide-react";
import { Product, Category } from "@/lib/data";
import { useCart } from "@/lib/CartContext";
import { useWishlist } from "@/lib/WishlistContext";
import { useRouter } from "next/navigation";

interface ProductPageClientProps {
  product: Product;
  category: Category;
}

export function ProductPageClient({ product, category }: ProductPageClientProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const router = useRouter();
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const isFavorited = isInWishlist(product.id);

  const selectedVariant = product.variants[selectedVariantIdx] || product.variants[0];
  const currentPrice = selectedVariant.price || 599;

  const handleAddToCart = () => {
    addToCart({
      id: `${product.id}-${selectedVariantIdx}`,
      name: `${product.name} (${selectedVariant.size}${selectedVariant.unit})`.trim(),
      price: currentPrice,
      image: product.image
    }, quantity);
  };

  const handleBuyNow = () => {
    addToCart({
      id: `${product.id}-${selectedVariantIdx}`,
      name: `${product.name} (${selectedVariant.size}${selectedVariant.unit})`.trim(),
      price: currentPrice,
      image: product.image
    }, quantity);
    router.push("/checkout");
  };

  return (
    <div className="relative min-h-screen bg-[#f1f1f2] overflow-hidden pt-12 md:pt-24 font-sans">
      <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 pb-12 md:pb-24">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          
          {/* Left Side: Product Stage */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="relative w-full aspect-square md:aspect-[4/5] flex justify-center items-center">
              {/* Wishlist Heart Icon */}
              <button 
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-4 left-4 z-30 w-12 h-12 rounded-full border flex items-center justify-center transition-all ${isFavorited ? "bg-[#c81c6a] border-transparent text-white shadow-xl shadow-[#c81c6a]/30" : "bg-white/80 backdrop-blur-md border-black/5 text-gray-300 hover:text-[#c81c6a] hover:border-[#c81c6a]/20 shadow-xl shadow-black/[0.05]"} active:scale-90`}
              >
                <Heart size={20} fill={isFavorited ? "currentColor" : "none"} strokeWidth={2.5} />
              </button>

              {/* Focal Product Bottle */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full h-[85%] z-10"
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain drop-shadow-[0_60px_100px_rgba(0,0,0,0.12)]"
                  priority
                />
              </motion.div>
            </div>

            {/* Thumbnail Row */}
            <div className="flex gap-4 md:gap-8 mt-8 md:mt-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-20 h-20 md:w-32 md:h-32 rounded-[1.5rem] md:rounded-[2.5rem] bg-black/[0.03] border border-white flex items-center justify-center p-4 md:p-8 hover:bg-white hover:shadow-xl transition-all duration-500 cursor-pointer group">
                  <div className="relative w-full h-full group-hover:scale-110 transition-transform duration-500">
                    <Image src={product.image} alt="" fill className="object-contain" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Product Details & Controls */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-5 flex flex-col pt-4 md:pt-12"
          >
            {/* Product Header */}
            <h2 className="text-5xl md:text-7xl font-black font-playfair tracking-tighter text-[#5d5f61] leading-none mb-6">
              {product.name}
            </h2>
            <p className="text-[#5d5f61] font-black text-[11px] md:text-[13px] capitalize tracking-[0.3em] mb-12 opacity-60">
              {product.subtitle || "Nature's Sweetness In Every Product"}
            </p>

            {/* Selection Hub */}
            <div className="flex flex-wrap items-center gap-12 mb-16">
              {/* Size Selectors */}
              <div className="flex items-center gap-8">
                {product.variants.map((v, idx) => {
                  const isActive = selectedVariantIdx === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedVariantIdx(idx)}
                      className="flex items-center gap-4 group transition-all"
                    >
                      <span className={`text-[12px] md:text-[14px] font-black capitalize tracking-widest transition-colors ${isActive ? "text-[#5d5f61]" : "text-gray-300 group-hover:text-gray-400"}`}>
                        {v.size}{v.unit}
                      </span>
                      <div className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${isActive ? "border-[#c81c6a] bg-white" : "border-gray-200 group-hover:border-gray-300 bg-white"}`}>
                        {isActive && <div className="w-2.5 h-2.5 rounded-full bg-[#c81c6a]" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-6">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-black/10 text-gray-400 hover:text-[#5d5f61] hover:border-[#5d5f61] transition-all active:scale-90"
                >
                  <Minus size={14} strokeWidth={3} />
                </button>
                <span className="text-xl font-black font-playfair text-[#5d5f61] min-w-[20px] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-black/10 text-gray-400 hover:text-[#5d5f61] hover:border-[#5d5f61] transition-all active:scale-90"
                >
                  <Plus size={14} strokeWidth={3} />
                </button>
              </div>
            </div>

            {/* Description Block */}
            <div className="space-y-6 mb-12 max-w-lg">
              <p className="text-[10px] md:text-[11px] font-black capitalize tracking-[0.3em] text-[#5d5f61]/60 mb-2">
                {product.subtitle || "Nature's Sweetness In Every Product"}
              </p>
              <p className="text-[#5d5f61] text-[13px] md:text-[14px] font-normal leading-[1.8] tracking-wide">
                {product.description}
              </p>

              {/* Product Highlights */}
              {product.highlights && product.highlights.length > 0 && (
                <div className="pt-4 border-t border-black/5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#c81c6a] block mb-3">
                    Product Highlights
                  </span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium text-[#5d5f61]">
                    {product.highlights.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c81c6a]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Price Staging */}
            <div className="flex items-baseline gap-6 mb-10 border-t border-black/5 pt-8">
              <span className="text-5xl md:text-7xl font-black font-playfair text-[#5d5f61] tracking-tighter">₹{currentPrice}</span>
              <span className="text-[10px] md:text-[11px] font-black capitalize tracking-[0.4em] text-gray-400">Inclusive taxes</span>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 px-8 py-5 rounded-full bg-[#c81c6a] text-white font-black capitalize text-[11px] tracking-[0.4em] transition-all hover:scale-[1.02] hover:bg-[#b0185a] active:scale-95 shadow-2xl shadow-[#c81c6a]/20"
              >
                Add to cart
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 px-8 py-5 rounded-full bg-transparent border border-[#707072] text-[#5d5f61] hover:bg-[#707072] hover:text-white font-black capitalize text-[11px] tracking-[0.4em] transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                Buy Now
              </button>
            </div>

            {/* Secondary Description */}
            <div className="mt-20 opacity-[0.25]">
               <p className="text-[10px] md:text-[11px] font-bold leading-[2] text-[#5d5f61] line-clamp-3">
                 {product.description}
               </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
