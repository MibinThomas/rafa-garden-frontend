"use client";
import { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Save, Upload, Plus, Trash2, X, Star } from "lucide-react";

const EMPTY = {
  name: '', slug: '', description: '', shortDescription: '', image: '', gallery: [] as string[],
  category: '', id: '', variants: [{ size: '', unit: '', price: '' }],
  price: '', offerPrice: '', sku: '', stock: 0, stockStatus: 'in-stock', lowStockThreshold: 10,
  weight: '', ingredients: '', nutritionalInfo: '', packaging: '', tags: '',
  featured: false, bestSeller: false, newArrival: false, active: true, sortOrder: 0,
  seoTitle: '', seoDescription: '',
};

function Toast({ msg, type, onClose }: any) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return <div className={`fixed bottom-6 right-6 z-[9999] px-5 py-3 rounded-2xl text-white text-sm font-medium shadow-2xl ${type === 'success' ? 'bg-[#7fa23f]' : 'bg-red-500'}`}>{msg}</div>;
}

function InputField({ label, value, onChange, type = 'text', placeholder = '', span = 1 }: any) {
  return (
    <div className={span === 2 ? 'col-span-2' : ''}>
      <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">{label}</label>
      {type === 'textarea' ? (
        <textarea rows={3} value={value || ''} onChange={onChange} placeholder={placeholder}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a] transition-all resize-none" />
      ) : (
        <input type={type} value={value ?? ''} onChange={onChange} placeholder={placeholder}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a] transition-all" />
      )}
    </div>
  );
}

export default function ProductFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const isNew = id === 'new';
  const router = useRouter();
  const [form, setForm] = useState<any>({ ...EMPTY });
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [toast, setToast] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'basic'|'inventory'|'details'|'seo'>('basic');
  const mainImgRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, type: string) => setToast({ msg, type });

  const updateField = (field: string, value: any) => {
    setForm((f: any) => ({ ...f, [field]: value }));
  };

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(setCategories).catch(() => {});
    if (!isNew) {
      fetch(`/api/products/${id}`).then(r => r.json()).then(data => {
        setForm({ ...EMPTY, ...data, tags: Array.isArray(data.tags) ? data.tags.join(', ') : data.tags || '', variants: data.variants?.length ? data.variants : [{ size: '', unit: '', price: '' }] });
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [id, isNew]);

  const handleUpload = async (field: string, file: File) => {
    setUploading(field);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: arrayBuffer
      });
      if (res.ok) {
        const data = await res.json();
        const url = data.url || data;
        if (field === 'gallery') {
          setForm((f: any) => ({ ...f, gallery: [...(f.gallery || []), url] }));
        } else {
          setForm((f: any) => ({ ...f, [field]: url }));
        }
        showToast('Uploaded!', 'success');
      } else showToast('Upload failed', 'error');
    } catch { showToast('Upload error', 'error'); }
    setUploading(null);
  };

  const handleSave = async () => {
    if (!form.name || !form.category || !form.image) {
      showToast('Name, category, and image are required', 'error'); return;
    }
    if (!form.id && isNew) {
      const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      form.id = `${form.category.toLowerCase().slice(0, 1)}-${Date.now()}`;
      form.slug = slug;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: form.price ? parseFloat(form.price) : undefined,
        offerPrice: form.offerPrice ? parseFloat(form.offerPrice) : undefined,
        stock: parseInt(form.stock) || 0,
        tags: form.tags ? form.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
        variants: form.variants.filter((v: any) => v.size || v.unit),
      };
      const url = isNew ? '/api/products' : `/api/products/${id}`;
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (res.ok) {
        showToast(isNew ? 'Product created!' : 'Product updated!', 'success');
        setTimeout(() => router.push('/admin/products'), 1000);
      } else {
        const d = await res.json();
        showToast(d.error || 'Save failed', 'error');
      }
    } catch { showToast('Save error', 'error'); }
    setSaving(false);
  };

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-[400px]">
      <div className="w-8 h-8 border-2 border-gray-200 border-t-[#c81c6a] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1400px]" style={{ fontFamily: 'AvantGarde, sans-serif' }}>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-[#1a1a1a]" style={{ fontFamily: 'DharmaGothic, sans-serif', letterSpacing: '0.05em' }}>
              {isNew ? 'ADD PRODUCT' : 'EDIT PRODUCT'}
            </h1>
            <p className="text-gray-400 text-sm mt-1">{isNew ? 'Create a new product' : `Editing: ${form.name}`}</p>
          </div>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 text-white rounded-xl text-sm font-medium shadow-lg hover:opacity-90 transition-all disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #c81c6a, #9a0c52)' }}>
          <Save size={16} /> {saving ? 'Saving...' : 'Save Product'}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="xl:col-span-2 space-y-4">
          {/* Tabs */}
          <div className="flex gap-1 bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100">
            {(['basic', 'inventory', 'details', 'seo'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 rounded-xl text-xs font-medium capitalize transition-all ${activeTab === tab ? 'bg-[#c81c6a] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
                {tab}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            {activeTab === 'basic' && (
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Product Name *" value={form.name} onChange={(e: any) => updateField('name', e.target.value)} placeholder="e.g. Dragon Fruit Crush 500ml" span={2} />
                <InputField label="Product ID" value={form.id} onChange={(e: any) => updateField('id', e.target.value)} placeholder="e.g. c-1 (auto-generated if empty)" />
                <InputField label="Slug" value={form.slug} onChange={(e: any) => updateField('slug', e.target.value)} placeholder="e.g. dragon-fruit-crush-500ml" />
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Category *</label>
                  <select value={form.category || ''} onChange={e => updateField('category', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a] bg-white transition-all">
                    <option value="">Select a category...</option>
                    {categories.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
                  </select>
                </div>
                <InputField label="Short Description" value={form.shortDescription} onChange={(e: any) => updateField('shortDescription', e.target.value)} type="textarea" span={2} placeholder="Brief product summary for cards..." />
                <InputField label="Full Description" value={form.description} onChange={(e: any) => updateField('description', e.target.value)} type="textarea" span={2} placeholder="Detailed product description..." />

                {/* Variants */}
                <div className="col-span-2">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Variants (Size / Unit / Price)</label>
                    <button onClick={() => setForm((f: any) => ({ ...f, variants: [...f.variants, { size: '', unit: '', price: '' }] }))}
                      className="flex items-center gap-1 text-xs text-[#c81c6a] hover:underline">
                      <Plus size={12} /> Add Variant
                    </button>
                  </div>
                  <div className="space-y-2">
                    {form.variants.map((v: any, i: number) => (
                      <div key={i} className="flex gap-2 items-center">
                        <input type="text" placeholder="Size (e.g. 500)" value={v.size} onChange={e => { const vars = [...form.variants]; vars[i] = { ...v, size: e.target.value }; setForm((f: any) => ({ ...f, variants: vars })); }}
                          className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a] transition-all" />
                        <input type="text" placeholder="Unit (ML/G/KG)" value={v.unit} onChange={e => { const vars = [...form.variants]; vars[i] = { ...v, unit: e.target.value }; setForm((f: any) => ({ ...f, variants: vars })); }}
                          className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a] transition-all" />
                        <input type="number" placeholder="Price (₹)" value={v.price} onChange={e => { const vars = [...form.variants]; vars[i] = { ...v, price: e.target.value }; setForm((f: any) => ({ ...f, variants: vars })); }}
                          className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a] transition-all" />
                        {form.variants.length > 1 && (
                          <button onClick={() => setForm((f: any) => ({ ...f, variants: f.variants.filter((_: any, j: number) => j !== i) }))}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'inventory' && (
              <div className="grid grid-cols-2 gap-4">
                <InputField label="SKU / Product Code" value={form.sku} onChange={(e: any) => updateField('sku', e.target.value)} placeholder="e.g. RG-CRUSH-500" />
                <InputField label="Sort Order" value={form.sortOrder} onChange={(e: any) => updateField('sortOrder', e.target.value)} type="number" placeholder="0" />
                <InputField label="Price (₹)" value={form.price} onChange={(e: any) => updateField('price', e.target.value)} type="number" placeholder="0.00" />
                <InputField label="Offer Price (₹)" value={form.offerPrice} onChange={(e: any) => updateField('offerPrice', e.target.value)} type="number" placeholder="0.00" />
                <InputField label="Stock Quantity" value={form.stock} onChange={(e: any) => updateField('stock', e.target.value)} type="number" placeholder="0" />
                <InputField label="Low Stock Threshold" value={form.lowStockThreshold} onChange={(e: any) => updateField('lowStockThreshold', e.target.value)} type="number" placeholder="10" />
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Stock Status</label>
                  <select value={form.stockStatus || 'in-stock'} onChange={e => updateField('stockStatus', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a] bg-white transition-all">
                    <option value="in-stock">In Stock</option>
                    <option value="low-stock">Low Stock</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </select>
                </div>
                <InputField label="Weight / Volume" value={form.weight} onChange={(e: any) => updateField('weight', e.target.value)} placeholder="e.g. 500ml, 250g" />
                <InputField label="Tags (comma separated)" value={form.tags} onChange={(e: any) => updateField('tags', e.target.value)} placeholder="organic, premium, bestseller" span={2} />
              </div>
            )}

            {activeTab === 'details' && (
              <div className="space-y-4">
                <InputField label="Ingredients" value={form.ingredients} onChange={(e: any) => updateField('ingredients', e.target.value)} type="textarea" placeholder="List all ingredients..." />
                <InputField label="Nutritional Information" value={form.nutritionalInfo} onChange={(e: any) => updateField('nutritionalInfo', e.target.value)} type="textarea" placeholder="Calories, protein, etc..." />
                <InputField label="Packaging Details" value={form.packaging} onChange={(e: any) => updateField('packaging', e.target.value)} type="textarea" placeholder="Packaging material, recyclable, etc..." />
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="space-y-4">
                <InputField label="SEO Title" value={form.seoTitle} onChange={(e: any) => updateField('seoTitle', e.target.value)} placeholder="Product page meta title" />
                <InputField label="SEO Description" value={form.seoDescription} onChange={(e: any) => updateField('seoDescription', e.target.value)} type="textarea" placeholder="Product page meta description" />
              </div>
            )}
          </div>
        </div>


        {/* Sidebar */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Main Image *</label>
              <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-mono">800 × 800 px · PNG/WebP</span>
            </div>
            <div className="aspect-square rounded-xl overflow-hidden bg-[#f1f1f2] border border-gray-100 mb-3 relative">
              {form.image ? (
                <Image src={form.image} alt="Product" fill className="object-contain p-4" sizes="280px" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                  <Upload size={28} className="mb-2" />
                  <p className="text-xs">No image</p>
                </div>
              )}
            </div>
            <input type="text" value={form.image || ''} onChange={e => setForm((f: any) => ({ ...f, image: e.target.value }))}
              placeholder="/images/product.png" className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#c81c6a] transition-all mb-2" />
            <button onClick={() => mainImgRef.current?.click()} disabled={uploading === 'image'}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl text-sm text-gray-600 font-medium transition-all border border-gray-100">
              <Upload size={14} /> {uploading === 'image' ? 'Uploading...' : 'Upload Image'}
            </button>
            <input ref={mainImgRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleUpload('image', e.target.files[0])} />
          </div>

          {/* Gallery */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Gallery</label>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-mono">1200 × 900 px</span>
                <button onClick={() => galleryRef.current?.click()} disabled={!!uploading}
                  className="flex items-center gap-1 text-xs text-[#c81c6a] hover:underline">
                  <Plus size={12} /> Add
                </button>
              </div>
            </div>
            <input ref={galleryRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleUpload('gallery', e.target.files[0])} />
            {form.gallery?.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {form.gallery.map((url: string, i: number) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-[#f1f1f2] group">
                    <Image src={url} alt={`gallery-${i}`} fill className="object-cover" sizes="80px" />
                    <button onClick={() => setForm((f: any) => ({ ...f, gallery: f.gallery.filter((_: string, j: number) => j !== i) }))}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 text-center py-4">No gallery images</p>
            )}
          </div>

          {/* Status Toggles */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <label className="block text-xs font-medium text-gray-500 mb-4 uppercase tracking-wide">Product Flags</label>
            <div className="space-y-3">
              {[
                { field: 'active', label: 'Active / Visible', icon: '👁' },
                { field: 'featured', label: 'Featured', icon: '⭐' },
                { field: 'bestSeller', label: 'Best Seller', icon: '🏆' },
                { field: 'newArrival', label: 'New Arrival', icon: '✨' },
              ].map(({ field, label, icon }) => (
                <label key={field} className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-gray-700">{icon} {label}</span>
                  <div className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer flex-shrink-0 ${form[field] ? 'bg-[#c81c6a]' : 'bg-gray-200'}`}
                    onClick={() => setForm((f: any) => ({ ...f, [field]: !f[field] }))}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${form[field] ? 'left-5' : 'left-0.5'}`} />
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
