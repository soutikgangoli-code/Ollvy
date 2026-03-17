-- =============================================================================
-- Migration: Seed complete service catalogue (32 services per spec §5)
-- =============================================================================

-- Create order_type enum if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_type') THEN
    CREATE TYPE order_type AS ENUM ('one_time', 'recurring');
  END IF;
END $$;

-- Create billing_cycle enum if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'billing_cycle') THEN
    CREATE TYPE billing_cycle AS ENUM ('monthly', 'quarterly', 'annual', 'one_time');
  END IF;
END $$;

-- Ensure service_tier_groups table exists (idempotent)
CREATE TABLE IF NOT EXISTS service_tier_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add all required columns to service_packages if they don't exist
DO $$
BEGIN
  -- order_type column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service_packages' AND column_name = 'order_type') THEN
    ALTER TABLE service_packages ADD COLUMN order_type order_type DEFAULT 'one_time';
  END IF;
  -- billing_cycle column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service_packages' AND column_name = 'billing_cycle') THEN
    ALTER TABLE service_packages ADD COLUMN billing_cycle billing_cycle DEFAULT 'one_time';
  END IF;
  -- price_base_paisa column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service_packages' AND column_name = 'price_base_paisa') THEN
    ALTER TABLE service_packages ADD COLUMN price_base_paisa INT DEFAULT 0;
  END IF;
  -- Drop NOT NULL on legacy columns if they exist
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service_packages' AND column_name = 'base_price') THEN
    ALTER TABLE service_packages ALTER COLUMN base_price DROP NOT NULL;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service_packages' AND column_name = 'platform_fee_percent') THEN
    ALTER TABLE service_packages ALTER COLUMN platform_fee_percent DROP NOT NULL;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service_packages' AND column_name = 'gst_rate') THEN
    ALTER TABLE service_packages ALTER COLUMN gst_rate DROP NOT NULL;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service_packages' AND column_name = 'estimated_days') THEN
    ALTER TABLE service_packages ALTER COLUMN estimated_days DROP NOT NULL;
  END IF;
  -- price_govt_fees_paisa column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service_packages' AND column_name = 'price_govt_fees_paisa') THEN
    ALTER TABLE service_packages ADD COLUMN price_govt_fees_paisa INT DEFAULT 0;
  END IF;
  -- price_gst_rate column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service_packages' AND column_name = 'price_gst_rate') THEN
    ALTER TABLE service_packages ADD COLUMN price_gst_rate INT DEFAULT 18;
  END IF;
  -- sla_working_days column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service_packages' AND column_name = 'sla_working_days') THEN
    ALTER TABLE service_packages ADD COLUMN sla_working_days INT DEFAULT 7;
  END IF;
  -- situation_tags column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service_packages' AND column_name = 'situation_tags') THEN
    ALTER TABLE service_packages ADD COLUMN situation_tags TEXT[] DEFAULT '{}';
  END IF;
  -- workflow_stages column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service_packages' AND column_name = 'workflow_stages') THEN
    ALTER TABLE service_packages ADD COLUMN workflow_stages JSONB DEFAULT '[]';
  END IF;
  -- urgency_score column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service_packages' AND column_name = 'urgency_score') THEN
    ALTER TABLE service_packages ADD COLUMN urgency_score INT DEFAULT 50;
  END IF;
  -- price_varies_by_state column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service_packages' AND column_name = 'price_varies_by_state') THEN
    ALTER TABLE service_packages ADD COLUMN price_varies_by_state BOOLEAN DEFAULT false;
  END IF;
  -- tier_group_id column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service_packages' AND column_name = 'tier_group_id') THEN
    ALTER TABLE service_packages ADD COLUMN tier_group_id UUID REFERENCES service_tier_groups(id);
  END IF;
  -- tier_label column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service_packages' AND column_name = 'tier_label') THEN
    ALTER TABLE service_packages ADD COLUMN tier_label TEXT;
  END IF;
  -- is_active column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service_packages' AND column_name = 'is_active') THEN
    ALTER TABLE service_packages ADD COLUMN is_active BOOLEAN DEFAULT false;
  END IF;
  -- slug column (unique)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service_packages' AND column_name = 'slug') THEN
    ALTER TABLE service_packages ADD COLUMN slug TEXT UNIQUE;
  END IF;
  -- short_description column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service_packages' AND column_name = 'short_description') THEN
    ALTER TABLE service_packages ADD COLUMN short_description TEXT;
  END IF;
  -- name column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service_packages' AND column_name = 'name') THEN
    ALTER TABLE service_packages ADD COLUMN name TEXT;
  END IF;
END $$;

-- First, clear any incomplete test data (preserves existing records with proper schema)
DELETE FROM service_packages WHERE slug LIKE 'gst-%' OR slug LIKE 'pvt-%' OR slug LIKE 'trademark-%'
  OR slug LIKE 'fssai-%' OR slug LIKE 'iec-%' OR slug LIKE 'payroll-%' OR slug LIKE 'pf-%';

-- Create tier groups for tiered services
INSERT INTO service_tier_groups (id, name, description) VALUES
  ('00000000-0000-0000-0001-000000000001', 'GST Monthly Filing', 'Monthly GST compliance tiers by turnover'),
  ('00000000-0000-0000-0001-000000000002', 'Payroll Management', 'Monthly payroll tiers by employee count')
ON CONFLICT DO NOTHING;

-- Insert all 32 services from spec §5
-- Column order: name, slug, short_description, order_type, billing_cycle,
--               price_base_paisa, price_govt_fees_paisa, price_gst_rate,
--               sla_working_days, urgency_score, situation_tags, workflow_stages,
--               price_varies_by_state, tier_group_id, tier_label, is_active

INSERT INTO service_packages (
  name, slug, short_description, order_type, billing_cycle,
  price_base_paisa, price_govt_fees_paisa, price_gst_rate,
  sla_working_days, urgency_score, situation_tags, workflow_stages,
  price_varies_by_state, tier_group_id, tier_label, is_active
) VALUES
-- =====================
-- 1. COMPANY REGISTRATION (One-time)
-- =====================
(
  'Private Limited Incorporation', 'pvt-ltd-incorporation',
  'Incorporate your business as a Private Limited Company with MCA compliance',
  'one_time', 'one_time',
  2499900, 0, 18,
  15, 80,
  ARRAY['just_starting_out', 'have_investors'],
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 2, "wait_for_govt": false},
    {"stage_key": "dsc_application", "stage_name": "DSC Application", "sla_working_days": 2, "wait_for_govt": false},
    {"stage_key": "name_approval", "stage_name": "Name Approval (RUN)", "sla_working_days": 3, "wait_for_govt": true},
    {"stage_key": "moa_aoa_drafting", "stage_name": "MOA/AOA Drafting", "sla_working_days": 2, "wait_for_govt": false},
    {"stage_key": "incorporation_filing", "stage_name": "MCA Filing", "sla_working_days": 3, "wait_for_govt": true},
    {"stage_key": "certificate_delivery", "stage_name": "Certificate Delivery", "sla_working_days": 3, "wait_for_govt": true}]'::jsonb,
  false, NULL, NULL, true
),
(
  'LLP Registration', 'llp-registration',
  'Register your Limited Liability Partnership with MCA',
  'one_time', 'one_time',
  1999900, 0, 18,
  15, 50,
  ARRAY['just_starting_out', 'have_investors'],
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 2, "wait_for_govt": false},
    {"stage_key": "dsc_application", "stage_name": "DSC Application", "sla_working_days": 2, "wait_for_govt": false},
    {"stage_key": "name_approval", "stage_name": "Name Approval", "sla_working_days": 3, "wait_for_govt": true},
    {"stage_key": "llp_filing", "stage_name": "LLP Filing", "sla_working_days": 5, "wait_for_govt": true},
    {"stage_key": "certificate_delivery", "stage_name": "Certificate Delivery", "sla_working_days": 3, "wait_for_govt": true}]'::jsonb,
  false, NULL, NULL, false
),
(
  'Partnership Deed Drafting', 'partnership-deed',
  'Draft and register your partnership deed',
  'one_time', 'one_time',
  699900, 0, 18,
  7, 50,
  ARRAY['just_starting_out'],
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 1, "wait_for_govt": false},
    {"stage_key": "deed_drafting", "stage_name": "Deed Drafting", "sla_working_days": 3, "wait_for_govt": false},
    {"stage_key": "registration", "stage_name": "Registration", "sla_working_days": 3, "wait_for_govt": true}]'::jsonb,
  false, NULL, NULL, false
),
(
  'Sole Proprietorship Setup', 'sole-prop-setup',
  'Complete setup for sole proprietorship business',
  'one_time', 'one_time',
  499900, 0, 18,
  5, 50,
  ARRAY['just_starting_out'],
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 1, "wait_for_govt": false},
    {"stage_key": "registration", "stage_name": "Registration", "sla_working_days": 4, "wait_for_govt": false}]'::jsonb,
  false, NULL, NULL, false
),
(
  'OPC (One Person Company)', 'opc-registration',
  'Register as a One Person Company with limited liability',
  'one_time', 'one_time',
  2199900, 0, 18,
  15, 50,
  ARRAY['just_starting_out'],
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 2, "wait_for_govt": false},
    {"stage_key": "dsc_application", "stage_name": "DSC Application", "sla_working_days": 2, "wait_for_govt": false},
    {"stage_key": "name_approval", "stage_name": "Name Approval", "sla_working_days": 3, "wait_for_govt": true},
    {"stage_key": "incorporation_filing", "stage_name": "MCA Filing", "sla_working_days": 5, "wait_for_govt": true},
    {"stage_key": "certificate_delivery", "stage_name": "Certificate Delivery", "sla_working_days": 3, "wait_for_govt": true}]'::jsonb,
  false, NULL, NULL, false
),
(
  'Startup India Registration', 'startup-india',
  'Register under Startup India for tax benefits and incentives',
  'one_time', 'one_time',
  799900, 0, 18,
  10, 50,
  ARRAY['just_starting_out', 'have_investors'],
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 2, "wait_for_govt": false},
    {"stage_key": "application_filing", "stage_name": "Application Filing", "sla_working_days": 3, "wait_for_govt": false},
    {"stage_key": "dpiit_review", "stage_name": "DPIIT Review", "sla_working_days": 5, "wait_for_govt": true}]'::jsonb,
  false, NULL, NULL, false
),
(
  'MSME / Udyam Registration', 'msme-udyam',
  'Register under MSME for government benefits and priority lending',
  'one_time', 'one_time',
  299900, 0, 18,
  3, 55,
  ARRAY['just_starting_out', 'need_bank_loan'],
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 1, "wait_for_govt": false},
    {"stage_key": "application_filing", "stage_name": "Application Filing", "sla_working_days": 1, "wait_for_govt": false},
    {"stage_key": "certificate_delivery", "stage_name": "Certificate Delivery", "sla_working_days": 1, "wait_for_govt": true}]'::jsonb,
  false, NULL, NULL, false
),

-- =====================
-- 2. TAX REGISTRATION (One-time)
-- =====================
(
  'GST Registration', 'gst-registration',
  'Register for GST and get your GSTIN within 7 working days',
  'one_time', 'one_time',
  899900, 0, 18,
  7, 95,
  ARRAY['taking_payments', 'just_starting_out', 'importing_exporting'],
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 1, "wait_for_govt": false},
    {"stage_key": "application_filing", "stage_name": "GST Application Filing", "sla_working_days": 2, "wait_for_govt": false},
    {"stage_key": "govt_processing", "stage_name": "Government Processing", "sla_working_days": 3, "wait_for_govt": true},
    {"stage_key": "gstin_delivery", "stage_name": "GSTIN Certificate Delivery", "sla_working_days": 1, "wait_for_govt": false}]'::jsonb,
  false, NULL, NULL, true
),
(
  'Professional Tax Registration', 'professional-tax',
  'Register for Professional Tax in your state',
  'one_time', 'one_time',
  399900, 0, 18,
  7, 50,
  ARRAY['need_to_hire'],
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 1, "wait_for_govt": false},
    {"stage_key": "application_filing", "stage_name": "Application Filing", "sla_working_days": 2, "wait_for_govt": false},
    {"stage_key": "certificate_delivery", "stage_name": "Certificate Delivery", "sla_working_days": 4, "wait_for_govt": true}]'::jsonb,
  true, NULL, NULL, false
),
(
  'IEC (Import Export Code)', 'iec-code',
  'Get your Import Export Code for international trade',
  'one_time', 'one_time',
  699900, 0, 18,
  7, 60,
  ARRAY['importing_exporting'],
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 1, "wait_for_govt": false},
    {"stage_key": "application_filing", "stage_name": "Application Filing", "sla_working_days": 2, "wait_for_govt": false},
    {"stage_key": "dgft_processing", "stage_name": "DGFT Processing", "sla_working_days": 3, "wait_for_govt": true},
    {"stage_key": "iec_delivery", "stage_name": "IEC Delivery", "sla_working_days": 1, "wait_for_govt": false}]'::jsonb,
  false, NULL, NULL, false
),

-- =====================
-- 3. FOOD & BEVERAGES LICENSES (One-time)
-- =====================
(
  'FSSAI Basic Registration', 'fssai-basic',
  'Basic FSSAI registration for small food businesses',
  'one_time', 'one_time',
  799900, 0, 18,
  7, 90,
  ARRAY['selling_food_beverages', 'just_starting_out'],
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 1, "wait_for_govt": false},
    {"stage_key": "application_filing", "stage_name": "Application Filing", "sla_working_days": 2, "wait_for_govt": false},
    {"stage_key": "fssai_processing", "stage_name": "FSSAI Processing", "sla_working_days": 3, "wait_for_govt": true},
    {"stage_key": "certificate_delivery", "stage_name": "Certificate Delivery", "sla_working_days": 1, "wait_for_govt": false}]'::jsonb,
  false, NULL, NULL, false
),
(
  'FSSAI State License', 'fssai-state',
  'State-level FSSAI license for medium food businesses',
  'one_time', 'one_time',
  1899900, 0, 18,
  21, 50,
  ARRAY['selling_food_beverages', 'scaling_up'],
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 2, "wait_for_govt": false},
    {"stage_key": "application_filing", "stage_name": "Application Filing", "sla_working_days": 3, "wait_for_govt": false},
    {"stage_key": "inspection", "stage_name": "Inspection", "sla_working_days": 10, "wait_for_govt": true},
    {"stage_key": "certificate_delivery", "stage_name": "Certificate Delivery", "sla_working_days": 6, "wait_for_govt": true}]'::jsonb,
  true, NULL, NULL, false
),
(
  'FSSAI Central License', 'fssai-central',
  'Central FSSAI license for large food businesses',
  'one_time', 'one_time',
  3499900, 0, 18,
  30, 50,
  ARRAY['selling_food_beverages', 'scaling_up'],
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 3, "wait_for_govt": false},
    {"stage_key": "application_filing", "stage_name": "Application Filing", "sla_working_days": 5, "wait_for_govt": false},
    {"stage_key": "inspection", "stage_name": "Inspection", "sla_working_days": 15, "wait_for_govt": true},
    {"stage_key": "certificate_delivery", "stage_name": "Certificate Delivery", "sla_working_days": 7, "wait_for_govt": true}]'::jsonb,
  false, NULL, NULL, false
),
(
  'Alcohol License', 'alcohol-license',
  'Liquor license for bars, restaurants, and retail',
  'one_time', 'one_time',
  4999900, 0, 18,
  60, 50,
  ARRAY['regulated_industry'],
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 5, "wait_for_govt": false},
    {"stage_key": "application_filing", "stage_name": "Application Filing", "sla_working_days": 5, "wait_for_govt": false},
    {"stage_key": "govt_processing", "stage_name": "Government Processing", "sla_working_days": 45, "wait_for_govt": true},
    {"stage_key": "license_delivery", "stage_name": "License Delivery", "sla_working_days": 5, "wait_for_govt": true}]'::jsonb,
  true, NULL, NULL, false
),
(
  'Eating House License', 'eating-house-license',
  'License for restaurants and food establishments',
  'one_time', 'one_time',
  899900, 0, 18,
  14, 70,
  ARRAY['selling_food_beverages', 'just_starting_out'],
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 2, "wait_for_govt": false},
    {"stage_key": "application_filing", "stage_name": "Application Filing", "sla_working_days": 3, "wait_for_govt": false},
    {"stage_key": "inspection", "stage_name": "Inspection", "sla_working_days": 7, "wait_for_govt": true},
    {"stage_key": "license_delivery", "stage_name": "License Delivery", "sla_working_days": 2, "wait_for_govt": true}]'::jsonb,
  true, NULL, NULL, false
),

-- =====================
-- 4. IP PROTECTION (One-time)
-- =====================
(
  'Trademark - Word Mark', 'trademark-word',
  'Protect your brand name with trademark registration',
  'one_time', 'one_time',
  1499900, 450000, 18,
  180, 65,
  ARRAY['want_to_protect_brand'],
  '[{"stage_key": "tm_search", "stage_name": "Trademark Search", "sla_working_days": 2, "wait_for_govt": false},
    {"stage_key": "application_filing", "stage_name": "Application Filing", "sla_working_days": 3, "wait_for_govt": false},
    {"stage_key": "examination", "stage_name": "Examination", "sla_working_days": 90, "wait_for_govt": true},
    {"stage_key": "publication", "stage_name": "Publication", "sla_working_days": 60, "wait_for_govt": true},
    {"stage_key": "registration", "stage_name": "Registration", "sla_working_days": 25, "wait_for_govt": true}]'::jsonb,
  false, NULL, NULL, false
),
(
  'Trademark - Logo', 'trademark-logo',
  'Protect your logo with trademark registration',
  'one_time', 'one_time',
  1699900, 450000, 18,
  180, 50,
  ARRAY['want_to_protect_brand'],
  '[{"stage_key": "tm_search", "stage_name": "Trademark Search", "sla_working_days": 2, "wait_for_govt": false},
    {"stage_key": "application_filing", "stage_name": "Application Filing", "sla_working_days": 3, "wait_for_govt": false},
    {"stage_key": "examination", "stage_name": "Examination", "sla_working_days": 90, "wait_for_govt": true},
    {"stage_key": "publication", "stage_name": "Publication", "sla_working_days": 60, "wait_for_govt": true},
    {"stage_key": "registration", "stage_name": "Registration", "sla_working_days": 25, "wait_for_govt": true}]'::jsonb,
  false, NULL, NULL, false
),
(
  'Copyright Registration', 'copyright-registration',
  'Register copyright for creative works',
  'one_time', 'one_time',
  899900, 0, 18,
  60, 50,
  ARRAY['want_to_protect_brand'],
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 2, "wait_for_govt": false},
    {"stage_key": "application_filing", "stage_name": "Application Filing", "sla_working_days": 3, "wait_for_govt": false},
    {"stage_key": "examination", "stage_name": "Examination", "sla_working_days": 45, "wait_for_govt": true},
    {"stage_key": "certificate_delivery", "stage_name": "Certificate Delivery", "sla_working_days": 10, "wait_for_govt": true}]'::jsonb,
  false, NULL, NULL, false
),
(
  'Patent Filing (Provisional)', 'patent-provisional',
  'File provisional patent application',
  'one_time', 'one_time',
  3499900, 0, 18,
  30, 50,
  ARRAY['want_to_protect_brand', 'have_investors'],
  '[{"stage_key": "prior_art_search", "stage_name": "Prior Art Search", "sla_working_days": 5, "wait_for_govt": false},
    {"stage_key": "drafting", "stage_name": "Application Drafting", "sla_working_days": 10, "wait_for_govt": false},
    {"stage_key": "application_filing", "stage_name": "Filing", "sla_working_days": 5, "wait_for_govt": false},
    {"stage_key": "acknowledgment", "stage_name": "Acknowledgment", "sla_working_days": 10, "wait_for_govt": true}]'::jsonb,
  true, NULL, NULL, false
),
(
  'Design Registration', 'design-registration',
  'Register your product design with the Patent Office',
  'one_time', 'one_time',
  899900, 0, 18,
  45, 50,
  ARRAY['want_to_protect_brand'],
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 2, "wait_for_govt": false},
    {"stage_key": "application_filing", "stage_name": "Application Filing", "sla_working_days": 3, "wait_for_govt": false},
    {"stage_key": "examination", "stage_name": "Examination", "sla_working_days": 30, "wait_for_govt": true},
    {"stage_key": "certificate_delivery", "stage_name": "Certificate Delivery", "sla_working_days": 10, "wait_for_govt": true}]'::jsonb,
  false, NULL, NULL, false
),

-- =====================
-- 5. OTHER LICENSES (One-time)
-- =====================
(
  'Fire NOC', 'fire-noc',
  'No Objection Certificate from Fire Department',
  'one_time', 'one_time',
  899900, 0, 18,
  21, 50,
  ARRAY['just_starting_out', 'regulated_industry'],
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 2, "wait_for_govt": false},
    {"stage_key": "application_filing", "stage_name": "Application Filing", "sla_working_days": 3, "wait_for_govt": false},
    {"stage_key": "inspection", "stage_name": "Fire Inspection", "sla_working_days": 10, "wait_for_govt": true},
    {"stage_key": "certificate_delivery", "stage_name": "NOC Delivery", "sla_working_days": 6, "wait_for_govt": true}]'::jsonb,
  true, NULL, NULL, false
),
(
  'Shop & Establishment Registration', 'shop-establishment',
  'Register your shop under local Shop & Establishment Act',
  'one_time', 'one_time',
  399900, 0, 18,
  10, 70,
  ARRAY['just_starting_out', 'need_to_hire'],
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 1, "wait_for_govt": false},
    {"stage_key": "application_filing", "stage_name": "Application Filing", "sla_working_days": 2, "wait_for_govt": false},
    {"stage_key": "certificate_delivery", "stage_name": "Certificate Delivery", "sla_working_days": 7, "wait_for_govt": true}]'::jsonb,
  true, NULL, NULL, false
),
(
  'Drug License (Retail)', 'drug-license-retail',
  'Retail drug license for pharmacies',
  'one_time', 'one_time',
  2499900, 0, 18,
  45, 50,
  ARRAY['regulated_industry'],
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 3, "wait_for_govt": false},
    {"stage_key": "application_filing", "stage_name": "Application Filing", "sla_working_days": 5, "wait_for_govt": false},
    {"stage_key": "inspection", "stage_name": "Inspection", "sla_working_days": 20, "wait_for_govt": true},
    {"stage_key": "license_delivery", "stage_name": "License Delivery", "sla_working_days": 17, "wait_for_govt": true}]'::jsonb,
  true, NULL, NULL, false
),
(
  'PCB Consent to Operate', 'pcb-consent',
  'Pollution Control Board consent for manufacturing',
  'one_time', 'one_time',
  2999900, 0, 18,
  60, 50,
  ARRAY['regulated_industry'],
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 5, "wait_for_govt": false},
    {"stage_key": "application_filing", "stage_name": "Application Filing", "sla_working_days": 5, "wait_for_govt": false},
    {"stage_key": "inspection", "stage_name": "PCB Inspection", "sla_working_days": 30, "wait_for_govt": true},
    {"stage_key": "consent_delivery", "stage_name": "Consent Delivery", "sla_working_days": 20, "wait_for_govt": true}]'::jsonb,
  true, NULL, NULL, false
),
(
  'PESO License', 'peso-license',
  'Petroleum and Explosives Safety Organisation license',
  'one_time', 'one_time',
  3499900, 0, 18,
  60, 50,
  ARRAY['regulated_industry'],
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 5, "wait_for_govt": false},
    {"stage_key": "application_filing", "stage_name": "Application Filing", "sla_working_days": 5, "wait_for_govt": false},
    {"stage_key": "inspection", "stage_name": "PESO Inspection", "sla_working_days": 35, "wait_for_govt": true},
    {"stage_key": "license_delivery", "stage_name": "License Delivery", "sla_working_days": 15, "wait_for_govt": true}]'::jsonb,
  false, NULL, NULL, false
),
(
  'Trade License', 'trade-license',
  'Municipal trade license for your business',
  'one_time', 'one_time',
  499900, 0, 18,
  14, 50,
  ARRAY['just_starting_out'],
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 2, "wait_for_govt": false},
    {"stage_key": "application_filing", "stage_name": "Application Filing", "sla_working_days": 3, "wait_for_govt": false},
    {"stage_key": "license_delivery", "stage_name": "License Delivery", "sla_working_days": 9, "wait_for_govt": true}]'::jsonb,
  true, NULL, NULL, false
),

-- =====================
-- 6. RECURRING COMPLIANCE - GST MONTHLY (Tiered)
-- =====================
(
  'GST Monthly Filing - Up to Rs 50L', 'gst-monthly-50l',
  'Monthly GST return filing for businesses up to Rs 50L turnover',
  'recurring', 'monthly',
  299900, 0, 18,
  3, 88,
  ARRAY['taking_payments', 'filing_taxes'],
  '[{"stage_key": "data_collection", "stage_name": "Data Collection", "sla_working_days": 1, "wait_for_govt": false},
    {"stage_key": "return_preparation", "stage_name": "Return Preparation", "sla_working_days": 1, "wait_for_govt": false},
    {"stage_key": "filing", "stage_name": "Filing", "sla_working_days": 1, "wait_for_govt": false}]'::jsonb,
  false, '00000000-0000-0000-0001-000000000001', 'Up to Rs 50L/year', true
),
(
  'GST Monthly Filing - Rs 50L to 5Cr', 'gst-monthly-5cr',
  'Monthly GST return filing for businesses Rs 50L - 5Cr turnover',
  'recurring', 'monthly',
  499900, 0, 18,
  3, 88,
  ARRAY['taking_payments', 'filing_taxes'],
  '[{"stage_key": "data_collection", "stage_name": "Data Collection", "sla_working_days": 1, "wait_for_govt": false},
    {"stage_key": "return_preparation", "stage_name": "Return Preparation", "sla_working_days": 1, "wait_for_govt": false},
    {"stage_key": "filing", "stage_name": "Filing", "sla_working_days": 1, "wait_for_govt": false}]'::jsonb,
  false, '00000000-0000-0000-0001-000000000001', 'Rs 50L - 5Cr/year', false
),
(
  'GST Monthly Filing - Rs 5Cr+', 'gst-monthly-5cr-plus',
  'Monthly GST return filing for businesses above Rs 5Cr turnover',
  'recurring', 'monthly',
  799900, 0, 18,
  3, 88,
  ARRAY['taking_payments', 'filing_taxes'],
  '[{"stage_key": "data_collection", "stage_name": "Data Collection", "sla_working_days": 1, "wait_for_govt": false},
    {"stage_key": "return_preparation", "stage_name": "Return Preparation", "sla_working_days": 1, "wait_for_govt": false},
    {"stage_key": "filing", "stage_name": "Filing", "sla_working_days": 1, "wait_for_govt": false}]'::jsonb,
  false, '00000000-0000-0000-0001-000000000001', 'Rs 5Cr+/year', false
),
(
  'TDS Monthly Compliance', 'tds-monthly',
  'Monthly TDS deduction and deposit compliance',
  'recurring', 'monthly',
  399900, 0, 18,
  5, 78,
  ARRAY['need_to_hire', 'filing_taxes'],
  '[{"stage_key": "data_collection", "stage_name": "Data Collection", "sla_working_days": 1, "wait_for_govt": false},
    {"stage_key": "tds_calculation", "stage_name": "TDS Calculation", "sla_working_days": 2, "wait_for_govt": false},
    {"stage_key": "challan_payment", "stage_name": "Challan Payment", "sla_working_days": 1, "wait_for_govt": false},
    {"stage_key": "filing", "stage_name": "Filing", "sla_working_days": 1, "wait_for_govt": false}]'::jsonb,
  false, NULL, NULL, false
),

-- =====================
-- 7. RECURRING COMPLIANCE - PAYROLL (Tiered)
-- =====================
(
  'Payroll Management - Up to 10 Employees', 'payroll-10',
  'Complete payroll processing and compliance for up to 10 employees',
  'recurring', 'monthly',
  599900, 0, 18,
  5, 68,
  ARRAY['need_to_hire'],
  '[{"stage_key": "data_collection", "stage_name": "Data Collection", "sla_working_days": 1, "wait_for_govt": false},
    {"stage_key": "payroll_processing", "stage_name": "Payroll Processing", "sla_working_days": 2, "wait_for_govt": false},
    {"stage_key": "statutory_filings", "stage_name": "Statutory Filings", "sla_working_days": 2, "wait_for_govt": false}]'::jsonb,
  false, '00000000-0000-0000-0001-000000000002', 'Up to 10 employees', false
),
(
  'Payroll Management - 11 to 25 Employees', 'payroll-25',
  'Complete payroll processing and compliance for 11-25 employees',
  'recurring', 'monthly',
  999900, 0, 18,
  5, 68,
  ARRAY['need_to_hire'],
  '[{"stage_key": "data_collection", "stage_name": "Data Collection", "sla_working_days": 1, "wait_for_govt": false},
    {"stage_key": "payroll_processing", "stage_name": "Payroll Processing", "sla_working_days": 2, "wait_for_govt": false},
    {"stage_key": "statutory_filings", "stage_name": "Statutory Filings", "sla_working_days": 2, "wait_for_govt": false}]'::jsonb,
  false, '00000000-0000-0000-0001-000000000002', '11-25 employees', false
),
(
  'Payroll Management - 26 to 50 Employees', 'payroll-50',
  'Complete payroll processing and compliance for 26-50 employees',
  'recurring', 'monthly',
  1399900, 0, 18,
  5, 68,
  ARRAY['need_to_hire'],
  '[{"stage_key": "data_collection", "stage_name": "Data Collection", "sla_working_days": 1, "wait_for_govt": false},
    {"stage_key": "payroll_processing", "stage_name": "Payroll Processing", "sla_working_days": 2, "wait_for_govt": false},
    {"stage_key": "statutory_filings", "stage_name": "Statutory Filings", "sla_working_days": 2, "wait_for_govt": false}]'::jsonb,
  false, '00000000-0000-0000-0001-000000000002', '26-50 employees', false
),
(
  'PF/ESIC Monthly Filing', 'pf-esic-monthly',
  'Monthly PF and ESIC return filing and compliance',
  'recurring', 'monthly',
  399900, 0, 18,
  5, 50,
  ARRAY['need_to_hire'],
  '[{"stage_key": "data_collection", "stage_name": "Data Collection", "sla_working_days": 1, "wait_for_govt": false},
    {"stage_key": "calculation", "stage_name": "PF/ESIC Calculation", "sla_working_days": 2, "wait_for_govt": false},
    {"stage_key": "filing", "stage_name": "Filing", "sla_working_days": 2, "wait_for_govt": false}]'::jsonb,
  false, NULL, NULL, false
),

-- =====================
-- 8. ANNUAL/PERIODIC COMPLIANCE (One-time billed)
-- =====================
(
  'Business ITR Filing', 'business-itr',
  'Annual income tax return filing for businesses',
  'one_time', 'annual',
  1199900, 0, 18,
  14, 75,
  ARRAY['filing_taxes'],
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 3, "wait_for_govt": false},
    {"stage_key": "computation", "stage_name": "Tax Computation", "sla_working_days": 5, "wait_for_govt": false},
    {"stage_key": "review", "stage_name": "Review", "sla_working_days": 2, "wait_for_govt": false},
    {"stage_key": "filing", "stage_name": "Filing", "sla_working_days": 2, "wait_for_govt": false},
    {"stage_key": "acknowledgment", "stage_name": "Acknowledgment", "sla_working_days": 2, "wait_for_govt": true}]'::jsonb,
  false, NULL, NULL, true
),
(
  'GST Annual Return (GSTR-9)', 'gst-annual-return',
  'Annual GST return filing (GSTR-9)',
  'one_time', 'annual',
  899900, 0, 18,
  14, 50,
  ARRAY['filing_taxes'],
  '[{"stage_key": "data_collection", "stage_name": "Data Collection", "sla_working_days": 3, "wait_for_govt": false},
    {"stage_key": "reconciliation", "stage_name": "Reconciliation", "sla_working_days": 5, "wait_for_govt": false},
    {"stage_key": "filing", "stage_name": "Filing", "sla_working_days": 4, "wait_for_govt": false},
    {"stage_key": "acknowledgment", "stage_name": "Acknowledgment", "sla_working_days": 2, "wait_for_govt": true}]'::jsonb,
  false, NULL, NULL, false
),
(
  'TDS Quarterly Return', 'tds-quarterly',
  'Quarterly TDS return filing',
  'one_time', 'quarterly',
  499900, 0, 18,
  7, 50,
  ARRAY['need_to_hire', 'filing_taxes'],
  '[{"stage_key": "data_collection", "stage_name": "Data Collection", "sla_working_days": 2, "wait_for_govt": false},
    {"stage_key": "return_preparation", "stage_name": "Return Preparation", "sla_working_days": 3, "wait_for_govt": false},
    {"stage_key": "filing", "stage_name": "Filing", "sla_working_days": 1, "wait_for_govt": false},
    {"stage_key": "form_16", "stage_name": "Form 16 Generation", "sla_working_days": 1, "wait_for_govt": false}]'::jsonb,
  false, NULL, NULL, false
),
(
  'MCA Annual Filing Bundle', 'mca-annual-filing',
  'Complete MCA annual compliance (AOC-4, MGT-7, ADT-1)',
  'one_time', 'annual',
  1499900, 0, 18,
  21, 50,
  ARRAY['have_investors', 'scaling_up'],
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 3, "wait_for_govt": false},
    {"stage_key": "financial_statements", "stage_name": "Financial Statement Prep", "sla_working_days": 7, "wait_for_govt": false},
    {"stage_key": "aoc4_filing", "stage_name": "AOC-4 Filing", "sla_working_days": 3, "wait_for_govt": false},
    {"stage_key": "mgt7_filing", "stage_name": "MGT-7 Filing", "sla_working_days": 3, "wait_for_govt": false},
    {"stage_key": "acknowledgment", "stage_name": "Acknowledgment", "sla_working_days": 5, "wait_for_govt": true}]'::jsonb,
  false, NULL, NULL, false
),
(
  'Director KYC (DIR-3 KYC)', 'director-kyc',
  'Annual director KYC filing',
  'one_time', 'annual',
  399900, 0, 18,
  5, 50,
  ARRAY['have_investors', 'scaling_up'],
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 1, "wait_for_govt": false},
    {"stage_key": "filing", "stage_name": "Filing", "sla_working_days": 2, "wait_for_govt": false},
    {"stage_key": "acknowledgment", "stage_name": "Acknowledgment", "sla_working_days": 2, "wait_for_govt": true}]'::jsonb,
  false, NULL, NULL, false
),
(
  'Advance Tax Computation', 'advance-tax',
  'Quarterly advance tax calculation and payment',
  'one_time', 'quarterly',
  399900, 0, 18,
  5, 50,
  ARRAY['filing_taxes'],
  '[{"stage_key": "income_projection", "stage_name": "Income Projection", "sla_working_days": 2, "wait_for_govt": false},
    {"stage_key": "tax_computation", "stage_name": "Tax Computation", "sla_working_days": 2, "wait_for_govt": false},
    {"stage_key": "challan_generation", "stage_name": "Challan Generation", "sla_working_days": 1, "wait_for_govt": false}]'::jsonb,
  false, NULL, NULL, false
),
(
  'ROC Compliance Bundle', 'roc-compliance-bundle',
  'Complete ROC annual compliance package',
  'one_time', 'annual',
  2999900, 0, 18,
  30, 50,
  ARRAY['have_investors', 'scaling_up'],
  '[{"stage_key": "document_collection", "stage_name": "Document Collection", "sla_working_days": 5, "wait_for_govt": false},
    {"stage_key": "board_resolutions", "stage_name": "Board Resolutions", "sla_working_days": 5, "wait_for_govt": false},
    {"stage_key": "filings", "stage_name": "ROC Filings", "sla_working_days": 10, "wait_for_govt": false},
    {"stage_key": "acknowledgment", "stage_name": "Acknowledgment", "sla_working_days": 10, "wait_for_govt": true}]'::jsonb,
  false, NULL, NULL, false
),
(
  'Statutory Audit', 'statutory-audit',
  'Annual statutory audit for companies',
  'one_time', 'annual',
  3499900, 0, 18,
  45, 50,
  ARRAY['have_investors', 'scaling_up'],
  '[{"stage_key": "planning", "stage_name": "Audit Planning", "sla_working_days": 5, "wait_for_govt": false},
    {"stage_key": "fieldwork", "stage_name": "Audit Fieldwork", "sla_working_days": 20, "wait_for_govt": false},
    {"stage_key": "review", "stage_name": "Review", "sla_working_days": 10, "wait_for_govt": false},
    {"stage_key": "report", "stage_name": "Audit Report", "sla_working_days": 10, "wait_for_govt": false}]'::jsonb,
  false, NULL, NULL, false
)

ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  order_type = EXCLUDED.order_type,
  billing_cycle = EXCLUDED.billing_cycle,
  price_base_paisa = EXCLUDED.price_base_paisa,
  price_govt_fees_paisa = EXCLUDED.price_govt_fees_paisa,
  price_gst_rate = EXCLUDED.price_gst_rate,
  sla_working_days = EXCLUDED.sla_working_days,
  urgency_score = EXCLUDED.urgency_score,
  situation_tags = EXCLUDED.situation_tags,
  workflow_stages = EXCLUDED.workflow_stages,
  price_varies_by_state = EXCLUDED.price_varies_by_state,
  tier_group_id = EXCLUDED.tier_group_id,
  tier_label = EXCLUDED.tier_label,
  is_active = EXCLUDED.is_active,
  updated_at = now();
