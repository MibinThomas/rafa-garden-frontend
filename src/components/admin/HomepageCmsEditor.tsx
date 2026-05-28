"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Upload, Save, Loader2, Info, ArrowUp, ArrowDown, 
  Smartphone, Tablet, Monitor, CheckCircle2, AlertTriangle, Eye, EyeOff, Plus, Trash2, Check, RotateCcw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Sub-tabs list
type SubTab = "hero" | "categories" | "features" | "series" | "settings";
type PreviewMode = "mobile" | "tablet" | "desktop";

export function HomepageCmsEditor() {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("hero");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("mobile");
  const [showPreview, setShowPreview] = useState(true);
  
  // CMS State
  const [config, setConfig] = useState<any>(null);
  const [originalConfig, setOriginalConfig] = useState<any>(null);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  // Upload State
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Drag state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Fetch Homepage Config
  const fetchHomepageData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/homepage");
      if (res.ok) {
        const data = await res.json();
        setConfig(data.draft);
        setOriginalConfig(data.published);
        setCategoriesList(data.categories || []);
      } else {
        throw new Error("Failed to load content data");
      }
    } catch (error: any) {
      console.error("Fetch homepage config error:", error);
      setMessage({ type: "error", text: `Error loading content: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomepageData();
  }, []);

  const handleInputChange = (section: string, key: string, value: any) => {
    setConfig((prev: any) => {
      if (section === "root") {
        return { ...prev, [key]: value };
      }
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [key]: value
        }
      };
    });
  };

  // Helper to trigger alert message
  const triggerMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  // Upload Asset
  const handleAssetUpload = async (e: React.ChangeEvent<HTMLInputElement>, uploadTarget: { type: string; id?: string | number; index?: number }) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const targetKey = uploadTarget.id ? `${uploadTarget.type}_${uploadTarget.id}` : uploadTarget.type;
    setUploadingField(targetKey);

    try {
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: "POST",
        body: file,
      });

      if (!response.ok) throw new Error("Upload failed");
      const blob = await response.json();

      // Update state based on target
      if (uploadTarget.type === "hero_image") {
        handleInputChange("hero", "image", blob.url);
      } else if (uploadTarget.type === "category_image" && uploadTarget.index !== undefined) {
        const updatedCats = [...config.categories];
        updatedCats[uploadTarget.index].image = blob.url;
        setConfig((prev: any) => ({ ...prev, categories: updatedCats }));
      } else if (uploadTarget.type === "feature_icon" && uploadTarget.index !== undefined) {
        const updatedFeats = [...config.features];
        updatedFeats[uploadTarget.index].icon = blob.url;
        setConfig((prev: any) => ({ ...prev, features: updatedFeats }));
      } else if (uploadTarget.type === "setting_image" && uploadTarget.id) {
        setConfig((prev: any) => ({
          ...prev,
          settings: {
            ...prev.settings,
            [uploadTarget.id as string]: blob.url
          }
        }));
      }

      triggerMessage("success", "Asset uploaded and synced successfully!");
    } catch (err: any) {
      console.error(err);
      triggerMessage("error", `Upload failed: ${err.message}`);
    } finally {
      setUploadingField(null);
    }
  };

  // Save Draft (PUT)
  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config)
      });

      if (!res.ok) throw new Error("Failed to save draft");
      triggerMessage("success", "Draft configuration saved successfully!");
    } catch (err: any) {
      triggerMessage("error", err.message || "Failed to save draft");
    } finally {
      setSaving(false);
    }
  };

  // Publish Live (POST)
  const handlePublishLive = async () => {
    // Validate required fields
    if (!config.hero.title || !config.hero.description) {
      triggerMessage("error", "Hero Title and Description are required!");
      return;
    }
    
    // Check if at least one category is enabled
    const enabledCats = config.categories.filter((c: any) => c.enabled);
    if (enabledCats.length === 0) {
      triggerMessage("error", "At least one homepage category card must be enabled!");
      return;
    }

    if (!window.confirm("Are you sure you want to publish these changes live? This will update the homepage and the main Categories models in the database immediately.")) return;

    setPublishing(true);
    try {
      const res = await fetch("/api/admin/homepage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config)
      });

      if (!res.ok) throw new Error("Failed to publish content");
      setOriginalConfig(config);
      triggerMessage("success", "Homepage CMS published live successfully!");
    } catch (err: any) {
      triggerMessage("error", err.message || "Publish failed");
    } finally {
      setPublishing(false);
    }
  };

  // Restore changes to published state
  const handleReset = () => {
    if (window.confirm("Discard all draft modifications and restore original published settings?")) {
      setConfig(JSON.parse(JSON.stringify(originalConfig)));
      triggerMessage("success", "Restored to last published settings.");
    }
  };

  // Drag and Drop reordering handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (index: number, listType: "categories" | "features") => {
    if (draggedIndex === null || draggedIndex === index) return;
    
    const items = [...config[listType]];
    const draggedItem = items[draggedIndex];
    items.splice(draggedIndex, 1);
    items.splice(index, 0, draggedItem);

    // Re-adjust order indices
    const reordered = items.map((item, idx) => ({ ...item, order: idx }));
    setConfig((prev: any) => ({ ...prev, [listType]: reordered }));
    setDraggedIndex(null);
  };

  const moveItem = (index: number, direction: "up" | "down", listType: "categories" | "features") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= config[listType].length) return;

    const items = [...config[listType]];
    const temp = items[index];
    items[index] = items[targetIdx];
    items[targetIdx] = temp;

    const reordered = items.map((item, idx) => ({ ...item, order: idx }));
    setConfig((prev: any) => ({ ...prev, [listType]: reordered }));
  };

  const toTitleCase = (str: string) => {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
  };

  if (loading) {
    return (
      <div className="bg-white/60 backdrop-blur-md rounded-[3rem] border border-white p-32 text-center shadow-xl">
        <Loader2 className="animate-spin inline-block text-[#c81c6a] mb-6" size={48} />
        <p className="text-[12px] font-black capitalize tracking-[0.3em] text-[#5d5f61] animate-pulse">Syncing Homepage Repository...</p>
      </div>
    );
  }

  // Active Category details for preview mapping
  const activeHeroCategory = config.categories.find((c: any) => c.id === config.hero.activeCategoryId) || config.categories[0];

  return (
    <div className="flex flex-col xl:flex-row gap-10 items-stretch relative z-10 w-full">
      {/* Toast Alert message */}
      <AnimatePresence>
        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={cn(
              "fixed top-6 right-6 z-[200] flex items-center gap-4 px-8 py-5 rounded-[2rem] border shadow-2xl text-xs font-black capitalize tracking-widest",
              message.type === "success" 
                ? "bg-emerald-50 border-emerald-100 text-emerald-800" 
                : "bg-red-50 border-red-100 text-red-800"
            )}
          >
            {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main CMS Editor Panel */}
      <div className="flex-1 flex flex-col bg-white/60 backdrop-blur-md rounded-[3.5rem] border border-white shadow-2xl overflow-hidden min-h-[700px] relative">
        {/* Sub Navigation Tabs */}
        <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gray-50/20">
          <div>
            <h2 className="text-2xl font-black font-playfair text-[#5d5f61]">Homepage Master CMS</h2>
            <p className="text-[10px] font-black capitalize tracking-widest text-gray-400 mt-1">Configure sections, select products, and preview live layouts</p>
          </div>
          
          <div className="flex gap-2 p-1.5 bg-gray-100/50 rounded-2xl w-fit self-end md:self-auto overflow-x-auto max-w-full">
            {[
              { id: "hero", label: "Hero Card" },
              { id: "categories", label: "Categories" },
              { id: "features", label: "Features" },
              { id: "series", label: "Series" },
              { id: "settings", label: "Globals" }
            ].map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => setActiveSubTab(sub.id as SubTab)}
                className={cn(
                  "px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all duration-300",
                  activeSubTab === sub.id 
                    ? "bg-[#5d5f61] text-white shadow-md scale-105" 
                    : "text-gray-400 hover:text-[#5d5f61] hover:bg-white"
                )}
              >
                {sub.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form Body */}
        <div className="flex-1 p-10 overflow-y-auto space-y-12">
          
          {/* TAB 1: Hero Section */}
          {activeSubTab === "hero" && (
            <div className="space-y-10">
              <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                <div className="w-1.5 h-6 bg-[#c81c6a] rounded-full" />
                <h3 className="text-lg font-black font-playfair text-[#5d5f61]">Editorial Hero (Mobile/Tablet)</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Active Category */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black capitalize tracking-widest text-gray-400 ml-1">Active Hero Category Card</label>
                  <select 
                    value={config.hero.activeCategoryId}
                    onChange={(e) => {
                      const selCat = config.categories.find((c: any) => c.id === e.target.value);
                      if (selCat) {
                        setConfig((prev: any) => ({
                          ...prev,
                          hero: {
                            ...prev.hero,
                            activeCategoryId: selCat.id,
                            image: selCat.image,
                            title: selCat.title,
                            subtitle: selCat.subtitle,
                            description: selCat.mobileActiveDesc || selCat.subtitle,
                            ctaText: selCat.ctaText || "Buy Now",
                            ctaLink: selCat.ctaLink || `/shop?cat=${selCat.title.toLowerCase()}`,
                            color: selCat.color
                          }
                        }));
                      }
                    }}
                    className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-[#5d5f61] focus:ring-2 focus:ring-[#c81c6a]/20 transition-all text-sm appearance-none cursor-pointer"
                  >
                    {config.categories.map((c: any) => (
                      <option key={c.id} value={c.id}>{c.title} ({c.id})</option>
                    ))}
                  </select>
                </div>

                {/* Hero Accent Color */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black capitalize tracking-widest text-gray-400 ml-1">Hero Accent Theme Hue</label>
                  <div className="flex items-center gap-4 bg-gray-50 px-6 py-3.5 rounded-2xl">
                    <input 
                      type="color" 
                      value={config.hero.color || "#c81c6a"}
                      onChange={(e) => handleInputChange("hero", "color", e.target.value)}
                      className="w-10 h-10 rounded-xl cursor-pointer border-none p-0 shadow-sm"
                    />
                    <input 
                      type="text"
                      value={config.hero.color || "#c81c6a"}
                      onChange={(e) => handleInputChange("hero", "color", e.target.value)}
                      className="bg-transparent border-none outline-none font-black text-xs text-[#5d5f61] tracking-widest w-24"
                    />
                    {/* Brand Colors Preset */}
                    <div className="flex gap-1.5 ml-auto">
                      {["#c81c6a", "#9a0c52", "#7fa23f", "#5d5f61"].map((col) => (
                        <button
                          key={col}
                          type="button"
                          onClick={() => handleInputChange("hero", "color", col)}
                          className="w-5 h-5 rounded-full border border-white shadow-sm flex items-center justify-center"
                          style={{ backgroundColor: col }}
                        >
                          {config.hero.color === col && <Check size={10} className="text-white" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Hero Title */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black capitalize tracking-widest text-gray-400 ml-1">Hero Heading Title</label>
                  <input 
                    type="text" 
                    value={config.hero.title}
                    onChange={(e) => handleInputChange("hero", "title", e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-[#5d5f61] focus:ring-2 focus:ring-[#c81c6a]/20 transition-all text-sm"
                    placeholder="e.g. Crush"
                    required
                  />
                </div>

                {/* Hero Subtitle */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black capitalize tracking-widest text-gray-400 ml-1">Hero Subtitle</label>
                  <input 
                    type="text" 
                    value={config.hero.subtitle}
                    onChange={(e) => handleInputChange("hero", "subtitle", e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-[#5d5f61] focus:ring-2 focus:ring-[#c81c6a]/20 transition-all text-sm"
                    placeholder="e.g. Pure Botanical Refreshment"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2 space-y-3">
                  <label className="text-[10px] font-black capitalize tracking-widest text-gray-400 ml-1">Hero Narrative Description</label>
                  <textarea 
                    value={config.hero.description}
                    onChange={(e) => handleInputChange("hero", "description", e.target.value)}
                    rows={4}
                    className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-[#5d5f61] focus:ring-2 focus:ring-[#c81c6a]/20 transition-all text-sm resize-none"
                    placeholder="Provide a vivid description of the active collection flavor or structure..."
                  />
                </div>

                {/* CTA text */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black capitalize tracking-widest text-gray-400 ml-1">Action Button Text</label>
                  <input 
                    type="text" 
                    value={config.hero.ctaText || "Buy Now"}
                    onChange={(e) => handleInputChange("hero", "ctaText", e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-[#5d5f61] focus:ring-2 focus:ring-[#c81c6a]/20 transition-all text-sm"
                    placeholder="e.g. Buy Now"
                  />
                </div>

                {/* CTA Link */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black capitalize tracking-widest text-gray-400 ml-1">Action Redirect Link</label>
                  <input 
                    type="text" 
                    value={config.hero.ctaLink || "/shop"}
                    onChange={(e) => handleInputChange("hero", "ctaLink", e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-[#5d5f61] focus:ring-2 focus:ring-[#c81c6a]/20 transition-all text-sm"
                    placeholder="e.g. /shop?cat=crush"
                  />
                </div>

                {/* Image Upload */}
                <div className="md:col-span-2 space-y-3">
                  <label className="text-[10px] font-black capitalize tracking-widest text-gray-400 ml-1">Hero Featured Product Image</label>
                  <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <div className="relative w-28 h-28 bg-white rounded-2xl border border-gray-100 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                      {config.hero.image ? (
                        <img src={config.hero.image} alt="Preview" className="w-full h-full object-contain p-2" />
                      ) : (
                        <Info className="text-gray-300" size={24} />
                      )}
                      {uploadingField === "hero_image" && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <Loader2 className="animate-spin text-white" size={16} />
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-3 text-center sm:text-left">
                      <p className="text-[10px] font-black text-[#5d5f61] uppercase tracking-wide">Upload High Resolution Transparent Asset</p>
                      <p className="text-[9px] font-bold text-gray-400">Recommended format: PNG or WebP with transparency, minimum 600x600px for high quality detail scaling.</p>
                      <button
                        type="button"
                        onClick={() => {
                          if (fileInputRef.current) {
                            (fileInputRef.current as any).uploadTarget = { type: "hero_image" };
                            fileInputRef.current.click();
                          }
                        }}
                        className="flex items-center gap-2 bg-white text-[#5d5f61] px-5 py-3 rounded-xl border border-gray-100 shadow-sm text-[9px] font-black capitalize tracking-widest hover:bg-gray-100 transition-colors"
                      >
                        <Upload size={12} /> Choose Image
                      </button>
                    </div>
                  </div>
                </div>

                {/* Enable/Disable switch */}
                <div className="md:col-span-2 flex items-center justify-between p-6 bg-gray-50 rounded-2xl">
                  <div>
                    <p className="text-xs font-black text-[#5d5f61] uppercase tracking-wide">Show Hero Category Card</p>
                    <p className="text-[9px] font-bold text-gray-400 mt-1">If disabled, this category details will not appear active on page load.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleInputChange("hero", "enabled", !config.hero.enabled)}
                    className={cn(
                      "w-12 h-6 rounded-full p-1 transition-all duration-300",
                      config.hero.enabled ? "bg-[#c81c6a] flex justify-end" : "bg-gray-300 flex justify-start"
                    )}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Categories */}
          {activeSubTab === "categories" && (
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                  <h3 className="text-lg font-black font-playfair text-[#5d5f61]">Homepage Accordion Collections</h3>
                </div>
                <span className="text-[9px] font-black capitalize tracking-widest text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full">Drag lists or click arrows to reorder</span>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {config.categories.map((cat: any, idx: number) => (
                  <div 
                    key={cat.id || idx}
                    draggable
                    onDragStart={() => handleDragStart(idx)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(idx, "categories")}
                    className={cn(
                      "bg-gray-50/50 p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 relative group transition-all",
                      draggedIndex === idx && "opacity-40 border-dashed border-[#c81c6a]"
                    )}
                  >
                    {/* Drag Handle & Ordering controls */}
                    <div className="flex md:flex-col items-center justify-between md:justify-center gap-4 shrink-0 md:border-r border-gray-100 md:pr-6">
                      <div className="cursor-grab text-gray-300 hover:text-[#5d5f61] transition-colors p-1" title="Drag to reorder">
                        <div className="w-6 flex flex-col gap-1 items-center">
                          <div className="w-4 h-[2px] bg-current rounded-full" />
                          <div className="w-4 h-[2px] bg-current rounded-full" />
                          <div className="w-4 h-[2px] bg-current rounded-full" />
                        </div>
                      </div>
                      
                      <div className="flex md:flex-col gap-1">
                        <button
                          type="button"
                          onClick={() => moveItem(idx, "up", "categories")}
                          disabled={idx === 0}
                          className="p-1.5 bg-white border border-gray-100 hover:border-gray-300 rounded-lg text-[#5d5f61] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                          <ArrowUp size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveItem(idx, "down", "categories")}
                          disabled={idx === config.categories.length - 1}
                          className="p-1.5 bg-white border border-gray-100 hover:border-gray-300 rounded-lg text-[#5d5f61] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                          <ArrowDown size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Image Preview & Upload */}
                    <div className="shrink-0 flex flex-col items-center justify-center gap-2">
                      <div className="relative w-24 h-24 bg-white rounded-2xl border border-gray-100 overflow-hidden flex items-center justify-center shadow-inner">
                        {cat.image ? (
                          <img src={cat.image} alt={cat.title} className="w-full h-full object-contain p-2" />
                        ) : (
                          <Upload className="text-gray-300" size={20} />
                        )}
                        {uploadingField === `category_image_${cat.id}` && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <Loader2 className="animate-spin text-white" size={16} />
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (fileInputRef.current) {
                            (fileInputRef.current as any).uploadTarget = { type: "category_image", index: idx, id: cat.id };
                            fileInputRef.current.click();
                          }
                        }}
                        className="bg-white hover:bg-gray-50 border border-gray-100 shadow-sm text-[8px] font-black capitalize tracking-widest px-3 py-1.5 rounded-lg text-[#5d5f61]"
                      >
                        Change Image
                      </button>
                    </div>

                    {/* Content Fields */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {/* Title */}
                      <div className="space-y-1.5">
                        <label className="text-[8px] font-black capitalize tracking-widest text-gray-400 ml-1">Category Title</label>
                        <input 
                          type="text"
                          value={cat.title}
                          onChange={(e) => {
                            const updated = [...config.categories];
                            updated[idx].title = e.target.value;
                            setConfig((prev: any) => ({ ...prev, categories: updated }));
                          }}
                          className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl outline-none font-bold text-xs text-[#5d5f61]"
                          placeholder="Category Title"
                          required
                        />
                      </div>

                      {/* Accent Color */}
                      <div className="space-y-1.5">
                        <label className="text-[8px] font-black capitalize tracking-widest text-gray-400 ml-1">Accent Brand Color</label>
                        <div className="flex items-center gap-3 px-3 py-2 bg-white border border-gray-100 rounded-xl">
                          <input 
                            type="color"
                            value={cat.color || "#c81c6a"}
                            onChange={(e) => {
                              const updated = [...config.categories];
                              updated[idx].color = e.target.value;
                              setConfig((prev: any) => ({ ...prev, categories: updated }));
                            }}
                            className="w-6 h-6 rounded-lg cursor-pointer border-none p-0"
                          />
                          <span className="text-[9px] font-black tracking-widest text-gray-400">{cat.color || "#c81c6a"}</span>
                        </div>
                      </div>

                      {/* Watermark text */}
                      <div className="space-y-1.5">
                        <label className="text-[8px] font-black capitalize tracking-widest text-gray-400 ml-1">Backdrop Watermark text</label>
                        <input 
                          type="text"
                          value={cat.watermarkText || ""}
                          onChange={(e) => {
                            const updated = [...config.categories];
                            updated[idx].watermarkText = e.target.value;
                            setConfig((prev: any) => ({ ...prev, categories: updated }));
                          }}
                          className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl outline-none font-bold text-xs text-[#5d5f61]"
                          placeholder="e.g. CRUSH"
                        />
                      </div>

                      {/* CTA label */}
                      <div className="space-y-1.5">
                        <label className="text-[8px] font-black capitalize tracking-widest text-gray-400 ml-1">CTA Label</label>
                        <input 
                          type="text"
                          value={cat.ctaText || "Buy Now"}
                          onChange={(e) => {
                            const updated = [...config.categories];
                            updated[idx].ctaText = e.target.value;
                            setConfig((prev: any) => ({ ...prev, categories: updated }));
                          }}
                          className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl outline-none font-bold text-xs text-[#5d5f61]"
                          placeholder="Buy Now"
                        />
                      </div>

                      {/* CTA Link */}
                      <div className="space-y-1.5">
                        <label className="text-[8px] font-black capitalize tracking-widest text-gray-400 ml-1">CTA Link</label>
                        <input 
                          type="text"
                          value={cat.ctaLink || ""}
                          onChange={(e) => {
                            const updated = [...config.categories];
                            updated[idx].ctaLink = e.target.value;
                            setConfig((prev: any) => ({ ...prev, categories: updated }));
                          }}
                          className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl outline-none font-bold text-xs text-[#5d5f61]"
                          placeholder="/shop"
                        />
                      </div>

                      {/* Toggles */}
                      <div className="flex gap-4 items-center justify-around bg-white border border-gray-100 rounded-xl px-2 py-2 shrink-0">
                        {/* Enabled check */}
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-[7px] font-black capitalize text-gray-300">Enabled</span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...config.categories];
                              updated[idx].enabled = !updated[idx].enabled;
                              setConfig((prev: any) => ({ ...prev, categories: updated }));
                            }}
                            className={cn(
                              "w-8 h-4 rounded-full p-0.5 transition-all duration-300",
                              cat.enabled ? "bg-emerald-500 flex justify-end" : "bg-gray-200 flex justify-start"
                            )}
                          >
                            <div className="w-3 h-3 rounded-full bg-white shadow-sm" />
                          </button>
                        </div>

                        {/* Default check */}
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-[7px] font-black capitalize text-gray-300">Default</span>
                          <button
                            type="button"
                            onClick={() => {
                              // Setting this true set all others false
                              const updated = config.categories.map((c: any, index: number) => ({
                                ...c,
                                isDefault: index === idx
                              }));
                              setConfig((prev: any) => ({ ...prev, categories: updated }));
                            }}
                            className={cn(
                              "w-8 h-4 rounded-full p-0.5 transition-all duration-300",
                              cat.isDefault ? "bg-[#c81c6a] flex justify-end" : "bg-gray-200 flex justify-start"
                            )}
                          >
                            <div className="w-3 h-3 rounded-full bg-white shadow-sm" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Feature Badges */}
          {activeSubTab === "features" && (
            <div className="space-y-8">
              <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                <div className="w-1.5 h-6 bg-[#5d5f61] rounded-full" />
                <h3 className="text-lg font-black font-playfair text-[#5d5f61]">Homepage trust features (Feature Icons Section)</h3>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {config.features.map((feat: any, idx: number) => (
                  <div 
                    key={feat.id || idx}
                    draggable
                    onDragStart={() => handleDragStart(idx)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(idx, "features")}
                    className={cn(
                      "bg-gray-50/50 p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-6 relative group transition-all",
                      draggedIndex === idx && "opacity-40 border-dashed border-[#c81c6a]"
                    )}
                  >
                    {/* Drag Handle & Ordering controls */}
                    <div className="flex md:flex-col items-center justify-between md:justify-center gap-4 shrink-0 md:border-r border-gray-100 md:pr-6">
                      <div className="cursor-grab text-gray-300 hover:text-[#5d5f61] p-1" title="Drag to reorder">
                        <div className="w-6 flex flex-col gap-1 items-center">
                          <div className="w-4 h-[2px] bg-current rounded-full" />
                          <div className="w-4 h-[2px] bg-current rounded-full" />
                          <div className="w-4 h-[2px] bg-current rounded-full" />
                        </div>
                      </div>
                      <div className="flex md:flex-col gap-1">
                        <button
                          type="button"
                          onClick={() => moveItem(idx, "up", "features")}
                          disabled={idx === 0}
                          className="p-1.5 bg-white border border-gray-100 rounded-lg text-[#5d5f61] disabled:opacity-30 transition-all"
                        >
                          <ArrowUp size={10} />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveItem(idx, "down", "features")}
                          disabled={idx === config.features.length - 1}
                          className="p-1.5 bg-white border border-gray-100 rounded-lg text-[#5d5f61] disabled:opacity-30 transition-all"
                        >
                          <ArrowDown size={10} />
                        </button>
                      </div>
                    </div>

                    {/* Icon Image Preview & Upload */}
                    <div className="shrink-0 flex flex-col items-center justify-center gap-2">
                      <div className="relative w-16 h-16 bg-white rounded-xl border border-gray-100 overflow-hidden flex items-center justify-center shadow-inner">
                        {feat.icon ? (
                          <img src={feat.icon} alt={feat.title} className="w-10 h-10 object-contain" />
                        ) : (
                          <div className="text-[8px] font-black text-gray-300 uppercase tracking-widest text-center">Default Icon</div>
                        )}
                        {uploadingField === `feature_icon_${feat.id}` && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <Loader2 className="animate-spin text-white" size={14} />
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (fileInputRef.current) {
                            (fileInputRef.current as any).uploadTarget = { type: "feature_icon", index: idx, id: feat.id };
                            fileInputRef.current.click();
                          }
                        }}
                        className="bg-white border border-gray-100 shadow-sm text-[8px] font-black capitalize tracking-widest px-2.5 py-1.5 rounded-lg text-[#5d5f61]"
                      >
                        Upload Icon
                      </button>
                    </div>

                    {/* Content Fields */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
                      {/* Title */}
                      <div className="space-y-1.5">
                        <label className="text-[8px] font-black capitalize tracking-widest text-gray-400 ml-1">Feature Label Part 1</label>
                        <input 
                          type="text"
                          value={feat.title}
                          onChange={(e) => {
                            const updated = [...config.features];
                            updated[idx].title = e.target.value;
                            setConfig((prev: any) => ({ ...prev, features: updated }));
                          }}
                          className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl outline-none font-bold text-xs text-[#5d5f61]"
                          placeholder="Part 1 (e.g. Delivery)"
                          required
                        />
                      </div>

                      {/* Subtitle */}
                      <div className="space-y-1.5">
                        <label className="text-[8px] font-black capitalize tracking-widest text-gray-400 ml-1">Feature Label Part 2 (Subtitle)</label>
                        <input 
                          type="text"
                          value={feat.subtitle}
                          onChange={(e) => {
                            const updated = [...config.features];
                            updated[idx].subtitle = e.target.value;
                            setConfig((prev: any) => ({ ...prev, features: updated }));
                          }}
                          className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl outline-none font-bold text-xs text-[#5d5f61]"
                          placeholder="Part 2 (e.g. Available)"
                        />
                      </div>

                      {/* Enabled Check */}
                      <div className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-5 py-3">
                        <span className="text-[9px] font-black capitalize text-gray-400">Show Feature Card</span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...config.features];
                            updated[idx].enabled = !updated[idx].enabled;
                            setConfig((prev: any) => ({ ...prev, features: updated }));
                          }}
                          className={cn(
                            "w-8 h-4 rounded-full p-0.5 transition-all duration-300",
                            feat.enabled ? "bg-[#c81c6a] flex justify-end" : "bg-gray-200 flex justify-start"
                          )}
                        >
                          <div className="w-3 h-3 rounded-full bg-white shadow-sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Product Series */}
          {activeSubTab === "series" && (
            <div className="space-y-10">
              <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                <div className="w-1.5 h-6 bg-[#9a0c52] rounded-full" />
                <h3 className="text-lg font-black font-playfair text-[#5d5f61]">Homepage Product Carousels</h3>
              </div>

              <div className="grid grid-cols-1 gap-8">
                {config.series.map((ser: any, idx: number) => {
                  const mappedCategory = categoriesList.find(c => c.id === ser.categoryId);
                  const products = mappedCategory?.products || [];

                  return (
                    <div key={ser.categoryId || idx} className="bg-gray-50/50 p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 gap-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-black text-white bg-[#5d5f61] px-3.5 py-1.5 rounded-full uppercase tracking-wider">{ser.categoryId} Collection</span>
                          <h4 className="font-black text-[#5d5f61] text-md">{mappedCategory?.title || "Product Series"}</h4>
                        </div>
                        
                        <div className="flex gap-6 self-end sm:self-auto">
                          {/* Enabled Toggle */}
                          <div className="flex items-center gap-3">
                            <span className="text-[9px] font-black capitalize text-gray-400">Show Carousel Section</span>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...config.series];
                                updated[idx].enabled = !updated[idx].enabled;
                                setConfig((prev: any) => ({ ...prev, series: updated }));
                              }}
                              className={cn(
                                "w-8 h-4 rounded-full p-0.5 transition-all duration-300",
                                ser.enabled ? "bg-emerald-500 flex justify-end" : "bg-gray-200 flex justify-start"
                              )}
                            >
                              <div className="w-3 h-3 rounded-full bg-white shadow-sm" />
                            </button>
                          </div>
                          
                          {/* Arrows Toggle */}
                          <div className="flex items-center gap-3">
                            <span className="text-[9px] font-black capitalize text-gray-400">Show Navigation Arrows</span>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...config.series];
                                updated[idx].showArrows = !updated[idx].showArrows;
                                setConfig((prev: any) => ({ ...prev, series: updated }));
                              }}
                              className={cn(
                                "w-8 h-4 rounded-full p-0.5 transition-all duration-300",
                                ser.showArrows ? "bg-[#c81c6a] flex justify-end" : "bg-gray-200 flex justify-start"
                              )}
                            >
                              <div className="w-3 h-3 rounded-full bg-white shadow-sm" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Header Inputs */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {/* Heading Prefix */}
                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-[8px] font-black capitalize tracking-widest text-gray-400 ml-1">Section Main Heading</label>
                          <input 
                            type="text"
                            value={ser.heading}
                            onChange={(e) => {
                              const updated = [...config.series];
                              updated[idx].heading = e.target.value;
                              setConfig((prev: any) => ({ ...prev, series: updated }));
                            }}
                            className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl outline-none font-bold text-xs text-[#5d5f61]"
                            placeholder="Heading Text"
                          />
                        </div>

                        {/* Section Badge */}
                        <div className="space-y-1.5">
                          <label className="text-[8px] font-black capitalize tracking-widest text-gray-400 ml-1">Badge label</label>
                          <input 
                            type="text"
                            value={ser.badgeText || "Curated Selection"}
                            onChange={(e) => {
                              const updated = [...config.series];
                              updated[idx].badgeText = e.target.value;
                              setConfig((prev: any) => ({ ...prev, series: updated }));
                            }}
                            className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl outline-none font-bold text-xs text-[#5d5f61]"
                            placeholder="Curated Selection"
                          />
                        </div>

                        {/* Desktop Cards Limit */}
                        <div className="space-y-1.5">
                          <label className="text-[8px] font-black capitalize tracking-widest text-gray-400 ml-1">Cards Per Screen (Desktop)</label>
                          <select 
                            value={ser.cardsPerScreen || 5}
                            onChange={(e) => {
                              const updated = [...config.series];
                              updated[idx].cardsPerScreen = Number(e.target.value);
                              setConfig((prev: any) => ({ ...prev, series: updated }));
                            }}
                            className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl outline-none font-bold text-xs text-[#5d5f61] cursor-pointer"
                          >
                            <option value={3}>3 Cards</option>
                            <option value={4}>4 Cards</option>
                            <option value={5}>5 Cards (Standard)</option>
                          </select>
                        </div>
                      </div>

                      {/* Product select list */}
                      <div className="space-y-3">
                        <label className="text-[8px] font-black capitalize tracking-widest text-gray-400 ml-1">Select products to show on Homepage Carousel</label>
                        {products.length === 0 ? (
                          <p className="text-[10px] text-gray-400 italic">No products registered under this category yet. Add products first.</p>
                        ) : (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 p-4 bg-white border border-gray-100 rounded-2xl max-h-48 overflow-y-auto">
                            {products.map((prod: any) => {
                              const isChecked = ser.productIds.includes(prod.id) || ser.productIds.includes(prod._id);
                              
                              return (
                                <button
                                  key={prod.id || prod._id}
                                  type="button"
                                  onClick={() => {
                                    const prodId = prod.id || prod._id;
                                    const updated = [...config.series];
                                    const currentIds = [...ser.productIds];
                                    
                                    if (isChecked) {
                                      updated[idx].productIds = currentIds.filter(id => id !== prodId);
                                    } else {
                                      updated[idx].productIds = [...currentIds, prodId];
                                    }
                                    
                                    setConfig((prev: any) => ({ ...prev, series: updated }));
                                  }}
                                  className={cn(
                                    "flex items-center gap-2 p-2.5 rounded-xl border text-[10px] font-bold text-left transition-all",
                                    isChecked 
                                      ? "bg-[#c81c6a]/5 border-[#c81c6a]/20 text-[#c81c6a] shadow-sm font-black" 
                                      : "bg-gray-50/50 border-gray-100 text-gray-400 hover:bg-gray-50"
                                  )}
                                >
                                  <div className={cn(
                                    "w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 border",
                                    isChecked ? "bg-[#c81c6a] border-[#c81c6a] text-white" : "border-gray-300 bg-white"
                                  )}>
                                    {isChecked && <Check size={8} strokeWidth={3} />}
                                  </div>
                                  <span className="truncate">{prod.name}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: Spacing and Settings */}
          {activeSubTab === "settings" && (
            <div className="space-y-10">
              <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                <div className="w-1.5 h-6 bg-[#7fa23f] rounded-full" />
                <h3 className="text-lg font-black font-playfair text-[#5d5f61]">Global Content Settings</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Spacing options */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black capitalize tracking-widest text-gray-400 ml-1">Homepage Section Spacing</label>
                  <select 
                    value={config.settings.sectionSpacing || "normal"}
                    onChange={(e) => {
                      setConfig((prev: any) => ({
                        ...prev,
                        settings: {
                          ...prev.settings,
                          sectionSpacing: e.target.value
                        }
                      }));
                    }}
                    className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-[#5d5f61] focus:ring-2 focus:ring-[#c81c6a]/20 transition-all text-sm cursor-pointer appearance-none"
                  >
                    <option value="compact">Compact (Highly balanced layouts, optimized breathing space)</option>
                    <option value="normal">Standard (Normal theme gaps)</option>
                    <option value="spacious">Spacious (Large breathing grids)</option>
                  </select>
                </div>

                {/* Title Case toggle */}
                <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl">
                  <div>
                    <p className="text-xs font-black text-[#5d5f61] uppercase tracking-wide">Enforce Title Case Formats</p>
                    <p className="text-[9px] font-bold text-gray-400 mt-1">If active, converts all titles and badges to Title Case automatically.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setConfig((prev: any) => {
                        const newSettings = {
                          ...prev.settings,
                          titleCaseFormat: !prev.settings.titleCaseFormat
                        };
                        
                        // If enabled, optionally format all texts right now to Title Case
                        let categoriesCopy = [...prev.categories];
                        let featuresCopy = [...prev.features];
                        let seriesCopy = [...prev.series];
                        let heroCopy = { ...prev.hero };
                        
                        if (newSettings.titleCaseFormat) {
                          heroCopy.title = toTitleCase(heroCopy.title);
                          heroCopy.subtitle = toTitleCase(heroCopy.subtitle);
                          categoriesCopy = categoriesCopy.map(c => ({
                            ...c,
                            title: toTitleCase(c.title),
                            subtitle: toTitleCase(c.subtitle)
                          }));
                          featuresCopy = featuresCopy.map(f => ({
                            ...f,
                            title: toTitleCase(f.title),
                            subtitle: toTitleCase(f.subtitle)
                          }));
                          seriesCopy = seriesCopy.map(s => ({
                            ...s,
                            heading: toTitleCase(s.heading),
                            badgeText: toTitleCase(s.badgeText)
                          }));
                        }
                        
                        return {
                          ...prev,
                          settings: newSettings,
                          categories: categoriesCopy,
                          features: featuresCopy,
                          series: seriesCopy,
                          hero: heroCopy
                        };
                      });
                    }}
                    className={cn(
                      "w-12 h-6 rounded-full p-1 transition-all duration-300",
                      config.settings.titleCaseFormat ? "bg-[#c81c6a] flex justify-end" : "bg-gray-300 flex justify-start"
                    )}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Floating Actions bar at bottom */}
        <div className="p-8 border-t border-gray-100 bg-white/95 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 sticky bottom-0 z-50">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-2 px-6 py-4 bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-500 rounded-2xl text-[9px] font-black capitalize tracking-widest transition-all"
              title="Discard draft changes"
            >
              <RotateCcw size={12} /> Discard Changes
            </button>
          </div>
          
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={saving || publishing}
              className="flex items-center gap-2 px-8 py-4 bg-[#5d5f61] hover:brightness-110 text-white rounded-2xl text-[9px] font-black capitalize tracking-widest disabled:opacity-50 transition-all shadow-md"
            >
              {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
              Save Draft
            </button>
            
            <button
              type="button"
              onClick={handlePublishLive}
              disabled={saving || publishing}
              className="flex items-center gap-2 px-10 py-4 bg-[#c81c6a] hover:brightness-110 text-white rounded-2xl text-[9px] font-black capitalize tracking-widest disabled:opacity-50 transition-all shadow-lg"
            >
              {publishing ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
              Publish Live
            </button>
          </div>
        </div>
      </div>

      {/* High-Fidelity Device Preview Panel */}
      {showPreview && (
        <div className="w-full xl:w-[420px] flex flex-col shrink-0">
          <div className="bg-white/60 backdrop-blur-md rounded-[3rem] border border-white p-6 shadow-2xl space-y-6 sticky top-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <Eye size={16} className="text-[#c81c6a]" />
                <h3 className="text-sm font-black uppercase tracking-widest text-[#5d5f61]">Dynamic Preview</h3>
              </div>
              
              {/* Preview Modes */}
              <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
                {[
                  { id: "mobile", icon: Smartphone },
                  { id: "tablet", icon: Tablet },
                  { id: "desktop", icon: Monitor }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setPreviewMode(mode.id as PreviewMode)}
                    className={cn(
                      "p-1.5 rounded-lg transition-all",
                      previewMode === mode.id ? "bg-white text-[#c81c6a] shadow-sm" : "text-gray-400 hover:text-[#5d5f61]"
                    )}
                  >
                    <mode.icon size={14} />
                  </button>
                ))}
              </div>
            </div>

            {/* Preview Frame */}
            <div className="flex justify-center items-center py-6 bg-gray-50 rounded-[2.5rem] border border-gray-100 overflow-hidden min-h-[420px]">
              {previewMode === "mobile" && (
                <div className="w-[270px] h-[480px] bg-white rounded-[2.5rem] shadow-2xl border-[6px] border-[#5d5f61] overflow-hidden flex flex-col relative">
                  {/* Speaker and Camera Notch */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-3 bg-[#5d5f61] rounded-full z-[100]" />
                  
                  {/* Screen Content */}
                  <div className="flex-1 overflow-y-auto pt-8 flex flex-col relative font-sans text-left">
                    {/* Header */}
                    <div className="w-full flex items-center justify-between px-4 py-2 border-b border-gray-50 shrink-0 bg-white/70 backdrop-blur-md">
                      <span className="text-[8px] font-black text-[#5d5f61]">RAFAH GARDEN</span>
                      <div className="w-4 h-3 flex flex-col justify-between items-end">
                        <div className="w-4 h-[2px] bg-current" />
                        <div className="w-3.5 h-[2px] bg-current" />
                        <div className="w-2.5 h-[2px] bg-current" />
                      </div>
                    </div>

                    {/* Active Hero Card Mockup */}
                    <div className="p-3 shrink-0">
                      <div className="w-full rounded-2xl overflow-hidden shadow-sm relative h-48 bg-[#e2e2e2] flex">
                        {/* Left Grey image block */}
                        <div className="w-[42%] relative flex items-center justify-center overflow-hidden">
                          <span className="absolute text-[8px] text-gray-300/40 font-black tracking-widest uppercase rotate-90 scale-150 transform">
                            {activeHeroCategory?.watermarkText || activeHeroCategory?.title || "CRUSH"}
                          </span>
                          {config.hero.image && (
                            <img 
                              src={config.hero.image} 
                              alt="preview" 
                              className="w-[85%] h-[85%] object-contain drop-shadow-md z-10" 
                            />
                          )}
                        </div>
                        
                        {/* Right Colored content block */}
                        <div 
                          className="flex-1 p-3.5 flex flex-col justify-between text-white"
                          style={{ backgroundColor: config.hero.color || "#c81c6a" }}
                        >
                          <div>
                            <h4 className="text-[11px] font-black leading-tight line-clamp-1">{config.hero.title}</h4>
                            <p className="text-[7px] text-white/90 leading-tight mt-1 line-clamp-4 font-normal">{config.hero.description}</p>
                          </div>
                          
                          <div className="flex flex-col gap-2">
                            <button className="flex items-center justify-between w-14 px-2 py-1 rounded-full border border-white/40 text-white text-[6px] font-bold">
                              <span>Buy Now</span>
                            </button>
                            <span className="text-[8px] font-black leading-none uppercase tracking-wide whitespace-pre-line">
                              {config.hero.subtitle}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Trust Badges Mockup */}
                    <div className="p-3 bg-white border-t border-gray-50">
                      <div className="grid grid-cols-2 gap-2 text-center">
                        {config.features.filter((f: any) => f.enabled).slice(0, 4).map((f: any, idx: number) => (
                          <div key={idx} className="p-2 border border-gray-50 rounded-lg flex flex-col items-center justify-center gap-1">
                            <div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center">
                              {f.icon ? (
                                <img src={f.icon} alt="" className="w-3 h-3 object-contain" />
                              ) : (
                                <div className="w-2 h-2 rounded-full bg-[#5d5f61]/20" />
                              )}
                            </div>
                            <p className="text-[6px] text-gray-500 font-bold leading-tight">
                              {f.title}<br/>{f.subtitle}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {previewMode === "tablet" && (
                <div className="w-[340px] h-[440px] bg-white rounded-[2.5rem] shadow-2xl border-[8px] border-[#5d5f61] overflow-hidden flex flex-col relative">
                  {/* Tablet Home Button Notch */}
                  <div className="absolute top-1/2 left-1 -translate-y-1/2 w-1.5 h-6 bg-[#5d5f61] rounded-full z-[100]" />
                  
                  {/* Screen Content */}
                  <div className="flex-1 overflow-y-auto pt-6 flex flex-col relative text-left">
                    {/* Header */}
                    <div className="w-full flex items-center justify-between px-6 py-3 border-b border-gray-50 bg-white/70 backdrop-blur-md">
                      <span className="text-[10px] font-black text-[#5d5f61]">RAFAH GARDEN</span>
                      <div className="w-5 h-3.5 flex flex-col justify-between items-end">
                        <div className="w-5 h-[2px] bg-current" />
                        <div className="w-4.5 h-[2px] bg-current" />
                        <div className="w-3 h-[2px] bg-current" />
                      </div>
                    </div>

                    {/* Active Hero Card Mockup */}
                    <div className="p-4 shrink-0">
                      <div className="w-full rounded-2xl overflow-hidden shadow-sm relative h-52 bg-[#e2e2e2] flex">
                        <div className="w-[40%] relative flex items-center justify-center overflow-hidden">
                          <span className="absolute text-[10px] text-gray-300/40 font-black tracking-widest uppercase rotate-90 scale-150 transform">
                            {activeHeroCategory?.watermarkText || activeHeroCategory?.title || "CRUSH"}
                          </span>
                          {config.hero.image && (
                            <img 
                              src={config.hero.image} 
                              alt="preview" 
                              className="w-[85%] h-[85%] object-contain drop-shadow-md z-10" 
                            />
                          )}
                        </div>
                        <div 
                          className="flex-1 p-4 flex flex-col justify-between text-white"
                          style={{ backgroundColor: config.hero.color || "#c81c6a" }}
                        >
                          <div>
                            <h4 className="text-[13px] font-black leading-tight line-clamp-1">{config.hero.title}</h4>
                            <p className="text-[8px] text-white/90 leading-relaxed mt-1 line-clamp-4 font-normal">{config.hero.description}</p>
                          </div>
                          
                          <div className="flex flex-col gap-2">
                            <button className="flex items-center justify-between w-16 px-3 py-1 rounded-full border border-white/40 text-white text-[7px] font-bold">
                              <span>Buy Now</span>
                            </button>
                            <span className="text-[9px] font-black leading-none uppercase tracking-wide whitespace-pre-line">
                              {config.hero.subtitle}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {previewMode === "desktop" && (
                <div className="w-[390px] h-[290px] bg-white rounded-xl shadow-2xl border-[8px] border-[#5d5f61] overflow-hidden flex flex-col relative">
                  {/* Stand base mock */}
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-14 h-1 bg-[#5d5f61] rounded-t" />
                  
                  {/* Screen Content */}
                  <div className="flex-1 overflow-y-auto flex flex-col relative text-left">
                    {/* Header */}
                    <div className="w-full flex items-center justify-between px-4 py-2.5 border-b border-gray-50 bg-white/70 backdrop-blur-md shrink-0">
                      <span className="text-[9px] font-black text-[#5d5f61]">RAFAH GARDEN</span>
                      <div className="flex gap-4 text-[7px] font-black text-gray-400">
                        <span>HERITAGE</span>
                        <span>SHOP</span>
                        <span>ABOUT</span>
                      </div>
                    </div>

                    {/* Desktop Hero Layout: Vertical Cards Side-by-Side */}
                    <div className="flex-1 flex gap-1 p-2 bg-[#f1f1f2] items-stretch">
                      {config.categories.filter((c: any) => c.enabled).slice(0, 4).map((c: any, index: number) => {
                        const isHovered = index === 0; // Simulate first one expanded
                        
                        return (
                          <div
                            key={c.id}
                            className={cn(
                              "rounded-lg overflow-hidden flex flex-col items-center justify-center p-2 text-center transition-all duration-300 relative",
                              isHovered ? "flex-[2] text-white" : "flex-[1] bg-white border border-gray-100"
                            )}
                            style={{ 
                              backgroundColor: isHovered ? (c.color || "#c81c6a") : "white" 
                            }}
                          >
                            <div className="relative w-12 h-12 mb-1">
                              {c.image && (
                                <img src={c.image} alt="" className="w-full h-full object-contain" />
                              )}
                            </div>
                            <h5 className={cn(
                              "text-[8px] font-black leading-none",
                              isHovered ? "text-white" : "text-gray-500"
                            )}>
                              {c.title}
                            </h5>
                            {isHovered && (
                              <p className="text-[5px] text-white/80 leading-normal mt-1 line-clamp-2 max-w-[80px]">
                                {c.mobileActiveDesc || c.subtitle}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl text-[10px] leading-relaxed text-gray-500 font-medium">
              <div className="flex gap-2 items-start">
                <Info size={16} className="text-[#c81c6a] shrink-0 mt-0.5" />
                <p>The preview updates dynamically in real-time as you modify details. Swapping the active hero card or customizing colors instantly scales the layout container frame.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Global File Uploader */}
      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={(e) => {
          const target = (fileInputRef.current as any).uploadTarget;
          if (target) handleAssetUpload(e, target);
        }}
        accept="image/*"
      />
    </div>
  );
}
