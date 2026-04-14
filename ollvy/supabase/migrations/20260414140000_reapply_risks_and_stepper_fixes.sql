BEGIN;
-- Bulletize service_risks body text for all 15 service packages
-- Each risk item: { icon, title, body } with \n line breaks in body



-- 1. gst-registration
UPDATE service_packages
SET service_risks = '[{"icon":"document","title":"Address proof mismatch","body":"Address on all documents must match exactly\nOfficer flags even minor variations (flat number, society name)\nOllvy reviews for consistency before filing"},{"icon":"clock","title":"Aadhaar OTP fails","body":"Aadhaar OTP required. Old or inactive mobile number causes failure\nMust be fixed at an Aadhaar centre, no workaround\nChecked upfront before filing"},{"icon":"alert","title":"Operating without registration","body":"Above ₹40L turnover (₹20L for services) without registration = 100% tax due + ₹10,000 penalty\nRegistration stops the liability from growing"}]'::jsonb,
    updated_at = now()
WHERE slug = 'gst-registration';

-- 2. company-name-change
UPDATE service_packages
SET service_risks = '[{"icon":"alert","title":"Update all downstream registrations","body":"MCA name change does not cascade to other registrations\nYou must separately update: GST, bank, trademark, IEC, FSSAI, contracts"},{"icon":"document","title":"Trademark conflict","body":"Similar trademark registered = MCA rejection or legal notice\nTrademark search before filing reduces this risk"}]'::jsonb,
    updated_at = now()
WHERE slug = 'company-name-change';

-- 3. pvt-ltd-incorporation
UPDATE service_packages
SET service_risks = '[{"icon":"document","title":"Name rejected by MCA","body":"MCA rejects similar names or restricted words (Bank, Insurance, Exchange)\nMCA + trademark databases searched before filing\nAll 3 rejected? Alternatives suggested at no extra cost"},{"icon":"mismatch","title":"Registered address document mismatch","body":"Utility bill address must match application exactly\nRented address requires landlord NOC\nOllvy CS verifies all address documents before filing"},{"icon":"clock","title":"Director slow on DSC video verification","body":"SPICe+ blocked until all directors complete DSC verification\n10-15 minutes per director, daily reminders sent"}]'::jsonb,
    updated_at = now()
WHERE slug = 'pvt-ltd-incorporation';

-- 4. gst-monthly
UPDATE service_packages
SET service_risks = '[{"icon":"clock","title":"Late fee accumulates quickly","body":"₹50/day per return, ₹100/day for both combined\n18% interest on unpaid tax\nAvoidable. Share data by the 8th"},{"icon":"mismatch","title":"GSTR-1 and GSTR-3B figures must match","body":"GSTN auto-flags discrepancies between GSTR-1 and GSTR-3B\nBoth filed from the same data set to ensure consistency"},{"icon":"alert","title":"Vendor not filed = ITC blocked","body":"Vendor hasn''t filed GSTR-1. Their invoices missing from your GSTR-2B\nClaiming that ITC invites a mismatch notice\nChecked before claiming"}]'::jsonb,
    updated_at = now()
WHERE slug = 'gst-monthly';

-- 5. trademark-registration
UPDATE service_packages
SET service_risks = '[{"icon":"document","title":"Similar mark already exists","body":"Similar mark in your class = rejection\nSearch catches most conflicts, but unpublished pending apps are invisible\nIf rejected, appeal or modification assisted"},{"icon":"clock","title":"Government processing takes 12-18 months","body":"7-day timeline = filing only\nExamination, publication, certificate are government-side (12-18 months)\nTracked and updated, but cannot be sped up"},{"icon":"alert","title":"Opposition during publication","body":"Mark published for 4 months. Anyone can oppose\nOpposition = formal legal proceeding (separate service)\nRare. Under 5% of cases"}]'::jsonb,
    updated_at = now()
WHERE slug = 'trademark-registration';

-- 6. tds-monthly-compliance
UPDATE service_packages
SET service_risks = '[{"icon":"clock","title":"Deposit due by 7th - not the 31st","body":"Deposit due by 7th of following month (March: April 30)\nLate = 1.5%/month interest from date of deduction"},{"icon":"document","title":"Wrong TDS rate","body":"Under-deduction = liable for shortfall + interest\nCurrent rates applied per section"},{"icon":"alert","title":"Missing PAN of deductees","body":"No PAN = TDS at 20% (higher rate)\nMissing PANs flagged during data review"}]'::jsonb,
    updated_at = now()
WHERE slug = 'tds-monthly-compliance';

-- 7. business-itr
UPDATE service_packages
SET service_risks = '[{"icon":"clock","title":"Belated filing interest","body":"Filed late with tax outstanding = 1%/month interest (Section 234A)\nAccrues from original deadline"},{"icon":"document","title":"Losses cannot be carried forward if filed late","body":"Filed after Oct 31 with a loss = cannot carry forward\nThat tax benefit is permanently lost"},{"icon":"alert","title":"Audit requirement","body":"Mandatory above ₹1Cr turnover (₹10Cr if cash < 5%)\nAudited financials must be ready before ITR can be filed"}]'::jsonb,
    updated_at = now()
WHERE slug = 'business-itr';

-- 8. llp-incorporation
UPDATE service_packages
SET service_risks = '[{"icon":"document","title":"Name similarity rejection","body":"Name must be distinct from existing LLPs and companies\nBoth registries checked before submission"},{"icon":"alert","title":"LLP Agreement must reflect actual terms","body":"Vague profit-sharing or exit clauses = partner disputes\nExplicit percentages and terms drafted"},{"icon":"clock","title":"All partners must complete DSC verification","body":"FiLLiP blocked until every partner completes video verification\nDaily reminders sent"}]'::jsonb,
    updated_at = now()
WHERE slug = 'llp-incorporation';

-- 9. mca-annual-filing
UPDATE service_packages
SET service_risks = '[{"icon":"document","title":"Audit must be complete first","body":"AOC-4 requires signed, audited financials\nCannot file until audit is complete\nPlan audit timeline accordingly"},{"icon":"clock","title":"AGM not held on time","body":"AGM delayed past Sep 30. Filing deadlines shift\nNew deadlines calculated from actual AGM date"},{"icon":"alert","title":"Penalty accrues daily","body":"₹100/day per form, ₹200/day for both. No ceiling\nFile as soon as documents are ready"}]'::jsonb,
    updated_at = now()
WHERE slug = 'mca-annual-filing';

-- 10. fssai-license
UPDATE service_packages
SET service_risks = '[{"icon":"document","title":"Wrong license type filed","body":"Filing Registration when you need State License = rejection\nWorse: getting Registration then facing penalties for insufficient license\nTurnover verified before filing"},{"icon":"building","title":"Premises inspection failure","body":"Common failures: missing pest control cert, outdated water test, no staff medical fitness\nDocumentation issues, not actual violations\nPre-inspection checklist provided"},{"icon":"alert","title":"Operating without license","body":"₹10,000 penalty + ₹100/day for operating without license\nSerious violations: goods seized and destroyed\nE-commerce platforms require FSSAI number. No number, no listing"}]'::jsonb,
    updated_at = now()
WHERE slug = 'fssai-license';

-- 11. iec-code
UPDATE service_packages
SET service_risks = '[{"icon":"document","title":"Bank account in personal name","body":"IEC requires current account in business name\nProprietor savings account won''t work\nVerified before filing"},{"icon":"mismatch","title":"PAN-Aadhaar name mismatch","body":"PAN and Aadhaar names must match exactly\nMiddle name variations cause OTP failure\nMismatch must be fixed before filing"},{"icon":"alert","title":"Importing without IEC","body":"No IEC = shipment held at customs\nDemurrage accrues daily, penalties up to 3x duty\nGet IEC before your first shipment"}]'::jsonb,
    updated_at = now()
WHERE slug = 'iec-code';

-- 12. director-kyc
UPDATE service_packages
SET service_risks = '[{"icon":"clock","title":"₹5,000/day penalty - starts immediately","body":"Penalty starts Oct 1. ₹91,000 per director by Dec 31\nMultiple directors multiply this\nDIN deactivated, all company filings blocked"},{"icon":"building","title":"All MCA filings blocked","body":"Deactivated DIN blocks: annual returns, director changes, share transfers\nEverything stops until KYC is filed"}]'::jsonb,
    updated_at = now()
WHERE slug = 'director-kyc';

-- 13. gst-cancellation
UPDATE service_packages
SET service_risks = '[{"icon":"alert","title":"ITC reversal is mandatory","body":"ITC on goods in stock at cancellation must be reversed or paid back\nCalculated before filing"},{"icon":"document","title":"Pending returns must be cleared first","body":"All outstanding GSTR-1 and GSTR-3B must be filed first\nCancellation cannot be processed otherwise"}]'::jsonb,
    updated_at = now()
WHERE slug = 'gst-cancellation';

-- 14. gst-revocation
UPDATE service_packages
SET service_risks = '[{"icon":"clock","title":"30-day deadline","body":"Must apply within 30 days of cancellation order\nExtensions possible but require separate application\nAct immediately"},{"icon":"alert","title":"All pending returns must be filed first","body":"REG-21 not processed until all returns filed and taxes paid with interest"}]'::jsonb,
    updated_at = now()
WHERE slug = 'gst-revocation';

-- 15. din-reactivation
UPDATE service_packages
SET service_risks = '[{"icon":"clock","title":"Rs 5,000 per missed year","body":"₹5,000 govt fee per missed year. Mandatory, non-negotiable\nMultiple missed years = multiple fees"},{"icon":"building","title":"All companies blocked until DIN is active","body":"Every company where you are director is blocked from MCA filings\nImpact not limited to one company"}]'::jsonb,
    updated_at = now()
WHERE slug = 'din-reactivation';





-- ============================================================
-- GST Registration
-- ============================================================

-- Stepper: pure timeline, no selling language
UPDATE service_packages
SET workflow_stages = '[
  {
    "step": 1,
    "title": "Answer 5 questions, get your checklist",
    "timeline": "Day 0",
    "body": "Business type, state, turnover, supply type\nCA assigned within 4 hours\nPersonalised checklist generated based on your entity type",
    "visual": "checklist",
    "milestone": "Ollvy CA assigned, personalised checklist sent"
  },
  {
    "step": 2,
    "title": "Upload documents through the app",
    "timeline": "Day 0-1",
    "body": "Upload in the app. Phone photos accepted\nCA reviews every document before filing",
    "visual": "upload",
    "milestone": "Documents verified by Ollvy"
  },
  {
    "step": 3,
    "title": "Application filed, ARN generated",
    "timeline": "Day 1-2",
    "body": "GST REG-01 filed on GSTN portal\nARN generated and shared in app same day\nTrack status yourself: gstn.gov.in > Search Taxpayer > Search by ARN",
    "visual": "form",
    "milestone": "ARN generated, sent to your app"
  },
  {
    "step": 4,
    "title": "Officer query handled if needed",
    "timeline": "Day 3-5 (if applicable)",
    "body": "Officers may request clarifications within 7 days\nOllvy CA responds within 24 hours",
    "visual": "form"
  },
  {
    "step": 5,
    "title": "GSTIN issued",
    "timeline": "Day 5-7",
    "body": "GSTIN issued. Permanent, no renewal, no expiry\nDelivered to your app immediately",
    "visual": "stamp",
    "isCompletion": true,
    "milestone": "GSTIN active on GSTN portal"
  }
]'::jsonb,
    updated_at = now()
WHERE slug = 'gst-registration';

-- What's Included: value props, not timeline
UPDATE service_packages
SET whats_included = '[
  {
    "title": "Ollvy CA fills all 23 GSTN fields",
    "body": "The government form has 23 fields across 5 tabs and times out constantly\nYou answer 5 questions in the app. Ollvy CA handles the rest",
    "comparisonWithout": "23 fields, 5 tabs, 3-4 hours on GSTN portal",
    "comparisonWithOllvy": "5 questions in app, ~4 minutes",
    "mockVisualType": "status",
    "mockVisualData": {
      "label": "GST REG-01 Application",
      "row1": "Business details - complete ✓",
      "row2": "Promoter/Partner info - complete ✓",
      "row3": "Place of business - complete ✓",
      "note": "All 23 fields handled by Ollvy CA"
    }
  },
  {
    "title": "Every document reviewed before filing",
    "body": "Blurry Aadhaar, mismatched address, wrong format. These get caught before filing, not after an officer query",
    "comparisonWithout": "Upload and hope. Query comes 5 days later",
    "comparisonWithOllvy": "Ollvy reviews every document before submission"
  },
  {
    "title": "Officer queries included, no extra charge",
    "body": "Happens in about 20% of cases. Ollvy CA responds within 24 hours\nIncluded in the service, not an extra charge\nCommon queries: Aadhaar verification, address proof, bank details"
  },
  {
    "title": "Compliance calendar auto-populated",
    "body": "GSTIN issued and your first GSTR-1 (11th) and GSTR-3B (20th) due dates appear automatically\nNo manual setup needed",
    "mockVisualType": "calendar",
    "mockVisualData": {
      "row1": "GSTR-1 - Due 11 Apr (outward supplies)",
      "row2": "GSTR-3B - Due 20 Apr (net tax payment)",
      "row3": "GSTR-9 - Due 31 Dec (annual return)",
      "note": "Added to your calendar automatically"
    }
  }
]'::jsonb,
    updated_at = now()
WHERE slug = 'gst-registration';

-- ============================================================
-- Company Name Change
-- ============================================================

-- Stepper: remove em dashes
UPDATE service_packages
SET workflow_stages = '[
  {
    "step": 1,
    "title": "Answer 5 questions, CS checks name availability",
    "timeline": "Day 0",
    "body": "Provide: current name, CIN, 3 preferred new names, reason for change\nCS assigned within 4 hours\nAll 3 names checked against MCA21 registry and trademark database simultaneously\nUnavailable names flagged before any application is filed",
    "visual": "checklist",
    "milestone": "CS assigned, all 3 name options checked against MCA registry"
  },
  {
    "step": 2,
    "title": "Board resolution drafted and signed by all directors",
    "timeline": "Day 1-3",
    "body": "Board resolution drafted for your specific company, CIN, and name. Not a template\nDirectors download from app, sign on letterhead, upload back\nAll directors must sign before RUN application",
    "visual": "form",
    "milestone": "Board resolution signed by all directors and received"
  },
  {
    "step": 3,
    "title": "RUN application filed, name reserved within 2 days",
    "timeline": "Day 3-5",
    "body": "RUN application filed on MCA21\nMCA processes within 1-2 working days\nApproved name reserved for 20 days. INC-24 must be filed in that window\nIf rejected, second preference filed immediately",
    "visual": "form",
    "milestone": "New name approved and reserved by MCA"
  },
  {
    "step": 4,
    "title": "INC-24 filed with special resolution",
    "timeline": "Day 5-15",
    "body": "INC-24 (main name change form) filed with MCA\nSpecial resolution of shareholders drafted, signed, and attached\nMCA processes INC-24 within 7-10 working days",
    "visual": "form",
    "milestone": "INC-24 submitted to MCA Registrar of Companies"
  },
  {
    "step": 5,
    "title": "New Certificate of Incorporation issued",
    "timeline": "Day 15-20",
    "body": "New Certificate of Incorporation issued with updated name\nMOA updated automatically\nUse new CoI to update bank, GST, trademark. Those are separate processes",
    "visual": "stamp",
    "isCompletion": true,
    "milestone": "New CoI issued with updated company name"
  }
]'::jsonb,
    updated_at = now()
WHERE slug = 'company-name-change';

-- What's Included: already differentiated, no changes needed beyond em dash removal
-- (no em dashes found in company-name-change whats_included, skip)

-- ============================================================
-- Pvt Ltd Incorporation
-- ============================================================

-- Stepper: clean timeline, remove selling language
UPDATE service_packages
SET workflow_stages = '[
  {
    "step": 1,
    "title": "Answer 5 questions, get your checklist",
    "timeline": "Day 0",
    "body": "Directors, shareholders, 3 proposed names, office state, authorised capital\nCS assigned within 4 hours",
    "visual": "checklist",
    "milestone": "CS assigned, checklist sent"
  },
  {
    "step": 2,
    "title": "Upload documents through the app",
    "timeline": "Day 0-2",
    "body": "PAN, Aadhaar, passport photos for all directors + office address proof\nCS verifies every document before filing",
    "visual": "upload",
    "milestone": "Documents verified by CS"
  },
  {
    "step": 3,
    "title": "DSC and DIN arranged for all directors",
    "timeline": "Day 2-4",
    "body": "DSC and DIN mandatory for all directors\nDSC tokens arranged, video verification guided in-app",
    "visual": "form",
    "milestone": "DSC and DIN ready"
  },
  {
    "step": 4,
    "title": "Name approved via RUN",
    "timeline": "Day 4-7",
    "body": "RUN application filed with MCA\nApproval in 2-3 working days\nRejected name? Alternatives filed immediately, no extra cost",
    "visual": "form",
    "milestone": "Company name approved"
  },
  {
    "step": 5,
    "title": "SPICe+ filed: MOA, AOA, PAN, TAN in one submission",
    "timeline": "Day 7-12",
    "body": "SPICe+ = single form for incorporation, PAN, TAN, GST pre-enrollment\nMOA and AOA drafted for your specific business activities\nFiled with Registrar of Companies",
    "visual": "form",
    "milestone": "SPICe+ submitted to MCA"
  },
  {
    "step": 6,
    "title": "Certificate of Incorporation issued",
    "timeline": "Day 12-15",
    "body": "CIN issued, PAN and TAN generated automatically\nAll documents stored in your account\nCompliance calendar populated with every annual deadline",
    "visual": "stamp",
    "milestone": "Company incorporated",
    "isCompletion": true
  }
]'::jsonb,
    updated_at = now()
WHERE slug = 'pvt-ltd-incorporation';

-- What's Included: remove em dashes, tighten
UPDATE service_packages
SET whats_included = '[
  {
    "title": "DSC for all directors, video verification guided",
    "body": "DSC is mandatory. We arrange the tokens and guide each director through video verification\n15 minutes per director",
    "comparisonWithout": "Navigate DSC portals yourself - 3+ hours",
    "comparisonWithOllvy": "Guided flow in app - 15 minutes per director"
  },
  {
    "title": "DIN as part of SPICe+, no separate filing",
    "body": "Director Identification Number is included in SPICe+. No separate DIR-3 application, no extra time.",
    "comparisonWithout": "Separate DIR-3 filing - adds 3-5 days",
    "comparisonWithOllvy": "DIN filed simultaneously in SPICe+"
  },
  {
    "title": "MOA and AOA drafted for your business",
    "body": "Drafted based on what your business actually does\nNot a generic template that needs amendment later",
    "comparisonWithout": "Generic template - may need amendment later",
    "comparisonWithOllvy": "Custom drafting based on your business activities"
  },
  {
    "title": "PAN and TAN included",
    "body": "SPICe+ includes both applications. Issued within 24 hours of CIN with no separate process."
  },
  {
    "title": "Compliance calendar auto-populated",
    "body": "Board meeting (30 days), ADT-1 auditor appointment (15 days from AGM)\nDIR-3 KYC (Sep 30 every year), MCA annual filing, Business ITR\nAll populated the day your company is incorporated",
    "mockVisualType": "calendar",
    "mockVisualData": {
      "row1": "First Board Meeting - Within 30 days",
      "row2": "DIR-3 KYC - Due Sep 30 every year",
      "row3": "MCA Annual Filing - Due after AGM",
      "note": "Added to your calendar automatically"
    }
  },
  {
    "title": "All documents stored permanently",
    "body": "CoI, MOA, AOA, PAN, TAN, share certificates, DSC details. All in your Ollvy account\nOllvy CA will ask for these repeatedly over the years"
  }
]'::jsonb,
    updated_at = now()
WHERE slug = 'pvt-ltd-incorporation';

-- ============================================================
-- GST Monthly
-- ============================================================

-- Stepper: clean timeline, remove em dashes
UPDATE service_packages
SET workflow_stages = '[
  {
    "step": 1,
    "title": "Share your GST portal credentials",
    "timeline": "Day 0",
    "body": "Share read-only GST portal access\nOllvy CA reviews filing history and business pattern\nDedicated Ollvy CA assigned for all monthly filings",
    "visual": "checklist",
    "milestone": "Ollvy CA assigned to your account"
  },
  {
    "step": 2,
    "title": "Upload sales invoices and purchase data",
    "timeline": "By 8th of month",
    "body": "Upload sales invoices and purchase register in app\nTally/Zoho exports accepted directly\nOllvy CA reconciles data and prepares GSTR-1",
    "visual": "upload",
    "milestone": "Data received for the month"
  },
  {
    "step": 3,
    "title": "GSTR-1 filed by the 11th",
    "timeline": "9th-11th",
    "body": "GSTR-1 (outward supplies) filed before the 11th\nAcknowledgement shared in app\nDiscrepancies flagged before filing",
    "visual": "form",
    "milestone": "GSTR-1 filed and acknowledged"
  },
  {
    "step": 4,
    "title": "GSTR-3B filed by the 20th",
    "timeline": "18th-20th",
    "body": "GSTR-3B prepared from GSTR-1 and purchase data\nNet tax liability calculated, ITC verified against GSTR-2B\nChallan generated. You pay, done",
    "visual": "form",
    "milestone": "GSTR-3B filed and acknowledged"
  },
  {
    "step": 5,
    "title": "Monthly compliance report delivered",
    "timeline": "21st-25th",
    "body": "Monthly report delivered: filings, dates, acknowledgements\nITC claimed, tax paid, notices received. All documented",
    "visual": "checklist",
    "isCompletion": true,
    "milestone": "Monthly report delivered"
  }
]'::jsonb,
    updated_at = now()
WHERE slug = 'gst-monthly';

-- What's Included: remove em dashes
UPDATE service_packages
SET whats_included = '[
  {
    "title": "GSTR-1: outward supply return",
    "body": "B2B invoices, B2C sales above ₹2.5L, and export invoices captured\nPrepared from your sales data and filed by the 11th",
    "mockVisualType": "status",
    "mockVisualData": {
      "row1": "GSTR-1 · March 2025",
      "row2": "Filed: 10 Mar 2025",
      "row3": "ARN: AA1234567890123"
    }
  },
  {
    "title": "GSTR-3B: net tax payment",
    "body": "Output tax minus eligible ITC = your net GST liability\nChallan generated. You pay through your bank"
  },
  {
    "title": "ITC reconciliation with GSTR-2B",
    "body": "ITC you''re claiming is matched against GSTR-2B (your vendors'' filed data)\nMismatches flagged before you claim ineligible ITC",
    "comparisonWithout": "Claim ITC blindly, get notice later",
    "comparisonWithOllvy": "ITC verified against GSTR-2B before claiming"
  },
  {
    "title": "Monthly compliance report",
    "body": "What was filed, when, acknowledgement numbers, ITC claimed, tax paid. All in one report",
    "mockVisualType": "receipt",
    "mockVisualData": {
      "label": "March 2025 Compliance Report",
      "row1": "GSTR-1: Filed 10 Mar ✓",
      "row2": "GSTR-3B: Filed 18 Mar ✓",
      "row3": "Tax Paid: ₹45,230"
    }
  }
]'::jsonb,
    updated_at = now()
WHERE slug = 'gst-monthly';

-- ============================================================
-- Trademark Registration
-- ============================================================

-- Stepper: clean timeline, remove em dashes
UPDATE service_packages
SET workflow_stages = '[
  {
    "step": 1,
    "title": "Tell us your brand name and business category",
    "timeline": "Day 0",
    "body": "Attorney assigned within 4 hours\nProvide: brand name (word/logo/both), classes, business details\nPreliminary search conducted for conflicts",
    "visual": "checklist",
    "milestone": "Attorney assigned, preliminary search started"
  },
  {
    "step": 2,
    "title": "Trademark search report delivered",
    "timeline": "Day 1-2",
    "body": "Registry searched for identical and similar marks in your classes\nSearch report delivered with potential conflicts\nClear mark: proceed. Conflicts: modifications suggested",
    "visual": "form",
    "milestone": "Search report delivered"
  },
  {
    "step": 3,
    "title": "Application filed with Trademark Registry",
    "timeline": "Day 3-7",
    "body": "Application drafted with correct class(es) and trademark specification\nFiled with Trademark Registry\nApplication number and filing receipt shared",
    "visual": "form",
    "milestone": "Application filed, receipt received"
  },
  {
    "step": 4,
    "title": "Examination and publication (handled)",
    "timeline": "6-12 months (govt processing)",
    "body": "Registry examines application. Objections handled by attorney\nMark published in Trademark Journal for 4 months\nNo opposition: registration granted",
    "visual": "calendar",
    "milestone": "Under examination"
  },
  {
    "step": 5,
    "title": "Registration certificate issued",
    "timeline": "12-18 months total",
    "body": "Registration certificate issued\n10-year protection, renewable indefinitely\nCertificate uploaded to your account",
    "visual": "stamp",
    "isCompletion": true,
    "milestone": "Trademark registered"
  }
]'::jsonb,
    updated_at = now()
WHERE slug = 'trademark-registration';

-- What's Included: remove em dashes
UPDATE service_packages
SET whats_included = '[
  {
    "title": "Trademark search before filing",
    "body": "Registry searched before your government fee is spent\nIf your exact mark is already registered in your class, you know upfront",
    "comparisonWithout": "File without searching, wait months, get rejected",
    "comparisonWithOllvy": "Search first, modify if needed, then file"
  },
  {
    "title": "Class selection guidance",
    "body": "45 classes exist under the Nice Classification\nAttorney recommends only the ones you actually need. No unnecessary filings"
  },
  {
    "title": "Examiner objection response included",
    "body": "Examiner objections are common for descriptive marks. Your attorney handles the response\nIncluded in the service, not a separate charge",
    "comparisonWithout": "Objection raised, you pay extra to respond",
    "comparisonWithOllvy": "Objection response included in service"
  },
  {
    "title": "Renewal reminder",
    "body": "Trademark expires 10 years from filing date. Renewal reminder added to your compliance calendar 6 months before expiry.",
    "mockVisualType": "calendar",
    "mockVisualData": {
      "row1": "Trademark Renewal - Due in 10 years",
      "row2": "Reminder: 6 months before expiry",
      "row3": "Status: Scheduled"
    }
  }
]'::jsonb,
    updated_at = now()
WHERE slug = 'trademark-registration';

-- ============================================================
-- TDS Monthly Compliance
-- ============================================================

-- Stepper: no em dashes found, keep as-is (no update needed)

-- What's Included: remove em dashes
UPDATE service_packages
SET whats_included = '[
  {
    "title": "TDS calculation for all payment types",
    "body": "Salary (192), contractors (194C), professional fees (194J), rent (194I), interest (194A)\nEach has different rates and thresholds. Correct rate applied automatically",
    "comparisonWithout": "Guess the rate - risk under-deduction notice",
    "comparisonWithOllvy": "Correct TDS rate applied for every payment"
  },
  {
    "title": "Monthly challan preparation",
    "body": "Challan needs the right BSR code, assessment year, and tax type\nWrong entries cause mismatched credits for your deductees\nWe prepare the challan. You just pay",
    "mockVisualType": "receipt",
    "mockVisualData": {
      "row1": "Form 26Q - Q4 FY 2024-25",
      "row2": "BSR Code: 0510219 · CIN: 0510219XXXXXX",
      "row3": "Amount: ₹84,500",
      "note": "Challan prepared - pay by 7th"
    }
  },
  {
    "title": "Quarterly return filing",
    "body": "Form 24Q (salary) and Form 26Q (non-salary) filed quarterly\nReconciled against your challan deposits before filing",
    "mockVisualType": "calendar",
    "mockVisualData": {
      "row1": "Q1 (Apr-Jun) return due: July 31",
      "row2": "Q2 (Jul-Sep) return due: Oct 31",
      "row3": "Q3 (Oct-Dec) return due: Jan 31",
      "row4": "Q4 (Jan-Mar) return due: May 31"
    }
  },
  {
    "title": "Form 16/16A generation enabled",
    "body": "Form 16 (salary) and Form 16A (non-salary) downloadable from TRACES after filing\nYour employees and vendors need these for their own ITR"
  }
]'::jsonb,
    updated_at = now()
WHERE slug = 'tds-monthly-compliance';

-- ============================================================
-- Business ITR Filing
-- ============================================================

-- Stepper: remove em dashes
UPDATE service_packages
SET workflow_stages = '[
  {
    "step": 1,
    "title": "Upload your financials: P&L, Balance Sheet, bank statements",
    "timeline": "Day 0-1",
    "body": "Ollvy CA assigned within 4 hours\nPersonalised document checklist based on entity type\nUpload via app: audited accounts, trial balance, bank statements, income docs",
    "visual": "upload",
    "milestone": "Documents received and assigned to Ollvy CA"
  },
  {
    "step": 2,
    "title": "Ollvy CA reviews your books and prepares computation",
    "timeline": "Day 1-4",
    "body": "P&L, Balance Sheet, depreciation, director remuneration reviewed\nIncome computation prepared\nDiscrepancies flagged through app. Ollvy follows up, not the other way around",
    "visual": "form",
    "milestone": "Draft computation shared for your review"
  },
  {
    "step": 3,
    "title": "You review, approve, and Ollvy files",
    "timeline": "Day 4-7",
    "body": "Draft ITR shared in app: income, deductions, tax computation\nYou review and approve\nFiled to Income Tax portal within 24 hours of approval",
    "visual": "checklist",
    "milestone": "ITR submitted to Income Tax portal"
  },
  {
    "step": 4,
    "title": "Acknowledgement delivered",
    "timeline": "Day 7-10",
    "body": "ITR-V acknowledgement generated and shared same day\nCompliance calendar updated with next year''s deadline\nAll documents stored permanently",
    "visual": "stamp",
    "isCompletion": true,
    "milestone": "ITR-V acknowledgement delivered"
  }
]'::jsonb,
    updated_at = now()
WHERE slug = 'business-itr';

-- What's Included: remove em dashes
UPDATE service_packages
SET whats_included = '[
  {
    "title": "Depreciation review, not just data entry",
    "body": "Asset schedule and depreciation calculations reviewed\nIncorrect rates or missed depreciation on eligible assets caught\nThis directly affects your tax liability",
    "comparisonWithout": "You calculate depreciation, CA just enters it",
    "comparisonWithOllvy": "Ollvy reviews asset schedule and corrects rates"
  },
  {
    "title": "Director remuneration treatment",
    "body": "How you split director salary vs dividends affects your tax\nRemuneration structure checked against Companies Act limits\nOverpayment relative to profits flagged"
  },
  {
    "title": "Draft review before filing",
    "body": "Full draft shared before filing: income, deductions, tax computation\nYou review and approve in the app. Nothing goes to the portal without your sign-off",
    "comparisonWithout": "ITR filed, acknowledgement sent, no review",
    "comparisonWithOllvy": "Draft shared, you approve, then we file"
  },
  {
    "title": "Acknowledgement stored permanently",
    "body": "ITR-V uploaded the moment it''s generated\nStored permanently. Accessible for loans, audits, or anything else years later",
    "mockVisualType": "receipt",
    "mockVisualData": {
      "label": "ITR-V Acknowledgement",
      "row1": "ITR-6 · AY 2025-26",
      "row2": "Filed: 15 Oct 2025",
      "row3": "Acknowledgement No: CPC/2025/A12345"
    }
  }
]'::jsonb,
    updated_at = now()
WHERE slug = 'business-itr';

-- ============================================================
-- LLP Incorporation
-- ============================================================

-- Stepper: remove em dashes
UPDATE service_packages
SET workflow_stages = '[
  {
    "step": 1,
    "title": "Answer questions, get your checklist",
    "timeline": "Day 0",
    "body": "Business type, partners, 3 proposed names, state, capital split\nCS assigned within 4 hours",
    "visual": "checklist",
    "milestone": "CS assigned, checklist sent"
  },
  {
    "step": 2,
    "title": "Upload documents through the app",
    "timeline": "Day 0-1",
    "body": "PAN, Aadhaar for all partners + address proof + capital details\nCS verifies every document before filing",
    "visual": "upload",
    "milestone": "Documents verified by CS"
  },
  {
    "step": 3,
    "title": "DPIN and DSC arranged",
    "timeline": "Day 1-3",
    "body": "DPIN required for all partners. Applications filed\nDSC tokens arranged with guided video verification",
    "visual": "form",
    "milestone": "DPIN and DSC ready"
  },
  {
    "step": 4,
    "title": "FiLLiP filed: LLP Agreement, PAN in one submission",
    "timeline": "Day 4-9",
    "body": "FiLLiP = integrated LLP incorporation form\nLLP Agreement drafted based on your actual partner arrangement\nFiled with MCA",
    "visual": "form",
    "milestone": "FiLLiP submitted to MCA"
  },
  {
    "step": 5,
    "title": "LLPIN issued",
    "timeline": "Day 10-12",
    "body": "Certificate of Incorporation issued with LLPIN\nPAN generated automatically\nAll documents uploaded to your account",
    "visual": "stamp",
    "milestone": "Certificate of Incorporation issued",
    "isCompletion": true
  }
]'::jsonb,
    updated_at = now()
WHERE slug = 'llp-incorporation';

-- What's Included: remove em dashes
UPDATE service_packages
SET whats_included = '[
  {
    "title": "LLP Agreement drafted, not templated",
    "body": "Covers profit-sharing, decision-making, capital contribution, and exit terms\nDrafted for your actual arrangement, not a generic 50-50 template",
    "comparisonWithout": "Generic template - disputes arise later",
    "comparisonWithOllvy": "Custom agreement reflecting your actual split and roles"
  },
  {
    "title": "DPIN for all designated partners",
    "body": "Every designated partner needs a DPIN. We file all applications simultaneously."
  },
  {
    "title": "DSC arranged, video verification guided",
    "body": "DSC required for all partners. We arrange tokens and guide video verification in the app."
  },
  {
    "title": "Compliance calendar auto-populated",
    "body": "Once LLPIN is issued, your calendar shows Form 11 (annual return, due May 30) and Form 8 (statement of accounts, due Oct 30).",
    "mockVisualType": "calendar",
    "mockVisualData": {
      "row1": "LLP Form 11 (Annual Return) - Due May 30",
      "row2": "LLP Form 8 (Statement of Accounts) - Due Oct 30",
      "note": "Added to your calendar automatically"
    }
  }
]'::jsonb,
    updated_at = now()
WHERE slug = 'llp-incorporation';

-- ============================================================
-- MCA Annual Filing
-- ============================================================

-- Stepper: no em dashes, already clean. Skip.

-- What's Included: no em dashes found. Skip.

-- ============================================================
-- FSSAI License
-- ============================================================

-- Stepper: remove em dashes and selling language
UPDATE service_packages
SET workflow_stages = '[
  {
    "step": 1,
    "title": "Tell us your food business type and turnover",
    "timeline": "Day 0",
    "body": "Food business type, turnover, location\nLicense type determined: Registration, State, or Central\nCompliance expert assigned within 4 hours",
    "visual": "checklist",
    "milestone": "License type determined"
  },
  {
    "step": 2,
    "title": "Upload documents through the app",
    "timeline": "Day 0-1",
    "body": "Documents: registration proof, food safety plan, layout plan, equipment list, water test\nExact list sent based on your license type",
    "visual": "upload",
    "milestone": "Documents verified"
  },
  {
    "step": 3,
    "title": "Application filed on FSSAI portal",
    "timeline": "Day 2-4",
    "body": "Form A or Form B filed on FSSAI portal\nARN generated and shared immediately",
    "visual": "form",
    "milestone": "Application submitted - ARN generated"
  },
  {
    "step": 4,
    "title": "Inspection coordinated (if required)",
    "timeline": "Day 5-8",
    "body": "State/Central: premises inspection may be required\nInspection date coordinated, preparation checklist provided\nBasic Registration: no inspection needed",
    "visual": "calendar"
  },
  {
    "step": 5,
    "title": "FSSAI license issued",
    "timeline": "Day 8-10",
    "body": "14-digit FSSAI license issued\nPrint on all food packaging. Legally required\nRenewal reminder added to compliance calendar",
    "visual": "stamp",
    "milestone": "FSSAI license active",
    "isCompletion": true
  }
]'::jsonb,
    updated_at = now()
WHERE slug = 'fssai-license';

-- What's Included: remove em dashes
UPDATE service_packages
SET whats_included = '[
  {
    "title": "Correct license type determined upfront",
    "body": "Registration (up to ₹12L), State License (₹12L-₹20Cr), Central License (₹20Cr+ or interstate)\nFiling the wrong type means rejection and refiling\nThe right one is determined before you pay",
    "comparisonWithout": "Guess the license type - risk rejection and delay",
    "comparisonWithOllvy": "License type verified based on turnover and geography"
  },
  {
    "title": "Application filed on FSSAI portal",
    "body": "20+ fields on the FSSAI portal per application type\nYou answer 5 questions in the app. The rest is handled",
    "comparisonWithout": "2+ hours on FSSAI portal, frequent session timeouts",
    "comparisonWithOllvy": "5 questions in app - we file the rest"
  },
  {
    "title": "Inspection preparation checklist",
    "body": "FSSAI may inspect your premises for State and Central licenses\nPre-inspection checklist provided: hygiene, equipment labels, water storage, pest control\nMost failures are missing documentation, not actual violations",
    "mockVisualType": "checklist",
    "mockVisualData": {
      "row1": "✓ Pest control certificate (last 3 months)",
      "row2": "✓ Water test report from approved lab",
      "row3": "✓ Equipment maintenance logs",
      "row4": "✓ Staff medical fitness certificates",
      "note": "Pre-inspection checklist sent before visit"
    }
  },
  {
    "title": "Renewal reminder in your calendar",
    "body": "Valid 1-5 years depending on fee paid\nRenewal reminder added to your compliance calendar\nExpired license = same penalty as no license",
    "mockVisualType": "calendar",
    "mockVisualData": {
      "row1": "FSSAI License Renewal - Due Mar 2026",
      "note": "Added automatically after license issued"
    }
  }
]'::jsonb,
    updated_at = now()
WHERE slug = 'fssai-license';

-- ============================================================
-- IEC Code
-- ============================================================

-- Stepper: remove em dashes
UPDATE service_packages
SET workflow_stages = '[
  {
    "step": 1,
    "title": "Share your business details",
    "timeline": "Day 0",
    "body": "Business type, GST number, bank account details\nCompliance expert assigned within 4 hours\nIEC requires a current account in the business name",
    "visual": "checklist",
    "milestone": "Compliance expert assigned"
  },
  {
    "step": 2,
    "title": "Upload documents through the app",
    "timeline": "Day 0-1",
    "body": "Business PAN, incorporation certificate, cancelled cheque or bank statement\nVerified before filing. Mismatches caught early",
    "visual": "upload",
    "milestone": "Documents verified"
  },
  {
    "step": 3,
    "title": "Application filed on DGFT portal",
    "timeline": "Day 1-2",
    "body": "Application filed on DGFT portal\nAadhaar OTP required for authorized signatory. Guided through the process",
    "visual": "form",
    "milestone": "Application submitted to DGFT"
  },
  {
    "step": 4,
    "title": "IEC issued, you can trade internationally",
    "timeline": "Day 3-5",
    "body": "10-digit IEC issued. Valid for life, no renewal\nCertificate uploaded to your account\nCustoms clearance enabled for imports and exports",
    "visual": "stamp",
    "milestone": "IEC certificate issued",
    "isCompletion": true
  }
]'::jsonb,
    updated_at = now()
WHERE slug = 'iec-code';

-- What's Included: remove em dashes
UPDATE service_packages
SET whats_included = '[
  {
    "title": "Filed on DGFT portal, not an outdated form",
    "body": "Issued exclusively online through DGFT. PAN, Aadhaar, bank details must match exactly\nWe handle the submission, you verify the OTP",
    "comparisonWithout": "Navigate DGFT portal - 2+ hours, frequent errors",
    "comparisonWithOllvy": "We file - you verify OTP - IEC in 5 days"
  },
  {
    "title": "Bank account verification guidance",
    "body": "Cancelled cheque or bank statement needed. Business name, account number, and IFSC must be visible\nMany applications fail because the account is in a personal name, not the business name\nVerified before filing",
    "comparisonWithout": "Rejection due to bank account mismatch",
    "comparisonWithOllvy": "Bank account verified before submission"
  },
  {
    "title": "Lifetime validity, no renewal",
    "body": "Valid for life. No annual renewal unlike GST or FSSAI\nIf business details change (address, bank, directors), the profile needs updating (₹999)"
  },
  {
    "title": "Ready to use at customs",
    "body": "Active immediately on ICEGATE. File bills of entry (imports) and shipping bills (exports)\nNo additional registration required",
    "mockVisualType": "status",
    "mockVisualData": {
      "row1": "IEC: 0123456789",
      "row2": "Status: Active on ICEGATE ✓",
      "row3": "Valid: Lifetime",
      "note": "Ready for import/export clearance"
    }
  }
]'::jsonb,
    updated_at = now()
WHERE slug = 'iec-code';

-- ============================================================
-- Director KYC
-- ============================================================

-- Stepper: remove em dashes
UPDATE service_packages
SET workflow_stages = '[
  {
    "step": 1,
    "title": "Upload PAN and Aadhaar",
    "timeline": "Day 0",
    "body": "Two documents. That''s it\nCS assigned within 4 hours\nDIN status checked on MCA portal\nIf DIN already deactivated, you''re told upfront",
    "visual": "upload",
    "milestone": "Documents received, DIN status checked"
  },
  {
    "step": 2,
    "title": "CS files DIR-3 KYC",
    "timeline": "Day 1",
    "body": "DIR-3 KYC form filled on MCA21\nOTP sent to registered mobile and email. You approve\n~10 minutes of your time",
    "visual": "form",
    "milestone": "DIR-3 KYC submitted to MCA"
  },
  {
    "step": 3,
    "title": "Acknowledgement delivered",
    "timeline": "Day 1-2",
    "body": "MCA processes within 24 hours\nAcknowledgement uploaded to your account\nDeactivated DIN reactivated\nCompliance calendar updated with next Sep 30 deadline",
    "visual": "stamp",
    "isCompletion": true,
    "milestone": "DIN verified and active"
  }
]'::jsonb,
    updated_at = now()
WHERE slug = 'director-kyc';

-- What's Included: remove em dashes
UPDATE service_packages
SET whats_included = '[
  {
    "title": "DIN status check before filing",
    "body": "DIN status checked on MCA21 before filing\nIf it''s already deactivated, you know upfront",
    "mockVisualType": "status",
    "mockVisualData": {
      "row1": "DIN: 08765432",
      "row2": "Status: Active ✓",
      "row3": "Last KYC: 15 Sep 2024"
    }
  },
  {
    "title": "OTP verification handled live",
    "body": "OTP verification on your registered mobile and email\nCS coordinates live. They file, you approve the OTP. About 10 minutes"
  },
  {
    "title": "Next year reminder added automatically",
    "body": "Next year''s Sep 30 deadline auto-added to your compliance calendar\nReminders at 30 days, 7 days, and 1 day before",
    "mockVisualType": "calendar",
    "mockVisualData": {
      "row1": "DIR-3 KYC - Due Sep 30, 2026",
      "row2": "Reminder: Aug 31, 2026",
      "row3": "Status: Scheduled"
    }
  }
]'::jsonb,
    updated_at = now()
WHERE slug = 'director-kyc';

-- ============================================================
-- GST Cancellation, GST Revocation, DIN Reactivation
-- No workflow_stages. What's Included has no em dashes. No changes needed.
-- ============================================================


COMMIT;
