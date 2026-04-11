"use client";

import React from "react";
import { DashboardStats } from "@/components/admin/DashboardStats";
import { RevenueChart, OrderBreakdown, TopProducts } from "@/components/admin/Charts";
import { motion } from "framer-motion";
import { Calendar, Filter, Download } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-8 pb-12">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl font-black font-playfair text-[#0b2b1a] mb-3 tracking-tighter"
          >
            Dashboard
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[#bbbdbf] font-bold text-[10px] uppercase tracking-[0.4em] ml-1"
          >
            Your Rafah Garden analytics at a glance
          </motion.p>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm">
            <Calendar size={16} className="text-[#c81c6a]" />
            <span className="text-[11px] font-black text-[#0b2b1a] uppercase tracking-wider">2026</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm">
             <Filter size={16} className="text-[#0b2b1a]" />
             <span className="text-[11px] font-black text-[#0b2b1a] uppercase tracking-wider">All Months</span>
          </div>
          <button className="bg-[#0b2b1a] text-white p-3.5 rounded-2xl shadow-xl hover:bg-[#c81c6a] transition-colors">
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <DashboardStats />

      {/* Analytics Visualization Group */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <RevenueChart />
          <OrderBreakdown />
        </div>
        <div className="xl:col-span-1">
          <TopProducts />
          
          {/* Quick Actions / Recent Activity Placeholder */}
          <div className="mt-8 bg-[#0b2b1a] p-8 rounded-[2.5rem] text-white overflow-hidden relative group">
             <div className="relative z-10">
                <h3 className="text-xl font-black font-playfair mb-2 italic">Botanical Excellence</h3>
                <p className="text-[11px] opacity-60 font-medium leading-relaxed mb-6">Your Heritage collection has seen a 15% increase in interest this week. Keep nurturing the legacy.</p>
                <button className="bg-white text-[#0b2b1a] px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform">
                   Optimize Store
                </button>
             </div>
             {/* Abstract background shape */}
             <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#c81c6a] rounded-full blur-[60px] opacity-40 group-hover:scale-150 transition-transform duration-700" />
          </div>
        </div>
      </div>
    </div>
  );
}
