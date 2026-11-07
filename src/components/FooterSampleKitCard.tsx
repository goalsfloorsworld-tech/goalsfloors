"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function FooterSampleKitCard() {
  return (
    <div className="border border-white/10 rounded-2xl p-4 sm:p-5 bg-white/[0.03] hover:border-amber-500/30 backdrop-blur-sm w-full text-left relative overflow-hidden transition-all duration-300 group">
      <div className="flex items-center gap-3.5 sm:gap-4">
        {/* Visual 3D Catalog Thumbnail - Fitted edge-to-edge */}
        <Link
          href="/sample-kit"
          className="relative w-24 h-20 sm:w-28 sm:h-24 rounded-xl overflow-hidden border border-white/15 shrink-0 block bg-slate-900 shadow-md"
        >
          <Image
            src="/images/sample-kit/goals_sample_kit_front.png"
            alt="The Official GOALS Wall Panel & Flooring Sample Kit"
            fill
            sizes="(max-width: 640px) 96px, 112px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-1 right-1 bg-amber-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm">
            ₹499
          </div>
        </Link>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <Link href="/sample-kit" className="hover:text-amber-400 transition-colors block">
            <h4 className="text-white font-bold text-sm sm:text-base leading-snug">
              The Official GOALS™ Sample Kit
            </h4>
          </Link>
          <p className="text-gray-400 text-xs mt-1 line-clamp-2">
            10 real production cuts of panels &amp; flooring delivered to your door.
          </p>

          <div className="mt-2.5 flex items-center justify-between gap-2">
            <Link
              href="/sample-kit"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 hover:text-amber-400 uppercase tracking-wider group-hover:translate-x-0.5 transition-all"
            >
              <span>Order Sample Kit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/terms#sample-kit-policy"
              className="text-[10px] text-gray-500 hover:text-gray-400 underline underline-offset-2"
            >
              *T&amp;C Apply
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
