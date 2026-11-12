"use server";
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

const STAFF_ROLES = ['admin', 'administrator', 'superadmin', 'team', 'accountant'];

export async function checkIsAdmin() {
  try {
    const authState = await auth();
    const userId = authState.userId;
    if (!userId) return false;

    // 1. Check Clerk sessionClaims/metadata first (Instant)
    const claims = authState.sessionClaims as any;
    const clerkRole = (claims?.publicMetadata?.role || claims?.metadata?.role || claims?.role)?.toString().toLowerCase();
    if (clerkRole && STAFF_ROLES.includes(clerkRole)) {
      return true;
    }

    // 2. Check Supabase profiles table
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    if (!supabaseUrl || !supabaseKey) return false;

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return false;
    }

    const role = data?.role?.toString().toLowerCase();
    return Boolean(role && STAFF_ROLES.includes(role));
  } catch (error) {
    console.error("Server Action checkIsAdmin error:", error);
    return false;
  }
}

export async function getUserRole() {
  try {
    const authState = await auth();
    const userId = authState.userId;
    if (!userId) return null;

    // 1. Check Clerk claims
    const claims = authState.sessionClaims as any;
    const clerkRole = (claims?.publicMetadata?.role || claims?.metadata?.role || claims?.role)?.toString().toLowerCase();
    if (clerkRole) return clerkRole;

    // 2. Check Supabase profiles table
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    if (!supabaseUrl || !supabaseKey) return 'user';

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    return data?.role?.toString().toLowerCase() || 'user';
  } catch (error) {
    return 'user';
  }
}