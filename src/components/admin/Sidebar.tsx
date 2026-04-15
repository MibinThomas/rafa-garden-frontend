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
  Tag
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
  { id: "projects", label: "Projects", href: "/admin/projects", icon: Briefcase },
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
    <aside className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-[#bbbdbf]/10 z-50 flex flex-col p-6 shadow-sm">
      {/* Brand Header */}
      <div className="mb-12 px-0">
        <Link href="/" className="flex flex-col items-start gap-1">
          <Image 
            src="/images/logo/Rafah logo.webp" 
            alt="Rafah Garden Logo" 
            width={160} 
            height={48} 
            className="h-10 w-auto object-left object-contain"
            priority
          />
          <p className="text-[#bbbdbf] text-[9px] font-black uppercase tracking-[0.2em]">Admin Panel</p>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto scrollbar-hide">
        {NAV_ITEMS.map((item) => {
          
          if (item.subItems) {
            const isAnyChildActive = item.subItems.some(sub => pathname === sub.href);
            const isExpanded = expandedMenus[item.id];
            
            return (
              <div key={item.id} className="space-y-1">
                <button 
                  onClick={() => toggleMenu(item.id)}
                  className={cn(
                    "w-full group flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300",
                    isAnyChildActive && !isExpanded
                      ? "text-[#c81c6a]" 
                      : "text-[#bbbdbf] hover:bg-gray-50 hover:text-[#0b2b1a]"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <item.icon size={20} className={cn("transition-colors", isAnyChildActive && !isExpanded ? "text-[#c81c6a]" : "group-hover:text-[#0b2b1a]")} />
                    <span className="text-[13px] font-bold tracking-tight">{item.label}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown size={14} className="opacity-60 transition-all text-[#0b2b1a]" />
                  ) : (
                    <ChevronRight size={14} className={cn("opacity-30 transition-all", isAnyChildActive ? "opacity-100" : "-translate-x-2 group-hover:opacity-100 group-hover:translate-x-0")} />
                  )}
                </button>
                
                {/* Submenu Dropdown */}
                {isExpanded && (
                  <div className="pl-4 pr-0 space-y-1 mt-1">
                    {item.subItems.map((subItem) => {
                      const isSubActive = pathname === subItem.href;
                      return (
                        <Link
                          key={subItem.id}
                          href={subItem.href}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 xl:py-2.5 rounded-xl transition-all duration-200",
                            isSubActive
                              ? "bg-[#c81c6a]/10 text-[#c81c6a] shadow-[0_2px_10px_rgba(200,28,106,0.05)]"
                              : "text-[#888888] hover:bg-gray-50 hover:text-[#0b2b1a]"
                          )}
                        >
                          <subItem.icon size={16} className={cn("transition-colors", isSubActive ? "text-[#c81c6a]" : "text-[#bbbdbf]")} />
                          <span className={cn("text-[13px] tracking-tight", isSubActive ? "font-bold" : "font-medium")}>
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
                "group flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300",
                isActive 
                  ? "bg-[#c81c6a]/5 text-[#c81c6a] shadow-[0_4px_20px_rgba(200,28,106,0.05)]" 
                  : "text-[#bbbdbf] hover:bg-gray-50 hover:text-[#0b2b1a]"
              )}
            >
              <div className="flex items-center gap-4">
                <item.icon size={20} className={cn("transition-colors", isActive ? "text-[#c81c6a]" : "group-hover:text-[#0b2b1a]")} />
                <span className="text-[13px] font-bold tracking-tight">{item.label}</span>
              </div>
              <ChevronRight 
                size={14} 
                className={cn(
                  "opacity-30 transition-all", 
                  isActive ? "opacity-100 translate-x-0" : "-translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                )} 
              />
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="mt-auto pt-6 border-t border-gray-50 px-2 flex items-center gap-3">
         <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#c81c6a] to-[#9a0c52] flex items-center justify-center text-[10px] text-white font-bold">
            AZ
         </div>
         <div>
            <p className="text-[11px] font-black text-[#0b2b1a]">Admin Principal</p>
            <p className="text-[9px] text-[#bbbdbf] font-medium">Heritage Manager</p>
         </div>
      </div>
    </aside>
  );
}
