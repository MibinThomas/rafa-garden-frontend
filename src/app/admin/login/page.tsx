"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useHeaderColor } from "@/lib/HeaderColorContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { setIsImmersive, setHeaderColor } = useHeaderColor();

  useEffect(() => {
    setIsImmersive(false);
    setHeaderColor("#1b1c1c");
  }, [setIsImmersive, setHeaderColor]);

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
        // Successful login
        setTimeout(() => {
          router.push("/admin");
        }, 800); // give time for success animation if we wanted one
      } else {
        const data = await res.json();
        setError(data.error || "Authentication failed. Access denied.");
        setLoading(false);
      }
    } catch (err) {
      setError("A connection error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f1f2] text-[#1b1c1c] selection:bg-[#c81c6a] selection:text-white overflow-x-hidden" style={{ fontFamily: "inherit" }}>
      
      <main className="max-w-[1440px] mx-auto px-6 md:px-12 pt-32 md:pt-40 pb-20 md:pb-32 relative min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 w-full">
          
          {/* Left Column: Typography */}
          <div className="flex flex-col justify-start">
            <span className="text-[14px] md:text-[16px] text-[#a3a3a3] font-medium mb-4">
              Brand Sanctuary
            </span>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-[140px] md:text-[200px] leading-[0.8] tracking-tight text-[#b5b5b5] select-none mb-8" 
              style={{ fontFamily: "'DharmaGothic', sans-serif", fontWeight: 700 }}
            >
              Admin<br />Vault.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-[14px] md:text-[15px] text-[#a3a3a3] max-w-[380px] font-medium leading-relaxed mt-4"
            >
              Access the master repository. Secure authentication is required to modify sanctuary data.
            </motion.p>
          </div>

          {/* Right Column: Form */}
          <div className="flex flex-col justify-center pt-8 lg:pt-0 lg:pl-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-[32px] md:text-[40px] font-light text-[#555555] mb-2">
                Establish Connection.
              </h2>
              <p className="text-[14px] text-[#888888] mb-12">
                Provide your official repository credentials.
              </p>

              <form onSubmit={handleLogin} className="space-y-8">
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-red-50 text-red-500 p-4 rounded-[16px] text-[13px] font-medium border border-red-100 flex items-center gap-3"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative group">
                  <label className="text-[13px] font-medium text-[#888888] mb-1 block">Official Repository Email</label>
                  <input 
                    required
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@rafahgarden.com" 
                    className="w-full bg-transparent border-b border-[#cccccc] py-2 focus:border-[#a3a3a3] focus:outline-none transition-all text-[14px] text-[#555555] placeholder-[#c0c0c0]"
                  />
                </div>

                <div className="relative group">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[13px] font-medium text-[#888888] block">Master Encryption Key</label>
                  </div>
                  <input 
                    required
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full bg-transparent border-b border-[#cccccc] py-2 focus:border-[#a3a3a3] focus:outline-none transition-all text-[14px] text-[#555555] placeholder-[#c0c0c0]"
                  />
                </div>

                <div className="flex flex-col items-center gap-6 pt-6 w-full">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 rounded-full bg-[#c81c6a] text-white font-medium text-[16px] hover:bg-[#a8195a] transition-colors flex items-center justify-between px-8 disabled:opacity-50 shrink-0 shadow-md"
                  >
                    <span className="mx-auto">{loading ? "Decrypting..." : "Authenticate"}</span> 
                    {loading ? (
                       <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                    ) : (
                       <ArrowRight size={20} strokeWidth={1.5} className="shrink-0" />
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-12 text-center">
                 <div className="flex items-center justify-center gap-3 text-[#a3a3a3]">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Sanctuary Security Protocol v4.0</span>
                 </div>
              </div>
            </motion.div>
          </div>

        </div>
      </main>
    </div>
  );
}
