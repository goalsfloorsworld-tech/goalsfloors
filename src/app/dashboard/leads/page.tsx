import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import Link from 'next/link';
import { Users, Phone, Calendar } from 'lucide-react';

export default async function DealerLeadsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const { data: dealer } = await supabaseAdmin
    .from('dealers')
    .select('id')
    .eq('clerk_user_id', userId)
    .single();

  if (!dealer) {
    redirect('/dealer');
  }

  const { data: leads, error } = await supabaseAdmin
    .from('leads')
    .select('*')
    .eq('dealer_id', dealer.id)
    .order('created_at', { ascending: false });

  const totalLeads = leads?.length || 0;

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto w-full animate-in fade-in duration-500">
      <div className="mb-8 flex flex-col md:flex-row md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Leads</h1>
            <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500 text-xs font-bold rounded-full">
              {totalLeads} Total
            </span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">All inquiries received from your public page</p>
        </div>
      </div>

      {totalLeads === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-[2rem] p-12 text-center shadow-sm">
          <div className="w-20 h-20 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">No leads yet</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-8">
            Once your public page is live and visible on Google, leads will appear here. Ensure your profile is fully complete.
          </p>
          <Link 
            href="/dashboard/profile"
            className="inline-flex py-4 px-8 bg-slate-900 dark:bg-amber-600 text-white font-bold uppercase tracking-widest text-xs rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            Go to Profile
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-[2rem] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-slate-950 border-b border-gray-200 dark:border-slate-800">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Customer Name</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Phone</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Message</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Received</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-800/50">
                  {leads?.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="px-6 py-5">
                        <div className="font-bold text-slate-900 dark:text-white">{lead.customer_name}</div>
                      </td>
                      <td className="px-6 py-5">
                        <a href={`tel:${lead.customer_phone}`} className="inline-flex items-center gap-2 text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors">
                          <Phone className="w-3 h-3" /> {lead.customer_phone}
                        </a>
                      </td>
                      <td className="px-6 py-5">
                        {lead.customer_message ? (
                          <div 
                            className="text-sm text-slate-600 dark:text-slate-400 max-w-xs truncate"
                            title={lead.customer_message}
                          >
                            {lead.customer_message.length > 80 
                              ? `${lead.customer_message.substring(0, 80)}...` 
                              : lead.customer_message}
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400 italic">No message</span>
                        )}
                      </td>
                      <td className="px-6 py-5">
                        <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {new Date(lead.created_at).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {leads?.map((lead) => (
              <div key={lead.id} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">{lead.customer_name}</h3>
                  <div className="text-xs font-medium text-slate-500">
                    {new Date(lead.created_at).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric'
                    })}
                  </div>
                </div>
                
                <a href={`tel:${lead.customer_phone}`} className="inline-flex items-center gap-2 text-sm font-bold text-amber-600 mb-4 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-lg">
                  <Phone className="w-4 h-4" /> {lead.customer_phone}
                </a>

                {lead.customer_message && (
                  <div className="text-sm text-slate-600 dark:text-slate-400 bg-gray-50 dark:bg-slate-950 p-3 rounded-xl border border-gray-100 dark:border-slate-800">
                    &quot;{lead.customer_message}&quot;
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
