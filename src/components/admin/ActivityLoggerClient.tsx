"use client";

import React, { useState, useEffect, useRef } from "react";
import { getActivityLogs } from "@/actions/admin-activity";
import { Loader2, Activity, Clock, Shield, Search, Image as ImageIcon, Box, RefreshCw, UserCircle } from "lucide-react";
import { formatDistanceToNow, isAfter, subMinutes } from "date-fns";
import { adminCache } from "@/lib/admin-cache";

type LogDetails = any; // JSONB

type Profile = {
  full_name: string;
  email: string;
  image_url: string;
  role: string;
  last_active_at: string;
};

type LogEntry = {
  id: string;
  user_id: string;
  action_type: string;
  details: LogDetails;
  created_at: string;
  profiles: Profile;
};

export default function ActivityLoggerClient() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [team, setTeam] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);

  const isFetchingRef = useRef(false);

  const fetchLogs = async (forceRefresh = false) => {
    if (!forceRefresh && adminCache.activityLogs && adminCache.activityTeam) {
      setLogs(adminCache.activityLogs);
      setTeam(adminCache.activityTeam);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    isFetchingRef.current = true;
    try {
      const res = await getActivityLogs();
      if (res.success) {
        setLogs((res.logs as unknown as LogEntry[]) || []);
        setTeam((res.team as unknown as Profile[]) || []);
        adminCache.activityLogs = (res.logs as unknown as LogEntry[]) || [];
        adminCache.activityTeam = (res.team as unknown as Profile[]) || [];
      }
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    fetchLogs();
    
    // Smart auto-refresh every 30 seconds
    const interval = setInterval(() => {
      // Prevent fetching if tab is hidden, offline, or already fetching
      if (
        document.visibilityState === 'visible' && 
        navigator.onLine && 
        !isFetchingRef.current
      ) {
        fetchLogs(true);
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'INDEX_URLS': return <Search className="text-blue-500 w-5 h-5" />;
      case 'ADD_IMAGE': return <ImageIcon className="text-emerald-500 w-5 h-5" />;
      case 'DELETE_IMAGE': return <ImageIcon className="text-rose-500 w-5 h-5" />;
      case 'ADD_PRODUCT': return <Box className="text-indigo-500 w-5 h-5" />;
      case 'EDIT_PRODUCT': return <Box className="text-amber-500 w-5 h-5" />;
      case 'DELETE_PRODUCT': return <Box className="text-rose-500 w-5 h-5" />;
      case 'UPDATE_ROLE': return <Shield className="text-purple-500 w-5 h-5" />;
      default: return <Activity className="text-slate-500 w-5 h-5" />;
    }
  };

  const formatActionMessage = (log: LogEntry) => {
    const { action_type, details } = log;
    switch (action_type) {
      case 'INDEX_URLS':
        return `Requested indexing for ${details.url}`;
      case 'ADD_IMAGE':
        if (details.count) return `Uploaded ${details.count} images to ${details.folder}`;
        return `Added a new ${details.type || 'installed'} image to ${details.page_slug}`;
      case 'DELETE_IMAGE':
        if (details.count) return `Deleted ${details.count} images from Cloudinary`;
        return `Deleted an image from ${details.page_slug}`;
      case 'ADD_PRODUCT':
        return `Created a new product: ${details.productName || details.slug}`;
      case 'EDIT_PRODUCT':
        return `Edited product: ${details.productName || details.slug}`;
      case 'DELETE_PRODUCT':
        return `Deleted ${details.productName || 'a product'} (ID: ${details.id})`;
      case 'UPDATE_ROLE':
        return `Updated a user's role to ${details.newRole}`;
      default:
        return `Performed ${action_type}`;
    }
  };

  const isOnline = (lastActiveAt: string | null) => {
    if (!lastActiveAt) return false;
    // Consider online if active within the last 5 minutes
    return isAfter(new Date(lastActiveAt), subMinutes(new Date(), 5));
  };

  const filteredLogs = selectedEmail ? logs.filter((log) => log.profiles?.email === selectedEmail) : logs;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
            <div className="p-2 bg-indigo-500 rounded-xl shadow-lg shadow-indigo-500/25">
              <Activity className="text-white w-6 h-6" />
            </div>
            Team Activity Log
          </h2>
          <p className="text-slate-500 mt-1 text-sm">Super Admin Dashboard: Monitor team actions in real-time.</p>
          <p className="text-rose-500 mt-1 text-[11px] font-bold tracking-wide uppercase">Note: Logs older than 30 days are automatically deleted.</p>
        </div>
        <button
          onClick={() => fetchLogs(true)}
          disabled={isLoading}
          className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-2xl text-sm transition-all shadow-sm"
        >
          <RefreshCw size={18} className={`text-indigo-500 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Data
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Timeline */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none p-6 relative">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-500" /> Recent Actions
              </h3>
              
              {selectedEmail && (
                <button
                  onClick={() => setSelectedEmail(null)}
                  className="text-xs bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 px-3 py-1.5 rounded-full font-bold hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors"
                >
                  Clear Filter
                </button>
              )}
            </div>
            
            {isLoading && filteredLogs.length === 0 ? (
              <div className="flex flex-col items-center py-16 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                <p className="text-sm text-slate-500">Loading activity...</p>
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                {selectedEmail ? "No activity found for this user." : "No activity logs found."}
              </div>
            ) : (
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-800 before:to-transparent">
                {filteredLogs.map((log) => (
                  <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      {getActionIcon(log.action_type)}
                    </div>
                    
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-2">
                        {log.profiles?.image_url ? (
                           // eslint-disable-next-line @next/next/no-img-element
                           <img src={log.profiles.image_url} alt="" className="w-6 h-6 rounded-full" />
                        ) : (
                           <UserCircle className="w-6 h-6 text-slate-400" />
                        )}
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {log.profiles?.full_name || log.profiles?.email || 'Unknown User'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium ml-auto">
                           {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {formatActionMessage(log)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Online Status */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl shadow-slate-200/50 dark:shadow-none">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-500" /> Team Online Status
            </h3>
            
            <div className="space-y-4">
              {team.map((member) => (
                <div 
                  key={member.email} 
                  onClick={() => setSelectedEmail(selectedEmail === member.email ? null : member.email)}
                  className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                    selectedEmail === member.email 
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="relative">
                    {member.image_url ? (
                       // eslint-disable-next-line @next/next/no-img-element
                       <img src={member.image_url} alt="" className="w-10 h-10 rounded-full" />
                    ) : (
                       <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold">
                         {member.full_name?.[0] || '?'}
                       </div>
                    )}
                    {/* Online Dot */}
                    <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${isOnline(member.last_active_at) ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {member.full_name || 'Guest'}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {isOnline(member.last_active_at) 
                        ? 'Online now' 
                        : `Last seen ${member.last_active_at ? formatDistanceToNow(new Date(member.last_active_at), { addSuffix: true }) : 'Never'}`}
                    </p>
                  </div>
                </div>
              ))}
              
              {team.length === 0 && !isLoading && (
                <p className="text-sm text-slate-500 text-center py-4">No team members found.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
