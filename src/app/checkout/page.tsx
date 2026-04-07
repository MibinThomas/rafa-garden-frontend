"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { useHeaderColor } from "@/lib/HeaderColorContext";

export default function CheckoutPage() {
  const { items, cartTotal } = useCart();
  const { setIsImmersive, setHeaderColor, headerColor } = useHeaderColor();
  const activeColor = headerColor;

  useEffect(() => {
    setIsImmersive(false);
  }, [setIsImmersive]);

  const shippingCost = 15.00;
  const finalTotal = cartTotal + (cartTotal > 0 ? shippingCost : 0);

  return (
    <div className="min-h-screen bg-[#f1f1f2] font-sans pb-24 pt-24 md:pt-32 px-6">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
            <div>
              <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-colors mb-4" style={{ color: activeColor }}>
                  <ArrowLeft size={16} /> Back to Shop
              </Link>
              <h1 className="text-4xl md:text-5xl font-black font-playfair text-[#0b2b1a]">
                  Checkout
              </h1>
            </div>
            {/* Step Indicators (Mock) */}
            <div className="hidden md:flex items-center gap-4 text-xs font-bold uppercase tracking-widest">
               <span className="flex items-center gap-1.5 text-[#0b2b1a]"><CheckCircle2 size={16} /> Details</span>
               <div className="w-10 h-[2px] bg-black/10" />
               <span className="text-gray-400">Payment</span>
            </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Left Column: Forms */}
          <div className="w-full lg:w-[60%] space-y-8">
            
            {/* Contact Info */}
            <section className="bg-white/80 backdrop-blur-md rounded-[2rem] p-8 border border-white shadow-sm">
                <h2 className="text-xl font-bold font-playfair text-[#0b2b1a] mb-6">Contact Information</h2>
                <div className="space-y-4">
                    <input type="email" placeholder="Email Address" className="w-full px-5 py-4 rounded-xl bg-black/5 border border-transparent focus:border-brand-pink/50 focus:bg-white outline-none transition-all placeholder:text-gray-400" />
                    <div className="flex items-center gap-3">
                        <input type="checkbox" id="newsletter" className="w-4 h-4 accent-brand-pink" />
                        <label htmlFor="newsletter" className="text-sm text-gray-500">Email me with news and offers</label>
                    </div>
                </div>
            </section>

            {/* Shipping Address */}
            <section className="bg-white/80 backdrop-blur-md rounded-[2rem] p-8 border border-white shadow-sm">
                <h2 className="text-xl font-bold font-playfair text-[#0b2b1a] mb-6">Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="First Name" className="w-full px-5 py-4 rounded-xl bg-black/5 outline-none focus:bg-white focus:border-brand-pink/50 border border-transparent transition-all" />
                    <input type="text" placeholder="Last Name" className="w-full px-5 py-4 rounded-xl bg-black/5 outline-none focus:bg-white focus:border-brand-pink/50 border border-transparent transition-all" />
                    <input type="text" placeholder="Address" className="w-full px-5 py-4 rounded-xl bg-black/5 outline-none focus:bg-white focus:border-brand-pink/50 border border-transparent transition-all md:col-span-2" />
                    <input type="text" placeholder="Apartment, suite, etc. (optional)" className="w-full px-5 py-4 rounded-xl bg-black/5 outline-none focus:bg-white focus:border-brand-pink/50 border border-transparent transition-all md:col-span-2" />
                    <input type="text" placeholder="City" className="w-full px-5 py-4 rounded-xl bg-black/5 outline-none focus:bg-white focus:border-brand-pink/50 border border-transparent transition-all" />
                    <input type="text" placeholder="Postal Code" className="w-full px-5 py-4 rounded-xl bg-black/5 outline-none focus:bg-white focus:border-brand-pink/50 border border-transparent transition-all" />
                </div>
            </section>

          </div>

          {/* Right Column: Order Summary */}
          <div className="w-full lg:w-[40%] lg:sticky lg:top-32">
            <div className="bg-[#0b2b1a] rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
                {/* Decorative background circle */}
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-brand-pink/20 blur-3xl rounded-full" />
                
                <h2 className="text-xl font-playfair font-black mb-8 relative z-10">Order Summary</h2>

                <div className="flex flex-col gap-6 mb-8 relative z-10 max-h-[40vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20">
                    {items.length === 0 ? (
                        <p className="text-white/50 text-sm">Your cart is perfectly empty.</p>
                    ) : (
                        items.map(item => (
                            <div key={item.id} className="flex items-center gap-4 group">
                                {/* We don't have item image in cart context yet, so we use a placeholder styling */}
                                <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
                                    <span className="text-xs font-bold opacity-50">{item.quantity}x</span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm tracking-tight leading-tight line-clamp-1">{item.name}</h4>
                                    <p className="font-sans text-sm mt-1" style={{ color: activeColor }}>₹{item.price.toFixed(2)}</p>
                                </div>
                                <span className="font-bold text-sm">₹{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))
                    )}
                </div>

                <div className="space-y-4 border-t border-white/10 pt-6 relative z-10 font-medium text-sm">
                    <div className="flex justify-between text-white/70">
                        <span>Subtotal</span>
                        <span>₹{cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-white/70">
                        <span>Shipping</span>
                        <span>{cartTotal > 0 ? `₹${shippingCost.toFixed(2)}` : 'Calculated next step'}</span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-white/10 mt-4">
                        <span className="text-lg font-bold">Total</span>
                        <span className="text-3xl font-black font-playfair"><span className="mr-1 text-xl" style={{ color: activeColor }}>₹</span>{cartTotal > 0 ? finalTotal.toFixed(2) : "0.00"}</span>
                    </div>
                </div>

                <button 
                  disabled={items.length === 0}
                  className="w-full py-4 mt-8 text-white font-black tracking-widest uppercase text-sm rounded-xl transition-all shadow-lg hover:bg-white hover:text-[#0b2b1a] disabled:opacity-50 active:scale-95"
                  style={{ backgroundColor: activeColor }}
                >
                    Proceed to Payment
                </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
