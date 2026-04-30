"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Upload, Save, Loader2, Type, FileText, Image as ImageIcon, Calendar, Clock, Tag, Globe, Palette } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BlogFormProps {
  isOpen: boolean;
  onClose: () => void;
  post: any | null;
  onSave: () => void;
}

export function BlogForm({ isOpen, onClose, post, onSave }: BlogFormProps) {
  const [formData, setFormData] = useState({
    id: "",
    slug: "",
    title: "",
    subtitle: "",
    excerpt: "",
    content: "",
    image: "",
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' }),
    readingTime: "5 min read",
    category: "Heritage",
    accentColor: "#c81c6a",
    isPublished: true
  });

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (post) {
      setFormData({
        id: post.id || "",
        slug: post.slug || "",
        title: post.title || "",
        subtitle: post.subtitle || "",
        excerpt: post.excerpt || "",
        content: post.content || "",
        image: post.image || "",
        date: post.date || "",
        readingTime: post.readingTime || "5 min read",
        category: post.category || "Heritage",
        accentColor: post.accentColor || "#c81c6a",
        isPublished: post.isPublished !== undefined ? post.isPublished : true
      });
    } else {
      setFormData({
        id: `blog-${Date.now()}`,
        slug: "",
        title: "",
        subtitle: "",
        excerpt: "",
        content: "",
        image: "",
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' }),
        readingTime: "5 min read",
        category: "Heritage",
        accentColor: "#c81c6a",
        isPublished: true
      });
    }
  }, [post, isOpen]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setFormData(prev => ({ ...prev, title, slug: post ? prev.slug : slug }));
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
      setFormData(prev => ({ ...prev, image: blob.url }));
    } catch (error: any) {
      console.error("Upload error:", error);
      alert(`Upload Failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          oldId: post?.id
        }),
      });

      if (!response.ok) throw new Error("Save failed");

      onSave();
      onClose();
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save post.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#5d5f61]/40 backdrop-blur-sm z-[100]"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-screen w-full max-w-3xl bg-white shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="p-10 border-b border-gray-100/50 flex items-center justify-between bg-white/80 backdrop-blur-xl">
              <div>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[#c81c6a] font-black text-[9px] uppercase tracking-[0.4em] mb-2"
                >
                  Cinematic Narrative
                </motion.p>
                <h2 className="text-4xl font-black font-playfair text-[#5d5f61]">
                  {post ? "Refine" : "Draft"} <span className="italic font-normal">Story</span>
                </h2>
              </div>
              <button 
                onClick={onClose} 
                className="p-4 rounded-2xl bg-white text-gray-300 hover:text-[#5d5f61] transition-all duration-500 shadow-xl shadow-black/5 hover:scale-110 active:scale-95 border border-gray-50"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar bg-[#f1f1f2]/30">

              {/* Featured Image */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">Hero Asset</label>
                <div className="relative group">
                  <div className="aspect-video rounded-[3rem] bg-white overflow-hidden relative border border-gray-100 shadow-2xl shadow-black/[0.02] group-hover:shadow-black/[0.05] transition-all duration-1000">
                    {formData.image ? (
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-gray-200">
                        <div className="w-20 h-20 rounded-[2.5rem] bg-gray-50 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-700">
                           <ImageIcon size={32} strokeWidth={1} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Cinematic Visual Asset</span>
                      </div>
                    )}

                    {uploading && (
                      <div className="absolute inset-0 bg-[#5d5f61]/80 backdrop-blur-md flex flex-col items-center justify-center text-white gap-4">
                        <Loader2 className="animate-spin" size={24} />
                        <span className="text-[9px] font-black uppercase tracking-[0.3em]">Processing Asset...</span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-[#5d5f61]/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-[2px]">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-white text-[#5d5f61] px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all"
                      >
                        {formData.image ? "Replace Narrative Asset" : "Select Visual Asset"}
                      </button>
                    </div>
                  </div>
                  <input type="file" className="hidden" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" />
                </div>
              </div>

              {/* Title & Slug */}
              <div className="space-y-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">Narrative Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={handleTitleChange}
                    className="w-full px-10 py-8 bg-white rounded-[2.5rem] border border-gray-100 outline-none font-black font-playfair text-4xl text-[#5d5f61] focus:ring-4 focus:ring-[#c81c6a]/5 transition-all shadow-sm placeholder:text-gray-100"
                    placeholder="The Essence of Botanical Wisdom"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1 flex items-center gap-3"><Globe size={14} className="text-[#c81c6a]" /> URI Identity</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      className="w-full px-8 py-5 bg-white rounded-[1.5rem] border border-gray-100 outline-none text-[11px] font-black uppercase tracking-widest text-[#5d5f61] shadow-sm"
                      placeholder="essence-of-wisdom"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1 flex items-center gap-3"><Tag size={14} className="text-[#c81c6a]" /> Collection</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-8 py-5 bg-white rounded-[1.5rem] border border-gray-100 outline-none text-[11px] font-black uppercase tracking-widest text-[#5d5f61] shadow-sm"
                      placeholder="Garden Sage"
                    />
                  </div>
                </div>
              </div>

              {/* Excerpt & Content */}
              <div className="space-y-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1 flex items-center gap-3"><FileText size={14} className="text-[#c81c6a]" /> Poetic Subtitle</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={e => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                    className="w-full px-8 py-5 bg-white rounded-[1.5rem] border border-gray-100 outline-none text-sm font-bold text-[#5d5f61] shadow-sm italic"
                    placeholder="Short poetic hook..."
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1 flex items-center gap-3"><Type size={14} className="text-[#c81c6a]" /> Abstract Summary</label>
                  <textarea
                    value={formData.excerpt}
                    onChange={e => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    rows={3}
                    className="w-full px-8 py-6 bg-white rounded-[2rem] border border-gray-100 outline-none text-[13px] font-bold text-gray-400 leading-relaxed focus:ring-4 focus:ring-[#c81c6a]/5 transition-all shadow-sm resize-none"
                    placeholder="A brief summary for the editorial archive..."
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1 flex items-center gap-3"><FileText size={14} className="text-[#c81c6a]" /> Narrative Manuscript</label>
                  <textarea
                    value={formData.content}
                    onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    rows={15}
                    className="w-full px-10 py-10 bg-white rounded-[3rem] border border-gray-100 outline-none text-base font-inter font-light text-[#5d5f61] leading-[1.8] shadow-sm custom-scrollbar"
                    placeholder="Write the full cinematic story here..."
                  />
                </div>
              </div>

              {/* Metadata & Polish */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-10 border-t border-gray-100/50">
                <div className="space-y-3">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300 ml-1 flex items-center gap-2"><Calendar size={12} /> Chronicle Date</label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-5 py-4 bg-white rounded-xl border border-gray-100 outline-none text-[10px] font-black uppercase tracking-widest text-[#5d5f61] shadow-sm"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300 ml-1 flex items-center gap-2"><Clock size={12} /> Narrative Length</label>
                  <input
                    type="text"
                    value={formData.readingTime}
                    onChange={e => setFormData(prev => ({ ...prev, readingTime: e.target.value }))}
                    className="w-full px-5 py-4 bg-white rounded-xl border border-gray-100 outline-none text-[10px] font-black uppercase tracking-widest text-[#5d5f61] shadow-sm"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300 ml-1 flex items-center gap-2"><Palette size={12} /> Signature Color</label>
                  <div className="flex gap-3 items-center bg-white px-4 py-3 rounded-xl border border-gray-100 shadow-sm">
                    <input
                      type="color"
                      value={formData.accentColor}
                      onChange={e => setFormData(prev => ({ ...prev, accentColor: e.target.value }))}
                      className="w-6 h-6 rounded-md border-none p-0 cursor-pointer overflow-hidden shadow-sm"
                    />
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{formData.accentColor}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300 ml-1 flex items-center gap-2"> Visibility Status</label>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, isPublished: !prev.isPublished }))}
                    className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 shadow-sm border ${formData.isPublished ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-gray-50 border-gray-100 text-gray-400"}`}
                  >
                    {formData.isPublished ? "Live Repository" : "Private Draft"}
                  </button>
                </div>
              </div>

            </form>

            {/* Footer */}
            <div className="p-10 bg-white border-t border-gray-100/50 flex gap-6">
              <button 
                onClick={onClose} 
                className="flex-1 py-6 rounded-[2rem] bg-gray-50 text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] hover:bg-gray-100 hover:text-[#5d5f61] transition-all duration-500"
              >
                Discard Manuscript
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !formData.title || !formData.slug}
                className="flex-[2] py-6 rounded-[2rem] bg-[#5d5f61] text-white font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl shadow-[#5d5f61]/20 hover:bg-[#c81c6a] hover:scale-105 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-4 transition-all duration-700"
              >
                {saving ? (
                   <div className="flex items-center gap-4">
                      <Loader2 className="animate-spin" size={18} />
                      <span>Syncing Vault...</span>
                   </div>
                ) : (
                  <>
                    <Save size={18} strokeWidth={2.5} /> Commit Narrative
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
