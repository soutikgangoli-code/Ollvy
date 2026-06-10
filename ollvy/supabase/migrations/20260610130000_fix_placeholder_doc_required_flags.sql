-- Fix placeholder document required-flags on service_document_templates.
--
-- Six services had ALL their documents flagged is_required = false (placeholder
-- seed), which wrongly showed necessary documents as "Optional" and left the
-- incomplete-order reminder with nothing to list. This marks the genuinely
-- necessary documents as required; the truly conditional ones stay optional
-- (Constitution Document, Rent Agreement, NOC, Water Test Report, etc.).
--
-- Documents remain SKIPPABLE in the upload UI regardless of this flag — this
-- only controls labelling and what the reminder enumerates.
--
-- Forward-looking: affects documents seeded onto NEW orders. In-flight orders'
-- order_documents rows are intentionally left untouched so their completion
-- state cannot shift.

-- Helper pattern: flip is_required = true for the named docs on a given service.

-- GST Registration
UPDATE service_document_templates SET is_required = true
WHERE service_package_id = (SELECT id FROM service_packages WHERE slug = 'gst-registration')
  AND document_label IN ('PAN Card', 'Aadhaar Card', 'Passport Photograph', 'Address Proof', 'Bank Statement (First Page)');

-- Private Limited Incorporation
UPDATE service_document_templates SET is_required = true
WHERE service_package_id = (SELECT id FROM service_packages WHERE slug = 'pvt-ltd-incorporation')
  AND document_label IN (
    'PAN Card (Director 1)', 'Aadhaar Card (Director 1)', 'Passport Photo (Director 1)', 'Specimen Signature (Director 1)', 'Address Proof (Director 1)',
    'PAN Card (Director 2)', 'Aadhaar Card (Director 2)', 'Passport Photo (Director 2)', 'Specimen Signature (Director 2)', 'Address Proof (Director 2)',
    'Utility Bill (Registered Office)');

-- LLP Incorporation
UPDATE service_document_templates SET is_required = true
WHERE service_package_id = (SELECT id FROM service_packages WHERE slug = 'llp-incorporation')
  AND document_label IN (
    'PAN Card (Partner 1)', 'Aadhaar Card (Partner 1)', 'Passport Photo (Partner 1)', 'Address Proof (Partner 1)',
    'PAN Card (Partner 2)', 'Aadhaar Card (Partner 2)', 'Passport Photo (Partner 2)', 'Address Proof (Partner 2)',
    'Utility Bill (Registered Office)');

-- Trademark Registration
UPDATE service_document_templates SET is_required = true
WHERE service_package_id = (SELECT id FROM service_packages WHERE slug = 'trademark-registration')
  AND document_label IN ('Trademark Logo/Wordmark', 'PAN Card', 'Address Proof');

-- FSSAI License
UPDATE service_document_templates SET is_required = true
WHERE service_package_id = (SELECT id FROM service_packages WHERE slug = 'fssai-license')
  AND document_label IN ('PAN Card', 'Aadhaar Card', 'Passport Photograph', 'Kitchen/Food Area Layout');

-- Cloud Kitchen Setup
UPDATE service_document_templates SET is_required = true
WHERE service_package_id = (SELECT id FROM service_packages WHERE slug = 'cloud-kitchen-setup')
  AND document_label IN ('PAN Card', 'Aadhaar Card', 'Passport Photograph', 'Kitchen Address Proof', 'Bank Statement (First Page)', 'Kitchen Layout Plan', 'Menu/Food Items List');
