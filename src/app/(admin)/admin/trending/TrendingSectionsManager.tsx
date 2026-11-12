"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Sparkles,
  Flame,
  X,
  Sliders,
  Maximize2,
  Layers,
  Monitor,
  Smartphone,
} from "lucide-react";
import CloudinaryImagePickerModal from "@/components/admin/CloudinaryImagePickerModal";
import {
  getAdminTrendingSections,
  saveTrendingSection,
  deleteTrendingSection,
  setTrendingSectionStatus,
  TrendingSectionSet,
  TrendingCardItem,
} from "@/actions/admin/trending";
import { AVAILABLE_PAGE_LINKS } from "@/lib/promo/constants";

// Default template structure for a new set
const DEFAULT_CARD_ITEMS: [TrendingCardItem, TrendingCardItem, TrendingCardItem, TrendingCardItem] = [
  {
    number: "01",
    label: "Wall Panels",
    title: "Fluted Charcoal & WPC Wall Panels",
    image: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772477058/Wpc_Fluted_Panel_In_Gurgaon.png",
    href: "/products/wall-panels",
  },
  {
    number: "02",
    label: "Herringbone",
    title: "Light Oak Herringbone Floors",
    image: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775411703/Luxury_Penthouse_Living_Room_with_Light_Oak_Herringbone_Flooring_Gurugram.jpg",
    href: "/products/herringbone-laminate-flooring",
  },
  {
    number: "03",
    label: "SPC Flooring",
    title: "Stone Polymer Composite Core",
    image: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1774612492/screenshot-2024-11-05-074302-YKb68R7lNDueGKEV.jpg",
    href: "/products/spc-flooring",
  },
  {
    number: "04",
    label: "Artificial Grass",
    title: "All-Weather Balcony Greenery",
    image: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772476444/artificial_grass_supplier_in_india.jpg",
    href: "/products/artificial-grass",
  },
];

const CARD_SPOT_DESCRIPTIONS = [
  { spot: "Centerpiece Hero", desc: "Main focal point overlapping Card 02" },
  { spot: "Top Living Accent", desc: "Positioned above horizontal axis line" },
  { spot: "Right Living Accent", desc: "Positioned on the right side extending downward" },
  { spot: "Left Balcony Spot", desc: "Positioned below horizontal axis line" },
];

export default function TrendingSectionsManager() {
  const [sets, setSets] = useState<TrendingSectionSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSet, setEditingSet] = useState<TrendingSectionSet | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Active Tab inside modal: which card is currently being edited (0, 1, 2, or 3)
  const [activeCardTab, setActiveCardTab] = useState<number>(0);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");

  // Form State
  const [formName, setFormName] = useState("");
  const [formTagline, setFormTagline] = useState("Trending Now");
  const [formDescription, setFormDescription] = useState("");
  const [formStatus, setFormStatus] = useState<"published" | "draft">("published");
  const [formPriority, setFormPriority] = useState(1);
  const [formCards, setFormCards] = useState<[TrendingCardItem, TrendingCardItem, TrendingCardItem, TrendingCardItem]>(DEFAULT_CARD_ITEMS);

  // Cloudinary Picker State
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerTargetCardIdx, setPickerTargetCardIdx] = useState<number>(0);

  // Image load error tracking for strict validation
  const [cardImageErrors, setCardImageErrors] = useState<Record<number, boolean>>({});

  const loadData = async () => {
    setLoading(true);
    const res = await getAdminTrendingSections();
    if (res.success && res.sets) {
      setSets(res.sets);
    } else {
      toast.error(res.error || "Failed to load trending collections.");
    }
    setLoading(false);
  };

  useEffect(() => {
    let isMounted = true;
    getAdminTrendingSections().then((res) => {
      if (!isMounted) return;
      if (res.success && res.sets) {
        setSets(res.sets);
      } else {
        toast.error(res.error || "Failed to load trending collections.");
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const openNewForm = () => {
    setEditingSet(null);
    setFormName(`Collection Set ${sets.length + 1}`);
    setFormTagline("Trending Now");
    setFormDescription("Most enquired floors and panels in Gurgaon and Delhi NCR.");
    setFormStatus("published");
    setFormPriority(sets.length + 1);
    setFormCards(JSON.parse(JSON.stringify(DEFAULT_CARD_ITEMS)));
    setCardImageErrors({});
    setActiveCardTab(0);
    setIsModalOpen(true);
  };

  const openEditForm = (set: TrendingSectionSet) => {
    setEditingSet(set);
    setFormName(set.name);
    setFormTagline(set.tagline || "Trending Now");
    setFormDescription(set.description || "");
    setFormStatus(set.status === "published" ? "published" : "draft");
    setFormPriority(set.priority || 1);
    setFormCards(JSON.parse(JSON.stringify(set.items)));
    setCardImageErrors({});
    setActiveCardTab(0);
    setIsModalOpen(true);
  };

  const handleCardChange = (idx: number, field: keyof TrendingCardItem, value: string) => {
    setFormCards((prev) => {
      const updated = [...prev] as [TrendingCardItem, TrendingCardItem, TrendingCardItem, TrendingCardItem];
      updated[idx] = { ...updated[idx], [field]: value };
      return updated;
    });

    if (field === "image") {
      setCardImageErrors((prev) => ({ ...prev, [idx]: false }));
    }
  };

  const openImagePickerForCard = (cardIdx: number) => {
    setPickerTargetCardIdx(cardIdx);
    setPickerOpen(true);
  };

  const handleImageSelected = (url: string) => {
    handleCardChange(pickerTargetCardIdx, "image", url);
    toast.success(`Card ${formCards[pickerTargetCardIdx].number} image updated`);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verify all 4 cards have valid images & fields
    for (let i = 0; i < 4; i++) {
      const card = formCards[i];
      if (!card.image || card.image.trim() === "") {
        toast.error(`Card ${card.number} image is required. All 4 cards must have images.`);
        setActiveCardTab(i);
        return;
      }
      if (cardImageErrors[i]) {
        toast.error(`Card ${card.number} image failed to load. Please choose a valid image URL.`);
        setActiveCardTab(i);
        return;
      }
      if (!card.label || card.label.trim() === "") {
        toast.error(`Card ${card.number} pill label is required.`);
        setActiveCardTab(i);
        return;
      }
      if (!card.href || card.href.trim() === "") {
        toast.error(`Card ${card.number} destination link is required.`);
        setActiveCardTab(i);
        return;
      }
    }

    setSaving(true);
    const res = await saveTrendingSection({
      id: editingSet?.id,
      name: formName,
      tagline: formTagline,
      header_strip: "",
      description: formDescription,
      items: formCards,
      status: formStatus,
      priority: formPriority,
    });

    if (res.success) {
      toast.success(editingSet ? "Trending collection updated" : "New collection published");
      setIsModalOpen(false);
      loadData();
    } else {
      toast.error(res.error || "Failed to save collection.");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    const res = await deleteTrendingSection(id);
    if (res.success) {
      toast.success("Collection deleted.");
      loadData();
    } else {
      toast.error(res.error || "Failed to delete.");
    }
  };

  const handleToggleStatus = async (set: TrendingSectionSet) => {
    const nextStatus = set.status === "published" ? "draft" : "published";
    const res = await setTrendingSectionStatus(set.id, nextStatus);
    if (res.success) {
      toast.success(`Set moved to ${nextStatus}.`);
      loadData();
    } else {
      toast.error(res.error || "Failed to update status.");
    }
  };

  const publishedCount = sets.filter((s) => s.status === "published").length;
  const draftCount = sets.length - publishedCount;

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-[#E17100]/10 text-[#E17100] border border-[#E17100]/20">
              Homepage Featured
            </span>
            <span className="text-xs text-gray-500">
              4-Card Architectural Mosaic
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">
            Trending Collections
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Manage interactive multi-slide mosaic showcases displayed on the homepage.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <Link
            href="/#trending"
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-[#E17100] border border-gray-200 dark:border-slate-800 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            View Live on Site
          </Link>

          <button
            type="button"
            onClick={openNewForm}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#E17100] hover:bg-[#c96200] text-white font-semibold text-xs sm:text-sm shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            New Collection
          </button>
        </div>
      </div>

      {/* Subheader Scope & Stats */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#E17100]/10 text-[#E17100] border border-[#E17100]/20 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-[#E17100]" />
            Homepage Slides
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-[#E17100] text-white font-bold">
              {sets.length}
            </span>
          </span>
        </div>

        {/* Stats Pill */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-medium border border-emerald-200 dark:border-emerald-900/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {publishedCount} Published
          </span>
          {draftCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-medium border border-amber-200 dark:border-amber-900/60">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              {draftCount} Draft
            </span>
          )}
        </div>
      </div>

      {/* Collections List */}
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-3 text-gray-400">
          <Loader2 className="w-7 h-7 animate-spin text-[#E17100]" />
          <span className="text-xs font-medium">Loading collections...</span>
        </div>
      ) : sets.length === 0 ? (
        <div className="p-12 text-center border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-xl bg-gray-50/50 dark:bg-slate-900/50">
          <Flame className="w-10 h-10 mx-auto text-gray-400 stroke-[1.2]" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mt-3">
            No Custom Collections Added
          </h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            The homepage is currently displaying default fallback slides. Create your first collection to showcase your catalog.
          </p>
          <button
            type="button"
            onClick={openNewForm}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#E17100] text-white font-semibold text-xs shadow-sm hover:bg-[#c96200]"
          >
            <Plus className="w-4 h-4" />
            Create First Collection
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {sets.map((set, idx) => (
            <div
              key={set.id}
              className="p-5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-gray-300 dark:hover:border-slate-700 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                {/* Collection Meta */}
                <div className="space-y-1.5 max-w-md">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300">
                      Slide #{idx + 1}
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                        set.status === "published"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400"
                          : "bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-gray-400"
                      }`}
                    >
                      {set.status === "published" ? "Live" : "Draft"}
                    </span>

                    <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200/50">
                      Order: #{set.priority || idx + 1}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    {set.name}
                  </h3>

                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                    {set.description || "No description provided."}
                  </p>
                </div>

                {/* 4 Cards Miniature Mosaic Preview */}
                <div className="flex items-center gap-2.5 overflow-x-auto py-1">
                  {set.items.map((card, cIdx) => (
                    <div
                      key={cIdx}
                      className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-800 shrink-0 group shadow-sm"
                      title={`Card ${card.number}: ${card.label} (${card.title})`}
                    >
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        sizes="96px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Flush top-left square badge */}
                      <span className="absolute top-0 left-0 bg-white dark:bg-slate-900 font-serif text-[11px] font-bold text-[#E17100] px-1.5 py-0.5 shadow-sm border-r border-b border-black/10 dark:border-white/10 leading-none">
                        {card.number}
                      </span>
                      {/* Bottom label pill */}
                      <span className="absolute bottom-1 inset-x-1 bg-black/85 text-[9px] font-semibold text-white px-1.5 py-0.5 rounded truncate text-center">
                        {card.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Action Controls */}
                <div className="flex items-center gap-2 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-gray-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(set)}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    {set.status === "published" ? "Unpublish" : "Publish"}
                  </button>

                  <button
                    type="button"
                    onClick={() => openEditForm(set)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(set.id, set.name)}
                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                    title="Delete Set"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* FULLSCREEN COLLECTION EDITOR MODAL WITH LIVE INTERACTIVE PREVIEW           */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="relative w-full max-w-5xl max-h-[94vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-800 flex flex-col overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="px-6 py-3.5 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between bg-gray-50/80 dark:bg-slate-950/60 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#E17100]/10 text-[#E17100] flex items-center justify-center font-bold">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    {editingSet ? "Edit Collection" : "New Trending Collection"}
                    <span className="text-[11px] font-normal text-gray-400">
                      • {formName || "Untitled"}
                    </span>
                  </h3>
                  <p className="text-xs text-gray-500">
                    Live interactive collage preview updates in real-time as you edit.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Modal Content */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* ======================================================= */}
              {/* SECTION 1: LIVE INTERACTIVE COLLAGE PREVIEW             */}
              {/* ======================================================= */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Maximize2 className="w-3.5 h-3.5 text-[#E17100]" />
                      Interactive Live Preview
                    </label>
                    <span className="hidden sm:inline-block text-[11px] text-gray-400">
                      • Click any card below to jump to its settings
                    </span>
                  </div>

                  {/* Device Toggle: Desktop Collage vs Phone Grid */}
                  <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 p-0.5 rounded-lg border border-gray-200 dark:border-slate-700 ml-auto">
                    <button
                      type="button"
                      onClick={() => setPreviewDevice("desktop")}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                        previewDevice === "desktop"
                          ? "bg-white dark:bg-slate-700 text-[#E17100] shadow-xs"
                          : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                      }`}
                    >
                      <Monitor className="w-3.5 h-3.5" />
                      <span>Desktop View</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewDevice("mobile")}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                        previewDevice === "mobile"
                          ? "bg-white dark:bg-slate-700 text-[#E17100] shadow-xs"
                          : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Phone View</span>
                    </button>
                  </div>
                </div>

                {/* 1. DESKTOP ARTISTIC COLLAGE PREVIEW (Shown on desktop when previewDevice === "desktop") */}
                <div
                  className={`${
                    previewDevice === "desktop" ? "hidden sm:block" : "hidden"
                  } relative w-full h-[320px] sm:h-[360px] rounded-xl overflow-hidden border border-amber-200/80 dark:border-amber-900/40 bg-[#FBF8F3] dark:bg-[#0c1017] shadow-inner select-none`}
                >
                  {/* Subtle Background Watermark Text */}
                  <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none opacity-[0.04] dark:opacity-[0.06]">
                    <span className="font-serif text-[11vw] font-black tracking-widest text-black dark:text-white whitespace-nowrap leading-none">
                      TRENDING
                    </span>
                  </div>

                  {/* Horizontal Axis Line at 52% */}
                  <div className="absolute left-0 right-0 top-[52%] h-[1px] bg-black/10 dark:bg-white/10 pointer-events-none" />

                  {/* Left Text Block */}
                  <div className="absolute left-4 sm:left-8 top-[30%] max-w-[170px] sm:max-w-[210px] z-10 pointer-events-none">
                    <h4 className="font-serif text-xl sm:text-2xl md:text-3xl font-normal text-gray-900 dark:text-white leading-tight">
                      {formTagline || "Trending Now"}
                    </h4>
                    <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                      {formDescription || "Curated floors & panels."}
                    </p>
                    <div className="h-[2px] w-10 sm:w-14 bg-[#E17100] rounded-full mt-2" />
                  </div>

                  {/* 4 Interactive Collage Cards */}
                  <div className="absolute inset-0">
                    {/* CARD 02: Top Spot (above axis, fits safely without top clipping) */}
                    <div
                      onClick={() => setActiveCardTab(1)}
                      className={`absolute left-[35%] sm:left-[36%] bottom-[49%] w-[16%] sm:w-[15%] h-[42%] sm:h-[44%] rounded-none overflow-hidden bg-white dark:bg-slate-900 border cursor-pointer transition-all duration-300 shadow-md ${
                        activeCardTab === 1
                          ? "ring-2 ring-[#E17100] border-[#E17100] z-30 scale-102"
                          : "border-black/10 dark:border-white/10 z-10 hover:border-amber-400"
                      }`}
                      title="Click to edit Card 02 (Top Spot)"
                    >
                      {/* Flush top-left badge */}
                      <div className="absolute top-0 left-0 z-20 aspect-square w-5 sm:w-6 md:w-7 bg-white dark:bg-slate-900 border-r border-b border-black/10 dark:border-white/10 flex items-center justify-center shadow-xs">
                        <span className="font-serif text-xs sm:text-sm font-bold text-[#E17100]">
                          02
                        </span>
                      </div>
                      {formCards[1]?.image ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={formCards[1].image}
                          alt={formCards[1].title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">
                          Empty
                        </div>
                      )}
                      <span className="absolute bottom-1 left-1 bg-black/85 text-white text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-wider truncate max-w-[85%]">
                        {formCards[1].label || "Label"}
                      </span>
                    </div>

                    {/* CARD 04: Bottom Left Spot (below axis) */}
                    <div
                      onClick={() => setActiveCardTab(3)}
                      className={`absolute left-[26%] sm:left-[27%] top-[53%] w-[16%] sm:w-[15%] h-[35%] sm:h-[36%] rounded-none overflow-hidden bg-white dark:bg-slate-900 border cursor-pointer transition-all duration-300 shadow-md ${
                        activeCardTab === 3
                          ? "ring-2 ring-[#E17100] border-[#E17100] z-30 scale-102"
                          : "border-black/10 dark:border-white/10 z-20 hover:border-amber-400"
                      }`}
                      title="Click to edit Card 04 (Bottom Left Spot)"
                    >
                      <div className="absolute top-0 left-0 z-20 aspect-square w-5 sm:w-6 md:w-7 bg-white dark:bg-slate-900 border-r border-b border-black/10 dark:border-white/10 flex items-center justify-center shadow-xs">
                        <span className="font-serif text-xs sm:text-sm font-bold text-[#E17100]">
                          04
                        </span>
                      </div>
                      {formCards[3]?.image ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={formCards[3].image}
                          alt={formCards[3].title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">
                          Empty
                        </div>
                      )}
                      <span className="absolute bottom-1 left-1 bg-black/85 text-white text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-wider truncate max-w-[85%]">
                        {formCards[3].label || "Label"}
                      </span>
                    </div>

                    {/* CARD 01: Centerpiece Hero Spot (Overlaps Card 02) */}
                    <div
                      onClick={() => setActiveCardTab(0)}
                      className={`absolute left-[44%] sm:left-[45%] top-[52%] -translate-y-1/2 w-[31%] sm:w-[30%] h-[56%] sm:h-[58%] rounded-none overflow-hidden bg-white dark:bg-slate-900 border cursor-pointer transition-all duration-300 shadow-xl ${
                        activeCardTab === 0
                          ? "ring-2 ring-[#E17100] border-[#E17100] z-30 scale-102"
                          : "border-black/10 dark:border-white/10 z-20 hover:border-amber-400"
                      }`}
                      title="Click to edit Card 01 (Hero Centerpiece)"
                    >
                      <div className="absolute top-0 left-0 z-20 aspect-square w-6 sm:w-8 md:w-9 bg-white dark:bg-slate-900 border-r border-b border-black/10 dark:border-white/10 flex items-center justify-center shadow-md">
                        <span className="font-serif text-sm sm:text-base font-bold text-[#E17100]">
                          01
                        </span>
                      </div>
                      {formCards[0]?.image ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={formCards[0].image}
                          alt={formCards[0].title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">
                          Empty
                        </div>
                      )}
                      <span className="absolute bottom-1.5 left-1.5 bg-black/85 text-white text-[8px] sm:text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider truncate max-w-[85%] shadow">
                        {formCards[0].label || "Label"}
                      </span>
                    </div>

                    {/* CARD 03: Right Living Spot (Starts at axis 44% and extends downward to bottom, overlapping Card 01) */}
                    <div
                      onClick={() => setActiveCardTab(2)}
                      className={`absolute left-[68%] sm:left-[69%] top-[43%] sm:top-[44%] w-[18%] sm:w-[17%] h-[48%] sm:h-[50%] rounded-none overflow-hidden bg-white dark:bg-slate-900 border cursor-pointer transition-all duration-300 shadow-xl ${
                        activeCardTab === 2
                          ? "ring-2 ring-[#E17100] border-[#E17100] z-40 scale-102"
                          : "border-black/10 dark:border-white/10 z-30 hover:border-amber-400"
                      }`}
                      title="Click to edit Card 03 (Right Spot)"
                    >
                      <div className="absolute top-0 left-0 z-20 aspect-square w-5 sm:w-6 md:w-7 bg-white dark:bg-slate-900 border-r border-b border-black/10 dark:border-white/10 flex items-center justify-center shadow-xs">
                        <span className="font-serif text-xs sm:text-sm font-bold text-[#E17100]">
                          03
                        </span>
                      </div>
                      {formCards[2]?.image ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={formCards[2].image}
                          alt={formCards[2].title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">
                          Empty
                        </div>
                      )}
                      <span className="absolute bottom-1 left-1 bg-black/85 text-white text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-wider truncate max-w-[85%]">
                        {formCards[2].label || "Label"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. MOBILE PHONE SCREEN PREVIEW (Shown on phone screens by default OR when toggled to mobile) */}
                <div
                  className={`${
                    previewDevice === "mobile" ? "block" : "block sm:hidden"
                  } relative w-full max-w-lg mx-auto rounded-2xl overflow-hidden border border-amber-200/80 dark:border-amber-900/40 bg-[#FAF7F2] dark:bg-[#0C1220] p-4 sm:p-5 shadow-inner select-none transition-all duration-300`}
                >
                  {/* Phone Header matching Homepage TrendingNowSection Mobile Header */}
                  <div className="flex items-end justify-between gap-3 mb-3.5">
                    <div>
                      <h4 className="font-serif text-xl sm:text-2xl font-normal text-gray-900 dark:text-white leading-tight">
                        {formTagline || "Trending Now"}
                      </h4>
                      <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
                        {formDescription || "Curated floors & panels."}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-[#E17100] bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 px-2 py-0.5 rounded-full shrink-0">
                      Mobile Preview
                    </span>
                  </div>

                  {/* 2-Column Mobile Grid matching Homepage TrendingNowSection */}
                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Card 01: Hero Centerpiece (Full Width 2 cols, Aspect 16/9) */}
                    <div
                      onClick={() => setActiveCardTab(0)}
                      className={`col-span-2 relative aspect-[16/9] rounded-none overflow-hidden bg-white dark:bg-slate-900 border cursor-pointer transition-all duration-300 shadow-md ${
                        activeCardTab === 0
                          ? "ring-2 ring-[#E17100] border-[#E17100] scale-[1.01]"
                          : "border-black/10 dark:border-white/10 hover:border-amber-400"
                      }`}
                      title="Click to edit Card 01 (Hero Centerpiece)"
                    >
                      <div className="absolute top-0 left-0 z-20 aspect-square w-10 sm:w-11 bg-white/95 dark:bg-slate-900/95 border-r border-b border-black/10 dark:border-white/10 flex items-center justify-center shadow-xs">
                        <span className="font-serif text-base sm:text-lg font-bold text-[#E17100] leading-none">
                          01
                        </span>
                      </div>
                      {formCards[0]?.image ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={formCards[0].image}
                          alt={formCards[0].title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                          Empty
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />
                      <span className="absolute bottom-2 left-2 bg-black text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider">
                        {formCards[0].label || "Card 01"}
                      </span>
                    </div>

                    {/* Card 02: Aspect 4/5 */}
                    <div
                      onClick={() => setActiveCardTab(1)}
                      className={`relative aspect-[4/5] rounded-none overflow-hidden bg-white dark:bg-slate-900 border cursor-pointer transition-all duration-300 shadow-sm ${
                        activeCardTab === 1
                          ? "ring-2 ring-[#E17100] border-[#E17100] scale-[1.01]"
                          : "border-black/10 dark:border-white/10 hover:border-amber-400"
                      }`}
                      title="Click to edit Card 02"
                    >
                      <div className="absolute top-0 left-0 z-20 aspect-square w-8 sm:w-9 bg-white/95 dark:bg-slate-900/95 border-r border-b border-black/10 dark:border-white/10 flex items-center justify-center shadow-xs">
                        <span className="font-serif text-sm font-bold text-[#E17100] leading-none">
                          02
                        </span>
                      </div>
                      {formCards[1]?.image ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={formCards[1].image}
                          alt={formCards[1].title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                          Empty
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />
                      <span className="absolute bottom-1.5 left-1.5 bg-black text-white text-[8px] font-bold px-1.5 py-0.5 uppercase tracking-wider truncate max-w-[85%]">
                        {formCards[1].label || "Card 02"}
                      </span>
                    </div>

                    {/* Card 03: Aspect 4/5 */}
                    <div
                      onClick={() => setActiveCardTab(2)}
                      className={`relative aspect-[4/5] rounded-none overflow-hidden bg-white dark:bg-slate-900 border cursor-pointer transition-all duration-300 shadow-sm ${
                        activeCardTab === 2
                          ? "ring-2 ring-[#E17100] border-[#E17100] scale-[1.01]"
                          : "border-black/10 dark:border-white/10 hover:border-amber-400"
                      }`}
                      title="Click to edit Card 03"
                    >
                      <div className="absolute top-0 left-0 z-20 aspect-square w-8 sm:w-9 bg-white/95 dark:bg-slate-900/95 border-r border-b border-black/10 dark:border-white/10 flex items-center justify-center shadow-xs">
                        <span className="font-serif text-sm font-bold text-[#E17100] leading-none">
                          03
                        </span>
                      </div>
                      {formCards[2]?.image ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={formCards[2].image}
                          alt={formCards[2].title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                          Empty
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />
                      <span className="absolute bottom-1.5 left-1.5 bg-black text-white text-[8px] font-bold px-1.5 py-0.5 uppercase tracking-wider truncate max-w-[85%]">
                        {formCards[2].label || "Card 03"}
                      </span>
                    </div>

                    {/* Card 04: Full Width 2 cols, Aspect 21/9 */}
                    <div
                      onClick={() => setActiveCardTab(3)}
                      className={`col-span-2 relative aspect-[21/9] rounded-none overflow-hidden bg-white dark:bg-slate-900 border cursor-pointer transition-all duration-300 shadow-sm ${
                        activeCardTab === 3
                          ? "ring-2 ring-[#E17100] border-[#E17100] scale-[1.01]"
                          : "border-black/10 dark:border-white/10 hover:border-amber-400"
                      }`}
                      title="Click to edit Card 04"
                    >
                      <div className="absolute top-0 left-0 z-20 aspect-square w-8 sm:w-9 bg-white/95 dark:bg-slate-900/95 border-r border-b border-black/10 dark:border-white/10 flex items-center justify-center shadow-xs">
                        <span className="font-serif text-sm font-bold text-[#E17100] leading-none">
                          04
                        </span>
                      </div>
                      {formCards[3]?.image ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={formCards[3].image}
                          alt={formCards[3].title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                          Empty
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />
                      <span className="absolute bottom-1.5 left-2 bg-black text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider">
                        {formCards[3].label || "Card 04"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ======================================================= */}
              {/* SECTION 2: CARD SELECTOR TABS & INDIVIDUAL EDITOR       */}
              {/* ======================================================= */}
              <div className="space-y-4 pt-2 border-t border-gray-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#E17100]" />
                    Card Configuration (Select card to configure)
                  </label>
                  <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    All 4 Cards Compulsory
                  </span>
                </div>

                {/* 4 Card Selector Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {formCards.map((c, idx) => {
                    const isActive = activeCardTab === idx;
                    const spot = CARD_SPOT_DESCRIPTIONS[idx];
                    const hasError = cardImageErrors[idx];

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveCardTab(idx)}
                        className={`p-2.5 rounded-xl border text-left transition-all duration-200 flex items-center gap-2.5 ${
                          isActive
                            ? "bg-amber-500/10 border-[#E17100] ring-1 ring-[#E17100] shadow-xs"
                            : "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 hover:border-gray-300"
                        }`}
                      >
                        {/* Mini thumbnail */}
                        <div className="relative w-10 h-10 rounded-md overflow-hidden bg-gray-100 dark:bg-slate-800 shrink-0 border border-black/10">
                          {c.image ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={c.image}
                              alt={c.label}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[9px] text-gray-400">
                              No Img
                            </div>
                          )}
                          <span className="absolute top-0 left-0 bg-white dark:bg-slate-900 font-serif text-[9px] font-bold text-[#E17100] px-1 leading-none shadow-xs">
                            {c.number}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-900 dark:text-white truncate">
                              Card {c.number}
                            </span>
                            {hasError ? (
                              <AlertTriangle className="w-3 h-3 text-rose-500" />
                            ) : c.image ? (
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            ) : null}
                          </div>
                          <span className="text-[10px] text-gray-500 block truncate">
                            {c.label || spot.spot}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Active Card Detailed Settings Form */}
                {(() => {
                  const card = formCards[activeCardTab];
                  const spot = CARD_SPOT_DESCRIPTIONS[activeCardTab];
                  const hasError = cardImageErrors[activeCardTab];

                  return (
                    <div className="p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/40 space-y-4">
                      {/* Active Card Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded bg-white dark:bg-slate-800 font-serif font-black text-sm text-[#E17100] flex items-center justify-center border shadow-xs">
                            {card.number}
                          </span>
                          <div>
                            <span className="text-xs font-bold text-gray-900 dark:text-white block">
                              Editing Card {card.number}: {spot.spot}
                            </span>
                            <span className="text-[11px] text-gray-400">
                              {spot.desc}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Fields & Visual Selector */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                        {/* Left: Thumbnail & Cloudinary Button */}
                        <div className="md:col-span-4 space-y-2.5">
                          <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                            {card.image ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={card.image}
                                alt={card.title || "Preview"}
                                className="w-full h-full object-cover"
                                onError={() => {
                                  setCardImageErrors((prev) => ({ ...prev, [activeCardTab]: true }));
                                }}
                                onLoad={() => {
                                  setCardImageErrors((prev) => ({ ...prev, [activeCardTab]: false }));
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                                No Image Selected
                              </div>
                            )}

                            {/* Corner Pill Tag */}
                            <span className="absolute bottom-2 left-2 bg-black/85 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                              {card.label || "Pill Label"}
                            </span>
                          </div>

                          {/* Cloudinary Trigger Button */}
                          <button
                            type="button"
                            onClick={() => openImagePickerForCard(activeCardTab)}
                            className="w-full py-2.5 px-3 rounded-lg bg-[#E17100] hover:bg-[#c96200] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98"
                          >
                            <Sparkles className="w-4 h-4" />
                            Select from Cloudinary Folders
                          </button>

                          {hasError ? (
                            <span className="text-[11px] text-rose-500 font-medium flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              Image failed to load. Check URL.
                            </span>
                          ) : card.image ? (
                            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Image Verified & Ready
                            </span>
                          ) : null}
                        </div>

                        {/* Right: Text & Destination Fields */}
                        <div className="md:col-span-8 space-y-3.5">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                Badge Pill Label *
                              </label>
                              <input
                                type="text"
                                required
                                value={card.label}
                                onChange={(e) => handleCardChange(activeCardTab, "label", e.target.value)}
                                placeholder="e.g. Wall Panels, Herringbone"
                                className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-1 focus:ring-[#E17100]"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                Card Title / Description *
                              </label>
                              <input
                                type="text"
                                required
                                value={card.title}
                                onChange={(e) => handleCardChange(activeCardTab, "title", e.target.value)}
                                placeholder="e.g. Fluted Charcoal & WPC Wall Panels"
                                className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-1 focus:ring-[#E17100]"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                              Image URL (Direct Cloudinary URL) *
                            </label>
                            <input
                              type="url"
                              required
                              value={card.image}
                              onChange={(e) => handleCardChange(activeCardTab, "image", e.target.value)}
                              placeholder="https://res.cloudinary.com/..."
                              className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-1 focus:ring-[#E17100]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                              Destination Page Link *
                            </label>
                            <select
                              value={card.href}
                              onChange={(e) => handleCardChange(activeCardTab, "href", e.target.value)}
                              className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-1 focus:ring-[#E17100]"
                            >
                              <option value="">Select Destination Page...</option>
                              {AVAILABLE_PAGE_LINKS.map((link, lIdx) => (
                                <option key={lIdx} value={link.value}>
                                  {link.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* ======================================================= */}
              {/* SECTION 3: GENERAL COLLECTION SETTINGS                  */}
              {/* ======================================================= */}
              <div className="space-y-4 pt-2 border-t border-gray-200 dark:border-slate-800">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#E17100]" />
                  Collection Details & Slide Order
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Internal Collection Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Wall Panels & Festive Living"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-1 focus:ring-[#E17100]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Headline Tagline *
                    </label>
                    <input
                      type="text"
                      required
                      value={formTagline}
                      onChange={(e) => setFormTagline(e.target.value)}
                      placeholder="e.g. Trending Now"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-1 focus:ring-[#E17100]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Slide Order (Sequence) *
                    </label>
                    <select
                      value={formPriority}
                      onChange={(e) => setFormPriority(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-1 focus:ring-[#E17100] font-medium"
                    >
                      <option value={1}>1 (First Slide / Shows First)</option>
                      <option value={2}>2 (Second Slide)</option>
                      <option value={3}>3 (Third Slide)</option>
                      <option value={4}>4 (Fourth Slide)</option>
                      <option value={5}>5 (Fifth Slide)</option>
                      <option value={6}>6 (Sixth Slide)</option>
                      <option value={7}>7 (Seventh Slide)</option>
                      <option value={8}>8 (Eighth Slide)</option>
                      <option value={9}>9 (Ninth Slide)</option>
                      <option value={10}>10 (Tenth Slide)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Collection Subtitle Description *
                    </label>
                    <input
                      type="text"
                      required
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="e.g. Most enquired floors and panels in Gurgaon and Delhi NCR."
                      className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-1 focus:ring-[#E17100]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status
                    </label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as "published" | "draft")}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-1 focus:ring-[#E17100]"
                    >
                      <option value="published">Published (Live)</option>
                      <option value="draft">Draft (Hidden)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Form Actions Footer */}
              <div className="pt-4 border-t border-gray-200 dark:border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-lg bg-[#E17100] hover:bg-[#c96200] text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 disabled:opacity-50 transition-all active:scale-95"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingSet ? "Save Changes" : "Publish Collection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CLOUDINARY MODAL RENDERED STRICTLY AFTER isModalOpen FOR PROPER Z-STACKING */}
      {/* ========================================================================= */}
      <CloudinaryImagePickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelectImage={handleImageSelected}
        currentValue={formCards[pickerTargetCardIdx]?.image}
        title={`Select Image for Card ${formCards[pickerTargetCardIdx]?.number} (${formCards[pickerTargetCardIdx]?.label || "Product"})`}
      />
    </div>
  );
}
