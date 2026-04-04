-- =============================================================================
-- Migration: Update all service pricing as per April 2026 price list
-- Updates price_base_paisa (Ollvy fee) and price_govt_fees_paisa (Govt fee)
-- All prices in paisa (multiply rupees by 100)
-- =============================================================================

-- Company Registration
UPDATE service_packages SET price_base_paisa = 599900, price_govt_fees_paisa = 799900 WHERE slug = 'pvt-ltd-incorporation';
UPDATE service_packages SET price_base_paisa = 499900, price_govt_fees_paisa = 500000 WHERE slug = 'llp-incorporation';
UPDATE service_packages SET price_base_paisa = 499900, price_govt_fees_paisa = 499900 WHERE slug = 'opc-incorporation';
UPDATE service_packages SET price_base_paisa = 249900, price_govt_fees_paisa = 99900 WHERE slug = 'partnership-registration';

-- Tax Registration & Filing
UPDATE service_packages SET price_base_paisa = 149900, price_govt_fees_paisa = 0 WHERE slug = 'gst-registration';
UPDATE service_packages SET price_base_paisa = 149900, price_govt_fees_paisa = 0 WHERE slug = 'gst-monthly-50l';
UPDATE service_packages SET price_base_paisa = 299900, price_govt_fees_paisa = 0 WHERE slug = 'gst-annual-return';
UPDATE service_packages SET price_base_paisa = 99900, price_govt_fees_paisa = 0 WHERE slug = 'gst-lut';
UPDATE service_packages SET price_base_paisa = 99900, price_govt_fees_paisa = 0 WHERE slug = 'gst-cancellation';
UPDATE service_packages SET price_base_paisa = 249900, price_govt_fees_paisa = 0 WHERE slug = 'gst-revocation';
UPDATE service_packages SET price_base_paisa = 499900, price_govt_fees_paisa = 0 WHERE slug = 'business-itr';
UPDATE service_packages SET price_base_paisa = 99900, price_govt_fees_paisa = 0 WHERE slug = 'tds-monthly-compliance';

-- MCA Compliance
UPDATE service_packages SET price_base_paisa = 299900, price_govt_fees_paisa = 60000 WHERE slug = 'mca-annual-filing';
UPDATE service_packages SET price_base_paisa = 49900, price_govt_fees_paisa = 0 WHERE slug = 'director-kyc';
UPDATE service_packages SET price_base_paisa = 199900, price_govt_fees_paisa = 500000 WHERE slug = 'din-reactivation';
UPDATE service_packages SET price_base_paisa = 249900, price_govt_fees_paisa = 200000 WHERE slug = 'roc-changes';
UPDATE service_packages SET price_base_paisa = 499900, price_govt_fees_paisa = 300000 WHERE slug = 'company-name-change';
UPDATE service_packages SET price_base_paisa = 1799900, price_govt_fees_paisa = 0 WHERE slug = 'statutory-audit';

-- Licensing
UPDATE service_packages SET price_base_paisa = 299900, price_govt_fees_paisa = 450000 WHERE slug = 'trademark-registration';
UPDATE service_packages SET price_base_paisa = 199900, price_govt_fees_paisa = 200000 WHERE slug = 'fssai-license';
UPDATE service_packages SET price_base_paisa = 99900, price_govt_fees_paisa = 50000 WHERE slug = 'iec-code';
UPDATE service_packages SET price_base_paisa = 29900, price_govt_fees_paisa = 0 WHERE slug = 'msme-registration';
UPDATE service_packages SET price_base_paisa = 99900, price_govt_fees_paisa = 99900 WHERE slug = 'shop-establishment';
UPDATE service_packages SET price_base_paisa = 29900, price_govt_fees_paisa = 0 WHERE slug = 'professional-tax';
UPDATE service_packages SET price_base_paisa = 199900, price_govt_fees_paisa = 0 WHERE slug = 'startup-india';
UPDATE service_packages SET price_base_paisa = 299900, price_govt_fees_paisa = 50000 WHERE slug = 'copyright-registration';
UPDATE service_packages SET price_base_paisa = 1999900, price_govt_fees_paisa = 210000 WHERE slug = 'cloud-kitchen-setup';

-- Payroll & Accounting
UPDATE service_packages SET price_base_paisa = 149900, price_govt_fees_paisa = 0 WHERE slug = 'payroll-management';
UPDATE service_packages SET price_base_paisa = 99900, price_govt_fees_paisa = 0 WHERE slug = 'esi-registration';
UPDATE service_packages SET price_base_paisa = 99900, price_govt_fees_paisa = 0 WHERE slug = 'pf-registration';
UPDATE service_packages SET price_base_paisa = 249900, price_govt_fees_paisa = 0 WHERE slug = 'accounting-bookkeeping';

-- Update SEO titles and descriptions with new prices
UPDATE service_packages SET
  seo_title = 'Private Limited Company Registration Online | ₹13,998 | Ollvy',
  seo_description = 'Register your Pvt Ltd company in 15 working days. Includes DSC, DIN, name approval, MOA/AOA, PAN, TAN. Fixed price ₹13,998. MCA-compliant.'
WHERE slug = 'pvt-ltd-incorporation';

UPDATE service_packages SET
  seo_title = 'LLP Registration Online India | ₹9,999 | Ollvy',
  seo_description = 'Register your Limited Liability Partnership in India. Includes DPIN, DSC, name reservation, and LLP Agreement. Fixed price ₹9,999.'
WHERE slug = 'llp-incorporation';

UPDATE service_packages SET
  seo_title = 'OPC Registration Online | ₹9,998 | Ollvy',
  seo_description = 'Register your One Person Company in 12 working days. Single owner, limited liability. Fixed price ₹9,998.'
WHERE slug = 'opc-incorporation';

UPDATE service_packages SET
  seo_title = 'Partnership Firm Registration | ₹3,498 | Ollvy',
  seo_description = 'Register partnership with drafted deed in 7 days. Fixed price ₹3,498.'
WHERE slug = 'partnership-registration';

UPDATE service_packages SET
  seo_title = 'GST Registration Online India - GSTIN in 7 Days | ₹1,499 | Ollvy',
  seo_description = 'Get your GSTIN in 7 working days. No government fee. Fixed price ₹1,499. CA assigned same day.'
WHERE slug = 'gst-registration';

UPDATE service_packages SET
  seo_title = 'GST Monthly Filing Service | GSTR-1 & GSTR-3B | ₹1,499/month | Ollvy',
  seo_description = 'Monthly GST filing handled by verified CA. GSTR-1 by 11th, GSTR-3B by 20th. Fixed price ₹1,499/month.'
WHERE slug = 'gst-monthly-50l';

UPDATE service_packages SET
  seo_title = 'GSTR-9 Annual Return Filing | ₹2,999 | Ollvy',
  seo_description = 'File GSTR-9 before Dec 31. Fixed price ₹2,999.'
WHERE slug = 'gst-annual-return';

UPDATE service_packages SET
  seo_title = 'GST LUT Filing | ₹999 | Ollvy',
  seo_description = 'File LUT for zero-rated exports. Annual filing. Fixed price ₹999.'
WHERE slug = 'gst-lut';

UPDATE service_packages SET
  seo_title = 'GST Cancellation | ₹999 | Ollvy',
  seo_description = 'Cancel GST registration. Final return included. Fixed price ₹999.'
WHERE slug = 'gst-cancellation';

UPDATE service_packages SET
  seo_title = 'GST Revocation | ₹2,499 | Ollvy',
  seo_description = 'Restore cancelled GST registration. Urgent filing. Fixed price ₹2,499.'
WHERE slug = 'gst-revocation';

UPDATE service_packages SET
  seo_title = 'Business ITR Filing 2025 | ITR-6, ITR-5 | ₹4,999 | Ollvy',
  seo_description = 'File your company ITR before Oct 31. Fixed price ₹4,999. Verified CA assigned within 24 hours.'
WHERE slug = 'business-itr';

UPDATE service_packages SET
  seo_title = 'TDS Filing Monthly Service | ₹999/mo | Ollvy',
  seo_description = 'Monthly TDS compliance. Fixed ₹999/month.'
WHERE slug = 'tds-monthly-compliance';

UPDATE service_packages SET
  seo_title = 'MCA Annual Filing AOC-4 MGT-7 | ₹3,599 | Ollvy',
  seo_description = 'File AOC-4 and MGT-7 before due date. Fixed price ₹3,599 including govt fees.'
WHERE slug = 'mca-annual-filing';

UPDATE service_packages SET
  seo_title = 'Director KYC 2026 | DIR-3 KYC Filing | ₹499 | Ollvy',
  seo_description = 'File DIR-3 KYC before Sep 30. Avoid DIN deactivation and ₹5,000/day penalty. Fixed price ₹499.'
WHERE slug = 'director-kyc';

UPDATE service_packages SET
  seo_title = 'DIN Reactivation | ₹6,999 | Ollvy',
  seo_description = 'Reactivate your DIN. Resume directorship. Fixed price ₹6,999 including govt fees.'
WHERE slug = 'din-reactivation';

UPDATE service_packages SET
  seo_title = 'ROC Change Filing | ₹4,499 | Ollvy',
  seo_description = 'File ROC form for any company change. Fixed price ₹4,499 including govt fees.'
WHERE slug = 'roc-changes';

UPDATE service_packages SET
  seo_title = 'Company Name Change | ₹7,999 | Ollvy',
  seo_description = 'Change your company name with MCA. New certificate issued. Fixed price ₹7,999 including govt fees.'
WHERE slug = 'company-name-change';

UPDATE service_packages SET
  seo_title = 'Statutory Audit | ₹17,999 | Ollvy',
  seo_description = 'Independent audit by qualified CA. Fixed price ₹17,999.'
WHERE slug = 'statutory-audit';

UPDATE service_packages SET
  seo_title = 'Trademark Registration India | ₹7,499 | 10-Year Protection | Ollvy',
  seo_description = 'Register your trademark. Application filed within 7 days. ₹2,999 + ₹4,500 govt fee. Trademark search included.'
WHERE slug = 'trademark-registration';

UPDATE service_packages SET
  seo_title = 'FSSAI License Online India | Registration & State License | ₹3,999 | Ollvy',
  seo_description = 'Get your FSSAI license in 10 working days. Fixed price ₹3,999 including govt fees.'
WHERE slug = 'fssai-license';

UPDATE service_packages SET
  seo_title = 'IEC Code Import Export License | ₹1,499 | Ollvy',
  seo_description = 'Get IEC code for import/export. Fixed price ₹1,499 including govt fees.'
WHERE slug = 'iec-code';

UPDATE service_packages SET
  seo_title = 'MSME Udyam Registration | ₹299 | Ollvy',
  seo_description = 'Get Udyam certificate in 2 days. Unlock govt schemes. Fixed price ₹299.'
WHERE slug = 'msme-registration';

UPDATE service_packages SET
  seo_title = 'Shop & Establishment License | ₹1,998 | Ollvy',
  seo_description = 'Get shop act license in 10 days. State-compliant. Fixed price ₹1,998 including govt fees.'
WHERE slug = 'shop-establishment';

UPDATE service_packages SET
  seo_title = 'Professional Tax Registration | ₹299 | Ollvy',
  seo_description = 'PT registration in 5 days. Employer and employee coverage. Fixed price ₹299.'
WHERE slug = 'professional-tax';

UPDATE service_packages SET
  seo_title = 'DPIIT Startup India Registration | ₹1,999 | Ollvy',
  seo_description = 'Get DPIIT recognition in 7 days. Unlock tax benefits. Fixed price ₹1,999.'
WHERE slug = 'startup-india';

UPDATE service_packages SET
  seo_title = 'Copyright Registration | ₹3,499 | Ollvy',
  seo_description = 'Copyright registration for creative works. Fixed price ₹3,499 including govt fees.'
WHERE slug = 'copyright-registration';

UPDATE service_packages SET
  seo_title = 'Cloud Kitchen Setup Bundle | ₹22,099 | Ollvy',
  seo_description = 'FSSAI, GST, Shop Act, Trade License - filed simultaneously for your cloud kitchen. Fixed price ₹22,099 including govt fees.'
WHERE slug = 'cloud-kitchen-setup';

UPDATE service_packages SET
  seo_title = 'Payroll Services | Salary, TDS, PF, ESI | ₹1,499/mo | Ollvy',
  seo_description = 'Full payroll service. Fixed ₹1,499/month for up to 10 employees.'
WHERE slug = 'payroll-management';

UPDATE service_packages SET
  seo_title = 'ESI Registration | ₹999 | Ollvy',
  seo_description = 'ESIC registration for employee medical benefits. Fixed price ₹999.'
WHERE slug = 'esi-registration';

UPDATE service_packages SET
  seo_title = 'PF Registration | ₹999 | Ollvy',
  seo_description = 'EPFO registration for provident fund. Fixed price ₹999.'
WHERE slug = 'pf-registration';

UPDATE service_packages SET
  seo_title = 'Accounting Bookkeeping Service | ₹2,499/mo | Ollvy',
  seo_description = 'Monthly bookkeeping. Audit-ready books. Fixed price ₹2,499/month.'
WHERE slug = 'accounting-bookkeeping';

-- =============================================================================
-- Update unlocks/related service prices in JSON fields
-- =============================================================================

-- Pvt Ltd unlocks
UPDATE service_packages SET unlocks = '[
  {"name": "GST Registration", "explanation": "Required once you start billing. Mandatory above ₹40L turnover.", "price": "₹1,499", "type": "required", "slug": "gst-registration"},
  {"name": "Trademark Registration", "explanation": "Protect your company name and brand.", "price": "₹7,499", "type": "beneficial", "slug": "trademark-registration"},
  {"name": "Startup India Registration", "explanation": "Tax benefits for eligible startups.", "price": "₹1,999", "type": "beneficial", "slug": "startup-india"}
]'::jsonb WHERE slug = 'pvt-ltd-incorporation';

-- LLP unlocks
UPDATE service_packages SET unlocks = '[
  {"name": "GST Registration", "explanation": "Required once turnover crosses ₹20L for services.", "price": "₹1,499", "type": "required", "slug": "gst-registration"},
  {"name": "Business ITR (ITR-5)", "explanation": "LLPs file ITR-5 by October 31 every year.", "price": "₹4,999", "type": "required", "slug": "business-itr"}
]'::jsonb WHERE slug = 'llp-incorporation';

-- GST Registration unlocks
UPDATE service_packages SET unlocks = '[
  {"name": "GST Monthly Filing", "explanation": "GSTR-1 by 11th, GSTR-3B by 20th. Every month. Mandatory.", "price": "₹1,499/month", "type": "required", "slug": "gst-monthly-50l"},
  {"name": "GSTR-9 Annual Return", "explanation": "Annual reconciliation. Due Dec 31 every year.", "price": "₹2,999", "type": "required", "slug": "gst-annual-return"}
]'::jsonb WHERE slug = 'gst-registration';

-- GST Monthly unlocks
UPDATE service_packages SET unlocks = '[
  {"name": "GSTR-9 Annual Return", "explanation": "Annual reconciliation. Due Dec 31 every year.", "price": "₹2,999", "type": "required", "slug": "gst-annual-return"}
]'::jsonb WHERE slug = 'gst-monthly-50l';

-- Business ITR unlocks
UPDATE service_packages SET unlocks = '[
  {"name": "Statutory Audit", "explanation": "Required above ₹1Cr turnover. Must be done before ITR.", "price": "₹17,999", "type": "required", "slug": "statutory-audit"}
]'::jsonb WHERE slug = 'business-itr';

-- Trademark unlocks
UPDATE service_packages SET unlocks = '[
  {"name": "Trademark Renewal", "explanation": "Due every 10 years.", "price": "₹4,999 + govt fee", "type": "required", "slug": "trademark-renewal"},
  {"name": "Copyright Registration", "explanation": "Protect creative works - code, designs, content.", "price": "₹3,499", "type": "beneficial", "slug": "copyright-registration"}
]'::jsonb WHERE slug = 'trademark-registration';

-- FSSAI unlocks
UPDATE service_packages SET unlocks = '[
  {"name": "GST Registration", "explanation": "Mandatory once turnover crosses ₹20L.", "price": "₹1,499", "type": "required", "slug": "gst-registration"}
]'::jsonb WHERE slug = 'fssai-license';

-- IEC unlocks
UPDATE service_packages SET unlocks = '[
  {"name": "GST Registration", "explanation": "Required for claiming GST refunds on exports.", "price": "₹1,499", "type": "required", "slug": "gst-registration"}
]'::jsonb WHERE slug = 'iec-code';

-- MCA Annual Filing unlocks
UPDATE service_packages SET unlocks = '[
  {"name": "Director KYC", "explanation": "Due Sep 30 every year. ₹5,000/day penalty.", "price": "₹499", "type": "required", "slug": "director-kyc"},
  {"name": "Business ITR", "explanation": "ITR-6 due Oct 31 every year.", "price": "₹4,999", "type": "required", "slug": "business-itr"}
]'::jsonb WHERE slug = 'mca-annual-filing';

-- TDS Monthly unlocks
UPDATE service_packages SET unlocks = '[
  {"name": "Payroll Management", "explanation": "Full payroll including salary TDS.", "price": "₹1,499/month", "type": "beneficial", "slug": "payroll-management"}
]'::jsonb WHERE slug = 'tds-monthly-compliance';

-- Payroll unlocks
UPDATE service_packages SET unlocks = '[
  {"name": "TDS Monthly", "explanation": "For contractor/vendor payments.", "price": "₹999/month", "type": "beneficial", "slug": "tds-monthly-compliance"}
]'::jsonb WHERE slug = 'payroll-management';

-- OPC unlocks
UPDATE service_packages SET unlocks = '[
  {"name": "GST Registration", "explanation": "Required once billing starts.", "price": "₹1,499", "type": "required", "slug": "gst-registration"}
]'::jsonb WHERE slug = 'opc-incorporation';

-- Partnership unlocks
UPDATE service_packages SET unlocks = '[
  {"name": "GST Registration", "explanation": "Required for billing.", "price": "₹1,499", "type": "required", "slug": "gst-registration"}
]'::jsonb WHERE slug = 'partnership-registration';
