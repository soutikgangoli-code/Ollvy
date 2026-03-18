-- =============================================================================
-- Migration: Update addon govt fees and add bundle flag
-- =============================================================================

-- Add is_bundle column for bundle-type services
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'service_packages' AND column_name = 'is_bundle'
  ) THEN
    ALTER TABLE service_packages ADD COLUMN is_bundle boolean DEFAULT false;
    COMMENT ON COLUMN service_packages.is_bundle IS 'Whether this is a bundle of multiple services';
  END IF;
END $$;

-- Update cloud kitchen with correct addon govt fees and mark as bundle
UPDATE service_packages
SET
  is_bundle = true,
  addons = '[
    {
      "id": "gst-registration",
      "name": "GST Registration",
      "description": "GSTIN in 7 working days. Required for Swiggy/Zomato TCS claims.",
      "pricePaisa": 899900,
      "govtFeePaisa": 0,
      "required": false,
      "defaultSelected": true
    },
    {
      "id": "shop-establishment",
      "name": "Shop & Establishment",
      "description": "State labour department registration. 5-7 working days.",
      "pricePaisa": 499900,
      "govtFeePaisa": 20000,
      "required": false,
      "defaultSelected": true
    },
    {
      "id": "trade-license",
      "name": "Trade License / Eating House",
      "description": "Municipal corporation license. Includes police clearance where needed.",
      "pricePaisa": 799900,
      "govtFeePaisa": 200000,
      "required": false,
      "defaultSelected": true
    }
  ]'::jsonb
WHERE slug = 'cloud-kitchen-setup';
