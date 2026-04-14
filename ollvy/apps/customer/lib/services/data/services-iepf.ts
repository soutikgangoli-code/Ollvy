import type { ServicePageConfig } from '../types'

export const iepfConsultation: ServicePageConfig = {
  slug: 'iepf-consultation',
  title: 'IEPF Claim Consultation',
  tagline: 'Old shares, unclaimed dividends, inherited investments. Find out what you have and exactly how to claim it.',

  seoTitle: 'IEPF Claim Consultation India - Unclaimed Shares and Dividends | Rs.500 | Ollvy',
  seoDescription: 'Shares in IEPF? Old dividends unclaimed? Expert finds what is there under your name and tells you exactly how to claim it back. Rs.500 flat, consultation in 2 days.',
  canonicalUrl: 'https://www.ollvy.com/services/iepf-consultation',
  lastReviewed: 'April 2026',
  category: 'Legal',

  explainer: {
    whatItIs:
      'IEPF stands for Investor Education and Protection Fund. Under the Companies Act, if dividends on a shareholder account go unclaimed for 7 consecutive years, the company must transfer those dividends to this government fund. The shares on which those dividends went unclaimed are transferred alongside. The money does not disappear permanently, but recovering it requires filing a claim form through the company and then the IEPF Authority.',

    whyYouNeedIt:
      'Most people who contact us do not know whether their shares are in IEPF, how much is there, or what the process looks like for their case. A direct claim by the original investor is completely different from a legal heir claim. Physical share certificates have different requirements than demat holdings. This consultation answers all of it before you spend weeks filing paperwork that turns out to be wrong.',

    whatHappensWithout:
      'There is no deadline to claim from IEPF. But the paperwork gets harder over time. Companies change their share transfer agents. Physical certificates deteriorate. If the original investor has passed away, each year without action adds documents to the legal heir process. Starting with a clear picture costs Rs.500 and takes 2 days.',
  },

  workflow: [
    {
      step: 1,
      title: 'Tell us about your case',
      timeframe: 'Day 0',
      description: 'Company name, year of investment, folio number if you have it. Physical certificates or old dividend warrants if they exist. No documents needed upfront.',
      milestone: 'Brief received. Expert assigned.',
    },
    {
      step: 2,
      title: 'Expert checks the IEPF database',
      timeframe: 'Day 0-1',
      description: 'Expert searches the IEPF portal and government company records using your PAN, name, and company details. Confirms what is actually credited in IEPF under your name before the call.',
      milestone: 'IEPF balance confirmed',
    },
    {
      step: 3,
      title: '45-minute consultation call',
      timeframe: 'Day 1-2',
      description: 'Covers what is claimable, what IEPF-5 looks like for your case, and which documents you need. Legal heir claim? Covered separately - different requirements from a direct claim.',
      milestone: 'Consultation complete',
    },
    {
      step: 4,
      title: 'Written action plan',
      timeframe: 'Day 2',
      description: 'Written summary of the call plus a personalised IEPF-5 document checklist for your case. Not the generic 18-item government list.',
      milestone: 'Action plan in your order page',
    },
  ],

  included: [
    {
      title: 'IEPF database check',
      description: 'Expert searches the IEPF portal and government company records using your PAN and company details. Confirms exactly which shares and dividend amounts are credited under your name.',
      without: 'Hours across government portals and the company\'s share transfer agent with no guarantee of finding the right entry.',
      withOllvy: 'Confirmed in under 24 hours before the call.',
    },
    {
      title: '45-minute expert call - your case only',
      description: 'Expert walks through Form IEPF-5 for your specific situation. Simple direct claim: you hear that and get next steps. Complex inherited or physical certificate case: every step mapped out. No generic script.',
    },
    {
      title: 'Personalised document checklist',
      description: 'Your checklist has 5 to 9 items in plain language. The government list has 18 items written for lawyers. Yours covers only what your case actually requires.',
    },
    {
      title: 'Written action plan with timeline',
      description: 'Delivered to your order page after the call. Covers what is claimable, what to file, in what order, and what to expect on timeline.',
    },
  ],

  risks: [
    {
      title: 'IEPF-5 rejected for a data mismatch',
      description: 'The claim form requires folio number, demat account details, and company registration number exactly matching government records. One mismatch causes rejection at the company\'s verification stage, which you find out about 4 to 6 weeks later.',
    },
    {
      title: 'PAN not linked to the folio',
      description: 'IEPF credits are matched against PAN. If the original shareholder PAN is not linked to the folio, the claim stalls. For inherited claims, your PAN must match legal heir records at the company.',
    },
    {
      title: 'Legal heirs filing before completing share transmission',
      description: 'If shares are in physical form, they must be transmitted into your name before IEPF-5 is filed. Filing before transmission is the most common and most costly mistake in inherited share claims.',
    },
    {
      title: 'Physical certificates have extra requirements',
      description: 'Physical shares need an affidavit and indemnity bond on top of standard documents. Lost certificates need a duplicate from the company\'s share transfer agent, which is a separate process with its own timeline.',
    },
  ],

  personas: [
    {
      title: 'Found old share certificates at home',
      description: 'Physical certificates from the 1990s or early 2000s. Not sure if the company still exists in the same form, whether shares went to IEPF, or how to start.',
    },
    {
      title: 'Inherited shares after a parent passed away',
      description: 'Shares existed in a parent name. Formal transmission never happened. The IEPF process for legal heirs has extra steps most people miss.',
    },
    {
      title: 'Received a company letter about IEPF',
      description: 'The company sent notice that dividends have been or will be transferred to IEPF. You want to know what this means and what to do.',
    },
    {
      title: 'NRI with old Indian investments',
      description: 'You or your parents held shares in Indian companies before moving abroad. Dividends went unclaimed for years and may now be in IEPF.',
    },
  ],

  faqs: [
    { category: 'General', q: 'What is IEPF and how did my shares end up there?', a: 'IEPF stands for Investor Education and Protection Fund, created under the Companies Act 2013. If dividends on a shareholder account go unclaimed for 7 consecutive years, the company must transfer those dividends to IEPF. The shares on which those dividends went unclaimed are transferred alongside. This happens automatically. Most shareholders find out only when looking for old investments or receiving a company notice.' },
    { category: 'General', q: 'How do I check if my shares are in IEPF?', a: 'You can search on the IEPF portal using the company registration number and folio number, or on the government company records portal. Most people search and find nothing - not because there is nothing, but because the search needs precise inputs that are easy to get wrong. The consultation includes running this search correctly before the call.' },
    { category: 'General', q: 'Can I get the money back?', a: 'Yes. Transfer to IEPF is not forfeiture. You can file Form IEPF-5 at any time. There is no deadline. The refund takes 60 to 90 days from a complete application.' },
    { category: 'General', q: 'Do I get the shares back or just the dividends?', a: 'Both. One IEPF-5 application covers the shares and all accumulated unclaimed dividends. Shares go to your demat account. Dividends go to your bank account.' },
    { category: 'Process', q: 'What does the Rs.500 consultation cover?', a: 'Expert checks what is in IEPF under your name, then does a 45-minute call covering your case - what is claimable, what IEPF-5 involves for you, which documents you need, and realistic timeline. You get a written action plan and personalised document checklist. Filing IEPF-5 is a separate service.' },
    { category: 'Process', q: 'What is the IEPF claim form?', a: 'The claim form is filed online by the shareholder or their legal heir. After filing, you courier physical documents to the company\'s designated officer. The company verifies and forwards the claim to the IEPF Authority, which processes the share and dividend refund.' },
    { category: 'Process', q: 'How long does the full IEPF claim take?', a: '60 to 90 days from filing if the company\'s share transfer agent is responsive. Physical certificate and legal heir claims typically take longer. The consultation tells you what to expect for your company specifically.' },
    { category: 'Documents', q: 'What documents does IEPF-5 require?', a: 'Depends on your case. Original investor with demat: PAN, Aadhaar, cancelled cheque, client master report from broker. Physical shares: add share certificate, affidavit, indemnity bond. Legal heir: add death certificate, heirship or succession certificate, transmission documents. The consultation gives you your specific list.' },
    { category: 'Documents', q: 'I cannot find the original share certificate. Can I still claim?', a: 'Possibly. If shares are in IEPF, they exist as a government entry regardless of the physical certificate. Many companies accept an indemnity bond instead. Whether this applies to your company is covered in the consultation.' },
    { category: 'Pricing', q: 'Is there a government fee to file IEPF-5?', a: 'No. Filing IEPF-5 and claiming from IEPF is free of government fees. Case-specific costs can arise - court fees for a succession certificate, stamp duty on an indemnity bond. The consultation flags any that apply.' },
    { category: 'Pricing', q: 'What is the difference between this consultation and the full IEPF filing service?', a: 'This consultation tells you what is claimable and what the process looks like for your case. You leave with a document checklist and action plan. Filing the claim form, coordinating with the company\'s designated officer, and following up with the IEPF Authority is a longer engagement handled separately.' },
  ],

  govtFees: {
    caption: 'Government fees for IEPF claims',
    headers: ['Item', 'Government Fee', 'Notes'],
    rows: [
      ['Claim form filing', 'Nil', 'No fee to file the claim form'],
      ['Dividend refund from IEPF', 'Nil', 'Credited to your bank account'],
      ['Share refund from IEPF', 'Nil', 'Credited to your demat account'],
      ['Succession certificate (if needed)', 'Court fee, varies by state', 'Only if there is no registered will and no legal heirship certificate issued by local authority'],
      ['Stamp duty on indemnity bond', 'Rs.100 to Rs.500', 'Only if original share certificate is lost. Amount varies by state.'],
    ],
  },

  documents: {
    caption: 'Documents typically needed - exact list depends on your case',
    headers: ['Document', 'Original Investor (Living)', 'Legal Heir (Deceased Original Holder)'],
    rows: [
      ['PAN card', 'Self-attested copy', 'Claimant PAN, self-attested'],
      ['Aadhaar card', 'Address proof', 'Claimant Aadhaar'],
      ['Share certificate', 'Required if shares are physical', 'Required if shares are physical'],
      ['Demat account proof', 'Client master report from broker', 'Claimant client master report'],
      ['Cancelled cheque', 'Account where refund is deposited', 'Claimant bank account'],
      ['Death certificate', 'Not applicable', 'Original holder death certificate'],
      ['Legal heirship or succession certificate', 'Not applicable', 'Issued by court or state authority'],
      ['Share transmission request to the company', 'Not applicable', 'Must be done before filing the claim for physical shares'],
      ['Indemnity bond', 'Only if original certificate is lost', 'Only if original certificate is lost'],
    ],
  },

  relatedServiceSlugs: ['gst-registration', 'trademark-registration', 'pvt-ltd-incorporation'],
}
