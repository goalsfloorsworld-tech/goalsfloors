"use server";

import { createClient } from "@supabase/supabase-js";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { logAdminActivity } from "./logger";

function getMainSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Unused import removed
// Unused finance supabase client removed

async function getRequesterRole(): Promise<string | null> {
  const { userId } = await auth();
  if (!userId) return null;
  const supabase = getMainSupabase();
  const { data } = await supabase.from("profiles").select("role").eq("id", userId).single();
  return data?.role ?? null;
}

async function getRequesterEmail(): Promise<string | null> {
  const { userId } = await auth();
  if (!userId) return null;
  const supabase = getMainSupabase();
  const { data } = await supabase.from("profiles").select("email").eq("id", userId).single();
  return data?.email ?? null;
}

