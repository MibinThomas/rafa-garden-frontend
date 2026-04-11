"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, User, Mail, Lock, CheckCircle2 } from "lucide-react";
import { useHeaderColor } from "@/lib/HeaderColorContext";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { setIsImmersive, setHeaderColor, headerColor } = useHeaderColor();
  const activeColor = headerColor || "#c81c6a";

  useEffect(() => {
    setIsImmersive(false);
    setHeaderColor("#0b2b1a"); // Deep forest green for auth context
  }, [setIsImmersive, setHeaderColor]);

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#f1f1f2] font-sans overflow-hidden">
      
      {/* Mobile Back Button */}
      <Link href="/" className="md:hidden absolute top-6 left-6 z-50 text-[#0b2b1a] flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm">
        <ArrowLeft size={14} /> Back
      </Link>

      {/* Left Side: Cinematic Presentation Area */}
      <div className="hidden md:flex w-[45%] lg:w-[40%] relative bg-[#0b2b1a] flex-col justify-between p-12 lg:p-20 overflow-hidden">
        {/* Dynamic Background Texture */}
        <div className="absolute inset-0 z-0">
           <div className="absolute inset-0 bg-[url('/images/hero/plants_premium.png')] bg-cover bg-center opacity-10 mix-blend-overlay grayscale" />
           <motion.div 
             animate={{ 
               scale: [1, 1.2, 1],
               opacity: [0.2, 0.4, 0.2]
             }}
             transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
             className="absolute -top-[10%] -left-[10%] w-[120%] h-[120%] rounded-full blur-[120px]"
             style={{ background: `radial-gradient(circle, ${activeColor} 0%, transparent 60%)` }}
           />
           <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        </div>

        {/* Brand Logo or Indicator */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-20"
        >
          <Link href="/" className="group flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-white group-hover:text-[#0b2b1a] transition-all">
                <ArrowLeft size={18} />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">Rafah Garden</span>
          </Link>
        </motion.div>

        {/* Floating Hero Product Graphic */}
        <div className="absolute inset-0 z-10 flex items-center justify-center p-12">
           <AnimatePresence mode="wait">
              <motion.div 
                key={isLogin ? "login-img" : "reg-img"}
                initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="relative w-full h-full max-h-[500px]"
              >
                  <Image
                    src={isLogin ? "/images/hero/crush_bottle.png" : "/images/hero/plants_premium.png"}
                    alt="Heritage Asset"
                    fill
                    className="object-contain drop-shadow-[0_40px_100px_rgba(0,0,0,0.6)]"
                    priority
                  />
              </motion.div>
           </AnimatePresence>
        </div>

        {/* Content Reveal */}
        <div className="relative z-20 mt-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login-txt" : "reg-txt"}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.5, ease: "circOut" }}
            >
              <h2 className="text-5xl lg:text-7xl font-black font-playfair text-white leading-[0.9] mb-6 tracking-tight">
                {isLogin ? "Access the" : "Join the"} <br/>
                <span className="italic font-light opacity-60">Heritage.</span>
              </h2>
              <p className="text-white/50 font-inter text-sm lg:text-base max-w-sm leading-relaxed font-light">
                 {isLogin 
                   ? "Return to your botanical journey. Your personalized Rafah Garden collection awaits." 
                   : "Become part of our legacy. Experience the true essence of botanical luxury and care."}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Right Side: Interactive Auth Form */}
      <div className="w-full md:w-[55%] lg:w-[60%] flex items-center justify-center px-6 py-20 lg:p-24 min-h-screen relative overflow-y-auto">
        
        {/* Abstract Background Blur on Form Side */}
        <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
             <div 
               className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[140px] -translate-y-1/2 translate-x-1/4" 
               style={{ background: activeColor }}
             />
             <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#0b2b1a]/10 blur-[100px]" />
        </div>

        <div className="w-full max-w-lg relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login-form" : "reg-form"}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -10 }}
              transition={{ duration: 0.4 }}
              className="bg-white/40 backdrop-blur-3xl p-8 lg:p-14 rounded-[3rem] border border-white/60 shadow-[0_40px_100px_rgba(0,0,0,0.03)]"
            >
              
              <div className="mb-12">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-4 block">Authentication</span>
                <h1 className="text-5xl font-black font-playfair text-[#0b2b1a] mb-4 tracking-tighter">
                  {isLogin ? "Welcome Back" : "New Heritage"}
                </h1>
                <p className="text-gray-500 font-inter text-sm font-medium opacity-70">
                  {isLogin 
                    ? "Manage your premium garden and orders with ease." 
                    : "Create an account to start your premium botanical collection."}
                </p>
              </div>

              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                
                {!isLogin && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-2"
                  >
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#0b2b1a] ml-4 opacity-40">Full Name</label>
                    <div className="relative group">
                       <User className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#0b2b1a] transition-colors" size={18} />
                       <input 
                         type="text" 
                         placeholder="e.g. Alexander Garden" 
                         className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white border border-gray-100 focus:border-gray-300 outline-none transition-all shadow-sm font-bold text-[#0b2b1a] placeholder:text-gray-200 placeholder:font-normal" 
                       />
                    </div>
                  </motion.div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#0b2b1a] ml-4 opacity-40">Email Identity</label>
                  <div className="relative group">
                     <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#0b2b1a] transition-colors" size={18} />
                     <input 
                       type="email" 
                       placeholder="your@email.com" 
                       className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white border border-gray-100 focus:border-gray-300 outline-none transition-all shadow-sm font-bold text-[#0b2b1a] placeholder:text-gray-200 placeholder:font-normal" 
                     />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-end mr-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#0b2b1a] ml-4 opacity-40">Security Key</label>
                    {isLogin && <a href="#" className="text-[9px] uppercase font-black tracking-widest text-gray-400 hover:text-[#0b2b1a] transition-colors">Recover?</a>}
                  </div>
                  <div className="relative group">
                     <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#0b2b1a] transition-colors" size={18} />
                     <input 
                       type="password" 
                       placeholder="••••••••" 
                       className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white border border-gray-100 focus:border-gray-300 outline-none transition-all shadow-sm font-bold text-[#0b2b1a] placeholder:text-gray-200 placeholder:font-normal" 
                     />
                  </div>
                </div>

                <button 
                  className="w-full py-6 mt-6 text-white font-black tracking-[0.3em] uppercase text-xs rounded-2xl transition-all shadow-2xl active:scale-[0.98] flex items-center justify-center gap-4 hover:brightness-110"
                  style={{ backgroundColor: "#0b2b1a" }}
                >
                  {isLogin ? "Sign In" : "Register"}
                  <CheckCircle2 size={18} className="opacity-40" />
                </button>
              </form>

              <div className="mt-12 text-center pt-8 border-t border-gray-100/50">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                  {isLogin ? "Member status: Not found" : "Member status: Existing"}{" "}
                  <button 
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-[#0b2b1a] ml-2 underline underline-offset-4 decoration-2 decoration-brand-pink/30 hover:decoration-brand-pink transition-all"
                  >
                    {isLogin ? "Apply Now" : "Sign In"}
                  </button>
                </p>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
