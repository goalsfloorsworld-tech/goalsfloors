"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getPublicTrendingSections } from '@/actions/admin/trending';

interface TrendingItem {
  number: string;
  label: string;
  title: string;
  image: string;
  href: string;
}

interface TrendingSlide {
  id: string;
  collectionName: string;
  tagline: string;
  header_strip?: string;
  description: string;
  items: [TrendingItem, TrendingItem, TrendingItem, TrendingItem]; // 01, 02, 03, 04
}

const TRENDING_SLIDES: TrendingSlide[] = [
  {
    id: "wall-panels-and-floors",
    collectionName: "Wall Panels & Festive Living",
    tagline: "Trending Now",
    description: "Most enquired floors and panels in Gurgaon and Delhi NCR.",
    items: [
      {
        number: "01",
        label: "Wall Panels",
        title: "Fluted Charcoal & WPC Wall Panels",
        image: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772477058/Wpc_Fluted_Panel_In_Gurgaon.png",
        href: "/products/wall-panels",
      },
      {
        number: "02",
        label: "Herringbone",
        title: "Light Oak Herringbone Floors",
        image: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775411703/Luxury_Penthouse_Living_Room_with_Light_Oak_Herringbone_Flooring_Gurugram.jpg",
        href: "/products/herringbone-laminate-flooring",
      },
      {
        number: "03",
        label: "SPC Flooring",
        title: "Stone Polymer Composite Core",
        image: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1774612492/screenshot-2024-11-05-074302-YKb68R7lNDueGKEV.jpg",
        href: "/products/spc-flooring",
      },
      {
        number: "04",
        label: "Artificial Grass",
        title: "All-Weather Balcony Greenery",
        image: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772476444/artificial_grass_supplier_in_india.jpg",
        href: "/products/artificial-grass",
      },
    ],
  },
  {
    id: "luxury-flooring-collection",
    collectionName: "Luxury Flooring Series",
    tagline: "Trending Now",
    description: "Curated European wood textures and stone-composite finishes.",
    items: [
      {
        number: "01",
        label: "Laminate Flooring",
        title: "Warm Oak Laminate Planks",
        image: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775544853/oak_color_laminate_flooring_installed_images.png",
        href: "/products/laminate-flooring",
      },
      {
        number: "02",
        label: "Hybrid Flooring",
        title: "Hydro-Seal Rigid Core",
        image: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772477090/Ocean_Waterproof_Laminate_FLooring.jpg",
        href: "/products/hybrid-laminate-flooring",
      },
      {
        number: "03",
        label: "WPC Decking",
        title: "Outdoor Weatherproof Teak",
        image: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772478659/premium_wpc_decking_supplier_in_gurgaon.jpg",
        href: "/products/wpc-decking",
      },
      {
        number: "04",
        label: "PU Stone",
        title: "Featherlight Rock Textures",
        image: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772477246/Pu_Stone_Colors.jpg",
        href: "/products/cobra-pu-stone",
      },
    ],
  },
  {
    id: "architectural-louvers-ceilings",
    collectionName: "Architectural Louvers & Ceilings",
    tagline: "Trending Now",
    description: "Modern exterior facades and acoustic ceiling profiles.",
    items: [
      {
        number: "01",
        label: "Exterior Louvers",
        title: "All-Weather Cladding Louvers",
        image: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775818177/exterior_louvaring.jpg",
        href: "/products/wpc-exterior-louvers",
      },
      {
        number: "02",
        label: "Upfit Panels",
        title: "Architectural Feature Walls",
        image: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1774525633/goals-floors-upfit-panels-m7Vw49PE2qSaDNaG.jpg",
        href: "/products/upfit-panels",
      },
      {
        number: "03",
        label: "Timber Tubes",
        title: "Walnut Aesthetic Partitions",
        image: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772478739/Timber_Tube.png",
        href: "/products/wpc-timber-tubes",
      },
      {
        number: "04",
        label: "Baffle Ceiling",
        title: "Acoustic Linear Ceilings",
        image: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775466342/screenshot-2024-10-27-180236-1-AQEyyylJkGUBqyED.webp",
        href: "/products/wpc-baffle-ceiling",
      },
    ],
  },
];

// Motion Variants:
// 01: exits RIGHT, enters from RIGHT
// 02: exits UP, enters from UP
// 03: exits DOWN, enters from DOWN
// 04: exits LEFT, enters from LEFT
const cardMotionVariants: Record<string, Variants> = {
  card01: {
    initial: { x: 260, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
    exit: { x: 260, opacity: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
  },
  card02: {
    initial: { y: -220, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
    exit: { y: -220, opacity: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
  },
  card03: {
    initial: { y: 220, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
    exit: { y: 220, opacity: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
  },
  card04: {
    initial: { x: -260, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
    exit: { x: -260, opacity: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
  },
};

export default function TrendingNowSection() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [dynamicSlides, setDynamicSlides] = useState<TrendingSlide[]>([]);

  useEffect(() => {
    async function fetchDynamicTrending() {
      try {
        const res = await getPublicTrendingSections();
        if (res.success && res.sets.length > 0) {
          const mapped: TrendingSlide[] = res.sets.map((s) => ({
            id: s.id,
            collectionName: s.name,
            tagline: s.tagline || "Trending Now",
            header_strip: s.header_strip || "MOST LOVED THIS SEASON",
            description: s.description,
            items: s.items,
          }));
          setDynamicSlides(mapped);
        }
      } catch (err) {
        console.warn("Could not load dynamic trending sections, using defaults:", err);
      }
    }
    fetchDynamicTrending();
  }, []);

  const activeSlides = dynamicSlides.length > 0 ? dynamicSlides : TRENDING_SLIDES;
  const currentSlide = activeSlides[currentIdx % activeSlides.length] || TRENDING_SLIDES[0];

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % activeSlides.length);
  };

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  const item01 = currentSlide.items[0];
  const item02 = currentSlide.items[1];
  const item03 = currentSlide.items[2];
  const item04 = currentSlide.items[3];

  return (
    <section id="trending" className="w-full relative overflow-hidden bg-[#faf7f2] dark:bg-[#0c1220] transition-colors duration-300 border-t border-b border-black/5 dark:border-white/5 lg:h-screen lg:min-h-[720px] lg:max-h-[1080px] flex flex-col justify-center">
      {/* Main Fullscreen Canvas */}
      <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden">
        {/* Giant Watermark Background "TRENDING" Outline Text in Theme Amber */}
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center select-none pointer-events-none overflow-hidden z-0"
        >
          <span
            className="font-serif font-black uppercase tracking-[0.14em] text-[19vw] leading-none text-transparent select-none whitespace-nowrap opacity-25 dark:opacity-10"
            style={{
              WebkitTextStroke: "1.5px rgba(225, 113, 0, 0.22)",
            }}
          >
            TRENDING
          </span>
        </div>

        {/* Global Continuous Horizontal Axis Line (Desktop only) */}
        <div className="hidden lg:block absolute left-0 right-0 top-[52%] h-[1px] bg-black/10 dark:bg-white/10 z-0 pointer-events-none" />

        {/* ================= DESKTOP ARTISTIC COLLAGE ================= */}
        <div className="hidden lg:block relative w-full h-full max-w-[1720px] mx-auto px-6 xl:px-12 z-10">
          {/* Left Text Block (Trending Now) - Aligned above horizontal axis */}
          <div className="absolute left-6 xl:left-12 top-[34%] xl:top-[36%] max-w-[340px] z-20">
            <h2 className="font-serif text-5xl xl:text-6xl font-normal tracking-tight text-gray-900 dark:text-white leading-[1.05]">
              {currentSlide.tagline || "Trending Now"}
            </h2>

            <p className="text-gray-600 dark:text-gray-400 text-xs xl:text-sm mt-3 leading-relaxed max-w-[280px]">
              {currentSlide.description}
            </p>

            {/* Accent Line segment on the axis line in Theme Amber */}
            <div className="flex items-center gap-2 mt-6">
              <span className="h-[2px] w-16 bg-[#E17100] dark:bg-amber-500 rounded-full" />
            </div>
          </div>

          {/* Overlapping 4-Card Composition */}
          <AnimatePresence mode="wait">
            <div key={currentSlide.id} className="absolute inset-0 pointer-events-none">
              {/* ================= CARD 02 (Top, sits directly above horizontal line) ================= */}
              <motion.div
                variants={cardMotionVariants.card02}
                initial="initial"
                animate="animate"
                exit="exit"
                className="absolute left-[33%] xl:left-[34%] 2xl:left-[35%] bottom-[49%] w-[185px] xl:w-[220px] 2xl:w-[235px] h-[245px] xl:h-[285px] 2xl:h-[305px] z-10 pointer-events-auto group"
              >
                <Link href={item02.href} className="block relative w-full h-full">
                  <div className="relative w-full h-full rounded-none overflow-hidden shadow-2xl bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 transition-transform duration-500 group-hover:scale-[1.02]">
                    {/* White Square Badge flush inside the top-left corner of the image */}
                    <div className="absolute top-0 left-0 z-30 aspect-square w-[52px] h-[52px] xl:w-[62px] xl:h-[62px] 2xl:w-[68px] 2xl:h-[68px] bg-white dark:bg-slate-900 border-r border-b border-black/10 dark:border-white/10 shadow-md flex items-center justify-center select-none">
                      <span className="font-serif text-3xl xl:text-4xl 2xl:text-5xl font-bold tracking-tight text-[#E17100] dark:text-amber-500 leading-none">
                        {item02.number}
                      </span>
                    </div>

                    <Image
                      src={item02.image}
                      alt={item02.title}
                      fill
                      sizes="240px"
                      className="object-cover transition-transform duration-700 group-hover:scale-108"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-60" />
                    <span className="absolute bottom-2.5 left-2.5 bg-black text-white text-[10px] xl:text-[11px] font-bold px-2.5 py-1 uppercase tracking-wider shadow-md">
                      {item02.label}
                    </span>
                  </div>
                </Link>
              </motion.div>

              {/* ================= CARD 04 (Bottom Left, sits directly below horizontal line) ================= */}
              <motion.div
                variants={cardMotionVariants.card04}
                initial="initial"
                animate="animate"
                exit="exit"
                className="absolute left-[24%] xl:left-[25%] 2xl:left-[26%] top-[53%] w-[185px] xl:w-[220px] 2xl:w-[235px] h-[145px] xl:h-[175px] 2xl:h-[185px] z-20 pointer-events-auto group"
              >
                <Link href={item04.href} className="block relative w-full h-full">
                  <div className="relative w-full h-full rounded-none overflow-hidden shadow-2xl bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 transition-transform duration-500 group-hover:scale-[1.02]">
                    {/* White Square Badge flush inside the top-left corner of the image */}
                    <div className="absolute top-0 left-0 z-30 aspect-square w-[52px] h-[52px] xl:w-[62px] xl:h-[62px] 2xl:w-[68px] 2xl:h-[68px] bg-white dark:bg-slate-900 border-r border-b border-black/10 dark:border-white/10 shadow-md flex items-center justify-center select-none">
                      <span className="font-serif text-3xl xl:text-4xl 2xl:text-5xl font-bold tracking-tight text-[#E17100] dark:text-amber-500 leading-none">
                        {item04.number}
                      </span>
                    </div>

                    <Image
                      src={item04.image}
                      alt={item04.title}
                      fill
                      sizes="240px"
                      className="object-cover transition-transform duration-700 group-hover:scale-108"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-60" />
                    <span className="absolute bottom-2.5 left-2.5 bg-black text-white text-[10px] xl:text-[11px] font-bold px-2.5 py-1 uppercase tracking-wider shadow-md">
                      {item04.label}
                    </span>
                  </div>
                </Link>
              </motion.div>

              {/* ================= CARD 01 (Hero Centerpiece, layered ON TOP OF Card 02) ================= */}
              <motion.div
                variants={cardMotionVariants.card01}
                initial="initial"
                animate="animate"
                exit="exit"
                className="absolute left-[44%] xl:left-[45%] 2xl:left-[46%] top-[52%] -translate-y-1/2 w-[390px] xl:w-[470px] 2xl:w-[510px] h-[270px] xl:h-[325px] 2xl:h-[355px] z-20 pointer-events-auto group"
              >
                <Link href={item01.href} className="block relative w-full h-full">
                  <div className="relative w-full h-full rounded-none overflow-hidden shadow-2xl bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 transition-transform duration-500 group-hover:scale-[1.01]">
                    {/* White Square Badge flush inside the top-left corner of the image */}
                    <div className="absolute top-0 left-0 z-30 aspect-square w-[68px] h-[68px] xl:w-[82px] xl:h-[82px] 2xl:w-[90px] 2xl:h-[90px] bg-white dark:bg-slate-900 border-r border-b border-black/10 dark:border-white/10 shadow-lg flex items-center justify-center select-none">
                      <span className="font-serif text-4xl xl:text-5xl 2xl:text-6xl font-bold tracking-tight text-[#E17100] dark:text-amber-500 leading-none">
                        {item01.number}
                      </span>
                    </div>

                    <Image
                      src={item01.image}
                      alt={item01.title}
                      fill
                      sizes="(max-width: 1440px) 470px, 510px"
                      priority
                      className="object-cover transition-transform duration-700 group-hover:scale-106"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
                    <span className="absolute bottom-3 left-3 bg-black text-white text-[11px] xl:text-[12px] font-bold px-3 py-1.5 uppercase tracking-wider shadow-md">
                      {item01.label}
                    </span>
                  </div>
                </Link>
              </motion.div>

              {/* ================= CARD 03 (Bottom Right, sits across/below line, layered on top of Card 01) ================= */}
              <motion.div
                variants={cardMotionVariants.card03}
                initial="initial"
                animate="animate"
                exit="exit"
                className="absolute left-[75%] xl:left-[74%] 2xl:left-[73%] top-[51%] w-[185px] xl:w-[215px] 2xl:w-[230px] h-[230px] xl:h-[270px] 2xl:h-[290px] z-30 pointer-events-auto group"
              >
                <Link href={item03.href} className="block relative w-full h-full">
                  <div className="relative w-full h-full rounded-none overflow-hidden shadow-2xl bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 transition-transform duration-500 group-hover:scale-[1.02]">
                    {/* White Square Badge flush inside the top-left corner of the image */}
                    <div className="absolute top-0 left-0 z-30 aspect-square w-[52px] h-[52px] xl:w-[62px] xl:h-[62px] 2xl:w-[68px] 2xl:h-[68px] bg-white dark:bg-slate-900 border-r border-b border-black/10 dark:border-white/10 shadow-md flex items-center justify-center select-none">
                      <span className="font-serif text-3xl xl:text-4xl 2xl:text-5xl font-bold tracking-tight text-[#E17100] dark:text-amber-500 leading-none">
                        {item03.number}
                      </span>
                    </div>

                    <Image
                      src={item03.image}
                      alt={item03.title}
                      fill
                      sizes="230px"
                      className="object-cover transition-transform duration-700 group-hover:scale-108"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-60" />
                    <span className="absolute bottom-2.5 left-2.5 bg-black text-white text-[10px] xl:text-[11px] font-bold px-2.5 py-1 uppercase tracking-wider shadow-md">
                      {item03.label}
                    </span>
                  </div>
                </Link>
              </motion.div>
            </div>
          </AnimatePresence>

          {/* Right Edge Floating Arrow Button in Theme Amber */}
          <div className="absolute right-4 xl:right-8 top-[52%] -translate-y-1/2 z-40 flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next Collection"
              className="w-13 h-13 xl:w-14 xl:h-14 rounded-full bg-[#E17100] hover:bg-[#c96200] dark:bg-[#E17100] dark:hover:bg-amber-500 text-white flex items-center justify-center transition-all shadow-xl shadow-[#E17100]/25 active:scale-95 group cursor-pointer border border-white/20"
            >
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
            <span className="text-[10px] font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase select-none">
              0{(currentIdx % activeSlides.length) + 1} / 0{activeSlides.length}
            </span>
          </div>
        </div>

        {/* ================= MOBILE / TABLET VIEW (< lg:) ================= */}
        <div className="lg:hidden flex flex-col relative z-10 w-full px-4 sm:px-8 py-8 my-auto">
          {/* Header & Controls */}
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-gray-900 dark:text-white">
                {currentSlide.tagline || "Trending Now"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mt-1 max-w-[280px]">
                {currentSlide.description}
              </p>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous Category"
                className="w-9 h-9 rounded-full border border-gray-300 dark:border-gray-700 bg-white/90 dark:bg-slate-900/90 flex items-center justify-center text-gray-800 dark:text-gray-200 active:scale-95 shadow-sm"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next Category"
                className="w-9 h-9 rounded-full bg-[#E17100] hover:bg-[#c96200] text-white flex items-center justify-center active:scale-95 shadow-md shadow-[#E17100]/25"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Cards Grid with Directional Animation */}
          <AnimatePresence mode="wait">
            <div key={currentSlide.id} className="grid grid-cols-2 gap-3 sm:gap-4">
              {/* Card 01 (Main Hero) */}
              <motion.div
                variants={cardMotionVariants.card01}
                initial="initial"
                animate="animate"
                exit="exit"
                className="col-span-2 relative aspect-[16/9] rounded-none overflow-hidden shadow-xl group border border-black/5 dark:border-white/10"
              >
                <Link href={item01.href} className="block w-full h-full relative">
                  <div className="absolute top-0 left-0 z-20 aspect-square w-12 h-12 sm:w-14 sm:h-14 bg-white/95 dark:bg-slate-900/95 border-r border-b border-black/10 dark:border-white/10 flex items-center justify-center shadow-sm select-none">
                    <span className="font-serif text-2xl sm:text-3xl font-bold text-[#E17100] dark:text-amber-500 leading-none">
                      {item01.number}
                    </span>
                  </div>
                  <Image
                    src={item01.image}
                    alt={item01.title}
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <span className="absolute bottom-2.5 left-2.5 bg-black text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                    {item01.label}
                  </span>
                </Link>
              </motion.div>

              {/* Card 02 */}
              <motion.div
                variants={cardMotionVariants.card02}
                initial="initial"
                animate="animate"
                exit="exit"
                className="relative aspect-[4/5] rounded-none overflow-hidden shadow-lg group border border-black/5 dark:border-white/10"
              >
                <Link href={item02.href} className="block w-full h-full relative">
                  <div className="absolute top-0 left-0 z-20 aspect-square w-10 h-10 sm:w-12 sm:h-12 bg-white/95 dark:bg-slate-900/95 border-r border-b border-black/10 dark:border-white/10 flex items-center justify-center shadow-sm select-none">
                    <span className="font-serif text-lg sm:text-2xl font-bold text-[#E17100] dark:text-amber-500 leading-none">
                      {item02.number}
                    </span>
                  </div>
                  <Image
                    src={item02.image}
                    alt={item02.title}
                    fill
                    sizes="50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <span className="absolute bottom-2 left-2 bg-black text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider">
                    {item02.label}
                  </span>
                </Link>
              </motion.div>

              {/* Card 03 */}
              <motion.div
                variants={cardMotionVariants.card03}
                initial="initial"
                animate="animate"
                exit="exit"
                className="relative aspect-[4/5] rounded-none overflow-hidden shadow-lg group border border-black/5 dark:border-white/10"
              >
                <Link href={item03.href} className="block w-full h-full relative">
                  <div className="absolute top-0 left-0 z-20 aspect-square w-10 h-10 sm:w-12 sm:h-12 bg-white/95 dark:bg-slate-900/95 border-r border-b border-black/10 dark:border-white/10 flex items-center justify-center shadow-sm select-none">
                    <span className="font-serif text-lg sm:text-2xl font-bold text-[#E17100] dark:text-amber-500 leading-none">
                      {item03.number}
                    </span>
                  </div>
                  <Image
                    src={item03.image}
                    alt={item03.title}
                    fill
                    sizes="50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <span className="absolute bottom-2 left-2 bg-black text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider">
                    {item03.label}
                  </span>
                </Link>
              </motion.div>

              {/* Card 04 */}
              <motion.div
                variants={cardMotionVariants.card04}
                initial="initial"
                animate="animate"
                exit="exit"
                className="col-span-2 relative aspect-[21/9] rounded-none overflow-hidden shadow-lg group border border-black/5 dark:border-white/10"
              >
                <Link href={item04.href} className="block w-full h-full relative">
                  <div className="absolute top-0 left-0 z-20 aspect-square w-10 h-10 sm:w-12 sm:h-12 bg-white/95 dark:bg-slate-900/95 border-r border-b border-black/10 dark:border-white/10 flex items-center justify-center shadow-sm select-none">
                    <span className="font-serif text-lg sm:text-2xl font-bold text-[#E17100] dark:text-amber-500 leading-none">
                      {item04.number}
                    </span>
                  </div>
                  <Image
                    src={item04.image}
                    alt={item04.title}
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <span className="absolute bottom-2 left-2.5 bg-black text-white text-[10px] font-bold px-2.5 py-0.5 uppercase tracking-wider">
                    {item04.label}
                  </span>
                </Link>
              </motion.div>
            </div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
