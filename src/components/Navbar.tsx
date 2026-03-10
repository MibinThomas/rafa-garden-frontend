"use client";

import { useCart } from "@/lib/CartContext";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";

export function Navbar() {
    const { openCart, items } = useCart();
    const [scrolled, setScrolled] = useState(false);

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
            className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? "bg-obsidian/80 backdrop-blur-md py-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)]" : "bg-transparent py-6"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
                <div className="font-black text-2xl tracking-tighter text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] cursor-pointer">
                    DRGN<span className="text-magenta">CRUSH</span>
                </div>

                <button
                    onClick={openCart}
                    className="relative flex items-center gap-2 px-6 py-2 rounded-full border border-white/20 bg-white/5 hover:bg-magenta hover:border-magenta hover:shadow-[0_0_20px_#FF007F] transition-all text-white backdrop-blur-md"
                >
                    <ShoppingCart size={20} />
                    <span className="font-bold tracking-widest text-sm translate-y-[1px]">CART</span>
                    {itemCount > 0 && (
                        <span className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center bg-white text-magenta font-bold rounded-full text-xs shadow-lg animate-bounce">
                            {itemCount}
                        </span>
                    )}
                </button>
            </div>
        </nav>
    );
}
