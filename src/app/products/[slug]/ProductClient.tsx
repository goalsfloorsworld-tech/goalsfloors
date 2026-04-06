"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { 
  motion, 
  useScroll, 
  useSpring, 
  useTransform,
  useMotionValueEvent
} from "framer-motion";
import { 
  ChevronRight, ShieldCheck, Droplets, Sun, 
  Wrench, ArrowRight, CheckCircle2, Lock, Ruler, BarChart3,
  Plus, Minus, Palette, Hammer, Sparkles, Check,
  Layers, Weight, Flame, Box, Maximize, Zap, Package, X
} from "lucide-react";

export interface FAQ {
  question: string;
  answer: string;
}

export interface Variant {
  name: string;
  price: string;
  mrp?: string;
  discount?: string;
  unit?: string;
  images?: { url: string; alt: string; name?: string }[];
  details: Record<string, string>;
}

export interface Feature {
  title: string;
  description: string;
}

export interface InstallationStep {
  title: string;
  description?: string;
  points: string[];
  tip?: string;
}

export interface AfterInstallation {
  title: string;
  points: string[];
  tip?: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  category: string;
  priceRange: string;
  shortDescription: string;
  longDescription: string;
  features: Feature[];
  applications: string[];
  installationSteps: InstallationStep[];
  afterInstallation?: AfterInstallation;
  installation: string;
  maintenance: string;
  faqs: FAQ[];
  images: { url: string; alt: string }[];
  installedImages?: { url: string; alt: string; aspect?: string }[];
  variants?: Variant[];
}

const StarRating = () => (
  <div className="flex items-center gap-1 mb-2">
    {[...Array(5)].map((_, i) => (
      <svg key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
      </svg>
    ))}
    <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-2">4.9 Commercial Rating</span>
  </div>
);

const AnimationStyles = () => (
  <style dangerouslySetInnerHTML={{ __html: `
    @keyframes ripple {
      0% { transform: scale(1); opacity: 0.6; }
      100% { transform: scale(2.5); opacity: 0; }
    }
    @keyframes bounce-pop {
      0% { transform: scale(0.5); opacity: 0; }
      50% { transform: scale(1.15); }
      100% { transform: scale(1); opacity: 1; }
    }
    .animate-ripple {
      animation: ripple 1.2s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
    .animate-bounce-pop {
      animation: bounce-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }
  ` }} />
);

const VariantCard = ({ variant, onImageClick }: { variant: Variant, onImageClick: (url: string) => void }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const images = variant.images || [];

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.clientWidth;
    const newIndex = Math.round(scrollLeft / width);
    if (newIndex !== activeIndex) setActiveIndex(newIndex);
  };

  return (
    <div className="bg-white dark:bg-slate-950 shadow-xl rounded-sm border border-gray-200 dark:border-gray-800 flex flex-col h-full hover:border-amber-500/30 transition-all duration-300 group overflow-hidden">
      {images.length > 0 && (
        <div className="relative aspect-[3/2] bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800 overflow-hidden">
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide h-full"
          >
            {images.map((img, i) => (
              <div 
                key={i} 
                className="min-w-full h-full snap-center relative cursor-zoom-in"
                onClick={() => onImageClick(img.url)}
              >
                <Image 
                  src={img.url} 
                  alt={img.alt || `${variant.name} detail ${i + 1}`}
                  fill
                  className="object-cover relative z-10 transition-transform duration-500 sm:group-hover:scale-110"
                />

                {/* Variation Name Badge */}
                <div className="absolute top-2 left-2 z-20 px-2 py-0.5 bg-black/50 backdrop-blur-md rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[9px] font-bold text-white uppercase tracking-wider">
                    {img.name}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Indicators */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
              {images.map((_, i) => (
                <div 
                  key={i} 
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    i === activeIndex ? "bg-amber-600 w-4" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}
          
          <div className="absolute inset-0 bg-white/5 dark:bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none" />
        </div>
      )}

      <div className="p-4 flex flex-col flex-1">
        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-900 pb-4 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
          {images[activeIndex]?.name || variant.name}
        </h4>
        
        <div className="flex-1 space-y-2.5 mb-6">
          {Object.entries(variant.details).map(([key, value]) => (
            <div key={key} className="flex justify-between items-end gap-2 text-sm">
              <span className="text-gray-400 dark:text-gray-500 font-medium shrink-0">{key}</span>
              <div className="flex-1 border-b border-dotted border-gray-200 dark:border-gray-800 mb-1"></div>
              <span className="text-gray-900 dark:text-gray-300 font-semibold text-right">{value}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-900">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-gray-900 dark:text-white truncate">
              {variant.price}
            </span>
            {variant.unit && (
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400 lowercase truncate">
                {variant.unit}
              </span>
            )}
          </div>

          {(variant.mrp || variant.discount) && (
            <div className="flex items-center mt-1">
              {variant.mrp && (
                <span className="text-sm text-gray-400 dark:text-gray-500 line-through font-medium truncate">
                  {variant.mrp}
                </span>
              )}
              {variant.discount && (
                <span className="text-sm text-green-600 dark:text-green-500 font-bold ml-2 truncate">
                  {variant.discount}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function ProductClient({ product, slug }: { product: Product; slug: string }) {
  const getQuickFeatures = (p: Product) => {
    const isOutdoor = p.category === "outdoors";
    const isGrass = p.title.toLowerCase().includes("grass");
    const isPUStone = p.title.toLowerCase().includes("pu stone");
    const isSPC = p.category === "premium-flooring";

    if (isGrass) {
      return [
        { icon: Sun, title: "UV Protected", desc: "Non-Fading Green Color" },
        { icon: Droplets, title: "Drainage Holes", desc: "Quick Water Drainage" },
        { icon: ShieldCheck, title: "Commercial Grade", desc: "High Dtex Yarns" },
        { icon: Layers, title: "Lush Feel", desc: "Thick Pile Height" },
        { icon: CheckCircle2, title: "Pet & Child Safe", desc: "Non-Toxic Materials" },
        { icon: Zap, title: "Zero Maintenance", desc: "No Mowing or Watering" }
      ];
    }
    
    if (isOutdoor) {
      return [
        { icon: Sun, title: "UV Protected", desc: "Fade Resistant Finish" },
        { icon: Droplets, title: "100% WATERPROOF", desc: "All-Weather Proof" },
        { icon: ShieldCheck, title: "Commercial Grade", desc: "Heavy Foot Traffic Ready" },
        { icon: Wrench, title: "Quick Install", desc: "Concealed Clip System" },
        { icon: Flame, title: "Fire Retardant", desc: "Safe for Exteriors" },
        { icon: Zap, title: "Low Maintenance", desc: "No Polishing Required" }
      ];
    }

    if (isSPC) {
      return [
        { icon: ShieldCheck, title: "Commercial Grade", desc: "Heavy Duty Scratch Resistance" },
        { icon: Droplets, title: "100% WATERPROOF", desc: "Perfect for Kitchens & Baths" },
        { icon: Wrench, title: "Click-Lock System", desc: "Fast & Glue-less Install" },
        { icon: Flame, title: "Fire Retardant", desc: "B1 Class Safety" },
        { icon: CheckCircle2, title: "Acoustic Backing", desc: "Built-in Sound Reduction" },
        { icon: Hammer, title: "Stone Polymer Core", desc: "Superior Stability" }
      ];
    }

    if (isPUStone) {
      return [
        { icon: ShieldCheck, title: "Commercial Grade", desc: "Authentic Stone Texture" },
        { icon: Droplets, title: "100% WATERPROOF", desc: "Mildew Resistant" },
        { icon: Weight, title: "Lightweight", desc: "Easy to Handle & Mount" },
        { icon: Wrench, title: "Quick Install", desc: "Direct to Wall Application" },
        { icon: Flame, title: "Fire Retardant", desc: "B1 Class Safety" },
        { icon: Hammer, title: "Durable Polyurethane", desc: "High Impact Strength" }
      ];
    }

    // Default: Wall Panels (Charcoal Moulding, Fluted, etc.) - NO UV PROTECTED
    return [
      { icon: ShieldCheck, title: "Commercial Grade", desc: "100% Termite & Borer Proof" },
      { icon: Droplets, title: "100% WATERPROOF", desc: "No Swelling / Decay" },
      { icon: Wrench, title: "Quick Install", desc: "Interlocking System" },
      { icon: Palette, title: "PAINTABLE", desc: "Custom Color Ready" },
      { icon: Hammer, title: "Unbreakable", desc: "High Impact Strength" },
      { icon: Zap, title: "GLUE DOWN", desc: "Maximum Grip Bond" }
    ];
  };

  const quickFeatures = getQuickFeatures(product);

  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 80%", "end 75%"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Track the progress to update the active step state less frequently
  useMotionValueEvent(smoothProgress, "change", (latest) => {
    const stepCount = product.installationSteps.length;
    const currentStep = Math.floor(latest * stepCount);
    if (currentStep !== activeStep) {
      setActiveStep(currentStep);
    }
  });

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "image": product.images[0]?.url,
    "description": product.shortDescription,
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans antialiased transition-colors duration-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* ================= 1. CLEAN HERO OVERVIEW ================= */}
      <div className="border-b border-gray-200 dark:border-gray-800 pt-5 pb-8 lg:pt-1 lg:pb-5 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 items-center">
            
            <motion.div 
              className="w-full lg:w-1/2"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                type: 'spring', 
                stiffness: 100, 
                damping: 20, 
                staggerChildren: 0.2,
                delayChildren: 0.1
              }}
            >
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-4">
                <Link href="/" className="hover:text-amber-600 transition-colors">Home</Link>
                <ChevronRight className="w-3 h-3" />
                <Link href="/products" className="hover:text-amber-600 transition-colors">Products</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-gray-900 dark:text-gray-300">{product.category.replace('-', ' ')}</span>
              </div>
              
              <StarRating />
              
              <motion.h1 
                className="text-3xl md:text-5xl lg:text-6xl font-semibold text-gray-900 dark:text-white leading-[1.1] mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {product.title}
              </motion.h1>

              {/* Mobile Image: Shown only on mobile between heading and description */}
              <div className="lg:hidden relative aspect-[4/3] w-full mb-6 rounded-sm overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm bg-gray-50 dark:bg-slate-900 group/hero">
                {/* 2-Layer Technique: Layer 1 (Blurred BG) */}
                <Image 
                  src={product.images[0].url} 
                  alt="" 
                  fill 
                  className="object-cover blur-3xl opacity-50 scale-125 transition-transform duration-1000 group-hover/hero:scale-150" 
                />
                <div className="absolute inset-0 bg-white/20 dark:bg-black/30 backdrop-blur-[2px]" />
                {/* 2-Layer Technique: Layer 2 (Main Image) */}
                <Image 
                  src={product.images[0].url} 
                  alt={product.images[0].alt} 
                  fill 
                  className="object-cover relative z-10 transition-transform duration-700 hover:scale-110" 
                  priority 
                />
              </div>

              <motion.p 
                className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {product.shortDescription}
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row items-center gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                 <Link href="/contact" className="inline-flex items-center justify-center w-full sm:w-auto bg-gray-900 dark:bg-amber-600 text-white px-8 py-3.5 text-xs font-semibold uppercase tracking-widest hover:bg-amber-600 dark:hover:bg-amber-500 transition-colors">
                  Request Quote
                 </Link>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="w-full lg:w-1/2 hidden lg:block"
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, type: 'spring', stiffness: 50 }}
            >
              <div className="relative aspect-[4/3] w-full max-w-[600px] mx-auto bg-gray-50 dark:bg-slate-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm group/hero">
                {/* 2-Layer Technique: Layer 1 (Blurred BG) */}
                <Image 
                  src={product.images[0].url} 
                  alt="" 
                  fill 
                  className="object-cover blur-3xl opacity-60 scale-125 transition-transform duration-1000 group-hover/hero:scale-150" 
                />
                <div className="absolute inset-0 bg-white/20 dark:bg-black/40 backdrop-blur-[2px]" />
                {/* 2-Layer Technique: Layer 2 (Main Image) */}
                <Image 
                  src={product.images[0].url} 
                  alt={product.images[0].alt} 
                  fill 
                  className="object-cover relative z-10 transition-transform duration-700 hover:scale-110" 
                  priority 
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ================= 2. QUICK FEATURES ================= */}
      <div className="bg-gray-50 dark:bg-slate-900 py-8 lg:py-10 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-8">
            {quickFeatures.map((item, i) => (
              <motion.div 
                key={i} 
                className="flex flex-col items-center lg:items-start text-center lg:text-left hover:-translate-y-1 transition-transform cursor-default"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 150, 
                  damping: 15,
                  delay: i * 0.05 
                }}
              >
                <div className="w-10 h-10 bg-white dark:bg-slate-950 rounded-lg flex items-center justify-center mb-4 shadow-sm border border-gray-200 dark:border-gray-800 text-amber-600 dark:text-amber-500 transition-colors duration-300">
                  <item.icon className="w-5 h-5" />
                </div>
                <h4 className="text-[11px] lg:text-[12px] font-bold text-gray-900 dark:text-white mb-1 uppercase tracking-tight leading-tight">{item.title}</h4>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= 4.5. PRODUCT VARIATIONS & PRICING ================= */}
      {product.variants && product.variants.length > 0 && (
        <div className="bg-gray-50 dark:bg-slate-900 py-10 lg:py-24 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600 mb-4 px-3 py-1 bg-amber-50 dark:bg-amber-900/20 inline-block rounded-sm">
                Available Selection
              </h2>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 dark:text-white">
                Choose Your Size & Get Wholesale Pricing
              </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {product.variants.map((variant, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ 
                    duration: 0.7, 
                    delay: idx * 0.1,
                    type: 'spring',
                    stiffness: 80
                  }}
                >
                  <VariantCard variant={variant} onImageClick={setFullscreenImage} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}


      {/* ================= 3. CORE SPECIFICATIONS (FULL WIDTH) ================= */}
      <div className="bg-gray-50/50 dark:bg-slate-900/50 py-16 border-b border-gray-200 dark:border-gray-800/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 pb-6 border-b border-gray-200 dark:border-gray-800">
            <h4 className="text-3xl md:text-4xl font-bold uppercase tracking-tight text-gray-900 dark:text-white">Why Architects Choose Our Panels</h4>
            <p className="text-base font-medium text-gray-500 dark:text-gray-400 mt-3">Maximum performance for architectural standards</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-10">
            {product.features.map((feature, idx) => {
              const getFeatureIcon = (title: string) => {
                const t = title.toUpperCase();
                if (t.includes('WATERPROOF')) return Droplets;
                if (t.includes('CUT') || t.includes('FIT')) return Ruler;
                if (t.includes('SEAMLESS') || t.includes('INSTALL')) return Zap;
                if (t.includes('PAINT')) return Palette;
                if (t.includes('QUICK') || t.includes('SIMPLE')) return Wrench;
                if (t.includes('FREEDOM') || t.includes('DESIGN')) return Sparkles;
                if (t.includes('TERMITE')) return ShieldCheck;
                if (t.includes('FIRE')) return Flame;
                return CheckCircle2;
              };
              
              const Icon = getFeatureIcon(feature.title);

              return (
                <motion.div 
                  key={idx} 
                  className="group flex flex-col items-start focus-within:ring-2 focus-within:ring-amber-500 p-2 rounded-sm transition-all"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/10 p-2 rounded-sm group-hover:scale-110 transition-transform flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h5 className="text-base font-semibold text-gray-900 dark:text-white uppercase tracking-tight">
                      {feature.title}
                    </h5>
                  </div>
                  <p className="text-[15px] text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= 4. MATERIAL PHILOSOPHY (STORY) ================= */}
      <div className="bg-white dark:bg-slate-950 py-16 lg:py-24 transition-colors duration-300 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            {/* Left Column: The Narrative */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.3em] text-amber-600 mb-6 px-3 py-1 bg-amber-50 dark:bg-amber-900/20 rounded-sm">
                Material Philosophy
              </span>
              <h3 className="text-4xl md:text-5xl font-semibold text-gray-900 dark:text-white mb-8 leading-tight">
                Premium materials for <span className="text-amber-600">luxury</span> interiors.
              </h3>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-light italic border-l-4 border-amber-600 pl-6 py-2">
                  {product.longDescription}
                </p>
              </div>
            </motion.div>
            
            {/* Right Column: Premium Staggered Images - Refined Size & Overlap */}
            <div className="relative h-[450px] md:h-[550px] w-full max-w-[500px] mx-auto lg:ml-auto translate-y-4">
              {product.images.slice(1,3).map((img, i) => (
                <motion.div 
                  key={i} 
                  className={`absolute rounded-xl overflow-hidden shadow-2xl bg-gray-50 dark:bg-slate-900 border-2 border-white dark:border-slate-800 group/story transform-gpu will-change-transform ${
                    i === 0 
                    ? 'top-0 left-0 w-[65%] aspect-[4/5] z-0 hover:z-20' 
                    : 'bottom-0 right-0 w-[65%] aspect-[4/5] z-10 translate-x-2 translate-y-2 hover:scale-[1.02]'
                  }`}
                  initial={{ opacity: 0, x: 40, y: 20, rotate: i === 0 ? -5 : 5 }}
                  whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 1, 
                    delay: 0.2 + (i * 0.2),
                    type: 'spring',
                    stiffness: 40
                  }}
                >
                  {/* 2-Layer Technique: Layer 1 (Blurred BG) */}
                  <Image 
                    src={img.url} 
                    alt="" 
                    fill 
                    className="object-cover blur-3xl opacity-50 scale-125 transition-transform duration-1000 group-hover/story:scale-150" 
                  />
                  <div className="absolute inset-0 bg-white/20 dark:bg-black/40 backdrop-blur-[2px]" />
                  {/* 2-Layer Technique: Layer 2 (Main Image) */}
                  <Image 
                    src={img.url} 
                    alt={img.alt} 
                    fill 
                    className="object-cover relative z-10 transition-transform duration-700 hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
              
              {/* Decorative Accent */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-amber-500/5 blur-3xl rounded-full -z-10" />
            </div>
          </div>
        </div>
      </div>






      {/* ================= 6. APPLICATIONS & FINISHES ================= */}
      <div className="bg-white dark:bg-slate-950 py-8 lg:py-12 transition-colors duration-300 overflow-x-hidden">
        <AnimationStyles />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
            
            {/* Left Column: Applications & Sticky B2B Card */}
            <div className="lg:col-span-1 lg:sticky lg:top-28 h-fit">
              <div className="mb-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-500">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Where to Use These Panels</h3>
                </div>
                <ul className="space-y-0 border border-gray-200 dark:border-gray-800 rounded-sm overflow-hidden shadow-sm transition-colors duration-300">
                  {product.applications.map((app, i) => (
                    <motion.li 
                      key={i} 
                      className="flex items-center gap-4 p-5 bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                       <Check className="w-5 h-5 text-amber-500 shrink-0" />
                       <span className="text-base font-medium text-gray-800 dark:text-gray-300">{app}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* High-Converting B2B Sticky Card */}
              <motion.div 
                className="bg-gradient-to-br from-gray-900 to-slate-900 dark:from-slate-900 dark:to-black rounded-lg p-8 shadow-xl border border-gray-800 relative overflow-hidden group"
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {/* Decorative Glow */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/20 blur-3xl rounded-full pointer-events-none group-hover:bg-amber-500/30 transition-colors duration-500" />
                
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-6 text-amber-500">
                    <BarChart3 className="w-6 h-6" /> 
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">Get a Custom Project Quote</h4>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                    Planning a large commercial or residential project in NCR? Get exact material estimation, wholesale pricing, and dedicated B2B support.
                  </p>
                  <Link href="/contact" className="inline-flex items-center justify-center w-full bg-amber-600 hover:bg-amber-500 text-white px-6 py-3.5 rounded-sm text-sm font-semibold transition-all duration-300 hover:shadow-[0_0_15px_rgba(217,119,6,0.5)]">
                    Request Quote <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </motion.div>
            </div>
            
            {/* Installation Steps */}
              <div className="lg:col-span-1" ref={sectionRef}>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-500 shadow-sm transition-transform hover:scale-110 duration-300">
                    <Wrench className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Easy Installation Guide</h3>
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mt-1">{product.title} (Professional Guide)</p>
                  </div>
                </div>

              <div className="relative pb-0 mb-12">
                {/* The Continuous Background Track */}
                <div className="absolute left-[19px] top-5 bottom-8 w-0.5 bg-gray-100 dark:bg-gray-800 z-0" />
                
                {/* The Smooth Continuous Progress Line (GPU Accelerated) */}
                <motion.div 
                  className="absolute left-[19px] top-5 bottom-8 w-0.5 bg-gradient-to-b from-amber-400 via-orange-500 to-amber-600 z-10 shadow-[0_0_12px_rgba(245,158,11,0.6)] origin-top"
                  style={{ scaleY: smoothProgress }}
                />

                {/* Steps List */}
                <div className="space-y-12 relative z-20 pb-4">
                  {product.installationSteps.map((step, i) => {
                    const N = product.installationSteps.length;
                    const stepThreshold = i / (N - 1); 
                    const isActive = i <= activeStep;
                    
                    return (
                      <div key={i} className="relative pl-14 z-20">

                        {/* Step Number Circle */}
                        <div 
                          className={`absolute left-0 top-0 w-10 h-10 rounded-full text-white text-sm font-semibold flex items-center justify-center shadow-lg z-30 transition-all duration-500 transform-gpu ${
                            isActive 
                            ? 'bg-amber-600 dark:bg-amber-500 animate-bounce-pop shadow-amber-500/50' 
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 scale-90'
                          }`}
                        >
                          {/* Pulsing Ripple Wave */}
                          {isActive && (
                            <span className="absolute inset-0 rounded-full bg-amber-600/40 animate-ripple -z-10" />
                          )}
                          {i + 1}
                        </div>

                        {/* Content REVEAL animation - REMOVED BLUR FOR LAG-FREE PERFORMANCE */}
                        <div className={`space-y-4 transition-all duration-700 ease-out transform-gpu ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
                          <h4 className={`text-lg font-bold uppercase tracking-tight transition-colors duration-500 ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'}`}>{step.title}</h4>
                          
                          {step.description && (
                            <p className="text-sm font-semibold text-amber-600 dark:text-amber-500 italic">{step.description}</p>
                          )}

                          <ul className="space-y-4">
                            {step.points.map((point, pi) => (
                              <li key={pi} className="flex items-start gap-3">
                                <div className={`w-1.5 h-1.5 rounded-full mt-2.5 shrink-0 transition-all duration-500 ${isActive ? 'bg-amber-500' : 'bg-gray-300 dark:bg-gray-700'}`} />
                                <span className={`text-base font-medium leading-relaxed transition-colors duration-500 ${isActive ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-600'}`}>{point}</span>
                              </li>
                            ))}
                          </ul>

                          {step.tip && (
                            <div className={`mt-5 p-5 bg-amber-50/40 dark:bg-amber-900/10 border-l-4 rounded-r-xl transition-all duration-1000 ${isActive ? 'border-amber-500 translate-y-0 opacity-100' : 'border-gray-200 dark:border-gray-800 translate-y-4 opacity-0'}`}>
                              <p className="text-sm text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
                                 <span className="mr-3 text-xl inline-block">👉</span> {step.tip}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>  {/* Explicitly close the track wrapper here to prevent the line from bleeding down */}

              {/* After Installation - Separate Entrance - NOW OUTSIDE RELATIVE WRAPPER */}
              {product.afterInstallation && (
                <motion.div 
                  className="mt-32 pt-12 border-t border-gray-200 dark:border-gray-800"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40%" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm transition-transform hover:rotate-12">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-wider">{product.afterInstallation.title}</h4>
                  </div>

                  <ul className="space-y-4 mb-6">
                    {product.afterInstallation.points.map((point, pi) => (
                      <li key={pi} className="flex items-start gap-3 bg-gray-50/50 dark:bg-slate-900/50 p-3 rounded-lg border border-transparent hover:border-indigo-500/10 transition-colors">
                        <CheckCircle2 className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
                        <span className="text-base text-gray-700 dark:text-gray-300 font-medium">{point}</span>
                      </li>
                    ))}
                  </ul>

                  {product.afterInstallation.tip && (
                    <div className="p-5 bg-indigo-50/30 dark:bg-indigo-900/10 border-l-4 border-indigo-500 rounded-r-md">
                      <p className="text-sm text-gray-800 dark:text-gray-200 font-medium italic">
                         <span className="mr-2 text-lg">👉</span> {product.afterInstallation.tip}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= 7. INSTALLATION & CARE ================= */}
      <div className="bg-gray-900 dark:bg-black py-10 lg:py-16 text-white transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
            
            <motion.div 
              className="border-l-4 border-amber-600 pl-8"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-4 mb-4 text-amber-500">
                <Hammer className="w-6 h-6" />
                <h3 className="text-2xl font-semibold text-white">Pro Installation Tips</h3>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed font-light">
                {product.installation}
              </p>
            </motion.div>
            
            <motion.div 
              className="border-l-4 border-amber-600 pl-8"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-4 mb-4 text-amber-500">
                <Sparkles className="w-6 h-6" />
                <h3 className="text-2xl font-semibold text-white">How to Clean & Maintain</h3>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed font-light">
                {product.maintenance}
              </p>
            </motion.div>

          </div>
        </div>
      </div>

      {/* ================= 8. ARCHITECTURAL FAQS ================= */}
      <div className="bg-gray-50 dark:bg-slate-900 py-10 lg:py-16 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">Common Questions (FAQs)</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Detailed answers for project-level planning.</p>
          </div>
          
          <div className="space-y-4">
            {product.faqs.map((faq, i) => (
              <motion.div 
                key={i} 
                className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-950 rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <button 
                  onClick={() => toggleFaq(i)}
                  className="w-full text-left p-6 flex items-center justify-between focus:outline-none bg-white dark:bg-slate-950 group transition-colors duration-300"
                >
                  <h4 className={`text-base md:text-lg font-medium pr-8 transition-colors duration-300 ${openFaqIndex === i ? 'text-amber-600 dark:text-amber-500' : 'text-gray-900 dark:text-white'}`}>
                    {faq.question}
                  </h4>
                  <div className={`transition-transform duration-300 ${openFaqIndex === i ? 'rotate-180' : 'rotate-0'}`}>
                    {openFaqIndex === i ? (
                      <Minus className="w-5 h-5 text-amber-600 dark:text-amber-500 shrink-0" />
                    ) : (
                      <Plus className="w-5 h-5 text-gray-400 dark:text-gray-500 shrink-0 group-hover:text-gray-600 dark:group-hover:text-gray-400" />
                    )}
                  </div>
                </button>
                <div 
                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaqIndex === i ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mt-2 transition-colors duration-300">
                    <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>


      {/* ================= 8.5. INSTALLED IMAGES (MASONRY) ================= */}
      {product.installedImages && product.installedImages.length > 0 && (
        <div className="bg-white dark:bg-slate-950 py-16 lg:py-24 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-600 mb-4 px-3 py-1 bg-amber-50 dark:bg-amber-900/20 inline-block rounded-sm">
                Project Gallery
              </h2>
              <h3 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 uppercase tracking-tight">
                Installed <span className="text-amber-600 italic">Visuals</span>
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg font-medium">
                See how our premium {product.title} transforms real spaces across Delhi NCR. Clean, architectural, and built to last.
              </p>
            </div>

            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {product.installedImages.map((img, i) => (
                <motion.div
                  key={i}
                  className="break-inside-avoid relative group cursor-zoom-in rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl transition-all duration-500"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  onClick={() => setFullscreenImage(img.url)}
                >
                  <div className="relative w-full">
                    <img 
                      src={img.url} 
                      alt={img.alt}
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="p-4 text-center">
                         <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-3 mx-auto">
                            <Plus className="w-6 h-6" />
                         </div>
                         <p className="text-xs font-bold text-white uppercase tracking-widest">{img.alt}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= 9. B2B CONVERSION BAR ================= */}
      <motion.div 
        className="bg-white dark:bg-slate-950 py-4 shadow-md border-t border-gray-200 dark:border-gray-800 relative z-20 transition-colors duration-300"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <h4 className="text-base font-semibold text-gray-900 dark:text-white">{product.title}</h4>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-1 hidden md:flex">
               <Lock className="w-3 h-3 text-green-600 dark:text-green-500" />
               <p className="text-xs font-semibold uppercase tracking-wider text-green-700 dark:text-green-500">Premium B2B Fulfillment in NCR</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <a href="tel:+917217644573" className="flex items-center justify-center border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors rounded-sm w-full sm:w-auto">
              Call Specialist
            </a>
            <Link href="/contact" className="flex items-center justify-center gap-2 bg-gray-900 dark:bg-amber-600 text-white px-8 py-3 text-sm font-medium hover:bg-amber-600 dark:hover:bg-amber-500 transition-colors shadow-sm rounded-sm w-full sm:w-auto">
              Request Full Quote <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ================= 10. FULLSCREEN LIGHTBOX ================= */}
      {fullscreenImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-10 transition-all animate-in fade-in duration-300"
          onClick={() => setFullscreenImage(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all z-[110]"
            onClick={(e) => {
              e.stopPropagation();
              setFullscreenImage(null);
            }}
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative w-full h-full flex items-center justify-center">
            <Image 
              src={fullscreenImage} 
              alt="Fullscreen view" 
              fill 
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}

    </div>
  );
}
