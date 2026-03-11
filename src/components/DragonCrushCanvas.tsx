"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const FRAME_COUNT = 120; // 120-frame sequence
const IMAGE_PREFIX = "/dragon-fuit/ezgif-frame-";
const IMAGE_SUFFIX = ".jpg";

export function DragonCrushCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameRef = useRef({ frame: 0 });

  useEffect(() => {
    // Preload images
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    // Load without blocking sequential promises to make it faster
    for (let i = 1; i <= FRAME_COUNT; i++) {
        const img = new Image();
        const frameStr = i.toString().padStart(3, "0");
        img.src = `${IMAGE_PREFIX}${frameStr}${IMAGE_SUFFIX}`;
        img.onload = () => {
            loadedCount++;
            setProgress(Math.round((loadedCount / FRAME_COUNT) * 100));
            if (loadedCount === FRAME_COUNT) {
                setLoaded(true);
            }
        };
        img.onerror = () => {
            loadedCount++; // still count to avoid infinite loading state
            if (loadedCount === FRAME_COUNT) {
                setLoaded(true);
            }
        };
        images.push(img);
    }
    imagesRef.current = images;
  }, []);

  useEffect(() => {
    if (!loaded || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      const frameIndex = frameRef.current.frame;
      const img = imagesRef.current[frameIndex];
      if (img && ctx && img.complete && img.naturalHeight !== 0) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // object-fit: cover logic
        const hRatio = canvas.width / img.width;
        const vRatio = canvas.height / img.height;
        const ratio = Math.max(hRatio, vRatio);
        const centerShift_x = (canvas.width - img.width * ratio) / 2;
        const centerShift_y = (canvas.height - img.height * ratio) / 2;
        
        ctx.drawImage(
          img,
          0,
          0,
          img.width,
          img.height,
          centerShift_x,
          centerShift_y,
          img.width * ratio,
          img.height * ratio
        );
      }
    };

    // Draw first frame
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        render();
      }
    };
    
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // GSAP ScrollTrigger Sequence
    const st = gsap.to(frameRef.current, {
      frame: FRAME_COUNT - 1,
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5, // viscous scrubbing
      },
      onUpdate: render,
    });

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      st.kill();
    };
  }, [loaded]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full z-0">
      {!loaded && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black z-50">
          <p className="text-white text-sm tracking-widest font-light mb-4 text-center uppercase">
            {progress < 100 ? "Extracting Essence..." : "Chilling..."}
          </p>
          <div className="w-64 h-[1px] bg-white/20 relative overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-[#C96A82] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      <div className="sticky top-0 left-0 w-full h-screen bg-black overflow-hidden pointer-events-none flex justify-end">
        <div className="w-full md:w-1/2 h-full">
          <canvas ref={canvasRef} className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
}
