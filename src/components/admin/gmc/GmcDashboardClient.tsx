"use client";

import React, { useState, useEffect, lazy, Suspense } from "react";
import {
  ShoppingBag,
  Search,
  Loader2,
  PackageCheck,
  RefreshCw,
  Image as ImageIcon,
  Globe,
  Rocket,
  LayoutList,
} from "lucide-react";
import { fetchGmcProducts } from "@/actions/gmc";
import type { GmcProduct } from "@/lib/gmc";
import toast from "react-hot-toast";

const GmcPublisherTab = lazy(() => import("./GmcPublisherTab"));
const GmcManageTab = lazy(() => import("./GmcManageTab"));

type ActiveTab = "explorer" | "publisher" | "manage";

export default function GmcDashboardClient() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("explorer");
  const [isPendingTab, setIsPendingTab] = useState<string | null>(null);

  // Explorer state
  const [products, setProducts] = useState<GmcProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetchGmcProducts();
      if (res.success && res.products) {
        setProducts(res.products);
      } else {
        toast.error(res.error || "Failed to load products");
      }
    } catch (e: any) {
      toast.error(e.message || "Error loading products");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadProducts(); }, []);

  const handleTabChange = (tab: ActiveTab) => {
    setIsPendingTab(tab);
    setTimeout(() => {
      setActiveTab(tab);
      setIsPendingTab(null);
    }, 150);
  };

  const filteredProducts = products.filter((p) =>
    (p.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.offerId || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total:       products.length,
    approved:    products.filter((p) => p.status === "approved").length,
    pending:     products.filter((p) => p.status === "pending").length,
    disapproved: products.filter((p) => p.status === "disapproved").length,
  };

  const tabClass = (tab: ActiveTab, accent: string) =>
    `flex items-center gap-2 px-5 py-3 font-semibold text-sm transition-colors relative shrink-0 rounded-t-lg ${
      activeTab === tab
        ? `${accent} border-b-2 border-current`
        : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
    }`;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
            <div className="p-2 bg-amber-500 rounded-xl shadow-lg shadow-amber-500/25">
              <ShoppingBag className="text-white w-6 h-6" />
            </div>
            Merchant Center
          </h2>
          <p className="text-slate-500 mt-1 text-sm">
            Manage and publish products directly to Google Shopping.
          </p>
        </div>
        {activeTab === "explorer" && (
          <button
            onClick={loadProducts}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold text-sm transition-colors disabled:opacity-50 self-start sm:self-auto"
          >
            <RefreshCw size={15} className={isLoading ? "animate-spin" : ""} />
            Refresh
          </button>
        )}
      </div>

      {/* ── Tab Bar ── */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide -mb-px">
          <button
            onClick={() => handleTabChange("explorer")}
            className={tabClass("explorer", "text-amber-600 dark:text-amber-400")}
          >
            {isPendingTab === "explorer"
              ? <Loader2 size={16} className="animate-spin" />
              : <Globe size={16} />}
            Explorer
            {activeTab === "explorer" && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 rounded-t-full" />
            )}
          </button>

          <button
            onClick={() => handleTabChange("publisher")}
            className={tabClass("publisher", "text-indigo-600 dark:text-indigo-400")}
          >
            {isPendingTab === "publisher"
              ? <Loader2 size={16} className="animate-spin" />
              : <Rocket size={16} />}
            Publisher
            {activeTab === "publisher" && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-t-full" />
            )}
          </button>

          <button
            onClick={() => handleTabChange("manage")}
            className={tabClass("manage", "text-emerald-600 dark:text-emerald-400")}
          >
            {isPendingTab === "manage"
              ? <Loader2 size={16} className="animate-spin" />
              : <LayoutList size={16} />}
            Manage
            {activeTab === "manage" && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 rounded-t-full" />
            )}
          </button>
        </div>
      </div>

      {/* ── Tab Content ── */}
      <Suspense fallback={
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      }>
        {activeTab === "explorer" && (
          <div className="space-y-6">
            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Products</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white">{isLoading ? "..." : stats.total}</p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm border-l-4 border-l-emerald-500">
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Approved</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white">{isLoading ? "..." : stats.approved}</p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm border-l-4 border-l-amber-500">
                <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Pending</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white">{isLoading ? "..." : stats.pending}</p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm border-l-4 border-l-rose-500">
                <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Issues</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white">{isLoading ? "..." : stats.disapproved}</p>
              </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-50/50 to-white dark:from-slate-900/50 dark:to-slate-900">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
                    <PackageCheck size={16} className="text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">Live GMC Inventory</h3>
                    <p className="text-xs text-slate-500">
                      {isLoading ? "Loading..." : `${products.length} unique products in Google Shopping`}
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-400 outline-none w-full sm:w-52 transition-all"
                  />
                </div>
              </div>

              <div className="overflow-x-auto min-h-[280px]">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                    <p className="text-sm text-slate-500">Fetching GMC inventory...</p>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-4">
                      <ShoppingBag size={28} className="text-slate-300 dark:text-slate-600" />
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      {products.length === 0 ? "No products in GMC yet" : "No matching products"}
                    </h4>
                    <p className="text-sm text-slate-500 max-w-xs mt-1">
                      {products.length === 0
                        ? "Use the Publisher tab to push your first product."
                        : "Try a different search term."}
                    </p>
                  </div>
                ) : (
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50/50 dark:bg-slate-800/30 text-slate-400 uppercase text-[10px] font-black tracking-widest border-b border-slate-100 dark:border-slate-800">
                      <tr>
                        <th className="px-6 py-3">Title</th>
                        <th className="px-4 py-3 text-center hidden sm:table-cell">Status</th>
                        <th className="px-6 py-3 text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                      {filteredProducts.map((product, i) => {
                        const status = product.status || "pending";
                        const statusStyles = {
                          approved:    "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-900",
                          disapproved: "bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-900",
                          pending:     "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-900",
                        }[status] || "bg-slate-50 text-slate-500 border-slate-200";

                        return (
                          <tr key={i} className="hover:bg-amber-50/10 dark:hover:bg-amber-900/5 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                {(product as any).imageLink ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={(product as any).imageLink}
                                    alt={product.title}
                                    className="w-9 h-9 rounded-lg object-cover bg-slate-100 dark:bg-slate-800 flex-shrink-0"
                                  />
                                ) : (
                                  <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex-shrink-0 flex items-center justify-center">
                                    <ImageIcon size={16} className="text-slate-400" />
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <p className="font-bold text-slate-800 dark:text-slate-200 truncate text-[13px] max-w-[180px] sm:max-w-xs">
                                    {product.title}
                                  </p>
                                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{product.offerId}</p>
                                  {/* Mobile status badge */}
                                  <span className={`sm:hidden mt-1 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border ${statusStyles}`}>
                                    {status}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-center hidden sm:table-cell">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusStyles}`}>
                                {status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <span className="font-black text-slate-900 dark:text-white text-[13px]">
                                {product.price?.currency} {product.price?.value}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}
        {activeTab === "publisher" && <GmcPublisherTab />}
        {activeTab === "manage" && <GmcManageTab />}
      </Suspense>
    </div>
  );
}
