"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";

const desktopHeroImages = [
  {
    src: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto,w_1920/v1775573402/Goals_Floors_Premium_Wall_Panel.png",
    alt: "Premium Wall Panel by Goals Floors"
  },
  {
    src: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto,w_800/v1775749408/Goals_Floors_Wall_Panels.png",
    alt: "Premium Wall Panels"
  },
  {
    src: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto,w_1920/v1775573399/Exterior_Louvers_For_Facade.png",
    alt: "Exterior Louvers For Facade"
  },
  {
    src: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto,w_1920/v1775573400/Laminate_Flooring_Grey_Color.png",
    alt: "Laminate Flooring Grey Color"
  },
  {
    src: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto,w_1920/v1775573398/Premium_Quality_Pu_Stones_For_Wall.png",
    alt: "Premium Quality PU Stones For Wall"
  }
];

const mobileHeroImages = [
  {
    src: "https://res.cloudinary.com/dcezlxt8r/image/upload/v1775749444/Spc_FlooringInstalled_In_Bedrooom.png",
    alt: "SPC Flooring Installed In Bedrooom"
  },
  {
    src: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto,w_800/v1775749408/Baffle_Ceiling.png",
    alt: "Modern Baffle Ceiling"
  },
  {
    src: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto,w_800/v1775749408/Premium_Grey_Color_Flooring.png",
    alt: "Premium Grey Flooring"
  },
  {
    src: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto,w_800/v1775749463/Goals_Floors_Herringbone_Flooring.png",
    alt: "Herringbone Flooring Design"
  },
  {
    src: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto,w_800/v1775749407/Latest_Herrignbone_Flooring_Design.png",
    alt: "Latest Herringbone Patterns"
  }
];

export default function HeroSection() {
  const [desktopIndex, setDesktopIndex] = useState(0);
  const [mobileIndex, setMobileIndex] = useState(0);

  // Auto-rotate hero images
  useEffect(() => {
    const dTimer = setInterval(() => {
      setDesktopIndex((prev) => (prev + 1) % desktopHeroImages.length);
    }, 5000);
    const mTimer = setInterval(() => {
      setMobileIndex((prev) => (prev + 1) % mobileHeroImages.length);
    }, 5000);
    return () => {
      clearInterval(dTimer);
      clearInterval(mTimer);
    };
  }, []);

  return (
    <section suppressHydrationWarning className="relative min-h-[500px] sm:min-h-[600px] md:min-h-[85vh] flex items-center justify-center overflow-hidden w-full max-w-full box-border">
      {/* Background Carousel */}
      <div className="absolute inset-0 z-0 bg-black overflow-hidden">
        {/* Desktop Images */}
        <div className="hidden md:block absolute inset-0">
          {desktopHeroImages.map((img, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${i === desktopIndex ? "opacity-70" : "opacity-0"
                }`}
              style={{
                transform: "scale(1)",
                transition: "opacity 1s ease-in-out, transform 5s linear",
              }}
            >
              {/* Load ONLY priority first image eagerly, lazy load the rest */}
              {(i === 0 || i === desktopIndex) && (
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  priority={i === 0}
                  loading={i === 0 ? undefined : "lazy"}
                  className="object-cover"
                  sizes="100vw"
                />
              )}
            </div>
          ))}
        </div>

        {/* Mobile Images */}
        <div className="md:hidden absolute inset-0">
          {mobileHeroImages.map((img, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${i === mobileIndex ? "opacity-70" : "opacity-0"
                }`}
              style={{
                transform: "scale(1)",
                transition: "opacity 1s ease-in-out, transform 5s linear",
              }}
            >
              {(i === 0 || i === mobileIndex) && (
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  priority={i === 0}
                  loading={i === 0 ? undefined : "lazy"}
                  className="object-cover"
                  sizes="100vw"
                />
              )}
            </div>
          ))}
        </div>

        {/* Luxury Radial Gradient Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/20 to-black/70 z-0 pointer-events-none" />

        {/* Decorative Bottom Glow Line - Intensified */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent z-20 shadow-[0_0_25px_rgba(251,191,36,0.8)]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[4px] bg-amber-400/40 blur-xl z-20" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-[8px] bg-amber-500/20 blur-2xl z-20" />
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
          }
        }}
        className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-10 pb-20 md:pt-24 md:pb-40 min-w-0"
      >
        {/* USP Badge */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white mb-12 sm:mb-8 shadow-xl"
        >
          <Clock className="w-4 h-4 text-amber-500" />
          <span className="text-xs sm:text-sm font-medium tracking-widest uppercase shadow-sm">2-Hour Express Delivery in NCR</span>
        </motion.div>

        {/* Headline - Thinner, more elegant font */}
        <motion.h1
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}
          className="text-3xl sm:text-4xl md:text-6xl font-semibold text-white mb-6 tracking-tight leading-[1.1] drop-shadow-2xl px-2 relative"
        >
          Goals Floors: India&apos;s <br />
          <span className="relative inline-block mt-2">
            {/* Intensified Multi-Layer Glow Effect */}
            <span className="absolute -inset-x-20 inset-y-0 bg-amber-500/40 blur-[100px] rounded-full -z-10 animate-pulse"></span>
            <span className="absolute -inset-x-10 inset-y-0 bg-yellow-400/20 blur-[40px] rounded-full -z-10 animate-pulse delay-700"></span>

            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-600 italic font-light pr-2 pb-1 md:whitespace-nowrap block sm:inline drop-shadow-[0_4px_40px_rgba(251,191,36,0.8)]">
              Fastest Growing Wall Panels & Flooring Brand
            </span>
          </span>
        </motion.h1>

        <motion.p
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}
          className="mt-6 text-base sm:text-lg md:text-xl text-gray-200 max-w-4xl mx-auto font-light leading-relaxed mb-12 sm:mb-10 text-shadow-md"
        >
          Unmatched Quality in Wall Panels & Flooring | 90% Warranty Backed | 400+ Dealers | 2-Hour Express Material Supply in Gurgaon & NCR.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } } }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4 sm:px-0"
        >
          <Link
            href="/contact"
            className="group relative overflow-hidden flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white px-8 py-4 text-sm font-semibold uppercase tracking-widest transition-all duration-500 w-full sm:w-auto justify-center shadow-[0_0_20px_rgba(217,119,6,0.5)] hover:shadow-[0_0_30px_rgba(217,119,6,0.8)] rounded-sm"
          >
            <span className="relative z-10 flex items-center gap-2">
              Book Free Consultation
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 group-hover:scale-110 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
          </Link>

          <Link
            href="/products"
            className="group flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-8 py-4 text-sm font-semibold uppercase tracking-widest transition-all duration-300 w-full sm:w-auto justify-center rounded-sm"
          >
            Explore Collection
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
