"use client";

import { useState } from "react";
import { SiteContentForm } from "@/components/admin/SiteContentForm";
import { PanelTop, PanelBottom } from "lucide-react";

export default function SiteSettingsPage() {
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  return (
    <div className="p-8 pb-32">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-[#0b2b1a] tracking-tight">Site Settings</h1>
        <p className="text-[#888888] mt-2">Manage global structural elements like header navigation, footer links, and branding.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        {/* Header Widget */}
        <div 
          onClick={() => setActiveGroup("header")}
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group flex gap-6 items-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#c81c6a]/5 text-[#c81c6a] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <PanelTop size={28} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#0b2b1a]">Header Content</h3>
            <p className="text-[13px] text-[#888888] mt-1 line-clamp-2">Update top promotional banners, navigation menus, and global logo placement in the site header.</p>
          </div>
        </div>

        {/* Footer Widget */}
        <div 
          onClick={() => setActiveGroup("footer")}
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group flex gap-6 items-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#c81c6a]/5 text-[#c81c6a] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <PanelBottom size={28} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#0b2b1a]">Footer Content</h3>
            <p className="text-[13px] text-[#888888] mt-1 line-clamp-2">Manage company description, quick links, newsletter hook, and layout graphics at the bottom.</p>
          </div>
        </div>
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
