import React from "react";
import { DollarSign, ShoppingCart, Package, Users } from "lucide-react";
import { motion } from "framer-motion";

const STATS = [
  { label: "Total Revenue", value: "AED 6,499", subtext: "Avg order: AED 1,300", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Total Orders", value: "5", subtext: "For selected period", icon: ShoppingCart, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Total Products", value: "8", subtext: "8 active variants", icon: Package, color: "text-amber-600", bg: "bg-amber-50" },
  { label: "Total Users", value: "4", subtext: "4 new this period", icon: Users, color: "text-[#c81c6a]", bg: "bg-[#c81c6a]/5" },
];

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {STATS.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)] group hover:shadow-[0_20px_60px_rgba(0,0,0,0.05)] transition-all"
        >
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <span className="text-[10px] font-black tracking-widest text-[#bbbdbf] uppercase">Live</span>
          </div>
          <div>
            <h3 className="text-[#0b2b1a] text-2xl font-black mb-1 font-playfair">{stat.value}</h3>
            <p className="text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-wide">{stat.label}</p>
            <p className="text-[10px] text-gray-300 font-medium">{stat.subtext}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
