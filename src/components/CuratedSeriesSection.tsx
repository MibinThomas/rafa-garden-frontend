"use client";

import { motion } from "framer-motion";

interface CuratedSeriesSectionProps {
  categoryTitle: string;
}

export function CuratedSeriesSection({ categoryTitle }: CuratedSeriesSectionProps) {
  return (
    <section className="w-full bg-[#f1f1f2] pt-24 pb-2 px-6 md:px-12 lg:px-24 relative">
      <div className="max-w-[1600px] mx-auto flex flex-col items-start">
        {/* Curated Selection Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 px-3 py-1 rounded-md border border-[#333333]/15 inline-flex items-center justify-center bg-[#f1f1f2]/50 backdrop-blur-sm"
        >
          <span className="text-[0.65rem] md:text-[0.7rem] font-bold uppercase tracking-[0.15em] text-[#666c75] font-avant-garde">
            Curated Selection
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h2
          key={categoryTitle} // Trigger re-animation when title changes
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[38px] md:text-[64px] lg:text-[72px] font-bold tracking-tight leading-[1.1] font-brand-heading"
          style={{ color: 'rgb(111, 112, 116)' }}
        >
          Explore <span style={{ color: 'rgb(111, 112, 116)' }}>{categoryTitle}</span> Series.
        </motion.h2>
      </div>
    </section>
  );
}
