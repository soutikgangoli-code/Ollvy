-- =============================================================================
-- Migration: Fix service_packages count to exactly 42 (as defined in spec §5)
--
-- IMPORTANT: The spec header says "32 Services" but the actual enumeration
-- in the spec lists 42 services (#1-42). This is a documentation error in the spec.
-- This migration cleans up to the actual 42 services.
--
-- This migration:
-- 1. Deletes duplicate/test rows not in the canonical 42-service list
-- 2. Uses exact names from the final seed file (20260311050000_seed_remaining_services.sql)
-- =============================================================================

-- Delete all service_packages not in the canonical 42-service list
-- Include BOTH naming variants (em-dash from first seed, hyphen from second seed)
-- to ensure we don't accidentally delete valid services
DELETE FROM service_packages WHERE name NOT IN (
  -- #1-7: Company Registration
  'Private Limited Incorporation',
  'LLP Registration',
  'Partnership Deed Drafting',
  'Sole Proprietorship Setup',
  'OPC (One Person Company)',
  'Startup India Registration',
  'MSME / Udyam Registration',

  -- #8-11: Tax & Trade Registration
  'GST Registration',
  'FSSAI Basic Registration',
  'IEC (Import Export Code)',
  'Professional Tax Registration',

  -- #12-16: IP Protection (both hyphen and em-dash variants)
  'Trademark - Word Mark', 'Trademark — Word Mark',
  'Trademark - Logo', 'Trademark — Logo',
  'Copyright Registration',
  'Patent Filing (Provisional)',
  'Design Registration',

  -- #17-26: Licenses
  'FSSAI State License',
  'FSSAI Central License',
  'Alcohol License',
  'Eating House License',
  'Fire NOC',
  'Shop & Establishment Registration',
  'Drug License (Retail)',
  'PCB Consent to Operate',
  'PESO License',
  'Trade License',

  -- #27-30: Monthly Recurring (GST + TDS) - both naming variants
  'GST Monthly Filing - Up to Rs 50L', 'GST Monthly Filing — Up to ₹50L/year',
  'GST Monthly Filing - Rs 50L to 5Cr', 'GST Monthly Filing — ₹50L-5Cr/year',
  'GST Monthly Filing - Rs 5Cr+', 'GST Monthly Filing — ₹5Cr+/year',
  'TDS Monthly Compliance',

  -- #31-34: Monthly Recurring (Payroll + PF/ESIC) - both naming variants
  'Payroll Management - Up to 10 Employees', 'Payroll Management — Up to 10 Employees',
  'Payroll Management - 11 to 25 Employees', 'Payroll Management — 11-25 Employees',
  'Payroll Management - 26 to 50 Employees', 'Payroll Management — 26-50 Employees',
  'PF/ESIC Monthly Filing',

  -- #35-42: Annual/Periodic Filing
  'Business ITR Filing',
  'GST Annual Return (GSTR-9)',
  'TDS Quarterly Return',
  'MCA Annual Filing Bundle',
  'Director KYC (DIR-3 KYC)',
  'Advance Tax Computation',
  'ROC Compliance Bundle',
  'Statutory Audit'
);

-- Clean up any test services from early migration (20260311040200_seed_services.sql)
DELETE FROM service_packages WHERE slug IN (
  'gst-registration',
  'pvt-ltd-registration',
  'trademark-registration',
  'fssai-license',
  'iec-license',
  'gst-monthly-filing',
  'payroll-management',
  'pf-esi-registration'
) AND name NOT IN (
  -- Don't delete if it's a canonical service that happens to have same slug
  'GST Registration',
  'Private Limited Incorporation',
  'Trademark - Word Mark',
  'FSSAI Basic Registration',
  'IEC (Import Export Code)'
);

-- Also remove legacy variant names
DELETE FROM service_packages WHERE name IN (
  'Private Limited Company Registration',
  'Trademark Registration',
  'FSSAI License',
  'Import Export Code (IEC)',
  'GST Monthly Filing',
  'Payroll Management',
  'PF & ESI Registration',
  'ITR Filing - Business'
);

-- NOTE: The spec says "32 Services" in the header but lists 42 services in the table.
-- This is a documentation inconsistency. The actual catalogue has 42 services.
