"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [formState, setFormState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });

      if (res.ok) {
        setFormState("success");
        setTimeout(() => {
          router.push("/admin");
          router.refresh();
        }, 1200);
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Invalid credentials. Please try again.");
        setFormState("error");
      }
    } catch {
      setErrorMsg("Connection error. Please try again.");
      setFormState("error");
    }
  };

  const isSubmitting = formState === "submitting";

  return (
    <div
      className="min-h-screen bg-[#f1f1f2] text-[#1b1c1c] selection:bg-[#c81c6a] selection:text-white overflow-x-hidden"
      style={{ fontFamily: "AvantGarde, sans-serif" }}
    >
      <main className="max-w-[1440px] mx-auto px-6 md:px-12 pt-28 md:pt-36 pb-20 md:pb-32 relative min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 w-full">

          {/* Left Column: Giant Typography */}
          <div className="flex flex-col justify-start">
            <span className="text-[14px] md:text-[16px] text-[#a3a3a3] font-medium mb-4 tracking-wide uppercase">
              Admin Access
            </span>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-[120px] md:text-[180px] leading-[0.82] tracking-tight text-[#b5b5b5] select-none mb-8"
              style={{ fontFamily: "'DharmaGothic', sans-serif", fontWeight: 700 }}
            >
              Admin<br />Panel.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-[14px] md:text-[15px] text-[#a3a3a3] max-w-[380px] font-medium leading-relaxed mt-2"
            >
              Sign in to manage your Rafa Garden content, products, inventory, and homepage — all from one place.
            </motion.p>

            {/* Decorative accent line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10 h-px w-24 origin-left"
              style={{ background: 'linear-gradient(to right, #c81c6a, transparent)' }}
            />
          </div>

          {/* Right Column: Form */}
          <div className="flex flex-col justify-center pt-8 lg:pt-0 lg:pl-10">
            <AnimatePresence mode="wait">
              {formState !== "success" ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <h2 className="text-[32px] md:text-[40px] font-light text-[#555555] mb-2">
                    Welcome Back.
                  </h2>
                  <p className="text-[14px] text-[#888888] mb-12">
                    Enter your admin credentials to continue.
                  </p>

                  <form onSubmit={handleLogin} className="space-y-8">
                    {/* Email */}
                    <div className="relative group">
                      <label className="text-[13px] font-medium text-[#888888] mb-1 block">
                        Email Address
                      </label>
                      <input
                        required
                        type="email"
                        value={email}
                        onChange={e => { setEmail(e.target.value); if (formState === 'error') setFormState('idle'); }}
                        placeholder="admin@rafagarden.com"
                        className="w-full bg-transparent border-b border-[#cccccc] py-2 focus:border-[#c81c6a] focus:outline-none transition-all duration-300 text-[14px] text-[#555555] placeholder-[#c0c0c0]"
                      />
                      <span className="absolute bottom-0 left-0 w-0 h-px bg-[#c81c6a] transition-all duration-300 group-focus-within:w-full" />
                    </div>

                    {/* Password */}
                    <div className="relative group">
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[13px] font-medium text-[#888888] block">
                          Password
                        </label>
                      </div>
                      <div className="relative">
                        <input
                          required
                          type={showPass ? "text" : "password"}
                          value={password}
                          onChange={e => { setPassword(e.target.value); if (formState === 'error') setFormState('idle'); }}
                          placeholder="••••••••"
                          className="w-full bg-transparent border-b border-[#cccccc] py-2 pr-8 focus:border-[#c81c6a] focus:outline-none transition-all duration-300 text-[14px] text-[#555555] placeholder-[#c0c0c0]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass(!showPass)}
                          className="absolute right-0 top-1/2 -translate-y-1/2 text-[#c0c0c0] hover:text-[#888888] transition-colors"
                        >
                          {showPass ? <EyeOff size={15} strokeWidth={1.5} /> : <Eye size={15} strokeWidth={1.5} />}
                        </button>
                      </div>
                      <span className="absolute bottom-0 left-0 w-0 h-px bg-[#c81c6a] transition-all duration-300 group-focus-within:w-full" />
                    </div>

                    {/* Error */}
                    <AnimatePresence>
                      {formState === "error" && errorMsg && (
                        <motion.p
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-[13px] text-[#c81c6a] font-medium -mt-2"
                        >
                          {errorMsg}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    {/* Submit Button — matches customer style */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-14 rounded-full bg-[#c81c6a] text-white font-medium text-[16px] hover:bg-[#a8195a] active:scale-[0.98] transition-all duration-200 flex items-center justify-between px-8 disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-[#c81c6a]/20"
                      >
                        <span className="mx-auto">
                          {isSubmitting ? "Authenticating..." : "Sign In to Dashboard"}
                        </span>
                        <ArrowRight size={20} strokeWidth={1.5} className="flex-shrink-0" />
                      </button>
                    </div>
                  </form>

                  <div className="mt-10 pt-8 border-t border-[#e0e0e0]">
                    <p className="text-[12px] text-[#b0b0b0] text-center">
                      Rafa Garden Admin · Secure Access Only
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center justify-center py-20 text-center"
                >
                  <div className="w-20 h-20 bg-[#c81c6a] rounded-full flex items-center justify-center text-white mb-8 shadow-lg shadow-[#c81c6a]/30">
                    <CheckCircle2 size={40} strokeWidth={1.5} />
                  </div>
                  <h2 className="text-[32px] font-light text-[#555555] mb-2">Authenticated.</h2>
                  <p className="text-[14px] text-[#888888] mb-2">
                    Welcome back. Redirecting to dashboard…
                  </p>
                  <div className="flex gap-1 mt-4">
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 bg-[#c81c6a] rounded-full"
                        animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1, delay: i * 0.15, repeat: Infinity }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
