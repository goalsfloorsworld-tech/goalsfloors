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
      images: [
        {
          url: product.images[0]?.url,
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
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

  // TASK 1: Dynamic FAQ Schema (server-rendered, unique per product)
  const faqSchema = product.faqs && product.faqs.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": product.faqs.map((faq: { question: string; answer: string }) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer,
          },
        })),
      }
    : null;

  return (
    <>
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <ProductClient product={product} />
    </>
  );
}