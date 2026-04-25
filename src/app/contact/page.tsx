"use client";

import { useState, useRef } from "react";
import { Send, Phone, CheckCircle2 } from "lucide-react";
import { useSiteSettings } from "@/lib/SiteSettingsContext";
import { AnimatePresence, motion, useAnimation, useMotionValue, useTransform } from "framer-motion";

const SwipeToCallButton = ({ phoneNumber }: { phoneNumber: string }) => {
  const [isSwiped, setIsSwiped] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const x = useMotionValue(0);
  
  const handleDragEnd = async (event: any, info: any) => {
    const containerWidth = containerRef.current?.offsetWidth || 240;
    const threshold = containerWidth * 0.55; 

    if (info.offset.x > threshold) {
      setIsSwiped(true);
      await controls.start({ x: containerWidth - 56 });
      window.location.href = `tel:${phoneNumber}`;
      setTimeout(() => {
        setIsSwiped(false);
        controls.start({ x: 0 });
      }, 3000);
    } else {
      controls.start({ x: 0 });
    }
  };

  // The fill width depends on the current x position of the knob.
  const fillWidth = useTransform(x, (value) => `calc(${value}px + 56px)`);
  // Text color transitions to white as the pink background covers it
  const textColor = useTransform(x, [0, 100], ["#a3a3a3", "#ffffff"]);

  return (
    <div ref={containerRef} className="w-full lg:flex-1 h-14 bg-[#e5e5e5] rounded-full flex items-center overflow-hidden border border-[#ffffff]/20 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] relative group shrink-0">
       {/* Expanding Pink Background Fill */}
       <motion.div 
         style={{ width: fillWidth }}
         className="absolute left-0 top-0 bottom-0 bg-[#c81c6a] rounded-full z-0"
       />

       {/* Text */}
       <div className="absolute inset-0 flex items-center justify-center pointer-events-none pl-6 pr-4 z-10">
         <motion.span 
           style={{ color: isSwiped ? "#ffffff" : textColor }}
           className="text-[16px] font-light transition-opacity duration-300 select-none drop-shadow-sm"
         >
           {isSwiped ? "Calling..." : "Swipe to speak...."}
         </motion.span>
       </div>

       {/* Draggable Knob */}
       <motion.div 
         drag="x"
         dragConstraints={containerRef}
         dragElastic={0.05}
         onDragEnd={handleDragEnd}
         animate={controls}
         style={{ x }}
         className="w-14 h-14 rounded-full bg-[#c81c6a] flex items-center justify-center text-white shadow-md cursor-grab active:cursor-grabbing absolute left-0 z-20"
       >
         <Phone size={20} strokeWidth={1.5} />
       </motion.div>
    </div>
  );
};


export default function ContactPage() {
  const { settings } = useSiteSettings();
  const [formState, setFormState] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("submitting");

    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setFormState("success");
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      console.error("Contact form error:", error);
      alert("Something went wrong. Please try again or reach out on WhatsApp.");
      setFormState("idle");
    }
  };

  return (
    <div className="min-h-screen bg-[#e6e7e8] text-[#1b1c1c] selection:bg-[#c81c6a] selection:text-white overflow-x-hidden" style={{ fontFamily: "inherit" }}>
      
      {/* Top Section */}
      <main className="max-w-[1440px] mx-auto px-6 md:px-12 pt-32 md:pt-40 pb-20 md:pb-32 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Left Column: Typography */}
          <div className="flex flex-col justify-start">
            <span className="text-[14px] md:text-[16px] text-[#a3a3a3] font-medium mb-4">
              Connect with us
            </span>
            <h1 
              className="text-[140px] md:text-[200px] leading-[0.8] tracking-tight text-[#b5b5b5] select-none uppercase mb-8" 
              style={{ fontFamily: "'DharmaGothic', sans-serif", fontWeight: 700 }}
            >
              Get in<br />Touch.
            </h1>
            <p className="text-[14px] md:text-[15px] text-[#a3a3a3] max-w-[380px] font-medium leading-relaxed mt-4">
              Whether you have a query about our heritage harvests or wish to visit our sanctuaries, we are here to guide you.
            </p>
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
                  <h2 className="text-[32px] md:text-[40px] font-light text-[#555555] mb-2">Send a Message.</h2>
                  <p className="text-[14px] text-[#888888] mb-12">Leave your details and our collective will reach out shortly.</p>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                      <div className="relative group">
                        <label className="text-[13px] font-medium text-[#888888] mb-1 block">Full Name</label>
                        <input 
                          required
                          name="name"
                          type="text" 
                          placeholder="Name..." 
                          className="w-full bg-transparent border-b border-[#cccccc] py-2 focus:border-[#a3a3a3] focus:outline-none transition-all text-[14px] text-[#555555] placeholder-[#c0c0c0]"
                        />
                      </div>
                      <div className="relative group">
                        <label className="text-[13px] font-medium text-[#888888] mb-1 block">Email Address</label>
                        <input 
                          required
                          name="email"
                          type="email" 
                          placeholder="Email..." 
                          className="w-full bg-transparent border-b border-[#cccccc] py-2 focus:border-[#a3a3a3] focus:outline-none transition-all text-[14px] text-[#555555] placeholder-[#c0c0c0]"
                        />
                      </div>
                    </div>

                    <div className="relative group pt-4">
                      <label className="text-[18px] md:text-[22px] font-medium text-[#757575] mb-4 block">Your Vision or Query</label>
                      <textarea 
                        required
                        name="message"
                        rows={5}
                        placeholder="Share your thoughts about..." 
                        className="w-full bg-transparent border border-[#cccccc] rounded-[24px] p-6 focus:border-[#a3a3a3] focus:outline-none transition-all text-[14px] text-[#555555] placeholder-[#c0c0c0] resize-none"
                      />
                    </div>

                    <div className="flex flex-col lg:flex-row items-center gap-6 pt-6 w-full">
                      <button 
                        type="submit"
                        disabled={formState === "submitting"}
                        className="w-full lg:flex-1 h-14 rounded-full bg-[#c81c6a] text-white font-medium text-[16px] hover:bg-[#a8195a] transition-colors flex items-center justify-between px-8 disabled:opacity-50 shrink-0"
                      >
                        <span className="mx-auto">{formState === "submitting" ? "Sending..." : "Submit Inquiry"}</span> 
                        <Send size={20} strokeWidth={1.5} className="-rotate-12 shrink-0" />
                      </button>

                      <SwipeToCallButton phoneNumber={settings["global.contact_phone"]} />
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
                  <div className="w-20 h-20 bg-[#c81c6a] rounded-full flex items-center justify-center text-white mb-8 shadow-lg">
                    <CheckCircle2 size={40} strokeWidth={1.5} />
                  </div>
                  <h2 className="text-[32px] font-light text-[#555555] mb-2">Message Sent.</h2>
                  <p className="text-[14px] text-[#888888] mb-8 max-w-sm">Thank you for connecting. Our collective will reach out shortly.</p>
                  <button 
                    onClick={() => setFormState("idle")}
                    className="text-[13px] font-medium text-[#c81c6a] hover:underline"
                  >
                    Send another message
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </main>

      {/* Full-width Map Section */}
      <section className="w-[100vw] relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] h-[500px] border-t border-b border-[#cccccc] overflow-hidden">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115538.74900010904!2d55.38541995818318!3d25.1834947!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f6170560a5815%3A0x67340051e5e9b38!2sAl%20Aweer%20-%20Dubai!5e0!3m2!1sen!2sae!4v1712850000000!5m2!1sen!2sae" 
          className="w-full h-full border-0 absolute inset-0 opacity-90 mix-blend-multiply filter contrast-75 sepia-[.2] hue-rotate-[320deg]" 
          allowFullScreen={true}
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>

    </div>
  );
}
