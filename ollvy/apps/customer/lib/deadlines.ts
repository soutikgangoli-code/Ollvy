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
}

export const DEADLINES: DeadlineConfig[] = [
  {
    slug: 'itr-2025',
    serviceSlug: 'business-itr',
    serviceName: 'Business ITR Filing',
    eventLabel: 'Financial Year 2025-26',
    dueDate: '2025-10-31',
    postDeadlineMessage:
      'The Oct 31 deadline has passed. File now to reduce penalty accrual — late filing interest is 1% per month.',
    heroTagline: 'Financial Year 2025-26',
    purposeLabel: 'TAX FILING',
    eligibilityLabel: 'All Pvt Ltd, LLP, and Partnership firms',
    urgencyLine: 'File by Oct 31 to avoid late filing interest',
    penaltyLine: 'Past due: 1% per month interest on tax payable',
    ollvyFee: 11999,
    govtFee: 0,
    slaDays: 10,
    seoTitle: 'Business ITR Filing 2025 — File Before Oct 31 | Ollvy',
    seoDescription:
      'File your company ITR (ITR-6 for Pvt Ltd, ITR-5 for LLP) before Oct 31, 2025. Fixed price ₹11,999. Verified CA assigned within 24 hours.',
    canonicalUrl: 'https://ollvy.com/itr-2025',
    documentTab: 'individual_itr',
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
        title: 'Defective return notice',
        body: 'Late filers are more likely to receive defective return notices under Section 139(9) — requires a response within 15 days or the return is treated as not filed.',
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
          "First year filing ITR for our LLP. I had no idea what documents were needed. Ollvy's checklist inside the app told me exactly what to upload — P&L, balance sheet, bank statements. The CA handled the rest. Filed 10 days before deadline.",
        name: 'Meera R.',
        role: 'Partner',
        business: 'LLP, Consulting',
        city: 'Chennai',
      },
    ],
  },
  {
    slug: 'gst-annual-2025',
    serviceSlug: 'gst-annual-return',
    serviceName: 'GST Annual Return (GSTR-9)',
    eventLabel: 'FY 2024-25 Annual Return',
    dueDate: '2025-12-31',
    postDeadlineMessage:
      'The Dec 31 deadline has passed. File GSTR-9 immediately — ₹200/day penalty is accruing.',
    heroTagline: 'FY 2024-25 Annual Return',
    purposeLabel: 'GST ANNUAL FILING',
    eligibilityLabel: 'All GST-registered businesses above ₹2Cr turnover',
    urgencyLine: 'File before Dec 31 to avoid ₹200/day penalty',
    penaltyLine: 'Past due: ₹200/day late fee with no ceiling',
    ollvyFee: 4999,
    govtFee: 0,
    slaDays: 7,
    seoTitle: 'GSTR-9 Annual Return 2025 — File Before Dec 31 | Ollvy',
    seoDescription:
      'File your GSTR-9 annual return for FY 2024-25 before December 31. Fixed price ₹4,999. CA assigned same day.',
    canonicalUrl: 'https://ollvy.com/gst-annual-2025',
    documentTab: 'pvt_ltd',
    documentHeading: 'What your CA will ask for to file GSTR-9',
    risks: [
      {
        title: '₹200/day late fee — no ceiling',
        body: "GSTR-9 late fee is ₹200/day (₹100 CGST + ₹100 SGST) with no maximum cap. At 90 days late, that's ₹18,000. At 180 days, ₹36,000.",
      },
      {
        title: 'ITC claims become final',
        body: 'GSTR-9 is your last chance to claim or correct ITC for the financial year. Any unclaimed ITC from FY 2024-25 is permanently lost if not reconciled in this return.',
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
  },
  {
    slug: 'director-kyc-2025',
    serviceSlug: 'director-kyc',
    serviceName: 'Director KYC (DIR-3 KYC)',
    eventLabel: 'Annual Filing · Due Sep 30',
    dueDate: '2025-09-30',
    postDeadlineMessage:
      'The Sep 30 deadline has passed. Your DIN may already be deactivated. File DIR-3 KYC immediately — ₹5,000/day penalty is accruing.',
    heroTagline: 'Sep 30, 2025 · Every year',
    purposeLabel: 'MCA COMPLIANCE',
    eligibilityLabel: 'All directors of Indian companies',
    urgencyLine: 'File by Sep 30 or your DIN gets deactivated',
    penaltyLine: 'Past due: ₹5,000/day until filed + DIN deactivated',
    ollvyFee: 1499,
    govtFee: 0,
    slaDays: 2,
    seoTitle: 'Director KYC 2025 — DIR-3 KYC Filing Before Sep 30 | Ollvy',
    seoDescription:
      'File DIR-3 KYC before Sep 30, 2025. Avoid DIN deactivation and ₹5,000/day penalty. Fixed price ₹1,499 per director.',
    canonicalUrl: 'https://ollvy.com/director-kyc-2025',
    documentTab: 'pvt_ltd',
    documentHeading: "Two documents. That's it. This one is simple.",
    risks: [
      {
        title: '₹5,000/day penalty — starts immediately',
        body: 'The MCA penalty clock starts Oct 1. By Dec 31, that\'s ₹91,000 per director. Multiple directors multiply this. The DIN is also deactivated, blocking all company filings.',
      },
      {
        title: 'All MCA filings blocked',
        body: 'A deactivated DIN blocks all company filings — annual returns, director changes, share transfers. Everything stops until the KYC is filed.',
      },
    ],
    testimonials: [
      {
        quote:
          "I have 3 companies and forgot DIR-3 KYC for all three. My DIN got deactivated on Oct 2. Ollvy filed the KYC for all three the same day I booked. DIN was reactivated within 48 hours. ₹4,500 total vs the ₹15,000/day penalty I was accruing.",
        name: 'Sanjay M.',
        role: 'Director',
        business: 'Multiple Pvt Ltd companies',
        city: 'Mumbai',
      },
      {
        quote:
          "Simplest compliance I've ever done. Uploaded Aadhaar and PAN to the app. The CS verified my details, filed DIR-3 KYC. Done in one day. I got a reminder for next year's KYC added to my calendar automatically.",
        name: 'Nisha T.',
        role: 'Founder & Director',
        business: 'SaaS startup',
        city: 'Hyderabad',
      },
    ],
  },
]

export function getDeadlineBySlug(slug: string): DeadlineConfig | undefined {
  return DEADLINES.find((d) => d.slug === slug)
}
