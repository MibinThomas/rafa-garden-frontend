"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { User, ShoppingBasket, Search, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/CartContext";
import { useHeaderColor } from "@/lib/HeaderColorContext";

export function FloatingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { openCart, items } = useCart();
  const { headerColor, isImmersive } = useHeaderColor();
  const itemCount = items.reduce((total: number, item: any) => total + item.quantity, 0);

  if (pathname.startsWith('/admin')) return null;

  return (
    <>
      {/* Unified Desktop Header */}
      <div className={`w-full hidden md:flex items-center pt-8 pb-4 pointer-events-auto select-none transition-all duration-1000 ${isImmersive ? "absolute top-0 left-0 z-50 bg-transparent" : "bg-[#e6e7e8]"}`}>
        <div className="max-w-[1700px] mx-auto w-full flex items-center px-6 md:px-12">
          
          {/* Logo Section - Flex-1 to balance with Right Section */}
          <div className="flex-1 flex items-center">
            <Link href="/" className="flex items-center group transition-transform duration-300 hover:scale-[1.02]">
              <div className="relative w-32 h-14">
                <Image
                  src="/images/logo/Rafah logo.webp" 
                  alt="Rafah Garden"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </div>
  
          {/* Navigation Links - Centered between two Flex-1 containers */}
          <div className="flex-initial flex items-center justify-center gap-10 lg:gap-14 px-8">
            {["Home", "Shop", "Blog", "About", "Contact"].map((link) => (
              <Link 
                key={link} 
                href={link === "Home" ? "/" : `/${link.toLowerCase()}`}
                className="text-[#333333]/50 font-avant-garde font-medium text-[0.85rem] hover:text-[#333333] transition-colors relative group"
              >
                {link}
                <motion.span 
                  className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-[#9a0c52] transition-all duration-300 group-hover:w-full" 
                />
              </Link>
            ))}
          </div>

          {/* Right Section: Search & Actions - Flex-1 to balance with Logo Section */}
          <div className="flex-1 flex items-center gap-4 lg:gap-6 justify-end">
            {/* Search Bar UI */}
            <div className="relative group">
              <div className="flex items-center bg-[#e5e5e7] hover:bg-[#dcdce0] transition-colors rounded-full px-4 py-2 w-48 lg:w-64 gap-3 border border-transparent focus-within:border-[#9a0c52]/20">
                <Search size={16} className="text-[#333333]/30" />
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  className="bg-transparent border-none outline-none text-[0.75rem] w-full text-[#333333] placeholder:text-[#333333]/25 font-avant-garde"
                />
              </div>
            </div>

            {/* Utility Icons */}
            <div className="flex items-center gap-4 border-l border-black/5 pl-6">
              <Link href="/auth" className="text-[#333333]/50 hover:text-[#333333] hover:scale-110 transition-all block">
                <User size={22} strokeWidth={1.5} />
              </Link>
              
              <button 
                onClick={openCart}
                className="text-[#333333]/50 hover:text-[#333333] relative hover:scale-110 transition-all"
              >
                <ShoppingBasket size={24} strokeWidth={1.5} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#9a0c52] text-white text-[0.6rem] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-lg">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Redesigned Mobile Header - Matching Mockup */}
      <div className={`w-full flex md:hidden items-center justify-between px-6 py-4 pointer-events-auto transition-all duration-1000 ${isImmersive ? "absolute top-0 left-0 z-50 bg-transparent" : "bg-[#e6e7e8]"}`}>
        
        <div className="flex-none">
          <Link href="/" className="flex items-center">
            <div className="relative w-8 h-8">
              <Image
                src="/images/logo/mobilelogo.webp"
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
          </Link>
        </div>

        {/* Center: Pill-shaped Search Bar */}
        <div className="flex-1 flex justify-center px-4">
          <div className="relative w-full max-w-[200px] flex items-center bg-[#EAEAEA] rounded-full h-8 px-3 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]">
            <Search size={14} className="text-[#333333]/30 mr-2" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-transparent border-none outline-none text-[0.7rem] w-full text-[#333333] placeholder:text-[#333333]/30 font-avant-garde"
            />
          </div>
        </div>

        {/* Right: Action Icons */}
        <div className="flex-none flex items-center gap-4">
          <Link href="/auth" className="text-[#333333]/50">
            <User size={20} strokeWidth={1.5} />
          </Link>
          <button 
            onClick={openCart}
            className="text-[#333333]/50 relative"
          >
            <ShoppingBasket size={22} strokeWidth={1.5} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#9a0c52] text-white text-[0.5rem] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full">
                {itemCount}
              </span>
            )}
          </button>
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="text-[#333333]/40 hover:text-[#333333] transition-colors"
          >
            <Menu size={22} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Right-Side Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Dark Overlay Map */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[100] md:hidden"
            />
            {/* Premium Drawer Container */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 right-0 h-[100dvh] w-[85%] max-w-sm bg-[#e6e7e8] z-[101] shadow-[-20px_0_40px_rgba(0,0,0,0.15)] flex flex-col md:hidden"
            >
              {/* Header inside drawer */}
              <div className="flex items-center justify-between p-6 pb-2">
                <span className="font-avant-garde font-bold text-[#333333]/40 text-[0.65rem] tracking-[0.2em] uppercase">Navigation</span>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-[#333333]/5 text-[#333333]/60 hover:bg-[#333333]/10 hover:text-[#333333] transition-all"
                >
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>

              {/* Drawer Links */}
              <div className="flex flex-col gap-6 p-8 mt-4">
                {["Home", "Shop", "Blog", "About", "Contact"].map((link, idx) => (
                  <motion.div
                    key={link}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + idx * 0.05, duration: 0.4 }}
                  >
                    <Link 
                      href={link === "Home" ? "/" : `/${link.toLowerCase()}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-4xl font-black font-avant-garde tracking-tighter text-[#333333] hover:text-[#9a0c52] transition-colors inline-block"
                    >
                      {link}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Bottom Drawer Footer Info */}
              <div className="mt-auto p-8 pt-8 border-t border-[#333333]/10 bg-white/30 backdrop-blur-sm">
                <p className="text-[0.65rem] text-[#333333]/50 font-medium font-avant-garde uppercase tracking-[0.15em] leading-relaxed">
                  Heritage Dragon Fruit<br />
                  Harvested with Care
                </p>
                <div className="flex items-center gap-6 mt-6">
                   <Link href="/auth" onClick={() => setIsMenuOpen(false)} className="text-[#333333]/50 hover:text-black transition-colors">
                     <User size={20} strokeWidth={1.5} />
                   </Link>
                   <button onClick={() => { setIsMenuOpen(false); openCart(); }} className="text-[#333333]/50 hover:text-black transition-colors relative">
                     <ShoppingBasket size={20} strokeWidth={1.5} />
                     {itemCount > 0 && (
                       <span className="absolute -top-1.5 -right-1.5 bg-[#9a0c52] text-white text-[0.55rem] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-lg">
                         {itemCount}
                       </span>
                     )}
                   </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
