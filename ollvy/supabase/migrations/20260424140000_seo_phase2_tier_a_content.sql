-- ============================================================================
-- SEO Phase 2 — Tier A content depth
-- Applied 2026-04-24
--
-- Appends (does NOT replace) FAQs and service_risks to the 5 Tier A services
-- so they can compete with ClearTax/IndiaFilings on topical authority:
--
--   gst-registration:        +6 FAQs (6 → 12),  +3 risks (3 → 6)
--   pvt-ltd-incorporation:   +2 FAQs (10 → 12), +3 risks (3 → 6)
--   llp-incorporation:       +7 FAQs (5 → 12),  +3 risks (3 → 6)
--   business-itr:            +7 FAQs (4 → 11),  +3 risks (3 → 6)
--   trademark-registration:  +7 FAQs (5 → 12),  +3 risks (3 → 6)
--
-- Total: +29 FAQs, +15 risks across 5 services. Non-destructive — uses JSONB
-- concatenation operator (||) to append. All existing content preserved.
--
-- Content follows "Middle Ground" style from ollvy/CLAUDE.md:
--   real form names in context (GSTR-10, SPICe+, FiLLiP, Section 234A, etc.)
--   every claim has a number (Rs 5,000-10,000, 15 working days, 30 days)
--   one sentence, one fact
--   always "Ollvy", "Ollvy CA", never "we"
--   regular hyphens, no em dashes
-- ============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- gst-registration: +6 FAQs
-- ---------------------------------------------------------------------------
UPDATE service_packages SET faqs = faqs || '[
  {"q":"Can I register for GST in a state where I have no permanent office?","a":"Yes. Ollvy registers Casual Taxable Person (CTP) GST if you will sell at an exhibition, trade fair, or make occasional supplies from a non-home state. CTP is valid for 90 days (extendable by 90 more) and requires an advance tax deposit estimated on projected turnover. For ongoing operations in a new state, Ollvy files an additional place of business under your existing GSTIN.","category":"Scope"},
  {"q":"What happens if my GST registration is rejected?","a":"Ollvy reads the rejection reason from the GST portal (usually address proof mismatch or photograph quality). Ollvy responds to the officer query within 7 working days with corrected documents. If the officer still rejects, Ollvy files a fresh application with the fix applied. No extra fee from Ollvy for rework within the same engagement.","category":"Process"},
  {"q":"Is Composition Scheme different from regular GST registration?","a":"Yes. Composition Scheme (Section 10) lets you pay 1% of turnover (traders) or 5% (restaurants) instead of regular GST rates, but you cannot claim ITC and cannot make inter-state supplies. You opt in during registration using CMP-02. Eligible only if turnover is under Rs 1.5 crore. Ollvy files regular + CMP-02 together if Composition is the right fit.","category":"Scope"},
  {"q":"Can I cancel GST registration later if business slows down?","a":"Yes. Ollvy files GSTR-10 (final return) and REG-16 (cancellation) if turnover drops below the Rs 40 lakh (goods) or Rs 20 lakh (services) threshold. Cancellation is granted 30-45 days after the final return. Ollvy offers GST cancellation as a separate Rs 999 service.","category":"Lifecycle"},
  {"q":"Do I need separate GST for each state I sell in?","a":"Yes. GST is state-based. Every state where you have a physical place of business needs its own GSTIN. If you ship from one state to customers in another, you bill IGST from your registered state. If you operate from multiple states, Ollvy files one GSTIN application per state.","category":"Scope"},
  {"q":"How long does the GSTIN remain valid once issued?","a":"Permanent, unless cancelled. Exception: Casual Taxable Person (CTP) GST expires after 90 days. For regular GST, you must file monthly or quarterly returns to keep it active. Six months of continuous non-filing triggers automatic cancellation by the officer.","category":"Lifecycle"}
]'::jsonb WHERE slug = 'gst-registration';

-- gst-registration: +3 risks
UPDATE service_packages SET service_risks = service_risks || '[
  {"title":"Composition Scheme opt-in window missed","body":"Composition Scheme election must be filed within the first 30 days of registration using CMP-02 (Section 10(1)).\nMiss this and you are locked into regular GST for the full financial year, paying 18% instead of 1% on turnover.\nSwitching later is allowed only at the start of the next FY.","icon":"clock"},
  {"title":"Wrong HSN or SAC code at application","body":"Every supply needs the correct 6-digit HSN (goods) or SAC (services) code.\nA wrong code triggers officer queries, delays GSTIN by 7-10 days, and later causes ITR mismatches when turnover is classified under the wrong category.\nOllvy CA verifies HSN and SAC against CBIC notified list before filing.","icon":"document"},
  {"title":"Photograph and signature mismatch across Aadhaar, PAN, and bank","body":"Officers reject applications when the authorized signatory photo on Aadhaar, PAN, and bank statement do not match.\nThis is the #2 cause of GST rejection after address proof.\nOllvy checks all three documents side-by-side before submission and updates any mismatch at source first.","icon":"alert"}
]'::jsonb WHERE slug = 'gst-registration';

-- ---------------------------------------------------------------------------
-- pvt-ltd-incorporation: +2 FAQs
-- ---------------------------------------------------------------------------
UPDATE service_packages SET faqs = faqs || '[
  {"q":"Can I add or remove a director after incorporation?","a":"Yes. Adding a director needs a board resolution, DIR-12 filed with MCA within 30 days, and a valid DIN for the new director. Removing a director needs the same DIR-12 plus the director resignation (DIR-11). Ollvy handles director changes as a separate Rs 2,999 service.","category":"Lifecycle"},
  {"q":"What is the difference between paid-up and authorized capital?","a":"Authorized capital is the maximum the company can raise (Rs 1 lakh minimum). Paid-up capital is what shareholders actually contribute (Rs 1 minimum). You can start with Rs 1 paid-up and increase later via share allotment, but increasing authorized capital requires MGT-14 filing and stamp duty based on state.","category":"Structure"}
]'::jsonb WHERE slug = 'pvt-ltd-incorporation';

-- pvt-ltd-incorporation: +3 risks
UPDATE service_packages SET service_risks = service_risks || '[
  {"title":"DIN disabled on proposed directors","body":"If any proposed director has an existing DIN deactivated due to missed DIR-3 KYC, MCA blocks the incorporation until KYC is filed and approved.\nCheck DIN status on mca.gov.in before incorporation.\nOllvy runs this check on every director during document intake.","icon":"alert"},
  {"title":"SPICe+ Part B payment stuck in MCA V3 portal","body":"MCA V3 portal occasionally holds SPICe+ Part B payment for 24-72 hours before moving to \"under review\".\nThis is not a rejection but delays the COI by 2-4 days.\nOllvy monitors MCA payment status daily and escalates to ROC helpdesk if payment sits longer than 48 hours.","icon":"clock"},
  {"title":"PAN and TAN delivery delay after COI","body":"CIN, PAN, and TAN are issued together in the COI.\nThe physical PAN card from NSDL can take an additional 5-10 working days.\nOllvy sends e-PAN and e-TAN the same day the COI is issued so you can open the current account without waiting for the physical card.","icon":"document"}
]'::jsonb WHERE slug = 'pvt-ltd-incorporation';

-- ---------------------------------------------------------------------------
-- llp-incorporation: +7 FAQs
-- ---------------------------------------------------------------------------
UPDATE service_packages SET faqs = faqs || '[
  {"q":"Can an LLP raise funding from VCs or angels?","a":"No, not directly. LLPs cannot issue equity shares or ESOPs. VCs and angels invest for equity stakes, so they do not fund LLPs. If you plan to raise external capital ever, choose Pvt Ltd. You can convert LLP to Pvt Ltd later (Section 56 of LLP Act) but it is a 3-6 month process with capital gains implications.","category":"Funding"},
  {"q":"Can a Pvt Ltd later convert to an LLP?","a":"Yes, but rarely beneficial. Pvt Ltd to LLP conversion needs every shareholder to become a partner, NOC from creditors, and capital gains tax on the transfer may apply. Most founders do this to escape annual compliance burden of Pvt Ltd. Ollvy handles conversions separately, not as part of LLP incorporation scope.","category":"Lifecycle"},
  {"q":"What happens if LLP partners change?","a":"Form 4 filed with MCA within 30 days of any partner addition, removal, or change in contribution. Late filing is Rs 100/day with no cap. The LLP agreement also needs updating and re-filing via Form 3. Ollvy does partner change filings as a separate Rs 1,999 service.","category":"Lifecycle"},
  {"q":"Does an LLP need to audit accounts every year?","a":"Only if turnover exceeds Rs 40 lakh OR contribution exceeds Rs 25 lakh. Below both thresholds, audit is optional. Even without audit, annual filings (Form 11 by May 30 and Form 8 by October 30) are mandatory. Ollvy offers MCA annual filing as a separate Rs 3,599 service.","category":"Compliance"},
  {"q":"What is the tax rate on LLP profits?","a":"30% flat on taxable profits plus 12% surcharge (if income above Rs 1 crore) and 4% cess. Effective rate: 31.2% to 34.94% depending on income. LLP partners are not taxed on profit share (already taxed at LLP level). Interest on capital and remuneration to working partners are taxable separately as the partner income.","category":"Tax"},
  {"q":"Can one partner be a company or foreign national?","a":"A body corporate (Indian or foreign) can be a partner. Foreign individuals can be partners subject to FEMA and RBI rules (requires DIN, PAN, and valid Indian communication address). Ollvy handles foreign partner incorporations with 5-7 extra working days for FEMA compliance.","category":"Structure"},
  {"q":"What is FiLLiP and how long does it take?","a":"FiLLiP (Form for Incorporation of LLP) is the single MCA form that covers LLP name reservation, incorporation, DIN allotment for designated partners, and PAN/TAN. Filed through MCA V3 portal. ROC approval takes 7-10 working days if documents are clean. Ollvy 12-day SLA accounts for ROC processing and any officer queries.","category":"Process"}
]'::jsonb WHERE slug = 'llp-incorporation';

-- llp-incorporation: +3 risks
UPDATE service_packages SET service_risks = service_risks || '[
  {"title":"LLP agreement not filed within 30 days","body":"LLP agreement must be filed via Form 3 within 30 days of incorporation.\nMiss this and Rs 100/day penalty accrues with no maximum cap - a six-month delay can reach Rs 18,000.\nOllvy files Form 3 within 7 days of COI issuance as part of the incorporation scope.","icon":"clock"},
  {"title":"Designated Partner DIN not active","body":"Both designated partners need active DIN at FiLLiP filing.\nAn existing DIN deactivated for missed DIR-3 KYC blocks the incorporation until KYC is filed and approved.\nOllvy checks DIN status for every designated partner before submission.","icon":"alert"},
  {"title":"Digital signature expired on any partner","body":"Every designated partner and contributing partner needs a valid DSC (Class 3) to sign FiLLiP and the LLP agreement.\nAn expired DSC causes MCA rejection with no error until the form is digitally signed.\nOllvy verifies DSC validity on all partners during document intake.","icon":"document"}
]'::jsonb WHERE slug = 'llp-incorporation';

-- ---------------------------------------------------------------------------
-- business-itr: +7 FAQs
-- ---------------------------------------------------------------------------
UPDATE service_packages SET faqs = faqs || '[
  {"q":"What is the difference between presumptive taxation (Section 44AD) and regular ITR?","a":"Presumptive taxation (Section 44AD for business, 44ADA for professionals) lets you declare 6-8% of turnover as profit without maintaining books, filed via ITR-4. Regular ITR (ITR-5 for LLPs, ITR-6 for companies) requires full P&L and balance sheet. Companies cannot opt for presumptive. For LLPs under Rs 2 crore turnover, presumptive can save significant effort. Ollvy evaluates both during filing to pick the lower tax outcome.","category":"Scope"},
  {"q":"My company had no revenue this year. Do I still file?","a":"Yes. Pvt Ltd and LLP must file ITR every year regardless of revenue, even if zero. Missing the deadline for a zero-revenue year still costs Rs 5,000 to Rs 10,000 in late fees (Section 234F) and prevents carrying forward losses from setup expenses. Ollvy files nil returns at the same Rs 4,999 price.","category":"Filing"},
  {"q":"What happens if I file ITR after the extended deadline?","a":"After the extended due date (usually December 31 for companies), you can still file a belated return until March 31 with Rs 5,000 to Rs 10,000 late fee plus loss of some carry-forward benefits. After March 31, you can file ITR-U (updated return) within 24 months by paying 25% to 50% additional tax. Filing belated in January is much cheaper than filing ITR-U next March.","category":"Deadlines"},
  {"q":"Is MAT (Minimum Alternate Tax) applicable to my company?","a":"MAT applies to every company (Section 115JB) - 15% of book profits plus surcharge and cess. If your regular tax liability is less than MAT (common in startups with depreciation-heavy P&L), you pay MAT instead. The excess becomes MAT credit carried forward for 15 years. Ollvy calculates both regular tax and MAT on every filing.","category":"Tax"},
  {"q":"Can I revise a filed ITR if I spot an error?","a":"Yes. Revised return under Section 139(5) can be filed within 3 months before the assessment year ends or before assessment is completed, whichever is earlier. No penalty for revising. Ollvy revises at no extra charge if the error was Ollvy fault; Rs 999 if the founder supplied incorrect data originally.","category":"Corrections"},
  {"q":"How long should I keep ITR-6 supporting documents?","a":"Minimum 8 years from the end of the relevant assessment year (Section 44AA). Income Tax can reopen assessment up to 10 years in serious cases (Section 148A). Keep P&L, balance sheet, bank statements, invoices, TDS certificates, and audit report for at least 10 years. Ollvy provides a digital archive of every ITR filing for 10-year retention.","category":"Records"},
  {"q":"What is ITR-U and when do I need it?","a":"ITR-U (updated return, Section 139(8A)) lets you update a filed ITR up to 24 months after the assessment year ends, with 25% additional tax (within 12 months) or 50% additional tax (12-24 months) over the tax and interest due. Use it only if you missed reporting income or claimed excess deductions. Cannot use ITR-U to claim a refund or reduce tax liability.","category":"Corrections"}
]'::jsonb WHERE slug = 'business-itr';

-- business-itr: +3 risks
UPDATE service_packages SET service_risks = service_risks || '[
  {"title":"MAT applicability missed (Section 115JB)","body":"Every company pays the higher of regular tax (30% on taxable profits) or Minimum Alternate Tax (15% on book profits plus surcharge).\nIgnoring MAT calculation triggers a Section 115JB demand notice later with interest under Section 234B and 234C.\nOllvy CA runs both calculations and files Form 29B with the ITR.","icon":"alert"},
  {"title":"Tax audit report not uploaded before ITR (Section 44AB)","body":"Companies with turnover above Rs 1 crore (Rs 10 crore with digital transactions) need tax audit.\nForm 3CD must be uploaded by the auditor before the ITR is filed.\nMissing the September 30 audit deadline makes the ITR defective and costs 0.5% of turnover as penalty (Section 271B, capped at Rs 1.5 lakh).","icon":"clock"},
  {"title":"Advance tax underpayment interest (Section 234B, 234C)","body":"Companies with tax liability above Rs 10,000 must pay advance tax in 4 installments (15% by June 15, 45% by September 15, 75% by December 15, 100% by March 15).\nUnderpaying any installment triggers 1% per month interest under Section 234B and 234C.\nOllvy calculates advance tax estimates quarterly based on projected profits.","icon":"document"}
]'::jsonb WHERE slug = 'business-itr';

-- ---------------------------------------------------------------------------
-- trademark-registration: +7 FAQs
-- ---------------------------------------------------------------------------
UPDATE service_packages SET faqs = faqs || '[
  {"q":"Do I need to trademark in every class my business operates in?","a":"Yes. Each of the 45 Nice Classification classes is a separate filing with a separate Rs 4,500 govt fee. If you sell software (Class 9) and offer software consulting (Class 42), those are two applications. Ollvy Rs 2,999 professional fee covers one class; each additional class is Rs 1,999 more.","category":"Scope"},
  {"q":"What happens if someone opposes my trademark during publication?","a":"After examination, your trademark publishes in the Trademark Journal. A 4-month opposition window opens (Section 21). If opposed, you file a counter-statement within 2 months, then both parties exchange evidence. Most oppositions settle or drop at this stage. Ollvy handles opposition response as a separate engagement - scoped to complexity.","category":"Process"},
  {"q":"Can I use a trademark before registration is complete?","a":"Yes. You can use TM (unregistered mark) the day you file. You cannot use the R-in-a-circle symbol until the Registration Certificate issues, typically 12-18 months later. Using the R-in-a-circle before registration is a criminal offense under Section 107 with fine up to Rs 1 lakh.","category":"Usage"},
  {"q":"What is the difference between TM and R-in-a-circle symbols?","a":"TM means a mark is claimed but not registered - legally, anyone can use it next to their mark. R-in-a-circle means the mark is officially registered with the Trademark Registry. Only the R symbol gives you the right to sue for infringement in court. SM (service mark) is the service equivalent, rarely used in India.","category":"Usage"},
  {"q":"Can I trademark a logo, slogan, and name separately?","a":"Yes, and often you should. A word mark (brand name text) protects the name against similar names. A device mark (logo) protects the visual design. A combined mark (logo + name) offers weaker individual protection. For strongest IP, file word + device separately - two applications, two fees, two registrations.","category":"Strategy"},
  {"q":"What happens after 10 years - do I lose the trademark?","a":"The trademark renews indefinitely at 10-year intervals (Section 25). Renewal fee is Rs 9,000 per class. Filing TM-R within 6 months before expiry keeps the mark active without a gap. Miss the renewal window and the mark is removed, though a 1-year grace period under Section 25(4) allows restoration with an additional fee.","category":"Lifecycle"},
  {"q":"Can I trademark a common word or generic term?","a":"Only if it is arbitrary for your business (Apple for computers is fine, Apple for fruit is not). Descriptive words (Fresh Milk for dairy) or generic terms (Software for an IT service) fail the distinctiveness test under Section 9. Ollvy search stage flags weak marks before filing to avoid a Rs 4,500 wasted govt fee.","category":"Strategy"}
]'::jsonb WHERE slug = 'trademark-registration';

-- trademark-registration: +3 risks
UPDATE service_packages SET service_risks = service_risks || '[
  {"title":"Incorrect Nice class selection","body":"There are 45 Nice Classification classes covering goods (1-34) and services (35-45).\nWrong class means wrong scope of protection and likely rejection during examination.\nExample: a software product belongs in Class 9 (downloadable) or Class 42 (SaaS), not Class 35 (business services).\nOllvy maps the product description to the correct class before filing.","icon":"document"},
  {"title":"Examination report unanswered within 30 days","body":"The Trademark Registry issues an examination report within 6 months of filing.\nYou have 30 days to respond with counter-arguments or amendments (Rule 33).\nMiss the 30-day window and the application is abandoned - the Rs 4,500 govt fee is gone and you start over.\nOllvy monitors examination reports and responds within 20 days every time.","icon":"clock"},
  {"title":"Priority claim missed under Paris Convention","body":"If you filed an identical trademark abroad in a Paris Convention country within the last 6 months, you can claim priority filing date in India (Section 18(2)).\nMissing this 6-month window forfeits priority and exposes you to later-filed Indian applications that technically filed before your Indian date.\nOllvy checks foreign filing history at intake for founders with prior international applications.","icon":"alert"}
]'::jsonb WHERE slug = 'trademark-registration';

COMMIT;
