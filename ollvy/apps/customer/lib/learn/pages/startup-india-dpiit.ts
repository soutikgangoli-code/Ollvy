// lib/learn/pages/startup-india-dpiit.ts
import { LearnPageConfig } from '../pages';

export const startupIndiaDpiit: LearnPageConfig = {
  slug: 'startup-india-dpiit-recognition',
  title: 'Startup India DPIIT Recognition — Eligibility, Benefits, and How to Apply',
  seoTitle: 'Startup India DPIIT Recognition (2025) — Eligibility, Tax Benefits, How to Apply | Ollvy',
  seoDescription: 'Complete guide to DPIIT recognition under Startup India. Check eligibility, understand 80IAC tax holiday and angel tax exemption, and apply in 5 working days.',
  canonicalUrl: 'https://ollvy.com/learn/startup-india-dpiit-recognition',
  lastReviewed: 'March 2025',
  category: 'Startup',
  ctaServiceSlug: 'startup-india-dpiit',
  ctaSecondarySlug: 'msme-udyam',
  relatedServiceSlugs: ['pvt-ltd-incorporation', 'gst-registration', 'trademark-registration'],
  relatedLearnSlugs: ['how-to-register-gst-india', 'pvt-ltd-vs-llp', 'msme-registration-benefits'],

  tool: {
    type: 'eligibility',
    title: 'Does your startup qualify for DPIIT recognition?',
    questions: [
      {
        text: 'What is your business entity type?',
        options: [
          { value: 'pvt_ltd', label: 'Private Limited Company' },
          { value: 'llp', label: 'Limited Liability Partnership (LLP)' },
          { value: 'partnership', label: 'Registered Partnership Firm' },
          { value: 'proprietor', label: 'Sole Proprietorship' },
          { value: 'not_incorporated', label: 'Not incorporated yet' },
        ],
        earlyExit: (answer) => {
          if (answer === 'proprietor') return {
            type: 'ineligible',
            headline: 'Sole proprietorships cannot get DPIIT recognition.',
            body: 'DPIIT recognition requires a Pvt Ltd, LLP, or Registered Partnership Firm. Incorporate as a Pvt Ltd first — it takes 15 working days and ₹24,999. Most startups choose Pvt Ltd for easier equity structure and future funding.',
          };
          if (answer === 'not_incorporated') return {
            type: 'ineligible',
            headline: 'You need to incorporate first.',
            body: 'DPIIT recognition is post-incorporation. Incorporate as a Pvt Ltd (recommended for startups), then apply for recognition. Both can be done through Ollvy — Pvt Ltd takes 15 days, DPIIT recognition takes 5 days after that.',
          };
          return null;
        },
      },
      {
        text: 'When was your company incorporated?',
        options: [
          { value: 'under_2y', label: 'Less than 2 years ago' },
          { value: '2_5y', label: '2–5 years ago' },
          { value: '5_10y', label: '5–10 years ago' },
          { value: 'over_10y', label: 'More than 10 years ago' },
        ],
        earlyExit: (answer) => {
          if (answer === 'over_10y') return {
            type: 'ineligible',
            headline: 'Your company is too old for DPIIT recognition.',
            body: 'DPIIT recognition requires incorporation within the last 10 years. Your company doesn\'t qualify. MSME (Udyam) registration has no age restriction and provides lending benefits, payment protection, and government scheme access — apply for that instead.',
          };
          return null;
        },
      },
      {
        text: 'Has your annual turnover ever exceeded ₹100 crore?',
        options: [
          { value: 'no', label: 'No — never crossed ₹100 crore' },
          { value: 'yes', label: 'Yes — we\'ve crossed ₹100 crore in a year' },
        ],
        earlyExit: (answer) => {
          if (answer === 'yes') return {
            type: 'ineligible',
            headline: 'Your company has exceeded the DPIIT turnover limit.',
            body: 'DPIIT recognition requires that annual turnover has never exceeded ₹100 crore in any financial year. Once you\'ve crossed this, recognition is no longer available.',
          };
          return null;
        },
      },
      {
        text: 'Does your business use technology or innovation in its core offering?',
        options: [
          { value: 'yes_tech', label: 'Yes — technology is central to how we deliver value' },
          { value: 'yes_process', label: 'We\'ve innovated the process, but it\'s not purely tech' },
          { value: 'no', label: 'No — we\'re a traditional business model' },
          { value: 'unsure', label: 'Not sure — help me understand the criteria' },
        ],
        evaluator: (answer) => {
          if (answer === 'yes_tech' || answer === 'yes_process') return {
            type: 'eligible',
            headline: 'Your startup qualifies for DPIIT recognition.',
            body: 'You meet all four eligibility criteria: incorporated as Pvt Ltd/LLP, within 10 years, below ₹100Cr turnover, and technology/innovation-based business model. Recognition takes 5 working days. The benefits — angel tax exemption, 80IAC tax holiday, patent fee reduction — are active from the date of recognition.',
            ctaLabel: 'Apply for DPIIT Recognition — ₹4,999',
          };
          if (answer === 'no') return {
            type: 'conditional',
            headline: 'DPIIT recognition may be harder to get, but not impossible.',
            body: 'The "innovation" criterion is interpreted broadly by DPIIT. A restaurant chain with a proprietary ordering system qualifies. A construction firm with a unique material innovation qualifies. DPIIT has rejected purely traditional business models. Our CS can review your business description and advise before you apply.',
          };
          return {
            type: 'conditional',
            headline: 'The innovation criterion is broader than most people think.',
            body: 'DPIIT has approved recognition for SaaS companies, D2C brands, marketplace businesses, and tech-enabled services. The test is not whether you\'ve invented something new — it\'s whether technology or innovation is a meaningful part of how you create or deliver value. A cloud kitchen with an ordering app qualifies. An offline restaurant without technology usually doesn\'t.',
          };
        },
      },
    ],
  },

  sections: [
    {
      heading: 'What is Startup India / DPIIT recognition?',
      body: `The Department for Promotion of Industry and Internal Trade (DPIIT), under the Ministry of Commerce and Industry, runs the Startup India initiative. Recognition is a government certification that your company qualifies as a "startup" under the Startup India Action Plan (2016).

Recognition is self-certified — you apply on the Startup India portal, certify that you meet the criteria, and DPIIT issues the certificate within 2–5 working days. There is no physical inspection or third-party verification at the time of application.

The recognition is permanent once issued. It doesn't expire as long as your company continues to meet the criteria (under 10 years old, under ₹100Cr turnover).`,
    },
    {
      heading: 'Eligibility criteria — specific',
      body: `All four conditions must be met:

**1. Entity type**: Must be incorporated as a Private Limited Company, Limited Liability Partnership (LLP), or Registered Partnership Firm. Sole proprietorships and one-person companies do not qualify.

**2. Age**: Incorporated less than 10 years ago.

**3. Turnover**: Annual turnover has never exceeded ₹100 crore in any financial year since incorporation.

**4. Innovation**: Working towards innovation, development, or deployment of new products/processes/services, OR has a scalable business model with high potential for job creation or wealth generation.

**On the innovation criterion** — this is where most founders are unsure. DPIIT has approved recognition for:
- SaaS and software products
- D2C brands with proprietary products
- Marketplace businesses (Ollvy included)
- Tech-enabled professional services
- Food businesses with technology in ordering, delivery, or production
- Hardware and IoT products
- Agritech, edtech, fintech, healthtech — all approved regularly

What DPIIT does not approve: purely traditional business models with no technology or innovation component — offline retail, construction, transport without tech, generic trading companies.

**The write-up is the application**: When you apply, you submit a 300–500 word description of your innovation. The quality of this write-up determines approval. Most DIY applications that get rejected have vague descriptions — "we use technology to deliver seamless solutions." Our CS helps you write a specific, verifiable description.`,
      note: 'Eligibility defined under G.S.R. 364(E) — DPIIT Notification dated April 11, 2018, as amended.',
    },
    {
      heading: 'What recognition gives you — with actual numbers',
      body: `Recognition itself gives you nothing — it's the gateway to applying for the specific benefits. Here's what each benefit actually means:

**1. Section 80IAC — 3-year income tax holiday**

After getting DPIIT recognition, you can apply to the Inter-Ministerial Board (IMB) for the 80IAC deduction. If approved, profits in any 3 consecutive years out of the first 10 years of incorporation are 100% exempt from income tax.

*What this means in rupees*: A startup that makes ₹50 lakh profit in year 3 would normally pay approximately ₹13 lakh corporate tax (26% effective rate). With 80IAC approval, that's ₹0. Over 3 profitable years at ₹50L/year, that's ₹39 lakh saved.

Important: 80IAC is a separate application to the IMB, not automatic from DPIIT recognition. Most startups get DPIIT recognition but miss this step. Ollvy's CS flags this and helps file the 80IAC application as part of the DPIIT service.

**2. Angel tax exemption — Section 56(2)(viib)**

Without DPIIT recognition, if an investor pays more than the "fair market value" of your shares, the excess is treated as income and taxed in the company's hands. This is angel tax — it can trigger a 30%+ tax liability on your funding round.

With DPIIT recognition, your startup is exempt from Section 56(2)(viib). Investments at any valuation are not treated as income. This is the single most important reason to get recognised before your first external funding round.

*Example*: You raise ₹50 lakh at a ₹5 crore valuation. The IT department determines fair market value as ₹2 crore. Without recognition, ₹30 lakh (the "excess") is taxed at 30% — that's ₹9 lakh tax on your funding. With recognition, ₹0.

**3. Government procurement — no prior experience required**

DPIIT-recognised startups can bid for government tenders without meeting the standard eligibility requirements for prior turnover or number of years in operation. For startups targeting government contracts, this removes a major barrier.

**4. Patent and trademark fee reduction**

- Patent application fee: Reduced by 80% (from ₹16,000 to ₹3,200 for a natural person/startup)
- Trademark examination fee: Also reduced
- Fast-track examination available for patents

**5. Self-certification for 9 labour and environment laws**

DPIIT-recognised startups can self-certify compliance with certain labour and environment laws for 3–5 years, reducing compliance burden in the early years. Not applicable once you have more than 20 employees for most provisions.`,
      note: 'Tax exemption references: Section 80IAC, Income Tax Act 1961. Angel tax exemption: Section 56(2)(viib), Income Tax Act 1961. Patent fee: Office of the Controller General of Patents, Designs & Trade Marks (CGPDTM).',
    },
    {
      heading: 'The application process',
      componentSlot: 'process-stepper',
      body: 'You can apply on the Startup India portal yourself. The process below is what Ollvy\'s CS does on your behalf.',
      componentProps: {
        steps: [
          {
            step: 1, title: 'Register on the Startup India portal', timeline: 'Day 0',
            body: 'Create an account at startupindia.gov.in using your company PAN and a director\'s email. Your CS does this for you and adds you as a collaborator so you retain access permanently.',
            visual: 'form',
          },
          {
            step: 2, title: 'Startup profile + innovation write-up', timeline: 'Day 0–1',
            body: 'The most important step. Fill your company details, upload Certificate of Incorporation and PAN, and submit the innovation description (300–500 words). Your CS drafts the write-up based on your business model. We\'ve never had a rejection when the write-up is specific and accurate.',
            visual: 'form', milestone: 'Write-up drafted and approved by you',
          },
          {
            step: 3, title: 'Self-certification and submission', timeline: 'Day 1',
            body: 'You certify that all information is accurate. The certification is a legal declaration. Your CS reviews the entire application before you certify.',
            visual: 'checklist',
          },
          {
            step: 4, title: 'DPIIT Recognition Certificate issued', timeline: 'Day 2–5',
            body: 'DPIIT reviews and issues the recognition certificate with your DPIIT number. Certificate is downloaded and stored in your Ollvy account. CS then initiates the 80IAC IMB application separately if you want the tax holiday.',
            visual: 'stamp', isCompletion: true, milestone: 'DPIIT Recognition Certificate issued',
          },
        ],
      },
    },
    {
      heading: 'DPIIT vs MSME — get both',
      body: `These are two completely different registrations with different benefits. Both can be held simultaneously. Both are one-time.

| | DPIIT (Startup India) | MSME (Udyam) |
|---|---|---|
| Who can apply | Pvt Ltd, LLP, Partnership | Any business including proprietor |
| Age limit | Under 10 years | No limit |
| Turnover limit | Under ₹100 crore | Under ₹250 crore |
| Key benefits | Tax holiday, angel tax exemption, patent fees | Priority lending, payment protection |
| Government fee | ₹0 | ₹0 |
| Ollvy fee | ₹4,999 | ₹1,999 |
| Time | 5 working days | 2 working days |

A 2-year-old Pvt Ltd startup qualifies for both. Register for both. Total: ₹6,998 for two registrations that can save lakhs in tax and unlock crores in lending access.`,
    },
    {
      heading: 'The 80IAC application — the step most founders miss',
      body: `DPIIT recognition gets you eligibility for the 80IAC tax holiday. Claiming it requires a separate application to the Inter-Ministerial Board (IMB).

**How to apply for 80IAC**:
1. Log in to the Startup India portal with your DPIIT-recognised account
2. Navigate to Tax Exemption → Section 80IAC
3. Upload: CIN, audited financials, board resolution, business plan (detailed)
4. IMB reviews within 45–90 days

**The business plan requirement is where most applications fail**. The IMB wants to see:
- Current business model and revenue streams
- Technology or innovation central to the business (with evidence — patents, proprietary tech, unique process)
- Market opportunity and scalability
- 3-year financial projections

This is not a compliance filing — it's closer to a VC pitch deck in format. Ollvy handles 80IAC applications as an add-on to the DPIIT service. Ask at checkout.

**When to apply**: Apply as soon as you have your first profitable year or expect one within 12 months. The clock on your "3 years out of 10" starts when you first claim the deduction — there's no penalty for applying late other than losing the window.`,
      note: 'Section 80IAC: Deduction in respect of profits and gains from eligible business of an eligible start-up. Income Tax Act 1961, as amended by Finance Act 2019.',
    },
    {
      heading: 'Frequently asked questions',
      componentSlot: 'faq-list',
      body: '',
      componentProps: {
        faqs: [
          { q: 'Can I apply for DPIIT recognition if I haven\'t started generating revenue?', a: 'Yes. Revenue is not part of the eligibility criteria. Pre-revenue startups apply and get recognised regularly. The application requires you to describe your business model and innovation — not your revenue.' },
          { q: 'Does DPIIT recognition need to be renewed?', a: 'No. Recognition is permanent once issued. It doesn\'t expire. Your DPIIT number stays active as long as your company meets the criteria (under 10 years, under ₹100Cr turnover).' },
          { q: 'My startup is an LLP. Am I eligible?', a: 'Yes. LLPs registered in India are eligible for DPIIT recognition. The process is identical to Pvt Ltd. Note that LLPs cannot issue equity shares — angel tax exemption applies differently (profit share vs equity). Consult a CA before your first external investment.' },
          { q: 'What happens if my turnover crosses ₹100 crore after recognition?', a: 'Your recognition remains valid but you no longer qualify as a "startup" for future applications or renewals. Existing benefits are not clawed back — you keep what you\'ve already claimed.' },
          { q: 'Is DPIIT recognition the same as "Startup India" registration?', a: 'Yes. "Startup India registration," "DPIIT recognition," and "Startup India certification" all refer to the same thing — a recognition certificate issued by DPIIT under the Startup India initiative.' },
          { q: 'Will DPIIT recognition help with fundraising?', a: 'Directly, yes — through the angel tax exemption (Section 56(2)(viib)), which means your investors can invest at any valuation without triggering a tax liability. It doesn\'t directly help you get investments, but it removes a compliance obstacle that some investors and their CAs flag during due diligence.' },
        ],
      },
    },
  ],
};
