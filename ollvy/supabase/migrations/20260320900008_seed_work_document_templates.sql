-- =============================================================================
-- Migration: Service Work Document Templates
-- Creates templates table and seeds work documents for all services
-- Auto-creates order_work_documents when professional is assigned
-- =============================================================================

-- =============================================================================
-- 1. Create service_work_document_templates table
-- =============================================================================

CREATE TABLE IF NOT EXISTS service_work_document_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_package_id UUID NOT NULL REFERENCES service_packages(id) ON DELETE CASCADE,
  stage_key TEXT NOT NULL,
  direction work_document_direction NOT NULL,
  document_key TEXT NOT NULL,
  document_label TEXT NOT NULL,
  description TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(service_package_id, document_key)
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_work_doc_templates_service ON service_work_document_templates(service_package_id);
CREATE INDEX IF NOT EXISTS idx_work_doc_templates_stage ON service_work_document_templates(stage_key);

-- =============================================================================
-- 2. Enable RLS on templates table
-- =============================================================================

ALTER TABLE service_work_document_templates ENABLE ROW LEVEL SECURITY;

-- Anyone can read templates (they're configuration data)
CREATE POLICY "Anyone can read work document templates"
  ON service_work_document_templates FOR SELECT
  USING (true);

-- =============================================================================
-- 3. Seed GST Registration work documents
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
  ('application_filed', 'to_customer', 'gst_application_draft', 'GST Application Draft (REG-01)', 'Review your complete GST application before it is submitted to the portal. Verify all details - business name, address, HSN/SAC codes, authorized signatory details - before approving.', 1),
  ('officer_query_handled', 'from_customer', 'additional_address_proof', 'Additional Address Proof (if queried)', 'If the GST officer raises a query (REG-03) requesting additional proof of business address, upload the requested document here. Common requests include utility bills, NOC from landlord, or property ownership documents.', 2),
  ('officer_query_handled', 'from_customer', 'additional_entity_proof', 'Additional Entity Proof (if queried)', 'If the officer queries the nature of the entity or asks for additional registration documents, upload here. Could include MOA/AOA, partnership deed, trust deed, etc.', 3),
  ('gstin_issued', 'to_customer', 'gst_certificate', 'GST Registration Certificate (REG-06)', 'Your official GST registration certificate issued by the GST portal. Contains your GSTIN, business details, and list of goods/services. Must be displayed at your place of business.', 4),
  ('gstin_issued', 'to_customer', 'gstin_summary', 'GSTIN Summary Sheet', 'Summary document prepared by our CA containing your GSTIN, compliance due dates, and first steps to start filing GST returns.', 5)
) AS t(stage_key, direction, document_key, document_label, description, display_order)
WHERE sp.slug = 'gst-registration'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- =============================================================================
-- 4. Seed Private Limited Company work documents
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
  ('dsc_applied', 'to_customer', 'dsc_application_form', 'DSC Application Form', 'Digital Signature Certificate application form for each director who needs a new DSC. Download, complete, sign, and return for DSC procurement.', 1),
  ('dsc_applied', 'from_customer', 'signed_dsc_form', 'Signed DSC Application Form', 'Upload the signed DSC application form for each director. Required to issue Class 3 DSC.', 2),
  ('name_approval', 'to_customer', 'name_approval_application', 'Name Reservation Application (RUN/SPICe+ Part A)', 'Review the two proposed company names and rationale before submission to MCA. Confirm names are acceptable before we file.', 3),
  ('name_approval', 'from_customer', 'name_approval_confirmation', 'Name Confirmation', 'Confirm your approval of the proposed names and rationale as drafted. Required before we file the name reservation.', 4),
  ('name_approval', 'to_customer', 'name_approval_letter', 'MCA Name Approval Letter', 'MCA''s official name approval or RUN approval confirmation. Valid for 20 days - SPICe+ must be filed within this window.', 5),
  ('spice_filed', 'to_customer', 'moa_draft', 'Draft Memorandum of Association (MOA)', 'Review the draft MOA - particularly the Main Objects Clause - before digital signing. This defines what your company is authorized to do.', 6),
  ('spice_filed', 'to_customer', 'aoa_draft', 'Draft Articles of Association (AOA)', 'Review the draft AOA - the internal governance rules for your company - before digital signing.', 7),
  ('spice_filed', 'from_customer', 'inc9_declaration', 'INC-9 Declaration (Signed)', 'Declaration by each proposed director confirming they are not disqualified. We prepare this - directors must sign and return.', 8),
  ('spice_filed', 'from_customer', 'dir2_consent', 'DIR-2 Consent to Act as Director (Signed)', 'Consent form signed by each director agreeing to act in that capacity. We prepare this - directors must sign and return.', 9),
  ('incorporation_certificate', 'to_customer', 'certificate_of_incorporation', 'Certificate of Incorporation (CoI)', 'Official MCA certificate confirming your company is incorporated. Contains CIN, date of incorporation, PAN, and TAN.', 10),
  ('incorporation_certificate', 'to_customer', 'moa_final', 'Certified Memorandum of Association', 'Final certified MOA as filed with the Registrar of Companies.', 11),
  ('incorporation_certificate', 'to_customer', 'aoa_final', 'Certified Articles of Association', 'Final certified AOA as filed with the Registrar of Companies.', 12),
  ('incorporation_certificate', 'to_customer', 'company_pan', 'Company PAN Card', 'PAN issued to the company by Income Tax Department - generated automatically with CoI via SPICe+.', 13),
  ('incorporation_certificate', 'to_customer', 'company_tan', 'Company TAN', 'Tax Deduction Account Number - required for TDS deduction and filing. Generated automatically with CoI via SPICe+.', 14)
) AS t(stage_key, direction, document_key, document_label, description, display_order)
WHERE sp.slug = 'pvt-ltd-incorporation'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- =============================================================================
-- 5. Seed LLP Registration work documents
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
  ('dpin_applied', 'to_customer', 'dsc_application_form', 'DSC Application Form for Partners', 'Digital Signature Certificate application form for each partner who needs a new DSC. Download, complete, sign, and return.', 1),
  ('dpin_applied', 'from_customer', 'signed_dsc_form', 'Signed DSC Application Form', 'Upload the signed DSC application form per partner. Required for Class 3 DSC issuance and DPIN application.', 2),
  ('name_approval', 'to_customer', 'run_llp_draft', 'LLP Name Reservation Application (RUN-LLP)', 'Review the two proposed LLP names before submission to MCA. Confirm the names before we file.', 3),
  ('name_approval', 'from_customer', 'name_confirmation', 'Name Confirmation', 'Confirm approval of the proposed LLP names. Required before we file RUN-LLP on MCA.', 4),
  ('name_approval', 'to_customer', 'name_approval_letter', 'MCA LLP Name Approval Letter', 'Official MCA name approval confirmation for the LLP. Valid for 3 months - FiLLiP must be filed within this window.', 5),
  ('fillip_filed', 'to_customer', 'fillip_draft', 'FiLLiP Form Draft', 'Review the complete FiLLiP incorporation form before digital signing. Verify all partner details, capital contributions, and office address.', 6),
  ('fillip_filed', 'from_customer', 'partner_consent_signed', 'Partner Consent Forms (Signed)', 'Consent of each designated partner to act in that capacity. We prepare these - each partner must sign and return.', 7),
  ('incorporation_certificate', 'to_customer', 'llp_certificate_of_incorporation', 'LLP Certificate of Incorporation', 'Official MCA certificate confirming the LLP is incorporated. Contains LLPIN, date of incorporation, PAN, and TAN.', 8),
  ('incorporation_certificate', 'to_customer', 'llp_agreement_draft', 'Draft LLP Agreement', 'Draft LLP Agreement defining rights, duties, profit sharing, and capital contributions of partners. Must be reviewed and approved by all partners before filing (Form 3, within 30 days of incorporation).', 9),
  ('incorporation_certificate', 'from_customer', 'llp_agreement_signed', 'Signed LLP Agreement', 'LLP Agreement signed by all designated partners on stamp paper of appropriate value. Required for Form 3 filing with MCA within 30 days of incorporation.', 10),
  ('incorporation_certificate', 'to_customer', 'llp_pan', 'LLP PAN Card', 'PAN issued to the LLP - auto-generated with CoI via FiLLiP.', 11),
  ('incorporation_certificate', 'to_customer', 'llp_tan', 'LLP TAN', 'TAN allotted to the LLP - auto-generated with CoI via FiLLiP.', 12)
) AS t(stage_key, direction, document_key, document_label, description, display_order)
WHERE sp.slug = 'llp-incorporation'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- =============================================================================
-- 6. Seed Trademark Registration work documents
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
  ('tm_application_filed', 'to_customer', 'trademark_search_report', 'Trademark Search Report', 'Pre-filing search report across your selected classes on the IP India database. Review this carefully - it shows existing marks that may conflict with yours. We will advise on whether to proceed, modify, or reconsider.', 1),
  ('tm_application_filed', 'from_customer', 'poa_signed', 'Power of Attorney (Form TM-M-48) - Signed', 'Power of Attorney authorizing us to file and prosecute the trademark application on your behalf. We prepare this - download, sign (not notarized at this stage), and upload.', 2),
  ('tm_application_filed', 'to_customer', 'tm_filing_acknowledgment', 'Trademark Filing Acknowledgment', 'Official IP India acknowledgment confirming your trademark application has been filed, with application number and filing date. You may use the TM symbol from this date.', 3),
  ('examination_report', 'to_customer', 'examination_report', 'Examination Report (if raised)', 'Official objection report from the Trademark Examiner citing reasons for objection - usually citing prior similar marks or non-distinctiveness. We will prepare a detailed response.', 4),
  ('examination_report', 'to_customer', 'examination_response_draft', 'Draft Response to Examination Report', 'Our drafted response to the Examiner''s objections - includes legal arguments, evidence of distinctiveness, and differentiation from cited marks. Review and approve before we file.', 5),
  ('examination_report', 'from_customer', 'additional_use_evidence', 'Additional Use Evidence (for examination response)', 'If the examiner challenges distinctiveness or use, additional evidence of prior use strengthens the response. Upload invoices, advertisements, media coverage, or packaging showing the mark in commercial use.', 6),
  ('examination_report', 'from_customer', 'user_affidavit_signed', 'User Affidavit (Form TM-M-150) - Notarized', 'Sworn affidavit declaring prior use of the mark. We prepare this - you must sign before a Notary Public and upload the notarized copy.', 7),
  ('tm_published', 'to_customer', 'tm_journal_publication', 'Trademark Journal Publication Notice', 'Confirmation that your mark has been published in the Official Gazette (Trademark Journal). The 4-month opposition window begins from this date. No action required from you unless an opposition is filed.', 8),
  ('tm_registered', 'to_customer', 'tm_registration_certificate', 'Trademark Registration Certificate', 'Official trademark registration certificate from IP India. You are now entitled to use the (R) symbol for goods/services in the registered classes.', 9)
) AS t(stage_key, direction, document_key, document_label, description, display_order)
WHERE sp.slug = 'trademark-registration'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- =============================================================================
-- 7. Seed FSSAI License work documents
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
  ('application_filed', 'to_customer', 'fssai_application_draft', 'FSSAI License Application Draft', 'Review your FSSAI license application before portal submission. Verify name, address, food categories, and product list.', 1),
  ('inspection_scheduled', 'from_customer', 'inspection_readiness_confirmation', 'Inspection Readiness Confirmation', 'Confirm that your premises is ready for the FSSAI inspector''s visit. We will brief you on what to have ready - the inspector checks premises hygiene, equipment, storage, and your FSMS records.', 2),
  ('inspection_scheduled', 'from_customer', 'inspection_query_response', 'Inspection Query / Deficiency Response', 'If the inspector raises deficiencies or requests additional information post-visit, upload the compliance documents here. Common: pest control records, medical fitness certificates, updated FSMS documents.', 3),
  ('license_issued', 'to_customer', 'fssai_license_certificate', 'FSSAI License Certificate', 'Official FSSAI License with 14-digit license number. Must be displayed prominently at the premises.', 4)
) AS t(stage_key, direction, document_key, document_label, description, display_order)
WHERE sp.slug = 'fssai-license'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- =============================================================================
-- 8. Seed Shop & Establishment work documents
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
  ('application_filed', 'to_customer', 'shop_act_application_draft', 'Shop Act Application Draft', 'Review the Shop & Establishment application prepared for your state portal before submission. Verify establishment name, address, employee count, and working hours.', 1),
  ('application_filed', 'from_customer', 'additional_state_docs', 'State-Specific Additional Documents', 'Some states require additional documents after initial submission - e.g., municipal NOC, ward certificate, or additional employee declarations. Upload here if requested.', 2),
  ('certificate_issued', 'to_customer', 'shop_establishment_certificate', 'Shop & Establishment Registration Certificate', 'Official registration certificate issued by the state labour department or municipal authority. Must be displayed at the premises at all times.', 3)
) AS t(stage_key, direction, document_key, document_label, description, display_order)
WHERE sp.slug = 'shop-establishment'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- =============================================================================
-- 9. Seed MSME Registration work documents
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
  ('certificate_issued', 'to_customer', 'udyam_certificate', 'Udyam Registration Certificate', 'Official Udyam Registration Certificate with Udyam Registration Number (URN) and QR code. Contains your MSME classification (Micro / Small / Medium).', 1)
) AS t(stage_key, direction, document_key, document_label, description, display_order)
WHERE sp.slug = 'msme-registration'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- =============================================================================
-- 10. Seed IEC Registration work documents
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
  ('application_filed', 'to_customer', 'anf2a_draft', 'IEC Application Draft (ANF-2A)', 'Review the IEC application form (ANF-2A) prepared for DGFT portal submission. Verify entity details, bank account details, and address before confirming.', 1),
  ('application_filed', 'from_customer', 'board_resolution_signed', 'Board Resolution (Signed)', 'Board resolution authorizing the named individual to apply for IEC on behalf of the company - required for Pvt Ltd, LLP, and Public Ltd companies. We prepare this - director(s) must sign and upload on company letterhead.', 2),
  ('iec_issued', 'to_customer', 'iec_certificate', 'IEC Certificate', 'Official IEC certificate issued by DGFT. Contains the 10-digit IEC number (same as entity PAN), entity name, address, and bank account details.', 3),
  ('iec_issued', 'to_customer', 'dgft_login_credentials', 'DGFT Portal Login Details', 'Your DGFT portal login credentials - required for IEC annual updation (April-June every year) and for applying for Export Promotion schemes.', 4)
) AS t(stage_key, direction, document_key, document_label, description, display_order)
WHERE sp.slug = 'iec-code'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- =============================================================================
-- 11. Seed Professional Tax work documents
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
  ('application_filed', 'to_customer', 'pt_application_draft', 'Professional Tax Application Draft', 'Review the PTEC and/or PTRC application prepared for your state''s professional tax portal. Verify entity details, address, employee count, and registration type before we submit.', 1),
  ('certificate_issued', 'to_customer', 'ptec_certificate', 'PTEC Certificate (Professional Tax Enrollment Certificate)', 'Certificate confirming enrollment under Professional Tax for the entity itself. Contains PT enrollment number.', 2),
  ('certificate_issued', 'to_customer', 'ptrc_certificate', 'PTRC Certificate (Professional Tax Registration Certificate)', 'Employer registration certificate for deducting PT from employee salaries. Contains PTRC number and must be referenced in every PT challan filed.', 3)
) AS t(stage_key, direction, document_key, document_label, description, display_order)
WHERE sp.slug = 'professional-tax'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- =============================================================================
-- 12. Seed ESI Registration work documents
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
  ('application_filed', 'to_customer', 'esi_application_draft', 'ESI Registration Application Draft', 'Review the ESI registration application prepared for the ESIC portal before submission. Verify establishment details, employee count, wage data, and signatory details.', 1),
  ('application_filed', 'from_customer', 'additional_employee_docs', 'Additional Employee Documents (if queried)', 'If ESIC raises a query requesting additional employee proof - attendance registers, offer letters, appointment letters, or PF opt-in declarations - upload here.', 2),
  ('registration_certificate', 'to_customer', 'esic_registration_letter', 'ESIC Registration Letter / Code', 'Official ESIC registration confirmation containing your 17-digit ESI Employer Code. This code is used for all future ESI challan payments and employee registrations.', 3),
  ('registration_certificate', 'to_customer', 'esi_compliance_guide', 'ESI Monthly Compliance Guide', 'Summary document covering: monthly contribution rates (3.25% employer + 0.75% employee), due dates (15th of following month), and employee registration steps.', 4)
) AS t(stage_key, direction, document_key, document_label, description, display_order)
WHERE sp.slug = 'esi-registration'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- =============================================================================
-- 13. Seed PF Registration work documents
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
  ('application_filed', 'to_customer', 'pf_application_draft', 'PF Registration Application Draft', 'Review the PF (EPFO) registration application prepared for the Unified Shram Suvidha Portal before submission. Verify establishment details, nature of work, employee count, and authorised signatory.', 1),
  ('application_filed', 'from_customer', 'additional_employee_docs', 'Additional Employee Documents (if queried)', 'If EPFO raises a query requesting additional employee proof - attendance registers, offer letters, appointment letters - upload here.', 2),
  ('registration_certificate', 'to_customer', 'epfo_registration_letter', 'EPFO Registration Letter / PF Code', 'Official EPFO registration confirmation containing your PF Establishment Code. Required for monthly PF challan payments via ECR on the EPFO Unified Portal.', 3),
  ('registration_certificate', 'to_customer', 'pf_compliance_guide', 'PF Monthly Compliance Guide', 'Summary document covering: monthly contribution rates (12% employer + 12% employee), due dates (15th of following month), and ECR filing process.', 4)
) AS t(stage_key, direction, document_key, document_label, description, display_order)
WHERE sp.slug = 'pf-registration'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- =============================================================================
-- 14. Seed OPC Incorporation work documents (similar to Pvt Ltd)
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
  ('dsc_applied', 'to_customer', 'dsc_application_form', 'DSC Application Form', 'Digital Signature Certificate application form for the sole director. Download, complete, sign, and return for DSC procurement.', 1),
  ('dsc_applied', 'from_customer', 'signed_dsc_form', 'Signed DSC Application Form', 'Upload the signed DSC application form. Required to issue Class 3 DSC.', 2),
  ('name_approval', 'to_customer', 'name_approval_application', 'Name Reservation Application (RUN/SPICe+ Part A)', 'Review the two proposed company names and rationale before submission to MCA.', 3),
  ('name_approval', 'from_customer', 'name_approval_confirmation', 'Name Confirmation', 'Confirm your approval of the proposed names. Required before we file the name reservation.', 4),
  ('name_approval', 'to_customer', 'name_approval_letter', 'MCA Name Approval Letter', 'MCA''s official name approval confirmation. Valid for 20 days - SPICe+ must be filed within this window.', 5),
  ('spice_filed', 'to_customer', 'moa_draft', 'Draft Memorandum of Association (MOA)', 'Review the draft MOA before digital signing. This defines what your OPC is authorized to do.', 6),
  ('spice_filed', 'to_customer', 'aoa_draft', 'Draft Articles of Association (AOA)', 'Review the draft AOA - the internal governance rules for your OPC - before digital signing.', 7),
  ('spice_filed', 'from_customer', 'inc9_declaration', 'INC-9 Declaration (Signed)', 'Declaration by the sole director confirming they are not disqualified. We prepare this - sign and return.', 8),
  ('spice_filed', 'from_customer', 'nominee_consent', 'Nominee Consent (INC-3)', 'Consent from the nominee director agreeing to act as director in case of death/incapacity of sole member.', 9),
  ('incorporation_certificate', 'to_customer', 'certificate_of_incorporation', 'Certificate of Incorporation (CoI)', 'Official MCA certificate confirming your OPC is incorporated. Contains CIN, date of incorporation, PAN, and TAN.', 10),
  ('incorporation_certificate', 'to_customer', 'moa_final', 'Certified Memorandum of Association', 'Final certified MOA as filed with the Registrar of Companies.', 11),
  ('incorporation_certificate', 'to_customer', 'aoa_final', 'Certified Articles of Association', 'Final certified AOA as filed with the Registrar of Companies.', 12),
  ('incorporation_certificate', 'to_customer', 'company_pan', 'Company PAN Card', 'PAN issued to the OPC - generated automatically with CoI via SPICe+.', 13),
  ('incorporation_certificate', 'to_customer', 'company_tan', 'Company TAN', 'TAN - required for TDS deduction and filing. Generated automatically with CoI via SPICe+.', 14)
) AS t(stage_key, direction, document_key, document_label, description, display_order)
WHERE sp.slug = 'opc-incorporation'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- =============================================================================
-- 15. Seed Partnership Registration work documents
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
  ('deed_drafting', 'to_customer', 'partnership_deed_draft', 'Draft Partnership Deed', 'Review the partnership deed draft carefully. Verify partner names, capital contributions, profit sharing ratios, and partner responsibilities.', 1),
  ('deed_drafting', 'from_customer', 'deed_approval_confirmation', 'Partnership Deed Approval', 'Confirm approval of the partnership deed draft. Once confirmed, we will proceed with stamp duty payment and registration.', 2),
  ('deed_registration', 'from_customer', 'signed_deed_on_stamp_paper', 'Signed Partnership Deed (on Stamp Paper)', 'Partnership deed printed on appropriate value stamp paper, signed by all partners. Upload the scanned copy after signing.', 3),
  ('registration_complete', 'to_customer', 'registered_partnership_deed', 'Registered Partnership Deed', 'Partnership deed registered with the Registrar of Firms. Contains registration number and date.', 4),
  ('registration_complete', 'to_customer', 'firm_pan', 'Firm PAN Card', 'PAN card issued to the partnership firm. Required for opening bank account and tax compliance.', 5)
) AS t(stage_key, direction, document_key, document_label, description, display_order)
WHERE sp.slug = 'partnership-registration'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- =============================================================================
-- 16. Create function to auto-create work documents when professional is assigned
-- =============================================================================

CREATE OR REPLACE FUNCTION create_work_documents_on_professional_assignment()
RETURNS TRIGGER AS $$
BEGIN
  -- Only proceed if professional_id is being set (not null) and was previously null
  IF NEW.professional_id IS NOT NULL AND (OLD.professional_id IS NULL OR OLD.professional_id != NEW.professional_id) THEN
    -- Insert work documents from templates for this service
    INSERT INTO order_work_documents (
      order_id,
      professional_id,
      direction,
      document_label,
      description,
      stage_key,
      status
    )
    SELECT
      NEW.id,
      NEW.professional_id,
      t.direction,
      t.document_label,
      t.description,
      t.stage_key,
      'pending'::work_document_status
    FROM service_work_document_templates t
    WHERE t.service_package_id = NEW.service_package_id
      AND t.is_active = true
    ORDER BY t.display_order
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- 17. Create trigger on orders table
-- =============================================================================

DROP TRIGGER IF EXISTS trigger_create_work_documents_on_professional_assignment ON orders;

CREATE TRIGGER trigger_create_work_documents_on_professional_assignment
  AFTER UPDATE ON orders
  FOR EACH ROW
  WHEN (OLD.professional_id IS DISTINCT FROM NEW.professional_id)
  EXECUTE FUNCTION create_work_documents_on_professional_assignment();

-- =============================================================================
-- 18. Add document_key column to order_work_documents if not exists
-- =============================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'order_work_documents' AND column_name = 'document_key'
  ) THEN
    ALTER TABLE order_work_documents ADD COLUMN document_key TEXT;
  END IF;
END $$;

-- =============================================================================
-- 19. Update the trigger function to include document_key
-- =============================================================================

CREATE OR REPLACE FUNCTION create_work_documents_on_professional_assignment()
RETURNS TRIGGER AS $$
BEGIN
  -- Only proceed if professional_id is being set (not null) and was previously null
  IF NEW.professional_id IS NOT NULL AND (OLD.professional_id IS NULL OR OLD.professional_id != NEW.professional_id) THEN
    -- Insert work documents from templates for this service
    INSERT INTO order_work_documents (
      order_id,
      professional_id,
      direction,
      document_label,
      description,
      stage_key,
      document_key,
      status
    )
    SELECT
      NEW.id,
      NEW.professional_id,
      t.direction,
      t.document_label,
      t.description,
      t.stage_key,
      t.document_key,
      'pending'::work_document_status
    FROM service_work_document_templates t
    WHERE t.service_package_id = NEW.service_package_id
      AND t.is_active = true
    ORDER BY t.display_order
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- 20. Create RPC to get work documents for an order grouped by stage
-- =============================================================================

CREATE OR REPLACE FUNCTION get_order_work_documents(p_order_id UUID)
RETURNS TABLE (
  id UUID,
  order_id UUID,
  direction work_document_direction,
  document_key TEXT,
  document_label TEXT,
  description TEXT,
  stage_key TEXT,
  status work_document_status,
  file_url TEXT,
  file_name TEXT,
  due_date DATE,
  uploaded_at TIMESTAMPTZ,
  uploaded_by_type TEXT,
  verified_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    wd.id,
    wd.order_id,
    wd.direction,
    wd.document_key,
    wd.document_label,
    wd.description,
    wd.stage_key,
    wd.status,
    wd.file_url,
    wd.file_name,
    wd.due_date,
    wd.uploaded_at,
    wd.uploaded_by_type,
    wd.verified_at,
    wd.rejection_reason,
    wd.created_at
  FROM order_work_documents wd
  WHERE wd.order_id = p_order_id
  ORDER BY
    CASE wd.stage_key
      WHEN 'application_filed' THEN 1
      WHEN 'dsc_applied' THEN 2
      WHEN 'dpin_applied' THEN 2
      WHEN 'name_approval' THEN 3
      WHEN 'spice_filed' THEN 4
      WHEN 'fillip_filed' THEN 4
      WHEN 'deed_drafting' THEN 3
      WHEN 'deed_registration' THEN 4
      WHEN 'tm_application_filed' THEN 1
      WHEN 'examination_report' THEN 2
      WHEN 'tm_published' THEN 3
      WHEN 'tm_registered' THEN 4
      WHEN 'inspection_scheduled' THEN 2
      WHEN 'officer_query_handled' THEN 3
      WHEN 'gstin_issued' THEN 4
      WHEN 'iec_issued' THEN 4
      WHEN 'license_issued' THEN 5
      WHEN 'certificate_issued' THEN 5
      WHEN 'registration_certificate' THEN 5
      WHEN 'incorporation_certificate' THEN 6
      WHEN 'registration_complete' THEN 6
      ELSE 99
    END,
    wd.created_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_order_work_documents(UUID) TO authenticated;
