"use client";

import React, { useState, useEffect } from "react";
import {
  Rocket,
  Loader2,
  Tag,
  LinkIcon,
  ImageIcon,
  IndianRupee,
  FileText,
  PackageCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
} from "lucide-react";
import { publishToGmc, getPublisherStats } from "@/actions/gmc-publisher";
import { optimizeProductText } from "@/actions/gmc-ai";
import type { PublisherStats } from "@/actions/gmc-publisher";
import toast from "react-hot-toast";

const emptyForm = {
  offerId: "",
  title: "",
  description: "",
  link: "",
  imageLink: "",
  price: "",
};

function StatCard({
  label,
  value,
  color,
  icon,
  isLoading,
}: {
  label: string;
  value: number;
  color: "slate" | "emerald" | "amber" | "rose";
  icon: React.ReactNode;
  isLoading: boolean;
}) {
  const styles = {
    slate:  { border: "border-l-slate-400",  text: "text-slate-500",   bg: "bg-slate-50 dark:bg-slate-800/40"   },
    emerald:{ border: "border-l-emerald-500", text: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    amber:  { border: "border-l-amber-500",  text: "text-amber-600",   bg: "bg-amber-50 dark:bg-amber-900/20"   },
    rose:   { border: "border-l-rose-500",   text: "text-rose-600",    bg: "bg-rose-50 dark:bg-rose-900/20"     },
  }[color];

  return (
    <div className={`${styles.bg} border border-slate-200 dark:border-slate-800 border-l-4 ${styles.border} rounded-2xl p-4 flex items-center gap-4`}>
      <div className={`${styles.text} shrink-0`}>{icon}</div>
      <div>
        <p className={`text-[10px] font-black uppercase tracking-widest ${styles.text}`}>{label}</p>
        <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
          {isLoading ? <span className="inline-block w-8 h-6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" /> : value}
        </p>
      </div>
    </div>
  );
}

export default function GmcPublisherTab() {
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [stats, setStats] = useState<PublisherStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  const loadStats = async () => {
    setIsLoadingStats(true);
    try {
      const res = await getPublisherStats();
      if (res.success && res.data) setStats(res.data);
      else toast.error(res.error || "Failed to load publisher stats");
    } catch (e: any) {
      toast.error(e.message || "Error loading stats");
    } finally {
      setIsLoadingStats(false);
    }
  };

  useEffect(() => { loadStats(); }, []);

  const handleChange = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleAiOptimize = async () => {
    if (!form.title || !form.description) {
      toast.error("Please enter a title and description first.");
      return;
    }
    setIsOptimizing(true);
    try {
      const res = await optimizeProductText(form.title, form.description);
      if (res.success) {
        setForm(prev => ({
          ...prev,
          title: res.optimizedTitle,
          description: res.optimizedDescription
        }));
        toast.success("AI Optimization complete! ✨");
      } else {
        toast.error(res.error || "AI Optimization failed");
      }
    } catch (e: any) {
      toast.error("AI error: " + e.message);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { offerId, title, description, link, imageLink, price } = form;
    if (!offerId || !title || !description || !link || !imageLink || !price) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await publishToGmc(form);
      if (res.success) {
        toast.success("Product pushed to Google Shopping! 🚀");
        setForm(emptyForm);
        await loadStats();
      } else {
        toast.error(res.error || "Failed to publish product.");
      }
    } catch (e: any) {
      toast.error(e.message || "Unexpected error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">

      {/* ── Live Tracker ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Live Tracker — Admin Panel Products</h3>
          <button
            onClick={loadStats}
            disabled={isLoadingStats}
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 transition-colors disabled:opacity-50"
          >
            <Loader2 size={12} className={isLoadingStats ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Total Published" value={stats?.total ?? 0}       color="slate"   icon={<PackageCheck size={22} />} isLoading={isLoadingStats} />
          <StatCard label="Approved"        value={stats?.approved ?? 0}    color="emerald" icon={<CheckCircle2 size={22} />} isLoading={isLoadingStats} />
          <StatCard label="Pending"         value={stats?.pending ?? 0}     color="amber"   icon={<Clock size={22} />}        isLoading={isLoadingStats} />
          <StatCard label="Issues"          value={stats?.disapproved ?? 0} color="rose"    icon={<AlertTriangle size={22} />}isLoading={isLoadingStats} />
        </div>
      </div>

      {/* ── Publish Form ── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-amber-50/60 dark:from-amber-900/10 to-white dark:to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/25">
              <Rocket size={18} className="text-white" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 dark:text-white tracking-tight">Publish New Product</h3>
              <p className="text-xs text-slate-500 mt-0.5">Pushes directly to Google Shopping · Bypasses GTIN · Tagged for tracking</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Row 1: Product ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <Tag size={10} /> Product SKU / ID *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. gf-spc-302"
                value={form.offerId}
                onChange={(e) => handleChange("offerId", e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-400 outline-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <IndianRupee size={10} /> Price (INR) *
              </label>
              <input
                type="number"
                required
                min="1"
                step="0.01"
                placeholder="e.g. 1499"
                value={form.price}
                onChange={(e) => handleChange("price", e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-400 outline-none transition-all"
              />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="flex items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><FileText size={10} /> Product Title *</span>
              <button
                type="button"
                onClick={handleAiOptimize}
                disabled={isOptimizing}
                className="text-[9px] font-bold text-indigo-500 border border-indigo-200 dark:border-indigo-800 px-2 py-0.5 rounded-full flex items-center gap-0.5 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors disabled:opacity-50"
              >
                {isOptimizing ? <Loader2 size={9} className="animate-spin" /> : <Sparkles size={9} />}
                {isOptimizing ? "Optimizing..." : "AI Optimize"}
              </button>
            </label>
            <input
              type="text"
              required
              maxLength={150}
              placeholder="Product title (max 150 chars)"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-400 outline-none transition-all"
            />
            <p className="text-right text-[10px] text-slate-400">{form.title.length}/150</p>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="flex items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <span>Description *</span>
              <button
                type="button"
                onClick={handleAiOptimize}
                disabled={isOptimizing}
                className="text-[9px] font-bold text-indigo-500 border border-indigo-200 dark:border-indigo-800 px-2 py-0.5 rounded-full flex items-center gap-0.5 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors disabled:opacity-50"
              >
                {isOptimizing ? <Loader2 size={9} className="animate-spin" /> : <Sparkles size={9} />}
                {isOptimizing ? "Optimizing..." : "AI Optimize"}
              </button>
            </label>
            <textarea
              required
              rows={3}
              placeholder="Describe the product for Google Shopping buyers..."
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-400 outline-none transition-all resize-none"
            />
          </div>

          {/* URL + Image URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <LinkIcon size={10} /> Landing Page URL *
              </label>
              <input
                type="url"
                required
                placeholder="https://goalsfloors.com/products/..."
                value={form.link}
                onChange={(e) => handleChange("link", e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-400 outline-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <ImageIcon size={10} /> Image URL *
              </label>
              <input
                type="url"
                required
                placeholder="https://goalsfloors.com/images/..."
                value={form.imageLink}
                onChange={(e) => handleChange("imageLink", e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-400 outline-none transition-all"
              />
            </div>
          </div>

          {/* Image Preview */}
          {form.imageLink && (
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.imageLink}
                alt="preview"
                className="w-14 h-14 object-cover rounded-lg bg-slate-200 dark:bg-slate-700 flex-shrink-0"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Image Preview</p>
                <p className="text-[10px] text-slate-400 truncate">{form.imageLink}</p>
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 px-5 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-60 text-white font-black rounded-2xl transition-all shadow-lg shadow-amber-500/30 text-sm tracking-wide"
          >
            {isSubmitting ? (
              <><Loader2 size={18} className="animate-spin" /> Publishing to Google Shopping...</>
            ) : (
              <><Rocket size={18} /> Push to Google Shopping</>
            )}
          </button>

          <p className="text-center text-[10px] text-slate-400">
            Products are tagged with <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">admin-panel</code> label · GTIN bypassed · Targets India (IN)
          </p>
        </form>
      </div>
    </div>
  );
}
