import { BarChart3, Eye, MousePointerClick, Percent, Users } from 'lucide-react';
import AnalyticsChart, { type AnalyticsChartPoint } from '@/components/admin/analytics/AnalyticsChart';
import {
  getCoreMetrics,
  getDailyGraphData,
  getSearchConsoleData,
  getTopPages,
} from '@/lib/ga';

type TopPageRow = {
  page_path: string;
  views: number;
};

export default async function AdminDashboard() {
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - 29); // inclusive 30 days incl today
  const startDate = start.toISOString().slice(0, 10); // YYYY-MM-DD
  const endDate = now.toISOString().slice(0, 10); // YYYY-MM-DD

  const formatNumber = (val: number) => new Intl.NumberFormat('en-IN').format(val);
  const formatPercent = (val: number) => `${val.toFixed(1)}%`;

  const formatChartLabel = (iso: string) => {
    const d = new Date(`${iso}T00:00:00`);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  };

  const buildDateRange = (startIso: string, endIso: string) => {
    const points: Array<{ date: string; label: string; views: number }> = [];
    const startD = new Date(`${startIso}T00:00:00`);
    const endD = new Date(`${endIso}T00:00:00`);
    for (let d = new Date(startD); d <= endD; d.setDate(d.getDate() + 1)) {
      const iso = d.toISOString().slice(0, 10);
      points.push({ date: iso, label: formatChartLabel(iso), views: 0 });
    }
    return points;
  };

  let totalViews = 0;
  let totalActiveUsers = 0;
  let totalEvents = 0;
  let avgEngagementRate = 0;

  let chartData: AnalyticsChartPoint[] = buildDateRange(startDate, endDate);
  let topPages: TopPageRow[] = [];
  let errorMsg: string | null = null;
  let hasData = false;

  try {
    const [coreMetrics, dailyData, searchConsoleData, pages] = await Promise.all([
      getCoreMetrics(startDate, endDate),
      getDailyGraphData(startDate, endDate),
      getSearchConsoleData(startDate, endDate),
      getTopPages(startDate, endDate),
    ]);

    totalViews = coreMetrics.pageviews;
    totalActiveUsers = coreMetrics.totalUsers;
    totalEvents = searchConsoleData.clicks;
    avgEngagementRate = searchConsoleData.ctr * 100;

    const byDate = new Map<string, number>();
    for (const day of dailyData || []) {
      byDate.set(day.date, day.pageviews);
    }

    chartData = chartData.map((p) => ({
      ...p,
      views: byDate.get(p.date) || 0,
    }));

    topPages = (pages || [])
      .map((p) => ({ page_path: p.pagePath, views: p.pageviews }))
      .slice(0, 5);

    hasData = true;
  } catch (error: any) {
    console.error('Error fetching Google analytics dashboard data:', error);
    errorMsg = error.message || 'Unknown error occurred';
    hasData = false;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Analytics
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              A clean snapshot of the last 30 days (Real-time GA4).
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 shadow-sm border border-emerald-200/50 dark:border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse"></span>
              Live API Mode
            </span>
          </div>
        </div>
      </div>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 dark:border-slate-800 bg-white/60 dark:bg-slate-950/40 backdrop-blur p-12 shadow-sm text-center">
          <div className="h-12 w-12 rounded-full bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-500 mb-4">
            <BarChart3 size={24} />
          </div>
          <h3 className="text-lg font-semibold text-slate-950 dark:text-slate-50">
            Failed to load Google Analytics
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mt-2">
            Could not fetch live report data from Google Analytics. Please verify that your credentials (`GA_PROPERTY_ID`, `GOOGLE_REFRESH_TOKEN`, etc.) in `.env.local` are set correctly.
          </p>
          {errorMsg && (
            <p className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-500/5 px-3 py-1.5 rounded-lg font-mono mt-4">
              {errorMsg}
            </p>
          )}
        </div>
      ) : (
        <>
          {/* Section 1: Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/50 backdrop-blur shadow-sm p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Views</p>
                <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{formatNumber(totalViews)}</p>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">Last 30 Days</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-inner">
                <Eye size={22} />
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/50 backdrop-blur shadow-sm p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Active Users</p>
                <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{formatNumber(totalActiveUsers)}</p>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">Last 30 Days</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-inner">
                <Users size={22} />
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/50 backdrop-blur shadow-sm p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Avg Engagement Rate</p>
                <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{formatPercent(avgEngagementRate)}</p>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">Average (rows)</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner">
                <Percent size={22} />
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/50 backdrop-blur shadow-sm p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Events</p>
                <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{formatNumber(totalEvents)}</p>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">Last 30 Days</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center shadow-inner">
                <MousePointerClick size={22} />
              </div>
            </div>
          </div>

          {/* Section 2: Trend Chart */}
          <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/50 backdrop-blur shadow-sm p-5">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <BarChart3 size={18} className="text-amber-600 dark:text-amber-400" />
                Views Trend
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">Daily views across the last 30 days (Direct API)</p>
            </div>
            <div className="mt-4">
              <AnalyticsChart data={chartData} />
            </div>
          </div>

          {/* Section 3: Top Pages */}
          <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/50 backdrop-blur shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-200 dark:border-slate-800">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Top 5 Most Visited Pages</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">By total views (last 30 days)</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50/80 dark:bg-slate-900/40">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 dark:text-slate-300">Page</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-slate-600 dark:text-slate-300">Views</th>
                  </tr>
                </thead>
                <tbody>
                  {topPages.map((p) => (
                    <tr key={p.page_path} className="border-t border-gray-200 dark:border-slate-800">
                      <td className="px-5 py-3">
                        <span className="font-medium text-slate-900 dark:text-slate-100">{p.page_path}</span>
                      </td>
                      <td className="px-5 py-3 text-right font-semibold text-slate-900 dark:text-slate-100">
                        {formatNumber(p.views)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {topPages.length === 0 && (
              <div className="p-6 text-center text-slate-600 dark:text-slate-400">
                No page-level data available yet.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
