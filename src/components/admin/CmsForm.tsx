"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Upload, Save, Loader2, Plus, Trash2, Camera } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CmsFormProps {
  isOpen: boolean;
  onClose: () => void;
  category: any | null;
  onSave: () => void;
}

export function CmsForm({ isOpen, onClose, category, onSave }: CmsFormProps) {
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    subtitle: "",
    image: "",
    color: "#c81c6a",
    products: [] as any[],
    mobileTitle: "",
    mobileShortDesc: "",
    mobileActiveDesc: "",
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [productUploadingIdx, setProductUploadingIdx] = useState<number | null>(null);
  const productFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (category) {
      setFormData({
        id: category.id || "",
        title: category.title || "",
        subtitle: category.subtitle || "",
        image: category.image || "",
        color: category.color || "#c81c6a",
        products: category.products || [],
        mobileTitle: category.mobileTitle || "",
        mobileShortDesc: category.mobileShortDesc || "",
        mobileActiveDesc: category.mobileActiveDesc || "",
      });
    } else {
      setFormData({
        id: (Math.floor(Math.random() * 90) + 10).toString(), // Random 2 char ID
        title: "",
        subtitle: "",
        image: "",
        color: "#c81c6a",
        products: [],
        mobileTitle: "",
        mobileShortDesc: "",
        mobileActiveDesc: "",
      });
    }
  }, [category, isOpen]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: "POST",
        body: file,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const blob = await response.json();
      setFormData(prev => ({ ...prev, image: blob.url }));
    } catch (error: any) {
      console.error("Upload error:", error);
      alert(`Upload Failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (productUploadingIdx === null) return;
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: "POST",
        body: file,
      });

      if (!response.ok) throw new Error("Upload failed");

      const blob = await response.json();
      
      setFormData(prev => {
        const newProducts = [...prev.products];
        newProducts[productUploadingIdx].image = blob.url;
        return { ...prev, products: newProducts };
      });
    } catch (error: any) {
       console.error("Upload error:", error);
       alert(`Upload Failed: ${error.message}`);
    } finally {
       setProductUploadingIdx(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
           ...formData,
           oldId: category?.id // Pass original ID to support renaming
        }),
      });

      if (!response.ok) throw new Error("Save failed");

      onSave();
      onClose();
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const addProduct = () => {
    setFormData(prev => ({
      ...prev,
      products: [
        ...prev.products,
        { id: Date.now().toString(), name: "New Product", description: "", image: prev.image, variants: [] }
      ]
    }));
  };

  const removeProduct = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== idx)
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0b2b1a]/40 backdrop-blur-sm z-[100]"
          />

          {/* Sidebar Form */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-screen w-full max-w-2xl bg-white shadow-2xl z-[101] flex flex-col"
          >
            {/* Form Header */}
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black font-playfair text-[#0b2b1a]">
                  {category ? "Edit Heritage" : "New Collection"}
                </h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Section details and products</p>
              </div>
              <button 
                onClick={onClose}
                className="p-3 rounded-2xl bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-[#0b2b1a] transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
              
              {/* Image Hero Section */}
              <div className="relative group">
                 <div className="aspect-[21/9] rounded-[2rem] bg-gray-100 overflow-hidden relative border-2 border-dashed border-gray-200 group-hover:border-[#c81c6a]/30 transition-colors">
                    {formData.image ? (
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-gray-300">
                           <Upload size={32} />
                           <span className="text-[10px] font-black uppercase tracking-widest">Upload Cover Asset</span>
                        </div>
                    )}
                    
                    {uploading && (
                       <div className="absolute inset-0 bg-[#0b2b1a]/60 backdrop-blur-sm flex items-center justify-center text-white gap-3">
                          <Loader2 className="animate-spin" size={20} />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Uploading...</span>
                       </div>
                    )}

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <button 
                         type="button"
                         onClick={() => fileInputRef.current?.click()}
                         className="bg-white text-[#0b2b1a] px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-transform"
                       >
                         {formData.image ? "Replace Image" : "Choose File"}
                       </button>
                    </div>
                 </div>
                 <p className="mt-4 ml-2 text-[9px] font-black uppercase tracking-[0.2em] text-[#bbbdbf]">
                    Suggested Dimensions: <span className="text-[#0b2b1a] opacity-60">1920 x 1080 px</span> (Heritage Standard)
                 </p>
                 <input 
                    type="file" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload}
                    accept="image/*"
                 />
              </div>

              {/* Core Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Index / ID</label>
                    <input 
                      type="text" 
                      value={formData.id}
                      onChange={e => setFormData(prev => ({ ...prev, id: e.target.value }))}
                      className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-[#0b2b1a] focus:ring-2 focus:ring-[#c81c6a]/20 transition-all placeholder:text-gray-200"
                      placeholder="e.g. 05"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Brand Color</label>
                    <div className="flex gap-4 items-center">
                       <input 
                         type="color" 
                         value={formData.color}
                         onChange={e => setFormData(prev => ({ ...prev, color: e.target.value }))}
                         className="w-14 h-14 rounded-xl border-none p-0 cursor-pointer"
                       />
                       <span className="text-[11px] font-black text-[#0b2b1a] uppercase">{formData.color}</span>
                    </div>
                 </div>
                 <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Collection Title</label>
                    <input 
                      type="text" 
                      value={formData.title}
                      onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-6 py-5 bg-gray-50 rounded-2xl border-none outline-none font-black font-playfair text-2xl text-[#0b2b1a] focus:ring-2 focus:ring-[#c81c6a]/20 transition-all"
                      placeholder="e.g. Fresh Heritage"
                      required
                    />
                 </div>
                 <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Curated Subtitle</label>
                    <input 
                      type="text" 
                      value={formData.subtitle}
                      onChange={e => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                      className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-[#0b2b1a] focus:ring-2 focus:ring-[#c81c6a]/20 transition-all"
                      placeholder="e.g. Experience the botanical essence"
                    />
                 </div>
              </div>

              {/* Mobile Content Strategy */}
              <div className="grid grid-cols-1 gap-6 pt-6 border-t border-gray-50">
                 <div>
                    <h3 className="text-xl font-black font-playfair text-[#0b2b1a]">Mobile Screen Hierarchies</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Press enter/return for native line breaks.</p>
                 </div>
                 
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#c81c6a] ml-1">Mobile Tagline (Headline)</label>
                    <textarea 
                      value={formData.mobileTitle}
                      onChange={e => setFormData(prev => ({ ...prev, mobileTitle: e.target.value }))}
                      className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-[#0b2b1a] focus:ring-2 focus:ring-[#c81c6a]/20 transition-all resize-none"
                      rows={3}
                      placeholder="Pure&#10;botanical&#10;refreshment"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Mobile Desc (Inactive Layout)</label>
                    <textarea 
                      value={formData.mobileShortDesc}
                      onChange={e => setFormData(prev => ({ ...prev, mobileShortDesc: e.target.value }))}
                      className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-[#0b2b1a] focus:ring-2 focus:ring-[#c81c6a]/20 transition-all resize-none"
                      rows={2}
                      placeholder="This is a sample product details..."
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Mobile Desc (Active Block)</label>
                    <textarea 
                      value={formData.mobileActiveDesc}
                      onChange={e => setFormData(prev => ({ ...prev, mobileActiveDesc: e.target.value }))}
                      className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-[#0b2b1a] focus:ring-2 focus:ring-[#c81c6a]/20 transition-all resize-none"
                      rows={3}
                      placeholder="This is a sample product details must&#10;be enter here..."
                    />
                 </div>
              </div>

              {/* Products Subsection */}
              <div className="space-y-6 pt-6 border-t border-gray-50">
                <div className="flex items-center justify-between">
                   <h3 className="text-xl font-black font-playfair text-[#0b2b1a]">Products ({formData.products.length})</h3>
                   <button 
                     type="button" 
                     onClick={addProduct}
                     className="p-3 bg-[#0b2b1a]/5 text-[#0b2b1a] rounded-xl hover:bg-[#0b2b1a] hover:text-white transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
                   >
                     <Plus size={16} /> Add Product
                   </button>
                </div>

                <div className="space-y-4">
                    {formData.products.map((p, idx) => (
                      <div key={idx} className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100 flex gap-6 group/item hover:border-[#c81c6a]/20 transition-all">
                        <div 
                          className="relative w-24 h-24 shrink-0 rounded-xl bg-white flex items-center justify-center text-gray-200 border border-gray-100 overflow-hidden group/img cursor-pointer"
                          onClick={() => {
                            setProductUploadingIdx(idx);
                            productFileInputRef.current?.click();
                          }}
                        >
                           {p.image ? (
                             <img src={p.image} className="w-full h-full object-cover" />
                           ) : (
                             <Camera size={24} />
                           )}
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                              <Upload size={16} className="text-white" />
                           </div>
                           {productUploadingIdx === idx && (
                             <div className="absolute inset-0 bg-[#0b2b1a]/60 backdrop-blur-sm flex items-center justify-center text-white">
                                <Loader2 className="animate-spin" size={16} />
                             </div>
                           )}
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                           <input 
                             type="text" 
                             value={p.name}
                             onChange={e => {
                               const newProducts = [...formData.products];
                               newProducts[idx].name = e.target.value;
                               setFormData(prev => ({ ...prev, products: newProducts }));
                             }}
                             className="w-full bg-transparent border-none p-0 outline-none font-black text-[#0b2b1a] mb-2 placeholder:text-gray-300"
                             placeholder="Product Name"
                           />
                           <textarea
                             value={p.description || ""}
                             onChange={e => {
                               const newProducts = [...formData.products];
                               newProducts[idx].description = e.target.value;
                               setFormData(prev => ({ ...prev, products: newProducts }));
                             }}
                             className="w-full bg-white/50 rounded-xl px-4 py-2 border border-black/5 outline-none text-[10px] font-bold text-gray-500 mb-3 resize-none focus:ring-2 focus:ring-[#c81c6a]/20 transition-all placeholder:text-gray-300"
                             rows={2}
                             placeholder="Enter product description/details..."
                           />
                           <div className="flex items-center justify-between">
                             <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest bg-white/50 px-2 py-1 rounded-md">ID: {p.id}</p>
                           </div>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                          <button 
                            type="button"
                            onClick={() => removeProduct(idx)}
                            className="p-3 bg-red-50 rounded-xl text-red-300 hover:text-red-500 hover:bg-red-100 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                 </div>
                 
                 {/* Hidden Product Image Uploader */}
                 <input 
                    type="file" 
                    className="hidden" 
                    ref={productFileInputRef} 
                    onChange={handleProductImageUpload}
                    accept="image/*"
                 />
              </div>
            </form>

            {/* Form Footer Actions */}
            <div className="p-8 bg-gray-50/50 border-t border-gray-50 flex gap-4">
              <button 
                type="button" 
                onClick={onClose}
                className="flex-1 py-5 rounded-2xl bg-white border border-gray-100 text-[#0b2b1a] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-gray-100 transition-all"
              >
                Discard Changes
              </button>
              <button 
                type="button"
                onClick={handleSave}
                disabled={saving || !formData.title}
                className="flex-[2] py-5 rounded-2xl bg-[#0b2b1a] text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:brightness-110 disabled:opacity-50 flex items-center justify-center gap-3 transition-all"
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin" size={16} /> Processing...
                  </>
                ) : (
                  <>
                    <Save size={16} /> Save Collection
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
