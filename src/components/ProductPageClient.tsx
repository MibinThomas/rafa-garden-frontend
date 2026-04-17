"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Heart, ArrowLeft } from "lucide-react";
import { Product, Category } from "@/lib/data";
import { useCart } from "@/lib/CartContext";
import { useWishlist } from "@/lib/WishlistContext";
import Link from "next/link";

interface ProductPageClientProps {
  product: Product;
  category: Category;
}

export function ProductPageClient({ product, category }: ProductPageClientProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const isFavorited = isInWishlist(product.id);

  const selectedVariant = product.variants[selectedVariantIdx] || product.variants[0];
  const currentPrice = selectedVariant.price || 599;

  const handleAddToCart = () => {
    addToCart({
      id: `${product.id}-${selectedVariantIdx}`,
      name: `${product.name} (${selectedVariant.size}${selectedVariant.unit})`.trim(),
      price: currentPrice
    }, quantity);
  };

  return (
    <div className="relative min-h-screen bg-[#e6e7e8] overflow-hidden pt-24">
      {/* Background Macro-Typography (Watermark) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
        <h1 className="text-[30vw] md:text-[23vw] font-dharma-gothic leading-none text-black/[0.03] uppercase tracking-tighter">
          {category.title}
        </h1>
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 pb-12 md:pb-24">
        
        {/* Navigation / Back Button */}
        <Link 
          href="/shop" 
          className="inline-flex items-center gap-2 text-black/40 hover:text-black transition-colors mb-8 group"
        >
          <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center group-hover:border-black/30 transition-all">
            <ArrowLeft size={14} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest font-avant-garde">Back to Shop</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          {/* Left Side: Cinematic Product Stage */}
          <div className="relative flex justify-center items-center h-[500px] md:h-[700px]">
            {/* Background Accent / Atmosphere */}
            <div 
              className="absolute w-[80%] h-[80%] rounded-full blur-[120px] opacity-20"
              style={{ backgroundColor: category.color }}
            />

            {/* Decorative Botanical Elements */}
            <div className="absolute inset-0 z-0">
              <motion.div
                animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[10%] left-[5%] w-24 h-24 md:w-32 md:h-32"
              >
                <Image src="/images/hero/floatingpitaya.png" alt="" fill className="object-contain px-4" />
              </motion.div>
              <motion.div
                animate={{ y: [0, 20, 0], rotate: [0, -8, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-[15%] right-[5%] w-28 h-28 md:w-40 md:h-40 rotate-[15deg]"
              >
                <Image src="/images/hero/floatingpitaya.png" alt="" fill className="object-contain px-4" />
              </motion.div>
              <motion.div
                animate={{ y: [0, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute top-[40%] right-[10%] w-16 h-16 md:w-20 md:h-20 opacity-60"
              >
                <Image src="/images/hero/floatingpitaya.png" alt="" fill className="object-contain px-2" />
              </motion.div>
            </div>

            {/* Focal Product Bottle */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full h-full max-h-[450px] md:max-h-[600px] z-10"
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain drop-shadow-[0_45px_100px_rgba(0,0,0,0.15)]"
                priority
              />
            </motion.div>
          </div>

          {/* Right Side: High-Fidelity Interaction Hub */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col"
          >
            {/* Category Marker */}
            <span 
              className="text-[10px] md:text-[12px] font-bold uppercase tracking-[0.5em] mb-4"
              style={{ color: category.color }}
            >
              Rafah {category.title} Heritage
            </span>

            {/* Product Header */}
            <h2 className="text-5xl md:text-7xl font-black font-playfair tracking-tight text-[#333333] leading-[1.1] mb-2">
              <span className="block opacity-40 capitalize">{category.title}</span>
              {product.name.replace("Sample Product", "Crush Product")}
            </h2>
            <p className="text-gray-400 font-medium italic text-sm md:text-base mb-10">
              Nature's Sweetness in Every Drink
            </p>

            {/* Selection Hub */}
            <div className="flex flex-wrap items-center gap-10 mb-12">
              {/* Size Selectors (Circular Indicators as per Mockup) */}
              <div className="flex items-center gap-6">
                {product.variants.map((v, idx) => {
                  const isActive = selectedVariantIdx === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedVariantIdx(idx)}
                      className="flex items-center gap-2 group transition-all"
                    >
                      <span className={`text-sm font-bold font-avant-garde tracking-tight transition-colors ${isActive ? "text-[#333333]" : "text-gray-300 group-hover:text-gray-500"}`}>
                        {v.size}{v.unit}
                      </span>
                      <div className={`w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${isActive ? "border-[#c81c6a]" : "border-gray-200 group-hover:border-gray-300"}`}>
                        <div className={`w-2 h-2 rounded-full transition-all ${isActive ? "bg-[#c81c6a]" : "bg-transparent"}`} />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 bg-white/40 backdrop-blur-sm p-2 rounded-2xl border border-white/20">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/60 hover:bg-white text-gray-400 hover:text-black transition-all"
                >
                  <Minus size={14} />
                </button>
                <span className="w-6 text-center text-sm font-black font-playfair">{quantity}</span>
                <button
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/60 hover:bg-white text-gray-400 hover:text-black transition-all"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Description Block */}
            <div className="max-w-md mb-12">
              <p className="text-gray-500 text-sm md:text-base leading-relaxed font-inter opacity-70 mb-6">
                Rafah Garden believes that true health and happiness begin with nature's sweetness. 
                Nestled in our farm, we lovingly cultivate fresh red velvety dragon fruits, known for their rich 
                taste and powerful health benefits.
              </p>
              <p className="text-gray-500 text-sm md:text-base leading-relaxed font-inter opacity-70">
                From handpicking each fruit to carefully preparing our Dragon Fruit Crush, we ensure 
                that every product carries the freshness of our farm and the goodness of nature.
              </p>
            </div>

            {/* Price Staging */}
            <div className="flex items-baseline gap-4 mb-10">
              <span className="text-5xl font-black font-playfair text-[#333333]">₹{currentPrice}</span>
              <span className="text-xs font-medium text-gray-400 italic">Inclusive taxes</span>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={handleAddToCart}
                className="px-10 py-5 rounded-full bg-[#c81c6a] text-white font-black uppercase text-[10px] tracking-widest transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-brand-pink/20"
              >
                Add to cart
              </button>
              <button
                className="px-10 py-5 rounded-full bg-[#666c75] text-white font-black uppercase text-[10px] tracking-widest transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-gray-400/20"
              >
                Buy Now
              </button>
              <button 
                onClick={() => toggleWishlist(product.id)}
                className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all ${isFavorited ? "bg-[#ef4444] border-transparent text-white" : "bg-white/40 border-black/5 text-gray-400 hover:text-red-500 hover:bg-white"}`}
              >
                <Heart size={20} fill={isFavorited ? "currentColor" : "none"} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
