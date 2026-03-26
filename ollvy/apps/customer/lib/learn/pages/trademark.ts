// lib/learn/pages/trademark.ts
import { LearnPageConfig } from '../pages';

export const trademarkRegistration: LearnPageConfig = {
  slug: 'do-i-need-trademark-registration',
  title: 'Do I Need Trademark Registration?',
  seoTitle: 'Do I Need to Register a Trademark in India 2025? | Ollvy',
  seoDescription: 'Find out if trademark registration makes sense for your brand in India. Understand protection, costs, enforcement, and when to prioritise it in 2025.',
  canonicalUrl: 'https://www.ollvy.com/learn/do-i-need-trademark-registration',
  lastReviewed: 'March 2025',
  category: 'Registration',
  ctaServiceSlug: 'trademark-registration',
  relatedServiceSlugs: ['trademark-registration'],
  relatedLearnSlugs: ['pvt-ltd-vs-llp', 'should-i-get-dpiit-startup-recognition', 'is-msme-registration-worth-it'],

  tool: {
    type: 'eligibility',
    title: 'Should You Register Your Trademark?',
    questions: [
      {
        text: 'How central is your brand name or logo to your business?',
        options: [
          { value: 'very_central', label: 'It is the product - customers search for us by name' },
          { value: 'important', label: 'It matters, but we also compete on quality and relationships' },
          { value: 'not_central', label: 'We are a B2B supplier or white-label; the brand is less important' },
        ],
        earlyExit: (answer) => {
          if (answer === 'very_central') {
            return {
              type: 'mandatory',
              headline: 'Trademark registration is strongly recommended.',
              body: 'Consumer brands and D2C companies where the name is the primary recall are at very high risk without trademark protection. Someone else can register your name and force you to rebrand.',
              ctaLabel: 'Register My Trademark',
              ctaHref: '/checkout/trademark-registration',
            };
          }
          return null;
        },
      },
      {
        text: 'Have you spent money building brand awareness in the last 12 months?',
        options: [
          { value: 'significant_investment', label: 'Yes - significant spend on ads, packaging, or marketing' },
          { value: 'some_investment', label: 'Some - social media and basic content' },
          { value: 'no_investment', label: 'Not yet - we have not started marketing' },
        ],
        earlyExit: (answer) => {
          if (answer === 'significant_investment') {
            return {
              type: 'mandatory',
              headline: 'Register your trademark urgently.',
              body: 'Brand equity built without a trademark is legally unprotected. Someone can register the same name and send you a cease-and-desist. Protect your investment now.',
              ctaLabel: 'Register My Trademark',
              ctaHref: '/checkout/trademark-registration',
            };
          }
          return null;
        },
      },
      {
        text: 'Is anyone else using a similar name in your industry?',
        options: [
          { value: 'yes_similar', label: 'Yes, there are similar names out there' },
          { value: 'not_sure', label: 'Not sure - I have not checked' },
          { value: 'unique', label: 'Our name is unique - nothing similar exists' },
        ],
        earlyExit: (answer) => {
          if (answer === 'yes_similar') {
            return {
              type: 'mandatory',
              headline: 'Register immediately - you are at risk.',
              body: 'You are at risk of a trademark objection or an infringement claim. Do a trademark search immediately and register before investing further in the brand.',
              ctaLabel: 'Register My Trademark',
              ctaHref: '/checkout/trademark-registration',
            };
          }
          if (answer === 'not_sure') {
            return {
              type: 'recommended',
              headline: 'Do a search and register.',
              body: 'Run a free search on the IP India portal before spending another rupee on marketing. Then register to secure your brand.',
              ctaLabel: 'Register My Trademark',
              ctaHref: '/checkout/trademark-registration',
            };
          }
          return null;
        },
      },
      {
        text: 'Are any of these in your plans?',
        options: [
          { value: 'yes_expand', label: 'Expanding internationally or licensing my brand' },
          { value: 'yes_funding', label: 'Raising investor funding' },
          { value: 'no_local', label: 'None of these - staying India-focused and self-funded' },
        ],
        evaluator: (answer) => {
          if (answer === 'yes_expand') {
            return {
              type: 'mandatory',
              headline: 'International trademark protection starts with Indian registration.',
              body: 'Convention applications in other countries require a home country registration. Register in India first.',
              ctaLabel: 'Register My Trademark',
              ctaHref: '/checkout/trademark-registration',
            };
          }
          if (answer === 'yes_funding') {
            return {
              type: 'recommended',
              headline: 'Register before your funding round.',
              body: 'Investors check IP as part of due diligence. An unregistered brand is a flag that can delay a deal.',
              ctaLabel: 'Register My Trademark',
              ctaHref: '/checkout/trademark-registration',
            };
          }
          return null;
        },
      },
    ],
    defaultResult: {
      type: 'recommended',
      headline: 'Not urgent right now - but register before you scale',
      body: 'Your brand exposure is moderate at the moment. The cost of registering is Rs. 4,500 (for individuals and small entities) and the process is much better than it used to be. Do it before you invest heavily in marketing - because after that point, if someone else has registered the same name, you have no legal recourse.',
    },
  },

  sections: [
    {
      number: '01',
      heading: 'WHAT A TRADEMARK ACTUALLY DOES FOR YOU',
      body: "A trademark is a legally recognised sign - a name, a logo, a tagline, or a combination of these - that identifies your products or services as yours and not someone else's. Once you register it under the Trade Marks Act, 1999, you have the exclusive right to use that mark commercially in India for 10 years (and you can keep renewing it forever). More importantly, you get the legal power to stop others from using the same or a confusingly similar mark in your category of business.",
      note: 'Source: Trade Marks Act, 1999; Trade Marks Rules, 2017',
    },
    {
      number: '02',
      heading: 'WHEN YOU REALLY CANNOT AFFORD TO WAIT',
      body: 'In these situations, trademark registration is not a "nice to have" - it is urgent.',
      bullets: [
        'You are spending on ads, packaging, or social media - every rupee you spend is building value in a brand that is currently unprotected. Someone can swoop in and register it.',
        'You sell on Amazon or Flipkart - both platforms have brand registry programs that require trademark registration. Without it, your listings are vulnerable to hijackers and copycats.',
        'You run a SaaS or tech product - your product name is your primary asset. A competitor in the same space can register a similar name if you do not act first.',
        'You plan to franchise or license - legally, you cannot license a brand you do not own as a registered trademark.',
        'You are raising investor funding - IP due diligence will catch an unregistered brand. This can delay or complicate your round.',
        'In India, trademark rights generally go to whoever registers first. Waiting means someone else can register your own name and force you to change it.',
      ],
      note: 'Source: Section 28, Trade Marks Act, 1999',
    },
    {
      number: '03',
      heading: 'WHEN YOU CAN TAKE A BIT MORE TIME',
      body: 'These situations are lower urgency, but you should still set a timeline.',
      bullets: [
        'You are in the early stages and still validating your product - aim to register within 6 months of committing to a name',
        'You are a B2B service firm that mostly gets work through referrals - the risk of someone copying your brand name is lower, but register before you hit a scale where rebranding would hurt',
        'You run a local service business (salon, restaurant, regional brand) - register before you open your second location',
      ],
    },
    {
      number: '04',
      heading: 'WHEN IT IS GENUINELY NOT URGENT',
      body: '',
      bullets: [
        'You are still figuring out your product and have not settled on a name',
        'You are a pure white-label supplier with no consumer-facing brand',
        'You work under your own name serving a small local client base',
        'You have already done a thorough trademark search and the field is clear',
      ],
      note: 'A note: even without a registered trademark, you can claim some protection against copycats under the legal concept of "passing off" (Section 27, Trade Marks Act). But proving passing off means demonstrating prior reputation and goodwill in court - which is expensive, slow, and uncertain. Registration is far simpler.',
    },
    {
      number: '05',
      heading: 'THE REAL RISKS OF SKIPPING REGISTRATION',
      body: 'This is what actually happens to businesses that delay.',
      bullets: [
        'Someone else registers your name - even in bad faith - and legally demands you stop using it',
        'You get a cease-and-desist letter from a registered trademark holder, even if you have been using the name longer than them. Without a registration, your protection is limited to expensive and uncertain litigation.',
        'Without a registered trademark, you cannot enrol in Amazon Brand Registry - leaving your product listings open to unauthorised sellers and piggybackers',
        'Competitors can file IP infringement complaints against your marketplace listings if they have a registered mark and you do not',
        'In M&A or funding due diligence, an unregistered brand is flagged as an IP risk that can affect valuation or deal terms',
      ],
    },
    {
      number: '06',
      heading: 'THE COST IS LOW ENOUGH THAT THE QUESTION IS JUST WHEN',
      body: 'Trademark registration costs Rs. 4,500 per class if you are an individual or small entity, and Rs. 9,000 for other businesses. That is the government fee - not per year, per 10 years.',
      bullets: [
        'You have decided on a name and have started any marketing at all? Register within the next 30 days.',
        'You are raising funding or planning an M&A? Register today.',
        'You are expanding to a second city, a new product, or a new category? Register before that expansion.',
        'Still testing your product-market fit? Do a free search on the IP India portal now, and register the moment you commit to the name.',
        'Renewal cost: Rs. 9,000-10,000 every 10 years. That is the cost of protecting your brand.',
      ],
    },
  ],

  faqs: [
    {
      q: 'How long does trademark registration actually take?',
      a: 'Your application is filed and gets a filing date immediately - and your rights are protected from that date, not the final registration date. From filing to receiving your official registration certificate (assuming no objections), the typical timeline is 18-24 months.',
    },
    {
      q: 'What is a trademark class and which one do I need?',
      a: 'Goods and services are divided into 45 categories called classes. Class 42 is software and tech services; Class 25 is clothing; Class 35 is retail and marketing. You register per class. Using the wrong class means you are unprotected in the category you actually operate in. Most businesses need 1-3 classes.',
    },
    {
      q: 'Can I trademark a common word like "Fresh" or "Quick"?',
      a: 'Descriptive or generic words are very difficult to register on their own. But a distinctive combination, a stylised logo, or a word used in an unexpected context (think: Apple for computers) can be protected. A trademark attorney can tell you whether your name is protectable before you build a business around it.',
    },
    {
      q: 'What do TM, R, and C symbols mean?',
      a: 'TM can be used by anyone who claims rights to a mark - even without registration. R can only be used once your trademark is officially registered - using it before registration is an offence. C applies to creative works like art, music, or writing, not to trademarks.',
    },
    {
      q: 'Do I need a trademark or a copyright for my logo?',
      a: 'Both can apply. Copyright protects the artistic creation automatically from the moment it is made. Trademark protects the logo as a brand identifier in commerce. For a business, trademark registration is usually more important because it gives you enforceable commercial rights and a practical way to stop copycats.',
    },
  ],
};
