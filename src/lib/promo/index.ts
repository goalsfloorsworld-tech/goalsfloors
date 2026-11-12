import { supabaseAdmin } from "@/lib/supabase";

export interface PromoSectionItem {
  id: string;
  name: string;
  template_id: string;
  props_json: Record<string, unknown>;
  start_at: string | null;
  end_at: string | null;
  priority: number;
  product_slug: string;
  slot: string;
  is_active?: boolean;
}

/**
 * Pure helper to sort promo sections by precedence:
 * 1. Specific product_slug beats wildcard '*'
 * 2. Higher priority beats lower priority
 * 3. Earliest start_at beats later start_at
 */
export function sortPromosByPrecedence(
  promos: PromoSectionItem[],
  currentSlug: string
): PromoSectionItem[] {
  return [...promos].sort((a, b) => {
    // 1. Specific slug vs sitewide wildcard
    const aIsSpecific = a.product_slug === currentSlug;
    const bIsSpecific = b.product_slug === currentSlug;
    if (aIsSpecific && !bIsSpecific) return -1;
    if (!aIsSpecific && bIsSpecific) return 1;

    // 2. Higher priority first
    if (b.priority !== a.priority) {
      return b.priority - a.priority;
    }

    // 3. Earliest start first (null/undefined treated as -Infinity = started indefinitely in the past)
    const aStart = a.start_at ? new Date(a.start_at).getTime() : -Infinity;
    const bStart = b.start_at ? new Date(b.start_at).getTime() : -Infinity;
    return aStart - bStart;
  });
}

interface PromoAssignmentRow {
  slot: string;
  product_slug: string;
  promo_sections: {
    id: string;
    name: string;
    template_id: string;
    props_json: Record<string, unknown> | null;
    status: string;
    start_at: string | null;
    end_at: string | null;
    priority: number | null;
  } | null;
}

/**
 * Server-only function to fetch published promos for a given product page.
 * Returns promos assigned to this slug OR '*' for slot 'product-top' whose
 * end_at is null or in the future (includes upcoming promos whose start_at is in the future).
 *
 * Never throws — on any error returns [] so the product page never breaks.
 */
export async function getPromosForPage(slug: string): Promise<PromoSectionItem[]> {
  try {
    if (!slug) return [];

    // Query assignments joined with published promo_sections
    const { data, error } = await supabaseAdmin
      .from("promo_assignments")
      .select(`
        slot,
        product_slug,
        promo_sections!inner (
          id,
          name,
          template_id,
          props_json,
          status,
          start_at,
          end_at,
          priority
        )
      `)
      .eq("slot", "product-top")
      .in("product_slug", [slug, "*"])
      .eq("promo_sections.status", "published");

    if (error || !data) {
      if (error) {
        console.error("[Promo] Failed to fetch promos for page:", slug, error.message);
      }
      return [];
    }

    const now = Date.now();
    const candidatePromos: PromoSectionItem[] = [];
    const rows = data as unknown as PromoAssignmentRow[];

    for (const row of rows) {
      const section = row.promo_sections;
      if (!section) continue;

      // Filter out promos that have already expired in the past
      if (section.end_at) {
        const endMs = new Date(section.end_at).getTime();
        if (endMs <= now) {
          continue; // expired
        }
      }

      candidatePromos.push({
        id: section.id,
        name: section.name,
        template_id: section.template_id,
        props_json: section.props_json || {},
        start_at: section.start_at || null,
        end_at: section.end_at || null,
        priority: typeof section.priority === "number" ? section.priority : 0,
        product_slug: row.product_slug,
        slot: row.slot,
      });
    }

    const sorted = sortPromosByPrecedence(candidatePromos, slug);

    // Flag the server-active promo so client hydration is 100% deterministic with zero Date.now() during render
    const activeItem = sorted.find((p) => {
      const startMs = p.start_at ? new Date(p.start_at).getTime() : -Infinity;
      const endMs = p.end_at ? new Date(p.end_at).getTime() : Infinity;
      return now >= startMs && now < endMs;
    });

    if (activeItem) {
      activeItem.is_active = true;
    }

    return sorted;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[Promo] Unexpected error in getPromosForPage:", message);
    return [];
  }
}
