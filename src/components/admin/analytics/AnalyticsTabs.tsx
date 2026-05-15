"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { BarChart3, Users, MousePointerClick, Loader2 } from 'lucide-react';

const TABS = [
  { id: 'overview', label: 'Overview', icon: <BarChart3 size={16} /> },
  { id: 'audience', label: 'Audience', icon: <Users size={16} /> },
  { id: 'behavior', label: 'Behavior', icon: <MousePointerClick size={16} /> },
];

export default function AnalyticsTabs() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [isPendingTab, setIsPendingTab] = useState<string | null>(null);
  
  const currentTab = searchParams.get('tab') || 'overview';
  
  // Create a function to preserve other search params like startDate and endDate
  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    return params.toString();
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-gray-200 dark:border-slate-800 mb-6 whitespace-nowrap scroll-smooth">
      {TABS.map((tab) => {
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => {
              if (currentTab === tab.id) return;
              setIsPendingTab(tab.id);
              // Small delay to allow spinner to render before main thread is blocked by navigation
              setTimeout(() => {
                router.push(`${pathname}?${createQueryString('tab', tab.id)}`);
                // Assume fast navigation, clear spinner shortly after
                setTimeout(() => setIsPendingTab(null), 300);
              }, 50);
            }}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors border-b-2 whitespace-nowrap ${
              isActive
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20'
                : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            {isPendingTab === tab.id ? <Loader2 className="w-4 h-4 animate-spin" /> : tab.icon}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
