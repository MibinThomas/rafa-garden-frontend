import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/CartContext";
import { HeaderColorProvider } from "@/lib/HeaderColorContext";
import { WishlistProvider } from "@/lib/WishlistContext";
import { SiteSettingsProvider } from "@/lib/SiteSettingsContext";
import { RootLayoutWrapper } from "@/components/RootLayoutWrapper";

export const metadata: Metadata = {
  title: "Rafah Garden | Heritage Pitaya Sanctuary",
  description: "Experience the botanical essence of Rafah's premium dragon fruit harvest.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <HeaderColorProvider>
        <SiteSettingsProvider>
          <CartProvider>
            <WishlistProvider>
              <RootLayoutWrapper>
                {children}
              </RootLayoutWrapper>
            </WishlistProvider>
          </CartProvider>
        </SiteSettingsProvider>
      </HeaderColorProvider>
    </html>
  );
}
