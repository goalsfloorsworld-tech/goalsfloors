"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform, animate } from "framer-motion";
import { Rotate3d, Sparkles, Check, Layers, Columns, LayoutGrid, ChevronUp, ChevronDown } from "lucide-react";
import { WallPanelExperienceData, CatalogVariant } from "@/data/wall-panels-experience";

interface Panel3DViewerProps {
  panel: WallPanelExperienceData;
}

export default function Panel3DViewer({ panel }: Panel3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftListRef = useRef<HTMLDivElement>(null);
  const rightListRef = useRef<HTMLDivElement>(null);

  // Cursor-proximity auto-scrolling for side shade rails
  const autoScrollTimer = useRef<NodeJS.Timeout | null>(null);

  const startHoverScroll = (
    ref: React.RefObject<HTMLDivElement | null>,
    speed: number
  ) => {
    stopHoverScroll();
    autoScrollTimer.current = setInterval(() => {
      if (ref.current) {
        ref.current.scrollTop += speed;
      }
    }, 16);
  };

  const stopHoverScroll = () => {
    if (autoScrollTimer.current) {
      clearInterval(autoScrollTimer.current);
      autoScrollTimer.current = null;
    }
  };

  const handleRailMouseMove = (
    e: React.MouseEvent<HTMLDivElement>,
    ref: React.RefObject<HTMLDivElement | null>
  ) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    const totalHeight = rect.height;

    // Bottom 30% zone -> auto scroll down
    if (relativeY > totalHeight - 110) {
      const dist = relativeY - (totalHeight - 110);
      const speed = Math.min(Math.max(dist / 10, 2.5), 9);
      startHoverScroll(ref, speed);
    }
    // Top 30% zone -> auto scroll up
    else if (relativeY < 110) {
      const dist = 110 - relativeY;
      const speed = Math.min(Math.max(dist / 10, 2.5), 9);
      startHoverScroll(ref, -speed);
    } else {
      stopHoverScroll();
    }
  };

  // Helper for click-button scrolling
  const scrollList = (listRef: React.RefObject<HTMLDivElement | null>, direction: "up" | "down") => {
    stopHoverScroll();
    if (listRef.current) {
      const scrollAmount = direction === "down" ? 180 : -180;
      listRef.current.scrollBy({ top: scrollAmount, behavior: "smooth" });
    }
  };

  // All catalog variants (24 for plain Primo, 13 for fluted Primo, etc.)
  const variants: CatalogVariant[] =
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

  // Split variants half and half for Left and Right sidebars
  const halfCount = Math.ceil(variants.length / 2);
  const leftVariants = variants.slice(0, halfCount);
  const rightVariants = variants.slice(halfCount);

  // Multi-panel compare state: by default 1 panel, max 4
  const [panelCount, setPanelCount] = useState<number>(1);
  const [activeSlot, setActiveSlot] = useState<number>(0);

  // Each slot holds a selected variant: slot 0, slot 1, slot 2, slot 3
  const [slotVariants, setSlotVariants] = useState<CatalogVariant[]>([
    variants[0],
    variants[1] || variants[0],
    variants[2] || variants[0],
    variants[3] || variants[0],
  ]);

  // Displayed variants during spin
  const [displayedSlotVariants, setDisplayedSlotVariants] = useState<CatalogVariant[]>([
    variants[0],
    variants[1] || variants[0],
    variants[2] || variants[0],
    variants[3] || variants[0],
  ]);

  // Track which slot is currently spinning 720°
  const [spinningSlot, setSpinningSlot] = useState<number | null>(null);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);

  // Preload all textures in browser memory on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    variants.forEach((v) => {
      const img = new window.Image();
      img.src = v.textureUrl;
    });
  }, [variants]);

  // Reset when slug changes
  useEffect(() => {
    setSlotVariants([
      variants[0],
      variants[1] || variants[0],
      variants[2] || variants[0],
      variants[3] || variants[0],
    ]);
    setDisplayedSlotVariants([
      variants[0],
      variants[1] || variants[0],
      variants[2] || variants[0],
      variants[3] || variants[0],
    ]);
    setActiveSlot(0);
    setPanelCount(1);
  }, [panel.slug]);

  // Motion values for interactive 3D mouse tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springRotateX = useSpring(mouseY, { stiffness: 120, damping: 20 });
  const springRotateY = useSpring(mouseX, { stiffness: 120, damping: 20 });

  // Separate spin rotations for each slot
  const spinSlot0 = useMotionValue(0);
  const spinSlot1 = useMotionValue(0);
  const spinSlot2 = useMotionValue(0);
  const spinSlot3 = useMotionValue(0);

  const spinMotions = [spinSlot0, spinSlot1, spinSlot2, spinSlot3];

  // Combined rotation for each slot
  const rotateY0 = useTransform([springRotateY, spinSlot0], ([baseY, spin]: number[]) => baseY + spin);
  const rotateY1 = useTransform([springRotateY, spinSlot1], ([baseY, spin]: number[]) => baseY + spin);
  const rotateY2 = useTransform([springRotateY, spinSlot2], ([baseY, spin]: number[]) => baseY + spin);
  const rotateY3 = useTransform([springRotateY, spinSlot3], ([baseY, spin]: number[]) => baseY + spin);

  const rotateYList = [rotateY0, rotateY1, rotateY2, rotateY3];

  // Auto rotation sway when idle
  useEffect(() => {
    if (!isAutoRotating || spinningSlot !== null) return;

    let angle = 0;
    let animationFrameId: number;

    const animateSway = () => {
      angle += 0.015;
      const calculatedY = Math.sin(angle) * 12;
      const calculatedX = Math.cos(angle * 0.7) * 4;
      mouseX.set(calculatedY);
      mouseY.set(calculatedX);
      animationFrameId = requestAnimationFrame(animateSway);
    };

    animationFrameId = requestAnimationFrame(animateSway);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isAutoRotating, spinningSlot, mouseX, mouseY]);

  // Active dragging state for rotating the 3D panel with left or right click
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ clientX: 0, clientY: 0, startRotateX: 0, startRotateY: 0 });

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (spinningSlot !== null) return;
    setIsAutoRotating(false);
    isDraggingRef.current = true;
    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      startRotateX: mouseY.get(),
      startRotateY: mouseX.get(),
    };
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // safe fallback
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // safe fallback
    }
  };

  // Handle pointer drag or tilt
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (spinningSlot !== null || !containerRef.current) return;

    if (isDraggingRef.current) {
      // Direct drag rotation (works smoothly with left-click, right-click, or touch drag)
      const deltaX = e.clientX - dragStartRef.current.clientX;
      const deltaY = e.clientY - dragStartRef.current.clientY;

      const newY = dragStartRef.current.startRotateY + (deltaX * 0.4);
      const newX = dragStartRef.current.startRotateX - (deltaY * 0.35);

      mouseY.set(Math.max(-32, Math.min(32, newX)));
      mouseX.set(newY);
    } else {
      // Gentle hover parallax when mouse hovers over stage without dragging
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const degX = (-y / (rect.height / 2)) * 14;
      const degY = (x / (rect.width / 2)) * 22;

      setIsAutoRotating(false);
      mouseX.set(degY);
      mouseY.set(degX);
    }
  };

  const handlePointerLeave = () => {
    if (spinningSlot !== null || isDraggingRef.current) return;
    setIsAutoRotating(true);
  };

  // Select a variant shade from left or right rail into active slot
  const handleSelectVariant = (variant: CatalogVariant) => {
    if (spinningSlot !== null) return;

    // Immediately cache target image in memory
    if (typeof window !== "undefined") {
      const preloader = new window.Image();
      preloader.src = variant.textureUrl;
    }

    const slotIndex = activeSlot;
    const targetMotion = spinMotions[slotIndex];

    // Update target slot variant
    const newSlotVariants = [...slotVariants];
    newSlotVariants[slotIndex] = variant;
    setSlotVariants(newSlotVariants);

    // Jump springs to 0 immediately to eliminate oscillation fighting the spin
    springRotateX.jump(0);
    springRotateY.jump(0);
    mouseX.set(0);
    mouseY.set(0);

    const currentSpin = targetMotion.get();
    const targetSpin = currentSpin + 720; // 2 full revolutions

    let hasSwapped = false;

    const controls = animate(targetMotion, targetSpin, {
      duration: 1.05,
      ease: [0.25, 0.1, 0.25, 1], // Ultra-fluid cubic bezier
      onUpdate: (latest) => {
        // Swap texture at 180° when back is facing user
        if (!hasSwapped && latest >= currentSpin + 180) {
          hasSwapped = true;
          setDisplayedSlotVariants((prev) => {
            const next = [...prev];
            next[slotIndex] = variant;
            return next;
          });
        }
      },
      onComplete: () => {
        setSpinningSlot(null);
        setIsAutoRotating(true);
      },
    });

    return () => controls.stop();
  };

  // Manual 720° spin on active slot
  const triggerActiveSpin = () => {
    if (spinningSlot !== null) return;
    const slotIndex = activeSlot;
    const targetMotion = spinMotions[slotIndex];

    setSpinningSlot(slotIndex);
    setIsAutoRotating(false);
    springRotateX.jump(0);
    springRotateY.jump(0);
    mouseX.set(0);
    mouseY.set(0);

    const currentSpin = targetMotion.get();
    const targetSpin = currentSpin + 720;

    const controls = animate(targetMotion, targetSpin, {
      duration: 1.05,
      ease: [0.25, 0.1, 0.25, 1],
      onComplete: () => {
        setSpinningSlot(null);
        setIsAutoRotating(true);
      },
    });

    return () => controls.stop();
  };

  // Track mobile viewport to clamp compare options & dimensions
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
      if (mobile && panelCount > 2) {
        setPanelCount(2);
        if (activeSlot >= 2) setActiveSlot(0);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [panelCount, activeSlot]);

  // Compute responsive plank width/height based on number of panels compared
  const getPlankDimensions = (count: number) => {
    if (isMobile) {
      if (count === 1) return { w: 190, h: 340, depth: 12 };
      return { w: 130, h: 310, depth: 10 };
    }
    switch (count) {
      case 1:
        return { w: 300, h: 520, depth: 18 };
      case 2:
        return { w: 240, h: 480, depth: 16 };
      case 3:
        return { w: 200, h: 450, depth: 14 };
      case 4:
        return { w: 175, h: 430, depth: 12 };
      default:
        return { w: 300, h: 520, depth: 18 };
    }
  };

  const dims = getPlankDimensions(panelCount);
  const wHalf = dims.w / 2;
  const hHalf = dims.h / 2;
  const dHalf = dims.depth / 2;
  const cornerR = 12; // Matches rounded-xl radius (12px)
  const cornerChord = 4.8; // Chord length for 4-segment 22.5° subdivisions (2 * 12 * sin(11.25°) = 4.68px + 0.12px micro-overlap)
  const cornerSpecs = [
    // Top-Left corner (curves smoothly from left wall to top cap)
    { cx: cornerR, cy: cornerR, angles: [191.25, 213.75, 236.25, 258.75], bg: "#231d17" },
    // Top-Right corner (curves smoothly from top cap to right wall)
    { cx: dims.w - cornerR, cy: cornerR, angles: [281.25, 303.75, 326.25, 348.75], bg: "#2f271f" },
    // Bottom-Right corner (curves smoothly from right wall to bottom cap)
    { cx: dims.w - cornerR, cy: dims.h - cornerR, angles: [11.25, 33.75, 56.25, 78.75], bg: "#19140f" },
    // Bottom-Left corner (curves smoothly from bottom cap to left wall)
    { cx: cornerR, cy: dims.h - cornerR, angles: [101.25, 123.75, 146.25, 168.75], bg: "#16110c" },
  ];

  return (
    <div className="relative w-full max-w-full mx-auto flex flex-col items-center select-none py-1 px-1 sm:px-2 lg:px-4">
      {/* Ultra-Luxury Floating Compare Capsule */}
      <div className="mt-2 sm:mt-0 mb-4 sm:mb-3 z-30 flex items-center justify-center">
        <div className="inline-flex items-center gap-1.5 p-1.5 rounded-full bg-white/90 dark:bg-neutral-950/90 border border-neutral-200 dark:border-white/15 backdrop-blur-2xl shadow-xl dark:shadow-[0_8px_32px_rgba(0,0,0,0.8)] ring-1 ring-black/5 dark:ring-white/10">
          <div className="flex items-center gap-2 pl-3.5 pr-2.5 py-1 text-xs text-neutral-700 dark:text-neutral-300 select-none border-r border-neutral-200 dark:border-white/10">
            <Columns className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-800 dark:text-neutral-200 font-semibold hidden sm:inline">
              Compare Mode
            </span>
          </div>

          {/* Segmented Options: 1, 2 on phone; 1, 2, 3, 4 on desktop */}
          <div className="flex items-center gap-1 relative">
            {[
              { count: 1, label: "1 Panel", bars: 1, hideOnMobile: false },
              { count: 2, label: "2 Panels", bars: 2, hideOnMobile: false },
              { count: 3, label: "3 Panels", bars: 3, hideOnMobile: true },
              { count: 4, label: "4 Panels", bars: 4, hideOnMobile: true },
            ].map((opt) => {
              const isSelected = panelCount === opt.count;
              return (
                <button
                  key={opt.count}
                  onClick={() => {
                    setPanelCount(opt.count);
                    if (activeSlot >= opt.count) setActiveSlot(0);
                  }}
                  className={`relative px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-colors items-center gap-1.5 select-none ${
                    opt.hideOnMobile ? "hidden sm:inline-flex" : "inline-flex"
                  } ${
                    isSelected
                      ? "text-black font-bold z-10"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  {/* Sliding animated background for active tab */}
                  {isSelected && (
                    <motion.div
                      layoutId="activeCompareTab"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 shadow-[0_0_16px_rgba(245,158,11,0.5)] z-[-1]"
                    />
                  )}

                  {/* Graphical mini layout bars */}
                  <span className="flex items-center gap-0.5 shrink-0 opacity-80">
                    {Array.from({ length: opt.bars }).map((_, i) => (
                      <span
                        key={i}
                        className={`w-1 h-2.5 rounded-full ${
                          isSelected ? "bg-black/75" : "bg-neutral-400 dark:bg-neutral-500"
                        }`}
                      />
                    ))}
                  </span>

                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MAIN VIEWPORT: LEFT SHADES (12) | CENTER 3D STAGE | RIGHT SHADES (12) */}
      {/* Pushed to the outer edges so everything fits in 1 screen height without scrolling */}
      {/* ========================================================================= */}
      <div className="w-full flex items-center justify-between gap-1 sm:gap-2 lg:gap-4 xl:gap-6 relative min-h-[420px] sm:min-h-[580px] lg:min-h-[640px]">
        {/* ============================================================= */}
        {/* LEFT FLANK: FIRST 12 SHADES */}
        {/* ============================================================= */}
        <aside
          onMouseLeave={stopHoverScroll}
          className="hidden lg:flex flex-col gap-1.5 w-44 xl:w-52 shrink-0 z-20"
        >
          <div className="flex items-center justify-between px-2 py-1 border-b border-neutral-200 dark:border-white/10 text-xs font-mono text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            <span className="flex items-center gap-1 font-semibold">
              <LayoutGrid className="w-3.5 h-3.5" />
              Shades 01 – {halfCount}
            </span>
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => scrollList(leftListRef, "up")}
                className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-white/10 text-neutral-500 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-amber-300 transition-colors"
                title="Scroll Up"
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => scrollList(leftListRef, "down")}
                className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-white/10 text-neutral-500 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-amber-300 transition-colors"
                title="Scroll Down"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Left Vertical Scrollable Swatch List with cursor hover-scroll and visible amber scrollbar */}
          <div
            ref={leftListRef}
            onMouseMove={(e) => handleRailMouseMove(e, leftListRef)}
            onMouseLeave={stopHoverScroll}
            onWheel={(e) => {
              stopHoverScroll();
              if (leftListRef.current) {
                leftListRef.current.scrollTop += e.deltaY;
              }
            }}
            className="flex flex-col gap-1 max-h-[460px] overflow-y-auto custom-amber-scrollbar overscroll-contain pr-1.5 py-0.5"
          >
            {leftVariants.map((variant) => {
              const isAssigned = slotVariants.slice(0, panelCount).some((v) => v.id === variant.id);
              const isActiveInCurrentSlot = slotVariants[activeSlot]?.id === variant.id;

              return (
                <button
                  key={variant.id}
                  disabled={spinningSlot !== null}
                  onClick={() => handleSelectVariant(variant)}
                  className={`relative p-1 rounded-xl text-left transition-all duration-200 border flex items-center gap-2 ${
                    isActiveInCurrentSlot
                      ? "bg-amber-50 dark:bg-white/15 border-amber-500 dark:border-amber-400/90 shadow-[0_0_12px_rgba(245,158,11,0.25)] ring-1 ring-amber-500 dark:ring-amber-400/50"
                      : isAssigned
                      ? "bg-amber-50/60 dark:bg-white/[0.06] border-amber-400/40"
                      : "bg-neutral-50 dark:bg-white/[0.02] border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/30 hover:bg-neutral-100 dark:hover:bg-white/[0.05]"
                  } ${spinningSlot !== null ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  {/* Thumbnail */}
                  <div className="relative w-7 h-10 rounded-lg overflow-hidden border border-neutral-200 dark:border-white/20 shrink-0 bg-neutral-100 dark:bg-neutral-900">
                    <Image
                      src={variant.thumbnailUrl || variant.textureUrl}
                      alt={`${variant.name} (${variant.code}) 12-inch PVC Wall Panel Gurgaon`}
                      fill
                      className="object-cover scale-110"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-mono font-bold text-xs text-neutral-900 dark:text-white truncate">
                        {variant.code}
                      </span>
                      {isActiveInCurrentSlot && (
                        <Check className="w-3 h-3 text-amber-500 dark:text-amber-400 stroke-[3] shrink-0" />
                      )}
                    </div>
                    <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono block truncate">
                      {variant.type === "fluted" ? "Fluted" : "Plain 12\""}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Bottom helper button to scroll down */}
          <button
            onClick={() => scrollList(leftListRef, "down")}
            className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-amber-300 py-0.5 flex items-center justify-center gap-1 transition-colors"
          >
            <span>Scroll for more</span>
            <ChevronDown className="w-3 h-3 animate-bounce" />
          </button>
        </aside>

        {/* ============================================================= */}
        {/* CENTER: 3D STAGE (1 TO 4 SOLID PLANKS WITH 720° ROTATION) */}
        {/* ============================================================= */}
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerLeave={handlePointerLeave}
          onContextMenu={(e) => e.preventDefault()}
          className="flex-1 min-w-0 h-[430px] sm:h-[580px] lg:h-[640px] flex flex-col items-center justify-center relative perspective-[1400px] select-none touch-none"
        >
          {/* Ambient Background Radial Glow */}
          <div
            className="absolute w-80 sm:w-[480px] h-80 sm:h-[480px] rounded-full blur-3xl pointer-events-none transition-all duration-1000 opacity-25"
            style={{
              background: `radial-gradient(circle, ${displayedSlotVariants[activeSlot]?.colorHex || "#c89454"} 0%, transparent 70%)`,
            }}
          />

          {/* 3D Center Panels Array Container */}
          <div className="flex items-center justify-center gap-3 sm:gap-6 transform-style-3d relative z-10 w-full">
            {slotVariants.slice(0, panelCount).map((variant, idx) => {
              const displayed = displayedSlotVariants[idx] || variant;
              const isTargeted = activeSlot === idx;
              const isSlotSpinning = spinningSlot === idx;

              return (
                <div
                  key={`slot-${idx}`}
                  onClick={() => {
                    if (panelCount > 1) setActiveSlot(idx);
                  }}
                  className="relative cursor-pointer transition-all"
                >
                  {/* Slot Number Badge if comparing */}
                  {panelCount > 1 && (
                    <div className={`absolute -top-8 left-1/2 -translate-x-1/2 z-30 px-2.5 py-0.5 rounded-full text-[10px] font-mono whitespace-nowrap transition-all ${
                      isTargeted
                        ? "bg-amber-400 text-black font-extrabold shadow-md shadow-amber-400/30 ring-1 ring-amber-300"
                        : "bg-white/90 dark:bg-black/80 border border-neutral-200 dark:border-white/20 text-neutral-800 dark:text-neutral-300"
                    }`}>
                      Panel {idx + 1}: <span className={isTargeted ? "text-black font-extrabold" : "text-amber-600 dark:text-amber-300 font-bold"}>{displayed.code}</span>
                    </div>
                  )}

                  {/* Ambient Backlight Behind Selected Plank (Illuminates from behind) */}
                  {isTargeted && panelCount > 1 && (
                    <div
                      className="absolute -inset-8 rounded-3xl pointer-events-none blur-3xl opacity-85 transition-opacity duration-500 -z-10"
                      style={{
                        background: `radial-gradient(circle, rgba(245, 158, 11, 0.45) 0%, rgba(217, 119, 6, 0.25) 45%, transparent 75%)`,
                      }}
                    />
                  )}

                  {/* 3D Rotating Solid Plank */}
                  <motion.div
                    style={{
                      width: `${dims.w}px`,
                      height: `${dims.h}px`,
                      rotateY: rotateYList[idx],
                      rotateX: springRotateX,
                      transformStyle: "preserve-3d",
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      triggerActiveSpin();
                    }}
                    onContextMenu={(e) => e.preventDefault()}
                    onDragStart={(e) => e.preventDefault()}
                    className="relative cursor-grab active:cursor-grabbing transform-gpu will-change-transform select-none"
                  >
                    {/* Natural Floor Shadow */}
                    <motion.div
                      style={{
                        transform: `translateZ(-50px) rotateX(90deg)`,
                        opacity: isSlotSpinning ? 0.3 : 0.65,
                      }}
                      className="absolute -bottom-14 left-1/2 -translate-x-1/2 w-[85%] h-12 bg-black/90 blur-xl rounded-full transition-opacity pointer-events-none"
                    />

                    {/* BACK FACE (180° - Authentic Architectural Specification Backing Plate) */}
                    <div
                      style={{
                        transform: `rotateY(180deg) translateZ(${dHalf}px)`,
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                      }}
                      className="absolute inset-0 rounded-xl overflow-hidden shadow-2xl border border-white/20 bg-neutral-950 flex flex-col justify-between p-3.5 sm:p-5 select-none text-white font-sans"
                    >
                      {/* Engineering Substrate Grid & Extrusion Rib Texture */}
                      <div
                        className="absolute inset-0 opacity-20 pointer-events-none"
                        style={{
                          backgroundImage: `
                            radial-gradient(circle at 50% 30%, rgba(245, 158, 11, 0.15), transparent 70%),
                            repeating-linear-gradient(90deg, transparent, transparent 16px, rgba(255,255,255,0.08) 16px, rgba(255,255,255,0.08) 18px),
                            linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)
                          `,
                          backgroundSize: "100% 100%, 18px 100%, 100% 18px",
                        }}
                      />

                      {/* TOP SECTION: Architectural Laboratory Branding & QC Pass */}
                      <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                            <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
                              Goals Floors Labs
                            </span>
                          </div>
                          <span className="text-[8px] sm:text-[9px] text-neutral-400 font-mono tracking-wider block">
                            ARCHITECTURAL SPECIFICATION
                          </span>
                        </div>
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[9px] font-mono font-bold">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                          <span>QC PASSED</span>
                        </div>
                      </div>

                      {/* CENTER SECTION: Large Variant Code & Technical Specification Matrix */}
                      <div className="relative z-10 flex flex-col items-center justify-center my-auto py-1 sm:py-2 text-center">
                        {/* Large Monospace Product Code */}
                        <div className="relative mb-1">
                          <div className="text-3xl sm:text-4xl lg:text-5xl font-mono font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 drop-shadow-md">
                            {displayed.code}
                          </div>
                          <div className="text-[8px] sm:text-[9px] font-mono uppercase tracking-widest text-amber-400/80 mt-0.5">
                            PANEL SPECIFICATION CODE
                          </div>
                        </div>

                        {/* Shade Name & Swatch Pill */}
                        <div className="mt-1 flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                          <div
                            className="w-3 h-3 rounded-full border border-white/30 shadow-inner shrink-0"
                            style={{ backgroundColor: displayed.colorHex || "#c89454" }}
                          />
                          <span className="text-xs sm:text-sm font-medium text-neutral-200 truncate max-w-[150px] sm:max-w-[200px]">
                            {displayed.name.replace("Primo Plain ", "").replace("Primo Fluted ", "")}
                          </span>
                        </div>

                        {/* Technical Specs Data Matrix */}
                        <div className="w-full mt-3 sm:mt-4 grid grid-cols-2 gap-1.5 text-left text-[9px] sm:text-[10px] font-mono">
                          <div className="p-1.5 rounded bg-white/[0.04] border border-white/5">
                            <span className="text-neutral-500 block text-[7px] sm:text-[8px]">PROFILE TYPE</span>
                            <span className="text-neutral-200 font-semibold truncate block">
                              {displayed.type === "fluted" ? "Acoustic Fluted" : "Seamless 12\" Plain"}
                            </span>
                          </div>
                          <div className="p-1.5 rounded bg-white/[0.04] border border-white/5">
                            <span className="text-neutral-500 block text-[7px] sm:text-[8px]">DIMENSIONS</span>
                            <span className="text-amber-300 font-semibold truncate block">
                              {displayed.dimensions || `${panel.dimensions?.height || "2950 mm"} × ${panel.dimensions?.width || "300 mm"}`}
                            </span>
                          </div>
                          <div className="p-1.5 rounded bg-white/[0.04] border border-white/5">
                            <span className="text-neutral-500 block text-[7px] sm:text-[8px]">CORE MATERIAL</span>
                            <span className="text-neutral-200 font-semibold truncate block">
                              Virgin Polymer WPC
                            </span>
                          </div>
                          <div className="p-1.5 rounded bg-white/[0.04] border border-white/5">
                            <span className="text-neutral-500 block text-[7px] sm:text-[8px]">CERTIFICATIONS</span>
                            <span className="text-emerald-400 font-semibold truncate block">
                              Class B1 • 100% Water
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* BOTTOM SECTION: Barcode & Warehouse Tracking */}
                      <div className="relative z-10 pt-1.5 border-t border-white/10 flex flex-col gap-1">
                        {/* Barcode Graphic */}
                        <div className="flex flex-col items-center">
                          <div className="h-5 sm:h-6 w-3/4 flex items-center justify-between gap-[2px] opacity-80 overflow-hidden">
                            {[2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 1, 4, 2, 1, 3, 1, 2, 1, 4].map((barW, i) => (
                              <div
                                key={i}
                                className="h-full bg-white rounded-[0.5px]"
                                style={{ width: `${barW * 1.4}px` }}
                              />
                            ))}
                          </div>
                          <span className="text-[7px] sm:text-[8px] font-mono tracking-widest text-neutral-400 mt-0.5">
                            GF-IN-WPC-{displayed.code.replace(/[^a-zA-Z0-9]/g, "")}-GURGAON
                          </span>
                        </div>

                        {/* Origin Stamp */}
                        <div className="flex items-center justify-between text-[7px] sm:text-[8px] font-mono text-neutral-400 pt-1 border-t border-white/5">
                          <span>GURGAON DIRECT DISPATCH</span>
                          <span className="text-amber-400/80">LOT #2026-GF</span>
                        </div>
                      </div>
                    </div>

                    {/* FRONT FACE (Main high-res architectural texture - always prioritized) */}
                    <div
                      style={{
                        transform: `translateZ(${dHalf}px)`,
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                      }}
                      className="absolute inset-0 rounded-xl overflow-hidden shadow-2xl border border-white/20 bg-neutral-900 z-10 select-none"
                    >
                      <Image
                        src={displayed.textureUrl}
                        alt={`${displayed.name} (${displayed.code}) 12-Inch Seamless Waterproof PVC Wall Panel - Goals Floors Gurgaon`}
                        fill
                        draggable={false}
                        sizes="(max-width: 640px) 220px, 320px"
                        priority
                        className="object-cover object-center pointer-events-none select-none [-webkit-user-drag:none]"
                      />
                      {/* Realistic surface sheen */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/20 pointer-events-none" />

                      {/* Floating Variant Identification Pill on Active Slot */}
                      <div className="absolute bottom-3 inset-x-3 z-10 flex items-center justify-between p-2 rounded-xl bg-black/75 backdrop-blur-md border border-white/15 shadow-lg pointer-events-auto">
                        <div className="min-w-0 pr-2">
                          <span className="font-mono font-bold text-xs text-amber-300 block truncate">
                            {displayed.code}
                          </span>
                          <span className="text-[10px] text-neutral-300 font-mono truncate block">
                            {displayed.name.replace("Primo Plain ", "").replace("Primo Fluted ", "")}
                          </span>
                        </div>
                        <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded bg-white/10 text-white/90 shrink-0">
                          {displayed.type === "fluted" ? "Fluted" : "Plain 12\""}
                        </span>
                      </div>
                    </div>

                    {/* PHYSICAL 3D TOP CAP (Seals top edge from above tilt, stops at corner radius) */}
                    <div
                      style={{
                        width: `${dims.w - 2 * cornerR}px`,
                        height: `${dims.depth}px`,
                        left: `${cornerR}px`,
                        top: "50%",
                        marginTop: `-${dHalf}px`,
                        transform: `rotateX(90deg) translateZ(${hHalf - 1}px)`,
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                      }}
                      className="absolute bg-gradient-to-r from-[#241e18] via-[#1a1511] to-[#241e18] border-b border-black/90 shadow-md pointer-events-none"
                    />

                    {/* PHYSICAL 3D BOTTOM CAP (Seals bottom edge from below tilt, stops at corner radius) */}
                    <div
                      style={{
                        width: `${dims.w - 2 * cornerR}px`,
                        height: `${dims.depth}px`,
                        left: `${cornerR}px`,
                        top: "50%",
                        marginTop: `-${dHalf}px`,
                        transform: `rotateX(-90deg) translateZ(${hHalf - 1}px)`,
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                      }}
                      className="absolute bg-gradient-to-r from-[#18130e] via-[#120e0a] to-[#18130e] border-t border-black/90 shadow-md pointer-events-none"
                    />

                    {/* PHYSICAL 3D RIGHT SIDE (Sealed full height between corner arcs) */}
                    <div
                      style={{
                        width: `${dims.depth}px`,
                        height: `${dims.h - 2 * cornerR}px`,
                        left: "50%",
                        top: `${cornerR}px`,
                        marginLeft: `-${dHalf}px`,
                        transform: `rotateY(90deg) translateZ(${wHalf - 1}px)`,
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                      }}
                      className="absolute bg-gradient-to-b from-[#3a3227] via-[#241e17] to-[#18130e] border-l border-white/20 shadow-inner pointer-events-none"
                    />

                    {/* PHYSICAL 3D LEFT SIDE (Sealed full height between corner arcs) */}
                    <div
                      style={{
                        width: `${dims.depth}px`,
                        height: `${dims.h - 2 * cornerR}px`,
                        left: "50%",
                        top: `${cornerR}px`,
                        marginLeft: `-${dHalf}px`,
                        transform: `rotateY(-90deg) translateZ(${wHalf - 1}px)`,
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                      }}
                      className="absolute bg-gradient-to-b from-[#241e18] via-[#1a1511] to-[#120f0c] border-r border-black/60 pointer-events-none"
                    />

                    {/* 4 CURVED CORNER BEVELS (Smoothly seals all 4 corners matching rounded-xl silhouette) */}
                    {cornerSpecs.map((cs, cIdx) => (
                      <React.Fragment key={`corner-group-${cIdx}`}>
                        {cs.angles.map((deg, aIdx) => {
                          const rad = (deg * Math.PI) / 180;
                          const xm = cs.cx + cornerR * Math.cos(rad);
                          const ym = cs.cy + cornerR * Math.sin(rad);

                          return (
                            <div
                              key={`corner-facet-${cIdx}-${aIdx}`}
                              style={{
                                width: `${dims.depth}px`,
                                height: `${cornerChord}px`,
                                left: `${xm - dims.depth / 2}px`,
                                top: `${ym - cornerChord / 2}px`,
                                transformOrigin: "center center",
                                transform: `rotateZ(${deg}deg) rotateY(90deg)`,
                                backgroundColor: cs.bg,
                              }}
                              className="absolute pointer-events-none"
                            />
                          );
                        })}
                      </React.Fragment>
                    ))}
                  </motion.div>
                </div>
              );
            })}
          </div>

          {/* 360 Spin / Interaction Pill */}
          <div className="mt-3 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-neutral-950/85 backdrop-blur-xl border border-neutral-200 dark:border-white/10 shadow-lg text-[11px] text-neutral-700 dark:text-white/70">
            <button
              onClick={triggerActiveSpin}
              className="flex items-center gap-1.5 text-amber-600 dark:text-amber-300 hover:text-amber-500 dark:hover:text-amber-200 transition-colors font-medium"
            >
              <Rotate3d className={`w-3.5 h-3.5 ${spinningSlot !== null ? "animate-spin text-amber-500 dark:text-amber-400" : ""}`} />
              <span>{spinningSlot !== null ? "Transforming 720°..." : "Spin Panel"}</span>
            </button>
            <span className="text-neutral-300 dark:text-white/20">•</span>
            <span>Drag mouse to tilt 3D angle</span>
          </div>
        </div>

        {/* ============================================================= */}
        {/* RIGHT FLANK: SECOND 12 SHADES */}
        {/* ============================================================= */}
        <aside
          onMouseLeave={stopHoverScroll}
          className="hidden lg:flex flex-col gap-1.5 w-44 xl:w-52 shrink-0 z-20"
        >
          <div className="flex items-center justify-between px-2 py-1 border-b border-neutral-200 dark:border-white/10 text-xs font-mono text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            <span className="flex items-center gap-1 font-semibold">
              <LayoutGrid className="w-3.5 h-3.5" />
              Shades {halfCount + 1} – {variants.length}
            </span>
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => scrollList(rightListRef, "up")}
                className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-white/10 text-neutral-500 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-amber-300 transition-colors"
                title="Scroll Up"
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => scrollList(rightListRef, "down")}
                className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-white/10 text-neutral-500 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-amber-300 transition-colors"
                title="Scroll Down"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Vertical Scrollable Swatch List with cursor hover-scroll and visible amber scrollbar */}
          <div
            ref={rightListRef}
            onMouseMove={(e) => handleRailMouseMove(e, rightListRef)}
            onMouseLeave={stopHoverScroll}
            onWheel={(e) => {
              stopHoverScroll();
              if (rightListRef.current) {
                rightListRef.current.scrollTop += e.deltaY;
              }
            }}
            className="flex flex-col gap-1 max-h-[460px] overflow-y-auto custom-amber-scrollbar overscroll-contain pl-0.5 pr-1.5 py-0.5"
          >
            {rightVariants.map((variant) => {
              const isAssigned = slotVariants.slice(0, panelCount).some((v) => v.id === variant.id);
              const isActiveInCurrentSlot = slotVariants[activeSlot]?.id === variant.id;

              return (
                <button
                  key={variant.id}
                  disabled={spinningSlot !== null}
                  onClick={() => handleSelectVariant(variant)}
                  className={`relative p-1 rounded-xl text-left transition-all duration-200 border flex items-center gap-2 ${
                    isActiveInCurrentSlot
                      ? "bg-amber-50 dark:bg-white/15 border-amber-500 dark:border-amber-400/90 shadow-[0_0_12px_rgba(245,158,11,0.25)] ring-1 ring-amber-500 dark:ring-amber-400/50"
                      : isAssigned
                      ? "bg-amber-50/60 dark:bg-white/[0.06] border-amber-400/40"
                      : "bg-neutral-50 dark:bg-white/[0.02] border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/30 hover:bg-neutral-100 dark:hover:bg-white/[0.05]"
                  } ${spinningSlot !== null ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  {/* Thumbnail */}
                  <div className="relative w-7 h-10 rounded-lg overflow-hidden border border-neutral-200 dark:border-white/20 shrink-0 bg-neutral-100 dark:bg-neutral-900">
                    <Image
                      src={variant.thumbnailUrl || variant.textureUrl}
                      alt={`${variant.name} (${variant.code}) 12-inch PVC Wall Panel Gurgaon`}
                      fill
                      className="object-cover scale-110"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-mono font-bold text-xs text-neutral-900 dark:text-white truncate">
                        {variant.code}
                      </span>
                      {isActiveInCurrentSlot && (
                        <Check className="w-3 h-3 text-amber-500 dark:text-amber-400 stroke-[3] shrink-0" />
                      )}
                    </div>
                    <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono block truncate">
                      {variant.type === "fluted" ? "Fluted" : "Plain 12\""}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Bottom helper button to scroll down */}
          <button
            onClick={() => scrollList(rightListRef, "down")}
            className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-amber-300 py-0.5 flex items-center justify-center gap-1 transition-colors"
          >
            <span>Scroll for more</span>
            <ChevronDown className="w-3 h-3 animate-bounce" />
          </button>
        </aside>
      </div>

      {/* ============================================================= */}
      {/* MOBILE / TABLET ONLY: 2-ROW HORIZONTAL SWATCH SHELF */}
      {/* Top row: 12 Shades (01-12) | Bottom row: 12 Shades (13-24) */}
      {/* Visible only on screens below lg (<1024px) */}
      {/* ============================================================= */}
      <div className="w-full max-w-3xl px-2 mt-2 lg:hidden">
        <div className="p-2.5 sm:p-3 rounded-2xl bg-white/95 dark:bg-neutral-950/90 border border-neutral-200 dark:border-white/10 backdrop-blur-xl shadow-lg dark:shadow-2xl flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5 font-bold">
              <Layers className="w-3.5 h-3.5" />
              <span>Select Shade</span>
            </span>
            <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
              24 Shades (2 Rows × 12)
            </span>
          </div>

          {/* 2-ROW HORIZONTAL SCROLL SHELF */}
          <div className="overflow-x-auto pb-1.5 custom-amber-scrollbar flex flex-col gap-1.5 select-none overscroll-contain">
            {/* ROW 1: Shades 01 to 12 */}
            <div className="flex items-center gap-2 w-max">
              {variants.slice(0, 12).map((variant) => {
                const isSelected = slotVariants[activeSlot]?.id === variant.id;
                return (
                  <button
                    key={`mobile-r1-${variant.id}`}
                    onClick={() => handleSelectVariant(variant)}
                    className={`shrink-0 relative p-1.5 rounded-xl text-left transition-all border flex items-center gap-2 w-[122px] ${
                      isSelected
                        ? "bg-amber-50 dark:bg-white/15 border-amber-500 dark:border-amber-400 ring-1 ring-amber-500 dark:ring-amber-400 shadow-sm"
                        : "bg-neutral-50 dark:bg-white/[0.04] border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20"
                    }`}
                  >
                    <div className="relative w-7 h-9 rounded-lg overflow-hidden border border-neutral-200 dark:border-white/20 shrink-0 bg-neutral-200 dark:bg-neutral-900">
                      <Image
                        src={variant.thumbnailUrl || variant.textureUrl}
                        alt={`${variant.name} (${variant.code}) 12-inch PVC Wall Panel Swatch`}
                        fill
                        className="object-cover scale-110"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-mono font-bold text-xs text-neutral-900 dark:text-white block truncate">
                        {variant.code}
                      </span>
                      <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono block truncate">
                        {variant.type === "fluted" ? "Fluted" : "Plain"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* ROW 2: Shades 13 to 24 */}
            <div className="flex items-center gap-2 w-max">
              {variants.slice(12, 24).map((variant) => {
                const isSelected = slotVariants[activeSlot]?.id === variant.id;
                return (
                  <button
                    key={`mobile-r2-${variant.id}`}
                    onClick={() => handleSelectVariant(variant)}
                    className={`shrink-0 relative p-1.5 rounded-xl text-left transition-all border flex items-center gap-2 w-[122px] ${
                      isSelected
                        ? "bg-amber-50 dark:bg-white/15 border-amber-500 dark:border-amber-400 ring-1 ring-amber-500 dark:ring-amber-400 shadow-sm"
                        : "bg-neutral-50 dark:bg-white/[0.04] border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20"
                    }`}
                  >
                    <div className="relative w-7 h-9 rounded-lg overflow-hidden border border-neutral-200 dark:border-white/20 shrink-0 bg-neutral-200 dark:bg-neutral-900">
                      <Image
                        src={variant.thumbnailUrl || variant.textureUrl}
                        alt={`${variant.name} (${variant.code}) 12-inch PVC Wall Panel Swatch`}
                        fill
                        className="object-cover scale-110"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-mono font-bold text-xs text-neutral-900 dark:text-white block truncate">
                        {variant.code}
                      </span>
                      <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono block truncate">
                        {variant.type === "fluted" ? "Fluted" : "Plain"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
