"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Sparkles, MessageCircle, ArrowRight, X, ShieldCheck } from "lucide-react";
import type { BlogSideAdItem, BlogSideAdsConfig } from "@/lib/blog/ads";

interface BlogSideAdsProps {
  config: BlogSideAdsConfig;
  children: React.ReactNode;
}

export function BlogSideAdCard({
  ad,
  side,
  forceShow = false,
  previewMode = false,
}: {
  ad: BlogSideAdItem;
  side: "left" | "right";
  forceShow?: boolean;
  previewMode?: boolean;
}) {
  const [dismissed, setDismissed] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleDismiss = () => {
    setDismissed(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    // Smoothly reappear after exactly 10 seconds
    timerRef.current = setTimeout(() => {
      setDismissed(false);
    }, 10000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (!ad.enabled && !forceShow) return null;

  // Sliding animation classes (glides back into bezel when dismissed, slides back out after 10s)
  const slideClasses = dismissed
    ? side === "left"
      ? "-translate-x-[115%] opacity-0 pointer-events-none"
      : "translate-x-[115%] opacity-0 pointer-events-none"
    : "translate-x-0 opacity-100 pointer-events-auto";

  // Custom HTML Code branch
  if (ad.is_custom_code && ad.custom_html) {
    const customDockedShape = previewMode
      ? "rounded-2xl border border-amber-500/30"
      : side === "left"
      ? "rounded-l-none rounded-r-3xl border-l-0 border-t border-b border-r border-amber-500/35 shadow-[14px_0_35px_rgba(0,0,0,0.55)]"
      : "rounded-r-none rounded-l-3xl border-r-0 border-t border-b border-l border-amber-500/35 shadow-[-14px_0_35px_rgba(0,0,0,0.55)]";

    return (
      <div
        className={`relative w-full h-[510px] 2xl:h-[550px] overflow-hidden transition-all duration-700 ease-in-out transform ${customDockedShape} ${slideClasses}`}
      >
        <button
          type="button"
          onClick={handleDismiss}
          className={`absolute top-3 ${
            side === "left" ? "right-3" : "left-3"
          } z-20 h-5 w-5 rounded-full bg-black/70 text-white/70 hover:text-white flex items-center justify-center transition`}
          title="Dismiss ad (reappears in 10s)"
        >
          <X className="w-3 h-3" />
        </button>
        <div className="w-full h-full overflow-y-auto" dangerouslySetInnerHTML={{ __html: ad.custom_html }} />
      </div>
    );
  }

  // Theme styling presets
  const themeStyles = {
    amber_gold: {
      cardBg: "bg-[#161513]",
      border: "border-amber-500/35 hover:border-amber-500/55",
      glow: "from-amber-500/15 via-transparent to-transparent",
      badgeBg: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      btnBg: "bg-gradient-to-r from-[#d97706] to-[#b45309] hover:from-[#f59e0b] hover:to-[#d97706] text-white shadow-amber-950/50",
      accentText: "text-amber-400",
      bezelHighlight: "from-amber-400/40 via-amber-500/10 to-transparent",
    },
    emerald_luxury: {
      cardBg: "bg-[#0d1612]",
      border: "border-emerald-500/35 hover:border-emerald-500/55",
      glow: "from-emerald-500/15 via-transparent to-transparent",
      badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      btnBg: "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white shadow-emerald-950/50",
      accentText: "text-emerald-400",
      bezelHighlight: "from-emerald-400/40 via-emerald-500/10 to-transparent",
    },
    charcoal_slate: {
      cardBg: "bg-[#131417]",
      border: "border-slate-700/70 hover:border-slate-500",
      glow: "from-slate-500/15 via-transparent to-transparent",
      badgeBg: "bg-white/10 text-slate-200 border-white/25",
      btnBg: "bg-white hover:bg-slate-100 text-black shadow-black/50",
      accentText: "text-amber-300",
      bezelHighlight: "from-white/30 via-white/5 to-transparent",
    },
    royal_navy: {
      cardBg: "bg-[#0c1222]",
      border: "border-blue-500/35 hover:border-blue-500/55",
      glow: "from-blue-500/15 via-transparent to-transparent",
      badgeBg: "bg-blue-500/20 text-blue-300 border-blue-500/40",
      btnBg: "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow-blue-950/50",
      accentText: "text-blue-300",
      bezelHighlight: "from-blue-400/40 via-blue-500/10 to-transparent",
    },
  }[ad.theme || "amber_gold"];

  const isExternal = ad.button_link.startsWith("http") || ad.button_link.startsWith("https://wa.me");

  const dockedShape = previewMode
    ? "rounded-2xl border"
    : side === "left"
    ? "rounded-l-none rounded-r-3xl border-l-0 border-t border-b border-r shadow-[14px_0_35px_rgba(0,0,0,0.55)]"
    : "rounded-r-none rounded-l-3xl border-r-0 border-t border-b border-l shadow-[-14px_0_35px_rgba(0,0,0,0.55)]";

  // Glowing bezel line on the docked screen edge
  const dockedBezelLine = !previewMode ? (
    side === "left" ? (
      <div className={`pointer-events-none absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b ${themeStyles.bezelHighlight}`} />
    ) : (
      <div className={`pointer-events-none absolute inset-y-0 right-0 w-[3px] bg-gradient-to-b ${themeStyles.bezelHighlight}`} />
    )
  ) : null;

  return (
    <div
      className={`group relative w-full h-[510px] 2xl:h-[550px] overflow-hidden py-5 px-3.5 2xl:py-6 2xl:px-4.5 flex flex-col justify-between transition-all duration-700 ease-in-out transform ${themeStyles.cardBg} ${themeStyles.border} ${dockedShape} ${slideClasses}`}
    >
      {/* Background radial glow */}
      <div
        className={`pointer-events-none absolute inset-0 bg-radial-gradient ${themeStyles.glow} opacity-60`}
      />

      {/* Docked Screen Bezel Line Effect */}
      {dockedBezelLine}

      {/* ─── TOP SECTION ─── */}
      <div className="relative z-10 space-y-2.5">
        {/* Eyebrow Badge & Dismiss Button */}
        <div
          className={`flex items-center justify-between gap-1 ${
            side === "left" ? "pr-6" : "pl-6 flex-row-reverse"
          }`}
        >
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] 2xl:text-[10px] font-bold uppercase tracking-wider border ${themeStyles.badgeBg}`}
          >
            {side === "right" ? (
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            ) : (
              <Sparkles className="w-2.5 h-2.5" />
            )}
            <span className="truncate max-w-[130px]">
              {ad.badge || (side === "left" ? "Special Offer" : "Expert Help")}
            </span>
          </span>

          {/* Dismiss Button */}
          <button
            type="button"
            onClick={handleDismiss}
            className="h-5 w-5 rounded-full bg-white/10 hover:bg-white/25 text-white/50 hover:text-white flex items-center justify-center transition"
            title="Dismiss ad (reappears in 10s)"
          >
            <X className="w-3 h-3" />
          </button>
        </div>

        {/* Product / Offer Image */}
        {ad.image_url && (
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black/40 border border-white/10 shadow-md">
            <img
              src={ad.image_url}
              alt={ad.headline || "Promo Image"}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <span className="absolute bottom-1.5 left-2 text-[9px] tracking-widest uppercase font-semibold text-white/80 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-xs">
              {side === "left" ? "GF / Luxury" : "GF / Care"}
            </span>
          </div>
        )}

        {/* Headline & Subtext */}
        <div className="space-y-1">
          <h4 className="text-xs 2xl:text-sm font-bold text-white leading-snug tracking-tight">
            {ad.headline}
          </h4>
          {ad.subtext && (
            <p className="text-[10px] 2xl:text-[11px] text-white/70 leading-relaxed line-clamp-3">
              {ad.subtext}
            </p>
          )}
        </div>

        {/* Key Highlights / Value Points (Adds tall skyscraper structure) */}
        <div className="space-y-1 pt-2 border-t border-white/10 text-[9px] 2xl:text-[10px] text-white/80 font-medium">
          {side === "left" ? (
            <>
              <div className="flex items-center gap-1.5">
                <span className="text-amber-400">✦</span>
                <span className="truncate">100% Waterproof SPC &amp; WPC</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-amber-400">✦</span>
                <span className="truncate">Free NCR Doorstep Delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-amber-400">✦</span>
                <span className="truncate">Touch &amp; Feel Planks at Home</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-400">✦</span>
                <span className="truncate">Direct Advice in 5 Minutes</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-400">✦</span>
                <span className="truncate">Instant Sq.Ft Price Estimate</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-400">✦</span>
                <span className="truncate">Gurgaon Showroom Support</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ─── BOTTOM SECTION (Symmetrically balanced with top) ─── */}
      <div className="relative z-10 space-y-2 pt-2">
        {/* CTA Button */}
        <div>
          {isExternal ? (
            <a
              href={ad.button_link}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex w-full items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-[11px] 2xl:text-xs font-bold transition-all shadow-md active:scale-95 ${themeStyles.btnBg}`}
            >
              {ad.button_link.includes("wa.me") && <MessageCircle className="w-3.5 h-3.5 shrink-0" />}
              <span className="truncate">{ad.button_text || "Learn More"}</span>
              <ArrowRight className="w-3 h-3 shrink-0" />
            </a>
          ) : (
            <Link
              href={ad.button_link}
              className={`flex w-full items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-[11px] 2xl:text-xs font-bold transition-all shadow-md active:scale-95 ${themeStyles.btnBg}`}
            >
              <span className="truncate">{ad.button_text || "Learn More"}</span>
              <ArrowRight className="w-3 h-3 shrink-0" />
            </Link>
          )}
        </div>

        {/* Trust Footer */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[9px] text-white/40 tracking-wider font-medium">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-2.5 h-2.5 text-amber-500/80" />
            Goals Floors
          </span>
          <span>Delhi NCR</span>
        </div>
      </div>
    </div>
  );
}

export default function BlogSideAds({ config, children }: BlogSideAdsProps) {
  const leftEnabled = config.left_ad?.enabled;
  const rightEnabled = config.right_ad?.enabled;

  return (
    <>
      {/* ─── LEFT SKYCRAPER AD (DESKTOP ONLY, DOCKED TO VIEWPORT EDGE) ─── */}
      {leftEnabled && (
        <aside
          aria-label="Sponsored Promotion"
          className="hidden xl:block fixed left-0 top-1/2 -translate-y-1/2 z-40 select-none w-[220px] 2xl:w-[250px]"
        >
          <BlogSideAdCard ad={config.left_ad} side="left" />
        </aside>
      )}

      {/* ─── RIGHT SKYCRAPER AD (DESKTOP ONLY, DOCKED TO VIEWPORT EDGE) ─── */}
      {rightEnabled && (
        <aside
          aria-label="Flooring Expert Support"
          className="hidden xl:block fixed right-0 top-1/2 -translate-y-1/2 z-40 select-none w-[220px] 2xl:w-[250px]"
        >
          <BlogSideAdCard ad={config.right_ad} side="right" />
        </aside>
      )}

      {/* ─── CENTER ARTICLE CONTENT ─── */}
      <div className="w-full">{children}</div>
    </>
  );
}
