"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, UserCircle, Image as ImageIcon, Users, ExternalLink } from 'lucide-react';

interface DashboardSidebarProps {
  businessName: string;
  slug: string;
}

export default function DashboardSidebar({ businessName, slug }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 hidden md:flex flex-col fixed inset-y-0 z-10">
      <div className="p-6 border-b border-gray-200 dark:border-slate-800">
        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight truncate">
          {businessName}
        </h2>
        <p className="text-xs text-amber-600 font-bold uppercase tracking-widest mt-1">Dealer Portal</p>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <Link 
          href="/dashboard" 
          className={`flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-colors ${
            pathname === '/dashboard'
              ? 'text-amber-600 bg-amber-50 dark:bg-amber-900/10'
              : 'text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/10'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" /> Overview
        </Link>
        <Link 
          href="/dashboard/profile" 
          className={`flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-colors ${
            pathname === '/dashboard/profile'
              ? 'text-amber-600 bg-amber-50 dark:bg-amber-900/10'
              : 'text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/10'
          }`}
        >
          <UserCircle className="w-5 h-5" /> My Profile
        </Link>
        <Link 
          href="/dashboard/gallery" 
          className={`flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-colors ${
            pathname === '/dashboard/gallery'
              ? 'text-amber-600 bg-amber-50 dark:bg-amber-900/10'
              : 'text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/10'
          }`}
        >
          <ImageIcon className="w-5 h-5" /> Gallery
        </Link>
        <Link 
          href="/dashboard/leads" 
          className={`flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-colors ${
            pathname === '/dashboard/leads'
              ? 'text-amber-600 bg-amber-50 dark:bg-amber-900/10'
              : 'text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/10'
          }`}
        >
          <Users className="w-5 h-5" /> Leads
        </Link>
        <a 
          href={`/dealers/${slug}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/10 rounded-xl transition-colors"
        >
          <ExternalLink className="w-5 h-5" /> View Public Page
        </a>
      </nav>

      <div className="p-6 border-t border-gray-200 dark:border-slate-800">
        <Link href="/">
           <Image src="/images/goals floors logo.svg" alt="Goals Floors" width={120} height={30} className="w-24 opacity-50 hover:opacity-100 transition-opacity dark:hidden" />
           <Image src="/images/goals-floors-logo-white.svg" alt="Goals Floors" width={120} height={30} className="w-24 opacity-50 hover:opacity-100 transition-opacity hidden dark:block" />
        </Link>
      </div>
    </aside>
  );
}
