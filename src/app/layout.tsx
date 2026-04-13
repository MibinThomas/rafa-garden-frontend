import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/CartContext";
import { HeaderColorProvider } from "@/lib/HeaderColorContext";
import { WishlistProvider } from "@/lib/WishlistContext";
import { SiteSettingsProvider } from "@/lib/SiteSettingsContext";
import { RootLayoutWrapper } from "@/components/RootLayoutWrapper";

import dbConnect from "@/lib/mongodb";
import SiteContent from "@/models/SiteContent";

export const metadata: Metadata = {
  title: "Rafah Garden | Heritage Pitaya Sanctuary",
  description: "Experience the botanical essence of Rafah's premium dragon fruit harvest.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let primaryFont = "";
  let secondaryFont = "";
  
  try {
    await dbConnect();
    const primaryDb = await SiteContent.findOne({ key: "global.font.primary" });
    const secondaryDb = await SiteContent.findOne({ key: "global.font.secondary" });
    if (primaryDb?.value) primaryFont = primaryDb.value;
    if (secondaryDb?.value) secondaryFont = secondaryDb.value;
  } catch (error) {
    console.error("Failed to fetch custom fonts:", error);
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: `
          ${primaryFont ? `
          @font-face {
            font-family: 'Dynamic-Primary';
            src: url('${primaryFont}');
            font-display: swap;
          }
          :root {
            --font-playfair: 'Dynamic-Primary', serif !important;
            --font-brand-heading: 'Dynamic-Primary', sans-serif !important;
          }
          ` : ''}
          ${secondaryFont ? `
          @font-face {
            font-family: 'Dynamic-Secondary';
            src: url('${secondaryFont}');
            font-display: swap;
          }
          :root {
            --font-inter: 'Dynamic-Secondary', sans-serif !important;
            --font-avant-garde: 'Dynamic-Secondary', sans-serif !important;
          }
          ` : ''}
        `}} />
      </head>
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
