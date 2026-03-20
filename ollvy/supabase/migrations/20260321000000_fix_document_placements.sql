-- =============================================================================
-- Migration: Fix Document Placements
-- Fixes documents incorrectly placed in initial_documents that should be in
-- work_documents (CA provides template, customer signs and returns)
--
-- Issues Fixed:
-- 1. NOC from Owner - Move to work_documents for Pvt Ltd, LLP, OPC
-- 2. Board Resolution - Move to work_documents for ROC, ESI, PF; Add template for IEC
-- 3. Partnership Deed Draft Input - Remove redundant initial_document
-- =============================================================================

-- =============================================================================
-- ISSUE 1: NOC from Owner - Move from initial_documents to work_documents
-- NOC is a template CA provides, customer gets landlord to sign, returns signed copy
-- =============================================================================

-- 1a. Remove NOC from initial_documents for Pvt Ltd, LLP, OPC
DELETE FROM service_document_templates
WHERE document_key IN ('noc_owner', 'noc_landlord')
AND service_package_id IN (
  SELECT id FROM service_packages
  WHERE slug IN ('pvt-ltd-incorporation', 'llp-incorporation', 'opc-incorporation')
);

-- 1b. Add NOC as work documents for Pvt Ltd (to_customer + from_customer pair)
INSERT INTO service_work_document_templates (service_package_id, stage_key, direction, document_key, document_label, description, display_order)
SELECT
  sp.id,
  'doc_collection',
  'to_customer'::work_document_direction,
  'noc_template',
  'NOC from Owner Template',
  'Download this No Objection Certificate template. Get the property owner/landlord to sign it and upload the signed copy. The NOC authorizes use of the premises as your registered office.',
  20
FROM service_packages sp
WHERE sp.slug = 'pvt-ltd-incorporation'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

INSERT INTO service_work_document_templates (service_package_id, stage_key, direction, document_key, document_label, description, display_order)
SELECT
  sp.id,
  'doc_collection',
  'from_customer'::work_document_direction,
  'noc_signed',
  'Signed NOC from Owner',
  'Upload the NOC signed by the property owner/landlord. Ensure the owner has signed and dated the document.',
  21
FROM service_packages sp
WHERE sp.slug = 'pvt-ltd-incorporation'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- 1c. Add NOC as work documents for LLP
INSERT INTO service_work_document_templates (service_package_id, stage_key, direction, document_key, document_label, description, display_order)
SELECT
  sp.id,
  'doc_collection',
  'to_customer'::work_document_direction,
  'noc_template',
  'NOC from Owner Template',
  'Download this No Objection Certificate template. Get the property owner/landlord to sign it and upload the signed copy. The NOC authorizes use of the premises as your registered office.',
  20
FROM service_packages sp
WHERE sp.slug = 'llp-incorporation'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

INSERT INTO service_work_document_templates (service_package_id, stage_key, direction, document_key, document_label, description, display_order)
SELECT
  sp.id,
  'doc_collection',
  'from_customer'::work_document_direction,
  'noc_signed',
  'Signed NOC from Owner',
  'Upload the NOC signed by the property owner/landlord. Ensure the owner has signed and dated the document.',
  21
FROM service_packages sp
WHERE sp.slug = 'llp-incorporation'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- 1d. Add NOC as work documents for OPC
INSERT INTO service_work_document_templates (service_package_id, stage_key, direction, document_key, document_label, description, display_order)
SELECT
  sp.id,
  'doc_collection',
  'to_customer'::work_document_direction,
  'noc_template',
  'NOC from Owner Template',
  'Download this No Objection Certificate template. Get the property owner/landlord to sign it and upload the signed copy. The NOC authorizes use of the premises as your registered office.',
  20
FROM service_packages sp
WHERE sp.slug = 'opc-incorporation'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

INSERT INTO service_work_document_templates (service_package_id, stage_key, direction, document_key, document_label, description, display_order)
SELECT
  sp.id,
  'doc_collection',
  'from_customer'::work_document_direction,
  'noc_signed',
  'Signed NOC from Owner',
  'Upload the NOC signed by the property owner/landlord. Ensure the owner has signed and dated the document.',
  21
FROM service_packages sp
WHERE sp.slug = 'opc-incorporation'
ON CONFLICT (service_package_id, document_key) DO NOTHING;


-- =============================================================================
-- ISSUE 2: Board Resolution - Move from initial_documents to work_documents
-- Board Resolution is a template CA provides, customer gets directors to sign
-- =============================================================================

-- 2a. Remove Board Resolution from initial_documents for ROC Changes
DELETE FROM service_document_templates
WHERE document_key = 'board_resolution'
AND service_package_id IN (
  SELECT id FROM service_packages
  WHERE slug = 'roc-changes'
);

-- 2b. Add Board Resolution as work documents for ROC Changes
INSERT INTO service_work_document_templates (service_package_id, stage_key, direction, document_key, document_label, description, display_order)
SELECT
  sp.id,
  'document_collection',
  'to_customer'::work_document_direction,
  'board_resolution_template',
  'Board Resolution Template',
  'Download this board resolution template for the proposed change. Get it signed by authorized directors and upload the signed copy.',
  1
FROM service_packages sp
WHERE sp.slug = 'roc-changes'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

INSERT INTO service_work_document_templates (service_package_id, stage_key, direction, document_key, document_label, description, display_order)
SELECT
  sp.id,
  'document_collection',
  'from_customer'::work_document_direction,
  'board_resolution_signed',
  'Signed Board Resolution',
  'Upload the board resolution signed by authorized directors. Include certified true copy signed by Company Secretary or Director.',
  2
FROM service_packages sp
WHERE sp.slug = 'roc-changes'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- 2c. Remove Board Resolution from initial_documents for ESI Registration
DELETE FROM service_document_templates
WHERE document_key = 'board_resolution'
AND service_package_id IN (
  SELECT id FROM service_packages
  WHERE slug = 'esi-registration'
);

-- 2d. Add Board Resolution as work documents for ESI Registration
INSERT INTO service_work_document_templates (service_package_id, stage_key, direction, document_key, document_label, description, display_order)
SELECT
  sp.id,
  'application_filed',
  'to_customer'::work_document_direction,
  'board_resolution_template',
  'Board Resolution Template',
  'Download this board resolution template authorizing ESI registration. Get it signed by authorized directors and upload the signed copy.',
  0
FROM service_packages sp
WHERE sp.slug = 'esi-registration'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

INSERT INTO service_work_document_templates (service_package_id, stage_key, direction, document_key, document_label, description, display_order)
SELECT
  sp.id,
  'application_filed',
  'from_customer'::work_document_direction,
  'board_resolution_signed',
  'Signed Board Resolution',
  'Upload the board resolution signed by authorized directors authorizing ESI registration and naming the signatory.',
  1
FROM service_packages sp
WHERE sp.slug = 'esi-registration'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- 2e. Remove Board Resolution from initial_documents for PF Registration
DELETE FROM service_document_templates
WHERE document_key = 'board_resolution'
AND service_package_id IN (
  SELECT id FROM service_packages
  WHERE slug = 'pf-registration'
);

-- 2f. Add Board Resolution as work documents for PF Registration
INSERT INTO service_work_document_templates (service_package_id, stage_key, direction, document_key, document_label, description, display_order)
SELECT
  sp.id,
  'application_filed',
  'to_customer'::work_document_direction,
  'board_resolution_template',
  'Board Resolution Template',
  'Download this board resolution template authorizing PF/EPFO registration. Get it signed by authorized directors and upload the signed copy.',
  0
FROM service_packages sp
WHERE sp.slug = 'pf-registration'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

INSERT INTO service_work_document_templates (service_package_id, stage_key, direction, document_key, document_label, description, display_order)
SELECT
  sp.id,
  'application_filed',
  'from_customer'::work_document_direction,
  'board_resolution_signed',
  'Signed Board Resolution',
  'Upload the board resolution signed by authorized directors authorizing PF registration and naming the signatory.',
  1
FROM service_packages sp
WHERE sp.slug = 'pf-registration'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- 2g. Fix IEC Board Resolution: Add to_customer template before existing from_customer
-- (IEC already has from_customer 'board_resolution_signed' but missing to_customer template)
INSERT INTO service_work_document_templates (service_package_id, stage_key, direction, document_key, document_label, description, display_order)
SELECT
  sp.id,
  'application_filed',
  'to_customer'::work_document_direction,
  'board_resolution_template',
  'Board Resolution Template',
  'Download this board resolution template authorizing IEC application. Get it signed by directors and upload the signed copy.',
  1
FROM service_packages sp
WHERE sp.slug = 'iec-code'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- Also remove board_resolution from initial_documents for IEC if it exists
DELETE FROM service_document_templates
WHERE document_key = 'board_resolution'
AND service_package_id IN (
  SELECT id FROM service_packages
  WHERE slug = 'iec-code'
);


-- =============================================================================
-- ISSUE 4: Partnership Deed Draft Input - Remove redundant initial_document
-- Work documents already have deed_drafting with to_customer and from_customer
-- =============================================================================

DELETE FROM service_document_templates
WHERE document_key = 'deed_draft_input'
AND service_package_id IN (
  SELECT id FROM service_packages
  WHERE slug = 'partnership-registration'
);


-- =============================================================================
-- SUMMARY OF CHANGES:
--
-- 1. NOC from Owner:
--    - Removed from initial_documents for: pvt-ltd-incorporation, llp-incorporation, opc-incorporation
--    - Added to work_documents as to_customer (noc_template) + from_customer (noc_signed)
--
-- 2. Board Resolution:
--    - Removed from initial_documents for: roc-changes, esi-registration, pf-registration, iec-code
--    - Added to work_documents as to_customer (board_resolution_template) + from_customer (board_resolution_signed)
--    - For IEC: Added missing to_customer template
--
-- 3. Partnership Deed Draft Input:
--    - Removed from initial_documents (redundant - work_documents already handles deed drafting flow)
--
-- NOTE: DSC Authorization Letter was already fixed in migration 20260320900010_fix_initial_documents.sql
-- =============================================================================
