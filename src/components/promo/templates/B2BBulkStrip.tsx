"use client";

import Link from "next/link";
import { Building2, ArrowRight } from "lucide-react";
import { getSafePromoLink } from "./index";

export interface B2BBulkStripProps {
  heading?: string;
  tier_1_label?: string;
  tier_1_value?: string;
  tier_2_label?: string;
  tier_2_value?: string;
  tier_3_label?: string;
  tier_3_value?: string;
  button_text?: string;
  button_link?: string;
  endAt?: string | null;
}

export default function B2BBulkStrip({
  heading = "Volume Project Pricing for Architects & Contractors",
  tier_1_label,
  tier_1_value,
  tier_2_label,
  tier_2_value,
  tier_3_label,
  tier_3_value,
  button_text = "Request B2B Quote",
  button_link = "/contact",
}: B2BBulkStripProps) {
  const safeLink = getSafePromoLink(button_link);

  const tiers = [
    { label: tier_1_label, value: tier_1_value },
    { label: tier_2_label, value: tier_2_value },
    { label: tier_3_label, value: tier_3_value },
  ].filter((t) => t.label || t.value);

  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-200/90 bg-white p-4 md:p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: Heading with B2B icon */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400">
            <Building2 className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Commercial / Wholesale
            </span>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white md:text-base">
              {heading}
            </h3>
          </div>
        </div>

        {/* Middle: Up to 3 Tier Chips */}
        {tiers.length > 0 && (
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center md:gap-3">
            {tiers.map((tier, idx) => (
              <div
                key={idx}
                className="flex flex-col rounded-lg border border-gray-100 bg-gray-50/80 px-3 py-1.5 dark:border-slate-800 dark:bg-slate-800/60"
              >
                {tier.label && (
                  <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
                    {tier.label}
                  </span>
                )}
                {tier.value && (
                  <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                    {tier.value}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Right: CTA button */}
        {button_text && safeLink && (
          <div className="lg:shrink-0">
            <Link
              href={safeLink}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-lg bg-gray-900 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-black active:scale-95 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            >
              <span>{button_text}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
