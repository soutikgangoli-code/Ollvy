-- =============================================================================
-- Migration: Seed questionnaires and documents for 5 services
-- Only questionnaires, initial documents, and work documents
-- =============================================================================

-- =====================
-- GST CANCELLATION
-- =====================

-- Questionnaires - gst-cancellation
INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
SELECT sp.id, q.question_key, q.question_label, q.question_type, q.options::jsonb, q.validation::jsonb, q.placeholder, q.help_text, q.step_number, q.display_order
FROM service_packages sp
CROSS JOIN (VALUES
  ('business_name', 'Registered business name', 'text', NULL, '{"required": true}', 'As per GST certificate', 'Your business name as registered on the GST portal', 1, 1),
  ('gstin', 'Your GSTIN', 'text', NULL, '{"required": true, "pattern": "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"}', '22AAAAA0000A1Z5', 'Your 15-digit GST Identification Number', 1, 2),
  ('cancellation_reason', 'Reason for cancellation', 'select', '[{"value": "ceased_business", "label": "Business has ceased operations"}, {"value": "below_threshold", "label": "Turnover fell below GST threshold"}, {"value": "transfer", "label": "Business transferred or sold"}, {"value": "amalgamation", "label": "Amalgamation or merger"}, {"value": "voluntary_no_longer_needed", "label": "Voluntary registration no longer needed"}, {"value": "other", "label": "Other"}]', '{"required": true}', NULL, 'Select the reason that best applies', 1, 3),
  ('effective_date', 'Effective date of cancellation', 'date', NULL, '{"required": true}', NULL, 'The date from which you want GST registration cancelled', 1, 4),
  ('last_filed_period', 'Last GST return period filed', 'select', '[{"value": "current", "label": "All returns are up to date"}, {"value": "1_pending", "label": "1 month or quarter pending"}, {"value": "2_pending", "label": "2 months or quarters pending"}, {"value": "3_plus_pending", "label": "3 or more periods pending"}]', '{"required": true}', NULL, 'Our CA checks your full filing history - this helps estimate the timeline', 2, 1),
  ('has_stock', 'Do you have any stock or inventory at the time of cancellation?', 'radio', '[{"value": "yes", "label": "Yes"}, {"value": "no", "label": "No"}]', '{"required": true}', NULL, 'Stock held at cancellation date requires ITC reversal - your CA calculates the exact amount', 2, 2),
  ('stock_value', 'Approximate value of stock held', 'number', NULL, '{"required": true, "min": 0}', '0', 'Approximate is fine - your CA calculates the exact ITC reversal', 2, 3),
  ('has_itc_balance', 'Do you have any unutilised Input Tax Credit balance in your electronic credit ledger?', 'radio', '[{"value": "yes", "label": "Yes"}, {"value": "no", "label": "No"}, {"value": "unsure", "label": "Not sure"}]', '{"required": true}', NULL, 'ITC balance must be reversed or paid back at cancellation - your CA will advise', 2, 4)
) AS q(question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
WHERE sp.slug = 'gst-cancellation';

-- Initial documents - gst-cancellation
INSERT INTO service_document_templates (service_package_id, document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
SELECT sp.id, dt.document_key, dt.document_label, dt.description, dt.stage_key, dt.is_required, dt.display_order, dt.tips, dt.template_url
FROM service_packages sp
CROSS JOIN (VALUES
  ('gst_certificate', 'GST Registration Certificate (REG-06)', 'Your current GST certificate showing your GSTIN and registration details', 'doc_collection', true, 1, ARRAY['Download from GST portal under My Profile - View/Download Certificates'], NULL),
  ('pan_card', 'PAN Card', 'PAN card of the business or proprietor', 'doc_collection', true, 2, ARRAY['Same PAN used for GST registration', 'Business PAN for companies and LLPs, personal PAN for proprietorship'], NULL),
  ('stock_list', 'Stock or Inventory List', 'List of goods held at time of cancellation with approximate values - required if you answered Yes to holding stock', 'doc_collection', false, 3, ARRAY['Excel or PDF format accepted', 'Include item name, quantity, and approximate value', 'Only required if you have stock on the cancellation date'], NULL),
  ('last_return_copy', 'Last Filed GST Return (GSTR-3B)', 'Copy of your most recently filed GSTR-3B', 'doc_collection', false, 4, ARRAY['Download from GST portal under Returns - Returns History', 'If all returns are pending, leave blank - your CA will access them directly'], NULL)
) AS dt(document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
WHERE sp.slug = 'gst-cancellation';

-- Work documents - gst-cancellation
INSERT INTO service_work_document_templates (service_package_id, stage_key, direction, document_key, document_label, description, display_order)
SELECT sp.id, t.stage_key, t.direction::work_document_direction, t.document_key, t.document_label, t.description, t.display_order
FROM service_packages sp
CROSS JOIN (VALUES
  ('returns_filed', 'to_customer', 'pending_returns_summary', 'Pending Returns Summary', 'Summary of all GST return periods identified as unfiled and confirmation that each has been filed. Includes the filing date and acknowledgement number for each period.', 1),
  ('cancellation_filed', 'to_customer', 'reg16_draft', 'GST Cancellation Application Draft (REG-16)', 'Your complete cancellation application before submission. Review and confirm before your CA files it on the portal.', 2),
  ('cancellation_filed', 'to_customer', 'arn_confirmation', 'Application Reference Number (ARN)', 'Confirmation that REG-16 has been filed with the ARN for tracking on the GST portal. You can verify status at gst.gov.in using this number.', 3),
  ('officer_query', 'from_customer', 'additional_docs_query', 'Additional Documents (if officer raises query)', 'If the GST officer requests additional documentation to process the cancellation application - upload them here.', 4),
  ('cancellation_complete', 'to_customer', 'reg19_order', 'GST Cancellation Order (REG-19)', 'The official order issued by the GST officer confirming your GSTIN is cancelled from the effective date. Keep this permanently.', 5),
  ('cancellation_complete', 'to_customer', 'gstr10_acknowledgement', 'GSTR-10 Final Return Acknowledgement', 'Confirmation that the mandatory final return has been filed after cancellation, including the acknowledgement number.', 6)
) AS t(stage_key, direction, document_key, document_label, description, display_order)
WHERE sp.slug = 'gst-cancellation'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- =====================
-- GST REVOCATION
-- =====================

-- Questionnaires - gst-revocation
INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
SELECT sp.id, q.question_key, q.question_label, q.question_type, q.options::jsonb, q.validation::jsonb, q.placeholder, q.help_text, q.step_number, q.display_order
FROM service_packages sp
CROSS JOIN (VALUES
  ('gstin', 'Your GSTIN', 'text', NULL, '{"required": true, "pattern": "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"}', '22AAAAA0000A1Z5', 'The GSTIN that was cancelled by the officer', 1, 1),
  ('business_name', 'Registered business name', 'text', NULL, '{"required": true}', 'As per GST certificate', 'Your business name as registered on the GST portal', 1, 2),
  ('cancellation_order_date', 'Date of the cancellation order (REG-19)', 'date', NULL, '{"required": true}', NULL, 'The date printed on the cancellation order you received. This determines your 90-day revocation deadline.', 1, 3),
  ('pending_periods', 'How many return periods are unfiled?', 'select', '[{"value": "1_to_3", "label": "1 to 3 months or quarters"}, {"value": "4_to_6", "label": "4 to 6 months or quarters"}, {"value": "7_to_12", "label": "7 to 12 months or quarters"}, {"value": "more_than_12", "label": "More than 12 months or quarters"}, {"value": "unsure", "label": "Not sure - CA will check on the portal"}]', '{"required": true}', NULL, 'Your CA checks the full filing history directly from the GST portal - this helps estimate how long step 2 will take', 1, 4),
  ('reason_for_non_filing', 'Why were returns not filed?', 'select', '[{"value": "cash_flow", "label": "Cash flow issues - could not pay the tax liability"}, {"value": "business_inactive", "label": "Business was temporarily inactive"}, {"value": "forgot", "label": "Missed deadlines - oversight"}, {"value": "accountant_issue", "label": "Previous accountant did not file"}, {"value": "other", "label": "Other"}]', '{"required": true}', NULL, 'Used in the revocation application. The more accurate this is, the stronger the application.', 2, 1),
  ('reason_details', 'Provide details about the reason', 'textarea', NULL, '{"required": true, "minLength": 50, "maxLength": 500}', 'Explain your specific circumstances in detail...', 'Your CA will refine this into the formal explanation for the officer. More detail = stronger application.', 2, 2),
  ('has_cancellation_order', 'Do you have a copy of the cancellation order (REG-19)?', 'radio', '[{"value": "yes", "label": "Yes, I have it"}, {"value": "no", "label": "No - I need to download it from the GST portal"}]', '{"required": true}', NULL, 'Download from the GST portal under Services - Notices and Orders if you do not have it', 2, 3)
) AS q(question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
WHERE sp.slug = 'gst-revocation';

-- Initial documents - gst-revocation
INSERT INTO service_document_templates (service_package_id, document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
SELECT sp.id, dt.document_key, dt.document_label, dt.description, dt.stage_key, dt.is_required, dt.display_order, dt.tips, dt.template_url
FROM service_packages sp
CROSS JOIN (VALUES
  ('cancellation_order', 'GST Cancellation Order (REG-19)', 'The cancellation order issued by the GST officer confirming your GSTIN was cancelled', 'doc_collection', true, 1, ARRAY['Download from GST portal under Services - Notices and Orders', 'If you cannot find it, your CA will help locate it on the portal'], NULL),
  ('pan_card', 'PAN Card', 'PAN card of the business or proprietor', 'doc_collection', true, 2, ARRAY['Same PAN used for GST registration'], NULL),
  ('business_proof', 'Proof of Business Continuity', 'Document showing the business is still operating - bank statement, electricity bill, or rent agreement dated after the cancellation order', 'doc_collection', true, 3, ARRAY['Must be dated after the cancellation order date', 'Bank statement showing recent transactions is ideal', 'Electricity bill or rent agreement also accepted'], NULL)
) AS dt(document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
WHERE sp.slug = 'gst-revocation';

-- Work documents - gst-revocation
INSERT INTO service_work_document_templates (service_package_id, stage_key, direction, document_key, document_label, description, display_order)
SELECT sp.id, t.stage_key, t.direction::work_document_direction, t.document_key, t.document_label, t.description, t.display_order
FROM service_packages sp
CROSS JOIN (VALUES
  ('returns_filed', 'to_customer', 'returns_filing_summary', 'Pending Returns Filing Summary', 'Summary of all GST return periods filed to clear the outstanding history before the revocation application. Includes acknowledgement numbers for each period filed.', 1),
  ('revocation_filed', 'to_customer', 'reg21_draft', 'Revocation Application Draft (REG-21)', 'Your complete revocation application including the explanation drafted by your CA. Review and confirm before submission.', 2),
  ('revocation_filed', 'to_customer', 'revocation_arn', 'Revocation ARN Confirmation', 'Confirmation that REG-21 has been submitted with the ARN for tracking. You can verify status on the GST portal.', 3),
  ('officer_query', 'from_customer', 'additional_evidence', 'Additional Evidence (if officer requests)', 'If the officer requests additional documents to support the revocation claim - upload them here.', 4),
  ('officer_query', 'to_customer', 'query_response_draft', 'Officer Query Response', 'Your CA drafts the response to the officer query with supporting documentation. Review and confirm before your CA submits it.', 5),
  ('revocation_complete', 'to_customer', 'reg22_order', 'GST Revocation Order (REG-22)', 'The official revocation order confirming your GSTIN is restored from the original cancellation date. Keep this permanently.', 6)
) AS t(stage_key, direction, document_key, document_label, description, display_order)
WHERE sp.slug = 'gst-revocation'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- =====================
-- COMPANY NAME CHANGE
-- =====================

-- Questionnaires - company-name-change
INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
SELECT sp.id, q.question_key, q.question_label, q.question_type, q.options::jsonb, q.validation::jsonb, q.placeholder, q.help_text, q.step_number, q.display_order
FROM service_packages sp
CROSS JOIN (VALUES
  ('current_company_name', 'Current registered company name', 'text', NULL, '{"required": true}', 'As per Certificate of Incorporation', 'Exact name as on your MCA records - including Private Limited or OPC at the end', 1, 1),
  ('cin', 'Company Identification Number (CIN)', 'text', NULL, '{"required": true, "pattern": "^[UL][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$"}', 'U74999DL2020PTC123456', 'Your 21-character CIN from the Certificate of Incorporation', 1, 2),
  ('proposed_name_1', 'Preferred new name (1st choice)', 'text', NULL, '{"required": true, "maxLength": 100}', 'e.g., Acme Technologies Private Limited', 'Include Private Limited or OPC at the end. CS checks availability before filing.', 1, 3),
  ('proposed_name_2', 'Alternative new name (2nd choice)', 'text', NULL, '{"required": true, "maxLength": 100}', 'e.g., Acme Solutions Private Limited', 'Must also end with Private Limited or OPC', 1, 4),
  ('proposed_name_3', 'Alternative new name (3rd choice)', 'text', NULL, '{"required": true, "maxLength": 100}', 'e.g., Acme Ventures Private Limited', 'All 3 are checked simultaneously - filing 3 distinct options maximises speed', 1, 5),
  ('reason_for_change', 'Reason for name change', 'select', '[{"value": "rebranding", "label": "Rebranding or new brand identity"}, {"value": "business_pivot", "label": "Business has pivoted to a different sector"}, {"value": "merger", "label": "Merger or acquisition"}, {"value": "placeholder_name", "label": "Original name was a placeholder"}, {"value": "confusion", "label": "Name causing confusion in the market"}, {"value": "other", "label": "Other"}]', '{"required": true}', NULL, 'Used in the board resolution and INC-24 application. Select the most accurate reason.', 2, 1),
  ('director_count', 'Number of directors in the company', 'number', NULL, '{"required": true, "min": 1, "max": 15}', '2', 'All directors must sign the board resolution before filing can proceed', 2, 2),
  ('state', 'State of incorporation', 'select', '[{"value": "DL", "label": "Delhi"}, {"value": "MH", "label": "Maharashtra"}, {"value": "KA", "label": "Karnataka"}, {"value": "TN", "label": "Tamil Nadu"}, {"value": "GJ", "label": "Gujarat"}, {"value": "HR", "label": "Haryana"}, {"value": "UP", "label": "Uttar Pradesh"}, {"value": "TS", "label": "Telangana"}, {"value": "WB", "label": "West Bengal"}, {"value": "RJ", "label": "Rajasthan"}, {"value": "other", "label": "Other state"}]', '{"required": true}', NULL, 'State where the company is registered on MCA', 2, 3)
) AS q(question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
WHERE sp.slug = 'company-name-change';

-- Initial documents - company-name-change
INSERT INTO service_document_templates (service_package_id, document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
SELECT sp.id, dt.document_key, dt.document_label, dt.description, dt.stage_key, dt.is_required, dt.display_order, dt.tips, dt.template_url
FROM service_packages sp
CROSS JOIN (VALUES
  ('certificate_of_incorporation', 'Certificate of Incorporation', 'Current CoI with your company name and CIN', 'doc_collection', true, 1, ARRAY['Download from MCA portal under MCA Services - View Public Documents if you have lost the original'], NULL),
  ('pan_card', 'Company PAN Card', 'PAN card issued in the company name', 'doc_collection', true, 2, ARRAY['Must match the name on MCA records exactly'], NULL),
  ('moa', 'Memorandum of Association (MOA)', 'Current MOA of the company', 'doc_collection', true, 3, ARRAY['Required for INC-24 filing', 'Download from MCA portal under MCA Services - View Public Documents if needed'], NULL)
) AS dt(document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
WHERE sp.slug = 'company-name-change';

-- Work documents - company-name-change
INSERT INTO service_work_document_templates (service_package_id, stage_key, direction, document_key, document_label, description, display_order)
SELECT sp.id, t.stage_key, t.direction::work_document_direction, t.document_key, t.document_label, t.description, t.display_order
FROM service_packages sp
CROSS JOIN (VALUES
  ('board_resolution', 'to_customer', 'board_resolution_draft', 'Board Resolution - Prepared by CS', 'CS has drafted the board resolution approving the name change for your specific company. Download, have all directors sign on company letterhead, and upload the signed copy back.', 1),
  ('board_resolution', 'from_customer', 'board_resolution_signed', 'Signed Board Resolution', 'Upload the board resolution signed by all directors on company letterhead. All directors must sign before the RUN application is filed.', 2),
  ('run_filed', 'to_customer', 'run_approval', 'MCA Name Approval Letter (RUN)', 'MCA approval confirming your new company name is available and reserved. The name is reserved for 20 days - INC-24 will be filed within this window.', 3),
  ('inc24_filed', 'to_customer', 'special_resolution_draft', 'Special Resolution - Prepared by CS', 'CS has drafted the special resolution for shareholders to approve the name change. Download, have all shareholders sign, and upload the signed copy back.', 4),
  ('inc24_filed', 'from_customer', 'special_resolution_signed', 'Signed Special Resolution', 'Upload the special resolution signed by all shareholders. Required for MGT-14 registration.', 5),
  ('inc24_filed', 'to_customer', 'inc24_acknowledgement', 'INC-24 Filing Acknowledgement', 'Confirmation that INC-24 has been submitted to the Registrar of Companies with the SRN for tracking.', 6),
  ('name_change_complete', 'to_customer', 'new_coi', 'New Certificate of Incorporation', 'New CoI issued by MCA with your updated company name and the same CIN. Use this for all downstream updates - bank accounts, GST, trademark, and contracts.', 7)
) AS t(stage_key, direction, document_key, document_label, description, display_order)
WHERE sp.slug = 'company-name-change'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- =====================
-- DIN REACTIVATION
-- =====================

-- Questionnaires - din-reactivation
INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
SELECT sp.id, q.question_key, q.question_label, q.question_type, q.options::jsonb, q.validation::jsonb, q.placeholder, q.help_text, q.step_number, q.display_order
FROM service_packages sp
CROSS JOIN (VALUES
  ('din_number', 'Director Identification Number (DIN)', 'text', NULL, '{"required": true, "pattern": "^[0-9]{8}$"}', '08765432', 'Your 8-digit DIN - find it on your director appointment letter or MCA portal under MCA Services - Find Director', 1, 1),
  ('director_name', 'Full name of director (as per PAN)', 'text', NULL, '{"required": true}', 'As per PAN card', 'Must match exactly with PAN records', 1, 2),
  ('aadhaar_mobile', 'Mobile number linked to Aadhaar', 'text', NULL, '{"required": true, "pattern": "^[6-9][0-9]{9}$"}', '9876543210', 'OTP will be sent to this number during DIR-3 KYC filing. Must be the number currently linked to your Aadhaar - not just your primary mobile.', 1, 3),
  ('deactivation_year', 'Year in which DIN was deactivated', 'select', '[{"value": "2024", "label": "October 2024 (missed Sep 30, 2024 deadline)"}, {"value": "2023", "label": "October 2023 (missed Sep 30, 2023 deadline)"}, {"value": "2022", "label": "October 2022 or earlier"}, {"value": "unsure", "label": "Not sure - CS will verify on MCA21"}]', '{"required": true}', NULL, 'This helps your CS calculate the accumulated penalty and confirm the correct late fee', 1, 4),
  ('has_multiple_dins', 'Do you hold directorships in multiple companies?', 'radio', '[{"value": "yes", "label": "Yes - I am a director in more than one company"}, {"value": "no", "label": "No - only one company"}]', '{"required": true}', NULL, 'DIR-3 KYC reactivation covers all companies where you are a director - one filing restores all', 1, 5)
) AS q(question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
WHERE sp.slug = 'din-reactivation';

-- Initial documents - din-reactivation
INSERT INTO service_document_templates (service_package_id, document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
SELECT sp.id, dt.document_key, dt.document_label, dt.description, dt.stage_key, dt.is_required, dt.display_order, dt.tips, dt.template_url
FROM service_packages sp
CROSS JOIN (VALUES
  ('pan_card', 'PAN Card', 'PAN card of the director', 'doc_collection', true, 1, ARRAY['Name must match MCA records exactly', 'Director PAN - not company PAN'], NULL),
  ('aadhaar_card', 'Aadhaar Card', 'Aadhaar card of the director', 'doc_collection', true, 2, ARRAY['The mobile number linked to this Aadhaar will receive the OTP during filing', 'Ensure the linked mobile is active and accessible during the filing session'], NULL),
  ('photograph', 'Passport Photograph', 'Recent passport-size photograph of the director', 'doc_collection', true, 3, ARRAY['White or light background', 'JPEG format preferred', 'Clear, recent - not more than 6 months old'], NULL)
) AS dt(document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
WHERE sp.slug = 'din-reactivation';

-- Work documents - din-reactivation
INSERT INTO service_work_document_templates (service_package_id, stage_key, direction, document_key, document_label, description, display_order)
SELECT sp.id, t.stage_key, t.direction::work_document_direction, t.document_key, t.document_label, t.description, t.display_order
FROM service_packages sp
CROSS JOIN (VALUES
  ('kyc_filed', 'to_customer', 'dir3_acknowledgement', 'DIR-3 KYC Filing Acknowledgement', 'Confirmation from MCA that DIR-3 KYC has been submitted successfully, including the acknowledgement number and late fee payment receipt. The penalty clock stopped on this date.', 1),
  ('din_reactivated', 'to_customer', 'din_status_confirmation', 'DIN Reactivation Confirmation', 'Confirmation that your DIN status is Active on MCA21. Download and save - you may be asked for this by your company or auditors.', 2)
) AS t(stage_key, direction, document_key, document_label, description, display_order)
WHERE sp.slug = 'din-reactivation'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- =====================
-- TDS MONTHLY COMPLIANCE
-- =====================

-- Questionnaires - tds-monthly-compliance
INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
SELECT sp.id, q.question_key, q.question_label, q.question_type, q.options::jsonb, q.validation::jsonb, q.placeholder, q.help_text, q.step_number, q.display_order
FROM service_packages sp
CROSS JOIN (VALUES
  ('tan_number', 'Tax Deduction Account Number (TAN)', 'text', NULL, '{"required": true, "pattern": "^[A-Z]{4}[0-9]{5}[A-Z]{1}$"}', 'DELA12345B', 'Your 10-character TAN - find it on previous TDS challans, TRACES portal, or your TAN allotment letter', 1, 1),
  ('business_name', 'Registered business name', 'text', NULL, '{"required": true}', 'As per TAN registration', 'Business name as registered on the TAN', 1, 2),
  ('tds_types', 'What types of TDS do you deduct?', 'multiselect', '[{"value": "24q_salary", "label": "24Q - Salary TDS (employees)"}, {"value": "26q_contractors", "label": "26Q - Contractor or professional fee TDS"}, {"value": "26q_rent", "label": "26Q - Rent TDS"}, {"value": "26q_interest", "label": "26Q - Interest TDS"}, {"value": "unsure", "label": "Not sure - CA will assess during onboarding"}]', '{"required": true, "minItems": 1}', NULL, 'Select all that apply. Your CA confirms the exact sections during onboarding.', 1, 3),
  ('employee_count', 'Approximate number of employees (for 24Q filing)', 'select', '[{"value": "0", "label": "0 - No salaried employees (26Q only)"}, {"value": "1_to_10", "label": "1 to 10 employees"}, {"value": "11_to_50", "label": "11 to 50 employees"}, {"value": "51_to_100", "label": "51 to 100 employees"}, {"value": "above_100", "label": "More than 100 employees"}]', '{"required": true}', NULL, 'Used to understand 24Q filing complexity - price does not change with employee count', 1, 4),
  ('approx_monthly_tds', 'Approximate total TDS deducted per month', 'select', '[{"value": "below_10000", "label": "Below 10,000"}, {"value": "10000_to_50000", "label": "10,000 to 50,000"}, {"value": "50000_to_200000", "label": "50,000 to 2,00,000"}, {"value": "above_200000", "label": "Above 2,00,000"}]', '{"required": true}', NULL, 'Approximate is fine. Helps your CA understand the challan volumes.', 1, 5),
  ('has_pending_returns', 'Are there any unfiled TDS returns from previous quarters?', 'radio', '[{"value": "yes", "label": "Yes - some quarters are unfiled"}, {"value": "no", "label": "No - all returns are up to date"}, {"value": "unsure", "label": "Not sure - previous CA handled it"}]', '{"required": true}', NULL, 'If yes or unsure, we do a TDS health check during onboarding. Retrospective filing may involve additional charges.', 2, 1),
  ('payroll_software', 'Do you use payroll software?', 'select', '[{"value": "none", "label": "No software - manual calculation or Excel"}, {"value": "zoho", "label": "Zoho Payroll"}, {"value": "razorpay", "label": "Razorpay Payroll"}, {"value": "greythr", "label": "greytHR"}, {"value": "keka", "label": "Keka"}, {"value": "other", "label": "Other payroll software"}]', '{"required": true}', NULL, 'Helps your CA set up the monthly data template in the format that works for your payroll', 2, 2)
) AS q(question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
WHERE sp.slug = 'tds-monthly-compliance';

-- Initial documents - tds-monthly-compliance
INSERT INTO service_document_templates (service_package_id, document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
SELECT sp.id, dt.document_key, dt.document_label, dt.description, dt.stage_key, dt.is_required, dt.display_order, dt.tips, dt.template_url
FROM service_packages sp
CROSS JOIN (VALUES
  ('tan_certificate', 'TAN Allotment Certificate', 'TAN certificate or allotment letter from the Income Tax Department', 'doc_collection', true, 1, ARRAY['Download from TRACES portal under Profile if you have lost the original', 'Or from the Income Tax e-filing portal under My Account - TAN details'], NULL),
  ('last_tds_return', 'Last Filed TDS Return (if any)', 'Copy of your most recently filed 24Q or 26Q acknowledgement from TRACES', 'doc_collection', false, 2, ARRAY['Download from TRACES portal under Statement / Payment - Request for Conso File', 'If no returns have been filed previously, leave blank'], NULL),
  ('pan_card', 'Company PAN Card', 'PAN card of the company or proprietor', 'doc_collection', true, 3, ARRAY['Must match the TAN registration records'], NULL)
) AS dt(document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
WHERE sp.slug = 'tds-monthly-compliance';

-- Work documents - tds-monthly-compliance
INSERT INTO service_work_document_templates (service_package_id, stage_key, direction, document_key, document_label, description, display_order)
SELECT sp.id, t.stage_key, t.direction::work_document_direction, t.document_key, t.document_label, t.description, t.display_order
FROM service_packages sp
CROSS JOIN (VALUES
  ('challan_deposited', 'from_customer', 'monthly_tds_data', 'Monthly TDS Data (salary and vendor deductions)', 'Your CA sends a standard template 3 days before the 7th. Fill in salary deductions per employee (24Q) and vendor payment deductions (26Q) for the month and upload here.', 1),
  ('challan_deposited', 'to_customer', 'challan_receipt', 'TDS Challan Deposit Receipt', 'Confirmation that TDS for the month has been deposited to the government. Includes the BSR code, challan serial number, and deposit date. Keep for quarterly return reconciliation.', 2),
  ('return_filed', 'from_customer', 'deductee_details', 'Deductee Details for the Quarter', 'PAN, name, and TDS amount for each employee (24Q) and each vendor or contractor (26Q) for the quarter. Your CA sends a template - fill and upload before the quarterly due date.', 3),
  ('return_filed', 'to_customer', 'return_acknowledgement', 'Quarterly TDS Return Acknowledgement', 'Confirmation from TRACES that 24Q and/or 26Q has been filed for the quarter, with the token number. Keep for your records and any future audit.', 4),
  ('form16_issued', 'to_customer', 'form16_form16a', 'Form 16 and Form 16A', 'Form 16 (TDS certificate) for all salaried employees and Form 16A (TDS certificate) for all vendors and contractors with TDS deducted during the financial year. Distribute to each person - employees need Form 16 to file their personal ITR.', 5)
) AS t(stage_key, direction, document_key, document_label, description, display_order)
WHERE sp.slug = 'tds-monthly-compliance'
ON CONFLICT (service_package_id, document_key) DO NOTHING;
