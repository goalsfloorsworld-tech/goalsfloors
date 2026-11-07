"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function DealerSampleKitCard() {
  return (
    <section className="py-12 md:py-20 bg-white dark:bg-slate-950 px-4 sm:px-8 md:px-12 lg:px-14 xl:px-16 2xl:px-20 text-slate-900 dark:text-white transition-colors duration-500 border-t border-slate-200 dark:border-white/5">
      <div className="w-full max-w-7xl mx-auto">
        <div className="relative rounded-[2.5rem] bg-gradient-to-br from-amber-500/[0.07] via-slate-50 to-amber-500/[0.03] dark:from-slate-900 dark:via-[#0c121e] dark:to-slate-900 border border-amber-500/25 dark:border-amber-500/20 p-8 sm:p-12 lg:p-14 overflow-hidden shadow-xl dark:shadow-2xl">
          
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 dark:bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col items-start">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.15] mb-5">
                The Official <span className="font-playfair italic font-normal text-amber-600 dark:text-amber-400">GOALS™</span>&nbsp;Wall Panel &amp; Flooring Sample Kit
              </h2>

              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-xl">
                Experience authentic tactile quality before specifying your project. The physical GOALS™ specifier folder contains real production cuts of our fluted wall panel louvers, acoustic wooden slats, and SPC flooring. The fee is <strong className="text-slate-900 dark:text-white font-semibold">100% credited against your material orders</strong>.
              </p>

              {/* Grid of Perks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8 w-full max-w-lg">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span>10 Real Production Cuts</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span>Hardbound Presentation Binder</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span>Hardware &amp; Trim Specimen</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span>100% Refundable on Order*</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/sample-kit"
                  className="px-7 py-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-widest inline-flex items-center gap-2.5 transition-all shadow-lg shadow-amber-500/25 active:scale-95 group"
                >
                  Inspect &amp; Order Sample Kit
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/sample-kit#specifier-studio"
                  className="px-6 py-4 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs uppercase tracking-widest inline-flex items-center gap-2 border border-slate-200 dark:border-slate-700 transition-all"
                >
                  View 3D Studio
                </Link>

                <Link
                  href="/terms#sample-kit-policy"
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors underline-offset-4 hover:underline py-2"
                >
                  *Terms &amp; Conditions apply
                </Link>
              </div>
            </div>

            {/* Right Visual Column */}
            <div className="lg:col-span-5 flex flex-col items-center lg:items-end">
              {/* 1-Row Price & Guarantee Bar ABOVE the image box */}
              <div className="w-full max-w-md flex items-center justify-between px-4 sm:px-5 py-2.5 mb-3 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/25 text-slate-900 dark:text-white shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-amber-600 dark:text-amber-400 leading-none">₹499</span>
                  <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">(Kit Fee)</span>
                </div>
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  100% Refundable on Order*
                </div>
              </div>

              {/* Image Box - Edge-to-edge fit with zero obstruction */}
              <Link
                href="/sample-kit"
                className="relative w-full max-w-md aspect-[1117/827] rounded-3xl overflow-hidden border-2 border-amber-500/30 shadow-2xl group bg-slate-900 block"
              >
                <Image
                  src="/images/sample-kit/goals_sample_kit_front.png"
                  alt="The Official GOALS Wall Panel and Flooring Sample Kit Catalog"
                  fill
                  sizes="(max-width: 1024px) 100vw, 450px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
