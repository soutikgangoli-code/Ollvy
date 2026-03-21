import { ServiceConfig } from '../services'

export const companyNameChange: ServiceConfig = {
  slug: 'company-name-change',
  name: 'Company Name Change',
  shortName: 'Name Change',
  category: 'Registrations',
  tagline: 'Change your company name on MCA. New certificate in 20 working days.',

  ollvyFee: 3999,
  govtFee: 1000,
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
  canonicalUrl: 'https://ollvy.com/services/company-name-change',

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
      title: '3 name preferences checked simultaneously',
      body: "We check all 3 proposed names against the MCA21 registry and trademark database before filing any of them. Most CAs submit one name and wait for rejection before trying the next - adding 3-5 days per rejection. We do all 3 in parallel so the RUN application goes in with the best available option.",
      comparisonWithout: 'Submit first name, wait 2 days for rejection, repeat',
      comparisonWithOllvy: '3 names checked simultaneously - faster to first approval',
    },
    {
      title: 'Board and special resolutions drafted by CS - not templated',
      body: "Two separate resolutions are required: board resolution (directors approving the name change) and special resolution (shareholders approving). Your CS drafts both for your specific company. Directors and shareholders download from the app, sign, and return. No legal drafting on your part.",
    },
    {
      title: 'RUN + INC-24 + MGT-14 - all forms handled',
      body: "Three separate MCA filings are required for a name change: RUN (name reservation), INC-24 (name change application), and MGT-14 (registration of special resolution). Your CS handles all three in the correct sequence.",
      comparisonWithout: 'Navigate MCA21 portal for 3 different forms in sequence',
      comparisonWithOllvy: 'CS handles all 3 - you just sign the resolutions',
    },
    {
      title: 'New Certificate of Incorporation delivered',
      body: "The new CoI is uploaded to your Ollvy account permanently. It carries your updated company name with the same CIN. Note: the name change on MCA does not automatically update your GST registration, bank accounts, or trademark. Each of these requires a separate amendment.",
    },
  ],

  serviceRisks: [
    {
      icon: 'document',
      title: 'MCA may reject all 3 name preferences',
      body: "MCA rejects names too similar to existing companies, containing restricted words (Bank, Finance, National, Exchange, etc.), or misleading about the business activity. If all 3 preferences are rejected, your CS will suggest 3 alternatives based on the rejection reasons. One additional round of filing is within scope.",
    },
    {
      icon: 'alert',
      title: 'Name change does not update downstream registrations',
      body: "After MCA issues the new CoI, your GST registration, bank accounts, trademark, IEC, and all contracts still reflect the old name. Each requires a separate amendment process. These are not part of this service - but we can advise on sequencing.",
    },
    {
      icon: 'clock',
      title: 'All directors must sign - delays if one is unavailable',
      body: "INC-24 cannot be filed until all directors have signed the board resolution. If a director is travelling or slow to respond, it stalls the entire application. Your CS tracks completion and follows up daily.",
    },
  ],

  profilePersonas: [
    {
      label: 'Rebranding the business',
      detail: 'Old name no longer reflects what the company does. MCA filing handled - downstream updates are separate.',
    },
    {
      label: 'Placeholder name at incorporation',
      detail: 'Used a temporary name when incorporating and now want to formalise. Common situation - clean process.',
    },
    {
      label: 'Post-acquisition or merger',
      detail: 'Company is being absorbed into a new brand. Name change as part of the corporate restructuring.',
    },
    {
      label: 'Name causing market confusion',
      detail: 'Too similar to a competitor. We file 3 distinct alternatives to maximise first-attempt approval.',
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
      category: 'General',
      q: 'Can any Pvt Ltd or OPC change its name?',
      a: "Yes, any Pvt Ltd or OPC can change its name under Section 13 of the Companies Act. The new name must be approved by MCA, cannot be identical or deceptively similar to an existing registered company, and cannot contain restricted words without prior approval.",
    },
    {
      category: 'General',
      q: 'What happens to my CIN after the name change?',
      a: "Your CIN stays the same. Only the name in the CIN changes - the number is unchanged. Your company's history, contracts, and tax records are all continuous. There is no break in the entity.",
    },
    {
      category: 'Process',
      q: 'What if MCA rejects my preferred names?',
      a: "Your CS will notify you immediately with the rejection reason and suggest 3 alternatives. We refile at no extra charge. One additional round of filing is within scope. Rejections add 3-5 days per round.",
    },
    {
      category: 'Process',
      q: 'How long does the name change take?',
      a: "20 working days end to end - 2 days for RUN approval, 7-10 days for INC-24 processing, 2-3 days for new CoI issuance. The timeline depends on MCA processing speed (which Ollvy cannot control) and how quickly directors sign the resolutions.",
    },
    {
      category: 'Process',
      q: 'Do I need to update my GST registration after the name change?',
      a: "Yes. Your GST registration will still show the old company name until you file a GST amendment. This is a separate process. Banks, vendors, and clients may flag the mismatch until it is updated.",
    },
    {
      category: 'Documents',
      q: 'What do I need to provide?',
      a: "Your Certificate of Incorporation, company PAN, and MOA. Your CS handles all the resolutions, MCA filings, and follow-up.",
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
      url: 'https://www.mca.gov.in/Ministry/pdf/CompaniesAct2013.pdf',
      description: 'Section 13: Alteration of Memorandum of Association',
    },
  ],

  unlocks: [],

  showCompletionStats: false,
  showApprovalRate: false,
}
