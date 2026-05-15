"use server";
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

export async function checkIsAdmin() {
  try {
    const { userId } = await auth();
    if (!userId) return false;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (error) {
      console.error("Error fetching user role:", error);
      return false;
    }

    const isStaff = data?.role === 'admin' || data?.role === 'administrator' || data?.role === 'team';
    return isStaff;
  } catch (error) {
    console.error("Server Action checkIsAdmin error:", error);
    return false;
  }
}

export async function getUserRole() {
  try {
    const { userId } = await auth();
    if (!userId) return null;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    return data?.role || 'user';
  } catch (error) {
    return 'user';
  }
}