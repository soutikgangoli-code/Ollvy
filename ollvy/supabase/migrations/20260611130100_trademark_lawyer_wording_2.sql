-- Catch the two trademark "attorney" phrasings the first pass missed:
-- "Ollvy trademark attorney" (lowercase) and the "Attorney assigned" milestone.
UPDATE service_packages
SET workflow_stages  = replace(replace(workflow_stages::text,  'trademark attorney', 'trademark lawyer'), 'Attorney assigned', 'Lawyer assigned')::jsonb,
    profile_personas = replace(replace(profile_personas::text, 'trademark attorney', 'trademark lawyer'), 'Attorney assigned', 'Lawyer assigned')::jsonb,
    whats_included   = replace(replace(whats_included::text,   'trademark attorney', 'trademark lawyer'), 'Attorney assigned', 'Lawyer assigned')::jsonb,
    faqs             = replace(replace(faqs::text,             'trademark attorney', 'trademark lawyer'), 'Attorney assigned', 'Lawyer assigned')::jsonb
WHERE slug = 'trademark-registration';
