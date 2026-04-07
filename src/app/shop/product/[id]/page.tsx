"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ShoppingBasket, Heart, Share2, ShieldCheck, Truck, RefreshCcw } from "lucide-react";
import { CATEGORIES } from "@/lib/data";
import { useCart } from "@/lib/CartContext";
import { useWishlist } from "@/lib/WishlistContext";
import { useHeaderColor } from "@/lib/HeaderColorContext";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { setHeaderColor, setIsImmersive } = useHeaderColor();
  
  const [product, setProduct] = useState<any>(null);
  const [category, setCategory] = useState<any>(null);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // Find product across all categories
    for (const cat of CATEGORIES) {
      const found = cat.products.find(p => p.id === id);
      if (found) {
        setProduct(found);
        setCategory(cat);
        setHeaderColor(cat.color);
        break;
      }
    }
    setIsImmersive(false);
  }, [id, setHeaderColor, setIsImmersive]);

  if (!product) return null;

  const selectedVariant = product.variants[selectedVariantIdx];
  const isFavorited = isInWishlist(product.id);
  const activeColor = category?.color || "#c81c6a";

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
    <div className="min-h-screen bg-[#f1f1f2] pt-24 pb-20 px-6 font-sans">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Navigation */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-[#0b2b1a] transition-colors mb-12"
        >
          <ArrowLeft size={16} /> Back to Collection
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24">
          
          {/* Left: Premium Image Gallery (Single Focused View) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative aspect-[3/4] rounded-[3rem] bg-white border border-white shadow-2xl overflow-hidden group"
          >
             <Image 
               src={product.image}
               alt={product.name}
               fill
               className="object-cover p-0 transition-transform duration-700 group-hover:scale-105"
               priority
             />
             <div className="absolute top-8 right-8 flex flex-col gap-4">
                <button 
                  onClick={() => toggleWishlist(product.id)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md border border-black/5 transition-all ${
                    isFavorited ? "bg-red-500 text-white" : "bg-white/80 text-gray-400 hover:text-red-500"
                  }`}
                >
                  <Heart size={20} fill={isFavorited ? "currentColor" : "none"} />
                </button>
                <button className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-md border border-black/5 flex items-center justify-center text-gray-400 hover:text-[#0b2b1a] transition-all">
                  <Share2 size={20} />
                </button>
             </div>
          </motion.div>

          {/* Right: Product Details & Selection */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <span className="text-xs font-bold uppercase tracking-[0.4em] text-gray-400 mb-4">{category?.title} Heritage</span>
            <h1 className="text-5xl md:text-6xl font-black font-playfair text-[#0b2b1a] mb-6 leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-4xl font-black tabular-nums text-[#0b2b1a]">₹{selectedVariant.price || 599}</span>
              <span className="text-sm font-bold uppercase tracking-widest text-gray-400 line-through">₹{(selectedVariant.price || 599) * 1.5}</span>
            </div>

            <p className="text-lg text-gray-500 font-inter leading-relaxed mb-10 max-w-xl">
              {product.description}
            </p>

            {/* Selection Area */}
            <div className="space-y-10 mb-12">
               {/* Variants */}
               <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#0b2b1a] mb-4">Select Variation</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.variants.map((v: any, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedVariantIdx(idx)}
                        className={`px-6 py-3 rounded-xl text-sm font-bold transition-all border ${
                          idx === selectedVariantIdx 
                            ? "border-black bg-[#0b2b1a] text-white shadow-xl" 
                            : "border-black/10 text-gray-500 hover:border-black/30"
                        }`}
                      >
                        {v.size} {v.unit}
                      </button>
                    ))}
                  </div>
               </div>

               {/* Quantity Selector */}
               <div className="flex items-center gap-6">
                 <h3 className="text-xs font-bold uppercase tracking-widest text-[#0b2b1a]">Quantity</h3>
                 <div className="flex items-center border border-black/10 rounded-xl p-1 bg-white">
                   <button 
                     onClick={() => setQuantity(Math.max(1, quantity - 1))}
                     className="w-10 h-10 flex items-center justify-center font-bold hover:bg-black/5 rounded-lg transition-colors"
                   >-</button>
                   <span className="w-12 text-center font-bold">{quantity}</span>
                   <button 
                     onClick={() => setQuantity(quantity + 1)}
                     className="w-10 h-10 flex items-center justify-center font-bold hover:bg-black/5 rounded-lg transition-colors"
                   >+</button>
                 </div>
               </div>
            </div>

            {/* CTA's */}
            <div className="flex gap-4 mb-12">
               <button 
                 onClick={handleAddToCart}
                 className="flex-1 py-6 rounded-2xl text-white font-black tracking-widest uppercase text-xs flex items-center justify-center gap-4 active:scale-95 transition-all shadow-2xl"
                 style={{ backgroundColor: activeColor }}
               >
                 <ShoppingBasket size={18} /> Add to Cart
               </button>
            </div>

            {/* Value Props */}
            <div className="grid grid-cols-3 gap-6 pt-10 border-t border-black/5">
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                    <ShieldCheck size={20} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Authentic</span>
                </div>
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <Truck size={20} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Fast Express</span>
                </div>
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                    <RefreshCcw size={20} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">7-Day Return</span>
                </div>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}
