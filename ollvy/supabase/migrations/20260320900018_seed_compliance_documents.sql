-- =============================================================================
-- Migration: Seed Documents for Compliance Services
-- Adds initial and work documents for: mca-annual-filing, roc-changes
-- =============================================================================

-- =============================================================================
-- 1. MCA Annual Filing Initial Documents
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
  ('financial_statements', 'Audited Financial Statements', 'Balance Sheet, P&L, Cash Flow, Notes - signed by directors and auditor', 'doc_collection', true, 1, ARRAY['Includes schedules', 'Signed by directors and auditor', 'PDF format preferred'], NULL),
  ('auditors_report', 'Auditor''s Report', 'Statutory auditor''s report on the financial statements', 'doc_collection', true, 2, ARRAY['Signed by auditor', 'Include annexures if any'], NULL),
  ('boards_report', 'Board''s Report', 'Directors'' report including all mandatory disclosures', 'doc_collection', true, 3, ARRAY['We help draft this', 'Includes all statutory annexures'], 'https://templates.ollvy.in/boards-report-template.pdf'),
  ('shareholder_list', 'List of Shareholders as on 31st March', 'Name, PAN, address, number of shares for all shareholders', 'doc_collection', true, 4, ARRAY['Required for MGT-7 filing', 'Include demat account details'], NULL),
  ('director_list', 'List of Directors / Partners with DIN', 'Name, DIN, date of appointment, designation for all directors', 'doc_collection', true, 5, ARRAY['Include DPIN for LLP partners', 'Current as of 31st March'], NULL),
  ('agm_minutes', 'Minutes of AGM', 'Signed minutes of the Annual General Meeting', 'doc_collection', false, 6, ARRAY['Required for companies', 'LLPs do not have AGM'], NULL),
  ('dsc', 'DSC of Director / Designated Partner', 'Class 3 Digital Signature Certificate for signing MCA forms', 'doc_collection', true, 7, ARRAY['For signing AOC-4 and MGT-7', 'Must be valid and not expired'], NULL),
  ('previous_filings', 'Previous Year Filed Returns', 'AOC-4 and MGT-7 from previous year', 'doc_collection', false, 8, ARRAY['Required if first time using our service', 'To check continuity'], NULL),
  ('llp_form11_data', 'LLP Form 11 Data', 'Partners, contribution, profit sharing details for LLP', 'doc_collection', false, 9, ARRAY['Required only for LLPs', 'Excel or PDF format'], NULL)
) AS dt(document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
WHERE sp.slug = 'mca-annual-filing'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- =============================================================================
-- 2. ROC Changes (Registered Office Change) Initial Documents
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
  ('board_resolution', 'Board Resolution for Address Change', 'Certified true copy of board meeting minutes approving address change', 'doc_collection', true, 1, ARRAY['Must be signed by directors', 'Include date and resolution number'], 'https://templates.ollvy.in/board-resolution-address-change.pdf'),
  ('special_resolution', 'Special Resolution (EGM Minutes)', 'Minutes of EGM passing special resolution for inter-state change', 'doc_collection', false, 2, ARRAY['Required for inter-state change only', 'Include attendance register'], NULL),
  ('new_address_proof', 'Proof of New Registered Office Address', 'Electricity bill / property tax receipt at new address - not older than 2 months', 'doc_collection', true, 3, ARRAY['Must not be older than 60 days', 'Address should match application'], NULL),
  ('new_premises_noc', 'NOC from Owner of New Premises', 'No Objection Certificate from property owner', 'doc_collection', false, 4, ARRAY['Required if premises not owned by company', 'Owner signature mandatory'], 'https://templates.ollvy.in/noc-registered-office.pdf'),
  ('rent_agreement', 'Rent / Lease Agreement for New Premises', 'Valid rent or lease agreement for the new address', 'doc_collection', false, 5, ARRAY['Required if premises is rented or leased', 'Should be currently valid'], NULL),
  ('director_dsc', 'DSC of Authorized Director', 'Class 3 DSC for signing INC-22 and other forms', 'doc_collection', true, 6, ARRAY['Must be valid', 'Of director authorized to sign'], NULL),
  ('creditor_list', 'List of Creditors and Their Consent', 'For INC-23 - Regional Director may ask for creditor NOC', 'doc_collection', false, 7, ARRAY['Required for inter-state change', 'Include outstanding amounts'], NULL),
  ('newspaper_ads', 'Advertisement in Newspapers', 'Publication in local newspaper at both old and new address', 'doc_collection', false, 8, ARRAY['Required for inter-state change', 'We coordinate newspaper publication'], NULL),
  ('ca_certificate', 'CA Certificate of Paid-up Capital and Reserves', 'Chartered Accountant certificate for inter-state change', 'doc_collection', false, 9, ARRAY['Required for inter-state change', 'Certifying capital and reserves'], NULL),
  ('altered_moa', 'Altered MOA (After State Change)', 'Memorandum of Association with new state clause', 'doc_collection', false, 10, ARRAY['Required for inter-state change', 'We help prepare this'], NULL)
) AS dt(document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
WHERE sp.slug = 'roc-changes'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- =============================================================================
-- 3. MCA Annual Filing Work Documents
-- =============================================================================

INSERT INTO service_work_document_templates (service_package_id, stage_key, direction, document_key, document_label, description, display_order)
SELECT
  sp.id,
  t.stage_key,
  t.direction::work_document_direction,
  t.document_key,
  t.document_label,
  t.description,
  t.display_order
FROM service_packages sp
CROSS JOIN (VALUES
  ('document_collection', 'from_customer', 'financial_docs', 'Financial Documents', 'Upload audited financial statements, auditor report, and supporting schedules.', 1),
  ('document_collection', 'to_customer', 'doc_checklist', 'Document Checklist', 'Checklist of all documents required for annual filing. Review and upload missing items.', 2),
  ('boards_report_drafting', 'to_customer', 'boards_report_draft', 'Board''s Report Draft', 'Review the drafted Board''s Report including all statutory annexures before finalization.', 3),
  ('boards_report_drafting', 'from_customer', 'boards_report_approval', 'Board''s Report Approval', 'Confirm approval of the Board''s Report. Required before filing.', 4),
  ('form_preparation', 'to_customer', 'aoc4_draft', 'AOC-4 Form Draft', 'Review the AOC-4 (Financial Statement) form before digital signing.', 5),
  ('form_preparation', 'to_customer', 'mgt7_draft', 'MGT-7 / MGT-7A Form Draft', 'Review the Annual Return form before digital signing.', 6),
  ('digital_signing', 'from_customer', 'signed_forms', 'Signed Forms Confirmation', 'Confirm that forms have been digitally signed using DSC.', 7),
  ('filing', 'to_customer', 'aoc4_acknowledgment', 'AOC-4 Filing Acknowledgment (SRN)', 'AOC-4 filed successfully. Service Request Number for your records.', 8),
  ('filing', 'to_customer', 'mgt7_acknowledgment', 'MGT-7 Filing Acknowledgment (SRN)', 'MGT-7/7A filed successfully. Service Request Number for your records.', 9),
  ('filing', 'to_customer', 'filing_receipts', 'MCA Filing Receipts', 'Official filing receipts from MCA portal.', 10),
  ('filing_complete', 'to_customer', 'annual_filing_summary', 'Annual Filing Summary', 'Summary of all forms filed, SRNs, and compliance status for the financial year.', 11)
) AS t(stage_key, direction, document_key, document_label, description, display_order)
WHERE sp.slug = 'mca-annual-filing'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- =============================================================================
-- 4. ROC Changes Work Documents
-- =============================================================================

INSERT INTO service_work_document_templates (service_package_id, stage_key, direction, document_key, document_label, description, display_order)
SELECT
  sp.id,
  t.stage_key,
  t.direction::work_document_direction,
  t.document_key,
  t.document_label,
  t.description,
  t.display_order
FROM service_packages sp
CROSS JOIN (VALUES
  ('document_collection', 'from_customer', 'address_docs', 'Address Change Documents', 'Upload board resolution, address proof of new premises, and NOC if applicable.', 1),
  ('document_collection', 'to_customer', 'doc_review', 'Document Review Status', 'Review status of submitted documents. We will flag any missing or incorrect documents.', 2),
  ('resolution_preparation', 'to_customer', 'resolution_draft', 'Resolution Draft', 'Review the board/special resolution draft for address change.', 3),
  ('resolution_preparation', 'from_customer', 'resolution_approval', 'Resolution Approval', 'Confirm approval of the resolution. Required before filing.', 4),
  ('form_preparation', 'to_customer', 'inc22_draft', 'INC-22 Form Draft', 'Review the INC-22 (Registered Office Change) form before signing.', 5),
  ('form_preparation', 'to_customer', 'mgt14_draft', 'MGT-14 Form Draft (if applicable)', 'Review the MGT-14 form for filing special resolution.', 6),
  ('regional_director', 'to_customer', 'inc23_draft', 'INC-23 Application Draft (Inter-State)', 'Review the INC-23 application to Regional Director for inter-state change.', 7),
  ('regional_director', 'to_customer', 'newspaper_publication', 'Newspaper Publication Copies', 'Copies of newspaper advertisements published at old and new address.', 8),
  ('regional_director', 'to_customer', 'rd_order', 'Regional Director Order', 'Order from Regional Director confirming approval of inter-state change.', 9),
  ('filing', 'to_customer', 'inc22_acknowledgment', 'INC-22 Filing Acknowledgment (SRN)', 'INC-22 filed successfully. Service Request Number for your records.', 10),
  ('filing', 'to_customer', 'mgt14_acknowledgment', 'MGT-14 Filing Acknowledgment (if applicable)', 'MGT-14 filed successfully for special resolution.', 11),
  ('completion', 'to_customer', 'updated_mca_master', 'Updated MCA Master Data', 'Screenshot showing updated registered address on MCA portal.', 12),
  ('completion', 'to_customer', 'amended_moa', 'Amended MOA (Inter-State)', 'Memorandum updated to reflect new state clause.', 13),
  ('completion', 'to_customer', 'change_summary', 'Address Change Summary', 'Summary of the change including SRNs, effective date, and post-change obligations.', 14)
) AS t(stage_key, direction, document_key, document_label, description, display_order)
WHERE sp.slug = 'roc-changes'
ON CONFLICT (service_package_id, document_key) DO NOTHING;
