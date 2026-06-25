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

  // Helper: parse specs from variant.details into additionalProperty array
  const buildAdditionalProperty = (details: Record<string, string>) =>
    Object.entries(details || {}).map(([name, value]) => ({
      "@type": "PropertyValue",
      name,
      value,
    }));

  // Helper: build MRP offer (highPrice for AggregateOffer)
  const parseMrp = (mrp?: string) =>
    mrp ? parseFloat(mrp.replace(/[^0-9.]/g, '')) || undefined : undefined;

  const productGroupSchemas: any[] = [];

  if (product.variants && Array.isArray(product.variants)) {
    product.variants.forEach((card: any) => {
      const parsedPrice =
        typeof card.priceValue === 'number'
          ? card.priceValue
          : (typeof card.price === 'string'
              ? parseFloat(card.price.replace(/[^0-9.]/g, ''))
              : 0) || 0;

      const parsedMrp = parseMrp(card.mrp);
      const images = Array.isArray(card.images) ? card.images : [];

      // Use THIS card's own description — never bleed from another card
      const cardDescription =
        card.gmc_description?.trim() ||
        card.gmc_title?.trim() ||
        product.shortDescription ||
        'Premium product';

      const availability =
        card.availability === 'out_of_stock'
          ? 'https://schema.org/OutOfStock'
          : 'https://schema.org/InStock';

      const condition =
        card.condition === 'refurbished'
          ? 'https://schema.org/RefurbishedCondition'
          : 'https://schema.org/NewCondition';

      const additionalProperty = buildAdditionalProperty(card.details || {});

      if (images.length === 0) {
        // Card with no images → single flat Product
        productGroupSchemas.push({
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: card.name || product.title,
          description: cardDescription,
          image: allInstalledImageUrls.length > 0 ? allInstalledImageUrls : undefined,
          sku: card.name || slug,
          mpn: card.name || slug,
          brand: { '@type': 'Brand', name: card.brand || 'Goals Floors' },
          ...(additionalProperty.length > 0 ? { additionalProperty } : {}),
          offers: {
            '@type': 'Offer',
            price: parsedPrice,
            ...(parsedMrp ? { priceValidUntil: new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10) } : {}),
            priceCurrency: card.currency || 'INR',
            url: canonical,
            availability,
            itemCondition: condition,
            seller: { '@type': 'Organization', name: 'Goals Floors' },
          },
        });
      } else {
        // Card WITH images → ProductGroup where each design code = one Product variant
        const hasVariant = images
          .map((img: any) => {
            const variantImg = getAbsoluteUrl(img.url);
            if (!variantImg) return null;

            // Variant name: prefer img.gmc_title, then img.name (design code like FP-701),
            // then img.alt, then fall back to card name
            const variantName =
              img.gmc_title?.trim() ||
              (img.name ? `${card.name} — ${img.name}` : null) ||
              img.alt?.trim() ||
              card.name;

            const variantDescription =
              img.gmc_variant_description?.trim() || cardDescription;

            const variantSku = img.name?.trim() || card.name;

            // Include both the design-code image AND installed-images for rich context
            const variantImages = [variantImg, ...allInstalledImageUrls].filter(Boolean);

            return {
              '@type': 'Product',
              name: variantName,
              description: variantDescription,
              image: variantImages,
              sku: variantSku,
              mpn: variantSku,
              brand: { '@type': 'Brand', name: card.brand || 'Goals Floors' },
              ...(additionalProperty.length > 0 ? { additionalProperty } : {}),
              offers: {
                '@type': 'Offer',
                price: parsedPrice,
                priceCurrency: card.currency || 'INR',
                url: canonical,
                availability,
                itemCondition: condition,
                seller: { '@type': 'Organization', name: 'Goals Floors' },
              },
            };
          })
          .filter(Boolean);

        if (hasVariant.length > 0) {
          productGroupSchemas.push({
            '@context': 'https://schema.org',
            '@type': 'ProductGroup',
            name: card.gmc_title?.trim() || card.name || product.title,
            description: cardDescription,
            productGroupID: `${slug}-${(card.name || '').replace(/\s+/g, '-').toLowerCase()}`,
            brand: { '@type': 'Brand', name: card.brand || 'Goals Floors' },
            variesBy: 'https://schema.org/color',
            ...(additionalProperty.length > 0 ? { additionalProperty } : {}),
            hasVariant,
          });
        }
      }
    });
  }

  // Include accessories in the schema
  if (product.accessories && Array.isArray(product.accessories)) {
    product.accessories.forEach((acc: any) => {
      const parsedPrice =
        typeof acc.priceValue === 'number'
          ? acc.priceValue
          : (typeof acc.price === 'string'
              ? parseFloat(acc.price.replace(/[^0-9.]/g, ''))
              : 0) || 0;

      const additionalProperty = buildAdditionalProperty(acc.details || {});

      productGroupSchemas.push({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: acc.name,
        description: acc.note || product.shortDescription || 'Accessory',
        image: acc.image ? [getAbsoluteUrl(acc.image)] : undefined,
        sku: acc.name,
        mpn: acc.name,
        brand: { '@type': 'Brand', name: 'Goals Floors' },
        ...(additionalProperty.length > 0 ? { additionalProperty } : {}),
        offers: {
          '@type': 'Offer',
          price: parsedPrice,
          priceCurrency: 'INR',
          url: canonical,
          availability: 'https://schema.org/InStock',
          itemCondition: 'https://schema.org/NewCondition',
          seller: { '@type': 'Organization', name: 'Goals Floors' },
        },
      });
    });
  }

  return (
    <>
      {/* Each schema as its own <script> tag — Google parses them independently */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {productGroupSchemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <ProductClient product={product} />
    </>
  );
}