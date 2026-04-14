-- Restore \n bullets in workflow_stages and service_risks body fields
-- The ProcessStepper component renders bullet points when body contains \n
-- Two previous migrations removed all \n from body fields
-- This migration adds them back where the body has multiple distinct points

-- =====================
-- 1. PVT LTD INCORPORATION
-- =====================
UPDATE service_packages
SET
  workflow_stages = '[
    {"step": 1, "title": "Answer 5 questions - we build your personalised checklist", "timeline": "Day 0", "body": "Number of directors, shareholders, 3 company name options, your state, and starting capital.\nAn Ollvy company secretary is assigned within 4 hours.", "visual": "checklist", "milestone": "Ollvy CS assigned, checklist sent"},
    {"step": 2, "title": "Upload documents through the app", "timeline": "Day 0-2", "body": "PAN and Aadhaar for all directors, address proof for the office, and passport photos.\nOllvy verifies each document before filing.\nMismatches are caught here, not after the government raises a query.", "visual": "upload", "milestone": "Documents verified by Ollvy"},
    {"step": 3, "title": "Digital signatures and Director IDs arranged for all directors", "timeline": "Day 2-4", "body": "Digital signatures (DSC) and Director IDs (DIN) are required by the government.\nOllvy arranges everything and guides each director through a quick video verification.", "visual": "form", "milestone": "Digital signatures and Director IDs ready"},
    {"step": 4, "title": "Company name approved", "timeline": "Day 4-7", "body": "Ollvy files the name reservation with the government.\nApproval takes 2-3 working days.\nIf rejected, we file your alternatives immediately.", "visual": "form", "milestone": "Company name approved"},
    {"step": 5, "title": "Incorporation filed - PAN, TAN, and founding documents in one submission", "timeline": "Day 7-12", "body": "One government form covers incorporation, PAN, TAN, and optional GST pre-registration.\nOllvy drafts the founding documents based on what your business actually does.", "visual": "form", "milestone": "Incorporation application submitted to the government"},
    {"step": 6, "title": "Certificate of Incorporation issued", "timeline": "Day 12-15", "body": "The government issues your Certificate of Incorporation with your company identification number.\nPAN and TAN are generated automatically.\nAll documents go to your Ollvy account.", "visual": "stamp", "isCompletion": true, "milestone": "Company incorporated"}
  ]'::jsonb,
  service_risks = '[
    {"icon": "document", "title": "Director documents don''t match", "body": "PAN name, Aadhaar name, and bank records must match exactly.\n''Rajesh Kumar'' vs ''Rajesh K'' causes rejection.\nOllvy verifies all documents for consistency before filing."},
    {"icon": "clock", "title": "Company name rejected", "body": "The government rejects names similar to existing companies or trademarked terms.\nSubmit 3 distinct options.\nOllvy searches company and trademark databases before filing."},
    {"icon": "building", "title": "Office address proof invalid", "body": "If you rent, you need a no-objection letter from the landlord plus a utility bill.\nHome address works but needs a no-objection letter from a family member if the bill isn''t in the director''s name.\nOllvy verifies this upfront."}
  ]'::jsonb
WHERE slug = 'pvt-ltd-incorporation';


-- =====================
-- 2. LLP INCORPORATION
-- =====================
UPDATE service_packages
SET
  workflow_stages = '[
    {"step": 1, "title": "Answer questions - we build your checklist", "timeline": "Day 0", "body": "Business type, number of partners, 3 LLP name options, your state, and how capital is split between partners.\nOllvy company secretary assigned within 4 hours.", "visual": "checklist", "milestone": "Ollvy CS assigned, checklist sent"},
    {"step": 2, "title": "Upload documents through the app", "timeline": "Day 0-1", "body": "PAN and Aadhaar for all partners, office address proof, and capital split details.\nOllvy verifies each document before filing.", "visual": "upload", "milestone": "Documents verified by Ollvy"},
    {"step": 3, "title": "Partner IDs and digital signatures arranged", "timeline": "Day 1-3", "body": "Each partner needs a government-issued Partner ID (DPIN) and a digital signature (DSC).\nOllvy files all applications and guides each partner through a quick video verification.", "visual": "form", "milestone": "Partner IDs and digital signatures ready"},
    {"step": 4, "title": "LLP registration filed - Agreement and PAN in one submission", "timeline": "Day 4-9", "body": "One government form covers LLP registration, your LLP Agreement, and PAN application.\nOllvy drafts the Agreement based on your actual partner arrangement and files it.", "visual": "form", "milestone": "Registration submitted to the government"},
    {"step": 5, "title": "LLP registration number issued", "timeline": "Day 10-12", "body": "The government issues your Certificate of Incorporation with your LLP number.\nPAN generated automatically.\nAll documents go to your Ollvy account.", "visual": "stamp", "isCompletion": true, "milestone": "Certificate of Incorporation issued"}
  ]'::jsonb,
  service_risks = '[
    {"icon": "document", "title": "Name similarity rejection", "body": "LLP names must be distinct from existing LLPs and companies.\nOllvy checks both registries before submission."},
    {"icon": "alert", "title": "Capital contribution not defined clearly", "body": "The LLP Agreement must specify each partner''s capital contribution and profit share.\nOllvy drafts explicit percentages."},
    {"icon": "clock", "title": "Partner slow on digital signature verification", "body": "The registration form cannot be filed until all partners complete video verification.\nOllvy sends daily reminders."}
  ]'::jsonb
WHERE slug = 'llp-incorporation';


-- =====================
-- 3. GST REGISTRATION
-- =====================
UPDATE service_packages
SET
  workflow_stages = '[
    {"step": 1, "title": "Answer 5 questions - we build your personalised checklist", "timeline": "Day 0", "body": "Business type, state, annual turnover estimate, supply type, and whether you need voluntary registration.\nAn Ollvy CA is assigned within 4 hours.", "visual": "checklist", "milestone": "Ollvy CA assigned, personalised checklist sent"},
    {"step": 2, "title": "Upload documents through the app", "timeline": "Day 0-1", "body": "Ollvy CA sends the list in the app.\nYou upload directly.\nOllvy CA reviews every upload before filing.", "visual": "upload", "milestone": "Documents verified by Ollvy CA"},
    {"step": 3, "title": "Application filed - reference number in 24 hours", "timeline": "Day 1-2", "body": "Ollvy CA files the application on the government portal.\nYour reference number is generated immediately.", "visual": "form", "milestone": "Reference number generated - sent to your app"},
    {"step": 4, "title": "If an officer query arrives, Ollvy CA handles it", "timeline": "Day 3-5", "body": "The GST officer asks for clarification in about 1 in 5 cases.\nOllvy CA responds within 24 hours.\nIncluded in the price.", "visual": "form", "milestone": "Query responded"},
    {"step": 5, "title": "GST number issued", "timeline": "Day 5-7", "body": "The government issues your GST number.\nIt''s permanent - no renewal.\nYour Ollvy compliance calendar is updated automatically.", "visual": "stamp", "isCompletion": true, "milestone": "GST number active"}
  ]'::jsonb,
  service_risks = '[
    {"icon": "document", "title": "Address proof mismatch", "body": "The business address on your documents must match exactly.\nOllvy CA reviews all documents for consistency."},
    {"icon": "clock", "title": "Aadhaar OTP fails", "body": "GST registration requires Aadhaar-based authentication.\nIf mobile number is old, OTP fails.\nOllvy checks this upfront."},
    {"icon": "alert", "title": "Operating without registration", "body": "If turnover has crossed threshold without registration, you are liable for 100% unpaid tax plus Rs. 10,000 minimum penalty."}
  ]'::jsonb
WHERE slug = 'gst-registration';


-- =====================
-- 4. GST MONTHLY FILING
-- =====================
UPDATE service_packages
SET
  workflow_stages = '[
    {"step": 1, "title": "Share your GST portal credentials", "timeline": "Day 0", "body": "You share read-only access.\nOllvy CA reviews your filing history and becomes your dedicated Ollvy CA.", "visual": "checklist", "milestone": "Ollvy CA assigned to your account"},
    {"step": 2, "title": "Upload sales invoices and purchase data", "timeline": "By 8th of month", "body": "Upload sales invoices and purchase register.\nIf you use Tally or Zoho, export and upload directly.", "visual": "upload", "milestone": "Data received for the month"},
    {"step": 3, "title": "Sales return filed by the 11th", "timeline": "9th-11th", "body": "Ollvy CA files your sales return.\nYou receive acknowledgement in the app.", "visual": "form", "milestone": "Sales return filed and acknowledged"},
    {"step": 4, "title": "Tax return filed by the 20th", "timeline": "18th-20th", "body": "Ollvy CA prepares the tax return, calculates what you owe, verifies your credits, and files.", "visual": "form", "milestone": "Tax return filed and acknowledged"},
    {"step": 5, "title": "Monthly compliance report delivered", "timeline": "21st-25th", "body": "After filing, you receive a monthly report: what was filed, when, acknowledgement numbers.", "visual": "checklist", "isCompletion": true, "milestone": "Monthly report delivered"}
  ]'::jsonb,
  service_risks = '[
    {"icon": "clock", "title": "Late filing: Rs. 50/day, minimum Rs. 20,000", "body": "Tax return late fee is Rs. 50/day with minimum Rs. 20,000 per return.\nPlus 18% interest on unpaid tax."},
    {"icon": "document", "title": "Sales return and tax return mismatch", "body": "If figures don''t match, the government system flags it automatically.\nOllvy ensures consistency before filing."},
    {"icon": "alert", "title": "Credits claimed but vendor hasn''t filed", "body": "If your vendor hasn''t filed their sales return, your credits get blocked.\nOllvy checks the credit statement before claiming."}
  ]'::jsonb
WHERE slug = 'gst-monthly';


-- =====================
-- 5. BUSINESS ITR FILING
-- =====================
UPDATE service_packages
SET
  workflow_stages = '[
    {"step": 1, "title": "Upload your financials", "timeline": "Day 0-1", "body": "Profit & loss, balance sheet, and bank statements.\nOllvy CA assigned within 4 hours.", "visual": "upload", "milestone": "Documents received and assigned to Ollvy CA"},
    {"step": 2, "title": "Ollvy CA reviews books and prepares calculation", "timeline": "Day 1-4", "body": "Ollvy CA reviews your profit & loss, checks that asset write-offs are calculated correctly, verifies how director pay is treated for tax, and prepares the full tax calculation.", "visual": "form", "milestone": "Draft tax calculation shared"},
    {"step": 3, "title": "You review, approve, and Ollvy CA files", "timeline": "Day 4-7", "body": "Draft return shared in app.\nYou review and approve.\nOllvy CA files within 24 hours.", "visual": "checklist", "milestone": "Return submitted to the income tax portal"},
    {"step": 4, "title": "Acknowledgement delivered", "timeline": "Day 7-10", "body": "Filing acknowledgement generated immediately.\nShared in app same day.\nCalendar updated.", "visual": "stamp", "isCompletion": true, "milestone": "Filing acknowledgement delivered"}
  ]'::jsonb,
  service_risks = '[
    {"icon": "clock", "title": "Late filing interest - 1% per month", "body": "If you file after October 31 with tax still owed, 1% interest per month kicks in from the original deadline."},
    {"icon": "document", "title": "You lose the right to offset losses", "body": "If your business made a loss and you file late, you lose the right to use it against future profits - permanently."},
    {"icon": "alert", "title": "Defective return notice from the tax department", "body": "Late filers are more likely to get a notice saying the return is defective.\nThat means more paperwork and delays."}
  ]'::jsonb
WHERE slug = 'business-itr';


-- =====================
-- 6. TRADEMARK REGISTRATION
-- =====================
UPDATE service_packages
SET
  workflow_stages = '[
    {"step": 1, "title": "Tell us your brand name and category", "timeline": "Day 0", "body": "Ollvy trademark attorney assigned within 4 hours.\nPreliminary search started immediately.", "visual": "checklist", "milestone": "Attorney assigned, search started"},
    {"step": 2, "title": "Trademark search report delivered", "timeline": "Day 1-2", "body": "Ollvy attorney searches the Registry for identical and similar names in your categories.\nYou receive the search report.", "visual": "form", "milestone": "Search report delivered"},
    {"step": 3, "title": "Application filed with Trademark Registry", "timeline": "Day 3-7", "body": "Ollvy attorney drafts the application, selects the right categories, and files.\nYou receive your application number and filing receipt.", "visual": "form", "milestone": "Application filed, receipt received"},
    {"step": 4, "title": "Examination and publication", "timeline": "6-12 months", "body": "The Registry examines your application.\nIf objections come up, Ollvy attorney responds - included in the price.\nOnce cleared, the mark is published.", "visual": "calendar", "milestone": "Under examination"},
    {"step": 5, "title": "Registration certificate issued", "timeline": "12-18 months total", "body": "Registry issues your registration certificate.\n10-year protection, renewable indefinitely.\nCertificate stored in your Ollvy account.", "visual": "stamp", "isCompletion": true, "milestone": "Trademark registered"}
  ]'::jsonb,
  service_risks = '[
    {"icon": "document", "title": "Similar mark already exists", "body": "If a similar name exists in your category, the government will reject it.\nOllvy''s search catches most conflicts."},
    {"icon": "clock", "title": "Government processing takes 12-18 months", "body": "Filing happens in 7 days, but examination takes 12-18 months.\nOllvy tracks every stage and updates you."},
    {"icon": "alert", "title": "Opposition during publication", "body": "After examination, mark is published for 4 months.\nAnyone can object.\nRare (under 5% of cases)."}
  ]'::jsonb
WHERE slug = 'trademark-registration';


-- =====================
-- 7. MCA ANNUAL FILING
-- =====================
UPDATE service_packages
SET
  workflow_stages = '[
    {"step": 1, "title": "Share your company details", "timeline": "Day 0", "body": "Your company registration number, financial year, annual meeting date, and whether your audit is done.", "visual": "checklist", "milestone": "Ollvy CS assigned"},
    {"step": 2, "title": "Upload financial statements and documents", "timeline": "Day 0-2", "body": "Audited balance sheet, profit & loss, director report, auditor report, and shareholder list.", "visual": "upload", "milestone": "Documents reviewed by Ollvy CS"},
    {"step": 3, "title": "Forms drafted and reviewed", "timeline": "Day 2-4", "body": "Ollvy CS drafts both forms.\nYou review and approve in the app before anything is filed.", "visual": "form", "milestone": "Draft forms sent for approval"},
    {"step": 4, "title": "Filed with the government - filing receipt generated", "timeline": "Day 5-7", "body": "Ollvy CS files both forms.\nFiling receipts generated and shared immediately.", "visual": "stamp", "isCompletion": true, "milestone": "Both forms filed with the government"}
  ]'::jsonb,
  service_risks = '[
    {"icon": "clock", "title": "Annual meeting not held on time", "body": "Annual meeting must be held within 6 months of financial year-end.\nIf delayed, filing is delayed too."},
    {"icon": "document", "title": "Audited financials not ready", "body": "The financials form requires audited financials.\nComplete your audit first."},
    {"icon": "alert", "title": "Late fee accruing daily", "body": "Late filing is Rs. 100/day per form.\nFor both, that''s Rs. 200/day.\nNo ceiling."}
  ]'::jsonb
WHERE slug = 'mca-annual-filing';


-- =====================
-- 8. TDS MONTHLY COMPLIANCE
-- =====================
UPDATE service_packages
SET
  workflow_stages = '[
    {"step": 1, "title": "Share payment register", "timeline": "Day 1-5", "body": "Upload salary, vendor, and rent payments.\nOllvy CA reviews the TDS rates for each.", "visual": "upload", "milestone": "Data received"},
    {"step": 2, "title": "TDS calculated and payment slips prepared", "timeline": "Day 5-6", "body": "Ollvy CA calculates TDS for each payment type.\nPayment slips prepared.", "visual": "form", "milestone": "Payment slips ready"},
    {"step": 3, "title": "Payment slips paid", "timeline": "Day 6-7", "body": "You pay through net banking.\nPayment receipt uploaded to your Ollvy account.", "visual": "stamp", "milestone": "TDS deposited"},
    {"step": 4, "title": "Quarterly return filed", "timeline": "Quarter end", "body": "Ollvy CA files quarterly returns.\nTax certificates for employees and vendors generated after filing.", "visual": "form", "isCompletion": true, "milestone": "TDS return filed"}
  ]'::jsonb,
  service_risks = '[
    {"icon": "clock", "title": "Late deposit - interest accrues", "body": "TDS due by 7th of following month.\n1.5% per month interest on late deposit."},
    {"icon": "document", "title": "Wrong TDS rate", "body": "Deducting too little means you''re liable for the shortfall.\nDeducting too much means the vendor or employee complains."}
  ]'::jsonb
WHERE slug = 'tds-monthly-compliance';


-- =====================
-- 9. MSME / UDYAM REGISTRATION
-- =====================
UPDATE service_packages
SET
  workflow_stages = '[
    {"step": 1, "title": "Share Aadhaar and PAN", "timeline": "Day 0", "body": "Owner Aadhaar for OTP verification and business PAN.\nGST number if you have one.", "visual": "upload", "milestone": "Details received"},
    {"step": 2, "title": "Application filed on Udyam", "timeline": "Day 1", "body": "Application submitted on official government portal with your investment and turnover details.", "visual": "form", "milestone": "Application submitted"},
    {"step": 3, "title": "Udyam certificate issued", "timeline": "Day 1-2", "body": "Certificate with your registration number generated.\nClassification confirmed: Micro, Small, or Medium.", "visual": "stamp", "isCompletion": true, "milestone": "MSME registered"}
  ]'::jsonb,
  service_risks = '[
    {"icon": "document", "title": "Self-declaration based", "body": "Investment and turnover are self-declared.\nKeep records in case of verification."}
  ]'::jsonb
WHERE slug = 'msme-registration';


-- =====================
-- 10. GST CANCELLATION
-- =====================
UPDATE service_packages
SET
  workflow_stages = '[
    {"step": 1, "title": "Tax credit and liability review", "timeline": "Day 0-2", "body": "Ollvy CA reviews your remaining tax credits and pending liabilities.", "visual": "checklist", "milestone": "Tax position confirmed"},
    {"step": 2, "title": "Final return prepared", "timeline": "Day 2-5", "body": "Final return prepared with your remaining stock details and tax credit settlement.", "visual": "form", "milestone": "Final return ready"},
    {"step": 3, "title": "Cancellation filed", "timeline": "Day 5-10", "body": "Cancellation application and final return filed by Ollvy CA.", "visual": "form", "milestone": "Cancellation filed"},
    {"step": 4, "title": "Cancellation order", "timeline": "Day 10-15", "body": "GST officer reviews and issues the cancellation order.", "visual": "stamp", "isCompletion": true, "milestone": "GST cancelled"}
  ]'::jsonb,
  service_risks = '[
    {"icon": "document", "title": "Tax credit settlement required", "body": "Tax credits on remaining stock must be returned to the government.\nCannot be skipped."}
  ]'::jsonb
WHERE slug = 'gst-cancellation';


-- =====================
-- 11. GST REVOCATION
-- =====================
UPDATE service_packages
SET
  workflow_stages = '[
    {"step": 1, "title": "Review cancellation order", "timeline": "Day 0-1", "body": "Ollvy CA confirms the reason and date.\n30-day window calculated.", "visual": "checklist", "milestone": "Order reviewed"},
    {"step": 2, "title": "File pending returns", "timeline": "Day 1-5", "body": "All pending monthly returns filed by Ollvy CA with interest calculated.", "visual": "form", "milestone": "Returns filed"},
    {"step": 3, "title": "Revocation application filed", "timeline": "Day 5-7", "body": "Ollvy CA submits the revocation with confirmation that all returns are current.", "visual": "form", "milestone": "Revocation filed"},
    {"step": 4, "title": "GST restored", "timeline": "Day 7-10", "body": "Registration restored by officer.", "visual": "stamp", "isCompletion": true, "milestone": "GST number active"}
  ]'::jsonb,
  service_risks = '[
    {"icon": "clock", "title": "30-day deadline", "body": "Revocation must be filed within 30 days of cancellation.\nAfter that, a formal appeal is needed - longer and more expensive."}
  ]'::jsonb
WHERE slug = 'gst-revocation';


-- =====================
-- 12. DIN REACTIVATION
-- =====================
UPDATE service_packages
SET
  workflow_stages = '[
    {"step": 1, "title": "Check reason for deactivation", "timeline": "Day 0-1", "body": "Director ID status verified on the government portal.\nYears of outstanding KYC identified.", "visual": "checklist", "milestone": "Reason identified"},
    {"step": 2, "title": "File pending director KYC", "timeline": "Day 1-5", "body": "Director KYC filed for all pending years by Ollvy CS.\nAadhaar OTP required.", "visual": "form", "milestone": "KYC filed"},
    {"step": 3, "title": "Reactivation application", "timeline": "Day 5-7", "body": "Reactivation form filed with the government by Ollvy CS.", "visual": "form", "milestone": "Application filed"},
    {"step": 4, "title": "Director ID reactivated", "timeline": "Day 7-10", "body": "Director ID status changed to Active.\nAll directorships restored.", "visual": "stamp", "isCompletion": true, "milestone": "Director ID active"}
  ]'::jsonb,
  service_risks = '[
    {"icon": "document", "title": "All companies affected", "body": "If your Director ID is deactivated, you cannot act as director in any company until it is restored."}
  ]'::jsonb
WHERE slug = 'din-reactivation';


-- =====================
-- 13. COMPANY NAME CHANGE
-- =====================
UPDATE service_packages
SET
  workflow_stages = '[
    {"step": 1, "title": "Name availability check", "timeline": "Day 0-2", "body": "Ollvy CS searches the government registry and trademark database.", "visual": "checklist", "milestone": "Name available"},
    {"step": 2, "title": "Board and shareholder resolution", "timeline": "Day 2-7", "body": "Shareholder vote (75% must approve).\nOllvy CS drafts all resolutions.", "visual": "form", "milestone": "Shareholder approval obtained"},
    {"step": 3, "title": "Name reserved with the government", "timeline": "Day 7-12", "body": "Name reservation application submitted by Ollvy CS.", "visual": "form", "milestone": "Name reserved"},
    {"step": 4, "title": "Name change application filed", "timeline": "Day 12-18", "body": "Name change application with updated founding document filed by Ollvy CS.", "visual": "form", "milestone": "Application filed"},
    {"step": 5, "title": "New certificate issued", "timeline": "Day 18-20", "body": "Fresh Certificate of Incorporation with your new name.\nRegistration number stays the same.", "visual": "stamp", "isCompletion": true, "milestone": "Name changed"}
  ]'::jsonb,
  service_risks = '[
    {"icon": "document", "title": "Update other registrations", "body": "After the name change, GST, bank accounts, trademark, and other registrations must be updated separately."}
  ]'::jsonb
WHERE slug = 'company-name-change';


-- =====================
-- 14. CLOUD KITCHEN SETUP
-- =====================
UPDATE service_packages
SET
  workflow_stages = '[
    {"step": 1, "title": "Business details and kitchen address", "timeline": "Day 0", "body": "Turnover, kitchen area, menu type.\nOllvy confirms the right FSSAI licence type for your kitchen.", "visual": "checklist", "milestone": "Licence types confirmed, expert assigned"},
    {"step": 2, "title": "Upload documents through the app", "timeline": "Day 0-2", "body": "Business registration proof, kitchen layout plan, food safety plan, equipment list, address proof, and owner ID.", "visual": "upload", "milestone": "Documents verified"},
    {"step": 3, "title": "All applications filed in parallel", "timeline": "Day 2-7", "body": "FSSAI, GST (if needed), and local trade licence filed simultaneously.\nApplication receipts shared in your app.", "visual": "form", "milestone": "All applications submitted"},
    {"step": 4, "title": "Inspection coordinated (FSSAI State/Central)", "timeline": "Day 7-14", "body": "State and Central licences need a physical inspection.\nOllvy provides a pre-inspection checklist: pest control, water test, equipment labels.", "visual": "form", "milestone": "Inspection completed"},
    {"step": 5, "title": "All licences issued", "timeline": "Day 10-21", "body": "FSSAI licence number, GST number, and trade licence received.\nAll uploaded to your Ollvy account.", "visual": "stamp", "milestone": "Kitchen ready to list on platforms", "isCompletion": true}
  ]'::jsonb,
  service_risks = '[
    {"icon": "document", "title": "FSSAI inspection failure", "body": "State and Central licences require physical inspection.\nCommon failure points: no pest control certificate, missing water test, unlabelled equipment."},
    {"icon": "alert", "title": "Wrong FSSAI licence type", "body": "Applying for Basic when you need State gets rejected by platforms.\nOllvy verifies turnover and operation type before filing."}
  ]'::jsonb
WHERE slug = 'cloud-kitchen-setup';


-- =====================
-- 15. IEPF CONSULTATION
-- =====================
UPDATE service_packages
SET
  workflow_stages = '[
    {"step": 1, "title": "Tell us about your case", "timeline": "Day 0", "body": "Company name, year of investment, folio number if you have it.\nNo documents needed upfront - whatever you remember is enough.", "visual": "checklist", "milestone": "Brief received, expert assigned"},
    {"step": 2, "title": "Ollvy expert checks the IEPF database", "timeline": "Day 0-1", "body": "Ollvy searches the IEPF portal and government company records using your PAN and company details.\nYou get a clear answer: what shares and dividends are there.", "visual": "form", "milestone": "IEPF balance confirmed"},
    {"step": 3, "title": "45-minute call on your case", "timeline": "Day 1-2", "body": "What is claimable, what documents you need, and what the process looks like.\nInherited shares? Different process - covered on the call.", "visual": "checklist", "milestone": "Consultation complete"},
    {"step": 4, "title": "Written action plan delivered", "timeline": "Day 2", "body": "Your document checklist - only what your case actually needs.\nTimeline for the full claim (typically 60 to 90 days).", "visual": "stamp", "milestone": "Action plan delivered", "isCompletion": true}
  ]'::jsonb,
  service_risks = '[
    {"icon": "document", "title": "Claim rejected for a data mismatch", "body": "The claim form needs your folio number, PAN, and company details to match government records exactly.\nOne mismatch means rejection - you find out 4 to 6 weeks later."},
    {"icon": "alert", "title": "PAN not linked to the shares", "body": "IEPF matches claims against PAN.\nIf your PAN is not linked to the shares, the claim stalls.\nFor inherited shares, your PAN must match the legal heir documents."},
    {"icon": "clock", "title": "Inherited shares need extra steps", "body": "Physical shares must be transferred into your name before you can file.\nFiling without doing this first is the most common reason inherited claims fail."}
  ]'::jsonb
WHERE slug = 'iepf-consultation';
