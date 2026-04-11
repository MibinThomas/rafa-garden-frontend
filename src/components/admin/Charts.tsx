import React from "react";
import { motion } from "framer-motion";

export function RevenueChart() {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)] mb-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-[#0b2b1a] text-lg font-black font-playfair mb-1 tracking-tight">Revenue & Orders</h3>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Monthly Performance</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#c81c6a]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#0b2b1a]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Orders</span>
          </div>
        </div>
      </div>
      
      {/* Mock SVG Chart */}
      <div className="h-[300px] w-full relative group">
        <svg viewBox="0 0 1000 300" className="w-full h-full overflow-visible">
          {/* Grid lines */}
          <line x1="0" y1="300" x2="1000" y2="300" stroke="#f1f1f2" strokeWidth="1" />
          <line x1="0" y1="200" x2="1000" y2="200" stroke="#f1f1f2" strokeWidth="1" />
          <line x1="0" y1="100" x2="1000" y2="100" stroke="#f1f1f2" strokeWidth="1" />
          
          {/* Revenue Area/Line */}
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            d="M 0,250 Q 200,240 400,150 T 800,50 L 1000,80"
            fill="none"
            stroke="#c81c6a"
            strokeWidth="4"
            strokeLinecap="round"
          />
          
          {/* Orders Bar (simplified as single wide bar like screenshot) */}
          <motion.rect
            initial={{ height: 0, y: 300 }}
            animate={{ height: 250, y: 50 }}
            transition={{ duration: 1, delay: 0.5 }}
            x="200"
            y="50"
            width="600"
            height="250"
            fill="#c81c6a"
            fillOpacity="0.4"
            rx="8"
          />
        </svg>
        
        {/* X-Axis Labels */}
        <div className="flex justify-between mt-4 px-2">
          {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m) => (
            <span key={m} className="text-[10px] font-bold text-gray-300 uppercase">{m}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function OrderBreakdown() {
  const breakdown = [
    { label: "Order Status", color: "border-[#c81c6a]" },
    { label: "Payment Status", color: "border-emerald-500" },
    { label: "Payment Type", color: "border-blue-500" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
      {breakdown.map((item, idx) => (
        <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)] flex flex-col items-center">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-[#0b2b1a] mb-6">{item.label}</h4>
          <div className={`w-36 h-36 rounded-full border-[18px] ${item.color} flex items-center justify-center relative`}>
            {/* Visual breakdown holes/segments simulated with border styles if needed, but current clean donut looks good */}
            <div className="text-center">
              <span className="block text-xl font-black text-[#0b2b1a] font-playfair">100%</span>
              <span className="block text-[8px] font-bold text-gray-300 uppercase tracking-widest">Active</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function TopProducts() {
  const products = [
    { name: "Monarch High Back", value: 85, color: "bg-purple-500" },
    { name: "Rafah Secret Jam", value: 65, color: "bg-[#c81c6a]" },
    { name: "Botanical Crush", value: 45, color: "bg-emerald-500" },
  ];

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
      <h3 className="text-[#0b2b1a] text-lg font-black font-playfair mb-6 tracking-tight">Top Selling Products</h3>
      <div className="space-y-6">
        {products.map((p, idx) => (
          <div key={idx}>
            <div className="flex justify-between mb-2">
              <span className="text-[11px] font-black text-[#0b2b1a] tracking-tight">{p.name}</span>
              <span className="text-[10px] font-bold text-[#bbbdbf]">{p.value}%</span>
            </div>
            <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${p.value}%` }}
                transition={{ duration: 1, delay: idx * 0.2 }}
                className={`h-full ${p.color} rounded-full`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
