"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { useHeaderColor } from "@/lib/HeaderColorContext";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formState, setFormState] = useState<"idle" | "submitting" | "success">("idle");
  const { setIsImmersive, setHeaderColor } = useHeaderColor();

  useEffect(() => {
    setIsImmersive(false);
    setHeaderColor("#1b1c1c");
  }, [setIsImmersive, setHeaderColor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("submitting");
    // Simulate submission
    setTimeout(() => {
      setFormState("success");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f1f1f2] text-[#1b1c1c] selection:bg-[#c81c6a] selection:text-white overflow-x-hidden" style={{ fontFamily: "inherit" }}>
      
      {/* Mobile Back Button */}
      <Link href="/" className="md:hidden absolute top-6 left-6 z-50 text-[#5d5f61] flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm">
        <ArrowLeft size={14} /> Back
      </Link>

      <main className="max-w-[1440px] mx-auto px-6 md:px-12 pt-32 md:pt-40 pb-20 md:pb-32 relative min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 w-full">
          
          {/* Left Column: Typography */}
          <div className="flex flex-col justify-start">
            <span className="text-[14px] md:text-[16px] text-[#a3a3a3] font-medium mb-4">
              Authentication
            </span>
            <AnimatePresence mode="wait">
              <motion.h1 
                key={isLogin ? "login" : "register"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-[140px] md:text-[200px] leading-[0.8] tracking-tight text-[#b5b5b5] select-none mb-8" 
                style={{ fontFamily: "'DharmaGothic', sans-serif", fontWeight: 700 }}
              >
                {isLogin ? (
                  <>Sign<br />In.</>
                ) : (
                  <>Join<br />Us.</>
                )}
              </motion.h1>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.p 
                key={isLogin ? "login-desc" : "register-desc"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-[14px] md:text-[15px] text-[#a3a3a3] max-w-[380px] font-medium leading-relaxed mt-4"
              >
                {isLogin 
                  ? "Return to your botanical journey. Your personalized Rafah Garden collection awaits." 
                  : "Become part of our legacy. Experience the true essence of botanical luxury and care."}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Right Column: Form */}
          <div className="flex flex-col justify-center pt-8 lg:pt-0 lg:pl-10">
            <AnimatePresence mode="wait">
              {formState !== "success" ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h2 className="text-[32px] md:text-[40px] font-light text-[#555555] mb-2">
                    {isLogin ? "Welcome Back." : "New Heritage."}
                  </h2>
                  <p className="text-[14px] text-[#888888] mb-12">
                    {isLogin 
                      ? "Enter your credentials to continue." 
                      : "Create an account to start your collection."}
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    <AnimatePresence>
                      {!isLogin && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="relative group overflow-hidden"
                        >
                          <label className="text-[13px] font-medium text-[#888888] mb-1 block">Full Name</label>
                          <input 
                            name="name"
                            type="text" 
                            placeholder="e.g. Alexander Garden" 
                            className="w-full bg-transparent border-b border-[#cccccc] py-2 focus:border-[#a3a3a3] focus:outline-none transition-all text-[14px] text-[#555555] placeholder-[#c0c0c0]"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="relative group">
                      <label className="text-[13px] font-medium text-[#888888] mb-1 block">Email Address</label>
                      <input 
                        required
                        name="email"
                        type="email" 
                        placeholder="your@email.com" 
                        className="w-full bg-transparent border-b border-[#cccccc] py-2 focus:border-[#a3a3a3] focus:outline-none transition-all text-[14px] text-[#555555] placeholder-[#c0c0c0]"
                      />
                    </div>

                    <div className="relative group">
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[13px] font-medium text-[#888888] block">Password</label>
                        {isLogin && <a href="#" className="text-[11px] font-medium text-[#c81c6a] hover:underline">Forgot?</a>}
                      </div>
                      <input 
                        required
                        name="password"
                        type="password" 
                        placeholder="••••••••" 
                        className="w-full bg-transparent border-b border-[#cccccc] py-2 focus:border-[#a3a3a3] focus:outline-none transition-all text-[14px] text-[#555555] placeholder-[#c0c0c0]"
                      />
                    </div>

                    <div className="flex flex-col items-center gap-6 pt-6 w-full">
                      <button 
                        type="submit"
                        disabled={formState === "submitting"}
                        className="w-full h-14 rounded-full bg-[#c81c6a] text-white font-medium text-[16px] hover:bg-[#a8195a] transition-colors flex items-center justify-between px-8 disabled:opacity-50 shrink-0 shadow-md"
                      >
                        <span className="mx-auto">{formState === "submitting" ? "Authenticating..." : (isLogin ? "Sign In" : "Create Account")}</span> 
                        <ArrowRight size={20} strokeWidth={1.5} className="shrink-0" />
                      </button>
                    </div>
                  </form>

                  <div className="mt-8 text-center">
                    <p className="text-[13px] text-[#888888]">
                      {isLogin ? "Don't have an account?" : "Already part of our legacy?"}{" "}
                      <button 
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        className="font-medium text-[#c81c6a] hover:underline"
                      >
                        {isLogin ? "Create one" : "Sign in"}
                      </button>
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-20 text-center"
                >
                  <div className="w-20 h-20 bg-[#c81c6a] rounded-full flex items-center justify-center text-white mb-8 shadow-lg">
                    <CheckCircle2 size={40} strokeWidth={1.5} />
                  </div>
                  <h2 className="text-[32px] font-light text-[#555555] mb-2">Authenticated.</h2>
                  <p className="text-[14px] text-[#888888] mb-8 max-w-sm">Welcome to your personalized Rafah Garden experience.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </main>
    </div>
  );
}
