import { Metadata } from "next";
import dbConnect from "@/lib/mongodb";
import SeoSettings from "@/models/SeoSettings";

export async function generateMetadata(): Promise<Metadata> {
  try {
    await dbConnect();
    const seo = await SeoSettings.findOne({ page: "shop" });
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
    console.error("Failed to generate metadata for shop:", error);
  }
  return {
    title: "Shop Botanical Assets | Rafah Garden",
    description: "Purchase premium organic pitaya dragon fruit harvests and live plants.",
  };
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
