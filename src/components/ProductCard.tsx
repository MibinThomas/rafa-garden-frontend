"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/lib/CartContext";
import { Product } from "@/lib/data";
import { ShoppingBasket } from "lucide-react";

export function ProductCard({ product, accentColor = "#c81c6a" }: { product: Product, accentColor?: string }) {
  const { addToCart } = useCart();
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);

  const selectedVariant = product.variants[selectedVariantIdx] || { size: "Standard", unit: "", price: 599 };
  const currentPrice = selectedVariant.price || 599.00;

  const handleAddToCart = () => {
    addToCart({
      id: `${product.id}-${selectedVariantIdx}`, // unique ID per variant
      name: `${product.name} (${selectedVariant.size} ${selectedVariant.unit})`.trim(),
      price: currentPrice
    });
  };

  return (
    <div className="flex flex-col bg-white/80 backdrop-blur-md rounded-[1.5rem] p-4 border border-white hover:border-black/5 hover:shadow-xl hover:shadow-black/5 transition-all duration-500 overflow-hidden group h-full">
      
      {/* Product Image */}
      <div className="relative w-full h-32 md:h-40 xl:h-44 mb-3 rounded-2xl flex items-center justify-center p-3 bg-black/5">
        <div className="relative w-full h-full transform group-hover:scale-110 transition-transform duration-700 ease-out">
            <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain drop-shadow-xl"
            />
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-col flex-1 text-left">
        <h3 className="font-bold text-lg md:text-xl text-[#0b2b1a] mb-1 font-[family-name:var(--font-inter)] tracking-tight line-clamp-1">
          {product.name}
        </h3>
        <p className="text-[0.7rem] md:text-xs opacity-60 line-clamp-2 md:line-clamp-3 mb-3 leading-relaxed font-sans min-h-[2.5rem]">
          {product.description}
        </p>

        {/* Variants */}
        {product.variants && product.variants.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3 mt-auto">
            {product.variants.map((v, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedVariantIdx(idx)}
                className={`px-2 py-1 rounded-full text-[9px] font-bold transition-all border ${
                  idx === selectedVariantIdx 
                    ? "bg-[#0b2b1a] text-white border-[#0b2b1a]" 
                    : "bg-white/50 text-[#0b2b1a] border-black/10 hover:border-black/30"
                }`}
              >
                {v.size} <span className="opacity-70 text-[0.6rem]">{v.unit}</span>
              </button>
            ))}
          </div>
        )}

        {/* Footer: Price & Add To Cart */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-black/5">
          <div className="flex flex-col">
            <span className="text-[0.55rem] uppercase tracking-widest font-bold opacity-50 mb-0.5">Price</span>
            <span className="font-bold text-base md:text-lg tabular-nums">
              <span style={{ color: accentColor }} className="mr-0.5">₹</span>
              {currentPrice.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            style={{ backgroundColor: accentColor }}
            className="flex items-center justify-center w-10 h-10 rounded-full text-white hover:scale-105 hover:brightness-110 active:scale-95 transition-all shadow-md group/btn"
          >
            <ShoppingBasket size={16} className="group-hover/btn:-rotate-12 transition-transform duration-300" />
            <span className="sr-only">Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
