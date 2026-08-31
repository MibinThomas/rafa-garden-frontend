"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { User, ShoppingBasket, Search, Menu, X, ArrowRight, Sparkles, Heart } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/lib/CartContext";
import { useWishlist } from "@/lib/WishlistContext";
import { useHeaderColor } from "@/lib/HeaderColorContext";
import { useSiteSettings } from "@/lib/SiteSettingsContext";
import { CATEGORIES } from "@/lib/data";

export function FloatingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [categoriesData, setCategoriesData] = useState<any[]>(CATEGORIES);
  const searchRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const router = useRouter();
  const { openCart, items } = useCart();
  const { wishlistIds } = useWishlist();
  const { headerColor, isImmersive } = useHeaderColor();
  const { settings } = useSiteSettings();
  const itemCount = items.reduce((total: number, item: any) => total + item.quantity, 0);
  const wishlistCount = wishlistIds.length;


  useEffect(() => {
    fetch("/api/categories")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.length > 0) setCategoriesData(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const allProducts = categoriesData.flatMap((cat) =>
    (cat.products || []).map((p: any) => ({
      ...p,
      categoryColor: cat.color || "#c81c6a",
      categoryTitle: cat.title,
    }))
  );

  const searchResults = searchQuery.trim() === ""
    ? []
    : allProducts.filter((p: any) => {
        const q = searchQuery.toLowerCase();
        return (
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.subtitle?.toLowerCase().includes(q) ||
          p.categoryTitle?.toLowerCase().includes(q)
        );
      }).slice(0, 5);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearchFocused(false);
    router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const primaryMenu = [
    { label: settings["menu_nav_1_label"] || "Home", url: settings["menu_nav_1_url"] || "/" },
    { label: settings["menu_nav_2_label"] || "Shop", url: settings["menu_nav_2_url"] || "/shop" },
    { label: settings["menu_nav_3_label"] || "Blog", url: settings["menu_nav_3_url"] || "/blog" },
    { label: settings["menu_nav_4_label"] || "About", url: settings["menu_nav_4_url"] || "/about" },
    { label: settings["menu_nav_5_label"] || "Contact", url: settings["menu_nav_5_url"] || "/contact" }
  ].filter(m => m.label && m.label.trim() !== "");

  if (pathname.startsWith('/admin')) return null;

  return (
    <>
      {/* Unified Desktop Header */}
      <div className={`w-full hidden lg:flex items-center pt-8 pb-4 pointer-events-auto select-none transition-all duration-1000 ${isImmersive ? "absolute top-0 left-0 z-50 bg-transparent" : "bg-[#f1f1f2]"}`}>
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
            {primaryMenu.map((item) => (
              <Link 
                key={item.label} 
                href={item.url}
                className="text-[#333333]/50 font-avant-garde font-medium text-[0.85rem] hover:text-[#333333] transition-colors relative group"
              >
                {item.label}
                <motion.span 
                  className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-[#9a0c52] transition-all duration-300 group-hover:w-full" 
                />
              </Link>
            ))}
          </div>

          {/* Right Section: Search & Actions - Flex-1 to balance with Logo Section */}
          <div className="flex-1 flex items-center gap-4 lg:gap-6 justify-end relative" ref={searchRef}>
            {/* Search Bar UI */}
            <form onSubmit={handleSearchSubmit} className="relative group">
              <div className="flex items-center bg-[#e5e5e7] hover:bg-[#dcdce0] transition-colors rounded-full px-4 py-2 w-48 lg:w-64 gap-3 border border-transparent focus-within:border-[#9a0c52]/30 focus-within:bg-white shadow-xs">
                <Search size={16} className="text-[#333333]/40" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchFocused(true);
                  }}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Search products..." 
                  className="bg-transparent border-none outline-none text-[0.75rem] w-full text-[#333333] placeholder:text-[#333333]/30 font-avant-garde"
                />
                {searchQuery && (
                  <button 
                    type="button" 
                    onClick={() => setSearchQuery("")} 
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Desktop Live Autocomplete Dropdown */}
              <AnimatePresence>
                {isSearchFocused && searchQuery.trim() !== "" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-3 w-[360px] lg:w-[420px] bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-[100] overflow-hidden"
                  >
                    <div className="p-3 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                        <Sparkles size={12} className="text-[#c81c6a]" /> Search Results ({searchResults.length})
                      </span>
                      <span className="text-[10px] text-gray-400">Press Enter for all</span>
                    </div>

                    <div className="max-h-[360px] overflow-y-auto divide-y divide-gray-50">
                      {searchResults.length > 0 ? (
                        searchResults.map((product) => {
                          const price = product.variants?.[0]?.price || product.price || 599;
                          return (
                            <div
                              key={product.id || product._id}
                              onClick={() => {
                                setIsSearchFocused(false);
                                router.push(`/product/${product.id || product._id}`);
                              }}
                              className="p-3 flex items-center gap-3 hover:bg-gray-50/80 transition-colors cursor-pointer group/item"
                            >
                              {/* Product Thumbnail Image */}
                              <div className="relative w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 p-1 border border-gray-200/50">
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  fill
                                  className="object-contain group-hover/item:scale-105 transition-transform duration-200"
                                />
                              </div>

                              {/* Title & Subtitle */}
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-bold text-[#1d1d1f] line-clamp-1 group-hover/item:text-[#c81c6a] transition-colors">
                                  {product.name}
                                </h4>
                                <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">
                                  {product.subtitle || product.categoryTitle || "Botanical Product"}
                                </p>
                              </div>

                              {/* Price Tag */}
                              <div className="text-right flex-shrink-0">
                                <span className="text-xs font-bold text-[#1d1d1f]">₹{price}</span>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="p-6 text-center text-gray-400 text-xs">
                          No products found matching "{searchQuery}"
                        </div>
                      )}
                    </div>

                    {/* View All Footer Button */}
                    <button
                      type="button"
                      onClick={() => handleSearchSubmit()}
                      className="w-full py-2.5 px-4 bg-[#1d1d1f] hover:bg-[#c81c6a] text-white text-xs font-bold transition-colors flex items-center justify-between"
                    >
                      <span>View all matching results</span>
                      <ArrowRight size={14} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>

            {/* Utility Icons */}
            <div className="flex items-center gap-4 border-l border-black/5 pl-6">
              <Link href="/wishlist" className="text-[#333333]/50 hover:text-[#c81c6a] hover:scale-110 transition-all relative block" title="Wishlist">
                <Heart size={22} strokeWidth={1.5} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#c81c6a] text-white text-[0.6rem] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-lg">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link href="/auth" className="text-[#333333]/50 hover:text-[#333333] hover:scale-110 transition-all block">
                <User size={22} strokeWidth={1.5} />
              </Link>
              
              <button 
                onClick={openCart}
                className="text-[#333333]/50 hover:text-[#333333] relative hover:scale-110 transition-all cursor-pointer"
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

      {/* Redesigned Mobile & Tablet Header */}
      <div className={`w-full flex lg:hidden items-center justify-between px-6 py-4 pointer-events-auto transition-all duration-1000 ${isImmersive ? "absolute top-0 left-0 z-50 bg-transparent" : "bg-[#f1f1f2]"}`}>
        
        <div className="flex-none">
          <Link href="/" className="flex items-center">
            <div className="relative w-8 h-8 md:w-10 md:h-10">
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
        <div className="flex-1 flex justify-center px-4 md:px-8 relative">
          <form onSubmit={handleSearchSubmit} className="w-full max-w-[200px] md:max-w-[320px]">
            <div className="relative flex items-center bg-[#EAEAEA] rounded-full h-8 md:h-10 px-3 md:px-5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]">
              <Search size={14} className="text-[#333333]/30 mr-2 md:mr-3 flex-shrink-0" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                }}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search..." 
                className="bg-transparent border-none outline-none text-[0.7rem] md:text-[0.8rem] w-full text-[#333333] placeholder:text-[#333333]/30 font-avant-garde"
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery("")} className="text-xs text-gray-400 ml-1">✕</button>
              )}
            </div>

            {/* Mobile Live Autocomplete Dropdown */}
            <AnimatePresence>
              {isSearchFocused && searchQuery.trim() !== "" && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute left-0 right-0 top-full mt-2 bg-white/95 backdrop-blur-xl border border-gray-100 rounded-xl shadow-2xl z-[100] overflow-hidden"
                >
                  <div className="max-h-[280px] overflow-y-auto divide-y divide-gray-50">
                    {searchResults.length > 0 ? (
                      searchResults.map((product) => {
                        const price = product.variants?.[0]?.price || product.price || 599;
                        return (
                          <div
                            key={product.id || product._id}
                            onClick={() => {
                              setIsSearchFocused(false);
                              router.push(`/product/${product.id || product._id}`);
                            }}
                            className="p-2.5 flex items-center gap-2.5 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
                          >
                            <div className="relative w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 p-1">
                              <Image src={product.image} alt={product.name} fill className="object-contain" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-[11px] font-bold text-[#1d1d1f] truncate">{product.name}</h4>
                              <p className="text-[9px] text-gray-500 truncate">{product.categoryTitle}</p>
                            </div>
                            <span className="text-[11px] font-bold text-[#c81c6a]">₹{price}</span>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-4 text-center text-gray-400 text-[11px]">No products found</div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSearchSubmit()}
                    className="w-full py-2 px-3 bg-[#1d1d1f] text-white text-[10px] font-bold flex items-center justify-between"
                  >
                    <span>View all results</span>
                    <ArrowRight size={12} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>

        {/* Right: Action Icons */}
        <div className="flex-none flex items-center gap-4 md:gap-6">
          <Link href="/wishlist" className="text-[#333333]/50 hover:text-[#c81c6a] relative" title="Wishlist">
            <Heart size={20} strokeWidth={1.5} className="md:w-6 md:h-6" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 md:-top-1.5 md:-right-1.5 bg-[#c81c6a] text-white text-[0.5rem] md:text-[0.6rem] font-bold w-3.5 h-3.5 md:w-4.5 md:h-4.5 flex items-center justify-center rounded-full">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link href="/auth" className="text-[#333333]/50">
            <User size={20} strokeWidth={1.5} className="md:w-6 md:h-6" />
          </Link>
          <button 
            onClick={openCart}
            className="text-[#333333]/50 relative"
          >
            <ShoppingBasket size={22} strokeWidth={1.5} className="md:w-[26px] md:h-[26px]" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 md:-top-1.5 md:-right-1.5 bg-[#9a0c52] text-white text-[0.5rem] md:text-[0.6rem] font-bold w-3.5 h-3.5 md:w-4.5 md:h-4.5 flex items-center justify-center rounded-full">
                {itemCount}
              </span>
            )}
          </button>
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="text-[#333333]/40 hover:text-[#333333] transition-colors"
          >
            <Menu size={22} strokeWidth={1.5} className="md:w-[26px] md:h-[26px]" />
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
              className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[100] lg:hidden"
            />
            {/* Premium Drawer Container */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 right-0 h-[100dvh] w-[85%] max-w-sm bg-[#f1f1f2] z-[101] shadow-[-20px_0_40px_rgba(0,0,0,0.15)] flex flex-col lg:hidden"
            >
              {/* Header inside drawer */}
              <div className="flex items-center justify-between p-6 pb-2">
                <span className="font-avant-garde font-bold text-[#333333]/40 text-[0.65rem] tracking-[0.2em] capitalize">Navigation</span>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-[#333333]/5 text-[#333333]/60 hover:bg-[#333333]/10 hover:text-[#333333] transition-all"
                >
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>

              {/* Drawer Links */}
              <div className="flex flex-col gap-6 p-8 mt-4">
                {primaryMenu.map((item, idx) => (
                  <motion.div
                    key={item.label}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + idx * 0.05, duration: 0.4 }}
                  >
                    <Link 
                      href={item.url}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-4xl font-black font-avant-garde tracking-tighter text-[#333333] hover:text-[#9a0c52] transition-colors inline-block"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Bottom Drawer Footer Info */}
              <div className="mt-auto p-8 pt-8 border-t border-[#333333]/10 bg-white/30 backdrop-blur-sm">
                <p className="text-[0.65rem] text-[#333333]/50 font-medium font-avant-garde capitalize tracking-[0.15em] leading-relaxed">
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

