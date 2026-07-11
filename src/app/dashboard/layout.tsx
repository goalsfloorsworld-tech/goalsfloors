import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const { data: dealer, error } = await supabaseAdmin
    .from('dealers')
    .select('*')
    .eq('clerk_user_id', userId)
    .single();

  if (error || !dealer) {
    redirect('/dealer');
  }

  if (!dealer.is_approved) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#050810] p-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-800 p-8 md:p-12 text-center animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 mx-auto mb-6 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
            <Clock className="w-10 h-10 text-amber-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">Application Under Review</h1>
          <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed mb-8">
            Our team is reviewing your application. You will receive an email once approved.
          </p>
          <Link 
            href="/"
            className="inline-flex w-full py-4 bg-slate-900 dark:bg-amber-600 text-white font-bold uppercase tracking-widest text-xs rounded-xl shadow-lg hover:shadow-xl transition-all items-center justify-center"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // Approved Dealer Dashboard Layout
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050810] flex">
      <DashboardSidebar 
        businessName={dealer.business_name} 
        slug={dealer.slug} 
      />

      {/* Main Content */}
      <main className="flex-1 md:ml-64 w-full h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
