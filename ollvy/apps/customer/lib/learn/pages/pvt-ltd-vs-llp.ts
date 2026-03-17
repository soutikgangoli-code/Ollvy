// lib/learn/pages/pvt-ltd-vs-llp.ts
import { LearnPageConfig } from '../pages';

export const pvtLtdVsLlp: LearnPageConfig = {
  slug: 'pvt-ltd-vs-llp',
  title: 'Private Limited Company vs LLP — Which Is Right for Your Business?',
  seoTitle: 'Pvt Ltd vs LLP India (2025) — Comparison, Tax, Compliance, and When to Choose Each',
  seoDescription: 'Compare Private Limited Company and LLP for Indian businesses. Tax rates, compliance costs, funding eligibility, and liability. With decision tool.',
  canonicalUrl: 'https://ollvy.com/learn/pvt-ltd-vs-llp',
  lastReviewed: 'March 2025',
  category: 'Incorporation',
  ctaServiceSlug: 'pvt-ltd-incorporation',
  ctaSecondarySlug: 'llp-incorporation',
  relatedServiceSlugs: ['pvt-ltd-incorporation', 'llp-incorporation', 'startup-india-dpiit'],
  relatedLearnSlugs: ['startup-india-dpiit-recognition', 'how-to-register-gst-india'],

  tool: {
    type: 'comparison',
    title: 'Which entity type is right for your business?',
    compareA: 'pvt-ltd',
    compareB: 'llp',
    questions: [
      {
        text: 'Do you plan to raise equity investment (angels, VCs) in the next 3 years?',
        options: [
          { value: 'yes', label: 'Yes — fundraising is part of the plan' },
          { value: 'maybe', label: 'Maybe — not ruled out' },
          { value: 'no', label: 'No — bootstrapped or debt-only' },
        ],
        evaluator: (answer) => {
          if (answer === 'yes') return {
            type: 'eligible', headline: 'Choose Private Limited Company.',
            body: 'Equity investment requires issuing shares. LLPs don\'t have shares — they have profit-sharing ratios. Most angels and VCs will not invest in an LLP. Converting an LLP to a Pvt Ltd after raising is complicated and expensive. Choose Pvt Ltd from the start.',
          };
          return null;
        },
      },
      {
        text: 'Are the founders providing professional services — consulting, accounting, law, architecture?',
        options: [
          { value: 'yes', label: 'Yes — professional services is our primary business' },
          { value: 'no', label: 'No — we\'re a product or non-professional service company' },
        ],
        evaluator: (answer, allAnswers) => {
          if (answer === 'yes' && allAnswers[0] === 'no') return {
            type: 'eligible', headline: 'LLP is likely the right choice.',
            body: 'Professional services firms (CA firms, law firms, consulting practices, architectural firms) traditionally use LLPs. The profit-sharing structure is simpler than salary + dividend. Compliance burden is lower. No mandatory statutory audit until turnover crosses ₹40L or contribution exceeds ₹25L.',
          };
          return null;
        },
      },
      {
        text: 'How many founders / partners?',
        options: [
          { value: 'one', label: '1 founder (solo)' },
          { value: 'two_four', label: '2–4 founders' },
          { value: 'five_plus', label: '5+ partners' },
        ],
        evaluator: (answer) => {
          if (answer === 'one') return {
            type: 'eligible', headline: 'Choose Private Limited Company.',
            body: 'LLPs require a minimum of 2 designated partners. A solo founder cannot incorporate an LLP. Choose Pvt Ltd — you can be the sole director and shareholder.',
          };
          return null;
        },
      },
      {
        text: 'What is your expected annual revenue in Year 1?',
        options: [
          { value: 'below_25l', label: 'Below ₹25 lakh' },
          { value: '25l_1cr', label: '₹25 lakh–₹1 crore' },
          { value: 'above_1cr', label: 'Above ₹1 crore' },
        ],
        evaluator: (answer, allAnswers) => {
          if (answer === 'above_1cr' || allAnswers[1] === 'no') return {
            type: 'eligible',
            headline: 'Private Limited Company is the safer default.',
            body: 'At this revenue level, or for a product/non-professional services business, Pvt Ltd gives you better credibility with enterprise clients, easier compliance with major platforms (Amazon, Razorpay require Pvt Ltd for certain features), and a cleaner path to growth.',
          };
          return {
            type: 'conditional',
            headline: 'Either can work — but Pvt Ltd is the default for a reason.',
            body: 'At early stage with modest revenue expectations and a professional services model, an LLP is cheaper to maintain (no mandatory audit, lower compliance). But if there\'s any chance of raising money or bringing in external investors, start with Pvt Ltd.',
          };
        },
      },
    ],
  },

  sections: [
    {
      heading: 'The decision in one table',
      body: 'Most of the time, the decision is simple. Choose Pvt Ltd unless you have a specific reason not to.',
      table: [
        { col1: 'Factor', col2: 'Private Limited', col3: 'LLP' },
        { col1: 'Equity investment', col2: 'Can issue shares to investors', col3: 'Cannot issue equity shares' },
        { col1: 'Minimum founders', col2: '1 director, 1 shareholder (can be same person)', col3: '2 designated partners (minimum)' },
        { col1: 'Corporate tax rate', col2: '22% (existing) / 15% (new mfg)', col3: '30% on profits + surcharge' },
        { col1: 'Dividend distribution', col2: 'After tax — dividend to shareholders', col3: 'Profit share — not taxed again after firm-level tax' },
        { col1: 'Statutory audit', col2: 'Mandatory regardless of turnover', col3: 'Only if turnover > ₹40L or contribution > ₹25L' },
        { col1: 'DPIIT / Startup India', col2: 'Eligible', col3: 'Eligible' },
        { col1: 'Compliance cost (annual)', col2: 'Higher — audit, annual return, ITR', col3: 'Lower — no mandatory audit at early stage' },
        { col1: 'Credibility with banks/clients', col2: 'Higher — established norm for companies', col3: 'Accepted but less common outside professional services' },
        { col1: 'Incorporation cost (Ollvy)', col2: '₹24,999 (includes ₹15,000 MCA)', col3: '₹13,999 (includes ₹5,000 MCA)' },
      ],
    },
    {
      heading: 'When LLP is genuinely the better choice',
      body: `LLP is not a second-class entity. It's the right choice in specific situations:

**1. Professional services partnership**: CA firms, law firms, architecture practices, and consulting partnerships traditionally use LLPs. The structure maps well to how professional services firms operate — partners draw profit shares, not salaries. No mandatory audit if below the threshold. The regulated profession bodies (ICAI, Bar Council) have specific rules about LLP formation for their members.

**2. Real estate holding**: LLP is commonly used for real estate holding and investment structures because of the flexibility in profit-sharing ratios and the absence of dividend distribution tax complications.

**3. Joint ventures between established companies**: Two companies forming a JV for a specific project sometimes use LLP because it offers contractual flexibility that Pvt Ltd doesn't.

**4. When compliance cost matters more than optics**: A solo professional or small team earning ₹30–50L annually doing B2B consulting may genuinely prefer LLP's lower compliance cost — no mandatory audit saves ₹40,000–₹80,000 per year.

In all other situations — product businesses, startups, D2C, SaaS, marketplaces, e-commerce — start with Pvt Ltd.`,
    },
    {
      heading: 'The tax difference — it\'s not what most articles say',
      body: `The common claim is "LLP has lower tax." This is partly true and partly misleading.

**Corporate tax**:
- Pvt Ltd: 22% of net profit (under the new tax regime, applicable to domestic companies)
- LLP: 30% of net profit + surcharge and cess

On pure corporate tax, Pvt Ltd is lower.

**But the distribution matters**:
- Pvt Ltd profit distributed to founders: First pay 22% corporate tax, then founders pay dividend tax (typically 30% + surcharge if high income). Double taxation.
- LLP profit distributed to partners: Pay 30% at the firm level. Partner's share is NOT taxed again.

**Effective rate comparison** (for founder-operated businesses that take all profit out):
- Pvt Ltd: ~22% corporate + ~30% dividend (on remaining 78%) = effectively ~43%
- LLP: 30% flat, no further tax on partner share = 30%

This makes LLP more tax-efficient for founder-operated businesses that distribute all profits annually. But for businesses that retain earnings and reinvest — or that plan to raise money and use salary + ESOP instead of dividends — Pvt Ltd is better.

The right answer depends entirely on your specific situation. Ask a CA.`,
      note: 'Tax rates as per Finance Act 2023. Surcharge and cess apply in addition. Individual circumstances vary significantly.',
    },
  ],
};
