"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DragonCrushCanvas } from "./DragonCrushCanvas";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function ExperienceCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Define beats mapped to scroll progress
  return (
    <section 
      ref={containerRef} 
      className="relative w-full bg-black text-white h-[400vh] tracking-tight font-sans"
    >
      <DragonCrushCanvas />

      {/* Scrollytelling Beats Container */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 flex flex-col">
        
        {/* Beat A: 0-20% */}
        <div className="h-[100vh] flex flex-col items-start justify-center pt-[10%] px-6 md:pl-[10%]">
          <BeatText
            title="RAFAH"
            subtitle="The Heritage of Refreshment, Reimagined."
            triggerStart="top top"
          />
        </div>

        {/* Beat B: 25-45% */}
        <div className="h-[100vh] flex flex-col items-start justify-center pt-20 px-6 md:pl-[10%]">
          <BeatText
            title="EXOTIC INFUSION"
            subtitle="Crisp Dragon Fruit meets timeless Rose."
            triggerStart="top 50%"
          />
        </div>

        {/* Beat C: 50-70% */}
        <div className="h-[100vh] flex flex-col items-start justify-center pt-[20%] px-6 md:pl-[10%]">
          <BeatText
            title="VELVET VISCOSITY"
            subtitle="Every drop, a masterpiece of extraction."
            triggerStart="top 50%"
          />
        </div>

        {/* Beat D: 75-95% */}
        <div className="h-[100vh] flex flex-col items-start justify-end pb-[10%] px-6 md:pl-[10%]">
          <BeatText
            title="EXPERIENCE THE CRUSH"
            subtitle="Pure. Botanical. Bold."
            triggerStart="top 25%"
          />
        </div>

      </div>
    </section>
  );
}

function BeatText({ 
  title, 
  subtitle, 
  triggerStart 
}: { 
  title: string; 
  subtitle: string; 
  triggerStart: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Opacity [0, 1, 1, 0] with a 20px subtle vertical slide.
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: triggerStart,
        end: "+=60%", // spans 60% of the viewport height scrolling
        scrub: 1, // viscous feel
      },
    });

    tl.fromTo(
      containerRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.3, ease: "power1.out" }
    )
    .to(containerRef.current, { opacity: 1, y: -5, duration: 0.4, ease: "none" })
    .to(containerRef.current, { opacity: 0, y: -25, duration: 0.3, ease: "power1.in" });

    return () => {
      tl.kill();
    };
  }, [triggerStart]);

  return (
    <div ref={containerRef} className="text-center md:text-left drop-shadow-2xl max-w-xl mx-auto md:mx-0">
      <h2 className="text-5xl md:text-8xl font-extrabold tracking-tighter text-white mb-4 drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
        {title}
      </h2>
      <p className="text-xl md:text-3xl font-light tracking-wide text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
        {subtitle}
      </p>
    </div>
  );
}
