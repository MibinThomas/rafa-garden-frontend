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
        
        {/* Header Section */}
        <header className="-mb-[24px] md:-mb-[36px] lg:-mb-[48px] w-full mx-auto relative pt-12 z-10 flex flex-col">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end w-full px-4 lg:px-12 mb-2 md:mb-0">
            <h2 className="text-[28px] md:text-[36px] lg:text-[42px] leading-tight font-bold text-[#b0b0b0] tracking-tight" style={{ fontFamily: "inherit" }}>
              The Botanical Archive.
            </h2>
            <p className="text-[13px] md:text-[14px] lg:text-[15px] text-[#b0b0b0] max-w-[380px] text-left mt-4 md:mt-0 font-medium leading-relaxed" style={{ fontFamily: "inherit" }}>
              Exploring the convergence of heritage farming, wellness, <br className="hidden md:block" />and the majestic Pitaya sanctuary.
            </p>
          </div>
          <h1 className="text-[108px] md:text-[162px] lg:text-[234px] text-[#1b1c1c] opacity-10 whitespace-nowrap tracking-normal leading-none select-none pointer-events-none text-center" style={{ fontFamily: "'DharmaGothic', sans-serif", fontWeight: 700 }}>
            Rafah Insights.
          </h1>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[1200px] h-[120%] bg-[#efeded] -z-10 rounded-full blur-[100px] opacity-30"></div>
        </header>

        {/* Featured Articles Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 space-y-4 relative z-20">
            <Loader2 className="w-10 h-10 text-[#9c0045] animate-spin" />
          </div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-[120px] px-4 relative z-20">
            {displayPosts.map((post, index) => (
              <article key={post.id || index} className="flex flex-col group">
                <div className="relative w-full flex justify-end mb-8">
                  {/* Background Curved Lines (SVG) */}
                  <svg className="absolute left-0 top-[8%] w-[50%] h-[32%] z-0 pointer-events-none transition-transform duration-700 group-hover:-translate-x-2" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" rx="40" fill="none" stroke="#d2d2d2" strokeWidth="1.5" className="transition-colors duration-500 group-hover:stroke-[#9c0045]" />
                  </svg>
                  
                  <svg className="absolute left-0 -bottom-[8%] w-[85%] h-[38%] z-0 pointer-events-none transition-transform duration-700 group-hover:-translate-x-2" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" rx="40" fill="none" stroke="#d2d2d2" strokeWidth="1.5" className="transition-colors duration-500 group-hover:stroke-[#9c0045]" />
                  </svg>

                  <div className="relative w-[85%] aspect-[3/4] overflow-hidden rounded-[40px] bg-[#efeded] z-10 transition-transform duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]">
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
        <section className="w-[100vw] relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] bg-[#EEEEEE] py-24 md:py-32 overflow-hidden z-10 mt-[80px]">
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <h3 className="text-[40px] md:text-[64px] tracking-tight leading-[1.1] font-bold text-[#757575] mb-4" style={{ fontFamily: "inherit" }}>
              Stay Planted in our Garden.
            </h3>
            <p className="text-[15px] md:text-[17px] leading-[24px] text-[#A3A3A3] mb-12 max-w-2xl mx-auto font-light" style={{ fontFamily: "inherit" }}>
              Join our Botanical VIP list for exclusive insights into heritage cultivation, early harvest alerts, and exotic lifestyle tips.
            </p>
            <form className="flex flex-row max-w-[500px] mx-auto bg-[#E0E0E0] p-1.5 rounded-2xl" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="email..." 
                required 
                className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-[16px] text-[#757575] placeholder:text-[#A3A3A3] px-6 py-3"
                style={{ fontFamily: "inherit" }}
              />
              <button 
                type="submit" 
                className="bg-[#C81E5B] text-white text-[16px] leading-[20px] font-normal px-8 py-3 rounded-[12px] hover:bg-[#a8194d] transition-colors inline-flex items-center justify-center space-x-2"
                style={{ fontFamily: "inherit" }}
              >
                <span>Subscribe</span>
                <ArrowRight size={18} strokeWidth={1.5} />
              </button>
            </form>
          </div>
        </section>

      </main>
    </div>
  );
}
