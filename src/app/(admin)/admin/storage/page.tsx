"use client";

import React, { useState, useEffect } from "react";
import { HardDrive, Cloud, Database, RefreshCw, AlertCircle, File, ChevronDown, Activity } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { getStorageAnalytics, StorageStats, StorageFile } from "@/actions/admin-storage";
import StorageDetailsModal from "@/components/admin/storage/StorageDetailsModal";

export default function StorageAnalyticsDashboard() {
  const [stats, setStats] = useState<StorageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<"cloudinary" | "backblaze" | "supabase" | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    const res = await getStorageAnalytics();
    if (res.success && res.data) {
      setStats(res.data);
    } else {
      toast.error(res.error || "Failed to load storage analytics");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center flex-col items-center gap-4 py-32">
        <RefreshCw className="animate-spin text-blue-500 w-10 h-10" />
        <p className="text-slate-500 font-medium text-lg">Scanning multi-cloud storage metrics...</p>
      </div>
    );
  }

  const CloudinaryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Cloudinary-Icon--Streamline-Svg-Logos" className="w-8 h-8">
      <path fill="#3448c5" d="M7.140225 11.213075c0.0172 0 0.033675 0.0069 0.04575 0.01915l2.162725 2.164675c0.01785 0.018325 0.0231 0.045525 0.013375 0.069175 -0.009725 0.023675 -0.03255 0.039325 -0.05815 0.039825h-0.55285c-0.0358 0 -0.065125 0.02845 -0.066175 0.06425V18.43675c0.000775 0.30805 0.123225 0.6033 0.340675 0.8215l0.323125 0.32315c0.01785 0.018325 0.0231 0.045525 0.013375 0.069175 -0.009725 0.023675 -0.03255 0.039325 -0.05815 0.039825H6.753825c-0.64505 0 -1.167975 -0.522925 -1.167975 -1.167975V13.57015c0 -0.035475 -0.028775 -0.06425 -0.06425 -0.06425h-0.54505c-0.02595 0.000275 -0.0495 -0.015075 -0.0597 -0.038925 -0.010225 -0.02385 -0.0051 -0.051475 0.012975 -0.070075l2.164675 -2.164675c0.012075 -0.01225 0.02855 -0.01915 0.045725 -0.01915Zm4.782925 1.25365c0.0172 0 0.033675 0.0069 0.04575 0.01915l2.164675 2.156875c0.018075 0.0186 0.0232 0.04625 0.012975 0.070075 -0.010225 0.02385 -0.033775 0.0392 -0.0597 0.038925H13.534c-0.0358 0.001075 -0.06425 0.0304 -0.06425 0.0662V18.43675c0.000275 0.307775 0.122 0.603 0.338725 0.8215l0.3251 0.32315c0.018075 0.018575 0.0232 0.046225 0.012975 0.070075 -0.010225 0.023825 -0.033775 0.0392 -0.0597 0.038925H11.542575c-0.64505 0 -1.167975 -0.522925 -1.167975 -1.167975V14.82185c0 -0.035825 -0.02845 -0.06515 -0.06425 -0.0662h-0.5509c-0.025575 -0.0005 -0.048425 -0.01615 -0.05815 -0.039825 -0.0097 -0.02365 -0.00445 -0.05085 0.013375 -0.069175l2.162725 -2.160775c0.012075 -0.01225 0.02855 -0.01915 0.04575 -0.01915Zm4.783875 1.240175c0.016875 0 0.03305 0.00685 0.044775 0.018975l2.164675 2.162725c0.019225 0.01815 0.025375 0.046225 0.0155 0.07075 -0.0099 0.02455 -0.033825 0.0405 -0.060275 0.0402h-0.5548c-0.035475 0 -0.064225 0.028775 -0.064225 0.06425v2.37295c0.000775 0.30805 0.123225 0.6033 0.34065 0.8215l0.32315 0.32315c0.01785 0.018325 0.0231 0.045525 0.013375 0.069175 -0.009725 0.023675 -0.032575 0.039325 -0.05815 0.039825H16.31965c-0.64505 0 -1.168 -0.522925 -1.168 -1.167975v-2.458625c0 -0.035475 -0.02875 -0.06425 -0.064225 -0.06425h-0.545075c-0.026425 0.0003 -0.05035 -0.01565 -0.06025 -0.0402 -0.0099 -0.024525 -0.00375 -0.0526 0.0155 -0.07075l2.16465 -2.162725c0.01175 -0.012125 0.0279 -0.018975 0.044775 -0.018975ZM11.87935 4.3097c3.4002 0.02475 6.39915 2.232725 7.4323 5.472275C21.836825 10.111525 23.73155 12.2539 23.75 14.800425c0 2.10175 -1.314425 3.848275 -3.436675 4.5754l-0.078975 0.026475 -0.097325 0.03115v-1.569c1.349025 -0.568425 2.1413 -1.69165 2.1413 -3.064025 -0.0069 -1.936575 -1.540575 -3.517875 -3.468025 -3.5916l-0.065125 -0.0019h-0.584l-0.14015 -0.55675c-0.687875 -2.839375 -3.220225 -4.846 -6.141675 -4.866625 -2.403825 -0.011525 -4.599025 1.3544 -5.652475 3.50945l-0.216675 0.44615 -0.408775 0.042825c-1.846275 0.1975 -3.3622625 1.5479 -3.77107 3.359125 -0.402965 1.785375 0.3578775 3.62845 1.895295 4.6111l0.067325 0.042175v1.65465h-0.009725l-0.146 -0.0662C1.3281325 18.321275 -0.0244414 15.883475 0.2969275 13.36245 0.6182975 10.841425 2.5392 8.8209 5.040775 8.3726c1.351525 -2.515925 3.982675 -4.079025 6.838575 -4.0629Z" strokeWidth="0.25"></path>
    </svg>
  );

  const BackblazeIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" id="Backblaze--Streamline-Simple-Icons" className="w-8 h-8">
      <path d="M9.3108 0.0003c0.6527 1.3502 1.5666 4.0812 -1.3887 7.1738 -1.8096 1.8796 -3.078 3.8487 -2.3496 6.0644 0.3642 1.1037 1.1864 2.5079 2.8867 2.7852 0.6107 0.1008 1.3425 -0.0006 1.7403 -0.1406 2.4538 -0.8544 2.098 -3.4138 1.5546 -5.0469 -0.07 -0.2129 -0.1915 -0.7333 -0.2363 -0.9238 -0.3726 -1.6023 0.776 -2.6562 1.129 -3.8047 0.028 -0.0925 0.0534 -0.1819 0.0702 -0.2715 0.042 -0.21 0.067 -0.423 0.0781 -0.6387 0 -1.8264 -0.9882 -2.6303 -1.7754 -3.5996C10.1794 0.5643 9.3107 0.0003 9.3107 0.0003Zm6.2754 6.0175s-0.709 0.3366 -1.2188 0.8829c-0.4454 0.4818 -0.8635 0.8789 -1.2949 1.8593 -0.028 0.14 -0.0518 0.2863 -0.0742 0.4375 -0.2325 1.6416 1.1473 3.1446 0.7187 5.1895 -0.112 0.535 -0.3554 0.7123 -0.7812 1.6367 -0.5098 1.1065 -0.383 2.588 0.3594 3.5293 0.6723 0.8488 1.879 1.2321 3.0527 0.9492 2.1065 -0.5042 3.0646 -2.2822 2.8965 -4.2851 -0.1317 -1.58 -0.8154 -2.7536 -2.754 -4.961 -0.9607 -1.0925 -1.6072 -2.409 -1.5624 -3.4062 0.1373 -1.2074 0.6582 -1.832 0.6582 -1.832zM4.8928 15.1936c-0.0222 0.0145 -0.0439 0.0614 -0.0586 0.1602a0.0469 0.0469 0 0 1 -0.0059 0.0195v0.01c-0.1148 0.5406 -0.1649 1.823 0.1153 2.9687 0.353 1.4427 1.4175 3.902 4.412 5.129 2.5184 1.0336 5.718 0.5411 7.8497 -1.627 0.5294 -0.5435 0.408 -0.4897 -0.4883 -0.2012v-0.002c-1.1121 0.3558 -3.5182 0.5463 -4.7676 -1 -1.5239 -1.8852 -0.4302 -3.3633 -1.3574 -3.1504 -3.6164 0.8348 -5.2667 -1.4657 -5.5469 -2.1016 -0.0023 -0.002 -0.0857 -0.2487 -0.1523 -0.205z" fill="#ff1e00" strokeWidth="1"></path>
    </svg>
  );

  const SupabaseIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" id="Supabase--Streamline-Simple-Icons" className="w-8 h-8">
      <path d="M11.9 1.036c-0.015 -0.986 -1.26 -1.41 -1.874 -0.637L0.764 12.05C-0.33 13.427 0.65 15.455 2.409 15.455h9.579l0.113 7.51c0.014 0.985 1.259 1.408 1.873 0.636l9.262 -11.653c1.093 -1.375 0.113 -3.403 -1.645 -3.403h-9.642z" fill="#44ff00" strokeWidth="1"></path>
    </svg>
  );

  const TopFilesList = ({ files, emptyText, themeColor }: { files: StorageFile[], emptyText: string, themeColor: 'blue' | 'rose' | 'emerald' }) => {
    const themeClasses = {
      blue: 'group-hover:border-blue-500/50 text-blue-500',
      rose: 'group-hover:border-rose-500/50 text-rose-500',
      emerald: 'group-hover:border-emerald-500/50 text-emerald-500',
    };

    if (!files || files.length === 0) {
      return <p className="text-sm text-slate-500 italic mt-4 relative z-10">{emptyText}</p>;
    }
    return (
      <div className="mt-6 z-10 relative">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Top Largest Files</h4>
        <div className="space-y-3">
          {files.map((file, i) => (
            <div key={i} className={`group flex items-center justify-between p-3.5 bg-white/40 dark:bg-slate-950/40 rounded-2xl border border-white/50 dark:border-slate-800/50 backdrop-blur-md hover:-translate-y-1 hover:shadow-lg transition-all duration-300 ${themeClasses[themeColor].split(' ')[0]}`}>
              <div className="flex items-center gap-3 overflow-hidden">
                <div className={`p-2 rounded-lg bg-white dark:bg-slate-900 shadow-sm group-hover:scale-110 transition-transform duration-300 ${themeClasses[themeColor].split(' ')[1]}`}>
                  <File className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate" title={file.name}>{file.name}</span>
              </div>
              <span className="text-xs font-black text-slate-600 dark:text-slate-400 shrink-0 ml-4 px-2.5 py-1 rounded-md bg-white/60 dark:bg-slate-800/60 shadow-sm">{formatBytes(file.sizeBytes)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-3 md:p-6 max-w-7xl mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Toaster position="top-right" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl shadow-indigo-500/30 text-white">
              <Activity className="w-8 h-8" />
            </div>
            Storage Analytics
          </h2>
          <p className="text-slate-500 mt-2 font-medium">Unified view of storage consumption, quotas, and largest files across all cloud providers.</p>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold rounded-2xl text-sm transition-all shadow-xl shadow-slate-900/20 dark:shadow-white/20 active:scale-95"
        >
          <RefreshCw size={18} /> Refresh Metrics
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Cloudinary */}
        <div 
          onClick={() => setSelectedProvider("cloudinary")}
          className="group cursor-pointer relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl rounded-[2.5rem] border border-white/50 dark:border-slate-700/50 p-8 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col h-full hover:-translate-y-2"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute -top-10 -right-10 opacity-[0.03] pointer-events-none text-[#3448C5] group-hover:scale-110 transition-transform duration-700 group-hover:rotate-12">
            <svg viewBox="0 0 512 512" fill="currentColor" className="w-64 h-64"><path d="M256 0c-73.4 0-137.9 39.8-172.9 99C35.9 113.6 0 156.4 0 208c0 61.9 50.1 112 112 112h272c70.7 0 128-57.3 128-128 0-66.2-50.4-120.9-114.7-127.4C371 27 317.7 0 256 0z"/></svg>
          </div>
          
          <div className="flex items-center gap-4 mb-10 relative z-10">
            <div className="p-3.5 bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700">
              <CloudinaryIcon />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">Cloudinary</h3>
              <p className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mt-0.5">Image Assets</p>
            </div>
          </div>
            
          {stats?.cloudinary.error ? (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/50 rounded-xl flex items-start gap-2 text-rose-600 dark:text-rose-400 text-sm">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <p>{stats.cloudinary.error}</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="mb-10 relative z-10">
                <p className="text-5xl font-black text-slate-900 dark:text-white tracking-tight drop-shadow-sm">
                  {stats?.cloudinary.creditsUsed !== undefined && stats?.cloudinary.creditsLimit ? (
                    `${stats.cloudinary.creditsUsed} Credits`
                  ) : (
                    formatBytes(stats?.cloudinary.usedBytes || 0)
                  )}
                </p>
                <p className="text-slate-500 text-sm font-medium mt-2">
                  {stats?.cloudinary.creditsLimit ? `Used of ${stats.cloudinary.creditsLimit} Monthly Credits` : "Total Image Storage Used"}
                </p>
              </div>
              
              {stats?.cloudinary.creditsLimit ? (
                <div className="mb-8 relative z-10">
                  <div className="w-full h-4 bg-slate-200/50 dark:bg-slate-800/80 rounded-full overflow-hidden mb-3 shadow-inner">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-blue-600 to-indigo-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]`} 
                      style={{ width: `${Math.min(stats?.cloudinary.percentage || 0, 100)}%` }} 
                    />
                  </div>
                  <div className="flex justify-between items-center text-xs font-black text-slate-500">
                    <span className="text-blue-600 dark:text-blue-400">{stats?.cloudinary.percentage?.toFixed(1)}% Used</span>
                    <span>{stats.cloudinary.creditsLimit - stats.cloudinary.creditsUsed} Credits Remaining</span>
                  </div>
                </div>
              ) : null}

              <div className="mt-auto border-t border-slate-100 dark:border-slate-800/50 pt-6">
                <TopFilesList files={stats?.cloudinary.topFiles || []} emptyText="No recent files found in Cloudinary." themeColor="blue" />
              </div>
            </div>
          )}
        </div>

        {/* Backblaze B2 */}
        <div 
          onClick={() => setSelectedProvider("backblaze")}
          className="group cursor-pointer relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl rounded-[2.5rem] border border-white/50 dark:border-slate-700/50 p-8 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col h-full hover:-translate-y-2"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute -top-10 -right-10 opacity-[0.03] pointer-events-none text-[#d73130] group-hover:scale-110 transition-transform duration-700 group-hover:rotate-12">
             <svg viewBox="0 0 256 256" fill="currentColor" className="w-64 h-64"><path d="M208 0H48C21.5 0 0 21.5 0 48v160c0 26.5 21.5 48 48 48h160c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48zm-80 174.5c-20.1 0-36.5-16.4-36.5-36.5 0-20.1 16.4-36.5 36.5-36.5 20.1 0 36.5 16.4 36.5 36.5 0 20.1-16.4 36.5-36.5 36.5z"/></svg>
          </div>
          
          <div className="flex items-center gap-4 mb-10 relative z-10">
            <div className="p-3.5 bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700">
              <BackblazeIcon />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">Backblaze B2</h3>
              <p className="text-sm font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mt-0.5">PDFs & Documents</p>
            </div>
          </div>
            
          {stats?.backblaze.error ? (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/50 rounded-xl flex items-start gap-2 text-rose-600 dark:text-rose-400 text-sm">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <p>{stats.backblaze.error}</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="mb-10 relative z-10">
                <p className="text-5xl font-black text-slate-900 dark:text-white tracking-tight drop-shadow-sm">
                  {formatBytes(stats?.backblaze.usedBytes || 0)}
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <p className="text-slate-500 text-sm font-medium">Used of 10 GB Free Tier</p>
                  <span className="px-2.5 py-1 bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 text-[10px] uppercase tracking-widest font-black rounded-lg">
                    {stats?.backblaze.fileCount} Files
                  </span>
                </div>
              </div>
              
              <div className="mb-8 relative z-10">
                <div className="w-full h-4 bg-slate-200/50 dark:bg-slate-800/80 rounded-full overflow-hidden mb-3 shadow-inner">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-rose-600 to-orange-400 shadow-[0_0_10px_rgba(225,29,72,0.5)]`} 
                    style={{ width: `${Math.min(stats?.backblaze.percentage || 0, 100)}%` }} 
                  />
                </div>
                <div className="flex justify-between items-center text-xs font-black text-slate-500">
                  <span className="text-rose-600 dark:text-rose-400">{(stats?.backblaze.percentage || 0).toFixed(1)}% Used</span>
                  <span>{formatBytes((stats?.backblaze.limitBytes || (10 * 1024 * 1024 * 1024)) - (stats?.backblaze.usedBytes || 0))} Remaining</span>
                </div>
              </div>

              <div className="mt-auto border-t border-slate-100 dark:border-slate-800/50 pt-6">
                <TopFilesList files={stats?.backblaze.topFiles || []} emptyText="No files found in B2 buckets." themeColor="rose" />
              </div>
            </div>
          )}
        </div>

        {/* Supabase Storage */}
        <div 
          onClick={() => setSelectedProvider("supabase")}
          className="group cursor-pointer relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl rounded-[2.5rem] border border-white/50 dark:border-slate-700/50 p-8 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col h-full hover:-translate-y-2"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute -top-10 -right-10 opacity-[0.03] pointer-events-none text-[#3ecf8e] group-hover:scale-110 transition-transform duration-700 group-hover:-rotate-12">
            <svg viewBox="0 0 256 256" fill="currentColor" className="w-64 h-64"><path d="M128 0C57.3 0 0 57.3 0 128s57.3 128 128 128 128-57.3 128-128S198.7 0 128 0zm48.7 176.4c-4.4 7.6-15.5 8.7-21.4 2.1l-65.7-72.9c-5.5-6.1-1.2-15.9 7-15.9h30.2V41.1c0-4.4 5.3-6.6 8.5-3.5l67.5 67.5c4.7 4.7 2.1 12.8-4.5 13.9l-28.7 4.7v52.7z"/></svg>
          </div>
          
          <div className="flex items-center gap-4 mb-10 relative z-10">
            <div className="p-3.5 bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700">
              <SupabaseIcon />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">Supabase Storage</h3>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mt-0.5">App Data</p>
            </div>
          </div>
            
          {stats?.supabase.error ? (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/50 rounded-xl flex items-start gap-2 text-rose-600 dark:text-rose-400 text-sm">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <p>{stats.supabase.error}</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="mb-10 relative z-10">
                <p className="text-5xl font-black text-slate-900 dark:text-white tracking-tight drop-shadow-sm">
                  {formatBytes(stats?.supabase.usedBytes || 0)}
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <p className="text-slate-500 text-sm font-medium">Used of 500 MB Free Tier</p>
                  <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[10px] uppercase tracking-widest font-black rounded-lg">
                    {stats?.supabase.fileCount} Files
                  </span>
                </div>
              </div>
              
              <div className="mb-8 relative z-10">
                <div className="w-full h-4 bg-slate-200/50 dark:bg-slate-800/80 rounded-full overflow-hidden mb-3 shadow-inner">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-emerald-600 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]`} 
                    style={{ width: `${Math.min(stats?.supabase.percentage || 0, 100)}%` }} 
                  />
                </div>
                <div className="flex justify-between items-center text-xs font-black text-slate-500">
                  <span className="text-emerald-600 dark:text-emerald-400">{(stats?.supabase.percentage || 0).toFixed(1)}% Used</span>
                  <span>{formatBytes((stats?.supabase.limitBytes || (500 * 1024 * 1024)) - (stats?.supabase.usedBytes || 0))} Remaining</span>
                </div>
              </div>

              <div className="mt-auto border-t border-slate-100 dark:border-slate-800/50 pt-6">
                <TopFilesList files={stats?.supabase.topFiles || []} emptyText="No files found in Supabase buckets." themeColor="emerald" />
              </div>
            </div>
          )}
        </div>

      </div>

      <StorageDetailsModal 
        isOpen={selectedProvider !== null} 
        onClose={() => setSelectedProvider(null)} 
        provider={selectedProvider} 
        stats={stats} 
      />
    </div>
  );
}
