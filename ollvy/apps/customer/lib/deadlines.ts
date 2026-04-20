export interface Testimonial {
  quote: string
  name: string
  role: string
  business: string
  city: string
}

export interface DeadlineConfig {
  slug: string
  serviceSlug: string // Maps to the service page for booking
  serviceName: string
  eventLabel: string
  dueDate: string
  postDeadlineMessage: string
  heroTagline: string
  purposeLabel: string
  eligibilityLabel: string
  urgencyLine: string
  penaltyLine: string
  filingCount?: number
  ollvyFee: number
  govtFee?: number
  slaDays: number
  seoTitle: string
  seoDescription: string
  canonicalUrl: string
  documentTab: string // Which tab to pre-select in DocumentChecklist
  documentHeading: string // Section heading for documents
  risks: { title: string; body: string }[]
  testimonials: Testimonial[]
  faqs?: { q: string; a: string }[]
  lastReviewed: string
  sources: { name: string; url: string; description: string }[]
}

export const DEADLINES: DeadlineConfig[] = [
  {
    slug: 'itr-2026',
    serviceSlug: 'business-itr',
    serviceName: 'Business ITR Filing',
    eventLabel: 'Financial Year 2025-26',
    dueDate: '2026-10-31',
    postDeadlineMessage:
      'The Oct 31 deadline has passed. File now to reduce penalty accrual - late filing interest is 1% per month.',
    heroTagline: 'Financial Year 2025-26',
    purposeLabel: 'TAX FILING',
    eligibilityLabel: 'All Pvt Ltd, LLP, and Partnership firms',
    urgencyLine: 'File by Oct 31 to avoid late filing interest',
    penaltyLine: 'Past due: 1% per month interest on tax payable',
    ollvyFee: 4999,
    govtFee: 0,
    slaDays: 10,
    seoTitle: 'Business ITR Filing 2026 - File Before Oct 31 | Ollvy',
    seoDescription:
      'File your company ITR (ITR-6 for Pvt Ltd, ITR-5 for LLP) before Oct 31, 2026. Fixed price Rs 4,999. Ollvy CA assigned within 24 hours.',
    canonicalUrl: 'https://www.ollvy.com/itr-2026',
    documentTab: 'business_itr',
    documentHeading: "Documents you'll need to file ITR-6 / ITR-5",
    risks: [
      {
        title: 'Belated filing interest at 1% per month',
        body: "Section 234A: if you file after Oct 31 and have tax due, 1% monthly interest accrues on the outstanding amount from Nov 1. On ₹5L tax liability, that's ₹5,000 per month.",
      },
      {
        title: "Losses can't be carried forward",
        body: "If your company made a loss this year and you file late, you lose the right to carry it forward and offset against future profits. This is irreversible.",
      },
      {
        title: 'Late filing fee under Section 234F',
        body: 'Rs 5,000 penalty if filed after Oct 31 but before Dec 31. Rs 10,000 if filed after Dec 31. Reduced to Rs 1,000 if total income is below Rs 5 lakh.',
      },
    ],
    testimonials: [
      {
        quote:
          "Our previous CA kept asking for the same documents three times. With Ollvy, I uploaded everything once to the dashboard. The CA reviewed it, asked one clarifying question about depreciation, and filed the ITR-6 within a week. We got the acknowledgement the same day.",
        name: 'Vikram S.',
        role: 'Director',
        business: 'Pvt Ltd, IT Services',
        city: 'Pune',
      },
      {
        quote:
          "First year filing ITR for our LLP. I had no idea what documents were needed. Ollvy's checklist inside the app told me exactly what to upload - P&L, balance sheet, bank statements. The CA handled the rest. Filed 10 days before deadline.",
        name: 'Meera R.',
        role: 'Partner',
        business: 'LLP, Consulting',
        city: 'Chennai',
      },
    ],
    faqs: [
      {
        q: 'What is the due date for filing business ITR for FY 2025-26?',
        a: 'The due date is October 31, 2026 for companies and firms that require an audit. This applies to all Pvt Ltd companies (ITR-6), LLPs (ITR-5), and Partnership firms. If you miss this date, a belated return can be filed until December 31, 2026 - but penalties and interest apply from November 1.',
      },
      {
        q: 'What happens if I file my company ITR after October 31?',
        a: 'Three things happen. First, Section 234F imposes a flat late filing fee of Rs 5,000 (or Rs 1,000 if total income is below Rs 5 lakh). Second, Section 234A charges interest at 1% per month on any unpaid tax liability from November 1 until you file. Third, and most importantly, you permanently lose the right to carry forward any business losses from FY 2025-26 under Section 80.',
      },
      {
        q: 'Which ITR form does my company need to file?',
        a: 'Pvt Ltd companies and OPCs file ITR-6. LLPs and Partnership firms file ITR-5. If you are an individual with business income, you file ITR-3 (due July 31, not October 31). Ollvy assigns a CA who determines the correct form based on your entity type and handles the filing end to end.',
      },
      {
        q: 'Do I need a tax audit before filing ITR?',
        a: 'A tax audit under Section 44AB is mandatory if your business turnover exceeds Rs 1 crore (or Rs 10 crore if 95% of transactions are digital). The audit must be completed and the audit report uploaded to the Income Tax portal before filing the ITR. Ollvy coordinates the audit and filing together within the SLA.',
      },
      {
        q: 'How long does Ollvy take to file business ITR?',
        a: 'Ollvy files business ITR within 10 working days of receiving all documents and the approved financial statements. A CA is assigned within 24 hours of booking. The timeline starts after document approval, not payment - so have your P&L, balance sheet, and bank statements ready.',
      },
    ],
    lastReviewed: 'April 2026',
    sources: [
      { name: 'Income Tax Act - Section 139', url: 'https://incometaxindia.gov.in/pages/acts/income-tax-act.aspx', description: 'Due dates for filing income tax returns by entity type' },
      { name: 'Section 234A/234F - Late Filing Penalties', url: 'https://incometaxindia.gov.in/pages/acts/income-tax-act.aspx', description: 'Interest and late fee provisions for belated ITR filing' },
      { name: 'CBDT Circular on Audit Due Dates', url: 'https://www.incometaxindia.gov.in/communications/circular/circular-no-6-2024.pdf', description: 'Clarification on tax audit and ITR filing deadlines' },
    ],
  },
  {
    slug: 'gst-annual-2026',
    serviceSlug: 'gst-annual',
    serviceName: 'GST Annual Return (GSTR-9)',
    eventLabel: 'FY 2025-26 Annual Return',
    dueDate: '2026-12-31',
    postDeadlineMessage:
      'The Dec 31 deadline has passed. File GSTR-9 immediately - ₹200/day penalty is accruing.',
    heroTagline: 'FY 2025-26 Annual Return',
    purposeLabel: 'GST ANNUAL FILING',
    eligibilityLabel: 'All GST-registered businesses above ₹2Cr turnover',
    urgencyLine: 'File before Dec 31 to avoid ₹200/day penalty',
    penaltyLine: 'Past due: Rs 200/day late fee, capped at 0.25% of turnover in the state',
    ollvyFee: 4999,
    govtFee: 0,
    slaDays: 7,
    seoTitle: 'GSTR-9 Annual Return 2026 - File Before Dec 31 | Ollvy',
    seoDescription:
      'File your GSTR-9 annual return for FY 2025-26 before December 31. Fixed price ₹4,999. CA assigned same day.',
    canonicalUrl: 'https://www.ollvy.com/gst-annual-2026',
    documentTab: 'pvt_ltd',
    documentHeading: 'What Ollvy CA will ask for to file GSTR-9',
    risks: [
      {
        title: 'Rs 200/day late fee, capped at 0.25% of turnover',
        body: "GSTR-9 late fee is Rs 200/day (Rs 100 CGST + Rs 100 SGST). Capped at 0.25% of annual turnover in the state (Section 47(2) CGST Act). At 90 days late, Rs 18,000. At 180 days, Rs 36,000 - or the 0.25% cap, whichever is lower.",
      },
      {
        title: 'ITC claims become final',
        body: 'GSTR-9 is your last chance to claim or correct ITC for the financial year. Any unclaimed ITC from FY 2025-26 is permanently lost if not reconciled in this return.',
      },
    ],
    testimonials: [
      {
        quote:
          "I missed GSTR-9 last year and paid ₹14,000 in late fees. This year I booked with Ollvy in November. The CA reconciled my GSTR-1/3B with the 2A data, found ₹47,000 in unclaimed ITC, and filed two weeks before deadline. The service paid for itself 10x.",
        name: 'Rajesh P.',
        role: 'Founder',
        business: 'Manufacturing, Pvt Ltd',
        city: 'Ahmedabad',
      },
      {
        quote:
          "GSTR-9 reconciliation used to take my accountant two weeks of back-and-forth. Ollvy's CA asked for my GST portal credentials, did the reconciliation themselves, and showed me the draft in the app. I approved it, they filed it. Took 4 days total.",
        name: 'Ananya K.',
        role: 'CFO',
        business: 'E-commerce',
        city: 'Bangalore',
      },
    ],
    faqs: [
      {
        q: 'Who needs to file GSTR-9 for FY 2025-26?',
        a: 'GSTR-9 is mandatory for all GST-registered businesses with annual aggregate turnover above Rs 2 crore. If your turnover is below Rs 2 crore, GSTR-9 is optional but recommended - it reconciles your monthly returns and can help you catch unclaimed ITC before it expires.',
      },
      {
        q: 'What is the penalty for filing GSTR-9 late?',
        a: 'Rs 200 per day (Rs 100 CGST + Rs 100 SGST). Capped at 0.25% of annual turnover in the state (0.25% CGST + 0.25% SGST = 0.50% total, Section 47(2) CGST Act). At 90 days late, Rs 18,000. At 180 days, Rs 36,000 - or the 0.25% cap, whichever is lower.',
      },
      {
        q: 'What is the difference between GSTR-9 and GSTR-9C?',
        a: 'GSTR-9 is the annual return - a summary of all your monthly GSTR-1 and GSTR-3B filings for the year. GSTR-9C is the reconciliation statement (audit) required if your turnover exceeds Rs 5 crore. It reconciles the figures in GSTR-9 with your audited financial statements. If GSTR-9C is required, both must be filed by the same deadline.',
      },
      {
        q: 'Can I claim missed ITC through GSTR-9?',
        a: 'Yes. GSTR-9 is your last opportunity to claim any ITC that was missed or incorrectly reported in your monthly GSTR-3B returns for FY 2025-26. Any ITC not reconciled and claimed through GSTR-9 for this financial year is permanently lost.',
      },
      {
        q: 'How long does Ollvy take to file GSTR-9?',
        a: 'Ollvy files GSTR-9 within 7 working days. The CA reconciles your GSTR-1, GSTR-3B, and GSTR-2A/2B data, identifies any ITC gaps or mismatches, prepares the return, and files after your approval. A GST expert is assigned the same day you book.',
      },
    ],
    lastReviewed: 'April 2026',
    sources: [
      { name: 'CBIC Notification - GSTR-9 Due Date', url: 'https://www.cbic.gov.in/resources/htdocs-cbec/gst/notfctn-gstr9-due-date.pdf', description: 'Official notification on GSTR-9 annual return due date' },
      { name: 'CGST Act - Section 44 (Annual Return)', url: 'https://cbic-gst.gov.in/sectional-view-cgst-act.html', description: 'Legal provision requiring annual return filing for registered taxpayers' },
      { name: 'CBIC Late Fee Notification 19/2021', url: 'https://www.cbic.gov.in/resources/htdocs-cbec/gst/notfctn-19-central-tax-english-2021.pdf', description: 'Revised late fee rates for delayed GSTR-9 filing' },
    ],
  },
  {
    slug: 'director-kyc-2026',
    serviceSlug: 'director-kyc',
    serviceName: 'Director KYC (DIR-3 KYC)',
    eventLabel: 'Triennial Filing - Due Jun 30, 2028',
    dueDate: '2028-06-30',
    postDeadlineMessage:
      'The filing deadline has passed. Your DIN may already be deactivated. File DIR-3 KYC Web immediately - Rs 5,000 flat penalty per director applies.',
    heroTagline: 'Jun 30, 2028 - Every 3 years',
    purposeLabel: 'MCA COMPLIANCE',
    eligibilityLabel: 'All directors of Indian companies',
    urgencyLine: 'Next triennial filing due Jun 30, 2028. Missed the last deadline? DIN is already deactivated.',
    penaltyLine: 'Past due: Rs 5,000 flat penalty per director + DIN deactivated',
    ollvyFee: 999,
    govtFee: 0,
    slaDays: 2,
    seoTitle: 'Director KYC 2026 - Triennial DIR-3 KYC Filing | Due Jun 30, 2028 | Ollvy',
    seoDescription:
      'Director KYC moved to triennial filing. Next due Jun 30, 2028. Missed the last deadline? Rs 5,000 penalty per director. Ollvy files DIR-3 KYC Web in 2 working days. Fixed price Rs 999.',
    canonicalUrl: 'https://www.ollvy.com/director-kyc-2026',
    documentTab: 'pvt_ltd',
    documentHeading: "Two documents. That's it. This one is simple.",
    risks: [
      {
        title: 'Rs 5,000 flat penalty per director',
        body: 'MCA charges Rs 5,000 per director for late filing. 3 directors = Rs 15,000. The DIN is also deactivated, blocking all company filings until KYC is filed.',
      },
      {
        title: 'All MCA filings blocked',
        body: 'A deactivated DIN blocks all company filings - annual returns, director changes, share transfers. Everything stops until the KYC is filed.',
      },
    ],
    testimonials: [
      {
        quote:
          "I have 3 companies and forgot DIR-3 KYC for all three. My DIN got deactivated. Ollvy filed the KYC for all three the same day I booked. DIN was reactivated within 48 hours. Rs 2,997 for Ollvy (3 × Rs 999) plus the Rs 5,000 MCA late fee.",
        name: 'Sanjay M.',
        role: 'Director',
        business: 'Multiple Pvt Ltd companies',
        city: 'Mumbai',
      },
      {
        quote:
          "Simplest compliance I've ever done. Uploaded Aadhaar and PAN to the app. The CS verified my details, filed DIR-3 KYC Web. Done in one day. Next triennial deadline added to my calendar automatically.",
        name: 'Nisha T.',
        role: 'Founder & Director',
        business: 'SaaS startup',
        city: 'Hyderabad',
      },
    ],
    faqs: [
      {
        q: 'What is Director KYC and who needs to file it?',
        a: 'Director KYC (DIR-3 KYC) is a mandatory compliance for every person who holds a Director Identification Number (DIN) in India. MCA changed this from annual to triennial (every 3 years) effective March 31, 2026. This includes active directors, resigned directors who still hold a DIN, and designated partners of LLPs. Next triennial filing is due June 30, 2028. Changes to mobile, email, or address still require filing within 30 days.',
      },
      {
        q: 'What happens if I miss the filing deadline?',
        a: 'Your DIN is deactivated by MCA after the due date. A deactivated DIN means you cannot sign any board resolutions, company filings, or legal documents as a director. The penalty is Rs 5,000 per director (flat fee, not per day), and all MCA filings for your company are blocked until the KYC is filed and the DIN is reactivated.',
      },
      {
        q: 'What documents are needed for Director KYC?',
        a: 'Just two documents: your PAN card and Aadhaar card. The name on both must match exactly. No address proof, no photographs, no NOCs. Ollvy handles the DSC (Digital Signature Certificate) and the DIR-3 KYC filing with MCA.',
      },
      {
        q: 'How long does it take to reactivate a deactivated DIN?',
        a: 'After filing DIR-3 KYC with the Rs 5,000 penalty fee, MCA typically reactivates the DIN within 1-2 working days. During the deactivation period, all company filings that require your DIN - annual returns, director changes, share transfers - are blocked.',
      },
      {
        q: 'How fast can Ollvy file Director KYC?',
        a: 'Ollvy files DIR-3 KYC Web within 2 working days of receiving your PAN and Aadhaar. The fee is Rs 999 per director. If you have multiple directors or multiple companies, Ollvy handles all filings under a single order with one point of contact.',
      },
    ],
    lastReviewed: 'April 2026',
    sources: [
      { name: 'MCA General Circular 21/2025 - Triennial KYC', url: 'https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/circulars.html', description: 'MCA circular changing Director KYC from annual to triennial filing' },
      { name: 'Companies (Appointment and Qualification of Directors) Rules', url: 'https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/rules.html', description: 'Rule 12A - DIR-3 KYC filing requirements and penalty provisions' },
    ],
  },
  // ============================================
  // FY 2027 DEADLINES
  // ============================================
  {
    slug: 'tds-return-q1-2027',
    serviceSlug: 'tds-return',
    serviceName: 'TDS Return Filing',
    eventLabel: 'Q1 FY 2027-28 (April - June 2027)',
    dueDate: '2027-07-31',
    postDeadlineMessage:
      "The July 31 deadline has passed. You can still file a belated return but ₹200/day in fees is already accruing. File today to stop the clock. Our CA will handle the filing and late fee computation.",
    heroTagline: 'Q1 FY 2027-28 - April to June',
    purposeLabel: 'TDS COMPLIANCE',
    eligibilityLabel: 'All businesses and employers who deducted TDS in April, May, or June 2027',
    urgencyLine: 'TDS return for Q1 is due July 31. Every deductor must file Form 24Q, 26Q, or 27Q - no exceptions.',
    penaltyLine: 'Past due: ₹200/day in late fees starts ticking from August 1 - capped at the TDS amount but paired with 1.5%/month interest and prosecution risk under Section 276B.',
    ollvyFee: 2999,
    govtFee: 0,
    slaDays: 5,
    seoTitle: 'TDS Return Q1 FY2027-28 Filing - File Before July 31 | Ollvy',
    seoDescription:
      "File your Q1 TDS return before July 31, 2027. Starting at ₹2,999 with an Ollvy CA. Miss it and pay ₹200/day - don't risk prosecution.",
    canonicalUrl: 'https://www.ollvy.com/tds-return-q1-2027',
    documentTab: 'business_itr',
    documentHeading: 'Documents needed for TDS return filing',
    risks: [
      {
        title: '₹200/day. Every day.',
        body: "Section 234E: a mandatory late fee of ₹200 per day applies from August 1 until you file. It's capped at the total TDS amount, but on a payroll of ₹10L, that's up to ₹10,000 in fees alone - before interest.",
      },
      {
        title: '1.5% monthly interest on the TDS itself',
        body: "Section 201(1A): if TDS was deducted but not deposited on time, 1.5% interest per month runs from the date of deduction. On ₹5L in TDS, that's ₹7,500 for every month you delay. This compounds from the deduction date, not the filing date.",
      },
      {
        title: 'Prosecution under Section 276B',
        body: 'Willful failure to deposit TDS is a criminal offence. Section 276B allows prosecution with imprisonment ranging from 3 months to 7 years plus a fine. In practice, the Income Tax Department has issued notices to directors personally - not just the company.',
      },
    ],
    testimonials: [
      {
        quote:
          "We had 14 employees and TDS across salary, rent, and professional fees - three different forms. Our old CA would take three weeks and still come back with corrections. Ollvy assigned a CA the same day I paid, sent a document checklist within hours, and filed all three returns in under five days. The 26AS reconciliation was clean on the first try.",
        name: 'Rohan M.',
        role: 'Co-founder',
        business: 'Pvt Ltd, SaaS',
        city: 'Bengaluru',
      },
      {
        quote:
          "I missed the Q3 deadline two years ago with my previous CA and paid ₹18,000 in late fees on a ₹90,000 TDS liability. Switched to Ollvy for Q1 this year. They reminded me ten days before the deadline, I uploaded my payroll sheet, and it was done before I even followed up. That's all I wanted - someone who treats a deadline like a deadline.",
        name: 'Anita P.',
        role: 'Managing Partner',
        business: 'LLP, Consulting',
        city: 'Hyderabad',
      },
    ],
    faqs: [
      {
        q: 'What is the TDS return filing deadline for Q1 FY 2027-28?',
        a: 'The TDS return for Q1 (April to June 2027) is due by July 31, 2027. This applies to all businesses and employers who deducted TDS during these three months. You must file the appropriate form - 24Q for salary TDS, 26Q for non-salary TDS, or 27Q for payments to non-residents.',
      },
      {
        q: 'What is the penalty for late filing of TDS returns?',
        a: 'Section 234E imposes a late fee of Rs 200 per day from August 1 until you file. This is capped at the total TDS amount for the quarter. On top of this, Section 201(1A) charges 1.5% monthly interest on any TDS that was deducted but not deposited on time. In serious cases, Section 276B allows prosecution with imprisonment from 3 months to 7 years.',
      },
      {
        q: 'What forms do I need to file for TDS returns?',
        a: 'Form 24Q is for TDS on salary. Form 26Q is for TDS on payments other than salary (rent, professional fees, contractor payments). Form 27Q is for TDS on payments to non-residents. Most businesses with employees and vendors will file both 24Q and 26Q. Ollvy CA determines which forms apply based on your deductions.',
      },
      {
        q: 'What documents are needed to file TDS returns?',
        a: 'You need your payroll sheets (for salary TDS), vendor payment records with TDS certificates, bank statements showing TDS deposits via challan, and the TAN (Tax Deduction Account Number) for your business. Ollvy provides a document checklist in the app and your assigned CA handles the reconciliation and filing.',
      },
      {
        q: 'How long does Ollvy take to file TDS returns?',
        a: 'Ollvy files TDS returns within 5 working days. A CA is assigned the same day you book. If you have multiple forms (24Q + 26Q), they are filed together under a single order. The fee starts at Rs 2,999 per quarter.',
      },
    ],
    lastReviewed: 'April 2026',
    sources: [
      { name: 'Income Tax Act - Section 200(3)', url: 'https://incometaxindia.gov.in/pages/acts/income-tax-act.aspx', description: 'Due dates for filing TDS statements (Form 24Q, 26Q, 27Q)' },
      { name: 'Section 234E - Late Filing Fee', url: 'https://incometaxindia.gov.in/pages/acts/income-tax-act.aspx', description: 'Rs 200 per day late fee for delayed TDS return filing' },
      { name: 'TRACES Portal', url: 'https://www.tdscpc.gov.in/', description: 'TDS Reconciliation Analysis and Correction Enabling System' },
    ],
  },
  {
    slug: 'itr-2027',
    serviceSlug: 'business-itr',
    serviceName: 'Business ITR Filing',
    eventLabel: 'Financial Year 2026-27',
    dueDate: '2027-10-31',
    postDeadlineMessage:
      "The October 31 deadline passed. You can still file a belated return until December 31, 2027 - but the ₹10,000 penalty applies immediately and you've already lost loss carry-forward rights. File today to avoid further consequences. Our CA will assess the damage and get you compliant.",
    heroTagline: 'Financial Year 2026-27',
    purposeLabel: 'TAX FILING',
    eligibilityLabel: 'All Pvt Ltd companies, LLPs, OPCs, and Partnership firms registered in India',
    urgencyLine: 'Your company ITR for FY 2026-27 is due October 31. Miss this and your losses are gone - permanently. No extension, no workaround.',
    penaltyLine: 'Past due: a ₹10,000 late filing fee kicks in from November 1, you permanently lose the right to carry forward business losses, and director DINs may be deactivated by MCA.',
    ollvyFee: 4999,
    govtFee: 0,
    slaDays: 10,
    seoTitle: 'Business ITR Filing FY2026-27 - File Before Oct 31 | Ollvy',
    seoDescription:
      'File your company ITR for FY 2026-27 before October 31, 2027. Fixed price Rs 4,999. Miss it and lose the right to carry forward losses forever.',
    canonicalUrl: 'https://www.ollvy.com/itr-2027',
    documentTab: 'business_itr',
    documentHeading: "Documents you'll need to file ITR-6 / ITR-5",
    risks: [
      {
        title: 'Business losses gone forever',
        body: "Section 80 of the Income Tax Act: if you miss the October 31 due date, you permanently lose the right to carry forward any business losses from FY 2026-27. If your company made a ₹15L loss this year, that offset against next year's profit - and the ₹4.5L in tax it saves - is gone. No appeal, no remedy.",
      },
      {
        title: '₹10,000 penalty from day one',
        body: "Section 234F: a flat ₹10,000 late filing fee applies the moment you cross November 1. On top of that, Section 234A charges 1% per month interest on any unpaid tax from the due date. On a ₹5L tax liability, that's ₹5,000 per month compounding until you file.",
      },
      {
        title: 'Scrutiny risk increases with late filing',
        body: "Late filing increases the probability of receiving a Section 143(2) scrutiny notice. The Income Tax department flags belated returns for higher review priority. A scrutiny assessment requires detailed documentation and can take 6-12 months to close.",
      },
    ],
    testimonials: [
      {
        quote:
          "We were a 9-month-old startup with mixed income - some consulting revenue, one product sale, and a bunch of cloud expenses. Our CA quoted us ₹25,000 and needed six weeks. Ollvy quoted ₹12,999 and delivered in eight days. The CA on the platform understood startup financials - asked the right questions about deferred revenue and didn't treat us like a trading firm.",
        name: 'Karan T.',
        role: 'Founder',
        business: 'Pvt Ltd, B2B SaaS',
        city: 'Pune',
      },
      {
        quote:
          'Last year we almost lost ₹8L in carry-forward losses because our CA kept pushing the timeline. I switched to Ollvy specifically because of the fixed 10-day commitment. They filed with three days to spare. This year I booked in September itself - lesson learned the hard way.',
        name: 'Deepika R.',
        role: 'Director',
        business: 'Pvt Ltd, D2C',
        city: 'Mumbai',
      },
    ],
    faqs: [
      {
        q: 'What is the due date for business ITR filing for FY 2026-27?',
        a: 'October 31, 2027. This applies to all Pvt Ltd companies, LLPs, OPCs, and Partnership firms. Companies that require a transfer pricing report have an extended deadline of November 30, 2027. A belated return can be filed until December 31, 2027 but penalties and loss of carry-forward rights apply from November 1.',
      },
      {
        q: 'What do I lose by filing business ITR late?',
        a: 'You permanently lose the right to carry forward any business losses from FY 2026-27 under Section 80. If your company made a Rs 15 lakh loss this year, the offset against future profits - and the Rs 4.5 lakh in tax it would save - is gone with no appeal or remedy. Additionally, Section 234F charges Rs 10,000 in late fees and Section 234A charges 1% monthly interest on unpaid tax.',
      },
      {
        q: 'Does my company need a tax audit for FY 2026-27?',
        a: 'A tax audit under Section 44AB is mandatory if your business turnover exceeds Rs 1 crore (or Rs 10 crore if 95% of transactions are digital). The audit report must be uploaded to the Income Tax portal before filing the ITR. Ollvy coordinates the audit and ITR filing as a single engagement.',
      },
      {
        q: 'What documents are needed to file company ITR?',
        a: 'You need your audited financial statements (P&L and balance sheet), bank statements for all business accounts, details of tax payments (advance tax, TDS), depreciation schedule, and any capital gains documentation. For LLPs, the LLP agreement and partner capital account statements are also required.',
      },
      {
        q: 'How much does Ollvy charge for business ITR filing?',
        a: 'Ollvy charges Rs 4,999 for business ITR filing for FY 2026-27. This includes CA assignment within 24 hours, document review, computation of income, and filing of ITR-6 (for companies) or ITR-5 (for LLPs). The filing is completed within 10 working days of receiving approved financial statements.',
      },
    ],
    lastReviewed: 'April 2026',
    sources: [
      { name: 'Income Tax Act - Section 139', url: 'https://incometaxindia.gov.in/pages/acts/income-tax-act.aspx', description: 'Due dates for filing income tax returns by entity type' },
      { name: 'Section 234A/234F - Late Filing Penalties', url: 'https://incometaxindia.gov.in/pages/acts/income-tax-act.aspx', description: 'Interest and late fee provisions for belated ITR filing' },
      { name: 'CBDT Circular on Audit Due Dates', url: 'https://www.incometaxindia.gov.in/communications/circular/circular-no-6-2024.pdf', description: 'Clarification on tax audit and ITR filing deadlines' },
    ],
  },
  {
    slug: 'gst-annual-2027',
    serviceSlug: 'gst-annual',
    serviceName: 'GST Annual Return (GSTR-9)',
    eventLabel: 'FY 2026-27 Annual Return',
    dueDate: '2027-12-31',
    postDeadlineMessage:
      'The December 31 deadline has passed. GSTR-9 can still be filed but late fees are accumulating daily. The reconciliation work is the same - just more expensive now. Book today and our GST expert will compute your exact liability and file without further delay.',
    heroTagline: 'GST Annual Return - FY 2026-27',
    purposeLabel: 'GST ANNUAL FILING',
    eligibilityLabel: 'All GST-registered businesses with annual aggregate turnover above ₹2 crore',
    urgencyLine: 'GSTR-9 reconciles your entire year of GST returns into one final statement. Due December 31 - and it requires Ollvy CA to reconcile 12 months of GSTR-1, 3B, and 2A data before filing.',
    penaltyLine: "Past due: ₹200/day in late fees (₹100 CGST + ₹100 SGST) starts January 1, capped at 0.25% of your annual turnover. On ₹2Cr turnover, that's ₹50,000 in fees.",
    ollvyFee: 4999,
    govtFee: 0,
    slaDays: 7,
    seoTitle: 'GSTR-9 Annual Return FY2026-27 - File Before Dec 31 | Ollvy',
    seoDescription:
      "File GSTR-9 for FY 2026-27 before December 31, 2027. From ₹4,999 with a dedicated GST expert. Late fees start at ₹200/day - don't miss it.",
    canonicalUrl: 'https://www.ollvy.com/gst-annual-2027',
    documentTab: 'pvt_ltd',
    documentHeading: 'What Ollvy CA will ask for to file GSTR-9',
    risks: [
      {
        title: '₹200/day and it compounds with turnover',
        body: "Section 47 of the CGST Act: late fee is ₹100/day under CGST and ₹100/day under SGST - totalling ₹200/day. The maximum cap is 0.25% of your turnover. For a business with ₹3Cr annual revenue, the ceiling is ₹75,000. You hit that ceiling in 375 days. But the damage to your GST compliance rating starts day one.",
      },
      {
        title: 'Mismatches get flagged - and trigger audits',
        body: 'GSTR-9 reconciles what you declared monthly in GSTR-1 and GSTR-3B against the full year. Discrepancies between your monthly returns and GSTR-9 are auto-flagged by the GSTN system. Common mismatches - HSN summary errors, ITC differences, inter-state vs intra-state misclassification - draw scrutiny notices and can trigger a GST audit.',
      },
      {
        title: 'Blocked ITC and show-cause notices',
        body: "Non-filers of GSTR-9 are increasingly being flagged during ITC scrutiny. If your buyers file their GSTR-9 and your supplies don't reconcile with yours, they can lose ITC - and then they come to you. A pending GSTR-9 can quietly erode supplier trust and trigger payment disputes.",
      },
    ],
    testimonials: [
      {
        quote:
          "GSTR-9 is the one filing I genuinely dread. We had 11 months of clean GSTR-3B and one month where we made a mess of the ITC on a vendor invoice. Our previous CA couldn't reconcile it and just filed with a mismatch. Ollvy's CA flagged the discrepancy, explained exactly what to amend, and filed a clean GSTR-9 with a proper ITC reversal note. No scrutiny since.",
        name: 'Suresh K.',
        role: 'Partner',
        business: 'Partnership, Wholesale Trade',
        city: 'Delhi',
      },
      {
        quote:
          "We run five GSTIN registrations across states. Coordinating GSTR-9 for all five used to be a nightmare - different CAs, different timelines, three of them filing late every year. Ollvy handled all five under one dashboard. Single point of contact, unified document request, all five filed within six days of each other. That's the first time in three years we've been 100% compliant before Christmas.",
        name: 'Priya N.',
        role: 'CFO',
        business: 'Pvt Ltd, Manufacturing',
        city: 'Ahmedabad',
      },
    ],
    faqs: [
      {
        q: 'Who needs to file GSTR-9 for FY 2026-27?',
        a: 'All GST-registered businesses with annual aggregate turnover above Rs 2 crore must file GSTR-9. Businesses below Rs 2 crore are exempt but can file voluntarily. If you have multiple GSTINs across states, each registration requires a separate GSTR-9.',
      },
      {
        q: 'What is the GSTR-9 deadline for FY 2026-27?',
        a: 'December 31, 2027. The late fee of Rs 200 per day (Rs 100 CGST + Rs 100 SGST) starts from January 1, 2028. The maximum late fee is capped at 0.25% of your annual turnover in the state. On Rs 3 crore turnover, the ceiling is Rs 75,000.',
      },
      {
        q: 'Do I also need to file GSTR-9C?',
        a: 'GSTR-9C (the reconciliation statement) is required if your annual turnover exceeds Rs 5 crore. It reconciles the figures in your GSTR-9 with your audited financial statements. Both GSTR-9 and GSTR-9C share the same December 31 deadline.',
      },
      {
        q: 'What happens if my GSTR-9 has mismatches with my monthly returns?',
        a: 'Discrepancies between GSTR-9 and your monthly GSTR-1/GSTR-3B filings are auto-flagged by the GSTN system. Common mismatches include HSN summary errors, ITC differences, and inter-state vs intra-state misclassification. These can trigger scrutiny notices and GST audits. Filing a clean, reconciled GSTR-9 is the best way to avoid these.',
      },
      {
        q: 'How does Ollvy handle GSTR-9 filing?',
        a: 'Ollvy assigns a GST expert the same day you book. The CA reconciles your GSTR-1, GSTR-3B, and GSTR-2A/2B data for the full year, identifies ITC gaps and mismatches, prepares the GSTR-9 draft for your approval, and files after sign-off. The entire process takes 7 working days. Fee is Rs 4,999.',
      },
    ],
    lastReviewed: 'April 2026',
    sources: [
      { name: 'CBIC Notification - GSTR-9 Due Date', url: 'https://www.cbic.gov.in/resources/htdocs-cbec/gst/notfctn-gstr9-due-date.pdf', description: 'Official notification on GSTR-9 annual return due date' },
      { name: 'CGST Act - Section 44 (Annual Return)', url: 'https://cbic-gst.gov.in/sectional-view-cgst-act.html', description: 'Legal provision requiring annual return filing for registered taxpayers' },
      { name: 'CBIC Late Fee Notification 19/2021', url: 'https://www.cbic.gov.in/resources/htdocs-cbec/gst/notfctn-19-central-tax-english-2021.pdf', description: 'Revised late fee rates for delayed GSTR-9 filing' },
    ],
  },
]

export function getDeadlineBySlug(slug: string): DeadlineConfig | undefined {
  return DEADLINES.find((d) => d.slug === slug)
}

export function generateDeadlineFAQSchema(deadline: DeadlineConfig) {
  if (!deadline.faqs || deadline.faqs.length === 0) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: deadline.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  }
}

/**
 * Fetch live price from DB for a deadline's linked service.
 * Returns the deadline config with ollvyFee overridden by DB price.
 * Falls back to static ollvyFee if DB is unavailable.
 */
export async function getDeadlineWithLivePrice(slug: string): Promise<DeadlineConfig | undefined> {
  const deadline = getDeadlineBySlug(slug)
  if (!deadline) return undefined

  try {
    const { getServiceBySlugFromDB } = await import('./data/services')
    const { pricing } = await getServiceBySlugFromDB(deadline.serviceSlug)
    if (pricing) {
      return {
        ...deadline,
        ollvyFee: pricing.ollvyFee || deadline.ollvyFee,
        govtFee: pricing.govtFee ?? deadline.govtFee,
      }
    }
  } catch {
    // Fallback to static price
  }

  return deadline
}
