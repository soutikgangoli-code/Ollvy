import { ServiceConfig } from '../services'

export const llpIncorporation: ServiceConfig = {
  slug: 'llp-incorporation',
  name: 'LLP Incorporation',
  shortName: 'LLP',
  category: 'Registrations',
  tagline: 'Limited liability. Flexible profit-sharing. Lower compliance than Pvt Ltd.',

  ollvyFee: 19999,
  govtFee: 5000,
  govtFeeLabel: 'MCA filing fees',
  govtFeeNote:
    'This fee is paid directly to the Ministry of Corporate Affairs. Varies slightly by capital contribution - ₹5,000 is the standard for up to ₹1L contribution.',

  slaDays: 12,
  isRetainer: false,
  serviceType: 'One-time',
  mandatoryFor: 'Professionals, consultants, and service firms',
  legalBasis: 'Limited Liability Partnership Act, 2008',
  penaltyForMissing: undefined,
  penaltyColor: 'none',

  seoTitle: 'LLP Registration Online India | ₹12,999 | Ollvy',
  seoDescription:
    'Register your Limited Liability Partnership in India. Includes DPIN, DSC, name reservation, and LLP Agreement. Fixed price ₹12,999 (₹7,999 Ollvy + ₹5,000 MCA).',
  canonicalUrl: 'https://www.ollvy.com/services/llp-incorporation',

  processSteps: [
    {
      step: 1,
      title: 'Answer questions - we build your checklist',
      timeline: 'Day 0',
      body: 'Business type, number of partners, proposed LLP name (3 options), registered state, capital contribution split. A company secretary is assigned within 4 hours.',
      visual: 'checklist',
      milestone: 'CS assigned, checklist sent',
    },
    {
      step: 2,
      title: 'Upload documents through the app',
      timeline: 'Day 0-1',
      body: 'PAN and Aadhaar for all partners, registered address proof, capital contribution details. CS verifies every document before filing.',
      visual: 'upload',
      milestone: 'Documents verified by CS',
    },
    {
      step: 3,
      title: 'DPIN and DSC arranged',
      timeline: 'Day 1-3',
      body: 'Designated Partner Identification Number is required for all partners. We file applications and arrange DSC tokens with guided video verification.',
      visual: 'form',
      milestone: 'DPIN and DSC ready',
    },
    {
      step: 4,
      title: 'FiLLiP filed - LLP Agreement, PAN in one submission',
      timeline: 'Day 4-9',
      body: 'FiLLiP is the integrated LLP incorporation form. Your CS drafts the LLP Agreement based on your actual partner arrangement and files with MCA.',
      visual: 'form',
      milestone: 'FiLLiP submitted to MCA',
    },
    {
      step: 5,
      title: 'LLPIN issued',
      timeline: 'Day 10-12',
      body: 'MCA issues the Certificate of Incorporation with your LLP Identification Number. PAN is generated automatically. All documents uploaded to your account.',
      visual: 'stamp',
      milestone: 'Certificate of Incorporation issued',
      isCompletion: true,
    },
  ],

  whatsIncluded: [
    {
      title: 'LLP Agreement drafted - not templated',
      body: 'The agreement defines profit-sharing, decision-making, capital contribution, and exit terms. Drafted based on your actual arrangement - not a generic 50-50 template.',
      comparisonWithout: 'Generic template - disputes arise later',
      comparisonWithOllvy: 'Custom agreement reflecting your actual split and roles',
    },
    {
      title: 'DPIN for all designated partners',
      body: 'Every designated partner needs a DPIN. We file all applications simultaneously.',
    },
    {
      title: 'DSC arranged - video verification guided',
      body: 'DSC required for all partners. We arrange tokens and guide video verification in the app.',
    },
    {
      title: 'Compliance calendar auto-populated',
      body: 'Once LLPIN is issued, your calendar shows Form 11 (annual return, due May 30) and Form 8 (statement of accounts, due Oct 30).',
      mockVisualType: 'calendar',
      mockVisualData: {
        row1: 'LLP Form 11 (Annual Return) - Due May 30',
        row2: 'LLP Form 8 (Statement of Accounts) - Due Oct 30',
        note: 'Added to your calendar automatically',
      },
    },
  ],

  serviceRisks: [
    {
      icon: 'document',
      title: 'Name similarity rejection',
      body: 'LLP names must be distinct from existing LLPs and companies. We check both registries before submission.',
    },
    {
      icon: 'alert',
      title: 'LLP Agreement must reflect actual terms',
      body: 'Vague profit-sharing or unclear exit clauses are the most common source of partner disputes. We draft explicit percentages and terms.',
    },
    {
      icon: 'clock',
      title: 'All partners must complete DSC verification',
      body: 'FiLLiP cannot be filed until every partner completes video verification. We send daily reminders.',
    },
  ],

  profilePersonas: [
    {
      label: 'Professional services firm',
      detail: 'CA firms, law firms, architects, consultants - LLP is the natural fit.',
    },
    {
      label: 'Two equal partners',
      detail: '50-50 split. Agreement drafted to handle deadlock scenarios.',
    },
    {
      label: 'Three partners, unequal contribution',
      detail: 'Different capital, different profit share. We draft it exactly.',
    },
    {
      label: 'Converting from partnership',
      detail: 'Existing firm converting to LLP. We handle the transition.',
    },
  ],

  reviewKeywordChips: [
    '✓ Agreement was custom',
    '✓ LLPIN in 11 days',
    '✓ CS explained profit split',
    '✓ No hidden fees',
    '✓ Calendar setup included',
  ],

  relatedSlugs: ['gst-registration', 'business-itr', 'trademark-registration'],

  faqs: [
    {
      category: 'General',
      q: 'LLP vs Pvt Ltd - which should I choose?',
      a: 'LLP if you are a professional services firm, do not plan to raise equity investment, and want lower compliance costs. Pvt Ltd if you plan to raise funding, issue ESOPs, or need share-based ownership structure. See our full comparison guide.',
    },
    {
      category: 'General',
      q: 'Can I convert an LLP to Pvt Ltd later?',
      a: 'Yes, under Section 366 of the Companies Act, 2013. It involves multiple MCA filings, stamp duty, and a valuation exercise - typically 3-6 months. If funding is even a possibility in the next 3 years, start as Pvt Ltd.',
    },
    {
      category: 'Process',
      q: 'How many partners are required?',
      a: 'Minimum 2 designated partners. No maximum. At least 2 must be Indian residents.',
    },
    {
      category: 'Process',
      q: 'Does an LLP need to hold board meetings?',
      a: 'No. LLPs have no requirement for formal board or general meetings. Partners decide as agreed in the LLP Agreement.',
    },
    {
      category: 'Documents',
      q: 'What documents do partners need?',
      a: 'PAN card, Aadhaar card, address proof. For the LLP: registered office address proof.',
    },
    {
      category: 'After Completion',
      q: 'What are the annual compliance requirements?',
      a: 'Form 11 (Annual Return) by May 30 every year. Form 8 (Statement of Accounts and Solvency) by October 30 every year. ITR-5 by July 31 if no tax audit is required, or October 31 if tax audit applies (turnover above Rs 1 crore). No mandatory statutory audit below Rs 40 lakh turnover and Rs 25 lakh contribution.',
    },
  ],

  reviewSources: [
    {
      name: 'MCA - LLP Portal',
      url: 'https://www.mca.gov.in/content/mca/global/en/mca/llp-e-filling.html',
      description: 'Ministry of Corporate Affairs - LLP registration and filings',
    },
    {
      name: 'LLP Act, 2008',
      url: 'https://www.indiacode.nic.in/bitstream/123456789/2023/1/A2009-06.pdf',
      description: 'Full text of the Limited Liability Partnership Act',
    },
  ],

  unlocks: [
    {
      name: 'GST Registration',
      explanation: 'Required once turnover crosses ₹20L for services.',
      price: '₹8,999',
      type: 'required',
      slug: 'gst-registration',
    },
    {
      name: 'Business ITR (ITR-5)',
      explanation: 'LLPs file ITR-5 by October 31 every year.',
      price: '₹11,999',
      type: 'required',
      slug: 'business-itr',
    },
    {
      name: 'Trademark Registration',
      explanation: 'Protect your firm name and service marks.',
      price: '₹7,999',
      type: 'beneficial',
      slug: 'trademark-registration',
    },
  ],

  showCompletionStats: false,
  showApprovalRate: false,
}
