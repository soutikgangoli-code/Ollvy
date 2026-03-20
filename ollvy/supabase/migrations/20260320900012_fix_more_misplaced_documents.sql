-- =============================================================================
-- Migration: Fix More Misplaced Documents
-- Moves Ollvy-provided forms from initial_documents to work_documents
-- Rule: If "Will be provided for signature" + has template_url = work_document
-- =============================================================================

-- =============================================================================
-- 1. Remove signed_tm_form from service_document_templates (trademark-registration)
--    This is Ollvy-provided (TM-A form), customer signs and returns
-- =============================================================================

DELETE FROM service_document_templates
WHERE document_key = 'signed_tm_form'
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'trademark-registration');

-- =============================================================================
-- 2. Remove dpin_form from service_document_templates (llp-incorporation)
--    This is Ollvy-provided (DPIN application form), partner signs and returns
-- =============================================================================

DELETE FROM service_document_templates
WHERE document_key = 'dpin_form'
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'llp-incorporation');

-- =============================================================================
-- 3. Add TM-A Form to work_document_templates for trademark-registration
--    (to_customer: blank form, from_customer: signed form)
-- =============================================================================

-- TM-A Form (to_customer) - professional provides blank form to customer
INSERT INTO service_work_document_templates (
  service_package_id,
  stage_key,
  direction,
  document_key,
  document_label,
  description,
  display_order
)
SELECT
  sp.id,
  'tm_application_filed',
  'to_customer'::work_document_direction,
  'tm_a_form',
  'TM-A Authorization Form',
  'Trademark authorization form (Form TM-A) allowing us to file and prosecute the trademark application on your behalf. Download, print, sign (signature should match your ID proof), and return the signed copy.',
  0  -- Display first
FROM service_packages sp
WHERE sp.slug = 'trademark-registration'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- TM-A Form Signed (from_customer) - customer returns signed form
INSERT INTO service_work_document_templates (
  service_package_id,
  stage_key,
  direction,
  document_key,
  document_label,
  description,
  display_order
)
SELECT
  sp.id,
  'tm_application_filed',
  'from_customer'::work_document_direction,
  'tm_a_form_signed',
  'Signed TM-A Authorization Form',
  'Upload the signed TM-A authorization form. Sign in blue or black ink with your regular signature (matching your ID proof). Clear scan required.',
  1  -- Display after the template
FROM service_packages sp
WHERE sp.slug = 'trademark-registration'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- =============================================================================
-- 4. Add DPIN Form to work_document_templates for llp-incorporation
--    (to_customer: blank form, from_customer: signed form)
-- =============================================================================

-- DPIN Application Form (to_customer) - professional provides blank form
INSERT INTO service_work_document_templates (
  service_package_id,
  stage_key,
  direction,
  document_key,
  document_label,
  description,
  display_order
)
SELECT
  sp.id,
  'dpin_applied',
  'to_customer'::work_document_direction,
  'dpin_application_form',
  'DPIN Application Form',
  'Designated Partner Identification Number application form. Each designated partner must fill in their details, sign, and return. Required before we can apply for DPIN on the MCA portal.',
  3  -- Display after DSC auth forms
FROM service_packages sp
WHERE sp.slug = 'llp-incorporation'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- DPIN Application Form Signed (from_customer) - partner returns signed form
INSERT INTO service_work_document_templates (
  service_package_id,
  stage_key,
  direction,
  document_key,
  document_label,
  description,
  display_order
)
SELECT
  sp.id,
  'dpin_applied',
  'from_customer'::work_document_direction,
  'dpin_application_form_signed',
  'Signed DPIN Application Form',
  'Upload the signed DPIN application form for each designated partner. Ensure all fields are filled correctly and signature matches ID proof.',
  4  -- Display after the template
FROM service_packages sp
WHERE sp.slug = 'llp-incorporation'
ON CONFLICT (service_package_id, document_key) DO NOTHING;
