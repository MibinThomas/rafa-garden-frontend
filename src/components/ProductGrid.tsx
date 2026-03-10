"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/CartContext";
import { ShoppingCart, Heart, Eye, Share2 } from "lucide-react";
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
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto z-10 relative bg-white dark:bg-obsidian transition-colors duration-300">
            <div className="mb-20 flex flex-col items-start justify-start text-left">
                <span className="text-[#d4af37] text-sm font-bold tracking-[0.3em] uppercase mb-4 block">Handcrafted in Kerala</span>
                <h2 className="text-4xl md:text-6xl font-serif text-[#0b2b1a] dark:text-[#fffdd0] drop-shadow-[0_2px_10px_rgba(212,175,55,0.2)] transition-colors duration-300">
                    Our Products
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-[#d4af37] to-transparent mt-6"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
                {PRODUCTS.map((product, i) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="group flex flex-col relative"
                    >
                        {/* Image Container */}
                        <div className="relative w-full aspect-[4/5] overflow-hidden bg-gray-100 dark:bg-[#0a0a0a]">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />

                            {/* Floating Icons Overlaid - White Square Icons */}
                            <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 z-20">
                                <button className="w-10 h-10 flex items-center justify-center bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:text-[#d4af37] dark:hover:text-[#d4af37] hover:border-[#d4af37] dark:hover:border-[#d4af37] transition-all shadow-sm">
                                    <Heart size={18} strokeWidth={1.5} />
                                </button>
                                <button className="w-10 h-10 flex items-center justify-center bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:text-[#d4af37] dark:hover:text-[#d4af37] hover:border-[#d4af37] dark:hover:border-[#d4af37] transition-all shadow-sm">
                                    <Eye size={18} strokeWidth={1.5} />
                                </button>
                                <button className="w-10 h-10 flex items-center justify-center bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:text-[#d4af37] dark:hover:text-[#d4af37] hover:border-[#d4af37] dark:hover:border-[#d4af37] transition-all shadow-sm">
                                    <Share2 size={18} strokeWidth={1.5} />
                                </button>
                            </div>
                        </div>

                        {/* Full Width Add to Cart Button */}
                        <button
                            onClick={(e) => handleDragClick(e, product)}
                            className="w-full py-4 flex items-center justify-center gap-2 bg-[#0b2b1a] text-white dark:bg-[#050505] dark:text-[#d4af37] font-semibold hover:bg-[#d4af37] hover:text-[#0b2b1a] dark:hover:bg-[#d4af37] dark:hover:text-[#0b2b1a] transition-colors duration-300 dark:border dark:border-[#d4af37]/20"
                        >
                            <ShoppingCart size={20} strokeWidth={1.5} />
                            <span className="text-sm tracking-wide">Add to Cart</span>
                        </button>

                        {/* Product Details (Name & Price) */}
                        <div className="pt-5 flex flex-col items-start text-left">
                            <h3 className="text-xl text-[#0b2b1a] dark:text-[#fffdd0] transition-colors duration-300 font-sans font-medium mb-2 group-hover:text-[#d4af37] dark:group-hover:text-[#d4af37]">
                                {product.name}
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 font-sans text-lg">
                                ${product.price.toFixed(2)}
                            </p>
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
