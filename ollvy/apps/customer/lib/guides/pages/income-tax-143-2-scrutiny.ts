// lib/guides/pages/income-tax-143-2-scrutiny.ts
import { LearnPageConfig } from '../pages';

export const incomeTax1432Scrutiny: LearnPageConfig = {
  slug: 'income-tax-143-2-scrutiny',
  title: 'Income Tax Section 143(2) Scrutiny Notice: A Human is Reviewing Your Return',
  seoTitle: 'Section 143(2) Scrutiny Notice: Step by Step Response (2026) | Ollvy',
  seoDescription: 'A 143(2) notice means your return was selected for detailed scrutiny. The process runs 12-18 months through the faceless assessment system. Engage a CA from day one.',
  canonicalUrl: 'https://www.ollvy.com/guides/income-tax-143-2-scrutiny',
  lastReviewed: 'July 2026',
  category: 'Income Tax Notice',
  ctaServiceSlug: 'business-itr',
  relatedServiceSlugs: ['business-itr'],
  relatedLearnSlugs: ['income-tax-142-1-notice', 'income-tax-148-148a-reopening', 'income-tax-156-demand', 'income-tax-act-2025-section-mapping'],
  relatedTools: {
    penaltyCalculators: ['itr-late-filing'],
    documentChecklists: ['business-itr', 'individual-itr'],
  },
  severity: 'urgent',
  deadline: 'Date specified in notice (minimum 30 days to respond)',
  deadlineNote: 'Unlike 143(1), this is a human officer - not an automated system. Every document you submit and every word you write will be reviewed and may prompt follow-up questions.',

  sections: [
    {
      number: '01',
      heading: 'A REAL OFFICER IS REVIEWING YOUR RETURN',
      body: 'A Section 143(2) notice means your income tax return has been selected for scrutiny assessment. An assessing officer (a real person, not an automated system) has selected your case and is now conducting a detailed examination of your income, deductions, exemptions, and tax paid.\n\nThe officer has the power to call for any documents, examine books of accounts, make enquiries from third parties (banks, clients, employers), and ultimately pass an assessment order that can be higher than what you declared.',
      note: 'Source: Section 143(2), Income Tax Act, 1961.',
    },
    {
      number: '02',
      heading: 'WHY YOUR RETURN WAS SELECTED FOR SCRUTINY',
      body: 'Cases are selected for scrutiny either by the CASS (Computer Assisted Scrutiny Selection) system or through specific departmental intelligence. Common triggers:',
      bullets: [
        'High-value deductions relative to income: Large 80C investments, substantial HRA claims, or home loan deductions that seem disproportionate to income.',
        'Significant year-on-year variation in income: A large dip or spike in income without an obvious reason.',
        'GST and income tax turnover mismatch: Your business income in ITR is significantly lower than turnover in GST returns.',
        'Cash deposits inconsistent with income: Bank account cash deposits shown in your AIS that do not match your declared income profile.',
        'Large capital gains claimed as exempt or with indexation: Especially on property sales.',
        'High-value foreign transactions: LRS transactions, foreign investments, or NRI status claims.',
        'Sector-specific scrutiny: The CBDT periodically selects specific business sectors for systematic scrutiny.',
        'Third-party data mismatch: Information from banks, registrars, stockbrokers that does not reconcile with your ITR.',
      ],
    },
    {
      number: '03',
      heading: 'WHAT THE SCRUTINY PROCESS LOOKS LIKE',
      body: 'Section 143(2) scrutiny is not a one-document exchange. It is a structured process that can last 12-18 months.',
      bullets: [
        'Notice under 143(2): The officer specifies what documents and information they want and sets a date for you to respond. The notice must be issued within 3 months from the end of the financial year in which the return was filed.',
        'First response: You submit the requested documents. This is usually a mix of financial statements, bank statements, investment proofs, and specific explanations.',
        'Questionnaire / further queries: The officer reviews your submission and sends follow-up questions, often in the form of notices under Section 142(1).',
        'Examination of accounts: The officer may call you or your CA for an in-person discussion or the examination of specific records.',
        'Show cause notice before addition: Before making any addition to your income or disallowing a deduction, the officer is required to give you a specific show cause notice under Section 144B (faceless assessment process). You must respond to this.',
        'Draft assessment order: Under the faceless assessment scheme, you receive a draft order before the final order. You have 30 days to respond.',
        'Final assessment order under Section 143(3): The conclusive order. Any additional tax demand, penalty, or clean chit from the scrutiny.',
      ],
      note: 'The entire scrutiny must be completed within 18 months from the end of the relevant assessment year (12 months for returns filed on time).',
    },
    {
      number: '04',
      heading: 'HOW TO HANDLE THE SCRUTINY FROM DAY ONE',
      body: 'The way you respond to the first 143(2) notice sets the tone for everything that follows.',
      bullets: [
        'Engage a CA immediately: Scrutiny assessment is not a DIY process. The officer is a trained professional who scrutinises returns all day. You need someone who knows the system on your side.',
        'Respond fully and on time: Partial responses and missed deadlines create negative impressions and invite harder follow-up queries.',
        'Do not over-share: Only answer what is asked. Do not volunteer information that was not requested and that might open new lines of enquiry.',
        'Document everything: Keep a log of every document submitted, every query answered, and every communication with the officer. Get written acknowledgements.',
        "Understand what the officer is looking for: Most scrutiny notices focus on one or two specific issues.",
        'Do not make verbal commitments: Everything in a scrutiny proceeding should be in writing. If you make a verbal statement that is later used against you, you have no record to contest it.',
      ],
    },
    {
      number: '05',
      heading: 'THE DIFFERENCE BETWEEN FACELESS AND CONVENTIONAL SCRUTINY',
      body: 'Since 2020, most income tax scrutiny cases go through the Faceless Assessment Scheme. This means:',
      bullets: [
        'You do not need to appear before an officer in person. All communication is through the income tax portal.',
        'The officer reviewing your case may be in a different city from you. This is by design to reduce corruption.',
        'You submit all documents digitally through the portal.',
        'The draft assessment order is sent to you electronically with a 30-day response period.',
        'The final order is also issued electronically.',
        'Conventional (non-faceless) scrutiny applies to certain categories of high-complexity cases, international taxation, and cases involving search and seizure.',
      ],
    },
  ],

  faqs: [
    {
      q: 'I received 143(2) for my business return. The officer is asking for all books of accounts for 3 years. Do I have to submit all of that?',
      a: 'The officer can ask for books of accounts under Section 142(1) and you must comply. However, you do not have to present original books in person for most faceless cases - scanned copies are acceptable. Start compiling digitally. If the volume is large, request a reasonable time extension.',
    },
    {
      q: 'My 143(2) notice was issued 4 months after the end of the financial year in which I filed my return. Is it valid?',
      a: 'The notice must be issued within 3 months from the end of the financial year in which the return was filed. If your return was filed in July 2024 (FY 2024-25), the 3-month window runs until June 30, 2025. If the notice came after that, it is time-barred and you should challenge it. Get the dates verified by a CA.',
    },
    {
      q: 'I received both 143(1) intimation with no demand and then 143(2). Is that normal?',
      a: 'Yes. A 143(1) intimation means the CPC processed your return with no issues found through automated checking. A 143(2) notice means your case was separately selected for scrutiny by a human officer. These are two independent processes and receiving a clean 143(1) does not protect you from 143(2) scrutiny.',
    },
    {
      q: 'The notice says I must respond by a date that is only 15 days away. Is that enough time?',
      a: 'Legally, you have the right to request an extension if the original deadline is too short. Write to the officer (through the portal) requesting a reasonable extension with specific reasons. Officers typically grant 15-30 additional days for first requests.',
    },
    {
      q: "Does the Income-tax Act 2025 change scrutiny notices?",
      a: "Only the section number. Scrutiny selection for AY 2026-27 and earlier continues under Section 143(2) of the 1961 Act (savings clause, Section 536(2)(c) of the 2025 Act). For tax year 2026-27 onwards the same notice cites Section 270(2) of the 2025 Act. The faceless assessment procedure and response timelines are unchanged, so respond to the substance regardless of which number is printed.",
    },
  ],

  sources: [
    { name: 'Income Tax Act, 1961 (Section 143(2))', url: 'https://incometaxindia.gov.in', description: 'Scrutiny assessment notice provision' },
    { name: 'Income Tax Act, 1961 (Section 144B)', url: 'https://incometaxindia.gov.in', description: 'Faceless assessment scheme procedures' },
  ],
};
