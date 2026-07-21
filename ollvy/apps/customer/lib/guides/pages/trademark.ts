import { LearnPageConfig, EligibilityRule, EligibilityResult, getUrgencyLevel, URGENCY_LEVELS } from '../pages'

// Computes the trademark urgency score for one full set of answers. The rule
// list below enumerates every answer combination as plain data, so the
// scoring survives JSON serialization to the client.
function trademarkUrgencyResult(answers: string[]): EligibilityResult {
  const factors: { text: string; points: number }[] = []
  let score = 0

  // Q1: Brand centrality
  if (answers[0] === 'central') {
    score += 40
    factors.push({ text: 'Brand is core to how customers find you', points: 40 })
  } else if (answers[0] === 'matters') {
    score += 20
    factors.push({ text: 'Brand is a meaningful competitive asset', points: 20 })
  } else {
    score += 5
    factors.push({ text: 'Brand plays a minor role in your business model', points: 5 })
  }

  // Q2: Marketing spend
  if (answers[1] === 'significant') {
    score += 30
    factors.push({ text: 'Significant marketing spend building unprotected brand value', points: 30 })
  } else if (answers[1] === 'some') {
    score += 15
    factors.push({ text: 'Some marketing spend - protection is worthwhile', points: 15 })
  } else {
    score += 0
    factors.push({ text: 'No marketing spend yet - risk is currently low', points: 0 })
  }

  // Q3: Similar names
  if (answers[2] === 'yes_similar') {
    score += 25
    factors.push({ text: 'Similar names exist - race to register is already on', points: 25 })
  } else if (answers[2] === 'not_sure') {
    score += 10
    factors.push({ text: 'No trademark search done - unknown risk', points: 10 })
  } else {
    score += 5
    factors.push({ text: 'Name appears unique - lower risk of conflict', points: 5 })
  }

  // Q4: Plans
  if (answers[3] === 'international') {
    score += 15
    factors.push({ text: 'International expansion requires registered IP', points: 15 })
  } else if (answers[3] === 'funding') {
    score += 15
    factors.push({ text: 'Investors check IP in due diligence - unregistered brand is a flag', points: 15 })
  } else if (answers[3] === 'ecommerce') {
    score += 15
    factors.push({ text: 'Amazon and Flipkart Brand Registry requires trademark registration', points: 15 })
  }

  const level = getUrgencyLevel(score)
  const levelInfo = URGENCY_LEVELS[level]

  return {
    type: (score >= 60 ? 'mandatory' : score >= 35 ? 'recommended' : 'optional') as 'mandatory' | 'recommended' | 'optional',
    headline: levelInfo.label,
    body: levelInfo.description,
    ctaLabel: score >= 60 ? 'Register Trademark Now' : 'See What Registration Costs',
    ctaHref: '/checkout/trademark-registration',
    ranking: {
      type: 'urgency' as const,
      urgency: {
        score,
        maxScore: 100,
        level,
        label: levelInfo.label,
        factors: factors.filter(f => f.points > 0),
      },
    },
  }
}

// One rule per full answer combination (3 x 3 x 3 x 4 = 108).
const trademarkResultRules: EligibilityRule[] = []
for (const centrality of ['central', 'matters', 'less_important']) {
  for (const spend of ['significant', 'some', 'none']) {
    for (const similar of ['yes_similar', 'not_sure', 'unique']) {
      for (const plans of ['international', 'funding', 'ecommerce', 'none']) {
        trademarkResultRules.push({
          if: [
            { q: 0, anyOf: [centrality] },
            { q: 1, anyOf: [spend] },
            { q: 2, anyOf: [similar] },
            { q: 3, anyOf: [plans] },
          ],
          result: trademarkUrgencyResult([centrality, spend, similar, plans]),
        })
      }
    }
  }
}

export const trademarkRegistration: LearnPageConfig = {
  slug: 'do-i-need-trademark-registration',
  title: 'Do I Need Trademark Registration?',
  seoTitle: 'Do I Need to Register a Trademark in India 2026? | Ollvy',
  seoDescription:
    'Find out if trademark registration makes sense for your brand in India. Understand protection, costs, enforcement, and when to prioritise it in 2026.',
  canonicalUrl: 'https://www.ollvy.com/guides/do-i-need-trademark-registration',
  lastReviewed: 'April 2026',
  category: 'Registration',
  ctaServiceSlug: 'trademark-registration',
  relatedServiceSlugs: ['trademark-registration'],
  relatedLearnSlugs: ['pvt-ltd-vs-llp', 'is-msme-registration-worth-it'],
  relatedTools: {
    documentChecklists: ['trademark'],
  },

  tool: {
    type: 'eligibility',
    title: 'Should You Register Your Trademark?',
    questions: [
      {
        text: 'How central is your brand name or logo to your business?',
        options: [
          { value: 'central', label: 'It is the product - customers search for us by name' },
          { value: 'matters', label: 'It matters, but we compete on quality too' },
          { value: 'less_important', label: 'B2B supplier or white-label - brand is less important' },
        ],
      },
      {
        text: 'Have you spent money building brand awareness?',
        options: [
          { value: 'significant', label: 'Yes - significant spend on ads, packaging, or marketing' },
          { value: 'some', label: 'Some - social media and basic content' },
          { value: 'none', label: 'Not yet - not started marketing' },
        ],
      },
      {
        text: 'Is anyone else using a similar name in your industry?',
        options: [
          { value: 'yes_similar', label: 'Yes, similar names exist' },
          { value: 'not_sure', label: 'Not sure - I have not checked' },
          { value: 'unique', label: 'Our name is unique - nothing similar' },
        ],
      },
      {
        text: 'Are any of these in your plans?',
        options: [
          { value: 'international', label: 'Expanding internationally or licensing my brand' },
          { value: 'funding', label: 'Raising investor funding' },
          { value: 'ecommerce', label: 'Selling on Amazon, Flipkart, or Meesho' },
          { value: 'none', label: 'None of these right now' },
        ],
      },
    ],
    resultRules: trademarkResultRules,
    defaultResult: {
      type: 'recommended',
      headline: 'Set a timeline.',
      body: 'Brand exposure is low now, but that will change. Rs. 4,500 per class for 10 years of protection.',
    },
  },

  sections: [
    {
      number: '01',
      heading: 'WHAT A TRADEMARK ACTUALLY DOES FOR YOU',
      body: 'A trademark is a legally recognised sign - a name, logo, tagline, or combination - that identifies your products or services as yours. Once registered under the Trade Marks Act, 1999, you have the exclusive right to use that mark commercially in India for 10 years (renewable forever). More importantly, you have the legal power to stop others from using the same or confusingly similar mark in your category.',
      note: 'Source: Trade Marks Act, 1999; Trade Marks Rules, 2017',
    },
    {
      number: '02',
      heading: 'WHEN YOU CANNOT AFFORD TO WAIT',
      body: 'Registration is urgent in these situations.',
      bullets: [
        'You are spending on ads, packaging, or social media - every rupee is building value in an unprotected brand',
        'You sell on Amazon or Flipkart - both platforms have brand registry programs requiring trademark registration. Without it, your listings are open to hijackers and copycats',
        'You run a SaaS or tech product - your product name is your primary asset. A competitor can register a similar name first',
        'You plan to franchise or license - you cannot license a brand you do not own as a registered trademark',
        'You are raising investor funding - IP due diligence will catch an unregistered brand and can delay or complicate your round',
        'India gives trademark rights to whoever registers first - waiting means someone else can register your name',
      ],
      table: {
        caption: 'When to Register Your Trademark: Urgency by Situation',
        headers: ['Situation', 'Urgency', 'Why'],
        rows: [
          ['Selling on Amazon or Flipkart', 'Immediate', 'Brand Registry requires registered trademark. Without it, listings are open to hijackers.'],
          ['Raising investor funding', 'Before closing the round', 'IP due diligence will flag an unregistered brand. Can delay or reduce valuation.'],
          ['Significant marketing spend ongoing', 'This month', 'Every rupee builds equity in an unprotected brand. Someone can register your name.'],
          ['Planning to franchise or license', 'Before any discussions', 'You cannot legally license a mark you do not own as a registered trademark.'],
          ['International expansion planned', 'Now', 'Paris Convention gives you 6 months from Indian filing to claim priority in other countries.'],
          ['Early stage, still validating name', '3-6 months', 'Register the moment you commit to the name. Do a free IP India search today.'],
          ['B2B supplier, white-label', 'Low urgency', 'Register before any consumer-facing marketing begins.'],
        ],
      },
      note: 'Source: Section 28, Trade Marks Act, 1999',
    },
    {
      number: '03',
      heading: 'WHEN YOU CAN TAKE A BIT MORE TIME',
      body: 'Lower urgency, but set a timeline.',
      bullets: [
        'Early stage, still validating your product - aim to register within 6 months of committing to a name',
        'B2B service firm that mostly gets work through referrals - lower risk of copying, but register before you scale',
        'Local service business (salon, restaurant, regional brand) - register before you open your second location',
      ],
    },
    {
      number: '04',
      heading: 'WHEN IT IS GENUINELY NOT URGENT',
      body: '',
      bullets: [
        'You are still testing and have not settled on a name',
        'Pure white-label supplier with no consumer-facing brand',
        'Working under your own name serving a small local client base',
      ],
      note: 'Even without a registered trademark, you have limited protection against copycats under "passing off" (Section 27, Trade Marks Act). But proving passing off requires demonstrating prior reputation in court - expensive, slow, and uncertain. Registration is far simpler.',
    },
    {
      number: '05',
      heading: 'WHAT ACTUALLY HAPPENS TO BUSINESSES THAT DELAY',
      body: '',
      bullets: [
        'Someone else registers your name and legally demands you stop using it',
        'You receive a cease-and-desist from a registered holder, even if you have been using the name longer - without registration, your protection is limited',
        'Without a registered trademark, you cannot enrol in Amazon Brand Registry, leaving your listings open to unauthorised sellers',
        'Competitors can file IP infringement complaints against your marketplace listings if they have a registered mark and you do not',
        'In M&A or funding due diligence, an unregistered brand is flagged as an IP risk affecting valuation',
      ],
    },
    {
      number: '06',
      heading: 'THE COST IS LOW ENOUGH THAT THE QUESTION IS JUST WHEN',
      body: 'Government filing fee: Rs. 4,500 per class for individuals and small entities (Rs. 9,000 for others). That is per class, per 10 years - not per year.',
      bullets: [
        'Decided on a name and started any marketing? Register within 30 days',
        'Raising funding or planning M&A? Register today',
        'Expanding to a second city or new product? Register before that expansion',
        'Still testing product-market fit? Do a free search on the IP India portal now, and register the moment you commit to the name',
        'Renewal: Rs. 9,000 to Rs. 10,000 every 10 years',
      ],
      table: {
        caption: 'Trademark Registration Fees in India (IP India, 2026)',
        headers: ['Fee Type', 'Individual / Startup / Small Entity', 'Company / Others', 'Notes'],
        rows: [
          ['Registration per class', 'Rs. 4,500', 'Rs. 9,000', 'One-time government fee per 10-year term'],
          ['Renewal per class', 'Rs. 9,000', 'Rs. 10,000', 'Every 10 years - mark stays active indefinitely'],
          ['Expedited examination', 'Rs. 20,000', 'Rs. 40,000', 'Faster examination, not faster registration'],
          ['Opposition reply', 'Rs. 2,700', 'Rs. 2,700', 'If a third party opposes your application'],
          ['Correction of error', 'Rs. 900', 'Rs. 900', 'Per application, per form'],
        ],
      },
    },
  ],

  faqs: [
    {
      q: 'How long does trademark registration actually take?',
      a: 'Your application is filed and gets a filing date immediately - and your rights are protected from that date, not the final registration date. From filing to receiving the official registration certificate (assuming no objections), the typical timeline is 18-24 months.',
    },
    {
      q: 'What is a trademark class and which one do I need?',
      a: 'Goods and services are divided into 45 categories called classes. Class 42 is software and tech services; Class 25 is clothing; Class 35 is retail and marketing. You register per class. Using the wrong class means you are unprotected in the category you actually operate in. Most businesses need 1-3 classes.',
    },
    {
      q: 'Can I trademark a common word like "Fresh" or "Quick"?',
      a: 'Descriptive or generic words are very difficult to register on their own. But a distinctive combination, a stylised logo, or a word used in an unexpected context (Apple for computers) can be protected. A trademark attorney can assess whether your name is protectable before you build a business around it.',
    },
    {
      q: 'What do TM, R, and C symbols mean?',
      a: 'TM can be used by anyone claiming rights to a mark - even without registration. R can only be used once your trademark is officially registered; using it before registration is an offence. C applies to creative works like art and music, not trademarks.',
    },
    {
      q: 'Do I need a trademark or a copyright for my logo?',
      a: 'Both can apply. Copyright protects the artistic creation automatically from the moment it is made. Trademark protects the logo as a brand identifier in commerce. For a business, trademark registration is usually more important because it gives you enforceable commercial rights and a practical way to stop copycats.',
    },
  ],
}
