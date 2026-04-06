import { LearnPageConfig } from '../pages'

export const fssaiLicense: LearnPageConfig = {
  slug: 'do-i-need-fssai-license',
  title: 'Do I Need an FSSAI Licence?',
  seoTitle: 'Do I Need an FSSAI Licence in India 2025? | Ollvy',
  seoDescription:
    'Find out if FSSAI registration or licence is mandatory for your food business in India. Covers restaurants, cloud kitchens, home cooks, manufacturers, and importers.',
  canonicalUrl: 'https://www.ollvy.com/guides/do-i-need-fssai-license',
  lastReviewed: 'April 2026',
  category: 'Licensing',
  ctaServiceSlug: 'fssai-license',
  relatedServiceSlugs: ['fssai-license'],
  relatedLearnSlugs: ['do-i-need-gst-registration'],

  tool: {
    type: 'eligibility',
    title: 'What FSSAI Licence Does Your Food Business Need?',
    questions: [
      {
        text: 'What does your food business do?',
        options: [
          { value: 'restaurant', label: 'Restaurant, cafe, dhaba, canteen, or cloud kitchen' },
          { value: 'manufacturing', label: 'Manufacturing, processing, or packaging food products' },
          { value: 'trading', label: 'Trading, retailing, or distributing food (offline or online)' },
          { value: 'import_export', label: 'Importing or exporting food' },
        ],
        earlyExit: (answer) => {
          if (answer === 'import_export') {
            return {
              type: 'mandatory',
              headline: 'You need a Central FSSAI Licence.',
              body: 'Food importers and exporters require a Central FSSAI Licence regardless of turnover. This is issued by the FSSAI central office in New Delhi.',
              ctaLabel: 'Get FSSAI Licence',
              ctaHref: '/checkout/fssai-license',
            }
          }
          return null
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
              headline: 'You need Basic FSSAI Registration.',
              body: 'Even the smallest food business needs at minimum a Basic Registration (Form A). Issued by your local Food Safety Officer, it is the simplest and cheapest option.',
              ctaLabel: 'Get FSSAI Licence',
              ctaHref: '/checkout/fssai-license',
            }
          }
          if (answer === '12l_to_20cr') {
            return {
              type: 'mandatory',
              headline: 'You need a State FSSAI Licence.',
              body: 'Businesses with turnover between Rs. 12 lakh and Rs. 20 crore operating within one state need a State FSSAI Licence (Form B - State). Issued by the State Food Safety Authority.',
              ctaLabel: 'Get FSSAI Licence',
              ctaHref: '/checkout/fssai-license',
            }
          }
          if (answer === 'above_20cr') {
            return {
              type: 'mandatory',
              headline: 'You need a Central FSSAI Licence.',
              body: 'Businesses above Rs. 20 crore turnover, multi-state operations, importers, and exporters need a Central FSSAI Licence (Form B - Central). Issued by the FSSAI central office.',
              ctaLabel: 'Get FSSAI Licence',
              ctaHref: '/checkout/fssai-license',
            }
          }
          return null
        },
      },
    ],
    defaultResult: {
      type: 'mandatory',
      headline: 'Yes - any food business needs FSSAI.',
      body: 'Under the Food Safety and Standards Act, 2006, anyone involved in the manufacture, processing, distribution, sale, or import of food must be registered or licensed. This applies to every food business - from a home baker selling on Instagram to a national food chain.',
    },
  },

  sections: [
    {
      number: '01',
      heading: 'THREE TIERS - AND WHICH ONE IS YOURS',
      body: 'The Food Safety and Standards Act, 2006 has three tiers depending on the scale of your food operation. Using the wrong tier is treated as non-compliance.',
      bullets: [
        'Basic Registration (Form A): For small food businesses - home-based sellers, petty manufacturers, small canteens, temporary stall holders - with annual turnover below Rs. 12 lakh. The simplest and cheapest option. Issued by the local Food Safety Officer.',
        'State FSSAI Licence (Form B - State): For food businesses with turnover between Rs. 12 lakh and Rs. 20 crore. Covers restaurants, hotels, distributors, transporters, and manufacturers operating within one state. Issued by the State Food Safety Authority.',
        'Central FSSAI Licence (Form B - Central): For businesses above Rs. 20 crore turnover, importers, exporters, central government canteens, and businesses operating across multiple states. Issued by the FSSAI central office in New Delhi.',
      ],
      table: {
        caption: 'FSSAI Registration vs Licence: Which One Do You Need?',
        headers: ['Type', 'Annual Turnover', 'Who Issues', 'Processing Time', 'Annual Fee', 'Validity'],
        rows: [
          ['Basic Registration (Form A)', 'Below Rs. 12 lakh', 'Local Food Safety Officer', '7 working days', 'Rs. 100/year', '1-5 years (chosen at application)'],
          ['State Licence (Form B - State)', 'Rs. 12 lakh to Rs. 20 crore, single state', 'State Food Safety Authority', '30 days', 'Rs. 2,000-5,000/year by category', '1-5 years'],
          ['Central Licence (Form B - Central)', 'Above Rs. 20 crore OR multi-state OR importer/exporter', 'FSSAI, New Delhi', '60 days', 'Rs. 7,500/year', '1-5 years'],
        ],
      },
      note: 'Source: Food Safety and Standards (Licensing and Registration of Food Businesses) Regulations, 2011',
    },
    {
      number: '02',
      heading: 'IF YOU DEAL WITH FOOD COMMERCIALLY, THIS APPLIES',
      body: '"Food business" is broad enough to cover almost every commercial food activity.',
      bullets: [
        'Restaurants, dhabas, cafes, food courts, canteens',
        'Cloud kitchens and delivery-only operations',
        'Home-based food businesses selling through Swiggy, Zomato, social media, or WhatsApp groups',
        'Bakers, confectioners, and snack makers',
        'Packaged water and beverage producers',
        'Meat, fish, and poultry processors',
        'Oil mills and flour mills',
        'Retailers and kirana stores selling packaged food',
        'Food importers and exporters',
      ],
      table: {
        caption: 'FSSAI Requirements by Platform and Business Type',
        headers: ['Business Type / Platform', 'Licence Required', 'Where FSSAI Number Appears'],
        rows: [
          ['Restaurant, cafe, cloud kitchen', 'State Licence (unless turnover below Rs. 12 lakh)', 'Displayed at premises, on Swiggy/Zomato profile'],
          ['Home-based food seller (Instagram, WhatsApp)', 'Basic Registration minimum', 'On packaging, in social media bio'],
          ['Swiggy / Zomato partner', 'State Licence minimum', 'Mandatory on platform profile - verified by platform'],
          ['Amazon / Flipkart food seller', 'State or Central Licence', 'Printed on packaging label, shown in product listing'],
          ['Multi-state restaurant chain', 'Central Licence', 'Displayed at all outlets under single licence'],
          ['Food manufacturer (single state)', 'State Licence or Central (if above Rs. 20 crore)', 'On all product packaging and invoices'],
          ['Food importer or exporter', 'Central Licence only', 'On all import/export documentation'],
        ],
      },
    },
    {
      number: '03',
      heading: 'THINGS PEOPLE COMMONLY MISS',
      body: '',
      bullets: [
        'Home-based food sellers: If you sell home-cooked food via Instagram, WhatsApp, or a delivery app, you need at minimum a Basic FSSAI Registration. "I sell from home" is not an exemption.',
        'Cloud kitchens: No dine-in customers does not change the requirement. Preparing food for delivery requires a State Licence.',
        'E-commerce food sellers: Selling packaged food on Amazon or Flipkart requires your FSSAI number printed on packaging and displayed on the platform.',
        'Multi-state operations: Restaurants in more than one state need a Central Licence, not separate state licences.',
      ],
    },
    {
      number: '04',
      heading: 'WHO DOES NOT NEED AN FSSAI',
      body: 'The exemptions are narrow.',
      bullets: [
        'Farmers selling their own unprocessed produce directly at the farm gate',
        'Pure logistics companies that transport food but do not own, process, or sell it',
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
        'Turnover below Rs. 12 lakh = Basic Registration (Form A)',
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
      a: 'Yes. Both platforms require you to upload your FSSAI licence at the time of onboarding and your FSSAI number is displayed on your restaurant profile. They periodically verify it against the FSSAI database and can suspend your account if it is expired or invalid.',
    },
  ],
}
