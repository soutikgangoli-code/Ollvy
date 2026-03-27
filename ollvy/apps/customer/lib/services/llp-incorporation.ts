import { ServiceConfig } from '../services'

export const llpIncorporation: ServiceConfig = {
  slug: 'llp-incorporation',
  name: 'LLP Incorporation',
  shortName: 'LLP',
  category: 'Registrations',
  tagline: 'Limited liability. Flexible structure. Professional services-ready.',

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
      body: 'Business type, number of partners, proposed LLP name (3 options), registered state, capital contribution split. A company secretary is assigned within 4 hours. They review your answers and send you the specific document list.',
      visual: 'checklist',
      milestone: 'Company secretary assigned',
    },
    {
      step: 2,
      title: 'Upload documents through the app',
      timeline: 'Day 0-1',
      body: 'PAN and Aadhaar for all partners, registered address proof, capital contribution details. Your CS verifies each document before filing - mismatches caught here, not after MCA raises a query.',
      visual: 'upload',
      milestone: 'Documents verified by CS',
    },
    {
      step: 3,
      title: 'DPIN and DSC arranged',
      timeline: 'Day 1-3',
      body: 'Designated Partner Identification Number is required for all partners. We file DPIN applications and arrange DSC tokens. Video verification completed through guided flow in the app.',
      visual: 'form',
      milestone: 'DPIN applications filed',
    },
    {
      step: 4,
      title: 'Name reservation and FiLLiP filed',
      timeline: 'Day 4-9',
      body: 'FiLLiP is the integrated LLP incorporation form. Your CS drafts the LLP Agreement, specifies profit-sharing ratios, and files with MCA. Name reservation happens as part of FiLLiP - not separately.',
      visual: 'form',
      milestone: 'FiLLiP submitted to MCA',
    },
    {
      step: 5,
      title: 'LLPIN issued - your partnership exists',
      timeline: 'Day 10-12',
      body: 'MCA issues the Certificate of Incorporation with your LLP Identification Number. PAN is generated automatically. All documents uploaded to your account permanently. Compliance calendar populated with annual filing due dates.',
      visual: 'stamp',
      milestone: 'Certificate of Incorporation issued',
      isCompletion: true,
    },
  ],

  whatsIncluded: [
    {
      title: 'LLP Agreement drafted - not templated',
      body: 'The LLP Agreement defines profit-sharing, decision-making authority, and exit clauses. Your CS drafts this based on your actual partnership arrangement - not a boilerplate document.',
      comparisonWithout: 'Generic 50-50 template that needs amendment later',
      comparisonWithOllvy: 'Custom agreement reflecting your actual split and roles',
    },
    {
      title: 'DPIN for all designated partners',
      body: 'Every designated partner needs a DPIN. We file all applications simultaneously and track approvals. No separate charges per partner.',
      comparisonWithout: 'File DPIN separately - add 3-5 days to timeline',
      comparisonWithOllvy: 'DPIN included as part of FiLLiP - no extra time',
    },
    {
      title: 'DSC arranged - video verification guided',
      body: 'Digital Signature Certificates required for all partners. We arrange tokens and guide each partner through the video verification process. Takes 15 minutes per partner.',
      comparisonWithout: 'Navigate DSC portal yourself - 3+ hours',
      comparisonWithOllvy: 'Guided flow in app - 15 minutes',
    },
    {
      title: 'Compliance calendar auto-populated',
      body: 'Once LLPIN is issued, your calendar is updated with LLP annual return (Form 11) and Statement of Accounts (Form 8) due dates. Both are mandatory every year.',
      mockVisualType: 'calendar',
      mockVisualData: {
        row1: 'LLP Form 11 (Annual Return) - Due May 30',
        row2: 'LLP Form 8 (Statement of Accounts) - Due Oct 30',
        row3: 'Partner KYC - Due Sep 30 every year',
        note: 'Added to your calendar automatically',
      },
    },
  ],

  serviceRisks: [
    {
      icon: 'document',
      title: 'Name similarity rejection',
      body: 'LLP names must be distinct from existing LLPs and companies. "XYZ Consulting LLP" might conflict with "XYZ Consultants Pvt Ltd". We check against both registries before submission. Submit 3 distinct options.',
    },
    {
      icon: 'alert',
      title: 'Capital contribution not defined clearly',
      body: "The LLP Agreement must specify each partner's capital contribution and profit share. Vague terms cause disputes later. We draft explicit percentages based on your agreement.",
    },
    {
      icon: 'clock',
      title: 'Partner slow on DSC verification',
      body: 'FiLLiP cannot be filed until all partners complete DSC video verification. If a partner is travelling or unresponsive, it stalls everything. We send daily reminders.',
    },
  ],

  profilePersonas: [
    {
      label: 'Professional services firm',
      detail: 'Architects, lawyers, CAs, consultants - LLP is the default structure for you.',
    },
    {
      label: 'Two equal partners',
      detail: '50-50 split. Agreement drafted to handle deadlock scenarios.',
    },
    {
      label: 'Three partners, unequal contribution',
      detail: 'Different capital contributions. Profit share can match or differ.',
    },
    {
      label: 'Converting from partnership',
      detail: 'Existing partnership firm converting to LLP. Assets transfer handled.',
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
      q: 'What is an LLP?',
      a: 'A Limited Liability Partnership combines the flexibility of a partnership with the liability protection of a company. Partners have limited liability - personal assets are protected from business debts.',
    },
    {
      category: 'General',
      q: 'LLP vs Pvt Ltd - which should I choose?',
      a: "LLP if you're a professional services firm, don't plan to raise equity investment, and prefer profit-sharing over salary+dividend. Pvt Ltd if you plan to raise investment, want clearer hierarchy, or need the Pvt Ltd credibility for enterprise clients.",
    },
    {
      category: 'Process',
      q: 'How many partners are required?',
      a: 'Minimum 2 designated partners. No maximum limit. At least 2 must be resident Indians. For professional firms, this is usually not an issue.',
    },
    {
      category: 'Process',
      q: 'Can I convert my existing partnership to LLP?',
      a: 'Yes. Partnership to LLP conversion is handled through Form 17. Assets, liabilities, and partners transfer. The existing partnership firm is dissolved upon conversion. Book this separately.',
    },
    {
      category: 'Documents',
      q: 'What documents do partners need?',
      a: 'PAN card, Aadhaar card, address proof. For the LLP: registered office address proof (utility bill or NOC), capital contribution declaration. Professional firms may need practice certificate copies.',
    },
    {
      category: 'After Completion',
      q: 'What are the annual compliance requirements?',
      a: 'Form 11 (Annual Return) by May 30. Form 8 (Statement of Accounts and Solvency) by October 30. ITR-5 by October 31. All added to your Ollvy compliance calendar.',
    },
  ],

  reviewSources: [
    {
      name: 'MCA - LLP Portal',
      url: 'https://llp.mca.gov.in',
      description: 'Ministry of Corporate Affairs - LLP registration and filings',
    },
    {
      name: 'LLP Act, 2008',
      url: 'https://www.mca.gov.in/Ministry/actsbills/pdf/LLP_Act_2008_15jan2009.pdf',
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
