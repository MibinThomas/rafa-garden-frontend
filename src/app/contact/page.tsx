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

            <div className="bg-white/40 backdrop-blur-3xl p-0 rounded-[3rem] border border-white/50 shadow-xl overflow-hidden group h-full min-h-[300px] relative">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115538.74900010904!2d55.38541995818318!3d25.1834947!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f6170560a5815%3A0x67340051e5e9b38!2sAl%20Aweer%20-%20Dubai!5e0!3m2!1sen!2sae!4v1712850000000!5m2!1sen!2sae" 
                className="w-full h-full border-0 absolute inset-0" 
                allowFullScreen={true}
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute bottom-6 left-6 z-10 pointer-events-none">
                 <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border border-white/20">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#9a0c52]">Our Sanctuary</span>
                    <p className="text-xs font-bold text-black mt-0.5">Al Aweer, Dubai, UAE</p>
                 </div>
              </div>
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
                        <svg 
                          width="24" 
                          height="24" 
                          viewBox="0 0 24 24" 
                          fill="currentColor" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.558 0 11.894-5.335 11.897-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        Or Chat on WhatsApp
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
