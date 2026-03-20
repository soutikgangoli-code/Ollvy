-- =============================================================================
-- Migration: Step 8-10 - Conditional Documents and Missing Fields
-- Step 8: Add condition JSONB to documents
-- Step 9: Seed missing documents
-- Step 10: Seed missing questionnaire fields
-- =============================================================================


-- =============================================================================
-- STEP 8: CONDITIONAL DOCUMENT LOGIC
-- Operators: equals, not_equals, includes, not_includes, includes_any, less_than, exists
-- =============================================================================

-- Professional Tax: Employee list and salary register only for PTRC
UPDATE service_document_templates
SET condition = '{"question_key": "registration_type", "operator": "includes", "value": "PTRC"}'::jsonb
WHERE document_key IN ('employee_list', 'salary_register')
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'professional-tax');

-- Shop & Establishment: Rent agreement and NOC only for rented premises
UPDATE service_document_templates
SET condition = '{"question_key": "premises_nature", "operator": "equals", "value": "rented"}'::jsonb
WHERE document_key IN ('rent_agreement', 'noc')
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'shop-establishment');

-- Copyright: Author NOC only when applicant is not the author
UPDATE service_document_templates
SET condition = '{"question_key": "applicant_is_author", "operator": "equals", "value": "no"}'::jsonb
WHERE document_key = 'author_noc'
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'copyright-registration');

-- Copyright: Assignment deed only for assignees
UPDATE service_document_templates
SET condition = '{"question_key": "ownership_basis", "operator": "equals", "value": "assignee"}'::jsonb
WHERE document_key = 'assignment_deed'
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'copyright-registration');

-- GST: Entity proof not needed for sole proprietorship
UPDATE service_document_templates
SET condition = '{"question_key": "entity_type", "operator": "not_equals", "value": "sole_proprietorship"}'::jsonb
WHERE document_key = 'entity_proof'
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'gst-registration');

-- IEC: Board resolution only for companies/LLPs
UPDATE service_document_templates
SET condition = '{"question_key": "entity_type", "operator": "includes_any", "values": ["pvt_ltd", "llp", "public_ltd"]}'::jsonb
WHERE document_key = 'board_resolution_signed'
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'iec-code');

-- Trademark: MSME/Startup certificate only for those applicant types
UPDATE service_document_templates
SET condition = '{"question_key": "applicant_type", "operator": "includes_any", "values": ["msme", "startup"]}'::jsonb
WHERE document_key = 'msme_startup_cert'
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'trademark-registration');


-- =============================================================================
-- STEP 9: MISSING DOCUMENTS TO SEED
-- =============================================================================

-- Pvt Ltd: DIR-2 Consent to Act as Director
INSERT INTO service_document_templates
  (service_package_id, document_key, document_label, description, is_required, display_order)
SELECT
  (SELECT id FROM service_packages WHERE slug = 'pvt-ltd-incorporation'),
  'dir2_consent',
  'DIR-2 Consent to Act as Director',
  'Consent form required from each director. Your CA will prepare this - download, sign, and upload.',
  true,
  102
WHERE NOT EXISTS (
  SELECT 1 FROM service_document_templates
  WHERE document_key = 'dir2_consent'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'pvt-ltd-incorporation')
);

-- Pvt Ltd: INC-9 Declaration
INSERT INTO service_document_templates
  (service_package_id, document_key, document_label, description, is_required, display_order)
SELECT
  (SELECT id FROM service_packages WHERE slug = 'pvt-ltd-incorporation'),
  'inc9_declaration',
  'INC-9 Declaration',
  'Statutory declaration by each director confirming they are not disqualified. CA prepares this - download, sign, and return.',
  true,
  103
WHERE NOT EXISTS (
  SELECT 1 FROM service_document_templates
  WHERE document_key = 'inc9_declaration'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'pvt-ltd-incorporation')
);

-- LLP: LLP-5 Partner Consent Form
INSERT INTO service_document_templates
  (service_package_id, document_key, document_label, description, is_required, display_order)
SELECT
  (SELECT id FROM service_packages WHERE slug = 'llp-incorporation'),
  'llp5_consent',
  'LLP Partner Consent Form (Form LLP-5)',
  'CA prepares one per designated partner. All partners must sign and return before FiLLiP is filed.',
  true,
  102
WHERE NOT EXISTS (
  SELECT 1 FROM service_document_templates
  WHERE document_key = 'llp5_consent'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'llp-incorporation')
);

-- ESI: Specimen Signature Card
INSERT INTO service_document_templates
  (service_package_id, document_key, document_label, description, is_required, display_order)
SELECT
  (SELECT id FROM service_packages WHERE slug = 'esi-registration'),
  'specimen_signature_card',
  'Specimen Signature Card',
  'ESIC requires a specimen signature of the employer. Download the ESIC format, sign in the designated box, and upload.',
  true,
  100
WHERE NOT EXISTS (
  SELECT 1 FROM service_document_templates
  WHERE document_key = 'specimen_signature_card'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'esi-registration')
);

-- PF: Form 2 Nomination
INSERT INTO service_document_templates
  (service_package_id, document_key, document_label, description, is_required, display_order)
SELECT
  (SELECT id FROM service_packages WHERE slug = 'pf-registration'),
  'form_2_nomination',
  'Form 2 - Nomination and Declaration (per employee)',
  'Every PF-enrolled employee must submit Form 2 nominating a family member. We provide the blank form. Collect from each employee and upload as a zip.',
  true,
  100
WHERE NOT EXISTS (
  SELECT 1 FROM service_document_templates
  WHERE document_key = 'form_2_nomination'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'pf-registration')
);

-- PF: Family Declaration Form
INSERT INTO service_document_templates
  (service_package_id, document_key, document_label, description, is_required, display_order)
SELECT
  (SELECT id FROM service_packages WHERE slug = 'pf-registration'),
  'family_declaration_form',
  'Family Details Declaration (per employee)',
  'Family details form required by EPFO for each employee. Collect and upload together.',
  true,
  101
WHERE NOT EXISTS (
  SELECT 1 FROM service_document_templates
  WHERE document_key = 'family_declaration_form'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'pf-registration')
);


-- =============================================================================
-- STEP 10: MISSING QUESTIONNAIRE FIELDS
-- =============================================================================

-- GST: has_existing_gstin
INSERT INTO service_questionnaires
  (service_package_id, question_key, question_label, question_type, options, validation, is_active, is_pre_payment, step_number, display_order)
SELECT
  (SELECT id FROM service_packages WHERE slug = 'gst-registration'),
  'has_existing_gstin',
  'Does your business have an existing or previously cancelled GSTIN?',
  'radio',
  '[{"value": "yes", "label": "Yes"}, {"value": "no", "label": "No"}]'::jsonb,
  '{"required": true}'::jsonb,
  true,
  false,
  1,
  5
WHERE NOT EXISTS (
  SELECT 1 FROM service_questionnaires
  WHERE question_key = 'has_existing_gstin'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'gst-registration')
);

-- GST: existing_gstin (depends on has_existing_gstin)
INSERT INTO service_questionnaires
  (service_package_id, question_key, question_label, question_type, validation, depends_on, is_active, is_pre_payment, step_number, display_order)
SELECT
  (SELECT id FROM service_packages WHERE slug = 'gst-registration'),
  'existing_gstin',
  'Existing / previous GSTIN',
  'text',
  '{"required": true, "pattern": "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"}'::jsonb,
  '{"question_key": "has_existing_gstin", "value": "yes"}'::jsonb,
  true,
  false,
  1,
  6
WHERE NOT EXISTS (
  SELECT 1 FROM service_questionnaires
  WHERE question_key = 'existing_gstin'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'gst-registration')
);

-- IEC: application_purpose
INSERT INTO service_questionnaires
  (service_package_id, question_key, question_label, question_type, options, validation, is_active, is_pre_payment, step_number, display_order)
SELECT
  (SELECT id FROM service_packages WHERE slug = 'iec-code'),
  'application_purpose',
  'Are you applying for a new IEC or modifying an existing one?',
  'select',
  '[{"value": "new", "label": "New IEC Registration"}, {"value": "modification", "label": "Modification of Existing IEC"}]'::jsonb,
  '{"required": true}'::jsonb,
  true,
  false,
  1,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM service_questionnaires
  WHERE question_key = 'application_purpose'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'iec-code')
);

-- IEC: existing_iec (depends on application_purpose)
INSERT INTO service_questionnaires
  (service_package_id, question_key, question_label, question_type, validation, depends_on, is_active, is_pre_payment, step_number, display_order)
SELECT
  (SELECT id FROM service_packages WHERE slug = 'iec-code'),
  'existing_iec',
  'Existing IEC number',
  'text',
  '{"required": true, "minLength": 10, "maxLength": 10}'::jsonb,
  '{"question_key": "application_purpose", "value": "modification"}'::jsonb,
  true,
  false,
  1,
  1
WHERE NOT EXISTS (
  SELECT 1 FROM service_questionnaires
  WHERE question_key = 'existing_iec'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'iec-code')
);

-- Trademark: has_prior_trademarks
INSERT INTO service_questionnaires
  (service_package_id, question_key, question_label, question_type, options, validation, is_active, is_pre_payment, step_number, display_order)
SELECT
  (SELECT id FROM service_packages WHERE slug = 'trademark-registration'),
  'has_prior_trademarks',
  'Do you have any existing trademark registrations in India or abroad?',
  'radio',
  '[{"value": "yes", "label": "Yes"}, {"value": "no", "label": "No"}]'::jsonb,
  '{"required": true}'::jsonb,
  true,
  false,
  1,
  99
WHERE NOT EXISTS (
  SELECT 1 FROM service_questionnaires
  WHERE question_key = 'has_prior_trademarks'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'trademark-registration')
);

-- Trademark: prior_trademark_details (depends on has_prior_trademarks)
INSERT INTO service_questionnaires
  (service_package_id, question_key, question_label, question_type, help_text, depends_on, validation, is_active, is_pre_payment, step_number, display_order)
SELECT
  (SELECT id FROM service_packages WHERE slug = 'trademark-registration'),
  'prior_trademark_details',
  'Details of existing trademarks',
  'textarea',
  'Trademark name, registration number, class, country - one per line. Required for TM-A Section 5.',
  '{"question_key": "has_prior_trademarks", "value": "yes"}'::jsonb,
  '{"required": true}'::jsonb,
  true,
  false,
  1,
  100
WHERE NOT EXISTS (
  SELECT 1 FROM service_questionnaires
  WHERE question_key = 'prior_trademark_details'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'trademark-registration')
);

-- MSME: bank_account_number
INSERT INTO service_questionnaires
  (service_package_id, question_key, question_label, question_type, validation, is_active, is_pre_payment, step_number, display_order)
SELECT
  (SELECT id FROM service_packages WHERE slug = 'msme-registration'),
  'bank_account_number',
  'Bank account number',
  'text',
  '{"required": true, "minLength": 9, "maxLength": 18, "pattern": "^[0-9]+$"}'::jsonb,
  true,
  false,
  3,
  98
WHERE NOT EXISTS (
  SELECT 1 FROM service_questionnaires
  WHERE question_key = 'bank_account_number'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'msme-registration')
);

-- MSME: bank_ifsc
INSERT INTO service_questionnaires
  (service_package_id, question_key, question_label, question_type, validation, is_active, is_pre_payment, step_number, display_order)
SELECT
  (SELECT id FROM service_packages WHERE slug = 'msme-registration'),
  'bank_ifsc',
  'IFSC code',
  'text',
  '{"required": true, "minLength": 11, "maxLength": 11, "pattern": "^[A-Z]{4}0[A-Z0-9]{6}$"}'::jsonb,
  true,
  false,
  3,
  99
WHERE NOT EXISTS (
  SELECT 1 FROM service_questionnaires
  WHERE question_key = 'bank_ifsc'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'msme-registration')
);

-- Pvt Ltd: address_same_as_aadhaar
INSERT INTO service_questionnaires
  (service_package_id, question_key, question_label, question_type, options, help_text, validation, is_active, is_pre_payment, step_number, display_order)
SELECT
  (SELECT id FROM service_packages WHERE slug = 'pvt-ltd-incorporation'),
  'address_same_as_aadhaar',
  'Is your current residential address the same as on your Aadhaar card?',
  'radio',
  '[{"value": "yes", "label": "Yes"}, {"value": "no", "label": "No"}]'::jsonb,
  'If yes, your Aadhaar serves as address proof. No separate upload needed.',
  '{"required": true}'::jsonb,
  true,
  false,
  5,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM service_questionnaires
  WHERE question_key = 'address_same_as_aadhaar'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'pvt-ltd-incorporation')
);

-- LLP: address_same_as_aadhaar
INSERT INTO service_questionnaires
  (service_package_id, question_key, question_label, question_type, options, help_text, validation, is_active, is_pre_payment, step_number, display_order)
SELECT
  (SELECT id FROM service_packages WHERE slug = 'llp-incorporation'),
  'address_same_as_aadhaar',
  'Is your current residential address the same as on your Aadhaar card?',
  'radio',
  '[{"value": "yes", "label": "Yes"}, {"value": "no", "label": "No"}]'::jsonb,
  'If yes, your Aadhaar serves as address proof. No separate upload needed.',
  '{"required": true}'::jsonb,
  true,
  false,
  5,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM service_questionnaires
  WHERE question_key = 'address_same_as_aadhaar'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'llp-incorporation')
);

-- Partnership: address_same_as_aadhaar
INSERT INTO service_questionnaires
  (service_package_id, question_key, question_label, question_type, options, help_text, validation, is_active, is_pre_payment, step_number, display_order)
SELECT
  (SELECT id FROM service_packages WHERE slug = 'partnership-registration'),
  'address_same_as_aadhaar',
  'Is your current residential address the same as on your Aadhaar card?',
  'radio',
  '[{"value": "yes", "label": "Yes"}, {"value": "no", "label": "No"}]'::jsonb,
  'If yes, your Aadhaar serves as address proof. No separate upload needed.',
  '{"required": true}'::jsonb,
  true,
  false,
  3,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM service_questionnaires
  WHERE question_key = 'address_same_as_aadhaar'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'partnership-registration')
);
