"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SLIDES = [
    {
        title: "ROOHAFZA",
        subtitle: "SOUL REFRESHER",
        description: "The iconic herbal cooling syrup, crafted from a natural blend of fruits, herbs, and floral extracts for the ultimate summer refreshment."
    },
    {
        title: "THE FRUIT",
        subtitle: "VIBRANT & EXOTIC",
        description: "Rich in antioxidants and glowing with vibrant magenta skin, hand-pollinated and sun-ripened."
    },
    {
        title: "THE HARVEST",
        subtitle: "PURE REFRESHMENT",
        description: "The crisp, speckled white flesh, ready to be cold-pressed into our signature zero-gravity refreshment."
    }
];

export function FloatingHero() {
    const [slide, setSlide] = useState(0);

    const nextSlide = () => setSlide((prev) => (prev + 1) % SLIDES.length);
    const prevSlide = () => setSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

    return (
        <section className="relative w-full min-h-screen md:h-screen bg-white dark:bg-obsidian transition-colors duration-300 text-foreground flex items-center justify-center">

            {/* Global Container for layout max width constraints */}
            <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row relative h-full">

                {/* 3D Visual Spacer Slot - Top Half on Mobile, Right Half on Desktop & Mobile Slider Controls */}
                <div id="hero-visual-slot" className="relative w-full h-[50vh] md:h-auto md:absolute md:top-24 md:bottom-32 md:right-0 md:w-1/2 z-0 flex flex-col items-center justify-center pointer-events-none">

                    {/* Mobile-only Slider Controls placed directly at the bottom of the visual canvas */}
                    <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-4 md:hidden pointer-events-auto z-20">
                        <button onClick={prevSlide} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/30 dark:bg-black/40 backdrop-blur-md border border-[#C5A880]/50 text-[#C5A880] active:scale-90 shadow-sm">
                            <ArrowLeft size={18} />
                        </button>
                        <div className="flex gap-2 bg-white/20 dark:bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-sm">
                            {SLIDES.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSlide(i)}
                                    className={`transition-all duration-300 rounded-full ${slide === i ? "w-6 h-1.5 bg-[#C5A880] shadow-[0_0_5px_#C5A880]" : "w-1.5 h-1.5 bg-[#2C4C3B]/40 dark:bg-white/30"}`}
                                    aria-label={`Go to slide ${i + 1}`}
                                />
                            ))}
                        </div>
                        <button onClick={nextSlide} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/30 dark:bg-black/40 backdrop-blur-md border border-[#C5A880]/50 text-[#C5A880] active:scale-90 shadow-sm">
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>

                {/* Content Container - Bottom Half on Mobile, Left Half on Desktop */}
                <div className="relative z-10 w-full md:w-1/2 flex-1 flex flex-col items-center md:items-start justify-center px-6 md:px-12 py-8 md:py-0 text-center md:text-left h-full pointer-events-none mt-4 md:mt-0 pb-16 md:pb-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={slide}
                            initial={{ opacity: 0, x: -20, filter: "blur(4px)" }}
                            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, x: 20, filter: "blur(4px)" }}
                            transition={{ duration: 0.4 }}
                            className="flex flex-col items-center md:items-start w-full"
                        >
                            <h2 className="text-xs md:text-sm font-bold tracking-[0.3em] uppercase text-[#2C4C3B] dark:text-gray-200 bg-gray-100 dark:bg-black/40 md:bg-white/40 backdrop-blur-md px-4 py-1.5 md:px-6 md:py-2 rounded-full mb-4 md:mb-6 border border-[#C5A880]/50 shadow-sm md:shadow-lg inline-block text-center md:text-left">
                                {SLIDES[slide].subtitle}
                            </h2>

                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] font-black uppercase tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-r from-[#C5A880] via-[#2C4C3B] to-[#C96A82] drop-shadow-[0_2px_10px_rgba(201,106,130,0.2)] dark:drop-shadow-[0_0_20px_rgba(44,76,59,0.5)] py-2">
                                {SLIDES[slide].title}
                            </h1>

                            <p className="mt-5 md:mt-8 text-sm md:text-lg font-serif tracking-wide w-full max-w-[90%] md:max-w-xl text-gray-800 dark:text-[#fffdd0] bg-gray-50/80 dark:bg-black/60 md:bg-white/60 backdrop-blur-xl px-5 py-4 md:px-8 md:py-6 rounded-2xl md:rounded-3xl border border-black/5 dark:border-white/10 shadow-sm md:shadow-[0_10px_40px_rgba(0,0,0,0.1)] mx-auto md:mx-0">
                                {SLIDES[slide].description}
                            </p>
                        </motion.div>
                    </AnimatePresence>

                    {/* Explore Button */}
                    <button className="mt-8 md:mt-10 px-8 py-3.5 md:py-4 pointer-events-auto bg-[#2C4C3B] border border-[#C5A880] text-[#C5A880] text-sm md:text-base font-bold tracking-widest rounded-full hover:bg-[#C5A880] hover:text-[#0A0A0A] active:scale-95 md:hover:scale-105 transition-all shadow-[0_4px_30px_rgba(197,168,128,0.4)] dark:shadow-[0_0_30px_rgba(197,168,128,0.2)]">
                        EXPLORE THE GARDEN
                    </button>
                </div>

                {/* Desktop-only Slider Controls anchored properly within max-width container */}
                <div className="hidden md:flex absolute inset-y-0 right-0 w-1/2 flex-col justify-end items-center pb-12 z-20 pointer-events-none">
                    <div className="flex items-center gap-6 mt-auto pointer-events-auto">
                        <button onClick={prevSlide} className="w-12 h-12 flex items-center justify-center rounded-full bg-white/30 dark:bg-black/40 backdrop-blur-md border border-[#C5A880]/50 text-[#C5A880] hover:bg-[#C5A880] hover:text-[#0A0A0A] transition-all shadow-lg active:scale-90">
                            <ArrowLeft size={24} />
                        </button>

                        <div className="flex gap-3 bg-white/20 dark:bg-black/20 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 shadow-md">
                            {SLIDES.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSlide(i)}
                                    className={`transition-all duration-300 rounded-full ${slide === i ? "w-8 h-2.5 bg-[#C5A880] shadow-[0_0_10px_#C5A880]" : "w-2.5 h-2.5 bg-[#2C4C3B]/40 dark:bg-white/30 hover:bg-[#C5A880]/60"}`}
                                    aria-label={`Go to slide ${i + 1}`}
                                />
                            ))}
                        </div>

                        <button onClick={nextSlide} className="w-12 h-12 flex items-center justify-center rounded-full bg-white/30 dark:bg-black/40 backdrop-blur-md border border-[#C5A880]/50 text-[#C5A880] hover:bg-[#C5A880] hover:text-[#0A0A0A] transition-all shadow-lg active:scale-90">
                            <ArrowRight size={24} />
                        </button>
                    </div>
                </div>

            </div>

            {/* 3D Canvas Injection Event happens inside app/page.tsx so it overlays both sections */}
            {/* But we will emit a custom dispatch event to tell the global canvas what slide we are on! */}
            <GlobalSlideNotifier slide={slide} />
        </section>
    );
}

// Small helper to inform global 3D Canvas in layout of current active slide
function GlobalSlideNotifier({ slide }: { slide: number }) {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent('updateHeroSlide', { detail: slide }));
    }
    return null;
}
