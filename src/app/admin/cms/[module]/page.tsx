"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { HomepageCmsEditor } from "@/components/admin/HomepageCmsEditor";
import { InlineContentEditor } from "@/components/admin/InlineContentEditor";
import { 
  Plus, Edit2, Trash2, Search, ArrowUp, ArrowDown, 
  Upload, Loader2, Save, X, Eye, EyeOff, Tag, Link as LinkIcon,
  Image as ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Interface Definitions
interface ServiceItem {
  _id?: string;
  id: string;
  title: string;
  description: string;
  image: string;
  icon?: string;
  order: number;
  isPublished: boolean;
}

interface ProjectItem {
  _id?: string;
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  content: string;
  mainImage: string;
  gallery?: string[];
  location?: string;
  status: string;
  order: number;
  isPublished: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

interface TestimonialItem {
  _id?: string;
  author: string;
  role?: string;
  quote: string;
  rating: number;
  image?: string;
  order: number;
  isPublished: boolean;
}

interface FaqItem {
  _id?: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isPublished: boolean;
}

interface GalleryItem {
  _id?: string;
  title: string;
  description?: string;
  image: string;
  category: string;
  order: number;
  isPublished: boolean;
}

export default function DynamicCmsPage() {
  const params = useParams();
  const router = useRouter();
  const moduleName = params?.module as string;
  
  // Standard states
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [formSaving, setFormSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  
  // File upload ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form Fields State
  const [fields, setFields] = useState<any>({});

  const fetchModuleData = async () => {
    if (!["services", "projects", "testimonials", "faqs", "gallery"].includes(moduleName)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/${moduleName}`);
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json)) setData(json);
      }
    } catch (error) {
      console.error(`Failed to load ${moduleName} data:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModuleData();
    setIsFormOpen(false);
    setEditingItem(null);
  }, [moduleName]);

  // Form Field Sync on edit
  useEffect(() => {
    if (editingItem) {
      setFields({ ...editingItem });
    } else {
      // Default initial states based on module
      if (moduleName === "services") {
        setFields({ id: "", title: "", description: "", image: "", icon: "", order: 0, isPublished: true });
      } else if (moduleName === "projects") {
        setFields({ id: "", title: "", subtitle: "", description: "", content: "", mainImage: "", gallery: [], location: "", status: "Completed", order: 0, isPublished: true, metaTitle: "", metaDescription: "" });
      } else if (moduleName === "testimonials") {
        setFields({ author: "", role: "", quote: "", rating: 5, image: "", order: 0, isPublished: true });
      } else if (moduleName === "faqs") {
        setFields({ question: "", answer: "", category: "General", order: 0, isPublished: true });
      } else if (moduleName === "gallery") {
        setFields({ title: "", description: "", image: "", category: "Sanctuary", order: 0, isPublished: true });
      }
    }
  }, [editingItem, isFormOpen, moduleName]);

  if (!moduleName) return null;

  // Handle Home and About submodules directly
  if (moduleName === "home") {
    return <HomepageCmsEditor />;
  }
  if (moduleName === "about") {
    return <InlineContentEditor group="about" />;
  }

  // Categories helper list
  const getFaqCategories = () => ["All", "General", "Delivery", "Care", "Orders"];
  const getGalleryCategories = () => ["All", "Sanctuary", "Farm", "Harvest"];
  const getProjectStatuses = () => ["Completed", "In Progress", "Draft"];

  // Helper for text formatting (title-to-slug)
  const handleTitleChangeForSlug = (title: string) => {
    setFields((prev: any) => {
      const updates: any = { title };
      if (!prev._id) { // Only auto-generate slug for new items
        updates.id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      }
      return { ...prev, ...updates };
    });
  };

  const handleAssetUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(targetField);
    try {
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: "POST",
        body: file,
      });

      if (!response.ok) throw new Error("Upload failed");
      const blob = await response.json();

      if (targetField === "gallery") {
        setFields((prev: any) => ({
          ...prev,
          gallery: [...(prev.gallery || []), blob.url]
        }));
      } else {
        setFields((prev: any) => ({
          ...prev,
          [targetField]: blob.url
        }));
      }
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploadingField(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSaving(true);
    try {
      const res = await fetch(`/api/${moduleName}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields)
      });

      if (res.ok) {
        setIsFormOpen(false);
        fetchModuleData();
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || "Save failed");
      }
    } catch (err: any) {
      alert(`Error saving item: ${err.message}`);
    } finally {
      setFormSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item? This action is permanent.")) return;
    try {
      const res = await fetch(`/api/${moduleName}?id=${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        fetchModuleData();
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleReorder = async (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= filteredData.length) return;

    const items = [...filteredData];
    const currentItem = items[index];
    const targetItem = items[targetIdx];

    // Swap order values
    const tempOrder = currentItem.order || 0;
    currentItem.order = targetItem.order || 0;
    targetItem.order = tempOrder;

    try {
      // Save both
      await Promise.all([
        fetch(`/api/${moduleName}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(currentItem)
        }),
        fetch(`/api/${moduleName}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(targetItem)
        })
      ]);
      fetchModuleData();
    } catch (error) {
      console.error("Failed to reorder:", error);
    }
  };

  // Filter list
  const filteredData = data.filter(item => {
    let nameKey = "";
    if (moduleName === "services" || moduleName === "projects" || moduleName === "gallery") nameKey = item.title || "";
    if (moduleName === "testimonials") nameKey = item.author || "";
    if (moduleName === "faqs") nameKey = item.question || "";

    const matchesSearch = nameKey.toLowerCase().includes(search.toLowerCase());
    
    let matchesCategory = true;
    if (moduleName === "faqs" || moduleName === "gallery") {
      matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    }
    return matchesSearch && matchesCategory;
  });

  const getPageConfig = () => {
    switch (moduleName) {
      case "services":
        return { label: "Sanctuary Amenities", heading: "Services", watermark: "SERVICES" };
      case "projects":
        return { label: "Sanctuary Landscape", heading: "Projects", watermark: "DESIGNS" };
      case "testimonials":
        return { label: "Client Verifications", heading: "Testimonials", watermark: "REVIEWS" };
      case "faqs":
        return { label: "Support Sanctuary", heading: "FAQs", watermark: "FAQS" };
      case "gallery":
        return { label: "Visual Sanctuary Highlights", heading: "Gallery", watermark: "VISUALS" };
      default:
        return { label: "Repository Content", heading: "CMS", watermark: "CONTENT" };
    }
  };

  const pageMeta = getPageConfig();

  return (
    <div className="space-y-12 pb-24 relative">
      {/* Background Watermark */}
      <div className="absolute top-0 right-0 pointer-events-none opacity-[0.03] select-none -mt-10 -mr-10 md:-mr-20">
         <h1 className="text-[120px] md:text-[250px] font-black tracking-tighter leading-none text-[#5d5f61]">{pageMeta.watermark}</h1>
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 relative z-10">
        <div>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#c81c6a] font-black text-[10px] capitalize tracking-[0.5em] mb-2 md:mb-4 ml-1"
          >
            {pageMeta.label}
          </motion.p>
          <h1 className="text-4xl md:text-7xl font-black font-playfair text-[#5d5f61] tracking-tighter">{pageMeta.heading}</h1>
        </div>

        <button
          onClick={() => {
            setEditingItem(null);
            setIsFormOpen(true);
          }}
          className="flex items-center gap-4 bg-[#5d5f61] text-white px-10 py-5 rounded-[2rem] font-black text-xs capitalize tracking-[0.2em] shadow-2xl shadow-[#5d5f61]/20 hover:bg-[#c81c6a] hover:scale-105 active:scale-95 transition-all duration-500"
        >
          <Plus size={20} /> Add Item
        </button>
      </div>

      {/* Controls: Search and Filter */}
      <div className="flex flex-col lg:flex-row items-center gap-6 relative z-10">
        <div className="relative flex-1 group w-full bg-white/50 backdrop-blur-md rounded-[2.5rem] border border-white shadow-xl shadow-black/[0.02]">
          <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#c81c6a] transition-colors" size={20} />
          <input 
            type="text"
            placeholder={`Search ${pageMeta.heading.toLowerCase()}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-20 pr-10 py-6 bg-transparent outline-none font-bold text-[#5d5f61] transition-all text-sm placeholder:text-gray-300"
          />
        </div>

        {/* Categories selector */}
        {(moduleName === "faqs" || moduleName === "gallery") && (
          <div className="flex items-center gap-3 p-2 bg-white/40 backdrop-blur-md rounded-[2rem] border border-white shadow-xl shadow-black/[0.02] overflow-x-auto scrollbar-hide max-w-full">
            <div className="flex items-center gap-3">
              {(moduleName === "faqs" ? getFaqCategories() : getGalleryCategories()).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 md:px-8 py-3 md:py-4 rounded-[1.5rem] text-[9px] md:text-[10px] font-black capitalize tracking-widest transition-all duration-500 whitespace-nowrap
                    ${selectedCategory === cat 
                      ? "bg-[#5d5f61] text-white shadow-xl" 
                      : "text-gray-400 hover:text-[#5d5f61] hover:bg-white"
                    }
                  `}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Data display grid/table */}
      <div className="relative z-10 bg-white/60 backdrop-blur-xl rounded-[3.5rem] shadow-2xl border border-white overflow-hidden">
        {loading ? (
          <div className="py-48 flex flex-col items-center justify-center gap-8">
            <div className="relative w-20 h-20">
               <div className="absolute inset-0 border-4 border-gray-100 rounded-full" />
               <div className="absolute inset-0 border-4 border-[#c81c6a] border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-[12px] font-black text-[#5d5f61] capitalize tracking-[0.3em] animate-pulse">Syncing Repository Content...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="py-48 flex flex-col items-center justify-center text-center px-10">
            <div className="w-24 h-24 bg-white border border-gray-50 rounded-full flex items-center justify-center mb-10 shadow-xl">
               <Tag className="text-gray-200" size={32} />
            </div>
            <h3 className="text-2xl font-black font-playfair text-[#5d5f61] mb-2">No Records Found</h3>
            <p className="text-gray-400 text-xs max-w-xs font-bold leading-loose normal-case">Create new dynamic elements to establish this section content.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-100/50">
                  {moduleName !== "faqs" && <th className="text-left py-8 px-10 text-[10px] font-black text-[#5d5f61] capitalize tracking-widest w-24">Asset</th>}
                  <th className="text-left py-8 px-10 text-[10px] font-black text-[#5d5f61] capitalize tracking-widest">Detail Block</th>
                  {(moduleName === "faqs" || moduleName === "gallery" || moduleName === "projects") && <th className="text-left py-8 px-10 text-[10px] font-black text-[#5d5f61] capitalize tracking-widest">Classification</th>}
                  <th className="text-left py-8 px-10 text-[10px] font-black text-[#5d5f61] capitalize tracking-widest w-32">Status</th>
                  <th className="text-right py-8 px-10 text-[10px] font-black text-[#5d5f61] capitalize tracking-widest">Reorder / Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/50">
                {filteredData.map((item, idx) => (
                  <motion.tr 
                    key={item._id || idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="group hover:bg-white/40 transition-colors"
                  >
                    {/* Thumbnail Asset column */}
                    {moduleName !== "faqs" && (
                      <td className="py-6 px-10">
                        <div className="w-16 h-16 rounded-2xl bg-white border border-gray-100 flex items-center justify-center p-1.5 overflow-hidden shadow-sm">
                          {item.image || item.mainImage ? (
                            <img src={item.image || item.mainImage} alt="Thumbnail" className="w-full h-full object-cover rounded-xl" />
                          ) : (
                            <span className="text-[9px] font-bold text-gray-300 font-avant-garde">N/A</span>
                          )}
                        </div>
                      </td>
                    )}

                    {/* Main details column */}
                    <td className="py-6 px-10">
                      <div>
                        <p className="text-lg font-black font-playfair text-[#5d5f61]">
                          {moduleName === "services" || moduleName === "projects" || moduleName === "gallery" ? item.title : ""}
                          {moduleName === "testimonials" ? item.author : ""}
                          {moduleName === "faqs" ? item.question : ""}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 line-clamp-1 mt-1 normal-case font-medium">
                          {moduleName === "faqs" ? item.answer : ""}
                          {moduleName === "testimonials" ? item.quote : ""}
                          {moduleName === "services" || moduleName === "projects" ? item.description : ""}
                          {moduleName === "gallery" ? (item.description || "Image highlight") : ""}
                        </p>
                      </div>
                    </td>

                    {/* Classification column */}
                    {(moduleName === "faqs" || moduleName === "gallery" || moduleName === "projects") && (
                      <td className="py-6 px-10">
                        <span className="px-4 py-1.5 rounded-full text-[8px] font-black capitalize tracking-widest bg-gray-100 text-[#5d5f61]">
                          {moduleName === "faqs" || moduleName === "gallery" ? item.category : ""}
                          {moduleName === "projects" ? item.status : ""}
                        </span>
                      </td>
                    )}

                    {/* Status column */}
                    <td className="py-6 px-10">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${item.isPublished ? "bg-emerald-500 animate-pulse" : "bg-gray-400"}`} />
                        <span className={`text-[9px] font-black tracking-wider uppercase ${item.isPublished ? "text-[#5d5f61]" : "text-gray-400"}`}>
                          {item.isPublished ? "Live" : "Draft"}
                        </span>
                      </div>
                    </td>

                    {/* Reorder and action button column */}
                    <td className="py-6 px-10 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        {/* Sort buttons */}
                        <div className="flex gap-1 mr-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleReorder(idx, "up")}
                            disabled={idx === 0}
                            className="p-1 bg-white border border-gray-100 rounded text-gray-400 hover:text-[#c81c6a] disabled:opacity-30"
                          >
                            <ArrowUp size={12} />
                          </button>
                          <button
                            onClick={() => handleReorder(idx, "down")}
                            disabled={idx === filteredData.length - 1}
                            className="p-1 bg-white border border-gray-100 rounded text-gray-400 hover:text-[#c81c6a] disabled:opacity-30"
                          >
                            <ArrowDown size={12} />
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => {
                            setEditingItem(item);
                            setIsFormOpen(true);
                          }}
                          className="p-3 bg-white text-[#5d5f61] hover:bg-[#5d5f61] hover:text-white rounded-xl shadow-sm hover:scale-105 transition-all"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item._id)}
                          className="p-3 bg-white text-red-400 hover:bg-red-500 hover:text-white rounded-xl shadow-sm hover:scale-105 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Overlay Slide-out Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[150] flex justify-end">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            />
            
            {/* Form Sheet */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-2xl h-screen bg-white shadow-2xl flex flex-col p-8 z-10"
            >
              {/* Form Header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-6 mb-8">
                <div>
                  <h3 className="text-2xl font-black font-playfair text-[#5d5f61] capitalize">
                    {editingItem ? `Modify ${moduleName.slice(0, -1)}` : `New ${moduleName.slice(0, -1)}`}
                  </h3>
                  <p className="text-[9px] font-black capitalize tracking-widest text-gray-400 mt-1">Provide content parameters to sync with sanctuary storefront</p>
                </div>
                
                <button 
                  onClick={() => setIsFormOpen(false)}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form Body Scroll area */}
              <form onSubmit={handleSave} className="flex-1 overflow-y-auto space-y-8 pr-2 -mr-4 pb-20">
                
                {/* 1. SERVICES FIELDS */}
                {moduleName === "services" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black capitalize tracking-widest text-gray-400 ml-1">Service Title</label>
                      <input 
                        type="text" required value={fields.title || ""} 
                        onChange={(e) => setFields({ ...fields, title: e.target.value })}
                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-[#5d5f61] text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black capitalize tracking-widest text-gray-400 ml-1">API Identifier ID</label>
                      <input 
                        type="text" required value={fields.id || ""} 
                        onChange={(e) => setFields({ ...fields, id: e.target.value })}
                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-[#5d5f61] text-sm"
                        placeholder="e.g. landscaping"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black capitalize tracking-widest text-gray-400 ml-1">Description</label>
                      <textarea 
                        required value={fields.description || ""} rows={3}
                        onChange={(e) => setFields({ ...fields, description: e.target.value })}
                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-[#5d5f61] text-sm resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black capitalize tracking-widest text-gray-400 ml-1">Lucide Icon Name</label>
                      <input 
                        type="text" value={fields.icon || ""} 
                        onChange={(e) => setFields({ ...fields, icon: e.target.value })}
                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-[#5d5f61] text-sm"
                        placeholder="e.g. Sprout, Flower, Compass"
                      />
                    </div>
                  </>
                )}

                {/* 2. PROJECTS FIELDS */}
                {moduleName === "projects" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black capitalize tracking-widest text-gray-400 ml-1">Project Heading Title</label>
                      <input 
                        type="text" required value={fields.title || ""} 
                        onChange={(e) => handleTitleChangeForSlug(e.target.value)}
                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-[#5d5f61] text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black capitalize tracking-widest text-gray-400 ml-1">Project Identifier ID / Slug</label>
                        <input 
                          type="text" required value={fields.id || ""} 
                          onChange={(e) => setFields({ ...fields, id: e.target.value })}
                          className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-[#5d5f61] text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black capitalize tracking-widest text-gray-400 ml-1">Project Subtitle</label>
                        <input 
                          type="text" value={fields.subtitle || ""} 
                          onChange={(e) => setFields({ ...fields, subtitle: e.target.value })}
                          className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-[#5d5f61] text-sm"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black capitalize tracking-widest text-gray-400 ml-1">Project Location</label>
                        <input 
                          type="text" value={fields.location || ""} 
                          onChange={(e) => setFields({ ...fields, location: e.target.value })}
                          className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-[#5d5f61] text-sm"
                          placeholder="e.g. Kasaragod, Kerala"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black capitalize tracking-widest text-gray-400 ml-1">Project Status</label>
                        <select 
                          value={fields.status || "Completed"} 
                          onChange={(e) => setFields({ ...fields, status: e.target.value })}
                          className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-[#5d5f61] text-sm cursor-pointer"
                        >
                          {getProjectStatuses().map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black capitalize tracking-widest text-gray-400 ml-1">Snippet Description</label>
                      <input 
                        type="text" required value={fields.description || ""} 
                        onChange={(e) => setFields({ ...fields, description: e.target.value })}
                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-[#5d5f61] text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black capitalize tracking-widest text-gray-400 ml-1">Full Curation Content (Rich Text/Markdown)</label>
                      <textarea 
                        required value={fields.content || ""} rows={6}
                        onChange={(e) => setFields({ ...fields, content: e.target.value })}
                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-[#5d5f61] text-sm resize-none"
                      />
                    </div>
                    {/* Project SEO subforms */}
                    <div className="p-6 bg-gray-50/50 border border-gray-100 rounded-2xl space-y-4">
                      <p className="text-[9px] font-black capitalize text-gray-400 tracking-widest">Project Meta Tags (SEO Override)</p>
                      <div className="space-y-2">
                        <label className="text-[8px] font-black capitalize tracking-widest text-gray-400 ml-1">SEO Title</label>
                        <input 
                          type="text" value={fields.metaTitle || ""} 
                          onChange={(e) => setFields({ ...fields, metaTitle: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl outline-none font-bold text-xs text-[#5d5f61]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[8px] font-black capitalize tracking-widest text-gray-400 ml-1">SEO Description</label>
                        <input 
                          type="text" value={fields.metaDescription || ""} 
                          onChange={(e) => setFields({ ...fields, metaDescription: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl outline-none font-bold text-xs text-[#5d5f61]"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* 3. TESTIMONIALS FIELDS */}
                {moduleName === "testimonials" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black capitalize tracking-widest text-gray-400 ml-1">Author Name</label>
                      <input 
                        type="text" required value={fields.author || ""} 
                        onChange={(e) => setFields({ ...fields, author: e.target.value })}
                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-[#5d5f61] text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black capitalize tracking-widest text-gray-400 ml-1">Role / Designation</label>
                      <input 
                        type="text" value={fields.role || ""} 
                        onChange={(e) => setFields({ ...fields, role: e.target.value })}
                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-[#5d5f61] text-sm"
                        placeholder="e.g. Culinary Critic, Sanctuary Visitor"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black capitalize tracking-widest text-gray-400 ml-1">Testimonial Quote</label>
                      <textarea 
                        required value={fields.quote || ""} rows={3}
                        onChange={(e) => setFields({ ...fields, quote: e.target.value })}
                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-[#5d5f61] text-sm resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black capitalize tracking-widest text-gray-400 ml-1">Sanctuary rating score (1-5)</label>
                      <input 
                        type="number" min={1} max={5} required value={fields.rating || 5} 
                        onChange={(e) => setFields({ ...fields, rating: parseInt(e.target.value) || 5 })}
                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-[#5d5f61] text-sm"
                      />
                    </div>
                  </>
                )}

                {/* 4. FAQS FIELDS */}
                {moduleName === "faqs" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black capitalize tracking-widest text-gray-400 ml-1">Faq Question</label>
                      <input 
                        type="text" required value={fields.question || ""} 
                        onChange={(e) => setFields({ ...fields, question: e.target.value })}
                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-[#5d5f61] text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black capitalize tracking-widest text-gray-400 ml-1">Faq Answer</label>
                      <textarea 
                        required value={fields.answer || ""} rows={4}
                        onChange={(e) => setFields({ ...fields, answer: e.target.value })}
                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-[#5d5f61] text-sm resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black capitalize tracking-widest text-gray-400 ml-1">Faq Category classification</label>
                      <select 
                        value={fields.category || "General"} 
                        onChange={(e) => setFields({ ...fields, category: e.target.value })}
                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-[#5d5f61] text-sm cursor-pointer"
                      >
                        {getFaqCategories().filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </>
                )}

                {/* 5. GALLERY FIELDS */}
                {moduleName === "gallery" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black capitalize tracking-widest text-gray-400 ml-1">Photo Title</label>
                      <input 
                        type="text" required value={fields.title || ""} 
                        onChange={(e) => setFields({ ...fields, title: e.target.value })}
                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-[#5d5f61] text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black capitalize tracking-widest text-gray-400 ml-1">Asset Description</label>
                      <input 
                        type="text" value={fields.description || ""} 
                        onChange={(e) => setFields({ ...fields, description: e.target.value })}
                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-[#5d5f61] text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black capitalize tracking-widest text-gray-400 ml-1">Sanctuary Highlight category</label>
                      <select 
                        value={fields.category || "Sanctuary"} 
                        onChange={(e) => setFields({ ...fields, category: e.target.value })}
                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-[#5d5f61] text-sm cursor-pointer"
                      >
                        {getGalleryCategories().filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </>
                )}

                {/* Dynamic Image Upload Blocks (Except FAQs) */}
                {moduleName !== "faqs" && (
                  <div className="space-y-3">
                    <label className="text-[10px] font-black capitalize tracking-widest text-gray-400 ml-1">
                      {moduleName === "projects" ? "Primary Project Cover Image" : "Asset Image"}
                    </label>
                    <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                      <div className="relative w-24 h-24 bg-white rounded-2xl border border-gray-100 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                        {fields.image || fields.mainImage ? (
                          <img src={fields.image || fields.mainImage} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="text-gray-300" size={24} />
                        )}
                        {uploadingField === "image" && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <Loader2 className="animate-spin text-white" size={16} />
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2 text-center sm:text-left">
                        <p className="text-[10px] font-black text-[#5d5f61] uppercase tracking-wide">
                          Upload Dynamic Image Asset
                        </p>
                        <p className="text-[9px] font-bold text-gray-400">
                          {moduleName === "services" && "Recommended Size: 600x600px square ratio"}
                          {moduleName === "projects" && "Recommended Size: 1000x562px wide (16:9)"}
                          {moduleName === "gallery" && "Recommended Size: 1200x900px detail (4:3)"}
                          {moduleName === "testimonials" && "Recommended Size: 150x150px square avatar"}
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            if (fileInputRef.current) {
                              (fileInputRef.current as any).targetField = moduleName === "projects" ? "mainImage" : "image";
                              fileInputRef.current.click();
                            }
                          }}
                          className="flex items-center gap-2 bg-white text-[#5d5f61] px-5 py-2.5 rounded-xl border border-gray-100 shadow-sm text-[9px] font-black capitalize tracking-widest hover:bg-gray-100 transition-colors"
                        >
                          <Upload size={12} /> Choose Image
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Projects secondary image gallery list upload subform */}
                {moduleName === "projects" && (
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <label className="text-[10px] font-black capitalize tracking-widest text-gray-400 ml-1">Landscape Detail Photo Gallery</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {fields.gallery?.map((imgUrl: string, idx: number) => (
                        <div key={idx} className="relative aspect-video bg-gray-50 border border-gray-100 rounded-xl overflow-hidden group shadow-inner">
                          <img src={imgUrl} alt="Gallery" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              const updatedGallery = fields.gallery.filter((_: any, i: number) => i !== idx);
                              setFields({ ...fields, gallery: updatedGallery });
                            }}
                            className="absolute top-2 right-2 p-1.5 bg-white text-red-500 rounded-lg opacity-0 group-hover:opacity-100 hover:scale-110 transition-all shadow-md"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                      
                      <button
                        type="button"
                        onClick={() => {
                          if (fileInputRef.current) {
                            (fileInputRef.current as any).targetField = "gallery";
                            fileInputRef.current.click();
                          }
                        }}
                        className="aspect-video bg-gray-50 hover:bg-gray-100 rounded-xl border-2 border-dashed border-gray-200 hover:border-gray-300 flex flex-col items-center justify-center text-gray-300 gap-1.5 transition-all"
                      >
                        {uploadingField === "gallery" ? <Loader2 size={16} className="animate-spin text-[#c81c6a]" /> : <Plus size={16} />}
                        <span className="text-[8px] font-black uppercase tracking-widest">Add Photo</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Common Toggles */}
                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black capitalize tracking-widest text-gray-400 ml-1">Sanctuary Display Index</label>
                    <input 
                      type="number" required value={fields.order || 0} 
                      onChange={(e) => setFields({ ...fields, order: parseInt(e.target.value) || 0 })}
                      className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-[#5d5f61] text-sm"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl self-end h-14">
                    <span className="text-[10px] font-black capitalize tracking-widest text-[#5d5f61]">Publish Live</span>
                    <button
                      type="button"
                      onClick={() => setFields({ ...fields, isPublished: !fields.isPublished })}
                      className={`w-10 h-5 rounded-full p-0.5 transition-all duration-300
                        ${fields.isPublished ? "bg-emerald-500 flex justify-end" : "bg-gray-300 flex justify-start"}
                      `}
                    >
                      <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                    </button>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-8">
                  <button 
                    type="submit"
                    disabled={formSaving || uploadingField !== null}
                    className="w-full h-14 rounded-full bg-[#c81c6a] text-white font-medium text-[16px] hover:bg-[#a8195a] transition-colors flex items-center justify-between px-8 disabled:opacity-50 shadow-md group"
                  >
                    <span className="mx-auto">{formSaving ? "Saving..." : "Save Configuration"}</span>
                    {formSaving ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <Save size={20} strokeWidth={1.5} className="group-hover:translate-y-0.5 transition-transform" />
                    )}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hidden File Input for uploads */}
      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={(e) => {
          const target = (fileInputRef.current as any).targetField;
          if (target) handleAssetUpload(e, target);
        }}
        accept="image/*"
      />
    </div>
  );
}
