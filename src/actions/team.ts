"use server";

import { createClient } from "@supabase/supabase-js";
import { auth, clerkClient } from "@clerk/nextjs/server";
import crypto from "crypto";
import { logAdminActivity } from "./logger";

function getMainSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function getFinanceSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_FINANCE_SUPABASE_URL!,
    process.env.FINANCE_SUPABASE_SERVICE_ROLE_KEY!
  );
}

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

export async function assignAccountantRole(targetUserId: string, email: string, pin: string) {
  try {
    const requesterRole = await getRequesterRole();
    if (requesterRole !== "admin" && requesterRole !== "administrator") {
      return { success: false, error: "Only admins can assign accountant roles." };
    }

    const adminEmail = await getRequesterEmail();
    if (!adminEmail) return { success: false, error: "Admin email not found." };

    // 1. Hash the PIN
    const hashedPassword = crypto.createHash("sha256").update(pin).digest("hex");

    // 2. Connect to DB-2 (Finance) and Upsert
    const financeDb = getFinanceSupabase();
    const { error: financeError } = await financeDb
      .from("accountant_credentials")
      .upsert({
        email,
        password_hash: hashedPassword,
        assigned_by: adminEmail,
        is_active: true,
        updated_at: new Date().toISOString()
      }, { onConflict: "email" });

    if (financeError) {
      console.error("Finance DB Error:", financeError);
      return { success: false, error: "Failed to securely save credentials to Finance Portal." };
    }

    // 3. Connect to DB-1 (Main) and update Profile Role
    const mainDb = getMainSupabase();
    const { error: mainError } = await mainDb
      .from("profiles")
      .update({ role: "accountant" })
      .eq("id", targetUserId);

    if (mainError) {
      console.error("Main DB Error:", mainError);
      return { success: false, error: "Failed to update role in Main Database." };
    }

    // 4. Update Clerk Public Metadata
    const clerk = await clerkClient();
    await clerk.users.updateUserMetadata(targetUserId, {
      publicMetadata: {
        role: "accountant"
      }
    });

    // 5. Log Activity
    await logAdminActivity("UPDATE_ROLE", { targetUserId, newRole: "accountant" });

    return { success: true };
  } catch (e: any) {
    console.error("Assign Accountant Error:", e);
    return { success: false, error: e.message || "An unexpected error occurred." };
  }
}
