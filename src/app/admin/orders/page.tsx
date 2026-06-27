"use client";
import { useState, useEffect } from "react";
import { ShoppingCart, Search, RefreshCw, Eye, X, ChevronDown } from "lucide-react";
import Image from "next/image";

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};
const paymentColors: Record<string, string> = {
  unpaid: 'bg-red-100 text-red-600',
  paid: 'bg-green-100 text-green-600',
  refunded: 'bg-gray-100 text-gray-600',
};

function Toast({ msg, type, onClose }: any) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return <div className={`fixed bottom-6 right-6 z-[9999] px-5 py-3 rounded-2xl text-white text-sm font-medium shadow-2xl ${type === 'success' ? 'bg-[#7fa23f]' : 'bg-red-500'}`}>{msg}</div>;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selected, setSelected] = useState<any>(null);
  const [toast, setToast] = useState<any>(null);
  const [updating, setUpdating] = useState(false);

  const showToast = (msg: string, type: string) => setToast({ msg, type });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      if (res.ok) setOrders(await res.json());
    } catch {}
    setLoading(false);
  };
  useEffect(() => { fetchOrders(); }, []);

  const updateOrder = async (id: string, status?: string, paymentStatus?: string) => {
    setUpdating(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, paymentStatus }),
      });
      if (res.ok) {
        showToast('Order updated!', 'success');
        fetchOrders();
        if (selected?._id === id) setSelected((s: any) => ({ ...s, status: status || s.status, paymentStatus: paymentStatus || s.paymentStatus }));
      } else showToast('Update failed', 'error');
    } catch { showToast('Error', 'error'); }
    setUpdating(false);
  };

  const filtered = orders.filter(o => {
    if (search && !o.orderId?.toLowerCase().includes(search.toLowerCase()) && !o.customer?.name?.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterStatus && o.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1400px]" style={{ fontFamily: 'AvantGarde, sans-serif' }}>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-[#1a1a1a]" style={{ fontFamily: 'DharmaGothic, sans-serif', letterSpacing: '0.05em' }}>ORDERS</h1>
          <p className="text-gray-400 text-sm mt-1">{filtered.length} orders</p>
        </div>
        <button onClick={fetchOrders} className="p-2.5 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 shadow-sm">
          <RefreshCw size={16} className={`text-gray-500 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
          <button key={s} onClick={() => setFilterStatus(filterStatus === s ? '' : s)}
            className={`p-3 rounded-2xl text-center transition-all border ${filterStatus === s ? 'border-[#c81c6a] bg-[#c81c6a]/5' : 'bg-white border-gray-100 hover:border-gray-200'} shadow-sm`}>
            <p className="text-xl font-black text-[#1a1a1a]" style={{ fontFamily: 'DharmaGothic, sans-serif' }}>
              {orders.filter(o => o.status === s).length}
            </p>
            <p className="text-xs text-gray-400 capitalize mt-0.5">{s}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-5 flex gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order ID or customer..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a] transition-all" />
        </div>
        {(search || filterStatus) && (
          <button onClick={() => { setSearch(''); setFilterStatus(''); }} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-xl text-sm transition-all">Clear</button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-14 bg-gray-50 rounded-xl animate-pulse" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-gray-400"><ShoppingCart size={32} className="mx-auto mb-3 opacity-30" /><p>No orders found</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 bg-gray-50/60 border-b border-gray-100">
                  <th className="text-left px-6 py-3 font-medium">Order ID</th>
                  <th className="text-left px-4 py-3 font-medium">Customer</th>
                  <th className="text-left px-4 py-3 font-medium">Items</th>
                  <th className="text-left px-4 py-3 font-medium">Total</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium">Payment</th>
                  <th className="text-left px-4 py-3 font-medium">Date</th>
                  <th className="text-right px-6 py-3 font-medium">View</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => (
                  <tr key={order._id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => setSelected(order)}>
                    <td className="px-6 py-3 font-mono text-xs text-[#c81c6a] font-bold">{order.orderId || order.orderNumber}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-[#1a1a1a]">{order.customer?.name}</p>
                      <p className="text-xs text-gray-400">{order.customer?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{order.items?.length || 0} item(s)</td>
                    <td className="px-4 py-3 font-bold text-[#1a1a1a]">₹{order.totalAmount?.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>{order.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${paymentColors[order.paymentStatus] || 'bg-gray-100 text-gray-600'}`}>{order.paymentStatus}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-3 text-right">
                      <button className="p-2 text-gray-400 hover:text-[#c81c6a] hover:bg-[#c81c6a]/5 rounded-xl transition-all"><Eye size={15} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <h2 className="font-black text-[#1a1a1a]" style={{ fontFamily: 'DharmaGothic, sans-serif', letterSpacing: '0.05em' }}>ORDER DETAIL</h2>
                <p className="text-xs text-[#c81c6a] font-mono font-bold mt-0.5">{selected.orderId}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl"><X size={18} /></button>
            </div>
            <div className="overflow-y-auto flex-1 p-6 space-y-5">
              {/* Customer */}
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Customer</p>
                <p className="font-semibold text-[#1a1a1a]">{selected.customer?.name}</p>
                <p className="text-sm text-gray-500">{selected.customer?.email}</p>
                {selected.customer?.phone && <p className="text-sm text-gray-500">{selected.customer.phone}</p>}
                {selected.customer?.address && <p className="text-sm text-gray-500">{selected.customer.address}</p>}
              </div>
              {/* Items */}
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Items</p>
                <div className="space-y-2">
                  {selected.items?.map((item: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-white flex-shrink-0">
                        {item.image && <Image src={item.image} alt={item.name} width={40} height={40} className="object-cover w-full h-full" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#1a1a1a]">{item.name}</p>
                        <p className="text-xs text-gray-400">{item.variant?.size} {item.variant?.unit} · Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-[#1a1a1a]">₹{(item.variant?.price || 0) * item.quantity}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-100 mt-3">
                  <p className="font-bold text-[#1a1a1a]">Total</p>
                  <p className="font-black text-[#c81c6a]">₹{selected.totalAmount?.toLocaleString()}</p>
                </div>
              </div>
              {/* Status Updates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Order Status</p>
                  <select value={selected.status || ''} onChange={e => updateOrder(selected._id, e.target.value, undefined)}
                    disabled={updating} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a] bg-white">
                    {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                  </select>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Payment Status</p>
                  <select value={selected.paymentStatus || ''} onChange={e => updateOrder(selected._id, undefined, e.target.value)}
                    disabled={updating} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a] bg-white">
                    {['unpaid', 'paid', 'refunded'].map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
