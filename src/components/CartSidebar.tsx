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
                        animate={{ opacity: 0.6 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCart}
                        className="fixed inset-0 bg-black z-40 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-[#0a0a0a] border-l border-magenta/20 z-50 p-6 flex flex-col items-start justify-start shadow-[-20px_0_40px_rgba(255,0,127,0.1)]"
                    >
                        <div className="flex items-center justify-between w-full mb-8">
                            <h2 className="text-2xl font-black text-white flex items-center gap-2">
                                <ShoppingBag className="text-magenta" /> CART
                            </h2>
                            <button
                                onClick={closeCart}
                                className="p-2 rounded-full bg-white/5 hover:bg-magenta hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 w-full overflow-y-auto space-y-4 pr-2">
                            {items.length === 0 ? (
                                <p className="text-gray-400 text-center mt-10">Your zero-G cart is empty.</p>
                            ) : (
                                items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex justify-between items-center p-4 bg-white/5 border border-white/10 rounded-2xl"
                                    >
                                        <div>
                                            <h3 className="font-bold text-lg text-white">{item.name}</h3>
                                            <p className="text-magenta font-mono">${item.price.toFixed(2)} x {item.quantity}</p>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-gray-500 hover:text-red-500"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        {items.length > 0 && (
                            <div className="w-full pt-6 border-t border-white/10 mt-6">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-gray-400">Total</span>
                                    <span className="text-2xl font-black text-white">${cartTotal.toFixed(2)}</span>
                                </div>
                                <button className="w-full py-4 bg-magenta text-white font-bold rounded-full hover:bg-magenta-400 hover:scale-[1.02] transition-transform">
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
