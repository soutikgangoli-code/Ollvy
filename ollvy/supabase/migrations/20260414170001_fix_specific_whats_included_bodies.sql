-- Fix specific whats_included items that need manual adjustment:
-- 1. IEPF items with long bodies but no periods (not caught by auto-trim)
-- 2. GST registration "Officer queries" lost important info

-- iepf-consultation: trim long body to one line
UPDATE service_packages SET
  whats_included = replace(
    whats_included::text,
    'IEPF-5 needs completely different documents depending on: whether the original holder is living or deceased, whether shares are physical or demat, whether you are the original investor or a legal heir',
    'Document list customised based on your specific situation'
  )::jsonb
WHERE slug = 'iepf-consultation';

-- gst-registration: restore the important part
UPDATE service_packages SET
  whats_included = replace(
    whats_included::text,
    'Happens in about 20% of cases.',
    'Ollvy CA responds within 24 hours. Included in the service.'
  )::jsonb
WHERE slug = 'gst-registration';

-- cloud-kitchen-setup: "FSSAI licence" body is still too long, trim better
UPDATE service_packages SET
  whats_included = replace(
    whats_included::text,
    'Basic Registration (up to Rs 12 lakh turnover), State License (Rs 12 lakh to Rs 20 crore), or Central License (above Rs 20 crore or multi-state).',
    'We confirm the right licence type before you pay the government fee.'
  )::jsonb
WHERE slug = 'cloud-kitchen-setup';

-- cloud-kitchen-setup: "Pre-inspection checklist" still long
UPDATE service_packages SET
  whats_included = replace(
    whats_included::text,
    'For State and Central FSSAI licences, we provide a checklist of what inspectors check: pest control certificate, water testing, equipment hygiene, food safety plan.',
    'Checklist of what FSSAI inspectors check before your licence is issued.'
  )::jsonb
WHERE slug = 'cloud-kitchen-setup';

-- llp-incorporation: "DSC arranged" body is too terse now, slightly better
UPDATE service_packages SET
  whats_included = replace(
    whats_included::text,
    '"DSC required for all partners."',
    '"We arrange DSC tokens and guide video verification in the app."'
  )::jsonb
WHERE slug = 'llp-incorporation';
