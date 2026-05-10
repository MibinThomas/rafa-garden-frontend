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
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
    <div className="space-y-12 pb-24 relative">
      {/* Background Watermark */}
      <div className="absolute top-0 right-0 pointer-events-none opacity-[0.03] select-none -mt-10 -mr-10 md:-mr-20">
         <h1 className="text-[120px] md:text-[250px] font-black tracking-tighter leading-none text-[#5d5f61]">VOICES</h1>
      </div>

      {/* Header */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#c81c6a] font-black text-[10px] uppercase tracking-[0.5em] mb-2 md:mb-4 ml-1"
          >
            Digital Sanctuary
          </motion.p>
          <h1 className="text-4xl md:text-7xl font-black font-playfair text-[#5d5f61] tracking-tighter">Enquiries</h1>
        </div>

        <div className="flex flex-wrap items-center gap-4 bg-white/40 backdrop-blur-md p-2 rounded-[2.5rem] border border-white shadow-xl shadow-black/[0.02]">
          <div className="hidden md:flex items-center gap-3 px-6 py-4">
             <Filter size={16} className="text-[#c81c6a]" />
             <span className="text-[10px] font-black uppercase tracking-widest text-[#5d5f61]">All Entries</span>
          </div>
          <button 
            onClick={() => exportToExcel("enquiries")}
            className="bg-[#5d5f61] text-white px-8 py-4 rounded-[1.8rem] shadow-xl hover:bg-[#c81c6a] transition-all duration-500 flex items-center gap-4 group active:scale-95"
          >
            <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white">Export Registry</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 p-2 bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-white w-fit max-w-full overflow-x-auto scrollbar-hide relative z-10 shadow-xl shadow-black/[0.02]">
        <div className="flex gap-3">
          {[
            { id: "enquiries", label: "Botanical Visions", icon: MessageSquare, count: enquiries.length },
            { id: "subscribers", label: "Subscriber Base", icon: Users, count: subscribers.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={cn(
                "flex items-center gap-4 px-6 md:px-8 py-3 md:py-4 rounded-[1.5rem] md:rounded-[1.8rem] text-[9px] md:text-[11px] font-black uppercase tracking-widest transition-all duration-500 whitespace-nowrap",
                activeTab === tab.id 
                  ? "bg-[#5d5f61] text-white shadow-xl shadow-[#5d5f61]/20 scale-105" 
                  : "text-gray-400 hover:text-[#5d5f61] hover:bg-white"
              )}
            >
              <tab.icon size={16} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.id === "enquiries" ? "Visions" : "Base"}</span>
              <span className={cn(
                 "ml-2 px-3 py-1 rounded-full text-[10px] transition-colors duration-500",
                 activeTab === tab.id ? "bg-[#c81c6a] text-white shadow-lg" : "bg-gray-100 text-gray-400"
              )}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="space-y-10 relative z-10">
        {/* Search Bar */}
        <div className="bg-white/50 backdrop-blur-md p-2 rounded-[3rem] border border-white shadow-xl shadow-black/[0.02]">
          <div className="flex-1 relative">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
            <input 
              type="text" 
              placeholder={activeTab === "enquiries" ? "Search botanical narratives and visions..." : "Search subscriber repository..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-18 pr-8 py-6 bg-transparent outline-none text-sm font-bold text-[#5d5f61] placeholder:text-gray-300"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-48 flex flex-col items-center justify-center gap-8">
             <div className="relative w-20 h-20">
                <div className="absolute inset-0 border-4 border-gray-100 rounded-full" />
                <div className="absolute inset-0 border-4 border-[#c81c6a] border-t-transparent rounded-full animate-spin" />
             </div>
             <p className="text-[12px] font-black uppercase tracking-[0.4em] text-gray-300 animate-pulse">Syncing Communication Repository...</p>
          </div>
        ) : activeTab === "enquiries" ? (
          <div className="grid grid-cols-1 gap-10">
            <AnimatePresence mode="popLayout">
              {filteredEnquiries.map((enquiry, idx) => (
                <motion.div 
                  key={enquiry._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  className={cn(
                    "bg-white/60 backdrop-blur-md rounded-[4rem] border border-white overflow-hidden p-10 flex flex-col md:flex-row items-start gap-12 transition-all duration-700 shadow-2xl shadow-black/[0.03] hover:shadow-black/[0.06] group",
                    enquiry.status === "unread" ? "ring-2 ring-[#c81c6a]/10" : ""
                  )}
                >
                  {/* Identity Section */}
                  <div className="w-full md:w-72 space-y-6 relative">
                    <div className="flex items-center justify-between md:block">
                      <div className={cn(
                         "w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center transition-all duration-700 shadow-xl border border-white/50",
                         enquiry.status === "unread" ? "bg-[#c81c6a] text-white rotate-6" : "bg-white text-gray-300"
                      )}>
                        <User size={28} strokeWidth={2.5} className="md:w-8 md:h-8" />
                      </div>
                      <div className="md:hidden">
                        <span className={cn(
                          "px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-sm",
                          enquiry.status === "unread" ? "bg-[#c81c6a] text-white shadow-[#c81c6a]/20" : "bg-gray-100 text-gray-400"
                        )}>
                          {enquiry.status}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-black font-playfair text-[#5d5f61] mb-2 leading-none group-hover:text-[#c81c6a] transition-colors duration-500">{enquiry.name}</h3>
                      <p className="flex items-center gap-3 text-[10px] md:text-[11px] font-bold text-gray-400 group-hover:text-[#5d5f61] transition-colors duration-500 uppercase tracking-widest"><Mail size={14} className="opacity-40" /> {enquiry.email}</p>
                    </div>
                    <div className="hidden md:block pt-2">
                       <span className={cn(
                         "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm",
                         enquiry.status === "unread" ? "bg-[#c81c6a] text-white shadow-[#c81c6a]/20" : "bg-gray-100 text-gray-400"
                       )}>
                         {enquiry.status}
                       </span>
                    </div>
                  </div>

                  {/* Message Section */}
                  <div className="flex-1 space-y-6 md:border-l border-gray-100 md:pl-12 w-full">
                    <div className="flex items-center gap-3 text-gray-300">
                       <Clock size={16} className="opacity-40" />
                       <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em]">{new Date(enquiry.createdAt).toLocaleString('en-US', { month: 'long', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-base md:text-lg text-gray-600 font-inter leading-relaxed italic md:pr-8">
                      "{enquiry.message}"
                    </p>
                  </div>

                  {/* Actions Section */}
                  <div className="flex md:flex-col gap-4 opacity-100 md:opacity-0 group-hover:opacity-100 md:translate-x-12 group-hover:translate-x-0 transition-all duration-700 w-full md:w-auto justify-end">
                    <button 
                      onClick={() => updateStatus(enquiry._id, enquiry.status === "unread" ? "read" : "unread")}
                      className={cn(
                        "p-4 rounded-[1.5rem] md:rounded-[1.8rem] transition-all duration-500 shadow-xl",
                        enquiry.status === "unread" ? "bg-[#c81c6a] text-white hover:scale-110" : "bg-white text-gray-300 hover:text-emerald-500 hover:scale-110"
                      )}
                      title={enquiry.status === "unread" ? "Mark as Read" : "Mark as Unread"}
                    >
                      <CheckCircle size={20} strokeWidth={2.5} />
                    </button>
                    <button 
                      onClick={() => updateStatus(enquiry._id, "archived")}
                      className="p-4 rounded-[1.5rem] md:rounded-[1.8rem] bg-white text-gray-300 hover:text-[#5d5f61] hover:scale-110 transition-all duration-500 shadow-xl"
                      title="Archive Narrative"
                    >
                      <Archive size={20} strokeWidth={2.5} />
                    </button>
                    <button 
                      onClick={() => handleDelete(enquiry._id)}
                      className="p-4 rounded-[1.5rem] md:rounded-[1.8rem] bg-white text-red-300 hover:bg-red-500 hover:text-white hover:scale-110 transition-all duration-500 shadow-xl"
                      title="Discard Entry"
                    >
                      <Trash2 size={20} strokeWidth={2.5} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredEnquiries.length === 0 && (
              <div className="py-48 text-center bg-white/40 backdrop-blur-md rounded-[4rem] border-2 border-dashed border-gray-100">
                 <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center mx-auto mb-10 shadow-xl border border-gray-50">
                    <MessageSquare className="text-gray-200" size={40} />
                 </div>
                 <h3 className="text-3xl font-black font-playfair text-[#5d5f61] mb-4">Quiet Sanctuary</h3>
                 <p className="text-gray-400 font-bold uppercase text-[11px] tracking-[0.4em]">No botanical narratives found in this layer.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredSubscribers.map((subscriber, idx) => (
                <motion.div 
                  key={subscriber._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.03 }}
                  className="bg-white/60 backdrop-blur-md p-8 rounded-[3.5rem] border border-white flex items-center justify-between hover:shadow-2xl hover:shadow-black/5 transition-all duration-700 group"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-gray-200 group-hover:bg-[#c81c6a] group-hover:text-white group-hover:rotate-6 transition-all duration-700 shadow-xl border border-gray-50">
                      <Mail size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h4 className="font-black text-lg text-[#5d5f61] leading-none mb-2">{subscriber.email}</h4>
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Joined {new Date(subscriber.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleDelete(subscriber._id)}
                    className="p-4 rounded-2xl text-gray-200 hover:text-red-500 hover:bg-white hover:shadow-xl transition-all duration-500 opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={18} strokeWidth={2.5} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredSubscribers.length === 0 && (
              <div className="col-span-full py-48 text-center bg-white/40 backdrop-blur-md rounded-[4rem] border-2 border-dashed border-gray-100">
                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center mx-auto mb-10 shadow-xl border border-gray-50">
                    <Users className="text-gray-200" size={40} />
                 </div>
                 <h3 className="text-3xl font-black font-playfair text-[#5d5f61] mb-4">Growing Sanctuary</h3>
                 <p className="text-gray-400 font-bold uppercase text-[11px] tracking-[0.4em]">Your botanical subscriber repository is currently waiting for growth.</p>
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
