"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  MessageSquare, 
  FileEdit, 
  Package, 
  Briefcase, 
  BookOpen, 
  Newspaper, 
  Settings, 
  Users, 
  Ticket, 
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  Share2,
  List,
  Tag,
  ExternalLink,
  LogOut
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { id: "orders", label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { id: "enquiries", label: "Enquiries", href: "/admin/enquiries", icon: MessageSquare },
  { id: "cms", label: "CMS", href: "/admin/cms", icon: FileEdit },
  { id: "products", label: "Products", href: "/admin/products", icon: Package },
  { id: "blog", label: "Blog", href: "/admin/blog", icon: BookOpen },
  { id: "news", label: "News", href: "/admin/news", icon: Newspaper },
  { 
    id: "settings", 
    label: "Settings & Content", 
    icon: Settings,
    subItems: [
      { id: "site-settings", label: "Site Settings", href: "/admin/settings", icon: Settings },
      { id: "social-media", label: "Social Media", href: "/admin/settings/social", icon: Share2 },
      { id: "payment-methods", label: "Payment Methods", href: "/admin/settings/payments", icon: List },
      { id: "meta-tags", label: "Meta Tags", href: "/admin/settings/meta", icon: Tag }
    ]
  },
  { id: "users", label: "Users", href: "/admin/users", icon: Users },
  { id: "coupons", label: "Coupons", href: "/admin/coupons", icon: Ticket },
  { id: "policies", label: "Policies", href: "/admin/policies", icon: ShieldCheck },
];

export function Sidebar() {
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    settings: pathname?.includes('/admin/settings') ? true : false,
  });

  const toggleMenu = (id: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-white/70 backdrop-blur-xl border-r border-white/20 z-50 flex flex-col p-8 shadow-2xl shadow-black/5">
      {/* Brand Header */}
      <div className="mb-14 px-0">
        <Link href="/" className="flex flex-col items-start gap-1.5 group">
          <Image 
            src="/images/logo/Rafah logo.webp" 
            alt="Rafah Garden Logo" 
            width={160} 
            height={48} 
            className="h-9 w-auto object-left object-contain brightness-[0.2] group-hover:brightness-0 transition-all duration-500"
            priority
          />
          <div className="flex items-center gap-2 mt-1">
             <div className="w-1 h-1 rounded-full bg-[#c81c6a] animate-pulse" />
             <p className="text-[#888888] text-[9px] font-black uppercase tracking-[0.3em]">Sanctuary Office</p>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-hide pr-2 -mr-4">
        {NAV_ITEMS.map((item) => {
          
          if (item.subItems) {
            const isAnyChildActive = item.subItems.some(sub => pathname === sub.href);
            const isExpanded = expandedMenus[item.id];
            
            return (
              <div key={item.id} className="space-y-1 mb-2">
                <button 
                  onClick={() => toggleMenu(item.id)}
                  className={cn(
                    "w-full group flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-500",
                    isAnyChildActive && !isExpanded
                      ? "bg-[#c81c6a]/10 text-[#c81c6a]" 
                      : "text-[#888888] hover:bg-white hover:text-[#5d5f61] hover:shadow-xl hover:shadow-black/5"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <item.icon size={19} strokeWidth={isAnyChildActive ? 2.5 : 2} className={cn("transition-all duration-500", isAnyChildActive && !isExpanded ? "text-[#c81c6a] scale-110" : "opacity-40 group-hover:opacity-100 group-hover:text-[#5d5f61]")} />
                    <span className="text-[13px] font-black tracking-tight uppercase">{item.label}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown size={14} className="opacity-60 transition-all text-[#5d5f61]" />
                  ) : (
                    <ChevronRight size={14} className={cn("opacity-20 transition-all", isAnyChildActive ? "opacity-100" : "-translate-x-2 group-hover:opacity-100 group-hover:translate-x-0")} />
                  )}
                </button>
                
                {/* Submenu Dropdown */}
                {isExpanded && (
                  <div className="pl-4 pr-0 space-y-1 mt-1 border-l-2 border-gray-100 ml-6">
                    {item.subItems.map((subItem) => {
                      const isSubActive = pathname === subItem.href;
                      return (
                        <Link
                          key={subItem.id}
                          href={subItem.href}
                          className={cn(
                            "flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300",
                            isSubActive
                              ? "bg-white text-[#c81c6a] shadow-lg shadow-black/5 font-black"
                              : "text-[#aaaaaa] hover:text-[#5d5f61]"
                          )}
                        >
                          <subItem.icon size={15} strokeWidth={isSubActive ? 2.5 : 2} className={cn("transition-colors", isSubActive ? "text-[#c81c6a]" : "opacity-40")} />
                          <span className={cn("text-[12px] tracking-tight", isSubActive ? "font-black" : "font-bold")}>
                            {subItem.label}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.id} 
              href={item.href!}
              className={cn(
                "group flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-500",
                isActive 
                  ? "bg-white text-[#c81c6a] shadow-2xl shadow-black/10 scale-[1.02] z-10" 
                  : "text-[#888888] hover:bg-white hover:text-[#5d5f61] hover:shadow-xl hover:shadow-black/5"
              )}
            >
              <div className="flex items-center gap-4">
                <item.icon size={19} strokeWidth={isActive ? 2.5 : 2} className={cn("transition-all duration-500", isActive ? "text-[#c81c6a] scale-110" : "opacity-40 group-hover:opacity-100 group-hover:text-[#5d5f61]")} />
                <span className="text-[13px] font-black tracking-tight uppercase">{item.label}</span>
              </div>
              <ChevronRight 
                size={14} 
                className={cn(
                  "opacity-20 transition-all", 
                  isActive ? "opacity-100 translate-x-0 text-[#c81c6a]" : "-translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                )} 
              />
            </Link>
          );
        })}
      </nav>

      {/* Store Preview / Quick Link */}
      <div className="mt-8 mb-6">
        <Link 
          href="/" 
          target="_blank"
          className="flex items-center justify-between p-6 rounded-[2.5rem] bg-[#5d5f61] text-white group relative overflow-hidden transition-all duration-700 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#5d5f61]/20"
        >
          <div className="relative z-10">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-40 mb-1.5">Live Sanctuary</p>
            <p className="text-[13px] font-black font-playfair tracking-tight flex items-center gap-2">
              Storefront <span className="italic font-normal opacity-60">Preview</span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center relative z-10 group-hover:bg-[#c81c6a] transition-all duration-500">
             <ExternalLink size={16} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#c81c6a] rounded-full blur-[4rem] opacity-20 -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
        </Link>
      </div>

      {/* Footer User Info */}
      <div className="pt-8 border-t border-black/5 px-2 flex items-center justify-between mt-auto">
         <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#c81c6a] to-[#9a0c52] flex items-center justify-center text-[12px] text-white font-black shadow-2xl shadow-[#c81c6a]/30">
                 AZ
              </div>
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-lg" />
            </div>
            <div>
               <p className="text-[13px] font-black text-[#5d5f61] leading-tight">Principal Admin</p>
               <p className="text-[9px] text-[#aaaaaa] font-black uppercase tracking-widest mt-0.5">Master Key</p>
            </div>
         </div>
         <button className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-200 hover:text-red-500 hover:bg-red-50 transition-all duration-500 group">
            <LogOut size={18} strokeWidth={2.5} className="group-hover:-translate-x-1 transition-transform" />
         </button>
      </div>
    </aside>
  );
}
