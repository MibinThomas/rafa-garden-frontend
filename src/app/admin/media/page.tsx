"use client";
import { useState, useEffect, useRef } from "react";
import { Image as ImageIcon, Upload, Copy, Trash2, RefreshCw, X, Check } from "lucide-react";
import Image from "next/image";

function Toast({ msg, type, onClose }: any) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return <div className={`fixed bottom-6 right-6 z-[9999] px-5 py-3 rounded-2xl text-white text-sm font-medium shadow-2xl ${type === 'success' ? 'bg-[#7fa23f]' : 'bg-red-500'}`}>{msg}</div>;
}

const FEATURED_PATHS = [
  '/images/hero/', '/images/products/', '/uploads/categories/', '/uploads/products/',
];

export default function MediaPage() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<any>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const showToast = (msg: string, type: string) => setToast({ msg, type });

  // Fetch uploaded images from the server
  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/media');
      if (res.ok) setImages(await res.json());
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchImages(); }, []);

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'uploads/media');
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: fd });
        if (res.ok) {
          const data = await res.json();
          setImages(prev => [data.url, ...prev]);
          showToast('Uploaded!', 'success');
        }
      } catch {}
    }
    setUploading(false);
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleUpload(e.dataTransfer.files);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1400px]" style={{ fontFamily: 'AvantGarde, sans-serif' }}>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-[#1a1a1a]" style={{ fontFamily: 'DharmaGothic, sans-serif', letterSpacing: '0.05em' }}>MEDIA LIBRARY</h1>
          <p className="text-gray-400 text-sm mt-1">{images.length} files</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchImages} className="p-2.5 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 shadow-sm">
            <RefreshCw size={16} className={`text-gray-500 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={() => fileRef.current?.click()} disabled={uploading}
            className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl text-sm font-medium shadow-lg hover:opacity-90 transition-all disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #c81c6a, #9a0c52)' }}>
            <Upload size={16} /> {uploading ? 'Uploading...' : 'Upload Images'}
          </button>
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={e => handleUpload(e.target.files)} />
        </div>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`w-full h-32 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all mb-6 ${dragOver ? 'border-[#c81c6a] bg-[#c81c6a]/5' : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'}`}
      >
        <Upload size={24} className={`mb-2 ${dragOver ? 'text-[#c81c6a]' : 'text-gray-400'}`} />
        <p className={`text-sm ${dragOver ? 'text-[#c81c6a]' : 'text-gray-400'}`}>
          {dragOver ? 'Drop to upload' : 'Drag & drop images here, or click to browse'}
        </p>
        <p className="text-xs text-gray-300 mt-1">JPG · PNG · WebP · GIF · Max 10 MB per file</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3">
          {Array.from({ length: 12 }).map((_, i) => <div key={i} className="aspect-square rounded-2xl bg-gray-100 animate-pulse" />)}
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <ImageIcon size={36} className="mx-auto mb-3 opacity-30" />
          <p>No media uploaded yet</p>
          <p className="text-sm mt-1">Upload your first image above</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3">
          {images.map((url, i) => (
            <div key={i} className={`group relative aspect-square rounded-2xl overflow-hidden bg-[#f1f1f2] border-2 cursor-pointer transition-all ${selected === url ? 'border-[#c81c6a]' : 'border-transparent hover:border-gray-200'}`}
              onClick={() => setSelected(selected === url ? null : url)}>
              <Image src={url} alt={`media-${i}`} fill className="object-cover" sizes="200px" />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button onClick={e => { e.stopPropagation(); copyUrl(url); }}
                  className="w-8 h-8 bg-white rounded-xl flex items-center justify-center hover:bg-[#c81c6a] hover:text-white transition-all shadow-lg">
                  {copied === url ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
              {selected === url && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-[#c81c6a] rounded-full flex items-center justify-center">
                  <Check size={11} className="text-white" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Selected image panel */}
      {selected && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1a1a1a] text-white rounded-2xl px-5 py-3 shadow-2xl flex items-center gap-4 z-40 max-w-[90vw]">
          <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
            <Image src={selected} alt="selected" width={40} height={40} className="object-cover w-full h-full" />
          </div>
          <p className="text-sm truncate max-w-[200px] text-white/80">{selected}</p>
          <button onClick={() => copyUrl(selected)} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-medium transition-all flex-shrink-0">
            {copied === selected ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy URL</>}
          </button>
          <button onClick={() => setSelected(null)} className="p-1.5 text-white/50 hover:text-white transition-colors flex-shrink-0">
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
