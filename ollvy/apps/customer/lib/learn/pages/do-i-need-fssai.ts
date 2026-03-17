// lib/learn/pages/do-i-need-fssai.ts
import { LearnPageConfig } from '../pages';

export const doINeedFssai: LearnPageConfig = {
  slug: 'do-i-need-fssai-license',
  title: 'Do I Need an FSSAI License? — Food Business Requirements in India',
  seoTitle: 'Do I Need FSSAI License? Requirements for Restaurants, Cloud Kitchens & Food Businesses (2025)',
  seoDescription: 'Find out if you need FSSAI Basic Registration, State License, or Central License. Covers restaurants, cloud kitchens, home food businesses, packaged food, and catering.',
  canonicalUrl: 'https://ollvy.com/learn/do-i-need-fssai-license',
  lastReviewed: 'March 2025',
  category: 'Licensing',
  ctaServiceSlug: 'fssai-license',
  ctaSecondarySlug: 'gst-registration',
  relatedServiceSlugs: ['fssai-license', 'gst-registration', 'msme-udyam'],
  relatedLearnSlugs: ['how-to-register-gst-india', 'msme-registration-benefits'],

  tool: {
    type: 'eligibility',
    title: 'Which FSSAI license do you need?',
    questions: [
      {
        text: 'What type of food business are you?',
        options: [
          { value: 'restaurant', label: 'Restaurant or cafe (dine-in or takeaway)' },
          { value: 'cloud_kitchen', label: 'Cloud kitchen or delivery-only kitchen' },
          { value: 'home_food', label: 'Home-based food business (cooking from home)' },
          { value: 'packaged', label: 'Packaged food product (manufactured/branded)' },
          { value: 'catering', label: 'Catering company or food events' },
          { value: 'retail', label: 'Retail store selling food items' },
        ],
      },
      {
        text: 'What is your approximate annual turnover from food business?',
        options: [
          { value: 'below_12l', label: 'Below ₹12 lakh' },
          { value: '12l_20cr', label: '₹12 lakh to ₹20 crore' },
          { value: 'above_20cr', label: 'Above ₹20 crore' },
        ],
        evaluator: (answer, allAnswers) => {
          if (answer === 'above_20cr') return {
            type: 'eligible',
            headline: 'You need a Central FSSAI License.',
            body: 'Businesses with annual turnover above ₹20 crore, or operating in more than one state, require a Central FSSAI License. This is processed by the Ministry of Health and Family Welfare directly. Timeline: 60–90 days. Govt fee: ₹7,500/year.',
          };
          if (answer === 'below_12l' && allAnswers[0] === 'home_food') return {
            type: 'eligible',
            headline: 'You need FSSAI Basic Registration.',
            body: 'Home-based food businesses with turnover below ₹12 lakh need FSSAI Basic Registration (petty food business). Fee: ₹100/year. This is the simplest registration — filed on FoSCoS portal. Ollvy handles this for ₹1,999 (includes document preparation and filing).',
          };
          if (answer === '12l_20cr') return {
            type: 'eligible',
            headline: 'You need a State FSSAI License.',
            body: `State FSSAI License is required for businesses with annual turnover between ₹12 lakh and ₹20 crore, operating within one state. This applies to most restaurants, cloud kitchens, and packaged food businesses at early-to-mid stage. Govt fee: ₹2,000/year. Ollvy fee: ₹4,999 (first year includes licence + govt fee).`,
            ctaLabel: 'Book FSSAI State License — ₹6,999',
          };
          return null;
        },
      },
    ],
  },

  sections: [
    {
      heading: 'Three types of FSSAI license — which one applies to you',
      body: `Every food business operator in India must have an FSSAI registration or license. There is no exemption for new businesses, informal operations, or small scale — if you handle food commercially, you need one.`,
      table: [
        { col1: 'Type', col2: 'Annual Turnover', col3: 'Govt Fee', col4: 'Timeline', col5: 'Who It Applies To' },
        { col1: 'Basic Registration', col2: 'Below ₹12 lakh', col3: '₹100/year', col4: '7 days', col5: 'Petty food businesses, home cooks selling food' },
        { col1: 'State License', col2: '₹12L–₹20Cr, single state', col3: '₹2,000/year', col4: '30–45 days', col5: 'Restaurants, cloud kitchens, catering, packaged food' },
        { col1: 'Central License', col2: 'Above ₹20Cr or multi-state', col3: '₹7,500/year', col4: '60–90 days', col5: 'Large manufacturers, multi-state chains, importers/exporters' },
      ],
      note: 'Source: Food Safety and Standards (Licensing and Registration of Food Businesses) Regulations, 2011. Fee schedule as per FoSCoS portal.',
    },
    {
      heading: 'Cloud kitchens specifically',
      body: `A cloud kitchen (dark kitchen, ghost kitchen, delivery-only kitchen) is treated as a food business establishment under FSSAI regulations. The fact that you don't have dine-in customers is irrelevant — food is being prepared and sold commercially.

**What FSSAI inspects for cloud kitchens**:
- Kitchen premises address (must match license)
- Refrigeration equipment and temperature logs
- Pest control records (exterminator visit records + certificate)
- Staff with Food Safety Training and Certification (FoSTaC)
- Source of raw materials (invoices showing food-grade suppliers)
- Waste disposal records

**Important for Swiggy/Zomato listings**: Both platforms require a valid FSSAI license before activating your cloud kitchen. Without it, your listing goes live but payments are blocked until you upload the license. This is the most common delay for new cloud kitchen operators.

**Shared kitchen / commissary kitchen**: If you operate from a shared kitchen space, the license is in your name, not the kitchen owner's. The kitchen owner typically has their own license for the premises. Both must be valid.`,
    },
    {
      heading: 'What you need after FSSAI — the food business compliance stack',
      body: `Getting an FSSAI license is the start, not the end. A food business in India typically needs:

**Mandatory**:
- FSSAI license (covered above)
- GST Registration — mandatory above ₹20L turnover (₹40L for goods, but food is typically goods)
- Shop & Establishment Act registration — required in most states for any business premises
- BBMP / local municipal body trade license — varies by city and premises type

**Strongly recommended**:
- MSME / Udyam Registration — unlocks priority lending, payment protection
- Fire NOC — required for kitchen spaces above certain square footage (varies by city)
- Eating House License — required in Delhi, Maharashtra, and some other states for restaurants

**If you have employees** (above 10):
- ESIC Registration
- PF Registration (above 20 employees)

Ollvy handles all of these as individual services.`,
    },
  ],
};
