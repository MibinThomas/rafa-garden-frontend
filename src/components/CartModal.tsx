"use client";

import { useCart } from "@/lib/CartContext";
import { useHeaderColor } from "@/lib/HeaderColorContext";
import { X, ShoppingBasket } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function CartModal() {
    const { isCartOpen, closeCart, items, removeFromCart, cartTotal } = useCart();
    const { headerColor } = useHeaderColor();

    // Determine a safe accent color. Fallback to brand pink if generic or undefined.
    // We explicitly avoid dark green (#0b2b1a) to ensure visibility in the white modal.
    const activeColor = (headerColor && headerColor !== "transparent" && headerColor !== "#0b2b1a" && headerColor !== "#f1f1f1") 
      ? headerColor 
      : "#c81c6a"; // Base brand pink

    return (
        <AnimatePresence>
            {isCartOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Dark Blurred Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={closeCart}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    />

                    {/* Centered Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-[500px] max-h-[85vh] bg-white/95 backdrop-blur-xl border border-white/40 flex flex-col items-center justify-start shadow-[0_30px_60px_rgba(0,0,0,0.2)] rounded-[2rem] p-6 sm:p-8 overflow-hidden z-[101]"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between w-full mb-6 pb-4 border-b border-black/10">
                            <h2 className="text-2xl font-serif flex items-center gap-3" style={{ color: activeColor }}>
                                <span className="relative p-2 rounded-full overflow-hidden flex items-center justify-center">
                                    <div className="absolute inset-0 opacity-15" style={{ backgroundColor: activeColor }} />
                                    <ShoppingBasket style={{ color: activeColor }} className="relative z-10" size={24} />
                                </span>
                                Your Basket
                            </h2>
                            <button
                                onClick={closeCart}
                                className="p-2 rounded-full border border-black/5 text-gray-400 hover:bg-black/5 hover:text-black transition-all shadow-sm"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 w-full overflow-y-auto space-y-4 pr-1 snap-y scrollbar-thin scrollbar-track-transparent" style={{ scrollbarColor: `${activeColor} transparent`}}>
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 text-gray-400 py-12">
                                    <ShoppingBasket size={48} className="opacity-20" style={{ color: activeColor }} />
                                    <p className="font-medium text-lg text-gray-500">Your botanical harvest basket is empty.</p>
                                    <button 
                                      onClick={closeCart}
                                      style={{ color: activeColor }}
                                      className="text-sm uppercase tracking-widest font-bold hover:underline opacity-90"
                                    >
                                      Continue Shopping
                                    </button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="relative overflow-hidden flex justify-between items-center p-4 bg-white/60 backdrop-blur-md border rounded-2xl group transition-all hover:bg-white hover:shadow-md"
                                        style={{ borderColor: "#00000010" }}
                                    >
                                        <div className="text-left flex flex-col gap-1 relative z-10 pointer-events-none">
                                            <h3 className="font-sans font-bold text-lg leading-tight transition-colors uppercase tracking-tight" style={{ color: activeColor }}>
                                              {item.name}
                                            </h3>
                                            <p className="text-gray-500 font-bold text-sm">
                                                <span className="tracking-widest font-sans">₹{item.price.toFixed(2)}</span> <span className="text-xs lowercase mx-1 text-gray-400">x</span> <span className="text-black">{item.quantity}</span>
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="relative z-10 text-gray-400 p-2.5 bg-transparent rounded-full transition-all active:scale-95 group/btn"
                                        >
                                            <div className="absolute inset-0 rounded-full opacity-0 group-hover/btn:opacity-10 transition-opacity" style={{ backgroundColor: activeColor }} />
                                            <X size={18} className="relative z-10 transition-colors" />
                                        </button>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer Checkout */}
                        {items.length > 0 && (
                            <div className="w-full pt-6 border-t border-black/10 mt-6 text-left">
                                <div className="flex justify-between items-end mb-6 px-2">
                                    <span className="text-gray-500 uppercase tracking-widest text-sm font-black mb-1">Total</span>
                                    <span className="text-4xl font-black select-all tabular-nums" style={{ color: activeColor }}>
                                      <span className="text-2xl mr-1 font-serif" style={{ color: activeColor, opacity: 0.8 }}>₹</span>{cartTotal.toFixed(2)}
                                    </span>
                                </div>
                                <button 
                                  className="relative overflow-hidden w-full py-4 text-white font-black tracking-widest rounded-full active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-3 uppercase text-sm group"
                                  style={{ backgroundColor: activeColor }}
                                >
                                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    Checkout Now
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
