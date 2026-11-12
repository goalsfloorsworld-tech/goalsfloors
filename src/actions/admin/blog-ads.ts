"use server";

import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { logAdminActivity } from "./logger";
import {
  type BlogSideAdItem,
  type BlogSideAdsConfig,
  DEFAULT_BLOG_SIDE_ADS,
} from "@/lib/blog/ads";

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function verifyAdminRole(): Promise<{ userId: string; role: string } | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  const role = data?.role;
  if (!role || (role !== "admin" && role !== "administrator" && role !== "team")) {
    return null;
  }

  return { userId, role };
}

/**
 * Fetch the active Blog Side Ads config.
 * Falls back to default high-converting ads if none exist in the database yet.
 */
export async function getBlogSideAdsConfig(): Promise<BlogSideAdsConfig> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("promo_sections")
      .select("props_json, updated_at")
      .eq("template_id", "blog_side_ads")
      .eq("status", "published")
      .maybeSingle();

    if (error || !data || !data.props_json) {
      return DEFAULT_BLOG_SIDE_ADS;
    }

    const raw = data.props_json as Partial<BlogSideAdsConfig>;
    return {
      left_ad: {
        ...DEFAULT_BLOG_SIDE_ADS.left_ad,
        ...(raw.left_ad || {}),
      },
      right_ad: {
        ...DEFAULT_BLOG_SIDE_ADS.right_ad,
        ...(raw.right_ad || {}),
      },
      updated_at: data.updated_at,
    };
  } catch (err) {
    console.error("Error fetching blog side ads config:", err);
    return DEFAULT_BLOG_SIDE_ADS;
  }
}

/**
 * Save / Update Blog Side Ads config from Admin.
 */
export async function saveBlogSideAdsConfig(
  config: BlogSideAdsConfig
): Promise<{ success: boolean; error?: string }> {
  try {
    const admin = await verifyAdminRole();
    if (!admin) {
      return { success: false, error: "Unauthorized: Admin access required." };
    }

    const supabase = getSupabaseAdmin();

    const { data: existing } = await supabase
      .from("promo_sections")
      .select("id")
      .eq("template_id", "blog_side_ads")
      .maybeSingle();

    const payload = {
      name: "Blog Desktop Side Ads",
      template_id: "blog_side_ads",
      props_json: {
        left_ad: config.left_ad,
        right_ad: config.right_ad,
      },
      status: "published",
      priority: 1,
      updated_at: new Date().toISOString(),
    };

    if (existing?.id) {
      const { error: updateErr } = await supabase
        .from("promo_sections")
        .update(payload)
        .eq("id", existing.id);

      if (updateErr) throw updateErr;
    } else {
      const { error: insertErr } = await supabase.from("promo_sections").insert({
        ...payload,
        created_by: admin.userId,
      });

      if (insertErr) throw insertErr;
    }

    // Invalidate blog pages cache
    revalidatePath("/blogs/[slug]", "page");
    revalidatePath("/blogs");

    await logAdminActivity("SAVE_PROMO_SECTION", {
      type: "blog_side_ads",
      left_enabled: config.left_ad.enabled,
      right_enabled: config.right_ad.enabled,
    });

    return { success: true };
  } catch (err: unknown) {
    console.error("Failed to save blog side ads config:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to save blog side ads",
    };
  }
}
