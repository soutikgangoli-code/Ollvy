-- =============================================================================
-- Migration: Combine govt fees into service fees (no separate govt fee display)
-- =============================================================================

-- Update cloud kitchen to combine all fees into single "service fee"
-- Base FSSAI: ₹13,599 + ₹2,100 govt = ₹15,699
-- GST: ₹8,999 (no govt fee)
-- Shop & Est: ₹4,999 + ₹200 govt = ₹5,199
-- Trade License: ₹7,999 + ₹2,000 govt = ₹9,999

UPDATE service_packages
SET
  price_base_paisa = 1569900,  -- ₹15,699 (FSSAI + govt fee combined)
  price_govt_fees_paisa = 0,    -- No separate govt fee
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
      "pricePaisa": 519900,
      "govtFeePaisa": 0,
      "required": false,
      "defaultSelected": true
    },
    {
      "id": "trade-license",
      "name": "Trade License / Eating House",
      "description": "Municipal corporation license. 15-30 working days.",
      "pricePaisa": 999900,
      "govtFeePaisa": 0,
      "required": false,
      "defaultSelected": true
    }
  ]'::jsonb
WHERE slug = 'cloud-kitchen-setup';
