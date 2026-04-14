BEGIN;

-- business-pan: fix standalone CA in workflow_stages
UPDATE service_packages
SET workflow_stages = replace(replace(
  workflow_stages::text,
  'CA reviews within 4 hours', 'Ollvy CA reviews within 4 hours'),
  'CA reviews same day', 'Ollvy CA reviews same day')::jsonb
WHERE slug = 'business-pan';

UPDATE service_packages
SET workflow_stages = replace(replace(
  workflow_stages::text,
  'Documents verified by CA', 'Documents verified by Ollvy'),
  'CA prepares Form 49A', 'Ollvy CA prepares Form 49A')::jsonb
WHERE slug = 'business-pan';

-- business-pan: fix standalone CA in whats_included
UPDATE service_packages
SET whats_included = replace(
  whats_included::text,
  'CA handles everything', 'Ollvy handles everything')::jsonb
WHERE slug = 'business-pan';

-- business-pan: fix standalone CA in service_risks
UPDATE service_packages
SET service_risks = replace(replace(
  service_risks::text,
  'CA verifies all documents', 'Ollvy verifies all documents'),
  'CA checks document dates', 'Ollvy checks document dates')::jsonb
WHERE slug = 'business-pan';

-- cloud-kitchen-setup: fix standalone CA in whats_included
UPDATE service_packages
SET whats_included = replace(
  whats_included::text,
  'including CA assignment', 'including Ollvy CA assignment')::jsonb
WHERE slug = 'cloud-kitchen-setup';

COMMIT;
