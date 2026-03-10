"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/CartContext";
import { ShoppingBag } from "lucide-react";

interface Product {
    id: string;
    name: string;
    price: number;
    color: string;
    description: string;
}

const PRODUCTS: Product[] = [
    { id: "1", name: "Neon Pitaya", price: 4.99, color: "from-magenta to-purple-600", description: "The original zero-G fuel." },
    { id: "2", name: "Arctic Crush", price: 5.49, color: "from-cyan-400 to-blue-600", description: "Menthol-infused deep space chill." },
    { id: "3", name: "Solar Flare", price: 5.99, color: "from-orange-500 to-red-600", description: "Spicy mango meets crushed dragon fruit." },
    { id: "4", name: "Void Berry", price: 6.49, color: "from-indigo-600 to-obsidian", description: "Dark berry medley with a heavy gravitational pull." },
    { id: "5", name: "Plasma Punch", price: 5.49, color: "from-green-400 to-emerald-700", description: "Electrifying kiwi and green pitaya synergy." },
    { id: "6", name: "Quantum Citrus", price: 4.99, color: "from-yellow-400 to-orange-500", description: "A burst of uncontainable zesty energy." },
];

export function ProductGrid() {
    const { addToCart } = useCart();
    const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);

    const handleDragClick = (e: React.MouseEvent<HTMLButtonElement>, product: Product) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        // Create 15 particles for the 3D droplet explosion
        for (let i = 0; i < 15; i++) {
            setParticles((prev) => [
                ...prev,
                { id: Date.now() + i, x: e.clientX, y: e.clientY },
            ]);
        }

        addToCart(product);
    };

    return (
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto z-10 relative bg-obsidian">
            <div className="mb-16 text-center">
                <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500 lowercase tracking-tighter">
                    Our Formulas
                </h2>
            </div>

            <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                {PRODUCTS.map((product, i) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        animate={{
                            y: [0, -10, 0, 5, 0], // Brownian motion
                            x: [0, 5, 0, -5, 0],
                        }}
                        transition={{
                            duration: 10 + i * 2,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        whileHover={{ y: -20, scale: 1.02, transition: { duration: 0.3 } }}
                        className={`relative overflow-hidden rounded-3xl p-8 break-inside-avoid backdrop-blur-md bg-white/5 border border-white/10 group shadow-[0_10px_40px_rgba(0,0,0,0.5)]`}
                    >
                        {/* Ambient glowing orb for the product */}
                        <div className={`absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-gradient-to-br ${product.color} opacity-20 blur-3xl pointer-events-none group-hover:opacity-40 transition-opacity duration-500 rounded-full`} />

                        <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                            <div>
                                <h3 className="text-3xl font-bold text-white mb-2">{product.name}</h3>
                                <p className="text-gray-400 font-medium leading-relaxed">{product.description}</p>
                            </div>

                            <div className="flex items-center justify-between mt-auto">
                                <span className="text-2xl font-mono text-magenta border-b border-magenta/30 pb-1">
                                    ${product.price.toFixed(2)}
                                </span>

                                <button
                                    onClick={(e) => handleDragClick(e, product)}
                                    className="flex items-center justify-center p-4 bg-white/10 text-white rounded-full hover:bg-magenta hover:shadow-[0_0_20px_#FF007F] transition-all group-active:scale-95"
                                    aria-label={`Add ${product.name} to cart`}
                                >
                                    <ShoppingBag size={24} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Particle container fixed to viewport */}
            <div className="fixed inset-0 pointer-events-none z-50">
                <AnimatePresence>
                    {particles.map((p) => {
                        const angle = Math.random() * Math.PI * 2;
                        const distance = Math.random() * 200 + 50;
                        return (
                            <motion.div
                                key={p.id}
                                initial={{
                                    x: p.x,
                                    y: p.y,
                                    opacity: 1,
                                    scale: Math.random() * 1.5 + 0.5,
                                }}
                                animate={{
                                    x: p.x + Math.cos(angle) * distance,
                                    y: p.y - Math.random() * 300 - 100, // drift upward
                                    opacity: 0,
                                    scale: 0,
                                }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1 + Math.random(), ease: "easeOut" }}
                                onAnimationComplete={() => {
                                    setParticles((prev) => prev.filter((item) => item.id !== p.id));
                                }}
                                className="absolute w-4 h-4 rounded-full bg-magenta shadow-[0_0_10px_#FF007F] backdrop-blur-md"
                                style={{
                                    background: `radial-gradient(circle at 30% 30%, #FF99CC, #FF007F)`,
                                }}
                            />
                        );
                    })}
                </AnimatePresence>
            </div>
        </section>
    );
}
