-- =============================================================================
-- Migration: Seed Work Documents for Services Missing Them
-- Adds work document templates for: gst-monthly-50l, business-itr, copyright-registration
-- NOTE: cloud-kitchen-setup removed (service doesn't exist), startup-india removed (no spec)
-- =============================================================================

-- =============================================================================
-- 1. GST Monthly Filing Work Documents (gst-monthly-50l)
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
  ('data_collection', 'from_customer', 'sales_data', 'Sales Data / Invoices', 'Upload your sales invoices or sales register for the month. Include invoice number, date, buyer GSTIN (if B2B), taxable value, and GST rate for each invoice.', 1),
  ('data_collection', 'from_customer', 'purchase_data', 'Purchase Data / Invoices', 'Upload your purchase invoices or purchase register. Include supplier GSTIN, invoice number, date, taxable value, and GST amounts for ITC claim.', 2),
  ('reconciliation', 'to_customer', 'itc_reconciliation', 'ITC Reconciliation Report', 'Comparison of your purchase register with GSTR-2B auto-populated data. Review mismatches and confirm ITC to be claimed.', 3),
  ('filing_gstr1', 'to_customer', 'gstr1_draft', 'GSTR-1 Draft', 'Review the GSTR-1 (outward supplies) draft before we file. Verify invoice-level details and totals.', 4),
  ('filing_gstr1', 'to_customer', 'gstr1_arn', 'GSTR-1 Filing Acknowledgment', 'GSTR-1 filed successfully. ARN (Acknowledgment Reference Number) for your records.', 5),
  ('tax_payment', 'to_customer', 'tax_challan', 'GST Payment Challan', 'Challan for GST payment. Pay via net banking or at authorized banks. Upload payment confirmation after payment.', 6),
  ('tax_payment', 'from_customer', 'payment_confirmation', 'Payment Confirmation', 'Upload bank payment receipt or screenshot showing GST payment completed.', 7),
  ('filing_gstr3b', 'to_customer', 'gstr3b_draft', 'GSTR-3B Draft', 'Review the GSTR-3B (summary return) before filing. Verify tax liability, ITC claimed, and tax paid.', 8),
  ('filing_gstr3b', 'to_customer', 'gstr3b_arn', 'GSTR-3B Filing Acknowledgment', 'GSTR-3B filed successfully. ARN for your records. This completes your monthly GST compliance.', 9),
  ('filing_complete', 'to_customer', 'monthly_summary', 'Monthly Filing Summary', 'Summary report of the month - sales, purchases, ITC claimed, tax paid, and ARNs for both returns.', 10)
) AS t(stage_key, direction, document_key, document_label, description, display_order)
WHERE sp.slug = 'gst-monthly-50l'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- =============================================================================
-- 2. Business ITR Filing Work Documents (business-itr)
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
  ('data_collection', 'from_customer', 'books_of_accounts', 'Books of Accounts / Trial Balance', 'Upload your trial balance, ledgers, or accounting software export for the financial year.', 1),
  ('data_collection', 'from_customer', 'annual_bank_statements', 'Bank Statements (Full Year)', 'All bank account statements from April to March for reconciliation.', 2),
  ('data_collection', 'from_customer', 'tds_certificates', 'TDS Certificates (Form 16A)', 'TDS certificates received from clients who deducted TDS on payments made to you.', 3),
  ('computation', 'to_customer', 'income_computation', 'Income Computation Statement', 'Detailed computation of business income, expenses, depreciation, and taxable income. Review for accuracy.', 4),
  ('computation', 'to_customer', 'tax_computation', 'Tax Computation Sheet', 'Tax liability computation including advance tax paid, TDS credit, and balance tax payable or refund due.', 5),
  ('computation', 'from_customer', 'computation_approval', 'Computation Approval', 'Confirm your approval of the income and tax computation. Required before ITR filing.', 6),
  ('itr_preparation', 'to_customer', 'itr_draft', 'ITR Form Draft', 'Review the complete ITR form before e-filing. Verify all schedules and figures.', 7),
  ('tax_payment', 'to_customer', 'self_assessment_challan', 'Self Assessment Tax Challan', 'If balance tax is payable, challan for self-assessment tax payment.', 8),
  ('tax_payment', 'from_customer', 'tax_payment_proof', 'Tax Payment Proof', 'Upload challan receipt showing tax payment completed.', 9),
  ('filing', 'to_customer', 'itr_acknowledgment', 'ITR Acknowledgment (ITR-V)', 'ITR filed successfully. ITR-V acknowledgment for your records. If refund is due, it will be processed to your bank account.', 10),
  ('filing', 'to_customer', 'filing_summary', 'ITR Filing Summary', 'Summary of the return - total income, tax paid, refund/tax payable, and acknowledgment number.', 11)
) AS t(stage_key, direction, document_key, document_label, description, display_order)
WHERE sp.slug = 'business-itr'
ON CONFLICT (service_package_id, document_key) DO NOTHING;

-- =============================================================================
-- 3. Copyright Registration Work Documents
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
  ('application_preparation', 'to_customer', 'statement_of_particulars', 'Statement of Particulars Draft', 'Review the statement of particulars describing your work, authorship, and ownership before we file.', 1),
  ('application_preparation', 'from_customer', 'particulars_approval', 'Particulars Approval', 'Confirm approval of the statement of particulars. Required before filing.', 2),
  ('application_filed', 'to_customer', 'poa_form', 'Power of Attorney (Form XIV)', 'Power of Attorney authorizing us to file copyright application on your behalf. Sign and return.', 3),
  ('application_filed', 'from_customer', 'signed_poa', 'Signed Power of Attorney', 'Upload the signed Power of Attorney form.', 4),
  ('diary_number_issued', 'to_customer', 'filing_acknowledgment', 'Filing Acknowledgment / Diary Number', 'Copyright application filed. Diary number issued for tracking. 30-day mandatory waiting period begins.', 5),
  ('waiting_period', 'to_customer', 'waiting_period_notice', 'Waiting Period Notice', 'Your application is in the mandatory 30-day waiting period. Any objections from third parties will be communicated here.', 6),
  ('examination', 'from_customer', 'examination_response', 'Examination Query Response', 'If Copyright Office raises queries, upload response documents here.', 7),
  ('registration_issued', 'to_customer', 'copyright_certificate', 'Copyright Registration Certificate', 'Official Copyright Registration Certificate. Your work is now registered with the Copyright Office.', 8)
) AS t(stage_key, direction, document_key, document_label, description, display_order)
WHERE sp.slug = 'copyright-registration'
ON CONFLICT (service_package_id, document_key) DO NOTHING;
