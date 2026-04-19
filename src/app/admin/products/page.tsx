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
    <div className="space-y-10 pb-16">
      {/* Notifications Area */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
              "fixed top-8 right-8 z-[100] px-8 py-5 rounded-[1.8rem] shadow-2xl flex items-center gap-4 border",
              notification.type === 'success' ? "bg-emerald-50 border-emerald-100 text-emerald-800" : "bg-red-50 border-red-100 text-red-800"
            )}
          >
            {notification.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span className="text-[11px] font-black uppercase tracking-widest">{notification.message}</span>
            <button onClick={() => setNotification(null)} className="ml-4 opacity-40 hover:opacity-100">
               <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 mb-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#0b2b1a] flex items-center justify-center shadow-lg">
              <Package className="text-white" size={24} />
            </div>
            <span className="text-[11px] font-black text-[#bbbdbf] uppercase tracking-[0.4em]">Inventory Hub</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl font-black font-playfair text-[#0b2b1a] tracking-tighter"
          >
            Product <span className="italic font-normal">Catalog</span>
          </motion.h1>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex items-center gap-3"
          >
            {/* Bulk Actions */}
            <button 
              onClick={() => handleExport('csv')}
              disabled={loading}
              className="flex items-center gap-3 px-6 py-4 bg-white border border-gray-100 text-[#0b2b1a] rounded-[1.2rem] shadow-sm hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              title="Download as CSV"
            >
              <Download size={16} className="text-[#c81c6a]" />
              <span className="text-[10px] font-black uppercase tracking-widest">CSV</span>
            </button>
            <button 
              onClick={() => handleExport('xlsx')}
              disabled={loading}
              className="flex items-center gap-3 px-6 py-4 bg-white border border-gray-100 text-[#0b2b1a] rounded-[1.2rem] shadow-sm hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              title="Download as Excel"
            >
              <Download size={16} className="text-[#c81c6a]" />
              <span className="text-[10px] font-black uppercase tracking-widest">Excel</span>
            </button>
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={bulkProcessing || loading}
              className="flex items-center gap-3 px-6 py-4 bg-white border border-gray-100 text-[#0b2b1a] rounded-[1.2rem] shadow-sm hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              {bulkProcessing ? <Loader2 size={16} className="animate-spin text-[#c81c6a]" /> : <Upload size={16} className="text-[#c81c6a]" />}
              <span className="text-[10px] font-black uppercase tracking-widest">{bulkProcessing ? "Importing..." : "Import"}</span>
            </button>
            <input type="file" ref={fileInputRef} onChange={handleImport} accept=".xlsx, .xls, .csv" className="hidden" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link 
              href="/admin/products/new"
              className="group flex items-center gap-4 px-10 py-5 bg-[#0b2b1a] text-white rounded-[1.8rem] shadow-2xl hover:bg-[#c81c6a] transition-all duration-500"
            >
              <span className="text-[11px] font-black uppercase tracking-[0.2em]">Add Botanical Asset</span>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:rotate-90 transition-transform duration-500">
                 <Plus size={18} />
              </div>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Control Bar: Search & Filter */}
      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-[#bbbdbf] group-focus-within:text-[#c81c6a] transition-colors" size={20} />
          <input 
            type="text"
            placeholder="Search by botanical name or collection ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-20 pr-10 py-6 bg-white rounded-[2rem] border-none outline-none shadow-sm font-bold text-[#0b2b1a] focus:ring-2 focus:ring-[#c81c6a]/10 transition-all text-sm placeholder:text-gray-300"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-8 py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                selectedCategory === cat 
                  ? "bg-white text-[#c81c6a] shadow-md border-b-2 border-[#c81c6a]" 
                  : "bg-white/50 text-[#bbbdbf] hover:bg-white hover:text-[#0b2b1a]"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Premium Data Table Area */}
      <div className="bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden">
        {(loading || bulkProcessing) ? (
          <div className="py-40 flex flex-col items-center justify-center gap-6">
            <Loader2 className="animate-spin text-[#c81c6a]" size={48} />
            <p className="text-[11px] font-black text-[#bbbdbf] uppercase tracking-[0.2em]">
              {bulkProcessing ? "Processing Inventory..." : "Cultivating Data..."}
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-40 flex flex-col items-center justify-center text-center px-10">
            <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center mb-8">
               <Package className="text-gray-200" size={40} />
            </div>
            <h3 className="text-2xl font-black font-playfair text-[#0b2b1a] mb-2 tracking-tight">No Botanical Assets Found</h3>
            <p className="text-gray-400 text-sm max-w-xs font-medium">Try refining your search or filter criteria to discover our heritage collection.</p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="text-left py-10 px-10 text-[10px] font-black text-[#bbbdbf] uppercase tracking-widest">Product Staging</th>
                  <th className="text-left py-10 px-8 text-[10px] font-black text-[#bbbdbf] uppercase tracking-widest">Collection</th>
                  <th className="text-left py-10 px-8 text-[10px] font-black text-[#bbbdbf] uppercase tracking-widest">Variants</th>
                  <th className="text-left py-10 px-8 text-[10px] font-black text-[#bbbdbf] uppercase tracking-widest">Inventory Status</th>
                  <th className="text-right py-10 px-10 text-[10px] font-black text-[#bbbdbf] uppercase tracking-widest">Action Hub</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredProducts.map((p, idx) => (
                  <motion.tr 
                    key={p._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group hover:bg-[#f1f1f2]/30 transition-colors"
                  >
                    <td className="py-10 px-10">
                      <div className="flex items-center gap-6">
                        <div className="w-20 h-24 rounded-2xl bg-[#f1f1f2] flex items-center justify-center p-3 relative shadow-inner group-hover:scale-105 transition-transform">
                          <img src={p.image} alt={p.name} className="w-full h-full object-contain drop-shadow-md" />
                          <div className="absolute -top-2 -right-2 w-7 h-7 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-50">
                             <span className="text-[8px] font-black text-[#0b2b1a]">{p.id}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-lg font-black font-playfair text-[#0b2b1a] tracking-tight group-hover:text-[#c81c6a] transition-colors">{p.name}</p>
                          <p className="text-[10px] font-bold text-[#bbbdbf] mt-1 max-w-[200px] line-clamp-1">{p.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-10 px-8">
                       <span className={cn(
                         "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest",
                         p.category === 'Crush' ? "bg-[#c81c6a]/10 text-[#c81c6a]" :
                         p.category === 'Jams' ? "bg-[#9a0c52]/10 text-[#9a0c52]" :
                         p.category === 'Fruits' ? "bg-emerald-50 text-emerald-600" :
                         "bg-amber-50 text-amber-600"
                       )}>
                         {p.category}
                       </span>
                    </td>
                    <td className="py-10 px-8">
                       <div className="flex flex-col gap-1">
                          <span className="text-[11px] font-black text-[#0b2b1a]">{p.variants?.length || 0} SKU(s)</span>
                          <span className="text-[9px] font-bold text-[#bbbdbf] uppercase">
                            From ₹{p.variants && p.variants.length > 0 ? Math.min(...p.variants.map(v => v.price || 0)) : '0'}
                          </span>
                       </div>
                    </td>
                    <td className="py-10 px-8">
                       <div className="flex items-center gap-3">
                          <CheckCircle2 size={16} className={p.active ? "text-emerald-500" : "text-gray-200"} />
                          <span className={cn(
                             "text-[10px] font-black uppercase tracking-widest",
                             p.active ? "text-emerald-700" : "text-gray-300"
                          )}>
                             {p.active ? "Active" : "Archived"}
                          </span>
                       </div>
                    </td>
                    <td className="py-10 px-10 text-right">
                       <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link 
                            href={`/admin/products/${p._id}`}
                            className="p-3 rounded-xl bg-white text-[#0b2b1a] hover:bg-[#0b2b1a] hover:text-white shadow-sm border border-gray-100 transition-all"
                          >
                             <Edit2 size={16} />
                          </Link>
                          <button 
                            onClick={() => handleDelete(p._id)}
                            className="p-3 rounded-xl bg-white text-red-500 hover:bg-red-500 hover:text-white shadow-sm border border-gray-100 transition-all"
                          >
                             <Trash2 size={16} />
                          </button>
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-gray-200">
                             <ChevronRight size={20} />
                          </div>
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
         <p className="text-[10px] font-black text-[#bbbdbf] uppercase tracking-[0.5em]">Heritage Management System &bull; Rafah Garden &bull; 2026</p>
      </div>
    </div>
  );
}
