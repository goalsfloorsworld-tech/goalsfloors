"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight, Clock, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function GetAQuoteMonolith() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse tracking motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for the 3D effect
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { damping: 20, stiffness: 150 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { damping: 20, stiffness: 150 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative py-8 md:py-12 px-4 overflow-hidden bg-gray-50 dark:bg-slate-950 transition-colors duration-500 flex items-center justify-center min-h-[400px] md:min-h-[600px] w-full max-w-full box-border"
    >
      {/* Background Decor Elements (Floating 3D-like shapes) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 45, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[15%] w-32 h-32 bg-amber-500/10 dark:bg-amber-500/5 blur-3xl rounded-full"
        />
        <motion.div
          animate={{
            y: [0, 30, 0],
            rotate: [0, -30, 0],
            scale: [1, 0.9, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[20%] right-[10%] w-64 h-64 bg-slate-200/50 dark:bg-slate-800/20 blur-3xl rounded-full"
        />

        {/* Floating Architectural Lines */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1, x: [0, 100, 0], y: [0, -50, 0] }}
            transition={{ duration: 15 + i * 2, repeat: Infinity, ease: "linear" }}
            className="absolute h-px bg-amber-600 w-96 origin-left"
            style={{
              top: `${20 + i * 15}%`,
              left: `${-10 + i * 5}%`,
              transform: `rotate(${15 + i * 10}deg)`
            }}
          />
        ))}
      </div>

      {/* The 3D Monolith Card */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full max-w-4xl z-10 min-w-0"
      >
        <div
          style={{ transform: "translateZ(80px)" }}
          className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-3xl border-2 border-gray-200/50 dark:border-slate-700/50 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2),0_10px_30px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_0_50px_-12px_rgba(251,191,36,0.1)] px-6 py-4 md:px-16 md:py-6 rounded-sm relative overflow-hidden group"
        >
          {/* Subtle Inner Glow */}
          <div className="absolute -inset-px bg-gradient-to-br from-amber-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center min-w-0">

            {/* Left Content */}
            <div style={{ transform: "translateZ(40px)" }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-6 border border-amber-200 dark:border-amber-800/50">
                Premium Consultation
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 uppercase tracking-tight leading-[0.95]">
                Request a <br />
                <span className="text-amber-600 italic">Site Visit</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-8 font-light">
                Let our experts bring the showroom to you. Digital precision measurements and architectural texture sampling at your convenience.
              </p>

              <div className="space-y-4">
                {[
                  { icon: ShieldCheck, text: "Official 7-Year Warranty Coverage" },
                  { icon: Clock, text: "2-Hour Initial Expert Response" },
                  { icon: CheckCircle2, text: "Zero Cost Site Measurement" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 font-medium">
                    <item.icon className="w-4 h-4 text-amber-500" />
                    {item.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Premium Normal Button */}
            <div
              style={{ transform: "translateZ(60px)" }}
              className="relative flex flex-col items-center justify-center min-h-0 py-8 md:py-0 md:min-h-[400px] overflow-hidden"
            >
              {/* Technical Grid Background */}
              <div className="absolute inset-4 border border-amber-500/10 pointer-events-none opacity-40 dark:opacity-20"
                style={{ background: "radial-gradient(circle at 10% 10%, rgba(251,191,36,0.1) 0%, transparent 1%), radial-gradient(circle at 90% 90%, rgba(251,191,36,0.1) 0%, transparent 1%)", backgroundSize: "20px 20px" }} />

              {/* Floating Material Swatches (Interacting with the 3D space) */}
              {[
                { z: 100, x: -80, y: -60, label: "Oak Wood", color: "bg-amber-100/50 dark:bg-amber-900/30" },
                { z: 120, x: 100, y: 70, label: "Stone", color: "bg-slate-200/50 dark:bg-slate-800/40" },
                { z: 90, x: 70, y: -80, label: "Ref: GL-24", color: "bg-amber-500/10 dark:bg-amber-500/5" },
              ].map((swatch, i) => (
                <motion.div
                  key={i}
                  style={{
                    transform: `translateZ(${swatch.z}px)`,
                    left: `calc(50% + ${swatch.x}px)`,
                    top: `calc(50% + ${swatch.y}px)`
                  }}
                  animate={{
                    y: [0, 10, 0],
                    rotate: [0, i % 2 === 0 ? 5 : -5, 0]
                  }}
                  transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
                  className={`absolute w-12 h-12 ${swatch.color} border border-amber-500/20 rounded-sm flex flex-col items-center justify-center backdrop-blur-sm shadow-sm pointer-events-none`}
                >
                  <div className="w-4 h-px bg-amber-500/30 mb-1" />
                  <span className="text-[6px] font-bold text-amber-600/50 uppercase tracking-tighter leading-none px-1 text-center">
                    {swatch.label}
                  </span>
                </motion.div>
              ))}

              {/* Interactive Coordinate Tracker */}
              <motion.div
                className="absolute pointer-events-none z-0 hidden lg:flex flex-col items-start gap-1"
                style={{
                  left: useTransform(mouseX, [-0.5, 0.5], ["30%", "70%"]),
                  top: useTransform(mouseY, [-0.5, 0.5], ["30%", "70%"]),
                  transform: "translateZ(30px)"
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-16 h-px bg-amber-500/40" />
                  <div className="w-1 h-1 bg-amber-500 rounded-full" />
                </div>
                <div className="flex flex-col ml-16 mt-1">
                  <motion.span className="text-[7px] font-black text-amber-600 dark:text-amber-500 font-mono tracking-widest bg-white/50 dark:bg-slate-900/50 px-1 backdrop-blur-md">
                    X: <motion.span>{useTransform(mouseX, [-0.5, 0.5], ["3.42", "7.18"])}</motion.span>
                  </motion.span>
                  <motion.span className="text-[7px] font-black text-amber-600 dark:text-amber-500 font-mono tracking-widest bg-white/50 dark:bg-slate-900/50 px-1 backdrop-blur-md">
                    Y: <motion.span>{useTransform(mouseY, [-0.5, 0.5], ["5.12", "1.92"])}</motion.span>
                  </motion.span>
                </div>
              </motion.div>

              <Link
                href="/contact"
                className="group shine-btn relative z-10 flex items-center gap-3 bg-amber-600 hover:bg-amber-700 text-white px-10 py-5 rounded-full text-xs font-black uppercase tracking-[0.3em] transition-all duration-300 shadow-2xl shadow-amber-600/20 active:scale-95 w-fit overflow-hidden"
              >
                {/* Button Shine effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                <span className="relative z-10 flex items-center gap-3">
                  Consult with Experts
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>

              {/* Decorative accent for the 3D depth */}
              <div
                style={{ transform: "translateZ(-20px)" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-600/10 -z-10 rounded-full blur-[120px]"
              />
            </div>
          </div>
        </div>

      </motion.div>

      <motion.div
        style={{ transform: "translateZ(140px)" }}
        className="absolute top-20 right-[18%] w-20 h-24 bg-amber-600 hidden xl:flex items-center justify-center shadow-2xl rounded-sm z-50 overflow-visible"
        animate={{ y: [0, 15, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="text-white font-black text-3xl leading-none">GF</div>
        {/* Decorative shadow layer */}
        <div className="absolute inset-0 bg-black/20 translate-x-1 translate-y-1 -z-10 blur-sm" />
      </motion.div>
    </section>
  );
}