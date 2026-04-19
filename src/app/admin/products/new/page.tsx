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
    <div className="space-y-10 pb-20">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <Link 
            href="/admin/products"
            className="group flex items-center gap-2 mb-6 text-[10px] font-black uppercase tracking-[0.3em] text-[#bbbdbf] hover:text-[#c81c6a] transition-all"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Catalog
          </Link>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-4 mb-3"
          >
             <div className="w-10 h-10 rounded-full bg-[#c81c6a]/10 flex items-center justify-center">
                <Sparkles className="text-[#c81c6a]" size={20} />
             </div>
             <span className="text-[10px] font-black text-[#bbbdbf] uppercase tracking-[0.4em]">Heritage Creation</span>
          </motion.div>
          <h1 className="text-6xl font-black font-playfair text-[#0b2b1a] tracking-tighter">
            New <span className="italic font-normal">Botanical Asset</span>
          </h1>
        </div>
      </div>

      {/* Form Container */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <ProductForm onSubmit={handleSubmit} isLoading={loading} />
      </motion.div>

      {/* Footer Meta */}
      <div className="pt-12 border-t border-gray-50 flex items-center justify-center gap-8">
         <div className="flex items-center gap-2">
            <Package size={14} className="text-[#bbbdbf]" />
            <span className="text-[9px] font-bold text-[#bbbdbf] uppercase tracking-widest">Inventory Ledger v1.0</span>
         </div>
      </div>
    </div>
  );
}
