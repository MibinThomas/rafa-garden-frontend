"use client";

import { useEffect, useRef, useState } from "react";

export function ScrollTrackingImage() {
    const imgRef = useRef<HTMLImageElement>(null);
    const [slide, setSlide] = useState(0);

    useEffect(() => {
        function handleSlideChange(e: any) {
            setSlide(e.detail);
        }
        window.addEventListener('updateHeroSlide', handleSlideChange);
        return () => window.removeEventListener('updateHeroSlide', handleSlideChange);
    }, []);

    useEffect(() => {
        let animationFrameId: number;

        const updatePosition = () => {
            if (!imgRef.current) return;

            const heroEl = document.getElementById("hero-visual-slot");
            const gridEl = document.getElementById("product-image-1");
            const realGridImg = document.getElementById("grid-real-image-1");

            if (!heroEl || !gridEl) return;

            const scrollY = window.scrollY;
            const heroRect = heroEl.getBoundingClientRect();
            const gridRect = gridEl.getBoundingClientRect();

            // Total distance to scroll
            const totalDist = (scrollY + gridRect.top) - (scrollY + heroRect.top);
            let progress = 0;
            if (totalDist > 0) {
                progress = Math.max(0, Math.min(scrollY / (totalDist * 0.8), 1));
            }

            const ease = progress < 0.5 ? 4 * progress * Math.pow(progress, 2) : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            const width = heroRect.width + (gridRect.width - heroRect.width) * ease;
            const height = heroRect.height + (gridRect.height - heroRect.height) * ease;
            const left = heroRect.left + (gridRect.left - heroRect.left) * ease;
            const top = heroRect.top + (gridRect.top - heroRect.top) * ease;

            // Apply slight rotation tilt in the hero that straightens out when hitting the grid
            const rotation = (1 - ease) * 15;

            imgRef.current.style.width = `${width}px`;
            imgRef.current.style.height = `${height}px`;
            imgRef.current.style.transform = `translate(${left}px, ${top}px) rotate(${rotation}deg)`;

            if (realGridImg) {
                if (progress >= 0.99) {
                    realGridImg.style.opacity = "1";
                    imgRef.current.style.opacity = "0";
                } else {
                    realGridImg.style.opacity = "0";
                    imgRef.current.style.opacity = slide === 0 ? "1" : Math.max(0, 1 - (progress * 2)).toString();
                }
            } else {
                imgRef.current.style.opacity = slide === 0 ? "1" : "0";
            }
        };

        const onScroll = () => {
            animationFrameId = requestAnimationFrame(updatePosition);
        };

        window.addEventListener("scroll", onScroll);
        window.addEventListener("resize", onScroll);

        // Initial positioning
        setTimeout(updatePosition, 100);

        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            cancelAnimationFrame(animationFrameId);
        };
    }, [slide]);

    return (
        <div className="fixed inset-0 z-30 pointer-events-none">
            {/* We will load roohafza.png, keeping the drop shadow to separate it beautifully from background */}
            <img
                ref={imgRef}
                src="/products/roohafza.png"
                alt="Rafah Roohafza"
                className="absolute object-contain transition-opacity duration-300 drop-shadow-[0_20px_40px_rgba(201,106,130,0.6)] dark:drop-shadow-[0_20px_40px_rgba(201,106,130,0.3)] p-4"
                style={{ top: 0, left: 0, transformOrigin: "center center", opacity: 0 }}
            />
        </div>
    );
}
