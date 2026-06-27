import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/CartContext";
import { HeaderColorProvider } from "@/lib/HeaderColorContext";
import { WishlistProvider } from "@/lib/WishlistContext";
import { SiteSettingsProvider } from "@/lib/SiteSettingsContext";
import { RootLayoutWrapper } from "@/components/RootLayoutWrapper";


import SeoSettings from "@/models/SeoSettings";

export async function generateMetadata(): Promise<Metadata> {
  try {
    await dbConnect();
    const seo = await SeoSettings.findOne({ page: "home" });
    if (seo) {
      return {
        title: seo.metaTitle,
        description: seo.metaDescription,
        keywords: seo.keywords,
        openGraph: seo.ogImage ? {
          images: [{ url: seo.ogImage }]
        } : undefined
      };
    }
  } catch (error) {
    console.warn("Failed to generate dynamic homepage metadata, using defaults.");
  }
  return {
    title: "Rafah Garden | Heritage Pitaya Sanctuary",
    description: "Experience the botanical essence of Rafah's premium dragon fruit harvest.",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
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
