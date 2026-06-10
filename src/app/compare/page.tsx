"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  GitCompare,
  Loader2,
  ChevronDown,
  MousePointerClick,
  Zap,
  CheckCircle2,
  MapPin,
  Hourglass,
} from "lucide-react";
import { getTrendingComparisons } from "@/actions/compare";

/* ─── Data ─────────────────────────────────────────────────────────── */

const COMPARE_CATEGORIES = {
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

const CLASH_PAIRS = [
  { a: "PU Stone", b: "WPC Fluted Panel" },
  { a: "SPC Flooring", b: "Laminate" },
  { a: "Baffle Ceiling", b: "Upfit Panels" },
  { a: "Herringbone", b: "Hybrid Flooring" },
  { a: "Exterior Louvers", b: "Wall Panels" },
];

/* ─── Clash Animation Hero ──────────────────────────────────────────── */

function ClashHero() {
  const [pairIndex, setPairIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setPairIndex((prev) => (prev + 1) % CLASH_PAIRS.length);
        setVisible(true);
      }, 500);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const pair = CLASH_PAIRS[pairIndex];

  return (
    <div
      className="relative overflow-hidden rounded-3xl mb-0"
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #0f172a 100%)",
        minHeight: "220px",
      }}
    >
      {/* Ambient grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glowing orbs */}
      <div
        className="absolute -top-20 -left-20 w-64 h-64 rounded-full blur-3xl opacity-20"
        style={{ background: "radial-gradient(circle, #f59e0b, transparent)" }}
      />
      <div
        className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-20"
        style={{ background: "radial-gradient(circle, #8b5cf6, transparent)" }}
      />

      {/* Label */}
      <div className="relative z-10 text-center pt-8 pb-2">
        <p className="text-xs font-semibold tracking-[0.25em] text-amber-400 uppercase">
          ⚡ Live Comparison Engine
        </p>
        <p className="text-slate-400 text-sm mt-1">See what people are comparing right now</p>
      </div>

      {/* Clash stage */}
      <div className="relative z-10 flex items-center justify-center gap-4 px-6 py-8">
        {/* Product A */}
        <div
          className="flex-1 text-right"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateX(0)" : "translateX(-40px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          <div
            className="inline-block px-5 py-3 rounded-2xl font-bold text-white text-base md:text-lg"
            style={{
              background:
                "linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.05))",
              border: "1px solid rgba(245,158,11,0.35)",
              boxShadow: "0 0 24px rgba(245,158,11,0.15)",
              backdropFilter: "blur(8px)",
            }}
          >
            {pair.a}
          </div>
        </div>

        {/* VS Badge */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "scale(1)" : "scale(0.6)",
            transition: "opacity 0.5s ease 0.15s, transform 0.5s ease 0.15s",
          }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center font-black text-base text-white flex-shrink-0 animate-glow"
            style={{
              background: "linear-gradient(135deg, #f59e0b, #ef4444)",
            }}
          >
            VS
          </div>
        </div>

        {/* Product B */}
        <div
          className="flex-1 text-left"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateX(0)" : "translateX(40px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          <div
            className="inline-block px-5 py-3 rounded-2xl font-bold text-white text-base md:text-lg"
            style={{
              background:
                "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(139,92,246,0.05))",
              border: "1px solid rgba(139,92,246,0.35)",
              boxShadow: "0 0 24px rgba(139,92,246,0.15)",
              backdropFilter: "blur(8px)",
            }}
          >
            {pair.b}
          </div>
        </div>
      </div>


    </div>
  );
}

/* ─── Custom Dropdown ───────────────────────────────────────────────── */

function CustomDropdown({
  label,
  options,
  value,
  onChange,
  placeholder = "Select...",
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative group">
      <label className="block text-xs font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400 mb-2 pl-1">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full appearance-none bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-base font-semibold rounded-2xl px-5 py-4 pr-12 outline-none focus:border-amber-400 dark:focus:border-amber-500 focus:ring-4 focus:ring-amber-400/20 dark:focus:ring-amber-500/20 transition-all cursor-pointer ${
            !value ? "text-slate-400 dark:text-slate-500" : ""
          }`}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <ChevronDown
          className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none transition-transform duration-200`}
        />
      </div>
    </div>
  );
}

/* ─── How It Works Step ─────────────────────────────────────────────── */

function HowItWorksStep({
  icon,
  step,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode;
  step: string;
  title: string;
  description: string;
  delay: string;
}) {
  return (
    <div
      className="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none hover:-translate-y-2 transition-transform duration-500"
      style={{ animationDelay: delay }}
    >
      <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center mb-6 shadow-inner">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3 tracking-tight">
        {title}
      </h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
        {description}
      </p>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────── */

export default function CompareHubPage() {
  const router = useRouter();
  const [category, setCategory] = useState("Premium Flooring");
  const [productA, setProductA] = useState("");
  const [productB, setProductB] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiError, setAiError] = useState<{title: string, message: string} | null>(null);

  useEffect(() => {
    setProductA("");
    setProductB("");
  }, [category]);



  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productA || !productB) {
      alert("Please select both products.");
      return;
    }

    setLoading(true);

    try {
      const sorted = [productA, productB].sort();
      const slugA = sorted[0].toLowerCase().replace(/\s+/g, "-");
      const slugB = sorted[1].toLowerCase().replace(/\s+/g, "-");
      const finalSlug = `${slugA}-vs-${slugB}`;

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
            message: "Our architectural comparison engine is handling a high wave of traffic right now. Please wait a few seconds and try again."
          });
        } else {
          alert(data.error || "Failed to compare. Please try again.");
        }
        setLoading(false);
      }
    } catch (err) {
      console.error("Routing error:", err);
      alert("An error occurred. Please check your connection and try again.");
      setLoading(false);
    }
  };

  const availableCategories = Object.keys(COMPARE_CATEGORIES);
  const availableProductsForA =
    COMPARE_CATEGORIES[category as keyof typeof COMPARE_CATEGORIES] || [];
  const availableProductsForB = availableProductsForA.filter((p) => p !== productA);
  const isCompareDisabled = loading || !productA || !productB;

  return (
    <div
      className="min-h-screen pt-10 pb-10 font-sans bg-slate-50 dark:bg-slate-950 transition-colors duration-300"
    >
      <div className="max-w-4xl mx-auto px-4 md:px-6">

        {/* ── Page heading ──────────────────────────────── */}
        <div className="text-center mb-8">
          <span className="inline-block bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-5">
            🏆 Gurgaon's #1 Material Comparison Tool
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 leading-tight tracking-tight">
            Stop Guessing. Compare{" "}
            <span
              className="animate-gradient"
              style={{
                background:
                  "linear-gradient(90deg, #f59e0b, #ef4444, #8b5cf6, #f59e0b)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                backgroundSize: "300% 100%",
              }}
            >
              Flooring & Wall Panels in Gurgaon.
            </span>
          </h1>
          <h2 className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Pick any two flooring or wall panel materials. We'll tell you which one is better
            for your home in Gurgaon — in plain, simple language.
          </h2>
        </div>

        {/* ── Clash Animation Hero ───────────────────── */}
        <ClashHero />

        {/* ── Glassmorphism Comparison Tool ─────────── */}
        <div
          className="relative -mt-6 rounded-3xl p-8 md:p-10 mb-14 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-[0_32px_64px_rgba(0,0,0,0.08)] dark:shadow-none"
        >
          {/* Decorative corner glow */}
          <div
            className="absolute top-0 right-0 w-32 h-32 rounded-3xl opacity-30 pointer-events-none"
            style={{
              background: "radial-gradient(circle at top right, #fcd34d, transparent)",
            }}
          />

          <form onSubmit={handleCompare} className="relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              <CustomDropdown
                label="Category"
                options={availableCategories}
                value={category}
                onChange={setCategory}
              />
              <CustomDropdown
                label="Product A"
                options={availableProductsForA}
                value={productA}
                onChange={(val) => {
                  setProductA(val);
                  if (val === productB) setProductB("");
                }}
                placeholder="Select first product..."
              />
              <CustomDropdown
                label="Product B"
                options={availableProductsForB}
                value={productB}
                onChange={setProductB}
                placeholder="Select second product..."
              />
            </div>

            {/* Preview chips */}
            {(productA || productB) && (
              <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
                <span
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-amber-800"
                  style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.3)" }}
                >
                  {productA || "—"}
                </span>
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">vs</span>
                <span
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-violet-800"
                  style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.3)" }}
                >
                  {productB || "—"}
                </span>
              </div>
            )}

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isCompareDisabled}
                className="shine-btn group relative flex items-center gap-3 px-10 py-4 rounded-2xl font-bold text-white text-base transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
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
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <GitCompare className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                )}
                {loading ? "AI is Analysing..." : "Compare Now — It's Free"}
                {!loading && !isCompareDisabled && (
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                )}
              </button>
            </div>
          </form>
        </div>

        {/* ── How Our AI Works — 3 Steps ────────────── */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-3">
              How Our AI Works
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Three simple steps. Zero confusion.
            </p>
          </div>

          {/* Connector line (desktop) */}
          <div className="relative">
            <div
              className="hidden md:block absolute top-10 left-1/6 right-1/6 h-0.5 opacity-30"
              style={{
                background: "linear-gradient(90deg, transparent, #f59e0b, #ef4444, #8b5cf6, transparent)",
              }}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              <HowItWorksStep
                icon={<MousePointerClick className="w-8 h-8 text-amber-600" />}
                step="1"
                title="Choose Your Products"
                description="Select any two flooring or wall panel materials you are confused about. No account needed."
                delay="0ms"
              />
              <HowItWorksStep
                icon={<Zap className="w-8 h-8 text-amber-600" />}
                step="2"
                title="AI Analysis"
                description="Our engine instantly compares prices, durability, and waterproofing using real market data from Gurgaon."
                delay="100ms"
              />
              <HowItWorksStep
                icon={<CheckCircle2 className="w-8 h-8 text-amber-600" />}
                step="3"
                title="Make the Right Choice"
                description="Get a clear winner and a step-by-step breakdown to buy the best material for your space."
                delay="200ms"
              />
            </div>
          </div>
        </div>



        {/* ── Gurgaon Local SEO Section ──────────────── */}
        <div
          className="rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #0f172a 100%)",
          }}
        >
          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          />
          {/* Glow orb */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
            style={{ background: "radial-gradient(circle, #f59e0b, transparent)" }}
          />

          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-5">
              <MapPin className="w-5 h-5 text-amber-400" />
              <span className="text-amber-400 font-semibold text-sm uppercase tracking-widest">
                Made for Gurgaon
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">
              The Best Material Comparison
              <br />
              <span
                style={{
                  background: "linear-gradient(90deg, #f59e0b, #fcd34d)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Tool in Gurgaon
              </span>
            </h2>

            <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-8">
              Confused about which material to buy for your home or office in Gurgaon? At{" "}
              <span className="text-amber-400 font-semibold">Goals Floors</span>, we built
              this smart comparison engine to help you decide. Whether you are worried about
              moisture{" "}
              <span className="italic text-slate-400">(seelan)</span>, summer heat, or
              termites — just select two products above. We will give you a straight,
              easy-to-understand answer on what works best for your specific needs, along
              with local pricing.
            </p>

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-slate-900 transition-all duration-300 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #f59e0b, #fcd34d)",
                boxShadow: "0 12px 32px rgba(245,158,11,0.4)",
              }}
            >
              <GitCompare className="w-5 h-5" />
              Start Comparing Now
            </button>
          </div>
        </div>

        {/* ==============================
            TRENDING COMPARISONS
            ============================== */}
        <TrendingComparisons />

      </div>

      {/* AI Error Modal */}
      {aiError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md p-6 text-center mx-4 border border-slate-100 dark:border-slate-800">
            <div className="w-16 h-16 mx-auto mb-4 bg-amber-50 dark:bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-100 dark:border-amber-500/20">
              <Hourglass className="w-8 h-8 text-amber-500 animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{aiError.title}</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed text-sm md:text-base">{aiError.message}</p>
            <button
              onClick={() => setAiError(null)}
              className="w-full bg-slate-900 dark:bg-amber-600 hover:bg-slate-800 dark:hover:bg-amber-500 text-white font-bold py-3 rounded-xl transition-colors active:scale-95"
            >
              Got it, I'll wait
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

function TrendingComparisons() {
  const [trending, setTrending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [clickedSlug, setClickedSlug] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTrending() {
      setLoading(true);
      const data = await getTrendingComparisons();
      setTrending(data);
      setLoading(false);
    }
    fetchTrending();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-24 pb-12 px-4 md:px-0">
      <div className="text-center mb-10">
        <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Trending Comparisons
        </h3>
        <p className="text-slate-500 dark:text-slate-400 mt-3 text-lg">
          See what others are comparing right now
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-1 md:col-span-2 text-center text-slate-400 py-10 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin mb-3 text-amber-500" />
            <p>Loading trending comparisons...</p>
          </div>
        ) : trending.length > 0 ? (
          trending.map((item) => (
            <Link
              key={item.slug}
              href={`/compare/${item.slug}`}
              onClick={() => setClickedSlug(item.slug)}
              className="flex items-center justify-between p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300 group"
            >
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                  Versus
                </span>
                <span className="text-base font-semibold text-slate-800 dark:text-white">
                  {item.product_a} <span className="text-amber-500">vs</span> {item.product_b}
                </span>
              </div>
              {clickedSlug === item.slug ? (
                <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />
              ) : (
                <ArrowRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-amber-500 transform group-hover:translate-x-1 transition-all" />
              )}
            </Link>
          ))
        ) : (
          <div className="col-span-1 md:col-span-2 text-center text-slate-500 dark:text-slate-400 py-10">
            No comparisons generated yet. Try comparing two products above!
          </div>
        )}
      </div>
    </div>
  );
}
