"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Download, ChevronRight, FileText, Loader2 } from "lucide-react";
import { getPublicCatalogs } from "@/actions/public-catalogs";
import { usePublicStore } from "@/lib/public-store";
import { getCatalogDownloadUrl } from "@/lib/catalog-helpers";

interface CatalogsClientProps {
  initialCatalogs?: any[];
}

export default function CatalogsClient({ initialCatalogs }: CatalogsClientProps) {
  const { catalogs, setCatalogs } = usePublicStore();
  
  // Use initialCatalogs if passed from SSR, otherwise fall back to Zustand store
  const [dataList, setDataList] = useState<any[]>(initialCatalogs || catalogs || []);
  const [loading, setLoading] = useState(!initialCatalogs && !catalogs);

  useEffect(() => {
    if (initialCatalogs && initialCatalogs.length > 0) {
      setCatalogs(initialCatalogs);
      setDataList(initialCatalogs);
      setLoading(false);
      return;
    }

    async function fetchCatalogs() {
      // If we already have catalogs in the Zustand cache, don't fetch again!
      if (catalogs && catalogs.length > 0) {
        setDataList(catalogs);
        setLoading(false);
        return;
      }
      
      const data = await getPublicCatalogs();
      setCatalogs(data);
      setDataList(data);
      setLoading(false);
    }
    
    fetchCatalogs();
  }, [initialCatalogs, catalogs, setCatalogs]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="w-10 h-10 animate-spin text-amber-500 mb-4" />
        <p className="text-slate-500 font-medium">Loading catalogs...</p>
      </div>
    );
  }

  if (!dataList || dataList.length === 0) {
    return (
      <div className="text-center py-20 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-6">
          <FileText className="text-slate-400 w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Catalogs Available</h3>
        <p className="text-slate-500">We are currently updating our digital brochures. Please check back later.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
      {dataList.map((catalog: any, index: number) => {
        const cleanSlug = (catalog.slug || "").replace(/\.pdf$/i, "");
        const downloadUrl = getCatalogDownloadUrl(catalog.url);
        const description = catalog.meta_description || catalog.metaDescription || "";

        return (
          <div 
            key={catalog.id || index}
            className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-500 hover:-translate-y-2"
          >
            {/* Image Section */}
            <div className="relative h-32 sm:h-56 w-full overflow-hidden bg-white dark:bg-slate-900">
              <Link href={`/catalogs/${cleanSlug}`} className="block w-full h-full">
                {catalog.image ? (
                  <Image
                    src={catalog.image}
                    alt={catalog.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-300 dark:text-slate-700">
                    <FileText size={48} className="opacity-40 sm:w-16 sm:h-16" />
                  </div>
                )}
              </Link>
              
              {/* Quick direct download floating button */}
              <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100">
                <a
                  href={downloadUrl}
                  download
                  title={`Direct download ${catalog.name} PDF`}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xl hover:bg-amber-600 hover:scale-110 transition-all"
                >
                  <Download size={14} className="sm:w-[18px] sm:h-[18px]" strokeWidth={2.5} />
                </a>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-col flex-grow p-3 sm:p-4 z-10">
              <h3 className="text-xs sm:text-base font-semibold text-slate-800 dark:text-slate-100 mb-1 leading-tight line-clamp-2">
                <Link href={`/catalogs/${cleanSlug}`} className="hover:text-amber-500 transition-colors">
                  {catalog.name}
                </Link>
              </h3>
              
              {description && (
                <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mb-3 flex-grow">
                  {description}
                </p>
              )}
              
              <div className="pt-2 sm:pt-2 border-t border-slate-100 dark:border-slate-800 mt-auto">
                <Link
                  href={`/catalogs/${cleanSlug}`}
                  className="w-full py-2 sm:py-2.5 rounded-md sm:rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] sm:text-sm flex items-center justify-center gap-1 sm:gap-2 transition-colors shadow-sm"
                >
                  View Catalog
                  <ChevronRight size={12} className="sm:w-3.5 sm:h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
