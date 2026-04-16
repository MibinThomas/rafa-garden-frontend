"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useHeaderColor } from "@/lib/HeaderColorContext";

export default function AboutPage() {
  const { setIsImmersive, setHeaderColor } = useHeaderColor();

  useEffect(() => {
    // Standard light theme behavior for the new About page
    setIsImmersive(false);
    setHeaderColor("#333333");
  }, [setIsImmersive, setHeaderColor]);

  return (
    <div className="relative min-h-screen bg-[#e6e7e8] font-sans selection:bg-[#c81c6a] selection:text-white pb-32">

      {/* 1. TOP HERO SECTION */}
      <section className="relative pt-[50px] w-full max-w-[1700px] mx-auto px-6 md:px-12 flex flex-col mb-[115px] z-10 overflow-hidden">

        {/* Top Text Row */}
        <div className="w-full flex flex-col md:flex-row justify-between relative z-30 gap-12 lg:gap-24 shrink-0">
          {/* Left Typography */}
          <div className="w-full md:w-[40%] flex flex-col items-start justify-start z-20 pl-[30px]">
            {/* Top Match */}
            <div className="h-[80px] flex items-center mb-8">
              <h3 className="text-[50px] font-bold font-brand-heading text-[#b3b4b6] leading-none tracking-tight">
                About us.
              </h3>
            </div>
            <h1 className="text-[clamp(85px,10.2vw,136px)] leading-[0.82] font-black font-brand-heading text-[#b3b4b6] tracking-tight">
              Rafah<br />Garden.
            </h1>
          </div>

          {/* Right Description & Logo */}
          <div className="w-full md:w-[60%] flex flex-col items-start justify-start z-20 pr-[60px]">
            {/* Top Match */}
            <div className="h-[80px] flex items-center mb-8">
              <div className="relative w-[216px] h-[72px]">
                <Image
                  src="/images/logo/Rafah logo.webp"
                  alt="Rafah Garden Logo"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
            </div>
            <p className="text-[#a0a0a0] lg:text-[#666666] text-sm md:text-base leading-[2] font-normal text-justify tracking-tight [word-spacing:-1px] w-full max-w-[800px]">
              <strong>Rafah Garden</strong> believes that true health and happiness begin with nature’s sweetness. Nestled in our farm, we lovingly cultivate fresh red sweety dragon fruits, known for their rich taste and powerful health benefits. From handpicking each fruit to carefully preparing our Dragon Fruit Crush and Dragon Fruit Jam, we ensure that every product carries the freshness of our farm and the goodness of nature. Our mission is simple – to bring you natural, wholesome, and delicious products straight from our garden to your home, with fresh and sweet flavors. With every sip and every spoonful, we want you to experience the purity, care, and passion that go into everything we create.
            </p>
          </div>
        </div>

      </section>

      {/* 1.5 DRAGON FRUIT PRODUCTS COMPOSITION */}
      <section className="relative w-full max-w-[1700px] mx-auto px-6 md:px-12 h-[70vh] min-h-[500px] flex items-center justify-center my-10 z-30">

        {/* Background Outline & Text */}
        <div className="absolute inset-x-0 top-0 h-[80%] flex items-center justify-center pointer-events-none z-0">
          <div className="relative w-[300px] h-[350px] md:w-[450px] md:h-[500px] flex flex-col items-center pt-10">
            {/* Dragon fruit line curved design image as background */}
            <Image
              src="/images/about/Dragon fruit line curved.webp"
              alt="Dragon Fruit Design"
              fill
              className="object-contain"
            />


          </div>
        </div>

        {/* Floating Side Labels */}
        <div className="absolute left-6 md:left-[10%] top-[30%] flex flex-col gap-1 items-start z-30">
          <span className="text-xl md:text-3xl font-bold font-brand-heading text-[#b3b4b6] leading-none">Dragon<br />Fruit Jam</span>
        </div>
        <div className="absolute left-6 md:left-[10%] bottom-[20%] flex flex-col gap-1 items-start z-30">
          <span className="text-xl md:text-3xl font-bold font-brand-heading text-[#b3b4b6] leading-none">Dragon<br />Fruit Plant</span>
        </div>
        <div className="absolute right-6 md:right-[10%] top-[30%] bottom-[20%] flex flex-col justify-between items-start z-30">
          <span className="text-xl md:text-3xl font-bold font-brand-heading text-[#b3b4b6] leading-none text-left">Dragon<br />Fruit Crush</span>
          <span className="text-xl md:text-3xl font-bold font-brand-heading text-[#b3b4b6] leading-none text-left">Dragon<br />Fruit Fruit</span>
        </div>

        {/* 4 Small Blurred Floating Pitayas */}
        <motion.div animate={{ y: [-20, 20, -20] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[15%] right-[25%] w-[80px] h-[80px] md:w-[120px] md:h-[120px] rotate-[15deg] blur-sm opacity-90 z-10">
          <Image src="/images/hero/floatingpitaya.png" alt="floating" fill className="object-contain" />
        </motion.div>

        <motion.div animate={{ y: [-15, 15, -15] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute bottom-[20%] right-[30%] w-[60px] h-[60px] md:w-[90px] md:h-[90px] -rotate-[30deg] blur-[2px] opacity-90 z-10">
          <Image src="/images/hero/floatingpitaya.png" alt="floating" fill className="object-contain" />
        </motion.div>

        <motion.div animate={{ y: [-25, 25, -25] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="absolute top-[25%] left-[25%] w-[70px] h-[70px] md:w-[100px] md:h-[100px] -rotate-[10deg] blur-md opacity-80 z-10">
          <Image src="/images/hero/floatingpitaya.png" alt="floating" fill className="object-contain" />
        </motion.div>

        <motion.div animate={{ y: [-15, 15, -15] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 3 }} className="absolute bottom-[25%] left-[30%] w-[80px] h-[80px] md:w-[110px] md:h-[110px] rotate-[45deg] blur-sm opacity-90 z-10">
          <Image src="/images/hero/floatingpitaya.png" alt="floating" fill className="object-contain" />
        </motion.div>

        {/* Center Main Product Image */}
        <div
          className="absolute z-20 w-[450px] h-[450px] md:w-[700px] md:h-[700px] -bottom-[225px] md:-bottom-[350px] left-1/2 -translate-x-1/2 shrink-0 pointer-events-none"
        >
          <Image src="/images/about/Dragon fruit png.webp" alt="Fresh Dragon Fruits" fill className="object-contain drop-shadow-[0_40px_50px_rgba(0,0,0,0.25)]" priority />
        </div>

      </section>
      {/* 2. PRODUCTS SHOWCASE AREA */}
      <section className="relative w-full z-20 mt-40">

        {/* Solid #dadbdd Top Part */}
        <div className="w-full bg-[#dadbdd] pt-20 pb-10">
          <div className="w-full max-w-[1700px] mx-auto px-6 md:px-12">

            {/* Top Typography & Description */}
            <div className="w-full flex flex-col xl:flex-row justify-between items-start xl:items-end gap-12">
              {/* Massive Left Heading */}
              <div className="flex flex-col shrink-0">
                <h2 className="text-[5rem] md:text-[7rem] lg:text-[9rem] xl:text-[11rem] font-dharma-gothic font-black text-[#7a7a7a] leading-[0.9] tracking-tight">
                  Dragon Fruit.
                </h2>
                <h2 className="text-[5rem] md:text-[7rem] lg:text-[9rem] xl:text-[11rem] font-dharma-gothic font-black text-[#7a7a7a] leading-[0.9] tracking-tight">
                  Products
                </h2>
              </div>

              {/* Right Description Paragraph */}
              <div className="w-full xl:max-w-[500px] pb-4">
                <p className="text-[#888888] text-sm md:text-base leading-relaxed text-justify tracking-tight [word-spacing:-1px]">
                  What began as a small family initiative has blossomed into a thriving agricultural enterprise. With every season, we've perfected our techniques, deepened our commitment to sustainable farming, and expanded our range of delicious dragon fruit products – from fresh whole fruits to our signature Dragon Fruit Crush and Dragon Fruit Jam.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Lower Part: Full-bleed product image layout */}
        <div className="relative w-full bg-[#f1f1f2] min-h-[520px]">

          {/* Left Narrative Paragraph */}
          <div className="relative z-20 w-full lg:w-[45%] px-6 md:px-12 py-16">
            <p className="text-[#7a7a7a] text-sm md:text-base leading-relaxed text-left tracking-tight [word-spacing:-1px]">
              Rafah Garden is more than just a farm – it's a passion project born from love for nature and commitment to quality. Nestled in the lush landscapes of Kasaragod, Kerala, we have dedicated ourselves to cultivating the finest dragon fruits and crafting premium products that bring the true taste of nature to your home.
            </p>
          </div>

          {/* Center Product Image — overlaps 20% into the section above */}
          <div className="absolute -top-[20%] left-0 right-0 bottom-0 flex items-start justify-center z-30 pointer-events-none">
            <div className="relative w-[90%] md:w-[75%] lg:w-[65%] h-full translate-x-[50px] scale-[1.25]">
              <Image
                src="/images/about/All Products.webp"
                alt="All Dragon Fruit Products"
                fill
                className="object-contain object-center drop-shadow-2xl"
              />
            </div>
          </div>

        </div>

      </section>
      {/* 3. INDIVIDUAL PRODUCT LINES (2x2 Grid) */}
      <div className="w-full bg-[#f1f1f2]">
        <section className="relative w-full max-w-[1400px] mx-auto px-6 pt-40 pb-32 z-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-32 gap-x-12 lg:gap-x-20 place-items-center">

            {/* Dragon Fruit Crush */}
            <div className="relative flex items-center justify-end w-full max-w-[500px] h-[100px] group cursor-pointer mt-12 md:mt-0">
              <div className="w-[80%] h-[75px] border border-[#c1c1c1] rounded-2xl flex items-center pl-24 lg:pl-28 pr-6 bg-transparent transition-colors duration-300 group-hover:bg-white/40">
                <span className="text-[#888888] font-light text-2xl mr-4">+</span>
                <span className="text-[#7a7a7a] font-light text-xl lg:text-[22px] tracking-wide">Dragon Fruit Crush</span>
              </div>
              <div className="absolute left-[-20px] bottom-[-20px] w-[180px] h-[280px] pointer-events-none z-10 transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-2">
                <Image src="/images/hero/crush_bottle.png" alt="Dragon Fruit Crush" fill className="object-contain object-bottom drop-shadow-[0_15px_25px_rgba(0,0,0,0.15)]" />
              </div>
            </div>

            {/* Dragon Fruit Jam */}
            <div className="relative flex items-center justify-end w-full max-w-[500px] h-[100px] group cursor-pointer mt-12 md:mt-0">
              <div className="w-[80%] h-[75px] border border-[#c1c1c1] rounded-2xl flex items-center pl-24 lg:pl-28 pr-6 bg-transparent transition-colors duration-300 group-hover:bg-white/40">
                <span className="text-[#888888] font-light text-2xl mr-4">+</span>
                <span className="text-[#7a7a7a] font-light text-xl lg:text-[22px] tracking-wide">Dragon Fruit Jam</span>
              </div>
              <div className="absolute left-[10px] bottom-[-10px] w-[140px] h-[160px] pointer-events-none z-10 transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-2">
                <Image src="/images/hero/jam_premium.png" alt="Dragon Fruit Jam" fill className="object-contain object-bottom drop-shadow-[0_15px_25px_rgba(0,0,0,0.15)]" />
              </div>
            </div>

            {/* Dragon Fruit Fruit */}
            <div className="relative flex items-center justify-end w-full max-w-[500px] h-[100px] group cursor-pointer mt-12 md:mt-0">
              <div className="w-[80%] h-[75px] border border-[#c1c1c1] rounded-2xl flex items-center pl-24 lg:pl-28 pr-6 bg-transparent transition-colors duration-300 group-hover:bg-white/40">
                <span className="text-[#888888] font-light text-2xl mr-4">+</span>
                <span className="text-[#7a7a7a] font-light text-xl lg:text-[22px] tracking-wide">Dragon Fruit Fruit</span>
              </div>
              <div className="absolute left-[10px] bottom-[-30px] w-[200px] h-[220px] pointer-events-none z-10 transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-2">
                <Image src="/images/about/Dragon fruit png.webp" alt="Fresh Dragon Fruit" fill className="object-contain object-bottom drop-shadow-[0_15px_25px_rgba(0,0,0,0.15)]" />
              </div>
            </div>

            {/* Dragon Fruit Plant */}
            <div className="relative flex items-center justify-end w-full max-w-[500px] h-[100px] group cursor-pointer mt-12 md:mt-0">
              <div className="w-[80%] h-[75px] border border-[#c1c1c1] rounded-2xl flex items-center pl-24 lg:pl-28 pr-6 bg-transparent transition-colors duration-300 group-hover:bg-white/40">
                <span className="text-[#888888] font-light text-2xl mr-4">+</span>
                <span className="text-[#7a7a7a] font-light text-xl lg:text-[22px] tracking-wide">Dragon Fruit Plant</span>
              </div>
              <div className="absolute left-[20px] bottom-[-20px] w-[130px] h-[250px] pointer-events-none z-10 transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-2">
                <Image src="/products/Plant 1 copy-4CPH7kam37YnVhsUfK3pinxwUeZr1O.webp" alt="Dragon Fruit Plant" fill className="object-contain object-bottom drop-shadow-[0_15px_25px_rgba(0,0,0,0.15)]" />
              </div>
            </div>

          </div>
        </section>
      </div>

      {/* 4. FARMING SECTION */}
      <div className="w-full bg-[#f1f1f2]">
        <section className="relative w-full max-w-[1700px] mx-auto px-6 md:px-12 py-20 overflow-hidden">

          {/* "Farming" Watermark — far right */}

          <div className="relative z-10 flex flex-col lg:flex-row gap-10 lg:gap-6">

            {/* LEFT COLUMN — Redesigned "Own Farming" focus with Image Collection */}
            <div className="w-full lg:w-[48%] flex flex-col relative min-h-[500px]">

              {/* 1. TOP GRID: 3 Small Photos */}
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-lg border border-white/10 group">
                  <Image src="/images/about/farm_small_1.png" alt="Farm Detail 1" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-lg border border-white/10 group">
                  <Image src="/images/about/farm_small_2.png" alt="Farm Detail 2" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-lg border border-white/10 group">
                  <Image src="/images/about/farm_small_3.png" alt="Farm Detail 3" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
              </div>

              {/* 2. PRIMARY IMAGE: Large Panoramic View */}
              <div className="relative w-full aspect-[16/8] rounded-[2.5rem] overflow-hidden shadow-2xl border-2 border-white/20 mb-10 group">
                <Image src="/images/about/farm_panoramic.png" alt="Dragon Fruit Plantation Panoramic" fill className="object-cover transition-transform duration-1000 group-hover:scale-[1.03]" />
              </div>

              {/* 3. OWN FARMING BLOCK (Split layout) */}
              <div className="relative mb-6">
                {/* Row 1: "Own" + Image */}
                <div className="flex items-center gap-6 lg:gap-10">
                  <h2 className="text-[7.5rem] md:text-[11rem] lg:text-[13.5rem] leading-[0.8] font-dharma-gothic font-black text-[#d1d2d4] tracking-normal select-none">
                    Own
                  </h2>
                  <div className="ml-auto w-[180px] md:w-[240px] lg:w-[300px] h-[80px] md:h-[120px] lg:h-[150px] relative rounded-3xl overflow-hidden shadow-xl border-2 border-white/20 transition-transform duration-500 hover:scale-[1.02]">
                    <Image 
                      src="/images/about/farm_rows.png" 
                      alt="Our Dragon Fruit Farm" 
                      fill 
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Row 2: "Farming" */}
                <h2 className="text-[7.5rem] md:text-[11rem] lg:text-[13.5rem] leading-[0.8] font-dharma-gothic font-black text-[#d1d2d4] tracking-normal select-none mt-4">
                  Farming
                </h2>
              </div>

              {/* Narrative Paragraph */}
              <p className="text-[#888888] text-[0.78rem] leading-[1.8] font-light text-left max-w-[420px] ml-1">
                Rafah Garden is more than just a farm – it's a passion project born from love for nature and commitment to quality. Nestled in the lush landscapes of Kasaragod, Kerala, we have dedicated ourselves to cultivating the finest dragon fruits and crafting premium products that bring the true taste of nature to your home.
              </p>
            </div>

            {/* RIGHT COLUMN */}
            <div className="w-full lg:w-[52%] flex flex-col relative min-h-[700px]">

              {/* "Farming" watermark — right side overlay */}
              <div className="absolute right-[150px] top-0 bottom-0 flex items-start pointer-events-none select-none z-0">
                <span className="text-[9.45rem] md:text-[12.6rem] font-avant-garde font-semibold text-[#e0e1e3] leading-none [writing-mode:vertical-rl] rotate-180 opacity-70">
                  Farming
                </span>
              </div>

              {/* "Nature's Sweetness" — half-width dashed box, text overflows right */}
              <div className="relative border-2 border-dashed border-[#c0c1c3] border-r-0 rounded-3xl pt-14 pb-14 pl-14 pr-0 mt-0 w-[calc(60%-100px)] z-10 overflow-visible bg-[#f1f1f2]">
                <h3 className="text-[3.51rem] md:text-[4.45rem] leading-[1.1] font-bold tracking-tight text-[#7a7b7d] font-avant-garde text-left whitespace-nowrap translate-x-[50px]">
                  Nature's<br />Sweetness<br />in Every Fruit
                </h3>
              </div>

              {/* Plant + Dotted Box + Text — row layout */}
              <div className="relative w-full mt-auto mb-[50px] flex items-center">

                {/* Dotted box — plant only inside */}
                <div className="border-2 border-dotted border-[#b0bec9] rounded-2xl bg-[#f1f1f2] flex overflow-visible shrink-0" style={{ width: 'calc(45% + 60px)' }}>
                  {/* Plant — centered, overflows above */}
                  <div className="flex-1 flex justify-center items-end relative min-h-[180px] py-4">
                    <div className="absolute -top-[554px] w-[448px] h-[704px] z-[20]">
                      <div className="relative w-full h-full">
                        <Image
                          src="/products/Plant 1 copy-4CPH7kam37YnVhsUfK3pinxwUeZr1O.webp"
                          alt="Dragon Fruit Plant"
                          fill
                          className="object-contain object-bottom drop-shadow-xl"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* White text div — right of dotted box */}
                <div className="bg-[#f1f1f2] rounded-2xl px-8 py-0 relative z-[10] flex items-center" style={{ marginLeft: '-80px' }}>
                  <h4 className="text-[2rem] md:text-[2.6rem] font-bold text-[#7a7b7d] leading-[1.1] tracking-tight font-avant-garde text-left">
                    Natural<br />Farming<br />Techniques
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
