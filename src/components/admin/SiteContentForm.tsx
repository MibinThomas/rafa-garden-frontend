"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Upload, Save, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SiteContent {
  key: string;
  value: string;
  type: "text" | "image" | "json" | "font";
  group: string;
  label?: string;
  hint?: string;
  maxLength?: number;
}

interface SiteContentFormProps {
  isOpen: boolean;
  onClose: () => void;
  group: string;
  onSave: () => void;
}

export function SiteContentForm({ isOpen, onClose, group, onSave }: SiteContentFormProps) {
  const [content, setContent] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/content?group=${group}`);
      const data = await res.json();
      setContent(data);
    } catch (error) {
      console.error("Failed to fetch site content:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchContent();
    }
  }, [isOpen, group]);

  const handleInputChange = (key: string, value: string) => {
    setContent(prev => prev.map(item => item.key === key ? { ...item, value } : item));
  };

  const handleImageUpload = async (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingKey(key);
    try {
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: "POST",
        body: file,
      });

      if (!response.ok) throw new Error("Upload failed");

      const blob = await response.json();
      handleInputChange(key, blob.url);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image.");
    } finally {
      setUploadingKey(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });

      if (!response.ok) throw new Error("Save failed");

      onSave();
      onClose();
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save site content.");
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
            className="fixed right-0 top-0 h-screen w-full max-w-2xl bg-white shadow-2xl z-[101] flex flex-col"
          >
            <div className="p-10 border-b border-gray-100/50 flex items-center justify-between bg-white/80 backdrop-blur-xl">
              <div>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[#c81c6a] font-black text-[9px] uppercase tracking-[0.4em] mb-2"
                >
                  Global Registry
                </motion.p>
                <h2 className="text-4xl font-black font-playfair text-[#0b2b1a] capitalize">
                  {group} <span className="italic font-normal">Vault</span>
                </h2>
              </div>
              <button 
                onClick={onClose}
                className="p-4 rounded-2xl bg-white text-gray-300 hover:text-[#0b2b1a] transition-all duration-500 shadow-xl shadow-black/5 hover:scale-110 active:scale-95 border border-gray-50"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar bg-[#f1f1f2]/30">
              {loading ? (
                <div className="py-32 text-center">
                  <div className="relative inline-block w-16 h-16 mb-6">
                    <div className="absolute inset-0 border-4 border-gray-100 rounded-full" />
                    <div className="absolute inset-0 border-4 border-[#c81c6a] border-t-transparent rounded-full animate-spin" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#5d5f61] animate-pulse">Fetching Repository Assets...</p>
                </div>
              ) : content.length === 0 ? (
                <div className="py-32 text-center">
                  <p className="text-gray-300 font-black uppercase tracking-widest text-[11px]">No editable narratives found.</p>
                </div>
              ) : (
                content.map((item, idx) => (
                  <motion.div 
                    key={item.key} 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="space-y-4"
                  >
                    <div className="flex justify-between items-end px-1">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                        {item.label || item.key.split('.').pop()?.replace(/_/g, ' ')}
                      </label>
                      {item.maxLength && (
                        <span className={cn(
                          "text-[9px] font-black uppercase tracking-widest",
                          item.value.length > item.maxLength ? "text-[#c81c6a]" : "text-gray-300"
                        )}>
                          {item.value.length} / {item.maxLength}
                        </span>
                      )}
                    </div>

                    {item.hint && (
                      <p className="text-[9px] font-bold text-[#c81c6a] uppercase tracking-widest px-1 opacity-60 italic">
                        * {item.hint}
                      </p>
                    )}
                    
                    {item.type === "image" || item.type === "font" ? (
                      <div className="relative group">
                        <div className="aspect-[21/9] rounded-[2.5rem] bg-white border border-gray-100 flex items-center justify-center overflow-hidden shadow-2xl shadow-black/[0.02] group-hover:shadow-black/[0.05] transition-all duration-700">
                          {item.value ? (
                            item.type === "font" ? (
                               <div className="text-center font-bold text-[#0b2b1a] text-xs px-10">
                                  <span className="bg-[#0b2b1a] text-white px-6 py-3 rounded-2xl break-all inline-block shadow-xl text-[10px] font-black uppercase tracking-widest">
                                    {item.value.split('/').pop()}
                                  </span>
                                  <p className="mt-4 text-[10px] font-black text-gray-300 uppercase tracking-widest">Botanical Font Registry Active</p>
                               </div>
                            ) : (
                               <img src={item.value} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                            )
                          ) : (
                            <Upload size={32} strokeWidth={1} className="text-gray-100" />
                          )}
                          
                          {uploadingKey === item.key && (
                            <div className="absolute inset-0 bg-[#0b2b1a]/80 backdrop-blur-md flex flex-col items-center justify-center text-white gap-4">
                              <Loader2 className="animate-spin" size={24} />
                              <span className="text-[9px] font-black uppercase tracking-[0.3em]">Syncing Asset...</span>
                            </div>
                          )}

                          <div className="absolute inset-0 bg-[#0b2b1a]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[2px]">
                            <button 
                              type="button"
                              onClick={() => {
                                (fileInputRef.current as any).pendingKey = item.key;
                                fileInputRef.current?.click();
                              }}
                              className="bg-white text-[#0b2b1a] px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all"
                            >
                              Replace {item.type === "font" ? "Font File" : "Visual Asset"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : item.value.length > 80 ? (
                      <textarea 
                        value={item.value}
                        onChange={e => handleInputChange(item.key, e.target.value)}
                        rows={5}
                        className="w-full px-8 py-6 bg-white rounded-[2rem] border border-gray-100 outline-none font-bold text-[#0b2b1a] focus:ring-4 focus:ring-[#c81c6a]/5 transition-all resize-none shadow-2xl shadow-black/[0.02] text-sm leading-relaxed"
                      />
                    ) : (
                      <input 
                        type="text" 
                        value={item.value}
                        onChange={e => handleInputChange(item.key, e.target.value)}
                        className="w-full px-8 py-6 bg-white rounded-[2rem] border border-gray-100 outline-none font-bold text-[#0b2b1a] focus:ring-4 focus:ring-[#c81c6a]/5 transition-all shadow-2xl shadow-black/[0.02] text-sm"
                      />
                    )}
                  </motion.div>
                ))
              )}
              
              <input 
                type="file" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={(e) => {
                  const key = (fileInputRef.current as any).pendingKey;
                  if (key) handleImageUpload(key, e);
                }}
                accept="image/*, .woff, .woff2, .ttf, .otf"
              />
            </form>

            <div className="p-10 bg-white border-t border-gray-100/50 flex gap-6">
              <button 
                type="button" 
                onClick={onClose}
                className="flex-1 py-6 rounded-[2rem] bg-gray-50 text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] hover:bg-gray-100 hover:text-[#0b2b1a] transition-all duration-500"
              >
                Discard
              </button>
              <button 
                type="button"
                onClick={handleSave}
                disabled={saving || loading}
                className="flex-[2] py-6 rounded-[2rem] bg-[#0b2b1a] text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-[#0b2b1a]/20 hover:bg-[#c81c6a] hover:scale-105 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-4 transition-all duration-500"
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin" size={18} /> Syncing Vault...
                  </>
                ) : (
                  <>
                    <Save size={18} strokeWidth={2.5} /> Commit Changes
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
