import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/CartContext";
import { HeaderColorProvider } from "@/lib/HeaderColorContext";
import { WishlistProvider } from "@/lib/WishlistContext";
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
          <WishlistProvider>
            <RootLayoutWrapper>
              {children}
            </RootLayoutWrapper>
          </WishlistProvider>
        </CartProvider>
      </HeaderColorProvider>
    </html>
  );
}
