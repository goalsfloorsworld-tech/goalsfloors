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
  { id: 1, name: "Wall Panels", icon: Columns2, iconImage: "/panels.png", iconSize: "w-7 h-7", image: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772477058/Wpc_Fluted_Panel_In_Gurgaon.png", bgColor: "bg-[#e8f3f1]" },
  { id: 2, name: "Upfit Panels", icon: Columns3, iconImage: "/upfit.png", iconSize: "w-8 h-8", image: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1774525633/goals-floors-upfit-panels-m7Vw49PE2qSaDNaG.jpg", bgColor: "bg-[#f4efe8]" },
  { id: 3, name: "Tokyo Moulding", icon: AlignLeft, iconImage: "/moulding.png", iconSize: "w-7 h-7", image: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1774970794/charcoal-gray_paneled_wall..jpg", bgColor: "bg-[#e8f1f5]" },
  { id: 4, name: "Cobra PU Stone", icon: Mountain, iconSize: "w-7 h-7", image: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772477246/Pu_Stone_Colors.jpg", bgColor: "bg-[#f5eef4]" },
  { id: 5, name: "Exterior Louvers", icon: AlignJustify, iconImage: "/louvers.png", iconSize: "w-7 h-7", image: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775818177/exterior_louvaring.jpg", bgColor: "bg-[#edf5e8]" },
  { id: 6, name: "Artificial Grass", icon: Leaf, iconImage: "/grass.png", iconSize: "w-7 h-7", image: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772476444/artificial_grass_supplier_in_india.jpg", bgColor: "bg-[#f5ece8]" },
  { id: 7, name: "WPC Decking", icon: Sun, iconImage: "/decking.png", iconSize: "w-8 h-8", image: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772478659/premium_wpc_decking_supplier_in_gurgaon.jpg", bgColor: "bg-[#e8ebf5]" },
  { id: 8, name: "SPC Flooring", icon: LayoutGrid, iconImage:"/spc.png", iconSize: "w-7 h-7", image: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1774612492/screenshot-2024-11-05-074302-YKb68R7lNDueGKEV.jpg", bgColor: "bg-[#f5e8e8]" },
  { id: 9, name: "Laminate Flooring", icon: Layers, iconSize: "w-7 h-7", image: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775544853/oak_color_laminate_flooring_installed_images.png", bgColor: "bg-[#e8f5ed]" },
  { id: 10, name: "Herringbone", icon: Grid2X2,iconImage:"/heringbone.png", iconSize: "w-7 h-7", image: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775411703/Luxury_Penthouse_Living_Room_with_Light_Oak_Herringbone_Flooring_Gurugram.jpg", bgColor: "bg-[#f5f2e8]" },
  { id: 11, name: "Hybrid Flooring", icon: Box, iconImage:"/hybrid.png", iconSize: "w-7 h-7", image: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772477090/Ocean_Waterproof_Laminate_FLooring.jpg", bgColor: "bg-[#e8eef5]" },
  { id: 12, name: "Baffle Ceiling", icon: GripHorizontal, iconImage:"/baffle.png", iconSize: "w-7 h-7", image: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775466342/screenshot-2024-10-27-180236-1-AQEyyylJkGUBqyED.webp", bgColor: "bg-[#f2e8f5]" },
  { id: 13, name: "Timber Tubes", icon: Pause, iconImage:"/timber.png", iconSize: "w-7 h-7", image: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772478739/Timber_Tube.png", bgColor: "bg-[#f5e8ed]" },
];

export default function QuickCategoryGrid() {
  const [isSticky, setIsSticky] = useState(false);
  const gridRef = useRef<HTMLElement>(null);

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mb-6 tracking-tight text-center sm:text-left">
            Shop by Category
          </h2>

          <div className="flex flex-wrap justify-center gap-y-6 sm:gap-x-8 sm:gap-y-10">
            {categories.map((category) => (
              <Link
                key={category.id}
                href="#"
                className="flex flex-col items-center group cursor-pointer w-1/4 sm:w-[100px] md:w-[120px]"
              >
                <div
                  className={`w-[68px] h-[68px] sm:w-[100px] sm:h-[100px] md:w-[120px] md:h-[120px] rounded-[18px] sm:rounded-[24px] ${category.bgColor} dark:bg-slate-800 flex items-center justify-center relative overflow-hidden transition-transform duration-300 group-hover:scale-105 border-0 shadow-sm`}
                >
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover mix-blend-multiply dark:mix-blend-normal hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <span className="text-[10px] sm:text-sm font-semibold text-center text-gray-800 dark:text-gray-200 leading-[1.2] mt-2 sm:mt-3 px-1 w-full">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto hide-scrollbar py-3 gap-6 sm:gap-8 items-center">
            {categories.map((category) => (
              <Link
                key={category.id}
                href="#"
                className="flex flex-col items-center flex-shrink-0 gap-1.5 group cursor-pointer"
              >
                <div className={`w-10 h-10 rounded-full ${category.bgColor} dark:bg-slate-800 flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm overflow-hidden`}>
                  {category.iconImage ? (
                    <div className={`relative ${category.iconSize || "w-7 h-7"}`}>
                      <Image src={category.iconImage} alt={category.name} fill className={`object-contain ${category.iconImage.includes('moulding') ? 'invert dark:invert-0' : 'dark:invert'}`} />
                    </div>
                  ) : (
                    <category.icon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  )}
                </div>
                <span className="text-[10px] sm:text-xs font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
