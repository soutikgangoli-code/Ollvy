import { ServiceConfig } from '../services'

export const businessItr: ServiceConfig = {
  slug: 'business-itr',
  name: 'Business ITR Filing',
  shortName: 'Business ITR',
  category: 'Tax Filings',
  tagline: 'ITR-6 for Pvt Ltd, ITR-5 for LLP. Filed correctly, on time.',

  ollvyFee: 11999,
  govtFee: undefined,

  slaDays: 10,
  isRetainer: false,
  serviceType: 'Annual',
  mandatoryFor: 'All Pvt Ltd, LLP, and Partnership firms',
  legalBasis: 'Income Tax Act 1961, Section 139',
  penaltyForMissing: '1% per month interest on tax due',
  penaltyColor: 'amber',

  seoTitle: 'Business ITR Filing 2025 | ITR-6, ITR-5 | ₹11,999 | Ollvy',
  seoDescription:
    'File your company ITR (ITR-6 for Pvt Ltd, ITR-5 for LLP) before Oct 31. Fixed price ₹11,999. Verified CA assigned within 24 hours. Includes P&L review and depreciation.',
  canonicalUrl: 'https://ollvy.com/services/business-itr',

  processSteps: [
    {
      step: 1,
      title: 'Upload your financials - P&L, Balance Sheet, bank statements',
      timeline: 'Day 0-1',
      body: "A CA is assigned within 4 hours. They send you a personalised document checklist based on your entity type. You upload everything through the app - not WhatsApp, not email. Audited accounts if applicable, trial balance, bank statements for all accounts, and any other income documentation.",
      visual: 'upload',
      milestone: 'Documents received and assigned to CA',
    },
    {
      step: 2,
      title: 'CA reviews your books and prepares computation',
      timeline: 'Day 1-4',
      body: "Your CA reviews the P&L and Balance Sheet, verifies depreciation schedules, checks director remuneration treatment, and prepares the income computation. If there are discrepancies or questions, they message you through the app. You don't chase them - they chase you.",
      visual: 'form',
      milestone: 'Draft computation shared for your review',
    },
    {
      step: 3,
      title: 'You review, approve, and CA files',
      timeline: 'Day 4-7',
      body: "The draft ITR is shared in the app. You review the income figures, deductions, and tax computation. If everything looks correct, you approve. Your CA files to the Income Tax portal within 24 hours of approval. You don't need to log in anywhere.",
      visual: 'checklist',
      milestone: 'ITR submitted to Income Tax portal',
    },
    {
      step: 4,
      title: 'Acknowledgement delivered',
      timeline: 'Day 7-10',
      body: "The ITR-V acknowledgement is generated immediately on filing. We share it in the app the same day. Your compliance calendar is updated with next year's due date. All filed documents are stored permanently in your account.",
      visual: 'stamp',
      isCompletion: true,
      milestone: 'ITR-V acknowledgement delivered',
    },
  ],

  whatsIncluded: [
    {
      title: 'Depreciation review - not just data entry',
      body: "Your CA reviews your asset schedule and depreciation calculations. If you've been using incorrect rates or missing depreciation on eligible assets, they catch it. This affects your tax liability - getting it right matters.",
      comparisonWithout: 'You calculate depreciation, CA just enters it',
      comparisonWithOllvy: 'CA reviews asset schedule and corrects rates',
    },
    {
      title: 'Director remuneration treatment',
      body: "For Pvt Ltd companies, how you treat director salary vs dividends affects tax. Your CA reviews the remuneration structure and ensures it's compliant with Companies Act limits. If you're overpaying relative to profits, they flag it.",
    },
    {
      title: 'Draft review before filing',
      body: "You see the complete ITR before it's filed. Income figures, deductions, tax computation - everything. You approve it in the app. We don't file until you've reviewed it. Most CAs file and send you the acknowledgement after the fact.",
      comparisonWithout: 'ITR filed, acknowledgement sent, no review',
      comparisonWithOllvy: 'Draft shared, you approve, then we file',
    },
    {
      title: 'Acknowledgement stored permanently',
      body: "The ITR-V acknowledgement is uploaded to your Ollvy account the moment it's generated. Five years from now when you need it for a loan or audit, it's there. Not in an email thread you can't find.",
      mockVisualType: 'receipt',
      mockVisualData: {
        label: 'ITR-V Acknowledgement',
        row1: 'ITR-6 · AY 2025-26',
        row2: 'Filed: 15 Oct 2025',
        row3: 'Acknowledgement No: CPC/2025/A12345',
      },
    },
  ],

  serviceRisks: [
    {
      icon: 'clock',
      title: 'Belated filing interest at 1% per month',
      body: "Section 234A: if you file after Oct 31 and have tax due, 1% monthly interest accrues on the outstanding amount from Nov 1. On ₹5L tax liability, that's ₹5,000 per month.",
    },
    {
      icon: 'document',
      title: "Losses can't be carried forward",
      body: 'If your company made a loss this year and you file late, you lose the right to carry it forward and offset against future profits. This is irreversible.',
    },
    {
      icon: 'alert',
      title: 'Defective return notice',
      body: 'Late filers are more likely to receive defective return notices under Section 139(9) - requires a response within 15 days or the return is treated as not filed.',
    },
  ],

  profilePersonas: [
    {
      label: 'First year filing',
      detail: "New company, first ITR. We walk you through every document you need and why.",
    },
    {
      label: 'Changed CA mid-year',
      detail: "Previous CA's books are a mess. We reconcile and file correctly from whatever state they're in.",
    },
    {
      label: 'Company made a loss',
      detail: 'Loss returns are filed to preserve carry-forward rights. We ensure it\'s done correctly.',
    },
    {
      label: 'Filing late',
      detail: 'We calculate the interest liability upfront and file immediately to stop it growing.',
    },
  ],

  reviewKeywordChips: [
    '✓ Filed before deadline',
    '✓ CA reviewed depreciation',
    '✓ Draft shared before filing',
    '✓ Acknowledgement same day',
    '✓ No surprises',
  ],

  relatedSlugs: ['director-kyc', 'mca-annual-filing', 'gst-annual-return'],

  faqs: [
    {
      category: 'General',
      q: 'When is business ITR due?',
      a: 'For companies not requiring audit: Sep 30. For companies requiring audit: Oct 31. For transfer pricing cases: Nov 30. Most Pvt Ltd companies fall under Oct 31.',
    },
    {
      category: 'General',
      q: "What's the difference between ITR-5 and ITR-6?",
      a: "ITR-6 is for companies (Pvt Ltd, Public Ltd). ITR-5 is for LLPs, Partnership Firms, AOPs, and BOIs. The forms are different, the schedules are different, and the filing process is different. We handle both.",
    },
    {
      category: 'Process',
      q: 'What documents do I need?',
      a: "Audited financials (if applicable), P&L and Balance Sheet, trial balance, bank statements for all accounts, Form 26AS (TDS certificate), and previous year's ITR acknowledgement. We send a personalised checklist.",
    },
    {
      category: 'Process',
      q: 'Do I need to be audited?',
      a: "Audit is required if turnover exceeds ₹1Cr (₹10Cr if cash transactions are under 5%). The audit must be completed before ITR is filed. If you need an audit, book it separately - we can do that too.",
    },
    {
      category: 'After Completion',
      q: "What happens after filing?",
      a: "You receive the ITR-V acknowledgement immediately. Within 30 days, you may receive an intimation under Section 143(1) - this is normal processing. If there's a demand or refund, we explain it and help you respond.",
    },
  ],

  reviewSources: [
    {
      name: 'Income Tax India',
      url: 'https://www.incometax.gov.in',
      description: 'Official Income Tax e-filing portal',
    },
    {
      name: 'Income Tax Act, 1961',
      url: 'https://incometaxindia.gov.in/Pages/acts/income-tax-act.aspx',
      description: 'Section 139: Due dates. Section 234A/B/C: Interest provisions.',
    },
  ],

  unlocks: [
    {
      name: 'Tax Audit (if required)',
      explanation: 'Required above ₹1Cr turnover. Must be done before ITR filing.',
      price: 'From ₹24,999',
      type: 'required',
      slug: 'tax-audit',
    },
    {
      name: 'Advance Tax Planning',
      explanation: 'Pay tax quarterly to avoid interest. We calculate instalments.',
      price: '₹4,999/quarter',
      type: 'beneficial',
      slug: 'advance-tax',
    },
  ],

  showCompletionStats: false,
  showApprovalRate: false,
}
