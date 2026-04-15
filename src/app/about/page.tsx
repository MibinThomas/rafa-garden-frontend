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
            {/* Custom SVG Border resembling the puzzle piece box with smooth fillets */}
            <svg className="absolute inset-0 w-full h-full" viewBox="-2 -2 504 604" fill="none" preserveAspectRatio="none">
              <path d="M 40 0 L 460 0 A 40 40 0 0 1 500 40 L 500 340 A 20 20 0 0 1 480 360 A 57.5 40 0 0 0 480 440 A 20 20 0 0 1 500 460 L 500 560 A 40 40 0 0 1 460 600 L 40 600 A 40 40 0 0 1 0 560 L 0 360 A 20 20 0 0 1 20 340 A 57.5 40 0 0 0 20 260 A 20 20 0 0 1 0 240 L 0 40 A 40 40 0 0 1 40 0 Z" stroke="#c0c0c0" strokeWidth="1.5" />
            </svg>

            <h2 className="text-[2.5rem] md:text-[3.5rem] leading-[0.85] font-black font-brand-heading text-left tracking-tight text-[#b3b4b6] mt-4">
              Dragon<br />Fruit<br />Products
            </h2>
          </div>
        </div>

        {/* Floating Side Labels */}
        <div className="absolute left-6 md:left-[10%] top-[30%] flex flex-col gap-1 items-start z-30">
          <span className="text-xl md:text-3xl font-bold font-brand-heading text-[#b3b4b6] leading-none">Dragon<br />Fruit Jam</span>
        </div>
        <div className="absolute left-6 md:left-[10%] bottom-[20%] flex flex-col gap-1 items-start z-30">
          <span className="text-xl md:text-3xl font-bold font-brand-heading text-[#b3b4b6] leading-none">Dragon<br />Fruit Plant</span>
        </div>
        <div className="absolute right-6 md:right-[10%] top-[30%] flex flex-col gap-1 items-start z-30">
          <span className="text-xl md:text-3xl font-bold font-brand-heading text-[#b3b4b6] leading-none text-left">Dragon<br />Fruit Crush</span>
        </div>
        <div className="absolute right-6 md:right-[10%] bottom-[20%] flex flex-col gap-1 items-start z-30">
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
          <Image src="/images/hero/fresh_fruits.png" alt="Fresh Dragon Fruits" fill className="object-contain drop-shadow-[0_40px_50px_rgba(0,0,0,0.25)]" priority />
        </div>

      </section>
      {/* 2. PRODUCTS SHOWCASE AREA */}
      <section className="relative w-full z-20 mt-40 mb-32">
        
        {/* Solid #dadbdd Top Part */}
        <div className="w-full bg-[#dadbdd] pt-20 pb-10">
          <div className="w-full max-w-[1700px] mx-auto px-6 md:px-12">
            
            {/* Top Typography & Description */}
            <div className="w-full flex flex-col xl:flex-row justify-between items-start xl:items-end gap-12">
              {/* Massive Left Heading */}
              <div className="flex flex-col shrink-0">
                <h2 className="text-[4rem] md:text-[6rem] lg:text-[7rem] xl:text-[8rem] font-brand-heading font-black text-[#7a7a7a] leading-[0.8] tracking-tight">
                  Dragon Fruit.
                </h2>
                <h2 className="text-[4rem] md:text-[6rem] lg:text-[7rem] xl:text-[8rem] font-brand-heading font-black text-[#7a7a7a] leading-[0.8] tracking-tight">
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

        {/* Lower Part: Split Background (#dadbdd top, #e6e7e8 bottom) and Product Composition */}
        <div className="relative w-full">
          {/* Split Background Layer */}
          <div className="absolute inset-0 z-0 flex flex-col">
            <div className="w-full h-1/4 bg-[#dadbdd]" />
            <div className="w-full h-3/4 bg-[#e6e7e8]" />
          </div>

          <div className="relative z-10 w-full max-w-[1700px] mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center justify-between pt-10 pb-20">
            
            {/* Left Narrative Paragraph */}
            <div className="w-full lg:max-w-[450px] mb-20 lg:mb-0 z-20 shrink-0">
              <p className="text-[#7a7a7a] text-sm md:text-base leading-relaxed text-left tracking-tight [word-spacing:-1px]">
                Rafah Garden is more than just a farm – it's a passion project born from love for nature and commitment to quality. Nestled in the lush landscapes of Kasaragod, Kerala, we have dedicated ourselves to cultivating the finest dragon fruits and crafting premium products that bring the true taste of nature to your home.
              </p>
            </div>

            {/* Right Product Composition */}
            <div className="relative w-full lg:w-[800px] h-[500px] md:h-[600px] flex items-center justify-center shrink-0">
              <div className="relative w-[300px] md:w-[450px] h-[300px] md:h-[450px] -translate-y-[10%] z-40">
                <Image src="/images/hero/jam_premium.png" alt="Dragon Fruit Jam Premium" fill className="object-contain drop-shadow-2xl" />
              </div>
            </div>

          </div>
        </div>

      </section>
      {/* 3. INDIVIDUAL PRODUCT LINES (2x2 Grid) */}
      <section className="relative w-full max-w-[1400px] mx-auto px-6 mb-40 mt-32 z-20">
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
                <Image src="/images/hero/fresh_fruits.png" alt="Fresh Dragon Fruit" fill className="object-contain object-bottom drop-shadow-[0_15px_25px_rgba(0,0,0,0.15)]" />
             </div>
          </div>

          {/* Dragon Fruit Plant */}
          <div className="relative flex items-center justify-end w-full max-w-[500px] h-[100px] group cursor-pointer mt-12 md:mt-0">
             <div className="w-[80%] h-[75px] border border-[#c1c1c1] rounded-2xl flex items-center pl-24 lg:pl-28 pr-6 bg-transparent transition-colors duration-300 group-hover:bg-white/40">
                <span className="text-[#888888] font-light text-2xl mr-4">+</span>
                <span className="text-[#7a7a7a] font-light text-xl lg:text-[22px] tracking-wide">Dragon Fruit Plant</span>
             </div>
             <div className="absolute left-[20px] bottom-[-20px] w-[130px] h-[250px] pointer-events-none z-10 transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-2">
                <Image src="/images/hero/plants_premium.png" alt="Dragon Fruit Plant" fill className="object-contain object-bottom drop-shadow-[0_15px_25px_rgba(0,0,0,0.15)]" />
             </div>
          </div>

        </div>
      </section>

      {/* 4. FARMING SECTION */}
      <section className="relative w-full max-w-[1700px] mx-auto px-6 md:px-12 flex flex-col md:flex-row gap-12 pt-20">

        {/* HUGE Vertical Watermark Right */}
        <div className="absolute right-0 top-0 h-full flex flex-col justify-center pointer-events-none overflow-hidden select-none z-0">
          <span className="text-[18rem] md:text-[25rem] font-brand-heading font-black text-[#dcdddf] leading-none [writing-mode:vertical-rl] opacity-40">
            Farming
          </span>
        </div>

        {/* Left Col - Images and Description */}
        <div className="w-full md:w-5/12 flex flex-col gap-6 z-10">
          <div className="flex gap-4">
            <div className="relative w-1/3 aspect-square rounded-xl overflow-hidden bg-black/5">
              <Image src="/images/about/kenny-dragon-fruit-tree-farm-thailand-country-landscape.jpg" alt="Farm" fill className="object-cover" />
            </div>
            <div className="relative w-1/3 aspect-square rounded-xl overflow-hidden bg-black/5">
              <Image src="/images/about/kenny-dragon-fruit-tree-farm-thailand-country-landscape.jpg" alt="Farm" fill className="object-cover" />
            </div>
            <div className="relative flex-1 aspect-square rounded-xl overflow-hidden bg-black/5 opacity-50">
            </div>
          </div>

          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-black/5 shadow-md">
            <Image src="/images/about/kenny-dragon-fruit-tree-farm-thailand-country-landscape.jpg" alt="Farm Main" fill className="object-cover" />
          </div>

          <div className="flex gap-6 mt-12 mb-6">
            <h2 className="text-[5rem] md:text-[7rem] leading-[0.85] font-black font-brand-heading text-[#d1d1d3]">
              Own<br />Farming
            </h2>
            <div className="relative w-40 aspect-square rounded-2xl overflow-hidden bg-black/5 mt-4 group">
              <Image src="/images/about/kenny-dragon-fruit-tree-farm-thailand-country-landscape.jpg" alt="Farm Detail" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
            </div>
          </div>

          <p className="text-[#666666] text-[0.7rem] leading-[1.8] font-light text-justify max-w-[360px]">
            Rafah Garden is more than just a farm — it is a sanctuary where our heritage meets the art of modern cultivation. We are dedicated to creating the most extraordinary pitaya, combining ancient wisdom with sustainable practices to craft products of unmatched quality and flavor.
          </p>
        </div>

        {/* Right Col - Headings & Plant */}
        <div className="w-full md:w-7/12 flex flex-col items-center pt-10 z-10">
          <div className="border border-black/10 rounded-3xl pt-16 pb-12 px-12 md:mr-auto md:ml-12 inline-block bg-[#e6e7e8]/40 backdrop-blur-sm">
            <h3 className="text-[3rem] md:text-[4rem] leading-[1.05] font-black tracking-tight text-[#666666]">
              Nature's<br />Sweetness<br />in Every Fruit
            </h3>
          </div>

          <div className="relative mt-12 w-[350px] h-[450px]">
            <Image src="/products/plants_premium.png" alt="Potted Plant" fill className="object-contain drop-shadow-2xl" />
          </div>

          <div className="flex w-full justify-end mt-[-60px] mr-12 border-t border-black/20 pt-4 max-w-[350px]">
            <h4 className="text-[1.8rem] font-bold text-[#666666] leading-[1.1] tracking-tight">
              Natural<br />Farming<br />Techniques
            </h4>
          </div>
        </div>
      </section>

    </div>
  );
}
