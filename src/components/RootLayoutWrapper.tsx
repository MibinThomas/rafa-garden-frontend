"use client";

import React from "react";
import { useHeaderColor } from "@/lib/HeaderColorContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { FloatingHeader } from "@/components/FloatingHeader";
import { CartModal } from "@/components/CartModal";
import { Inter, Playfair_Display, Outfit, Montserrat } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const montserrat = Montserrat({ 
  subsets: ["latin"], 
  weight: ["600", "700"],
  variable: "--font-montserrat" 
});

export function RootLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { headerColor, isImmersive } = useHeaderColor();

  return (
    <body
      className={`${inter.variable} ${playfair.variable} ${outfit.variable} ${montserrat.variable} min-h-screen text-[#0b2b1a] antialiased font-sans flex flex-col transition-colors duration-1000`}
      style={{ backgroundColor: isImmersive ? headerColor : "#f1f1f2" }}
    >
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <FloatingHeader />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <CartModal />
      </ThemeProvider>
    </body>
  );
}
