-- Clean all AI slop, filler, em dashes, and standalone CA across all services.
-- One migration to fix everything.

BEGIN;

-- ============================================================
-- 1. GLOBAL: Replace all em dashes with " - " across all JSONB + text columns
-- ============================================================

UPDATE service_packages SET
  workflow_stages = replace(workflow_stages::text, '—', '-')::jsonb
WHERE workflow_stages::text LIKE '%—%';

UPDATE service_packages SET
  whats_included = replace(whats_included::text, '—', '-')::jsonb
WHERE whats_included::text LIKE '%—%';

UPDATE service_packages SET
  service_risks = replace(service_risks::text, '—', '-')::jsonb
WHERE service_risks::text LIKE '%—%';

UPDATE service_packages SET
  faqs = replace(faqs::text, '—', '-')::jsonb
WHERE faqs::text LIKE '%—%';

UPDATE service_packages SET
  seo_description = replace(seo_description, '—', '-')
WHERE seo_description LIKE '%—%';

UPDATE service_packages SET
  short_description = replace(short_description, '—', '-')
WHERE short_description LIKE '%—%';

UPDATE service_packages SET
  tagline = replace(tagline, '—', '-')
WHERE tagline LIKE '%—%';

-- ============================================================
-- 2. GLOBAL: Fix remaining standalone "CA" in text columns
-- ============================================================

-- business-pan: "CA-handled" in seo and short desc
UPDATE service_packages SET
  seo_description = replace(seo_description, 'CA-handled', 'Filed by Ollvy'),
  short_description = replace(short_description, 'CA-handled', 'Filed by Ollvy')
WHERE slug = 'business-pan';

-- tds-monthly: "CA determines" in step body
UPDATE service_packages SET
  workflow_stages = replace(workflow_stages::text, 'CA determines', 'Ollvy CA determines')::jsonb
WHERE slug = 'tds-monthly-compliance';

-- gst-monthly: "verified CA" in seo desc
UPDATE service_packages SET
  seo_description = replace(seo_description, 'verified CA', 'Ollvy CA')
WHERE slug = 'gst-monthly';

-- ============================================================
-- 3. SLOP WORDS
-- ============================================================

-- msme: "Unlock" / "Unlocks"
UPDATE service_packages SET
  seo_description = replace(seo_description, 'Unlock govt schemes', 'Access govt schemes'),
  short_description = replace(short_description, 'Unlocks priority sector lending', 'Qualifies you for priority sector lending')
WHERE slug = 'msme-registration';

-- pvt-ltd: "end-to-end"
UPDATE service_packages SET
  faqs = replace(faqs::text, 'end-to-end', 'total')::jsonb
WHERE slug = 'pvt-ltd-incorporation';

-- gst-monthly: "ensure consistency"
UPDATE service_packages SET
  service_risks = replace(service_risks::text, 'to ensure consistency', 'for consistency')::jsonb
WHERE slug = 'gst-monthly';

-- ============================================================
-- 4. FILLER SENTENCES
-- ============================================================

-- business-pan Step 4: remove "This stage is governed by government timelines."
UPDATE service_packages SET
  workflow_stages = replace(
    workflow_stages::text,
    'Income Tax Department processes your application. This stage is governed by government timelines. You can track status on the NSDL portal using your acknowledgement number.',
    'Income Tax Department processes your application. Track status on the NSDL portal using your acknowledgement number.'
  )::jsonb
WHERE slug = 'business-pan';

-- gst-registration tagline: remove "We handle every step."
UPDATE service_packages SET
  tagline = 'Your GSTIN, applied for and obtained.'
WHERE slug = 'gst-registration';

-- msme Step 1: remove "That is all that is needed."
UPDATE service_packages SET
  workflow_stages = replace(
    workflow_stages::text,
    'Owner Aadhaar for OTP verification, business PAN. That is all that is needed.',
    'Owner Aadhaar for OTP verification and business PAN.'
  )::jsonb
WHERE slug = 'msme-registration';

-- iepf Step 2: remove salesy prose
UPDATE service_packages SET
  workflow_stages = replace(
    workflow_stages::text,
    'Some people find more than they expected. Some find nothing — and that clarity saves months of misdirected effort.',
    'Results shared before the call so you know exactly what is there.'
  )::jsonb
WHERE slug = 'iepf-consultation';

-- iepf Step 3: remove "Scheduled at a time that suits you" and "You ask whatever you need to. Straight answers."
UPDATE service_packages SET
  workflow_stages = replace(
    replace(
      workflow_stages::text,
      'Scheduled at a time that suits you\n',
      ''
    ),
    'You ask whatever you need to. Straight answers.',
    ''
  )::jsonb
WHERE slug = 'iepf-consultation';

COMMIT;
