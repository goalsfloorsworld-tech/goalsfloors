"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowRight, MapPin, Calendar, Layers, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import projectsData from "@/data/projects.json";

const categories = ["All", "Residential", "Commercial", "Outdoor", "Institutional"];

function ProjectsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") || "All";

  const filteredProjects = activeCategory === "All"
    ? projectsData
    : projectsData.filter(p => p.category === activeCategory);

  const handleCategoryChange = (cat: string) => {
    if (cat === "All") {
      router.push("/projects", { scroll: false });
    } else {
      router.push(`/projects?category=${cat}`, { scroll: false });
    }
  };

  return (
    <main className="min-h-screen pt-20 bg-[#fcfaf7] dark:bg-slate-950 transition-colors duration-500">
      {/* Premium Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden border-b border-stone-200 dark:border-slate-900">
        <div className="absolute inset-0 opacity-40 dark:opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-200 dark:bg-amber-900/30 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-stone-200 dark:bg-blue-900/20 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-[10px] font-black uppercase tracking-[0.3em] bg-stone-900 text-white dark:bg-amber-500 dark:text-black rounded-full shadow-xl">
              Project Portfolio
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-stone-900 dark:text-white tracking-tighter mb-8 leading-tight">
              Crafting <span className="text-amber-600 dark:text-amber-500">Excellence</span> <br className="hidden md:block"/> In Every Surface.
            </h1>
            <p className="text-stone-500 dark:text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
              Explore our curated selection of high-end residential, commercial, and outdoor transformations across Delhi NCR.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Interactive Filter Section */}
      <section className="sticky top-20 z-40 bg-[#fcfaf7]/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-stone-100 dark:border-slate-900 pt-8 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-6 py-2.5 text-xs font-bold uppercase tracking-widest transition-all duration-300 relative rounded-none border-b-2 ${
                  activeCategory === cat
                    ? "border-amber-600 text-amber-600 dark:text-amber-500 dark:border-amber-500"
                    : "border-transparent text-stone-400 dark:text-slate-500 hover:text-stone-900 dark:hover:text-white"
                }`}
              >
                {cat}
                {activeCategory === cat && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute inset-0 bg-stone-100 dark:bg-slate-900/50 -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Display Grid */}
      <section className="py-20 md:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12 lg:gap-16"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative flex flex-col h-full bg-white dark:bg-slate-900/40 border border-stone-200 dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.03)] dark:shadow-none hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] transition-all duration-700 overflow-hidden"
              >
                {/* Image Container with Zoom */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  {/* Category Badge */}
                  <div className="absolute top-6 left-6 z-20">
                    <span className="px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] bg-white/90 dark:bg-black/90 text-stone-900 dark:text-white backdrop-blur-md shadow-lg border border-white/20">
                      {project.category}
                    </span>
                  </div>
                  {/* Glass Overlay on Hover */}
                  <div className="absolute inset-0 bg-stone-900/20 dark:bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center backdrop-blur-[2px]">
                    <div className="w-16 h-16 rounded-full bg-white text-stone-900 flex items-center justify-center scale-0 group-hover:scale-100 transition-transform duration-500 ease-out shadow-2xl">
                      <ExternalLink className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                <div className="p-8 md:p-10 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 text-amber-600 dark:text-amber-500 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span className="text-[11px] font-black uppercase tracking-widest">{project.location}</span>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-black text-stone-900 dark:text-white mb-6 group-hover:text-amber-600 transition-colors duration-300">
                    {project.title}
                  </h3>

                  <p className="text-stone-500 dark:text-slate-400 text-sm leading-relaxed mb-8 line-clamp-3">
                    {project.description}
                  </p>

                  <div className="mt-auto pt-8 border-t border-stone-100 dark:border-slate-800/50">
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(project.stats).map(([label, value]) => (
                        <div key={label}>
                          <p className="text-[9px] font-black uppercase tracking-widest text-stone-400 dark:text-slate-500 mb-1">{label}</p>
                          <p className="text-stone-900 dark:text-white font-bold text-xs">{value as string}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Professional Stats Bar (Trust Builder) */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-stone-200 dark:border-slate-900"
        >
          {[
            { label: "Completed Projects", value: "500+" },
            { label: "Architect Partnerships", value: "120+" },
            { label: "Pincodes Served", value: "850+" },
            { label: "Years of Experience", value: "12+" }
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl md:text-4xl font-black text-stone-900 dark:text-white mb-2">{stat.value}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-500">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Architect CTA Card */}
        <section className="mt-32 relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 to-stone-900 dark:from-black dark:to-slate-950 rounded-none transform skew-y-1 group-hover:skew-y-0 transition-transform duration-700" />
          <div className="relative p-12 md:p-20 text-center overflow-hidden">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 blur-[100px] rounded-full" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-stone-500/10 blur-[100px] rounded-full" />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                Architect or Interior Designer?
              </h2>
              <p className="text-stone-400 max-w-2xl mx-auto mb-12 text-lg leading-relaxed">
                Elevate your next project with Goals Floors. We provide specialized technical support, 24-hour sampling, and exclusive trade pricing for professionals.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button className="bg-amber-600 hover:bg-amber-700 text-white px-10 py-5 text-xs font-black uppercase tracking-[0.2em] transition-all shadow-2xl hover:-translate-y-1">
                  Partner with us
                </button>
                <button className="border border-white/20 hover:bg-white/10 text-white px-10 py-5 text-xs font-black uppercase tracking-[0.2em] transition-all">
                  Download Catalog
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </section>
    </main>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#fcfaf7] dark:bg-slate-950">
        <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <ProjectsContent />
    </Suspense>
  );
}
