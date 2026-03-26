// lib/guides/pages/income-tax-271-penalty.ts
import { LearnPageConfig } from '../pages';

export const incomeTax271Penalty: LearnPageConfig = {
  slug: 'income-tax-271-penalty',
  title: 'Income Tax Section 271 Penalty Notice: Penalty for Non-Compliance or Concealment',
  seoTitle: 'Income Tax Section 271 Penalty Notice 2025: How to Respond | Ollvy',
  seoDescription: 'Received a Section 271(1)(b) or 271(1)(c) income tax penalty notice? Understand the difference, the amount at stake, and your best response strategy.',
  canonicalUrl: 'https://www.ollvy.com/guides/income-tax-271-penalty',
  lastReviewed: 'March 2025',
  category: 'Income Tax Notice',
  ctaServiceSlug: 'itr-notice-response',
  relatedServiceSlugs: ['itr-notice-response'],
  relatedLearnSlugs: ['income-tax-143-2-scrutiny', 'income-tax-142-1-notice', 'income-tax-131-summons'],
  relatedTools: {
    penaltyCalculators: ['itr-late-filing'],
    documentChecklists: ['business-itr', 'individual-itr'],
  },
  severity: 'serious',
  deadline: '30 days from penalty notice',
  deadlineNote: 'Penalty notices require a specific response - you need to show reasonable cause or challenge the basis. A generic reply or silence both have bad outcomes.',

  sections: [
    {
      number: '01',
      heading: 'TWO VERY DIFFERENT SECTIONS, TWO VERY DIFFERENT SITUATIONS',
      body: 'Section 271 of the Income Tax Act has multiple clauses, each addressing a different kind of non-compliance. The two you are most likely to encounter are 271(1)(b) and 271(1)(c), and they are fundamentally different situations with very different consequences.',
      bullets: [
        'Section 271(1)(b): Penalty for failure to comply with a notice - specifically, not responding to notices under Sections 142(1), 143(2), or not complying with directions under Section 142(2A). Penalty: Rs. 10,000 per default.',
        'Section 271(1)(c): Penalty for concealment of income or furnishing inaccurate particulars of income. Penalty: 100% to 300% of the tax on the concealed or inaccurately stated income. This is the serious one.',
      ],
      note: 'Source: Section 271, Income Tax Act, 1961.',
    },
    {
      number: '02',
      heading: 'SECTION 271(1)(B): PENALTY FOR NOT RESPONDING TO NOTICES',
      body: 'If your penalty is under Section 271(1)(b), it means you failed to respond to an earlier notice (143(2), 142(1), etc.) and the officer is now penalising you for that non-response.',
      bullets: [
        'The penalty is Rs. 10,000 per default - not per rupee of income. It is a fixed amount.',
        'Your defence: Show "reasonable cause" for the non-response. Genuine unavoidable circumstances (hospitalisation, natural disaster, technical portal failure with documentary evidence, bereavement) constitute reasonable cause under Section 273B.',
        'Even if you cannot show reasonable cause for the non-response, you can argue that the underlying assessment was correct and therefore the non-compliance caused no actual tax loss to the government.',
        'In practice, many 271(1)(b) penalties are imposed routinely and an application showing that the taxpayer engaged subsequently (even if late) often results in the penalty being waived or reduced in appeal.',
      ],
    },
    {
      number: '03',
      heading: 'SECTION 271(1)(C): CONCEALMENT PENALTY - THE SERIOUS ONE',
      body: 'Section 271(1)(c) is initiated when the assessing officer believes you either concealed income or furnished incorrect particulars in your return. This is the penalty that can be 100% to 300% of the tax on the concealed amount.',
      bullets: [
        'When is it triggered: Income that was discovered during scrutiny or reassessment that was not in your original return. Incorrect claims (deductions, exemptions) that were found to be wrong.',
        'Key distinction - what is and is not "concealment": Deliberate concealment (not declaring cash income, suppressing business receipts, claiming false deductions) = clear 271(1)(c) territory. Genuine bonafide disputes about characterisation of income, valuation differences, legal interpretations = arguable that this is not concealment.',
        'The "bonafide belief" defence: If you disclosed all material facts and took a particular legal position in good faith (even if later found to be wrong), this is generally NOT concealment. Courts have consistently held that legitimate tax positions, even if incorrect, do not attract 271(1)(c).',
        'Immunity under Section 270AA: If you agree with the assessment and pay the tax and interest within the time allowed, you can file an application under Section 270AA for immunity from 271(1)(c) penalty. This is available for non-fraud cases under Section 270A.',
      ],
      note: 'Section 270A replaced the concealment penalty provisions for assessments from AY 2017-18 onwards. If your case involves AY 2016-17 or earlier, Section 271(1)(c) in its older form applies.',
    },
    {
      number: '04',
      heading: 'HOW TO RESPOND TO A PENALTY NOTICE',
      body: '',
      bullets: [
        'File a detailed written reply: Address specifically whether the conditions for penalty are met. This is not the stage to be vague.',
        'For 271(1)(b): Show the reasonable cause. Attach documentary evidence of the genuine obstacle to compliance.',
        'For 271(1)(c): Make the bonafide belief argument if applicable. Provide documentation showing that the position taken in the return was a legitimate interpretation of the law, not a deliberate concealment.',
        'If there was genuine concealment: Consider applying under Section 270AA for immunity if the case qualifies. Paying the tax and accepting the assessment while seeking penalty immunity is often more cost-effective than fighting both the assessment and the penalty.',
        'Appeal: If the penalty is confirmed after your reply, you can appeal to the Commissioner of Income Tax (Appeals) under Section 246A within 30 days.',
      ],
    },
  ],

  faqs: [
    {
      q: 'I received a 271(1)(c) penalty notice for Rs. 12 lakh. The tax on the added income was Rs. 4 lakh. Is the 100% penalty minimum correct?',
      a: 'Under the older 271(1)(c) provisions, the penalty range is 100% to 300% of the tax (not the income amount). Rs. 4 lakh tax * 100% minimum = Rs. 4 lakh penalty. If the officer is imposing Rs. 12 lakh, they may be applying a 300% rate. The rate within the 100%-300% range is the officer\'s discretion, but you can argue for the minimum 100% in your reply and appeal.',
    },
    {
      q: 'Can both the assessment and the penalty be appealed simultaneously?',
      a: 'Yes. And typically, if the underlying assessment is overturned in appeal, the penalty notice falls automatically. Appeal the assessment first if you have strong grounds - a successful assessment appeal often eliminates the penalty entirely.',
    },
  ],
};
