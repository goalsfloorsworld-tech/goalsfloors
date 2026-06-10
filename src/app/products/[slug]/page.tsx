import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/data";
import ProductClient, { Product } from "./ProductClient";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 3600; // ISR cache for 1 hour
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

  const title = product.metatitle || `${product.title} | Premium B2B Supplier in NCR | Goals Floors`;
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

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const { data: dbProducts, error } = await supabase
      .from('page_products')
      .select('product_data')
      .eq('page_slug', slug);

    if (!error && dbProducts) {
      const dynamicProducts = dbProducts.map(row => row.product_data);
      product.variants = [...(product.variants || []), ...dynamicProducts];
    }

    const { data: dbImages, error: imgError } = await supabase
      .from('page_installed_images')
      .select('image_url, alt_text, aspect_ratio')
      .eq('page_slug', slug);

    if (!imgError && dbImages) {
      const dynamicImages = dbImages.map(row => ({
        url: row.image_url,
        alt: row.alt_text,
        aspect: row.aspect_ratio
      }));
      product.installedImages = [...(product.installedImages || []), ...dynamicImages];
    }
  } catch (err) {
    console.error("Failed to fetch dynamic products:", err);
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

  const baseUrl = "https://goalsfloors.com";
  const canonical = `${baseUrl}/products/${slug}`;


  const getAbsoluteUrl = (url?: string) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
  };
  
  const allInstalledImageUrls = Array.isArray(product.installedImages) 
    ? product.installedImages.map((img: any) => getAbsoluteUrl(img.url)).filter(Boolean)
    : [];

  const productGroupSchemas: any[] = [];

  if (product.variants && Array.isArray(product.variants)) {
    product.variants.forEach((card: any) => {
      const parsedPrice = typeof card.priceValue === 'number' ? card.priceValue : 
                         (typeof card.price === 'string' ? parseFloat(card.price.replace(/[^0-9.]/g, '')) : 0) || 0;
                         
      const images = Array.isArray(card.images) ? card.images : [];
      
      const productGroup: any = {
        "@context": "https://schema.org",
        "@type": "ProductGroup",
        "name": card.name || product.title,
        "description": card.gmc_description?.trim() || product.shortDescription || "Premium product",
        "productGroupID": `${slug}-${(card.name || '').replace(/\s+/g, '-').toLowerCase()}`,
        "brand": {
          "@type": "Brand",
          "name": "Goals Floors"
        },
        "hasVariant": []
      };

      if (images.length === 0) {
        productGroupSchemas.push({
          "@context": "https://schema.org",
          "@type": "Product",
          "name": card.name || product.title || "Product Variant",
          "image": allInstalledImageUrls.length > 0 ? allInstalledImageUrls : undefined,
          "description": card.gmc_description?.trim() || product.shortDescription || "Premium product",
          "sku": card.name || slug,
          "brand": {
            "@type": "Brand",
            "name": "Goals Floors"
          },
          "offers": {
            "@type": "Offer",
            "price": parsedPrice,
            "priceCurrency": card.currency || "INR",
            "url": canonical,
            "availability": card.availability === "out_of_stock" ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
            "itemCondition": card.condition === "refurbished" ? "https://schema.org/RefurbishedCondition" : "https://schema.org/NewCondition"
          }
        });
      } else {
        productGroup.hasVariant = images.map((img: any) => ({
          "@type": "Product",
          "name": img.gmc_title?.trim() || img.name?.trim() || img.alt?.trim() || card.name || product.title || "Product Variant",
          "image": [getAbsoluteUrl(img.url), ...allInstalledImageUrls].filter(Boolean),
          "description": img.gmc_variant_description?.trim() || card.gmc_description?.trim() || product.shortDescription || "Premium product",
          "sku": img.name?.trim() || card.name || slug,
          "offers": {
            "@type": "Offer",
            "price": parsedPrice,
            "priceCurrency": card.currency || "INR",
            "url": canonical,
            "availability": card.availability === "out_of_stock" ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
            "itemCondition": card.condition === "refurbished" ? "https://schema.org/RefurbishedCondition" : "https://schema.org/NewCondition"
          }
        })).filter((v: any) => v.image && v.image.length > 0); // Ensure we don't push variants without an image
        
        if (productGroup.hasVariant.length > 0) {
          productGroupSchemas.push(productGroup);
        }
      }
    });
  }

  const finalJsonLd = [
    ...(faqSchema ? [faqSchema] : []),
    ...productGroupSchemas
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(finalJsonLd) }}
      />
      <ProductClient product={product} />
    </>
  );
}