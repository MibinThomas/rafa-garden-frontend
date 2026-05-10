"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Upload, Save, Loader2, Plus, Trash2, CheckCircle2, AlertCircle, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ProductVariant {
  size: string;
  unit: string;
  price?: number;
}

interface Product {
  _id?: string;
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  variants: ProductVariant[];
  active: boolean;
}

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: Product) => Promise<void>;
  isLoading?: boolean;
}

export function ProductForm({ initialData, onSubmit, isLoading = false }: ProductFormProps) {
  const [formData, setFormData] = useState<Product>(initialData || {
    id: "",
    name: "",
    description: "",
    image: "",
    category: "Crush",
    variants: [{ size: "", unit: "", price: 0 }],
    active: true,
  });

  const [categories, setCategories] = useState<{title: string}[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Fetch categories for the dropdown
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (field: keyof Product, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleVariantChange = (index: number, field: keyof ProductVariant, value: any) => {
    const newVariants = [...formData.variants];
    const updatedValue = field === "price" ? (value === "" || isNaN(value) ? 0 : value) : value;
    newVariants[index] = { ...newVariants[index], [field]: updatedValue };
    handleChange("variants", newVariants);
  };

  const addVariant = () => {
    handleChange("variants", [...formData.variants, { size: "", unit: "", price: 0 }]);
  };

  const removeVariant = (index: number) => {
    if (formData.variants.length > 1) {
      handleChange("variants", formData.variants.filter((_, i) => i !== index));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: "POST",
        body: file,
      });

      if (!response.ok) throw new Error("Upload failed");

      const blob = await response.json();
      handleChange("image", blob.url);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      alert("Please upload a product image.");
      return;
    }
    if (!formData.id) {
       alert("Please provide a category product ID (e.g. c-10).");
       return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-16">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-16">
        {/* Left Column: Media & Primary Info */}
        <div className="xl:col-span-1 space-y-12">
          {/* Image Upload Area */}
          <div className="space-y-6">
            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 ml-1">Botanical Visual</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="group relative aspect-[4/5] rounded-[3.5rem] bg-white border border-gray-100 flex items-center justify-center overflow-hidden cursor-pointer shadow-2xl shadow-black/[0.02] hover:shadow-black/[0.05] transition-all duration-700"
            >
              {formData.image ? (
                <>
                  <img src={formData.image} alt="Preview" className="w-full h-full object-contain p-12 group-hover:scale-105 transition-transform duration-1000 ease-out" />
                  <div className="absolute inset-0 bg-[#5d5f61]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px] duration-500">
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-500">
                       <Upload size={24} className="text-[#5d5f61]" />
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center p-12">
                  <div className="w-20 h-20 rounded-[2rem] bg-[#f1f1f2] flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 group-hover:bg-[#c81c6a] group-hover:text-white transition-all duration-700">
                    <Upload size={32} strokeWidth={1.5} />
                  </div>
                  <p className="text-[11px] font-black text-[#5d5f61] uppercase tracking-[0.2em]">Upload Asset</p>
                  <p className="text-[9px] text-gray-300 font-bold mt-3 uppercase tracking-widest">PNG / WebP / JPG</p>
                </div>
              )}
              
              {uploading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center z-50 gap-4">
                  <div className="relative w-12 h-12">
                     <div className="absolute inset-0 border-4 border-gray-100 rounded-full" />
                     <div className="absolute inset-0 border-4 border-[#c81c6a] border-t-transparent rounded-full animate-spin" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#5d5f61]">Syncing...</span>
                </div>
              )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
          </div>

          {/* Status & Category */}
          <div className="bg-white/60 backdrop-blur-md p-10 rounded-[3.5rem] shadow-2xl shadow-black/[0.03] border border-white space-y-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className={cn("w-2 h-2 rounded-full", formData.active ? "bg-emerald-500 animate-pulse" : "bg-gray-300")} />
                 <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Sanctuary Status</label>
              </div>
              <button 
                type="button"
                onClick={() => handleChange("active", !formData.active)}
                className={cn(
                  "relative w-14 h-7 rounded-full transition-all duration-500 shadow-inner",
                  formData.active ? "bg-[#5d5f61]" : "bg-gray-200"
                )}
              >
                <motion.div 
                  animate={{ x: formData.active ? 30 : 4 }}
                  className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-xl"
                />
              </button>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">Heritage Collection</label>
              <div className="relative group">
                <select 
                  value={formData.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className="w-full px-8 py-5 bg-white rounded-2xl border border-gray-100 outline-none font-black text-[#5d5f61] text-[11px] uppercase tracking-widest focus:ring-4 focus:ring-[#c81c6a]/5 transition-all appearance-none cursor-pointer shadow-sm"
                >
                  {categories.map(cat => (
                    <option key={cat.title} value={cat.title}>{cat.title}</option>
                  ))}
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300 group-hover:text-[#c81c6a] transition-colors">
                   <ChevronRight size={16} className="rotate-90" />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
               <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">Archive Registry (ID)</label>
               <input 
                type="text"
                value={formData.id}
                placeholder="e.g. HER-01"
                onChange={(e) => handleChange("id", e.target.value)}
                className="w-full px-8 py-5 bg-white rounded-2xl border border-gray-100 outline-none font-black text-[#5d5f61] text-[11px] uppercase tracking-widest focus:ring-4 focus:ring-[#c81c6a]/5 transition-all shadow-sm"
                required
              />
            </div>
          </div>
        </div>

        {/* Middle & Right Column: Details & Variants */}
        <div className="xl:col-span-2 space-y-12">
          {/* General Info Card */}
          <div className="bg-white/60 backdrop-blur-md p-12 rounded-[4rem] shadow-2xl shadow-black/[0.03] border border-white space-y-12">
            <div className="flex items-center gap-4 border-b border-gray-100/50 pb-8">
               <div className="w-1 h-10 bg-[#c81c6a] rounded-full" />
               <h3 className="text-3xl font-black font-playfair text-[#5d5f61]">Narrative Profile</h3>
            </div>
            
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">Botanical Identity</label>
              <input 
                type="text"
                value={formData.name}
                placeholder="The Heritage Masterpiece"
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full px-10 py-8 bg-white rounded-[2.5rem] border border-gray-100 outline-none font-black font-playfair text-4xl text-[#5d5f61] focus:ring-4 focus:ring-[#c81c6a]/5 transition-all shadow-sm"
                required
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1 flex items-center gap-2">Cinematic Description</label>
              <textarea 
                value={formData.description}
                placeholder="Weave the story of this botanical asset..."
                onChange={(e) => handleChange("description", e.target.value)}
                rows={8}
                className="w-full px-10 py-10 bg-white rounded-[3rem] border border-gray-100 outline-none font-bold text-[#5d5f61] text-lg leading-relaxed focus:ring-4 focus:ring-[#c81c6a]/5 transition-all resize-none shadow-sm"
                required
              />
            </div>
          </div>

          {/* Variants Management Card */}
          <div className="bg-white/60 backdrop-blur-md p-12 rounded-[4rem] shadow-2xl shadow-black/[0.03] border border-white space-y-12">
            <div className="flex items-center justify-between border-b border-gray-100/50 pb-8">
               <div className="flex items-center gap-4">
                  <div className="w-1 h-10 bg-[#5d5f61] rounded-full" />
                  <h3 className="text-3xl font-black font-playfair text-[#5d5f61]">Asset Variations</h3>
               </div>
               <button 
                type="button" 
                onClick={addVariant}
                className="flex items-center gap-4 px-10 py-5 rounded-[2rem] bg-[#5d5f61] text-white hover:bg-[#c81c6a] transition-all duration-700 text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-black/5 active:scale-95 group"
               >
                 <Plus size={16} className="group-hover:rotate-90 transition-transform duration-700" /> Add Scale
               </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {formData.variants.map((variant, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-6 md:gap-8 items-end bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-gray-100 shadow-sm group hover:shadow-2xl hover:shadow-black/[0.02] transition-all duration-1000 relative overflow-hidden"
                >
                  <div className="col-span-full sm:col-span-4 space-y-4">
                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-300 ml-1">Dimensions</label>
                    <input 
                      type="text"
                      value={variant.size}
                      placeholder="500"
                      onChange={(e) => handleVariantChange(index, "size", e.target.value)}
                      className="w-full px-6 md:px-8 py-4 md:py-5 bg-gray-50/30 rounded-2xl border border-gray-50 outline-none font-black text-[#5d5f61] text-[11px] md:text-[12px] uppercase tracking-widest focus:bg-white focus:ring-4 focus:ring-[#c81c6a]/5 transition-all shadow-inner"
                      required
                    />
                  </div>
                  <div className="col-span-full sm:col-span-3 space-y-4">
                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-300 ml-1">Unit</label>
                    <input 
                      type="text"
                      value={variant.unit}
                      placeholder="ML"
                      onChange={(e) => handleVariantChange(index, "unit", e.target.value)}
                      className="w-full px-6 md:px-8 py-4 md:py-5 bg-gray-50/30 rounded-2xl border border-gray-50 outline-none font-black text-[#5d5f61] text-[11px] md:text-[12px] uppercase tracking-widest focus:bg-white focus:ring-4 focus:ring-[#c81c6a]/5 transition-all shadow-inner"
                      required
                    />
                  </div>
                  <div className="col-span-9 sm:col-span-4 space-y-4">
                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-300 ml-1">Valuation (₹)</label>
                    <input 
                      type="number"
                      value={variant.price || ""}
                      placeholder="0"
                      onChange={(e) => handleVariantChange(index, "price", parseFloat(e.target.value))}
                      className="w-full px-6 md:px-8 py-4 md:py-5 bg-gray-50/30 rounded-2xl border border-gray-50 outline-none font-black text-[#5d5f61] text-[11px] md:text-[12px] uppercase tracking-widest focus:bg-white focus:ring-4 focus:ring-[#c81c6a]/5 transition-all shadow-inner"
                      required
                    />
                  </div>
                  <div className="col-span-3 sm:col-span-1 flex justify-center pb-2">
                    <button 
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="p-4 md:p-5 text-gray-200 hover:text-red-500 hover:bg-red-50 rounded-2xl md:rounded-3xl transition-all duration-700 opacity-100 sm:opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={20} md:size={22} strokeWidth={1.5} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center gap-10 pt-10">
             <button 
              type="submit" 
              disabled={isLoading}
              className="flex-[3] py-10 rounded-[3rem] bg-[#5d5f61] text-white font-black text-[14px] uppercase tracking-[0.5em] shadow-2xl shadow-[#5d5f61]/20 hover:bg-[#c81c6a] hover:scale-105 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-8 transition-all duration-1000 relative group/submit"
             >
                {isLoading ? (
                  <div className="flex items-center gap-4">
                     <Loader2 className="animate-spin" size={24} />
                     <span>Syncing Vault...</span>
                  </div>
                ) : (
                  <>
                    <Save size={24} strokeWidth={2.5} className="group-hover:rotate-12 transition-transform duration-500" />
                    <span>{initialData ? "Commit Archive Edits" : "Cultivate New Asset"}</span>
                  </>
                )}
             </button>
          </div>
        </div>
      </div>
    </form>
  );
}
