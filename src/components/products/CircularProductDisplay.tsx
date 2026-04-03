"use client";

import { useState, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent, AnimatePresence } from "framer-motion";

import { ArrowRight, Info } from "lucide-react";
import { Product } from "@/app/products/ProductsClient";

interface CircularProductDisplayProps {
  products: Product[];
  scrollIntensity?: number;
  activeCategory?: string;
}

export default function CircularProductDisplay({ 
  products, 
  scrollIntensity = 600,
  activeCategory = "All"
}: CircularProductDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Total height needed for rotation: (N-1) items * intensity
  const totalHeight = (products.length - 1) * scrollIntensity;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"] 
  });

  // Track raw scroll for instant text updates, while wheel uses smoothProgress
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const totalItems = productsRef.current.length;
    if (totalItems <= 1) return;

    const rawIndex = latest * (totalItems - 1);
    const newIndex = Math.round(rawIndex);
    const safeIndex = Math.min(Math.max(newIndex, 0), totalItems - 1);
    
    setActiveIndex(prev => {
        if (prev !== safeIndex) return safeIndex;
        return prev;
    });
  });

  // Snappier spring for the visual wheel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 20,
    restDelta: 0.001
  });

  const [activeIndex, setActiveIndex] = useState(0);

  const productsRef = useRef(products);
  productsRef.current = products;



  const activeProduct = products[activeIndex];

  const scrollToIndex = (index: number) => {
    // 2. Desktop Specific: Scroll to the exactly correct index
    if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const containerTop = rect.top + window.scrollY;
        const targetScroll = containerTop + (index * scrollIntensity);
        
        window.scrollTo({
            top: targetScroll,
            behavior: "smooth"
        });
    }
  };




  // Circle Geometry - 3D Wheel Configuration
  const RADIUS = 700; // Tighter radius for more circular feel
  // Angle step: How many degrees between products
  const ANGLE_STEP = 28; // Increased for better spacing on the tighter curve
  
  // Total rotation needed to bring the last product to center (0 degrees)
  const totalRotation = (products.length - 1) * ANGLE_STEP;



  return (
    <div 
      ref={containerRef} 
      className="relative w-full hidden lg:block"
      style={{ height: `calc(${totalHeight}px + 100vh)` }} 
    >

      <div className="sticky top-0 h-screen w-full overflow-hidden pointer-events-none" style={{ perspective: "2000px" }}>
        {/* Dynamic Rotation Layer - Shifted center right for clearance */}
        <div 
          className="absolute top-1/2 -translate-y-1/2" 
          style={{ 
            left: "calc(100% + clamp(50px, 12vw, 250px))",
            transformStyle: "preserve-3d" 
          }}
        >


          {products.map((product, index) => {
            return (
              <ProductCard 
                key={`${product.slug}-${index}`}
                product={product}
                index={index}
                progress={smoothProgress}
                totalRotation={totalRotation}
                angleStep={ANGLE_STEP}
                radius={RADIUS}
                activeCategory={activeCategory}
                onClick={() => scrollToIndex(index)}
              />
            );
          })}
        </div>

        {/* Cinematic Backdrop Elements - Synchronized with new center/radius */}
        <div 
          className="absolute inset-0 z-[-1] opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
          style={{ left: "clamp(50px, 12vw, 250px)" }}
        >
            <div className="absolute top-1/2 left-full -translate-x-1/2 -translate-y-1/2 w-[1800px] h-[1800px] border-[40px] border-amber-500 rounded-full blur-3xl opacity-20" />
            <div className="absolute top-1/2 left-full -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[1400px] border border-stone-200 dark:border-slate-800 rounded-full" />
            <div className="absolute top-1/2 left-full -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] border border-stone-200/50 dark:border-slate-800/50 rounded-full border-dashed" />
        </div>


        {/* Separated Info Panel - Fluid Left Side positioning */}
        <div className="absolute top-0 bottom-0 left-[clamp(5%,7vw,10%)] w-[clamp(300px,30vw,420px)] flex flex-col justify-center z-10 pointer-events-none">

          <div className="relative w-full h-[400px]">
            <AnimatePresence initial={false}>
              {activeProduct && (
                <motion.div
                  key={activeProduct.slug}
                  initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -20, filter: "blur(4px)", position: "absolute" }}
                  transition={{ 
                    duration: 0.4, 
                    ease: [0.23, 1, 0.32, 1]
                  }}
                  className="flex flex-col gap-6 pointer-events-auto w-full top-0 left-0"
                >
                <div className="flex flex-col gap-2">
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-xs font-black text-amber-500 uppercase tracking-[0.4em]"
                  >
                    {activeProduct.category}
                  </motion.span>
                  <motion.h2 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="text-5xl font-black text-stone-900 dark:text-white tracking-tight leading-[0.95]"
                  >
                    {activeProduct.title}
                  </motion.h2>
                </div>

                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-stone-500 dark:text-slate-400 text-base leading-relaxed line-clamp-3 font-medium"
                >
                  {activeProduct.shortDescription}
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25 }}
                  className="flex items-center gap-6 mt-4"
                >
                  <Link 
                    href={`/products/${activeProduct.slug}`}
                    className="flex items-center gap-4 bg-stone-900 dark:bg-amber-600 text-white px-8 py-5 rounded-full font-bold uppercase tracking-widest text-[11px] group hover:scale-105 transition-transform"
                  >
                    View Specifications
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-stone-400 dark:text-slate-500 uppercase tracking-[0.2em]">Price Grade</span>
                    <span className="text-sm font-bold text-stone-900 dark:text-white">{activeProduct.priceRange || 'Premium Grade'}</span>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      </div>
    </div>
  );
}

function ProductCard({ 
  product, 
  index, 
  progress, 
  totalRotation, 
  angleStep, 
  radius,
  activeCategory,
  onClick
}: { 
  product: Product; 
  index: number; 
  progress: any; 
  totalRotation: number; 
  angleStep: number; 
  radius: number;
  activeCategory: string;
  onClick: () => void;
}) {

  const isMatch = activeCategory === "All" || product.category === activeCategory;

  const baseAngleDeg = -index * angleStep;
  const rotationOffset = useTransform(progress, [0, 1], [0, totalRotation]);
  const currentAngleDeg = useTransform(rotationOffset, (v: number) => v + baseAngleDeg);

  // 5 Visible Products Logic:
  // Center (0 deg): 100% opacity, 1.1 scale
  // +/- ANGLE_STEP: 60% opacity, 0.9 scale
  // +/- 2*ANGLE_STEP: 20% opacity, 0.7 scale
  // Beyond: 0% opacity
  const opacityValue = useTransform(
    currentAngleDeg, 
    [-angleStep * 3, -angleStep * 2.5, -angleStep * 1.5, 0, angleStep * 1.5, angleStep * 2.5, angleStep * 3], 
    [0, 0, 0.4, 1, 0.4, 0, 0]
  );

  
  // Combine wheel opacity with category filter opacity
  const opacity = useTransform(opacityValue, (v: number) => isMatch ? v : v * 0.2);

  const scale = useTransform(
    currentAngleDeg, 
    [-angleStep * 2.5, -angleStep * 1.5, 0, angleStep * 1.5, angleStep * 2.5], 
    [0.5, 0.8, 1.15, 0.8, 0.5]
  );



  const z = useTransform(currentAngleDeg, (v: number) => Math.abs(v) < 1 ? 100 : 0);

  // Exaggerated 3D Rotation to maintain "drum" feel despite shifted center
  const rotateY = useTransform(currentAngleDeg, [-angleStep * 2, 0, angleStep * 2], [25, 0, -25]);
  const rotateX = useTransform(currentAngleDeg, [-angleStep * 2, 0, angleStep * 2], [-15, 0, 15]);



  // Coordinates - 180 degrees is the focus point (left of the right-anchored center)
  const x = useTransform(currentAngleDeg, (v: number) => {
    const rad = (v + 180) * (Math.PI / 180);
    return Math.cos(rad) * radius;
  });
  
  const y = useTransform(currentAngleDeg, (v: number) => {
    const rad = (v + 180) * (Math.PI / 180);
    return Math.sin(rad) * radius;
  });

  return (
    <motion.div
      onClick={onClick}
      style={{
        position: "absolute",
        x,
        y,
        opacity,
        scale,
        rotateY,
        rotateX,
        zIndex: z,
        filter: isMatch ? "none" : "grayscale(0.8) blur(2px)",
        width: "420px",
        height: "240px",
        translateX: "-50%",
        translateY: "-50%",
        transformOrigin: "center center",
        cursor: "pointer",
      }}

      className="pointer-events-auto cursor-pointer"
    >
      <div 
        className="group block relative w-full h-full bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:shadow-2xl transition-all duration-700 overflow-hidden rounded-3xl"
      >
        <div className="absolute inset-0">
          <Image
            src={product.images?.[0]?.url || '/placeholder.jpg'}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-black/40 transition-colors" />
        </div>

        <div className="absolute top-6 left-6 z-10">
            <div className="bg-amber-600/90 backdrop-blur-sm text-white text-[8px] font-black px-4 py-1.5 uppercase tracking-widest shadow-lg rounded-full">
                {product.priceRange || 'Premium'}
            </div>
        </div>
      </div>
    </motion.div>
  );
}

