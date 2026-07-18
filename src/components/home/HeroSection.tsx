"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ChevronRight, ShieldCheck, Layers, Clock, Award, ArrowRight } from "lucide-react";
import { gsap } from "gsap";

const GLOW_COLOR = '183, 92, 0'; // #B75C00

const desktopHeroImages = [
  {
    src: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto,w_800/v1775749408/Goals_Floors_Wall_Panels.png",
    alt: "Premium Wall Panels"
  },
  {
    src: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto,w_1920/v1775573402/Goals_Floors_Premium_Wall_Panel.png",
    alt: "Premium Wall Panel by Goals Floors"
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
  },
  {
    src: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772476444/artificial_grass_supplier_in_india.jpg",
    alt: "Premium Artificial Grass Project Supplier in India NCR"
  },
  {
    src: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772477246/Pu_Stone_Colors.jpg",
    alt: "Cobra PU Stone Panel Color Options for Luxury Interiors in Delhi NCR"
  },
  {
    src: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775411703/Luxury_Penthouse_Living_Room_with_Light_Oak_Herringbone_Flooring_Gurugram.jpg",
    alt: "Luxury Penthouse Living Room with Light Oak Herringbone Flooring Gurugram"
  },
  {
    src: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772477090/Ocean_Waterproof_Laminate_FLooring.jpg",
    alt: "Waterproof Hybrid Wooden Flooring Installation in Gurgaon Kitchen"
  },
  {
    src: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775544853/oak_color_laminate_flooring_installed_images.png",
    alt: "oak_color_laminate_flooring_installed"
  },
  {
    src: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1774612492/screenshot-2024-11-05-074302-YKb68R7lNDueGKEV.jpg",
    alt: "Cobra Gold SPC Waterproof Flooring Project Supplier Gurugram NCR"
  },
  {
    src: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1774970794/charcoal-gray_paneled_wall..jpg",
    alt: "charcoal-gray_paneled_wall"
  },
  {
    src: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1774525633/goals-floors-upfit-panels-m7Vw49PE2qSaDNaG.jpg",
    alt: "Waterproof Upfit Upfit Ceiling Panels for Balcony and Exterior Ceilings in Gurugram"
  },
  {
    src: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772477058/Wpc_Fluted_Panel_In_Gurgaon.png",
    alt: "Premium WPC fluted wall panel application by Goals Floors"
  },
  {
    src: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775466342/screenshot-2024-10-27-180236-1-AQEyyylJkGUBqyED.webp",
    alt: "Luxury WPC Baffle Ceiling design for modern corporate office in Gurgaon"
  },
  {
    src: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772478659/premium_wpc_decking_supplier_in_gurgaon.jpg",
    alt: "Anti-Slip WPC Outdoor Decking Planks Supplier in Gurugram NCR"
  },
  {
    src: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775818177/exterior_louvaring.jpg",
    alt: "Modern Exterior WPC Fluted Louvers for Luxury Front Elevation Design"
  },
  {
    src: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772478739/Timber_Tube.png",
    alt: "Modern vertical WPC timber tube partition in Gurugram interior"
  },
  {
      src: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Luxury_Master_Bathroom_in_Delhi_Villa_with_Waterproof_Cobra_Gold_SPC_Flooring.jpg",
      alt: "Luxury Master Bathroom in Delhi Villa with Waterproof Cobra Gold SPC Flooring",
      
    },
];

const Hexagon = ({ imgUrl, xOffset, yOffset, sizeClass, innerSizeClass, zIndex, baseLeft = 'calc(50% - 90px)', baseTop = 'calc(50% - 78px)', clipPath = 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)', waveDirection = 'rtl' }: any) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const isHoveredRef = useRef(false);
  const memoizedParticles = useRef<HTMLDivElement[]>([]);
  const particlesInitialized = useRef(false);
  const magnetismAnimationRef = useRef<any>(null);

  const initializeParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return;
    const { width, height } = cardRef.current.getBoundingClientRect();
    memoizedParticles.current = Array.from({ length: 8 }, () => {
      const el = document.createElement('div');
      el.className = 'hexagon-particle';
      el.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: rgba(${GLOW_COLOR}, 1);
        box-shadow: 0 0 8px rgba(${GLOW_COLOR}, 0.8);
        pointer-events: none;
        z-index: 100;
        left: ${Math.random() * width}px;
        top: ${Math.random() * height}px;
      `;
      return el;
    });
    particlesInitialized.current = true;
  }, []);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    magnetismAnimationRef.current?.kill();
    particlesRef.current.forEach(particle => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'back.in(1.7)',
        onComplete: () => particle.parentNode?.removeChild(particle)
      });
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;
    if (!particlesInitialized.current) initializeParticles();

    memoizedParticles.current.forEach((particle, index) => {
      const timeoutId = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;
        const clone = particle.cloneNode(true) as HTMLDivElement;
        cardRef.current.appendChild(clone);
        particlesRef.current.push(clone);

        gsap.fromTo(clone, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' });
        gsap.to(clone, {
          x: (Math.random() - 0.5) * 80,
          y: (Math.random() - 0.5) * 80,
          rotation: Math.random() * 360,
          duration: 1.5 + Math.random() * 2,
          ease: 'none',
          repeat: -1,
          yoyo: true
        });
        gsap.to(clone, {
          opacity: 0.3,
          duration: 1,
          ease: 'power2.inOut',
          repeat: -1,
          yoyo: true
        });
      }, index * 100);
      timeoutsRef.current.push(timeoutId);
    });
  }, [initializeParticles]);

  useEffect(() => {
    const element = cardRef.current;
    if (!element) return;

    // Entrance animation
    const initialDelay = waveDirection === 'ttb' ? yOffset * 0.003 : (414 - xOffset) * 0.001;
    gsap.fromTo(element,
      { scale: 0, opacity: 0, y: 80 },
      { scale: 1, opacity: 1, y: 0, duration: 1, ease: "elastic.out(1, 0.75)", delay: initialDelay }
    );

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      animateParticles();
      gsap.to(element, {
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      clearAllParticles();
      gsap.to(element, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    let hexRaf: number | null = null;
    const handleMouseMove = (e: MouseEvent) => {
      if (hexRaf) cancelAnimationFrame(hexRaf);
      hexRaf = requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -15;
        const rotateY = ((x - centerX) / centerX) * 15;
        
        gsap.to(element, {
          rotateX,
          rotateY,
          duration: 0.1,
          ease: 'power2.out',
          transformPerspective: 1000
        });
      });
    };

    const handleClick = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const maxDistance = Math.max(
        Math.hypot(x, y), Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height), Math.hypot(x - rect.width, y - rect.height)
      );
      const ripple = document.createElement('div');
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${GLOW_COLOR}, 0.5) 0%, rgba(${GLOW_COLOR}, 0.2) 30%, transparent 70%);
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 1000;
      `;
      element.appendChild(ripple);
      gsap.fromTo(ripple, { scale: 0, opacity: 1 }, {
        scale: 1, opacity: 0, duration: 0.8, ease: 'power2.out',
        onComplete: () => ripple.remove()
      });
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('click', handleClick);

    return () => {
      isHoveredRef.current = false;
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('click', handleClick);
      clearAllParticles();
    };
  }, [animateParticles, clearAllParticles]);

  return (
    <div 
      className={`absolute ${sizeClass} flex items-center justify-center ${zIndex} magic-hexagon-container`}
      style={{ 
        left: baseLeft, 
        top: baseTop,
        transform: `translate(${xOffset}px, ${yOffset}px)`,
        filter: 'drop-shadow(0px 8px 16px rgba(0,0,0,0.12))',
      }}
    >
      <div 
        ref={cardRef}
        className="absolute inset-0 flex items-center justify-center magic-hexagon-border group" 
        style={{ 
          clipPath: clipPath,
          cursor: 'pointer',
          '--glow-intensity': '0',
          '--glow-x': '50%',
          '--glow-y': '50%',
          background: `radial-gradient(circle at var(--glow-x) var(--glow-y), rgba(255, 150, 50, calc(var(--glow-intensity) * 1)) 0%, rgba(183, 92, 0, 1) 40%)`,
          opacity: 0,
          transform: 'scale(0) translateY(80px)'
        } as any}
      >
        <div 
          className={`relative ${innerSizeClass} overflow-hidden bg-gray-100 dark:bg-slate-900 pointer-events-none`} 
          style={{ clipPath: clipPath }}
        >
          <div className="absolute inset-0">
            <Image 
              src={imgUrl} 
              fill 
              className="object-cover transition-transform duration-500 group-hover:scale-110" 
              alt="Interior Design" 
              sizes="(max-width: 768px) 50vw, 30vw" 
              priority 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const GlobalSpotlight = ({ gridRef }: { gridRef: any }) => {
  const spotlightRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!gridRef.current) return;
    
    const spotlightRadius = 350;
    const spotlight = document.createElement('div');
    spotlight.style.cssText = `
      position: fixed;
      width: 800px;
      height: 800px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${GLOW_COLOR}, 0.25) 0%,
        rgba(${GLOW_COLOR}, 0.15) 15%,
        rgba(${GLOW_COLOR}, 0.05) 25%,
        transparent 70%
      );
      z-index: 200;
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
      will-change: transform, opacity;
    `;
    document.body.appendChild(spotlight);
    spotlightRef.current = spotlight;

    let cachedCards: any[] = [];
    let cacheTimeout: any;

    const updateCache = () => {
      if (!gridRef.current) return;
      const cards = gridRef.current.querySelectorAll('.magic-hexagon-border');
      cachedCards = Array.from(cards).map((card: any) => {
        const rect = card.getBoundingClientRect();
        return {
          el: card,
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
          centerX: rect.left + rect.width / 2,
          centerY: rect.top + rect.height / 2
        };
      });
    };

    // Cache after entrance animations complete, and update on resize
    cacheTimeout = setTimeout(updateCache, 2000);
    window.addEventListener('resize', updateCache, { passive: true });
    window.addEventListener('scroll', updateCache, { passive: true });

    let rafId: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (!spotlightRef.current || !gridRef.current || cachedCards.length === 0) return;

      if (rafId) cancelAnimationFrame(rafId);
      
      rafId = requestAnimationFrame(() => {
        const rect = gridRef.current.getBoundingClientRect();
        const mouseInside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;

        if (!mouseInside) {
          gsap.to(spotlightRef.current, { opacity: 0, duration: 0.3, ease: 'power2.out' });
          cachedCards.forEach(card => card.el.style.setProperty('--glow-intensity', '0'));
          return;
        }

        const proximity = spotlightRadius * 0.5;
        const fadeDistance = spotlightRadius * 0.75;
        let minDistance = Infinity;

        cachedCards.forEach(card => {
          const distance = Math.hypot(e.clientX - card.centerX, e.clientY - card.centerY) - Math.max(card.width, card.height) / 2;
          const effectiveDistance = Math.max(0, distance);
          minDistance = Math.min(minDistance, effectiveDistance);

          let glowIntensity = 0;
          if (effectiveDistance <= proximity) {
            glowIntensity = 1;
          } else if (effectiveDistance <= fadeDistance) {
            glowIntensity = (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
          }

          const relativeX = ((e.clientX - card.left) / card.width) * 100;
          const relativeY = ((e.clientY - card.top) / card.height) * 100;
          
          card.el.style.setProperty('--glow-x', `${relativeX}%`);
          card.el.style.setProperty('--glow-y', `${relativeY}%`);
          card.el.style.setProperty('--glow-intensity', glowIntensity.toString());
        });

        gsap.to(spotlightRef.current, { left: e.clientX, top: e.clientY, duration: 0.1, ease: 'power2.out' });
        
        const targetOpacity = minDistance <= proximity ? 0.8 : minDistance <= fadeDistance ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.8 : 0;
        gsap.to(spotlightRef.current, { opacity: targetOpacity, duration: targetOpacity > 0 ? 0.2 : 0.5, ease: 'power2.out' });
      });
    };

    const handleMouseLeave = () => {
      cachedCards.forEach(card => card.el.style.setProperty('--glow-intensity', '0'));
      if (spotlightRef.current) gsap.to(spotlightRef.current, { opacity: 0, duration: 0.3, ease: 'power2.out' });
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    return () => {
      clearTimeout(cacheTimeout);
      window.removeEventListener('resize', updateCache);
      window.removeEventListener('scroll', updateCache);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (rafId) cancelAnimationFrame(rafId);
      spotlightRef.current?.parentNode?.removeChild(spotlightRef.current);
    };
  }, [gridRef]);

  return null;
};

const MobileHoneycomb = ({ images }: { images: any[] }) => {
  return (
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[360px] h-[350px] z-10 block lg:hidden -mt-[60px] scale-[1.08] md:scale-[1.4] origin-top">
      {[
        // Row 0
        { xOffset: -225, yOffset: 0, zIndex: "z-0" },
        { xOffset: -135, yOffset: 0, zIndex: "z-10" },
        { xOffset: -45, yOffset: 0, zIndex: "z-10" },
        { xOffset: 45, yOffset: 0, zIndex: "z-10" },
        { xOffset: 135, yOffset: 0, zIndex: "z-10" },
        { xOffset: 225, yOffset: 0, zIndex: "z-0" },
        // Row 1
        { xOffset: -270, yOffset: 78, zIndex: "z-0" },
        { xOffset: -180, yOffset: 78, zIndex: "z-20" },
        { xOffset: -90, yOffset: 78, zIndex: "z-20" },
        { xOffset: 0, yOffset: 78, zIndex: "z-30", overrideImg: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto,w_800/v1775749408/Goals_Floors_Wall_Panels.png" }, // Center
        { xOffset: 90, yOffset: 78, zIndex: "z-20" },
        { xOffset: 180, yOffset: 78, zIndex: "z-20" },
        { xOffset: 270, yOffset: 78, zIndex: "z-0" },
        // Row 2
        { xOffset: -225, yOffset: 156, zIndex: "z-0" },
        { xOffset: -135, yOffset: 156, zIndex: "z-10" },
        { xOffset: -45, yOffset: 156, zIndex: "z-10" },
        { xOffset: 45, yOffset: 156, zIndex: "z-10" },
        { xOffset: 135, yOffset: 156, zIndex: "z-10" },
        { xOffset: 225, yOffset: 156, zIndex: "z-0" },
        // Row 3 (Arch begins, center empty)
        { xOffset: -270, yOffset: 234, zIndex: "z-0" },
        { xOffset: -180, yOffset: 234, zIndex: "z-0" },
        { xOffset: -90, yOffset: 234, zIndex: "z-0" },
        { xOffset: 90, yOffset: 234, zIndex: "z-0" },
        { xOffset: 180, yOffset: 234, zIndex: "z-0" },
        { xOffset: 270, yOffset: 234, zIndex: "z-0" },
        // Row 4
        { xOffset: -225, yOffset: 312, zIndex: "z-0" },
        { xOffset: -135, yOffset: 312, zIndex: "z-0" },
        { xOffset: 135, yOffset: 312, zIndex: "z-0" },
        { xOffset: 225, yOffset: 312, zIndex: "z-0" },
        // Row 5
        { xOffset: -270, yOffset: 390, zIndex: "z-0" },
        { xOffset: -180, yOffset: 390, zIndex: "z-0" },
        { xOffset: 180, yOffset: 390, zIndex: "z-0" },
        { xOffset: 270, yOffset: 390, zIndex: "z-0" },
      ].map((pos: any, i) => (
        <Hexagon 
          key={`mob-${i}`}
          imgUrl={pos.overrideImg || images[i % images.length].src} 
          xOffset={pos.xOffset} 
          yOffset={pos.yOffset}
          zIndex={pos.zIndex}
          sizeClass="w-[90px] h-[104px]" 
          innerSizeClass="w-[84px] h-[98px]" 
          baseLeft="calc(50% - 45px)"
          baseTop="0px"
          clipPath="polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"
          waveDirection="ttb"
        />
      ))}
    </div>
  );
};

export default function HeroSection() {
  const gridRef = useRef<HTMLDivElement>(null);
  
  return (
    <section suppressHydrationWarning className="relative flex items-center overflow-hidden w-full max-w-full box-border bg-[#f6f2ea] dark:bg-[#0F172A] transition-colors duration-300">
      <GlobalSpotlight gridRef={gridRef} />
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] lg:w-[600px] lg:h-[600px] bg-amber-500/5 dark:bg-amber-500/10 blur-[100px] rounded-full -z-10" />

      {/* MOBILE HONEYCOMB CANOPY */}
      <MobileHoneycomb images={desktopHeroImages} />

      {/* Content Layer */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[355px] sm:pt-[330px] md:pt-[500px] lg:pt-4 pb-4 md:pb-24 lg:pb-[176px] flex flex-col lg:flex-row items-center gap-2 lg:gap-4 h-full">
        
        {/* MOBILE HEADING (Hidden on Desktop) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex lg:hidden flex-col w-full text-center mt-2 mb-0 order-1 z-20"
        >
          <h2 className="text-[#E17100] text-[11px] sm:text-sm font-bold tracking-[0.2em] uppercase mb-2">
            India's Fastest Growing
          </h2>
          <h1 className="text-[38px] sm:text-5xl font-serif font-medium leading-[1.05] text-gray-900 dark:text-white tracking-tight transition-colors">
            Wall Panels & <br />
            <span className="text-[#E17100]">Flooring Brand</span>
          </h1>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15 }
            }
          }}
          className="flex-1 max-w-[550px] w-full z-20 mt-2 lg:mt-0 order-3 lg:order-1 mb-8 lg:mb-0"
        >
          {/* Top Pill (Hidden on Mobile) */}
          <motion.div 
            variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
            className="hidden lg:inline-flex items-center bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-[#E17100]/30 shadow-sm rounded-full px-4 py-2 mb-6 max-w-full overflow-hidden transition-colors mx-auto lg:mx-0 w-auto justify-start"
          >
            <Zap className="w-4 h-4 text-[#E17100] mr-2 shrink-0" />
            <span className="text-[11px] font-bold text-gray-800 dark:text-gray-200 tracking-wide mr-2 whitespace-nowrap">2-HOUR EXPRESS DELIVERY IN NCR</span>
            <span className="text-gray-300 dark:text-gray-600 mx-2 shrink-0">|</span>
            <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 tracking-wide whitespace-nowrap text-ellipsis overflow-hidden">FAST. RELIABLE.</span>
          </motion.div>

          {/* Desktop Subheading */}
          <motion.h2 
            variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
            className="hidden lg:block text-[#E17100] text-sm font-bold tracking-[0.2em] uppercase mb-4 text-left"
          >
            India's Fastest Growing
          </motion.h2>

          {/* Desktop Main Heading */}
          <motion.h1 
            variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
            className="hidden lg:block text-[80px] font-serif font-medium leading-[1.05] mb-6 text-gray-900 dark:text-white tracking-tight transition-colors text-left"
          >
            Wall Panels & <br />
            <span className="text-[#E17100]">Flooring Brand</span>
          </motion.h1>

          {/* Paragraph */}
          <motion.p 
            variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
            className="text-gray-600 dark:text-gray-300 text-xs sm:text-lg max-w-[400px] mb-8 leading-relaxed font-medium transition-colors text-center lg:text-left mx-auto lg:mx-0"
          >
            SPC flooring, WPC wall panels, louvers & more — delivered in 2 hours across Gurgaon, Delhi & Noida.
          </motion.p>

          {/* Feature Badges Row */}
          <motion.div 
            variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
            className="flex items-start justify-between mb-8 divide-x divide-gray-300/80 dark:divide-slate-700/80 w-full max-w-[480px] mx-auto lg:mx-0"
          >
            {[
              { icon: ShieldCheck, title: "90%", subtitle: "WARRANTY BACKED" },
              { icon: Layers, title: "400+", subtitle: "DEALERS PAN INDIA" },
              { icon: Clock, title: "2-HOUR", subtitle: "EXPRESS DELIVERY" },
              { icon: Award, title: "FREE", subtitle: "CONSULTATION" },
            ].map((feat, i) => (
              <div key={i} className="flex flex-col items-center text-center flex-1 px-1 sm:px-2">
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full border border-gray-300 dark:border-slate-700 flex items-center justify-center mb-2 sm:mb-3 text-gray-700 dark:text-gray-300 bg-white/40 dark:bg-slate-800/40 shadow-sm transition-transform hover:scale-105">
                  <feat.icon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
                </div>
                <div className="text-[10px] sm:text-[13px] font-bold text-gray-900 dark:text-gray-100 leading-tight mb-0.5">{feat.title}</div>
                <div className="text-[7px] sm:text-[9px] text-gray-500 dark:text-gray-400 font-bold leading-tight uppercase max-w-[80px] mx-auto">{feat.subtitle}</div>
              </div>
            ))}
          </motion.div>

          {/* Buttons */}
          <motion.div 
            variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
            className="flex flex-row gap-2 sm:gap-4 w-full max-w-[480px] mx-auto lg:mx-0 pb-4"
          >
            <Link 
              href="/contact" 
              className="flex-1 flex items-center justify-center gap-1 sm:gap-2 bg-[#E17100] hover:bg-[#b85a1f] text-white px-3 py-3 sm:px-6 sm:py-4 rounded-md font-semibold text-[10px] sm:text-sm transition-colors shadow-lg shadow-[#E17100]/20 text-center"
            >
              BOOK CONSULTATION
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </Link>
            <Link 
              href="/products" 
              className="flex-1 flex items-center justify-center gap-1 sm:gap-2 border border-gray-400 dark:border-slate-600 hover:border-gray-600 dark:hover:border-slate-400 text-gray-900 dark:text-white bg-white/30 dark:bg-slate-800/30 hover:bg-white/60 dark:hover:bg-slate-800/60 px-3 py-3 sm:px-6 sm:py-4 rounded-md font-semibold text-[10px] sm:text-sm transition-colors backdrop-blur-sm text-center"
            >
              EXPLORE PRODUCTS
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </Link>
          </motion.div>
        </motion.div>

        {/* RIGHT SIDE: HONEYCOMB CLUSTER */}
        <div 
          className="hidden lg:flex flex-1 w-full items-center justify-center lg:justify-end relative mt-0 lg:mt-0 min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] z-10 order-2 lg:order-2"
          ref={gridRef}
        >
           <div className="absolute lg:relative w-[460px] h-[480px] scale-[0.45] sm:scale-[0.6] md:scale-[0.75] lg:scale-[0.9] xl:scale-[1.1] origin-center lg:origin-right xl:origin-center translate-x-6 sm:translate-x-10 lg:translate-x-16 xl:translate-x-24">
             {[
               // Center
               { xOffset: 0, yOffset: 0, zIndex: "z-40" },
               // Inner Ring
               { xOffset: 0, yOffset: -160, zIndex: "z-30" },
               { xOffset: 138, yOffset: -80, zIndex: "z-20" },
               { xOffset: 138, yOffset: 80, zIndex: "z-20" },
               { xOffset: 0, yOffset: 160, zIndex: "z-30" },
               { xOffset: -138, yOffset: 80, zIndex: "z-20" },
               { xOffset: -138, yOffset: -80, zIndex: "z-20" },
               // Outer Ring
               { xOffset: 0, yOffset: -320, zIndex: "z-10" },
               { xOffset: 138, yOffset: -240, zIndex: "z-10" },
               { xOffset: 276, yOffset: -160, zIndex: "z-10" },
               { xOffset: 276, yOffset: 0, zIndex: "z-10" },
               { xOffset: 276, yOffset: 160, zIndex: "z-10" },
               { xOffset: 138, yOffset: 240, zIndex: "z-10" },
               { xOffset: 0, yOffset: 320, zIndex: "z-10" },
               { xOffset: -138, yOffset: 240, zIndex: "z-10" },
               { xOffset: -276, yOffset: 160, zIndex: "z-10" },
               { xOffset: -276, yOffset: 0, zIndex: "z-10" },
               { xOffset: -276, yOffset: -160, zIndex: "z-10" },
               { xOffset: -138, yOffset: -240, zIndex: "z-10" },
               // Half Outer Ring 2 (Layer 3 - Right Side Only)
               { xOffset: 0, yOffset: -480, zIndex: "z-0" },
               { xOffset: 138, yOffset: -400, zIndex: "z-0" },
               { xOffset: 276, yOffset: -320, zIndex: "z-0" },
               { xOffset: 414, yOffset: -240, zIndex: "z-0" },
               { xOffset: 414, yOffset: -80, zIndex: "z-0" },
               { xOffset: 414, yOffset: 80, zIndex: "z-0" },
               { xOffset: 414, yOffset: 240, zIndex: "z-0" },
               { xOffset: 276, yOffset: 320, zIndex: "z-0" }
             ].map((pos, i) => (
               <Hexagon 
                 key={i}
                 imgUrl={desktopHeroImages[i % desktopHeroImages.length].src} 
                 xOffset={pos.xOffset} 
                 yOffset={pos.yOffset}
                 zIndex={pos.zIndex}
                 sizeClass="w-[180px] h-[156px]" 
                 innerSizeClass="w-[172px] h-[148px]" 
               />
             ))}
           </div>
        </div>
      </div>
    </section>
  );
}
