import { ServiceConfig } from '../services'

export const businessItr: ServiceConfig = {
  slug: 'business-itr',
  name: 'Business ITR Filing',
  shortName: 'Business ITR',
  category: 'Tax Filings',
  tagline: 'ITR-6 for Pvt Ltd, ITR-5 for LLP. Filed correctly, on time.',

  ollvyFee: 4999,
  govtFee: undefined,
  mrp: 12000,

  slaDays: 10,
  isRetainer: false,
  serviceType: 'Annual',
  mandatoryFor: 'All Pvt Ltd, LLP, and Partnership firms',
  legalBasis: 'Income Tax Act 1961, Section 139',
  penaltyForMissing: '1% per month interest on tax due',
  penaltyColor: 'amber',

  seoTitle: 'Business ITR Filing 2025 | ITR-6, ITR-5 | ₹11,999 | Ollvy',
  seoDescription:
    'File your company ITR (ITR-6 for Pvt Ltd, ITR-5 for LLP) before Oct 31. Fixed price ₹11,999. Verified Ollvy CA assigned within 24 hours. Includes P&L review and depreciation.',
  canonicalUrl: 'https://www.ollvy.com/services/business-itr',

  processSteps: [
    {
      step: 1,
      title: 'Upload your financials - P&L, Balance Sheet, bank statements',
      timeline: 'Day 0-1',
      body: "Ollvy CA assigned within 4 hours\nPersonalised document checklist based on entity type\nUpload via app: audited accounts, trial balance, bank statements, income docs",
      visual: 'upload',
      milestone: 'Documents received and assigned to Ollvy CA',
    },
    {
      step: 2,
      title: 'Ollvy CA reviews your books and prepares computation',
      timeline: 'Day 1-4',
      body: "P&L, Balance Sheet, depreciation, director remuneration reviewed\nIncome computation prepared\nDiscrepancies flagged through app. Ollvy CA chases you, not the other way",
      visual: 'form',
      milestone: 'Draft computation shared for your review',
    },
    {
      step: 3,
      title: 'You review, approve, and Ollvy CA files',
      timeline: 'Day 4-7',
      body: "Draft ITR shared in app: income, deductions, tax computation\nYou review and approve\nFiled to Income Tax portal within 24 hours of approval",
      visual: 'checklist',
      milestone: 'ITR submitted to Income Tax portal',
    },
    {
      step: 4,
      title: 'Acknowledgement delivered',
      timeline: 'Day 7-10',
      body: "ITR-V acknowledgement generated and shared same day\nCompliance calendar updated with next year's deadline\nAll documents stored permanently",
      visual: 'stamp',
      isCompletion: true,
      milestone: 'ITR-V acknowledgement delivered',
    },
  ],

  whatsIncluded: [
    {
      title: 'Depreciation review - not just data entry',
      body: "Asset schedule and depreciation calculations reviewed\nIncorrect rates or missed depreciation on eligible assets caught\nThis directly affects your tax liability",
      comparisonWithout: 'You calculate depreciation, CA just enters it',
      comparisonWithOllvy: 'Ollvy CA reviews asset schedule and corrects rates',
    },
    {
      title: 'Director remuneration treatment',
      body: "How you split director salary vs dividends affects your tax\nRemuneration structure checked against Companies Act limits\nOverpayment relative to profits flagged",
    },
    {
      title: 'Draft review before filing',
      body: "Full draft shared before filing, including income, deductions, and tax computation\nYou review and approve in the app. Nothing goes to the portal without your sign-off",
      comparisonWithout: 'ITR filed, acknowledgement sent, no review',
      comparisonWithOllvy: 'Draft shared, you approve, then we file',
    },
    {
      title: 'Acknowledgement stored permanently',
      body: "ITR-V uploaded the moment it's generated\nStored permanently. Accessible for loans, audits, or anything else years later",
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
      title: 'Belated filing interest',
      body: 'Filed late with tax outstanding = 1%/month interest (Section 234A)\nAccrues from original deadline',
    },
    {
      icon: 'document',
      title: 'Losses cannot be carried forward if filed late',
      body: 'Filed after Oct 31 with a loss = cannot carry forward\nThat tax benefit is permanently lost',
    },
    {
      icon: 'alert',
      title: 'Audit requirement',
      body: 'Mandatory above ₹1Cr turnover (₹10Cr if cash < 5%)',
    },
  ],

  profilePersonas: [
    {
      label: 'First year after incorporation',
      detail: 'First ITR. We walk through every document required.',
    },
    {
      label: 'Changed CA mid-year',
      detail: 'Previous CA\'s books need reconciliation. We clean up and file correctly.',
    },
    {
      label: 'Company made a loss',
      detail: 'Loss return filed to preserve carry-forward rights.',
    },
    {
      label: 'Filing late',
      detail: 'We calculate interest liability upfront so there are no surprises, then file immediately.',
    },
  ],

  reviewKeywordChips: [
    '✓ Filed before deadline',
    '✓ Ollvy CA reviewed depreciation',
    '✓ Draft shared before filing',
    '✓ Acknowledgement same day',
    '✓ No surprises',
  ],

  relatedSlugs: ['director-kyc', 'mca-annual-filing', 'gst-monthly'],

  faqs: [
    {
      category: 'General',
      q: 'When is Business ITR due?',
      a: 'Pvt Ltd: October 31 (statutory audit always required). LLP without audit: July 31. LLP with audit (turnover above ₹1 crore): October 31.',
    },
    {
      category: 'General',
      q: 'What is the difference between ITR-5 and ITR-6?',
      a: 'ITR-6 for companies (Pvt Ltd, Public Ltd, OPC). ITR-5 for LLPs and partnership firms.',
    },
    {
      category: 'Process',
      q: 'What documents do I need?',
      a: 'Audited financials (P&L, Balance Sheet), trial balance, bank statements, Form 26AS, and depreciation schedule.',
    },
    {
      category: 'Process',
      q: 'Do I need a statutory audit?',
      a: 'Mandatory for all Pvt Ltd companies regardless of turnover. For LLPs: mandatory above Rs 40 lakh turnover or Rs 25 lakh contribution.',
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
    // Note: tax-audit and advance-tax services not yet available
    // Unlock items commented out until services are added
  ],

  showCompletionStats: false,
  showApprovalRate: false,
}
