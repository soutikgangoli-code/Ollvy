// ─── COMPLETE BUSINESS PAN GUIDE PAGE CONFIG ─────────────────────────────────
// Add this to lib/guides/pages.ts
// Follows the exact same LearnPageConfig schema as the other 24 notice pages

export const businessPanGuide = {
  slug: 'what-is-business-pan',
  title: 'Business PAN: What It Is and Why Your Company Needs It',
  seoTitle: 'Business PAN Card for Company and LLP: Complete Guide (2025) | Ollvy',
  seoDescription: 'Every company, LLP, and firm needs a PAN before opening a bank account or registering for GST. Understand what business PAN is, who needs it, and how to get it in 7 days.',
  canonicalUrl: 'https://www.ollvy.com/guides/what-is-business-pan',
  lastReviewed: 'March 2026',
  category: 'Income Tax Notice',
  severity: 'moderate',
  deadline: 'Required before bank account opening, GST registration, or income tax filing',
  deadlineNote: 'Without a PAN, your company cannot open a bank account or receive business payments. Apply within the first week of incorporation.',
  relatedServiceSlugs: ['business-pan', 'gst-registration', 'pvt-ltd-incorporation'],
  relatedLearnSlugs: ['income-tax-143-1-intimation', 'income-tax-156-demand'],
  ctaServiceSlug: 'business-pan',
  relatedTools: {
    penaltyCalculators: [],
    documentChecklists: ['business-pan'],
  },

  sections: [
    {
      number: '01',
      heading: 'WHAT IS A BUSINESS PAN AND WHO NEEDS ONE',
      body: 'PAN stands for Permanent Account Number. It is a 10-character alphanumeric identifier issued by the Income Tax Department of India to every taxpayer in the country.\n\nFor businesses, PAN is the foundational compliance document. Every company, LLP, partnership firm, trust, and society must have one. Without it, you cannot open a current bank account, register for GST, file income tax returns, or have TDS deducted and credited in your name.\n\nFor a company or LLP, PAN is typically the first compliance step after incorporation. MCA issues the Certificate of Incorporation but does not automatically issue a PAN. You must apply separately through the NSDL or UTI ITSL portal.',
      note: 'Source: Section 139A, Income Tax Act 1961. Mandatory for all companies, LLPs, and firms.',
    },
    {
      number: '02',
      heading: 'COMPANY PAN VS DIRECTOR PAN: NOT THE SAME THING',
      body: 'This is the most common point of confusion among founders. A company is a separate legal entity from its directors. The company needs its own PAN. Each director also needs their own individual PAN. These are completely different numbers.\n\nThe company PAN is used for the company\'s income tax returns, TDS deductions made by the company on vendor and employee payments, and all financial transactions in the company\'s name.\n\nThe director\'s individual PAN is used for the director\'s personal income tax filing and their own financial transactions.\n\nWhen you receive your Certificate of Incorporation from MCA, you receive the company\'s CIN and legal name. PAN must be applied for separately within a reasonable time after incorporation.',
    },
    {
      number: '03',
      heading: 'WHAT YOU CANNOT DO WITHOUT A COMPANY PAN',
      body: 'Every one of these requires your company PAN before you can proceed.',
      bullets: [
        'Open a current bank account in the company\'s name - banks require PAN as mandatory KYC for all entities',
        'Register for GST - the GST portal derives your GSTIN directly from your company PAN',
        'File the company\'s income tax return - ITR-6 for companies, ITR-5 for LLPs',
        'Deduct TDS on salary, contractor, or vendor payments - your TAN is linked to your PAN',
        'Receive payments from clients who need to deduct TDS - they need your PAN to file their TDS return correctly',
        'Apply for government tenders or registrations that require entity KYC',
        'Onboard to e-commerce platforms like Amazon Business, Flipkart, or GeM for B2B selling',
      ],
    },
    {
      number: '04',
      heading: 'HOW THE APPLICATION PROCESS WORKS',
      body: 'Business PAN is applied through Form 49A on the NSDL or UTI ITSL portal. The process is online but requires supporting documents based on your entity type.\n\nThe steps are: document preparation and CA review, Form 49A completion with entity details, NSDL portal submission with documents attached, acknowledgement number generation (same day), NSDL verification and Income Tax Department processing, and e-PAN delivery to your registered email.\n\nNSDL processes applications within 5 to 7 working days from the date of submission. The e-PAN arrives by email and can be used immediately for all purposes. The physical PAN card takes an additional 10 to 15 days to arrive by post at your registered office.\n\nThe government fee for physical PAN card delivery within India is Rs. 107 including GST.',
      note: 'Source: NSDL e-Gov PAN Portal - https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html',
    },
    {
      number: '05',
      heading: 'WHY APPLICATIONS GET REJECTED AND HOW TO AVOID IT',
      body: 'A rejected application means resubmission and an additional wait of 5 to 7 working days. Most rejections are caused by the same preventable errors.',
      bullets: [
        'Name mismatch: the entity name in Form 49A does not match the Certificate of Incorporation exactly, including punctuation and abbreviations',
        'Outdated address proof: utility bill or bank statement is more than 2 months old',
        'Missing board resolution: the authorisation letter is absent, unsigned, or not on company letterhead',
        'Signatory PAN issues: the PAN of the authorised signatory is invalid or the name does not match their Aadhaar',
        'Poor document quality: blurry, cropped, or partially visible documents',
        'Wrong CIN or LLPIN: even a single character error causes the application to fail verification',
      ],
      note: 'Having a CA verify all documents before submission eliminates most rejection risk. We review every document before submitting to NSDL.',
    },
  ],

  faqs: [
    {
      q: 'My company was incorporated yesterday. How urgently do I need to apply for PAN?',
      a: 'Apply within the first week. You cannot open a bank account without PAN, and you cannot receive or make business payments without a bank account. Start the PAN application and bank account application simultaneously. Banks accept the NSDL acknowledgement letter while the physical PAN card is being processed.',
    },
    {
      q: 'Does an LLP need a different process than a Private Limited Company?',
      a: 'The form (49A) and the NSDL portal are the same. The supporting documents differ. Companies submit the MOA and AOA. LLPs submit the LLP Agreement. The timeline and process are identical.',
    },
    {
      q: 'Can I use my personal PAN for company transactions until the company PAN arrives?',
      a: 'No. Business transactions must use the company PAN. Using a personal PAN for company transactions creates tax and legal complications that are difficult to unwind later. Use the NSDL acknowledgement number where a PAN is required while the application is processing.',
    },
    {
      q: 'Will the company PAN be automatically linked to my GST registration when I apply?',
      a: 'Yes. The GST portal links your GSTIN to your company PAN during the registration process. Your GSTIN is derived from your PAN. The GST portal verifies your PAN with the Income Tax database before issuing the GSTIN.',
    },
    {
      q: 'Does a sole proprietorship need a separate PAN in the business name?',
      a: 'Not always. A sole proprietorship is not a separate legal entity, so the proprietor\'s individual PAN can be used for business purposes. However, if your business name differs from your personal name, applying for a PAN in the firm name avoids confusion with clients, banks, and government portals.',
    },
    {
      q: 'What if my company\'s registered office address is a virtual office?',
      a: 'Virtual office addresses are accepted by NSDL provided you have a valid rent or service agreement with the virtual office provider and a utility bill or NOC from them confirming the address. Upload both documents together as the address proof.',
    },
  ],

  sources: [
    {
      name: 'Income Tax Department - PAN Application Guide',
      url: 'https://www.incometax.gov.in/iec/foportal/help/how-to-apply-for-pan',
      description: 'Official IT department guide for PAN application process and document requirements',
    },
    {
      name: 'NSDL e-Gov PAN Portal',
      url: 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html',
      description: 'NSDL portal where Form 49A applications are submitted for companies',
    },
    {
      name: 'Income Tax Act, 1961 (Section 139A)',
      url: 'https://www.incometax.gov.in',
      description: 'Statutory requirement for PAN for all companies, LLPs, and firms',
    },
  ],
}
