"use client";

import React from "react";
import dynamic from "next/dynamic";

const Catalog3DViewer = dynamic(() => import("./Catalog3DViewer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[650px] sm:h-[750px] bg-slate-100 dark:bg-slate-900/80 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-6 text-center transition-colors duration-300">
      <div className="w-12 h-12 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Loading 3D Catalog Engine...</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
        Initializing WebGL canvas and loading 3D architectural model with detachable swatches.
      </p>
    </div>
  ),
});

export default function SampleKitSection() {
  return <Catalog3DViewer />;
}
