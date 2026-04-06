import { LearnPageConfig } from '../pages'

export const pvtLtdVsLlp: LearnPageConfig = {
  slug: 'pvt-ltd-vs-llp',
  title: 'Private Limited Company vs LLP: Which Should You Choose?',
  seoTitle: 'Pvt Ltd vs LLP in India 2025: Which is Better for You? | Ollvy',
  seoDescription:
    'Compare Private Limited Company and LLP in India. Understand compliance costs, tax implications, liability protection, and which is better for your business.',
  canonicalUrl: 'https://www.ollvy.com/guides/pvt-ltd-vs-llp',
  lastReviewed: 'April 2026',
  category: 'Incorporation',
  ctaServiceSlug: 'pvt-ltd-incorporation',
  ctaSecondarySlug: 'llp-incorporation',
  relatedServiceSlugs: ['pvt-ltd-incorporation', 'llp-incorporation'],
  relatedLearnSlugs: [
    'do-i-need-gst-registration',
    'should-i-get-dpiit-startup-recognition',
    'is-msme-registration-worth-it',
  ],
  relatedTools: {
    penaltyCalculators: ['mca-annual-filing'],
    documentChecklists: ['private-limited-company', 'llp'],
  },

  tool: {
    type: 'comparison',
    title: 'Which Structure is Right for Your Business?',
    questions: [
      {
        text: 'Are you planning to raise equity investment from angel investors or VCs?',
        options: [
          { value: 'yes_funding', label: 'Yes - fundraising is on the roadmap' },
          { value: 'maybe', label: 'Maybe in a few years' },
          { value: 'no_funding', label: 'No - bootstrapping or debt only' },
        ],
      },
      {
        text: 'How many people will run the business day-to-day?',
        options: [
          { value: 'solo', label: 'Just me' },
          { value: 'small_team', label: '2-3 co-founders or partners' },
          { value: 'large_team', label: 'More than 3' },
        ],
      },
      {
        text: 'Expected annual turnover in the first 2-3 years?',
        options: [
          { value: 'below_40l', label: 'Below Rs. 40 lakh' },
          { value: '40l_2cr', label: 'Rs. 40 lakh to Rs. 2 crore' },
          { value: 'above_2cr', label: 'Above Rs. 2 crore' },
        ],
      },
      {
        text: 'How important is keeping annual compliance costs low?',
        options: [
          { value: 'critical', label: 'Very important - I want minimal filings' },
          { value: 'moderate', label: 'Some compliance is fine' },
          { value: 'not_priority', label: 'Not a concern - growth matters more' },
        ],
        evaluator: (answer: string, allAnswers: string[]) => {
          const answers = [...allAnswers, answer]

          let pvt = 0
          let llp = 0

          const reasons: { pvt: { text: string; impact: 'high' | 'medium' | 'low' }[]; llp: { text: string; impact: 'high' | 'medium' | 'low' }[] } = {
            pvt: [], llp: [],
          }
          const warnings: { pvt: string[]; llp: string[] } = { pvt: [], llp: [] }

          // Q1: Funding
          if (answers[0] === 'yes_funding') {
            pvt += 50
            reasons.pvt.push({ text: 'You need equity funding - only Pvt Ltd can issue shares to investors', impact: 'high' })
            warnings.llp.push('LLP cannot issue shares - investors cannot take equity stakes')
          } else if (answers[0] === 'maybe') {
            pvt += 30; llp += 5
            reasons.pvt.push({ text: 'Possible future funding - Pvt Ltd keeps that door open', impact: 'high' })
            reasons.llp.push({ text: 'No funding plans yet - LLP is simpler and cheaper now', impact: 'medium' })
          } else {
            pvt += 8; llp += 30
            reasons.pvt.push({ text: 'No funding needed, but Pvt Ltd gives more exit flexibility', impact: 'low' })
            reasons.llp.push({ text: 'No funding needed - LLP avoids the cost and structure overhead', impact: 'high' })
          }

          // Q2: Solo founder
          if (answers[1] === 'solo') {
            pvt += 20
            llp -= 50
            reasons.pvt.push({ text: 'Solo founder - only Pvt Ltd works for a single person', impact: 'high' })
            warnings.llp.push('LLP requires at least two designated partners - not an option for solo founders')
          } else if (answers[1] === 'small_team') {
            pvt += 10; llp += 20
            reasons.llp.push({ text: '2-3 partners - LLP structure maps naturally to your setup', impact: 'medium' })
          } else {
            pvt += 12; llp += 15
            reasons.pvt.push({ text: 'Larger team - Pvt Ltd handles complex ownership and ESOP easily', impact: 'medium' })
          }

          // Q3: Turnover
          if (answers[2] === 'below_40l') {
            pvt += 5; llp += 25
            reasons.llp.push({ text: 'Below Rs. 40 lakh - LLP has no mandatory audit at this size (saves Rs. 15,000-25,000/year)', impact: 'high' })
          } else if (answers[2] === '40l_2cr') {
            pvt += 10; llp += 12
            reasons.pvt.push({ text: 'Rs. 40L-2Cr turnover - Pvt Ltd credibility helps with clients and banks', impact: 'medium' })
          } else {
            pvt += 20; llp += 5
            reasons.pvt.push({ text: 'Above Rs. 2 crore - at this scale, Pvt Ltd compliance cost is proportionally smaller and the structure handles growth better', impact: 'medium' })
          }

          // Q4: Compliance
          if (answers[3] === 'critical') {
            pvt += 0; llp += 22
            reasons.llp.push({ text: 'Compliance cost matters - LLP saves Rs. 15,000-30,000/year vs Pvt Ltd', impact: 'high' })
            warnings.pvt.push('Pvt Ltd has mandatory annual audit, board meetings, and MCA filings regardless of activity')
          } else if (answers[3] === 'moderate') {
            pvt += 8; llp += 10
          } else {
            pvt += 18; llp += 5
            reasons.pvt.push({ text: 'Compliance not a constraint - Pvt Ltd gives full optionality for ESOPs, exits, and equity rounds', impact: 'medium' })
          }

          const llpFinal = Math.max(0, llp)
          const pvtFinal = pvt
          const total = pvtFinal + llpFinal
          const pvtScore = Math.round((pvtFinal / total) * 100)
          const llpScore = Math.round((llpFinal / total) * 100)

          const pvtWins = pvtScore > llpScore || llp < 0

          return {
            type: 'eligible' as const,
            headline: pvtWins
              ? 'Private Limited Company is the better fit.'
              : 'LLP is the better fit for your situation.',
            body: pvtWins
              ? `Pvt Ltd scores ${pvtScore}/100 vs LLP ${llpScore}/100 based on your answers.`
              : `LLP scores ${llpScore}/100 vs Pvt Ltd ${pvtScore}/100 based on your answers.`,
            ctaLabel: pvtWins ? 'Register Pvt Ltd' : 'Register LLP',
            ctaHref: pvtWins ? '/checkout/pvt-ltd-incorporation' : '/checkout/llp-incorporation',
            ranking: {
              type: 'comparison' as const,
              comparison: [
                {
                  label: 'Private Limited Company',
                  score: pvtScore,
                  isWinner: pvtWins,
                  verdict: pvtWins
                    ? 'Best fit for your situation'
                    : 'Viable, but not the optimal choice here',
                  reasons: reasons.pvt,
                  warnings: warnings.pvt.length ? warnings.pvt : undefined,
                },
                {
                  label: 'LLP',
                  score: llpScore,
                  isWinner: !pvtWins,
                  verdict: !pvtWins
                    ? 'Best fit for your situation'
                    : llp < 0
                      ? 'Not viable - requires at least two partners'
                      : 'Simpler to run, but limited by your situation',
                  reasons: reasons.llp,
                  warnings: warnings.llp.length ? warnings.llp : undefined,
                },
              ],
            },
          }
        },
      },
    ],
    defaultResult: {
      type: 'optional',
      headline: 'Both structures could work for you.',
      body: 'The simplest tiebreaker: will you ever want external equity investment, even 3-5 years out? If yes, go Pvt Ltd. If not, LLP is simpler and cheaper to run.',
    },
  },

  sections: [
    {
      number: '01',
      heading: 'THE REAL DIFFERENCE IN ONE LINE',
      body: 'A Private Limited Company can issue shares and raise equity investment. An LLP cannot. If you plan to raise money from angel investors or VCs - even years from now - Pvt Ltd is the only realistic option. Everything else - compliance costs, taxation, liability - is secondary to this.',
      note: 'Source: Companies Act, 2013; Limited Liability Partnership Act, 2008',
    },
    {
      number: '02',
      heading: 'WHEN TO CHOOSE A PRIVATE LIMITED COMPANY',
      body: '',
      bullets: [
        'You plan to raise external equity funding - now or in the future',
        'You want to offer ESOPs to employees - not possible in an LLP',
        'You want DPIIT Startup Recognition and the Section 80-IAC tax holiday - only companies and LLPs qualify, but equity investors specifically look for company structure',
        'You want the credibility that comes with "Pvt Ltd" for B2B sales, government contracts, or enterprise clients',
        'You have a clear separation between ownership (shareholders) and management (directors)',
      ],
      note: 'A Pvt Ltd can have up to 200 shareholders. An LLP has no shareholder limit but cannot issue equity to investors.',
    },
    {
      number: '03',
      heading: 'WHEN TO CHOOSE AN LLP',
      body: '',
      bullets: [
        'You are bootstrapping and have no plans to raise equity',
        'You want lower compliance costs - no mandatory audit below Rs. 40 lakh turnover and partner contribution below Rs. 25 lakh',
        'You want flexibility in profit distribution among partners',
        'You are a professional services firm (CA, lawyer, architect) where LLP structure is standard',
        'You want to take profits as partner remuneration rather than dividends - this is generally more tax-efficient for profit extraction',
      ],
      note: 'An LLP requires at least two designated partners. There is no single-person LLP.',
    },
    {
      number: '04',
      heading: 'THE ANNUAL COMPLIANCE COST DIFFERENCE IS REAL',
      body: 'Pvt Ltd annual compliance:',
      bullets: [
        'Annual return (MGT-7): mandatory regardless of activity',
        'Financial statements (AOC-4): mandatory regardless of activity',
        'Statutory audit: mandatory for all companies every year, regardless of size',
        'Board meetings: minimum 4 per year',
        'Director KYC (DIR-3 KYC): annual filing by September 30 - miss it and the DIN deactivates',
        'Income tax return: mandatory every year',
        'Estimated annual cost: Rs. 25,000 to Rs. 50,000 for a small company with minimal activity',
        'LLP: Form 8 and Form 11 filings, no mandatory audit below Rs. 40 lakh turnover, estimated Rs. 10,000 to Rs. 20,000 per year',
      ],
      table: {
        caption: 'Private Limited Company vs LLP: Key Differences (2025)',
        headers: ['Criteria', 'Private Limited Company', 'LLP'],
        rows: [
          ['Equity investment', 'Can issue shares to angel investors and VCs', 'Cannot issue equity - investors cannot take stakes'],
          ['Minimum founders', '1 director + 1 shareholder (nominee allowed)', '2 designated partners - solo founder not possible'],
          ['Tax rate (entity)', '22% under Sec 115BAA or 25% (turnover up to Rs. 400 crore)', '30% flat (no concessional regime available)'],
          ['How profits reach owners', 'Dividends taxed in shareholders\' hands at their slab rate', 'Partner remuneration deductible before tax - taxed at partner\'s slab rate'],
          ['Mandatory audit', 'Every year, regardless of turnover or activity', 'Only above Rs. 40 lakh turnover AND Rs. 25 lakh partner contribution'],
          ['Annual compliance cost', 'Rs. 25,000-50,000 (small company, minimal activity)', 'Rs. 10,000-20,000 (small LLP, minimal activity)'],
          ['Annual filings', 'AOC-4, MGT-7, ITR, DIR-3 KYC, board meetings x4', 'Form 8, Form 11, ITR'],
          ['ESOP to employees', 'Yes - standard practice for startups', 'No - not possible in LLP structure'],
          ['Converting to other structure', 'LLP to Pvt Ltd: 3-6 months, Rs. 50,000-1.5 lakh', 'Pvt Ltd to LLP: complex, stamp duty on asset transfer'],
          ['DPIIT Startup Recognition', 'Eligible', 'Eligible'],
          ['80-IAC tax holiday (3 years)', 'Eligible - requires IMB certification', 'Eligible - requires IMB certification'],
          ['Best for', 'Startups raising equity funding, tech companies, ESOPs', 'Professional services, bootstrapped businesses, low compliance priority'],
        ],
      },
      note: 'These are professional fees excluding GST. Actual costs depend on your CA and complexity.',
    },
    {
      number: '05',
      heading: 'TAXATION: HOW IT ACTUALLY WORKS',
      body: 'Pvt Ltd and LLP have different tax structures.',
      bullets: [
        'Pvt Ltd: Taxed at 22% under Section 115BAA (new regime, optional) or 25% for companies with turnover up to Rs. 400 crore under the old regime. When profit is distributed as dividends, shareholders pay tax on those dividends at their personal income tax slab rate.',
        'LLP: Taxed at a flat 30% on profit (not 22% or 25% - LLPs do not qualify for the company tax regimes). However, partner remuneration and interest on capital are deductible expenses for the LLP before tax is calculated. Partners then pay personal income tax only on the remuneration and interest they receive.',
        'In practice: LLP is often more tax-efficient when partners want to extract profits regularly as salary or interest. Pvt Ltd is more efficient when profits are being retained in the business for reinvestment.',
      ],
      note: 'Source: Section 115BAA, Income Tax Act (company new tax regime); Section 40(b), Income Tax Act (LLP deductions). Run the numbers with your CA for your specific situation.',
    },
    {
      number: '06',
      heading: 'IF YOU ARE STILL UNSURE',
      body: 'One question decides most cases: will you ever want to raise equity from investors?',
      bullets: [
        'YES or MAYBE - go Pvt Ltd from day one. Converting an LLP to a Pvt Ltd later is expensive and time-consuming.',
        'DEFINITELY NO + professional services firm - LLP is the better fit. Lower cost, simpler.',
        'DEFINITELY NO + tech product or consumer brand - Pvt Ltd for ESOP potential and future exits.',
        'DEFINITELY NO + trading or manufacturing with simple partner split - LLP to keep costs low.',
      ],
    },
  ],

  faqs: [
    {
      q: 'Can I convert an LLP to a Pvt Ltd later?',
      a: 'Yes, under Section 366 of the Companies Act, 2013. But it involves multiple MCA filings, stamp duty, valuation, and typically takes 3-6 months at a cost of Rs. 50,000 to Rs. 1.5 lakh. If there is any chance you will want the Pvt Ltd structure within 3 years, it is almost always cheaper to start as one.',
    },
    {
      q: 'Which is better for tax savings?',
      a: 'For small bootstrapped businesses where owners extract profits regularly, LLP is often more tax-efficient because of the deductibility of partner remuneration. For businesses retaining profits for reinvestment or planning to raise equity, the difference is minimal and Pvt Ltd offers more structural flexibility.',
    },
    {
      q: 'Can a single person start either structure?',
      a: 'A Pvt Ltd can be started with one shareholder and one director (with a nominee shareholder for the minimum requirement). An LLP requires at least two designated partners - a single-person LLP is not permitted.',
    },
    {
      q: 'What about liability protection?',
      a: 'Both offer limited liability. Shareholders of a Pvt Ltd are not personally liable beyond their share capital. LLP partners are not personally liable beyond their capital contribution. Both can be held personally liable for fraud or wilful wrongdoing - the protection applies to genuine business losses, not misconduct.',
    },
  ],
}
