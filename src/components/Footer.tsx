"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Instagram, MessageCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useHeaderColor } from "@/lib/HeaderColorContext";
import { useSiteSettings } from "@/lib/SiteSettingsContext";
import { CATEGORIES, Category } from "@/lib/data";

export function Footer() {
  const pathname = usePathname();
  const { headerColor } = useHeaderColor();
  const { settings } = useSiteSettings();

  if (pathname.startsWith('/admin')) return null;

  const socialLinks = {
    instagram: settings["global.social_instagram"] || "#",
    whatsapp: settings["global.social_whatsapp"] || "#"
  };

  return (
    <footer className="w-full relative z-10 p-6 md:p-12">
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
        className="max-w-[1600px] mx-auto relative group"
      >
        {/* Architectural Glass Pane with Dynamic Category Color */}
        <motion.div 
          animate={{ 
            backgroundColor: headerColor,
            borderColor: "rgba(255,255,255,0.2)"
          }}
          className="absolute inset-0 backdrop-blur-3xl rounded-[4rem] border shadow-[0_50px_100px_rgba(0,0,0,0.15)] -z-10 transition-colors duration-1000" 
          style={{ opacity: 0.9 }}
        />
        
        {/* Deep Contrast Overlay */}
        <div className="absolute inset-0 bg-black/20 rounded-[4rem] -z-10 pointer-events-none" />

        <div className="p-10 md:p-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-24 relative z-10">
          
          {/* Column 1: The Sanctuary */}
          <div className="flex flex-col gap-8">
            <div className="relative w-48 h-12">
              <Image
                src="/images/logo/Rafah logo white.webp"
                alt="Rafah Garden"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-white/50 font-inter font-light text-sm leading-relaxed max-w-xs">
              Heritage Pitaya Sanctuary. Cultivated with ancient wisdom and modern precision to bring you the pinnacle of botanical luxury.
            </p>
            <div className="flex items-center gap-4">
               <motion.span 
                 animate={{ backgroundColor: headerColor }}
                 className="w-2 h-2 rounded-full" 
               />
               <span className="text-[10px] uppercase font-black tracking-[0.4em] text-white/30">Since 2026</span>
            </div>
          </div>

          {/* Column 2: Navigate */}
          <div className="flex flex-col gap-8">
            <h4 className="text-white font-playfair font-black text-xs uppercase tracking-[0.4em]">Navigate</h4>
            <div className="flex flex-col gap-4">
              {["Home", "Shop", "About", "Blog", "Contact"].map((link) => (
                <Link 
                  key={link} 
                  href={link === "Home" ? "/" : `/${link.toLowerCase()}`}
                  className="text-white/40 hover:text-white font-outfit text-[0.9rem] transition-all hover:translate-x-1 inline-block"
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3: Heritage Collections */}
          <div className="flex flex-col gap-8">
            <h4 className="text-white font-playfair font-black text-xs uppercase tracking-[0.4em]">Collections</h4>
            <div className="flex flex-col gap-4">
               {CATEGORIES.map((cat) => (
                 <Link 
                   key={cat.id} 
                   href={`/shop?category=${cat.id}`}
                   className="text-white/40 hover:text-white font-outfit text-[0.9rem] transition-all hover:translate-x-1 inline-block"
                 >
                   {cat.title}
                 </Link>
               ))}
            </div>
          </div>

          {/* Column 4: Sanctuary Connect */}
          <div className="flex flex-col gap-8">
            <h4 className="text-white font-playfair font-black text-xs uppercase tracking-[0.4em]">Connect</h4>
            <div className="flex flex-col gap-6">
               <p className="text-white/40 font-outfit text-[0.9rem] leading-snug">
                 Al Aweer, Dubai<br />
                 United Arab Emirates
               </p>
               <div className="flex items-center gap-4">
                  <a href={socialLinks.instagram} target="_blank" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
                    <Instagram size={20} />
                  </a>
                  <a href={socialLinks.whatsapp} target="_blank" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.558 0 11.894-5.335 11.897-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </a>
               </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 px-10 md:px-20 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
           <p className="text-white/20 text-[10px] uppercase font-black tracking-[0.4em]">© {new Date().getFullYear()} Rafah Garden Sanctuary</p>
           <div className="flex items-center gap-10">
              <Link href="/privacy" className="text-white/20 hover:text-white transition-colors text-[10px] uppercase font-black tracking-[0.4em]">Privacy</Link>
              <Link href="/terms" className="text-white/20 hover:text-white transition-colors text-[10px] uppercase font-black tracking-[0.4em]">Terms</Link>
              <div className="hidden md:block w-px h-10 bg-white/5" />
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-white/20 hover:text-white transition-colors text-[10px] uppercase font-black tracking-[0.4em] flex items-center gap-2 group"
              >
                Return to Top
                <motion.span animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 2 }}>↑</motion.span>
              </button>
           </div>
        </div>

      </motion.div>
    </footer>
  );
}
