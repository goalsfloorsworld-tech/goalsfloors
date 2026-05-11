"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

type SiteStatRow = {
  stat_date: string;
  page_path: string;
  views: number | null;
  active_users: number | null;
  engagement_rate: number | null;
  event_count: number | null;
};

type SortKey = 'views' | 'active_users' | 'event_count' | null;
type SortDirection = 'asc' | 'desc';

type Props = {
  rows: SiteStatRow[];
};

function sortLabel(key: SortKey, direction: SortDirection) {
  if (!key) return <ArrowUpDown size={14} className="opacity-70" />;
  return direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
}

function formatNumber(val: number) {
  return new Intl.NumberFormat('en-IN').format(val);
}

function formatNiceDate(iso: string) {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${iso}T00:00:00Z`));
}

function normalizeEngagementToPercent(value: number) {
  return value <= 1 ? value * 100 : value;
}

export default function AnalyticsTableClient({ rows }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const filteredRows = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return rows;

    return rows.filter((row) => row.page_path.toLowerCase().includes(query));
  }, [rows, searchQuery]);

  const sortedRows = useMemo(() => {
    if (!sortKey) return filteredRows;

    const sorted = [...filteredRows].sort((a, b) => {
      const aValue = typeof a[sortKey] === 'number' ? (a[sortKey] as number) : 0;
      const bValue = typeof b[sortKey] === 'number' ? (b[sortKey] as number) : 0;
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });

    return sorted;
  }, [filteredRows, sortKey, sortDirection]);

  const handleSort = (key: Exclude<SortKey, null>) => {
    if (sortKey === key) {
      setSortDirection((current) => (current === 'desc' ? 'asc' : 'desc'));
      return;
    }

    setSortKey(key);
    setSortDirection('desc');
  };

  const renderSortButton = (label: string, key: Exclude<SortKey, null>) => (
    <button
      type="button"
      onClick={() => handleSort(key)}
      className="inline-flex items-center justify-end gap-1.5 w-full group"
    >
      <span>{label}</span>
      <span className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors">
        {sortLabel(sortKey === key ? key : null, sortKey === key ? sortDirection : 'desc')}
      </span>
    </button>
  );

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/50 backdrop-blur shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Raw Stats</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Rows: <span className="font-semibold">{formatNumber(rows.length)}</span>
              {searchQuery.trim() ? (
                <>
                  {' '}
                  · Showing <span className="font-semibold">{formatNumber(sortedRows.length)}</span> match(es)
                </>
              ) : null}
            </p>
          </div>
        </div>

        <div className="relative w-full max-w-xl">
          <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by page path..."
            className="h-11 w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/60 pl-11 pr-4 text-sm text-slate-900 dark:text-slate-100 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          />
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="p-10 text-center">
          <p className="text-slate-600 dark:text-slate-400 font-medium">
            No data found for the selected date range.
          </p>
        </div>
      ) : sortedRows.length === 0 ? (
        <div className="p-10 text-center">
          <p className="text-slate-600 dark:text-slate-400 font-medium">
            No pages match your search.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/80 dark:bg-slate-900/40">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 dark:text-slate-300">Page Path</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">
                  {renderSortButton('Views', 'views')}
                </th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">
                  {renderSortButton('Active Users', 'active_users')}
                </th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">Engagement</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">
                  {renderSortButton('Events', 'event_count')}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedRows.map((r, idx) => {
                const views = typeof r.views === 'number' ? r.views : 0;
                const users = typeof r.active_users === 'number' ? r.active_users : 0;
                const events = typeof r.event_count === 'number' ? r.event_count : 0;
                const engagement = typeof r.engagement_rate === 'number' ? normalizeEngagementToPercent(r.engagement_rate) : 0;

                return (
                  <tr
                    key={`${r.stat_date}-${r.page_path}-${idx}`}
                    className="border-t border-gray-200 dark:border-slate-800 hover:bg-gray-50/70 dark:hover:bg-slate-900/40 transition-colors"
                  >
                    <td className="px-5 py-3 whitespace-nowrap text-slate-700 dark:text-slate-200">
                      {formatNiceDate(r.stat_date)}
                    </td>
                    <td className="px-5 py-3">
                      <span className="block max-w-[380px] truncate font-medium text-slate-900 dark:text-slate-100">
                        {r.page_path}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right font-semibold text-slate-900 dark:text-slate-100">
                      {formatNumber(views)}
                    </td>
                    <td className="px-5 py-3 text-right text-slate-700 dark:text-slate-200">
                      {formatNumber(users)}
                    </td>
                    <td className="px-5 py-3 text-right text-slate-700 dark:text-slate-200">
                      {engagement.toFixed(1)}%
                    </td>
                    <td className="px-5 py-3 text-right text-slate-700 dark:text-slate-200">
                      {formatNumber(events)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
