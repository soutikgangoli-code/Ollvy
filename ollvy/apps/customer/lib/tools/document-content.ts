// lib/tools/document-content.ts
// Auto-generated SEO content for Ollvy document checklist tool pages
// FY 2025-26 rules and rates

export interface DocumentPageContent {
  slug: string
  // SEO metadata - use these in page metadata exports
  seo: {
    title: string // Meta title (50-60 chars ideal)
    description: string // Meta description (150-160 chars ideal)
    keywords: string[] // Target keywords for the page
    canonical: string // Canonical URL path
  }
  intro: {
    title: string
    description: string
    whoNeeds: string[]
    timeline: string
    cost: string
  }
  steps: {
    title: string
    description: string
  }[]
  faqs: {
    question: string
    answer: string
  }[]
  commonMistakes: string[]
  nextSteps: {
    title: string
    href: string
  }[]
}

// ─────────────────────────────────────────────
// 1. GST REGISTRATION
// ─────────────────────────────────────────────
export const gstRegistrationContent: DocumentPageContent = {
  slug: 'gst-registration',
  seo: {
    title: 'GST Registration Documents Checklist India 2025-26 | Ollvy',
    description: 'Complete list of documents required for GST registration in India. PAN, Aadhaar, address proof, bank details for proprietors, partnerships & companies.',
    keywords: [
      'GST registration documents',
      'documents required for GST',
      'GST registration checklist',
      'GST documents list India',
      'GSTIN documents',
      'GST registration requirements 2025',
    ],
    canonical: '/tools/documents/gst-registration',
  },
  intro: {
    title: 'How to Register for GST in India (2025-26)',
    description: `If your business crosses the turnover threshold in India, you need GST registration. Once registered, you'll get a 15-digit GSTIN that lets you collect tax from customers, claim input tax credit, and operate legally across states.

The entire process happens online at gst.gov.in - no paper forms, no office visits. There's no government fee either. Most businesses still work with a CA or compliance professional to avoid document rejections, but you can absolutely do it yourself. After you submit, verification happens through Aadhaar OTP or a tax officer visit, and you'll typically get approved in 3-7 working days.`,
    whoNeeds: [
      'Your annual turnover exceeds Rs. 40 lakhs (goods) or Rs. 20 lakhs (services) in regular states',
      'You operate in special category states with turnover above Rs. 20 lakhs (goods) or Rs. 10 lakhs (services)',
      'You sell or provide services across state lines - GST is mandatory regardless of turnover',
      'You sell on e-commerce platforms like Amazon, Flipkart, or Swiggy',
      'You occasionally make taxable supplies as a casual or non-resident taxable person',
      'You need to pay tax under the reverse charge mechanism',
      'You act as an agent of suppliers or operate as an input service distributor',
    ],
    timeline: '3-7 working days',
    cost: 'Government fee: Free | Professional assistance: Rs. 999-2,499',
  },
  steps: [
    {
      title: 'Check if you actually need to register',
      description: 'First, confirm your turnover crosses the threshold or that you fall into a mandatory category (like interstate sellers). If you qualify, decide whether you want regular GST or the simpler Composition Scheme (available if turnover is below Rs. 1.5 crore).',
    },
    {
      title: 'Gather your documents',
      description: 'You\'ll need your PAN card, Aadhaar card, proof of business address (electricity bill or rent agreement works), bank account details with a cancelled cheque, and passport-size photos of all promoters.',
    },
    {
      title: 'Create your GST portal account',
      description: 'Head to gst.gov.in, click New Registration, and fill out Part A of Form REG-01 with your PAN, mobile number, and email. You\'ll get a Temporary Reference Number (TRN) via SMS and email.',
    },
    {
      title: 'Complete Part B of the application',
      description: 'Log in with your TRN and fill in the details - business name, address, HSN/SAC codes for what you sell, bank account info, and details of all partners, directors, or the proprietor.',
    },
    {
      title: 'Upload documents and submit',
      description: 'Upload everything in the right format (JPEG or PDF, under 1 MB each). Submit using Aadhaar OTP authentication or your Digital Signature Certificate (DSC).',
    },
    {
      title: 'Track your application',
      description: 'Note down your Application Reference Number (ARN). You can track status on the GST portal. If the officer raises a query, you have 7 working days to respond - miss this and your application gets rejected.',
    },
    {
      title: 'Download your GSTIN',
      description: 'Once approved, you\'ll get your GSTIN and GST Registration Certificate (Form REG-06). Download it from the portal and display it at your main place of business.',
    },
  ],
  faqs: [
    {
      question: 'What is the turnover limit for mandatory GST registration?',
      answer: 'In regular states, it\'s Rs. 40 lakhs for goods and Rs. 20 lakhs for services. Special category states (Manipur, Mizoram, Nagaland, Tripura) have lower limits - Rs. 20 lakhs for goods and Rs. 10 lakhs for services. But if you sell interstate, you need GST regardless of how much you earn.',
    },
    {
      question: 'Can I register voluntarily even if I\'m below the threshold?',
      answer: 'Yes, and it often makes sense to. If your clients are GST-registered businesses, they\'ll want to claim input tax credit - which they can only do if you\'re registered too. Once you register voluntarily, you have to follow all GST rules just like everyone else.',
    },
    {
      question: 'How many GSTINs can a business have?',
      answer: 'You get one GSTIN per state per PAN. Operating in multiple states? You\'ll need separate registrations for each. Within a single state, you can also add multiple places of business under one GSTIN.',
    },
    {
      question: 'What happens if I don\'t register when I should?',
      answer: 'You\'ll face a penalty of 10% of the tax due, with a minimum of Rs. 10,000. If the department catches deliberate tax evasion, that jumps to 100% of the tax amount - and criminal prosecution becomes possible.',
    },
    {
      question: 'Can a sole proprietor use their personal PAN for GST?',
      answer: 'Yes. As a sole proprietor, you and your business are legally the same entity, so your individual PAN works. Partnerships, LLPs, and companies need to use the firm or company PAN instead.',
    },
    {
      question: 'What is the Composition Scheme and should I opt for it?',
      answer: 'It\'s a simplified option for small businesses with turnover up to Rs. 1.5 crore (Rs. 75 lakhs in special states). You pay a fixed percentage - 1% for traders, 2% for manufacturers, 5% for restaurants - instead of regular tax rates. The catch? You can\'t issue tax invoices or claim input tax credit.',
    },
  ],
  commonMistakes: [
    'Using your personal PAN when you should be using the firm or company PAN',
    'Getting HSN or SAC codes wrong - this causes classification disputes during audits',
    'Selecting the wrong business category or state, which means starting over after rejection',
    'Uploading blurry or expired documents that trigger officer queries and delays',
    'Forgetting to list all your places of business - adding branches later creates compliance headaches',
    'Choosing regular registration when the Composition Scheme would save you money and time',
    'Not responding to officer queries within 7 working days - automatic rejection',
  ],
  nextSteps: [
    { title: 'GST Monthly Filing (GSTR-3B)', href: '/services/gst-monthly-filing' },
    { title: 'Business ITR Filing', href: '/services/business-itr' },
    { title: 'MSME/Udyam Registration', href: '/services/msme-udyam' },
  ],
}

// ─────────────────────────────────────────────
// 2. PRIVATE LIMITED COMPANY REGISTRATION
// ─────────────────────────────────────────────
export const privateLimitedCompanyContent: DocumentPageContent = {
  slug: 'private-limited-company',
  seo: {
    title: 'Private Limited Company Registration Documents 2025-26 | Ollvy',
    description: 'Documents required for Pvt Ltd company registration in India. DSC, DIN, MOA, AOA, address proof checklist for SPICe+ form filing.',
    keywords: [
      'private limited company documents',
      'Pvt Ltd registration documents',
      'company registration checklist India',
      'SPICe+ documents required',
      'documents for company incorporation',
      'MCA registration documents 2025',
    ],
    canonical: '/tools/documents/private-limited-company',
  },
  intro: {
    title: 'How to Register a Private Limited Company in India (2025-26)',
    description: `A Private Limited Company is the most popular choice for startups in India. You get limited liability (your personal assets stay protected), a separate legal identity, and the credibility that makes it easier to raise funding and win larger clients.

Everything happens online through the MCA portal at mca.gov.in using the SPICe+ form. When you're done, you'll have a Certificate of Incorporation, CIN, PAN, and TAN - all from one application. The whole process takes 7-15 working days, depending on how clean your documents are and how busy the MCA is.`,
    whoNeeds: [
      'You\'re planning to raise venture capital, angel investment, or institutional funding',
      'You want to protect your personal assets from business liabilities',
      'You\'re building a team and want to offer ESOPs (Employee Stock Options)',
      'You need a formal structure to sign large contracts or bid for government tenders',
      'You\'re selling on e-commerce platforms that require company registration',
      'You have multiple co-founders and need clear equity ownership documentation',
    ],
    timeline: '7-15 working days',
    cost: 'Government fee: Rs. 1,500-15,000 (based on authorised capital) | Professional assistance: Rs. 4,999-9,999',
  },
  steps: [
    {
      title: 'Get Digital Signature Certificates (DSC) for all directors',
      description: 'Every proposed director needs a Class 3 DSC from a government-approved certifying authority. You\'ll use this to sign all MCA filings electronically. Takes 1-2 days to get.',
    },
    {
      title: 'Apply for Director Identification Numbers (DIN)',
      description: 'DIN is a unique ID for each director. Good news - for new companies, you can get DIN directly through the SPICe+ form without a separate application.',
    },
    {
      title: 'Reserve your company name',
      description: 'Use MCA\'s RUN service or SPICe+ Part A to check and reserve your name. It must end with "Private Limited" and can\'t be identical or too similar to existing companies or trademarks.',
    },
    {
      title: 'Draft the Memorandum and Articles of Association',
      description: 'The MOA defines what your company does; the AOA sets internal rules for how it runs. You can use MCA\'s standard templates (Table F) or have a professional draft custom documents for your business.',
    },
    {
      title: 'File SPICe+ Part B on the MCA portal',
      description: 'Fill in company details, director info, registered office address, capital details, and attach your MOA, AOA, address proof, and ID documents for all directors and shareholders.',
    },
    {
      title: 'Submit AGILE-PRO for linked registrations',
      description: 'Along with SPICe+, file AGILE-PRO to simultaneously get GSTIN, EPFO registration, ESIC registration, Professional Tax (where applicable), and even a bank account with select banks.',
    },
    {
      title: 'Receive your Certificate of Incorporation',
      description: 'After MCA approves everything, you get your Certificate of Incorporation with CIN, plus PAN and TAN from the Income Tax Department. Your company is now officially registered.',
    },
  ],
  faqs: [
    {
      question: 'What\'s the minimum number of directors and shareholders?',
      answer: 'You need at least 2 directors and 2 shareholders, with a maximum of 200 shareholders. The same person can be both a director and shareholder. At least one director must be an Indian resident - meaning they\'ve spent at least 182 days in India in the previous calendar year.',
    },
    {
      question: 'What\'s the minimum capital required?',
      answer: 'Technically, there\'s no minimum anymore - you can start a company with Rs. 1 as paid-up capital. Practically, most founders start with Rs. 1 lakh. Keep in mind that government stamp duty is based on your authorised capital, so don\'t set it higher than necessary.',
    },
    {
      question: 'Can foreigners be directors or shareholders?',
      answer: 'Yes, foreign nationals can be both directors and shareholders. The key requirement is that at least one director must be an Indian resident. Foreign directors need a DSC and must provide apostilled or notarised identity and address documents.',
    },
    {
      question: 'What annual compliance do I need to handle after incorporation?',
      answer: 'You\'ll need to file annual financial statements (Form AOC-4) and annual returns (Form MGT-7) with MCA, hold at least 4 board meetings per year, get a statutory audit done, and file income tax returns. If you\'re GST-registered, add those filings too. Non-compliance leads to significant penalties.',
    },
    {
      question: 'How do I convert my sole proprietorship or partnership to a Pvt Ltd?',
      answer: 'There\'s no direct conversion. You\'d register a fresh Pvt Ltd company and then transfer business assets, contracts, and liabilities to the new entity. The fresh registration takes 7-15 days. Work with a professional on the legal and tax aspects of the transfer.',
    },
  ],
  commonMistakes: [
    'Proposing a name too similar to an existing company or registered trademark - instant rejection',
    'Not checking RBI approval requirements before adding foreign nationals as directors or shareholders',
    'Setting authorised capital higher than needed - you pay stamp duty on this amount',
    'Drafting MOA business objects too narrowly, limiting what your company can do later',
    'Missing the registered office verification deadline (30 days from incorporation)',
    'Skipping the first board meeting, which must happen within 30 days of incorporation',
    'Not opening a business bank account and depositing share capital on time',
  ],
  nextSteps: [
    { title: 'Company GST Registration', href: '/services/gst-registration' },
    { title: 'MCA Annual Filing (ROC)', href: '/services/mca-annual-filing' },
    { title: 'Statutory Audit', href: '/services/statutory-audit' },
    { title: 'Trademark Registration', href: '/tools/documents/trademark' },
  ],
}

// ─────────────────────────────────────────────
// 3. LLP REGISTRATION
// ─────────────────────────────────────────────
export const llpContent: DocumentPageContent = {
  slug: 'llp',
  seo: {
    title: 'LLP Registration Documents Checklist India 2025-26 | Ollvy',
    description: 'Complete documents required for LLP registration in India. DSC, DPIN, LLP Agreement, address proof checklist for FiLLiP form filing.',
    keywords: [
      'LLP registration documents',
      'documents for LLP',
      'LLP incorporation checklist',
      'FiLLiP form documents',
      'limited liability partnership documents',
      'LLP registration requirements 2025',
    ],
    canonical: '/tools/documents/llp',
  },
  intro: {
    title: 'How to Register an LLP in India (2025-26)',
    description: `An LLP gives you the flexibility of a partnership with the liability protection of a company. As a partner, you're not personally on the hook for the firm's debts beyond your agreed contribution - making it a popular choice for professionals, consultants, and small service businesses.

Registration happens online through the MCA portal using the FiLLiP form. Compared to a Pvt Ltd company, LLPs have fewer compliance requirements and no mandatory audit (unless your turnover exceeds Rs. 40 lakhs or contribution exceeds Rs. 25 lakhs). Expect 10-15 working days from submission to getting your LLP incorporation certificate.`,
    whoNeeds: [
      'You\'re running a professional practice - CA firm, law firm, architect firm, consulting business',
      'You\'re a small or medium service business with 2+ partners wanting liability protection',
      'You want a partnership structure but without the unlimited personal liability risk',
      'You\'re building a startup that won\'t raise equity funding (LLPs can\'t issue shares or ESOPs)',
      'You\'re setting up a joint venture with Indian and foreign partners for a specific project',
      'You want lower annual compliance costs compared to running a Pvt Ltd company',
    ],
    timeline: '10-15 working days',
    cost: 'Government fee: Rs. 500-5,000 (based on contribution) | Professional assistance: Rs. 3,999-7,999',
  },
  steps: [
    {
      title: 'Get Digital Signature Certificates for designated partners',
      description: 'Each designated partner needs a Class 3 DSC. You need at least 2 designated partners, and at least one must be an Indian resident.',
    },
    {
      title: 'Apply for Designated Partner Identification Numbers (DPIN)',
      description: 'DPIN works like DIN for companies - it\'s a unique ID for each designated partner. You can apply for it directly within the FiLLiP form during incorporation.',
    },
    {
      title: 'Reserve your LLP name using RUN-LLP',
      description: 'Apply for name reservation on the MCA portal. Your name must end with "LLP" or "Limited Liability Partnership" and needs to be unique and not misleading.',
    },
    {
      title: 'File the FiLLiP form on MCA portal',
      description: 'Complete FiLLiP with partner details, designated partners, registered office address, business activities, and total capital contribution. Attach identity and address proofs for everyone.',
    },
    {
      title: 'Draft and file the LLP Agreement',
      description: 'This agreement defines partner rights, duties, profit-sharing ratios, and exit rules. File it with MCA in Form 3 within 30 days of incorporation. Stamp duty varies by state.',
    },
    {
      title: 'Receive your Certificate of Incorporation',
      description: 'MCA issues your LLP Incorporation Certificate with your LLPIN. Then apply for PAN and TAN separately from the Income Tax Department using this certificate.',
    },
    {
      title: 'Complete post-incorporation registrations',
      description: 'Open a business bank account, register for GST if needed, and register for Professional Tax if your state requires it. If you didn\'t file Form 3 at incorporation, do it now.',
    },
  ],
  faqs: [
    {
      question: 'What\'s the difference between an LLP and a regular partnership?',
      answer: 'The big difference is liability. In a traditional partnership, you\'re personally liable for the firm\'s debts and your other partners\' mistakes - creditors can go after your personal assets. In an LLP, your liability is limited to what you\'ve contributed. LLPs are also separate legal entities that can own property and sue or be sued in their own name.',
    },
    {
      question: 'Can an LLP raise funding from investors?',
      answer: 'LLPs can\'t issue equity shares or convertible instruments, so VC or angel funding isn\'t really an option. Partners can bring in capital as contributions, and you can take on debt. If you\'re planning to raise institutional equity funding, a Private Limited company is the better structure.',
    },
    {
      question: 'Do all LLPs need a statutory audit?',
      answer: 'No. You only need an audit if your annual turnover exceeds Rs. 40 lakhs or your total capital contribution exceeds Rs. 25 lakhs. Below those thresholds, the designated partners just certify the accounts themselves.',
    },
    {
      question: 'What annual compliance does an LLP need to handle?',
      answer: 'Every LLP must file an Annual Return (Form 11) by 30th May and a Statement of Accounts and Solvency (Form 8) by 30th October each year with MCA - even if you had zero business activity. Income tax returns are due by 31st July (non-audit) or 31st October (audit cases). GST returns apply if registered.',
    },
    {
      question: 'Can a company be a partner in an LLP?',
      answer: 'Yes. A body corporate - including a company, another LLP, or a foreign entity - can be a partner in an LLP. But the designated partners responsible for statutory compliance must be individuals.',
    },
  ],
  commonMistakes: [
    'Not filing Form 3 (LLP Agreement) within 30 days - attracts Rs. 100 per day penalty',
    'Drafting a vague LLP Agreement without clear profit-sharing ratios, exit clauses, or dispute resolution',
    'Choosing LLP when you\'re planning to raise equity funding - you need a Pvt Ltd for that',
    'Selecting the wrong state for your registered office, causing address-related compliance issues',
    'Missing annual Form 8 and Form 11 filings - heavy penalties apply even for dormant LLPs',
    'Forgetting to update the LLP Agreement via Form 3 when partners change or profit-sharing ratios shift',
  ],
  nextSteps: [
    { title: 'GST Registration for LLP', href: '/services/gst-registration' },
    { title: 'LLP Annual Filing (Form 8 & 11)', href: '/services/llp-annual-filing' },
    { title: 'Income Tax Return for LLP', href: '/tools/documents/business-itr' },
    { title: 'Trademark Registration', href: '/tools/documents/trademark' },
  ],
}

// ─────────────────────────────────────────────
// 4. PARTNERSHIP FIRM REGISTRATION
// ─────────────────────────────────────────────
export const partnershipContent: DocumentPageContent = {
  slug: 'partnership',
  seo: {
    title: 'Partnership Firm Registration Documents India 2025-26 | Ollvy',
    description: 'Documents required for partnership firm registration. Partnership deed, PAN, Aadhaar, address proof checklist for Registrar of Firms.',
    keywords: [
      'partnership firm documents',
      'partnership registration documents',
      'partnership deed requirements',
      'documents for partnership firm',
      'partnership firm registration checklist',
      'partnership documents India 2025',
    ],
    canonical: '/tools/documents/partnership',
  },
  intro: {
    title: 'How to Register a Partnership Firm in India (2025-26)',
    description: `A partnership firm is one of the simplest business structures in India. Two or more people come together, run a business, and share the profits and losses. Here's the thing though - registration isn't technically mandatory under the Indian Partnership Act, 1932. But an unregistered partnership can't file a lawsuit to enforce its rights, which makes registration essential for any serious business.

You register with the Registrar of Firms in your state. Requirements and fees vary by state, but you'll generally need a Partnership Deed plus identity and address proofs for all partners. Important to understand: partners in a traditional partnership have unlimited personal liability for the firm's debts.`,
    whoNeeds: [
      'You\'re starting a small business with 2-20 partners and want a simple, low-cost structure',
      'You\'re running a family business where members want to pool resources and share profits',
      'You\'re in a professional practice and don\'t need the LLP structure yet',
      'You\'re a local trader, retailer, or service business with modest compliance needs',
      'You want a formal structure without the compliance burden of a company or LLP',
    ],
    timeline: '5-10 working days (varies by state)',
    cost: 'Government fee: Rs. 500-3,000 (varies by state) | Professional assistance: Rs. 1,999-4,999',
  },
  steps: [
    {
      title: 'Draft the Partnership Deed',
      description: 'This is your primary legal document. Cover the firm name, business address, nature of business, names and addresses of all partners, how much each partner contributes, profit-sharing ratios, and how you\'ll handle dissolution.',
    },
    {
      title: 'Get the Partnership Deed stamped',
      description: 'Print the deed on non-judicial stamp paper of the value your state requires. All partners need to sign the deed in front of a witness.',
    },
    {
      title: 'Gather supporting documents',
      description: 'Collect PAN cards, Aadhaar cards, and address proofs for all partners. Get proof of the firm\'s principal place of business (rent agreement or ownership documents work).',
    },
    {
      title: 'Submit the application to Registrar of Firms',
      description: 'File Form I (Application for Registration of Firms) with the stamped Partnership Deed, firm address proof, and identity documents for all partners. Submit to the Registrar of Firms in your state.',
    },
    {
      title: 'Pay the registration fee',
      description: 'Pay the state government registration fee. This varies by state and typically ranges from Rs. 500 to Rs. 3,000.',
    },
    {
      title: 'Receive your Certificate of Registration',
      description: 'After verification, the Registrar enters your firm details in the Register of Firms and issues a Certificate of Registration. Your firm is now officially registered.',
    },
    {
      title: 'Apply for PAN and complete other registrations',
      description: 'Apply for the firm\'s PAN from the Income Tax Department. Register for GST if your turnover exceeds the threshold. Open a current bank account in the firm\'s name.',
    },
  ],
  faqs: [
    {
      question: 'Is partnership firm registration mandatory in India?',
      answer: 'Legally, no. But practically, yes - at least if you want to run a real business. An unregistered firm can\'t file a lawsuit against third parties or partners to enforce contracts. It also can\'t claim set-off in legal proceedings. For any partnership operating seriously, registration is strongly recommended.',
    },
    {
      question: 'What\'s the maximum number of partners allowed?',
      answer: 'You can have up to 50 partners in a partnership firm. For banking businesses, the maximum is 10. In practice, most partnerships have far fewer partners to keep management simple.',
    },
    {
      question: 'What\'s the difference between a partnership firm and an LLP?',
      answer: 'Liability. In a partnership firm, every partner is personally liable for the firm\'s debts - creditors can go after your personal assets. In an LLP, your liability is limited to what you\'ve contributed. LLPs are separate legal entities with more structured compliance requirements, but they offer much better legal protection.',
    },
    {
      question: 'Can a minor be a partner?',
      answer: 'A minor can\'t be a full partner, but they can be admitted to the benefits of a partnership with consent from all existing partners. This means they can receive profit shares but aren\'t liable for the firm\'s losses or obligations. Once they turn 18, they have 6 months to decide whether to become a full partner.',
    },
    {
      question: 'Can a partnership firm be converted to an LLP or company later?',
      answer: 'Yes. You can convert to an LLP under Schedule II of the LLP Act, 2008, or to a Private Limited Company under Section 366 of the Companies Act, 2013. Both conversions happen online through the MCA portal and typically take 15-30 days.',
    },
  ],
  commonMistakes: [
    'Using a vague Partnership Deed that doesn\'t clearly cover profit-sharing ratios or dispute resolution',
    'Not getting the deed stamped properly - makes it inadmissible as evidence in court',
    'Forgetting to include a clause on how to admit new partners or handle partner exits',
    'Running a business bank account under a partner\'s personal name instead of the firm\'s name',
    'Waiting until a dispute arises to register - you can\'t register just to file a lawsuit',
    'Ignoring GST registration requirements because the firm structure is informal',
    'Not updating the Registrar when partners change, address moves, or business activities shift',
  ],
  nextSteps: [
    { title: 'GST Registration for Partnership', href: '/services/gst-registration' },
    { title: 'ITR Filing for Partnership Firm', href: '/tools/documents/business-itr' },
    { title: 'Convert to LLP', href: '/tools/documents/llp' },
    { title: 'Trademark Registration', href: '/tools/documents/trademark' },
  ],
}

// ─────────────────────────────────────────────
// 5. SOLE PROPRIETORSHIP REGISTRATION
// ─────────────────────────────────────────────
export const soleProprietorContent: DocumentPageContent = {
  slug: 'sole-proprietor',
  seo: {
    title: 'Sole Proprietorship Registration Documents 2025-26 | Ollvy',
    description: 'Documents required for sole proprietorship registration in India. GST, Udyam, Shop Act documents checklist for proprietors.',
    keywords: [
      'sole proprietorship documents',
      'proprietorship registration documents',
      'documents for sole proprietor',
      'proprietorship firm documents',
      'sole proprietor registration India',
      'Udyam registration documents 2025',
    ],
    canonical: '/tools/documents/sole-proprietor',
  },
  intro: {
    title: 'How to Register a Sole Proprietorship in India (2025-26)',
    description: `A sole proprietorship is the simplest way to run a business in India - it's just you, operating under your own name or a trade name. There's no separate "sole proprietorship registration" to apply for. Instead, your business gets its legal identity through other registrations like GST, Shop and Establishment Act, or Udyam (MSME). You and the business are legally the same entity, and all profits are taxed as your personal income.

The upside: minimal compliance, easy to start. The downside: you bear unlimited personal liability for all business debts. Registrations like GST or Udyam give your business a formal identity for banking, contracts, and government schemes. Most banks require at least two of these registrations to open a current account for you.`,
    whoNeeds: [
      'You\'re a freelancer, consultant, or self-employed professional',
      'You\'re a small retailer, trader, or local service provider',
      'You\'re an artisan, craftsperson, or running a home-based business',
      'You\'re starting a business with minimal capital and want the least compliance',
      'You\'re testing a business idea before committing to a formal structure',
    ],
    timeline: '1-7 working days (varies by registration type)',
    cost: 'Government fee: Free to Rs. 5,000 depending on registrations | Professional assistance: Rs. 999-2,499',
  },
  steps: [
    {
      title: 'Choose a business name',
      description: 'Pick a name that isn\'t identical to a registered trademark or another business. There\'s no formal name reservation for sole proprietorships, but check for conflicts before you start using it.',
    },
    {
      title: 'Register under the Shop and Establishment Act',
      description: 'If you have a physical place of business, register with your local municipal authority under the Shop Act. This is state-specific, usually costs Rs. 500-5,000, and gives your business a recognised local identity.',
    },
    {
      title: 'Register for GST (if applicable)',
      description: 'If your annual turnover exceeds Rs. 40 lakhs (goods) or Rs. 20 lakhs (services), register for GST using your personal PAN on gst.gov.in. GST registration is the most widely recognised proof of your business identity.',
    },
    {
      title: 'Register on the Udyam Portal (MSME)',
      description: 'Register as a Micro, Small, or Medium Enterprise on udyamregistration.gov.in using your Aadhaar and PAN. It\'s completely free, gives you access to government schemes, and most banks accept it as business proof.',
    },
    {
      title: 'About PAN for your business',
      description: 'You use your individual PAN for all business transactions - no separate PAN needed. File all business income as part of your personal income tax return using ITR-3 or ITR-4.',
    },
    {
      title: 'Open a current bank account',
      description: 'Approach your bank with your GST certificate or Udyam registration, personal PAN and Aadhaar, address proof, and passport-size photos. Most banks want at least 2 business registrations as identity proof.',
    },
    {
      title: 'Get any sector-specific licences',
      description: 'Depending on what you do, you might need an FSSAI licence (food business), RERA registration (real estate), Import Export Code (international trade), or other industry-specific approvals.',
    },
  ],
  faqs: [
    {
      question: 'Is there an official registration certificate for a sole proprietorship?',
      answer: 'No, there\'s no single "Sole Proprietorship Registration Certificate" in India. Your business is recognised through other registrations - primarily GST Registration, Udyam (MSME) Registration, and Shop and Establishment licence. Banks and institutions accept these as proof that your business exists.',
    },
    {
      question: 'What\'s the difference between a sole proprietorship and a one-person company (OPC)?',
      answer: 'A sole proprietorship has no legal separation from you - all liability is personal. A One Person Company (OPC) under the Companies Act is a separate legal entity with limited liability, has MCA compliance requirements, and can have a nominee director. OPC gives you more protection but comes with more compliance overhead.',
    },
    {
      question: 'Do I need GST registration if I\'m below the turnover threshold?',
      answer: 'No, it\'s not mandatory. But many sole proprietors register voluntarily anyway - it improves business credibility, makes opening a current account easier, and lets you serve GST-registered clients who need input tax credit. Voluntary registration is open to anyone.',
    },
    {
      question: 'How do I calculate income tax for my sole proprietorship?',
      answer: 'Your sole proprietorship isn\'t taxed separately - all business profits get added to your personal income and taxed at your individual slab rates. File ITR-3 if you\'re maintaining full books of accounts, or ITR-4 if you\'re using the Presumptive Taxation Scheme under Section 44AD or 44ADA.',
    },
    {
      question: 'Can I convert my sole proprietorship to a Private Limited Company later?',
      answer: 'Yes, but there\'s no direct conversion process. You\'d incorporate a new Pvt Ltd company and transfer the business assets, contracts, and liabilities to the new entity. This is typically done through a slump sale or itemised transfer. Get professional advice on the tax implications.',
    },
  ],
  commonMistakes: [
    'Using a business name that conflicts with an existing registered trademark',
    'Not getting any formal registration, making it impossible to open a business bank account',
    'Missing GST registration when your turnover crosses the mandatory threshold',
    'Mixing personal and business finances in the same savings account',
    'Not filing income tax returns on business income thinking the business is "unregistered"',
    'Skipping Udyam registration and missing out on MSME government scheme benefits',
  ],
  nextSteps: [
    { title: 'GST Registration', href: '/tools/documents/gst-registration' },
    { title: 'ITR Filing (Individual / Proprietor)', href: '/tools/documents/individual-itr' },
    { title: 'Udyam MSME Registration', href: '/services/msme-udyam' },
    { title: 'Shop and Establishment Licence', href: '/services/shop-establishment' },
  ],
}

// ─────────────────────────────────────────────
// 6. INDIVIDUAL / SALARIED ITR FILING
// ─────────────────────────────────────────────
export const individualItrContent: DocumentPageContent = {
  slug: 'individual-itr',
  seo: {
    title: 'ITR Filing Documents for Salaried Individuals 2025-26 | Ollvy',
    description: 'Documents required to file ITR for salaried employees. Form 16, Form 26AS, AIS, 80C proofs checklist for AY 2026-27.',
    keywords: [
      'ITR documents for salaried',
      'income tax return documents',
      'ITR filing documents list',
      'Form 16 ITR filing',
      'documents for ITR-1',
      'ITR documents checklist 2025-26',
    ],
    canonical: '/tools/documents/individual-itr',
  },
  intro: {
    title: 'How to File Income Tax Return (ITR) for Individuals in India (2025-26)',
    description: `If your annual income exceeds the basic exemption limit, you need to file an Income Tax Return. For FY 2025-26 (AY 2026-27), salaried individuals must file by 31st July 2026. Under the new tax regime (now the default), the basic exemption is Rs. 3 lakhs - but with the Section 87A rebate, income up to Rs. 7 lakhs is effectively tax-free.

The Income Tax Department has made filing pretty straightforward through their e-Filing portal at incometax.gov.in. If you're salaried, most of your data is already pre-filled from Form 26AS, the Annual Information Statement (AIS), and your employer's Form 16. Filing on time means you can carry forward losses, get faster refunds, and avoid the Section 234F late filing fee.`,
    whoNeeds: [
      'Your gross income exceeds Rs. 3 lakhs (new regime) or Rs. 2.5 lakhs (old regime)',
      'You have income from house property, capital gains, or other sources',
      'You have more than one Form 16 (multiple employers during the year)',
      'You\'ve paid taxes abroad and want to claim foreign tax credit',
      'You want a refund for excess TDS that your employer or bank deducted',
      'You have high-value transactions flagged in your Annual Information Statement (AIS)',
      'You need ITR as proof for loans, visas, or tender applications',
    ],
    timeline: '1-3 days (if all documents are ready)',
    cost: 'Government fee: Free (self-filing on incometax.gov.in) | Professional assistance: Rs. 499-1,999',
  },
  steps: [
    {
      title: 'Gather your documents',
      description: 'Get your Form 16 from your employer, download Form 26AS and AIS from the Income Tax portal, pull your bank statements and interest certificates, and gather details of any investments you made for deductions under Chapter VI-A.',
    },
    {
      title: 'Pick the right ITR form',
      description: 'If your income is only from salary and one house property, use ITR-1 (Sahaj). Got capital gains, foreign income, or more than one house property? You need ITR-2. Business income means ITR-3 or ITR-4.',
    },
    {
      title: 'Decide between new and old tax regime',
      description: 'Compare your tax liability under both regimes. The new regime has lower slab rates but almost no deductions (except Rs. 75,000 standard deduction for salaried). The old regime lets you claim 80C (Rs. 1.5 lakh), 80D, HRA, and other deductions. Pick whichever results in lower tax.',
    },
    {
      title: 'Log in to the e-Filing portal',
      description: 'Visit incometax.gov.in and log in with your PAN. Go to "File Income Tax Return" and select AY 2026-27 for income earned in FY 2025-26.',
    },
    {
      title: 'Check pre-filled data and add missing income',
      description: 'Review the pre-filled salary, TDS, and other income data. Fix any errors. Add income from interest, rental, capital gains, or other sources that might not be pre-filled.',
    },
    {
      title: 'Enter deductions and compute tax',
      description: 'Under the old regime, enter all your eligible deductions (80C, 80D, HRA, LTA, etc.). The portal calculates your final tax liability or refund automatically after accounting for TDS already paid.',
    },
    {
      title: 'Verify and submit',
      description: 'Review the return summary. If you owe tax, pay it via Challan 280 before submitting. Submit and e-verify immediately using Aadhaar OTP, net banking, or DSC. E-verification is mandatory - without it, your return won\'t be processed.',
    },
  ],
  faqs: [
    {
      question: 'What\'s the last date to file ITR for FY 2025-26 (AY 2026-27)?',
      answer: 'For salaried individuals and those not subject to audit, it\'s 31st July 2026. Miss this? You can still file a belated return until 31st December 2026, but you\'ll pay a late fee of Rs. 5,000 (Rs. 1,000 if income is under Rs. 5 lakhs). After 31st December, you can only file through a condonation request.',
    },
    {
      question: 'Do I need to file ITR if my employer already deducted TDS?',
      answer: 'Yes, if your gross income exceeds the exemption limit - even if TDS covered everything and you owe nothing more. Filing a return is also the only way to get a refund if your employer or bank deducted more TDS than necessary.',
    },
    {
      question: 'Which is better - new tax regime or old tax regime?',
      answer: 'It depends on how much you\'re investing. If you have significant deductions under 80C, 80D, HRA, etc., the old regime often works out better. If you don\'t have many investments or deductions, the new regime\'s lower slab rates usually win. Run the numbers on a tax calculator before choosing.',
    },
    {
      question: 'What if I file ITR after 31st July but before 31st December?',
      answer: 'You can file a belated return, but you\'ll pay Rs. 5,000 in late fees (Rs. 1,000 if income is below Rs. 5 lakhs). More importantly, if you have losses you wanted to carry forward, you lose that option when you miss the original deadline.',
    },
    {
      question: 'What is Form 26AS and why should I check it before filing?',
      answer: 'Form 26AS shows all taxes deducted from your income by employers, banks, and others (TDS), taxes you paid directly (advance tax), and any refunds issued. Before filing, reconcile your income and TDS figures with Form 26AS - mismatches trigger notices from the Income Tax Department.',
    },
  ],
  commonMistakes: [
    'Using ITR-1 when you have capital gains income (you need ITR-2 for that)',
    'Not reconciling income and TDS with Form 26AS and AIS before submitting',
    'Forgetting to report interest income from savings accounts, FDs, and post office savings',
    'Not e-verifying within 30 days - this makes your return invalid',
    'Missing the deadline and losing the ability to carry forward capital losses',
    'Claiming deductions under the new tax regime that don\'t apply anymore',
    'Not reporting freelance income because it came in cash or without TDS',
  ],
  nextSteps: [
    { title: 'Business ITR Filing', href: '/services/business-itr' },
    { title: 'ITR Documents for Business', href: '/tools/documents/business-itr' },
    { title: 'GST Registration (for Freelancers)', href: '/tools/documents/gst-registration' },
  ],
}

// ─────────────────────────────────────────────
// 7. BUSINESS ITR FILING
// ─────────────────────────────────────────────
export const businessItrContent: DocumentPageContent = {
  slug: 'business-itr',
  seo: {
    title: 'Business ITR Filing Documents Checklist 2025-26 | Ollvy',
    description: 'Documents required for business income tax return filing. P&L, balance sheet, Form 26AS, audit report checklist for ITR-3/ITR-4.',
    keywords: [
      'business ITR documents',
      'ITR-3 documents required',
      'ITR-4 documents list',
      'business tax return documents',
      'documents for business ITR filing',
      'tax audit documents 2025-26',
    ],
    canonical: '/tools/documents/business-itr',
  },
  intro: {
    title: 'How to File Income Tax Return for a Business in India (2025-26)',
    description: `Which ITR form you use depends on your business structure. Sole proprietors and partnership partners file business income as part of their personal ITR using ITR-3 or ITR-4. Firms and LLPs file ITR-5. Private Limited and other companies file ITR-6. Getting the right form and understanding if you need a tax audit under Section 44AB is critical - get it wrong and you face penalties.

For FY 2025-26, a tax audit by a Chartered Accountant is mandatory if your business turnover exceeds Rs. 1 crore (or Rs. 10 crore if 95% of transactions are digital). For professionals, the audit threshold is Rs. 50 lakhs of gross receipts. Audited returns are due 31st October 2026; non-audit returns are due 31st July 2026. Presumptive taxation under Section 44AD (businesses) and 44ADA (professionals) can significantly simplify things if you qualify.`,
    whoNeeds: [
      'You\'re a sole proprietor or freelancer with business or professional income',
      'You\'re a partner in a partnership firm or LLP reporting your share of firm profits',
      'You\'re a company director receiving salary plus dividends from your company',
      'Your business turnover exceeds Rs. 1 crore and you need a tax audit',
      'You\'re a professional (doctor, lawyer, CA, architect) with gross receipts above Rs. 50 lakhs',
      'Your business has international transactions requiring a transfer pricing report',
    ],
    timeline: '3-15 working days (depending on audit requirement)',
    cost: 'Government fee: Free (portal) | Professional (CA) fee: Rs. 2,999-24,999 depending on audit and complexity',
  },
  steps: [
    {
      title: 'Determine your correct ITR form',
      description: 'Use ITR-3 for proprietors, partners, or directors with business income and no presumptive taxation. ITR-4 (Sugam) works if you\'re using presumptive taxation under 44AD, 44ADA, or 44AE. LLPs and firms use ITR-5. Companies use ITR-6.',
    },
    {
      title: 'Check if you need a tax audit',
      description: 'If your business turnover exceeds Rs. 1 crore (Rs. 10 crore for digital transactions) or professional receipts exceed Rs. 50 lakhs, a Chartered Accountant must audit your accounts under Section 44AB before you file.',
    },
    {
      title: 'Finalise your books of accounts',
      description: 'Prepare your profit and loss statement and balance sheet for FY 2025-26. Make sure all income and expenses are properly recorded. If you\'re using accounting software, export the required reports.',
    },
    {
      title: 'Compute taxable income and deductions',
      description: 'Calculate net profit after all allowable business expenses. Claim deductions under Section 80C, 80D, and other applicable sections. Account for losses from prior years that you can set off against current income.',
    },
    {
      title: 'Get the tax audit done (if required)',
      description: 'Engage a CA to conduct the audit and upload the Tax Audit Report (Form 3CA/3CB and 3CD) on the Income Tax portal before you file your return. The CA signs and uploads using their credentials.',
    },
    {
      title: 'Pay advance tax and self-assessment tax',
      description: 'If your total tax liability after TDS is Rs. 10,000 or more, advance tax must be paid in quarterly instalments during the year. Pay any remaining self-assessment tax via Challan 280 on the Income Tax portal before filing.',
    },
    {
      title: 'File and e-verify your return',
      description: 'Log in to incometax.gov.in, select your ITR form, fill in the required schedules, and submit. E-verify immediately using Aadhaar OTP, net banking, or DSC to complete the process.',
    },
  ],
  faqs: [
    {
      question: 'What is the Presumptive Taxation Scheme under Section 44AD?',
      answer: 'Section 44AD lets small businesses with turnover up to Rs. 3 crore declare 8% of turnover (6% for digital receipts) as net profit without maintaining detailed books. This simplifies compliance significantly. But once you opt out of 44AD, you can\'t come back for 5 years.',
    },
    {
      question: 'What are the due dates for business ITR filing in FY 2025-26?',
      answer: 'For businesses not requiring audit: 31st July 2026. For businesses requiring tax audit under Section 44AB: 31st October 2026. For businesses with international transactions requiring transfer pricing report under Section 92E: 30th November 2026.',
    },
    {
      question: 'What\'s the penalty for not getting accounts audited when required?',
      answer: 'You\'ll face a penalty of 0.5% of total sales or gross receipts, up to Rs. 1.5 lakhs, under Section 271B. Plus, filing after the due date without a valid reason attracts the Rs. 5,000 late filing fee under Section 234F.',
    },
    {
      question: 'Can a sole proprietor use the Presumptive Taxation Scheme under Section 44ADA?',
      answer: 'Yes, if you\'re a specified professional - doctor, lawyer, CA, architect, engineer, film artist, or management consultant. If gross receipts are below Rs. 75 lakhs (with 95% digital receipts), you can declare 50% of receipts as net income without maintaining detailed books.',
    },
    {
      question: 'How is income tax calculated for a Private Limited Company?',
      answer: 'Companies pay corporate income tax at 22% (plus surcharge and cess, totaling 25.17% effective rate) under Section 115BAA if they forgo certain deductions. New manufacturing companies can opt for 15% (17.01% effective) under Section 115BAB. Companies not using these concessional regimes pay 30% on net profits.',
    },
  ],
  commonMistakes: [
    'Filing ITR-4 under presumptive taxation when turnover has crossed the Rs. 3 crore limit',
    'Not paying advance tax instalments on time, triggering interest under Sections 234B and 234C',
    'Missing the 31st October tax audit deadline by not engaging a CA early enough',
    'Not claiming depreciation on business assets, resulting in unnecessarily high taxable income',
    'Failing to report all bank accounts in the ITR - this triggers mismatch notices',
    'Not setting off business losses against other income or carrying them forward properly',
    'Treating capital expenditure as revenue expenditure (or vice versa) incorrectly',
  ],
  nextSteps: [
    { title: 'GST Monthly Filing', href: '/services/gst-monthly-filing' },
    { title: 'MCA Annual Filing (for Companies)', href: '/services/mca-annual-filing' },
    { title: 'TDS Monthly Compliance', href: '/services/tds-monthly-compliance' },
  ],
}

// ─────────────────────────────────────────────
// 8. TRADEMARK REGISTRATION
// ─────────────────────────────────────────────
export const trademarkContent: DocumentPageContent = {
  slug: 'trademark',
  seo: {
    title: 'Trademark Registration Documents India 2025-26 | Ollvy',
    description: 'Documents required for trademark registration in India. Logo, Form TM-A, identity proof, business registration checklist for IP India.',
    keywords: [
      'trademark registration documents',
      'documents for trademark',
      'trademark application documents',
      'TM-A form documents',
      'brand registration documents India',
      'trademark filing checklist 2025',
    ],
    canonical: '/tools/documents/trademark',
  },
  intro: {
    title: 'How to Register a Trademark in India (2025-26)',
    description: `A trademark - whether it's your brand name, logo, or tagline - is what makes your business recognisable. Registering it gives you exclusive legal rights to use it in India, the ability to take action against copycats, and the option to license or sell it. Trademark registration in India is handled by the Controller General of Patents, Designs and Trade Marks through the IP India portal at ipindia.gov.in.

Your registration protects you for 10 years from the date of application, and you can renew indefinitely in 10-year blocks. Once you file, you can immediately use the TM symbol. The registered trademark symbol (R) can only be used after your mark is officially registered - which currently takes 18-36 months due to examination and opposition periods. File early: in India, trademark rights go to whoever files first, not whoever used it first.`,
    whoNeeds: [
      'You\'re building a brand and want to protect your name or logo from being copied',
      'You sell on e-commerce and your brand could be misused by counterfeit sellers',
      'You\'re planning to license your brand to franchisees or partners',
      'You\'re expanding internationally and need an Indian trademark as the basis for foreign filings',
      'You\'ve created an original brand identity, slogan, or product name worth protecting',
      'You have - or expect to have - significant brand equity worth protecting',
    ],
    timeline: '18-36 months for full registration | TM symbol can be used from day of filing',
    cost: 'Government fee: Rs. 4,500 per class (individuals/startups/MSMEs) or Rs. 9,000 per class (companies) | Professional: Rs. 1,999-4,999 additional',
  },
  steps: [
    {
      title: 'Search for existing trademarks',
      description: 'Search the IP India database at ipindia.gov.in to check if a similar or identical mark already exists in your class. Also check for similar-sounding marks and phonetic equivalents to reduce objection risk.',
    },
    {
      title: 'Identify the correct trademark class',
      description: 'The Nice Classification system has 45 classes - classes 1-34 for goods and 35-45 for services. File in every class that covers your current and planned products or services. Filing in the wrong class gives you no protection for your core business.',
    },
    {
      title: 'Prepare your application',
      description: 'Draft Form TM-A with your trademark (word or device form), the class and description of goods/services, applicant details, and date of first use (if already in use). If filing a logo, attach a clear image.',
    },
    {
      title: 'File on the IP India portal',
      description: 'Submit Form TM-A online at ipindia.gov.in and pay the government fee. Once submitted, you receive an application number and can immediately start using the TM symbol.',
    },
    {
      title: 'Respond to examination report (if needed)',
      description: 'The examiner reviews your application within 12-18 months and may raise objections on absolute or relative grounds. If you get an objection, you have 30 days to file a reply with arguments and evidence.',
    },
    {
      title: 'Wait out the opposition period',
      description: 'After examination clearance, your mark is published in the Trademark Journal for 4 months. During this period, anyone can oppose your registration. If no opposition is filed, you move to registration.',
    },
    {
      title: 'Receive your registration certificate',
      description: 'After examination and the opposition period, you get your Registration Certificate. Now you can use the (R) symbol. Your registration is valid for 10 years from the filing date - remember to renew before expiry.',
    },
  ],
  faqs: [
    {
      question: 'Can I use the (R) symbol before my trademark is officially registered?',
      answer: 'No - using (R) before registration is illegal under the Trade Marks Act, 1999. You can use the TM symbol (or SM for service marks) immediately after filing, which indicates that you\'re claiming rights to the mark and have an application pending.',
    },
    {
      question: 'What\'s the difference between a trademark, copyright, and patent?',
      answer: 'Trademarks protect brand identifiers like names, logos, and slogans used in commerce. Copyright protects creative works like books, music, software, and art - it exists automatically when you create something without needing registration. Patents protect inventions and novel technical solutions for 20 years and require registration. All three are different forms of intellectual property and can coexist.',
    },
    {
      question: 'What happens if my trademark application gets an objection?',
      answer: 'You have 30 days to file a written reply on the IP India portal. If your reply doesn\'t resolve the objection, you may need to attend a hearing before the examiner. Common objections: your mark is too similar to an existing one (relative grounds) or your mark is descriptive or lacks distinctiveness (absolute grounds).',
    },
    {
      question: 'Can I file a trademark in multiple classes?',
      answer: 'Yes, and you should file in all relevant classes to fully protect your brand. Each class requires a separate government fee - Rs. 4,500 per class for individuals, startups, and MSMEs, and Rs. 9,000 per class for companies and larger entities.',
    },
    {
      question: 'Is my Indian trademark valid in other countries?',
      answer: 'No, an Indian trademark only protects you in India. For international protection, you can file separately in each country or use the Madrid Protocol through WIPO, which lets you file one international application covering multiple member countries. India is a Madrid Protocol member.',
    },
  ],
  commonMistakes: [
    'Not doing a thorough trademark search before filing - leads to objections on similar existing marks',
    'Filing in the wrong class or too narrow a description, leaving core products/services unprotected',
    'Using the (R) symbol before the mark is officially registered - this is illegal',
    'Not responding to examination reports within 30 days - your application gets abandoned',
    'Not monitoring the Trademark Journal during opposition period - missing third-party oppositions',
    'Forgetting to renew before the 10-year expiry - your mark lapses',
    'Filing only the word mark or only the logo when you should file both for complete protection',
  ],
  nextSteps: [
    { title: 'Private Limited Company Registration', href: '/tools/documents/private-limited-company' },
    { title: 'GST Registration', href: '/tools/documents/gst-registration' },
    { title: 'MSME/Udyam Registration', href: '/services/msme-udyam' },
  ],
}

// Alias for backward compatibility with existing page imports
export const privateLimitedContent = privateLimitedCompanyContent

// ─────────────────────────────────────────────
// EXPORT MAP
// ─────────────────────────────────────────────
export const documentContentMap: Record<string, DocumentPageContent> = {
  'gst-registration': gstRegistrationContent,
  'private-limited-company': privateLimitedCompanyContent,
  'llp': llpContent,
  'partnership': partnershipContent,
  'sole-proprietor': soleProprietorContent,
  'individual-itr': individualItrContent,
  'business-itr': businessItrContent,
  'trademark': trademarkContent,
}

// Helper function to get content by slug
export function getDocumentContent(slug: string): DocumentPageContent | null {
  return documentContentMap[slug] || null
}

// Generate FAQ structured data for Google rich snippets
export function generateFAQSchema(content: DocumentPageContent) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

// Generate HowTo structured data for Google rich snippets
export function generateHowToSchema(content: DocumentPageContent) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: content.intro.title,
    description: content.intro.description.slice(0, 300),
    step: content.steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.title,
      text: step.description,
    })),
  }
}

// Generate BreadcrumbList structured data
export function generateBreadcrumbSchema(content: DocumentPageContent, label: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ollvy', item: 'https://www.ollvy.com' },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://www.ollvy.com/tools' },
      { '@type': 'ListItem', position: 3, name: 'Document Checklists', item: 'https://www.ollvy.com/tools/documents' },
      { '@type': 'ListItem', position: 4, name: label, item: `https://www.ollvy.com${content.seo.canonical}` },
    ],
  }
}

// Generate Next.js Metadata object from content
export function generatePageMetadata(content: DocumentPageContent) {
  const baseUrl = 'https://www.ollvy.com'
  const fullUrl = `${baseUrl}${content.seo.canonical}`

  return {
    title: content.seo.title,
    description: content.seo.description,
    keywords: content.seo.keywords,
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title: content.seo.title,
      description: content.seo.description,
      url: fullUrl,
      siteName: 'Ollvy',
      type: 'article',
      images: [{ url: `${baseUrl}/og-image.png`, width: 1200, height: 630, alt: content.intro.title }],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: content.seo.title,
      description: content.seo.description,
      images: [`${baseUrl}/og-image.png`],
    },
  }
}
