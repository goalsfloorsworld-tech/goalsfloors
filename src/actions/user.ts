"use server";
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

export async function checkIsAdmin() {
  try {
    const { userId } = await auth();
    if (!userId) return false;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    // Use service role key to bypass RLS
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

    return data?.role === 'admin';
  } catch (error) {
    console.error("Server Action checkIsAdmin error:", error);
    return false;
  }
}