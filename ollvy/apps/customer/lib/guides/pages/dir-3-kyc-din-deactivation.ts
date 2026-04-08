// lib/guides/pages/dir-3-kyc-din-deactivation.ts
import { LearnPageConfig } from '../pages';

export const dir3KycDinDeactivation: LearnPageConfig = {
  slug: 'dir-3-kyc-din-deactivation',
  title: 'DIR-3 KYC Notice: Director DIN Deactivation',
  seoTitle: 'DIN Deactivated: File DIR-3 KYC to Restore (2025) | Ollvy',
  seoDescription: 'DIN deactivation blocks all director actions. File DIR-3 KYC with Rs. 5,000 late fee to restore. Annual KYC deadline is September 30. Use DIR-3 KYC-Web for renewals if details unchanged.',
  canonicalUrl: 'https://www.ollvy.com/guides/dir-3-kyc-din-deactivation',
  lastReviewed: 'March 2025',
  category: 'ROC Notice',
  ctaServiceSlug: 'director-kyc',
  ctaSecondarySlug: 'mca-annual-filing',
  relatedServiceSlugs: ['director-kyc', 'mca-annual-filing'],
  relatedLearnSlugs: ['roc-annual-filing-default-notice'],
  relatedTools: {
    penaltyCalculators: ['mca-annual-filing', 'director-kyc'],
    documentChecklists: ['private-limited-company'],
  },
  severity: 'serious',
  deadline: 'DIR-3 KYC must be filed annually by September 30',
  deadlineNote: 'Once DIN is deactivated, you cannot sign any company documents, file any MCA forms, or appear as an active director on records - until it is restored.',

  sections: [
    {
      number: '01',
      heading: 'YOUR DIN HAS BEEN DEACTIVATED',
      body: 'Every director of an Indian company holds a Director Identification Number (DIN) issued by MCA. To keep this DIN active, you must file DIR-3 KYC (Know Your Customer verification) every year by September 30.\n\nIf you missed the September 30 deadline, the MCA system automatically deactivates your DIN. You will receive an intimation about this. Your DIN status on the MCA portal will show as "Deactivated due to non-filing of DIR-3 KYC."',
      note: 'Source: Rule 12A and 12B, Companies (Appointment and Qualification of Directors) Rules, 2014.',
    },
    {
      number: '02',
      heading: 'WHAT HAPPENS WHEN YOUR DIN IS DEACTIVATED',
      body: '',
      bullets: [
        'You cannot be reflected as an active director in any MCA filing',
        'Any MCA form you sign as director will be rejected if your DIN shows as deactivated',
        "Annual returns (AOC-4, MGT-7) cannot be filed for your company if the sole director's DIN is deactivated. This creates a cascading annual filing default",
        'Board resolutions and other company documents that require your DIN will be problematic',
        'Banks doing director due diligence will see the deactivated DIN as a compliance flag',
      ],
    },
    {
      number: '03',
      heading: 'HOW TO REACTIVATE YOUR DIN',
      body: 'Reactivation requires filing DIR-3 KYC with a late fee.',
      bullets: [
        'Late filing fee: Rs. 5,000 if filed after September 30 but before the filing opens again (typically October onwards, with fee). The fee is fixed regardless of how many days late.',
        'Documents needed for DIR-3 KYC: PAN, Aadhaar, current address proof, mobile number OTP verification, email OTP verification. If filed by a CA/CS, their digital signature is also needed.',
        'File on the MCA portal: Log in to mca.gov.in, go to the DIR-3 KYC service, complete the form with verified documents, and pay the fee.',
        'Processing time: DIN reactivation is typically immediate or within 24 hours of successful DIR-3 KYC filing with fee.',
        'Annual commitment: Once reactivated, file DIR-3 KYC every year before September 30 to avoid this happening again. It takes about 10 minutes.',
      ],
    },
    {
      number: '04',
      heading: 'DIR-3 KYC-WEB VS DIR-3 KYC: WHICH DO YOU FILE',
      body: 'There are two variants:',
      bullets: [
        'DIR-3 KYC (eForm): Full KYC for first-time filing or when your details have changed (new PAN, new address, new mobile number, etc.). Requires digital signature of a professional (CA/CS).',
        'DIR-3 KYC-Web: Annual renewal for directors whose details have not changed. A simpler web-based form requiring only OTP verification on the registered mobile and email. No professional signature needed.',
        'Most directors do DIR-3 KYC-Web for annual renewal unless there is a change in personal details. First-time KYC (when DIN was newly issued) requires the full eForm.',
      ],
    },
  ],

  faqs: [
    {
      q: 'I have 3 DINs from different periods. Do I need to file DIR-3 KYC for all of them?',
      a: 'Having more than one DIN is actually an offence under the Companies Act. If you have multiple DINs, you must surrender the additional ones and retain only one. Once surrendered, you only file KYC for the retained DIN.',
    },
    {
      q: 'I stopped being a director 2 years ago. Do I still need to file DIR-3 KYC?',
      a: 'If you have resigned from all directorial positions and are no longer a director in any company, you can request surrender of your DIN. Post-surrender, no KYC filings are needed. However, as long as your DIN is active (even if you are no longer a director), the annual KYC requirement continues.',
    },
    {
      q: "My DIN was deactivated and now the company cannot file its annual returns. Who is responsible?",
      a: "As the director whose DIN is deactivated, you are responsible for filing DIR-3 KYC to restore it. The company's filing obligations remain unchanged regardless of DIN status. Restore the DIN and then file all company returns together.",
    },
    {
      q: 'What documents do I need for DIR-3 KYC?',
      a: 'PAN, Aadhaar, current address proof (utility bill, bank statement, or passport), mobile number for OTP, and email address for OTP. If filed through a CA/CS, their digital signature is also needed.',
    },
  ],

  sources: [
    { name: 'Companies (Appointment and Qualification of Directors) Rules, 2014 (Rule 12A, 12B)', url: 'https://www.mca.gov.in', description: 'DIR-3 KYC annual requirement' },
    { name: 'MCA Portal', url: 'https://www.mca.gov.in', description: 'DIR-3 KYC filing and DIN status check' },
  ],
};
