"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface QuickFeature {
  icon: LucideIcon;
  title: string;
  desc: string;
}

interface QuickFeaturesBarProps {
  features: QuickFeature[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    } as const
  },
} as const;

export default function QuickFeaturesBar({ features }: QuickFeaturesBarProps) {
  return (
    <div className="bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Mobile: Swipeable Carousel | Desktop: 6-Col Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="flex md:grid md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory scrollbar-hide pb-4 md:pb-0"
        >
          {features.map((item, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ 
                y: -8, 
                scale: 1.02,
                transition: { duration: 0.2, ease: "easeOut" }
              }}
              className="flex-shrink-0 w-[200px] md:w-auto snap-center flex flex-col items-center text-center cursor-default group"
            >
              {/* Icon Container with Glow Effect */}
              <div className="relative mb-4">
                {/* Glow Background (Animated on Hover) */}
                <div className="absolute inset-0 bg-amber-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative w-14 h-14 bg-white dark:bg-slate-950 rounded-2xl flex items-center justify-center shadow-sm border border-gray-200 dark:border-gray-800 text-amber-600 dark:text-amber-500 group-hover:border-amber-500/50 group-hover:text-amber-500 transition-all duration-300">
                  <item.icon className="w-7 h-7" />
                </div>
              </div>

              {/* Text Content */}
              <h4 className="text-[11px] lg:text-[12px] font-bold text-gray-900 dark:text-white mb-1 uppercase tracking-wider leading-tight">
                {item.title}
              </h4>
              <p className="text-[10px] lg:text-xs text-gray-500 dark:text-gray-400 font-medium max-w-[140px]">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
