import { ServiceConfig } from '../services'

export const companyNameChange: ServiceConfig = {
  slug: 'company-name-change',
  name: 'Company Name Change',
  shortName: 'Name Change',
  category: 'Registrations',
  tagline: 'New name. Same company. All MCA formalities handled.',

  ollvyFee: 6999,
  govtFee: 3000,
  govtFeeLabel: 'MCA filing fee',
  govtFeeNote: 'Government fee for RUN application and INC-24 filing. Paid directly to MCA.',

  slaDays: 20,
  isRetainer: false,
  serviceType: 'One-time',
  mandatoryFor: 'Private Limited Companies and One Person Companies seeking a name change',
  legalBasis: 'Companies Act 2013, Section 13 - Alteration of Memorandum',
  penaltyForMissing: undefined,
  penaltyColor: 'none',

  seoTitle: 'Company Name Change MCA India | Pvt Ltd Name Change | ₹4,999 | Ollvy',
  seoDescription:
    'Change your company name on MCA in 20 working days. Board resolution, RUN application, INC-24 filing, new Certificate of Incorporation. Fixed price ₹4,999.',
  canonicalUrl: 'https://www.ollvy.com/services/company-name-change',

  processSteps: [
    {
      step: 1,
      title: 'Answer 5 questions - CS checks name availability immediately',
      timeline: 'Day 0',
      body: "Current company name, CIN, 3 preferred new names in order of preference, reason for change, and number of directors. A company secretary is assigned within 4 hours. They run all 3 proposed names against the MCA21 registry and trademark database simultaneously - not one at a time. Unavailable names are flagged before any application is filed.",
      visual: 'checklist',
      milestone: 'CS assigned, all 3 name options checked against MCA registry',
    },
    {
      step: 2,
      title: 'Board resolution drafted and signed by all directors',
      timeline: 'Day 1-3',
      body: "Your CS drafts the board resolution approving the name change. This is not a template - it is prepared for your specific company, CIN, and proposed name. Directors download it from the app, sign on company letterhead, and upload back. All directors must sign before the RUN application can be filed.",
      visual: 'form',
      milestone: 'Board resolution signed by all directors and received',
    },
    {
      step: 3,
      title: 'RUN application filed - name reserved within 2 days',
      timeline: 'Day 3-5',
      body: "Your CS files the Reserve Unique Name application on MCA21. MCA processes RUN applications within 1-2 working days. If the first choice is approved, it is reserved for 20 days - SPICe+ RUN or INC-24 must be filed within that window. If the first choice is rejected, your CS files the second preference immediately.",
      visual: 'form',
      milestone: 'New name approved and reserved by MCA',
    },
    {
      step: 4,
      title: 'INC-24 filed with special resolution',
      timeline: 'Day 5-15',
      body: "Your CS files Form INC-24 - the main name change application - with MCA. A special resolution of shareholders is required. Your CS drafts the special resolution, shareholders sign and return, and it is attached to the INC-24 filing. MCA processes INC-24 within 7-10 working days.",
      visual: 'form',
      milestone: 'INC-24 submitted to MCA Registrar of Companies',
    },
    {
      step: 5,
      title: 'New Certificate of Incorporation issued',
      timeline: 'Day 15-20',
      body: "MCA issues a new Certificate of Incorporation with your updated company name and CIN. Your company's MOA is updated automatically. The new CoI is uploaded to your Ollvy account. Use it to update your bank accounts, GST registration, trademark, and other documents - these are separate processes not included in this service.",
      visual: 'stamp',
      isCompletion: true,
      milestone: 'New CoI issued with updated company name',
    },
  ],

  whatsIncluded: [
    {
      title: 'Name availability search',
      body: 'MCA company registry and trademark database both checked before filing to avoid rejection.',
    },
    {
      title: 'Special resolution drafting',
      body: 'Shareholder special resolution, board resolution, and EGM notice drafted per Companies Act requirements.',
    },
    {
      title: 'MOA amendment',
      body: 'Memorandum of Association updated to reflect the new name.',
    },
    {
      title: 'New Certificate of Incorporation',
      body: 'Fresh certificate issued by MCA with the new name. Your CIN, PAN, and TAN remain unchanged.',
    },
  ],

  serviceRisks: [
    {
      icon: 'alert',
      title: 'Update all downstream registrations',
      body: 'After the name change, you must update GST (core amendment), bank accounts, trademark if registered, import-export code, FSSAI if applicable, and all contracts. The MCA name change does not cascade automatically to other registrations.',
    },
    {
      icon: 'document',
      title: 'Trademark conflict',
      body: 'If someone has registered a similar trademark, MCA may reject the name or you may receive a legal notice after the change. Our trademark search reduces this risk.',
    },
  ],

  profilePersonas: [
    {
      label: 'Rebranding',
      detail: 'New brand identity. MCA name aligned with new brand.',
    },
    {
      label: 'Business pivot',
      detail: 'Core business changed. Name no longer reflects the company.',
    },
    {
      label: 'Name conflict',
      detail: 'Another company has a similar name causing confusion. Changing to a distinct name.',
    },
  ],

  reviewKeywordChips: [
    '✓ Name approved first attempt',
    '✓ CS handled everything',
    '✓ New CoI on day 18',
    '✓ Clear on what is not included',
    '✓ No surprises',
  ],

  relatedSlugs: ['pvt-ltd-incorporation', 'mca-annual-filing', 'director-kyc'],

  faqs: [
    {
      category: 'Process',
      q: 'Does my PAN or GST change when I change my company name?',
      a: 'PAN and TAN remain the same. GST requires a core amendment (name change update) - separate process but straightforward.',
    },
    {
      category: 'Process',
      q: 'Can I change the name to anything?',
      a: 'Subject to MCA availability and not containing restricted words. Name must be distinct from existing companies and trademarks.',
    },
    {
      category: 'Process',
      q: 'How long does the process take?',
      a: '20 working days from start to new Certificate of Incorporation.',
    },
    {
      category: 'Process',
      q: 'Do I need a special resolution?',
      a: 'Yes. A name change requires a special resolution (75% majority of shareholders voting in favour).',
    },
  ],

  reviewSources: [
    {
      name: 'MCA21 Portal',
      url: 'https://www.mca.gov.in',
      description: 'RUN application, INC-24, and MGT-14 filing',
    },
    {
      name: 'Companies Act, 2013',
      url: 'https://www.indiacode.nic.in/bitstream/123456789/2114/1/A2013-18.pdf',
      description: 'Section 13: Alteration of Memorandum of Association',
    },
  ],

  unlocks: [],

  showCompletionStats: false,
  showApprovalRate: false,
}
