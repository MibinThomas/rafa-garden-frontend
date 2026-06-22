"use client";

import React from "react";
import Link from "next/link";
import { 
  Home, Settings, Briefcase, FolderGit, MessageSquare, HelpCircle, Image, Globe, ChevronRight 
} from "lucide-react";
import { motion } from "framer-motion";

const CMS_MODULES = [
  {
    id: "home",
    title: "Homepage CMS",
    description: "Manage hero banners, trust badges, categories list, and home layout configuration.",
    href: "/admin/cms/home",
    icon: Home,
    color: "#c81c6a"
  },
  {
    id: "about",
    title: "About Page CMS",
    description: "Edit farm narratives, mission details, floating fruit badges, and technique grids.",
    href: "/admin/cms/about",
    icon: Settings,
    color: "#5d5f61"
  },
  {
    id: "services",
    title: "Services & Amenities CMS",
    description: "Publish agricultural facilities, visitor amenities, and farm curation services.",
    href: "/admin/cms/services",
    icon: Briefcase,
    color: "#7fa23f"
  },
  {
    id: "projects",
    title: "Sanctuary Projects CMS",
    description: "Maintain landscape layout curations, project catalogs, locations, and slugs.",
    href: "/admin/cms/projects",
    icon: FolderGit,
    color: "#9a0c52"
  },
  {
    id: "testimonials",
    title: "Testimonials CMS",
    description: "Control author reviews, ratings, designations, and public validation displays.",
    href: "/admin/cms/testimonials",
    icon: MessageSquare,
    color: "#c81c6a"
  },
  {
    id: "faqs",
    title: "FAQs & Support CMS",
    description: "Update help center questions, detailed answers, and support classifications.",
    href: "/admin/cms/faqs",
    icon: HelpCircle,
    color: "#5d5f61"
  },
  {
    id: "gallery",
    title: "Visual Gallery CMS",
    description: "Configure high-resolution photo highlights, categories, and showcase order.",
    href: "/admin/cms/gallery",
    icon: Image,
    color: "#7fa23f"
  }
];

export default function CmsHubPage() {
  return (
    <div className="space-y-12 pb-24 relative">
      {/* Background Watermark */}
      <div className="absolute top-0 right-0 pointer-events-none opacity-[0.03] select-none -mt-10 -mr-10 md:-mr-20">
         <h1 className="text-[120px] md:text-[250px] font-black tracking-tighter leading-none text-[#5d5f61]">CMS HUB</h1>
      </div>

      {/* Header */}
      <div className="relative z-10">
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[#c81c6a] font-black text-[10px] capitalize tracking-[0.5em] mb-2 md:mb-4 ml-1"
        >
          Dynamic Administration
        </motion.p>
        <h1 className="text-4xl md:text-7xl font-black font-playfair text-[#5d5f61] tracking-tighter">Content Hub</h1>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {CMS_MODULES.map((mod, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            key={mod.id}
            className="bg-white/60 backdrop-blur-md rounded-[3rem] border border-white p-8 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 flex flex-col justify-between group"
          >
            <div>
              <div 
                className="w-16 h-16 rounded-[1.8rem] flex items-center justify-center mb-6 shadow-md border border-gray-50/50 group-hover:scale-110 transition-transform duration-500"
                style={{ backgroundColor: `${mod.color}15`, color: mod.color }}
              >
                <mod.icon size={26} strokeWidth={2} />
              </div>
              <h3 className="text-2xl font-black font-playfair text-[#5d5f61] mb-2.5 leading-none">{mod.title}</h3>
              <p className="text-gray-400 text-[11px] font-semibold leading-relaxed mb-8 normal-case">{mod.description}</p>
            </div>
            
            <Link 
              href={mod.href}
              className="flex items-center justify-between py-4 px-6 rounded-2xl bg-white/80 hover:bg-[#5d5f61] text-[#5d5f61] hover:text-white border border-gray-100/50 font-black text-[9px] capitalize tracking-widest shadow-sm transition-all duration-300"
            >
              <span>Manage Content</span>
              <ChevronRight size={14} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
