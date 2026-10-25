import React from "react";
import { FileText } from "lucide-react";
import CatalogsClient from "./CatalogsClient";
import { getPublicCatalogs } from "@/actions/public-catalogs";

export const metadata = {
  title: "Official GOALS™ Catalogs & PDF Brochures | Goals Floors",
  description: "Download the official GOALS™ product catalogs and PDF brochures. High-resolution specifications for GOALS Panels, GOALS SPC Flooring, GOALS PU Stone, GOALS Tokyo Moldings, and architectural surfaces in Gurgaon & Delhi NCR.",
  keywords: [
    "GOALS",
    "GOALS Catalog",
    "GOALS Panels",
    "GOALS Flooring",
    "GOALS PU Stone",
    "GOALS Tokyo Molding",
    "GOALS Molding",
    "GOALS Artificial Grass",
    "GOALS Brochures",
    "Goals Floors Catalogs",
    "Download PDF Catalogs",
    "Wall Panels Catalog Delhi NCR"
  ],
  alternates: {
    canonical: "https://goalsfloors.com/catalogs",
  },
};

export default async function CatalogsPage() {
  const initialCatalogs = await getPublicCatalogs();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-10 pb-16">
      <div className="w-full max-w-[1800px] px-4 sm:px-8 md:px-12 lg:px-14 xl:px-16 2xl:px-20 mx-auto">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-500 font-bold text-sm mb-6">
            <FileText size={16} /> Official Brochures
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-6">
            Product <span className="text-amber-500 italic">Catalogs</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Download our detailed product catalogs to explore dimensions, specifications, textures, and installation guidelines for your premium architectural projects.
          </p>
        </div>

        <CatalogsClient initialCatalogs={initialCatalogs} />

      </div>
    </div>
  );
}
