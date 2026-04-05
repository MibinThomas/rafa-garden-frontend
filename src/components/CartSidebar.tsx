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
                        className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-[#f1f1f2] border-l border-brand-pink/20 z-50 p-6 flex flex-col items-start justify-start shadow-[-20px_0_40px_rgba(0,0,0,0.05)] transition-colors duration-300"
                    >
                        <div className="flex items-center justify-between w-full mb-8 pb-4 border-b border-black/5">
                            <h2 className="text-2xl font-serif text-brand-magenta flex items-center gap-3 text-left">
                                <ShoppingBag className="text-brand-pink" size={24} /> Your Basket
                            </h2>
                            <button
                                onClick={closeCart}
                                className="p-2 rounded-full border border-black/5 text-brand-magenta hover:bg-brand-pink hover:text-white transition-all shadow-sm"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 w-full overflow-y-auto space-y-4 pr-2">
                            {items.length === 0 ? (
                                <p className="text-brand-grey text-left mt-6 font-medium">Your botanical harvest basket is empty.</p>
                            ) : (
                                items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex justify-between items-center p-4 bg-white border border-brand-pink/5 rounded-2xl group transition-all hover:border-brand-pink/20 hover:shadow-sm"
                                    >
                                        <div className="text-left flex flex-col gap-1">
                                            <h3 className="font-sans font-bold text-lg text-brand-magenta leading-tight group-hover:text-brand-pink transition-colors uppercase tracking-tight">{item.name}</h3>
                                            <p className="text-brand-grey font-bold text-sm">
                                                <span className="tracking-widest font-sans">${item.price.toFixed(2)}</span> <span className="text-xs lowercase mx-1">x</span> {item.quantity}
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
                            <div className="w-full pt-6 border-t border-black/5 mt-6 text-left">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-brand-grey uppercase tracking-widest text-xs font-black">Total</span>
                                    <span className="text-3xl font-bold text-brand-magenta select-all"><span className="text-brand-pink text-xl mr-1 font-serif">$</span>{cartTotal.toFixed(2)}</span>
                                </div>
                                <button className="w-full py-4 bg-brand-pink text-white font-black tracking-widest rounded-full hover:bg-brand-magenta active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2 uppercase text-sm">
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
