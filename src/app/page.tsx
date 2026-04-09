"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { 
  motion, 
  AnimatePresence,
  useMotionValue, 
  useSpring, 
  useTransform,
} from "framer-motion";
import { ArrowRight, Clock, ShieldCheck, Trophy, Truck, Users, CheckCircle2 } from "lucide-react";
import Counter from "@/components/Counter";
import Testimonials from "@/components/Testimonials";
import BrandMarquee from "@/components/BrandMarquee";
import CategoryFlipCards from "@/components/home/CategoryFlipCards";



// ================= INTERACTIVE 3D MONOLITH COMPONENT =================
function GetAQuoteMonolith() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Mouse tracking motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for the 3D effect
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { damping: 20, stiffness: 150 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { damping: 20, stiffness: 150 });
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative py-16 md:py-24 px-4 overflow-hidden bg-gray-50 dark:bg-slate-950 transition-colors duration-500 flex items-center justify-center min-h-[600px] md:min-h-[800px]"
    >
      {/* Background Decor Elements (Floating 3D-like shapes) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            y: [0, -20, 0], 
            rotate: [0, 45, 0],
            scale: [1, 1.1, 1] 
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[15%] w-32 h-32 bg-amber-500/10 dark:bg-amber-500/5 blur-3xl rounded-full"
        />
        <motion.div 
          animate={{ 
            y: [0, 30, 0], 
            rotate: [0, -30, 0],
            scale: [1, 0.9, 1] 
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[20%] right-[10%] w-64 h-64 bg-slate-200/50 dark:bg-slate-800/20 blur-3xl rounded-full"
        />
        
        {/* Floating Architectural Lines */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1, x: [0, 100, 0], y: [0, -50, 0] }}
            transition={{ duration: 15 + i * 2, repeat: Infinity, ease: "linear" }}
            className="absolute h-px bg-amber-600 w-96 origin-left"
            style={{ 
              top: `${20 + i * 15}%`, 
              left: `${-10 + i * 5}%`,
              transform: `rotate(${15 + i * 10}deg)`
            }}
          />
        ))}
      </div>

      {/* The 3D Monolith Card */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full max-w-4xl z-10"
      >
        <div 
          style={{ transform: "translateZ(80px)" }}
          className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-3xl border-2 border-gray-200/50 dark:border-slate-700/50 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2),0_10px_30px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_0_50px_-12px_rgba(251,191,36,0.1)] px-6 py-10 md:p-16 rounded-sm relative overflow-hidden group"
        >
          {/* Subtle Inner Glow */}
          <div className="absolute -inset-px bg-gradient-to-br from-amber-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
            
            {/* Left Content */}
            <div style={{ transform: "translateZ(40px)" }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-6 border border-amber-200 dark:border-amber-800/50">
                Premium Consultation
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 uppercase tracking-tight leading-[0.95]">
                Request a <br />
                <span className="text-amber-600 italic">Site Visit</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-8 font-light">
                Let our experts bring the showroom to you. Digital precision measurements and architectural texture sampling at your convenience.
              </p>

              <div className="space-y-4">
                {[
                  { icon: ShieldCheck, text: "Official 10-Year Warranty Coverage" },
                  { icon: Clock, text: "2-Hour Initial Expert Response" },
                  { icon: CheckCircle2, text: "Zero Cost Site Measurement" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 font-medium">
                    <item.icon className="w-4 h-4 text-amber-500" />
                    {item.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Premium Normal Button */}
            <div 
              style={{ transform: "translateZ(60px)" }}
              className="relative flex flex-col items-center justify-center min-h-0 py-8 md:py-0 md:min-h-[400px] overflow-hidden"
            >
              {/* Technical Grid Background */}
              <div className="absolute inset-4 border border-amber-500/10 pointer-events-none opacity-40 dark:opacity-20" 
                   style={{ background: "radial-gradient(circle at 10% 10%, rgba(251,191,36,0.1) 0%, transparent 1%), radial-gradient(circle at 90% 90%, rgba(251,191,36,0.1) 0%, transparent 1%)", backgroundSize: "20px 20px" }} />
              
              {/* Floating Material Swatches (Interacting with the 3D space) */}
              {[
                { z: 100, x: -80, y: -60, label: "Oak Wood", color: "bg-amber-100/50 dark:bg-amber-900/30" },
                { z: 120, x: 100, y: 70, label: "Stone", color: "bg-slate-200/50 dark:bg-slate-800/40" },
                { z: 90, x: 70, y: -80, label: "Ref: GL-24", color: "bg-amber-500/10 dark:bg-amber-500/5" },
              ].map((swatch, i) => (
                <motion.div
                  key={i}
                  style={{ 
                    transform: `translateZ(${swatch.z}px)`,
                    left: `calc(50% + ${swatch.x}px)`, 
                    top: `calc(50% + ${swatch.y}px)` 
                  }}
                  animate={{ 
                    y: [0, 10, 0],
                    rotate: [0, i % 2 === 0 ? 5 : -5, 0]
                  }}
                  transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
                  className={`absolute w-12 h-12 ${swatch.color} border border-amber-500/20 rounded-sm flex flex-col items-center justify-center backdrop-blur-sm shadow-sm pointer-events-none`}
                >
                  <div className="w-4 h-px bg-amber-500/30 mb-1" />
                  <span className="text-[6px] font-bold text-amber-600/50 uppercase tracking-tighter leading-none px-1 text-center">
                    {swatch.label}
                  </span>
                </motion.div>
              ))}

              {/* Interactive Coordinate Tracker */}
              <motion.div 
                className="absolute pointer-events-none z-0 hidden lg:flex flex-col items-start gap-1"
                style={{ 
                  left: useTransform(mouseX, [-0.5, 0.5], ["30%", "70%"]),
                  top: useTransform(mouseY, [-0.5, 0.5], ["30%", "70%"]),
                  transform: "translateZ(30px)"
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-16 h-px bg-amber-500/40" />
                  <div className="w-1 h-1 bg-amber-500 rounded-full" />
                </div>
                <div className="flex flex-col ml-16 mt-1">
                  <motion.span className="text-[7px] font-black text-amber-600 dark:text-amber-500 font-mono tracking-widest bg-white/50 dark:bg-slate-900/50 px-1 backdrop-blur-md">
                    X: <motion.span>{useTransform(mouseX, [-0.5, 0.5], ["3.42", "7.18"])}</motion.span>
                  </motion.span>
                  <motion.span className="text-[7px] font-black text-amber-600 dark:text-amber-500 font-mono tracking-widest bg-white/50 dark:bg-slate-900/50 px-1 backdrop-blur-md">
                    Y: <motion.span>{useTransform(mouseY, [-0.5, 0.5], ["5.12", "1.92"])}</motion.span>
                  </motion.span>
                </div>
              </motion.div>

              <Link 
                href="/contact" 
                className="group shine-btn relative z-10 flex items-center gap-3 bg-amber-600 hover:bg-amber-700 text-white px-10 py-5 rounded-full text-xs font-black uppercase tracking-[0.3em] transition-all duration-300 shadow-2xl shadow-amber-600/20 active:scale-95 w-fit overflow-hidden"
              >
                {/* Button Shine effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                <span className="relative z-10 flex items-center gap-3">
                  Consult with Experts
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>

              {/* Decorative accent for the 3D depth */}
              <div 
                style={{ transform: "translateZ(-20px)" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-600/10 -z-10 rounded-full blur-[120px]"
              />
            </div>
          </div>
        </div>

        {/* 3D floating "Samples" or "Chips" indicators (Visual Fluff) */}
        <motion.div
           style={{ transform: "translateZ(120px)" }}
           className="absolute -top-12 -left-12 w-24 h-32 bg-amber-600 hidden xl:flex items-center justify-center shadow-2xl rounded-sm"
           animate={{ y: [0, 10, 0] }}
           transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="text-white font-black text-4xl leading-none px-4">GF</div>
        </motion.div>
      </motion.div>
    </section>
  );
}



const desktopHeroImages = [
  {
    src: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto,w_1920/v1775573402/Goals_Floors_Premium_Wall_Panel.png",
    alt: "Premium Wall Panel by Goals Floors"
  },
  {
    src: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto,w_1920/v1775573402/Wpc_Baffle_For_Ceiling.png",
    alt: "WPC Baffle For Ceiling"
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
    src: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto,w_800/v1775749408/Goals_Floors_Wall_Panels.png",
    alt: "Premium Wall Panels"
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
    src: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto,w_800/v1775749425/Goals_Floors_Wpc_Exterior_Louvers.png",
    alt: "WPC Exterior Louvers"
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

export default function Home() {
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
    <div className="flex flex-col min-h-screen">

      {/* ================= LOCAL BUSINESS JSON-LD (SEO) ================= */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HomeAndConstructionBusiness",
            "name": "Goals Floors",
            "alternateName": "Goals Floors India",
            "url": "https://goalsfloors.com",
            "logo": "https://goalsfloors.com/icon.svg",
            "image": "https://res.cloudinary.com/dcezlxt8r/image/upload/v1775573402/Goals_Floors_Premium_Wall_Panel.png",
            "description": "Goals Floors is India's fastest growing premium brand for Wall Panels, WPC Louvers, Charcoal Moulding, SPC Flooring, and Architectural Finishes in Delhi NCR, Gurugram, Noida, and Faridabad.",
            "telephone": "+91-7217644573",
            "email": "goalsfloors@gmail.com",
            "priceRange": "₹₹",
            "currenciesAccepted": "INR",
            "paymentAccepted": "Cash, Credit Card, UPI, Bank Transfer",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "H-36/27A, H-Block, Sikanderpur, DLF Phase-1",
              "addressLocality": "Gurugram",
              "addressRegion": "Haryana",
              "postalCode": "122002",
              "addressCountry": "IN"
            },
            "hasMap": "https://www.google.com/maps/dir//Goals+Floors,+H-36%2F27A,+H-Block,+Sikanderpur,+DLF+Phase-1,+Gurugram,+Haryana+122002",
            "openingHoursSpecification": [
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                "opens": "09:30",
                "closes": "19:00"
              }
            ],
            "areaServed": [
              { "@type": "City", "name": "Gurugram" },
              { "@type": "City", "name": "Delhi" },
              { "@type": "City", "name": "Noida" },
              { "@type": "City", "name": "Faridabad" },
              { "@type": "City", "name": "Ghaziabad" }
            ],
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Wall Panels & Flooring Products",
              "itemListElement": [
                { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Tokyo Charcoal Moulding" } },
                { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "WPC Fluted Panels" } },
                { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "SPC Flooring" } },
                { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "WPC Exterior Louvers" } },
                { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Cobra PU Stone Panels" } },
                { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "WPC Baffle Ceiling" } },
                { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Artificial Grass" } }
              ]
            },
            "sameAs": [
              "https://www.instagram.com/goalsfloors"
            ],
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "200",
              "bestRating": "5"
            }
          })
        }}
      />

      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-[500px] sm:min-h-[600px] md:min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Carousel */}
        <div className="absolute inset-0 z-0 bg-black overflow-hidden">
          
          {/* Desktop Carousel (5 images) */}
          <div className="hidden md:block absolute inset-0">
            <AnimatePresence initial={false}>
              <motion.div
                key={desktopIndex}
                initial={{ opacity: 0, scale: 1 }}
                animate={{ opacity: 0.7, scale: 1.25 }}
                exit={{ opacity: 0 }}
                transition={{ 
                  opacity: { duration: 1.5, ease: "easeInOut" },
                  scale: { duration: 6, ease: "linear" }
                }}
                className="absolute inset-0 origin-center"
              >
                <Image
                  src={desktopHeroImages[desktopIndex].src}
                  alt={desktopHeroImages[desktopIndex].alt}
                  fill
                  sizes="100vw"
                  priority
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Mobile Carousel (7 images) */}
          <div className="block md:hidden absolute inset-0">
            <AnimatePresence initial={false}>
              <motion.div
                key={mobileIndex}
                initial={{ opacity: 0, scale: 1 }}
                animate={{ opacity: 0.7, scale: 1.25 }}
                exit={{ opacity: 0 }}
                transition={{ 
                  opacity: { duration: 1.5, ease: "easeInOut" },
                  scale: { duration: 6, ease: "linear" }
                }}
                className="absolute inset-0 origin-center"
              >
                <Image
                  src={mobileHeroImages[mobileIndex].src}
                  alt={mobileHeroImages[mobileIndex].alt}
                  fill
                  sizes="100vw"
                  priority
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Transition Fog / Overlay */}
          <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-white/90 via-white/50 to-transparent z-10 dark:from-slate-950/90 dark:via-slate-950/50 transition-colors duration-700" />
          
          {/* Subtle top vignette for better navbar visibility */}
          <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/60 to-transparent z-0" />
          
          {/* Luxury Radial Gradient Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/20 to-black/70 z-0 pointer-events-none" />
        </div>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2 }
            }
          }}
          className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-10 pb-24 md:py-20"
        >
          {/* USP Badge */}
          <motion.div 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white mb-8 shadow-xl"
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
            className="mt-6 text-base sm:text-lg md:text-xl text-gray-200 max-w-4xl mx-auto font-light leading-relaxed mb-10 text-shadow-md"
          >
            Unmatched Quality in Wall Panels & Flooring | 90% Warranty Backed | 400+ Partners | 2-Hour Express Material Supply in Gurgaon & NCR.
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
              {/* Shimmer effect */}
              <span className="absolute inset-0 bg-white/20 w-1/2 -skew-x-12 -translate-x-full group-hover:translate-x-[250%] transition-transform duration-1000 ease-in-out"></span>
              <span className="relative flex items-center gap-2">
                Get a Free Quote
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            <Link
              href="#categories"
              className="flex items-center gap-2 bg-black/40 backdrop-blur-md hover:bg-white/10 border border-white/30 hover:border-amber-500/50 text-white px-8 py-4 text-sm font-semibold uppercase tracking-widest transition-all duration-300 w-full sm:w-auto justify-center rounded-sm"
            >
              Explore Collection
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ================= STATS BAR ================= */}
      <div className="bg-white dark:bg-slate-900 py-8 border-b border-gray-100 dark:border-gray-800 relative z-20 -mt-10 mx-4 sm:mx-8 lg:mx-auto max-w-6xl shadow-2xl dark:shadow-none transition-colors duration-300">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 px-4 md:px-6">
          {[
            { label: "Premium Products", value: "2500+" },
            { label: "Happy Clients", value: "20K+" },
            { label: "Dealer Network", value: "400+" },
            { label: "Warranty Backed", value: "90%" },
          ].map((stat, i) => (
            <div key={i} className="text-center overflow-hidden px-1">
              <Counter
                value={stat.value}
                className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white"
              />
              <div className="text-[9px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider md:tracking-widest mt-2 whitespace-nowrap">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= CATEGORIES SECTION ================= */}
      <section id="categories" className="py-10 bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-black text-gray-900 dark:text-white mb-4 tracking-tighter uppercase leading-[0.9]">
              Explore Our <br />
              <span className="text-amber-500 italic">Collections</span>
            </h2>
            <p className="text-gray-500 dark:text-slate-400 max-w-xl mx-auto text-sm font-medium tracking-wide">
              Discover world-class interior and exterior architectural solutions crafted for premium Gurugram homes.
            </p>
          </div>

          <CategoryFlipCards />
        </div>
      </section>


      {/* ================= WHY CHOOSE US ================= */}
      <section className="pt-8 pb-24 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-[28px] sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 tracking-tighter whitespace-nowrap">The Goals Floors Advantage</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed text-justify">We don&apos;t just supply surfaces; we deliver the speed, scale, and innovation that your luxury projects deserve.</p>

              {/* Mobile Image - Shown only on small screens */}
              <div className="relative h-64 w-full mb-8 lg:hidden rounded-sm overflow-hidden shadow-xl">
                <Image
                  src="https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775749408/Goals_Floors_Fluted_Panel.jpg"
                  alt="Professional interior wood flooring and wall paneling installation in Gurugram and Delhi NCR - Goals Floors Architectural Excellence" fill sizes="100vw" className="object-cover"
                />
              </div>

              <div className="space-y-6">
                {[
                  { icon: Truck, title: "120-Minute Express Dispatch", desc: "NCR’s fastest logistics ensure your material reaches the site in Gurgaon & NCR within just 2 hours. We value your time so your project never hits a standstill." },
                  { icon: Trophy, title: "2500+ Designs | 400+ Dealers", desc: "Explore India’s most expansive curated collection. Our massive distributor network ensures project pricing and immediate stock availability for any project size." },
                  { icon: CheckCircle2, title: "Quarterly New Product Launches", desc: "Stay ahead of global trends. We refresh our catalog every 3-4 months, bringing the latest international textures in Wall Panels and Flooring to Gurgaon first." },
                  { icon: ShieldCheck, title: "90% Our Products are Warranty Backed Quality", desc: "Transparency over tall claims. Over 90% of our product range comes with official manufacturer warranties, ensuring long-term performance and total peace of mind." },
                  { icon: Users, title: "Professional Technical Guidance", desc: "Beyond supply, we are your technical partners. Our experts provide precise advice on material suitability, helping you choose the perfect finish for every space." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-amber-700 dark:text-amber-500">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 text-justify leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side large image - Hidden on mobile, shown on desktop */}
            <div className="relative h-[600px] rounded-sm overflow-hidden shadow-2xl hidden lg:block">
              <Image
                src="https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775749408/Goals_Floors_Fluted_Panel.jpg"
                alt="Professional interior wood flooring and wall paneling installation in Gurugram and Delhi NCR - Goals Floors Architectural Excellence" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <BrandMarquee />

      <Testimonials />

      <GetAQuoteMonolith />


    </div>
  );
}