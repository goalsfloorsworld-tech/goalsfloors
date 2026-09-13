"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  ShieldCheck,
  ChevronDown,
  Layers,
  HelpCircle,
  FileText,
  Clock,
  CheckCircle,
} from "lucide-react";
import { WallPanelExperienceData } from "@/data/wall-panels-experience";
import Panel3DViewer from "./Panel3DViewer";
import PanelSpecsRack from "./PanelSpecsRack";
import MacroTextureZoom from "./MacroTextureZoom";
import RoomLightingSimulator from "./RoomLightingSimulator";
import SerpentineHallmarksPath from "./SerpentineHallmarksPath";

interface WallPanelScrollytellingProps {
  panel: WallPanelExperienceData;
}

export default function WallPanelScrollytelling({
  panel,
}: WallPanelScrollytellingProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <main className="relative min-h-screen bg-neutral-50 dark:bg-black text-neutral-900 dark:text-white selection:bg-amber-400 selection:text-black overflow-x-clip font-sans transition-colors duration-300">
      {/* Background Subtle Gradient Atmosphere */}
      <div
        className="fixed inset-0 pointer-events-none opacity-20 dark:opacity-30 z-0"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% -20%, ${panel.themeColor}, transparent)`,
        }}
      />

      {/* ========================================================================= */}
      {/* SCENE 1: HERO MONOLITH & 3D INTERACTIVE VIEWER */}
      {/* ========================================================================= */}
      <section className="relative z-10 pt-2 sm:pt-4 pb-8 sm:pb-14 px-2 sm:px-4 xl:px-6 w-full max-w-[1800px] mx-auto flex flex-col items-center text-center">
        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight uppercase max-w-5xl leading-none"
        >
          <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 dark:from-amber-200 dark:via-amber-400 dark:to-amber-100">
            {panel.name.split(" ")[0]}
          </span>{" "}
          <span className="text-neutral-900 dark:text-white font-extralight italic">
            {panel.slug === "primo" ? '12" Seamless Wall Panels' : 'Architectural Wall Panels'}
          </span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-base sm:text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl mt-3 font-light leading-relaxed"
        >
          {panel.tagline}
        </motion.p>

        {/* Interactive 3D Rotating Monolith Panel */}
        <div className="w-full mt-3 sm:mt-6">
          <Panel3DViewer panel={panel} />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SCENE 2: THE 5 HALLMARKS - SERPENTINE ARCHITECTURAL JOURNEY */}
      {/* ========================================================================= */}
      <section className="relative z-10 border-t border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-black overflow-hidden w-full transition-colors duration-300">
        <SerpentineHallmarksPath panel={panel} />
      </section>

      {/* ========================================================================= */}
      {/* SCENE 3: SHOWROOM SAMPLE RACK & TECHNICAL SPEC SHEET */}
      {/* ========================================================================= */}
      <section className="relative z-10 border-t border-neutral-200 dark:border-white/10 bg-gradient-to-b from-neutral-50 via-white to-neutral-50 dark:from-black dark:via-neutral-950 dark:to-black transition-colors duration-300">
        <PanelSpecsRack panel={panel} />
      </section>

      {/* ========================================================================= */}
      {/* SCENE 4: 5X MACRO TEXTURE & WATER-RESISTANCE ZOOM */}
      {/* ========================================================================= */}
      <section className="relative z-10 border-t border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-black transition-colors duration-300">
        <MacroTextureZoom panel={panel} />
      </section>

      {/* ========================================================================= */}
      {/* SCENE 5: REAL-WORLD ROOM & LIGHTING SIMULATOR */}
      {/* ========================================================================= */}
      <section className="relative z-10 border-t border-neutral-200 dark:border-white/10 bg-gradient-to-b from-neutral-50 via-white to-neutral-50 dark:from-black dark:via-neutral-950 dark:to-black transition-colors duration-300">
        <RoomLightingSimulator panel={panel} />
      </section>

      {/* ========================================================================= */}
      {/* SCENE 6: ARCHITECTURAL SPECIFICATION TABLE */}
      {/* ========================================================================= */}
      <section className="relative z-10 border-t border-neutral-200 dark:border-white/10 py-16 px-4 sm:px-6 max-w-5xl mx-auto transition-colors duration-300">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-1 font-semibold">
              <FileText className="w-3.5 h-3.5" />
              Technical Blueprints
            </div>
            <h2 className="text-2xl sm:text-3xl font-light text-neutral-900 dark:text-white">
              Engineering & Performance Matrix
            </h2>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-mono">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>ISO 9001 Certified Quality</span>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 dark:border-white/10 overflow-hidden bg-white dark:bg-neutral-950 shadow-xl dark:shadow-2xl">
          <table className="w-full text-left text-sm">
            <tbody className="divide-y divide-neutral-200 dark:divide-white/10">
              {panel.specs.map((spec, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-neutral-50 dark:hover:bg-white/[0.02] transition-colors flex flex-col sm:table-row p-3 sm:p-0"
                >
                  <td className="sm:py-4 sm:px-6 font-mono text-xs text-neutral-500 dark:text-neutral-400 sm:w-1/3">
                    {spec.label}
                  </td>
                  <td className="sm:py-4 sm:px-6 font-semibold text-neutral-900 dark:text-white sm:w-1/3">
                    {spec.value}
                  </td>
                  <td className="sm:py-4 sm:px-6 text-xs text-neutral-500 dark:text-neutral-400 sm:w-1/3">
                    {spec.detail}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SCENE 7: FREQUENTLY ASKED QUESTIONS */}
      {/* ========================================================================= */}
      <section className="relative z-10 border-t border-neutral-200 dark:border-white/10 py-16 px-4 sm:px-6 max-w-4xl mx-auto transition-colors duration-300">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-2 font-semibold">
            <HelpCircle className="w-3.5 h-3.5" />
            Clear Answers
          </div>
          <h2 className="text-2xl sm:text-3xl font-light text-neutral-900 dark:text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {panel.faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/60 overflow-hidden transition-colors shadow-sm dark:shadow-none"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 hover:text-amber-600 dark:hover:text-amber-300 transition-colors"
                >
                  <span className="font-medium text-sm sm:text-base text-neutral-900 dark:text-white">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-amber-500 dark:text-amber-400" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed border-t border-neutral-100 dark:border-white/5 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
