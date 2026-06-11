-- Trademark is legal/IP work fronted by a lawyer (India term), not a CA or
-- "attorney". Fix the professional wording in the trademark questionnaire help
-- text and the live DB content. "power of attorney" (a document) is deliberately
-- left alone — only the specific "Ollvy attorney" / "Trademark attorney" phrases
-- are replaced.

-- 1. Class-question help text: "our CA will advise" -> "our lawyer will advise"
UPDATE service_questionnaires sq
SET help_text = replace(help_text, 'our CA', 'our lawyer')
FROM service_packages sp
WHERE sq.service_package_id = sp.id
  AND sp.slug = 'trademark-registration'
  AND sq.help_text LIKE '%our CA%';

-- 2. Live service-page content (DB-driven): attorney -> lawyer, targeted phrases only.
UPDATE service_packages
SET workflow_stages  = replace(replace(workflow_stages::text,  'Ollvy attorney', 'Ollvy lawyer'), 'Trademark attorney', 'Trademark lawyer')::jsonb,
    profile_personas = replace(replace(profile_personas::text, 'Ollvy attorney', 'Ollvy lawyer'), 'Trademark attorney', 'Trademark lawyer')::jsonb,
    whats_included   = replace(replace(whats_included::text,   'Ollvy attorney', 'Ollvy lawyer'), 'Trademark attorney', 'Trademark lawyer')::jsonb,
    faqs             = replace(replace(faqs::text,             'Ollvy attorney', 'Ollvy lawyer'), 'Trademark attorney', 'Trademark lawyer')::jsonb
WHERE slug = 'trademark-registration';
