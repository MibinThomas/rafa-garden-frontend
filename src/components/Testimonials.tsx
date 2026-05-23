"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

interface TestimonialsProps {
  content?: Record<string, string>;
}

export function Testimonials({ content = {} }: TestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Extract testimonials from content map
  const badge = content["home.testimonial_badge"] || "What They Say";
  const title = content["home.testimonial_title"] || "Customer Experiences";

  const testimonials = Array.from({ length: 3 }).map((_, i) => {
    const slideNumber = i + 1;
    return {
      id: `testimonial_${slideNumber}`,
      quote: content[`home.testimonial_${slideNumber}_quote`] || "",
      author: content[`home.testimonial_${slideNumber}_author`] || "",
      role: content[`home.testimonial_${slideNumber}_role`] || "",
    };
  }).filter(t => t.quote !== ""); // Only show testimonials that have a quote

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Auto-advance
  useEffect(() => {
    if (testimonials.length <= 1) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  if (testimonials.length === 0) return null;

  return (
    <section className="relative w-full py-24 md:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#c81c6a] font-bold text-xs tracking-[0.2em] uppercase mb-4 block">
              {badge}
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black font-playfair text-[#5d5f61] tracking-tight">
              {title}
            </h2>
          </motion.div>
        </div>

        {/* Carousel */}
        <div className="relative max-w-4xl mx-auto">
          {/* Large Quote Decoration */}
          <div className="absolute -top-12 -left-4 md:-left-12 text-gray-100/50 z-0 select-none">
            <Quote size={120} strokeWidth={1} />
          </div>

          <div className="relative z-10 min-h-[250px] md:min-h-[200px] flex items-center justify-center text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.05, filter: "blur(4px)" }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-full px-8 md:px-16"
              >
                <p className="text-xl md:text-3xl font-playfair text-[#5d5f61] leading-relaxed italic mb-10">
                  "{testimonials[currentIndex].quote}"
                </p>
                <div className="flex flex-col items-center justify-center gap-1">
                  <span className="font-bold text-[#5d5f61] tracking-wide text-lg">
                    {testimonials[currentIndex].author}
                  </span>
                  {testimonials[currentIndex].role && (
                    <span className="text-[#c81c6a] font-semibold text-xs tracking-widest uppercase">
                      {testimonials[currentIndex].role}
                    </span>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          {testimonials.length > 1 && (
            <div className="flex items-center justify-center gap-6 mt-16">
              <button
                onClick={prevSlide}
                className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#c81c6a] hover:border-[#c81c6a] hover:bg-[#c81c6a]/5 transition-all"
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={20} strokeWidth={1.5} />
              </button>
              
              {/* Indicators */}
              <div className="flex gap-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-500 ${
                      idx === currentIndex ? "w-8 bg-[#c81c6a]" : "w-2 bg-gray-200 hover:bg-gray-300"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#c81c6a] hover:border-[#c81c6a] hover:bg-[#c81c6a]/5 transition-all"
                aria-label="Next testimonial"
              >
                <ChevronRight size={20} strokeWidth={1.5} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
