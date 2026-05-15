"use server";

import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function getRequesterRole(): Promise<string | null> {
  const { userId } = await auth();
  if (!userId) return null;
  const supabase = getSupabase();
  const { data } = await supabase.from("profiles").select("role").eq("id", userId).single();
  return data?.role ?? null;
}

async function isAdministrator(userId: string) {
  const supabase = getSupabase();
  const { data } = await supabase.from("profiles").select("role").eq("id", userId).single();
  return data?.role === "administrator";
}

// ─── Search user by email ────────────────────────────────────────────────────
export async function searchUserByEmail(email: string) {
  try {
    const requesterRole = await getRequesterRole();
    if (!requesterRole || (requesterRole !== "admin" && requesterRole !== "team" && requesterRole !== "administrator")) {
      return { success: false, error: "Unauthorized" };
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, full_name, role, image_url, created_at")
      .ilike("email", `%${email}%`)
      .limit(5);

    if (error) throw error;
    return { success: true, users: data ?? [] };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// ─── Update user role to 'team' ──────────────────────────────────────────────
export async function updateRoleToTeam(targetUserId: string) {
  try {
    const requesterRole = await getRequesterRole();
    if (requesterRole !== "admin" && requesterRole !== "administrator") return { success: false, error: "Only admins can assign team roles." };

    if (await isAdministrator(targetUserId)) {
      return { success: false, error: "Cannot modify an Administrator." };
    }

    const supabase = getSupabase();
    const { error } = await supabase
      .from("profiles")
      .update({ role: "team" })
      .eq("id", targetUserId);

    if (error) throw error;
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// ─── Update user role to 'admin' ─────────────────────────────────────────────
export async function updateRoleToAdmin(targetUserId: string) {
  try {
    const requesterRole = await getRequesterRole();
    if (requesterRole !== "admin" && requesterRole !== "administrator") return { success: false, error: "Only admins can assign admin roles." };

    if (await isAdministrator(targetUserId)) {
      return { success: false, error: "Cannot modify an Administrator." };
    }

    const supabase = getSupabase();
    const { error } = await supabase
      .from("profiles")
      .update({ role: "admin" })
      .eq("id", targetUserId);

    if (error) throw error;
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// ─── Remove team/admin role (back to user) ──────────────────────────────────
export async function demoteToUser(targetUserId: string) {
  try {
    const requesterRole = await getRequesterRole();
    if (requesterRole !== "admin" && requesterRole !== "administrator") return { success: false, error: "Only admins can demote members." };

    if (await isAdministrator(targetUserId)) {
      return { success: false, error: "Cannot modify an Administrator." };
    }

    const supabase = getSupabase();
    const { error } = await supabase
      .from("profiles")
      .update({ role: "user" })
      .eq("id", targetUserId);

    if (error) throw error;
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// ─── Get all team members (admin + team) ────────────────────────────────────
export async function getAllTeamMembers() {
  try {
    const requesterRole = await getRequesterRole();
    if (requesterRole !== "admin" && requesterRole !== "administrator") return { success: false, error: "Unauthorized" };

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, full_name, role, image_url, created_at")
      .in("role", ["administrator", "admin", "team"])
      .order("role", { ascending: true });

    if (error) throw error;
    
    return { success: true, users: data ?? [] };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// ─── Fetch table data for DB explorer ───────────────────────────────────────
const ALLOWED_TABLES = ["profiles", "blogs", "site_stats", "indexed_urls"] as const;
type AllowedTable = (typeof ALLOWED_TABLES)[number];

export async function fetchTableData(tableName: string): Promise<{ success: true; rows: any[]; count: number } | { success: false; error: string }> {
  try {
    const requesterRole = await getRequesterRole();
    if (!requesterRole || (requesterRole !== "admin" && requesterRole !== "administrator" && requesterRole !== "team")) {
      return { success: false, error: "Unauthorized" };
    }

    if (!ALLOWED_TABLES.includes(tableName as AllowedTable)) {
      return { success: false, error: `Table '${tableName}' is not allowed.` };
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from(tableName as AllowedTable)
      .select("*")
      .limit(100);

    if (error) throw error;
    
    const sortedData = data && data.length > 0 && "created_at" in data[0] 
      ? [...data].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      : data;

    return { success: true, rows: sortedData ?? [], count: sortedData?.length ?? 0 };
  } catch (e: any) {
    console.error(`[DB Explorer] Error fetching ${tableName}:`, e.message);
    return { success: false, error: e.message };
  }
}

// ─── Get current user's role + profile ──────────────────────────────────────
export async function getCurrentUserProfile() {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Not authenticated" };

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, full_name, role, image_url")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return { success: true, profile: data };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
