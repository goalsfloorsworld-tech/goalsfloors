"use client";

import { useEffect, useState } from "react";
import { PromoSectionItem } from '@/lib/promo';
import { PROMO_TEMPLATES } from "./templates";

interface PromoSlotProps {
  promos?: PromoSectionItem[];
}

/**
 * Pure function to identify the first promo matching the active time window.
 * Since promos is already sorted by precedence:
 * (specific slug > '*' > higher priority > earliest start_at)
 * the first match is the authoritative active promo.
 */
function findActivePromo(
  promos: PromoSectionItem[],
  timestampMs: number
): PromoSectionItem | null {
  for (const promo of promos) {
    const startMs = promo.start_at ? new Date(promo.start_at).getTime() : -Infinity;
    const endMs = promo.end_at ? new Date(promo.end_at).getTime() : Infinity;

    if (timestampMs >= startMs && timestampMs < endMs) {
      return promo;
    }
  }
  return null;
}

export default function PromoSlot({ promos = [] }: PromoSlotProps) {
  // Initial state uses the server-computed active promo (100% deterministic SSR hydration, no render-time Date.now())
  const [activePromo, setActivePromo] = useState<PromoSectionItem | null>(() => {
    return promos.find((p) => p.is_active) ?? null;
  });

  // Client-side lifecycle timers:
  // Schedule timers for promo starts (upcoming promos) and ends (expiring promos)
  useEffect(() => {
    if (promos.length === 0) return;

    const currentNow = Date.now();
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Synchronize to client clock asynchronously to avoid synchronous setState cascading render warning
    const initTimer = setTimeout(() => {
      setActivePromo(findActivePromo(promos, Date.now()));
    }, 0);
    timers.push(initTimer);

    const boundaryTimestamps = new Set<number>();

    for (const p of promos) {
      if (p.start_at) {
        const s = new Date(p.start_at).getTime();
        if (s > currentNow) boundaryTimestamps.add(s);
      }
      if (p.end_at) {
        const e = new Date(p.end_at).getTime();
        if (e > currentNow) boundaryTimestamps.add(e);
      }
    }

    boundaryTimestamps.forEach((targetMs) => {
      const delay = targetMs - currentNow;
      // Cap at 24 hours to avoid 32-bit signed int overflow in setTimeout
      if (delay > 0 && delay < 86400000) {
        const timer = setTimeout(() => {
          setActivePromo(findActivePromo(promos, Date.now()));
        }, delay + 50); // 50ms buffer to guarantee boundary has crossed
        timers.push(timer);
      }
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [promos]);

  // If no promos passed or none is currently within its active time window, render nothing (zero CLS)
  if (!activePromo) {
    return null;
  }

  const templateEntry = PROMO_TEMPLATES[activePromo.template_id];
  if (!templateEntry) {
    return null;
  }

  const TemplateComponent = templateEntry.component;
  const mergedProps = {
    ...templateEntry.defaults,
    ...(activePromo.props_json || {}),
  };

  return (
    <div className="w-full px-4 sm:px-8 md:px-12 lg:px-14 xl:px-16 2xl:px-20 mx-auto py-6 transition-colors duration-300">
      <aside
        aria-label="Promotion"
        className="w-full transition-opacity duration-300"
      >
        <TemplateComponent
          {...mergedProps}
          startAt={activePromo.start_at}
          endAt={activePromo.end_at}
        />
      </aside>
    </div>
  );
}
