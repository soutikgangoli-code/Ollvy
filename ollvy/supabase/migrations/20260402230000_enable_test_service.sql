-- Re-enable test service packages temporarily
UPDATE service_packages
SET is_active = true
WHERE
  name ILIKE '%test%'
  OR slug ILIKE '%test%'
  OR short_description ILIKE '%internal test%'
