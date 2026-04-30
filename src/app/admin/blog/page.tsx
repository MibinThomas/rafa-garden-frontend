"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, FileText, Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { BlogForm } from "@/components/admin/BlogForm";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { BlogPost } from "@/lib/data";

export default function BlogManagementPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBlogFormOpen, setIsBlogFormOpen] = useState(false);
  const [isDeleteBlogOpen, setIsDeleteBlogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchBlogPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/blog");
      const data = await res.json();
      if (Array.isArray(data)) setBlogPosts(data);
    } catch (error) {
      console.error("Failed to fetch blog posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setIsBlogFormOpen(true);
  };

  const handleCreatePost = () => {
    setEditingPost(null);
    setIsBlogFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setIsDeleteBlogOpen(true);
  };

  const performDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/blog?id=${deletingId}`, { method: "DELETE" });
      if (res.ok) {
        fetchBlogPosts();
        setIsDeleteBlogOpen(false);
      }
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredPosts = blogPosts.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-24 relative">
      {/* Background Watermark */}
      <div className="absolute top-0 right-0 pointer-events-none opacity-[0.03] select-none -mt-10 -mr-20">
         <h1 className="text-[250px] font-black tracking-tighter leading-none text-[#0b2b1a]">BLOG</h1>
      </div>

      {/* Blog Header */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#c81c6a] font-black text-[10px] uppercase tracking-[0.5em] mb-4 ml-1"
          >
            Editorial Sanctuary
          </motion.p>
          <h1 className="text-6xl md:text-7xl font-black font-playfair text-[#0b2b1a] tracking-tighter">The Sidebar</h1>
        </div>

        <button 
          onClick={handleCreatePost}
          className="flex items-center gap-4 bg-[#0b2b1a] text-white px-10 py-5 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-[#0b2b1a]/20 hover:bg-[#c81c6a] hover:scale-105 active:scale-95 transition-all duration-500 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" /> Draft New Story
        </button>
      </div>

      {loading ? (
        <div className="py-32 text-center relative z-10">
          <div className="relative inline-block w-16 h-16 mb-6">
             <div className="absolute inset-0 border-4 border-gray-100 rounded-full" />
             <div className="absolute inset-0 border-4 border-[#c81c6a] border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-[12px] font-black uppercase tracking-[0.3em] text-[#5d5f61] animate-pulse">Syncing Editorial Archive...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10">
           {/* Search Bar */}
           <div className="col-span-full bg-white/50 backdrop-blur-md p-2 rounded-[3rem] border border-white shadow-xl shadow-black/[0.02] mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                <input 
                  type="text" placeholder="Search the botanical narratives..." value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-16 pr-8 py-6 bg-transparent outline-none text-sm font-bold text-[#0b2b1a] placeholder:text-gray-300"
                />
              </div>
           </div>

           {/* Post Grid */}
           <AnimatePresence mode="popLayout">
             {filteredPosts.map((post) => (
               <motion.div 
                 key={post.id} 
                 layout
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 className="bg-white/60 backdrop-blur-md group rounded-[3.5rem] border border-white overflow-hidden shadow-2xl shadow-black/[0.03] hover:shadow-black/[0.06] transition-all duration-700 flex flex-col h-[480px]"
               >
                  <div className="h-56 relative overflow-hidden bg-gray-100">
                    <img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" alt={post.title} />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="absolute top-6 left-6">
                       <div className="px-4 py-2 rounded-xl bg-white/90 backdrop-blur-md text-[9px] font-black uppercase tracking-widest text-[#0b2b1a] shadow-lg">
                         {post.category}
                       </div>
                    </div>
                  </div>
                  <div className="p-10 flex-1 flex flex-col relative">
                    <div className="flex justify-between items-start mb-4">
                       <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">{post.date}</span>
                       <div className="flex gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                          <button onClick={() => handleEditPost(post)} className="p-3.5 rounded-2xl bg-white text-[#0b2b1a] shadow-xl shadow-black/5 hover:bg-[#0b2b1a] hover:text-white transition-all duration-500"><Edit2 size={16}/></button>
                          <button onClick={() => handleDelete(post.id)} className="p-3.5 rounded-2xl bg-white text-red-500 shadow-xl shadow-black/5 hover:bg-red-500 hover:text-white transition-all duration-500"><Trash2 size={16}/></button>
                       </div>
                    </div>
                    <h3 className="text-2xl font-black font-playfair text-[#0b2b1a] mb-4 leading-tight group-hover:text-[#c81c6a] transition-colors duration-500">{post.title}</h3>
                    <p className="text-gray-400 text-[12px] leading-relaxed line-clamp-3 font-medium">{post.excerpt}</p>
                    
                    <div className="mt-auto pt-6 border-t border-gray-100/50 flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[9px] font-black text-[#0b2b1a] uppercase tracking-widest">Published</span>
                       </div>
                       <Link href="/blog" target="_blank" className="text-[10px] font-black text-[#c81c6a] uppercase tracking-widest hover:underline flex items-center gap-2">Read <ExternalLink size={12} /></Link>
                    </div>
                  </div>
               </motion.div>
             ))}
           </AnimatePresence>
        </div>
      )}

      {/* Logic Components */}
      <BlogForm isOpen={isBlogFormOpen} onClose={() => setIsBlogFormOpen(false)} post={editingPost} onSave={fetchBlogPosts} />
      <DeleteConfirmDialog isOpen={isDeleteBlogOpen} onClose={() => setIsDeleteBlogOpen(false)} onConfirm={performDelete} loading={isDeleting} />
    </div>
  );
}
