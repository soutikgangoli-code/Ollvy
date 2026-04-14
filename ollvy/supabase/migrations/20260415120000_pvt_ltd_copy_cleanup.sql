-- Pvt Ltd + LLP: remove jargon, acronym soup, and scary phrasing
-- Make all copy easy to read for confused founders

UPDATE service_packages
SET
  tagline = 'Your company, incorporated. Fully compliant, with PAN and TAN ready.',
  short_description = 'Incorporate your business as a Private Limited Company. Fully compliant from day one.',
  govt_fee_label = 'Government filing fees',
  govt_fee_note = 'Paid directly to the government. Covers stamp duty, filing fees, and name reservation.',
  workflow_stages = '[
    {"step": 1, "title": "Answer 5 questions - we build your personalised checklist", "timeline": "Day 0", "body": "Number of directors, shareholders, 3 company name options, your state, and starting capital. An Ollvy company secretary is assigned within 4 hours.", "visual": "checklist", "milestone": "Ollvy CS assigned, checklist sent"},
    {"step": 2, "title": "Upload documents through the app", "timeline": "Day 0-2", "body": "PAN and Aadhaar for all directors, address proof for the office, and passport photos. Ollvy verifies each document before filing. Mismatches are caught here, not after the government raises a query.", "visual": "upload", "milestone": "Documents verified by Ollvy"},
    {"step": 3, "title": "Digital signatures and Director IDs arranged for all directors", "timeline": "Day 2-4", "body": "Digital signatures (DSC) and Director IDs (DIN) are required by the government. Ollvy arranges everything and guides each director through a quick video verification.", "visual": "form", "milestone": "Digital signatures and Director IDs ready"},
    {"step": 4, "title": "Company name approved", "timeline": "Day 4-7", "body": "Ollvy files the name reservation with the government. Approval takes 2-3 working days. If rejected, we file your alternatives immediately.", "visual": "form", "milestone": "Company name approved"},
    {"step": 5, "title": "Incorporation filed - PAN, TAN, and founding documents in one submission", "timeline": "Day 7-12", "body": "One government form covers incorporation, PAN, TAN, and optional GST pre-registration. Ollvy drafts the founding documents based on what your business actually does.", "visual": "form", "milestone": "Incorporation application submitted to the government"},
    {"step": 6, "title": "Certificate of Incorporation issued", "timeline": "Day 12-15", "body": "The government issues your Certificate of Incorporation with your company identification number. PAN and TAN are generated automatically. All documents go to your Ollvy account.", "visual": "stamp", "isCompletion": true, "milestone": "Company incorporated"}
  ]'::jsonb,
  whats_included = '[
    {"title": "Digital signatures for all directors - video verification guided", "body": "Digital signatures (DSC) are required for government filing. Ollvy arranges everything and guides each director through verification. 15 minutes per director.", "comparisonWithout": "Figure out digital signature portals yourself - 3+ hours", "comparisonWithOllvy": "Guided flow in app - 15 minutes"},
    {"title": "Director ID included in the incorporation filing - no separate application", "body": "Every director needs a government ID number (DIN). Ollvy files it as part of the incorporation application. No separate filing, no extra time.", "comparisonWithout": "Separate filing - adds 3-5 days", "comparisonWithOllvy": "Director ID filed with everything else - no extra time"},
    {"title": "Founding documents drafted - not templated", "body": "Your business purpose and starting capital are drafted based on what you actually do. Not a generic template that needs expensive changes later.", "comparisonWithout": "Generic template that needs costly changes later", "comparisonWithOllvy": "Custom drafting based on your business"},
    {"title": "PAN and TAN - automatic with incorporation", "body": "Both are applied for within the incorporation filing. Issued within 24 hours of your company number. No separate applications.", "mockVisualType": "status", "mockVisualData": {"row1": "PAN: Applied automatically \u2713", "row2": "TAN: Applied automatically \u2713", "row3": "GST: Optional at incorporation", "note": "All issued with Certificate of Incorporation"}},
    {"title": "Compliance calendar populated automatically", "body": "The moment your company is incorporated, your compliance calendar shows every deadline: first board meeting (30 days), auditor appointment (15 days after your annual meeting), Director KYC (Sep 30 every year).", "mockVisualType": "calendar", "mockVisualData": {"row1": "First Board Meeting - within 30 days", "row2": "Auditor appointment - within 15 days of annual meeting", "row3": "Director KYC - Sep 30 every year", "note": "Added to your calendar automatically"}}
  ]'::jsonb,
  service_risks = '[
    {"icon": "document", "title": "Director documents don''t match", "body": "PAN name, Aadhaar name, and bank records must match exactly. ''Rajesh Kumar'' vs ''Rajesh K'' causes rejection. Ollvy verifies all documents for consistency before filing."},
    {"icon": "clock", "title": "Company name rejected", "body": "The government rejects names similar to existing companies or trademarked terms. Submit 3 distinct options. Ollvy searches company and trademark databases before filing."},
    {"icon": "building", "title": "Office address proof invalid", "body": "If you rent, you need a no-objection letter from the landlord plus a utility bill. Home address works but needs a no-objection letter from a family member if the bill isn''t in the director''s name. Ollvy verifies this upfront."}
  ]'::jsonb,
  profile_personas = '[
    {"label": "First company", "detail": "Never incorporated before. Ollvy explains every document and step in plain English."},
    {"label": "Converting from proprietorship", "detail": "Already running a business, now incorporating. Asset transfer and compliance handled."},
    {"label": "Have co-founders", "detail": "Multiple directors and shareholders. Ownership split and founding document clauses drafted accordingly."},
    {"label": "Raising investment soon", "detail": "Investor-ready structure. Starting capital set right for fundraising. Board structure planned."}
  ]'::jsonb,
  faqs = '[
    {"category": "General", "q": "How long does incorporation take?", "a": "15 working days end-to-end. Digital signatures: 2 days. Name approval: 3 days. Incorporation filing and government approval: 10 days. Ollvy files the moment documents are ready. Government processing time is outside anyone''s control."},
    {"category": "General", "q": "What is the minimum capital required?", "a": "No minimum required. Starting capital can be Rs. 1 lakh (recommended for credibility). Government stamp duty is based on this amount and varies by state."},
    {"category": "Process", "q": "Can I be the only director?", "a": "Pvt Ltd requires minimum 2 directors and 2 shareholders. For single-person ownership, consider OPC (One Person Company) instead."},
    {"category": "Process", "q": "What if my name is rejected?", "a": "Ollvy searches government and trademark databases before filing to reduce rejection risk. If rejected, we file alternative names immediately at no extra cost."},
    {"category": "Documents", "q": "What documents do directors need?", "a": "PAN card, Aadhaar card, passport-size photo, mobile number linked to Aadhaar (for OTP verification), and address proof. Directors must complete a short video verification for their digital signature."},
    {"category": "After Completion", "q": "What do I need to do after incorporation?", "a": "Start a company bank account and deposit your initial capital within 180 days (required before you can officially do business). Annual deadlines: financial filing within 30 days of your annual meeting, company return within 60 days, Director KYC by Sep 30, income tax return by Oct 31. All added to your Ollvy calendar automatically."}
  ]'::jsonb
WHERE slug = 'pvt-ltd-incorporation';


-- =====================
-- LLP INCORPORATION
-- =====================
UPDATE service_packages
SET
  tagline = 'Limited liability. Flexible structure. Professional services-ready.',
  short_description = 'Register your Limited Liability Partnership. Fully compliant from day one.',
  govt_fee_label = 'Government filing fees',
  govt_fee_note = 'Paid directly to the government. Standard for up to Rs. 1 lakh contribution.',
  workflow_stages = '[
    {"step": 1, "title": "Answer questions - we build your checklist", "timeline": "Day 0", "body": "Business type, number of partners, 3 LLP name options, your state, and how capital is split between partners. Ollvy company secretary assigned within 4 hours.", "visual": "checklist", "milestone": "Ollvy CS assigned, checklist sent"},
    {"step": 2, "title": "Upload documents through the app", "timeline": "Day 0-1", "body": "PAN and Aadhaar for all partners, office address proof, and capital split details. Ollvy verifies each document before filing.", "visual": "upload", "milestone": "Documents verified by Ollvy"},
    {"step": 3, "title": "Partner IDs and digital signatures arranged", "timeline": "Day 1-3", "body": "Each partner needs a government-issued Partner ID (DPIN) and a digital signature (DSC). Ollvy files all applications and guides each partner through a quick video verification.", "visual": "form", "milestone": "Partner IDs and digital signatures ready"},
    {"step": 4, "title": "LLP registration filed - Agreement and PAN in one submission", "timeline": "Day 4-9", "body": "One government form covers LLP registration, your LLP Agreement, and PAN application. Ollvy drafts the Agreement based on your actual partner arrangement and files it.", "visual": "form", "milestone": "Registration submitted to the government"},
    {"step": 5, "title": "LLP registration number issued", "timeline": "Day 10-12", "body": "The government issues your Certificate of Incorporation with your LLP number. PAN generated automatically. All documents go to your Ollvy account.", "visual": "stamp", "isCompletion": true, "milestone": "Certificate of Incorporation issued"}
  ]'::jsonb,
  whats_included = '[
    {"title": "LLP Agreement drafted - not templated", "body": "Defines profit-sharing, decision-making, capital contribution, and partner exit terms. Drafted based on your actual arrangement.", "comparisonWithout": "Generic 50-50 template - partner disputes arise later", "comparisonWithOllvy": "Custom agreement reflecting your actual split and roles"},
    {"title": "Partner IDs for all partners", "body": "Every partner needs a government ID number (DPIN). Ollvy files all applications at once. No separate charges per partner.", "comparisonWithout": "Separate filing - adds 3-5 days", "comparisonWithOllvy": "Partner ID filed with everything else - no extra time"},
    {"title": "Digital signatures arranged - verification guided", "body": "Digital signatures (DSC) are required for all partners. Ollvy arranges everything and guides each partner through video verification. 15 minutes per partner.", "comparisonWithout": "Figure out digital signature portals yourself - 3+ hours", "comparisonWithOllvy": "Guided flow in app - 15 minutes"},
    {"title": "Compliance calendar populated automatically", "body": "Once your LLP is registered, your calendar shows annual return (due May 30) and accounts filing (due Oct 30).", "mockVisualType": "calendar", "mockVisualData": {"row1": "Annual Return - Due May 30", "row2": "Accounts Filing - Due Oct 30", "row3": "Partner KYC - Due Sep 30 every year", "note": "Added to your calendar automatically"}}
  ]'::jsonb,
  service_risks = '[
    {"icon": "document", "title": "Name similarity rejection", "body": "LLP names must be distinct from existing LLPs and companies. Ollvy checks both registries before submission."},
    {"icon": "alert", "title": "Capital contribution not defined clearly", "body": "The LLP Agreement must specify each partner''s capital contribution and profit share. Ollvy drafts explicit percentages."},
    {"icon": "clock", "title": "Partner slow on digital signature verification", "body": "The registration form cannot be filed until all partners complete video verification. Ollvy sends daily reminders."}
  ]'::jsonb,
  profile_personas = '[
    {"label": "Professional services firm", "detail": "Accounting firms, law firms, architects, consultants - LLP is the natural structure for you."},
    {"label": "Two equal partners", "detail": "50-50 split. Agreement drafted to handle deadlock scenarios."},
    {"label": "Three partners, unequal contribution", "detail": "Different capital contributions. Profit share can match or differ."},
    {"label": "Converting from partnership", "detail": "Existing partnership firm converting to LLP for limited liability. Ollvy handles the transition."}
  ]'::jsonb,
  faqs = '[
    {"category": "General", "q": "What is an LLP?", "a": "A Limited Liability Partnership combines the flexibility of a partnership with the liability protection of a company. Partners have limited liability - they are not personally liable for business debts beyond their agreed contribution."},
    {"category": "General", "q": "LLP vs Pvt Ltd - which should I choose?", "a": "LLP if you run a services business and don''t plan to raise investment. Pvt Ltd if you plan to raise funding from investors or offer stock options."},
    {"category": "Process", "q": "How many partners are required?", "a": "Minimum 2 designated partners. No maximum limit. At least one must be a resident Indian."},
    {"category": "Documents", "q": "What documents do partners need?", "a": "PAN card, Aadhaar card (with active linked mobile for OTP), passport photo, and address proof. For the LLP: office address proof."},
    {"category": "After Completion", "q": "What are the annual filing deadlines?", "a": "Annual return by May 30. Accounts filing by October 30. Income tax return by July 31 (no audit) or October 31 (if audit applies). Both filings are mandatory regardless of whether the LLP was active."}
  ]'::jsonb
WHERE slug = 'llp-incorporation';


-- =====================
-- GST REGISTRATION
-- =====================
UPDATE service_packages
SET
  tagline = 'Your GST number, applied for and obtained. Ollvy handles every step.',
  short_description = 'Register for GST and get your GST number within 7 working days.',
  workflow_stages = '[
    {"step": 1, "title": "Answer 5 questions - we build your personalised checklist", "timeline": "Day 0", "body": "Business type, state, annual turnover estimate, supply type, and whether you need voluntary registration. An Ollvy CA is assigned within 4 hours.", "visual": "checklist", "milestone": "Ollvy CA assigned, personalised checklist sent"},
    {"step": 2, "title": "Upload documents through the app", "timeline": "Day 0-1", "body": "Ollvy CA sends the list in the app. You upload directly. Ollvy CA reviews every upload before filing.", "visual": "upload", "milestone": "Documents verified by Ollvy CA"},
    {"step": 3, "title": "Application filed - reference number in 24 hours", "timeline": "Day 1-2", "body": "Ollvy CA files the application on the government portal. Your reference number is generated immediately.", "visual": "form", "milestone": "Reference number generated - sent to your app"},
    {"step": 4, "title": "If an officer query arrives, Ollvy CA handles it", "timeline": "Day 3-5", "body": "The GST officer asks for clarification in about 1 in 5 cases. Ollvy CA responds within 24 hours. Included in the price.", "visual": "form", "milestone": "Query responded"},
    {"step": 5, "title": "GST number issued", "timeline": "Day 5-7", "body": "The government issues your GST number. It''s permanent - no renewal. Your Ollvy compliance calendar is updated automatically.", "visual": "stamp", "isCompletion": true, "milestone": "GST number active"}
  ]'::jsonb,
  whats_included = '[
    {"title": "Ollvy CA handles the government portal - all 23 fields", "body": "The GST application form has 23 fields across 5 tabs. Ollvy CA fills the whole thing. You answer 5 questions in the app.", "comparisonWithout": "23 fields. 5 tabs. 3-4 hours on the government portal", "comparisonWithOllvy": "5 questions in app - about 4 minutes", "mockVisualType": "status", "mockVisualData": {"label": "GST Application", "row1": "Business details - complete \u2713", "row2": "Promoter/Partner info - complete \u2713", "row3": "Place of business - complete \u2713", "note": "All 23 fields handled by Ollvy CA"}},
    {"title": "Reference number shared same day - track it yourself", "body": "Your reference number is generated the moment Ollvy CA submits. Shared immediately. Track progress at gstn.gov.in yourself.", "mockVisualType": "arn", "mockVisualData": {"label": "Application Reference Number", "value": "AA270325014782R", "status": "Processing", "filed": "Filed: 25 Mar 2025", "verify": "Track at gstn.gov.in"}},
    {"title": "Officer queries handled - no extra charge", "body": "If the GST officer requests clarification, Ollvy CA responds within 24 hours. Part of the service, not an extra charge."},
    {"title": "Compliance calendar updated automatically", "body": "The moment your GST number is active, your Ollvy compliance calendar shows your monthly filing due dates.", "mockVisualType": "calendar", "mockVisualData": {"row1": "Sales return - Due 11th of each month", "row2": "Tax return - Due 20th of each month", "note": "Added to your calendar automatically"}}
  ]'::jsonb,
  service_risks = '[
    {"icon": "document", "title": "Address proof mismatch", "body": "The business address on your documents must match exactly. Ollvy CA reviews all documents for consistency."},
    {"icon": "clock", "title": "Aadhaar OTP fails", "body": "GST registration requires Aadhaar-based authentication. If mobile number is old, OTP fails. Ollvy checks this upfront."},
    {"icon": "alert", "title": "Operating without registration", "body": "If turnover has crossed threshold without registration, you are liable for 100% unpaid tax plus Rs. 10,000 minimum penalty."}
  ]'::jsonb,
  profile_personas = '[
    {"label": "First GST registration", "detail": "Never done this before. Ollvy explains what each document is for."},
    {"label": "Turnover just crossed threshold", "detail": "You waited until legally required. Ollvy registers you quickly to stop the penalty from building up."},
    {"label": "Voluntary registration", "detail": "Below threshold but want to issue GST invoices to business clients so they can claim tax credits. Completely legal."},
    {"label": "Home as principal place of business", "detail": "Fully legal. Ollvy verifies address proof matches your electricity bill."}
  ]'::jsonb,
  faqs = '[
    {"category": "General", "q": "When is GST registration required?", "a": "When total turnover crosses Rs. 40 lakh for goods (Rs. 20 lakh for services, Rs. 10 lakh in certain states). Also required for any sale to another state."},
    {"category": "General", "q": "Can I register voluntarily below threshold?", "a": "Yes. If you want to issue GST invoices or claim tax credits on your purchases, you can register voluntarily."},
    {"category": "Process", "q": "What is the application reference number?", "a": "Your reference number is generated on submission. You can track progress at gstn.gov.in yourself."},
    {"category": "Process", "q": "What if the officer raises a query?", "a": "Ollvy CA responds within 24 hours. Included in the price. Most queries resolve in one reply."},
    {"category": "Documents", "q": "What documents do I need?", "a": "Depends on business type. Ollvy sends a personalised checklist - not the full 20-item government list."},
    {"category": "After Completion", "q": "What returns do I file after getting my GST number?", "a": "Sales return by the 11th, tax return by the 20th. Every month. Returns required even with zero transactions. Annual return by December 31."}
  ]'::jsonb
WHERE slug = 'gst-registration';


-- =====================
-- GST MONTHLY FILING
-- =====================
UPDATE service_packages
SET
  tagline = 'Sales return by the 11th. Tax return by the 20th. Every month. Handled.',
  short_description = 'Monthly GST return filing for businesses up to Rs. 50L turnover.',
  workflow_stages = '[
    {"step": 1, "title": "Share your GST portal credentials", "timeline": "Day 0", "body": "You share read-only access. Ollvy CA reviews your filing history and becomes your dedicated Ollvy CA.", "visual": "checklist", "milestone": "Ollvy CA assigned to your account"},
    {"step": 2, "title": "Upload sales invoices and purchase data", "timeline": "By 8th of month", "body": "Upload sales invoices and purchase register. If you use Tally or Zoho, export and upload directly.", "visual": "upload", "milestone": "Data received for the month"},
    {"step": 3, "title": "Sales return filed by the 11th", "timeline": "9th-11th", "body": "Ollvy CA files your sales return. You receive acknowledgement in the app.", "visual": "form", "milestone": "Sales return filed and acknowledged"},
    {"step": 4, "title": "Tax return filed by the 20th", "timeline": "18th-20th", "body": "Ollvy CA prepares the tax return, calculates what you owe, verifies your credits, and files.", "visual": "form", "milestone": "Tax return filed and acknowledged"},
    {"step": 5, "title": "Monthly compliance report delivered", "timeline": "21st-25th", "body": "After filing, you receive a monthly report: what was filed, when, acknowledgement numbers.", "visual": "checklist", "isCompletion": true, "milestone": "Monthly report delivered"}
  ]'::jsonb,
  whats_included = '[
    {"title": "Sales return (GSTR-1)", "body": "All business invoices, consumer sales above Rs. 2.5 lakh, and export invoices captured. Filed by the 11th.", "mockVisualType": "status", "mockVisualData": {"row1": "Sales return - March 2025", "row2": "Filed: 10 Mar 2025", "row3": "Ref: AA1234567890123"}},
    {"title": "Tax payment return (GSTR-3B)", "body": "Ollvy CA calculates tax, deducts eligible credits, and files. Payment slip generated."},
    {"title": "Tax credit verification", "body": "Ollvy CA checks the credits you claim against the government''s auto-generated statement. Mismatches flagged before claiming.", "comparisonWithout": "Claim credits without checking, get a notice later", "comparisonWithOllvy": "Credits verified against the government system before claiming"},
    {"title": "Monthly compliance report", "body": "After every filing cycle: what was filed, when, acknowledgement numbers, credits claimed, tax paid.", "mockVisualType": "receipt", "mockVisualData": {"label": "March 2025 Compliance Report", "row1": "Sales return: Filed 10 Mar \u2713", "row2": "Tax return: Filed 18 Mar \u2713", "row3": "Tax Paid: Rs. 45,230"}}
  ]'::jsonb,
  service_risks = '[
    {"icon": "clock", "title": "Late filing: Rs. 50/day, minimum Rs. 20,000", "body": "Tax return late fee is Rs. 50/day with minimum Rs. 20,000 per return. Plus 18% interest on unpaid tax."},
    {"icon": "document", "title": "Sales return and tax return mismatch", "body": "If figures don''t match, the government system flags it automatically. Ollvy ensures consistency before filing."},
    {"icon": "alert", "title": "Credits claimed but vendor hasn''t filed", "body": "If your vendor hasn''t filed their sales return, your credits get blocked. Ollvy checks the credit statement before claiming."}
  ]'::jsonb,
  profile_personas = '[
    {"label": "First time outsourcing GST", "detail": "Your accountant was handling it. Now you want a professional. Ollvy takes over seamlessly."},
    {"label": "Multiple GST numbers", "detail": "Multiple states, multiple registrations. All handled under one retainer."},
    {"label": "High transaction volume", "detail": "500+ invoices/month. Pricing based on turnover, not invoice count."},
    {"label": "Previous CA went quiet", "detail": "Your last CA stopped responding. Ollvy doesn''t do that. Guaranteed timeline, every month."}
  ]'::jsonb,
  faqs = '[
    {"category": "General", "q": "What does the monthly retainer cover?", "a": "Sales return by the 11th, tax return by the 20th, credit verification, and a monthly compliance report."},
    {"category": "General", "q": "Can I cancel anytime?", "a": "Yes. No minimum term. Cancel before the 1st of any month."},
    {"category": "Process", "q": "What data do I need to provide each month?", "a": "Sales invoices, purchase register. If you use accounting software, export takes 2 minutes."},
    {"category": "Pricing", "q": "Why do prices vary by turnover?", "a": "Higher turnover means more invoices and more reconciliation work. Base price covers up to Rs. 50L."}
  ]'::jsonb
WHERE slug = 'gst-monthly';

-- =====================
-- 5. BUSINESS ITR FILING
-- =====================
UPDATE service_packages
SET
  tagline = 'Your company''s annual tax return - filed correctly, on time.',
  short_description = 'Your company''s annual tax return - filed correctly, on time',
  workflow_stages = '[
    {"step": 1, "title": "Upload your financials", "timeline": "Day 0-1", "body": "Profit & loss, balance sheet, and bank statements. Ollvy CA assigned within 4 hours.", "visual": "upload", "milestone": "Documents received and assigned to Ollvy CA"},
    {"step": 2, "title": "Ollvy CA reviews books and prepares calculation", "timeline": "Day 1-4", "body": "Ollvy CA reviews your profit & loss, checks that asset write-offs are calculated correctly, verifies how director pay is treated for tax, and prepares the full tax calculation.", "visual": "form", "milestone": "Draft tax calculation shared"},
    {"step": 3, "title": "You review, approve, and Ollvy CA files", "timeline": "Day 4-7", "body": "Draft return shared in app. You review and approve. Ollvy CA files within 24 hours.", "visual": "checklist", "milestone": "Return submitted to the income tax portal"},
    {"step": 4, "title": "Acknowledgement delivered", "timeline": "Day 7-10", "body": "Filing acknowledgement generated immediately. Shared in app same day. Calendar updated.", "visual": "stamp", "isCompletion": true, "milestone": "Filing acknowledgement delivered"}
  ]'::jsonb,
  whats_included = '[
    {"title": "Asset write-off review - not just data entry", "body": "Ollvy CA checks that your assets are written off at the correct rates. Wrong rates get caught before filing.", "comparisonWithout": "You calculate write-offs, CA just enters it", "comparisonWithOllvy": "Ollvy CA reviews your assets and corrects rates"},
    {"title": "Director pay and tax treatment", "body": "For Pvt Ltd companies, how much you pay directors as salary vs dividends changes your tax bill. Ollvy CA makes sure it stays within legal limits."},
    {"title": "Draft review before filing", "body": "You see the complete return before filing. Income figures, deductions, final tax number - everything. You approve.", "comparisonWithout": "Return filed, acknowledgement sent, no review", "comparisonWithOllvy": "Draft shared, you approve, then Ollvy CA files"},
    {"title": "Filing acknowledgement stored permanently", "body": "Filing acknowledgement uploaded to your account immediately. Five years from now, it''s still there.", "mockVisualType": "receipt", "mockVisualData": {"label": "Filing Acknowledgement", "row1": "ITR-6 · AY 2025-26", "row2": "Filed: 15 Oct 2025", "row3": "Acknowledgement No: CPC/2025/A12345"}}
  ]'::jsonb,
  service_risks = '[
    {"icon": "clock", "title": "Late filing interest - 1% per month", "body": "If you file after October 31 with tax still owed, 1% interest per month kicks in from the original deadline."},
    {"icon": "document", "title": "You lose the right to offset losses", "body": "If your business made a loss and you file late, you lose the right to use it against future profits - permanently."},
    {"icon": "alert", "title": "Defective return notice from the tax department", "body": "Late filers are more likely to get a notice saying the return is defective. That means more paperwork and delays."}
  ]'::jsonb,
  profile_personas = '[
    {"label": "First year filing", "detail": "New company, first tax return. Ollvy CA walks you through every document."},
    {"label": "Changed CA mid-year", "detail": "Previous CA left messy books. Ollvy CA cleans up and files correctly."},
    {"label": "Company made a loss", "detail": "Loss return filed on time so you can use that loss to pay less tax in future years."},
    {"label": "Filing late", "detail": "Ollvy CA calculates how much late interest you owe upfront, then files immediately."}
  ]'::jsonb,
  faqs = '[
    {"category": "General", "q": "When is business ITR due?", "a": "October 31 for all Pvt Ltd companies (every company needs an audit, so the extended deadline always applies). July 31 for LLPs that don''t need an audit. October 31 for LLPs that do."},
    {"category": "General", "q": "What is the difference between ITR-5 and ITR-6?", "a": "The government uses different forms for different entities. Companies use one, LLPs and partnerships use another. Ollvy picks the right one."},
    {"category": "Process", "q": "What documents do I need?", "a": "Audited profit & loss, balance sheet, trial balance, full-year bank statements, and tax credit statement (Form 26AS)."},
    {"category": "Process", "q": "Do I need an audit?", "a": "All Pvt Ltd companies need an audit. LLPs need one above Rs. 40 lakh turnover. There''s also a separate tax audit above Rs. 1 crore turnover."}
  ]'::jsonb
WHERE slug = 'business-itr';

-- =====================
-- 6. TRADEMARK REGISTRATION
-- =====================
UPDATE service_packages
SET
  tagline = '10-year brand protection. Filed in 7 days.',
  short_description = 'Protect your brand name across India for 10 years. Application filed in 7 days.',
  govt_fee_note = 'Government fee for a single category. Half price if you have MSME or startup recognition.',
  workflow_stages = '[
    {"step": 1, "title": "Tell us your brand name and category", "timeline": "Day 0", "body": "Ollvy trademark attorney assigned within 4 hours. Preliminary search started immediately.", "visual": "checklist", "milestone": "Attorney assigned, search started"},
    {"step": 2, "title": "Trademark search report delivered", "timeline": "Day 1-2", "body": "Ollvy attorney searches the Registry for identical and similar names in your categories. You receive the search report.", "visual": "form", "milestone": "Search report delivered"},
    {"step": 3, "title": "Application filed with Trademark Registry", "timeline": "Day 3-7", "body": "Ollvy attorney drafts the application, selects the right categories, and files. You receive your application number and filing receipt.", "visual": "form", "milestone": "Application filed, receipt received"},
    {"step": 4, "title": "Examination and publication", "timeline": "6-12 months", "body": "The Registry examines your application. If objections come up, Ollvy attorney responds - included in the price. Once cleared, the mark is published.", "visual": "calendar", "milestone": "Under examination"},
    {"step": 5, "title": "Registration certificate issued", "timeline": "12-18 months total", "body": "Registry issues your registration certificate. 10-year protection, renewable indefinitely. Certificate stored in your Ollvy account.", "visual": "stamp", "isCompletion": true, "milestone": "Trademark registered"}
  ]'::jsonb,
  whats_included = '[
    {"title": "Trademark search before filing", "body": "Before filing, Ollvy attorney searches the Registry for conflicts. No point paying the government fee for a certain rejection.", "comparisonWithout": "File blindly, wait months, get rejected", "comparisonWithOllvy": "Search first, modify if needed, then file", "mockVisualType": "status", "mockVisualData": {"row1": "TECHBRIDGE - Class 42", "row2": "No identical marks found ✓", "row3": "2 similar marks reviewed - no conflict"}},
    {"title": "Category selection guidance", "body": "Trademarks are registered per category (45 total). Ollvy attorney recommends only the ones you actually need."},
    {"title": "Objection response included", "body": "If the government raises objections, Ollvy attorney responds. Included in the price.", "comparisonWithout": "Objection raised, you pay extra to respond", "comparisonWithOllvy": "Objection response included in service"},
    {"title": "Renewal reminder", "body": "Ollvy adds the renewal date to your calendar. You''ll get reminders 6 months before expiry.", "mockVisualType": "calendar", "mockVisualData": {"row1": "Trademark Renewal - Mar 2035", "row2": "Reminder: Sep 2034", "row3": "Status: Scheduled"}}
  ]'::jsonb,
  service_risks = '[
    {"icon": "document", "title": "Similar mark already exists", "body": "If a similar name exists in your category, the government will reject it. Ollvy''s search catches most conflicts."},
    {"icon": "clock", "title": "Government processing takes 12-18 months", "body": "Filing happens in 7 days, but examination takes 12-18 months. Ollvy tracks every stage and updates you."},
    {"icon": "alert", "title": "Opposition during publication", "body": "After examination, mark is published for 4 months. Anyone can object. Rare (under 5% of cases)."}
  ]'::jsonb,
  profile_personas = '[
    {"label": "First trademark", "detail": "Never registered before. Ollvy explains categories, search, and the full process."},
    {"label": "Logo + word mark", "detail": "You want to protect both. Two applications needed. Ollvy handles both."},
    {"label": "Multiple categories", "detail": "Tech + retail + services. Each category is Rs. 4,500 additional government fee."},
    {"label": "Already using the name", "detail": "Using brand for years without registration. Register now before someone else does."}
  ]'::jsonb,
  faqs = '[
    {"category": "General", "q": "What can I trademark?", "a": "Words, logos, slogans, sounds, and even colours. Most businesses trademark brand name and logo separately."},
    {"category": "General", "q": "How long does protection last?", "a": "10 years from filing, renewable indefinitely in 10-year increments."},
    {"category": "Process", "q": "Why does registration take so long?", "a": "Filing takes 7 days. Examination takes 6-12 months. Then 4 months where anyone can object. Then certificate issuance. All government-side."},
    {"category": "Process", "q": "Can I use the registered symbol after filing?", "a": "No. Use it only after registration is granted. Until then, use TM for goods or SM for services to show your claim."},
    {"category": "Documents", "q": "What documents do I need?", "a": "PAN, Aadhaar, address proof, logo file. For companies: Certificate of Incorporation."}
  ]'::jsonb
WHERE slug = 'trademark-registration';

-- =====================
-- 7. MCA ANNUAL FILING
-- =====================
UPDATE service_packages
SET
  tagline = 'Your company''s annual return filed with the government. Rs. 100/day penalty stopped the moment Ollvy CS files.',
  short_description = 'Two mandatory government forms filed every year for your Pvt Ltd company',
  govt_fee_note = 'Paid to Ministry of Corporate Affairs. Rs. 300 per form.',
  workflow_stages = '[
    {"step": 1, "title": "Share your company details", "timeline": "Day 0", "body": "Your company registration number, financial year, annual meeting date, and whether your audit is done.", "visual": "checklist", "milestone": "Ollvy CS assigned"},
    {"step": 2, "title": "Upload financial statements and documents", "timeline": "Day 0-2", "body": "Audited balance sheet, profit & loss, director report, auditor report, and shareholder list.", "visual": "upload", "milestone": "Documents reviewed by Ollvy CS"},
    {"step": 3, "title": "Forms drafted and reviewed", "timeline": "Day 2-4", "body": "Ollvy CS drafts both forms. You review and approve in the app before anything is filed.", "visual": "form", "milestone": "Draft forms sent for approval"},
    {"step": 4, "title": "Filed with the government - filing receipt generated", "timeline": "Day 5-7", "body": "Ollvy CS files both forms. Filing receipts generated and shared immediately.", "visual": "stamp", "isCompletion": true, "milestone": "Both forms filed with the government"}
  ]'::jsonb,
  whats_included = '[
    {"title": "Both government forms filed", "body": "One form for your financials (AOC-4), one for company details (MGT-7). Both included in the price.", "comparisonWithout": "Book separately - higher cost", "comparisonWithOllvy": "Both forms, one price, one Ollvy CS"},
    {"title": "Deadline calculation based on annual meeting", "body": "Financials form due 30 days after annual meeting. Company details form due 60 days. Ollvy CS tracks both deadlines.", "mockVisualType": "calendar", "mockVisualData": {"row1": "FY End: March 31 → Annual meeting by Sep 30", "row2": "AOC-4 due: 30 days after meeting", "row3": "MGT-7 due: 60 days after meeting"}},
    {"title": "Late fee checked before filing", "body": "If filing late, the fee is Rs. 100/day per form. Ollvy CS calculates the exact amount upfront.", "comparisonWithout": "Surprise late fee at the portal", "comparisonWithOllvy": "Late fee calculated and disclosed before you approve"},
    {"title": "Filing receipt shared immediately", "body": "Filing receipt is your proof. Ollvy CS shares both receipts immediately."}
  ]'::jsonb,
  service_risks = '[
    {"icon": "clock", "title": "Annual meeting not held on time", "body": "Annual meeting must be held within 6 months of financial year-end. If delayed, filing is delayed too."},
    {"icon": "document", "title": "Audited financials not ready", "body": "The financials form requires audited financials. Complete your audit first."},
    {"icon": "alert", "title": "Late fee accruing daily", "body": "Late filing is Rs. 100/day per form. For both, that''s Rs. 200/day. No ceiling."}
  ]'::jsonb,
  profile_personas = '[
    {"label": "First year after incorporation", "detail": "First annual filing. Ollvy CS explains every field."},
    {"label": "Running late on filing", "detail": "Already past the deadline. Ollvy CS calculates the late fee and files immediately."},
    {"label": "Director changes during year", "detail": "New appointments or resignations reflected in the company details form."},
    {"label": "Share transfer happened", "detail": "Equity changes during year. Shareholder details updated in the company details form."}
  ]'::jsonb,
  faqs = '[
    {"category": "General", "q": "What is MCA annual filing?", "a": "Two mandatory government forms: one for your financials (AOC-4) and one for company details like shareholders and directors (MGT-7)."},
    {"category": "General", "q": "When is MCA annual filing due?", "a": "Financials form: 30 days after annual meeting. Company details form: 60 days after annual meeting."},
    {"category": "Process", "q": "Can I file if the audit is not complete?", "a": "No. The financials form requires audited financials. Complete your audit first."},
    {"category": "Documents", "q": "What documents do I need?", "a": "Audited balance sheet, profit & loss, notes to accounts, director report, auditor report, and annual meeting date."}
  ]'::jsonb
WHERE slug = 'mca-annual-filing';

-- =====================
-- 8. TDS MONTHLY COMPLIANCE
-- =====================
UPDATE service_packages
SET
  tagline = 'Deduct. Deposit by the 7th. File the return. Every month.',
  short_description = 'Monthly tax deduction handled - payment, deposit, return filing',
  workflow_stages = '[
    {"step": 1, "title": "Share payment register", "timeline": "Day 1-5", "body": "Upload salary, vendor, and rent payments. Ollvy CA reviews the TDS rates for each.", "visual": "upload", "milestone": "Data received"},
    {"step": 2, "title": "TDS calculated and payment slips prepared", "timeline": "Day 5-6", "body": "Ollvy CA calculates TDS for each payment type. Payment slips prepared.", "visual": "form", "milestone": "Payment slips ready"},
    {"step": 3, "title": "Payment slips paid", "timeline": "Day 6-7", "body": "You pay through net banking. Payment receipt uploaded to your Ollvy account.", "visual": "stamp", "milestone": "TDS deposited"},
    {"step": 4, "title": "Quarterly return filed", "timeline": "Quarter end", "body": "Ollvy CA files quarterly returns. Tax certificates for employees and vendors generated after filing.", "visual": "form", "isCompletion": true, "milestone": "TDS return filed"}
  ]'::jsonb,
  whats_included = '[
    {"title": "TDS calculation for all payment types", "body": "Salary, contractor payments, professional fees, rent, and interest. Ollvy CA applies the correct rate for each."},
    {"title": "Monthly payment slip preparation", "body": "Payment slip needs the right codes and year. Ollvy CA prepares everything - you just pay."},
    {"title": "Quarterly return filing", "body": "One return for salary, one for everything else. Ollvy CA reconciles with payment slips before filing."},
    {"title": "Tax certificates for employees and vendors", "body": "Once returns are filed, tax certificates are generated for your employees and vendors."}
  ]'::jsonb,
  service_risks = '[
    {"icon": "clock", "title": "Late deposit - interest accrues", "body": "TDS due by 7th of following month. 1.5% per month interest on late deposit."},
    {"icon": "document", "title": "Wrong TDS rate", "body": "Deducting too little means you''re liable for the shortfall. Deducting too much means the vendor or employee complains."}
  ]'::jsonb,
  profile_personas = '[
    {"label": "First time deducting TDS", "detail": "New to TDS. Ollvy CA explains every step."},
    {"label": "Have employees", "detail": "Salary TDS handled. Tax certificates generated for all employees."},
    {"label": "Paying contractors", "detail": "Contractor and professional fee TDS covered."}
  ]'::jsonb,
  faqs = '[
    {"category": "General", "q": "Who needs to deduct TDS?", "a": "Any business paying salary, rent above Rs. 2.4 lakh/year, contractor payments above Rs. 30,000 per contract, or professional fees above Rs. 30,000/year."},
    {"category": "Process", "q": "When is the deposit due?", "a": "7th of the following month. Late deposit means 1.5% per month interest."}
  ]'::jsonb
WHERE slug = 'tds-monthly-compliance';

-- =====================
-- 9. MSME / UDYAM REGISTRATION
-- =====================
UPDATE service_packages
SET
  tagline = 'Free government recognition. Priority lending. Payment protection.',
  short_description = 'Get official MSME recognition - unlocks priority bank loans, payment protection, and government tender access',
  workflow_stages = '[
    {"step": 1, "title": "Share Aadhaar and PAN", "timeline": "Day 0", "body": "Owner Aadhaar for OTP verification and business PAN. GST number if you have one.", "visual": "upload", "milestone": "Details received"},
    {"step": 2, "title": "Application filed on Udyam", "timeline": "Day 1", "body": "Application submitted on official government portal with your investment and turnover details.", "visual": "form", "milestone": "Application submitted"},
    {"step": 3, "title": "Udyam certificate issued", "timeline": "Day 1-2", "body": "Certificate with your registration number generated. Classification confirmed: Micro, Small, or Medium.", "visual": "stamp", "isCompletion": true, "milestone": "MSME registered"}
  ]'::jsonb,
  whats_included = '[
    {"title": "Udyam certificate with registration number", "body": "Official certificate recognised by all banks and government departments."},
    {"title": "Automatic GST linking", "body": "Your GST number linked to Udyam registration automatically."},
    {"title": "Access to government schemes", "body": "Priority bank lending, subsidy schemes, and government tender access."}
  ]'::jsonb,
  service_risks = '[
    {"icon": "document", "title": "Self-declaration based", "body": "Investment and turnover are self-declared. Keep records in case of verification."}
  ]'::jsonb,
  profile_personas = '[
    {"label": "Small business", "detail": "Investment under Rs. 5 crore. Most startups and small businesses qualify."},
    {"label": "Service enterprise", "detail": "IT, consulting, professional services - all qualify as MSME."}
  ]'::jsonb,
  faqs = '[
    {"category": "General", "q": "What are MSME benefits?", "a": "Priority bank lending with better rates, 45-day payment protection from large buyers, government tender access, and subsidy schemes."},
    {"category": "Process", "q": "Is Udyam registration free?", "a": "Free on the government portal. Ollvy fee is for filing assistance and certificate delivery."}
  ]'::jsonb
WHERE slug = 'msme-registration';

-- =====================
-- 10. GST CANCELLATION
-- =====================
UPDATE service_packages
SET
  tagline = 'Close your GST registration properly. Final return filed, tax credits settled.',
  short_description = 'Close your GST number properly - final return filed, tax credits settled, clean closure',
  workflow_stages = '[
    {"step": 1, "title": "Tax credit and liability review", "timeline": "Day 0-2", "body": "Ollvy CA reviews your remaining tax credits and pending liabilities.", "visual": "checklist", "milestone": "Tax position confirmed"},
    {"step": 2, "title": "Final return prepared", "timeline": "Day 2-5", "body": "Final return prepared with your remaining stock details and tax credit settlement.", "visual": "form", "milestone": "Final return ready"},
    {"step": 3, "title": "Cancellation filed", "timeline": "Day 5-10", "body": "Cancellation application and final return filed by Ollvy CA.", "visual": "form", "milestone": "Cancellation filed"},
    {"step": 4, "title": "Cancellation order", "timeline": "Day 10-15", "body": "GST officer reviews and issues the cancellation order.", "visual": "stamp", "isCompletion": true, "milestone": "GST cancelled"}
  ]'::jsonb,
  whats_included = '[
    {"title": "Final return", "body": "Your remaining stock details and tax credit settlement calculated by Ollvy CA."},
    {"title": "Cancellation application", "body": "Cancellation application with reason and supporting details."},
    {"title": "Tax credit settlement handled", "body": "Tax credits on remaining stock returned as required. Ollvy CA calculates the exact amount."}
  ]'::jsonb,
  service_risks = '[
    {"icon": "document", "title": "Tax credit settlement required", "body": "Tax credits on remaining stock must be returned to the government. Cannot be skipped."}
  ]'::jsonb,
  profile_personas = '[
    {"label": "Closing business", "detail": "Winding down. Ollvy CA handles full clean closure."},
    {"label": "Below threshold", "detail": "Turnover dropped below Rs. 40 lakh. Voluntary cancellation prevents unnecessary filing."}
  ]'::jsonb,
  faqs = '[
    {"category": "General", "q": "What happens to my tax credits?", "a": "Tax credits on remaining stock must be returned to the government. Ollvy CA calculates this before filing."},
    {"category": "Process", "q": "Can I re-register later?", "a": "Yes. A fresh GST registration can be filed if your turnover crosses the threshold again."}
  ]'::jsonb
WHERE slug = 'gst-cancellation';

-- =====================
-- 11. GST REVOCATION
-- =====================
UPDATE service_packages
SET
  tagline = 'GST cancelled by the department? Ollvy CA restores it.',
  short_description = 'GST number cancelled by the department? Ollvy CA files all pending returns and restores it.',
  workflow_stages = '[
    {"step": 1, "title": "Review cancellation order", "timeline": "Day 0-1", "body": "Ollvy CA confirms the reason and date. 30-day window calculated.", "visual": "checklist", "milestone": "Order reviewed"},
    {"step": 2, "title": "File pending returns", "timeline": "Day 1-5", "body": "All pending monthly returns filed by Ollvy CA with interest calculated.", "visual": "form", "milestone": "Returns filed"},
    {"step": 3, "title": "Revocation application filed", "timeline": "Day 5-7", "body": "Ollvy CA submits the revocation with confirmation that all returns are current.", "visual": "form", "milestone": "Revocation filed"},
    {"step": 4, "title": "GST restored", "timeline": "Day 7-10", "body": "Registration restored by officer.", "visual": "stamp", "isCompletion": true, "milestone": "GST number active"}
  ]'::jsonb,
  whats_included = '[
    {"title": "Pending returns filed", "body": "All pending monthly returns filed by Ollvy CA. Interest calculated and paid."},
    {"title": "Revocation application", "body": "Revocation application with explanation filed by Ollvy CA."},
    {"title": "Interest calculation", "body": "Exact interest on late-paid tax calculated upfront so you know the total cost."}
  ]'::jsonb,
  service_risks = '[
    {"icon": "clock", "title": "30-day deadline", "body": "Revocation must be filed within 30 days of cancellation. After that, a formal appeal is needed - longer and more expensive."}
  ]'::jsonb,
  profile_personas = '[
    {"label": "Missed filing deadline", "detail": "GST cancelled by the department. Ollvy CA clears all returns and restores it."},
    {"label": "Want to continue business", "detail": "Need GST to invoice clients. Ollvy CA treats this as urgent from day one."}
  ]'::jsonb,
  faqs = '[
    {"category": "General", "q": "Why was GST cancelled?", "a": "Usually for not filing monthly returns for 6 or more months."},
    {"category": "Urgency", "q": "Time limit for revocation?", "a": "Within 30 days of the cancellation order. Apply immediately."}
  ]'::jsonb
WHERE slug = 'gst-revocation';

-- =====================
-- 12. DIN REACTIVATION
-- =====================
UPDATE service_packages
SET
  tagline = 'Director ID deactivated? Ollvy CS restores it in 10 working days.',
  short_description = 'Your Director ID is deactivated - Ollvy CS files the KYC and restores it',
  workflow_stages = '[
    {"step": 1, "title": "Check reason for deactivation", "timeline": "Day 0-1", "body": "Director ID status verified on the government portal. Years of outstanding KYC identified.", "visual": "checklist", "milestone": "Reason identified"},
    {"step": 2, "title": "File pending director KYC", "timeline": "Day 1-5", "body": "Director KYC filed for all pending years by Ollvy CS. Aadhaar OTP required.", "visual": "form", "milestone": "KYC filed"},
    {"step": 3, "title": "Reactivation application", "timeline": "Day 5-7", "body": "Reactivation form filed with the government by Ollvy CS.", "visual": "form", "milestone": "Application filed"},
    {"step": 4, "title": "Director ID reactivated", "timeline": "Day 7-10", "body": "Director ID status changed to Active. All directorships restored.", "visual": "stamp", "isCompletion": true, "milestone": "Director ID active"}
  ]'::jsonb,
  whats_included = '[
    {"title": "All pending director KYC filed", "body": "Every year of missed KYC cleared by Ollvy CS."},
    {"title": "Reactivation application", "body": "Reactivation form submitted to the government by Ollvy CS."},
    {"title": "All directorships restored", "body": "Ollvy CS verifies every company where you are a director is unblocked."}
  ]'::jsonb,
  service_risks = '[
    {"icon": "document", "title": "All companies affected", "body": "If your Director ID is deactivated, you cannot act as director in any company until it is restored."}
  ]'::jsonb,
  profile_personas = '[
    {"label": "Missed director KYC", "detail": "Director ID deactivated. Ollvy CS files all pending KYC and restores it."}
  ]'::jsonb,
  faqs = '[
    {"category": "General", "q": "Why was my Director ID deactivated?", "a": "Usually for not filing the annual director KYC by September 30. Deactivation happens automatically on October 1."}
  ]'::jsonb
WHERE slug = 'din-reactivation';

-- =====================
-- 13. COMPANY NAME CHANGE
-- =====================
UPDATE service_packages
SET
  tagline = 'New name. Same company. Same registration number, PAN, and TAN.',
  short_description = 'Change your company name with the government. New certificate issued.',
  workflow_stages = '[
    {"step": 1, "title": "Name availability check", "timeline": "Day 0-2", "body": "Ollvy CS searches the government registry and trademark database.", "visual": "checklist", "milestone": "Name available"},
    {"step": 2, "title": "Board and shareholder resolution", "timeline": "Day 2-7", "body": "Shareholder vote (75% must approve). Ollvy CS drafts all resolutions.", "visual": "form", "milestone": "Shareholder approval obtained"},
    {"step": 3, "title": "Name reserved with the government", "timeline": "Day 7-12", "body": "Name reservation application submitted by Ollvy CS.", "visual": "form", "milestone": "Name reserved"},
    {"step": 4, "title": "Name change application filed", "timeline": "Day 12-18", "body": "Name change application with updated founding document filed by Ollvy CS.", "visual": "form", "milestone": "Application filed"},
    {"step": 5, "title": "New certificate issued", "timeline": "Day 18-20", "body": "Fresh Certificate of Incorporation with your new name. Registration number stays the same.", "visual": "stamp", "isCompletion": true, "milestone": "Name changed"}
  ]'::jsonb,
  whats_included = '[
    {"title": "Name availability search", "body": "Government registry and trademark database searched by Ollvy CS."},
    {"title": "Shareholder resolution drafting", "body": "All resolutions and meeting notices drafted by Ollvy CS."},
    {"title": "Founding document updated", "body": "Name clause updated with the new name."},
    {"title": "New certificate", "body": "Fresh Certificate of Incorporation issued by the government."}
  ]'::jsonb,
  service_risks = '[
    {"icon": "document", "title": "Update other registrations", "body": "After the name change, GST, bank accounts, trademark, and other registrations must be updated separately."}
  ]'::jsonb,
  profile_personas = '[
    {"label": "Rebranding", "detail": "New brand, new company name. Ollvy CS handles the full process."},
    {"label": "Pivot in business", "detail": "Business model changed. Name no longer fits."}
  ]'::jsonb,
  faqs = '[
    {"category": "Process", "q": "Does PAN or GST change?", "a": "PAN and TAN stay the same. GST requires a name update on the GST portal - separate but straightforward."}
  ]'::jsonb
WHERE slug = 'company-name-change';

-- =====================
-- 14. CLOUD KITCHEN SETUP
-- =====================
UPDATE service_packages
SET
  tagline = 'Every licence a delivery kitchen needs. FSSAI, GST, and trade licence together.',
  short_description = 'All three licences a cloud kitchen needs - FSSAI, GST, and local trade licence - handled together',
  workflow_stages = '[
    {"step": 1, "title": "Business details and kitchen address", "timeline": "Day 0", "body": "Turnover, kitchen area, menu type. Ollvy confirms the right FSSAI licence type for your kitchen.", "visual": "checklist", "milestone": "Licence types confirmed, expert assigned"},
    {"step": 2, "title": "Upload documents through the app", "timeline": "Day 0-2", "body": "Business registration proof, kitchen layout plan, food safety plan, equipment list, address proof, and owner ID.", "visual": "upload", "milestone": "Documents verified"},
    {"step": 3, "title": "All applications filed in parallel", "timeline": "Day 2-7", "body": "FSSAI, GST (if needed), and local trade licence filed simultaneously. Application receipts shared in your app.", "visual": "form", "milestone": "All applications submitted"},
    {"step": 4, "title": "Inspection coordinated (FSSAI State/Central)", "timeline": "Day 7-14", "body": "State and Central licences need a physical inspection. Ollvy provides a pre-inspection checklist: pest control, water test, equipment labels.", "visual": "form", "milestone": "Inspection completed"},
    {"step": 5, "title": "All licences issued", "timeline": "Day 10-21", "body": "FSSAI licence number, GST number, and trade licence received. All uploaded to your Ollvy account.", "visual": "stamp", "milestone": "Kitchen ready to list on platforms", "isCompletion": true}
  ]'::jsonb,
  whats_included = '[
    {"title": "FSSAI licence - correct type confirmed upfront", "body": "Basic, State, or Central. Ollvy confirms the type before you pay the government fee."},
    {"title": "GST registration included", "body": "Full GST registration with Ollvy CA assignment and application tracking."},
    {"title": "Local trade licence", "body": "Filed with your municipal authority. Ollvy handles the city-specific requirements."},
    {"title": "Pre-inspection checklist", "body": "For State and Central FSSAI licences. Ollvy provides a checklist of what inspectors check."}
  ]'::jsonb,
  service_risks = '[
    {"icon": "document", "title": "FSSAI inspection failure", "body": "State and Central licences require physical inspection. Common failure points: no pest control certificate, missing water test, unlabelled equipment."},
    {"icon": "alert", "title": "Wrong FSSAI licence type", "body": "Applying for Basic when you need State gets rejected by platforms. Ollvy verifies turnover and operation type before filing."}
  ]'::jsonb,
  profile_personas = '[
    {"label": "New cloud kitchen", "detail": "Starting from scratch. All three licences handled together."},
    {"label": "Scaling from home kitchen", "detail": "Moving to commercial kitchen. State Licence now required."}
  ]'::jsonb,
  faqs = '[
    {"category": "General", "q": "Do I need FSSAI for a small food business?", "a": "Yes. All food businesses need FSSAI. Below Rs. 12 lakh turnover: Basic Registration (no inspection). Above: State Licence with inspection."},
    {"category": "General", "q": "Can I list on Swiggy or Zomato without FSSAI?", "a": "No. Both platforms require a valid FSSAI licence number at onboarding. You cannot list without it."}
  ]'::jsonb
WHERE slug = 'cloud-kitchen-setup';

-- =====================
-- 15. IEPF CONSULTATION
-- =====================
UPDATE service_packages
SET
  tagline = 'Old shares, unclaimed dividends, inherited investments. Find out what you have and exactly how to claim it.',
  short_description = 'Ollvy checks if you have unclaimed shares or dividends in IEPF and tells you exactly how to claim them.',
  workflow_stages = '[
    {"step": 1, "title": "Tell us about your case", "timeline": "Day 0", "body": "Company name, year of investment, folio number if you have it. No documents needed upfront - whatever you remember is enough.", "visual": "checklist", "milestone": "Brief received, expert assigned"},
    {"step": 2, "title": "Ollvy expert checks the IEPF database", "timeline": "Day 0-1", "body": "Ollvy searches the IEPF portal and government company records using your PAN and company details. You get a clear answer: what shares and dividends are there.", "visual": "form", "milestone": "IEPF balance confirmed"},
    {"step": 3, "title": "45-minute call on your case", "timeline": "Day 1-2", "body": "What is claimable, what documents you need, and what the process looks like. Inherited shares? Different process - covered on the call.", "visual": "checklist", "milestone": "Consultation complete"},
    {"step": 4, "title": "Written action plan delivered", "timeline": "Day 2", "body": "Your document checklist - only what your case actually needs. Timeline for the full claim (typically 60 to 90 days).", "visual": "stamp", "milestone": "Action plan delivered", "isCompletion": true}
  ]'::jsonb,
  whats_included = '[
    {"title": "IEPF database check", "comparisonWithout": "Search multiple government portals yourself - easy to miss records", "comparisonWithOllvy": "Ollvy confirms what is there within 24 hours"},
    {"title": "45-minute call on your case", "body": "Covers your specific claim, documents needed, and next steps."},
    {"title": "Your document checklist", "body": "Only the documents your case actually needs."},
    {"title": "Clear timeline and next steps", "body": "How long your claim will take and what to expect."}
  ]'::jsonb,
  service_risks = '[
    {"icon": "document", "title": "Claim rejected for a data mismatch", "body": "The claim form needs your folio number, PAN, and company details to match government records exactly. One mismatch means rejection - you find out 4 to 6 weeks later."},
    {"icon": "alert", "title": "PAN not linked to the shares", "body": "IEPF matches claims against PAN. If your PAN is not linked to the shares, the claim stalls. For inherited shares, your PAN must match the legal heir documents."},
    {"icon": "clock", "title": "Inherited shares need extra steps", "body": "Physical shares must be transferred into your name before you can file. Filing without doing this first is the most common reason inherited claims fail."}
  ]'::jsonb,
  faqs = '[
    {"category": "General", "q": "What is IEPF and how did my shares end up there?", "a": "If dividends go unclaimed for 7 years, the company transfers them - and the shares - to a government fund called IEPF. This happens automatically. You can claim them back."},
    {"category": "General", "q": "Can I get the shares and dividends back?", "a": "Yes. One application covers both shares and dividends. Shares go to your demat account, dividends to your bank. There is no deadline to file."},
    {"category": "Process", "q": "What does the Rs.500 consultation cover?", "a": "Ollvy checks what is in IEPF under your name, then does a 45-minute call covering your case. You get a written action plan and document checklist. Filing the actual claim is a separate service."},
    {"category": "Process", "q": "How long does the full claim take?", "a": "60 to 90 days from filing, if the company responds on time. Inherited and physical certificate claims can take longer."},
    {"category": "Documents", "q": "What documents are needed?", "a": "Depends on your case. Basic: PAN, Aadhaar, cancelled cheque. Physical shares: add the certificate, affidavit, and indemnity bond. Inherited: add death certificate and legal heirship certificate. The consultation gives you your exact list."},
    {"category": "Pricing", "q": "Is there a government fee?", "a": "No. Filing the claim is free. Some cases need a succession certificate or indemnity bond, which have small court or stamp fees."}
  ]'::jsonb
WHERE slug = 'iepf-consultation';
