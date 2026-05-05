"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Facebook, Instagram, Youtube, Twitter, Send, Plus, Minus } from "lucide-react";
import { useSiteSettings } from "@/lib/SiteSettingsContext";

export function Footer() {
  const pathname = usePathname();
  const { settings } = useSiteSettings();
  const [openSection, setOpenSection] = useState<string | null>(null);

  if (pathname.startsWith('/admin')) return null;

  const socialLinks = {
    instagram: settings["social_instagram"] || "#",
    facebook: settings["social_facebook"] || "#",
    twitter: settings["social_twitter"] || "#",
    youtube: settings["social_youtube"] || "#"
  };

  const primaryMenu = [
    { label: settings["menu_nav_1_label"] || "Home",    url: settings["menu_nav_1_url"] || "/" },
    { label: settings["menu_nav_2_label"] || "Shop",    url: settings["menu_nav_2_url"] || "/shop" },
    { label: settings["menu_nav_3_label"] || "About",   url: settings["menu_nav_3_url"] || "/about" },
    { label: settings["menu_nav_4_label"] || "Blog",    url: settings["menu_nav_4_url"] || "/blog" },
    { label: settings["menu_nav_5_label"] || "Contact", url: settings["menu_nav_5_url"] || "/contact" }
  ].filter(m => m.label && m.label.trim() !== "");

  const collectionsMenu = [
    { label: settings["footer_label_col1"] || "Crush",  url: settings["footer_url_col1"] || "/shop?cat=0" },
    { label: settings["footer_label_col2"] || "Jam",    url: settings["footer_url_col2"] || "/shop?cat=1" },
    { label: settings["footer_label_col3"] || "Fruits", url: settings["footer_url_col3"] || "/shop?cat=2" },
    { label: settings["footer_label_col4"] || "Plants", url: settings["footer_url_col4"] || "/shop?cat=3" }
  ].filter(m => m.label && m.label.trim() !== "");

  const aboutMenu = [
    { label: settings["footer_label_terms"]   || "Terms and Conditions",   url: settings["footer_url_terms"]   || "/terms" },
    { label: settings["footer_label_returns"] || "Return and Refund Policy", url: settings["footer_url_returns"] || "/returns" },
    { label: settings["footer_label_privacy"] || "Privacy Policy",          url: settings["footer_url_privacy"] || "/privacy" },
    { label: settings["footer_label_orders"]  || "Orders",                  url: settings["footer_url_orders"]  || "/orders" }
  ].filter(m => m.label && m.label.trim() !== "");

  const toggle = (s: string) => setOpenSection(prev => prev === s ? null : s);

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────────────────────
          DESKTOP FOOTER (OLD VERSION)
      ───────────────────────────────────────────────────────────────────────────── */}
      <footer className="hidden md:block w-full bg-[#e6e7e8] text-[#4a4b4d] pt-20 pb-8 px-16 font-sans relative overflow-hidden">
        <div className="max-w-[1700px] mx-auto grid grid-cols-[1.3fr_2fr] gap-x-24 gap-y-16 border-b border-[#333333]/10 pb-12">
          
          {/* Left Section: Botanical Image */}
          <div className="relative flex flex-col items-start justify-between">
            <div className="relative w-full aspect-[4/3] max-w-[500px] hover:scale-[1.02] transition-transform duration-700">
              <Image 
                src={settings["footer_image"] || "/images/footer/Ui footer all products.webp"} 
                alt="Heritage Pitaya Collection"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </div>

          {/* Right Section: Navigation Matricies & Newsletter */}
          <div className="flex flex-col justify-between pt-4">
            
            {/* Top Half: Grids */}
            <div className="grid grid-cols-4 gap-8">
              
              {/* Nav: Navigate */}
              <div className="flex flex-col items-start gap-6">
                <h4 className="text-[#333333] font-avant-garde font-bold text-sm tracking-wide">Navigate</h4>
                <ul className="flex flex-col items-start gap-4 text-[#737478] text-xs font-avant-garde">
                  {primaryMenu.map((item) => (
                    <li key={item.label}><Link href={item.url} className="hover:text-black transition-colors">{item.label}</Link></li>
                  ))}
                </ul>
              </div>

              {/* Nav: Collections */}
              <div className="flex flex-col items-start gap-6">
                <h4 className="text-[#333333] font-avant-garde font-bold text-sm tracking-wide">Collections</h4>
                <ul className="flex flex-col items-start gap-4 text-[#737478] text-xs font-avant-garde">
                  {collectionsMenu.map((item) => (
                    <li key={item.label}><Link href={item.url} className="hover:text-black transition-colors">{item.label}</Link></li>
                  ))}
                </ul>
              </div>

              {/* Nav: About */}
              <div className="flex flex-col items-start gap-6">
                <h4 className="text-[#333333] font-avant-garde font-bold text-sm tracking-wide">About</h4>
                <ul className="flex flex-col items-start gap-4 text-[#737478] text-xs font-avant-garde">
                  {aboutMenu.map((item) => (
                    <li key={item.label}><Link href={item.url} className="hover:text-black transition-colors">{item.label}</Link></li>
                  ))}
                </ul>
              </div>

              {/* Nav: Connect */}
              <div className="flex flex-col items-start gap-6 pl-8 border-l border-[#333333]/15">
                <h4 className="text-[#333333] font-avant-garde font-bold text-sm tracking-wide mb-1">Connect</h4>
                <p className="text-[#737478] text-xs leading-[1.6] font-avant-garde mb-8">
                  Al Aweer, Dubai<br />
                  United Arab Emirates
                </p>
                
                <div className="flex items-center gap-2 mb-2">
                  <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded-full bg-[#737478] text-[#dfdfdf] flex items-center justify-center hover:bg-[#333333] transition-colors"><Facebook size={12} fill="currentColor" /></a>
                  <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded-full bg-[#737478] text-[#dfdfdf] flex items-center justify-center hover:bg-[#333333] transition-colors"><Twitter size={12} fill="currentColor" /></a>
                  <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded-full bg-[#737478] text-[#dfdfdf] flex items-center justify-center hover:bg-[#333333] transition-colors"><Instagram size={12} /></a>
                  <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded-full bg-[#737478] text-[#dfdfdf] flex items-center justify-center hover:bg-[#333333] transition-colors"><Youtube size={12} fill="currentColor" /></a>
                </div>
                <p className="text-[10px] text-[#737478] font-medium tracking-wide">@rafahgarden</p>
              </div>

            </div>

            {/* Bottom Half: Newsletter Block */}
            <div className="mt-20 flex items-end justify-between gap-12">
              <div className="flex-shrink-0 pb-[10px]">
                <p className="text-[#6C6D71] text-[0.8rem] mb-1 tracking-tight font-avant-garde leading-none">Stay Updated,</p>
                <p className="text-[#6C6D71] text-[0.8rem] tracking-tight font-avant-garde leading-none">Subscribe to our news letter</p>
              </div>
              
              <div className="flex-1 max-w-[650px] flex items-end">
                <div className="flex-1 flex flex-col justify-end pb-[10px]">
                  <input 
                    type="email" 
                    placeholder="Enter Your Email........." 
                    className="w-full bg-transparent outline-none text-[0.7rem] text-[#333333] placeholder:text-[#333333]/50 font-avant-garde pr-4 pb-1"
                  />
                  <div className="w-full h-px bg-[#bcbbbd]" />
                </div>

                <div className="relative w-[70px] h-[45px]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="absolute left-0 bottom-[10px] pointer-events-none stroke-[#bcbbbd]">
                    <path d="M0,23.5 Q12,23.5 16,13" strokeWidth="1" strokeLinecap="round" />
                  </svg>
                  <button className="absolute right-[22px] bottom-[24px] w-[46px] h-[24px] border border-[#bcbbbd] hover:bg-[#333333]/5 rounded-full text-[#333333]/50 transition-all flex items-center justify-center bg-[#e6e7e8] shadow-sm z-10">
                     <Send size={11} strokeWidth={2.5} className="ml-[-2px] opacity-80" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Copyright Wrap */}
        <div className="max-w-[1700px] mx-auto pt-6 flex items-center justify-between gap-6 text-[#737478] text-[0.65rem] font-avant-garde tracking-wide">
          <p className="shrink-0">© {new Date().getFullYear()} Rafah Garden Sanctuary -</p>
          <div className="flex-1 flex justify-center items-center gap-16 pr-20">
            <Link href="/privacy" className="hover:text-black transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-black transition-colors">Terms</Link>
          </div>
          <p className="shrink-0 flex items-center gap-1">Designed <span className="font-bold text-[#333333] cursor-pointer hover:underline">webeyecraft</span></p>
        </div>
      </footer>

      {/* ─────────────────────────────────────────────────────────────────────────────
          MOBILE FOOTER (NEW VERSION)
      ───────────────────────────────────────────────────────────────────────────── */}
      <footer className="md:hidden w-full bg-[#f1f1f2] text-[#5d5f61] pt-10 pb-6 px-4 font-sans">
        <div className="max-w-[1700px] mx-auto flex flex-col gap-4">

          {/* Image */}
          <div className="w-full flex items-center justify-center">
            <div className="relative w-full max-w-[500px] aspect-[4/3] hover:scale-[1.02] transition-transform duration-700">
              <Image
                src={settings["footer_image"] || "/images/footer/Ui footer all products.webp"}
                alt="Heritage Pitaya Collection"
                fill
                className="object-contain object-center"
                priority
              />
            </div>
          </div>

          {/* Navigation Columns (Accordion) */}
          <div className="w-full bg-[#e6e7e8] rounded-2xl px-6 py-8">
            <div className="flex flex-col divide-y divide-[#5d5f61]/10">
              {[
                { key: "navigate",    label: "Navigate",    items: primaryMenu },
                { key: "collections", label: "Collections", items: collectionsMenu },
                { key: "about",       label: "About",       items: aboutMenu },
              ].map(col => (
                <div key={col.key} className="py-4">
                  <button
                    onClick={() => toggle(col.key)}
                    className="w-full flex items-center justify-between outline-none"
                  >
                    <span className="text-[#5d5f61] text-[18px] font-normal">{col.label}</span>
                    <span className="w-7 h-7 rounded-full border border-[#5d5f61]/40 flex items-center justify-center shrink-0">
                      {openSection === col.key
                        ? <Minus size={13} strokeWidth={1.5} className="text-[#5d5f61]/70" />
                        : <Plus  size={13} strokeWidth={1.5} className="text-[#5d5f61]/70" />
                      }
                    </span>
                  </button>
                  {openSection === col.key && (
                    <ul className="flex flex-col gap-3 mt-4 pl-1">
                      {col.items.map(item => (
                        <li key={item.label}>
                          <Link href={item.url} className="text-[#5d5f61] text-[14px] hover:text-black transition-colors">
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="w-full bg-[#e6e7e8] rounded-2xl px-6 py-7">
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-[#5d5f61] text-[14px] leading-snug">Stay Updated,</p>
                <p className="text-[#5d5f61] text-[14px] leading-snug">Subscribe to our news letter</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 flex flex-col">
                  <input
                    type="email"
                    placeholder="Enter Your Email........."
                    className="w-full bg-transparent outline-none text-[13px] text-[#5d5f61] placeholder:text-[#5d5f61]/50 pb-2 font-sans"
                  />
                  <div className="w-full h-px bg-[#5d5f61]/25" />
                </div>
                <button className="w-10 h-10 rounded-full border border-[#5d5f61]/30 bg-[#e6e7e8] hover:bg-[#5d5f61]/10 flex items-center justify-center shrink-0 transition-colors">
                  <Send size={14} className="text-[#5d5f61]/70 -rotate-12" />
                </button>
              </div>
            </div>
          </div>

          {/* Connect Row */}
          <div className="w-full pt-5 pb-2 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="text-[#5d5f61] text-[22px] font-bold tracking-tight">Connect</span>
              <span className="text-[#5d5f61]/40 text-[18px] font-light">—</span>
              <div className="text-[#5d5f61] text-[13px] leading-snug">
                <p>Al Aweer, Dubai</p>
                <p>United Arab Emirates</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#5d5f61] text-white flex items-center justify-center hover:bg-black transition-colors shrink-0">
                <Facebook size={14} fill="currentColor" />
              </a>
              <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#5d5f61] text-white flex items-center justify-center hover:bg-black transition-colors shrink-0">
                <Twitter size={14} fill="currentColor" />
              </a>
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#5d5f61] text-white flex items-center justify-center hover:bg-black transition-colors shrink-0">
                <Instagram size={14} />
              </a>
              <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#5d5f61] text-white flex items-center justify-center hover:bg-black transition-colors shrink-0">
                <Youtube size={14} fill="currentColor" />
              </a>
              <span className="text-[#5d5f61] text-[12px] font-medium ml-1">@rafahgarden</span>
            </div>

            <div className="flex items-center gap-5 text-[#5d5f61] text-[13px]">
              <Link href="/privacy" className="hover:text-black transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-black transition-colors">Terms</Link>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-[#5d5f61]/10 pt-4 flex flex-col items-start gap-2 text-[#5d5f61] text-[12px]">
            <p>© {new Date().getFullYear()} Rafah Garden Sanctuary</p>
            <p>Designed <span className="font-bold text-[#5d5f61] cursor-pointer hover:underline">webeyecraft</span></p>
          </div>

        </div>
      </footer>
    </>
  );
}
