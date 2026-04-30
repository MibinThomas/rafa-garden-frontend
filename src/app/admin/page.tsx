"use client";

import React from "react";
import { DashboardStats } from "@/components/admin/DashboardStats";
import { RevenueChart, OrderBreakdown, TopProducts } from "@/components/admin/Charts";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Filter, Download, LayoutDashboard } from "lucide-react";
import { CalendarPicker } from "@/components/admin/CalendarPicker";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AdminDashboard() {
  const [orders, setOrders] = React.useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = React.useState<any[]>([]);
  const [fiscalYear, setFiscalYear] = React.useState("2026");
  const [globalFilter, setGlobalFilter] = React.useState("All Time");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [isYearOpen, setIsYearOpen] = React.useState(false);
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/orders");
        const data = await res.json();
        if (Array.isArray(data)) {
          setOrders(data);
          setFilteredOrders(data);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  React.useEffect(() => {
    let result = [...orders];

    // Fiscal Year Filter
    if (fiscalYear) {
      result = result.filter(o => {
        const date = new Date(o.createdAt);
        return date.getFullYear().toString() === fiscalYear;
      });
    }

    // Global / Date Range Filter
    if (globalFilter === "Last 7 Days") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      result = result.filter(o => new Date(o.createdAt) >= sevenDaysAgo);
    } else if (globalFilter === "Last 30 Days") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      result = result.filter(o => new Date(o.createdAt) >= thirtyDaysAgo);
    } else if (globalFilter === "Custom Range" && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      result = result.filter(o => {
        const date = new Date(o.createdAt);
        return date >= start && date <= end;
      });
    }

    setFilteredOrders(result);
  }, [orders, fiscalYear, globalFilter, startDate, endDate]);

  return (
    <div className="space-y-12 pb-24 relative">
      {/* Background Watermark */}
      <div className="absolute top-0 right-0 pointer-events-none opacity-[0.03] select-none -mt-10 -mr-20">
         <h1 className="text-[250px] font-black tracking-tighter leading-none text-[#5d5f61]">RAFAH</h1>
      </div>

      {/* Dashboard Header */}
      <div className="relative z-30 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#c81c6a] font-black text-[10px] uppercase tracking-[0.5em] mb-4 ml-1"
          >
            Administrative Sanctuary
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-6xl md:text-7xl font-black font-playfair text-[#5d5f61] tracking-tighter"
          >
            Insights
          </motion.h1>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-4">
          {/* Fiscal Year Filter */}
          <div className="relative">
            <button 
              onClick={() => setIsYearOpen(!isYearOpen)}
              className="hidden md:flex items-center gap-3 bg-white/50 backdrop-blur-md px-6 py-4 rounded-[2rem] border border-white shadow-xl shadow-black/[0.02] hover:bg-white transition-all active:scale-95"
            >
              <Calendar size={16} className="text-[#c81c6a]" />
              <span className="text-[11px] font-black text-[#5d5f61] uppercase tracking-widest">Fiscal Year {fiscalYear}</span>
            </button>
            
            <AnimatePresence>
              {isYearOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full mt-4 right-0 w-48 bg-white/80 backdrop-blur-xl rounded-3xl border border-white shadow-2xl z-50 overflow-hidden"
                >
                  {["2024", "2025", "2026"].map((year) => (
                    <button
                      key={year}
                      onClick={() => { setFiscalYear(year); setIsYearOpen(false); }}
                      className={cn(
                        "w-full text-left px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-colors",
                        fiscalYear === year ? "bg-[#c81c6a] text-white" : "text-[#5d5f61] hover:bg-gray-50"
                      )}
                    >
                      FY {year}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Global Filter */}
          <div className="relative">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-3 bg-white/50 backdrop-blur-md px-6 py-4 rounded-[2rem] border border-white shadow-xl shadow-black/[0.02] hover:bg-white transition-all active:scale-95"
            >
               <Filter size={16} className={cn("transition-colors", globalFilter !== "All Time" ? "text-[#c81c6a]" : "text-[#5d5f61] opacity-40")} />
               <span className="text-[11px] font-black text-[#5d5f61] uppercase tracking-widest">{globalFilter}</span>
            </button>

            <AnimatePresence>
              {isFilterOpen && (
                <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: 10 }}
                   className="absolute top-full mt-4 right-0 w-64 bg-white/80 backdrop-blur-xl rounded-3xl border border-white shadow-2xl z-50 overflow-hidden p-2"
                >
                  <div className="space-y-1">
                    {["Last 7 Days", "Last 30 Days", "Last 90 Days", "All Time", "Custom Range"].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => { setGlobalFilter(filter); if (filter !== "Custom Range") setIsFilterOpen(false); }}
                        className={cn(
                          "w-full text-left px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-colors rounded-2xl",
                          globalFilter === filter ? "bg-[#c81c6a] text-white" : "text-[#5d5f61] hover:bg-gray-50"
                        )}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>

                  {globalFilter === "Custom Range" && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4 border-t border-gray-100"
                    >
                      <CalendarPicker 
                        startDate={startDate}
                        endDate={endDate}
                        onRangeSelect={(s, e) => { setStartDate(s); setEndDate(e); }}
                        onClose={() => setIsFilterOpen(false)}
                      />
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button className="bg-[#5d5f61] text-white p-5 rounded-[2rem] shadow-2xl shadow-[#5d5f61]/20 hover:bg-[#c81c6a] transition-all duration-500 hover:scale-110 active:scale-95 group">
            <Download size={20} className="group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="relative z-10">
        <DashboardStats orders={filteredOrders} />
      </div>

      {/* Analytics Visualization Group */}
      <div className="relative z-10 grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2 space-y-10">
          <div className="bg-white/40 backdrop-blur-md rounded-[3rem] border border-white p-1 shadow-2xl shadow-black/[0.02]">
             <RevenueChart orders={filteredOrders} />
          </div>
          <div className="bg-white/40 backdrop-blur-md rounded-[3rem] border border-white p-1 shadow-2xl shadow-black/[0.02]">
             <OrderBreakdown orders={filteredOrders} />
          </div>
        </div>
        <div className="xl:col-span-1 space-y-10">
          <div className="bg-white/40 backdrop-blur-md rounded-[3rem] border border-white p-1 shadow-2xl shadow-black/[0.02]">
             <TopProducts orders={filteredOrders} />
          </div>
          
          {/* Quick Actions / Brand Health Card */}
          <div className="bg-[#5d5f61] p-10 rounded-[3.5rem] text-white overflow-hidden relative group shadow-2xl shadow-[#5d5f61]/20">
             <div className="relative z-10">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-xl border border-white/10">
                   <LayoutDashboard size={24} className="text-[#c81c6a]" />
                </div>
                <h3 className="text-3xl font-black font-playfair mb-4 italic leading-tight">Botanical<br/>Growth Strategy</h3>
                <p className="text-[12px] opacity-60 font-medium leading-relaxed mb-10 max-w-[200px]">Your Heritage collection has seen a 15% increase in engagement. Consider a seasonal spotlight.</p>
                <button className="bg-white text-[#5d5f61] w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#c81c6a] hover:text-white transition-all duration-500 shadow-xl">
                   Optimize Sanctuary
                </button>
             </div>
             {/* Abstract background shape */}
             <div className="absolute -right-16 -bottom-16 w-56 h-56 bg-[#c81c6a] rounded-full blur-[80px] opacity-30 group-hover:scale-150 transition-transform duration-1000" />
             <div className="absolute top-10 right-10 opacity-10 font-black text-6xl select-none">15%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
