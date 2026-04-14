import { ServiceConfig } from '../services'

export const mcaAnnualFiling: ServiceConfig = {
  slug: 'mca-annual-filing',
  name: 'MCA Annual Filing',
  shortName: 'MCA Annual',
  category: 'Tax Filings',
  tagline: 'AOC-4 and MGT-7. The annual return every Pvt Ltd must file.',

  ollvyFee: 14999,
  govtFee: 600,
  govtFeeLabel: 'MCA filing fees',
  govtFeeNote:
    'This fee is paid to the Ministry of Corporate Affairs. ₹300 per form (AOC-4 + MGT-7). Additional fees apply for delayed filing.',

  slaDays: 7,
  isRetainer: false,
  serviceType: 'Annual',
  mandatoryFor: 'All Pvt Ltd and OPC companies',
  legalBasis: 'Companies Act 2013, Section 92 & 137',
  penaltyForMissing: '₹100/day per form - no ceiling',
  penaltyColor: 'red',

  seoTitle: 'MCA Annual Filing Online | AOC-4 & MGT-7 | ₹7,599 | Ollvy',
  seoDescription:
    'File your MCA annual return (AOC-4 + MGT-7) on time. Due within 30/60 days of AGM. Fixed price ₹7,599 (₹6,999 Ollvy + ₹600 MCA). CS assigned same day.',
  canonicalUrl: 'https://www.ollvy.com/services/mca-annual-filing',

  processSteps: [
    {
      step: 1,
      title: 'Share your company details',
      timeline: 'Day 0',
      body: 'Provide: CIN, financial year, AGM date, audited financials status\nCS assigned within 4 hours\nFiling deadlines calculated from your AGM date',
      visual: 'checklist',
      milestone: 'Company secretary assigned',
    },
    {
      step: 2,
      title: 'Upload financial statements and documents',
      timeline: 'Day 0-2',
      body: 'For AOC-4: audited balance sheet, P&L, notes, director report, auditor report\nFor MGT-7: shareholder list, director changes, share transfers',
      visual: 'upload',
      milestone: 'Documents reviewed by CS',
    },
    {
      step: 3,
      title: 'Forms drafted and reviewed',
      timeline: 'Day 2-4',
      body: 'AOC-4 and MGT-7 drafted from your documents\nBoth reviewed for accuracy\nYou approve drafts in the app before filing',
      visual: 'form',
      milestone: 'Draft forms sent for approval',
    },
    {
      step: 4,
      title: 'Filed on MCA21 - SRN generated',
      timeline: 'Day 5-7',
      body: 'Both forms filed on MCA21\nSRN generated and shared immediately for each form\nROC processes within 24–48 hours',
      visual: 'stamp',
      milestone: 'AOC-4 and MGT-7 filed',
      isCompletion: true,
    },
  ],

  whatsIncluded: [
    {
      title: 'Both forms filed - AOC-4 and MGT-7',
      body: 'AOC-4 contains your audited financial statements. MGT-7 is the annual return with shareholder and director details. Both are mandatory. Both are included in ₹6,999.',
      comparisonWithout: 'Book AOC-4 and MGT-7 separately - higher total cost',
      comparisonWithOllvy: 'Both forms, one price, one CS',
    },
    {
      title: 'Deadline calculation based on AGM',
      body: 'AOC-4 is due within 30 days of AGM. MGT-7 is due within 60 days of AGM. AGM must be held within 6 months of financial year end. We track all three dates for you.',
      mockVisualType: 'calendar',
      mockVisualData: {
        row1: 'FY End: March 31 → AGM by Sep 30',
        row2: 'AOC-4 due: 30 days after AGM',
        row3: 'MGT-7 due: 60 days after AGM',
        note: 'We calculate your exact deadlines',
      },
    },
    {
      title: 'Penalty status checked before filing',
      body: "If you're filing late, penalty is ₹100/day per form from the due date. We calculate the exact penalty amount before filing so there are no surprises. Additional fees for delayed filing are disclosed upfront.",
      comparisonWithout: 'Surprise penalty at MCA portal during filing',
      comparisonWithOllvy: 'Penalty calculated and disclosed before you approve',
    },
    {
      title: 'SRN shared immediately',
      body: 'The Service Request Number is your proof of filing. We share both SRNs (AOC-4 and MGT-7) in your app immediately after submission. ROC typically processes within 48 hours.',
    },
  ],

  serviceRisks: [
    {
      icon: 'document',
      title: 'Audit must be complete first',
      body: 'AOC-4 requires signed, audited financials\nCannot file until audit is complete\nPlan audit timeline accordingly',
    },
    {
      icon: 'clock',
      title: 'AGM not held on time',
      body: 'AGM delayed past Sep 30 → filing deadlines shift\nNew deadlines calculated from actual AGM date',
    },
    {
      icon: 'alert',
      title: 'Penalty accrues daily',
      body: '₹100/day per form, ₹200/day for both — no ceiling\nFile as soon as documents are ready',
    },
  ],

  profilePersonas: [
    {
      label: 'First year after incorporation',
      detail: 'First MCA filing. We explain every field and what it means.',
    },
    {
      label: 'Running past the deadline',
      detail: 'Already in default. We calculate penalty and file immediately to stop it.',
    },
    {
      label: 'Director changes during the year',
      detail: 'Appointments and resignations reflected correctly in MGT-7.',
    },
    {
      label: 'Share transfer happened',
      detail: 'Updated shareholding pattern captured accurately.',
    },
  ],

  reviewKeywordChips: [
    '✓ Both forms filed',
    '✓ Penalty was clear upfront',
    '✓ CS reviewed financials',
    '✓ SRN same day',
    '✓ Fixed price',
  ],

  relatedSlugs: ['director-kyc', 'business-itr', 'pvt-ltd-incorporation'],

  faqs: [
    {
      category: 'General',
      q: 'When is MCA annual filing due?',
      a: 'AOC-4: within 30 days of AGM. MGT-7: within 60 days of AGM. AGM must be held by September 30 for companies with a March financial year end.',
    },
    {
      category: 'General',
      q: 'Is this different from Business ITR?',
      a: 'Yes. MCA annual filing is for the Ministry of Corporate Affairs (company registry). Business ITR is filed with the Income Tax department. Both are mandatory and have separate deadlines.',
    },
    {
      category: 'Process',
      q: 'Can I file if the audit is not complete?',
      a: 'No. AOC-4 requires signed, audited financials.',
    },
    {
      category: 'Process',
      q: 'What if I missed the deadline?',
      a: 'Penalty is Rs 100 per day per form from the due date. We calculate the exact amount and file immediately to stop further accumulation.',
    },
    {
      category: 'Documents',
      q: 'What documents do I need?',
      a: 'Audited Balance Sheet, P&L, notes to accounts, director report, auditor report, and updated shareholder list.',
    },
  ],

  reviewSources: [
    {
      name: 'MCA21 Portal',
      url: 'https://www.mca.gov.in',
      description: 'Ministry of Corporate Affairs - company filings portal',
    },
    {
      name: 'Companies Act 2013, Section 92 & 137',
      url: 'https://www.indiacode.nic.in/bitstream/123456789/2114/1/A2013-18.pdf',
      description: 'Annual return (MGT-7) and financial statement (AOC-4) requirements',
    },
  ],

  unlocks: [
    {
      name: 'Director KYC',
      explanation: 'Due Sep 30 every year. ₹5,000/day penalty if missed.',
      price: '₹1,499/director',
      type: 'required',
      slug: 'director-kyc',
    },
    {
      name: 'Business ITR',
      explanation: 'ITR-6 due Oct 31 every year.',
      price: '₹11,999',
      type: 'required',
      slug: 'business-itr',
    },
  ],

  showCompletionStats: false,
  showApprovalRate: false,
}
