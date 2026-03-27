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
      body: 'Company CIN, financial year, AGM date, and audited financials status. A company secretary is assigned within 4 hours. They determine your exact filing deadlines based on AGM date.',
      visual: 'checklist',
      milestone: 'Company secretary assigned',
    },
    {
      step: 2,
      title: 'Upload financial statements and documents',
      timeline: 'Day 0-2',
      body: 'Audited balance sheet, P&L statement, notes to accounts, director report, auditor report. For AOC-4. Shareholder list, director changes, share transfer details for MGT-7.',
      visual: 'upload',
      milestone: 'Documents reviewed by CS',
    },
    {
      step: 3,
      title: 'Forms drafted and reviewed',
      timeline: 'Day 2-4',
      body: 'Your CS drafts AOC-4 (financial statements) and MGT-7 (annual return) based on your uploaded documents. Both forms are reviewed for accuracy before filing. You approve the drafts in the app.',
      visual: 'form',
      milestone: 'Draft forms sent for approval',
    },
    {
      step: 4,
      title: 'Filed on MCA21 - SRN generated',
      timeline: 'Day 5-7',
      body: 'Your CS files both forms on MCA21. Service Request Number (SRN) generated for each form. SRNs shared immediately. Forms are processed by ROC within 24-48 hours.',
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
      icon: 'clock',
      title: 'AGM not held on time',
      body: 'AGM must be held within 6 months of financial year end (Sep 30 for March FY). If AGM is delayed, MCA annual filing is automatically delayed. We cannot file without an AGM date. Hold your AGM first.',
    },
    {
      icon: 'document',
      title: 'Audited financials not ready',
      body: "AOC-4 requires audited balance sheet and P&L with auditor's signature. If your audit is incomplete, we cannot file. Get your audit done first. We can recommend auditors if needed.",
    },
    {
      icon: 'alert',
      title: 'Penalty accruing daily',
      body: "Late filing penalty is ₹100/day per form. For both forms, that's ₹200/day. At 90 days late, you owe ₹18,000. At 180 days, ₹36,000. There is no ceiling. File as soon as audit is ready.",
    },
  ],

  profilePersonas: [
    {
      label: 'First year after incorporation',
      detail: 'First MCA annual filing. We explain every field.',
    },
    {
      label: 'Running late on filing',
      detail: 'Already past deadline. We calculate penalty and file immediately.',
    },
    {
      label: 'Director changes during the year',
      detail: 'New director appointments or resignations reflected in MGT-7.',
    },
    {
      label: 'Share transfer happened',
      detail: 'Equity changes during the year. Shareholder details updated in MGT-7.',
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
      q: 'What is MCA annual filing?',
      a: 'Two mandatory forms: AOC-4 (financial statements) and MGT-7 (annual return). Every Pvt Ltd, OPC, and public company must file these every year with the Registrar of Companies.',
    },
    {
      category: 'General',
      q: 'When is MCA annual filing due?',
      a: 'AOC-4: within 30 days of AGM. MGT-7: within 60 days of AGM. AGM must be held within 6 months of financial year end. For March FY, AGM by Sep 30, AOC-4 by Oct 30, MGT-7 by Nov 30.',
    },
    {
      category: 'Process',
      q: 'Can I file if my audit is not complete?',
      a: 'No. AOC-4 requires audited financials signed by your auditor. Complete the audit first, then book MCA annual filing. We can recommend auditors if you need one.',
    },
    {
      category: 'Process',
      q: 'What if I haven\'t held AGM yet?',
      a: "Hold your AGM first. MCA filing deadlines are calculated from AGM date. If AGM is delayed beyond Sep 30 (for March FY), you'll need ROC extension or face compounding application.",
    },
    {
      category: 'Documents',
      q: 'What documents do I need?',
      a: 'Audited balance sheet, P&L statement, notes to accounts, director report, auditor report (for AOC-4). List of shareholders as of March 31, director appointment/resignation details, share transfer register (for MGT-7).',
    },
    {
      category: 'After Completion',
      q: 'What happens after filing?',
      a: 'ROC processes the forms within 24-48 hours. Once approved, your company\'s public record on MCA21 is updated. You can download the filed forms anytime. Annual compliance cycle resets.',
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
      url: 'https://www.mca.gov.in/Ministry/pdf/CompaniesAct2013.pdf',
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
