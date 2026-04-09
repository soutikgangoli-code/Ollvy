-- ─── COMPLETE BUSINESS PAN SERVICE - FULL SQL ───────────────────────────────
-- Run this as a new migration file:
-- supabase/migrations/20260409000002_add_business_pan_service.sql

INSERT INTO service_packages (
  slug,
  name,
  short_name,
  category,
  base_price,
  govt_fee,
  gst_rate,
  sla_working_days,
  is_active,
  is_featured,
  sort_order,
  canonical_url,
  seo_title,
  seo_description,
  whats_included,
  scope_excluded,
  workflow_stages,
  variants,
  faqs,
  review_sources
) VALUES (
  'business-pan',
  'Business PAN Registration',
  'Business PAN',
  'compliance',
  99900,
  10700,
  18,
  7,
  true,
  true,
  15,
  'https://www.ollvy.com/services/business-pan',
  'Business PAN Registration for Company, LLP and Firm (2025) | Ollvy',
  'Get your company or LLP PAN registered in 7 working days. Required for bank account opening, GST registration, and income tax filing. CA-handled, documents collected online.',

  -- whats_included
  '[
    {"title": "CA prepares and files Form 49A", "description": "All fields completed correctly for your entity type. NSDL portal submission handled end to end."},
    {"title": "Acknowledgement number shared same day", "description": "NSDL acknowledgement number shared immediately on submission so you can track status yourself."},
    {"title": "e-PAN delivered to your email", "description": "e-PAN sent the moment NSDL allots the number. Physical card delivered in 10 to 15 days."},
    {"title": "PAN added to your compliance calendar", "description": "Linked to your Ollvy account for ITR and other filing deadlines from day one."}
  ]'::jsonb,

  -- scope_excluded
  ARRAY[
    'GST registration (available separately)',
    'TAN registration (available separately)',
    'PAN corrections or changes after allotment',
    'Duplicate PAN for lost physical card',
    'Individual director PAN (each director needs a separate individual PAN)'
  ],

  -- workflow_stages
  '[
    {"key": "document_collection", "label": "Document Collection", "description": "CA reviews your uploaded documents and confirms they are complete and valid for NSDL submission."},
    {"key": "form_preparation", "label": "Form 49A Preparation", "description": "CA prepares Form 49A with your entity details, registered address, and signatory information."},
    {"key": "application_submission", "label": "Application Submitted", "description": "Form submitted to NSDL with supporting documents. Acknowledgement number shared with you the same day."},
    {"key": "nsdl_processing", "label": "NSDL Processing", "description": "Income Tax Department processes your application. This stage is governed by government timelines."},
    {"key": "pan_delivered", "label": "PAN Delivered", "description": "e-PAN delivered to your registered email. Physical card dispatched by NSDL to your registered office."}
  ]'::jsonb,

  -- variants
  '[
    {"id": "pvt-ltd-llp-opc", "label": "Pvt Ltd / LLP / OPC", "sublabel": "Incorporated with MCA", "price_adjustment": 0, "default": true},
    {"id": "partnership-proprietorship", "label": "Partnership / Proprietorship", "sublabel": "Registered firm or sole proprietorship", "price_adjustment": -20000}
  ]'::jsonb,

  -- faqs
  '[
    {
      "category": "Getting Started",
      "q": "My company was just incorporated. Do I need PAN before I can open a bank account?",
      "a": "Yes. Banks require your company PAN to open a current account. Apply immediately after incorporation. Most banks also accept the NSDL acknowledgement letter while the physical card is in transit, so you can start the bank account process in parallel."
    },
    {
      "category": "Getting Started",
      "q": "Is the company PAN different from my personal PAN as a director?",
      "a": "Yes. Your company is a separate legal entity and needs its own PAN. You as a director also need your own individual PAN. These are completely separate numbers used for different purposes. MCA does not automatically issue a company PAN when you incorporate."
    },
    {
      "category": "Process",
      "q": "How long does it take to get the company PAN?",
      "a": "NSDL processes applications within 5 to 7 working days. The e-PAN arrives by email within 48 hours of allotment. The physical card takes an additional 10 to 15 days to arrive at your registered office by post."
    },
    {
      "category": "Process",
      "q": "Can I use the acknowledgement number while waiting for the actual PAN?",
      "a": "Yes. The NSDL acknowledgement number is accepted by banks and the GST portal while the application is processing. We share it the same day we submit your application so you do not lose time."
    },
    {
      "category": "Process",
      "q": "Is company PAN required before GST registration?",
      "a": "Yes. The GST portal links your GSTIN to your company PAN. Your GSTIN is derived directly from your PAN. Apply for PAN first, then GST. Ollvy handles both and the GST registration can be initiated the moment your PAN is allotted."
    },
    {
      "category": "Documents",
      "q": "What if my registered office is in a rented property?",
      "a": "Upload both the rent agreement and a utility bill in the landlord's name showing the address. The combination of both documents satisfies the NSDL address proof requirement for rented premises."
    },
    {
      "category": "Documents",
      "q": "My company name in the Certificate of Incorporation has punctuation. Does it need to match exactly in Form 49A?",
      "a": "Yes, exactly. Even differences like Private vs Pvt or a missing comma can cause the application to be held or rejected. Your CA will verify the name against the CoI before submitting."
    },
    {
      "category": "After PAN",
      "q": "My company already has a PAN but the physical card is lost. Do I need this service?",
      "a": "No. This service is for first-time PAN registration only. For a lost or damaged card, apply for a duplicate PAN through NSDL directly. That is a simpler process and costs only the government fee."
    }
  ]'::jsonb,

  -- review_sources
  '[
    {"name": "Income Tax Department - PAN Application Guide", "url": "https://www.incometax.gov.in/iec/foportal/help/how-to-apply-for-pan", "description": "Official IT department guide for PAN application process and documents"},
    {"name": "NSDL e-Gov PAN Portal", "url": "https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html", "description": "NSDL portal where Form 49A applications are submitted for companies"},
    {"name": "Income Tax Act, 1961 (Section 139A)", "url": "https://www.incometax.gov.in", "description": "Statutory requirement for PAN for companies, LLPs, and firms"}
  ]'::jsonb
);
