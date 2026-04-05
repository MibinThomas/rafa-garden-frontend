"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { User, ShoppingBasket } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import { useHeaderColor } from "@/lib/HeaderColorContext";

export function FloatingHeader() {
  const { openCart, items } = useCart();
  const { headerColor } = useHeaderColor();
  const itemCount = items.reduce((total: number, item: any) => total + item.quantity, 0);

  return (
    <div className="w-full hidden md:flex items-center justify-between px-16 pt-8 pb-2.5 pointer-events-auto select-none">
      
      {/* Left Pill: Logo */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1, backgroundColor: headerColor }}
        transition={{ 
          y: { duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] },
          backgroundColor: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
        }}
        className="rounded-full px-8 py-3 flex items-center shadow-[0_10px_30px_rgba(0,0,0,0.1)] cursor-pointer group hover:scale-[1.02] transition-transform duration-300"
      >
        <div className="relative w-32 h-10">
          <Image
            src="/images/logo/Rafah logo white.webp"
            alt="Rafah Garden"
            fill
            className="object-contain"
            priority
          />
        </div>
      </motion.div>

      {/* Right Pill: Navigation & Actions */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1, backgroundColor: headerColor }}
        transition={{ 
          y: { duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] },
          backgroundColor: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
        }}
        className="rounded-full px-10 py-3 flex items-center gap-14 shadow-[0_10px_30px_rgba(0,0,0,0.1)] pointer-events-auto"
      >
        {/* Navigation Links */}
        <div className="flex items-center gap-10">
          {["Home", "Shop", "About"].map((link) => (
            <Link 
              key={link} 
              href="/"
              className="text-white font-outfit font-medium text-[0.9rem] opacity-90 hover:opacity-100 transition-opacity relative group"
            >
              {link}
              <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-white transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Utility Icons */}
        <div className="flex items-center gap-6 border-l border-white/20 pl-10">
          <button className="text-white hover:scale-110 transition-transform">
            <User size={22} strokeWidth={2} />
          </button>
          
          <button 
            onClick={openCart}
            className="text-white relative hover:scale-110 transition-transform"
          >
            <ShoppingBasket size={24} strokeWidth={1.8} />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-white text-[#9a0c52] text-[0.65rem] font-bold w-4.5 h-4.5 flex items-center justify-center rounded-full shadow-lg">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </motion.div>

    </div>
  );
}
