-- Fix doubled "Ollvy Ollvy CA" and make phrasing natural:
-- Use "Ollvy CA" when referring to the assigned professional
-- Use "Ollvy" when referring to the company/service

-- 1. Fix doubled "Ollvy Ollvy CA" in seo_description and short_description
UPDATE service_packages SET
  seo_description   = replace(seo_description,   'Ollvy Ollvy CA', 'Ollvy CA'),
  short_description = replace(short_description, 'Ollvy Ollvy CA', 'Ollvy CA');

-- 2. Fix "Verified Ollvy CA" → just "Ollvy CA" (business-itr seo)
UPDATE service_packages SET
  seo_description = replace(seo_description, 'Verified Ollvy CA', 'Ollvy CA');

-- 3. In whats_included: titles that are about the service/brand → "Ollvy"
--    "Ollvy CA fills all 23 GSTN fields" → "Ollvy fills all 23 GSTN fields"
UPDATE service_packages SET
  whats_included = replace(
    replace(
      whats_included::text,
      'Ollvy CA fills all 23 GSTN fields', 'Ollvy fills all 23 GSTN fields'
    ),
    'All 23 fields handled by Ollvy CA', 'All 23 fields handled by Ollvy'
  )::jsonb
WHERE slug = 'gst-registration';

--    "Ollvy CA prepares and files Form 49A" → "Ollvy prepares and files Form 49A"
UPDATE service_packages SET
  whats_included = replace(
    whats_included::text,
    'Ollvy CA prepares and files Form 49A', 'Ollvy prepares and files Form 49A'
  )::jsonb
WHERE slug = 'business-pan';

-- 4. In workflow_stages: step titles that read better with "Ollvy"
--    "Upload documents - Ollvy CA reviews same day" → "Upload documents - Ollvy reviews same day"
UPDATE service_packages SET
  workflow_stages = replace(
    workflow_stages::text,
    'Upload documents - Ollvy CA reviews same day', 'Upload documents - Ollvy reviews same day'
  )::jsonb
WHERE slug = 'business-pan';

-- 5. Fix "Documents received and assigned to Ollvy CA" → "Documents received, Ollvy CA assigned"
--    (reads more naturally)
UPDATE service_packages SET
  workflow_stages = replace(
    workflow_stages::text,
    'Documents received and assigned to Ollvy CA', 'Documents received, Ollvy CA assigned'
  )::jsonb
WHERE slug = 'business-itr';
