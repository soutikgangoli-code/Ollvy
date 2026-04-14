import { ServiceConfig } from '../services'

export const fssaiLicense: ServiceConfig = {
  slug: 'fssai-license',
  name: 'FSSAI License',
  shortName: 'FSSAI',
  category: 'Licensing',
  tagline: 'Sell food legally. Display the license number on every pack.',

  ollvyFee: 7999,
  govtFee: 2000,
  govtFeeLabel: 'FSSAI license fee',
  govtFeeNote:
    'This fee is paid to the Food Safety and Standards Authority of India. Varies by license type - ₹2,000 is the standard for State License (₹12L-₹20Cr turnover). Central License is ₹7,500/year.',

  slaDays: 10,
  isRetainer: false,
  serviceType: 'One-time',
  mandatoryFor: 'All food businesses in India',
  legalBasis: 'Food Safety and Standards Act, 2006',
  penaltyForMissing: '₹10,000 + ₹100/day + seizure of goods',
  penaltyColor: 'red',

  seoTitle: 'FSSAI License Online India | Registration & State License | ₹6,999 | Ollvy',
  seoDescription:
    'Get your FSSAI license in 10 working days. Covers Registration, State, or Central License based on your turnover. Fixed price ₹6,999 (₹4,999 Ollvy + ₹2,000 govt fee).',
  canonicalUrl: 'https://www.ollvy.com/services/fssai-license',

  processSteps: [
    {
      step: 1,
      title: 'Tell us your food business type and turnover',
      timeline: 'Day 0',
      body: 'Food business type, turnover, location\nLicense type determined: Registration, State, or Central\nCompliance expert assigned within 4 hours',
      visual: 'checklist',
      milestone: 'License type determined',
    },
    {
      step: 2,
      title: 'Upload documents through the app',
      timeline: 'Day 0-1',
      body: 'Documents: registration proof, food safety plan, layout plan, equipment list, water test\nExact list sent based on your license type — not the generic one',
      visual: 'upload',
      milestone: 'Documents verified',
    },
    {
      step: 3,
      title: 'Application filed on FSSAI portal',
      timeline: 'Day 2-4',
      body: 'Form A or Form B filed on FSSAI portal\nARN generated and shared immediately',
      visual: 'form',
      milestone: 'Application submitted - ARN generated',
    },
    {
      step: 4,
      title: 'Inspection coordinated (if required)',
      timeline: 'Day 5-8',
      body: 'State/Central: premises inspection may be required\nInspection date coordinated, preparation checklist provided\nBasic Registration: no inspection needed',
      visual: 'calendar',
    },
    {
      step: 5,
      title: 'FSSAI license issued',
      timeline: 'Day 8-10',
      body: '14-digit FSSAI license issued\nPrint on all food packaging — legally required\nRenewal reminder added to compliance calendar',
      visual: 'stamp',
      milestone: 'FSSAI license active',
      isCompletion: true,
    },
  ],

  whatsIncluded: [
    {
      title: 'Correct license type determined upfront',
      body: 'There are 3 types: Registration (up to ₹12L turnover), State License (₹12L-₹20Cr), Central License (₹20Cr+ or interstate). Filing the wrong type means rejection and refiling. We determine the right one before you pay.',
      comparisonWithout: 'Guess the license type - risk rejection and delay',
      comparisonWithOllvy: 'License type verified based on turnover and geography',
    },
    {
      title: 'Application filed on FSSAI portal',
      body: 'The FSSAI portal has 20+ fields per application type. We handle the entire submission. You answer 5 questions in the app.',
      comparisonWithout: '2+ hours on FSSAI portal, frequent session timeouts',
      comparisonWithOllvy: '5 questions in app - we file the rest',
    },
    {
      title: 'Inspection preparation checklist',
      body: 'For State and Central licenses, FSSAI may inspect your premises. We provide a pre-inspection checklist: hygiene requirements, equipment labels, water storage, pest control evidence. Most businesses fail inspection for missing documentation, not actual violations.',
      mockVisualType: 'checklist',
      mockVisualData: {
        row1: '✓ Pest control certificate (last 3 months)',
        row2: '✓ Water test report from approved lab',
        row3: '✓ Equipment maintenance logs',
        row4: '✓ Staff medical fitness certificates',
        note: 'Pre-inspection checklist sent before visit',
      },
    },
    {
      title: 'Renewal reminder in your calendar',
      body: 'FSSAI licenses are valid for 1-5 years depending on fee paid. We add renewal reminders to your compliance calendar. Operating with an expired license is the same as operating without one - full penalty applies.',
      mockVisualType: 'calendar',
      mockVisualData: {
        row1: 'FSSAI License Renewal - Due Mar 2026',
        note: 'Added automatically after license issued',
      },
    },
  ],

  serviceRisks: [
    {
      icon: 'document',
      title: 'Wrong license type filed',
      body: 'Filing Registration when you need State License = rejection\nWorse: getting Registration then facing penalties for insufficient license\nTurnover verified before filing',
    },
    {
      icon: 'building',
      title: 'Premises inspection failure',
      body: 'Common failures: missing pest control cert, outdated water test, no staff medical fitness\nDocumentation issues, not actual violations\nPre-inspection checklist provided',
    },
    {
      icon: 'alert',
      title: 'Operating without license',
      body: '₹10,000 penalty + ₹100/day for operating without license\nSerious violations: goods seized and destroyed\nE-commerce platforms require FSSAI number — no number, no listing',
    },
  ],

  profilePersonas: [
    {
      label: 'Cloud kitchen / home baker',
      detail: 'Most home bakers need State License once turnover crosses ₹12L. We determine the right type.',
    },
    {
      label: 'Food manufacturer',
      detail: 'Manufacturing requires State or Central License. Inspection coordination included.',
    },
    {
      label: 'Restaurant',
      detail: 'Restaurants need State License. Dine-in, takeaway, and delivery all covered under one license.',
    },
    {
      label: 'E-commerce food seller',
      detail: 'Amazon/Flipkart require FSSAI number for listing. Registration is sufficient for most D2C food brands starting out.',
    },
  ],

  reviewKeywordChips: [
    '✓ License in 8 days',
    '✓ Inspection prep helped',
    '✓ Right license type',
    '✓ Renewal reminder set',
    '✓ Fixed price',
  ],

  relatedSlugs: ['gst-registration', 'trademark-registration', 'pvt-ltd-incorporation'],

  faqs: [
    {
      category: 'General',
      q: 'Do I need FSSAI even for a small home bakery?',
      a: 'Yes. Any food business - including home-based bakeries, cloud kitchens, or tiffin services - needs FSSAI. Below ₹12L turnover: Registration is sufficient. Above: State License required. Exemptions exist only for farmers selling raw produce directly.',
    },
    {
      category: 'General',
      q: 'What is the difference between Registration, State, and Central License?',
      a: 'Registration: up to ₹12L turnover, no inspection, valid 1-5 years. State License: ₹12L-₹20Cr turnover, may require inspection, valid 1-5 years. Central License: ₹20Cr+ or multi-state operations, inspection required.',
    },
    {
      category: 'Process',
      q: 'How long is the license valid?',
      a: '1 to 5 years - you choose at the time of application. Fees scale accordingly. We recommend 5 years to avoid annual renewal hassle. Renewal must be filed 30 days before expiry.',
    },
    {
      category: 'Process',
      q: 'What happens during inspection?',
      a: 'FSSAI official visits your premises, checks hygiene practices, reviews documentation (pest control, water test, staff medical certificates), and verifies equipment. Pass rate is high if documentation is in order. We send a checklist.',
    },
    {
      category: 'Documents',
      q: 'What documents are required?',
      a: 'Business registration proof, ID/address proof, food safety management plan, layout plan of premises, list of food items to be handled. For manufacturing: equipment list, water test report. Varies by license type - we send the exact list.',
    },
    {
      category: 'After Completion',
      q: 'Where do I display the license number?',
      a: 'On all food packaging, at the premises entrance, and on invoices. E-commerce platforms require the 14-digit number for food category listings. Format: 12345678901234.',
    },
  ],

  reviewSources: [
    {
      name: 'FSSAI',
      url: 'https://foscos.fssai.gov.in',
      description: 'Food Safety and Standards Authority of India - license portal',
    },
    {
      name: 'FSS Act, 2006',
      url: 'https://fssai.gov.in/cms/food-safety-and-standards-act-2006.php',
      description: 'Full text of the Food Safety and Standards Act',
    },
  ],

  unlocks: [
    {
      name: 'GST Registration',
      explanation: 'Mandatory once turnover crosses ₹20L for food services.',
      price: '₹8,999',
      type: 'required',
      slug: 'gst-registration',
    },
    {
      name: 'Trademark Registration',
      explanation: 'Protect your food brand name before competitors.',
      price: '₹7,999',
      type: 'beneficial',
      slug: 'trademark-registration',
    },
  ],

  showCompletionStats: false,
  showApprovalRate: false,
}
