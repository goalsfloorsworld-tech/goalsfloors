"use server";

import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { logAdminActivity } from "./logger";
import { PROMO_TEMPLATES, isValidPromoLink } from "@/components/promo/templates";
import { VALID_PRODUCT_SLUGS } from "@/lib/promo-constants";

export interface AdminPromoAssignment {
  id: string;
  section_id: string;
  slot: string;
  product_slug: string;
  created_at: string;
}

export interface AdminPromoSection {
  id: string;
  name: string;
  template_id: string;
  props_json: Record<string, unknown>;
  status: "draft" | "published" | "archived";
  start_at: string | null;
  end_at: string | null;
  priority: number;
  created_by: string;
  created_at: string;
  updated_at: string;
  assignments: AdminPromoAssignment[];
}

export interface SavePromoInput {
  id?: string;
  name: string;
  template_id: string;
  props_json: Record<string, unknown>;
  status?: "draft" | "published" | "archived";
  start_at?: string | null; // UTC ISO or IST input
  end_at?: string | null;   // UTC ISO or IST input
  priority?: number;
  assigned_slugs?: string[];
  last_known_updated_at?: string | null;
  replaceConflict?: boolean;
}

export interface ConflictingSectionInfo {
  id: string;
  name: string;
  start_at: string | null;
  end_at: string | null;
  product_slug: string;
  slot: string;
}

interface PromoSectionDbRow {
  id: string;
  name: string;
  template_id: string;
  props_json: Record<string, unknown> | null;
  status: "draft" | "published" | "archived";
  start_at: string | null;
  end_at: string | null;
  priority: number | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface ActiveAssignmentJoinRow {
  slot: string;
  product_slug: string;
  section_id: string;
  promo_sections: {
    id: string;
    name: string;
    status: string;
    start_at: string | null;
    end_at: string | null;
  };
}

// ─── Database Client & Role Verification ──────────────────────────────────────

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

// ─── Timezone Helpers (IST <-> UTC without external dependencies) ─────────────

/**
 * Convert an IST datetime-local input string (YYYY-MM-DDTHH:mm) to UTC ISO string.
 * Indian Standard Time is permanently fixed at UTC+05:30 (no daylight saving time).
 */
export async function istToUtcIso(istString?: string | null): Promise<string | null> {
  if (!istString || !istString.trim()) return null;
  const trimmed = istString.trim();

  // If already full ISO with Z or offset, standardize via Date
  if (trimmed.endsWith("Z") || /[+-]\d{2}:\d{2}$/.test(trimmed)) {
    const d = new Date(trimmed);
    return isNaN(d.getTime()) ? null : d.toISOString();
  }

  const withSeconds = trimmed.length === 16 ? `${trimmed}:00` : trimmed;
  const date = new Date(`${withSeconds}+05:30`);
  return isNaN(date.getTime()) ? null : date.toISOString();
}

/**
 * Revalidate public Next.js pages for the given slugs.
 * If '*' (sitewide) is present, revalidates all 13 product pages.
 */
function revalidateAffectedProductPages(slugs: string[]) {
  const hasSitewide = slugs.includes("*");
  if (hasSitewide) {
    revalidatePath("/products");
    VALID_PRODUCT_SLUGS.forEach((s) => {
      revalidatePath(`/products/${s}`);
    });
  } else {
    slugs.forEach((s) => {
      revalidatePath(`/products/${s}`);
    });
  }
}

/**
 * Check if two time intervals [S1, E1) and [S2, E2) overlap.
 * Null start is treated as -Infinity; null end is treated as +Infinity.
 */
function doTimeWindowsOverlap(
  startA: string | null,
  endA: string | null,
  startB: string | null,
  endB: string | null
): boolean {
  const sA = startA ? new Date(startA).getTime() : -Infinity;
  const eA = endA ? new Date(endA).getTime() : Infinity;

  const sB = startB ? new Date(startB).getTime() : -Infinity;
  const eB = endB ? new Date(endB).getTime() : Infinity;

  return sA < eB && sB < eA;
}

// ─── Server Actions ──────────────────────────────────────────────────────────

/**
 * 1. Get all promo sections along with their page assignments for the admin list.
 */
export async function getAdminPromos(): Promise<
  | { success: true; promos: AdminPromoSection[] }
  | { success: false; error: string }
> {
  try {
    const authUser = await verifyAdminRole();
    if (!authUser) {
      return { success: false, error: "Unauthorized: Admin privileges required." };
    }

    const supabase = getSupabaseAdmin();

    const { data: sections, error: secError } = await supabase
      .from("promo_sections")
      .select("*")
      .order("created_at", { ascending: false });

    if (secError) throw secError;

    const { data: assignments, error: assError } = await supabase
      .from("promo_assignments")
      .select("*");

    if (assError) throw assError;

    // Group assignments by section_id
    const assignmentsBySection = new Map<string, AdminPromoAssignment[]>();
    for (const a of (assignments || []) as AdminPromoAssignment[]) {
      const list = assignmentsBySection.get(a.section_id) || [];
      list.push(a);
      assignmentsBySection.set(a.section_id, list);
    }

    const result: AdminPromoSection[] = ((sections || []) as unknown as PromoSectionDbRow[]).map((sec) => ({
      id: sec.id,
      name: sec.name,
      template_id: sec.template_id,
      props_json: sec.props_json || {},
      status: sec.status,
      start_at: sec.start_at,
      end_at: sec.end_at,
      priority: sec.priority ?? 0,
      created_by: sec.created_by,
      created_at: sec.created_at,
      updated_at: sec.updated_at,
      assignments: assignmentsBySection.get(sec.id) || [],
    }));

    return { success: true, promos: result };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[admin-promos] getAdminPromos error:", message);
    return { success: false, error: message };
  }
}

/**
 * 2. Save promo section (Create or Update), check overlap, detect stale edits, and log activity.
 */
export async function savePromoSection(input: SavePromoInput): Promise<
  | { success: true; sectionId: string }
  | {
      success: false;
      error: string;
      stale?: boolean;
      conflict?: boolean;
      conflictingSection?: ConflictingSectionInfo;
      conflictingSections?: ConflictingSectionInfo[];
    }
> {
  try {
    const authUser = await verifyAdminRole();
    if (!authUser) {
      return { success: false, error: "Unauthorized: Admin privileges required." };
    }

    // Input Validation
    const name = input.name?.trim();
    if (!name) {
      return { success: false, error: "Promo name is required." };
    }

    const templateId = input.template_id?.trim();
    if (!templateId || !PROMO_TEMPLATES[templateId]) {
      return { success: false, error: `Invalid template: '${templateId}' does not exist.` };
    }

    // Date normalization (stored in UTC)
    const startAt = await istToUtcIso(input.start_at);
    const endAt = await istToUtcIso(input.end_at);

    if (startAt && endAt) {
      if (new Date(startAt).getTime() >= new Date(endAt).getTime()) {
        return { success: false, error: "Start date must be strictly earlier than end date." };
      }
    }

    // Start Date & End Date are strictly compulsory
    if (!input.start_at || !String(input.start_at).trim()) {
      return {
        success: false,
        error: "Validation Error: Start Date & Time is required. Please specify a start date.",
      };
    }
    if (!input.end_at || !String(input.end_at).trim()) {
      return {
        success: false,
        error: "Validation Error: End Date & Time is required. Please specify an end date.",
      };
    }

    // End date must be strictly after start date
    if (new Date(input.end_at).getTime() <= new Date(input.start_at).getTime()) {
      return {
        success: false,
        error: "Validation Error: End Date must be after the Start Date.",
      };
    }

    // Validate link fields in props_json
    const propsJson = { ...input.props_json };
    if (propsJson.button_link && typeof propsJson.button_link === "string") {
      if (!isValidPromoLink(propsJson.button_link)) {
        return {
          success: false,
          error: "Invalid button link. Must be a relative path (/path), HTTPS URL, tel:, mailto:, or WhatsApp link.",
        };
      }
    }

    // Compulsory check for FestiveOfferBanner: must have all 5 cards
    if (templateId === "FestiveOfferBanner" || templateId === "SampleKitCallout") {
      const missing: number[] = [];
      for (let i = 1; i <= 5; i++) {
        const img = propsJson[`card_${i}_image`];
        if (!img || typeof img !== "string" || !img.trim()) {
          missing.push(i);
        }
      }
      if (missing.length > 0) {
        return {
          success: false,
          error: `Validation Error: All 5 card images are required for the Festive Celebration Banner. Missing image for Card ${missing.join(", ")}.`,
        };
      }
    }

    // Compulsory check for B2BProjectLeadBanner: must have all 4 cards
    if (templateId === "B2BProjectLeadBanner" || templateId === "B2BBulkStrip") {
      const missing: number[] = [];
      for (let i = 1; i <= 4; i++) {
        const img = propsJson[`card_${i}_image`];
        const title = propsJson[`card_${i}_title`];
        if (!img || typeof img !== "string" || !img.trim() || !title || typeof title !== "string" || !title.trim()) {
          missing.push(i);
        }
      }
      if (missing.length > 0) {
        return {
          success: false,
          error: `Validation Error: All 4 showcase cards (Offices, Restaurants, Hotels, Retail) are required for the B2B Project Banner. Card ${missing.join(", ")} is incomplete.`,
        };
      }
    }

    const priority = typeof input.priority === "number" ? input.priority : 0;
    const status = input.status || "draft";
    const assignedSlugs = Array.from(new Set(input.assigned_slugs || []));

    // Validate assigned slugs
    for (const slug of assignedSlugs) {
      if (slug !== "*" && !VALID_PRODUCT_SLUGS.includes(slug as (typeof VALID_PRODUCT_SLUGS)[number])) {
        return { success: false, error: `Invalid product slug: '${slug}' is not recognized.` };
      }
    }

    const supabase = getSupabaseAdmin();
    let sectionId = input.id;

    // Check Stale Edit on updates
    if (sectionId) {
      const { data: existing, error: fetchErr } = await supabase
        .from("promo_sections")
        .select("updated_at, status")
        .eq("id", sectionId)
        .single();

      if (fetchErr || !existing) {
        return { success: false, error: "Promo section not found." };
      }

      if (input.last_known_updated_at) {
        const dbUpdated = new Date(existing.updated_at).getTime();
        const clientUpdated = new Date(input.last_known_updated_at).getTime();
        if (dbUpdated > clientUpdated) {
          return {
            success: false,
            stale: true,
            error: "Stale edit detected: This promo section was modified by another administrator. Please refresh the page.",
          };
        }
      }
    }

    const replacedConflictSlugs: string[] = [];

    // OVERLAP RULE CHECK:
    // "ek time pe ek page pe ek hi active hoga sirf ek hi"
    if (status === "published" && assignedSlugs.length > 0) {
      let query = supabase
        .from("promo_assignments")
        .select(`
          slot,
          product_slug,
          section_id,
          promo_sections!inner (
            id,
            name,
            status,
            start_at,
            end_at
          )
        `)
        .eq("slot", "product-top")
        .eq("promo_sections.status", "published");

      // Check specific slugs + sitewide '*'
      if (!assignedSlugs.includes("*")) {
        query = query.in("product_slug", [...assignedSlugs, "*"]);
      }

      const { data: activeAssignments } = await query;
      const detectedConflicts: ConflictingSectionInfo[] = [];

      for (const row of (activeAssignments || []) as unknown as ActiveAssignmentJoinRow[]) {
        const sec = row.promo_sections;
        // Ignore self
        if (sectionId && sec.id === sectionId) continue;

        if (doTimeWindowsOverlap(startAt, endAt, sec.start_at, sec.end_at)) {
          detectedConflicts.push({
            id: sec.id,
            name: sec.name,
            start_at: sec.start_at,
            end_at: sec.end_at,
            product_slug: row.product_slug,
            slot: row.slot,
          });
        }
      }

      if (detectedConflicts.length > 0) {
        if (!input.replaceConflict) {
          return {
            success: false,
            conflict: true,
            conflictingSection: detectedConflicts[0],
            conflictingSections: detectedConflicts,
            error: `Conflict detected: An active promotion is already scheduled on the selected page(s).`,
          };
        } else {
          // Replace conflict: remove conflicting assignments so new promo takes over ONLY on the selected pages
          for (const conf of detectedConflicts) {
            replacedConflictSlugs.push(conf.product_slug);
            if (conf.product_slug === "*") {
              // Sitewide fallback conflict:
              // Delete '*' and preserve old promo on all other remaining pages
              await supabase
                .from("promo_assignments")
                .delete()
                .eq("section_id", conf.id)
                .eq("product_slug", "*")
                .eq("slot", "product-top");

              const remainingSlugs = VALID_PRODUCT_SLUGS.filter((s) => !assignedSlugs.includes(s));
              if (remainingSlugs.length > 0) {
                const preserveRows = remainingSlugs.map((s) => ({
                  section_id: conf.id,
                  slot: "product-top",
                  product_slug: s,
                }));
                await supabase.from("promo_assignments").insert(preserveRows);
              }
            } else {
              // Specific page conflict: delete ONLY this specific product_slug assignment!
              // All other pages assigned to this promo remain completely untouched and live!
              await supabase
                .from("promo_assignments")
                .delete()
                .eq("section_id", conf.id)
                .eq("product_slug", conf.product_slug)
                .eq("slot", "product-top");
            }
          }
        }
      }
    }

    const nowIso = new Date().toISOString();

    if (sectionId) {
      // Update existing record
      const { error: updateErr } = await supabase
        .from("promo_sections")
        .update({
          name,
          template_id: templateId,
          props_json: propsJson,
          status,
          start_at: startAt,
          end_at: endAt,
          priority,
          updated_at: nowIso,
        })
        .eq("id", sectionId);

      if (updateErr) throw updateErr;
    } else {
      // Create new record
      const { data: newSec, error: insertErr } = await supabase
        .from("promo_sections")
        .insert({
          name,
          template_id: templateId,
          props_json: propsJson,
          status,
          start_at: startAt,
          end_at: endAt,
          priority,
          created_by: authUser.userId,
          created_at: nowIso,
          updated_at: nowIso,
        })
        .select("id")
        .single();

      if (insertErr || !newSec) throw insertErr;
      sectionId = newSec.id;
    }

    // Synchronize page assignments if provided
    if (input.assigned_slugs !== undefined) {
      // 1. Delete old assignments
      await supabase
        .from("promo_assignments")
        .delete()
        .eq("section_id", sectionId)
        .eq("slot", "product-top");

      // 2. Insert new assignments
      if (assignedSlugs.length > 0) {
        const insertRows = assignedSlugs.map((slug) => ({
          section_id: sectionId,
          slot: "product-top",
          product_slug: slug,
        }));
        const { error: assErr } = await supabase
          .from("promo_assignments")
          .insert(insertRows);
        if (assErr) throw assErr;
      }
    }

    // Log admin activity
    await logAdminActivity("SAVE_PROMO_SECTION", {
      sectionId,
      name,
      template_id: templateId,
      status,
      assignedSlugs,
    });

    // Revalidate all affected product pages (assigned pages + replaced conflicting pages)
    const affectedSlugsToRevalidate = Array.from(
      new Set([...assignedSlugs, ...replacedConflictSlugs])
    );
    revalidateAffectedProductPages(affectedSlugsToRevalidate);

    return { success: true, sectionId: sectionId! };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[admin-promos] savePromoSection error:", message);
    return { success: false, error: message };
  }
}

/**
 * 3. Change promo status ('draft' | 'published' | 'archived') with overlap check.
 */
export async function setPromoStatus(
  sectionId: string,
  newStatus: "draft" | "published" | "archived",
  replaceConflict = false
): Promise<
  | { success: true }
  | {
      success: false;
      error: string;
      conflict?: boolean;
      conflictingSection?: ConflictingSectionInfo;
      conflictingSections?: ConflictingSectionInfo[];
    }
> {
  try {
    const authUser = await verifyAdminRole();
    if (!authUser) {
      return { success: false, error: "Unauthorized: Admin privileges required." };
    }

    const supabase = getSupabaseAdmin();

    const { data: sec, error: secErr } = await supabase
      .from("promo_sections")
      .select("id, name, start_at, end_at, status")
      .eq("id", sectionId)
      .single();

    if (secErr || !sec) {
      return { success: false, error: "Promo section not found." };
    }

    // Get current assignments
    const { data: assignments } = await supabase
      .from("promo_assignments")
      .select("product_slug, slot")
      .eq("section_id", sectionId);

    const assignedSlugs = (assignments || []).map((a) => a.product_slug);
    const replacedConflictSlugs: string[] = [];

    // If publishing, verify non-overlap across all assigned pages
    if (newStatus === "published" && assignedSlugs.length > 0) {
      let query = supabase
        .from("promo_assignments")
        .select(`
          slot,
          product_slug,
          section_id,
          promo_sections!inner (
            id,
            name,
            status,
            start_at,
            end_at
          )
        `)
        .eq("slot", "product-top")
        .eq("promo_sections.status", "published")
        .neq("section_id", sectionId);

      if (!assignedSlugs.includes("*")) {
        query = query.in("product_slug", [...assignedSlugs, "*"]);
      }

      const { data: activeAssignments } = await query;
      const detectedConflicts: ConflictingSectionInfo[] = [];

      for (const row of (activeAssignments || []) as unknown as ActiveAssignmentJoinRow[]) {
        const otherSec = row.promo_sections;
        if (doTimeWindowsOverlap(sec.start_at, sec.end_at, otherSec.start_at, otherSec.end_at)) {
          detectedConflicts.push({
            id: otherSec.id,
            name: otherSec.name,
            start_at: otherSec.start_at,
            end_at: otherSec.end_at,
            product_slug: row.product_slug,
            slot: row.slot,
          });
        }
      }

      if (detectedConflicts.length > 0) {
        if (!replaceConflict) {
          return {
            success: false,
            conflict: true,
            conflictingSection: detectedConflicts[0],
            conflictingSections: detectedConflicts,
            error: `Conflict detected: An active promotion is already scheduled on the selected page(s).`,
          };
        } else {
          // Replace conflict: remove conflicting assignments so new promo takes over ONLY on the selected pages
          for (const conf of detectedConflicts) {
            replacedConflictSlugs.push(conf.product_slug);
            if (conf.product_slug === "*") {
              // Sitewide fallback conflict:
              // Delete '*' and preserve old promo on all other remaining pages
              await supabase
                .from("promo_assignments")
                .delete()
                .eq("section_id", conf.id)
                .eq("product_slug", "*")
                .eq("slot", "product-top");

              const remainingSlugs = VALID_PRODUCT_SLUGS.filter((s) => !assignedSlugs.includes(s));
              if (remainingSlugs.length > 0) {
                const preserveRows = remainingSlugs.map((s) => ({
                  section_id: conf.id,
                  slot: "product-top",
                  product_slug: s,
                }));
                await supabase.from("promo_assignments").insert(preserveRows);
              }
            } else {
              // Specific page conflict: delete ONLY this specific product_slug assignment!
              // All other pages assigned to this promo remain completely untouched and live!
              await supabase
                .from("promo_assignments")
                .delete()
                .eq("section_id", conf.id)
                .eq("product_slug", conf.product_slug)
                .eq("slot", "product-top");
            }
          }
        }
      }
    }

    const { error: updateErr } = await supabase
      .from("promo_sections")
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", sectionId);

    if (updateErr) throw updateErr;

    await logAdminActivity("SET_PROMO_STATUS", {
      sectionId,
      status: newStatus,
      assignedSlugs,
    });

    const affectedSlugsToRevalidate = Array.from(
      new Set([...assignedSlugs, ...replacedConflictSlugs])
    );
    revalidateAffectedProductPages(affectedSlugsToRevalidate);

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[admin-promos] setPromoStatus error:", message);
    return { success: false, error: message };
  }
}

/**
 * 4. Assign promo to product slugs with conflict checking and replacement.
 */
export async function assignPromo(
  sectionId: string,
  slugs: string[],
  slot = "product-top",
  replaceConflict = false
): Promise<
  | { success: true }
  | { success: false; error: string; conflict?: boolean; conflictingSection?: ConflictingSectionInfo }
> {
  try {
    const authUser = await verifyAdminRole();
    if (!authUser) {
      return { success: false, error: "Unauthorized: Admin privileges required." };
    }

    const cleanSlugs = Array.from(new Set(slugs.filter(Boolean)));
    for (const slug of cleanSlugs) {
      if (slug !== "*" && !VALID_PRODUCT_SLUGS.includes(slug as (typeof VALID_PRODUCT_SLUGS)[number])) {
        return { success: false, error: `Invalid product slug: '${slug}'.` };
      }
    }

    const supabase = getSupabaseAdmin();

    const { data: sec, error: secErr } = await supabase
      .from("promo_sections")
      .select("id, name, status, start_at, end_at")
      .eq("id", sectionId)
      .single();

    if (secErr || !sec) {
      return { success: false, error: "Promo section not found." };
    }

    // Check overlap if section is published
    if (sec.status === "published" && cleanSlugs.length > 0) {
      const { data: activeAssignments } = await supabase
        .from("promo_assignments")
        .select(`
          slot,
          product_slug,
          section_id,
          promo_sections!inner (
            id,
            name,
            status,
            start_at,
            end_at
          )
        `)
        .eq("slot", slot)
        .in("product_slug", cleanSlugs)
        .eq("promo_sections.status", "published")
        .neq("section_id", sectionId);

      for (const row of (activeAssignments || []) as unknown as ActiveAssignmentJoinRow[]) {
        const otherSec = row.promo_sections;
        if (doTimeWindowsOverlap(sec.start_at, sec.end_at, otherSec.start_at, otherSec.end_at)) {
          if (!replaceConflict) {
            return {
              success: false,
              conflict: true,
              conflictingSection: {
                id: otherSec.id,
                name: otherSec.name,
                start_at: otherSec.start_at,
                end_at: otherSec.end_at,
                product_slug: row.product_slug,
                slot: row.slot,
              },
              error: `Conflict on page "${row.product_slug}": Section "${otherSec.name}" is already scheduled during this window.`,
            };
          } else {
            await supabase
              .from("promo_assignments")
              .delete()
              .eq("section_id", otherSec.id)
              .eq("product_slug", row.product_slug)
              .eq("slot", slot);
          }
        }
      }
    }

    // Delete existing assignments for this section and slot
    await supabase
      .from("promo_assignments")
      .delete()
      .eq("section_id", sectionId)
      .eq("slot", slot);

    // Insert new assignments
    if (cleanSlugs.length > 0) {
      const insertRows = cleanSlugs.map((s) => ({
        section_id: sectionId,
        slot,
        product_slug: s,
      }));
      const { error: insErr } = await supabase.from("promo_assignments").insert(insertRows);
      if (insErr) throw insErr;
    }

    await logAdminActivity("ASSIGN_PROMO", {
      sectionId,
      slugs: cleanSlugs,
      slot,
      replaceConflict,
    });

    revalidateAffectedProductPages(cleanSlugs);

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[admin-promos] assignPromo error:", message);
    return { success: false, error: message };
  }
}

/**
 * 5. Unassign promo from a single product slug.
 */
export async function unassignPromo(
  sectionId: string,
  slug: string,
  slot = "product-top"
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const authUser = await verifyAdminRole();
    if (!authUser) {
      return { success: false, error: "Unauthorized: Admin privileges required." };
    }

    const supabase = getSupabaseAdmin();

    const { error } = await supabase
      .from("promo_assignments")
      .delete()
      .eq("section_id", sectionId)
      .eq("product_slug", slug)
      .eq("slot", slot);

    if (error) throw error;

    await logAdminActivity("UNASSIGN_PROMO", { sectionId, slug, slot });

    revalidateAffectedProductPages([slug]);

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[admin-promos] unassignPromo error:", message);
    return { success: false, error: message };
  }
}

/**
 * 6. Delete promo section permanently (hard delete and remove all its assignments).
 */
export async function deletePromoSection(
  sectionId: string
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const authUser = await verifyAdminRole();
    if (!authUser) {
      return { success: false, error: "Unauthorized: Admin privileges required." };
    }

    const supabase = getSupabaseAdmin();

    // Check assignments to know which pages need Next.js ISR revalidation
    const { data: assignments } = await supabase
      .from("promo_assignments")
      .select("product_slug")
      .eq("section_id", sectionId);

    const affectedSlugs = (assignments || []).map((a) => a.product_slug);

    // 1. Delete all page assignments for this section first (clean cleanup)
    await supabase
      .from("promo_assignments")
      .delete()
      .eq("section_id", sectionId);

    // 2. Permanently delete the promo section from the database
    const { error: delErr } = await supabase
      .from("promo_sections")
      .delete()
      .eq("id", sectionId);

    if (delErr) throw delErr;

    await logAdminActivity("DELETE_PROMO_SECTION", {
      sectionId,
      permanent: true,
      affectedSlugs,
    });

    revalidateAffectedProductPages(affectedSlugs);

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[admin-promos] deletePromoSection error:", message);
    return { success: false, error: message };
  }
}
