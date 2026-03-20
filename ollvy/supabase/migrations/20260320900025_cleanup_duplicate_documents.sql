-- =============================================================================
-- Migration: Cleanup Duplicate Documents
-- Removes overlapping/duplicate document templates from MCA Annual Filing
-- =============================================================================

-- Remove duplicates from MCA Annual Filing (mca-annual-filing)
DELETE FROM service_document_templates
WHERE service_package_id = (SELECT id FROM service_packages WHERE slug = 'mca-annual-filing')
AND document_key IN (
  'financial_statements',  -- Duplicate of audited_financials
  'boards_report',         -- Duplicate of director_report
  'agm_minutes',           -- Overlaps with agm_notice
  'llp_form11_data'        -- LLP-specific, shouldn't be on company service
);

-- Also check and remove any duplicates we may have created in other services
-- Remove duplicate audited_financials if both exist
DELETE FROM service_document_templates sdt1
WHERE sdt1.document_key = 'audited_financials'
AND EXISTS (
  SELECT 1 FROM service_document_templates sdt2
  WHERE sdt2.service_package_id = sdt1.service_package_id
  AND sdt2.document_key = 'financial_statements'
  AND sdt2.id < sdt1.id
);
