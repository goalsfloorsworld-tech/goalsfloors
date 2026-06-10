import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, CheckCircle2, XCircle, Home, ArrowUpRight, ArrowDown, Sparkles, ChevronDown, Lightbulb } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase";

// Sourced from the 13 product JSON files
const PRODUCT_IMAGE_MAP: Record<string, string[]> = {
  // Premium Flooring
  "spc-flooring": [
    "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Luxury_Master_Bathroom_in_Delhi_Villa_with_Waterproof_Cobra_Gold_SPC_Flooring.jpg",
    "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775544840/walnut_color_laminate_flooring_installed_images.png"
  ],
  "laminate-flooring": [
    "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775544840/walnut_color_laminate_flooring_installed_images.png",
    "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Pet-Friendly_Hybrid_Flooring_in_Modern_Noida_Villa_Living_Room.png"
  ],
  "herringbone-flooring": [
    "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Modern_Master_Bedroom_with_Dark_Walnut_Herringbone_Floor_Delhi_NCR.jpg",
    "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Luxury_Master_Bathroom_in_Delhi_Villa_with_Waterproof_Cobra_Gold_SPC_Flooring.jpg"
  ],
  "hybrid-flooring": [
    "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Pet-Friendly_Hybrid_Flooring_in_Modern_Noida_Villa_Living_Room.png",
    "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775544840/walnut_color_laminate_flooring_installed_images.png"
  ],

  // Wall Panels & Cladding
  "wall-panels": [
    "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772477068/Imageclad_Wpc_Fluted_Panel.png",
    "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775467165/Luxury_Villa_in_Gurgaon_with_White_Upfit_Panel_Exterior_Soffits.jpg"
  ],
  "cobra-pu-stone": [
    "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775375435/Luxury_Living_Room_with_Grey_PU_Stone_Feature_Wall_Gurugram.jpg",
    "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772476503/Premium_Moulding_IN_Gurgaon.jpg"
  ],
  "exterior-louvers": [
    "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1774972022/Exterior_lovaring_in_gurgaon.jpg",
    "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775490065/Luxury_Swimming_Pool_Area_in_Gurgaon_Farmhouse_with_Teak-Finish_WPC_Decking.jpg"
  ],
  "charcoal-moulding": [
    "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772476503/Premium_Moulding_IN_Gurgaon.jpg",
    "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772477068/Imageclad_Wpc_Fluted_Panel.png"
  ],

  // Ceilings & Partitions
  "baffle-ceiling": [
    "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775467543/Modern_Corporate_Office_Reception_in_Cyber_City_with_Wenge_WPC_Baffle_Ceiling.jpg",
    "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772478750/wpc_timber_tube_for_commercial_use.png"
  ],
  "wpc-timber-tubes": [
    "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772478750/wpc_timber_tube_for_commercial_use.png",
    "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775467543/Modern_Corporate_Office_Reception_in_Cyber_City_with_Wenge_WPC_Baffle_Ceiling.jpg"
  ],
  "upfit-panels": [
    "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775467165/Luxury_Villa_in_Gurgaon_with_White_Upfit_Panel_Exterior_Soffits.jpg",
    "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772477068/Imageclad_Wpc_Fluted_Panel.png"
  ],

  // Fallbacks
  "pu-stone": [
    "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775375435/Luxury_Living_Room_with_Grey_PU_Stone_Feature_Wall_Gurugram.jpg",
    "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772476503/Premium_Moulding_IN_Gurgaon.jpg"
  ],
  "wpc-fluted-panel": [
    "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772477068/Imageclad_Wpc_Fluted_Panel.png",
    "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775467165/Luxury_Villa_in_Gurgaon_with_White_Upfit_Panel_Exterior_Soffits.jpg"
  ],
  "wpc-decking": [
    "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775490065/Luxury_Swimming_Pool_Area_in_Gurgaon_Farmhouse_with_Teak-Finish_WPC_Decking.jpg",
    "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1774972022/Exterior_lovaring_in_gurgaon.jpg"
  ],
  "artificial-grass": [
    "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772476497/artificial_grass_wholesaler_in_delhi.jpg",
    "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775490065/Luxury_Swimming_Pool_Area_in_Gurgaon_Farmhouse_with_Teak-Finish_WPC_Decking.jpg"
  ]
};

const getProductImages = (productName: string) => {
  const normalized = productName.toLowerCase().trim().replace(/\s+/g, '-');
  return PRODUCT_IMAGE_MAP[normalized] || [
    "/images/placeholder-product.jpg",
    "/images/placeholder-product.jpg"
  ];
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;

  try {
    const { data } = await supabaseAdmin
      .from("product_comparisons")
      .select("meta_title, meta_description")
      .eq("slug", slug)
      .single();

    if (data && data.meta_title) {
      // Get the products from the slug (e.g. "spc-flooring-vs-laminate-flooring")
      const [slugA, slugB] = slug.split("-vs-");
      const imagesA = getProductImages(slugA || "");
      
      return {
        title: data.meta_title,
        description: data.meta_description,
        openGraph: {
          title: data.meta_title,
          description: data.meta_description,
          type: "article",
          url: `https://goalsfloors.com/compare/${slug}`,
          images: [
            {
              url: imagesA[0] || "https://goalsfloors.com/logo.png",
              width: 1200,
              height: 630,
              alt: data.meta_title,
            }
          ]
        }
      };
    }
  } catch (err) {
    console.error("[Metadata Error] Failed to fetch SEO metadata:", err);
  }

  // Fallback if not found in DB or error
  return {
    title: "Product Comparison | Goals Floors",
    description: "Compare products easily on Goals Floors.",
    openGraph: {
      title: "Product Comparison | Goals Floors",
      description: "Compare products easily on Goals Floors.",
      type: "website",
      url: "https://goalsfloors.com/compare",
      images: [
        {
          url: "https://goalsfloors.com/logo.png",
          width: 1200,
          height: 630,
          alt: "Goals Floors Comparison Tool",
        }
      ]
    }
  };
}

export default async function CompareResultPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { slug } = await params;
  const [slugA, slugB] = slug.split("-vs-");
  const resolvedSearchParams = await searchParams;

  let comparison = null;

  try {
    const { data, error } = await supabaseAdmin
      .from("product_comparisons")
      .select("*")
      .eq("slug", slug)
      .single();

    if (data && !error) {
      comparison = data;
    }
  } catch (err) {
    console.error("[Supabase Error] Failed to fetch comparison:", err);
  }

  if (!comparison) {
    const category = resolvedSearchParams.category as string;
    const productA = resolvedSearchParams.productA as string;
    const productB = resolvedSearchParams.productB as string;

    if (!category || !productA || !productB) {
      console.error(`[Validation Error] Cannot generate comparison. Missing searchParams for slug: ${slug}`);
      notFound();
    }

    try {
      const baseUrl = process.env.NODE_ENV === "production"
        ? process.env.GSC_SITE_URL || "https://goalsfloors.com"
        : "http://localhost:3000";

      const res = await fetch(`${baseUrl}/api/compare`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, productA, productB }),
        cache: "no-store"
      });

      if (!res.ok) throw new Error(`API failed with status ${res.status}`);

      const json = await res.json();
      if (json.success && json.data) {
        comparison = json.data;
      } else {
        throw new Error(json.error || "Failed to generate AI data");
      }
    } catch (err) {
      console.error("[Fatal Error] Failed during API fetch or Gemini generation:", err);
      // Return beautiful "Breathing" UI instead of a default Chrome error or 404
      return (
        <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 relative overflow-hidden">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          
          <div className="relative bg-white dark:bg-slate-900 border border-rose-500/30 rounded-2xl p-8 md:p-12 max-w-lg w-full text-center shadow-2xl overflow-hidden z-10">
            {/* Top Breathing Line */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500 animate-pulse" />
            
            <div className="w-24 h-24 mx-auto bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center mb-6 animate-[pulse_2s_ease-in-out_infinite]">
              <span className="text-5xl">🤖</span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-4">AI is Catching Its Breath</h2>
            
            <p className="text-slate-600 dark:text-slate-400 mb-8 text-sm md:text-base leading-relaxed">
              Our AI consultant is currently analyzing a massive volume of architectural requests. Please give it a few seconds and try again.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
               <a 
                 href={`/compare/${slug}?category=${encodeURIComponent(category || "flooring")}&productA=${encodeURIComponent(productA || "Product A")}&productB=${encodeURIComponent(productB || "Product B")}`} 
                 className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl transition-all duration-300 w-full sm:w-auto shadow-lg shadow-rose-500/25"
               >
                 Retry Comparison
               </a>
               <a 
                 href="/compare" 
                 className="px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold rounded-xl transition-all duration-300 w-full sm:w-auto"
               >
                 Back to Tool
               </a>
            </div>
          </div>
        </div>
      );
    }
  }

  // Safety check, though the above catch should handle it
  if (!comparison) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <h2 className="text-xl text-slate-500">Comparison data could not be loaded.</h2>
      </div>
    );
  }

  let relatedComparisons: any[] = [];
  try {
    const { data } = await supabaseAdmin
      .from("product_comparisons")
      .select("slug, product_a, product_b")
      .or(`product_a.eq."${comparison.product_a}",product_b.eq."${comparison.product_b}"`)
      .neq("slug", slug)
      .limit(4);
    if (data) relatedComparisons = data;
  } catch (err) {
    console.error("Failed to fetch related", err);
  }

  const { 
    product_a, product_b, category: cat, overview, comparison_data, exact_specs, pros_cons, verdict, quote_a, quote_b,
    direct_answer, winner_table, use_cases, recommendation_matrix, paa_faqs
  } = comparison;

  const descA = pros_cons?.[product_a]?.pros?.[0] || pros_cons?.productA?.pros?.[0] || "A premium architectural choice.";
  const descB = pros_cons?.[product_b]?.pros?.[0] || pros_cons?.productB?.pros?.[0] || "Modern and durable finishing.";

  const highlightKeywords = (text: string) => {
    if (!text) return text;
    // Escape regex characters in dynamic product names
    const escA = product_a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const escB = product_b.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(Gurgaon|Delhi NCR|seelan|dampness|humidity|waterproof|${escA}|${escB})`, 'gi');
    return text.replace(regex, '<strong class="font-black text-amber-700 dark:text-amber-400">$1</strong>');
  };

  const isInvalidData = (val: any) => {
    if (!val) return true;
    const s = String(val).toLowerCase();
    return s.includes("not specified") || s.includes("not available") || s === "null" || s === "-";
  };

  // Pre-compute JSON-LD data (must be plain object — no functions)
  const pcA = pros_cons?.[product_a] || pros_cons?.productA || {};
  const pcB = pros_cons?.[product_b] || pros_cons?.productB || {};
  const s = exact_specs || {};
  const specsText = [
    s.price ? `Price — ${product_a}: ${s.price?.[product_a] || 'N/A'}, ${product_b}: ${s.price?.[product_b] || 'N/A'}` : '',
    s.thickness ? `Thickness — ${product_a}: ${s.thickness?.[product_a] || 'N/A'}, ${product_b}: ${s.thickness?.[product_b] || 'N/A'}` : '',
    s.dimensions ? `Dimensions — ${product_a}: ${s.dimensions?.[product_a] || 'N/A'}, ${product_b}: ${s.dimensions?.[product_b] || 'N/A'}` : '',
    s.series ? `Series — ${product_a}: ${s.series?.[product_a] || 'N/A'}, ${product_b}: ${s.series?.[product_b] || 'N/A'}` : '',
  ].filter(Boolean).join('. ') || 'Contact Goals Floors in Gurgaon for detailed specifications.';
  const featuresText = Object.entries(comparison_data || {}).map(([feature, values]: [string, any]) =>
    `${feature} — ${product_a}: ${values?.[product_a] || 'N/A'}; ${product_b}: ${values?.[product_b] || 'N/A'}`
  ).join('. ') || 'Contact Goals Floors in Gurgaon for a detailed feature comparison.';

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      { "@type": "Question", "name": `Which is better for Gurgaon: ${product_a} or ${product_b}?`, "acceptedAnswer": { "@type": "Answer", "text": verdict || `Both ${product_a} and ${product_b} are excellent choices.` } },
      { "@type": "Question", "name": `What are the advantages of ${product_a}?`, "acceptedAnswer": { "@type": "Answer", "text": ((pcA as any).pros as string[] || []).join('. ') || `${product_a} is available at Goals Floors, Gurgaon.` } },
      { "@type": "Question", "name": `What are the disadvantages of ${product_a}?`, "acceptedAnswer": { "@type": "Answer", "text": ((pcA as any).cons as string[] || []).join('. ') || `Consult Goals Floors experts for a full assessment.` } },
      { "@type": "Question", "name": `What are the advantages of ${product_b}?`, "acceptedAnswer": { "@type": "Answer", "text": ((pcB as any).pros as string[] || []).join('. ') || `${product_b} is available at Goals Floors, Gurgaon.` } },
      { "@type": "Question", "name": `What are the disadvantages of ${product_b}?`, "acceptedAnswer": { "@type": "Answer", "text": ((pcB as any).cons as string[] || []).join('. ') || `Consult Goals Floors experts for a full assessment.` } },
      { "@type": "Question", "name": `What are the technical specifications for ${product_a} and ${product_b}?`, "acceptedAnswer": { "@type": "Answer", "text": specsText } },
      { "@type": "Question", "name": `How do the features of ${product_a} and ${product_b} compare?`, "acceptedAnswer": { "@type": "Answer", "text": featuresText } },
    ]
  };

  if (paa_faqs && Array.isArray(paa_faqs)) {
    paa_faqs.forEach((faq: any) => {
      faqSchema.mainEntity.push({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
      });
    });
  }

  // Inject Winner Table into Schema
  if (winner_table && Object.keys(winner_table).length > 0) {
    Object.entries(winner_table).forEach(([param, winner]) => {
      faqSchema.mainEntity.push({
        "@type": "Question",
        "name": `Which is better for ${param}: ${product_a} or ${product_b}?`,
        "acceptedAnswer": { "@type": "Answer", "text": `${winner} is the winner for ${param}.` }
      });
    });
  }

  // Inject Use Cases into Schema
  if (use_cases) {
    const ucA = (use_cases.product_a || use_cases.productA) as string[] || [];
    if (ucA.length > 0) {
      faqSchema.mainEntity.push({
        "@type": "Question",
        "name": `Where are the best places to use ${product_a}?`,
        "acceptedAnswer": { "@type": "Answer", "text": ucA.join(', ') + '.' }
      });
    }
    const ucB = (use_cases.product_b || use_cases.productB) as string[] || [];
    if (ucB.length > 0) {
      faqSchema.mainEntity.push({
        "@type": "Question",
        "name": `Where are the best places to use ${product_b}?`,
        "acceptedAnswer": { "@type": "Answer", "text": ucB.join(', ') + '.' }
      });
    }
  }

  // Inject Recommendation Matrix into Schema
  if (recommendation_matrix && recommendation_matrix.length > 0) {
    const matrixStr = recommendation_matrix.map((m: any) => `For ${m.scenario}, we recommend ${m.recommended} because ${m.reason}`).join('. ');
    faqSchema.mainEntity.push({
      "@type": "Question",
      "name": `When should I choose ${product_a} over ${product_b}?`,
      "acceptedAnswer": { "@type": "Answer", "text": matrixStr }
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 font-sans selection:bg-amber-500 selection:text-white">

      {/* SEO Optimized H1 (Visually Hidden) */}
      <h1 className="sr-only">{product_a} vs {product_b}</h1>

      {/* FAQPage JSON-LD Schema for Google Rich Results */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* 
        ==============================
        IMMERSIVE SPLIT-SCREEN HERO
        ==============================
      */}
      <section className="bg-slate-900 text-white relative pt-6 pb-12 sm:pb-16 md:pb-96">

        {/* Animated Water Waves Background */}
        <div className="absolute inset-0 z-0 pointer-events-none flex overflow-hidden">
          <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-cyan-600/30 to-cyan-400/50 wave-left blur-xl"></div>
          <div className="w-1/2 h-full bg-gradient-to-l from-transparent via-blue-600/30 to-blue-400/50 wave-right blur-xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">

          {/* Flush Top Breadcrumbs */}
          <nav className="flex items-center justify-start gap-2 text-xs md:text-sm text-slate-400 mb-8 md:mb-24 font-medium tracking-wide">
            <Link href="/" className="hover:text-amber-400 flex items-center gap-1 transition-colors">
              <Home className="w-4 h-4" />
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/compare" className="hover:text-amber-400 transition-colors">Compare</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{cat}</span>
          </nav>

          <div className="flex flex-row items-stretch justify-between relative z-10 gap-4 md:gap-8">

            {/* Left Side: Product A */}
            <div className="w-[48%] flex flex-col items-center md:items-start text-center md:text-left relative">
              <div className="flex-1 flex flex-col">
                <h2 className="text-xl sm:text-2xl md:text-5xl lg:text-5xl font-black tracking-tight mb-2 md:mb-4 leading-none">{product_a}</h2>
                {quote_a && (
                  <h3 className="text-base md:text-lg italic text-amber-200/80 font-medium mb-4 md:mb-6">"{quote_a}"</h3>
                )}
                <h3 className="text-slate-300 text-xs sm:text-sm md:text-xl font-medium mb-8 md:mb-12 max-w-md line-clamp-3 md:line-clamp-none">{descA}</h3>
              </div>

              {/* Images A - Mobile: 1 Elegant Image | Desktop: 2 Stacked Images */}
              <div className="w-full mt-6 md:mt-8 relative md:absolute md:top-[100%] z-20 group md:-translate-x-16 md:h-[400px]">
                {/* Mobile: Primary Image | Desktop: Back Image */}
                <div
                  className="w-full aspect-[3/4] sm:aspect-square md:w-[80%] md:h-auto md:aspect-video bg-slate-800 rounded-2xl md:rounded-3xl border-2 md:border-4 border-slate-900 shadow-xl md:shadow-2xl overflow-hidden relative md:absolute md:top-0 md:right-0 z-10 md:hover:z-30 md:hover:scale-105 transition-all duration-500 cursor-pointer mobile-img-tap"
                >
                  <img src={getProductImages(product_a)[0]} alt={product_a} className="w-full h-full object-cover" />
                </div>
                {/* Desktop ONLY: Front Image */}
                <div className="hidden md:block w-[90%] h-auto aspect-video bg-slate-800 rounded-3xl border-4 border-slate-900 shadow-2xl overflow-hidden absolute -bottom-12 -left-12 z-20 hover:z-30 transition-all duration-500 hover:scale-105">
                  <img src={getProductImages(product_a)[1] || getProductImages(product_a)[0]} alt={product_a} className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            {/* Center Elements: VS Badge & Capsule Button */}
            <div className="absolute left-1/2 top-28 sm:top-32 md:top-[35%] -translate-x-1/2 -translate-y-1/2 z-30 flex items-center justify-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-slate-800 text-amber-500 font-black text-lg sm:text-xl lg:text-2xl rounded-full flex items-center justify-center shadow-xl shadow-black/50 border-2 border-slate-700 transition-transform relative z-10">
                VS
              </div>
            </div>

            {/* Jump to Verdict Capsule (Pushed significantly lower) */}
            <div className="absolute left-1/2 top-[100%] mt-56 sm:mt-72 md:mt-116 -translate-x-1/2 z-40 hidden md:flex items-center justify-center">
              <a href="#verdict" className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-black px-8 py-4 rounded-full shadow-2xl shadow-amber-500/30 transition-all hover:scale-110 flex items-center gap-2 whitespace-nowrap border-4 border-slate-900 group">
                Jump to Verdict <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
              </a>
            </div>

            {/* Right Side: Product B */}
            <div className="w-[48%] flex flex-col items-center md:items-end text-center md:text-right relative">
              <div className="flex-1 flex flex-col items-center md:items-end">
                <h2 className="text-xl sm:text-2xl md:text-5xl lg:text-5xl font-black tracking-tight mb-2 md:mb-4 leading-none">{product_b}</h2>
                {quote_b && (
                  <h3 className="text-base md:text-lg italic text-amber-200/80 font-medium mb-4 md:mb-6">"{quote_b}"</h3>
                )}
                <h3 className="text-slate-300 text-xs sm:text-sm md:text-xl font-medium mb-8 md:mb-12 max-w-md line-clamp-3 md:line-clamp-none">{descB}</h3>
              </div>

              {/* Images B - Mobile: 1 Elegant Image | Desktop: 2 Stacked Images */}
              <div className="w-full mt-6 md:mt-8 relative md:absolute md:top-[100%] z-20 group md:translate-x-16 md:h-[400px]">
                {/* Mobile: Primary Image | Desktop: Back Image */}
                <div
                  className="w-full aspect-[3/4] sm:aspect-square md:w-[80%] md:h-auto md:aspect-video bg-slate-800 rounded-2xl md:rounded-3xl border-2 md:border-4 border-slate-900 shadow-xl md:shadow-2xl overflow-hidden relative md:absolute md:top-0 md:left-0 z-10 md:hover:z-30 md:hover:scale-105 transition-all duration-500 cursor-pointer mobile-img-tap"
                >
                  <img src={getProductImages(product_b)[0]} alt={product_b} className="w-full h-full object-cover" />
                </div>
                {/* Desktop ONLY: Front Image */}
                <div className="hidden md:block w-[90%] h-auto aspect-video bg-slate-800 rounded-3xl border-4 border-slate-900 shadow-2xl overflow-hidden absolute -bottom-12 -right-12 z-20 hover:z-30 transition-all duration-500 hover:scale-105">
                  <img src={getProductImages(product_b)[1] || getProductImages(product_b)[0]} alt={product_b} className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Spacer for floating images (Desktop only since mobile flows naturally now) */}
      <div className="hidden md:block h-57 bg-slate-50 dark:bg-slate-950 w-full" />

      {/* 
        ==============================
        OVERVIEW SECTION
        ==============================
      */}
      <section className="py-10 bg-slate-50 dark:bg-slate-950 px-4 md:px-8 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <p 
            className="text-lg md:text-2xl font-medium text-slate-600 dark:text-slate-300 leading-relaxed font-serif italic"
            dangerouslySetInnerHTML={{ __html: `"${highlightKeywords(overview)}"` }}
          />
        </div>

        {direct_answer && (
          <div className="max-w-3xl mx-auto mt-12 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-6 md:p-8 text-center shadow-sm">
            <h2 className="text-sm font-black text-amber-600 dark:text-amber-500 tracking-widest uppercase mb-4 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" /> Quick Verdict
            </h2>
            <p className="text-slate-800 dark:text-slate-200 text-lg md:text-xl font-medium leading-relaxed">
              {direct_answer}
            </p>
          </div>
        )}
      </section>

      {/* 
        ==============================
        TECHNICAL SPECS & FEATURES (Native Flow)
        ==============================
      */}
      <section className="py-10 bg-white dark:bg-slate-900 px-4 md:px-8 transition-colors duration-300">
        <div className="max-w-5xl mx-auto">

          {winner_table && Object.keys(winner_table).length > 0 && (
            <div className="mb-24">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-10 tracking-tight text-center">Category Winners</h2>
              <div className="overflow-x-auto pb-4">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold text-xs tracking-widest uppercase">
                      <th className="p-4 rounded-tl-2xl">Parameter</th>
                      <th className="p-4 rounded-tr-2xl">Winner</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(winner_table).map(([param, winner]: [string, any], idx) => (
                      <tr key={idx} className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="p-4 font-bold text-slate-800 dark:text-slate-200 uppercase text-xs tracking-widest">{param}</td>
                        <td className="p-4 font-black text-lg text-slate-900 dark:text-white flex items-center gap-3">
                          {winner}
                          {winner === product_a && <span className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />}
                          {winner === product_b && <span className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />}
                          {winner !== product_a && winner !== product_b && <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700" />}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="mb-24">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-12 tracking-tight">Technical Specs</h2>
            <div className="overflow-x-auto pb-4">
              <table className="w-full text-left table-fixed min-w-[600px]">
                <thead>
                  <tr className="text-slate-400 dark:text-slate-500 font-bold text-xs tracking-widest uppercase border-b-2 border-slate-900 dark:border-white/20">
                    <th scope="col" className="w-1/3 text-left font-bold tracking-widest pb-4">Specification</th>
                    <th scope="col" className="w-1/3 text-center text-slate-900 dark:text-white font-bold tracking-widest pb-4">{product_a}</th>
                    <th scope="col" className="w-1/3 text-center text-slate-900 dark:text-white font-bold tracking-widest pb-4">{product_b}</th>
                  </tr>
                </thead>
                <tbody>
                  {exact_specs && Object.keys(exact_specs).map((key) => {
                    const valA = exact_specs[key]?.[product_a] || exact_specs[key]?.productA || '-';
                    const valB = exact_specs[key]?.[product_b] || exact_specs[key]?.productB || '-';
                    if (isInvalidData(valA) && isInvalidData(valB)) return null;
                    return (
                      <tr key={key} className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="w-1/3 font-bold text-slate-800 dark:text-slate-200 capitalize py-6">{key}</td>
                        <td className="w-1/3 text-center text-slate-600 dark:text-slate-400 font-medium py-6">{valA}</td>
                        <td className="w-1/3 text-center text-slate-600 dark:text-slate-400 font-medium py-6">{valB}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-12 tracking-tight">Feature Comparison</h2>
            <div className="overflow-x-auto pb-4">
              <table className="w-full text-left table-fixed min-w-[700px]">
                <thead>
                  <tr className="text-slate-400 dark:text-slate-500 font-bold text-xs tracking-widest uppercase border-b-2 border-slate-900 dark:border-white/20">
                    <th scope="col" className="w-[30%] md:w-1/5 text-left font-bold tracking-widest pb-4">Feature</th>
                    <th scope="col" className="w-[35%] md:w-2/5 text-center text-slate-900 dark:text-white font-bold tracking-widest pb-4">{product_a}</th>
                    <th scope="col" className="w-[35%] md:w-2/5 text-center text-slate-900 dark:text-white font-bold tracking-widest pb-4">{product_b}</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison_data && Object.keys(comparison_data).map((feature) => {
                    const valA = comparison_data[feature]?.[product_a] || comparison_data[feature]?.productA || '-';
                    const valB = comparison_data[feature]?.[product_b] || comparison_data[feature]?.productB || '-';
                    if (isInvalidData(valA) && isInvalidData(valB)) return null;
                    return (
                      <tr key={feature} className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="w-[30%] md:w-1/5 font-bold text-slate-800 dark:text-slate-200 pr-4 text-base md:text-lg py-8 align-top">{feature}</td>
                        <td className="w-[35%] md:w-2/5 text-center text-slate-600 dark:text-slate-400 px-4 md:px-6 font-medium leading-relaxed md:border-r border-slate-200 dark:border-slate-800 py-8 align-top">{valA}</td>
                        <td className="w-[35%] md:w-2/5 text-center text-slate-600 dark:text-slate-400 px-4 md:px-6 font-medium leading-relaxed py-8 align-top">{valB}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </section>

      {/* 
        ==============================
        USE CASES & RECOMMENDATION MATRIX
        ==============================
      */}
      {(use_cases || recommendation_matrix) && (
        <section className="py-16 bg-slate-50 dark:bg-slate-950 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            {use_cases && (
              <div className="mb-16">
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-10 text-center tracking-tight">Best Use Cases</h2>
                <div className="overflow-x-auto pb-4">
                  <table className="w-full text-left border-collapse min-w-[600px] border border-slate-200 dark:border-slate-800 rounded-2xl hidden-border-collapse overflow-hidden">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold text-xs tracking-widest uppercase">
                        <th className="p-4 w-1/2">Where to use {product_a}</th>
                        <th className="p-4 w-1/2">Where to use {product_b}</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-900">
                      <tr>
                        <td className="p-0 align-top border-r border-slate-200 dark:border-slate-800">
                          <ul className="p-6 md:p-8 space-y-4">
                            {(() => {
                              let arr = (use_cases.product_a || use_cases.productA) as string[] || [];
                              if (arr.length > 1 && arr[0].includes(arr[1])) arr = arr.slice(1);
                              return arr;
                            })().map((uc, i) => (
                              <li key={i} className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                <span className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{uc}</span>
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="p-0 align-top">
                          <ul className="p-6 md:p-8 space-y-4">
                            {(() => {
                              let arr = (use_cases.product_b || use_cases.productB) as string[] || [];
                              if (arr.length > 1 && arr[0].includes(arr[1])) arr = arr.slice(1);
                              return arr;
                            })().map((uc, i) => (
                              <li key={i} className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                <span className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{uc}</span>
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {recommendation_matrix && recommendation_matrix.length > 0 && (
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-10 text-center tracking-tight">Recommendation Matrix</h2>
                <div className="overflow-x-auto pb-4">
                  <table className="w-full text-left border-collapse min-w-[700px] border border-slate-200 dark:border-slate-800 rounded-2xl hidden-border-collapse overflow-hidden">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold text-xs tracking-widest uppercase">
                        <th className="p-4 w-1/3">Scenario / Priority</th>
                        <th className="p-4 w-1/4">Recommended Product</th>
                        <th className="p-4 w-auto">Reason</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-900">
                      {recommendation_matrix.map((matrix: any, idx: number) => (
                        <tr key={idx} className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="p-4 md:p-6 font-bold text-slate-900 dark:text-white text-base align-top">{matrix.scenario}</td>
                          <td className="p-4 md:p-6 align-top border-l border-r border-slate-200 dark:border-slate-800">
                            <div className="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-xl px-3 py-1.5">
                              <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                              <span className="text-amber-700 dark:text-amber-400 font-bold text-sm">{matrix.recommended}</span>
                            </div>
                          </td>
                          <td className="p-4 md:p-6 text-slate-600 dark:text-slate-400 font-medium leading-relaxed align-top">{matrix.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 
        ==============================
        PROS & CONS (Native Flow)
        ==============================
      */}
      <section className="py-10 bg-slate-50 dark:bg-slate-950 px-4 md:px-8 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white mb-8 md:mb-16 text-center tracking-tight">Pros & Cons</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-24">

            {/* Product A */}
            <div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-10 pb-6 border-b-4 border-amber-500 inline-block">{product_a}</h3>
              <div className="mb-12">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-3 mb-6 uppercase tracking-widest text-sm">
                  <CheckCircle2 className="w-6 h-6 text-green-500" /> Advantages
                </h4>
                <ul className="space-y-6">
                  {(pros_cons?.[product_a]?.pros || pros_cons?.productA?.pros || []).map((pro: string, i: number) => (
                    <li key={i} className="flex items-start gap-4 text-slate-700 dark:text-slate-300 font-medium text-lg">
                      <span className="text-green-500 shrink-0 mt-1.5 text-xl leading-none">•</span>
                      <span className="leading-relaxed">{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-3 mb-6 uppercase tracking-widest text-sm">
                  <XCircle className="w-6 h-6 text-red-500" /> Limitations
                </h4>
                <ul className="space-y-6">
                  {(pros_cons?.[product_a]?.cons || pros_cons?.productA?.cons || []).map((con: string, i: number) => (
                    <li key={i} className="flex items-start gap-4 text-slate-700 dark:text-slate-300 font-medium text-lg">
                      <span className="text-red-400 shrink-0 mt-1.5 text-xl leading-none">•</span>
                      <span className="leading-relaxed">{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Product B */}
            <div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-10 pb-6 border-b-4 border-blue-500 inline-block">{product_b}</h3>
              <div className="mb-12">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-3 mb-6 uppercase tracking-widest text-sm">
                  <CheckCircle2 className="w-6 h-6 text-green-500" /> Advantages
                </h4>
                <ul className="space-y-6">
                  {(pros_cons?.[product_b]?.pros || pros_cons?.productB?.pros || []).map((pro: string, i: number) => (
                    <li key={i} className="flex items-start gap-4 text-slate-700 dark:text-slate-300 font-medium text-lg">
                      <span className="text-green-500 shrink-0 mt-1.5 text-xl leading-none">•</span>
                      <span className="leading-relaxed">{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-3 mb-6 uppercase tracking-widest text-sm">
                  <XCircle className="w-6 h-6 text-red-500" /> Limitations
                </h4>
                <ul className="space-y-6">
                  {(pros_cons?.[product_b]?.cons || pros_cons?.productB?.cons || []).map((con: string, i: number) => (
                    <li key={i} className="flex items-start gap-4 text-slate-700 dark:text-slate-300 font-medium text-lg">
                      <span className="text-red-400 shrink-0 mt-1.5 text-xl leading-none">•</span>
                      <span className="leading-relaxed">{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 
        ==============================
        VERDICT & CTA
        ==============================
      */}
      <section id="verdict" className="py-10 px-4 md:px-8 bg-white dark:bg-slate-900 scroll-mt-20 transition-colors duration-300">
        <div className="max-w-4xl mx-auto">

          <div className="mb-20 text-center">
            <span className="inline-block bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-400 px-6 py-2 rounded-full text-sm font-bold tracking-widest uppercase mb-8">
              Expert Conclusion
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-10 leading-tight">
              The Final Verdict
            </h2>
            <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {verdict}
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 md:p-16 text-center">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Ready to transform your space?</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-12 text-lg font-medium">Choose your winner and explore the complete collection.</p>

            {/* Diagonal Split Button CTA */}
            <div className="relative w-full max-w-4xl mx-auto h-24 sm:h-32 rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-2xl flex border-[6px] border-white dark:border-slate-800 group/container bg-slate-100 dark:bg-slate-900">
              
              {/* Left Button (Product A) */}
              <Link 
                href={`/products/${slugA}`} 
                className="absolute top-0 bottom-0 -left-20 right-1/2 z-20 group/left border-r-[6px] border-white dark:border-slate-800 overflow-hidden"
                style={{ transform: 'skewX(-20deg)', transformOrigin: 'center right' }}
              >
                {/* Left Background with Default Glow */}
                <div className="absolute inset-0 bg-slate-900 dark:bg-slate-800 group-hover/left:bg-amber-500 transition-colors duration-500 shadow-[0_0_60px_rgba(245,158,11,0.5)_inset] group-hover/left:shadow-none" />
                
                {/* Un-skewed Text Container */}
                <div className="absolute inset-0 flex items-center justify-end pr-4 sm:pr-12 pl-12" style={{ transform: 'skewX(20deg)', transformOrigin: 'center right' }}>
                  <div className="text-white group-hover/left:text-slate-900 font-black text-xs sm:text-lg lg:text-xl flex items-center gap-1.5 sm:gap-2 transition-transform group-hover/left:scale-105 text-right">
                    <ArrowUpRight className="w-4 h-4 sm:w-6 sm:h-6 shrink-0" /> 
                    <span className="whitespace-normal break-words leading-tight max-w-[90px] sm:max-w-[200px]">{product_a}</span>
                  </div>
                </div>
              </Link>

              {/* Right Button (Product B) */}
              <Link 
                href={`/products/${slugB}`} 
                className="absolute inset-y-0 left-0 right-0 z-10 group/right flex"
              >
                {/* Right Background with Default Glow */}
                <div className="absolute inset-0 bg-slate-100 dark:bg-slate-900 group-hover/right:bg-blue-600 transition-colors duration-500 shadow-[0_0_60px_rgba(59,130,246,0.2)_inset] group-hover/right:shadow-none" />
                
                <div className="w-1/2" /> {/* Invisible spacer to push text to right half */}
                <div className="w-1/2 relative flex items-center justify-start pl-4 sm:pl-12 pr-12">
                  <div className="text-slate-900 dark:text-white group-hover/right:text-white font-black text-xs sm:text-lg lg:text-xl flex items-center gap-1.5 sm:gap-2 transition-transform group-hover/right:scale-105 text-left">
                    <span className="whitespace-normal break-words leading-tight max-w-[90px] sm:max-w-[200px]">{product_b}</span>
                    <ArrowUpRight className="w-4 h-4 sm:w-6 sm:h-6 shrink-0" />
                  </div>
                </div>
              </Link>

            </div>
          </div>

        </div>
      </section>

      {/* 
        ==============================
        PEOPLE ALSO ASK (FAQs)
        ==============================
      */}
      {paa_faqs && paa_faqs.length > 0 && (
        <section className="py-16 bg-slate-50 dark:bg-slate-950 px-4 md:px-8 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                People Also Ask
              </h2>
            </div>
            
            <div className="space-y-4">
              {paa_faqs.map((faq: any, idx: number) => (
                <details key={idx} name="faq-accordion" className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-5 md:p-6 text-slate-900 dark:text-white">
                    <h3 className="font-bold text-lg">{faq.question}</h3>
                    <span className="relative ml-1.5 h-5 w-5 shrink-0">
                      <ChevronDown className="absolute inset-0 w-5 h-5 opacity-100 group-open:opacity-0 transition-opacity" />
                      <ChevronDown className="absolute inset-0 w-5 h-5 opacity-0 group-open:opacity-100 group-open:-rotate-180 transition-all" />
                    </span>
                  </summary>
                  <p className="px-5 pb-5 md:px-6 md:pb-6 text-slate-600 dark:text-slate-400 leading-relaxed text-base">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 
        ==============================
        RELATED COMPARISONS
        ==============================
      */}
      {relatedComparisons && relatedComparisons.length > 0 && (
        <section className="py-16 bg-white dark:bg-slate-900 px-4 md:px-8 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">
              Related Comparisons
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {relatedComparisons.map((rel) => (
                <Link 
                  key={rel.slug} 
                  href={`/compare/${rel.slug}`}
                  className="block p-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-amber-400 dark:hover:border-amber-500 transition-colors group"
                >
                  <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                    Versus
                  </span>
                  <span className="block text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {rel.product_a} vs {rel.product_b}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
