"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { useHeaderColor } from "@/lib/HeaderColorContext";

export default function CheckoutPage() {
  const { items, cartTotal, removeFromCart } = useCart();
  const { setIsImmersive, setHeaderColor } = useHeaderColor();
  const router = useRouter();

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
    setHeaderColor("#1b1c1c");
  }, [setIsImmersive, setHeaderColor]);

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
    <div className="min-h-screen bg-[#f1f1f2] text-[#1b1c1c] selection:bg-[#c81c6a] selection:text-white overflow-x-hidden" style={{ fontFamily: "inherit" }}>
      

      <main className="max-w-[1440px] mx-auto px-6 md:px-12 pt-32 md:pt-40 pb-20 md:pb-32 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Left Column: Typography */}
          <div className="flex flex-col justify-start">
            <span className="text-[14px] md:text-[16px] text-[#a3a3a3] font-medium mb-4">
              Finalize Order
            </span>
            <h1 
              className="text-[140px] md:text-[200px] leading-[0.8] tracking-tight text-[#b5b5b5] select-none mb-8" 
              style={{ fontFamily: "'DharmaGothic', sans-serif", fontWeight: 700 }}
            >
              Check<br />out.
            </h1>
            <p className="text-[14px] md:text-[15px] text-[#a3a3a3] max-w-[380px] font-medium leading-relaxed mt-4">
              Provide your details to establish the settlement manifest. Your botanical assets will be reserved upon WhatsApp confirmation.
            </p>


          </div>

          {/* Right Column: Form & Summary */}
          <div className="flex flex-col justify-start pt-8 lg:pt-0 lg:pl-10 space-y-20">
            
            <form onSubmit={handleSubmit} className="space-y-16">
              
              {/* Contact Information */}
              <div>
                <h2 className="text-[32px] md:text-[40px] font-light text-[#555555] mb-8">Contact.</h2>
                <div className="space-y-8">
                  <div className="relative group">
                    <label className="text-[13px] font-medium text-[#888888] mb-1 block">Email Address</label>
                    <input 
                      id="email"
                      required
                      type="email" 
                      placeholder="your@email.com" 
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-transparent border-b border-[#cccccc] py-2 focus:border-[#a3a3a3] focus:outline-none transition-all text-[14px] text-[#555555] placeholder-[#c0c0c0]"
                    />
                  </div>
                  <div className="relative group">
                    <label className="text-[13px] font-medium text-[#888888] mb-1 block">Phone Number (WhatsApp)</label>
                    <input 
                      id="phone"
                      required
                      type="tel" 
                      placeholder="+91..." 
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-transparent border-b border-[#cccccc] py-2 focus:border-[#a3a3a3] focus:outline-none transition-all text-[14px] text-[#555555] placeholder-[#c0c0c0]"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h2 className="text-[32px] md:text-[40px] font-light text-[#555555] mb-8">Shipping.</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
                  <div className="relative group">
                    <label className="text-[13px] font-medium text-[#888888] mb-1 block">First Name</label>
                    <input id="firstName" required type="text" placeholder="First Name..." value={formData.firstName} onChange={handleInputChange} className="w-full bg-transparent border-b border-[#cccccc] py-2 focus:border-[#a3a3a3] focus:outline-none transition-all text-[14px] text-[#555555] placeholder-[#c0c0c0]" />
                  </div>
                  <div className="relative group">
                    <label className="text-[13px] font-medium text-[#888888] mb-1 block">Last Name</label>
                    <input id="lastName" required type="text" placeholder="Last Name..." value={formData.lastName} onChange={handleInputChange} className="w-full bg-transparent border-b border-[#cccccc] py-2 focus:border-[#a3a3a3] focus:outline-none transition-all text-[14px] text-[#555555] placeholder-[#c0c0c0]" />
                  </div>
                  <div className="relative group sm:col-span-2">
                    <label className="text-[13px] font-medium text-[#888888] mb-1 block">Address</label>
                    <input id="address" required type="text" placeholder="Street Address..." value={formData.address} onChange={handleInputChange} className="w-full bg-transparent border-b border-[#cccccc] py-2 focus:border-[#a3a3a3] focus:outline-none transition-all text-[14px] text-[#555555] placeholder-[#c0c0c0]" />
                  </div>
                  <div className="relative group sm:col-span-2">
                    <label className="text-[13px] font-medium text-[#888888] mb-1 block">Apartment, suite, etc.</label>
                    <input id="apartment" type="text" placeholder="Apartment (Optional)..." value={formData.apartment} onChange={handleInputChange} className="w-full bg-transparent border-b border-[#cccccc] py-2 focus:border-[#a3a3a3] focus:outline-none transition-all text-[14px] text-[#555555] placeholder-[#c0c0c0]" />
                  </div>
                  <div className="relative group">
                    <label className="text-[13px] font-medium text-[#888888] mb-1 block">City</label>
                    <input id="city" required type="text" placeholder="City..." value={formData.city} onChange={handleInputChange} className="w-full bg-transparent border-b border-[#cccccc] py-2 focus:border-[#a3a3a3] focus:outline-none transition-all text-[14px] text-[#555555] placeholder-[#c0c0c0]" />
                  </div>
                  <div className="relative group">
                    <label className="text-[13px] font-medium text-[#888888] mb-1 block">Postal Code</label>
                    <input id="postalCode" required type="text" placeholder="Postal Code..." value={formData.postalCode} onChange={handleInputChange} className="w-full bg-transparent border-b border-[#cccccc] py-2 focus:border-[#a3a3a3] focus:outline-none transition-all text-[14px] text-[#555555] placeholder-[#c0c0c0]" />
                  </div>
                </div>
              </div>

              {/* Order Summary integrated */}
              <div>
                <h2 className="text-[32px] md:text-[40px] font-light text-[#555555] mb-8">Summary.</h2>
                <div className="space-y-4 mb-10">
                  {items.length === 0 ? (
                    <p className="text-[14px] text-[#a3a3a3]">Your basket is currently empty.</p>
                  ) : (
                    <div className="divide-y divide-[#cccccc]/50">
                      {items.map(item => (
                        <div key={item.id} className="py-4 flex justify-between items-center text-[14px]">
                          <div className="flex flex-col">
                            <span className="text-[#555555] font-medium">{item.name}</span>
                            <span className="text-[#a3a3a3] text-[12px]">{item.quantity} x ₹{item.price.toFixed(2)}</span>
                          </div>
                          <span className="text-[#555555] font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-4 pt-6 border-t border-[#cccccc]">
                  <div className="flex justify-between text-[14px] text-[#888888]">
                    <span>Subtotal</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[14px] text-[#888888]">
                    <span>Shipping</span>
                    <span>₹{shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-end pt-6">
                    <span className="text-[18px] font-medium text-[#555555]">Total</span>
                    <span className="text-[32px] font-light text-[#1b1c1c] tracking-tight">₹{finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-10">
                <button 
                  type="submit"
                  disabled={items.length === 0 || loading}
                  className="w-full h-14 rounded-full bg-[#c81c6a] text-white font-medium text-[16px] hover:bg-[#a8195a] transition-colors flex items-center justify-between px-8 disabled:opacity-50 shadow-md group"
                >
                  <span className="mx-auto">{loading ? "Processing..." : "Confirm via WhatsApp"}</span> 
                  {loading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <ArrowRight size={20} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform" />
                  )}
                </button>
                <p className="text-[11px] text-[#a3a3a3] text-center mt-6 uppercase tracking-[0.2em] font-medium">No payment required until confirmation.</p>
              </div>

            </form>
          </div>

        </div>
      </main>
    </div>
  );
}
