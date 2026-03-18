-- =============================================================================
-- Migration: Seed all 32+ services with complete detailed content
-- All content editable from database - no static configs needed
-- =============================================================================

-- First, clear existing services to avoid conflicts
DELETE FROM service_packages;

-- Create tier groups
INSERT INTO service_tier_groups (id, name, description) VALUES
  ('00000000-0000-0000-0001-000000000001', 'GST Monthly Filing', 'Monthly GST compliance tiers by turnover'),
  ('00000000-0000-0000-0001-000000000002', 'Payroll Management', 'Monthly payroll tiers by employee count')
ON CONFLICT DO NOTHING;

-- =====================
-- 1. PRIVATE LIMITED INCORPORATION
-- =====================
INSERT INTO service_packages (
  slug, name, short_name, category, tagline, short_description,
  order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate,
  sla_working_days, urgency_score, situation_tags, is_active, display_order,
  service_type, mandatory_for, legal_basis, penalty_for_missing, penalty_color,
  seo_title, seo_description, canonical_url,
  govt_fee_label, govt_fee_note,
  workflow_stages, whats_included, service_risks, profile_personas, faqs, review_sources, unlocks, review_keyword_chips, related_slugs
) VALUES (
  'pvt-ltd-incorporation',
  'Private Limited Company Registration',
  'Pvt Ltd',
  'Company Registration',
  'Your company, incorporated. MCA-compliant, with PAN and TAN ready.',
  'Incorporate your business as a Private Limited Company with full MCA compliance',
  'one_time', 'one_time', 1499900, 799900, 18,
  15, 95, ARRAY['just_starting_out', 'have_investors'], true, 1,
  'One-time', 'Startups raising investment, businesses with multiple founders', 'Companies Act, 2013', NULL, 'none',
  'Private Limited Company Registration Online | ₹22,999 | Ollvy',
  'Register your Pvt Ltd company in 15 working days. Includes DSC, DIN, name approval, MOA/AOA, PAN, TAN. Fixed price ₹22,999. MCA-compliant.',
  'https://ollvy.com/services/pvt-ltd-incorporation',
  'MCA filing fees', 'Paid to Ministry of Corporate Affairs. Includes stamp duty, filing fees, and name reservation.',
  '[
    {"step": 1, "title": "Answer 5 questions - we build your personalised checklist", "timeline": "Day 0", "body": "Number of directors, shareholders, proposed company name (3 options), registered office state, and authorised capital. A company secretary is assigned within 4 hours.", "visual": "checklist", "milestone": "CS assigned, checklist sent"},
    {"step": 2, "title": "Upload documents through the app", "timeline": "Day 0-2", "body": "PAN and Aadhaar for all directors, address proof for registered office, passport photos. Your CS verifies each document before filing.", "visual": "upload", "milestone": "Documents verified by CS"},
    {"step": 3, "title": "DSC and DIN obtained for all directors", "timeline": "Day 2-4", "body": "Digital Signature Certificates and Director Identification Numbers are mandatory. We file applications and guide video verification.", "visual": "form", "milestone": "DSC and DIN ready"},
    {"step": 4, "title": "Name approved via RUN (Reserve Unique Name)", "timeline": "Day 4-7", "body": "Your CS files RUN with MCA. Name approval typically takes 2-3 working days. If rejected, we file alternatives immediately.", "visual": "form", "milestone": "Company name approved"},
    {"step": 5, "title": "SPICe+ filed - MOA, AOA, PAN, TAN in one application", "timeline": "Day 7-12", "body": "The integrated SPICe+ form files everything: MOA, AOA, PAN application, TAN application, GST registration (optional). All in one submission.", "visual": "form", "milestone": "SPICe+ submitted to MCA"},
    {"step": 6, "title": "Certificate of Incorporation issued", "timeline": "Day 12-15", "body": "MCA issues the Certificate of Incorporation with your CIN. PAN and TAN are generated automatically. All documents uploaded to your account.", "visual": "stamp", "isCompletion": true, "milestone": "Company incorporated"}
  ]'::jsonb,
  '[
    {"title": "DSC for all directors - video verification guided", "body": "Digital Signature Certificates are mandatory for all directors. We arrange the tokens and guide each director through video verification. Takes 15 minutes per director.", "comparisonWithout": "Navigate DSC portal yourself - 3+ hours", "comparisonWithOllvy": "Guided flow in app - 15 minutes"},
    {"title": "DIN obtained - no separate application", "body": "Director Identification Number is part of SPICe+. We file it simultaneously. No separate DIR-3 application needed.", "comparisonWithout": "File DIR-3 separately - add 3-5 days", "comparisonWithOllvy": "DIN included in SPICe+ - no extra time"},
    {"title": "MOA and AOA drafted - not templated", "body": "Memorandum and Articles are drafted based on your actual business activities. Main objects, ancillary objects, and authorised capital tailored to your plans.", "comparisonWithout": "Generic template that needs amendment later", "comparisonWithOllvy": "Custom drafting based on your business"},
    {"title": "PAN and TAN - automatic with incorporation", "body": "SPICe+ includes PAN and TAN applications. Both are issued within 24 hours of Certificate of Incorporation. No separate applications.", "mockVisualType": "status", "mockVisualData": {"row1": "PAN: Applied automatically ✓", "row2": "TAN: Applied automatically ✓", "row3": "GST: Optional at incorporation", "note": "All issued with Certificate of Incorporation"}},
    {"title": "Compliance calendar populated automatically", "body": "The moment your company is incorporated, your compliance calendar shows all mandatory filings: first board meeting (30 days), ADT-1 (15 days), DIR-12 (30 days from appointment changes).", "mockVisualType": "calendar", "mockVisualData": {"row1": "First Board Meeting - within 30 days", "row2": "ADT-1 (Auditor appointment) - within 15 days of AGM", "row3": "DIR-3 KYC - Sep 30 annually", "note": "Added to your calendar automatically"}}
  ]'::jsonb,
  '[
    {"icon": "document", "title": "Director documents don''t match", "body": "PAN name, Aadhaar name, and bank records must match exactly. ''Rajesh Kumar'' vs ''Rajesh K'' causes rejection. We verify all documents for consistency before filing."},
    {"icon": "clock", "title": "Name rejected multiple times", "body": "MCA rejects names similar to existing companies or trademarked terms. Submit 3 distinct options. We search MCA and trademark databases before filing."},
    {"icon": "building", "title": "Registered office proof invalid", "body": "If using a rented office, you need NOC from landlord plus utility bill. Home address works but needs family member NOC if not in director''s name. We verify this upfront."}
  ]'::jsonb,
  '[
    {"label": "First company", "detail": "Never incorporated before. We explain every document and step in plain English."},
    {"label": "Converting from proprietorship", "detail": "Already running a business, now incorporating. Asset transfer and compliance handled."},
    {"label": "Have co-founders", "detail": "Multiple directors and shareholders. Shareholding pattern and MOA clauses drafted accordingly."},
    {"label": "Raising investment soon", "detail": "Investor-ready structure. Authorised capital set appropriately. Board composition planned."}
  ]'::jsonb,
  '[
    {"category": "General", "q": "How long does incorporation take?", "a": "15 working days end-to-end. DSC: 2 days. Name approval: 3 days. SPICe+ filing and approval: 10 days. We cannot speed up MCA processing, but we file the moment documents are ready."},
    {"category": "General", "q": "What is the minimum capital required?", "a": "No minimum paid-up capital required. Authorised capital can be ₹1 lakh (recommended minimum for credibility). Stamp duty is based on authorised capital and state."},
    {"category": "Process", "q": "Can I be the only director?", "a": "Pvt Ltd requires minimum 2 directors and 2 shareholders. For single-person ownership, consider OPC (One Person Company) instead."},
    {"category": "Process", "q": "What if my name is rejected?", "a": "We search MCA and trademark databases before filing to minimise rejection risk. If rejected, we file alternative names immediately at no extra cost."},
    {"category": "Documents", "q": "What documents do directors need?", "a": "PAN card, Aadhaar card, passport-size photo, mobile number linked to Aadhaar (for OTP), and address proof. Directors must complete video verification for DSC."},
    {"category": "After Completion", "q": "What are my obligations after incorporation?", "a": "First board meeting within 30 days. Open current account. Appoint auditor within 30 days of incorporation. File ADT-1 within 15 days of AGM. DIR-3 KYC every September."}
  ]'::jsonb,
  '[
    {"name": "MCA21 Portal", "url": "https://www.mca.gov.in", "description": "Ministry of Corporate Affairs - company registration and filings"},
    {"name": "Companies Act, 2013", "url": "https://www.mca.gov.in/Ministry/pdf/CompaniesAct2013.pdf", "description": "Section 7: Incorporation. Section 12: Registered office. Section 149: Directors."}
  ]'::jsonb,
  '[
    {"name": "GST Registration", "explanation": "Required once you start billing. Mandatory above ₹40L turnover.", "price": "₹8,999", "type": "required", "slug": "gst-registration"},
    {"name": "Trademark Registration", "explanation": "Protect your company name and brand.", "price": "₹12,499", "type": "beneficial", "slug": "trademark-registration"},
    {"name": "Startup India Registration", "explanation": "Tax benefits for eligible startups.", "price": "₹7,999", "type": "beneficial", "slug": "startup-india"}
  ]'::jsonb,
  ARRAY['✓ Incorporated in 12 days', '✓ CS was responsive', '✓ Documents verified properly', '✓ No hidden charges', '✓ Calendar setup included'],
  ARRAY['llp-incorporation', 'gst-registration', 'trademark-registration']
);

-- =====================
-- 2. LLP INCORPORATION
-- =====================
INSERT INTO service_packages (
  slug, name, short_name, category, tagline, short_description,
  order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate,
  sla_working_days, urgency_score, situation_tags, is_active, display_order,
  service_type, mandatory_for, legal_basis, penalty_for_missing, penalty_color,
  seo_title, seo_description, canonical_url,
  govt_fee_label, govt_fee_note,
  workflow_stages, whats_included, service_risks, profile_personas, faqs, review_sources, unlocks, review_keyword_chips, related_slugs
) VALUES (
  'llp-incorporation',
  'LLP Incorporation',
  'LLP',
  'Company Registration',
  'Limited liability. Flexible structure. Professional services-ready.',
  'Register your Limited Liability Partnership with MCA',
  'one_time', 'one_time', 799900, 500000, 18,
  12, 80, ARRAY['just_starting_out', 'professional_services'], true, 2,
  'One-time', 'Professionals, consultants, and service firms', 'Limited Liability Partnership Act, 2008', NULL, 'none',
  'LLP Registration Online India | ₹12,999 | Ollvy',
  'Register your Limited Liability Partnership in India. Includes DPIN, DSC, name reservation, and LLP Agreement. Fixed price ₹12,999.',
  'https://ollvy.com/services/llp-incorporation',
  'MCA filing fees', 'Paid to Ministry of Corporate Affairs. Standard for up to ₹1L contribution.',
  '[
    {"step": 1, "title": "Answer questions - we build your checklist", "timeline": "Day 0", "body": "Business type, number of partners, proposed LLP name (3 options), registered state, capital contribution split. A company secretary is assigned within 4 hours.", "visual": "checklist", "milestone": "Company secretary assigned"},
    {"step": 2, "title": "Upload documents through the app", "timeline": "Day 0-1", "body": "PAN and Aadhaar for all partners, registered address proof, capital contribution details. Your CS verifies each document before filing.", "visual": "upload", "milestone": "Documents verified by CS"},
    {"step": 3, "title": "DPIN and DSC arranged", "timeline": "Day 1-3", "body": "Designated Partner Identification Number is required for all partners. We file DPIN applications and arrange DSC tokens.", "visual": "form", "milestone": "DPIN applications filed"},
    {"step": 4, "title": "Name reservation and FiLLiP filed", "timeline": "Day 4-9", "body": "FiLLiP is the integrated LLP incorporation form. Your CS drafts the LLP Agreement and files with MCA.", "visual": "form", "milestone": "FiLLiP submitted to MCA"},
    {"step": 5, "title": "LLPIN issued - your partnership exists", "timeline": "Day 10-12", "body": "MCA issues the Certificate of Incorporation with your LLP Identification Number. PAN is generated automatically.", "visual": "stamp", "isCompletion": true, "milestone": "Certificate of Incorporation issued"}
  ]'::jsonb,
  '[
    {"title": "LLP Agreement drafted - not templated", "body": "The LLP Agreement defines profit-sharing, decision-making authority, and exit clauses. Your CS drafts this based on your actual partnership arrangement.", "comparisonWithout": "Generic 50-50 template that needs amendment later", "comparisonWithOllvy": "Custom agreement reflecting your actual split and roles"},
    {"title": "DPIN for all designated partners", "body": "Every designated partner needs a DPIN. We file all applications simultaneously and track approvals. No separate charges per partner.", "comparisonWithout": "File DPIN separately - add 3-5 days", "comparisonWithOllvy": "DPIN included as part of FiLLiP - no extra time"},
    {"title": "DSC arranged - video verification guided", "body": "Digital Signature Certificates required for all partners. We arrange tokens and guide each partner through video verification.", "comparisonWithout": "Navigate DSC portal yourself - 3+ hours", "comparisonWithOllvy": "Guided flow in app - 15 minutes"},
    {"title": "Compliance calendar auto-populated", "body": "Once LLPIN is issued, your calendar is updated with LLP annual return (Form 11) and Statement of Accounts (Form 8) due dates.", "mockVisualType": "calendar", "mockVisualData": {"row1": "LLP Form 11 (Annual Return) - Due May 30", "row2": "LLP Form 8 (Statement of Accounts) - Due Oct 30", "row3": "Partner KYC - Due Sep 30 every year", "note": "Added to your calendar automatically"}}
  ]'::jsonb,
  '[
    {"icon": "document", "title": "Name similarity rejection", "body": "LLP names must be distinct from existing LLPs and companies. We check against both registries before submission."},
    {"icon": "alert", "title": "Capital contribution not defined clearly", "body": "The LLP Agreement must specify each partner''s capital contribution and profit share. We draft explicit percentages."},
    {"icon": "clock", "title": "Partner slow on DSC verification", "body": "FiLLiP cannot be filed until all partners complete DSC video verification. We send daily reminders."}
  ]'::jsonb,
  '[
    {"label": "Professional services firm", "detail": "Architects, lawyers, CAs, consultants - LLP is the default structure for you."},
    {"label": "Two equal partners", "detail": "50-50 split. Agreement drafted to handle deadlock scenarios."},
    {"label": "Three partners, unequal contribution", "detail": "Different capital contributions. Profit share can match or differ."},
    {"label": "Converting from partnership", "detail": "Existing partnership firm converting to LLP. Assets transfer handled."}
  ]'::jsonb,
  '[
    {"category": "General", "q": "What is an LLP?", "a": "A Limited Liability Partnership combines the flexibility of a partnership with the liability protection of a company. Partners have limited liability."},
    {"category": "General", "q": "LLP vs Pvt Ltd - which should I choose?", "a": "LLP if you''re a professional services firm and don''t plan to raise equity investment. Pvt Ltd if you plan to raise investment."},
    {"category": "Process", "q": "How many partners are required?", "a": "Minimum 2 designated partners. No maximum limit. At least 2 must be resident Indians."},
    {"category": "Documents", "q": "What documents do partners need?", "a": "PAN card, Aadhaar card, address proof. For the LLP: registered office address proof."},
    {"category": "After Completion", "q": "What are the annual compliance requirements?", "a": "Form 11 (Annual Return) by May 30. Form 8 (Statement of Accounts) by October 30. ITR-5 by October 31."}
  ]'::jsonb,
  '[
    {"name": "MCA - LLP Portal", "url": "https://llp.mca.gov.in", "description": "Ministry of Corporate Affairs - LLP registration and filings"},
    {"name": "LLP Act, 2008", "url": "https://www.mca.gov.in/Ministry/actsbills/pdf/LLP_Act_2008_15jan2009.pdf", "description": "Full text of the Limited Liability Partnership Act"}
  ]'::jsonb,
  '[
    {"name": "GST Registration", "explanation": "Required once turnover crosses ₹20L for services.", "price": "₹8,999", "type": "required", "slug": "gst-registration"},
    {"name": "Business ITR (ITR-5)", "explanation": "LLPs file ITR-5 by October 31 every year.", "price": "₹11,999", "type": "required", "slug": "business-itr"}
  ]'::jsonb,
  ARRAY['✓ Agreement was custom', '✓ LLPIN in 11 days', '✓ CS explained profit split', '✓ No hidden fees'],
  ARRAY['gst-registration', 'business-itr', 'trademark-registration']
);

-- =====================
-- 3. GST REGISTRATION
-- =====================
INSERT INTO service_packages (
  slug, name, short_name, category, tagline, short_description,
  order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate,
  sla_working_days, urgency_score, situation_tags, is_active, display_order,
  service_type, mandatory_for, legal_basis, penalty_for_missing, penalty_color,
  seo_title, seo_description, canonical_url,
  workflow_stages, whats_included, service_risks, profile_personas, faqs, review_sources, unlocks, review_keyword_chips, related_slugs
) VALUES (
  'gst-registration',
  'GST Registration',
  'GST Reg',
  'Tax Registration',
  'Your GSTIN, applied for and obtained. We handle every step.',
  'Register for GST and get your GSTIN within 7 working days',
  'one_time', 'one_time', 899900, 0, 18,
  7, 98, ARRAY['taking_payments', 'just_starting_out', 'importing_exporting'], true, 3,
  'One-time', 'Businesses above ₹40L turnover (₹20L for services)', 'CGST Act 2017, Section 22', '100% of tax due + ₹10,000 minimum', 'red',
  'GST Registration Online India - GSTIN in 7 Days | ₹8,999 | Ollvy',
  'Get your GSTIN in 7 working days. No government fee. Fixed price ₹8,999. CA assigned same day.',
  'https://ollvy.com/services/gst-registration',
  '[
    {"step": 1, "title": "Answer 5 questions - we build your personalised checklist", "timeline": "Day 0", "body": "Business type, state, annual turnover estimate, supply type, and whether you need voluntary registration. A CA is assigned within 4 hours.", "visual": "checklist", "milestone": "CA assigned, personalised checklist sent"},
    {"step": 2, "title": "Upload documents through the app", "timeline": "Day 0-1", "body": "Your CA sends the list in the app. You upload directly. Your CA reviews every upload before filing.", "visual": "upload", "milestone": "Documents verified by CA"},
    {"step": 3, "title": "Application filed - ARN in 24 hours", "timeline": "Day 1-2", "body": "Your CA files GST REG-01 on the GSTN portal. Application Reference Number is generated immediately.", "visual": "form", "milestone": "ARN generated - sent to your app"},
    {"step": 4, "title": "If an officer query arrives, your CA handles it", "timeline": "Day 3-5", "body": "GST officers sometimes request clarifications. Your CA responds within 24 hours. This is within scope.", "visual": "form", "milestone": "Query responded"},
    {"step": 5, "title": "GSTIN issued", "timeline": "Day 5-7", "body": "GSTN issues your GSTIN. It''s permanent - no renewal. Your compliance calendar is updated automatically.", "visual": "stamp", "isCompletion": true, "milestone": "GSTIN active on GSTN portal"}
  ]'::jsonb,
  '[
    {"title": "CA handles the GSTN portal - all 23 fields", "body": "The GST REG-01 form has 23 fields across 5 tabs. Your CA fills the entire form. You answer 5 questions in the app.", "comparisonWithout": "23 fields · 5 tabs · 3-4 hours on GSTN portal", "comparisonWithOllvy": "5 questions in app · ~4 minutes", "mockVisualType": "status", "mockVisualData": {"label": "GST REG-01 Application", "row1": "Business details - complete ✓", "row2": "Promoter/Partner info - complete ✓", "row3": "Place of business - complete ✓", "note": "All 23 fields handled by your CA"}},
    {"title": "ARN shared same day - you can track it yourself", "body": "The ARN is generated the moment your CA submits. We share it immediately. You can verify at gstn.gov.in.", "mockVisualType": "arn", "mockVisualData": {"label": "Application Reference Number", "value": "AA270325014782R", "status": "Processing", "filed": "Filed: 25 Mar 2025", "verify": "Verify at gstn.gov.in"}},
    {"title": "Officer queries handled - no extra charge", "body": "If the GST officer requests clarification, your CA responds within 24 hours. This is part of the service."},
    {"title": "Compliance calendar updated automatically", "body": "The moment your GSTIN is issued, your compliance calendar shows GSTR-1 and GSTR-3B due dates.", "mockVisualType": "calendar", "mockVisualData": {"row1": "GSTR-1 - Due 11th of each month", "row2": "GSTR-3B - Due 20th of each month", "note": "Added to your calendar automatically"}}
  ]'::jsonb,
  '[
    {"icon": "document", "title": "Address proof mismatch", "body": "The business address on your documents must match exactly. Your CA reviews all documents for consistency."},
    {"icon": "clock", "title": "Aadhaar OTP fails", "body": "GST registration requires Aadhaar-based authentication. If mobile number is old, OTP fails. We check this upfront."},
    {"icon": "alert", "title": "Operating without registration", "body": "If turnover has crossed threshold without registration, you''re liable for 100% unpaid tax plus ₹10,000 minimum penalty."}
  ]'::jsonb,
  '[
    {"label": "First GST registration", "detail": "Never done this before. We explain what each document is for."},
    {"label": "Turnover just crossed threshold", "detail": "You waited until legally required. Smart. Now we register you quickly."},
    {"label": "Voluntary registration", "detail": "Below threshold but want to issue GST invoices. Completely legal."},
    {"label": "Home as principal place of business", "detail": "Fully legal. We verify address proof matches your home''s electricity bill."}
  ]'::jsonb,
  '[
    {"category": "General", "q": "When is GST registration mandatory?", "a": "When aggregate turnover crosses ₹40L (₹20L for services, ₹10L for special category states). Also mandatory for inter-state supply."},
    {"category": "General", "q": "Can I register voluntarily below threshold?", "a": "Yes. If you want to issue GST invoices or claim input tax credit, you can register voluntarily."},
    {"category": "Process", "q": "What''s an ARN and why does it matter?", "a": "ARN is Application Reference Number - generated on submission. You can track status yourself."},
    {"category": "Process", "q": "What if the officer raises a query?", "a": "Your CA responds within 24 hours. This is included. Most queries resolve in one reply."},
    {"category": "Documents", "q": "What documents do I need?", "a": "Depends on business type. We send a personalised checklist - not the full 20-item government list."},
    {"category": "After Completion", "q": "What are my obligations after getting GSTIN?", "a": "GSTR-1 by 11th monthly, GSTR-3B by 20th monthly. Even nil returns required. GSTR-9 annually."}
  ]'::jsonb,
  '[
    {"name": "GST Portal", "url": "https://www.gst.gov.in", "description": "Official GSTN portal - registration and filing"},
    {"name": "CGST Act, 2017", "url": "https://www.cbic.gov.in/htdocs-cbec/gst/cgst-act.pdf", "description": "Section 22: Registration thresholds. Section 25: Registration procedure."}
  ]'::jsonb,
  '[
    {"name": "GST Monthly Filing", "explanation": "GSTR-1 by 11th, GSTR-3B by 20th. Every month. Mandatory.", "price": "From ₹2,999/month", "type": "required", "slug": "gst-monthly-50l"},
    {"name": "GSTR-9 Annual Return", "explanation": "Annual reconciliation. Due Dec 31 every year.", "price": "₹8,999", "type": "required", "slug": "gst-annual-return"}
  ]'::jsonb,
  ARRAY['✓ GSTIN in 5 days', '✓ CA was responsive', '✓ ARN shared same day', '✓ No extra charges'],
  ARRAY['gst-monthly-50l', 'pvt-ltd-incorporation', 'business-itr']
);

-- =====================
-- 4. GST MONTHLY FILING - UP TO 50L
-- =====================
INSERT INTO service_packages (
  slug, name, short_name, category, tagline, short_description,
  order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate,
  sla_working_days, urgency_score, situation_tags, is_active, display_order,
  service_type, mandatory_for, legal_basis, penalty_for_missing, penalty_color,
  seo_title, seo_description, canonical_url,
  tier_group_id, tier_label, retainer_cycle_label,
  workflow_stages, whats_included, service_risks, profile_personas, faqs, review_sources, unlocks, review_keyword_chips, related_slugs
) VALUES (
  'gst-monthly-50l',
  'GST Monthly Filing - Up to ₹50L',
  'GST Filing',
  'Monthly Compliance',
  'GSTR-1 by the 11th. GSTR-3B by the 20th. Every month. Handled.',
  'Monthly GST return filing for businesses up to ₹50L turnover',
  'recurring', 'monthly', 299900, 0, 18,
  3, 95, ARRAY['taking_payments', 'filing_taxes'], true, 4,
  'Monthly retainer', 'All GST-registered businesses', 'CGST Act 2017, Section 37 & 39', '₹50/day (min ₹20,000) + 18% interest', 'red',
  'GST Monthly Filing Service | GSTR-1 & GSTR-3B | From ₹2,999/month | Ollvy',
  'Monthly GST filing handled by verified CA. GSTR-1 by 11th, GSTR-3B by 20th. Fixed price from ₹2,999/month.',
  'https://ollvy.com/services/gst-monthly-filing',
  '00000000-0000-0000-0001-000000000001', 'Up to ₹50L/year', 'per month',
  '[
    {"step": 1, "title": "Share your GST portal credentials", "timeline": "Day 0", "body": "You share read-only access. Your CA reviews your filing history and becomes your dedicated CA.", "visual": "checklist", "milestone": "CA assigned to your account"},
    {"step": 2, "title": "Upload sales invoices and purchase data", "timeline": "By 8th of month", "body": "Upload sales invoices and purchase register. If you use Tally or Zoho, export and upload directly.", "visual": "upload", "milestone": "Data received for the month"},
    {"step": 3, "title": "GSTR-1 filed by the 11th", "timeline": "9th-11th", "body": "Your CA files GSTR-1 (outward supplies). You receive acknowledgement in the app.", "visual": "form", "milestone": "GSTR-1 filed and acknowledged"},
    {"step": 4, "title": "GSTR-3B filed by the 20th", "timeline": "18th-20th", "body": "Your CA prepares GSTR-3B, calculates net tax liability, verifies ITC claims, and files.", "visual": "form", "milestone": "GSTR-3B filed and acknowledged"},
    {"step": 5, "title": "Monthly compliance report delivered", "timeline": "21st-25th", "body": "After filing, you receive a monthly report: what was filed, when, acknowledgement numbers.", "visual": "checklist", "isCompletion": true, "milestone": "Monthly report delivered"}
  ]'::jsonb,
  '[
    {"title": "GSTR-1 - outward supply return", "body": "All B2B invoices, B2C sales above ₹2.5L, and export invoices captured. Filed by 11th.", "mockVisualType": "status", "mockVisualData": {"row1": "GSTR-1 · March 2025", "row2": "Filed: 10 Mar 2025", "row3": "ARN: AA1234567890123"}},
    {"title": "GSTR-3B - net tax payment", "body": "Your CA calculates output tax, deducts eligible ITC, and files. Challan generated."},
    {"title": "ITC reconciliation with GSTR-2B", "body": "Your CA matches ITC claimed against GSTR-2B. Mismatches flagged before claiming.", "comparisonWithout": "Claim ITC blindly, get notice later", "comparisonWithOllvy": "ITC verified against GSTR-2B before claiming"},
    {"title": "Monthly compliance report", "body": "After every filing cycle: what was filed, when, acknowledgement numbers, ITC claimed, tax paid.", "mockVisualType": "receipt", "mockVisualData": {"label": "March 2025 Compliance Report", "row1": "GSTR-1: Filed 10 Mar ✓", "row2": "GSTR-3B: Filed 18 Mar ✓", "row3": "Tax Paid: ₹45,230"}}
  ]'::jsonb,
  '[
    {"icon": "clock", "title": "Late filing: ₹50/day, minimum ₹20,000", "body": "GSTR-3B late fee is ₹50/day with minimum ₹20,000 per return. Plus 18% interest on unpaid tax."},
    {"icon": "document", "title": "GSTR-1 and GSTR-3B mismatch", "body": "If figures don''t match, GSTN flags it automatically. We ensure consistency before filing."},
    {"icon": "alert", "title": "ITC claimed but vendor hasn''t filed", "body": "If vendor hasn''t filed GSTR-1, your ITC gets blocked. We check GSTR-2B before claiming."}
  ]'::jsonb,
  '[
    {"label": "First time outsourcing GST", "detail": "Your accountant was handling it. Now you want a professional. We take over seamlessly."},
    {"label": "Multiple GSTINs", "detail": "Multiple states, multiple registrations. We handle all under one retainer."},
    {"label": "High transaction volume", "detail": "500+ invoices/month. Pricing based on turnover, not invoice count."},
    {"label": "Previous CA went quiet", "detail": "Your last CA stopped responding. We don''t do that. SLA is enforced."}
  ]'::jsonb,
  '[
    {"category": "General", "q": "What does the monthly retainer cover?", "a": "GSTR-1 filing by 11th, GSTR-3B filing by 20th, ITC reconciliation, and monthly compliance report."},
    {"category": "General", "q": "Can I cancel anytime?", "a": "Yes. No minimum term. Cancel before 1st of any month."},
    {"category": "Process", "q": "What data do I need to provide each month?", "a": "Sales invoices, purchase register. If you use accounting software, export takes 2 minutes."},
    {"category": "Pricing", "q": "Why do prices vary by turnover?", "a": "Higher turnover = more invoices = more reconciliation work. Base price covers up to ₹50L."}
  ]'::jsonb,
  '[
    {"name": "GST Portal", "url": "https://www.gst.gov.in", "description": "Official GSTN portal for filing GSTR-1, GSTR-3B"},
    {"name": "CGST Act, 2017", "url": "https://www.cbic.gov.in/htdocs-cbec/gst/cgst-act.pdf", "description": "Section 37: GSTR-1. Section 39: GSTR-3B."}
  ]'::jsonb,
  '[
    {"name": "GSTR-9 Annual Return", "explanation": "Annual reconciliation. Due Dec 31 every year.", "price": "₹8,999", "type": "required", "slug": "gst-annual-return"}
  ]'::jsonb,
  ARRAY['✓ Filed on time every month', '✓ CA is responsive', '✓ Monthly report received', '✓ ITC reconciled'],
  ARRAY['gst-registration', 'gst-annual-return', 'business-itr']
);

-- =====================
-- 5. DIRECTOR KYC
-- =====================
INSERT INTO service_packages (
  slug, name, short_name, category, tagline, short_description,
  order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate,
  sla_working_days, urgency_score, situation_tags, is_active, display_order,
  service_type, mandatory_for, legal_basis, penalty_for_missing, penalty_color,
  seo_title, seo_description, canonical_url,
  workflow_stages, whats_included, service_risks, profile_personas, faqs, review_sources, unlocks, review_keyword_chips, related_slugs
) VALUES (
  'director-kyc',
  'Director KYC (DIR-3 KYC)',
  'Director KYC',
  'Annual Compliance',
  'Annual filing. ₹5,000/day penalty if missed. Takes 15 minutes.',
  'Annual director KYC filing - mandatory for all directors',
  'one_time', 'annual', 149900, 0, 18,
  2, 90, ARRAY['have_company', 'annual_filing'], true, 5,
  'Annual', 'All directors of Indian companies', 'Companies (Appointment and Qualification of Directors) Rules, 2014', '₹5,000/day until filed', 'red',
  'Director KYC 2025 | DIR-3 KYC Filing | ₹1,499 | Ollvy',
  'File DIR-3 KYC before Sep 30. Avoid DIN deactivation and ₹5,000/day penalty. Fixed price ₹1,499.',
  'https://ollvy.com/services/director-kyc',
  '[
    {"step": 1, "title": "Upload PAN and Aadhaar", "timeline": "Day 0", "body": "That''s it. Two documents. A CS is assigned within 4 hours and checks your DIN status.", "visual": "upload", "milestone": "Documents received, DIN status checked"},
    {"step": 2, "title": "CS files DIR-3 KYC", "timeline": "Day 1", "body": "Your CS fills the form on MCA21 portal. OTP sent to your mobile. You approve. Form submitted.", "visual": "form", "milestone": "DIR-3 KYC submitted to MCA"},
    {"step": 3, "title": "Acknowledgement delivered", "timeline": "Day 1-2", "body": "MCA processes within 24 hours. Acknowledgement uploaded to your account. Next year''s deadline added to calendar.", "visual": "stamp", "isCompletion": true, "milestone": "DIN verified and active"}
  ]'::jsonb,
  '[
    {"title": "DIN status check before filing", "body": "Before we file, your CS checks DIN status on MCA21. If deactivated, we tell you upfront.", "mockVisualType": "status", "mockVisualData": {"row1": "DIN: 08765432", "row2": "Status: Active ✓", "row3": "Last KYC: 15 Sep 2024"}},
    {"title": "OTP verification handled live", "body": "DIR-3 KYC requires OTP verification. Your CS coordinates in real-time. Takes 10 minutes."},
    {"title": "Next year reminder added automatically", "body": "The moment we file, next year''s Sep 30 deadline is added to your calendar.", "mockVisualType": "calendar", "mockVisualData": {"row1": "DIR-3 KYC - Due Sep 30, 2026", "row2": "Reminder: Aug 31, 2026", "row3": "Status: Scheduled"}}
  ]'::jsonb,
  '[
    {"icon": "clock", "title": "₹5,000/day penalty - starts immediately", "body": "The penalty clock starts Oct 1. By Dec 31, that''s ₹91,000 per director. DIN is also deactivated."},
    {"icon": "building", "title": "All MCA filings blocked", "body": "A deactivated DIN blocks all company filings - annual returns, director changes, everything."}
  ]'::jsonb,
  '[
    {"label": "Filing on time", "detail": "Sep 30 is coming up. We file it in 2 days. Done."},
    {"label": "Already missed deadline", "detail": "DIN may be deactivated. We file immediately to stop the penalty clock."},
    {"label": "Multiple directorships", "detail": "One KYC covers all directorships. We verify all your DINs."},
    {"label": "First time as director", "detail": "New to this. We explain why it''s needed and handle everything."}
  ]'::jsonb,
  '[
    {"category": "General", "q": "What is DIR-3 KYC?", "a": "Annual verification that every director must file with MCA. Confirms your PAN, Aadhaar, and contact details."},
    {"category": "General", "q": "Why is this required every year?", "a": "MCA wants to verify directors are real people with valid IDs. Fraud prevention measure."},
    {"category": "Process", "q": "What happens if I miss Sep 30?", "a": "Your DIN is deactivated Oct 1. ₹5,000/day penalty starts. Only way to stop is to file."},
    {"category": "Documents", "q": "What documents do I need?", "a": "PAN card and Aadhaar card. That''s it. Plus mobile number linked to Aadhaar for OTP."}
  ]'::jsonb,
  '[
    {"name": "MCA21 Portal", "url": "https://www.mca.gov.in", "description": "DIR-3 KYC filing and DIN verification"},
    {"name": "Companies Rules, 2014", "url": "https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/rules.html", "description": "Rule 12A: Annual KYC requirement"}
  ]'::jsonb,
  '[]'::jsonb,
  ARRAY['✓ Done in 1 day', '✓ Simple process', '✓ CS was responsive', '✓ DIN reactivated'],
  ARRAY['mca-annual-filing', 'pvt-ltd-incorporation', 'business-itr']
);

-- =====================
-- 6. BUSINESS ITR FILING
-- =====================
INSERT INTO service_packages (
  slug, name, short_name, category, tagline, short_description,
  order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate,
  sla_working_days, urgency_score, situation_tags, is_active, display_order,
  service_type, mandatory_for, legal_basis, penalty_for_missing, penalty_color,
  seo_title, seo_description, canonical_url,
  workflow_stages, whats_included, service_risks, profile_personas, faqs, review_sources, unlocks, review_keyword_chips, related_slugs
) VALUES (
  'business-itr',
  'Business ITR Filing',
  'Business ITR',
  'Tax Filing',
  'ITR-6 for Pvt Ltd, ITR-5 for LLP. Filed correctly, on time.',
  'Annual income tax return filing for businesses',
  'one_time', 'annual', 1199900, 0, 18,
  10, 88, ARRAY['filing_taxes', 'have_company'], true, 6,
  'Annual', 'All Pvt Ltd, LLP, and Partnership firms', 'Income Tax Act 1961, Section 139', '1% per month interest on tax due', 'amber',
  'Business ITR Filing 2025 | ITR-6, ITR-5 | ₹11,999 | Ollvy',
  'File your company ITR before Oct 31. Fixed price ₹11,999. Verified CA assigned within 24 hours.',
  'https://ollvy.com/services/business-itr',
  '[
    {"step": 1, "title": "Upload your financials", "timeline": "Day 0-1", "body": "P&L, Balance Sheet, bank statements. A CA is assigned within 4 hours.", "visual": "upload", "milestone": "Documents received and assigned to CA"},
    {"step": 2, "title": "CA reviews your books and prepares computation", "timeline": "Day 1-4", "body": "Your CA reviews P&L, verifies depreciation, checks director remuneration, prepares income computation.", "visual": "form", "milestone": "Draft computation shared"},
    {"step": 3, "title": "You review, approve, and CA files", "timeline": "Day 4-7", "body": "Draft ITR shared in app. You review and approve. CA files within 24 hours of approval.", "visual": "checklist", "milestone": "ITR submitted to Income Tax portal"},
    {"step": 4, "title": "Acknowledgement delivered", "timeline": "Day 7-10", "body": "ITR-V acknowledgement generated immediately. Shared in app same day. Calendar updated.", "visual": "stamp", "isCompletion": true, "milestone": "ITR-V acknowledgement delivered"}
  ]'::jsonb,
  '[
    {"title": "Depreciation review - not just data entry", "body": "Your CA reviews asset schedule and depreciation calculations. If rates are incorrect, they catch it.", "comparisonWithout": "You calculate depreciation, CA just enters it", "comparisonWithOllvy": "CA reviews asset schedule and corrects rates"},
    {"title": "Director remuneration treatment", "body": "For Pvt Ltd, how you treat director salary vs dividends affects tax. Your CA reviews compliance with Companies Act limits."},
    {"title": "Draft review before filing", "body": "You see the complete ITR before filing. Income figures, deductions, tax computation - everything. You approve.", "comparisonWithout": "ITR filed, acknowledgement sent, no review", "comparisonWithOllvy": "Draft shared, you approve, then we file"},
    {"title": "Acknowledgement stored permanently", "body": "ITR-V uploaded to your account immediately. Five years from now, it''s still there.", "mockVisualType": "receipt", "mockVisualData": {"label": "ITR-V Acknowledgement", "row1": "ITR-6 · AY 2025-26", "row2": "Filed: 15 Oct 2025", "row3": "Acknowledgement No: CPC/2025/A12345"}}
  ]'::jsonb,
  '[
    {"icon": "clock", "title": "Belated filing interest at 1% per month", "body": "Section 234A: if you file after Oct 31 with tax due, 1% monthly interest accrues."},
    {"icon": "document", "title": "Losses can''t be carried forward", "body": "If your company made a loss and you file late, you lose the right to carry it forward."},
    {"icon": "alert", "title": "Defective return notice", "body": "Late filers are more likely to receive defective return notices under Section 139(9)."}
  ]'::jsonb,
  '[
    {"label": "First year filing", "detail": "New company, first ITR. We walk you through every document."},
    {"label": "Changed CA mid-year", "detail": "Previous CA''s books are a mess. We reconcile and file correctly."},
    {"label": "Company made a loss", "detail": "Loss returns filed to preserve carry-forward rights."},
    {"label": "Filing late", "detail": "We calculate interest liability upfront and file immediately."}
  ]'::jsonb,
  '[
    {"category": "General", "q": "When is business ITR due?", "a": "For companies not requiring audit: Sep 30. For companies requiring audit: Oct 31."},
    {"category": "General", "q": "What''s the difference between ITR-5 and ITR-6?", "a": "ITR-6 for companies (Pvt Ltd, Public Ltd). ITR-5 for LLPs, Partnerships."},
    {"category": "Process", "q": "What documents do I need?", "a": "Audited financials, P&L, Balance Sheet, trial balance, bank statements, Form 26AS."},
    {"category": "Process", "q": "Do I need to be audited?", "a": "Audit required if turnover exceeds ₹1Cr (₹10Cr if cash transactions under 5%)."}
  ]'::jsonb,
  '[
    {"name": "Income Tax India", "url": "https://www.incometax.gov.in", "description": "Official Income Tax e-filing portal"},
    {"name": "Income Tax Act, 1961", "url": "https://incometaxindia.gov.in/Pages/acts/income-tax-act.aspx", "description": "Section 139: Due dates. Section 234: Interest provisions."}
  ]'::jsonb,
  '[
    {"name": "Tax Audit", "explanation": "Required above ₹1Cr turnover. Must be done before ITR.", "price": "From ₹24,999", "type": "required", "slug": "statutory-audit"}
  ]'::jsonb,
  ARRAY['✓ Filed before deadline', '✓ CA reviewed depreciation', '✓ Draft shared before filing', '✓ Acknowledgement same day'],
  ARRAY['director-kyc', 'mca-annual-filing', 'gst-annual-return']
);

-- =====================
-- 7. TRADEMARK REGISTRATION
-- =====================
INSERT INTO service_packages (
  slug, name, short_name, category, tagline, short_description,
  order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate,
  sla_working_days, urgency_score, situation_tags, is_active, display_order,
  service_type, mandatory_for, legal_basis, penalty_for_missing, penalty_color,
  seo_title, seo_description, canonical_url,
  govt_fee_label, govt_fee_note,
  workflow_stages, whats_included, service_risks, profile_personas, faqs, review_sources, unlocks, review_keyword_chips, related_slugs
) VALUES (
  'trademark-registration',
  'Trademark Registration',
  'Trademark',
  'IP Protection',
  'Protect your brand name. 10-year validity. Nationwide protection.',
  'Register your trademark for brand protection',
  'one_time', 'one_time', 799900, 450000, 18,
  7, 75, ARRAY['want_to_protect_brand'], true, 7,
  'One-time', 'Businesses wanting brand protection', 'Trade Marks Act, 1999', NULL, 'none',
  'Trademark Registration India | ₹12,499 | 10-Year Protection | Ollvy',
  'Register your trademark. Application filed within 7 days. ₹7,999 + ₹4,500 govt fee. Trademark search included.',
  'https://ollvy.com/services/trademark-registration',
  'Govt filing fee', 'Government fee for single class. MSME discount (₹4,500 → ₹2,250) if you have Udyam registration.',
  '[
    {"step": 1, "title": "Tell us your brand name and category", "timeline": "Day 0", "body": "A trademark attorney is assigned within 4 hours. They conduct preliminary search.", "visual": "checklist", "milestone": "Attorney assigned, search started"},
    {"step": 2, "title": "Trademark search report delivered", "timeline": "Day 1-2", "body": "Attorney searches Trademark Registry for conflicts. You receive search report.", "visual": "form", "milestone": "Search report delivered"},
    {"step": 3, "title": "Application filed with Trademark Registry", "timeline": "Day 3-7", "body": "Attorney drafts application, selects classes, and files. You receive application number.", "visual": "form", "milestone": "Application filed, receipt received"},
    {"step": 4, "title": "Examination and publication", "timeline": "6-12 months", "body": "Registry examines. If objections, attorney responds. Once cleared, mark is published.", "visual": "calendar", "milestone": "Under examination"},
    {"step": 5, "title": "Registration certificate issued", "timeline": "12-18 months total", "body": "Registry issues registration certificate. 10-year protection, renewable.", "visual": "stamp", "isCompletion": true, "milestone": "Trademark registered"}
  ]'::jsonb,
  '[
    {"title": "Trademark search before filing", "body": "Before we file, attorney searches Registry for conflicts. No point paying govt fee for certain rejection.", "comparisonWithout": "File blindly, wait months, get rejected", "comparisonWithOllvy": "Search first, modify if needed, then file", "mockVisualType": "status", "mockVisualData": {"row1": "TECHBRIDGE - Class 42", "row2": "No identical marks found ✓", "row3": "2 similar marks reviewed - no conflict"}},
    {"title": "Class selection guidance", "body": "Trademarks are registered per class (45 total). Your attorney recommends which you actually need."},
    {"title": "Examination objection response included", "body": "If Examiner raises objections, attorney responds. This is included.", "comparisonWithout": "Objection raised, you pay extra to respond", "comparisonWithOllvy": "Objection response included in service"},
    {"title": "Renewal reminder 10 years out", "body": "We add renewal date to your calendar. You''ll get reminders 6 months before expiry.", "mockVisualType": "calendar", "mockVisualData": {"row1": "Trademark Renewal - Mar 2035", "row2": "Reminder: Sep 2034", "row3": "Status: Scheduled"}}
  ]'::jsonb,
  '[
    {"icon": "document", "title": "Similar mark already exists", "body": "If similar mark exists in your class, Examiner will reject. Our search catches most conflicts."},
    {"icon": "clock", "title": "Govt processing takes 12-18 months", "body": "Filing happens in 7 days, but examination takes 12-18 months. We track and update you."},
    {"icon": "alert", "title": "Opposition during publication", "body": "After examination, mark is published for 4 months. Anyone can oppose. Rare (<5% cases)."}
  ]'::jsonb,
  '[
    {"label": "First trademark", "detail": "Never registered before. We explain classes, search, and entire process."},
    {"label": "Logo + word mark", "detail": "You want to protect both. Two applications needed. We handle both."},
    {"label": "Multiple classes", "detail": "Tech + retail + services. Each class is ₹4,500 additional govt fee."},
    {"label": "Already using the name", "detail": "Using brand for years without registration. Register now before someone else does."}
  ]'::jsonb,
  '[
    {"category": "General", "q": "What can I trademark?", "a": "Words, logos, slogans, sounds, and even colours. Most businesses trademark brand name and logo separately."},
    {"category": "General", "q": "How long does protection last?", "a": "10 years from filing, renewable indefinitely in 10-year increments."},
    {"category": "Process", "q": "Why does registration take so long?", "a": "Filing takes 7 days. Examination takes 6-12 months. Publication 4 months. Total 12-18 months."},
    {"category": "Process", "q": "Can I use ® after filing?", "a": "No. Use ® only after registration. Until then, use ™ (goods) or ℠ (services)."},
    {"category": "Documents", "q": "What documents do I need?", "a": "PAN, Aadhaar, address proof, logo file. For companies: Certificate of Incorporation."}
  ]'::jsonb,
  '[
    {"name": "IP India", "url": "https://ipindia.gov.in", "description": "Official Trademark Registry and search portal"},
    {"name": "Trade Marks Act, 1999", "url": "https://ipindia.gov.in/writereaddata/Portal/IPOAct/1_34_1_trade-marks-act-1999.pdf", "description": "Section 18: Application. Section 25: Duration."}
  ]'::jsonb,
  '[
    {"name": "Trademark Renewal", "explanation": "Due every 10 years.", "price": "₹4,999 + govt fee", "type": "required", "slug": "trademark-renewal"},
    {"name": "Copyright Registration", "explanation": "Protect creative works - code, designs, content.", "price": "₹5,999", "type": "beneficial", "slug": "copyright-registration"}
  ]'::jsonb,
  ARRAY['✓ Search before filing', '✓ Attorney was clear', '✓ Application in 5 days', '✓ Certificate received'],
  ARRAY['pvt-ltd-incorporation', 'copyright-registration']
);

-- =====================
-- 8. FSSAI LICENSE
-- =====================
INSERT INTO service_packages (
  slug, name, short_name, category, tagline, short_description,
  order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate,
  sla_working_days, urgency_score, situation_tags, is_active, display_order,
  service_type, mandatory_for, legal_basis, penalty_for_missing, penalty_color,
  seo_title, seo_description, canonical_url,
  govt_fee_label, govt_fee_note,
  workflow_stages, whats_included, service_risks, profile_personas, faqs, review_sources, unlocks, review_keyword_chips, related_slugs
) VALUES (
  'fssai-license',
  'FSSAI License',
  'FSSAI',
  'Licensing',
  'Sell food legally. Display the license number on every pack.',
  'FSSAI registration or license for food businesses',
  'one_time', 'one_time', 499900, 200000, 18,
  10, 92, ARRAY['selling_food_beverages', 'just_starting_out'], true, 8,
  'One-time', 'All food businesses in India', 'Food Safety and Standards Act, 2006', '₹10,000 + ₹100/day + seizure of goods', 'red',
  'FSSAI License Online India | Registration & State License | ₹6,999 | Ollvy',
  'Get your FSSAI license in 10 working days. Fixed price ₹6,999.',
  'https://ollvy.com/services/fssai-license',
  'FSSAI license fee', 'Paid to Food Safety Authority. Varies by license type.',
  '[
    {"step": 1, "title": "Tell us your food business type and turnover", "timeline": "Day 0", "body": "We determine whether you need Registration, State, or Central License.", "visual": "checklist", "milestone": "License type determined"},
    {"step": 2, "title": "Upload documents through the app", "timeline": "Day 0-1", "body": "Business registration proof, food safety plan, layout plan, equipment list.", "visual": "upload", "milestone": "Documents verified"},
    {"step": 3, "title": "Application filed on FSSAI portal", "timeline": "Day 2-4", "body": "Compliance expert files Form A or Form B. ARN generated.", "visual": "form", "milestone": "Application submitted"},
    {"step": 4, "title": "Inspection coordinated (if required)", "timeline": "Day 5-8", "body": "State/Central Licenses may require inspection. We prepare you.", "visual": "calendar", "milestone": "Inspection scheduled"},
    {"step": 5, "title": "FSSAI license issued", "timeline": "Day 8-10", "body": "14-digit FSSAI number issued. Ready to print on packaging.", "visual": "stamp", "isCompletion": true, "milestone": "FSSAI license active"}
  ]'::jsonb,
  '[
    {"title": "Correct license type determined upfront", "body": "Registration (up to ₹12L), State License (₹12L-₹20Cr), Central License (₹20Cr+). We determine before you pay.", "comparisonWithout": "Guess the type - risk rejection and delay", "comparisonWithOllvy": "License type verified based on turnover"},
    {"title": "Application filed on FSSAI portal", "body": "FSSAI portal has 20+ fields. We handle submission. You answer 5 questions.", "comparisonWithout": "2+ hours on FSSAI portal", "comparisonWithOllvy": "5 questions in app - we file the rest"},
    {"title": "Inspection preparation checklist", "body": "For State/Central licenses, we provide pre-inspection checklist: hygiene, equipment labels, pest control.", "mockVisualType": "checklist", "mockVisualData": {"row1": "✓ Pest control certificate", "row2": "✓ Water test report", "row3": "✓ Equipment maintenance logs"}},
    {"title": "Renewal reminder in your calendar", "body": "FSSAI licenses are valid 1-5 years. We add renewal reminders.", "mockVisualType": "calendar", "mockVisualData": {"row1": "FSSAI Renewal - Due Mar 2026", "note": "Added automatically"}}
  ]'::jsonb,
  '[
    {"icon": "document", "title": "Wrong license type filed", "body": "Filing Registration when you need State License gets rejected. We verify turnover first."},
    {"icon": "building", "title": "Premises inspection failure", "body": "Inspections fail due to missing pest control certificate or water test. We send checklist."},
    {"icon": "alert", "title": "Operating without license", "body": "₹10,000 penalty + ₹100/day. E-commerce platforms require FSSAI for food listings."}
  ]'::jsonb,
  '[
    {"label": "Cloud kitchen / home baker", "detail": "Most home bakers need State License once turnover crosses ₹12L."},
    {"label": "Food manufacturer", "detail": "Manufacturing requires State or Central License. Inspection included."},
    {"label": "Restaurant", "detail": "Restaurants need State License. Dine-in, takeaway, delivery all covered."},
    {"label": "E-commerce food seller", "detail": "Amazon/Flipkart require FSSAI number for listing."}
  ]'::jsonb,
  '[
    {"category": "General", "q": "Do I need FSSAI for a small home bakery?", "a": "Yes. Below ₹12L: Registration is sufficient. Above: State License required."},
    {"category": "General", "q": "What''s the difference between Registration, State, and Central?", "a": "Registration: up to ₹12L. State: ₹12L-₹20Cr. Central: ₹20Cr+ or multi-state."},
    {"category": "Process", "q": "How long is the license valid?", "a": "1 to 5 years - you choose at application. Renewal 30 days before expiry."},
    {"category": "Documents", "q": "What documents are required?", "a": "Business registration, ID/address proof, food safety plan, layout plan."}
  ]'::jsonb,
  '[
    {"name": "FSSAI", "url": "https://foscos.fssai.gov.in", "description": "Food Safety Authority - license portal"},
    {"name": "FSS Act, 2006", "url": "https://fssai.gov.in/cms/food-safety-and-standards-act-2006.php", "description": "Food Safety and Standards Act"}
  ]'::jsonb,
  '[
    {"name": "GST Registration", "explanation": "Mandatory once turnover crosses ₹20L.", "price": "₹8,999", "type": "required", "slug": "gst-registration"}
  ]'::jsonb,
  ARRAY['✓ License in 8 days', '✓ Inspection prep helped', '✓ Right license type', '✓ Fixed price'],
  ARRAY['gst-registration', 'trademark-registration']
);

-- =====================
-- 9. IEC CODE
-- =====================
INSERT INTO service_packages (
  slug, name, short_name, category, tagline, short_description,
  order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate,
  sla_working_days, urgency_score, situation_tags, is_active, display_order,
  service_type, mandatory_for, legal_basis, penalty_for_missing, penalty_color,
  seo_title, seo_description, canonical_url,
  govt_fee_label, govt_fee_note,
  workflow_stages, whats_included, service_risks, profile_personas, faqs, review_sources, unlocks, review_keyword_chips, related_slugs
) VALUES (
  'iec-code',
  'IEC (Import Export Code)',
  'IEC',
  'Licensing',
  'Export from India. Import to India. This is the license.',
  'Get your Import Export Code for international trade',
  'one_time', 'one_time', 399900, 50000, 18,
  5, 78, ARRAY['importing_exporting'], true, 9,
  'One-time', 'All businesses importing or exporting goods', 'Foreign Trade Policy 2023, Chapter 2', 'Shipment held at customs + penalty up to 3x duty', 'amber',
  'IEC Code Registration Online India | Import Export Code | ₹4,499 | Ollvy',
  'Get your IEC in 5 working days. Fixed price ₹4,499.',
  'https://ollvy.com/services/iec-code',
  'DGFT application fee', 'Paid to Directorate General of Foreign Trade. Fixed at ₹500.',
  '[
    {"step": 1, "title": "Share your business details", "timeline": "Day 0", "body": "Business type, GST number, bank account details. Trade compliance expert assigned.", "visual": "checklist", "milestone": "Expert assigned"},
    {"step": 2, "title": "Upload documents through the app", "timeline": "Day 0-1", "body": "PAN, incorporation certificate, cancelled cheque.", "visual": "upload", "milestone": "Documents verified"},
    {"step": 3, "title": "Application filed on DGFT portal", "timeline": "Day 1-2", "body": "Expert files application. Aadhaar OTP verification required.", "visual": "form", "milestone": "Application submitted"},
    {"step": 4, "title": "IEC issued - you can trade internationally", "timeline": "Day 3-5", "body": "DGFT issues 10-digit IEC. Valid for life - no renewal.", "visual": "stamp", "isCompletion": true, "milestone": "IEC certificate issued"}
  ]'::jsonb,
  '[
    {"title": "Filed on DGFT portal", "body": "IEC is issued exclusively online through DGFT. We handle the submission.", "comparisonWithout": "Navigate DGFT portal - 2+ hours", "comparisonWithOllvy": "We file - you verify OTP - IEC in 5 days"},
    {"title": "Bank account verification guidance", "body": "IEC requires cancelled cheque with business name visible. We verify before filing.", "comparisonWithout": "Rejection due to bank account mismatch", "comparisonWithOllvy": "Bank account verified before submission"},
    {"title": "Lifetime validity - no renewal", "body": "IEC is valid for life. Update profile only if business details change."},
    {"title": "Ready to use at customs", "body": "Once issued, IEC is active immediately in ICEGATE customs system.", "mockVisualType": "status", "mockVisualData": {"row1": "IEC: 0123456789", "row2": "Status: Active on ICEGATE ✓", "row3": "Valid: Lifetime"}}
  ]'::jsonb,
  '[
    {"icon": "document", "title": "Bank account in personal name", "body": "IEC requires current account in business name. Personal savings won''t work."},
    {"icon": "mismatch", "title": "PAN-Aadhaar name mismatch", "body": "Name on PAN must match Aadhaar exactly. Variations cause OTP failure."},
    {"icon": "alert", "title": "Importing without IEC", "body": "Customs will not release shipment. Goods held, demurrage accrues."}
  ]'::jsonb,
  '[
    {"label": "First international shipment", "detail": "New to import/export. IEC takes 5 days - plan accordingly."},
    {"label": "E-commerce cross-border seller", "detail": "Selling via Amazon Global. IEC is mandatory."},
    {"label": "Importing raw materials", "detail": "Manufacturing business. IEC needed for customs clearance."},
    {"label": "Freelancer receiving foreign payments", "detail": "For service exports, IEC is optional but helps with bank compliance."}
  ]'::jsonb,
  '[
    {"category": "General", "q": "Do I need IEC for service exports?", "a": "No. IEC is for goods only. Service exports (software, consulting) don''t require IEC."},
    {"category": "Process", "q": "How long is IEC valid?", "a": "Lifetime. No renewal. Update profile if business details change."},
    {"category": "Documents", "q": "What documents are required?", "a": "PAN, incorporation certificate, cancelled cheque, Aadhaar of authorized signatory."}
  ]'::jsonb,
  '[
    {"name": "DGFT", "url": "https://dgft.gov.in", "description": "Directorate General of Foreign Trade - IEC portal"},
    {"name": "Foreign Trade Policy 2023", "url": "https://dgft.gov.in/CP/?opt=ftp-2023", "description": "Current Foreign Trade Policy"}
  ]'::jsonb,
  '[
    {"name": "GST Registration", "explanation": "Required for claiming GST refunds on exports.", "price": "₹8,999", "type": "required", "slug": "gst-registration"}
  ]'::jsonb,
  ARRAY['✓ IEC in 4 days', '✓ Bank issue caught early', '✓ Lifetime validity', '✓ Fixed price'],
  ARRAY['gst-registration', 'pvt-ltd-incorporation']
);

-- =====================
-- 10. MCA ANNUAL FILING
-- =====================
INSERT INTO service_packages (
  slug, name, short_name, category, tagline, short_description,
  order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate,
  sla_working_days, urgency_score, situation_tags, is_active, display_order,
  service_type, mandatory_for, legal_basis, penalty_for_missing, penalty_color,
  seo_title, seo_description, canonical_url,
  govt_fee_label, govt_fee_note,
  workflow_stages, whats_included, service_risks, profile_personas, faqs, review_sources, unlocks, review_keyword_chips, related_slugs
) VALUES (
  'mca-annual-filing',
  'MCA Annual Filing',
  'MCA Annual',
  'Annual Compliance',
  'AOC-4 and MGT-7. The annual return every Pvt Ltd must file.',
  'Complete MCA annual compliance (AOC-4, MGT-7)',
  'one_time', 'annual', 699900, 60000, 18,
  7, 85, ARRAY['have_company', 'annual_filing'], true, 10,
  'Annual', 'All Pvt Ltd and OPC companies', 'Companies Act 2013, Section 92 & 137', '₹100/day per form - no ceiling', 'red',
  'MCA Annual Filing Online | AOC-4 & MGT-7 | ₹7,599 | Ollvy',
  'File your MCA annual return on time. Fixed price ₹7,599.',
  'https://ollvy.com/services/mca-annual-filing',
  'MCA filing fees', 'Paid to Ministry of Corporate Affairs. ₹300 per form.',
  '[
    {"step": 1, "title": "Share your company details", "timeline": "Day 0", "body": "Company CIN, financial year, AGM date, audited financials status.", "visual": "checklist", "milestone": "CS assigned"},
    {"step": 2, "title": "Upload financial statements and documents", "timeline": "Day 0-2", "body": "Audited balance sheet, P&L, director report, auditor report, shareholder list.", "visual": "upload", "milestone": "Documents reviewed by CS"},
    {"step": 3, "title": "Forms drafted and reviewed", "timeline": "Day 2-4", "body": "CS drafts AOC-4 and MGT-7. You approve drafts in app.", "visual": "form", "milestone": "Draft forms sent for approval"},
    {"step": 4, "title": "Filed on MCA21 - SRN generated", "timeline": "Day 5-7", "body": "CS files both forms. SRNs generated and shared immediately.", "visual": "stamp", "isCompletion": true, "milestone": "AOC-4 and MGT-7 filed"}
  ]'::jsonb,
  '[
    {"title": "Both forms filed - AOC-4 and MGT-7", "body": "AOC-4 for financial statements, MGT-7 for annual return. Both included.", "comparisonWithout": "Book separately - higher cost", "comparisonWithOllvy": "Both forms, one price, one CS"},
    {"title": "Deadline calculation based on AGM", "body": "AOC-4 due within 30 days of AGM. MGT-7 due within 60 days. We track all dates.", "mockVisualType": "calendar", "mockVisualData": {"row1": "FY End: March 31 → AGM by Sep 30", "row2": "AOC-4 due: 30 days after AGM", "row3": "MGT-7 due: 60 days after AGM"}},
    {"title": "Penalty status checked before filing", "body": "If filing late, penalty is ₹100/day per form. We calculate exact amount upfront.", "comparisonWithout": "Surprise penalty at MCA portal", "comparisonWithOllvy": "Penalty calculated and disclosed before you approve"},
    {"title": "SRN shared immediately", "body": "Service Request Number is your proof of filing. We share both SRNs immediately."}
  ]'::jsonb,
  '[
    {"icon": "clock", "title": "AGM not held on time", "body": "AGM must be held within 6 months of FY end. If delayed, MCA filing is delayed."},
    {"icon": "document", "title": "Audited financials not ready", "body": "AOC-4 requires audited financials. Complete audit first."},
    {"icon": "alert", "title": "Penalty accruing daily", "body": "Late filing is ₹100/day per form. For both, that''s ₹200/day. No ceiling."}
  ]'::jsonb,
  '[
    {"label": "First year after incorporation", "detail": "First MCA annual filing. We explain every field."},
    {"label": "Running late on filing", "detail": "Already past deadline. We calculate penalty and file immediately."},
    {"label": "Director changes during year", "detail": "New appointments or resignations reflected in MGT-7."},
    {"label": "Share transfer happened", "detail": "Equity changes during year. Shareholder details updated."}
  ]'::jsonb,
  '[
    {"category": "General", "q": "What is MCA annual filing?", "a": "Two mandatory forms: AOC-4 (financial statements) and MGT-7 (annual return)."},
    {"category": "General", "q": "When is MCA annual filing due?", "a": "AOC-4: 30 days after AGM. MGT-7: 60 days after AGM."},
    {"category": "Process", "q": "Can I file if audit is not complete?", "a": "No. AOC-4 requires audited financials."},
    {"category": "Documents", "q": "What documents do I need?", "a": "Audited balance sheet, P&L, notes, director report, auditor report."}
  ]'::jsonb,
  '[
    {"name": "MCA21 Portal", "url": "https://www.mca.gov.in", "description": "Ministry of Corporate Affairs - company filings"},
    {"name": "Companies Act 2013", "url": "https://www.mca.gov.in/Ministry/pdf/CompaniesAct2013.pdf", "description": "Section 92 & 137: Annual return requirements"}
  ]'::jsonb,
  '[
    {"name": "Director KYC", "explanation": "Due Sep 30 every year. ₹5,000/day penalty.", "price": "₹1,499", "type": "required", "slug": "director-kyc"},
    {"name": "Business ITR", "explanation": "ITR-6 due Oct 31 every year.", "price": "₹11,999", "type": "required", "slug": "business-itr"}
  ]'::jsonb,
  ARRAY['✓ Both forms filed', '✓ Penalty was clear upfront', '✓ CS reviewed financials', '✓ SRN same day'],
  ARRAY['director-kyc', 'business-itr', 'pvt-ltd-incorporation']
);

-- Continue with more services...
-- Due to length, I'll add the remaining services in a more compact format

-- =====================
-- 11-32: REMAINING SERVICES (Compact format)
-- =====================

-- 11. TDS Monthly Compliance
INSERT INTO service_packages (slug, name, short_name, category, tagline, short_description, order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate, sla_working_days, urgency_score, situation_tags, is_active, display_order, service_type, mandatory_for, legal_basis, penalty_for_missing, penalty_color, seo_title, seo_description, canonical_url, retainer_cycle_label, workflow_stages, whats_included, service_risks, profile_personas, faqs, review_sources, unlocks, review_keyword_chips, related_slugs) VALUES
('tds-monthly-compliance', 'TDS Monthly Compliance', 'TDS Filing', 'Monthly Compliance', 'Deduct TDS. Deposit challan. File return. Every month, on time.', 'Monthly TDS deduction and deposit compliance', 'recurring', 'monthly', 199900, 0, 18, 3, 85, ARRAY['need_to_hire', 'filing_taxes'], true, 11, 'Monthly retainer', 'All businesses making TDS-applicable payments', 'Income Tax Act, 1961 - Sections 192-206', '1% per month interest + ₹200/day late fee', 'amber', 'TDS Filing Monthly Service | ₹1,999/mo | Ollvy', 'Monthly TDS compliance. Fixed ₹1,999/month.', 'https://ollvy.com/services/tds-monthly-compliance', 'per month',
'[{"step": 1, "title": "Share payment register", "timeline": "Day 1-5", "body": "Upload salary, vendor, rent payments. CA reviews TDS rates.", "visual": "upload", "milestone": "Data received"},{"step": 2, "title": "TDS calculated and challans prepared", "timeline": "Day 5-6", "body": "CA calculates TDS for each category. Challans prepared.", "visual": "form", "milestone": "Challans ready"},{"step": 3, "title": "Challans paid", "timeline": "Day 6-7", "body": "You pay through net banking. Receipt with CIN uploaded.", "visual": "stamp", "milestone": "TDS deposited"},{"step": 4, "title": "Quarterly return filed", "timeline": "Quarter end", "body": "CA files Form 24Q, 26Q. Form 16/16A generation enabled.", "visual": "form", "isCompletion": true, "milestone": "TDS return filed"}]'::jsonb,
'[{"title": "TDS calculation for all payment types", "body": "Salary TDS, contractor payments, professional fees, rent, interest. Correct rates applied."},{"title": "Monthly challan preparation", "body": "Challan requires correct BSR code, assessment year. We prepare - you pay."},{"title": "Quarterly return filing", "body": "Form 24Q (salary), Form 26Q (non-salary). Returns reconciled with challans."},{"title": "Form 16/16A generation", "body": "Once returns filed, Form 16/16A can be downloaded from TRACES."}]'::jsonb,
'[{"icon": "clock", "title": "Late deposit - interest accrues", "body": "TDS due by 7th of following month. 1% per month interest on late deposit."},{"icon": "document", "title": "Wrong TDS rate", "body": "Under-deducting: you''re liable for shortfall. Over-deducting: deductee complains."}]'::jsonb,
'[{"label": "First time deducting TDS", "detail": "New to TDS. We explain every section."},{"label": "Have employees", "detail": "24Q filing for salary TDS."},{"label": "Paying contractors", "detail": "26Q filing for 194C and 194J payments."}]'::jsonb,
'[{"category": "General", "q": "Who needs to deduct TDS?", "a": "Any business making payments above threshold limits."},{"category": "Process", "q": "What''s the due date for deposit?", "a": "7th of the following month."}]'::jsonb,
'[{"name": "TRACES", "url": "https://www.tdscpc.gov.in", "description": "TDS Reconciliation System"}]'::jsonb,
'[{"name": "Payroll Management", "explanation": "Full payroll including salary TDS.", "price": "₹2,999/month", "type": "beneficial", "slug": "payroll-management"}]'::jsonb,
ARRAY['✓ Never missed deadline', '✓ Form 16 ready', '✓ CA explained rates'],
ARRAY['payroll-management', 'business-itr']);

-- 12. Payroll Management
INSERT INTO service_packages (slug, name, short_name, category, tagline, short_description, order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate, sla_working_days, urgency_score, situation_tags, is_active, display_order, service_type, mandatory_for, legal_basis, penalty_for_missing, penalty_color, seo_title, seo_description, canonical_url, retainer_cycle_label, workflow_stages, whats_included, service_risks, profile_personas, faqs, review_sources, unlocks, review_keyword_chips, related_slugs) VALUES
('payroll-management', 'Payroll Management', 'Payroll', 'Payroll', 'Salary slips. TDS. PF. ESI. All handled, every month.', 'Complete payroll processing and compliance', 'recurring', 'monthly', 299900, 0, 18, 5, 80, ARRAY['need_to_hire'], true, 12, 'Monthly retainer', 'All businesses with employees', 'Payment of Wages Act, PF Act 1952, ESI Act 1948', 'PF: 1% per month + damages. ESI: 12% per annum', 'amber', 'Payroll Services | Salary, TDS, PF, ESI | ₹2,999/mo | Ollvy', 'Full payroll service. Fixed ₹2,999/month for up to 10 employees.', 'https://ollvy.com/services/payroll-management', 'per month',
'[{"step": 1, "title": "Share employee data", "timeline": "Day 1-3", "body": "Employee list with salary structure, PAN, bank details.", "visual": "upload", "milestone": "Payroll specialist assigned"},{"step": 2, "title": "Salary calculated", "timeline": "Day 3-4", "body": "Gross salary, TDS, PF, ESI, professional tax calculated.", "visual": "form", "milestone": "Salary calculation ready"},{"step": 3, "title": "Salary disbursed + challans paid", "timeline": "Day 4-5", "body": "You transfer salaries. We prepare PF, ESI, TDS challans.", "visual": "stamp", "milestone": "Salaries disbursed"},{"step": 4, "title": "Salary slips generated", "timeline": "Monthly", "body": "PDF salary slips sent to employees. PF/ESI returns filed.", "visual": "calendar", "isCompletion": true, "milestone": "Month-end complete"}]'::jsonb,
'[{"title": "Full salary calculation", "body": "Gross to net: basic, HRA, TDS, PF, ESI, PT. All components handled."},{"title": "PF registration and monthly filing", "body": "EPFO registration and monthly ECR filing included."},{"title": "ESI registration and filing", "body": "ESIC registration and contributions for eligible employees."},{"title": "TDS on salary - 24Q filing", "body": "Salary TDS calculated. Quarterly 24Q return filed. Form 16 generated."},{"title": "Salary slips for every employee", "body": "PDF salary slips with all components, sent via email."}]'::jsonb,
'[{"icon": "clock", "title": "PF deposit late - interest + damages", "body": "PF due 15th of following month. Late: 1% per month + damages."},{"icon": "document", "title": "Employee PAN/Aadhaar missing", "body": "TDS requires PAN. PF requires Aadhaar. We collect during onboarding."}]'::jsonb,
'[{"label": "First employee hire", "detail": "New to payroll. We set up salary structure."},{"label": "5-10 employees", "detail": "Growing team. PF and TDS handled."},{"label": "Just crossed 20 employees", "detail": "PF registration mandatory. We handle EPFO setup."}]'::jsonb,
'[{"category": "General", "q": "Is PF mandatory?", "a": "PF mandatory for 20+ employees. Below 20, voluntary."},{"category": "Pricing", "q": "Pricing for more than 10 employees?", "a": "₹2,999/month for up to 10. +₹200 per additional employee."}]'::jsonb,
'[{"name": "EPFO", "url": "https://www.epfindia.gov.in", "description": "PF compliance"},{"name": "ESIC", "url": "https://www.esic.in", "description": "ESI compliance"}]'::jsonb,
'[{"name": "TDS Monthly", "explanation": "For contractor/vendor payments.", "price": "₹1,999/month", "type": "beneficial", "slug": "tds-monthly-compliance"}]'::jsonb,
ARRAY['✓ PF always on time', '✓ Form 16 ready', '✓ Salary slips professional'],
ARRAY['tds-monthly-compliance', 'business-itr']);

-- 13. GST Annual Return
INSERT INTO service_packages (slug, name, short_name, category, tagline, short_description, order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate, sla_working_days, urgency_score, situation_tags, is_active, display_order, service_type, mandatory_for, legal_basis, penalty_for_missing, penalty_color, seo_title, seo_description, canonical_url, workflow_stages, whats_included, service_risks, profile_personas, faqs, review_sources, unlocks, review_keyword_chips, related_slugs) VALUES
('gst-annual-return', 'GST Annual Return (GSTR-9)', 'GSTR-9', 'Tax Filing', 'Annual GST reconciliation. Due December 31 every year.', 'Annual GST return filing (GSTR-9)', 'one_time', 'annual', 899900, 0, 18, 14, 75, ARRAY['filing_taxes'], true, 13, 'Annual', 'All GST-registered businesses', 'CGST Act 2017, Section 44', 'Late fee ₹200/day (max ₹5,000)', 'amber', 'GSTR-9 Annual Return Filing | ₹8,999 | Ollvy', 'File GSTR-9 before Dec 31. Fixed price ₹8,999.', 'https://ollvy.com/services/gst-annual-return',
'[{"step": 1, "title": "Share your GST data", "timeline": "Day 0-3", "body": "Monthly GSTR-1 and GSTR-3B data, purchase register.", "visual": "upload", "milestone": "Data received"},{"step": 2, "title": "Reconciliation prepared", "timeline": "Day 3-8", "body": "CA reconciles monthly returns with annual figures.", "visual": "form", "milestone": "Reconciliation complete"},{"step": 3, "title": "Draft GSTR-9 shared", "timeline": "Day 8-12", "body": "You review and approve the annual return.", "visual": "checklist", "milestone": "Draft approved"},{"step": 4, "title": "GSTR-9 filed", "timeline": "Day 12-14", "body": "CA files on GST portal. Acknowledgement shared.", "visual": "stamp", "isCompletion": true, "milestone": "GSTR-9 filed"}]'::jsonb,
'[{"title": "Full year reconciliation", "body": "All 12 months of GSTR-1 and GSTR-3B reconciled with your books."},{"title": "ITC reconciliation", "body": "Input tax credit claimed vs available in GSTR-2B verified."},{"title": "Draft review before filing", "body": "You review the complete annual return before we file."}]'::jsonb,
'[{"icon": "clock", "title": "Late fee ₹200/day", "body": "Late filing attracts ₹200/day (₹100 CGST + ₹100 SGST), max ₹5,000."},{"icon": "document", "title": "Mismatch with monthly returns", "body": "GSTR-9 must reconcile with monthly returns. We verify before filing."}]'::jsonb,
'[{"label": "First annual return", "detail": "First year filing GSTR-9. We explain reconciliation process."},{"label": "High transaction volume", "detail": "Complex reconciliation. We handle it systematically."}]'::jsonb,
'[{"category": "General", "q": "When is GSTR-9 due?", "a": "December 31 of the following financial year."},{"category": "Process", "q": "Is GSTR-9 mandatory?", "a": "Mandatory for all GST-registered businesses above ₹2Cr turnover."}]'::jsonb,
'[{"name": "GST Portal", "url": "https://www.gst.gov.in", "description": "Official GST portal"}]'::jsonb,
'[]'::jsonb,
ARRAY['✓ Reconciliation thorough', '✓ Filed before deadline', '✓ CA was responsive'],
ARRAY['gst-monthly-50l', 'business-itr']);

-- 14. OPC Incorporation
INSERT INTO service_packages (slug, name, short_name, category, tagline, short_description, order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate, sla_working_days, urgency_score, situation_tags, is_active, display_order, service_type, mandatory_for, legal_basis, penalty_for_missing, penalty_color, seo_title, seo_description, canonical_url, govt_fee_label, govt_fee_note, workflow_stages, whats_included, service_risks, profile_personas, faqs, review_sources, unlocks, review_keyword_chips, related_slugs) VALUES
('opc-incorporation', 'One Person Company (OPC) Registration', 'OPC', 'Company Registration', 'Your company, just you. Limited liability with single ownership.', 'Incorporate a One Person Company with limited liability', 'one_time', 'one_time', 999900, 499900, 18, 12, 85, ARRAY['just_starting_out'], true, 14, 'One-time', 'Solo entrepreneurs wanting limited liability', 'Companies Act, 2013 - Section 3(1)(c)', NULL, 'none', 'OPC Registration Online | ₹14,999 | Ollvy', 'Register your One Person Company in 12 working days. Single owner, limited liability.', 'https://ollvy.com/services/opc-incorporation', 'MCA filing fees', 'Paid to Ministry of Corporate Affairs.',
'[{"step": 1, "title": "Share your details", "timeline": "Day 0", "body": "Business activity, proposed name, address proof. Nominee details required for OPC.", "visual": "checklist", "milestone": "CS assigned"},{"step": 2, "title": "DSC and DIN obtained", "timeline": "Day 2-4", "body": "Digital signature and director identification for you.", "visual": "form", "milestone": "DSC ready"},{"step": 3, "title": "Name approved via RUN", "timeline": "Day 4-7", "body": "OPC name approved by MCA.", "visual": "form", "milestone": "Name approved"},{"step": 4, "title": "SPICe+ filed", "timeline": "Day 7-12", "body": "MOA, AOA, PAN, TAN filed together.", "visual": "stamp", "isCompletion": true, "milestone": "OPC incorporated"}]'::jsonb,
'[{"title": "Single director, single shareholder", "body": "You own 100% with limited liability. No co-founders needed."},{"title": "Nominee member required", "body": "OPC requires a nominee who takes over if something happens to you."},{"title": "PAN and TAN included", "body": "Issued with Certificate of Incorporation."}]'::jsonb,
'[{"icon": "document", "title": "Nominee consent required", "body": "OPC needs nominee consent form INC-3. We draft and file."},{"icon": "clock", "title": "Conversion threshold", "body": "OPC must convert to Pvt Ltd if turnover exceeds ₹2Cr or capital exceeds ₹50L."}]'::jsonb,
'[{"label": "Solopreneur", "detail": "Running business alone. Want limited liability."},{"label": "Freelancer scaling up", "detail": "Need company structure for larger clients."}]'::jsonb,
'[{"category": "General", "q": "What is an OPC?", "a": "One Person Company has single member and director with limited liability."},{"category": "Process", "q": "Can OPC have employees?", "a": "Yes. OPC can hire employees and scale business."}]'::jsonb,
'[{"name": "MCA21 Portal", "url": "https://www.mca.gov.in", "description": "OPC registration"}]'::jsonb,
'[{"name": "GST Registration", "explanation": "Required once billing starts.", "price": "₹8,999", "type": "required", "slug": "gst-registration"}]'::jsonb,
ARRAY['✓ Quick incorporation', '✓ Nominee form handled', '✓ PAN same day'],
ARRAY['gst-registration', 'pvt-ltd-incorporation']);

-- 15. Partnership Deed Registration
INSERT INTO service_packages (slug, name, short_name, category, tagline, short_description, order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate, sla_working_days, urgency_score, situation_tags, is_active, display_order, service_type, mandatory_for, legal_basis, penalty_for_missing, penalty_color, seo_title, seo_description, canonical_url, workflow_stages, whats_included, service_risks, profile_personas, faqs, review_sources, unlocks, review_keyword_chips, related_slugs) VALUES
('partnership-registration', 'Partnership Firm Registration', 'Partnership', 'Business Registration', 'Two or more partners. Simple structure. Quick start.', 'Register your partnership firm with drafted deed', 'one_time', 'one_time', 599900, 99900, 18, 7, 75, ARRAY['just_starting_out'], true, 15, 'One-time', 'Two or more partners in business', 'Indian Partnership Act, 1932', NULL, 'none', 'Partnership Firm Registration | ₹6,999 | Ollvy', 'Register partnership with drafted deed in 7 days.', 'https://ollvy.com/services/partnership-registration',
'[{"step": 1, "title": "Partner details collected", "timeline": "Day 0-1", "body": "Names, capital contribution, profit sharing ratio.", "visual": "checklist", "milestone": "Details received"},{"step": 2, "title": "Deed drafted", "timeline": "Day 1-3", "body": "Partnership deed with all clauses drafted.", "visual": "form", "milestone": "Deed ready"},{"step": 3, "title": "Deed executed", "timeline": "Day 3-5", "body": "Partners sign deed on stamp paper.", "visual": "stamp", "milestone": "Deed signed"},{"step": 4, "title": "Firm registered", "timeline": "Day 5-7", "body": "Registered with Registrar of Firms.", "visual": "stamp", "isCompletion": true, "milestone": "Firm registered"}]'::jsonb,
'[{"title": "Custom partnership deed", "body": "Drafted based on your specific terms - profit ratio, roles, exit clauses."},{"title": "Stamp paper arranged", "body": "We arrange appropriate stamp paper for your state."},{"title": "Registrar filing", "body": "Filed with Registrar of Firms in your state."}]'::jsonb,
'[{"icon": "document", "title": "Profit sharing must be clear", "body": "Disputes arise from vague profit clauses. We draft explicit terms."}]'::jsonb,
'[{"label": "Family partnership", "detail": "Running with family members."},{"label": "Professional practice", "detail": "CA/CS/lawyers forming practice."}]'::jsonb,
'[{"category": "General", "q": "Do partners have unlimited liability?", "a": "Yes. Partners are personally liable for firm debts."}]'::jsonb,
'[{"name": "Partnership Act 1932", "url": "https://www.indiacode.nic.in", "description": "Partnership regulations"}]'::jsonb,
'[{"name": "GST Registration", "explanation": "Required for billing.", "price": "₹8,999", "type": "required", "slug": "gst-registration"}]'::jsonb,
ARRAY['✓ Deed was thorough', '✓ Quick registration'],
ARRAY['gst-registration', 'llp-incorporation']);

-- 16. MSME/Udyam Registration
INSERT INTO service_packages (slug, name, short_name, category, tagline, short_description, order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate, sla_working_days, urgency_score, situation_tags, is_active, display_order, service_type, mandatory_for, legal_basis, penalty_for_missing, penalty_color, seo_title, seo_description, canonical_url, workflow_stages, whats_included, service_risks, profile_personas, faqs, review_sources, unlocks, review_keyword_chips, related_slugs) VALUES
('msme-registration', 'MSME/Udyam Registration', 'MSME', 'Licensing', 'Government benefits. Priority lending. Subsidy schemes.', 'Register for MSME benefits under Udyam portal', 'one_time', 'one_time', 199900, 0, 18, 2, 70, ARRAY['just_starting_out'], true, 16, 'One-time', 'Micro, Small, and Medium Enterprises', 'MSME Development Act, 2006', NULL, 'none', 'MSME Udyam Registration | ₹1,999 | Ollvy', 'Get Udyam certificate in 2 days. Unlock govt schemes.', 'https://ollvy.com/services/msme-registration',
'[{"step": 1, "title": "Share Aadhaar and PAN", "timeline": "Day 0", "body": "Owner Aadhaar for OTP verification, business PAN.", "visual": "upload", "milestone": "Details received"},{"step": 2, "title": "Application filed on Udyam", "timeline": "Day 1", "body": "Application submitted on official portal.", "visual": "form", "milestone": "Application submitted"},{"step": 3, "title": "Udyam certificate issued", "timeline": "Day 1-2", "body": "Certificate with URN generated.", "visual": "stamp", "isCompletion": true, "milestone": "MSME registered"}]'::jsonb,
'[{"title": "Udyam certificate with URN", "body": "Official certificate with Unique Registration Number."},{"title": "Automatic GST linking", "body": "Your GSTIN linked to Udyam registration."},{"title": "Access to govt schemes", "body": "Priority lending, subsidy schemes, tender reservations."}]'::jsonb,
'[{"icon": "document", "title": "Self-declaration based", "body": "Investment and turnover are self-declared. Keep records for audit."}]'::jsonb,
'[{"label": "Small business", "detail": "Under ₹5Cr investment in plant/machinery."},{"label": "Service enterprise", "detail": "IT, consulting, professional services."}]'::jsonb,
'[{"category": "General", "q": "What are MSME benefits?", "a": "Priority sector lending, govt tenders, subsidy schemes."},{"category": "Process", "q": "Is Udyam registration free?", "a": "Free on portal. Our fee is for filing assistance."}]'::jsonb,
'[{"name": "Udyam Portal", "url": "https://udyamregistration.gov.in", "description": "Official MSME registration"}]'::jsonb,
'[]'::jsonb,
ARRAY['✓ Certificate same day', '✓ Very quick'],
ARRAY['gst-registration', 'startup-india']);

-- 17. Shop and Establishment License
INSERT INTO service_packages (slug, name, short_name, category, tagline, short_description, order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate, sla_working_days, urgency_score, situation_tags, is_active, display_order, service_type, mandatory_for, legal_basis, penalty_for_missing, penalty_color, seo_title, seo_description, canonical_url, workflow_stages, whats_included, service_risks, profile_personas, faqs, review_sources, unlocks, review_keyword_chips, related_slugs) VALUES
('shop-establishment', 'Shop & Establishment License', 'Shop Act', 'Licensing', 'Mandatory for any commercial premises. State-issued.', 'Obtain shop and establishment registration', 'one_time', 'one_time', 299900, 99900, 18, 10, 70, ARRAY['just_starting_out'], true, 17, 'One-time', 'All businesses with commercial premises', 'Shops and Establishments Act (State-specific)', '₹500-₹2,500 fine per day', 'amber', 'Shop & Establishment License | ₹3,999 | Ollvy', 'Get shop act license in 10 days. State-compliant.', 'https://ollvy.com/services/shop-establishment',
'[{"step": 1, "title": "Premises and employee details", "timeline": "Day 0-1", "body": "Shop name, address, employee count, working hours.", "visual": "checklist", "milestone": "Details received"},{"step": 2, "title": "Application prepared", "timeline": "Day 1-3", "body": "Form filled for your state portal.", "visual": "form", "milestone": "Application ready"},{"step": 3, "title": "Filed on state portal", "timeline": "Day 3-8", "body": "Submitted to Labour Department.", "visual": "form", "milestone": "Application filed"},{"step": 4, "title": "License issued", "timeline": "Day 8-10", "body": "Registration certificate received.", "visual": "stamp", "isCompletion": true, "milestone": "License issued"}]'::jsonb,
'[{"title": "State-specific compliance", "body": "Each state has different rules. We handle your state."},{"title": "Renewal tracking", "body": "Most states require annual renewal. Added to your calendar."}]'::jsonb,
'[{"icon": "clock", "title": "Renewal required", "body": "Most states require annual renewal. Late renewal attracts penalty."}]'::jsonb,
'[{"label": "Opening new office", "detail": "Setting up commercial premises."},{"label": "Hiring first employee", "detail": "Shop Act needed when you have employees."}]'::jsonb,
'[{"category": "General", "q": "Is Shop Act mandatory?", "a": "Yes. All commercial establishments need it within 30 days of starting."}]'::jsonb,
'[{"name": "State Labour Portal", "url": "", "description": "Varies by state"}]'::jsonb,
'[]'::jsonb,
ARRAY['✓ State-specific handled', '✓ Renewal reminder set'],
ARRAY['professional-tax', 'gst-registration']);

-- 18. Professional Tax Registration
INSERT INTO service_packages (slug, name, short_name, category, tagline, short_description, order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate, sla_working_days, urgency_score, situation_tags, is_active, display_order, service_type, mandatory_for, legal_basis, penalty_for_missing, penalty_color, seo_title, seo_description, canonical_url, workflow_stages, whats_included, service_risks, profile_personas, faqs, review_sources, unlocks, review_keyword_chips, related_slugs) VALUES
('professional-tax', 'Professional Tax Registration', 'PT', 'Licensing', 'State tax on professionals and employers. Monthly/annual payment.', 'Register for professional tax in your state', 'one_time', 'one_time', 199900, 0, 18, 5, 70, ARRAY['need_to_hire'], true, 18, 'One-time', 'Professionals and employers in PT-applicable states', 'Professional Tax Act (State-specific)', 'Varies by state - typically 10% penalty', 'amber', 'Professional Tax Registration | ₹1,999 | Ollvy', 'PT registration in 5 days. Employer and employee coverage.', 'https://ollvy.com/services/professional-tax',
'[{"step": 1, "title": "Business and employee details", "timeline": "Day 0-1", "body": "Entity type, employee count, state of operation.", "visual": "checklist", "milestone": "Details received"},{"step": 2, "title": "Application filed", "timeline": "Day 1-3", "body": "Filed on state commercial tax portal.", "visual": "form", "milestone": "Application submitted"},{"step": 3, "title": "PTEC/PTRC issued", "timeline": "Day 3-5", "body": "PT enrollment/registration certificate received.", "visual": "stamp", "isCompletion": true, "milestone": "PT registered"}]'::jsonb,
'[{"title": "PTEC for employers", "body": "Professional Tax Enrollment Certificate for employer registration."},{"title": "PTRC for professionals", "body": "Professional Tax Registration Certificate for individual professionals."},{"title": "Monthly/annual filing setup", "body": "Filing frequency depends on your state."}]'::jsonb,
'[{"icon": "clock", "title": "Monthly deposit", "body": "PT typically due by 30th of following month."}]'::jsonb,
'[{"label": "Hiring employees in PT state", "detail": "Maharashtra, Karnataka, etc. require PT."},{"label": "Professional starting practice", "detail": "CA/CS/lawyers need PT registration."}]'::jsonb,
'[{"category": "General", "q": "Which states have PT?", "a": "Maharashtra, Karnataka, West Bengal, Gujarat, and others."},{"category": "Process", "q": "Maximum PT amount?", "a": "₹2,500 per year (Constitutional limit)."}]'::jsonb,
'[{"name": "State Commercial Tax", "url": "", "description": "Varies by state"}]'::jsonb,
'[]'::jsonb,
ARRAY['✓ Quick registration', '✓ Filing calendar set'],
ARRAY['payroll-management', 'shop-establishment']);

-- 19. Startup India (DPIIT) Registration
INSERT INTO service_packages (slug, name, short_name, category, tagline, short_description, order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate, sla_working_days, urgency_score, situation_tags, is_active, display_order, service_type, mandatory_for, legal_basis, penalty_for_missing, penalty_color, seo_title, seo_description, canonical_url, workflow_stages, whats_included, service_risks, profile_personas, faqs, review_sources, unlocks, review_keyword_chips, related_slugs) VALUES
('startup-india', 'Startup India (DPIIT) Registration', 'DPIIT', 'Licensing', 'Tax exemptions. Fund eligibility. Government recognition.', 'Get DPIIT recognition for your startup', 'one_time', 'one_time', 799900, 0, 18, 7, 70, ARRAY['have_investors'], true, 19, 'One-time', 'Startups with innovation or IP', 'Startup India Policy, DPIIT Guidelines', NULL, 'none', 'DPIIT Startup India Registration | ₹7,999 | Ollvy', 'Get DPIIT recognition in 7 days. Unlock tax benefits.', 'https://ollvy.com/services/startup-india',
'[{"step": 1, "title": "Business details and innovation", "timeline": "Day 0-1", "body": "Describe your product/service innovation.", "visual": "checklist", "milestone": "Details received"},{"step": 2, "title": "Application prepared", "timeline": "Day 1-3", "body": "Startup India portal application drafted.", "visual": "form", "milestone": "Application ready"},{"step": 3, "title": "Filed on portal", "timeline": "Day 3-5", "body": "Submitted to DPIIT for review.", "visual": "form", "milestone": "Application filed"},{"step": 4, "title": "Recognition received", "timeline": "Day 5-7", "body": "DPIIT certificate issued.", "visual": "stamp", "isCompletion": true, "milestone": "Startup recognized"}]'::jsonb,
'[{"title": "DPIIT recognition certificate", "body": "Official startup recognition from Government of India."},{"title": "Section 80-IAC eligibility", "body": "3 years of tax holiday on profits (if approved by Inter-Ministerial Board)."},{"title": "Angel tax exemption", "body": "Exemption from Section 56(2)(viib) on premium received."},{"title": "Fast-track patent filing", "body": "80% rebate on patent filing fees."}]'::jsonb,
'[{"icon": "document", "title": "Innovation required", "body": "Business must show innovation, scalability, or IP. We help articulate this."}]'::jsonb,
'[{"label": "Tech startup", "detail": "Building technology product or platform."},{"label": "Raising angel/VC funding", "detail": "Angel tax exemption important."}]'::jsonb,
'[{"category": "General", "q": "What is DPIIT recognition?", "a": "Government recognition as an innovative startup."},{"category": "Eligibility", "q": "Who is eligible?", "a": "Company/LLP under 10 years, turnover under ₹100Cr, innovation-driven."}]'::jsonb,
'[{"name": "Startup India", "url": "https://www.startupindia.gov.in", "description": "Official Startup India portal"}]'::jsonb,
'[]'::jsonb,
ARRAY['✓ Recognition in 5 days', '✓ Tax benefits clear'],
ARRAY['pvt-ltd-incorporation', 'trademark-registration']);

-- 20. GST LUT Filing
INSERT INTO service_packages (slug, name, short_name, category, tagline, short_description, order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate, sla_working_days, urgency_score, situation_tags, is_active, display_order, service_type, mandatory_for, legal_basis, penalty_for_missing, penalty_color, seo_title, seo_description, canonical_url, workflow_stages, whats_included, service_risks, profile_personas, faqs, review_sources, unlocks, review_keyword_chips, related_slugs) VALUES
('gst-lut', 'GST LUT Filing', 'LUT', 'Tax Filing', 'Export without paying GST. Letter of Undertaking for exporters.', 'File LUT to export without paying IGST', 'one_time', 'annual', 299900, 0, 18, 2, 75, ARRAY['expanding_internationally'], true, 20, 'Annual', 'All exporters of goods or services', 'CGST Rules 2017, Rule 96A', 'Must pay IGST on exports if LUT not filed', 'none', 'GST LUT Filing | ₹2,999 | Ollvy', 'File LUT for zero-rated exports. Annual filing.', 'https://ollvy.com/services/gst-lut',
'[{"step": 1, "title": "Share GST details", "timeline": "Day 0", "body": "GSTIN, previous year export data.", "visual": "upload", "milestone": "Details received"},{"step": 2, "title": "LUT filed on GST portal", "timeline": "Day 1-2", "body": "Form GST RFD-11 filed.", "visual": "form", "milestone": "LUT filed"},{"step": 3, "title": "LUT ARN received", "timeline": "Day 2", "body": "Acknowledgement received.", "visual": "stamp", "isCompletion": true, "milestone": "LUT active"}]'::jsonb,
'[{"title": "Zero-rated exports", "body": "Export without paying IGST. Cash flow preserved."},{"title": "Annual validity", "body": "LUT valid for one financial year. Renewal reminded."}]'::jsonb,
'[{"icon": "clock", "title": "Annual renewal required", "body": "LUT must be filed each financial year."}]'::jsonb,
'[{"label": "Software exporter", "detail": "IT services to foreign clients."},{"label": "Goods exporter", "detail": "Physical goods exported."}]'::jsonb,
'[{"category": "General", "q": "What is LUT?", "a": "Letter of Undertaking to export without paying IGST."},{"category": "Eligibility", "q": "Who can file LUT?", "a": "Any exporter with no pending tax demands or prosecution."}]'::jsonb,
'[{"name": "GST Portal", "url": "https://www.gst.gov.in", "description": "GST compliance"}]'::jsonb,
'[]'::jsonb,
ARRAY['✓ Same day filing', '✓ Reminder for renewal'],
ARRAY['gst-registration', 'iec-code']);

-- 21. GST Cancellation
INSERT INTO service_packages (slug, name, short_name, category, tagline, short_description, order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate, sla_working_days, urgency_score, situation_tags, is_active, display_order, service_type, mandatory_for, legal_basis, penalty_for_missing, penalty_color, seo_title, seo_description, canonical_url, workflow_stages, whats_included, service_risks, profile_personas, faqs, review_sources, unlocks, review_keyword_chips, related_slugs) VALUES
('gst-cancellation', 'GST Cancellation', 'GST Cancel', 'Tax Filing', 'Close your GST registration properly. Final return filed.', 'Cancel GST registration with final return', 'one_time', 'one_time', 299900, 0, 18, 15, 60, ARRAY['winding_down'], true, 21, 'One-time', 'Businesses closing or not meeting GST threshold', 'CGST Act 2017, Section 29', 'Continued compliance if not cancelled', 'amber', 'GST Cancellation | ₹2,999 | Ollvy', 'Cancel GST registration. Final return included.', 'https://ollvy.com/services/gst-cancellation',
'[{"step": 1, "title": "ITC and liability check", "timeline": "Day 0-2", "body": "Review ITC balance and pending liabilities.", "visual": "checklist", "milestone": "Liability reviewed"},{"step": 2, "title": "GSTR-10 prepared", "timeline": "Day 2-5", "body": "Final return with stock details prepared.", "visual": "form", "milestone": "Final return ready"},{"step": 3, "title": "Cancellation filed", "timeline": "Day 5-10", "body": "REG-16 and GSTR-10 filed.", "visual": "form", "milestone": "Cancellation filed"},{"step": 4, "title": "Cancellation order", "timeline": "Day 10-15", "body": "GST officer issues cancellation order.", "visual": "stamp", "isCompletion": true, "milestone": "GST cancelled"}]'::jsonb,
'[{"title": "Final return GSTR-10", "body": "Stock details and ITC reversal calculated."},{"title": "REG-16 filing", "body": "Cancellation application with reason."},{"title": "ITC reversal handled", "body": "Remaining ITC reversed as required."}]'::jsonb,
'[{"icon": "document", "title": "ITC reversal required", "body": "Unused ITC must be reversed on closing stock."}]'::jsonb,
'[{"label": "Closing business", "detail": "Winding down operations."},{"label": "Below threshold", "detail": "Turnover dropped below ₹40L."}]'::jsonb,
'[{"category": "General", "q": "What happens to ITC?", "a": "ITC on closing stock must be reversed or paid."},{"category": "Process", "q": "Can I re-register later?", "a": "Yes. Fresh registration application can be filed."}]'::jsonb,
'[{"name": "GST Portal", "url": "https://www.gst.gov.in", "description": "GST compliance"}]'::jsonb,
'[]'::jsonb,
ARRAY['✓ ITC handled properly', '✓ Final return filed'],
ARRAY['company-closure', 'llp-closure']);

-- 22. GST Revocation
INSERT INTO service_packages (slug, name, short_name, category, tagline, short_description, order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate, sla_working_days, urgency_score, situation_tags, is_active, display_order, service_type, mandatory_for, legal_basis, penalty_for_missing, penalty_color, seo_title, seo_description, canonical_url, workflow_stages, whats_included, service_risks, profile_personas, faqs, review_sources, unlocks, review_keyword_chips, related_slugs) VALUES
('gst-revocation', 'GST Revocation', 'GST Revoke', 'Tax Filing', 'GST cancelled by department? We help restore it.', 'Revoke suo-moto GST cancellation', 'one_time', 'one_time', 499900, 0, 18, 10, 90, ARRAY['filing_taxes'], true, 22, 'One-time', 'Businesses whose GST was cancelled suo-moto', 'CGST Act 2017, Section 30', 'Loss of GST registration', 'red', 'GST Revocation | ₹4,999 | Ollvy', 'Restore cancelled GST registration. Urgent filing.', 'https://ollvy.com/services/gst-revocation',
'[{"step": 1, "title": "Review cancellation order", "timeline": "Day 0-1", "body": "Understand reason for suo-moto cancellation.", "visual": "checklist", "milestone": "Order reviewed"},{"step": 2, "title": "File pending returns", "timeline": "Day 1-5", "body": "All pending GSTR-1 and GSTR-3B filed.", "visual": "form", "milestone": "Returns filed"},{"step": 3, "title": "REG-21 filed", "timeline": "Day 5-7", "body": "Revocation application submitted.", "visual": "form", "milestone": "Revocation filed"},{"step": 4, "title": "GST restored", "timeline": "Day 7-10", "body": "Registration restored by officer.", "visual": "stamp", "isCompletion": true, "milestone": "GST active again"}]'::jsonb,
'[{"title": "Pending returns filed", "body": "All GSTR-1 and GSTR-3B filed with interest."},{"title": "REG-21 application", "body": "Revocation request with explanation."},{"title": "Interest calculation", "body": "Late payment interest calculated and paid."}]'::jsonb,
'[{"icon": "clock", "title": "30-day deadline", "body": "Revocation must be filed within 30 days of cancellation (extensions possible)."}]'::jsonb,
'[{"label": "Missed filing deadline", "detail": "GST cancelled for non-filing."},{"label": "Want to continue business", "detail": "Need GST to invoice clients."}]'::jsonb,
'[{"category": "General", "q": "Why was GST cancelled?", "a": "Usually for not filing returns for 6+ months."},{"category": "Urgency", "q": "Time limit for revocation?", "a": "Within 30 days of cancellation order."}]'::jsonb,
'[{"name": "GST Portal", "url": "https://www.gst.gov.in", "description": "GST compliance"}]'::jsonb,
'[]'::jsonb,
ARRAY['✓ Returns filed urgently', '✓ GST restored', '✓ Very responsive'],
ARRAY['gst-monthly-50l', 'gst-registration']);

-- 23. Company Strike-Off
INSERT INTO service_packages (slug, name, short_name, category, tagline, short_description, order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate, sla_working_days, urgency_score, situation_tags, is_active, display_order, service_type, mandatory_for, legal_basis, penalty_for_missing, penalty_color, seo_title, seo_description, canonical_url, workflow_stages, whats_included, service_risks, profile_personas, faqs, review_sources, unlocks, review_keyword_chips, related_slugs) VALUES
('company-closure', 'Company Strike-Off (Closure)', 'Strike-Off', 'Company Registration', 'Close your company properly. No more compliance burden.', 'Voluntary strike-off of private limited company', 'one_time', 'one_time', 999900, 500000, 18, 90, 60, ARRAY['winding_down'], true, 23, 'One-time', 'Companies wanting to close voluntarily', 'Companies Act 2013, Section 248', 'Company remains active with ongoing compliance', 'none', 'Company Strike-Off | ₹14,999 | Ollvy', 'Close your company with MCA strike-off.', 'https://ollvy.com/services/company-closure',
'[{"step": 1, "title": "Pre-closure compliance", "timeline": "Day 0-15", "body": "Pending returns, Director KYC, final accounts.", "visual": "checklist", "milestone": "Compliance up to date"},{"step": 2, "title": "Board and shareholder resolution", "timeline": "Day 15-25", "body": "Resolutions for voluntary strike-off.", "visual": "form", "milestone": "Resolutions passed"},{"step": 3, "title": "Creditor/affidavit preparation", "timeline": "Day 25-35", "body": "Indemnity bond, affidavit, creditor statement.", "visual": "form", "milestone": "Documents ready"},{"step": 4, "title": "STK-2 filed", "timeline": "Day 35-45", "body": "Strike-off application filed with MCA.", "visual": "form", "milestone": "STK-2 filed"},{"step": 5, "title": "Strike-off order", "timeline": "Day 45-90", "body": "ROC processes and issues strike-off order.", "visual": "stamp", "isCompletion": true, "milestone": "Company closed"}]'::jsonb,
'[{"title": "All pending compliance filed", "body": "Director KYC, annual returns, financial statements - all cleared."},{"title": "STK-2 with affidavit", "body": "Strike-off form with required declarations."},{"title": "Indemnity bond", "body": "Indemnity from directors for any future claims."}]'::jsonb,
'[{"icon": "document", "title": "No active liabilities", "body": "Company must have no pending liabilities or proceedings."},{"icon": "clock", "title": "Takes 3 months", "body": "ROC takes time to process strike-off applications."}]'::jsonb,
'[{"label": "No business activity", "detail": "Company dormant for 2+ years."},{"label": "Want to end compliance burden", "detail": "Tired of annual filings."}]'::jsonb,
'[{"category": "General", "q": "What is strike-off?", "a": "Voluntary removal of company from ROC register."},{"category": "Eligibility", "q": "Who can apply?", "a": "Company with no operations/assets for 2 years or never started business."}]'::jsonb,
'[{"name": "MCA21 Portal", "url": "https://www.mca.gov.in", "description": "Company filings"}]'::jsonb,
'[]'::jsonb,
ARRAY['✓ All compliance cleared first', '✓ STK-2 filed properly'],
ARRAY['gst-cancellation', 'mca-annual-filing']);

-- 24. LLP Closure
INSERT INTO service_packages (slug, name, short_name, category, tagline, short_description, order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate, sla_working_days, urgency_score, situation_tags, is_active, display_order, service_type, mandatory_for, legal_basis, penalty_for_missing, penalty_color, seo_title, seo_description, canonical_url, workflow_stages, whats_included, service_risks, profile_personas, faqs, review_sources, unlocks, review_keyword_chips, related_slugs) VALUES
('llp-closure', 'LLP Closure (Strike-Off)', 'LLP Close', 'Company Registration', 'Close your LLP. No more Form 11 and Form 8.', 'Voluntary strike-off of LLP', 'one_time', 'one_time', 799900, 300000, 18, 60, 60, ARRAY['winding_down'], true, 24, 'One-time', 'LLPs wanting to close voluntarily', 'LLP Act 2008, Section 75', 'LLP remains active with ongoing compliance', 'none', 'LLP Closure Strike-Off | ₹10,999 | Ollvy', 'Close your LLP with MCA strike-off.', 'https://ollvy.com/services/llp-closure',
'[{"step": 1, "title": "Pending compliance cleared", "timeline": "Day 0-15", "body": "Form 11, Form 8, Partner KYC.", "visual": "checklist", "milestone": "Compliance done"},{"step": 2, "title": "Partner consent", "timeline": "Day 15-20", "body": "All partners agree to closure.", "visual": "form", "milestone": "Consent obtained"},{"step": 3, "title": "Form 24 filed", "timeline": "Day 20-30", "body": "Strike-off application submitted.", "visual": "form", "milestone": "Form 24 filed"},{"step": 4, "title": "Strike-off order", "timeline": "Day 30-60", "body": "ROC issues strike-off order.", "visual": "stamp", "isCompletion": true, "milestone": "LLP closed"}]'::jsonb,
'[{"title": "All pending returns filed", "body": "Form 11 (annual return) and Form 8 (statement) cleared."},{"title": "Form 24 filing", "body": "Strike-off application with declarations."},{"title": "Partner indemnity", "body": "Indemnity from partners for future claims."}]'::jsonb,
'[{"icon": "document", "title": "All partners must consent", "body": "Unanimous consent required for voluntary closure."}]'::jsonb,
'[{"label": "LLP not operational", "detail": "No business for 2+ years."},{"label": "Partners want to move on", "detail": "Ending the partnership."}]'::jsonb,
'[{"category": "General", "q": "What is LLP strike-off?", "a": "Removal of LLP from ROC register."}]'::jsonb,
'[{"name": "MCA21 Portal", "url": "https://www.mca.gov.in", "description": "LLP filings"}]'::jsonb,
'[]'::jsonb,
ARRAY['✓ Clean closure', '✓ All returns filed first'],
ARRAY['gst-cancellation', 'llp-incorporation']);

-- 25. ROC Change Filing (Director/Address/etc.)
INSERT INTO service_packages (slug, name, short_name, category, tagline, short_description, order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate, sla_working_days, urgency_score, situation_tags, is_active, display_order, service_type, mandatory_for, legal_basis, penalty_for_missing, penalty_color, seo_title, seo_description, canonical_url, workflow_stages, whats_included, service_risks, profile_personas, faqs, review_sources, unlocks, review_keyword_chips, related_slugs) VALUES
('roc-changes', 'ROC Change Filings', 'ROC Change', 'Company Registration', 'Director appointment. Address change. Share transfer. Any ROC change.', 'File any ROC form for company changes', 'one_time', 'one_time', 499900, 200000, 18, 7, 75, ARRAY['just_starting_out'], true, 25, 'One-time', 'Companies with any change to be filed with ROC', 'Companies Act 2013', '₹100-₹300/day late fee', 'amber', 'ROC Change Filing | ₹6,999 | Ollvy', 'File ROC form for any company change.', 'https://ollvy.com/services/roc-changes',
'[{"step": 1, "title": "Understand the change", "timeline": "Day 0-1", "body": "Director addition/removal, address change, share transfer, etc.", "visual": "checklist", "milestone": "Change identified"},{"step": 2, "title": "Resolution and documents", "timeline": "Day 1-3", "body": "Board/shareholder resolution, supporting documents.", "visual": "form", "milestone": "Documents ready"},{"step": 3, "title": "Form filed with MCA", "timeline": "Day 3-5", "body": "Appropriate form filed - DIR-12, INC-22, SH-4, etc.", "visual": "form", "milestone": "Form filed"},{"step": 4, "title": "Confirmation received", "timeline": "Day 5-7", "body": "ROC acknowledges the change.", "visual": "stamp", "isCompletion": true, "milestone": "Change registered"}]'::jsonb,
'[{"title": "Any ROC form", "body": "DIR-12, INC-22, SH-4, MGT-14, and more."},{"title": "Resolution drafting", "body": "Board/shareholder resolution as required."},{"title": "Supporting documents", "body": "All supporting documents prepared and filed."}]'::jsonb,
'[{"icon": "clock", "title": "30-day deadline", "body": "Most changes must be filed within 30 days."}]'::jsonb,
'[{"label": "Adding new director", "detail": "DIR-12 for appointment."},{"label": "Changing registered office", "detail": "INC-22 for address change."},{"label": "Share transfer", "detail": "SH-4 for share transfer."}]'::jsonb,
'[{"category": "General", "q": "What forms does this cover?", "a": "Any company change form - director, address, shares, etc."}]'::jsonb,
'[{"name": "MCA21 Portal", "url": "https://www.mca.gov.in", "description": "Company filings"}]'::jsonb,
'[]'::jsonb,
ARRAY['✓ Quick filing', '✓ Resolution included'],
ARRAY['mca-annual-filing', 'director-kyc']);

-- 26. Accounting & Bookkeeping
INSERT INTO service_packages (slug, name, short_name, category, tagline, short_description, order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate, sla_working_days, urgency_score, situation_tags, is_active, display_order, service_type, mandatory_for, legal_basis, penalty_for_missing, penalty_color, seo_title, seo_description, canonical_url, retainer_cycle_label, workflow_stages, whats_included, service_risks, profile_personas, faqs, review_sources, unlocks, review_keyword_chips, related_slugs) VALUES
('accounting-bookkeeping', 'Accounting & Bookkeeping', 'Bookkeeping', 'Monthly Compliance', 'Books maintained. GST reconciled. Audit-ready financials.', 'Monthly accounting and bookkeeping service', 'recurring', 'monthly', 399900, 0, 18, 10, 80, ARRAY['filing_taxes'], true, 26, 'Monthly retainer', 'All businesses needing proper books of accounts', 'Companies Act 2013, IT Act 1961', 'Accounts not maintained - penalties vary', 'none', 'Accounting Bookkeeping Service | ₹3,999/mo | Ollvy', 'Monthly bookkeeping. Audit-ready books.', 'https://ollvy.com/services/accounting-bookkeeping', 'per month',
'[{"step": 1, "title": "Share bank statement and invoices", "timeline": "Day 1-5", "body": "Bank statement, sales invoices, purchase bills.", "visual": "upload", "milestone": "Data received"},{"step": 2, "title": "Transactions recorded", "timeline": "Day 5-8", "body": "All entries passed in accounting software.", "visual": "form", "milestone": "Books updated"},{"step": 3, "title": "GST reconciliation", "timeline": "Day 8-10", "body": "Books reconciled with GST returns.", "visual": "checklist", "milestone": "GST matched"},{"step": 4, "title": "Monthly financials shared", "timeline": "Day 10", "body": "P&L and Balance Sheet shared.", "visual": "stamp", "isCompletion": true, "milestone": "Month closed"}]'::jsonb,
'[{"title": "Full transaction recording", "body": "Sales, purchases, expenses, receipts - all recorded."},{"title": "Bank reconciliation", "body": "Books matched with bank statement monthly."},{"title": "GST reconciliation", "body": "Books match with GSTR-1 and GSTR-3B."},{"title": "Monthly P&L and Balance Sheet", "body": "Financial statements every month."}]'::jsonb,
'[{"icon": "document", "title": "Data must be shared on time", "body": "Late data = delayed books."}]'::jsonb,
'[{"label": "Startup without accountant", "detail": "Need proper books from day one."},{"label": "Growing business", "detail": "Transaction volume increasing."}]'::jsonb,
'[{"category": "Pricing", "q": "What''s the pricing?", "a": "₹3,999/month for up to 100 transactions. Higher volume quoted separately."}]'::jsonb,
'[{"name": "Companies Act 2013", "url": "https://www.mca.gov.in", "description": "Accounting requirements"}]'::jsonb,
'[]'::jsonb,
ARRAY['✓ Books always updated', '✓ GST matched', '✓ Monthly reports'],
ARRAY['gst-monthly-50l', 'business-itr']);

-- 27. Statutory Audit
INSERT INTO service_packages (slug, name, short_name, category, tagline, short_description, order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate, sla_working_days, urgency_score, situation_tags, is_active, display_order, service_type, mandatory_for, legal_basis, penalty_for_missing, penalty_color, seo_title, seo_description, canonical_url, workflow_stages, whats_included, service_risks, profile_personas, faqs, review_sources, unlocks, review_keyword_chips, related_slugs) VALUES
('statutory-audit', 'Statutory Audit', 'Audit', 'Tax Filing', 'Independent audit of your financials. Compliant with Companies Act.', 'Annual statutory audit by qualified CA', 'one_time', 'annual', 2499900, 0, 18, 30, 85, ARRAY['filing_taxes'], true, 27, 'Annual', 'All Pvt Ltd companies and LLPs above threshold', 'Companies Act 2013, Section 139-147', '₹50,000 fine on company + ₹25,000 on officers', 'red', 'Statutory Audit | ₹24,999 | Ollvy', 'Independent audit by qualified CA.', 'https://ollvy.com/services/statutory-audit',
'[{"step": 1, "title": "Engagement and planning", "timeline": "Day 0-5", "body": "Audit engagement letter, materiality set.", "visual": "checklist", "milestone": "Audit planned"},{"step": 2, "title": "Fieldwork", "timeline": "Day 5-20", "body": "Vouching, verification, analytical review.", "visual": "form", "milestone": "Testing done"},{"step": 3, "title": "Draft report shared", "timeline": "Day 20-25", "body": "Draft audit report with findings.", "visual": "form", "milestone": "Draft ready"},{"step": 4, "title": "Final audit report", "timeline": "Day 25-30", "body": "Signed audit report with financials.", "visual": "stamp", "isCompletion": true, "milestone": "Audit complete"}]'::jsonb,
'[{"title": "Independent audit opinion", "body": "Unqualified/qualified opinion on true and fair view."},{"title": "Audit report per SA standards", "body": "Compliant with Standards on Auditing."},{"title": "Notes on accounts", "body": "Disclosures as per Schedule III."}]'::jsonb,
'[{"icon": "clock", "title": "Auditor to be appointed", "body": "ADT-1 to be filed within 15 days of AGM."},{"icon": "document", "title": "Books must be ready", "body": "Audit requires finalised books of accounts."}]'::jsonb,
'[{"label": "First year audit", "detail": "First statutory audit post-incorporation."},{"label": "Turnover crossed ₹1Cr", "detail": "Audit now mandatory."}]'::jsonb,
'[{"category": "General", "q": "Is audit mandatory for all companies?", "a": "Yes. All Pvt Ltd companies must be audited."}]'::jsonb,
'[{"name": "ICAI", "url": "https://www.icai.org", "description": "Auditing standards"}]'::jsonb,
'[]'::jsonb,
ARRAY['✓ Thorough audit', '✓ Clean report', '✓ CA was detailed'],
ARRAY['mca-annual-filing', 'business-itr']);

-- 28. DIN Reactivation
INSERT INTO service_packages (slug, name, short_name, category, tagline, short_description, order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate, sla_working_days, urgency_score, situation_tags, is_active, display_order, service_type, mandatory_for, legal_basis, penalty_for_missing, penalty_color, seo_title, seo_description, canonical_url, workflow_stages, whats_included, service_risks, profile_personas, faqs, review_sources, unlocks, review_keyword_chips, related_slugs) VALUES
('din-reactivation', 'DIN Reactivation', 'DIN Reactivate', 'Company Registration', 'DIN deactivated? We restore it with all compliances.', 'Reactivate deactivated Director Identification Number', 'one_time', 'one_time', 349900, 500000, 18, 10, 85, ARRAY['filing_taxes'], true, 28, 'One-time', 'Directors with deactivated DIN', 'Companies Act 2013, Rule 11 of DIN Rules', 'Cannot act as director if DIN deactivated', 'red', 'DIN Reactivation | ₹8,499 | Ollvy', 'Reactivate your DIN. Resume directorship.', 'https://ollvy.com/services/din-reactivation',
'[{"step": 1, "title": "Check reason for deactivation", "timeline": "Day 0-1", "body": "DIN deactivated for KYC or other reasons.", "visual": "checklist", "milestone": "Reason identified"},{"step": 2, "title": "File pending KYC", "timeline": "Day 1-5", "body": "DIR-3 KYC filed for all pending years.", "visual": "form", "milestone": "KYC filed"},{"step": 3, "title": "Reactivation application", "timeline": "Day 5-7", "body": "DIR-3C with fee paid.", "visual": "form", "milestone": "Application filed"},{"step": 4, "title": "DIN reactivated", "timeline": "Day 7-10", "body": "DIN status changed to Active.", "visual": "stamp", "isCompletion": true, "milestone": "DIN active"}]'::jsonb,
'[{"title": "All pending KYC filed", "body": "DIR-3 KYC for all years cleared."},{"title": "DIR-3C application", "body": "Reactivation form with explanation."},{"title": "DIN restored", "body": "Full directorship rights restored."}]'::jsonb,
'[{"icon": "document", "title": "All companies affected", "body": "If DIN deactivated, you cannot act as director in any company."}]'::jsonb,
'[{"label": "Missed DIR-3 KYC", "detail": "DIN deactivated for missed KYC."}]'::jsonb,
'[{"category": "General", "q": "Why was my DIN deactivated?", "a": "Usually for not filing DIR-3 KYC by September 30."}]'::jsonb,
'[{"name": "MCA21 Portal", "url": "https://www.mca.gov.in", "description": "DIN services"}]'::jsonb,
'[]'::jsonb,
ARRAY['✓ DIN restored quickly', '✓ All KYC cleared'],
ARRAY['director-kyc', 'mca-annual-filing']);

-- 29. Company Name Change
INSERT INTO service_packages (slug, name, short_name, category, tagline, short_description, order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate, sla_working_days, urgency_score, situation_tags, is_active, display_order, service_type, mandatory_for, legal_basis, penalty_for_missing, penalty_color, seo_title, seo_description, canonical_url, workflow_stages, whats_included, service_risks, profile_personas, faqs, review_sources, unlocks, review_keyword_chips, related_slugs) VALUES
('company-name-change', 'Company Name Change', 'Name Change', 'Company Registration', 'New name. Same company. All formalities handled.', 'Change your company name with MCA', 'one_time', 'one_time', 699900, 300000, 18, 20, 70, ARRAY['just_starting_out'], true, 29, 'One-time', 'Companies wanting to change their name', 'Companies Act 2013, Section 13', NULL, 'none', 'Company Name Change | ₹9,999 | Ollvy', 'Change your company name with MCA. New certificate issued.', 'https://ollvy.com/services/company-name-change',
'[{"step": 1, "title": "Name availability check", "timeline": "Day 0-2", "body": "Search MCA and trademark databases.", "visual": "checklist", "milestone": "Name available"},{"step": 2, "title": "Board and shareholder resolution", "timeline": "Day 2-7", "body": "Special resolution passed by shareholders.", "visual": "form", "milestone": "Resolutions passed"},{"step": 3, "title": "RUN filed", "timeline": "Day 7-12", "body": "Reserve Unique Name application.", "visual": "form", "milestone": "Name reserved"},{"step": 4, "title": "INC-24 filed", "timeline": "Day 12-18", "body": "Name change application with MOA amendment.", "visual": "form", "milestone": "INC-24 filed"},{"step": 5, "title": "New certificate issued", "timeline": "Day 18-20", "body": "Certificate of Incorporation with new name.", "visual": "stamp", "isCompletion": true, "milestone": "Name changed"}]'::jsonb,
'[{"title": "Name availability search", "body": "MCA and trademark database search."},{"title": "Special resolution drafting", "body": "Shareholder resolution for name change."},{"title": "MOA amendment", "body": "Memorandum updated with new name."},{"title": "New certificate", "body": "Fresh Certificate of Incorporation issued."}]'::jsonb,
'[{"icon": "document", "title": "Update everywhere", "body": "After name change, update GST, bank, contracts, etc."}]'::jsonb,
'[{"label": "Rebranding", "detail": "New brand, new company name."},{"label": "Pivot in business", "detail": "Business model changed."}]'::jsonb,
'[{"category": "Process", "q": "Does PAN/GST change?", "a": "PAN/TAN remain same. GST core amendment needed."}]'::jsonb,
'[{"name": "MCA21 Portal", "url": "https://www.mca.gov.in", "description": "Company services"}]'::jsonb,
'[]'::jsonb,
ARRAY['✓ Name reserved first', '✓ Certificate in 20 days'],
ARRAY['trademark-registration', 'roc-changes']);

-- 30. Copyright Registration
INSERT INTO service_packages (slug, name, short_name, category, tagline, short_description, order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate, sla_working_days, urgency_score, situation_tags, is_active, display_order, service_type, mandatory_for, legal_basis, penalty_for_missing, penalty_color, seo_title, seo_description, canonical_url, workflow_stages, whats_included, service_risks, profile_personas, faqs, review_sources, unlocks, review_keyword_chips, related_slugs) VALUES
('copyright-registration', 'Copyright Registration', 'Copyright', 'Licensing', 'Protect your creative work. Music, software, content.', 'Register copyright for your creative works', 'one_time', 'one_time', 799900, 50000, 18, 30, 60, ARRAY['have_intellectual_property'], true, 30, 'One-time', 'Creators of original works', 'Copyright Act, 1957', NULL, 'none', 'Copyright Registration | ₹8,499 | Ollvy', 'Copyright registration for creative works.', 'https://ollvy.com/services/copyright-registration',
'[{"step": 1, "title": "Work details collected", "timeline": "Day 0-2", "body": "Nature of work, creation date, author details.", "visual": "checklist", "milestone": "Details received"},{"step": 2, "title": "Application prepared", "timeline": "Day 2-5", "body": "Form XIV with work description.", "visual": "form", "milestone": "Application ready"},{"step": 3, "title": "Filed with Copyright Office", "timeline": "Day 5-10", "body": "Application submitted online.", "visual": "form", "milestone": "Application filed"},{"step": 4, "title": "Registration certificate", "timeline": "Day 10-30", "body": "Certificate issued by Copyright Office.", "visual": "stamp", "isCompletion": true, "milestone": "Copyright registered"}]'::jsonb,
'[{"title": "Form XIV preparation", "body": "Application with work description and author details."},{"title": "Work submission", "body": "Copy of work submitted to Copyright Office."},{"title": "Certificate obtained", "body": "Official registration certificate."}]'::jsonb,
'[{"icon": "document", "title": "Original work required", "body": "Work must be original. Copied works cannot be registered."}]'::jsonb,
'[{"label": "Software developer", "detail": "Protecting code and software."},{"label": "Content creator", "detail": "Videos, music, written content."}]'::jsonb,
'[{"category": "General", "q": "What works can be copyrighted?", "a": "Literary, artistic, musical, dramatic works, software, films."}]'::jsonb,
'[{"name": "Copyright Office", "url": "https://copyright.gov.in", "description": "Copyright registration"}]'::jsonb,
'[]'::jsonb,
ARRAY['✓ Quick filing', '✓ Certificate received'],
ARRAY['trademark-registration']);

-- 31. ESI Registration
INSERT INTO service_packages (slug, name, short_name, category, tagline, short_description, order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate, sla_working_days, urgency_score, situation_tags, is_active, display_order, service_type, mandatory_for, legal_basis, penalty_for_missing, penalty_color, seo_title, seo_description, canonical_url, workflow_stages, whats_included, service_risks, profile_personas, faqs, review_sources, unlocks, review_keyword_chips, related_slugs) VALUES
('esi-registration', 'ESI Registration', 'ESI', 'Payroll', 'Employee health coverage. Mandatory for 10+ employees.', 'Register under ESIC for employee medical benefits', 'one_time', 'one_time', 299900, 0, 18, 7, 75, ARRAY['need_to_hire'], true, 31, 'One-time', 'Establishments with 10+ employees', 'ESI Act, 1948', '12% per annum penalty + damages', 'amber', 'ESI Registration | ₹2,999 | Ollvy', 'ESIC registration for employee medical benefits.', 'https://ollvy.com/services/esi-registration',
'[{"step": 1, "title": "Employee list shared", "timeline": "Day 0-1", "body": "Employee details with Aadhaar.", "visual": "upload", "milestone": "Details received"},{"step": 2, "title": "Application prepared", "timeline": "Day 1-3", "body": "Employer code application on ESIC portal.", "visual": "form", "milestone": "Application ready"},{"step": 3, "title": "Filed on ESIC", "timeline": "Day 3-5", "body": "Application submitted.", "visual": "form", "milestone": "Filed"},{"step": 4, "title": "Employer code issued", "timeline": "Day 5-7", "body": "ESIC employer code received.", "visual": "stamp", "isCompletion": true, "milestone": "ESI registered"}]'::jsonb,
'[{"title": "Employer registration", "body": "ESIC employer code obtained."},{"title": "Employee enrollment", "body": "All eligible employees enrolled."},{"title": "IP numbers assigned", "body": "Insurance Policy numbers for each employee."}]'::jsonb,
'[{"icon": "clock", "title": "Monthly contributions", "body": "ESI contributions due by 15th of following month."}]'::jsonb,
'[{"label": "10 employees", "detail": "Just hit 10 employees. ESI now mandatory."}]'::jsonb,
'[{"category": "General", "q": "Who is eligible for ESI?", "a": "Employees earning up to ₹21,000/month."}]'::jsonb,
'[{"name": "ESIC", "url": "https://www.esic.in", "description": "ESI portal"}]'::jsonb,
'[]'::jsonb,
ARRAY['✓ Quick registration', '✓ Employees enrolled'],
ARRAY['payroll-management', 'pf-registration']);

-- 32. PF Registration
INSERT INTO service_packages (slug, name, short_name, category, tagline, short_description, order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate, sla_working_days, urgency_score, situation_tags, is_active, display_order, service_type, mandatory_for, legal_basis, penalty_for_missing, penalty_color, seo_title, seo_description, canonical_url, workflow_stages, whats_included, service_risks, profile_personas, faqs, review_sources, unlocks, review_keyword_chips, related_slugs) VALUES
('pf-registration', 'PF Registration', 'PF', 'Payroll', 'Provident Fund for employees. Mandatory at 20 employees.', 'Register under EPFO for employee provident fund', 'one_time', 'one_time', 299900, 0, 18, 10, 75, ARRAY['need_to_hire'], true, 32, 'One-time', 'Establishments with 20+ employees', 'EPF Act, 1952', '1% per month interest + damages', 'amber', 'PF Registration | ₹2,999 | Ollvy', 'EPFO registration for provident fund.', 'https://ollvy.com/services/pf-registration',
'[{"step": 1, "title": "Employee details shared", "timeline": "Day 0-2", "body": "Employee list with Aadhaar and bank details.", "visual": "upload", "milestone": "Details received"},{"step": 2, "title": "DSC obtained", "timeline": "Day 2-4", "body": "Authorized signatory DSC for EPFO.", "visual": "form", "milestone": "DSC ready"},{"step": 3, "title": "Application filed", "timeline": "Day 4-7", "body": "EPFO registration application submitted.", "visual": "form", "milestone": "Filed"},{"step": 4, "title": "PF code issued", "timeline": "Day 7-10", "body": "EPFO establishment code received.", "visual": "stamp", "isCompletion": true, "milestone": "PF registered"}]'::jsonb,
'[{"title": "Establishment code", "body": "EPFO employer code obtained."},{"title": "UAN activation", "body": "Universal Account Numbers for all employees."},{"title": "Monthly ECR setup", "body": "Ready for monthly contribution filing."}]'::jsonb,
'[{"icon": "clock", "title": "Monthly due date", "body": "PF contribution due by 15th of following month."}]'::jsonb,
'[{"label": "20 employees", "detail": "Just crossed 20. PF now mandatory."},{"label": "Voluntary registration", "detail": "Want to provide PF even with fewer employees."}]'::jsonb,
'[{"category": "General", "q": "When is PF mandatory?", "a": "When establishment has 20+ employees."}]'::jsonb,
'[{"name": "EPFO", "url": "https://www.epfindia.gov.in", "description": "Provident Fund portal"}]'::jsonb,
'[]'::jsonb,
ARRAY['✓ Quick registration', '✓ UAN activated'],
ARRAY['payroll-management', 'esi-registration']);

-- Set display_order for all services
UPDATE service_packages SET display_order = 1 WHERE slug = 'pvt-ltd-incorporation';
UPDATE service_packages SET display_order = 2 WHERE slug = 'llp-incorporation';
UPDATE service_packages SET display_order = 3 WHERE slug = 'gst-registration';
UPDATE service_packages SET display_order = 4 WHERE slug = 'gst-monthly-50l';
UPDATE service_packages SET display_order = 5 WHERE slug = 'director-kyc';
UPDATE service_packages SET display_order = 6 WHERE slug = 'business-itr';
UPDATE service_packages SET display_order = 7 WHERE slug = 'trademark-registration';
UPDATE service_packages SET display_order = 8 WHERE slug = 'fssai-license';
UPDATE service_packages SET display_order = 9 WHERE slug = 'iec-code';
UPDATE service_packages SET display_order = 10 WHERE slug = 'mca-annual-filing';
UPDATE service_packages SET display_order = 11 WHERE slug = 'tds-monthly-compliance';
UPDATE service_packages SET display_order = 12 WHERE slug = 'payroll-management';
UPDATE service_packages SET display_order = 13 WHERE slug = 'gst-annual-return';
UPDATE service_packages SET display_order = 14 WHERE slug = 'opc-incorporation';
UPDATE service_packages SET display_order = 15 WHERE slug = 'partnership-registration';
UPDATE service_packages SET display_order = 16 WHERE slug = 'msme-registration';
UPDATE service_packages SET display_order = 17 WHERE slug = 'shop-establishment';
UPDATE service_packages SET display_order = 18 WHERE slug = 'professional-tax';
UPDATE service_packages SET display_order = 19 WHERE slug = 'startup-india';
UPDATE service_packages SET display_order = 20 WHERE slug = 'gst-lut';
UPDATE service_packages SET display_order = 21 WHERE slug = 'gst-cancellation';
UPDATE service_packages SET display_order = 22 WHERE slug = 'gst-revocation';
UPDATE service_packages SET display_order = 23 WHERE slug = 'company-closure';
UPDATE service_packages SET display_order = 24 WHERE slug = 'llp-closure';
UPDATE service_packages SET display_order = 25 WHERE slug = 'roc-changes';
UPDATE service_packages SET display_order = 26 WHERE slug = 'accounting-bookkeeping';
UPDATE service_packages SET display_order = 27 WHERE slug = 'statutory-audit';
UPDATE service_packages SET display_order = 28 WHERE slug = 'din-reactivation';
UPDATE service_packages SET display_order = 29 WHERE slug = 'company-name-change';
UPDATE service_packages SET display_order = 30 WHERE slug = 'copyright-registration';
UPDATE service_packages SET display_order = 31 WHERE slug = 'esi-registration';
UPDATE service_packages SET display_order = 32 WHERE slug = 'pf-registration';

-- Ensure all have is_active = true
UPDATE service_packages SET is_active = true;
