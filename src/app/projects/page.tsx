"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function ProjectsPage() {
  return (
    <main className="min-h-screen pt-24 bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Hero Section */}
      <section className="bg-gray-50 dark:bg-slate-900 py-20 text-center border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Our Projects</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto px-4">Take a look at how we transform spaces with our premium surfaces across Delhi NCR.</p>
      </section>

      {/* Projects Grid Placeholder */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Luxury Villa, DLF Phase 5",
              category: "Premium Laminate Flooring",
              image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1000"
            },
            {
              title: "Corporate HQ, Cyber City",
              category: "WPC Louvers & Baffle Ceilings",
              image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1000"
            },
            {
              title: "Modern Apartment, Golf Course Road",
              category: "Charcoal Wall Panels",
              image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1000"
            }
          ].map((project, i) => (
            <div key={i} className="group relative overflow-hidden bg-gray-900 aspect-square rounded-sm shadow-lg">
               <Image 
                src={project.image} 
                alt={project.title} 
                fill 
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover opacity-80 group-hover:scale-110 group-hover:opacity-60 transition-all duration-700" 
              />
              <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                <p className="text-amber-400 text-[10px] uppercase tracking-widest font-bold mb-2">{project.category}</p>
                <h3 className="text-white font-bold text-xl mb-4">{project.title}</h3>
                <div className="flex items-center gap-2 text-white text-sm font-medium opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  View Case Study <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lead Section for Architects */}
        <div className="mt-24 p-12 bg-gray-950 dark:bg-black text-center rounded-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 dark:bg-amber-900/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <h2 className="text-3xl font-bold text-white mb-6 relative z-10">Architect or Interior Designer?</h2>
          <p className="text-gray-400 dark:text-gray-500 mb-10 max-w-2xl mx-auto relative z-10">We offer specialized support and exclusive catalogs for professionals. Let&apos;s create something extraordinary together.</p>
          <div className="relative z-10 flex flex-col md:flex-row gap-4 justify-center">
            <button className="bg-amber-600 hover:bg-amber-700 text-white px-10 py-4 uppercase tracking-widest text-sm font-bold shadow-lg transition-all">Download Catalog</button>
            <button className="border border-white/20 hover:bg-white/10 text-white px-10 py-4 uppercase tracking-widest text-sm font-bold transition-all">Partner With Us</button>
          </div>
        </div>
      </section>
    </main>
  );
}
