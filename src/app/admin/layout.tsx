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
    <div className={`min-h-screen font-sans ${isLoginPage ? "bg-[#0b2b1a]" : "bg-[#f1f1f2] flex"}`}>
      {/* Sidebar - Hidden on login page */}
      {!isLoginPage && <Sidebar />}

      {/* Main Content Area */}
      <main className={`flex-1 min-h-screen overflow-y-auto ${!isLoginPage ? "ml-72 p-8 lg:p-12" : "w-full"}`}>
        {/* Top Header Section inside Main */}
        <div className={isLoginPage ? "w-full h-full" : "max-w-[1400px] mx-auto"}>
          {children}
        </div>
      </main>
    </div>
  );
}
