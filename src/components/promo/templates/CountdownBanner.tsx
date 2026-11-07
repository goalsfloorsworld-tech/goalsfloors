"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { getSafePromoLink } from "./index";

export interface CountdownBannerProps {
  badge_text?: string;
  heading?: string;
  heading_highlight?: string;
  subtext?: string;
  show_countdown?: boolean;
  button_text?: string;
  button_link?: string;
  secondary_button_text?: string;
  secondary_button_link?: string;
  features?: string;
  image_urls?: string;
  image_url?: string;
  image_tag?: string;
  startAt?: string | null;
  endAt?: string | null;
  isMobileView?: boolean;
  [key: string]: unknown;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * Calculates remaining time based on start_at and end_at.
 * - If current time is before start_at, returns the duration between start_at and end_at.
 * - If current time is between start_at and end_at, counts down to end_at.
 * - If end_at has passed, returns 0s.
 */
function calculateTimeLeft(startAtStr?: string | null, endAtStr?: string | null): TimeLeft | null {
  if (!endAtStr) return null;

  const endTime = new Date(endAtStr).getTime();
  const startTime = startAtStr ? new Date(startAtStr).getTime() : null;
  const now = Date.now();

  let diff: number;

  if (startTime && !isNaN(startTime)) {
    if (now < startTime) {
      diff = endTime - startTime;
    } else {
      diff = endTime - now;
    }
  } else {
    diff = endTime - now;
  }

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function CountdownBanner({
  badge_text = "LIMITED PERIOD OFFER",
  heading = "Don't Miss This Deal!",
  heading_highlight = "Timer Hits Zero, Price Up.",
  subtext = "Lock today's special price on this product before the offer ends. No coupon needed — inquire directly before the timer runs out.",
  show_countdown = true,
  button_text = "Claim This Offer",
  button_link = "/sample-kit",
  secondary_button_text = "WhatsApp 72176 44573",
  secondary_button_link = "https://wa.me/917217644573",
  features = "100% Waterproof, Termite-Proof, Gurgaon & Delhi NCR",
  image_urls,
  image_url,
  image_tag = "Wall Panels • SPC Flooring • Premium Finish",
  startAt,
  endAt,
  isMobileView,
}: CountdownBannerProps) {
  // Live timer state
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() => calculateTimeLeft(startAt, endAt));
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  useEffect(() => {
    if (!show_countdown || !endAt) return;

    const timer = setInterval(() => {
      const remaining = calculateTimeLeft(startAt, endAt);
      setTimeLeft(remaining);
      if (remaining && remaining.days === 0 && remaining.hours === 0 && remaining.minutes === 0 && remaining.seconds === 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [startAt, endAt, show_countdown]);

  // Display timer: if endAt is set use real calculation, otherwise show demonstration timer
  const displayTimer = useMemo(() => {
    if (endAt && timeLeft) return timeLeft;
    if (timeLeft) return timeLeft;
    // Default demonstration timer when no dates are configured yet
    return { days: 2, hours: 11, minutes: 45, seconds: 30 };
  }, [endAt, timeLeft]);

  // Parse multiple images
  const parsedImages = useMemo(() => {
    const raw = (image_urls || image_url || "").trim();
    if (!raw) {
      return [
        "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775411703/Luxury_Penthouse_Living_Room_with_Light_Oak_Herringbone_Flooring_Gurugram.jpg",
        "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775544853/oak_color_laminate_flooring_installed_images.png",
      ];
    }
    const list = raw
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter((s) => s.startsWith("http://") || s.startsWith("https://") || s.startsWith("/"));
    return list.length > 0
      ? list
      : ["https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775411703/Luxury_Penthouse_Living_Room_with_Light_Oak_Herringbone_Flooring_Gurugram.jpg"];
  }, [image_urls, image_url]);

  // Auto-rotate multiple images if more than one image is provided
  useEffect(() => {
    if (parsedImages.length <= 1) return;
    const interval = setInterval(() => {
      setActiveImageIdx((prev) => {
        const current = prev >= parsedImages.length ? 0 : prev;
        return (current + 1) % parsedImages.length;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [parsedImages.length]);

  // Safe active index prevents blank black box if user deletes images while carousel was on a higher index
  const safeActiveIdx = activeImageIdx >= parsedImages.length ? 0 : activeImageIdx;

  // Parse bullet points / trust features
  const featuresList = useMemo(() => {
    if (!features || typeof features !== "string") return [];
    return features
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }, [features]);

  // Safe links
  const safePrimaryLink = getSafePromoLink(button_link);
  
  // Format WhatsApp link if raw phone number is passed
  const formattedSecondaryLink = useMemo(() => {
    if (!secondary_button_link) return null;
    const trimmed = secondary_button_link.trim();
    if (trimmed.startsWith("http") || trimmed.startsWith("/")) return trimmed;
    const digitsOnly = trimmed.replace(/[^0-9]/g, "");
    if (digitsOnly.length >= 10) return `https://wa.me/${digitsOnly}`;
    return null;
  }, [secondary_button_link]);
  const safeSecondaryLink = getSafePromoLink(formattedSecondaryLink);

  // ──────────────── SUB-COMPONENT: MOBILE PHONE LAYOUT ────────────────
  const MobileLayout = (
    <div className="space-y-3">
      {/* 1. Title & Subtitle */}
      <div className="space-y-1">
        {badge_text && (
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-500 shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span>{badge_text}</span>
            </span>
          </div>
        )}

        {heading && (
          <h3 className="text-lg font-black tracking-tight text-white leading-tight">
            {heading}
          </h3>
        )}

        {heading_highlight && (
          <div className="text-base font-black tracking-tight text-amber-500 leading-tight">
            {heading_highlight}
          </div>
        )}
      </div>

      {/* 2. Niche Image */}
      <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-slate-800 bg-slate-900 shadow-md group">
        {parsedImages.map((imgSrc, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              safeActiveIdx === idx ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgSrc}
              alt="Product Promotion"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
          </div>
        ))}

        {/* Pagination Dots */}
        {parsedImages.length > 1 && (
          <div className="absolute top-2 right-2 flex items-center gap-1 z-20 bg-slate-950/70 backdrop-blur-xs px-2 py-0.5 rounded-full border border-white/10">
            {parsedImages.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIdx(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  safeActiveIdx === idx ? "w-3.5 bg-amber-500" : "w-1.5 bg-white/40"
                }`}
                title={`View image ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Image Tag Pill at Bottom */}
        {image_tag && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 max-w-[92%] text-center">
            <span className="inline-block truncate rounded-full bg-slate-950/85 backdrop-blur-md border border-slate-700 px-2.5 py-0.5 text-[9px] font-semibold text-slate-200 shadow-md">
              {image_tag}
            </span>
          </div>
        )}
      </div>

      {/* 3. Image Ke Niche Paragraph (Subtext) */}
      {subtext && (
        <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line pt-0.5">
          {subtext}
        </p>
      )}

      {/* 4. Uske Niche Countdown - Sabko Barabar Jagah (grid-cols-4) */}
      {show_countdown && displayTimer && (
        <div className="pt-0.5">
          <div className="grid grid-cols-4 gap-1.5 w-full">
            {/* Days Box */}
            <div className="flex flex-col items-center justify-center rounded-lg bg-slate-900 border border-slate-800 py-2 px-1 shadow-inner w-full">
              <span className="font-mono text-base font-black tracking-tight text-white leading-none">
                {String(displayTimer.days).padStart(2, "0")}
              </span>
              <span className="text-[7px] font-bold uppercase tracking-wider text-amber-500 mt-1">
                DAYS
              </span>
            </div>

            {/* Hours Box */}
            <div className="flex flex-col items-center justify-center rounded-lg bg-slate-900 border border-slate-800 py-2 px-1 shadow-inner w-full">
              <span className="font-mono text-base font-black tracking-tight text-white leading-none">
                {String(displayTimer.hours).padStart(2, "0")}
              </span>
              <span className="text-[7px] font-bold uppercase tracking-wider text-amber-500 mt-1">
                HOURS
              </span>
            </div>

            {/* Minutes Box */}
            <div className="flex flex-col items-center justify-center rounded-lg bg-slate-900 border border-slate-800 py-2 px-1 shadow-inner w-full">
              <span className="font-mono text-base font-black tracking-tight text-white leading-none">
                {String(displayTimer.minutes).padStart(2, "0")}
              </span>
              <span className="text-[7px] font-bold uppercase tracking-wider text-amber-500 mt-1">
                MINS
              </span>
            </div>

            {/* Seconds Box */}
            <div className="flex flex-col items-center justify-center rounded-lg bg-slate-900 border border-slate-800 py-2 px-1 shadow-inner w-full">
              <span className="font-mono text-base font-black tracking-tight text-amber-400 leading-none">
                {String(displayTimer.seconds).padStart(2, "0")}
              </span>
              <span className="text-[7px] font-bold uppercase tracking-wider text-amber-500 mt-1">
                SECS
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 5. Buttons (Full-width clean stack) */}
      <div className="flex flex-col gap-2 pt-1">
        {button_text && safePrimaryLink && (
          <Link
            href={safePrimaryLink}
            className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 py-2.5 px-3 text-xs font-bold text-white shadow-md shadow-amber-600/20 transition active:scale-95"
          >
            <span>{button_text}</span>
            <ArrowRight className="h-3.5 w-3.5 shrink-0" />
          </Link>
        )}

        {secondary_button_text && safeSecondaryLink && (
          <Link
            href={safeSecondaryLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 py-2.5 px-3 text-xs font-bold text-slate-200 transition hover:border-slate-600"
          >
            <svg className="h-3.5 w-3.5 text-[#22c55e] fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            <span>{secondary_button_text}</span>
          </Link>
        )}
      </div>

      {/* 6. Trust Bullet Points */}
      {featuresList.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 pt-0.5 text-[10px] font-medium text-slate-300">
          {featuresList.map((f, i) => (
            <div key={i} className="flex items-center gap-1">
              <Check className="h-3 w-3 text-amber-500 shrink-0" />
              <span>{f}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ──────────────── SUB-COMPONENT: DESKTOP VIEWPORT LAYOUT ────────────────
  const DesktopLayout = (
    <div className="grid grid-cols-12 gap-6 items-center">
      {/* Left Content (7 cols) */}
      <div className="col-span-7 space-y-4">
        {badge_text && (
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-500 shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span>{badge_text}</span>
            </span>
          </div>
        )}

        <div className="space-y-1">
          {heading && (
            <h3 className="text-2xl lg:text-3xl font-black tracking-tight text-white leading-tight">
              {heading}
            </h3>
          )}
          {heading_highlight && (
            <div className="text-2xl lg:text-3xl font-black tracking-tight text-amber-500 leading-tight">
              {heading_highlight}
            </div>
          )}
        </div>

        {subtext && (
          <p className="text-sm text-slate-300 leading-relaxed max-w-xl whitespace-pre-line">
            {subtext}
          </p>
        )}

        {show_countdown && displayTimer && (
          <div className="pt-1">
            <div className="grid grid-cols-4 gap-2.5 max-w-sm">
              <div className="flex flex-col items-center justify-center rounded-xl bg-slate-900 border border-slate-800 py-2.5 px-3 shadow-inner">
                <span className="font-mono text-2xl font-black tracking-tight text-white leading-none">
                  {String(displayTimer.days).padStart(2, "0")}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-amber-500 mt-1">
                  DAYS
                </span>
              </div>

              <div className="flex flex-col items-center justify-center rounded-xl bg-slate-900 border border-slate-800 py-2.5 px-3 shadow-inner">
                <span className="font-mono text-2xl font-black tracking-tight text-white leading-none">
                  {String(displayTimer.hours).padStart(2, "0")}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-amber-500 mt-1">
                  HOURS
                </span>
              </div>

              <div className="flex flex-col items-center justify-center rounded-xl bg-slate-900 border border-slate-800 py-2.5 px-3 shadow-inner">
                <span className="font-mono text-2xl font-black tracking-tight text-white leading-none">
                  {String(displayTimer.minutes).padStart(2, "0")}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-amber-500 mt-1">
                  MINS
                </span>
              </div>

              <div className="flex flex-col items-center justify-center rounded-xl bg-slate-900 border border-slate-800 py-2.5 px-3 shadow-inner">
                <span className="font-mono text-2xl font-black tracking-tight text-amber-400 leading-none">
                  {String(displayTimer.seconds).padStart(2, "0")}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-amber-500 mt-1">
                  SECS
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 pt-1">
          {button_text && safePrimaryLink && (
            <Link
              href={safePrimaryLink}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-500 px-5 py-3 text-sm font-bold text-white shadow-md shadow-amber-600/20 transition active:scale-95"
            >
              <span>{button_text}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}

          {secondary_button_text && safeSecondaryLink && (
            <Link
              href={safeSecondaryLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 px-4 py-3 text-sm font-bold text-slate-200 transition hover:border-slate-600"
            >
              <svg className="h-4 w-4 text-[#22c55e] fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>{secondary_button_text}</span>
            </Link>
          )}
        </div>
      </div>

      {/* Right Column: Image + 3 Ticks below image (5 cols) */}
      <div className="col-span-5 flex flex-col justify-center gap-3">
        <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-md group">
          {parsedImages.map((imgSrc, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                safeActiveIdx === idx ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imgSrc}
                alt="Product Promotion"
                className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-105"
                referrerPolicy="no-referrer"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            </div>
          ))}

          {parsedImages.length > 1 && (
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-20 bg-slate-950/70 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/10">
              {parsedImages.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIdx(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    safeActiveIdx === idx ? "w-4 bg-amber-500" : "w-1.5 bg-white/40 hover:bg-white/70"
                  }`}
                  title={`View image ${idx + 1}`}
                />
              ))}
            </div>
          )}

          {image_tag && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 max-w-[90%] text-center">
              <span className="inline-block truncate rounded-full bg-slate-950/85 backdrop-blur-md border border-slate-700 px-3.5 py-1 text-[11px] font-semibold text-slate-200 shadow-md">
                {image_tag}
              </span>
            </div>
          )}
        </div>

        {/* 3 Ticks below image */}
        {featuresList.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 pt-0.5 text-[11px] font-medium text-slate-300">
            {featuresList.map((f, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // If isMobileView prop is explicitly provided, unconditionally render that layout!
  if (isMobileView === true) {
    return (
      <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-950 px-2.5 py-3 shadow-xl text-white">
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
        {MobileLayout}
      </div>
    );
  }

  if (isMobileView === false) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl text-white">
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
        {DesktopLayout}
      </div>
    );
  }

  // Fallback for live product page (uses CSS responsive breakpoints)
  return (
    <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-slate-800 bg-slate-950 px-2.5 py-3 sm:px-4 sm:py-4 lg:p-6 shadow-xl text-white">
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />

      {/* Mobile view (< lg) */}
      <div className="block lg:hidden">
        {MobileLayout}
      </div>

      {/* Desktop view (>= lg) */}
      <div className="hidden lg:block">
        {DesktopLayout}
      </div>
    </div>
  );
}
