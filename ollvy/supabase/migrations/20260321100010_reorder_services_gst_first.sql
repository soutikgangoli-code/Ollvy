-- =============================================================================
-- Migration: Reorder Services - GST Registration First
-- =============================================================================

-- Set GST Registration as first (display_order = 1)
UPDATE service_packages
SET display_order = 1
WHERE slug = 'gst-registration';

-- Push other services down
UPDATE service_packages
SET display_order = display_order + 1
WHERE slug != 'gst-registration'
AND display_order >= 1;
