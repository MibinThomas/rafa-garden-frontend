"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/CartContext";
import { ShoppingBag, Droplets, Utensils } from "lucide-react";
import Image from "next/image";

interface Product {
    id: string;
    name: string;
    price: number;
    color: string;
    description: string;
    type: "crush" | "jam";
    image: string;
}

const PRODUCTS: Product[] = [
    { id: "1", name: "Dragon Fruit Crush", type: "crush", price: 12.99, color: "from-[#FF007F] to-[#CC0066]", description: "Authentic Kerala-grown dragon fruit, cold-pressed into a refreshing crush.", image: "/products/dragon_fruit_crush.png" },
    { id: "2", name: "Mango Passion Jam", type: "jam", price: 8.49, color: "from-[#F59E0B] to-[#D97706]", description: "Hand-picked Alphonso mangoes and wild passion fruit preserve.", image: "/products/mango_passion_jam.png" },
    { id: "3", name: "Spiced Pineapple Crush", type: "crush", price: 10.99, color: "from-[#FCD34D] to-[#B45309]", description: "Farm-fresh pineapple crushed with a hint of Kerala cardamom and clove.", image: "/products/spiced_pineapple_crush.png" },
    { id: "4", name: "Mixed Berry Jam", type: "jam", price: 9.99, color: "from-[#6366F1] to-[#4338CA]", description: "Rich, dark forest berries slowly cooked in traditional brass urulis.", image: "/products/mixed_berry_jam.png" },
    { id: "5", name: "Guava Chilli Crush", type: "crush", price: 11.49, color: "from-[#34D399] to-[#047857]", description: "A sweet and spicy crush made from pink guavas and a pinch of Kanthari chilli.", image: "/products/guava_chilli_crush.png" },
    { id: "6", name: "Star Fruit Marmalade", type: "jam", price: 7.99, color: "from-[#FDE047] to-[#CA8A04]", description: "Tangy carambola slices suspended in a beautiful golden sweet jelly.", image: "/products/star_fruit_marmalade.png" },
];

export function ProductGrid() {
    const { addToCart } = useCart();
    const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string }[]>([]);

    const handleDragClick = (e: React.MouseEvent<HTMLButtonElement>, product: Product) => {
        const rect = e.currentTarget.getBoundingClientRect();

        // Use the first color from the gradient to color the particles
        const extractColor = product.color.split(" ")[0].replace("from-[", "").replace("]", "");

        // Create 12 particles for a splash effect
        for (let i = 0; i < 12; i++) {
            setParticles((prev) => [
                ...prev,
                { id: Date.now() + i, x: e.clientX, y: e.clientY, color: extractColor },
            ]);
        }

        addToCart(product);
    };

    return (
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto z-10 relative bg-[#050505]">
            <div className="mb-20 flex flex-col items-center justify-center text-center">
                <span className="text-[#d4af37] text-sm font-bold tracking-[0.3em] uppercase mb-4 block">Handcrafted in Kerala</span>
                <h2 className="text-4xl md:text-6xl font-serif text-[#fffdd0] drop-shadow-[0_2px_10px_rgba(212,175,55,0.2)]">
                    Our Products
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mt-6"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {PRODUCTS.map((product, i) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        whileHover={{ y: -10, transition: { duration: 0.3 } }}
                        className={`relative flex flex-col overflow-hidden rounded-t-[3rem] rounded-b-2xl p-1 break-inside-avoid backdrop-blur-md bg-[#0b2b1a]/80 border border-[#d4af37]/20 group shadow-[0_10px_30px_rgba(0,0,0,0.8)] hover:shadow-[0_15px_40px_rgba(212,175,55,0.15)] transition-all duration-500`}
                    >
                        {/* Inner Container to mimic bottle shape or premium label wrapper */}
                        <div className="bg-[#050505]/90 rounded-t-[2.9rem] rounded-b-xl p-8 flex flex-col h-full relative z-10 overflow-hidden">
                            {/* Colorful backdrop ambient glow matching product */}
                            <div className={`absolute -top-20 -right-20 w-48 h-48 bg-gradient-to-br ${product.color} opacity-[0.15] blur-3xl rounded-full group-hover:opacity-30 transition-opacity duration-700 pointer-events-none`} />

                            {/* Product Image */}
                            <div className="relative w-full h-56 mb-6 -mt-8 -mx-8 bg-[#030303] overflow-hidden rounded-t-[2.9rem] flex-shrink-0">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover opacity-80 group-hover:opacity-100 transition-all group-hover:scale-105 duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/90 to-transparent pointer-events-none" />
                            </div>

                            {/* Label Header */}
                            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold tracking-[0.2em] text-[#d4af37] uppercase">Rafa Garden</span>
                                    <span className="text-xs text-gray-500 uppercase tracking-wider">{product.type}</span>
                                </div>
                                <div className="p-2 bg-gradient-to-tr from-white/5 to-white/10 rounded-full border border-white/10 z-10">
                                    {product.type === "crush" ? (
                                        <Droplets size={16} className="text-[#38b000]" />
                                    ) : (
                                        <Utensils size={16} className="text-[#F59E0B]" />
                                    )}
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="flex-grow flex flex-col justify-start mb-6">
                                <h3 className="text-2xl font-serif text-[#fffdd0] mb-3 leading-snug group-hover:text-[#d4af37] transition-colors duration-300">
                                    {product.name}
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed font-light">
                                    {product.description}
                                </p>
                            </div>

                            {/* Add to Cart / Price footer */}
                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5 relative z-10">
                                <span className="text-2xl font-light text-[#fffdd0]">
                                    <span className="text-[#d4af37] text-lg mr-1">$</span>
                                    {product.price.toFixed(2)}
                                </span>

                                <button
                                    onClick={(e) => handleDragClick(e, product)}
                                    className="flex items-center justify-center p-3 px-5 gap-2 bg-[#123e25] text-[#d4af37] rounded-full border border-[#d4af37]/30 hover:bg-[#d4af37] hover:text-[#0b2b1a] hover:border-[#d4af37] transition-all active:scale-95 group/btn"
                                    aria-label={`Add ${product.name} to cart`}
                                >
                                    <span className="text-xs font-bold tracking-widest uppercase">Add</span>
                                    <ShoppingBag size={16} />
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
                        const distance = Math.random() * 150 + 50;
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
                                    y: p.y - Math.random() * 200 - 50, // drift upward
                                    opacity: 0,
                                    scale: 0,
                                }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.8 + Math.random() * 0.5, ease: "easeOut" }}
                                onAnimationComplete={() => {
                                    setParticles((prev) => prev.filter((item) => item.id !== p.id));
                                }}
                                className="absolute w-3 h-3 rounded-full shadow-lg backdrop-blur-md"
                                style={{
                                    background: `radial-gradient(circle at 30% 30%, #ffffff, ${p.color})`,
                                    boxShadow: `0 0 10px ${p.color}`,
                                }}
                            />
                        );
                    })}
                </AnimatePresence>
            </div>
        </section>
    );
}
