import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function RevenueChart({ orders = [] }: { orders?: any[] }) {
  const [timeframe, setTimeframe] = useState<'year' | 'month' | 'week' | 'day' | 'hour'>('month');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const aggregatedData = useMemo(() => {
    const data: Record<string, { revenue: number, volume: number, fullLabel: string }> = {};
    const now = new Date();
    
    // Helper to add mock trend
    const mockTrend = (i: number, total: number) => {
      return Math.sin((i / total) * Math.PI) * 500 + Math.random() * 200;
    };

    if (timeframe === 'hour') {
      for (let i = 0; i < 24; i++) {
        data[i] = { 
          revenue: orders.length === 0 ? mockTrend(i, 24) : 0, 
          volume: orders.length === 0 ? Math.floor(mockTrend(i, 24)/100) : 0,
          fullLabel: `${i}:00 Today`
        };
      }
      orders.forEach(o => {
        const d = new Date(o.createdAt);
        const h = d.getHours();
        data[h].revenue += o.totalAmount || 0;
        data[h].volume += 1;
      });
      return Object.entries(data).map(([h, v]) => ({ label: `${h}:00`, ...v }));
    }
    
    if (timeframe === 'day') {
      for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        const key = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
        data[key] = { 
          revenue: orders.length === 0 ? mockTrend(29-i, 30) : 0, 
          volume: orders.length === 0 ? Math.floor(mockTrend(29-i, 30)/100) : 0,
          fullLabel: d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
        };
      }
      orders.forEach(o => {
        const d = new Date(o.createdAt);
        const key = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
        if (data[key]) {
          data[key].revenue += o.totalAmount || 0;
          data[key].volume += 1;
        }
      });
      return Object.entries(data).map(([label, v]) => ({ label, ...v }));
    }
    
    if (timeframe === 'month') {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      months.forEach((m, i) => {
        data[m] = { 
          revenue: orders.length === 0 ? mockTrend(i, 12) : 0, 
          volume: orders.length === 0 ? Math.floor(mockTrend(i, 12)/100) : 0,
          fullLabel: `${m} ${now.getFullYear()}`
        };
      });
      orders.forEach(o => {
        const d = new Date(o.createdAt);
        const m = months[d.getMonth()];
        data[m].revenue += o.totalAmount || 0;
        data[m].volume += 1;
      });
      return Object.entries(data).map(([label, v]) => ({ label, ...v }));
    }
    
    if (timeframe === 'week') {
      for (let i = 3; i >= 0; i--) {
        const key = `Wk ${4-i}`;
        data[key] = { 
          revenue: orders.length === 0 ? mockTrend(3-i, 4) : 0, 
          volume: orders.length === 0 ? Math.floor(mockTrend(3-i, 4)/100) : 0,
          fullLabel: `Week ${4-i} Overview`
        };
      }
      orders.forEach(o => {
        const d = new Date(o.createdAt);
        const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
        const weekIdx = 3 - Math.floor(diffDays / 7);
        if (weekIdx >= 0 && weekIdx <= 3) {
          const key = `Wk ${weekIdx + 1}`;
          data[key].revenue += o.totalAmount || 0;
          data[key].volume += 1;
        }
      });
      return Object.entries(data).map(([label, v]) => ({ label, ...v }));
    }
    
    if (timeframe === 'year') {
      const currentYear = now.getFullYear();
      for (let i = 0; i < 5; i++) {
        const y = currentYear - 4 + i;
        data[y] = { 
          revenue: orders.length === 0 ? mockTrend(i, 5) : 0, 
          volume: orders.length === 0 ? Math.floor(mockTrend(i, 5)/100) : 0,
          fullLabel: `Year ${y}`
        };
      }
      orders.forEach(o => {
        const d = new Date(o.createdAt);
        const y = d.getFullYear();
        if (data[y]) {
          data[y].revenue += o.totalAmount || 0;
          data[y].volume += 1;
        }
      });
      return Object.entries(data).map(([label, v]) => ({ label: label.toString(), ...v }));
    }
    
    return [];
  }, [orders, timeframe]);

  const maxRevenue = Math.max(...aggregatedData.map(d => d.revenue), 1000);
  const maxVolume = Math.max(...aggregatedData.map(d => d.volume), 10);

  const getPath = (isVolume = false) => {
    if (aggregatedData.length < 2) return "";
    const width = 1000;
    const height = 300;
    const step = width / (aggregatedData.length - 1);
    
    return aggregatedData.map((d, i) => {
      const x = i * step;
      const y = height - ((isVolume ? d.volume : d.revenue) / (isVolume ? maxVolume : maxRevenue)) * height * 0.7 - (isVolume ? 0 : 20);
      return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
    }).join(' ');
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 1000;
    const step = 1000 / (aggregatedData.length - 1);
    const index = Math.round(x / step);
    if (index >= 0 && index < aggregatedData.length) {
      setHoveredIndex(index);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[3.5rem] border border-white shadow-2xl shadow-black/[0.02] mb-12 relative group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#c81c6a]/5 rounded-full blur-[5rem] -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-110" />
      
      <div className="flex flex-col xl:flex-row xl:items-end justify-between mb-12 gap-8 relative z-10">
        <div>
          <p className="text-[#c81c6a] text-[10px] font-black uppercase tracking-[0.5em] mb-3">Analytics Vault</p>
          <h3 className="text-[#5d5f61] text-4xl font-black font-playfair tracking-tighter leading-none">Market Dynamics</h3>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="flex bg-gray-50/50 backdrop-blur-sm p-1.5 rounded-2xl border border-gray-100 shadow-inner">
            {(['hour', 'day', 'week', 'month', 'year'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={cn(
                  "px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 relative",
                  timeframe === t ? "text-white" : "text-[#5d5f61] opacity-40 hover:opacity-100"
                )}
              >
                {timeframe === t && (
                  <motion.div layoutId="activeTime" className="absolute inset-0 bg-[#5d5f61] rounded-xl shadow-lg z-0" />
                )}
                <span className="relative z-10">{t}</span>
              </button>
            ))}
          </div>

          <div className="flex gap-8 bg-gray-50/50 backdrop-blur-sm p-4 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#c81c6a] shadow-[0_0_10px_rgba(200,28,106,0.3)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5d5f61]">Revenue Flow</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#5d5f61] shadow-[0_0_10px_rgba(11,43,26,0.3)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5d5f61]">Order Volume</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="h-[350px] w-full relative z-10 group/chart">
        <svg 
          viewBox="0 0 1000 300" 
          className="w-full h-full overflow-visible cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Proper Axis Lines */}
          <line x1="0" y1="300" x2="1000" y2="300" stroke="#5d5f61" strokeWidth="2" strokeOpacity="0.1" />
          <line x1="0" y1="0" x2="0" y2="300" stroke="#5d5f61" strokeWidth="2" strokeOpacity="0.1" />
          
          <line x1="0" y1="200" x2="1000" y2="200" stroke="#f1f1f2" strokeWidth="1" strokeDasharray="4,4" />
          <line x1="0" y1="100" x2="1000" y2="100" stroke="#f1f1f2" strokeWidth="1" strokeDasharray="4,4" />
          
          {/* Vertical Guides */}
          {aggregatedData.map((_, i) => {
            const step = 1000 / (aggregatedData.length - 1);
            return (
              <line 
                key={i} 
                x1={i * step} y1="0" x2={i * step} y2="300" 
                stroke="#5d5f61" strokeWidth="1" strokeOpacity={hoveredIndex === i ? "0.1" : "0.03"} 
              />
            );
          })}

          <AnimatePresence mode="wait">
            <motion.path
              key={`${timeframe}-revenue`}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              d={getPath(false)}
              fill="none"
              stroke="#c81c6a"
              strokeWidth="4"
              strokeLinecap="round"
            />
            
            <motion.path
              key={`${timeframe}-volume`}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, delay: 0.2, ease: "easeInOut" }}
              d={getPath(true)}
              fill="none"
              stroke="#5d5f61"
              strokeWidth="2"
              strokeDasharray="6,6"
              strokeLinecap="round"
            />
          </AnimatePresence>

          {/* Hover Scout Line */}
          {hoveredIndex !== null && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <line 
                x1={(hoveredIndex * 1000) / (aggregatedData.length - 1)} 
                y1="0" 
                x2={(hoveredIndex * 1000) / (aggregatedData.length - 1)} 
                y2="300" 
                stroke="#c81c6a" 
                strokeWidth="2" 
                strokeDasharray="4,4"
              />
              <circle 
                cx={(hoveredIndex * 1000) / (aggregatedData.length - 1)} 
                cy={300 - (aggregatedData[hoveredIndex].revenue / maxRevenue) * 300 * 0.7 - 20}
                r="6"
                fill="#c81c6a"
                className="shadow-xl"
              />
            </motion.g>
          )}
        </svg>
        
        {/* Tooltip */}
        <AnimatePresence>
          {hoveredIndex !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="absolute z-50 bg-[#5d5f61] text-white p-4 rounded-2xl shadow-2xl pointer-events-none min-w-[160px]"
              style={{
                left: `${(hoveredIndex / (aggregatedData.length - 1)) * 100}%`,
                top: `30%`,
                transform: hoveredIndex >= aggregatedData.length - 2 ? 'translateX(-100%) translateX(-20px)' : hoveredIndex <= 1 ? 'translateX(0%) translateX(20px)' : 'translateX(-50%)',
              }}
            >
              <p className="text-[8px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">{aggregatedData[hoveredIndex].fullLabel}</p>
              <div className="flex justify-between items-end gap-4">
                 <div>
                   <span className="text-[10px] block opacity-40 uppercase font-black">Revenue</span>
                   <span className="text-xl font-black font-playfair tracking-tighter">${aggregatedData[hoveredIndex].revenue.toLocaleString()}</span>
                 </div>
                 <div className="text-right">
                   <span className="text-[10px] block opacity-40 uppercase font-black">Orders</span>
                   <span className="text-xl font-black font-playfair tracking-tighter">{aggregatedData[hoveredIndex].volume}</span>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

export function OrderBreakdown({ orders = [] }: { orders?: any[] }) {
  const breakdown = [
    { label: "Inventory Velocity", color: "text-[#c81c6a]", border: "border-[#c81c6a]", icon: "Archive" },
    { label: "Liquidity Status", color: "text-emerald-500", border: "border-emerald-500", icon: "Wallet" },
    { label: "Settlement Rate", color: "text-[#5d5f61]", border: "border-[#5d5f61]", icon: "Shield" },
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
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#5d5f61] mb-8">{item.label}</h4>
          <div className={cn("w-44 h-44 rounded-full border-[1.5rem] flex items-center justify-center relative transition-transform duration-1000 group-hover:rotate-12", item.border, "border-opacity-10 shadow-inner")}>
             <div className={cn("absolute inset-0 border-[1.5rem] rounded-full border-t-transparent border-r-transparent", item.border)} />
             <div className="text-center relative z-10">
               <span className={cn("block text-4xl font-black font-playfair tracking-tighter leading-none mb-1", item.color)}>94%</span>
               <span className="block text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">Operational</span>
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
    color: p.count === maxCount ? "bg-[#5d5f61]" : "bg-[#c81c6a]",
    category: p.category
  })) : [
    { name: "No Orders Yet", value: 0, color: "bg-gray-100", category: "System Status" }
  ];

  return (
    <div className="bg-white/80 backdrop-blur-xl p-12 rounded-[4rem] border border-white shadow-2xl shadow-black/[0.02] relative overflow-hidden group">
      <div className="flex items-center gap-4 mb-12">
         <div className="w-1 h-10 bg-[#c81c6a] rounded-full" />
         <h3 className="text-3xl font-black font-playfair text-[#5d5f61]">Archive Demand</h3>
      </div>
      
      <div className="space-y-10">
        {displayProducts.map((p, idx) => (
          <div key={idx} className="group/item">
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-[9px] font-black text-[#5d5f61] uppercase tracking-[0.3em] mb-1">{p.category}</p>
                <span className="text-lg font-black text-[#5d5f61] font-playfair tracking-tight">{p.name}</span>
              </div>
              <span className="text-[11px] font-black text-[#5d5f61] tracking-widest">{p.value}%</span>
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
