import { SpaceFruitCanvas } from "./SpaceFruitCanvas";
import { ArrowDown } from "lucide-react";

export function FloatingHero() {
    return (
        <section className="relative w-full h-screen overflow-hidden bg-obsidian text-foreground flex flex-col justify-center items-center">
            <SpaceFruitCanvas />

            <div className="z-10 text-center flex flex-col items-center pointer-events-auto mix-blend-difference">
                <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-magenta drop-shadow-[0_0_20px_rgba(255,0,127,0.5)]">
                    DRGN CRUSH
                </h1>
                <p className="mt-6 text-xl md:text-2xl font-medium tracking-widest text-slate-300">
                    ZERO GRAVITY REFRESHMENT
                </p>

                <button className="mt-12 px-8 py-4 bg-magenta text-white font-bold tracking-widest rounded-full hover:bg-magenta-400 hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,0,127,0.4)]">
                    CRUSH YOUR THIRST
                </button>
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce">
                <ArrowDown size={32} className="text-magenta" />
            </div>
        </section>
    );
}
