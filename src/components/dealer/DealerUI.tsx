"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                              1. SUCCESS OVERLAY                            */
/* -------------------------------------------------------------------------- */

export function SuccessOverlay() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-[100] flex items-center justify-center bg-[#050505]/95 backdrop-blur-2xl text-white overflow-hidden"
    >
      <div className="relative z-10 max-w-3xl w-full text-center px-8">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-12 flex justify-center"
        >
            <div className="w-24 h-24 rounded-full border border-amber-100/20 flex items-center justify-center bg-amber-100/5">
                <CheckCircle2 className="w-10 h-10 text-amber-100" />
            </div>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.4, duration: 1 }}
           className="space-y-8"
        >
          <h2 className="text-4xl md:text-6xl font-light tracking-tighter uppercase leading-[1.1]">
            Application <br /> 
            <span className="font-playfair italic text-amber-100">Received.</span>
          </h2>

          <p className="text-white/60 text-lg leading-relaxed font-light max-w-lg mx-auto">
            Your architectural credentials are under review. Our premium partnership team will contact you within 24 business hours.
          </p>

          <div className="pt-12 flex justify-center">
              <button 
                onClick={() => window.location.href = '/products'}
                className="px-10 py-5 bg-white text-black rounded-full font-medium uppercase tracking-widest text-xs transition-transform hover:scale-105 flex items-center gap-4"
              >
                Return Home <ArrowRight className="w-4 h-4" />
              </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              2. LUXURY INPUT                               */
/* -------------------------------------------------------------------------- */

export function LuxuryInput({ label, error, ...props }: { label: string; error?: boolean; [key: string]: any }) {
  const [isFocused, setIsFocused] = useState(false);
  const isFilled = props.value && props.value !== "";

  return (
    <div className="relative w-full group">
        <label className={`absolute left-0 transition-all duration-500 pointer-events-none font-light uppercase tracking-widest ${
            isFocused || isFilled 
            ? '-top-6 text-[10px] text-amber-100/70' 
            : 'top-4 text-sm md:text-xl text-white/40'
        }`}>
            {label} <span className="text-red-400/50">*</span>
        </label>
        <input 
            {...props}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`w-full bg-transparent border-b h-16 md:h-20 text-xl md:text-3xl focus:outline-none transition-all duration-500 font-light text-white rounded-none ${
                error ? 'border-red-500/50' :
                isFocused 
                ? 'border-amber-100' 
                : 'border-white/20 group-hover:border-white/50'
            }`}
        />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              3. LUXURY RADIO                               */
/* -------------------------------------------------------------------------- */

export function LuxuryRadio({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`py-4 md:py-6 px-6 border rounded-full text-center transition-all duration-500 ${
        active 
        ? 'bg-amber-100 text-black border-amber-100' 
        : 'bg-transparent border-white/20 text-white/60 hover:border-white/60 hover:text-white'
      }`}
    >
      <span className="text-xs md:text-sm font-medium uppercase tracking-[0.2em]">
        {label}
      </span>
    </button>
  );
}
