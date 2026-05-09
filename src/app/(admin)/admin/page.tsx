import { Users, FileText, Eye } from 'lucide-react';
import { getPageViews } from '@/lib/ga';

export default async function AdminDashboard() {
  // Fetch views gracefully; will return "0" if permissions fail etc.
  const totalViews = await getPageViews(30);

  // Function to format big numbers (e.g. 1245 -> "1,245")
  const formatViews = (val: string) => {
    const num = parseInt(val, 10);
    if (isNaN(num)) return "0";
    return new Intl.NumberFormat('en-IN').format(num);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      {/* Greeting Section */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Welcome back, Admin 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Here&apos;s a quick overview of what&apos;s happening on your platform today.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        {/* Metric Card 1 (Dynamic View Data) */}
        <div className="p-6 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-gray-200 dark:border-gray-800 shadow-sm backdrop-blur-xl flex items-center justify-between transition-transform hover:-translate-y-1 hover:shadow-md duration-300">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Views</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatViews(totalViews)}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium bg-gray-100 dark:bg-slate-800 w-max px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-700">
              Last 30 Days
            </p>
          </div>
          <div className="p-4 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl shadow-inner">
            <Eye size={28} />
          </div>
        </div>

        {/* Metric Card 2 */}
        <div className="p-6 rounded-2xl bg-white/70 dark:bg-gray-900/70 border border-gray-200 dark:border-gray-800 shadow-sm backdrop-blur-xl flex items-center justify-between transition-transform hover:-translate-y-1 hover:shadow-md duration-300">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Blogs</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">1,245</p>
            <p className="text-sm text-green-500 dark:text-green-400 mt-2 flex items-center gap-1 font-medium bg-green-100/50 dark:bg-green-500/10 w-max px-2 py-0.5 rounded-full">
              +8 new this week
            </p>
          </div>
          <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl shadow-inner">
            <FileText size={28} />
          </div>
        </div>

        {/* Metric Card 3 */}
        <div className="p-6 rounded-2xl bg-white/70 dark:bg-gray-900/70 border border-gray-200 dark:border-gray-800 shadow-sm backdrop-blur-xl flex items-center justify-between transition-transform hover:-translate-y-1 hover:shadow-md duration-300">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Active Users</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">48,902</p>
            <p className="text-sm text-red-500 dark:text-red-400 mt-2 flex items-center gap-1 font-medium bg-red-100/50 dark:bg-red-500/10 w-max px-2 py-0.5 rounded-full">
              -2% vs last month
            </p>
          </div>
          <div className="p-4 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl shadow-inner">
            <Users size={28} />
          </div>
        </div>
      </div>
      
      {/* Empty State / Bottom Section Indicator */}
      <div className="mt-8 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 h-64 flex items-center justify-center bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm shadow-inner">
        <p className="text-gray-400 dark:text-gray-500 font-medium">Extra Dashboard Widgets (e.g., Charts) can be added here.</p>
      </div>
    </div>
  );
}
