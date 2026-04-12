"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { User, ShoppingBasket, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/CartContext";
import { useHeaderColor } from "@/lib/HeaderColorContext";

export function FloatingHeader() {
  const pathname = usePathname();
  const { openCart, items } = useCart();
  const { headerColor } = useHeaderColor();
  const itemCount = items.reduce((total: number, item: any) => total + item.quantity, 0);

  if (pathname.startsWith('/admin')) return null;

  return (
    <>
      {/* Unified Desktop Header */}
      <div className="w-full hidden md:flex items-center pt-8 pb-4 pointer-events-auto select-none bg-[#f1f1f2]">
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

      {/* Mobile Header - Unified */}
      <div className="w-full flex md:hidden items-center justify-between px-4 pt-4 pb-2 pointer-events-auto bg-[#f1f1f2]">
        <div className="w-full flex items-center justify-between rounded-full bg-white px-5 py-2.5 shadow-sm border border-black/5">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative w-24 h-10">
              <Image
                src="/images/logo/Rafah logo.webp"
                alt="Rafah Garden"
                fill
                className="object-contain"
              />
            </div>
          </Link>

          {/* Action Icons */}
          <div className="flex items-center gap-4">
            <button className="text-[#333333]/50">
              <Search size={18} strokeWidth={2} />
            </button>
            <Link href="/auth" className="text-[#333333]/50">
              <User size={18} strokeWidth={2} />
            </Link>
            <button 
              onClick={openCart}
              className="text-[#333333]/50 relative"
            >
              <ShoppingBasket size={20} strokeWidth={2} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#9a0c52] text-white text-[0.5rem] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
