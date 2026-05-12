"use client";

import { CalendarRange, ChevronDown } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

type RangeOption = 'yesterday' | 'last-week' | 'last-30-days';

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getRange(option: RangeOption) {
  const end = new Date();
  const start = new Date(end);
  if (option === 'yesterday') {
    start.setDate(start.getDate() - 1);
    end.setDate(end.getDate() - 1);
  } else if (option === 'last-week') {
    start.setDate(start.getDate() - 6);
  } else {
    start.setDate(start.getDate() - 29);
  }

  return {
    startDate: toIsoDate(start),
    endDate: toIsoDate(end),
  };
}

function getPresetFromUrl(startDate: string | null, endDate: string | null): RangeOption {
  if (!startDate || !endDate) return 'last-30-days';

  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) return 'last-30-days';

  const diffDays = Math.round((end.getTime() - start.getTime()) / 86400000) + 1;
  if (diffDays === 1) return 'yesterday';
  if (diffDays === 7) return 'last-week';
  if (diffDays === 30) return 'last-30-days';

  return 'last-30-days';
}

const OPTIONS: Array<{ value: RangeOption; label: string }> = [
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last-week', label: 'Last Week' },
  { value: 'last-30-days', label: 'Last 30 Days' },
];

export default function DateRangeFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPreset = useMemo(
    () => getPresetFromUrl(searchParams.get('startDate'), searchParams.get('endDate')),
    [searchParams]
  );

  const applyPreset = (option: RangeOption) => {
    const { startDate, endDate } = getRange(option);
    const params = new URLSearchParams(searchParams.toString());
    params.set('startDate', startDate);
    params.set('endDate', endDate);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/50 backdrop-blur shadow-sm p-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CalendarRange size={18} className="text-amber-600 dark:text-amber-400" />
            Date Range
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Filter the analytics by a quick date preset.
          </p>
        </div>

        <div className="w-full md:w-auto flex items-center gap-3 flex-wrap">
          <label className="relative flex flex-col gap-1 w-full sm:w-[220px]">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Range</span>
            <select
              value={currentPreset}
              onChange={(e) => applyPreset(e.target.value as RangeOption)}
              className="h-11 w-full appearance-none rounded-xl border border-gray-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/60 pl-4 pr-10 text-sm font-medium text-slate-900 dark:text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            >
              {OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="pointer-events-none absolute right-3 top-[34px] text-slate-500 dark:text-slate-400" />
          </label>

          <div className="rounded-xl border border-amber-200/70 dark:border-amber-500/20 bg-amber-50/70 dark:bg-amber-500/10 px-4 py-2 text-xs text-amber-800 dark:text-amber-200">
            Uses URL params: <span className="font-semibold">startDate</span> + <span className="font-semibold">endDate</span>
          </div>
        </div>
      </div>
    </div>
  );
}
