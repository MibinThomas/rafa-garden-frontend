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

  return (
    <div className={`min-h-screen font-sans selection:bg-[#c81c6a] selection:text-white ${isLoginPage ? "bg-[#5d5f61]" : "bg-[#f1f1f2] flex relative overflow-hidden"}`}>
      {/* Background Mesh Gradient for Depth */}
      {!isLoginPage && (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#c81c6a]/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#5d5f61]/5 blur-[120px] rounded-full" />
        </div>
      )}

      {/* Sidebar - Hidden on login page */}
      {!isLoginPage && <Sidebar />}

      {/* Main Content Area */}
      <main className={`flex-1 relative z-10 min-h-screen overflow-y-auto ${!isLoginPage ? "ml-72" : "w-full"}`}>
        <div className={isLoginPage ? "w-full h-full" : "max-w-[1600px] mx-auto p-8 lg:p-14"}>
          {children}
        </div>
      </main>
    </div>
  );
}
