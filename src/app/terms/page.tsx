"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useHeaderColor } from "@/lib/HeaderColorContext";

export default function TermsPage() {
  const { setIsImmersive, setHeaderColor } = useHeaderColor();

  useEffect(() => {
    // Light theme match for static pages
    setIsImmersive(false);
    setHeaderColor("#333333");
  }, [setIsImmersive, setHeaderColor]);

  const sections = [
    {
      id: "01",
      title: "Agreement to Terms",
      content:
        "By accessing and using the Rafah Garden storefront and digital ecosystem, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not accept any portion of these terms, please refrain from browsing or purchasing from our sanctuary.",
    },
    {
      id: "02",
      title: "Use of Our Site",
      content:
        "All products offered on the site, including our Dragon Fruit harvests, plants, and premium line of curated items, are intended for personal consumption and non-commercial use. Users must be at least 18 years old or browsing with the consent of a guardian.",
    },
    {
      id: "03",
      title: "Intellectual Property Rights",
      content:
        "All visual branding, logos, graphics, text, and imagery on this site are the sole and exclusive property of Rafah Garden and its creative collective. No component of this ecosystem may be duplicated, modified, or reproduced without our express written consent.",
    },
    {
      id: "04",
      title: "Shipping & Heritage Deliveries",
      content:
        "Due to the perishable and natural quality of our fresh harvests and plants, shipping estimates are provided upon checkout. While we take the utmost care to preserve the freshness and integrity of our produce, we are not liable for delayed transit or external handling factors once dispatched.",
    },
    {
      id: "05",
      title: "Modifications & Governing Law",
      content:
        "We reserve the right to revise or modify these Terms and Conditions at any time. Any changes will be published immediately to this page. These terms are governed by and construed in accordance with the laws of the United Arab Emirates.",
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#f1f1f2] text-[#4a4b4d] font-sans selection:bg-[#c81c6a] selection:text-white pb-32">
      
      {/* Top Banner / Hero Section */}
      <section className="relative pt-[120px] md:pt-[160px] w-full max-w-[1700px] mx-auto px-6 md:px-12 flex flex-col mb-[60px] z-10 overflow-hidden">
        
        <div className="w-full flex flex-col md:flex-row justify-between relative z-30 gap-8 shrink-0">
          
          {/* Left Large Heading */}
          <div className="w-full md:w-[50%] flex flex-col items-start justify-start z-20">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-[60px] flex items-center mb-2"
            >
              <h3 className="text-[32px] md:text-[45px] font-bold font-brand-heading text-[#b3b4b6] leading-none tracking-tight">
                Our Legal
              </h3>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
              className="text-[clamp(80px,11vw,140px)] leading-[0.82] font-black font-brand-heading text-[#b3b4b6] tracking-tight select-none"
              style={{ fontFamily: "'DharmaGothic', sans-serif" }}
            >
              Terms &<br />Conditions.
            </motion.h1>
          </div>

          {/* Right Description Text */}
          <div className="w-full md:w-[50%] flex flex-col items-start justify-end z-20 pb-4">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="text-[#737478] text-sm md:text-base max-w-[600px] leading-[1.8] font-normal tracking-tight"
            >
              Please read these terms carefully. They describe the permissions and guidelines governing your interaction with the Rafah Garden storefront, products, and services. Last updated: May 2026.
            </motion.p>
          </div>

        </div>
      </section>

      {/* Main Content Area: Elegant Grid & Modern Typography */}
      <section className="relative w-full max-w-[1700px] mx-auto px-6 md:px-12 z-20 mt-12 md:mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
          {sections.map((sec, index) => (
            <motion.div
              key={sec.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              className="flex flex-col group border-t border-[#bcbbbd]/30 pt-8"
            >
              {/* Card Title and Section Digit */}
              <div className="flex items-start justify-between mb-4">
                <span className="text-[#c81c6a] font-mono text-sm tracking-widest font-semibold bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full border border-pink-100/50 shadow-[inset_0_1px_1px_rgba(200,28,106,0.05)]">
                  {sec.id}
                </span>
              </div>
              
              <h3 className="text-[28px] md:text-[34px] font-bold text-[#333333] mb-4 tracking-tight leading-tight transition-all duration-300 group-hover:text-[#c81c6a]">
                {sec.title}
              </h3>
              
              <p className="text-[#5d5f61] text-sm md:text-[15px] leading-[1.8] font-normal text-justify tracking-normal max-w-[680px]">
                {sec.content}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
}
