import React from "react";
import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";
import { ChevronRight, FileText, MessageCircle } from "lucide-react";
import CatalogViewerClient from "./CatalogViewerClient";
import CatalogDownloadButton from "./CatalogDownloadButton";
import { getCatalogDownloadUrl } from "@/lib/catalog-helpers";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getCatalogData(rawSlug: string) {
  const cleanSlug = rawSlug.replace(/\.pdf$/i, "");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Fetch all catalogs so we can implement an optimal, distributed circular mesh (Ring Topology)
  const { data: allCatalogs, error } = await supabase
    .from("page_catalogs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !allCatalogs || allCatalogs.length === 0) {
    return { catalog: null, related: [], cleanSlug };
  }

  const currentIndex = allCatalogs.findIndex((c: any) => c.slug === cleanSlug);
  if (currentIndex === -1) {
    return { catalog: null, related: [], cleanSlug };
  }

  const catalog = allCatalogs[currentIndex];

  // Distributed Ring Topology for Internal Linking:
  // Instead of every page pointing to the same 4 catalogs, we pick 4 catalogs in a circular chain.
  // Catalog i links to (i+1), (i+2), (i+3), (i+4) mod total.
  // This guarantees that EVERY catalog in the entire database receives exactly 4 inbound internal links!
  const total = allCatalogs.length;
  const related = [];
  for (let offset = 1; offset <= Math.min(4, total - 1); offset++) {
    const targetIndex = (currentIndex + offset) % total;
    related.push(allCatalogs[targetIndex]);
  }

  return { catalog, related, cleanSlug };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { catalog, cleanSlug } = await getCatalogData(slug);

  if (!catalog) {
    return {
      title: "Catalog Not Found | Goals Floors",
    };
  }

  const title = catalog.meta_title || `${catalog.name} | Goals Floors Official PDF Brochure`;
  const description =
    catalog.meta_description ||
    `Download and explore the official ${catalog.name} PDF catalog by Goals Floors. Specifications, dimensions, and architectural textures in Gurgaon & Delhi NCR.`;
  const canonicalUrl = `https://goalsfloors.com/catalogs/${cleanSlug}`;

  return {
    title,
    description,
    keywords: catalog.seo_keywords
      ? catalog.seo_keywords.split(",").map((k: string) => k.trim())
      : [catalog.name, "PDF Catalog", "Goals Floors", "Gurgaon Architectural Surfaces"],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "article",
      images: catalog.image ? [{ url: catalog.image, alt: catalog.name }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: catalog.image ? [catalog.image] : [],
    },
  };
}

export default async function CatalogSlugPage({ params }: PageProps) {
  const { slug } = await params;

  // If a legacy request arrives with .pdf extension, permanently redirect to clean SEO canonical URL
  if (slug.toLowerCase().endsWith(".pdf")) {
    const clean = slug.replace(/\.pdf$/i, "");
    permanentRedirect(`/catalogs/${clean}`);
  }

  const { catalog, related, cleanSlug } = await getCatalogData(slug);

  if (!catalog) {
    notFound();
  }

  const downloadUrl = getCatalogDownloadUrl(catalog.url);
  const canonicalUrl = `https://goalsfloors.com/catalogs/${cleanSlug}`;

  // Structured Data (Schema.org)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://goalsfloors.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Product Catalogs",
            "item": "https://goalsfloors.com/catalogs"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": catalog.name,
            "item": canonicalUrl
          }
        ]
      },
      {
        "@type": "DigitalDocument",
        "name": catalog.name,
        "headline": catalog.name,
        "description": catalog.meta_description,
        "url": canonicalUrl,
        "encodingFormat": "application/pdf",
        "thumbnailUrl": catalog.image,
        "publisher": {
          "@type": "Organization",
          "name": "Goals Floors",
          "url": "https://goalsfloors.com",
          "logo": {
            "@type": "ImageObject",
            "url": "https://goalsfloors.com/icon.png"
          }
        }
      }
    ]
  };

  return (
    <>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        
        {/* Top Header & Breadcrumbs */}
        <section className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md pt-5 pb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Breadcrumb Links */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-400 mb-3 flex-wrap">
              <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
              <ChevronRight size={13} className="text-slate-600" />
              <Link href="/catalogs" className="hover:text-amber-400 transition-colors">Catalogs</Link>
              <ChevronRight size={13} className="text-slate-600" />
              <span className="text-amber-400 font-medium truncate max-w-[220px] sm:max-w-none">
                {catalog.name}
              </span>
            </nav>

            {/* Main Catalog Title and Clean Visible SEO Description */}
            <div className="max-w-4xl">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight mb-2 sm:mb-3">
                {catalog.name}
              </h1>
              
              {catalog.meta_description && (
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
                  {catalog.meta_description}
                </p>
              )}
            </div>

          </div>
        </section>

        {/* Interactive PDF Reader Main Section */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full flex-grow">
          <CatalogViewerClient 
            catalog={{
              id: catalog.id,
              name: catalog.name,
              slug: cleanSlug,
              url: catalog.url,
              image: catalog.image
            }}
            downloadUrl={downloadUrl}
          />

          {/* Related Catalogs Grid (Distributed Circular Mesh for SEO) */}
          {related && related.length > 0 && (
            <section className="mt-16 pt-10 border-t border-slate-800/80">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    More Architectural <span className="text-amber-500">Catalogs</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Explore complementary wall paneling, ceiling systems, and luxury flooring brochures.
                  </p>
                </div>
                <Link 
                  href="/catalogs" 
                  className="text-xs sm:text-sm font-bold text-amber-500 hover:text-amber-400 flex items-center gap-1 transition"
                >
                  View All <ChevronRight size={14} />
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {related.map((rel: any) => (
                  <Link
                    key={rel.id}
                    href={`/catalogs/${rel.slug}`}
                    className="group flex flex-col bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="relative h-32 sm:h-40 w-full bg-slate-950 overflow-hidden">
                      {rel.image ? (
                        <Image
                          src={rel.image}
                          alt={rel.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-700">
                          <FileText size={36} />
                        </div>
                      )}
                    </div>
                    <div className="p-3 sm:p-4 flex flex-col flex-grow">
                      <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1 mb-1">
                        {rel.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mb-3 flex-grow">
                        {rel.meta_description || "Download official PDF brochure & specifications."}
                      </p>
                      <span className="text-[11px] font-bold text-amber-500 flex items-center gap-1 mt-auto">
                        View Catalog <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Bottom Lead / Project Supply CTA Banner */}
          <section className="mt-16 bg-gradient-to-r from-amber-500/10 via-slate-900 to-amber-500/10 border border-amber-500/30 rounded-3xl p-6 sm:p-10 text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 mb-4">
              Wholesale & Project Supply
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3">
              Need Samples or On-Site Measurement in Delhi NCR?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto mb-6">
              Connect with Goals Floors™ architectural experts in Gurgaon. We provide physical catalog folders, texture swatches, and turnkey installation support for modern residential & commercial projects.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <CatalogDownloadButton
                downloadUrl={downloadUrl}
                label={`Download ${catalog.name}`}
                className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/25 transition cursor-pointer"
                size={16}
              />
              <a
                href="https://wa.me/917217644573?text=Hi%20Goals%20Floors,%20I%20would%20like%20to%20request%20samples%20and%20pricing%20for%20my%20project."
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition"
              >
                <MessageCircle size={16} /> Chat with Specialist
              </a>
            </div>
          </section>

        </main>

      </div>
    </>
  );
}
