"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SiteContentForm } from "@/components/admin/SiteContentForm";
import { PanelTop, PanelBottom } from "lucide-react";

export default function SiteSettingsPage() {
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  return (
    <div className="space-y-12 pb-24 relative">
      {/* Background Watermark */}
      <div className="absolute top-0 right-0 pointer-events-none opacity-[0.03] select-none -mt-10 -mr-20">
         <h1 className="text-[250px] font-black tracking-tighter leading-none text-[#5d5f61]">SITE</h1>
      </div>

      <div className="relative z-10">
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[#c81c6a] font-black text-[10px] uppercase tracking-[0.5em] mb-4 ml-1"
        >
          Structural Management
        </motion.p>
        <h1 className="text-6xl md:text-7xl font-black font-playfair text-[#5d5f61] tracking-tighter">Settings</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl relative z-10">
        {/* Header Widget */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => setActiveGroup("header")}
          className="bg-white/60 backdrop-blur-md p-10 rounded-[3.5rem] border border-white shadow-2xl shadow-black/[0.03] hover:shadow-black/[0.06] transition-all duration-700 cursor-pointer group flex gap-8 items-center"
        >
          <div className="w-20 h-20 rounded-[2rem] bg-white text-[#c81c6a] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#c81c6a] group-hover:text-white transition-all duration-700 shadow-xl border border-gray-50">
            <PanelTop size={32} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-2xl font-black font-playfair text-[#5d5f61] group-hover:text-[#c81c6a] transition-colors duration-500">Header Content</h3>
            <p className="text-[12px] text-gray-400 font-bold uppercase tracking-widest mt-2 leading-relaxed opacity-60">Menus, banners & global branding.</p>
          </div>
        </motion.div>

        {/* Footer Widget */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => setActiveGroup("footer")}
          className="bg-white/60 backdrop-blur-md p-10 rounded-[3.5rem] border border-white shadow-2xl shadow-black/[0.03] hover:shadow-black/[0.06] transition-all duration-700 cursor-pointer group flex gap-8 items-center"
        >
          <div className="w-20 h-20 rounded-[2rem] bg-white text-[#c81c6a] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#c81c6a] group-hover:text-white transition-all duration-700 shadow-xl border border-gray-50">
            <PanelBottom size={32} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-2xl font-black font-playfair text-[#5d5f61] group-hover:text-[#c81c6a] transition-colors duration-500">Footer Content</h3>
            <p className="text-[12px] text-gray-400 font-bold uppercase tracking-widest mt-2 leading-relaxed opacity-60">Company info, links & social assets.</p>
          </div>
        </motion.div>
      </div>

      <SiteContentForm 
        isOpen={!!activeGroup} 
        onClose={() => setActiveGroup(null)} 
        group={activeGroup || ""} 
        onSave={() => setActiveGroup(null)} 
      />
    </div>
  );
}
