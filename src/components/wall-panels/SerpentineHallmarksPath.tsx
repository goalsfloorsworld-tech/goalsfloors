"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Droplets,
  Maximize2,
  ShieldCheck,
  Palette,
  Sparkles,
  CheckCircle2,
  Activity,
  ArrowUpRight,
  Volume2,
  Tv,
  Layers,
  Clock,
  ChevronDown,
} from "lucide-react";
import { WallPanelExperienceData } from "@/data/wall-panels-experience";

interface SerpentineHallmarksPathProps {
  panel: WallPanelExperienceData;
}

interface HallmarkItem {
  id: string;
  letter: string;
  step: string;
  metric: string;
  metricLabel: string;
  shortLabel: string;
  title: string;
  subtitle: string;
  description: string;
  benefits: string[];
  baseImage: string;
  hudBadge: string;
  hudDetail: string;
  icon: React.ReactNode;
}

export default function SerpentineHallmarksPath({
  panel,
}: SerpentineHallmarksPathProps) {
  // Desktop active pillar (0 to 4)
  const [activeIdx, setActiveIdx] = useState<number>(0);

  // Phone Screen active pillar (null = all 5 closed by default, single expand on click)
  const [mobileActiveIdx, setMobileActiveIdx] = useState<number | null>(null);

  // 5 Pillars mapped to letters (PRIMO for primo / ELITE for elite)
  const getHallmarks = (): HallmarkItem[] => {
    if (panel.slug === "primo" || panel.slug === "primo-fluted") {
      return [
        {
          id: "pillar-p",
          letter: "P",
          step: "01",
          metric: "0.0%",
          metricLabel: "Water Absorption",
          shortLabel: "Permanent Seelan",
          title: "Permanent Seelan Immunity",
          subtitle: "Closed-Cell Polymer Hydrophobic Core",
          description:
            "Rising dampness and monsoon humidity ruin wall paint across Delhi NCR. Primo's closed-cell polymer core stops peeling paint and efflorescence permanently.",
          benefits: [
            "Zero peeling paint, crumbling plaster, or flaking",
            "Impervious to monsoon dampness and rising moisture",
            "100% mold, mildew, and fungal spore repellent",
          ],
          baseImage: "/images/wall-panels/primo-plain-texture.jpg",
          hudBadge: "Hydrophobic Seal",
          hudDetail: "Surface Tension Bead Test • Zero Absorption",
          icon: <Droplets className="w-4 h-4 text-sky-400" />,
        },
        {
          id: "pillar-r",
          letter: "R",
          step: "02",
          metric: "100%",
          metricLabel: "Termite & Borer Armor",
          shortLabel: "Robust Armor",
          title: "Robust Termite & Scratch Armor",
          subtitle: "Diamond Shield UV Polymer Matrix",
          description:
            "Contains zero organic sawdust or wood flour, making it completely non-nutritive to subterranean termites. The cured UV surface resists daily pet scuffs and key scratches.",
          benefits: [
            "100% termite and borer immune polymer matrix",
            "Class 1 surface scratch and abrasion resistance",
            "Wipes spotless with simple damp cloth",
          ],
          baseImage: "/images/wall-panels/hallmark-scratch-armor.jpg",
          hudBadge: "Diamond Shield Armor",
          hudDetail: "100% Termite Immune • Zero Wood Flour Core",
          icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
        },
        {
          id: "pillar-i",
          letter: "I",
          step: "03",
          metric: "12-Inch",
          metricLabel: "Seamless Breadth (300mm)",
          shortLabel: "Invisible Seams",
          title: "Invisible & Half the Seams",
          subtitle: "Monolithic Architectural Drop",
          description:
            "Standard panels are only 6 inches wide. Primo's double-width 300mm extrusion cuts visible joint lines by 50% for an unbroken, continuous monolithic visual across 9.5 feet.",
          benefits: [
            "50% fewer vertical joints across walls",
            "Precision micro-bevel tongue-and-groove fit",
            "Seamless full 9.5-foot floor-to-ceiling run",
          ],
          baseImage: "/images/wall-panels/primo-plain-room.jpg",
          hudBadge: "Monolithic Extrusion",
          hudDetail: "300mm Double-Width • 50% Fewer Joints",
          icon: <Maximize2 className="w-4 h-4 text-amber-400" />,
        },
        {
          id: "pillar-m",
          letter: "M",
          step: "04",
          metric: "Zero",
          metricLabel: "Maintenance or Polish",
          shortLabel: "Maintenance-Free",
          title: "Maintenance-Free Longevity",
          subtitle: "Pre-Finished Architectural Surface",
          description:
            "Eliminates recurring painting, sanding, and polish costs. Factory cured architectural foil retains its rich tactile grain depth and satin luster for decades.",
          benefits: [
            "Zero annual polishing, waxing, or varnishing",
            "Stain resistant to oil, coffee, and household spills",
            "Factory pre-finished architectural foil",
          ],
          baseImage: "/images/wall-panels/primo-fluted-texture.jpg",
          hudBadge: "Zero Polish Needed",
          hudDetail: "UV-Cured Architectural Surface • Zero Upkeep",
          icon: <Sparkles className="w-4 h-4 text-amber-300" />,
        },
        {
          id: "pillar-o",
          letter: "O",
          step: "05",
          metric: "24",
          metricLabel: "Architectural Finishes",
          shortLabel: "Opulent Finishes",
          title: "Opulent Designer Textures",
          subtitle: "Synchronized Wood & Marble Foil",
          description:
            "From warm smoked walnuts and antique teaks to Italian statuario marbles, each texture is synchronized with tactile grain embossing. Backed by bulk ready stock in Gurgaon.",
          benefits: [
            "Synchronized tactile wood-pore foil",
            "Guaranteed batch color consistency",
            "Direct Gurgaon warehouse dispatch in 24 hours",
          ],
          baseImage: "/images/wall-panels/hallmark-curated-finishes.jpg",
          hudBadge: "Ready Stock Gurugram",
          hudDetail: "24 Curated Architectural Finishes",
          icon: <Palette className="w-4 h-4 text-amber-300" />,
        },
      ];
    } else {
      return [
        {
          id: "pillar-e1",
          letter: "E",
          step: "01",
          metric: "0.85",
          metricLabel: "NRC Certified Rating",
          shortLabel: "Eco Acoustics",
          title: "Eco-Acoustic Trapping",
          subtitle: "Dense 9mm Eco-PET Matrix",
          description:
            "Traps 85% of incident sound energy across conversational and home cinema frequencies, eliminating hollow room reverberation and flutter echo.",
          benefits: [
            "Lab-tested 0.85 Noise Reduction Coefficient",
            "Tames sound bleed through adjoining walls",
            "Engineered for audiophiles & luxury home theatres",
          ],
          baseImage: "/images/wall-panels/elite-room.jpg",
          hudBadge: "Acoustic Matrix",
          hudDetail: "9mm Recycled Eco-PET Sound Absorber",
          icon: <Volume2 className="w-4 h-4 text-emerald-400" />,
        },
        {
          id: "pillar-l",
          letter: "L",
          step: "02",
          metric: "Zero",
          metricLabel: "Reflections on OLED",
          shortLabel: "Light Absorption",
          title: "Low-Reflection Stealth Carbon",
          subtitle: "Ultra-Matte Light-Absorbing Finish",
          description:
            "Crafted specifically for OLED television entertainment backdrops. The ultra-matte carbon finish absorbs ambient light rather than bouncing it onto your high-contrast screen.",
          benefits: [
            "Anti-glare surface enhances TV black levels",
            "Sleek architectural contrast against ambient backlights",
            "Precision-spaced vertical wood slats",
          ],
          baseImage: "/images/wall-panels/elite-texture.jpg",
          hudBadge: "OLED Anti-Glare",
          hudDetail: "Ultra-Matte Stealth Carbon Slats",
          icon: <Tv className="w-4 h-4 text-cyan-400" />,
        },
        {
          id: "pillar-i2",
          letter: "I",
          step: "03",
          metric: "100%",
          metricLabel: "Indoor Air Safe",
          shortLabel: "Indoor Eco-PET",
          title: "Indoor Safe & Hypoallergenic",
          subtitle: "Zero Formaldehyde Binders",
          description:
            "Acoustic backing is thermo-pressed from recycled plastic bottles with zero harmful volatile organic compounds (VOCs) or toxic glues, making it safe for bedrooms and nurseries.",
          benefits: [
            "Zero VOC emissions and odorless installation",
            "Hypoallergenic and flame-retardant felt core",
            "Sustainable architectural manufacturing",
          ],
          baseImage: "/images/wall-panels/hallmark-scratch-armor.jpg",
          hudBadge: "Eco-PET Core",
          hudDetail: "Thermo-Pressed Recycled Polyester Backing",
          icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
        },
        {
          id: "pillar-t",
          letter: "T",
          step: "04",
          metric: "24-Inch",
          metricLabel: "Wide Slat Drop (600mm)",
          shortLabel: "Timber Slat Drop",
          title: "Timber Slat Modular Drop",
          subtitle: "Concealed Cable Channel Architecture",
          description:
            "The 9mm acoustic felt gaps naturally route power cords, HDMI cables, and speaker cables completely out of sight without needing to carve messy chases into structural walls.",
          benefits: [
            "Hides messy TV and speaker wiring invisibly",
            "Modular 600mm panels install in 1/3 the time",
            "Clean wire management behind felt gaps",
          ],
          baseImage: "/images/wall-panels/primo-fluted-room.jpg",
          hudBadge: "Cable Management",
          hudDetail: "Integrated Concealed Channel Architecture",
          icon: <Layers className="w-4 h-4 text-amber-300" />,
        },
        {
          id: "pillar-e2",
          letter: "E",
          step: "05",
          metric: "24hr",
          metricLabel: "Dispatch Ready",
          shortLabel: "Expedited Stock",
          title: "Expedited Gurugram Stock",
          subtitle: "Direct Factory Warehouse Inventory",
          description:
            "Ready inventory stored at our Gurgaon warehouse ensures direct 24-hour site delivery without months of import delay.",
          benefits: [
            "Direct Gurgaon warehouse dispatch in 24 hours",
            "Professional installation teams across Delhi NCR",
            "Wholesale direct trade pricing",
          ],
          baseImage: "/images/wall-panels/hallmark-curated-finishes.jpg",
          hudBadge: "Gurgaon Direct",
          hudDetail: "Wholesale Inventory Ready for Dispatch",
          icon: <Clock className="w-4 h-4 text-amber-400" />,
        },
      ];
    }
  };

  const hallmarks = getHallmarks();

  return (
    <div className="relative w-full pt-4 sm:pt-8 pb-12 sm:pb-16 bg-neutral-50 dark:bg-black text-neutral-900 dark:text-white transition-colors duration-300 overflow-hidden">
      {/* Subtle Ambient Backlights */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[450px] h-[450px] bg-amber-500/5 dark:bg-amber-500/5 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[450px] h-[450px] bg-amber-600/5 dark:bg-amber-600/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header (No capsule, reduced top spacing) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-4 sm:mb-6">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-neutral-900 dark:text-white">
              The 5 Pillars of{" "}
              <span className="font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 dark:from-amber-200 dark:via-amber-400 dark:to-yellow-100">
                {panel.name.split(" ")[0].toUpperCase()}
              </span>
            </h2>
          </div>

          {/* Quick Helper Badge */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400 animate-pulse" />
            <span className="md:hidden">Tap any pillar to expand</span>
            <span className="hidden md:inline">Hover or click any pillar to expand</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MOBILE VIEW (md:hidden): 5 HORIZONTAL BARS (P - R - I - M - O) */}
        {/* All 5 initially closed. Tapping one expands it (only 1 open at a time). */}
        {/* ========================================================================= */}
        <div className="flex md:hidden flex-col gap-3 w-full select-none">
          {hallmarks.map((item, idx) => {
            const isExpanded = mobileActiveIdx === idx;

            return (
              <div
                key={`mob-${item.id}`}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden relative backdrop-blur-xl ${
                  isExpanded
                    ? "border-amber-500/80 dark:border-amber-400/70 bg-white dark:bg-neutral-950 shadow-xl dark:shadow-[0_16px_40px_rgba(0,0,0,0.9),0_0_24px_rgba(245,158,11,0.18)] ring-1 ring-amber-500/30 dark:ring-amber-400/40"
                    : "border-neutral-200 dark:border-white/10 bg-white/90 dark:bg-neutral-950/85 hover:border-neutral-300 dark:hover:border-white/25 shadow-md dark:shadow-lg"
                }`}
              >
                {/* Subtle Background Photo Preview */}
                <div className="absolute inset-0 pointer-events-none z-0">
                  <Image
                    src={item.baseImage}
                    alt={item.title}
                    fill
                    sizes="100vw"
                    className={`object-cover transition-all duration-500 ${
                      isExpanded
                        ? "opacity-20 dark:opacity-30 brightness-90 contrast-105 scale-105"
                        : "opacity-10 dark:opacity-15 brightness-50 contrast-125 scale-100"
                    }`}
                  />
                  <div
                    className={`absolute inset-0 transition-opacity duration-300 ${
                      isExpanded
                        ? "bg-gradient-to-b from-white/95 via-white/90 to-white/95 dark:from-black/95 dark:via-black/85 dark:to-black/95"
                        : "bg-white/80 dark:bg-black/75"
                    }`}
                  />
                </div>

                {/* CLICKABLE HORIZONTAL BAR HEADER (ALWAYS VISIBLE) */}
                <div
                  onClick={() =>
                    setMobileActiveIdx((prev) => (prev === idx ? null : idx))
                  }
                  className="relative z-10 w-full p-3.5 sm:p-4 flex items-center justify-between cursor-pointer select-none"
                >
                  {/* Left: Letter Badge + Title info */}
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    {/* GIANT LETTER CUTOUT BADGE (P, R, I, M, O) */}
                    <div
                      className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-black/80 border border-neutral-200 dark:border-white/20 flex items-center justify-center font-black text-2xl tracking-tighter shadow-sm dark:shadow-md shrink-0 relative overflow-hidden"
                      style={{
                        backgroundImage: `url(${item.baseImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        WebkitTextStroke: "0.5px rgba(180, 140, 80, 0.4)",
                        filter: "contrast(1.4) brightness(1.2)",
                      }}
                    >
                      {item.letter}
                    </div>

                    <div className="min-w-0 flex flex-col justify-center">
                      <div className="flex items-center gap-1.5 font-mono text-[10px] text-amber-700 dark:text-amber-300 font-semibold">
                        <span className="font-bold">{item.step}</span>
                        <span className="text-neutral-400 dark:text-white/30">•</span>
                        <span className="truncate">{item.hudBadge}</span>
                      </div>
                      <h3 className="text-sm font-bold text-neutral-900 dark:text-white tracking-tight truncate mt-0.5">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                          {item.metric}
                        </span>
                        <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono truncate">
                          {item.metricLabel}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Expand / Collapse Toggle Icon */}
                  <div
                    className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isExpanded
                        ? "bg-amber-500 dark:bg-amber-400 border-amber-500 dark:border-amber-400 text-white dark:text-black shadow-md rotate-180"
                        : "bg-neutral-100 dark:bg-white/5 border-neutral-200 dark:border-white/15 text-neutral-500 dark:text-neutral-400"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4 transition-transform duration-300" />
                  </div>
                </div>

                {/* EXPANDED CONTENT ACCORDION (SMOOTH ANIMATION) */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="relative z-10 overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-1 border-t border-neutral-200 dark:border-white/10 relative">
                        {/* GIANT TRANSPARENT OUTLINE WATERMARK LETTER IN BACKGROUND */}
                        <div className="absolute right-3 top-2 pointer-events-none select-none z-0 opacity-15 dark:opacity-25">
                          <span
                            className="font-black text-[120px] leading-none tracking-tighter block"
                            style={{
                              color: "transparent",
                              WebkitTextStroke: "1.5px currentColor",
                              textShadow: "0 0 25px rgba(245, 158, 11, 0.25)",
                            }}
                          >
                            {item.letter}
                          </span>
                        </div>

                        {/* Subtitle & Category */}
                        <div className="relative z-10 flex items-center gap-2 mb-2">
                          <span className="text-xs font-mono font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
                            {item.subtitle}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="relative z-10 text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-light mb-3.5">
                          {item.description}
                        </p>

                        {/* Proof Points List */}
                        <div className="relative z-10 space-y-2 py-2.5 border-y border-neutral-200 dark:border-white/10">
                          {item.benefits.map((benefit, bIdx) => (
                            <div key={bIdx} className="flex items-start gap-2.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                              <span className="text-xs text-neutral-800 dark:text-neutral-200 font-light leading-snug">
                                {benefit}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Bottom Spec Verification Footer */}
                        <div className="relative z-10 mt-3 pt-1 flex items-center justify-between text-[11px] font-mono">
                          <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-medium">
                            <Activity className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 animate-pulse" />
                            <span>{item.hudDetail}</span>
                          </span>
                          <button
                            onClick={() => setMobileActiveIdx(null)}
                            className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white underline decoration-neutral-300 dark:decoration-white/20 underline-offset-2"
                          >
                            Collapse
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* DESKTOP VIEW (hidden md:flex): 5 EXPANDING STANDING PILLARS */}
        {/* ========================================================================= */}
        <div className="hidden md:flex gap-2.5 lg:gap-3.5 h-[540px] md:h-[570px] lg:h-[610px] w-full items-stretch select-none">
          {hallmarks.map((item, idx) => {
            const isActive = activeIdx === idx;

            return (
              <div
                key={item.id}
                onClick={() => setActiveIdx(idx)}
                onMouseEnter={() => setActiveIdx(idx)}
                style={{
                  willChange: "flex-grow",
                  transition:
                    "flex 0.45s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.3s ease",
                }}
                className={`relative rounded-2xl md:rounded-3xl overflow-hidden border cursor-pointer flex flex-col justify-between transform-gpu ${
                  isActive
                    ? "flex-[3.6] sm:flex-[3.5] lg:flex-[4] border-amber-500/70 dark:border-amber-400/60 shadow-2xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
                    : "flex-1 min-w-[34px] sm:min-w-[42px] md:min-w-0 border-neutral-200 dark:border-white/10 hover:border-amber-400/40 bg-white dark:bg-neutral-950"
                }`}
              >
                {/* ------------------------------------------------------------- */}
                {/* BACKGROUND PHOTO (ALWAYS MOUNTED FOR INSTANT 60FPS TRANSITION) */}
                {/* ------------------------------------------------------------- */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                  <Image
                    src={item.baseImage}
                    alt={item.title}
                    fill
                    sizes="(max-width: 1200px) 50vw, 33vw"
                    className={`object-cover transition-all duration-700 ease-out ${
                      isActive
                        ? "scale-105 brightness-[0.95] dark:brightness-[0.88] contrast-[1.08] opacity-100"
                        : "scale-100 brightness-75 dark:brightness-[0.18] contrast-[1.2] opacity-25"
                    }`}
                  />
                  {/* Contrast Gradient */}
                  <div
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      isActive
                        ? "bg-gradient-to-t from-white/95 via-white/40 to-white/40 dark:from-black/95 dark:via-black/35 dark:to-black/40 opacity-90"
                        : "bg-white/70 dark:bg-black/70"
                    }`}
                  />
                </div>

                {/* ------------------------------------------------------------- */}
                {/* ACTIVE (EXPANDED) PILLAR CONTENT */}
                {/* ------------------------------------------------------------- */}
                {isActive ? (
                  <div className="relative z-10 w-full h-full flex flex-col justify-between p-3.5 sm:p-5 lg:p-8 overflow-hidden">
                    {/* GIANT TRANSPARENT OUTLINE WATERMARK LETTER (P, R, I, M, O) */}
                    <div className="absolute right-2 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 pointer-events-none select-none z-[2]">
                      <span
                        className="font-black text-[110px] sm:text-[160px] md:text-[210px] lg:text-[260px] leading-none tracking-tighter block"
                        style={{
                          color: "transparent",
                          WebkitTextStroke: "1.5px currentColor",
                          textShadow: "0 0 35px rgba(245, 158, 11, 0.2)",
                        }}
                      >
                        {item.letter}
                      </span>
                    </div>

                    {/* Top Row: Milestone Tag & Verified Badge */}
                    <div className="relative z-10 flex items-center justify-between gap-2 sm:gap-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        {/* Letter Indicator Badge */}
                        <div
                          className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-xl sm:rounded-2xl bg-white/80 dark:bg-black/70 border border-amber-500/40 dark:border-amber-400/40 backdrop-blur-md flex items-center justify-center font-black text-lg sm:text-xl md:text-2xl tracking-tighter shadow-lg shrink-0"
                          style={{
                            backgroundImage: `url(${item.baseImage})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            WebkitTextStroke: "0.5px rgba(180, 140, 80, 0.3)",
                            filter: "contrast(1.5) brightness(1.2)",
                          }}
                        >
                          {item.letter}
                        </div>

                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 dark:bg-black/60 border border-neutral-200 dark:border-white/20 backdrop-blur-md text-amber-700 dark:text-amber-300 font-mono text-[10px] sm:text-xs">
                          <span>{item.step}</span>
                          <span className="text-neutral-400 dark:text-white/40">•</span>
                          <span className="truncate max-w-[120px] sm:max-w-none">{item.hudBadge}</span>
                        </div>
                      </div>

                      <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 font-mono text-xs shrink-0">
                        <Activity className="w-3.5 h-3.5 animate-pulse text-emerald-600 dark:text-emerald-400" />
                        <span>VERIFIED SPEC</span>
                      </div>
                    </div>

                    {/* Bottom Floating Transparent Glass HUD */}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="relative z-10 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 lg:p-6 bg-white/90 dark:bg-black/65 border border-neutral-200 dark:border-white/25 backdrop-blur-xl shadow-xl dark:shadow-[0_20px_45px_rgba(0,0,0,0.85)] overflow-hidden"
                    >
                      {/* Laser Top Sweep Accent */}
                      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-500 dark:via-amber-400 to-transparent opacity-80" />

                      <div className="flex items-start justify-between gap-2 sm:gap-4 mb-2">
                        <div>
                          <div className="flex items-baseline gap-2 sm:gap-3">
                            <span className="text-2xl sm:text-4xl lg:text-5xl font-black text-neutral-900 dark:text-white tracking-tight leading-none">
                              {item.metric}
                            </span>
                            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold truncate">
                              {item.metricLabel}
                            </span>
                          </div>
                          <h3 className="text-base sm:text-xl lg:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight mt-1 truncate">
                            {item.title}
                          </h3>
                        </div>

                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 dark:border-amber-500/40 flex items-center justify-center shrink-0">
                          {item.icon}
                        </div>
                      </div>

                      <p className="text-neutral-700 dark:text-neutral-300 text-[11px] sm:text-xs lg:text-sm leading-relaxed font-light mb-2.5 sm:mb-3.5 line-clamp-2 md:line-clamp-3">
                        {item.description}
                      </p>

                      {/* Proof Points (hidden on extra-small mobile, shown on sm+) */}
                      <div className="hidden sm:grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 sm:pt-3 border-t border-neutral-200 dark:border-white/10">
                        {item.benefits.map((b, bIdx) => (
                          <div key={bIdx} className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
                            <span className="text-[11px] lg:text-xs text-neutral-700 dark:text-neutral-300 font-light truncate">
                              {b}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                ) : (
                  /* ----------------------------------------------------------- */
                  /* INACTIVE (COLLAPSED) PILLAR SPINE WITH IMAGE-CUTOUT LETTER */
                  /* ----------------------------------------------------------- */
                  <div className="relative z-10 w-full h-full flex flex-col justify-between items-center py-3.5 sm:py-5 md:py-6 px-0.5 sm:px-1">
                    {/* Step Number Top */}
                    <div className="text-[9px] sm:text-[10px] md:text-[11px] font-mono font-bold text-neutral-500 dark:text-neutral-400 tracking-wider">
                      {item.step}
                    </div>

                    {/* GIANT LETTER WITH IMAGE CUTOUT (P, R, I, M, O) */}
                    <div className="flex flex-col items-center justify-center my-auto">
                      <span
                        className="font-black text-3xl sm:text-5xl md:text-7xl lg:text-[95px] xl:text-[110px] tracking-tighter uppercase select-none leading-none drop-shadow-md dark:drop-shadow-[0_8px_16px_rgba(0,0,0,0.95)]"
                        style={{
                          backgroundImage: `url(${item.baseImage})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          WebkitTextStroke: "1px rgba(180, 140, 80, 0.4)",
                          filter: "contrast(1.4) brightness(1.2)",
                        }}
                      >
                        {item.letter}
                      </span>
                      <span className="text-[8px] sm:text-[9px] md:text-[11px] font-mono text-amber-600 dark:text-amber-400 tracking-wider uppercase mt-1.5 font-bold truncate max-w-[32px] sm:max-w-none text-center">
                        {item.metric}
                      </span>
                    </div>

                    {/* Bottom Quick Expand Arrow */}
                    <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-md sm:rounded-lg bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                      <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
