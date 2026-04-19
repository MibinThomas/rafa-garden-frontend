"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Upload, Save, Loader2, Plus, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
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
    <form onSubmit={handleSubmit} className="space-y-12">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        {/* Left Column: Media & Primary Info */}
        <div className="xl:col-span-1 space-y-8">
          {/* Image Upload Area */}
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#bbbdbf] ml-1">Product Visual</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="group relative aspect-[4/5] rounded-[2.5rem] bg-[#e6e7e8] border-2 border-dashed border-[#bbbdbf]/20 flex items-center justify-center overflow-hidden cursor-pointer hover:border-[#c81c6a]/40 transition-all"
            >
              {formData.image ? (
                <>
                  <img src={formData.image} alt="Preview" className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-[#0b2b1a]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <Upload size={32} className="text-white" />
                  </div>
                </>
              ) : (
                <div className="text-center p-8">
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                    <Upload size={24} className="text-[#c81c6a]" />
                  </div>
                  <p className="text-[11px] font-black text-[#0b2b1a] uppercase tracking-widest">Click to Upload</p>
                  <p className="text-[9px] text-[#bbbdbf] font-bold mt-2 uppercase">PNG or WebP recommended</p>
                </div>
              )}
              
              {uploading && (
                <div className="absolute inset-0 bg-[#e6e7e8]/80 backdrop-blur-md flex items-center justify-center z-50">
                  <Loader2 className="animate-spin text-[#c81c6a]" size={32} />
                </div>
              )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
          </div>

          {/* Status & Category */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#bbbdbf]">Availability</label>
              <button 
                type="button"
                onClick={() => handleChange("active", !formData.active)}
                className={cn(
                  "relative w-12 h-6 rounded-full transition-colors duration-300",
                  formData.active ? "bg-[#c81c6a]" : "bg-gray-200"
                )}
              >
                <motion.div 
                  animate={{ x: formData.active ? 24 : 4 }}
                  className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                />
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#bbbdbf] ml-1">Collection / Category</label>
              <select 
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className="w-full px-6 py-4 bg-[#f1f1f2] rounded-2xl border-none outline-none font-bold text-[#0b2b1a] text-sm focus:ring-2 focus:ring-[#c81c6a]/20 transition-all appearance-none cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat.title} value={cat.title}>{cat.title}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-3">
               <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#bbbdbf] ml-1">Custom Display ID</label>
               <input 
                type="text"
                value={formData.id}
                placeholder="e.g. c-10, j-15"
                onChange={(e) => handleChange("id", e.target.value)}
                className="w-full px-6 py-4 bg-[#f1f1f2] rounded-2xl border-none outline-none font-bold text-[#0b2b1a] text-sm focus:ring-2 focus:ring-[#c81c6a]/20 transition-all"
                required
              />
            </div>
          </div>
        </div>

        {/* Middle & Right Column: Details & Variants */}
        <div className="xl:col-span-2 space-y-8">
          {/* General Info Card */}
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 space-y-8">
            <h3 className="text-xl font-black font-playfair text-[#0b2b1a] italic border-b border-gray-50 pb-4">General Specifications</h3>
            
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#bbbdbf] ml-1">Product Name</label>
              <input 
                type="text"
                value={formData.name}
                placeholder="e.g. Heritage Red Crush"
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full px-8 py-5 bg-[#f1f1f2] rounded-[1.5rem] border-none outline-none font-black text-[#0b2b1a] text-lg focus:ring-2 focus:ring-[#c81c6a]/20 transition-all"
                required
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#bbbdbf] ml-1">Detailed Description</label>
              <textarea 
                value={formData.description}
                placeholder="Describe the botanical profile, heritage, and unique qualities..."
                onChange={(e) => handleChange("description", e.target.value)}
                rows={6}
                className="w-full px-8 py-6 bg-[#f1f1f2] rounded-[1.5rem] border-none outline-none font-bold text-[#0b2b1a] text-sm leading-relaxed focus:ring-2 focus:ring-[#c81c6a]/20 transition-all resize-none"
                required
              />
            </div>
          </div>

          {/* Variants Management Card */}
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 space-y-8">
            <div className="flex items-center justify-between border-b border-gray-50 pb-4">
               <h3 className="text-xl font-black font-playfair text-[#0b2b1a] italic">Product Variants</h3>
               <button 
                type="button" 
                onClick={addVariant}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#c81c6a]/10 text-[#c81c6a] hover:bg-[#c81c6a] hover:text-white transition-all text-[10px] font-black uppercase tracking-widest"
               >
                 <Plus size={14} /> Add Variant
               </button>
            </div>

            <div className="space-y-4">
              {formData.variants.map((variant, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 items-end bg-[#f1f1f2]/50 p-6 rounded-2xl border border-gray-50 group">
                  <div className="col-span-4 space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-[#bbbdbf] ml-1">Size</label>
                    <input 
                      type="text"
                      value={variant.size}
                      placeholder="500"
                      onChange={(e) => handleVariantChange(index, "size", e.target.value)}
                      className="w-full px-5 py-3.5 bg-white rounded-xl border-none outline-none font-bold text-[#0b2b1a] text-xs focus:ring-2 focus:ring-[#c81c6a]/20 transition-all"
                      required
                    />
                  </div>
                  <div className="col-span-3 space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-[#bbbdbf] ml-1">Unit</label>
                    <input 
                      type="text"
                      value={variant.unit}
                      placeholder="ML"
                      onChange={(e) => handleVariantChange(index, "unit", e.target.value)}
                      className="w-full px-5 py-3.5 bg-white rounded-xl border-none outline-none font-bold text-[#0b2b1a] text-xs focus:ring-2 focus:ring-[#c81c6a]/20 transition-all"
                      required
                    />
                  </div>
                  <div className="col-span-4 space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-[#bbbdbf] ml-1">Price (₹)</label>
                    <input 
                      type="number"
                      value={variant.price}
                      placeholder="0.00"
                      onChange={(e) => handleVariantChange(index, "price", parseFloat(e.target.value))}
                      className="w-full px-5 py-3.5 bg-white rounded-xl border-none outline-none font-bold text-[#0b2b1a] text-xs focus:ring-2 focus:ring-[#c81c6a]/20 transition-all"
                      required
                    />
                  </div>
                  <div className="col-span-1 flex justify-center pb-2">
                    <button 
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="p-3 text-red-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <p className="text-[9px] font-bold text-[#bbbdbf] uppercase tracking-widest pl-2">
              Note: The first variant is treated as the default display variant.
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex items-center gap-6 pt-4">
             <button 
              type="submit" 
              disabled={isLoading}
              className="flex-[3] py-6 rounded-[2rem] bg-[#0b2b1a] text-white font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl hover:bg-[#c81c6a] disabled:opacity-50 flex items-center justify-center gap-4 transition-all"
             >
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                {initialData ? "Update Botanical Profile" : "Nurture New Product"}
             </button>
          </div>
        </div>
      </div>
    </form>
  );
}
