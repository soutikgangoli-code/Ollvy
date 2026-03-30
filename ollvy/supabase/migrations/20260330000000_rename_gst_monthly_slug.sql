-- Rename gst-monthly-50l to gst-monthly
-- This migration updates the service slug and all references to it

-- 1. Update the main service slug
UPDATE service_packages
SET slug = 'gst-monthly',
    canonical_url = 'https://www.ollvy.com/services/gst-monthly'
WHERE slug = 'gst-monthly-50l';

-- 2. Update related_slugs arrays that reference the old slug
UPDATE service_packages
SET related_slugs = array_replace(related_slugs, 'gst-monthly-50l', 'gst-monthly')
WHERE 'gst-monthly-50l' = ANY(related_slugs);

-- 3. Update unlocks JSON arrays that reference the old slug
UPDATE service_packages
SET unlocks = (
  SELECT jsonb_agg(
    CASE
      WHEN item->>'slug' = 'gst-monthly-50l'
      THEN jsonb_set(item, '{slug}', '"gst-monthly"')
      ELSE item
    END
  )
  FROM jsonb_array_elements(unlocks) AS item
)
WHERE unlocks IS NOT NULL
  AND unlocks::text LIKE '%gst-monthly-50l%';

-- 4. Update any service_explainer JSON that might reference the old slug
UPDATE service_packages
SET service_explainer = REPLACE(service_explainer::text, 'gst-monthly-50l', 'gst-monthly')::jsonb
WHERE service_explainer IS NOT NULL
  AND service_explainer::text LIKE '%gst-monthly-50l%';
