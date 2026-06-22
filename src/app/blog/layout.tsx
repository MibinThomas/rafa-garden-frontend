import { Metadata } from "next";
import dbConnect from "@/lib/mongodb";
import SeoSettings from "@/models/SeoSettings";

export async function generateMetadata(): Promise<Metadata> {
  try {
    await dbConnect();
    const seo = await SeoSettings.findOne({ page: "blog" });
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
    console.error("Failed to generate metadata for blog:", error);
  }
  return {
    title: "Sanctuary Stories | Rafah Garden Blog",
    description: "Read updates, recipes, and botanical insights from our dragon fruit farm.",
  };
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
