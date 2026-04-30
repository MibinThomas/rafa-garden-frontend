"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Plus, Search, Filter, MoreVertical, Edit2, 
  Trash2, Package, Eye, CheckCircle2, 
  ChevronRight, Loader2, Download, Upload,
  AlertCircle, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Product {
  _id: string;
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  active: boolean;
  variants: { size: string, unit: string, price: number }[];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // Bulk states
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ["All", "Crush", "Jams", "Fruits", "Plants"];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p._id !== id));
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleExport = async (format: 'csv' | 'xlsx' = 'csv') => {
    try {
      const res = await fetch(`/api/products/bulk?format=${format}`);
      if (!res.ok) throw new Error("Export failed");
      
      const blob = await res.blob();
      if (!blob || blob.size === 0) throw new Error("Received empty file");

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `rafah-garden-inventory-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup after a short delay to ensure browser handled the click
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);
      
      setNotification({ message: `Inventory exported as ${format.toUpperCase()}`, type: 'success' });
    } catch (err) {
      console.error("Export error:", err);
      setNotification({ message: "Failed to export inventory", type: 'error' });
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBulkProcessing(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch("/api/products/bulk", {
        method: "POST",
        body: formData
      });
      
      const data = await res.json();
      if (data.success) {
        setNotification({ 
          message: `Import successful: ${data.summary.updated} updated, ${data.summary.created} created.`, 
          type: 'success' 
        });
        fetchProducts(); // Refresh list
      } else {
        throw new Error(data.error || "Import failed");
      }
    } catch (err: any) {
      setNotification({ message: err.message, type: 'error' });
    } finally {
      setBulkProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const filteredProducts = products.filter(p => {
    const name = p.name || "";
    const id = p.id || "";
    const matchesSearch = name.toLowerCase().includes(search.toLowerCase()) || id.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-12 pb-24 relative">
      {/* Background Watermark */}
      <div className="absolute top-0 right-0 pointer-events-none opacity-[0.03] select-none -mt-10 -mr-20">
         <h1 className="text-[250px] font-black tracking-tighter leading-none text-[#0b2b1a]">ASSETS</h1>
      </div>

      {/* Notifications Area */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
              "fixed top-12 right-12 z-[100] px-8 py-5 rounded-[2rem] shadow-2xl flex items-center gap-4 backdrop-blur-xl border",
              notification.type === 'success' ? "bg-emerald-500 text-white border-emerald-400" : "bg-red-500 text-white border-red-400"
            )}
          >
            {notification.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span className="text-[11px] font-black uppercase tracking-widest">{notification.message}</span>
            <button onClick={() => setNotification(null)} className="ml-4 opacity-60 hover:opacity-100">
               <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Header Section */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#c81c6a] font-black text-[10px] uppercase tracking-[0.5em] mb-4 ml-1"
          >
            Heritage Inventory
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-6xl md:text-7xl font-black font-playfair text-[#0b2b1a] tracking-tighter"
          >
            Catalog
          </motion.h1>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 bg-white/40 backdrop-blur-md p-2 rounded-[2rem] border border-white shadow-xl shadow-black/[0.02]"
          >
            {/* Bulk Actions */}
            <button 
              onClick={() => handleExport('csv')}
              disabled={loading}
              className="flex items-center gap-3 px-6 py-4 bg-white text-[#0b2b1a] rounded-[1.5rem] shadow-sm hover:scale-105 active:scale-95 transition-all disabled:opacity-50 group"
              title="Download as CSV"
            >
              <Download size={16} className="text-[#c81c6a] group-hover:-translate-y-0.5 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">CSV</span>
            </button>
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={bulkProcessing || loading}
              className="flex items-center gap-4 px-8 py-4 bg-[#0b2b1a] text-white rounded-[1.5rem] shadow-xl hover:bg-[#c81c6a] hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              {bulkProcessing ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              <span className="text-[10px] font-black uppercase tracking-widest">{bulkProcessing ? "Syncing..." : "Import"}</span>
            </button>
            <input type="file" ref={fileInputRef} onChange={handleImport} accept=".xlsx, .xls, .csv" className="hidden" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link 
              href="/admin/products/new"
              className="group flex items-center gap-6 px-10 py-5 bg-[#c81c6a] text-white rounded-[2.5rem] shadow-2xl shadow-[#c81c6a]/20 hover:scale-105 active:scale-95 transition-all duration-500"
            >
              <span className="text-[11px] font-black uppercase tracking-[0.2em]">New Asset</span>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-90 transition-transform duration-500">
                 <Plus size={18} />
              </div>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Control Bar: Search & Filter */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6">
        <div className="relative flex-1 group w-full bg-white/50 backdrop-blur-md rounded-[2.5rem] border border-white shadow-xl shadow-black/[0.02]">
          <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#c81c6a] transition-colors" size={20} />
          <input 
            type="text"
            placeholder="Search heritage repository..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-20 pr-10 py-6 bg-transparent outline-none font-bold text-[#0b2b1a] transition-all text-sm placeholder:text-gray-300"
          />
        </div>
        
        <div className="flex items-center gap-3 p-2 bg-white/40 backdrop-blur-md rounded-[2rem] border border-white shadow-xl shadow-black/[0.02]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all duration-500 whitespace-nowrap",
                selectedCategory === cat 
                  ? "bg-[#0b2b1a] text-white shadow-xl shadow-[#0b2b1a]/20 scale-105" 
                  : "text-gray-400 hover:text-[#0b2b1a] hover:bg-white"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Premium Data Table Area */}
      <div className="relative z-10 bg-white/60 backdrop-blur-xl rounded-[3.5rem] shadow-2xl shadow-black/[0.03] border border-white overflow-hidden">
        {(loading || bulkProcessing) ? (
          <div className="py-48 flex flex-col items-center justify-center gap-8">
            <div className="relative w-20 h-20">
               <div className="absolute inset-0 border-4 border-gray-100 rounded-full" />
               <div className="absolute inset-0 border-4 border-[#c81c6a] border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-[12px] font-black text-[#5d5f61] uppercase tracking-[0.3em] animate-pulse">
               {bulkProcessing ? "Processing Inventory..." : "Cultivating Data..."}
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-48 flex flex-col items-center justify-center text-center px-10">
            <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center mb-10 shadow-xl border border-gray-50">
               <Package className="text-gray-200" size={48} />
            </div>
            <h3 className="text-3xl font-black font-playfair text-[#0b2b1a] mb-3 tracking-tight">No Botanical Assets</h3>
            <p className="text-gray-400 text-sm max-w-xs font-bold uppercase tracking-widest leading-loose">Refine your search parameters to explore our legacy collection.</p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-100/50">
                  <th className="text-left py-12 px-12 text-[10px] font-black text-[#5d5f61] uppercase tracking-widest">Botanical Stage</th>
                  <th className="text-left py-12 px-10 text-[10px] font-black text-[#5d5f61] uppercase tracking-widest">Collection</th>
                  <th className="text-left py-12 px-10 text-[10px] font-black text-[#5d5f61] uppercase tracking-widest">Inventory</th>
                  <th className="text-left py-12 px-10 text-[10px] font-black text-[#5d5f61] uppercase tracking-widest">Status</th>
                  <th className="text-right py-12 px-12 text-[10px] font-black text-[#5d5f61] uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/50">
                {filteredProducts.map((p, idx) => (
                  <motion.tr 
                    key={p._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group hover:bg-white/40 transition-all duration-500"
                  >
                    <td className="py-10 px-12">
                      <div className="flex items-center gap-8">
                        <div className="w-24 h-28 rounded-[2rem] bg-white border border-gray-100 flex items-center justify-center p-4 relative shadow-sm group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-black/5 transition-all duration-700">
                          <img src={p.image} alt={p.name} className="w-full h-full object-contain filter drop-shadow-2xl" />
                          <div className="absolute -top-3 -right-3 w-9 h-9 bg-[#0b2b1a] rounded-xl flex items-center justify-center shadow-lg border-2 border-white">
                             <span className="text-[9px] font-black text-white">{p.id}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-2xl font-black font-playfair text-[#0b2b1a] tracking-tight group-hover:text-[#c81c6a] transition-colors duration-500">{p.name}</p>
                          <p className="text-[11px] font-bold text-[#5d5f61] uppercase tracking-widest mt-2 max-w-[240px] line-clamp-1">{p.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-10 px-10">
                       <span className={cn(
                         "px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-sm",
                         p.category === 'Crush' ? "bg-[#c81c6a]/10 text-[#c81c6a]" :
                         p.category === 'Jams' ? "bg-[#9a0c52]/10 text-[#9a0c52]" :
                         p.category === 'Fruits' ? "bg-emerald-50 text-emerald-600" :
                         "bg-amber-50 text-amber-600"
                       )}>
                         {p.category}
                       </span>
                    </td>
                    <td className="py-10 px-10">
                       <div className="flex flex-col gap-1.5">
                          <span className="text-[12px] font-black text-[#0b2b1a]">{p.variants?.length || 0} Assets</span>
                          <span className="text-[10px] font-bold text-[#c81c6a] uppercase tracking-widest">
                            From ₹{p.variants && p.variants.length > 0 ? Math.min(...p.variants.map(v => v.price || 0)) : '0'}
                          </span>
                       </div>
                    </td>
                    <td className="py-10 px-10">
                       <div className="flex items-center gap-3">
                          <div className={cn("w-2 h-2 rounded-full animate-pulse", p.active ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-gray-500")} />
                          <span className={cn(
                             "text-[10px] font-black uppercase tracking-widest",
                             p.active ? "text-[#0b2b1a]" : "text-gray-500"
                          )}>
                             {p.active ? "Active Sanctuary" : "Archived"}
                          </span>
                       </div>
                    </td>
                    <td className="py-10 px-12 text-right">
                       <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                          <Link 
                            href={`/admin/products/${p._id}`}
                            className="p-4 rounded-2xl bg-white text-[#0b2b1a] hover:bg-[#0b2b1a] hover:text-white shadow-xl shadow-black/5 hover:scale-110 active:scale-95 transition-all duration-500"
                          >
                             <Edit2 size={16} />
                          </Link>
                          <button 
                            onClick={() => handleDelete(p._id)}
                            className="p-4 rounded-2xl bg-white text-red-500 hover:bg-red-500 hover:text-white shadow-xl shadow-black/5 hover:scale-110 active:scale-95 transition-all duration-500"
                          >
                             <Trash2 size={16} />
                          </button>
                       </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer Branding */}
      <div className="flex justify-center pt-8">
         <p className="text-[10px] font-black text-[#5d5f61] uppercase tracking-[0.5em]">Heritage Management System &bull; Rafah Garden &bull; 2026</p>
      </div>
    </div>
  );
}
