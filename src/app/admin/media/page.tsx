"use client";

import React, { useState, useEffect, useRef } from "react";
import { Upload, Trash2, Copy, Check, Search, Image as ImageIcon, Loader2, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MediaBlob {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: string;
}

export default function MediaLibraryPage() {
  const [mediaList, setMediaList] = useState<MediaBlob[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [deletingUrl, setDeletingUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/media");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setMediaList(data);
        }
      }
    } catch (err) {
      console.error("Failed to load media list:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
          method: "POST",
          body: file
        });
        if (!res.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }
      }
      fetchMedia();
    } catch (err: any) {
      alert(err.message || "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (url: string) => {
    if (!confirm("Are you sure you want to permanently delete this media asset? This action cannot be undone and may break pages containing this image.")) return;
    setDeletingUrl(url);
    try {
      const res = await fetch(`/api/admin/media?url=${encodeURIComponent(url)}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setMediaList(prev => prev.filter(m => m.url !== url));
      }
    } catch (err) {
      console.error("Delete media error:", err);
      alert("Failed to delete media asset");
    } finally {
      setDeletingUrl(null);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const filteredMedia = mediaList.filter(m =>
    m.pathname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-12 pb-24 relative">
      {/* Background Watermark */}
      <div className="absolute top-0 right-0 pointer-events-none opacity-[0.03] select-none -mt-10 -mr-10 md:-mr-20">
         <h1 className="text-[120px] md:text-[250px] font-black tracking-tighter leading-none text-[#5d5f61]">LIBRARY</h1>
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 relative z-10">
        <div>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#c81c6a] font-black text-[10px] capitalize tracking-[0.5em] mb-2 md:mb-4 ml-1"
          >
            Asset Repository
          </motion.p>
          <h1 className="text-4xl md:text-7xl font-black font-playfair text-[#5d5f61] tracking-tighter">Media Library</h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={fetchMedia}
            disabled={loading}
            className="p-5 bg-white border border-gray-100 shadow-xl shadow-black/[0.01] rounded-[2rem] text-[#5d5f61] hover:text-[#c81c6a] hover:scale-105 active:scale-95 disabled:opacity-50 transition-all"
            title="Refresh assets list"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-4 bg-[#5d5f61] text-white px-10 py-5 rounded-[2rem] font-black text-xs capitalize tracking-[0.2em] shadow-2xl shadow-[#5d5f61]/20 hover:bg-[#c81c6a] hover:scale-105 active:scale-95 transition-all duration-500 disabled:opacity-50"
          >
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            {uploading ? "Uploading..." : "Upload Assets"}
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleUpload} 
            multiple 
            accept="image/*" 
            className="hidden" 
          />
        </div>
      </div>

      {/* Upload Guidelines widget */}
      <div className="bg-white/40 backdrop-blur-md rounded-[3rem] border border-white p-8 relative z-10 shadow-xl shadow-black/[0.02] grid grid-cols-1 md:grid-cols-4 gap-6 text-[11px] font-bold text-[#5d5f61] leading-relaxed capitalize tracking-wide">
        <div className="p-4 bg-white/50 rounded-2xl border border-gray-50 shadow-inner">
          <p className="text-[#c81c6a] font-black mb-1.5">Hero Banners</p>
          <p className="text-gray-400 font-medium normal-case">Optimal Size: 1200x800px (Max 500KB)<br/>Transparent PNG or WebP</p>
        </div>
        <div className="p-4 bg-white/50 rounded-2xl border border-gray-50 shadow-inner">
          <p className="text-[#c81c6a] font-black mb-1.5">Products / Categories</p>
          <p className="text-gray-400 font-medium normal-case">Optimal Size: 600x600px (Max 250KB)<br/>1:1 square ratio WebP</p>
        </div>
        <div className="p-4 bg-white/50 rounded-2xl border border-gray-50 shadow-inner">
          <p className="text-[#c81c6a] font-black mb-1.5">Projects / Gallery</p>
          <p className="text-gray-400 font-medium normal-case">Optimal Size: 1000x562px / 1200x900px<br/>Aspect ratio: 16:9 or 4:3</p>
        </div>
        <div className="p-4 bg-white/50 rounded-2xl border border-gray-50 shadow-inner">
          <p className="text-[#c81c6a] font-black mb-1.5">SEO Meta Images</p>
          <p className="text-gray-400 font-medium normal-case">Optimal Size: 1200x630px (Max 300KB)<br/>Standard OpenGraph ratio</p>
        </div>
      </div>

      {/* Control Bar: Search */}
      <div className="bg-white/50 backdrop-blur-md p-2 rounded-[3rem] border border-white shadow-xl shadow-black/[0.02] relative z-10">
        <div className="flex items-center relative">
          <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
          <input
            type="text" 
            placeholder="Search assets by name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-16 pr-8 py-6 bg-transparent rounded-[2.5rem] outline-none text-sm font-bold text-[#5d5f61] placeholder:text-gray-300"
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-32 text-center relative z-10">
          <div className="relative inline-block w-16 h-16 mb-6">
             <div className="absolute inset-0 border-4 border-gray-100 rounded-full" />
             <div className="absolute inset-0 border-4 border-[#c81c6a] border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-[12px] font-black capitalize tracking-[0.3em] text-[#5d5f61] animate-pulse">Syncing Cloud Media...</p>
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="py-32 text-center bg-white/40 backdrop-blur-md rounded-[3.5rem] border border-white shadow-2xl relative z-10">
          <div className="w-20 h-20 bg-white border border-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
             <ImageIcon className="text-gray-200" size={32} />
          </div>
          <h3 className="text-2xl font-black font-playfair text-[#5d5f61] mb-2">No Assets Found</h3>
          <p className="text-[10px] font-bold text-gray-400 capitalize tracking-widest max-w-xs mx-auto">Upload media assets to get started or refine your search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 relative z-10">
          <AnimatePresence mode="popLayout">
            {filteredMedia.map((blob) => {
              const isCopied = copiedUrl === blob.url;
              const isDeleting = deletingUrl === blob.url;
              
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={blob.url}
                  className="bg-white/60 backdrop-blur-md rounded-[2.5rem] border border-white overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group flex flex-col h-[280px]"
                >
                  {/* Thumbnail */}
                  <div className="flex-1 bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden group">
                    <img 
                      src={blob.url} 
                      alt={blob.pathname} 
                      className="max-w-full max-h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-500" 
                    />
                    
                    {/* Copy/Delete hover overlays */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                      <button
                        onClick={() => copyToClipboard(blob.url)}
                        className="p-3.5 bg-white text-[#5d5f61] hover:text-[#c81c6a] hover:scale-110 rounded-xl shadow-lg transition-all"
                        title="Copy Vercel Blob URL"
                      >
                        {isCopied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                      </button>
                      
                      <button
                        onClick={() => handleDelete(blob.url)}
                        disabled={isDeleting}
                        className="p-3.5 bg-white text-red-400 hover:bg-red-500 hover:text-white hover:scale-110 rounded-xl shadow-lg transition-all disabled:opacity-50"
                        title="Delete Asset"
                      >
                        {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                      </button>
                    </div>
                  </div>
                  
                  {/* Info block */}
                  <div className="p-6 border-t border-gray-50 bg-white/40 flex flex-col justify-center">
                    <p className="text-[11px] font-black text-[#5d5f61] truncate" title={blob.pathname}>
                      {blob.pathname.split("/").pop()}
                    </p>
                    <div className="flex justify-between items-center mt-2 text-[9px] font-bold text-gray-400 tracking-wider uppercase">
                      <span>{formatSize(blob.size)}</span>
                      <span>{new Date(blob.uploadedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
