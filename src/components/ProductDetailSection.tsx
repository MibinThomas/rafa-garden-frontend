"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { X, ShoppingBasket, Heart, Share2, ShieldCheck, Truck, RefreshCcw } from "lucide-react";
import { Product } from "@/lib/data";
import { useCart } from "@/lib/CartContext";
import { useWishlist } from "@/lib/WishlistContext";

interface ProductDetailSectionProps {
  product: Product;
  categoryTitle: string;
  categoryColor: string;
  onClose: () => void;
}

export function ProductDetailSection({ product, categoryTitle, categoryColor, onClose }: ProductDetailSectionProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const images = [product.image, product.image, product.image, product.image];

  const selectedVariant = product.variants[selectedVariantIdx] || product.variants[0] || {};
  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: `${product.id}-${selectedVariantIdx}`,
        name: `${product.name} (${selectedVariant.size} ${selectedVariant.unit})`.trim(),
        price: selectedVariant.price || 599
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      exit={{ opacity: 0, y: 50, height: 0 }}
      transition={{ duration: 0.5, ease: "circOut" }}
      className="w-full bg-[#f1f1f2] rounded-[3rem] shadow-2xl relative overflow-hidden mt-8 mb-16 border border-white/20"
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-black/5 flex items-center justify-center text-[#0b2b1a] hover:bg-black/10 transition-colors"
      >
        <X size={24} />
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 p-6 md:p-12 lg:p-16">
        {/* Left: Product Image Gallery */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 h-auto lg:h-[600px]">
          {/* Thumbnails */}
          <div className="flex flex-row lg:flex-col gap-3 lg:gap-4 overflow-x-auto lg:overflow-y-auto scrollbar-hide w-full lg:w-24 shrink-0 pb-2 lg:pb-0">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0 bg-[#f8f8f8] ${activeImageIndex === idx ? 'border-gray-800 shadow-md scale-[1.02]' : 'border-transparent opacity-60 hover:opacity-100'}`}
                style={activeImageIndex === idx ? { borderColor: categoryColor } : {}}
              >
                <Image src={img} alt={`${product.name} view ${idx + 1}`} fill className="object-cover p-2" />
              </button>
            ))}
          </div>

          {/* Main Image */}
          <div className="relative aspect-[4/5] lg:aspect-auto lg:flex-1 rounded-[2rem] bg-[#f8f8f8] overflow-hidden group">
            <Image
              src={images[activeImageIndex]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
            <div className="absolute top-4 right-4 lg:top-6 lg:right-6 flex flex-col gap-3">
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center backdrop-blur-md border border-black/5 transition-all shadow-md ${isFavorited ? "bg-red-500 text-white border-transparent" : "bg-white/90 text-gray-400 hover:text-red-500 hover:scale-105"
                  }`}
              >
                <Heart size={window?.innerWidth < 1024 ? 16 : 20} fill={isFavorited ? "currentColor" : "none"} />
              </button>
              <button className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/90 backdrop-blur-md border border-black/5 shadow-md flex items-center justify-center text-gray-400 hover:text-[#0b2b1a] hover:scale-105 transition-all">
                <Share2 size={window?.innerWidth < 1024 ? 16 : 20} />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="flex flex-col justify-center">
          <span className="text-xs font-bold uppercase tracking-[0.4em] text-gray-400 mb-3" style={{ color: categoryColor }}>{categoryTitle} Heritage</span>
          <h2 className="text-4xl md:text-5xl font-black font-playfair text-[#0b2b1a] mb-6 leading-tight">
            {product.name}
          </h2>

          <div className="flex items-baseline gap-4 mb-8">
            <span className="text-4xl font-black tabular-nums text-[#0b2b1a]">₹{selectedVariant.price || 599}</span>
            <span className="text-sm font-bold uppercase tracking-widest text-gray-400 line-through">₹{Math.floor((selectedVariant.price || 599) * 1.5)}</span>
          </div>

          <p className="text-base text-gray-500 font-inter leading-relaxed mb-10 max-w-lg">
            {product.description}
          </p>

          <div className="space-y-8 mb-10">
            {/* Variants */}
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Select Variation</h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedVariantIdx(idx)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all border ${idx === selectedVariantIdx
                        ? "shadow-lg text-white"
                        : "border-gray-200 text-gray-500 hover:border-gray-300 bg-white"
                      }`}
                    style={idx === selectedVariantIdx ? { backgroundColor: categoryColor, borderColor: categoryColor } : {}}
                  >
                    {v.size} {v.unit}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-6">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Quantity</h3>
              <div className="flex items-center border border-gray-200 rounded-xl p-1 bg-gray-50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center font-bold hover:bg-gray-200 rounded-lg transition-colors text-black"
                >-</button>
                <span className="w-12 text-center font-bold text-black">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center font-bold hover:bg-gray-200 rounded-lg transition-colors text-black"
                >+</button>
              </div>
            </div>
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            className="w-full py-5 rounded-2xl text-white font-black tracking-widest uppercase text-xs flex items-center justify-center gap-3 active:scale-[0.98] transition-transform shadow-xl mb-10"
            style={{ backgroundColor: categoryColor }}
          >
            <ShoppingBasket size={18} /> Add to Cart
          </button>

          {/* Value Props */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-100">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                <ShieldCheck size={18} />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Authentic</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <Truck size={18} />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Fast Express</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                <RefreshCcw size={18} />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">7-Day Return</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
