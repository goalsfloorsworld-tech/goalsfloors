import type { Metadata } from "next";
import Link from "next/link";
import productsData from "@/data/products.json";
import ProductClient, { Product } from "./ProductClient";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = productsData.find((p) => p.slug === slug);

  if (!product) {
    return {
      title: "Product Not Found | Goals Floors",
    };
  }

  const title = `${product.title} | Premium B2B Supplier in NCR | Goals Floors`;
  const description = product.shortDescription;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [product.images[0]],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = productsData.find((p) => p.slug === slug) as Product | undefined;

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="text-center">
          <h1 className="text-2xl font-medium text-gray-900 dark:text-white mb-2">Product Not Found</h1>
          <Link href="/products" className="text-amber-600 dark:text-amber-500 hover:underline">Return to Catalog</Link>
        </div>
      </div>
    );
  }

  return <ProductClient product={product} slug={slug} />;
}