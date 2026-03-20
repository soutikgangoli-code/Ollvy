-- =============================================================================
-- Migration: Seed Initial Documents for Services Missing Them
-- Adds document templates for: msme-registration, iec-code, professional-tax,
-- shop-establishment, partnership-registration, copyright-registration
-- NOTE: esi-registration, pf-registration, startup-india removed - no reference spec
-- =============================================================================

-- =============================================================================
-- 1. MSME / Udyam Registration Initial Documents
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
  ('aadhaar_card', 'Aadhaar Card', 'Aadhaar card of the owner/promoter - must be linked to active mobile for OTP verification', 'doc_collection', true, 1, ARRAY['Must be linked to active mobile number', 'OTP will be sent during Udyam registration', 'Name should match PAN card'], NULL),
  ('pan_card', 'PAN Card', 'PAN card of the business entity or proprietor', 'doc_collection', true, 2, ARRAY['For proprietorship: personal PAN', 'For company/LLP: business PAN', 'Name must match exactly'], NULL),
  ('gst_certificate', 'GST Certificate', 'GST registration certificate if GST registered', 'doc_collection', false, 3, ARRAY['Not required if below GST threshold', 'Turnover data will be auto-fetched from GSTIN'], NULL),
  ('previous_msme_cert', 'Previous MSME/UAM Certificate', 'Previous Udyog Aadhaar or EM-II registration if any', 'doc_collection', false, 4, ARRAY['Required for migration to Udyam', 'Upload if you have an old registration'], NULL),
  ('bank_proof', 'Bank Account Proof', 'Cancelled cheque or first page of passbook', 'doc_collection', true, 5, ARRAY['Account should be in entity name', 'IFSC and account number clearly visible'], NULL)
) AS dt(document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
WHERE sp.slug = 'msme-registration'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- =============================================================================
-- 2. IEC Code Initial Documents
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
  ('entity_pan', 'Entity PAN Card', 'PAN card of the entity applying for IEC (IEC number will be same as PAN)', 'doc_collection', true, 1, ARRAY['For proprietor: personal PAN', 'For company/LLP: business PAN', 'IEC number = Entity PAN'], NULL),
  ('entity_proof', 'Entity Registration Proof', 'Certificate of Incorporation / Partnership Deed / LLP Agreement', 'doc_collection', true, 2, ARRAY['For Pvt Ltd/OPC: Certificate of Incorporation', 'For LLP: LLP Agreement + Certificate', 'For Partnership: Partnership Deed', 'For Proprietor: Shop Act / GST certificate'], NULL),
  ('address_proof', 'Address Proof of Registered Office', 'Electricity bill / property tax receipt / rent agreement (not older than 60 days)', 'doc_collection', true, 3, ARRAY['Must not be older than 2 months', 'For rented premises: rent agreement + utility bill', 'Address should match application'], NULL),
  ('cancelled_cheque', 'Cancelled Cheque', 'Pre-printed cancelled cheque of entity bank account', 'doc_collection', true, 4, ARRAY['Account must be in entity name', 'Pre-printed cheques only - no handwritten numbers', 'IFSC and account number clearly visible'], NULL),
  ('signatory_photo', 'Passport Size Photo', 'Recent photograph of authorized signatory', 'doc_collection', true, 5, ARRAY['White background', 'Face clearly visible', 'JPEG format preferred'], NULL),
  ('signatory_id', 'ID Proof of Signatory', 'Aadhaar/Passport/Voter ID of person signing the application', 'doc_collection', true, 6, ARRAY['Any one valid government ID', 'Should be clearly legible'], NULL),
  ('dsc_auth', 'DSC Authorization (if using DSC)', 'Authorization letter for using Class 3 DSC', 'doc_collection', false, 7, ARRAY['Required only if signing with DSC', 'Aadhaar e-Sign is also available'], NULL),
  ('board_resolution', 'Board Resolution', 'Board resolution authorizing person to apply for IEC (for companies/LLPs)', 'doc_collection', false, 8, ARRAY['Required for Pvt Ltd, OPC, LLP, Public Ltd', 'Not required for proprietorship or partnership', 'Should authorize the signatory by name'], 'https://templates.ollvy.in/board-resolution-iec.pdf')
) AS dt(document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
WHERE sp.slug = 'iec-code'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- =============================================================================
-- 3. Professional Tax Initial Documents
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
  ('entity_pan', 'PAN Card of Entity', 'PAN card of the business entity', 'doc_collection', true, 1, ARRAY['Business PAN for company/LLP', 'Personal PAN for proprietorship'], NULL),
  ('owner_pan', 'PAN Card of Owner/Director', 'PAN card of proprietor/director/partner', 'doc_collection', true, 2, ARRAY['Personal PAN of the person in charge'], NULL),
  ('owner_aadhaar', 'Aadhaar Card of Owner', 'Aadhaar card of the proprietor/director/partner', 'doc_collection', true, 3, ARRAY['Must be linked to mobile number', 'For OTP verification'], NULL),
  ('address_proof', 'Business Address Proof', 'Electricity bill / rent agreement / property tax receipt', 'doc_collection', true, 4, ARRAY['Not older than 60 days', 'Address must match application'], NULL),
  ('entity_proof', 'Entity Registration Proof', 'COI / Partnership Deed / Shop Act certificate', 'doc_collection', true, 5, ARRAY['Proof of business registration'], NULL),
  ('employee_list', 'Employee List', 'List of employees with name, designation, and salary', 'doc_collection', false, 6, ARRAY['Required for PTRC (employer registration)', 'Include all employees on payroll', 'Format: Name, Designation, Gross Salary'], NULL),
  ('gst_certificate', 'GST Certificate', 'GST registration certificate if registered', 'doc_collection', false, 7, ARRAY['Optional but helps in verification'], NULL),
  ('salary_register', 'Salary Register', 'Last 3 months salary register or payroll statement', 'doc_collection', false, 8, ARRAY['Required for PTRC', 'Shows gross salary paid to employees'], NULL),
  ('shop_act', 'Shop & Establishment Certificate', 'Shop Act registration certificate', 'doc_collection', false, 9, ARRAY['If already registered under Shop Act', 'Helps expedite PT registration'], NULL),
  ('bank_proof', 'Bank Account Proof', 'Cancelled cheque or bank statement first page', 'doc_collection', false, 10, ARRAY['Account in entity name', 'For PT payment linkage'], NULL)
) AS dt(document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
WHERE sp.slug = 'professional-tax'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- =============================================================================
-- 4. Shop & Establishment Initial Documents
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
  ('owner_id', 'ID Proof of Employer/Owner', 'PAN card or Aadhaar card of the employer', 'doc_collection', true, 1, ARRAY['Government issued photo ID', 'Name should match application'], NULL),
  ('owner_pan', 'PAN Card', 'PAN card of employer (business or personal)', 'doc_collection', true, 2, ARRAY['For proprietor: personal PAN', 'For company: entity PAN'], NULL),
  ('address_proof', 'Address Proof of Establishment', 'Electricity bill / rent agreement / property tax receipt', 'doc_collection', true, 3, ARRAY['Must not be older than 60 days', 'Address should match application'], NULL),
  ('rent_agreement', 'Rent Agreement', 'Registered or notarized rent agreement (if rented)', 'doc_collection', false, 4, ARRAY['Required if premises is rented', 'Should be currently valid', 'Notarized copies preferred'], NULL),
  ('noc_landlord', 'NOC from Landlord', 'No Objection Certificate from property owner', 'doc_collection', false, 5, ARRAY['Required if premises is rented', 'Should permit commercial use', 'Landlord signature mandatory'], 'https://templates.ollvy.in/noc-shop-act.pdf'),
  ('premise_photos', 'Photographs of Establishment', 'Photos showing establishment name board and interior', 'doc_collection', true, 6, ARRAY['Show name board clearly', 'Interior showing working space', '3-4 photos recommended'], NULL),
  ('entity_proof', 'Entity Registration Proof', 'COI / Partnership Deed / GST certificate', 'doc_collection', false, 7, ARRAY['Certificate proving business registration', 'For proprietor: GST or MSME certificate'], NULL),
  ('employee_list', 'Employee List', 'List of employees with joining date and designation', 'doc_collection', false, 8, ARRAY['Required if you have employees', 'Format: Name, DOJ, Designation'], NULL)
) AS dt(document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
WHERE sp.slug = 'shop-establishment'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- =============================================================================
-- 5. Partnership Registration Initial Documents
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
  ('partner1_pan', 'PAN Card - Partner 1', 'PAN card of first partner', 'doc_collection', true, 1, ARRAY['Clear, legible copy', 'Name should match ID proof'], NULL),
  ('partner1_aadhaar', 'Aadhaar Card - Partner 1', 'Aadhaar card (front and back) of first partner', 'doc_collection', true, 2, ARRAY['Both sides required', 'Address should be current'], NULL),
  ('partner1_photo', 'Photograph - Partner 1', 'Passport size photograph of first partner', 'doc_collection', true, 3, ARRAY['White background', 'Recent photograph'], NULL),
  ('partner2_pan', 'PAN Card - Partner 2', 'PAN card of second partner', 'doc_collection', true, 4, ARRAY['Clear, legible copy', 'Name should match ID proof'], NULL),
  ('partner2_aadhaar', 'Aadhaar Card - Partner 2', 'Aadhaar card (front and back) of second partner', 'doc_collection', true, 5, ARRAY['Both sides required', 'Address should be current'], NULL),
  ('partner2_photo', 'Photograph - Partner 2', 'Passport size photograph of second partner', 'doc_collection', true, 6, ARRAY['White background', 'Recent photograph'], NULL),
  ('address_proof', 'Address Proof of Business', 'Electricity bill / rent agreement for business address', 'doc_collection', true, 7, ARRAY['Must not be older than 60 days', 'Address where firm will operate'], NULL),
  ('noc_premises', 'NOC from Premises Owner', 'NOC from landlord or property owner', 'doc_collection', false, 8, ARRAY['Required if premises is rented', 'Should permit commercial use'], 'https://templates.ollvy.in/noc-partnership.pdf'),
  ('deed_draft_input', 'Partnership Deed Draft Input', 'Your inputs for partnership deed - profit sharing, capital, duties', 'doc_collection', false, 9, ARRAY['We can help draft this', 'Include profit sharing ratio', 'List partner responsibilities'], NULL)
) AS dt(document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
WHERE sp.slug = 'partnership-registration'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- =============================================================================
-- 6. Copyright Registration Initial Documents
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
  ('work_copy', 'Copy of the Work', 'Complete copy of the work being registered (PDF, images, source code, etc.)', 'doc_collection', true, 1, ARRAY['Literary: Full PDF', 'Artistic: High-res images', 'Software: First and last 10 pages of source code', 'Upload as single file or ZIP'], NULL),
  ('applicant_id', 'ID Proof of Applicant', 'Aadhaar / PAN for individuals; CoI for companies', 'doc_collection', true, 2, ARRAY['Government issued ID', 'Name must match application'], NULL),
  ('applicant_address', 'Address Proof of Applicant', 'Utility bill / bank statement / Aadhaar', 'doc_collection', true, 3, ARRAY['Current address of applicant', 'Not older than 60 days'], NULL),
  ('author_noc', 'NOC from Author', 'No Objection Certificate from author (if applicant is not author)', 'doc_collection', false, 4, ARRAY['Required if applicant is not the creator', 'Author authorizing registration', 'Signed by author'], 'https://templates.ollvy.in/author-noc.pdf'),
  ('assignment_deed', 'Assignment Deed', 'Deed of assignment from author to applicant (if assignee)', 'doc_collection', false, 5, ARRAY['Required if rights were assigned', 'Shows transfer of rights from author'], NULL),
  ('original_work_noc', 'NOC from Original Work Owner', 'NOC if this is an adaptation or derivative work', 'doc_collection', false, 6, ARRAY['Required for adaptations', 'Permission from original creator'], NULL),
  ('publisher_noc', 'Publisher NOC', 'NOC from publisher if published and publisher is not applicant', 'doc_collection', false, 7, ARRAY['Required if published by someone else', 'Publisher allows registration in your name'], NULL)
) AS dt(document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
WHERE sp.slug = 'copyright-registration'
ON CONFLICT (service_package_id, document_key) DO NOTHING;
