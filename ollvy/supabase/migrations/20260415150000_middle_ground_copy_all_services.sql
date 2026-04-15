-- Middle ground copy: specific, confident, easy to read, conversion-focused
-- Real form names in context (not raw jargon, not dumbed down)
-- Concrete numbers, timelines, costs, consequences
-- Ollvy branding, no em dashes, \n for bullets

-- =====================
-- 1. PVT LTD INCORPORATION
-- =====================
UPDATE service_packages
SET
  tagline = 'Incorporated in 15 working days. PAN, TAN, and founding documents included.',
  short_description = 'Pvt Ltd company registered in 15 working days. Digital signatures, Director IDs, name approval, founding documents, PAN, and TAN - all included.',
  workflow_stages = '[
    {"step": 1, "title": "Answer 5 questions - we build your checklist", "timeline": "Day 0", "body": "Number of directors, shareholders, 3 name options, state, and starting capital.\nOllvy CS assigned within 4 hours.", "visual": "checklist", "milestone": "Ollvy CS assigned, checklist sent"},
    {"step": 2, "title": "Upload documents through the app", "timeline": "Day 0-2", "body": "PAN and Aadhaar for all directors, address proof, passport photos.\nOllvy verifies every document before filing.\nMismatches caught here, not after the government raises a query.", "visual": "upload", "milestone": "Documents verified by Ollvy"},
    {"step": 3, "title": "Digital signatures (DSC) and Director IDs (DIN) arranged", "timeline": "Day 2-4", "body": "Every director needs a DSC and DIN - both mandatory for the incorporation form.\nOllvy files both and guides each director through a 15-minute video verification.\nDone remotely from any phone.", "visual": "form", "milestone": "DSC and DIN ready"},
    {"step": 4, "title": "Company name approved via RUN", "timeline": "Day 4-7", "body": "Ollvy files the name reservation (RUN) with MCA.\nApproval takes 2-3 working days.\nIf rejected, alternatives filed immediately at no extra cost.", "visual": "form", "milestone": "Company name approved"},
    {"step": 5, "title": "SPICe+ filed - MOA, AOA, PAN, TAN in one submission", "timeline": "Day 7-12", "body": "One government form (SPICe+) covers incorporation, MOA, AOA, PAN, TAN, and optional GST.\nOllvy drafts MOA and AOA based on your actual business activities.\nGeneric templates cost Rs. 5,000-15,000 to amend later when investors ask.", "visual": "form", "milestone": "SPICe+ submitted to MCA"},
    {"step": 6, "title": "Certificate of Incorporation issued", "timeline": "Day 12-15", "body": "Government issues your Certificate of Incorporation with CIN.\nPAN and TAN generated within 24 hours.\nAll documents in your Ollvy account. Compliance calendar populated from day one.", "visual": "stamp", "isCompletion": true, "milestone": "Company incorporated"}
  ]'::jsonb,
  whats_included = '[
    {"title": "DSC for all directors - 15 min video verification", "body": "Digital Signature Certificates are mandatory for all MCA filings. Ollvy arranges tokens and guides video verification.", "comparisonWithout": "Navigate DSC portals yourself - 3+ hours per director", "comparisonWithOllvy": "Guided in-app flow - 15 minutes per director"},
    {"title": "DIN included in SPICe+ - no separate application", "body": "Director Identification Number filed as part of SPICe+. No separate DIR-3 needed.", "comparisonWithout": "File DIR-3 separately - adds 3-5 days", "comparisonWithOllvy": "DIN included in SPICe+ - no extra time"},
    {"title": "MOA and AOA drafted for your business - not templated", "body": "Main objects, ancillary objects, and authorised capital tailored to your plans.", "comparisonWithout": "Generic template - Rs. 5,000-15,000 to amend later", "comparisonWithOllvy": "Custom drafting based on your business activities"},
    {"title": "PAN and TAN - automatic with incorporation", "body": "Both applied for within SPICe+. Issued within 24 hours of CIN.", "mockVisualType": "status", "mockVisualData": {"row1": "PAN: Applied automatically \u2713", "row2": "TAN: Applied automatically \u2713", "row3": "GST: Optional at incorporation", "note": "All issued with Certificate of Incorporation"}},
    {"title": "Compliance calendar populated from day one", "body": "First board meeting (30 days), auditor appointment (30 days), DIR-3 KYC (Sep 30 every year), AOC-4 and MGT-7 annually.", "mockVisualType": "calendar", "mockVisualData": {"row1": "First Board Meeting - within 30 days", "row2": "Auditor appointment - within 30 days", "row3": "DIR-3 KYC - Sep 30 annually", "note": "Added to your calendar automatically"}}
  ]'::jsonb,
  service_risks = '[
    {"icon": "document", "title": "Director documents don''t match", "body": "PAN name, Aadhaar name, and bank records must match exactly - ''Rajesh Kumar'' vs ''Rajesh K'' causes rejection.\nMismatch adds 5-7 working days while MCA raises queries.\nOllvy cross-checks all documents before filing."},
    {"icon": "clock", "title": "Company name rejected by MCA", "body": "MCA rejects names similar to existing companies or containing restricted words (Bank, Insurance, Exchange, National).\nRejection adds 3-5 working days.\nOllvy searches company registry and trademark database before filing."},
    {"icon": "building", "title": "Registered office address proof invalid", "body": "Utility bill must be less than 2 months old and match the application exactly.\nRenting: landlord NOC required. Home address: family member NOC if bill isn''t in director''s name.\nAddress rejection is the #1 cause of incorporation delays."}
  ]'::jsonb,
  profile_personas = '[
    {"label": "First company", "detail": "Never incorporated before. Ollvy CS explains every document, every government form, and every step."},
    {"label": "Converting from proprietorship", "detail": "Already running a business. Asset transfer and compliance transition handled."},
    {"label": "Co-founders in different cities", "detail": "DSC video verification done remotely. Shareholding split drafted into MOA."},
    {"label": "Raising investment soon", "detail": "Authorised capital set for your fundraise. Board structure planned for when investors come in."}
  ]'::jsonb,
  faqs = '[
    {"category": "General", "q": "How long does incorporation take?", "a": "15 working days. DSC: 2 days. Name approval (RUN): 2-3 days. SPICe+ filing and MCA processing: 7-10 days. Ollvy files within hours of documents being ready."},
    {"category": "General", "q": "Minimum capital required?", "a": "No legal minimum. Most founders start with Rs. 1 lakh authorised capital. Stamp duty depends on this amount and varies by state."},
    {"category": "Process", "q": "Can I be the only director?", "a": "Pvt Ltd requires minimum 2 directors and 2 shareholders. For single-person ownership, consider OPC instead."},
    {"category": "Process", "q": "What if my name is rejected?", "a": "Ollvy searches MCA registry and trademark database before filing. If still rejected, alternatives filed immediately at no extra cost."},
    {"category": "Documents", "q": "What documents do directors need?", "a": "PAN, Aadhaar, passport photo, Aadhaar-linked mobile (for OTP), address proof. Each director completes a 15-minute video verification for DSC."},
    {"category": "After Completion", "q": "Obligations after incorporation?", "a": "First board meeting within 30 days. Open current account. Appoint auditor within 30 days. DIR-3 KYC by Sep 30 every year. AOC-4 and MGT-7 annually. Ollvy''s compliance calendar tracks all of it."}
  ]'::jsonb
WHERE slug = 'pvt-ltd-incorporation';

-- =====================
-- 2. LLP INCORPORATION
-- =====================
UPDATE service_packages
SET
  tagline = 'Registered in 12 working days. LLP Agreement, Partner IDs, and PAN included.',
  short_description = 'LLP registered in 12 working days. Partner IDs, digital signatures, LLP Agreement drafted for your split, and PAN - all included.',
  workflow_stages = '[
    {"step": 1, "title": "Answer questions - we build your checklist", "timeline": "Day 0", "body": "Business type, number of partners, 3 LLP name options, state, and capital split.\nOllvy CS assigned within 4 hours.", "visual": "checklist", "milestone": "Ollvy CS assigned, checklist sent"},
    {"step": 2, "title": "Upload documents through the app", "timeline": "Day 0-1", "body": "PAN and Aadhaar for all partners, office address proof, and capital split details.\nOllvy verifies each document before filing.", "visual": "upload", "milestone": "Documents verified by Ollvy"},
    {"step": 3, "title": "DPIN and DSC arranged for all partners", "timeline": "Day 1-3", "body": "Each partner needs a Partner ID (DPIN) and digital signature (DSC) - both mandatory for FiLLiP.\nOllvy files all applications and guides each partner through a 15-minute video verification.\nDone remotely - partners don''t need to be in the same city.", "visual": "form", "milestone": "DPIN and DSC ready"},
    {"step": 4, "title": "FiLLiP filed - LLP Agreement and PAN in one submission", "timeline": "Day 4-9", "body": "One government form (FiLLiP) covers LLP registration, your LLP Agreement, and PAN.\nOllvy drafts the Agreement based on your actual profit split, capital contribution, and exit terms.\nGeneric 50-50 templates cause disputes when one partner wants out.", "visual": "form", "milestone": "FiLLiP submitted to MCA"},
    {"step": 5, "title": "Certificate of Incorporation issued", "timeline": "Day 10-12", "body": "Government issues your Certificate of Incorporation with LLPIN.\nPAN generated within 24 hours.\nAll documents in your Ollvy account. Compliance calendar shows Form 8 (Oct 30) and Form 11 (May 30).", "visual": "stamp", "isCompletion": true, "milestone": "LLP incorporated"}
  ]'::jsonb,
  whats_included = '[
    {"title": "LLP Agreement drafted - not templated", "body": "Profit-sharing, decision-making, capital contribution, and exit terms based on your arrangement.", "comparisonWithout": "Generic 50-50 template - partner disputes later", "comparisonWithOllvy": "Custom agreement reflecting your actual split and roles"},
    {"title": "DPIN for all partners - no separate application", "body": "Designated Partner Identification Number filed as part of FiLLiP.", "comparisonWithout": "Separate filing - adds 3-5 days", "comparisonWithOllvy": "DPIN filed with everything else - no extra time"},
    {"title": "DSC arranged - 15 min verification per partner", "body": "Digital signatures mandatory for all partners. Ollvy guides video verification.", "comparisonWithout": "Navigate DSC portals yourself - 3+ hours", "comparisonWithOllvy": "Guided flow in app - 15 minutes"},
    {"title": "Compliance calendar populated from day one", "body": "Form 11 (May 30), Form 8 (Oct 30), Partner KYC (Sep 30), and ITR deadline.", "mockVisualType": "calendar", "mockVisualData": {"row1": "Form 11 (Annual Return) - Due May 30", "row2": "Form 8 (Accounts) - Due Oct 30", "row3": "Partner KYC - Due Sep 30 every year", "note": "Added to your calendar automatically"}}
  ]'::jsonb,
  service_risks = '[
    {"icon": "document", "title": "Name similarity rejection", "body": "LLP names must be distinct from all existing LLPs and companies on the MCA registry.\nRejection adds 3-5 working days.\nOllvy searches both the LLP and company registries before filing."},
    {"icon": "alert", "title": "Capital contribution not defined clearly", "body": "The LLP Agreement must specify each partner''s capital contribution, profit share, and exit terms.\nVague agreements cause expensive disputes when a partner wants out.\nOllvy drafts explicit percentages and exit clauses."},
    {"icon": "clock", "title": "Partner slow on DSC verification", "body": "FiLLiP cannot be filed until every partner completes DSC video verification - one slow partner delays the entire filing.\nOllvy sends daily reminders. Takes 15 minutes per partner."}
  ]'::jsonb,
  profile_personas = '[
    {"label": "Professional services firm", "detail": "CA firms, law firms, architects, consultants - LLP gives limited liability without Pvt Ltd compliance burden."},
    {"label": "Two equal partners", "detail": "50-50 split. Agreement includes deadlock resolution and exit terms - critical when partners are equal."},
    {"label": "Unequal contribution", "detail": "Different capital contributions. Profit share can match or differ. Agreement drafted to reflect your arrangement."},
    {"label": "Converting from partnership", "detail": "Existing partnership firm converting to LLP for limited liability. Ollvy handles the transition."}
  ]'::jsonb,
  faqs = '[
    {"category": "General", "q": "What is an LLP?", "a": "Limited Liability Partnership - combines partnership flexibility with liability protection. Partners are not personally liable beyond their agreed contribution."},
    {"category": "General", "q": "LLP vs Pvt Ltd?", "a": "LLP for services businesses with 2-5 partners, no equity investment plans. Pvt Ltd for raising funding - investors need shares. LLP has 2 annual filings vs 8+ for Pvt Ltd."},
    {"category": "Process", "q": "Minimum partners?", "a": "Minimum 2 designated partners. No maximum. At least one must be a resident Indian."},
    {"category": "Documents", "q": "What documents do partners need?", "a": "PAN, Aadhaar (active mobile for OTP), passport photo, address proof. Each partner completes 15-minute DSC video verification."},
    {"category": "After Completion", "q": "Annual filing deadlines?", "a": "Form 11 (annual return) by May 30. Form 8 (accounts) by Oct 30. ITR by July 31 (or Oct 31 if audit required). All mandatory even with zero activity. Late: Rs. 100/day per form, no ceiling."}
  ]'::jsonb
WHERE slug = 'llp-incorporation';

-- =====================
-- 3. GST REGISTRATION
-- =====================
UPDATE service_packages
SET
  tagline = 'GSTIN in 7 working days. Application, officer queries, and compliance calendar included.',
  short_description = 'GST registration filed in 7 working days. Ollvy CA handles the 23-field REG-01 application, officer queries, and sets up your compliance calendar.',
  workflow_stages = '[
    {"step": 1, "title": "Answer 5 questions - we build your checklist", "timeline": "Day 0", "body": "Business type, state, turnover estimate, supply type, and whether you need voluntary registration.\nOllvy CA assigned within 4 hours.", "visual": "checklist", "milestone": "Ollvy CA assigned, checklist sent"},
    {"step": 2, "title": "Upload documents through the app", "timeline": "Day 0-1", "body": "Ollvy CA sends a personalised checklist - not the full 20-item government list.\nYou upload directly. Ollvy CA reviews every document before filing.", "visual": "upload", "milestone": "Documents verified by Ollvy CA"},
    {"step": 3, "title": "REG-01 filed - ARN in 24 hours", "timeline": "Day 1-2", "body": "Ollvy CA files REG-01 on the GST portal - all 23 fields across 5 tabs.\nApplication Reference Number (ARN) generated immediately and shared in the app.", "visual": "form", "milestone": "ARN generated - shared in app"},
    {"step": 4, "title": "Officer query handled by Ollvy CA", "timeline": "Day 3-5", "body": "GST officer asks for clarification in about 1 in 5 cases.\nOllvy CA responds within 24 hours.\nIncluded in the price - not a separate charge.", "visual": "form", "milestone": "Query responded"},
    {"step": 5, "title": "GSTIN issued", "timeline": "Day 5-7", "body": "Government issues your 15-digit GSTIN.\nPermanent - no renewal needed.\nOllvy compliance calendar updated with GSTR-1 (11th) and GSTR-3B (20th) deadlines.", "visual": "stamp", "isCompletion": true, "milestone": "GSTIN active"}
  ]'::jsonb,
  service_risks = '[
    {"icon": "document", "title": "Address proof mismatch", "body": "Business address on your electricity bill must match the application exactly - even flat number format matters.\nMismatch triggers an officer query that adds 3-5 days.\nOllvy CA cross-checks every address document before filing."},
    {"icon": "clock", "title": "Aadhaar OTP fails", "body": "GST registration requires Aadhaar OTP on your linked mobile number.\nIf the number is old or inactive, OTP fails and you cannot proceed - must be fixed at an Aadhaar centre first.\nOllvy verifies your Aadhaar-linked mobile before filing."},
    {"icon": "alert", "title": "Operating without registration", "body": "If turnover crossed Rs. 40 lakh (goods) or Rs. 20 lakh (services) without registration, you owe 100% of unpaid GST plus Rs. 10,000 minimum penalty.\nPenalty starts from the date you should have registered, not when you get caught."}
  ]'::jsonb,
  profile_personas = '[
    {"label": "First GST registration", "detail": "Never done this before. Ollvy CA explains each document and fills the entire 23-field REG-01 form."},
    {"label": "Turnover just crossed threshold", "detail": "Crossed Rs. 40 lakh (goods) or Rs. 20 lakh (services). Penalty accrues from the date you crossed - register quickly."},
    {"label": "Voluntary registration", "detail": "Below threshold but want to issue GST invoices so business clients can claim ITC. Completely legal."},
    {"label": "Home as principal place of business", "detail": "Fully legal. Ollvy CA verifies electricity bill and address proof match before filing."}
  ]'::jsonb,
  faqs = '[
    {"category": "General", "q": "When is GST registration required?", "a": "Mandatory above Rs. 40 lakh turnover for goods, Rs. 20 lakh for services (Rs. 10 lakh in NE/special category states). Required for any interstate sale regardless of turnover, and for all e-commerce sellers."},
    {"category": "General", "q": "Can I register voluntarily?", "a": "Yes. Lets you issue GST invoices and claim ITC on purchases. Useful if clients are businesses who need to claim credits on your invoices."},
    {"category": "Process", "q": "What is the ARN?", "a": "Application Reference Number - generated the moment Ollvy CA submits REG-01. Shared immediately. Track progress at gst.gov.in."},
    {"category": "Process", "q": "What if the officer raises a query?", "a": "Ollvy CA responds within 24 hours. Included in the price. Happens in about 1 in 5 cases. Most resolve in one reply."},
    {"category": "Documents", "q": "What documents do I need?", "a": "Depends on business type. Ollvy sends a personalised checklist based on your answers - not the full 20-item government list."},
    {"category": "After Completion", "q": "What returns after getting GSTIN?", "a": "GSTR-1 (sales) by the 11th, GSTR-3B (tax) by the 20th. Every month, even with zero transactions - missing a nil return costs Rs. 50/day. GSTR-9 (annual) by Dec 31."}
  ]'::jsonb
WHERE slug = 'gst-registration';

-- =====================
-- 4. GST MONTHLY FILING
-- =====================
UPDATE service_packages
SET
  tagline = 'GSTR-1 by the 11th. GSTR-3B by the 20th. Every month. Handled by Ollvy CA.',
  short_description = 'Monthly GST filing - GSTR-1, GSTR-3B, ITC reconciliation against GSTR-2B, and compliance report every month.',
  workflow_stages = '[
    {"step": 1, "title": "Share GST portal credentials", "timeline": "Day 0", "body": "You share read-only access.\nOllvy CA reviews your filing history and becomes your dedicated CA.", "visual": "checklist", "milestone": "Ollvy CA assigned to your account"},
    {"step": 2, "title": "Upload invoices and purchase data", "timeline": "By 8th of month", "body": "Upload sales invoices and purchase register by the 8th.\nTally, Zoho, or any accounting software - export takes 2 minutes.\nOllvy CA follows up if data is late.", "visual": "upload", "milestone": "Data received for the month"},
    {"step": 3, "title": "GSTR-1 filed by the 11th", "timeline": "9th-11th", "body": "Ollvy CA files GSTR-1 with every B2B invoice, consumer sales above Rs. 2.5 lakh, and export invoices.\nAcknowledgement shared in the app.", "visual": "form", "milestone": "GSTR-1 filed and acknowledged"},
    {"step": 4, "title": "GSTR-3B filed by the 20th", "timeline": "18th-20th", "body": "Ollvy CA prepares GSTR-3B, calculates tax after deducting eligible ITC, and files.\nITC verified against GSTR-2B before claiming - no blind claims.\nMismatches caught before filing, not after a notice.", "visual": "form", "milestone": "GSTR-3B filed and acknowledged"},
    {"step": 5, "title": "Monthly compliance report delivered", "timeline": "21st-25th", "body": "What was filed, when, acknowledgement numbers, ITC claimed, and tax paid.\nDelivered to your Ollvy account every month.", "visual": "checklist", "isCompletion": true, "milestone": "Monthly report delivered"}
  ]'::jsonb,
  service_risks = '[
    {"icon": "clock", "title": "Late filing: Rs. 50/day per return", "body": "GSTR-3B late fee is Rs. 50/day, capped at Rs. 10,000 per return (up to Rs. 5 crore turnover).\nPlus 18% per annum interest on unpaid tax from the due date.\nOne missed month blocks your next month''s filing."},
    {"icon": "document", "title": "GSTR-1 and GSTR-3B mismatch", "body": "If GSTR-1 and GSTR-3B figures don''t match, the government system flags it automatically.\nMismatches trigger notices 3-6 months later.\nOllvy CA reconciles both returns before filing."},
    {"icon": "alert", "title": "ITC claimed but vendor hasn''t filed", "body": "If your vendor hasn''t filed their GSTR-1, the ITC you claim gets blocked.\nShows up as a mismatch in GSTR-2B.\nOllvy CA checks the GSTR-2B statement every month before claiming."}
  ]'::jsonb,
  profile_personas = '[
    {"label": "First time outsourcing GST", "detail": "Your accountant was handling it. Now you want a dedicated Ollvy CA with guaranteed deadlines - 11th and 20th, every month."},
    {"label": "Multiple GSTINs", "detail": "Multiple states, multiple registrations. All handled under one retainer with one Ollvy CA."},
    {"label": "High transaction volume", "detail": "500+ invoices/month. Pricing based on turnover, not invoice count."},
    {"label": "Previous CA went quiet", "detail": "Your last CA stopped responding mid-month. Ollvy CA has a guaranteed timeline every month - no exceptions."}
  ]'::jsonb,
  faqs = '[
    {"category": "General", "q": "What does the monthly retainer cover?", "a": "GSTR-1 filed by the 11th, GSTR-3B filed by the 20th, ITC reconciliation against GSTR-2B, and a monthly compliance report."},
    {"category": "General", "q": "Can I cancel anytime?", "a": "Yes. No minimum term. Cancel before the 1st of any month."},
    {"category": "Process", "q": "What data do I provide each month?", "a": "Sales invoices and purchase register by the 8th. Tally/Zoho export takes 2 minutes."},
    {"category": "Pricing", "q": "Why do prices vary by turnover?", "a": "Higher turnover = more invoices and more ITC reconciliation work. Base price covers up to Rs. 50 lakh."}
  ]'::jsonb
WHERE slug = 'gst-monthly';

-- =====================
-- 5. BUSINESS ITR FILING
-- =====================
UPDATE service_packages
SET
  tagline = 'ITR-6 for Pvt Ltd. ITR-5 for LLP. Filed before October 31. Depreciation reviewed, draft approved.',
  short_description = 'Annual income tax return for Pvt Ltd (ITR-6) and LLP (ITR-5). Depreciation review, Form 26AS cross-check, draft approval, and ITR-V same day.',
  workflow_stages = '[
    {"step": 1, "title": "Upload your financials", "timeline": "Day 0-1", "body": "Profit & loss, balance sheet, trial balance, and full-year bank statements.\nOllvy CA assigned within 4 hours.\nForm 26AS (tax credit statement) pulled and cross-checked.", "visual": "upload", "milestone": "Documents received, Ollvy CA assigned"},
    {"step": 2, "title": "Ollvy CA reviews books and prepares computation", "timeline": "Day 1-4", "body": "Ollvy CA reviews P&L, verifies depreciation rates on every asset, checks director remuneration against Companies Act limits, and prepares income computation.\nForm 26AS cross-checked - mismatches resolved before filing.", "visual": "form", "milestone": "Draft computation shared"},
    {"step": 3, "title": "You review, approve, and Ollvy CA files", "timeline": "Day 4-7", "body": "Complete draft ITR shared in app - income, deductions, and final tax number.\nYou review and approve.\nOllvy CA files within 24 hours of approval.", "visual": "checklist", "milestone": "ITR submitted to Income Tax portal"},
    {"step": 4, "title": "ITR-V acknowledgement delivered", "timeline": "Day 7-10", "body": "Ollvy CA files within 24 hours of approval.\nITR-V acknowledgement generated immediately and shared same day.\nNext year''s deadline added to your compliance calendar.", "visual": "stamp", "isCompletion": true, "milestone": "ITR-V delivered"}
  ]'::jsonb,
  service_risks = '[
    {"icon": "clock", "title": "Late filing interest - Section 234A", "body": "File after October 31 with tax due = 1% per month interest from the original deadline.\nOn Rs. 5 lakh tax due, that''s Rs. 5,000 per month of delay.\nOllvy CA calculates exact interest before filing - no surprises."},
    {"icon": "document", "title": "Loss carry-forward permanently lost", "body": "If your business made a loss and you file after October 31, you permanently lose the right to carry it forward.\nA Rs. 20 lakh loss that could save Rs. 5 lakh in tax next year - gone.\nCannot be reversed. File on time."},
    {"icon": "alert", "title": "Defective return notice - Section 139(9)", "body": "Late filers are flagged for scrutiny.\nDefective return notice gives you 15 days to respond - miss it and the return is treated as never filed.\nOllvy CA files correctly the first time."}
  ]'::jsonb,
  profile_personas = '[
    {"label": "First year filing", "detail": "First ITR after incorporation. Ollvy CA walks through every document - what it is, why it''s needed, how to get it."},
    {"label": "Changed CA mid-year", "detail": "Previous CA left messy books. Ollvy CA reconciles and files correctly."},
    {"label": "Company made a loss", "detail": "Loss return filed before October 31 to preserve carry-forward rights. Miss the deadline and this benefit is gone permanently."},
    {"label": "Filing late", "detail": "Ollvy CA calculates exact Section 234A interest upfront - no surprises - then files immediately to stop it growing."}
  ]'::jsonb,
  faqs = '[
    {"category": "General", "q": "When is business ITR due?", "a": "October 31 for all Pvt Ltd companies (statutory audit mandatory, so extended deadline applies). July 31 for LLPs not requiring audit. October 31 for LLPs requiring audit."},
    {"category": "General", "q": "ITR-5 vs ITR-6?", "a": "ITR-6 for all companies (Pvt Ltd, Public Ltd, OPC). ITR-5 for LLPs and partnerships. Determined by entity type, not turnover. Ollvy picks the right form."},
    {"category": "Process", "q": "Documents needed?", "a": "Audited P&L, balance sheet, trial balance, full-year bank statements, Form 26AS, and depreciation schedule. Ollvy CA pulls Form 26AS and cross-checks."},
    {"category": "Process", "q": "Do I need an audit?", "a": "All Pvt Ltd companies need statutory audit regardless of turnover. LLPs above Rs. 40 lakh turnover or Rs. 25 lakh contribution. Tax audit (separate) above Rs. 1 crore turnover."}
  ]'::jsonb
WHERE slug = 'business-itr';

-- =====================
-- 6. TRADEMARK REGISTRATION
-- =====================
UPDATE service_packages
SET
  tagline = '10-year brand protection. Application filed in 7 days. Search and objection response included.',
  short_description = 'Trademark application filed in 7 days. Search, class guidance, filing, and Examiner objection response included. 10-year protection.',
  workflow_stages = '[
    {"step": 1, "title": "Tell us your brand name and class", "timeline": "Day 0", "body": "Ollvy trademark attorney assigned within 4 hours.\nPreliminary search of the Trademark Registry started immediately.\nYou provide the mark, classes to protect, and business details.", "visual": "checklist", "milestone": "Attorney assigned, search started"},
    {"step": 2, "title": "Trademark search report delivered", "timeline": "Day 1-2", "body": "Ollvy attorney searches the Registry for identical and similar marks in your classes.\nConflicts flagged before you spend the government fee.\nReport delivered: clear pass, modify, or risk assessment.", "visual": "form", "milestone": "Search report delivered"},
    {"step": 3, "title": "TM-A filed with Trademark Registry", "timeline": "Day 3-7", "body": "Ollvy attorney drafts the application, selects correct classes, and files TM-A.\nApplication number and filing receipt shared immediately.\nYour rights are protected from this filing date.", "visual": "form", "milestone": "Application filed, receipt received"},
    {"step": 4, "title": "Examination and publication", "timeline": "6-12 months", "body": "Trademark Registry examines your application. Takes 6-12 months.\nIf Examiner raises objections, Ollvy attorney responds - included in the price.\nOnce cleared, mark published in Trademark Journal for 4 months.", "visual": "calendar", "milestone": "Under examination"},
    {"step": 5, "title": "Registration certificate issued", "timeline": "12-18 months total", "body": "Registry issues registration certificate. 10-year protection, renewable indefinitely.\nCertificate stored in your Ollvy account.\nRenewal reminder set for 6 months before expiry.", "visual": "stamp", "isCompletion": true, "milestone": "Trademark registered"}
  ]'::jsonb,
  service_risks = '[
    {"icon": "document", "title": "Similar mark already registered", "body": "If a similar mark exists in your class, the Examiner will object or reject outright.\nOllvy''s pre-filing search catches most conflicts - but pending applications not yet published can''t be seen.\nIf rejected, Ollvy helps you appeal or modify at no extra cost."},
    {"icon": "clock", "title": "Government processing takes 12-18 months", "body": "Filing: 7 days (Ollvy side). Examination: 6-12 months. Publication: 4 months. Certificate: 1-2 months.\nYour rights are protected from the filing date, not the certificate date.\nOllvy tracks every stage and updates you."},
    {"icon": "alert", "title": "Opposition during publication", "body": "After examination, mark is published for 4 months. Any third party can oppose.\nHappens in under 5% of cases. Opposition response is a separate service.\nOllvy monitors the publication period and alerts you immediately."}
  ]'::jsonb,
  profile_personas = '[
    {"label": "First trademark", "detail": "Never registered before. Ollvy attorney explains classes, search, examination, and the full 12-18 month timeline."},
    {"label": "Logo + word mark", "detail": "Protect both. Two separate applications. Ollvy handles both - broader protection."},
    {"label": "Multiple classes", "detail": "Tech + retail + services. Each class is Rs. 4,500 additional govt fee. Ollvy recommends only the ones you need."},
    {"label": "Already using the name", "detail": "Using brand for years without registration. In India, rights go to whoever registers first - not whoever used it first."}
  ]'::jsonb,
  faqs = '[
    {"category": "General", "q": "What can I trademark?", "a": "Words, logos, slogans, sounds, colours. Most businesses trademark brand name and logo separately - two applications."},
    {"category": "General", "q": "How long does protection last?", "a": "10 years from filing, renewable indefinitely. Renewal: Rs. 9,000/class (small entities) or Rs. 10,000 (others)."},
    {"category": "Process", "q": "Why 12-18 months?", "a": "Filing: 7 days. Examination: 6-12 months. Publication: 4 months. Certificate: 1-2 months. Rights protected from filing date."},
    {"category": "Process", "q": "Can I use ® after filing?", "a": "No. ® only after registration. Use TM (goods) or SM (services) until then. Using ® before registration is an offence."},
    {"category": "Documents", "q": "Documents needed?", "a": "PAN, Aadhaar, address proof, logo file (JPG, 8cm x 8cm min, black on white). Companies: COI and board resolution. Reduced fee: MSME or DPIIT certificate."}
  ]'::jsonb
WHERE slug = 'trademark-registration';

-- =====================
-- 7. MCA ANNUAL FILING
-- =====================
UPDATE service_packages
SET
  tagline = 'AOC-4 and MGT-7 filed every year. Rs. 100/day penalty stopped the moment Ollvy CS files.',
  short_description = 'AOC-4 (financial statements) and MGT-7 (annual return) filed with MCA. Both forms, one price, one Ollvy CS.',
  workflow_stages = '[
    {"step": 1, "title": "Share company details", "timeline": "Day 0", "body": "Company CIN, financial year, AGM date, and audit status.\nOllvy CS assigned within 4 hours.", "visual": "checklist", "milestone": "Ollvy CS assigned"},
    {"step": 2, "title": "Upload financial statements", "timeline": "Day 0-2", "body": "Audited balance sheet, P&L, director report, auditor report, and shareholder list.\nOllvy CS reviews everything before drafting.", "visual": "upload", "milestone": "Documents reviewed by Ollvy CS"},
    {"step": 3, "title": "AOC-4 and MGT-7 drafted", "timeline": "Day 2-4", "body": "Ollvy CS drafts AOC-4 (audited financial statements) and MGT-7 (shareholding, director details, annual return).\nYou review and approve in the app.\nNothing filed without your approval.", "visual": "form", "milestone": "Draft forms approved"},
    {"step": 4, "title": "Filed on MCA21 - SRN generated", "timeline": "Day 5-7", "body": "Ollvy CS files both forms on MCA21.\nService Request Numbers (SRNs) shared immediately as proof.\nPenalty stops accruing the moment forms are accepted.", "visual": "stamp", "isCompletion": true, "milestone": "AOC-4 and MGT-7 filed"}
  ]'::jsonb,
  service_risks = '[
    {"icon": "clock", "title": "AGM not held on time", "body": "AGM must be held by September 30 (March year-end companies).\nAOC-4 due within 30 days of AGM. MGT-7 within 60 days.\nIf AGM delayed, both deadlines shift - Ollvy CS calculates new dates."},
    {"icon": "document", "title": "Audit not complete", "body": "AOC-4 requires signed, audited financial statements - cannot file without them.\nPlan your audit timeline to allow filing before the MCA deadline.\nOllvy CS coordinates timing with your auditor if needed."},
    {"icon": "alert", "title": "Late fee: Rs. 200/day, no ceiling", "body": "Additional fee: Rs. 100/day per form from due date. Both overdue = Rs. 200/day.\n6 months default = Rs. 36,000 in penalties alone.\nAfter 3 years, directors disqualified under Section 164(2). Company can be struck off after 2 years."}
  ]'::jsonb,
  profile_personas = '[
    {"label": "First MCA filing", "detail": "First filing after incorporation. Ollvy CS explains every field in AOC-4 and MGT-7."},
    {"label": "Running late", "detail": "Already in default. Ollvy CS calculates exact additional fee (Rs. 100/day per form) and files immediately."},
    {"label": "Director changes", "detail": "Appointments and resignations captured in MGT-7 with exact dates."},
    {"label": "Share transfer", "detail": "Shareholding changes captured in MGT-7 - transferor, transferee, date, consideration."}
  ]'::jsonb,
  faqs = '[
    {"category": "General", "q": "What is MCA annual filing?", "a": "Two mandatory ROC forms: AOC-4 (audited financials, due 30 days after AGM) and MGT-7 (annual return with shareholding and directors, due 60 days after AGM)."},
    {"category": "General", "q": "When is it due?", "a": "AOC-4: 30 days after AGM (typically Oct 30 for Sep 30 AGM). MGT-7: 60 days (typically Nov 29). AGM by September 30 for March year-end companies."},
    {"category": "General", "q": "Penalty?", "a": "Rs. 100/day per form. Both overdue = Rs. 200/day. No ceiling. 3 years of default = director disqualification under Section 164(2). 2 consecutive years = company can be struck off."},
    {"category": "Process", "q": "Can I file without audit?", "a": "No. AOC-4 requires audited financials. Ollvy CS coordinates with your auditor on timing."},
    {"category": "Documents", "q": "Documents needed?", "a": "Audited balance sheet, P&L, notes to accounts, director report, auditor report, AGM date, and updated shareholder register."}
  ]'::jsonb
WHERE slug = 'mca-annual-filing';

-- =====================
-- 8. TDS MONTHLY COMPLIANCE
-- =====================
UPDATE service_packages
SET
  tagline = 'TDS deposited by the 7th. 24Q and 26Q filed. Form 16 generated. Every month, on time.',
  short_description = 'Monthly TDS - challan preparation, deposit by the 7th, quarterly returns (24Q/26Q), and Form 16/16A generation.',
  workflow_stages = '[
    {"step": 1, "title": "Share payment register", "timeline": "Day 1-5", "body": "Upload salary, vendor, rent, and contractor payments.\nOllvy CA reviews TDS rates - 192 for salary, 194C for contractors, 194J for professionals, 194I for rent.\nWrong rate = you''re liable for the shortfall plus interest.", "visual": "upload", "milestone": "Data received"},
    {"step": 2, "title": "TDS calculated, challans prepared", "timeline": "Day 5-6", "body": "Ollvy CA calculates TDS for each category.\nChallans prepared with correct BSR code, assessment year, and minor head.\nWrong details cause Form 26AS mismatches for your vendors.", "visual": "form", "milestone": "Challans ready"},
    {"step": 3, "title": "Challans paid by the 7th", "timeline": "Day 6-7", "body": "You pay through net banking.\nChallan Identification Number (CIN) uploaded to your Ollvy account.\nMarch TDS deadline is April 30 - different from every other month.", "visual": "stamp", "milestone": "TDS deposited"},
    {"step": 4, "title": "24Q and 26Q filed quarterly", "timeline": "Quarter end", "body": "Ollvy CA files Form 24Q (salary TDS) and Form 26Q (non-salary TDS).\nReturns reconciled with challans before filing.\nForm 16 (employees) and Form 16A (vendors) generated after filing.", "visual": "form", "isCompletion": true, "milestone": "TDS return filed"}
  ]'::jsonb,
  service_risks = '[
    {"icon": "clock", "title": "Late deposit - interest from deduction date", "body": "TDS due by 7th of following month. 1.5%/month interest from date of deduction (Section 201(1A)).\nMarch deadline is April 30.\nOllvy CA prepares challans before the 7th every month."},
    {"icon": "document", "title": "Wrong rate - expense disallowed", "body": "Under-deduction: you''re liable for shortfall plus interest. The expense is disallowed under Section 40(a)(ia) - you pay income tax on money you already spent.\nOllvy CA applies current rates for each section."},
    {"icon": "alert", "title": "Missing PAN - 20% TDS", "body": "If vendor/contractor doesn''t provide PAN, TDS must be deducted at 20% (Section 206AA).\nOllvy CA flags missing PANs during data review."}
  ]'::jsonb,
  profile_personas = '[
    {"label": "First time deducting TDS", "detail": "Ollvy CA explains which payments need deduction, at what rate, and when to deposit. Monthly hand-holding."},
    {"label": "Have employees", "detail": "24Q filed quarterly. Form 16 generated for every employee - they need it to file their own ITR."},
    {"label": "Paying contractors", "detail": "194C and 194J - the two most commonly missed sections. Form 26Q filed. Form 16A generated for vendors."}
  ]'::jsonb,
  faqs = '[
    {"category": "General", "q": "Who needs to deduct TDS?", "a": "Any business paying salary (192), rent above Rs. 2.4 lakh/year (194I), contractor payments above Rs. 30,000/contract (194C), or professional fees above Rs. 30,000/year (194J). Skip the deduction and the entire expense is disallowed."},
    {"category": "Process", "q": "Deposit due date?", "a": "7th of following month. March: April 30. Late deposit: 1.5%/month interest from deduction date. Plus Rs. 200/day for late quarterly return."},
    {"category": "General", "q": "What is Form 16?", "a": "TDS certificate for employees. Shows salary and tax deducted. Employees need it to file their ITR. Generated after Q4 return is filed. Ollvy CA handles generation for all employees."},
    {"category": "General", "q": "What is Form 16A?", "a": "TDS certificate for non-salary payments - contractors, professionals, rent. Issued to vendors after each quarterly return. Vendors use it to claim TDS credit in their own return."}
  ]'::jsonb
WHERE slug = 'tds-monthly-compliance';

-- =====================
-- 9. MSME / UDYAM REGISTRATION
-- =====================
UPDATE service_packages
SET
  tagline = 'Free government registration. CGTMSE loans up to Rs. 10 crore. 45-day payment protection.',
  short_description = 'Udyam Registration in 2 working days. Unlocks CGTMSE collateral-free loans, 45-day payment protection (MSMED Act), and GeM tender access.',
  workflow_stages = '[
    {"step": 1, "title": "Share Aadhaar and PAN", "timeline": "Day 0", "body": "Owner Aadhaar for OTP, business PAN, and GSTIN if registered.\nOllvy confirms your classification (Micro/Small/Medium) based on investment and turnover.\nCorrect NIC code selected - wrong code invalidates benefits.", "visual": "upload", "milestone": "Details received"},
    {"step": 2, "title": "Application filed on Udyam portal", "timeline": "Day 1", "body": "Filed on official Udyam portal with investment and turnover details.\nGSTIN linked automatically.", "visual": "form", "milestone": "Application submitted"},
    {"step": 3, "title": "Udyam certificate with URN issued", "timeline": "Day 1-2", "body": "Certificate with Udyam Registration Number (URN) generated.\nClassification confirmed: Micro, Small, or Medium.\nValid permanently - no renewal.", "visual": "stamp", "isCompletion": true, "milestone": "MSME registered"}
  ]'::jsonb,
  service_risks = '[
    {"icon": "document", "title": "Wrong NIC code invalidates benefits", "body": "The NIC (industry) code determines which MSME schemes apply to your business.\nWrong code = scheme applications rejected silently.\nOllvy selects the correct NIC code based on your actual business activity."},
    {"icon": "alert", "title": "Self-declaration accuracy", "body": "Investment and turnover are self-declared.\nThe Udyam portal syncs with your ITR data annually and may auto-reclassify you.\nKeep supporting records (ITR, asset register) in case of verification."}
  ]'::jsonb,
  profile_personas = '[
    {"label": "Bank loan applicant", "detail": "CGTMSE collateral-free loans up to Rs. 10 crore require Udyam certificate. Priority sector lending with lower interest rates."},
    {"label": "GeM seller", "detail": "25% of government procurement on GeM is reserved for MSMEs. Udyam registration required for seller benefits."},
    {"label": "Supplying to large corporates", "detail": "MSMED Act Section 15: buyers must pay within 45 days. Delay triggers compound interest at 3x bank rate. Enforce through MSME Samadhaan portal."}
  ]'::jsonb,
  faqs = '[
    {"category": "General", "q": "MSME benefits?", "a": "CGTMSE collateral-free loans up to Rs. 10 crore. Priority sector lending. 45-day payment protection (MSMED Act Section 15). 25% GeM procurement reservation. State subsidies."},
    {"category": "Process", "q": "Is registration free?", "a": "Zero government fee on the Udyam portal. Ollvy fee covers filing assistance, correct NIC code selection, and certificate delivery."},
    {"category": "General", "q": "What is CGTMSE?", "a": "Credit Guarantee Fund Trust for Micro and Small Enterprises. Lets registered MSMEs get bank loans up to Rs. 10 crore without pledging assets as collateral."},
    {"category": "General", "q": "45-day payment rule?", "a": "MSMED Act Section 15: buyers must pay MSME suppliers within 45 days (15 days without written agreement). Delay triggers compound interest at 3x bank rate. File complaint on MSME Samadhaan portal."}
  ]'::jsonb
WHERE slug = 'msme-registration';

-- =====================
-- 10. GST CANCELLATION
-- =====================
UPDATE service_packages
SET
  tagline = 'Close your GSTIN properly. GSTR-10 filed, ITC reversed, no liabilities left behind.',
  short_description = 'Voluntary GST cancellation - REG-16 (application) and GSTR-10 (final return with ITC reversal). Clean closure in 15 working days.',
  workflow_stages = '[
    {"step": 1, "title": "ITC and liability review", "timeline": "Day 0-2", "body": "Ollvy CA reviews your ITC balance in the electronic credit ledger and pending liabilities.\nITC on closing stock must be reversed - exact amount calculated.\nAll pending GSTR-1 and GSTR-3B identified.", "visual": "checklist", "milestone": "Liability position confirmed"},
    {"step": 2, "title": "GSTR-10 prepared", "timeline": "Day 2-5", "body": "GSTR-10 (final return) prepared with closing stock details and ITC reversal calculation.\nCross-checked against credit ledger to ensure no demand after closure.", "visual": "form", "milestone": "GSTR-10 ready"},
    {"step": 3, "title": "REG-16 and GSTR-10 filed", "timeline": "Day 5-10", "body": "REG-16 (cancellation application) and GSTR-10 filed simultaneously by Ollvy CA.\nAll pending GSTR-1 and GSTR-3B must be cleared first.", "visual": "form", "milestone": "Cancellation filed"},
    {"step": 4, "title": "Cancellation order received", "timeline": "Day 10-15", "body": "GST officer reviews and issues cancellation order.\nGSTIN marked as cancelled on the portal.", "visual": "stamp", "isCompletion": true, "milestone": "GSTIN cancelled"}
  ]'::jsonb,
  service_risks = '[
    {"icon": "document", "title": "ITC reversal mandatory", "body": "ITC claimed on goods still in stock must be reversed and paid back.\nThe department checks GSTR-10 against your electronic credit ledger.\nWrong reversal amount = demand notice plus 18% interest.\nOllvy CA calculates exact ITC reversal before filing."},
    {"icon": "clock", "title": "Pending returns block cancellation", "body": "Every outstanding GSTR-1 and GSTR-3B must be filed before REG-16 is accepted.\nEach pending return has late fees: Rs. 50/day (Rs. 20/day for nil).\nOllvy CA files all pending returns first."},
    {"icon": "alert", "title": "Liability continues until GSTR-10 accepted", "body": "Your GST filing obligations continue until GSTR-10 is accepted by the officer.\nDelaying cancellation means continuing to file monthly returns - even nil ones."}
  ]'::jsonb,
  profile_personas = '[
    {"label": "Closing business", "detail": "Winding down. Ollvy CA clears all pending returns, calculates ITC reversal, files GSTR-10 and REG-16, obtains cancellation order."},
    {"label": "Below threshold", "detail": "Turnover dropped below Rs. 40 lakh (goods) or Rs. 20 lakh (services). Voluntary cancellation stops unnecessary monthly filing."},
    {"label": "Switching to composition", "detail": "Cancelling regular registration before applying as composition dealer. ITC reversal required on transition."}
  ]'::jsonb,
  faqs = '[
    {"category": "General", "q": "What happens to my ITC?", "a": "ITC on closing stock must be reversed in GSTR-10 and paid back. If your electronic cash ledger has a balance, it can be claimed as refund. Ollvy CA calculates both before filing."},
    {"category": "Process", "q": "Can I re-register later?", "a": "Yes. Voluntary cancellation (REG-16) does not prevent re-registration. Fresh application anytime if turnover crosses threshold again."},
    {"category": "General", "q": "Voluntary vs suo-moto cancellation?", "a": "Voluntary (REG-16): you apply to close cleanly. Suo-moto: department cancels for 6+ months of non-filing. Suo-moto leaves penalties, arrears, and a harder restoration process."},
    {"category": "Process", "q": "Pending returns?", "a": "All outstanding GSTR-1 and GSTR-3B must be filed first. Each has late fees. Ollvy CA files them before submitting REG-16."}
  ]'::jsonb
WHERE slug = 'gst-cancellation';

-- =====================
-- 11. GST REVOCATION
-- =====================
UPDATE service_packages
SET
  tagline = 'GSTIN cancelled by the department? Ollvy CA restores it. 30-day window.',
  short_description = 'Restore a suo-moto GST cancellation. All pending GSTR-1 and GSTR-3B filed, REG-21 submitted, GSTIN restored.',
  workflow_stages = '[
    {"step": 1, "title": "Review cancellation order", "timeline": "Day 0-1", "body": "Reason and date of suo-moto cancellation confirmed.\n30-day revocation window calculated.\nOutstanding GSTR-1 and GSTR-3B returns identified.", "visual": "checklist", "milestone": "Cancellation order reviewed"},
    {"step": 2, "title": "File all pending GSTR-1 and GSTR-3B", "timeline": "Day 1-5", "body": "All outstanding returns filed by Ollvy CA.\nLate fees: Rs. 50/day per return (Rs. 20 for nil), capped at Rs. 10,000.\nInterest on unpaid tax calculated and paid.", "visual": "form", "milestone": "Pending returns cleared"},
    {"step": 3, "title": "REG-21 filed", "timeline": "Day 5-7", "body": "Revocation application (REG-21) submitted with explanation and proof that all returns are current.\nMust be filed within 30 days of cancellation order.", "visual": "form", "milestone": "REG-21 filed"},
    {"step": 4, "title": "GSTIN restored", "timeline": "Day 7-10", "body": "Officer reviews and restores registration.\nGSTIN active again - invoicing and ITC claims resume.", "visual": "stamp", "isCompletion": true, "milestone": "GSTIN active"}
  ]'::jsonb,
  service_risks = '[
    {"icon": "clock", "title": "30-day window - no second chance", "body": "REG-21 must be filed within 30 days of cancellation order.\nMiss it and you must appeal to the Appellate Authority - longer, more expensive, requires specific grounds.\nOllvy CA treats every revocation as urgent from day one."},
    {"icon": "document", "title": "All pending returns must be cleared first", "body": "Department will not process REG-21 until every GSTR-1 and GSTR-3B is filed and tax with interest paid.\n6 months of missed returns = significant late fees.\nOllvy CA files all pending returns before submitting REG-21."},
    {"icon": "alert", "title": "Cannot invoice until restored", "body": "Your GSTIN is invalid until restored. Invoices raised on a cancelled GSTIN cannot be used by clients to claim ITC.\nLegal exposure for issuing invoices on cancelled registration."}
  ]'::jsonb,
  profile_personas = '[
    {"label": "GST cancelled for non-filing", "detail": "Missed returns for 6+ months, GSTIN cancelled suo-moto. Ollvy CA clears all returns and files REG-21 before the 30-day window closes."},
    {"label": "Need to invoice clients urgently", "detail": "GSTIN required for ongoing business. Ollvy CA treats this as urgent from day one - every day without GSTIN costs revenue."}
  ]'::jsonb,
  faqs = '[
    {"category": "General", "q": "Why was my GST cancelled?", "a": "Suo-moto cancellation is triggered after 6+ consecutive months of not filing GSTR-3B. Department issues notice, show-cause, then cancellation order."},
    {"category": "Urgency", "q": "Time limit?", "a": "30 days from cancellation order for REG-21. Extensions possible but not guaranteed. Apply immediately."},
    {"category": "Process", "q": "Can I invoice while revocation is pending?", "a": "No. GSTIN is invalid until restored. Invoices on cancelled registration cannot be used by clients to claim ITC."},
    {"category": "Process", "q": "Cost of pending returns?", "a": "Rs. 50/day per return (Rs. 20 for nil), capped at Rs. 10,000 each. Plus 18% per annum interest on unpaid tax. Ollvy CA calculates total before you commit."}
  ]'::jsonb
WHERE slug = 'gst-revocation';

-- =====================
-- 12. DIN REACTIVATION
-- =====================
UPDATE service_packages
SET
  tagline = 'DIN deactivated? All pending DIR-3 KYC filed. DIN active in 10 working days.',
  short_description = 'Reactivate deactivated DIN. All pending DIR-3 KYC filed (Rs. 5,000/year late fee), DIR-3C submitted, all directorships unblocked.',
  workflow_stages = '[
    {"step": 1, "title": "Check DIN status on MCA21", "timeline": "Day 0-1", "body": "DIN status verified on MCA portal.\nYears of outstanding DIR-3 KYC identified.\nTotal late fee calculated: Rs. 5,000 per missed year.", "visual": "checklist", "milestone": "Outstanding years confirmed"},
    {"step": 2, "title": "File all pending DIR-3 KYC", "timeline": "Day 1-5", "body": "DIR-3 KYC filed for each outstanding year by Ollvy CS.\nAadhaar OTP required for each year''s filing.\nRs. 5,000 government late fee per year.", "visual": "form", "milestone": "All KYC filings cleared"},
    {"step": 3, "title": "DIR-3C reactivation application", "timeline": "Day 5-7", "body": "Reactivation form (DIR-3C) filed with MCA.\nIncludes all cleared KYC references.", "visual": "form", "milestone": "DIR-3C submitted"},
    {"step": 4, "title": "DIN reactivated", "timeline": "Day 7-10", "body": "DIN status changed to Active on MCA21.\nAll directorial signing authority and MCA filing access restored.\nEvery company where you are a director is unblocked.", "visual": "stamp", "isCompletion": true, "milestone": "DIN active"}
  ]'::jsonb,
  service_risks = '[
    {"icon": "document", "title": "All companies blocked", "body": "A deactivated DIN blocks MCA filing for every company where you are a director.\nAOC-4, MGT-7, and all other forms cannot be signed or filed.\nRs. 100/day penalties accrue on those companies too."},
    {"icon": "clock", "title": "Rs. 5,000 per year - non-negotiable", "body": "Government late fee of Rs. 5,000 per missed year of DIR-3 KYC.\n3 years missed = Rs. 15,000. Cannot be reduced or waived."},
    {"icon": "alert", "title": "Aadhaar-linked mobile must be active", "body": "DIR-3 KYC requires Aadhaar OTP for each year''s filing.\nIf mobile linked to Aadhaar is inactive, update at an Aadhaar centre first.\nOllvy CS checks this before starting."}
  ]'::jsonb,
  profile_personas = '[
    {"label": "Missed DIR-3 KYC", "detail": "DIN deactivated on Oct 1 after missing Sep 30 deadline. Ollvy CS files all pending KYC and reactivates."},
    {"label": "Director in multiple companies", "detail": "One DIN reactivation unblocks every company. Ollvy CS verifies MCA status of all companies is restored."}
  ]'::jsonb,
  faqs = '[
    {"category": "General", "q": "Why was my DIN deactivated?", "a": "DINs deactivate automatically on October 1 when DIR-3 KYC is not filed by September 30. Automated MCA process - no notice sent."},
    {"category": "General", "q": "Late fee?", "a": "Rs. 5,000 per financial year of missed KYC. Fixed government fee, cannot be waived. 2 years = Rs. 10,000. 3 years = Rs. 15,000."},
    {"category": "Process", "q": "How long?", "a": "10 working days from when Ollvy CS receives documents and completes Aadhaar OTP verifications."},
    {"category": "Process", "q": "Does it fix all companies?", "a": "Yes. DIN is a single identifier across all directorships. Reactivating it restores signing authority and filing access everywhere."},
    {"category": "Process", "q": "Can I prevent this?", "a": "File DIR-3 KYC by Sep 30 every year. Takes 15 minutes. If mobile and email verified on MCA, use DIR-3 KYC-Web - 2 minutes, no fee."}
  ]'::jsonb
WHERE slug = 'din-reactivation';

-- =====================
-- 13. COMPANY NAME CHANGE
-- =====================
UPDATE service_packages
SET
  tagline = 'New name. Same CIN, PAN, TAN. New Certificate of Incorporation in 20 working days.',
  short_description = 'Company name change with MCA - special resolution, RUN filing, INC-24, MOA amendment, and new Certificate of Incorporation.',
  workflow_stages = '[
    {"step": 1, "title": "Name availability check", "timeline": "Day 0-2", "body": "Ollvy CS searches MCA company registry and trademark database.\nConflicts identified before any filing or fee.", "visual": "checklist", "milestone": "Name confirmed available"},
    {"step": 2, "title": "Special resolution and EGM", "timeline": "Day 2-7", "body": "Special resolution requires 75% shareholder approval.\nOllvy CS drafts board resolution, EGM notice, and special resolution.\n21 days notice required unless shorter notice consented.", "visual": "form", "milestone": "Special resolution passed"},
    {"step": 3, "title": "RUN filed - name reserved", "timeline": "Day 7-12", "body": "Reserve Unique Name (RUN) application filed with MCA by Ollvy CS.\nName reservation valid for 60 days from approval.", "visual": "form", "milestone": "Name reserved"},
    {"step": 4, "title": "INC-24 filed with amended MOA", "timeline": "Day 12-18", "body": "INC-24 (name change application) filed with amended Memorandum of Association.\nClause I (name clause) updated with new name.\nStamp duty varies by state.", "visual": "form", "milestone": "INC-24 submitted to MCA"},
    {"step": 5, "title": "New Certificate of Incorporation issued", "timeline": "Day 18-20", "body": "MCA issues fresh Certificate of Incorporation with new name.\nCIN, PAN, and TAN remain unchanged.\nOld certificate surrendered.", "visual": "stamp", "isCompletion": true, "milestone": "Name change complete"}
  ]'::jsonb,
  service_risks = '[
    {"icon": "document", "title": "Downstream updates required", "body": "MCA name change does not cascade to GST (core amendment needed), bank accounts, trademark, IEC, or FSSAI.\nEach requires a separate update process.\nOllvy provides a post-change checklist."},
    {"icon": "clock", "title": "Trademark conflict", "body": "If someone has a registered trademark on the new name, MCA may reject or you may receive a legal notice post-change.\nOllvy searches the trademark database before filing RUN."},
    {"icon": "alert", "title": "Stamp duty varies by state", "body": "Amended MOA must be printed on stamp paper. Stamp duty varies significantly by state.\nOllvy calculates the exact amount for your state before you pay."}
  ]'::jsonb,
  profile_personas = '[
    {"label": "Rebranding", "detail": "New brand identity. Legal name aligned across all MCA records. Ollvy CS handles RUN, INC-24, and MOA amendment."},
    {"label": "Business pivot", "detail": "Core business changed. Existing name no longer reflects what the company does."},
    {"label": "Name conflict", "detail": "Similar name causing confusion with another company. Change to a clearly distinct name."}
  ]'::jsonb,
  faqs = '[
    {"category": "General", "q": "How long?", "a": "20 working days from start to new Certificate of Incorporation, subject to MCA processing."},
    {"category": "General", "q": "Does PAN/GST change?", "a": "PAN, TAN, and CIN remain the same. GST requires a core amendment (name update on GSTN portal) - separate but straightforward. Bank, trademark, and other registrations updated separately."},
    {"category": "Process", "q": "Special resolution needed?", "a": "Yes. 75% shareholder approval at an EGM or via postal ballot. Ollvy CS drafts all resolutions and notices."},
    {"category": "Process", "q": "Can I choose any name?", "a": "Subject to MCA availability. Must be distinct from all existing companies/LLPs, no restricted words (Bank, Insurance, Exchange). Ollvy searches registry and trademark database first."},
    {"category": "Documents", "q": "Documents needed?", "a": "Board resolution, EGM notice, special resolution (75%+ majority), amended MOA on stamp paper, RUN approval, and existing Certificate of Incorporation."}
  ]'::jsonb
WHERE slug = 'company-name-change';

-- =====================
-- 14. CLOUD KITCHEN SETUP
-- =====================
UPDATE service_packages
SET
  tagline = 'FSSAI + GST + trade licence. All three licences a delivery kitchen needs, handled together.',
  short_description = 'Complete cloud kitchen licensing - FSSAI (Basic/State/Central), GST registration, and local trade licence. Swiggy and Zomato require FSSAI before onboarding.',
  workflow_stages = '[
    {"step": 1, "title": "Business details and kitchen address", "timeline": "Day 0", "body": "Turnover, kitchen area, menu category, GST status, city.\nOllvy determines correct FSSAI type (Basic/State/Central) and local authority requirements.\nWrong FSSAI type = rejected by delivery platforms.", "visual": "checklist", "milestone": "Licence types confirmed, expert assigned"},
    {"step": 2, "title": "Upload documents through the app", "timeline": "Day 0-2", "body": "Business registration proof, kitchen layout plan, food safety plan, equipment list, address proof, owner ID.\nState/Central FSSAI needs layout plan to scale.", "visual": "upload", "milestone": "Documents verified"},
    {"step": 3, "title": "FSSAI, GST, and trade licence filed in parallel", "timeline": "Day 2-7", "body": "FSSAI Form B filed on FSSAI portal. GST REG-01 filed simultaneously if not registered.\nLocal trade licence application filed with municipal authority (MCD/BMC/BBMP depending on city).\nARNs shared same day.", "visual": "form", "milestone": "All applications submitted"},
    {"step": 4, "title": "FSSAI inspection coordinated", "timeline": "Day 7-14", "body": "State and Central FSSAI licences require physical inspection.\nOllvy provides pre-inspection checklist: pest control certificate, water test report, equipment hygiene labels, food safety plan.\nFailed inspection = restart.", "visual": "form", "milestone": "Inspection completed"},
    {"step": 5, "title": "All licences issued", "timeline": "Day 10-21", "body": "FSSAI licence number, GSTIN, and trade licence received.\nAll uploaded to your Ollvy account.\nReady to list on Swiggy, Zomato, and all delivery platforms.", "visual": "stamp", "isCompletion": true, "milestone": "Kitchen ready to list"}
  ]'::jsonb,
  service_risks = '[
    {"icon": "document", "title": "FSSAI inspection failure", "body": "State/Central licences require physical inspection.\nCommon failures: no pest control certificate, missing water test, equipment without hygiene labels.\nOllvy''s pre-inspection checklist covers all standard failure points."},
    {"icon": "clock", "title": "Wrong FSSAI licence type", "body": "Basic Registration (under Rs. 12 lakh turnover) when you need State Licence gets rejected by Swiggy and Zomato.\nOllvy verifies turnover and operation type before filing.\nUpgrading later means restarting the process."},
    {"icon": "alert", "title": "Operating without FSSAI", "body": "FSSAI penalty for no licence: up to Rs. 5 lakh under Food Safety Act.\nFood safety officers can seal premises and seize stock without court order.\nSwiggy/Zomato suspend accounts with expired or invalid FSSAI."}
  ]'::jsonb,
  profile_personas = '[
    {"label": "New cloud kitchen", "detail": "Starting from scratch. All three licences handled together - FSSAI, GST, and trade licence."},
    {"label": "Home baker scaling up", "detail": "Moving from home to commercial kitchen. State FSSAI Licence now required (Basic won''t work)."},
    {"label": "Already have GST", "detail": "Partial bundle. FSSAI and trade licence only."},
    {"label": "Multi-city expansion", "detail": "New kitchen in a new city. Fresh local licences required. Ollvy handles city-specific requirements (MCD, BMC, BBMP)."}
  ]'::jsonb,
  faqs = '[
    {"category": "General", "q": "Do I need FSSAI?", "a": "Yes. All food businesses need FSSAI. Below Rs. 12 lakh: Basic Registration (no inspection, Rs. 100/year). Above Rs. 12 lakh: State Licence (inspection required, Rs. 2,000-7,500/year). No exemption for home-based."},
    {"category": "General", "q": "Can I list without FSSAI?", "a": "No. Swiggy, Zomato, and all platforms require valid FSSAI licence number at onboarding. They periodically verify and suspend expired licences."},
    {"category": "Process", "q": "What does FSSAI inspect?", "a": "Pest control certificate, water quality test, equipment hygiene labels, food safety plan, storage conditions, kitchen cleanliness, waste disposal. Ollvy provides a pre-inspection checklist."},
    {"category": "General", "q": "Is GST mandatory?", "a": "Mandatory above Rs. 20 lakh turnover (services threshold). Voluntary registration recommended to claim ITC on kitchen equipment, packaging, and supplies."},
    {"category": "General", "q": "Multiple brands from one kitchen?", "a": "Yes. Multiple virtual restaurants can operate from one kitchen under a single FSSAI licence."}
  ]'::jsonb
WHERE slug = 'cloud-kitchen-setup';

-- =====================
-- 15. IEPF CONSULTATION
-- =====================
UPDATE service_packages
SET
  tagline = 'Old shares or unclaimed dividends in IEPF? Find out what is yours and exactly how to claim it back.',
  short_description = 'Expert checks IEPF database for your shares and dividends. 45-minute consultation call. Written action plan with personalised IEPF-5 document checklist.',
  workflow_stages = '[
    {"step": 1, "title": "Tell us about your case", "timeline": "Day 0", "body": "Company name, year of investment, folio number if you have it.\nPhysical certificates or old dividend warrants if they exist.\nNo documents needed upfront - whatever you remember is enough.", "visual": "checklist", "milestone": "Brief received, expert assigned"},
    {"step": 2, "title": "Expert checks IEPF and MCA21 databases", "timeline": "Day 0-1", "body": "Expert searches iepf.gov.in and MCA21 using your PAN, name, and company details.\nConfirms what shares and dividend amounts are actually credited under your name.\nDone before the call - you get facts, not guesses.", "visual": "form", "milestone": "IEPF balance confirmed"},
    {"step": 3, "title": "45-minute consultation call", "timeline": "Day 1-2", "body": "What is claimable, what Form IEPF-5 looks like for your case, which documents you need.\nDirect claim vs legal heir claim vs physical certificate claim - each has different requirements.\nNo generic script. Your case only.", "visual": "checklist", "milestone": "Consultation complete"},
    {"step": 4, "title": "Written action plan delivered", "timeline": "Day 2", "body": "Summary of the call plus personalised IEPF-5 document checklist.\nYour checklist has 5-9 items in plain language. The government list has 18 items written for lawyers.\nTimeline for the full claim (typically 60-90 days).", "visual": "stamp", "isCompletion": true, "milestone": "Action plan in your order page"}
  ]'::jsonb,
  service_risks = '[
    {"icon": "document", "title": "IEPF-5 rejected for data mismatch", "body": "Form IEPF-5 requires folio number, DP ID, client ID, and company CIN matching government records exactly.\nOne mismatch = rejection at the RTA stage. You find out 4-6 weeks later.\nThe consultation ensures your data matches before you file."},
    {"icon": "alert", "title": "PAN not linked to folio", "body": "IEPF credits are matched against PAN. If original shareholder''s PAN is not linked to the folio, the claim stalls.\nFor inherited claims, your PAN must match legal heir records at the company.\nConsultation identifies this upfront."},
    {"icon": "clock", "title": "Legal heirs filing before share transmission", "body": "If shares are in physical form, they must be transmitted into your name before IEPF-5 is filed.\nFiling before transmission is the most common and most costly mistake in inherited share claims.\nConsultation maps the correct sequence for your case."}
  ]'::jsonb,
  profile_personas = '[
    {"label": "Found old share certificates", "detail": "Physical certificates from the 1990s or 2000s. Not sure if the company still exists, whether shares went to IEPF, or how to start."},
    {"label": "Inherited shares", "detail": "Shares in a parent''s name. Formal transmission never happened. Legal heir process has extra steps most people miss."},
    {"label": "Company sent IEPF notice", "detail": "Company notified that dividends have been or will be transferred to IEPF. You need to know what this means and what to do."},
    {"label": "NRI with old Indian investments", "detail": "You or your parents held shares before moving abroad. Dividends went unclaimed. May now be in IEPF."}
  ]'::jsonb,
  faqs = '[
    {"category": "General", "q": "What is IEPF?", "a": "Investor Education and Protection Fund. If dividends go unclaimed for 7 consecutive years, the company transfers them - and the underlying shares - to IEPF. You can claim them back by filing Form IEPF-5."},
    {"category": "General", "q": "Can I get the money back?", "a": "Yes. Transfer to IEPF is not forfeiture. File IEPF-5 anytime - no deadline. One application covers shares and dividends. Refund takes 60-90 days from complete application."},
    {"category": "Process", "q": "What does Rs. 500 cover?", "a": "Expert checks IEPF database, then 45-minute call on your case - what is claimable, what IEPF-5 involves, which documents you need, realistic timeline. Written action plan and personalised checklist. Filing IEPF-5 is separate."},
    {"category": "Process", "q": "What is IEPF-5?", "a": "Government claim form filed on MCA21. After online filing, you courier documents to the company''s Nodal Officer. Company verifies and forwards to IEPF Authority for refund."},
    {"category": "Process", "q": "How long does the full claim take?", "a": "60-90 days from filing IEPF-5 if the company RTA is responsive. Physical certificate and legal heir claims take longer. Consultation tells you what to expect for your company."},
    {"category": "Documents", "q": "Documents needed?", "a": "Depends on case. Living original investor (demat): PAN, Aadhaar, cancelled cheque, client master report. Physical shares: add certificate, affidavit, indemnity bond. Legal heir: add death certificate, heirship/succession certificate, transmission documents."}
  ]'::jsonb
WHERE slug = 'iepf-consultation';
