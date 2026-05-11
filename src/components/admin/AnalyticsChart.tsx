"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export type AnalyticsChartPoint = {
  date: string; // YYYY-MM-DD
  label: string; // readable label
  views: number;
};

function TooltipContent({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value?: number } & Record<string, unknown>>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  const views = typeof payload[0]?.value === 'number' ? payload[0].value : 0;

  return (
    <div className="rounded-xl border border-gray-200/70 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur px-3 py-2 shadow-xl">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
        {new Intl.NumberFormat('en-IN').format(views)} views
      </p>
    </div>
  );
}

export default function AnalyticsChart({ data }: { data: AnalyticsChartPoint[] }) {
  return (
    <div className="h-[280px] sm:h-[340px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 12, right: 18, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="viewsFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="rgb(245 158 11)" stopOpacity={0.35} />
              <stop offset="95%" stopColor="rgb(245 158 11)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.25)" />
          <XAxis
            dataKey="label"
            tickMargin={10}
            tick={{ fill: 'rgba(100,116,139,0.9)', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(148,163,184,0.35)' }}
            tickLine={{ stroke: 'rgba(148,163,184,0.35)' }}
            minTickGap={24}
          />
          <YAxis
            tickMargin={10}
            tick={{ fill: 'rgba(100,116,139,0.9)', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(148,163,184,0.35)' }}
            tickLine={{ stroke: 'rgba(148,163,184,0.35)' }}
            width={40}
          />
          <Tooltip content={<TooltipContent />} />
          <Area
            type="monotone"
            dataKey="views"
            stroke="rgb(245 158 11)"
            strokeWidth={2}
            fill="url(#viewsFill)"
            dot={false}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
