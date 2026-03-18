-- =============================================================================
-- Migration: Seed Document Templates for All Services
-- Per-service document requirements with tips and templates
-- =============================================================================

-- Clear existing templates (for re-run safety)
TRUNCATE service_document_templates CASCADE;

-- =============================================================================
-- Private Limited Incorporation
-- =============================================================================

INSERT INTO service_document_templates (service_package_id, document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
SELECT
  sp.id,
  dt.document_key,
  dt.document_label,
  dt.description,
  dt.stage_key,
  dt.is_required,
  dt.display_order,
  dt.tips,
  dt.template_url
FROM service_packages sp
CROSS JOIN (VALUES
  ('pan_card_d1', 'PAN Card (Director 1)', 'Clear, legible copy of PAN card', 'doc_collection', true, 1, ARRAY['Ensure all 4 corners are visible', 'Photo should be clearly visible'], NULL),
  ('aadhaar_d1', 'Aadhaar Card (Director 1)', 'Front and back of Aadhaar card', 'doc_collection', true, 2, ARRAY['Must be OTP-linked for signing', 'Address should match application'], NULL),
  ('passport_photo_d1', 'Passport Photo (Director 1)', 'Recent passport size photograph', 'doc_collection', true, 3, ARRAY['White background preferred', 'Clear face, no glasses'], NULL),
  ('specimen_signature_d1', 'Specimen Signature (Director 1)', 'Signature on white paper', 'doc_collection', true, 4, ARRAY['Use blue ink only', 'Sign on plain white paper'], NULL),
  ('address_proof_d1', 'Address Proof (Director 1)', 'Bank statement or utility bill (last 2 months)', 'doc_collection', true, 5, ARRAY['Must be dated within 60 days', 'Name should match ID proof'], NULL),
  ('pan_card_d2', 'PAN Card (Director 2)', 'Clear, legible copy of PAN card', 'doc_collection', false, 6, ARRAY['Ensure all 4 corners are visible', 'Photo should be clearly visible'], NULL),
  ('aadhaar_d2', 'Aadhaar Card (Director 2)', 'Front and back of Aadhaar card', 'doc_collection', false, 7, ARRAY['Must be OTP-linked for signing', 'Address should match application'], NULL),
  ('passport_photo_d2', 'Passport Photo (Director 2)', 'Recent passport size photograph', 'doc_collection', false, 8, ARRAY['White background preferred', 'Clear face, no glasses'], NULL),
  ('specimen_signature_d2', 'Specimen Signature (Director 2)', 'Signature on white paper', 'doc_collection', false, 9, ARRAY['Use blue ink only', 'Sign on plain white paper'], NULL),
  ('address_proof_d2', 'Address Proof (Director 2)', 'Bank statement or utility bill (last 2 months)', 'doc_collection', false, 10, ARRAY['Must be dated within 60 days', 'Name should match ID proof'], NULL),
  ('utility_bill', 'Utility Bill (Registered Office)', 'Electricity/gas bill for office address', 'doc_collection', true, 11, ARRAY['Must be less than 60 days old', 'Commercial or residential address'], NULL),
  ('rent_agreement', 'Rent Agreement', 'If office is rented (registered or notarized)', 'doc_collection', false, 12, ARRAY['Should be currently valid', 'Landlord details clearly visible'], NULL),
  ('noc_owner', 'NOC from Owner', 'No Objection Certificate from property owner', 'doc_collection', true, 13, ARRAY['Must be on letterhead or stamp paper', 'Owner signature and date required'], 'https://templates.ollvy.in/noc-template.pdf'),
  ('dsc_auth', 'DSC Authorization Letter', 'Authorizing Ollvy to procure DSC', 'dsc_procurement', true, 14, ARRAY['Sign with same signature as specimen', 'Date should be current'], 'https://templates.ollvy.in/dsc-authorization.pdf')
) AS dt(document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
WHERE sp.slug = 'pvt-ltd-incorporation';

-- =============================================================================
-- GST Registration
-- =============================================================================

INSERT INTO service_document_templates (service_package_id, document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
SELECT
  sp.id,
  dt.document_key,
  dt.document_label,
  dt.description,
  dt.stage_key,
  dt.is_required,
  dt.display_order,
  dt.tips,
  dt.template_url
FROM service_packages sp
CROSS JOIN (VALUES
  ('pan_card', 'PAN Card', 'Business PAN or Proprietor PAN', 'doc_collection', true, 1, ARRAY['For proprietorship, use personal PAN', 'For company/LLP, use business PAN'], NULL),
  ('aadhaar', 'Aadhaar Card', 'Authorized signatory Aadhaar', 'doc_collection', true, 2, ARRAY['Must be linked for OTP authentication', 'Mobile number should be active'], NULL),
  ('photograph', 'Passport Photograph', 'Recent photograph of authorized signatory', 'doc_collection', true, 3, ARRAY['White or light background', 'JPEG format preferred'], NULL),
  ('address_proof', 'Address Proof', 'Current residential address proof', 'doc_collection', true, 4, ARRAY['Utility bill, bank statement, or rent agreement', 'Must be less than 60 days old'], NULL),
  ('bank_statement', 'Bank Statement (First Page)', 'Bank account showing name and account number', 'doc_collection', true, 5, ARRAY['First page with account details', 'Should show business name or proprietor name'], NULL),
  ('constitution_doc', 'Constitution Document', 'COI for company, Partnership deed for firm', 'doc_collection', true, 6, ARRAY['For proprietorship - not required', 'For LLP - LLP Agreement'], NULL),
  ('utility_bill', 'Utility Bill (Business Premises)', 'Electricity/gas bill for business location', 'doc_collection', true, 7, ARRAY['Must be less than 60 days old', 'Address should match application'], NULL),
  ('rent_agreement', 'Rent Agreement', 'If premises is rented', 'doc_collection', false, 8, ARRAY['With NOC from landlord', 'Should be currently valid'], NULL)
) AS dt(document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
WHERE sp.slug = 'gst-registration';

-- =============================================================================
-- GST Monthly Filing (Retainer)
-- =============================================================================

INSERT INTO service_document_templates (service_package_id, document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
SELECT
  sp.id,
  dt.document_key,
  dt.document_label,
  dt.description,
  dt.stage_key,
  dt.is_required,
  dt.display_order,
  dt.tips,
  dt.template_url
FROM service_packages sp
CROSS JOIN (VALUES
  ('sales_invoices', 'Sales Invoices', 'All B2B and B2C invoices for the month', 'monthly_filing', true, 1, ARRAY['Excel/CSV format preferred', 'Include invoice number, date, amount, GST'], NULL),
  ('purchase_invoices', 'Purchase Invoices', 'All purchase invoices for ITC claim', 'monthly_filing', true, 2, ARRAY['Ensure GSTIN of supplier is correct', 'Match with GSTR-2A for ITC'], NULL),
  ('bank_statement', 'Bank Statement', 'For reconciliation if needed', 'monthly_filing', false, 3, ARRAY['May be requested for certain transactions', 'PDF or Excel format'], NULL),
  ('gst_portal_access', 'GST Portal Credentials', 'Login details or OTP access', 'onboarding', true, 4, ARRAY['Username and password', 'Or authorize via OTP each filing'], NULL)
) AS dt(document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
WHERE sp.slug = 'gst-monthly-filing';

-- =============================================================================
-- Business ITR Filing
-- =============================================================================

INSERT INTO service_document_templates (service_package_id, document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
SELECT
  sp.id,
  dt.document_key,
  dt.document_label,
  dt.description,
  dt.stage_key,
  dt.is_required,
  dt.display_order,
  dt.tips,
  dt.template_url
FROM service_packages sp
CROSS JOIN (VALUES
  ('financial_statements', 'Financial Statements', 'Profit & Loss statement and Balance Sheet', 'doc_collection', true, 1, ARRAY['For the relevant financial year', 'Audited if turnover exceeds threshold'], NULL),
  ('bank_statements', 'Bank Statements (Full Year)', 'All bank accounts for the financial year', 'doc_collection', true, 2, ARRAY['April to March statements', 'Include all business accounts'], NULL),
  ('depreciation_schedule', 'Depreciation Schedule', 'Fixed asset depreciation details', 'doc_collection', false, 3, ARRAY['If you have fixed assets', 'Include asset date, cost, rate'], NULL),
  ('form_16a_tds', 'Form 16A (TDS Certificates)', 'TDS deducted by clients', 'doc_collection', false, 4, ARRAY['Download from TRACES portal', 'For all TDS deductions'], NULL),
  ('previous_itr', 'Previous ITR Acknowledgment', 'Last filed ITR acknowledgment', 'doc_collection', true, 5, ARRAY['Shows previous year details', 'Needed for loss carry forward'], NULL),
  ('gst_returns', 'GST Returns Summary', 'GSTR-3B and GSTR-1 for the year', 'doc_collection', false, 6, ARRAY['Annual summary preferred', 'For GST-registered businesses'], NULL),
  ('capital_gains_proof', 'Capital Gains Documents', 'If any asset sales during year', 'doc_collection', false, 7, ARRAY['Property sale deeds', 'Stock transaction statements'], NULL),
  ('loan_statements', 'Loan Interest Statements', 'For business loans', 'doc_collection', false, 8, ARRAY['Shows interest paid', 'For interest deduction'], NULL)
) AS dt(document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
WHERE sp.slug = 'business-itr-filing';

-- =============================================================================
-- Trademark Registration
-- =============================================================================

INSERT INTO service_document_templates (service_package_id, document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
SELECT
  sp.id,
  dt.document_key,
  dt.document_label,
  dt.description,
  dt.stage_key,
  dt.is_required,
  dt.display_order,
  dt.tips,
  dt.template_url
FROM service_packages sp
CROSS JOIN (VALUES
  ('trademark_logo', 'Trademark Logo/Wordmark', 'The mark you want to register', 'doc_collection', true, 1, ARRAY['High resolution PNG/JPEG', 'Min 500x500 pixels, max 3000x3000'], NULL),
  ('pan_card', 'PAN Card', 'Business or individual PAN', 'doc_collection', true, 2, ARRAY['Clear, legible copy', 'For individual or business applicant'], NULL),
  ('address_proof', 'Address Proof', 'Current address of applicant', 'doc_collection', true, 3, ARRAY['Utility bill or bank statement', 'Business address for companies'], NULL),
  ('incorporation_cert', 'Incorporation Certificate', 'If company or LLP', 'doc_collection', false, 4, ARRAY['COI for private limited', 'LLP Agreement for LLP'], NULL),
  ('signed_tm_form', 'Signed TM-A Form', 'Authorization form', 'filing', true, 5, ARRAY['Will be provided for signature', 'Sign and return scan'], 'https://templates.ollvy.in/tm-authorization.pdf'),
  ('udyam_msme', 'UDYAM/MSME Certificate', 'For 50% govt fee discount', 'doc_collection', false, 6, ARRAY['Valid UDYAM registration', 'Significant cost savings'], NULL)
) AS dt(document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
WHERE sp.slug = 'trademark-registration';

-- =============================================================================
-- LLP Incorporation
-- =============================================================================

INSERT INTO service_document_templates (service_package_id, document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
SELECT
  sp.id,
  dt.document_key,
  dt.document_label,
  dt.description,
  dt.stage_key,
  dt.is_required,
  dt.display_order,
  dt.tips,
  dt.template_url
FROM service_packages sp
CROSS JOIN (VALUES
  ('pan_card_p1', 'PAN Card (Partner 1)', 'Clear, legible copy of PAN card', 'doc_collection', true, 1, ARRAY['Ensure all 4 corners are visible', 'Photo should be clearly visible'], NULL),
  ('aadhaar_p1', 'Aadhaar Card (Partner 1)', 'Front and back of Aadhaar card', 'doc_collection', true, 2, ARRAY['Must be OTP-linked for signing', 'Address should match application'], NULL),
  ('passport_photo_p1', 'Passport Photo (Partner 1)', 'Recent passport size photograph', 'doc_collection', true, 3, ARRAY['White background preferred', 'Clear face, no glasses'], NULL),
  ('address_proof_p1', 'Address Proof (Partner 1)', 'Bank statement or utility bill (last 2 months)', 'doc_collection', true, 4, ARRAY['Must be dated within 60 days', 'Name should match ID proof'], NULL),
  ('pan_card_p2', 'PAN Card (Partner 2)', 'Clear, legible copy of PAN card', 'doc_collection', true, 5, ARRAY['Ensure all 4 corners are visible', 'Photo should be clearly visible'], NULL),
  ('aadhaar_p2', 'Aadhaar Card (Partner 2)', 'Front and back of Aadhaar card', 'doc_collection', true, 6, ARRAY['Must be OTP-linked for signing', 'Address should match application'], NULL),
  ('passport_photo_p2', 'Passport Photo (Partner 2)', 'Recent passport size photograph', 'doc_collection', true, 7, ARRAY['White background preferred', 'Clear face, no glasses'], NULL),
  ('address_proof_p2', 'Address Proof (Partner 2)', 'Bank statement or utility bill (last 2 months)', 'doc_collection', true, 8, ARRAY['Must be dated within 60 days', 'Name should match ID proof'], NULL),
  ('utility_bill', 'Utility Bill (Registered Office)', 'Electricity/gas bill for office address', 'doc_collection', true, 9, ARRAY['Must be less than 60 days old', 'Commercial or residential address'], NULL),
  ('rent_agreement', 'Rent Agreement', 'If office is rented (registered or notarized)', 'doc_collection', false, 10, ARRAY['Should be currently valid', 'Landlord details clearly visible'], NULL),
  ('noc_owner', 'NOC from Owner', 'No Objection Certificate from property owner', 'doc_collection', true, 11, ARRAY['Must be on letterhead or stamp paper', 'Owner signature and date required'], 'https://templates.ollvy.in/noc-template.pdf'),
  ('dpin_form', 'DPIN Application Form', 'For Designated Partner Identification Number', 'dpin_application', true, 12, ARRAY['Will be provided for signature', 'Required before incorporation'], 'https://templates.ollvy.in/dpin-application.pdf')
) AS dt(document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
WHERE sp.slug = 'llp-incorporation';

-- =============================================================================
-- Cloud Kitchen Setup (Bundle)
-- =============================================================================

INSERT INTO service_document_templates (service_package_id, document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
SELECT
  sp.id,
  dt.document_key,
  dt.document_label,
  dt.description,
  dt.stage_key,
  dt.is_required,
  dt.display_order,
  dt.tips,
  dt.template_url
FROM service_packages sp
CROSS JOIN (VALUES
  ('pan_card', 'PAN Card', 'Business PAN or Proprietor PAN', 'doc_collection', true, 1, ARRAY['For proprietorship, use personal PAN', 'For company/LLP, use business PAN'], NULL),
  ('aadhaar', 'Aadhaar Card', 'Authorized signatory Aadhaar', 'doc_collection', true, 2, ARRAY['Must be linked for OTP authentication', 'Mobile number should be active'], NULL),
  ('photograph', 'Passport Photograph', 'Recent photograph of authorized signatory', 'doc_collection', true, 3, ARRAY['White or light background', 'JPEG format preferred'], NULL),
  ('constitution_doc', 'Constitution Document', 'COI/Partnership Deed/MSME certificate', 'doc_collection', true, 4, ARRAY['Based on your business structure', 'MSME helps with fee discounts'], NULL),
  ('kitchen_address_proof', 'Kitchen Address Proof', 'Rent agreement or ownership proof', 'doc_collection', true, 5, ARRAY['Must show complete address', 'Should be registered if possible'], NULL),
  ('utility_bill', 'Utility Bill (Kitchen)', 'Electricity bill for kitchen premises', 'doc_collection', true, 6, ARRAY['Must be less than 60 days old', 'Commercial connection preferred'], NULL),
  ('noc_landlord', 'NOC from Landlord', 'Permission to run food business', 'doc_collection', true, 7, ARRAY['Specifically mentions food business', 'Landlord signature required'], 'https://templates.ollvy.in/kitchen-noc.pdf'),
  ('kitchen_layout', 'Kitchen Layout Plan', 'Floor plan showing kitchen setup', 'doc_collection', true, 8, ARRAY['Show equipment placement', 'Include dimensions'], NULL),
  ('water_test_report', 'Water Test Report', 'Potable water quality certificate', 'doc_collection', true, 9, ARRAY['From govt-approved lab', 'Valid for 6 months'], NULL),
  ('food_handlers_medical', 'Food Handlers Medical Certificate', 'Health certificates for all staff', 'doc_collection', true, 10, ARRAY['From registered medical practitioner', 'Required for all food handlers'], NULL),
  ('bank_statement', 'Bank Statement (First Page)', 'Business account details', 'doc_collection', true, 11, ARRAY['Shows account number and name', 'For GST registration'], NULL),
  ('menu_list', 'Menu/Food Items List', 'Complete list of food items', 'doc_collection', true, 12, ARRAY['Category-wise list', 'Include all items you plan to sell'], NULL)
) AS dt(document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
WHERE sp.slug = 'cloud-kitchen-setup';

-- =============================================================================
-- Also add to some other common services if they exist
-- =============================================================================

-- FSSAI License (if exists as standalone service)
INSERT INTO service_document_templates (service_package_id, document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
SELECT
  sp.id,
  dt.document_key,
  dt.document_label,
  dt.description,
  dt.stage_key,
  dt.is_required,
  dt.display_order,
  dt.tips,
  dt.template_url
FROM service_packages sp
CROSS JOIN (VALUES
  ('pan_card', 'PAN Card', 'Business or proprietor PAN', 'doc_collection', true, 1, ARRAY['Clear, legible copy'], NULL),
  ('aadhaar', 'Aadhaar Card', 'Of authorized signatory', 'doc_collection', true, 2, ARRAY['OTP-linked required'], NULL),
  ('photograph', 'Passport Photograph', 'Recent photograph', 'doc_collection', true, 3, ARRAY['White background'], NULL),
  ('constitution_doc', 'Constitution Document', 'Based on business type', 'doc_collection', true, 4, ARRAY['COI, Partnership Deed, etc.'], NULL),
  ('kitchen_layout', 'Kitchen/Food Area Layout', 'Floor plan of premises', 'doc_collection', true, 5, ARRAY['Show equipment placement'], NULL),
  ('water_test_report', 'Water Test Report', 'Potable water certificate', 'doc_collection', true, 6, ARRAY['From approved lab'], NULL),
  ('noc_landlord', 'NOC from Landlord', 'If premises is rented', 'doc_collection', false, 7, ARRAY['Permission to run food business'], NULL)
) AS dt(document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
WHERE sp.slug = 'fssai-license'
ON CONFLICT (service_package_id, document_key) DO NOTHING;
