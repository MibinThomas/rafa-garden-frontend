"use client";
import { useState, useEffect } from "react";
import { Globe, Save, RefreshCw, AlertTriangle } from "lucide-react";

const PAGES = [
  { key: 'home', label: 'Home' },
  { key: 'shop', label: 'Shop' },
  { key: 'about', label: 'About' },
  { key: 'heritage', label: 'Heritage' },
  { key: 'contact', label: 'Contact' },
  { key: 'blog', label: 'Blog' },
];

const EMPTY_SEO = { metaTitle: '', metaDescription: '', keywords: '', ogImage: '' };

function Toast({ msg, type, onClose }: any) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return <div className={`fixed bottom-6 right-6 z-[9999] px-5 py-3 rounded-2xl text-white text-sm font-medium shadow-2xl ${type === 'success' ? 'bg-[#7fa23f]' : 'bg-red-500'}`}>{msg}</div>;
}

export default function SeoPage() {
  const [activeTab, setActiveTab] = useState('home');
  const [data, setData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [toast, setToast] = useState<any>(null);
  const showToast = (msg: string, type: string) => setToast({ msg, type });

  const fetchAll = async () => {
    setLoading(true);
    setApiError(false);
    try {
      const results = await Promise.all(
        PAGES.map(p => fetch(`/api/seo?page=${p.key}`).then(r => {
          if (!r.ok) throw new Error('API error');
          return r.json();
        }))
      );
      const map: Record<string, any> = {};
      PAGES.forEach((p, i) => { map[p.key] = results[i] || { ...EMPTY_SEO }; });
      setData(map);
    } catch {
      setApiError(true);
    }
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const current = data[activeTab] || { ...EMPTY_SEO };
  const setField = (field: string, value: string) => {
    setData(d => ({ ...d, [activeTab]: { ...current, [field]: value } }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: activeTab, ...current }),
      });
      if (res.ok) showToast('SEO settings saved!', 'success');
      else showToast('Save failed', 'error');
    } catch { showToast('Error', 'error'); }
    setSaving(false);
  };

  const charCountClass = (len: number, min: number, max: number) =>
    len === 0 ? 'text-gray-300' : len < min || len > max ? 'text-red-500' : 'text-green-500';

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[900px]" style={{ fontFamily: 'AvantGarde, sans-serif' }}>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-[#1a1a1a]" style={{ fontFamily: 'DharmaGothic, sans-serif', letterSpacing: '0.05em' }}>SEO SETTINGS</h1>
          <p className="text-gray-400 text-sm mt-1">Manage meta tags and SEO for each page</p>
        </div>
      </div>

      <div className="flex gap-1 bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100 mb-6 flex-wrap">
        {PAGES.map(p => (
          <button key={p.key} onClick={() => setActiveTab(p.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === p.key ? 'bg-[#c81c6a] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
            {p.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-12 bg-gray-50 rounded-xl animate-pulse" />)}
        </div>
      ) : apiError ? (
        <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-12 text-center">
          <AlertTriangle size={36} className="text-amber-400 mx-auto mb-4" />
          <h3 className="font-bold text-gray-600 mb-2">Could not load SEO settings</h3>
          <p className="text-gray-400 text-sm mb-6">Make sure MongoDB is running and <code className="bg-gray-100 px-1 rounded">.env.local</code> is loaded by the server.</p>
          <button onClick={fetchAll} className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl text-sm font-medium mx-auto" style={{ background: 'linear-gradient(135deg, #c81c6a, #9a0c52)' }}>
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Meta Title</label>
              <span className={`text-xs ${charCountClass(current.metaTitle?.length || 0, 30, 60)}`}>{current.metaTitle?.length || 0}/60</span>
            </div>
            <input type="text" value={current.metaTitle || ''} onChange={e => setField('metaTitle', e.target.value)}
              placeholder="Page title for search engines (30–60 chars)"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a] transition-all" />
            <p className="text-xs text-gray-400 mt-1.5">Shown in browser tabs and search results. Keep under 60 characters.</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Meta Description</label>
              <span className={`text-xs ${charCountClass(current.metaDescription?.length || 0, 100, 160)}`}>{current.metaDescription?.length || 0}/160</span>
            </div>
            <textarea rows={3} value={current.metaDescription || ''} onChange={e => setField('metaDescription', e.target.value)}
              placeholder="Description for search results (100–160 chars)"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a] transition-all resize-none" />
            <p className="text-xs text-gray-400 mt-1.5">Shown in search result snippets. Keep between 100–160 characters.</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Keywords</label>
            <input type="text" value={current.keywords || ''} onChange={e => setField('keywords', e.target.value)}
              placeholder="dragon fruit, organic pitaya, botanical refreshment (comma separated)"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a] transition-all" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">OG Image URL (Social Share Image)</label>
              <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-mono">1200 × 630 px · JPG/WebP</span>
            </div>
            <input type="text" value={current.ogImage || ''} onChange={e => setField('ogImage', e.target.value)}
              placeholder="/images/og/home-1200x630.jpg"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a] transition-all" />
            <p className="text-xs text-gray-400 mt-1.5">Recommended size: 1200×630px. Used when shared on social media.</p>
          </div>

          {/* Preview */}
          {current.metaTitle && (
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Search Preview</p>
              <div className="max-w-[500px]">
                <p className="text-blue-600 text-base font-medium truncate">{current.metaTitle}</p>
                <p className="text-green-700 text-xs mt-0.5">rafagarden.com › {activeTab === 'home' ? '' : activeTab}</p>
                <p className="text-gray-600 text-sm mt-1 leading-relaxed">{current.metaDescription}</p>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 text-white rounded-xl text-sm font-medium shadow-lg hover:opacity-90 transition-all disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #c81c6a, #9a0c52)' }}>
              <Save size={15} /> {saving ? 'Saving...' : `Save ${PAGES.find(p => p.key === activeTab)?.label} SEO`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
