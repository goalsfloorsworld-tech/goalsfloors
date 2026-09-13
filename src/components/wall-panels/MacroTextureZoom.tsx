"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Droplets,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Layers,
  Award,
  Maximize2,
} from "lucide-react";
import { WallPanelExperienceData } from "@/data/wall-panels-experience";

interface MacroTextureZoomProps {
  panel: WallPanelExperienceData;
}

export default function MacroTextureZoom({ panel }: MacroTextureZoomProps) {
  const [zoomLevel, setZoomLevel] = useState<"normal" | "macro">("macro");
  const [pointerPos, setPointerPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [activeAeoTab, setActiveAeoTab] = useState<"seelan" | "termites" | "maintenance">("seelan");

  // Track cursor position accurately within canvas (0 to 100%)
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPointerPos({
      x: Math.max(2, Math.min(98, x)),
      y: Math.max(2, Math.min(98, y)),
    });
  };

  // Smart Loupe Positioning:
  // When cursor is on the RIGHT side (>48%), smoothly glide circle to the LEFT side.
  // When cursor is on the LEFT side (<=48%), smoothly glide circle to the RIGHT side.
  // This ensures the loupe NEVER gets clipped by the border and NEVER obscures the inspected area!
  const isRightHalf = pointerPos.x > 48;
  const lensX = isRightHalf
    ? Math.max(20, Math.min(36, pointerPos.x - 38))
    : Math.min(80, Math.max(64, pointerPos.x + 38));
  const lensY = Math.max(22, Math.min(78, pointerPos.y));

  return (
    <section
      aria-label="Waterproof Surface Engineering & Macro Texture Inspection"
      className="relative w-full max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8"
    >
      {/* Section Header with Semantic SEO Keywords */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-950/60 border border-emerald-500/30 text-xs font-mono tracking-widest text-emerald-800 dark:text-emerald-300 uppercase mb-3 backdrop-blur-md">
          <Droplets className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          <span>Microscopic Surface Engineering • ASTM D570 Tested</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extralight tracking-tight text-neutral-900 dark:text-white mb-3">
          Tactile Perfection Under{" "}
          <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-neutral-900 to-amber-600 dark:from-emerald-200 dark:via-white dark:to-amber-200">
            5× Macro Magnification
          </span>
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Hover or touch across the high-resolution macro surface below. Inspect water-beading
          surface tension, zero-capillary dampness shield, and authentic synchronized wood grain.
        </p>
      </div>

      {/* Main Grid: Left 5x Macro Canvas | Right Verified SEO/AEO/GEO Technical Specs */}
      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ============================================================= */}
        {/* LEFT: INTERACTIVE MACRO CANVAS WITH SMART AUTO-FLIP LOUPE */}
        {/* ============================================================= */}
        <div
          onPointerMove={handlePointerMove}
          onPointerEnter={() => setIsHovered(true)}
          onPointerLeave={() => setIsHovered(false)}
          className="lg:col-span-7 relative h-[440px] sm:h-[520px] md:h-[580px] rounded-3xl overflow-hidden border border-neutral-200 dark:border-white/15 shadow-2xl shadow-neutral-900/10 dark:shadow-black/90 cursor-crosshair group bg-neutral-100 dark:bg-neutral-950 select-none"
        >
          {/* Base High-Resolution Texture Image */}
          <div className="relative w-full h-full overflow-hidden">
            <Image
              src={panel.textureImage}
              alt={`${panel.name} Waterproof PVC Wall Panel Macro Texture Gurgaon Delhi NCR`}
              fill
              sizes="(max-width: 1024px) 100vw, 850px"
              priority
              className={`object-cover object-center transition-transform duration-700 ${
                zoomLevel === "macro" ? "scale-110" : "scale-100"
              }`}
            />

            {/* Subtle Lighting Glint & Atmospheric Ambient Tint */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-black/45 via-transparent to-white/10" />

            {/* Precision Crosshair Target Marker at Actual Cursor Point */}
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  left: `${pointerPos.x}%`,
                  top: `${pointerPos.y}%`,
                }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 z-20"
              >
                <div className="w-6 h-6 rounded-full border-2 border-amber-400/90 flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.6)]">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                </div>
              </motion.div>
            )}

            {/* SMART MAGNIFYING LOUPE */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    left: `${lensX}%`,
                    top: `${lensY}%`,
                  }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{
                    left: { type: "spring", stiffness: 240, damping: 26 },
                    top: { type: "spring", stiffness: 240, damping: 26 },
                    opacity: { duration: 0.18 },
                    scale: { duration: 0.18 },
                  }}
                  style={{
                    transform: "translate(-50%, -50%)",
                  }}
                  className="absolute pointer-events-none w-48 h-48 sm:w-56 sm:h-56 rounded-full border-2 border-amber-400/90 shadow-[0_0_35px_rgba(245,158,11,0.5)] overflow-hidden z-30 bg-black/60 ring-4 ring-neutral-900/80 dark:ring-black/80"
                >
                  {/* Real Optical 5x Zoom View */}
                  <div
                    className="absolute inset-0 bg-no-repeat transition-all duration-75"
                    style={{
                      backgroundImage: `url(${panel.textureImage})`,
                      backgroundSize: "320% 320%",
                      backgroundPosition: `${pointerPos.x}% ${pointerPos.y}%`,
                    }}
                  />

                  {/* Optical Crosshair in Loupe Center */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-6 h-6 border-t border-l border-amber-300/80" />
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
                  </div>

                  {/* Micro Loupe Badge Readout */}
                  <div className="absolute bottom-2 inset-x-0 text-center pointer-events-none">
                    <span className="px-2.5 py-0.5 rounded-full bg-black/85 backdrop-blur-md text-[9px] font-mono text-amber-300 border border-amber-400/30 font-bold uppercase tracking-wider">
                      5× Macro Inspection
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Status Hotspot Badges */}
            <div className="absolute bottom-5 left-5 z-20 flex flex-wrap gap-2 pointer-events-none">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-cyan-500/30 text-xs text-white shadow-lg font-mono">
                <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                <span>Zero Water Absorption (0.0%)</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-amber-500/30 text-xs text-white shadow-lg font-mono">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Synchronized Wood Grain Relief</span>
              </div>
            </div>

            {/* Top Prompt Hint */}
            <div className="absolute top-4 right-4 z-20 pointer-events-none hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-[11px] font-mono text-neutral-300">
              <Maximize2 className="w-3 h-3 text-amber-400" />
              <span>Hover across surface to magnify</span>
            </div>
          </div>
        </div>

        {/* ============================================================= */}
        {/* RIGHT: AEO / GEO / SEO KNOWLEDGE & LABORATORY VERIFIED SPECS */}
        {/* ============================================================= */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Surface Technology Card with 1x / 5x View Toggle */}
          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-950/90 border border-neutral-200 dark:border-white/15 backdrop-blur-2xl shadow-xl dark:shadow-2xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>Surface Technology</span>
              </span>
              <div className="flex items-center gap-1 bg-neutral-100 dark:bg-white/5 p-1 rounded-xl border border-neutral-200 dark:border-white/10 font-mono">
                <button
                  onClick={() => setZoomLevel("normal")}
                  className={`px-3 py-1 text-xs rounded-lg transition-all ${
                    zoomLevel === "normal"
                      ? "bg-amber-400 text-neutral-950 font-bold shadow-sm"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  1×
                </button>
                <button
                  onClick={() => setZoomLevel("macro")}
                  className={`px-3 py-1 text-xs rounded-lg transition-all ${
                    zoomLevel === "macro"
                      ? "bg-amber-400 text-neutral-950 font-bold shadow-sm"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  5× Macro
                </button>
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
              Impermeable Closed-Cell Polymer Shield
            </h3>

            <p className="text-neutral-600 dark:text-neutral-300 text-xs sm:text-sm leading-relaxed">
              Unlike traditional MDF or porous wood which expands and rots with ambient humidity, our
              extruded high-density virgin polymer leaves zero micro-capillaries for water to penetrate.
              Water droplets remain spherical and bead off immediately.
            </p>
          </div>

          {/* 4-Item SEO Laboratory Verification Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3.5 rounded-2xl bg-white dark:bg-neutral-950/80 border border-cyan-500/20 shadow-sm dark:shadow-none flex flex-col justify-between">
              <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-wider">Absorption</span>
                <Droplets className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
              </div>
              <span className="text-2xl font-mono font-black text-cyan-600 dark:text-cyan-300">0.0%</span>
              <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 mt-0.5">ASTM D570 Tested</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-neutral-950/80 border border-amber-500/20 shadow-sm dark:shadow-none flex flex-col justify-between">
              <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-wider">Scratch Armor</span>
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              </div>
              <span className="text-2xl font-mono font-black text-amber-600 dark:text-amber-300">Class 1</span>
              <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 mt-0.5">Commercial Heavy Duty</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-neutral-950/80 border border-emerald-500/20 shadow-sm dark:shadow-none flex flex-col justify-between">
              <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-wider">Termite Immune</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
              </div>
              <span className="text-2xl font-mono font-black text-emerald-600 dark:text-emerald-300">100%</span>
              <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 mt-0.5">Zero Organic Wood</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-neutral-950/80 border border-purple-500/20 shadow-sm dark:shadow-none flex flex-col justify-between">
              <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-wider">Safety & VOC</span>
                <Award className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
              </div>
              <span className="text-2xl font-mono font-black text-purple-600 dark:text-purple-300">Class B1</span>
              <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 mt-0.5">Self-Extinguishing</span>
            </div>
          </div>

          {/* Natural Human-Centric Material Protection Benefits */}
          <div className="p-5 rounded-3xl bg-white dark:bg-neutral-950/90 border border-neutral-200 dark:border-white/10 backdrop-blur-xl shadow-xl dark:shadow-2xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-700 dark:text-neutral-300 uppercase tracking-wider font-semibold">
                <ShieldCheck className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                <span>Key Material Advantages</span>
              </div>
              <span className="text-[10px] font-mono text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-white/5 px-2.5 py-0.5 rounded-full border border-neutral-200 dark:border-white/10">
                100% Tested
              </span>
            </div>

            {/* Clean Tab Switcher */}
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-[11px] font-mono">
              <button
                onClick={() => setActiveAeoTab("seelan")}
                className={`py-1.5 px-2 rounded-lg transition-all text-center ${
                  activeAeoTab === "seelan"
                    ? "bg-amber-400 text-neutral-950 font-bold shadow-sm"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                100% Seelan Proof
              </button>
              <button
                onClick={() => setActiveAeoTab("termites")}
                className={`py-1.5 px-2 rounded-lg transition-all text-center ${
                  activeAeoTab === "termites"
                    ? "bg-amber-400 text-neutral-950 font-bold shadow-sm"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                Termite Proof
              </button>
              <button
                onClick={() => setActiveAeoTab("maintenance")}
                className={`py-1.5 px-2 rounded-lg transition-all text-center ${
                  activeAeoTab === "maintenance"
                    ? "bg-amber-400 text-neutral-950 font-bold shadow-sm"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                Zero Polish
              </button>
            </div>

            {/* Direct Natural Human Answers */}
            <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200 dark:border-white/5 text-xs">
              {activeAeoTab === "seelan" && (
                <div className="space-y-1.5">
                  <div className="font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400 shrink-0" />
                    <span>Why do these panels permanently stop wall dampness (seelan)?</span>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-[11px]">
                    Unlike porous MDF or cheap WPC that absorbs moisture from walls and swells up,
                    our closed-cell virgin polymer has 0.0% water absorption. It creates an impermeable
                    physical barrier that keeps your room walls looking flawless even during heavy rains.
                  </p>
                </div>
              )}

              {activeAeoTab === "termites" && (
                <div className="space-y-1.5">
                  <div className="font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                    <span>Are these panels completely safe from termites and insects?</span>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-[11px]">
                    Yes, 100%. Termites feed on natural wood fibers and cardboard fillers. Because our
                    panels are extruded from 100% virgin polymer with zero organic wood content,
                    termites and wood borers cannot damage or infest them.
                  </p>
                </div>
              )}

              {activeAeoTab === "maintenance" && (
                <div className="space-y-1.5">
                  <div className="font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
                    <span>Does it require painting, polishing, or special care?</span>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-[11px]">
                    Zero polish or painting required. The synchronized wood-grain texture is permanently
                    fused during extrusion. It will not fade, peel, or stain from coffee/tea spills — simply
                    wipe clean with a damp microfiber cloth.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
