"use client";

import { motion } from "framer-motion";
import { 
  Percent, Target, Zap, ShieldCheck, 
  CheckCircle2, ArrowRight, Search
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             1. WHY PARTNER GRID                            */
/* -------------------------------------------------------------------------- */

export function WhyPartnerGrid() {
  const benefits = [
    {
      title: "Unbeatable Margins",
      desc: "We provide our dealers with a solid 40% to 50% margin directly on the website's Retail Price (MRP). Your profit is our top priority!",
      icon: Percent,
      span: "md:col-span-2",
      delay: 0
    },
    {
      title: "Local SEO Boost",
      desc: "We write dedicated, SEO-optimized articles for our top dealers on our website. This boosts your local visibility and brings customers directly to you through our platform.",
      icon: Search,
      span: "md:col-span-1",
      delay: 0.1
    },
    {
      title: "Zero Commission Leads",
      desc: "Smart 'Trust Score' system. We forward local retail inquiries directly to our loyal dealers—at 0% commission!",
      icon: Target,
      span: "md:col-span-1",
      delay: 0.2
    },
    {
      title: "Lightning Fast Logistics",
      desc: "No more project delays. A 2-Hour Express Dispatch service is available for all dealers across Gurugram and Delhi NCR.",
      icon: Zap,
      span: "md:col-span-1",
      delay: 0.3
    },
    {
      title: "Premium Quality & Warranty",
      desc: "100% waterproof materials (WPC, PU Stone, etc.) backed by a 7-year warranty to ensure long-term satisfaction.",
      icon: ShieldCheck,
      span: "md:col-span-1",
      delay: 0.4
    }
  ];

  return (
    <section className="py-6 md:py-24 bg-white dark:bg-slate-950 px-6 md:px-16 text-slate-900 dark:text-white transition-colors duration-500 selection:bg-amber-500 selection:text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              Why Partner <br /> <span className="font-playfair italic font-normal text-amber-500">With Us?</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-sm text-base leading-relaxed">
              What's in it for me? Here is why 400+ dealers trust Goals Floors for their architectural surface needs.
            </p>
        </div>
        
        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[auto] md:auto-rows-[320px]">
          {benefits.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: item.delay }}
                className={`${item.span} bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-8 md:p-12 flex flex-col justify-between group hover:border-amber-500/50 transition-all duration-500 rounded-3xl relative overflow-hidden`}
              >
                {/* Background Icon Watermark */}
                <Icon className="absolute -top-6 -right-6 w-40 h-40 text-amber-500/20 dark:text-amber-500/5 -rotate-12 pointer-events-none transition-transform duration-700 group-hover:scale-110 group-hover:rotate-0" strokeWidth={1} />
                
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 dark:bg-amber-500/10 blur-[80px] rounded-full group-hover:bg-amber-500/10 dark:group-hover:bg-amber-500/20 transition-all duration-700 pointer-events-none" />
                
                <div className="relative z-10 mt-auto">
                    <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">{item.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed">
                      {item.desc}
                    </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                     2. DEALERSHIP RULES & TRANSPARENCY                     */
/* -------------------------------------------------------------------------- */

export function FAQAccordion() {
  return (
    <section className="py-6 md:py-24 bg-slate-50 dark:bg-slate-900 px-6 md:px-16 text-slate-900 dark:text-white transition-colors duration-500 border-t border-slate-200 dark:border-white/5 selection:bg-amber-500 selection:text-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 lg:gap-24 items-center">
        
        <div className="w-full md:w-1/2">
            <span className="text-amber-500 font-bold uppercase tracking-widest text-xs mb-4 block">Clear Expectations</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Dealership Rules & <br /> <span className="font-playfair italic font-normal text-slate-500 dark:text-slate-400">Transparency.</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-8">
              We are professionals, and we believe our partners deserve absolute clarity from day one.
            </p>
        </div>

        <div className="w-full md:w-1/2 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-slate-950 p-8 rounded-3xl border border-slate-200 dark:border-white/5 shadow-xl shadow-slate-200/20 dark:shadow-none flex gap-6"
            >
                <div className="shrink-0 mt-1">
                    <CheckCircle2 className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                    <h3 className="text-xl font-bold tracking-tight mb-3">No Minimum Order Quantity (MOQ)</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base">
                        There is no MOQ for dealers in Gurugram and NCR; you can order exactly what you need.
                    </p>
                </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-slate-950 p-8 rounded-3xl border border-slate-200 dark:border-white/5 shadow-xl shadow-slate-200/20 dark:shadow-none flex gap-6"
            >
                <div className="shrink-0 mt-1">
                    <CheckCircle2 className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                    <h3 className="text-xl font-bold tracking-tight mb-3">Professional Sample Catalogs</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base">
                        Our premium physical sample catalogs are available at a fixed price of ₹1,500 per folder, designed to help you confidently close sales during client meetings.
                    </p>
                </div>
            </motion.div>
        </div>
      </div>
    </section>
  );
}

export function TrustBar() {
  return null; // Removed as per request to focus on the 4 main sections
}
