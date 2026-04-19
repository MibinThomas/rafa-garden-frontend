"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft, Edit3, Loader2, Package } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ProductForm } from "@/components/admin/ProductForm";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        } else {
          alert("Product not found");
          router.push("/admin/products");
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchProduct();
  }, [params.id, router]);

  const handleSubmit = async (data: any) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/products/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/admin/products");
      } else {
        const error = await res.json();
        alert(`Failed to update product: ${error.error}`);
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("An error occurred while updating the product.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
        <Loader2 className="animate-spin text-[#c81c6a]" size={48} />
        <p className="text-[11px] font-black text-[#bbbdbf] uppercase tracking-[0.2em]">Retrieving Botanical Profile...</p>
      </div>
    );
  }

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
             <div className="w-10 h-10 rounded-full bg-[#0b2b1a] flex items-center justify-center">
                <Edit3 className="text-white" size={18} />
             </div>
             <span className="text-[10px] font-black text-[#bbbdbf] uppercase tracking-[0.4em]">Heritage Editing</span>
          </motion.div>
          <h1 className="text-6xl font-black font-playfair text-[#0b2b1a] tracking-tighter">
            Refine <span className="italic font-normal">Botanical Asset</span>
          </h1>
          <p className="text-[#c81c6a] font-bold text-[10px] uppercase tracking-widest mt-4 ml-1">
             Editing: {product?.name} ({product?.id})
          </p>
        </div>
      </div>

      {/* Form Container */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {product && <ProductForm initialData={product} onSubmit={handleSubmit} isLoading={saving} />}
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
