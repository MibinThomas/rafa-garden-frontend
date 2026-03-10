"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, MessageCircle, X, MessageSquare } from "lucide-react";
import { Chatbot } from "./Chatbot";

export function FloatingContactMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);

    // Custom WhatsApp SVG Icon
    const WhatsAppIcon = () => (
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
    );

    const ACTIONS = [
        { id: 'mail', icon: <Mail size={20} />, label: 'Email Us', href: 'mailto:contact@rafagarden.com' },
        { id: 'whatsapp', icon: <WhatsAppIcon />, label: 'WhatsApp', href: 'https://wa.me/1234567890' },
        { id: 'phone', icon: <Phone size={20} />, label: 'Call Us', href: 'tel:+1234567890' },
        { id: 'location', icon: <MapPin size={20} />, label: 'Visit Us', href: '#' },
        { id: 'chat', icon: <MessageCircle size={20} />, label: 'Live Chat', href: '#' },
    ];

    const handleActionClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        if (id === 'chat') {
            e.preventDefault();
            setIsChatOpen(true);
            setIsOpen(false);
        }
    };

    return (
        <>
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center justify-end">
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex flex-col items-center gap-3 mb-4 overflow-visible"
                        >
                            {ACTIONS.map((action, index) => (
                                <motion.a
                                    key={action.id}
                                    href={action.href}
                                    onClick={(e) => handleActionClick(e, action.id)}
                                    initial={{ opacity: 0, y: 15, scale: 0.8 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 15, scale: 0.8 }}
                                    transition={{
                                        duration: 0.2,
                                        delay: (ACTIONS.length - 1 - index) * 0.05
                                    }}
                                    className="w-12 h-12 rounded-full border-[1.5px] border-[#d4af37] bg-[#050505] text-white flex items-center justify-center shadow-lg hover:scale-110 hover:bg-[#d4af37] hover:text-[#0b2b1a] transition-all group relative"
                                    aria-label={action.label}
                                >
                                    {action.icon}

                                    {/* Tooltip */}
                                    <span className="absolute right-14 bg-[#050505] text-[#fffdd0] border border-[#d4af37]/30 text-xs px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none drop-shadow-md">
                                        {action.label}
                                    </span>
                                </motion.a>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Toggle Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-300 transform active:scale-90 hover:scale-105 ${isOpen || isChatOpen
                            ? "bg-[#050505] border-[1.5px] border-[#d4af37] text-[#d4af37]"
                            : "bg-[#d4af37] text-[#0b2b1a]"
                        }`}
                    aria-label="Toggle Contact Menu"
                >
                    <AnimatePresence mode="wait">
                        {(isOpen || isChatOpen) ? (
                            <motion.div
                                key="close"
                                initial={{ opacity: 0, rotate: -90 }}
                                animate={{ opacity: 1, rotate: 0 }}
                                exit={{ opacity: 0, rotate: 90 }}
                                transition={{ duration: 0.2 }}
                            >
                                <X size={26} strokeWidth={2} onClick={(e) => {
                                    if (isChatOpen) {
                                        e.stopPropagation();
                                        setIsChatOpen(false);
                                    }
                                }} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="open"
                                initial={{ opacity: 0, rotate: -90 }}
                                animate={{ opacity: 1, rotate: 0 }}
                                exit={{ opacity: 0, rotate: 90 }}
                                transition={{ duration: 0.2 }}
                            >
                                <MessageSquare size={26} strokeWidth={2} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </button>
            </div>

            <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </>
    );
}
