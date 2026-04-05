"use client";

import { useCart } from "@/lib/CartContext";
import { ShoppingCart, Leaf, Sun, Moon, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

const NAV_LINKS = ["Home", "About Us", "Product", "Blog", "Contact Us"];

export function Navbar() {
    const { openCart, items } = useCart();
    const { theme, setTheme } = useTheme();
    const [scrolled, setScrolled] = useState(false);
    const [hoveredLink, setHoveredLink] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Prevent body bounce when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => { document.body.style.overflow = "auto"; };
    }, [isMobileMenuOpen]);

    const itemCount = items.reduce((total, item) => total + item.quantity, 0);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 border-b border-transparent ${scrolled || isMobileMenuOpen
                ? "bg-white/90 backdrop-blur-md py-4 shadow-[0_4px_30px_rgba(0,0,0,0.05)] border-b-brand-pink/10"
                : "bg-transparent py-4 md:py-8"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">

                {/* Brand/Logo Section - New Premium Theme */}
                <div className="flex items-center gap-2 font-sans text-xl md:text-2xl tracking-tight text-brand-pink cursor-pointer group z-50">
                    <Leaf className="text-brand-green group-hover:text-brand-magenta transition-colors duration-300" strokeWidth={2.5} size={24} />
                    <div className="flex flex-col">
                        <span className="font-bold leading-none tracking-tighter">RAFA <span className="text-brand-magenta font-light">GARDEN</span></span>
                        <span className="text-[0.6rem] tracking-[0.3em] text-brand-green uppercase font-bold mt-1">Premium Essence</span>
                    </div>
                </div>

                {/* Desktop Navigation Links */}
                <div className="hidden lg:flex items-center gap-8">
                    {NAV_LINKS.map((link) => (
                        <div
                            key={link}
                            className="relative cursor-pointer"
                            onMouseEnter={() => setHoveredLink(link)}
                            onMouseLeave={() => setHoveredLink(null)}
                        >
                            <span className={`text-xs font-bold tracking-widest uppercase transition-colors duration-300 ${hoveredLink === link ? "text-brand-pink" : "text-black/70"
                                }`}>
                                {link}
                            </span>

                            {hoveredLink === link && (
                                <motion.div
                                    layoutId="nav-underline"
                                    className="absolute -bottom-2 left-0 right-0 h-[2px] bg-brand-pink"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Actions / Cart / Theme & Mobile Toggle */}
                <div className="flex items-center gap-3 md:gap-4 z-50">
                    {mounted && (
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="p-2 rounded-full border border-brand-pink/20 bg-white/50 text-brand-pink hover:bg-brand-pink hover:text-white transition-all shadow-sm backdrop-blur-md"
                            aria-label="Toggle Theme"
                        >
                            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                    )}
                    <button
                        onClick={openCart}
                        className="relative flex items-center gap-2 px-3 md:px-6 py-2 rounded-full border border-brand-pink/20 bg-brand-pink text-white hover:bg-brand-magenta transition-all shadow-sm group backdrop-blur-md"
                    >
                        <ShoppingCart size={18} className="group-hover:scale-110 transition-transform" />
                        <span className="hidden md:inline font-bold tracking-widest text-[0.6rem] translate-y-[1px] uppercase">Cart</span>
                        {itemCount > 0 && (
                            <span className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-brand-magenta text-white font-bold rounded-full text-[10px] shadow-lg border border-white/20">
                                {itemCount}
                            </span>
                        )}
                    </button>

                    {/* Mobile Hamburger Toggle */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden p-2 rounded-full border border-[#d4af37]/40 bg-[#123e25]/50 text-[#fffdd0] hover:bg-[#d4af37] hover:text-[#0b2b1a] transition-all shadow-lg backdrop-blur-md"
                    >
                        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "100vh" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="lg:hidden fixed top-0 left-0 w-full bg-[#0b2b1a] pt-24 px-6 flex flex-col items-center gap-8 shadow-2xl overflow-hidden backdrop-blur-xl border-b border-[#d4af37]/30"
                    >
                        {NAV_LINKS.map((link, index) => (
                            <motion.div
                                key={link}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index, duration: 0.4 }}
                                className="w-full text-center group cursor-pointer"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <span className="text-2xl font-serif tracking-widest text-[#fffdd0] group-hover:text-[#d4af37] transition-colors duration-300">
                                    {link}
                                </span>
                                <div className="h-px bg-white/5 w-1/2 mx-auto mt-4 group-hover:bg-[#d4af37]/30 group-hover:w-full transition-all duration-500" />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
