"use server";

import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

// We use service role to ensure logs are always written regardless of user RLS
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export type ActionType = 
  | 'INDEX_URLS'
  | 'ADD_IMAGE'
  | 'DELETE_IMAGE'
  | 'ADD_PRODUCT'
  | 'EDIT_PRODUCT'
  | 'DELETE_PRODUCT'
  | 'UPDATE_ROLE';

export async function logAdminActivity(actionType: ActionType, details: Record<string, any> = {}) {
  try {
    const { userId } = await auth();
    if (!userId) return; // Only log authenticated actions

    const supabase = getSupabaseAdmin();

    // 1. Log the activity
    await supabase.from("admin_logs").insert({
      user_id: userId,
      action_type: actionType,
      details: details,
    });

    // 2. Update their last active status
    await supabase.from("profiles").update({
      last_active_at: new Date().toISOString()
    }).eq("id", userId);

  } catch (error) {
    console.error("[Activity Logger] Failed to log activity:", error);
    // We intentionally don't throw, as logging shouldn't crash the main app
  }
}

export async function updateLastActive() {
  try {
    const { userId } = await auth();
    if (!userId) return;

    const supabase = getSupabaseAdmin();
    await supabase.from("profiles").update({
      last_active_at: new Date().toISOString()
    }).eq("id", userId);
  } catch (error) {
    console.error("[Activity Logger] Failed to update last active:", error);
  }
}

export async function trackAdminSession() {
  try {
    const { userId } = await auth();
    if (!userId) return;

    const supabase = getSupabaseAdmin();
    
    // 1. Update online status
    await supabase.from("profiles").update({
      last_active_at: new Date().toISOString()
    }).eq("id", userId);

    // 2. Cleanup old logs (older than 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    await supabase.from("admin_logs")
      .delete()
      .lt("created_at", thirtyDaysAgo.toISOString());
      
  } catch (error) {
    console.error("[Activity Logger] Failed to track session:", error);
  }
}
