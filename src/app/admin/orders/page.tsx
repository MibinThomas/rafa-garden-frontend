"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, Search, RefreshCw, Eye, X, Save, Trash2, Check, User, MapPin, Phone, Mail, Truck, FileText } from "lucide-react";
import Image from "next/image";

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  processing: 'bg-blue-100 text-blue-700 border-blue-200',
  shipped: 'bg-purple-100 text-purple-700 border-purple-200',
  delivered: 'bg-green-100 text-green-700 border-green-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
};

const paymentColors: Record<string, string> = {
  unpaid: 'bg-red-100 text-red-600 border-red-200',
  paid: 'bg-green-100 text-green-600 border-green-200',
  refunded: 'bg-gray-100 text-gray-600 border-gray-200',
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
  const [editForm, setEditForm] = useState<any>(null);
  const [toast, setToast] = useState<any>(null);
  const [saving, setSaving] = useState(false);

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

  const handleSelectOrder = (order: any) => {
    setSelected(order);
    setEditForm({
      id: order._id,
      status: order.status || 'pending',
      paymentStatus: order.paymentStatus || 'unpaid',
      trackingNumber: order.trackingNumber || '',
      notes: order.notes || '',
      customerName: order.customer?.name || '',
      customerEmail: order.customer?.email || '',
      customerPhone: order.customer?.phone || '',
      customerAddress: order.customer?.address || '',
    });
  };

  const handleSaveOrder = async () => {
    if (!editForm || !selected) return;
    setSaving(true);
    try {
      const payload = {
        id: selected._id,
        status: editForm.status,
        paymentStatus: editForm.paymentStatus,
        trackingNumber: editForm.trackingNumber,
        notes: editForm.notes,
        customer: {
          name: editForm.customerName,
          email: editForm.customerEmail,
          phone: editForm.customerPhone,
          address: editForm.customerAddress,
        }
      };

      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const updatedOrder = await res.json();
        showToast('Order details updated successfully!', 'success');
        setOrders(prev => prev.map(o => o._id === selected._id ? updatedOrder : o));
        setSelected(updatedOrder);
      } else {
        const data = await res.json();
        showToast(data.error || 'Failed to update order', 'error');
      }
    } catch {
      showToast('Error updating order', 'error');
    }
    setSaving(false);
  };

  const handleQuickStatusChange = async (orderId: string, field: 'status' | 'paymentStatus', value: string, e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, [field]: value }),
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders(prev => prev.map(o => o._id === orderId ? updated : o));
        if (selected?._id === orderId) {
          setSelected(updated);
          setEditForm((f: any) => ({ ...f, [field]: value }));
        }
        showToast(`Order ${field === 'status' ? 'status' : 'payment'} updated!`, 'success');
      }
    } catch {
      showToast('Status update failed', 'error');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to delete this order? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/orders?id=${orderId}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Order deleted', 'success');
        setOrders(prev => prev.filter(o => o._id !== orderId));
        if (selected?._id === orderId) setSelected(null);
      }
    } catch {
      showToast('Failed to delete order', 'error');
    }
  };

  const filtered = orders.filter(o => {
    if (search && !o.orderId?.toLowerCase().includes(search.toLowerCase()) && !o.customer?.name?.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterStatus && o.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1400px]" style={{ fontFamily: 'AvantGarde, sans-serif' }}>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-[#1a1a1a]" style={{ fontFamily: 'DharmaGothic, sans-serif', letterSpacing: '0.05em' }}>ORDERS MANAGEMENT</h1>
          <p className="text-gray-400 text-sm mt-1">{filtered.length} total orders found</p>
        </div>
        <button onClick={fetchOrders} className="p-2.5 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 shadow-sm transition-all">
          <RefreshCw size={16} className={`text-gray-500 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Status Summary Filters */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
          <button key={s} onClick={() => setFilterStatus(filterStatus === s ? '' : s)}
            className={`p-3 rounded-2xl text-center transition-all border ${filterStatus === s ? 'border-[#c81c6a] bg-[#c81c6a]/5 shadow-sm' : 'bg-white border-gray-100 hover:border-gray-200'} shadow-sm`}>
            <p className="text-xl font-black text-[#1a1a1a]" style={{ fontFamily: 'DharmaGothic, sans-serif' }}>
              {orders.filter(o => o.status === s).length}
            </p>
            <p className="text-xs text-gray-400 capitalize mt-0.5">{s}</p>
          </button>
        ))}
      </div>

      {/* Search Filter Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-5 flex gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order ID or customer name..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a] transition-all" />
        </div>
        {(search || filterStatus) && (
          <button onClick={() => { setSearch(''); setFilterStatus(''); }} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-xl text-sm transition-all">Clear</button>
        )}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-14 bg-gray-50 rounded-xl animate-pulse" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-gray-400">
            <ShoppingCart size={32} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No orders found matching criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 bg-gray-50/60 border-b border-gray-100 uppercase tracking-wide">
                  <th className="text-left px-6 py-3.5 font-semibold">Order ID</th>
                  <th className="text-left px-4 py-3.5 font-semibold">Customer</th>
                  <th className="text-left px-4 py-3.5 font-semibold">Items</th>
                  <th className="text-left px-4 py-3.5 font-semibold">Total Amount</th>
                  <th className="text-left px-4 py-3.5 font-semibold">Order Status</th>
                  <th className="text-left px-4 py-3.5 font-semibold">Payment</th>
                  <th className="text-left px-4 py-3.5 font-semibold">Date</th>
                  <th className="text-right px-6 py-3.5 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => (
                  <tr key={order._id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => handleSelectOrder(order)}>
                    <td className="px-6 py-4 font-mono text-xs text-[#c81c6a] font-bold">
                      {order.orderId || order.orderNumber}
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-[#1a1a1a]">{order.customer?.name || "Anonymous Customer"}</p>
                      <p className="text-xs text-gray-400">{order.customer?.email}</p>
                    </td>
                    <td className="px-4 py-4 text-gray-500 font-medium">{order.items?.length || 0} item(s)</td>
                    <td className="px-4 py-4 font-black text-[#1a1a1a]">₹{order.totalAmount?.toLocaleString()}</td>
                    <td className="px-4 py-4" onClick={e => e.stopPropagation()}>
                      <select
                        value={order.status || 'pending'}
                        onChange={e => handleQuickStatusChange(order._id, 'status', e.target.value, e)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border cursor-pointer capitalize focus:outline-none ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}
                      >
                        {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                          <option key={s} value={s} className="bg-white text-gray-800 capitalize">{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-4" onClick={e => e.stopPropagation()}>
                      <select
                        value={order.paymentStatus || 'unpaid'}
                        onChange={e => handleQuickStatusChange(order._id, 'paymentStatus', e.target.value, e)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border cursor-pointer capitalize focus:outline-none ${paymentColors[order.paymentStatus] || 'bg-gray-100 text-gray-600'}`}
                      >
                        {['unpaid', 'paid', 'refunded'].map(s => (
                          <option key={s} value={s} className="bg-white text-gray-800 capitalize">{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-4 text-gray-400 text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleSelectOrder(order)} className="p-2 text-gray-400 hover:text-[#c81c6a] hover:bg-[#c81c6a]/5 rounded-xl transition-all" title="View & Edit Order Details">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => handleDeleteOrder(order._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="Delete Order">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail & Edit Modal */}
      {selected && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col my-auto overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-black text-[#1a1a1a]" style={{ fontFamily: 'DharmaGothic, sans-serif', letterSpacing: '0.05em' }}>ORDER DETAILS & STATUS</h2>
                <p className="text-xs text-[#c81c6a] font-mono font-bold mt-0.5">{selected.orderId || selected.orderNumber}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl"><X size={18} /></button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto flex-1 p-6 space-y-6">
              
              {/* Order Status & Payment Status Controls */}
              <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100 space-y-3">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                  <Truck size={14} className="text-[#c81c6a]" /> Order & Payment Status
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Order Status</label>
                    <select
                      value={editForm.status}
                      onChange={e => setEditForm((f: any) => ({ ...f, status: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a] bg-white font-medium capitalize"
                    >
                      {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Payment Status</label>
                    <select
                      value={editForm.paymentStatus}
                      onChange={e => setEditForm((f: any) => ({ ...f, paymentStatus: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a] bg-white font-medium capitalize"
                    >
                      {['unpaid', 'paid', 'refunded'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Customer Information Edit Section */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                  <User size={14} className="text-[#c81c6a]" /> Customer Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={editForm.customerName}
                      onChange={e => setEditForm((f: any) => ({ ...f, customerName: e.target.value }))}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={editForm.customerEmail}
                      onChange={e => setEditForm((f: any) => ({ ...f, customerEmail: e.target.value }))}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={editForm.customerPhone}
                      onChange={e => setEditForm((f: any) => ({ ...f, customerPhone: e.target.value }))}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Tracking Number / AWB</label>
                    <input
                      type="text"
                      placeholder="e.g. AWB-98765432"
                      value={editForm.trackingNumber}
                      onChange={e => setEditForm((f: any) => ({ ...f, trackingNumber: e.target.value }))}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Shipping Address</label>
                  <textarea
                    rows={2}
                    value={editForm.customerAddress}
                    onChange={e => setEditForm((f: any) => ({ ...f, customerAddress: e.target.value }))}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a] resize-y"
                  />
                </div>
              </div>

              {/* Order Items List */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Ordered Items</h3>
                <div className="space-y-2">
                  {selected.items?.map((item: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50/80 rounded-xl border border-gray-100">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-white flex-shrink-0 relative border border-gray-100">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-[10px]">No Img</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-[#1a1a1a]">{item.name}</p>
                        <p className="text-xs text-gray-400">{item.variant?.size} {item.variant?.unit} · Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-[#1a1a1a]">₹{((item.variant?.price || item.price || 0) * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-100">
                  <span className="font-bold text-[#1a1a1a]">Total Order Settlement</span>
                  <span className="font-black text-lg text-[#c81c6a]">₹{selected.totalAmount?.toLocaleString()}</span>
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                  <FileText size={14} className="text-[#c81c6a]" /> Admin Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Add internal notes about this order..."
                  value={editForm.notes}
                  onChange={e => setEditForm((f: any) => ({ ...f, notes: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a]"
                />
              </div>

            </div>

            {/* Modal Footer Controls */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
              <button
                onClick={() => handleDeleteOrder(selected._id)}
                className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Trash2 size={14} /> Delete Order
              </button>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelected(null)}
                  className="px-5 py-2.5 text-gray-500 hover:bg-gray-100 rounded-xl text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveOrder}
                  disabled={saving}
                  className="px-6 py-2.5 text-white rounded-xl text-xs font-bold shadow-lg hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #c81c6a, #9a0c52)' }}
                >
                  <Save size={14} /> {saving ? 'Saving Changes...' : 'Save Order Changes'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
