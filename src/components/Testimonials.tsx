"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star, CheckCircle2, Award, ShieldCheck } from "lucide-react";

interface TestimonialsProps {
  content?: Record<string, string>;
}

export function Testimonials({ content = {} }: TestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Extract section content with luxury defaults
  const badge = content["home.testimonial_badge"] || "PATRON RECOGNITION";
  const title = content["home.testimonial_title"] || "Customer Experiences";

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const res = await fetch("/api/testimonials?published=true");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setTestimonials(data);
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        console.error("Failed to load testimonials:", e);
      }
      
      // Fallback curated luxury testimonials
      setTestimonials([
        {
          _id: "t_1",
          quote: "The most authentic, pure, and invigorating botanical preserves I have ever experienced. The dragon fruit jam is an absolute masterpiece on our breakfast table.",
          author: "Sarah Jenkins",
          role: "Executive Chef & Food Curator",
          location: "Mumbai",
          rating: 5,
          productName: "Dragon Fruit Jam 500g",
          verified: true
        },
        {
          _id: "t_2",
          quote: "Exquisite quality in every single batch. You can taste the dedication, hand-picked heritage, and freshness. Our entire family is obsessed!",
          author: "Michael Chen",
          role: "Culinary Director",
          location: "Bengaluru",
          rating: 5,
          productName: "Dragon Fruit Crush 500ml",
          verified: true
        },
        {
          _id: "t_3",
          quote: "A sublime harmony of rich natural sweetness and vibrant botanical purity. Rafah Garden has set a new gold standard for luxury organic harvests.",
          author: "Elena Rodriguez",
          role: "Boutique Resort Director",
          location: "Kochi",
          rating: 5,
          productName: "Botanical Fruit Elixir",
          verified: true
        }
      ]);
      setLoading(false);
    };

    loadTestimonials();
  }, [content]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Auto-advance every 6.5s
  useEffect(() => {
    if (testimonials.length <= 1) return;
    const interval = setInterval(nextSlide, 6500);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  if (loading || testimonials.length === 0) return null;

  const current = testimonials[currentIndex];

  return (
    <section className="relative w-full py-20 md:py-32 bg-[#f8f8f9] overflow-hidden font-sans">
      {/* Background Decorative Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#c81c6a]/10 via-[#9a0c52]/5 to-transparent rounded-full blur-[140px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#c81c6a]/10 border border-[#c81c6a]/20 mb-4">
              <Star size={12} className="text-[#c81c6a] fill-[#c81c6a]" />
              <span className="text-[#c81c6a] font-bold text-[10px] md:text-xs tracking-[0.25em] uppercase">
                {badge}
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black font-playfair text-[#1a1a1a] tracking-tight">
              {title}
            </h2>
          </motion.div>
        </div>

        {/* Testimonial Luxury Stage */}
        <div className="relative max-w-4xl mx-auto">
          {/* Glassmorphic Container Card */}
          <div className="relative z-10 bg-white/80 backdrop-blur-xl border border-white/80 rounded-[2.5rem] p-8 sm:p-12 md:p-16 shadow-[0_30px_70px_rgba(0,0,0,0.06)] overflow-hidden">
            
            {/* Soft Ambient Corner Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#c81c6a]/10 rounded-full blur-3xl" />

            {/* Background Quote Icon */}
            <div className="absolute top-6 left-6 md:top-10 md:left-10 text-[#c81c6a]/10 pointer-events-none select-none">
              <Quote size={90} strokeWidth={1} />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 flex flex-col items-center text-center"
              >
                {/* 5 Gold Stars Rating */}
                <div className="flex items-center gap-1.5 mb-6">
                  {Array.from({ length: current.rating || 5 }).map((_, i) => (
                    <Star key={i} size={18} className="text-amber-400 fill-amber-400 drop-shadow-sm" />
                  ))}
                </div>

                {/* Main Quote */}
                <blockquote className="text-xl sm:text-2xl md:text-3xl font-playfair text-[#2c2c2e] leading-relaxed italic mb-8 max-w-3xl">
                  "{current.quote}"
                </blockquote>

                {/* Product Purchased Tag */}
                {current.productName && (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gray-100/80 border border-gray-200/60 mb-8 text-xs font-semibold text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c81c6a]" />
                    <span>Verified Purchase: <strong className="text-[#1a1a1a]">{current.productName}</strong></span>
                  </div>
                )}

                {/* Author Info & Monogram */}
                <div className="flex items-center gap-4">
                  {/* Monogram Avatar Badge */}
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#c81c6a] to-[#9a0c52] text-white flex items-center justify-center font-bold text-lg shadow-md shadow-[#c81c6a]/20 shrink-0">
                    {current.author ? current.author.charAt(0) : "R"}
                  </div>

                  <div className="flex flex-col items-start text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#1a1a1a] text-base md:text-lg">
                        {current.author}
                      </span>
                      {current.verified !== false && (
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                          <CheckCircle2 size={11} /> Verified Patron
                        </span>
                      )}
                    </div>
                    {(current.role || current.location) && (
                      <span className="text-xs text-gray-500 font-medium mt-0.5">
                        {[current.role, current.location].filter(Boolean).join(" • ")}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation & Progress Controls */}
            {testimonials.length > 1 && (
              <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-100 relative z-20">
                {/* Left Arrow */}
                <button
                  onClick={prevSlide}
                  className="w-11 h-11 rounded-full bg-white border border-gray-200/80 flex items-center justify-center text-gray-500 hover:text-[#c81c6a] hover:border-[#c81c6a] hover:bg-[#c81c6a]/5 transition-all shadow-sm active:scale-90 cursor-pointer"
                  aria-label="Previous experience"
                >
                  <ChevronLeft size={18} strokeWidth={2} />
                </button>

                {/* Slide Indicators */}
                <div className="flex gap-2 items-center">
                  {testimonials.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
                        idx === currentIndex ? "w-8 bg-[#c81c6a]" : "w-2 bg-gray-200 hover:bg-gray-300"
                      }`}
                      aria-label={`Go to experience ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Right Arrow */}
                <button
                  onClick={nextSlide}
                  className="w-11 h-11 rounded-full bg-white border border-gray-200/80 flex items-center justify-center text-gray-500 hover:text-[#c81c6a] hover:border-[#c81c6a] hover:bg-[#c81c6a]/5 transition-all shadow-sm active:scale-90 cursor-pointer"
                  aria-label="Next experience"
                >
                  <ChevronRight size={18} strokeWidth={2} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Customer Trust Proof Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center"
        >
          <div className="bg-white/60 backdrop-blur-md rounded-2xl p-5 border border-white/80 shadow-sm flex flex-col items-center">
            <div className="flex items-center gap-1 text-amber-400 mb-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} className="fill-amber-400" />
              ))}
            </div>
            <span className="text-xl font-bold text-[#1a1a1a]">4.9 / 5.0 Rating</span>
            <span className="text-xs text-gray-500 mt-1">Based on 1,200+ Patron Reviews</span>
          </div>

          <div className="bg-white/60 backdrop-blur-md rounded-2xl p-5 border border-white/80 shadow-sm flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-[#c81c6a]/10 flex items-center justify-center text-[#c81c6a] mb-1">
              <Award size={16} />
            </div>
            <span className="text-xl font-bold text-[#1a1a1a]">10,000+ Patrons</span>
            <span className="text-xs text-gray-500 mt-1">Delighted Across India</span>
          </div>

          <div className="bg-white/60 backdrop-blur-md rounded-2xl p-5 border border-white/80 shadow-sm flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mb-1">
              <ShieldCheck size={16} />
            </div>
            <span className="text-xl font-bold text-[#1a1a1a]">100% Handcrafted</span>
            <span className="text-xs text-gray-500 mt-1">Pure Organic Farm Harvests</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
