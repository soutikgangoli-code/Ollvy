-- =============================================================================
-- Migration: Remove all govt fees from addons (definitive fix)
-- =============================================================================

-- Cloud kitchen addons should NOT have govt fees
-- Only the base FSSAI service has a govt fee (₹2,100 for State license)
UPDATE service_packages
SET
  addons = '[
    {
      "id": "gst-registration",
      "name": "GST Registration",
      "description": "GSTIN in 7 working days. Required for Swiggy/Zomato.",
      "pricePaisa": 899900,
      "govtFeePaisa": 0,
      "required": false,
      "defaultSelected": true
    },
    {
      "id": "shop-establishment",
      "name": "Shop & Establishment",
      "description": "Labour department registration. 5-7 working days.",
      "pricePaisa": 499900,
      "govtFeePaisa": 0,
      "required": false,
      "defaultSelected": true
    },
    {
      "id": "trade-license",
      "name": "Trade License / Eating House",
      "description": "Municipal corporation license. 15-30 working days.",
      "pricePaisa": 799900,
      "govtFeePaisa": 0,
      "required": false,
      "defaultSelected": true
    }
  ]'::jsonb
WHERE slug = 'cloud-kitchen-setup';
