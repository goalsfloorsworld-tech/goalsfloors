"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function DealerHero() {
  return (
    <section className="relative w-full h-[80svh] md:h-[100svh] flex flex-col justify-center overflow-hidden selection:bg-amber-600 selection:text-white bg-slate-900">
      
      {/* Immersive Background Image */}
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="w-full h-full relative"
        >
          <Image 
            src="/images/hero-arch.png" 
            alt="Luxury Architecture" 
            fill 
            priority
            className="object-cover opacity-60 dark:opacity-80"
          />
        </motion.div>
        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent dark:from-slate-950 dark:via-slate-950/60" />
      </div>

      <div className="relative z-10 w-full px-6 md:px-16 py-10 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-12"
        >
          <div className="max-w-4xl">
              <motion.p 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }}
                 className="text-white/70 font-sans text-xs md:text-sm tracking-[0.3em] uppercase mb-6 flex items-center gap-4"
              >
                <span className="w-8 h-[1px] bg-white/70"></span> Exclusive Network
              </motion.p>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1]">
                Partner with Goals Floors – <br className="hidden md:block" />
                <span className="font-playfair italic font-normal text-amber-400">NCR’s Fastest Growing Luxury Surface Brand!</span>
              </h1>
          </div>

          <div className="flex flex-col gap-8 md:max-w-md shrink-0">
             <motion.p 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 1 }}
               className="text-white/90 text-base md:text-lg leading-relaxed font-light"
             >
               Join our network of 400+ happy dealers. Get exclusive access to 2500+ premium interior & exterior products with 2-hour express dispatch in Delhi NCR.
             </motion.p>
             
             <motion.button 
               onClick={() => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' })}
               initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.9, duration: 1 }}
               className="group relative flex items-center justify-between w-full md:w-auto bg-amber-500 text-black px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-500 overflow-hidden"
             >
               <span className="relative z-10 mr-12">Start Your Inquiry</span>
               <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors duration-500 relative z-10">
                  <ArrowRight className="w-4 h-4" />
               </div>
             </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
