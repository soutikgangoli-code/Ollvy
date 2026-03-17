-- =============================================================================
-- Migration: Add detailed content columns to service_packages
-- All service page content should be editable from the database
-- =============================================================================

-- Add detailed content columns
ALTER TABLE service_packages ADD COLUMN IF NOT EXISTS tagline TEXT;
ALTER TABLE service_packages ADD COLUMN IF NOT EXISTS full_description TEXT;
ALTER TABLE service_packages ADD COLUMN IF NOT EXISTS short_name TEXT;
ALTER TABLE service_packages ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Services';
ALTER TABLE service_packages ADD COLUMN IF NOT EXISTS service_type TEXT DEFAULT 'One-time';
ALTER TABLE service_packages ADD COLUMN IF NOT EXISTS mandatory_for TEXT;
ALTER TABLE service_packages ADD COLUMN IF NOT EXISTS legal_basis TEXT;
ALTER TABLE service_packages ADD COLUMN IF NOT EXISTS penalty_for_missing TEXT;
ALTER TABLE service_packages ADD COLUMN IF NOT EXISTS penalty_color TEXT DEFAULT 'none';

-- SEO fields
ALTER TABLE service_packages ADD COLUMN IF NOT EXISTS seo_title TEXT;
ALTER TABLE service_packages ADD COLUMN IF NOT EXISTS seo_description TEXT;
ALTER TABLE service_packages ADD COLUMN IF NOT EXISTS canonical_url TEXT;

-- Pricing labels
ALTER TABLE service_packages ADD COLUMN IF NOT EXISTS govt_fee_label TEXT;
ALTER TABLE service_packages ADD COLUMN IF NOT EXISTS govt_fee_note TEXT;
ALTER TABLE service_packages ADD COLUMN IF NOT EXISTS retainer_cycle_label TEXT;

-- Process steps (already exists as workflow_stages, but adding alias)
-- workflow_stages JSONB already exists

-- Detailed content sections as JSONB
ALTER TABLE service_packages ADD COLUMN IF NOT EXISTS whats_included JSONB DEFAULT '[]'::jsonb;
ALTER TABLE service_packages ADD COLUMN IF NOT EXISTS service_risks JSONB DEFAULT '[]'::jsonb;
ALTER TABLE service_packages ADD COLUMN IF NOT EXISTS profile_personas JSONB DEFAULT '[]'::jsonb;
ALTER TABLE service_packages ADD COLUMN IF NOT EXISTS faqs JSONB DEFAULT '[]'::jsonb;
ALTER TABLE service_packages ADD COLUMN IF NOT EXISTS review_sources JSONB DEFAULT '[]'::jsonb;
ALTER TABLE service_packages ADD COLUMN IF NOT EXISTS unlocks JSONB DEFAULT '[]'::jsonb;
ALTER TABLE service_packages ADD COLUMN IF NOT EXISTS review_keyword_chips TEXT[] DEFAULT '{}';
ALTER TABLE service_packages ADD COLUMN IF NOT EXISTS related_slugs TEXT[] DEFAULT '{}';

-- Ratings (if not exists)
ALTER TABLE service_packages ADD COLUMN IF NOT EXISTS avg_rating DECIMAL(2,1);
ALTER TABLE service_packages ADD COLUMN IF NOT EXISTS rating_count INT DEFAULT 0;

-- Display options
ALTER TABLE service_packages ADD COLUMN IF NOT EXISTS show_completion_stats BOOLEAN DEFAULT false;
ALTER TABLE service_packages ADD COLUMN IF NOT EXISTS show_approval_rate BOOLEAN DEFAULT false;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_service_packages_category ON service_packages (category);
CREATE INDEX IF NOT EXISTS idx_service_packages_is_active_display ON service_packages (is_active, display_order);
