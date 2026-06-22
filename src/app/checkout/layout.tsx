import { Metadata } from "next";
import dbConnect from "@/lib/mongodb";
import SeoSettings from "@/models/SeoSettings";

export async function generateMetadata(): Promise<Metadata> {
  try {
    await dbConnect();
    const seo = await SeoSettings.findOne({ page: "checkout" });
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
    console.error("Failed to generate metadata for checkout:", error);
  }
  return {
    title: "Secure Settlement | Rafah Garden",
    description: "Finalize your botanical asset reservations.",
  };
}

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
