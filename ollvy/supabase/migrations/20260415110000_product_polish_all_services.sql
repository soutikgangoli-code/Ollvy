-- Product polish: make every line easy to read, remove acronym soup,
-- cut redundant bodies, simplify daunting phrasing.

BEGIN;

-- ============================================================
-- BUSINESS-ITR
-- ============================================================

UPDATE service_packages SET short_description = 'We review your books, prepare the return, and you approve before we file.'
WHERE slug = 'business-itr';

UPDATE service_packages SET workflow_stages = replace(workflow_stages::text,
  'Upload via app: audited accounts, trial balance, bank statements, income docs',
  'Upload your financials through the app')::jsonb
WHERE slug = 'business-itr';

UPDATE service_packages SET workflow_stages = replace(workflow_stages::text,
  'P&L, Balance Sheet, depreciation, director remuneration reviewed',
  'Your financials, depreciation, and director pay reviewed')::jsonb
WHERE slug = 'business-itr';

UPDATE service_packages SET service_risks = replace(service_risks::text,
  'Losses cannot be carried forward if filed late',
  'Business losses can''t be carried forward if filed late')::jsonb
WHERE slug = 'business-itr';

UPDATE service_packages SET faqs = replace(faqs::text,
  'Form 26AS, and depreciation schedule',
  'Form 26AS (tax credit statement), and depreciation schedule')::jsonb
WHERE slug = 'business-itr';

-- ============================================================
-- BUSINESS-PAN
-- ============================================================

UPDATE service_packages SET short_description = 'Company PAN in 7 working days. Required for bank account, GST, and ITR.'
WHERE slug = 'business-pan';

UPDATE service_packages SET whats_included = replace(whats_included::text,
  'NSDL acknowledgement number shared immediately on submission so you can track status yourself.',
  'Shared immediately so you can track status.')::jsonb
WHERE slug = 'business-pan';

-- ============================================================
-- CLOUD-KITCHEN-SETUP
-- ============================================================

UPDATE service_packages SET short_description = 'All licences for your cloud kitchen - FSSAI, GST, and trade licence filed together.'
WHERE slug = 'cloud-kitchen-setup';

UPDATE service_packages SET whats_included = replace(whats_included::text,
  'Full GST registration process including Ollvy CA assignment, document verification, and ARN tracking.',
  'GST registration handled as part of the package.')::jsonb
WHERE slug = 'cloud-kitchen-setup';

-- ============================================================
-- COMPANY-NAME-CHANGE
-- ============================================================

UPDATE service_packages SET workflow_stages = replace(workflow_stages::text,
  'Approved name reserved for 20 days. INC-24 must be filed in that window',
  'Approved name reserved for 20 days. We file INC-24 within that window')::jsonb
WHERE slug = 'company-name-change';

UPDATE service_packages SET workflow_stages = replace(workflow_stages::text,
  'Use new CoI to update bank, GST, trademark. Those are separate processes',
  'Use the new certificate to update bank, GST, and trademark')::jsonb
WHERE slug = 'company-name-change';

-- ============================================================
-- LLP-INCORPORATION
-- ============================================================

-- Step 4: remove redundant "Filed with MCA" bullet
UPDATE service_packages SET workflow_stages = replace(workflow_stages::text,
  'LLP Agreement drafted based on your actual partner arrangement\nFiled with MCA',
  'LLP Agreement drafted based on your actual partner arrangement')::jsonb
WHERE slug = 'llp-incorporation';

-- Included 2: remove body that repeats title
UPDATE service_packages SET whats_included = replace(whats_included::text,
  '"Every designated partner needs a DPIN."',
  'null')::jsonb
WHERE slug = 'llp-incorporation';

-- Included 3: remove body that repeats title
UPDATE service_packages SET whats_included = replace(whats_included::text,
  '"We arrange DSC tokens and guide video verification in the app."',
  'null')::jsonb
WHERE slug = 'llp-incorporation';

-- FAQ 1: expand ESOPs
UPDATE service_packages SET faqs = replace(faqs::text,
  'issue ESOPs, or need share-based ownership',
  'issue employee stock options (ESOPs), or need share-based ownership')::jsonb
WHERE slug = 'llp-incorporation';

-- ============================================================
-- MCA-ANNUAL-FILING
-- ============================================================

UPDATE service_packages SET tagline = 'Your company''s annual return. Filed on time, every year.'
WHERE slug = 'mca-annual-filing';

-- Risk 3: remove command-like "File as soon as documents are ready"
UPDATE service_packages SET service_risks = replace(service_risks::text,
  '₹100/day per form, ₹200/day for both. No ceiling\nFile as soon as documents are ready',
  '₹100/day per form, ₹200/day for both. No ceiling')::jsonb
WHERE slug = 'mca-annual-filing';

-- ============================================================
-- PVT-LTD-INCORPORATION
-- ============================================================

UPDATE service_packages SET
  short_description = 'Incorporate your Pvt Ltd company. Name approval, all government filings, PAN, and TAN included.',
  seo_description = 'Register your Pvt Ltd in 15 working days. All filings included. Fixed price ₹13,998.'
WHERE slug = 'pvt-ltd-incorporation';

-- Included 5: ADT-1 jargon
UPDATE service_packages SET whats_included = replace(whats_included::text,
  'Board meeting (30 days), ADT-1 auditor appointment (15 days from AGM)',
  'Board meeting (30 days), auditor appointment (15 days from AGM)')::jsonb
WHERE slug = 'pvt-ltd-incorporation';

-- FAQ 3: expand ESOPs
UPDATE service_packages SET faqs = replace(faqs::text,
  'issue ESOPs, or need the company structure',
  'issue employee stock options (ESOPs), or need the company structure')::jsonb
WHERE slug = 'pvt-ltd-incorporation';

-- FAQ 4: flip OPC phrasing
UPDATE service_packages SET faqs = replace(faqs::text,
  'consider OPC (One Person Company)',
  'consider a One Person Company (OPC)')::jsonb
WHERE slug = 'pvt-ltd-incorporation';

-- ============================================================
-- TDS-MONTHLY-COMPLIANCE
-- ============================================================

UPDATE service_packages SET tagline = 'Deduct TDS. Pay the government. File the return. Every month, on time.'
WHERE slug = 'tds-monthly-compliance';

-- Step 1 bullet 3: "lower deduction certificates" jargon
UPDATE service_packages SET workflow_stages = replace(workflow_stages::text,
  'Exemptions and lower deduction certificates applied',
  'Exemptions applied where applicable')::jsonb
WHERE slug = 'tds-monthly-compliance';

-- Included 2: BSR code jargon
UPDATE service_packages SET whats_included = replace(whats_included::text,
  'Challan needs the right BSR code, assessment year, and tax type',
  'Challan prepared with the right codes and assessment year')::jsonb
WHERE slug = 'tds-monthly-compliance';

-- Risk 2 bullet 2: vague filler
UPDATE service_packages SET service_risks = replace(service_risks::text,
  'If you deduct too little, you pay the difference plus interest\nCurrent rates applied per section',
  'If you deduct too little, you pay the difference plus interest')::jsonb
WHERE slug = 'tds-monthly-compliance';

-- FAQ 1: "prescribed threshold limits" bureaucratic
UPDATE service_packages SET faqs = replace(faqs::text,
  'above prescribed threshold limits',
  'above certain limits')::jsonb
WHERE slug = 'tds-monthly-compliance';

COMMIT;
