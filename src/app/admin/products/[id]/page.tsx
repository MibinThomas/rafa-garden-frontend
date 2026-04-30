"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft, Edit3, Loader2, Package } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ProductForm } from "@/components/admin/ProductForm";

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  active: boolean;
  variants: any[];
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
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
    <div className="space-y-12 pb-24 relative">
      {/* Background Watermark */}
      <div className="absolute top-0 right-0 pointer-events-none opacity-[0.03] select-none -mt-10 -mr-20">
         <h1 className="text-[250px] font-black tracking-tighter leading-none text-[#0b2b1a]">REFINE</h1>
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
            className="text-[#c81c6a] font-black text-[10px] uppercase tracking-[0.5em] mb-4 ml-1"
          >
            Heritage Refinement
          </motion.p>
          <h1 className="text-6xl md:text-7xl font-black font-playfair text-[#0b2b1a] tracking-tighter leading-none">
            {product?.name || 'Asset Profile'}
          </h1>
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mt-6 ml-1">
             Catalogue Identity: <span className="text-[#0b2b1a]">{product?.id || '---'}</span>
          </p>
        </div>
      </div>

      {/* Form Container */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.8 }}
        className="relative z-10"
      >
        {product && <ProductForm initialData={product as any} onSubmit={handleSubmit} isLoading={saving} />}
      </motion.div>
    </div>
  );
}
