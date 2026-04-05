import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/CartContext";
import { HeaderColorProvider } from "@/lib/HeaderColorContext";
import { RootLayoutWrapper } from "@/components/RootLayoutWrapper";

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
      <HeaderColorProvider>
        <CartProvider>
          <RootLayoutWrapper>
            {children}
          </RootLayoutWrapper>
        </CartProvider>
      </HeaderColorProvider>
    </html>
  );
}
