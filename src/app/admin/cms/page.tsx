"use client";
import { useState, useEffect, useRef } from "react";
import { Layers, Save, RefreshCw, Plus, Trash2, Eye, EyeOff, GripVertical, ChevronDown, ChevronUp, Upload, X, ImageIcon } from "lucide-react";

function Toast({ msg, type, onClose }: any) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return <div className={`fixed bottom-6 right-6 z-[9999] px-5 py-3 rounded-2xl text-white text-sm font-medium shadow-2xl ${type === 'success' ? 'bg-[#7fa23f]' : 'bg-red-500'}`}>{msg}</div>;
}

function TrustBadgeRow({ feature: f, idx, onUpdate }: { feature: any; idx: number; onUpdate: (field: string, val: any) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [iconMode, setIconMode] = useState<'emoji' | 'image'>(f.iconUrl ? 'image' : 'emoji');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await fetch(`/api/upload?filename=trust-badge-${idx}-${file.name}`, {
        method: 'POST',
        body: file,
      });
      if (!res.ok) throw new Error('Upload failed');
      const blob = await res.json();
      onUpdate('iconUrl', blob.url);
      onUpdate('icon', '');
      setIconMode('image');
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const clearImage = () => {
    onUpdate('iconUrl', '');
    setIconMode('emoji');
  };

  return (
    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
      <div className="grid grid-cols-[180px_1fr_1fr] gap-4 items-start">
        {/* Icon column */}
        <div>
          <label className="text-xs text-gray-400 uppercase tracking-wide mb-2 block">Icon</label>
          {/* Mode toggle */}
          <div className="flex rounded-lg border border-gray-200 overflow-hidden mb-3 bg-white">
            <button
              type="button"
              onClick={() => setIconMode('emoji')}
              className={`flex-1 py-1.5 text-xs font-medium transition-all ${iconMode === 'emoji' ? 'bg-[#c81c6a] text-white' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              Emoji
            </button>
            <button
              type="button"
              onClick={() => setIconMode('image')}
              className={`flex-1 py-1.5 text-xs font-medium transition-all ${iconMode === 'image' ? 'bg-[#c81c6a] text-white' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              Image
            </button>
          </div>

          {iconMode === 'emoji' ? (
            <input
              type="text"
              value={f.icon || ''}
              onChange={e => onUpdate('icon', e.target.value)}
              placeholder="e.g. 🚚"
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a] transition-all text-center text-xl"
            />
          ) : (
            <div className="space-y-2">
              {/* Preview */}
              <div className="w-full h-16 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center bg-white relative overflow-hidden">
                {f.iconUrl ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={f.iconUrl} alt="badge icon" className="max-h-12 max-w-full object-contain" />
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all"
                    >
                      <X size={10} />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-1 text-gray-400">
                    <ImageIcon size={18} />
                    <span className="text-[10px]">No image</span>
                  </div>
                )}
              </div>
              {/* Upload button */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.svg"
                className="hidden"
                onChange={handleFileUpload}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-600 hover:border-[#c81c6a] hover:text-[#c81c6a] transition-all bg-white disabled:opacity-60"
              >
                {uploading ? (
                  <><div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" /> Uploading...</>
                ) : (
                  <><Upload size={12} /> Upload Icon</>
                )}
              </button>
              <p className="text-[10px] text-gray-400 text-center leading-tight">
                Recommended: <span className="font-medium text-gray-500">64×64 px</span> or larger<br />
                PNG / SVG / WebP &nbsp;·&nbsp; Square format
              </p>
            </div>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="text-xs text-gray-400 uppercase tracking-wide mb-1 block">Title</label>
          <input
            type="text"
            value={f.title || ''}
            onChange={e => onUpdate('title', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a] transition-all"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-xs text-gray-400 uppercase tracking-wide mb-1 block">Description</label>
          <input
            type="text"
            value={f.desc || ''}
            onChange={e => onUpdate('desc', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a] transition-all"
          />
        </div>
      </div>
    </div>
  );
}

export default function CmsPage() {
  const [config, setConfig] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<any>(null);
  const [activeSection, setActiveSection] = useState<'hero'|'series'|'features'|'content'>('hero');
  const showToast = (msg: string, type: string) => setToast({ msg, type });

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [homepageRes, catRes, prodRes] = await Promise.all([
          fetch('/api/homepage'),
          fetch('/api/categories'),
          fetch('/api/products'),
        ]);
        if (homepageRes.ok) setConfig(await homepageRes.json());
        if (catRes.ok) setCategories(await catRes.json());
        if (prodRes.ok) setProducts(await prodRes.json());
      } catch {}
      setLoading(false);
    };
    fetchAll();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/homepage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (res.ok) showToast('Homepage config saved!', 'success');
      else showToast('Save failed', 'error');
    } catch { showToast('Error saving', 'error'); }
    setSaving(false);
  };

  const updateCat = (idx: number, field: string, val: any) => {
    const cats = [...(config?.categories || [])];
    cats[idx] = { ...cats[idx], [field]: val };
    setConfig((c: any) => ({ ...c, categories: cats }));
  };

  const updateSer = (idx: number, field: string, val: any) => {
    const sers = [...(config?.series || [])];
    sers[idx] = { ...sers[idx], [field]: val };
    setConfig((c: any) => ({ ...c, series: sers }));
  };

  const addSeries = () => {
    const newSer = { categoryId: '', heading: '', badgeText: '', cardsPerScreen: 3, showArrows: true, enabled: true, productIds: [] };
    setConfig((c: any) => ({ ...c, series: [...(c?.series || []), newSer] }));
  };

  const removeSeries = (idx: number) => {
    setConfig((c: any) => ({ ...c, series: c.series.filter((_: any, i: number) => i !== idx) }));
  };

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-[400px]">
      <div className="w-8 h-8 border-2 border-gray-200 border-t-[#c81c6a] rounded-full animate-spin" />
    </div>
  );

  const sections = [
    { key: 'hero', label: 'Hero Categories' },
    { key: 'series', label: 'Product Series' },
    { key: 'features', label: 'Trust Badges' },
    { key: 'content', label: 'Global Content' },
  ] as const;

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1100px]" style={{ fontFamily: 'AvantGarde, sans-serif' }}>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-[#1a1a1a]" style={{ fontFamily: 'DharmaGothic, sans-serif', letterSpacing: '0.05em' }}>HOMEPAGE CMS</h1>
          <p className="text-gray-400 text-sm mt-1">Edit homepage sections and content</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 text-white rounded-xl text-sm font-medium shadow-lg hover:opacity-90 transition-all disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #c81c6a, #9a0c52)' }}>
          <Save size={15} /> {saving ? 'Saving...' : 'Save Homepage'}
        </button>
      </div>

      {/* Section tabs */}
      <div className="flex gap-1 bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100 mb-6">
        {sections.map(s => (
          <button key={s.key} onClick={() => setActiveSection(s.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeSection === s.key ? 'bg-[#c81c6a] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Hero Categories */}
      {activeSection === 'hero' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-sm text-blue-700">
            These are the categories shown in the hero section. Toggle, reorder, and configure each one.
          </div>
          {(config?.categories || []).map((cat: any, idx: number) => (
            <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-3 h-12 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color || '#c81c6a' }} />
                <div className="flex-1">
                  <h3 className="font-bold text-[#1a1a1a]">{cat.title}</h3>
                  <p className="text-xs text-gray-400">{cat.id}</p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <div className={`w-10 h-5 rounded-full transition-colors relative ${cat.enabled !== false ? 'bg-[#c81c6a]' : 'bg-gray-200'}`}
                    onClick={() => updateCat(idx, 'enabled', !(cat.enabled !== false))}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${cat.enabled !== false ? 'left-5' : 'left-0.5'}`} />
                  </div>
                  <span className="text-sm text-gray-500">{cat.enabled !== false ? 'Visible' : 'Hidden'}</span>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wide mb-1 block">Display Order</label>
                  <input type="number" value={cat.order || idx} onChange={e => updateCat(idx, 'order', parseInt(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a] transition-all" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wide mb-1 block">Color Override</label>
                  <div className="flex gap-2">
                    <input type="color" value={cat.color || '#c81c6a'} onChange={e => updateCat(idx, 'color', e.target.value)} className="w-10 h-10 rounded-xl border border-gray-200 cursor-pointer" />
                    <input type="text" value={cat.color || ''} onChange={e => updateCat(idx, 'color', e.target.value)} className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a] transition-all" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Series */}
      {activeSection === 'series' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={addSeries} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-600 hover:border-[#c81c6a] hover:text-[#c81c6a] rounded-xl text-sm font-medium transition-all shadow-sm">
              <Plus size={14} /> Add Series Section
            </button>
          </div>
          {(config?.series || []).length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
              <p className="text-gray-400 text-sm">No product series configured. Add one to show curated product sections on the homepage.</p>
            </div>
          )}
          {(config?.series || []).map((ser: any, idx: number) => {
            const serCat = categories.find((c: any) => c.id === ser.categoryId || c._id?.toString() === ser.categoryId);
            const catProducts = serCat ? (products.filter(p => p.category === serCat.title)) : [];
            return (
              <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-[#1a1a1a]">Series {idx + 1}{ser.heading ? `: ${ser.heading}` : ''}</h3>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <div className={`w-10 h-5 rounded-full transition-colors relative ${ser.enabled !== false ? 'bg-[#c81c6a]' : 'bg-gray-200'}`}
                        onClick={() => updateSer(idx, 'enabled', !(ser.enabled !== false))}>
                        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${ser.enabled !== false ? 'left-5' : 'left-0.5'}`} />
                      </div>
                    </label>
                    <button onClick={() => removeSeries(idx)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={14} /></button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="text-xs text-gray-400 uppercase tracking-wide mb-1 block">Category</label>
                    <select value={ser.categoryId || ''} onChange={e => updateSer(idx, 'categoryId', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a] bg-white transition-all">
                      <option value="">Select category...</option>
                      {categories.map((c: any) => <option key={c._id} value={c._id?.toString() || c.id}>{c.title}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wide mb-1 block">Section Heading</label>
                    <input type="text" value={ser.heading || ''} onChange={e => updateSer(idx, 'heading', e.target.value)} placeholder="e.g. THE CRUSH COLLECTION"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a] transition-all" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wide mb-1 block">Badge Text</label>
                    <input type="text" value={ser.badgeText || ''} onChange={e => updateSer(idx, 'badgeText', e.target.value)} placeholder="e.g. CURATED SERIES"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a] transition-all" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wide mb-1 block">Cards Per Screen</label>
                    <select value={ser.cardsPerScreen || 3} onChange={e => updateSer(idx, 'cardsPerScreen', parseInt(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a] bg-white transition-all">
                      <option value={2}>2 cards</option>
                      <option value={3}>3 cards</option>
                      <option value={4}>4 cards</option>
                    </select>
                  </div>
                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <div className={`w-10 h-5 rounded-full transition-colors relative ${ser.showArrows !== false ? 'bg-[#c81c6a]' : 'bg-gray-200'}`}
                        onClick={() => updateSer(idx, 'showArrows', !(ser.showArrows !== false))}>
                        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${ser.showArrows !== false ? 'left-5' : 'left-0.5'}`} />
                      </div>
                      <span className="text-sm text-gray-600">Show arrows</span>
                    </label>
                  </div>
                  {catProducts.length > 0 && (
                    <div className="col-span-2">
                      <label className="text-xs text-gray-400 uppercase tracking-wide mb-2 block">Select Products to Show</label>
                      <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1">
                        {catProducts.map((p: any) => {
                          const pid = p._id?.toString() || p.id;
                          const selected = ser.productIds?.includes(pid);
                          return (
                            <label key={pid} className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer border transition-all text-sm ${selected ? 'border-[#c81c6a] bg-[#c81c6a]/5' : 'border-gray-100 hover:border-gray-200'}`}>
                              <input type="checkbox" checked={selected} onChange={e => {
                                const ids = ser.productIds || [];
                                updateSer(idx, 'productIds', e.target.checked ? [...ids, pid] : ids.filter((id: string) => id !== pid));
                              }} className="accent-[#c81c6a]" />
                              <span className="truncate">{p.name}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Trust Features */}
      {activeSection === 'features' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-gray-500 mb-4">Edit trust badge features shown below the hero section. Changes are saved as site content.</p>
          <div className="space-y-4">
            {(config?.features || []).map((f: any, idx: number) => (
              <TrustBadgeRow
                key={idx}
                feature={f}
                idx={idx}
                onUpdate={(field: string, val: any) => {
                  const feats = [...(config?.features || [])];
                  feats[idx] = { ...f, [field]: val };
                  setConfig((c: any) => ({ ...c, features: feats }));
                }}
              />
            ))}
            {(!config?.features || config.features.length === 0) && (
              <p className="text-gray-400 text-sm text-center py-4">No features configured yet</p>
            )}
          </div>
        </div>
      )}

      {/* Global Content */}
      {activeSection === 'content' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wide mb-1.5 block">Title Case Format</label>
            <label className="flex items-center gap-3 cursor-pointer">
              <div className={`w-10 h-5 rounded-full transition-colors relative ${config?.settings?.titleCaseFormat ? 'bg-[#c81c6a]' : 'bg-gray-200'}`}
                onClick={() => setConfig((c: any) => ({ ...c, settings: { ...(c?.settings || {}), titleCaseFormat: !c?.settings?.titleCaseFormat } }))}>
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${config?.settings?.titleCaseFormat ? 'left-5' : 'left-0.5'}`} />
              </div>
              <span className="text-sm text-gray-600">Auto-convert headings to Title Case</span>
            </label>
          </div>
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wide mb-1.5 block">Section Spacing</label>
            <select value={config?.settings?.sectionSpacing || 'normal'} onChange={e => setConfig((c: any) => ({ ...c, settings: { ...(c?.settings || {}), sectionSpacing: e.target.value } }))}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a] bg-white transition-all">
              <option value="compact">Compact</option>
              <option value="normal">Normal</option>
              <option value="spacious">Spacious</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
