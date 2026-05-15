"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, X, LayoutDashboard, FileText, BarChart3, 
  Globe, Rocket, ShoppingBag, Database, UserPlus, Loader2 
} from 'lucide-react';

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

export default function MobileTopBar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [loadingPath, setLoadingPath] = useState<string | null>(null);
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

  // Reset loading state when pathname changes and close menu
  useEffect(() => {
    setLoadingPath(null);
    setIsOpen(false);
  }, [pathname]);

  const MobileLink = ({ item }: { item: typeof NAV_ITEMS[0] }) => {
    const isActive = pathname === item.href;
    const isLoading = loadingPath === item.href;

    return (
      <Link 
        href={item.href} 
        onClick={() => {
          if (pathname !== item.href) setLoadingPath(item.href);
          // Don't close immediately if we want to see the spinner
          // The useEffect on pathname will close it
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

            <nav className="flex-1 space-y-1 mt-4">
              {NAV_ITEMS.map((item) => (
                <MobileLink key={item.href} item={item} />
              ))}
              
              <div className="pt-4 pb-2">
                <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Admin Tools</p>
              </div>
              
              {ADMIN_TOOLS.map((item) => (
                <MobileLink key={item.href} item={item} />
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
