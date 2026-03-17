-- =============================================================================
-- Migration: Clean up old test data
-- =============================================================================

-- Delete legacy test service that duplicates Business ITR Filing
DELETE FROM service_packages WHERE name = 'ITR Filing - Business';

-- Delete any other test services not in the spec
DELETE FROM service_packages WHERE name NOT IN (
  'Private Limited Incorporation',
  'LLP Registration',
  'Partnership Deed Drafting',
  'Sole Proprietorship Setup',
  'OPC (One Person Company)',
  'Startup India Registration',
  'MSME / Udyam Registration',
  'GST Registration',
  'Professional Tax Registration',
  'IEC (Import Export Code)',
  'FSSAI Basic Registration',
  'FSSAI State License',
  'FSSAI Central License',
  'Alcohol License',
  'Eating House License',
  'Trademark - Word Mark',
  'Trademark - Logo',
  'Copyright Registration',
  'Patent Filing (Provisional)',
  'Design Registration',
  'Fire NOC',
  'Shop & Establishment Registration',
  'Drug License (Retail)',
  'PCB Consent to Operate',
  'PESO License',
  'Trade License',
  'GST Monthly Filing - Up to Rs 50L',
  'GST Monthly Filing - Rs 50L to 5Cr',
  'GST Monthly Filing - Rs 5Cr+',
  'TDS Monthly Compliance',
  'Payroll Management - Up to 10 Employees',
  'Payroll Management - 11 to 25 Employees',
  'Payroll Management - 26 to 50 Employees',
  'PF/ESIC Monthly Filing',
  'Business ITR Filing',
  'GST Annual Return (GSTR-9)',
  'TDS Quarterly Return',
  'MCA Annual Filing Bundle',
  'Director KYC (DIR-3 KYC)',
  'Advance Tax Computation',
  'ROC Compliance Bundle',
  'Statutory Audit'
);
