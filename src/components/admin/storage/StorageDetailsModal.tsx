"use client";

import React, { useEffect, useState } from "react";
import { X, Server, Database, Cloud, Activity, HardDrive, FileImage, FileText, Zap } from "lucide-react";
import { StorageStats } from "@/actions/admin-storage";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  provider: "cloudinary" | "backblaze" | "supabase" | null;
  stats: StorageStats | null;
};

const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

export default function StorageDetailsModal({ isOpen, onClose, provider, stats }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen || !stats || !provider || !mounted) return null;

  const data = stats[provider];
  
  let TitleIcon = Cloud;
  let titleColor = "text-blue-500";
  let bgGradient = "from-blue-500/10 to-indigo-500/10";
  let title = "Cloudinary Analytics";

  if (provider === "backblaze") {
    TitleIcon = HardDrive;
    titleColor = "text-rose-500";
    bgGradient = "from-rose-500/10 to-orange-500/10";
    title = "Backblaze B2 Analytics";
  } else if (provider === "supabase") {
    TitleIcon = Database;
    titleColor = "text-emerald-500";
    bgGradient = "from-emerald-500/10 to-teal-500/10";
    title = "Supabase Storage Analytics";
  }

  const renderCloudinaryDetails = () => {
    const cData = data as StorageStats['cloudinary'];
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
            <div className="flex items-center gap-2 mb-2 text-slate-500">
              <Zap className="w-4 h-4" /> <span className="text-sm font-bold uppercase tracking-wider">Bandwidth</span>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {cData.bandwidthUsedBytes ? formatBytes(cData.bandwidthUsedBytes) : "N/A"}
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
            <div className="flex items-center gap-2 mb-2 text-slate-500">
              <FileImage className="w-4 h-4" /> <span className="text-sm font-bold uppercase tracking-wider">Resources</span>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {cData.totalResources !== undefined ? new Intl.NumberFormat('en-IN').format(cData.totalResources) : "N/A"}
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
            <div className="flex items-center gap-2 mb-2 text-slate-500">
              <Activity className="w-4 h-4" /> <span className="text-sm font-bold uppercase tracking-wider">Used Bytes</span>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {formatBytes(cData.usedBytes)}
            </p>
          </div>
        </div>
        
        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/50">
          <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Storage Allocation</h4>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: "Used Credits", value: cData.creditsUsed || 0 },
                    { name: "Remaining", value: (cData.creditsLimit || 0) - (cData.creditsUsed || 0) }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="80%"
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#3b82f6" />
                  <Cell fill="#cbd5e1" />
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#1e293b', color: '#f8fafc' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  const renderFileTypeDetails = (fileTypes: {type: string, size: number, count: number}[]) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/50 flex flex-col min-h-[300px]">
          <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">File Types Breakdown</h4>
          <div className="flex-1 w-full min-h-[220px]">
            {fileTypes.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={fileTypes}
                    cx="50%"
                    cy="50%"
                    innerRadius="50%"
                    outerRadius="80%"
                    paddingAngle={2}
                    dataKey="size"
                    nameKey="type"
                  >
                    {fileTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => formatBytes(Number(value) || 0)}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#1e293b', color: '#f8fafc' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">No data available</div>
            )}
          </div>
        </div>
        
        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/50 flex flex-col min-h-[300px]">
           <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Type Statistics</h4>
           {fileTypes.length > 0 ? (
             <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
               {fileTypes.map((ft, i) => (
                 <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800">
                   <div className="flex items-center gap-3">
                     <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                     <span className="font-bold text-sm uppercase text-slate-700 dark:text-slate-300">.{ft.type}</span>
                   </div>
                   <div className="text-right">
                     <p className="text-sm font-black text-slate-900 dark:text-white">{formatBytes(ft.size)}</p>
                     <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{ft.count} files</p>
                   </div>
                 </div>
               ))}
             </div>
           ) : (
             <div className="flex items-center justify-center h-full text-slate-400 pb-10">No data available</div>
           )}
        </div>
      </div>
    );
  };

  const renderBackblazeDetails = () => {
    const bData = data as StorageStats['backblaze'];
    return renderFileTypeDetails(bData.fileTypes || []);
  };

  const renderSupabaseDetails = () => {
    const sData = data as StorageStats['supabase'];
    return (
      <div className="space-y-6">
        {renderFileTypeDetails(sData.fileTypes || [])}
        
        {sData.buckets && sData.buckets.length > 0 && (
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/50">
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">Bucket Utilization</h4>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sData.buckets} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.1)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis tickFormatter={(val) => formatBytes(val)} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} width={60} />
                  <Tooltip 
                    formatter={(value: any) => formatBytes(Number(value) || 0)}
                    cursor={{ fill: 'rgba(148,163,184,0.05)' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#1e293b', color: '#f8fafc' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Bar dataKey="size" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 border border-slate-100 dark:border-slate-800">
        <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} opacity-30 pointer-events-none`}></div>
        
        {/* Header */}
        <div className="relative z-10 flex items-center justify-between p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className={`p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 ${titleColor}`}>
              <TitleIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{title}</h2>
              <p className="text-slate-500 font-medium text-sm">Deep Storage Insights</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 transition-colors shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="relative z-10 p-6 sm:p-8 overflow-y-auto custom-scrollbar">
          {provider === "cloudinary" && renderCloudinaryDetails()}
          {provider === "backblaze" && renderBackblazeDetails()}
          {provider === "supabase" && renderSupabaseDetails()}
        </div>
      </div>
    </div>
  );
}
