import { Metadata } from "next";
import dbConnect from "@/lib/mongodb";
import SeoSettings from "@/models/SeoSettings";

export async function generateMetadata(): Promise<Metadata> {
  try {
    await dbConnect();
    const seo = await SeoSettings.findOne({ page: "contact" });
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
    console.error("Failed to generate metadata for contact:", error);
  }
  return {
    title: "Contact our Collective | Rafah Garden",
    description: "Get in touch with the Rafah Garden sanctuary team.",
  };
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
