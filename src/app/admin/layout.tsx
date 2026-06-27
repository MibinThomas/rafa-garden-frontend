"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import NextImage from "next/image";
import {
  LayoutDashboard, Package, Tag, ShoppingCart, BarChart3,
  FileText, Image, MessageSquare, Settings, Search, Bell,
  ChevronLeft, ChevronRight, LogOut, Menu, X, Globe,
  Users, TrendingUp, Layers, AlertTriangle, BookOpen
} from "lucide-react";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { href: "/admin/categories", icon: Tag, label: "Categories" },
  { href: "/admin/products", icon: Package, label: "Products" },
  { href: "/admin/inventory", icon: BarChart3, label: "Inventory" },
  { href: "/admin/orders", icon: ShoppingCart, label: "Orders" },
  { href: "/admin/cms", icon: Layers, label: "Homepage CMS" },
  { href: "/admin/blog", icon: BookOpen, label: "Blog" },
  { href: "/admin/media", icon: Image, label: "Media" },
  { href: "/admin/enquiries", icon: MessageSquare, label: "Enquiries" },
  { href: "/admin/seo", icon: Globe, label: "SEO" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
  { href: "/admin/users", icon: Users, label: "Users" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetch('/api/dashboard').then(r => r.json()).then(setStats).catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/login', { method: 'DELETE' });
    router.push('/admin/login');
  };

  const isActive = (item: typeof navItems[0]) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center justify-center px-4 py-4 border-b border-white/10`}>
        {collapsed ? (
          <NextImage
            src="/images/logo/Rafah logo.webp"
            alt="Rafa Garden"
            width={36}
            height={36}
            className="object-contain"
          />
        ) : (
          <NextImage
            src="/images/logo/Rafah logo.webp"
            alt="Rafa Garden"
            width={130}
            height={48}
            className="object-contain"
          />
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-0.5 px-2">
        {navItems.map(item => {
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                active
                  ? 'bg-[#c81c6a] text-white shadow-lg shadow-[#c81c6a]/30'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              <item.icon size={18} className="flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              {/* Badges */}
              {!collapsed && item.label === 'Orders' && stats?.orders?.pending > 0 && (
                <span className="ml-auto bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{stats.orders.pending}</span>
              )}
              {!collapsed && item.label === 'Enquiries' && stats?.enquiries?.new > 0 && (
                <span className="ml-auto bg-[#c81c6a] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{stats.enquiries.new}</span>
              )}
              {!collapsed && item.label === 'Inventory' && stats?.products?.lowStock > 0 && (
                <span className="ml-auto bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{stats.products.lowStock}</span>
              )}
              {/* Tooltip for collapsed */}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="p-2 border-t border-white/10">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex items-center justify-center w-full py-2 text-white/40 hover:text-white hover:bg-white/10 rounded-xl transition-all"
        >
          {collapsed ? <ChevronRight size={18} /> : <><ChevronLeft size={16} /><span className="ml-2 text-xs">Collapse</span></>}
        </button>
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-3 py-2.5 mt-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </div>
  );

  // Login page — skip the entire admin shell so it renders full-screen
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-[#f1f1f2] overflow-hidden" style={{ fontFamily: 'AvantGarde, sans-serif' }}>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col flex-shrink-0 transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'}`} style={{ background: '#141414' }}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-60 flex flex-col z-10" style={{ background: '#141414' }}>
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 text-white/60 hover:text-white p-1">
              <X size={20} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center gap-4 px-4 md:px-6 flex-shrink-0 shadow-sm">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all">
            <Menu size={20} />
          </button>

          {/* Breadcrumb / page title */}
          <div className="flex-1">
            <p className="text-sm text-gray-400 capitalize">
              {pathname.split('/').filter(Boolean).join(' / ').replace('admin', 'Admin')}
            </p>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Low stock alert */}
            {stats?.products?.lowStock > 0 && (
              <Link href="/admin/inventory" className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-xl text-xs font-medium border border-amber-200 hover:bg-amber-100 transition-all">
                <AlertTriangle size={14} />
                {stats.products.lowStock} low stock
              </Link>
            )}
            {/* View site */}
            <Link href="/" target="_blank" className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-[#f1f1f2] text-gray-600 rounded-xl text-xs font-medium hover:bg-gray-200 transition-all">
              <Globe size={14} />
              View Site
            </Link>
            {/* Admin badge */}
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg, #c81c6a, #9a0c52)' }}>
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
