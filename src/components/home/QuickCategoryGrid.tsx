"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Columns2,
  Columns3,
  AlignLeft,
  Mountain,
  AlignJustify,
  Leaf,
  Sun,
  LayoutGrid,
  Layers,
  Grid2X2,
  Box,
  GripHorizontal,
  Pause
} from "lucide-react";

const categories = [
  { id: 1, name: "Wall Panels", href: "/products/wall-panels", icon: Columns2, iconImage: "/panels.png", iconSize: "w-7 h-7", image: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772477058/Wpc_Fluted_Panel_In_Gurgaon.png", variantImage: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_FP_-_701.png", bgColor: "bg-[#e8f3f1]" },
  { id: 2, name: "Upfit Panels", href: "/products/upfit-panels", icon: Columns3, iconImage: "/upfit.png", iconSize: "w-8 h-8", image: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1774525633/goals-floors-upfit-panels-m7Vw49PE2qSaDNaG.jpg", variantImage: "https://res.cloudinary.com/dcezlxt8r/image/upload/v1781695284/Upfit_Panels_Premium_Quality.jpg", bgColor: "bg-[#f4efe8]" },
  { id: 3, name: "Tokyo Moulding", href: "/products/tokyo-charcoal-moulding", icon: AlignLeft, iconImage: "/moulding.png", iconSize: "w-7 h-7", image: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1774970794/charcoal-gray_paneled_wall..jpg", variantImage: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772477041/premium_quality_charcoal_moulding.jpg", bgColor: "bg-[#e8f1f5]" },
  { id: 4, name: "Cobra PU Stone", href: "/products/cobra-pu-stone", icon: Mountain, iconSize: "w-7 h-7", image: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772477246/Pu_Stone_Colors.jpg", variantImage: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772477290/Pu_Stone_30mm_White_Color.png", bgColor: "bg-[#f5eef4]" },
  { id: 5, name: "Exterior Louvers", href: "/products/wpc-exterior-louvers", icon: AlignJustify, iconImage: "/louvers.png", iconSize: "w-7 h-7", image: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775818177/exterior_louvaring.jpg", variantImage: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772478676/Wpc_Exterior_Louvers_Supplier_In_India.png", bgColor: "bg-[#edf5e8]" },
  { id: 6, name: "Artificial Grass", href: "/products/artificial-grass", icon: Leaf, iconImage: "/grass.png", iconSize: "w-7 h-7", image: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772476444/artificial_grass_supplier_in_india.jpg", variantImage: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1774598879/artificial-grass-20mm-YleqzvDVz3h0ko8W.avif", bgColor: "bg-[#f5ece8]" },
  { id: 7, name: "WPC Decking", href: "/products/wpc-decking", icon: Sun, iconImage: "/decking.png", iconSize: "w-8 h-8", image: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772478659/premium_wpc_decking_supplier_in_gurgaon.jpg", variantImage: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772478670/WPC_Decking_Teak_Colour.png", bgColor: "bg-[#e8ebf5]" },
  { id: 8, name: "SPC Flooring", href: "/products/spc-flooring", icon: LayoutGrid, iconImage:"/spc.png", iconSize: "w-7 h-7", image: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1774612492/screenshot-2024-11-05-074302-YKb68R7lNDueGKEV.jpg", variantImage: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775452465/G-F_SPC_295.avif", bgColor: "bg-[#f5e8e8]" },
  { id: 9, name: "Laminate Flooring", href: "/products/laminate-flooring", icon: Layers, iconSize: "w-7 h-7", image: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775544853/oak_color_laminate_flooring_installed_images.png", variantImage: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775544840/walnut_color_laminate_flooring.png", bgColor: "bg-[#e8f5ed]" },
  { id: 10, name: "Herringbone", href: "/products/herringbone-laminate-flooring", icon: Grid2X2,iconImage:"/heringbone.png", iconSize: "w-7 h-7", image: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775411703/Luxury_Penthouse_Living_Room_with_Light_Oak_Herringbone_Flooring_Gurugram.jpg", variantImage: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775464991/G-F_HB_5001.avif", bgColor: "bg-[#f5f2e8]" },
  { id: 11, name: "Hybrid Flooring", href: "/products/hybrid-laminate-flooring", icon: Box, iconImage:"/hybrid.png", iconSize: "w-7 h-7", image: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772477090/Ocean_Waterproof_Laminate_FLooring.jpg", variantImage: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775465683/Smartline_101.avif", bgColor: "bg-[#e8eef5]" },
  { id: 12, name: "Baffle Ceiling", href: "/products/wpc-baffle-ceiling", icon: GripHorizontal, iconImage:"/baffle.png", iconSize: "w-7 h-7", image: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775466342/screenshot-2024-10-27-180236-1-AQEyyylJkGUBqyED.webp", variantImage: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772478728/WPC_BAFFLE_CEILING.png", bgColor: "bg-[#f2e8f5]" },
  { id: 13, name: "Timber Tubes", href: "/products/wpc-timber-tubes", icon: Pause, iconImage:"/timber.png", iconSize: "w-7 h-7", image: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772478739/Timber_Tube.png", variantImage: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772478751/cobra_walnut_wpc_timber_tubes.png", bgColor: "bg-[#f5e8ed]" },
];

export default function QuickCategoryGrid() {
  const [isSticky, setIsSticky] = useState(false);
  const gridRef = useRef<HTMLElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  // Initialize infinite scroll position to the middle set
  useEffect(() => {
    if (marqueeRef.current) {
      // Small timeout to ensure layout is complete before calculating scrollWidth
      setTimeout(() => {
        if (marqueeRef.current) {
          marqueeRef.current.scrollLeft = (marqueeRef.current.scrollWidth / 14) * 6;
        }
      }, 100);
    }
  }, []);

  const handleInfiniteScroll = () => {
    if (!marqueeRef.current) return;
    const el = marqueeRef.current;
    const totalSets = 14;
    const setWidth = el.scrollWidth / totalSets;
    
    // If getting close to the right edge (within 2 sets of the end)
    if (el.scrollLeft + el.clientWidth >= el.scrollWidth - (setWidth * 2)) {
      el.scrollLeft -= setWidth * 4;
    }
    // If getting close to the left edge (within 2 sets of the beginning)
    else if (el.scrollLeft <= setWidth * 2) {
      el.scrollLeft += setWidth * 4;
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (gridRef.current) {
        // Get the bottom position of the entire grid section
        const rect = gridRef.current.getBoundingClientRect();
        // Trigger only when the user has completely scrolled past the component.
        // rect.bottom is the bottom edge of the grid. If it's less than 60px (approx navbar height), it's fully scrolled past.
        if (rect.bottom < 100) {
          setIsSticky(true);
        } else {
          setIsSticky(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* The main Grid Section */}
      <section ref={gridRef} className="pt-10 pb-10 sm:pt-12 sm:pb-10 bg-white dark:bg-slate-900 relative z-10">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mb-6 tracking-tight text-center sm:text-left px-2 sm:px-0">
            Shop by Category
          </h2>

          <div className="grid grid-cols-3 sm:flex sm:flex-wrap sm:justify-center gap-x-2 gap-y-6 sm:gap-x-8 sm:gap-y-10">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                href={category.href || "#"}
                className={`flex flex-col items-center group cursor-pointer w-full sm:w-[100px] md:w-[120px] ${
                  index === categories.length - 1 && categories.length % 3 === 1 
                    ? "col-start-2 sm:col-auto" 
                    : ""
                }`}
              >
                <div
                  className={`w-[95%] aspect-square max-w-[110px] sm:max-w-none sm:w-[100px] sm:h-[100px] md:w-[120px] md:h-[120px] rounded-[24px] ${category.bgColor} dark:bg-slate-800 flex items-center justify-center relative overflow-hidden transition-transform duration-300 group-hover:scale-105 border-0 shadow-sm`}
                >
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover mix-blend-multiply dark:mix-blend-normal hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <span className="text-[12px] sm:text-sm font-semibold text-center text-gray-800 dark:text-gray-200 leading-[1.2] mt-2 sm:mt-3 px-1 w-full">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Sticky Mini Category Bar (Appears under Navbar) */}
      <div
        className={`fixed top-[56px] left-0 w-full z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800 transition-all duration-300 ${
          isSticky ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="w-full relative">
          <div 
            ref={marqueeRef}
            onScroll={handleInfiniteScroll}
            className="flex w-full overflow-x-auto hide-scrollbar items-center py-3"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {/* Render 14 identical sets to allow bidirectional infinite manual scrolling on any screen size */}
            {[...Array(14)].map((_, setIndex) => (
              <div key={`set-${setIndex}`} className="flex gap-6 sm:gap-8 items-center pr-6 sm:pr-8 flex-shrink-0">
                {categories.map((category, index) => (
                  <Link
                    key={`${setIndex}-${category.id}`}
                    href={category.href || "#"}
                    className="flex flex-col items-center flex-shrink-0 gap-1.5 group cursor-pointer"
                  >
                    <div 
                      className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full dark:bg-slate-800 flex items-center justify-center transition-transform group-hover:scale-110 overflow-hidden relative border-2 border-white dark:border-slate-800 ${
                        [
                          "[--glow-color:theme(colors.pink.500)] border-pink-100", 
                          "[--glow-color:theme(colors.blue.500)] border-blue-100", 
                          "[--glow-color:theme(colors.emerald.500)] border-emerald-100",
                          "[--glow-color:theme(colors.amber.500)] border-amber-100", 
                          "[--glow-color:theme(colors.purple.500)] border-purple-100", 
                          "[--glow-color:theme(colors.rose.500)] border-rose-100",
                          "[--glow-color:theme(colors.cyan.500)] border-cyan-100", 
                          "[--glow-color:theme(colors.fuchsia.500)] border-fuchsia-100", 
                          "[--glow-color:theme(colors.lime.500)] border-lime-100",
                          "[--glow-color:theme(colors.orange.500)] border-orange-100", 
                          "[--glow-color:theme(colors.indigo.500)] border-indigo-100", 
                          "[--glow-color:theme(colors.teal.500)] border-teal-100",
                          "[--glow-color:theme(colors.red.500)] border-red-100"
                        ][index % 13]
                      }`}
                      style={{ boxShadow: '0 0 15px var(--glow-color)' }}
                    >
                      <Image src={category.variantImage || category.image} alt={category.name} fill sizes="48px" className="object-cover" />
                    </div>
                    <span className="text-[10px] sm:text-xs font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      {category.name}
                    </span>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
