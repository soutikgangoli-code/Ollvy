-- =============================================================================
-- Migration: Fix Document Placements and Add Missing Work Documents
-- Documents that CA provides as templates need to be in service_work_document_templates
-- with direction = 'to_customer', not in service_document_templates
-- =============================================================================

-- First, add condition column to service_work_document_templates if it doesn't exist
ALTER TABLE service_work_document_templates
ADD COLUMN IF NOT EXISTS condition JSONB DEFAULT NULL;

COMMENT ON COLUMN service_work_document_templates.condition IS
'Conditional display logic based on questionnaire answers.
Format: {"question_key": "...", "operator": "...", "value": "..."}.
If null, document always shows. If condition evaluates to false, document is hidden.';

-- =============================================================================
-- FIX 1: Move documents from service_document_templates to service_work_document_templates
-- These are documents CA provides as fillable templates (direction: to_customer)
-- =============================================================================

-- Delete from initial documents (wrong table)
DELETE FROM service_document_templates
WHERE document_key IN ('dir2_consent', 'inc9_declaration')
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'pvt-ltd-incorporation');

DELETE FROM service_document_templates
WHERE document_key = 'llp5_consent'
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'llp-incorporation');

DELETE FROM service_document_templates
WHERE document_key IN ('form_2_nomination', 'family_declaration_form')
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'pf-registration');

DELETE FROM service_document_templates
WHERE document_key = 'specimen_signature_card'
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'esi-registration');

-- Insert into work documents (correct table)
INSERT INTO service_work_document_templates
  (service_package_id, stage_key, direction, document_key, document_label, description, display_order)
SELECT
  (SELECT id FROM service_packages WHERE slug = 'pvt-ltd-incorporation'),
  'spice_filed',
  'to_customer',
  'dir2_consent',
  'DIR-2 Consent to Act as Director',
  'Consent form required from each director. Download the template, sign, and upload.',
  102
WHERE NOT EXISTS (
  SELECT 1 FROM service_work_document_templates
  WHERE document_key = 'dir2_consent'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'pvt-ltd-incorporation')
);

INSERT INTO service_work_document_templates
  (service_package_id, stage_key, direction, document_key, document_label, description, display_order)
SELECT
  (SELECT id FROM service_packages WHERE slug = 'pvt-ltd-incorporation'),
  'spice_filed',
  'to_customer',
  'inc9_declaration',
  'INC-9 Declaration',
  'Statutory declaration by each director confirming they are not disqualified. Download, sign, and return.',
  103
WHERE NOT EXISTS (
  SELECT 1 FROM service_work_document_templates
  WHERE document_key = 'inc9_declaration'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'pvt-ltd-incorporation')
);

INSERT INTO service_work_document_templates
  (service_package_id, stage_key, direction, document_key, document_label, description, display_order)
SELECT
  (SELECT id FROM service_packages WHERE slug = 'llp-incorporation'),
  'fillip_filed',
  'to_customer',
  'llp5_consent',
  'LLP Partner Consent Form (Form LLP-5)',
  'CA prepares one per designated partner. All partners must sign and return before FiLLiP is filed.',
  102
WHERE NOT EXISTS (
  SELECT 1 FROM service_work_document_templates
  WHERE document_key = 'llp5_consent'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'llp-incorporation')
);

INSERT INTO service_work_document_templates
  (service_package_id, stage_key, direction, document_key, document_label, description, display_order)
SELECT
  (SELECT id FROM service_packages WHERE slug = 'pf-registration'),
  'registration_certificate',
  'to_customer',
  'form_2_nomination',
  'Form 2 - Nomination and Declaration (per employee)',
  'Every PF-enrolled employee must submit Form 2 nominating a family member. Download the form, collect from each employee, and upload as a zip.',
  100
WHERE NOT EXISTS (
  SELECT 1 FROM service_work_document_templates
  WHERE document_key = 'form_2_nomination'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'pf-registration')
);

INSERT INTO service_work_document_templates
  (service_package_id, stage_key, direction, document_key, document_label, description, display_order)
SELECT
  (SELECT id FROM service_packages WHERE slug = 'pf-registration'),
  'registration_certificate',
  'to_customer',
  'family_declaration_form',
  'Family Details Declaration (per employee)',
  'Family details form required by EPFO for each employee. Collect and upload together.',
  101
WHERE NOT EXISTS (
  SELECT 1 FROM service_work_document_templates
  WHERE document_key = 'family_declaration_form'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'pf-registration')
);

INSERT INTO service_work_document_templates
  (service_package_id, stage_key, direction, document_key, document_label, description, display_order)
SELECT
  (SELECT id FROM service_packages WHERE slug = 'esi-registration'),
  'application_filed',
  'to_customer',
  'specimen_signature_card',
  'Specimen Signature Card',
  'ESIC requires a specimen signature of the employer. Download the ESIC format, sign in the designated box, and upload.',
  100
WHERE NOT EXISTS (
  SELECT 1 FROM service_work_document_templates
  WHERE document_key = 'specimen_signature_card'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'esi-registration')
);


-- =============================================================================
-- FIX 2: Delete redundant partnership deed draft input
-- =============================================================================

DELETE FROM service_document_templates
WHERE document_key = 'partnership_deed_draft_input'
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'partnership-registration');


-- =============================================================================
-- FIX 3: Update IEC board resolution - direction to 'to_customer'
-- =============================================================================

UPDATE service_work_document_templates
SET direction = 'to_customer',
    document_label = 'Board Resolution - Fillable Template',
    description = 'CA provides a pre-drafted board resolution authorizing the named individual to apply for IEC. Download, have authorized director(s) sign on company letterhead, and upload the signed copy.'
WHERE document_key = 'board_resolution_signed'
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'iec-code');


-- =============================================================================
-- FIX 4: Update MCA annual filing DSC authorization - direction to 'to_customer'
-- =============================================================================

UPDATE service_work_document_templates
SET direction = 'to_customer',
    document_label = 'DSC Authorization Letter - Fillable Template',
    description = 'Pre-drafted authorization for the director whose DSC signs AOC-4 and MGT-7. Download, sign on company letterhead, and upload.'
WHERE document_key = 'director_dsc_authorization'
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'mca-annual-filing');


-- =============================================================================
-- FIX 5: Add missing NOC template and DSC authorization template for Pvt Ltd and LLP
-- =============================================================================

-- Pvt Ltd: NOC template
INSERT INTO service_work_document_templates
  (service_package_id, stage_key, direction, document_key, document_label, description, condition, display_order)
SELECT
  (SELECT id FROM service_packages WHERE slug = 'pvt-ltd-incorporation'),
  'spice_filed',
  'to_customer',
  'noc_template',
  'NOC from Property Owner - Fillable Template',
  'Our CA provides a pre-filled NOC template. Have your landlord fill in their details and sign. Upload the signed copy back here.',
  '{"question_key": "premises_type", "operator": "not_equals", "value": "owned"}'::jsonb,
  100
WHERE NOT EXISTS (
  SELECT 1 FROM service_work_document_templates
  WHERE document_key = 'noc_template'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'pvt-ltd-incorporation')
);

-- Pvt Ltd: DSC authorization template
INSERT INTO service_work_document_templates
  (service_package_id, stage_key, direction, document_key, document_label, description, display_order)
SELECT
  (SELECT id FROM service_packages WHERE slug = 'pvt-ltd-incorporation'),
  'dsc_applied',
  'to_customer',
  'dsc_authorization_template',
  'DSC Authorization Letter - Fillable Template',
  'Pre-drafted DSC authorization for each director. Download, sign on company letterhead, and return.',
  101
WHERE NOT EXISTS (
  SELECT 1 FROM service_work_document_templates
  WHERE document_key = 'dsc_authorization_template'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'pvt-ltd-incorporation')
);

-- LLP: NOC template
INSERT INTO service_work_document_templates
  (service_package_id, stage_key, direction, document_key, document_label, description, condition, display_order)
SELECT
  (SELECT id FROM service_packages WHERE slug = 'llp-incorporation'),
  'fillip_filed',
  'to_customer',
  'noc_template',
  'NOC from Property Owner - Fillable Template',
  'Our CA provides a pre-filled NOC template. Have your landlord fill in their details and sign. Upload the signed copy back here.',
  '{"question_key": "premises_type", "operator": "not_equals", "value": "owned"}'::jsonb,
  100
WHERE NOT EXISTS (
  SELECT 1 FROM service_work_document_templates
  WHERE document_key = 'noc_template'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'llp-incorporation')
);

-- LLP: DSC authorization template
INSERT INTO service_work_document_templates
  (service_package_id, stage_key, direction, document_key, document_label, description, display_order)
SELECT
  (SELECT id FROM service_packages WHERE slug = 'llp-incorporation'),
  'dpin_applied',
  'to_customer',
  'dsc_authorization_template',
  'DSC Authorization Letter - Fillable Template',
  'Pre-drafted DSC authorization for each partner. Download, sign, and return.',
  101
WHERE NOT EXISTS (
  SELECT 1 FROM service_work_document_templates
  WHERE document_key = 'dsc_authorization_template'
  AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'llp-incorporation')
);
