"use client";
import { useState, useEffect, useRef } from "react";
import { BookOpen, Plus, Edit2, Trash2, RefreshCw, X, Save, Upload, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

const EMPTY_POST = {
  id: '', slug: '', title: '', subtitle: '', excerpt: '', content: '',
  image: '', date: new Date().toISOString().split('T')[0],
  readingTime: '5 min read', category: '', accentColor: '#c81c6a', isPublished: true,
};

function Toast({ msg, type, onClose }: any) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return <div className={`fixed bottom-6 right-6 z-[9999] px-5 py-3 rounded-2xl text-white text-sm font-medium shadow-2xl ${type === 'success' ? 'bg-[#7fa23f]' : 'bg-red-500'}`}>{msg}</div>;
}

function InputField({ label, value, onChange, type = 'text', placeholder = '' }: any) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">{label}</label>
      {type === 'textarea' ? (
        <textarea rows={3} value={value || ''} onChange={onChange} placeholder={placeholder}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a] transition-all resize-none" />
      ) : (
        <input type={type} value={value || ''} onChange={onChange} placeholder={placeholder}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a] transition-all" />
      )}
    </div>
  );
}

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<any>({ ...EMPTY_POST });
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const showToast = (msg: string, type: string) => setToast({ msg, type });



  const updateField = (field: string, value: any) => {
    setForm((f: any) => ({ ...f, [field]: value }));
  };


  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/blog');
      if (res.ok) setPosts(await res.json());
    } catch {}
    setLoading(false);
  };
  useEffect(() => { fetchPosts(); }, []);

  const openAdd = () => {
    setForm({ ...EMPTY_POST });
    setEditing(null);
    setShowForm(true);
  };
  const openEdit = (post: any) => {
    setForm({ ...EMPTY_POST, ...post });
    setEditing(post._id);
    setShowForm(true);
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const filename = `blog/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      const res = await fetch(`/api/upload?filename=${encodeURIComponent(filename)}`, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: arrayBuffer
      });
      if (res.ok) {
        const data = await res.json();
        const url = data.url || data;
        setForm((f: any) => ({ ...f, image: url }));
        showToast('Uploaded!', 'success');
      }
    } catch {}
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.title || !form.excerpt || !form.content) {
      showToast('Title, excerpt, and content are required', 'error'); return;
    }
    if (!form.id) form.id = `blog-${Date.now()}`;
    if (!form.slug) form.slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    setSaving(true);
    try {
      const url = editing ? `/api/blog/${editing}` : '/api/blog';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (res.ok) {
        showToast(editing ? 'Post updated!' : 'Post created!', 'success');
        setShowForm(false);
        fetchPosts();
      } else {
        const d = await res.json();
        showToast(d.error || 'Save failed', 'error');
      }
    } catch { showToast('Error', 'error'); }
    setSaving(false);
  };

  const handleDelete = async (post: any) => {
    if (!confirm(`Delete "${post.title}"?`)) return;
    try {
      const res = await fetch(`/api/blog/${post._id}`, { method: 'DELETE' });
      if (res.ok) { showToast('Post deleted', 'success'); fetchPosts(); }
    } catch {}
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1200px]" style={{ fontFamily: 'AvantGarde, sans-serif' }}>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-[#1a1a1a]" style={{ fontFamily: 'DharmaGothic, sans-serif', letterSpacing: '0.05em' }}>BLOG</h1>
          <p className="text-gray-400 text-sm mt-1">{posts.length} posts</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchPosts} className="p-2.5 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 shadow-sm">
            <RefreshCw size={16} className={`text-gray-500 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl text-sm font-medium shadow-lg hover:opacity-90 transition-all" style={{ background: 'linear-gradient(135deg, #c81c6a, #9a0c52)' }}>
            <Plus size={16} /> Add Post
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="bg-white rounded-2xl h-64 animate-pulse shadow-sm border border-gray-100" />)}
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
          <BookOpen size={32} className="mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 font-medium">No blog posts yet</p>
          <button onClick={openAdd} className="mt-4 px-6 py-2.5 text-white rounded-xl text-sm font-medium" style={{ background: 'linear-gradient(135deg, #c81c6a, #9a0c52)' }}>Write First Post</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {posts.map(post => (
            <div key={post._id} className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all ${!post.isPublished ? 'opacity-60' : ''}`}>
              {post.image && (
                <div className="relative h-40 bg-[#f1f1f2]">
                  <Image src={post.image} alt={post.title} fill className="object-cover" sizes="400px" />
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium rounded-full text-gray-600">{post.category}</span>
                  </div>
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="w-1 h-10 rounded-full flex-shrink-0 mr-3" style={{ backgroundColor: post.accentColor || '#c81c6a' }} />
                  <div className="flex-1">
                    <h3 className="font-bold text-[#1a1a1a] leading-tight line-clamp-2">{post.title}</h3>
                    <p className="text-xs text-gray-400 mt-1">{post.date} · {post.readingTime}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2 mt-2">{post.excerpt}</p>
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-50">
                  <button onClick={() => openEdit(post)} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-gray-600 hover:text-[#c81c6a] hover:bg-[#c81c6a]/5 rounded-xl text-xs font-medium transition-all border border-gray-100 hover:border-[#c81c6a]/20">
                    <Edit2 size={12} /> Edit
                  </button>
                  <button onClick={() => handleDelete(post)} className="py-2 px-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100">
                    <Trash2 size={13} />
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
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-xl font-black text-[#1a1a1a]" style={{ fontFamily: 'DharmaGothic, sans-serif', letterSpacing: '0.05em' }}>
                {editing ? 'EDIT POST' : 'NEW POST'}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
              <InputField label="Title *" value={form.title} onChange={(e: any) => updateField('title', e.target.value)} placeholder="Post title" />
              <InputField label="Slug" value={form.slug} onChange={(e: any) => updateField('slug', e.target.value)} placeholder="auto-generated-from-title" />
              <InputField label="Category" value={form.category} onChange={(e: any) => updateField('category', e.target.value)} placeholder="e.g. Sustainability" />
              <InputField label="Excerpt *" value={form.excerpt} onChange={(e: any) => updateField('excerpt', e.target.value)} type="textarea" placeholder="Short description for the blog list..." />
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Content *</label>
                <textarea rows={8} value={form.content || ''} onChange={e => updateField('content', e.target.value)} placeholder="Full blog post content..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a] transition-all resize-y" />
              </div>
              {/* Image */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Cover Image</label>
                  <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-mono">1200 × 630 px · JPG/WebP</span>
                </div>
                <div className="flex gap-2">
                  <input type="text" value={form.image || ''} onChange={e => updateField('image', e.target.value)} placeholder="/images/blog/post.jpg"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a] transition-all" />
                  <button onClick={() => fileRef.current?.click()} disabled={uploading} className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-medium text-gray-600 transition-all flex-shrink-0">
                    <Upload size={13} />
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0])} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Date" value={form.date} onChange={(e: any) => updateField('date', e.target.value)} type="date" />
                <InputField label="Reading Time" value={form.readingTime} onChange={(e: any) => updateField('readingTime', e.target.value)} placeholder="5 min read" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setShowForm(false)} className="px-5 py-2.5 text-gray-500 hover:text-gray-700 rounded-xl text-sm">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 text-white rounded-xl text-sm font-medium shadow-lg hover:opacity-90 transition-all disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #c81c6a, #9a0c52)' }}>
                {saving ? 'Saving...' : 'Save Post'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



