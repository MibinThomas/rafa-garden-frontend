"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Facebook, Instagram, Youtube, Twitter, Send } from "lucide-react";
import { useSiteSettings } from "@/lib/SiteSettingsContext";

export function Footer() {
  const pathname = usePathname();
  const { settings } = useSiteSettings();

  if (pathname.startsWith('/admin')) return null;

  const socialLinks = {
    instagram: settings["global.social_instagram"] || "#",
    facebook: "#",
    twitter: "#",
    youtube: "#"
  };

  return (
    <footer className="w-full bg-[#e6e7e8] text-[#4a4b4d] pt-20 pb-8 px-6 md:px-16 font-sans relative overflow-hidden">
      
      {/* Main Container */}
      <div className="max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-[1.3fr_2fr] gap-x-24 gap-y-16 border-b border-[#333333]/10 pb-12">
        
        {/* Left Section: Botanical Collage & Heritage Text */}
        <div className="relative flex flex-col justify-between">
          <div className="relative w-full aspect-[4/3] max-w-[500px] hover:scale-[1.02] transition-transform duration-700">
             <Image 
               src="/images/footer/Ui footer all products.webp" 
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            
            {/* Nav: Navigate */}
            <div className="flex flex-col gap-6">
              <h4 className="text-[#333333] font-avant-garde font-bold text-sm tracking-wide">Navigate</h4>
              <ul className="flex flex-col gap-4 text-[#737478] text-xs font-avant-garde">
                <li><Link href="/" className="hover:text-black transition-colors">Home</Link></li>
                <li><Link href="/shop" className="hover:text-black transition-colors">Shop</Link></li>
                <li><Link href="/about" className="hover:text-black transition-colors">About</Link></li>
                <li><Link href="/blog" className="hover:text-black transition-colors">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-black transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Nav: Collections */}
            <div className="flex flex-col gap-6">
              <h4 className="text-[#333333] font-avant-garde font-bold text-sm tracking-wide">Collections</h4>
              <ul className="flex flex-col gap-4 text-[#737478] text-xs font-avant-garde">
                <li><Link href="/shop?cat=0" className="hover:text-black transition-colors">Crush</Link></li>
                <li><Link href="/shop?cat=1" className="hover:text-black transition-colors">Jam</Link></li>
                <li><Link href="/shop?cat=2" className="hover:text-black transition-colors">Fruits</Link></li>
                <li><Link href="/shop?cat=3" className="hover:text-black transition-colors">Plants</Link></li>
              </ul>
            </div>

            {/* Nav: About */}
            <div className="flex flex-col gap-6">
              <h4 className="text-[#333333] font-avant-garde font-bold text-sm tracking-wide">About</h4>
              <ul className="flex flex-col gap-4 text-[#737478] text-xs font-avant-garde">
                <li><Link href="/terms" className="hover:text-black transition-colors">Terms and Conditions</Link></li>
                <li><Link href="/returns" className="hover:text-black transition-colors">Return and Refund Policy</Link></li>
                <li><Link href="/privacy" className="hover:text-black transition-colors">Privacy Policy</Link></li>
                <li><Link href="/orders" className="hover:text-black transition-colors">Orders</Link></li>
              </ul>
            </div>

            {/* Nav: Connect (Isolated by precise border) */}
            <div className="flex flex-col gap-6 md:pl-8 md:border-l border-[#333333]/15">
              <h4 className="text-[#333333] font-avant-garde font-bold text-sm tracking-wide mb-1">Connect</h4>
              <p className="text-[#737478] text-xs leading-[1.6] font-avant-garde mb-8">
                Al Aweer, Dubai<br />
                United Arab Emirates
              </p>
              
              <div className="flex items-center gap-2 mb-2">
                <a href={socialLinks.facebook} className="w-6 h-6 rounded-full bg-[#737478] text-[#dfdfdf] flex items-center justify-center hover:bg-[#333333] transition-colors"><Facebook size={12} fill="currentColor" /></a>
                <a href={socialLinks.twitter} className="w-6 h-6 rounded-full bg-[#737478] text-[#dfdfdf] flex items-center justify-center hover:bg-[#333333] transition-colors"><Twitter size={12} fill="currentColor" /></a>
                <a href={socialLinks.instagram} className="w-6 h-6 rounded-full bg-[#737478] text-[#dfdfdf] flex items-center justify-center hover:bg-[#333333] transition-colors"><Instagram size={12} /></a>
                <a href={socialLinks.youtube} className="w-6 h-6 rounded-full bg-[#737478] text-[#dfdfdf] flex items-center justify-center hover:bg-[#333333] transition-colors"><Youtube size={12} fill="currentColor" /></a>
              </div>
              <p className="text-[10px] text-[#737478] font-medium tracking-wide">@rafahgarden</p>
            </div>

          </div>

          {/* Bottom Half: Newsletter Block (Exact Mockup Match) */}
          <div className="mt-20 flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-12">
            <div className="flex-shrink-0 pb-[10px]">
              <p className="text-[#6C6D71] text-[0.8rem] mb-1 tracking-tight font-avant-garde leading-none">Stay Updated,</p>
              <p className="text-[#6C6D71] text-[0.8rem] tracking-tight font-avant-garde leading-none">Subscribe to our news letter</p>
            </div>
            
            <div className="flex-1 max-w-[650px] flex items-end">
              
              {/* Dynamic width Input block */}
              <div className="flex-1 flex flex-col justify-end pb-[10px]">
                <input 
                  type="email" 
                  placeholder="Enter Your Email........." 
                  className="w-full bg-transparent outline-none text-[0.7rem] text-[#333333] placeholder:text-[#333333]/50 font-avant-garde pr-4 pb-1"
                />
                <div className="w-full h-px bg-[#bcbbbd]" />
              </div>

              {/* Minimalist Floating Button & Disconnected Tail Graphic */}
              <div className="relative w-[70px] h-[45px]">
                
                {/* The curved tail shooting upward with a physical gap before the button */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="absolute left-0 bottom-[10px] pointer-events-none stroke-[#bcbbbd]">
                  <path 
                    d="M0,23.5 Q12,23.5 16,13" 
                    strokeWidth="1" strokeLinecap="round" 
                  />
                </svg>
                
                {/* Independent Floating Pill Button */}
                <button 
                  className="absolute right-[22px] bottom-[24px] w-[46px] h-[24px] border border-[#bcbbbd] hover:bg-[#333333]/5 rounded-full text-[#333333]/50 transition-all flex items-center justify-center bg-[#e6e7e8] shadow-sm z-10"
                >
                   <Send size={11} strokeWidth={2.5} className="ml-[-2px] opacity-80" />
                </button>

              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Bottom Legal & Copyright Wrap */}
      <div className="max-w-[1700px] mx-auto pt-6 flex flex-col md:flex-row items-center justify-between gap-6 text-[#737478] text-[0.65rem] font-avant-garde tracking-wide">
        <p className="shrink-0">© {new Date().getFullYear()} Rafah Garden Sanctuary -</p>
        
        <div className="flex-1 flex justify-center items-center gap-16 md:pr-20">
          <Link href="/privacy" className="hover:text-black transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-black transition-colors">Terms</Link>
        </div>

        <p className="shrink-0 flex items-center gap-1">Designed <span className="font-bold text-[#333333] cursor-pointer hover:underline">webeyecraft</span></p>
      </div>

    </footer>
  );
}
