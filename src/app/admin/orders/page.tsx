"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, 
  Search, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Package, 
  Download,
  Filter,
  Eye,
  User,
  CreditCard,
  MapPin,
  X,
  Loader2,
  Plus,
  MessageCircle
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Order {
  _id: string;
  orderId: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: any[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  paymentMethod: string;
  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [creatingSample, setCreatingSample] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (Array.isArray(data)) setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const createSampleOrder = async () => {
    setCreatingSample(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sample: true })
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error("Failed to create sample order:", error);
    } finally {
      setCreatingSample(false);
    }
  };

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o._id === id ? { ...o, status: status as any } : o));
        if (selectedOrder?._id === id) {
          setSelectedOrder(prev => prev ? { ...prev, status: status as any } : null);
        }
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      const res = await fetch(`/api/orders?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setOrders(prev => prev.filter(o => o._id !== id));
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleResetLedger = async () => {
    if (!confirm("CRITICAL ACTION: This will permanently delete ALL order manifests. This cannot be undone. Proceed?")) return;
    try {
      const res = await fetch("/api/orders", { method: "DELETE" });
      if (res.ok) {
        setOrders([]);
        setSelectedOrder(null);
        alert("The Sanctuary Ledger has been reset.");
      }
    } catch (error) {
      console.error("Reset failed:", error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = (order: Order) => {
    const itemsList = order.items.map(item => 
      `- ${item.name} (${item.variant.size} ${item.variant.unit}) x ${item.quantity}: ₹${item.variant.price * item.quantity}`
    ).join('\n');

    const message = `🌿 *Rafah Garden - Order Manifest* 🌿\n\n` +
      `*Order ID:* ${order.orderId}\n` +
      `*Date:* ${new Date(order.createdAt).toLocaleDateString()}\n\n` +
      `*Customer Details:*\n` +
      `- Name: ${order.customer.name}\n` +
      `- Phone: ${order.customer.phone}\n` +
      `- Address: ${order.customer.address}\n\n` +
      `*Asset Manifest:*\n${itemsList}\n\n` +
      `*Total Settlement:* ₹${order.totalAmount}\n\n` +
      `_Sent via Rafah Garden Sanctuary Office_`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/918550088485?text=${encodedMessage}`, '_blank');
  };

  const filteredOrders = orders.filter(o => 
    (o.orderId?.toLowerCase() || "").includes(searchQuery.toLowerCase()) || 
    (o.customer?.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (o.customer?.email?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  const statusColors = {
    pending: "bg-amber-50 text-amber-600 border-amber-100",
    processing: "bg-blue-50 text-blue-600 border-blue-100",
    shipped: "bg-indigo-50 text-indigo-600 border-indigo-100",
    delivered: "bg-emerald-50 text-emerald-600 border-emerald-100",
    cancelled: "bg-red-50 text-red-600 border-red-100",
  };

  return (
    <div className="space-y-12 pb-24 relative">
      {/* Background Watermark */}
      <div className="absolute top-0 right-0 pointer-events-none opacity-[0.03] select-none -mt-10 -mr-20">
         <h1 className="text-[250px] font-black tracking-tighter leading-none text-[#0b2b1a]">EXCHANGE</h1>
      </div>

      {/* Header */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#c81c6a] font-black text-[10px] uppercase tracking-[0.5em] mb-4 ml-1"
          >
            Transaction Sanctuary
          </motion.p>
          <h1 className="text-6xl md:text-7xl font-black font-playfair text-[#0b2b1a] tracking-tighter">Orders</h1>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button 
            onClick={createSampleOrder}
            disabled={creatingSample}
            className="flex items-center gap-4 bg-white/80 backdrop-blur-md px-10 py-5 rounded-[2.5rem] border border-white font-black text-xs uppercase tracking-[0.2em] text-[#0b2b1a] shadow-2xl shadow-black/[0.02] hover:bg-[#0b2b1a] hover:text-white transition-all duration-500 disabled:opacity-50"
          >
            {creatingSample ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
            Generate Sample Order
          </button>
          
          <div 
            onClick={handleResetLedger}
            className="flex items-center gap-3 bg-red-50 text-red-600 px-8 py-5 rounded-[2.5rem] border border-red-100 hover:bg-red-100 transition-all cursor-pointer"
          >
            <Trash2 size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">Reset Ledger</span>
          </div>

          <div className="flex items-center gap-3 bg-[#0b2b1a] text-white px-8 py-5 rounded-[2.5rem] shadow-2xl shadow-[#0b2b1a]/20">
            <Download size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">Export Ledger</span>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6">
        <div className="relative flex-1 group w-full bg-white/50 backdrop-blur-md rounded-[2.5rem] border border-white shadow-xl shadow-black/[0.02]">
          <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#c81c6a] transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search transactions, names, or registry IDs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-20 pr-10 py-6 bg-transparent outline-none font-bold text-[#0b2b1a] text-sm placeholder:text-gray-300"
          />
        </div>
        
        <div className="flex items-center gap-4 bg-white/40 backdrop-blur-md p-2 rounded-[2rem] border border-white shadow-xl">
           <div className="px-6 py-4 flex items-center gap-3">
              <Filter size={16} className="text-[#c81c6a]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#0b2b1a]">Filter Stage</span>
           </div>
        </div>
      </div>

      {/* Orders Grid/Table */}
      <div className="relative z-10 bg-white/60 backdrop-blur-xl rounded-[4rem] border border-white shadow-2xl shadow-black/[0.03] overflow-hidden">
        {loading ? (
          <div className="py-48 flex flex-col items-center justify-center gap-8">
             <div className="relative w-20 h-20">
                <div className="absolute inset-0 border-4 border-gray-100 rounded-full" />
                <div className="absolute inset-0 border-4 border-[#c81c6a] border-t-transparent rounded-full animate-spin" />
             </div>
             <p className="text-[12px] font-black uppercase tracking-[0.4em] text-gray-300 animate-pulse">Analyzing Ledger Archive...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-48 flex flex-col items-center justify-center text-center px-10">
            <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center mb-10 shadow-xl border border-gray-50">
               <ShoppingBag className="text-gray-100" size={48} />
            </div>
            <h3 className="text-3xl font-black font-playfair text-[#0b2b1a] mb-3 tracking-tight">Vault Empty</h3>
            <p className="text-gray-400 text-[11px] font-bold uppercase tracking-[0.4em] max-w-xs leading-relaxed">No transactions have been recorded in this editorial cycle.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
               <thead>
                 <tr className="border-b border-gray-100/50">
                   <th className="text-left py-12 px-12 text-[10px] font-black text-[#5d5f61] uppercase tracking-widest">Transaction ID</th>
                   <th className="text-left py-12 px-10 text-[10px] font-black text-[#5d5f61] uppercase tracking-widest">Customer Profile</th>
                   <th className="text-left py-12 px-10 text-[10px] font-black text-[#5d5f61] uppercase tracking-widest">Vault Value</th>
                   <th className="text-left py-12 px-10 text-[10px] font-black text-[#5d5f61] uppercase tracking-widest">Stage Status</th>
                   <th className="text-right py-12 px-12 text-[10px] font-black text-[#5d5f61] uppercase tracking-widest">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100/50">
                 {filteredOrders.map((order, idx) => (
                   <motion.tr 
                     key={order._id}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: idx * 0.05 }}
                     className="group hover:bg-white/40 transition-all duration-500"
                   >
                     <td className="py-10 px-12">
                        <div className="flex flex-col gap-1">
                           <span className="text-lg font-black font-playfair text-[#0b2b1a] group-hover:text-[#c81c6a] transition-colors">{order.orderId}</span>
                           <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                     </td>
                     <td className="py-10 px-10">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-[#0b2b1a] shadow-sm border border-white">
                              <User size={18} />
                           </div>
                           <div>
                              <p className="text-[13px] font-black text-[#0b2b1a]">{order.customer.name}</p>
                              <p className="text-[10px] font-bold text-gray-400">{order.customer.email}</p>
                           </div>
                        </div>
                     </td>
                     <td className="py-10 px-10">
                        <span className="text-xl font-black font-playfair text-[#0b2b1a]">₹{order.totalAmount}</span>
                     </td>
                     <td className="py-10 px-10">
                        <span className={cn(
                          "px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border",
                          statusColors[order.status] || "bg-gray-50 text-gray-400"
                        )}>
                          {order.status}
                        </span>
                     </td>
                     <td className="py-10 px-12 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                           <button 
                             onClick={() => setSelectedOrder(order)}
                             className="p-4 rounded-2xl bg-white text-[#0b2b1a] hover:bg-[#0b2b1a] hover:text-white shadow-xl shadow-black/5 hover:scale-110 transition-all duration-500"
                           >
                              <Eye size={16} />
                           </button>
                           <button 
                             onClick={() => handleDeleteOrder(order._id)}
                             className="p-4 rounded-2xl bg-white text-red-500 hover:bg-red-50 shadow-xl shadow-black/5 hover:scale-110 transition-all duration-500"
                           >
                              <Trash2 size={16} />
                           </button>
                        </div>
                     </td>
                   </motion.tr>
                 ))}
               </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-[#0b2b1a]/40 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-screen w-full max-w-2xl bg-white shadow-2xl z-[101] flex flex-col"
            >
               <div className="p-10 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-[#c81c6a] font-black text-[9px] uppercase tracking-[0.4em] mb-2">Manifest Identity</p>
                    <h2 className="text-4xl font-black font-playfair text-[#0b2b1a]">Order <span className="italic font-normal">{selectedOrder.orderId}</span></h2>
                  </div>
                  <button 
                    onClick={() => setSelectedOrder(null)}
                    className="p-4 rounded-2xl bg-gray-50 text-gray-300 hover:text-[#0b2b1a] transition-all"
                  >
                    <X size={20} />
                  </button>
               </div>

               <div className="flex-1 overflow-y-auto p-12 space-y-12 bg-[#f1f1f2]/30 custom-scrollbar">
                  {/* Status Grid */}
                  <div className="grid grid-cols-2 gap-8">
                     <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-black/[0.02]">
                        <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-4">Stage Status</p>
                        <select 
                          value={selectedOrder.status}
                          onChange={(e) => updateOrderStatus(selectedOrder._id, e.target.value)}
                          className="w-full bg-transparent outline-none font-black text-[#0b2b1a] text-lg cursor-pointer"
                        >
                           <option value="pending">Pending</option>
                           <option value="processing">Processing</option>
                           <option value="shipped">Shipped</option>
                           <option value="delivered">Delivered</option>
                           <option value="cancelled">Cancelled</option>
                        </select>
                     </div>
                     <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-black/[0.02]">
                        <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-4">Payment Status</p>
                        <div className="flex items-center gap-3">
                           <div className={cn("w-2 h-2 rounded-full", selectedOrder.paymentStatus === 'paid' ? "bg-emerald-500" : "bg-amber-500")} />
                           <span className="text-lg font-black text-[#0b2b1a] uppercase">{selectedOrder.paymentStatus}</span>
                        </div>
                     </div>
                  </div>

                  {/* Customer Information */}
                  <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-black/[0.02] space-y-8">
                     <div className="flex items-center gap-4 pb-6 border-b border-gray-50">
                        <div className="w-12 h-12 rounded-2xl bg-[#0b2b1a] text-white flex items-center justify-center shadow-lg">
                           <User size={20} />
                        </div>
                        <h3 className="text-2xl font-black font-playfair text-[#0b2b1a]">Customer Profile</h3>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-1">
                           <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Name</p>
                           <p className="font-bold text-[#0b2b1a]">{selectedOrder.customer.name}</p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Email</p>
                           <p className="font-bold text-[#0b2b1a]">{selectedOrder.customer.email}</p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Phone</p>
                           <p className="font-bold text-[#0b2b1a]">{selectedOrder.customer.phone}</p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Payment</p>
                           <div className="flex items-center gap-2 font-bold text-[#0b2b1a]">
                              <CreditCard size={14} className="opacity-40" /> {selectedOrder.paymentMethod}
                           </div>
                        </div>
                        <div className="col-span-full space-y-2">
                           <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Destination Address</p>
                           <div className="flex gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                              <MapPin size={18} className="text-[#c81c6a] shrink-0 mt-1" />
                              <p className="text-[13px] font-medium leading-relaxed text-[#0b2b1a]">{selectedOrder.customer.address}</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Items Manifest */}
                  <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-black/[0.02] space-y-8">
                     <div className="flex items-center gap-4 pb-6 border-b border-gray-50">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg">
                           <Package size={20} />
                        </div>
                        <h3 className="text-2xl font-black font-playfair text-[#0b2b1a]">Asset Manifest</h3>
                     </div>
                     <div className="space-y-6">
                        {selectedOrder.items.map((item, idx) => (
                           <div key={idx} className="flex items-center gap-6 group/item">
                              <div className="w-20 h-20 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center p-3 overflow-hidden shadow-sm">
                                 <img src={item.image} className="w-full h-full object-contain group-hover/item:scale-110 transition-transform duration-700" alt={item.name} />
                              </div>
                              <div className="flex-1">
                                 <p className="text-lg font-black font-playfair text-[#0b2b1a]">{item.name}</p>
                                 <p className="text-[10px] font-black text-[#c81c6a] uppercase tracking-widest mt-1">{item.variant.size} {item.variant.unit}</p>
                              </div>
                              <div className="text-right">
                                 <p className="text-[13px] font-black text-[#0b2b1a]">₹{item.variant.price} &times; {item.quantity}</p>
                                 <p className="text-sm font-black text-[#0b2b1a] mt-1">₹{item.variant.price * item.quantity}</p>
                              </div>
                           </div>
                        ))}
                        <div className="pt-8 border-t border-gray-100 flex justify-between items-end">
                           <div>
                              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Vault Settlement</p>
                              <p className="text-[11px] font-bold text-gray-400">Total assets excluding botanical surcharges.</p>
                           </div>
                           <div className="text-right">
                              <p className="text-4xl font-black font-playfair text-[#0b2b1a]">₹{selectedOrder.totalAmount}</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="p-10 border-t border-gray-100 flex gap-6 print:hidden">
                  <button 
                    onClick={handlePrint}
                    className="flex-1 py-6 rounded-[2.5rem] bg-gray-50 text-gray-400 font-black text-[10px] uppercase tracking-[0.4em] hover:bg-gray-100 hover:text-[#0b2b1a] transition-all"
                  >
                     Print Invoice
                  </button>
                  <button 
                    onClick={() => handleWhatsAppShare(selectedOrder)}
                    className="flex-1 py-6 rounded-[2.5rem] bg-emerald-50 text-emerald-600 font-black text-[10px] uppercase tracking-[0.4em] hover:bg-emerald-100 transition-all flex items-center justify-center gap-3"
                  >
                     <MessageCircle size={16} />
                     WhatsApp
                  </button>
                  <button 
                    onClick={() => setSelectedOrder(null)}
                    className="flex-1 py-6 rounded-[2.5rem] bg-[#0b2b1a] text-white font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl shadow-[#0b2b1a]/20 hover:bg-[#c81c6a] transition-all"
                  >
                     Close Manifest
                  </button>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hidden Proper Invoice for Printing */}
      <div className="hidden print:block print:relative print:z-[200] bg-white p-20 text-[#0b2b1a]">
        {selectedOrder && (
          <div className="max-w-4xl mx-auto space-y-24">
            {/* Invoice Header */}
            <div className="flex justify-between items-start border-b-2 border-[#0b2b1a] pb-12">
              <div className="space-y-6">
                <img src="/images/logo/Rafah logo.webp" alt="Rafah Garden" className="h-20 w-auto brightness-0" />
                <div className="text-[11px] font-black uppercase tracking-widest leading-loose">
                  <p className="text-gray-400">Merchant Details</p>
                  <p>Rafah Garden Farms</p>
                  <p>Kasaragod, Kerala, India</p>
                  <p>GSTIN: 32AAACR1234A1Z1</p>
                </div>
              </div>
              <div className="text-right space-y-4">
                <h1 className="text-6xl font-black font-playfair uppercase tracking-tighter">Invoice</h1>
                <div className="text-[12px] font-black uppercase tracking-[0.3em] text-gray-400 space-y-1">
                  <p>Manifest No: <span className="text-[#0b2b1a] ml-2">{selectedOrder.orderId}</span></p>
                  <p>Issue Date: <span className="text-[#0b2b1a] ml-2">{new Date(selectedOrder.createdAt).toLocaleDateString()}</span></p>
                </div>
              </div>
            </div>

            {/* Bill To / Ship To */}
            <div className="grid grid-cols-2 gap-32">
              <div className="space-y-6">
                <p className="text-[11px] font-black uppercase tracking-[0.5em] text-[#c81c6a]">Consignee Details</p>
                <div className="text-sm font-bold space-y-2">
                  <p className="text-3xl font-black font-playfair">{selectedOrder.customer.name}</p>
                  <div className="space-y-1 text-gray-500">
                    <p>{selectedOrder.customer.email}</p>
                    <p>{selectedOrder.customer.phone}</p>
                  </div>
                  <div className="pt-6 text-gray-600 max-w-sm leading-[1.8] border-t border-gray-50 mt-4">
                    {selectedOrder.customer.address}
                  </div>
                </div>
              </div>
              <div className="space-y-8 text-right">
                <div className="space-y-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.5em] text-[#c81c6a]">Settlement Method</p>
                  <div className="inline-flex items-center gap-4 bg-gray-50 px-8 py-4 rounded-2xl border border-gray-100 shadow-sm">
                    <CreditCard size={16} className="text-gray-300" />
                    <span className="text-xs font-black uppercase tracking-[0.2em]">{selectedOrder.paymentMethod}</span>
                  </div>
                </div>
                <div className="space-y-2">
                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Transaction Status</p>
                   <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-600">Confimed & {selectedOrder.paymentStatus}</p>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="pt-12">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-[#0b2b1a]">
                    <th className="text-left py-6 text-[11px] font-black uppercase tracking-[0.3em]">Asset Description</th>
                    <th className="text-center py-6 text-[11px] font-black uppercase tracking-[0.3em]">Qty</th>
                    <th className="text-right py-6 text-[11px] font-black uppercase tracking-[0.3em]">Unit Price</th>
                    <th className="text-right py-6 text-[11px] font-black uppercase tracking-[0.3em]">Line Settlement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {selectedOrder.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-10 pr-6">
                        <div className="flex items-center gap-8">
                           <div className="w-24 h-24 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center p-2 overflow-hidden shrink-0">
                              <img src={item.image} className="w-full h-full object-contain" alt={item.name} />
                           </div>
                           <div>
                              <p className="text-2xl font-black font-playfair mb-2">{item.name}</p>
                              <p className="text-[10px] font-black text-[#c81c6a] uppercase tracking-[0.3em]">Ref: {item.variant.size} {item.variant.unit}</p>
                           </div>
                        </div>
                      </td>
                      <td className="py-10 text-center font-black text-lg">{item.quantity}</td>
                      <td className="py-10 text-right font-bold text-lg">₹{item.variant.price}</td>
                      <td className="py-10 text-right font-black text-xl text-[#0b2b1a]">₹{item.variant.price * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end pt-12 border-t-2 border-[#0b2b1a]">
              <div className="w-full max-w-sm space-y-6">
                <div className="flex justify-between text-xs font-black uppercase tracking-[0.2em] text-gray-400">
                  <span>Subtotal</span>
                  <span>₹{selectedOrder.totalAmount}</span>
                </div>
                <div className="flex justify-between text-xs font-black uppercase tracking-[0.2em] text-gray-400">
                  <span>Botanical Surcharge (0%)</span>
                  <span>₹0</span>
                </div>
                <div className="flex justify-between items-center pt-8 border-t border-gray-100">
                  <span className="text-[12px] font-black uppercase tracking-[0.5em] text-[#c81c6a]">Grand Total</span>
                  <span className="text-5xl font-black font-playfair tracking-tighter">₹{selectedOrder.totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Footer Note */}
            <div className="pt-32 grid grid-cols-2 gap-32 border-t border-gray-50">
               <div className="space-y-6">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">Sanctuary Seal</p>
                  <div className="h-24 w-64 border border-dashed border-gray-200 rounded-[2rem] flex items-center justify-center italic text-gray-200 text-sm">
                     Official Digital Signature
                  </div>
               </div>
               <div className="text-right flex flex-col justify-end italic text-gray-400 text-sm leading-relaxed">
                  <p>Thank you for being part of the Rafah Garden heritage.</p>
                  <p className="mt-2 text-[11px] font-black uppercase tracking-widest text-gray-300 not-italic">Cultivated with passion in kasaragod.</p>
               </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @media print {
          /* Hide everything by default */
          body * {
            visibility: hidden;
            margin: 0;
            padding: 0;
          }
          
          /* Only show the invoice container and its children */
          .print\:block, .print\:block * {
            visibility: visible !important;
          }
          
          .print\:block {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            display: block !important;
            background: white !important;
            padding: 40px !important;
          }

          /* Reset any layout constraints */
          .fixed, .absolute, .relative {
            position: static !important;
          }
          
          /* Hide modal backdrop and other UI overlays */
          .z-\[100\], .z-\[101\], .fixed.inset-0 {
            display: none !important;
          }

          @page {
            size: auto;
            margin: 15mm;
          }
        }
      `}</style>
    </div>
  );
}
