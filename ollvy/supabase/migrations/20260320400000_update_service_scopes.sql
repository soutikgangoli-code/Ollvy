-- =============================================================================
-- Migration: Update comprehensive scope_included and scope_excluded for all services
-- Philosophy:
-- - Included: End-to-end handling - everything from start to finish except documents they must provide
-- - Not Included: Additional paid services, delays from customer's side, government portal/system issues
-- =============================================================================

-- 1. Private Limited Company Registration
UPDATE service_packages
SET
  scope_included = ARRAY[
    'Name availability search and reservation with MCA',
    'Digital Signature Certificate (DSC) for up to 2 directors',
    'Director Identification Number (DIN) for up to 2 directors',
    'Drafting of Memorandum of Association (MOA)',
    'Drafting of Articles of Association (AOA)',
    'SPICe+ form preparation and filing with MCA',
    'PAN application for the company',
    'TAN application for the company',
    'Certificate of Incorporation with CIN',
    'Unlimited revisions until MCA approval',
    'Post-incorporation compliance checklist'
  ],
  scope_excluded = ARRAY[
    'GST registration (available as add-on at ₹8,999)',
    'Trademark registration (available separately)',
    'Professional tax registration',
    'Registered office address or virtual office',
    'Bank account opening (guidance provided, execution by you)',
    'Additional directors beyond 2 (₹2,000 per additional director)',
    'Delays due to incomplete or incorrect documents from your end',
    'Delays due to MCA portal downtime or government processing time',
    'Name rejection if similar trademark exists or restricted words used'
  ],
  updated_at = now()
WHERE slug = 'pvt-ltd-incorporation';

-- 2. LLP Incorporation
UPDATE service_packages
SET
  scope_included = ARRAY[
    'Name availability search and reservation with MCA',
    'Digital Signature Certificate (DSC) for up to 2 designated partners',
    'Designated Partner Identification Number (DPIN) for up to 2 partners',
    'Drafting of LLP Agreement',
    'FiLLiP form preparation and filing',
    'LLP PAN application',
    'LLP TAN application',
    'Certificate of Incorporation',
    'Filing of LLP Agreement with MCA',
    'Post-incorporation compliance checklist'
  ],
  scope_excluded = ARRAY[
    'GST registration (available as add-on at ₹8,999)',
    'Trademark registration',
    'Professional tax registration',
    'Additional partners beyond 2 (₹2,000 per additional partner)',
    'Amendments to LLP Agreement after incorporation',
    'Bank account opening (guidance provided only)',
    'Delays due to incomplete documents from your end',
    'Delays due to MCA portal issues or government processing time'
  ],
  updated_at = now()
WHERE slug = 'llp-incorporation';

-- 3. GST Registration
UPDATE service_packages
SET
  scope_included = ARRAY[
    'GST application preparation on GST portal',
    'Document verification and compilation',
    'Application submission',
    'ARN generation and tracking',
    'Response to clarifications from GST officer (first round)',
    'GSTIN certificate upon approval',
    'GST portal login setup assistance',
    'Basic orientation on GST compliance'
  ],
  scope_excluded = ARRAY[
    'Monthly GST return filing (available as ₹2,999/month retainer)',
    'GST annual return (GSTR-9)',
    'E-way bill registration',
    'Input tax credit reconciliation',
    'Delays due to incomplete address proof or KYC documents',
    'Delays from additional queries by GST officer requiring documents you do not have',
    'Bank account verification failures',
    'Aadhaar OTP authentication failures on your end'
  ],
  updated_at = now()
WHERE slug = 'gst-registration';

-- 4. MSME/Udyam Registration
UPDATE service_packages
SET
  scope_included = ARRAY[
    'Udyam registration application preparation',
    'Business activity classification (NIC code identification)',
    'Document compilation',
    'Application filing on Udyam portal',
    'Udyam Registration Certificate',
    'Udyam Registration Number (URN)'
  ],
  scope_excluded = ARRAY[
    'GST registration (required prerequisite, available separately)',
    'Bank loan applications using MSME certificate',
    'Government tender registrations',
    'NSIC registration',
    'Delays due to Aadhaar-mobile OTP issues on your end',
    'Delays due to PAN-Aadhaar linking not done',
    'Incorrect business classification provided by you'
  ],
  updated_at = now()
WHERE slug = 'msme-registration';

-- 5. Trademark Registration
UPDATE service_packages
SET
  scope_included = ARRAY[
    'Comprehensive trademark search report',
    'Trademark class identification and recommendation',
    'Application drafting with proper specifications',
    'Filing with Controller General of Patents, Designs & Trademarks',
    'TM symbol authorization letter (use immediately after filing)',
    'Response to examination report (first objection)',
    'Status tracking until registration',
    'Registration certificate upon approval'
  ],
  scope_excluded = ARRAY[
    'Trademark renewal (due every 10 years)',
    'Opposition proceedings if third party objects',
    'Reply to second or subsequent examination reports (charged separately)',
    'Additional trademark classes (₹4,500 per additional class)',
    'Logo design services',
    'International trademark registration (Madrid Protocol)',
    'Government examination delays (typically 6-12 months)',
    'Rejection due to similarity with existing registered marks'
  ],
  updated_at = now()
WHERE slug = 'trademark-registration';

-- 6. GST Monthly Filing - Up to ₹50L
UPDATE service_packages
SET
  scope_included = ARRAY[
    'GSTR-1 preparation and filing by 11th of each month',
    'GSTR-3B preparation and filing by 20th of each month',
    'Input tax credit reconciliation with GSTR-2B',
    'Monthly ITC mismatch report',
    'Payment challan generation',
    'WhatsApp support for basic GST queries',
    'Monthly compliance status report'
  ],
  scope_excluded = ARRAY[
    'GST annual return (GSTR-9) - charged separately',
    'E-way bill generation',
    'GST audit assistance',
    'Reply to GST notices or scrutiny',
    'Refund claim filing',
    'Delays due to sales/purchase data not shared on time',
    'Late fees if filing delayed because of your data delays',
    'Reconciliation of mismatched invoices beyond basic review'
  ],
  updated_at = now()
WHERE slug = 'gst-monthly-filing';

-- 7. Business ITR Filing
UPDATE service_packages
SET
  scope_included = ARRAY[
    'Financial statements review and analysis',
    'Profit & Loss account verification',
    'Balance sheet verification',
    'Tax computation with all applicable deductions',
    'ITR form identification (ITR-3/ITR-5/ITR-6 as applicable)',
    'Tax planning suggestions for next year',
    'E-filing on Income Tax portal',
    'ITR-V acknowledgment',
    'Response to intimation under Section 143(1)'
  ],
  scope_excluded = ARRAY[
    'Statutory audit (required if turnover exceeds limits)',
    'Tax audit under Section 44AB',
    'Transfer pricing documentation',
    'International taxation matters',
    'Revised return filing if errors discovered later',
    'Response to scrutiny notice under Section 143(2)',
    'Delays due to books of accounts not finalized',
    'Delays due to missing invoices, bank statements, or Form 26AS mismatches'
  ],
  updated_at = now()
WHERE slug = 'business-itr';

-- 8. MCA Annual Filing
UPDATE service_packages
SET
  scope_included = ARRAY[
    'AOC-4 (Financial Statements) preparation and filing',
    'MGT-7/MGT-7A (Annual Return) preparation and filing',
    'Board resolution drafting for approvals',
    'DIR-3 KYC reminder coordination',
    'Filing fee payment to MCA',
    'Acknowledgment receipts for all filings',
    'Next year compliance calendar'
  ],
  scope_excluded = ARRAY[
    'Statutory audit of financial statements (must be done before filing)',
    'DIR-3 KYC for individual directors (₹1,499 per director)',
    'Change in directors or designated partners',
    'Increase in authorized capital',
    'Change in registered office address',
    'Delays due to audit report not being ready',
    'Delays due to directors not completing their KYC',
    'Additional late filing fees if deadlines missed due to your delays'
  ],
  updated_at = now()
WHERE slug = 'mca-annual-filing';

-- 9. Cloud Kitchen Setup (Bundle)
UPDATE service_packages
SET
  scope_included = ARRAY[
    'FSSAI License (State License for turnover ₹12L-20Cr)',
    'GST Registration',
    'Shop & Establishment Registration',
    'Trade License application (municipal corporation)',
    'All four licenses filed simultaneously',
    'Single point of contact for everything',
    'Consolidated document checklist',
    'Combined compliance calendar after setup',
    'Priority processing for faster go-live'
  ],
  scope_excluded = ARRAY[
    'Fire NOC (requires physical premises inspection)',
    'Pollution NOC (if required in your municipal area)',
    'FSSAI Central License (for turnover above ₹20Cr)',
    'Swiggy/Zomato aggregator onboarding',
    'Cloud kitchen premises search or rental',
    'Kitchen equipment procurement',
    'Delays due to premises documents not ready (rent agreement, NOC from landlord)',
    'Delays due to municipal inspection requiring premises modifications',
    'Health department inspections and their requirements'
  ],
  updated_at = now()
WHERE slug = 'cloud-kitchen-setup';
