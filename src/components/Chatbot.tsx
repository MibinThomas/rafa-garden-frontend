"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot } from "lucide-react";

interface Message {
    id: string;
    sender: "bot" | "user";
    text: string;
    options?: string[];
}

const INITIAL_MESSAGE: Message = {
    id: "1",
    sender: "bot",
    text: "Welcome to Rafa Garden! How can we help you plant the seeds of wellness today?",
    options: ["Our Products", "Order Status", "Shipping Info", "Talk to an Expert"],
};

export function Chatbot({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleOptionClick = (option: string) => {
        const userMsg: Message = { id: Date.now().toString(), sender: "user", text: option };
        setMessages((prev) => [...prev, userMsg]);

        // Simulate bot thinking
        setTimeout(() => {
            let botResponse: Message = { id: (Date.now() + 1).toString(), sender: "bot", text: "" };

            switch (option) {
                case "Our Products":
                    botResponse.text = "We offer a variety of crushes and jams made from authentic Kerala-grown fruits. Are you looking for something specific?";
                    botResponse.options = ["Crushes", "Jams", "Best Sellers", "Back to Main Menu"];
                    break;
                case "Order Status":
                    botResponse.text = "To check your order status, please enter your order ID below (e.g., RG-12345).";
                    break;
                case "Shipping Info":
                    botResponse.text = "We offer free shipping within Kerala on orders over $50! Standard international shipping takes 5-10 business days.";
                    botResponse.options = ["Calculate Shipping", "Back to Main Menu"];
                    break;
                case "Talk to an Expert":
                    botResponse.text = "Connecting you to our garden experts... Please hold on, or leave your email below so we can get back to you.";
                    break;
                case "Crushes":
                case "Jams":
                case "Best Sellers":
                    botResponse.text = "Excellent choice! You can explore these directly from our Products section on the homepage.";
                    botResponse.options = ["Back to Main Menu"];
                    break;
                case "Calculate Shipping":
                    botResponse.text = "Please enter your location/zip code to estimate shipping manually.";
                    break;
                case "Back to Main Menu":
                    botResponse = { ...INITIAL_MESSAGE, id: Date.now().toString() };
                    break;
                default:
                    botResponse.text = "I'm still learning! Our team will get back to you shortly.";
                    botResponse.options = ["Back to Main Menu"];
            }

            setMessages((prev) => [...prev, botResponse]);
        }, 600);
    };

    const handleManualSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const text = formData.get("message") as string;
        if (!text.trim()) return;

        e.currentTarget.reset();
        const userMsg: Message = { id: Date.now().toString(), sender: "user", text };
        setMessages((prev) => [...prev, userMsg]);

        setTimeout(() => {
            const botResponse: Message = {
                id: (Date.now() + 1).toString(),
                sender: "bot",
                text: "Thanks for your message! Our team will respond shortly.",
                options: ["Back to Main Menu"]
            };
            setMessages((prev) => [...prev, botResponse]);
        }, 600);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="fixed bottom-24 right-6 w-[350px] h-[500px] bg-white dark:bg-[#050505] rounded-2xl shadow-2xl border border-gray-200 dark:border-[#d4af37]/30 flex flex-col overflow-hidden z-[60]"
                >
                    {/* Header */}
                    <div className="bg-[#0b2b1a] p-4 flex items-center justify-between border-b border-[#d4af37]/30">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#d4af37] flex items-center justify-center text-[#0b2b1a] shadow-inner">
                                <Bot size={22} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[#fffdd0] font-serif font-bold leading-tight tracking-wide">Garden Assistant</span>
                                <span className="text-[#38b000] text-[10px] uppercase tracking-widest flex items-center gap-1 mt-0.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#38b000] animate-pulse"></span> Online
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-[#fffdd0]/70 hover:text-[#d4af37] transition-colors p-1"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-[#0a0a0a]">
                        {messages.map((msg) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={msg.id}
                                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                            >
                                <div
                                    className={`max-w-[85%] p-3.5 rounded-2xl text-[14px] leading-relaxed font-sans shadow-sm ${msg.sender === "user"
                                            ? "bg-[#0b2b1a] text-[#fffdd0] rounded-tr-[4px]"
                                            : "bg-white dark:bg-[#111] text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-white/10 rounded-tl-[4px]"
                                        }`}
                                >
                                    {msg.text}
                                </div>

                                {/* Options/Filters */}
                                {msg.options && (
                                    <div className="flex flex-wrap gap-2 mt-3 w-full max-w-[90%]">
                                        {msg.options.map((opt) => (
                                            <button
                                                key={opt}
                                                onClick={() => handleOptionClick(opt)}
                                                className="text-[12px] px-3.5 py-2 bg-white dark:bg-transparent border border-[#d4af37] text-[#0b2b1a] dark:text-[#d4af37] rounded-full hover:bg-[#d4af37] hover:text-[#0b2b1a] dark:hover:bg-[#d4af37] dark:hover:text-[#0b2b1a] transition-all shadow-sm text-left font-medium active:scale-95"
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form
                        onSubmit={handleManualSubmit}
                        className="p-3 bg-white dark:bg-[#050505] border-t border-gray-200 dark:border-white/10 flex items-center gap-2"
                    >
                        <input
                            name="message"
                            type="text"
                            placeholder="Type your message..."
                            className="flex-1 bg-gray-100 dark:bg-[#111] text-gray-800 dark:text-gray-200 border border-transparent dark:border-white/5 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#d4af37]/70 placeholder-gray-500 transition-all font-sans"
                            autoComplete="off"
                        />
                        <button
                            type="submit"
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#123e25] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0b2b1a] transition-colors flex-shrink-0 shadow-sm"
                            aria-label="Send message"
                        >
                            <Send size={16} className="-ml-0.5" />
                        </button>
                    </form>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
