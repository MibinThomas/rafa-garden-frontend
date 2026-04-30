import React from "react";
import { motion } from "framer-motion";

export function RevenueChart({ orders = [] }: { orders?: any[] }) {
  return (
    <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[3.5rem] border border-white shadow-2xl shadow-black/[0.02] mb-12 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#c81c6a]/5 rounded-full blur-[5rem] -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-110" />
      
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 relative z-10">
        <div>
          <p className="text-[#c81c6a] text-[10px] font-black uppercase tracking-[0.5em] mb-3">Analytics Vault</p>
          <h3 className="text-[#0b2b1a] text-4xl font-black font-playfair tracking-tighter leading-none">Market Dynamics</h3>
        </div>
        <div className="flex gap-8 bg-gray-50/50 backdrop-blur-sm p-4 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#c81c6a] shadow-[0_0_10px_rgba(200,28,106,0.3)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0b2b1a]">Revenue Flow</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#0b2b1a] shadow-[0_0_10px_rgba(11,43,26,0.3)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0b2b1a]">Order Volume</span>
          </div>
        </div>
      </div>
      
      {/* Mock SVG Chart */}
      <div className="h-[350px] w-full relative z-10">
        <svg viewBox="0 0 1000 300" className="w-full h-full overflow-visible">
          {/* Grid lines */}
          <line x1="0" y1="300" x2="1000" y2="300" stroke="#f1f1f2" strokeWidth="1" />
          <line x1="0" y1="200" x2="1000" y2="200" stroke="#f1f1f2" strokeWidth="1" strokeDasharray="4,4" />
          <line x1="0" y1="100" x2="1000" y2="100" stroke="#f1f1f2" strokeWidth="1" strokeDasharray="4,4" />
          
          {/* Revenue Area/Line */}
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] as const }}
            d="M 0,280 Q 150,260 300,180 T 600,80 T 1000,100"
            fill="none"
            stroke="#c81c6a"
            strokeWidth="5"
            strokeLinecap="round"
          />
          
          {/* Orders Gradient Bar */}
          <motion.rect
            initial={{ height: 0, y: 300 }}
            animate={{ height: 220, y: 80 }}
            transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
            x="250"
            y="80"
            width="500"
            height="220"
            fill="url(#barGradient)"
            rx="20"
          />
          
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0b2b1a" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0b2b1a" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* X-Axis Labels */}
        <div className="flex justify-between mt-8 px-4">
          {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m) => (
            <span key={m} className="text-[10px] font-black text-[#bbbdbf] uppercase tracking-[0.3em]">{m}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function OrderBreakdown({ orders = [] }: { orders?: any[] }) {
  const breakdown = [
    { label: "Inventory Velocity", color: "text-[#c81c6a]", border: "border-[#c81c6a]", icon: "Archive" },
    { label: "Liquidity Status", color: "text-emerald-500", border: "border-emerald-500", icon: "Wallet" },
    { label: "Settlement Rate", color: "text-[#0b2b1a]", border: "border-[#0b2b1a]", icon: "Shield" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
      {breakdown.map((item, idx) => (
        <motion.div 
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1, duration: 0.8 }}
          className="bg-white/80 backdrop-blur-xl p-10 rounded-[3.5rem] border border-white shadow-2xl shadow-black/[0.02] flex flex-col items-center group hover:shadow-black/[0.05] transition-all duration-700"
        >
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#bbbdbf] mb-8">{item.label}</h4>
          <div className={cn("w-44 h-44 rounded-full border-[1.5rem] flex items-center justify-center relative transition-transform duration-1000 group-hover:rotate-12", item.border, "border-opacity-10 shadow-inner")}>
             <div className={cn("absolute inset-0 border-[1.5rem] rounded-full border-t-transparent border-r-transparent", item.border)} />
             <div className="text-center relative z-10">
               <span className={cn("block text-4xl font-black font-playfair tracking-tighter leading-none mb-1", item.color)}>94%</span>
               <span className="block text-[9px] font-black text-gray-300 uppercase tracking-[0.3em]">Operational</span>
             </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function TopProducts({ orders = [] }: { orders?: any[] }) {
  // Calculate real top products
  const productDemand: Record<string, { name: string, count: number, category: string }> = {};
  orders.forEach(o => {
    o.items?.forEach((i: any) => {
      if (!productDemand[i.productId]) {
        productDemand[i.productId] = { name: i.name, count: 0, category: "Sanctuary Asset" };
      }
      productDemand[i.productId].count += i.quantity || 0;
    });
  });

  const sortedProducts = Object.values(productDemand)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  const maxCount = sortedProducts.length > 0 ? sortedProducts[0].count : 1;

  const displayProducts = sortedProducts.length > 0 ? sortedProducts.map(p => ({
    name: p.name,
    value: Math.round((p.count / maxCount) * 100),
    color: p.count === maxCount ? "bg-[#0b2b1a]" : "bg-[#c81c6a]",
    category: p.category
  })) : [
    { name: "No Orders Yet", value: 0, color: "bg-gray-100", category: "System Status" }
  ];

  return (
    <div className="bg-white/80 backdrop-blur-xl p-12 rounded-[4rem] border border-white shadow-2xl shadow-black/[0.02] relative overflow-hidden group">
      <div className="flex items-center gap-4 mb-12">
         <div className="w-1 h-10 bg-[#c81c6a] rounded-full" />
         <h3 className="text-3xl font-black font-playfair text-[#0b2b1a]">Archive Demand</h3>
      </div>
      
      <div className="space-y-10">
        {displayProducts.map((p, idx) => (
          <div key={idx} className="group/item">
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-[9px] font-black text-[#bbbdbf] uppercase tracking-[0.3em] mb-1">{p.category}</p>
                <span className="text-lg font-black text-[#0b2b1a] font-playfair tracking-tight">{p.name}</span>
              </div>
              <span className="text-[11px] font-black text-[#0b2b1a] tracking-widest">{p.value}%</span>
            </div>
            <div className="h-3 w-full bg-gray-50/50 rounded-full overflow-hidden shadow-inner border border-gray-100/50">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${p.value}%` }}
                transition={{ duration: 1.5, delay: idx * 0.2, ease: [0.16, 1, 0.3, 1] as const }}
                className={cn("h-full rounded-full relative", p.color)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/item:translate-x-full transition-transform duration-1000" />
              </motion.div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 pt-8 border-t border-gray-100/50 flex justify-center">
         <button className="text-[10px] font-black uppercase tracking-[0.4em] text-[#c81c6a] hover:tracking-[0.6em] transition-all duration-500">
           Expand Full Inventory Analytics
         </button>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
