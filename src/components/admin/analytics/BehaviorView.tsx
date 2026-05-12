"use client";

import { MousePointerClick } from 'lucide-react';
import type { EventRow } from '@/lib/ga-advanced';

type Props = {
  eventData: EventRow[];
};

function formatNumber(val: number) {
  return new Intl.NumberFormat('en-IN').format(val);
}

// Map technical GA4 event names to human readable ones
function formatEventName(name: string) {
  const map: Record<string, string> = {
    page_view: 'Page View',
    session_start: 'Session Start',
    user_engagement: 'User Engagement',
    scroll: 'Scroll',
    click: 'Click',
    first_visit: 'First Visit',
    form_submit: 'Form Submit',
    whatsapp_click: 'WhatsApp Click',
    file_download: 'File Download'
  };
  
  if (map[name]) return map[name];
  
  // Fallback: convert snake_case or kebab-case to Title Case
  return name
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

export default function BehaviorView({ eventData }: Props) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Top Events Table */}
      <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/50 backdrop-blur shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <MousePointerClick size={20} className="text-slate-400" /> Top User Events
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Actions users take on your site.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/80 dark:bg-slate-900/40">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 dark:text-slate-300">Event Name</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-600 dark:text-slate-300">Event Count</th>
              </tr>
            </thead>
            <tbody>
              {eventData.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-5 py-6 text-center text-slate-500">No event data available.</td>
                </tr>
              ) : (
                eventData.slice(0, 15).map((row, i) => (
                  <tr key={i} className="border-t border-gray-200 dark:border-slate-800">
                    <td className="px-5 py-3 text-slate-900 dark:text-slate-100 font-medium">
                      {formatEventName(row.eventName)}
                    </td>
                    <td className="px-5 py-3 text-right text-slate-900 dark:text-slate-100 font-bold">
                      {formatNumber(row.eventCount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
