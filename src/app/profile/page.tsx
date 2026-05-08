"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Package, 
  HelpCircle, 
  ArrowRight, 
  ChevronDown, 
  LogOut
} from "lucide-react";
import { useHeaderColor } from "@/lib/HeaderColorContext";

const TABS = [
  { id: "account", label: "Account.", icon: User },
  { id: "orders", label: "Orders.", icon: Package },
  { id: "support", label: "Support.", icon: HelpCircle },
];

const FAQS = [
  {
    question: "When will my botanical assets arrive?",
    answer: "Our products are harvested fresh to order. Standard shipping typically takes 3-5 business days within the region. You will receive a WhatsApp confirmation once your manifest is dispatched."
  },
  {
    question: "How should I care for my Rafah Garden harvests?",
    answer: "To maintain peak freshness, keep your botanical assets in a cool, dry sanctuary away from direct sunlight. For live plants, a specific care guide is included with your delivery."
  },
  {
    question: "Can I return a fresh harvest?",
    answer: "Due to the artisanal and perishable nature of our products, we only accept returns within 48 hours of delivery if the quality does not meet our heritage standards. Please contact our support collective for assistance."
  },
  {
    question: "How do I confirm my order settlement?",
    answer: "All orders are finalized via WhatsApp. Once you place an order on the sanctuary website, our team will reach out to confirm availability and settlement details."
  }
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("account");
  const { setIsImmersive, setHeaderColor } = useHeaderColor();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
    setIsImmersive(false);
    setHeaderColor("#1b1c1c");
  }, [setIsImmersive, setHeaderColor]);

  // Mock Orders
  const mockOrders = [
    { id: "RG-9482", date: "Oct 12, 2026", status: "Delivered", total: 1198.00, items: 2 },
    { id: "RG-9122", date: "Sep 04, 2026", status: "In Transit", total: 499.00, items: 1 }
  ];

  const activeTabData = TABS.find(t => t.id === activeTab) || TABS[0];

  return (
    <div className="min-h-screen bg-[#f1f1f2] text-[#1b1c1c] selection:bg-[#c81c6a] selection:text-white overflow-x-hidden">
      
      <main className="max-w-[1440px] mx-auto px-6 md:px-12 pt-32 md:pt-40 pb-20 md:pb-32 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Left Column: Typography & Tab Selection */}
          <div className="flex flex-col justify-start">
            <span className="text-[14px] md:text-[16px] text-[#a3a3a3] font-medium mb-4">
              {activeTab === "account" ? "Personal Identity" : activeTab === "orders" ? "Shipment Tracking" : "Help Sanctuary"}
            </span>
            
            <AnimatePresence mode="wait">
              <motion.h1 
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="text-[140px] md:text-[200px] leading-[0.8] tracking-tight text-[#b5b5b5] select-none mb-12" 
                style={{ fontFamily: "'DharmaGothic', sans-serif", fontWeight: 700 }}
              >
                {activeTabData.label}
              </motion.h1>
            </AnimatePresence>

            <div className="flex flex-col items-start gap-4 mb-20">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-[18px] md:text-[22px] font-light transition-all flex items-center gap-4 ${activeTab === tab.id ? "text-[#c81c6a] pl-2" : "text-[#a3a3a3] hover:text-[#555555]"}`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full bg-[#c81c6a] transition-opacity ${activeTab === tab.id ? "opacity-100" : "opacity-0"}`} />
                  {tab.label.replace('.', '')}
                </button>
              ))}
              <button className="text-[14px] font-bold uppercase tracking-[0.3em] text-[#888888] hover:text-red-500 transition-colors mt-8 flex items-center gap-3">
                <LogOut size={16} /> Logout System
              </button>
            </div>
          </div>

          {/* Right Column: Tab Content */}
          <div className="flex flex-col justify-start pt-8 lg:pt-0 lg:pl-10">
            <AnimatePresence mode="wait">
              
              {/* Account Tab */}
              {activeTab === "account" && (
                <motion.div
                  key="account"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-16"
                >
                  <div>
                    <h2 className="text-[32px] md:text-[40px] font-light text-[#555555] mb-8">Personal Details.</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
                      <div className="relative group">
                        <label className="text-[13px] font-medium text-[#888888] mb-1 block">Full Name</label>
                        <input type="text" defaultValue="Lazim Doe" className="w-full bg-transparent border-b border-[#cccccc] py-2 focus:border-[#a3a3a3] focus:outline-none transition-all text-[14px] text-[#555555]" />
                      </div>
                      <div className="relative group">
                        <label className="text-[13px] font-medium text-[#888888] mb-1 block">Email Address</label>
                        <input type="email" defaultValue="hello@example.com" className="w-full bg-transparent border-b border-[#cccccc] py-2 focus:border-[#a3a3a3] focus:outline-none transition-all text-[14px] text-[#555555]" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-[32px] md:text-[40px] font-light text-[#555555] mb-8">Saved Address.</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
                      <div className="relative group sm:col-span-2">
                        <label className="text-[13px] font-medium text-[#888888] mb-1 block">Shipping Address</label>
                        <input type="text" defaultValue="123 Botanical Lane, Sanctuary District" className="w-full bg-transparent border-b border-[#cccccc] py-2 focus:border-[#a3a3a3] focus:outline-none transition-all text-[14px] text-[#555555]" />
                      </div>
                      <div className="relative group">
                        <label className="text-[13px] font-medium text-[#888888] mb-1 block">City</label>
                        <input type="text" defaultValue="Dubai" className="w-full bg-transparent border-b border-[#cccccc] py-2 focus:border-[#a3a3a3] focus:outline-none transition-all text-[14px] text-[#555555]" />
                      </div>
                      <div className="relative group">
                        <label className="text-[13px] font-medium text-[#888888] mb-1 block">Postal Code</label>
                        <input type="text" defaultValue="00000" className="w-full bg-transparent border-b border-[#cccccc] py-2 focus:border-[#a3a3a3] focus:outline-none transition-all text-[14px] text-[#555555]" />
                      </div>
                    </div>
                  </div>

                  <button className="h-14 rounded-full bg-[#c81c6a] text-white font-medium text-[16px] hover:bg-[#a8195a] transition-colors flex items-center justify-between px-8 shadow-md group w-full sm:w-auto">
                    <span className="mx-auto px-4">Update Manifest</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              )}

              {/* Orders Tab */}
              {activeTab === "orders" && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-12"
                >
                  <h2 className="text-[32px] md:text-[40px] font-light text-[#555555] mb-8">Manifest History.</h2>
                  <div className="divide-y divide-[#cccccc]/50">
                    {mockOrders.map((order) => (
                      <div key={order.id} className="py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 group">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-3">
                            <span className="text-[18px] font-medium text-[#555555]">{order.id}</span>
                            <span className={`text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                              {order.status}
                            </span>
                          </div>
                          <p className="text-[13px] text-[#a3a3a3]">{order.date} • {order.items} Botanical Assets</p>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-8">
                          <span className="text-[20px] font-light text-[#1b1c1c]">₹{order.total.toFixed(2)}</span>
                          <button className="p-3 rounded-full hover:bg-black/5 text-[#c81c6a] transition-all">
                            <ArrowRight size={20} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Support Tab */}
              {activeTab === "support" && (
                <motion.div
                  key="support"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-12"
                >
                  <h2 className="text-[32px] md:text-[40px] font-light text-[#555555] mb-8">Help Center.</h2>
                  
                  <div className="space-y-4">
                    {FAQS.map((faq, index) => (
                      <div key={index} className="border-b border-[#cccccc]/50 overflow-hidden">
                        <button 
                          onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                          className="w-full py-6 flex justify-between items-center text-left group"
                        >
                          <span className={`text-[16px] md:text-[18px] transition-colors ${expandedFaq === index ? "text-[#c81c6a]" : "text-[#555555] group-hover:text-[#1b1c1c]"}`}>
                            {faq.question}
                          </span>
                          <ChevronDown size={20} className={`text-[#a3a3a3] transition-transform duration-300 ${expandedFaq === index ? "rotate-180" : ""}`} />
                        </button>
                        <AnimatePresence>
                          {expandedFaq === index && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <p className="pb-8 text-[14px] text-[#888888] leading-relaxed max-w-[500px]">
                                {faq.answer}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>

                  <div className="pt-10">
                    <p className="text-[14px] text-[#a3a3a3] mb-6">Need further guidance?</p>
                    <a 
                      href="https://wa.me/918550088485" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-4 text-[#c81c6a] font-medium hover:underline group"
                    >
                      Speak with our Collective via WhatsApp
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>
      </main>
    </div>
  );
}
