"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/lib/data";
import { Loader2, ArrowRight } from "lucide-react";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export default function BlogListingPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

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

  const displayPosts = posts.slice(0, 3);

  return (
    <div className={`min-h-screen bg-[#fbf9f9] text-[#1b1c1c] selection:bg-[#c21e5c] selection:text-[#ffdce1] overflow-x-hidden ${plusJakartaSans.className}`}>
      <main className="pb-24 px-[32px] max-w-[1440px] mx-auto pt-12 relative" style={{ fontFamily: "inherit" }}>
        
        {/* Watermark Background Text */}
        <div className="absolute top-[280px] left-1/2 transform -translate-x-1/2 w-full text-center z-0 pointer-events-none select-none">
          <span className="text-[120px] md:text-[180px] lg:text-[260px] font-extrabold text-[#1b1c1c] opacity-10 whitespace-nowrap tracking-tighter leading-none" style={{ fontFamily: "inherit" }}>
            Rafah Insights.
          </span>
        </div>

        {/* Header Section */}
        <header className="mb-[120px] text-center max-w-4xl mx-auto relative pt-12 z-10">
          <h2 className="text-[16px] leading-[20px] font-semibold text-[#9c0045] mb-4 uppercase tracking-widest" style={{ fontFamily: "inherit" }}>
            The Botanical Archive
          </h2>
          <h1 className="text-[90px] md:text-[160px] leading-[1] md:leading-[140px] font-extrabold tracking-[-0.04em] text-[#1b1c1c] relative z-10" style={{ fontFamily: "inherit" }}>
            Rafah <br/> Insights
          </h1>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#efeded] -z-10 rounded-full blur-[100px] opacity-30"></div>
        </header>

        {/* Featured Articles Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 space-y-4 relative z-10">
            <Loader2 className="w-10 h-10 text-[#9c0045] animate-spin" />
          </div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-[120px] px-4 relative z-10">
            {displayPosts.map((post, index) => (
              <article key={post.id || index} className="flex flex-col group">
                <div className="relative w-full aspect-[3/4] mb-8 pl-4 pt-4">
                  <div className="absolute inset-0 border border-[#e1bec4] rounded-[40px] transform -translate-x-4 -translate-y-4"></div>
                  <div className="relative w-full h-full overflow-hidden rounded-[40px] bg-[#efeded]">
                    {post.image ? (
                      <Image 
                        src={post.image} 
                        alt={post.title} 
                        fill 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#e4e2e2]" />
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col flex-1">
                  <h3 className="text-[24px] md:text-[32px] leading-[1.2] md:leading-[40px] font-semibold text-[#1b1c1c] mb-4 group-hover:text-[#9c0045] transition-colors" style={{ fontFamily: "inherit" }}>
                    {post.title}
                  </h3>
                  <p className="text-[14px] leading-[22px] text-[#594045] mb-6 text-opacity-70 line-clamp-3" style={{ fontFamily: "inherit" }}>
                    {post.excerpt}
                  </p>
                  <div className="mt-auto">
                    <Link 
                      href={`/blog/${post.slug}`} 
                      className="inline-flex items-center space-x-2 text-[14px] md:text-[16px] leading-[20px] font-semibold bg-[#c21e5c] text-white px-6 py-2.5 rounded-full hover:bg-[#8f003f] transition-colors w-max"
                      style={{ fontFamily: "inherit" }}
                    >
                      <span>Read Full Article</span>
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}

        {/* Newsletter Section */}
        <section className="bg-[#DCE3E0] rounded-[24px] p-10 md:p-16 lg:p-24 text-center max-w-5xl mx-auto my-[120px] relative overflow-hidden z-10">
          <div className="relative z-10">
            <h3 className="text-[36px] md:text-[48px] leading-[1.1] md:leading-[56px] font-bold tracking-[-0.02em] text-[#0e1f15] mb-4" style={{ fontFamily: "inherit" }}>
              Stay Planted in our Garden
            </h3>
            <p className="text-[16px] md:text-[18px] leading-[28px] text-[#55675a] mb-8 max-w-lg mx-auto" style={{ fontFamily: "inherit" }}>
              Join our botanical archive for weekly insights on sustainable luxury, rare recipes, and heritage farming.
            </p>
            <form className="flex flex-col sm:flex-row max-w-md mx-auto bg-[#fbf9f9] p-2 rounded-full shadow-sm" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Your email address" 
                required 
                className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-[14px] leading-[22px] text-[#1b1c1c] px-6 py-3"
                style={{ fontFamily: "inherit" }}
              />
              <button 
                type="submit" 
                className="bg-[#9c0045] text-white text-[16px] leading-[20px] font-semibold px-8 py-3 rounded-full hover:bg-[#8f003f] transition-colors inline-flex items-center justify-center space-x-2 mt-2 sm:mt-0"
                style={{ fontFamily: "inherit" }}
              >
                <span>Subscribe</span>
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
          
          {/* Decorative blur element behind text */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white rounded-full blur-[80px] opacity-40 z-0 pointer-events-none"></div>
        </section>

      </main>
    </div>
  );
}
