import { supabaseAdmin } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { Store, Check, X, ExternalLink, Calendar, MapPin, Phone, Package } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDealersPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const resolvedParams = await searchParams;
  const tab = resolvedParams?.tab || 'pending';

  const { data: dealers } = await supabaseAdmin
    .from('dealers')
    .select(`
      *,
      leads(count),
      project_images(count)
    `)
    .order('created_at', { ascending: false });

  const pendingDealers = dealers?.filter(d => !d.is_approved) || [];
  const activeDealers = dealers?.filter(d => d.is_approved) || [];

  async function approveDealerAction(formData: FormData) {
    'use server'
    const dealerId = formData.get('dealer_id') as string;
    
    await supabaseAdmin
      .from('dealers')
      .update({ is_approved: true })
      .eq('id', dealerId);
    
    // TODO: Send approval email via Resend
    // Fetch dealer email using clerk_user_id from Clerk API.
    
    revalidatePath('/admin/dealers');
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Dealer Management</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Review and manage dealer applications and profiles.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 mb-8">
        <Link 
          href="/admin/dealers"
          className={`px-5 py-2.5 rounded-full text-sm font-bold uppercase tracking-widest transition-all ${
            tab === 'pending' 
              ? 'bg-teal-500 text-white shadow-md shadow-teal-500/20' 
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:text-teal-600 dark:hover:text-teal-400 border border-gray-200 dark:border-slate-800'
          }`}
        >
          Pending ({pendingDealers.length})
        </Link>
        <Link 
          href="/admin/dealers?tab=active"
          className={`px-5 py-2.5 rounded-full text-sm font-bold uppercase tracking-widest transition-all ${
            tab === 'active' 
              ? 'bg-teal-500 text-white shadow-md shadow-teal-500/20' 
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:text-teal-600 dark:hover:text-teal-400 border border-gray-200 dark:border-slate-800'
          }`}
        >
          Active ({activeDealers.length})
        </Link>
      </div>

      {/* Content */}
      {tab === 'pending' && (
        <div className="space-y-4">
          {pendingDealers.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-[2rem] p-12 text-center shadow-sm">
              <Store className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No pending applications</h2>
              <p className="text-slate-500 text-sm">All dealer applications have been processed.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingDealers.map(dealer => (
                <div key={dealer.id} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{dealer.business_name}</h3>
                    <p className="text-[10px] text-slate-400 font-mono mb-4 bg-slate-50 dark:bg-slate-950 inline-block px-2 py-1 rounded">ID: {dealer.clerk_user_id}</p>
                    
                    <div className="space-y-2 mb-6">
                      {dealer.city && (
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <MapPin className="w-4 h-4 text-slate-400" /> {dealer.city}
                        </div>
                      )}
                      {dealer.phone && (
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <Phone className="w-4 h-4 text-slate-400" /> {dealer.phone}
                        </div>
                      )}
                      {dealer.products && Array.isArray(dealer.products) && dealer.products.length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <Package className="w-4 h-4 text-slate-400" /> {dealer.products.length} Products listed
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <Calendar className="w-4 h-4 text-slate-400" /> Applied: {new Date(dealer.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <form action={approveDealerAction}>
                    <input type="hidden" name="dealer_id" value={dealer.id} />
                    <button 
                      type="submit"
                      className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" /> Approve Dealer
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'active' && (
        <div>
          {activeDealers.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-[2rem] p-12 text-center shadow-sm">
              <Store className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No active dealers</h2>
              <p className="text-slate-500 text-sm">Approved dealers will appear here.</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-[2rem] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-slate-950 border-b border-gray-200 dark:border-slate-800">
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Business Name</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Location & Contact</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500 text-center">Profile</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500 text-center">Leads</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500 text-center">Photos</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-slate-800/50">
                    {activeDealers.map((dealer) => {
                      // Handle count from aggregated fields
                      const leadsCount = dealer.leads?.[0]?.count || 0;
                      const photosCount = dealer.project_images?.[0]?.count || 0;
                      
                      return (
                        <tr key={dealer.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/20 transition-colors">
                          <td className="px-6 py-5">
                            <Link 
                              href={`/dealers/${dealer.slug}`} 
                              target="_blank"
                              className="font-bold text-teal-600 hover:text-teal-700 dark:text-teal-500 dark:hover:text-teal-400 flex items-center gap-2 group"
                            >
                              {dealer.business_name}
                              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                            <p className="text-[10px] text-slate-400 mt-1">/{dealer.slug}</p>
                          </td>
                          <td className="px-6 py-5">
                            <div className="text-sm text-slate-900 dark:text-white font-medium">{dealer.city || 'N/A'}</div>
                            <div className="text-xs text-slate-500 mt-1">{dealer.phone || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-5 text-center">
                            {dealer.profile_complete ? (
                              <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                                <Check className="w-3 h-3" />
                              </div>
                            ) : (
                              <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                                <X className="w-3 h-3" />
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-5 text-center">
                            <span className="inline-flex px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-500 text-xs font-bold rounded-full">
                              {leadsCount}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <span className="inline-flex px-3 py-1 bg-gray-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-full">
                              {photosCount}/10
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
