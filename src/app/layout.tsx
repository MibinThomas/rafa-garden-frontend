import type { Metadata } from "next";
import { Inter, Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/CartContext";
import { CartSidebar } from "@/components/CartSidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { FloatingContactMenu } from "@/components/FloatingContactMenu";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "DRGN CRUSH | Zero Gravity Refreshment",
  description: "High-performance e-commerce template for DRGN CRUSH.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} ${outfit.variable} min-h-screen bg-[#f1f1f2] text-[#0b2b1a] antialiased font-sans flex flex-col transition-colors duration-300`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <CartProvider>
            {children}
            <CartSidebar />
            <FloatingContactMenu />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
