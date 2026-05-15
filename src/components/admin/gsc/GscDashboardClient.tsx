"use client";

import React, { useState } from "react";
import { Search, Globe, Rocket, Loader2, ArrowRight, RefreshCw, Activity, CheckCircle2, XCircle, Image as ImageIcon } from "lucide-react";
import { submitUrlForIndexing, inspectUrlAction } from "@/actions/seo";
import type { QueryRow } from "@/lib/seo";
import ImageSeoTab from "./ImageSeoTab";

// Using a basic toast fallback if sonner/react-hot-toast is not installed globally.
// Adjust as needed depending on your specific toast library.
import toast, { Toaster } from 'react-hot-toast';

type Props = {
  topQueries: QueryRow[];
  strikingDistanceQueries: QueryRow[];
  imageQueries: QueryRow[];
  initialNewUrls: string[];
  initialIndexedUrls: { url: string; last_requested_at: string }[];
  sitemapHealth?: any[];
};

export default function GscDashboardClient({ topQueries, strikingDistanceQueries, imageQueries, initialNewUrls, initialIndexedUrls, sitemapHealth = [] }: Props) {
  const [activeTab, setActiveTab] = useState<"keywords" | "sitemap" | "health" | "image-seo">("keywords");
  const [isPendingTab, setIsPendingTab] = useState<string | null>(null);

  // Row limiting state for mobile
  const [showAllTopQueries, setShowAllTopQueries] = useState(false);
  const [showAllStriking, setShowAllStriking] = useState(false);
  const [showAllSitemap, setShowAllSitemap] = useState(false);

  // Sitemap state
  const [newUrls, setNewUrls] = useState<string[]>(initialNewUrls);
  const [indexedUrls, setIndexedUrls] = useState<{ url: string; last_requested_at: string }[]>(initialIndexedUrls);
  const [indexingStates, setIndexingStates] = useState<Record<string, boolean>>({});
  const [isAutoIndexing, setIsAutoIndexing] = useState(false);

  // Inspection state
  const [inspectUrl, setInspectUrl] = useState("");
  const [isInspecting, setIsInspecting] = useState(false);
  const [inspectionData, setInspectionData] = useState<any>(null);

  // All URLs combined for the table (just strings for display)
  const allUrlStrings = [...newUrls, ...indexedUrls.map(i => i.url)];

  const handleIndexUrl = async (url: string) => {
    setIndexingStates(prev => ({ ...prev, [url]: true }));
    try {
      const result = await submitUrlForIndexing(url);
      if (result.success) {
        toast.success("URL submitted to Google!");
        setNewUrls(prev => prev.filter(u => u !== url));
        setIndexedUrls(prev => [{ url, last_requested_at: new Date().toISOString() }, ...prev]);
      } else {
        toast.error(result.error || "Failed to index URL.");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to index URL.");
    } finally {
      setIndexingStates(prev => ({ ...prev, [url]: false }));
    }
  };

  const handleAutoIndexAll = async () => {
    if (newUrls.length === 0) return;
    setIsAutoIndexing(true);
    let successCount = 0;

    // We process sequentially to avoid aggressive rate-limiting
    for (const url of newUrls) {
      setIndexingStates(prev => ({ ...prev, [url]: true }));
      try {
        const result = await submitUrlForIndexing(url);
        if (result.success) {
          successCount++;
          setNewUrls(prev => prev.filter(u => u !== url));
          setIndexedUrls(prev => [{ url, last_requested_at: new Date().toISOString() }, ...prev]);
        } else {
          // If 429 quota is hit, stop the loop entirely
          if (result.error?.includes("quota") || result.error?.includes("429")) {
            toast.error("Daily indexing quota reached. Stopping auto-pilot.");
            setIndexingStates(prev => ({ ...prev, [url]: false }));
            break;
          }
          toast.error(`Failed to index: ${url}`);
        }
      } catch (error: any) {
        toast.error(`Error: ${error.message}`);
      }
      setIndexingStates(prev => ({ ...prev, [url]: false }));

      // Small delay between requests
      await new Promise(res => setTimeout(res, 500));
    }

    if (successCount > 0) {
      toast.success(`Successfully submitted ${successCount} URLs.`);
    }
    setIsAutoIndexing(false);
  };

  const handleInspect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspectUrl.trim()) return;
    setIsInspecting(true);
    setInspectionData(null);
    try {
      const res = await inspectUrlAction(inspectUrl);
      if (res.success) {
        setInspectionData(res.data);
      } else {
        toast.error(res.error || "Failed to inspect URL.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to inspect URL.");
    } finally {
      setIsInspecting(false);
    }
  };

  const handleTabChange = (tabName: "keywords" | "sitemap" | "health" | "image-seo") => {
    setIsPendingTab(tabName);
    setTimeout(() => {
      setActiveTab(tabName);
      setIsPendingTab(null);
    }, 100);
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="w-full">
        {/* Tabs Navigation - Scrollable on Mobile */}
        <div className="flex border-b border-gray-200 dark:border-slate-800 mb-6 overflow-x-auto no-scrollbar whitespace-nowrap scroll-smooth">
          <button
            onClick={() => handleTabChange("keywords")}
            className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors relative shrink-0 ${activeTab === "keywords"
                ? "text-blue-600 dark:text-blue-400"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
          >
            {isPendingTab === "keywords" ? <Loader2 className="w-[18px] h-[18px] animate-spin" /> : <Search size={18} />}
            Keywords
            {activeTab === "keywords" && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-full" />
            )}
          </button>

          <button
            onClick={() => handleTabChange("sitemap")}
            className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors relative shrink-0 ${activeTab === "sitemap"
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
          >
            {isPendingTab === "sitemap" ? <Loader2 className="w-[18px] h-[18px] animate-spin" /> : <Globe size={18} />}
            Sitemap Indexer
            {activeTab === "sitemap" && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-t-full" />
            )}
          </button>

          <button
            onClick={() => handleTabChange("health")}
            className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors relative shrink-0 ${activeTab === "health"
                ? "text-purple-600 dark:text-purple-400"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
          >
            {isPendingTab === "health" ? <Loader2 className="w-[18px] h-[18px] animate-spin" /> : <Activity size={18} />}
            Health & Inspection
            {activeTab === "health" && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 dark:bg-purple-400 rounded-t-full" />
            )}
          </button>

          <button
            onClick={() => handleTabChange("image-seo")}
            className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors relative shrink-0 ${activeTab === "image-seo"
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
          >
            {isPendingTab === "image-seo" ? <Loader2 className="w-[18px] h-[18px] animate-spin" /> : <ImageIcon size={18} />}
            Image SEO
            {activeTab === "image-seo" && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-t-full" />
            )}
          </button>
        </div>

        {/* Keywords Tab */}
        {activeTab === "keywords" && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Table A: Top Queries */}
            <div className="bg-white dark:bg-slate-950 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col h-full">
              <div className="p-5 border-b border-gray-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Top Queries (Last 30 Days)</h2>
                <p className="text-sm text-slate-500">Queries driving the most clicks and impressions.</p>
              </div>
              <div className="overflow-x-auto flex-1">
                {topQueries.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">No data available or failed to fetch GSC data.</div>
                ) : (
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 dark:bg-slate-900/40 text-slate-500 dark:text-slate-400 uppercase text-xs font-semibold">
                      <tr>
                        <th className="px-5 py-3">Query</th>
                        <th className="px-5 py-3 text-right">Clicks</th>
                        <th className="px-5 py-3 text-right">Imp</th>
                        <th className="px-5 py-3 text-right">Pos</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                      {(showAllTopQueries ? topQueries : topQueries.slice(0, 10)).map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                          <td className="px-5 py-3 font-medium text-slate-900 dark:text-slate-200">{row.keys[0]}</td>
                          <td className="px-5 py-3 text-right">{row.clicks}</td>
                          <td className="px-5 py-3 text-right">{row.impressions}</td>
                          <td className="px-5 py-3 text-right">{row.position.toFixed(1)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                {!showAllTopQueries && topQueries.length > 10 && (
                  <button 
                    onClick={() => setShowAllTopQueries(true)}
                    className="w-full py-3 text-sm font-bold text-blue-600 dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors border-t border-gray-100 dark:border-slate-800"
                  >
                    Show More (+{topQueries.length - 10} queries)
                  </button>
                )}
              </div>
            </div>

            {/* Table B: Striking Distance Queries */}
            <div className="bg-white dark:bg-slate-950 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col h-full">
              <div className="p-5 border-b border-gray-200 dark:border-slate-800 bg-amber-50/30 dark:bg-amber-900/10">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Striking Distance (Pos 11-20)</h2>
                <p className="text-sm text-slate-500">Low-hanging fruit. Improve these to get to page 1.</p>
              </div>
              <div className="overflow-x-auto flex-1">
                {strikingDistanceQueries.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">No striking distance queries found.</div>
                ) : (
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 dark:bg-slate-900/40 text-slate-500 dark:text-slate-400 uppercase text-xs font-semibold">
                      <tr>
                        <th className="px-5 py-3">Query</th>
                        <th className="px-5 py-3 text-right">Clicks</th>
                        <th className="px-5 py-3 text-right">Imp</th>
                        <th className="px-5 py-3 text-right">Pos</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                      {(showAllStriking ? strikingDistanceQueries : strikingDistanceQueries.slice(0, 10)).map((row, i) => (
                        <tr key={i} className="hover:bg-amber-50/50 dark:hover:bg-amber-900/20 transition-colors">
                          <td className="px-5 py-3 font-medium text-slate-900 dark:text-slate-200">{row.keys[0]}</td>
                          <td className="px-5 py-3 text-right">{row.clicks}</td>
                          <td className="px-5 py-3 text-right">{row.impressions}</td>
                          <td className="px-5 py-3 text-right">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                              {row.position.toFixed(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                {!showAllStriking && strikingDistanceQueries.length > 10 && (
                  <button 
                    onClick={() => setShowAllStriking(true)}
                    className="w-full py-3 text-sm font-bold text-amber-600 dark:text-amber-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors border-t border-gray-100 dark:border-slate-800"
                  >
                    Show More (+{strikingDistanceQueries.length - 10} queries)
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Sitemap Indexer Tab */}
        {activeTab === "sitemap" && (
          <div className="bg-white dark:bg-slate-950 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-emerald-50/30 dark:bg-emerald-900/10">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">URL Indexing Submissions</h2>
                <p className="text-sm text-slate-500">Push individual URLs directly to Google via the Indexing API.</p>
              </div>
            </div>

            <div className="p-0">
              {newUrls.length > 0 && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-900/50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-amber-900 dark:text-amber-200">
                    <Rocket className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    <div>
                      <h3 className="font-bold text-lg">🚀 {newUrls.length} New URLs detected</h3>
                      <p className="text-sm opacity-80">These URLs are in your sitemap but haven't been submitted to Google yet.</p>
                    </div>
                  </div>
                  <button
                    onClick={handleAutoIndexAll}
                    disabled={isAutoIndexing}
                    className="flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold transition-colors disabled:opacity-70 whitespace-nowrap shadow-sm"
                  >
                    {isAutoIndexing ? <Loader2 size={18} className="animate-spin" /> : <Globe size={18} />}
                    Auto-Index All New URLs
                  </button>
                </div>
              )}

              {allUrlStrings.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center">
                  <Globe size={48} className="text-slate-300 dark:text-slate-700 mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 dark:text-slate-200">No Sitemap URLs found</h3>
                  <p className="text-slate-500 mt-1 max-w-sm mx-auto">
                    We couldn't find any URLs in your sitemap. Please check if https://goalsfloors.com/sitemap.xml is accessible and contains &lt;loc&gt; tags.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 dark:bg-slate-900/40 text-slate-500 dark:text-slate-400 uppercase text-xs font-semibold sticky top-0 z-10">
                      <tr>
                        <th className="px-6 py-4">URL</th>
                        <th className="px-6 py-4 text-right hidden sm:table-cell">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                      {(showAllSitemap ? allUrlStrings : allUrlStrings.slice(0, 10)).map((url, i) => {
                        const isIndexed = indexedUrls.some(i => i.url === url);
                        
                        const renderActionButtons = (isMobile: boolean) => (
                          <div className={`flex items-center gap-2 ${isMobile ? 'mt-3 sm:hidden' : 'justify-end'}`}>
                            {isIndexed ? (
                              <>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg font-medium text-[11px] sm:text-xs border border-green-200 dark:border-green-900/50">
                                  Requested ✅
                                </span>
                                <button
                                  onClick={() => handleIndexUrl(url)}
                                  disabled={indexingStates[url] || isAutoIndexing}
                                  className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                  title="Re-index this URL"
                                >
                                  {indexingStates[url] ? (
                                    <Loader2 size={16} className="animate-spin" />
                                  ) : (
                                    <RefreshCw size={16} />
                                  )}
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => handleIndexUrl(url)}
                                disabled={indexingStates[url] || isAutoIndexing}
                                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium text-[11px] sm:text-xs transition-colors disabled:opacity-50 border border-slate-200 dark:border-slate-700 shadow-sm"
                              >
                                {indexingStates[url] ? (
                                  <Loader2 size={14} className="animate-spin" />
                                ) : (
                                  <>
                                    Index Now <ArrowRight size={14} />
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        );

                        return (
                          <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors group">
                            <td className="px-6 py-4">
                              <div className="font-mono text-xs text-slate-600 dark:text-slate-400 break-words line-clamp-2 max-w-full sm:max-w-md md:max-w-xl">
                                {url}
                              </div>
                              {/* Render for Mobile */}
                              {renderActionButtons(true)}
                            </td>
                            <td className="px-6 py-4 text-right hidden sm:table-cell">
                              {/* Render for Desktop */}
                              {renderActionButtons(false)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {!showAllSitemap && allUrlStrings.length > 10 && (
                    <button 
                      onClick={() => setShowAllSitemap(true)}
                      className="w-full py-3 text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors border-t border-gray-100 dark:border-slate-800"
                    >
                      Show More (+{allUrlStrings.length - 10} URLs)
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Health & Inspection Tab */}
        {activeTab === "health" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sitemap Health */}
            <div className="bg-white dark:bg-slate-950 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col h-full">
              <div className="p-5 border-b border-gray-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Sitemap Health</h2>
                <p className="text-sm text-slate-500">Status of sitemaps submitted to Google.</p>
              </div>
              <div className="p-6 flex-1">
                {sitemapHealth.length === 0 ? (
                  <div className="text-center text-slate-500 py-8">No sitemap data found.</div>
                ) : (
                  <div className="space-y-4">
                    {sitemapHealth.map((sm, i) => (
                      <div key={i} className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50 dark:bg-slate-900/30">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-medium text-slate-800 dark:text-slate-200 truncate pr-4">{sm.path}</span>
                          <span className="text-xs font-medium px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-300">
                            Errors: {sm.errors || 0}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-slate-500 text-xs uppercase font-semibold">Last Submitted</p>
                            <p className="text-slate-900 dark:text-slate-300 mt-0.5">{new Date(sm.lastSubmitted).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-slate-500 text-xs uppercase font-semibold">Last Downloaded</p>
                            <p className="text-slate-900 dark:text-slate-300 mt-0.5">{sm.lastDownloaded ? new Date(sm.lastDownloaded).toLocaleDateString() : 'Pending'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* URL Inspection */}
            <div className="bg-white dark:bg-slate-950 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col h-full">
              <div className="p-5 border-b border-gray-200 dark:border-slate-800 bg-purple-50/30 dark:bg-purple-900/10">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">URL Inspection</h2>
                <p className="text-sm text-slate-500">Live check if a page is indexed and mobile friendly.</p>
              </div>
              <div className="p-6">
                <form onSubmit={handleInspect} className="flex gap-2">
                  <input
                    type="url"
                    value={inspectUrl}
                    onChange={(e) => setInspectUrl(e.target.value)}
                    placeholder="https://goalsfloors.com/about"
                    className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 dark:bg-slate-900 dark:text-white text-sm outline-none"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isInspecting}
                    className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium text-sm transition-colors flex items-center justify-center disabled:opacity-70"
                  >
                    {isInspecting ? <Loader2 size={18} className="animate-spin" /> : "Inspect"}
                  </button>
                </form>

                {inspectionData && (
                  <div className="mt-6 space-y-4">
                    {/* Smart Comparison Logic */}
                    {(() => {
                      // Normalize URLs by removing trailing slashes for better matching
                      const normalize = (u: string) => u.replace(/\/$/, "");
                      const normalizedInspectUrl = normalize(inspectUrl);
                      
                      const localRecord = indexedUrls.find(i => normalize(i.url) === normalizedInspectUrl);
                      
                      if (!localRecord) return null;

                      const lastCrawlTime = inspectionData.indexStatusResult?.lastCrawlTime;
                      const lastRequestedAt = localRecord.last_requested_at;

                      // It's stale if Google's last crawl is BEFORE our request, 
                      // OR if Google hasn't crawled it at all (missing lastCrawlTime)
                      const isStale = !lastCrawlTime || (new Date(lastCrawlTime) < new Date(lastRequestedAt));

                      console.log("SEO Debug:", {
                        inspectUrl: normalizedInspectUrl,
                        foundLocal: !!localRecord,
                        lastCrawlTime,
                        lastRequestedAt,
                        isStale
                      });

                      if (isStale) {
                        return (
                          <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-sm flex items-start gap-3">
                            <Activity className="w-5 h-5 flex-shrink-0 mt-0.5 animate-pulse" />
                            <div>
                              <p className="font-bold">Update Pending Google Crawl</p>
                              <p className="opacity-80">
                                You requested indexing on **{new Date(lastRequestedAt).toLocaleDateString()}**. 
                                {lastCrawlTime 
                                  ? `Google is still showing data from your last crawl on **${new Date(lastCrawlTime).toLocaleDateString()}**.`
                                  : "Google hasn't crawled this URL since your request."}
                              </p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })()}

                    {inspectionData.indexStatusResult?.coverageState === "Indexed" && (
                      <div className="p-4 rounded-xl border border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 text-sm flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold">Live & Synced! ✅</p>
                          <p className="opacity-80">Google has crawled your latest request and the page is fully indexed.</p>
                        </div>
                      </div>
                    )}

                    {/* ALWAYS show the Index Status Box */}
                    <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                      {inspectionData.indexStatusResult?.coverageState === "Indexed" ? (
                        <CheckCircle2 className="text-green-500 flex-shrink-0" size={24} />
                      ) : (
                        <XCircle className="text-red-500 flex-shrink-0" size={24} />
                      )}
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">Index Status</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{inspectionData.indexStatusResult?.coverageState || "Unknown"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                      {inspectionData.mobileUsabilityResult?.verdict === "PASS" ? (
                        <CheckCircle2 className="text-green-500 flex-shrink-0" size={24} />
                      ) : (
                        <XCircle className="text-amber-500 flex-shrink-0" size={24} />
                      )}
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">Mobile Usability</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{inspectionData.mobileUsabilityResult?.verdict === "PASS" ? "Page is mobile friendly" : "Issues detected"}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Image SEO Tab */}
        {activeTab === "image-seo" && (
          <ImageSeoTab imageQueries={imageQueries} />
        )}
      </div>
    </>
  );
}
