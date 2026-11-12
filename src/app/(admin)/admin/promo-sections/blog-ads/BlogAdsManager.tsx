"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BadgePercent,
  Flame,
  Save,
  RotateCcw,
  ImageIcon,
  Columns,
  Eye,
  Sparkles,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import {
  type BlogSideAdsConfig,
  type BlogSideAdItem,
  DEFAULT_BLOG_SIDE_ADS,
} from "@/lib/blog/ads";
import {
  getBlogSideAdsConfig,
  saveBlogSideAdsConfig,
} from "@/actions/admin/blog-ads";
import CloudinaryImagePickerModal, { POPULAR_SITE_IMAGES } from "@/components/admin/CloudinaryImagePickerModal";
import { BlogSideAdCard } from "@/components/blog/BlogSideAds";

export default function BlogAdsManager() {
  const [config, setConfig] = useState<BlogSideAdsConfig>(DEFAULT_BLOG_SIDE_ADS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSide, setActiveSide] = useState<"left" | "right">("left");
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getBlogSideAdsConfig();
        setConfig(data);
      } catch (err) {
        console.error("Failed to load blog side ads:", err);
        toast.error("Failed to load existing blog ads configuration.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const currentAd = activeSide === "left" ? config.left_ad : config.right_ad;

  const updateCurrentAd = (field: keyof BlogSideAdItem, value: unknown) => {
    setConfig((prev) => ({
      ...prev,
      [activeSide === "left" ? "left_ad" : "right_ad"]: {
        ...prev[activeSide === "left" ? "left_ad" : "right_ad"],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await saveBlogSideAdsConfig(config);
      if (res.success) {
        toast.success("Blog side ads saved successfully! Live on all /blogs/[slug] pages.", {
          duration: 4000,
          icon: "🚀",
        });
      } else {
        toast.error(res.error || "Failed to save blog ads.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error saving blog ads");
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefault = () => {
    if (confirm("Reset both ads to default high-converting Goals Floors templates?")) {
      setConfig(DEFAULT_BLOG_SIDE_ADS);
      toast.success("Reset to default templates.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="h-5 w-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading Blog Side Ads configuration...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      <Toaster position="top-right" />

      {/* ─── TOP SECTION TABS NAVIGATION ─── */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Link
            href="/admin/promo-sections"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
          >
            <BadgePercent className="w-3.5 h-3.5 text-gray-400" />
            <span>Product Promo Banners</span>
          </Link>

          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 text-white shadow-xs">
            <Columns className="w-3.5 h-3.5" />
            <span>Blog Desktop Side Ads</span>
          </span>

          <Link
            href="/admin/trending"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
          >
            <Flame className="w-3.5 h-3.5 text-gray-400" />
            <span>Trending Now Section</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition active:scale-95 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? "Publishing..." : "Save & Publish Ads"}</span>
          </button>
        </div>
      </div>

      {/* ─── TWO-COLUMN WORKSPACE: FORM (LEFT 7 COLS) + FOCUSED SINGLE AD PREVIEW (RIGHT 5 COLS) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: EDITING FORM */}
        <div className="lg:col-span-7 space-y-5">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-5">
            {/* Header + Left/Right Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-slate-800">
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Columns className="w-4 h-4 text-amber-500" />
                  <span>
                    Editing {activeSide === "left" ? "Left Side Ad" : "Right Side Ad"}
                  </span>
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Choose a side to configure its content and preview it live on the right.
                </p>
              </div>

              {/* Side Switcher Tab Pill */}
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 p-1 rounded-xl border border-gray-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setActiveSide("left")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    activeSide === "left"
                      ? "bg-amber-500 text-white shadow-xs"
                      : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  }`}
                >
                  <span>Left Side Ad</span>
                  <span
                    className={`h-2 w-2 rounded-full ${
                      config.left_ad.enabled ? "bg-emerald-300" : "bg-gray-400"
                    }`}
                  />
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSide("right")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    activeSide === "right"
                      ? "bg-amber-500 text-white shadow-xs"
                      : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  }`}
                >
                  <span>Right Side Ad</span>
                  <span
                    className={`h-2 w-2 rounded-full ${
                      config.right_ad.enabled ? "bg-emerald-300" : "bg-gray-400"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Status Toggle Bar */}
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-gray-200/80 bg-gray-50/50 dark:border-slate-800 dark:bg-slate-800/40">
              <div>
                <label className="text-xs font-bold text-gray-800 dark:text-gray-200 block">
                  {activeSide === "left" ? "Left Ad Active Status" : "Right Ad Active Status"}
                </label>
                <span className="text-[11px] text-gray-500">
                  {currentAd.enabled
                    ? "Currently active on desktop screens (> 1280px)"
                    : "Hidden / Disabled on desktop blogs"}
                </span>
              </div>

              <button
                type="button"
                onClick={() => updateCurrentAd("enabled", !currentAd.enabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  currentAd.enabled ? "bg-emerald-500" : "bg-gray-300 dark:bg-slate-700"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-xs ${
                    currentAd.enabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Format Toggle: Standard vs Custom HTML */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Ad Design Format
              </span>
              <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-slate-800 p-0.5 rounded-lg border border-gray-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => updateCurrentAd("is_custom_code", false)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                    !currentAd.is_custom_code
                      ? "bg-amber-500 text-white shadow-xs"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  Standard Luxury Card
                </button>
                <button
                  type="button"
                  onClick={() => updateCurrentAd("is_custom_code", true)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                    currentAd.is_custom_code
                      ? "bg-amber-500 text-white shadow-xs"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  Custom HTML / Code
                </button>
              </div>
            </div>

            {/* Custom Code Mode */}
            {currentAd.is_custom_code ? (
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                  Custom Banner HTML &amp; Tailwind CSS
                </label>
                <textarea
                  rows={14}
                  value={currentAd.custom_html || ""}
                  onChange={(e) => updateCurrentAd("custom_html", e.target.value)}
                  placeholder="<div class='bg-[#161513] text-white p-4 rounded-xl'>...</div>"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3.5 font-mono text-xs text-gray-900 focus:border-amber-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800/60 dark:text-white"
                />
              </div>
            ) : (
              /* Standard Luxury Card Form Fields */
              <div className="space-y-4 pt-1">
                {/* Theme Selector */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Color Theme &amp; Accent
                  </label>
                  <select
                    value={currentAd.theme || "amber_gold"}
                    onChange={(e) =>
                      updateCurrentAd(
                        "theme",
                        e.target.value as "amber_gold" | "emerald_luxury" | "charcoal_slate" | "royal_navy"
                      )
                    }
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2 text-xs text-gray-900 focus:border-amber-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-white"
                  >
                    <option value="amber_gold">🟡 Amber Gold &amp; Obsidian (Festive / Luxury)</option>
                    <option value="emerald_luxury">🟢 Emerald Luxury (Consultation / WhatsApp)</option>
                    <option value="charcoal_slate">⚫ Charcoal Slate (Minimalist Corporate)</option>
                    <option value="royal_navy">🔵 Royal Sapphire Navy (Architectural)</option>
                  </select>
                </div>

                {/* Eyebrow Badge */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Top Eyebrow Badge
                  </label>
                  <input
                    type="text"
                    value={currentAd.badge}
                    onChange={(e) => updateCurrentAd("badge", e.target.value)}
                    placeholder="e.g. FREE AT YOUR DOORSTEP or GURGAON EXPERTS"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2 text-xs text-gray-900 focus:border-amber-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-white"
                  />
                </div>

                {/* Headline */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Main Headline <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={currentAd.headline}
                    onChange={(e) => updateCurrentAd("headline", e.target.value)}
                    placeholder="e.g. Touch & Feel Real Wood"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2 text-xs font-semibold text-gray-900 focus:border-amber-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-white"
                  />
                </div>

                {/* Subtext */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Short Description
                  </label>
                  <textarea
                    rows={2}
                    value={currentAd.subtext}
                    onChange={(e) => updateCurrentAd("subtext", e.target.value)}
                    placeholder="Short 1-2 lines explaining the offer or guidance"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2 text-xs text-gray-900 focus:border-amber-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-white"
                  />
                </div>

                {/* Image URL & Picker */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                      Product / Offer Image
                    </label>
                    <button
                      type="button"
                      onClick={() => setPickerOpen(true)}
                      className="text-xs font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-400 flex items-center gap-1"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Browse Cloudinary</span>
                    </button>
                  </div>

                  <input
                    type="text"
                    value={currentAd.image_url}
                    onChange={(e) => updateCurrentAd("image_url", e.target.value)}
                    placeholder="https://res.cloudinary.com/..."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2 text-xs font-mono text-gray-900 focus:border-amber-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-white mb-2"
                  />

                  {/* Preset Quick Chooser */}
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        updateCurrentAd("image_url", e.target.value);
                      }
                    }}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-300"
                  >
                    <option value="">-- Or Choose From Verified Product Presets --</option>
                    {POPULAR_SITE_IMAGES.map((img) => (
                      <option key={img.url} value={img.url}>
                        {img.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Button Text & Button Link */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={currentAd.button_text}
                      onChange={(e) => updateCurrentAd("button_text", e.target.value)}
                      placeholder="e.g. Order Free Samples →"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2 text-xs text-gray-900 focus:border-amber-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Button Link
                    </label>
                    <div className="space-y-1.5">
                      <input
                        type="text"
                        value={currentAd.button_link}
                        onChange={(e) => updateCurrentAd("button_link", e.target.value)}
                        placeholder="e.g. /sample-kit or https://wa.me/..."
                        className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2 text-xs text-gray-900 focus:border-amber-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-white"
                      />
                      <div className="flex flex-wrap gap-1">
                        <button
                          type="button"
                          onClick={() => updateCurrentAd("button_link", "/sample-kit")}
                          className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:text-gray-300"
                        >
                          /sample-kit
                        </button>
                        <button
                          type="button"
                          onClick={() => updateCurrentAd("button_link", "https://wa.me/917217644573")}
                          className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300"
                        >
                          WhatsApp
                        </button>
                        <button
                          type="button"
                          onClick={() => updateCurrentAd("button_link", "/contact")}
                          className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:text-gray-300"
                        >
                          /contact
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: FOCUSED SINGLE AD LIVE PREVIEW (5 COLS) */}
        <div className="lg:col-span-5 sticky top-5">
          <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
            {/* Header Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 select-none">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-gray-800 dark:text-gray-200 ml-1 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-amber-500" />
                  <span>
                    Live Preview: {activeSide === "left" ? "Left Side Ad" : "Right Side Ad"}
                  </span>
                </span>
              </div>

              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  currentAd.enabled
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400"
                    : "bg-gray-200 text-gray-600 dark:bg-slate-700 dark:text-gray-300"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    currentAd.enabled ? "bg-emerald-500 animate-pulse" : "bg-gray-400"
                  }`}
                />
                {currentAd.enabled ? "Active on Desktop" : "Disabled"}
              </span>
            </div>

            {/* Focused Preview Body */}
            <div className="p-6 bg-slate-50/70 dark:bg-slate-950/70 min-h-[580px] flex flex-col items-center justify-center">
              <div
                className={`w-[230px] 2xl:w-[250px] transition-all duration-300 ${
                  !currentAd.enabled ? "opacity-80" : ""
                }`}
              >
                <BlogSideAdCard ad={currentAd} side={activeSide} forceShow={true} previewMode={true} />
              </div>

              {!currentAd.enabled && (
                <div className="mt-4 p-2.5 rounded-xl border border-amber-300/60 bg-amber-50/70 dark:border-amber-900/40 dark:bg-amber-950/20 text-center max-w-[250px]">
                  <p className="text-[11px] text-amber-800 dark:text-amber-300 font-medium">
                    ⚠️ Currently turned OFF. Toggle the switch on the left to activate it on desktop blogs.
                  </p>
                </div>
              )}

              <div className="mt-5 text-center text-[10px] text-gray-400 max-w-[260px] leading-relaxed">
                📌 Docks flush to the {activeSide === "left" ? "left screen border" : "right screen border"} seamlessly, vertically centered on desktop screens (&gt; 1280px).
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cloudinary Image Picker Modal */}
      {pickerOpen && (
        <CloudinaryImagePickerModal
          isOpen={pickerOpen}
          onClose={() => setPickerOpen(false)}
          onSelectImage={(url: string) => {
            updateCurrentAd("image_url", url);
            setPickerOpen(false);
          }}
          currentValue={currentAd.image_url}
        />
      )}
    </div>
  );
}
