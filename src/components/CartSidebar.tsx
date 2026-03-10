"use client";

import { useCart } from "@/lib/CartContext";
import { X, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function CartSidebar() {
    const { isCartOpen, closeCart, items, removeFromCart, cartTotal } = useCart();

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCart}
                        className="fixed inset-0 bg-black z-40 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white dark:bg-[#0a0a0a] border-l border-[#d4af37]/30 z-50 p-6 flex flex-col items-start justify-start shadow-[-20px_0_40px_rgba(0,0,0,0.15)] dark:shadow-[-20px_0_40px_rgba(212,175,55,0.05)] transition-colors duration-300"
                    >
                        <div className="flex items-center justify-between w-full mb-8 pb-4 border-b border-black/10 dark:border-white/10">
                            <h2 className="text-2xl font-serif text-[#0b2b1a] dark:text-[#fffdd0] flex items-center gap-3 text-left">
                                <ShoppingBag className="text-[#d4af37]" size={24} /> Your Basket
                            </h2>
                            <button
                                onClick={closeCart}
                                className="p-2 rounded-full border border-black/10 dark:border-white/10 text-[#0b2b1a] dark:text-white hover:bg-[#d4af37] hover:border-[#d4af37] hover:text-[#0b2b1a] transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 w-full overflow-y-auto space-y-4 pr-2">
                            {items.length === 0 ? (
                                <p className="text-gray-500 dark:text-gray-400 text-left mt-6 font-light">Your botanical harvest basket is empty.</p>
                            ) : (
                                items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex justify-between items-center p-4 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl group transition-colors hover:border-[#d4af37]/50"
                                    >
                                        <div className="text-left flex flex-col gap-1">
                                            <h3 className="font-serif font-bold text-lg text-[#0b2b1a] dark:text-white leading-tight group-hover:text-[#d4af37] transition-colors">{item.name}</h3>
                                            <p className="text-[#123e25] dark:text-[#d4af37] font-light text-sm">
                                                <span className="tracking-widest font-sans font-medium">${item.price.toFixed(2)}</span> <span className="text-xs text-gray-500 lowercase mx-1">x</span> {item.quantity}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-gray-400 hover:text-red-500 p-2 bg-transparent hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        {items.length > 0 && (
                            <div className="w-full pt-6 border-t border-black/10 dark:border-white/10 mt-6 text-left">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-gray-500 dark:text-gray-400 uppercase tracking-widest text-sm font-bold">Total</span>
                                    <span className="text-3xl font-light text-[#0b2b1a] dark:text-white select-all"><span className="text-[#d4af37] text-xl mr-1 font-serif">$</span>{cartTotal.toFixed(2)}</span>
                                </div>
                                <button className="w-full py-4 bg-[#123e25] text-[#d4af37] font-bold tracking-[0.2em] rounded-full hover:bg-[#d4af37] hover:text-[#0b2b1a] active:scale-[0.98] transition-all shadow-[0_4px_15px_rgba(0,0,0,0.1)] border border-[#d4af37]/20 flex items-center justify-center gap-2">
                                    <ShoppingBag size={18} />
                                    CHECKOUT
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
