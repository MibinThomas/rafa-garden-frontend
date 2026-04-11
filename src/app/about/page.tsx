"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useHeaderColor } from "@/lib/HeaderColorContext";
import { Leaf, Award, Recycle, ArrowRight, Zap, Droplets } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const { setIsImmersive, setHeaderColor, headerColor } = useHeaderColor();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [content, setContent] = useState<Record<string, any>>({
    "about.hero.small": "The Dragon Fruit Heritage",
    "about.hero.main": "Vibrant Nature. Premium Harvest.",
    "about.hero.desc": "Step into the Rafah Dragon Fruit Garden—where ancient heritage meets modern sustainable cultivation for an unparalleled exotic experience.",
    "about.story.small": "Our Dragon Fruit Story",
    "about.story.main": "Cultivating the Jewel of the Tropical Garden.",
    "about.story.p1": "Nestled in the heart of our botanical sanctuary lies the Dragon Fruit Garden. Here, we've perfected the art of cultivating the Pitaya, blending centuries-old wisdom with modern vertical farming technology.",
    "about.story.p2": "Every dragon fruit at Rafah is a testament to biodiversity. From the vivid red varieties to the pristine yellow exports, our garden produces a spectrum of flavors designed to elevate your palate and nourish your soul.",
    "about.story.image": "/images/about/ngoc-nguyen-phuong-qNOuWqisUQ0-unsplash.jpg",
    "about.values.title": "Crafted with Precision",
    "about.values.desc": "Our dragon fruit garden is governed by three core pillars that prioritize flavor, health, and ecological balance."
  });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch("/api/content?group=about");
        if (res.ok) {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await res.json();
            if (Array.isArray(data)) {
              const contentMap: any = {};
              data.forEach((item: any) => {
                contentMap[item.key] = item.value;
              });
              if (Object.keys(contentMap).length > 0) {
                setContent(prev => ({ ...prev, ...contentMap }));
              }
            } else {
              console.error("Data received from /api/content (about) is not an array:", data);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load about content", err);
      }
    };
    fetchContent();
  }, []);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  useEffect(() => {
    setIsImmersive(true);
    // Only set a default if one isn't already active (e.g. on direct page reload)
    // Otherwise keep the color that was active on the home page
    if (headerColor === "#9a0c52" || headerColor === "#0b2b1a") {
       setHeaderColor("#ff007f"); // Default Dragon Fruit theme
    }
    return () => setIsImmersive(false);
  }, [setIsImmersive, setHeaderColor, headerColor]);

  const activeColor = headerColor;

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const values = [
    {
      icon: <Zap style={{ color: activeColor }} />,
      title: "Exotic Energy",
      desc: "Our dragon fruits are bred for high nutrient density and vibrant botanical energy."
    },
    {
      icon: <Award className="text-[#b5e55b]" />,
      title: "Premium Harvest",
      desc: "Every pitaya is hand-selected at the peak of maturity for the perfect balance of sweetness."
    },
    {
      icon: <Droplets style={{ color: activeColor }} />,
      title: "Pure Irrigation",
      desc: "Sourced from natural mineral springs to ensure a clean, crisp finish in every bite."
    }
  ];

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#f1f1f2] font-sans selection:bg-[#ff007f] selection:text-white">
      
      {/* Hero Section */}
      <section 
        ref={heroRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#0b2b1a] text-white z-0 cursor-crosshair"
      >
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 text-center px-6"
        >
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xs md:text-sm font-bold uppercase tracking-[0.4em] mb-4 block"
            style={{ color: activeColor }}
          >
            {content["about.hero.small"]}
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
            className="text-5xl md:text-7xl lg:text-9xl font-black font-playfair tracking-tight mb-6"
          >
             {content["about.hero.main"].split(". ").map((part: string, idx: number) => (
                <span key={idx}>
                   {part}
                   {idx === 0 && <><span className="italic" style={{ color: activeColor }}>Nature.</span><br/></>}
                   {idx === 1 && <span className="text-[#b5e55b] italic">Harvest.</span>}
                </span>
             ))}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="max-w-2xl mx-auto text-lg md:text-xl opacity-80 font-inter font-light leading-relaxed drop-shadow-sm"
          >
            {content["about.hero.desc"]}
          </motion.p>
        </motion.div>

        {/* Fluid Mouse Cursor Glow (Dragon Fruit Magenta) */}
        <motion.div 
          className="absolute z-0 pointer-events-none rounded-full blur-[100px]"
          animate={{
            x: mousePosition.x - 300,
            y: mousePosition.y - 300,
            opacity: isHovering ? 0.6 : 0,
            scale: isHovering ? 1 : 0.8,
          }}
          transition={{ type: "tween", ease: "backOut", duration: 0.6 }}
          style={{
            width: "600px",
            height: "600px",
            background: `radial-gradient(circle, ${activeColor}44 0%, transparent 70%)`,
            mixBlendMode: "screen",
          }}
        />

        {/* Ambient Glows (Dragon Fruit vibes) */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
           <motion.div 
             animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3], x: [0, 50, 0] }}
             transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
             className="absolute top-[10%] left-[15%] w-[600px] h-[600px] rounded-full blur-[100px]"
             style={{ background: `radial-gradient(circle, ${activeColor}33 0%, transparent 70%)` }}
           />
           <motion.div 
             animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.4, 0.2], x: [0, -50, 0] }}
             transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 1 }}
             className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(181,229,91,0.15)_0%,transparent_70%)] blur-[100px]"
           />
           <div className="absolute inset-0 bg-[url('/images/about/kenny-dragon-fruit-tree-farm-thailand-country-landscape.jpg')] bg-cover bg-center opacity-10 mix-blend-overlay grayscale" />
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-12 flex flex-col items-center gap-4"
        >
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-40">Explore the Garden</span>
          <div 
            className="w-px h-16 bg-gradient-to-b to-transparent" 
            style={{ backgroundImage: `linear-gradient(to bottom, ${activeColor}, transparent)` }}
          />
        </motion.div>
      </section>

      {/* Content Spacer */}
      <div className="h-screen" />

      {/* The Story Section */}
      <section className="relative z-10 pt-32 pb-40 overflow-hidden transition-colors duration-1000" style={{ backgroundColor: `${activeColor}08` }}>
         {/* Background Glow for Story */}
         <div className="absolute top-0 right-0 w-[800px] h-[800px] blur-[150px] rounded-full opacity-20" style={{ background: `radial-gradient(circle, ${activeColor} 0%, transparent 70%)` }} />
         
         <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="relative aspect-[3/4] rounded-[4rem] overflow-hidden group shadow-2xl">
               <Image 
                 src={content["about.story.image"]}
                 alt="Dragon Fruit Garden"
                 fill
                 className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-[#0b2b1a]/60 to-transparent" />
               <div className="absolute bottom-12 left-12 text-white">
                  <span className="text-sm font-bold uppercase tracking-widest opacity-80 mb-2 block">Premium Pitaya</span>
                  <span className="text-5xl font-black font-playfair drop-shadow-lg">Exotic Perfection</span>
               </div>
            </div>

            <div className="flex flex-col justify-center">
               <h2 className="font-bold uppercase tracking-widest text-sm mb-6" style={{ color: activeColor }}>{content["about.story.small"]}</h2>
               <h3 className="text-4xl md:text-5xl font-black font-playfair text-[#0b2b1a] mb-10 leading-[1.15]">
                 {content["about.story.main"]}
               </h3>
               <div className="space-y-8 text-gray-500 font-inter text-lg leading-relaxed font-light">
                  <p>
                    {content["about.story.p1"]}
                  </p>
                  <p>
                    {content["about.story.p2"]}
                  </p>
               </div>
               
                <div className="mt-14 flex flex-wrap gap-12">
                  <div 
                    className="bg-white/40 backdrop-blur-md p-6 rounded-3xl border border-transparent transition-all shadow-sm"
                    style={{ borderColor: `${activeColor}33` }}
                  >
                    <span className="block text-5xl font-black text-[#0b2b1a]">12+</span>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40">Pitaya Varieties</span>
                  </div>
                  <div 
                    className="bg-white/40 backdrop-blur-md p-6 rounded-3xl border border-transparent transition-all shadow-sm"
                    style={{ borderColor: `${activeColor}33` }}
                  >
                    <span className="block text-5xl font-black text-[#0b2b1a]">100%</span>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40">Organic Harvest</span>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Core Values Section (Dragon Fruit Theme) */}
      <section className="bg-[#0b2b1a] py-40 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
          <div className="text-left mb-24 max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-black font-playfair text-white mb-6">{content["about.values.title"]}</h2>
            <p className="text-white/60 text-lg md:text-xl font-light leading-relaxed">{content["about.values.desc"]}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {values.map((value, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -12, backgroundColor: "rgba(255,255,255,0.08)" }}
                className="bg-white/5 backdrop-blur-md p-12 rounded-[3.5rem] border border-white/10 transition-all group"
                style={{ borderColor: `${activeColor}44` }}
              >
                <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
                  {value.icon}
                </div>
                <h4 className="text-3xl font-bold text-white mb-6 font-playfair tracking-tight">{value.title}</h4>
                <p className="text-white/50 text-base leading-relaxed font-light">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Dynamic Accents */}
        <div className="absolute top-0 left-0 w-full h-px bg-white/10" />
        <div 
          className="absolute top-1/2 right-[-10%] w-[600px] h-[600px] blur-[150px] rounded-full" 
          style={{ background: `${activeColor}22` }}
        />
      </section>

      {/* Call to Action (Vibrant Dragon Fruit) */}
      <section className="py-24 transition-colors duration-1000" style={{ backgroundColor: `${activeColor}05` }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="bg-[#0b2b1a] rounded-[4.5rem] p-12 md:p-32 relative overflow-hidden flex flex-col items-center text-center shadow-2xl">
            {/* Immersive Background Texture */}
            <div className="absolute inset-0 opacity-15 grayscale mix-blend-overlay">
               <Image 
                  src="/images/about/digital-art-fruit-illustration.jpg"
                  alt="Dragon Fruit Peel Texture"
                  fill
                  className="object-cover"
               />
            </div>
            {/* Dynamic Light Rays */}
            <div 
              className="absolute inset-0" 
              style={{ background: `radial-gradient(circle at center, ${activeColor}22 0%, transparent 70%)` }}
            />
            
            <motion.div 
               initial={{ opacity: 0, y: 40 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="relative z-10"
            >
              <h2 className="text-4xl md:text-7xl font-black font-playfair text-white mb-12 drop-shadow-xl">
                Taste the <span className="italic" style={{ color: activeColor }}>Heritage.</span><br/>
                Feel the <span className="text-[#b5e55b] italic">Exotic.</span>
              </h2>
              <div className="flex flex-col sm:flex-row justify-center gap-8">
                <Link 
                   href="/shop"
                   className="px-14 py-6 text-white rounded-2xl font-black tracking-[0.2em] uppercase text-xs flex items-center justify-center gap-4 hover:scale-105 active:scale-95 transition-all shadow-2xl"
                   style={{ backgroundColor: activeColor, boxShadow: `0 25px 50px -12px ${activeColor}66` }}
                >
                  Shop Now <ArrowRight size={18} />
                </Link>
                <Link 
                   href="/auth"
                   className="px-14 py-6 bg-white/5 backdrop-blur-xl text-white border border-white/20 rounded-2xl font-black tracking-[0.2em] uppercase text-xs hover:bg-white hover:text-[#0b2b1a] transition-all flex items-center justify-center"
                >
                  Join VIP Club
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}
