-- Fix "Dedicated Ollvy CA" → "Ollvy CA" (redundant phrasing)
-- Also fix "a dedicated CA" → "an Ollvy CA" and "dedicated CA" → "Ollvy CA"

UPDATE service_packages SET
  workflow_stages  = replace(workflow_stages::text,  'Dedicated Ollvy CA', 'Ollvy CA')::jsonb,
  whats_included = replace(whats_included::text,  'Dedicated Ollvy CA', 'Ollvy CA')::jsonb,
  service_risks  = replace(service_risks::text,   'Dedicated Ollvy CA', 'Ollvy CA')::jsonb,
  faqs           = replace(faqs::text,            'Dedicated Ollvy CA', 'Ollvy CA')::jsonb;

UPDATE service_packages SET
  seo_description   = replace(seo_description,   'Dedicated Ollvy CA', 'Ollvy CA'),
  short_description = replace(short_description, 'Dedicated Ollvy CA', 'Ollvy CA');

-- Also catch lowercase
UPDATE service_packages SET
  workflow_stages  = replace(workflow_stages::text,  'dedicated Ollvy CA', 'Ollvy CA')::jsonb,
  whats_included = replace(whats_included::text,  'dedicated Ollvy CA', 'Ollvy CA')::jsonb,
  service_risks  = replace(service_risks::text,   'dedicated Ollvy CA', 'Ollvy CA')::jsonb,
  faqs           = replace(faqs::text,            'dedicated Ollvy CA', 'Ollvy CA')::jsonb;

UPDATE service_packages SET
  seo_description   = replace(seo_description,   'dedicated Ollvy CA', 'Ollvy CA'),
  short_description = replace(short_description, 'dedicated Ollvy CA', 'Ollvy CA');

-- Fix "dedicated CA" (without Ollvy) → "Ollvy CA"
UPDATE service_packages SET
  workflow_stages  = replace(workflow_stages::text,  'dedicated CA', 'Ollvy CA')::jsonb,
  whats_included = replace(whats_included::text,  'dedicated CA', 'Ollvy CA')::jsonb,
  service_risks  = replace(service_risks::text,   'dedicated CA', 'Ollvy CA')::jsonb,
  faqs           = replace(faqs::text,            'dedicated CA', 'Ollvy CA')::jsonb;

UPDATE service_packages SET
  seo_description   = replace(seo_description,   'dedicated CA', 'Ollvy CA'),
  short_description = replace(short_description, 'dedicated CA', 'Ollvy CA');
