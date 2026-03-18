-- =============================================================================
-- Migration: Fix bundle pricing - show total including default addons
-- =============================================================================

-- Update cloud kitchen bundle price to include all default-selected addons:
-- Base FSSAI: ₹13,599
-- GST Registration: ₹8,999
-- Shop & Establishment: ₹4,999
-- Trade License: ₹7,999
-- Total: ₹35,596

UPDATE service_packages
SET
  price_base_paisa = 3559600,  -- ₹35,596 total bundle price
  price_govt_fees_paisa = 0    -- Hide govt fee in preview (shown in detail page)
WHERE slug = 'cloud-kitchen-setup';
