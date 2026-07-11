import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import Link from 'next/link';
import { Users, Image as ImageIcon, ExternalLink, ArrowRight, User } from 'lucide-react';

export default async function DashboardOverview() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  const { data: dealer } = await supabaseAdmin
    .from('dealers')
    .select('*')
    .eq('clerk_user_id', userId)
    .single();

  if (!dealer) {
    redirect('/dealer');
  }

  const { count: imagesCount } = await supabaseAdmin
    .from('project_images')
    .select('*', { count: 'exact', head: true })
    .eq('dealer_id', dealer.id);

  const { count: leadsCount, data: recentLeads } = await supabaseAdmin
    .from('leads')
    .select('*', { count: 'exact' })
    .eq('dealer_id', dealer.id)
    .order('created_at', { ascending: false })
    .limit(3);

  const fields = [
    !!dealer.business_name,
    !!dealer.tagline,
    !!dealer.area,
    !!dealer.city,
    !!dealer.phone,
    !!dealer.whatsapp_number,
    !!dealer.description,
    Array.isArray(dealer.products) && dealer.products.length > 0
  ];
  
  const filledFields = fields.filter(Boolean).length;
  const completionPercentage = Math.round((filledFields / 8) * 100);
  const isLive = dealer.profile_complete;

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto w-full animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Overview</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Welcome back, {dealer.business_name}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-full px-4 py-2 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Public Page:</span>
            {isLive ? (
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Live
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> Incomplete
              </span>
            )}
          </div>
          {isLive && (
            <a 
              href={`/dealers/${dealer.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full hover:bg-amber-600 dark:hover:bg-amber-500 transition-colors"
              title="View Public Page"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Profile Status Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-gray-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <User className="w-16 h-16 text-amber-500" />
          </div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Profile Completion</h3>
          <div className="flex items-end gap-2 mb-4">
            <span className="text-4xl font-black text-slate-900 dark:text-white">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2 mb-6">
            <div className="bg-amber-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${completionPercentage}%` }}></div>
          </div>
          <Link 
            href="/dashboard/profile"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-600 hover:text-amber-700 transition-colors"
          >
            Complete Your Profile <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Leads Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-gray-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <Users className="w-16 h-16 text-emerald-500" />
          </div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Total Leads</h3>
          <div className="flex items-end gap-2 mb-6">
            <span className="text-4xl font-black text-slate-900 dark:text-white">{leadsCount || 0}</span>
          </div>
          <Link 
            href="/dashboard/leads"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            View All Leads <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Photos Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-gray-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <ImageIcon className="w-16 h-16 text-blue-500" />
          </div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Photos Uploaded</h3>
          <div className="flex items-end gap-2 mb-6">
            <span className="text-4xl font-black text-slate-900 dark:text-white">{imagesCount || 0}</span>
            <span className="text-sm font-bold text-slate-400 mb-1">/ 10</span>
          </div>
          <Link 
            href="/dashboard/gallery"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors"
          >
            Manage Gallery <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Recent Leads */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">Recent Leads</h2>
          <Link href="/dashboard/leads" className="text-xs font-bold text-slate-500 hover:text-amber-600 uppercase tracking-widest transition-colors">
            View All
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-[2rem] overflow-hidden shadow-sm">
          {recentLeads && recentLeads.length > 0 ? (
            <div className="divide-y divide-gray-100 dark:divide-slate-800/50">
              {recentLeads.map((lead: any) => (
                <div key={lead.id} className="p-6 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-lg font-bold text-amber-600">
                        {lead.customer_name?.charAt(0)?.toUpperCase() || '?'}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">{lead.customer_name}</h4>
                      <p className="text-sm font-medium text-amber-600 mt-0.5">{lead.customer_phone}</p>
                      {lead.customer_message && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">&quot;{lead.customer_message}&quot;</p>
                      )}
                    </div>
                  </div>
                  <div className="text-left md:text-right">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Received</span>
                    <p className="text-sm font-medium text-slate-900 dark:text-white mt-1">
                      {new Date(lead.created_at).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No leads yet</h3>
              <p className="text-slate-500 max-w-sm mx-auto">
                Your public page will bring them in. Complete your profile to improve your visibility.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
