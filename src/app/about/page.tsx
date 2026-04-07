"use client";

import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform
} from "framer-motion";
import {
  ArrowRight, Star, Building2, Package, ShieldCheck,
  Globe2, Zap, HardHat, Ruler, MapPin, CheckCircle2,
  Target, Eye, Gem
} from "lucide-react";

// --- Premium Animation Variants ---
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as any } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any } }
};

const slideInRight = {
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] as any } }
};

const slideInLeft = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] as any } }
};

const floatingIcon = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as any
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any } }
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans antialiased selection:bg-amber-500/30">

      {/* ================= 1. DENSE HERO SECTION ================= */}
      <section className="relative py-10 overflow-hidden border-b border-gray-200 dark:border-gray-800">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-amber-500/5 to-transparent blur-[100px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-center">

            <motion.div variants={staggerContainer} initial="hidden" animate="visible">
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-500 text-[11px] font-bold uppercase tracking-widest mb-6 border border-amber-200 dark:border-amber-800/50">
                <Star className="w-3.5 h-3.5" />
                Est. 2005 • Gurugram, Delhi NCR
              </motion.div>

              <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-[1.05] mb-6 tracking-tight">
                Architectural Surfaces for <br className="hidden md:block" />
                <span className="text-amber-600">Visionary Spaces.</span>
              </motion.h1>

              <motion.p variants={fadeUp} className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-medium mb-8 max-w-2xl">
                Goals Floors is India's premier B2B importer and distributor of luxury interior and exterior surfaces. We empower architects, interior designers, and leading developers across NCR with a massive inventory of 2,500+ commercial-grade products, backed by industry-first 2-hour express dispatch.
              </motion.p>

              {/* Mobile Hero Images - Visible only on mobile, placed above buttons */}
              <motion.div variants={fadeUp} className="block lg:hidden relative h-[450px] w-full mb-10 overflow-hidden group">
                <motion.div
                  initial={{ scale: 1.1 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  className="absolute top-0 right-0 w-[75%] h-[80%] rounded-sm overflow-hidden border-4 border-white dark:border-slate-950 shadow-2xl z-10"
                >
                  <Image src="https://res.cloudinary.com/dcezlxt8r/image/upload/v1775221626/Premium_exterior_WPC_cladding_on_a_modern_luxury_building_in_Gurugram_-_Goals_Floors_Architectural_Solutions.jpg" alt="Premium exterior WPC cladding on a modern luxury building in Gurugram - Goals Floors Architectural Solutions" fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                </motion.div>
                <motion.div
                  initial={{ scale: 1.1, x: -20 }}
                  whileInView={{ scale: 1, x: 0 }}
                  transition={{ duration: 2, ease: "easeOut", delay: 0.2 }}
                  className="absolute bottom-10 left-0 w-[60%] h-[50%] rounded-sm overflow-hidden border-4 border-white dark:border-slate-950 shadow-xl z-20"
                >
                  <Image src="https://res.cloudinary.com/dcezlxt8r/image/upload/v1775221634/Luxury_modern_interior_with_premium_wooden_flooring_and_charcoal_fluted_panels_in_Delhi_NCR_-_Goals_Floors_Home_Decor.jpg" alt="Luxury modern interior with premium wooden flooring and charcoal fluted panels in Delhi NCR - Goals Floors Home Decor" fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                </motion.div>
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact" className="inline-flex items-center justify-center px-8 py-4 bg-amber-600 text-white font-bold rounded-sm hover:bg-amber-500 transition-colors shadow-lg">
                  Request Corporate Profile <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <Link href="/products" className="inline-flex items-center justify-center px-8 py-4 bg-gray-100 dark:bg-slate-900 text-gray-900 dark:text-white font-bold rounded-sm hover:bg-gray-200 dark:hover:bg-slate-800 border border-gray-200 dark:border-gray-800 transition-colors">
                  Browse Master Catalog
                </Link>
              </motion.div>

              <motion.div variants={fadeUp} className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between sm:justify-start sm:gap-12">
                <div>
                  <h4 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">19+</h4>
                  <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest font-semibold">Years Legacy</p>
                </div>
                <div className="w-px h-10 bg-gray-200 dark:bg-gray-800"></div>
                <div>
                  <h4 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">25K+</h4>
                  <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest font-semibold">Solutions</p>
                </div>
                <div className="w-px h-10 bg-gray-200 dark:bg-gray-800"></div>
                <div>
                  <h4 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">1.2K+</h4>
                  <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest font-semibold">Partners</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Desktop Hero Images - Visible only on large screens */}
            <motion.div variants={fadeInLeft} initial="hidden" animate="visible" className="hidden lg:block relative h-[600px] w-full group">
              <motion.div
                initial={{ scale: 1.1, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="absolute top-0 right-0 w-[75%] h-[80%] rounded-sm overflow-hidden border-4 border-white dark:border-slate-950 shadow-2xl z-10"
              >
                <Image src="https://res.cloudinary.com/dcezlxt8r/image/upload/v1775221626/Premium_exterior_WPC_cladding_on_a_modern_luxury_building_in_Gurugram_-_Goals_Floors_Architectural_Solutions.jpg" alt="Premium exterior WPC cladding on a modern luxury building in Gurugram - Goals Floors Architectural Solutions" fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
              </motion.div>
              <motion.div
                initial={{ scale: 1.1, x: -30 }}
                animate={{ scale: 1, x: 0 }}
                transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
                className="absolute bottom-10 left-0 w-[60%] h-[50%] rounded-sm overflow-hidden border-4 border-white dark:border-slate-950 shadow-xl z-20"
              >
                <Image src="https://res.cloudinary.com/dcezlxt8r/image/upload/v1775221634/Luxury_modern_interior_with_premium_wooden_flooring_and_charcoal_fluted_panels_in_Delhi_NCR_-_Goals_Floors_Home_Decor.jpg" alt="Luxury modern interior with premium wooden flooring and charcoal fluted panels in Delhi NCR - Goals Floors Home Decor" fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ================= 2. THE LEGACY & LEADERSHIP ================= */}
      <section className="py-10 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-16 items-center">

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 1 }}
              className="relative aspect-square w-full md:w-80 h-auto rounded-full overflow-hidden border-8 border-gray-100 dark:border-slate-800 shadow-2xl bg-gray-100 dark:bg-slate-900 mx-auto md:mx-0"
            >
              <Image
                src="https://res.cloudinary.com/dcezlxt8r/image/upload/v1774872457/Shakti_FTN.jpg"
                alt="Shakti FTN, Founder of Goals Floors"
                fill
                className="object-cover object-top hover:scale-105 transition-transform duration-1000"
              />
            </motion.div>

            {/* FIX: Changed viewport trigger to be more forgiving and added lg:pl-12 */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer} className="space-y-6 lg:pl-12">
              <motion.h2 variants={fadeUp} className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                The Foundation of Trust
              </motion.h2>
              <motion.div variants={fadeUp} className="prose prose-lg dark:prose-invert text-gray-600 dark:text-gray-400 leading-relaxed">
                <p>
                  Established in 2005 by <strong className="text-gray-900 dark:text-white">Shakti FTN</strong>, Goals Floors started with a clear directive: to organize the highly fragmented interior materials market in India and bring global manufacturing standards directly to local architects.
                </p>
                <p>
                  We recognized that project delays were often caused by supply chain inefficiencies. By transitioning from a standard retailer to a direct mega-importer, we eliminated middlemen. Today, we hold massive ready-stock inventories, ensuring that when your site is ready, your material is already on the way.
                </p>
                <div className="pl-6 border-l-4 border-amber-600 py-2 my-8 bg-gray-50 dark:bg-slate-900/50 p-6 rounded-r-md shadow-sm">
                  <p className="text-gray-900 dark:text-white font-semibold text-lg italic m-0">
                    "Our growth isn't measured by sales volume, but by the number of architectural deadlines we've successfully helped our partners meet."
                  </p>
                  <p className="text-sm font-bold text-amber-600 uppercase tracking-widest mt-4 m-0">- Shakti FTN, Founder</p>
                </div>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ================= 3. MISSION, VISION & CORE VALUES: THE FOUNDATION MONOLITHS ================= */}
      <section className="relative bg-white dark:bg-slate-950">
        {/* Sticky Label (Desktop Only) */}
        <div className="hidden lg:block absolute left-8 top-0 h-full w-20 z-[60] pointer-events-none">
          <div className="sticky top-[40vh] transform -rotate-90 origin-center">
            <span className="text-[10px] font-light uppercase tracking-[1.5em] text-amber-600/40 whitespace-nowrap">
              OUR FOUNDATIONS
            </span>
          </div>
        </div>

        {/* Monolith 01: MISSION (Base Layer) */}
        <div className="sticky top-0 bg-amber-600 z-10 flex items-center justify-center overflow-hidden py-8 md:py-10 px-6 sm:px-10 min-h-[50vh] md:min-h-0">
          {/* Relocated Corner Number */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 0.2, x: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute top-4 right-4 md:top-12 md:right-12 text-6xl md:text-[15vw] font-extralight text-white select-none pointer-events-none tracking-tighter"
          >
            01
          </motion.div>

          {/* Logo Moved Higher */}
          <div className="absolute top-4 left-8 md:top-12 md:left-12 transform rotate-90 origin-left">
            <Image
              src="/images/goals-floors-logo-white.svg"
              alt="Goals Floors Logo"
              width={100}
              height={30}
              className="opacity-20 grayscale brightness-200 md:w-[120px]"
            />
          </div>

          <div className="max-w-5xl mx-auto px-4 md:px-6 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 1 }}
            >
              <h3 className="text-5xl md:text-8xl font-medium text-white mb-8 md:mb-10 tracking-[0.05em] uppercase leading-tight italic">
                Our <br /> Mission
              </h3>
              <p className="text-white/90 text-lg md:text-2xl font-normal leading-relaxed max-w-4xl mx-auto tracking-wide">
                To revolutionize the architectural surface industry by providing premium, eco-friendly, and highly durable alternatives to traditional wood, veneer, and paint. We strive to empower architects, designers, and builders with world-class materials without compromising on quality, aesthetics, or site deadlines.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Monolith 02: VISION (Slides Over Mission) */}
        <div className="sticky top-0 bg-slate-950 z-20 flex items-center justify-center overflow-hidden border-t border-white/5 shadow-[0_-50px_100px_-20px_rgba(0,0,0,0.5)] py-8 md:py-10 px-6 sm:px-10 min-h-[50vh] md:min-h-0">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            variants={slideInLeft}
            className="absolute top-4 left-4 md:top-12 md:left-12 text-6xl md:text-[15vw] font-extralight text-white select-none pointer-events-none tracking-tighter"
          >
            02
          </motion.div>

          <div className="absolute top-4 right-8 md:top-12 md:right-12 transform -rotate-90 origin-right">
            <Image
              src="/images/goals-floors-logo-white.svg"
              alt="Goals Floors Logo"
              width={100}
              height={30}
              className="opacity-10 grayscale md:w-[120px]"
            />
          </div>

          <div className="max-w-5xl mx-auto px-4 md:px-6 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 1.2 }}
            >
              <h3 className="text-5xl md:text-8xl font-medium text-white mb-8 md:mb-10 tracking-[0.05em] uppercase leading-tight italic">
                The <br /> Vision
              </h3>
              <p className="text-gray-400 text-lg md:text-2xl font-normal leading-relaxed max-w-4xl mx-auto tracking-wide">
                To be the undisputed backbone of India’s luxury residential and commercial real estate. We envision a future where every modern space is built with sustainable, health-conscious materials that are 100% free from harmful toxins, setting a new benchmark for safe and stunning interiors.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Monolith 03: VALUES (Final Layer) */}
        <div className="sticky top-0 bg-white dark:bg-slate-900 z-30 flex items-center justify-center overflow-hidden shadow-[0_-50px_100px_-20px_rgba(0,0,0,0.5)] pt-32 pb-20 md:py-10 px-6 sm:px-10 min-h-[90vh] md:min-h-0">
          {/* Number 03 Darkened - Repositioned for Mobile */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            variants={slideInRight}
            className="absolute top-4 right-4 md:top-12 md:right-12 text-6xl md:text-[15vw] font-extralight text-gray-900 dark:text-white select-none pointer-events-none tracking-tighter"
          >
            03
          </motion.div>

          <div className="absolute top-4 left-4 md:top-12 md:left-12">
            <Image
              src="/images/goals floors logo.svg"
              alt="Goals Floors Logo"
              width={100}
              height={30}
              className="opacity-40 grayscale brightness-0 dark:invert md:w-[120px]"
            />
          </div>

          <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10 w-full">
            <div className="text-center mb-10 md:mb-20">
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-8xl font-medium text-gray-900 dark:text-white tracking-[0.1em] uppercase leading-none italic"
              >
                Core Values
              </motion.h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-16">
              {[
                { icon: Star, title: "Sustainability", desc: "Crafting our products from high-grade recycled materials, ensuring a greener footprint than traditional substitutes." },
                { icon: ShieldCheck, title: "Health & Safety", desc: "Engineered to be anti-bacterial, anti-fungal, and strictly free from hazardous heavy metals like lead and mercury." },
                { icon: Zap, title: "Execution Speed", desc: "Respecting project deadlines above all else with our centralized mega-hub and express dispatch." },
                { icon: Gem, title: "Durability", desc: "Delivering long-lasting, heavy-duty surface solutions that offer a far superior lifespan and value." }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  variants={scaleIn}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center text-center group"
                >
                  <motion.div
                    {...floatingIcon}
                    transition={{ ...floatingIcon.animate.transition, delay: i * 0.2 }}
                    className="w-16 h-16 rounded-full bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-amber-600 mb-8 transform group-hover:scale-110 transition-transform duration-500 border border-gray-100 dark:border-gray-700 shadow-sm"
                  >
                    <item.icon className="w-8 h-8" />
                  </motion.div>
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-[0.15em] leading-tight">{item.title}</h4>
                  <p className="text-gray-600 dark:text-gray-400 font-normal text-lg md:text-xl leading-relaxed px-4 sm:px-0">{item.desc}</p>
                  <div className="h-[2px] w-0 bg-amber-600 mt-8 group-hover:w-16 transition-all duration-700" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

      </section>

      {/* ================= 4. BENTO BOX INFRASTRUCTURE ================= */}
      <section className="py-10 border-y border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mb-12"
          >
            <motion.h2 variants={fadeUp} className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Infrastructure & Capabilities</motion.h2>
            <motion.p variants={fadeUp} className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl">Scale that supports the largest commercial developments in Delhi NCR.</motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-auto md:auto-rows-[250px]"
          >
            <motion.div variants={scaleIn} className="md:col-span-2 bg-gray-900 dark:bg-slate-900 rounded-lg p-8 relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8ed79be264?q=80&w=1000&auto=format&fit=crop')] opacity-20 bg-cover bg-center mix-blend-luminosity group-hover:opacity-30 transition-opacity duration-700" />
              <div className="relative z-10 h-full flex items-start gap-4 md:gap-0 md:flex-col md:justify-end">
                <MapPin className="w-10 h-10 text-amber-500 md:mb-4 shrink-0" />
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-white leading-tight mb-2">Centralized Mega-Hub</h3>
                  <p className="text-gray-300 font-medium max-w-md">Our massive warehousing facility in Gurugram ensures we hold deep inventory levels for 2500+ SKUs, eliminating out-of-stock delays.</p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={scaleIn} className="bg-amber-600 rounded-lg p-8 relative overflow-hidden flex items-start gap-4 md:gap-0 md:flex-col md:justify-between">
              <Zap className="w-10 h-10 text-white/80 md:mb-4 shrink-0" />
              <div>
                <h3 className="text-2xl font-black text-white leading-tight mb-2">2-Hour Dispatch</h3>
                <p className="text-amber-100 font-medium text-sm">Dedicated logistics fleet covering Delhi, Gurugram, and Noida with unprecedented speed.</p>
              </div>
            </motion.div>

            <motion.div variants={scaleIn} className="bg-gray-100 dark:bg-slate-900/80 border border-gray-200 dark:border-gray-800 rounded-lg p-8 flex items-start gap-4 md:gap-0 md:flex-col md:justify-between">
              <ShieldCheck className="w-10 h-10 text-amber-600 md:mb-4 shrink-0" />
              <div>
                <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white leading-tight mb-2">Commercial Grade</h3>
                <p className="text-gray-600 dark:text-gray-400 font-medium text-sm">Class B1 Fire Retardant, UV Protected, and 100% Waterproof materials certified for high-rise buildings.</p>
              </div>
            </motion.div>

            <motion.div variants={scaleIn} className="md:col-span-2 bg-gray-100 dark:bg-slate-900/80 border border-gray-200 dark:border-gray-800 rounded-lg p-8 flex flex-col justify-center">
              <div className="flex items-start gap-6">
                <Package className="w-12 h-12 text-amber-600 shrink-0" />
                <div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">End-to-End Solutions</h3>
                  <p className="text-gray-600 dark:text-gray-400 font-medium max-w-lg">We don't just supply base materials. From matching skirtings for flooring to structural concealed clips for louvers—we provide the complete technical ecosystem.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================= 5. THE B2B WORKFLOW ================= */}
      <section className="py-10 bg-gray-50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeUp} className="text-3xl font-bold text-gray-900 dark:text-white mb-4">How We Work With Professionals</motion.h2>
            <motion.p variants={fadeUp} className="text-gray-600 dark:text-gray-400 text-lg">A streamlined process designed specifically for contractors and interior firms.</motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-4 gap-8 relative"
          >
            <div className="hidden md:block absolute top-10 left-[10%] right-[10%] h-0.5 bg-gray-200 dark:bg-gray-800 z-0" />

            {[
              { icon: Ruler, title: "1. Consultation & BOQ", desc: "Share your floor plans. Our team calculates exact material requirements and wastage to provide an accurate estimate." },
              { icon: Star, title: "2. Sample Approval", desc: "We dispatch physical sample kits to your office or site for client presentation and final texture approval." },
              { icon: Zap, title: "3. Express Dispatch", desc: "Upon PO confirmation, materials are loaded from our Gurugram hub and dispatched within hours." },
              { icon: HardHat, title: "4. Tech Support", desc: "We provide detailed installation manuals and technical guidance to your on-site carpentry teams." }
            ].map((step, i) => (
              <motion.div
                key={i}
                variants={scaleIn}
                className="relative z-10 flex flex-col items-center text-center group"
              >
                <motion.div
                  {...floatingIcon}
                  transition={{ ...floatingIcon.animate.transition, delay: i * 0.2 }}
                  className="w-20 h-20 rounded-full bg-white dark:bg-slate-950 border-4 border-gray-50 dark:border-slate-900 shadow-md flex items-center justify-center text-amber-600 mb-6 hover:scale-110 transition-transform"
                >
                  <step.icon className="w-8 h-8" />
                </motion.div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">{step.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium leading-relaxed px-2">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

    </div>
  );
}