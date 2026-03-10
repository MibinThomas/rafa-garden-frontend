"use client";

import { useCart } from "@/lib/CartContext";
import { ShoppingCart, Leaf } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const NAV_LINKS = ["Home", "About Us", "Product", "Blog", "Contact Us"];

export function Navbar() {
    const { openCart, items } = useCart();
    const [scrolled, setScrolled] = useState(false);
    const [hoveredLink, setHoveredLink] = useState<string | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const itemCount = items.reduce((total, item) => total + item.quantity, 0);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 border-b border-transparent ${scrolled
                    ? "bg-[#0b2b1a] backdrop-blur-md py-4 shadow-[0_4px_30px_rgba(0,0,0,0.7)] border-b-[#d4af37]/20"
                    : "bg-gradient-to-b from-[#0b2b1a]/80 to-transparent py-8"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">

                {/* Brand/Logo Section - Kerala Theme */}
                <div className="flex items-center gap-2 font-serif text-2xl tracking-wide text-[#fffdd0] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] cursor-pointer group">
                    <Leaf className="text-[#38b000] group-hover:text-[#d4af37] transition-colors duration-300" strokeWidth={2.5} />
                    <div className="flex flex-col">
                        <span className="font-bold leading-none">RAFA <span className="text-[#d4af37] font-light">GARDEN</span></span>
                        <span className="text-[0.5rem] tracking-[0.2em] text-[#38b000] uppercase font-sans mt-1">Kerala Heritage</span>
                    </div>
                </div>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center gap-8">
                    {NAV_LINKS.map((link) => (
                        <div
                            key={link}
                            className="relative cursor-pointer"
                            onMouseEnter={() => setHoveredLink(link)}
                            onMouseLeave={() => setHoveredLink(null)}
                        >
                            <span className={`text-sm font-medium tracking-wider uppercase transition-colors duration-300 ${hoveredLink === link ? "text-[#d4af37]" : "text-[#fffdd0]/90"
                                }`}>
                                {link}
                            </span>

                            {/* Interactive Kerala Gold Underline */}
                            {hoveredLink === link && (
                                <motion.div
                                    layoutId="nav-underline"
                                    className="absolute -bottom-2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Actions / Cart */}
                <div className="flex items-center gap-6">
                    <button
                        onClick={openCart}
                        className="relative flex items-center gap-2 px-6 py-2 rounded-full border border-[#d4af37]/40 bg-[#123e25]/50 hover:bg-[#d4af37] hover:border-[#d4af37] transition-all text-[#fffdd0] hover:text-[#0b2b1a] shadow-lg group backdrop-blur-md"
                    >
                        <ShoppingCart size={18} className="group-hover:scale-110 transition-transform" />
                        <span className="font-semibold tracking-widest text-xs translate-y-[1px] uppercase">Cart</span>
                        {itemCount > 0 && (
                            <span className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-[#ea580c] text-white font-bold rounded-full text-[10px] shadow-lg animate-pulse border border-white/20">
                                {itemCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </nav>
    );
}
