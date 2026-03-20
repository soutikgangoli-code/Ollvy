-- =============================================================================
-- Migration: Seed Missing Document Flows
-- Adds initial_documents and work_documents for services that were missing them
-- Covers: opc-incorporation, partnership-registration, sole-proprietorship,
-- trade-license, copyright-registration, patent-provisional, gst-return-filing,
-- mca-annual-filing, roc-changes, director-kyc, business-itr, startup-india,
-- esi-registration, pf-registration
-- =============================================================================

-- =============================================================================
-- PART 1: INITIAL DOCUMENTS (service_document_templates)
-- =============================================================================

-- =============================================================================
-- 1. OPC Incorporation Initial Documents (11 docs)
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
  ('director_pan', 'PAN Card of Director', 'PAN card of the sole director who will also be the shareholder', 'doc_collection', true, 1, ARRAY['Must be legible and valid', 'Name should match other documents'], NULL),
  ('director_aadhaar', 'Aadhaar Card of Director', 'Aadhaar card (front and back) of the sole director', 'doc_collection', true, 2, ARRAY['Address on Aadhaar used for DIN application', 'Must be linked to mobile for OTP'], NULL),
  ('director_photo', 'Passport Size Photo - Director', 'Recent passport size photograph of the director', 'doc_collection', true, 3, ARRAY['White background', 'Face clearly visible', 'JPEG format preferred'], NULL),
  ('nominee_pan', 'PAN Card of Nominee', 'PAN card of the nominee who will take over if director is unable to act', 'doc_collection', true, 4, ARRAY['Nominee must be an Indian resident', 'Cannot be existing director in same OPC'], NULL),
  ('nominee_aadhaar', 'Aadhaar Card of Nominee', 'Aadhaar card (front and back) of the nominee', 'doc_collection', true, 5, ARRAY['Required for INC-3 nominee consent form'], NULL),
  ('nominee_photo', 'Passport Size Photo - Nominee', 'Recent passport size photograph of the nominee', 'doc_collection', true, 6, ARRAY['White background', 'Face clearly visible'], NULL),
  ('address_proof', 'Registered Office Address Proof', 'Utility bill / property tax / rent agreement for registered office', 'doc_collection', true, 7, ARRAY['Not older than 2 months', 'Address must match application', 'For rented: rent agreement + utility bill'], NULL),
  ('noc_landlord', 'NOC from Landlord', 'No Objection Certificate from property owner (if rented)', 'doc_collection', false, 8, ARRAY['Required if premises is rented', 'Should permit use as registered office', 'Owner signature mandatory'], 'https://templates.ollvy.in/noc-registered-office.pdf'),
  ('director_mobile_bill', 'Mobile Bill of Director', 'Mobile bill showing number linked to Aadhaar', 'doc_collection', false, 9, ARRAY['Optional - for verification if Aadhaar mobile differs', 'Should show director name'], NULL),
  ('director_bank_statement', 'Bank Statement of Director', 'Latest 3 months bank statement of director', 'doc_collection', false, 10, ARRAY['May be required for address verification', 'Shows financial standing'], NULL),
  ('existing_din_proof', 'Existing DIN Details (if any)', 'If director already has a DIN from another company', 'doc_collection', false, 11, ARRAY['Not required for first-time directors', 'Provide DIN number if already allotted'], NULL)
) AS dt(document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
WHERE sp.slug = 'opc-incorporation'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- =============================================================================
-- 2. Partnership Firm Initial Documents (5 docs)
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
  ('partner1_pan', 'PAN Card - Partner 1', 'PAN card of first partner', 'doc_collection', true, 1, ARRAY['Clear, legible copy', 'Name should match Aadhaar'], NULL),
  ('partner1_aadhaar', 'Aadhaar Card - Partner 1', 'Aadhaar card (front and back) of first partner', 'doc_collection', true, 2, ARRAY['Both sides required', 'Current address preferred'], NULL),
  ('partner2_pan', 'PAN Card - Partner 2', 'PAN card of second partner', 'doc_collection', true, 3, ARRAY['Clear, legible copy', 'Name should match Aadhaar'], NULL),
  ('partner2_aadhaar', 'Aadhaar Card - Partner 2', 'Aadhaar card (front and back) of second partner', 'doc_collection', true, 4, ARRAY['Both sides required', 'Current address preferred'], NULL),
  ('address_proof', 'Business Address Proof', 'Utility bill or rent agreement for business premises', 'doc_collection', true, 5, ARRAY['Not older than 60 days', 'Address where firm will operate'], NULL)
) AS dt(document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
WHERE sp.slug = 'partnership-registration'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- =============================================================================
-- 3. Sole Proprietorship Initial Documents (5 docs)
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
  ('proprietor_pan', 'PAN Card of Proprietor', 'PAN card of the sole proprietor', 'doc_collection', true, 1, ARRAY['This becomes the business PAN', 'Clear, legible copy'], NULL),
  ('proprietor_aadhaar', 'Aadhaar Card of Proprietor', 'Aadhaar card (front and back) of proprietor', 'doc_collection', true, 2, ARRAY['Both sides required', 'Linked to mobile for OTP'], NULL),
  ('proprietor_photo', 'Passport Size Photo', 'Recent passport size photograph', 'doc_collection', true, 3, ARRAY['White background', 'Face clearly visible'], NULL),
  ('address_proof', 'Business Address Proof', 'Utility bill / rent agreement for business premises', 'doc_collection', true, 4, ARRAY['Not older than 60 days', 'Can be residential if home-based'], NULL),
  ('bank_proof', 'Bank Account Proof', 'Cancelled cheque or passbook first page', 'doc_collection', true, 5, ARRAY['Account in proprietor name or trade name', 'IFSC clearly visible'], NULL)
) AS dt(document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
WHERE sp.slug = 'sole-proprietorship'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- =============================================================================
-- 4. Trade License Initial Documents (7 docs)
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
  ('owner_pan', 'PAN Card of Owner/Applicant', 'PAN card of the business owner or authorized person', 'doc_collection', true, 1, ARRAY['For company: authorized signatory PAN', 'For proprietor: personal PAN'], NULL),
  ('owner_aadhaar', 'Aadhaar Card of Owner', 'Aadhaar of the owner or authorized person', 'doc_collection', true, 2, ARRAY['Required for verification'], NULL),
  ('entity_proof', 'Business Registration Proof', 'COI / Partnership Deed / GST Certificate / Shop Act', 'doc_collection', true, 3, ARRAY['Any proof of business registration'], NULL),
  ('address_proof', 'Premises Address Proof', 'Electricity bill / property tax / rent agreement', 'doc_collection', true, 4, ARRAY['Not older than 60 days', 'Address should match application'], NULL),
  ('noc_landlord', 'NOC from Landlord', 'No Objection Certificate from property owner', 'doc_collection', false, 5, ARRAY['Required if premises is rented', 'Must permit commercial use'], 'https://templates.ollvy.in/noc-trade-license.pdf'),
  ('premise_photos', 'Photographs of Premises', 'Photos showing shop front, signage, and interior', 'doc_collection', true, 6, ARRAY['Show name board clearly', '3-4 photos recommended', 'Interior showing business activity'], NULL),
  ('fire_noc', 'Fire NOC (if applicable)', 'Fire department NOC for certain business types', 'doc_collection', false, 7, ARRAY['Required for restaurants, hotels, warehouses', 'Check with local authority'], NULL)
) AS dt(document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
WHERE sp.slug = 'trade-license'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- =============================================================================
-- 5. Copyright Registration Initial Documents (5 docs)
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
  ('work_copy', 'Copy of the Work', 'Complete copy of the work being registered', 'doc_collection', true, 1, ARRAY['Literary: Full PDF', 'Artistic: High-res images', 'Software: First and last 10 pages of source code'], NULL),
  ('applicant_id', 'ID Proof of Applicant', 'Aadhaar / PAN / Passport of the applicant', 'doc_collection', true, 2, ARRAY['Any government issued ID', 'Name must match application'], NULL),
  ('applicant_address', 'Address Proof of Applicant', 'Utility bill / bank statement / Aadhaar', 'doc_collection', true, 3, ARRAY['Not older than 60 days', 'Current address of applicant'], NULL),
  ('author_noc', 'NOC from Author', 'If applicant is not the author, NOC from author required', 'doc_collection', false, 4, ARRAY['Required if applicant is not creator', 'Author authorizing registration'], 'https://templates.ollvy.in/author-noc.pdf'),
  ('assignment_deed', 'Assignment Deed', 'If rights were assigned, deed of assignment', 'doc_collection', false, 5, ARRAY['Required if filing as assignee', 'Shows transfer of rights from author'], NULL)
) AS dt(document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
WHERE sp.slug = 'copyright-registration'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- =============================================================================
-- 6. Patent Filing Initial Documents (6 docs)
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
  ('invention_description', 'Invention Description', 'Detailed description of the invention with drawings', 'doc_collection', true, 1, ARRAY['Include technical details', 'Add drawings if applicable', 'Describe novelty and utility'], NULL),
  ('applicant_id', 'ID Proof of Applicant', 'Aadhaar / PAN / Passport of applicant', 'doc_collection', true, 2, ARRAY['Any government issued ID', 'For company: COI and board resolution'], NULL),
  ('inventor_details', 'Inventor Declaration', 'Declaration form with inventor details', 'doc_collection', true, 3, ARRAY['Name, address, nationality of each inventor', 'Must match application'], NULL),
  ('prior_art_search', 'Prior Art Search Results', 'Any prior art search you have conducted', 'doc_collection', false, 4, ARRAY['Helps strengthen application', 'Shows awareness of existing patents'], NULL),
  ('assignment_deed', 'Assignment Deed', 'If applicant is not inventor, assignment from inventor', 'doc_collection', false, 5, ARRAY['Required if filing as assignee', 'Must be on stamp paper'], NULL),
  ('startup_certificate', 'Startup India Certificate', 'DPIIT recognized startup certificate for fee concession', 'doc_collection', false, 6, ARRAY['80% fee reduction for recognized startups', 'Upload if applicable'], NULL)
) AS dt(document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
WHERE sp.slug = 'patent-provisional'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- =============================================================================
-- 7. GST Return Filing Initial Documents (4 docs)
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
  ('gst_login', 'GST Portal Login Credentials', 'Username and password for GST portal (or provide API access)', 'doc_collection', true, 1, ARRAY['Required for filing returns', 'We can use GSP access if you prefer'], NULL),
  ('sales_register', 'Sales Register / Invoice Data', 'Monthly sales invoices or sales register', 'doc_collection', true, 2, ARRAY['Include all B2B and B2C invoices', 'Excel format preferred', 'Include HSN/SAC codes'], NULL),
  ('purchase_register', 'Purchase Register / Invoice Data', 'Monthly purchase invoices for ITC claim', 'doc_collection', true, 3, ARRAY['Include supplier GSTIN', 'Invoice date and number', 'For ITC reconciliation'], NULL),
  ('bank_statement', 'Bank Statement', 'Bank statement for the filing period', 'doc_collection', false, 4, ARRAY['Helps verify receipts and payments', 'Useful for reconciliation'], NULL)
) AS dt(document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
WHERE sp.slug = 'gst-monthly-50l'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- =============================================================================
-- 8. ROC Annual Filing Initial Documents (5 docs)
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
  ('audited_financials', 'Audited Financial Statements', 'Balance Sheet, P&L, Notes to Accounts signed by auditor', 'doc_collection', true, 1, ARRAY['Must be signed by statutory auditor', 'Include CARO report if applicable'], NULL),
  ('director_report', 'Directors Report', 'Annual directors report as per Companies Act', 'doc_collection', true, 2, ARRAY['Include all mandatory disclosures', 'Board meeting details'], NULL),
  ('agm_notice', 'AGM Notice and Minutes', 'Notice of AGM and minutes of the meeting', 'doc_collection', true, 3, ARRAY['Include attendance register', 'Resolutions passed'], NULL),
  ('mca_login', 'MCA Portal Login', 'MCA21 portal login credentials or DSC access', 'doc_collection', true, 4, ARRAY['Required for filing AOC-4 and MGT-7', 'DSC of authorized director'], NULL),
  ('previous_filings', 'Previous Year Filings', 'Copy of last year AOC-4 and MGT-7', 'doc_collection', false, 5, ARRAY['Helps ensure consistency', 'Reference for comparative figures'], NULL)
) AS dt(document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
WHERE sp.slug = 'mca-annual-filing'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- =============================================================================
-- 9. ROC Changes Initial Documents (6 docs)
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
  ('board_resolution', 'Board Resolution', 'Board resolution approving the proposed change', 'doc_collection', true, 1, ARRAY['Must be signed by directors', 'Include date and meeting number'], 'https://templates.ollvy.in/board-resolution-roc.pdf'),
  ('mca_login', 'MCA Portal Login', 'MCA21 portal login credentials', 'doc_collection', true, 2, ARRAY['Required for filing forms', 'DSC of authorized director needed'], NULL),
  ('new_director_docs', 'New Director Documents', 'PAN, Aadhaar, photo of incoming director', 'doc_collection', false, 3, ARRAY['Only if adding new director', 'DIN will be applied for'], NULL),
  ('resignation_letter', 'Resignation Letter', 'Resignation letter from outgoing director', 'doc_collection', false, 4, ARRAY['Only if director is resigning', 'Must be dated and signed'], NULL),
  ('new_address_proof', 'New Address Proof', 'Address proof for new registered office', 'doc_collection', false, 5, ARRAY['Only if changing registered office', 'Utility bill or rent agreement'], NULL),
  ('shareholder_resolution', 'Shareholder Resolution', 'Special resolution if required for the change', 'doc_collection', false, 6, ARRAY['Required for certain changes', 'MGT-14 filing needed'], NULL)
) AS dt(document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
WHERE sp.slug = 'roc-changes'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- =============================================================================
-- 10. Director KYC Initial Documents (5 docs)
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
  ('director_pan', 'PAN Card', 'PAN card of the director', 'doc_collection', true, 1, ARRAY['Must match MCA records', 'Clear, legible copy'], NULL),
  ('director_aadhaar', 'Aadhaar Card', 'Aadhaar card linked to mobile for OTP verification', 'doc_collection', true, 2, ARRAY['Mobile must be linked to Aadhaar', 'OTP required during filing'], NULL),
  ('director_mobile', 'Mobile Number Proof', 'Mobile bill or declaration of Aadhaar-linked mobile', 'doc_collection', false, 3, ARRAY['Number linked to Aadhaar', 'For OTP verification'], NULL),
  ('din_certificate', 'DIN Allotment Letter', 'Original DIN allotment letter or printout from MCA', 'doc_collection', false, 4, ARRAY['Optional but helpful', 'Confirms DIN status'], NULL),
  ('dsc_token', 'DSC Token Access', 'Access to DSC token or credentials for signing', 'doc_collection', true, 5, ARRAY['Class 3 DSC required', 'Must be valid and not expired'], NULL)
) AS dt(document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
WHERE sp.slug = 'director-kyc'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- =============================================================================
-- 11. Business ITR Initial Documents (9 docs)
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
  ('financials', 'Financial Statements', 'Balance Sheet and Profit & Loss for the year', 'doc_collection', true, 1, ARRAY['Audited if audit required', 'Include schedules and notes'], NULL),
  ('trial_balance', 'Trial Balance / Ledgers', 'Trial balance or detailed ledgers from accounting software', 'doc_collection', true, 2, ARRAY['Tally export preferred', 'Include all accounts'], NULL),
  ('bank_statements', 'Bank Statements', 'All bank account statements for the full year', 'doc_collection', true, 3, ARRAY['April to March', 'All business accounts'], NULL),
  ('form_26as', 'Form 26AS / AIS', 'Tax credit statement from Income Tax portal', 'doc_collection', true, 4, ARRAY['Download from IT portal', 'Shows TDS credits'], NULL),
  ('gst_returns', 'GST Returns Summary', 'GSTR-3B and GSTR-1 for the year', 'doc_collection', false, 5, ARRAY['For turnover reconciliation', 'Download from GST portal'], NULL),
  ('tds_certificates', 'TDS Certificates', 'Form 16A from clients who deducted TDS', 'doc_collection', false, 6, ARRAY['For claiming TDS credit', 'Match with Form 26AS'], NULL),
  ('previous_itr', 'Previous Year ITR', 'ITR acknowledgment and computation of previous year', 'doc_collection', false, 7, ARRAY['For comparative figures', 'Carry forward losses if any'], NULL),
  ('advance_tax_challans', 'Advance Tax Challans', 'Challans for advance tax paid during the year', 'doc_collection', false, 8, ARRAY['15 June, 15 Sep, 15 Dec, 15 Mar', 'For self-assessment'], NULL),
  ('audit_report', 'Tax Audit Report', 'Form 3CA-3CD if tax audit was conducted', 'doc_collection', false, 9, ARRAY['Required if turnover > 1 Cr', 'Or > 50 L for professionals'], NULL)
) AS dt(document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
WHERE sp.slug = 'business-itr'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- =============================================================================
-- 12. Startup India Initial Documents (6 docs)
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
  ('incorporation_certificate', 'Certificate of Incorporation', 'COI from MCA or LLP registration certificate', 'doc_collection', true, 1, ARRAY['Entity must be less than 10 years old', 'Shows date of incorporation'], NULL),
  ('entity_pan', 'Entity PAN Card', 'PAN card of the company or LLP', 'doc_collection', true, 2, ARRAY['Business PAN, not personal', 'Must match entity name'], NULL),
  ('pitch_deck', 'Pitch Deck / Business Brief', 'Presentation or document explaining your startup', 'doc_collection', true, 3, ARRAY['Include problem, solution, market', 'Innovation and scalability potential'], NULL),
  ('director_aadhaar', 'Aadhaar of Authorized Director', 'Aadhaar of director signing the application', 'doc_collection', true, 4, ARRAY['For DPIIT portal verification', 'Mobile must be linked'], NULL),
  ('financial_statements', 'Latest Financial Statements', 'Balance sheet and P&L to show turnover', 'doc_collection', false, 5, ARRAY['To verify turnover eligibility', 'Turnover < 100 Cr required'], NULL),
  ('patent_trademark_proof', 'IP Documents (if any)', 'Patent/Trademark certificates if applicable', 'doc_collection', false, 6, ARRAY['Strengthens innovation claim', 'Optional but beneficial'], NULL)
) AS dt(document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
WHERE sp.slug = 'startup-india'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- =============================================================================
-- 13. ESI Registration Initial Documents (9 docs)
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
  ('entity_pan', 'Entity PAN Card', 'PAN card of the establishment', 'doc_collection', true, 1, ARRAY['Business PAN for company/LLP', 'Personal PAN for proprietorship'], NULL),
  ('entity_proof', 'Business Registration Proof', 'COI / LLP Agreement / Partnership Deed / Shop Act', 'doc_collection', true, 2, ARRAY['Proof of entity registration'], NULL),
  ('address_proof', 'Establishment Address Proof', 'Utility bill / rent agreement of business premises', 'doc_collection', true, 3, ARRAY['Where employees work', 'Not older than 60 days'], NULL),
  ('signatory_aadhaar', 'Aadhaar of Authorized Signatory', 'Aadhaar of the person signing the application', 'doc_collection', true, 4, ARRAY['Must be linked to mobile', 'Director or authorized person'], NULL),
  ('employee_list', 'Employee List with Details', 'List of employees with name, Aadhaar, father name, DOB', 'doc_collection', true, 5, ARRAY['All employees earning < Rs. 21,000/month', 'Include date of joining'], NULL),
  ('salary_register', 'Salary Register', 'Last 3 months salary register', 'doc_collection', true, 6, ARRAY['Shows wages paid', 'For ESI contribution calculation'], NULL),
  ('bank_proof', 'Bank Account Proof', 'Cancelled cheque or bank statement', 'doc_collection', true, 7, ARRAY['For online payment linkage', 'Account in establishment name'], NULL),
  ('board_resolution', 'Board Resolution', 'Resolution authorizing ESI registration', 'doc_collection', false, 8, ARRAY['Required for companies', 'Authorizes signatory'], 'https://templates.ollvy.in/board-resolution-esi.pdf'),
  ('pf_registration', 'PF Registration (if registered)', 'Copy of PF registration if already registered under EPFO', 'doc_collection', false, 9, ARRAY['Optional - for reference', 'Shows compliance status'], NULL)
) AS dt(document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
WHERE sp.slug = 'esi-registration'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- =============================================================================
-- 14. PF Registration Initial Documents (10 docs)
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
  ('entity_pan', 'Entity PAN Card', 'PAN card of the establishment', 'doc_collection', true, 1, ARRAY['Business PAN for company/LLP', 'Personal PAN for proprietorship'], NULL),
  ('entity_proof', 'Business Registration Proof', 'COI / LLP Agreement / Partnership Deed', 'doc_collection', true, 2, ARRAY['Proof of entity registration'], NULL),
  ('address_proof', 'Establishment Address Proof', 'Utility bill / rent agreement of business premises', 'doc_collection', true, 3, ARRAY['Where employees work', 'Not older than 60 days'], NULL),
  ('signatory_pan', 'PAN of Authorized Signatory', 'PAN card of the person authorized for EPFO', 'doc_collection', true, 4, ARRAY['Director, partner, or authorized person'], NULL),
  ('signatory_aadhaar', 'Aadhaar of Authorized Signatory', 'Aadhaar linked to mobile for OTP', 'doc_collection', true, 5, ARRAY['Required for EPFO portal verification'], NULL),
  ('employee_list', 'Employee List with Details', 'List with name, Aadhaar, UAN (if existing), bank details', 'doc_collection', true, 6, ARRAY['All employees', 'Include UAN if they have existing PF'], NULL),
  ('salary_register', 'Salary Register', 'Last 3 months salary showing basic + DA', 'doc_collection', true, 7, ARRAY['PF calculated on Basic + DA', 'Shows employee strength'], NULL),
  ('bank_proof', 'Bank Account Proof', 'Cancelled cheque for online payment setup', 'doc_collection', true, 8, ARRAY['Account in establishment name', 'For monthly contribution payment'], NULL),
  ('dsc_details', 'DSC Token Details', 'Class 3 DSC of signatory for EPFO portal', 'doc_collection', true, 9, ARRAY['Required for registration and monthly filing', 'Must be valid'], NULL),
  ('board_resolution', 'Board Resolution', 'Resolution authorizing PF registration', 'doc_collection', false, 10, ARRAY['Required for companies', 'Authorizes signatory for EPFO'], 'https://templates.ollvy.in/board-resolution-pf.pdf')
) AS dt(document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
WHERE sp.slug = 'pf-registration'
ON CONFLICT (service_package_id, document_key) DO NOTHING;


-- =============================================================================
-- PART 2: WORK DOCUMENTS (service_work_document_templates)
-- =============================================================================

-- =============================================================================
-- 1. OPC Incorporation Work Documents (10 docs)
-- =============================================================================

INSERT INTO service_work_document_templates (service_package_id, stage_key, direction, document_key, document_label, description, display_order)
SELECT
  sp.id,
  t.stage_key,
  t.direction::work_document_direction,
  t.document_key,
  t.document_label,
  t.description,
  t.display_order
FROM service_packages sp
CROSS JOIN (VALUES
  ('dsc_applied', 'to_customer', 'dsc_application_form', 'DSC Application Form', 'Digital Signature Certificate application form. Complete, sign, and return for DSC procurement.', 1),
  ('dsc_applied', 'from_customer', 'signed_dsc_form', 'Signed DSC Application Form', 'Upload the signed DSC application form. Required to issue Class 3 DSC.', 2),
  ('name_approval', 'to_customer', 'name_reservation_draft', 'Name Reservation Application (RUN)', 'Review the proposed OPC names before submission to MCA.', 3),
  ('name_approval', 'to_customer', 'name_approval_letter', 'MCA Name Approval Letter', 'Official name approval from MCA. Valid for 20 days.', 4),
  ('spice_filed', 'to_customer', 'moa_draft', 'Draft MOA', 'Review the Memorandum of Association before signing.', 5),
  ('spice_filed', 'to_customer', 'aoa_draft', 'Draft AOA', 'Review the Articles of Association before signing.', 6),
  ('spice_filed', 'from_customer', 'inc9_signed', 'Signed INC-9 Declaration', 'Declaration that you are not disqualified from being a director.', 7),
  ('incorporation_certificate', 'to_customer', 'certificate_of_incorporation', 'Certificate of Incorporation', 'Official MCA certificate with CIN, PAN, and TAN.', 8),
  ('incorporation_certificate', 'to_customer', 'company_pan', 'Company PAN Card', 'PAN issued to the OPC.', 9),
  ('incorporation_certificate', 'to_customer', 'company_tan', 'Company TAN', 'TAN for TDS purposes.', 10)
) AS t(stage_key, direction, document_key, document_label, description, display_order)
WHERE sp.slug = 'opc-incorporation'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- =============================================================================
-- 2. Partnership Registration Work Documents (4 docs)
-- =============================================================================

INSERT INTO service_work_document_templates (service_package_id, stage_key, direction, document_key, document_label, description, display_order)
SELECT
  sp.id,
  t.stage_key,
  t.direction::work_document_direction,
  t.document_key,
  t.document_label,
  t.description,
  t.display_order
FROM service_packages sp
CROSS JOIN (VALUES
  ('deed_drafted', 'to_customer', 'partnership_deed_draft', 'Draft Partnership Deed', 'Review the custom partnership deed. Verify profit sharing, roles, and exit clauses.', 1),
  ('deed_drafted', 'from_customer', 'deed_approval', 'Deed Approval', 'Confirm your approval of the partnership deed before printing on stamp paper.', 2),
  ('firm_registered', 'to_customer', 'signed_deed_copy', 'Signed Partnership Deed', 'Copy of the signed deed on stamp paper for your records.', 3),
  ('firm_registered', 'to_customer', 'registration_certificate', 'Firm Registration Certificate', 'Registration certificate from Registrar of Firms.', 4)
) AS t(stage_key, direction, document_key, document_label, description, display_order)
WHERE sp.slug = 'partnership-registration'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- =============================================================================
-- 3. Sole Proprietorship Work Documents (5 docs)
-- =============================================================================

INSERT INTO service_work_document_templates (service_package_id, stage_key, direction, document_key, document_label, description, display_order)
SELECT
  sp.id,
  t.stage_key,
  t.direction::work_document_direction,
  t.document_key,
  t.document_label,
  t.description,
  t.display_order
FROM service_packages sp
CROSS JOIN (VALUES
  ('application_filed', 'to_customer', 'application_draft', 'Registration Application Draft', 'Review the application before submission.', 1),
  ('application_filed', 'from_customer', 'application_approval', 'Application Approval', 'Confirm your approval of the application.', 2),
  ('certificate_issued', 'to_customer', 'msme_certificate', 'MSME/Udyam Certificate', 'Udyam registration certificate if applicable.', 3),
  ('certificate_issued', 'to_customer', 'gst_certificate', 'GST Certificate', 'GST registration certificate if applicable.', 4),
  ('certificate_issued', 'to_customer', 'compliance_checklist', 'Compliance Checklist', 'List of ongoing compliance requirements.', 5)
) AS t(stage_key, direction, document_key, document_label, description, display_order)
WHERE sp.slug = 'sole-proprietorship'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- =============================================================================
-- 4. Trade License Work Documents (3 docs)
-- =============================================================================

INSERT INTO service_work_document_templates (service_package_id, stage_key, direction, document_key, document_label, description, display_order)
SELECT
  sp.id,
  t.stage_key,
  t.direction::work_document_direction,
  t.document_key,
  t.document_label,
  t.description,
  t.display_order
FROM service_packages sp
CROSS JOIN (VALUES
  ('application_filed', 'to_customer', 'application_receipt', 'Application Receipt', 'Receipt showing trade license application filed.', 1),
  ('application_filed', 'from_customer', 'inspection_confirmation', 'Inspection Confirmation', 'Confirm availability for premises inspection if required.', 2),
  ('certificate_issued', 'to_customer', 'trade_license', 'Trade License Certificate', 'Official trade license issued by municipal authority.', 3)
) AS t(stage_key, direction, document_key, document_label, description, display_order)
WHERE sp.slug = 'trade-license'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- =============================================================================
-- 5. Copyright Registration Work Documents (5 docs)
-- =============================================================================

INSERT INTO service_work_document_templates (service_package_id, stage_key, direction, document_key, document_label, description, display_order)
SELECT
  sp.id,
  t.stage_key,
  t.direction::work_document_direction,
  t.document_key,
  t.document_label,
  t.description,
  t.display_order
FROM service_packages sp
CROSS JOIN (VALUES
  ('application_preparation', 'to_customer', 'statement_of_particulars', 'Statement of Particulars Draft', 'Review the statement describing your work before filing.', 1),
  ('application_preparation', 'from_customer', 'particulars_approval', 'Particulars Approval', 'Confirm approval of the statement.', 2),
  ('diary_number_issued', 'to_customer', 'filing_acknowledgment', 'Filing Acknowledgment', 'Copyright application filed. Diary number for tracking.', 3),
  ('examination', 'from_customer', 'examination_response', 'Examination Query Response', 'Response to any queries raised by Copyright Office.', 4),
  ('registration_issued', 'to_customer', 'copyright_certificate', 'Copyright Registration Certificate', 'Official certificate from Copyright Office.', 5)
) AS t(stage_key, direction, document_key, document_label, description, display_order)
WHERE sp.slug = 'copyright-registration'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- =============================================================================
-- 6. Patent Filing Work Documents (9 docs)
-- =============================================================================

INSERT INTO service_work_document_templates (service_package_id, stage_key, direction, document_key, document_label, description, display_order)
SELECT
  sp.id,
  t.stage_key,
  t.direction::work_document_direction,
  t.document_key,
  t.document_label,
  t.description,
  t.display_order
FROM service_packages sp
CROSS JOIN (VALUES
  ('drafting', 'to_customer', 'specification_draft', 'Provisional Specification Draft', 'Review the patent specification before filing.', 1),
  ('drafting', 'from_customer', 'specification_approval', 'Specification Approval', 'Confirm approval of the specification.', 2),
  ('filing', 'to_customer', 'form1_draft', 'Form 1 Application Draft', 'Review the patent application form.', 3),
  ('filing', 'from_customer', 'poa_signed', 'Signed Power of Attorney', 'Power of attorney to file on your behalf.', 4),
  ('filing', 'to_customer', 'filing_receipt', 'Patent Filing Receipt', 'Application number and filing date.', 5),
  ('examination', 'to_customer', 'fer_notification', 'First Examination Report', 'Examiners report with objections if any.', 6),
  ('examination', 'from_customer', 'fer_response', 'FER Response', 'Your response to examiner objections.', 7),
  ('grant', 'to_customer', 'grant_certificate', 'Patent Grant Certificate', 'Certificate of patent grant.', 8),
  ('grant', 'to_customer', 'patent_document', 'Complete Patent Document', 'Full patent specification as granted.', 9)
) AS t(stage_key, direction, document_key, document_label, description, display_order)
WHERE sp.slug = 'patent-provisional'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- =============================================================================
-- 7. GST Return Filing Work Documents (6 docs)
-- =============================================================================

INSERT INTO service_work_document_templates (service_package_id, stage_key, direction, document_key, document_label, description, display_order)
SELECT
  sp.id,
  t.stage_key,
  t.direction::work_document_direction,
  t.document_key,
  t.document_label,
  t.description,
  t.display_order
FROM service_packages sp
CROSS JOIN (VALUES
  ('data_collection', 'from_customer', 'sales_data', 'Sales Data / Invoices', 'Upload sales invoices or sales register for the month.', 1),
  ('data_collection', 'from_customer', 'purchase_data', 'Purchase Data / Invoices', 'Upload purchase invoices for ITC claim.', 2),
  ('reconciliation', 'to_customer', 'itc_reconciliation', 'ITC Reconciliation Report', 'Comparison of your purchases with GSTR-2B.', 3),
  ('filing_gstr1', 'to_customer', 'gstr1_arn', 'GSTR-1 Filing Acknowledgment', 'GSTR-1 filed. ARN for your records.', 4),
  ('filing_gstr3b', 'to_customer', 'gstr3b_arn', 'GSTR-3B Filing Acknowledgment', 'GSTR-3B filed. Monthly GST compliance complete.', 5),
  ('filing_complete', 'to_customer', 'monthly_summary', 'Monthly Filing Summary', 'Summary of sales, purchases, ITC claimed, and tax paid.', 6)
) AS t(stage_key, direction, document_key, document_label, description, display_order)
WHERE sp.slug = 'gst-monthly-50l'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- =============================================================================
-- 8. ROC Annual Filing Work Documents (5 docs)
-- =============================================================================

INSERT INTO service_work_document_templates (service_package_id, stage_key, direction, document_key, document_label, description, display_order)
SELECT
  sp.id,
  t.stage_key,
  t.direction::work_document_direction,
  t.document_key,
  t.document_label,
  t.description,
  t.display_order
FROM service_packages sp
CROSS JOIN (VALUES
  ('drafting', 'to_customer', 'aoc4_draft', 'Draft AOC-4 Form', 'Review the financial statements form before filing.', 1),
  ('drafting', 'to_customer', 'mgt7_draft', 'Draft MGT-7 Form', 'Review the annual return form before filing.', 2),
  ('drafting', 'from_customer', 'forms_approval', 'Forms Approval', 'Confirm approval of AOC-4 and MGT-7.', 3),
  ('filing', 'to_customer', 'aoc4_srn', 'AOC-4 Filing Receipt', 'AOC-4 filed. SRN for your records.', 4),
  ('filing', 'to_customer', 'mgt7_srn', 'MGT-7 Filing Receipt', 'MGT-7 filed. Annual compliance complete.', 5)
) AS t(stage_key, direction, document_key, document_label, description, display_order)
WHERE sp.slug = 'mca-annual-filing'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- =============================================================================
-- 9. ROC Changes Work Documents (5 docs)
-- =============================================================================

INSERT INTO service_work_document_templates (service_package_id, stage_key, direction, document_key, document_label, description, display_order)
SELECT
  sp.id,
  t.stage_key,
  t.direction::work_document_direction,
  t.document_key,
  t.document_label,
  t.description,
  t.display_order
FROM service_packages sp
CROSS JOIN (VALUES
  ('preparation', 'to_customer', 'resolution_draft', 'Draft Resolution', 'Review the board/shareholder resolution before signing.', 1),
  ('preparation', 'from_customer', 'resolution_signed', 'Signed Resolution', 'Upload the signed resolution.', 2),
  ('filing', 'to_customer', 'form_draft', 'Draft MCA Form', 'Review the DIR-12/INC-22/SH-4 form before filing.', 3),
  ('filing', 'to_customer', 'filing_srn', 'Filing Receipt', 'Form filed. SRN for your records.', 4),
  ('confirmation', 'to_customer', 'updated_master_data', 'Updated Company Master Data', 'MCA master data showing the change is recorded.', 5)
) AS t(stage_key, direction, document_key, document_label, description, display_order)
WHERE sp.slug = 'roc-changes'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- =============================================================================
-- 10. Director KYC Work Documents (2 docs)
-- =============================================================================

INSERT INTO service_work_document_templates (service_package_id, stage_key, direction, document_key, document_label, description, display_order)
SELECT
  sp.id,
  t.stage_key,
  t.direction::work_document_direction,
  t.document_key,
  t.document_label,
  t.description,
  t.display_order
FROM service_packages sp
CROSS JOIN (VALUES
  ('dir3_filed', 'to_customer', 'dir3_acknowledgment', 'DIR-3 KYC Filing Acknowledgment', 'DIR-3 KYC filed on MCA portal. SRN for your records.', 1),
  ('din_active', 'to_customer', 'din_status_proof', 'DIN Status - Active', 'Screenshot showing DIN status as Active on MCA portal.', 2)
) AS t(stage_key, direction, document_key, document_label, description, display_order)
WHERE sp.slug = 'director-kyc'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- =============================================================================
-- 11. Business ITR Work Documents (5 docs)
-- =============================================================================

INSERT INTO service_work_document_templates (service_package_id, stage_key, direction, document_key, document_label, description, display_order)
SELECT
  sp.id,
  t.stage_key,
  t.direction::work_document_direction,
  t.document_key,
  t.document_label,
  t.description,
  t.display_order
FROM service_packages sp
CROSS JOIN (VALUES
  ('computation', 'to_customer', 'income_computation', 'Income Computation Statement', 'Detailed computation of business income and taxable income.', 1),
  ('computation', 'to_customer', 'tax_computation', 'Tax Computation Sheet', 'Tax liability with TDS credit and balance payable/refund.', 2),
  ('computation', 'from_customer', 'computation_approval', 'Computation Approval', 'Confirm approval of income and tax computation.', 3),
  ('filing', 'to_customer', 'itr_acknowledgment', 'ITR Acknowledgment (ITR-V)', 'ITR filed. Acknowledgment for your records.', 4),
  ('filing', 'to_customer', 'filing_summary', 'ITR Filing Summary', 'Summary of total income, tax paid, and acknowledgment number.', 5)
) AS t(stage_key, direction, document_key, document_label, description, display_order)
WHERE sp.slug = 'business-itr'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- =============================================================================
-- 12. Startup India Work Documents (4 docs)
-- =============================================================================

INSERT INTO service_work_document_templates (service_package_id, stage_key, direction, document_key, document_label, description, display_order)
SELECT
  sp.id,
  t.stage_key,
  t.direction::work_document_direction,
  t.document_key,
  t.document_label,
  t.description,
  t.display_order
FROM service_packages sp
CROSS JOIN (VALUES
  ('application_preparation', 'to_customer', 'application_draft', 'DPIIT Application Draft', 'Review the Startup India application before submission.', 1),
  ('application_preparation', 'from_customer', 'application_approval', 'Application Approval', 'Confirm approval of the application.', 2),
  ('application_filed', 'to_customer', 'application_receipt', 'Application Receipt', 'Application submitted to DPIIT. Reference number for tracking.', 3),
  ('recognition', 'to_customer', 'startup_certificate', 'Startup India Recognition Certificate', 'Official DPIIT certificate recognizing your startup.', 4)
) AS t(stage_key, direction, document_key, document_label, description, display_order)
WHERE sp.slug = 'startup-india'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- =============================================================================
-- 13. ESI Registration Work Documents (4 docs)
-- =============================================================================

INSERT INTO service_work_document_templates (service_package_id, stage_key, direction, document_key, document_label, description, display_order)
SELECT
  sp.id,
  t.stage_key,
  t.direction::work_document_direction,
  t.document_key,
  t.document_label,
  t.description,
  t.display_order
FROM service_packages sp
CROSS JOIN (VALUES
  ('application_filed', 'to_customer', 'esic_application_draft', 'ESIC Application Draft', 'Review the ESIC registration application.', 1),
  ('application_filed', 'from_customer', 'employee_details_verification', 'Employee Details Verification', 'Verify employee details before final submission.', 2),
  ('code_issued', 'to_customer', 'employer_code', 'ESIC Employer Code', 'Your 17-digit ESIC employer code for monthly contributions.', 3),
  ('code_issued', 'to_customer', 'compliance_guide', 'ESI Compliance Guide', 'Guide on monthly contribution filing and employee IP generation.', 4)
) AS t(stage_key, direction, document_key, document_label, description, display_order)
WHERE sp.slug = 'esi-registration'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- =============================================================================
-- 14. PF Registration Work Documents (4 docs)
-- =============================================================================

INSERT INTO service_work_document_templates (service_package_id, stage_key, direction, document_key, document_label, description, display_order)
SELECT
  sp.id,
  t.stage_key,
  t.direction::work_document_direction,
  t.document_key,
  t.document_label,
  t.description,
  t.display_order
FROM service_packages sp
CROSS JOIN (VALUES
  ('dsc_linked', 'to_customer', 'dsc_linking_confirmation', 'DSC Linking Confirmation', 'DSC successfully linked to EPFO portal.', 1),
  ('application_filed', 'to_customer', 'epfo_application_draft', 'EPFO Application Draft', 'Review the PF registration application.', 2),
  ('code_issued', 'to_customer', 'establishment_code', 'PF Establishment Code', 'Your EPFO establishment code for monthly contributions.', 3),
  ('code_issued', 'to_customer', 'compliance_guide', 'PF Compliance Guide', 'Guide on monthly ECR filing and employee UAN generation.', 4)
) AS t(stage_key, direction, document_key, document_label, description, display_order)
WHERE sp.slug = 'pf-registration'
ON CONFLICT (service_package_id, document_key) DO NOTHING;


-- =============================================================================
-- PART 3: FINAL DELIVERABLES
-- Final deliverables are work documents marked as completion outputs
-- They are already included in the work documents above with 'certificate' keys
-- No separate table needed - the to_customer documents at final stages serve this purpose
-- =============================================================================

-- Summary of Final Deliverables by Service:
-- opc-incorporation: Certificate of Incorporation, Company PAN, Company TAN, MOA, AOA
-- partnership-registration: Registration Certificate, Signed Partnership Deed, PAN
-- sole-proprietorship: MSME Certificate, GST Certificate, Compliance Checklist, Shop Act
-- trade-license: Trade License Certificate
-- copyright-registration: Copyright Registration Certificate, Filing Acknowledgment
-- patent-provisional: Patent Grant Certificate, Complete Patent Document, Filing Receipt
-- gst-monthly-50l: Monthly Filing Summary, GSTR-1 ARN, GSTR-3B ARN, ITC Report
-- mca-annual-filing: AOC-4 SRN, MGT-7 SRN, Compliance Certificate
-- roc-changes: Filing SRN, Updated Master Data
-- director-kyc: DIR-3 KYC Acknowledgment
-- business-itr: ITR Acknowledgment (ITR-V), Filing Summary, Computation Sheet
-- startup-india: Startup India Recognition Certificate
-- esi-registration: ESIC Employer Code, Compliance Guide
-- pf-registration: PF Establishment Code, Compliance Guide
