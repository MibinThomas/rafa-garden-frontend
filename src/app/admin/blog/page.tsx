"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, FileText, Loader2 } from "lucide-react";
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
    <div className="space-y-8 pb-12">
      {/* Blog Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black font-playfair text-[#0b2b1a] mb-3 tracking-tighter">The Sidebar Blog</h1>
          <p className="text-[#bbbdbf] font-bold text-[10px] uppercase tracking-[0.4em] ml-1">Curate cinematic stories & botanical narratives</p>
        </div>

        <button 
          onClick={handleCreatePost}
          className="flex items-center gap-3 bg-[#c81c6a] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:brightness-110 active:scale-95 transition-all"
        >
          <Plus size={18} /> Draft Sidebar Post
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block w-8 h-8 border-4 border-[#c81c6a] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-[10px] font-black uppercase tracking-widest text-[#bbbdbf]">Syncing Editorial Archive...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {/* Search Bar */}
           <div className="col-span-full bg-white p-4 rounded-3xl border border-gray-100 mb-2 flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  type="text" placeholder="Search The Sidebar Blog..." value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 py-4 bg-gray-50/50 rounded-2xl outline-none text-sm font-bold text-[#0b2b1a]"
                />
              </div>
           </div>

           {/* Post Grid */}
           <AnimatePresence>
             {filteredPosts.map((post) => (
               <motion.div 
                 key={post.id} 
                 layout
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.9 }}
                 className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm flex flex-col h-[400px]"
               >
                  <div className="h-48 relative overflow-hidden bg-gray-100">
                    <img src={post.image} className="w-full h-full object-cover" alt={post.title} />
                    <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[9px] font-black uppercase tracking-widest text-[#0b2b1a]">
                      {post.category}
                    </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <h3 className="text-xl font-black font-playfair text-[#0b2b1a] mb-2 line-clamp-2">{post.title}</h3>
                    <p className="text-gray-400 text-[11px] leading-relaxed line-clamp-3 mb-6">{post.excerpt}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{post.date}</span>
                      <div className="flex gap-2">
                         <button onClick={() => handleEditPost(post)} className="p-2.5 rounded-xl bg-gray-50 text-[#0b2b1a] hover:bg-[#0b2b1a] hover:text-white transition-all"><Edit2 size={14}/></button>
                         <button onClick={() => handleDelete(post.id)} className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={14}/></button>
                      </div>
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
