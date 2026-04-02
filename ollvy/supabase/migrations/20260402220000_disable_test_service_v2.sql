-- Disable all test service packages more broadly
UPDATE service_packages
SET is_active = false
WHERE
  name ILIKE '%test%'
  OR slug ILIKE '%test%'
  OR short_description ILIKE '%internal test%'
