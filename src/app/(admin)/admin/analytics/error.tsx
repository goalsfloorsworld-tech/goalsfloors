"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";

export default function AnalyticsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Analytics Error caught by Error Boundary:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="h-16 w-16 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-4 shadow-sm border border-red-100 dark:border-red-500/20">
        <AlertCircle size={32} />
      </div>
      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
        Failed to load analytics
      </h2>
      <p className="text-slate-600 dark:text-slate-400 max-w-md mb-6">
        There was an issue connecting to the Google Analytics Data API. This could be due to expired credentials or network issues.
      </p>
      <button
        onClick={() => reset()}
        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors font-medium shadow-sm"
      >
        <RefreshCcw size={16} />
        Try again
      </button>
    </div>
  );
}
