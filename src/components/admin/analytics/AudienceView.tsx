"use client";

import { Smartphone, Monitor, Tablet, Globe2, UserPlus, Users } from 'lucide-react';
import type { DeviceRow, GeoRow, UserTypeRow } from '@/lib/ga-advanced';

type Props = {
  deviceData: DeviceRow[];
  geoData: GeoRow[];
  userTypeData: UserTypeRow[];
};

function formatNumber(val: number) {
  return new Intl.NumberFormat('en-IN').format(val);
}

export default function AudienceView({ deviceData, geoData, userTypeData }: Props) {
  const totalUsers = userTypeData.reduce((sum, row) => sum + row.users, 0);
  const newUsers = userTypeData.find(r => r.type === 'new')?.users || 0;
  const returningUsers = userTypeData.find(r => r.type === 'returning')?.users || 0;

  const newPct = totalUsers > 0 ? (newUsers / totalUsers) * 100 : 0;
  const retPct = totalUsers > 0 ? (returningUsers / totalUsers) * 100 : 0;

  const getDeviceIcon = (category: string) => {
    if (category.toLowerCase() === 'mobile') return <Smartphone size={20} className="text-blue-500" />;
    if (category.toLowerCase() === 'tablet') return <Tablet size={20} className="text-purple-500" />;
    return <Monitor size={20} className="text-slate-500" />;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Device Breakdown */}
        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/50 backdrop-blur shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Monitor size={20} className="text-slate-400" /> Devices
          </h3>
          <div className="space-y-4">
            {deviceData.length === 0 ? (
              <p className="text-slate-500 text-sm">No device data available.</p>
            ) : (
              deviceData.map(row => (
                <div key={row.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      {getDeviceIcon(row.category)}
                    </div>
                    <div>
                      <p className="font-medium capitalize text-slate-900 dark:text-slate-100">{row.category}</p>
                      <p className="text-xs text-slate-500">{((row.users / Math.max(totalUsers, 1)) * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                  <p className="font-bold text-slate-900 dark:text-slate-100">{formatNumber(row.users)}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* New vs Returning */}
        <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/50 backdrop-blur shadow-sm p-6 flex flex-col justify-center">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
            <Users size={20} className="text-slate-400" /> User Loyalty
          </h3>
          
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">New</span>
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{newPct.toFixed(1)}%</span>
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-blue-500"></span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Returning</span>
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{retPct.toFixed(1)}%</span>
          </div>

          <div className="h-4 w-full rounded-full bg-slate-100 dark:bg-slate-800 flex overflow-hidden">
            <div style={{ width: `${newPct}%` }} className="h-full bg-emerald-500 transition-all duration-1000"></div>
            <div style={{ width: `${retPct}%` }} className="h-full bg-blue-500 transition-all duration-1000"></div>
          </div>
        </div>
      </div>

      {/* Geo Location Table */}
      <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/50 backdrop-blur shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Globe2 size={20} className="text-slate-400" /> Top Locations
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/80 dark:bg-slate-900/40">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 dark:text-slate-300">Country</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 dark:text-slate-300">City</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-600 dark:text-slate-300">Users</th>
              </tr>
            </thead>
            <tbody>
              {geoData.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-5 py-6 text-center text-slate-500">No location data available.</td>
                </tr>
              ) : (
                geoData.slice(0, 15).map((row, i) => (
                  <tr key={i} className="border-t border-gray-200 dark:border-slate-800">
                    <td className="px-5 py-3 text-slate-900 dark:text-slate-100 font-medium">{row.country}</td>
                    <td className="px-5 py-3 text-slate-600 dark:text-slate-400">{row.city}</td>
                    <td className="px-5 py-3 text-right text-slate-900 dark:text-slate-100 font-bold">{formatNumber(row.users)}</td>
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
