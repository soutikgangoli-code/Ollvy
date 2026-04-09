-- Add Business PAN Registration service package

INSERT INTO service_packages (
  slug,
  name,
  short_name,
  short_description,
  tagline,
  category,
  service_type,
  mandatory_for,
  legal_basis,
  penalty_for_missing,
  penalty_color,
  price_base_paisa,
  price_govt_fees_paisa,
  govt_fee_label,
  govt_fee_note,
  sla_working_days,
  billing_cycle,
  is_active,
  display_order,
  seo_title,
  seo_description,
  canonical_url,
  workflow_stages,
  whats_included,
  service_risks,
  profile_personas,
  faqs,
  review_sources,
  unlocks,
  review_keyword_chips,
  related_slugs,
  scope_excluded,
  show_completion_stats,
  show_approval_rate,
  variants,
  default_variant_id,
  service_explainer
) VALUES (
  'business-pan',
  'Business PAN Registration',
  'Business PAN',
  'Get your company or LLP PAN registered in 7 working days. Required for bank account opening, GST registration, and income tax filing. CA-handled, documents collected online.',
  'Company PAN in 7 working days. Required before bank account, GST, or ITR.',
  'Compliance',
  'One-time',
  'All companies, LLPs, partnership firms, trusts, and societies',
  'Section 139A, Income Tax Act 1961',
  'Cannot open bank account, register for GST, or file income tax without PAN',
  'red',
  99900,
  10700,
  'NSDL processing fee',
  'Paid to NSDL. Rs. 107 for domestic delivery, Rs. 1,017 for international.',
  7,
  'one_time',
  true,
  15,
  'Business PAN Registration for Company, LLP and Firm (2025) | Ollvy',
  'Get your company or LLP PAN registered in 7 working days. Required for bank account opening, GST registration, and income tax filing. CA-handled, documents collected online.',
  'https://www.ollvy.com/services/business-pan',
  -- workflow_stages
  '[
    {"step": 1, "title": "Upload documents - CA reviews same day", "timeline": "Day 0", "body": "Answer questions about your entity type, incorporation date, and signatory details. Upload Certificate of Incorporation, address proof, and signatory documents. CA reviews within 4 hours.", "visual": "upload", "milestone": "Documents verified by CA"},
    {"step": 2, "title": "Form 49A prepared", "timeline": "Day 1", "body": "CA prepares Form 49A with your entity details, registered office address, and authorised signatory information. All fields completed correctly for your entity type.", "visual": "form", "milestone": "Form 49A ready for submission"},
    {"step": 3, "title": "Application submitted to NSDL", "timeline": "Day 1-2", "body": "Form 49A submitted on NSDL portal with supporting documents. Acknowledgement number generated immediately and shared in your app.", "visual": "form", "milestone": "NSDL acknowledgement number shared"},
    {"step": 4, "title": "NSDL processing", "timeline": "Day 2-5", "body": "Income Tax Department processes your application. This stage is governed by government timelines. You can track status on the NSDL portal using your acknowledgement number.", "visual": "calendar", "milestone": "Application under processing"},
    {"step": 5, "title": "PAN delivered", "timeline": "Day 5-7", "body": "e-PAN delivered to your registered email. Physical card dispatched by NSDL to your registered office address. PAN added to your Ollvy compliance calendar for ITR deadlines.", "visual": "stamp", "milestone": "e-PAN delivered, compliance calendar updated", "isCompletion": true}
  ]'::jsonb,
  -- whats_included
  '[
    {"title": "CA prepares and files Form 49A", "body": "All fields completed correctly for your entity type. NSDL portal submission handled end to end.", "comparisonWithout": "Navigate NSDL portal yourself - 2+ hours, risk of rejection for incorrect fields", "comparisonWithOllvy": "CA handles everything - you upload documents, we file"},
    {"title": "Acknowledgement number shared same day", "body": "NSDL acknowledgement number shared immediately on submission so you can track status yourself. Banks accept the acknowledgement letter while PAN is processing."},
    {"title": "e-PAN delivered to your email", "body": "e-PAN sent the moment NSDL allots the number. Physical card delivered in 10 to 15 days to your registered office."},
    {"title": "PAN added to your compliance calendar", "body": "Linked to your Ollvy account for ITR and other filing deadlines from day one. Never miss a deadline."}
  ]'::jsonb,
  -- service_risks
  '[
    {"icon": "document", "title": "Name mismatch on documents", "body": "The entity name on Form 49A must match the Certificate of Incorporation exactly. Even small differences like Pvt vs Private cause rejection. CA verifies all documents for consistency before submission."},
    {"icon": "mismatch", "title": "Outdated address proof", "body": "Address proof must be less than 2 months old. Old utility bills are the most common rejection reason. CA checks document dates before filing."},
    {"icon": "alert", "title": "Missing board resolution", "body": "Companies and LLPs must provide a board resolution authorising the signatory. We provide the template after payment and verify it is properly signed before submission."}
  ]'::jsonb,
  -- profile_personas
  '[
    {"label": "Just incorporated - need PAN for bank account", "detail": "Most common case. Company registered, bank requires PAN to open current account. We file immediately after incorporation."},
    {"label": "LLP needing PAN for GST registration", "detail": "GST portal requires PAN. We handle PAN first, then GST registration can proceed."},
    {"label": "Partnership firm registering for the first time", "detail": "Partnership deed and partner details required. Lower fee applies."},
    {"label": "Existing company - PAN never applied for", "detail": "Old company that operated without PAN. Now needed for compliance. We handle the application with current documents."}
  ]'::jsonb,
  -- faqs
  '[
    {"category": "General", "q": "My company was just incorporated. How urgently do I need PAN?", "a": "Apply within the first week. You cannot open a bank account without PAN, and you cannot receive or make business payments without a bank account. Most founders apply for PAN and bank account simultaneously, using the PAN acknowledgement letter for the bank while the actual PAN is being processed."},
    {"category": "General", "q": "Is the company PAN different from the director''s PAN?", "a": "Yes. The company is a separate legal entity and needs its own PAN. Each director also needs their own individual PAN. These are different numbers for different purposes - company PAN for company tax filings, director PAN for personal filings."},
    {"category": "Process", "q": "How long does PAN registration take?", "a": "NSDL processes applications within 5 to 7 working days. e-PAN arrives by email within 48 hours of allotment. Physical card takes an additional 10 to 15 days."},
    {"category": "Process", "q": "Can I use the acknowledgement number while waiting?", "a": "Yes. Banks and the GST portal accept the NSDL acknowledgement number. We share the acknowledgement number the same day we submit your application."},
    {"category": "General", "q": "Does a proprietorship need a separate business PAN?", "a": "Not always. A sole proprietorship is not a separate legal entity, so the proprietor''s individual PAN can be used. But if the business name differs from the personal name, a business PAN avoids confusion."},
    {"category": "General", "q": "Is company PAN required for GST registration?", "a": "Yes. The GST portal links GSTIN to company PAN. Apply for PAN first, then GST. Ollvy handles both."}
  ]'::jsonb,
  -- review_sources
  '[
    {"name": "Income Tax Department - PAN Application Guide", "url": "https://www.incometax.gov.in/iec/foportal/help/how-to-apply-for-pan", "description": "Official IT department guide for PAN application process"},
    {"name": "NSDL e-Gov PAN Portal", "url": "https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html", "description": "NSDL portal where Form 49A applications are submitted"},
    {"name": "Income Tax Act, 1961 (Section 139A)", "url": "https://www.incometax.gov.in", "description": "Statutory requirement for PAN for companies and LLPs"}
  ]'::jsonb,
  -- unlocks
  '[
    {"name": "Open Company Bank Account", "explanation": "Banks require PAN to open a current account. Use acknowledgement letter while PAN processes.", "price": "Free", "type": "required", "slug": ""},
    {"name": "GST Registration", "explanation": "GST portal requires company PAN. Apply for GST once PAN is received.", "price": "₹999", "type": "required", "slug": "gst-registration"},
    {"name": "Business ITR Filing", "explanation": "Company must file ITR every year using company PAN. First ITR due by October 31.", "price": "₹4,999", "type": "required", "slug": "business-itr"},
    {"name": "TDS Monthly Compliance", "explanation": "TDS deductions are linked to company PAN. Required once you start paying salaries or vendor invoices.", "price": "₹2,999/month", "type": "beneficial", "slug": "tds-monthly-compliance"}
  ]'::jsonb,
  -- review_keyword_chips
  ARRAY['e-PAN in 5 days', 'Acknowledgement same day', 'CA handled documents', 'Bank-accepted letter'],
  -- related_slugs
  ARRAY['gst-registration', 'pvt-ltd-incorporation', 'llp-incorporation', 'tds-monthly-compliance', 'business-itr'],
  -- scope_excluded
  ARRAY[
    'GST registration (available separately)',
    'TAN registration (available separately)',
    'PAN corrections or changes after allotment',
    'Duplicate PAN for lost physical card',
    'Individual director PAN (each director needs a separate individual PAN)'
  ],
  -- show_completion_stats
  true,
  -- show_approval_rate
  true,
  -- variants
  '[
    {"id": "pvt-ltd-llp-opc", "label": "Pvt Ltd / LLP / OPC", "sublabel": "Incorporated with MCA", "priceAdjustment": 0},
    {"id": "partnership-proprietorship", "label": "Partnership / Proprietorship", "sublabel": "Registered firm or sole proprietorship", "priceAdjustment": -20000}
  ]'::jsonb,
  -- default_variant_id
  'pvt-ltd-llp-opc',
  -- service_explainer
  '{"steps":[{"step":1,"title":"What it is","visual":"info","body":"A Business PAN (Permanent Account Number) is a 10-character alphanumeric identifier issued by the Income Tax Department. Every company, LLP, partnership firm, trust, and society must have its own PAN - separate from the directors'' or partners'' individual PANs."},{"step":2,"title":"Why you need it","visual":"sparkles","body":"PAN is the foundational compliance document for any business. Without it, you cannot open a current bank account, register for GST, file income tax returns, or deduct TDS. It is typically the first compliance step after incorporation."},{"step":3,"title":"What happens without it","visual":"alert","body":"No bank account, no GST registration, no ITR filing, no TDS compliance. Every financial transaction your company makes requires PAN. Operating without it is not possible for any registered business entity."}]}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  short_description = EXCLUDED.short_description,
  tagline = EXCLUDED.tagline,
  category = EXCLUDED.category,
  service_type = EXCLUDED.service_type,
  mandatory_for = EXCLUDED.mandatory_for,
  legal_basis = EXCLUDED.legal_basis,
  penalty_for_missing = EXCLUDED.penalty_for_missing,
  penalty_color = EXCLUDED.penalty_color,
  price_base_paisa = EXCLUDED.price_base_paisa,
  price_govt_fees_paisa = EXCLUDED.price_govt_fees_paisa,
  govt_fee_label = EXCLUDED.govt_fee_label,
  govt_fee_note = EXCLUDED.govt_fee_note,
  sla_working_days = EXCLUDED.sla_working_days,
  billing_cycle = EXCLUDED.billing_cycle,
  is_active = EXCLUDED.is_active,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  canonical_url = EXCLUDED.canonical_url,
  workflow_stages = EXCLUDED.workflow_stages,
  whats_included = EXCLUDED.whats_included,
  service_risks = EXCLUDED.service_risks,
  profile_personas = EXCLUDED.profile_personas,
  faqs = EXCLUDED.faqs,
  review_sources = EXCLUDED.review_sources,
  unlocks = EXCLUDED.unlocks,
  review_keyword_chips = EXCLUDED.review_keyword_chips,
  related_slugs = EXCLUDED.related_slugs,
  scope_excluded = EXCLUDED.scope_excluded,
  show_completion_stats = EXCLUDED.show_completion_stats,
  show_approval_rate = EXCLUDED.show_approval_rate,
  variants = EXCLUDED.variants,
  default_variant_id = EXCLUDED.default_variant_id,
  service_explainer = EXCLUDED.service_explainer;
