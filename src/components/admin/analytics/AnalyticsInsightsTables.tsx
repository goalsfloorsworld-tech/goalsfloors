"use client";

import { useState } from 'react';

type TrafficSourceRow = {
  source: string;
  totalUsers: number;
  sessions: number;
  pageviews: number;
};

type TopPageRow = {
  pagePath: string;
  pageviews: number;
  totalUsers: number;
};

type Props = {
  trafficSources: TrafficSourceRow[];
  topPages: TopPageRow[];
};

function formatNumber(val: number) {
  return new Intl.NumberFormat('en-IN').format(val);
}

export default function AnalyticsInsightsTables({ trafficSources, topPages }: Props) {
  const [showAllSources, setShowAllSources] = useState(false);
  const [showAllPages, setShowAllPages] = useState(false);

  const displayedSources = showAllSources ? trafficSources : trafficSources.slice(0, 10);
  const displayedPages = showAllPages ? topPages : topPages.slice(0, 10);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Traffic Sources */}
      <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/50 backdrop-blur shadow-sm overflow-hidden flex flex-col">
        <div className="p-5 border-b border-gray-200 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Traffic Sources</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Where sessions originate during this range.</p>
        </div>
        <div className="overflow-x-auto flex-grow">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/80 dark:bg-slate-900/40">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 dark:text-slate-300">Source</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">Users</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">Pageviews</th>
              </tr>
            </thead>
            <tbody>
              {trafficSources.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-5 py-6 text-center text-slate-600 dark:text-slate-400">
                    No traffic source data available.
                  </td>
                </tr>
              ) : (
                displayedSources.map((row, idx) => (
                  <tr key={`${row.source}-${idx}`} className="border-t border-gray-200 dark:border-slate-800">
                    <td className="px-5 py-3 max-w-[220px] truncate text-slate-900 dark:text-slate-100 font-medium">
                      {row.source}
                    </td>
                    <td className="px-5 py-3 text-right text-slate-900 dark:text-slate-100 font-semibold">
                      {formatNumber(row.totalUsers)}
                    </td>
                    <td className="px-5 py-3 text-right text-slate-700 dark:text-slate-200">
                      {formatNumber(row.pageviews)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {trafficSources.length > 10 && (
          <div className="p-3 border-t border-gray-200 dark:border-slate-800 bg-gray-50/30 dark:bg-slate-900/20 text-center">
            <button
              onClick={() => setShowAllSources(!showAllSources)}
              className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
            >
              {showAllSources ? 'Show less' : `Show all ${trafficSources.length} sources`}
            </button>
          </div>
        )}
      </div>

      {/* Top Pages */}
      <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/50 backdrop-blur shadow-sm overflow-hidden flex flex-col">
        <div className="p-5 border-b border-gray-200 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Top Pages</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Most viewed pages in this window.</p>
        </div>
        <div className="overflow-x-auto flex-grow">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/80 dark:bg-slate-900/40">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 dark:text-slate-300">Page Path</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">Pageviews</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">Users</th>
              </tr>
            </thead>
            <tbody>
              {topPages.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-5 py-6 text-center text-slate-600 dark:text-slate-400">
                    No top page data available.
                  </td>
                </tr>
              ) : (
                displayedPages.map((row, idx) => (
                  <tr key={`${row.pagePath}-${idx}`} className="border-t border-gray-200 dark:border-slate-800">
                    <td className="px-5 py-3 max-w-[220px] truncate text-slate-900 dark:text-slate-100 font-medium">
                      {row.pagePath === '/' ? '/' : `/${row.pagePath.split('/').filter(Boolean).pop()}`}
                    </td>
                    <td className="px-5 py-3 text-right text-slate-900 dark:text-slate-100 font-semibold">
                      {formatNumber(row.pageviews)}
                    </td>
                    <td className="px-5 py-3 text-right text-slate-700 dark:text-slate-200">
                      {formatNumber(row.totalUsers)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {topPages.length > 10 && (
          <div className="p-3 border-t border-gray-200 dark:border-slate-800 bg-gray-50/30 dark:bg-slate-900/20 text-center">
            <button
              onClick={() => setShowAllPages(!showAllPages)}
              className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
            >
              {showAllPages ? 'Show less' : `Show all ${topPages.length} pages`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
