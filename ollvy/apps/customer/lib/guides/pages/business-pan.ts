import { LearnPageConfig } from '../pages'

export const businessPanGuide: LearnPageConfig = {
  slug: 'what-is-business-pan',
  title: 'Business PAN: What It Is and Why Your Company Needs It',
  seoTitle: 'Business PAN Card for Company and LLP: Complete Guide (2026) | Ollvy',
  seoDescription: 'Companies and LLPs now get PAN automatically at incorporation via SPICe+ and FiLLiP. Who still needs to apply (firms, trusts, older entities), what you cannot do without PAN, and how Form 49A works.',
  canonicalUrl: 'https://www.ollvy.com/guides/what-is-business-pan',
  lastReviewed: 'July 2026',
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
      body: 'PAN stands for Permanent Account Number. It is a 10-character alphanumeric identifier issued by the Income Tax Department of India to every taxpayer in the country.\n\nFor businesses, PAN is the foundational compliance document. Every company, LLP, partnership firm, trust, and society must have one. Without it, you cannot open a current bank account, register for GST, file income tax returns, or have TDS deducted and credited in your name.\n\nCompanies incorporated since February 2020 get PAN and TAN automatically: one government form (SPICe+, with the linked AGILE-PRO-S) covers incorporation, PAN, and TAN, and the PAN is printed on the Certificate of Incorporation itself. LLPs get the same through FiLLiP since March 2022. A separate application (Form 49A on the Protean or UTIITSL portal) is needed only for partnership firms, trusts, societies, and entities incorporated before these dates that never obtained one.',
      note: 'Source: Section 139A, Income Tax Act 1961; the requirement continues unchanged under the Income-tax Act 2025 from 1 April 2026. Mandatory for all companies, LLPs, and firms.',
    },
    {
      number: '02',
      heading: 'COMPANY PAN VS DIRECTOR PAN: NOT THE SAME THING',
      body: 'This is the most common point of confusion among founders. A company is a separate legal entity from its directors. The company needs its own PAN. Each director also needs their own individual PAN. These are completely different numbers.\n\nThe company PAN is used for the company\'s income tax returns, TDS deductions made by the company on vendor and employee payments, and all financial transactions in the company\'s name.\n\nThe director\'s individual PAN is used for the director\'s personal income tax filing and their own financial transactions.\n\nWhen you receive your Certificate of Incorporation from MCA, the company\'s PAN and TAN are printed on it - no separate application is needed. The directors\' individual PANs are unaffected by incorporation; they were quoted in SPICe+ but stay personal.',
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
      body: 'This section applies to entities that did not get a PAN automatically at incorporation: partnership firms, trusts, societies, AOPs, and companies or LLPs from before the SPICe+ / FiLLiP integration. The application is Form 49A on the Protean (formerly NSDL) or UTIITSL portal. The process is online but requires supporting documents based on your entity type.\n\nThe steps are: document preparation and CA review, Form 49A completion with entity details, NSDL portal submission with documents attached, acknowledgement number generation (same day), NSDL verification and Income Tax Department processing, and e-PAN delivery to your registered email.\n\nNSDL processes applications within 5 to 7 working days from the date of submission. The e-PAN arrives by email and can be used immediately for all purposes. The physical PAN card takes an additional 10 to 15 days to arrive by post at your registered office.\n\nThe government fee for physical PAN card delivery within India is Rs. 107 including GST.',
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
      note: 'Having a CA verify all documents before submission eliminates most rejection risk. Ollvy CA reviews every document before submitting to Protean.',
    },
  ],

  faqs: [
    {
      q: 'My company was incorporated yesterday. Do I need to apply for PAN?',
      a: 'Check your Certificate of Incorporation first - for companies incorporated via SPICe+ (mandatory since February 2020), the PAN and TAN are printed on it, and the e-PAN reaches the company email within a few days. You only need to apply if your entity is a partnership firm, trust, or society, or if the e-PAN never arrived (raise it with the CPC or apply for a reprint). Banks accept the Certificate of Incorporation showing the PAN for account opening.',
    },
    {
      q: 'Does an LLP need a different process than a Private Limited Company?',
      a: 'Not anymore for new entities: companies get PAN through SPICe+ and LLPs through FiLLiP, both automatically at incorporation. For older entities applying manually, the form (49A) and the Protean portal are the same; only the supporting documents differ - companies submit the MOA and AOA, LLPs submit the LLP Agreement.',
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
