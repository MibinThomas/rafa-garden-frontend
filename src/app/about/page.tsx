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
      <section className="relative pt-[50px] w-full max-w-[1700px] mx-auto px-6 md:px-12 flex flex-col mb-32 z-10 overflow-hidden">
        
        {/* Top Text Row */}
        <div className="w-full flex flex-col md:flex-row justify-between relative z-30 gap-12 lg:gap-24">
          {/* Left Typography */}
          <div className="w-full md:w-[40%] flex flex-col items-center justify-center z-20">
            <div className="flex flex-col items-start text-left">
              <h3 className="text-[50px] font-bold font-brand-heading text-[#b3b4b6] leading-none tracking-tight mb-[25px]">
                About us.
              </h3>
              <h1 className="text-[100px] leading-[0.85] font-black font-brand-heading text-[#b3b4b6] tracking-tight">
                Rafah<br />Garden.
              </h1>
            </div>
          </div>

          {/* Right Description & Logo */}
          <div className="w-full md:w-[60%] flex flex-col items-start justify-center z-20 pr-[60px]">
            <div className="relative w-[216px] h-[72px] mb-12">
              <Image
                src="/images/logo/Rafah logo.webp"
                alt="Rafah Garden Logo"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
            <p className="text-[#a0a0a0] lg:text-[#666666] text-sm md:text-base leading-[2] font-light text-left w-full max-w-[800px]">
              Rafah Garden believes that true health and happiness begin with nature’s sweetness. Nestled in our farm, we lovingly cultivate fresh red sweety dragon fruits, known for their rich taste and powerful health benefits. From handpicking each fruit to carefully preparing our Dragon Fruit Crush and Dragon Fruit Jam, we ensure that every product carries the freshness of our farm and the goodness of nature. Our mission is simple – to bring you natural, wholesome, and delicious products straight from our garden to your home, with fresh and sweet flavors. With every sip and every spoonful, we want you to experience the purity, care, and passion that go into everything we create.
            </p>
          </div>
        </div>

        {/* Center Floating Pitaya Composition & Watermarks */}
        <div className="relative w-full h-[400px] md:h-[600px] mt-16 md:mt-24 pointer-events-none z-10 flex items-center justify-center">
          
          {/* Faint Text Behind */}
          <div className="absolute inset-0 flex items-center justify-center lg:scale-125 opacity-20 z-0">
            <h2 className="text-[5rem] md:text-[8rem] leading-[0.85] font-black font-brand-heading text-center text-[#999999]">
              Dragon<br/>Fruit<br/>Products
            </h2>
          </div>

          {/* Dummy Center Image */}
          <motion.div 
            className="relative w-[250px] h-[250px] md:w-[450px] md:h-[450px] z-20"
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image src="/images/hero/fresh_fruits.png" alt="Dragon Fruits" fill className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.2)]" priority />
          </motion.div>

          {/* Floating Line Markers (Corner Labels) */}
          <div className="absolute left-0 md:left-[10%] top-[20%] md:top-[15%] flex items-center gap-4 z-30">
             <span className="w-1.5 h-1.5 rounded-full bg-[#c81c6a] shadow-[0_0_10px_rgba(200,28,106,0.6)]" />
             <span className="text-xs md:text-sm font-bold text-[#888888] tracking-widest leading-tight">Dragon<br/>Fruit Jam</span>
          </div>
          <div className="absolute left-0 md:left-[5%] bottom-[10%] md:bottom-[20%] flex items-center gap-4 z-30">
             <span className="w-1.5 h-1.5 rounded-full bg-[#c81c6a] shadow-[0_0_10px_rgba(200,28,106,0.6)]" />
             <span className="text-xs md:text-sm font-bold text-[#888888] tracking-widest leading-tight">Dragon<br/>Fruit Plant</span>
          </div>
          <div className="absolute right-0 md:right-[10%] top-[30%] md:top-[15%] flex items-center gap-4 flex-row-reverse text-right z-30">
             <span className="w-1.5 h-1.5 rounded-full bg-[#c81c6a] shadow-[0_0_10px_rgba(200,28,106,0.6)]" />
             <span className="text-xs md:text-sm font-bold text-[#888888] tracking-widest leading-tight">Dragon<br/>Fruit Crush</span>
          </div>
          <div className="absolute right-0 md:right-[5%] bottom-[20%] md:bottom-[20%] flex items-center gap-4 flex-row-reverse text-right z-30">
             <span className="w-1.5 h-1.5 rounded-full bg-[#c81c6a] shadow-[0_0_10px_rgba(200,28,106,0.6)]" />
             <span className="text-xs md:text-sm font-bold text-[#888888] tracking-widest leading-tight">Dragon<br/>Fruit</span>
          </div>
        </div>
      </section>


      {/* 2. PRODUCTS SHOWCASE AREA */}
      <section className="relative w-full mt-40 pt-20 mb-32 z-20">
        {/* Grey Background Band */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[350px] bg-[#d1d1d3] z-0" />
        
        <div className="max-w-[1700px] mx-auto px-6 md:px-12 relative z-10 w-full">
          {/* Main Title Overlapping */}
          <div className="absolute top-[-80px] left-6 md:left-12 z-0 pointer-events-none">
            <h2 className="text-[5rem] md:text-[8rem] lg:text-[10rem] leading-[0.8] font-black font-brand-heading text-[#7a7a7c] tracking-tight">
              Dragon Fruit.<br />Products
            </h2>
          </div>

          {/* Central Product Composition */}
          <div className="relative w-full h-[600px] flex items-center justify-center mt-20">
             {/* Center Bottle */}
             <div className="relative z-30 w-[180px] h-[450px]">
               <Image src="/products/crush_bottle.png" alt="Dragon Fruit Crush" fill className="object-contain drop-shadow-2xl" />
             </div>
             {/* Left Bottle */}
             <div className="absolute z-20 left-1/2 -translate-x-[220px] w-[150px] h-[380px] mt-10">
               <Image src="/products/crush_bottle.png" alt="Dragon Fruit Crush" fill className="object-contain drop-shadow-xl" />
             </div>
             {/* Right Bottle */}
             <div className="absolute z-20 right-1/2 translate-x-[220px] w-[150px] h-[380px] mt-10">
               <Image src="/products/crush_bottle.png" alt="Dragon Fruit Crush" fill className="object-contain drop-shadow-xl" />
             </div>
             {/* Left Jam Jar */}
             <div className="absolute z-10 left-1/2 -translate-x-[360px] top-[260px] w-[180px] h-[180px]">
               <Image src="/products/jam_premium.png" alt="Dragon Fruit Jam" fill className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)]" />
             </div>
             {/* Right Jam Jar */}
             <div className="absolute z-10 right-1/2 translate-x-[360px] top-[260px] w-[180px] h-[180px]">
               <Image src="/products/jam_premium.png" alt="Dragon Fruit Jam" fill className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)]" />
             </div>
          </div>
        </div>
      </section>

      {/* 3. INDIVIDUAL PRODUCT LINES (2x2 Grid) */}
      <section className="relative w-full max-w-[1200px] mx-auto px-6 mb-40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-20 gap-x-12">
          
          {/* Crush */}
          <div className="flex items-center gap-8 justify-center">
            <div className="relative w-32 h-40">
               <Image src="/products/crush_bottle.png" alt="Crush" fill className="object-contain drop-shadow-lg" />
            </div>
            <div className="flex items-center gap-4 flex-1">
              <div className="h-px bg-black/20 flex-1" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#c81c6a] shrink-0" />
              <span className="text-sm font-light tracking-widest text-[#555555]">Dragon Fruit Crush</span>
            </div>
          </div>

          {/* Jam */}
          <div className="flex items-center gap-8 justify-center">
            <div className="relative w-32 h-32">
               <Image src="/products/jam_premium.png" alt="Jam" fill className="object-contain drop-shadow-lg" />
            </div>
            <div className="flex items-center gap-4 flex-1">
              <div className="h-px bg-black/20 flex-1" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#c81c6a] shrink-0" />
              <span className="text-sm font-light tracking-widest text-[#555555]">Dragon Fruit Jam</span>
            </div>
          </div>

          {/* Fruit */}
          <div className="flex items-center gap-8 justify-center">
            <div className="relative w-40 h-32">
               <Image src="/products/fresh_fruits.png" alt="Fruit" fill className="object-contain drop-shadow-lg" />
            </div>
            <div className="flex items-center gap-4 flex-1">
              <div className="h-px bg-black/20 flex-1" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#c81c6a] shrink-0" />
              <span className="text-sm font-light tracking-widest text-[#555555]">Dragon Fruit Fruit</span>
            </div>
          </div>

          {/* Plant */}
          <div className="flex items-center gap-8 justify-center">
            <div className="relative w-32 h-32">
               <Image src="/products/plants_premium.png" alt="Plant" fill className="object-contain drop-shadow-lg" />
            </div>
            <div className="flex items-center gap-4 flex-1">
              <div className="h-px bg-black/20 flex-1" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#c81c6a] shrink-0" />
              <span className="text-sm font-light tracking-widest text-[#555555]">Dragon Fruit Plant</span>
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
              Own<br/>Farming
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
               Nature's<br/>Sweetness<br/>in Every Fruit
             </h3>
           </div>

           <div className="relative mt-12 w-[350px] h-[450px]">
              <Image src="/products/plants_premium.png" alt="Potted Plant" fill className="object-contain drop-shadow-2xl" />
           </div>

           <div className="flex w-full justify-end mt-[-60px] mr-12 border-t border-black/20 pt-4 max-w-[350px]">
             <h4 className="text-[1.8rem] font-bold text-[#666666] leading-[1.1] tracking-tight">
               Natural<br/>Farming<br/>Techniques
             </h4>
           </div>
        </div>
      </section>

    </div>
  );
}
