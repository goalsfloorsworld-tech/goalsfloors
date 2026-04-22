"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import { ArrowRight, Clock, ShieldCheck, Trophy, Truck, Users, CheckCircle2 } from "lucide-react";

// Dynamically import heavy components below the fold
const Counter = dynamic(() => import("@/components/Counter"), { ssr: false });
const Testimonials = dynamic(() => import("@/components/Testimonials"), { ssr: false });
const BrandMarquee = dynamic(() => import("@/components/BrandMarquee"), { ssr: false });
const CategoryFlipCards = dynamic(() => import("@/components/home/CategoryFlipCards"), { ssr: false });
const GetAQuoteMonolith = dynamic(() => import("@/components/home/GetAQuoteMonolith"), { ssr: false });



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
    src: "https://res.cloudinary.com/dcezlxt8r/image/upload/v1776858154/premium_wall_panels_in_gurugram.png",
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
                { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Wall Panels" } },
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
      />      {/* ================= HERO SECTION ================= */}
      <section suppressHydrationWarning className="relative min-h-[500px] sm:min-h-[600px] md:min-h-[65vh] flex items-center justify-center overflow-hidden">
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
                  transform: i === desktopIndex ? "scale(1.05)" : "scale(1)",
                  transition: "opacity 1s ease-in-out, transform 5s linear",
                }}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  priority={i === 0}
                  className="object-cover"
                  sizes="100vw"
                />
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
                  transform: i === mobileIndex ? "scale(1.05)" : "scale(1)",
                  transition: "opacity 1s ease-in-out, transform 5s linear",
                }}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  priority={i === 0}
                  className="object-cover"
                  sizes="100vw"
                />
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
          className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-10 pb-20 md:pt-24 md:pb-40 flex flex-col items-center"
        >
          {/* USP Badge */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}
            className="sm:relative absolute top-10 left-1/2 -translate-x-1/2 sm:top-0 sm:left-0 sm:translate-x-0 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white mb-12 sm:mb-8 shadow-xl z-50 whitespace-nowrap w-fit"
          >
            <Clock className="w-4 h-4 text-amber-500" />
            <span className="text-xs sm:text-sm font-medium tracking-widest uppercase shadow-sm">2-Hour Express Delivery in NCR</span>
          </motion.div>

          <div className="flex flex-col items-center justify-center flex-1 py-20">
            {/* Headline - Thinner, more elegant font */}
            <motion.h1
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}
              className="text-3xl sm:text-4xl md:text-6xl font-semibold text-white mb-6 tracking-tight leading-[1.1] drop-shadow-2xl px-2 pt-5 relative"
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
              className="mt-6 text-base sm:text-lg md:text-xl text-gray-200 max-w-4xl mx-auto font-light leading-relaxed mb-12 sm:mb-10 pt-2 text-shadow-md"
            >
              Unmatched Quality in Wall Panels & Flooring | 90% Warranty Backed | 400+ Dealers | 2-Hour Express Material Supply in Gurgaon & NCR.
            </motion.p>
          </div>

          {/* CTAs */}
          <motion.div
            variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } } }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4 sm:px-0 mt-auto"
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
              href="/products"
              className="flex items-center gap-2 bg-black/40 backdrop-blur-md hover:bg-white/10 border border-white/30 hover:border-amber-500/50 text-white px-8 py-4 text-sm font-semibold uppercase tracking-widest transition-all duration-300 w-full sm:w-auto justify-center rounded-sm"
            >
              Explore Collection
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ================= STATS BAR ================= */}
      <div className="bg-white dark:bg-slate-900 py-8 border-b border-gray-100 dark:border-gray-800 relative z-20 -mt-8 sm:-mt-12 lg:-mt-14 mx-4 sm:mx-8 lg:mx-auto max-w-6xl shadow-[0_30px_70px_rgba(0,0,0,0.15)] dark:shadow-none transition-colors duration-300 rounded-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 px-4 md:px-6">
          {[
            { label: "Premium Products", value: "2500+" },
            { label: "Happy Clients", value: "20K+" },
            { label: "Dealers", value: "400+" },
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
      <section id="categories" className="py-20 pt-36 bg-gray-50 dark:bg-slate-950 transition-colors duration-300 -mt-24">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-stretch">
            <div>
              <h2 className="text-[28px] sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 tracking-tighter whitespace-nowrap">The Goals Floors Advantage</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed text-justify">We don&apos;t just supply surfaces; we deliver the speed, scale, and innovation that your luxury projects deserve.</p>

              {/* Mobile Image - Shown only on small screens */}
              <div className="relative h-[400px] w-full mb-10 lg:hidden group/img">
                {/* Intensified Background Glow for Mobile */}
                <div className="absolute -inset-6 bg-amber-500/30 blur-[60px] rounded-full opacity-60 animate-pulse" />

                <div className="relative h-full w-full rounded-sm overflow-hidden shadow-[0_0_50px_rgba(251,191,36,0.3)] z-10 transition-transform duration-500 group-hover/img:scale-[1.02]">
                  <Image
                    src="https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775749408/Goals_Floors_Fluted_Panel.jpg"
                    alt="Professional interior wood flooring and wall paneling installation in Gurugram and Delhi NCR - Goals Floors Architectural Excellence"
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="space-y-6">
                {[
                  { icon: Truck, title: "2-Hour Express Dispatch", desc: "NCR’s fastest logistics ensure your material reaches the site in Gurgaon & NCR within just 2 hours. We value your time so your project never hits a standstill." },
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
            <div className="relative h-full min-h-[600px] hidden lg:flex items-center justify-center">
              {/* Ultra-Bold Background Glow Effect */}
              <motion.div
                animate={{
                  scale: [1, 1.25, 1],
                  opacity: [0.4, 0.8, 0.4]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-amber-500/35 blur-[130px] rounded-full z-0"
              />

              <div className="relative h-full w-full rounded-sm overflow-hidden shadow-[0_0_100px_rgba(251,191,36,0.3)] z-10 group/img-desktop overflow-hidden transition-all duration-700 hover:shadow-[0_0_120px_rgba(251,191,36,0.5)]">
                <Image
                  src="https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775749408/Goals_Floors_Fluted_Panel.jpg"
                  alt="Professional interior wood flooring and wall paneling installation in Gurugram and Delhi NCR - Goals Floors Architectural Excellence"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-1000 group-hover/img-desktop:scale-110"
                />
              </div>
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
