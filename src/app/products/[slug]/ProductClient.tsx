"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { 
  ChevronRight, ShieldCheck, Droplets, Sun, 
  Wrench, ArrowRight, CheckCircle2, Lock, Ruler, BarChart3,
  Plus, Minus, Palette, Hammer, Sparkles, Check,
  Layers, Weight, Flame, Box, Maximize, Zap, Package
} from "lucide-react";

export interface FAQ {
  question: string;
  answer: string;
}

export interface Variant {
  name: string;
  price: string;
  imageUrl?: string;
  details: Record<string, string>;
}

export interface Feature {
  title: string;
  description: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  category: string;
  priceRange: string;
  shortDescription: string;
  longDescription: string;
  features: Feature[];
  specifications: Record<string, string>;
  applications: string[];
  finishes: string[];
  installation: string;
  maintenance: string;
  logistics?: {
    Packaging: string;
    "Box Coverage": string;
    Availability: string;
  };
  faqs: FAQ[];
  images: string[];
  variants?: Variant[];
}

const StarRating = () => (
  <div className="flex items-center gap-1 mb-2">
    {[...Array(5)].map((_, i) => (
      <svg key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
      </svg>
    ))}
    <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-2">4.9 Commercial Rating</span>
  </div>
);

export default function ProductClient({ product, slug }: { product: Product; slug: string }) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const getSpecIcon = (key: string) => {
    const k = key.toLowerCase();
    if (k.includes('material')) return Layers;
    if (k.includes('dimension')) return Ruler;
    if (k.includes('weight')) return Weight;
    if (k.includes('finish')) return Palette;
    if (k.includes('fire')) return Flame;
    if (k.includes('warranty')) return ShieldCheck;
    return Box;
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "image": product.images[0],
    "description": product.shortDescription,
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans antialiased transition-colors duration-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* ================= 1. CLEAN HERO OVERVIEW ================= */}
      <div className="border-b border-gray-100 dark:border-gray-800 pt-10 pb-8 lg:pt-12 lg:pb-10 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 items-center">
            
            <div className="w-full lg:w-1/2">
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-4">
                <Link href="/" className="hover:text-amber-600 transition-colors">Home</Link>
                <ChevronRight className="w-3 h-3" />
                <Link href="/products" className="hover:text-amber-600 transition-colors">Products</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-gray-900 dark:text-gray-300">{product.category.replace('-', ' ')}</span>
              </div>
              
              <StarRating />
              
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-semibold text-gray-900 dark:text-white leading-[1.1] mb-4">
                {product.title}
              </h1>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                {product.shortDescription}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-3">
                 <Link href="/contact" className="inline-flex items-center justify-center w-full sm:w-auto bg-gray-900 dark:bg-amber-600 text-white px-8 py-3.5 text-xs font-semibold uppercase tracking-widest hover:bg-amber-600 dark:hover:bg-amber-500 transition-colors">
                  Request Quote
                 </Link>
                 <a href="#technical-data" className="inline-flex items-center justify-center w-full sm:w-auto border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-8 py-3.5 text-xs font-semibold uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors">
                  Specifications
                 </a>
              </div>
            </div>
            
            <div className="w-full lg:w-1/2">
              <div className="relative aspect-square w-full max-w-[500px] mx-auto bg-gray-50 dark:bg-slate-900 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm transition-transform duration-700 hover:scale-[1.01]">
                <Image src={product.images[0]} alt={product.title} fill className="object-cover" priority />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 2. QUICK FEATURES ================= */}
      <div className="bg-gray-50 dark:bg-slate-900 py-8 lg:py-10 border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {[
              { icon: ShieldCheck, title: "Commercial Grade", desc: product.features[0]?.title || "Built for heavy traffic" },
              { icon: Droplets, title: "Water Resistant", desc: product.features[1]?.title || "Ideal for all conditions" },
              { icon: Sun, title: "UV Protected", desc: product.features[2]?.title || "Fade-resistant finish" },
              { icon: Wrench, title: "Quick Install", desc: product.features[3]?.title || "Modular deployment" }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-start hover:-translate-y-1 transition-transform cursor-default">
                <div className="w-10 h-10 bg-white dark:bg-slate-950 rounded-lg flex items-center justify-center mb-4 shadow-sm border border-gray-100 dark:border-gray-800 text-amber-600 dark:text-amber-500 transition-colors duration-300">
                  <item.icon className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 uppercase tracking-tight">{item.title}</h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= 3. LAYERED MAGAZINE STYLE PRODUCT STORY ================= */}
      <div className="bg-white dark:bg-slate-950 py-16 lg:py-24 transition-colors duration-300 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            
            {/* Left Column: The Narrative */}
            <div className="relative">
              <span className="inline-block text-[10px] font-black uppercase tracking-[0.3em] text-amber-600 mb-6 px-3 py-1 bg-amber-50 dark:bg-amber-900/20 rounded-sm">
                Material Philosophy
              </span>
              <h3 className="text-4xl md:text-5xl font-semibold text-gray-900 dark:text-white mb-8 leading-tight">
                Engineered for <span className="text-amber-600">exceptional</span> luxury interiors.
              </h3>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-light italic border-l-4 border-amber-600 pl-6 py-2">
                  {product.longDescription}
                </p>
              </div>
              
              {/* Feature Images Integrated Below Story */}
              <div className="mt-12 grid grid-cols-2 gap-4">
                {product.images.slice(1,3).map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-sm overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 shadow-lg">
                    <Image src={img} alt="Detail view" fill className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right Column: Technical Features Grid */}
            <div className="bg-gray-50/50 dark:bg-slate-900/50 p-8 md:p-12 rounded-sm border border-gray-100 dark:border-gray-800/50">
              <div className="mb-10 pb-6 border-b border-gray-200 dark:border-gray-800">
                <h4 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white">Core Specification Choice</h4>
                <p className="text-xs text-gray-400 mt-2">Maximum performance for architectural standards</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-8">
                {product.features.map((feature, idx) => (
                  <div key={idx} className="group flex flex-col items-start focus-within:ring-2 focus-within:ring-amber-500 p-2 rounded-sm transition-all">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/10 p-2 rounded-sm group-hover:scale-110 transition-transform flex-shrink-0">
                        <CheckCircle2 className="w-5 h-5 font-black" />
                      </div>
                      <h5 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-tight">
                        {feature.title}
                      </h5>
                    </div>
                    <p className="text-[15px] text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ================= 4. TECHNICAL SPECIFICATIONS ================= */}
      <div id="technical-data" className="bg-gray-50 dark:bg-slate-900 py-10 lg:py-16 border-y border-gray-100 dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
            
            <div className="w-full lg:w-1/3">
              <div className="w-12 h-12 bg-gray-900 dark:bg-black rounded-lg flex items-center justify-center mb-6 text-white shadow-md">
                 <Ruler className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-4">Technical Specifications</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Comprehensive data for architects, contractors, and tender documentation across NCR.
              </p>
               <Link href="/contact" className="text-amber-600 dark:text-amber-500 font-medium hover:text-gray-900 dark:hover:text-white transition-colors inline-flex items-center gap-2">
                 Request detailed datasheet <ArrowRight className="w-4 h-4" />
               </Link>
            </div>
            
            <div className="w-full lg:w-2/3">
              <div className="border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-slate-950 overflow-hidden shadow-sm transition-colors duration-300">
                {Object.entries(product.specifications).map(([key, value], i) => (
                  <div key={key} className="flex flex-col sm:flex-row border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors">
                    <div className="sm:w-1/3 bg-gray-50/50 dark:bg-slate-900/50 p-4 sm:p-5 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center gap-3">
                      {(() => {
                        const Icon = getSpecIcon(key);
                        return <Icon className="w-4 h-4 text-amber-600 dark:text-amber-500" />;
                      })()}
                      {key}
                    </div>
                    <div className="sm:w-2/3 p-5 sm:p-6 text-base font-medium text-gray-900 dark:text-gray-300">
                      {value as React.ReactNode}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ================= 4.5. PRODUCT VARIATIONS & PRICING ================= */}
      {product.variants && product.variants.length > 0 && (
        <div className="bg-gray-50 dark:bg-slate-900 py-16 lg:py-24 border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600 mb-4 px-3 py-1 bg-amber-50 dark:bg-amber-900/20 inline-block rounded-sm">
                Available Selection
              </h2>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 dark:text-white">
                Available Variations & Retail Pricing
              </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {product.variants.map((variant, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-950 shadow-xl rounded-sm border border-gray-100 dark:border-gray-800 flex flex-col h-full hover:border-amber-500/30 transition-all duration-300 group overflow-hidden">
                  
                  {/* Drawing Header */}
                  {variant.imageUrl && (
                    <div className="aspect-[3/2] relative bg-gray-50 dark:bg-slate-900 p-4 border-b border-gray-100 dark:border-gray-800">
                      <Image 
                        src={variant.imageUrl} 
                        alt={`${variant.name} technical drawing`}
                        fill
                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                        priority={idx < 3}
                      />
                      <div className="absolute inset-0 bg-white/5 dark:bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}

                  <div className="p-4 flex flex-col flex-1">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-50 dark:border-gray-900 pb-4 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                      {variant.name}
                    </h4>
                    
                    <div className="flex-1 space-y-2.5 mb-6">
                      {Object.entries(variant.details).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-end gap-2 text-sm">
                          <span className="text-gray-400 dark:text-gray-500 font-medium shrink-0">{key}</span>
                          <div className="flex-1 border-b border-dotted border-gray-200 dark:border-gray-800 mb-1"></div>
                          <span className="text-gray-900 dark:text-gray-300 font-semibold text-right">{value}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-gray-50 dark:border-gray-900">
                      <div className="inline-block bg-amber-50 dark:bg-amber-900/10 px-4 py-2 rounded-sm border border-amber-100/50 dark:border-amber-900/30">
                        <p className="text-amber-600 dark:text-amber-500 font-black text-2xl tracking-tight">
                          {variant.price}
                        </p>
                      </div>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold tracking-widest mt-2 flex items-center gap-2">
                         <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                         Retail Unit Price
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= 5. LOGISTICS & AVAILABILITY ================= */}
      {product.logistics && (
        <div className="bg-white dark:bg-slate-950 py-10 lg:py-12 border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-gray-50 dark:bg-slate-900 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm transition-all hover:border-gray-200 dark:hover:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-900 dark:bg-black rounded-lg flex items-center justify-center text-white shadow-md shrink-0">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-0.5 tracking-tight">Logistics & Availability</h3>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-semibold text-amber-600 dark:text-amber-500">B2B Supply Ready</p>
                </div>
              </div>

              <div className="flex flex-wrap md:flex-nowrap gap-6 md:gap-12 w-full md:w-auto">
                <div className="flex-1 md:flex-none">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Package className="w-3 h-3 text-amber-600 dark:text-amber-500" />
                    Packaging
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-300">{product.logistics.Packaging}</p>
                </div>
                <div className="flex-1 md:flex-none border-l border-gray-200 dark:border-gray-800 pl-6">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Maximize className="w-3 h-3 text-amber-600 dark:text-amber-500" />
                    Coverage
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-300">{product.logistics["Box Coverage"]}</p>
                </div>
                <div className="flex-1 md:flex-none border-l border-gray-200 dark:border-gray-800 pl-6">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Zap className="w-3 h-3 text-amber-600 dark:text-amber-500" />
                    Status
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-300">{product.logistics.Availability}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= 6. APPLICATIONS & FINISHES ================= */}
      <div className="bg-white dark:bg-slate-950 py-8 lg:py-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
            
            {/* Applications */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-500">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Ideal Applications</h3>
              </div>
              <ul className="space-y-0 border border-gray-100 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm transition-colors duration-300">
                {product.applications.map((app, i) => (
                  <li key={i} className="flex items-center gap-4 p-5 bg-white dark:bg-slate-950 border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors">
                     <Check className="w-5 h-5 text-amber-500 shrink-0" />
                     <span className="text-base font-medium text-gray-800 dark:text-gray-300">{app}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Finishes */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-500">
                  <Palette className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Available Finishes</h3>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.finishes.map((finish, i) => (
                  <li key={i} className="flex items-center gap-4 p-5 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-gray-800 rounded-lg hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
                     <div className="w-3 h-3 rounded-full bg-gray-900 dark:bg-gray-500 shrink-0 shadow-sm"></div>
                     <span className="text-base font-medium text-gray-800 dark:text-gray-300">{finish}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 7. INSTALLATION & CARE ================= */}
      <div className="bg-gray-900 dark:bg-black py-10 lg:py-16 text-white transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
            
            <div className="border-l-2 border-amber-600 pl-8">
              <div className="flex items-center gap-4 mb-4 text-amber-500">
                <Hammer className="w-6 h-6" />
                <h3 className="text-2xl font-semibold text-white">Installation Guideline</h3>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed font-light">
                {product.installation}
              </p>
            </div>
            
            <div className="border-l-2 border-amber-600 pl-8">
              <div className="flex items-center gap-4 mb-4 text-amber-500">
                <Sparkles className="w-6 h-6" />
                <h3 className="text-2xl font-semibold text-white">Care & Maintenance</h3>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed font-light">
                {product.maintenance}
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* ================= 8. ARCHITECTURAL FAQS ================= */}
      <div className="bg-gray-50 dark:bg-slate-900 py-10 lg:py-16 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">Frequently Asked Questions</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Detailed answers for project-level planning.</p>
          </div>
          
          <div className="space-y-4">
            {product.faqs.map((faq, i) => (
              <div 
                key={i} 
                className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-950 rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-700"
              >
                <button 
                  onClick={() => toggleFaq(i)}
                  className="w-full text-left p-6 flex items-center justify-between focus:outline-none bg-white dark:bg-slate-950 group transition-colors duration-300"
                >
                  <h4 className={`text-base md:text-lg font-medium pr-8 transition-colors duration-300 ${openFaqIndex === i ? 'text-amber-600 dark:text-amber-500' : 'text-gray-900 dark:text-white'}`}>
                    {faq.question}
                  </h4>
                  <div className={`transition-transform duration-300 ${openFaqIndex === i ? 'rotate-180' : 'rotate-0'}`}>
                    {openFaqIndex === i ? (
                      <Minus className="w-5 h-5 text-amber-600 dark:text-amber-500 shrink-0" />
                    ) : (
                      <Plus className="w-5 h-5 text-gray-400 dark:text-gray-500 shrink-0 group-hover:text-gray-600 dark:group-hover:text-gray-400" />
                    )}
                  </div>
                </button>
                <div 
                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaqIndex === i ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mt-2 transition-colors duration-300">
                    <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= 9. B2B CONVERSION BAR ================= */}
      <div className="bg-white dark:bg-slate-950 py-4 shadow-md border-t border-gray-200 dark:border-gray-800 relative z-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <h4 className="text-base font-semibold text-gray-900 dark:text-white">{product.title}</h4>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-1 hidden md:flex">
               <Lock className="w-3 h-3 text-green-600 dark:text-green-500" />
               <p className="text-xs font-semibold uppercase tracking-wider text-green-700 dark:text-green-500">Premium B2B Fulfillment in NCR</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <a href="tel:+917217644573" className="flex items-center justify-center border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors rounded-sm w-full sm:w-auto">
              Call Specialist
            </a>
            <Link href="/contact" className="flex items-center justify-center gap-2 bg-gray-900 dark:bg-amber-600 text-white px-8 py-3 text-sm font-medium hover:bg-amber-600 dark:hover:bg-amber-500 transition-colors shadow-sm rounded-sm w-full sm:w-auto">
              Request Full Quote <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
