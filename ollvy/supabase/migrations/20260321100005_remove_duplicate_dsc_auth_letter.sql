-- =============================================================================
-- Migration: Remove duplicate dsc_auth_letter documents
-- Both dsc_auth_letter and dsc_authorization_template serve the same purpose
-- Keep dsc_authorization_template (better description), delete dsc_auth_letter
-- Rename dsc_auth_letter_signed to pair with dsc_authorization_template
-- =============================================================================

-- Delete duplicate to_customer template for Pvt Ltd
DELETE FROM service_work_document_templates
WHERE document_key = 'dsc_auth_letter'
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'pvt-ltd-incorporation');

-- Delete duplicate to_customer template for LLP
DELETE FROM service_work_document_templates
WHERE document_key = 'dsc_auth_letter'
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'llp-incorporation');

-- Rename the from_customer document to pair with dsc_authorization_template
UPDATE service_work_document_templates
SET document_key = 'dsc_authorization_signed',
    document_label = 'Signed DSC Authorization Letter',
    description = 'Upload the signed DSC Authorization Letter for each director. Sign on company letterhead and ensure date is current.'
WHERE document_key = 'dsc_auth_letter_signed'
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'pvt-ltd-incorporation');

UPDATE service_work_document_templates
SET document_key = 'dsc_authorization_signed',
    document_label = 'Signed DSC Authorization Letter',
    description = 'Upload the signed DSC Authorization Letter for each partner. Sign and ensure date is current.'
WHERE document_key = 'dsc_auth_letter_signed'
AND service_package_id = (SELECT id FROM service_packages WHERE slug = 'llp-incorporation');
