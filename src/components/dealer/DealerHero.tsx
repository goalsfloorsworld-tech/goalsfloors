"use client";

import { motion } from "framer-motion";
import { ShieldCheck, ChevronDown } from "lucide-react";

export default function DealerHero() {
  return (
    <section className="relative h-auto md:h-[80vh] flex flex-col items-center justify-start md:justify-center text-center px-4 overflow-hidden border-b border-slate-200 dark:border-white/5 pt-5 pb-5 md:py-20 bg-white dark:bg-slate-950 transition-colors duration-500">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-600/5 dark:bg-amber-600/10 blur-[130px] rounded-full -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-600/5 blur-[110px] rounded-full -ml-32 -mb-32 opacity-30 dark:opacity-50" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] opacity-[0.03] dark:opacity-20" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-6 md:space-y-8">
          <motion.div 
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ opacity: 1, scale: 1 }}
             className="inline-flex items-center gap-3 px-4 py-2 bg-amber-600/10 border border-amber-600/20 rounded-full text-amber-600 dark:text-amber-500 text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-xl"
          >
              <ShieldCheck className="w-4 h-4" /> B2B Exclusive Partnership
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-[0.9] drop-shadow-sm dark:drop-shadow-2xl"
          >
            The Grand <br />
            <span className="text-amber-600 italic font-light font-playfair">Architectural</span> Legacy.
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-slate-600 dark:text-slate-400 text-base md:text-xl font-medium max-w-2xl mx-auto leading-relaxed"
          >
            Goals Floors is more than just a brand. It is an architectural commitment. Join our exclusive partner network to gain access to premium catalogs and dealer-only margins.
          </motion.p>
          
          <motion.div 
              animate={{ y: [0, 10, 0] }} 
              transition={{ duration: 2, repeat: Infinity }}
              className="pt-8 md:pt-12 flex flex-col items-center gap-2"
          >
              <div className="w-[1px] h-10 md:h-20 bg-gradient-to-b from-amber-600 to-transparent" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-600/50">Apply Below</span>
              <ChevronDown className="w-5 h-5 text-amber-600/50" />
          </motion.div>
      </div>
    </section>
  );
}
