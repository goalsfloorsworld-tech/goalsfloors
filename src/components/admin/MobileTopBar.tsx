"use client";
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Menu, X, LayoutDashboard, FileText, BarChart3, Settings, Globe } from 'lucide-react';

export default function MobileTopBar() {
  const [isOpen, setIsOpen] = useState(false);
  const scrollYRef = useRef(0);

  useEffect(() => {
    if (!isOpen) return;

    const html = document.documentElement;
    const body = document.body;

    scrollYRef.current = window.scrollY;

    const prevHtmlOverflow = html.style.overflow;
    const prevBodyPosition = body.style.position;
    const prevBodyTop = body.style.top;
    const prevBodyLeft = body.style.left;
    const prevBodyRight = body.style.right;
    const prevBodyWidth = body.style.width;

    html.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${scrollYRef.current}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.position = prevBodyPosition;
      body.style.top = prevBodyTop;
      body.style.left = prevBodyLeft;
      body.style.right = prevBodyRight;
      body.style.width = prevBodyWidth;
      window.scrollTo(0, scrollYRef.current);
    };
  }, [isOpen]);

  return (
    <div className="md:hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-gray-800 text-slate-900 dark:text-slate-100 fixed top-0 w-full z-50">
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-emerald-500">
          Admin Panel
        </h2>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="p-2 bg-gray-100 dark:bg-slate-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-600 dark:text-slate-400"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Drawer Overlay & Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
          <div 
            className="fixed right-0 top-[73px] bottom-0 w-64 bg-white dark:bg-slate-950 border-l border-gray-200 dark:border-gray-800 p-4 shadow-2xl flex flex-col overflow-y-auto overscroll-contain"
            onClick={(e) => e.stopPropagation()}
          >
            {/* View Site Link */}
            <div className="pb-4 border-b border-gray-200 dark:border-gray-800">
              <Link href="/" target="_blank" className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-slate-900 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300 font-medium text-sm border border-gray-200 dark:border-gray-700 shadow-sm">
                <Globe size={18} className="text-blue-500 dark:text-blue-400" />
                <span>View Live Site</span>
              </Link>
            </div>

            <nav className="flex-1 space-y-2 mt-4">
              <Link href="/admin" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-900 transition-colors text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
                <LayoutDashboard size={20} />
                <span className="font-medium">Dashboard</span>
              </Link>
              <Link href="/admin/blogs" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-900 transition-colors text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
                <FileText size={20} />
                <span className="font-medium">Blogs</span>
              </Link>
              <Link href="/admin/analytics" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-900 transition-colors text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
                <BarChart3 size={20} />
                <span className="font-medium">Analytics</span>
              </Link>
            </nav>
            <div className="mt-auto border-t border-gray-200 dark:border-gray-800 pt-4">
              <Link href="/admin/settings" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-900 transition-colors text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
                <Settings size={20} />
                <span className="font-medium">Settings</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
