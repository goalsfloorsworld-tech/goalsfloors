"use client";

import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, FileText, BarChart3, Globe, Rocket, 
  ShoppingBag, Database, UserPlus, Loader2 
} from 'lucide-react';
import { getCurrentUserProfile } from '@/actions/admin-core';
import RoleBadge from '@/components/shared/RoleBadge';

const NAV_ITEMS = [
  { 
    href: '/admin', 
    label: 'Dashboard', 
    icon: LayoutDashboard, 
    color: 'hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-300',
    iconColor: 'text-blue-500'
  },
  { 
    href: '/admin/blogs', 
    label: 'Blogs', 
    icon: FileText, 
    color: 'hover:bg-amber-50 dark:hover:bg-amber-900/20 text-slate-700 dark:text-slate-300 hover:text-amber-700 dark:hover:text-amber-300',
    iconColor: 'text-amber-500'
  },
  { 
    href: '/admin/analytics', 
    label: 'Analytics', 
    icon: BarChart3, 
    color: 'hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-700 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-indigo-300',
    iconColor: 'text-indigo-500'
  },
  { 
    href: '/admin/gsc', 
    label: 'SEO Command', 
    icon: Rocket, 
    color: 'hover:bg-sky-50 dark:hover:bg-sky-900/20 text-slate-700 dark:text-slate-300 hover:text-sky-700 dark:hover:text-sky-300',
    iconColor: 'text-sky-500'
  },
  { 
    href: '/admin/gmc', 
    label: 'Merchant Center', 
    icon: ShoppingBag, 
    color: 'hover:bg-rose-50 dark:hover:bg-rose-900/20 text-slate-700 dark:text-slate-300 hover:text-rose-700 dark:hover:text-rose-300',
    iconColor: 'text-rose-500'
  },
];

const ADMIN_TOOLS = [
  { 
    href: '/admin/database', 
    label: 'Database', 
    icon: Database, 
    color: 'hover:bg-purple-50 dark:hover:bg-purple-900/20 text-slate-700 dark:text-slate-300 hover:text-purple-700 dark:hover:text-purple-300',
    iconColor: 'text-purple-500'
  },
  { 
    href: '/admin/team', 
    label: 'Team', 
    icon: UserPlus, 
    color: 'hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300',
    iconColor: 'text-emerald-500'
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [profile, setProfile] = useState<any>(null);
  const [loadingPath, setLoadingPath] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      const res = await getCurrentUserProfile();
      if (res.success) setProfile(res.profile);
    }
    loadProfile();
  }, []);

  // Reset loading state when pathname changes
  useEffect(() => {
    setLoadingPath(null);
  }, [pathname]);

  const role = profile?.role ?? 'user';
  const name = profile?.full_name || profile?.email || 'Admin';
  const imageUrl = profile?.image_url;

  const SidebarLink = ({ item }: { item: typeof NAV_ITEMS[0] }) => {
    const isActive = pathname === item.href;
    const isLoading = loadingPath === item.href;

    return (
      <Link 
        href={item.href} 
        onClick={() => {
          if (pathname !== item.href) setLoadingPath(item.href);
        }}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${item.color} ${isActive ? 'bg-slate-100 dark:bg-slate-900 font-bold' : ''}`}
      >
        <div className="w-5 h-5 flex items-center justify-center">
          {isLoading ? (
            <Loader2 size={18} className="animate-spin text-slate-400" />
          ) : (
            <item.icon size={20} className={`${isActive ? item.iconColor : 'text-slate-500 group-hover:' + item.iconColor} transition-colors`} />
          )}
        </div>
        <span className="font-medium">{item.label}</span>
      </Link>
    );
  };

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-white dark:bg-slate-950 border-r border-gray-200 dark:border-gray-800 text-slate-900 dark:text-slate-100 flex-shrink-0 z-20">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-emerald-500">
          Admin Panel
        </h2>
      </div>
      
      {/* View Site Link */}
      <div className="px-4 pt-4">
        <Link href="/" target="_blank" className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-slate-900 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300 font-medium text-sm border border-gray-200 dark:border-gray-700 shadow-sm">
          <Globe size={18} className="text-blue-500 dark:text-blue-400" />
          <span>View Live Site</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <SidebarLink key={item.href} item={item} />
        ))}

        {/* Admin-only section divider */}
        <div className="pt-4 pb-2">
          <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Admin Tools</p>
        </div>
        
        {ADMIN_TOOLS.map((item) => (
          <SidebarLink key={item.href} item={item} />
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        {/* User Profile + Role Badge Overlay */}
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 mb-1">
          <div className="relative flex-shrink-0">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt="" className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white font-black text-xs">
                {name?.[0]?.toUpperCase() || 'A'}
              </div>
            )}
            {/* Badge Overlay */}
            <div className="absolute bottom-[-15px] right-[-10px]">
              <RoleBadge role={role} size="lg" showText={false} className="border-2 border-white dark:border-slate-900 rounded-full" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">{name}</p>
            <RoleBadge role={role} showText={true} className="mt-0.5" />
          </div>
        </div>
      </div>
    </aside>
  );
}
