"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, ShieldCheck, Star, Trophy, Truck, Users, CheckCircle2 } from "lucide-react";
import Counter from "@/components/Counter";

export default function Home() {
  const [isReviewsVisible, setIsReviewsVisible] = useState(false);
  const reviewsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsReviewsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (reviewsRef.current) {
      observer.observe(reviewsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-[90vh] flex items-start md:items-center justify-center overflow-hidden">
        {/* Background - Replace src with your Cloudinary URL */}
        <div className="absolute inset-0 z-0 bg-gray-900">
          <Image
            src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070" 
            alt="Luxury Interior by Goals Floors"
            fill
            sizes="100vw"
            className="object-cover opacity-50"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-white" />
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
            India's most trusted brand for Premium Laminate, WPC Louvers, and Baffle Ceilings. Crafting architectural excellence for over 19 years.
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
      <div className="bg-white py-8 border-b border-gray-100 relative z-20 -mt-10 mx-4 sm:mx-8 lg:mx-auto max-w-6xl shadow-2xl">
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
                className="text-3xl font-bold text-gray-900" 
              />
              <div className="text-xs text-gray-500 uppercase tracking-widest mt-2">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= CATEGORIES SECTION ================= */}
      <section id="categories" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">Our Signature Collections</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Discover our range of world-class interior and exterior architectural solutions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Category Card 1 */}
            <Link href="/wall-panels" className="group block relative h-96 overflow-hidden bg-gray-900">
              <Image 
                src="https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1000" 
                alt="WPC Wall Panels" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover opacity-70 group-hover:scale-105 group-hover:opacity-50 transition-all duration-700" 
              />
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <h3 className="text-2xl font-semibold text-white mb-2">Wall Panels & Louvers</h3>
                <p className="text-gray-300 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">Charcoal, WPC & Fluted Panels</p>
                <div className="text-amber-400 text-sm font-semibold tracking-widest uppercase flex items-center gap-2">View Range <ArrowRight className="w-4 h-4" /></div>
              </div>
            </Link>

            {/* Category Card 2 */}
            <Link href="/flooring" className="group block relative h-96 overflow-hidden bg-gray-900">
              <Image 
                src="https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?q=80&w=1000" 
                alt="Wooden Flooring" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover opacity-70 group-hover:scale-105 group-hover:opacity-50 transition-all duration-700" 
              />
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <h3 className="text-2xl font-semibold text-white mb-2">Luxury Flooring</h3>
                <p className="text-gray-300 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">Laminate, SPC & Artificial Grass</p>
                <div className="text-amber-400 text-sm font-semibold tracking-widest uppercase flex items-center gap-2">View Range <ArrowRight className="w-4 h-4" /></div>
              </div>
            </Link>

            {/* Category Card 3 */}
            <Link href="/ceilings" className="group block relative h-96 overflow-hidden bg-gray-900">
              <Image 
                src="https://images.unsplash.com/photo-1600607687959-ce8a6c25118c?q=80&w=1000" 
                alt="Baffle Ceilings" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover opacity-70 group-hover:scale-105 group-hover:opacity-50 transition-all duration-700" 
              />
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <h3 className="text-2xl font-semibold text-white mb-2">Ceilings & Facades</h3>
                <p className="text-gray-300 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">Premium Baffle Ceilings</p>
                <div className="text-amber-400 text-sm font-semibold tracking-widest uppercase flex items-center gap-2">View Range <ArrowRight className="w-4 h-4" /></div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight">Why Architects & Designers Choose Us</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">We don't just sell products; we deliver peace of mind. With our robust supply chain and commitment to quality, your projects are completed on time, every time.</p>
              
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
                    <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-700">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{item.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
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

      {/* ================= B2B TRUST SIGNALS (Marquee & Testimonials) ================= */}
      <section className="py-24 bg-gray-50 border-t border-gray-200 overflow-hidden">
        
        {/* Inline CSS for Marquee Animation */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            display: flex;
            width: 200%;
            animation: scroll 40s linear infinite;
          }
          @media (max-width: 768px) {
            .animate-marquee {
              animation-duration: 8s;
            }
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `}} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight uppercase">Trusted By Leading Architects & Developers</h2>
            <div className="w-16 h-1 bg-amber-500 mx-auto mt-4"></div>
          </div>
        </div>

        {/* Infinite Scrolling Logos (Right to Left) */}
        <div className="relative w-full overflow-hidden mb-24 bg-white py-6 border-y border-gray-100">
          
          {/* Foggy Overlays for Seamless Dissolve */}
          <div className="absolute inset-y-0 left-0 w-24 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-24 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

          <div className="animate-marquee flex items-center">
            {/* Array doubled to create a seamless infinite loop */}
            {["Apex Builders", "Studio9 Interiors", "Lumina Real Estate", "Vertex Corporate", "Zenith Architects", "Nova Designs", "Aura Spaces", "Prime Developers", "Apex Builders", "Studio9 Interiors", "Lumina Real Estate", "Vertex Corporate", "Zenith Architects", "Nova Designs", "Aura Spaces", "Prime Developers"].map((brand, i) => (
              <div key={i} className="flex-1 min-w-[300px] text-center text-lg md:text-xl font-medium text-gray-400 uppercase tracking-widest hover:text-amber-600 transition-colors cursor-pointer select-none">
                {brand}
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">What Our Customers Say</h2>
          </div>

          {/* 6 B2B Testimonials Grid */}
          <div ref={reviewsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            
            {[
              {
                quote: "We had a tight deadline for a 50,000 sq ft office. Goals Floors not only delivered the WPC louvers within 2 hours but the quality was flawless.",
                name: "Rahul Sharma",
                role: "Lead Architect, Studio9"
              },
              {
                quote: "Finding genuine termite-proof wooden flooring with official warranties is tough. Goals Floors provided transparent pricing and amazing installation.",
                name: "Priya Desai",
                role: "Interior Designer"
              },
              {
                quote: "Sourced 2000 sq ft of premium laminate for a luxury villa project. The texture and finish look exactly like real hardwood. Highly impressed.",
                name: "Amit Verma",
                role: "Builder & Developer"
              },
              {
                quote: "Their Baffle Ceilings completely transformed our corporate lobby. The acoustic properties are great and the delivery was on the exact committed date.",
                name: "Sneha Kapoor",
                role: "Commercial Architect"
              },
              {
                quote: "I regularly use their charcoal louvers for my clients' TV units and bed backdrops. The finishing is ultra-premium and easy to install.",
                name: "Neha Singh",
                role: "Freelance Designer"
              },
              {
                quote: "As a contractor, I appreciate their fast supply chain in NCR. Never had a project delayed because of material shortage from Goals Floors.",
                name: "Vikram Rathi",
                role: "Project Contractor"
              }
            ].map((review, index) => (
              <div 
                key={index} 
                className={`transition-all duration-1000 ease-out h-full ${
                  isReviewsVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="group bg-white p-8 rounded-none border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-amber-500/10 hover:border-amber-200/50 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between relative h-full cursor-default">
                  <div>
                    {/* Star Rating */}
                    <div className="flex gap-1 mb-6 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    
                    <p className="text-gray-700 leading-relaxed italic text-sm mb-8 relative z-10 transition-colors group-hover:text-gray-900">
                      "{review.quote}"
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4 pt-6 border-t border-gray-50">
                    {/* Initials Avatar */}
                    <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-sm border border-amber-100/50 group-hover:bg-amber-600 group-hover:text-white transition-colors duration-300">
                      {review.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{review.name}</h4>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5 font-medium">{review.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* ================= THE ULTIMATE LEAD MAGNET (Light/Bright Theme) ================= */}
      <section className="relative py-24 bg-amber-50 overflow-hidden border-t-4 border-amber-500">
        {/* Subtle Decorative Background Element */}
        <div className="absolute top-0 left-0 w-full h-full opacity-50 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-200/40 via-transparent to-transparent pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">Ready to Transform Your Space?</h2>
          <p className="text-gray-600 text-lg mb-10 max-w-2xl mx-auto">
            Get a free consultation, precise measurements, and a customized quote for your project. Our experts are ready to help.
          </p>

          {/* Bright Lead Form */}
          <form className="bg-white p-6 md:p-10 rounded-sm border border-gray-200 shadow-2xl max-w-3xl mx-auto relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <input 
                type="text" 
                placeholder="Your Name" 
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder-gray-400"
                required
              />
              <input 
                type="tel" 
                placeholder="Phone Number" 
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder-gray-400"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <select className="w-full bg-gray-50 border border-gray-200 text-gray-600 px-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all">
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
            <p className="text-xs text-gray-500 uppercase tracking-widest flex items-center justify-center gap-2 mt-4">
              <ShieldCheck className="w-4 h-4 text-amber-500" /> No spam. 100% Privacy Guaranteed.
            </p>
          </form>

        </div>
      </section>

    </div>
  );
}