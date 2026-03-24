"use client";

import Image from "next/image";

export default function BrandMarquee() {
  const brands = [
    { name: "Bharat Petroleum", src: "/brand logo/Bharat_Petroleum.svg" },
    { name: "Darpan Puri", src: "/brand logo/DARPAN_PURI-removebg-preview.png", scale: 1.4, invertInDark: true },
    { name: "Tata Motors", src: "/brand logo/Tata-Motors.png" },
    { name: "Palette Designs", src: "/brand logo/palette-designs-removebg-preview.png" },
    { name: "Realme", src: "/brand logo/realmi.svg" },
    { name: "Taj Palace", src: "/brand logo/taj-palace-hotel-removebg-preview.png" },
    { name: "Urban Homes", src: "/brand logo/urban-homes-removebg-preview.png", scale: 1.5 },
    { name: "Vikash Builders", src: "/brand logo/vikash-builders-removebg-preview.png", scale: 1.4, invertInDark: true },
    { name: "Vivo", src: "/brand logo/vivo-removebg-preview.png", scale: 1.3 },
  ];

  // Double the array for infinite scroll
  const scrollingBrands = [...brands, ...brands];

  return (
    <section className="py-10 bg-gray-50 dark:bg-slate-950 border-t border-gray-100 dark:border-gray-800 overflow-hidden transition-colors duration-300">
      {/* Inline CSS for Marquee Animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: fit-content;
          animation: scroll 40s linear infinite;
        }
        @media (max-width: 768px) {
          .animate-marquee {
            animation-duration: 20s;
          }
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight uppercase transition-colors duration-300">
            Trusted By Leading Corporate & Govt Sector
          </h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto mt-4"></div>
        </div>
      </div>

      {/* Infinite Scrolling Logos */}
      <div className="relative w-full overflow-hidden bg-white dark:bg-slate-950 py-12 border-y border-gray-100 dark:border-gray-800 transition-colors duration-300">
        <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-white dark:from-slate-950 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-white dark:from-slate-950 to-transparent z-10 pointer-events-none"></div>

        <div className="animate-marquee flex items-center gap-12 md:gap-24 px-12">
          {scrollingBrands.map((brand: { name: string; src: string; scale?: number; invertInDark?: boolean }, i) => (
            <div 
              key={i} 
              className="group flex-shrink-0 w-32 h-16 md:w-48 md:h-24 relative opacity-90 hover:opacity-100 transition-all duration-300 cursor-pointer flex items-center justify-center p-2"
            >
              <Image 
                src={brand.src} 
                alt={brand.name} 
                fill 
                className={`object-contain transition-transform duration-300 opacity-80 dark:opacity-100 group-hover:scale-110 ${brand.invertInDark ? 'dark:invert' : ''}`} 
                style={{ transform: `scale(${brand.scale || 1})` }}
                sizes="(max-width: 768px) 128px, 192px"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
