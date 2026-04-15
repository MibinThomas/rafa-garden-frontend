"use client";

import { useState, useEffect } from "react";
import { SiteContentForm } from "@/components/admin/SiteContentForm";

export default function SocialSettingsPage() {
  // We instantly trigger the form since this page is specifically for social settings
  return (
    <div className="p-8 pb-32">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-[#0b2b1a] tracking-tight">Social Media</h1>
        <p className="text-[#888888] mt-2">Manage your global social network links rendered in the footer and contact forms.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm max-w-4xl">
         <p className="text-[#333333] font-bold mb-6">Social links are managed via the comprehensive settings dialog.</p>
         <button 
           type="button" 
           onClick={() => document.getElementById("socialTrigger")?.click()}
           className="px-8 py-4 bg-[#c81c6a] hover:bg-[#a61758] text-white rounded-2xl font-bold transition-all"
         >
            Edit Social Networks
         </button>
      </div>

      <div className="hidden">
         <SocialWrapper />
      </div>
    </div>
  );
}

function SocialWrapper() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button id="socialTrigger" onClick={() => setIsOpen(true)}>Open</button>
      <SiteContentForm 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        group="social"
        onSave={() => setIsOpen(false)}
      />
    </>
  );
}
