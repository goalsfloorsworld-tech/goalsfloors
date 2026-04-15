"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Droplets, Zap, Wrench, 
  Sparkles, ShieldCheck, Flame, 
  Leaf, Sun, Waves, ShieldX, Layers, Fingerprint,
  Footprints, Puzzle, VolumeX, Maximize,
  Paintbrush, Construction, 
  Lightbulb, Copy, ExternalLink,
  Heart, Feather, CloudRain, 
  BadgeCheck
} from "lucide-react";
import { Feature } from "@/app/products/[slug]/ProductClient";

interface FeatureAccordionProps {
  features: Feature[];
  productTitle?: string;
  heading?: string;
  subheading?: string;
}

const getFeatureIcon = (title: string) => {
  const t = title.toUpperCase();
  
  // WATER & MOISTURE & DRAINAGE
  if (t.includes('WATERPROOF') || t.includes('MOISTURE') || t.includes('RAIN') || t.includes('DAMP') || t.includes('SEELAN')) return Droplets;
  if (t.includes('DRAIN') || t.includes('FLOW') || t.includes('WATERLOG')) return CloudRain;
  if (t.includes('WEATHER') || t.includes('OUTDOOR')) return Waves;
  
  // PROTECTION & DURABILITY
  if (t.includes('TERMITE') || t.includes('BORER') || t.includes('INSECT') || t.includes('DEEMAK') || t.includes('FUNGAL') || t.includes('MOLD')) return ShieldX;
  if (t.includes('FIRE') || t.includes('HEAT') || t.includes('FLAME') || t.includes('RETARDANT')) return Flame;
  if (t.includes('UV') || t.includes('SUN') || t.includes('FADE') || t.includes('STABILIZ')) return Sun;
  if (t.includes('STRENGTH') || t.includes('DURABLE') || t.includes('IMPACT') || t.includes('TOUGH') || t.includes('STABILITY') || t.includes('WARP') || t.includes('RESILIENCE')) return ShieldCheck;
  if (t.includes('THICKNESS') || t.includes('MM') || t.includes('LAYER') || t.includes('DENSITY') || t.includes('STITCH')) return Layers;
  
  // INSTALLATION & BUILD
  if (t.includes('INTERLOCK') || t.includes('SEAMLESS') || t.includes('TONGUE') || t.includes('JOINTS') || t.includes('SNAP') || t.includes('INTERNAL') || t.includes('HIDDEN')) return Puzzle;
  if (t.includes('INSTALL') || t.includes('FIT') || t.includes('CUT') || t.includes('QUICK') || t.includes('SIMPLE') || t.includes('READY') || t.includes('CEMENT-FREE')) return Wrench;
  if (t.includes('GLUE-FREE') || t.includes('CLICK') || t.includes('UNICLICK')) return Zap;
  if (t.includes('CONSTRUCTION') || t.includes('ENGINEERING')) return Construction;
  if (t.includes('LIGHTWEIGHT') || t.includes('LOAD')) return Feather;
  
  // AESTHETICS & FEEL
  if (t.includes('WOOD') || t.includes('TEXTURE') || t.includes('FEEL') || t.includes('EIR') || t.includes('YARN') || t.includes('GRAIN') || t.includes('TONE')) return Fingerprint;
  if (t.includes('PAINT') || t.includes('COLOR') || t.includes('FINISH') || t.includes('POLISH') || t.includes('VARNISH')) return Paintbrush;
  if (t.includes('SIDES') || t.includes('DUAL')) return Copy;
  if (t.includes('LIGHT') || t.includes('LED') || t.includes('PROFILE')) return Lightbulb;
  if (t.includes('V-GROOVE') || t.includes('BEVELED') || t.includes('3D') || t.includes('REALISTIC') || t.includes('DESIGN')) return Maximize;
  
  // SAFETY & COMFORT
  if (t.includes('PET') || t.includes('CHILD') || t.includes('KID') || t.includes('NON-TOXIC') || t.includes('HYPOALLERGENIC')) return Heart;
  if (t.includes('SLIP') || t.includes('GRIP') || t.includes('SAFE')) return Footprints;
  if (t.includes('QUIET') || t.includes('SOUND') || t.includes('ACOUSTIC') || t.includes('NOISE') || t.includes('ECHO')) return VolumeX;
  if (t.includes('ECO') || t.includes('SUSTAINABLE') || t.includes('GREEN') || t.includes('RECYCLABLE')) return Leaf;
  if (t.includes('WIRES') || t.includes('DUCTS') || t.includes('CONCEAL') || t.includes('HIDE')) return ExternalLink;
  
  // MAINTENANCE
  if (t.includes('MAINTENANCE') || t.includes('CLEAN') || t.includes('ZERO MAINTENANCE')) return Sparkles;
  
  // DEFAULT
  return BadgeCheck;
};

export default function FeatureAccordion({ features, productTitle, heading, subheading }: FeatureAccordionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <section className="pt-20 pb-10 bg-white dark:bg-slate-950 transition-colors duration-500 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-[10px] font-semibold uppercase tracking-[0.3em] text-amber-600 mb-6 px-3 py-1 bg-amber-50 dark:bg-amber-900/20 rounded-sm"
          >
            {subheading || "Premium Engineering"}
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-semibold text-gray-900 dark:text-white mb-8 leading-tight"
          >
            {heading || (productTitle ? `Why Architects Choose ${productTitle}` : "Premium Materials for Luxury Interiors.")}
          </motion.h2>
        </div>

        {/* Desktop Accordion (Horizontal) */}
        <div className="hidden md:flex h-[510px] w-full gap-4 items-stretch">
          {features.map((feature, idx) => {
            const Icon = getFeatureIcon(feature.title);
            const isActive = activeIndex === idx;

            return (
              <motion.div
                key={idx}
                layout
                onMouseEnter={() => setActiveIndex(idx)}
                className={`relative rounded-[2.5rem] overflow-hidden cursor-pointer border shadow-2xl transition-colors duration-500 ${
                  isActive 
                    ? "bg-slate-900 border-white/20 dark:border-amber-500/30 shadow-amber-500/10" 
                    : "bg-gray-50 dark:bg-slate-900/50 border-gray-200 dark:border-white/5"
                }`}
                animate={{ 
                  flex: isActive ? 4 : 1,
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 30,
                  mass: 0.8
                }}
              >
                {/* Background Decor */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-gradient-to-br from-amber-600/10 via-transparent to-transparent pointer-events-none"
                    />
                  )}
                </AnimatePresence>

                <div className="relative h-full w-full p-8 flex flex-col justify-between">
                  {/* Top Icon */}
                  <motion.div 
                    layout
                    className={`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-500 ${
                      isActive ? "bg-amber-600 text-white shadow-lg shadow-amber-600/40" : "bg-white dark:bg-slate-800 text-gray-400"
                    }`}
                  >
                    <Icon className="w-7 h-7" />
                  </motion.div>

                  {/* Title & Description Container */}
                  <div className="flex-1 flex flex-col justify-center overflow-hidden">
                    {!isActive ? (
                      /* Shrunk State: Vertical Text */
                      <motion.h3 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-lg font-semibold text-gray-400 dark:text-gray-500 tracking-widest whitespace-nowrap origin-left rotate-90 absolute left-1/2 -translate-x-1/2 bottom-12 select-none"
                      >
                        {feature.title}
                      </motion.h3>
                    ) : (
                      /* Expanded State: Horizontal Content */
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-md pr-12"
                      >
                        <h3 className="text-2xl lg:text-3xl font-semibold text-white tracking-tight mb-4 leading-tight">
                          {feature.title}
                        </h3>
                        <p className="text-gray-400 text-lg leading-relaxed font-medium">
                          {feature.description}
                        </p>
                      </motion.div>
                    )}
                  </div>

                  {/* Bottom Number */}
                  <div className={`text-6xl font-black transition-colors duration-500 select-none ${
                    isActive ? "text-white/10" : "text-gray-200 dark:text-white/5"
                  }`}>
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile Layout (Tap-to-Expand Vertical Accordion) */}
        <div className="flex md:hidden flex-col gap-4">
          {features.map((feature, idx) => {
            const Icon = getFeatureIcon(feature.title);
            const isActive = activeIndex === idx;

            return (
              <motion.div
                key={idx}
                layout
                onClick={() => setActiveIndex(isActive ? null : idx)}
                className={`relative rounded-3xl overflow-hidden border transition-colors duration-500 shadow-xl ${
                  isActive 
                    ? "bg-slate-900 border-amber-500/30" 
                    : "bg-gray-50 dark:bg-slate-900/50 border-gray-200 dark:border-white/5"
                }`}
                initial={false}
              >
                <div className="p-5">
                  <div className="flex items-center gap-4">
                    {/* Icon Box */}
                    <motion.div 
                      layout
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-500 ${
                        isActive ? "bg-amber-600 text-white shadow-lg shadow-amber-600/40" : "bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-500"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </motion.div>

                    {/* Title */}
                    <motion.h3 
                      layout
                      className={`text-lg font-semibold tracking-tight transition-colors duration-500 ${
                        isActive ? "text-white" : "text-gray-900 dark:text-white"
                      }`}
                    >
                      {feature.title}
                    </motion.h3>

                    {/* Expanded Indicator */}
                    <motion.div 
                      layout
                      animate={{ rotate: isActive ? 180 : 0 }}
                      className={`ml-auto shrink-0 transition-colors ${isActive ? 'text-amber-500' : 'text-gray-400'}`}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m6 9 6 6 6-6"/>
                      </svg>
                    </motion.div>
                  </div>

                  {/* Description (Reveal on active) */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 pl-16 pr-4">
                          <p className="text-gray-400 text-sm leading-relaxed font-medium pb-2">
                            {feature.description}
                          </p>
                          <div className="text-xs font-bold text-amber-500/50 mt-2 tracking-widest uppercase">
                            Feature {String(idx + 1).padStart(2, '0')}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
