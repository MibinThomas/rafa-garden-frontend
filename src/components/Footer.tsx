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
    <footer className="w-full bg-[#f1f1f2] text-[#5d5f61] pt-10 pb-6 px-4 sm:px-8 md:px-16 font-sans">
      <div className="max-w-[1700px] mx-auto flex flex-col gap-4">

        {/* ── FOOTER IMAGE ─────────────────────────────────────────── */}
        <div className="w-full flex items-center justify-center md:justify-start">
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

        {/* ── BOX 1: NAVIGATION COLUMNS ───────────────────────────── */}
        <div className="w-full bg-[#e6e7e8] rounded-2xl px-6 py-8 md:px-10 md:py-10">

          {/* DESKTOP: 3 side-by-side columns */}
          <div className="hidden md:grid md:grid-cols-3 gap-8">
            {[
              { key: "navigate",   label: "Navigate",   items: primaryMenu },
              { key: "collections",label: "Collections", items: collectionsMenu },
              { key: "about",      label: "About",       items: aboutMenu },
            ].map(col => (
              <div key={col.key} className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-[#5d5f61] text-[20px] font-normal tracking-normal">{col.label}</span>
                  <span className="w-7 h-7 rounded-full border border-[#5d5f61]/40 flex items-center justify-center shrink-0">
                    <Plus size={13} strokeWidth={1.5} className="text-[#5d5f61]/70" />
                  </span>
                </div>
                <ul className="flex flex-col gap-[10px]">
                  {col.items.map(item => (
                    <li key={item.label}>
                      <Link href={item.url} className="text-[#5d5f61] text-[14px] hover:text-black transition-colors">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* MOBILE: accordion-style stacked sections */}
          <div className="flex flex-col divide-y divide-[#5d5f61]/10 md:hidden">
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

        {/* ── BOX 2: NEWSLETTER ───────────────────────────────────── */}
        <div className="w-full bg-[#e6e7e8] rounded-2xl px-6 py-7 md:px-10 md:py-9">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">

            {/* Label */}
            <div className="shrink-0">
              <p className="text-[#5d5f61] text-[14px] leading-snug">Stay Updated,</p>
              <p className="text-[#5d5f61] text-[14px] leading-snug">Subscribe to our news letter</p>
            </div>

            {/* Input + Button */}
            <div className="flex-1 flex items-center gap-3">
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

        {/* ── CONNECT ROW ─────────────────────────────────────────── */}
        <div className="w-full pt-5 pb-2 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 flex-wrap">

          {/* Connect label + dash + address */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-[#5d5f61] text-[22px] md:text-[26px] font-bold tracking-tight">Connect</span>
            <span className="text-[#5d5f61]/40 text-[18px] font-light">—</span>
            <div className="text-[#5d5f61] text-[13px] leading-snug">
              <p>Al Aweer, Dubai</p>
              <p>United Arab Emirates</p>
            </div>
          </div>

          {/* Social icons + handle */}
          <div className="flex items-center gap-2 sm:ml-2">
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

          {/* Privacy + Terms — pushed to the right on desktop */}
          <div className="flex items-center gap-5 sm:ml-auto text-[#5d5f61] text-[13px]">
            <Link href="/privacy" className="hover:text-black transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-black transition-colors">Terms</Link>
          </div>
        </div>

        {/* ── COPYRIGHT ───────────────────────────────────────────── */}
        <div className="border-t border-[#5d5f61]/10 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[#5d5f61] text-[12px]">
          <p>© {new Date().getFullYear()} Rafah Garden Sanctuary</p>
          <p>Designed <span className="font-bold text-[#5d5f61] cursor-pointer hover:underline">webeyecraft</span></p>
        </div>

      </div>
    </footer>
  );
}
