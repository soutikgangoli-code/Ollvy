// lib/learn/pages/fssai-license.ts
import { LearnPageConfig } from '../pages';

export const fssaiLicense: LearnPageConfig = {
  slug: 'do-i-need-fssai-license',
  title: 'Do I Need an FSSAI Licence?',
  seoTitle: 'Do I Need an FSSAI Licence in India 2025? | Ollvy',
  seoDescription: 'Find out if FSSAI registration or licence is mandatory for your food business in India. Covers restaurants, cloud kitchens, home cooks, manufacturers, and importers.',
  canonicalUrl: 'https://www.ollvy.com/learn/do-i-need-fssai-license',
  lastReviewed: 'March 2025',
  category: 'Licensing',
  ctaServiceSlug: 'fssai-license',
  relatedServiceSlugs: ['fssai-license'],
  relatedLearnSlugs: ['do-i-need-shop-establishment-registration', 'do-i-need-gst-registration', 'is-msme-registration-worth-it'],

  tool: {
    type: 'eligibility',
    title: 'What FSSAI Licence Does Your Food Business Need?',
    questions: [
      {
        text: 'What does your food business do?',
        options: [
          { value: 'restaurant_cafe', label: 'Restaurant, cafe, dhaba, canteen, or cloud kitchen' },
          { value: 'manufacturer_packager', label: 'Manufacturing, processing, or packaging food products' },
          { value: 'trader_retailer', label: 'Trading, retailing, or distributing food (offline or online)' },
          { value: 'importer_exporter', label: 'Importing or exporting food' },
        ],
        earlyExit: (answer) => {
          if (answer === 'importer_exporter') {
            return {
              type: 'mandatory',
              headline: 'You need a Central FSSAI Licence.',
              body: 'All food importers and exporters need a Central licence regardless of turnover.',
              ctaLabel: 'Get FSSAI Licence',
              ctaHref: '/checkout/fssai-license',
            };
          }
          return null;
        },
      },
      {
        text: 'What is your annual turnover from food activities?',
        options: [
          { value: 'below_12l', label: 'Below Rs. 12 lakh per year' },
          { value: '12l_to_20cr', label: 'Rs. 12 lakh to Rs. 20 crore per year' },
          { value: 'above_20cr', label: 'Above Rs. 20 crore per year' },
        ],
        evaluator: (answer) => {
          if (answer === 'below_12l') {
            return {
              type: 'mandatory',
              headline: 'You need Basic FSSAI Registration (Form A).',
              body: 'Petty food businesses with turnover below Rs. 12 lakh need Basic Registration - the simplest and cheapest option.',
              ctaLabel: 'Get FSSAI Registration',
              ctaHref: '/checkout/fssai-license',
            };
          }
          if (answer === '12l_to_20cr') {
            return {
              type: 'mandatory',
              headline: 'You need a State FSSAI Licence (Form B).',
              body: 'Food businesses with turnover between Rs. 12 lakh and Rs. 20 crore need a State FSSAI Licence.',
              ctaLabel: 'Get FSSAI Licence',
              ctaHref: '/checkout/fssai-license',
            };
          }
          if (answer === 'above_20cr') {
            return {
              type: 'mandatory',
              headline: 'You need a Central FSSAI Licence.',
              body: 'Food businesses with turnover above Rs. 20 crore need a Central FSSAI Licence.',
              ctaLabel: 'Get FSSAI Licence',
              ctaHref: '/checkout/fssai-license',
            };
          }
          return null;
        },
      },
    ],
    defaultResult: {
      type: 'mandatory',
      headline: 'Yes - any food business needs FSSAI',
      body: 'Under the Food Safety and Standards Act, 2006, anyone involved in the manufacture, processing, distribution, sale, or import of food must be registered or licensed. This applies to every food business - from a home baker selling on Instagram to a national food chain.',
    },
  },

  sections: [
    {
      number: '01',
      heading: 'THREE TIERS, AND WHICH ONE IS YOURS',
      body: 'The Food Safety and Standards Act, 2006 does not apply a one-size-fits-all approach. There are three tiers depending on the scale of your food operation. The right tier matters - using the wrong one is treated as non-compliance.',
      bullets: [
        'Basic Registration (Form A): For small food businesses - home-based food sellers, petty manufacturers, small canteens, and temporary stall holders - with annual turnover below Rs. 12 lakh. This is the simplest and cheapest option. Issued by the local Food Safety Officer.',
        'State FSSAI Licence (Form B - State): For food businesses with turnover between Rs. 12 lakh and Rs. 20 crore. Covers restaurants, hotels, distributors, transporters, and manufacturers operating within one state. Issued by the State Food Safety Authority.',
        'Central FSSAI Licence (Form B - Central): For businesses above Rs. 20 crore turnover, importers, exporters, central government canteens, and businesses operating across multiple states. Issued by the FSSAI central office in New Delhi.',
      ],
      note: 'Source: Food Safety and Standards (Licensing and Registration of Food Businesses) Regulations, 2011',
    },
    {
      number: '02',
      heading: 'IF YOU DEAL WITH FOOD IN ANY COMMERCIAL WAY, THIS APPLIES TO YOU',
      body: '"Food business" is defined broadly enough to cover almost every commercial food activity imaginable.',
      bullets: [
        'Restaurants, dhabas, cafes, food courts, canteens',
        'Cloud kitchens and delivery-only operations',
        'Home-based food businesses selling through Swiggy, Zomato, social media, or WhatsApp groups',
        'Bakers, confectioners, and snack makers',
        'Packaged water and beverage producers',
        'Meat, fish, and poultry processors',
        'Oil mills and flour mills',
        'Retailers, supermarkets, and kirana stores selling packaged food',
        'Food importers and exporters',
      ],
    },
    {
      number: '03',
      heading: 'A FEW THINGS PEOPLE MISS',
      body: 'Some business situations that people commonly overlook.',
      bullets: [
        'Home-based food sellers: If you are selling home-cooked food via Instagram, a WhatsApp group, or a food delivery app, you need at minimum a Basic FSSAI Registration. "I sell from home" is not an exemption.',
        'Cloud kitchens: Even with no dine-in customers, if you are preparing food for delivery, you need a State Licence.',
        'E-commerce food sellers: Selling packaged food on Amazon or Flipkart requires your FSSAI number to be printed on the packaging and displayed on the platform.',
        'Multi-state operations: If you run restaurants in more than one state, you need a Central Licence, not separate state licences.',
      ],
    },
    {
      number: '04',
      heading: 'WHO DOES NOT NEED AN FSSAI',
      body: 'The exemptions are narrow.',
      bullets: [
        'Farmers selling their own unprocessed produce directly at the farm gate - fully exempt',
        'Pure logistics companies that transport food but do not own, process, or sell it - partially exempt',
        'Religious or community events distributing free food below state-specific quantity thresholds',
      ],
      note: 'If you are charging money for food in any form, assume you need FSSAI. The exemptions are genuinely narrow.',
    },
    {
      number: '05',
      heading: 'WHAT HAPPENS IF YOU OPERATE WITHOUT FSSAI',
      body: '',
      bullets: [
        'Penalty for operating without registration or licence: Up to Rs. 5 lakh (Section 63, Food Safety and Standards Act)',
        'Unsafe or adulterated food: Up to life imprisonment and Rs. 10 lakh fine in severe cases',
        'Stock seizure: Food safety officers can seize your entire stock without a court order',
        'Platform removal: Swiggy and Zomato require a valid FSSAI number at onboarding and remove accounts that do not maintain it',
        'Amazon and Flipkart listings: Products without a valid FSSAI number on packaging are liable to be de-listed',
      ],
    },
    {
      number: '06',
      heading: 'QUICK REFERENCE',
      body: '',
      bullets: [
        'Any food business at any scale = some form of FSSAI is required',
        'Turnover below Rs. 12 lakh = Basic Registration (Form A) - simplest and cheapest',
        'Turnover Rs. 12 lakh to Rs. 20 crore, single state = State FSSAI Licence (Form B)',
        'Turnover above Rs. 20 crore, multi-state, or importer/exporter = Central FSSAI Licence',
        'On Swiggy, Zomato, or Amazon = FSSAI number required by the platform',
      ],
    },
  ],

  faqs: [
    {
      q: 'I sell home-made pickles and chutneys. Do I really need FSSAI?',
      a: 'Yes. If you are receiving payment for food, you are a food business operator in the eyes of the law. Basic Registration (the simplest tier, issued by your local food safety officer) is what you need. It is straightforward and low-cost.',
    },
    {
      q: 'How long does FSSAI registration or licensing take?',
      a: 'Basic Registration: 7 working days. State Licence: 30 days. Central Licence: 60 days. In most cases, you can display the application acknowledgement number and begin operations while you wait for the actual licence.',
    },
    {
      q: 'Does my FSSAI licence need to be renewed?',
      a: 'Yes. Registrations and licences are valid for 1 to 5 years depending on what you chose when you applied. You must renew before it expires. Operating with an expired FSSAI is treated the same as operating without one.',
    },
    {
      q: 'My restaurant is on Swiggy and Zomato. Do they check FSSAI?',
      a: 'Yes. Both platforms require you to upload your FSSAI licence at the time of onboarding and your FSSAI number is displayed on your restaurant profile for customers to see. They periodically verify it against the FSSAI database and can suspend your account if it is expired or invalid.',
    },
  ],
};
