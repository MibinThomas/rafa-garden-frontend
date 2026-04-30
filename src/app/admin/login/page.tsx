"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, ArrowRight, ShieldCheck, Leaf } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        // Success animation could go here
        router.push("/admin");
      } else {
        const data = await res.json();
        setError(data.error || "Authentication failed. Access denied.");
      }
    } catch (err) {
      setError("A connection error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0b2b1a] flex items-center justify-center p-6 selection:bg-[#c81c6a] selection:text-white">
      {/* Immersive Botanical Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Animated Bokeh / Spores */}
        {mounted && [...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              opacity: 0, 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%",
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{ 
              opacity: [0, 0.2, 0],
              y: ["-10%", "110%"],
              x: ["-5%", "5%"]
            }}
            transition={{ 
              duration: Math.random() * 20 + 20, 
              repeat: Infinity, 
              delay: Math.random() * 20,
              ease: "linear"
            }}
            className="absolute w-2 h-2 bg-white rounded-full blur-[2px]"
          />
        ))}

        {/* Brand Watermark Detail */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.03, scale: 1 }}
          transition={{ duration: 2 }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] flex items-center justify-center pointer-events-none"
        >
          <Leaf size={800} strokeWidth={0.5} className="text-white rotate-12" />
        </motion.div>
      </div>

      <div className="relative z-10 w-full max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] as const }}
          className="bg-white/95 backdrop-blur-2xl rounded-[3rem] p-10 md:p-16 shadow-[0_50px_100px_rgba(0,0,0,0.4)] border border-white/20"
        >
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="mb-10 inline-block"
            >
              <Image 
                src="/images/logo/Rafah logo.webp" 
                alt="Rafah Garden" 
                width={200} 
                height={60} 
                className="h-10 w-auto object-contain brightness-0"
              />
            </motion.div>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-[#c81c6a] font-black text-[10px] uppercase tracking-[0.6em] mb-4"
            >
              Brand Sanctuary
            </motion.p>
            <h1 className="text-5xl font-black font-playfair text-[#0b2b1a] tracking-tighter leading-none">
              The <span className="italic font-normal">Vault</span>
            </h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-50/50 backdrop-blur-md text-red-500 p-6 rounded-3xl text-[9px] font-black uppercase tracking-[0.3em] text-center border border-red-100 mb-6 flex items-center justify-center gap-3"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-6">
              <div className="relative group">
                <Mail className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#c81c6a] transition-all duration-500" size={18} strokeWidth={1.5} />
                <input
                  type="email"
                  placeholder="Official Repository Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-20 pr-10 py-7 bg-gray-50/50 rounded-3xl outline-none text-sm font-bold text-[#0b2b1a] placeholder:text-gray-200 transition-all duration-500 border border-transparent focus:border-[#c81c6a]/10 focus:bg-white shadow-sm"
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#c81c6a] transition-all duration-500" size={18} strokeWidth={1.5} />
                <input
                  type="password"
                  placeholder="Master Encryption Key"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-20 pr-10 py-7 bg-gray-50/50 rounded-3xl outline-none text-sm font-bold text-[#0b2b1a] placeholder:text-gray-200 transition-all duration-500 border border-transparent focus:border-[#c81c6a]/10 focus:bg-white shadow-sm"
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full py-8 bg-[#0b2b1a] text-white rounded-3xl font-black text-[10px] uppercase tracking-[0.4em] flex items-center justify-center gap-6 shadow-2xl shadow-[#0b2b1a]/20 hover:bg-[#c81c6a] active:scale-[0.98] transition-all duration-700 disabled:opacity-50 overflow-hidden relative group/btn"
            >
              {loading ? (
                <div className="flex items-center gap-4">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Decrypting...</span>
                </div>
              ) : (
                <>
                  <span className="relative z-10">Establish Connection</span>
                  <ArrowRight size={18} className="relative z-10 group-hover/btn:translate-x-2 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                </>
              )}
            </button>
          </form>

          <div className="mt-16 flex flex-col items-center justify-center gap-4">
             <div className="flex items-center gap-3 text-gray-300">
                <ShieldCheck size={16} className="text-[#c81c6a]" />
                <span className="text-[9px] font-black uppercase tracking-[0.3em]">Sanctuary Security Protocol v4.0</span>
             </div>
             <div className="w-8 h-[1px] bg-gray-100 rounded-full" />
          </div>
        </motion.div>

        {/* Decorative elements outside the card */}
        <motion.div 
          animate={{ 
            rotate: [0, 360],
          }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute -top-12 -right-12 w-24 h-24 border border-white/5 rounded-full pointer-events-none"
        />
        <motion.div 
          animate={{ 
            rotate: [360, 0],
          }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-8 -left-8 w-16 h-16 border border-white/10 rounded-full pointer-events-none flex items-center justify-center"
        >
           <div className="w-1 h-1 bg-white/20 rounded-full" />
        </motion.div>
      </div>
    </div>
  );
}
