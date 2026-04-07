"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useHeaderColor } from "@/lib/HeaderColorContext";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { setIsImmersive, setHeaderColor, headerColor } = useHeaderColor();
  const activeColor = headerColor;

  useEffect(() => {
    setIsImmersive(false); // Make header normal
  }, [setIsImmersive]);

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#f1f1f2] font-sans">
      
      {/* Mobile Back Button (Desktop uses nav) */}
      <Link href="/" className="md:hidden absolute top-6 left-6 z-50 text-[#0b2b1a] flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
        <ArrowLeft size={16} /> Home
      </Link>

      {/* Left Side: Cinematic Presentation (Hidden on Mobile) */}
      <div className="hidden md:flex w-[45%] lg:w-1/2 relative bg-[#0b2b1a] flex-col justify-between p-16 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0 opacity-40">
           <motion.div 
             animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
             transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
             className="absolute -top-[20%] -left-[20%] w-[150%] h-[150%] rounded-full blur-[80px]"
             style={{ background: `radial-gradient(circle, ${activeColor}55 0%, transparent 70%)` }}
           />
        </div>

        {/* Floating Image Component */}
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none p-12">
            <motion.div 
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 1, delay: 0.2 }}
               className="relative w-full h-[80%] max-h-[800px]"
            >
                <Image
                  src="/images/hero/plants_premium.png"
                  alt="Lush Greenery"
                  fill
                  className="object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.5)] opacity-80"
                  priority
                />
            </motion.div>
        </div>

        <div className="relative z-20 mt-auto">
          <h2 className="text-4xl lg:text-6xl font-black font-playfair text-white leading-tight mb-4 tracking-tight drop-shadow-md">
            Cultivate your <br/><span className="italic font-light" style={{ color: activeColor }}>premium lifestyle.</span>
          </h2>
          <p className="text-white/70 font-inter max-w-sm leading-relaxed">
             Join the Rafah Garden family today to manage your orders, save your favorite collections, and embrace nature.
          </p>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="w-full md:w-[55%] lg:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24 pt-24 md:pt-16 min-h-screen md:min-h-0 relative">
        
        {/* Subtle Decorative Background on Right Side */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
             <div 
               className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 opacity-20" 
               style={{ background: activeColor }}
             />
             <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-[#0b2b1a]/5 blur-[100px] translate-y-1/2 -translate-x-1/3" />
        </div>

        <div className="w-full max-w-md relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : "signup"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/60 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] border border-white shadow-[0_20px_60px_rgba(0,0,0,0.05)]"
            >
              
              <div className="mb-10">
                <h1 className="text-3xl font-black font-playfair text-[#0b2b1a] mb-2">
                  {isLogin ? "Welcome Back" : "Create Account"}
                </h1>
                <p className="text-gray-500 font-inter text-sm">
                  {isLogin 
                    ? "Enter your details to access your premium account." 
                    : "Embrace nature. Sign up to get started."}
                </p>
              </div>

              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                
                {!isLogin && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-2">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="John Doe" 
                      className="w-full px-5 py-4 rounded-xl bg-white/50 border border-black/5 focus:bg-white outline-none transition-all placeholder:text-gray-300 font-medium text-[#0b2b1a]" 
                      style={{ caretColor: activeColor }}
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-2">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="hello@example.com" 
                    className="w-full px-5 py-4 rounded-xl bg-white/50 border border-black/5 focus:border-brand-pink/50 focus:bg-white outline-none transition-all placeholder:text-gray-300 font-medium text-[#0b2b1a]" 
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-end ml-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Password</label>
                    {isLogin && <a href="#" className="text-[10px] uppercase font-bold tracking-widest hover:underline" style={{ color: activeColor }}>Forgot?</a>}
                  </div>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    className="w-full px-5 py-4 rounded-xl bg-white/50 border border-black/5 focus:bg-white outline-none transition-all placeholder:text-gray-300 font-medium text-[#0b2b1a]" 
                    style={{ caretColor: activeColor }}
                  />
                </div>

                <button 
                  className="w-full py-4 mt-4 text-white font-black tracking-widest uppercase text-sm rounded-xl transition-all shadow-lg active:scale-[0.98]"
                  style={{ backgroundColor: activeColor }}
                >
                  {isLogin ? "Sign In" : "Register"}
                </button>
              </form>

              <div className="mt-8 text-center border-t border-black/5 pt-6">
                <p className="text-sm text-gray-500 font-medium">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                  <button 
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-[#0b2b1a] font-bold hover:text-brand-pink underline transition-colors"
                  >
                    {isLogin ? "Create one" : "Sign in"}
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
