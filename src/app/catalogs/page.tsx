import Image from "next/image";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { Metadata } from "next";
import { Download, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "All Product Catalogs & Brochures | Download PDFs | Goals Floors",
  description: "The official repository for all Goals Floors product catalogs. Download high-quality PDF brochures for Upfit Panels, WPC Decking, Artificial Grass, Louvers, and more premium architectural surfaces in Gurgaon & Delhi NCR.",
  keywords: ["Product Catalogs", "Goals Floors Brochures", "Download PDF Catalogs", "Wall Panels Catalog", "Flooring Catalog Delhi NCR"]
};

export default function CatalogsPage() {
  const catalogsPath = path.join(process.cwd(), 'src', 'data', 'catalogs.json');
  let catalogs = [];
  
  try {
    const catalogsData = fs.readFileSync(catalogsPath, 'utf8');
    catalogs = JSON.parse(catalogsData);
  } catch (error) {
    console.error("Error reading catalogs.json", error);
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-14 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
            Product <span className="text-amber-500 italic">Catalogs</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            Download our detailed product catalogs to explore dimensions, specifications, textures, and installation guidelines for your premium architectural projects.
          </p>
        </div>

        {/* Grid Section */}
        {catalogs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {catalogs.map((catalog: any, index: number) => (
              <div 
                key={index}
                className="group relative bg-white dark:bg-slate-800 rounded-[24px] shadow-sm hover:shadow-2xl border border-slate-100 dark:border-slate-700/50 overflow-hidden transition-all duration-500 hover:-translate-y-2 flex flex-col"
              >
                {/* Background Hover Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(ellipse_at_bottom_right,_#fdba74_0%,_#fed7aa_40%,_transparent_75%)] dark:bg-[radial-gradient(ellipse_at_bottom_right,_rgba(234,88,12,0.5)_0%,_rgba(234,88,12,0.2)_40%,_transparent_75%)] z-0"></div>
                {/* Image Container */}
                <div className="relative w-full aspect-[4/3] bg-slate-100 dark:bg-slate-900 overflow-hidden">
                  {catalog.image ? (
                    <Image 
                      src={catalog.image} 
                      alt={catalog.name} 
                      fill 
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">
                      <FileText className="w-16 h-16" />
                    </div>
                  )}
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/0 to-transparent opacity-60"></div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                      {catalog.name}
                    </h2>
                    <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500 p-2 rounded-full shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-4">
                    <Link 
                      href={`/catalogs/${catalog.slug}.pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full gap-2 py-3.5 px-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-xl hover:bg-amber-500 dark:hover:bg-amber-500 hover:text-white transition-colors duration-300 shadow-md group-hover:shadow-amber-500/20"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700">
            <FileText className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Catalogs Available</h3>
            <p className="text-slate-500 dark:text-slate-400">Please check back later as we update our product brochures.</p>
          </div>
        )}
      </div>
    </main>
  );
}
