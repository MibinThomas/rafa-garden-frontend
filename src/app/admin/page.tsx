"use client";

import React from "react";
import { DashboardStats } from "@/components/admin/DashboardStats";
import { RevenueChart, OrderBreakdown, TopProducts } from "@/components/admin/Charts";
import { motion } from "framer-motion";
import { Calendar, Filter, Download, LayoutDashboard } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-12 pb-24 relative">
      {/* Background Watermark */}
      <div className="absolute top-0 right-0 pointer-events-none opacity-[0.03] select-none -mt-10 -mr-20">
         <h1 className="text-[250px] font-black tracking-tighter leading-none text-[#0b2b1a]">RAFAH</h1>
      </div>

      {/* Dashboard Header */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
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
            className="text-6xl md:text-7xl font-black font-playfair text-[#0b2b1a] tracking-tighter"
          >
            Insights
          </motion.h1>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3 bg-white/50 backdrop-blur-md px-6 py-4 rounded-[2rem] border border-white shadow-xl shadow-black/[0.02]">
            <Calendar size={16} className="text-[#c81c6a]" />
            <span className="text-[11px] font-black text-[#0b2b1a] uppercase tracking-widest">Fiscal Year 2026</span>
          </div>
          <div className="flex items-center gap-3 bg-white/50 backdrop-blur-md px-6 py-4 rounded-[2rem] border border-white shadow-xl shadow-black/[0.02]">
             <Filter size={16} className="text-[#0b2b1a] opacity-40" />
             <span className="text-[11px] font-black text-[#0b2b1a] uppercase tracking-widest">Global Filter</span>
          </div>
          <button className="bg-[#0b2b1a] text-white p-5 rounded-[2rem] shadow-2xl shadow-[#0b2b1a]/20 hover:bg-[#c81c6a] transition-all duration-500 hover:scale-110 active:scale-95 group">
            <Download size={20} className="group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="relative z-10">
        <DashboardStats />
      </div>

      {/* Analytics Visualization Group */}
      <div className="relative z-10 grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2 space-y-10">
          <div className="bg-white/40 backdrop-blur-md rounded-[3rem] border border-white p-1 shadow-2xl shadow-black/[0.02]">
             <RevenueChart />
          </div>
          <div className="bg-white/40 backdrop-blur-md rounded-[3rem] border border-white p-1 shadow-2xl shadow-black/[0.02]">
             <OrderBreakdown />
          </div>
        </div>
        <div className="xl:col-span-1 space-y-10">
          <div className="bg-white/40 backdrop-blur-md rounded-[3rem] border border-white p-1 shadow-2xl shadow-black/[0.02]">
             <TopProducts />
          </div>
          
          {/* Quick Actions / Brand Health Card */}
          <div className="bg-[#0b2b1a] p-10 rounded-[3.5rem] text-white overflow-hidden relative group shadow-2xl shadow-[#0b2b1a]/20">
             <div className="relative z-10">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-xl border border-white/10">
                   <LayoutDashboard size={24} className="text-[#c81c6a]" />
                </div>
                <h3 className="text-3xl font-black font-playfair mb-4 italic leading-tight">Botanical<br/>Growth Strategy</h3>
                <p className="text-[12px] opacity-60 font-medium leading-relaxed mb-10 max-w-[200px]">Your Heritage collection has seen a 15% increase in engagement. Consider a seasonal spotlight.</p>
                <button className="bg-white text-[#0b2b1a] w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#c81c6a] hover:text-white transition-all duration-500 shadow-xl">
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
