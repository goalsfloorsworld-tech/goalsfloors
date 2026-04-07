"use client";

import React, { useEffect, useState } from 'react';
import MasterDetailLayout from '@/components/ui-demo/MasterDetailLayout';
import GridDrawerLayout from '@/components/ui-demo/GridDrawerLayout';
import VariantTabsLayout from '@/components/ui-demo/VariantTabsLayout';

export default function UIDemoPage() {
  const [activeLayout, setActiveLayout] = useState<'master-detail' | 'grid-drawer' | 'variant-tabs'>('variant-tabs');

  useEffect(() => {
    document.body.classList.add('scrollbar-hide');
    document.documentElement.classList.add('scrollbar-hide');

    return () => {
      document.body.classList.remove('scrollbar-hide');
      document.documentElement.classList.remove('scrollbar-hide');
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 font-sans overflow-x-hidden">
      {/* Top Testing Navigation Bar */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800 p-4 sticky top-0 z-50 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm font-bold text-gray-500 uppercase tracking-widest pl-4">Client Presentation</div>
        
        <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-full border border-gray-200 dark:border-gray-700">
           <button
            onClick={() => setActiveLayout('master-detail')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
              activeLayout === 'master-detail' 
                ? 'bg-amber-500 text-white shadow-sm' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            1. Master Detail
          </button>
          
          <button
            onClick={() => setActiveLayout('grid-drawer')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
              activeLayout === 'grid-drawer' 
                ? 'bg-amber-500 text-white shadow-sm' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            2. Grid Drawer
          </button>
          
          <button
            onClick={() => setActiveLayout('variant-tabs')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
              activeLayout === 'variant-tabs' 
                ? 'bg-amber-500 text-white shadow-sm' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            3. Variant Tabs
          </button>
        </div>
      </div>

      {/* Render Active Layout */}
      <div className="w-full">
        {activeLayout === 'master-detail' && <MasterDetailLayout />}
        {activeLayout === 'grid-drawer' && <GridDrawerLayout />}
        {activeLayout === 'variant-tabs' && <VariantTabsLayout />}
      </div>
    </div>
  );
}
