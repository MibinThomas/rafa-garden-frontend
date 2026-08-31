import { CATEGORIES } from "@/lib/data";
import { ProductPageClient } from "@/components/ProductPageClient";
import { Metadata } from "next";
import dbConnect from "@/lib/mongodb";
import ProductModel from "@/models/Product";
import CategoryModel from "@/models/Category";

async function getLiveProductAndCategory(id: string) {
  try {
    await dbConnect();
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    let productDoc: any = null;

    if (isObjectId) {
      productDoc = await ProductModel.findById(id).lean();
    }
    if (!productDoc) {
      productDoc = await ProductModel.findOne({ $or: [{ id: id }, { slug: id }] }).lean();
    }

    if (productDoc) {
      let categoryDoc: any = null;
      if (productDoc.category) {
        categoryDoc = await CategoryModel.findOne({ title: productDoc.category }).lean();
      }
      if (!categoryDoc) {
        categoryDoc = await CategoryModel.findOne({}).lean();
      }

      const formattedProduct = JSON.parse(JSON.stringify({
        ...productDoc,
        id: productDoc.id || productDoc._id?.toString(),
        variants: productDoc.variants?.length ? productDoc.variants : [
          { size: "Standard", unit: "", price: productDoc.offerPrice || productDoc.price || 599 }
        ]
      }));

      const formattedCategory = categoryDoc
        ? JSON.parse(JSON.stringify(categoryDoc))
        : CATEGORIES[0];

      return { product: formattedProduct, category: formattedCategory };
    }
  } catch (err) {
    console.error("Error fetching live product from DB:", err);
  }

  // Fallback to static CATEGORIES dataset
  const staticProduct = CATEGORIES.flatMap((c) => c.products).find(
    (p) => p.id === id || (p as any)._id === id
  );
  const staticCategory = CATEGORIES.find((c) =>
    c.products.some((p) => p.id === id || (p as any)._id === id)
  );

  return { product: staticProduct || null, category: staticCategory || CATEGORIES[0] };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { product } = await getLiveProductAndCategory(id);
  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} | Rafah Garden`,
    description: product.description || product.subtitle || "Premium Botanical Product",
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { product, category } = await getLiveProductAndCategory(id);

  if (!product || !category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f1f1f2]">
        <h1 className="text-2xl font-bold opacity-20 capitalize tracking-widest text-black/10">
          Product Not Found
        </h1>
      </div>
    );
  }

  return <ProductPageClient product={product} category={category} />;
}

