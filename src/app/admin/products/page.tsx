"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Edit2, Trash2, Eye, EyeOff, RefreshCw, Package, Upload } from "lucide-react";
import dynamic from "next/dynamic";

const BulkUploadModal = dynamic(() => import('@/components/admin/BulkUploadModal'), { ssr: false });

const statusColors: Record<string, string> = {
  'in-stock': 'bg-green-100 text-green-700',
  'low-stock': 'bg-amber-100 text-amber-700',
  'out-of-stock': 'bg-red-100 text-red-700',
};

function Toast({ msg, type, onClose }: any) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed bottom-6 right-6 z-[9999] px-5 py-3 rounded-2xl text-white text-sm font-medium shadow-2xl flex items-center gap-3 ${type === 'success' ? 'bg-[#7fa23f]' : 'bg-red-500'}`}>
      {msg}
    </div>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterFeatured, setFilterFeatured] = useState('');
  const [toast, setToast] = useState<any>(null);
  const [showBulkUpload, setShowBulkUpload] = useState(false);

  const showToast = (msg: string, type: string) => setToast({ msg, type });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([fetch('/api/products'), fetch('/api/categories')]);
      if (pRes.ok) setProducts(await pRes.json());
      if (cRes.ok) setCategories(await cRes.json());
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (product: any) => {
    if (!confirm(`Delete "${product.name}"?`)) return;
    try {
      const res = await fetch(`/api/products/${product._id}`, { method: 'DELETE' });
      if (res.ok) { showToast('Product deleted', 'success'); fetchData(); }
      else showToast('Delete failed', 'error');
    } catch { showToast('Error', 'error'); }
  };

  const toggleActive = async (product: any) => {
    try {
      await fetch(`/api/products/${product._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !product.active }),
      });
      fetchData();
    } catch {}
  };

  const filtered = products.filter(p => {
    if (search && !p.name?.toLowerCase().includes(search.toLowerCase()) && !p.sku?.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterCat && p.category !== filterCat) return false;
    if (filterStatus && p.stockStatus !== filterStatus) return false;
    if (filterFeatured === 'featured' && !p.featured) return false;
    if (filterFeatured === 'bestseller' && !p.bestSeller) return false;
    if (filterFeatured === 'newarrival' && !p.newArrival) return false;
    return true;
  });

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1400px]" style={{ fontFamily: 'AvantGarde, sans-serif' }}>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-[#1a1a1a]" style={{ fontFamily: 'DharmaGothic, sans-serif', letterSpacing: '0.05em' }}>PRODUCTS</h1>
          <p className="text-gray-400 text-sm mt-1">{filtered.length} of {products.length} products</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchData} className="p-2.5 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-all shadow-sm">
            <RefreshCw size={16} className={`text-gray-500 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowBulkUpload(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all shadow-sm"
          >
            <Upload size={15} /> Bulk Import
          </button>
          <Link href="/admin/products/new" className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl text-sm font-medium shadow-lg hover:opacity-90 transition-all" style={{ background: 'linear-gradient(135deg, #c81c6a, #9a0c52)' }}>
            <Plus size={16} /> Add Product
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-5 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or SKU..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a] transition-all" />
        </div>
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 focus:outline-none focus:border-[#c81c6a] bg-white">
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 focus:outline-none focus:border-[#c81c6a] bg-white">
          <option value="">All Stock Status</option>
          <option value="in-stock">In Stock</option>
          <option value="low-stock">Low Stock</option>
          <option value="out-of-stock">Out of Stock</option>
        </select>
        <select value={filterFeatured} onChange={e => setFilterFeatured(e.target.value)} className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 focus:outline-none focus:border-[#c81c6a] bg-white">
          <option value="">All Types</option>
          <option value="featured">Featured</option>
          <option value="bestseller">Best Seller</option>
          <option value="newarrival">New Arrival</option>
        </select>
        {(search || filterCat || filterStatus || filterFeatured) && (
          <button onClick={() => { setSearch(''); setFilterCat(''); setFilterStatus(''); setFilterFeatured(''); }}
            className="px-4 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl text-sm transition-all">
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-14 bg-gray-50 rounded-xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <Package size={36} className="mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500 font-medium">No products found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or add a new product</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 bg-gray-50/60 border-b border-gray-100">
                  <th className="text-left px-6 py-3 font-medium">Product</th>
                  <th className="text-left px-4 py-3 font-medium">SKU</th>
                  <th className="text-left px-4 py-3 font-medium">Category</th>
                  <th className="text-left px-4 py-3 font-medium">Price</th>
                  <th className="text-left px-4 py-3 font-medium">Stock</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium">Flags</th>
                  <th className="text-right px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(product => (
                  <tr key={product._id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#f1f1f2] flex-shrink-0 border border-gray-100">
                          {product.image && (
                            <div className="relative w-full h-full">
                              <Image src={product.image} alt={product.name} fill className="object-cover" sizes="40px" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-[#1a1a1a] leading-tight">{product.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">{product.sku || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{product.category}</td>
                    <td className="px-4 py-3">
                      {product.offerPrice ? (
                        <div>
                          <p className="font-semibold text-[#1a1a1a]">₹{product.offerPrice}</p>
                          <p className="text-xs text-gray-400 line-through">₹{product.price}</p>
                        </div>
                      ) : product.price ? (
                        <p className="font-semibold text-[#1a1a1a]">₹{product.price}</p>
                      ) : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{product.stock ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[product.stockStatus] || 'bg-gray-100 text-gray-500'}`}>
                        {product.stockStatus?.replace('-', ' ') || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {product.featured && <span className="px-1.5 py-0.5 bg-amber-100 text-amber-600 rounded-lg text-[10px] font-bold">★ Featured</span>}
                        {product.bestSeller && <span className="px-1.5 py-0.5 bg-purple-100 text-purple-600 rounded-lg text-[10px] font-bold">Best</span>}
                        {product.newArrival && <span className="px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded-lg text-[10px] font-bold">New</span>}
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <Link href={`/admin/products/${product._id}`} className="p-2 text-gray-400 hover:text-[#c81c6a] hover:bg-[#c81c6a]/5 rounded-xl transition-all">
                          <Edit2 size={15} />
                        </Link>
                        <button onClick={() => toggleActive(product)} className="p-2 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-xl transition-all">
                          {product.active ? <Eye size={15} /> : <EyeOff size={15} />}
                        </button>
                        <button onClick={() => handleDelete(product)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {showBulkUpload && (
        <BulkUploadModal
          onClose={() => setShowBulkUpload(false)}
          onSuccess={() => { fetchData(); setShowBulkUpload(false); }}
        />
      )}
    </div>
  );
}
