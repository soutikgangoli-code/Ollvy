-- =============================================================================
-- Migration: Add remaining 19 services to reach 32 total
-- =============================================================================

-- 14. OPC Incorporation
INSERT INTO service_packages (slug, name, short_name, category, tagline, short_description, order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate, sla_working_days, urgency_score, situation_tags, is_active, display_order, service_type, mandatory_for, legal_basis, penalty_for_missing, penalty_color, seo_title, seo_description, canonical_url, govt_fee_label, govt_fee_note, workflow_stages, whats_included, service_risks, profile_personas, faqs, review_sources, unlocks, review_keyword_chips, related_slugs) VALUES
('opc-incorporation', 'One Person Company (OPC) Registration', 'OPC', 'Company Registration', 'Your company, just you. Limited liability with single ownership.', 'Incorporate a One Person Company with limited liability', 'one_time', 'one_time', 999900, 499900, 18, 12, 85, ARRAY['just_starting_out'], true, 14, 'One-time', 'Solo entrepreneurs wanting limited liability', 'Companies Act, 2013 — Section 3(1)(c)', NULL, 'none', 'OPC Registration Online | ₹14,999 | Ollvy', 'Register your One Person Company in 12 working days. Single owner, limited liability.', 'https://ollvy.com/services/opc-incorporation', 'MCA filing fees', 'Paid to Ministry of Corporate Affairs.',
'[{"step": 1, "title": "Share your details", "timeline": "Day 0", "body": "Business activity, proposed name, address proof. Nominee details required for OPC.", "visual": "checklist", "milestone": "CS assigned"},{"step": 2, "title": "DSC and DIN obtained", "timeline": "Day 2–4", "body": "Digital signature and director identification for you.", "visual": "form", "milestone": "DSC ready"},{"step": 3, "title": "Name approved via RUN", "timeline": "Day 4–7", "body": "OPC name approved by MCA.", "visual": "form", "milestone": "Name approved"},{"step": 4, "title": "SPICe+ filed", "timeline": "Day 7–12", "body": "MOA, AOA, PAN, TAN filed together.", "visual": "stamp", "isCompletion": true, "milestone": "OPC incorporated"}]'::jsonb,
'[{"title": "Single director, single shareholder", "body": "You own 100% with limited liability. No co-founders needed."},{"title": "Nominee member required", "body": "OPC requires a nominee who takes over if something happens to you."},{"title": "PAN and TAN included", "body": "Issued with Certificate of Incorporation."}]'::jsonb,
'[{"icon": "document", "title": "Nominee consent required", "body": "OPC needs nominee consent form INC-3. We draft and file."},{"icon": "clock", "title": "Conversion threshold", "body": "OPC must convert to Pvt Ltd if turnover exceeds ₹2Cr or capital exceeds ₹50L."}]'::jsonb,
'[{"label": "Solopreneur", "detail": "Running business alone. Want limited liability."},{"label": "Freelancer scaling up", "detail": "Need company structure for larger clients."}]'::jsonb,
'[{"category": "General", "q": "What is an OPC?", "a": "One Person Company has single member and director with limited liability."},{"category": "Process", "q": "Can OPC have employees?", "a": "Yes. OPC can hire employees and scale business."}]'::jsonb,
'[{"name": "MCA21 Portal", "url": "https://www.mca.gov.in", "description": "OPC registration"}]'::jsonb,
'[{"name": "GST Registration", "explanation": "Required once billing starts.", "price": "₹8,999", "type": "required", "slug": "gst-registration"}]'::jsonb,
ARRAY['✓ Quick incorporation', '✓ Nominee form handled', '✓ PAN same day'],
ARRAY['gst-registration', 'pvt-ltd-incorporation'])
ON CONFLICT (slug) DO NOTHING;

-- 15. Partnership Deed Registration
INSERT INTO service_packages (slug, name, short_name, category, tagline, short_description, order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate, sla_working_days, urgency_score, situation_tags, is_active, display_order, service_type, mandatory_for, legal_basis, penalty_for_missing, penalty_color, seo_title, seo_description, canonical_url, workflow_stages, whats_included, service_risks, profile_personas, faqs, review_sources, unlocks, review_keyword_chips, related_slugs) VALUES
('partnership-registration', 'Partnership Firm Registration', 'Partnership', 'Business Registration', 'Two or more partners. Simple structure. Quick start.', 'Register your partnership firm with drafted deed', 'one_time', 'one_time', 599900, 99900, 18, 7, 75, ARRAY['just_starting_out'], true, 15, 'One-time', 'Two or more partners in business', 'Indian Partnership Act, 1932', NULL, 'none', 'Partnership Firm Registration | ₹6,999 | Ollvy', 'Register partnership with drafted deed in 7 days.', 'https://ollvy.com/services/partnership-registration',
'[{"step": 1, "title": "Partner details collected", "timeline": "Day 0–1", "body": "Names, capital contribution, profit sharing ratio.", "visual": "checklist", "milestone": "Details received"},{"step": 2, "title": "Deed drafted", "timeline": "Day 1–3", "body": "Partnership deed with all clauses drafted.", "visual": "form", "milestone": "Deed ready"},{"step": 3, "title": "Deed executed", "timeline": "Day 3–5", "body": "Partners sign deed on stamp paper.", "visual": "stamp", "milestone": "Deed signed"},{"step": 4, "title": "Firm registered", "timeline": "Day 5–7", "body": "Registered with Registrar of Firms.", "visual": "stamp", "isCompletion": true, "milestone": "Firm registered"}]'::jsonb,
'[{"title": "Custom partnership deed", "body": "Drafted based on your specific terms — profit ratio, roles, exit clauses."},{"title": "Stamp paper arranged", "body": "We arrange appropriate stamp paper for your state."},{"title": "Registrar filing", "body": "Filed with Registrar of Firms in your state."}]'::jsonb,
'[{"icon": "document", "title": "Profit sharing must be clear", "body": "Disputes arise from vague profit clauses. We draft explicit terms."}]'::jsonb,
'[{"label": "Family partnership", "detail": "Running with family members."},{"label": "Professional practice", "detail": "CA/CS/lawyers forming practice."}]'::jsonb,
'[{"category": "General", "q": "Do partners have unlimited liability?", "a": "Yes. Partners are personally liable for firm debts."}]'::jsonb,
'[{"name": "Partnership Act 1932", "url": "https://www.indiacode.nic.in", "description": "Partnership regulations"}]'::jsonb,
'[{"name": "GST Registration", "explanation": "Required for billing.", "price": "₹8,999", "type": "required", "slug": "gst-registration"}]'::jsonb,
ARRAY['✓ Deed was thorough', '✓ Quick registration'],
ARRAY['gst-registration', 'llp-incorporation'])
ON CONFLICT (slug) DO NOTHING;

-- 16. MSME/Udyam Registration
INSERT INTO service_packages (slug, name, short_name, category, tagline, short_description, order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate, sla_working_days, urgency_score, situation_tags, is_active, display_order, service_type, mandatory_for, legal_basis, penalty_for_missing, penalty_color, seo_title, seo_description, canonical_url, workflow_stages, whats_included, service_risks, profile_personas, faqs, review_sources, unlocks, review_keyword_chips, related_slugs) VALUES
('msme-registration', 'MSME/Udyam Registration', 'MSME', 'Licensing', 'Government benefits. Priority lending. Subsidy schemes.', 'Register for MSME benefits under Udyam portal', 'one_time', 'one_time', 199900, 0, 18, 2, 70, ARRAY['just_starting_out'], true, 16, 'One-time', 'Micro, Small, and Medium Enterprises', 'MSME Development Act, 2006', NULL, 'none', 'MSME Udyam Registration | ₹1,999 | Ollvy', 'Get Udyam certificate in 2 days. Unlock govt schemes.', 'https://ollvy.com/services/msme-registration',
'[{"step": 1, "title": "Share Aadhaar and PAN", "timeline": "Day 0", "body": "Owner Aadhaar for OTP verification, business PAN.", "visual": "upload", "milestone": "Details received"},{"step": 2, "title": "Application filed on Udyam", "timeline": "Day 1", "body": "Application submitted on official portal.", "visual": "form", "milestone": "Application submitted"},{"step": 3, "title": "Udyam certificate issued", "timeline": "Day 1–2", "body": "Certificate with URN generated.", "visual": "stamp", "isCompletion": true, "milestone": "MSME registered"}]'::jsonb,
'[{"title": "Udyam certificate with URN", "body": "Official certificate with Unique Registration Number."},{"title": "Automatic GST linking", "body": "Your GSTIN linked to Udyam registration."},{"title": "Access to govt schemes", "body": "Priority lending, subsidy schemes, tender reservations."}]'::jsonb,
'[{"icon": "document", "title": "Self-declaration based", "body": "Investment and turnover are self-declared. Keep records for audit."}]'::jsonb,
'[{"label": "Small business", "detail": "Under ₹5Cr investment in plant/machinery."},{"label": "Service enterprise", "detail": "IT, consulting, professional services."}]'::jsonb,
'[{"category": "General", "q": "What are MSME benefits?", "a": "Priority sector lending, govt tenders, subsidy schemes."},{"category": "Process", "q": "Is Udyam registration free?", "a": "Free on portal. Our fee is for filing assistance."}]'::jsonb,
'[{"name": "Udyam Portal", "url": "https://udyamregistration.gov.in", "description": "Official MSME registration"}]'::jsonb,
'[]'::jsonb,
ARRAY['✓ Certificate same day', '✓ Very quick'],
ARRAY['gst-registration', 'startup-india'])
ON CONFLICT (slug) DO NOTHING;

-- 17. Shop and Establishment License
INSERT INTO service_packages (slug, name, short_name, category, tagline, short_description, order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate, sla_working_days, urgency_score, situation_tags, is_active, display_order, service_type, mandatory_for, legal_basis, penalty_for_missing, penalty_color, seo_title, seo_description, canonical_url, workflow_stages, whats_included, service_risks, profile_personas, faqs, review_sources, unlocks, review_keyword_chips, related_slugs) VALUES
('shop-establishment', 'Shop & Establishment License', 'Shop Act', 'Licensing', 'Mandatory for any commercial premises. State-issued.', 'Obtain shop and establishment registration', 'one_time', 'one_time', 299900, 99900, 18, 10, 70, ARRAY['just_starting_out'], true, 17, 'One-time', 'All businesses with commercial premises', 'Shops and Establishments Act (State-specific)', '₹500–₹2,500 fine per day', 'amber', 'Shop & Establishment License | ₹3,999 | Ollvy', 'Get shop act license in 10 days. State-compliant.', 'https://ollvy.com/services/shop-establishment',
'[{"step": 1, "title": "Premises and employee details", "timeline": "Day 0–1", "body": "Shop name, address, employee count, working hours.", "visual": "checklist", "milestone": "Details received"},{"step": 2, "title": "Application prepared", "timeline": "Day 1–3", "body": "Form filled for your state portal.", "visual": "form", "milestone": "Application ready"},{"step": 3, "title": "Filed on state portal", "timeline": "Day 3–8", "body": "Submitted to Labour Department.", "visual": "form", "milestone": "Application filed"},{"step": 4, "title": "License issued", "timeline": "Day 8–10", "body": "Registration certificate received.", "visual": "stamp", "isCompletion": true, "milestone": "License issued"}]'::jsonb,
'[{"title": "State-specific compliance", "body": "Each state has different rules. We handle your state."},{"title": "Renewal tracking", "body": "Most states require annual renewal. Added to your calendar."}]'::jsonb,
'[{"icon": "clock", "title": "Renewal required", "body": "Most states require annual renewal. Late renewal attracts penalty."}]'::jsonb,
'[{"label": "Opening new office", "detail": "Setting up commercial premises."},{"label": "Hiring first employee", "detail": "Shop Act needed when you have employees."}]'::jsonb,
'[{"category": "General", "q": "Is Shop Act mandatory?", "a": "Yes. All commercial establishments need it within 30 days of starting."}]'::jsonb,
'[{"name": "State Labour Portal", "url": "", "description": "Varies by state"}]'::jsonb,
'[]'::jsonb,
ARRAY['✓ State-specific handled', '✓ Renewal reminder set'],
ARRAY['professional-tax', 'gst-registration'])
ON CONFLICT (slug) DO NOTHING;

-- 18. Professional Tax Registration
INSERT INTO service_packages (slug, name, short_name, category, tagline, short_description, order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate, sla_working_days, urgency_score, situation_tags, is_active, display_order, service_type, mandatory_for, legal_basis, penalty_for_missing, penalty_color, seo_title, seo_description, canonical_url, workflow_stages, whats_included, service_risks, profile_personas, faqs, review_sources, unlocks, review_keyword_chips, related_slugs) VALUES
('professional-tax', 'Professional Tax Registration', 'PT', 'Licensing', 'State tax on professionals and employers. Monthly/annual payment.', 'Register for professional tax in your state', 'one_time', 'one_time', 199900, 0, 18, 5, 70, ARRAY['need_to_hire'], true, 18, 'One-time', 'Professionals and employers in PT-applicable states', 'Professional Tax Act (State-specific)', 'Varies by state — typically 10% penalty', 'amber', 'Professional Tax Registration | ₹1,999 | Ollvy', 'PT registration in 5 days. Employer and employee coverage.', 'https://ollvy.com/services/professional-tax',
'[{"step": 1, "title": "Business and employee details", "timeline": "Day 0–1", "body": "Entity type, employee count, state of operation.", "visual": "checklist", "milestone": "Details received"},{"step": 2, "title": "Application filed", "timeline": "Day 1–3", "body": "Filed on state commercial tax portal.", "visual": "form", "milestone": "Application submitted"},{"step": 3, "title": "PTEC/PTRC issued", "timeline": "Day 3–5", "body": "PT enrollment/registration certificate received.", "visual": "stamp", "isCompletion": true, "milestone": "PT registered"}]'::jsonb,
'[{"title": "PTEC for employers", "body": "Professional Tax Enrollment Certificate for employer registration."},{"title": "PTRC for professionals", "body": "Professional Tax Registration Certificate for individual professionals."},{"title": "Monthly/annual filing setup", "body": "Filing frequency depends on your state."}]'::jsonb,
'[{"icon": "clock", "title": "Monthly deposit", "body": "PT typically due by 30th of following month."}]'::jsonb,
'[{"label": "Hiring employees in PT state", "detail": "Maharashtra, Karnataka, etc. require PT."},{"label": "Professional starting practice", "detail": "CA/CS/lawyers need PT registration."}]'::jsonb,
'[{"category": "General", "q": "Which states have PT?", "a": "Maharashtra, Karnataka, West Bengal, Gujarat, and others."},{"category": "Process", "q": "Maximum PT amount?", "a": "₹2,500 per year (Constitutional limit)."}]'::jsonb,
'[{"name": "State Commercial Tax", "url": "", "description": "Varies by state"}]'::jsonb,
'[]'::jsonb,
ARRAY['✓ Quick registration', '✓ Filing calendar set'],
ARRAY['payroll-management', 'shop-establishment'])
ON CONFLICT (slug) DO NOTHING;

-- 19. Startup India (DPIIT) Registration
INSERT INTO service_packages (slug, name, short_name, category, tagline, short_description, order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate, sla_working_days, urgency_score, situation_tags, is_active, display_order, service_type, mandatory_for, legal_basis, penalty_for_missing, penalty_color, seo_title, seo_description, canonical_url, workflow_stages, whats_included, service_risks, profile_personas, faqs, review_sources, unlocks, review_keyword_chips, related_slugs) VALUES
('startup-india', 'Startup India (DPIIT) Registration', 'DPIIT', 'Licensing', 'Tax exemptions. Fund eligibility. Government recognition.', 'Get DPIIT recognition for your startup', 'one_time', 'one_time', 799900, 0, 18, 7, 70, ARRAY['have_investors'], true, 19, 'One-time', 'Startups with innovation or IP', 'Startup India Policy, DPIIT Guidelines', NULL, 'none', 'DPIIT Startup India Registration | ₹7,999 | Ollvy', 'Get DPIIT recognition in 7 days. Unlock tax benefits.', 'https://ollvy.com/services/startup-india',
'[{"step": 1, "title": "Business details and innovation", "timeline": "Day 0–1", "body": "Describe your product/service innovation.", "visual": "checklist", "milestone": "Details received"},{"step": 2, "title": "Application prepared", "timeline": "Day 1–3", "body": "Startup India portal application drafted.", "visual": "form", "milestone": "Application ready"},{"step": 3, "title": "Filed on portal", "timeline": "Day 3–5", "body": "Submitted to DPIIT for review.", "visual": "form", "milestone": "Application filed"},{"step": 4, "title": "Recognition received", "timeline": "Day 5–7", "body": "DPIIT certificate issued.", "visual": "stamp", "isCompletion": true, "milestone": "Startup recognized"}]'::jsonb,
'[{"title": "DPIIT recognition certificate", "body": "Official startup recognition from Government of India."},{"title": "Section 80-IAC eligibility", "body": "3 years of tax holiday on profits (if approved by Inter-Ministerial Board)."},{"title": "Angel tax exemption", "body": "Exemption from Section 56(2)(viib) on premium received."},{"title": "Fast-track patent filing", "body": "80% rebate on patent filing fees."}]'::jsonb,
'[{"icon": "document", "title": "Innovation required", "body": "Business must show innovation, scalability, or IP. We help articulate this."}]'::jsonb,
'[{"label": "Tech startup", "detail": "Building technology product or platform."},{"label": "Raising angel/VC funding", "detail": "Angel tax exemption important."}]'::jsonb,
'[{"category": "General", "q": "What is DPIIT recognition?", "a": "Government recognition as an innovative startup."},{"category": "Eligibility", "q": "Who is eligible?", "a": "Company/LLP under 10 years, turnover under ₹100Cr, innovation-driven."}]'::jsonb,
'[{"name": "Startup India", "url": "https://www.startupindia.gov.in", "description": "Official Startup India portal"}]'::jsonb,
'[]'::jsonb,
ARRAY['✓ Recognition in 5 days', '✓ Tax benefits clear'],
ARRAY['pvt-ltd-incorporation', 'trademark-registration'])
ON CONFLICT (slug) DO NOTHING;

-- 20. GST LUT Filing
INSERT INTO service_packages (slug, name, short_name, category, tagline, short_description, order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate, sla_working_days, urgency_score, situation_tags, is_active, display_order, service_type, mandatory_for, legal_basis, penalty_for_missing, penalty_color, seo_title, seo_description, canonical_url, workflow_stages, whats_included, service_risks, profile_personas, faqs, review_sources, unlocks, review_keyword_chips, related_slugs) VALUES
('gst-lut', 'GST LUT Filing', 'LUT', 'Tax Filing', 'Export without paying GST. Letter of Undertaking for exporters.', 'File LUT to export without paying IGST', 'one_time', 'annual', 299900, 0, 18, 2, 75, ARRAY['expanding_internationally'], true, 20, 'Annual', 'All exporters of goods or services', 'CGST Rules 2017, Rule 96A', 'Must pay IGST on exports if LUT not filed', 'none', 'GST LUT Filing | ₹2,999 | Ollvy', 'File LUT for zero-rated exports. Annual filing.', 'https://ollvy.com/services/gst-lut',
'[{"step": 1, "title": "Share GST details", "timeline": "Day 0", "body": "GSTIN, previous year export data.", "visual": "upload", "milestone": "Details received"},{"step": 2, "title": "LUT filed on GST portal", "timeline": "Day 1–2", "body": "Form GST RFD-11 filed.", "visual": "form", "milestone": "LUT filed"},{"step": 3, "title": "LUT ARN received", "timeline": "Day 2", "body": "Acknowledgement received.", "visual": "stamp", "isCompletion": true, "milestone": "LUT active"}]'::jsonb,
'[{"title": "Zero-rated exports", "body": "Export without paying IGST. Cash flow preserved."},{"title": "Annual validity", "body": "LUT valid for one financial year. Renewal reminded."}]'::jsonb,
'[{"icon": "clock", "title": "Annual renewal required", "body": "LUT must be filed each financial year."}]'::jsonb,
'[{"label": "Software exporter", "detail": "IT services to foreign clients."},{"label": "Goods exporter", "detail": "Physical goods exported."}]'::jsonb,
'[{"category": "General", "q": "What is LUT?", "a": "Letter of Undertaking to export without paying IGST."},{"category": "Eligibility", "q": "Who can file LUT?", "a": "Any exporter with no pending tax demands or prosecution."}]'::jsonb,
'[{"name": "GST Portal", "url": "https://www.gst.gov.in", "description": "GST compliance"}]'::jsonb,
'[]'::jsonb,
ARRAY['✓ Same day filing', '✓ Reminder for renewal'],
ARRAY['gst-registration', 'iec-code'])
ON CONFLICT (slug) DO NOTHING;

-- 21-32: More services (continuing pattern)
INSERT INTO service_packages (slug, name, short_name, category, tagline, short_description, order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate, sla_working_days, urgency_score, is_active, display_order, service_type, mandatory_for, seo_title, seo_description, canonical_url, workflow_stages, whats_included, service_risks, profile_personas, faqs, review_sources, unlocks, review_keyword_chips, related_slugs) VALUES
('gst-cancellation', 'GST Cancellation', 'GST Cancel', 'Tax Filing', 'Close your GST registration properly.', 'Cancel GST registration with final return', 'one_time', 'one_time', 299900, 0, 18, 15, 60, true, 21, 'One-time', 'Businesses closing or below threshold', 'GST Cancellation | ₹2,999 | Ollvy', 'Cancel GST with final return.', 'https://ollvy.com/services/gst-cancellation',
'[{"step": 1, "title": "ITC check", "timeline": "Day 0–2", "body": "Review ITC balance.", "visual": "checklist"},{"step": 2, "title": "GSTR-10 prepared", "timeline": "Day 2–5", "body": "Final return prepared.", "visual": "form"},{"step": 3, "title": "Cancellation filed", "timeline": "Day 5–15", "body": "REG-16 and GSTR-10 filed.", "visual": "stamp", "isCompletion": true}]'::jsonb,
'[{"title": "Final return", "body": "GSTR-10 with stock details."},{"title": "ITC reversal", "body": "Remaining ITC reversed."}]'::jsonb,
'[{"icon": "document", "title": "ITC reversal required", "body": "Unused ITC must be reversed."}]'::jsonb,
'[{"label": "Closing business", "detail": "Winding down operations."}]'::jsonb,
'[{"category": "General", "q": "What happens to ITC?", "a": "ITC on closing stock reversed."}]'::jsonb,
'[]'::jsonb, '[]'::jsonb,
ARRAY['✓ ITC handled'],
ARRAY['company-closure'])
ON CONFLICT (slug) DO NOTHING;

INSERT INTO service_packages (slug, name, short_name, category, tagline, short_description, order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate, sla_working_days, urgency_score, is_active, display_order, service_type, mandatory_for, penalty_for_missing, penalty_color, seo_title, seo_description, canonical_url, workflow_stages, whats_included, service_risks, profile_personas, faqs, review_sources, unlocks, review_keyword_chips, related_slugs) VALUES
('gst-revocation', 'GST Revocation', 'GST Revoke', 'Tax Filing', 'GST cancelled? We restore it.', 'Revoke suo-moto GST cancellation', 'one_time', 'one_time', 499900, 0, 18, 10, 90, true, 22, 'One-time', 'Businesses with cancelled GST', 'Loss of GST registration', 'red', 'GST Revocation | ₹4,999 | Ollvy', 'Restore cancelled GST registration.', 'https://ollvy.com/services/gst-revocation',
'[{"step": 1, "title": "Review order", "timeline": "Day 0–1", "body": "Check cancellation reason.", "visual": "checklist"},{"step": 2, "title": "File pending returns", "timeline": "Day 1–5", "body": "All pending returns filed.", "visual": "form"},{"step": 3, "title": "REG-21 filed", "timeline": "Day 5–10", "body": "Revocation application.", "visual": "stamp", "isCompletion": true}]'::jsonb,
'[{"title": "Pending returns filed", "body": "All GSTR-1 and GSTR-3B filed."},{"title": "Interest paid", "body": "Late payment interest calculated."}]'::jsonb,
'[{"icon": "clock", "title": "30-day deadline", "body": "File within 30 days of cancellation."}]'::jsonb,
'[{"label": "Missed filing", "detail": "GST cancelled for non-filing."}]'::jsonb,
'[{"category": "Urgency", "q": "Time limit?", "a": "Within 30 days."}]'::jsonb,
'[]'::jsonb, '[]'::jsonb,
ARRAY['✓ Returns filed'],
ARRAY['gst-monthly-50l'])
ON CONFLICT (slug) DO NOTHING;

INSERT INTO service_packages (slug, name, short_name, category, tagline, short_description, order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate, sla_working_days, urgency_score, is_active, display_order, service_type, mandatory_for, seo_title, seo_description, canonical_url, workflow_stages, whats_included, service_risks, profile_personas, faqs, review_sources, unlocks, review_keyword_chips, related_slugs) VALUES
('company-closure', 'Company Strike-Off', 'Strike-Off', 'Company Registration', 'Close your company properly.', 'Voluntary strike-off of private limited company', 'one_time', 'one_time', 999900, 500000, 18, 90, 60, true, 23, 'One-time', 'Companies wanting to close', 'Company Strike-Off | ₹14,999 | Ollvy', 'Close your company with MCA strike-off.', 'https://ollvy.com/services/company-closure',
'[{"step": 1, "title": "Pre-closure compliance", "timeline": "Day 0–15", "body": "Pending returns filed.", "visual": "checklist"},{"step": 2, "title": "Resolutions", "timeline": "Day 15–25", "body": "Board and shareholder resolutions.", "visual": "form"},{"step": 3, "title": "STK-2 filed", "timeline": "Day 35–90", "body": "Strike-off application.", "visual": "stamp", "isCompletion": true}]'::jsonb,
'[{"title": "Compliance cleared", "body": "All pending returns filed."},{"title": "STK-2 filing", "body": "Strike-off form with affidavit."}]'::jsonb,
'[{"icon": "clock", "title": "Takes 3 months", "body": "ROC processing time."}]'::jsonb,
'[{"label": "Dormant company", "detail": "No activity for 2+ years."}]'::jsonb,
'[{"category": "General", "q": "What is strike-off?", "a": "Removal from ROC register."}]'::jsonb,
'[]'::jsonb, '[]'::jsonb,
ARRAY['✓ Compliance cleared'],
ARRAY['gst-cancellation'])
ON CONFLICT (slug) DO NOTHING;

INSERT INTO service_packages (slug, name, short_name, category, tagline, short_description, order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate, sla_working_days, urgency_score, is_active, display_order, service_type, mandatory_for, seo_title, seo_description, canonical_url, workflow_stages, whats_included, service_risks, profile_personas, faqs, review_sources, unlocks, review_keyword_chips, related_slugs) VALUES
('llp-closure', 'LLP Closure', 'LLP Close', 'Company Registration', 'Close your LLP properly.', 'Voluntary strike-off of LLP', 'one_time', 'one_time', 799900, 300000, 18, 60, 60, true, 24, 'One-time', 'LLPs wanting to close', 'LLP Closure | ₹10,999 | Ollvy', 'Close your LLP with MCA strike-off.', 'https://ollvy.com/services/llp-closure',
'[{"step": 1, "title": "Compliance cleared", "timeline": "Day 0–15", "body": "Form 11, Form 8 filed.", "visual": "checklist"},{"step": 2, "title": "Partner consent", "timeline": "Day 15–20", "body": "All partners agree.", "visual": "form"},{"step": 3, "title": "Form 24 filed", "timeline": "Day 20–60", "body": "Strike-off application.", "visual": "stamp", "isCompletion": true}]'::jsonb,
'[{"title": "Returns filed", "body": "All pending returns cleared."},{"title": "Form 24", "body": "Strike-off form filed."}]'::jsonb,
'[{"icon": "document", "title": "All partners consent", "body": "Unanimous consent required."}]'::jsonb,
'[{"label": "LLP dormant", "detail": "No operations for 2+ years."}]'::jsonb,
'[{"category": "General", "q": "What is LLP strike-off?", "a": "Removal from ROC register."}]'::jsonb,
'[]'::jsonb, '[]'::jsonb,
ARRAY['✓ Clean closure'],
ARRAY['gst-cancellation'])
ON CONFLICT (slug) DO NOTHING;

INSERT INTO service_packages (slug, name, short_name, category, tagline, short_description, order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate, sla_working_days, urgency_score, is_active, display_order, service_type, mandatory_for, penalty_for_missing, penalty_color, seo_title, seo_description, canonical_url, workflow_stages, whats_included, service_risks, profile_personas, faqs, review_sources, unlocks, review_keyword_chips, related_slugs) VALUES
('roc-changes', 'ROC Change Filings', 'ROC Change', 'Company Registration', 'Any ROC change filed.', 'File any ROC form for company changes', 'one_time', 'one_time', 499900, 200000, 18, 7, 75, true, 25, 'One-time', 'Companies with changes', '₹100–₹300/day late fee', 'amber', 'ROC Change Filing | ₹6,999 | Ollvy', 'File ROC form for any change.', 'https://ollvy.com/services/roc-changes',
'[{"step": 1, "title": "Change identified", "timeline": "Day 0–1", "body": "Director, address, shares, etc.", "visual": "checklist"},{"step": 2, "title": "Documents prepared", "timeline": "Day 1–3", "body": "Resolution and documents.", "visual": "form"},{"step": 3, "title": "Form filed", "timeline": "Day 3–7", "body": "DIR-12, INC-22, etc.", "visual": "stamp", "isCompletion": true}]'::jsonb,
'[{"title": "Any ROC form", "body": "DIR-12, INC-22, SH-4, MGT-14."},{"title": "Resolution drafting", "body": "Board/shareholder resolution."}]'::jsonb,
'[{"icon": "clock", "title": "30-day deadline", "body": "Most changes within 30 days."}]'::jsonb,
'[{"label": "Adding director", "detail": "DIR-12 filing."}]'::jsonb,
'[{"category": "General", "q": "What forms?", "a": "Any company change form."}]'::jsonb,
'[]'::jsonb, '[]'::jsonb,
ARRAY['✓ Quick filing'],
ARRAY['mca-annual-filing'])
ON CONFLICT (slug) DO NOTHING;

INSERT INTO service_packages (slug, name, short_name, category, tagline, short_description, order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate, sla_working_days, urgency_score, is_active, display_order, service_type, mandatory_for, seo_title, seo_description, canonical_url, retainer_cycle_label, workflow_stages, whats_included, service_risks, profile_personas, faqs, review_sources, unlocks, review_keyword_chips, related_slugs) VALUES
('accounting-bookkeeping', 'Accounting & Bookkeeping', 'Bookkeeping', 'Monthly Compliance', 'Books maintained. Audit-ready.', 'Monthly accounting and bookkeeping service', 'recurring', 'monthly', 399900, 0, 18, 10, 80, true, 26, 'Monthly retainer', 'All businesses', 'Accounting Bookkeeping | ₹3,999/mo | Ollvy', 'Monthly bookkeeping service.', 'https://ollvy.com/services/accounting-bookkeeping', 'per month',
'[{"step": 1, "title": "Share data", "timeline": "Day 1–5", "body": "Bank statement, invoices.", "visual": "upload"},{"step": 2, "title": "Transactions recorded", "timeline": "Day 5–8", "body": "All entries passed.", "visual": "form"},{"step": 3, "title": "Monthly financials", "timeline": "Day 10", "body": "P&L and Balance Sheet.", "visual": "stamp", "isCompletion": true}]'::jsonb,
'[{"title": "Full recording", "body": "Sales, purchases, expenses."},{"title": "Bank reconciliation", "body": "Books matched with bank."},{"title": "Monthly P&L", "body": "Financial statements every month."}]'::jsonb,
'[{"icon": "document", "title": "Data on time", "body": "Late data = delayed books."}]'::jsonb,
'[{"label": "Startup", "detail": "Need proper books."}]'::jsonb,
'[{"category": "Pricing", "q": "Pricing?", "a": "₹3,999/month for up to 100 transactions."}]'::jsonb,
'[]'::jsonb, '[]'::jsonb,
ARRAY['✓ Books updated'],
ARRAY['gst-monthly-50l', 'business-itr'])
ON CONFLICT (slug) DO NOTHING;

INSERT INTO service_packages (slug, name, short_name, category, tagline, short_description, order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate, sla_working_days, urgency_score, is_active, display_order, service_type, mandatory_for, penalty_for_missing, penalty_color, seo_title, seo_description, canonical_url, workflow_stages, whats_included, service_risks, profile_personas, faqs, review_sources, unlocks, review_keyword_chips, related_slugs) VALUES
('statutory-audit', 'Statutory Audit', 'Audit', 'Tax Filing', 'Independent audit of financials.', 'Annual statutory audit by qualified CA', 'one_time', 'annual', 2499900, 0, 18, 30, 85, true, 27, 'Annual', 'All Pvt Ltd companies', '₹50,000 fine on company', 'red', 'Statutory Audit | ₹24,999 | Ollvy', 'Independent audit by qualified CA.', 'https://ollvy.com/services/statutory-audit',
'[{"step": 1, "title": "Planning", "timeline": "Day 0–5", "body": "Engagement letter, materiality.", "visual": "checklist"},{"step": 2, "title": "Fieldwork", "timeline": "Day 5–20", "body": "Vouching, verification.", "visual": "form"},{"step": 3, "title": "Audit report", "timeline": "Day 25–30", "body": "Signed report.", "visual": "stamp", "isCompletion": true}]'::jsonb,
'[{"title": "Independent opinion", "body": "True and fair view opinion."},{"title": "SA standards", "body": "Compliant with auditing standards."}]'::jsonb,
'[{"icon": "document", "title": "Books ready", "body": "Audit needs finalised books."}]'::jsonb,
'[{"label": "First audit", "detail": "First year post-incorporation."}]'::jsonb,
'[{"category": "General", "q": "Mandatory?", "a": "Yes. All Pvt Ltd companies."}]'::jsonb,
'[]'::jsonb, '[]'::jsonb,
ARRAY['✓ Thorough audit'],
ARRAY['mca-annual-filing', 'business-itr'])
ON CONFLICT (slug) DO NOTHING;

INSERT INTO service_packages (slug, name, short_name, category, tagline, short_description, order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate, sla_working_days, urgency_score, is_active, display_order, service_type, mandatory_for, penalty_for_missing, penalty_color, seo_title, seo_description, canonical_url, workflow_stages, whats_included, service_risks, profile_personas, faqs, review_sources, unlocks, review_keyword_chips, related_slugs) VALUES
('din-reactivation', 'DIN Reactivation', 'DIN Reactivate', 'Company Registration', 'DIN deactivated? We restore it.', 'Reactivate deactivated DIN', 'one_time', 'one_time', 349900, 500000, 18, 10, 85, true, 28, 'One-time', 'Directors with deactivated DIN', 'Cannot act as director', 'red', 'DIN Reactivation | ₹8,499 | Ollvy', 'Reactivate your DIN.', 'https://ollvy.com/services/din-reactivation',
'[{"step": 1, "title": "Check reason", "timeline": "Day 0–1", "body": "Deactivation reason.", "visual": "checklist"},{"step": 2, "title": "File KYC", "timeline": "Day 1–5", "body": "Pending KYC filed.", "visual": "form"},{"step": 3, "title": "DIN active", "timeline": "Day 7–10", "body": "DIN reactivated.", "visual": "stamp", "isCompletion": true}]'::jsonb,
'[{"title": "KYC filed", "body": "All pending years cleared."},{"title": "DIR-3C", "body": "Reactivation form."}]'::jsonb,
'[{"icon": "document", "title": "All companies affected", "body": "Cannot act as director anywhere."}]'::jsonb,
'[{"label": "Missed KYC", "detail": "DIN deactivated for missed KYC."}]'::jsonb,
'[{"category": "General", "q": "Why deactivated?", "a": "Usually for missed DIR-3 KYC."}]'::jsonb,
'[]'::jsonb, '[]'::jsonb,
ARRAY['✓ DIN restored'],
ARRAY['director-kyc'])
ON CONFLICT (slug) DO NOTHING;

INSERT INTO service_packages (slug, name, short_name, category, tagline, short_description, order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate, sla_working_days, urgency_score, is_active, display_order, service_type, mandatory_for, seo_title, seo_description, canonical_url, workflow_stages, whats_included, service_risks, profile_personas, faqs, review_sources, unlocks, review_keyword_chips, related_slugs) VALUES
('company-name-change', 'Company Name Change', 'Name Change', 'Company Registration', 'New name. Same company.', 'Change your company name with MCA', 'one_time', 'one_time', 699900, 300000, 18, 20, 70, true, 29, 'One-time', 'Companies changing name', 'Company Name Change | ₹9,999 | Ollvy', 'Change your company name.', 'https://ollvy.com/services/company-name-change',
'[{"step": 1, "title": "Name check", "timeline": "Day 0–2", "body": "MCA and trademark search.", "visual": "checklist"},{"step": 2, "title": "Resolutions", "timeline": "Day 2–7", "body": "Special resolution.", "visual": "form"},{"step": 3, "title": "New certificate", "timeline": "Day 18–20", "body": "Certificate with new name.", "visual": "stamp", "isCompletion": true}]'::jsonb,
'[{"title": "Name search", "body": "MCA and trademark database."},{"title": "MOA amendment", "body": "Memorandum updated."}]'::jsonb,
'[{"icon": "document", "title": "Update everywhere", "body": "GST, bank, contracts need update."}]'::jsonb,
'[{"label": "Rebranding", "detail": "New brand, new name."}]'::jsonb,
'[{"category": "Process", "q": "PAN change?", "a": "PAN remains same."}]'::jsonb,
'[]'::jsonb, '[]'::jsonb,
ARRAY['✓ Name reserved'],
ARRAY['trademark-registration'])
ON CONFLICT (slug) DO NOTHING;

INSERT INTO service_packages (slug, name, short_name, category, tagline, short_description, order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate, sla_working_days, urgency_score, is_active, display_order, service_type, mandatory_for, seo_title, seo_description, canonical_url, workflow_stages, whats_included, service_risks, profile_personas, faqs, review_sources, unlocks, review_keyword_chips, related_slugs) VALUES
('copyright-registration', 'Copyright Registration', 'Copyright', 'Licensing', 'Protect your creative work.', 'Register copyright for creative works', 'one_time', 'one_time', 799900, 50000, 18, 30, 60, true, 30, 'One-time', 'Creators of original works', 'Copyright Registration | ₹8,499 | Ollvy', 'Copyright registration.', 'https://ollvy.com/services/copyright-registration',
'[{"step": 1, "title": "Work details", "timeline": "Day 0–2", "body": "Nature, date, author.", "visual": "checklist"},{"step": 2, "title": "Application filed", "timeline": "Day 5–10", "body": "Form XIV submitted.", "visual": "form"},{"step": 3, "title": "Certificate", "timeline": "Day 10–30", "body": "Registration certificate.", "visual": "stamp", "isCompletion": true}]'::jsonb,
'[{"title": "Form XIV", "body": "Application with work description."},{"title": "Certificate", "body": "Official registration."}]'::jsonb,
'[{"icon": "document", "title": "Original work", "body": "Work must be original."}]'::jsonb,
'[{"label": "Software developer", "detail": "Protecting code."}]'::jsonb,
'[{"category": "General", "q": "What works?", "a": "Literary, artistic, software, films."}]'::jsonb,
'[]'::jsonb, '[]'::jsonb,
ARRAY['✓ Quick filing'],
ARRAY['trademark-registration'])
ON CONFLICT (slug) DO NOTHING;

INSERT INTO service_packages (slug, name, short_name, category, tagline, short_description, order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate, sla_working_days, urgency_score, is_active, display_order, service_type, mandatory_for, penalty_for_missing, penalty_color, seo_title, seo_description, canonical_url, workflow_stages, whats_included, service_risks, profile_personas, faqs, review_sources, unlocks, review_keyword_chips, related_slugs) VALUES
('esi-registration', 'ESI Registration', 'ESI', 'Payroll', 'Employee health coverage.', 'Register under ESIC', 'one_time', 'one_time', 299900, 0, 18, 7, 75, true, 31, 'One-time', 'Establishments with 10+ employees', '12% per annum penalty', 'amber', 'ESI Registration | ₹2,999 | Ollvy', 'ESIC registration.', 'https://ollvy.com/services/esi-registration',
'[{"step": 1, "title": "Employee list", "timeline": "Day 0–1", "body": "Details with Aadhaar.", "visual": "upload"},{"step": 2, "title": "Application filed", "timeline": "Day 3–5", "body": "ESIC portal submission.", "visual": "form"},{"step": 3, "title": "Employer code", "timeline": "Day 5–7", "body": "ESIC code received.", "visual": "stamp", "isCompletion": true}]'::jsonb,
'[{"title": "Employer registration", "body": "ESIC employer code."},{"title": "Employee enrollment", "body": "All eligible employees enrolled."}]'::jsonb,
'[{"icon": "clock", "title": "Monthly contributions", "body": "Due by 15th."}]'::jsonb,
'[{"label": "10 employees", "detail": "ESI now mandatory."}]'::jsonb,
'[{"category": "General", "q": "Who eligible?", "a": "Employees earning up to ₹21,000/month."}]'::jsonb,
'[]'::jsonb, '[]'::jsonb,
ARRAY['✓ Quick registration'],
ARRAY['payroll-management', 'pf-registration'])
ON CONFLICT (slug) DO NOTHING;

INSERT INTO service_packages (slug, name, short_name, category, tagline, short_description, order_type, billing_cycle, price_base_paisa, price_govt_fees_paisa, price_gst_rate, sla_working_days, urgency_score, is_active, display_order, service_type, mandatory_for, penalty_for_missing, penalty_color, seo_title, seo_description, canonical_url, workflow_stages, whats_included, service_risks, profile_personas, faqs, review_sources, unlocks, review_keyword_chips, related_slugs) VALUES
('pf-registration', 'PF Registration', 'PF', 'Payroll', 'Provident Fund for employees.', 'Register under EPFO', 'one_time', 'one_time', 299900, 0, 18, 10, 75, true, 32, 'One-time', 'Establishments with 20+ employees', '1% per month interest', 'amber', 'PF Registration | ₹2,999 | Ollvy', 'EPFO registration.', 'https://ollvy.com/services/pf-registration',
'[{"step": 1, "title": "Employee details", "timeline": "Day 0–2", "body": "Aadhaar, bank details.", "visual": "upload"},{"step": 2, "title": "DSC obtained", "timeline": "Day 2–4", "body": "Signatory DSC.", "visual": "form"},{"step": 3, "title": "PF code issued", "timeline": "Day 7–10", "body": "EPFO code received.", "visual": "stamp", "isCompletion": true}]'::jsonb,
'[{"title": "Establishment code", "body": "EPFO employer code."},{"title": "UAN activation", "body": "UANs for all employees."}]'::jsonb,
'[{"icon": "clock", "title": "Monthly due", "body": "PF due by 15th."}]'::jsonb,
'[{"label": "20 employees", "detail": "PF now mandatory."}]'::jsonb,
'[{"category": "General", "q": "When mandatory?", "a": "At 20+ employees."}]'::jsonb,
'[]'::jsonb, '[]'::jsonb,
ARRAY['✓ Quick registration'],
ARRAY['payroll-management', 'esi-registration'])
ON CONFLICT (slug) DO NOTHING;

-- Update display order for all services
UPDATE service_packages SET display_order = 14 WHERE slug = 'opc-incorporation';
UPDATE service_packages SET display_order = 15 WHERE slug = 'partnership-registration';
UPDATE service_packages SET display_order = 16 WHERE slug = 'msme-registration';
UPDATE service_packages SET display_order = 17 WHERE slug = 'shop-establishment';
UPDATE service_packages SET display_order = 18 WHERE slug = 'professional-tax';
UPDATE service_packages SET display_order = 19 WHERE slug = 'startup-india';
UPDATE service_packages SET display_order = 20 WHERE slug = 'gst-lut';
UPDATE service_packages SET display_order = 21 WHERE slug = 'gst-cancellation';
UPDATE service_packages SET display_order = 22 WHERE slug = 'gst-revocation';
UPDATE service_packages SET display_order = 23 WHERE slug = 'company-closure';
UPDATE service_packages SET display_order = 24 WHERE slug = 'llp-closure';
UPDATE service_packages SET display_order = 25 WHERE slug = 'roc-changes';
UPDATE service_packages SET display_order = 26 WHERE slug = 'accounting-bookkeeping';
UPDATE service_packages SET display_order = 27 WHERE slug = 'statutory-audit';
UPDATE service_packages SET display_order = 28 WHERE slug = 'din-reactivation';
UPDATE service_packages SET display_order = 29 WHERE slug = 'company-name-change';
UPDATE service_packages SET display_order = 30 WHERE slug = 'copyright-registration';
UPDATE service_packages SET display_order = 31 WHERE slug = 'esi-registration';
UPDATE service_packages SET display_order = 32 WHERE slug = 'pf-registration';
