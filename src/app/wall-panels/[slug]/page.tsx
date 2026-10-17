import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WALL_PANELS_EXPERIENCE } from "@/data/wall-panels-experience";
import WallPanelScrollytelling from "@/components/wall-panels/WallPanelScrollytelling";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(WALL_PANELS_EXPERIENCE).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const panel = WALL_PANELS_EXPERIENCE[slug];

  if (!panel) {
    return {
      title: "Wall Panel Not Found | Goals Floors",
      robots: { index: false, follow: false },
    };
  }

  const baseUrl = "https://goalsfloors.com";
  const canonical = `${baseUrl}/wall-panels/${slug}`;
  const title = `${panel.title} | Wholesale Gurgaon & NCR - Goals Floors`;
  const description = `${panel.subtitle}. ${panel.description.slice(0, 160)}... Wholesale rates starting from ${panel.startingPrice}/sq.ft in Gurgaon & Delhi NCR.`;
  const resolvedHeroImage = panel.heroImage.startsWith("http")
    ? panel.heroImage
    : `${baseUrl}${panel.heroImage.startsWith("/") ? "" : "/"}${panel.heroImage}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Goals Floors",
      images: [
        {
          url: resolvedHeroImage,
          width: 1200,
          height: 630,
          alt: panel.title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [resolvedHeroImage],
    },
  };
}

export default async function WallPanelPage({ params }: PageProps) {
  const { slug } = await params;
  const panel = WALL_PANELS_EXPERIENCE[slug];

  if (!panel) {
    notFound();
  }

  const baseUrl = "https://goalsfloors.com";
  const canonical = `${baseUrl}/wall-panels/${slug}`;
  const resolvedHeroImage = panel.heroImage.startsWith("http")
    ? panel.heroImage
    : `${baseUrl}${panel.heroImage.startsWith("/") ? "" : "/"}${panel.heroImage}`;

  // Schema.org structured data for product, laboratory testing, and rich snippet
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: panel.title,
    image: resolvedHeroImage,
    description: panel.description,
    sku: `GF-${slug.toUpperCase()}-PANEL`,
    mpn: `GF-${slug.toUpperCase()}-2026`,
    brand: {
      "@type": "Brand",
      name: "Goals Floors",
    },
    manufacturer: {
      "@type": "Organization",
      name: "Goals Floors Gurgaon",
      url: baseUrl,
    },
    category: "Wall Paneling & Architectural Louvers",
    areaServed: [
      { "@type": "City", name: "Gurgaon" },
      { "@type": "AdministrativeArea", name: "Delhi NCR" },
      { "@type": "City", name: "Noida" },
      { "@type": "City", name: "Faridabad" },
    ],
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: panel.startingPrice.replace(/[^\d.]/g, ""),
      highPrice: "650",
      offerCount: "1000",
      priceValidUntil: "2027-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability: "https://schema.org/InStock",
      url: canonical,
      seller: {
        "@type": "Organization",
        name: "Goals Floors Gurgaon",
        url: baseUrl,
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "148",
      bestRating: "5",
      worstRating: "1",
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Water Absorption Rate",
        value: "0.0%",
        propertyID: "ASTM-D570",
      },
      {
        "@type": "PropertyValue",
        name: "Seelan & Dampness Immunity",
        value: "100% Impermeable Closed-Cell Virgin Polymer Core",
      },
      {
        "@type": "PropertyValue",
        name: "Scratch Resistance Armor",
        value: "Class 1 Commercial Grade",
        propertyID: "ASTM-D3363",
      },
      {
        "@type": "PropertyValue",
        name: "Termite Resistance",
        value: "100% Termite & Borer Immune (Zero Organic Wood Fillers)",
      },
      {
        "@type": "PropertyValue",
        name: "Fire Retardant Standard",
        value: "Class B1 Self-Extinguishing",
      },
      {
        "@type": "PropertyValue",
        name: "Panel Width",
        value: panel.dimensions.width,
      },
      {
        "@type": "PropertyValue",
        name: "Panel Length",
        value: panel.dimensions.height,
      },
    ],
  };

  // Breadcrumbs Schema for Google Search Rich Navigation Snippet
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Wall Panels",
        item: `${baseUrl}/products`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: panel.title,
        item: canonical,
      },
    ],
  };

  // FAQ Schema for Google Search Rich Snippet Accordion
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: panel.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <WallPanelScrollytelling panel={panel} />
    </>
  );
}
