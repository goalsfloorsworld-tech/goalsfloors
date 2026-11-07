"use client";

import Link from "next/link";
import { Package, ArrowRight, Sparkles } from "lucide-react";
import { getSafePromoLink } from "./index";

export interface SampleKitCalloutProps {
  badge_text?: string;
  heading?: string;
  subtext?: string;
  button_text?: string;
  button_link?: string;
  endAt?: string | null;
}

export default function SampleKitCallout({
  badge_text = "Specifier Kit",
  heading = "Experience Authentic Material Quality Before Ordering",
  subtext,
  button_text = "Order Sample Kit",
  button_link = "/sample-kit",
}: SampleKitCalloutProps) {
  const safeLink = getSafePromoLink(button_link);

  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-200/80 bg-gradient-to-r from-gray-50 via-white to-amber-50/30 p-4 md:p-5 shadow-sm dark:border-slate-800 dark:from-slate-900/90 dark:via-slate-900 dark:to-amber-950/20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3 md:gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400">
            <Package className="h-5 w-5" />
          </div>

          <div className="space-y-1">
            {badge_text && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                <Sparkles className="h-3 w-3" />
                {badge_text}
              </span>
            )}

            <h3 className="text-base font-bold text-gray-900 dark:text-white md:text-lg">
              {heading}
            </h3>

            {subtext && (
              <p className="text-xs text-gray-600 dark:text-gray-300 md:text-sm max-w-2xl">
                {subtext}
              </p>
            )}
          </div>
        </div>

        {button_text && safeLink && (
          <div className="sm:shrink-0">
            <Link
              href={safeLink}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-amber-500/30 bg-white px-4 py-2 text-xs font-semibold text-gray-900 shadow-sm transition hover:border-amber-500 hover:bg-amber-50 active:scale-95 dark:border-amber-500/20 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
            >
              <span>{button_text}</span>
              <ArrowRight className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
