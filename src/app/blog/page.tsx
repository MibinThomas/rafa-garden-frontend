"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { BlogPost } from "@/lib/data";
import { ArrowRight, Calendar, Clock, Loader2 } from "lucide-react";

export default function BlogListingPage() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [subEmail, setSubEmail] = useState("");
  const [subStatus, setSubStatus] = useState<"idle" | "submitting" | "success">("idle");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/blog");
        const data = await res.json();
        if (Array.isArray(data)) {
          setPosts(data.filter((p: any) => p.isPublished !== false));
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f1f2] selection:bg-[#c81c6a] selection:text-white">
      {/* Cinematic Hero Section */}
      <section className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden bg-[#0b2b1a] text-white">
        {/* Background Image with Parallax & Blur */}
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 z-0"
        >
          <Image 
            src="/images/blog/farming_philosophy.jpg" 
            alt="Rafah Garden Heritage" 
            fill 
            className="object-cover"
            priority
          />
        </motion.div>
        
        {/* Dark Grainy Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#f1f1f2] z-1" />

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.5em] mb-4 block text-[#c81c6a]">
              The Botanical Archive
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-playfair tracking-tighter mb-6 leading-none">
              Rafah <span className="italic">Insights.</span>
            </h1>
            <p className="text-lg md:text-xl opacity-70 font-inter font-light leading-relaxed max-w-2xl mx-auto">
              Exploring the convergence of heritage farming, wellness, and the majestic Pitaya sanctuary.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Article Collection Section */}
      <section className="max-w-[1700px] mx-auto w-full px-6 md:px-12 -mt-24 pb-32 relative z-20">
        
        {/* Premium Rounded Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
          className="relative bg-white/80 backdrop-blur-3xl p-8 sm:p-16 lg:p-24 rounded-[3.5rem] sm:rounded-[5rem] shadow-[0_50px_100px_rgba(0,0,0,0.05)] border border-white/50"
        >
          {loading ? (
             <div className="flex flex-col items-center justify-center py-32 space-y-6">
                <Loader2 className="w-12 h-12 text-[#c81c6a] animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Consulting the Sages...</p>
             </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16"
            >
              {posts.map((post: BlogPost, index: number) => (
                <motion.article
                  key={post.id}
                  variants={itemVariants}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="group flex flex-col h-full"
                >
                  <Link href={`/blog/${post.slug}`} className="flex flex-col h-full group">
                    {/* Image Container with Elegant Mask */}
                    <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-8 shadow-2xl transition-transform duration-700 group-hover:scale-[1.02] group-hover:-translate-y-2">
                      {post.image && (
                        <Image 
                          src={post.image} 
                          alt={post.title} 
                          fill 
                          className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                      )}
                      
                      {/* Category Badge */}
                      <div className="absolute top-6 left-6 z-10">
                        <span 
                          className="px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-md shadow-lg"
                          style={{ backgroundColor: `${post.accentColor || '#c81c6a'}cc` }}
                        >
                          {post.category}
                        </span>
                      </div>

                      {/* Subtle Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>

                    {/* Text Content */}
                    <div className="flex-1 px-2">
                      <div className="flex items-center gap-4 mb-4 opacity-40 text-[10px] font-bold uppercase tracking-widest">
                        <span className="flex items-center gap-1.5"><Calendar size={12} strokeWidth={3} /> {post.date}</span>
                        <span className="flex items-center gap-1.5"><Clock size={12} strokeWidth={3} /> {post.readingTime}</span>
                      </div>
                      
                      <h2 className="text-2xl sm:text-3xl font-bold font-playfair text-gray-900 mb-4 leading-tight group-hover:text-[#c81c6a] transition-colors duration-300">
                        {post.title}
                      </h2>
                      
                      <p className="text-sm sm:text-base text-gray-500 font-inter font-light leading-relaxed mb-6 line-clamp-3">
                        {post.excerpt}
                      </p>

                      <div className="mt-auto flex items-center gap-2 text-[#c81c6a] text-[10px] font-black uppercase tracking-[0.2em] group-hover:gap-4 transition-all duration-300">
                        Read Full Article <ArrowRight size={14} strokeWidth={3} />
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Newsletter / CTA Section */}
      <section className="py-24 max-w-4xl mx-auto px-6 text-center">
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
         >
           <h3 className="text-3xl font-playfair font-black mb-6">Stay Planted in our Garden.</h3>
           <p className="text-gray-500 mb-10 font-light max-w-lg mx-auto leading-relaxed">
             Join our Botanical VIP list for exclusive insights into heritage cultivation, early harvest alerts, and exotic lifestyle tips.
           </p>
           
           <AnimatePresence mode="wait">
             {subStatus === "success" ? (
               <motion.div
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="flex flex-col items-center justify-center space-y-4"
               >
                 <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-inner">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                 </div>
                 <p className="text-xs font-black uppercase tracking-[0.2em] text-green-600">You're on the list!</p>
               </motion.div>
             ) : (
               <form 
                 onSubmit={async (e) => {
                   e.preventDefault();
                   if (!subEmail || subStatus === "submitting") return;
                   setSubStatus("submitting");
                   try {
                     const res = await fetch("/api/subscriptions", {
                       method: "POST",
                       headers: { "Content-Type": "application/json" },
                       body: JSON.stringify({ email: subEmail })
                     });
                     if (res.ok) setSubStatus("success");
                     else throw new Error("Subscription failed");
                   } catch (err) {
                     console.error(err);
                     alert("Something went wrong. Please try again.");
                     setSubStatus("idle");
                   }
                 }}
                 className="flex flex-col sm:flex-row gap-4 justify-center items-center"
               >
                 <input 
                   required
                   type="email" 
                   value={subEmail}
                   onChange={(e) => setSubEmail(e.target.value)}
                   disabled={subStatus === "submitting"}
                   placeholder="Enter your email sanctuary" 
                   className="w-full sm:w-auto px-8 py-5 rounded-2xl bg-white border border-gray-200 focus:outline-none focus:border-[#c81c6a] transition-all text-sm font-inter disabled:opacity-50"
                 />
                 <button 
                   type="submit"
                   disabled={subStatus === "submitting"}
                   className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-[#c81c6a] text-white font-bold tracking-widest uppercase text-xs hover:bg-[#9a0c52] transition-colors shadow-xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                 >
                   {subStatus === "submitting" ? "Syncing..." : "Subscribe"}
                 </button>
               </form>
             )}
           </AnimatePresence>
         </motion.div>
      </section>
    </div>
  );
}
