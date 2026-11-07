"use client";

import { useMemo } from "react";
import Link from "next/link";
import { getSafePromoLink } from "./index";

export type FestiveBgTheme = "royal_amber" | "deep_maroon" | "midnight_navy" | "emerald_green" | "luxury_slate";

export interface FestiveOfferBannerProps {
  heading?: string;
  subheading?: string;
  sale_tagline?: string;
  button_text?: string;
  button_link?: string;
  secondary_button_text?: string;
  secondary_button_link?: string;
  bg_theme?: FestiveBgTheme | string;
  tagline?: string;
  // 5 Compulsory Cards
  card_1_image?: string;
  card_1_title?: string;
  card_1_link?: string;
  card_2_image?: string;
  card_2_title?: string;
  card_2_link?: string;
  card_3_image?: string;
  card_3_title?: string;
  card_3_link?: string;
  card_4_image?: string;
  card_4_title?: string;
  card_4_link?: string;
  card_5_image?: string;
  card_5_title?: string;
  card_5_link?: string;
  isMobileView?: boolean;
  [key: string]: unknown;
}

interface CardItem {
  image: string;
  title: string;
  link?: string;
}

export default function FestiveOfferBanner({
  heading = "Happy Diwali",
  subheading = "May your home glow with light and happiness.",
  sale_tagline = "Diwali Sale on Floors and Wall Panels.",
  button_text = "Chat on WhatsApp",
  button_link = "https://wa.me/917217644573",
  secondary_button_text,
  secondary_button_link,
  bg_theme = "royal_amber",
  tagline = "Premium Flooring • Wall Panels • Trusted Quality",
  card_1_image = "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775411703/Luxury_Penthouse_Living_Room_with_Light_Oak_Herringbone_Flooring_Gurugram.jpg",
  card_1_title = "Fluted Wall Panel TV Wall",
  card_1_link = "/products/fluted-wall-panel",
  card_2_image = "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775544853/oak_color_laminate_flooring_installed_images.png",
  card_2_title = "Wooden SPC Floor Bedroom",
  card_2_link = "/products/spc-herringbone-oak",
  card_3_image = "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
  card_3_title = "Green Balcony Flooring",
  card_3_link = "/sample-kit",
  card_4_image = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
  card_4_title = "Herringbone Floor Living Room",
  card_4_link = "/products/spc-luxury-plank",
  card_5_image = "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
  card_5_title = "WPC Louver Exterior Wall",
  card_5_link = "/products/wpc-exterior-louvers",
  isMobileView,
}: FestiveOfferBannerProps) {
  // Safe links
  const safePrimaryLink = getSafePromoLink(button_link);

  const formattedSecondaryLink = useMemo(() => {
    if (!secondary_button_link) return null;
    const trimmed = secondary_button_link.trim();
    if (trimmed.startsWith("http") || trimmed.startsWith("/")) return trimmed;
    const digitsOnly = trimmed.replace(/[^0-9]/g, "");
    if (digitsOnly.length >= 10) return `https://wa.me/${digitsOnly}`;
    return null;
  }, [secondary_button_link]);
  const safeSecondaryLink = getSafePromoLink(formattedSecondaryLink);

  // Group 5 cards
  const cards: CardItem[] = useMemo(() => {
    return [
      { image: card_1_image, title: card_1_title, link: card_1_link },
      { image: card_2_image, title: card_2_title, link: card_2_link },
      { image: card_3_image, title: card_3_title, link: card_3_link },
      { image: card_4_image, title: card_4_title, link: card_4_link },
      { image: card_5_image, title: card_5_title, link: card_5_link },
    ];
  }, [
    card_1_image, card_1_title, card_1_link,
    card_2_image, card_2_title, card_2_link,
    card_3_image, card_3_title, card_3_link,
    card_4_image, card_4_title, card_4_link,
    card_5_image, card_5_title, card_5_link,
  ]);

  // Color theme definition with rich festive gradients and pattern colors
  const themeStyles = useMemo(() => {
    if (typeof bg_theme === "string" && bg_theme.startsWith("#")) {
      const hex = bg_theme.toLowerCase();
      return {
        isCustom: true,
        customHex: hex,
        gradient: "",
        patternColor: hex,
        glow1: "bg-white/10",
        glow2: "bg-amber-400/15",
        btnGradient: "from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600",
        accentColor: "text-amber-200",
        cardBorder: "border-amber-400/50",
        ribbonGradient: "from-amber-600 to-amber-800",
      };
    }

    switch (bg_theme) {
      case "deep_maroon":
        return {
          isCustom: false,
          customHex: "",
          gradient: "from-[#2e090e] via-[#1c0407] to-[#0c0103]",
          patternColor: "#e11d48",
          glow1: "bg-rose-500/15",
          glow2: "bg-amber-500/10",
          btnGradient: "from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600",
          accentColor: "text-amber-300",
          cardBorder: "border-amber-500/40",
          ribbonGradient: "from-amber-600 to-rose-700",
        };
      case "midnight_navy":
        return {
          isCustom: false,
          customHex: "",
          gradient: "from-[#08152e] via-[#040c1a] to-[#02050b]",
          patternColor: "#38bdf8",
          glow1: "bg-sky-500/15",
          glow2: "bg-amber-400/10",
          btnGradient: "from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600",
          accentColor: "text-sky-300",
          cardBorder: "border-amber-400/50",
          ribbonGradient: "from-amber-600 to-sky-700",
        };
      case "emerald_green":
        return {
          isCustom: false,
          customHex: "",
          gradient: "from-[#082818] via-[#04170d] to-[#020a05]",
          patternColor: "#10b981",
          glow1: "bg-emerald-500/15",
          glow2: "bg-amber-400/10",
          btnGradient: "from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600",
          accentColor: "text-emerald-300",
          cardBorder: "border-emerald-500/40",
          ribbonGradient: "from-emerald-700 to-amber-600",
        };
      case "luxury_slate":
        return {
          isCustom: false,
          customHex: "",
          gradient: "from-[#17181c] via-[#0e0f12] to-[#060608]",
          patternColor: "#94a3b8",
          glow1: "bg-amber-500/10",
          glow2: "bg-slate-400/10",
          btnGradient: "from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600",
          accentColor: "text-amber-400",
          cardBorder: "border-amber-500/40",
          ribbonGradient: "from-amber-600 to-slate-800",
        };
      case "royal_amber":
      default:
        return {
          isCustom: false,
          customHex: "",
          gradient: "from-[#2e1408] via-[#1a0b04] to-[#0d0502]",
          patternColor: "#f59e0b",
          glow1: "bg-amber-500/20",
          glow2: "bg-orange-500/15",
          btnGradient: "from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600",
          accentColor: "text-amber-300",
          cardBorder: "border-amber-600/50",
          ribbonGradient: "from-amber-600 to-orange-700",
        };
    }
  }, [bg_theme]);

  const patternId = `festive-pat-${String(bg_theme).replace(/[^a-zA-Z0-9]/g, "")}`;

  // Background SVG Geometric / Mandala Pattern overlay
  const PatternOverlay = (
    <div className="absolute inset-0 pointer-events-none opacity-[0.14] mix-blend-screen z-0">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={patternId} width="60" height="60" patternUnits="userSpaceOnUse">
            <path
              d="M30 0 L60 30 L30 60 L0 30 Z"
              fill="none"
              stroke={themeStyles.patternColor}
              strokeWidth="1"
            />
            <circle cx="30" cy="30" r="10" fill="none" stroke={themeStyles.patternColor} strokeWidth="1" />
            <circle cx="30" cy="30" r="4" fill={themeStyles.patternColor} opacity="0.4" />
            <path
              d="M0 0 L15 15 M60 0 L45 15 M60 60 L45 45 M0 60 L15 45"
              stroke={themeStyles.patternColor}
              strokeWidth="0.75"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );

  // Top Decorative Garland / Toran with glowing lamps
  const FestiveGarland = (
    <div className="absolute top-0 left-0 right-0 h-10 pointer-events-none z-10 overflow-hidden flex justify-center items-start opacity-90 select-none">
      <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className="w-full h-12 text-amber-500">
        <defs>
          <linearGradient id="marigoldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <filter id="diyaGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Scalloped marigold garland curves */}
        <path
          d="M0,0 Q100,32 200,0 Q300,32 400,0 Q500,32 600,0 Q700,32 800,0 Q900,32 1000,0 Q1100,32 1200,0"
          fill="none"
          stroke="url(#marigoldGrad)"
          strokeWidth="7"
          strokeDasharray="4 6"
        />
        <path
          d="M0,4 Q100,36 200,4 Q300,36 400,4 Q500,36 600,4 Q700,36 800,4 Q900,36 1000,4 Q1100,36 1200,4"
          fill="none"
          stroke="#f97316"
          strokeWidth="4"
          strokeDasharray="3 5"
        />
        {/* Glowing Diya lamps at each curve peak */}
        {[100, 300, 500, 700, 900, 1100].map((cx, i) => (
          <g key={i} transform={`translate(${cx}, 26)`}>
            {/* Diya base */}
            <path d="M-9,2 Q0,10 9,2 Q5,1 0,1 Q-5,1 -9,2" fill="#b45309" stroke="#fbbf24" strokeWidth="0.8" />
            {/* Glowing flame */}
            <circle cx="0" cy="-3" r="4.5" fill="#fef08a" filter="url(#diyaGlow)" opacity="0.9" />
            <path d="M0,-8 Q3,-3 0,0 Q-3,-3 0,-8" fill="#f59e0b" />
          </g>
        ))}
      </svg>
    </div>
  );

  // Bottom ornamental divider
  const OrnamentalDivider = (
    <div className="flex items-center gap-2 pt-1 opacity-70">
      <div className="h-px w-10 bg-gradient-to-r from-transparent to-amber-500/60" />
      <span className="text-amber-400 text-xs">🪔</span>
      <div className="h-px w-10 bg-gradient-to-l from-transparent to-amber-500/60" />
    </div>
  );

  // Single Polaroid Card renderer
  // Sleek, thin white border on mobile (p-[3px] rounded-md), rich polaroid frame on desktop (p-2 rounded-xl)
  // Supports optional clickable destination link per card
  const renderPolaroidCard = (
    card: CardItem,
    customClass: string,
    key: number,
    isDesktop = false
  ) => {
    const safeCardLink = getSafePromoLink(card.link);

    const CardContent = (
      <div
        className={`group relative ${
          isDesktop
            ? "rounded-xl bg-white p-2 shadow-2xl"
            : "rounded-md bg-white p-[3px] shadow-xl"
        } transition-all duration-300 ease-out hover:scale-105 hover:z-30 hover:rotate-0 cursor-pointer ${customClass}`}
      >
        {/* Photo Container with delicate golden inner border */}
        <div
          className={`relative aspect-4/3 w-full overflow-hidden ${
            isDesktop ? "rounded-lg" : "rounded-[3px]"
          } border border-amber-500/35 bg-slate-900 shadow-inner`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={card.image}
            alt={card.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
            referrerPolicy="no-referrer"
            loading="eager"
          />
          {/* Bottom title ribbon matching image design */}
          <div className={`absolute ${isDesktop ? "bottom-1.5 inset-x-1.5" : "bottom-1 inset-x-1"} z-10`}>
            <div
              className={`rounded-xs sm:rounded-sm bg-gradient-to-r ${themeStyles.ribbonGradient} ${
                isDesktop ? "px-2 py-0.5" : "px-1.5 py-[2px]"
              } text-center shadow-md`}
            >
              <span
                className={`block ${
                  isDesktop ? "text-[10px] xl:text-[11px]" : "text-[8px] sm:text-[9px]"
                } font-bold tracking-tight text-white truncate drop-shadow-xs`}
              >
                {card.title}
              </span>
            </div>
          </div>
        </div>
      </div>
    );

    if (safeCardLink) {
      return (
        <Link key={key} href={safeCardLink} className="block group/cardlink" title={`View ${card.title}`}>
          {CardContent}
        </Link>
      );
    }

    return <div key={key}>{CardContent}</div>;
  };

  // ──────────────── SUB-COMPONENT: MOBILE PHONE LAYOUT ────────────────
  const MobileLayout = (
    <div className="relative z-10 space-y-3 pt-2">
      {/* 1. Festive Header Content with clear bottom padding */}
      <div className="text-center space-y-1.5 pb-2">
        <h2 className="font-serif text-2xl sm:text-3xl font-black tracking-tight text-amber-200 drop-shadow-md leading-tight">
          {heading}
        </h2>
        {subheading && (
          <p className="text-xs sm:text-sm text-amber-100/90 font-medium leading-relaxed max-w-xs mx-auto">
            {subheading}
          </p>
        )}
        {sale_tagline && (
          <p className="text-[11px] sm:text-xs font-semibold text-amber-300/85">
            {sale_tagline}
          </p>
        )}
      </div>

      {/* 2. Scattered Polaroid Cards (5 Cards Collage on Mobile) */}
      {/* Generous vertical breathing room (mt-5 mb-3) and h-[265px] so top cards never touch the text */}
      <div className="relative w-full h-[265px] sm:h-[285px] mt-5 mb-3 flex items-center justify-center">
        {/* Card 1: Top-Left (top-2.5 ensures safe clearance from header text) */}
        <div className="absolute left-1 sm:left-2 top-2.5 w-[114px] sm:w-[124px] -rotate-6 z-10">
          {renderPolaroidCard(cards[0], "", 0, false)}
        </div>

        {/* Card 2: Bottom-Left */}
        <div className="absolute left-0 sm:left-1 bottom-1 w-[114px] sm:w-[124px] rotate-5 z-12">
          {renderPolaroidCard(cards[1], "", 1, false)}
        </div>

        {/* Card 3: Top-Right (top-2.5 ensures safe clearance from header text) */}
        <div className="absolute right-1 sm:right-2 top-2.5 w-[114px] sm:w-[124px] rotate-7 z-10">
          {renderPolaroidCard(cards[2], "", 2, false)}
        </div>

        {/* Card 4: Center (Raised higher up into the center sweet spot between top and bottom cards) */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-12 sm:bottom-14 w-[124px] sm:w-[136px] -rotate-2 z-20">
          {renderPolaroidCard(cards[3], "shadow-2xl ring-1 ring-amber-400/35", 3, false)}
        </div>

        {/* Card 5: Bottom-Right */}
        <div className="absolute right-0 sm:right-1 bottom-1 w-[114px] sm:w-[124px] -rotate-5 z-12">
          {renderPolaroidCard(cards[4], "", 4, false)}
        </div>
      </div>

      {/* 3. Action Buttons & Divider */}
      <div className="flex flex-col items-center gap-2 pt-2">
        {button_text && safePrimaryLink && (
          <Link
            href={safePrimaryLink}
            className={`w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${themeStyles.btnGradient} py-2.5 px-4 text-xs font-black text-white shadow-lg shadow-amber-600/30 transition active:scale-95`}
          >
            <span>{button_text}</span>
          </Link>
        )}

        {secondary_button_text && safeSecondaryLink && (
          <Link
            href={safeSecondaryLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-amber-600/40 py-2.5 px-4 text-xs font-bold text-amber-200 transition"
          >
            <span>{secondary_button_text}</span>
          </Link>
        )}

        {OrnamentalDivider}

        {tagline && (
          <div className="text-center text-[9px] font-medium tracking-wide text-amber-300/70 pt-0.5">
            {tagline}
          </div>
        )}
      </div>
    </div>
  );

  // ──────────────── SUB-COMPONENT: DESKTOP VIEWPORT LAYOUT ────────────────
  const DesktopLayout = (
    <div className="relative z-10 grid grid-cols-12 gap-6 lg:gap-8 xl:gap-10 items-center min-h-[400px] xl:min-h-[440px] pt-4">
      {/* Left Column (5 cols): Festive Greetings & CTA with large, bold typography */}
      <div className="col-span-12 lg:col-span-5 xl:col-span-5 space-y-4 xl:space-y-5 pl-3 lg:pl-6">
        <div className="space-y-2">
          <h2 className="font-serif text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight text-amber-200 drop-shadow-xl leading-tight">
            {heading}
          </h2>
          {subheading && (
            <p className="text-base lg:text-lg xl:text-xl text-amber-100/90 font-medium leading-relaxed max-w-xl">
              {subheading}
            </p>
          )}
          {sale_tagline && (
            <p className="text-sm lg:text-base font-semibold text-amber-300/90 pt-0.5">
              {sale_tagline}
            </p>
          )}
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3.5 pt-2">
          {button_text && safePrimaryLink && (
            <Link
              href={safePrimaryLink}
              className={`inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r ${themeStyles.btnGradient} px-8 py-3.5 text-base font-black text-white shadow-xl shadow-amber-600/35 transition hover:scale-102 active:scale-95`}
            >
              <span>{button_text}</span>
            </Link>
          )}

          {secondary_button_text && safeSecondaryLink && (
            <Link
              href={safeSecondaryLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-amber-600/40 px-6 py-3.5 text-base font-bold text-amber-200 transition"
            >
              <span>{secondary_button_text}</span>
            </Link>
          )}
        </div>

        {OrnamentalDivider}

        {tagline && (
          <div className="text-xs font-medium tracking-wide text-amber-300/70 pt-0.5">
            {tagline}
          </div>
        )}
      </div>

      {/* Right Column (7 cols): 5 Large Scattered Polaroid Cards Filling the Area Boldly */}
      <div className="col-span-12 lg:col-span-7 xl:col-span-7 relative h-[400px] lg:h-[430px] xl:h-[460px] w-full flex items-center justify-center">
        {/* Card 1: Top-Left of cluster */}
        <div className="absolute left-2 lg:left-4 xl:left-8 top-3 lg:top-4 w-[220px] lg:w-[250px] xl:w-[275px] -rotate-4 z-10">
          {renderPolaroidCard(cards[0], "shadow-xl", 0, true)}
        </div>

        {/* Card 2: Mid/Bottom-Left, tilted out */}
        <div className="absolute left-0 lg:left-2 xl:left-4 bottom-5 lg:bottom-7 w-[215px] lg:w-[245px] xl:w-[270px] -rotate-8 z-12">
          {renderPolaroidCard(cards[1], "shadow-2xl", 1, true)}
        </div>

        {/* Card 3: Top-Right of cluster */}
        <div className="absolute right-4 lg:right-6 xl:right-10 top-2 lg:top-3 w-[220px] lg:w-[250px] xl:w-[275px] rotate-7 z-11">
          {renderPolaroidCard(cards[2], "shadow-xl", 2, true)}
        </div>

        {/* Card 4: Center Hero (Prominently overlapping center) */}
        <div className="absolute left-[27%] lg:left-[29%] xl:left-[31%] bottom-3 lg:bottom-4 w-[230px] lg:w-[260px] xl:w-[290px] rotate-2 z-20">
          {renderPolaroidCard(cards[3], "shadow-2xl ring-1 ring-amber-400/35", 3, true)}
        </div>

        {/* Card 5: Bottom-Right */}
        <div className="absolute right-0 lg:right-2 xl:right-4 bottom-2 lg:bottom-3 w-[220px] lg:w-[250px] xl:w-[275px] -rotate-6 z-16">
          {renderPolaroidCard(cards[4], "shadow-xl", 4, true)}
        </div>
      </div>
    </div>
  );

  const customBgStyle = themeStyles.isCustom
    ? { background: `linear-gradient(135deg, ${themeStyles.customHex} 0%, #060608 100%)` }
    : undefined;

  // If isMobileView prop is explicitly provided, render without media queries
  if (isMobileView === true) {
    return (
      <div
        style={customBgStyle}
        className={`relative overflow-hidden rounded-xl border border-amber-800/40 ${themeStyles.isCustom ? "" : `bg-gradient-to-b ${themeStyles.gradient}`} px-4 pt-7 pb-6 shadow-2xl text-white`}
      >
        {/* Pattern & Lights */}
        {PatternOverlay}
        {FestiveGarland}
        <div className={`pointer-events-none absolute -top-16 -left-16 h-48 w-48 rounded-full ${themeStyles.glow1} blur-3xl`} />
        <div className={`pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full ${themeStyles.glow2} blur-3xl`} />
        {MobileLayout}
      </div>
    );
  }

  if (isMobileView === false) {
    return (
      <div
        style={customBgStyle}
        className={`relative overflow-hidden rounded-2xl border border-amber-800/40 ${themeStyles.isCustom ? "" : `bg-gradient-to-r ${themeStyles.gradient}`} px-6 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-8 xl:px-12 xl:py-10 shadow-2xl text-white`}
      >
        {/* Pattern & Lights */}
        {PatternOverlay}
        {FestiveGarland}
        <div className={`pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full ${themeStyles.glow1} blur-3xl`} />
        <div className={`pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full ${themeStyles.glow2} blur-3xl`} />
        {DesktopLayout}
      </div>
    );
  }

  // Fallback for live product page (uses CSS responsive breakpoints)
  return (
    <div
      style={customBgStyle}
      className={`relative overflow-hidden rounded-xl sm:rounded-2xl border border-amber-800/40 ${themeStyles.isCustom ? "" : `bg-gradient-to-r ${themeStyles.gradient}`} px-4 pt-7 pb-6 sm:px-6 sm:pt-8 sm:pb-7 lg:px-10 lg:py-8 xl:px-12 xl:py-10 shadow-2xl text-white`}
    >
      {PatternOverlay}
      {FestiveGarland}
      <div className={`pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full ${themeStyles.glow1} blur-3xl`} />
      <div className={`pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full ${themeStyles.glow2} blur-3xl`} />

      {/* Mobile view (< lg) */}
      <div className="block lg:hidden">{MobileLayout}</div>

      {/* Desktop view (>= lg) */}
      <div className="hidden lg:block">{DesktopLayout}</div>
    </div>
  );
}
