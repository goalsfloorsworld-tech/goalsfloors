import { Clock3, Eye, MousePointerClick, Percent, Users } from 'lucide-react';
import DateRangeFilter from '@/components/admin/analytics/DateRangeFilter';
import AnalyticsGraph, { type AnalyticsGraphPoint } from '@/components/admin/analytics/AnalyticsGraph';
import AnalyticsTableClient from '@/components/admin/analytics/AnalyticsTableClient';
import AnalyticsInsightsTables from '@/components/admin/analytics/AnalyticsInsightsTables';
import AnalyticsTabs from '@/components/admin/analytics/AnalyticsTabs';
import {
  getCoreMetrics,
  getDailyGraphData,
  getSearchConsoleData,
  getTrafficSources,
  getTopPages,
} from '@/lib/ga';
import {
  getDeviceData,
  getGeoData,
  getUserTypeData,
  getEventData,
} from '@/lib/ga-advanced';
import AudienceView from '@/components/admin/analytics/AudienceView';
import BehaviorView from '@/components/admin/analytics/BehaviorView';

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

type DailyGraphRow = {
  date: string;
  pageviews?: number | null;
  totalUsers?: number | null;
  views?: number | null;
  users?: number | null;
  avgTime?: number | null;
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

  const currentTab = pickParam(params.tab) || 'overview';

  let rows: SiteStatRow[] = [];
  let totalViews = 0;
  let totalUsers = 0;
  let totalEvents = 0;
  let avgEngagementRate = 0;
  let totalAvgTime = 0;
  let graphData: AnalyticsGraphPoint[] = [];
  let trafficSources: Awaited<ReturnType<typeof getTrafficSources>> = [];
  let topPages: Awaited<ReturnType<typeof getTopPages>> = [];
  let searchConsoleSummary = { clicks: 0, impressions: 0, ctr: 0 };
  
  // Advanced Data
  let deviceData: Awaited<ReturnType<typeof getDeviceData>> = [];
  let geoData: Awaited<ReturnType<typeof getGeoData>> = [];
  let userTypeData: Awaited<ReturnType<typeof getUserTypeData>> = [];
  let eventData: Awaited<ReturnType<typeof getEventData>> = [];

  try {
    if (currentTab === 'overview') {
      const [coreMetrics, dailyData, searchConsoleData, sources, pages] = await Promise.all([
        getCoreMetrics(startDate, endDate),
        getDailyGraphData(startDate, endDate),
        getSearchConsoleData(startDate, endDate),
        getTrafficSources(startDate, endDate),
        getTopPages(startDate, endDate),
      ]);

      const normalizedDaily = (dailyData || []) as DailyGraphRow[];

      graphData = normalizedDaily.map((day) => {
        const views = day.pageviews ?? day.views ?? 0;
        const users = day.totalUsers ?? day.users ?? 0;
        const avgTime = day.avgTime ?? 0;

        return {
          date: day.date,
          label: formatNiceDate(day.date),
          views,
          users,
          avgTime,
        };
      });

      rows = normalizedDaily.map((day) => {
        const views = day.pageviews ?? day.views ?? 0;
        const users = day.totalUsers ?? day.users ?? 0;
        const avgTime = day.avgTime ?? 0;

        return {
          stat_date: day.date,
          page_path: '/',
          views,
          active_users: users,
          engagement_rate: 0,
          event_count: 0,
          avg_time: avgTime,
        };
      });

      totalViews = coreMetrics.pageviews;
      totalUsers = coreMetrics.totalUsers;
      totalEvents = Math.round(searchConsoleData.clicks);
      avgEngagementRate = normalizeEngagementToPercent(searchConsoleData.ctr);
      totalAvgTime = normalizedDaily.reduce((sum, day) => sum + (day.avgTime ?? 0), 0);

      trafficSources = sources;
      topPages = pages;
      searchConsoleSummary = searchConsoleData;
    } else if (currentTab === 'audience') {
      const [device, geo, userType] = await Promise.all([
        getDeviceData(startDate, endDate),
        getGeoData(startDate, endDate),
        getUserTypeData(startDate, endDate),
      ]);
      deviceData = device;
      geoData = geo;
      userTypeData = userType;
    } else if (currentTab === 'behavior') {
      const [events] = await Promise.all([
        getEventData(startDate, endDate),
      ]);
      eventData = events;
    }
  } catch (error) {
    console.error('Error fetching Google analytics data:', error);
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
      <AnalyticsTabs />

      {currentTab === 'overview' && (
        <>
          <AnalyticsGraph data={graphData} />

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/50 backdrop-blur shadow-sm p-4 md:p-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] md:text-xs font-semibold text-slate-500 dark:text-slate-400">Total Views</p>
            <p className="mt-1 text-lg md:text-2xl font-bold text-slate-900 dark:text-slate-100">{formatNumber(totalViews)}</p>
            <p className="mt-2 text-[10px] text-slate-500 dark:text-slate-500">Selected range</p>
          </div>
          <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-inner shrink-0">
            <Eye size={20} />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/50 backdrop-blur shadow-sm p-4 md:p-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] md:text-xs font-semibold text-slate-500 dark:text-slate-400">Total Users</p>
            <p className="mt-1 text-lg md:text-2xl font-bold text-slate-900 dark:text-slate-100">{formatNumber(totalUsers)}</p>
            <p className="mt-2 text-[10px] text-slate-500 dark:text-slate-500">Selected range</p>
          </div>
          <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-inner shrink-0">
            <Users size={20} />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/50 backdrop-blur shadow-sm p-4 md:p-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] md:text-xs font-semibold text-slate-500 dark:text-slate-400">Avg Engagement Rate</p>
            <p className="mt-1 text-lg md:text-2xl font-bold text-slate-900 dark:text-slate-100">{avgEngagementRate.toFixed(1)}%</p>
            <p className="mt-2 text-[10px] text-slate-500 dark:text-slate-500">Average (rows)</p>
          </div>
          <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner shrink-0">
            <Percent size={20} />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/50 backdrop-blur shadow-sm p-4 md:p-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] md:text-xs font-semibold text-slate-500 dark:text-slate-400">Total Events</p>
            <p className="mt-1 text-lg md:text-2xl font-bold text-slate-900 dark:text-slate-100">{formatNumber(totalEvents)}</p>
            <p className="mt-2 text-[10px] text-slate-500 dark:text-slate-500">Selected range</p>
          </div>
          <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center shadow-inner shrink-0">
            <MousePointerClick size={20} />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/50 backdrop-blur shadow-sm p-4 md:p-5 flex items-center justify-between col-span-2 sm:col-span-2 xl:col-span-4">
          <div>
            <p className="text-[10px] md:text-xs font-semibold text-slate-500 dark:text-slate-400">Average Time</p>
            <p className="mt-1 text-lg md:text-2xl font-bold text-slate-900 dark:text-slate-100">{formatDuration(totalAvgTime / Math.max(rows.length, 1))}</p>
            <p className="mt-2 text-[10px] text-slate-500 dark:text-slate-500">Daily average (rows)</p>
          </div>
          <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center shadow-inner shrink-0">
            <Clock3 size={20} />
          </div>
        </div>
      </div>

      <AnalyticsTableClient rows={rows} />

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Advanced Insights</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Search Console: {formatNumber(searchConsoleSummary.clicks)} clicks ·{' '}
              {formatNumber(searchConsoleSummary.impressions)} impressions ·{' '}
              {(searchConsoleSummary.ctr * 100).toFixed(2)}% CTR
            </p>
          </div>
        </div>

        <AnalyticsInsightsTables trafficSources={trafficSources} topPages={topPages} />
      </section>
        </>
      )}

      {currentTab === 'audience' && (
        <AudienceView deviceData={deviceData} geoData={geoData} userTypeData={userTypeData} />
      )}

      {currentTab === 'behavior' && (
        <BehaviorView eventData={eventData} />
      )}
    </div>
  );
}
