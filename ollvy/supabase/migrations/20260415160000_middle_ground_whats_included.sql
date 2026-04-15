-- Fix: middle ground whats_included for services 3-15
-- Services 1 (pvt-ltd) and 2 (llp) already done in 20260415150000
-- Titles use real form names, comparison cards are specific

-- =====================
-- 3. GST REGISTRATION
-- =====================
UPDATE service_packages
SET whats_included = '[
    {"title": "Ollvy CA fills all 23 fields of REG-01", "body": "GST application has 23 fields across 5 tabs. Ollvy CA fills everything. You answer 5 questions.", "comparisonWithout": "23 fields, 5 tabs, 3-4 hours on the GST portal", "comparisonWithOllvy": "5 questions in app - about 4 minutes", "mockVisualType": "status", "mockVisualData": {"label": "GST Application (REG-01)", "row1": "Business details - complete \u2713", "row2": "Promoter/Partner info - complete \u2713", "row3": "Place of business - complete \u2713", "note": "All 23 fields handled by Ollvy CA"}},
    {"title": "ARN shared same day - track on gst.gov.in", "body": "Application Reference Number generated the moment Ollvy CA submits REG-01. Shared immediately.", "mockVisualType": "arn", "mockVisualData": {"label": "Application Reference Number", "value": "AA270325014782R", "status": "Processing", "filed": "Filed: 25 Mar 2025", "verify": "Track at gst.gov.in"}},
    {"title": "Officer queries handled - no extra charge", "body": "GST officer asks for clarification in about 1 in 5 cases. Ollvy CA responds within 24 hours. Included in the price.", "comparisonWithout": "Officer query = you figure out what to submit", "comparisonWithOllvy": "Ollvy CA responds within 24 hours - included"},
    {"title": "Compliance calendar - GSTR-1 and GSTR-3B deadlines", "body": "The moment your GSTIN is active, filing deadlines (11th and 20th) added to your Ollvy calendar.", "mockVisualType": "calendar", "mockVisualData": {"row1": "GSTR-1 - Due 11th of each month", "row2": "GSTR-3B - Due 20th of each month", "note": "Added to your calendar automatically"}}
  ]'::jsonb
WHERE slug = 'gst-registration';

-- =====================
-- 4. GST MONTHLY FILING
-- =====================
UPDATE service_packages
SET whats_included = '[
    {"title": "GSTR-1 filed by the 11th", "body": "All B2B invoices, consumer sales above Rs. 2.5 lakh, and export invoices captured.", "mockVisualType": "status", "mockVisualData": {"row1": "GSTR-1 - March 2025", "row2": "Filed: 10 Mar 2025", "row3": "Ref: AA1234567890123"}},
    {"title": "GSTR-3B filed by the 20th", "body": "Tax calculated, ITC deducted, payment challan generated. Ollvy CA reconciles before filing."},
    {"title": "ITC verified against GSTR-2B every month", "body": "Credits checked against the government auto-generated statement before claiming.", "comparisonWithout": "Claim ITC without checking - get a reversal notice months later", "comparisonWithOllvy": "ITC verified against GSTR-2B before every filing"},
    {"title": "Monthly compliance report", "body": "What was filed, when, acknowledgement numbers, ITC claimed, and tax paid.", "mockVisualType": "receipt", "mockVisualData": {"label": "March 2025 Compliance Report", "row1": "GSTR-1: Filed 10 Mar \u2713", "row2": "GSTR-3B: Filed 18 Mar \u2713", "row3": "Tax Paid: Rs. 45,230"}}
  ]'::jsonb
WHERE slug = 'gst-monthly';

-- =====================
-- 5. BUSINESS ITR FILING
-- =====================
UPDATE service_packages
SET whats_included = '[
    {"title": "Depreciation review - not just data entry", "body": "Ollvy CA verifies depreciation rates on every asset. Wrong rates caught before filing.", "comparisonWithout": "You calculate depreciation, CA just enters it", "comparisonWithOllvy": "Ollvy CA reviews asset schedule and corrects rates"},
    {"title": "Director remuneration treatment", "body": "How director salary vs dividends is treated affects your tax bill. Ollvy CA checks compliance with Companies Act limits."},
    {"title": "Form 26AS cross-check", "body": "Tax credits verified against Form 26AS before filing. Mismatches resolved upfront.", "comparisonWithout": "File without checking - get a demand notice for mismatched credits", "comparisonWithOllvy": "Form 26AS cross-checked before filing"},
    {"title": "Draft ITR shared before filing", "body": "Complete return shared in app - income, deductions, final tax number. You approve before anything is filed.", "comparisonWithout": "ITR filed, acknowledgement sent, no review", "comparisonWithOllvy": "Draft shared, you approve, then Ollvy CA files"},
    {"title": "ITR-V stored permanently", "body": "Filing acknowledgement uploaded to your Ollvy account immediately. Available for loans, visa, or audits.", "mockVisualType": "receipt", "mockVisualData": {"label": "ITR-V Acknowledgement", "row1": "ITR-6 · AY 2025-26", "row2": "Filed: 15 Oct 2025", "row3": "Acknowledgement No: CPC/2025/A12345"}}
  ]'::jsonb
WHERE slug = 'business-itr';

-- =====================
-- 6. TRADEMARK REGISTRATION
-- =====================
UPDATE service_packages
SET whats_included = '[
    {"title": "Trademark search before filing", "body": "Ollvy attorney searches the Registry for identical and similar marks in your classes before you spend the govt fee.", "comparisonWithout": "File blindly, wait months, get rejected", "comparisonWithOllvy": "Search first, modify if needed, then file", "mockVisualType": "status", "mockVisualData": {"row1": "TECHBRIDGE - Class 42", "row2": "No identical marks found \u2713", "row3": "2 similar marks reviewed - no conflict"}},
    {"title": "Class selection guidance", "body": "45 classes under Nice Classification. Ollvy attorney recommends only the ones you need. Most businesses need 1-3."},
    {"title": "Examiner objection response included", "body": "If the Examiner raises objections, Ollvy attorney responds. Included in the price.", "comparisonWithout": "Objection raised - you pay Rs. 5,000-15,000 extra", "comparisonWithOllvy": "Objection response included in service fee"},
    {"title": "Renewal reminder - 10 years out", "body": "Trademark expires 10 years from filing. Ollvy adds renewal reminder 6 months before expiry.", "mockVisualType": "calendar", "mockVisualData": {"row1": "Trademark Renewal - Mar 2035", "row2": "Reminder: Sep 2034", "row3": "Status: Scheduled"}}
  ]'::jsonb
WHERE slug = 'trademark-registration';

-- =====================
-- 7. MCA ANNUAL FILING
-- =====================
UPDATE service_packages
SET whats_included = '[
    {"title": "AOC-4 and MGT-7 - both filed", "body": "AOC-4 (audited financials) and MGT-7 (annual return with shareholding and directors). Both included.", "comparisonWithout": "Book separately - higher cost, two deadlines to track", "comparisonWithOllvy": "Both forms, one price, one Ollvy CS"},
    {"title": "Deadline calculation from your AGM date", "body": "AOC-4 due 30 days after AGM. MGT-7 due 60 days. Ollvy CS tracks both.", "mockVisualType": "calendar", "mockVisualData": {"row1": "AGM by Sep 30 \u2192 AOC-4 by Oct 30", "row2": "MGT-7 by Nov 29", "row3": "Both tracked by Ollvy CS"}},
    {"title": "Penalty calculated before filing", "body": "If filing late, additional fee is Rs. 100/day per form. Ollvy CS calculates exact amount upfront.", "comparisonWithout": "Surprise penalty at MCA portal", "comparisonWithOllvy": "Penalty calculated and disclosed before you approve"},
    {"title": "SRN shared immediately", "body": "Service Request Number is your proof of filing. Both SRNs shared the day forms are submitted."}
  ]'::jsonb
WHERE slug = 'mca-annual-filing';

-- =====================
-- 8. TDS MONTHLY COMPLIANCE
-- =====================
UPDATE service_packages
SET whats_included = '[
    {"title": "TDS calculation - all sections covered", "body": "Section 192 (salary), 194C (contractors), 194J (professionals), 194I (rent), 194A (interest). Correct rates applied."},
    {"title": "Challans prepared with correct codes", "body": "BSR code, assessment year, and minor head must be right. Wrong details cause Form 26AS mismatches for your vendors.", "comparisonWithout": "Wrong BSR code or assessment year - 26AS mismatch and notice", "comparisonWithOllvy": "Correct challan prepared every month"},
    {"title": "24Q and 26Q filed quarterly", "body": "Form 24Q (salary TDS) and Form 26Q (non-salary). Returns reconciled with challans before filing."},
    {"title": "Form 16 and 16A generated", "body": "Form 16 for employees (they need it for their ITR). Form 16A for vendors. Generated after quarterly return is filed.", "comparisonWithout": "Employees chase you for Form 16 at tax time", "comparisonWithOllvy": "Form 16 generated automatically after Q4 return"}
  ]'::jsonb
WHERE slug = 'tds-monthly-compliance';

-- =====================
-- 9. MSME / UDYAM REGISTRATION
-- =====================
UPDATE service_packages
SET whats_included = '[
    {"title": "Udyam certificate with URN", "body": "Official certificate recognised by all banks, government departments, and GeM marketplace."},
    {"title": "Correct NIC code selected", "body": "NIC (industry) code determines which MSME schemes apply. Wrong code = benefits silently rejected.", "comparisonWithout": "Pick the wrong NIC code - every scheme application rejected", "comparisonWithOllvy": "Ollvy selects the correct NIC code for your business activity"},
    {"title": "GSTIN linked automatically", "body": "Your GST registration linked to Udyam during the application."},
    {"title": "CGTMSE and scheme access unlocked", "body": "Collateral-free loans up to Rs. 10 crore (CGTMSE), 45-day payment protection (MSMED Act), 25% GeM reservation."}
  ]'::jsonb
WHERE slug = 'msme-registration';

-- =====================
-- 10. GST CANCELLATION
-- =====================
UPDATE service_packages
SET whats_included = '[
    {"title": "GSTR-10 (final return) filed", "body": "Closing stock details and ITC reversal calculated by Ollvy CA.", "comparisonWithout": "Wrong ITC reversal = demand notice plus 18% interest", "comparisonWithOllvy": "Exact reversal calculated before filing"},
    {"title": "REG-16 (cancellation application) filed", "body": "Cancellation application with reason and supporting details."},
    {"title": "ITC reversal calculated upfront", "body": "ITC on goods in stock at cancellation must be reversed. Ollvy CA calculates before filing - no surprise demands.", "comparisonWithout": "File GSTR-10 with wrong reversal - demand arrives months later", "comparisonWithOllvy": "ITC reversal cross-checked against credit ledger before filing"},
    {"title": "All pending GSTR-1 and GSTR-3B cleared first", "body": "Outstanding returns must be filed before cancellation is accepted. Ollvy CA files them first."}
  ]'::jsonb
WHERE slug = 'gst-cancellation';

-- =====================
-- 11. GST REVOCATION
-- =====================
UPDATE service_packages
SET whats_included = '[
    {"title": "All pending GSTR-1 and GSTR-3B filed", "body": "Every outstanding return filed by Ollvy CA. Interest on late payment calculated and paid.", "comparisonWithout": "File returns yourself - wrong sequence or missed return delays revocation", "comparisonWithOllvy": "All returns filed in correct sequence by Ollvy CA"},
    {"title": "REG-21 revocation application", "body": "Revocation request with explanation of default and proof that all returns are current."},
    {"title": "Interest and late fee calculated upfront", "body": "Rs. 50/day per return (capped at Rs. 10,000) plus 18% interest on unpaid tax. Ollvy CA calculates total before you commit."}
  ]'::jsonb
WHERE slug = 'gst-revocation';

-- =====================
-- 12. DIN REACTIVATION
-- =====================
UPDATE service_packages
SET whats_included = '[
    {"title": "All pending DIR-3 KYC filed", "body": "Every year of missed KYC cleared. Aadhaar OTP verification coordinated for each year.", "comparisonWithout": "Miss one year and the entire DIN stays deactivated", "comparisonWithOllvy": "All years cleared in one go by Ollvy CS"},
    {"title": "DIR-3C reactivation application", "body": "Reactivation form submitted to MCA with all cleared KYC references."},
    {"title": "All directorships unblocked", "body": "One DIN reactivation unblocks every company where you are a director. Ollvy CS verifies MCA status of all companies."}
  ]'::jsonb
WHERE slug = 'din-reactivation';

-- =====================
-- 13. COMPANY NAME CHANGE
-- =====================
UPDATE service_packages
SET whats_included = '[
    {"title": "MCA and trademark search before filing", "body": "Ollvy CS searches company registry and trademark database. Conflicts caught before you spend the RUN fee.", "comparisonWithout": "File RUN, get rejected, Rs. 1,000 wasted", "comparisonWithOllvy": "Name checked against both registries first"},
    {"title": "Special resolution and EGM drafting", "body": "Board resolution, EGM notice (21 days), and special resolution (75% majority) drafted by Ollvy CS."},
    {"title": "MOA amendment", "body": "Clause I (name clause) of Memorandum of Association updated. Stamp duty calculated for your state."},
    {"title": "New Certificate of Incorporation", "body": "Fresh certificate with new name issued by MCA. CIN, PAN, TAN remain unchanged.", "comparisonWithout": "Old certificate, mismatched records across GST, bank, contracts", "comparisonWithOllvy": "New certificate issued. Ollvy provides post-change update checklist"}
  ]'::jsonb
WHERE slug = 'company-name-change';

-- =====================
-- 14. CLOUD KITCHEN SETUP
-- =====================
UPDATE service_packages
SET whats_included = '[
    {"title": "FSSAI licence - correct type confirmed upfront", "body": "Basic (under Rs. 12 lakh), State (Rs. 12 lakh-20 crore), or Central (above Rs. 20 crore). Ollvy confirms before you pay.", "comparisonWithout": "Apply for wrong type - rejected by Swiggy/Zomato", "comparisonWithOllvy": "Correct licence type confirmed based on your turnover"},
    {"title": "GST registration included", "body": "Full REG-01 filing with Ollvy CA. ARN shared same day. Included in the bundle."},
    {"title": "Local trade licence (MCD/BMC/BBMP)", "body": "Filed with your municipal authority. Delhi, Mumbai, Bangalore each have different processes. Ollvy handles your city."},
    {"title": "Pre-inspection checklist for FSSAI", "body": "State/Central licences need physical inspection. Ollvy provides checklist: pest control, water test, equipment labels, food safety plan.", "comparisonWithout": "Failed inspection - entire process restarts", "comparisonWithOllvy": "Pre-inspection checklist covers all standard failure points"},
    {"title": "FSSAI renewal reminder", "body": "FSSAI valid 1-5 years. Renewal reminder set in your Ollvy compliance calendar before expiry."}
  ]'::jsonb
WHERE slug = 'cloud-kitchen-setup';

-- =====================
-- 15. IEPF CONSULTATION
-- =====================
UPDATE service_packages
SET whats_included = '[
    {"title": "IEPF and MCA21 database check", "body": "Expert searches iepf.gov.in and MCA21 using your PAN and company details. Confirms what is credited under your name.", "comparisonWithout": "Hours across government portals with no guarantee of finding the right entry", "comparisonWithOllvy": "Confirmed within 24 hours before the call"},
    {"title": "45-minute expert call - your case only", "body": "Form IEPF-5 walked through for your specific situation. Direct claim, legal heir, or physical certificate - each mapped out."},
    {"title": "Personalised IEPF-5 document checklist", "body": "Your checklist has 5-9 items. The government list has 18 items written for lawyers. Yours covers only what your case needs."},
    {"title": "Written action plan with timeline", "body": "What is claimable, what to file, in what order, and realistic timeline (typically 60-90 days)."}
  ]'::jsonb
WHERE slug = 'iepf-consultation';
