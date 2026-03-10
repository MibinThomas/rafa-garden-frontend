import { SpaceFruitCanvas } from "./SpaceFruitCanvas";
import { ArrowDown } from "lucide-react";

export function FloatingHero() {
    return (
        <section className="relative w-full h-screen overflow-hidden bg-white dark:bg-obsidian transition-colors duration-300 text-foreground flex flex-col justify-center items-center">
            <SpaceFruitCanvas />

            <div className="z-10 text-center flex flex-col items-center pointer-events-auto">
                <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#38b000] drop-shadow-[0_0_20px_rgba(56,176,0,0.5)]">
                    RAFA GARDEN
                </h1>
                <p className="mt-6 text-xl md:text-2xl font-serif tracking-widest text-[#0b2b1a] dark:text-[#fffdd0] bg-white/20 dark:bg-transparent backdrop-blur-sm dark:backdrop-blur-none px-4 py-1 rounded-full">
                    ESSENCE OF KERALA HERITAGE
                </p>

                <button className="mt-12 px-8 py-4 bg-[#123e25] border border-[#d4af37] text-[#d4af37] font-bold tracking-widest rounded-full hover:bg-[#d4af37] hover:text-[#0b2b1a] hover:scale-105 transition-all shadow-[0_4px_30px_rgba(212,175,55,0.4)] dark:shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                    EXPLORE THE GARDEN
                </button>
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce">
                <ArrowDown size={32} className="text-[#38b000] dark:text-magenta" />
            </div>
        </section>
    );
}
