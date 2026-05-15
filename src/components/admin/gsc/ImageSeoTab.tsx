"use client";

import React, { useState, useEffect } from "react";
import { Image as ImageIcon, Search, HardDrive, AlertTriangle, Loader2, ArrowRight, CheckCircle2, X } from "lucide-react";
import type { QueryRow } from "@/lib/seo";
import { getMissingAltImages, getMediaAuditStats } from "@/actions/image-seo";

type Props = {
  imageQueries: QueryRow[];
};

export default function ImageSeoTab({ imageQueries }: Props) {
  const [missingAltImages, setMissingAltImages] = useState<{ blogId: string; blogTitle: string; slug: string; imageSrc: string; source: 'Supabase' | 'WordPress'; issueType: string }[]>([]);
  const [mediaStats, setMediaStats] = useState<{ seoImageUrls: string[]; storageImageCount: number; totalSizeMB: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAllQueries, setShowAllQueries] = useState(false);
  const [isExplorerOpen, setIsExplorerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredImageUrls = mediaStats?.seoImageUrls?.filter(url => url.toLowerCase().includes(searchQuery.toLowerCase())) || [];

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [altImages, stats] = await Promise.all([
          getMissingAltImages(),
          getMediaAuditStats(),
        ]);
        setMissingAltImages(altImages);
        setMediaStats(stats as any);
      } catch (error) {
        console.error("Error fetching Image SEO data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      {/* Top Header & Quick Stats */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-2 flex flex-col justify-center">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
            <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
              <ImageIcon className="text-white w-6 h-6" />
            </div>
            Image SEO Analytics
          </h2>
          <p className="text-slate-500 mt-2 text-sm max-w-md">
            Monitor search performance and audit media health. Deleting images is not recommended as some are bound to UI components.
          </p>
        </div>

        {/* Media Audit Stats - Now 3 Columns */}
        <div className="xl:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div 
            onClick={() => { if (mediaStats?.seoImageUrls?.length) setIsExplorerOpen(true); }}
            className={`bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group ${mediaStats?.seoImageUrls?.length ? 'cursor-pointer hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all' : ''}`}
          >
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <Search size={40} className="text-indigo-600" />
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">SEO Images (Indexed)</p>
            {isLoading ? (
              <div className="h-8 w-16 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-md mt-2" />
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white leading-none">
                  {mediaStats?.seoImageUrls?.length || 0}
                </span>
                <span className="text-[10px] font-medium text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded">Sitemap</span>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <ImageIcon size={40} className="text-indigo-600" />
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Storage Files</p>
            {isLoading ? (
              <div className="h-8 w-16 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-md mt-2" />
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white leading-none">
                  {mediaStats?.storageImageCount || 0}
                </span>
                <span className="text-[10px] font-medium text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 rounded">Supabase</span>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <HardDrive size={40} className="text-indigo-600" />
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Storage Size</p>
            {isLoading ? (
              <div className="h-8 w-24 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-md mt-2" />
            ) : (
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900 dark:text-white leading-none">
                  {mediaStats?.totalSizeMB || "0.00"}
                </span>
                <span className="text-sm font-bold text-slate-500 uppercase">MB</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Section 1: Google Image Traffic - Left Column (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-50/50 to-white dark:from-slate-900/50 dark:to-slate-900">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                <Search size={16} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white">Image Search Terms</h3>
            </div>
          </div>
          
          <div className="overflow-x-auto min-h-[400px]">
            {imageQueries.length === 0 ? (
              <div className="p-20 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-4">
                  <ImageIcon size={32} className="text-slate-300 dark:text-slate-600" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">No search data yet</h4>
                <p className="text-sm text-slate-500 max-w-xs mt-1">
                  Google hasn't reported any image search clicks for your site in the last 30 days.
                </p>
              </div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50/50 dark:bg-slate-800/30 text-slate-400 uppercase text-[10px] font-black tracking-widest border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="px-8 py-4">Query Keyword</th>
                    <th className="px-6 py-4 text-center">Clicks</th>
                    <th className="px-6 py-4 text-center">Impressions</th>
                    <th className="px-8 py-4 text-right">Avg Position</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {(showAllQueries ? imageQueries : imageQueries.slice(0, 10)).map((row, i) => (
                    <tr key={i} className="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors group">
                      <td className="px-8 py-4 font-bold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {row.keys[0]}
                      </td>
                      <td className="px-6 py-4 text-center font-medium text-slate-600 dark:text-slate-400">{row.clicks}</td>
                      <td className="px-6 py-4 text-center font-medium text-slate-600 dark:text-slate-400">{row.impressions}</td>
                      <td className="px-8 py-4 text-right">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          #{row.position.toFixed(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
              {!showAllQueries && imageQueries.length > 10 && (
                <button 
                  onClick={() => setShowAllQueries(true)}
                  className="w-full py-4 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors border-t border-slate-100 dark:border-slate-800"
                >
                  Show More (+{imageQueries.length - 10} terms)
                </button>
              )}
          </div>
        </div>

        {/* Section 2: SEO Health Checker - Right Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden h-full flex flex-col">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-amber-50/30 dark:bg-amber-900/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <AlertTriangle size={16} className="text-amber-600 dark:text-amber-500" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white tracking-tight">Alt Text Audit</h3>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
              {isLoading ? (
                <div className="space-y-4 py-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4 animate-pulse">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex-shrink-0" />
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-3/4" />
                        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : missingAltImages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white">All Images Optimized</h4>
                  <p className="text-sm text-slate-500 mt-1 px-4">
                    Every image in your blogs has a descriptive alt tag. Great for SEO!
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black text-amber-600 dark:text-amber-500 uppercase tracking-widest bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded">
                      {missingAltImages.length} Issues Found
                    </span>
                  </div>
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 no-scrollbar">
                    {missingAltImages.map((item, idx) => (
                      <div key={idx} className="group p-3 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900 bg-white dark:bg-slate-900 transition-all hover:shadow-md relative">
                        {/* Source Badge */}
                        <div className="absolute top-2 right-2 flex items-center">
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                            item.source === 'WordPress' 
                              ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
                              : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                          }`}>
                            {item.source}
                          </span>
                        </div>
                        
                        <div className="flex gap-4 mt-2">
                          <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 flex-shrink-0 overflow-hidden relative border border-slate-100 dark:border-slate-800">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.imageSrc} alt="Thumbnail" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-bold text-slate-800 dark:text-slate-200 truncate leading-snug pr-8" title={item.blogTitle}>
                              {item.blogTitle}
                            </p>
                            <p className="text-[11px] font-medium text-amber-600 dark:text-amber-500 mt-0.5 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> {item.issueType || 'Missing "alt" attribute'}
                            </p>
                            <a 
                              href={
                                item.source === 'WordPress' 
                                  ? `https://lime-hummingbird-549929.hostingersite.com/wp-admin/post.php?post=${item.blogId}&action=edit`
                                  : `/admin/write-blog?edit=${item.slug}`
                              } 
                              target={item.source === 'WordPress' ? '_blank' : '_self'}
                              rel={item.source === 'WordPress' ? 'noopener noreferrer' : ''}
                              className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:gap-2 transition-all"
                            >
                              Fix Alt Text <ArrowRight className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SEO Image Explorer Modal */}
      {isExplorerOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-5xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                  <Search size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">SEO Image Explorer</h3>
                  <p className="text-xs text-slate-500">{mediaStats?.seoImageUrls?.length || 0} Images indexed in Sitemap</p>
                </div>
              </div>
              <button 
                onClick={() => setIsExplorerOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Search Sticky Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Search by image URL or name..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50 dark:bg-slate-900">
              {filteredImageUrls.length === 0 ? (
                <div className="py-20 text-center flex flex-col items-center">
                  <Search className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
                  <p className="text-slate-500">No images match your search.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredImageUrls.map((url, idx) => {
                    // Extract filename from URL for better display
                    const filename = url.split('/').pop()?.split('?')[0] || url;
                    
                    return (
                      <div key={idx} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="aspect-video w-full bg-slate-100 dark:bg-slate-900 relative overflow-hidden flex items-center justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={url} 
                            alt={filename} 
                            loading="lazy" 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              // Fallback for broken images
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM5NDkzYjgiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHg9IjMiIHk9IjMiIHJ4PSIyIiByeT0iMiIvPjxjaXJjbGUgY3g9IjgiLjUiIGN5PSI4LjUiIHI9IjEuNSIvPjxwb2x5Z29uIHBvaW50cz0iMjEgMTUgMTYgMTAgNSAyMSIvPjwvc3ZnPg==';
                              (e.target as HTMLImageElement).className = 'w-8 h-8 opacity-20';
                            }}
                          />
                        </div>
                        <div className="p-3 border-t border-slate-100 dark:border-slate-700">
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate" title={url}>
                            {filename}
                          </p>
                          <a 
                            href={url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline mt-1 inline-block truncate w-full"
                          >
                            Open Original &rarr;
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
