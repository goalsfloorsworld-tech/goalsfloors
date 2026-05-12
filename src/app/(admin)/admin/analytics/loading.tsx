"use client";

import { Loader2 } from "lucide-react";

export default function AnalyticsLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-2">
        <div className="h-10 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
        <div className="h-5 w-80 bg-slate-100 dark:bg-slate-800/50 rounded-md animate-pulse mt-1" />
      </div>

      {/* Date Filter Skeleton */}
      <div className="h-12 w-[300px] bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />

      {/* Main Graph Skeleton */}
      <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/50 p-5 h-[420px] flex items-center justify-center">
        <div className="flex flex-col items-center text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p className="text-sm">Loading graph data...</p>
        </div>
      </div>

      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/50 p-4 md:p-5 flex items-center justify-between">
            <div className="space-y-3">
              <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
              <div className="h-6 w-12 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
              <div className="h-2 w-14 bg-slate-100 dark:bg-slate-800/50 rounded animate-pulse" />
            </div>
            <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse shrink-0" />
          </div>
        ))}
        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/50 p-4 md:p-5 flex items-center justify-between col-span-2 sm:col-span-2 xl:col-span-4">
          <div className="space-y-3">
            <div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
            <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
            <div className="h-2 w-28 bg-slate-100 dark:bg-slate-800/50 rounded animate-pulse" />
          </div>
          <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse shrink-0" />
        </div>
      </div>

      {/* Main Table Skeleton */}
      <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/50 overflow-hidden h-[400px]">
        <div className="p-5 border-b border-gray-200 dark:border-slate-800">
          <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        </div>
        <div className="p-5 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 w-full bg-slate-100 dark:bg-slate-800/50 rounded animate-pulse" />
          ))}
        </div>
      </div>

      {/* Bottom Two Tables Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/50 overflow-hidden h-[300px]">
            <div className="p-5 border-b border-gray-200 dark:border-slate-800">
              <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
            </div>
            <div className="p-5 space-y-4">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="h-8 w-full bg-slate-100 dark:bg-slate-800/50 rounded animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
