import { Clock3, Eye, MousePointerClick, Percent, Users } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import DateRangeFilter from '@/components/admin/DateRangeFilter';
import AnalyticsGraph, { type AnalyticsGraphPoint } from '@/components/admin/AnalyticsGraph';
import AnalyticsTableClient from '@/components/admin/AnalyticsTableClient';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

type SiteStatRow = {
  stat_date: string;
  page_path: string;
  views: number | null;
  active_users: number | null;
  engagement_rate: number | null;
  event_count: number | null;
  avg_time: number | null;
};

function pickParam(value: string | string[] | undefined) {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value[0];
  return undefined;
}

function isIsoDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function defaultLast30DaysRange() {
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - 29);
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
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

function normalizeDuration(seconds: number) {
  return Math.max(0, seconds || 0);
}

function formatDuration(seconds: number) {
  const total = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(total / 60);
  const remainingSeconds = total % 60;

  if (minutes <= 0) return `${remainingSeconds}s`;
  if (remainingSeconds === 0) return `${minutes}m`;
  return `${minutes}m ${remainingSeconds}s`;
}

export default async function AdminAnalyticsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  const rangeDefault = defaultLast30DaysRange();
  const startParam = pickParam(params.startDate);
  const endParam = pickParam(params.endDate);

  let startDate = rangeDefault.startDate;
  let endDate = rangeDefault.endDate;

  if (startParam && endParam && isIsoDate(startParam) && isIsoDate(endParam) && startParam <= endParam) {
    startDate = startParam;
    endDate = endParam;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  let rows: SiteStatRow[] = [];
  let totalViews = 0;
  let totalUsers = 0;
  let totalEvents = 0;
  let avgEngagementRate = 0;
  let totalAvgTime = 0;
  let graphData: AnalyticsGraphPoint[] = [];

  try {
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase env for site_stats. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
      throw new Error('Supabase env missing');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from('site_stats')
      .select('stat_date,page_path,views,active_users,engagement_rate,event_count,avg_time')
      .gte('stat_date', startDate)
      .lte('stat_date', endDate)
      .order('stat_date', { ascending: false });

    if (error) throw error;

    rows = (data || []) as SiteStatRow[];

    let engagementSum = 0;
    let engagementCount = 0;
    const dailyMap = new Map<string, { views: number; users: number; avgTimeSum: number; avgTimeCount: number }>();

    const start = new Date(`${startDate}T00:00:00Z`);
    const end = new Date(`${endDate}T00:00:00Z`);
    for (const cursor = new Date(start); cursor <= end; cursor.setDate(cursor.getDate() + 1)) {
      const dateKey = cursor.toISOString().slice(0, 10);
      dailyMap.set(dateKey, { views: 0, users: 0, avgTimeSum: 0, avgTimeCount: 0 });
    }

    for (const r of rows) {
      const views = typeof r.views === 'number' ? r.views : 0;
      const users = typeof r.active_users === 'number' ? r.active_users : 0;
      const events = typeof r.event_count === 'number' ? r.event_count : 0;
      const engagement = typeof r.engagement_rate === 'number' ? r.engagement_rate : null;
      const avgTime = typeof r.avg_time === 'number' ? normalizeDuration(r.avg_time) : 0;

      totalViews += views;
      totalUsers += users;
      totalEvents += events;
      totalAvgTime += avgTime;

      if (engagement !== null) {
        engagementSum += normalizeEngagementToPercent(engagement);
        engagementCount += 1;
      }

      if (r.stat_date) {
        const day = dailyMap.get(r.stat_date) || { views: 0, users: 0, avgTimeSum: 0, avgTimeCount: 0 };
        day.views += views;
        day.users += users;
        day.avgTimeSum += avgTime;
        day.avgTimeCount += typeof r.avg_time === 'number' ? 1 : 0;
        dailyMap.set(r.stat_date, day);
      }
    }

    avgEngagementRate = engagementCount > 0 ? engagementSum / engagementCount : 0;

    graphData = Array.from(dailyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, value]) => ({
        date,
        label: formatNiceDate(date),
        views: value.views,
        users: value.users,
        avgTime: value.avgTimeCount > 0 ? value.avgTimeSum / value.avgTimeCount : 0,
      }));
  } catch (error) {
    console.error('Error fetching site_stats:', error);
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Detailed Analytics
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Showing data from <span className="font-semibold">{formatNiceDate(startDate)}</span> to{' '}
              <span className="font-semibold">{formatNiceDate(endDate)}</span>.
            </p>
          </div>
        </div>
      </div>

      <DateRangeFilter />

      <AnalyticsGraph data={graphData} />

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/50 backdrop-blur shadow-sm p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Views</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{formatNumber(totalViews)}</p>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">Selected range</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-inner">
            <Eye size={22} />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/50 backdrop-blur shadow-sm p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Users</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{formatNumber(totalUsers)}</p>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">Selected range</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-inner">
            <Users size={22} />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/50 backdrop-blur shadow-sm p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Avg Engagement Rate</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{avgEngagementRate.toFixed(1)}%</p>
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
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">Selected range</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center shadow-inner">
            <MousePointerClick size={22} />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/50 backdrop-blur shadow-sm p-5 flex items-center justify-between sm:col-span-2 xl:col-span-4">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Average Time</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{formatDuration(totalAvgTime / Math.max(rows.length, 1))}</p>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">Daily average (rows)</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center shadow-inner">
            <Clock3 size={22} />
          </div>
        </div>
      </div>

      <AnalyticsTableClient rows={rows} />
    </div>
  );
}
