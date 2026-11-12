"use server";

import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { logAdminActivity } from "./logger";

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
  if (!role || (role !== "admin" && role !== "administrator")) {
    return null;
  }

  return { userId, role };
}

export interface TrendingCardItem {
  number: string; // "01", "02", "03", "04"
  label: string; // e.g. "Wall Panels"
  title: string; // e.g. "Fluted Charcoal & WPC Wall Panels"
  image: string; // Cloudinary or secure image URL
  href: string; // Target product link, e.g. "/products/wall-panels"
}

export interface TrendingSectionSet {
  id: string;
  name: string; // Internal collection name, e.g. "Wall Panels & Festive Living"
  tagline: string; // e.g. "Trending Now"
  header_strip: string; // e.g. "MOST LOVED THIS SEASON"
  description: string; // e.g. "Most enquired floors and panels in Gurgaon and Delhi NCR."
  items: [TrendingCardItem, TrendingCardItem, TrendingCardItem, TrendingCardItem]; // Exactly 4 cards required
  status: "published" | "draft" | "archived";
  priority: number;
  created_at: string;
  updated_at: string;
}

export interface SaveTrendingSetInput {
  id?: string;
  name: string;
  tagline?: string;
  header_strip?: string;
  description: string;
  items: [TrendingCardItem, TrendingCardItem, TrendingCardItem, TrendingCardItem];
  status?: "published" | "draft" | "archived";
  priority?: number;
}

/**
 * Fetch all trending section sets for admin management
 */
export async function getAdminTrendingSections(): Promise<{
  success: boolean;
  sets: TrendingSectionSet[];
  error?: string;
}> {
  try {
    const authUser = await verifyAdminRole();
    if (!authUser) {
      return { success: false, sets: [], error: "Unauthorized access" };
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("promo_sections")
      .select("*")
      .eq("template_id", "trending_collection")
      .order("priority", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[admin-trending] getAdminTrendingSections error:", error.message);
      return { success: false, sets: [], error: error.message };
    }

    const sets: TrendingSectionSet[] = (data || []).map((row: Record<string, unknown>) => {
      const p = (row.props_json || {}) as Record<string, unknown>;
      return {
        id: String(row.id),
        name: String(row.name),
        tagline: String(p.tagline || "Trending Now"),
        header_strip: String(p.header_strip || "MOST LOVED THIS SEASON"),
        description: String(p.description || ""),
        items: p.items as [TrendingCardItem, TrendingCardItem, TrendingCardItem, TrendingCardItem],
        status: row.status as "published" | "draft" | "archived",
        priority: typeof row.priority === "number" ? row.priority : 0,
        created_at: String(row.created_at),
        updated_at: String(row.updated_at),
      };
    });

    return { success: true, sets };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[admin-trending] getAdminTrendingSections exception:", msg);
    return { success: false, sets: [], error: msg };
  }
}

/**
 * Public API to fetch published Trending Now collections for Homepage
 */
export async function getPublicTrendingSections(): Promise<{
  success: boolean;
  sets: TrendingSectionSet[];
}> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("promo_sections")
      .select("*")
      .eq("template_id", "trending_collection")
      .eq("status", "published")
      .order("priority", { ascending: true })
      .order("created_at", { ascending: false });

    if (error || !data) {
      return { success: false, sets: [] };
    }

    const sets: TrendingSectionSet[] = data
      .map((row: Record<string, unknown>) => {
        const p = (row.props_json || {}) as Record<string, unknown>;
        if (!p.items || !Array.isArray(p.items) || p.items.length !== 4) {
          return null;
        }
        return {
          id: String(row.id),
          name: String(row.name),
          tagline: String(p.tagline || "Trending Now"),
          header_strip: String(p.header_strip || "MOST LOVED THIS SEASON"),
          description: String(p.description || ""),
          items: p.items as [TrendingCardItem, TrendingCardItem, TrendingCardItem, TrendingCardItem],
          status: row.status as "published" | "draft" | "archived",
          priority: typeof row.priority === "number" ? row.priority : 0,
          created_at: String(row.created_at),
          updated_at: String(row.updated_at),
        };
      })
      .filter((s): s is TrendingSectionSet => s !== null);

    return { success: true, sets };
  } catch (err) {
    console.error("getPublicTrendingSections error:", err);
    return { success: false, sets: [] };
  }
}

/**
 * Save / Create / Update a Trending Section Set with strict validation:
 * - Exactly 4 items required
 * - Every item must have valid number, non-empty label, non-empty title, valid image URL, and target href
 * - Block submission if any image URL is missing or invalid
 */
export async function saveTrendingSection(
  input: SaveTrendingSetInput
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const authUser = await verifyAdminRole();
    if (!authUser) {
      return { success: false, error: "Unauthorized: Admin privileges required." };
    }

    // 1. Basic field checks
    if (!input.name || input.name.trim().length === 0) {
      return { success: false, error: "Collection name is required." };
    }

    if (!input.description || input.description.trim().length === 0) {
      return { success: false, error: "Collection description is required." };
    }

    // 2. Strict 4-Item validation
    if (!input.items || !Array.isArray(input.items) || input.items.length !== 4) {
      return {
        success: false,
        error: "Har set me exactly 4 images honi chahiye (01, 02, 03, 04). Ek bhi image missing nahi ho sakti.",
      };
    }

    // Validate each of the 4 cards
    for (let i = 0; i < input.items.length; i++) {
      const card = input.items[i];
      const cardNum = card.number || `0${i + 1}`;

      if (!card.image || card.image.trim().length === 0) {
        return {
          success: false,
          error: `Card ${cardNum} me image missing hai! Saare 4 images add karna compulsory hai.`,
        };
      }

      // Check if image URL is valid http/https
      try {
        const parsed = new URL(card.image.trim());
        if (!["http:", "https:"].includes(parsed.protocol)) {
          throw new Error("Invalid protocol");
        }
      } catch {
        return {
          success: false,
          error: `Card ${cardNum} ki image URL invalid hai: "${card.image}". Kripya sahi Cloudinary image select karein.`,
        };
      }

      if (!card.label || card.label.trim().length === 0) {
        return {
          success: false,
          error: `Card ${cardNum} ka label (e.g. "Wall Panels") compulsory hai.`,
        };
      }

      if (!card.title || card.title.trim().length === 0) {
        return {
          success: false,
          error: `Card ${cardNum} ka title compulsory hai.`,
        };
      }

      if (!card.href || card.href.trim().length === 0) {
        return {
          success: false,
          error: `Card ${cardNum} ka target product link compulsory hai.`,
        };
      }
    }

    const supabase = getSupabaseAdmin();
    const propsJson = {
      tagline: (input.tagline || "Trending Now").trim(),
      header_strip: (input.header_strip || "MOST LOVED THIS SEASON").trim(),
      description: input.description.trim(),
      items: input.items.map((item, idx) => ({
        number: item.number || `0${idx + 1}`,
        label: item.label.trim(),
        title: item.title.trim(),
        image: item.image.trim(),
        href: item.href.trim(),
      })),
    };

    if (input.id) {
      // UPDATE
      const { data, error } = await supabase
        .from("promo_sections")
        .update({
          name: input.name.trim(),
          props_json: propsJson,
          status: input.status || "published",
          priority: input.priority ?? 0,
          updated_at: new Date().toISOString(),
        })
        .eq("id", input.id)
        .eq("template_id", "trending_collection")
        .select("id")
        .single();

      if (error) {
        console.error("[admin-trending] Update error:", error.message);
        return { success: false, error: error.message };
      }

      await logAdminActivity("SAVE_PROMO_SECTION", {
        type: "TRENDING_NOW_UPDATE",
        id: input.id,
        name: input.name,
      });

      revalidatePath("/");
      return { success: true, id: data.id };
    } else {
      // CREATE NEW SET
      const { data, error } = await supabase
        .from("promo_sections")
        .insert({
          name: input.name.trim(),
          template_id: "trending_collection",
          props_json: propsJson,
          status: input.status || "published",
          priority: input.priority ?? 0,
          created_by: authUser.userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (error) {
        console.error("[admin-trending] Insert error:", error.message);
        return { success: false, error: error.message };
      }

      await logAdminActivity("SAVE_PROMO_SECTION", {
        type: "TRENDING_NOW_CREATE",
        id: data.id,
        name: input.name,
      });

      revalidatePath("/");
      return { success: true, id: data.id };
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[admin-trending] saveTrendingSection exception:", msg);
    return { success: false, error: msg };
  }
}

/**
 * Delete a trending set permanently
 */
export async function deleteTrendingSection(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const authUser = await verifyAdminRole();
    if (!authUser) {
      return { success: false, error: "Unauthorized access" };
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from("promo_sections")
      .delete()
      .eq("id", id)
      .eq("template_id", "trending_collection");

    if (error) {
      return { success: false, error: error.message };
    }

    await logAdminActivity("DELETE_PROMO_SECTION", {
      type: "TRENDING_NOW_DELETE",
      id,
    });

    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}

/**
 * Toggle status between published and draft
 */
export async function setTrendingSectionStatus(
  id: string,
  status: "published" | "draft" | "archived"
): Promise<{ success: boolean; error?: string }> {
  try {
    const authUser = await verifyAdminRole();
    if (!authUser) {
      return { success: false, error: "Unauthorized access" };
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from("promo_sections")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("template_id", "trending_collection");

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}

/**
 * Reorder priority of trending sets
 */
export async function reorderTrendingSections(
  orderedIds: string[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const authUser = await verifyAdminRole();
    if (!authUser) {
      return { success: false, error: "Unauthorized access" };
    }

    const supabase = getSupabaseAdmin();
    const updates = orderedIds.map((id, index) =>
      supabase
        .from("promo_sections")
        .update({ priority: index, updated_at: new Date().toISOString() })
        .eq("id", id)
        .eq("template_id", "trending_collection")
    );

    await Promise.all(updates);
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}
