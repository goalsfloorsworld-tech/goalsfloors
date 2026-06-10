import { createClient } from "@supabase/supabase-js";

// Use placeholder strings during build time to prevent build failures if env vars are missing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

// We use the service role key to bypass RLS during server-side insertions in the API route.
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
