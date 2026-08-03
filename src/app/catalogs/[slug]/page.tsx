import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import AutoDownloader from "./AutoDownloader";

async function getCatalog(slug: string) {
  const cleanSlug = slug.replace('.pdf', '');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  // Use Service Role Key to bypass RLS when fetching for metadata and server rendering
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: catalog, error } = await supabase
    .from("page_catalogs")
    .select("*")
    .eq("slug", cleanSlug)
    .single();

  if (error || !catalog) {
    return null;
  }

  return catalog;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const catalog = await getCatalog(resolvedParams.slug);
  
  if (!catalog) {
    return {
      title: "Catalog Not Found | Goals Floors",
    };
  }

  return {
    title: catalog.meta_title || `${catalog.name} | Goals Floors Catalogs`,
    description: catalog.meta_description,
    keywords: catalog.seo_keywords ? catalog.seo_keywords.split(",") : [catalog.name, "Goals Floors", "PDF Catalog"],
    openGraph: {
      images: catalog.image ? [catalog.image] : [],
    },
  };
}

export default async function CatalogSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const catalog = await getCatalog(resolvedParams.slug);

  if (!catalog) {
    notFound();
  }

  return (
    <div className="fixed inset-0 z-[2147483647] bg-slate-900 flex flex-col">
      {/* Hidden visually, but available for crawlers and screen readers */}
      <div className="sr-only">
        <a href="/" className="flex items-center gap-2">
          <span className="text-xl font-black text-white tracking-widest"><span className="text-amber-500">GOALS</span> FLOORS</span>
        </a>
        <h1 className="text-slate-300 font-medium text-sm truncate">{catalog.name}</h1>
      </div>
      
      <div className="flex-grow w-full">
        <iframe 
          src={catalog.url} 
          className="w-full h-full border-none" 
          title={catalog.name}
          allowFullScreen
        />
      </div>
      <AutoDownloader url={catalog.url} />
    </div>
  );
}
