"use client";

import { useState, useEffect   } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ArrowRight, Layers, Maximize, CloudSun, Layout } from "lucide-react";

const categories = [
  {
    title: "Luxury Flooring",
    slug: "premium-flooring",
    image: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto,w_800/v1775794972/Laminate_Flooring_Grey_Color.png",
    alt: "Premium luxury wooden flooring for homes in Gurugram - Goals Floors Interior Design",
    hook: "THE FOUNDATION OF ELEGANCE",
    description: "From waterproof hybrid laminate to authentic wood textures, discover flooring that defines your space's character.",
    icon: Maximize
  },
  {
    title: "Wall Panels & Louvers",
    slug: "wall-panels",
    image: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto,w_800/v1775794972/Fluted_Panel_Goals_Floors.png",
    alt: "Modern charcoal gray wall fluted panels and louvers in Delhi NCR - Goals Floors Collection",
    hook: "ARCHITECTURAL TEXTURES",
    description: "Transform flat walls into artistic statements with our WPC fluted panels and luxury charcoal louvers.",
    icon: Layers
  },
  {
    title: "Exterior Solutions",
    slug: "outdoors",
    image: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto,w_800/v1775794971/Exterior_Louvers_Site_Completed_By_Goals_Floors.png",
    alt: "Luxury exterior louvers Gurugram - Goals Floors Outdoors",
    hook: "NATURE MEETS DURABILITY",
    description: "Premium WPC decking and exterior cladding designed to withstand the elements while maintaining a natural wood look.",
    icon: CloudSun
  },
  {
    title: "Architectural Ceilings",
    slug: "ceilings",
    image: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto,w_800/v1775749408/Baffle_Ceiling.png",
    alt: "Designer wooden baffle ceiling and linear lighting in Delhi NCR homes - Goals Floors Excellence",
    hook: "VISIONARY OVERHEAD",
    description: "Baffle ceilings and designer panels that enhance acoustics and aesthetics for a truly complete interior vision.",
    icon: Layout
  }
];

const backSideVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      delay: 0.35, // Start animating after flip has partially turned
      staggerChildren: 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 }
};

export default function CategoryFlipCards() {
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);
  const [isHoverEnabled, setIsHoverEnabled] = useState(false);

  // Detect if device supports hover (desktop)
  useEffect(() => {
    setIsHoverEnabled(window.matchMedia("(hover: hover)").matches);
  }, []);

  const handleToggle = (index: number) => {
    // On touch devices, we toggle. On desktop, hover handles it.
    if (!isHoverEnabled) {
      setActiveCardIndex(prev => (prev === index ? null : index));
    }
  };

  const handleMouseEnter = (index: number) => {
    if (isHoverEnabled) {
      setActiveCardIndex(index);
    }
  };

  const handleMouseLeave = () => {
    if (isHoverEnabled) {
      setActiveCardIndex(null);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-2 sm:px-4 max-w-7xl mx-auto">
      {categories.map((cat, i) => (
        <div 
          key={cat.slug}
          className="group h-[500px] w-full"
          style={{ perspective: "1500px" }}
          onClick={() => handleToggle(i)}
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div
            animate={{ rotateY: activeCardIndex === i ? 180 : 0 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            style={{ transformStyle: "preserve-3d" }}
            className="relative w-full h-full cursor-pointer"
          >
            {/* FRONT SIDE */}
            <div 
              style={{ backfaceVisibility: "hidden" }}
              className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden"
            >
              <Image 
                src={cat.image} 
                alt={cat.alt} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              
              <div className="absolute inset-x-4 sm:inset-x-6 bottom-8">
                <h3 className="text-2xl font-black text-white italic tracking-tight leading-none uppercase">
                  {cat.title}
                </h3>
                <div className="mt-4 flex items-center gap-2 text-amber-500 text-[10px] font-bold uppercase tracking-[0.3em]">
                  Explore Now <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>

            {/* BACK SIDE */}
            <div 
              style={{ 
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                transformStyle: "preserve-3d"
              }}
              className="absolute inset-0 w-full h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden"
            >
              {/* Technical Grid Pattern & Glow */}
              <div className="absolute inset-0 pointer-events-none opacity-20" 
                   style={{ 
                     backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
                     backgroundSize: "20px 20px" 
                   }} />
              <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 blur-[60px] rounded-full -mr-20 -mt-20" />

              <motion.div
                variants={backSideVariants}
                initial="hidden"
                animate={activeCardIndex === i ? "visible" : "hidden"}
                style={{ 
                  transformStyle: "preserve-3d",
                  transform: "translateZ(60px)"
                }}
                className="relative h-full flex flex-col justify-center p-6 sm:p-8 text-left" // Switched to text-left for more architectural feel
              >
                <motion.div variants={itemVariants} className="mb-8">
                  <cat.icon className="w-8 h-8 text-amber-500" />
                </motion.div>

                <motion.div variants={itemVariants} className="w-12 h-0.5 bg-amber-500 mb-6" />
                
                <motion.h4 variants={itemVariants} className="text-sm font-black text-amber-500 uppercase tracking-[0.3em] mb-4 leading-none">
                  {cat.hook}
                </motion.h4>
                
                <motion.p variants={itemVariants} className="text-slate-400 text-sm leading-relaxed mb-10 font-medium">
                  {cat.description}
                </motion.p>
                
                <motion.div variants={itemVariants}>
                  <Link 
                    href={`/products?category=${cat.slug}`}
                    className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 hover:border-amber-600 transition-all duration-500"
                    onClick={(e) => e.stopPropagation()} 
                  >
                    View Collection
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      ))}
    </div>
  );
}


