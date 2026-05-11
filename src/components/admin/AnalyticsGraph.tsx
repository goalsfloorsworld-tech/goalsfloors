"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useMemo, useState } from 'react';
import { Eye, Gauge, Users } from 'lucide-react';

export type AnalyticsGraphPoint = {
  date: string;
  label: string;
  views: number;
  users: number;
  avgTime: number;
};

type MetricKey = 'views' | 'users' | 'avgTime';

const METRICS: Array<{
  key: MetricKey;
  label: string;
  color: string;
  bg: string;
  icon: React.ReactNode;
}> = [
  { key: 'views', label: 'Total Views', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', icon: <Eye size={14} /> },
  { key: 'users', label: 'Total Active Users', color: '#22c55e', bg: 'rgba(34,197,94,0.12)', icon: <Users size={14} /> },
  { key: 'avgTime', label: 'Average Time', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', icon: <Gauge size={14} /> },
];

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-IN').format(value);
}

function formatDuration(seconds: number) {
  const safeSeconds = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  if (minutes <= 0) return `${remainingSeconds}s`;
  if (remainingSeconds === 0) return `${minutes}m`;
  return `${minutes}m ${remainingSeconds}s`;
}

function formatDurationTick(seconds: number) {
  const safeSeconds = Math.max(0, Math.round(seconds));
  if (safeSeconds < 60) return `${safeSeconds}s`;
  return formatDuration(safeSeconds);
}

function TooltipContent({
  active,
  payload,
  label,
  visibleMetrics,
}: {
  active?: boolean;
  payload?: Array<{ dataKey?: string; value?: number; color?: string }>;
  label?: string;
  visibleMetrics: Record<MetricKey, boolean>;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-2xl border border-gray-200/70 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur px-4 py-3 shadow-2xl min-w-[180px]">
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">{label}</p>
      <div className="space-y-1.5">
        {payload
          .filter((item) => typeof item.dataKey === 'string' && visibleMetrics[item.dataKey as MetricKey])
          .map((item) => {
            const key = item.dataKey as MetricKey;
            const metric = METRICS.find((m) => m.key === key);
            const value = typeof item.value === 'number' ? item.value : 0;

            return (
              <div key={key} className="flex items-center justify-between gap-4 text-sm">
                <span className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-md" style={{ backgroundColor: metric?.bg, color: metric?.color }}>
                    {metric?.icon}
                  </span>
                  {metric?.label}
                </span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {key === 'avgTime' ? formatDuration(value) : formatNumber(value)}
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default function AnalyticsGraph({ data }: { data: AnalyticsGraphPoint[] }) {
  const [visibleMetrics, setVisibleMetrics] = useState<Record<MetricKey, boolean>>({
    views: true,
    users: true,
    avgTime: true,
  });

  const activeMetrics = useMemo(
    () => METRICS.filter((metric) => visibleMetrics[metric.key]),
    [visibleMetrics]
  );

  const toggleMetric = (key: MetricKey) => {
    setVisibleMetrics((current) => {
      const enabledCount = Object.values(current).filter(Boolean).length;
      if (current[key] && enabledCount === 1) return current;
      return { ...current, [key]: !current[key] };
    });
  };

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/50 backdrop-blur shadow-sm p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Trend Graph</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">Three daily metrics with quick visibility toggles.</p>
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {METRICS.map((metric) => {
            const isActive = visibleMetrics[metric.key];
            return (
              <button
                key={metric.key}
                type="button"
                onClick={() => toggleMetric(metric.key)}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'border-transparent text-white shadow-sm'
                    : 'border-gray-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 text-slate-600 dark:text-slate-300'
                }`}
                style={isActive ? { backgroundColor: metric.color } : undefined}
              >
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/15" style={isActive ? {} : { color: metric.color }}>
                  {metric.icon}
                </span>
                {metric.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 h-[350px] md:h-[450px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.22)" />
            <XAxis
              dataKey="label"
              tickMargin={10}
              tick={{ fill: 'rgba(100,116,139,0.9)', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(148,163,184,0.35)' }}
              tickLine={{ stroke: 'rgba(148,163,184,0.35)' }}
              minTickGap={18}
            />
            <YAxis
              yAxisId="left"
              tickMargin={10}
              tick={{ fill: 'rgba(100,116,139,0.9)', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(148,163,184,0.35)' }}
              tickLine={{ stroke: 'rgba(148,163,184,0.35)' }}
              width={50}
              tickFormatter={(value) => formatNumber(Number(value))}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickMargin={10}
              tick={{ fill: 'rgba(100,116,139,0.9)', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(148,163,184,0.35)' }}
              tickLine={{ stroke: 'rgba(148,163,184,0.35)' }}
              width={60}
              tickFormatter={(value) => formatDurationTick(Number(value))}
            />
            <Tooltip 
              content={<TooltipContent visibleMetrics={visibleMetrics} />} 
              cursor={{ stroke: 'rgba(148,163,184,0.1)', strokeWidth: 2 }}
              isAnimationActive={false}
            />
            {visibleMetrics.views && (
              <Line
                type="monotone"
                dataKey="views"
                name="Total Views"
                stroke="#3b82f6"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5 }}
                yAxisId="left"
                isAnimationActive
              />
            )}
            {visibleMetrics.users && (
              <Line
                type="monotone"
                dataKey="users"
                name="Total Active Users"
                stroke="#22c55e"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5 }}
                connectNulls
                yAxisId="left"
                isAnimationActive
              />
            )}
            {visibleMetrics.avgTime && (
              <Line
                type="monotone"
                dataKey="avgTime"
                name="Average Time"
                stroke="#f59e0b"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5 }}
                connectNulls
                yAxisId="right"
                isAnimationActive
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
        {activeMetrics.length > 0 ? (
          activeMetrics.map((metric) => (
            <span key={metric.key} className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 px-3 py-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: metric.color }} />
              {metric.label}
            </span>
          ))
        ) : (
          <span className="rounded-full border border-gray-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 px-3 py-1.5">
            No metrics enabled
          </span>
        )}
      </div>
    </div>
  );
}
