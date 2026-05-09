import Link from 'next/link';
import { LayoutDashboard, FileText, BarChart3, Settings, Globe } from 'lucide-react';

export default function AdminSidebar() {
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

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-900 transition-colors text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
          <LayoutDashboard size={20} />
          <span className="font-medium">Dashboard</span>
        </Link>
        <Link href="/admin/blogs" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-900 transition-colors text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
          <FileText size={20} />
          <span className="font-medium">Blogs</span>
        </Link>
        <Link href="/admin/analytics" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-900 transition-colors text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
          <BarChart3 size={20} />
          <span className="font-medium">Analytics</span>
        </Link>
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-900 transition-colors text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </Link>
      </div>
    </aside>
  );
}
