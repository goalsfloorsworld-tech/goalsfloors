"use client";

import { useState } from "react";
import { Check, CheckCircle2, Loader2, MessageCircle, ShieldCheck } from "lucide-react";

export type B2BBgTheme = "midnight_navy" | "charcoal_black" | "emerald_green" | "royal_amber";

export interface B2BProjectLeadBannerProps {
  badge_text?: string;
  heading?: string;
  subheading?: string;
  benefit_1?: string;
  benefit_2?: string;
  benefit_3?: string;
  // 4 Compulsory Showcase Cards
  card_1_title?: string;
  card_1_image?: string;
  card_2_title?: string;
  card_2_image?: string;
  card_3_title?: string;
  card_3_image?: string;
  card_4_title?: string;
  card_4_image?: string;
  // Lead Form
  form_title?: string;
  form_subtitle?: string;
  button_text?: string;
  whatsapp_number?: string;
  bg_theme?: B2BBgTheme | string;
  isMobileView?: boolean;
  [key: string]: unknown;
}

export default function B2BProjectLeadBanner({
  badge_text = "FOR BUSINESS AND PROJECTS",
  heading = "Flooring for Big Projects",
  subheading = "For architects, builders, designers and contractors.",
  benefit_1 = "Bulk Pricing",
  benefit_2 = "Project Supply",
  benefit_3 = "Delhi NCR Delivery",
  card_1_title = "Offices",
  card_1_image = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
  card_2_title = "Restaurants",
  card_2_image = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
  card_3_title = "Hotels",
  card_3_image = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
  card_4_title = "Retail Stores",
  card_4_image = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
  form_title = "Get a Bulk Quote",
  form_subtitle = "Direct wholesale rates & sample kit for your site",
  button_text = "Request Callback",
  whatsapp_number = "917217644573",
  bg_theme = "midnight_navy",
  isMobileView,
}: B2BProjectLeadBannerProps) {
  // Lead Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [projectType, setProjectType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Theme palettes
  const theme = (() => {
    if (typeof bg_theme === "string" && bg_theme.startsWith("#")) {
      const hex = bg_theme.toLowerCase();
      return {
        isCustom: true,
        customHex: hex,
        rightBg: "",
        badgeBg: "text-white",
        headingColor: "text-slate-900 dark:text-white",
        btnBg: "text-white",
        accentRing: "focus:border-slate-800",
        pillBg: "text-white",
      };
    }

    switch (bg_theme) {
      case "charcoal_black":
        return {
          isCustom: false,
          customHex: "",
          rightBg: "from-[#0f172a] to-[#020617]",
          badgeBg: "bg-slate-900 text-white",
          headingColor: "text-slate-900 dark:text-white",
          btnBg: "bg-slate-900 hover:bg-black text-white",
          accentRing: "focus:border-slate-800 focus:ring-slate-800/20",
          pillBg: "bg-slate-900 text-white",
        };
      case "emerald_green":
        return {
          isCustom: false,
          customHex: "",
          rightBg: "from-[#062c1e] to-[#02130c]",
          badgeBg: "bg-[#062c1e] text-emerald-200",
          headingColor: "text-[#062c1e] dark:text-white",
          btnBg: "bg-[#062c1e] hover:bg-[#0a422e] text-white",
          accentRing: "focus:border-emerald-700 focus:ring-emerald-700/20",
          pillBg: "bg-[#062c1e] text-white",
        };
      case "royal_amber":
        return {
          isCustom: false,
          customHex: "",
          rightBg: "from-[#2b1704] to-[#140b02]",
          badgeBg: "bg-[#2b1704] text-amber-200",
          headingColor: "text-[#2b1704] dark:text-white",
          btnBg: "bg-amber-600 hover:bg-amber-700 text-white",
          accentRing: "focus:border-amber-600 focus:ring-amber-600/20",
          pillBg: "bg-[#2b1704] text-white",
        };
      case "midnight_navy":
      default:
        return {
          isCustom: false,
          customHex: "",
          rightBg: "from-[#0b132b] to-[#050b1c]",
          badgeBg: "bg-[#0b132b] text-white",
          headingColor: "text-[#0b132b] dark:text-white",
          btnBg: "bg-[#0b132b] hover:bg-[#15234f] text-white",
          accentRing: "focus:border-[#0b132b] focus:ring-[#0b132b]/20",
          pillBg: "bg-[#0b132b] text-white",
        };
    }
  })();

  const cards = [
    { title: card_1_title, image: card_1_image },
    { title: card_2_title, image: card_2_image },
    { title: card_3_title, image: card_3_image },
    { title: card_4_title, image: card_4_image },
  ];

  const benefits = [benefit_1, benefit_2, benefit_3].filter(Boolean);

  // Form Submission Handler
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedName = name.trim();
    const cleanPhone = phone.replace(/[^0-9]/g, "");

    if (!trimmedName) {
      setErrorMsg("Please enter your name.");
      return;
    }
    if (cleanPhone.length < 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsSubmitting(true);

    // If running in live preview mode, simulate realistic fast response
    if (isMobileView !== undefined) {
      await new Promise((r) => setTimeout(r, 600));
      setIsSubmitting(false);
      setIsSubmitted(true);
      return;
    }

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          phone: cleanPhone,
          interest: `B2B Bulk Quote: ${projectType || "General Commercial"}`,
          source: "B2B_Promo_Banner",
          message: `Project Type: ${projectType || "Not Specified"}\nRequested via Flooring for Big Projects banner`,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit request.");
      }
      setIsSubmitted(true);
    } catch {
      // Graceful fallback to direct WhatsApp
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappCleanNumber = (whatsapp_number || "917217644573").replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${whatsappCleanNumber}?text=${encodeURIComponent(
    `Hi Goals Floors, I am looking for commercial project flooring / bulk supply for: ${projectType || "Commercial Project"}.`
  )}`;

  // ──────────────── SUB-COMPONENT: LEAD CAPTURE FORM CARD ────────────────
  const LeadFormCard = (
    <div className="w-full max-w-[340px] mx-auto rounded-2xl bg-white p-5 sm:p-6 shadow-2xl text-slate-800">
      {isSubmitted ? (
        <div className="text-center py-4 space-y-3 animate-in fade-in zoom-in-95 duration-200">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-base text-slate-900">Request Received!</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our project manager will call you within 2 business hours.
            </p>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 py-2.5 px-4 text-xs font-bold text-white shadow-md transition active:scale-95"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Chat Directly on WhatsApp</span>
          </a>
          <button
            type="button"
            onClick={() => {
              setIsSubmitted(false);
              setName("");
              setPhone("");
              setProjectType("");
            }}
            className="text-[11px] text-slate-400 hover:text-slate-600 underline pt-1 block mx-auto"
          >
            Submit another query
          </button>
        </div>
      ) : (
        <form onSubmit={handleFormSubmit} className="space-y-3">
          <div className="text-center space-y-0.5 pb-1">
            <h3 className="text-base sm:text-lg font-black tracking-tight text-[#0b132b]">
              {form_title}
            </h3>
            {form_subtitle && (
              <p className="text-[10.5px] text-slate-500 font-medium">
                {form_subtitle}
              </p>
            )}
          </div>

          {errorMsg && (
            <div className="rounded-lg bg-rose-50 border border-rose-200 px-2.5 py-1.5 text-[11px] text-rose-700 font-medium">
              {errorMsg}
            </div>
          )}

          <div className="space-y-2.5">
            <div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className={`w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-hidden transition shadow-2xs ${theme.accentRing}`}
              />
            </div>

            <div>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number"
                maxLength={14}
                className={`w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-hidden transition shadow-2xs ${theme.accentRing}`}
              />
            </div>

            <div>
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                className={`w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:outline-hidden transition shadow-2xs ${theme.accentRing}`}
              >
                <option value="">Project Type (Optional)</option>
                <option value="Offices / Commercial">Offices / Commercial</option>
                <option value="Hotels & Hospitality">Hotels & Hospitality</option>
                <option value="Restaurants & Cafes">Restaurants & Cafes</option>
                <option value="Retail Stores">Retail Stores</option>
                <option value="Residential Builder / Villa">Residential Builder / Villa</option>
                <option value="Other Project">Other Project</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={theme.isCustom ? { backgroundColor: theme.customHex } : undefined}
            className={`w-full inline-flex items-center justify-center gap-2 rounded-xl ${theme.btnBg} py-2.5 px-4 text-xs font-black tracking-wide shadow-lg transition active:scale-95 disabled:opacity-60 cursor-pointer`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <span>{button_text}</span>
            )}
          </button>

          <div className="flex items-center justify-center gap-1.5 pt-0.5 text-[9.5px] text-slate-400">
            <ShieldCheck className="h-3 w-3 text-slate-400" />
            <span>Guaranteed project pricing • Direct factory supply</span>
          </div>
        </form>
      )}
    </div>
  );

  // ──────────────── SUB-COMPONENT: MOBILE PHONE LAYOUT ────────────────
  const MobileLayout = (
    <div className="relative z-10 space-y-4 pt-2">
      {/* 1. Header Information */}
      <div className="space-y-2 text-left">
        {badge_text && (
          <span
            style={theme.isCustom ? { backgroundColor: theme.customHex } : undefined}
            className={`inline-block text-[9.5px] font-black uppercase tracking-wider py-1 px-3 rounded-full ${theme.badgeBg}`}
          >
            {badge_text}
          </span>
        )}
        <h2 className={`font-black text-2xl tracking-tight leading-tight ${theme.headingColor}`}>
          {heading}
        </h2>
        {subheading && (
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            {subheading}
          </p>
        )}

        {/* Benefits Checklist */}
        {benefits.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="inline-flex items-center gap-1.5 rounded-full bg-white border border-slate-200/80 px-2.5 py-1 text-[10px] font-bold text-slate-800 shadow-2xs"
              >
                <div className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#0b132b] text-white">
                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                </div>
                <span>{b}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Showcase Cards: 2x2 Clean Grid on Phone */}
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        {cards.map((c, i) => (
          <div
            key={i}
            className="group relative rounded-xl overflow-hidden bg-white p-1 shadow-md border border-slate-200/70"
          >
            <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg bg-slate-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.image}
                alt={c.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
                loading="eager"
              />
              {/* Category Pill Tag overlapping bottom */}
              <div className="absolute bottom-1 inset-x-0 flex justify-center z-10 pointer-events-none">
                <span className="rounded-full bg-[#0b132b]/95 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 shadow-md">
                  {c.title}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Dark Navy Container with White Quote Card */}
      <div
        style={theme.isCustom ? { background: `linear-gradient(180deg, ${theme.customHex} 0%, #030611 100%)` } : undefined}
        className={`rounded-2xl ${theme.isCustom ? "" : `bg-gradient-to-b ${theme.rightBg}`} p-3.5 sm:p-4 shadow-xl`}
      >
        {LeadFormCard}
      </div>
    </div>
  );

  // ──────────────── SUB-COMPONENT: DESKTOP VIEWPORT LAYOUT ────────────────
  const DesktopLayout = (
    <div className="relative z-10 grid grid-cols-12 min-h-[380px] items-stretch">
      {/* Left Column (7.5 cols): Light Architectural Showcase */}
      <div className="col-span-12 lg:col-span-8 p-6 lg:p-8 flex flex-col justify-between space-y-6">
        {/* Top Text Content */}
        <div className="space-y-2.5">
          {badge_text && (
            <span
              style={theme.isCustom ? { backgroundColor: theme.customHex } : undefined}
              className={`inline-block text-[10px] font-black uppercase tracking-widest py-1 px-3.5 rounded-full ${theme.badgeBg}`}
            >
              {badge_text}
            </span>
          )}
          <h2 className={`font-black text-3xl xl:text-4xl tracking-tight leading-tight ${theme.headingColor}`}>
            {heading}
          </h2>
          {subheading && (
            <p className="text-sm text-slate-600 font-medium leading-relaxed max-w-xl">
              {subheading}
            </p>
          )}

          {/* 3 Checklist Items */}
          {benefits.length > 0 && (
            <div className="flex items-center gap-3 pt-2">
              {benefits.map((b, i) => (
                <div
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white border border-slate-200/80 px-3 py-1.5 text-xs font-bold text-slate-800 shadow-2xs"
                >
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#0b132b] text-white">
                    <Check className="h-2.5 w-2.5 stroke-[3]" />
                  </div>
                  <span>{b}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom: 4 Staggered Category Showcase Cards in pronounced Zigzag with 24px bottom padding */}
        <div className="grid grid-cols-4 gap-3 pt-2 pb-6 items-end">
          {cards.map((c, i) => {
            // Pronounced architectural zigzag:
            // Card 1: Up (-translate-y-5)
            // Card 2: Down (translate-y-2)
            // Card 3: Up (-translate-y-6)
            // Card 4: Down (translate-y-2)
            const staggerClasses = [
              "-translate-y-5",
              "translate-y-2",
              "-translate-y-6",
              "translate-y-2",
            ][i % 4];

            return (
              <div
                key={i}
                className={`group relative rounded-xl bg-white p-1 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 hover:z-20 cursor-pointer border border-slate-200/80 ${staggerClasses}`}
              >
                <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg bg-slate-900 shadow-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.image}
                    alt={c.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                    referrerPolicy="no-referrer"
                    loading="eager"
                  />
                  {/* Category Pill Tag overlapping bottom */}
                  <div className="absolute bottom-1 inset-x-0 flex justify-center z-10 pointer-events-none">
                    <span className="rounded-full bg-[#0b132b]/95 backdrop-blur-xs text-white text-[10px] xl:text-[11px] font-bold px-2.5 py-0.5 shadow-md">
                      {c.title}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column (4.5 cols): Deep Midnight Navy Background with Floating White Quote Form */}
      <div
        style={theme.isCustom ? { background: `linear-gradient(180deg, ${theme.customHex} 0%, #030611 100%)` } : undefined}
        className={`col-span-12 lg:col-span-4 ${theme.isCustom ? "" : `bg-gradient-to-b ${theme.rightBg}`} p-6 lg:p-8 flex items-center justify-center relative overflow-hidden`}
      >
        {/* Subtle decorative glow circle in dark section */}
        <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />

        {/* Lead Form Card */}
        <div className="relative z-10 w-full">
          {LeadFormCard}
        </div>
      </div>
    </div>
  );

  // Deterministic Admin Phone Preview
  if (isMobileView === true) {
    return (
      <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 shadow-xl">
        {MobileLayout}
      </div>
    );
  }

  // Deterministic Admin Desktop Preview
  if (isMobileView === false) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {DesktopLayout}
      </div>
    );
  }

  // Responsive fallback on live product page
  return (
    <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200 bg-white shadow-xl">
      {/* Mobile view (< lg) */}
      <div className="block lg:hidden p-3.5 sm:p-4 bg-slate-50/70">{MobileLayout}</div>

      {/* Desktop view (>= lg) */}
      <div className="hidden lg:block">{DesktopLayout}</div>
    </div>
  );
}
