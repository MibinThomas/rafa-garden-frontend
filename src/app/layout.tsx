import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/CartContext";
import { CartSidebar } from "@/components/CartSidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { FloatingContactMenu } from "@/components/FloatingContactMenu";

const inter = Inter({ subsets: ["latin"], variable: "--font-geist-sans" });

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
        className={`${inter.variable} min-h-screen bg-white dark:bg-obsidian text-[#0b2b1a] dark:text-white antialiased font-sans flex flex-col transition-colors duration-300`}
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
