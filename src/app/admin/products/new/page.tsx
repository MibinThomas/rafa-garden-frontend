"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Package, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/admin/products");
      } else {
        const error = await res.json();
        alert(`Failed to create product: ${error.error}`);
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("An error occurred while creating the product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 pb-24 relative">
      {/* Background Watermark */}
      <div className="absolute top-0 right-0 pointer-events-none opacity-[0.03] select-none -mt-10 -mr-10 md:-mr-20">
         <h1 className="text-[120px] md:text-[250px] font-black tracking-tighter leading-none text-[#5d5f61]">CREATE</h1>
      </div>

      {/* Editorial Header */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
          <Link 
            href="/admin/products"
            className="group flex items-center gap-3 mb-8 text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 hover:text-[#c81c6a] transition-all duration-500"
          >
            <ChevronLeft size={18} className="group-hover:-translate-x-2 transition-transform duration-500" />
            Botanical Archive
          </Link>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#c81c6a] font-black text-[10px] uppercase tracking-[0.5em] mb-2 md:mb-4 ml-1"
          >
            Heritage Creation
          </motion.p>
          <h1 className="text-4xl md:text-7xl font-black font-playfair text-[#5d5f61] tracking-tighter leading-none">
            New <span className="italic font-normal">Botanical Asset</span>
          </h1>
        </div>
      </div>

      {/* Form Container */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.8 }}
        className="relative z-10"
      >
        <ProductForm onSubmit={handleSubmit} isLoading={loading} />
      </motion.div>
    </div>
  );
}
