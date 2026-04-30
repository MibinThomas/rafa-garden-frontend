"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Upload, Save, Loader2, Plus, Trash2, Camera, ChevronRight } from "lucide-react";
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
    mobileHeroImage: "",
    desktopFeaturedProductId: "",
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
        mobileHeroImage: category.mobileHeroImage || "",
        desktopFeaturedProductId: category.desktopFeaturedProductId || "",
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
        mobileHeroImage: "",
        desktopFeaturedProductId: "",
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
      
      const pendingType = (fileInputRef.current as any).pendingType;
      if (pendingType === "mobileHero") {
        setFormData(prev => ({ ...prev, mobileHeroImage: blob.url }));
      } else {
        setFormData(prev => ({ ...prev, image: blob.url }));
      }
      
      (fileInputRef.current as any).pendingType = null;
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
            <div className="p-10 border-b border-gray-100/50 flex items-center justify-between bg-white/80 backdrop-blur-xl">
              <div>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[#c81c6a] font-black text-[9px] uppercase tracking-[0.4em] mb-2"
                >
                  Curated Collection
                </motion.p>
                <h2 className="text-4xl font-black font-playfair text-[#0b2b1a]">
                  {category ? "Refine" : "New"} <span className="italic font-normal">Heritage</span>
                </h2>
              </div>
              <button 
                onClick={onClose}
                className="p-4 rounded-2xl bg-white text-gray-300 hover:text-[#0b2b1a] transition-all duration-500 shadow-xl shadow-black/5 hover:scale-110 active:scale-95 border border-gray-50"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar bg-[#f1f1f2]/30">
              
              {/* Image Hero Section */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">Editorial Cover</label>
                <div className="relative group">
                  <div className="aspect-[21/9] rounded-[3rem] bg-white overflow-hidden relative border border-gray-100 shadow-2xl shadow-black/[0.02] group-hover:shadow-black/[0.05] transition-all duration-1000">
                    {formData.image ? (
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-gray-200">
                           <div className="w-20 h-20 rounded-[2.5rem] bg-gray-50 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-700">
                             <Upload size={32} strokeWidth={1} />
                           </div>
                           <span className="text-[10px] font-black uppercase tracking-[0.3em]">Botanical Cover Asset</span>
                        </div>
                    )}
                    
                    {uploading && (
                       <div className="absolute inset-0 bg-[#0b2b1a]/80 backdrop-blur-md flex flex-col items-center justify-center text-white gap-4">
                          <Loader2 className="animate-spin" size={24} />
                          <span className="text-[9px] font-black uppercase tracking-[0.3em]">Syncing Asset...</span>
                       </div>
                    )}

                    <div className="absolute inset-0 bg-[#0b2b1a]/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-[2px]">
                       <button 
                         type="button"
                         onClick={() => fileInputRef.current?.click()}
                         className="bg-white text-[#0b2b1a] px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all"
                       >
                         {formData.image ? "Replace Narrative Cover" : "Select Visual Asset"}
                       </button>
                    </div>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload}
                    accept="image/*"
                  />
                </div>
              </div>

              {/* Core Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">Registry Index</label>
                    <input 
                      type="text" 
                      value={formData.id}
                      onChange={e => setFormData(prev => ({ ...prev, id: e.target.value }))}
                      className="w-full px-8 py-5 bg-white rounded-2xl border border-gray-100 outline-none font-black text-[#0b2b1a] text-[11px] uppercase tracking-widest shadow-sm"
                      placeholder="e.g. 05"
                    />
                 </div>
                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">Signature Hue</label>
                    <div className="flex gap-4 items-center bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm">
                       <input 
                         type="color" 
                         value={formData.color}
                         onChange={e => setFormData(prev => ({ ...prev, color: e.target.value }))}
                         className="w-10 h-10 rounded-xl border-none p-0 cursor-pointer shadow-sm"
                       />
                       <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{formData.color}</span>
                    </div>
                 </div>
                 <div className="md:col-span-2 space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">Heritage Identity</label>
                    <input 
                      type="text" 
                      value={formData.title}
                      onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-10 py-8 bg-white rounded-[2.5rem] border border-gray-100 outline-none font-black font-playfair text-3xl text-[#0b2b1a] focus:ring-4 focus:ring-[#c81c6a]/5 transition-all shadow-sm"
                      placeholder="e.g. Fresh Heritage"
                      required
                    />
                 </div>
                 <div className="md:col-span-2 space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">Collection Narrative</label>
                    <input 
                      type="text" 
                      value={formData.subtitle}
                      onChange={e => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                      className="w-full px-10 py-6 bg-white rounded-[2rem] border border-gray-100 outline-none font-bold text-[#0b2b1a] shadow-sm italic text-lg"
                      placeholder="e.g. Experience the botanical essence"
                    />
                 </div>
              </div>

              {/* Mobile Content Strategy */}
              <div className="space-y-10 pt-12 border-t border-gray-100/50">
                 <div className="flex items-center gap-4">
                    <div className="w-1 h-8 bg-[#c81c6a] rounded-full" />
                    <h3 className="text-2xl font-black font-playfair text-[#0b2b1a]">Mobile Architecture</h3>
                 </div>
                 
                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c81c6a] ml-1">Editorial Tagline (Headline)</label>
                    <textarea 
                      value={formData.mobileTitle}
                      onChange={e => setFormData(prev => ({ ...prev, mobileTitle: e.target.value }))}
                      className="w-full px-8 py-6 bg-white rounded-[2rem] border border-gray-100 outline-none font-black text-[#0b2b1a] text-xl focus:ring-4 focus:ring-[#c81c6a]/5 transition-all shadow-sm resize-none"
                      rows={3}
                      placeholder="Pure&#10;botanical&#10;refreshment"
                    />
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">Abstract Summary</label>
                        <textarea 
                          value={formData.mobileShortDesc}
                          onChange={e => setFormData(prev => ({ ...prev, mobileShortDesc: e.target.value }))}
                          className="w-full px-8 py-6 bg-white rounded-[2rem] border border-gray-100 outline-none font-bold text-gray-400 text-sm focus:ring-4 focus:ring-[#c81c6a]/5 transition-all shadow-sm resize-none"
                          rows={4}
                          placeholder="Short introductory narrative..."
                        />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">Active Exposition</label>
                        <textarea 
                          value={formData.mobileActiveDesc}
                          onChange={e => setFormData(prev => ({ ...prev, mobileActiveDesc: e.target.value }))}
                          className="w-full px-8 py-6 bg-white rounded-[2rem] border border-gray-100 outline-none font-bold text-gray-400 text-sm focus:ring-4 focus:ring-[#c81c6a]/5 transition-all shadow-sm resize-none"
                          rows={4}
                          placeholder="Deep-dive narrative for active state..."
                        />
                    </div>
                 </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c81c6a] ml-1">Mobile Heritage Backdrop</label>
                    <div className="relative group/mob-hero">
                      <div className="aspect-[3/4] max-w-[240px] rounded-[3rem] bg-white overflow-hidden relative border border-gray-100 shadow-2xl shadow-black/[0.02] group-hover/mob-hero:shadow-black/[0.05] transition-all duration-1000">
                        {formData.mobileHeroImage ? (
                          <img src={formData.mobileHeroImage} alt="Mobile Hero" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-gray-200">
                            <Upload size={32} strokeWidth={1} />
                            <span className="text-[9px] font-black uppercase tracking-[0.3em]">Mobile BG</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-[#0b2b1a]/40 opacity-0 group-hover/mob-hero:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-[2px]">
                          <button 
                            type="button"
                            onClick={() => {
                              (fileInputRef.current as any).pendingType = "mobileHero";
                              fileInputRef.current?.click();
                            }}
                            className="bg-white text-[#0b2b1a] px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all"
                          >
                            Sync Asset
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>

              {/* Desktop Optimization Strategy */}
              <div className="space-y-8 pt-12 border-t border-gray-100/50">
                 <div className="flex items-center gap-4">
                    <div className="w-1 h-8 bg-[#0b2b1a] rounded-full" />
                    <h3 className="text-2xl font-black font-playfair text-[#0b2b1a]">Desktop Focal Point</h3>
                 </div>
                 
                 <div className="space-y-4 max-w-md">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">Featured Showcase Asset</label>
                    <div className="relative group">
                        <select 
                          value={formData.desktopFeaturedProductId}
                          onChange={e => setFormData(prev => ({ ...prev, desktopFeaturedProductId: e.target.value }))}
                          className="w-full px-8 py-5 bg-white rounded-2xl border border-gray-100 outline-none font-black text-[#0b2b1a] text-[11px] uppercase tracking-widest shadow-sm cursor-pointer appearance-none focus:ring-4 focus:ring-[#c81c6a]/5 transition-all"
                        >
                          <option value="">Default Registry (Alpha)</option>
                          {formData.products.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
                           <ChevronRight size={16} className="rotate-90" />
                        </div>
                    </div>
                 </div>
              </div>


              {/* Products Subsection */}
              <div className="space-y-10 pt-12 border-t border-gray-100/50">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-1 h-8 bg-emerald-500 rounded-full" />
                      <h3 className="text-2xl font-black font-playfair text-[#0b2b1a]">Asset Manifest <span className="text-sm font-black text-gray-300 ml-2">({formData.products.length})</span></h3>
                   </div>
                   <button 
                     type="button" 
                     onClick={addProduct}
                     className="px-8 py-4 bg-[#0b2b1a] text-white rounded-2xl hover:bg-[#c81c6a] transition-all duration-500 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-black/5 active:scale-95 group"
                   >
                     <Plus size={16} className="group-hover:rotate-90 transition-transform duration-500" /> New Asset
                   </button>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {formData.products.map((p, idx) => (
                      <motion.div 
                        key={idx} 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-white p-8 rounded-[3rem] border border-gray-100 flex gap-8 group/item hover:shadow-2xl hover:shadow-black/[0.02] transition-all duration-700 relative overflow-hidden"
                      >
                        <div 
                          className="relative w-32 h-32 shrink-0 rounded-[2rem] bg-[#f1f1f2]/30 flex items-center justify-center text-gray-200 border border-gray-50 overflow-hidden group/img cursor-pointer"
                          onClick={() => {
                            setProductUploadingIdx(idx);
                            productFileInputRef.current?.click();
                          }}
                        >
                           {p.image ? (
                             <img src={p.image} className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-700" />
                           ) : (
                             <Camera size={28} strokeWidth={1} />
                           )}
                           <div className="absolute inset-0 bg-[#0b2b1a]/40 opacity-0 group-hover/img:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-[1px]">
                              <Upload size={20} className="text-white" />
                           </div>
                           {productUploadingIdx === idx && (
                             <div className="absolute inset-0 bg-[#0b2b1a]/80 backdrop-blur-md flex flex-col items-center justify-center text-white gap-2">
                                <Loader2 className="animate-spin" size={18} />
                                <span className="text-[7px] font-black uppercase tracking-widest">Syncing</span>
                             </div>
                           )}
                        </div>
                        <div className="flex-1 space-y-4 pt-1">
                           <input 
                             type="text" 
                             value={p.name}
                             onChange={e => {
                               const newProducts = [...formData.products];
                               newProducts[idx].name = e.target.value;
                               setFormData(prev => ({ ...prev, products: newProducts }));
                             }}
                             className="w-full bg-transparent border-none p-0 outline-none font-black font-playfair text-2xl text-[#0b2b1a] placeholder:text-gray-100"
                             placeholder="Asset Identity"
                           />
                           <textarea
                             value={p.description || ""}
                             onChange={e => {
                               const newProducts = [...formData.products];
                               newProducts[idx].description = e.target.value;
                               setFormData(prev => ({ ...prev, products: newProducts }));
                             }}
                             className="w-full bg-gray-50/50 rounded-2xl px-6 py-4 border border-gray-100 outline-none text-[12px] font-bold text-gray-400 resize-none focus:ring-4 focus:ring-[#c81c6a]/5 transition-all shadow-inner leading-relaxed"
                             rows={2}
                             placeholder="Describe the botanical essence..."
                           />
                           <div className="flex items-center gap-4">
                             <p className="text-[9px] text-[#c81c6a] font-black uppercase tracking-[0.3em] bg-[#c81c6a]/5 px-4 py-2 rounded-full border border-[#c81c6a]/10">ID: {p.id}</p>
                           </div>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                          <button 
                            type="button"
                            onClick={() => removeProduct(idx)}
                            className="p-5 text-gray-200 hover:text-red-500 hover:bg-red-50 rounded-3xl transition-all duration-500 opacity-0 group-hover/item:opacity-100"
                          >
                            <Trash2 size={20} strokeWidth={1.5} />
                          </button>
                        </div>
                      </motion.div>
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
            <div className="p-10 bg-white border-t border-gray-100/50 flex gap-6">
              <button 
                type="button" 
                onClick={onClose}
                className="flex-1 py-6 rounded-[2rem] bg-gray-50 text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] hover:bg-gray-100 hover:text-[#0b2b1a] transition-all duration-500"
              >
                Discard Edits
              </button>
              <button 
                type="button"
                onClick={handleSave}
                disabled={saving || !formData.title}
                className="flex-[2] py-6 rounded-[2rem] bg-[#0b2b1a] text-white font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl shadow-[#0b2b1a]/20 hover:bg-[#c81c6a] hover:scale-105 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-4 transition-all duration-700"
              >
                {saving ? (
                   <div className="flex items-center gap-4">
                      <Loader2 className="animate-spin" size={18} />
                      <span>Syncing Vault...</span>
                   </div>
                ) : (
                  <>
                    <Save size={18} strokeWidth={2.5} /> Commit Heritage
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
