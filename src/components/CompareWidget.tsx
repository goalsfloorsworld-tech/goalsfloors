"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, GitCompare, Loader2, Hourglass } from "lucide-react";

interface CompareWidgetProps {
  currentProductSlug?: string;
}

const PRODUCT_CATEGORIES: Record<string, string[]> = {
  "Premium Flooring": [
    "SPC Flooring",
    "Laminate Flooring",
    "Herringbone Flooring",
    "Hybrid Flooring",
  ],
  "Wall Panels & Cladding": [
    "Wall Panels",
    "Cobra PU Stone",
    "Exterior Louvers",
    "Charcoal Moulding",
  ],
  "Ceilings & Partitions": ["Baffle Ceiling", "WPC Timber Tubes", "Upfit Panels"],
};

function getCategoryOf(productName: string): string | null {
  for (const [cat, products] of Object.entries(PRODUCT_CATEGORIES)) {
    if (products.includes(productName)) return cat;
  }
  return null;
}

function getProductFromSlug(slug: string): string | null {
  for (const products of Object.values(PRODUCT_CATEGORIES)) {
    for (const p of products) {
      if (p.toLowerCase().replace(/\s+/g, "-") === slug) {
        return p;
      }
    }
  }
  return null;
}

export default function CompareWidget({ currentProductSlug }: CompareWidgetProps) {
  const router = useRouter();

  // Smart Context Detection
  const detectedA = currentProductSlug ? getProductFromSlug(currentProductSlug) : "";
  const detectedCat = detectedA ? getCategoryOf(detectedA) : null;

  // If a slug was passed but it doesn't belong to any comparable category, hide widget
  if (currentProductSlug && !detectedCat) {
    return null;
  }

  // Pre-fill B with another product from the same category
  const detectedB = detectedCat
    ? PRODUCT_CATEGORIES[detectedCat].find((p) => p !== detectedA) || ""
    : "";

  const [productA, setProductA] = useState(detectedA || "");
  const [productB, setProductB] = useState(detectedB || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<{ title: string; message: string } | null>(null);

  const activeCategoryA = getCategoryOf(productA);
  const isCompareDisabled = isGenerating || !productA || !productB;

  const handleProductAChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newVal = e.target.value;
    setProductA(newVal);
    const newCat = getCategoryOf(newVal);

    if (newCat) {
      const currentCatOfB = getCategoryOf(productB);
      // If category switched, or selected B is now same as A, update B
      if (newCat !== currentCatOfB || newVal === productB) {
        const nextB = PRODUCT_CATEGORIES[newCat].find((p) => p !== newVal) || "";
        setProductB(nextB);
      }
    }
  };

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productA || !productB) return;

    setIsGenerating(true);

    try {
      const sorted = [productA, productB].sort();
      const category = getCategoryOf(sorted[0]) || "General";
      const slugA = sorted[0].toLowerCase().replace(/\s+/g, "-");
      const slugB = sorted[1].toLowerCase().replace(/\s+/g, "-");
      const finalSlug = `${slugA}-vs-${slugB}`;

      // Call API to generate comparison before redirecting
      const response = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, productA: sorted[0], productB: sorted[1] }),
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/compare/${finalSlug}`);
      } else {
        if (response.status === 503 || data.error === "AI_BUSY") {
          setAiError({
            title: "AI is catching its breath! 🤖",
            message:
              "Our architectural comparison engine is handling a high wave of traffic right now. Please wait a few seconds and try again.",
          });
        } else {
          alert(data.error || "Failed to compare. Please try again.");
        }
        setIsGenerating(false);
      }
    } catch (err) {
      console.error("Routing error:", err);
      alert("An error occurred. Please check your connection and try again.");
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-6 md:p-8 max-w-4xl mx-auto my-0 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-amber-500/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="relative z-10">
        <div className="text-center mb-8">
          <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
            Smart Side-by-Side Comparison.
          </h3>
          <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base font-medium">
            Instantly compare durability, pricing, and features for Gurgaon & Delhi NCR.
          </p>
        </div>

        <form onSubmit={handleCompare} className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 w-full">
            {/* Product A Select (Master) */}
            <div className="w-full md:flex-1 relative">
              <label htmlFor="widgetProductA" className="sr-only">
                Product A
              </label>
              <select
                id="widgetProductA"
                value={productA}
                onChange={handleProductAChange}
                required
                className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-base md:text-lg font-bold rounded-xl px-4 py-4 outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 transition-all cursor-pointer shadow-sm"
              >
                <option value="" disabled>
                  Select first material
                </option>
                {Object.entries(PRODUCT_CATEGORIES).map(([catName, products]) => (
                  <optgroup key={catName} label={catName}>
                    {products.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* VS Badge */}
            <div className="shrink-0 relative my-2 md:my-0">
              <div className="absolute inset-0 bg-amber-400 rounded-full blur-md opacity-40"></div>
              <div className="relative w-12 h-12 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-full flex items-center justify-center font-black text-amber-500 shadow-sm z-10">
                VS
              </div>
            </div>

            {/* Product B Select (Slave - Only shows items from Product A's category) */}
            <div className="w-full md:flex-1 relative">
              <label htmlFor="widgetProductB" className="sr-only">
                Product B
              </label>
              <select
                id="widgetProductB"
                value={productB}
                onChange={(e) => setProductB(e.target.value)}
                required
                disabled={!productA}
                className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-base md:text-lg font-bold rounded-xl px-4 py-4 outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 transition-all cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="" disabled>
                  {productA ? "Select second material" : "Choose first material..."}
                </option>
                {activeCategoryA &&
                  PRODUCT_CATEGORIES[activeCategoryA]
                    .filter((p) => p !== productA)
                    .map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-col items-center">
            <button
              type="submit"
              disabled={isCompareDisabled}
              className="shine-btn group relative flex items-center justify-center gap-3 w-full md:w-auto px-12 py-4 rounded-2xl font-bold text-white text-base transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: isCompareDisabled
                  ? "#94a3b8"
                  : "linear-gradient(135deg, #f59e0b, #ef4444)",
                boxShadow: isCompareDisabled
                  ? "none"
                  : "0 12px 32px rgba(245,158,11,0.35)",
                transform: isCompareDisabled ? "none" : undefined,
              }}
            >
              {isGenerating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <GitCompare className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              )}
              {isGenerating ? "Generating AI Verdict..." : "Generate AI Verdict ✨"}
            </button>

            <p className="mt-5 text-slate-500 dark:text-slate-400 text-sm font-medium flex items-center gap-2 bg-slate-100 dark:bg-slate-800/50 px-4 py-2 rounded-full">
              <ShieldCheck className="w-4 h-4 text-green-500 shrink-0" />
              Powered by real market data & architectural expertise.
            </p>
          </div>
        </form>
      </div>

      {/* AI Error Modal */}
      {aiError && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md p-6 text-center mx-4 border border-slate-100">
            <div className="w-16 h-16 mx-auto mb-4 bg-amber-50 rounded-full flex items-center justify-center border border-amber-100">
              <Hourglass className="w-8 h-8 text-amber-500 animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">{aiError.title}</h3>
            <p className="text-slate-600 mb-6 leading-relaxed text-sm md:text-base">
              {aiError.message}
            </p>
            <button
              onClick={() => setAiError(null)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-colors active:scale-95"
            >
              Got it, I'll wait
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
