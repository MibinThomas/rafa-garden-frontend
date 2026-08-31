"use client";
import { useState, useEffect, useRef } from "react";
import { Plus, Edit2, Trash2, Eye, EyeOff, Star, GripVertical, X, Save, Upload, RefreshCw, ChevronDown } from "lucide-react";
import Image from "next/image";

const EMPTY_CAT = {
  id: '', title: '', slug: '', subtitle: '', description: '', longDescription: '',
  image: '', bannerImage: '', color: '#c81c6a', accentColor: '', buttonColor: '',
  watermarkText: '', watermarkOpacity: 0.04, ctaText: '', ctaLink: '',
  mobileTitle: '', mobileShortDesc: '', mobileActiveDesc: '',
  mobileImgPosition: 'center', desktopImgPosition: 'center',
  enabled: true, featured: false, order: 0,
  seoTitle: '', seoDescription: '', lowStockThreshold: 10,
};

function Toast({ msg, type, onClose }: { msg: string; type: 'success'|'error'; onClose: ()=>void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed bottom-6 right-6 z-[9999] px-5 py-3 rounded-2xl text-white text-sm font-medium shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-2 ${type === 'success' ? 'bg-[#7fa23f]' : 'bg-red-500'}`}>
      {msg}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><X size={14} /></button>
    </div>
  );
}

function InputField({ label, value, onChange, type = 'text', placeholder = '', full = false }: any) {
  return (
    <div className={full ? 'col-span-2' : ''}>
      <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">{label}</label>
      {type === 'textarea' ? (
        <textarea rows={3} value={value || ''} onChange={onChange}
          placeholder={placeholder} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a] focus:ring-2 focus:ring-[#c81c6a]/10 transition-all resize-none" />
      ) : (
        <input type={type} value={value ?? ''} onChange={onChange}
          placeholder={placeholder} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a] focus:ring-2 focus:ring-[#c81c6a]/10 transition-all" />
      )}
    </div>
  );
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<any>({ ...EMPTY_CAT });
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success'|'error' } | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'basic'|'mobile'|'seo'>('basic');
  const fileRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);
  const mobileImgRef = useRef<HTMLInputElement>(null);
  const desktopBannerRef = useRef<HTMLInputElement>(null);

  const updateField = (field: string, value: any) => {
    setForm((f: any) => ({ ...f, [field]: value }));
  };

  // Strip alpha channel from hex colors — browser color inputs only accept #rrggbb
  const toHex6 = (hex: string) => {
    if (!hex) return '#c81c6a';
    const clean = hex.replace('#', '');
    return '#' + (clean.length >= 6 ? clean.slice(0, 6) : clean.padEnd(6, '0'));
  };

  const showToast = (msg: string, type: 'success'|'error') => setToast({ msg, type });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/categories');
      if (res.ok) setCategories(await res.json());
    } catch { showToast('Failed to load categories', 'error'); }
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  const openAdd = () => {
    setForm({ ...EMPTY_CAT, order: categories.length });
    setEditing(null);
    setActiveTab('basic');
    setShowForm(true);
  };

  const openEdit = (cat: any) => {
    setForm({ ...EMPTY_CAT, ...cat });
    setEditing(cat._id || cat.id);
    setActiveTab('basic');
    setShowForm(true);
  };

  const handleUpload = async (field: string, file: File) => {
    setUploading(field);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const filename = `categories/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      const res = await fetch(`/api/upload?filename=${encodeURIComponent(filename)}`, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: arrayBuffer,
      });
      if (res.ok) {
        const data = await res.json();
        const url = data.url || data;
        setForm((f: any) => ({ ...f, [field]: url }));
        showToast('Image uploaded!', 'success');
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.error || 'Upload failed', 'error');
      }
    } catch { showToast('Upload error', 'error'); }
    setUploading(null);
  };

  const handleSave = async () => {
    if (!form.title || !form.id || !form.image) {
      showToast('Title, ID, and image are required', 'error'); return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        showToast(editing ? 'Category updated!' : 'Category created!', 'success');
        setShowForm(false);
        fetchCategories();
      } else {
        const d = await res.json();
        showToast(d.error || 'Save failed', 'error');
      }
    } catch { showToast('Save error', 'error'); }
    setSaving(false);
  };

  const handleDelete = async (cat: any) => {
    if (!confirm(`Delete "${cat.title}"? This cannot be undone.`)) return;
    setDeleting(cat._id || cat.id);
    try {
      const res = await fetch(`/api/categories?id=${cat.id}`, { method: 'DELETE' });
      if (res.ok) { showToast('Category deleted', 'success'); fetchCategories(); }
      else showToast('Delete failed', 'error');
    } catch { showToast('Delete error', 'error'); }
    setDeleting(null);
  };

  const toggleEnabled = async (cat: any) => {
    try {
      await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...cat, enabled: !cat.enabled }),
      });
      fetchCategories();
    } catch {}
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1400px]" style={{ fontFamily: 'AvantGarde, sans-serif' }}>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-[#1a1a1a]" style={{ fontFamily: 'DharmaGothic, sans-serif', letterSpacing: '0.05em' }}>CATEGORIES</h1>
          <p className="text-gray-400 text-sm mt-1">{categories.length} categories total</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchCategories} className="p-2.5 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-all shadow-sm">
            <RefreshCw size={16} className={`text-gray-500 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl text-sm font-medium shadow-lg hover:opacity-90 transition-all" style={{ background: 'linear-gradient(135deg, #c81c6a, #9a0c52)' }}>
            <Plus size={16} /> Add Category
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 animate-pulse shadow-sm h-48" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
          <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
            <Plus size={28} className="text-gray-300" />
          </div>
          <h3 className="font-bold text-gray-500 mb-2">No categories yet</h3>
          <p className="text-gray-400 text-sm mb-6">Add your first category to get started</p>
          <button onClick={openAdd} className="px-6 py-2.5 text-white rounded-xl text-sm font-medium" style={{ background: 'linear-gradient(135deg, #c81c6a, #9a0c52)' }}>Add Category</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {categories.map(cat => (
            <div key={cat._id || cat.id} className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all hover:shadow-md ${!cat.enabled ? 'opacity-60' : 'border-gray-100'}`}>
              {/* Color Banner */}
              <div className="h-2 w-full" style={{ backgroundColor: cat.color }} />
              <div className="p-5">
                <div className="flex items-start gap-4">
                  {/* Image */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-[#f1f1f2] border border-gray-100">
                    {cat.image ? (
                      <div className="relative w-full h-full">
                        <Image src={cat.image} alt={cat.title} fill className="object-cover" sizes="64px" />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No img</div>
                    )}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-[#1a1a1a] truncate">{cat.title}</h3>
                      {cat.featured && <Star size={12} className="text-amber-400 fill-amber-400 flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-gray-400 truncate">{cat.subtitle}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs px-2 py-0.5 rounded-full text-white font-medium" style={{ backgroundColor: cat.color }}>
                        {cat.id}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cat.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {cat.enabled ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Actions */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-50">
                  <button onClick={() => openEdit(cat)} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-gray-600 hover:text-[#c81c6a] hover:bg-[#c81c6a]/5 rounded-xl text-xs font-medium transition-all border border-gray-100 hover:border-[#c81c6a]/20">
                    <Edit2 size={13} /> Edit
                  </button>
                  <button onClick={() => toggleEnabled(cat)} className={`py-2 px-3 rounded-xl text-xs font-medium transition-all border ${cat.enabled ? 'text-gray-500 hover:text-amber-600 border-gray-100 hover:border-amber-200 hover:bg-amber-50' : 'text-green-600 border-green-100 hover:bg-green-50'}`}>
                    {cat.enabled ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button onClick={() => handleDelete(cat)} disabled={deleting === (cat._id || cat.id)} className="py-2 px-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl text-xs transition-all border border-transparent hover:border-red-100">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 overflow-y-auto">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-xl font-black text-[#1a1a1a]" style={{ fontFamily: 'DharmaGothic, sans-serif', letterSpacing: '0.05em' }}>
                {editing ? 'EDIT CATEGORY' : 'ADD CATEGORY'}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
                <X size={20} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 px-6 pt-4">
              {(['basic', 'mobile', 'seo'] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium capitalize transition-all ${activeTab === tab ? 'bg-[#c81c6a] text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
                  {tab}
                </button>
              ))}
            </div>

            <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
              {activeTab === 'basic' && (
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Category Title *" value={form.title} onChange={(e: any) => updateField('title', e.target.value)} placeholder="e.g. Crush" />
                  <InputField label="Category ID *" value={form.id} onChange={(e: any) => updateField('id', e.target.value)} placeholder="e.g. 01" />
                  <InputField label="Slug" value={form.slug} onChange={(e: any) => updateField('slug', e.target.value)} placeholder="e.g. crush" />
                  <InputField label="Subtitle" value={form.subtitle} onChange={(e: any) => updateField('subtitle', e.target.value)} placeholder="e.g. Pure Botanical Refreshment" />
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Short Description</label>
                    <textarea rows={2} value={form.description || ''} onChange={e => updateField('description', e.target.value)} placeholder="Short description for the category..." className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a] transition-all resize-none" />
                  </div>
                  {/* Category Image */}
                  <div className="col-span-2">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Category Image *</label>
                      <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-mono">Recommended: 800 × 800 px · PNG/WebP · transparent bg</span>
                    </div>
                    <div className="flex gap-3 items-start">
                      <input type="text" value={form.image || ''} onChange={e => updateField('image', e.target.value)}
                        placeholder="/images/hero/crush_bottle.png" className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a] transition-all" />
                      <button onClick={() => fileRef.current?.click()} disabled={uploading === 'image'}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-medium text-gray-600 transition-all flex-shrink-0">
                        <Upload size={13} /> {uploading === 'image' ? 'Uploading...' : 'Upload'}
                      </button>
                      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleUpload('image', e.target.files[0])} />
                    </div>
                    {form.image && (
                      <div className="mt-2 relative w-24 h-24 rounded-xl overflow-hidden border border-gray-100">
                        <Image src={form.image} alt="preview" fill className="object-cover" sizes="96px" />
                      </div>
                    )}
                  </div>
                  {/* Colors */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Highlight Color *</label>
                    <div className="flex gap-2">
                      <input type="color" value={toHex6(form.color)} onChange={e => updateField('color', e.target.value)} className="w-10 h-10 rounded-xl border border-gray-200 cursor-pointer" />
                      <input type="text" value={form.color || ''} onChange={e => updateField('color', e.target.value)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a] transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Accent Color</label>
                    <div className="flex gap-2">
                      <input type="color" value={toHex6(form.accentColor || form.color)} onChange={e => updateField('accentColor', e.target.value)} className="w-10 h-10 rounded-xl border border-gray-200 cursor-pointer" />
                      <input type="text" value={form.accentColor || ''} onChange={e => updateField('accentColor', e.target.value)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a] transition-all" />
                    </div>
                  </div>
                  <InputField label="Watermark Text" value={form.watermarkText} onChange={(e: any) => updateField('watermarkText', e.target.value)} placeholder="e.g. CRUSH" />
                  <InputField label="Sort Order" value={form.order} onChange={(e: any) => updateField('order', e.target.value)} type="number" placeholder="0" />
                  <InputField label="CTA Button Text" value={form.ctaText} onChange={(e: any) => updateField('ctaText', e.target.value)} placeholder="e.g. Buy Now" />
                  <InputField label="CTA Link" value={form.ctaLink} onChange={(e: any) => updateField('ctaLink', e.target.value)} placeholder="/shop?cat=crush" />
                  {/* Toggles */}
                  <div className="col-span-2 flex gap-6">
                    {[['enabled', 'Active'], ['featured', 'Featured']].map(([field, label]) => (
                      <label key={field} className="flex items-center gap-3 cursor-pointer">
                        <div className={`w-10 h-5 rounded-full transition-colors relative ${form[field] ? 'bg-[#c81c6a]' : 'bg-gray-200'}`}
                          onClick={() => updateField(field, !form[field])}>
                          <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${form[field] ? 'left-5' : 'left-0.5'}`} />
                        </div>
                        <span className="text-sm text-gray-600">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'mobile' && (
                <div className="space-y-5">
                  <InputField label="Mobile Title Override" value={form.mobileTitle} onChange={(e: any) => updateField('mobileTitle', e.target.value)} placeholder="Optional override title for mobile" />
                  <InputField label="Mobile Short Description" value={form.mobileShortDesc} onChange={(e: any) => updateField('mobileShortDesc', e.target.value)} type="textarea" placeholder="Short text shown in the active mobile card description area" />
                  <InputField label="Mobile Active Description" value={form.mobileActiveDesc} onChange={(e: any) => updateField('mobileActiveDesc', e.target.value)} type="textarea" placeholder="Longer description (fallback)" />

                  {/* Mobile Hero Image */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">📱 Mobile Hero Image</label>
                      <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-mono">Recommended: 600 × 800 px · PNG/WebP · transparent bg</span>
                    </div>
                    <div className="flex gap-3 items-center">
                      <input type="text" value={form.mobileHeroImage || ''} onChange={e => updateField('mobileHeroImage', e.target.value)}
                        placeholder="https://... or /images/..." className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a] transition-all" />
                      <button onClick={() => mobileImgRef.current?.click()} disabled={uploading === 'mobileHeroImage'}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-medium text-gray-600 transition-all flex-shrink-0">
                        <Upload size={13} /> {uploading === 'mobileHeroImage' ? 'Uploading...' : 'Upload'}
                      </button>
                      <input ref={mobileImgRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleUpload('mobileHeroImage', e.target.files[0])} />
                    </div>
                    {form.mobileHeroImage && (
                      <div className="mt-2 flex items-center gap-3">
                        <div className="relative w-16 h-20 rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                          <Image src={form.mobileHeroImage} alt="mobile preview" fill className="object-contain" sizes="64px" />
                        </div>
                        <button onClick={() => updateField('mobileHeroImage', '')} className="text-xs text-red-400 hover:text-red-600">Remove</button>
                      </div>
                    )}
                  </div>

                  {/* Desktop / Large Screen Banner Image */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">🖥️ Desktop Banner Image</label>
                      <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-mono">Recommended: 1200 × 600 px · JPG/WebP</span>
                    </div>
                    <div className="flex gap-3 items-center">
                      <input type="text" value={form.bannerImage || ''} onChange={e => updateField('bannerImage', e.target.value)}
                        placeholder="https://... or /images/..." className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a] transition-all" />
                      <button onClick={() => desktopBannerRef.current?.click()} disabled={uploading === 'bannerImage'}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-medium text-gray-600 transition-all flex-shrink-0">
                        <Upload size={13} /> {uploading === 'bannerImage' ? 'Uploading...' : 'Upload'}
                      </button>
                      <input ref={desktopBannerRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleUpload('bannerImage', e.target.files[0])} />
                    </div>
                    {form.bannerImage && (
                      <div className="mt-2 flex items-center gap-3">
                        <div className="relative w-32 h-16 rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                          <Image src={form.bannerImage} alt="desktop banner preview" fill className="object-cover" sizes="128px" />
                        </div>
                        <button onClick={() => updateField('bannerImage', '')} className="text-xs text-red-400 hover:text-red-600">Remove</button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'seo' && (
                <div className="space-y-4">
                  <InputField label="SEO Title" value={form.seoTitle} onChange={(e: any) => updateField('seoTitle', e.target.value)} placeholder="Category page meta title" />
                  <InputField label="SEO Description" value={form.seoDescription} onChange={(e: any) => updateField('seoDescription', e.target.value)} type="textarea" placeholder="Category page meta description" />
                  <InputField label="Low Stock Threshold" value={form.lowStockThreshold} onChange={(e: any) => updateField('lowStockThreshold', e.target.value)} type="number" placeholder="10" />
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setShowForm(false)} className="px-5 py-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl text-sm font-medium transition-all">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 text-white rounded-xl text-sm font-medium shadow-lg hover:opacity-90 transition-all disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #c81c6a, #9a0c52)' }}>
                <Save size={15} />
                {saving ? 'Saving...' : (editing ? 'Update Category' : 'Create Category')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

