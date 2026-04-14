BEGIN;

-- ============================================================
-- GST Registration
-- ============================================================

UPDATE service_packages
SET whats_included = '[
  {
    "title": "CA handles the GSTN portal - all 23 fields",
    "body": "The government form has 23 fields across 5 tabs and times out constantly\nYour CA fills the whole thing — you answer 5 questions in the app",
    "comparisonWithout": "23 fields · 5 tabs · 3-4 hours on GSTN portal",
    "comparisonWithOllvy": "5 questions in app · ~4 minutes",
    "mockVisualType": "status",
    "mockVisualData": {
      "label": "GST REG-01 Application",
      "row1": "Business details - complete ✓",
      "row2": "Promoter/Partner info - complete ✓",
      "row3": "Place of business - complete ✓",
      "note": "All 23 fields handled by your CA"
    }
  },
  {
    "title": "ARN shared same day - you can track it yourself",
    "body": "ARN generated the moment it''s submitted, shared in app immediately\nYou can verify status yourself at gstn.gov.in → Search Taxpayer → Search by ARN",
    "mockVisualType": "arn",
    "mockVisualData": {
      "arn": "AA270325014782R",
      "status": "Application Processing",
      "date": "25 Mar 2025"
    }
  },
  {
    "title": "Officer queries handled - no extra charge",
    "body": "Happens in about 20% of cases — your CA responds within 24 hours\nIncluded in the service, not an extra charge\nCommon queries: Aadhaar verification, address proof, bank details"
  },
  {
    "title": "Compliance calendar updated automatically",
    "body": "GSTIN issued → your first GSTR-1 (11th) and GSTR-3B (20th) due dates appear automatically\nNo manual setup needed",
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

UPDATE service_packages
SET faqs = '[
  {
    "category": "General",
    "q": "When is GST registration mandatory?",
    "a": "When aggregate turnover crosses Rs 40 lakh (Rs 20 lakh for service providers, Rs 10 lakh for special category states). Also mandatory for any inter-state supply regardless of turnover, and for all e-commerce sellers from day one."
  },
  {
    "category": "General",
    "q": "Can I register voluntarily if I am below the threshold?",
    "a": "Yes. Voluntary registration lets you issue GST invoices and claim ITC on purchases. Cannot be cancelled for at least one year from date of registration."
  },
  {
    "category": "Process",
    "q": "What is an ARN and why does it matter?",
    "a": "Application Reference Number - generated the moment your application is submitted. You can track status on the government portal yourself without waiting for updates from us."
  },
  {
    "category": "Process",
    "q": "What if the officer raises a query?",
    "a": "Your CA responds within 24 hours. Included in the service. Most queries are resolved in one reply."
  },
  {
    "category": "Documents",
    "q": "What documents do I need?",
    "a": "Depends on your business type. Sole proprietor: PAN, Aadhaar, address proof, bank statement. Pvt Ltd: same, plus Certificate of Incorporation, board resolution, and director PANs. We send a personalised checklist."
  },
  {
    "category": "After Completion",
    "q": "What are my obligations after getting GSTIN?",
    "a": "GSTR-1 by 11th of every month (outward supplies), GSTR-3B by 20th (net tax payment). Nil returns required even if there are no transactions. GSTR-9 annual return by December 31. All deadlines added to your compliance calendar automatically."
  }
]'::jsonb,
    updated_at = now()
WHERE slug = 'gst-registration';

-- ============================================================
-- Company Name Change
-- ============================================================

UPDATE service_packages
SET whats_included = '[
  {
    "title": "Name availability search",
    "body": "MCA company registry and trademark database both checked before filing to avoid rejection."
  },
  {
    "title": "Special resolution drafting",
    "body": "Shareholder special resolution, board resolution, and EGM notice drafted per Companies Act requirements."
  },
  {
    "title": "MOA amendment",
    "body": "Memorandum of Association updated to reflect the new name."
  },
  {
    "title": "New Certificate of Incorporation",
    "body": "Fresh certificate issued by MCA with the new name. Your CIN, PAN, and TAN remain unchanged."
  }
]'::jsonb,
    updated_at = now()
WHERE slug = 'company-name-change';

UPDATE service_packages
SET faqs = '[
  {
    "category": "Process",
    "q": "Does my PAN or GST change when I change my company name?",
    "a": "PAN and TAN remain the same. GST requires a core amendment (name change update) - separate process but straightforward."
  },
  {
    "category": "Process",
    "q": "Can I change the name to anything?",
    "a": "Subject to MCA availability and not containing restricted words. Name must be distinct from existing companies and trademarks."
  },
  {
    "category": "Process",
    "q": "How long does the process take?",
    "a": "20 working days from start to new Certificate of Incorporation."
  },
  {
    "category": "Process",
    "q": "Do I need a special resolution?",
    "a": "Yes. A name change requires a special resolution (75% majority of shareholders voting in favour)."
  }
]'::jsonb,
    updated_at = now()
WHERE slug = 'company-name-change';

-- ============================================================
-- Pvt Ltd Incorporation
-- ============================================================

UPDATE service_packages
SET whats_included = '[
  {
    "title": "DSC for all directors - video verification guided",
    "body": "DSC is mandatory — we arrange the tokens and guide each director through video verification\n15 minutes per director",
    "comparisonWithout": "Navigate DSC portals yourself - 3+ hours",
    "comparisonWithOllvy": "Guided flow in app - 15 minutes per director"
  },
  {
    "title": "DIN as part of SPICe+ - no separate filing",
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
    "body": "CoI, MOA, AOA, PAN, TAN, share certificates, DSC details — all in your Ollvy account\nYour CA will ask for these repeatedly over the years"
  }
]'::jsonb,
    updated_at = now()
WHERE slug = 'pvt-ltd-incorporation';

UPDATE service_packages
SET faqs = '[
  {
    "category": "General",
    "q": "How long does incorporation take?",
    "a": "15 working days end-to-end. DSC takes 2 days, name approval 3 days, SPICe+ filing and MCA approval 10 days."
  },
  {
    "category": "General",
    "q": "What is the minimum capital required?",
    "a": "No legal minimum. Authorised capital can be Rs 1 lakh (the standard starting point). Stamp duty on incorporation is based on authorised capital and varies by state."
  },
  {
    "category": "General",
    "q": "Pvt Ltd or LLP - which should I choose?",
    "a": "Pvt Ltd if you plan to raise equity, issue ESOPs, or need the company structure for credibility with enterprise clients. LLP if you are a professional services firm or want simpler compliance and profit-sharing. See our full comparison guide."
  },
  {
    "category": "Process",
    "q": "Can I be the only director?",
    "a": "A Pvt Ltd requires a minimum of 2 directors and 2 shareholders. For single-person ownership, consider OPC (One Person Company)."
  },
  {
    "category": "Process",
    "q": "What if my proposed name is rejected?",
    "a": "We search MCA and trademark databases before filing to minimise rejection risk. If rejected, we refile alternatives immediately at no extra cost."
  },
  {
    "category": "Documents",
    "q": "What documents do directors need?",
    "a": "PAN card, Aadhaar card, passport photo, mobile number linked to Aadhaar for OTP, and address proof. Directors must complete video verification for DSC."
  },
  {
    "category": "After Completion",
    "q": "What are my compliance obligations after incorporation?",
    "a": "INC-20A (commencement of business) within 180 days — requires share capital deposited in a company bank account, so open a current account immediately. Annual: AOC-4 (30 days after AGM), MGT-7 (60 days after AGM), Director KYC by Sep 30, Business ITR by Oct 31."
  },
  {
    "category": "After Completion",
    "q": "Does this include GST registration?",
    "a": "No. GST registration is a separate service. Mandatory once your turnover crosses the threshold. You can book both together - both CAs are assigned the same day."
  }
]'::jsonb,
    updated_at = now()
WHERE slug = 'pvt-ltd-incorporation';

-- ============================================================
-- GST Monthly Filing
-- ============================================================

UPDATE service_packages
SET whats_included = '[
  {
    "title": "GSTR-1 - outward supply return",
    "body": "B2B invoices, B2C sales above ₹2.5L, and export invoices captured\nPrepared from your sales data and filed by the 11th",
    "mockVisualType": "status",
    "mockVisualData": {
      "row1": "GSTR-1 · March 2025",
      "row2": "Filed: 10 Mar 2025",
      "row3": "ARN: AA1234567890123"
    }
  },
  {
    "title": "GSTR-3B - net tax payment",
    "body": "Output tax minus eligible ITC = your net GST liability\nChallan generated — you pay through your bank"
  },
  {
    "title": "ITC reconciliation with GSTR-2B",
    "body": "ITC you''re claiming is matched against GSTR-2B (your vendors'' filed data)\nMismatches flagged before you claim ineligible ITC",
    "comparisonWithout": "Claim ITC blindly, get notice later",
    "comparisonWithOllvy": "ITC verified against GSTR-2B before claiming"
  },
  {
    "title": "Monthly compliance report",
    "body": "What was filed, when, acknowledgement numbers, ITC claimed, tax paid — all in one report",
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

UPDATE service_packages
SET faqs = '[
  {
    "category": "General",
    "q": "What does the monthly retainer cover?",
    "a": "GSTR-1 by 11th, GSTR-3B by 20th, ITC reconciliation against GSTR-2B, and monthly compliance report."
  },
  {
    "category": "General",
    "q": "Can I cancel anytime?",
    "a": "Yes. No minimum term. Cancel before the 1st of any month and you will not be charged for that cycle."
  },
  {
    "category": "Process",
    "q": "What data do I need to share each month?",
    "a": "Sales invoices and purchase register. If you use accounting software, the export takes 2 minutes."
  },
  {
    "category": "Process",
    "q": "What if I have no transactions in a month?",
    "a": "Nil GSTR-1 and GSTR-3B must still be filed. We handle nil returns as part of the retainer."
  }
]'::jsonb,
    updated_at = now()
WHERE slug = 'gst-monthly';

-- ============================================================
-- Trademark Registration
-- ============================================================

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
    "body": "45 classes exist under the Nice Classification\nAttorney recommends only the ones you actually need — no unnecessary filings"
  },
  {
    "title": "Examiner objection response included",
    "body": "Examiner objections are common for descriptive marks — your attorney handles the response\nIncluded in the service, not a separate charge",
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

UPDATE service_packages
SET faqs = '[
  {
    "category": "General",
    "q": "What can I trademark?",
    "a": "Words, logos, slogans, sounds, and in some cases colours. Most businesses file a word mark and a logo mark separately for broader protection."
  },
  {
    "category": "General",
    "q": "How long does protection last?",
    "a": "10 years from the filing date, renewable indefinitely in 10-year increments."
  },
  {
    "category": "Process",
    "q": "Why does registration take 12-18 months?",
    "a": "The 7-day timeline is for filing. Examination by the Registry takes 6-12 months, then 4 months of public opposition window, then certificate issuance."
  },
  {
    "category": "Process",
    "q": "Can I use the R symbol after filing?",
    "a": "No. Use R only after registration is granted. Until then, use TM (for goods) or SM (for services) to indicate your claim."
  },
  {
    "category": "Documents",
    "q": "What documents do I need?",
    "a": "PAN, Aadhaar, address proof, and the logo file if registering a logo. For companies: Certificate of Incorporation and board resolution."
  },
  {
    "category": "Pricing",
    "q": "What if I need multiple classes?",
    "a": "Each class is a separate application with a separate government fee. Our attorney will recommend only the classes you actually need."
  }
]'::jsonb,
    updated_at = now()
WHERE slug = 'trademark-registration';

-- ============================================================
-- TDS Monthly Compliance
-- ============================================================

UPDATE service_packages
SET whats_included = '[
  {
    "title": "TDS calculation for all payment types",
    "body": "Salary (192), contractors (194C), professional fees (194J), rent (194I), interest (194A)\nEach has different rates and thresholds — correct rate applied automatically",
    "comparisonWithout": "Guess the rate - risk under-deduction notice",
    "comparisonWithOllvy": "Correct TDS rate applied for every payment"
  },
  {
    "title": "Monthly challan preparation",
    "body": "Challan needs the right BSR code, assessment year, and tax type\nWrong entries cause mismatched credits for your deductees\nWe prepare the challan — you just pay",
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

UPDATE service_packages
SET faqs = '[
  {
    "category": "General",
    "q": "Who needs to deduct TDS?",
    "a": "Any business making payments above prescribed threshold limits - salary, rent above Rs 2.4 lakh per year, contractor payments above Rs 30,000 per contract or Rs 1 lakh per year, professional fees above Rs 30,000 per year."
  },
  {
    "category": "General",
    "q": "What happens if I do not deduct TDS?",
    "a": "The expense is disallowed under Section 40(a)(ia) - you pay tax on it as if it were profit. Plus interest at 1.5% per month on the amount that should have been deducted."
  },
  {
    "category": "Process",
    "q": "When must TDS be deposited?",
    "a": "By the 7th of the following month for most payments. For March, the deadline is April 30."
  },
  {
    "category": "Process",
    "q": "When are TDS returns due?",
    "a": "Quarterly. Q1 (April-June): July 31. Q2 (July-Sep): October 31. Q3 (Oct-Dec): January 31. Q4 (Jan-Mar): May 31."
  }
]'::jsonb,
    updated_at = now()
WHERE slug = 'tds-monthly-compliance';

-- ============================================================
-- Business ITR Filing
-- ============================================================

UPDATE service_packages
SET whats_included = '[
  {
    "title": "Depreciation review - not just data entry",
    "body": "Asset schedule and depreciation calculations reviewed\nIncorrect rates or missed depreciation on eligible assets caught\nThis directly affects your tax liability",
    "comparisonWithout": "You calculate depreciation, CA just enters it",
    "comparisonWithOllvy": "CA reviews asset schedule and corrects rates"
  },
  {
    "title": "Director remuneration treatment",
    "body": "How you split director salary vs dividends affects your tax\nRemuneration structure checked against Companies Act limits\nOverpayment relative to profits flagged"
  },
  {
    "title": "Draft review before filing",
    "body": "Full draft shared before filing — income, deductions, tax computation\nYou review and approve in the app. Nothing goes to the portal without your sign-off",
    "comparisonWithout": "ITR filed, acknowledgement sent, no review",
    "comparisonWithOllvy": "Draft shared, you approve, then we file"
  },
  {
    "title": "Acknowledgement stored permanently",
    "body": "ITR-V uploaded the moment it''s generated\nStored permanently — accessible for loans, audits, or anything else years later",
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

UPDATE service_packages
SET faqs = '[
  {
    "category": "General",
    "q": "When is Business ITR due?",
    "a": "Pvt Ltd: October 31 (statutory audit always required). LLP without audit: July 31. LLP with audit (turnover above ₹1 crore): October 31."
  },
  {
    "category": "General",
    "q": "What is the difference between ITR-5 and ITR-6?",
    "a": "ITR-6 for companies (Pvt Ltd, Public Ltd, OPC). ITR-5 for LLPs and partnership firms."
  },
  {
    "category": "Process",
    "q": "What documents do I need?",
    "a": "Audited financials (P&L, Balance Sheet), trial balance, bank statements, Form 26AS, and depreciation schedule."
  },
  {
    "category": "Process",
    "q": "Do I need a statutory audit?",
    "a": "Mandatory for all Pvt Ltd companies regardless of turnover. For LLPs: mandatory above Rs 40 lakh turnover or Rs 25 lakh contribution."
  }
]'::jsonb,
    updated_at = now()
WHERE slug = 'business-itr';

-- ============================================================
-- LLP Incorporation
-- ============================================================

UPDATE service_packages
SET whats_included = '[
  {
    "title": "LLP Agreement drafted - not templated",
    "body": "Covers profit-sharing, decision-making, capital contribution, and exit terms\nDrafted for your actual arrangement — not a generic 50-50 template",
    "comparisonWithout": "Generic template - disputes arise later",
    "comparisonWithOllvy": "Custom agreement reflecting your actual split and roles"
  },
  {
    "title": "DPIN for all designated partners",
    "body": "Every designated partner needs a DPIN. We file all applications simultaneously."
  },
  {
    "title": "DSC arranged - video verification guided",
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

UPDATE service_packages
SET faqs = '[
  {
    "category": "General",
    "q": "LLP vs Pvt Ltd - which should I choose?",
    "a": "LLP if you are a professional services firm, do not plan to raise equity investment, and want lower compliance costs. Pvt Ltd if you plan to raise funding, issue ESOPs, or need share-based ownership structure. See our full comparison guide."
  },
  {
    "category": "General",
    "q": "Can I convert an LLP to Pvt Ltd later?",
    "a": "Yes, under Section 366 of the Companies Act, 2013. It involves multiple MCA filings, stamp duty, and a valuation exercise - typically 3-6 months. If funding is even a possibility in the next 3 years, start as Pvt Ltd."
  },
  {
    "category": "Process",
    "q": "How many partners are required?",
    "a": "Minimum 2 designated partners. No maximum. At least 2 must be Indian residents."
  },
  {
    "category": "Process",
    "q": "Does an LLP need to hold board meetings?",
    "a": "No. LLPs have no requirement for formal board or general meetings. Partners decide as agreed in the LLP Agreement."
  },
  {
    "category": "Documents",
    "q": "What documents do partners need?",
    "a": "PAN card, Aadhaar card, address proof. For the LLP: registered office address proof."
  },
  {
    "category": "After Completion",
    "q": "What are the annual compliance requirements?",
    "a": "Form 11 (Annual Return) by May 30 every year. Form 8 (Statement of Accounts and Solvency) by October 30 every year. ITR-5 by July 31 if no tax audit is required, or October 31 if tax audit applies (turnover above Rs 1 crore). No mandatory statutory audit below Rs 40 lakh turnover and Rs 25 lakh contribution."
  }
]'::jsonb,
    updated_at = now()
WHERE slug = 'llp-incorporation';

-- ============================================================
-- MCA Annual Filing
-- ============================================================

UPDATE service_packages
SET whats_included = '[
  {
    "title": "Both forms filed - AOC-4 and MGT-7",
    "body": "AOC-4 (financial statements) and MGT-7 (annual return with shareholder and director details)\nBoth mandatory, both included",
    "comparisonWithout": "Book AOC-4 and MGT-7 separately - higher total cost",
    "comparisonWithOllvy": "Both forms, one price, one CS"
  },
  {
    "title": "Deadline calculation based on AGM",
    "body": "AOC-4 due 30 days after AGM, MGT-7 due 60 days after AGM\nAGM must be held within 6 months of financial year end\nAll three dates tracked for you",
    "mockVisualType": "calendar",
    "mockVisualData": {
      "row1": "FY End: March 31 → AGM by Sep 30",
      "row2": "AOC-4 due: 30 days after AGM",
      "row3": "MGT-7 due: 60 days after AGM",
      "note": "We calculate your exact deadlines"
    }
  },
  {
    "title": "Penalty status checked before filing",
    "body": "Late filing = ₹100/day per form from the due date\nExact penalty calculated and disclosed before you approve",
    "comparisonWithout": "Surprise penalty at MCA portal during filing",
    "comparisonWithOllvy": "Penalty calculated and disclosed before you approve"
  },
  {
    "title": "SRN shared immediately",
    "body": "Both SRNs (AOC-4 and MGT-7) shared in your app immediately after submission\nROC typically processes within 48 hours"
  }
]'::jsonb,
    updated_at = now()
WHERE slug = 'mca-annual-filing';

UPDATE service_packages
SET faqs = '[
  {
    "category": "General",
    "q": "When is MCA annual filing due?",
    "a": "AOC-4: within 30 days of AGM. MGT-7: within 60 days of AGM. AGM must be held by September 30 for companies with a March financial year end."
  },
  {
    "category": "General",
    "q": "Is this different from Business ITR?",
    "a": "Yes. MCA annual filing is for the Ministry of Corporate Affairs (company registry). Business ITR is filed with the Income Tax department. Both are mandatory and have separate deadlines."
  },
  {
    "category": "Process",
    "q": "Can I file if the audit is not complete?",
    "a": "No. AOC-4 requires signed, audited financials."
  },
  {
    "category": "Process",
    "q": "What if I missed the deadline?",
    "a": "₹100/day per form from the due date. File immediately to stop accumulation."
  },
  {
    "category": "Documents",
    "q": "What documents do I need?",
    "a": "Audited Balance Sheet, P&L, notes to accounts, director report, auditor report, and updated shareholder list."
  }
]'::jsonb,
    updated_at = now()
WHERE slug = 'mca-annual-filing';

-- ============================================================
-- FSSAI License
-- ============================================================

UPDATE service_packages
SET whats_included = '[
  {
    "title": "Correct license type determined upfront",
    "body": "Registration (up to ₹12L), State License (₹12L–₹20Cr), Central License (₹20Cr+ or interstate)\nFiling the wrong type means rejection and refiling\nThe right one is determined before you pay",
    "comparisonWithout": "Guess the license type - risk rejection and delay",
    "comparisonWithOllvy": "License type verified based on turnover and geography"
  },
  {
    "title": "Application filed on FSSAI portal",
    "body": "20+ fields on the FSSAI portal per application type\nYou answer 5 questions in the app — the rest is handled",
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
    "body": "Valid 1–5 years depending on fee paid\nRenewal reminder added to your compliance calendar\nExpired license = same penalty as no license",
    "mockVisualType": "calendar",
    "mockVisualData": {
      "row1": "FSSAI License Renewal - Due Mar 2026",
      "note": "Added automatically after license issued"
    }
  }
]'::jsonb,
    updated_at = now()
WHERE slug = 'fssai-license';

UPDATE service_packages
SET faqs = '[
  {
    "category": "General",
    "q": "Do I need FSSAI even for a small home bakery?",
    "a": "Yes. Any food business - including home-based bakeries, cloud kitchens, or tiffin services - needs FSSAI. Below ₹12L turnover: Registration is sufficient. Above: State License required. Exemptions exist only for farmers selling raw produce directly."
  },
  {
    "category": "General",
    "q": "What is the difference between Registration, State, and Central License?",
    "a": "Registration: up to ₹12L turnover, no inspection, valid 1-5 years. State License: ₹12L-₹20Cr turnover, may require inspection, valid 1-5 years. Central License: ₹20Cr+ or multi-state operations, inspection required."
  },
  {
    "category": "Process",
    "q": "How long is the license valid?",
    "a": "1 to 5 years — you choose at the time of application. Fees scale accordingly. Renewal must be filed 30 days before expiry."
  },
  {
    "category": "Process",
    "q": "What happens during inspection?",
    "a": "FSSAI official visits your premises, checks hygiene, reviews documentation (pest control, water test, staff medical certificates), and verifies equipment. Pass rate is high if documentation is in order."
  },
  {
    "category": "Documents",
    "q": "What documents are required?",
    "a": "Business registration proof, ID/address proof, food safety management plan, layout plan of premises, list of food items to be handled. For manufacturing: equipment list, water test report. Varies by license type - we send the exact list."
  },
  {
    "category": "After Completion",
    "q": "Where do I display the license number?",
    "a": "On all food packaging, at the premises entrance, and on invoices. E-commerce platforms require the 14-digit number for food category listings. Format: 12345678901234."
  }
]'::jsonb,
    updated_at = now()
WHERE slug = 'fssai-license';

-- ============================================================
-- IEC Code
-- ============================================================

UPDATE service_packages
SET whats_included = '[
  {
    "title": "Filed on DGFT portal - not an outdated form",
    "body": "Issued exclusively online through DGFT — PAN, Aadhaar, bank details must match exactly\nWe handle the submission, you verify the OTP",
    "comparisonWithout": "Navigate DGFT portal - 2+ hours, frequent errors",
    "comparisonWithOllvy": "We file - you verify OTP - IEC in 5 days"
  },
  {
    "title": "Bank account verification guidance",
    "body": "Cancelled cheque or bank statement needed — business name, account number, and IFSC must be visible\nMany applications fail because the account is in a personal name, not the business name\nVerified before filing",
    "comparisonWithout": "Rejection due to bank account mismatch",
    "comparisonWithOllvy": "Bank account verified before submission"
  },
  {
    "title": "Lifetime validity - no renewal",
    "body": "Valid for life — no annual renewal unlike GST or FSSAI\nIf business details change (address, bank, directors), the profile needs updating (₹999)"
  },
  {
    "title": "Ready to use at customs",
    "body": "Active immediately on ICEGATE — file bills of entry (imports) and shipping bills (exports)\nNo additional registration required",
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

UPDATE service_packages
SET faqs = '[
  {
    "category": "General",
    "q": "Do I need IEC to receive foreign payments for services?",
    "a": "No. IEC is for goods (imports/exports). Service exports (software, consulting, design) do not require IEC. However, having an IEC can help with bank compliance when receiving large foreign remittances."
  },
  {
    "category": "General",
    "q": "Is IEC required for personal imports?",
    "a": "No. Personal imports (gifts, personal use items) do not require IEC. IEC is for businesses engaged in commercial import/export of goods."
  },
  {
    "category": "Process",
    "q": "How long is IEC valid?",
    "a": "Lifetime. IEC does not expire. However, you must update your profile if business details change - address, bank account, authorized signatory. We can handle updates for ₹999."
  },
  {
    "category": "Process",
    "q": "Can I get IEC for a proprietorship?",
    "a": "Yes. Sole proprietorships can get IEC. The IEC will be in the proprietor''s name with the business/trade name. Bank account should be a current account in the business name."
  },
  {
    "category": "Documents",
    "q": "What documents are required?",
    "a": "PAN card of the business entity, incorporation certificate (for companies/LLPs), cancelled cheque or bank statement (showing account holder name, number, IFSC), Aadhaar of authorized signatory for OTP."
  },
  {
    "category": "After Completion",
    "q": "How do I use IEC at customs?",
    "a": "Your IEC is automatically registered with ICEGATE (customs EDI system). Quote your 10-digit IEC on all bills of entry (imports) and shipping bills (exports). Your customs broker or freight forwarder will need this number."
  }
]'::jsonb,
    updated_at = now()
WHERE slug = 'iec-code';

-- ============================================================
-- Director KYC
-- ============================================================

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
    "body": "OTP verification on your registered mobile and email\nCS coordinates live — they file, you approve the OTP. About 10 minutes"
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

UPDATE service_packages
SET faqs = '[
  {
    "category": "General",
    "q": "What is DIR-3 KYC?",
    "a": "DIR-3 KYC is an annual verification that every director of an Indian company must file with MCA. It confirms your PAN, Aadhaar, and contact details are current. It''s due every Sep 30."
  },
  {
    "category": "General",
    "q": "Why is this required every year?",
    "a": "MCA wants to verify that directors are real people with valid IDs. It''s a fraud prevention measure. Before this rule, shell companies used fake directors."
  },
  {
    "category": "Process",
    "q": "What happens if I miss Sep 30?",
    "a": "Your DIN is deactivated on Oct 1. You can''t sign any MCA documents. Penalty of ₹5,000/day starts accruing. The only way to stop it is to file the KYC."
  },
  {
    "category": "Process",
    "q": "If my DIN is deactivated, can I still file?",
    "a": "Yes. File the DIR-3 KYC, pay the penalty (calculated by MCA), and your DIN is reactivated within 24-48 hours. We handle the entire process."
  },
  {
    "category": "Documents",
    "q": "What documents do I need?",
    "a": "PAN card and Aadhaar card. That''s it. You also need access to the mobile number linked to your Aadhaar for OTP verification."
  }
]'::jsonb,
    updated_at = now()
WHERE slug = 'director-kyc';

-- ============================================================
-- GST Cancellation
-- ============================================================

UPDATE service_packages
SET whats_included = '[
  {
    "title": "Final return GSTR-10",
    "body": "Closing stock details, ITC reversal calculation, and final return prepared and filed."
  },
  {
    "title": "REG-16 filing",
    "body": "Cancellation application with reason and supporting details."
  },
  {
    "title": "ITC reversal handled",
    "body": "Remaining ITC on closing stock reversed correctly - prevents demand notices after cancellation."
  }
]'::jsonb,
    updated_at = now()
WHERE slug = 'gst-cancellation';

UPDATE service_packages
SET faqs = '[
  {
    "category": "General",
    "q": "What happens to my remaining ITC balance?",
    "a": "ITC on closing stock must be reversed and paid back to the government. We calculate this before filing."
  },
  {
    "category": "General",
    "q": "Can I re-register for GST later?",
    "a": "Yes. A fresh registration application can be filed if your turnover crosses the threshold again."
  },
  {
    "category": "Process",
    "q": "How long does cancellation take?",
    "a": "15 working days from application to cancellation order, assuming no pending returns or outstanding liabilities."
  },
  {
    "category": "Process",
    "q": "What if I have pending returns?",
    "a": "All pending GSTR-1 and GSTR-3B must be filed before we can file the cancellation application. We file those first."
  }
]'::jsonb,
    updated_at = now()
WHERE slug = 'gst-cancellation';

-- ============================================================
-- GST Revocation
-- ============================================================

UPDATE service_packages
SET whats_included = '[
  {
    "title": "All pending returns filed",
    "body": "Every outstanding GSTR-1 and GSTR-3B cleared before revocation application. Interest on late payment calculated and paid."
  },
  {
    "title": "REG-21 application",
    "body": "Revocation request with explanation of the default and confirmation that returns are now current."
  },
  {
    "title": "Interest calculation",
    "body": "Exact interest liability on late-deposited tax calculated before filing so you know the total amount upfront."
  }
]'::jsonb,
    updated_at = now()
WHERE slug = 'gst-revocation';

UPDATE service_packages
SET faqs = '[
  {
    "category": "General",
    "q": "Why was my GST cancelled?",
    "a": "Suo-moto cancellation is typically triggered after 6 or more consecutive months of non-filing."
  },
  {
    "category": "General",
    "q": "What is the time limit for applying for revocation?",
    "a": "30 days from the date of the cancellation order. Apply immediately - do not wait."
  },
  {
    "category": "Process",
    "q": "Can I re-register if revocation fails?",
    "a": "If the revocation window is missed, you must file an appeal with the Appellate Authority. This is a more involved process. Acting within 30 days avoids this."
  }
]'::jsonb,
    updated_at = now()
WHERE slug = 'gst-revocation';

-- ============================================================
-- DIN Reactivation
-- ============================================================

UPDATE service_packages
SET whats_included = '[
  {
    "title": "All outstanding DIR-3 KYC filed",
    "body": "Every year of missed KYC cleared. OTP verification coordinated in real time."
  },
  {
    "title": "DIR-3C application",
    "body": "Reactivation form with explanation submitted to MCA."
  },
  {
    "title": "DIN fully restored",
    "body": "All directorial rights, signing authority, and MCA filing access restored across all companies."
  }
]'::jsonb,
    updated_at = now()
WHERE slug = 'din-reactivation';

UPDATE service_packages
SET faqs = '[
  {
    "category": "General",
    "q": "Why was my DIN deactivated?",
    "a": "Deactivated when DIR-3 KYC is not filed by September 30 each year. Automated by MCA from October 1."
  },
  {
    "category": "General",
    "q": "What is the late fee?",
    "a": "Rs 5,000 per year of missed DIR-3 KYC. This is a government fee and is fixed."
  },
  {
    "category": "Process",
    "q": "How long does reactivation take?",
    "a": "10 working days from when we receive your documents."
  },
  {
    "category": "Process",
    "q": "Does reactivation fix the issue for all companies where I am a director?",
    "a": "Yes. Your DIN is a single identifier. Reactivating it restores your status across all directorships."
  }
]'::jsonb,
    updated_at = now()
WHERE slug = 'din-reactivation';

COMMIT;
