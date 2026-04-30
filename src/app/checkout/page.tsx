"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { useHeaderColor } from "@/lib/HeaderColorContext";

export default function CheckoutPage() {
  const { items, cartTotal, removeFromCart } = useCart();
  const { setIsImmersive, setHeaderColor, headerColor } = useHeaderColor();
  const router = useRouter();
  const activeColor = headerColor;

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    postalCode: "",
    phone: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsImmersive(false);
  }, [setIsImmersive]);

  const shippingCost = 15.00;
  const finalTotal = cartTotal + (cartTotal > 0 ? shippingCost : 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    if (!formData.email || !formData.firstName || !formData.lastName || !formData.address || !formData.city || !formData.phone) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      // 1. Create order in DB
      const orderData = {
        customer: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          address: `${formData.address}${formData.apartment ? ', ' + formData.apartment : ''}, ${formData.city}, ${formData.postalCode}`
        },
        items: items.map(item => ({
          productId: item.id,
          name: item.name,
          image: item.image,
          quantity: item.quantity,
          variant: {
            price: item.price,
            size: "Standard", 
            unit: "Unit"
          }
        })),
        totalAmount: finalTotal,
        paymentMethod: "WhatsApp Order",
        paymentStatus: "unpaid"
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });

      const result = await res.json();
      
      if (res.ok) {
        // 2. Format WhatsApp Message
        const itemsList = items.map(item => 
          `- ${item.name} x ${item.quantity}: ₹${(item.price * item.quantity).toFixed(2)}`
        ).join('\n');

        const message = `🌿 *New Order from Rafah Garden* 🌿\n\n` +
          `*Manifest No:* ${result.orderId}\n\n` +
          `*Customer Details:*\n` +
          `- Name: ${formData.firstName} ${formData.lastName}\n` +
          `- Phone: ${formData.phone}\n` +
          `- Address: ${orderData.customer.address}\n\n` +
          `*Asset Manifest:*\n${itemsList}\n\n` +
          `*Shipping:* ₹${shippingCost.toFixed(2)}\n` +
          `*Total Settlement:* ₹${finalTotal.toFixed(2)}\n\n` +
          `Please confirm my order. Thank you!`;

        const encodedMessage = encodeURIComponent(message);
        
        // 3. Clear cart (optional, maybe wait for confirmation)
        // items.forEach(item => removeFromCart(item.id));

        // 4. Redirect to WhatsApp
        window.location.href = `https://wa.me/918550088485?text=${encodedMessage}`; 
      } else {
        throw new Error(result.error || "Failed to place order");
      }
    } catch (error: any) {
      console.error("Order error:", error);
      alert(error.message || "An error occurred while placing your order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f1f2] font-sans pb-24 pt-24 md:pt-32 px-6">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
            <div>
              <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-colors mb-4" style={{ color: activeColor }}>
                  <ArrowLeft size={16} /> Back to Shop
              </Link>
              <h1 className="text-4xl md:text-5xl font-black font-playfair text-[#5d5f61]">
                  Checkout
              </h1>
            </div>
            <div className="hidden md:flex items-center gap-4 text-xs font-bold uppercase tracking-widest">
               <span className="flex items-center gap-1.5 text-[#5d5f61]"><CheckCircle2 size={16} /> Details</span>
               <div className="w-10 h-[2px] bg-black/10" />
               <span className="text-gray-400">WhatsApp Confirmation</span>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Left Column: Forms */}
          <div className="w-full lg:w-[60%] space-y-8">
            
            {/* Contact Info */}
            <section className="bg-white/80 backdrop-blur-md rounded-[2rem] p-8 border border-white shadow-sm">
                <h2 className="text-xl font-bold font-playfair text-[#5d5f61] mb-6">Contact Information</h2>
                <div className="space-y-4">
                    <input 
                      id="email"
                      type="email" 
                      placeholder="Email Address" 
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 rounded-xl bg-black/5 border border-transparent focus:border-brand-pink/50 focus:bg-white outline-none transition-all placeholder:text-gray-400" 
                    />
                    <input 
                      id="phone"
                      type="tel" 
                      placeholder="Phone Number (WhatsApp preferred)" 
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 rounded-xl bg-black/5 border border-transparent focus:border-brand-pink/50 focus:bg-white outline-none transition-all placeholder:text-gray-400" 
                    />
                </div>
            </section>

            {/* Shipping Address */}
            <section className="bg-white/80 backdrop-blur-md rounded-[2rem] p-8 border border-white shadow-sm">
                <h2 className="text-xl font-bold font-playfair text-[#5d5f61] mb-6">Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input id="firstName" value={formData.firstName} onChange={handleInputChange} required type="text" placeholder="First Name" className="w-full px-5 py-4 rounded-xl bg-black/5 outline-none focus:bg-white focus:border-brand-pink/50 border border-transparent transition-all" />
                    <input id="lastName" value={formData.lastName} onChange={handleInputChange} required type="text" placeholder="Last Name" className="w-full px-5 py-4 rounded-xl bg-black/5 outline-none focus:bg-white focus:border-brand-pink/50 border border-transparent transition-all" />
                    <input id="address" value={formData.address} onChange={handleInputChange} required type="text" placeholder="Address" className="w-full px-5 py-4 rounded-xl bg-black/5 outline-none focus:bg-white focus:border-brand-pink/50 border border-transparent transition-all md:col-span-2" />
                    <input id="apartment" value={formData.apartment} onChange={handleInputChange} type="text" placeholder="Apartment, suite, etc. (optional)" className="w-full px-5 py-4 rounded-xl bg-black/5 outline-none focus:bg-white focus:border-brand-pink/50 border border-transparent transition-all md:col-span-2" />
                    <input id="city" value={formData.city} onChange={handleInputChange} required type="text" placeholder="City" className="w-full px-5 py-4 rounded-xl bg-black/5 outline-none focus:bg-white focus:border-brand-pink/50 border border-transparent transition-all" />
                    <input id="postalCode" value={formData.postalCode} onChange={handleInputChange} required type="text" placeholder="Postal Code" className="w-full px-5 py-4 rounded-xl bg-black/5 outline-none focus:bg-white focus:border-brand-pink/50 border border-transparent transition-all" />
                </div>
            </section>

          </div>

          {/* Right Column: Order Summary */}
          <div className="w-full lg:w-[40%] lg:sticky lg:top-32">
            <div className="bg-[#5d5f61] rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-brand-pink/20 blur-3xl rounded-full" />
                
                <h2 className="text-xl font-playfair font-black mb-8 relative z-10">Order Summary</h2>

                <div className="flex flex-col gap-6 mb-8 relative z-10 max-h-[40vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20">
                    {items.length === 0 ? (
                        <p className="text-white/50 text-sm">Your cart is perfectly empty.</p>
                    ) : (
                        items.map(item => (
                            <div key={item.id} className="flex items-center gap-4 group">
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
                        <span>{cartTotal > 0 ? `₹${shippingCost.toFixed(2)}` : '₹0.00'}</span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-white/10 mt-4">
                        <span className="text-lg font-bold">Total</span>
                        <span className="text-3xl font-black font-playfair"><span className="mr-1 text-xl" style={{ color: activeColor }}>₹</span>{cartTotal > 0 ? finalTotal.toFixed(2) : "0.00"}</span>
                    </div>
                </div>

                <button 
                  type="submit"
                  disabled={items.length === 0 || loading}
                  className="w-full py-5 mt-8 text-white font-black tracking-[0.2em] uppercase text-[10px] rounded-xl transition-all shadow-lg hover:bg-white hover:text-[#5d5f61] disabled:opacity-50 active:scale-95 flex items-center justify-center gap-3"
                  style={{ backgroundColor: activeColor }}
                >
                    {loading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      "Place Order via WhatsApp"
                    )}
                </button>
                <p className="text-[9px] text-white/30 text-center mt-6 font-bold uppercase tracking-widest">No payment required. Confirm your order via WhatsApp.</p>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
