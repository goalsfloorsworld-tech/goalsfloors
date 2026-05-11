import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/data";
import ProductClient, { Product } from "./ProductClient";

function collectProductImageUrls(product: Product) {
  const imageUrls = [
    ...(product.images || []).map((image) => image.url),
    ...(product.installedImages || []).map((image) => image.url),
    ...(product.beforeAfter || []).flatMap((pair) => [pair.before.url, pair.after.url]),
    ...(product.variants || []).flatMap((variant) => (variant.images || []).map((image) => image.url)),
  ];

  return Array.from(new Set(imageUrls.filter(Boolean)));
}

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
  const baseUrl = "https://goalsfloors.com";
  const canonical = `${baseUrl}/products/${slug}`;
  const imageUrlRaw = product.images[0]?.url || "";
  const absoluteImageUrl = imageUrlRaw.startsWith("http")
    ? imageUrlRaw
    : `${baseUrl}${imageUrlRaw.startsWith("/") ? "" : "/"}${imageUrlRaw}`;

  let optimizedImageUrl = absoluteImageUrl;
  if (optimizedImageUrl.includes("res.cloudinary.com") && optimizedImageUrl.includes("/upload/")) {
    optimizedImageUrl = optimizedImageUrl.replace("/upload/", "/upload/f_jpg,q_70,w_1200,h_630,c_fill/");
  }

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      url: canonical,
      title,
      description,
      siteName: "Goals Floors",
      images: [
        {
          url: optimizedImageUrl,
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ],
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [optimizedImageUrl],
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

  // TASK 2: Product Rich Snippets Schema
  const hasVariants = product.variants && product.variants.length > 0;
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "description": product.shortDescription,
    "image": collectProductImageUrls(product),
    ...(hasVariants && {
      "offers": product.variants!.map((v: any) => ({
        "@type": "Offer",
        "name": v.name,
        "price": v.priceValue || 0,
        "priceCurrency": v.currency || "INR",
        "availability": v.availability === "in_stock" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "itemCondition": v.condition === "new" ? "https://schema.org/NewCondition" : "https://schema.org/Condition",
      }))
    })
  };

  return (
    <>
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <ProductClient product={product} />
    </>
  );
}