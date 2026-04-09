// ─── PAN CARD FOR BUSINESS - COMPLETE SERVICE CONFIG ─────────────────────────
// Everything needed to implement this service end to end

// ─── 1. SUPABASE SQL - Run in SQL editor ──────────────────────────────────────

/*
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
  '[
    {"title": "Form 49A prepared and filed by CA", "description": "All fields completed correctly for your entity type. NSDL portal submission handled end to end."},
    {"title": "PAN allotment letter delivered digitally", "description": "e-PAN sent to your registered email the moment NSDL allots the number. Physical card delivery in 10-15 days."},
    {"title": "Acknowledgement number shared same day", "description": "NSDL acknowledgement number shared immediately on submission so you can track status yourself."},
    {"title": "PAN linked to your compliance calendar", "description": "Added to your Ollvy account for ITR and other filing deadlines."}
  ]'::jsonb,
  ARRAY[
    'GST registration (available separately)',
    'TAN registration (required for TDS deduction, available separately)',
    'Changes to company name or address after PAN is issued',
    'Physical PAN card courier charges if delivery address is outside India',
    'PAN for individual directors (each director needs a separate individual PAN)'
  ],
  '[
    {"key": "document_collection", "label": "Document Collection", "description": "CA reviews your documents and confirms they are complete and valid for submission."},
    {"key": "form_preparation", "label": "Form 49A Preparation", "description": "CA prepares Form 49A with your entity details, registered office address, and signatory information."},
    {"key": "application_submission", "label": "Application Submission", "description": "Form submitted to NSDL portal along with supporting documents. Acknowledgement number shared with you."},
    {"key": "nsdl_processing", "label": "NSDL Processing", "description": "Income Tax Department processes your application. This stage is governed by government timelines."},
    {"key": "pan_delivered", "label": "PAN Delivered", "description": "e-PAN delivered to your email. Physical card dispatched by NSDL to your registered office address."}
  ]'::jsonb,
  '[
    {"id": "pvt-ltd-llp-opc", "label": "Pvt Ltd / LLP / OPC", "sublabel": "Company or LLP incorporated with MCA", "price_adjustment": 0, "default": true},
    {"id": "partnership-proprietorship", "label": "Partnership / Proprietorship", "sublabel": "Registered firm or sole proprietorship", "price_adjustment": -20000}
  ]'::jsonb,
  '[
    {"name": "Income Tax Department - PAN Services", "url": "https://www.incometax.gov.in/iec/foportal/help/how-to-apply-for-pan", "description": "Official IT department guide for PAN application"},
    {"name": "NSDL e-Gov PAN Portal", "url": "https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html", "description": "NSDL portal where PAN applications are submitted for companies"},
    {"name": "UTI Infrastructure Technology - PAN", "url": "https://www.utiitsl.com/UTIITSL_SITE/pan/index.html", "description": "UTI ITSL portal alternative for PAN applications"}
  ]'::jsonb
);
*/

// ─── 2. QUESTIONNAIRE QUESTIONS ───────────────────────────────────────────────
// Add these to your questionnaire config for slug 'business-pan'
// These appear in the post-payment questionnaire flow

export const businessPanQuestions = [
  {
    key: 'entity_type',
    label: 'What type of business entity are you registering PAN for?',
    type: 'select',
    required: true,
    options: [
      { value: 'pvt_ltd', label: 'Private Limited Company' },
      { value: 'llp', label: 'Limited Liability Partnership (LLP)' },
      { value: 'opc', label: 'One Person Company (OPC)' },
      { value: 'partnership', label: 'Partnership Firm' },
      { value: 'proprietorship', label: 'Sole Proprietorship' },
      { value: 'trust', label: 'Trust' },
      { value: 'society', label: 'Society or Association' },
    ],
    help: 'This determines which form and supporting documents are required.',
  },
  {
    key: 'entity_name',
    label: 'Full name of the business entity as registered',
    type: 'text',
    required: true,
    placeholder: 'Exactly as it appears on your Certificate of Incorporation or registration document',
    help: 'This must match your incorporation certificate exactly, including punctuation.',
  },
  {
    key: 'date_of_incorporation',
    label: 'Date of incorporation or registration',
    type: 'date',
    required: true,
    help: 'For companies and LLPs, this is the date on your Certificate of Incorporation from MCA.',
  },
  {
    key: 'registered_office_address',
    label: 'Registered office address (full)',
    type: 'textarea',
    required: true,
    placeholder: 'Flat/Shop No, Building Name, Street, Area, City, State, PIN',
    help: 'This must match the address proof you will upload. Include PIN code.',
  },
  {
    key: 'state_of_registration',
    label: 'State where the business is registered',
    type: 'select',
    required: true,
    options: [
      { value: 'AN', label: 'Andaman and Nicobar Islands' },
      { value: 'AP', label: 'Andhra Pradesh' },
      { value: 'AR', label: 'Arunachal Pradesh' },
      { value: 'AS', label: 'Assam' },
      { value: 'BR', label: 'Bihar' },
      { value: 'CH', label: 'Chandigarh' },
      { value: 'CG', label: 'Chhattisgarh' },
      { value: 'DD', label: 'Daman and Diu' },
      { value: 'DL', label: 'Delhi' },
      { value: 'GA', label: 'Goa' },
      { value: 'GJ', label: 'Gujarat' },
      { value: 'HR', label: 'Haryana' },
      { value: 'HP', label: 'Himachal Pradesh' },
      { value: 'JK', label: 'Jammu and Kashmir' },
      { value: 'JH', label: 'Jharkhand' },
      { value: 'KA', label: 'Karnataka' },
      { value: 'KL', label: 'Kerala' },
      { value: 'LA', label: 'Ladakh' },
      { value: 'LD', label: 'Lakshadweep' },
      { value: 'MP', label: 'Madhya Pradesh' },
      { value: 'MH', label: 'Maharashtra' },
      { value: 'MN', label: 'Manipur' },
      { value: 'ML', label: 'Meghalaya' },
      { value: 'MZ', label: 'Mizoram' },
      { value: 'NL', label: 'Nagaland' },
      { value: 'OD', label: 'Odisha' },
      { value: 'PY', label: 'Puducherry' },
      { value: 'PB', label: 'Punjab' },
      { value: 'RJ', label: 'Rajasthan' },
      { value: 'SK', label: 'Sikkim' },
      { value: 'TN', label: 'Tamil Nadu' },
      { value: 'TS', label: 'Telangana' },
      { value: 'TR', label: 'Tripura' },
      { value: 'UP', label: 'Uttar Pradesh' },
      { value: 'UK', label: 'Uttarakhand' },
      { value: 'WB', label: 'West Bengal' },
    ],
  },
  {
    key: 'nature_of_business',
    label: 'Nature of business (brief description)',
    type: 'text',
    required: true,
    placeholder: 'e.g. Software development and IT services, Trading in electronic goods',
    help: 'A short description of what the business does. This appears on the PAN application.',
  },
  {
    key: 'authorised_signatory_name',
    label: 'Name of authorised signatory (director, partner, or proprietor)',
    type: 'text',
    required: true,
    placeholder: 'Full name as on Aadhaar or PAN',
    help: 'The person who will sign the PAN application form. Must be a director, designated partner, or proprietor.',
  },
  {
    key: 'authorised_signatory_pan',
    label: 'PAN of the authorised signatory',
    type: 'text',
    required: true,
    placeholder: 'e.g. ABCDE1234F',
    help: 'The individual PAN of the person signing the application. Required by NSDL for verification.',
  },
  {
    key: 'cin_llpin',
    label: 'CIN (for companies) or LLPIN (for LLPs)',
    type: 'text',
    required: false,
    placeholder: 'e.g. U72900DL2024PTC123456 or AAC-1234',
    help: 'Not required for partnerships or proprietorships. Leave blank if not applicable.',
    conditional: {
      field: 'entity_type',
      values: ['pvt_ltd', 'llp', 'opc'],
    },
  },
  {
    key: 'email_for_epan',
    label: 'Email address where e-PAN should be delivered',
    type: 'email',
    required: true,
    placeholder: 'company email preferred',
    help: 'NSDL sends the e-PAN PDF to this address. Use the company email, not a personal one.',
  },
  {
    key: 'mobile_for_otp',
    label: 'Mobile number for OTP verification',
    type: 'tel',
    required: true,
    placeholder: '10-digit mobile number',
    help: 'NSDL requires OTP verification during application. Must be accessible during the filing process.',
  },
]

// ─── 3. DOCUMENT CHECKLIST CONFIG ─────────────────────────────────────────────
// Add to lib/tools/document-checklist-pages.ts

export const businessPanDocumentChecklist = {
  slug: 'business-pan',
  title: 'Documents Required for Business PAN Registration',
  seoTitle: 'Documents for Business PAN Card Registration (2025) | Ollvy',
  seoDescription: 'Complete list of documents required for company, LLP, or firm PAN registration in India. Certificate of Incorporation, address proof, signatory details, and authorisation letter.',
  canonicalUrl: 'https://www.ollvy.com/tools/documents/business-pan',
  lastReviewed: 'March 2026',
  relatedServiceSlug: 'business-pan',
  intro: 'The Income Tax Department requires proof of identity, address, and constitution for all business entities applying for PAN. Documents vary by entity type. Upload clear scanned copies in PDF or JPG format, each under 2MB.',

  sections: [
    {
      number: '01',
      heading: 'For Private Limited Company, OPC, or LLP',
      documents: [
        {
          name: 'Certificate of Incorporation',
          description: 'Issued by MCA on the date of registration. Must be the original digital copy downloaded from MCA portal, not a photocopy.',
          mandatory: true,
          accepted_formats: ['PDF'],
          notes: 'If your company was incorporated before 2015, you may have a physical certificate. A clear scan is acceptable.',
        },
        {
          name: 'Memorandum of Association (MOA)',
          description: 'For Private Limited and OPC. The complete MOA with all pages, as filed with MCA.',
          mandatory: true,
          accepted_formats: ['PDF'],
          notes: 'Not required for LLPs. LLPs must submit the LLP Agreement instead.',
          entity_types: ['pvt_ltd', 'opc'],
        },
        {
          name: 'Articles of Association (AOA)',
          description: 'For Private Limited and OPC. The complete AOA with all pages.',
          mandatory: true,
          accepted_formats: ['PDF'],
          notes: 'Not required for LLPs.',
          entity_types: ['pvt_ltd', 'opc'],
        },
        {
          name: 'LLP Agreement',
          description: 'For LLPs only. The registered LLP Agreement filed with MCA, with the LLP seal or stamp.',
          mandatory: true,
          accepted_formats: ['PDF'],
          notes: 'Not required for Private Limited or OPC. Must be the version registered with MCA.',
          entity_types: ['llp'],
        },
        {
          name: 'Registered Office Address Proof',
          description: 'Any one of: electricity bill, telephone bill, broadband bill, water bill, or bank statement showing the registered office address. Must be less than 2 months old.',
          mandatory: true,
          accepted_formats: ['PDF', 'JPG'],
          notes: 'If the registered office is a rented property, also upload the rent agreement along with the utility bill in the owner\'s name.',
        },
        {
          name: 'Board Resolution or Authorization Letter',
          description: 'A board resolution authorising the specific director or partner to sign the PAN application on behalf of the company or LLP.',
          mandatory: true,
          accepted_formats: ['PDF'],
          notes: 'Must be on company letterhead, signed by all directors (for companies) or all designated partners (for LLPs). We will provide a template after payment.',
        },
        {
          name: 'PAN of Authorised Signatory',
          description: 'Copy of the personal PAN card of the director or designated partner signing the application.',
          mandatory: true,
          accepted_formats: ['PDF', 'JPG'],
        },
        {
          name: 'Aadhaar of Authorised Signatory',
          description: 'Copy of the Aadhaar card (front and back) of the authorised signatory.',
          mandatory: true,
          accepted_formats: ['PDF', 'JPG'],
          notes: 'Aadhaar must have the same name and date of birth as the PAN. If there is a discrepancy, notify your CA before uploading.',
        },
      ],
    },
    {
      number: '02',
      heading: 'For Partnership Firm',
      documents: [
        {
          name: 'Partnership Deed',
          description: 'Registered partnership deed with all pages, executed on stamp paper of appropriate value.',
          mandatory: true,
          accepted_formats: ['PDF'],
          notes: 'If the firm is unregistered, the unregistered deed is acceptable but registration is recommended.',
        },
        {
          name: 'Certificate of Registration of Firm',
          description: 'Issued by the Registrar of Firms. Required only if the firm is registered.',
          mandatory: false,
          accepted_formats: ['PDF'],
          notes: 'Upload if available. Not mandatory for unregistered firms.',
        },
        {
          name: 'Registered Office Address Proof',
          description: 'Electricity bill, telephone bill, or bank statement for the firm\'s principal place of business. Less than 2 months old.',
          mandatory: true,
          accepted_formats: ['PDF', 'JPG'],
        },
        {
          name: 'PAN of All Partners',
          description: 'Copy of individual PAN card of each partner.',
          mandatory: true,
          accepted_formats: ['PDF', 'JPG'],
        },
        {
          name: 'Aadhaar of Managing Partner',
          description: 'Aadhaar of the managing partner or the partner signing the application.',
          mandatory: true,
          accepted_formats: ['PDF', 'JPG'],
        },
      ],
    },
    {
      number: '03',
      heading: 'For Sole Proprietorship',
      documents: [
        {
          name: 'Any one business registration proof',
          description: 'Any one of: GST registration certificate, Shop and Establishment registration, MSME/Udyam registration, or professional tax registration. Shows the business exists.',
          mandatory: true,
          accepted_formats: ['PDF'],
          notes: 'If the business is not registered anywhere yet, apply for GST or Shop and Establishment registration first. Ollvy can help with both.',
        },
        {
          name: 'Address proof of business premises',
          description: 'Electricity bill, telephone bill, or bank statement for the business address. Less than 2 months old.',
          mandatory: true,
          accepted_formats: ['PDF', 'JPG'],
        },
        {
          name: 'PAN of Proprietor',
          description: 'Copy of the proprietor\'s individual PAN card.',
          mandatory: true,
          accepted_formats: ['PDF', 'JPG'],
          notes: 'A proprietorship PAN is essentially the proprietor\'s individual PAN used for business purposes. If you already have an individual PAN, a separate business PAN is not required unless you want one in the business name.',
        },
        {
          name: 'Aadhaar of Proprietor',
          description: 'Aadhaar card (front and back) of the proprietor.',
          mandatory: true,
          accepted_formats: ['PDF', 'JPG'],
        },
      ],
    },
  ],

  faqs: [
    {
      q: 'My company was just incorporated. Do I need a PAN before I can open a bank account?',
      a: 'Yes. Banks require your company PAN to open a current account. Apply for PAN immediately after incorporation. Most banks also accept the PAN allotment acknowledgement letter while the physical card is in transit.',
    },
    {
      q: 'Is the company PAN different from the director\'s PAN?',
      a: 'Yes. The company is a separate legal entity and needs its own PAN. Each director also needs their own individual PAN. These are four different numbers. One is for the company\'s income tax filings, the others are for the directors\' personal filings.',
    },
    {
      q: 'How long does PAN registration take after documents are submitted?',
      a: 'NSDL typically processes applications within 5 to 7 working days. The e-PAN arrives by email within 48 hours of allotment. The physical card takes an additional 10 to 15 days to arrive at your registered office.',
    },
    {
      q: 'Can I use the PAN acknowledgement number while waiting for the actual PAN?',
      a: 'Yes. The NSDL acknowledgement number can be used for most purposes while the application is processing. Banks and the GST portal accept it. We share the acknowledgement number the same day we submit your application.',
    },
    {
      q: 'My company already has a PAN but I lost the card. Do I need to apply again?',
      a: 'No. This service is for new PAN registration only. For a lost card or reprint, you need to apply for a duplicate PAN through NSDL. This is a simpler process and cheaper. Contact us separately for this.',
    },
    {
      q: 'Is a company PAN required for GST registration?',
      a: 'Yes. GST registration requires the company PAN. Apply for PAN first, then GST. Ollvy handles both - you can add GST registration to your order or do it separately after PAN is received.',
    },
  ],

  sources: [
    {
      name: 'Income Tax Department - PAN Application Guide',
      url: 'https://www.incometax.gov.in/iec/foportal/help/how-to-apply-for-pan',
      description: 'Official IT department guide for PAN application process and documents',
    },
    {
      name: 'NSDL e-Gov PAN Portal',
      url: 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html',
      description: 'NSDL portal where Form 49A applications are submitted',
    },
    {
      name: 'Income Tax Act, 1961 (Section 139A)',
      url: 'https://www.incometax.gov.in',
      description: 'Statutory requirement for PAN for companies and LLPs',
    },
  ],
}

// ─── 4. SERVICE PAGE CONFIG (TypeScript) ─────────────────────────────────────
// Add to lib/data/services.ts or the relevant services data file

export const businessPanServiceConfig = {
  slug: 'business-pan',
  name: 'Business PAN Registration',
  shortName: 'Business PAN',
  category: 'compliance',
  seoTitle: 'Business PAN Registration for Company, LLP and Firm (2025) | Ollvy',
  seoDescription: 'Get your company or LLP PAN registered in 7 working days. Required for bank account opening, GST registration, and income tax filing. CA-handled, documents collected online.',
  canonicalUrl: 'https://www.ollvy.com/services/business-pan',

  // Hero section
  tagline: 'Company PAN in 7 working days',
  description: 'Every company, LLP, and registered firm needs a PAN before it can open a bank account, register for GST, or file income tax. We handle the Form 49A application, document verification, and NSDL submission. You share documents through the app.',

  // Price display
  basePrice: 99900, // in paise
  govtFee: 10700,   // in paise
  slaDays: 7,

  // Variants
  variants: [
    {
      id: 'pvt-ltd-llp-opc',
      label: 'Pvt Ltd / LLP / OPC',
      sublabel: 'Incorporated with MCA',
      priceAdjustment: 0,
      default: true,
    },
    {
      id: 'partnership-proprietorship',
      label: 'Partnership / Proprietorship',
      sublabel: 'Registered firm or sole proprietorship',
      priceAdjustment: -20000,
    },
  ],

  // What's included
  whatsIncluded: [
    {
      title: 'CA prepares and files Form 49A',
      description: 'All fields completed correctly for your entity type. NSDL portal submission handled end to end.',
    },
    {
      title: 'Acknowledgement number shared same day',
      description: 'NSDL acknowledgement number shared immediately on submission so you can track status yourself.',
    },
    {
      title: 'e-PAN delivered to your email',
      description: 'e-PAN sent the moment NSDL allots the number. Physical card delivered in 10 to 15 days.',
    },
    {
      title: 'PAN added to your compliance calendar',
      description: 'Linked to your Ollvy account for ITR and other filing deadlines from day one.',
    },
  ],

  // What's not included
  scopeExcluded: [
    'GST registration (available separately)',
    'TAN registration (available separately)',
    'PAN corrections or changes after allotment',
    'Duplicate PAN for lost physical card',
    'Individual director PAN (each director needs a separate individual PAN)',
  ],

  // Workflow stages shown to customer
  workflowStages: [
    {
      key: 'document_collection',
      label: 'Document Collection',
      description: 'CA reviews your uploaded documents and confirms they are complete and valid for submission.',
    },
    {
      key: 'form_preparation',
      label: 'Form 49A Preparation',
      description: 'CA prepares Form 49A with your entity details, registered address, and signatory information.',
    },
    {
      key: 'application_submission',
      label: 'Application Submission',
      description: 'Form submitted to NSDL with supporting documents. Acknowledgement number shared with you.',
    },
    {
      key: 'nsdl_processing',
      label: 'NSDL Processing',
      description: 'Income Tax Department processes your application. This stage is governed by government timelines.',
    },
    {
      key: 'pan_delivered',
      label: 'PAN Delivered',
      description: 'e-PAN delivered to your email. Physical card dispatched to your registered office.',
    },
  ],

  // Reviews (fallback, Feb-April 2026)
  reviews: [
    {
      rating: 5,
      comment: 'PAN allotment letter in 5 days. Needed it urgently for bank account opening. CA handled everything after I uploaded the documents.',
      date: 'March 2026',
    },
    {
      rating: 5,
      comment: 'Just incorporated our LLP and needed PAN fast. Acknowledgement number came the same day they submitted. Bank accepted it immediately.',
      date: 'April 2026',
    },
  ],

  // Review chips (quick trust signals)
  reviewChips: [
    'e-PAN in 5 days',
    'Acknowledgement same day',
    'CA handled documents',
    'Bank-accepted letter',
  ],

  // Related services
  relatedServiceSlugs: [
    'gst-registration',
    'pvt-ltd-incorporation',
    'llp-incorporation',
    'tds-monthly-compliance',
    'business-itr',
  ],

  // Review sources for HowWeReviewed component
  reviewSources: [
    {
      name: 'Income Tax Department - PAN Application Guide',
      url: 'https://www.incometax.gov.in/iec/foportal/help/how-to-apply-for-pan',
      description: 'Official IT department guide for PAN application process',
    },
    {
      name: 'NSDL e-Gov PAN Portal',
      url: 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html',
      description: 'NSDL portal for Form 49A submissions',
    },
    {
      name: 'Income Tax Act, 1961 (Section 139A)',
      url: 'https://www.incometax.gov.in',
      description: 'Statutory requirement for PAN',
    },
  ],

  // Guide page (appears under /guides/what-is-business-pan)
  guideSlug: 'what-is-business-pan',
}

// ─── 5. GUIDE PAGE CONFIG ─────────────────────────────────────────────────────
// Add to lib/guides/pages.ts

export const businessPanGuide = {
  slug: 'what-is-business-pan',
  title: 'Business PAN: What It Is and Why Your Company Needs It',
  seoTitle: 'Business PAN Card for Company and LLP: Complete Guide (2025) | Ollvy',
  seoDescription: 'Every company, LLP, and firm needs a PAN before opening a bank account or registering for GST. Understand what business PAN is, who needs it, and how to get it.',
  canonicalUrl: 'https://www.ollvy.com/guides/what-is-business-pan',
  lastReviewed: 'March 2026',
  category: 'Income Tax Notice',
  relatedServiceSlugs: ['business-pan', 'gst-registration', 'pvt-ltd-incorporation'],
  relatedLearnSlugs: ['income-tax-143-1-intimation', 'income-tax-156-demand'],
  ctaServiceSlug: 'business-pan',
  severity: 'moderate',
  deadline: 'Required before bank account opening, GST registration, or ITR filing',

  sections: [
    {
      number: '01',
      heading: 'WHAT IS A BUSINESS PAN AND WHO NEEDS ONE',
      body: 'PAN stands for Permanent Account Number. It is a 10-character alphanumeric identifier issued by the Income Tax Department of India. Every taxpayer in India, including companies, LLPs, partnership firms, trusts, and societies, must have a PAN.\n\nFor businesses, PAN is the foundational compliance document. Without it, you cannot open a current bank account, register for GST, file income tax returns, or deduct TDS. It is typically the first compliance step after incorporation.',
      note: 'Source: Section 139A, Income Tax Act 1961. Mandatory for all companies, LLPs, and firms with taxable income.',
    },
    {
      number: '02',
      heading: 'THE DIFFERENCE BETWEEN COMPANY PAN AND DIRECTOR PAN',
      body: 'This is the most common point of confusion. A company is a separate legal entity from its directors. The company needs its own PAN. Each director also needs their own individual PAN. These are completely separate numbers.\n\nThe company PAN is used for the company\'s income tax returns, TDS deductions made by the company, and all financial transactions in the company\'s name. The director\'s individual PAN is used for the director\'s personal income tax filing and their own financial transactions.\n\nWhen you incorporate a company, MCA issues the Certificate of Incorporation but does not automatically issue a PAN. You must apply separately.',
    },
    {
      number: '03',
      heading: 'WHEN YOU NEED BUSINESS PAN',
      body: 'You need your company PAN before you can do any of the following.',
      bullets: [
        'Open a current bank account in the company\'s name - banks require PAN as mandatory KYC',
        'Register for GST - the GST portal links your GSTIN to the company PAN',
        'File the company\'s income tax return (ITR-6 for companies, ITR-5 for LLPs)',
        'Deduct TDS on payments to employees, vendors, or contractors (TAN is linked to PAN)',
        'Receive payments from clients who need to deduct TDS (they need your PAN to file their TDS return)',
        'Apply for government tenders or registrations that require financial KYC',
        'Register on e-commerce platforms like Amazon or Flipkart for B2B selling',
      ],
    },
    {
      number: '04',
      heading: 'HOW THE APPLICATION PROCESS WORKS',
      body: 'Business PAN is applied through Form 49A on the NSDL or UTI ITSL portal. The process is online but requires physical or digital copies of supporting documents.\n\nThe key steps are: document preparation, Form 49A completion, NSDL submission with documents, acknowledgement number generation, NSDL verification and processing, and e-PAN delivery to the registered email.\n\nNSDL processes applications within 5 to 7 working days. The e-PAN arrives by email and can be used immediately. The physical card takes 10 to 15 additional days to arrive by post.',
      note: 'The government fee for PAN with physical card delivery within India is Rs. 107. For international delivery it is Rs. 1,017.',
    },
    {
      number: '05',
      heading: 'COMMON REASONS FOR PAN APPLICATION REJECTION',
      body: 'Applications are rejected or put on hold for these reasons.',
      bullets: [
        'Name in Form 49A does not match the Certificate of Incorporation exactly (even small differences like "Pvt" vs "Private" matter)',
        'Address proof is more than 2 months old or does not match the registered office address',
        'Board resolution or authorisation letter is missing or not properly signed',
        'PAN of the authorised signatory is invalid or the name does not match Aadhaar',
        'Documents are blurry, cropped, or in an unsupported format',
        'CIN or LLPIN is entered incorrectly',
      ],
      note: 'A rejected application means resubmission and an additional wait period. Having a CA review documents before submission eliminates most rejection risk.',
    },
  ],

  faqs: [
    {
      q: 'My company was incorporated yesterday. How urgently do I need PAN?',
      a: 'Apply within the first week. You cannot open a bank account without PAN, and you cannot receive or make business payments without a bank account. Most founders apply for PAN and bank account simultaneously, using the PAN acknowledgement letter for the bank while the actual PAN is being processed.',
    },
    {
      q: 'Does an LLP need a different form than a company?',
      a: 'No. Both companies and LLPs use Form 49A. The supporting documents differ - companies submit MOA and AOA, LLPs submit the LLP Agreement. The process and timeline are the same.',
    },
    {
      q: 'Can I use my personal PAN for business transactions until the company PAN arrives?',
      a: 'No. Business transactions must use the company PAN. Using a personal PAN for company transactions creates tax and legal complications. Use the NSDL acknowledgement number where required until the PAN arrives.',
    },
    {
      q: 'Will the company PAN be automatically linked to my GST registration?',
      a: 'Yes. When you apply for GST registration, the GSTIN is derived from your company PAN. Your GSTIN will be your state code + PAN + entity number + check digit. The GST portal verifies your PAN during the registration process.',
    },
    {
      q: 'Does a proprietorship need a separate business PAN?',
      a: 'Not always. A sole proprietorship is not a separate legal entity, so the proprietor\'s individual PAN can be used for business purposes. However, some banks and platforms require a PAN in the business name. If your business name differs from your personal name, applying for a business PAN in the firm name avoids confusion.',
    },
  ],

  sources: [
    {
      name: 'Income Tax Department - PAN Services',
      url: 'https://www.incometax.gov.in/iec/foportal/help/how-to-apply-for-pan',
      description: 'Official PAN application guide from the Income Tax Department',
    },
    {
      name: 'NSDL e-Gov PAN Portal',
      url: 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html',
      description: 'Official NSDL portal for Form 49A submissions',
    },
    {
      name: 'Income Tax Act, 1961 (Section 139A)',
      url: 'https://www.incometax.gov.in',
      description: 'Statutory basis for PAN requirement',
    },
  ],
}
