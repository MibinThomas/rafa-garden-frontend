"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { motion, useScroll, useSpring } from "framer-motion";
import { BlogPost } from "@/lib/data";
import { ArrowLeft, ArrowRight, Clock, Calendar, User, Share2, Instagram, MessageCircle, Loader2 } from "lucide-react";

export default function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
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
            setRelatedPosts(data.filter((p: any) => p.slug !== resolvedParams.slug).slice(0, 2));
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

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0b2b1a] text-white">
        <Loader2 className="w-12 h-12 text-[#c81c6a] animate-spin mb-6" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Consulting the Sages...</p>
      </div>
    );
  }

  if (!post) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-white selection:bg-[#c81c6a] selection:text-white pb-32">
      {/* Reading Progress Indicator */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1.5 bg-[#c81c6a] origin-left z-50 rounded-r-full"
        style={{ scaleX }}
      />

      {/* Immersive Detail Header */}
      <section className="relative w-full h-[60vh] sm:h-[80vh] flex items-end justify-center overflow-hidden bg-[#0b2b1a]">
        {/* Hero Backdrop */}
        <motion.div 
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          {post.image && (
            <Image 
              src={post.image} 
              alt={post.title} 
              fill 
              className="object-cover blur-[2px]"
            />
          )}
        </motion.div>

        {/* Gradient Transition to White Content */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/40 z-1" />

        {/* Header Metadata */}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 pb-20 sm:pb-32 text-center sm:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Link 
              href="/blog"
              className="inline-flex items-center gap-2 mb-8 text-[#0b2b1a] bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/20 hover:bg-white hover:text-black transition-all group"
            >
              <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" /> Back to Archive
            </Link>

            <span 
              className="inline-block px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] text-white mb-6 shadow-xl"
              style={{ backgroundColor: post.accentColor || '#c81c6a' }}
            >
              {post.category}
            </span>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black font-playfair tracking-tighter mb-8 leading-[1.1] text-[#0b2b1a]">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 sm:gap-10 opacity-60 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#0b2b1a]">
              <span className="flex items-center gap-2"><User size={14} /> Rafah Sanctuary</span>
              <span className="flex items-center gap-2"><Calendar size={14} /> {post.date}</span>
              <span className="flex items-center gap-2"><Clock size={14} /> {post.readingTime}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="relative z-20 max-w-4xl mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_80px] gap-12">
          
          {/* Article Content */}
          <motion.article
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="prose prose-lg sm:prose-xl max-w-none font-inter text-gray-700 leading-relaxed font-light"
          >
            {/* Subtitle / Excerpt as Lead-in */}
            <p className="text-2xl sm:text-3xl font-playfair font-medium text-[#0b2b1a] italic border-l-4 pl-8 mb-16" style={{ borderColor: post.accentColor || '#c81c6a' }}>
              "{post.excerpt}"
            </p>

            <div className="whitespace-pre-line">
              {post.content}
            </div>

            <p className="mt-16 text-gray-400 font-light italic">
               Our commitment at Rafah Garden remains unchanged: to bring the purest botanical wonders from our soil to your soul. Every harvest is a story of patience, and every fruit is a masterpiece of nature's design. Stay tuned as we continue to unlock the secrets of the dragon fruit garden.
            </p>
          </motion.article>

          {/* Vertical Sticky Social Sidebar */}
          <aside className="hidden lg:flex flex-col gap-6 sticky top-32 h-fit items-center">
            <span className="text-[9px] uppercase font-black vertical-text tracking-widest opacity-20 origin-center">Share</span>
            <button className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#c81c6a] hover:border-[#c81c6a] transition-all shadow-sm">
              <Instagram size={20} />
            </button>
            <button className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#25D366] hover:border-[#25D366] transition-all shadow-sm">
              <MessageCircle size={20} />
            </button>
            <button className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-white hover:bg-black hover:border-black transition-all shadow-sm">
              <Share2 size={20} />
            </button>
          </aside>
        </div>
      </section>

      {/* Footer Navigation: Related Posts */}
      <section className="bg-[#f1f1f2] mt-32 py-32">
        <div className="max-w-[1700px] mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between mb-16">
            <h3 className="text-3xl sm:text-4xl font-black font-playfair tracking-tight">More from the <span className="italic">Sanctuary.</span></h3>
            <Link href="/blog" className="text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:gap-6 transition-all underline decoration-[#c81c6a] decoration-2 underline-offset-8">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {relatedPosts.map((rPost) => (
              <Link key={rPost.id} href={`/blog/${rPost.slug}`} className="group block">
                <div className="relative aspect-[16/9] rounded-[3rem] overflow-hidden mb-8 shadow-xl">
                  {rPost.image && <Image src={rPost.image} alt={rPost.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                </div>
                <h4 className="text-2xl sm:text-3xl font-bold font-playfair mb-4 leading-tight group-hover:text-[#c81c6a] transition-colors">{rPost.title}</h4>
                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest opacity-40">
                  <span>{rPost.date}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  <span>{rPost.readingTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

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
