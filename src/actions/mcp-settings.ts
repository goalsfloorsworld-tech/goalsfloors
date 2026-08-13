"use server";

import { createClient } from "@supabase/supabase-js";
import { getCurrentUserProfile } from "@/actions/admin-core";
import crypto from "crypto";

const financeSupabaseUrl = process.env.NEXT_PUBLIC_FINANCE_SUPABASE_URL || "";
const financeSupabaseKey = process.env.FINANCE_SUPABASE_SERVICE_ROLE_KEY || "";

const supabase = createClient(financeSupabaseUrl, financeSupabaseKey);

export async function getMcpToken() {
  try {
    const authRes = await getCurrentUserProfile();
    if (!authRes.success || authRes.profile?.role !== "administrator") {
      return { success: false, error: "Unauthorized access. Strict administrator privileges required." };
    }

    const { data, error } = await supabase
      .from("mcp_settings")
      .select("active_token")
      .eq("id", 1)
      .single();

    if (error) {
      console.error("[getMcpToken] Error fetching token:", error);
      return { success: false, error: "Failed to retrieve MCP token." };
    }

    return { success: true, token: data?.active_token || null };
  } catch (error: any) {
    console.error("[getMcpToken] Exception:", error);
    return { success: false, error: "An unexpected error occurred while fetching the token." };
  }
}

export async function generateNewMcpToken() {
  try {
    const authRes = await getCurrentUserProfile();
    if (!authRes.success || authRes.profile?.role !== "administrator") {
      return { success: false, error: "Unauthorized access. Strict administrator privileges required." };
    }

    // Generate a secure 32-byte hex string (64 characters) prefixed with gf_mcp_
    const rawKey = crypto.randomBytes(32).toString("hex");
    const newToken = `gf_mcp_${rawKey}`;

    const { data, error } = await supabase
      .from("mcp_settings")
      .update({ active_token: newToken, updated_at: new Date().toISOString() })
      .eq("id", 1)
      .select("active_token")
      .single();

    if (error) {
      console.error("[generateNewMcpToken] Error updating token:", error);
      return { success: false, error: "Failed to generate and save new MCP token." };
    }

    return { success: true, token: data?.active_token };
  } catch (error: any) {
    console.error("[generateNewMcpToken] Exception:", error);
    return { success: false, error: "An unexpected error occurred while generating the token." };
  }
}
