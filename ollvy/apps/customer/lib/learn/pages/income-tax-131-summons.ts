// lib/learn/pages/income-tax-131-summons.ts
import { LearnPageConfig } from '../pages';

export const incomeTax131Summons: LearnPageConfig = {
  slug: 'income-tax-131-summons',
  title: 'Income Tax Section 131 Summons: What to Do When You Are Called In',
  seoTitle: 'Income Tax Section 131 Summons 2025: How to Respond | Ollvy',
  seoDescription: 'Got an Income Tax Section 131 summons? This is the highest level of individual notice in routine tax proceedings. Understand what is expected and how to appear.',
  canonicalUrl: 'https://www.ollvy.com/learn/income-tax-131-summons',
  lastReviewed: 'March 2025',
  category: 'Income Tax Notice',
  ctaServiceSlug: 'itr-notice-response',
  relatedServiceSlugs: ['itr-notice-response'],
  relatedLearnSlugs: ['income-tax-143-2-scrutiny', 'income-tax-148-148a-reopening', 'income-tax-271-penalty'],
  severity: 'urgent',
  deadline: 'Date and time specified in the summons',
  deadlineNote: 'Non-compliance with a Section 131 summons is a criminal offence under Section 131(1A). Appear, or send a duly authorised representative.',

  sections: [
    {
      number: '01',
      heading: 'THIS IS THE INCOME TAX EQUIVALENT OF A COURT SUMMONS',
      body: 'Under Section 131 of the Income Tax Act, income tax authorities have the same powers as a civil court when it comes to: requiring the attendance of any person and examining them on oath, requiring the production of any books of accounts, documents, or papers, issuing commissions, and receiving evidence on affidavits.\n\nA Section 131 summons requires your personal attendance (or that of your authorised representative) before the income tax officer on a specific date and time. It may ask you to bring specific documents.',
      note: 'Source: Section 131, Income Tax Act, 1961.',
    },
    {
      number: '02',
      heading: 'WHY SECTION 131 SUMMONS ARE ISSUED',
      body: '',
      bullets: [
        'During scrutiny assessment: The officer wants to examine you on oath about specific transactions or entries in your return. This is more intensive than a written query.',
        "During investigation: Your name has come up in a survey, search, or investigation at another person's or entity's premises and the officer wants your statement.",
        'Third-party summons: The officer is examining you as a witness about transactions with a third party under investigation. You are not the subject of the investigation.',
        'Survey proceedings under Section 133A: After a survey at your business, the officer wants to examine specific persons in the organisation.',
        'High-value transaction enquiry: The officer wants a personal explanation about a large or unusual transaction that appears in your AIS.',
      ],
    },
    {
      number: '03',
      heading: 'HOW TO PREPARE FOR AND APPEAR AT A SECTION 131 EXAMINATION',
      body: 'Appearing before an income tax officer for examination is a formal legal proceeding. Treat it seriously.',
      bullets: [
        'Do not go alone: Engage a CA or tax advocate and have them accompany you as your authorised representative. Under Section 288 of the IT Act, you can be represented by a CA or advocate.',
        'Review the summons carefully: It will specify what documents to bring and (sometimes) the specific issues to be examined. Prepare these thoroughly.',
        'Know what you are going to say: Discuss with your CA what answers are appropriate for the likely questions. Do not speculate or guess - if you do not know the answer to a question, say so.',
        'Be truthful: You are being examined on oath. False statements constitute perjury, which is a criminal offence under Section 193 of the Indian Penal Code.',
        'Take notes: During the examination, ask for a copy of the statement recorded. Everything that is recorded becomes part of the official proceedings.',
        'Do not bring more than what is asked: If the summons asks for three years of bank statements, bring those. Do not bring additional records that were not asked for - they may open new avenues of enquiry.',
      ],
    },
    {
      number: '04',
      heading: 'WHAT HAPPENS IF YOU DO NOT APPEAR',
      body: 'Non-compliance with a Section 131 summons is not like ignoring a notice.',
      bullets: [
        'Criminal offence under Section 131(1A): Wilful failure to comply with a summons or produce documents is an offence punishable with up to 1 year imprisonment and/or fine.',
        'The officer can proceed ex-parte: The examination or assessment proceeds without your participation, typically in the most unfavourable manner.',
        'Prosecution under Section 276: Separately from Section 131(1A), persistent defiance of summons can result in prosecution.',
        'If you cannot appear on the scheduled date: Write immediately to the officer requesting a postponement with a specific reason. Officers generally accommodate genuine circumstances.',
      ],
    },
  ],

  faqs: [
    {
      q: 'I received a Section 131 summons as a third party - about a client\'s transactions, not mine. Do I have to appear?',
      a: 'Yes. Section 131 summons apply to any person - not just the taxpayer under assessment. If you are summoned as a third party, you must appear and truthfully answer questions about the specific transactions you have knowledge of. You can have a CA or advocate accompany you.',
    },
    {
      q: 'The Section 131 summons asks me to bring all books of accounts for 5 years. That is thousands of pages. What do I do?',
      a: 'You are required to produce what was asked. For very large volumes, write to the officer in advance to discuss a practical arrangement (e.g., production in batches, digital copies). Officers are generally practical about this. Do not use volume as a reason to not produce the records - that is non-compliance.',
    },
  ],
};
