-- =============================================================================
-- Migration: Enhance services 14-32 to match full detail standard
-- All services should have: 4-6 steps, 4-5 inclusions, 3 risks, 4 personas,
-- 5-6 FAQs, review sources, unlocks, and 4-5 keyword chips
-- =============================================================================

-- 14. OPC Incorporation - ENHANCE
UPDATE service_packages SET
  workflow_stages = '[
    {"step": 1, "title": "Answer 5 questions — we build your checklist", "timeline": "Day 0", "body": "Business activity, proposed name (3 options), nominee details, address state. A CS is assigned within 4 hours.", "visual": "checklist", "milestone": "CS assigned, checklist sent"},
    {"step": 2, "title": "Upload documents through the app", "timeline": "Day 0–2", "body": "PAN, Aadhaar for director and nominee, address proof, passport photo. Your CS verifies each before filing.", "visual": "upload", "milestone": "Documents verified by CS"},
    {"step": 3, "title": "DSC and DIN obtained", "timeline": "Day 2–4", "body": "Digital Signature Certificate and Director Identification Number for you. Video verification guided.", "visual": "form", "milestone": "DSC and DIN ready"},
    {"step": 4, "title": "Name approved via RUN", "timeline": "Day 4–7", "body": "Your CS files RUN with MCA. OPC name approval takes 2–3 working days.", "visual": "form", "milestone": "Company name approved"},
    {"step": 5, "title": "SPICe+ filed with nominee form", "timeline": "Day 7–10", "body": "MOA, AOA, INC-3 (nominee consent), PAN, TAN filed together.", "visual": "form", "milestone": "SPICe+ submitted"},
    {"step": 6, "title": "Certificate of Incorporation issued", "timeline": "Day 10–12", "body": "MCA issues CoI with CIN. PAN/TAN generated. All uploaded to your account.", "visual": "stamp", "isCompletion": true, "milestone": "OPC incorporated"}
  ]'::jsonb,
  whats_included = '[
    {"title": "Single director, single shareholder structure", "body": "You own 100% with limited liability. No co-founders needed. Perfect for solopreneurs.", "comparisonWithout": "Sole proprietorship — unlimited personal liability", "comparisonWithOllvy": "OPC — limited liability, company structure"},
    {"title": "Nominee member form handled", "body": "OPC requires INC-3 nominee consent. We draft, get signature, and file. Nominee takes over if something happens.", "mockVisualType": "status", "mockVisualData": {"label": "Nominee Status", "row1": "Nominee: Required for OPC ✓", "row2": "Form INC-3: Drafted ✓", "row3": "Consent: Filed with SPICe+"}},
    {"title": "DSC with video verification guidance", "body": "Digital Signature mandatory. We arrange token and guide you through 15-minute video verification.", "comparisonWithout": "Navigate DSC portal alone — 3+ hours", "comparisonWithOllvy": "Guided in app — 15 minutes"},
    {"title": "PAN and TAN — automatic with incorporation", "body": "Both issued within 24 hours of CoI. No separate applications needed.", "mockVisualType": "receipt", "mockVisualData": {"label": "Incorporation Package", "row1": "CIN: Issued with CoI", "row2": "PAN: Auto-generated", "row3": "TAN: Auto-generated"}},
    {"title": "Compliance calendar auto-populated", "body": "First board meeting, ADT-1, DIR-3 KYC — all deadlines added to your calendar.", "mockVisualType": "calendar", "mockVisualData": {"row1": "First Board Meeting — within 30 days", "row2": "Auditor Appointment — within 30 days", "row3": "DIR-3 KYC — Sep 30 annually"}}
  ]'::jsonb,
  service_risks = '[
    {"icon": "document", "title": "Nominee consent mandatory", "body": "OPC requires a nominee who takes over if something happens to you. INC-3 form must be filed with incorporation. We draft and handle this."},
    {"icon": "clock", "title": "Conversion threshold exists", "body": "OPC must convert to Pvt Ltd if turnover exceeds ₹2Cr or paid-up capital exceeds ₹50L. Plan for growth."},
    {"icon": "building", "title": "Single director means single DSC", "body": "All filings depend on your DSC. If it expires or is lost, you cannot file until replaced."}
  ]'::jsonb,
  profile_personas = '[
    {"label": "Solopreneur", "detail": "Running business alone. Want limited liability without partners."},
    {"label": "Freelancer scaling up", "detail": "Need company structure for larger clients and contracts."},
    {"label": "Side project becoming serious", "detail": "Testing business idea. OPC gives company status without complexity."},
    {"label": "Converting from proprietorship", "detail": "Already running as sole prop. Want liability protection now."}
  ]'::jsonb,
  faqs = '[
    {"category": "General", "q": "What is an OPC?", "a": "One Person Company has single member and director with limited liability. Introduced in Companies Act, 2013."},
    {"category": "General", "q": "OPC vs Sole Proprietorship — which is better?", "a": "OPC offers limited liability and company status. Sole proprietorship has unlimited liability but simpler compliance."},
    {"category": "Process", "q": "Can OPC have employees?", "a": "Yes. OPC can hire unlimited employees. The single-member restriction is for shareholders, not staff."},
    {"category": "Process", "q": "Who can be a nominee?", "a": "Any Indian citizen with valid PAN and Aadhaar. Cannot be existing director in the same OPC."},
    {"category": "Documents", "q": "What documents are needed?", "a": "PAN, Aadhaar, photo for director. Same for nominee. Address proof for registered office."},
    {"category": "After Completion", "q": "What happens after incorporation?", "a": "Open current account, appoint auditor within 30 days, first board meeting within 30 days, DIR-3 KYC annually."}
  ]'::jsonb,
  review_sources = '[
    {"name": "MCA21 Portal", "url": "https://www.mca.gov.in", "description": "Ministry of Corporate Affairs — OPC registration"},
    {"name": "Companies Act, 2013", "url": "https://www.mca.gov.in/Ministry/pdf/CompaniesAct2013.pdf", "description": "Section 3(1)(c): OPC provisions"}
  ]'::jsonb,
  unlocks = '[
    {"name": "GST Registration", "explanation": "Required once billing starts.", "price": "₹8,999", "type": "required", "slug": "gst-registration"},
    {"name": "Current Account", "explanation": "Open company bank account.", "price": "Free", "type": "required", "slug": ""},
    {"name": "Trademark Registration", "explanation": "Protect your brand name.", "price": "₹12,499", "type": "beneficial", "slug": "trademark-registration"}
  ]'::jsonb,
  review_keyword_chips = ARRAY['✓ Quick incorporation', '✓ Nominee form handled', '✓ PAN same day', '✓ CS was responsive', '✓ No hidden charges']
WHERE slug = 'opc-incorporation';

-- 15. Partnership Registration - ENHANCE
UPDATE service_packages SET
  workflow_stages = '[
    {"step": 1, "title": "Partner details collected", "timeline": "Day 0–1", "body": "Names, capital contribution, profit sharing ratio, roles. Your CS calls to clarify terms.", "visual": "checklist", "milestone": "Details received"},
    {"step": 2, "title": "Deed drafted — custom, not template", "timeline": "Day 1–3", "body": "Partnership deed with profit ratio, roles, dispute resolution, exit clauses. Based on your actual arrangement.", "visual": "form", "milestone": "Draft deed shared"},
    {"step": 3, "title": "You review and approve", "timeline": "Day 3–4", "body": "Review deed in app. Request changes. Your CS incorporates feedback.", "visual": "checklist", "milestone": "Deed approved"},
    {"step": 4, "title": "Stamp paper arranged", "timeline": "Day 4–5", "body": "We arrange appropriate value stamp paper for your state. Partners sign.", "visual": "form", "milestone": "Deed executed"},
    {"step": 5, "title": "Registered with Registrar of Firms", "timeline": "Day 5–7", "body": "Filed with state Registrar. Registration certificate issued.", "visual": "stamp", "isCompletion": true, "milestone": "Firm registered"}
  ]'::jsonb,
  whats_included = '[
    {"title": "Custom partnership deed — not template", "body": "Drafted based on your specific terms — profit ratio, roles, exit clauses, dispute resolution. Not a one-size-fits-all.", "comparisonWithout": "Generic 50-50 template that causes disputes later", "comparisonWithOllvy": "Custom deed reflecting your actual agreement"},
    {"title": "Stamp paper arranged", "body": "Partnership deed must be on appropriate value stamp paper. Value varies by state. We handle procurement.", "mockVisualType": "receipt", "mockVisualData": {"label": "Stamp Duty", "row1": "State: Maharashtra", "row2": "Deed Value: ₹5,00,000", "row3": "Stamp: ₹500 (0.1%)"}},
    {"title": "Profit sharing explicitly defined", "body": "Vague profit clauses cause disputes. We draft explicit percentages with scenarios for losses.", "comparisonWithout": "Verbal agreement — disputes inevitable", "comparisonWithOllvy": "Written, signed, legally binding"},
    {"title": "Registrar filing handled", "body": "Filed with Registrar of Firms in your state. Registration certificate issued.", "mockVisualType": "status", "mockVisualData": {"row1": "Application: Filed ✓", "row2": "Processing: 2-3 days", "row3": "Certificate: Issued"}},
    {"title": "Compliance guidance included", "body": "Partnership ITR (ITR-5), GST if applicable, TDS obligations — we explain what comes next."}
  ]'::jsonb,
  service_risks = '[
    {"icon": "document", "title": "Partners have unlimited liability", "body": "Unlike LLP or Pvt Ltd, partners are personally liable for firm debts. Consider LLP if you want limited liability."},
    {"icon": "alert", "title": "Profit sharing must be explicit", "body": "Disputes arise from vague profit clauses. We draft explicit terms with scenarios."},
    {"icon": "clock", "title": "Registration is optional but recommended", "body": "Unregistered firms cannot sue third parties. Registration provides legal standing."}
  ]'::jsonb,
  profile_personas = '[
    {"label": "Family partnership", "detail": "Running business with family members. Need formal structure."},
    {"label": "Professional practice", "detail": "CA/CS/lawyers forming practice. Partnership is common structure."},
    {"label": "Equal partners", "detail": "Two partners, 50-50 split. Deed handles deadlock scenarios."},
    {"label": "Unequal contribution", "detail": "Different capital contributions. Profit share can match or differ."}
  ]'::jsonb,
  faqs = '[
    {"category": "General", "q": "Do partners have unlimited liability?", "a": "Yes. Partners are personally liable for firm debts. For limited liability, consider LLP instead."},
    {"category": "General", "q": "Partnership vs LLP — which should I choose?", "a": "Partnership if simpler compliance is priority. LLP if you want limited liability."},
    {"category": "Process", "q": "Is registration mandatory?", "a": "No. But unregistered firms cannot sue third parties. Registration recommended."},
    {"category": "Process", "q": "How many partners are required?", "a": "Minimum 2, maximum 50 (for banking, max 10)."},
    {"category": "Documents", "q": "What documents are needed?", "a": "PAN, Aadhaar, address proof for all partners. Registered office address proof."},
    {"category": "After Completion", "q": "What are annual obligations?", "a": "ITR-5 by July 31. GST returns if registered. No MCA filings required."}
  ]'::jsonb,
  review_sources = '[
    {"name": "Indian Partnership Act, 1932", "url": "https://www.indiacode.nic.in", "description": "Full text of Partnership Act"},
    {"name": "Registrar of Firms", "url": "", "description": "State-specific registration authority"}
  ]'::jsonb,
  unlocks = '[
    {"name": "GST Registration", "explanation": "Required for billing above threshold.", "price": "₹8,999", "type": "required", "slug": "gst-registration"},
    {"name": "Current Account", "explanation": "Open firm bank account.", "price": "Free", "type": "required", "slug": ""},
    {"name": "Convert to LLP", "explanation": "If you want limited liability later.", "price": "₹12,999", "type": "beneficial", "slug": "llp-incorporation"}
  ]'::jsonb,
  review_keyword_chips = ARRAY['✓ Deed was thorough', '✓ Quick registration', '✓ Profit split clear', '✓ CS explained everything', '✓ No hidden fees']
WHERE slug = 'partnership-registration';

-- 16. MSME/Udyam Registration - ENHANCE
UPDATE service_packages SET
  workflow_stages = '[
    {"step": 1, "title": "Share Aadhaar and business PAN", "timeline": "Day 0", "body": "Owner Aadhaar for OTP verification, business PAN. That''s all we need.", "visual": "upload", "milestone": "Details received"},
    {"step": 2, "title": "Verify eligibility", "timeline": "Day 0", "body": "We check if your investment and turnover qualify for micro/small/medium category.", "visual": "checklist", "milestone": "Eligibility confirmed"},
    {"step": 3, "title": "Application filed on Udyam portal", "timeline": "Day 1", "body": "Application submitted on official portal. OTP verification completed.", "visual": "form", "milestone": "Application submitted"},
    {"step": 4, "title": "Udyam certificate issued", "timeline": "Day 1–2", "body": "Certificate with Unique Registration Number (URN) generated instantly.", "visual": "stamp", "isCompletion": true, "milestone": "MSME registered"}
  ]'::jsonb,
  whats_included = '[
    {"title": "Udyam certificate with URN", "body": "Official certificate with Udyam Registration Number. Permanent, no renewal needed.", "mockVisualType": "status", "mockVisualData": {"label": "Udyam Certificate", "row1": "URN: UDYAM-MH-01-0012345 ✓", "row2": "Category: Small Enterprise", "row3": "Valid: Lifetime"}},
    {"title": "Automatic GST linking", "body": "Your GSTIN is linked to Udyam registration automatically during filing.", "comparisonWithout": "Manual linking — additional steps", "comparisonWithOllvy": "Auto-linked during registration"},
    {"title": "Access to government schemes", "body": "Priority sector lending, subsidy schemes, tender reservations, lower interest rates.", "mockVisualType": "checklist", "mockVisualData": {"row1": "Priority lending: Eligible ✓", "row2": "CGTMSE guarantee: Eligible ✓", "row3": "Govt tenders: 25% reserved"}},
    {"title": "Category classification explained", "body": "Micro/Small/Medium based on investment and turnover. We explain which you qualify for."},
    {"title": "Same-day certificate", "body": "Unlike most registrations, Udyam certificate is issued instantly after filing."}
  ]'::jsonb,
  service_risks = '[
    {"icon": "document", "title": "Self-declaration based", "body": "Investment and turnover are self-declared. Keep records for audit if questioned."},
    {"icon": "alert", "title": "Category can change", "body": "If turnover/investment crosses threshold, your category changes. Update registration."},
    {"icon": "clock", "title": "Aadhaar OTP required", "body": "Registration requires Aadhaar-linked mobile for OTP. Ensure number is active."}
  ]'::jsonb,
  profile_personas = '[
    {"label": "Small manufacturer", "detail": "Under ₹10Cr investment in plant/machinery. Qualifies as small enterprise."},
    {"label": "Service enterprise", "detail": "IT, consulting, professional services. Classification based on equipment investment."},
    {"label": "New startup", "detail": "Just starting. MSME benefits from day one."},
    {"label": "Existing business", "detail": "Running for years without registration. Time to get official status."}
  ]'::jsonb,
  faqs = '[
    {"category": "General", "q": "What are MSME benefits?", "a": "Priority sector lending, lower interest rates, govt tender reservation, subsidy schemes, CGTMSE guarantee."},
    {"category": "General", "q": "What is Udyam vs MSME?", "a": "Same thing. Udyam is the new name for MSME registration portal."},
    {"category": "Process", "q": "Is Udyam registration free?", "a": "Free on official portal. Our fee is for filing assistance and category guidance."},
    {"category": "Process", "q": "How long is Udyam valid?", "a": "Lifetime validity. No renewal required. Update if category changes."},
    {"category": "Documents", "q": "What documents are needed?", "a": "Owner Aadhaar and business PAN. That''s all."},
    {"category": "Eligibility", "q": "What are the thresholds?", "a": "Micro: Up to ₹1Cr investment, ₹5Cr turnover. Small: Up to ₹10Cr investment, ₹50Cr turnover. Medium: Up to ₹50Cr investment, ₹250Cr turnover."}
  ]'::jsonb,
  review_sources = '[
    {"name": "Udyam Portal", "url": "https://udyamregistration.gov.in", "description": "Official MSME registration portal"},
    {"name": "MSME Development Act, 2006", "url": "https://msme.gov.in", "description": "MSME classification and benefits"}
  ]'::jsonb,
  unlocks = '[
    {"name": "GST Registration", "explanation": "Required for billing.", "price": "₹8,999", "type": "required", "slug": "gst-registration"},
    {"name": "Startup India", "explanation": "Additional benefits if innovation-based.", "price": "₹7,999", "type": "beneficial", "slug": "startup-india"},
    {"name": "Trademark Registration", "explanation": "MSME discount on govt fees.", "price": "₹12,499", "type": "beneficial", "slug": "trademark-registration"}
  ]'::jsonb,
  review_keyword_chips = ARRAY['✓ Certificate same day', '✓ Very quick', '✓ Benefits explained', '✓ No documents hassle', '✓ Free govt portal used']
WHERE slug = 'msme-registration';

-- 21. GST Cancellation - ENHANCE (was minimal)
UPDATE service_packages SET
  workflow_stages = '[
    {"step": 1, "title": "ITC and liability review", "timeline": "Day 0–2", "body": "Your CA checks ITC balance, pending liabilities, and determines reversal amount.", "visual": "checklist", "milestone": "Liability assessed"},
    {"step": 2, "title": "Pending returns filed", "timeline": "Day 2–5", "body": "All pending GSTR-1 and GSTR-3B filed before cancellation can proceed.", "visual": "form", "milestone": "Returns up to date"},
    {"step": 3, "title": "Final return GSTR-10 prepared", "timeline": "Day 5–8", "body": "Stock statement prepared. ITC on closing stock reversed. Final return drafted.", "visual": "form", "milestone": "GSTR-10 ready"},
    {"step": 4, "title": "REG-16 cancellation filed", "timeline": "Day 8–12", "body": "Voluntary cancellation application filed on GST portal.", "visual": "form", "milestone": "Application submitted"},
    {"step": 5, "title": "Cancellation order received", "timeline": "Day 12–15", "body": "GST officer processes. Cancellation order issued. GSTIN deactivated.", "visual": "stamp", "isCompletion": true, "milestone": "GST cancelled"}
  ]'::jsonb,
  whats_included = '[
    {"title": "Complete liability assessment", "body": "Before cancellation, we check what you owe — pending tax, ITC reversal, interest. No surprises.", "mockVisualType": "receipt", "mockVisualData": {"label": "Pre-Cancellation Summary", "row1": "Pending GSTR-3B: ₹0", "row2": "ITC Reversal: ₹12,450", "row3": "Interest: ₹0"}},
    {"title": "Pending returns filed first", "body": "Cancellation blocked if returns pending. We file all outstanding GSTR-1 and GSTR-3B.", "comparisonWithout": "Apply without filing — rejected", "comparisonWithOllvy": "Returns cleared, then cancel"},
    {"title": "GSTR-10 final return", "body": "Stock statement and ITC reversal calculated. Proper closure of GST account.", "mockVisualType": "status", "mockVisualData": {"row1": "Closing Stock: Declared ✓", "row2": "ITC Reversal: Calculated ✓", "row3": "GSTR-10: Filed ✓"}},
    {"title": "REG-16 application handled", "body": "Voluntary cancellation form with reason and effective date. We handle the portal."},
    {"title": "Confirmation and documentation", "body": "Cancellation order uploaded to your account. Records preserved for future reference."}
  ]'::jsonb,
  service_risks = '[
    {"icon": "document", "title": "ITC reversal mandatory", "body": "ITC on closing stock must be reversed. Amount can be significant. We calculate upfront."},
    {"icon": "clock", "title": "Returns must be current", "body": "Cannot cancel with pending returns. We file all before applying."},
    {"icon": "alert", "title": "Cancellation is permanent", "body": "Once cancelled, you need fresh registration to restart GST. Plan carefully."}
  ]'::jsonb,
  profile_personas = '[
    {"label": "Closing business", "detail": "Winding down operations. Need clean GST closure."},
    {"label": "Turnover dropped", "detail": "Below threshold now. Voluntary cancellation saves compliance burden."},
    {"label": "Moving to composition", "detail": "Want to switch to composition scheme. Need to cancel and re-register."},
    {"label": "Wrong registration", "detail": "Registered by mistake or prematurely. Clean exit needed."}
  ]'::jsonb,
  faqs = '[
    {"category": "General", "q": "What happens to ITC on cancellation?", "a": "ITC on closing stock must be reversed and paid. We calculate this before applying."},
    {"category": "General", "q": "Can I cancel and re-register?", "a": "Yes. But you need to apply fresh. 90-day gap recommended to avoid complications."},
    {"category": "Process", "q": "What is GSTR-10?", "a": "Final return filed within 3 months of cancellation. Stock details and ITC reversal."},
    {"category": "Process", "q": "How long does cancellation take?", "a": "15 working days if no queries. Longer if officer raises clarifications."},
    {"category": "Documents", "q": "What documents are needed?", "a": "GST portal credentials, stock statement, reason for cancellation."},
    {"category": "After Completion", "q": "What are my obligations after cancellation?", "a": "File GSTR-10 within 3 months. Keep records for 6 years."}
  ]'::jsonb,
  review_sources = '[
    {"name": "GST Portal", "url": "https://www.gst.gov.in", "description": "Official GST cancellation process"},
    {"name": "CGST Act, Section 29", "url": "https://www.cbic.gov.in", "description": "Cancellation of registration provisions"}
  ]'::jsonb,
  unlocks = '[
    {"name": "Company Closure", "explanation": "If closing entire business.", "price": "₹14,999", "type": "beneficial", "slug": "company-closure"}
  ]'::jsonb,
  review_keyword_chips = ARRAY['✓ ITC calculated properly', '✓ Returns filed first', '✓ Clean cancellation', '✓ Documentation complete', '✓ CA was thorough']
WHERE slug = 'gst-cancellation';

-- 22. GST Revocation - ENHANCE (was minimal)
UPDATE service_packages SET
  workflow_stages = '[
    {"step": 1, "title": "Review cancellation order", "timeline": "Day 0–1", "body": "Understand why GST was cancelled — non-filing, fraud, officer action.", "visual": "checklist", "milestone": "Cause identified"},
    {"step": 2, "title": "Check revocation eligibility", "timeline": "Day 1", "body": "Revocation must be filed within 30 days of cancellation. We verify timeline.", "visual": "checklist", "milestone": "Eligibility confirmed"},
    {"step": 3, "title": "File all pending returns", "timeline": "Day 1–5", "body": "All GSTR-1, GSTR-3B from cancellation date to now. With interest and late fees.", "visual": "form", "milestone": "Returns filed"},
    {"step": 4, "title": "REG-21 revocation filed", "timeline": "Day 5–8", "body": "Application for revocation with reason and compliance proof.", "visual": "form", "milestone": "Application submitted"},
    {"step": 5, "title": "GSTIN restored", "timeline": "Day 8–10", "body": "Officer approves. GSTIN reactivated. Business continues.", "visual": "stamp", "isCompletion": true, "milestone": "GST restored"}
  ]'::jsonb,
  whats_included = '[
    {"title": "Cancellation cause analysis", "body": "We review the cancellation order and identify exact reason — missed returns, fraud allegation, etc.", "mockVisualType": "status", "mockVisualData": {"label": "Cancellation Analysis", "row1": "Reason: Non-filing of returns", "row2": "Missed: GSTR-3B Jun, Jul, Aug", "row3": "Cancellation Date: 15 Sep 2025"}},
    {"title": "All pending returns filed", "body": "Revocation requires all returns up to date. We file every missed GSTR-1 and GSTR-3B.", "comparisonWithout": "Apply without returns — rejected", "comparisonWithOllvy": "Returns filed, then revoke"},
    {"title": "Interest and late fee calculated", "body": "Missed returns attract interest and fees. We calculate total liability before you commit.", "mockVisualType": "receipt", "mockVisualData": {"label": "Revocation Cost", "row1": "Pending Tax: ₹45,000", "row2": "Interest (18%): ₹2,700", "row3": "Late Fee: ₹3,000"}},
    {"title": "REG-21 application", "body": "Revocation application with reason for missing returns and commitment to compliance."},
    {"title": "Faster than fresh registration", "body": "Revocation takes 10 days. Fresh registration takes 7+ days plus you lose GSTIN history."}
  ]'::jsonb,
  service_risks = '[
    {"icon": "clock", "title": "30-day deadline is strict", "body": "Revocation must be filed within 30 days of cancellation order. After that, fresh registration only."},
    {"icon": "document", "title": "All returns must be filed first", "body": "Cannot revoke with pending returns. Interest and late fees apply."},
    {"icon": "alert", "title": "Fraud-based cancellation harder", "body": "If cancelled for fraud, revocation may require personal hearing. We prepare documents."}
  ]'::jsonb,
  profile_personas = '[
    {"label": "Missed filing deadline", "detail": "Forgot to file for 3+ months. GST cancelled automatically."},
    {"label": "CA went silent", "detail": "Previous CA stopped filing. You discovered cancellation."},
    {"label": "Out of country", "detail": "Were abroad. Didn''t receive notices. GST cancelled."},
    {"label": "Health emergency", "detail": "Personal crisis. Compliance lapsed. Need to restore."}
  ]'::jsonb,
  faqs = '[
    {"category": "Urgency", "q": "What is the time limit?", "a": "30 days from cancellation order date. Not a day more."},
    {"category": "General", "q": "Can I revoke after 30 days?", "a": "No. You must apply for fresh registration. Lose your old GSTIN."},
    {"category": "Process", "q": "What returns need to be filed?", "a": "All GSTR-1 and GSTR-3B from cancellation date to present. With interest."},
    {"category": "Process", "q": "How much is interest and late fee?", "a": "Interest: 18% per annum. Late fee: ₹50/day per return (max ₹5,000 each)."},
    {"category": "Documents", "q": "What documents are needed?", "a": "Cancellation order, proof of filing all returns, revocation application."},
    {"category": "After Completion", "q": "What happens after revocation?", "a": "GSTIN reactivated. File returns on time going forward. Consider our monthly service."}
  ]'::jsonb,
  review_sources = '[
    {"name": "GST Portal", "url": "https://www.gst.gov.in", "description": "Revocation application process"},
    {"name": "CGST Rules, Rule 23", "url": "https://www.cbic.gov.in", "description": "Revocation of cancellation procedure"}
  ]'::jsonb,
  unlocks = '[
    {"name": "GST Monthly Filing", "explanation": "Never miss returns again.", "price": "From ₹2,999/mo", "type": "required", "slug": "gst-monthly-50l"}
  ]'::jsonb,
  review_keyword_chips = ARRAY['✓ Deadline met', '✓ Returns filed quickly', '✓ GSTIN restored', '✓ Total cost clear upfront', '✓ CA was responsive']
WHERE slug = 'gst-revocation';

-- 23. Company Strike-Off - ENHANCE (was minimal)
UPDATE service_packages SET
  workflow_stages = '[
    {"step": 1, "title": "Compliance status review", "timeline": "Day 0–5", "body": "Check all pending returns — MCA, GST, IT. List what needs filing before strike-off.", "visual": "checklist", "milestone": "Compliance gaps identified"},
    {"step": 2, "title": "File pending compliances", "timeline": "Day 5–20", "body": "All AOC-4, MGT-7, DIR-3 KYC filed. GST cancelled. ITR filed.", "visual": "form", "milestone": "All returns filed"},
    {"step": 3, "title": "Board and shareholder resolutions", "timeline": "Day 20–30", "body": "Pass resolutions for strike-off. No objection from creditors.", "visual": "form", "milestone": "Resolutions passed"},
    {"step": 4, "title": "Bank account closure", "timeline": "Day 30–40", "body": "Close current account. Transfer remaining funds.", "visual": "checklist", "milestone": "Bank closed"},
    {"step": 5, "title": "STK-2 filed", "timeline": "Day 40–50", "body": "Strike-off application with affidavit and indemnity bond.", "visual": "form", "milestone": "STK-2 submitted"},
    {"step": 6, "title": "Strike-off order received", "timeline": "Day 50–90", "body": "ROC processes. Name removed from register.", "visual": "stamp", "isCompletion": true, "milestone": "Company struck off"}
  ]'::jsonb,
  whats_included = '[
    {"title": "Complete compliance cleanup", "body": "All pending MCA returns filed first. Strike-off impossible without clean compliance.", "mockVisualType": "status", "mockVisualData": {"label": "Pre-Strike-Off Compliance", "row1": "AOC-4 FY 2023-24: Filed ✓", "row2": "MGT-7 FY 2023-24: Filed ✓", "row3": "DIR-3 KYC: Current ✓"}},
    {"title": "GST cancellation included", "body": "GST must be cancelled before strike-off. We handle REG-16 and GSTR-10.", "comparisonWithout": "Apply for strike-off — rejected for active GST", "comparisonWithOllvy": "GST cancelled first, then strike-off"},
    {"title": "Resolutions drafted", "body": "Board resolution and shareholder resolution for voluntary strike-off. Proper minutes maintained."},
    {"title": "STK-2 with affidavit", "body": "Application with directors'' affidavit and indemnity bond. No objections from creditors/employees.", "mockVisualType": "form", "mockVisualData": {"label": "STK-2 Checklist", "row1": "Form STK-2: Drafted ✓", "row2": "Affidavit: Notarized ✓", "row3": "Indemnity Bond: Signed ✓"}},
    {"title": "ROC processing tracked", "body": "We track status and respond to any queries from ROC during processing."}
  ]'::jsonb,
  service_risks = '[
    {"icon": "clock", "title": "Takes 3+ months total", "body": "ROC processing alone takes 2 months. Plan for 90-day minimum timeline."},
    {"icon": "document", "title": "All compliances must be current", "body": "Strike-off rejected if any returns pending. We file everything first."},
    {"icon": "alert", "title": "Directors remain liable", "body": "Directors remain liable for pre-strike-off issues. Ensure all dues cleared."}
  ]'::jsonb,
  profile_personas = '[
    {"label": "Dormant company", "detail": "No activity for 2+ years. Just paying compliance costs."},
    {"label": "Failed venture", "detail": "Business didn''t work out. Want clean closure."},
    {"label": "Merged operations", "detail": "Operations moved to another entity. This company redundant."},
    {"label": "Partnership dispute", "detail": "Partners split. Better to close than fight."}
  ]'::jsonb,
  faqs = '[
    {"category": "General", "q": "What is strike-off?", "a": "Removal of company name from ROC register. Company ceases to exist."},
    {"category": "General", "q": "Strike-off vs winding up — difference?", "a": "Strike-off is simpler for dormant companies. Winding up for companies with liabilities."},
    {"category": "Process", "q": "How long does strike-off take?", "a": "90 days minimum. Compliance filing + ROC processing."},
    {"category": "Process", "q": "What if there are pending liabilities?", "a": "Clear all liabilities first. Directors personally liable if not."},
    {"category": "Documents", "q": "What is affidavit for?", "a": "Directors declare no pending liabilities, no ongoing litigation."},
    {"category": "After Completion", "q": "Can strike-off be reversed?", "a": "Within 20 years, can apply for revival. Complex process."}
  ]'::jsonb,
  review_sources = '[
    {"name": "MCA21 Portal", "url": "https://www.mca.gov.in", "description": "Strike-off application filing"},
    {"name": "Companies Act, Section 248", "url": "https://www.mca.gov.in/Ministry/pdf/CompaniesAct2013.pdf", "description": "Strike-off provisions"}
  ]'::jsonb,
  unlocks = '[
    {"name": "GST Cancellation", "explanation": "Must be done before strike-off.", "price": "₹2,999", "type": "required", "slug": "gst-cancellation"}
  ]'::jsonb,
  review_keyword_chips = ARRAY['✓ Compliance cleared', '✓ Clean closure', '✓ Timeline was clear', '✓ CS handled everything', '✓ No surprises']
WHERE slug = 'company-closure';

-- 26. Accounting & Bookkeeping - ENHANCE (was minimal)
UPDATE service_packages SET
  workflow_stages = '[
    {"step": 1, "title": "Share bank statements and invoices", "timeline": "Day 1–3", "body": "Upload bank statement, sales invoices, purchase bills. We organize everything.", "visual": "upload", "milestone": "Data received"},
    {"step": 2, "title": "Transactions categorized", "timeline": "Day 3–5", "body": "Every transaction mapped — sales, purchases, expenses, capital.", "visual": "form", "milestone": "Categorization done"},
    {"step": 3, "title": "Entries passed in books", "timeline": "Day 5–8", "body": "All entries recorded. Double-entry bookkeeping maintained.", "visual": "form", "milestone": "Books updated"},
    {"step": 4, "title": "Bank reconciliation completed", "timeline": "Day 8–9", "body": "Books matched with bank statement. Discrepancies identified.", "visual": "checklist", "milestone": "Bank reconciled"},
    {"step": 5, "title": "Monthly financials delivered", "timeline": "Day 10", "body": "P&L, Balance Sheet, Trial Balance shared. Ready for review.", "visual": "stamp", "isCompletion": true, "milestone": "Financials delivered"}
  ]'::jsonb,
  whats_included = '[
    {"title": "Complete transaction recording", "body": "Every sale, purchase, expense, receipt recorded. Nothing missed.", "mockVisualType": "receipt", "mockVisualData": {"label": "March 2025 Summary", "row1": "Transactions: 156", "row2": "Sales: ₹12,45,000", "row3": "Expenses: ₹8,34,000"}},
    {"title": "Bank reconciliation every month", "body": "Your books match your bank statement. Discrepancies flagged immediately.", "comparisonWithout": "Books and bank don''t match — audit nightmare", "comparisonWithOllvy": "Reconciled monthly — audit-ready always"},
    {"title": "Monthly P&L and Balance Sheet", "body": "Know where you stand financially every month. Not just at year-end.", "mockVisualType": "status", "mockVisualData": {"label": "Monthly Financials", "row1": "P&L: Ready ✓", "row2": "Balance Sheet: Ready ✓", "row3": "Trial Balance: Ready ✓"}},
    {"title": "GST-ready books", "body": "Transactions mapped with GST treatment. ITC and output tax clear."},
    {"title": "Year-end audit preparation", "body": "When audit time comes, your books are ready. No last-minute scramble."}
  ]'::jsonb,
  service_risks = '[
    {"icon": "clock", "title": "Data must be provided on time", "body": "Late data = delayed books. We need bank statements by 5th of each month."},
    {"icon": "document", "title": "Invoices must be complete", "body": "Missing invoices mean incomplete books. We flag gaps for you to fill."},
    {"icon": "alert", "title": "Quality depends on inputs", "body": "We record what you provide. Ensure all transactions are shared."}
  ]'::jsonb,
  profile_personas = '[
    {"label": "Startup", "detail": "Need proper books from day one. Investor-ready accounting."},
    {"label": "Small business", "detail": "Too busy running business. Want books handled professionally."},
    {"label": "Freelancer", "detail": "Income from multiple sources. Need organized records."},
    {"label": "Previous accountant left", "detail": "Accounts were neglected. Need someone reliable."}
  ]'::jsonb,
  faqs = '[
    {"category": "General", "q": "What software do you use?", "a": "We work with Tally, Zoho Books, or maintain in cloud-based system. Your preference."},
    {"category": "General", "q": "What is included in bookkeeping?", "a": "Recording transactions, bank reconciliation, monthly P&L, Balance Sheet."},
    {"category": "Pricing", "q": "What is the pricing based on?", "a": "Number of transactions. Base price for up to 100 transactions/month."},
    {"category": "Process", "q": "What data do I need to provide?", "a": "Bank statements, sales invoices, purchase bills, expense receipts."},
    {"category": "Process", "q": "When do I get monthly financials?", "a": "By 10th of following month if you provide data by 5th."},
    {"category": "After Completion", "q": "How does audit work?", "a": "Your auditor gets clean books. We coordinate and answer queries."}
  ]'::jsonb,
  review_sources = '[
    {"name": "Accounting Standards", "url": "https://www.icai.org", "description": "ICAI Accounting Standards followed"}
  ]'::jsonb,
  unlocks = '[
    {"name": "GST Monthly Filing", "explanation": "Seamless integration with bookkeeping.", "price": "From ₹2,999/mo", "type": "beneficial", "slug": "gst-monthly-50l"},
    {"name": "Business ITR", "explanation": "Books ready for ITR filing.", "price": "₹11,999", "type": "required", "slug": "business-itr"},
    {"name": "Statutory Audit", "explanation": "Clean books for easy audit.", "price": "₹24,999", "type": "required", "slug": "statutory-audit"}
  ]'::jsonb,
  review_keyword_chips = ARRAY['✓ Books always updated', '✓ Monthly financials on time', '✓ Bank reconciled', '✓ Audit-ready', '✓ Responsive team']
WHERE slug = 'accounting-bookkeeping';

-- 27. Statutory Audit - ENHANCE (was minimal)
UPDATE service_packages SET
  workflow_stages = '[
    {"step": 1, "title": "Engagement and planning", "timeline": "Day 0–3", "body": "Engagement letter signed. Audit scope and materiality defined.", "visual": "checklist", "milestone": "Engagement started"},
    {"step": 2, "title": "Documents collected", "timeline": "Day 3–7", "body": "All financials, bank statements, invoices, contracts gathered.", "visual": "upload", "milestone": "Documents received"},
    {"step": 3, "title": "Fieldwork — vouching and verification", "timeline": "Day 7–20", "body": "Auditor verifies transactions, checks documentation, tests controls.", "visual": "form", "milestone": "Fieldwork complete"},
    {"step": 4, "title": "Management discussion", "timeline": "Day 20–25", "body": "Findings discussed. Adjustments made if needed.", "visual": "checklist", "milestone": "Issues resolved"},
    {"step": 5, "title": "Audit report signed", "timeline": "Day 25–30", "body": "Auditor issues opinion — clean, qualified, or adverse. Report signed.", "visual": "stamp", "isCompletion": true, "milestone": "Audit completed"}
  ]'::jsonb,
  whats_included = '[
    {"title": "Independent audit opinion", "body": "Auditor expresses opinion on whether financials show true and fair view.", "mockVisualType": "status", "mockVisualData": {"label": "Audit Opinion", "row1": "Opinion: Unqualified ✓", "row2": "Financials: True and fair", "row3": "Emphasis: None"}},
    {"title": "SA-compliant procedures", "body": "Audit conducted per Standards on Auditing issued by ICAI. Full compliance.", "comparisonWithout": "Informal review — no assurance", "comparisonWithOllvy": "Full statutory audit — legal assurance"},
    {"title": "Risk-based approach", "body": "We focus on high-risk areas — revenue recognition, related parties, estimates."},
    {"title": "CARO reporting if applicable", "body": "Companies (Auditor''s Report) Order compliance where required.", "mockVisualType": "checklist", "mockVisualData": {"row1": "Fixed assets: Verified ✓", "row2": "Inventories: Physical count ✓", "row3": "Related party: Disclosed ✓"}},
    {"title": "Management letter", "body": "Separate letter with internal control observations and recommendations."}
  ]'::jsonb,
  service_risks = '[
    {"icon": "document", "title": "Books must be finalized first", "body": "Audit happens after books are closed. We cannot audit incomplete books."},
    {"icon": "clock", "title": "Timeline depends on complexity", "body": "30 days for straightforward audit. Longer for complex groups."},
    {"icon": "alert", "title": "Qualification if issues found", "body": "If material misstatements exist, auditor must qualify the opinion."}
  ]'::jsonb,
  profile_personas = '[
    {"label": "First audit", "detail": "First year post-incorporation. Need guidance through process."},
    {"label": "Changing auditors", "detail": "Previous auditor relationship ended. Smooth transition."},
    {"label": "Complex business", "detail": "Multiple business lines, group companies. Need thorough audit."},
    {"label": "Investor-backed", "detail": "Investors require audited financials. High standards expected."}
  ]'::jsonb,
  faqs = '[
    {"category": "General", "q": "Is statutory audit mandatory?", "a": "Yes for all Pvt Ltd companies regardless of turnover."},
    {"category": "General", "q": "What is audit opinion?", "a": "Auditor''s statement on whether financials are true and fair. Can be unqualified, qualified, adverse, or disclaimer."},
    {"category": "Process", "q": "How long does audit take?", "a": "30 days for standard audit. More for complex cases."},
    {"category": "Process", "q": "What documents are needed?", "a": "Trial balance, ledgers, bank statements, invoices, contracts, board minutes."},
    {"category": "Documents", "q": "What is management letter?", "a": "Separate communication with internal control observations."},
    {"category": "After Completion", "q": "What happens after audit?", "a": "File audited financials with ROC (AOC-4). Use for ITR filing."}
  ]'::jsonb,
  review_sources = '[
    {"name": "ICAI Standards on Auditing", "url": "https://www.icai.org", "description": "Auditing standards followed"},
    {"name": "Companies Act, Section 143", "url": "https://www.mca.gov.in", "description": "Statutory audit provisions"}
  ]'::jsonb,
  unlocks = '[
    {"name": "MCA Annual Filing", "explanation": "File AOC-4 with audited financials.", "price": "₹8,999", "type": "required", "slug": "mca-annual-filing"},
    {"name": "Business ITR", "explanation": "File ITR with audited financials.", "price": "₹11,999", "type": "required", "slug": "business-itr"}
  ]'::jsonb,
  review_keyword_chips = ARRAY['✓ Thorough audit', '✓ Clean opinion', '✓ Timely completion', '✓ Good communication', '✓ Professional team']
WHERE slug = 'statutory-audit';

-- Continue with remaining services (28-32) in similar pattern...

-- 28. DIN Reactivation - ENHANCE
UPDATE service_packages SET
  workflow_stages = '[
    {"step": 1, "title": "Check deactivation reason", "timeline": "Day 0–1", "body": "Verify DIN status and understand why it was deactivated — missed KYC, incorrect details.", "visual": "checklist", "milestone": "Reason identified"},
    {"step": 2, "title": "Gather required documents", "timeline": "Day 1–2", "body": "PAN, Aadhaar, address proof, passport photo for KYC filing.", "visual": "upload", "milestone": "Documents received"},
    {"step": 3, "title": "File pending DIR-3 KYC", "timeline": "Day 2–5", "body": "All missed KYC years filed with applicable penalty.", "visual": "form", "milestone": "KYC filed"},
    {"step": 4, "title": "Pay penalty", "timeline": "Day 5–7", "body": "₹5,000 per missed KYC year. Challan generated and paid.", "visual": "receipt", "milestone": "Penalty paid"},
    {"step": 5, "title": "DIN reactivated", "timeline": "Day 7–10", "body": "MCA processes and reactivates DIN. Status changes to Active.", "visual": "stamp", "isCompletion": true, "milestone": "DIN active"}
  ]'::jsonb,
  whats_included = '[
    {"title": "DIN status verification", "body": "Check current status, deactivation date, and missing years.", "mockVisualType": "status", "mockVisualData": {"label": "DIN Status Check", "row1": "DIN: 08765432", "row2": "Status: Deactivated", "row3": "Reason: DIR-3 KYC not filed"}},
    {"title": "All pending KYC filed", "body": "If you missed multiple years, we file all. Each year has ₹5,000 penalty.", "comparisonWithout": "File one year — still deactivated", "comparisonWithOllvy": "All years filed — DIN reactivated"},
    {"title": "Penalty calculation upfront", "body": "You know total cost before we start. No surprises.", "mockVisualType": "receipt", "mockVisualData": {"label": "Penalty Summary", "row1": "Missed Years: 2", "row2": "Penalty: ₹5,000 x 2 = ₹10,000", "row3": "Total: ₹13,499"}},
    {"title": "OTP verification handled", "body": "DIR-3 KYC requires Aadhaar OTP. We coordinate in real-time."},
    {"title": "Reactivation confirmation", "body": "MCA updates status. You can verify on MCA21 portal."}
  ]'::jsonb,
  service_risks = '[
    {"icon": "alert", "title": "Cannot act as director while deactivated", "body": "Deactivated DIN means you cannot sign filings for any company."},
    {"icon": "clock", "title": "₹5,000 per missed year", "body": "Penalty accumulates. File early to minimize cost."},
    {"icon": "document", "title": "All companies affected", "body": "If you''re director in multiple companies, all are blocked."}
  ]'::jsonb,
  profile_personas = '[
    {"label": "Missed KYC deadline", "detail": "Forgot to file DIR-3 by Sep 30. DIN deactivated Oct 1."},
    {"label": "Multiple years missed", "detail": "Didn''t know about KYC requirement. Several years pending."},
    {"label": "Mobile number changed", "detail": "OTP went to old number. Couldn''t file in time."},
    {"label": "Abroad during deadline", "detail": "Were traveling. Missed the window."}
  ]'::jsonb,
  faqs = '[
    {"category": "General", "q": "Why was my DIN deactivated?", "a": "Usually for missing DIR-3 KYC filing by Sep 30."},
    {"category": "General", "q": "What is DIR-3 KYC?", "a": "Annual verification every director must file with MCA. Confirms identity."},
    {"category": "Process", "q": "How much is the penalty?", "a": "₹5,000 per missed year of KYC."},
    {"category": "Process", "q": "How long to reactivate?", "a": "7–10 working days after filing."},
    {"category": "Documents", "q": "What documents are needed?", "a": "PAN, Aadhaar with active mobile, address proof, passport photo."},
    {"category": "After Completion", "q": "How to prevent future deactivation?", "a": "File DIR-3 KYC every year by Sep 30. We send reminders."}
  ]'::jsonb,
  review_sources = '[
    {"name": "MCA21 Portal", "url": "https://www.mca.gov.in", "description": "DIN status and KYC filing"},
    {"name": "Companies Rules, 2014", "url": "https://www.mca.gov.in", "description": "Rule 12A: KYC requirements"}
  ]'::jsonb,
  unlocks = '[
    {"name": "Director KYC", "explanation": "Annual filing to prevent future issues.", "price": "₹1,499", "type": "required", "slug": "director-kyc"}
  ]'::jsonb,
  review_keyword_chips = ARRAY['✓ DIN restored quickly', '✓ All years filed', '✓ Penalty explained', '✓ No more issues', '✓ CS was helpful']
WHERE slug = 'din-reactivation';

-- 31. ESI Registration - ENHANCE
UPDATE service_packages SET
  workflow_stages = '[
    {"step": 1, "title": "Employee and establishment details", "timeline": "Day 0–1", "body": "List of employees with Aadhaar, addresses, salary details. Establishment address.", "visual": "upload", "milestone": "Details received"},
    {"step": 2, "title": "Employer registration on ESIC portal", "timeline": "Day 1–3", "body": "Employer code application filed on esic.in.", "visual": "form", "milestone": "Application submitted"},
    {"step": 3, "title": "DSC attached", "timeline": "Day 3–4", "body": "Authorized signatory DSC linked to ESIC account.", "visual": "form", "milestone": "DSC linked"},
    {"step": 4, "title": "Employee enrollment", "timeline": "Day 4–6", "body": "All eligible employees enrolled. Insurance numbers generated.", "visual": "form", "milestone": "Employees enrolled"},
    {"step": 5, "title": "ESIC code issued", "timeline": "Day 6–7", "body": "Employer code received. Ready for monthly contributions.", "visual": "stamp", "isCompletion": true, "milestone": "ESIC registered"}
  ]'::jsonb,
  whats_included = '[
    {"title": "Employer registration", "body": "ESIC employer code for your establishment. Valid permanently.", "mockVisualType": "status", "mockVisualData": {"label": "ESIC Registration", "row1": "Employer Code: 41001234567890 ✓", "row2": "Establishment: Registered", "row3": "Status: Active"}},
    {"title": "Employee enrollment", "body": "All eligible employees (earning up to ₹21,000/month) enrolled in ESI.", "comparisonWithout": "Employees enrolled haphazardly — some missed", "comparisonWithOllvy": "All eligible employees enrolled systematically"},
    {"title": "Insurance numbers for all", "body": "Each employee gets unique IP number for claiming benefits.", "mockVisualType": "checklist", "mockVisualData": {"row1": "Employee 1: IP assigned ✓", "row2": "Employee 2: IP assigned ✓", "row3": "Employee 3: IP assigned ✓"}},
    {"title": "Monthly contribution setup", "body": "Contribution rates explained. Employee 0.75%, employer 3.25%."},
    {"title": "Compliance calendar", "body": "Monthly ESI contribution by 15th. Added to your calendar."}
  ]'::jsonb,
  service_risks = '[
    {"icon": "clock", "title": "Monthly contribution by 15th", "body": "ESI contributions due by 15th of following month. Late payment attracts 12% interest."},
    {"icon": "document", "title": "Wage ceiling may change", "body": "Currently ₹21,000/month. If employee salary crosses, they exit ESI."},
    {"icon": "alert", "title": "Applicable from 10 employees", "body": "ESI mandatory from first day if you have 10+ employees. Cannot delay."}
  ]'::jsonb,
  profile_personas = '[
    {"label": "Just crossed 10 employees", "detail": "ESI now mandatory. Need to register quickly."},
    {"label": "New establishment", "detail": "Starting with 10+ employees. Register from day one."},
    {"label": "Existing but unregistered", "detail": "Have 10+ employees for a while. Need to regularize."},
    {"label": "Multiple locations", "detail": "Each location needs separate registration. We handle all."}
  ]'::jsonb,
  faqs = '[
    {"category": "General", "q": "What is ESI?", "a": "Employee State Insurance — health coverage for employees earning up to ₹21,000/month."},
    {"category": "General", "q": "When is ESI mandatory?", "a": "From day one if you have 10+ employees (20 in some states)."},
    {"category": "Process", "q": "What is contribution rate?", "a": "Employee: 0.75% of wages. Employer: 3.25% of wages."},
    {"category": "Process", "q": "What benefits do employees get?", "a": "Medical care, sickness benefit, maternity benefit, disability benefit."},
    {"category": "Documents", "q": "What documents are needed?", "a": "Employee Aadhaar, bank details, photos. Establishment address proof."},
    {"category": "After Completion", "q": "What are monthly obligations?", "a": "Deposit contribution by 15th. File half-yearly return."}
  ]'::jsonb,
  review_sources = '[
    {"name": "ESIC Portal", "url": "https://www.esic.in", "description": "Employee State Insurance Corporation"},
    {"name": "ESI Act, 1948", "url": "https://www.esic.in", "description": "ESI Act provisions"}
  ]'::jsonb,
  unlocks = '[
    {"name": "PF Registration", "explanation": "Usually required alongside ESI.", "price": "₹2,999", "type": "required", "slug": "pf-registration"},
    {"name": "Payroll Management", "explanation": "Manage ESI contributions monthly.", "price": "From ₹2,999/mo", "type": "beneficial", "slug": "payroll-management"}
  ]'::jsonb,
  review_keyword_chips = ARRAY['✓ Quick registration', '✓ All employees enrolled', '✓ Contribution explained', '✓ Calendar setup', '✓ No issues']
WHERE slug = 'esi-registration';

-- 32. PF Registration - ENHANCE
UPDATE service_packages SET
  workflow_stages = '[
    {"step": 1, "title": "Employee and establishment details", "timeline": "Day 0–2", "body": "Employee list with Aadhaar, bank details, date of joining. Establishment details.", "visual": "upload", "milestone": "Details received"},
    {"step": 2, "title": "DSC for authorized signatory", "timeline": "Day 2–4", "body": "If no DSC exists, we arrange and link to EPFO portal.", "visual": "form", "milestone": "DSC ready"},
    {"step": 3, "title": "Establishment registration on EPFO", "timeline": "Day 4–6", "body": "Application filed on unifiedportal-emp.epfindia.gov.in.", "visual": "form", "milestone": "Application submitted"},
    {"step": 4, "title": "Employee UAN activation", "timeline": "Day 6–8", "body": "Universal Account Numbers generated and activated for all employees.", "visual": "form", "milestone": "UANs active"},
    {"step": 5, "title": "Establishment code issued", "timeline": "Day 8–10", "body": "EPFO establishment code received. Ready for monthly contributions.", "visual": "stamp", "isCompletion": true, "milestone": "PF registered"}
  ]'::jsonb,
  whats_included = '[
    {"title": "Establishment registration", "body": "EPFO establishment code for your organization. Valid permanently.", "mockVisualType": "status", "mockVisualData": {"label": "EPFO Registration", "row1": "Establishment Code: MHBAN0012345 ✓", "row2": "DSC: Linked ✓", "row3": "Status: Active"}},
    {"title": "UAN for all employees", "body": "Universal Account Number for each employee. Portable across jobs.", "comparisonWithout": "Manual PF accounts — hard to track", "comparisonWithOllvy": "UAN system — lifelong tracking"},
    {"title": "Aadhaar and bank linking", "body": "Each UAN linked to Aadhaar and bank account for seamless withdrawals.", "mockVisualType": "checklist", "mockVisualData": {"row1": "UAN-Aadhaar: Linked ✓", "row2": "UAN-Bank: Linked ✓", "row3": "UAN-Mobile: Linked ✓"}},
    {"title": "Contribution structure explained", "body": "Employee 12%, employer 12% (3.67% PF + 8.33% pension). We explain breakup."},
    {"title": "Monthly compliance setup", "body": "ECR filing by 15th every month. Added to your calendar."}
  ]'::jsonb,
  service_risks = '[
    {"icon": "clock", "title": "Monthly contribution by 15th", "body": "PF contribution due by 15th of following month. Late = 12% interest + damages."},
    {"icon": "document", "title": "UAN mandatory for all", "body": "Every employee needs UAN. Old members transferred to UAN system."},
    {"icon": "alert", "title": "Applicable from 20 employees", "body": "PF mandatory when you cross 20 employees. Some opt voluntarily earlier."}
  ]'::jsonb,
  profile_personas = '[
    {"label": "Just crossed 20 employees", "detail": "PF now mandatory. Register immediately."},
    {"label": "Voluntary registration", "detail": "Under 20 but want to provide PF benefit. Good for retention."},
    {"label": "New company with 20+ staff", "detail": "Starting with PF-eligible strength. Register from day one."},
    {"label": "Regularizing existing workforce", "detail": "Had 20+ employees but weren''t registered. Need to comply."}
  ]'::jsonb,
  faqs = '[
    {"category": "General", "q": "What is PF?", "a": "Provident Fund — retirement savings where employee and employer contribute."},
    {"category": "General", "q": "When is PF mandatory?", "a": "When you have 20+ employees. Some states have lower thresholds."},
    {"category": "Process", "q": "What is contribution rate?", "a": "Employee 12% of basic. Employer 12% (3.67% PF + 8.33% EPS)."},
    {"category": "Process", "q": "What is UAN?", "a": "Universal Account Number — unique ID for employee''s PF across all jobs."},
    {"category": "Documents", "q": "What documents are needed?", "a": "Employee Aadhaar, PAN, bank details, joining date. Establishment documents."},
    {"category": "After Completion", "q": "What are monthly obligations?", "a": "File ECR and pay contribution by 15th. Annual return by April 30."}
  ]'::jsonb,
  review_sources = '[
    {"name": "EPFO Portal", "url": "https://www.epfindia.gov.in", "description": "Employees'' Provident Fund Organisation"},
    {"name": "EPF Act, 1952", "url": "https://www.epfindia.gov.in", "description": "EPF & MP Act provisions"}
  ]'::jsonb,
  unlocks = '[
    {"name": "ESI Registration", "explanation": "Usually required alongside PF.", "price": "₹2,999", "type": "required", "slug": "esi-registration"},
    {"name": "Payroll Management", "explanation": "Manage PF contributions monthly.", "price": "From ₹2,999/mo", "type": "beneficial", "slug": "payroll-management"}
  ]'::jsonb,
  review_keyword_chips = ARRAY['✓ Quick registration', '✓ UANs activated', '✓ Contribution clear', '✓ Compliance calendar set', '✓ Team responsive']
WHERE slug = 'pf-registration';

-- 17. Shop & Establishment - ENHANCE
UPDATE service_packages SET
  whats_included = '[
    {"title": "State-specific compliance", "body": "Each state has different rules. We handle your state''s requirements.", "comparisonWithout": "Apply with wrong form — rejected", "comparisonWithOllvy": "Correct state form, correct process"},
    {"title": "Renewal tracking added", "body": "Most states require annual renewal. We add to your calendar.", "mockVisualType": "calendar", "mockVisualData": {"row1": "Registration: Mar 2025 ✓", "row2": "Renewal Due: Mar 2026", "row3": "Reminder: Feb 2026"}},
    {"title": "Working hours documented", "body": "Shop Act requires declaring working hours. We ensure compliance."},
    {"title": "Employee count registered", "body": "Employee strength recorded. Required for labour compliance."},
    {"title": "License certificate issued", "body": "Official certificate to display at premises. Mandatory."}
  ]'::jsonb,
  service_risks = '[
    {"icon": "clock", "title": "Renewal required annually", "body": "Most states require annual renewal. Late renewal attracts penalty."},
    {"icon": "alert", "title": "Must display certificate", "body": "License certificate must be displayed at premises. Inspectors check."},
    {"icon": "document", "title": "Update required for changes", "body": "Address change, name change — must update registration."}
  ]'::jsonb,
  profile_personas = '[
    {"label": "Opening new office", "detail": "Setting up commercial premises. Shop Act needed before operations."},
    {"label": "Hiring first employee", "detail": "Even one employee means Shop Act compliance."},
    {"label": "New branch", "detail": "Each location needs separate registration."},
    {"label": "Home office converting", "detail": "Moving to commercial space. Compliance now required."}
  ]'::jsonb,
  faqs = '[
    {"category": "General", "q": "Is Shop Act mandatory?", "a": "Yes. All commercial establishments must register within 30 days of starting."},
    {"category": "General", "q": "Does it apply to home offices?", "a": "Only if you have employees or commercial activities. Pure WFH may be exempt."},
    {"category": "Process", "q": "How long is the license valid?", "a": "Most states: 1 year. Some: 5 years. State-specific."},
    {"category": "Process", "q": "What about Sundays and holidays?", "a": "Shop Act regulates working hours and mandatory weekly offs."},
    {"category": "Documents", "q": "What documents are needed?", "a": "Address proof, PAN, employee list, working hours schedule."},
    {"category": "After Completion", "q": "What are ongoing obligations?", "a": "Maintain register of employees, display certificate, renew on time."}
  ]'::jsonb,
  review_sources = '[
    {"name": "State Labour Portal", "url": "", "description": "Varies by state"},
    {"name": "Shops and Establishments Act", "url": "", "description": "State-specific legislation"}
  ]'::jsonb,
  unlocks = '[
    {"name": "Professional Tax", "explanation": "Often required alongside Shop Act.", "price": "₹1,999", "type": "required", "slug": "professional-tax"},
    {"name": "GST Registration", "explanation": "If turnover crosses threshold.", "price": "₹8,999", "type": "beneficial", "slug": "gst-registration"}
  ]'::jsonb,
  review_keyword_chips = ARRAY['✓ State-specific handled', '✓ Renewal reminder set', '✓ Certificate received', '✓ Quick process', '✓ No compliance gaps']
WHERE slug = 'shop-establishment';

-- 18. Professional Tax - ENHANCE
UPDATE service_packages SET
  whats_included = '[
    {"title": "PTEC for employers", "body": "Professional Tax Enrollment Certificate for employer registration.", "mockVisualType": "status", "mockVisualData": {"row1": "PTEC Number: Issued ✓", "row2": "State: Maharashtra", "row3": "Status: Active"}},
    {"title": "PTRC for professionals", "body": "Professional Tax Registration Certificate for individual professionals."},
    {"title": "State-specific rates applied", "body": "PT rates vary by state. We apply correct slab.", "comparisonWithout": "Wrong rate = excess deduction or penalty", "comparisonWithOllvy": "Correct slab from day one"},
    {"title": "Monthly/annual filing setup", "body": "Filing frequency depends on your state. Calendar updated."},
    {"title": "Employee PT deduction guidance", "body": "How much to deduct from each employee salary explained."}
  ]'::jsonb,
  service_risks = '[
    {"icon": "clock", "title": "Monthly deposit required", "body": "PT typically due by end of following month. Late = penalty."},
    {"icon": "document", "title": "Both employer and employee tax", "body": "Employer pays tax on themselves, plus deducts from employees."},
    {"icon": "alert", "title": "State-specific rules", "body": "Not all states have PT. Rules vary significantly."}
  ]'::jsonb,
  profile_personas = '[
    {"label": "Hiring employees in PT state", "detail": "Maharashtra, Karnataka, etc. require PT registration."},
    {"label": "Professional starting practice", "detail": "CA/CS/lawyers need PT registration."},
    {"label": "Opening branch in new state", "detail": "Each PT state needs separate registration."},
    {"label": "First time hiring", "detail": "Need to start deducting PT from employee salaries."}
  ]'::jsonb,
  faqs = '[
    {"category": "General", "q": "Which states have PT?", "a": "Maharashtra, Karnataka, West Bengal, Gujarat, Andhra Pradesh, Telangana, and others."},
    {"category": "General", "q": "What is maximum PT amount?", "a": "₹2,500 per year (Constitutional limit under Article 276)."},
    {"category": "Process", "q": "PTEC vs PTRC — difference?", "a": "PTEC for employers. PTRC for professionals/self-employed."},
    {"category": "Process", "q": "How much to deduct from employees?", "a": "Slab-based. Example: Maharashtra — up to ₹7,500 salary: Nil. Above: ₹175-200/month."},
    {"category": "Documents", "q": "What documents are needed?", "a": "PAN, address proof, employee list, entity registration certificate."},
    {"category": "After Completion", "q": "What are monthly obligations?", "a": "Deduct from salary, deposit to state, file return."}
  ]'::jsonb,
  review_sources = '[
    {"name": "State Commercial Tax", "url": "", "description": "Varies by state"},
    {"name": "Professional Tax Act", "url": "", "description": "State-specific legislation"}
  ]'::jsonb,
  unlocks = '[
    {"name": "Payroll Management", "explanation": "PT deduction handled monthly.", "price": "From ₹2,999/mo", "type": "beneficial", "slug": "payroll-management"},
    {"name": "Shop & Establishment", "explanation": "Often required alongside.", "price": "₹3,999", "type": "required", "slug": "shop-establishment"}
  ]'::jsonb,
  review_keyword_chips = ARRAY['✓ Quick registration', '✓ Filing calendar set', '✓ Rates explained', '✓ State compliance', '✓ Deduction guidance']
WHERE slug = 'professional-tax';

-- 24. LLP Closure - ENHANCE
UPDATE service_packages SET
  workflow_stages = '[
    {"step": 1, "title": "Compliance review", "timeline": "Day 0–5", "body": "Check pending Form 11, Form 8, ITR. List what needs filing.", "visual": "checklist", "milestone": "Gaps identified"},
    {"step": 2, "title": "File pending returns", "timeline": "Day 5–15", "body": "All Form 11 (annual return) and Form 8 (accounts) filed.", "visual": "form", "milestone": "Returns filed"},
    {"step": 3, "title": "Partner consent obtained", "timeline": "Day 15–20", "body": "All partners must consent to closure. Unanimous agreement required.", "visual": "form", "milestone": "Consent received"},
    {"step": 4, "title": "GST and other closures", "timeline": "Day 20–30", "body": "GST cancelled. Other registrations closed.", "visual": "checklist", "milestone": "Other compliances closed"},
    {"step": 5, "title": "Form 24 filed", "timeline": "Day 30–40", "body": "Strike-off application with indemnity bond.", "visual": "form", "milestone": "Form 24 submitted"},
    {"step": 6, "title": "Strike-off order received", "timeline": "Day 40–60", "body": "ROC processes and removes LLP from register.", "visual": "stamp", "isCompletion": true, "milestone": "LLP struck off"}
  ]'::jsonb,
  whats_included = '[
    {"title": "Complete compliance cleanup", "body": "All Form 11 and Form 8 filed before strike-off.", "mockVisualType": "status", "mockVisualData": {"label": "Pre-Closure Compliance", "row1": "Form 11 FY 23-24: Filed ✓", "row2": "Form 8 FY 23-24: Filed ✓", "row3": "Partner KYC: Current ✓"}},
    {"title": "Partner consent coordination", "body": "All partners must agree. We draft consent form and coordinate signatures.", "comparisonWithout": "One partner disagrees — stuck", "comparisonWithOllvy": "Consent documented properly"},
    {"title": "GST cancellation included", "body": "GST must be cancelled before LLP closure. We handle.", "mockVisualType": "checklist", "mockVisualData": {"row1": "GST REG-16: Filed ✓", "row2": "GSTR-10: Filed ✓", "row3": "GST: Cancelled ✓"}},
    {"title": "Form 24 with affidavit", "body": "Strike-off application with partner affidavits."},
    {"title": "ROC tracking", "body": "We track processing and respond to any queries."}
  ]'::jsonb,
  service_risks = '[
    {"icon": "document", "title": "All partners must consent", "body": "Unanimous consent required. One disagreement blocks closure."},
    {"icon": "clock", "title": "Takes 2 months minimum", "body": "Compliance cleanup + ROC processing. Plan accordingly."},
    {"icon": "alert", "title": "Partners remain liable", "body": "Partners liable for pre-closure obligations. Clear all dues first."}
  ]'::jsonb,
  profile_personas = '[
    {"label": "LLP dormant", "detail": "No operations for 2+ years. Just paying compliance costs."},
    {"label": "Partnership split", "detail": "Partners going separate ways. Clean closure better than disputes."},
    {"label": "Business failed", "detail": "Venture didn''t work. Close properly."},
    {"label": "Converting to Pvt Ltd", "detail": "Need LLP closed as part of transition."}
  ]'::jsonb,
  faqs = '[
    {"category": "General", "q": "What is LLP strike-off?", "a": "Removal of LLP from ROC register. LLP ceases to exist."},
    {"category": "General", "q": "Strike-off vs winding up?", "a": "Strike-off for dormant LLPs. Winding up if liabilities remain."},
    {"category": "Process", "q": "How long does it take?", "a": "60 days minimum. Compliance filing + ROC processing."},
    {"category": "Process", "q": "What if one partner disagrees?", "a": "Cannot proceed. Unanimous consent mandatory."},
    {"category": "Documents", "q": "What is Form 24?", "a": "Strike-off application form for LLPs."},
    {"category": "After Completion", "q": "Can it be reversed?", "a": "Within 20 years, can apply for revival. Rare and complex."}
  ]'::jsonb,
  review_sources = '[
    {"name": "MCA LLP Portal", "url": "https://llp.mca.gov.in", "description": "LLP strike-off filing"},
    {"name": "LLP Act, Section 75", "url": "https://www.mca.gov.in", "description": "Strike-off provisions"}
  ]'::jsonb,
  unlocks = '[
    {"name": "GST Cancellation", "explanation": "Must be done before LLP closure.", "price": "₹2,999", "type": "required", "slug": "gst-cancellation"}
  ]'::jsonb,
  review_keyword_chips = ARRAY['✓ Clean closure', '✓ Partners coordinated', '✓ Compliance cleared', '✓ Timeline met', '✓ No issues later']
WHERE slug = 'llp-closure';

-- 25. ROC Changes - ENHANCE
UPDATE service_packages SET
  workflow_stages = '[
    {"step": 1, "title": "Change identified and documented", "timeline": "Day 0–1", "body": "What changed — director, address, shares, name. We confirm requirements.", "visual": "checklist", "milestone": "Change confirmed"},
    {"step": 2, "title": "Board resolution drafted", "timeline": "Day 1–2", "body": "Resolution for the specific change. Some need shareholder approval too.", "visual": "form", "milestone": "Resolution ready"},
    {"step": 3, "title": "Documents collected", "timeline": "Day 2–3", "body": "ID proofs, address proofs, consent forms — depending on change type.", "visual": "upload", "milestone": "Documents received"},
    {"step": 4, "title": "Form filed on MCA", "timeline": "Day 3–5", "body": "DIR-12 for directors, INC-22 for address, SH-4 for shares, etc.", "visual": "form", "milestone": "Form submitted"},
    {"step": 5, "title": "Approval received", "timeline": "Day 5–7", "body": "ROC processes. Updated records reflected on MCA.", "visual": "stamp", "isCompletion": true, "milestone": "Change recorded"}
  ]'::jsonb,
  whats_included = '[
    {"title": "Any ROC form handled", "body": "DIR-12 (director), INC-22 (address), SH-4 (transfer), MGT-14 (resolution).", "mockVisualType": "status", "mockVisualData": {"label": "ROC Forms We Handle", "row1": "DIR-12: Director changes", "row2": "INC-22: Address change", "row3": "SH-4: Share transfer"}},
    {"title": "Resolution drafting", "body": "Board resolution, shareholder resolution as required for the change.", "comparisonWithout": "Wrong resolution format — rejected", "comparisonWithOllvy": "Properly drafted resolutions"},
    {"title": "Deadline tracking", "body": "Most changes must be filed within 30 days. We ensure compliance.", "mockVisualType": "calendar", "mockVisualData": {"row1": "Event Date: 15 Mar", "row2": "Filing Deadline: 14 Apr", "row3": "Our Filing: Day 3-5"}},
    {"title": "MCA21 filing handled", "body": "We navigate the portal. DSC attached. SRN generated."},
    {"title": "Updated documents shared", "body": "Post-filing, updated master data shared for your records."}
  ]'::jsonb,
  service_risks = '[
    {"icon": "clock", "title": "30-day deadline strict", "body": "Most changes must be filed within 30 days. Late fee accrues daily."},
    {"icon": "document", "title": "Supporting documents mandatory", "body": "Each change needs specific documents. Missing = rejection."},
    {"icon": "alert", "title": "Shareholder approval for some", "body": "Name change, object change need shareholder resolution. Plan meeting."}
  ]'::jsonb,
  profile_personas = '[
    {"label": "Adding director", "detail": "New director joining board. DIR-12 filing."},
    {"label": "Director resignation", "detail": "Director leaving. DIR-12 within 30 days."},
    {"label": "Address change", "detail": "Registered office moving. INC-22 required."},
    {"label": "Share transfer", "detail": "Shares being transferred. SH-4 and related forms."}
  ]'::jsonb,
  faqs = '[
    {"category": "General", "q": "What forms are covered?", "a": "Any ROC form — DIR-12, INC-22, SH-4, MGT-14, INC-28, and more."},
    {"category": "General", "q": "What is the deadline?", "a": "Most changes: 30 days from event date. Late fee applies after."},
    {"category": "Process", "q": "What is late fee?", "a": "₹100-300/day depending on form. Can accumulate quickly."},
    {"category": "Process", "q": "Do I need a meeting?", "a": "Board meeting for most changes. Shareholder meeting for major changes."},
    {"category": "Documents", "q": "What documents are needed?", "a": "Depends on change. We send specific checklist for your change."},
    {"category": "After Completion", "q": "How do I verify filing?", "a": "Check MCA21 master data. We share updated extract."}
  ]'::jsonb,
  review_sources = '[
    {"name": "MCA21 Portal", "url": "https://www.mca.gov.in", "description": "ROC form filing"},
    {"name": "Companies Act, 2013", "url": "https://www.mca.gov.in", "description": "Relevant sections for changes"}
  ]'::jsonb,
  unlocks = '[
    {"name": "MCA Annual Filing", "explanation": "Annual return reflects changes.", "price": "₹8,999", "type": "required", "slug": "mca-annual-filing"}
  ]'::jsonb,
  review_keyword_chips = ARRAY['✓ Quick filing', '✓ Deadline met', '✓ Resolution drafted', '✓ No late fee', '✓ CS responsive']
WHERE slug = 'roc-changes';

-- 29. Company Name Change - ENHANCE
UPDATE service_packages SET
  workflow_stages = '[
    {"step": 1, "title": "Name availability check", "timeline": "Day 0–2", "body": "Search MCA and trademark databases for conflicts.", "visual": "checklist", "milestone": "Name available"},
    {"step": 2, "title": "Board resolution", "timeline": "Day 2–4", "body": "Board approves proposed new name and EGM notice.", "visual": "form", "milestone": "Board approved"},
    {"step": 3, "title": "Shareholder approval (SR)", "timeline": "Day 4–10", "body": "Special Resolution passed in EGM with 75% majority.", "visual": "form", "milestone": "SR passed"},
    {"step": 4, "title": "MGT-14 and INC-24 filed", "timeline": "Day 10–15", "body": "Resolutions and name change application filed with ROC.", "visual": "form", "milestone": "Forms submitted"},
    {"step": 5, "title": "New CoI issued", "timeline": "Day 15–20", "body": "ROC processes and issues new Certificate of Incorporation.", "visual": "stamp", "isCompletion": true, "milestone": "Name changed"}
  ]'::jsonb,
  whats_included = '[
    {"title": "Name search — MCA and trademark", "body": "Before you commit, we search both databases for conflicts.", "mockVisualType": "status", "mockVisualData": {"label": "Name Search Results", "row1": "MCA Registry: No match ✓", "row2": "Trademark: No conflict ✓", "row3": "Proceed: Yes"}},
    {"title": "Special Resolution drafted", "body": "SR for name change with proper format and disclosures.", "comparisonWithout": "Wrong resolution format — rejected", "comparisonWithOllvy": "Properly drafted SR"},
    {"title": "MOA amendment handled", "body": "Memorandum updated with new company name."},
    {"title": "New CoI with updated name", "body": "Fresh Certificate of Incorporation issued.", "mockVisualType": "receipt", "mockVisualData": {"label": "New Certificate", "row1": "Old: ABC Private Limited", "row2": "New: XYZ Private Limited", "row3": "CIN: Same"}},
    {"title": "Update guidance provided", "body": "GST, bank, contracts — what else needs updating."}
  ]'::jsonb,
  service_risks = '[
    {"icon": "document", "title": "Name must be available", "body": "MCA checks against registered names and trademarks. We pre-check."},
    {"icon": "clock", "title": "EGM notice period", "body": "21 days notice for EGM. Factor into timeline."},
    {"icon": "alert", "title": "Update everything else", "body": "GST, bank accounts, contracts need updating. Plan for this."}
  ]'::jsonb,
  profile_personas = '[
    {"label": "Rebranding", "detail": "New brand identity. Company name must match."},
    {"label": "Pivoted business", "detail": "Business model changed. Old name misleading."},
    {"label": "Merger/acquisition", "detail": "Post-M&A, unified brand name needed."},
    {"label": "Trademark issue", "detail": "Current name conflicts with trademark. Must change."}
  ]'::jsonb,
  faqs = '[
    {"category": "General", "q": "How long does name change take?", "a": "20 working days including EGM notice period."},
    {"category": "General", "q": "Does CIN change?", "a": "No. CIN remains same. Only name changes on CoI."},
    {"category": "Process", "q": "What is Special Resolution?", "a": "75% shareholder approval required for name change."},
    {"category": "Process", "q": "Does PAN change?", "a": "No. PAN remains same. Just update name records."},
    {"category": "Documents", "q": "What documents are needed?", "a": "Board resolution, EGM notice, SR, INC-24 application."},
    {"category": "After Completion", "q": "What needs updating after?", "a": "GST certificate, bank accounts, letterheads, contracts, website."}
  ]'::jsonb,
  review_sources = '[
    {"name": "MCA21 Portal", "url": "https://www.mca.gov.in", "description": "Name change application"},
    {"name": "Companies Act, Section 13", "url": "https://www.mca.gov.in", "description": "Name change provisions"}
  ]'::jsonb,
  unlocks = '[
    {"name": "Trademark Registration", "explanation": "Protect new company name.", "price": "₹12,499", "type": "beneficial", "slug": "trademark-registration"}
  ]'::jsonb,
  review_keyword_chips = ARRAY['✓ Name reserved', '✓ SR properly done', '✓ New CoI received', '✓ Update guidance', '✓ Smooth process']
WHERE slug = 'company-name-change';

-- 30. Copyright Registration - ENHANCE
UPDATE service_packages SET
  workflow_stages = '[
    {"step": 1, "title": "Work details collected", "timeline": "Day 0–2", "body": "Nature of work, creation date, author details, ownership chain.", "visual": "checklist", "milestone": "Details received"},
    {"step": 2, "title": "Application prepared", "timeline": "Day 2–5", "body": "Form XIV drafted with work description and supporting documents.", "visual": "form", "milestone": "Application ready"},
    {"step": 3, "title": "Filed with Copyright Office", "timeline": "Day 5–10", "body": "Application submitted to Copyright Office, Delhi.", "visual": "form", "milestone": "Application filed"},
    {"step": 4, "title": "Examination period", "timeline": "Day 10–25", "body": "Copyright Office examines. If objection, we respond.", "visual": "calendar", "milestone": "Under examination"},
    {"step": 5, "title": "Registration certificate issued", "timeline": "Day 25–30", "body": "Certificate with registration number issued.", "visual": "stamp", "isCompletion": true, "milestone": "Copyright registered"}
  ]'::jsonb,
  whats_included = '[
    {"title": "Form XIV application", "body": "Application with complete work description and ownership details.", "mockVisualType": "status", "mockVisualData": {"label": "Copyright Application", "row1": "Work Type: Software", "row2": "Author: Original ✓", "row3": "Status: Filed"}},
    {"title": "Work description drafted", "body": "Clear description of the creative work for registration.", "comparisonWithout": "Vague description — may face objection", "comparisonWithOllvy": "Precise description accepted smoothly"},
    {"title": "Ownership chain documented", "body": "If commissioned work or employment work, ownership chain clarified."},
    {"title": "Objection response included", "body": "If examiner raises query, we respond within scope."},
    {"title": "Certificate delivered", "body": "Official registration certificate uploaded to your account.", "mockVisualType": "receipt", "mockVisualData": {"label": "Copyright Certificate", "row1": "Reg. No: L-12345/2025", "row2": "Work: Software Application", "row3": "Valid: Lifetime + 60 years"}}
  ]'::jsonb,
  service_risks = '[
    {"icon": "document", "title": "Work must be original", "body": "Copyright only for original works. Copied elements rejected."},
    {"icon": "clock", "title": "Processing takes 30+ days", "body": "Copyright Office processing time. Cannot be expedited."},
    {"icon": "alert", "title": "Employer may own if employment work", "body": "Work created during employment — employer may own. Clarify upfront."}
  ]'::jsonb,
  profile_personas = '[
    {"label": "Software developer", "detail": "Protecting code, application, or algorithm."},
    {"label": "Content creator", "detail": "Protecting written content, articles, books."},
    {"label": "Designer", "detail": "Protecting visual designs, graphics, art."},
    {"label": "Musician/filmmaker", "detail": "Protecting audio-visual creative works."}
  ]'::jsonb,
  faqs = '[
    {"category": "General", "q": "What works can be copyrighted?", "a": "Literary, artistic, musical, dramatic works. Software, films, sound recordings."},
    {"category": "General", "q": "How long does copyright last?", "a": "Author''s lifetime + 60 years (for most works)."},
    {"category": "Process", "q": "Is registration mandatory?", "a": "No. Copyright exists from creation. But registration helps prove ownership."},
    {"category": "Process", "q": "Can I register multiple works?", "a": "One application per work. We can file multiple together."},
    {"category": "Documents", "q": "What documents are needed?", "a": "Copy of work, author ID, ownership proof if applicable."},
    {"category": "After Completion", "q": "What can I do with copyright?", "a": "License it, sell it, sue infringers, display © symbol."}
  ]'::jsonb,
  review_sources = '[
    {"name": "Copyright Office", "url": "https://copyright.gov.in", "description": "Official Copyright Registry"},
    {"name": "Copyright Act, 1957", "url": "https://copyright.gov.in", "description": "Copyright law of India"}
  ]'::jsonb,
  unlocks = '[
    {"name": "Trademark Registration", "explanation": "Protect brand alongside content.", "price": "₹12,499", "type": "beneficial", "slug": "trademark-registration"}
  ]'::jsonb,
  review_keyword_chips = ARRAY['✓ Quick filing', '✓ Certificate received', '✓ Work properly described', '✓ No objections', '✓ Professional service']
WHERE slug = 'copyright-registration';

-- 19. Startup India - ENHANCE
UPDATE service_packages SET
  whats_included = '[
    {"title": "DPIIT recognition certificate", "body": "Official startup recognition from Government of India.", "mockVisualType": "status", "mockVisualData": {"label": "DPIIT Recognition", "row1": "Certificate: Issued ✓", "row2": "Startup Number: DIPP12345", "row3": "Valid: 10 years"}},
    {"title": "Section 80-IAC eligibility", "body": "3 years of tax holiday on profits (if approved by Inter-Ministerial Board).", "comparisonWithout": "Pay full tax on profits", "comparisonWithOllvy": "Tax exemption for eligible startups"},
    {"title": "Angel tax exemption", "body": "Exemption from Section 56(2)(viib) on premium received from investors."},
    {"title": "Fast-track patent/trademark", "body": "80% rebate on patent filing fees. Expedited examination.", "mockVisualType": "receipt", "mockVisualData": {"label": "Benefits Summary", "row1": "Patent rebate: 80%", "row2": "Trademark rebate: 50%", "row3": "Self-certification: Yes"}},
    {"title": "Self-certification for compliance", "body": "Self-certify for 6 labour and 3 environmental laws."}
  ]'::jsonb,
  service_risks = '[
    {"icon": "document", "title": "Innovation must be demonstrated", "body": "Business must show innovation, scalability, or IP. We help articulate."},
    {"icon": "clock", "title": "Tax benefits need separate approval", "body": "80-IAC tax exemption needs Inter-Ministerial Board approval after DPIIT."},
    {"icon": "alert", "title": "10-year age limit", "body": "Company must be less than 10 years old at registration."}
  ]'::jsonb,
  profile_personas = '[
    {"label": "Tech startup", "detail": "Building technology product or platform."},
    {"label": "Raising angel/VC funding", "detail": "Angel tax exemption important."},
    {"label": "Patent-pending product", "detail": "Fast-track IP benefits valuable."},
    {"label": "Early revenue stage", "detail": "Tax exemption can boost growth capital."}
  ]'::jsonb,
  faqs = '[
    {"category": "General", "q": "What is DPIIT recognition?", "a": "Government recognition as an innovative startup. Unlocks various benefits."},
    {"category": "Eligibility", "q": "Who is eligible?", "a": "Company/LLP under 10 years old, turnover under ₹100Cr, innovation-driven."},
    {"category": "Process", "q": "What is angel tax exemption?", "a": "Exemption from tax on share premium received from investors above fair value."},
    {"category": "Process", "q": "How to get 80-IAC tax benefit?", "a": "Apply separately to Inter-Ministerial Board after DPIIT recognition."},
    {"category": "Documents", "q": "What documents are needed?", "a": "Incorporation certificate, PAN, description of innovation, pitch deck."},
    {"category": "After Completion", "q": "What should I do next?", "a": "Apply for angel tax exemption. Consider 80-IAC application. Use IP rebates."}
  ]'::jsonb,
  review_sources = '[
    {"name": "Startup India", "url": "https://www.startupindia.gov.in", "description": "Official Startup India portal"},
    {"name": "DPIIT Guidelines", "url": "https://dpiit.gov.in", "description": "Recognition and benefits guidelines"}
  ]'::jsonb,
  unlocks = '[
    {"name": "Trademark Registration", "explanation": "50% govt fee rebate for startups.", "price": "₹12,499", "type": "beneficial", "slug": "trademark-registration"},
    {"name": "Patent Filing", "explanation": "80% fee rebate and fast-track.", "price": "Contact us", "type": "beneficial", "slug": ""}
  ]'::jsonb,
  review_keyword_chips = ARRAY['✓ Recognition in 5 days', '✓ Tax benefits clear', '✓ Innovation articulated', '✓ Angel tax covered', '✓ Smooth process']
WHERE slug = 'startup-india';

-- 20. GST LUT - ENHANCE
UPDATE service_packages SET
  whats_included = '[
    {"title": "Zero-rated exports", "body": "Export goods/services without paying IGST. Cash flow preserved.", "mockVisualType": "status", "mockVisualData": {"label": "LUT Status", "row1": "LUT Filed: ✓", "row2": "Valid: FY 2025-26", "row3": "Exports: Zero-rated"}},
    {"title": "Annual validity", "body": "LUT valid for one financial year. Must renew each April.", "comparisonWithout": "Pay IGST on exports, claim refund later", "comparisonWithOllvy": "No IGST upfront, better cash flow"},
    {"title": "RFD-11 filing handled", "body": "We file Form GST RFD-11 on GST portal. ARN generated.", "mockVisualType": "receipt", "mockVisualData": {"label": "LUT ARN", "row1": "ARN: AA270325014782R", "row2": "Filed: 25 Mar 2025", "row3": "Valid: Until 31 Mar 2026"}},
    {"title": "Eligibility verification", "body": "We confirm you have no pending tax demands or prosecution."},
    {"title": "Renewal reminder set", "body": "Next year LUT deadline added to calendar."}
  ]'::jsonb,
  service_risks = '[
    {"icon": "clock", "title": "Annual renewal required", "body": "LUT must be filed each financial year. Miss it = pay IGST on exports."},
    {"icon": "document", "title": "No pending demands allowed", "body": "LUT rejected if you have pending tax demands or prosecution."},
    {"icon": "alert", "title": "Export documentation must match", "body": "Shipping bills must reference LUT. Ensure compliance."}
  ]'::jsonb,
  profile_personas = '[
    {"label": "Software exporter", "detail": "IT services to foreign clients. LUT essential."},
    {"label": "Goods exporter", "detail": "Physical goods exported. No IGST with LUT."},
    {"label": "First time exporting", "detail": "New to exports. We explain entire process."},
    {"label": "Renewing LUT", "detail": "Annual renewal. Quick process."}
  ]'::jsonb,
  faqs = '[
    {"category": "General", "q": "What is LUT?", "a": "Letter of Undertaking to export without paying IGST."},
    {"category": "Eligibility", "q": "Who can file LUT?", "a": "Any exporter with no pending tax demands or prosecution."},
    {"category": "Process", "q": "When to file LUT?", "a": "Before first export of financial year. Valid April to March."},
    {"category": "Process", "q": "What if I don''t have LUT?", "a": "Must pay IGST on exports. Can claim refund later (cash flow hit)."},
    {"category": "Documents", "q": "What documents are needed?", "a": "GSTIN credentials, previous year export data, self-declaration."},
    {"category": "After Completion", "q": "When to renew?", "a": "April of each year. We send reminder."}
  ]'::jsonb,
  review_sources = '[
    {"name": "GST Portal", "url": "https://www.gst.gov.in", "description": "LUT filing portal"},
    {"name": "CGST Rules, Rule 96A", "url": "https://www.cbic.gov.in", "description": "LUT provisions"}
  ]'::jsonb,
  unlocks = '[
    {"name": "GST Monthly Filing", "explanation": "Include export invoices in GSTR-1.", "price": "From ₹2,999/mo", "type": "beneficial", "slug": "gst-monthly-50l"},
    {"name": "IEC Code", "explanation": "Required for exporting.", "price": "₹4,999", "type": "required", "slug": "iec-code"}
  ]'::jsonb,
  review_keyword_chips = ARRAY['✓ Same day filing', '✓ Reminder for renewal', '✓ Cash flow saved', '✓ Quick process', '✓ No IGST paid']
WHERE slug = 'gst-lut';

-- Show summary
SELECT slug,
  jsonb_array_length(workflow_stages) as steps,
  jsonb_array_length(whats_included) as inclusions,
  jsonb_array_length(service_risks) as risks,
  jsonb_array_length(profile_personas) as personas,
  jsonb_array_length(faqs) as faqs,
  array_length(review_keyword_chips, 1) as chips
FROM service_packages
ORDER BY display_order;
