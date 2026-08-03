"use server";

import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";
import { getCurrentUserProfile } from "./admin-core";

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function getActivityLogs() {
  try {
    const userRes = await getCurrentUserProfile();
    if (!userRes.success || userRes.profile?.role !== "administrator") {
      return { success: false, error: "Unauthorized access" };
    }

    const supabase = getSupabaseAdmin();
    
    // Fetch logs with user profile info
    const { data: logs, error: logsError } = await supabase
      .from("admin_logs")
      .select(`
        *,
        profiles:user_id ( full_name, email, image_url, role, last_active_at )
      `)
      .order("created_at", { ascending: false })
      .limit(100);

    if (logsError) throw logsError;

    // Fetch team statuses
    const { data: team, error: teamError } = await supabase
      .from("profiles")
      .select("id, full_name, email, image_url, role, last_active_at")
      .in("role", ["administrator", "admin", "team"])
      .order("last_active_at", { ascending: false, nullsFirst: false });
      
    if (teamError) throw teamError;

    return { success: true, logs: logs || [], team: team || [] };
  } catch (error: any) {
    console.error("Failed to fetch activity logs:", error);
    return { success: false, error: error.message };
  }
}
