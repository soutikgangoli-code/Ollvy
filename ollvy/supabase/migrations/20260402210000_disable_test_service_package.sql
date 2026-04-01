-- Disable test service package after testing is complete
UPDATE service_packages
SET is_active = false
WHERE name ILIKE '%test%' AND price_base_paisa = 100
