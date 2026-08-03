import React from "react";
import { FileText } from "lucide-react";
import CatalogsClient from "./CatalogsClient";

export const metadata = {
  title: "All Product Catalogs & Brochures | Download PDFs | Goals Floors",
  description: "The official repository for all Goals Floors product catalogs. Download high-quality PDF brochures for Upfit Panels, WPC Decking, Artificial Grass, Louvers, and more premium architectural surfaces in Gurgaon & Delhi NCR.",
  keywords: ["Product Catalogs", "Goals Floors Brochures", "Download PDF Catalogs", "Wall Panels Catalog", "Flooring Catalog Delhi NCR"]
};

export default function CatalogsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-10 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
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

        <CatalogsClient />

      </div>
    </div>
  );
}
