"use client";
import { useState, useEffect } from "react";
import { Settings, Save, RefreshCw, AlertTriangle } from "lucide-react";

const SETTINGS_SCHEMA = [
  {
    section: 'Brand',
    fields: [
      { key: 'global.brand_name', label: 'Brand Name', placeholder: 'Rafah Garden' },
      { key: 'global.brand_tagline', label: 'Tagline', placeholder: 'Premium Botanical Sanctuary' },
    ]
  },
  {
    section: 'Contact Information',
    fields: [
      { key: 'global.contact_email', label: 'Email', placeholder: 'hello@rafagarden.com' },
      { key: 'global.contact_phone', label: 'Phone', placeholder: '+971 00 000 0000' },
      { key: 'global.contact_address', label: 'Address', placeholder: 'Location, City' },
    ]
  },
  {
    section: 'WhatsApp & Ordering',
    fields: [
      { key: 'global.whatsapp_order_number', label: 'WhatsApp Number (digits only)', placeholder: '918550088485' },
      { key: 'global.whatsapp_message', label: 'Default WhatsApp Message', placeholder: "Hi! I'd like to place an order..." },
    ]
  },
  {
    section: 'Social Media',
    fields: [
      { key: 'global.social_instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/rafagarden' },
      { key: 'global.social_facebook', label: 'Facebook URL', placeholder: 'https://facebook.com/rafagarden' },
      { key: 'global.social_twitter', label: 'X / Twitter URL', placeholder: 'https://x.com/rafagarden' },
      { key: 'global.social_youtube', label: 'YouTube URL', placeholder: 'https://youtube.com/@rafagarden' },
      { key: 'global.social_whatsapp', label: 'WhatsApp Link', placeholder: 'https://wa.me/971000000000' },
    ]
  },
  {
    section: 'Footer',
    fields: [
      { key: 'footer.copyright', label: 'Copyright Text', placeholder: '© 2025 Rafah Garden. All rights reserved.' },
      { key: 'footer.about_text', label: 'Footer About Text', placeholder: 'Short about description for footer...' },
    ]
  },
];

function Toast({ msg, type, onClose }: any) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return <div className={`fixed bottom-6 right-6 z-[9999] px-5 py-3 rounded-2xl text-white text-sm font-medium shadow-2xl ${type === 'success' ? 'bg-[#7fa23f]' : 'bg-red-500'}`}>{msg}</div>;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [toast, setToast] = useState<any>(null);
  const showToast = (msg: string, type: string) => setToast({ msg, type });

  const loadSettings = () => {
    setLoading(true);
    setApiError(false);
    fetch('/api/settings')
      .then(r => {
        if (!r.ok) throw new Error('API error');
        return r.json();
      })
      .then(data => {
        setSettings(data || {});
        setLoading(false);
      })
      .catch(() => {
        setApiError(true);
        setLoading(false);
      });
  };

  useEffect(() => { loadSettings(); }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) showToast('Settings saved!', 'success');
      else showToast('Save failed', 'error');
    } catch { showToast('Error', 'error'); }
    setSaving(false);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[900px]" style={{ fontFamily: 'AvantGarde, sans-serif' }}>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-[#1a1a1a]" style={{ fontFamily: 'DharmaGothic, sans-serif', letterSpacing: '0.05em' }}>SETTINGS</h1>
          <p className="text-gray-400 text-sm mt-1">Global site configuration and contact details</p>
        </div>
        <button onClick={handleSave} disabled={saving || loading} className="flex items-center gap-2 px-6 py-2.5 text-white rounded-xl text-sm font-medium shadow-lg hover:opacity-90 transition-all disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #c81c6a, #9a0c52)' }}>
          <Save size={15} /> {saving ? 'Saving...' : 'Save All Settings'}
        </button>
      </div>

      {loading ? (
        <div className="space-y-6">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="bg-white rounded-2xl p-6 animate-pulse h-40 shadow-sm border border-gray-100" />)}</div>
      ) : apiError ? (
        <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-12 text-center">
          <AlertTriangle size={36} className="text-amber-400 mx-auto mb-4" />
          <h3 className="font-bold text-gray-600 mb-2">Could not load settings</h3>
          <p className="text-gray-400 text-sm mb-6">Make sure MongoDB is running and the dev server has loaded the latest <code className="bg-gray-100 px-1 rounded">.env.local</code>.</p>
          <button onClick={loadSettings} className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl text-sm font-medium mx-auto" style={{ background: 'linear-gradient(135deg, #c81c6a, #9a0c52)' }}>
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {SETTINGS_SCHEMA.map(section => (
            <div key={section.section} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-[#1a1a1a] mb-4 pb-3 border-b border-gray-100 flex items-center gap-2">
                <div className="w-1 h-5 rounded-full" style={{ background: 'linear-gradient(to bottom, #c81c6a, #9a0c52)' }} />
                {section.section}
              </h2>
              <div className="space-y-4">
                {section.fields.map(field => (
                  <div key={field.key}>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">{field.label}</label>
                    <input
                      type="text"
                      value={settings[field.key] || ''}
                      onChange={e => setSettings(s => ({ ...s, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a] focus:ring-2 focus:ring-[#c81c6a]/10 transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Database Maintenance Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-6">
            <h2 className="font-bold text-[#1a1a1a] mb-2 flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-500" />
              Database Maintenance & Reset
            </h2>
            <p className="text-gray-400 text-xs mb-4">
              Re-populate categories, live products, variants, highlights, FAQs, testimonials, and site content defaults into MongoDB.
            </p>
            <button
              onClick={async () => {
                if (!confirm("Are you sure you want to re-seed the database? This will populate all default products, categories, and content.")) return;
                try {
                  const res = await fetch('/api/seed?force=true');
                  if (res.ok) showToast('Database re-seeded successfully!', 'success');
                  else showToast('Re-seed failed', 'error');
                } catch {
                  showToast('Connection error during re-seed', 'error');
                }
              }}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
            >
              ⚡ Re-Seed Database & Populate Default Data
            </button>
          </div>

          <div className="flex justify-end">
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-8 py-3 text-white rounded-xl font-medium shadow-lg hover:opacity-90 transition-all disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #c81c6a, #9a0c52)' }}>
              <Save size={16} /> {saving ? 'Saving...' : 'Save All Settings'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
