// lib/guides/pages/income-tax-ais-sft-notice.ts
import { LearnPageConfig } from '../pages';

export const incomeTaxAisSftNotice: LearnPageConfig = {
  slug: 'income-tax-ais-sft-notice',
  title: 'Income Tax AIS / SFT High-Value Transaction Notice',
  seoTitle: 'Income Tax AIS / High Value Transaction Notice 2025 | Ollvy',
  seoDescription: 'Got a notice about a high-value transaction in your AIS or SFT? Understand what the department has found, whether it is taxable, and how to respond.',
  canonicalUrl: 'https://www.ollvy.com/guides/income-tax-ais-sft-notice',
  lastReviewed: 'March 2025',
  category: 'Income Tax Notice',
  ctaServiceSlug: 'business-itr',
  ctaSecondarySlug: undefined,
  relatedServiceSlugs: ['itr-notice-response', 'itr-filing'],
  relatedLearnSlugs: ['income-tax-148-148a-reopening', 'income-tax-143-2-scrutiny', 'income-tax-142-1-notice'],
  relatedTools: {
    penaltyCalculators: ['itr-late-filing'],
    documentChecklists: ['business-itr', 'individual-itr'],
  },
  severity: 'serious',
  deadline: 'Varies - typically 15-30 days if a formal notice',
  deadlineNote: 'Some of these arrive as informal emails or SMS. Do not ignore them - they almost always precede formal notices.',

  sections: [
    {
      number: '01',
      heading: 'THE DEPARTMENT HAS YOUR TRANSACTION DATA AND IS ASKING ABOUT IT',
      body: 'The income tax department now receives detailed financial information about you from dozens of sources: banks, stock exchanges, mutual fund houses, property registrars, foreign exchange dealers, insurance companies, and more. This data flows through two systems: the Annual Information Statement (AIS) and the Statement of Financial Transactions (SFT / Form 61A).\n\nWhen a transaction appears in your AIS and does not show up in your filed income tax return - or the income tax return shows much lower income than the transaction data suggests - the department sends you a communication asking for an explanation.',
      note: 'Source: Section 285BA, Income Tax Act, 1961 (SFT obligations of reporting entities). AIS launched 2021 as an expansion of Form 26AS.',
    },
    {
      number: '02',
      heading: 'WHAT KIND OF TRANSACTIONS GET REPORTED',
      body: 'Under SFT rules, these entities are required to report high-value transactions to the income tax department:',
      bullets: [
        'Banks: Cash deposits of Rs. 10 lakh or more in savings accounts; Rs. 50 lakh or more in current accounts in a financial year',
        'Credit card companies: Payments of Rs. 1 lakh or more in cash, or Rs. 10 lakh or more in aggregate against credit card bills',
        'Mutual fund houses: Investments of Rs. 10 lakh or more in mutual fund units',
        'Stockbrokers / NSE / BSE: Share transactions totalling Rs. 10 lakh or more',
        'Property registrars: Sale or purchase of immovable property of Rs. 30 lakh or more',
        'Foreign exchange dealers / FFMC: Foreign currency transactions (outward remittances, forex purchases) of Rs. 10 lakh or more',
        'LIC and other insurers: Receipt of cash payment of Rs. 10 lakh or more as premium',
        'NBFCs and cooperative banks: Fixed deposit receipts of Rs. 10 lakh or more',
      ],
      note: 'Every transaction above these thresholds appears in your AIS - linked to your PAN. The data is available to both you and the income tax department.',
    },
    {
      number: '03',
      heading: 'HOW TO RESPOND',
      body: 'Your response depends on the nature of the transaction and whether it was correctly reflected in your ITR:',
      bullets: [
        'Transaction was correctly reported in your ITR: Simply provide the reference - the schedule, amount, and treatment in your return. The matter typically closes here.',
        'Transaction was not reported because it is not taxable income: Explain and document. Examples: a loan receipt (not income), sale of shares at a loss, gift received from relatives, proceeds from selling household goods.',
        'Transaction was taxable and was not reported: The most uncomfortable situation. You will need to assess whether to file a revised return (if within the deadline) or a belated return, and pay tax with interest. Proactive disclosure is almost always better than waiting for a formal demand.',
        'Transaction data in AIS is wrong: This happens. Banks and other entities sometimes file SFT data incorrectly. You can submit a response on the AIS/26AS portal flagging the transaction as incorrect, with documentary evidence.',
      ],
    },
    {
      number: '04',
      heading: 'THE FORMAL NOTICE THAT FOLLOWS',
      body: 'If you do not respond to the initial AIS communication or if your response is not satisfactory, the department will typically issue a formal notice under Section 133(6) (asking for information from you), Section 142(1) (during ongoing scrutiny), or trigger a reassessment under Section 148A.\n\nResponding proactively to AIS communications - before they become formal notices - is significantly less expensive and stressful than dealing with formal proceedings later.',
    },
  ],

  faqs: [
    {
      q: "My AIS shows a property sale that I do not recognise. Someone else's transaction appears against my PAN. What do I do?",
      a: 'This happens when a property registrar files SFT data with an incorrect PAN. First, verify that the transaction is genuinely not yours by checking the property address and details. Then submit an online feedback/objection on the AIS portal marking the transaction as "information is incorrect." Also raise a grievance on the income tax portal. Keep a record of all correspondence.',
    },
    {
      q: 'My AIS shows Rs. 35 lakh in mutual fund redemptions. I reported the capital gains but not the gross redemption amount. Will I get a notice?',
      a: 'Possibly. The AIS shows gross transaction value while your ITR shows net capital gains. The difference can look like unreported income to an automated system. If you receive a communication, simply explain this in your response with your ITR Schedule CG (capital gains) showing the purchase price, sale price, and gains computed. This is a common and easily explained discrepancy.',
    },
  ],
};
