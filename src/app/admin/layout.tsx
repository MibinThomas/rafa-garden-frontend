import React from "react";
import { Sidebar } from "@/components/admin/Sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel | Rafah Garden",
  description: "Management dashboard for Rafah Garden Heritage Collection.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f1f1f2] flex font-sans">
      {/* Sidebar - Fixed on the left */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 ml-72 p-8 lg:p-12 min-h-screen overflow-y-auto">
        {/* Top Header Section inside Main */}
        <div className="max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
