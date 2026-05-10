"use client";

import React from "react";
import { Sidebar } from "@/components/admin/Sidebar";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className={`min-h-screen font-sans selection:bg-[#c81c6a] selection:text-white ${isLoginPage ? "bg-[#5d5f61]" : "bg-[#f1f1f2] flex flex-col lg:flex-row relative overflow-hidden"}`}>
      {/* Background Mesh Gradient for Depth */}
      {!isLoginPage && (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#c81c6a]/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#5d5f61]/5 blur-[120px] rounded-full" />
        </div>
      )}

      {/* Mobile Header */}
      {!isLoginPage && (
        <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-6 py-4 bg-white/70 backdrop-blur-xl border-b border-black/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#c81c6a] flex items-center justify-center">
              <div className="w-4 h-0.5 bg-white rounded-full relative after:absolute after:top-1.5 after:left-0 after:w-2 after:h-0.5 after:bg-white after:rounded-full before:absolute before:-top-1.5 before:left-0 before:w-3 before:h-0.5 before:bg-white before:rounded-full" />
            </div>
            <p className="text-[11px] font-black uppercase tracking-widest text-[#5d5f61]">Office</p>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="w-10 h-10 rounded-xl bg-white shadow-sm border border-black/5 flex items-center justify-center text-[#5d5f61] active:scale-95 transition-transform"
          >
            <div className="flex flex-col gap-1">
              <div className="w-5 h-0.5 bg-[#c81c6a] rounded-full" />
              <div className="w-3 h-0.5 bg-[#c81c6a] rounded-full" />
              <div className="w-4 h-0.5 bg-[#c81c6a] rounded-full" />
            </div>
          </button>
        </div>
      )}

      {/* Sidebar - Hidden on login page */}
      {!isLoginPage && <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />}

      {/* Main Content Area */}
      <main className={`flex-1 relative z-10 min-h-screen overflow-y-auto ${!isLoginPage ? "lg:ml-72" : "w-full"}`}>
        <div className={isLoginPage ? "w-full h-full" : "max-w-[1600px] mx-auto p-6 md:p-8 lg:p-14"}>
          {children}
        </div>
      </main>
    </div>
  );
}
