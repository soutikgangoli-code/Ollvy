import { LearnPageConfig } from '../pages'

export const gstRegistration: LearnPageConfig = {
  slug: 'do-i-need-gst-registration',
  title: 'Do I Need GST Registration?',
  seoTitle: 'Do I Need GST Registration in India 2025? | Ollvy',
  seoDescription:
    'Find out if GST registration is mandatory for your business in India. Covers turnover thresholds, exemptions, interstate supply rules, and e-commerce.',
  canonicalUrl: 'https://www.ollvy.com/guides/do-i-need-gst-registration',
  lastReviewed: 'April 2026',
  category: 'Tax',
  ctaServiceSlug: 'gst-registration',
  relatedServiceSlugs: ['gst-registration', 'gst-monthly'],
  relatedLearnSlugs: ['pvt-ltd-vs-llp', 'do-i-need-to-file-itr', 'is-msme-registration-worth-it'],
  relatedTools: {
    penaltyCalculators: ['gst-late-filing'],
    documentChecklists: ['gst-registration'],
  },

  tool: {
    type: 'eligibility',
    title: 'Is GST Registration Mandatory for You?',
    questions: [
      {
        text: 'What was your turnover in the last 12 months?',
        options: [
          { value: 'below_20l', label: 'Below Rs. 20 lakh' },
          { value: '20l_to_40l', label: 'Rs. 20 lakh to Rs. 40 lakh' },
          { value: 'above_40l', label: 'Above Rs. 40 lakh' },
        ],
        earlyExit: (answer) => {
          if (answer === 'above_40l') {
            return {
              type: 'mandatory',
              headline: 'GST registration is mandatory.',
              body: 'Your turnover is above Rs. 40 lakh. Register within 30 days of crossing this threshold.',
              ctaLabel: 'Get GST Registration',
              ctaHref: '/checkout/gst-registration',
            }
          }
          return null
        },
      },
      {
        text: 'Do you make any interstate sales - goods or services to customers in other states?',
        options: [
          { value: 'yes_interstate', label: 'Yes, I sell to customers in other states' },
          { value: 'no_local', label: 'No, everything is within my state' },
          { value: 'not_sure', label: 'Not sure' },
        ],
        earlyExit: (answer) => {
          if (answer === 'yes_interstate') {
            return {
              type: 'mandatory',
              headline: 'GST registration is mandatory.',
              body: 'Any interstate supply triggers mandatory registration - there is no turnover threshold for this. Even a single sale to a customer in another state applies.',
              ctaLabel: 'Get GST Registration',
              ctaHref: '/checkout/gst-registration',
            }
          }
          return null
        },
      },
      {
        text: 'Do you sell through e-commerce platforms like Amazon, Flipkart, or Swiggy?',
        options: [
          { value: 'yes_ecommerce', label: 'Yes, I sell through e-commerce' },
          { value: 'no_ecommerce', label: 'No, I sell only through my own channels' },
        ],
        earlyExit: (answer) => {
          if (answer === 'yes_ecommerce') {
            return {
              type: 'mandatory',
              headline: 'GST registration is mandatory.',
              body: 'E-commerce sellers must register from day one - Section 24(ix), CGST Act. There is no Rs. 20 lakh threshold for this.',
              ctaLabel: 'Get GST Registration',
              ctaHref: '/checkout/gst-registration',
            }
          }
          return null
        },
      },
      {
        text: 'What kind of business do you run?',
        options: [
          { value: 'services', label: 'Service-based (consulting, freelancing, IT, etc.)' },
          { value: 'goods', label: 'Trading goods' },
          { value: 'manufacturing', label: 'Manufacturing' },
          { value: 'food', label: 'Restaurant or food business' },
          { value: 'other', label: 'Something else' },
        ],
        evaluator: (answer, allAnswers) => {
          if ((answer === 'services' || answer === 'food' || answer === 'other') && allAnswers[0] === '20l_to_40l') {
            return {
              type: 'mandatory',
              headline: 'GST registration is mandatory for you.',
              body: 'For service providers (including food, restaurants, and most other businesses), the threshold is Rs. 20 lakh. Your turnover is above it. The Rs. 40 lakh threshold applies only to businesses that exclusively sell goods.',
              ctaLabel: 'Get GST Registration',
              ctaHref: '/checkout/gst-registration',
            }
          }
          if ((answer === 'goods' || answer === 'manufacturing') && allAnswers[0] === '20l_to_40l') {
            return {
              type: 'not_required',
              headline: 'Not mandatory yet - but check your state.',
              body: 'For goods sellers in most states, the threshold is Rs. 40 lakh. Your turnover is below this. However, if you are in a special category state (J&K, Himachal Pradesh, Uttarakhand, or the North-Eastern states), the threshold drops to Rs. 20 lakh and registration would be mandatory.',
            }
          }
          return null
        },
      },
    ],
    defaultResult: {
      type: 'recommended',
      headline: 'Registration is not mandatory right now - but consider it.',
      body: 'Your turnover is below the threshold and you have no mandatory triggers. Still, voluntary registration lets you claim input tax credit on your purchases, issue GST invoices to business clients, and scale without disruption. If any clients are asking for your GSTIN, register.',
    },
  },

  sections: [
    {
      number: '01',
      heading: 'THE SHORT ANSWER',
      body: 'GST registration becomes mandatory the moment any of these are true:',
      bullets: [
        'Your aggregate turnover crosses Rs. 20 lakh in a financial year (Rs. 10 lakh in special category states for services, Rs. 40 lakh for goods-only suppliers in most states)',
        'You make any interstate supply - even a single sale to a customer in another state',
        'You sell through any e-commerce platform - mandatory regardless of turnover',
        'You are liable to pay tax under reverse charge',
        'You are an agent of a registered supplier',
      ],
      table: {
        caption: 'GST Registration Thresholds by Business Type (FY 2025-26)',
        headers: ['Business Type', 'Normal States', 'Special Category States*', 'Notes'],
        rows: [
          ['Services', 'Rs. 20 lakh', 'Rs. 10 lakh', 'Covers consulting, IT, freelancing, restaurants'],
          ['Goods only', 'Rs. 40 lakh', 'Rs. 20 lakh', 'Only for businesses that exclusively supply goods'],
          ['Interstate supply', 'Mandatory', 'Mandatory', 'No threshold - even one out-of-state sale triggers this'],
          ['E-commerce sellers', 'Mandatory', 'Mandatory', 'Amazon, Flipkart, Swiggy, Zomato - no exemption'],
          ['Reverse charge payer', 'Mandatory', 'Mandatory', 'Applies regardless of turnover'],
          ['Exempt goods/services only', 'Not required', 'Not required', 'e.g. fresh produce, core healthcare'],
        ],
      },
      note: 'Source: Section 22 and Section 24, Central Goods and Services Tax Act, 2017. *Special category states: Manipur, Mizoram, Nagaland, Tripura, Arunachal Pradesh, Sikkim, Meghalaya, Assam, Himachal Pradesh, Uttarakhand, J&K',
    },
    {
      number: '02',
      heading: 'INTERSTATE SUPPLY: THE TRIGGER MOST PEOPLE MISS',
      body: 'If you provide services or sell goods to customers outside your state - even if your total turnover is Rs. 5 lakh - you need GST registration. There is no threshold for interstate supply.',
      bullets: [
        'You are a Mumbai-based freelancer building a website for a Delhi client - that is an interstate supply',
        'You sell handmade products to customers across India via your own website - interstate supply',
        'You provide consulting to companies in multiple states - interstate supply',
      ],
      note: 'Source: Section 24, CGST Act. One narrow exception: interstate supply of services below Rs. 20 lakh may be exempt under Notification 10/2017 Central Tax - but this does not apply to goods at all.',
    },
    {
      number: '03',
      heading: 'E-COMMERCE: NO THRESHOLD AT ALL',
      body: 'Selling through any e-commerce platform means mandatory registration from day one. No turnover threshold applies.',
      bullets: [
        'Amazon, Flipkart, Meesho, Myntra - any marketplace',
        'Swiggy, Zomato, Dunzo - any food or delivery platform',
        'Urban Company and similar service platforms',
        'Your own website if you use a payment gateway and ship to multiple states',
      ],
      note: 'Source: Section 24(ix), CGST Act 2017. The platform must deduct TCS from your sales - that mechanism only works with a GSTIN.',
    },
    {
      number: '04',
      heading: 'WHEN YOU GENUINELY DO NOT NEED GST',
      body: 'You are exempt if all of these are true at the same time:',
      bullets: [
        'Your aggregate turnover is below the threshold for your business type and state',
        'You make no interstate supply',
        'You sell through no e-commerce platform',
        'You are not liable to pay reverse charge',
        'You deal only in GST-exempt goods or services (fresh vegetables, certain healthcare, core education)',
        'You are engaged exclusively in agriculture',
      ],
      note: 'Having a bank account, Udyam certificate, or shop licence does not automatically trigger GST registration. These are separate things.',
    },
    {
      number: '05',
      heading: 'WHY EXEMPT BUSINESSES SOMETIMES REGISTER ANYWAY',
      body: 'Voluntary registration exists for practical reasons.',
      bullets: [
        'Input Tax Credit: If you are registered, you can claim back the GST you pay on purchases and reduce your tax liability',
        'B2B credibility: Business clients can only claim ITC from registered suppliers - without your GSTIN, they absorb that tax as a cost',
        'Tender eligibility: Government tenders often require GSTIN as a baseline condition',
        'E-commerce readiness: If you plan to sell on Amazon or Flipkart in the future, you will need GSTIN anyway',
        'Loan applications: Banks increasingly ask for GST returns as income proof',
      ],
      note: 'Voluntary registration is under Section 25(3) of the CGST Act. Once you register voluntarily, all provisions of the Act apply, including return filing obligations.',
    },
    {
      number: '06',
      heading: 'WHAT HAPPENS IF YOU DO NOT REGISTER WHEN YOU SHOULD',
      body: '',
      bullets: [
        'Penalty: 100% of the tax due or Rs. 10,000, whichever is higher (Section 122)',
        'Interest: 18% per annum on unpaid tax from the date it was due',
        'No ITC recovery: You cannot claim back GST paid on purchases while you were unregistered',
        'Seizure: Goods can be seized if transported without valid GST documents',
        'Prosecution: Evasion above Rs. 2 crore can lead to arrest without warrant',
      ],
      note: 'Use our penalty calculator for exact amounts: /tools/penalty-calculator/gst-late-filing',
    },
  ],

  faqs: [
    {
      q: 'I am a freelancer earning Rs. 15 lakh per year. All my clients are in my state. Do I need GST?',
      a: 'If all your clients are in the same state and your aggregate turnover is below Rs. 20 lakh, GST registration is not mandatory. But verify carefully - even one client in another state makes registration compulsory.',
    },
    {
      q: 'What is the difference between aggregate turnover and taxable turnover?',
      a: 'Aggregate turnover includes the total value of all taxable supplies, exempt supplies, exports, and interstate supplies - calculated on a PAN-India basis, not state-wise. Taxable turnover is only the portion subject to GST. For determining the registration threshold, aggregate turnover is what matters.',
    },
    {
      q: 'Can I register for GST even if I am below the threshold?',
      a: 'Yes. Section 25(3) allows voluntary registration. Once registered, you can issue tax invoices, collect GST, and claim input tax credit. Many small businesses register voluntarily for credibility and to work with larger clients.',
    },
    {
      q: 'I sell on Instagram and WhatsApp. Is that e-commerce?',
      a: 'No. Selling directly via social media is not e-commerce under GST law. The e-commerce provision applies only when you sell through a platform that facilitates the transaction (like Amazon or Swiggy). Direct social selling is treated like any other direct sale.',
    },
    {
      q: 'What happens if I cross the threshold mid-year?',
      a: 'You must apply for GST registration within 30 days of crossing the threshold. GST liability starts from the date you became liable, not the date you registered. Late registration means you owe GST on all supplies made after crossing the threshold.',
    },
  ],
}
