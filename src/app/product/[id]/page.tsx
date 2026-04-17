import { CATEGORIES } from "@/lib/data";
import { ProductPageClient } from "@/components/ProductPageClient";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = CATEGORIES.flatMap(c => c.products).find(p => p.id === id);
  if (!product) return { title: "Product Not Found" };
  
  return {
    title: `${product.name} | Rafah Garden`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Find product and its parent category
  const product = CATEGORIES.flatMap(c => c.products).find(p => p.id === id);
  const category = CATEGORIES.find(c => c.products.some(p => p.id === id));

  if (!product || !category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#e6e7e8]">
        <h1 className="text-2xl font-bold opacity-20 uppercase tracking-widest text-black/10">Product Not Found</h1>
      </div>
    );
  }

  return <ProductPageClient product={product} category={category} />;
}
