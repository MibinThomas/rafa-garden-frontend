"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package, Tag, ShoppingCart, AlertTriangle, Star, TrendingUp,
  MessageSquare, Plus, RefreshCw, ArrowRight, BarChart3,
  CheckCircle, XCircle, Clock, Truck
} from "lucide-react";

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const stockColors: Record<string, string> = {
  'in-stock': 'bg-green-100 text-green-700',
  'low-stock': 'bg-amber-100 text-amber-700',
  'out-of-stock': 'bg-red-100 text-red-700',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    setApiError(false);
    try {
      const res = await fetch('/api/dashboard');
      if (res.ok) {
        setStats(await res.json());
      } else {
        setApiError(true);
      }
    } catch {
      setApiError(true);
    }
    setLoading(false);
  };

  useEffect(() => { fetchStats(); }, []);

  const statCards = stats ? [
    { label: 'Total Revenue', value: stats.revenue ? `₹${stats.revenue.toLocaleString()}` : '₹0', icon: TrendingUp, color: '#10b981', href: '/admin/orders' },
    { label: 'Total Products', value: stats.products.total, icon: Package, color: '#c81c6a', href: '/admin/products' },
    { label: 'Active Products', value: stats.products.active, icon: CheckCircle, color: '#7fa23f', href: '/admin/products' },
    { label: 'Low Stock', value: stats.products.lowStock, icon: AlertTriangle, color: '#f59e0b', href: '/admin/inventory' },
    { label: 'Categories', value: stats.categories.total, icon: Tag, color: '#9a0c52', href: '/admin/categories' },
    { label: 'Featured', value: stats.products.featured, icon: Star, color: '#c81c6a', href: '/admin/products' },
    { label: 'Total Orders', value: stats.orders.total, icon: ShoppingCart, color: '#5d5f61', href: '/admin/orders' },
    { label: 'New Enquiries', value: stats.enquiries.new, icon: MessageSquare, color: '#7fa23f', href: '/admin/enquiries' },
  ] : [];

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-[#1a1a1a]" style={{ fontFamily: 'DharmaGothic, sans-serif', letterSpacing: '0.05em' }}>DASHBOARD</h1>
          <p className="text-gray-400 text-sm mt-1">Welcome back. Here&apos;s what&apos;s happening.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchStats} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 text-gray-600 rounded-xl text-sm hover:bg-gray-50 transition-all shadow-sm">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <Link href="/admin/products/new" className="flex items-center gap-2 px-4 py-2 text-white rounded-xl text-sm font-medium shadow-lg transition-all hover:opacity-90" style={{ background: 'linear-gradient(135deg, #c81c6a, #9a0c52)' }}>
            <Plus size={14} />
            Add Product
          </Link>
        </div>
      </div>

      {/* API Error Banner */}
      {apiError && !loading && (
        <div className="flex items-center gap-3 px-5 py-3 bg-amber-50 border border-amber-200 rounded-2xl text-sm">
          <AlertTriangle size={16} className="text-amber-500 flex-shrink-0" />
          <p className="text-amber-700 flex-1">Could not connect to the database. Check that MongoDB is running.</p>
          <button onClick={fetchStats} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-xl text-xs font-medium transition-all">
            <RefreshCw size={12} /> Retry
          </button>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 animate-pulse shadow-sm">
                <div className="h-8 w-8 bg-gray-100 rounded-xl mb-3" />
                <div className="h-7 w-16 bg-gray-100 rounded mb-2" />
                <div className="h-4 w-24 bg-gray-100 rounded" />
              </div>
            ))
          : apiError
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 opacity-50">
                <div className="w-10 h-10 rounded-xl bg-gray-100 mb-3" />
                <p className="text-2xl font-black text-gray-300" style={{ fontFamily: 'DharmaGothic, sans-serif' }}>—</p>
                <p className="text-gray-300 text-xs mt-0.5">Unavailable</p>
              </div>
            ))
          : statCards.map((card) => (
              <Link key={card.label} href={card.href} className="group bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: card.color + '15' }}>
                    <card.icon size={20} style={{ color: card.color }} />
                  </div>
                  <ArrowRight size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors mt-1" />
                </div>
                <p className="text-2xl font-black text-[#1a1a1a]" style={{ fontFamily: 'DharmaGothic, sans-serif' }}>{card.value}</p>
                <p className="text-gray-400 text-xs mt-0.5">{card.label}</p>
              </Link>
            ))
        }
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <ShoppingCart size={18} className="text-[#c81c6a]" />
              <h2 className="font-bold text-[#1a1a1a]">Recent Orders</h2>
            </div>
            <Link href="/admin/orders" className="text-xs text-[#c81c6a] hover:underline flex items-center gap-1">View all <ArrowRight size={12} /></Link>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-6 space-y-3">
                {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-10 bg-gray-50 rounded-xl animate-pulse" />)}
              </div>
            ) : !stats?.recentOrders?.length ? (
              <div className="p-12 text-center text-gray-400">
                <ShoppingCart size={32} className="mx-auto mb-3 opacity-30" />
                <p>No orders yet</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-400 bg-gray-50/50">
                    <th className="text-left px-6 py-3 font-medium">Order</th>
                    <th className="text-left px-4 py-3 font-medium">Customer</th>
                    <th className="text-left px-4 py-3 font-medium">Amount</th>
                    <th className="text-left px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order: any) => (
                    <tr key={order._id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-3 font-mono text-xs text-[#c81c6a]">{order.orderId || order.orderNumber}</td>
                      <td className="px-4 py-3 text-gray-700">{order.customer?.name}</td>
                      <td className="px-4 py-3 font-semibold text-[#1a1a1a]">₹{order.totalAmount?.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-500" />
              <h2 className="font-bold text-[#1a1a1a]">Low Stock</h2>
            </div>
            <Link href="/admin/inventory" className="text-xs text-[#c81c6a] hover:underline flex items-center gap-1">Manage <ArrowRight size={12} /></Link>
          </div>
          <div className="p-4 space-y-2 max-h-[340px] overflow-y-auto">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-12 bg-gray-50 rounded-xl animate-pulse" />)
            ) : !stats?.lowStockProducts?.length ? (
              <div className="py-8 text-center text-gray-400">
                <CheckCircle size={28} className="mx-auto mb-2 text-green-400 opacity-60" />
                <p className="text-sm">All stock levels are healthy!</p>
              </div>
            ) : stats.lowStockProducts.map((p: any) => (
              <div key={p._id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/60 hover:bg-gray-100/60 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1a1a1a] truncate">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.category} · {p.sku || 'No SKU'}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${stockColors[p.stockStatus] || 'bg-gray-100'}`}>
                    {p.stock} left
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-bold text-[#1a1a1a] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Add Product', href: '/admin/products/new', icon: Package, color: '#c81c6a' },
            { label: 'Add Category', href: '/admin/categories', icon: Tag, color: '#9a0c52' },
            { label: 'Manage Inventory', href: '/admin/inventory', icon: BarChart3, color: '#f59e0b' },
            { label: 'Edit Homepage', href: '/admin/cms', icon: TrendingUp, color: '#7fa23f' },
          ].map(a => (
            <Link key={a.label} href={a.href} className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all group">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: a.color + '15' }}>
                <a.icon size={18} style={{ color: a.color }} />
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-[#1a1a1a] transition-colors">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
