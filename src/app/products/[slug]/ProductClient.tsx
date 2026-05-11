"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent
} from "framer-motion";
import {
  ChevronRight, ShieldCheck, Droplets, Sun,
  Wrench, ArrowRight, CheckCircle2, Lock, Ruler, BarChart3,
  Plus, Minus, Palette, Hammer, Sparkles, Check,
  Layers, Weight, Flame, Box, Maximize, Zap, Package, X, ChevronLeft
} from "lucide-react";
import FeatureAccordion from "@/components/products/FeatureAccordion";
import QuickFeaturesBar from "@/components/products/QuickFeaturesBar";

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

export interface BeforeAfterItem {
  before: { url: string; alt: string };
  after: { url: string; alt: string };
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
  shortTitle?: string;
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
  installedImages?: {
    url: string;
    alt: string;
    aspect?: string;
    beforeAfter?: BeforeAfterItem;
  }[];
  beforeAfter?: BeforeAfterItem[];
  variants?: Variant[];
  architectHeading?: string;
  architectSubheading?: string;
  relatedLinks?: { label: string; href: string; image?: string }[];
}

interface ImageItem {
  url: string;
  alt: string;
}

interface ViewerDetail {
  label: string;
  value: string;
}

interface ViewerContext {
  title: string;
  category: string;
  priceRange: string;
  variants?: any[];
  description?: string;
  details?: ViewerDetail[];
  showDetails?: boolean;
}

interface FullscreenViewerState {
  imageUrl: string;
  images: ImageItem[];
  context: ViewerContext;
}

const StarRating = () => (
  <div className="flex items-center gap-1 mb-2">
    {[...Array(5)].map((_, i) => (
      <svg key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
    <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-2">4.9 Commercial Rating</span>
  </div>
);

const AnimationStyles = () => (
  <style dangerouslySetInnerHTML={{
    __html: `
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

const AbBadge = () => (
  <div className="absolute top-3 right-3 z-20">
    <Image
      src="/A%26B.png"
      alt="A/B compare available"
      width={78}
      height={36}
      className="h-6 w-auto drop-shadow-sm"
    />
  </div>
);

const BeforeAfterDemo = ({
  item
}: {
  item: BeforeAfterItem;
}) => {
  const [splitPercent, setSplitPercent] = useState(50);
  const frameRef = useRef<HTMLDivElement>(null);

  const updateSplitFromClientX = (clientX: number) => {
    if (!frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    const nextPercent = (relativeX / rect.width) * 100;
    setSplitPercent(Math.max(0, Math.min(100, nextPercent)));
  };

  return (
    <div
      ref={frameRef}
      className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-slate-900 shadow-sm select-none touch-none"
      onPointerMove={(e) => {
        if (e.buttons !== 1) return;
        updateSplitFromClientX(e.clientX);
      }}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        updateSplitFromClientX(e.clientX);
      }}
    >
      <Image
        src={item.before.url}
        alt={item.before.alt}
        fill
        sizes="(max-width: 1024px) 100vw, 960px"
        className="object-cover"
      />

      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 0 0 ${splitPercent}%)` }}
      >
        <Image
          src={item.after.url}
          alt={item.after.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 960px"
          className="object-cover"
        />
      </div>

      <div className="absolute top-3 left-3 flex gap-2 z-20">
        <span className="px-2 py-1 rounded-sm bg-black/65 text-white text-[10px] font-bold uppercase tracking-wider">Before</span>
        <span className="px-2 py-1 rounded-sm bg-white/90 text-gray-900 text-[10px] font-bold uppercase tracking-wider">After</span>
      </div>

      <AbBadge />

      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white/95 shadow-[0_0_8px_rgba(0,0,0,0.5)] z-20"
        style={{ left: `${splitPercent}%`, transform: "translateX(-50%)" }}
      />

      <div
        className="absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-2 border-white bg-black/55 backdrop-blur-sm text-white z-30 flex items-center justify-center text-xs font-bold"
        style={{ left: `${splitPercent}%`, transform: "translate(-50%, -50%)" }}
      >
        ↔
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={splitPercent}
        onChange={(e) => setSplitPercent(Number(e.target.value))}
        aria-label="Before and after image comparison"
        className="absolute inset-0 z-40 w-full h-full opacity-0 cursor-ew-resize"
      />
    </div>
  );
};

function collectProductImageUrls(product: Product) {
  const imageUrls = [
    ...(product.images || []).map((image) => image.url),
    ...(product.installedImages || []).map((image) => image.url),
    ...(product.beforeAfter || []).flatMap((pair) => [pair.before.url, pair.after.url]),
    ...(product.variants || []).flatMap((variant) => (variant.images || []).map((image) => image.url)),
  ];

  return Array.from(new Set(imageUrls.filter(Boolean)));
}

const VariantCard = ({
  variant,
  onVariantClick,
  onImageClick,
  productCategory,
  globalFullscreenImage
}: {
  variant: Variant,
  onVariantClick: (v: Variant) => void,
  onImageClick: (url: string, images: ImageItem[], context: ViewerContext) => void,
  productCategory: string,
  globalFullscreenImage: string | null
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const images = variant.images || [];
  const isImageFullscreen = images.some(img => img.url === globalFullscreenImage);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.clientWidth;
    const newIndex = Math.round(scrollLeft / width);
    if (newIndex !== activeIndex) setActiveIndex(newIndex);
  };

  // Auto-slide logic
  useEffect(() => {
    if (images.length <= 1 || isPaused || isImageFullscreen) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const nextIndex = (activeIndex + 1) % images.length;
        const width = scrollRef.current.clientWidth;
        scrollRef.current.scrollTo({
          left: nextIndex * width,
          behavior: "smooth"
        });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [activeIndex, images.length, isPaused, isImageFullscreen]);

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-sm shadow-sm hover:shadow-xl transition-all flex flex-col overflow-hidden group h-full"
    >
      {/* Image Carousel Area */}
      <div className="relative aspect-square bg-gray-100 dark:bg-slate-800 overflow-hidden">
        {images.length > 0 ? (
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide h-full"
          >
            {images.map((img, i) => (
              <div
                key={i}
                className="min-w-full h-full snap-center relative"
              >
                <div
                  className="absolute inset-0 cursor-zoom-in z-10"
                  onClick={() => onImageClick(
                    img.url,
                    images.map((image, imageIndex) => ({
                      url: image.url,
                      alt: image.alt || `${variant.name} detail ${imageIndex + 1}`
                    })),
                    {
                      title: variant.name,
                      category: productCategory,
                      priceRange: variant.price,
                      variants: [variant],
                      description: img.alt || `${variant.name} detail ${i + 1}`,
                      details: Object.entries(variant.details).slice(0, 4).map(([label, value]) => ({
                        label,
                        value
                      }))
                    }
                  )}
                />
                <Image
                  src={img.url}
                  alt={img.alt || `${variant.name} detail ${i + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 sm:group-hover:scale-105"
                />
                {/* ID Badge logic: Try to extract an ID from variant.name, otherwise use the first word */}
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2 py-1 rounded-sm z-20 border border-white/10">
                  <span className="text-[10px] text-white font-bold tracking-wider uppercase">
                    {images[activeIndex]?.name || variant.name.split(" ")[0]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
        )}

        {/* Left/Right Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (scrollRef.current) {
                  const newIndex = activeIndex === 0 ? images.length - 1 : activeIndex - 1;
                  scrollRef.current.scrollTo({ left: newIndex * scrollRef.current.clientWidth, behavior: "smooth" });
                }
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-1.5 bg-black/30 hover:bg-black/60 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (scrollRef.current) {
                  const newIndex = activeIndex === images.length - 1 ? 0 : activeIndex + 1;
                  scrollRef.current.scrollTo({ left: newIndex * scrollRef.current.clientWidth, behavior: "smooth" });
                }
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-1.5 bg-black/30 hover:bg-black/60 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {images.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to image ${i + 1}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (scrollRef.current) {
                    scrollRef.current.scrollTo({
                      left: i * scrollRef.current.clientWidth,
                      behavior: "smooth"
                    });
                    setActiveIndex(i);
                  }
                }}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  i === activeIndex ? "bg-amber-600 w-4" : "bg-white/50 w-1.5 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{variant.name}</h3>

        <div className="space-y-2 mb-6 flex-1">
          {images[activeIndex]?.name && (
            <div className="flex justify-between items-center text-sm border-b border-gray-100 dark:border-gray-800 pb-2 border-dotted group/spec">
              <span className="text-gray-500 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                Design Code
              </span>
              <span className="font-bold text-amber-600 dark:text-amber-500">{images[activeIndex].name}</span>
            </div>
          )}
          {Object.entries(variant.details).slice(0, 4).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center text-sm border-b border-gray-100 dark:border-gray-800 pb-2 border-dotted">
              <span className="text-gray-500">{key}</span>
              <span className="font-semibold text-gray-900 dark:text-gray-200 text-right">{value}</span>
            </div>
          ))}
        </div>

        <div className="mb-6 mt-auto">
          <div className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-1">
            {variant.price}
            {variant.unit && <span className="text-xs font-normal text-gray-500 lowercase">per {variant.unit}</span>}
          </div>
          {(variant.mrp || variant.discount) && (
            <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
              {variant.mrp && <span className="line-through">{variant.mrp}</span>}
              {variant.discount && <span className="text-green-600 font-semibold">{variant.discount}</span>}
            </div>
          )}
        </div>

        <button
          onClick={() => onVariantClick(variant)}
          className="w-full bg-gray-900 hover:bg-black dark:bg-amber-600 dark:hover:bg-amber-500 text-white font-semibold text-sm uppercase tracking-widest py-4 rounded-sm transition-colors mt-auto"
        >
          View Full Specs
        </button>
      </div>
    </div>
  );
};

export default function ProductClient({ product }: { product: Product }) {
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [activeDrawerImageIndex, setActiveDrawerImageIndex] = useState(0);

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
    const features = [
      { icon: ShieldCheck, title: "Commercial Grade", desc: "100% Termite & Borer Proof" },
      { icon: Droplets, title: "100% WATERPROOF", desc: "No Swelling / Decay" },
      { icon: Wrench, title: "Quick Install", desc: "Interlocking System" },
    ];

    // Only add Paintable and Unbreakable for Charcoal Moulding
    if (product.title.toLowerCase().includes("moulding")) {
      features.push({ icon: Palette, title: "PAINTABLE", desc: "Custom Color Ready" });
      features.push({ icon: Hammer, title: "Unbreakable", desc: "High Impact Strength" });
    }

    features.push({ icon: Zap, title: "GLUE DOWN", desc: "Maximum Grip Bond" });

    return features;
  };

  const quickFeatures = getQuickFeatures(product);

  const [fullscreenViewer, setFullscreenViewer] = useState<FullscreenViewerState | null>(null);
  const [comparePopupItem, setComparePopupItem] = useState<BeforeAfterItem | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isGalleryExpanded, setIsGalleryExpanded] = useState(false);

  const openFullscreenViewer = (imageUrl: string, images: ImageItem[], context: ViewerContext) => {
    setFullscreenViewer({ imageUrl, images, context });
  };

  const closeFullscreenViewer = () => setFullscreenViewer(null);

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

  // Parse numeric price from string (e.g., "₹180" -> 180)
  const parsePrice = (priceStr: string): number => {
    const numericValue = priceStr.replace(/[^0-9.]/g, "");
    return parseFloat(numericValue) || 0;
  };

  const variantPrices = (product.variants || []).map(v => parsePrice(v.price)).filter(p => p > 0);

  const seller = { "@type": "Brand", "name": "Goals Floors" };

  const offersSchema = variantPrices.length > 1
    ? {
      "@type": "AggregateOffer",
      "priceCurrency": "INR",
      "lowPrice": Math.min(...variantPrices),
      "highPrice": Math.max(...variantPrices),
      "offerCount": variantPrices.length,
      "availability": "https://schema.org/InStock",
      "seller": seller
    }
    : variantPrices.length === 1
      ? {
        "@type": "Offer",
        "priceCurrency": "INR",
        "price": variantPrices[0],
        "availability": "https://schema.org/InStock",
        "seller": seller
      }
      : {
        "@type": "Offer",
        "availability": "https://schema.org/InStock",
        "seller": seller
      };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "image": collectProductImageUrls(product),
    "description": product.shortDescription,
    "brand": { "@type": "Brand", "name": "Goals Floors" },
    "offers": offersSchema
  };

  const installedImages = product.installedImages || [];
  const compareItems = (product.beforeAfter || []).slice(0, 2);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans antialiased transition-colors duration-300 overflow-x-hidden max-w-full min-w-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ================= 1. CLEAN HERO OVERVIEW ================= */}
      <div className="border-b border-gray-200 dark:border-gray-800 pt-5 pb-8 lg:pt-5 lg:pb-5 text-left">
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
                className="text-xl md:text-3xl lg:text-4xl font-semibold text-gray-900 dark:text-white leading-[1.1] mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {product.title}
              </motion.h1>

              {/* Mobile Image: Shown only on mobile between heading and description */}
              <div className="lg:hidden relative aspect-[4/3] w-full mb-6 rounded-sm overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm bg-gray-50 dark:bg-slate-900 group/hero">
                {/* 2-Layer Technique: Layer 2 (Main Image) */}
                <Image
                  src={product.images[0].url}
                  alt={product.images[0].alt}
                  fill
                  className="object-cover relative z-10 transition-transform duration-700 hover:scale-105"
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
                {/* 2-Layer Technique: Layer 2 (Main Image) */}
                <Image
                  src={product.images[0].url}
                  alt={product.images[0].alt}
                  fill
                  className="object-cover relative z-10 transition-transform duration-700 hover:scale-105"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ================= 2. QUICK FEATURES (TRUST BAR) ================= */}
      <QuickFeaturesBar features={quickFeatures} />

      {/* ================= 4.5. PRODUCT VARIATIONS & PRICING ================= */}
      {product.variants && product.variants.length > 0 && (
        <div className="bg-gray-50 dark:bg-slate-900 pt-0 pb-12 lg:pt-4 lg:pb-10 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600 mb-4 px-3 py-1 bg-amber-50 dark:bg-amber-900/20 inline-block rounded-sm">
                Available Selection
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 dark:text-white">
                {product.shortTitle || product.title} Sizes & Project Pricing
              </h2>
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
                  <VariantCard
                    variant={variant}
                    productCategory={product.category}
                    onVariantClick={(v) => {
                      setSelectedVariant(v);
                      setActiveDrawerImageIndex(0);
                    }}
                    onImageClick={openFullscreenViewer}
                    globalFullscreenImage={fullscreenViewer?.imageUrl || null}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= 3. CORE SPECIFICATIONS / FEATURES ================= */}
      <FeatureAccordion
        features={product.features}
        productTitle={product.shortTitle || product.title}
        heading={product.architectHeading}
        subheading={product.architectSubheading}
      />

      {/* ================= 8.5. INSTALLED IMAGES (MASONRY) ================= */}
      {product.installedImages && product.installedImages.length > 0 && (
        <div className="bg-white dark:bg-slate-950 py-10 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {compareItems.length > 0 && (
              <div className="mb-8 md:mb-10">
                <div className="text-center mb-4 md:mb-5">
                  <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.28em] text-amber-600">
                    Before / After Demo
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Compare the difference by dragging the slider
                  </p>
                </div>
                <div className={compareItems.length === 1 ? "grid grid-cols-1 gap-4 md:gap-5 max-w-3xl mx-auto" : "grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5"}>
                  {compareItems.map((item, i) => (
                    <BeforeAfterDemo key={`before-after-${i}`} item={item} />
                  ))}
                </div>
              </div>
            )}

            <div className="text-center mb-10">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-600 mb-4 px-3 py-1 bg-amber-50 dark:bg-amber-900/20 inline-block rounded-sm">
                Project Gallery
              </p>
              <h2 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white mb-4 uppercase tracking-tight">
                {product.shortTitle || product.title} <span className="text-amber-600 italic">Installation Gallery</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-base font-medium">
                See how our premium {product.shortTitle || product.title} transforms real spaces across Delhi NCR. Clean, architectural, and built to last.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-2 md:gap-4 lg:h-[500px]">
              {product.installedImages.slice(0, 6).map((img, i) => (
                <motion.div
                  key={`first-${i}`}
                  className={`relative group ${img.beforeAfter ? "cursor-pointer" : ""} rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg transition-shadow duration-300 ${
                    i === 0 ? "lg:col-start-1 lg:row-start-1 h-[150px] md:h-[200px] lg:h-auto" :
                    i === 1 ? "lg:col-start-1 lg:row-start-2 h-[150px] md:h-[200px] lg:h-auto" :
                    i === 2 ? "lg:col-start-2 lg:row-start-1 lg:row-span-2 h-full" :
                    i === 3 ? "lg:col-start-3 lg:row-start-1 h-[150px] md:h-[200px] lg:h-auto" :
                    i === 4 ? "lg:col-start-3 lg:row-start-2 h-[150px] md:h-[200px] lg:h-auto" :
                    i === 5 ? "lg:col-start-4 lg:row-start-1 lg:row-span-2 h-full" : ""
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  onClick={() => {
                    if (img.beforeAfter) {
                      setComparePopupItem(img.beforeAfter);
                      return;
                    }
                    openFullscreenViewer(
                      img.url,
                      installedImages.slice(0, 6).map(image => ({ url: image.url, alt: image.alt })),
                      {
                        title: product.title,
                        category: product.category,
                        priceRange: product.priceRange,
                        variants: product.variants,
                        description: img.alt,
                        showDetails: false
                      }
                    );
                  }}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={img.url}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      className="object-cover transform-gpu transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                    {img.beforeAfter && <AbBadge />}
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="p-4 text-center">
                        <div className="w-10 h-10 rounded-full bg-white/25 flex items-center justify-center text-white mb-3 mx-auto">
                          <Plus className="w-6 h-6" />
                        </div>
                        <p className="text-[10px] font-bold text-white uppercase tracking-widest leading-tight px-2">
                          {img.beforeAfter ? "Compare Before / After" : img.alt}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {isGalleryExpanded && product.installedImages.length > 6 && (
              <div className="columns-2 md:columns-3 lg:columns-4 gap-2 md:gap-4 space-y-2 md:space-y-4 mt-2 md:mt-4 transition-all duration-700">
                {product.installedImages.slice(6).map((img, i) => (
                  <motion.div
                    key={`rest-${i}`}
                    className={`break-inside-avoid relative group ${img.beforeAfter ? "cursor-pointer" : ""} rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg transition-shadow duration-300`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: i * 0.01 }}
                    onClick={() => {
                      if (img.beforeAfter) {
                        setComparePopupItem(img.beforeAfter);
                        return;
                      }
                      openFullscreenViewer(
                        img.url,
                        installedImages.slice(6).map((image) => ({ url: image.url, alt: image.alt })),
                        {
                          title: product.title,
                          category: product.category,
                          priceRange: product.priceRange,
                          variants: product.variants,
                          description: img.alt,
                          showDetails: false
                        }
                      );
                    }}
                  >
                    <div className={`relative w-full ${
                      img.aspect === "portrait" ? "aspect-[3/4.5]" :
                      img.aspect === "landscape" ? "aspect-[4/3]" :
                      "aspect-square"
                    }`}>
                      <Image
                        src={img.url}
                        alt={img.alt}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        className="object-cover transform-gpu transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                      {img.beforeAfter && <AbBadge />}
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="p-4 text-center">
                          <div className="w-10 h-10 rounded-full bg-white/25 flex items-center justify-center text-white mb-3 mx-auto">
                            <Plus className="w-6 h-6" />
                          </div>
                          <p className="text-[10px] font-bold text-white uppercase tracking-widest">
                            {img.beforeAfter ? "Compare Before / After" : img.alt}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {product.installedImages.length > 6 && (
              <div className="mt-12 text-center">
                <button
                  onClick={() => setIsGalleryExpanded(!isGalleryExpanded)}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:border-amber-500/50 hover:text-amber-600 transition-all shadow-sm group"
                >
                  {isGalleryExpanded ? "Show Less" : `View All ${product.installedImages.length} Installed Images`}
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-500 ${isGalleryExpanded ? "-rotate-90" : "rotate-90"} group-hover:translate-x-0.5`} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

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
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-light italic border-l-4 border-amber-600 pl-6 py-2 text-justify">
                  {product.longDescription}
                </p>
              </div>
            </motion.div>

            {/* Right Column: Premium Staggered Images - Refined Size & Overlap */}
            <div className="relative h-[450px] md:h-[550px] w-full max-w-[500px] mx-auto lg:ml-auto translate-y-4">
              {product.images.slice(1, 3).map((img, i) => (
                <motion.div
                  key={i}
                  className={`absolute rounded-xl overflow-hidden shadow-2xl bg-gray-50 dark:bg-slate-900 border-2 border-white dark:border-slate-800 group/story transform-gpu will-change-transform ${i === 0
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
                  {/* 2-Layer Technique: Layer 2 (Main Image) */}
                  <Image
                    src={img.url}
                    alt={img.alt}
                    fill
                    className="object-cover relative z-10 transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}

              {/* Decorative Accent */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-amber-500/5 blur-2xl rounded-full -z-10" />
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
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Where to Use {product.shortTitle || product.title}</h2>
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
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/20 blur-2xl rounded-full pointer-events-none group-hover:bg-amber-500/30 transition-colors duration-500" />

                <div className="relative z-10">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-6 text-amber-500">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">Get a Custom Project Quote</h4>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                    Planning a large commercial or residential project in NCR? Get exact material estimation, project pricing, and dedicated B2B support.
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
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{product.shortTitle || product.title} Installation Guide</h2>
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mt-1">{product.shortTitle || product.title} (Professional Guide)</p>
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
                          className={`absolute left-0 top-0 w-10 h-10 rounded-full text-white text-sm font-semibold flex items-center justify-center shadow-lg z-30 transition-all duration-500 transform-gpu ${isActive
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
                <h2 className="text-2xl font-semibold text-white">{product.shortTitle || product.title} Installation Tips</h2>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed font-light text-justify">
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
                <h2 className="text-2xl font-semibold text-white">{product.shortTitle || product.title} Cleaning & Maintenance</h2>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed font-light text-justify">
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
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">Frequently Asked Questions About {product.shortTitle || product.title}</h2>
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

      {/* ================= 8.5. RELATED PRODUCTS ================= */}
      {product.relatedLinks && product.relatedLinks.length > 0 && (
        <div className="bg-gray-50 dark:bg-slate-900 py-12 lg:py-16 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.3em] text-amber-600 mb-3 px-3 py-1 bg-amber-50 dark:bg-amber-900/20 rounded-sm">
                Explore More
              </span>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
                {product.shortTitle || product.title} Related Products
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Complementary products for complete project solutions.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {product.relatedLinks.map((link, i) => (
                <Link
                  key={i}
                  href={link.href}
                  className="group relative flex flex-col bg-white dark:bg-slate-950 rounded-xl overflow-hidden border border-gray-300 dark:border-gray-700 hover:border-amber-500 dark:hover:border-amber-500 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-slate-800">
                    {link.image ? (
                      <Image
                        src={link.image}
                        alt={link.label}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Layers className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                      </div>
                    )}
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  {/* Label Section */}
                  <div className="flex items-center justify-between px-3 py-4 bg-gray-200 dark:bg-slate-900 border-t border-gray-200 dark:border-gray-800">
                    <span className="text-[11px] xs:text-sm md:text-base font-bold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors duration-300 leading-tight">
                      {link.label}
                    </span>
                    <ArrowRight className="w-4 h-4 text-amber-600 group-hover:text-amber-500 -translate-x-1 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-300 shrink-0 ml-2" />
                  </div>
                </Link>
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
            <h4 className="text-base font-semibold text-gray-900 dark:text-white">{product.shortTitle || product.title}</h4>
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

      {/* ================= 10. PREMIUM VARIANT DRAWER ================= */}
      <AnimatePresence>
        {selectedVariant && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVariant(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80]"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-full md:w-[480px] h-[100dvh] bg-white dark:bg-slate-900 z-[90] shadow-2xl border-l border-gray-200 dark:border-gray-800 overflow-y-auto overscroll-contain scrollbar-hide"
              data-lenis-prevent="true"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedVariant(null)}
                className="fixed top-4 right-4 z-[100] p-2 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-colors"
                aria-label="Close details"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Drawer Image Carousel */}
              <div className="relative h-64 md:h-80 w-full bg-gray-100 dark:bg-slate-800 group flex-shrink-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeDrawerImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 cursor-zoom-in"
                    onClick={() => {
                      const images = selectedVariant.images || [];
                      if (images.length > 0) {
                        openFullscreenViewer(
                          images[activeDrawerImageIndex].url,
                          images.map((image, imageIndex) => ({
                            url: image.url,
                            alt: image.alt || `${selectedVariant.name} detail ${imageIndex + 1}`
                          })),
                          {
                            title: selectedVariant.name,
                            category: product.category,
                            priceRange: selectedVariant.price,
                            variants: [selectedVariant],
                            description: images[activeDrawerImageIndex].alt || selectedVariant.name,
                            details: Object.entries(selectedVariant.details).slice(0, 4).map(([label, value]) => ({
                              label,
                              value
                            }))
                          }
                        );
                      }
                    }}
                  >
                    {selectedVariant.images && selectedVariant.images.length > 0 ? (
                      <Image
                        src={selectedVariant.images[activeDrawerImageIndex].url}
                        alt={selectedVariant.images[activeDrawerImageIndex].alt || selectedVariant.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">No Image Available</div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Left/Right Navigation Arrows */}
                {selectedVariant.images && selectedVariant.images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const len = selectedVariant.images?.length || 0;
                        setActiveDrawerImageIndex((prev) => (prev === 0 ? len - 1 : prev - 1));
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 bg-black/30 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-all transform hover:scale-110 active:scale-95 md:opacity-0 md:group-hover:opacity-100"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const len = selectedVariant.images?.length || 0;
                        setActiveDrawerImageIndex((prev) => (prev === len - 1 ? 0 : prev + 1));
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 bg-black/30 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-all transform hover:scale-110 active:scale-95 md:opacity-0 md:group-hover:opacity-100"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Indicators */}
                {selectedVariant.images && selectedVariant.images.length > 1 && (
                  <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2 z-10">
                    {selectedVariant.images.map((_, i) => (
                      <button
                        key={i}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDrawerImageIndex(i);
                        }}
                        className={`w-2 h-2 rounded-full transition-all ${i === activeDrawerImageIndex ? 'bg-white scale-125 w-4' : 'bg-white/50 hover:bg-white/80'
                          }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Specs Content */}
              <div className="p-6 md:p-10">
                <div className="border-b border-gray-200 dark:border-gray-800 pb-6 mb-8 relative">
                  <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-2">
                    {selectedVariant.name}
                  </h1>
                  <p className="text-sm font-medium text-amber-600 tracking-widest uppercase">Technical Specifications</p>

                  <div className="absolute top-0 right-0 text-gray-100 dark:text-slate-800 font-black text-6xl -z-10 tracking-tighter opacity-50 select-none overflow-hidden">
                    {product.category.split('-')[0].toUpperCase()}
                  </div>
                </div>

                <div className="grid grid-cols-[1fr_2fr] gap-y-5 mb-10">
                  {selectedVariant.images?.[activeDrawerImageIndex]?.name && (
                    <SpecRow label="Design Code" value={selectedVariant.images[activeDrawerImageIndex].name} />
                  )}
                  {Object.entries(selectedVariant.details).map(([key, value]) => (
                    <SpecRow key={key} label={key} value={value} />
                  ))}
                </div>

                <div className="bg-gray-50 dark:bg-slate-800/50 p-6 rounded-sm border border-gray-100 dark:border-gray-800 mb-8">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Project Pricing</h4>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-gray-900 dark:text-white">
                      {selectedVariant.price}
                    </span>
                    {selectedVariant.unit && (
                      <span className="text-sm font-semibold text-gray-500 lowercase">{selectedVariant.unit}</span>
                    )}
                  </div>
                  {selectedVariant.mrp && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm text-gray-400 line-through font-medium">{selectedVariant.mrp}</span>
                      {selectedVariant.discount && (
                        <span className="text-sm text-green-600 font-bold">{selectedVariant.discount} OFF</span>
                      )}
                    </div>
                  )}
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-4 leading-relaxed font-medium">
                    *Includes Tax. Freight & Installation are calculated extra based on project location in Delhi NCR.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <Link
                    href="/contact"
                    className="w-full bg-gray-900 dark:bg-amber-600 hover:bg-black dark:hover:bg-amber-500 text-white font-bold text-center uppercase tracking-widest py-4 rounded-sm transition-all shadow-lg hover:shadow-amber-500/20"
                    onClick={() => setSelectedVariant(null)}
                  >
                    Enquire for Project
                  </Link>
                  <a
                    href={`https://wa.me/917217644573?text=${encodeURIComponent(`Hi Goals Floors team, I am interested in ${product.title} (${selectedVariant.name}). Please share price and availability.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-center uppercase tracking-widest py-4 rounded-sm transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    Contact on WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ================= 11. FULLSCREEN LIGHTBOX ================= */}
      {fullscreenViewer && (
        <FullscreenImageViewer
          imageUrl={fullscreenViewer.imageUrl}
          allImages={fullscreenViewer.images}
          context={fullscreenViewer.context}
          onClose={closeFullscreenViewer}
          onNavigate={(url) => setFullscreenViewer((current) => current ? { ...current, imageUrl: url } : current)}
        />
      )}
      {/* ================= 12. BEFORE / AFTER POPUP ================= */}
      <AnimatePresence>
        {comparePopupItem && (
          <div 
            className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300"
            onClick={() => setComparePopupItem(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                className="absolute -top-14 right-0 md:-right-14 text-white/50 hover:text-white bg-white/10 hover:bg-white/20 p-2 md:p-3 rounded-full transition-all z-[130]"
                onClick={() => setComparePopupItem(null)}
                aria-label="Close compare view"
              >
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              
              <div className="rounded-xl overflow-hidden border border-white/10">
                <BeforeAfterDemo item={comparePopupItem} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

const SpecRow = ({ label, value }: { label: string; value: string }) => (
  <>
    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider py-1">{label}</div>
    <div className="text-sm font-semibold text-gray-900 dark:text-white py-1 flex items-start gap-3">
      <span className="text-amber-500">:</span>
      <span>{value}</span>
    </div>
  </>
);

const FullscreenImageViewer = dynamic(() => import("@/components/products/FullscreenImageViewer"), { ssr: false });
