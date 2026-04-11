"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, ExternalLink, Image as ImageIcon, Settings as SettingsIcon, Layout, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CmsForm } from "@/components/admin/CmsForm";
import { SiteContentForm } from "@/components/admin/SiteContentForm";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import Link from "next/link";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Category {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  color: string;
  products: any[];
}

type Tab = "categories" | "about" | "global";

export default function CmsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("categories");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isContentFormOpen, setIsContentFormOpen] = useState(false);
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
      
      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        console.error("Data received from /api/categories is not an array:", data);
        setCategories([]);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setCategories([]);
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
      const res = await fetch(`/api/categories?id=${deletingId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        fetchCategories();
        setIsDeleteDialogOpen(false);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete category");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("An unexpected error occurred.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredCategories = categories.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.id.includes(searchQuery)
  );

  return (
    <div className="space-y-8 pb-12">
      {/* CMS Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black font-playfair text-[#0b2b1a] mb-3 tracking-tighter">Content Hub</h1>
          <p className="text-[#bbbdbf] font-bold text-[10px] uppercase tracking-[0.4em] ml-1">Manage categories, products and heritage assets</p>
        </div>

        {activeTab === "categories" && (
          <button 
            onClick={handleCreate}
            className="flex items-center gap-3 bg-[#c81c6a] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:brightness-110 active:scale-95 transition-all"
          >
            <Plus size={18} /> Add Heritage Category
          </button>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 p-1.5 bg-gray-100/50 rounded-2xl w-fit">
        {[
          { id: "categories", label: "Categories", icon: Layout },
          { id: "about", label: "About Page", icon: SettingsIcon },
          { id: "global", label: "Global Settings", icon: Globe }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
              activeTab === tab.id 
                ? "bg-white text-[#0b2b1a] shadow-sm" 
                : "text-gray-400 hover:text-[#0b2b1a]"
            )}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "categories" ? (
        <>
          {/* Search & Filters */}
          <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="flex-1 relative">
               <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
               <input 
                 type="text" 
                 placeholder="Search by title or ID..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full pl-14 pr-6 py-4 bg-gray-50/50 rounded-2xl outline-none text-sm font-bold text-[#0b2b1a] placeholder:text-gray-300 transition-all focus:bg-white focus:ring-2 focus:ring-[#c81c6a]/10"
               />
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {loading ? (
                 <div className="col-span-full py-20 text-center">
                    <div className="inline-block w-8 h-8 border-4 border-[#c81c6a] border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#bbbdbf]">Loading Heritage...</p>
                 </div>
              ) : filteredCategories.map((category, idx) => (
                <motion.div
                  layout
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white group rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] transition-all flex h-52"
                >
                  <div className="w-48 relative overflow-hidden bg-gray-100">
                     {category.image ? (
                       <img src={category.image} alt={category.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center text-gray-200"><ImageIcon size={40} /></div>
                     )}
                     <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <div className="flex-1 p-8 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                       <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">ID: {category.id}</span>
                       <div className="flex gap-2">
                          <button 
                            onClick={() => handleEdit(category)}
                            className="p-2.5 rounded-xl bg-gray-50 text-[#0b2b1a] hover:bg-[#0b2b1a] hover:text-white transition-all"
                          >
                             <Edit2 size={14} />
                          </button>
                          <button 
                            onClick={() => handleDelete(category.id)}
                            className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                          >
                             <Trash2 size={14} />
                          </button>
                       </div>
                    </div>
                    
                    <h3 className="text-2xl font-black font-playfair text-[#0b2b1a] mb-1">{category.title}</h3>
                    <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider mb-auto">{category.subtitle}</p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                        <div className="flex items-center gap-2">
                           <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                           <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{category.products?.length || 0} Products</span>
                        </div>
                        <Link href={`/shop`} target="_blank" className="text-[#c81c6a] hover:underline flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest">
                           View Live <ExternalLink size={10} />
                        </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      ) : (
        /* Site Content Management */
        <div className="bg-white rounded-[2.5rem] border border-gray-100 p-12 text-center shadow-sm">
           <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-8 text-[#0b2b1a]">
              {activeTab === "about" ? <SettingsIcon size={32} /> : <Globe size={32} />}
           </div>
           <h2 className="text-3xl font-black font-playfair text-[#0b2b1a] mb-4">
              Edit {activeTab === "about" ? "About Page" : "Global Settings"}
           </h2>
           <p className="max-w-md mx-auto text-gray-400 text-sm mb-10 leading-relaxed">
              Modify the {activeTab} content of the website. Changes will be reflected instantly across all pages.
           </p>
           <button 
             onClick={() => setIsContentFormOpen(true)}
             className="px-12 py-5 bg-[#0b2b1a] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all"
           >
              Enter Content Editor
           </button>
        </div>
      )}

      {/* Forms */}
      <CmsForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        category={editingCategory}
        onSave={fetchCategories}
      />

      <SiteContentForm 
        isOpen={isContentFormOpen}
        onClose={() => setIsContentFormOpen(false)}
        group={activeTab}
        onSave={() => {}} // Could show a toast or something
      />

      <DeleteConfirmDialog 
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={performDelete}
        loading={isDeleting}
      />
    </div>
  );
}
