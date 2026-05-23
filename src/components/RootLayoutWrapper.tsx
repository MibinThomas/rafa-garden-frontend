"use client";

import React from "react";
import { useHeaderColor } from "@/lib/HeaderColorContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { FloatingHeader } from "@/components/FloatingHeader";
import { Footer } from "@/components/Footer";
import { CartModal } from "@/components/CartModal";
import { usePathname } from "next/navigation";

export function RootLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { headerColor, isImmersive } = useHeaderColor();
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <div
      className="flex-1 flex flex-col transition-colors duration-1000"
      style={{ backgroundColor: isImmersive ? headerColor : "#f1f1f2" }}
    >
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <FloatingHeader />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <Footer />
        <CartModal />
      </ThemeProvider>
    </div>
  );
}
