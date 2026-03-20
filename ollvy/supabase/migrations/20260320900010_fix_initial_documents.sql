-- =============================================================================
-- Migration: Fix Initial Documents Configuration
-- Removes DSC Authorization Letter from initial_documents for Pvt Ltd
-- DSC Auth is Ollvy-provided, so it belongs in work_documents (to_customer)
-- =============================================================================

-- Remove dsc_auth from service_document_templates for pvt-ltd-incorporation
-- This document is Ollvy-provided (we give it to customer), not customer-uploaded
DELETE FROM service_document_templates
WHERE document_key = 'dsc_auth'
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'pvt-ltd-incorporation');

-- Add DSC Authorization Letter to work_document_templates for pvt-ltd-incorporation
-- as a to_customer document (professional provides to customer for signature)
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
  'dsc_applied',
  'to_customer'::work_document_direction,
  'dsc_auth_letter',
  'DSC Authorization Letter',
  'Authorization letter template for procuring Digital Signature Certificate on your behalf. Download, print, sign with the same signature as your specimen signature, and return the signed copy.',
  0  -- Display before the DSC Application Form
FROM service_packages sp
WHERE sp.slug = 'pvt-ltd-incorporation'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- Also add from_customer version for the signed letter
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
  'dsc_applied',
  'from_customer'::work_document_direction,
  'dsc_auth_letter_signed',
  'Signed DSC Authorization Letter',
  'Upload the signed DSC Authorization Letter for each director. Sign in blue ink and ensure date is current.',
  1  -- Display after the template
FROM service_packages sp
WHERE sp.slug = 'pvt-ltd-incorporation'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- Do the same for OPC (also needs DSC auth)
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
  'dsc_applied',
  'to_customer'::work_document_direction,
  'dsc_auth_letter',
  'DSC Authorization Letter',
  'Authorization letter template for procuring Digital Signature Certificate on your behalf. Download, print, sign with the same signature as your specimen signature, and return the signed copy.',
  0
FROM service_packages sp
WHERE sp.slug = 'opc-incorporation'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

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
  'dsc_applied',
  'from_customer'::work_document_direction,
  'dsc_auth_letter_signed',
  'Signed DSC Authorization Letter',
  'Upload the signed DSC Authorization Letter. Sign in blue ink and ensure date is current.',
  1
FROM service_packages sp
WHERE sp.slug = 'opc-incorporation'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- Do the same for LLP (also needs DSC auth for designated partners)
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
  'dsc_auth_letter',
  'DSC Authorization Letter',
  'Authorization letter template for procuring Digital Signature Certificate for each designated partner. Download, print, sign with the same signature as your specimen signature, and return the signed copy.',
  0
FROM service_packages sp
WHERE sp.slug = 'llp-incorporation'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

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
  'dsc_auth_letter_signed',
  'Signed DSC Authorization Letter',
  'Upload the signed DSC Authorization Letter for each designated partner. Sign in blue ink and ensure date is current.',
  1
FROM service_packages sp
WHERE sp.slug = 'llp-incorporation'
ON CONFLICT (service_package_id, document_key) DO NOTHING;
