import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const STAFF_ROLES = ['admin', 'administrator', 'superadmin', 'team', 'accountant'];

export async function GET() {
  try {
    const authState = await auth();
    const userId = authState.userId;

    if (!userId) {
      return NextResponse.json({ role: 'user', isAdmin: false });
    }

    // 1. Check Clerk Claims
    const claims = authState.sessionClaims as any;
    const clerkRole = (claims?.publicMetadata?.role || claims?.metadata?.role || claims?.role)?.toString().toLowerCase();
    if (clerkRole && STAFF_ROLES.includes(clerkRole)) {
      return NextResponse.json({ role: clerkRole, isAdmin: true });
    }

    // 2. Check Supabase Database
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (!error && data?.role) {
        const role = data.role.toString().toLowerCase();
        const isAdmin = STAFF_ROLES.includes(role);
        return NextResponse.json({ role, isAdmin });
      }
    }

    return NextResponse.json({ role: clerkRole || 'user', isAdmin: false });
  } catch (err: any) {
    return NextResponse.json({ role: 'user', isAdmin: false, error: err.message });
  }
}
