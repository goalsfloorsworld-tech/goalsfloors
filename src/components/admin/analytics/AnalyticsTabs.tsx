"use client";

import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';
import { BarChart3, Users, MousePointerClick } from 'lucide-react';

const TABS = [
  { id: 'overview', label: 'Overview', icon: <BarChart3 size={16} /> },
  { id: 'audience', label: 'Audience', icon: <Users size={16} /> },
  { id: 'behavior', label: 'Behavior', icon: <MousePointerClick size={16} /> },
];

export default function AnalyticsTabs() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const currentTab = searchParams.get('tab') || 'overview';
  
  // Create a function to preserve other search params like startDate and endDate
  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    return params.toString();
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-gray-200 dark:border-slate-800 mb-6">
      {TABS.map((tab) => {
        const isActive = currentTab === tab.id;
        return (
          <Link
            key={tab.id}
            href={`${pathname}?${createQueryString('tab', tab.id)}`}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors border-b-2 whitespace-nowrap ${
              isActive
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20'
                : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            {tab.icon}
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
