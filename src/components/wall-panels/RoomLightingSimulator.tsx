"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { SunMedium, Lightbulb, Moon, Info, Sparkles, Check } from "lucide-react";
import { WallPanelExperienceData } from "@/data/wall-panels-experience";

interface RoomLightingSimulatorProps {
  panel: WallPanelExperienceData;
}

interface Hotspot {
  id: string;
  x: number; // percentage
  y: number; // percentage
  title: string;
  desc: string;
}

const ROOM_HOTSPOTS: Record<string, Hotspot[]> = {
  primo: [
    {
      id: "led-cove",
      x: 38,
      y: 12,
      title: "Concealed LED Cove Channel",
      desc: "Panels leave a recessed 15mm gap at top/bottom for flush ambient LED strip integration without visible diffusers.",
    },
    {
      id: "seamless-join",
      x: 26,
      y: 46,
      title: "Zero-Gap Tongue & Groove",
      desc: "Precision micro-beveled interlocking produces an unbroken architectural monolithic surface across 20+ feet walls.",
    },
    {
      id: "acoustic-tv",
      x: 42,
      y: 55,
      title: "Vibration Dampening TV Mount",
      desc: "High structural core density eliminates hollow buzzes and rattling from heavy subwoofer bass notes.",
    },
  ],
  "primo-fluted": [
    {
      id: "slat-shadow",
      x: 35,
      y: 24,
      title: "17mm Fluted Shadow Blades",
      desc: "Deep architectural flute depth creates dynamic contrast and vertical shadow play under downlights and linear cove lighting.",
    },
    {
      id: "interlock-seam",
      x: 55,
      y: 46,
      title: "Concealed Slat Interlock",
      desc: "Tongue-and-groove seam is concealed within the flute recess, producing an unbroken monolithic wall across any length.",
    },
    {
      id: "anti-warp-core",
      x: 74,
      y: 66,
      title: "Closed-Cell Waterproof Ribs",
      desc: "100% impervious to monsoon seelan and humidity, eliminating warping, bowing, or expansion gaps over 9.5ft drops.",
    },
  ],
  elite: [
    {
      id: "felt-gap",
      x: 48,
      y: 35,
      title: "9mm Recycled Acoustic Felt",
      desc: "Traps high and mid audio frequencies, eliminating echo in home cinemas and conference rooms.",
    },
    {
      id: "carbon-slat",
      x: 72,
      y: 28,
      title: "Stealth Carbon Bevel",
      desc: "Matte noir finish with brushed gold edge reveals prevents reflections on high-end OLED screens.",
    },
    {
      id: "cable-duct",
      x: 60,
      y: 72,
      title: "Integrated Wire Channel",
      desc: "Audio and power cabling runs hidden behind acoustic felt gaps for clean minimalism.",
    },
  ],
};

export default function RoomLightingSimulator({
  panel,
}: RoomLightingSimulatorProps) {
  const [activeModeIndex, setActiveModeIndex] = useState(0);
  const [brightness, setBrightness] = useState(85);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);

  const currentMode = panel.roomLightingModes[activeModeIndex] || panel.roomLightingModes[0];
  const hotspots = ROOM_HOTSPOTS[panel.slug] || ROOM_HOTSPOTS.primo;

  return (
    <div className="relative w-full max-w-6xl mx-auto py-16 px-4 sm:px-6">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-mono tracking-widest text-amber-700 dark:text-amber-300 uppercase mb-3">
          <SunMedium className="w-3.5 h-3.5" />
          <span>Real-World Space Experience</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extralight tracking-tight text-neutral-900 dark:text-white mb-4">
          See It in a <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-neutral-900 to-amber-500 dark:from-amber-200 dark:via-white dark:to-amber-300">Luxury Penthouse</span>
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto">
          Experience how {panel.name} interact with ambient architectural lighting. Switch color temperatures below to preview morning daylight, warm evening cove light, and cinematic night ambiance.
        </p>
      </div>

      {/* Main Interactive Room Canvas */}
      <div className="relative rounded-3xl overflow-hidden border border-neutral-200 dark:border-white/15 shadow-2xl shadow-neutral-900/10 dark:shadow-black/90 bg-neutral-100 dark:bg-neutral-950">
        {/* Room Photo with dynamic lighting overlay */}
        <div className="relative w-full h-[460px] sm:h-[580px] md:h-[680px]">
          <Image
            src={panel.roomImage}
            alt={`${panel.name} in Luxury Gurgaon Penthouse Living Room Interior - Goals Floors`}
            fill
            sizes="(max-width: 1200px) 100vw, 1200px"
            priority
            className="object-cover object-center transition-all duration-700"
            style={{
              filter: `brightness(${0.75 + (brightness / 100) * 0.4}) contrast(1.05)`,
            }}
          />

          {/* Dynamic LED Cove Glow Layer (Simulated Light Cast on Fluted Wall) */}
          <motion.div
            animate={{
              opacity: (brightness / 100) * 0.65,
              backgroundColor: currentMode.ambientColor,
            }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 pointer-events-none mix-blend-color-dodge"
            style={{
              maskImage: "radial-gradient(ellipse at top right, black 20%, transparent 80%)",
              WebkitMaskImage: "radial-gradient(ellipse at top right, black 20%, transparent 80%)",
            }}
          />

          {/* Secondary Cove Strip Lighting Blade */}
          <motion.div
            animate={{
              opacity: (brightness / 100) * 0.5,
              boxShadow: `inset 0 40px 100px 10px ${currentMode.ambientColor}`,
            }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 pointer-events-none"
          />

          {/* Interactive Hotspot Pins */}
          {hotspots.map((spot) => (
            <div
              key={spot.id}
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
            >
              <button
                onClick={() =>
                  setActiveHotspot(activeHotspot?.id === spot.id ? null : spot)
                }
                className="relative group p-2 focus:outline-none"
              >
                <span className="absolute inset-0 rounded-full bg-amber-400/30 animate-ping" />
                <span className="relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/80 border border-amber-400/80 text-amber-300 shadow-xl backdrop-blur-md transition-transform group-hover:scale-110">
                  <Info className="w-3.5 h-3.5" />
                </span>
              </button>
            </div>
          ))}

          {/* Hotspot Popover Modal */}
          <AnimatePresence>
            {activeHotspot && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                style={{
                  left: `${Math.min(75, Math.max(25, activeHotspot.x))}%`,
                  top: `${Math.min(75, Math.max(30, activeHotspot.y + 12))}%`,
                }}
                className="absolute z-30 -translate-x-1/2 w-72 sm:w-80 p-4 rounded-2xl bg-white/95 dark:bg-neutral-900/95 border border-neutral-200 dark:border-white/20 shadow-2xl backdrop-blur-xl text-neutral-900 dark:text-white"
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-100 dark:border-white/10">
                  <span className="text-xs font-mono text-amber-600 dark:text-amber-400 flex items-center gap-1 font-semibold">
                    <Sparkles className="w-3 h-3" />
                    Architectural Detail
                  </span>
                  <button
                    onClick={() => setActiveHotspot(null)}
                    className="text-neutral-400 hover:text-neutral-900 dark:text-white/40 dark:hover:text-white text-xs px-1"
                  >
                    ✕
                  </button>
                </div>
                <h4 className="font-semibold text-sm mb-1">{activeHotspot.title}</h4>
                <p className="text-neutral-600 dark:text-neutral-300 text-xs leading-relaxed">
                  {activeHotspot.desc}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Floating Lighting Control Center */}
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 w-[92%] max-w-2xl p-3 sm:p-4 rounded-2xl bg-white/90 dark:bg-neutral-950/85 backdrop-blur-xl border border-neutral-200 dark:border-white/15 shadow-2xl flex flex-col gap-3">
            {/* Top row: Lighting Mode Buttons */}
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {panel.roomLightingModes.map((mode, idx) => {
                const isActive = activeModeIndex === idx;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setActiveModeIndex(idx)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                      isActive
                        ? "bg-amber-100/80 dark:bg-white/15 border border-amber-500 dark:border-amber-400/60 text-neutral-900 dark:text-white shadow-md"
                        : "bg-neutral-100/70 dark:bg-white/[0.03] border border-neutral-200 dark:border-white/5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/60 dark:hover:bg-white/10"
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-neutral-300 dark:border-white/40 shrink-0"
                      style={{ backgroundColor: mode.ambientColor }}
                    />
                    <span>{mode.name}</span>
                    {isActive && <Check className="w-3 h-3 text-amber-600 dark:text-amber-400" />}
                  </button>
                );
              })}
            </div>

            {/* Bottom row: Brightness Slider & Description */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-neutral-200 dark:border-white/10 text-xs text-neutral-700 dark:text-neutral-300">
              <p className="text-[11px] sm:text-xs text-neutral-600 dark:text-neutral-400 truncate max-w-xs sm:max-w-md">
                {currentMode.description}
              </p>

              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                <Moon className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-24 sm:w-28 h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500 dark:accent-amber-400"
                />
                <SunMedium className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span className="font-mono text-[10px] text-neutral-600 dark:text-white/60 w-7 text-right">
                  {brightness}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
