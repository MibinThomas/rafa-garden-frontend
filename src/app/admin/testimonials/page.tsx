"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Edit2, Trash2, RefreshCw, X, Upload, Star, Check, Quote, User, MapPin, Tag } from "lucide-react";
import Image from "next/image";

interface TestimonialForm {
  _id?: string;
  author: string;
  role: string;
  quote: string;
  rating: number;
  image: string;
  location: string;
  productName: string;
  order: number;
  isPublished: boolean;
}

const EMPTY_FORM: TestimonialForm = {
  author: "",
  role: "",
  quote: "",
  rating: 5,
  image: "",
  location: "",
  productName: "",
  order: 0,
  isPublished: true,
};

function Toast({ msg, type, onClose }: any) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return <div className={`fixed bottom-6 right-6 z-[9999] px-5 py-3 rounded-2xl text-white text-sm font-medium shadow-2xl ${type === 'success' ? 'bg-[#7fa23f]' : 'bg-red-500'}`}>{msg}</div>;
}

function InputField({ label, value, onChange, placeholder, type = "text" }: any) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">{label}</label>
      {type === "textarea" ? (
        <textarea
          rows={4}
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a] transition-all resize-y"
        />
      ) : (
        <input
          type={type}
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a] transition-all"
        />
      )}
    </div>
  );
}

export default function TestimonialsAdminPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<TestimonialForm>({ ...EMPTY_FORM });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<any>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, type: string) => setToast({ msg, type });

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/testimonials");
      if (res.ok) setTestimonials(await res.json());
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchTestimonials(); }, []);

  const updateField = (field: string, value: any) => {
    setForm(f => ({ ...f, [field]: value }));
  };

  const openAdd = () => {
    setForm({ ...EMPTY_FORM, order: testimonials.length + 1 });
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (item: any) => {
    setForm({
      _id: item._id,
      author: item.author || "",
      role: item.role || "",
      quote: item.quote || "",
      rating: item.rating || 5,
      image: item.image || "",
      location: item.location || "",
      productName: item.productName || "",
      order: item.order || 0,
      isPublished: item.isPublished !== false,
    });
    setEditingId(item._id);
    setShowForm(true);
  };

  const handleUploadImage = async (file: File) => {
    setUploading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const filename = `testimonials/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      const res = await fetch(`/api/upload?filename=${encodeURIComponent(filename)}`, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: arrayBuffer
      });
      if (res.ok) {
        const data = await res.json();
        const url = data.url || data;
        updateField('image', url);
        showToast('Customer profile photo uploaded!', 'success');
      } else {
        showToast('Upload failed', 'error');
      }
    } catch {
      showToast('Error uploading image', 'error');
    }
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.author || !form.quote) {
      showToast('Customer Name and Quote are required', 'error');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        showToast(editingId ? 'Testimonial updated!' : 'Testimonial created!', 'success');
        setShowForm(false);
        fetchTestimonials();
      } else {
        const data = await res.json();
        showToast(data.error || 'Save failed', 'error');
      }
    } catch {
      showToast('Connection error', 'error');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string, author: string) => {
    if (!confirm(`Are you sure you want to delete testimonial from "${author}"?`)) return;
    try {
      const res = await fetch(`/api/testimonials?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Testimonial deleted', 'success');
        fetchTestimonials();
      } else {
        showToast('Delete failed', 'error');
      }
    } catch {
      showToast('Error deleting testimonial', 'error');
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1200px]" style={{ fontFamily: 'AvantGarde, sans-serif' }}>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-[#1a1a1a]" style={{ fontFamily: 'DharmaGothic, sans-serif', letterSpacing: '0.05em' }}>
            CUSTOMER TESTIMONIALS CMS
          </h1>
          <p className="text-gray-400 text-sm mt-1">Manage customer experiences, ratings, profile photos, and badges</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchTestimonials} className="p-2.5 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 shadow-sm">
            <RefreshCw size={16} className={`text-gray-500 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl text-sm font-medium shadow-lg hover:opacity-90 transition-all" style={{ background: 'linear-gradient(135deg, #c81c6a, #9a0c52)' }}>
            <Plus size={16} /> Add Testimonial
          </button>
        </div>
      </div>

      {/* Testimonials List Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="bg-white rounded-2xl h-48 animate-pulse shadow-sm border border-gray-100" />)}
        </div>
      ) : testimonials.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
          <Quote size={36} className="mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 font-medium">No testimonials found</p>
          <button onClick={openAdd} className="mt-4 px-6 py-2.5 text-white rounded-xl text-sm font-medium" style={{ background: 'linear-gradient(135deg, #c81c6a, #9a0c52)' }}>
            Add First Testimonial
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map(item => (
            <div key={item._id} className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-all relative ${!item.isPublished ? 'opacity-60' : ''}`}>
              <div>
                {/* Header Row: Stars & Badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: item.rating || 5 }).map((_, i) => (
                      <Star key={i} size={15} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.isPublished ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-gray-100 text-gray-500'}`}>
                    {item.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>

                {/* Quote */}
                <blockquote className="text-sm text-gray-600 italic leading-relaxed mb-4">
                  "{item.quote}"
                </blockquote>
              </div>

              {/* Author Footer */}
              <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {item.image ? (
                    <div className="w-10 h-10 rounded-xl overflow-hidden relative border border-gray-200">
                      <Image src={item.image} alt={item.author} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c81c6a] to-[#9a0c52] text-white font-bold flex items-center justify-center text-sm shadow-sm">
                      {item.author ? item.author.charAt(0) : "R"}
                    </div>
                  )}

                  <div>
                    <p className="font-bold text-[#1a1a1a] text-sm leading-tight">{item.author}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {[item.role, item.location].filter(Boolean).join(" • ") || "Verified Patron"}
                    </p>
                    {item.productName && (
                      <span className="inline-block text-[10px] font-semibold text-[#c81c6a] mt-0.5">
                        Purchase: {item.productName}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button onClick={() => openEdit(item)} className="p-2 text-gray-500 hover:text-[#c81c6a] hover:bg-[#c81c6a]/5 rounded-xl transition-all border border-gray-100">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(item._id, item.author)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 overflow-y-auto">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl my-auto overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-xl font-black text-[#1a1a1a]" style={{ fontFamily: 'DharmaGothic, sans-serif', letterSpacing: '0.05em' }}>
                {editingId ? 'EDIT TESTIMONIAL' : 'NEW TESTIMONIAL'}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl"><X size={20} /></button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              
              {/* Customer Profile Image Upload */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Customer Profile Photo</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 border border-gray-200 overflow-hidden relative flex-shrink-0 flex items-center justify-center">
                    {form.image ? (
                      <Image src={form.image} alt="Preview" fill className="object-cover" />
                    ) : (
                      <User size={24} className="text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={form.image}
                      onChange={e => updateField('image', e.target.value)}
                      placeholder="https://... or upload photo"
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a]"
                    />
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      disabled={uploading}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-semibold text-gray-700 transition-all flex items-center gap-1.5"
                    >
                      <Upload size={13} /> {uploading ? 'Uploading...' : 'Upload Profile Photo'}
                    </button>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleUploadImage(e.target.files[0])} />
                  </div>
                </div>
              </div>

              {/* Author & Role */}
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Customer Name *" value={form.author} onChange={(e: any) => updateField('author', e.target.value)} placeholder="e.g. Amina Al-Mansoori" />
                <InputField label="Role / Title" value={form.role} onChange={(e: any) => updateField('role', e.target.value)} placeholder="e.g. Botanical Enthusiast" />
              </div>

              {/* Location & Product Purchased */}
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Location / City" value={form.location} onChange={(e: any) => updateField('location', e.target.value)} placeholder="e.g. Dubai, UAE" />
                <InputField label="Verified Product Name" value={form.productName} onChange={(e: any) => updateField('productName', e.target.value)} placeholder="e.g. Dragon Fruit Jam 500g" />
              </div>

              {/* Rating & Order */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Star Rating</label>
                  <select
                    value={form.rating}
                    onChange={e => updateField('rating', parseInt(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a] bg-white font-medium"
                  >
                    <option value={5}>★★★★★ (5 Stars)</option>
                    <option value={4}>★★★★☆ (4 Stars)</option>
                    <option value={3}>★★★☆☆ (3 Stars)</option>
                  </select>
                </div>
                <InputField label="Display Order" type="number" value={form.order} onChange={(e: any) => updateField('order', parseInt(e.target.value))} placeholder="1" />
              </div>

              {/* Quote */}
              <InputField label="Testimonial Quote *" type="textarea" value={form.quote} onChange={(e: any) => updateField('quote', e.target.value)} placeholder="Write customer quote here..." />

              {/* Published Toggle */}
              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className={`w-10 h-5 rounded-full transition-colors relative ${form.isPublished ? 'bg-[#c81c6a]' : 'bg-gray-200'}`}
                    onClick={() => updateField('isPublished', !form.isPublished)}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${form.isPublished ? 'left-5' : 'left-0.5'}`} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Published on Homepage</span>
                </label>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setShowForm(false)} className="px-5 py-2.5 text-gray-500 hover:text-gray-700 rounded-xl text-sm font-medium">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 text-white rounded-xl text-sm font-medium shadow-lg hover:opacity-90 transition-all disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #c81c6a, #9a0c52)' }}>
                {saving ? 'Saving...' : 'Save Testimonial'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
