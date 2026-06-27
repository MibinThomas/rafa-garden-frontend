"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useHeaderColor } from "@/lib/HeaderColorContext";

export default function AboutPage() {
  const { setIsImmersive, setHeaderColor } = useHeaderColor();
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch("/api/content?group=about");
        const data = await res.json();
        const contentMap = data.reduce((acc: any, item: any) => {
          acc[item.key] = item.value;
          return acc;
        }, {});
        setContent(contentMap);
      } catch (error) {
        console.error("Failed to fetch about content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
    setIsImmersive(false);
    setHeaderColor("#333333");
  }, [setIsImmersive, setHeaderColor]);

  const get = (key: string, fallback: string) => content[key] || fallback;

  return (
    <div className="relative min-h-screen bg-[#f1f1f2] font-sans selection:bg-[#c81c6a] selection:text-white pb-16 md:pb-32">

      {/* ── 1. HERO ── */}
      <section className="relative pt-10 md:pt-[50px] w-full max-w-[1700px] mx-auto px-4 sm:px-6 md:px-12 flex flex-col mb-10 md:mb-[115px] z-10 overflow-hidden">
        <div className="w-full flex flex-col md:flex-row justify-between relative z-30 gap-6 lg:gap-24">

          {/* Left — Title */}
          <div className="w-full md:w-[40%] flex flex-col items-start justify-start z-20 pl-0 sm:pl-4 md:pl-[30px]">
            <div className="h-auto md:h-[80px] flex items-center mb-3 md:mb-8">
              <h3 className="text-3xl sm:text-4xl md:text-[50px] font-bold font-brand-heading text-[#b3b4b6] leading-none tracking-tight">
                {get("about.hero_subtitle", "About us.")}
              </h3>
            </div>
            <h1
              className="font-black font-brand-heading text-[#b3b4b6] tracking-tight leading-[0.82]"
              style={{ fontSize: "clamp(52px, 10vw, 136px)" }}
            >
              {get("about.hero_title", "Rafah Garden.")}
            </h1>
          </div>

          {/* Right — Logo + Description */}
          <div className="w-full md:w-[60%] flex flex-col items-start justify-start z-20 pr-0 sm:pr-4 md:pr-[60px]">
            <div className="h-auto md:h-[80px] flex items-center mb-3 md:mb-8">
              <div className="relative w-[140px] h-[48px] sm:w-[180px] sm:h-[60px] md:w-[216px] md:h-[72px]">
                <Image
                  src={get("about.hero_logo", "/images/logo/Rafah logo.webp")}
                  alt="Rafah Garden Logo"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
            </div>
            <p className="text-[#a0a0a0] lg:text-[#666666] text-sm md:text-base leading-[1.8] md:leading-[2] font-normal text-left md:text-justify tracking-tight [word-spacing:-1px] w-full max-w-[800px]">
              {get("about.hero_description", "Rafah Garden believes that true health and happiness begin with nature's sweetness.")}
            </p>
          </div>
        </div>
      </section>

      {/* ── 1.5 DRAGON FRUIT COMPOSITION ── */}
      <section className="relative w-full max-w-[1700px] mx-auto px-4 sm:px-6 md:px-12 h-[50vh] sm:h-[60vh] md:h-[70vh] min-h-[320px] md:min-h-[500px] flex items-center justify-center my-4 md:my-10 z-30">

        {/* Background design */}
        <div className="absolute inset-x-0 top-0 h-[80%] flex items-center justify-center pointer-events-none z-0">
          <div className="relative w-[180px] h-[220px] sm:w-[260px] sm:h-[300px] md:w-[450px] md:h-[500px] flex flex-col items-center pt-10">
            <Image
              src={get("about.design_background", "/images/about/Dragon fruit line curved.webp")}
              alt="Dragon Fruit Design"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Side Labels */}
        <div className="absolute left-2 sm:left-4 md:left-[10%] top-[30%] flex flex-col gap-1 items-start z-30">
          <span className="text-sm sm:text-lg md:text-3xl font-bold font-brand-heading text-[#b3b4b6] leading-none whitespace-pre-line">
            {get("about.section_1_5_label_jam", "Dragon\nFruit Jam")}
          </span>
        </div>
        <div className="absolute left-2 sm:left-4 md:left-[10%] bottom-[20%] flex flex-col gap-1 items-start z-30">
          <span className="text-sm sm:text-lg md:text-3xl font-bold font-brand-heading text-[#b3b4b6] leading-none whitespace-pre-line">
            {get("about.section_1_5_label_plant", "Dragon\nFruit Plant")}
          </span>
        </div>
        <div className="absolute right-2 sm:right-4 md:right-[10%] top-[30%] bottom-[20%] flex flex-col justify-between items-start z-30">
          <span className="text-sm sm:text-lg md:text-3xl font-bold font-brand-heading text-[#b3b4b6] leading-none text-left whitespace-pre-line">
            {get("about.section_1_5_label_crush", "Dragon\nFruit Crush")}
          </span>
          <span className="text-sm sm:text-lg md:text-3xl font-bold font-brand-heading text-[#b3b4b6] leading-none text-left whitespace-pre-line">
            {get("about.section_1_5_label_fruit", "Dragon\nFruit Fruit")}
          </span>
        </div>

        {/* Floating pitayas */}
        <motion.div animate={{ y: [-20, 20, -20] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] right-[25%] w-[50px] h-[50px] sm:w-[80px] sm:h-[80px] md:w-[120px] md:h-[120px] rotate-[15deg] blur-sm opacity-90 z-10">
          <Image src={get("about.floating_pitaya_1", "/images/hero/floatingpitaya.png")} alt="floating" fill className="object-contain" />
        </motion.div>
        <motion.div animate={{ y: [-15, 15, -15] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[20%] right-[30%] w-[40px] h-[40px] sm:w-[60px] sm:h-[60px] md:w-[90px] md:h-[90px] -rotate-[30deg] blur-[2px] opacity-90 z-10">
          <Image src={get("about.floating_pitaya_2", "/images/hero/floatingpitaya.png")} alt="floating" fill className="object-contain" />
        </motion.div>
        <motion.div animate={{ y: [-25, 25, -25] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[25%] left-[25%] w-[45px] h-[45px] sm:w-[70px] sm:h-[70px] md:w-[100px] md:h-[100px] -rotate-[10deg] blur-md opacity-80 z-10">
          <Image src={get("about.floating_pitaya_3", "/images/hero/floatingpitaya.png")} alt="floating" fill className="object-contain" />
        </motion.div>
        <motion.div animate={{ y: [-15, 15, -15] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute bottom-[25%] left-[30%] w-[50px] h-[50px] sm:w-[80px] sm:h-[80px] md:w-[110px] md:h-[110px] rotate-[45deg] blur-sm opacity-90 z-10">
          <Image src={get("about.floating_pitaya_4", "/images/hero/floatingpitaya.png")} alt="floating" fill className="object-contain" />
        </motion.div>

        {/* Center Main Image */}
        <div className="absolute z-20 w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] md:w-[700px] md:h-[700px] -bottom-[140px] sm:-bottom-[190px] md:-bottom-[350px] left-1/2 -translate-x-1/2 shrink-0 pointer-events-none">
          <Image src={get("about.center_composition", "/images/about/Dragon fruit png.webp")} alt="Fresh Dragon Fruits" fill className="object-contain drop-shadow-[0_40px_50px_rgba(0,0,0,0.25)]" priority />
        </div>
      </section>

      {/* ── 2. PRODUCTS SHOWCASE ── */}
      <section className="relative w-full z-20 mt-20 sm:mt-28 md:mt-40">

        {/* Top solid band */}
        <div className="w-full bg-[#dadbdd] pt-12 md:pt-20 pb-8 md:pb-10">
          <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 md:px-12">
            <div className="w-full flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6 md:gap-12">
              <div className="flex flex-col shrink-0">
                <h2 className="font-dharma-gothic font-black text-[#7a7a7a] leading-[0.9] tracking-tight"
                  style={{ fontSize: "clamp(3rem, 10vw, 11rem)" }}>
                  {get("about.products_heading_1", "Dragon Fruit.")}
                </h2>
                <h2 className="font-dharma-gothic font-black text-[#7a7a7a] leading-[0.9] tracking-tight"
                  style={{ fontSize: "clamp(3rem, 10vw, 11rem)" }}>
                  {get("about.products_heading_2", "Products")}
                </h2>
              </div>
              <div className="w-full xl:max-w-[500px] pb-0 md:pb-4">
                <p className="text-[#888888] text-sm md:text-base leading-relaxed text-left md:text-justify tracking-tight [word-spacing:-1px]">
                  {get("about.products_description", "What began as a small family initiative has blossomed into a thriving agricultural enterprise.")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Product full image */}
        <div className="relative w-full bg-[#f1f1f2] min-h-[260px] sm:min-h-[380px] md:min-h-[520px]">
          <div className="relative z-20 w-full lg:w-[45%] px-4 sm:px-6 md:px-12 py-8 md:py-16">
            <p className="text-[#7a7a7a] text-sm md:text-base leading-relaxed text-left tracking-tight [word-spacing:-1px]">
              {get("about.narrative_paragraph", "Rafah Garden is more than just a farm.")}
            </p>
          </div>
          <div className="absolute -top-[10%] sm:-top-[15%] md:-top-[20%] left-0 right-0 bottom-0 flex items-start justify-center z-30 pointer-events-none">
            <div className="relative w-[95%] sm:w-[85%] md:w-[75%] lg:w-[65%] h-full md:translate-x-[50px] scale-[1.1] sm:scale-[1.2] md:scale-[1.25]">
              <Image
                src={get("about.products_full_image", "/images/about/All Products.webp")}
                alt="All Dragon Fruit Products"
                fill
                className="object-contain object-center drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. PRODUCT LINES GRID ── */}
      <div className="w-full bg-[#f1f1f2]">
        <section className="relative w-full max-w-[1400px] mx-auto px-4 sm:px-6 pt-16 sm:pt-28 md:pt-40 pb-16 md:pb-32 z-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-20 sm:gap-y-28 md:gap-y-32 gap-x-6 md:gap-x-12 lg:gap-x-20 place-items-center">

            {/* Crush */}
            <div className="relative flex items-center justify-end w-full max-w-[500px] h-[90px] sm:h-[100px] group cursor-pointer mt-8 sm:mt-0">
              <div className="w-[80%] h-[70px] sm:h-[75px] border border-[#c1c1c1] rounded-2xl flex items-center pl-20 sm:pl-24 lg:pl-28 pr-4 sm:pr-6 bg-transparent transition-colors duration-300 group-hover:bg-white/40">
                <span className="text-[#888888] font-light text-xl sm:text-2xl mr-3 sm:mr-4">+</span>
                <span className="text-[#7a7a7a] font-light text-base sm:text-xl lg:text-[22px] tracking-wide">{get("about.grid_item_1_label", "Dragon Fruit Crush")}</span>
              </div>
              <div className="absolute left-[-10px] sm:left-[-20px] bottom-[-20px] w-[130px] h-[200px] sm:w-[180px] sm:h-[280px] pointer-events-none z-10 transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-2">
                <Image src={get("about.grid_item_1_image", "/images/hero/crush_bottle.png")} alt="Dragon Fruit Crush" fill className="object-contain object-bottom drop-shadow-[0_15px_25px_rgba(0,0,0,0.15)]" />
              </div>
            </div>

            {/* Jam */}
            <div className="relative flex items-center justify-end w-full max-w-[500px] h-[90px] sm:h-[100px] group cursor-pointer mt-8 sm:mt-0">
              <div className="w-[80%] h-[70px] sm:h-[75px] border border-[#c1c1c1] rounded-2xl flex items-center pl-20 sm:pl-24 lg:pl-28 pr-4 sm:pr-6 bg-transparent transition-colors duration-300 group-hover:bg-white/40">
                <span className="text-[#888888] font-light text-xl sm:text-2xl mr-3 sm:mr-4">+</span>
                <span className="text-[#7a7a7a] font-light text-base sm:text-xl lg:text-[22px] tracking-wide">{get("about.grid_item_2_label", "Dragon Fruit Jam")}</span>
              </div>
              <div className="absolute left-[0px] sm:left-[10px] bottom-[-10px] w-[160px] h-[190px] sm:w-[224px] sm:h-[256px] pointer-events-none z-10 transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-2">
                <Image src={get("about.grid_item_2_image", "/images/hero/jam_premium.png")} alt="Dragon Fruit Jam" fill className="object-contain object-bottom drop-shadow-[0_15px_25px_rgba(0,0,0,0.15)]" />
              </div>
            </div>

            {/* Fruit */}
            <div className="relative flex items-center justify-end w-full max-w-[500px] h-[90px] sm:h-[100px] group cursor-pointer mt-8 sm:mt-0">
              <div className="w-[80%] h-[70px] sm:h-[75px] border border-[#c1c1c1] rounded-2xl flex items-center pl-20 sm:pl-24 lg:pl-28 pr-4 sm:pr-6 bg-transparent transition-colors duration-300 group-hover:bg-white/40">
                <span className="text-[#888888] font-light text-xl sm:text-2xl mr-3 sm:mr-4">+</span>
                <span className="text-[#7a7a7a] font-light text-base sm:text-xl lg:text-[22px] tracking-wide">{get("about.grid_item_3_label", "Dragon Fruit Fruit")}</span>
              </div>
              <div className="absolute left-[0px] sm:left-[10px] bottom-[-30px] w-[150px] h-[170px] sm:w-[200px] sm:h-[220px] pointer-events-none z-10 transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-2">
                <Image src={get("about.grid_item_3_image", "/images/about/Dragon fruit png.webp")} alt="Fresh Dragon Fruit" fill className="object-contain object-bottom drop-shadow-[0_15px_25px_rgba(0,0,0,0.15)]" />
              </div>
            </div>

            {/* Plant */}
            <div className="relative flex items-center justify-end w-full max-w-[500px] h-[90px] sm:h-[100px] group cursor-pointer mt-8 sm:mt-0">
              <div className="w-[80%] h-[70px] sm:h-[75px] border border-[#c1c1c1] rounded-2xl flex items-center pl-20 sm:pl-24 lg:pl-28 pr-4 sm:pr-6 bg-transparent transition-colors duration-300 group-hover:bg-white/40">
                <span className="text-[#888888] font-light text-xl sm:text-2xl mr-3 sm:mr-4">+</span>
                <span className="text-[#7a7a7a] font-light text-base sm:text-xl lg:text-[22px] tracking-wide">{get("about.grid_item_4_label", "Dragon Fruit Plant")}</span>
              </div>
              <div className="absolute left-[10px] sm:left-[20px] bottom-[-20px] w-[120px] h-[240px] sm:w-[169px] sm:h-[325px] pointer-events-none z-10 transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-2">
                <Image src={get("about.grid_item_4_image", "/products/Plant 1 copy-4CPH7kam37YnVhsUfK3pinxwUeZr1O.webp")} alt="Dragon Fruit Plant" fill className="object-contain object-bottom drop-shadow-[0_15px_25px_rgba(0,0,0,0.15)]" />
              </div>
            </div>

          </div>
        </section>
      </div>

      {/* ── 4. FARMING SECTION ── */}
      <div className="w-full bg-[#f1f1f2]">
        <section className="relative w-full max-w-[1700px] mx-auto px-4 sm:px-6 md:px-12 py-12 md:py-20 overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row gap-10 lg:gap-6">

            {/* LEFT — Farm images & watermark */}
            <div className="w-full lg:w-[48%] flex flex-col relative">

              {/* 3 small photos */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-2 sm:mb-3">
                {["farm_small_1", "farm_small_2", "farm_small_3"].map((key, i) => (
                  <div key={i} className="relative aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg group">
                    <Image src={get(`about.${key}`, `/images/about/${key}.png`)} alt={`Farm Detail ${i + 1}`} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>
                ))}
              </div>

              {/* Panoramic */}
              <div className="relative w-full aspect-[16/8] rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl border-2 border-white/20 mb-6 md:mb-10 group">
                <Image src={get("about.farm_panoramic", "/images/about/farm_panoramic.png")} alt="Dragon Fruit Plantation Panoramic" fill className="object-cover transition-transform duration-1000 group-hover:scale-[1.03]" />
              </div>

              {/* Own Farming watermark + split image */}
              <div className="relative mb-4 sm:mb-6 overflow-hidden">
                <div className="flex items-center gap-4 sm:gap-6 lg:gap-10">
                  <h2
                    className="font-dharma-gothic font-black text-[#d1d2d4] tracking-normal select-none leading-[0.8]"
                    style={{ fontSize: "clamp(4rem, 14vw, 13.5rem)" }}
                  >
                    {get("about.watermark_own", "Own")}
                  </h2>
                  <div className="ml-auto w-[140px] h-[70px] sm:w-[225px] sm:h-[110px] md:w-[300px] md:h-[150px] lg:w-[375px] lg:h-[188px] relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border-2 border-white/20 flex-shrink-0 transition-transform duration-500 hover:scale-[1.02]">
                    <Image src={get("about.farm_split_image", "/images/about/farm_rows.png")} alt="Our Dragon Fruit Farm" fill className="object-cover" />
                  </div>
                </div>
                <h2
                  className="font-dharma-gothic font-black text-[#d1d2d4] tracking-normal select-none leading-[0.8] mt-2 sm:mt-4"
                  style={{ fontSize: "clamp(4rem, 14vw, 13.5rem)" }}
                >
                  {get("about.watermark_farming_split", "Farming")}
                </h2>
              </div>

              <p className="text-[#888888] text-xs sm:text-[0.78rem] leading-[1.8] font-light text-left max-w-[420px] ml-1">
                {get("about.narrative_paragraph", "Rafah Garden is more than just a farm.")}
              </p>
            </div>

            {/* RIGHT — Nature's Sweetness */}
            <div className="w-full lg:w-[52%] flex flex-col relative">

              {/* Vertical watermark — desktop only */}
              <div className="hidden lg:flex absolute right-[150px] top-0 bottom-0 items-start pointer-events-none select-none z-0">
                <span className="text-[9.45rem] md:text-[12.6rem] font-avant-garde font-semibold text-[#e0e1e3] leading-none [writing-mode:vertical-rl] rotate-180 opacity-70">
                  {get("about.watermark_farming_vertical", "Farming")}
                </span>
              </div>

              {/* Nature's Sweetness box */}
              <div className="relative border-2 border-dashed border-[#c0c1c3] rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:border-r-0 lg:pt-14 lg:pb-14 lg:pl-14 lg:pr-0 mt-0 lg:w-[calc(60%-100px)] z-10 overflow-visible bg-[#f1f1f2]">
                <h3
                  className="font-bold tracking-tight text-[#7a7b7d] font-avant-garde text-left whitespace-pre-line lg:translate-x-[50px]"
                  style={{ fontSize: "clamp(1.8rem, 6vw, 4.45rem)", lineHeight: 1.1 }}
                >
                  {get("about.technique_heading", "Nature's\nSweetness")}
                </h3>
              </div>

              {/* Plant + Text row */}
              <div className="relative w-full mt-8 lg:mt-auto mb-0 lg:mb-[50px] flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-0">

                {/* Plant image — mobile: normal flow; desktop: overflow absolute */}
                <div className="block lg:hidden relative w-full max-w-[200px] h-[300px] mx-auto sm:mx-0">
                  <Image
                    src={get("about.technique_plant", "/products/Plant 1 copy-4CPH7kam37YnVhsUfK3pinxwUeZr1O.webp")}
                    alt="Dragon Fruit Plant"
                    fill
                    className="object-contain object-bottom drop-shadow-xl"
                  />
                </div>

                {/* Desktop: dotted box with absolute plant */}
                <div className="hidden lg:flex border-2 border-dotted border-[#b0bec9] rounded-2xl bg-[#f1f1f2] overflow-visible shrink-0" style={{ width: "calc(45% + 60px)" }}>
                  <div className="flex-1 flex justify-center items-end relative min-h-[180px] py-4">
                    <div className="absolute -top-[554px] w-[448px] h-[704px] z-[20]">
                      <div className="relative w-full h-full">
                        <Image
                          src={get("about.technique_plant", "/products/Plant 1 copy-4CPH7kam37YnVhsUfK3pinxwUeZr1O.webp")}
                          alt="Dragon Fruit Plant"
                          fill
                          className="object-contain object-bottom drop-shadow-xl"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Text */}
                <div className="bg-[#f1f1f2] rounded-2xl px-4 sm:px-8 py-0 relative z-[10] flex items-center lg:ml-[-80px]">
                  <h4
                    className="font-bold text-[#7a7b7d] leading-[1.1] tracking-tight font-avant-garde text-left whitespace-pre-line"
                    style={{ fontSize: "clamp(1.4rem, 4vw, 2.6rem)" }}
                  >
                    {get("about.technique_subheading", "Natural\nFarming\nTechniques")}
                  </h4>
                </div>

              </div>
            </div>
          </div>
        </section>
      </div>

    </div>
  );
}
