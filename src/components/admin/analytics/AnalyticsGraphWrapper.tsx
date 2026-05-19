"use client";

import dynamic from 'next/dynamic';
import type { AnalyticsGraphPoint } from '@/components/admin/analytics/AnalyticsGraph';

const AnalyticsGraph = dynamic(() => import('@/components/admin/analytics/AnalyticsGraph'), { ssr: false });

export default function AnalyticsGraphWrapper({ data }: { data: AnalyticsGraphPoint[] }) {
  return <AnalyticsGraph data={data} />;
}
