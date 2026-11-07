-- ==============================================================================
-- Migration: Promo Section System (Templates Only)
-- File: scratch/promo_system_migration.sql
-- Description:
--   Creates promo_sections and promo_assignments tables to support
--   admin-managed dynamic promotional slots on product pages (/products/[slug]).
--   Enforces strict Row-Level Security (RLS) with zero public anon policies.
-- ==============================================================================

-- 1. Table: promo_sections
-- Stores the promo configuration, template identifier, props payload, and schedule.
CREATE TABLE IF NOT EXISTS promo_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    template_id TEXT NOT NULL,
    props_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    start_at TIMESTAMPTZ NULL,
    end_at TIMESTAMPTZ NULL,
    priority INT NOT NULL DEFAULT 0,
    created_by TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT promo_sections_dates_check CHECK (
        end_at IS NULL OR start_at IS NULL OR start_at < end_at
    )
);

-- 2. Table: promo_assignments
-- Maps a promo section to a specific product slug or sitewide '*' for a given slot.
-- NOTE: No UNIQUE constraint on (slot, product_slug) to allow multiple scheduled
-- promos across distinct time intervals. Non-overlapping active windows are
-- validated at the server action layer.
CREATE TABLE IF NOT EXISTS promo_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id UUID NOT NULL REFERENCES promo_sections(id) ON DELETE CASCADE,
    slot TEXT NOT NULL DEFAULT 'product-top',
    product_slug TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Indexes for fast query lookup
CREATE INDEX IF NOT EXISTS idx_promo_assignments_slot_slug 
    ON promo_assignments(slot, product_slug);

CREATE INDEX IF NOT EXISTS idx_promo_assignments_section_id 
    ON promo_assignments(section_id);

CREATE INDEX IF NOT EXISTS idx_promo_sections_status_priority 
    ON promo_sections(status, priority DESC);

-- 4. Row Level Security (RLS)
-- Enabled with NO policies. All public anon-key read/write operations are blocked by default.
-- All operations are performed exclusively via supabaseAdmin (service_role) in server-side
-- actions and SSR data fetchers.
ALTER TABLE promo_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_assignments ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- ROLLBACK SCRIPT (Run only if you need to tear down this migration)
-- ==============================================================================
/*
DROP TABLE IF EXISTS promo_assignments CASCADE;
DROP TABLE IF EXISTS promo_sections CASCADE;
*/
