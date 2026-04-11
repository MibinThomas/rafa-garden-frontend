"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useSiteSettings } from "@/lib/SiteSettingsContext";
import { Mail, Phone, MapPin, MessageCircle, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const { settings } = useSiteSettings();
  const [formState, setFormState] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("submitting");
    // Simulate API delay
    setTimeout(() => {
      setFormState("success");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f1f1f2] selection:bg-[#c81c6a] selection:text-white pb-32">
      {/* Cinematic Hero Section */}
      <section className="relative w-full h-[50vh] flex items-center justify-center overflow-hidden bg-[#0b2b1a]">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 z-0"
        >
          <Image 
            src="/images/blog/growing_pitaya.png" 
            alt="Rafah Garden Sanctuary" 
            fill 
            className="object-cover"
            priority
          />
        </motion.div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#f1f1f2] z-1" />

        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.5em] mb-4 block text-[#c81c6a]">
              Connect with us
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-playfair tracking-tighter mb-6 leading-none text-white">
              Get in <span className="italic">Touch.</span>
            </h1>
            <p className="text-lg md:text-xl opacity-70 font-inter font-light leading-relaxed max-w-2xl mx-auto text-white">
              Whether you have a query about our heritage harvests or wish to visit our sanctuaries, we are here to guide you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Hub Section */}
      <section className="max-w-[1400px] mx-auto w-full px-6 md:px-12 -mt-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          
          {/* Left: Contact Details (2 Columns) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-2 flex flex-col gap-6"
          >
            <div className="bg-white/40 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/50 shadow-xl overflow-hidden group">
              <div className="w-14 h-14 bg-[#c81c6a] rounded-full flex items-center justify-center mb-6 text-white shadow-lg transition-transform group-hover:scale-110">
                <Mail size={24} />
              </div>
              <h3 className="text-2xl font-bold font-playfair mb-2">Write to us.</h3>
              <p className="text-gray-500 font-light mb-4">Direct your botanical inquiries to our concierge team.</p>
              <a href={`mailto:${settings["global.contact_email"]}`} className="text-lg font-bold text-[#c81c6a] hover:underline">
                {settings["global.contact_email"]}
              </a>
            </div>

            <div className="bg-white/40 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/50 shadow-xl overflow-hidden group">
              <div className="w-14 h-14 bg-[#7fa23f] rounded-full flex items-center justify-center mb-6 text-white shadow-lg transition-transform group-hover:scale-110">
                <Phone size={24} />
              </div>
              <h3 className="text-2xl font-bold font-playfair mb-2">Speak with us.</h3>
              <p className="text-gray-500 font-light mb-4">Our sanctuary lines are open for your voice.</p>
              <a href={`tel:${settings["global.contact_phone"]}`} className="text-lg font-bold text-[#7fa23f] hover:underline">
                {settings["global.contact_phone"]}
              </a>
            </div>

            <div className="bg-white/40 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/50 shadow-xl overflow-hidden group">
              <div className="w-14 h-14 bg-[#9a0c52] rounded-full flex items-center justify-center mb-6 text-white shadow-lg transition-transform group-hover:scale-110">
                <MapPin size={24} />
              </div>
              <h3 className="text-2xl font-bold font-playfair mb-2">Visit us.</h3>
              <p className="text-gray-500 font-light mb-4">Experience the heritage pitaya sanctuary in person.</p>
              <span className="text-lg font-bold text-[#9a0c52]">
                Al Aweer, Dubai, UAE
              </span>
            </div>
          </motion.div>

          {/* Right: Contact Form (3 Columns) */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="lg:col-span-3 bg-white p-10 sm:p-16 rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.05)] border border-white relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {formState !== "success" ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h2 className="text-4xl font-black font-playfair mb-4 leading-tight">Send a <span className="italic">Message.</span></h2>
                  <p className="text-gray-400 font-light mb-12">Leave your details and our collective will reach out shortly.</p>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div className="relative group">
                        <label className="text-[10px] uppercase font-black tracking-widest text-[#c81c6a] mb-2 block">Full Name</label>
                        <input 
                          required
                          type="text" 
                          placeholder="Your identity" 
                          className="w-full bg-transparent border-b border-gray-100 py-3 focus:border-[#c81c6a] focus:outline-none transition-all font-inter text-gray-900"
                        />
                      </div>
                      <div className="relative group">
                        <label className="text-[10px] uppercase font-black tracking-widest text-[#c81c6a] mb-2 block">Email Address</label>
                        <input 
                          required
                          type="email" 
                          placeholder="Where to reach you" 
                          className="w-full bg-transparent border-b border-gray-100 py-3 focus:border-[#c81c6a] focus:outline-none transition-all font-inter text-gray-900"
                        />
                      </div>
                    </div>

                    <div className="relative group">
                      <label className="text-[10px] uppercase font-black tracking-widest text-[#c81c6a] mb-2 block">Your Vision or Query</label>
                      <textarea 
                        required
                        rows={4}
                        placeholder="Share your thoughts with us..." 
                        className="w-full bg-transparent border-b border-gray-100 py-3 focus:border-[#c81c6a] focus:outline-none transition-all font-inter text-gray-900 resize-none"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-6">
                      <button 
                        type="submit"
                        disabled={formState === "submitting"}
                        className="w-full sm:w-auto px-12 py-5 rounded-2xl bg-[#c81c6a] text-white font-bold tracking-[0.2em] uppercase text-xs hover:bg-[#9a0c52] transition-colors shadow-xl flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50"
                      >
                        {formState === "submitting" ? "Sending..." : "Submit Inquiry"} <Send size={16} />
                      </button>

                      <a 
                        href={settings["global.social_whatsapp"]} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-3 text-sm font-bold text-[#25D366] hover:opacity-80 transition-all border-b border-transparent hover:border-[#25D366]"
                      >
                        <MessageCircle size={20} /> Or Chat on WhatsApp
                      </a>
                    </div>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-20 text-center"
                >
                  <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white mb-8 shadow-2xl">
                    <CheckCircle2 size={48} />
                  </div>
                  <h2 className="text-4xl font-black font-playfair mb-4">Message <span className="italic text-green-600">Harvested.</span></h2>
                  <p className="text-gray-400 font-light mb-12 max-w-xs">Thank you for connecting. Our botanical collective will respond within 24 standard hours.</p>
                  <button 
                    onClick={() => setFormState("idle")}
                    className="text-[10px] font-black uppercase tracking-widest text-[#c81c6a] hover:underline"
                  >
                    Send another message
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Subtle corner graphic */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 opacity-5 pointer-events-none">
               <Image src="/images/hero/crush_bottle.png" alt="" fill className="object-contain grayscale" />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
