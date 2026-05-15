import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import AdminSidebar from '@/components/admin/AdminSidebar';
import MobileTopBar from '@/components/admin/MobileTopBar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Extract userId from Clerk
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Initialize Supabase Client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  // Use service role key to bypass RLS, ensuring we can verify the profile securely. 
  // If you don't have it, fallback to ANON_KEY.
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Authenticate user role
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  // Redirect non-staff instantly to the public homepage
  const isStaff = profile?.role === 'admin' || profile?.role === 'team' || profile?.role === 'administrator';
  if (error || !profile || !isStaff) {
    redirect('/');
  }

  // Render Admin Layout if user is an admin
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900 font-sans overflow-hidden">
      <AdminSidebar />
      <MobileTopBar />
      
      <main className="flex-1 flex flex-col min-h-0 mt-[73px] md:mt-0 w-full transition-all duration-300 overflow-y-auto">
        <div className="p-4 md:p-8 pb-24 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
