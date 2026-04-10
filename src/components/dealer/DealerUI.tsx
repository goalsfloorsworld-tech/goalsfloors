"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Key, TrendingUp, Handshake, CheckCircle2, 
  ShieldCheck, ArrowRight, Building2, X 
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                              1. MOTIVATION PANEL                           */
/* -------------------------------------------------------------------------- */

interface MotivationPanelProps {
  currentStep: number;
}

const motivationContent = [
  {
    icon: Key,
    heading: "Unlocking Opportunity.",
    subtext: "You are one step away from unlocking exclusive B2B margins and premium architectural collections.",
  },
  {
    icon: TrendingUp,
    heading: "Growth & Scale.",
    subtext: "Let’s scale together. We design our support system to fit the size and ambition of your business.",
  },
  {
    icon: Handshake,
    heading: "Seal the Deal.",
    subtext: "Upload your details and let’s shake hands on a profitable, long-term partnership.",
  }
];

export function MotivationPanel({ currentStep }: MotivationPanelProps) {
  const stepContent = motivationContent[currentStep - 1] || motivationContent[0];
  const Icon = stepContent.icon;

  return (
    <div className="relative h-full w-full overflow-hidden flex flex-col items-center justify-center p-12 text-center transition-colors duration-500">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-600/5 dark:bg-amber-600/10 blur-[130px] rounded-full -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-600/5 blur-[110px] rounded-full -ml-40 -mb-40 opacity-30 dark:opacity-100" />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-sm"
        >
          <div className="mb-10 flex justify-center">
            <motion.div 
               animate={{ rotate: [0, 5, -5, 0] }}
               transition={{ duration: 4, repeat: Infinity }}
               className="w-24 h-24 bg-white dark:bg-gradient-to-br dark:from-amber-500/20 dark:to-amber-600/5 border border-slate-200 dark:border-amber-500/20 rounded-[2rem] flex items-center justify-center backdrop-blur-2xl shadow-xl dark:shadow-2xl dark:shadow-amber-900/20"
            >
               <Icon className="w-12 h-12 text-amber-600 dark:text-amber-500 drop-shadow-[0_0_15px_rgba(217,119,6,0.3)] dark:drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
            </motion.div>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-6 leading-[0.95] uppercase">
            {stepContent.heading}
          </h2>
          
          <p className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-relaxed">
            {stepContent.subtext}
          </p>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-16 flex gap-4">
        {[1, 2, 3].map((step) => (
          <div 
            key={step}
            className={`h-1 rounded-full transition-all duration-700 ${
              currentStep === step ? "w-12 bg-amber-600 dark:bg-amber-500 shadow-[0_0_15px_rgba(217,119,6,0.4)]" : "w-4 bg-slate-200 dark:bg-slate-800"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              2. SUCCESS OVERLAY                             */
/* -------------------------------------------------------------------------- */

export function SuccessOverlay() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-[100] flex items-center justify-center bg-white dark:bg-slate-950 overflow-hidden transition-colors duration-500"
    >
      <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-600/5 dark:bg-amber-600/10 blur-[130px] rounded-full -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-600/5 blur-[110px] rounded-full -ml-32 -mb-32 opacity-30 dark:opacity-50" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] opacity-[0.03] dark:opacity-20" />
      </div>

      <div className="relative z-10 max-w-lg w-full text-center px-8">
        <div className="relative w-32 h-32 mx-auto mb-10">
          <motion.div 
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 10, delay: 0.2 }}
            className="absolute inset-0 bg-gradient-to-br from-amber-600 to-amber-700 rounded-[2.5rem] shadow-[0_0_50px_rgba(217,119,6,0.2)] dark:shadow-[0_0_50px_rgba(217,119,6,0.4)] flex items-center justify-center z-10"
          >
            <CheckCircle2 className="w-16 h-16 text-white" />
          </motion.div>
          <motion.div 
             animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
             transition={{ duration: 2, repeat: Infinity }}
             className="absolute inset-0 border-2 border-amber-600/30 dark:border-amber-500/50 rounded-[2.5rem]" 
          />
          <motion.div 
             animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
             transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
             className="absolute inset-0 border border-amber-600/20 dark:border-amber-500/30 rounded-[2.5rem]" 
          />
        </div>

        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.5, duration: 0.8 }}
           className="space-y-6"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-amber-600/10 border border-amber-600/20 rounded-full text-amber-600 dark:text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-xl mb-2">
              <ShieldCheck className="w-4 h-4" /> Application Secured
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-[0.9]">
            Welcome to the <br /> 
            <span className="text-amber-600 italic font-light">Inner Circle</span>.
          </h2>

          <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed font-medium">
            Your architectural credentials are under review. Our premium partnership team will connect with you of verified status within <span className="text-slate-900 dark:text-white">24 business hours.</span>
          </p>

          <div className="pt-10 flex justify-center">
              <button 
                onClick={() => window.location.href = '/products'}
                className="px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all hover:bg-amber-600 hover:text-white flex items-center justify-center gap-3 active:scale-95 shadow-xl dark:shadow-2xl"
              >
                Explore Collections <ArrowRight className="w-4 h-4" />
              </button>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-12 flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.5em] text-slate-300 dark:text-slate-700 transition-colors duration-500">
          <span>Confidentiality Guaranteed</span>
          <div className="w-1 h-1 bg-slate-200 dark:bg-slate-800 rounded-full" />
          <span>Verified B2B Status</span>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              3. FLOATING INPUT                             */
/* -------------------------------------------------------------------------- */

export function FloatingInput({ icon: Icon, label, ...props }: any) {
  const [isFocused, setIsFocused] = useState(false);
  const isFilled = props.value && props.value !== "";

  return (
    <div className="relative flex items-center flex-1">
        <div className={`absolute left-6 transition-colors duration-300 ${isFocused || isFilled ? 'text-amber-600' : 'text-slate-400 dark:text-slate-600'}`}>
            <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
            <label className={`absolute left-16 transition-all duration-300 pointer-events-none font-bold uppercase tracking-widest ${
                isFocused || isFilled 
                ? 'top-2 text-[8px] text-amber-600 opacity-100' 
                : 'top-1/2 -translate-y-1/2 text-[10px] text-slate-400 dark:text-slate-500'
            }`}>
                {label} <span className="text-red-500">*</span>
            </label>
            <input 
                {...props}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={`w-full bg-slate-50 dark:bg-slate-800/30 border h-[72px] pl-16 pr-6 pt-4 rounded-2xl text-sm focus:outline-none transition-all font-medium text-slate-900 dark:text-white ${
                    isFocused || isFilled 
                    ? 'border-amber-600 ring-1 ring-amber-600/10' 
                    : 'border-slate-200 dark:border-slate-700'
                }`}
            />
        </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              4. RADIO CARD                                 */
/* -------------------------------------------------------------------------- */

export function RadioCard({ icon: Icon, label, active, onClick }: any) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border text-left transition-all duration-500 flex items-center gap-2 sm:gap-4 relative overflow-hidden group min-h-[64px] sm:min-h-[72px] ${
        active 
        ? 'bg-amber-600 border-amber-600 shadow-[0_10px_30px_rgba(217,119,6,0.1)] dark:shadow-[0_10px_30px_rgba(217,119,6,0.2)]' 
        : 'bg-white dark:bg-slate-800/30 border-slate-200 dark:border-slate-700 hover:border-amber-600/30 shadow-sm dark:shadow-none'
      }`}
    >
      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center transition-colors duration-500 shrink-0 ${
        active ? 'bg-white/20 text-white' : 'bg-slate-50 dark:bg-slate-900 text-slate-400 group-hover:text-amber-600'
      }`}>
        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
      </div>
      <span className={`text-[8px] sm:text-[10px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] leading-[1.3] flex-1 break-words ${active ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}>
        {label}
      </span>
      {active && (
        <motion.div 
            layoutId="glow"
            className="absolute inset-0 bg-white/10 blur-xl pointer-events-none" 
        />
      )}
    </motion.button>
  );
}
