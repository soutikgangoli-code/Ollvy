import { ServiceConfig } from '../services'

export const iecCode: ServiceConfig = {
  slug: 'iec-code',
  name: 'IEC Code (Import Export Code)',
  shortName: 'IEC',
  category: 'Licensing',
  tagline: 'Export from India. Import to India. This is the license.',

  ollvyFee: 6999,
  govtFee: 500,
  govtFeeLabel: 'DGFT application fee',
  govtFeeNote:
    'This fee is paid to the Directorate General of Foreign Trade (DGFT). Fixed at ₹500 for all applicants.',

  slaDays: 5,
  isRetainer: false,
  serviceType: 'One-time',
  mandatoryFor: 'All businesses importing or exporting goods',
  legalBasis: 'Foreign Trade Policy 2023, Chapter 2',
  penaltyForMissing: 'Shipment held at customs + penalty up to 3x duty',
  penaltyColor: 'amber',

  seoTitle: 'IEC Code Registration Online India | Import Export Code | ₹4,499 | Ollvy',
  seoDescription:
    'Get your Import Export Code (IEC) in 5 working days. Required for all imports and exports. Fixed price ₹4,499 (₹3,999 Ollvy + ₹500 govt fee). CA assigned same day.',
  canonicalUrl: 'https://www.ollvy.com/services/iec-code',

  processSteps: [
    {
      step: 1,
      title: 'Share your business details',
      timeline: 'Day 0',
      body: 'Business type, GST number, bank account details\nCompliance expert assigned within 4 hours\nIEC requires a current account in the business name',
      visual: 'checklist',
      milestone: 'Compliance expert assigned',
    },
    {
      step: 2,
      title: 'Upload documents through the app',
      timeline: 'Day 0-1',
      body: 'Business PAN, incorporation certificate, cancelled cheque or bank statement\nVerified before filing — mismatches caught early',
      visual: 'upload',
      milestone: 'Documents verified',
    },
    {
      step: 3,
      title: 'Application filed on DGFT portal',
      timeline: 'Day 1-2',
      body: 'Application filed on DGFT portal\nAadhaar OTP required for authorized signatory — guided through',
      visual: 'form',
      milestone: 'Application submitted to DGFT',
    },
    {
      step: 4,
      title: 'IEC issued - you can trade internationally',
      timeline: 'Day 3-5',
      body: '10-digit IEC issued — valid for life, no renewal\nCertificate uploaded to your account\nCustoms clearance enabled for imports and exports',
      visual: 'stamp',
      milestone: 'IEC certificate issued',
      isCompletion: true,
    },
  ],

  whatsIncluded: [
    {
      title: 'Filed on DGFT portal - not an outdated form',
      body: 'IEC is now issued exclusively online through DGFT. The portal requires careful data entry - PAN, Aadhaar, bank details must match exactly. We handle the submission, you do the OTP.',
      comparisonWithout: 'Navigate DGFT portal - 2+ hours, frequent errors',
      comparisonWithOllvy: 'We file - you verify OTP - IEC in 5 days',
    },
    {
      title: 'Bank account verification guidance',
      body: 'IEC requires a cancelled cheque or bank statement with business name, account number, and IFSC clearly visible. Many applications fail because the account is in the proprietor\'s personal name, not the business name. We verify this before filing.',
      comparisonWithout: 'Rejection due to bank account mismatch',
      comparisonWithOllvy: 'Bank account verified before submission',
    },
    {
      title: 'Lifetime validity - no renewal',
      body: 'IEC is valid for life. Unlike GST or FSSAI, there is no annual renewal. However, you must update your IEC profile if business details change (address, bank account, directors). We can handle updates for ₹999.',
    },
    {
      title: 'Ready to use at customs',
      body: 'Once issued, your IEC is active immediately in the ICEGATE customs system. You can file bills of entry (imports) and shipping bills (exports). No additional registration required.',
      mockVisualType: 'status',
      mockVisualData: {
        row1: 'IEC: 0123456789',
        row2: 'Status: Active on ICEGATE ✓',
        row3: 'Valid: Lifetime',
        note: 'Ready for import/export clearance',
      },
    },
  ],

  serviceRisks: [
    {
      icon: 'document',
      title: 'Bank account in personal name',
      body: 'IEC requires current account in business name\nProprietor savings account won\'t work\nVerified before filing',
    },
    {
      icon: 'mismatch',
      title: 'PAN-Aadhaar name mismatch',
      body: 'PAN and Aadhaar names must match exactly\nMiddle name variations cause OTP failure\nMismatch must be fixed before filing',
    },
    {
      icon: 'alert',
      title: 'Importing without IEC',
      body: 'No IEC = shipment held at customs\nDemurrage accrues daily, penalties up to 3x duty\nGet IEC before your first shipment',
    },
  ],

  profilePersonas: [
    {
      label: 'First international shipment',
      detail: 'New exporter or importer. IEC takes 5 days - plan accordingly.',
    },
    {
      label: 'E-commerce cross-border seller',
      detail: 'Selling internationally via Amazon Global/Shopify. IEC is mandatory.',
    },
    {
      label: 'Importing raw materials',
      detail: 'Manufacturing business importing components. IEC needed for customs clearance.',
    },
    {
      label: 'Freelancer receiving foreign payments',
      detail: 'For service exports (software, design), IEC is optional but helps with bank compliance for foreign remittances.',
    },
  ],

  reviewKeywordChips: [
    '✓ IEC in 4 days',
    '✓ Bank issue caught early',
    '✓ Lifetime validity',
    '✓ Fixed price',
    '✓ OTP guidance clear',
  ],

  relatedSlugs: ['gst-registration', 'pvt-ltd-incorporation', 'trademark-registration'],

  faqs: [
    {
      category: 'General',
      q: 'Do I need IEC to receive foreign payments for services?',
      a: 'No. IEC is for goods (imports/exports). Service exports (software, consulting, design) do not require IEC. However, having an IEC can help with bank compliance when receiving large foreign remittances.',
    },
    {
      category: 'General',
      q: 'Is IEC required for personal imports?',
      a: 'No. Personal imports (gifts, personal use items) do not require IEC. IEC is for businesses engaged in commercial import/export of goods.',
    },
    {
      category: 'Process',
      q: 'How long is IEC valid?',
      a: 'Lifetime. IEC does not expire. However, you must update your profile if business details change - address, bank account, authorized signatory. We can handle updates for ₹999.',
    },
    {
      category: 'Process',
      q: 'Can I get IEC for a proprietorship?',
      a: 'Yes. Sole proprietorships can get IEC. The IEC will be in the proprietor\'s name with the business/trade name. Bank account should be a current account in the business name.',
    },
    {
      category: 'Documents',
      q: 'What documents are required?',
      a: 'PAN card of the business entity, incorporation certificate (for companies/LLPs), cancelled cheque or bank statement (showing account holder name, number, IFSC), Aadhaar of authorized signatory for OTP.',
    },
    {
      category: 'After Completion',
      q: 'How do I use IEC at customs?',
      a: 'Your IEC is automatically registered with ICEGATE (customs EDI system). Quote your 10-digit IEC on all bills of entry (imports) and shipping bills (exports). Your customs broker or freight forwarder will need this number.',
    },
  ],

  reviewSources: [
    {
      name: 'DGFT',
      url: 'https://dgft.gov.in',
      description: 'Directorate General of Foreign Trade - IEC registration portal',
    },
    {
      name: 'Foreign Trade Policy 2023',
      url: 'https://dgft.gov.in/CP/?opt=ftp-2023',
      description: 'Current Foreign Trade Policy governing IEC and export schemes',
    },
  ],

  unlocks: [
    {
      name: 'GST Registration',
      explanation: 'Required for claiming GST refunds on exports.',
      price: '₹8,999',
      type: 'required',
      slug: 'gst-registration',
    },
    {
      name: 'Trademark Registration',
      explanation: 'Protect your brand before exporting internationally.',
      price: '₹7,999',
      type: 'beneficial',
      slug: 'trademark-registration',
    },
  ],

  showCompletionStats: false,
  showApprovalRate: false,
}
