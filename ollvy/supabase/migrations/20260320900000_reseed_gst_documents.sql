-- Re-seed GST Registration document templates (in case they were missing)

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
  ('pan_card', 'PAN Card', 'Business PAN or Proprietor PAN', 'doc_collection', true, 1, ARRAY['For proprietorship, use personal PAN', 'For company/LLP, use business PAN'], NULL),
  ('aadhaar', 'Aadhaar Card', 'Authorized signatory Aadhaar', 'doc_collection', true, 2, ARRAY['Must be linked for OTP authentication', 'Mobile number should be active'], NULL),
  ('photograph', 'Passport Photograph', 'Recent photograph of authorized signatory', 'doc_collection', true, 3, ARRAY['White or light background', 'JPEG format preferred'], NULL),
  ('address_proof', 'Address Proof', 'Current residential address proof', 'doc_collection', true, 4, ARRAY['Utility bill, bank statement, or rent agreement', 'Must be less than 60 days old'], NULL),
  ('bank_statement', 'Bank Statement (First Page)', 'Bank account showing name and account number', 'doc_collection', true, 5, ARRAY['First page with account details', 'Should show business name or proprietor name'], NULL),
  ('constitution_doc', 'Constitution Document', 'COI for company, Partnership deed for firm', 'doc_collection', true, 6, ARRAY['For proprietorship - not required', 'For LLP - LLP Agreement'], NULL),
  ('utility_bill', 'Utility Bill (Business Premises)', 'Electricity/gas bill for business location', 'doc_collection', true, 7, ARRAY['Must be less than 60 days old', 'Address should match application'], NULL),
  ('rent_agreement', 'Rent Agreement', 'If premises is rented', 'doc_collection', false, 8, ARRAY['With NOC from landlord', 'Should be currently valid'], NULL)
) AS dt(document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
WHERE sp.slug = 'gst-registration'
ON CONFLICT (service_package_id, document_key) DO NOTHING;
