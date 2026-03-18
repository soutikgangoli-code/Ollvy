-- =============================================================================
-- Migration: Add service addons for bundle customization
-- Allows users to select/deselect individual services in a bundle
-- =============================================================================

-- Add addons column for selectable sub-services in bundles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'service_packages' AND column_name = 'addons'
  ) THEN
    ALTER TABLE service_packages ADD COLUMN addons jsonb DEFAULT NULL;
    COMMENT ON COLUMN service_packages.addons IS 'Selectable add-on services for bundle packs';
  END IF;
END $$;

-- Update cloud kitchen with addons and disable misleading completion stats
UPDATE service_packages
SET
  -- Disable the completion stats since the hardcoded "1-5 days" bars don't make sense for a 45-day service
  show_completion_stats = false,
  -- Add selectable services - FSSAI is always required (controlled by variant), others are optional
  addons = '[
    {
      "id": "gst-registration",
      "name": "GST Registration",
      "description": "GSTIN in 7 working days. Required for Swiggy/Zomato TCS claims.",
      "pricePaisa": 899900,
      "required": false,
      "defaultSelected": true
    },
    {
      "id": "shop-establishment",
      "name": "Shop & Establishment",
      "description": "State labour department registration. 5-7 working days.",
      "pricePaisa": 499900,
      "required": false,
      "defaultSelected": true
    },
    {
      "id": "trade-license",
      "name": "Trade License / Eating House",
      "description": "Municipal corporation license. Includes police clearance where needed.",
      "pricePaisa": 799900,
      "required": false,
      "defaultSelected": true
    }
  ]'::jsonb,
  -- Adjust base price to just FSSAI State License portion
  price_base_paisa = 1359900  -- ₹13,599 for FSSAI State only (was ₹33,599 for all 4)
WHERE slug = 'cloud-kitchen-setup';
