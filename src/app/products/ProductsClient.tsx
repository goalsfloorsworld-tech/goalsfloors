"use client";

import { useState, useEffect, useRef, useMemo } from "react";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ArrowRight, Search, Filter, X,
  Layers, CloudSun, Maximize, Layout, Grid,
  Info, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CircularProductDisplay from "@/components/products/CircularProductDisplay";

// Types
export interface Product {
  slug: string;
  title: string;
  category: string;
  shortDescription: string;
  longDescription: string;
  priceRange?: string;
  images: { url: string }[];
  features?: { title: string; description: string }[];
}

// Mapping slugs to icons and labels
const categoryConfig: { [key: string]: { label: string; icon: any } } = {
  "All": { label: "All Products", icon: Grid },
  "wall-panels": { label: "Wall Panels", icon: Layers },
  "outdoors": { label: "Exterior & Outdoor", icon: CloudSun },
  "premium-flooring": { label: "Flooring", icon: Maximize },
  "ceilings": { label: "Architectural Ceilings", icon: Layout }
};

function highlightMatch(text: string, query: string) {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase()
          ? <mark key={i} className="bg-amber-400/30 text-amber-900 border-b border-amber-600 px-0.5 rounded-sm">{part}</mark>
          : part
      )}
    </span>
  );
}

export default function ProductsClient({ products }: { products: Product[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchRef = useRef<HTMLDivElement>(null);

  const categoryParam = searchParams.get("category") || "All";
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Group products by category in a specific order: wall-panels -> outdoors -> premium-flooring -> ceilings
  const categoryOrder = ["wall-panels", "outdoors", "premium-flooring", "ceilings"];

  const sortedProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    return [...products].sort((a, b) => {
      const indexA = categoryOrder.indexOf(a.category);
      const indexB = categoryOrder.indexOf(b.category);
      const sortA = indexA === -1 ? 999 : indexA;
      const sortB = indexB === -1 ? 999 : indexB;

      if (sortA !== sortB) return sortA - sortB;
      // Secondary sort by title if in same category
      return (a.title || "").localeCompare(b.title || "");
    });
  }, [products]);

  const searchResults = searchQuery.length > 0 ? (sortedProducts || []).filter((product: Product) => {


    const q = searchQuery.toLowerCase();
    return (
      product.title.toLowerCase().includes(q) ||
      product.shortDescription.toLowerCase().includes(q) ||
      product.longDescription.toLowerCase().includes(q) ||
      product.category.toLowerCase().includes(q) ||
      product.features?.some((f: any) => f.title.toLowerCase().includes(q) || f.description.toLowerCase().includes(q))
    );
  }).map((product: any) => {
    const q = searchQuery.toLowerCase();
    let matchText = product.title;
    if (product.shortDescription.toLowerCase().includes(q)) {
      matchText = product.shortDescription;
    } else if (product.longDescription.toLowerCase().includes(q)) {
      matchText = product.longDescription;
    } else {
      const featureMatch = product.features?.find((f: any) => f.title.toLowerCase().includes(q) || f.description.toLowerCase().includes(q));
      if (featureMatch) matchText = featureMatch.description;
    }
    return { ...product, matchText };
  }) : [];

  const filteredProducts = categoryParam === "All"
    ? (sortedProducts || [])
    : (sortedProducts || []).filter((p: Product) => p?.category === categoryParam);



  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!Array.isArray(sortedProducts)) return null;

  const dataCategories = Array.from(new Set(sortedProducts.map((p: Product) => p?.category).filter(Boolean)));

  const categories = ["All", ...dataCategories];


  const SCROLL_INTENSITY = 700;
  const circularRef = useRef<HTMLDivElement>(null);

  const scrollToCategory = (cat: string) => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024 && circularRef.current && sortedProducts.length > 0) {
      const firstIndex = cat === "All" ? 0 : sortedProducts.findIndex((p: Product) => p.category === cat);

      if (firstIndex !== -1) {
        const rect = circularRef.current.getBoundingClientRect();
        const containerTop = rect.top + window.scrollY;
        const targetScroll = containerTop + (firstIndex * SCROLL_INTENSITY);

        window.scrollTo({
          top: targetScroll,
          behavior: "smooth"
        });
      }
    }
  };

  // Sync scroll on category change (initial load or navigation)
  useEffect(() => {
    if (categoryParam !== "All" && sortedProducts.length > 0) {
      // Use a slightly longer timeout to ensure Framer Motion and layout have stabilized
      const timer = setTimeout(() => scrollToCategory(categoryParam), 300);
      return () => clearTimeout(timer);
    }
  }, [categoryParam, sortedProducts.length]); // Specifically watch the loading of products

  const handleCategoryChange = (cat: string) => {
    // 1. Update URL/State (Normal behavior)
    if (cat === "All") {
      router.push("/products", { scroll: false });
    } else {
      router.push(`/products?category=${cat}`, { scroll: false });
    }

    // 2. Desktop Specific: Scroll to the exactly correct index
    scrollToCategory(cat);
  };


  const isResultsVisible = isSearchFocused && searchQuery.length > 0;

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="bg-[#fcfaf7] dark:bg-slate-950 min-h-screen pb-24 transition-colors duration-500">
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>

      {/* Premium Search Hero - Elevated Stacking Context when active */}
      <section className={`bg-gray-950 dark:bg-black py-10 border-b border-amber-600/30 relative transition-[z-index] ${isResultsVisible ? 'z-[100]' : 'z-10'}`}>
        {/* Architectural Dynamic Background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Main Glows */}
          <div className="absolute top-0 right-[15%] w-[800px] h-[800px] bg-amber-600/10 dark:bg-amber-600/5 blur-[180px] rounded-full -translate-y-1/2" />
          <div className="absolute bottom-0 left-[10%] w-[600px] h-[600px] bg-blue-600/5 dark:bg-blue-600/[0.03] blur-[150px] rounded-full translate-y-1/2" />

          {/* Structural Grid */}
          <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(251,191,36,0.5) 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }}
          />

          {/* Floating 'Technical Blueprint' Lines */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.15, x: [0, 50, 0], y: [0, -30, 0] }}
              transition={{ duration: 20 + i * 5, repeat: Infinity, ease: "linear" }}
              className="absolute h-px bg-amber-500 w-[1200px]"
              style={{
                top: `${30 + i * 20}%`,
                left: `${-20 + i * 10}%`,
                transform: `rotate(${5 + i * 5}deg)`
              }}
            />
          ))}

          {/* Technical Data Markers (The "Unique" Touch) */}
          <div className="absolute top-32 left-10 hidden xl:flex flex-col gap-1 items-start">
            <span className="text-[10px] font-black text-amber-600/30 uppercase tracking-[0.4em]">Section.GF.Products</span>
            <div className="w-16 h-px bg-amber-600/30" />
            <span className="text-[10px] font-black text-amber-600/30 uppercase tracking-[0.4em]">Index: 01.0A</span>
          </div>

          <div className="absolute bottom-32 right-10 hidden xl:flex flex-col gap-1 items-end">
            <span className="text-[10px] font-black text-amber-600/30 uppercase tracking-[0.4em]">Ref. 2024.COL</span>
            <div className="w-16 h-px bg-amber-600/30" />
            <span className="text-[10px] font-black text-amber-600/30 uppercase tracking-[0.4em]">Cat. Catalog: 19 Years</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-[110] text-center">
          <div className="flex flex-col items-center gap-4 mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-12 h-12 bg-amber-600/10 border border-amber-600/20 rounded-full flex items-center justify-center backdrop-blur-md mb-2"
            >
              <Grid className="w-5 h-5 text-amber-500" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-3xl sm:text-4xl md:text-6xl font-black text-white tracking-tight uppercase leading-[0.95]"
            >
              Browse Our <br className="md:hidden" />
              <span className="text-amber-500 italic font-light drop-shadow-[0_0_15px_rgba(251,191,36,0.2)]">Full</span> Collection.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              className="text-[10px] sm:text-xs font-bold text-amber-500 uppercase tracking-[0.5em] mt-2"
            >
              Premium Architectural Solutions
            </motion.p>
          </div>

          <div ref={searchRef} className="max-w-3xl mx-auto relative">
            <div className="relative z-[120] group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
              <input
                type="text"
                placeholder="Search for WPC, Louvers, or Wood Flooring..."
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                }}
                className="w-full bg-white/5 border border-white/10 text-white rounded-2xl py-6 pl-16 pr-10 focus:outline-none focus:border-amber-500 focus:bg-white/15 transition-all md:text-lg shadow-2xl font-medium"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Live Search Results */}
            <AnimatePresence>
              {isResultsVisible && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-4 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 shadow-[0_50px_150px_rgba(0,0,0,0.6)] z-[130] max-h-[500px] overflow-y-auto rounded-3xl no-scrollbar"
                >
                  {searchResults.length > 0 ? (
                    searchResults.map((p) => (
                      <Link
                        href={`/products/${p.slug}`}
                        key={p.slug}
                        onClick={() => setIsSearchFocused(false)}
                        className="flex items-center gap-6 p-6 hover:bg-stone-50 dark:hover:bg-slate-800 border-b border-stone-100 dark:border-slate-800 last:border-0 transition-colors group/res"
                      >
                        <div className="relative w-20 h-20 shrink-0 bg-stone-100 rounded-xl overflow-hidden border border-stone-200 dark:border-slate-700 shadow-sm">
                          <Image src={p.images?.[0]?.url || '/placeholder.jpg'} alt={p.title} fill className="object-cover transition-transform group-hover/res:scale-110" />
                        </div>
                        <div className="text-left flex-grow">
                          <p className="text-base font-bold text-stone-900 dark:text-white uppercase tracking-wider mb-2">{p.title}</p>
                          <p className="text-[13px] text-stone-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-medium">
                            {highlightMatch(p.matchText, searchQuery)}
                          </p>
                        </div>
                        <ChevronRight className="w-6 h-6 text-stone-300 shrink-0 group-hover/res:text-amber-500 group-hover/res:translate-x-1 transition-all" />
                      </Link>
                    ))
                  ) : (
                    <div className="p-20 text-center text-stone-400 font-medium">
                      No technical specs matching &quot;{searchQuery}&quot;
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Categories Filter Selection */}
      <section className="relative py-8 md:py-16 z-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-4">
          {/* Desktop Capsule List */}
          <div className="hidden md:flex w-full overflow-hidden px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto flex items-center gap-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl p-1.5 rounded-full shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-stone-200 dark:border-slate-800 max-w-full overflow-x-auto no-scrollbar px-6 shadow-2xl"
            >
              {categories.map((cat) => {
                const Icon = categoryConfig[cat]?.icon || Grid;
                const label = categoryConfig[cat]?.label || cat;
                const isActive = categoryParam === cat;
                const count = cat === "All" ? sortedProducts.length : sortedProducts.filter((p: Product) => p.category === cat).length;



                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`flex items-center gap-2.5 px-5 py-3 rounded-full transition-all duration-500 shrink-0 relative group ${isActive
                        ? "text-white"
                        : "text-stone-500 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white"
                      }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="desktop-pill"
                        className="absolute inset-0 bg-stone-900 dark:bg-amber-600 rounded-full -z-10 shadow-lg"
                        transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
                      />
                    )}
                    <Icon className={`w-4 h-4 ${isActive ? "" : "group-hover:scale-110 transiton-transform"}`} />
                    <span className="text-[11px] font-bold uppercase tracking-widest leading-none">{label}</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-stone-100 dark:bg-slate-800 text-stone-500"}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </motion.div>
          </div>

          {/* Mobile Filter Button */}
          <div className="flex md:hidden justify-center overflow-visible">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-3 px-8 py-4 bg-white dark:bg-slate-900 rounded-full shadow-2xl border border-stone-200 dark:border-slate-800 group"
            >
              <div className="bg-amber-600 p-2 rounded-full text-white">
                <Filter className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-900 dark:text-white">
                Filters & Categories
              </span>
              <div className="bg-stone-100 dark:bg-slate-800 px-2 py-1 rounded-full text-[9px] font-bold text-stone-600 dark:text-slate-400">
                {categoryParam === "All" ? categories.length - 1 : 1} Selected
              </div>
            </motion.button>
          </div>
        </div>
      </section>

      {/* Mobile Filter Popup Modal */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center px-4"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="absolute inset-0 bg-stone-900/60 dark:bg-black/80 backdrop-blur-sm"
            />

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.4)] overflow-hidden relative z-10 border border-stone-200 dark:border-slate-800"
            >
              <div className="p-8 border-b border-stone-100 dark:border-slate-800 flex justify-between items-center bg-stone-50 dark:bg-slate-800/50">
                <h2 className="text-sm font-bold uppercase tracking-widest text-stone-900 dark:text-white">Select Category</h2>
                <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-stone-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                  <X className="w-5 h-5 text-stone-400" />
                </button>
              </div>

              <div className="p-4 space-y-2">
                {categories.map((cat) => {
                  const Icon = categoryConfig[cat]?.icon || Grid;
                  const label = categoryConfig[cat]?.label || cat;
                  const isActive = categoryParam === cat;
                  const count = cat === "All" ? sortedProducts.length : sortedProducts.filter((p: Product) => p.category === cat).length;



                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        handleCategoryChange(cat);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-5 rounded-3xl transition-all duration-300 group ${isActive
                          ? "bg-amber-600 text-white shadow-lg shadow-amber-600/20"
                          : "hover:bg-stone-50 dark:hover:bg-slate-800 text-stone-600 dark:text-slate-400"
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2.5 rounded-2xl transition-colors ${isActive ? "bg-white/20" : "bg-stone-100 dark:bg-slate-800 group-hover:bg-white dark:group-hover:bg-slate-700"}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className={`text-[11px] font-bold uppercase tracking-widest ${isActive ? "text-white" : "text-stone-900 dark:text-white"}`}>
                          {label}
                        </span>
                      </div>
                      <div className={`text-[9px] font-bold px-3 py-1 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-stone-100 dark:bg-slate-800 text-stone-500"}`}>
                        {count}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={circularRef} className="hidden lg:block">
        <CircularProductDisplay
          products={sortedProducts}
          scrollIntensity={SCROLL_INTENSITY}
          activeCategory={categoryParam}
        />
      </div>


      {/* Products Display Grid - Mobile/Tablet Only */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:hidden">
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-14"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product: Product, i: number) => (

              <motion.div
                key={product.slug}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link
                  href={`/products/${product.slug}`}
                  className="group block relative h-full bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_50px_100px_rgba(0,0,0,0.12)] transition-all duration-700 overflow-hidden"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
                    <Image
                      src={product.images?.[0]?.url || '/placeholder.jpg'}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    />

                    <div className="absolute inset-x-4 bottom-4 z-20 translate-y-full group-hover:translate-y-0 transition-all duration-500">
                      <div className="bg-white/95 dark:bg-black/95 backdrop-blur-md p-4 shadow-2xl border border-white/20">
                        <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-[0.2em] text-amber-600">
                          <span className="flex items-center gap-1.5 font-bold"><Info className="w-3 h-3" /> Technical Specs</span>
                          <span className="text-stone-400 font-bold">Series {i + 1}</span>
                        </div>
                      </div>
                    </div>

                    <div className="absolute top-6 left-6 z-10">
                      <span className="bg-amber-600/90 backdrop-blur-sm text-white text-[9px] font-bold px-4 py-1.5 uppercase tracking-[0.22em] shadow-lg">
                        {product.priceRange || 'Premium Grade'}
                      </span>
                    </div>
                  </div>

                  <div className="p-8 pb-10 flex flex-col h-fit">
                    <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-4 group-hover:text-amber-600 transition-colors tracking-tight leading-tight">
                      {product.title}
                    </h3>
                    <p className="text-stone-500 dark:text-slate-400 text-[13px] leading-relaxed mb-10 line-clamp-2">
                      {product.shortDescription}
                    </p>

                    <div className="flex items-center justify-between pt-6 border-t border-stone-100 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-stone-400 dark:text-slate-500 uppercase tracking-[0.2em]">Explore Catalog</span>
                      <div className="w-10 h-10 rounded-full bg-stone-50 dark:bg-slate-800/50 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-all transform group-hover:translate-x-1 shadow-sm">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-40 bg-white dark:bg-slate-900 border-2 border-dashed border-stone-200 dark:border-slate-800 rounded-[2.5rem]">
            <Filter className="w-16 h-16 text-stone-200 dark:text-slate-800 mx-auto mb-8" />
            <p className="text-2xl text-stone-600 dark:text-slate-400 font-bold mb-8 tracking-tight px-4">No technical matches found in this category.</p>
            <button
              onClick={() => handleCategoryChange("All")}
              className="bg-stone-900 dark:bg-amber-600 text-white px-12 py-5 font-bold uppercase tracking-[0.2em] text-[10px] hover:scale-105 transition-transform shadow-2xl"
            >
              Reset Search Results
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
