"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { BlogPost } from "@/lib/data";
import { Share2, Instagram, MessageCircle, Loader2 } from "lucide-react";

export default function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch("/api/blog");
        const data = await res.json();
        
        if (Array.isArray(data)) {
          const found = data.find((p: any) => p.slug === resolvedParams.slug);
          if (found) {
            setPost(found);
          } else {
            return notFound();
          }
        }
      } catch (error) {
        console.error("Failed to fetch post:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [resolvedParams.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#e6e7e8] text-[#1b1c1c]">
        <Loader2 className="w-12 h-12 text-[#c81c6a] animate-spin mb-6" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Loading Story...</p>
      </div>
    );
  }

  if (!post) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-[#e6e7e8] text-[#1b1c1c] selection:bg-[#c81c6a] selection:text-white pb-32 overflow-x-hidden font-inter">
      
      <main className="max-w-[1700px] mx-auto px-6 md:px-12 pt-32 md:pt-40">
        
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row gap-6 md:gap-12 items-stretch">
          
          {/* Main Hero Image */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 relative aspect-[4/3] lg:aspect-[2/1] rounded-[2rem] overflow-hidden shadow-2xl"
          >
            {post.image && (
              <Image 
                src={post.image} 
                alt={post.title} 
                fill 
                className="object-cover"
                priority
              />
            )}
            
            {/* Full Gradient Overlay for Mood and Legibility */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/90 via-black/40 to-black/20 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

            {/* Inset Title */}
            <div className="absolute bottom-6 left-6 md:bottom-12 md:left-12 pr-6 md:pr-12">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white max-w-4xl leading-[1.1] tracking-tight">
                {post.title}
              </h1>
            </div>
          </motion.div>

          {/* Social Share Sidebar */}
          <motion.aside 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:flex flex-col items-center justify-center gap-8 px-2"
          >
            <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#a3a3a3] vertical-text">Share</span>
            <div className="w-[1px] h-12 bg-[#cccccc] opacity-50" />
            
            <button className="w-12 h-12 rounded-full border border-[#cccccc] flex items-center justify-center text-[#888888] hover:text-white hover:bg-[#c81c6a] hover:border-[#c81c6a] transition-all shadow-sm">
              <Instagram size={18} strokeWidth={1.5} />
            </button>
            <button className="w-12 h-12 rounded-full border border-[#cccccc] flex items-center justify-center text-[#888888] hover:text-white hover:bg-[#25D366] hover:border-[#25D366] transition-all shadow-sm">
              <MessageCircle size={18} strokeWidth={1.5} />
            </button>
            <button className="w-12 h-12 rounded-full border border-[#cccccc] flex items-center justify-center text-[#888888] hover:text-white hover:bg-[#555555] hover:border-[#555555] transition-all shadow-sm">
              <Share2 size={18} strokeWidth={1.5} />
            </button>
          </motion.aside>

          {/* Mobile Social Share (Horizontal) */}
          <div className="flex lg:hidden items-center justify-center gap-6 mt-4">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#a3a3a3]">Share:</span>
            <button className="w-10 h-10 rounded-full border border-[#cccccc] flex items-center justify-center text-[#888888] hover:text-[#c81c6a]">
              <Instagram size={16} />
            </button>
            <button className="w-10 h-10 rounded-full border border-[#cccccc] flex items-center justify-center text-[#888888] hover:text-[#25D366]">
              <MessageCircle size={16} />
            </button>
            <button className="w-10 h-10 rounded-full border border-[#cccccc] flex items-center justify-center text-[#888888] hover:text-[#555555]">
              <Share2 size={16} />
            </button>
          </div>
        </div>

        {/* Full-width Horizontal Divider */}
        <div className="w-[100vw] relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] border-t border-[#d2d2d2] mt-16 md:mt-24" />

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-0 pt-16 lg:pt-0">
          
          {/* Left Column: Subtitle & Body */}
          <motion.article 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="lg:col-span-7 flex flex-col lg:pt-24 lg:pr-20"
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl text-[#555555] font-light leading-snug mb-8">
              {post.excerpt}
            </h2>
            
            <div className="text-[#757575] font-light text-[15px] leading-relaxed whitespace-pre-line">
              {post.content}
            </div>
          </motion.article>

          {/* Right Column: Highlight Quote */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="lg:col-span-5 flex flex-col lg:pt-24 lg:pl-20 lg:border-l border-[#d2d2d2]"
          >
            {/* Custom Hollow Pink Quote Icon built with Tailwind */}
            <div className="flex gap-5 mb-10 ml-6">
              <div 
                className="w-[55px] h-[115px] border-[1px] border-[#c81c6a] rounded-tl-[24px] rounded-br-[24px] rounded-tr-[10%] rounded-bl-[10%]" 
                style={{ transform: "perspective(180px) rotateX(-10deg) skewX(24deg)" }}
              />
              <div 
                className="w-[55px] h-[115px] border-[1px] border-[#c81c6a] rounded-tl-[24px] rounded-br-[24px] rounded-tr-[10%] rounded-bl-[10%]" 
                style={{ transform: "perspective(180px) rotateX(-10deg) skewX(24deg)" }}
              />
            </div>

            <p className="text-[#555555] font-light text-[15px] leading-relaxed">
              Our commitment at Rafah Garden remains unchanged: to bring the purest botanical wonders from our soil to your soul. Every harvest is a story of patience, and every fruit is a masterpiece of nature's design. Stay tuned as we continue to unlock the secrets of the dragon fruit garden.
            </p>
          </motion.div>
          
        </div>

      </main>

      {/* Internal Custom CSS for vertical text */}
      <style jsx>{`
        .vertical-text {
          writing-mode: vertical-rl;
          text-orientation: mixed;
          transform: rotate(180deg);
        }
      `}</style>
    </div>
  );
}
