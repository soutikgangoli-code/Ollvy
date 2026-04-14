-- Bulletize service_risks body text for all 15 service packages
-- Each risk item: { icon, title, body } with \n line breaks in body

BEGIN;

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

COMMIT;
