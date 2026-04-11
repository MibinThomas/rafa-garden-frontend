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
            className="fixed inset-0 bg-[#0b2b1a]/40 backdrop-blur-sm z-[100]"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-screen w-full max-w-3xl bg-white shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black font-playfair text-[#0b2b1a]">
                  {post ? "Edit Heritage Post" : "Draft New Narrative"}
                </h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Cinematic Storytelling & Botanical Insights</p>
              </div>
              <button onClick={onClose} className="p-3 rounded-2xl bg-gray-50 text-gray-400 hover:bg-gray-100 transition-all">
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">

              {/* Featured Image */}
              <div className="relative group">
                <div className="aspect-video rounded-[2.5rem] bg-gray-100 overflow-hidden relative border-2 border-dashed border-gray-200 group-hover:border-[#c81c6a]/30 transition-colors">
                  {formData.image ? (
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-gray-300">
                      <ImageIcon size={32} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Featured Narrative Asset</span>
                    </div>
                  )}

                  {uploading && (
                    <div className="absolute inset-0 bg-[#0b2b1a]/60 backdrop-blur-sm flex items-center justify-center text-white gap-3">
                      <Loader2 className="animate-spin" size={20} />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Processing Asset...</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-white text-[#0b2b1a] px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl"
                    >
                      {formData.image ? "Replace Image" : "Select Image"}
                    </button>
                  </div>
                </div>
                <input type="file" className="hidden" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" />
              </div>

              {/* Title & Slug */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Narrative Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={handleTitleChange}
                    className="w-full px-6 py-5 bg-gray-50 rounded-2xl border-none outline-none font-black font-playfair text-3xl text-[#0b2b1a] focus:ring-2 focus:ring-[#c81c6a]/20 transition-all"
                    placeholder="The Essence of Botanical Wisdom"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-2"><Globe size={12} /> URL Slug</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      className="w-full px-5 py-3 bg-gray-50 rounded-xl outline-none text-[11px] font-bold text-[#0b2b1a]"
                      placeholder="essence-of-wisdom"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-2"><Tag size={12} /> Category</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-5 py-3 bg-gray-50 rounded-xl outline-none text-[11px] font-bold text-[#0b2b1a]"
                      placeholder="Garden Sage"
                    />
                  </div>
                </div>
              </div>

              {/* Excerpt & Content */}
              <div className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-2"><FileText size={12} /> Cinematic Subtitle</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={e => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                    className="w-full px-6 py-4 bg-gray-50 rounded-xl outline-none text-sm font-bold text-[#0b2b1a]"
                    placeholder="Short poetic hook..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-2"><Type size={12} /> Excerpt (Card Summary)</label>
                  <textarea
                    value={formData.excerpt}
                    onChange={e => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    rows={3}
                    className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none text-ms font-medium text-gray-600 leading-relaxed active:ring-1 active:ring-[#c81c6a]/20"
                    placeholder="A brief summary for the blog listing page..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-2"><FileText size={12} /> Full Narrative Content</label>
                  <textarea
                    value={formData.content}
                    onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    rows={12}
                    className="w-full px-8 py-8 bg-gray-50 rounded-[2.5rem] outline-none text-base font-inter font-light text-gray-800 leading-[1.8] custom-scrollbar"
                    placeholder="Write the full story here..."
                  />
                </div>
              </div>

              {/* Metadata & Polish */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-gray-50">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-300 ml-1 flex items-center gap-2"><Calendar size={10} /> Post Date</label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none text-[10px] font-bold text-[#0b2b1a]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-300 ml-1 flex items-center gap-2"><Clock size={10} /> Read Time</label>
                  <input
                    type="text"
                    value={formData.readingTime}
                    onChange={e => setFormData(prev => ({ ...prev, readingTime: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none text-[10px] font-bold text-[#0b2b1a]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-300 ml-1 flex items-center gap-2"><Palette size={10} /> Accent</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={formData.accentColor}
                      onChange={e => setFormData(prev => ({ ...prev, accentColor: e.target.value }))}
                      className="w-8 h-8 rounded-lg border-none p-0 cursor-pointer overflow-hidden"
                    />
                    <span className="text-[9px] font-black text-gray-400">{formData.accentColor}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-300 ml-1 flex items-center gap-2"> Status</label>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, isPublished: !prev.isPublished }))}
                    className={`w-full py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${formData.isPublished ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}
                  >
                    {formData.isPublished ? "Published" : "Draft"}
                  </button>
                </div>
              </div>

            </form>

            {/* Footer */}
            <div className="p-8 bg-gray-50/50 border-t border-gray-50 flex gap-4">
              <button onClick={onClose} className="flex-1 py-5 rounded-2xl bg-white border border-gray-100 text-[#0b2b1a] font-black text-[10px] uppercase tracking-widest">
                Discard
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !formData.title || !formData.slug}
                className="flex-[2] py-5 rounded-2xl bg-[#0b2b1a] text-white font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3"
              >
                {saving ? <Loader2 className="animate-spin" size={16} /> : <><Save size={16} /> Save Narrative</>}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
