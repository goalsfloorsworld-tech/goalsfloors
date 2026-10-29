import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { 
  Box, Sparkles, ShieldCheck, Truck, RotateCcw, 
  CheckCircle2, MessageCircle, Phone, ChevronRight, Layers, FileText, 
  HelpCircle, ArrowRight, ExternalLink, Wrench, Check
} from "lucide-react";

import SampleKitSection from "./SampleKitSection";
import SampleKitFaq from "./SampleKitFaq";

export const metadata: Metadata = {
  title: "GOALS™ Wall Panel Catalog & Sample Kit | Official GOALS by Goals Floors",
  description: "Order the official GOALS™ Catalog and physical sample kit. Authentic production cuts of GOALS Wall Panels, GOALS Fluted Louvers, GOALS SPC Flooring, and architectural finishes. ₹499 fee is 100% credited on order (*T&C apply).",
  keywords: [
    "GOALS",
    "GOALS Panels",
    "GOALS Wall Panel",
    "GOALS Catalog",
    "GOALS Sample Kit",
    "GOALS Flooring",
    "GOALS Floors",
    "GOALS SPC Flooring",
    "GOALS PU Stone",
    "GOALS Tokyo Molding",
    "GOALS Molding",
    "GOALS Artificial Grass",
    "GOALS Designer Grass",
    "GOALS Louvers",
    "GOALS Specifier Folder",
    "Wall Panel Sample Kit Gurgaon",
    "Fluted Wall Panel Box Delhi NCR"
  ],
  alternates: {
    canonical: "https://goalsfloors.com/sample-kit",
  },
  openGraph: {
    title: "Official GOALS™ Wall Panel & Flooring Catalog | Goals Floors",
    description: "Hold real production cuts of GOALS Wall Panels, fluted acoustic slats, and SPC flooring in your hands. ₹499 fee 100% refundable on your project order (*T&C Apply).",
    url: "https://goalsfloors.com/sample-kit",
    siteName: "Goals Floors India",
    type: "website",
  },
};

export default function SampleKitPage() {
  const whatsappOrderMessage = encodeURIComponent(
    "Hello Goals Floors team! I would like to order the Official GOALS™ Wall Panel Sample Kit (₹499 - 100% Refundable on Material Order | T&C Apply). Please share payment and delivery details for Delhi NCR."
  );
  const whatsappUrl = `https://wa.me/917217644573?text=${whatsappOrderMessage}`;

  // Structured Data (JSON-LD) for Google Rich Snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "name": "GOALS™ Architectural Wall Panel Catalog & Physical Sample Kit",
        "image": "https://goalsfloors.com/images/sample-kit/front_cover_lady.jpg",
        "description": "Official physical catalog folder containing 10 authentic production cuts of GOALS interior wall panels, fluted louvers, acoustic slats, and mounting hardware.",
        "sku": "GOALS-CATALOG-01",
        "brand": {
          "@type": "Brand",
          "name": "GOALS"
        },
        "manufacturer": {
          "@type": "Organization",
          "name": "Goals Floors",
          "url": "https://goalsfloors.com"
        },
        "offers": {
          "@type": "Offer",
          "url": "https://goalsfloors.com/sample-kit",
          "priceCurrency": "INR",
          "price": "499",
          "priceValidUntil": "2027-12-31",
          "availability": "https://schema.org/InStock",
          "seller": {
            "@type": "Organization",
            "name": "Goals Floors"
          }
        }
      },
      {
        "@type": "Organization",
        "name": "Goals Floors",
        "alternateName": ["GOALS", "GOALS Panels", "GOALS Flooring", "GOALS India"],
        "url": "https://goalsfloors.com",
        "logo": "https://goalsfloors.com/images/goals%20floors%20logo.svg",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+91-7217644573",
          "contactType": "sales",
          "areaServed": "IN"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is the official GOALS Catalog?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The GOALS Catalog is the flagship architectural specifier folder produced by Goals Floors. It contains authentic production swatches of interior fluted louvers, acoustic wooden wall panels, UV marble panels, installation accessories (clips and L-profiles), and full technical specifications."
            }
          },
          {
            "@type": "Question",
            "name": "Is GOALS the same brand as Goals Floors?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, GOALS is the premium registered product brand created and manufactured by Goals Floors India. The physical catalogs carry the official 'GOALS' marque."
            }
          },
          {
            "@type": "Question",
            "name": "What products are available under the GOALS brand?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The GOALS range includes GOALS Wall Panels (WPC & Charcoal Fluted Louvers), GOALS Flooring (SPC, Engineered Wood, Herringbone), GOALS PU Stone lightweight 3D wall claddings, GOALS Tokyo Moldings and Skirtings, and GOALS Designer Artificial Grass."
            }
          },
          {
            "@type": "Question",
            "name": "How does the 100% Credit Guarantee work on the ₹499 kit?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "When you purchase the GOALS Sample Kit for ₹499 and later place any project material order with Goals Floors, the entire ₹499 is automatically credited and deducted from your invoice. This makes the physical catalog effectively free. Terms and conditions apply."
            }
          },
          {
            "@type": "Question",
            "name": "Can I customize the panel swatches in my GOALS Catalog?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! In addition to our pre-curated 10-piece standard catalog, architects and homeowners can request a custom curated folder with their choice of 10 specific panel finishes from our warehouse for just ₹100 extra."
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Top Hero Section */}
      <section className="border-b border-slate-200 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md pt-6 pb-12 w-full transition-colors duration-300">
        <div className="w-full max-w-[1800px] px-4 sm:px-8 md:px-12 lg:px-14 xl:px-16 2xl:px-20 mx-auto">
          
          {/* Breadcrumb Links */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-6 flex-wrap">
            <Link href="/" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Home</Link>
            <ChevronRight size={13} className="text-slate-400 dark:text-slate-600" />
            <Link href="/catalogs" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Catalogs</Link>
            <ChevronRight size={13} className="text-slate-400 dark:text-slate-600" />
            <span className="text-amber-600 dark:text-amber-400 font-semibold">GOALS™ Wall Panel Catalog &amp; Sample Kit</span>
          </nav>

          {/* Hero Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-5">
                The Official <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 dark:from-amber-400 dark:via-amber-500 dark:to-amber-600">GOALS™ </span> Wall Panel &amp; Flooring Sample Kit
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-8 max-w-3xl">
                Experience the authentic tactile quality before specifying your project. The physical <strong>GOALS™</strong> folder by Goals Floors contains real production cuts of our fluted wall panel louvers, acoustic wooden slats, accessories, and technical certificates.
              </p>

              {/* Quick Perks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8 max-w-2xl">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs dark:shadow-none">
                  <CheckCircle2 size={17} className="text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                  <span>10 Real Production Wall Panel Specimens</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs dark:shadow-none">
                  <CheckCircle2 size={17} className="text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                  <span>₹499 Fee 100% Refundable on Order*</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs dark:shadow-none">
                  <CheckCircle2 size={17} className="text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                  <span>Fast Delivery Across Delhi NCR &amp; Pan-India</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs dark:shadow-none">
                  <CheckCircle2 size={17} className="text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                  <span>Heavy-Duty Client Presentation Folder</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-7 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-amber-500/25 transition active:scale-95 cursor-pointer"
                >
                  <MessageCircle size={18} /> Book via WhatsApp
                </a>
              </div>
            </div>

            {/* Right Card: Kit Box Pricing & Guarantee */}
            <div className="lg:col-span-5 bg-gradient-to-b from-white via-amber-50/20 to-white dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-xl dark:shadow-2xl relative overflow-hidden transition-colors duration-300">
              <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-center justify-between pb-5 border-b border-slate-200 dark:border-slate-800 mb-6">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-500">Official Specifier Box</span>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">GOALS™ Sample Kit</h3>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">₹499</span>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">100% Refundable*</p>
                </div>
              </div>

              <div className="space-y-4 mb-6 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mt-0.5 border border-amber-500/20">
                    <Layers size={16} />
                  </div>
                  <div>
                    <strong className="text-slate-900 dark:text-white block font-bold">10 Production Louver Cuts</strong>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Authentic cuts of interior WPC louvers, fluted acoustic slats &amp; UV marble finishes.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mt-0.5 border border-amber-500/20">
                    <Wrench size={16} />
                  </div>
                  <div>
                    <strong className="text-slate-900 dark:text-white block font-bold">Mounting Hardware Specimen</strong>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Includes real samples of interlocking clips and edge L-profiles to test fitment.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mt-0.5 border border-amber-500/20">
                    <FileText size={16} />
                  </div>
                  <div>
                    <strong className="text-slate-900 dark:text-white block font-bold">10-Year Warranty &amp; Spec Sheet</strong>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Dimension charts, fire-retardant certificates &amp; installation guide.</span>
                  </div>
                </div>
              </div>

              {/* 100% Credit Guarantee Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 to-amber-600/10 border border-amber-500/30 text-xs sm:text-sm text-amber-900 dark:text-amber-200">
                <p className="font-semibold leading-relaxed">
                  💡 <strong className="text-slate-900 dark:text-white font-black">100% Credit Guarantee:</strong> When you place any material order with Goals Floors, the entire ₹499 is deducted from your bill. The kit is effectively <span className="text-emerald-600 dark:text-emerald-400 font-black underline decoration-emerald-500">FREE</span>!{" "}
                  <Link 
                    href="/terms#sample-kit-policy" 
                    className="font-bold text-amber-700 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 underline inline-flex items-center gap-0.5 ml-1 transition-colors"
                  >
                    *T&amp;C Apply <ExternalLink size={11} />
                  </Link>
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Main Body: Expansive Full Width */}
      <main className="w-full max-w-[1800px] px-4 sm:px-8 md:px-12 lg:px-14 xl:px-16 2xl:px-20 mx-auto pt-[10px] pb-14 sm:py-14 flex-grow space-y-16 sm:space-y-24">
        
        {/* 1. Interactive 3D Studio Showcase */}
        <section id="specifier-studio" className="pt-[10px] sm:pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Inspect The Official GOALS™ Catalog in 3D
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl mt-1">
                Rotate 360°, inspect the opening hinges, front and back covers, luxury carrying straps, and precision architectural details.
              </p>
            </div>
            
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900/90 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-xs dark:shadow-none">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span>Real-Time 3D Engine Active</span>
            </div>
          </div>

          {/* 3D Component */}
          <SampleKitSection />
        </section>

        {/* 2. What's Inside The Kit Grid */}
        <section>
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500">Tangible Quality</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mt-1">
              What Comes Inside The GOALS™ Specifier Kit
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
              Everything an architect, interior designer, or discerning homeowner needs to evaluate and approve materials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 dark:hover:border-amber-500/40 shadow-xs hover:shadow-md dark:shadow-none transition group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition">
                <Layers size={22} />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">10 Real Panel Specimens</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Production-grade cuts of interior fluted louvers, acoustic wooden slats, and marble finishes matching production batches.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 dark:hover:border-amber-500/40 shadow-xs hover:shadow-md dark:shadow-none transition group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition">
                <Box size={22} />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Architectural Binder</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Sturdy hardbound presentation folder with dual carry straps, magnetic clasp, and organized slots for client meetings.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 dark:hover:border-amber-500/40 shadow-xs hover:shadow-md dark:shadow-none transition group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition">
                <Wrench size={22} />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Hardware &amp; Trims</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Actual samples of interlocking stainless-steel clips and matching edge L-profiles to test installation on-site.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 dark:hover:border-amber-500/40 shadow-xs hover:shadow-md dark:shadow-none transition group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition">
                <ShieldCheck size={22} />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">10-Year Warranty Card</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Official Goals Floors warranty certificate detailing fire resistance, water immunity, and anti-termite performance.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Upcoming Custom Catalog Feature Preview */}
        <section className="bg-gradient-to-r from-amber-500/10 via-white to-amber-500/5 dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-900 border border-amber-200/80 dark:border-slate-800 rounded-3xl p-8 lg:p-12 relative overflow-hidden shadow-xs dark:shadow-none transition-colors duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 mb-3">
                ✨ Coming Soon • Custom Curation
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
                Need Specific Finishes For Your Project? Build A Custom GOALS Kit
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mb-4">
                Have a commercial or luxury residential project with tailored palette requirements? Soon you can select any 10 custom panel finishes from our live inventory to be freshly cut and assembled into your folder for just <strong>₹100 extra</strong>.
              </p>
              <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400 font-semibold">
                <Check size={14} className="text-emerald-500 dark:text-emerald-400" />
                <span>Custom Curation feature in preparation for Gurgaon &amp; Delhi architects.</span>
              </div>
            </div>
            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 font-bold text-xs flex items-center gap-2 border border-slate-700 transition"
              >
                Inquire About Custom Kit <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </section>

        {/* 4. GOALS Product Ecosystem (SEO Pillar Linking) */}
        <section>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500">Brand Portfolio</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mt-1">
              Explore All GOALS™ Product Lines
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
              The GOALS marque represents high-performance architectural surfaces engineered by Goals Floors India.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Link 
              href="/products?category=wall-panels" 
              className="p-3.5 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 transition-all duration-300 group flex flex-row sm:flex-col gap-3.5 sm:gap-4 justify-between shadow-xs hover:shadow-md dark:shadow-none"
            >
              <div className="w-24 h-24 sm:w-full sm:h-44 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
                <img 
                  src="https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772477058/Wpc_Fluted_Panel_In_Gurgaon.png" 
                  alt="GOALS Panels & Louvers"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition truncate">
                    GOALS Panels &amp; Louvers
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                    Fluted WPC wall panels, charcoal louvers, and acoustic slat cladding engineered for modern interiors.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 mt-2 sm:mt-3">
                  Explore Panels <ArrowRight size={13} className="group-hover:translate-x-1 transition" />
                </span>
              </div>
            </Link>

            <Link 
              href="/products?category=premium-flooring" 
              className="p-3.5 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 transition-all duration-300 group flex flex-row sm:flex-col gap-3.5 sm:gap-4 justify-between shadow-xs hover:shadow-md dark:shadow-none"
            >
              <div className="w-24 h-24 sm:w-full sm:h-44 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
                <img 
                  src="https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1774612492/screenshot-2024-11-05-074302-YKb68R7lNDueGKEV.jpg" 
                  alt="GOALS Flooring Collection"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition truncate">
                    GOALS Flooring Collection
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                    Waterproof SPC luxury vinyl planks, herringbone wooden flooring, and commercial-grade heavy-duty floorboards.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 mt-2 sm:mt-3">
                  Explore Flooring <ArrowRight size={13} className="group-hover:translate-x-1 transition" />
                </span>
              </div>
            </Link>

            <Link 
              href="/products?category=wall-panels" 
              className="p-3.5 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 transition-all duration-300 group flex flex-row sm:flex-col gap-3.5 sm:gap-4 justify-between shadow-xs hover:shadow-md dark:shadow-none"
            >
              <div className="w-24 h-24 sm:w-full sm:h-44 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
                <img 
                  src="https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772477246/Pu_Stone_Colors.jpg" 
                  alt="GOALS PU Stone Veneer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition truncate">
                    GOALS PU Stone Veneer
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                    Featherlight, real-stone textured polyurethane claddings for feature walls, TV units, and facade accents.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 mt-2 sm:mt-3">
                  Explore PU Stone <ArrowRight size={13} className="group-hover:translate-x-1 transition" />
                </span>
              </div>
            </Link>

            <Link 
              href="/products?category=wall-panels" 
              className="p-3.5 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 transition-all duration-300 group flex flex-row sm:flex-col gap-3.5 sm:gap-4 justify-between shadow-xs hover:shadow-md dark:shadow-none"
            >
              <div className="w-24 h-24 sm:w-full sm:h-44 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
                <img 
                  src="https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1774970794/charcoal-gray_paneled_wall..jpg" 
                  alt="GOALS Tokyo Moldings"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition truncate">
                    GOALS Tokyo Moldings
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                    Sleek Japanese minimalist moldings, skirting boards, corner caps, and ceiling profiles.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 mt-2 sm:mt-3">
                  Explore Moldings <ArrowRight size={13} className="group-hover:translate-x-1 transition" />
                </span>
              </div>
            </Link>

            <Link 
              href="/products?category=outdoors" 
              className="p-3.5 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 transition-all duration-300 group flex flex-row sm:flex-col gap-3.5 sm:gap-4 justify-between shadow-xs hover:shadow-md dark:shadow-none"
            >
              <div className="w-24 h-24 sm:w-full sm:h-44 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
                <img 
                  src="https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772476444/artificial_grass_supplier_in_india.jpg" 
                  alt="GOALS Artificial Grass"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition truncate">
                    GOALS Artificial Grass
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                    High-density, UV-stabilized synthetic turf and designer grass mats for rooftops, lawns, and vertical gardens.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 mt-2 sm:mt-3">
                  Explore Grass <ArrowRight size={13} className="group-hover:translate-x-1 transition" />
                </span>
              </div>
            </Link>

            <Link 
              href="/catalogs" 
              className="p-3.5 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 transition-all duration-300 group flex flex-row sm:flex-col gap-3.5 sm:gap-4 justify-between shadow-xs hover:shadow-md dark:shadow-none"
            >
              <div className="w-24 h-24 sm:w-full sm:h-44 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
                <img 
                  src="https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto,w_800/v1775794972/Fluted_Panel_Goals_Floors.png" 
                  alt="GOALS PDF Catalogs"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition truncate">
                    GOALS PDF Catalogs
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                    Instant digital PDF brochures with technical specs, shade charts, and architectural project photos.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 mt-2 sm:mt-3">
                  Download PDFs <ArrowRight size={13} className="group-hover:translate-x-1 transition" />
                </span>
              </div>
            </Link>
          </div>
        </section>

        {/* 5. Comprehensive Brand SEO FAQ Section */}
        <section className="border-t border-slate-200 dark:border-slate-800/80 pt-16">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500 flex items-center justify-center gap-1.5">
              <HelpCircle size={14} /> Frequently Asked Questions
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mt-1">
              Everything You Need To Know About GOALS™
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
              Official clarifications on the GOALS brand, sample kit ordering, and credit guarantees.
            </p>
          </div>

          <SampleKitFaq />
        </section>

        {/* 6. Final Booking Call-to-Action */}
        <section className="bg-gradient-to-r from-amber-500/10 via-amber-50/40 to-amber-500/10 dark:from-amber-500/15 dark:via-slate-900 dark:to-amber-500/15 border border-amber-500/30 rounded-3xl p-8 sm:p-14 text-center relative overflow-hidden shadow-xs dark:shadow-none transition-colors duration-300">
          <div className="max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 mb-4">
              Direct Architectural Dispatch
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
              Order Your Official GOALS™ Sample Kit Today
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Touch and test real fluted louvers and SPC flooring cuts on your actual site lighting. The ₹499 fee is 100% credited against your material bill.{" "}
              <Link 
                href="/terms#sample-kit-policy" 
                className="text-amber-600 dark:text-amber-400 underline font-semibold hover:text-amber-500 inline-flex items-center gap-0.5 ml-1"
              >
                *T&amp;C Apply <ExternalLink size={11} />
              </Link>
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm flex items-center justify-center gap-2.5 transition shadow-xl shadow-emerald-500/20 active:scale-95 cursor-pointer"
              >
                <MessageCircle size={18} /> Book via WhatsApp
              </a>
            </div>
          </div>
        </section>

      </main>

    </div>
  );
}
