import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/data";
import ProductClient, { Product } from "./ProductClient";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug) as Product | null;

  if (!product) {
    return {
      title: "Product Not Found | Goals Floors",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${product.title} | Premium B2B Supplier in NCR | Goals Floors`;
  const description = product.shortDescription;
  const canonical = `/products/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      url: canonical,
      title,
      description,
      images: [product.images[0]?.url],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug) as Product | null;

  if (!product) {
    notFound();
  }

  return <ProductClient product={product} />;
}