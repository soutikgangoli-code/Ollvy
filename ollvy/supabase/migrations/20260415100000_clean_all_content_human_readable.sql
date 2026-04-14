-- Clean ALL service content: remove jargon, filler, sales pitches in risks,
-- split wall-of-text bullets, simplify language. Every active service touched.

BEGIN;

-- ============================================================
-- BUSINESS-ITR
-- ============================================================

-- Tagline
UPDATE service_packages SET tagline = 'Company tax return. Filed correctly, on time.' WHERE slug = 'business-itr';

-- Short desc: "computation" → "tax calculation"
UPDATE service_packages SET short_description = 'Annual income tax return filing for companies and LLPs. Includes depreciation check, tax calculation, and draft approval before filing.' WHERE slug = 'business-itr';

-- Steps: fix jargon and filler
UPDATE service_packages SET workflow_stages = replace(workflow_stages::text,
  '"Personalised document checklist based on entity type"',
  '"Personalised document checklist for your business type"')::jsonb
WHERE slug = 'business-itr';

UPDATE service_packages SET workflow_stages = replace(workflow_stages::text,
  'Ollvy CA reviews your books and prepares computation',
  'Ollvy CA reviews your books and prepares tax calculation')::jsonb
WHERE slug = 'business-itr';

UPDATE service_packages SET workflow_stages = replace(workflow_stages::text,
  '"Income computation prepared"',
  '"Tax calculation prepared"')::jsonb
WHERE slug = 'business-itr';

UPDATE service_packages SET workflow_stages = replace(workflow_stages::text,
  'Discrepancies flagged through app. Ollvy follows up, not the other way around',
  'Any issues flagged in the app')::jsonb
WHERE slug = 'business-itr';

UPDATE service_packages SET workflow_stages = replace(workflow_stages::text,
  'Draft computation shared for your review',
  'Draft tax calculation shared for your review')::jsonb
WHERE slug = 'business-itr';

-- Included: "asset schedule" → "your assets"
UPDATE service_packages SET whats_included = replace(whats_included::text,
  'Ollvy reviews asset schedule and corrects rates',
  'Ollvy reviews your assets and corrects rates')::jsonb
WHERE slug = 'business-itr';

-- Risks
UPDATE service_packages SET service_risks = replace(service_risks::text,
  'Belated filing interest',
  'Late filing interest')::jsonb
WHERE slug = 'business-itr';

UPDATE service_packages SET service_risks = replace(service_risks::text,
  'Filed late with tax outstanding = 1%/month interest (Section 234A)',
  'Filed late with tax outstanding = 1%/month interest')::jsonb
WHERE slug = 'business-itr';

UPDATE service_packages SET service_risks = replace(service_risks::text,
  'Accrues from original deadline',
  'Starts from the original due date')::jsonb
WHERE slug = 'business-itr';

UPDATE service_packages SET service_risks = replace(service_risks::text,
  'That tax benefit is permanently lost\n', '')::jsonb
WHERE slug = 'business-itr';

-- Also try without \n in case it's the last line
UPDATE service_packages SET service_risks = replace(service_risks::text,
  '\nThat tax benefit is permanently lost', '')::jsonb
WHERE slug = 'business-itr';

UPDATE service_packages SET service_risks = replace(service_risks::text,
  'Mandatory above ₹1Cr turnover (₹10Cr if cash < 5%)',
  'Mandatory above ₹1Cr turnover')::jsonb
WHERE slug = 'business-itr';

-- FAQs
UPDATE service_packages SET faqs = replace(faqs::text,
  'statutory audit always required',
  'audit always required')::jsonb
WHERE slug = 'business-itr';

UPDATE service_packages SET faqs = replace(faqs::text,
  'Do I need a statutory audit?',
  'Do I need an audit?')::jsonb
WHERE slug = 'business-itr';

-- ============================================================
-- BUSINESS-PAN
-- ============================================================

-- SEO (currently identical to short, make it shorter)
UPDATE service_packages SET seo_description = 'Company PAN in 7 working days. ₹999. Filed by Ollvy.'
WHERE slug = 'business-pan';

-- Steps: split wall-of-text bullets into proper \n separated bullets
UPDATE service_packages SET workflow_stages = replace(workflow_stages::text,
  'Answer questions about your entity type, incorporation date, and signatory details. Upload Certificate of Incorporation, address proof, and signatory documents. Ollvy CA reviews within 4 hours.',
  'Entity type, incorporation date, signatory details\nUpload: Certificate of Incorporation, address proof, signatory documents\nOllvy CA reviews within 4 hours')::jsonb
WHERE slug = 'business-pan';

UPDATE service_packages SET workflow_stages = replace(workflow_stages::text,
  'Ollvy CA prepares Form 49A with your entity details, registered office address, and authorised signatory information. All fields completed correctly for your entity type.',
  'Ollvy CA prepares Form 49A with your company and signatory details\nAll fields completed correctly for your business type')::jsonb
WHERE slug = 'business-pan';

UPDATE service_packages SET workflow_stages = replace(workflow_stages::text,
  'Form 49A submitted on NSDL portal with supporting documents. Acknowledgement number generated immediately and shared in your app.',
  'Form 49A submitted on NSDL portal\nAcknowledgement number shared in your app same day')::jsonb
WHERE slug = 'business-pan';

UPDATE service_packages SET workflow_stages = replace(workflow_stages::text,
  'e-PAN delivered to your registered email. Physical card dispatched by NSDL to your registered office address. PAN added to your Ollvy compliance calendar for ITR deadlines.',
  'e-PAN delivered to your email\nPhysical card dispatched to your registered office (10-15 days)\nPAN added to your compliance calendar')::jsonb
WHERE slug = 'business-pan';

-- Risks: remove sales pitch endings
UPDATE service_packages SET service_risks = replace(service_risks::text,
  'The entity name on Form 49A must match the Certificate of Incorporation exactly. Even small differences like Pvt vs Private cause rejection. Ollvy verifies all documents for consistency before submission.',
  'Entity name on Form 49A must match Certificate of Incorporation exactly\nEven small differences like Pvt vs Private cause rejection')::jsonb
WHERE slug = 'business-pan';

UPDATE service_packages SET service_risks = replace(service_risks::text,
  'Address proof must be less than 2 months old. Old utility bills are the most common rejection reason. Ollvy checks document dates before filing.',
  'Address proof must be less than 2 months old\nOld utility bills are the most common rejection reason')::jsonb
WHERE slug = 'business-pan';

UPDATE service_packages SET service_risks = replace(service_risks::text,
  'Companies and LLPs must provide a board resolution authorising the signatory. We provide the template after payment and verify it is properly signed before submission.',
  'Companies and LLPs need a board resolution authorising the signatory\nWe provide the template after payment')::jsonb
WHERE slug = 'business-pan';

-- FAQs: trim Q1, cut Q2 and Q5
UPDATE service_packages SET faqs = (
  SELECT jsonb_agg(elem)
  FROM jsonb_array_elements(faqs) AS elem
  WHERE elem->>'q' NOT IN (
    'Is the company PAN different from the director''s PAN?',
    'Does a proprietorship need a separate business PAN?'
  )
)
WHERE slug = 'business-pan';

-- Shorten FAQ 1 answer
UPDATE service_packages SET faqs = replace(faqs::text,
  'Apply within the first week. You cannot open a bank account without PAN, and you cannot receive or make business payments without a bank account. Most founders apply for PAN and bank account simultaneously, using the PAN acknowledgement letter for the bank while the actual PAN is being processed.',
  'Apply within the first week. You need PAN to open a bank account. Most founders use the acknowledgement letter for the bank while PAN is being processed.')::jsonb
WHERE slug = 'business-pan';

-- ============================================================
-- CLOUD-KITCHEN-SETUP
-- ============================================================

-- Step 1: simplify
UPDATE service_packages SET workflow_stages = replace(workflow_stages::text,
  'Turnover, kitchen area, menu category, GST status. We determine the correct FSSAI licence type and local authority requirements for your location.',
  'Turnover, kitchen area, menu type\nWe confirm the right FSSAI licence type for your kitchen')::jsonb
WHERE slug = 'cloud-kitchen-setup';

-- Collapse steps 3/4/5 into one, renumber 6→4, 7→5
-- This requires rebuilding the array. Using a direct SET.
UPDATE service_packages SET workflow_stages = '[
  {"step":1,"title":"Business details and kitchen address","timeline":"Day 0","body":"Turnover, kitchen area, menu type\nWe confirm the right FSSAI licence type for your kitchen","visual":"checklist","milestone":"Licence types confirmed, expert assigned"},
  {"step":2,"title":"Upload documents through the app","timeline":"Day 0-2","body":"Business registration proof, kitchen layout plan, food safety plan, equipment list, address proof, and owner ID","visual":"upload","milestone":"Documents verified"},
  {"step":3,"title":"All applications filed in parallel","timeline":"Day 2-7","body":"FSSAI, GST (if needed), and local trade licence filed simultaneously\nARN for each shared in your app","visual":"form","milestone":"All applications submitted"},
  {"step":4,"title":"Inspection coordinated (FSSAI State/Central)","timeline":"Day 7-14","body":"State and Central licences need a physical inspection\nPre-inspection checklist provided: pest control, water test, equipment labels","visual":"form","milestone":"Inspection completed"},
  {"step":5,"title":"All licences issued","timeline":"Day 10-21","body":"FSSAI licence number, GSTIN, and trade licence received\nAll uploaded to your account","visual":"stamp","milestone":"Kitchen ready to list on platforms","isCompletion":true}
]'::jsonb
WHERE slug = 'cloud-kitchen-setup';

-- Risks: remove sales pitch endings
UPDATE service_packages SET service_risks = replace(service_risks::text,
  'State and Central licences require physical inspection. Common failure points: no pest control certificate, missing water quality test, equipment without hygiene labels. Our pre-inspection checklist addresses all of these.',
  'State and Central licences require physical inspection\nCommon failure points: no pest control certificate, missing water test, unlabelled equipment')::jsonb
WHERE slug = 'cloud-kitchen-setup';

UPDATE service_packages SET service_risks = replace(service_risks::text,
  'Applying for Basic Registration when you need a State Licence gets rejected. We verify your turnover and operation type before filing.',
  'Applying for Basic Registration when you need a State Licence gets rejected\nLicence type depends on turnover and geography')::jsonb
WHERE slug = 'cloud-kitchen-setup';

UPDATE service_packages SET service_risks = replace(service_risks::text,
  'GST registration requires Aadhaar-based authentication. If your linked mobile is inactive, OTP fails. We verify this before filing.',
  'GST registration needs Aadhaar OTP\nIf your linked mobile is inactive, OTP will fail. Check before filing')::jsonb
WHERE slug = 'cloud-kitchen-setup';

-- ============================================================
-- COMPANY-NAME-CHANGE
-- ============================================================

-- Short desc: remove jargon
UPDATE service_packages SET short_description = 'Company name change with MCA - name search, shareholder approval, government filing, and new certificate.'
WHERE slug = 'company-name-change';

-- Step 1 bullet: remove CIN
UPDATE service_packages SET workflow_stages = replace(workflow_stages::text,
  'Provide: current name, CIN, 3 preferred new names, reason for change',
  'Current company name, 3 preferred new names, reason for change')::jsonb
WHERE slug = 'company-name-change';

-- Step 2 bullet: remove CIN, fix "Not a template"
UPDATE service_packages SET workflow_stages = replace(workflow_stages::text,
  'Board resolution drafted for your specific company, CIN, and name. Not a template',
  'Board resolution drafted for your company and name. Not a generic template')::jsonb
WHERE slug = 'company-name-change';

-- Included 2 body: simplify
UPDATE service_packages SET whats_included = replace(whats_included::text,
  'Shareholder special resolution, board resolution, and EGM notice drafted per Companies Act requirements.',
  'Shareholder approval, board resolution, and meeting notice drafted.')::jsonb
WHERE slug = 'company-name-change';

-- Risk 1 title: "downstream" → simpler
UPDATE service_packages SET service_risks = replace(service_risks::text,
  'Update all downstream registrations',
  'Other registrations need separate updates')::jsonb
WHERE slug = 'company-name-change';

-- FAQ 1: "core amendment" → simpler
UPDATE service_packages SET faqs = replace(faqs::text,
  'GST requires a core amendment (name change update) - separate process but straightforward.',
  'GST needs a name update - separate process but simple.')::jsonb
WHERE slug = 'company-name-change';

-- ============================================================
-- GST-CANCELLATION
-- ============================================================

-- Short desc
UPDATE service_packages SET short_description = 'GST registration cancellation with final return (GSTR-10) and tax credit adjustment handled.'
WHERE slug = 'gst-cancellation';

-- Step 1 title and bullet
UPDATE service_packages SET workflow_stages = replace(workflow_stages::text,
  'ITC and liability review',
  'Tax credit and liability review')::jsonb
WHERE slug = 'gst-cancellation';

UPDATE service_packages SET workflow_stages = replace(workflow_stages::text,
  'Remaining ITC balance and pending tax liabilities reviewed. ITC on closing stock must be reversed.',
  'Remaining tax credits and pending liabilities reviewed\nCredits on remaining stock need to be returned to the government')::jsonb
WHERE slug = 'gst-cancellation';

-- Included 3
UPDATE service_packages SET whats_included = replace(whats_included::text,
  'ITC reversal handled',
  'Tax credit adjustment handled')::jsonb
WHERE slug = 'gst-cancellation';

UPDATE service_packages SET whats_included = replace(whats_included::text,
  'Remaining ITC on closing stock reversed correctly - prevents demand notices after cancellation.',
  'Tax credits on remaining stock returned correctly - avoids notices later.')::jsonb
WHERE slug = 'gst-cancellation';

-- Risk 1
UPDATE service_packages SET service_risks = replace(service_risks::text,
  'ITC reversal is mandatory',
  'Tax credit reversal is mandatory')::jsonb
WHERE slug = 'gst-cancellation';

UPDATE service_packages SET service_risks = replace(service_risks::text,
  'ITC on goods in stock at cancellation must be reversed or paid back',
  'Tax credits on goods in stock must be reversed or paid back')::jsonb
WHERE slug = 'gst-cancellation';

-- FAQ 1
UPDATE service_packages SET faqs = replace(faqs::text,
  'ITC on closing stock must be reversed and paid back to the government.',
  'Tax credits on remaining stock must be returned to the government.')::jsonb
WHERE slug = 'gst-cancellation';

-- ============================================================
-- GST-REGISTRATION
-- ============================================================

-- Step 1 bullet 3: entity type → business type
UPDATE service_packages SET workflow_stages = replace(workflow_stages::text,
  'Personalised checklist generated based on your entity type',
  'Personalised checklist generated for your business type')::jsonb
WHERE slug = 'gst-registration';

-- Step 3 bullet 1: remove form number jargon
UPDATE service_packages SET workflow_stages = replace(workflow_stages::text,
  'GST REG-01 filed on GSTN portal',
  'Application filed on the GST portal')::jsonb
WHERE slug = 'gst-registration';

-- Risk 1 bullet 3: remove sales pitch
UPDATE service_packages SET service_risks = replace(service_risks::text,
  'Officer flags even minor variations (flat number, society name)\nOllvy reviews for consistency before filing',
  'Officer flags even minor variations (flat number, society name)')::jsonb
WHERE slug = 'gst-registration';

-- Risk 2 bullet 3: remove sales pitch
UPDATE service_packages SET service_risks = replace(service_risks::text,
  'Must be fixed at an Aadhaar centre, no workaround\nChecked upfront before filing',
  'Must be fixed at an Aadhaar centre, no workaround')::jsonb
WHERE slug = 'gst-registration';

-- FAQ 1: "aggregate turnover" → "total turnover"
UPDATE service_packages SET faqs = replace(faqs::text,
  'When aggregate turnover crosses',
  'When your total turnover crosses')::jsonb
WHERE slug = 'gst-registration';

-- FAQ 2: simplify
UPDATE service_packages SET faqs = replace(faqs::text,
  'Cannot be cancelled for at least one year from date of registration.',
  'Must stay registered for at least one year.')::jsonb
WHERE slug = 'gst-registration';

-- ============================================================
-- GST-REVOCATION
-- ============================================================

-- Short desc: remove "suo-moto"
UPDATE service_packages SET short_description = 'GST cancelled by the government? We get it restored - pending returns filed, revocation application submitted.'
WHERE slug = 'gst-revocation';

-- Step 1 bullet: remove "suo-moto"
UPDATE service_packages SET workflow_stages = replace(workflow_stages::text,
  'Reason and date of suo-moto cancellation confirmed. Outstanding returns identified.',
  'Reason and date of cancellation confirmed. Outstanding returns identified.')::jsonb
WHERE slug = 'gst-revocation';

-- Included 2 body: "default" → simpler
UPDATE service_packages SET whats_included = replace(whats_included::text,
  'Revocation request with explanation of the default and confirmation that returns are now current.',
  'Revocation application with explanation and proof that all returns are now filed.')::jsonb
WHERE slug = 'gst-revocation';

-- Included 3 body: shorten
UPDATE service_packages SET whats_included = replace(whats_included::text,
  'Exact interest liability on late-deposited tax calculated before filing so you know the total amount upfront.',
  'Interest on late tax calculated upfront - no surprises.')::jsonb
WHERE slug = 'gst-revocation';

-- FAQ 1: "suo-moto"
UPDATE service_packages SET faqs = replace(faqs::text,
  'Suo-moto cancellation is typically triggered after 6 or more consecutive months of non-filing.',
  'Automatic cancellation happens after 6+ months of not filing returns.')::jsonb
WHERE slug = 'gst-revocation';

-- FAQ 3: simplify
UPDATE service_packages SET faqs = replace(faqs::text,
  'If the revocation window is missed, you must file an appeal with the Appellate Authority. This is a more involved process. Acting within 30 days avoids this.',
  'You would need to file an appeal, which takes longer. Better to act within 30 days.')::jsonb
WHERE slug = 'gst-revocation';

-- ============================================================
-- IEPF-CONSULTATION (full rewrite)
-- ============================================================

UPDATE service_packages SET
  tagline = 'Old shares or unclaimed dividends? Find out what is yours and how to get it back.',
  short_description = 'We check if you have unclaimed shares or dividends in IEPF and tell you exactly how to claim them.',
  seo_description = 'Shares in IEPF? Old dividends unclaimed? We find what is there and tell you how to claim it. Rs.500 flat, 2 days.'
WHERE slug = 'iepf-consultation';

-- Steps: simplified
UPDATE service_packages SET workflow_stages = '[
  {"step":1,"title":"Tell us about your case","timeline":"Day 0","body":"Company name, year of investment, folio number if you have it\nNo documents needed upfront - whatever you remember is enough","visual":"checklist","milestone":"Brief received, expert assigned"},
  {"step":2,"title":"We check the IEPF database","timeline":"Day 0-1","body":"We search IEPF and MCA databases using your PAN and company details\nYou get a clear answer: what shares and dividends are there, and whether anything blocks the claim","visual":"form","milestone":"IEPF balance confirmed"},
  {"step":3,"title":"45-minute call on your case","timeline":"Day 1-2","body":"What is claimable, what documents you need, and what the process looks like\nInherited shares? Different process - covered on the call","visual":"checklist","milestone":"Consultation complete"},
  {"step":4,"title":"Written action plan delivered","timeline":"Day 2","body":"Your document checklist - only what your case actually needs\nTimeline for the full claim (typically 60 to 90 days)","visual":"stamp","milestone":"Action plan delivered","isCompletion":true}
]'::jsonb
WHERE slug = 'iepf-consultation';

-- Included: simplified titles and bodies
UPDATE service_packages SET whats_included = '[
  {"title":"IEPF database check","comparisonWithout":"Search multiple government portals yourself - easy to miss records","comparisonWithOllvy":"We confirm what is there within 24 hours"},
  {"title":"45-minute call on your case","body":"Covers your specific claim, documents needed, and next steps"},
  {"title":"Your document checklist","body":"Only the documents your case actually needs"},
  {"title":"Clear timeline and next steps","body":"How long your claim will take and what to expect"}
]'::jsonb
WHERE slug = 'iepf-consultation';

-- Risks: 3 instead of 4, no sales pitches
UPDATE service_packages SET service_risks = '[
  {"icon":"document","title":"Claim rejected for a data mismatch","body":"Form IEPF-5 needs your folio number, PAN, and company details to match government records exactly\nOne mismatch means rejection - you find out 4 to 6 weeks later"},
  {"icon":"alert","title":"PAN not linked to the shares","body":"IEPF matches claims against PAN. If your PAN is not linked to the shares, the claim stalls\nFor inherited shares, your PAN must match the legal heir documents"},
  {"icon":"clock","title":"Inherited shares need extra steps","body":"Physical shares must be transferred into your name before you can file\nFiling without doing this first is the most common reason inherited claims fail"}
]'::jsonb
WHERE slug = 'iepf-consultation';

-- FAQs: 6 instead of 11, all shortened
UPDATE service_packages SET faqs = '[
  {"category":"General","q":"What is IEPF and how did my shares end up there?","a":"If dividends go unclaimed for 7 years, the company transfers them - and the shares - to a government fund called IEPF. This happens automatically. You can claim them back."},
  {"category":"General","q":"Can I get the shares and dividends back?","a":"Yes. One application covers both shares and dividends. Shares go to your demat account, dividends to your bank. There is no deadline to file."},
  {"category":"Process","q":"What does the Rs.500 consultation cover?","a":"We check what is in IEPF under your name, then do a 45-minute call covering your case. You get a written action plan and document checklist. Filing the actual claim is a separate service."},
  {"category":"Process","q":"How long does the full claim take?","a":"60 to 90 days from filing, if the company responds on time. Inherited and physical certificate claims can take longer."},
  {"category":"Documents","q":"What documents are needed?","a":"Depends on your case. Basic: PAN, Aadhaar, cancelled cheque. Physical shares: add the certificate, affidavit, and indemnity bond. Inherited: add death certificate and legal heirship certificate. The consultation gives you your exact list."},
  {"category":"Pricing","q":"Is there a government fee?","a":"No. Filing the claim is free. Some cases need a succession certificate or indemnity bond, which have small court or stamp fees."}
]'::jsonb
WHERE slug = 'iepf-consultation';

-- ============================================================
-- LLP-INCORPORATION
-- ============================================================

-- Step 3 bullet 1: explain DPIN
UPDATE service_packages SET workflow_stages = replace(workflow_stages::text,
  'DPIN required for all partners. Applications filed',
  'Partner ID numbers (DPIN) applied for all partners')::jsonb
WHERE slug = 'llp-incorporation';

-- Step 4 bullet 1: simplify FiLLiP
UPDATE service_packages SET workflow_stages = replace(workflow_stages::text,
  'FiLLiP = integrated LLP incorporation form',
  'LLP incorporation form filed with MCA')::jsonb
WHERE slug = 'llp-incorporation';

-- FAQ 2: remove legal citation
UPDATE service_packages SET faqs = replace(faqs::text,
  'Yes, under Section 366 of the Companies Act, 2013. It involves multiple MCA filings, stamp duty, and a valuation exercise - typically 3-6 months. If funding is even a possibility in the next 3 years, start as Pvt Ltd.',
  'Yes, but it takes 3-6 months and involves extra filings and stamp duty. If funding is possible in the next 3 years, start as Pvt Ltd.')::jsonb
WHERE slug = 'llp-incorporation';

-- FAQ 6: simplify wall of numbers
UPDATE service_packages SET faqs = replace(faqs::text,
  'Form 11 (Annual Return) by May 30 every year. Form 8 (Statement of Accounts and Solvency) by October 30 every year. ITR-5 by July 31 if no tax audit is required, or October 31 if tax audit applies (turnover above Rs 1 crore). No mandatory statutory audit below Rs 40 lakh turnover and Rs 25 lakh contribution.',
  'Two annual filings: Form 11 by May 30 and Form 8 by October 30. Plus ITR by July 31 (or Oct 31 if audit applies). All added to your calendar.')::jsonb
WHERE slug = 'llp-incorporation';

-- ============================================================
-- MCA-ANNUAL-FILING
-- ============================================================

-- Short desc: "ROC compliance" → simpler
UPDATE service_packages SET short_description = 'Annual company filings with MCA - AOC-4 (financial statements) and MGT-7 (annual return) filed together.'
WHERE slug = 'mca-annual-filing';

-- Step 1 bullet 1: CIN → company number
UPDATE service_packages SET workflow_stages = replace(workflow_stages::text,
  'Provide: CIN, financial year, AGM date, audited financials status',
  'Company number, financial year, AGM date, and whether audit is done')::jsonb
WHERE slug = 'mca-annual-filing';

-- ============================================================
-- PVT-LTD-INCORPORATION
-- ============================================================

-- Step 1 bullet 1: "authorised capital" → "starting capital"
UPDATE service_packages SET workflow_stages = replace(workflow_stages::text,
  'Directors, shareholders, 3 proposed names, office state, authorised capital',
  'Directors, shareholders, 3 proposed names, office state, starting capital')::jsonb
WHERE slug = 'pvt-ltd-incorporation';

-- Step 5 bullet 1: simplify SPICe+
UPDATE service_packages SET workflow_stages = replace(workflow_stages::text,
  'SPICe+ = single form for incorporation, PAN, TAN, GST pre-enrollment',
  'All-in-one incorporation form covering PAN, TAN, and GST')::jsonb
WHERE slug = 'pvt-ltd-incorporation';

-- Risk 2 bullet 3: remove sales pitch
UPDATE service_packages SET service_risks = replace(service_risks::text,
  'Rented address requires landlord NOC\nOllvy CS verifies all address documents before filing',
  'Rented address requires landlord NOC')::jsonb
WHERE slug = 'pvt-ltd-incorporation';

-- FAQ 2: simplify "authorised capital" and "stamp duty"
UPDATE service_packages SET faqs = replace(faqs::text,
  'No legal minimum. Authorised capital can be Rs 1 lakh (the standard starting point). Stamp duty on incorporation is based on authorised capital and varies by state.',
  'No minimum. You can start with Rs 1 lakh. Government fees depend on capital amount and vary by state.')::jsonb
WHERE slug = 'pvt-ltd-incorporation';

-- FAQ 7: simplify jargon wall
UPDATE service_packages SET faqs = replace(faqs::text,
  'INC-20A (commencement of business) within 180 days - requires share capital deposited in a company bank account, so open a current account immediately. Annual: AOC-4 (30 days after AGM), MGT-7 (60 days after AGM), Director KYC by Sep 30, Business ITR by Oct 31.',
  'Open a bank account and deposit share capital within 180 days. After that: annual MCA filings, Director KYC by Sep 30, and Business ITR by Oct 31. All added to your calendar.')::jsonb
WHERE slug = 'pvt-ltd-incorporation';

-- ============================================================
-- TDS-MONTHLY-COMPLIANCE
-- ============================================================

-- Step 2 bullet 1: remove form number jargon
UPDATE service_packages SET workflow_stages = replace(workflow_stages::text,
  'TDS calculated per category: salary (24Q), non-salary (26Q), TCS (27Q)',
  'TDS calculated for each payment type: salary, vendors, rent, professional fees')::jsonb
WHERE slug = 'tds-monthly-compliance';

-- Risk 2 bullet 1: simplify
UPDATE service_packages SET service_risks = replace(service_risks::text,
  'Under-deduction = liable for shortfall + interest',
  'If you deduct too little, you pay the difference plus interest')::jsonb
WHERE slug = 'tds-monthly-compliance';

-- FAQ 2: remove section reference
UPDATE service_packages SET faqs = replace(faqs::text,
  'The expense is disallowed under Section 40(a)(ia) - you pay tax on it as if it were profit.',
  'The expense gets disallowed - you pay tax on it as if it were profit.')::jsonb
WHERE slug = 'tds-monthly-compliance';

COMMIT;
