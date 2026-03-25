"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, ShieldCheck, Trophy, Truck, Users, CheckCircle2 } from "lucide-react";
import Counter from "@/components/Counter";
import Testimonials from "@/components/Testimonials";
import BrandMarquee from "@/components/BrandMarquee";


export default function Home() {

  return (
    <div className="flex flex-col min-h-screen">

      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-[90vh] flex items-start md:items-center justify-center overflow-hidden">
        {/* Background - Replace src with your Cloudinary URL */}
        <div className="absolute inset-0 z-0 bg-black transition-colors duration-300">
          <Image
            src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070"
            alt="Luxury Interior by Goals Floors"
            fill
            sizes="100vw"
            className="object-cover opacity-70"
            /* Clear top, only bottom transition fog as requested */
          />
          <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-white/70 to-transparent z-10 dark:from-slate-950/70 transition-colors duration-700" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-32 md:pt-0 md:mt-20">

          {/* USP Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white mb-8 shadow-xl">
            <Clock className="w-4 h-4 text-amber-500" />
            <span className="text-xs sm:text-sm font-medium tracking-widest uppercase">2-Hour Express Delivery in NCR</span>
          </div>

          {/* Headline - Thinner, more elegant font */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-semibold text-white mb-6 tracking-tight leading-tight">
            Elevate Your Space With <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-600 italic font-light">
              Luxury Surfaces
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg md:text-xl text-gray-200 max-w-2xl mx-auto font-light leading-relaxed mb-10">
            India&apos;s most trusted brand for Premium Laminate, WPC Louvers, and Baffle Ceilings. Crafting architectural excellence for over 19 years.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/contact"
              className="group flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 text-sm font-semibold uppercase tracking-widest transition-all duration-300 w-full sm:w-auto justify-center shadow-lg hover:shadow-amber-600/30"
            >
              Get a Free Quote
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="#categories"
              className="flex items-center gap-2 bg-transparent hover:bg-white/10 border border-white/50 text-white px-8 py-4 text-sm font-semibold uppercase tracking-widest transition-all duration-300 w-full sm:w-auto justify-center"
            >
              Explore Collection
            </Link>
          </div>
        </div>
      </section>

      {/* ================= STATS BAR ================= */}
      <div className="bg-white dark:bg-slate-900 py-8 border-b border-gray-100 dark:border-gray-800 relative z-20 -mt-10 mx-4 sm:mx-8 lg:mx-auto max-w-6xl shadow-2xl dark:shadow-none transition-colors duration-300">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-6">
          {[
            { label: "Premium Products", value: "2500+" },
            { label: "Happy Clients", value: "10k+" },
            { label: "Years of Legacy", value: "19+" },
            { label: "Warranty Assured", value: "10 Yrs" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <Counter
                value={stat.value}
                className="text-3xl font-bold text-gray-900 dark:text-white"
              />
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-2">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= CATEGORIES SECTION ================= */}
      <section id="categories" className="py-24 bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">Our Signature Collections</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Discover our range of world-class interior and exterior architectural solutions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Category Card 1 */}
            <Link href="/wall-panels" className="group block relative h-96 overflow-hidden bg-black transition-colors duration-300">
              <Image
                src="https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1000"
                alt="WPC Wall Panels" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover opacity-90 group-hover:scale-105 group-hover:opacity-70 transition-all duration-700"
              />
              {/* Overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-100 z-10" />
              
              <div className="absolute inset-0 flex flex-col justify-end p-8 relative z-20">
                <h3 className="text-2xl font-semibold text-white mb-2">Wall Panels & Louvers</h3>
                <p className="text-gray-300 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">Charcoal, WPC & Fluted Panels</p>
                <div className="text-amber-400 text-sm font-semibold tracking-widest uppercase flex items-center gap-2">View Range <ArrowRight className="w-4 h-4" /></div>
              </div>
            </Link>

            {/* Category Card 2 */}
            <Link href="/flooring" className="group block relative h-96 overflow-hidden bg-black transition-colors duration-300">
              <Image
                src="https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?q=80&w=1000"
                alt="Wooden Flooring" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover opacity-90 group-hover:scale-105 group-hover:opacity-70 transition-all duration-700"
              />
              {/* Overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-100 z-10" />

              <div className="absolute inset-0 flex flex-col justify-end p-8 relative z-20">
                <h3 className="text-2xl font-semibold text-white mb-2">Luxury Flooring</h3>
                <p className="text-gray-300 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">Laminate, SPC & Artificial Grass</p>
                <div className="text-amber-400 text-sm font-semibold tracking-widest uppercase flex items-center gap-2">View Range <ArrowRight className="w-4 h-4" /></div>
              </div>
            </Link>

            {/* Category Card 3 */}
            <Link href="/ceilings" className="group block relative h-96 overflow-hidden bg-black transition-colors duration-300">
              <Image
                src="https://images.unsplash.com/photo-1600607687959-ce8a6c25118c?q=80&w=1000"
                alt="Baffle Ceilings" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover opacity-90 group-hover:scale-105 group-hover:opacity-70 transition-all duration-700"
              />
              {/* Overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-100 z-10" />

              <div className="absolute inset-0 flex flex-col justify-end p-8 relative z-20">
                <h3 className="text-2xl font-semibold text-white mb-2">Ceilings & Facades</h3>
                <p className="text-gray-300 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">Premium Baffle Ceilings</p>
                <div className="text-amber-400 text-sm font-semibold tracking-widest uppercase flex items-center gap-2">View Range <ArrowRight className="w-4 h-4" /></div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="py-15 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">Why Architects &amp; Designers Choose Us</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">We don&apos;t just sell products; we deliver peace of mind. With our robust supply chain and commitment to quality, your projects are completed on time, every time.</p>

              {/* Mobile Image - Shown only on small screens */}
              <div className="relative h-64 w-full mb-8 lg:hidden rounded-sm overflow-hidden shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1000"
                  alt="Installation process" fill sizes="100vw" className="object-cover"
                />
              </div>

              <div className="space-y-6">
                {[
                  { icon: Truck, title: "Superfast Delivery", desc: "Our 2-Hour express delivery in Gurgaon and NCR ensures your project never stops." },
                  { icon: ShieldCheck, title: "100% Genuine Materials", desc: "Termite-proof, water-resistant, and fire-retardant panels with official warranties." },
                  { icon: Trophy, title: "Industry Leaders", desc: "19+ years of expertise. We understand panels and flooring better than anyone else." },
                  { icon: CheckCircle2, title: "End-to-End Support", desc: "From expert consultation to precise measurements and professional installation, we handle it all." },
                  { icon: Users, title: "Trusted Brand", desc: "Preferred choice of leading builders, contractors, designers, and thousands of happy homeowners." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-amber-700 dark:text-amber-500">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side large image - Hidden on mobile, shown on desktop */}
            <div className="relative h-[600px] rounded-sm overflow-hidden shadow-2xl hidden lg:block">
              <Image
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1000"
                alt="Installation process" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <BrandMarquee />

      <Testimonials />

      {/* ================= THE ULTIMATE LEAD MAGNET (Light/Bright Theme) ================= */}
      <section className="relative py-24 bg-amber-50 dark:bg-slate-950 overflow-hidden border-t-4 border-amber-500 transition-colors duration-300">
        {/* Subtle Decorative Background Element */}
        <div className="absolute top-0 left-0 w-full h-full opacity-50 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-200/40 dark:from-amber-900/20 via-transparent to-transparent pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">Ready to Transform Your Space?</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
            Get a free consultation, precise measurements, and a customized quote for your project. Our experts are ready to help.
          </p>

          {/* Bright Lead Form */}
          <form className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-sm border border-gray-200 dark:border-gray-800 shadow-2xl dark:shadow-none max-w-3xl mx-auto relative transition-colors duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white px-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder-gray-400 dark:placeholder-gray-600"
                required
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white px-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder-gray-400 dark:placeholder-gray-600"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <select className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 px-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all">
                <option value="">Interested In...</option>
                <option value="louvers">WPC Louvers & Panels</option>
                <option value="flooring">Wooden/Laminate Flooring</option>
                <option value="ceilings">Baffle Ceilings</option>
                <option value="other">Other</option>
              </select>
              <button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold uppercase tracking-widest px-4 py-3 transition-colors shadow-lg shadow-amber-600/30"
              >
                Request Free Quote
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2 mt-4">
              <ShieldCheck className="w-4 h-4 text-amber-500" /> No spam. 100% Privacy Guaranteed.
            </p>
          </form>

        </div>
      </section>

    </div>
  );
}