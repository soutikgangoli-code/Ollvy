BEGIN;

-- gst-registration
UPDATE service_packages
SET workflow_stages = '[
  {
    "step": 1,
    "title": "Answer 5 questions - we build your personalised checklist",
    "timeline": "Day 0",
    "body": "Business type, state, turnover, supply type, voluntary registration\nCA assigned within 4 hours\nPersonalised checklist generated — not the standard 20-item govt list\nSole proprietor with domestic sales? 4 documents, not 20",
    "visual": "checklist",
    "milestone": "CA assigned, personalised checklist sent"
  },
  {
    "step": 2,
    "title": "Upload documents through the app",
    "timeline": "Day 0-1",
    "body": "Upload directly in the app — phone photos accepted\nCA reviews every document before filing\nBlurry Aadhaar, mismatched address, wrong format — caught here, not after officer query",
    "visual": "upload",
    "milestone": "Documents verified by CA"
  },
  {
    "step": 3,
    "title": "Application filed - ARN in 24 hours",
    "timeline": "Day 1-2",
    "body": "GST REG-01 filed on GSTN portal\nARN generated immediately, shared in app same day\nVerify status yourself: gstn.gov.in → Search Taxpayer → Search by ARN",
    "visual": "form",
    "milestone": "ARN generated - sent to your app"
  },
  {
    "step": 4,
    "title": "If an officer query arrives, your CA handles it",
    "timeline": "Day 3-5 (if applicable)",
    "body": "Officers may request clarifications within 7 days\nCA responds within 24 hours — included, no extra charge\nCommon queries: Aadhaar verification, address proof mismatch — both resolvable",
    "visual": "form"
  },
  {
    "step": 5,
    "title": "GSTIN issued",
    "timeline": "Day 5-7",
    "body": "GSTIN issued — permanent, no renewal, no expiry\nDelivered to app immediately\nCompliance calendar auto-updated: GSTR-1 (11th) and GSTR-3B (20th) due dates added",
    "visual": "stamp",
    "isCompletion": true,
    "milestone": "GSTIN active on GSTN portal"
  }
]'::jsonb,
    updated_at = now()
WHERE slug = 'gst-registration';

-- company-name-change
UPDATE service_packages
SET workflow_stages = '[
  {
    "step": 1,
    "title": "Answer 5 questions - CS checks name availability immediately",
    "timeline": "Day 0",
    "body": "Provide: current name, CIN, 3 preferred new names, reason for change\nCS assigned within 4 hours\nAll 3 names checked against MCA21 registry and trademark database simultaneously\nUnavailable names flagged before any application is filed",
    "visual": "checklist",
    "milestone": "CS assigned, all 3 name options checked against MCA registry"
  },
  {
    "step": 2,
    "title": "Board resolution drafted and signed by all directors",
    "timeline": "Day 1-3",
    "body": "Board resolution drafted for your specific company, CIN, and name — not a template\nDirectors download from app, sign on letterhead, upload back\nAll directors must sign before RUN application",
    "visual": "form",
    "milestone": "Board resolution signed by all directors and received"
  },
  {
    "step": 3,
    "title": "RUN application filed - name reserved within 2 days",
    "timeline": "Day 3-5",
    "body": "RUN application filed on MCA21\nMCA processes within 1–2 working days\nApproved name reserved for 20 days — INC-24 must be filed in that window\nIf rejected, second preference filed immediately",
    "visual": "form",
    "milestone": "New name approved and reserved by MCA"
  },
  {
    "step": 4,
    "title": "INC-24 filed with special resolution",
    "timeline": "Day 5-15",
    "body": "INC-24 (main name change form) filed with MCA\nSpecial resolution of shareholders drafted, signed, and attached\nMCA processes INC-24 within 7–10 working days",
    "visual": "form",
    "milestone": "INC-24 submitted to MCA Registrar of Companies"
  },
  {
    "step": 5,
    "title": "New Certificate of Incorporation issued",
    "timeline": "Day 15-20",
    "body": "New Certificate of Incorporation issued with updated name\nMOA updated automatically\nUse new CoI to update bank, GST, trademark — those are separate processes",
    "visual": "stamp",
    "isCompletion": true,
    "milestone": "New CoI issued with updated company name"
  }
]'::jsonb,
    updated_at = now()
WHERE slug = 'company-name-change';

-- pvt-ltd-incorporation
UPDATE service_packages
SET workflow_stages = '[
  {
    "step": 1,
    "title": "Answer 5 questions - we build your checklist",
    "timeline": "Day 0",
    "body": "Directors, shareholders, 3 proposed names, office state, authorised capital\nCS assigned within 4 hours",
    "visual": "checklist",
    "milestone": "CS assigned, checklist sent"
  },
  {
    "step": 2,
    "title": "Upload documents through the app",
    "timeline": "Day 0-2",
    "body": "PAN, Aadhaar, passport photos for all directors + office address proof\nCS verifies every document before filing\nMismatches caught here, not after MCA query",
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
    "body": "RUN application filed with MCA\nApproval in 2–3 working days\nRejected name? Alternatives filed immediately, no extra cost",
    "visual": "form",
    "milestone": "Company name approved"
  },
  {
    "step": 5,
    "title": "SPICe+ filed - MOA, AOA, PAN, TAN in one submission",
    "timeline": "Day 7-12",
    "body": "SPICe+ = single form for incorporation, PAN, TAN, GST pre-enrollment\nMOA and AOA drafted for your specific business activities\nFiled with Registrar of Companies",
    "visual": "form",
    "milestone": "SPICe+ submitted to MCA"
  },
  {
    "step": 6,
    "title": "Certificate of Incorporation issued",
    "timeline": "Day 12-15",
    "body": "CIN issued, PAN and TAN generated automatically\nAll documents stored permanently in your account\nCompliance calendar populated with every annual deadline",
    "visual": "stamp",
    "milestone": "Company incorporated",
    "isCompletion": true
  }
]'::jsonb,
    updated_at = now()
WHERE slug = 'pvt-ltd-incorporation';

-- gst-monthly
UPDATE service_packages
SET workflow_stages = '[
  {
    "step": 1,
    "title": "Share your GST portal credentials",
    "timeline": "Day 0",
    "body": "Share read-only GST portal access\nCA reviews filing history and business pattern\nDedicated CA assigned for all monthly filings",
    "visual": "checklist",
    "milestone": "CA assigned to your account"
  },
  {
    "step": 2,
    "title": "Upload sales invoices and purchase data",
    "timeline": "By 8th of month",
    "body": "Upload sales invoices and purchase register in app\nTally/Zoho exports accepted directly\nCA reconciles data and prepares GSTR-1",
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
    "body": "GSTR-3B prepared from GSTR-1 and purchase data\nNet tax liability calculated, ITC verified against GSTR-2B\nChallan generated — you pay, done",
    "visual": "form",
    "milestone": "GSTR-3B filed and acknowledged"
  },
  {
    "step": 5,
    "title": "Monthly compliance report delivered",
    "timeline": "21st-25th",
    "body": "Monthly report delivered: filings, dates, acknowledgements\nITC claimed, tax paid, notices received — all documented",
    "visual": "checklist",
    "isCompletion": true,
    "milestone": "Monthly report delivered"
  }
]'::jsonb,
    updated_at = now()
WHERE slug = 'gst-monthly';

-- trademark-registration
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
    "body": "Registry searched for identical and similar marks in your classes\nSearch report delivered with potential conflicts\nClear mark → proceed. Conflicts → modifications suggested",
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
    "body": "Registry examines application — objections handled by attorney\nMark published in Trademark Journal for 4 months\nNo opposition → registration granted",
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

-- tds-monthly-compliance
UPDATE service_packages
SET workflow_stages = '[
  {
    "step": 1,
    "title": "Share your payment register for the month",
    "timeline": "Day 1-5 of month",
    "body": "Upload: salary, vendor, rent, and professional fee payments\nCA determines applicable TDS rates per payment\nExemptions and lower deduction certificates applied",
    "visual": "upload",
    "milestone": "Payment data received"
  },
  {
    "step": 2,
    "title": "TDS calculated and challans prepared",
    "timeline": "Day 5-6",
    "body": "TDS calculated per category: salary (24Q), non-salary (26Q), TCS (27Q)\nChallans prepared with correct assessment year and codes\nYou approve amounts before payment",
    "visual": "form",
    "milestone": "Challans ready for payment"
  },
  {
    "step": 3,
    "title": "Challans paid - deposit confirmed",
    "timeline": "Day 6-7",
    "body": "Pay challans via net banking\nReceipt with CIN uploaded to your account\nDeposit deadline: 7th of following month",
    "visual": "stamp",
    "milestone": "TDS deposited on time"
  },
  {
    "step": 4,
    "title": "Quarterly return filed (at quarter end)",
    "timeline": "Quarter end",
    "body": "Quarterly returns filed: Form 24Q (salary), Form 26Q (non-salary)\nAll monthly deposits consolidated\nAcknowledgement shared, Form 16/16A generation enabled",
    "visual": "form",
    "milestone": "TDS return filed",
    "isCompletion": true
  }
]'::jsonb,
    updated_at = now()
WHERE slug = 'tds-monthly-compliance';

-- business-itr
UPDATE service_packages
SET workflow_stages = '[
  {
    "step": 1,
    "title": "Upload your financials - P&L, Balance Sheet, bank statements",
    "timeline": "Day 0-1",
    "body": "CA assigned within 4 hours\nPersonalised document checklist based on entity type\nUpload via app: audited accounts, trial balance, bank statements, income docs",
    "visual": "upload",
    "milestone": "Documents received and assigned to CA"
  },
  {
    "step": 2,
    "title": "CA reviews your books and prepares computation",
    "timeline": "Day 1-4",
    "body": "P&L, Balance Sheet, depreciation, director remuneration reviewed\nIncome computation prepared\nDiscrepancies flagged through app — CA chases you, not the other way",
    "visual": "form",
    "milestone": "Draft computation shared for your review"
  },
  {
    "step": 3,
    "title": "You review, approve, and CA files",
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

-- llp-incorporation
UPDATE service_packages
SET workflow_stages = '[
  {
    "step": 1,
    "title": "Answer questions - we build your checklist",
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
    "body": "DPIN required for all partners — applications filed\nDSC tokens arranged with guided video verification",
    "visual": "form",
    "milestone": "DPIN and DSC ready"
  },
  {
    "step": 4,
    "title": "FiLLiP filed - LLP Agreement, PAN in one submission",
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

-- mca-annual-filing
UPDATE service_packages
SET workflow_stages = '[
  {
    "step": 1,
    "title": "Share your company details",
    "timeline": "Day 0",
    "body": "Provide: CIN, financial year, AGM date, audited financials status\nCS assigned within 4 hours\nFiling deadlines calculated from your AGM date",
    "visual": "checklist",
    "milestone": "Company secretary assigned"
  },
  {
    "step": 2,
    "title": "Upload financial statements and documents",
    "timeline": "Day 0-2",
    "body": "For AOC-4: audited balance sheet, P&L, notes, director report, auditor report\nFor MGT-7: shareholder list, director changes, share transfers",
    "visual": "upload",
    "milestone": "Documents reviewed by CS"
  },
  {
    "step": 3,
    "title": "Forms drafted and reviewed",
    "timeline": "Day 2-4",
    "body": "AOC-4 and MGT-7 drafted from your documents\nBoth reviewed for accuracy\nYou approve drafts in the app before filing",
    "visual": "form",
    "milestone": "Draft forms sent for approval"
  },
  {
    "step": 4,
    "title": "Filed on MCA21 - SRN generated",
    "timeline": "Day 5-7",
    "body": "Both forms filed on MCA21\nSRN generated and shared immediately for each form\nROC processes within 24–48 hours",
    "visual": "stamp",
    "milestone": "AOC-4 and MGT-7 filed",
    "isCompletion": true
  }
]'::jsonb,
    updated_at = now()
WHERE slug = 'mca-annual-filing';

-- fssai-license
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
    "body": "Documents: registration proof, food safety plan, layout plan, equipment list, water test\nExact list sent based on your license type — not the generic one",
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
    "body": "14-digit FSSAI license issued\nPrint on all food packaging — legally required\nRenewal reminder added to compliance calendar",
    "visual": "stamp",
    "milestone": "FSSAI license active",
    "isCompletion": true
  }
]'::jsonb,
    updated_at = now()
WHERE slug = 'fssai-license';

-- iec-code
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
    "body": "Business PAN, incorporation certificate, cancelled cheque or bank statement\nVerified before filing — mismatches caught early",
    "visual": "upload",
    "milestone": "Documents verified"
  },
  {
    "step": 3,
    "title": "Application filed on DGFT portal",
    "timeline": "Day 1-2",
    "body": "Application filed on DGFT portal\nAadhaar OTP required for authorized signatory — guided through",
    "visual": "form",
    "milestone": "Application submitted to DGFT"
  },
  {
    "step": 4,
    "title": "IEC issued - you can trade internationally",
    "timeline": "Day 3-5",
    "body": "10-digit IEC issued — valid for life, no renewal\nCertificate uploaded to your account\nCustoms clearance enabled for imports and exports",
    "visual": "stamp",
    "milestone": "IEC certificate issued",
    "isCompletion": true
  }
]'::jsonb,
    updated_at = now()
WHERE slug = 'iec-code';

-- director-kyc
UPDATE service_packages
SET workflow_stages = '[
  {
    "step": 1,
    "title": "Upload PAN and Aadhaar",
    "timeline": "Day 0",
    "body": "Two documents — that''s it\nCS assigned within 4 hours\nDIN status checked on MCA portal\nIf DIN already deactivated, you''re told upfront",
    "visual": "upload",
    "milestone": "Documents received, DIN status checked"
  },
  {
    "step": 2,
    "title": "CS files DIR-3 KYC",
    "timeline": "Day 1",
    "body": "DIR-3 KYC form filled on MCA21\nOTP sent to registered mobile and email — you approve\n~10 minutes of your time",
    "visual": "form",
    "milestone": "DIR-3 KYC submitted to MCA"
  },
  {
    "step": 3,
    "title": "Acknowledgement delivered",
    "timeline": "Day 1-2",
    "body": "MCA processes within 24 hours\nAcknowledgement uploaded to your account\nDeactivated DIN → reactivated\nCompliance calendar updated with next Sep 30 deadline",
    "visual": "stamp",
    "isCompletion": true,
    "milestone": "DIN verified and active"
  }
]'::jsonb,
    updated_at = now()
WHERE slug = 'director-kyc';

COMMIT;
