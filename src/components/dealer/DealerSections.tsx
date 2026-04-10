"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, MapPin, Truck, IndianRupee, 
  Handshake, Target, LayoutDashboard, 
  HelpCircle, Plus, Minus, ChevronDown,
  TrendingUp, Megaphone, Zap, UserCheck
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                1. TRUST BAR                                */
/* -------------------------------------------------------------------------- */

const trustStats = [
  { icon: Users, label: "Active Partners", value: "500+" },
  { icon: MapPin, label: "States Covered", value: "12+" },
  { icon: Truck, label: "Dispatch Time", value: "48 Hrs" },
  { icon: IndianRupee, label: "Value Delivered", value: "₹50Cr+" },
];

export function TrustBar() {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 border-y border-slate-200 dark:border-white/5 py-10 relative z-30 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {trustStats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center md:items-start text-center md:text-left gap-3 group"
            >
              <div className="flex items-center gap-2 md:gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-600/10 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all shrink-0">
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                   <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">{stat.value}</h3>
                   <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest md:tracking-[0.2em] text-slate-400 dark:text-slate-500 whitespace-nowrap">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                             2. WHY PARTNER GRID                            */
/* -------------------------------------------------------------------------- */

const partnerBenefits = [
  { 
    icon: TrendingUp, 
    title: "High Margins", 
    desc: "Unbeatable B2B pricing with clear volume-based slabs and performance rewards." 
  },
  { 
    icon: Megaphone, 
    title: "Marketing Support", 
    desc: "Free sample boxes, premium catalogs, and high-res digital assets for your showroom and social media." 
  },
  { 
    icon: Zap, 
    title: "Priority Dispatch", 
    desc: "Exclusive access to our dedicated supply chain, ensuring your projects never face material delays." 
  },
  { 
    icon: UserCheck, 
    title: "Dedicated Manager", 
    desc: "A single, direct point of contact for all your technical, logistics, and sales queries." 
  },
];

export function WhyPartnerGrid() {
  return (
    <section className="py-10 md:py-24 bg-white dark:bg-slate-950 px-4 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white text-center uppercase tracking-tighter mb-16">
          Why Partner With <span className="text-amber-600 italic font-light font-playfair">Goals</span> Floors?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {partnerBenefits.map((benefit, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-[2rem] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 hover:border-amber-600/30 transition-all group relative overflow-hidden shadow-sm dark:shadow-none"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="w-14 h-14 bg-amber-600/10 rounded-2xl flex items-center justify-center text-amber-600 mb-8 group-hover:scale-110 transition-transform duration-500">
                <benefit.icon className="w-6 h-6" />
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight mb-4">{benefit.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">{benefit.desc}</p>
              
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-amber-600/5 blur-3xl group-hover:bg-amber-600/10 transition-all" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                               3. FAQ ACCORDION                             */
/* -------------------------------------------------------------------------- */

const faqItems = [
  {
    question: "What is the Minimum Order Quantity (MOQ) to maintain active dealership?",
    answer: "We offer flexible MOQs depending on your business scale (Retailer vs. Wholesaler). Specific slab details will be shared by your account manager upon approval."
  },
  {
    question: "How are the B2B margins structured?",
    answer: "We operate on a tiered pricing model. The higher your annual turnover and order volume, the deeper your margins."
  },
  {
    question: "What is your standard dispatch time?",
    answer: "For standard catalog items, we ensure dispatch within 48 business hours from our central warehouse."
  },
  {
    question: "How do you handle transit damages?",
    answer: "All our shipments are fully insured. In the rare event of transit damage, we provide hassle-free replacements upon immediate visual proof."
  },
  {
    question: "Do you provide physical display units and sample catalogs?",
    answer: "Yes! Verified dealers receive a comprehensive 'Starter Kit' including shade cards, physical catalogs, and premium acrylic display stands for their showroom."
  },
  {
    question: "Will I get dedicated support?",
    answer: "Absolutely. Every verified partner is assigned a dedicated Account Manager for priority order processing and technical support."
  },
  {
    question: "Do you offer area exclusivity?",
    answer: "We offer pincode or city-level exclusivity for our 'Premium Tier' partners who commit to specific annual targets, ensuring you don't face local undercutting."
  }
];

export function FAQAccordion() {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenId(openId === index ? null : index);
  };

  return (
    <section className="py-10 md:py-24 bg-slate-50 dark:bg-slate-950 px-4 border-t border-slate-200 dark:border-white/5 relative overflow-hidden transition-colors duration-500">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-amber-600/5 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex flex-col items-center gap-4 mb-16 text-center">
            <div className="w-14 h-14 bg-amber-600/10 border border-amber-600/20 rounded-2xl flex items-center justify-center text-amber-600 mb-2 shadow-2xl shadow-amber-900/20">
                <HelpCircle className="w-7 h-7" />
            </div>
            <h2 className="text-3xl md:text-6xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none mb-4">
              B2B Partnership <span className="text-amber-600 italic font-light drop-shadow-md font-playfair">FAQ</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Detailed insights for prospective Goals Floors partners.</p>
        </div>

        <div className="space-y-4">
          {faqItems.map((faq, i) => {
            const isOpen = openId === i;
            
            return (
              <motion.div 
                key={i} 
                className="border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:border-amber-600/30"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <button 
                  onClick={() => toggleFaq(i)}
                  className="w-full text-left p-6 md:p-8 flex items-center justify-between focus:outline-none bg-white dark:bg-slate-900 group transition-colors duration-300"
                >
                  <h4 className={`text-base md:text-lg font-bold pr-8 transition-colors duration-300 ${isOpen ? 'text-amber-600' : 'text-slate-900 dark:text-white'}`}>
                    {faq.question}
                  </h4>
                  <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
                    {isOpen ? (
                      <Minus className="w-5 h-5 text-amber-600 shrink-0" />
                    ) : (
                      <Plus className="w-5 h-5 text-slate-300 dark:text-slate-400 group-hover:text-amber-600 shrink-0" />
                    )}
                  </div>
                </button>
                <div 
                  className={`px-6 md:px-8 overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 pb-8 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="border-t border-slate-100 dark:border-white/5 pt-4 mt-2 transition-colors duration-300">
                    <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed font-medium">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
