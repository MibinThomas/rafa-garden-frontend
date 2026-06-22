import { Metadata } from "next";
import dbConnect from "@/lib/mongodb";
import SeoSettings from "@/models/SeoSettings";

export async function generateMetadata(): Promise<Metadata> {
  try {
    await dbConnect();
    const seo = await SeoSettings.findOne({ page: "profile" });
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
    console.error("Failed to generate metadata for profile:", error);
  }
  return {
    title: "Member Sanctuary | Rafah Garden",
    description: "Manage your botanical orders and support queries.",
  };
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
