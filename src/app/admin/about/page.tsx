"use client";

import { useState, useEffect, useRef } from "react";
import { Save, Upload, RefreshCw, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

// ── Types ──────────────────────────────────────────────────────────────────
type ContentMap = Record<string, string>;
type TabKey = "hero" | "composition" | "products" | "farming";

// ── Default values (match fallbacks in about/page.tsx) ─────────────────────
const DEFAULTS: ContentMap = {
  "about.hero_subtitle": "About us.",
  "about.hero_title": "Rafah Garden.",
  "about.hero_logo": "/images/logo/Rafah logo.webp",
  "about.hero_description":
    "Rafah Garden believes that true health and happiness begin with nature's sweetness.",
  "about.design_background": "/images/about/Dragon fruit line curved.webp",
  "about.section_1_5_label_jam": "Dragon\nFruit Jam",
  "about.section_1_5_label_plant": "Dragon\nFruit Plant",
  "about.section_1_5_label_crush": "Dragon\nFruit Crush",
  "about.section_1_5_label_fruit": "Dragon\nFruit Fruit",
  "about.floating_pitaya_1": "/images/hero/floatingpitaya.png",
  "about.floating_pitaya_2": "/images/hero/floatingpitaya.png",
  "about.floating_pitaya_3": "/images/hero/floatingpitaya.png",
  "about.floating_pitaya_4": "/images/hero/floatingpitaya.png",
  "about.center_composition": "/images/about/Dragon fruit png.webp",
  "about.products_heading_1": "Dragon Fruit.",
  "about.products_heading_2": "Products",
  "about.products_description":
    "What began as a small family initiative has blossomed into a thriving agricultural enterprise.",
  "about.narrative_paragraph": "Rafah Garden is more than just a farm.",
  "about.products_full_image": "/images/about/All Products.webp",
  "about.grid_item_1_label": "Dragon Fruit Crush",
  "about.grid_item_1_image": "/images/hero/crush_bottle.png",
  "about.grid_item_2_label": "Dragon Fruit Jam",
  "about.grid_item_2_image": "/images/hero/jam_premium.png",
  "about.grid_item_3_label": "Dragon Fruit Fruit",
  "about.grid_item_3_image": "/images/about/Dragon fruit png.webp",
  "about.grid_item_4_label": "Dragon Fruit Plant",
  "about.grid_item_4_image": "/products/Plant 1 copy-4CPH7kam37YnVhsUfK3pinxwUeZr1O.webp",
  "about.farm_small_1": "/images/about/farm_small_1.png",
  "about.farm_small_2": "/images/about/farm_small_2.png",
  "about.farm_small_3": "/images/about/farm_small_3.png",
  "about.farm_panoramic": "/images/about/farm_panoramic.png",
  "about.watermark_own": "Own",
  "about.farm_split_image": "/images/about/farm_rows.png",
  "about.watermark_farming_split": "Farming",
  "about.watermark_farming_vertical": "Farming",
  "about.technique_heading": "Nature's\nSweetness",
  "about.technique_plant": "/products/Plant 1 copy-4CPH7kam37YnVhsUfK3pinxwUeZr1O.webp",
  "about.technique_subheading": "Natural\nFarming\nTechniques",
};

// ── Toast ──────────────────────────────────────────────────────────────────
function Toast({ msg, type, onClose }: { msg: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed bottom-6 right-6 z-[9999] px-5 py-3 rounded-2xl text-white text-sm font-medium shadow-2xl flex items-center gap-3 ${type === "success" ? "bg-[#7fa23f]" : "bg-red-500"}`}>
      {msg}
      <button onClick={onClose} className="opacity-70 hover:opacity-100"><X size={14} /></button>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function AboutCmsPage() {
  const [content, setContent] = useState<ContentMap>({ ...DEFAULTS });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("hero");
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  const showToast = (msg: string, type: "success" | "error") => setToast({ msg, type });

  // ── Fetch ────────────────────────────────────────────────────────────────
  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/content?group=about");
      if (res.ok) {
        const data: { key: string; value: string }[] = await res.json();
        const map: ContentMap = { ...DEFAULTS };
        data.forEach((item) => { map[item.key] = item.value; });
        setContent(map);
      }
    } catch { showToast("Failed to load content", "error"); }
    setLoading(false);
  };

  useEffect(() => { fetchContent(); }, []);

  // ── Save ─────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = Object.entries(content).map(([key, value]) => ({
        key,
        value,
        group: "about",
        type: key.includes("image") || key.includes("logo") || key.includes("pitaya") ||
              key.includes("background") || key.includes("composition") || key.includes("panoramic") ||
              key.includes("plant") || key.includes("split_image") || key.includes("full_image") ||
              key.includes("farm_small") ? "image" : "text",
        label: key.replace("about.", "").replace(/_/g, " "),
      }));
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) showToast("About Us page saved!", "success");
      else showToast("Save failed", "error");
    } catch { showToast("Save error", "error"); }
    setSaving(false);
  };

  // ── Upload ───────────────────────────────────────────────────────────────
  const handleUpload = async (key: string, file: File) => {
    setUploading(key);
    try {
      const filename = `about/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const res = await fetch(`/api/upload?filename=${encodeURIComponent(filename)}`, {
        method: "POST",
        body: file,
      });
      if (res.ok) {
        const data = await res.json();
        setContent((c) => ({ ...c, [key]: data.url }));
        showToast("Image uploaded!", "success");
      } else showToast("Upload failed", "error");
    } catch { showToast("Upload error", "error"); }
    setUploading(null);
  };

  const set = (key: string, val: string) => setContent((c) => ({ ...c, [key]: val }));
  const get = (key: string) => content[key] ?? DEFAULTS[key] ?? "";

  // ── Field Components ─────────────────────────────────────────────────────
  const TextField = ({ label, contentKey, placeholder }: { label: string; contentKey: string; placeholder?: string }) => (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">{label}</label>
      <input
        type="text"
        value={get(contentKey)}
        onChange={(e) => set(contentKey, e.target.value)}
        placeholder={placeholder || DEFAULTS[contentKey]}
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a] focus:ring-2 focus:ring-[#c81c6a]/10 transition-all"
      />
    </div>
  );

  const TextareaField = ({ label, contentKey, rows = 3 }: { label: string; contentKey: string; rows?: number }) => (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">{label}</label>
      <textarea
        rows={rows}
        value={get(contentKey)}
        onChange={(e) => set(contentKey, e.target.value)}
        placeholder={DEFAULTS[contentKey]}
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a] focus:ring-2 focus:ring-[#c81c6a]/10 transition-all resize-none"
      />
      <p className="text-[10px] text-gray-400 mt-1">Use \n for line breaks shown on the front end</p>
    </div>
  );

  const ImageField = ({ label, contentKey, hint }: { label: string; contentKey: string; hint?: string }) => (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</label>
        {hint && <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-mono">{hint}</span>}
      </div>
      <div className="flex gap-2 items-center">
        <input
          type="text"
          value={get(contentKey)}
          onChange={(e) => set(contentKey, e.target.value)}
          placeholder={DEFAULTS[contentKey] || "https://..."}
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a] transition-all"
        />
        <button
          onClick={() => fileInputs.current[contentKey]?.click()}
          disabled={uploading === contentKey}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-medium text-gray-600 transition-all flex-shrink-0"
        >
          <Upload size={13} />
          {uploading === contentKey ? "Uploading..." : "Upload"}
        </button>
        <input
          ref={(el) => { fileInputs.current[contentKey] = el; }}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleUpload(contentKey, e.target.files[0])}
        />
      </div>
      {get(contentKey) && (
        <div className="mt-2 relative w-24 h-20 rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
          <Image src={get(contentKey)} alt={label} fill className="object-contain" sizes="96px" />
        </div>
      )}
    </div>
  );

  const SectionDivider = ({ title }: { title: string }) => (
    <div className="flex items-center gap-3 mt-2">
      <div className="h-px flex-1 bg-gray-100" />
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{title}</span>
      <div className="h-px flex-1 bg-gray-100" />
    </div>
  );

  // ── Tabs config ──────────────────────────────────────────────────────────
  const tabs: { key: TabKey; label: string; emoji: string }[] = [
    { key: "hero", label: "Hero", emoji: "🌿" },
    { key: "composition", label: "Composition", emoji: "🍇" },
    { key: "products", label: "Products", emoji: "🛍️" },
    { key: "farming", label: "Farming", emoji: "🌱" },
  ];

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-[400px]">
      <div className="w-8 h-8 border-2 border-gray-200 border-t-[#c81c6a] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[900px]" style={{ fontFamily: "AvantGarde, sans-serif" }}>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-[#1a1a1a]" style={{ fontFamily: "DharmaGothic, sans-serif", letterSpacing: "0.05em" }}>
            ABOUT US CMS
          </h1>
          <p className="text-gray-400 text-sm mt-1">Edit all content on the About Us page</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchContent} className="p-2.5 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-all shadow-sm">
            <RefreshCw size={16} className="text-gray-500" />
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 text-white rounded-xl text-sm font-medium shadow-lg hover:opacity-90 transition-all disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #c81c6a, #9a0c52)" }}
          >
            <Save size={15} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === tab.key ? "bg-[#c81c6a] text-white shadow-sm" : "text-gray-500 hover:bg-gray-50"}`}
          >
            <span>{tab.emoji}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── HERO TAB ── */}
      {activeTab === "hero" && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-5">
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl text-sm text-blue-700 border border-blue-100">
            <ImageIcon size={16} />
            Top section of the About Us page with the large title, logo, and description.
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <TextField label="Subtitle (above title)" contentKey="about.hero_subtitle" />
            <TextField label="Main Title" contentKey="about.hero_title" />
          </div>
          <TextareaField label="Description Paragraph" contentKey="about.hero_description" rows={4} />
          <ImageField label="Logo Image" contentKey="about.hero_logo" hint="Recommended: 216 × 72px · WebP/PNG" />
        </div>
      )}

      {/* ── COMPOSITION TAB ── */}
      {activeTab === "composition" && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-5">
          <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-2xl text-sm text-purple-700 border border-purple-100">
            <ImageIcon size={16} />
            The floating dragon fruit composition section with labels and animated pitayas.
          </div>

          <SectionDivider title="Side Labels" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextareaField label="Jam Label (left top)" contentKey="about.section_1_5_label_jam" rows={2} />
            <TextareaField label="Plant Label (left bottom)" contentKey="about.section_1_5_label_plant" rows={2} />
            <TextareaField label="Crush Label (right top)" contentKey="about.section_1_5_label_crush" rows={2} />
            <TextareaField label="Fruit Label (right bottom)" contentKey="about.section_1_5_label_fruit" rows={2} />
          </div>

          <SectionDivider title="Center Image" />
          <ImageField label="Main Center Composition Image" contentKey="about.center_composition" hint="Dragon fruit PNG with transparent bg" />
          <ImageField label="Background Curved Design" contentKey="about.design_background" hint="SVG/WebP line art" />

          <SectionDivider title="Floating Pitayas" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <ImageField key={i} label={`Floating Pitaya ${i}`} contentKey={`about.floating_pitaya_${i}`} hint="Small PNG · transparent bg" />
            ))}
          </div>
        </div>
      )}

      {/* ── PRODUCTS TAB ── */}
      {activeTab === "products" && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-5">
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl text-sm text-green-700 border border-green-100">
            <ImageIcon size={16} />
            The "Dragon Fruit Products" showcase section and the 2×2 product grid below it.
          </div>

          <SectionDivider title="Products Showcase Heading" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField label="Heading Line 1" contentKey="about.products_heading_1" />
            <TextField label="Heading Line 2" contentKey="about.products_heading_2" />
          </div>
          <TextareaField label="Description Paragraph" contentKey="about.products_description" rows={3} />
          <TextareaField label="Narrative Paragraph" contentKey="about.narrative_paragraph" rows={3} />
          <ImageField label="All Products Full Image" contentKey="about.products_full_image" hint="1200px wide · transparent bg" />

          <SectionDivider title="Product Grid Items" />
          {[
            { n: 1, label: "Dragon Fruit Crush", imgHint: "Bottle PNG · transparent bg" },
            { n: 2, label: "Dragon Fruit Jam",   imgHint: "Jar PNG · transparent bg" },
            { n: 3, label: "Dragon Fruit Fruit", imgHint: "Fruit PNG · transparent bg" },
            { n: 4, label: "Dragon Fruit Plant", imgHint: "Plant PNG · transparent bg" },
          ].map(({ n, label, imgHint }) => (
            <div key={n} className="p-4 bg-gray-50 rounded-2xl space-y-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Grid Item {n}</p>
              <TextField label="Label Text" contentKey={`about.grid_item_${n}_label`} placeholder={label} />
              <ImageField label="Product Image" contentKey={`about.grid_item_${n}_image`} hint={imgHint} />
            </div>
          ))}
        </div>
      )}

      {/* ── FARMING TAB ── */}
      {activeTab === "farming" && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-5">
          <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-2xl text-sm text-amber-700 border border-amber-100">
            <ImageIcon size={16} />
            The "Own Farming" section with photos, watermark text, and the Nature's Sweetness panel.
          </div>

          <SectionDivider title="Farm Photos" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ImageField label="Farm Photo 1 (small)" contentKey="about.farm_small_1" hint="4:3 · JPG/WebP" />
            <ImageField label="Farm Photo 2 (small)" contentKey="about.farm_small_2" hint="4:3 · JPG/WebP" />
            <ImageField label="Farm Photo 3 (small)" contentKey="about.farm_small_3" hint="4:3 · JPG/WebP" />
          </div>
          <ImageField label="Panoramic Farm View (large)" contentKey="about.farm_panoramic" hint="16:8 · wide panoramic" />
          <ImageField label="Farm Rows Split Image" contentKey="about.farm_split_image" hint="3:2 · JPG/WebP" />

          <SectionDivider title="Watermark Text" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <TextField label='"Own" Watermark' contentKey="about.watermark_own" />
            <TextField label='"Farming" (below Own)' contentKey="about.watermark_farming_split" />
            <TextField label='"Farming" (vertical)' contentKey="about.watermark_farming_vertical" />
          </div>

          <SectionDivider title="Nature's Sweetness Panel" />
          <TextareaField label="Technique Heading" contentKey="about.technique_heading" rows={2} />
          <TextareaField label="Technique Subheading" contentKey="about.technique_subheading" rows={3} />
          <ImageField label="Plant Image" contentKey="about.technique_plant" hint="Tall PNG · transparent bg" />
        </div>
      )}

      {/* Bottom Save */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-3 text-white rounded-xl text-sm font-medium shadow-lg hover:opacity-90 transition-all disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #c81c6a, #9a0c52)" }}
        >
          <Save size={15} />
          {saving ? "Saving..." : "Save All Changes"}
        </button>
      </div>
    </div>
  );
}
