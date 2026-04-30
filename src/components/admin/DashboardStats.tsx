import React from "react";
import { DollarSign, ShoppingCart, Package, Users } from "lucide-react";
import { motion } from "framer-motion";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";


export function DashboardStats({ orders = [] }: { orders?: any[] }) {
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const activeOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
  // For total assets and reach, we'll keep them somewhat static or derived from order items
  const uniqueProducts = new Set(orders.flatMap(o => o.items?.map((i: any) => i.productId) || [])).size;
  const totalQuantity = orders.reduce((sum, o) => sum + (o.items?.reduce((s: number, i: any) => s + (i.quantity || 0), 0) || 0), 0);

  const stats = [
    { 
      label: "Total Revenue", 
      value: `AED ${totalRevenue.toLocaleString()}`, 
      subtext: "Heritage Inflow", 
      icon: DollarSign, 
      color: "text-emerald-500", 
      bg: "bg-emerald-500" 
    },
    { 
      label: "Active Orders", 
      value: activeOrders.toString().padStart(2, '0'), 
      subtext: "Fulfillment Queue", 
      icon: ShoppingCart, 
      color: "text-[#c81c6a]", 
      bg: "bg-[#c81c6a]" 
    },
    { 
      label: "Product Velocity", 
      value: uniqueProducts.toString().padStart(2, '0'), 
      subtext: "Curated Catalog", 
      icon: Package, 
      color: "text-[#0b2b1a]", 
      bg: "bg-[#0b2b1a]" 
    },
    { 
      label: "Archive Reach", 
      value: totalQuantity.toString(), 
      subtext: "Audience Engagement", 
      icon: Users, 
      color: "text-blue-500", 
      bg: "bg-blue-500" 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.8 }}
          className="relative overflow-hidden bg-white/80 backdrop-blur-xl p-8 rounded-[3rem] border border-white shadow-2xl shadow-black/[0.02] group hover:shadow-black/[0.05] transition-all duration-700"
        >
          {/* Background Highlight */}
          <div className={cn("absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-[0.03] transition-transform duration-1000 group-hover:scale-150 group-hover:rotate-12", stat.bg)} />

          <div className="flex justify-between items-start mb-10 relative z-10">
            <div className={cn("p-4 rounded-[1.5rem] shadow-xl shadow-black/[0.02] bg-white transition-all duration-500 group-hover:scale-110", stat.color)}>
              <stat.icon size={22} strokeWidth={1.5} />
            </div>
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[9px] font-black tracking-[0.3em] text-[#0b2b1a] uppercase">Vitals</span>
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="text-[#0b2b1a] text-4xl font-black mb-2 font-playfair tracking-tighter">{stat.value}</h3>
            <p className="text-[10px] font-black text-gray-600 mb-4 uppercase tracking-[0.2em]">{stat.label}</p>
            <div className="pt-4 border-t border-gray-100/50">
               <p className="text-[9px] text-[#0b2b1a] font-black uppercase tracking-widest">{stat.subtext}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}


function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
