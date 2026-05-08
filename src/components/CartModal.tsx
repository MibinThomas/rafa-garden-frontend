"use client";

import { useHeaderColor } from "@/lib/HeaderColorContext";
import { useCart } from "@/lib/CartContext";
import { useWishlist } from "@/lib/WishlistContext";
import { X, ShoppingBasket, Heart, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export function CartModal() {
    const { isCartOpen, closeCart, items, removeFromCart, cartTotal } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { headerColor } = useHeaderColor();

    const handleMoveToWishlist = (productId: string) => {
        if (!isInWishlist(productId)) {
            toggleWishlist(productId);
        }
        removeFromCart(productId);
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <div className="fixed inset-0 z-[100] flex items-stretch justify-end">
                    {/* Dark Blurred Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={closeCart}
                        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                    />

                    {/* Right sliding Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-[500px] h-full bg-[#f1f1f2] border-l border-[#cccccc] flex flex-col shadow-2xl z-[101] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between w-full p-8 pb-4 shrink-0">
                            <h2 
                                className="text-[80px] sm:text-[100px] leading-[0.8] tracking-tight text-[#1b1c1c] select-none" 
                                style={{ fontFamily: "'DharmaGothic', sans-serif", fontWeight: 700 }}
                            >
                                Your<br />Basket.
                            </h2>
                            <button
                                onClick={closeCart}
                                className="p-3 mt-2 rounded-full hover:bg-black/5 text-[#a3a3a3] hover:text-[#1b1c1c] transition-all"
                            >
                                <X size={24} strokeWidth={1.5} />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 w-full overflow-y-auto px-8 py-2">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                                    <ShoppingBasket size={48} className="text-[#cccccc] opacity-50" />
                                    <p className="text-[14px] text-[#888888] font-medium max-w-[200px]">
                                        Your botanical harvest basket is currently empty.
                                    </p>
                                    <button 
                                      onClick={closeCart}
                                      className="text-[14px] font-medium text-[#c81c6a] hover:underline"
                                    >
                                      Continue Shopping
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-2 pb-8">
                                    <span className="text-[13px] font-medium text-[#888888] mb-4 block">Items</span>
                                    <AnimatePresence>
                                        {items.map((item) => (
                                            <motion.div
                                                key={item.id}
                                                layout
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                className="relative flex justify-between items-center py-4 border-b border-[#cccccc] group"
                                            >
                                                <div className="text-left flex flex-col gap-1 pr-4">
                                                    <h3 className="text-[16px] text-[#555555] font-medium leading-tight tracking-wide">
                                                      {item.name}
                                                    </h3>
                                                    <p className="text-[#888888] text-[13px]">
                                                        ₹{item.price.toFixed(2)} <span className="mx-1 text-[#cccccc]">x</span> {item.quantity}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => handleMoveToWishlist(item.id)}
                                                        className="p-2 text-[#a3a3a3] hover:text-[#c81c6a] transition-colors rounded-full hover:bg-black/5"
                                                        title="Move to Wishlist"
                                                    >
                                                        <Heart size={18} strokeWidth={1.5} />
                                                    </button>
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="p-2 text-[#a3a3a3] hover:text-red-500 transition-colors rounded-full hover:bg-black/5"
                                                        title="Remove Item"
                                                    >
                                                        <X size={18} strokeWidth={1.5} />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>

                        {/* Footer Checkout */}
                        {items.length > 0 && (
                            <div className="w-full p-8 bg-[#f1f1f2] border-t border-[#cccccc] shrink-0">
                                <div className="flex justify-between items-end mb-6">
                                    <span className="text-[14px] text-[#888888] font-medium">Subtotal</span>
                                    <span className="text-[32px] font-light text-[#1b1c1c] tracking-tight leading-none">
                                      ₹{cartTotal.toFixed(2)}
                                    </span>
                                </div>
                                <Link 
                                  href="/checkout"
                                  onClick={closeCart}
                                  className="w-full h-14 rounded-full bg-[#c81c6a] text-white font-medium text-[16px] hover:bg-[#a8195a] transition-colors flex items-center justify-between px-8 shadow-sm group"
                                >
                                    <span className="mx-auto">Proceed to Checkout</span>
                                    <ArrowRight size={20} strokeWidth={1.5} className="shrink-0 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
