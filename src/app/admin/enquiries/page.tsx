"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, 
  Users, 
  Search, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Archive, 
  Mail, 
  User, 
  Loader2,
  Filter,
  Download
} from "lucide-react";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import * as XLSX from "xlsx";

type Tab = "enquiries" | "subscribers";

interface Enquiry {
  _id: string;
  name: string;
  email: string;
  message: string;
  status: "unread" | "read" | "archived";
  createdAt: string;
}

interface Subscriber {
  _id: string;
  email: string;
  status: string;
  createdAt: string;
}

export default function EnquiriesPage() {
  const [activeTab, setActiveTab] = useState<Tab>("enquiries");
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "enquiries") {
        const res = await fetch("/api/enquiries");
        const data = await res.json();
        if (Array.isArray(data)) setEnquiries(data);
      } else {
        const res = await fetch("/api/subscriptions");
        const data = await res.json();
        if (Array.isArray(data)) setSubscribers(data);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const exportToExcel = (type: Tab) => {
    const data = type === "enquiries" ? enquiries : subscribers;
    if (data.length === 0) {
      alert(`No ${type} data available to export.`);
      return;
    }

    // Map data to clean headers for Excel
    const exportData = data.map(item => {
      if (type === "enquiries") {
        const e = item as Enquiry;
        return {
          "Name": e.name,
          "Email": e.email,
          "Status": e.status,
          "Date": new Date(e.createdAt).toLocaleString(),
          "Message": e.message
        };
      } else {
        const s = item as Subscriber;
        return {
          "Email": s.email,
          "Status": s.status,
          "Date": new Date(s.createdAt).toLocaleString()
        };
      }
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    const sheetName = type === "enquiries" ? "Contact Submissions" : "Newsletter Subscribers";
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    // Use manual blob creation for maximum naming reliability
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    const fileName = type === "enquiries" 
      ? `Rafah_Garden_Contact_Submissions_${new Date().toISOString().split('T')[0]}.xlsx`
      : `Rafah_Garden_Newsletter_Subscribers_${new Date().toISOString().split('T')[0]}.xlsx`;

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/enquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        setEnquiries(prev => prev.map(e => e._id === id ? { ...e, status: status as any } : e));
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setIsDeleteDialogOpen(true);
  };

  const performDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      const endpoint = activeTab === "enquiries" ? "/api/enquiries" : "/api/subscriptions";
      const res = await fetch(`${endpoint}?id=${deletingId}`, { method: "DELETE" });
      if (res.ok) {
        if (activeTab === "enquiries") {
          setEnquiries(prev => prev.filter(e => e._id !== deletingId));
        } else {
          setSubscribers(prev => prev.filter(s => s._id !== deletingId));
        }
        setIsDeleteDialogOpen(false);
      }
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredEnquiries = enquiries.filter(e => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSubscribers = subscribers.filter(s => 
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black font-playfair text-[#0b2b1a] mb-3 tracking-tighter">Enquiries Hub</h1>
          <p className="text-[#bbbdbf] font-bold text-[10px] uppercase tracking-[0.4em] ml-1">Monitor botanical visions & sanctuary signups</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
             <Filter size={16} className="text-[#c81c6a]" />
             <span className="text-[10px] font-black uppercase tracking-widest text-[#0b2b1a]">All Submissions</span>
          </div>
          <button 
            onClick={() => exportToExcel("enquiries")}
            className="bg-[#0b2b1a] text-white px-6 py-4 rounded-2xl shadow-xl hover:bg-[#c81c6a] transition-all flex items-center gap-3 group active:scale-95"
            title="Export Contact Submissions"
          >
            <Download size={16} className="group-hover:translate-y-0.5 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Export Contacts</span>
          </button>
          <button 
            onClick={() => exportToExcel("subscribers")}
            className="bg-white text-[#0b2b1a] px-6 py-4 rounded-2xl border border-gray-100 shadow-sm hover:border-[#c81c6a] hover:text-[#c81c6a] transition-all flex items-center gap-3 group active:scale-95"
            title="Export Subscriber Base"
          >
            <Download size={16} className="group-hover:translate-y-0.5 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Export Subscribers</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 bg-gray-100/50 rounded-2xl w-fit">
        {[
          { id: "enquiries", label: "Botanical Visions", icon: MessageSquare, count: enquiries.length },
          { id: "subscribers", label: "Subscriber Base", icon: Users, count: subscribers.length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`flex items-center gap-3 px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id ? "bg-white text-[#0b2b1a] shadow-sm" : "text-gray-400 hover:text-[#0b2b1a]"
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
            <span className={`ml-1 px-2 py-0.5 rounded-full text-[9px] ${activeTab === tab.id ? "bg-[#c81c6a] text-white" : "bg-gray-200 text-gray-500"}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="bg-white p-4 rounded-[2rem] border border-gray-100 flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input 
              type="text" 
              placeholder={activeTab === "enquiries" ? "Search visions by name, email or intent..." : "Search subscriber base..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-6 py-5 bg-gray-50/50 rounded-2xl outline-none text-sm font-bold text-[#0b2b1a] focus:ring-2 focus:ring-[#c81c6a]/10 transition-all placeholder:text-gray-300"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center space-y-4">
             <Loader2 className="w-10 h-10 text-[#c81c6a] animate-spin" />
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">Syncing Communications...</p>
          </div>
        ) : activeTab === "enquiries" ? (
          <div className="grid grid-cols-1 gap-6">
            <AnimatePresence>
              {filteredEnquiries.map((enquiry) => (
                <motion.div 
                  key={enquiry._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`bg-white rounded-[2.5rem] border ${enquiry.status === "unread" ? "border-[#c81c6a]/20 shadow-[0_20px_40px_rgba(200,28,106,0.05)]" : "border-gray-100"} overflow-hidden p-8 sm:p-10 flex flex-col md:flex-row items-start gap-8 transition-all hover:shadow-xl group`}
                >
                  {/* Status Indicator Bar */}
                  <div className={`w-1.5 h-full absolute left-0 top-0 hidden md:block ${enquiry.status === "unread" ? "bg-[#c81c6a]" : "bg-gray-100"}`} />

                  {/* Identity Section */}
                  <div className="md:w-64 space-y-4">
                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-[#c81c6a] group-hover:bg-[#c81c6a] group-hover:text-white transition-all duration-500 shadow-sm">
                      <User size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black font-playfair text-[#0b2b1a] mb-1">{enquiry.name}</h3>
                      <p className="flex items-center gap-2 text-[11px] font-bold text-gray-400 group-hover:text-[#c81c6a] transition-colors"><Mail size={12}/> {enquiry.email}</p>
                    </div>
                    <div className="pt-2">
                       <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                         enquiry.status === "unread" ? "bg-[#c81c6a] text-white" : "bg-gray-100 text-gray-400"
                       }`}>
                         {enquiry.status}
                       </span>
                    </div>
                  </div>

                  {/* Message Section */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3 text-gray-300">
                       <Clock size={14} />
                       <span className="text-[10px] font-bold uppercase tracking-widest">{new Date(enquiry.createdAt).toLocaleString('en-US', { month: 'long', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-base text-gray-600 font-inter leading-relaxed italic border-l-2 border-gray-50 pl-6 py-2 group-hover:border-[#c81c6a]/20 transition-all">
                      "{enquiry.message}"
                    </p>
                  </div>

                  {/* Actions Section */}
                  <div className="flex md:flex-col gap-3">
                    <button 
                      onClick={() => updateStatus(enquiry._id, enquiry.status === "unread" ? "read" : "unread")}
                      className={`p-3.5 rounded-2xl transition-all shadow-sm ${enquiry.status === "unread" ? "bg-[#c81c6a] text-white hover:brightness-110" : "bg-gray-50 text-gray-400 hover:text-green-500"}`}
                      title={enquiry.status === "unread" ? "Mark as Read" : "Mark as Unread"}
                    >
                      <CheckCircle size={18} />
                    </button>
                    <button 
                      onClick={() => updateStatus(enquiry._id, "archived")}
                      className="p-3.5 rounded-2xl bg-gray-50 text-gray-400 hover:text-gray-900 transition-all shadow-sm"
                      title="Archive Vision"
                    >
                      <Archive size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(enquiry._id)}
                      className="p-3.5 rounded-2xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                      title="Discard Entry"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredEnquiries.length === 0 && (
              <div className="py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-gray-200">
                <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">No visions found in this botanical layer.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence>
              {filteredSubscribers.map((subscriber) => (
                <motion.div 
                  key={subscriber._id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center justify-between hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-[#c81c6a]/10 group-hover:text-[#c81c6a] transition-all">
                      <Mail size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0b2b1a]">{subscriber.email}</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Joined {new Date(subscriber.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-green-50 text-green-600 text-[9px] font-black uppercase tracking-widest rounded-lg">Active</span>
                    <button 
                      onClick={() => handleDelete(subscriber._id)}
                      className="p-2.5 rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredSubscribers.length === 0 && (
              <div className="py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-gray-200">
                <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Your garden's subscriber base is currently empty.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <DeleteConfirmDialog 
        isOpen={isDeleteDialogOpen} 
        onClose={() => setIsDeleteDialogOpen(false)} 
        onConfirm={performDelete} 
        loading={isDeleting} 
      />
    </div>
  );
}
