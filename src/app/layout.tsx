import type { Metadata } from "next";
import { Inter, Playfair_Display, Outfit, Montserrat } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/CartContext";
import { HeaderColorProvider } from "@/lib/HeaderColorContext";
import { WishlistProvider } from "@/lib/WishlistContext";
import { SiteSettingsProvider } from "@/lib/SiteSettingsContext";
import { RootLayoutWrapper } from "@/components/RootLayoutWrapper";

import dbConnect from "@/lib/mongodb";
import SiteContent from "@/models/SiteContent";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const montserrat = Montserrat({ 
  subsets: ["latin"], 
  weight: ["600", "700"],
  variable: "--font-montserrat" 
});

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
    console.warn("Failed to fetch custom fonts from DB, using defaults. Is MongoDB running?");
  }

  const fontClasses = `${inter.variable} ${playfair.variable} ${outfit.variable} ${montserrat.variable}`;

  return (
    <html lang="en" suppressHydrationWarning className={fontClasses}>
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
      <body className="text-[#5d5f61] antialiased font-sans min-h-screen flex flex-col">
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
      </body>
    </html>
  );
}
