"use client";
import { useState, useEffect } from "react";
import { MessageSquare, Search, RefreshCw, Eye, X, ChevronDown, Send } from "lucide-react";

const statusColors: Record<string, string> = {
  new: 'bg-[#c81c6a]/10 text-[#c81c6a]',
  contacted: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  ignored: 'bg-gray-100 text-gray-500',
};

function Toast({ msg, type, onClose }: any) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return <div className={`fixed bottom-6 right-6 z-[9999] px-5 py-3 rounded-2xl text-white text-sm font-medium shadow-2xl ${type === 'success' ? 'bg-[#7fa23f]' : 'bg-red-500'}`}>{msg}</div>;
}

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selected, setSelected] = useState<any>(null);
  const [note, setNote] = useState('');
  const [toast, setToast] = useState<any>(null);

  const showToast = (msg: string, type: string) => setToast({ msg, type });

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/enquiries');
      if (res.ok) setEnquiries(await res.json());
    } catch {}
    setLoading(false);
  };
  useEffect(() => { fetchEnquiries(); }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/enquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        showToast('Status updated!', 'success');
        fetchEnquiries();
        if (selected?._id === id) setSelected((s: any) => ({ ...s, status }));
      }
    } catch { showToast('Error', 'error'); }
  };

  const addNote = async () => {
    if (!note.trim() || !selected) return;
    try {
      const newNotes = [...(selected.notes || []), { text: note.trim(), createdAt: new Date() }];
      const res = await fetch('/api/enquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selected._id, notes: newNotes }),
      });
      if (res.ok) {
        setSelected((s: any) => ({ ...s, notes: newNotes }));
        setNote('');
        showToast('Note added!', 'success');
      }
    } catch { showToast('Error', 'error'); }
  };

  const filtered = enquiries.filter(e => {
    if (search && !e.name?.toLowerCase().includes(search.toLowerCase()) && !e.email?.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterStatus && e.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1400px]" style={{ fontFamily: 'AvantGarde, sans-serif' }}>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-[#1a1a1a]" style={{ fontFamily: 'DharmaGothic, sans-serif', letterSpacing: '0.05em' }}>ENQUIRIES</h1>
          <p className="text-gray-400 text-sm mt-1">{enquiries.filter(e => e.status === 'new').length} new enquiries</p>
        </div>
        <button onClick={fetchEnquiries} className="p-2.5 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 shadow-sm">
          <RefreshCw size={16} className={`text-gray-500 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Status filter pills */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {['', 'new', 'contacted', 'completed', 'ignored'].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-all border ${filterStatus === s ? 'bg-[#c81c6a] text-white border-[#c81c6a]' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>
            {s || 'All'} {s && `(${enquiries.filter(e => e.status === s).length})`}
          </button>
        ))}
        <div className="relative ml-auto">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
            className="pl-9 pr-4 py-1.5 rounded-full border border-gray-200 text-xs focus:outline-none focus:border-[#c81c6a] transition-all" />
        </div>
      </div>

      {/* Enquiries List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 bg-gray-50 rounded-xl animate-pulse" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-gray-400"><MessageSquare size={32} className="mx-auto mb-3 opacity-30" /><p>No enquiries found</p></div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map(enq => (
              <div key={enq._id} className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => setSelected(enq)}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold" style={{ background: 'linear-gradient(135deg, #c81c6a, #9a0c52)' }}>
                  {enq.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-semibold text-[#1a1a1a] truncate">{enq.name}</p>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize flex-shrink-0 ${statusColors[enq.status] || 'bg-gray-100'}`}>{enq.status}</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-1">{enq.email}</p>
                  <p className="text-sm text-gray-500 truncate">{enq.message}</p>
                </div>
                <p className="text-xs text-gray-400 flex-shrink-0">{new Date(enq.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Enquiry Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="font-black text-[#1a1a1a]" style={{ fontFamily: 'DharmaGothic, sans-serif', letterSpacing: '0.05em' }}>ENQUIRY DETAIL</h2>
              <button onClick={() => setSelected(null)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl"><X size={18} /></button>
            </div>
            <div className="overflow-y-auto flex-1 p-6 space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold" style={{ background: 'linear-gradient(135deg, #c81c6a, #9a0c52)' }}>
                  {selected.name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-[#1a1a1a]">{selected.name}</p>
                  <p className="text-sm text-gray-500">{selected.email}</p>
                  {selected.phone && <p className="text-sm text-gray-500">{selected.phone}</p>}
                </div>
              </div>
              {selected.subject && <div><p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Subject</p><p className="text-sm font-medium text-[#1a1a1a]">{selected.subject}</p></div>}
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Message</p>
                <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-4 leading-relaxed">{selected.message}</p>
              </div>
              {/* Status Update */}
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Update Status</p>
                <div className="flex gap-2 flex-wrap">
                  {['new', 'contacted', 'completed', 'ignored'].map(s => (
                    <button key={s} onClick={() => updateStatus(selected._id, s)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-all border ${selected.status === s ? 'bg-[#c81c6a] text-white border-[#c81c6a]' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              {/* Notes */}
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Internal Notes</p>
                <div className="space-y-2 mb-3">
                  {selected.notes?.length ? selected.notes.map((n: any, i: number) => (
                    <div key={i} className="bg-amber-50 rounded-xl p-3 text-sm text-gray-700">{n.text}<p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p></div>
                  )) : <p className="text-xs text-gray-400">No notes yet</p>}
                </div>
                <div className="flex gap-2">
                  <input value={note} onChange={e => setNote(e.target.value)} placeholder="Add a note..." onKeyDown={e => e.key === 'Enter' && addNote()}
                    className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a] transition-all" />
                  <button onClick={addNote} className="p-2 text-white rounded-xl transition-all" style={{ background: 'linear-gradient(135deg, #c81c6a, #9a0c52)' }}><Send size={15} /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
