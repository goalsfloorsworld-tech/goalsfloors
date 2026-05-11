import { BarChart3, Eye, MousePointerClick, Percent, Users } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import AnalyticsChart, { type AnalyticsChartPoint } from '@/components/admin/AnalyticsChart';

type SiteStatRow = {
  stat_date: string;
  page_path: string;
  views: number | null;
  active_users: number | null;
  engagement_rate: number | null;
  event_count: number | null;
  last_updated: string | null;
};

type TopPageRow = {
  page_path: string;
  views: number;
};

export default async function AdminDashboard() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    '';

  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - 29); // inclusive 30 days incl today
  const startDate = start.toISOString().slice(0, 10); // YYYY-MM-DD
  const endDate = now.toISOString().slice(0, 10); // YYYY-MM-DD

  const formatNumber = (val: number) => new Intl.NumberFormat('en-IN').format(val);
  const formatPercent = (val: number) => `${val.toFixed(1)}%`;

  const formatLatestSync = (iso: string) => {
    const syncedAt = new Date(iso);
    const diffMs = Date.now() - syncedAt.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 2) return 'Synced just now';
    if (diffMins < 60) return `Synced ${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Synced ${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `Last sync ${diffDays}d ago`;
  };

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

  let rows: SiteStatRow[] = [];
  let latestSyncText: string | null = null;
  let latestSyncIso: string | null = null;

  let totalViews = 0;
  let totalActiveUsers = 0;
  let totalEvents = 0;
  let avgEngagementRate = 0;

  let chartData: AnalyticsChartPoint[] = buildDateRange(startDate, endDate);
  let topPages: TopPageRow[] = [];

  try {
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase env for site_stats. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
      throw new Error('Supabase env missing');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch last 30 days of stats
    const { data, error } = await supabase
      .from('site_stats')
      .select('stat_date,page_path,views,active_users,engagement_rate,event_count,last_updated')
      .gte('stat_date', startDate);

    if (error) throw error;
    rows = (data || []) as SiteStatRow[];

    if (rows.length > 0) {
      // Latest sync info
      latestSyncIso = rows
        .map((r) => r.last_updated)
        .filter((v): v is string => Boolean(v))
        .sort((a, b) => (a < b ? 1 : -1))[0] || null;
      if (latestSyncIso) latestSyncText = formatLatestSync(latestSyncIso);

      // Metric aggregates (over last 30 days)
      let engagementSum = 0;
      let engagementCount = 0;

      const byDate = new Map<string, number>();
      const byPage = new Map<string, number>();

      for (const r of rows) {
        const v = typeof r.views === 'number' ? r.views : 0;
        const au = typeof r.active_users === 'number' ? r.active_users : 0;
        const ev = typeof r.event_count === 'number' ? r.event_count : 0;
        const er = typeof r.engagement_rate === 'number' ? r.engagement_rate : null;

        totalViews += v;
        totalActiveUsers += au;
        totalEvents += ev;

        if (er !== null) {
          // engagement_rate appears as fraction (0-1). Normalize to percent later.
          engagementSum += er;
          engagementCount += 1;
        }

        // Views grouped by stat_date for chart
        if (r.stat_date) {
          byDate.set(r.stat_date, (byDate.get(r.stat_date) || 0) + v);
        }

        // Top pages by total views
        if (r.page_path) {
          byPage.set(r.page_path, (byPage.get(r.page_path) || 0) + v);
        }
      }

      avgEngagementRate = engagementCount > 0 ? (engagementSum / engagementCount) * 100 : 0;

      chartData = chartData.map((p) => ({
        ...p,
        views: byDate.get(p.date) || 0,
      }));

      topPages = Array.from(byPage.entries())
        .map(([page_path, views]) => ({ page_path, views }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 5);
    }
  } catch (error) {
    console.error('Error fetching site_stats:', error);
    // graceful fallbacks already set
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Analytics
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              A clean snapshot of the last 30 days.
            </p>
          </div>
          {latestSyncText && (
            <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 backdrop-blur px-4 py-2 shadow-sm">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Data status</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{latestSyncText}</p>
            </div>
          )}
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 dark:border-slate-800 bg-white/60 dark:bg-slate-950/40 backdrop-blur p-10 shadow-sm">
          <p className="text-center text-slate-600 dark:text-slate-400 font-medium">
            No analytics data available yet.
          </p>
          <p className="text-center text-xs text-slate-500 dark:text-slate-500 mt-2">
            Once your sync populates the `site_stats` table, metrics and charts will appear here.
          </p>
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
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <BarChart3 size={18} className="text-amber-600 dark:text-amber-400" />
                  Views Trend
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">Daily views across the last 30 days</p>
              </div>
              {latestSyncIso && (
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  Latest sync: {new Date(latestSyncIso).toLocaleString('en-IN')}
                </p>
              )}
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
