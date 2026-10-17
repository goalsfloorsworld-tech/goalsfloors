"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  Box,
  Scale,
  Maximize2,
  CheckCircle2,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Package,
} from "lucide-react";
import { WallPanelExperienceData, CatalogVariant } from "@/data/wall-panels-experience";

interface PanelSpecsRackProps {
  panel: WallPanelExperienceData;
}

// Slot-machine rolling number/word component for specs
function RollingSpecValue({
  value,
  variantKey,
  delay = 0,
  highlight = false,
}: {
  value: string;
  variantKey: string;
  delay?: number;
  highlight?: boolean;
}) {
  return (
    <div className="relative overflow-hidden h-5 flex items-center justify-end">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={variantKey}
          initial={{ y: -16, opacity: 0, filter: "blur(2px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: 16, opacity: 0, filter: "blur(2px)" }}
          transition={{ duration: 0.26, delay, ease: [0.22, 1, 0.36, 1] }}
          className={`font-bold inline-block text-right ${
            highlight ? "text-amber-600 dark:text-amber-300" : "text-neutral-900 dark:text-white"
          }`}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

export default function PanelSpecsRack({ panel }: PanelSpecsRackProps) {
  const allVariants: CatalogVariant[] =
    panel.catalogVariants && panel.catalogVariants.length > 0
      ? panel.catalogVariants
      : [
          {
            id: panel.slug,
            code: panel.name,
            name: panel.title,
            type: panel.slug.includes("fluted") ? "fluted" : "plain",
            thickness: panel.dimensions.thickness,
            dimensions: panel.dimensions.height,
            badge: panel.badge,
            textureUrl: panel.heroImage,
            thumbnailUrl: panel.heroImage,
            colorHex: panel.themeColor,
            description: panel.tagline,
          },
        ];

  // Background Prefetch and Decode all variant texture images immediately
  useEffect(() => {
    if (typeof window === "undefined" || !allVariants.length) return;
    allVariants.forEach((v) => {
      if (v.textureUrl) {
        const img = new window.Image();
        img.src = v.textureUrl;
        if (img.decode) {
          img.decode().catch(() => {});
        }
      }
      if (v.thumbnailUrl) {
        const thumb = new window.Image();
        thumb.src = v.thumbnailUrl;
        if (thumb.decode) {
          thumb.decode().catch(() => {});
        }
      }
    });
  }, [allVariants]);

  // Batch toggle: 0 for Shades 01-12, 1 for Shades 13-24
  const [activeBatch, setActiveBatch] = useState<0 | 1>(0);

  // 12 variants for current batch: split into 2 columns of 6 cards each
  const batchVariants = allVariants.slice(activeBatch * 12, activeBatch * 12 + 12);
  const col1Variants = batchVariants.slice(0, 6);
  const col2Variants = batchVariants.slice(6, 12);

  // Active selected variant across the whole rack
  const [selectedVariant, setSelectedVariant] = useState<CatalogVariant>(allVariants[0]);

  // Mobile column group (4 groups of 6 shades: 01-06, 07-12, 13-18, 19-24)
  const [mobileColIdx, setMobileColIdx] = useState<number>(0);
  const totalMobileCols = Math.ceil(allVariants.length / 6);

  // Pricing details based on official catalog sheet & JSON database
  const isFluted = panel.slug.includes("fluted");
  
  // Real MRP, selling price & discount matching JSON
  const mrpPrice = isFluted ? "₹850" : "₹650";
  const pricePerPanel = isFluted ? "550" : "498";
  const discountBadge = "SAVE 35% WHOLESALE";
  const sqFtRate = isFluted ? "₹105.7/sq.ft" : "₹52.5/sq.ft";

  // 3D Isometric Card Parameters - Spacious Explosive Cascade
  const rotateX = 44;
  const rotateZ = -15;
  const stepY = 74;

  return (
    <div className="relative w-full max-w-[1780px] mx-auto pt-2 sm:pt-4 pb-12 px-3 sm:px-6 lg:px-8 text-neutral-900 dark:text-white transition-colors duration-300">
      {/* Section Header (No 3D showroom capsule) */}
      <div className="text-center max-w-3xl mx-auto mb-4 sm:mb-6">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extralight tracking-tight text-neutral-900 dark:text-white mb-2">
          Precision Dimensions &{" "}
          <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 dark:from-amber-200 dark:via-amber-400 dark:to-amber-100 italic">
            Architectural Spec Sheet
          </span>
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Dual 3D showroom stands featuring 6 cards per column. Click any sample to slide it out subtly from the deck with live architectural specifications.
        </p>
      </div>

      {/* Main Grid: Left 2 Columns of 6 3D Cards | Right Spec Sheet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-12 items-center">
        {/* ============================================================= */}
        {/* LEFT: 2 COLUMNS OF 6 3D CARDS (GRAND ARCHITECTURAL STANDS) */}
        {/* ============================================================= */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative">
          {/* Ambient Warm Underglow */}
          <div
            className="absolute w-[450px] h-[450px] rounded-full blur-[140px] pointer-events-none opacity-20 dark:opacity-25 transition-colors duration-700"
            style={{ backgroundColor: selectedVariant.colorHex || "#f59e0b" }}
          />

          {/* Desktop Top Batch Switcher (Shades 01-12 vs Shades 13-24) */}
          {allVariants.length > 12 && (
            <div className="hidden md:flex mb-8 z-20 items-center gap-1.5 p-1 rounded-full bg-white/90 dark:bg-neutral-950/90 border border-neutral-200 dark:border-white/15 backdrop-blur-xl shadow-lg">
              <button
                onClick={() => {
                  setActiveBatch(0);
                  setSelectedVariant(allVariants[0]);
                }}
                className={`px-5 py-1.5 rounded-full text-xs font-mono font-semibold transition-all ${
                  activeBatch === 0
                    ? "bg-amber-500 dark:bg-amber-400 text-white dark:text-black shadow-md font-bold"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                }`}
              >
                Shades 01 – 12
              </button>
              <button
                onClick={() => {
                  setActiveBatch(1);
                  setSelectedVariant(allVariants[12] || allVariants[0]);
                }}
                className={`px-5 py-1.5 rounded-full text-xs font-mono font-semibold transition-all ${
                  activeBatch === 1
                    ? "bg-amber-500 dark:bg-amber-400 text-white dark:text-black shadow-md font-bold"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                }`}
              >
                Shades 13 – {allVariants.length}
              </button>
            </div>
          )}

          {/* Mobile 4-Column Group Switcher (01-06, 07-12, 13-18, 19-24) */}
          <div className="flex md:hidden mb-6 z-20 items-center justify-center gap-1 p-1 rounded-full bg-white/90 dark:bg-neutral-950/90 border border-neutral-200 dark:border-white/15 backdrop-blur-xl shadow-lg w-full max-w-xs sm:max-w-sm">
            {Array.from({ length: totalMobileCols }).map((_, colIdx) => {
              const startNum = colIdx * 6 + 1;
              const endNum = Math.min((colIdx + 1) * 6, allVariants.length);
              const isSelected = mobileColIdx === colIdx;
              return (
                <button
                  key={colIdx}
                  onClick={() => {
                    setMobileColIdx(colIdx);
                    setSelectedVariant(allVariants[colIdx * 6] || allVariants[0]);
                  }}
                  className={`flex-1 py-1.5 px-1.5 rounded-full text-xs font-mono font-semibold transition-all text-center ${
                    isSelected
                      ? "bg-amber-500 dark:bg-amber-400 text-white dark:text-black shadow-md font-bold"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                  }`}
                >
                  {startNum < 10 ? `0${startNum}` : startNum}–{endNum < 10 ? `0${endNum}` : endNum}
                </button>
              );
            })}
          </div>

          {/* DESKTOP: DUAL 3D ISOMETRIC CASCADING STANDS (2 Columns × 6 Cards) */}
          <div className="hidden md:flex items-center justify-center gap-6 sm:gap-8 xl:gap-12 w-full relative py-2">
            {/* ------------------------------------------------------------- */}
            {/* COLUMN 1: STAND A (6 Cards with Cascade Drop Animation) */}
            {/* ------------------------------------------------------------- */}
            <div className="flex flex-col items-center">
              <div className="relative w-[230px] sm:w-[280px] md:w-[305px] xl:w-[330px] h-[520px] sm:h-[560px] flex items-center justify-center">
                {col1Variants.map((variant, idx) => {
                  const isSelected = selectedVariant.id === variant.id;
                  const itemNumber = activeBatch * 12 + idx + 1;
                  const baseY = (idx - 2.65) * stepY;

                  // Slide out subtly to the LEFT by 24px and lift up by 14px
                  const xOffset = isSelected ? -24 : 0;
                  const yOffset = isSelected ? baseY - 14 : baseY;

                  // Strict natural stacking: Card idx+1 is ALWAYS on top of Card idx.
                  const cardZ = (idx + 1) * 10;

                  return (
                    <motion.div
                      key={`${activeBatch}-${variant.id}`}
                      initial={{
                        y: baseY - 60,
                        opacity: 0,
                        rotateX: 60,
                      }}
                      animate={{
                        x: xOffset,
                        y: yOffset,
                        rotateX: rotateX,
                        rotateZ: rotateZ,
                        opacity: 1,
                        scale: isSelected ? 1.02 : 1,
                      }}
                      whileHover={{
                        x: isSelected ? -24 : -12,
                      }}
                      transition={{
                        delay: idx * 0.05,
                        type: "spring",
                        stiffness: 260,
                        damping: 22,
                      }}
                      onClick={() => setSelectedVariant(variant)}
                      style={{
                        zIndex: cardZ,
                      }}
                      className={`absolute w-full h-[175px] sm:h-[195px] rounded-2xl cursor-pointer transition-shadow duration-300 border backdrop-blur-md overflow-hidden select-none ${
                        isSelected
                          ? "border-amber-500 dark:border-amber-400 shadow-[0_0_28px_rgba(245,158,11,0.55)] ring-2 ring-amber-500/80 dark:ring-amber-400/80"
                          : "border-neutral-200/80 dark:border-white/15 hover:border-neutral-400 dark:hover:border-white/35 shadow-xl shadow-neutral-400/20 dark:shadow-2xl dark:shadow-black/90 bg-white/95 dark:bg-neutral-950/85 opacity-95 hover:opacity-100"
                      }`}
                    >
                      {/* High-res wood / marble texture surface */}
                      <div className="relative w-full h-full">
                        <Image
                          src={variant.textureUrl}
                          alt={`${variant.name} (${variant.code}) 12-Inch Seamless PVC Wall Panel Gurgaon`}
                          fill
                          sizes="350px"
                          priority={idx < 2}
                          className={`object-cover object-center transition-all duration-300 ${
                            isSelected ? "brightness-105 contrast-105" : "brightness-85"
                          }`}
                        />

                        {/* Glass Overlay with Code, Dimensions & Variant Name */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/25 p-3 sm:p-3.5 flex flex-col justify-between">
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-1 rounded-md bg-black/85 backdrop-blur-md border border-white/20 text-xs font-mono font-black text-amber-300 shadow-md">
                              {variant.code}
                            </span>
                            <span className="text-[10px] font-mono text-white/90 px-2 py-0.5 rounded bg-black/70 border border-white/10">
                              2950×300 MM
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-xs sm:text-sm text-white font-semibold tracking-wide truncate max-w-[170px] drop-shadow-md">
                              {variant.name.replace("Primo Plain ", "").replace("Primo Fluted ", "")}
                            </span>
                            <div className="flex items-center gap-2">
                              {isSelected && (
                                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400 text-black font-mono font-bold text-[10px] shadow-md">
                                  <CheckCircle2 className="w-3 h-3 stroke-[3]" />
                                  <span>PULLED</span>
                                </div>
                              )}
                              <span className="text-xs font-mono font-bold text-white/50">
                                {itemNumber < 10 ? `0${itemNumber}` : itemNumber}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* COLUMN 2: STAND B (6 Cards with Cascade Drop Animation) */}
            {/* ------------------------------------------------------------- */}
            <div className="flex flex-col items-center">
              <div className="relative w-[230px] sm:w-[280px] md:w-[305px] xl:w-[330px] h-[520px] sm:h-[560px] flex items-center justify-center">
                {col2Variants.map((variant, idx) => {
                  const isSelected = selectedVariant.id === variant.id;
                  const itemNumber = activeBatch * 12 + 6 + idx + 1;
                  const baseY = (idx - 2.65) * stepY;

                  // Slide out subtly to the LEFT by 24px and lift up by 14px (matching Column 1)
                  const xOffset = isSelected ? -24 : 0;
                  const yOffset = isSelected ? baseY - 14 : baseY;

                  // Strict natural stacking: Card idx+1 is ALWAYS on top of Card idx.
                  const cardZ = (idx + 1) * 10;

                  return (
                    <motion.div
                      key={`${activeBatch}-${variant.id}`}
                      initial={{
                        y: baseY - 60,
                        opacity: 0,
                        rotateX: 60,
                      }}
                      animate={{
                        x: xOffset,
                        y: yOffset,
                        rotateX: rotateX,
                        rotateZ: rotateZ,
                        opacity: 1,
                        scale: isSelected ? 1.02 : 1,
                      }}
                      whileHover={{
                        x: isSelected ? -24 : -12,
                      }}
                      transition={{
                        delay: idx * 0.05,
                        type: "spring",
                        stiffness: 260,
                        damping: 22,
                      }}
                      onClick={() => setSelectedVariant(variant)}
                      style={{
                        zIndex: cardZ,
                      }}
                      className={`absolute w-full h-[175px] sm:h-[195px] rounded-2xl cursor-pointer transition-shadow duration-300 border backdrop-blur-md overflow-hidden select-none ${
                        isSelected
                          ? "border-amber-500 dark:border-amber-400 shadow-[0_0_28px_rgba(245,158,11,0.55)] ring-2 ring-amber-500/80 dark:ring-amber-400/80"
                          : "border-neutral-200/80 dark:border-white/15 hover:border-neutral-400 dark:hover:border-white/35 shadow-xl shadow-neutral-400/20 dark:shadow-2xl dark:shadow-black/90 bg-white/95 dark:bg-neutral-950/85 opacity-95 hover:opacity-100"
                      }`}
                    >
                      {/* High-res wood / marble texture surface */}
                      <div className="relative w-full h-full">
                        <Image
                          src={variant.textureUrl}
                          alt={`${variant.name} (${variant.code}) 12-Inch Seamless PVC Wall Panel Gurgaon`}
                          fill
                          sizes="350px"
                          priority={idx < 2}
                          className={`object-cover object-center transition-all duration-300 ${
                            isSelected ? "brightness-105 contrast-105" : "brightness-85"
                          }`}
                        />

                        {/* Glass Overlay with Code, Dimensions & Variant Name */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/25 p-3 sm:p-3.5 flex flex-col justify-between">
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-1 rounded-md bg-black/85 backdrop-blur-md border border-white/20 text-xs font-mono font-black text-amber-300 shadow-md">
                              {variant.code}
                            </span>
                            <span className="text-[10px] font-mono text-white/90 px-2 py-0.5 rounded bg-black/70 border border-white/10">
                              2950×300 MM
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-xs sm:text-sm text-white font-semibold tracking-wide truncate max-w-[170px] drop-shadow-md">
                              {variant.name.replace("Primo Plain ", "").replace("Primo Fluted ", "")}
                            </span>
                            <div className="flex items-center gap-2">
                              {isSelected && (
                                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400 text-black font-mono font-bold text-[10px] shadow-md">
                                  <CheckCircle2 className="w-3 h-3 stroke-[3]" />
                                  <span>PULLED</span>
                                </div>
                              )}
                              <span className="text-xs font-mono font-bold text-white/50">
                                {itemNumber < 10 ? `0${itemNumber}` : itemNumber}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* MOBILE ONLY: PRE-RENDERED 3D ISOMETRIC CASCADING STANDS (All 4 columns pre-loaded in background) */}
          <div className="flex md:hidden items-center justify-center w-full relative py-2 min-h-[510px] sm:min-h-[550px]">
            <div className="flex flex-col items-center relative w-[280px] sm:w-[320px] h-[500px] sm:h-[540px]">
              {Array.from({ length: totalMobileCols }).map((_, cIdx) => {
                const colItems = allVariants.slice(cIdx * 6, cIdx * 6 + 6);
                const isColActive = mobileColIdx === cIdx;

                return (
                  <div
                    key={`col-stack-${cIdx}`}
                    className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
                      isColActive
                        ? "opacity-100 pointer-events-auto z-10"
                        : "opacity-0 pointer-events-none z-0 invisible"
                    }`}
                  >
                    {colItems.map((variant, idx) => {
                      const isSelected = selectedVariant.id === variant.id;
                      const itemNumber = cIdx * 6 + idx + 1;
                      const baseY = (idx - 2.65) * (stepY * 0.9);

                      const xOffset = isSelected ? -20 : 0;
                      const yOffset = isSelected ? baseY - 12 : baseY;
                      const cardZ = (idx + 1) * 10;

                      return (
                        <motion.div
                          key={`mob-${cIdx}-${variant.id}`}
                          initial={false}
                          animate={{
                            x: xOffset,
                            y: yOffset,
                            rotateX: rotateX,
                            rotateZ: rotateZ,
                            scale: isSelected ? 1.02 : 1,
                          }}
                          whileHover={{
                            x: isSelected ? -20 : -10,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 22,
                          }}
                          onClick={() => setSelectedVariant(variant)}
                          style={{
                            zIndex: cardZ,
                          }}
                          className={`absolute w-full h-[165px] sm:h-[185px] rounded-2xl cursor-pointer transition-all duration-300 border backdrop-blur-md overflow-hidden select-none ${
                            isSelected
                              ? "border-amber-500 dark:border-amber-400 shadow-[0_0_28px_rgba(245,158,11,0.55)] ring-2 ring-amber-500/80 dark:ring-amber-400/80"
                              : "border-neutral-200/80 dark:border-white/15 hover:border-neutral-400 dark:hover:border-white/35 shadow-xl shadow-neutral-400/20 dark:shadow-2xl dark:shadow-black/90 bg-white/95 dark:bg-neutral-950/85 opacity-95 hover:opacity-100"
                          }`}
                        >
                          <div className="relative w-full h-full">
                            <Image
                              src={variant.textureUrl}
                              alt={`${variant.name} (${variant.code}) 12-Inch Seamless PVC Wall Panel Gurgaon`}
                              fill
                              sizes="320px"
                              priority={true}
                              loading="eager"
                              className={`object-cover object-center transition-all duration-300 ${
                                isSelected ? "brightness-105 contrast-105" : "brightness-95 dark:brightness-85"
                              }`}
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/25 p-3 flex flex-col justify-between">
                              <div className="flex items-center justify-between">
                                <span className="px-2 py-0.5 rounded-md bg-black/85 backdrop-blur-md border border-white/20 text-[11px] font-mono font-black text-amber-300 shadow-md">
                                  {variant.code}
                                </span>
                                <span className="text-[9px] font-mono text-white/90 px-1.5 py-0.5 rounded bg-black/70 border border-white/10">
                                  2950×300 MM
                                </span>
                              </div>

                              <div className="flex items-center justify-between">
                                <span className="text-xs text-white font-semibold tracking-wide truncate max-w-[150px] drop-shadow-md">
                                  {variant.name.replace("Primo Plain ", "").replace("Primo Fluted ", "")}
                                </span>
                                <div className="flex items-center gap-1.5">
                                  {isSelected && (
                                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-400 text-black font-mono font-bold text-[9px] shadow-md">
                                      <CheckCircle2 className="w-2.5 h-2.5 stroke-[3]" />
                                      <span>PULLED</span>
                                    </div>
                                  )}
                                  <span className="text-xs font-mono font-bold text-white/50">
                                    {itemNumber < 10 ? `0${itemNumber}` : itemNumber}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ============================================================= */}
        {/* RIGHT: OFFICIAL ARCHITECTURAL SPEC SHEET */}
        {/* ============================================================= */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          {/* Official Catalog Technical Spec Sheet Card */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white/90 dark:bg-neutral-950/90 border border-neutral-200 dark:border-white/15 backdrop-blur-2xl shadow-xl dark:shadow-2xl flex flex-col gap-5 relative overflow-hidden text-neutral-900 dark:text-white">
            {/* Top Spec Header with Active Plank Thumbnail and Crossed MRP + Discount */}
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-white/10">
              <div className="flex items-center gap-3.5">
                <div className="relative w-14 h-20 rounded-xl overflow-hidden border-2 border-amber-500/60 dark:border-amber-400/60 shadow-xl shrink-0 bg-neutral-100 dark:bg-black">
                  <Image
                    src={selectedVariant.textureUrl}
                    alt={`${selectedVariant.name} (${selectedVariant.code}) Architectural Spec Sheet - Goals Floors Gurgaon`}
                    fill
                    className="object-cover scale-110"
                  />
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-amber-700 dark:text-amber-400 font-semibold">
                    Architectural Series • {selectedVariant.type === "fluted" ? "Fluted Louver" : "Plain 12\" Profile"}
                  </div>
                  <AnimatePresence mode="popLayout">
                    <motion.h3
                      key={selectedVariant.code}
                      initial={{ y: -16, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 16, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="text-2xl sm:text-3xl font-mono font-black text-neutral-900 dark:text-white"
                    >
                      {selectedVariant.code}
                    </motion.h3>
                  </AnimatePresence>
                  <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                    100% Waterproof & Termite-Proof PVC
                  </div>
                </div>
              </div>

              {/* Crossed-out MRP + Discount Badge + Selling Price */}
              <div className="text-right flex flex-col items-end">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-xs sm:text-sm font-mono text-neutral-500 line-through">
                    {mrpPrice}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {discountBadge}
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-mono font-extrabold text-amber-600 dark:text-amber-300">
                    ₹{pricePerPanel}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400">
                    / panel
                  </span>
                </div>
                <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 mt-0.5">
                  ({sqFtRate})
                </span>
              </div>
            </div>

            {/* Catalog Specification Table with Slot-Machine Number/Word Roll */}
            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex items-center justify-between py-2 px-3.5 rounded-xl bg-neutral-100/70 dark:bg-white/[0.02] border border-neutral-200 dark:border-white/5">
                <span className="text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
                  <Maximize2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  Panel Length
                </span>
                <RollingSpecValue
                  value="2950 MM (116 Inch / ~9.7 Ft)"
                  variantKey={selectedVariant.id}
                  delay={0.02}
                />
              </div>

              <div className="flex items-center justify-between py-2 px-3.5 rounded-xl bg-neutral-100/70 dark:bg-white/[0.02] border border-neutral-200 dark:border-white/5">
                <span className="text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
                  <Maximize2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  Panel Width
                </span>
                <RollingSpecValue
                  value={isFluted ? "160 MM (6.3 Inch)" : "300 MM (12 Inch / 1.0 Ft)"}
                  variantKey={selectedVariant.id}
                  delay={0.05}
                />
              </div>

              <div className="flex items-center justify-between py-2 px-3.5 rounded-xl bg-neutral-100/70 dark:bg-white/[0.02] border border-neutral-200 dark:border-white/5">
                <span className="text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  Thickness
                </span>
                <RollingSpecValue
                  value={isFluted ? "12 MM Architectural Louver" : "5 MM Seamless Interlock"}
                  variantKey={selectedVariant.id}
                  delay={0.08}
                  highlight={true}
                />
              </div>

              <div className="flex items-center justify-between py-2 px-3.5 rounded-xl bg-neutral-100/70 dark:bg-white/[0.02] border border-neutral-200 dark:border-white/5">
                <span className="text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
                  <Box className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  Area Per Panel
                </span>
                <RollingSpecValue
                  value={isFluted ? "5.2 SQ.FT." : "9.5 SQ.FT."}
                  variantKey={selectedVariant.id}
                  delay={0.11}
                />
              </div>

              <div className="flex items-center justify-between py-2 px-3.5 rounded-xl bg-neutral-100/70 dark:bg-white/[0.02] border border-neutral-200 dark:border-white/5">
                <span className="text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  Weight
                </span>
                <RollingSpecValue
                  value={isFluted ? "3.2 ±5% Kg Per PC" : "2.8 ±5% Kg Per PC"}
                  variantKey={selectedVariant.id}
                  delay={0.14}
                />
              </div>

              <div className="flex items-center justify-between py-2 px-3.5 rounded-xl bg-neutral-100/70 dark:bg-white/[0.02] border border-neutral-200 dark:border-white/5">
                <span className="text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
                  <Package className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  Packing
                </span>
                <RollingSpecValue
                  value={isFluted ? "10 PCS Per Box (52 SQ.FT.)" : "10 PCS Per Box (95 SQ.FT.)"}
                  variantKey={selectedVariant.id}
                  delay={0.17}
                />
              </div>

              <div className="flex items-center justify-between py-2 px-3.5 rounded-xl bg-neutral-100/70 dark:bg-white/[0.02] border border-neutral-200 dark:border-white/5">
                <span className="text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  Packing Type
                </span>
                <RollingSpecValue
                  value="Heavy-Duty Export Carton"
                  variantKey={selectedVariant.id}
                  delay={0.20}
                />
              </div>
            </div>

            {/* Direct WhatsApp Quote & Inquiry CTA */}
            <a
              href={`https://wa.me/919999999999?text=${encodeURIComponent(
                `Hi Goals Floors! I am interested in ${panel.name} (${selectedVariant.code}). Please share wholesale price & catalog details.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-black font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-amber-400/20 transition-all active:scale-[0.98]"
            >
              <MessageCircle className="w-4 h-4 fill-black" />
              <span>Inquire Wholesale Rates for {selectedVariant.code}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
