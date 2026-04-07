"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Package, MapPin, Settings, LogOut, ChevronRight } from "lucide-react";
import { useHeaderColor } from "@/lib/HeaderColorContext";

const TABS = [
  { id: "overview", label: "Account Overview", icon: User },
  { id: "orders", label: "Order History", icon: Package },
  { id: "addresses", label: "Saved Addresses", icon: MapPin },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const { setIsImmersive, setHeaderColor } = useHeaderColor();

  useEffect(() => {
    setIsImmersive(false);
    setHeaderColor("#0b2b1a");
  }, [setIsImmersive, setHeaderColor]);

  // Mock Orders
  const mockOrders = [
    { id: "ORD-9482", date: "Oct 12, 2026", status: "Delivered", total: 1198.00, items: 2 },
    { id: "ORD-9122", date: "Sep 04, 2026", status: "Processing", total: 499.00, items: 1 }
  ];

  return (
    <div className="min-h-screen bg-[#f1f1f2] font-sans pb-24 pt-24 md:pt-32 px-6">
      <div className="max-w-[1400px] mx-auto">
        
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-black font-playfair text-[#0b2b1a]">
              My Profile
          </h1>
          <p className="text-gray-500 font-inter mt-2">Manage your account, orders, and premium preferences.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
          
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 shrink-0 bg-white/80 backdrop-blur-md rounded-[2rem] p-4 border border-white shadow-sm flex flex-col gap-2">
             {TABS.map((tab) => {
               const Icon = tab.icon;
               const isActive = activeTab === tab.id;
               return (
                 <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id)}
                   className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${
                     isActive 
                       ? "bg-[#0b2b1a] text-white shadow-md" 
                       : "text-gray-500 hover:bg-black/5 hover:text-[#0b2b1a]"
                   }`}
                 >
                   <Icon size={18} className={isActive ? "text-brand-pink" : ""} />
                   <span className="font-bold text-sm tracking-wide">{tab.label}</span>
                   {isActive && <ChevronRight size={16} className="ml-auto opacity-50" />}
                 </button>
               )
             })}
             
             <div className="w-full h-px bg-black/5 my-2" />
             
             <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all text-red-500 hover:bg-red-50 font-bold text-sm tracking-wide">
                <LogOut size={18} /> Logout
             </button>
          </div>

          {/* Main Content Pane */}
          <div className="flex-1 w-full bg-white/80 backdrop-blur-md rounded-[2rem] p-6 lg:p-10 border border-white shadow-sm min-h-[500px]">
             <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                   {/* Overview Tab */}
                   {activeTab === "overview" && (
                     <div className="space-y-8">
                       <h2 className="text-2xl font-bold font-playfair text-[#0b2b1a] border-b border-black/5 pb-4">
                         Welcome back, Lazim!
                       </h2>
                       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                           <div className="bg-[#0b2b1a] p-6 rounded-[1.5rem] text-white shadow-lg relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-pink/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4" />
                              <h3 className="text-sm uppercase tracking-widest opacity-70 mb-1 font-bold">Total Orders</h3>
                              <p className="text-4xl font-black font-playfair">{mockOrders.length}</p>
                           </div>
                           <div className="bg-white p-6 rounded-[1.5rem] border border-black/5 shadow-sm">
                              <h3 className="text-sm uppercase tracking-widest text-gray-400 mb-1 font-bold">Account Level</h3>
                              <p className="text-2xl font-black text-[#0b2b1a] tracking-tight">Premium Member</p>
                           </div>
                       </div>
                       
                       <div className="bg-[#f1f1f2]/50 rounded-[1.5rem] p-6 border border-black/5">
                          <h3 className="font-bold text-[#0b2b1a] mb-4">Personal Details</h3>
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between border-b border-black/5 pb-2">
                               <span className="text-gray-500">Full Name</span>
                               <span className="font-medium">Lazim Doe</span>
                            </div>
                            <div className="flex justify-between border-b border-black/5 pb-2">
                               <span className="text-gray-500">Email Address</span>
                               <span className="font-medium">hello@example.com</span>
                            </div>
                            <div className="flex justify-between pb-2">
                               <span className="text-gray-500">Phone</span>
                               <span className="font-medium">+971 50 123 4567</span>
                            </div>
                          </div>
                          <button className="mt-4 px-4 py-2 border border-black/10 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-black/5 transition-colors">
                             Edit Details
                          </button>
                       </div>
                     </div>
                   )}

                   {/* Orders Tab */}
                   {activeTab === "orders" && (
                     <div className="space-y-6">
                       <h2 className="text-2xl font-bold font-playfair text-[#0b2b1a] border-b border-black/5 pb-4 mb-6">
                         Recent Orders
                       </h2>
                       
                       {mockOrders.length === 0 ? (
                         <div className="py-12 text-center text-gray-400">
                            <Package size={48} className="mx-auto opacity-20 mb-4" />
                            <p>No orders placed yet.</p>
                         </div>
                       ) : (
                         <div className="space-y-4">
                           {mockOrders.map(order => (
                              <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border border-black/5 bg-white shadow-sm hover:border-brand-pink/30 hover:shadow-md transition-all gap-4">
                                <div>
                                  <div className="flex items-center gap-3 mb-1">
                                    <h4 className="font-bold text-[#0b2b1a]">{order.id}</h4>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-widest ${
                                      order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                    }`}>
                                      {order.status}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-500">{order.date} • {order.items} Items</p>
                                </div>
                                <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                                  <span className="font-bold tabular-nums">₹{order.total.toFixed(2)}</span>
                                  <button className="text-xs font-bold uppercase text-brand-pink hover:underline tracking-widest">
                                    View Details
                                  </button>
                                </div>
                              </div>
                           ))}
                         </div>
                       )}
                     </div>
                   )}

                   {/* Addresses / Settings - Mock stubs */}
                   {(activeTab === "addresses" || activeTab === "settings") && (
                     <div className="py-20 flex flex-col items-center justify-center text-center text-gray-400">
                        <Settings size={48} className="opacity-20 mb-4" />
                        <h3 className="text-xl font-bold text-[#0b2b1a] mb-2">{TABS.find(t => t.id === activeTab)?.label} coming soon.</h3>
                        <p className="text-sm">This module is currently under development.</p>
                     </div>
                   )}

                </motion.div>
             </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}
