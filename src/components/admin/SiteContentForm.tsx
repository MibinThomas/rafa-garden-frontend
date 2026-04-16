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
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black font-playfair text-[#0b2b1a] capitalize">
                  Edit {group} Content
                </h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Manage site-wide assets and text</p>
              </div>
              <button 
                onClick={onClose}
                className="p-3 rounded-2xl bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-[#0b2b1a] transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
              {loading ? (
                <div className="py-20 text-center">
                  <Loader2 className="animate-spin inline-block text-[#c81c6a] mb-4" size={32} />
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Fetching Content...</p>
                </div>
              ) : content.length === 0 ? (
                <div className="py-20 text-center">
                  <p className="text-gray-400 font-bold">No editable fields found for this group.</p>
                </div>
              ) : (
                content.map((item) => (
                  <div key={item.key} className="space-y-3">
                    <div className="flex justify-between items-end">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                        {item.label || item.key.split('.').pop()?.replace(/_/g, ' ')}
                      </label>
                      {item.maxLength && (
                        <span className={cn(
                          "text-[9px] font-bold uppercase tracking-tight mr-1",
                          item.value.length > item.maxLength ? "text-red-500" : "text-gray-300"
                        )}>
                          {item.value.length} / {item.maxLength} chars
                        </span>
                      )}
                    </div>

                    {item.hint && (
                      <p className="text-[9px] font-bold text-[#c81c6a] uppercase tracking-wider ml-1 -mt-1 opacity-70">
                        {item.hint}
                      </p>
                    )}
                    
                    {item.type === "image" || item.type === "font" ? (
                      <div className="relative group">
                        <div className="aspect-video rounded-3xl bg-gray-50 border-2 border-dashed border-gray-100 flex items-center justify-center overflow-hidden">
                          {item.value ? (
                            item.type === "font" ? (
                               <div className="text-center font-bold text-[#0b2b1a] text-xs">
                                  <span className="bg-[#c81c6a]/10 text-[#c81c6a] px-3 py-1 rounded-full break-all max-w-[80%] inline-block">
                                    {item.value.split('/').pop()}
                                  </span>
                                  <p className="mt-2 text-gray-400">Font Currently Active</p>
                               </div>
                            ) : (
                               <img src={item.value} className="w-full h-full object-cover" />
                            )
                          ) : (
                            <Upload size={24} className="text-gray-200" />
                          )}
                          
                          {uploadingKey === item.key && (
                            <div className="absolute inset-0 bg-[#0b2b1a]/60 backdrop-blur-sm flex items-center justify-center text-white gap-3">
                              <Loader2 className="animate-spin" size={20} />
                            </div>
                          )}

                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button 
                              type="button"
                              onClick={() => {
                                (fileInputRef.current as any).pendingKey = item.key;
                                fileInputRef.current?.click();
                              }}
                              className="bg-white text-[#0b2b1a] px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest"
                            >
                              Upload {item.type === "font" ? "Font File" : "Image"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : item.value.length > 50 ? (
                      <textarea 
                        value={item.value}
                        onChange={e => handleInputChange(item.key, e.target.value)}
                        rows={4}
                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-[#0b2b1a] focus:ring-2 focus:ring-[#c81c6a]/20 transition-all resize-none"
                      />
                    ) : (
                      <input 
                        type="text" 
                        value={item.value}
                        onChange={e => handleInputChange(item.key, e.target.value)}
                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-[#0b2b1a] focus:ring-2 focus:ring-[#c81c6a]/20 transition-all"
                      />
                    )}
                  </div>
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

            <div className="p-8 bg-gray-50/50 border-t border-gray-50 flex gap-4">
              <button 
                type="button" 
                onClick={onClose}
                className="flex-1 py-5 rounded-2xl bg-white border border-gray-100 text-[#0b2b1a] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-gray-100 transition-all"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleSave}
                disabled={saving || loading}
                className="flex-[2] py-5 rounded-2xl bg-[#0b2b1a] text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:brightness-110 disabled:opacity-50 flex items-center justify-center gap-3 transition-all"
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin" size={16} /> Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} /> Update Content
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
