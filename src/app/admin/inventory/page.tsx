"use client";
import { useState, useEffect } from "react";
import { BarChart3, Search, Filter, Save, RefreshCw, History, ChevronDown, X, AlertTriangle, CheckCircle } from "lucide-react";

const statusColors: Record<string, string> = {
  'in-stock': 'bg-green-100 text-green-700',
  'low-stock': 'bg-amber-100 text-amber-700',
  'out-of-stock': 'bg-red-100 text-red-700',
};

function Toast({ msg, type, onClose }: any) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return <div className={`fixed bottom-6 right-6 z-[9999] px-5 py-3 rounded-2xl text-white text-sm font-medium shadow-2xl flex items-center gap-3 ${type === 'success' ? 'bg-[#7fa23f]' : 'bg-red-500'}`}>{msg}</div>;
}

export default function InventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [editing, setEditing] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [toast, setToast] = useState<any>(null);
  const [historyModal, setHistoryModal] = useState<any>(null);
  const [historyLogs, setHistoryLogs] = useState<any[]>([]);

  const showToast = (msg: string, type: string) => setToast({ msg, type });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([fetch('/api/inventory'), fetch('/api/categories')]);
      if (pRes.ok) setProducts(await pRes.json());
      if (cRes.ok) setCategories(await cRes.json());
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const updateStock = async (product: any, newQty: number, changeType = 'adjust') => {
    setSaving(product._id);
    try {
      const res = await fetch('/api/inventory', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product._id, stock: newQty, changeType }),
      });
      if (res.ok) {
        showToast('Stock updated!', 'success');
        setEditing(e => { const n = { ...e }; delete n[product._id]; return n; });
        fetchData();
      } else showToast('Update failed', 'error');
    } catch { showToast('Error', 'error'); }
    setSaving(null);
  };

  const viewHistory = async (product: any) => {
    setHistoryModal(product);
    try {
      const res = await fetch(`/api/inventory/log?productId=${product.id || product._id}`);
      if (res.ok) setHistoryLogs(await res.json());
    } catch {}
  };

  const filtered = products.filter(p => {
    if (search && !p.name?.toLowerCase().includes(search.toLowerCase()) && !p.sku?.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterCat && p.category !== filterCat) return false;
    if (filterStatus && p.stockStatus !== filterStatus) return false;
    return true;
  });

  const summaryStats = {
    total: products.length,
    inStock: products.filter(p => p.stockStatus === 'in-stock').length,
    lowStock: products.filter(p => p.stockStatus === 'low-stock').length,
    outOfStock: products.filter(p => p.stockStatus === 'out-of-stock').length,
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1400px]" style={{ fontFamily: 'AvantGarde, sans-serif' }}>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-[#1a1a1a]" style={{ fontFamily: 'DharmaGothic, sans-serif', letterSpacing: '0.05em' }}>INVENTORY</h1>
          <p className="text-gray-400 text-sm mt-1">Manage stock levels across all products</p>
        </div>
        <button onClick={fetchData} className="p-2.5 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-all shadow-sm">
          <RefreshCw size={16} className={`text-gray-500 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Products', value: summaryStats.total, color: '#5d5f61', bg: 'bg-gray-50' },
          { label: 'In Stock', value: summaryStats.inStock, color: '#7fa23f', bg: 'bg-green-50' },
          { label: 'Low Stock', value: summaryStats.lowStock, color: '#f59e0b', bg: 'bg-amber-50' },
          { label: 'Out of Stock', value: summaryStats.outOfStock, color: '#ef4444', bg: 'bg-red-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 border border-white`}>
            <p className="text-2xl font-black" style={{ color: s.color, fontFamily: 'DharmaGothic, sans-serif' }}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-5 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search product or SKU..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a] transition-all" />
        </div>
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 focus:outline-none focus:border-[#c81c6a] bg-white">
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 focus:outline-none focus:border-[#c81c6a] bg-white">
          <option value="">All Status</option>
          <option value="in-stock">In Stock</option>
          <option value="low-stock">Low Stock</option>
          <option value="out-of-stock">Out of Stock</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-12 bg-gray-50 rounded-xl animate-pulse" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400"><BarChart3 size={32} className="mx-auto mb-3 opacity-30" /><p>No products found</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 bg-gray-50/60 border-b border-gray-100">
                  <th className="text-left px-6 py-3 font-medium">Product</th>
                  <th className="text-left px-4 py-3 font-medium">SKU</th>
                  <th className="text-left px-4 py-3 font-medium">Category</th>
                  <th className="text-left px-4 py-3 font-medium">Stock Qty</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium">Threshold</th>
                  <th className="text-right px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => {
                  const isEditing = editing[p._id] !== undefined;
                  const editQty = isEditing ? editing[p._id] : (p.stock ?? 0);
                  return (
                    <tr key={p._id} className={`border-t border-gray-50 hover:bg-gray-50/50 transition-colors ${p.stockStatus === 'out-of-stock' ? 'bg-red-50/30' : p.stockStatus === 'low-stock' ? 'bg-amber-50/30' : ''}`}>
                      <td className="px-6 py-3 font-medium text-[#1a1a1a]">{p.name}</td>
                      <td className="px-4 py-3 text-gray-400 font-mono text-xs">{p.sku || '—'}</td>
                      <td className="px-4 py-3 text-gray-500">{p.category}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={editQty}
                            onChange={e => setEditing(prev => ({ ...prev, [p._id]: parseInt(e.target.value) || 0 }))}
                            className="w-20 px-2.5 py-1.5 rounded-xl border border-gray-200 text-sm text-center focus:outline-none focus:border-[#c81c6a] transition-all"
                          />
                          {isEditing && (
                            <>
                              <button onClick={() => updateStock(p, editQty)} disabled={saving === p._id}
                                className="flex items-center gap-1 px-3 py-1.5 bg-[#c81c6a] text-white rounded-xl text-xs font-medium hover:bg-[#9a0c52] transition-all disabled:opacity-50">
                                <Save size={11} /> {saving === p._id ? '...' : 'Save'}
                              </button>
                              <button onClick={() => setEditing(e => { const n = { ...e }; delete n[p._id]; return n; })}
                                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
                                <X size={13} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[p.stockStatus] || 'bg-gray-100 text-gray-500'}`}>
                          {p.stockStatus?.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{p.lowStockThreshold || 10}</td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          <button onClick={() => updateStock(p, (p.stock || 0) + 10, 'add')} className="px-2 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg text-xs font-medium transition-all" title="Add 10">+10</button>
                          <button onClick={() => updateStock(p, Math.max(0, (p.stock || 0) - 10), 'reduce')} className="px-2 py-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg text-xs font-medium transition-all" title="Remove 10">-10</button>
                          <button onClick={() => viewHistory(p)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all" title="History">
                            <History size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* History Modal */}
      {historyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setHistoryModal(null)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="font-black text-[#1a1a1a]" style={{ fontFamily: 'DharmaGothic, sans-serif', letterSpacing: '0.05em' }}>STOCK HISTORY</h2>
              <button onClick={() => setHistoryModal(null)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"><X size={18} /></button>
            </div>
            <p className="px-6 py-3 text-sm text-gray-500 border-b border-gray-50">{historyModal.name}</p>
            <div className="overflow-y-auto flex-1 p-4 space-y-2">
              {historyLogs.length === 0 ? (
                <p className="text-center text-gray-400 py-8 text-sm">No history available</p>
              ) : historyLogs.map((log: any) => (
                <div key={log._id} className="flex items-start justify-between p-3 rounded-xl bg-gray-50">
                  <div>
                    <p className="text-sm font-medium text-[#1a1a1a] capitalize">{log.changeType} stock</p>
                    <p className="text-xs text-gray-400">{log.note || 'Manual adjustment'} · {log.adminUser}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(log.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#1a1a1a]">{log.previousQty} → {log.newQty}</p>
                    <p className={`text-xs font-medium ${log.newQty > log.previousQty ? 'text-green-500' : 'text-red-500'}`}>
                      {log.newQty > log.previousQty ? '+' : ''}{log.newQty - log.previousQty}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
