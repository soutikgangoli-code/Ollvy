-- =============================================================================
-- Migration: Revert bundle base pricing - keep base price separate from addons
-- =============================================================================

-- The detail page (UnifiedServicePage) calculates total dynamically by adding
-- base price + selected addons. So price_base_paisa should be just FSSAI base.
-- The ServiceCard will calculate bundle total using addons data.

UPDATE service_packages
SET
  price_base_paisa = 1359900,  -- ₹13,599 (FSSAI base only)
  price_govt_fees_paisa = 210000  -- ₹2,100 (FSSAI State govt fee)
WHERE slug = 'cloud-kitchen-setup';
