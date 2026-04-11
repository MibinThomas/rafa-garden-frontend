"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const JOURNEY_STEPS = [
  {
    title: "The Harvest",
    subtitle: "Heritage Soil. Peak Ripeness.",
    description: "Every journey begins at the source. Our dragon fruits are hand-plucked from mature heritage cacti in the heart of our sanctuary, precisely when the sun-kissed skin reaches its most vibrant hue.",
    image: "/images/journey/harvest.png",
    color: "#f97316" // Orange/Golden accent
  },
  {
    title: "The Craft",
    subtitle: "Cold-Pressed Alchemy.",
    description: "Integrity is our obsession. We use small-batch artisanal crushing and cold-pressing techniques to ensure every botanical nutrient and vivid pigment is preserved in its purest, most potent form.",
    image: "/images/journey/craft.png",
    color: "#c81c6a" // Signature Pink
  },
  {
    title: "The Heritage",
    subtitle: "Crafted for Connoisseurs.",
    description: "Finalized in our architectural boutique, each bottle is a masterpiece of botanical luxury. From our sanctuary to your table, experience the pinnacle of Dragon Fruit Crush.",
    image: "/images/journey/shop.png",
    color: "#1e293b" // Slate/Dark accent
  }
];

export function JourneySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  return (
    <section ref={containerRef} className="relative bg-[#0b1612] py-32 md:py-48 overflow-hidden">

      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#c81c6a] rounded-full blur-[150px] mix-blend-screen" />
        <div className="absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-green-900 rounded-full blur-[180px] mix-blend-screen" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">

        {/* Section Header */}
        <div className="mb-24 md:mb-32 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[10px] sm:text-xs font-black uppercase tracking-[0.5em] text-[#c81c6a] mb-4 block"
          >
            The Botanical Sequence
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black font-playfair text-white tracking-tighter leading-none"
          >
            Journey from <span className="italic">Soil to Soul.</span>
          </h2 >
        </div>

        {/* Journey Steps */}
        <div className="flex flex-col gap-32 md:gap-64">
          {JOURNEY_STEPS.map((step, index) => {
            const isEven = index % 2 === 0;
            return (
              <div key={index} className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 md:gap-24`}>

                {/* Image Section with Parallax */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, scale: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
                  className="relative w-full md:w-1/2 aspect-[4/5] rounded-[2rem] md:rounded-[4rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)] border border-white/5"
                >
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Step Number Overlay */}
                  <div className="absolute top-8 left-8 md:top-12 md:left-12">
                    <span className="text-[10vw] md:text-[8vw] font-black text-white/10 leading-none select-none">
                      0{index + 1}
                    </span>
                  </div>
                </motion.div>

                {/* Text Section */}
                <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <h3
                      className="text-sm font-bold uppercase tracking-[0.3em] mb-4"
                      style={{ color: step.color }}
                    >
                      {step.subtitle}
                    </h3>
                    <h2 className="text-4xl md:text-6xl font-black font-playfair text-white mb-8 tracking-tight">
                      {step.title}
                    </h2>
                    <p className="text-lg md:text-xl text-white/60 font-inter font-light leading-relaxed max-w-md">
                      {step.description}
                    </p>

                    {/* Visual Line Decor */}
                    <div className="mt-12 h-px w-24 md:w-32 bg-gradient-to-r from-white/20 to-transparent" />
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Final CTA Area */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-48 text-center"
        >
          <div className="inline-block p-1 rounded-full bg-gradient-to-r from-[#c81c6a] to-orange-500 mb-8">
            <div className="bg-[#0b1612] px-10 py-4 rounded-full">
              <span className="text-white font-bold tracking-widest text-[10px] uppercase">Experience the Legacy</span>
            </div>
          </div>
          <h2 className="text-5xl md:text-8xl font-black font-playfair text-white tracking-tighter mb-12">
            Shop the <span className="italic">Botanical</span> Collection.
          </h2>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-12 py-5 rounded-2xl bg-white text-black font-bold tracking-[0.2em] uppercase text-xs hover:bg-[#c81c6a] hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-2xl"
          >
            Discover Now
          </button>
        </motion.div>

      </div>
    </section>
  );
}
