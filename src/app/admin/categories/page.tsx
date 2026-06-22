"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CmsForm } from "@/components/admin/CmsForm";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import Link from "next/link";

interface Category {
  _id: string;
  id: string;
  title: string;
  subtitle: string;
  image: string;
  color: string;
  products: any[];
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (Array.isArray(data)) setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setIsDeleteDialogOpen(true);
  };

  const performDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/categories?id=${deletingId}`, { method: "DELETE" });
      if (res.ok) {
        fetchCategories();
        setIsDeleteDialogOpen(false);
      }
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredCategories = categories.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-24 relative">
      {/* Background Watermark */}
      <div className="absolute top-0 right-0 pointer-events-none opacity-[0.03] select-none -mt-10 -mr-10 md:-mr-20">
         <h1 className="text-[120px] md:text-[250px] font-black tracking-tighter leading-none text-[#5d5f61]">CATEGORIES</h1>
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 relative z-10">
        <div>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#c81c6a] font-black text-[10px] capitalize tracking-[0.5em] mb-2 md:mb-4 ml-1"
          >
            Digital Architecture
          </motion.p>
          <h1 className="text-4xl md:text-7xl font-black font-playfair text-[#5d5f61] tracking-tighter">Collections</h1>
        </div>

        <button
          onClick={handleCreate}
          className="flex items-center gap-4 bg-[#5d5f61] text-white px-10 py-5 rounded-[2rem] font-black text-xs capitalize tracking-[0.2em] shadow-2xl shadow-[#5d5f61]/20 hover:bg-[#c81c6a] hover:scale-105 active:scale-95 transition-all duration-500"
        >
          <Plus size={20} /> New Category
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white/50 backdrop-blur-md p-2 rounded-[3rem] border border-white shadow-xl shadow-black/[0.02] relative z-10">
        <div className="flex items-center relative">
          <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
          <input
            type="text" 
            placeholder="Search heritage categories..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-16 pr-8 py-6 bg-transparent rounded-[2.5rem] outline-none text-sm font-bold text-[#5d5f61] placeholder:text-gray-300"
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-32 text-center relative z-10">
          <div className="relative inline-block w-16 h-16 mb-6">
             <div className="absolute inset-0 border-4 border-gray-100 rounded-full" />
             <div className="absolute inset-0 border-4 border-[#c81c6a] border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-[12px] font-black capitalize tracking-[0.3em] text-[#5d5f61] animate-pulse">Syncing Categories...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
          <AnimatePresence mode="popLayout">
            {filteredCategories.map((category) => (
              <motion.div 
                layout 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={category.id} 
                className="bg-white/60 backdrop-blur-md group rounded-[3.5rem] border border-white overflow-hidden shadow-2xl shadow-black/[0.03] hover:shadow-black/[0.06] transition-all duration-700 flex flex-col sm:flex-row h-auto sm:h-64"
              >
                <div className="w-full sm:w-60 h-48 sm:h-full relative overflow-hidden bg-gray-100">
                  {category.image && (
                    <img 
                      src={category.image} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" 
                      alt={category.title}
                    />
                  )}
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="absolute top-6 left-6">
                     <div className="px-4 py-2 rounded-full bg-white/90 backdrop-blur-md text-[9px] font-black capitalize tracking-widest text-[#5d5f61] shadow-lg">
                        {category.id}
                     </div>
                  </div>
                </div>
                <div className="flex-1 p-10 flex flex-col relative">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-2.5">
                      <button onClick={() => handleEdit(category)} className="p-3.5 rounded-2xl bg-white text-[#5d5f61] shadow-sm hover:bg-[#5d5f61] hover:text-white hover:scale-110 transition-all duration-500"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(category.id)} className="p-3.5 rounded-2xl bg-white text-red-400 shadow-sm hover:bg-red-500 hover:text-white hover:scale-110 transition-all duration-500"><Trash2 size={16} /></button>
                    </div>
                    <div className="w-4 h-4 rounded-full animate-pulse" style={{ backgroundColor: category.color }} />
                  </div>
                  <h3 className="text-3xl font-black font-playfair text-[#5d5f61] mb-2 leading-none">{category.title}</h3>
                  <p className="text-gray-400 text-[11px] font-bold capitalize tracking-widest mb-auto line-clamp-1">{category.subtitle}</p>
                  
                  <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-100 text-[10px] font-black capitalize tracking-[0.2em]">
                    <span className="flex items-center gap-2" style={{ color: category.color }}>
                       <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: category.color }} />
                       {category.products?.length || 0} Products
                    </span>
                    <Link href={`/shop?cat=${category.title.toLowerCase()}`} target="_blank" className="text-[#c81c6a] hover:underline flex items-center gap-2">Live View <ExternalLink size={12} /></Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Forms */}
      <CmsForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} category={editingCategory} onSave={fetchCategories} />
      <DeleteConfirmDialog isOpen={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} onConfirm={performDelete} loading={isDeleting} />
    </div>
  );
}
