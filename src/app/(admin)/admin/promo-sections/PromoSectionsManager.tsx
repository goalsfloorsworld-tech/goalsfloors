"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  BadgePercent, Plus, Trash2, Edit3, RefreshCw, AlertCircle,
  Eye, Check, Smartphone, Monitor, Calendar, AlertTriangle,
  Archive, Globe, ArrowRight, X, Lock, Signal, Wifi, Battery,
  Sparkles, Copy, CheckCheck, Columns, Flame
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import {
  getAdminPromos, savePromoSection, setPromoStatus, deletePromoSection,
  AdminPromoSection, ConflictingSectionInfo
} from '@/actions/admin/promos';
import { VALID_PRODUCT_SLUGS, AVAILABLE_PAGE_LINKS } from '@/lib/promo/constants';
import { PROMO_TEMPLATES, TemplateFieldDefinition } from "@/components/promo/templates";
import { formatUtcToIst, istInputToUtcIso, utcIsoToIstInput, getNowIstInput } from '@/lib/promo/date';
import PromoImageField from "@/components/promo/PromoImageField";

const AI_PROMPT_BLUEPRINT = `You are an expert Frontend UI Designer creating a promotional banner for "Goals Floors" (a premium interior design, luxury wooden flooring, SPC herringbone, and architectural wall panel company in Gurgaon & Delhi NCR).

Generate a self-contained, responsive promotional banner HTML snippet.

=== CRITICAL RULES & CONSTRAINTS ===
1. STRICTLY NO JAVASCRIPT:
   - JavaScript is NOT supported and is strictly prohibited.
   - Do NOT write any <script> tags.
   - Do NOT write any inline JavaScript event handlers (no onclick, no onload, no onerror, no onmouseover, etc.).
   - Do NOT use href="javascript:...".
   - The platform runs automated security verification; ANY JavaScript will cause immediate submission rejection.

2. SINGLE CODE BLOCK (HTML + TAILWIND CSS):
   - All styling must be written using Tailwind CSS 3.4+ utility classes directly in the HTML.
   - If custom CSS (like keyframe animations or custom styling) is strictly necessary, include it inside a <style>...</style> block within this SAME single HTML snippet.
   - Do NOT output separate CSS files. Everything must live in one unified HTML block.

3. MANDATORY 100% RESPONSIVENESS:
   - The banner MUST be mobile-first and fully responsive across 360px mobile phones, 768px tablets, and 1440px desktop screens.
   - Use Tailwind responsive classes (e.g. flex flex-col md:flex-row, text-xl sm:text-2xl md:text-3xl, p-4 sm:p-6 md:p-8).
   - Ensure touch targets are at least 44px tall on mobile. Must NEVER cause horizontal overflow on small screens.

4. COUNTDOWN TIMER RULE:
   - Only include a countdown timer if explicitly requested in the user requirements below!
   - If the user did NOT specifically ask for a timer, do NOT include any timer.
   - If a countdown timer IS requested, use these dynamic tokens inside your timer number boxes:
     • {{DAYS}}    -> Live days remaining
     • {{HOURS}}   -> Live hours remaining
     • {{MINUTES}} -> Live minutes remaining
     • {{SECONDS}} -> Live seconds remaining
     (The website's React engine updates these tokens live every second).

5. DYNAMIC SYSTEM TOKENS AVAILABLE:
   - Dates (IST): {{START_DATE}}, {{END_DATE}}
   - System Links:
     • {{WHATSAPP_LINK}}   -> https://wa.me/917217644573 (Instant WhatsApp chat)
     • {{SAMPLE_KIT_LINK}} -> /sample-kit (Order Free Sample Kit)
     • {{CONTACT_LINK}}    -> /contact (Book Site Visit / Consultation)
     • {{PRODUCTS_LINK}}   -> /products (Catalogue)
     • {{COUPON_CODE}}     -> Dynamic coupon code if configured

========================================================================
=== WRITE YOUR BANNER REQUIREMENTS BELOW THIS LINE ====================
========================================================================

[IMPORTANT INSTRUCTION FOR AI]:
Check if the user has written their banner requirements below this line.
- If the user DID write requirements below, generate the complete responsive HTML snippet as requested.
- If the user did NOT write any requirements below this line, STOP and do NOT generate any code yet! Ask the user first:
  "Please tell me what kind of banner you want to create (e.g. occasion/festival, colors, discount offers, headline text, buttons)? Once you share your requirements, I will generate the complete responsive code for you."
`;

export default function PromoSectionsManager() {
  const [promos, setPromos] = useState<AdminPromoSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"manage" | "editor">("manage");
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("CountdownBanner");
  const [propsState, setPropsState] = useState<Record<string, unknown>>(() => {
    const entry = PROMO_TEMPLATES["CountdownBanner"];
    return entry ? { ...entry.defaults } : {};
  });
  const [startAtIst, setStartAtIst] = useState("");
  const [endAtIst, setEndAtIst] = useState("");
  const [priority, setPriority] = useState(0);
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [lastKnownUpdatedAt, setLastKnownUpdatedAt] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Preview State (Default to mobile)
  const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">("mobile");

  // Conflict Resolution Modal State
  const [conflictModalOpen, setConflictModalOpen] = useState(false);
  const [conflictingSections, setConflictingSections] = useState<ConflictingSectionInfo[]>([]);
  const [pendingSaveStatus, setPendingSaveStatus] = useState<"draft" | "published">("published");
  const [pendingStatusChangeId, setPendingStatusChangeId] = useState<string | null>(null);
  const [isResolvingConflict, setIsResolvingConflict] = useState(false);
  const [pagesModalOpen, setPagesModalOpen] = useState(false);

  // Fetch all promo sections
  const fetchPromos = async () => {
    setLoading(true);
    try {
      const res = await getAdminPromos();
      if (res.success) {
        setPromos(res.promos);
      } else {
        toast.error(res.error || "Failed to load promo sections");
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error fetching promos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  // Initialize or reset form for new promo
  const resetForm = () => {
    setEditingId(null);
    setFormName("");
    setSelectedTemplate("CountdownBanner");
    const tEntry = PROMO_TEMPLATES["CountdownBanner"];
    setPropsState(tEntry ? { ...tEntry.defaults } : {});
    setStartAtIst("");
    setEndAtIst("");
    setPriority(0);
    setSelectedSlugs([]);
    setLastKnownUpdatedAt(null);
  };

  const handleCopyAiPrompt = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(AI_PROMPT_BLUEPRINT);
      setCopiedPrompt(true);
      toast.success("Prompt copied! Paste it in ChatGPT/Claude and write your requirement below the line.", {
        duration: 5000,
        icon: "📋",
      });
      setTimeout(() => setCopiedPrompt(false), 3000);
    }
  };

  // Switch template and initialize default field values
  const handleTemplateChange = (tplId: string) => {
    setSelectedTemplate(tplId);
    const entry = PROMO_TEMPLATES[tplId];
    if (entry) {
      setPropsState({ ...entry.defaults });
    }
  };

  // Open editor for an existing promo
  const handleEdit = (sec: AdminPromoSection) => {
    setEditingId(sec.id);
    setFormName(sec.name);
    setSelectedTemplate(sec.template_id);
    const entry = PROMO_TEMPLATES[sec.template_id];
    setPropsState({
      ...(entry ? entry.defaults : {}),
      ...(sec.props_json || {}),
    });
    setStartAtIst(utcIsoToIstInput(sec.start_at));
    setEndAtIst(utcIsoToIstInput(sec.end_at));
    setPriority(sec.priority);
    setSelectedSlugs(sec.assignments.map((a) => a.product_slug));
    setLastKnownUpdatedAt(sec.updated_at);
    setActiveTab("editor");
  };

  // Toggle slug selection
  const handleSlugToggle = (slug: string) => {
    if (selectedSlugs.includes(slug)) {
      setSelectedSlugs(selectedSlugs.filter((s) => s !== slug));
    } else {
      setSelectedSlugs([...selectedSlugs, slug]);
    }
  };

  // Select all 13 products
  const handleSelectAllSlugs = () => {
    setSelectedSlugs([...VALID_PRODUCT_SLUGS]);
  };

  // Clear all slugs
  const handleClearSlugs = () => {
    setSelectedSlugs([]);
  };

  // Submit save (Draft or Published)
  const handleSubmit = async (targetStatus: "draft" | "published", replaceConflict = false) => {
    if (!formName.trim()) {
      toast.error("Please enter a section name");
      return;
    }

    const nowIst = getNowIstInput();

    // Start Date & Time (IST) is strictly compulsory
    if (!startAtIst || !startAtIst.trim()) {
      toast.error("Start Date & Time (IST) is required. Please select when this promo should start.");
      return;
    }

    // Start date cannot be in the past
    if (!editingId && startAtIst < nowIst.slice(0, 15)) {
      toast.error("Start Date cannot be in the past. Please select a current or future date.");
      return;
    }

    // End Date & Time (IST) is strictly compulsory
    if (!endAtIst || !endAtIst.trim()) {
      toast.error("End Date & Time (IST) is required. Please select when this promo should end.");
      return;
    }

    // End date cannot be before or equal to start date
    if (endAtIst <= startAtIst) {
      toast.error("End Date must be strictly after the Start Date.");
      return;
    }

    // Compulsory check for Festive Banner 5 Cards
    if (selectedTemplate === "FestiveOfferBanner" || selectedTemplate === "SampleKitCallout") {
      const missingCards: number[] = [];
      for (let i = 1; i <= 5; i++) {
        const img = propsState[`card_${i}_image`];
        if (!img || typeof img !== "string" || !img.trim()) {
          missingCards.push(i);
        }
      }
      if (missingCards.length > 0) {
        toast.error(`All 5 card images are compulsory for the Festive Banner! Card ${missingCards.join(", ")} is missing an image.`);
        return;
      }
    }

    // Compulsory check for B2B Project Lead Banner 4 Cards
    if (selectedTemplate === "B2BProjectLeadBanner" || selectedTemplate === "B2BBulkStrip") {
      const missingCards: number[] = [];
      for (let i = 1; i <= 4; i++) {
        const img = propsState[`card_${i}_image`];
        const title = propsState[`card_${i}_title`];
        if (!img || typeof img !== "string" || !img.trim() || !title || typeof title !== "string" || !title.trim()) {
          missingCards.push(i);
        }
      }
      if (missingCards.length > 0) {
        toast.error(`All 4 showcase cards (Offices, Restaurants, Hotels, Retail) are required for the B2B Banner! Card ${missingCards.join(", ")} is incomplete.`);
        return;
      }
    }

    // Compulsory check & strict validation for Custom Code Banner
    if (selectedTemplate === "CustomCodeBanner") {
      const html = String(propsState.custom_html || "").trim();
      if (!html) {
        toast.error("Custom HTML markup is required for the Custom Code Banner.");
        return;
      }

      // Security Check 1: Script tags strictly forbidden
      if (/<script\b/i.test(html)) {
        toast.error("Security Alert: JavaScript is strictly prohibited! Please remove all <script> tags.", { duration: 6000 });
        return;
      }

      // Security Check 2: Inline event handlers (onclick=, onload=, onerror=, etc.)
      if (/\bon\w+\s*=/i.test(html)) {
        const match = html.match(/\bon\w+\s*=/i);
        toast.error(`Security Alert: Inline JavaScript handlers (${match?.[0] || 'on*'}) are not allowed! Use pure HTML and Tailwind CSS.`, { duration: 6000 });
        return;
      }

      // Security Check 3: javascript: protocol in links
      if (/href\s*=\s*["']?\s*javascript:/i.test(html)) {
        toast.error("Security Alert: 'javascript:' links are not allowed. Please use standard links or {{WHATSAPP_LINK}}.", { duration: 6000 });
        return;
      }

      // Structural Balance Check: div and style tags
      if (typeof window !== "undefined") {
        const openDivs = (html.match(/<div\b/gi) || []).length;
        const closeDivs = (html.match(/<\/div>/gi) || []).length;
        if (openDivs !== closeDivs) {
          toast.error(`HTML Balance Warning: Detected ${openDivs} opening <div> tags but ${closeDivs} closing </div> tags. Please balance your tags before saving.`, { duration: 6000 });
          return;
        }

        const openStyles = (html.match(/<style\b/gi) || []).length;
        const closeStyles = (html.match(/<\/style>/gi) || []).length;
        if (openStyles !== closeStyles) {
          toast.error("CSS Balance Warning: Unclosed <style> tag detected. Please balance your tags before saving.", { duration: 6000 });
          return;
        }
      }
    }

    setIsSubmitting(true);
    try {
      const payload = {
        id: editingId || undefined,
        name: formName.trim(),
        template_id: selectedTemplate,
        props_json: propsState,
        status: targetStatus,
        start_at: startAtIst ? istInputToUtcIso(startAtIst) : null,
        end_at: endAtIst ? istInputToUtcIso(endAtIst) : null,
        priority: Number(priority) || 0,
        assigned_slugs: selectedSlugs,
        last_known_updated_at: lastKnownUpdatedAt,
        replaceConflict,
      };

      const res = await savePromoSection(payload);

      if (res.success) {
        toast.success(editingId ? "Promo section updated!" : "Promo section created!");
        setConflictModalOpen(false);
        resetForm();
        setActiveTab("manage");
        await fetchPromos();
      } else if (res.conflict) {
        // Page conflict detected
        const list = res.conflictingSections || (res.conflictingSection ? [res.conflictingSection] : []);
        setConflictingSections(list);
        setPendingSaveStatus(targetStatus);
        setPendingStatusChangeId(null);
        setConflictModalOpen(true);
      } else if (res.stale) {
        toast.error(res.error, { duration: 6000 });
        await fetchPromos();
      } else {
        toast.error(res.error || "Failed to save promo section");
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error saving section");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick Status change directly from list
  const handleStatusChange = async (
    sectionId: string,
    newStatus: "draft" | "published" | "archived",
    replaceConflict = false
  ): Promise<boolean> => {
    const loadingToast = toast.loading("Updating status...");
    try {
      const res = await setPromoStatus(sectionId, newStatus, replaceConflict);
      if (res.success) {
        toast.success(`Promo is now ${newStatus}`, { id: loadingToast });
        await fetchPromos();
        return true;
      } else if (res.conflict) {
        toast.dismiss(loadingToast);
        const list = res.conflictingSections || (res.conflictingSection ? [res.conflictingSection] : []);
        setConflictingSections(list);
        setPendingStatusChangeId(sectionId);
        setConflictModalOpen(true);
        return false;
      } else {
        toast.error(res.error || "Status update failed", { id: loadingToast });
        return false;
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error", { id: loadingToast });
      return false;
    }
  };

  // Delete promo permanently
  const handleDelete = async (sec: AdminPromoSection) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${sec.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await deletePromoSection(sec.id);
      if (res.success) {
        toast.success(`"${sec.name}" deleted permanently`);
        await fetchPromos();
      } else {
        toast.error(res.error || "Failed to delete promo");
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error deleting promo");
    }
  };

  // Deduplicated list of available templates
  const uniqueTemplates = useMemo(() => {
    const seen = new Set<string>();
    return Object.values(PROMO_TEMPLATES).filter((tpl) => {
      if (seen.has(tpl.id)) return false;
      seen.add(tpl.id);
      return true;
    });
  }, []);

  // Compute live preview template component
  const currentTemplateEntry = PROMO_TEMPLATES[selectedTemplate];
  const PreviewComponent = currentTemplateEntry?.component;

  // Compute preview startAt & endAt dynamically from form
  const previewStartAt = useMemo(() => {
    return startAtIst ? istInputToUtcIso(startAtIst) : null;
  }, [startAtIst]);

  const previewEndAt = useMemo(() => {
    return endAtIst ? istInputToUtcIso(endAtIst) : null;
  }, [endAtIst]);

  return (
    <div className="w-full">
      <Toaster position="top-right" />

      {/* Top Header / Scope Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-3 border-b border-gray-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 text-white shadow-xs">
            <BadgePercent className="w-3.5 h-3.5" />
            <span>Product Promo Banners</span>
          </span>

          <Link
            href="/admin/promo-sections/blog-ads"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
          >
            <Columns className="w-3.5 h-3.5 text-gray-400" />
            <span>Blog Desktop Side Ads</span>
          </Link>

          <Link
            href="/admin/trending"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
          >
            <Flame className="w-3.5 h-3.5 text-gray-400" />
            <span>Trending Now Section</span>
          </Link>
        </div>

        <span className="text-xs text-gray-400 hidden sm:inline">
          Promotional banners on /products/[slug]
        </span>
      </div>

      {/* ──────────────── TAB 1: MANAGE LIST ──────────────── */}
      {activeTab === "manage" && (
        <div className="space-y-6">
          {/* Manage Mode Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400">
                <BadgePercent className="h-5 w-5" />
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                Product Promo Sections
              </h1>
            </div>

            {/* Tab Switcher in Manage Tab Header */}
            <div className="flex items-center gap-2 rounded-xl bg-white p-1.5 shadow-xs border border-gray-200 dark:border-slate-800 dark:bg-slate-900 transition-all duration-200">
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold bg-amber-500 text-white shadow-xs transition"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Manage All ({promos.length})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setActiveTab("editor");
                }}
                className="flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New Promo Section</span>
              </button>
            </div>
          </div>

          {/* List Content */}
          {loading ? (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <RefreshCw className="h-6 w-6 animate-spin text-amber-500" />
            </div>
          ) : promos.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
              <BadgePercent className="h-10 w-10 text-gray-300 dark:text-slate-700 mb-3" />
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                No Promo Sections Found
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mt-1 mb-5">
                Create a promotional banner, countdown timer, or specifier kit callout for your product pages.
              </p>
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setActiveTab("editor");
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-amber-600"
              >
                <Plus className="h-4 w-4" />
                Create First Promo
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {promos.map((sec) => {
                const template = PROMO_TEMPLATES[sec.template_id];
                const hasAssignments = sec.assignments.length > 0;
                const isSitewide = sec.assignments.some((a) => a.product_slug === "*");

                return (
                  <div
                    key={sec.id}
                    className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 md:p-5 shadow-xs transition hover:shadow-sm dark:border-slate-800 dark:bg-slate-900"
                  >
                    {/* Left: Info & Targets */}
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                            sec.status === "published"
                              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                              : sec.status === "archived"
                              ? "bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20"
                              : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              sec.status === "published" ? "bg-emerald-500" : "bg-amber-500"
                            }`}
                          />
                          {sec.status}
                        </span>

                        <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-700 dark:bg-slate-800 dark:text-gray-300">
                          {template?.label || sec.template_id}
                        </span>

                        {sec.priority > 0 && (
                          <span className="text-[11px] font-mono text-gray-400">
                            Priority: {sec.priority}
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-gray-900 dark:text-white">
                        {sec.name}
                      </h3>

                      {/* Schedule in IST (Side-by-Side Compact) */}
                      <div className="grid grid-cols-2 gap-2 p-2 rounded-xl bg-gray-50/80 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800 text-[11px] max-w-md">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <Calendar className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                          <div className="min-w-0 truncate">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 block">Starts</span>
                            <span className="font-semibold text-gray-800 dark:text-gray-200 truncate block">{formatUtcToIst(sec.start_at)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 min-w-0 border-l border-gray-200/80 dark:border-slate-700/80 pl-2">
                          <Calendar className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                          <div className="min-w-0 truncate">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 block">Ends</span>
                            <span className="font-semibold text-gray-800 dark:text-gray-200 truncate block">{formatUtcToIst(sec.end_at)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Page Assignments (Single Horizontal Scrollable Row) */}
                      <div className="flex items-center gap-1.5 pt-1 overflow-x-auto scrollbar-none pb-0.5 max-w-full">
                        {!hasAssignments ? (
                          <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/10 px-2 py-0.5 text-[11px] font-medium text-rose-600 dark:text-rose-400 shrink-0 whitespace-nowrap">
                            <AlertCircle className="h-3 w-3" />
                            Not live anywhere (0 pages)
                          </span>
                        ) : isSitewide ? (
                          <span className="inline-flex items-center gap-1 rounded-md bg-indigo-500/10 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 dark:text-indigo-400 shrink-0 whitespace-nowrap">
                            <Globe className="h-3 w-3" />
                            Sitewide (*) — All Product Pages
                          </span>
                        ) : (
                          sec.assignments.map((ass) => {
                            const isOrphaned = !VALID_PRODUCT_SLUGS.includes(ass.product_slug as (typeof VALID_PRODUCT_SLUGS)[number]);
                            return (
                              <span
                                key={ass.id}
                                className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-mono font-medium shrink-0 whitespace-nowrap ${
                                  isOrphaned
                                    ? "bg-amber-500/10 text-amber-700 border border-amber-500/30 dark:text-amber-400"
                                    : "bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-gray-300"
                                }`}
                              >
                                {isOrphaned && (
                                  <span title="Orphaned page slug (not found in current product data)">
                                    <AlertTriangle className="h-3 w-3 text-amber-600" />
                                  </span>
                                )}
                                {ass.product_slug}
                              </span>
                            );
                          })
                        )}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 lg:border-l lg:border-gray-100 lg:pl-5 dark:lg:border-slate-800">
                      <button
                        type="button"
                        onClick={() => handleEdit(sec)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-xs hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-200 dark:hover:bg-slate-700"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </button>

                      {sec.status !== "published" ? (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(sec.id, "published")}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>Publish</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(sec.id, "draft")}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-400"
                        >
                          <span>Move to Draft</span>
                        </button>
                      )}

                      {sec.status !== "archived" && (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(sec.id, "archived")}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-50 dark:border-slate-800 dark:bg-slate-800 dark:text-gray-400"
                          title="Archive promo"
                        >
                          <Archive className="h-3.5 w-3.5" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDelete(sec)}
                        className="inline-flex items-center gap-1 rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 dark:border-slate-800 dark:hover:bg-rose-950/20"
                        title="Delete promo"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ──────────────── TAB 2: CREATE / EDIT FORM + LIVE PREVIEW ──────────────── */}
      {activeTab === "editor" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch -mt-2 md:-mt-4 pb-24">
          {/* Left Column (7 cols): Header + Form */}
          <div className="lg:col-span-7 space-y-5">
            {/* Page Header (Kept on left so it doesn't push down the right preview) */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400">
                <BadgePercent className="h-5 w-5" />
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                Product Promo Sections
              </h1>
            </div>

            {/* Form Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
              {/* Form Card Header with Tab Switcher on the Right */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-slate-800">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {editingId ? "Edit Promo Section" : "Create New Promo Section"}
                </h2>

                {/* Tab Switcher positioned inside Form Header */}
                <div className="flex items-center gap-1.5 rounded-xl bg-gray-100 p-1 dark:bg-slate-800 border border-gray-200/80 dark:border-slate-700 transition-all duration-200">
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setActiveTab("manage");
                    }}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Manage All ({promos.length})</span>
                  </button>

                  <button
                    type="button"
                    className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white shadow-xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>{editingId ? "Edit Promo" : "New Promo Section"}</span>
                  </button>
                </div>
              </div>

              {/* Section Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                  Internal Section Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Diwali Festive Offer 2026"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2 text-sm text-gray-900 focus:border-amber-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden dark:border-slate-800 dark:bg-slate-800/60 dark:text-white dark:focus:border-amber-400"
                />
              </div>

              {/* Template Picker */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                  Select Template <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {uniqueTemplates.map((tpl) => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => handleTemplateChange(tpl.id)}
                      className={`flex items-center justify-between p-3.5 rounded-xl border transition ${
                        selectedTemplate === tpl.id
                          ? "border-amber-500 bg-amber-50/50 shadow-xs dark:border-amber-400 dark:bg-amber-950/20"
                          : "border-gray-200 hover:border-gray-300 bg-white dark:border-slate-800 dark:bg-slate-800/40"
                      }`}
                    >
                      <span className="font-bold text-xs text-gray-900 dark:text-white">
                        {tpl.label}
                      </span>
                      {selectedTemplate === tpl.id && (
                        <Check className="h-4 w-4 text-amber-500 shrink-0 ml-1.5" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Template Fields */}
              <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Template Content & Configuration
                  </h3>
                  <span className="text-[10px] text-gray-400 font-medium">Compact Form</span>
                </div>

                {(() => {
                  const allFields = currentTemplateEntry?.fields || [];
                  const fieldMap = new Map<string, TemplateFieldDefinition>(
                    allFields.map((f) => [f.name, f])
                  );
                  const handled = new Set<string>();

                  const renderControl = (field: TemplateFieldDefinition) => {
                    if (field.type === "theme_select") {
                      const isB2B = selectedTemplate === "B2BProjectLeadBanner" || selectedTemplate === "B2BBulkStrip";
                      const currentVal = String(propsState[field.name] || (isB2B ? "midnight_navy" : "royal_amber"));
                      const predefinedFestive = ["royal_amber", "deep_maroon", "midnight_navy", "emerald_green", "luxury_slate"];
                      const predefinedB2B = ["midnight_navy", "charcoal_black", "emerald_green", "royal_amber"];
                      const isPredefined = isB2B ? predefinedB2B.includes(currentVal) : predefinedFestive.includes(currentVal);
                      const isCustom = !isPredefined;
                      const customHex = currentVal.startsWith("#") ? currentVal : "#1e3a8a";

                      return (
                        <div className="space-y-2">
                          <select
                            value={isPredefined ? currentVal : "custom"}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === "custom") {
                                setPropsState({ ...propsState, [field.name]: customHex });
                              } else {
                                setPropsState({ ...propsState, [field.name]: val });
                              }
                            }}
                            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2 text-xs font-medium text-gray-900 focus:border-amber-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden dark:border-slate-800 dark:bg-slate-800/60 dark:text-white"
                          >
                            {isB2B ? (
                              <>
                                <option value="midnight_navy">🔵 Midnight Navy</option>
                                <option value="charcoal_black">⚫ Charcoal Slate</option>
                                <option value="emerald_green">🟢 Emerald Green</option>
                                <option value="royal_amber">🟤 Bronze Amber</option>
                                <option value="custom">🎨 Custom Color...</option>
                              </>
                            ) : (
                              <>
                                <option value="royal_amber">🟡 Amber Gold</option>
                                <option value="deep_maroon">🔴 Deep Maroon</option>
                                <option value="midnight_navy">🔵 Midnight Navy</option>
                                <option value="emerald_green">🟢 Emerald Green</option>
                                <option value="luxury_slate">⚫ Charcoal Slate</option>
                                <option value="custom">🎨 Custom Color...</option>
                              </>
                            )}
                          </select>

                          {/* Custom Color Inline Swatch & Picker */}
                          {isCustom && (
                            <div className="flex flex-wrap items-center gap-2 p-2 rounded-xl border border-amber-300/80 bg-amber-50/30 dark:border-amber-600/30 dark:bg-amber-950/20 animate-in fade-in duration-200">
                              <input
                                type="color"
                                value={customHex}
                                onChange={(e) =>
                                  setPropsState({ ...propsState, [field.name]: e.target.value })
                                }
                                className="h-7 w-7 cursor-pointer rounded-lg border border-gray-300 dark:border-slate-600 p-0 bg-transparent"
                                title="Pick any color"
                              />
                              <input
                                type="text"
                                value={currentVal}
                                onChange={(e) => {
                                  let val = e.target.value.trim();
                                  if (val && !val.startsWith("#") && /^[0-9a-fA-F]+$/.test(val)) {
                                    val = "#" + val;
                                  }
                                  setPropsState({ ...propsState, [field.name]: val });
                                }}
                                placeholder="#1e3a8a"
                                maxLength={9}
                                className="w-24 rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-mono text-gray-900 focus:border-amber-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                              />
                              {/* Quick One-Click Swatches */}
                              <div className="flex items-center gap-1.5 ml-auto">
                                {[
                                  { color: "#581c87", title: "Royal Purple" },
                                  { color: "#881337", title: "Ruby Wine" },
                                  { color: "#1e3a8a", title: "Cobalt Blue" },
                                  { color: "#064e3b", title: "Deep Pine" },
                                  { color: "#9a3412", title: "Burnt Orange" },
                                  { color: "#09090b", title: "Pure Charcoal" },
                                ].map((swatch) => (
                                  <button
                                    key={swatch.color}
                                    type="button"
                                    onClick={() =>
                                      setPropsState({ ...propsState, [field.name]: swatch.color })
                                    }
                                    className="h-4.5 w-4.5 rounded-full border border-white/60 shadow-2xs hover:scale-125 transition"
                                    style={{ backgroundColor: swatch.color }}
                                    title={swatch.title}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    }

                    if (field.name.endsWith("_link") || field.type === "url") {
                      const currentVal = String(propsState[field.name] || "");
                      const isKnownPage = AVAILABLE_PAGE_LINKS.some((p) => p.value === currentVal);
                      const isCustom = !isKnownPage && currentVal !== "";

                      return (
                        <div className="space-y-1.5">
                          <select
                            value={isKnownPage ? currentVal : currentVal === "" ? "" : "custom"}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === "custom") {
                                setPropsState({ ...propsState, [field.name]: currentVal || "/contact" });
                              } else {
                                setPropsState({ ...propsState, [field.name]: val });
                              }
                            }}
                            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2 text-xs text-gray-900 focus:border-amber-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden dark:border-slate-800 dark:bg-slate-800/60 dark:text-white"
                          >
                            <option value="">-- Select Destination Page --</option>
                            <optgroup label="Main Action Pages">
                              {AVAILABLE_PAGE_LINKS.filter((p) => p.group === "Action Pages").map((p) => (
                                <option key={p.value} value={p.value}>{p.label}</option>
                              ))}
                            </optgroup>
                            <optgroup label="Information & Catalog Pages">
                              {AVAILABLE_PAGE_LINKS.filter((p) => p.group === "Info Pages").map((p) => (
                                <option key={p.value} value={p.value}>{p.label}</option>
                              ))}
                            </optgroup>
                            <optgroup label="13 Target Product Pages">
                              {AVAILABLE_PAGE_LINKS.filter((p) => p.group === "Product Pages").map((p) => (
                                <option key={p.value} value={p.value}>{p.label}</option>
                              ))}
                            </optgroup>
                            <option value="custom">-- Custom Link (Type manual URL) --</option>
                          </select>

                          {isCustom && (
                            <input
                              type="text"
                              value={currentVal}
                              onChange={(e) =>
                                setPropsState({ ...propsState, [field.name]: e.target.value })
                              }
                              placeholder="Enter custom path or URL e.g. /sample-kit or https://..."
                              className="w-full rounded-xl border border-amber-300 bg-amber-50/20 px-3.5 py-1.5 text-xs text-gray-900 focus:border-amber-500 focus:outline-hidden dark:border-amber-600/40 dark:bg-amber-950/20 dark:text-white"
                            />
                          )}
                        </div>
                      );
                    }

                    if (field.type === "textarea") {
                      const isCustomHtml = field.name === "custom_html";

                      if (isCustomHtml) {
                        return (
                          <div className="space-y-3">
                            {/* AI Prompt Blueprint Banner */}
                            <div className="flex items-center justify-between p-3 rounded-xl border border-amber-200/90 dark:border-amber-900/50 bg-amber-50/40 dark:bg-slate-900/60 shadow-xs">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                                  <Sparkles className="w-4 h-4" />
                                </div>
                                <div>
                                  <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                                    AI Prompt Blueprint
                                  </h4>
                                  <p className="text-[10px] text-gray-500 dark:text-gray-400">
                                    Copy prompt, paste into AI &amp; write your requirements below the line
                                  </p>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={handleCopyAiPrompt}
                                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-all active:scale-95 ${
                                  copiedPrompt
                                    ? "bg-emerald-600 text-white"
                                    : "bg-[#E17100] hover:bg-[#c96200] text-white"
                                }`}
                              >
                                {copiedPrompt ? (
                                  <>
                                    <CheckCheck className="w-3.5 h-3.5" />
                                    <span>Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>Copy AI Prompt</span>
                                  </>
                                )}
                              </button>
                            </div>

                            {/* Clean Full-Height Code Editor */}
                            <textarea
                              rows={16}
                              value={String(propsState[field.name] || "")}
                              onChange={(e) =>
                                setPropsState({ ...propsState, [field.name]: e.target.value })
                              }
                              placeholder="Paste your custom code here..."
                              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 font-mono text-xs leading-relaxed text-gray-900 focus:border-amber-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden dark:border-slate-800 dark:bg-slate-800/60 dark:text-white"
                            />
                          </div>
                        );
                      }

                      // Default textarea for other templates
                      return (
                        <textarea
                          rows={2}
                          value={String(propsState[field.name] || "")}
                          onChange={(e) =>
                            setPropsState({ ...propsState, [field.name]: e.target.value })
                          }
                          placeholder={field.placeholder}
                          className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2 text-sm text-gray-900 focus:border-amber-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden dark:border-slate-800 dark:bg-slate-800/60 dark:text-white"
                        />
                      );
                    }

                    if (field.type === "boolean") {
                      return (
                        <label className="flex items-center gap-2 cursor-pointer mt-1">
                          <input
                            type="checkbox"
                            checked={Boolean(propsState[field.name])}
                            onChange={(e) =>
                              setPropsState({ ...propsState, [field.name]: e.target.checked })
                            }
                            className="h-4 w-4 rounded border-gray-300 text-amber-500 focus:ring-amber-400"
                          />
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {field.helpText || "Enable this option"}
                          </span>
                        </label>
                      );
                    }

                    if (field.type === "image" || field.name.endsWith("_image") || field.name.includes("image")) {
                      return (
                        <PromoImageField
                          label={field.label}
                          value={String(propsState[field.name] || "")}
                          onChange={(url) =>
                            setPropsState({ ...propsState, [field.name]: url })
                          }
                          required={field.required}
                          multiple={field.multiple || field.name === "image_urls"}
                          maxImages={field.maxImages || 4}
                          helpText={field.helpText}
                        />
                      );
                    }

                    return (
                      <input
                        type="text"
                        value={String(propsState[field.name] || "")}
                        onChange={(e) =>
                          setPropsState({ ...propsState, [field.name]: e.target.value })
                        }
                        placeholder={field.placeholder}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2 text-sm text-gray-900 focus:border-amber-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden dark:border-slate-800 dark:bg-slate-800/60 dark:text-white"
                      />
                    );
                  };

                  const renderField = (field: TemplateFieldDefinition) => {
                    const isImageField = field.type === "image" || field.name.endsWith("_image") || field.name.includes("image");
                    if (isImageField) {
                      return (
                        <div key={field.name} className="w-full">
                          {renderControl(field)}
                        </div>
                      );
                    }

                    return (
                      <div key={field.name} className="w-full">
                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                          {field.label} {field.required && <span className="text-rose-500">*</span>}
                        </label>
                        {renderControl(field)}
                      </div>
                    );
                  };

                  const renderIfExist = (fieldName: string) => {
                    const f = fieldMap.get(fieldName);
                    if (!f) return null;
                    handled.add(fieldName);
                    return renderField(f);
                  };

                  return (
                    <div className="space-y-4">
                      {/* Top Branding & Headings */}
                      {renderIfExist("heading")}
                      {renderIfExist("heading_highlight")}
                      {renderIfExist("subheading")}
                      {renderIfExist("subtext")}
                      {renderIfExist("sale_tagline")}

                      {/* Badge & Theme Row (Side-by-Side) */}
                      {(fieldMap.has("badge_text") || fieldMap.has("bg_theme")) && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {renderIfExist("badge_text")}
                          {renderIfExist("bg_theme")}
                        </div>
                      )}

                      {/* Primary Button Text & Button Link (Side-by-Side as requested) */}
                      {(fieldMap.has("button_text") || fieldMap.has("button_link")) && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-xl border border-gray-200/80 bg-gray-50/40 p-3 dark:border-slate-800 dark:bg-slate-900/20">
                          {renderIfExist("button_text")}
                          {renderIfExist("button_link")}
                        </div>
                      )}

                      {/* Secondary Button Text & Link (Side-by-Side) */}
                      {(fieldMap.has("secondary_button_text") || fieldMap.has("secondary_button_link")) && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-xl border border-gray-200/80 bg-gray-50/40 p-3 dark:border-slate-800 dark:bg-slate-900/20">
                          {renderIfExist("secondary_button_text")}
                          {renderIfExist("secondary_button_link")}
                        </div>
                      )}

                      {/* Key Benefits (Side-by-Side 3 columns) */}
                      {(fieldMap.has("benefit_1") || fieldMap.has("benefit_2") || fieldMap.has("benefit_3")) && (
                        <div className="space-y-1.5">
                          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                            Key Benefit Badges (with Checkmarks)
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {renderIfExist("benefit_1")}
                            {renderIfExist("benefit_2")}
                            {renderIfExist("benefit_3")}
                          </div>
                        </div>
                      )}

                      {/* Lead Form Settings (Side-by-Side) */}
                      {(fieldMap.has("form_title") || fieldMap.has("form_subtitle") || fieldMap.has("whatsapp_number")) && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-xl border border-gray-200/80 bg-gray-50/40 p-3 dark:border-slate-800 dark:bg-slate-900/20">
                          {renderIfExist("form_title")}
                          {renderIfExist("form_subtitle")}
                          {renderIfExist("whatsapp_number")}
                        </div>
                      )}

                      {/* Tagline */}
                      {renderIfExist("tagline")}

                      {/* Showcase Cards (Title & Link Side-by-Side, Image URL full width) */}
                      {[1, 2, 3, 4, 5].map((num) => {
                        const titleField = `card_${num}_title`;
                        const linkField = `card_${num}_link`;
                        const imgField = `card_${num}_image`;

                        if (!fieldMap.has(titleField) && !fieldMap.has(imgField)) return null;

                        return (
                          <div
                            key={`card-box-${num}`}
                            className="rounded-xl border border-gray-200 bg-gray-50/50 p-3.5 dark:border-slate-800 dark:bg-slate-900/40 space-y-2.5 transition hover:border-gray-300 dark:hover:border-slate-700"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                                Card {num} Showcase Details
                              </span>
                              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider">
                                Compulsory
                              </span>
                            </div>

                            {/* Row 1: Title & Clickable Link Side-by-Side */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {renderIfExist(titleField)}
                              {renderIfExist(linkField)}
                            </div>

                            {/* Row 2: Image URL full width */}
                            <div>{renderIfExist(imgField)}</div>
                          </div>
                        );
                      })}

                      {/* Remaining unhandled fields */}
                      {allFields
                        .filter((f) => !handled.has(f.name))
                        .map((f) => renderField(f))}
                    </div>
                  );
                })()}
              </div>

              {/* Schedule (IST) */}
              <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Schedule (IST)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Start Date & Time (IST) <span className="text-rose-500 font-bold">* (Compulsory)</span>
                    </label>
                    <input
                      type="datetime-local"
                      required
                      min={getNowIstInput()}
                      value={startAtIst}
                      onChange={(e) => {
                        const val = e.target.value;
                        const nowIst = getNowIstInput();
                        if (val && !editingId && val < nowIst.slice(0, 15)) {
                          toast.error("Start date cannot be in the past.");
                          return;
                        }
                        setStartAtIst(val);
                        if (endAtIst && val && endAtIst <= val) {
                          setEndAtIst("");
                        }
                      }}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2 text-xs text-gray-900 focus:border-amber-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden [color-scheme:light] dark:[color-scheme:dark] dark:border-slate-700 dark:bg-slate-800/80 dark:text-white"
                    />
                    <span className="text-[10px] text-gray-400">Required: Promo start date and time (IST). Past dates are not allowed.</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      End Date & Time (IST) <span className="text-rose-500 font-bold">* (Compulsory)</span>
                    </label>
                    <input
                      type="datetime-local"
                      required
                      min={startAtIst || getNowIstInput()}
                      value={endAtIst}
                      onChange={(e) => {
                        const val = e.target.value;
                        const minAllowed = startAtIst || getNowIstInput();
                        if (val && val <= minAllowed) {
                          toast.error("End date must be strictly after the start date.");
                          return;
                        }
                        setEndAtIst(val);
                      }}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2 text-xs text-gray-900 focus:border-amber-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden [color-scheme:light] dark:[color-scheme:dark] dark:border-slate-700 dark:bg-slate-800/80 dark:text-white"
                    />
                    <span className="text-[10px] text-gray-400">Required: Promo expiration date and time (IST). The promo will automatically deactivate after this time.</span>
                  </div>
                </div>
              </div>

              {/* Target Product Pages (Compact Trigger Button) */}
              <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 dark:border-slate-800 dark:bg-slate-800/40">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-400 shrink-0">
                      <Globe className="h-4.5 w-4.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-900 dark:text-white">
                          Target Product Pages
                        </span>
                        {selectedSlugs.includes("*") ? (
                          <span className="rounded-md bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:text-indigo-300">
                            Sitewide (*) — All 13 Pages
                          </span>
                        ) : selectedSlugs.length > 0 ? (
                          <span className="rounded-md bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-400">
                            {selectedSlugs.length} Page{selectedSlugs.length > 1 ? "s" : ""} Selected
                          </span>
                        ) : (
                          <span className="rounded-md bg-gray-200/80 dark:bg-slate-700 px-2 py-0.5 text-[10px] font-semibold text-gray-600 dark:text-gray-300">
                            0 Selected (Draft Only)
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5">
                        {selectedSlugs.includes("*")
                          ? "Displays on all product pages unless specifically overridden"
                          : selectedSlugs.length > 0
                          ? selectedSlugs.join(", ")
                          : "Click button to select which product pages display this promotion"}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setPagesModalOpen(true)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-white hover:bg-gray-50 dark:bg-slate-800 dark:hover:bg-slate-750 border border-gray-200 dark:border-slate-700 px-3.5 py-2 text-xs font-bold text-gray-800 dark:text-gray-200 shadow-2xs transition shrink-0"
                  >
                    <span>Choose Pages ({selectedSlugs.includes("*") ? "All" : selectedSlugs.length})</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-slate-800">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleSubmit("draft")}
                  className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-xs font-semibold text-gray-700 shadow-xs hover:bg-gray-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-200"
                >
                  Save as Draft
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleSubmit("published")}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-6 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-amber-600 disabled:opacity-50"
                >
                  <Check className="h-4 w-4" />
                  <span>{isSubmitting ? "Saving..." : "Publish Section"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* ──────────────── RIGHT COLUMN: STICKY PHONE PREVIEW (TOP 20px, BOTTOM 20px) ──────────────── */}
          <div id="phone-preview-column" className="lg:col-span-5 w-full self-stretch h-full min-h-full relative">
            <div className="sticky top-5 h-[calc(100vh-40px)] flex flex-col items-center justify-between z-20">
              {/* Top Bar: Title + Switcher (Compact shrink-0) */}
              <div className="w-[300px] mb-2 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px] text-gray-700 dark:text-gray-300">
                  <Eye className="h-3.5 w-3.5 text-amber-500" />
                  <span>Live Preview</span>
                </div>

                {/* Device Mode Switcher */}
                <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-0.5 rounded-lg border border-gray-200 dark:border-slate-700 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setPreviewMode("mobile")}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                      previewMode === "mobile"
                        ? "bg-amber-500 text-white shadow-xs"
                        : "text-gray-500 hover:text-gray-900 dark:text-gray-400"
                    }`}
                    title="Mobile View (Sticky)"
                  >
                    <Smartphone className="h-3 w-3" />
                    <span>Phone</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== "undefined" && window.innerWidth < 1024) {
                        toast.error("Desktop preview is only available on desktop and larger screens.", {
                          icon: "💻",
                        });
                        return;
                      }
                      setPreviewMode("desktop");
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                      previewMode === "desktop"
                        ? "bg-amber-500 text-white shadow-xs"
                        : "text-gray-500 hover:text-gray-900 dark:text-gray-400"
                    }`}
                    title="Open Desktop Preview Modal (Desktop only)"
                  >
                    <Monitor className="h-3 w-3" />
                    <span>Desktop</span>
                  </button>
                </div>
              </div>

              {/* Phone Device Frame - Constrained with flex-1 min-h-0 so it fits strictly within 20px top/bottom */}
              <div className="w-[360px] max-w-full flex-1 min-h-0 rounded-[40px] border-[6px] border-slate-900 bg-white dark:bg-slate-950 shadow-2xl flex flex-col overflow-hidden relative ring-1 ring-slate-800/20 dark:ring-white/10">
                {/* Speaker / Notch (shrink-0) */}
                <div className="h-4 w-24 bg-slate-900 rounded-full mx-auto mt-2 z-20 shrink-0 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-slate-800/80 mr-2" />
                  <div className="h-2 w-2 rounded-full bg-indigo-950/60 border border-indigo-500/30" />
                </div>

                {/* Phone Status Bar (shrink-0) */}
                <div className="pt-1 px-5 pb-1 flex items-center justify-between text-[10px] font-semibold text-slate-800 dark:text-slate-200 select-none shrink-0">
                  <span>9:41</span>
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                    <Signal className="h-2.5 w-2.5" />
                    <Wifi className="h-2.5 w-2.5" />
                    <Battery className="h-3 w-3" />
                  </div>
                </div>

                {/* Mini Browser Address Bar (shrink-0) */}
                <div className="mx-3 my-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/90 flex items-center gap-1.5 text-[9px] text-slate-500 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700/80 select-none shrink-0">
                  <Lock className="h-2.5 w-2.5 text-emerald-500 shrink-0" />
                  <span className="truncate font-mono">goalsfloors.com/products/...</span>
                </div>

                {/* Scrollable Viewport Inside Phone (matches real mobile viewport width) */}
                <div className="flex-1 min-h-0 overflow-y-auto px-3 py-2.5 scrollbar-none">
                  {/* Context: Breadcrumbs & Rating */}
                  <div className="text-[9px] text-gray-400 dark:text-gray-500 mb-0.5">
                    Products / SPC Flooring
                  </div>
                  
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex text-amber-400 text-[10px]">★★★★★</div>
                    <span className="text-[9px] text-gray-500 font-medium">4.9 (38)</span>
                  </div>

                  {/* REAL LIVE TEMPLATE RENDERED DYNAMICALLY */}
                  <div className="my-1.5">
                    {PreviewComponent ? (
                      <PreviewComponent
                        {...propsState}
                        startAt={previewStartAt}
                        endAt={previewEndAt}
                        isMobileView={true}
                      />
                    ) : (
                      <div className="text-center py-6 text-xs text-gray-400">
                        No template selected
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Home Indicator (shrink-0) */}
                <div className="py-1.5 flex justify-center bg-white dark:bg-slate-950 shrink-0">
                  <div className="h-1 w-24 bg-slate-300 dark:bg-slate-700 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────── DESKTOP PREVIEW MODAL POPUP (FULL SCREEN WIDTH) ──────────────── */}
      {previewMode === "desktop" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-2 sm:p-4 md:p-6 animate-in fade-in duration-200"
          onClick={() => setPreviewMode("mobile")}
        >
          <div
            className="w-[98vw] max-w-[1600px] rounded-2xl border border-gray-700 bg-white dark:bg-slate-900 shadow-2xl flex flex-col overflow-hidden max-h-[94vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Desktop Browser Window Header */}
            <div className="flex items-center justify-between px-5 py-3 bg-slate-100 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 select-none">
              {/* Traffic lights + Title */}
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full bg-rose-500/80 hover:bg-rose-600 cursor-pointer transition"
                  onClick={() => setPreviewMode("mobile")}
                  title="Close desktop preview"
                />
                <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 ml-2">
                  Desktop Preview (100% Real Product Page Scale)
                </span>
              </div>

              {/* Switcher & Close */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-white dark:bg-slate-900 rounded-lg p-1 border border-gray-200 dark:border-slate-700 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setPreviewMode("mobile")}
                    className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                    title="Switch back to Phone view"
                  >
                    <Smartphone className="h-3.5 w-3.5" />
                    <span>Phone</span>
                  </button>

                  <button
                    type="button"
                    className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold bg-amber-500 text-white shadow-xs"
                  >
                    <Monitor className="h-3.5 w-3.5" />
                    <span>Desktop</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setPreviewMode("mobile")}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-slate-700 dark:text-gray-300 transition"
                  title="Close desktop preview"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Browser Address Bar */}
            <div className="px-5 py-2 bg-slate-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-slate-800 flex items-center">
              <div className="flex-1 flex items-center gap-2 rounded-lg bg-white dark:bg-slate-900 px-3 py-1 text-xs text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-slate-700">
                <Lock className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span className="font-mono text-[11px] truncate">
                  https://goalsfloors.com/products/spc-herringbone-oak
                </span>
              </div>
            </div>

            {/* Desktop Scrollable Body (100% matched to ProductClient.tsx container padding) */}
            <div className="flex-1 overflow-y-auto py-6 bg-white dark:bg-slate-950">
              <div className="w-full px-4 sm:px-8 md:px-12 lg:px-14 xl:px-16 2xl:px-20 mx-auto space-y-4">
                {/* Breadcrumb + Star Rating */}
                <div className="space-y-1">
                  <div className="text-xs text-gray-400">
                    Home / Products / Flooring / SPC Luxury Plank
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-400 text-sm">★★★★★</div>
                    <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">4.9 • 38 Verified Reviews</span>
                  </div>
                </div>

                {/* REAL LIVE TEMPLATE IN DESKTOP FULL WIDTH */}
                <div className="w-full">
                  {PreviewComponent ? (
                    <PreviewComponent
                      {...propsState}
                      startAt={previewStartAt}
                      endAt={previewEndAt}
                      isMobileView={false}
                    />
                  ) : (
                    <div className="text-center py-10 text-xs text-gray-400">
                      No template selected
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────── OVERLAP CONFLICT MODAL (CLEAN SIMPLE ENGLISH) ──────────────── */}
      {conflictModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl border border-amber-300/80 bg-white p-6 shadow-2xl dark:border-amber-600/40 dark:bg-slate-900 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Active Promotion Conflict
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  Only one promotional banner can run on a page at a time. The following {conflictingSections.length > 1 ? "pages already have an active banner" : "page already has an active banner"}:
                </p>
              </div>
            </div>

            {/* Conflicting Pages List */}
            <div className="my-4 max-h-56 overflow-y-auto space-y-2 rounded-xl border border-gray-100 bg-gray-50/80 p-3 text-xs dark:border-slate-800 dark:bg-slate-800/60">
              {conflictingSections.map((conf, idx) => (
                <div
                  key={`${conf.id}-${conf.product_slug}-${idx}`}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-700/80 shadow-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {conf.product_slug === "*" ? "🌐 Sitewide (All 13 Products)" : `📄 ${conf.product_slug}`}
                    </span>
                    <div className="text-[11px] text-gray-500 dark:text-gray-400">
                      Current Banner: <span className="font-medium text-amber-600 dark:text-amber-400">&quot;{conf.name}&quot;</span>
                    </div>
                  </div>
                  <span className="rounded-md bg-rose-50 px-2.5 py-1 text-[10px] font-bold text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                    Will be replaced
                  </span>
                </div>
              ))}
            </div>

            {/* Warning Note */}
            <div className="rounded-xl bg-amber-50 border border-amber-200/80 p-3 text-xs text-amber-900 dark:bg-amber-950/30 dark:border-amber-800/40 dark:text-amber-300 mb-5 leading-relaxed">
              ⚠️ <strong>Note:</strong> Publishing will replace the active banner on <strong>only the conflicting page(s)</strong> above. Other pages assigned to the existing banner will continue running unaffected.
            </div>

            {/* Actions (Simple & Clean Buttons with Loading State) */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={isResolvingConflict}
                onClick={() => {
                  if (isResolvingConflict) return;
                  setConflictModalOpen(false);
                  setPendingStatusChangeId(null);
                }}
                className="w-full sm:w-auto rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-200 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isResolvingConflict}
                onClick={async () => {
                  if (isResolvingConflict) return;
                  setIsResolvingConflict(true);
                  try {
                    if (pendingStatusChangeId) {
                      const ok = await handleStatusChange(pendingStatusChangeId, "published", true);
                      if (ok) {
                        setConflictModalOpen(false);
                        setPendingStatusChangeId(null);
                      }
                    } else {
                      await handleSubmit(pendingSaveStatus, true);
                    }
                  } finally {
                    setIsResolvingConflict(false);
                  }
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-70 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-amber-600/20 transition active:scale-95"
              >
                {isResolvingConflict ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Replacing & Publishing...</span>
                  </>
                ) : (
                  <>
                    <span>Replace & Publish</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────── TARGET PAGES POPUP MODAL ──────────────── */}
      {pagesModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-200"
          onClick={() => setPagesModalOpen(false)}
        >
          <div
            className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-400">
                  <Globe className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    Select Target Product Pages
                  </h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    Choose which product pages will show this promo banner
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPagesModalOpen(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-slate-800 dark:text-gray-300 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Actions & Counter */}
            <div className="flex items-center justify-between py-3 text-xs">
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                Selected: <strong className="text-amber-600 dark:text-amber-400">{selectedSlugs.includes("*") ? "Sitewide (All)" : `${selectedSlugs.length} of 13`}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSelectAllSlugs}
                  className="rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 px-2.5 py-1 text-[11px] font-bold transition"
                >
                  Select All 13
                </button>
                <button
                  type="button"
                  onClick={handleClearSlugs}
                  className="rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 dark:bg-slate-800 dark:text-gray-300 px-2.5 py-1 text-[11px] font-medium transition"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Scrollable list */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-1">
              {/* Sitewide Option */}
              <button
                type="button"
                onClick={() => handleSlugToggle("*")}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition ${
                  selectedSlugs.includes("*")
                    ? "border-indigo-500 bg-indigo-50/70 text-indigo-950 dark:bg-indigo-950/40 dark:border-indigo-500/60 dark:text-indigo-200"
                    : "border-gray-200 hover:border-gray-300 bg-gray-50/40 text-gray-700 dark:border-slate-800 dark:bg-slate-800/40 dark:text-gray-300"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Globe className="h-4 w-4 text-indigo-500 shrink-0" />
                  <div>
                    <span className="font-bold text-xs block">Sitewide Fallback (*)</span>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">
                      Shows across all 13 product pages unless overridden
                    </p>
                  </div>
                </div>
                {selectedSlugs.includes("*") && (
                  <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                )}
              </button>

              {/* 13 Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {VALID_PRODUCT_SLUGS.map((slug) => {
                  const isChecked = selectedSlugs.includes(slug);
                  return (
                    <button
                      key={slug}
                      type="button"
                      onClick={() => handleSlugToggle(slug)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl border text-left text-xs transition ${
                        isChecked
                          ? "border-amber-500 bg-amber-50/80 text-amber-950 font-bold dark:border-amber-400/80 dark:bg-amber-950/40 dark:text-amber-200"
                          : "border-gray-200 hover:border-gray-300 bg-white text-gray-700 dark:border-slate-800 dark:bg-slate-800/50 dark:text-gray-300"
                      }`}
                    >
                      <span className="truncate">{slug}</span>
                      {isChecked && <Check className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0 ml-1.5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-3.5 mt-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setPagesModalOpen(false)}
                className="rounded-xl bg-amber-600 hover:bg-amber-500 px-5 py-2 text-xs font-bold text-white shadow-md shadow-amber-600/20 transition active:scale-95"
              >
                Done / Save Selection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
