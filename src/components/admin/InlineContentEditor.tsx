"use client";

import React, { useState, useEffect, useRef } from "react";
import { Upload, Save, Loader2, Info } from "lucide-react";
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

interface InlineContentEditorProps {
  group: string;
  onSave?: () => void;
}

export function InlineContentEditor({ group, onSave }: InlineContentEditorProps) {
  const [content, setContent] = useState<SiteContent[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const fetchContent = async () => {
    setLoading(true);
    try {
      const contentRes = await fetch(`/api/content?group=${group}`);
      const contentData = await contentRes.json();
      setContent(contentData);

      if (group === "shop") {
        const catRes = await fetch("/api/categories");
        const catData = await catRes.json();
        setCategories(catData);
      }
    } catch (error) {
      console.error("Failed to fetch site content:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [group]);


  const handleInputChange = (key: string, value: string) => {
    setContent(prev => prev.map(item => item.key === key ? { ...item, value } : item));
  };

  const handleImageUpload = async (key: string, e: React.ChangeEvent<HTMLInputElement>, isCategory: boolean = false, categoryId?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingKey(isCategory ? `${categoryId}_img` : key);
    try {
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: "POST",
        body: file,
      });

      if (!response.ok) throw new Error("Upload failed");

      const blob = await response.json();
      
      if (isCategory && categoryId) {
        setCategories(prev => prev.map(c => c.id === categoryId ? { ...c, mobileHeroImage: blob.url } : c));
      } else {
        handleInputChange(key, blob.url);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image.");
    } finally {
      setUploadingKey(null);
    }
  };


  const handleSave = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      // 1. Save Site Content
      const contentResponse = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });

      if (!contentResponse.ok) throw new Error("Site content save failed");

      // 2. Save Categories if in shop mode
      if (group === "shop") {
        for (const cat of categories) {
          const catRes = await fetch("/api/categories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cat),
          });
          if (!catRes.ok) throw new Error(`Category ${cat.title} save failed`);
        }
      }

      if (onSave) onSave();
      alert("All changes updated successfully!");
    } catch (error: any) {
      console.error("Save error:", error);
      alert(`Failed to save: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return (
      <div className="bg-white rounded-[2.5rem] border border-gray-100 p-20 text-center shadow-sm">
        <Loader2 className="animate-spin inline-block text-[#c81c6a] mb-4" size={32} />
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Syncing repository...</p>
      </div>
    );
  }

  if (content.length === 0) {
    return (
      <div className="bg-white rounded-[2.5rem] border border-gray-100 p-20 text-center shadow-sm">
        <Info className="inline-block text-gray-200 mb-4" size={48} />
        <p className="text-gray-400 font-bold">No editable fields found for this section.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-10 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
        <div>
          <h2 className="text-2xl font-black font-playfair text-[#0b2b1a] capitalize">
            {group} Content Options
          </h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Update values and press save to sync</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-3 bg-[#0b2b1a] text-white px-8 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <form onSubmit={handleSave} className="p-10 space-y-12">
        {/* Global Group Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {content.map((item) => (
            <div key={item.key} className="space-y-3">
              <div className="flex justify-between items-end">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                  {item.label || item.key.split('.').pop()?.replace(/_/g, ' ')}
                </label>
                {item.maxLength && (
                  <span className={cn(
                    "text-[9px] font-bold uppercase tracking-tight mr-1",
                    item.value.length > (item.maxLength || 0) ? "text-red-500" : "text-gray-300"
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
                        <div className="text-center font-bold text-[#0b2b1a] text-xs px-4">
                            <span className="bg-[#c81c6a]/10 text-[#c81c6a] px-3 py-1 rounded-full break-all inline-block">
                              {item.value.split('/').pop()}
                            </span>
                            <p className="mt-2 text-gray-400">Font Active</p>
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
                          (fileInputRef.current as any).isCategory = false;
                          fileInputRef.current?.click();
                        }}
                        className="bg-white text-[#0b2b1a] px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg"
                      >
                        Upload {item.type === "font" ? "Font" : "Image"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : item.value.length > 50 || item.key.includes('description') || item.key.includes('content') ? (
                <textarea 
                  value={item.value}
                  onChange={e => handleInputChange(item.key, e.target.value)}
                  rows={4}
                  className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-[#0b2b1a] focus:ring-2 focus:ring-[#c81c6a]/20 transition-all resize-none text-sm"
                />
              ) : (
                <input 
                  type="text" 
                  value={item.value}
                  onChange={e => handleInputChange(item.key, e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-[#0b2b1a] focus:ring-2 focus:ring-[#c81c6a]/20 transition-all text-sm"
                />
              )}
            </div>
          ))}
        </div>

        {/* Category Overrides Section (Shop Only) */}
        {group === "shop" && categories.length > 0 && (
          <div className="space-y-10 pt-10 border-t border-gray-100">
            <div>
              <h3 className="text-xl font-black font-playfair text-[#0b2b1a]">Category Specific Overrides</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Customizations for individual heritage collections</p>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {categories.map((cat) => (
                <div key={cat.id} className="bg-gray-50/50 p-8 rounded-[2rem] border border-gray-100 space-y-6">
                  <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[10px] font-black" style={{ color: cat.color, border: `2px solid ${cat.color}20` }}>
                      {cat.id}
                    </div>
                    <h4 className="font-black text-[#0b2b1a] text-lg">{cat.title}</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Mobile Hero Background Asset</label>
                      <div className="relative group/mob-hero max-w-[240px]">
                        <div className="aspect-[3/4] rounded-2xl bg-white border-2 border-dashed border-gray-200 group-hover/mob-hero:border-[#c81c6a]/30 transition-colors overflow-hidden relative">
                          {cat.mobileHeroImage ? (
                            <img src={cat.mobileHeroImage} alt="Mobile Hero" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-300">
                              <Upload size={20} />
                              <span className="text-[8px] font-black uppercase tracking-widest text-center px-4 leading-tight">Drop Mobile<br/>Background</span>
                            </div>
                          )}
                          
                          {uploadingKey === `${cat.id}_img` && (
                            <div className="absolute inset-0 bg-[#0b2b1a]/60 backdrop-blur-sm flex items-center justify-center text-white">
                              <Loader2 className="animate-spin" size={16} />
                            </div>
                          )}

                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/mob-hero:opacity-100 transition-opacity flex items-center justify-center">
                            <button 
                              type="button"
                              onClick={() => {
                                (fileInputRef.current as any).pendingKey = cat.id;
                                (fileInputRef.current as any).isCategory = true;
                                fileInputRef.current?.click();
                              }}
                              className="bg-white text-[#0b2b1a] px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest"
                            >
                              Change Asset
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Hero Featured Product</label>
                        <select 
                          value={cat.desktopFeaturedProductId || ""}
                          onChange={e => {
                            const val = e.target.value;
                            setCategories(prev => prev.map(c => c.id === cat.id ? { ...c, desktopFeaturedProductId: val } : c));
                          }}
                          className="w-full px-6 py-4 bg-white rounded-xl border border-gray-100 outline-none font-bold text-[#0b2b1a] focus:ring-2 focus:ring-[#c81c6a]/20 transition-all cursor-pointer appearance-none text-sm"
                        >
                          <option value="">Default (First Product)</option>
                          {cat.products?.map((p: any) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="p-5 bg-white rounded-2xl border border-gray-100">
                         <p className="text-[8px] font-black uppercase tracking-[0.1em] text-gray-300 mb-2">Category Overview</p>
                         <p className="text-[10px] font-bold text-gray-500 leading-relaxed italic">
                           "{cat.subtitle || "No subtitle provided"}"
                         </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </form>


      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={(e) => {
          const key = (fileInputRef.current as any).pendingKey;
          const isCategory = (fileInputRef.current as any).isCategory;
          if (key) handleImageUpload(key, e, isCategory, isCategory ? key : undefined);
        }}
        accept="image/*, .woff, .woff2, .ttf, .otf"
      />

    </div>
  );
}
