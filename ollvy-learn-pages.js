// ollvy-learn-pages.js
// All 12 Learn pages for Ollvy
// Format: matches LearnPage spec from content brief
// Hand to Claude Code as-is - all evaluatorLogic is prose; implement as JS evaluator functions

export const learnPages = [

  // ============================================================
  // TIER 1 - CORE BUSINESS DECISIONS
  // ============================================================

  {
    slug: 'do-i-need-gst-registration',
    title: 'Do I Need GST Registration?',
    seoTitle: 'Do I Need GST Registration in 2025? | Ollvy',
    seoDescription: 'Find out if GST registration is mandatory or optional for your business in India. Check turnover thresholds, business type, and exemptions - updated 2025.',
    lastReviewed: 'March 2025',
    category: 'Tax',
    tier: 1,

    tool: {
      type: 'eligibility',
      title: 'Is GST Registration Mandatory for You?',
      questions: [
        {
          id: 'q1',
          text: 'What is your annual turnover - or what do you expect it to be in your first year?',
          options: [
            { value: 'below_20l', label: 'Below Rs. 20 lakh' },
            { value: '20l_to_40l', label: 'Rs. 20 lakh - Rs. 40 lakh' },
            { value: 'above_40l', label: 'Above Rs. 40 lakh' },
            { value: 'not_sure', label: 'Not sure yet' },
          ],
          evaluatorLogic: 'If above_40l: return mandatory - you have crossed the threshold for most businesses. If 20l_to_40l: continue to q2 to check whether you sell goods or services. If below_20l or not_sure: continue to q2.',
        },
        {
          id: 'q2',
          text: 'What does your business actually do?',
          options: [
            { value: 'goods_only', label: 'I sell goods' },
            { value: 'services_only', label: 'I provide services' },
            { value: 'both', label: 'Both goods and services' },
            { value: 'ecommerce', label: 'I sell on Amazon, Flipkart, my own website, or any other online marketplace' },
          ],
          evaluatorLogic: 'If ecommerce: return mandatory - if you sell through any e-commerce platform, GST registration is required from day one, regardless of how much you are making. That is the law (Section 24, CGST Act). If goods_only and previous answer was 20l_to_40l: return mandatory. If services_only and 20l_to_40l: mandatory if above Rs. 20 lakh. Otherwise continue to q3.',
        },
        {
          id: 'q3',
          text: 'Do you sell to customers outside your home state?',
          options: [
            { value: 'yes_interstate', label: 'Yes, I sell across states' },
            { value: 'no_local', label: 'No, only within my state' },
            { value: 'exports', label: 'I export outside India' },
          ],
          evaluatorLogic: 'If yes_interstate: return mandatory - the moment you sell across state lines, GST registration is required. No exceptions, no turnover threshold. If exports: return recommended - you should register so you can claim back the GST you pay on your inputs. If no_local: continue to q4.',
        },
        {
          id: 'q4',
          text: 'Were you registered under the old tax system - VAT, Service Tax, or Excise?',
          options: [
            { value: 'yes_old', label: 'Yes, I had a VAT or Service Tax registration' },
            { value: 'no_new', label: 'No, I am starting fresh' },
            { value: 'casual_taxable', label: 'I supply occasionally - exhibitions, seasonal stalls, pop-ups' },
          ],
          evaluatorLogic: 'If yes_old: return mandatory - you were supposed to migrate to GST and if that has not happened, you need to act now. If casual_taxable: return mandatory - if you supply at exhibitions or pop-ups, you need to register at least 5 days before. If no_new: return defaultResult.',
        },
      ],
      defaultResult: {
        type: 'recommended',
        headline: 'You do not have to register right now - but it might still make sense',
        body: 'Based on what you have told us, GST registration is not legally required yet. But here is something worth thinking about: if your clients are other businesses, being GST-registered means they can claim back the tax on what they pay you. Without that, you are making yourself less attractive than a competitor who is registered. It is also worth doing before your turnover crosses the threshold - you do not want to be scrambling mid-year.',
      },
    },

    sections: [
      {
        number: '01',
        heading: 'LET\'S START WITH THE BASICS',
        body: 'GST (Goods and Services Tax) registration is governed by the Central Goods and Services Tax Act, 2017. The law puts businesses into two buckets: those who must register (no choice) and those who can register voluntarily. Understanding which bucket you are in matters because running without registration when it is required can cost you up to 100% of your tax amount as a penalty - plus the possibility of prosecution.',
        note: 'Source: Central Goods and Services Tax Act, 2017',
      },
      {
        number: '02',
        heading: 'SITUATIONS WHERE YOU MUST REGISTER',
        body: 'If any of these apply to you, registration is not optional.',
        bullets: [
          'Your annual turnover crosses Rs. 40 lakh if you sell goods, or Rs. 20 lakh if you provide services - in most states',
          'You are in a special category state (J&K, Himachal Pradesh, Uttarakhand, the North-Eastern states, or Sikkim) - the threshold drops to Rs. 20 lakh for goods and Rs. 10 lakh for services',
          'You sell anything across state borders - even one order to a customer in another state means you must register',
          'You sell on Amazon, Flipkart, Meesho, your own website, or any online marketplace - register before your first sale',
          'You supply at exhibitions, seasonal stalls, or pop-ups anywhere outside your home state',
          'You are a non-resident making taxable supplies in India',
          'You are required to deduct TDS under GST (this mainly applies to government entities and PSUs)',
        ],
        note: 'Source: Sections 22 and 24, Central Goods and Services Tax Act, 2017. Once your turnover crosses the limit, you have 30 days to register.',
      },
      {
        number: '03',
        heading: 'SITUATIONS WHERE REGISTERING IS A SMART MOVE EVEN IF NOT REQUIRED',
        body: 'Even if the law does not force you to register, there are situations where doing it voluntarily just makes business sense.',
        bullets: [
          'Your clients are other GST-registered businesses - they can only claim Input Tax Credit from registered suppliers. If you are unregistered, every invoice you raise costs your client extra. That makes you harder to work with.',
          'You spend a lot on purchases - if your input costs are high (raw materials, equipment, professional services), being registered means you can claim back the GST on those purchases',
          'You export goods or services - registered exporters can get a refund on the GST they paid on inputs',
          'You want to look credible - a GSTIN on your invoices signals that you are a serious business',
          'You expect to cross the threshold within the year - better to register now than panic later',
        ],
        note: 'One catch: if you register voluntarily, you cannot cancel that registration for at least one year.',
      },
      {
        number: '04',
        heading: 'SITUATIONS WHERE YOU GENUINELY DO NOT NEED TO REGISTER',
        body: 'Some businesses are truly exempt - and that is perfectly fine.',
        bullets: [
          'Farmers selling their own produce directly - completely exempt',
          'Businesses that only deal in exempted goods or services (think: fresh milk, eggs, unprocessed food, most healthcare services, core educational services)',
          'Service providers below Rs. 20 lakh turnover who operate only within one state',
          'If all your sales are zero-rated or exempt, and you have no inter-state transactions, you likely do not need to register',
        ],
        note: 'A quick note: having a bank account, a Udyam certificate, or a shop licence does not automatically mean you need GST registration. These are separate things.',
      },
      {
        number: '05',
        heading: 'WHAT ACTUALLY HAPPENS IF YOU DO NOT REGISTER WHEN YOU SHOULD',
        body: 'Let us be direct about this - the consequences are real.',
        bullets: [
          'Penalty: Rs. 10,000 or the tax amount you should have collected - whichever is higher',
          'For evasion above Rs. 2 crore, GSTIN officers can arrest without a warrant',
          'You cannot claim Input Tax Credit on anything you bought while unregistered - that money is gone',
          'Government tenders often require a valid GSTIN - without one, you cannot bid',
          'Banks and NBFCs increasingly ask for GST returns when you apply for a working capital loan',
          'Amazon and Flipkart can suspend your seller account if your GSTIN lapses or is missing',
        ],
        note: 'For exact penalty calculations based on your situation, use our penalty calculator: /tools/penalty-calculator/gst',
      },
      {
        number: '06',
        heading: 'A SIMPLE WAY TO DECIDE',
        body: 'Go through this list. Stop at the first YES - that is your answer.',
        bullets: [
          'Do you sell on any online marketplace? YES - register before your next sale',
          'Do you make any sales to customers in another state? YES - register before that happens',
          'Is your turnover above Rs. 40 lakh (goods) or Rs. 20 lakh (services)? YES - you have 30 days from when you crossed the limit',
          'Are you in a special category state and above Rs. 10 lakh? YES - same 30-day window',
          'Are your business clients asking for your GSTIN? YES - consider voluntary registration',
          'None of the above? You are likely exempt - just revisit this every year as you grow',
        ],
      },
    ],

    faqs: [
      {
        q: 'I am a freelancer earning Rs. 18 lakh from foreign clients. Do I need GST?',
        a: 'Services you export are treated as zero-rated under GST, which is good. But you still need to register once your total turnover crosses Rs. 20 lakh - even if all of it comes from foreign clients. The benefit is that you can then claim refunds on the GST you paid on your own expenses.',
      },
      {
        q: 'Can I use my home address for GST registration?',
        a: 'Yes, you can. Your principal place of business can be your home. You will need to upload a self-declaration, and either proof of ownership or a rent agreement along with a no-objection letter from the property owner.',
      },
      {
        q: 'I run multiple businesses. Do I need a separate GSTIN for each?',
        a: 'If your businesses are in the same state and under the same PAN, one GSTIN usually works. If they operate in different states, you need a separate GSTIN for each state. And if they are entirely separate legal entities, each one needs its own registration.',
      },
      {
        q: 'How long does GST registration actually take?',
        a: 'If you complete Aadhaar authentication during the process, approval typically comes through within 3 working days. Without Aadhaar authentication, the department may trigger a physical verification, which can stretch to 30 days.',
      },
      {
        q: 'What is the composition scheme? Should I go for it?',
        a: 'The composition scheme lets small businesses - below Rs. 1.5 crore for goods, Rs. 50 lakh for services - pay a flat tax rate (1-6%) and file quarterly instead of monthly. The tradeoff is that you cannot charge GST on your invoices, which means your B2B clients cannot claim any Input Tax Credit from you. It works well if most of your customers are end consumers, not other businesses.',
      },
      {
        q: 'Can I cancel my GST registration once I have it?',
        a: 'Voluntary registrations cannot be cancelled for at least one year. After that, you can apply if your turnover has dropped below the threshold. If you registered because you were legally required to, you can cancel once you no longer meet those conditions.',
      },
    ],

    cta: {
      primary: { label: 'Get GST Registration', href: '/checkout/gst-registration' },
      secondary: { label: 'Check Documents Required', href: '/tools/documents/gst-registration' },
    },

    relatedLearn: ['pvt-ltd-vs-llp', 'do-i-need-to-file-itr', 'is-msme-registration-worth-it'],
    relatedTools: ['/tools/documents/gst-registration', '/tools/penalty-calculator/gst'],
  },

  // ============================================================

  {
    slug: 'pvt-ltd-vs-llp',
    title: 'Pvt Ltd vs LLP - Which Should I Choose?',
    seoTitle: 'Pvt Ltd vs LLP in India 2025: Which is Right for You? | Ollvy',
    seoDescription: 'Compare Private Limited Company vs LLP for your Indian business. Analyze tax, compliance, funding, liability, and cost to make the right choice in 2025.',
    lastReviewed: 'March 2025',
    category: 'Incorporation',
    tier: 1,

    tool: {
      type: 'comparison',
      title: 'Which Structure Suits Your Business?',
      questions: [
        {
          id: 'q1',
          text: 'Do you plan to raise money from external investors - angels, VCs, or institutions?',
          options: [
            { value: 'yes_funding', label: 'Yes, within the next 2 years' },
            { value: 'maybe', label: 'Possibly, in 3-5 years' },
            { value: 'no_funding', label: 'No - self-funded or debt only' },
          ],
          evaluatorLogic: 'If yes_funding: return mandatory result pointing to Pvt Ltd - investors need to receive shares. An LLP cannot issue equity. ESOPs are also not possible in an LLP. This one factor settles it. If maybe: continue to q2. If no_funding: continue to q2.',
        },
        {
          id: 'q2',
          text: 'How many people will own the business?',
          options: [
            { value: 'one', label: 'Just me' },
            { value: 'two_to_five', label: '2 to 5 founders' },
            { value: 'six_plus', label: '6 or more owners' },
          ],
          evaluatorLogic: 'If one: note that both Pvt Ltd and LLP technically need 2 members, though a Pvt Ltd can have 1 active director with a nominee shareholder. Suggest OPC as an alternative. Continue to q3. If six_plus: note both structures work - LLP has no upper limit on partners, Pvt Ltd allows up to 200 shareholders. Continue to q3.',
        },
        {
          id: 'q3',
          text: 'What kind of business is this?',
          options: [
            { value: 'tech_startup', label: 'A tech startup or product company' },
            { value: 'services_professional', label: 'Professional services - consulting, design, legal, or a CA firm' },
            { value: 'trading_manufacturing', label: 'Trading or manufacturing' },
            { value: 'real_estate_investment', label: 'Real estate, investment holding, or passive income' },
          ],
          evaluatorLogic: 'If tech_startup: return recommended for Pvt Ltd - ESOPs, investor onboarding, and DPIIT startup recognition all require a company structure. If services_professional: return recommended for LLP - CA firms and law firms are required by their professional bodies to use LLP; others benefit from lower compliance burden. If real_estate_investment: return recommended for LLP - lower compliance and pass-through taxation is more efficient. If trading_manufacturing: continue to q4.',
        },
        {
          id: 'q4',
          text: 'How important is keeping your annual compliance costs low?',
          options: [
            { value: 'very_important', label: 'Very important - every rupee counts' },
            { value: 'somewhat', label: 'Somewhat - moderate is fine' },
            { value: 'not_important', label: 'Not a priority - I want the strongest structure' },
          ],
          evaluatorLogic: 'If very_important: return recommended for LLP - annual compliance typically costs Rs. 8,000-15,000 vs Rs. 25,000-50,000 for Pvt Ltd; no mandatory audit below Rs. 40 lakh. If not_important: return recommended for Pvt Ltd. If somewhat: return defaultResult.',
        },
      ],
      defaultResult: {
        type: 'optional',
        headline: 'Both options work for you - here is how to decide',
        body: 'Your situation fits either structure. Here is the simplest tiebreaker: if there is even a small chance you will want to raise equity funding, bring in investors, or offer ESOPs to employees in the next 5 years, go with Pvt Ltd. If you are building something stable and profitable where you want to keep compliance light, choose LLP.',
      },
    },

    sections: [
      {
        number: '01',
        heading: 'WHAT IS ACTUALLY DIFFERENT BETWEEN THE TWO',
        body: 'Here is what often gets lost in these comparisons: both a Private Limited Company and an LLP protect your personal assets. If your business fails or gets sued, your house, savings, and personal accounts are not at risk in either structure. That is the limited liability part, and it applies to both.\n\nThe difference is in everything else - how ownership works, how much you spend on compliance every year, and most importantly, what your options are as the business grows.',
        note: 'Source: Companies Act 2013; Limited Liability Partnership Act 2008',
      },
      {
        number: '02',
        heading: 'CHOOSE PVTLTD IF ANY OF THESE ARE TRUE',
        body: '',
        bullets: [
          'You want to raise money from investors - they receive shares in your company. An LLP cannot issue shares or convertible instruments. End of story.',
          'You want to give your team ESOPs - equity ownership for employees is only possible in a company structure',
          'You are building something that could be acquired or listed someday - clean cap tables and share registers matter for this',
          'You want DPIIT Startup Recognition and the 3-year tax holiday under Section 80-IAC - only companies (not LLPs) qualify',
          'You have multiple founders with different equity stakes and want a clean, legally enforceable cap table',
          'Your enterprise clients or government contracts expect to work with a company',
        ],
        note: 'Source: Companies Act 2013; DPIIT Startup India eligibility criteria',
      },
      {
        number: '03',
        heading: 'CHOOSE LLP IF ANY OF THESE ARE TRUE',
        body: '',
        bullets: [
          'You are a professional services firm - CA firms, law firms, architecture practices, and consulting businesses often find LLP a natural fit, and some professional bodies actually require it',
          'You want to keep annual compliance costs low - typically Rs. 8,000-15,000 per year with an LLP versus Rs. 25,000-50,000 for a Pvt Ltd',
          'Your turnover is below Rs. 40 lakh and contribution below Rs. 25 lakh - you do not need a mandatory statutory audit with an LLP',
          'You want flexible profit-sharing - partners can split profits in any ratio they agree on, regardless of capital contributed. In a Pvt Ltd, dividends must follow shareholding percentage.',
          'You are holding investments or property - LLP\'s pass-through taxation and lower compliance make it more efficient for this purpose',
        ],
        note: 'Source: LLP Act 2008; Income Tax Act 1961',
      },
      {
        number: '04',
        heading: 'THE ANNUAL COMPLIANCE COST DIFFERENCE IS REAL',
        body: 'This is not a small gap. Here is what annual compliance typically looks like:',
        bullets: [
          'LLP: File Form 8 (accounts) and Form 11 (annual return) - roughly Rs. 8,000 to Rs. 15,000 per year with a CA. Audit only needed if turnover crosses Rs. 40 lakh.',
          'Pvt Ltd: File AOC-4 (financials) and MGT-7 (annual return), hold minimum 4 board meetings per year, get a mandatory statutory audit done regardless of size - typically Rs. 25,000 to Rs. 60,000 per year. Each director also needs to complete DIR-3 KYC annually.',
          'Closing an LLP is also significantly simpler and faster than closing a Pvt Ltd - worth thinking about if you are still validating your idea.',
        ],
      },
      {
        number: '05',
        heading: 'WHAT ABOUT TAX?',
        body: 'This is where it gets a bit nuanced.',
        bullets: [
          'LLP profits are taxed at a flat 30% rate at the entity level. Partners do not pay tax again on their share of the profit (it is exempt in their hands). But there is a 12% surcharge if profit crosses Rs. 1 crore.',
          'Pvt Ltd profits are taxed at 22% under the new tax regime (Section 115BAA). However, when the company distributes dividends to shareholders, those dividends are taxed again in the shareholder\'s hands at their personal income tax rate.',
          'In practice, which one is more efficient depends on your profit levels and how much you plan to draw out versus retain in the business. A CA can run the numbers for your specific situation.',
        ],
      },
      {
        number: '06',
        heading: 'THE ONE QUESTION THAT DECIDES MOST CASES',
        body: 'Do you want equity investors within the next 3 years?',
        bullets: [
          'YES - Go with Pvt Ltd, right from day one. Converting later is possible but costs time and money.',
          'NO + professional services - LLP is the better fit. Lower cost, simpler structure.',
          'NO + tech product or consumer brand - Pvt Ltd gives you better optionality for team incentives and future exits.',
          'NO + trading or manufacturing with simple partner split - Either works; choose LLP to keep costs low.',
          'NO + investment or holding vehicle - LLP is more efficient here.',
        ],
      },
    ],

    faqs: [
      {
        q: 'Can I convert an LLP to a Pvt Ltd later if I want to raise funding?',
        a: 'Yes, you can convert - it is allowed under Section 366 of the Companies Act, 2013. But it involves multiple MCA filings, stamp duty, and often a valuation exercise. It typically takes 3-6 months and costs Rs. 50,000 to Rs. 1.5 lakh. If funding is even a possibility within 3 years, it is almost always cheaper and simpler to just start as a Pvt Ltd.',
      },
      {
        q: 'Do I need a minimum amount of capital to start?',
        a: 'No. Both a Pvt Ltd and an LLP can be incorporated with as little as Re. 1 as initial capital. In practice, most Pvt Ltd companies start with Rs. 1 lakh paid-up capital, but there is no legal minimum.',
      },
      {
        q: 'Can a foreign national be a director or partner?',
        a: 'In a Pvt Ltd, a foreigner can be a director - but at least one director must have stayed in India for 182 days or more in the previous calendar year. In an LLP, a foreign national can be a designated partner, but there are FEMA (foreign exchange) regulations that apply to the investment.',
      },
      {
        q: 'Which is easier to shut down if things do not work out?',
        a: 'LLP, by a significant margin. If an LLP has been inactive for a year and has no outstanding liabilities, you can close it using a simplified strike-off process (Form 24). Closing a Pvt Ltd - whether through voluntary winding up or strike-off under Section 248 - involves more paperwork and takes longer.',
      },
      {
        q: 'Does an LLP need to hold board meetings like a Pvt Ltd?',
        a: 'No. LLPs have no requirement for formal board meetings or general meetings. Partners can make decisions informally, as agreed in the LLP Agreement. This is a genuine compliance relief if you want to keep things simple.',
      },
    ],

    cta: {
      primary: { label: 'Register a Private Limited Company', href: '/checkout/pvt-ltd-registration' },
      secondary: { label: 'Register an LLP Instead', href: '/checkout/llp-registration' },
    },

    relatedLearn: ['do-i-need-gst-registration', 'should-i-get-dpiit-startup-recognition', 'is-msme-registration-worth-it'],
    relatedTools: ['/tools/documents/pvt-ltd-registration', '/tools/documents/llp-registration'],
  },

  // ============================================================

  {
    slug: 'do-i-need-to-file-itr',
    title: 'Do I Need to File an Income Tax Return?',
    seoTitle: 'Do I Need to File ITR in 2025? Mandatory vs Optional | Ollvy',
    seoDescription: 'Check if ITR filing is mandatory for you in India. Covers salaried, freelancers, business owners, and NRIs - with 2025-26 thresholds and exemptions.',
    lastReviewed: 'March 2025',
    category: 'Tax',
    tier: 1,

    tool: {
      type: 'eligibility',
      title: 'Is ITR Filing Mandatory for You?',
      questions: [
        {
          id: 'q1',
          text: 'What was your total income in FY 2024-25 - before any deductions?',
          options: [
            { value: 'below_250k', label: 'Below Rs. 2.5 lakh' },
            { value: '250k_to_500k', label: 'Rs. 2.5 lakh to Rs. 5 lakh' },
            { value: '500k_to_1cr', label: 'Rs. 5 lakh to Rs. 1 crore' },
            { value: 'above_1cr', label: 'Above Rs. 1 crore' },
          ],
          evaluatorLogic: 'If above_1cr or 500k_to_1cr: return mandatory - income is above the basic exemption limit; filing is required under Section 139(1). If 250k_to_500k: continue to q2. If below_250k: continue to q2 - may still need to file due to high-value transactions or TDS refund.',
        },
        {
          id: 'q2',
          text: 'Does any of this apply to you?',
          options: [
            { value: 'tds_deducted', label: 'Tax was deducted at source from my salary, FD interest, or freelance payments' },
            { value: 'foreign_assets', label: 'I have a foreign bank account, investments abroad, or assets outside India' },
            { value: 'high_value_txn', label: 'I deposited Rs. 1 crore or more in a bank account, or spent Rs. 2 lakh or more on international travel, or paid electricity bills over Rs. 1 lakh' },
            { value: 'none', label: 'None of these apply to me' },
          ],
          evaluatorLogic: 'If tds_deducted: return mandatory - you need to file to claim your TDS refund. If you do not file, that money is just gone. If foreign_assets: return mandatory - anyone with foreign assets must file regardless of income level. If high_value_txn: return mandatory - Rule 12AB requires filing even if income is below the basic exemption limit. If none and previous income below_250k: return not_required - you are genuinely exempt.',
        },
        {
          id: 'q3',
          text: 'How old are you?',
          options: [
            { value: 'below_60', label: 'Under 60' },
            { value: '60_to_80', label: '60 to 80 (Senior Citizen)' },
            { value: 'above_80', label: 'Above 80 (Super Senior Citizen)' },
          ],
          evaluatorLogic: 'Adjust the mandatory threshold accordingly - Rs. 2.5 lakh for under 60, Rs. 3 lakh for 60-80, Rs. 5 lakh for above 80. If income from q1 was 250k_to_500k and user is above_80: may return not_required if income is below Rs. 5 lakh and no other triggers from q2.',
        },
        {
          id: 'q4',
          text: 'Are you planning to apply for any of these in the next 12 months?',
          options: [
            { value: 'yes_loan', label: 'A home loan or business loan' },
            { value: 'yes_visa', label: 'A US, UK, or Schengen visa' },
            { value: 'yes_tender', label: 'A government tender or contract' },
            { value: 'no', label: 'None of these' },
          ],
          evaluatorLogic: 'If yes_loan or yes_visa or yes_tender: return recommended - lenders want 2-3 years of ITR; visa embassies ask for it; government tenders require it. Even if the law does not require you to file, not filing makes your life harder. If no: return defaultResult.',
        },
      ],
      defaultResult: {
        type: 'recommended',
        headline: 'Not strictly required - but filing anyway is a good idea',
        body: 'Your income seems to be below the taxable limit. But here is the thing - filing a nil return costs you nothing and takes about 30 minutes. What it gives you is a formal income record that banks, visa offices, and government departments recognise. It also protects you from any future income tax notice asking you to explain where your money came from.',
      },
    },

    sections: [
      {
        number: '01',
        heading: 'WHO HAS TO FILE',
        body: 'Under Section 139(1) of the Income Tax Act, 1961, you are required to file if your gross income - before any deductions - crosses the basic exemption limit. But income level is not the only reason you might need to file.',
        bullets: [
          'Gross income above Rs. 2.5 lakh if you are under 60, Rs. 3 lakh if you are between 60 and 80, or Rs. 5 lakh if you are above 80',
          'You deposited cash above Rs. 1 crore in one or more current accounts during the year',
          'You spent more than Rs. 2 lakh on international travel',
          'Your electricity bills totalled more than Rs. 1 lakh across the year',
          'You own property abroad, have a foreign bank account, or earn any income outside India',
          'You run a company or a firm - all companies and firms must file regardless of profit or loss',
          'You want to carry forward a loss (from investments, business) to set off against future income',
          'Tax was deducted from any of your payments and you want that money back',
        ],
        note: 'Source: Section 139(1), Income Tax Act 1961; Rule 12AB, Income Tax Rules 1962',
      },
      {
        number: '02',
        heading: 'NO EXCEPTIONS HERE - THESE ARE HARD MANDATORY',
        body: 'If any of these apply, you must file. No way around it.',
        bullets: [
          'You are a company or an LLP - mandatory every year, even if no business was done and there was zero income',
          'Your total income exceeds the basic exemption limit for your age',
          'You made a high-value transaction - bank deposit above Rs. 1 crore, international travel above Rs. 2 lakh, electricity above Rs. 1 lakh',
          'You are a director in any Indian company - even if it is a dormant startup you co-founded years ago',
          'You invested more than Rs. 10 lakh in mutual funds or stocks during the year',
          'You hold any asset outside India or have an account with a foreign bank',
          'Tax was deducted at source from any payment and you want to claim it back',
        ],
        note: 'Source: CBDT Notification; Rule 12AB added by the Income Tax (6th Amendment) Rules, 2022',
      },
      {
        number: '03',
        heading: 'REASONS TO FILE EVEN WHEN YOU TECHNICALLY DO NOT HAVE TO',
        body: 'Sometimes the most practical reason to file has nothing to do with tax.',
        bullets: [
          'Visa applications: US, UK, and Schengen embassies routinely ask for 2-3 years of ITRs as standard income proof',
          'Home loans and car loans: Banks and NBFCs ask self-employed applicants for ITR copies; increasingly, salaried applicants are asked too',
          'Government tenders: ITR submission is a standard pre-qualification requirement',
          'Premium credit cards: Most private banks require ITR for cards above a certain credit limit',
          'Building a paper trail: If you earn from multiple informal sources - rent, tuition, freelance - an ITR gives you documented proof of income',
          'Carrying forward losses: If you had capital losses or business losses, you can only use them against future profits if you file by the due date',
        ],
      },
      {
        number: '04',
        heading: 'WHEN YOU GENUINELY DO NOT NEED TO FILE',
        body: 'You are truly exempt if all of these are true at the same time:',
        bullets: [
          'Your gross income is below Rs. 2.5 lakh (under 60), Rs. 3 lakh (60-80), or Rs. 5 lakh (above 80) - before any deductions',
          'You have no foreign assets, accounts, or income',
          'You have not made any high-value transactions',
          'No tax was deducted from any of your income',
          'You have no capital or business losses you want to carry forward',
          'You are not a director in any company',
          'You have no plans for loans, visas, or government contracts soon',
        ],
        note: 'One more thing: Senior citizens above 75 with only pension and interest income from the same bank are exempt from filing if the bank deducts TDS on their behalf under Section 194P.',
      },
      {
        number: '05',
        heading: 'WHAT MISSING THE DEADLINE ACTUALLY COSTS YOU',
        body: 'Missing the due date (July 31 for most individuals) has consequences that grow over time.',
        bullets: [
          'Late filing fee: Rs. 5,000 if your total income is above Rs. 5 lakh; Rs. 1,000 if below (Section 234F)',
          'Interest on tax due: 1% per month from the original due date until you actually file (Section 234A)',
          'Losses lost permanently: Capital losses, business losses, and speculation losses cannot be carried forward if you miss the due date - that tax benefit is gone for good',
          'Income tax notice risk: The department can reopen your assessment up to 3 years back, or up to 10 years for larger undisclosed amounts',
          'Prosecution: Willful failure to file when tax was owed can lead to prosecution under Section 276CC',
        ],
        note: 'Use our penalty calculator for exact amounts based on your situation: /tools/penalty-calculator/itr',
      },
      {
        number: '06',
        heading: 'ANSWER YES TO ANY OF THESE - THEN FILE',
        body: '',
        bullets: [
          'Is your gross income above your age-based exemption limit? YES - mandatory',
          'Was tax deducted from your salary, FD interest, or any payment to you? YES - file to get your refund',
          'Do you have any foreign assets or income? YES - mandatory',
          'Are you a director in any company? YES - mandatory',
          'Do you need a loan, visa, or government contract in the next year? YES - file now',
          'Did you make a large bank deposit, international trip, or pay high electricity bills? YES - mandatory',
          'All NO? You are probably exempt - but consider filing a nil return anyway just for the record',
        ],
      },
    ],

    faqs: [
      {
        q: 'I am a student with no income. Should I file?',
        a: 'If you have truly zero income and zero assets, there is nothing to file. But if you have a bank account where even small amounts of interest are credited and tax has been deducted on it, you should file to claim that refund. It takes 20 minutes and the money comes back to your account.',
      },
      {
        q: 'My employer deducts TDS every month. Do I still need to file?',
        a: 'Yes. Your employer\'s TDS deduction (via Form 24Q) is not a substitute for your own ITR filing. You still need to file to declare all your income, claim any additional deductions you are eligible for (like HRA, home loan interest, 80C investments), and get back any excess TDS that was deducted.',
      },
      {
        q: 'I live abroad and earn in a foreign country. Do I need to file an ITR in India?',
        a: 'If you are an NRI and you have any income that originates in India - rental income, capital gains on Indian property or shares, interest on an NRO account - and that income crosses the basic exemption limit, you need to file. Also file if tax was deducted from Indian income and you want a refund.',
      },
      {
        q: 'What is the difference between ITR-1 and ITR-2?',
        a: 'ITR-1 is the simple form - for salaried individuals with income from salary, one house property, and interest income, with total income below Rs. 50 lakh and no capital gains. ITR-2 is for everyone else - if you have capital gains, more than one property, foreign income, or you are a director in a company. Not sure which applies to you? Check our ITR form guide.',
      },
      {
        q: 'Can I file after the July 31 deadline?',
        a: 'Yes. A belated return can be filed up to December 31 of the assessment year. You will pay a late fee (Rs. 1,000 to Rs. 5,000) and lose the ability to carry forward any losses. After December 31, filing is generally not possible without special circumstances.',
      },
    ],

    cta: {
      primary: { label: 'File My Income Tax Return', href: '/checkout/itr-filing' },
      secondary: { label: 'Which ITR Form Do I Need?', href: '/learn/which-itr-form-should-i-use' },
    },

    relatedLearn: ['which-itr-form-should-i-use', 'do-i-need-gst-registration', 'pvt-ltd-vs-llp'],
    relatedTools: ['/tools/penalty-calculator/itr', '/tools/documents/itr-filing-individual'],
  },

  // ============================================================

  {
    slug: 'do-i-need-trademark-registration',
    title: 'Do I Need Trademark Registration?',
    seoTitle: 'Do I Need to Register a Trademark in India 2025? | Ollvy',
    seoDescription: 'Find out if trademark registration makes sense for your brand in India. Understand protection, costs, enforcement, and when to prioritise it in 2025.',
    lastReviewed: 'March 2025',
    category: 'Registration',
    tier: 1,

    tool: {
      type: 'eligibility',
      title: 'Should You Register Your Trademark?',
      questions: [
        {
          id: 'q1',
          text: 'How central is your brand name or logo to your business?',
          options: [
            { value: 'very_central', label: 'It is the product - customers search for us by name' },
            { value: 'important', label: 'It matters, but we also compete on quality and relationships' },
            { value: 'not_central', label: 'We are a B2B supplier or white-label; the brand is less important' },
          ],
          evaluatorLogic: 'If very_central: return recommended strongly - consumer brands and D2C companies where the name is the primary recall are at very high risk without trademark protection. If not_central: continue to q2.',
        },
        {
          id: 'q2',
          text: 'Have you spent money building brand awareness in the last 12 months?',
          options: [
            { value: 'significant_investment', label: 'Yes - significant spend on ads, packaging, or marketing' },
            { value: 'some_investment', label: 'Some - social media and basic content' },
            { value: 'no_investment', label: 'Not yet - we have not started marketing' },
          ],
          evaluatorLogic: 'If significant_investment: return recommended urgently - brand equity built without a trademark is legally unprotected. Someone can register the same name and send you a cease-and-desist. Continue to q3 for urgency. If no_investment: continue to q3.',
        },
        {
          id: 'q3',
          text: 'Is anyone else using a similar name in your industry?',
          options: [
            { value: 'yes_similar', label: 'Yes, there are similar names out there' },
            { value: 'not_sure', label: 'Not sure - I have not checked' },
            { value: 'unique', label: 'Our name is unique - nothing similar exists' },
          ],
          evaluatorLogic: 'If yes_similar: return mandatory-level urgency - you are at risk of a trademark objection or an infringement claim. Do a trademark search immediately and register before investing further in the brand. If not_sure: return recommended - run a free search on the IP India portal before spending another rupee on marketing.',
        },
        {
          id: 'q4',
          text: 'Are any of these in your plans?',
          options: [
            { value: 'yes_expand', label: 'Expanding internationally or licensing my brand' },
            { value: 'yes_funding', label: 'Raising investor funding' },
            { value: 'no_local', label: 'None of these - staying India-focused and self-funded' },
          ],
          evaluatorLogic: 'If yes_expand: return mandatory - international trademark protection starts with an Indian registration. Convention applications in other countries require a home country registration. If yes_funding: return recommended - investors check IP as part of due diligence; an unregistered brand is a flag that can delay a deal. If no_local: return defaultResult.',
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
        body: 'A trademark is a legally recognised sign - a name, a logo, a tagline, or a combination of these - that identifies your products or services as yours and not someone else\'s. Once you register it under the Trade Marks Act, 1999, you have the exclusive right to use that mark commercially in India for 10 years (and you can keep renewing it forever). More importantly, you get the legal power to stop others from using the same or a confusingly similar mark in your category of business.',
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

    cta: {
      primary: { label: 'Register My Trademark', href: '/checkout/trademark-registration' },
      secondary: { label: 'Search for Existing Trademarks', href: 'https://ipindiaonline.gov.in/tmrpublicsearch/frmmain.aspx' },
    },

    relatedLearn: ['pvt-ltd-vs-llp', 'should-i-get-dpiit-startup-recognition', 'is-msme-registration-worth-it'],
    relatedTools: ['/tools/documents/trademark-registration'],
  },

  // ============================================================
  // TIER 2 - COMPLIANCE TRIGGERS
  // ============================================================

  {
    slug: 'when-does-pf-registration-become-mandatory',
    title: 'When Does PF Registration Become Mandatory?',
    seoTitle: 'PF Registration: When is it Mandatory in India 2025? | Ollvy',
    seoDescription: 'Find out when Provident Fund (EPFO) registration becomes mandatory for your business in India. Covers employee threshold, penalties, and voluntary registration.',
    lastReviewed: 'March 2025',
    category: 'Compliance',
    tier: 2,

    tool: {
      type: 'eligibility',
      title: 'Is PF Registration Mandatory for Your Business?',
      questions: [
        {
          id: 'q1',
          text: 'How many people does your business currently employ?',
          options: [
            { value: 'below_10', label: 'Fewer than 10' },
            { value: '10_to_19', label: '10 to 19 employees' },
            { value: '20_plus', label: '20 or more employees' },
            { value: 'hiring_soon', label: 'Below 20 now, but growing fast' },
          ],
          evaluatorLogic: 'If 20_plus: return mandatory immediately - any establishment with 20 or more employees must register under the EPF Act. If hiring_soon: return mandatory with a note - once you cross 20, you have 30 days to register. If 10_to_19: continue to q2 - some industries have a lower threshold. If below_10: continue to q2.',
        },
        {
          id: 'q2',
          text: 'What industry is your business in?',
          options: [
            { value: 'scheduled_industry', label: 'Manufacturing, textiles, engineering, mining, construction, or brick kiln' },
            { value: 'it_services', label: 'IT, BPO, software services, or tech startup' },
            { value: 'other_services', label: 'Retail, hospitality, food, healthcare, or other services' },
            { value: 'not_sure', label: 'Not sure' },
          ],
          evaluatorLogic: 'If scheduled_industry and employee count is 10_to_19: certain scheduled industries have a lower threshold of 10 employees - return mandatory. For all others below 20: continue to q3.',
        },
        {
          id: 'q3',
          text: 'What do your employees earn?',
          options: [
            { value: 'all_above_15k', label: 'Everyone earns above Rs. 15,000 basic salary per month' },
            { value: 'some_above_15k', label: 'A mix - some above, some below Rs. 15,000 basic' },
            { value: 'all_below_15k', label: 'Everyone earns below Rs. 15,000 basic salary per month' },
          ],
          evaluatorLogic: 'Note: employees above Rs. 15,000 can opt out of PF individually - but if the establishment is covered (20+ employees), you still need to register. If all_above_15k and below 20 employees: return optional - not technically mandatory but voluntary registration may be required by some clients. Continue to q4.',
        },
        {
          id: 'q4',
          text: 'Do your clients, staffing contracts, or tenders ask for PF registration?',
          options: [
            { value: 'yes_required', label: 'Yes, it has come up' },
            { value: 'no', label: 'No, not so far' },
            { value: 'not_sure', label: 'Not sure yet' },
          ],
          evaluatorLogic: 'If yes_required: return recommended - voluntary registration makes commercial sense even below the legal threshold. Otherwise return defaultResult.',
        },
      ],
      defaultResult: {
        type: 'not_required',
        headline: 'Not required at your current size',
        body: 'With fewer than 20 employees and no industry-specific trigger, PF registration is not mandatory for you right now. The important thing is to keep track of your headcount - the moment you cross 20 employees, you have 30 days to register.',
      },
    },

    sections: [
      {
        number: '01',
        heading: 'THE NUMBER THAT CHANGES EVERYTHING: 20',
        body: 'Under the Employees Provident Funds and Miscellaneous Provisions Act, 1952, PF registration becomes mandatory the moment your business employs 20 or more people. That is the trigger. It does not matter what industry you are in, what city you are in, or how much your employees earn. Once you cross 20, you have 30 days to register.\n\nWho counts toward that 20? More than you might think.',
        bullets: [
          'All direct employees on your payroll',
          'Contract workers if you are the one directing their work at your premises',
          'Casual and temporary staff who work regularly',
          'Directors who draw a regular salary',
          'Part-time employees',
        ],
        note: 'Source: Section 1(3)(b), Employees Provident Funds and Miscellaneous Provisions Act, 1952',
      },
      {
        number: '02',
        heading: 'SOME INDUSTRIES HAVE A LOWER THRESHOLD',
        body: 'If your business is in one of these industries, PF registration kicks in at 10 employees - not 20.',
        bullets: [
          'Cinemas and theatres',
          'Cigarette, beedi, and tobacco product manufacturing',
          'Textile mills (jute, cotton, or other fibre manufacturing)',
          'Any establishment specifically notified by the Central Government under Section 1(4) of the EPF Act',
        ],
        note: 'If you are in manufacturing and are not sure which category applies, check Schedule I of the EPF Act or ask a labour law advisor.',
      },
      {
        number: '03',
        heading: 'WHAT PF ACTUALLY COSTS YOUR BUSINESS',
        body: 'Once you are registered, both you and your employees contribute to the fund every month.',
        bullets: [
          'Your employee contributes 12% of their basic salary plus dearness allowance (DA)',
          'You as the employer also contribute 12% - of that, 3.67% goes to the EPF (Provident Fund) and 8.33% goes to EPS (Employee Pension Scheme)',
          'You also pay 0.5% in administrative charges',
          'For establishments that voluntarily register with fewer than 20 employees, the contribution rate is 10% instead of 12%',
          'The mandatory PF contribution only applies to employees earning up to Rs. 15,000 basic salary per month',
          'Payments must be made by the 15th of the following month',
        ],
        note: 'Source: EPF Scheme, 1952; Employee Pension Scheme, 1995',
      },
      {
        number: '04',
        heading: 'WHEN PF DOES NOT APPLY TO YOU',
        body: 'A few genuine exemptions.',
        bullets: [
          'Fewer than 20 employees in most industries (or below 10 in the scheduled industries listed above)',
          'Government establishments where employees are already covered under a separate provident fund scheme',
          'Employees earning above Rs. 15,000 basic salary can choose to opt out - though this does not exempt the employer from registering if the 20-employee threshold is met',
          'Establishments that have their own superior provident fund scheme and have received specific exemption under Section 17 of the EPF Act',
        ],
      },
      {
        number: '05',
        heading: 'WHAT HAPPENS IF YOU DO NOT REGISTER WHEN YOU SHOULD',
        body: 'This is not an area where the consequences are light.',
        bullets: [
          'Penalty for not registering: Up to Rs. 5,000 per day',
          'Interest on unpaid contributions: 12% per annum',
          'Damages for delayed payment: Between 5% and 25% of arrears, depending on how long you delayed',
          'Employees can file complaints directly with the EPFO Regional Commissioner',
          'Criminal prosecution: Wilful non-compliance can lead to imprisonment up to 1 year and/or a fine under Section 14 of the EPF Act',
          'Labour audits have become more common in IT parks and industrial estates - being unregistered is an easy catch',
        ],
        note: 'Use our penalty calculator for specific amounts: /tools/penalty-calculator/pf',
      },
      {
        number: '06',
        heading: 'WHERE YOU STAND AND WHAT TO DO NEXT',
        body: '',
        bullets: [
          '20 or more employees right now? Register immediately if you have not already.',
          '15 to 19 employees? Start preparing your payroll data now. Register before you make your next hire.',
          '10 to 14 employees in a scheduled industry? Register now - you have already crossed the threshold.',
          'Below 10 employees? You are fine - just check again with every new hire.',
          'Have any employees earning below Rs. 15,000 basic? Once you register, they must be enrolled.',
        ],
      },
    ],

    faqs: [
      {
        q: 'We went above 20 employees but are now back below 20. Do we still need to be registered?',
        a: 'Yes. Once an establishment has employed 20 or more people at any point in the previous 12 months, it remains covered under the EPF Act - even if headcount later drops. The Act specifically uses the phrase "any day of the preceding 12 months" as the reference point.',
      },
      {
        q: 'We use contract workers from a staffing agency. Do they count toward our 20-employee limit?',
        a: 'It depends on the contract structure. If the staffing agency employs and pays them, the agency is the employer for PF purposes and should have their own PF registration. If you are directing their work at your premises and are effectively their employer in practice, EPFO may count them toward your threshold. This is a grey area - get clarity on your specific contract structure before assuming.',
      },
      {
        q: 'Can an employee earning above Rs. 15,000 opt out of PF?',
        a: 'An employee who has never been an EPFO member and is earning above Rs. 15,000 basic salary can opt out when joining a new employer by submitting Form 11. However, once you are an EPFO member, you cannot opt out - even if your salary later crosses Rs. 15,000. You can choose to contribute only on Rs. 15,000 rather than your full salary.',
      },
      {
        q: 'What is a UAN and does every employee need one?',
        a: 'UAN is a 12-digit Universal Account Number assigned by EPFO to every PF member. It stays the same across all jobs throughout a person\'s career. As an employer, you need to generate or link a UAN for every covered employee when they join.',
      },
      {
        q: 'What about part-time or contractual employees?',
        a: 'Yes, they count toward your 20-employee threshold. And once your establishment is registered, contributions are due for all employees earning up to Rs. 15,000 basic - regardless of whether they are full-time, part-time, or contractual.',
      },
    ],

    cta: {
      primary: { label: 'Get PF Registration', href: '/checkout/pf-registration' },
      secondary: { label: 'Check ESI Registration Too', href: '/learn/when-does-esi-registration-become-mandatory' },
    },

    relatedLearn: ['when-does-esi-registration-become-mandatory', 'do-i-need-professional-tax-registration', 'do-i-need-shop-establishment-registration'],
    relatedTools: ['/tools/penalty-calculator/pf'],
  },

  // ============================================================

  {
    slug: 'when-does-esi-registration-become-mandatory',
    title: 'When Does ESI Registration Become Mandatory?',
    seoTitle: 'ESI Registration: When is it Mandatory in India 2025? | Ollvy',
    seoDescription: 'Understand when ESIC registration becomes mandatory for your business in India. Employee threshold, salary limit, covered industries, and non-compliance penalties.',
    lastReviewed: 'March 2025',
    category: 'Compliance',
    tier: 2,

    tool: {
      type: 'eligibility',
      title: 'Is ESI Registration Mandatory for Your Business?',
      questions: [
        {
          id: 'q1',
          text: 'How many employees do you have right now?',
          options: [
            { value: 'below_10', label: 'Fewer than 10' },
            { value: '10_plus', label: '10 or more' },
            { value: 'hiring_soon', label: 'Fewer than 10, but growing quickly' },
          ],
          evaluatorLogic: 'If 10_plus: continue to q2 to check establishment type. If hiring_soon: return forward-looking note - once you cross 10 employees, register within 15 days. If below_10: continue to q2.',
        },
        {
          id: 'q2',
          text: 'What kind of business do you run?',
          options: [
            { value: 'factory', label: 'A factory or manufacturing unit with power' },
            { value: 'non_seasonal_factory', label: 'A factory without power, or a seasonal operation' },
            { value: 'shops_services', label: 'A shop, office, IT company, hotel, restaurant, or cinema' },
            { value: 'other', label: 'Agriculture, construction, or something else' },
          ],
          evaluatorLogic: 'If factory and 10+ employees: return mandatory. If shops_services and 10+ employees: return mandatory - ESI coverage has been extended to shops and establishments in most states. If non_seasonal_factory and 20+ employees: return mandatory. If other: continue to q3.',
        },
        {
          id: 'q3',
          text: 'What do your employees earn?',
          options: [
            { value: 'below_21k', label: 'Some employees earn below Rs. 21,000 per month' },
            { value: 'all_above_21k', label: 'Everyone earns above Rs. 21,000 per month' },
          ],
          evaluatorLogic: 'If all_above_21k: return not_required - ESI contributions only apply to employees earning up to Rs. 21,000 per month. If no one falls within that bracket, there are no contributions due. If below_21k and previous answers indicated 10+ employees in a covered establishment: return mandatory.',
        },
      ],
      defaultResult: {
        type: 'not_required',
        headline: 'ESI does not appear to be mandatory for you right now',
        body: 'The main triggers are 10 or more employees in a factory, or 10 or more employees in shops, offices, or services in most states. You can revisit this as your team grows.',
      },
    },

    sections: [
      {
        number: '01',
        heading: 'THE ESI THRESHOLD: 10 EMPLOYEES',
        body: 'The Employees State Insurance Act, 1948 applies to factories with 10 or more employees and to shops, restaurants, hotels, cinemas, IT companies, and other service establishments with 10 or more employees in states where the Act has been extended. As of 2025, ESI coverage has been extended to all states and union territories in India.',
        note: 'Source: Section 1(5), Employees State Insurance Act, 1948; ESIC Circulars on coverage extension',
      },
      {
        number: '02',
        heading: 'WHO COUNTS AS A COVERED EMPLOYEE',
        body: 'ESI covers employees earning up to Rs. 21,000 per month (Rs. 25,000 for persons with disabilities). Once your establishment is covered, all eligible employees must be enrolled.',
        bullets: [
          'Employees earning up to Rs. 21,000 per month in total wages',
          'Persons with disabilities employed at up to Rs. 25,000 per month',
          'Casual and temporary staff',
          'Contract workers if you are deploying them at your premises as the principal employer',
          'Directors who are on your payroll',
          'Family members working in the business and drawing salary',
        ],
        note: 'Employees earning above Rs. 21,000 do not need ESI contributions - but they still count toward your 10-employee threshold for determining whether the establishment is covered.',
      },
      {
        number: '03',
        heading: 'WHAT ESI CONTRIBUTIONS LOOK LIKE',
        body: 'Once registered, contributions are calculated as a percentage of each covered employee\'s gross wages.',
        bullets: [
          'Employer contribution: 3.25% of gross wages',
          'Employee contribution: 0.75% of gross wages',
          'Total: 4% of gross wages for each covered employee',
          'Employees earning below approximately Rs. 176 per day are exempt from their own contribution, but the employer still pays 3.25%',
          'Contributions are due by the 15th of the following month',
          'Half-yearly returns must be filed twice a year',
        ],
        note: 'Source: ESI (Central) Rules, 1950; ESIC Contribution Rates Notification',
      },
      {
        number: '04',
        heading: 'WHAT ESI ACTUALLY GIVES YOUR EMPLOYEES',
        body: 'ESI is a proper social insurance scheme, not just a compliance checkbox. Covered employees and their families get real benefits.',
        bullets: [
          'Medical care: Full treatment for the employee and their family through ESIC dispensaries and hospitals',
          'Sickness benefit: 70% of wages for up to 91 days during certified illness',
          'Maternity benefit: Full wages for 26 weeks of maternity leave',
          'Disability benefit: 90% of wages if permanently or temporarily disabled due to a work injury',
          'Dependants benefit: 90% of wages paid to family members if the employee dies due to a work injury',
          'Funeral expenses: Rs. 15,000 lump sum',
        ],
      },
      {
        number: '05',
        heading: 'WHAT HAPPENS IF YOU DO NOT COMPLY',
        body: '',
        bullets: [
          'Not registering when required: Penalty up to Rs. 10,000 and prosecution under Section 85 of the ESI Act',
          'Late payment of contributions: 12% per annum interest on unpaid amounts',
          'Damages for delay: 5% to 25% of arrears depending on how long the delay continues',
          'ESIC can directly attach bank accounts and property to recover arrears',
          'Wilful evasion: Imprisonment up to 2 years under Section 85',
        ],
      },
      {
        number: '06',
        heading: 'QUICK SUMMARY OF WHERE YOU STAND',
        body: '',
        bullets: [
          '10 or more employees in a covered establishment type? Check if your state\'s notification covers your industry - if yes, register.',
          'Any employees earning below Rs. 21,000? They must be enrolled once you are registered.',
          'All employees above Rs. 21,000? No contributions due, though registration may still technically apply.',
          'Crossing 10 employees? Register within 15 days of that happening.',
        ],
      },
    ],

    faqs: [
      {
        q: 'We already have PF registration. Is ESI the same thing?',
        a: 'No - they are completely separate. PF is managed by EPFO under the Employees Provident Funds Act, 1952. ESI is managed by ESIC under the Employees State Insurance Act, 1948. Different laws, different thresholds, different contributions, different registrations. You can be subject to both, one, or neither, depending on your setup.',
      },
      {
        q: 'Does ESI apply in my state?',
        a: 'Yes - ESI has been extended to all states and union territories. Coverage of specific establishment types (shops, IT companies, hotels) was progressively extended across states and is now essentially nationwide as of 2025.',
      },
      {
        q: 'Can my employees opt out of ESI if they have private health insurance?',
        a: 'No. Unlike PF, there is no individual opt-out from ESI. If your establishment is covered and an employee falls below the wage ceiling, both their contribution and yours are mandatory. The only exception is if the employer obtains a specific exemption under Section 87 of the ESI Act by demonstrating they provide superior medical benefits - this is a formal government approval process, not a simple opt-out.',
      },
      {
        q: 'We just crossed 10 employees. How long do we have to register?',
        a: 'You have 15 days from the date you cross the threshold to apply for ESI registration.',
      },
    ],

    cta: {
      primary: { label: 'Get ESI Registration', href: '/checkout/esi-registration' },
      secondary: { label: 'Get PF Registration Too', href: '/learn/when-does-pf-registration-become-mandatory' },
    },

    relatedLearn: ['when-does-pf-registration-become-mandatory', 'do-i-need-professional-tax-registration', 'do-i-need-shop-establishment-registration'],
    relatedTools: ['/tools/penalty-calculator/esi'],
  },

  // ============================================================

  {
    slug: 'do-i-need-professional-tax-registration',
    title: 'Do I Need Professional Tax Registration?',
    seoTitle: 'Professional Tax Registration in India 2025: Do You Need It? | Ollvy',
    seoDescription: 'Find out if Professional Tax applies to your business or profession in India. State-wise thresholds, who must register, and employer vs self-employed obligations.',
    lastReviewed: 'March 2025',
    category: 'Tax',
    tier: 2,

    tool: {
      type: 'eligibility',
      title: 'Does Professional Tax Apply to You?',
      questions: [
        {
          id: 'q1',
          text: 'Which state is your business based in?',
          options: [
            { value: 'pt_state', label: 'Maharashtra, Karnataka, West Bengal, Tamil Nadu, Andhra Pradesh, Telangana, Madhya Pradesh, Odisha, or Kerala' },
            { value: 'no_pt_state', label: 'Delhi, Uttar Pradesh, Rajasthan, Haryana, Himachal Pradesh, or Punjab' },
            { value: 'north_east', label: 'Assam, Meghalaya, Manipur, or Tripura' },
            { value: 'other', label: 'Another state or not sure' },
          ],
          evaluatorLogic: 'If no_pt_state: return not_required - Professional Tax does not exist in these states. If pt_state: continue to q2. If north_east or other: continue to q2 with a note that PT applies in some of these states.',
        },
        {
          id: 'q2',
          text: 'What is your role in this business?',
          options: [
            { value: 'employer', label: 'I am an employer with salaried staff' },
            { value: 'self_employed', label: 'I am self-employed, a freelancer, or a professional (doctor, CA, lawyer, consultant)' },
            { value: 'both', label: 'Both - I own the business and also draw a salary from it' },
          ],
          evaluatorLogic: 'If employer in PT state: return mandatory - you need both PTRC (to deduct PT from employee salaries and remit it) and PTEC (for your own PT as a business owner). If self_employed in PT state: return mandatory - you need PTEC and must pay your own PT. If both: return mandatory for both obligations.',
        },
        {
          id: 'q3',
          text: 'What is the monthly income or salary we are talking about?',
          options: [
            { value: 'below_threshold', label: 'Below Rs. 7,500 per month' },
            { value: 'above_threshold', label: 'Above Rs. 7,500 per month' },
          ],
          evaluatorLogic: 'If below_threshold: return not_required - most states exempt incomes below Rs. 7,500 per month. If above_threshold in PT state: return mandatory.',
        },
      ],
      defaultResult: {
        type: 'not_required',
        headline: 'Professional Tax likely does not apply to you',
        body: 'Professional Tax is a state-level tax that only exists in specific states. If you are operating in Delhi, UP, Haryana, Rajasthan, Punjab, or Himachal Pradesh, you have no Professional Tax obligation at all.',
      },
    },

    sections: [
      {
        number: '01',
        heading: 'FIRST, THE IMPORTANT THING TO KNOW',
        body: 'Professional Tax is a state-level tax - it is not collected by the central government. About half the states in India levy it; the other half do not. If your business is in Delhi, Uttar Pradesh, Haryana, Rajasthan, Punjab, or Himachal Pradesh, you have zero Professional Tax obligations. Stop here.\n\nFor everyone else, it is governed by the relevant state\'s Professional Tax Act, under the authority granted by Article 276 of the Constitution. The maximum any state can charge is Rs. 2,500 per year per person.',
        note: 'Source: Article 276, Constitution of India; State Professional Tax Acts',
      },
      {
        number: '02',
        heading: 'STATES WHERE PROFESSIONAL TAX APPLIES',
        body: 'Here is where it applies and roughly how much.',
        bullets: [
          'Maharashtra: Up to Rs. 2,500 per year',
          'Karnataka: Up to Rs. 2,496 per year',
          'West Bengal: Up to Rs. 2,500 per year',
          'Tamil Nadu: Up to Rs. 2,400 per year',
          'Andhra Pradesh and Telangana: Up to Rs. 2,500 per year',
          'Madhya Pradesh: Up to Rs. 2,100 per year',
          'Odisha: Up to Rs. 2,500 per year',
          'Kerala: Up to Rs. 2,400 per year',
          'Gujarat: Up to Rs. 2,500 per year',
          'Assam, Meghalaya, Manipur, Tripura, Jharkhand, Sikkim: PT applies with varying slabs',
        ],
        note: 'Exact slabs within each state vary by income bracket. Check your state\'s PT schedule for the current year.',
      },
      {
        number: '03',
        heading: 'IF YOU HAVE EMPLOYEES: YOU NEED TWO REGISTRATIONS',
        body: 'If you are a business owner in a PT state with salaried staff, you typically need two separate registrations - not one.',
        bullets: [
          'PTEC (Professional Tax Enrollment Certificate): This is for you - the business owner, proprietor, partner, or director. You pay PT on yourself.',
          'PTRC (Professional Tax Registration Certificate): This is what lets you deduct PT from your employees\' salaries and deposit it with the state government. Without this, you are not authorised to make those deductions or remittances.',
          'Filing frequency (monthly, quarterly, or annual) and due dates vary by state - check the rules for your specific state.',
        ],
      },
      {
        number: '04',
        heading: 'WHO DOES NOT HAVE TO PAY',
        body: '',
        bullets: [
          'Individuals earning below the state minimum (typically Rs. 7,500 to Rs. 10,000 per month, depending on the state)',
          'Women earning below Rs. 10,000 per month in Maharashtra',
          'Parents or guardians of children with physical or mental disabilities in some states',
          'Members of the armed forces',
          'Persons above 65 years of age in certain states',
          'Everyone in states where PT is simply not levied (Delhi, UP, Haryana, Rajasthan, Punjab, HP)',
        ],
      },
      {
        number: '05',
        heading: 'WHAT NON-COMPLIANCE LOOKS LIKE',
        body: '',
        bullets: [
          'Late registration penalty: Typically Rs. 5 per day in most states',
          'Interest on late payment: 1.25% per month in Maharashtra; similar rates in other states',
          'Penalty for not deducting or not remitting: Up to 10% of unpaid amount plus arrears',
          'Assessment and prosecution by the state PT authority',
        ],
      },
      {
        number: '06',
        heading: 'THE SHORT ANSWER BASED ON YOUR SITUATION',
        body: '',
        bullets: [
          'In a PT state + have salaried employees = Get both PTRC and PTEC',
          'In a PT state + self-employed or proprietor = Get PTEC',
          'In Delhi, UP, Haryana, Rajasthan, Punjab, or HP = Not applicable, move on',
          'Operating in multiple states = Register separately in each state where you have employees or a business presence',
        ],
      },
    ],

    faqs: [
      {
        q: 'Is the Professional Tax I pay deductible anywhere?',
        a: 'Yes. Professional Tax paid on salary income is deductible under Section 16(iii) of the Income Tax Act. For self-employed individuals, it is deductible as a business expense. It partially offsets the cost.',
      },
      {
        q: 'I work remotely for a Bangalore company but live in Delhi. Does PT apply to me?',
        a: 'Professional Tax typically follows the employer\'s registered place of business, not your home address. If your employer is in Karnataka, Karnataka\'s PT rules apply - which means they should be deducting PT from your salary regardless of where you live.',
      },
      {
        q: 'Does PT apply to a Pvt Ltd company?',
        a: 'Yes. The company must get PTEC and pay PT for each director who draws a salary. It must also get PTRC and deduct PT from all salaried employees. These are two separate obligations and both apply.',
      },
    ],

    cta: {
      primary: { label: 'Get Professional Tax Registration', href: '/checkout/professional-tax-registration' },
      secondary: { label: 'Check Shop & Establishment Registration', href: '/learn/do-i-need-shop-establishment-registration' },
    },

    relatedLearn: ['when-does-pf-registration-become-mandatory', 'when-does-esi-registration-become-mandatory', 'do-i-need-shop-establishment-registration'],
    relatedTools: ['/tools/penalty-calculator/professional-tax'],
  },

  // ============================================================

  {
    slug: 'do-i-need-shop-establishment-registration',
    title: 'Do I Need Shop and Establishment Registration?',
    seoTitle: 'Shop & Establishment Registration in India 2025 | Ollvy',
    seoDescription: 'Find out if your business needs Shop and Establishment registration in India. Covers shops, offices, restaurants, and home-based businesses - state-wise rules 2025.',
    lastReviewed: 'March 2025',
    category: 'Registration',
    tier: 2,

    tool: {
      type: 'eligibility',
      title: 'Do You Need Shop & Establishment Registration?',
      questions: [
        {
          id: 'q1',
          text: 'Where does your business actually operate from?',
          options: [
            { value: 'commercial_office', label: 'A commercial office, shop, or retail outlet' },
            { value: 'home_office', label: 'My home - I work from home' },
            { value: 'factory', label: 'A factory or manufacturing unit' },
            { value: 'no_premises', label: 'No fixed premises - I am field-based or entirely online' },
          ],
          evaluatorLogic: 'If commercial_office: return mandatory - most state Acts require registration of any commercial establishment within 30 days of starting business. If factory: return not_required for S&E - factories are governed separately by the Factories Act 1948, not the S&E Act. If home_office: continue to q2 - some states require it, others do not. If no_premises: continue to q2.',
        },
        {
          id: 'q2',
          text: 'Do you have employees?',
          options: [
            { value: 'yes_employees', label: 'Yes, one or more employees work with me' },
            { value: 'no_employees', label: 'No, I am the only person' },
          ],
          evaluatorLogic: 'If yes_employees: return mandatory - practically all state S&E Acts require registration when you have employees. The certificate is also required for bank accounts, GST, and licence applications. If no_employees and commercial_office: return recommended - registration is still typically required for commercial establishments even without staff. If no_employees and home_office: return optional.',
        },
        {
          id: 'q3',
          text: 'Do you need to open a business bank account or apply for a licence soon?',
          options: [
            { value: 'yes', label: 'Yes - setting up a current account or applying for licences' },
            { value: 'no', label: 'No, I already have what I need' },
          ],
          evaluatorLogic: 'If yes: return recommended - banks routinely ask for the S&E certificate as proof of business address when opening current accounts for sole proprietorships. It is also needed for FSSAI, GST, and most other business licences.',
        },
      ],
      defaultResult: {
        type: 'recommended',
        headline: 'You probably need it - register to be safe',
        body: 'Shop and Establishment registration is one of the most foundational compliance steps for any commercial business. Most state Acts require it within 30 days of starting. The certificate also serves as your proof of business address for banks, FSSAI, GST, and other government offices.',
      },
    },

    sections: [
      {
        number: '01',
        heading: 'WHAT SHOP & ESTABLISHMENT REGISTRATION ACTUALLY IS',
        body: 'Shop and Establishment (S&E) registration is a state-level compliance under each state\'s own Shops and Establishments Act. The Act regulates working hours, leaves, holidays, and employment conditions in non-factory workplaces. Registration is essentially your licence to run a commercial operation.\n\nEvery state has its own version of the law with its own rules and timelines. But the core requirement is the same across most states: if you run a commercial establishment, you register.',
        note: 'Source: State-specific Shops and Establishments Acts',
      },
      {
        number: '02',
        heading: 'WHO NEEDS TO REGISTER',
        body: 'The definition of "establishment" is broad. Here is who it covers:',
        bullets: [
          'Retail shops, trading businesses, and commercial offices',
          'Restaurants, cafes, and food establishments',
          'Hotels, boarding houses, and lodges',
          'Theatres, cinemas, and entertainment venues',
          'Warehouses',
          'IT companies, call centres, and BPOs - these are specifically called out in many state Acts',
          'Educational institutions, coaching centres, and tutorials',
          'Home-based businesses where employees come to work (state-specific)',
        ],
        note: 'Factories under the Factories Act 1948 are excluded - they have a separate compliance regime. Government establishments are also typically excluded.',
      },
      {
        number: '03',
        heading: 'WHY IT MATTERS BEYOND JUST COMPLIANCE',
        body: 'The S&E certificate does a lot of practical work for your business.',
        bullets: [
          'Opening a bank current account: Banks almost always ask for this as proof of business address for sole proprietorships and partnership firms',
          'GST registration: Accepted as proof of your principal place of business',
          'FSSAI food licence: Required in most states as a supporting document',
          'Other state licences: Liquor licence, trade licence, fire NOC - many of these ask for your S&E certificate',
          'Labour inspections: The certificate must be displayed visibly in your workplace',
        ],
      },
      {
        number: '04',
        heading: 'WHEN YOU MIGHT NOT NEED IT',
        body: '',
        bullets: [
          'Factories governed by the Factories Act have a separate, more detailed compliance regime',
          'Purely home-based freelancers with no employees and no commercial activities in states with a narrow S&E definition',
          'Agricultural businesses',
          'Government and public sector offices',
        ],
      },
      {
        number: '05',
        heading: 'WHAT HAPPENS WITHOUT REGISTRATION',
        body: '',
        bullets: [
          'Fine: Rs. 1,000 to Rs. 10,000 depending on the state and how long you have been operating without it',
          'Repeated violations can lead to prosecution under the state Act',
          'Practically: You cannot easily open a bank current account, and many licence applications will stall without it',
          'If you have employees and are found unregistered during a labour inspection, the penalties are compounded',
        ],
      },
      {
        number: '06',
        heading: 'THE STRAIGHTFORWARD DECISION TREE',
        body: '',
        bullets: [
          'Commercial premises + any employees = Register within 30 days of starting business',
          'Commercial premises + no employees = Register anyway - most states require it regardless of staff count',
          'Home address + employees = Register in most states',
          'Home address + no employees + no commercial activity from home = Check your specific state; you may be exempt',
          'Factory = Factories Act governs you, not S&E - get a separate compliance review',
        ],
      },
    ],

    faqs: [
      {
        q: 'How long is the certificate valid? Do I need to renew it?',
        a: 'It depends on your state. Maharashtra made its certificate permanent (lifetime) after a 2017 amendment, so no renewal needed there. Delhi and Karnataka require annual renewal. Most other states require annual or once every three years.',
      },
      {
        q: 'Can I use the S&E certificate as my business address proof?',
        a: 'Yes - it is a widely accepted proof of business address. Banks, the GST portal, and most licencing authorities accept it.',
      },
      {
        q: 'I run an online business from home with no physical store. Do I still need this?',
        a: 'If you have employees working with you from that location, almost certainly yes. If you are a solo operator with no employees, it depends on your state. Either way, having the certificate makes your life easier when you need to open bank accounts or apply for other licences.',
      },
      {
        q: 'Is there a minimum number of employees before registration is required?',
        a: 'No. Most state Acts require registration of any establishment regardless of headcount - even a single-person proprietorship running from a commercial space needs to register.',
      },
    ],

    cta: {
      primary: { label: 'Get Shop & Establishment Registration', href: '/checkout/shop-establishment-registration' },
      secondary: { label: 'Check Professional Tax Too', href: '/learn/do-i-need-professional-tax-registration' },
    },

    relatedLearn: ['do-i-need-professional-tax-registration', 'when-does-pf-registration-become-mandatory', 'do-i-need-fssai-license'],
    relatedTools: [],
  },

  // ============================================================
  // TIER 3 - STRATEGIC DECISIONS
  // ============================================================

  {
    slug: 'is-msme-registration-worth-it',
    title: 'Is MSME / Udyam Registration Worth It?',
    seoTitle: 'Is MSME / Udyam Registration Worth It in 2025? | Ollvy',
    seoDescription: 'Find out if Udyam (MSME) registration makes sense for your business. Covers benefits, eligibility, credit access, government tenders, and what you actually get.',
    lastReviewed: 'March 2025',
    category: 'Registration',
    tier: 3,

    tool: {
      type: 'eligibility',
      title: 'Should You Register as an MSME?',
      questions: [
        {
          id: 'q1',
          text: 'What is your business\' annual turnover?',
          options: [
            { value: 'below_5cr', label: 'Below Rs. 5 crore' },
            { value: '5cr_to_250cr', label: 'Rs. 5 crore to Rs. 250 crore' },
            { value: 'above_250cr', label: 'Above Rs. 250 crore' },
          ],
          evaluatorLogic: 'If above_250cr: return not_required - your business is above the MSME turnover limit. If below_5cr or 5cr_to_250cr: continue to q2.',
        },
        {
          id: 'q2',
          text: 'What is the main reason you are looking at Udyam registration?',
          options: [
            { value: 'bank_loan', label: 'Getting a business loan or better credit terms' },
            { value: 'government_tender', label: 'Participating in government tenders or GeM' },
            { value: 'subsidy_benefits', label: 'Accessing subsidies or government schemes' },
            { value: 'just_curious', label: 'Not sure - I just want to understand if it helps me' },
          ],
          evaluatorLogic: 'If bank_loan: return recommended strongly - priority sector lending, CGTMSE collateral-free guarantee, and faster processing make credit significantly more accessible for Udyam-registered MSMEs. If government_tender: return recommended strongly - GeM and PSU tenders have MSME-exclusive categories and price preference. If subsidy_benefits: return recommended - access to CLSS, ZED certification subsidies, and technology upgrade schemes. If just_curious: continue to q3.',
        },
        {
          id: 'q3',
          text: 'Do you supply to large companies, listed firms, or government entities?',
          options: [
            { value: 'yes_large', label: 'Yes, we sell to corporates, PSUs, or the government' },
            { value: 'no_b2c', label: 'No, mostly small businesses or end consumers' },
          ],
          evaluatorLogic: 'If yes_large: return recommended strongly - under the MSMED Act, your buyers must pay you within 45 days. If they do not, compound interest at 3x the RBI bank rate kicks in automatically. This protection only exists for registered MSMEs. If no_b2c: return defaultResult.',
        },
      ],
      defaultResult: {
        type: 'recommended',
        headline: 'Yes - register. It is free and the benefits are real.',
        body: 'Udyam registration is free, instant, and done entirely online with just your PAN and Aadhaar. There is no cost and practically no downside. What you get in return: better access to credit, exclusive government tender categories, and legal protection if large buyers delay payment. There is almost no reason not to do this.',
      },
    },

    sections: [
      {
        number: '01',
        heading: 'WHAT UDYAM REGISTRATION ACTUALLY IS',
        body: 'Udyam Registration is the government\'s official recognition of your business as a Micro, Small, or Medium Enterprise under the MSME Development Act, 2006. It replaced the older Udyog Aadhar system from July 1, 2020. You register on the Udyam portal, it is linked to your PAN and Aadhaar, and it is completely free. No inspection, no verification, no paperwork sent anywhere.',
        note: 'Source: MSMED Act 2006; DPIIT Notification, June 26, 2020',
      },
      {
        number: '02',
        heading: 'DO YOU QUALIFY?',
        body: 'Classification is based on two things: investment in equipment or plant and machinery, and annual turnover. Both criteria must be met.',
        bullets: [
          'Micro Enterprise: Investment below Rs. 1 crore AND turnover below Rs. 5 crore',
          'Small Enterprise: Investment below Rs. 10 crore AND turnover below Rs. 50 crore',
          'Medium Enterprise: Investment below Rs. 50 crore AND turnover below Rs. 250 crore',
          'If either number exceeds the limit, you move into the next category',
          'For service businesses, office equipment, computers, and software count as "equipment"',
        ],
        note: 'Source: Ministry of MSME Notification S.O. 2119(E), June 26, 2020',
      },
      {
        number: '03',
        heading: 'THE BENEFITS THAT ACTUALLY MATTER',
        body: 'Not everything government schemes promise is real. These ones are.',
        bullets: [
          'Loans without collateral: Through CGTMSE (the Credit Guarantee Fund Trust for Micro and Small Enterprises), you can get loans up to Rs. 2 crore without putting up any collateral or a third-party guarantee. For most small business owners, this is transformative.',
          'Priority sector lending: Banks have MSME-specific quotas and targets. Your loan application genuinely moves faster through the system.',
          'Government tender preference: The Government e-Marketplace has MSME-exclusive product and service categories. Government departments are mandated to buy a certain percentage of their procurement from MSMEs.',
          'Payment protection: If a company above Rs. 250 crore turnover has not paid you within 45 days, compound interest at 3x the RBI bank rate accrues automatically. You can file online through MSME Samadhaan and a Facilitation Council must resolve it within 90 days. This only works if you are registered.',
          'ISO certification reimbursement: Government reimburses the cost of ISO certification for registered MSMEs.',
          'Technology upgrade subsidies: Credit Linked Capital Subsidy Scheme (CLSS) provides upfront capital subsidy for technology upgrades.',
        ],
        note: 'CGTMSE is managed jointly by SIDBI and the Ministry of MSME.',
      },
      {
        number: '04',
        heading: 'WHAT IT DOES NOT DO',
        body: 'Let us clear up some common misconceptions.',
        bullets: [
          'It is not mandatory - it is a voluntary registration',
          'It does not automatically give you a loan - it makes you eligible for specific schemes; banks still assess your creditworthiness',
          'It is not the same as DPIIT Startup Recognition - those are different, with different benefits',
          'It does not replace GST, PF, ESI, or any other compliance - those are separate',
          'There is no direct income tax exemption just for being an MSME - any tax benefits require separate qualification',
        ],
      },
      {
        number: '05',
        heading: 'THE PAYMENT PROTECTION ANGLE IS UNDERUSED',
        body: 'If you supply to large companies and have experienced delayed payments, this might be the single most valuable reason to register.',
        bullets: [
          'Under Section 15 of the MSMED Act, buyers must pay MSME suppliers within 45 days of accepting goods or services. If there is no written agreement, the limit is 15 days.',
          'Delay beyond 45 days = compound interest at 3x RBI bank rate, automatically, without needing a court order',
          'Large companies (above Rs. 250 crore turnover) now have to disclose MSME payment dues in their MCA filings (MSME Form 1). This creates real corporate governance pressure.',
          'You can file online through the MSME Samadhaan portal - a formal, quick-resolution mechanism.',
          'None of this is available to you if you are not registered.',
        ],
        note: 'Source: Sections 15-23, Micro, Small and Medium Enterprises Development Act, 2006',
      },
      {
        number: '06',
        heading: 'THE SIMPLEST CASE FOR REGISTERING',
        body: '',
        bullets: [
          'Cost: Zero',
          'Time: 10-15 minutes on udyamregistration.gov.in with your Aadhaar and PAN',
          'Downside: None in practice - you just need to update if you cross a classification threshold',
          'Upside: Better credit terms, tender access, payment protection, scheme eligibility',
          'Verdict: Almost any business below Rs. 250 crore turnover should do this today',
        ],
      },
    ],

    faqs: [
      {
        q: 'Can a Pvt Ltd company register as an MSME?',
        a: 'Yes. Any business structure - sole proprietorship, partnership, LLP, or Private Limited company - can register under Udyam as long as it meets the investment and turnover criteria.',
      },
      {
        q: 'I have an old Udyog Aadhar registration. Is that still valid?',
        a: 'No. Udyog Aadhar registrations expired on December 31, 2021. You need to re-register on the new Udyam Registration portal at udyamregistration.gov.in. Old certificates are no longer accepted for scheme benefits.',
      },
      {
        q: 'Does MSME registration help with my income tax?',
        a: 'Not directly - there is no general income tax exemption for being an MSME. However, registered MSMEs may qualify for specific deductions and state-level concessions. Speak to a CA for what applies to your situation.',
      },
      {
        q: 'What happens if my turnover grows past the MSME limit?',
        a: 'Your Udyam registration is automatically upgraded to the appropriate category as your business grows. The portal syncs with your income tax return data annually. If you cross the medium enterprise limit altogether, the registration lapses.',
      },
    ],

    cta: {
      primary: { label: 'Get Udyam/MSME Registration', href: '/checkout/udyam-registration' },
      secondary: { label: 'Also Check DPIIT Startup Recognition', href: '/learn/should-i-get-dpiit-startup-recognition' },
    },

    relatedLearn: ['should-i-get-dpiit-startup-recognition', 'pvt-ltd-vs-llp', 'do-i-need-gst-registration'],
    relatedTools: [],
  },

  // ============================================================

  {
    slug: 'should-i-get-dpiit-startup-recognition',
    title: 'Should I Get DPIIT Startup Recognition?',
    seoTitle: 'DPIIT Startup India Recognition 2025: Is It Worth It? | Ollvy',
    seoDescription: 'Decide if DPIIT Startup Recognition is right for your company. Covers eligibility, 3-year tax holiday, angel tax exemption, labour law exemptions, and how to apply.',
    lastReviewed: 'March 2025',
    category: 'Registration',
    tier: 3,

    tool: {
      type: 'eligibility',
      title: 'Does DPIIT Startup Recognition Make Sense for You?',
      questions: [
        {
          id: 'q1',
          text: 'What type of entity is your business?',
          options: [
            { value: 'pvt_ltd', label: 'Private Limited Company' },
            { value: 'llp', label: 'LLP' },
            { value: 'partnership', label: 'Partnership firm or sole proprietorship' },
            { value: 'not_incorporated', label: 'Not yet incorporated' },
          ],
          evaluatorLogic: 'If partnership or not_incorporated: return not_required - DPIIT recognition is only for Pvt Ltd companies, LLPs, and registered partnership firms. Sole proprietorships do not qualify. If not_incorporated: note they need to incorporate first. If pvt_ltd or llp: continue to q2.',
        },
        {
          id: 'q2',
          text: 'How long has the business been incorporated?',
          options: [
            { value: 'within_10_years', label: 'Less than 10 years' },
            { value: 'over_10_years', label: 'More than 10 years' },
          ],
          evaluatorLogic: 'If over_10_years: return not_required - the entity must be less than 10 years old from its date of incorporation. If within_10_years: continue to q3.',
        },
        {
          id: 'q3',
          text: 'What is your annual turnover?',
          options: [
            { value: 'below_100cr', label: 'Below Rs. 100 crore' },
            { value: 'above_100cr', label: 'Above Rs. 100 crore' },
          ],
          evaluatorLogic: 'If above_100cr: return not_required - you have exceeded the DPIIT turnover limit. If below_100cr: continue to q4.',
        },
        {
          id: 'q4',
          text: 'What does your business do?',
          options: [
            { value: 'innovation_tech', label: 'Technology-driven or innovation-driven product or service with scale potential' },
            { value: 'traditional_business', label: 'Traditional business - trading, restaurant, salon, real estate' },
            { value: 'planning_raise', label: 'Planning to raise equity funding from investors' },
          ],
          evaluatorLogic: 'If traditional_business: return optional - DPIIT requires working towards "innovation, development, or commercialisation of new products/processes/services driven by technology or IP." A traditional business may not qualify. If innovation_tech or planning_raise: return recommended strongly.',
        },
      ],
      defaultResult: {
        type: 'recommended',
        headline: 'Yes - apply if you meet the criteria',
        body: 'DPIIT Startup Recognition is free to apply for and takes 2-7 working days. The most important benefit for most early-stage companies is angel tax protection - investments above fair market value are not treated as taxable income. If you are raising money from angels, this matters significantly.',
      },
    },

    sections: [
      {
        number: '01',
        heading: 'WHAT THIS RECOGNITION ACTUALLY IS',
        body: 'DPIIT Startup Recognition is a certificate issued by the Department for Promotion of Industry and Internal Trade under the Startup India initiative. It is not the same as MSME/Udyam registration - these are two completely separate things with different benefits. You apply on the Startup India portal (startupindia.gov.in), it is reviewed and approved within 2-7 working days, and the process involves no physical inspection or audit.',
        note: 'Source: DPIIT Notification No. G.S.R. 127(E) dated February 19, 2019',
      },
      {
        number: '02',
        heading: 'DO YOU QUALIFY?',
        body: 'All of these must be true at the same time:',
        bullets: [
          'Entity type: Private Limited Company, LLP, or Registered Partnership Firm',
          'Age: Less than 10 years from the date of incorporation',
          'Turnover: Below Rs. 100 crore in every financial year since you started',
          'Nature of work: You are working towards innovation, development, deployment, or commercialisation of new products, processes, or services - driven by technology or intellectual property',
          'Not formed by splitting up or reconstructing an existing business',
          'Your business is headquartered in India',
        ],
        note: 'Source: Startup India Definition, DPIIT Notification 2019',
      },
      {
        number: '03',
        heading: 'THE BENEFITS - AND WHICH ONES ARE ACTUALLY SIGNIFICANT',
        body: 'Let us be honest about which benefits genuinely move the needle.',
        bullets: [
          'Angel tax exemption (Section 56(2)(viib)): This is the big one. For DPIIT-recognised startups, money received from angel investors above Fair Market Value is not taxed as income from other sources. This was a huge blocker for early-stage funding rounds and removing it matters.',
          '3-year income tax holiday (Section 80-IAC): 100% profit deduction for any 3 consecutive years within your first 10 years. Important note: this requires a separate certification from the Inter-Ministerial Board (IMB) - it is not automatic with DPIIT recognition alone.',
          'Patent filing: 80% rebate on government patent filing fees, plus fast-tracked examination through a dedicated startup IP cell',
          'Labour law self-certification: For 5 years, you can self-certify compliance under 3 central labour laws instead of being subject to inspections',
          'Fund of Funds access: Eligible for investment from SIDBI\'s Fund of Funds via registered AIFs (Alternative Investment Funds)',
        ],
        note: 'Source: Section 80-IAC, Income Tax Act; Section 56(2)(viib) proviso',
      },
      {
        number: '04',
        heading: 'WHEN IT IS NOT WORTH PURSUING',
        body: '',
        bullets: [
          'Traditional businesses (restaurants, salons, real estate, trading) without a technology angle - approval is unlikely, and even if you get it, the tax holiday requires a further level of certification',
          'Businesses older than 10 years or above Rs. 100 crore in revenue - you are simply ineligible',
          'Sole proprietorships and HUFs - not eligible by entity type',
          'Businesses that have no plans to raise equity funding and are already well past startup stage',
        ],
      },
      {
        number: '05',
        heading: 'THE ANGEL TAX PROTECTION IS THE ONE TO UNDERSTAND',
        body: 'If you are raising money from angel investors, this protection matters more than almost any other benefit.',
        bullets: [
          'Section 56(2)(viib) of the Income Tax Act used to treat investments received above Fair Market Value as taxable income for the company - at 30%+. This was called "angel tax" and it was a genuine problem for early-stage startups.',
          'For DPIIT-recognised startups, this provision does not apply. Any investment from eligible investors is not taxed as income.',
          'This removes a major legal risk from your funding round. Without recognition, a large investment at a high valuation could generate a surprise tax bill.',
          'Important: This protection applies to investments from resident Indian individuals and eligible AIFs. Foreign investments still require FEMA compliance.',
        ],
        note: 'Source: Section 56(2)(viib) proviso; CBDT Circular on startup angel tax exemption',
      },
      {
        number: '06',
        heading: 'THE DECISION IS SIMPLE IF YOU QUALIFY',
        body: '',
        bullets: [
          'Pvt Ltd or LLP + under 10 years + under Rs. 100 crore + technology/innovation angle = Apply now. It is free, takes 2-7 days.',
          'Raising from angels soon = Apply before you close the round. The angel tax protection is only active once you are recognised.',
          'Want cheaper patents = Apply now.',
          'Traditional business or above the limits = Skip this; look at Udyam registration instead.',
        ],
      },
    ],

    faqs: [
      {
        q: 'What is the difference between DPIIT recognition and the 3-year tax holiday?',
        a: 'DPIIT recognition from the Startup India portal is the first step - and it gets you most benefits including angel tax protection. The 3-year income tax holiday under Section 80-IAC is a separate, additional step that requires a certificate from the Inter-Ministerial Board of Certification (IMBC). The Board is more selective - they look for validated innovation. Getting DPIIT recognition does not automatically give you the tax holiday.',
      },
      {
        q: 'Does DPIIT recognition involve any government inspection?',
        a: 'No. You self-declare on the Startup India portal, upload your incorporation certificate, and describe your product or innovation with supporting evidence (like a website or pitch deck). No physical inspection or audit is triggered.',
      },
      {
        q: 'Can I have both DPIIT recognition and Udyam registration at the same time?',
        a: 'Yes, and if you qualify for both, you should have both. They serve completely different purposes. DPIIT gives you income tax protection and fundraising benefits. Udyam gives you credit access, tender eligibility, and payment protection from large buyers. Apply for both.',
      },
      {
        q: 'Does DPIIT recognition need to be renewed?',
        a: 'No. Recognition stays valid until you cross the 10-year age limit or the Rs. 100 crore turnover threshold. There is no renewal. If you no longer qualify, you are expected to inform DPIIT.',
      },
    ],

    cta: {
      primary: { label: 'Get DPIIT Startup Recognition', href: '/checkout/dpiit-startup-recognition' },
      secondary: { label: 'Get Udyam/MSME Registration Too', href: '/checkout/udyam-registration' },
    },

    relatedLearn: ['pvt-ltd-vs-llp', 'is-msme-registration-worth-it', 'do-i-need-trademark-registration'],
    relatedTools: [],
  },

  // ============================================================

  {
    slug: 'do-i-need-fssai-license',
    title: 'Do I Need an FSSAI Licence?',
    seoTitle: 'Do I Need an FSSAI Licence in India 2025? | Ollvy',
    seoDescription: 'Find out if FSSAI registration or licence is mandatory for your food business in India. Covers restaurants, cloud kitchens, home cooks, manufacturers, and importers.',
    lastReviewed: 'March 2025',
    category: 'Licensing',
    tier: 3,

    tool: {
      type: 'eligibility',
      title: 'What FSSAI Licence Does Your Food Business Need?',
      questions: [
        {
          id: 'q1',
          text: 'What does your food business do?',
          options: [
            { value: 'restaurant_cafe', label: 'Restaurant, cafe, dhaba, canteen, or cloud kitchen' },
            { value: 'manufacturer_packager', label: 'Manufacturing, processing, or packaging food products' },
            { value: 'trader_retailer', label: 'Trading, retailing, or distributing food (offline or online)' },
            { value: 'importer_exporter', label: 'Importing or exporting food' },
          ],
          evaluatorLogic: 'If importer_exporter: return mandatory for Central FSSAI Licence - all food importers and exporters need a Central licence regardless of turnover. For all others: continue to q2 to determine the right tier.',
        },
        {
          id: 'q2',
          text: 'What is your annual turnover from food activities?',
          options: [
            { value: 'below_12l', label: 'Below Rs. 12 lakh per year' },
            { value: '12l_to_20cr', label: 'Rs. 12 lakh to Rs. 20 crore per year' },
            { value: 'above_20cr', label: 'Above Rs. 20 crore per year' },
          ],
          evaluatorLogic: 'If below_12l: return mandatory for Basic Registration (Form A) - petty food business registration. If 12l_to_20cr: return mandatory for State FSSAI Licence (Form B). If above_20cr: return mandatory for Central FSSAI Licence (Form B Central).',
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

    cta: {
      primary: { label: 'Get FSSAI Registration or Licence', href: '/checkout/fssai-registration' },
      secondary: { label: 'Check Shop & Establishment Registration', href: '/learn/do-i-need-shop-establishment-registration' },
    },

    relatedLearn: ['do-i-need-shop-establishment-registration', 'do-i-need-gst-registration', 'is-msme-registration-worth-it'],
    relatedTools: [],
  },

  // ============================================================

  {
    slug: 'which-itr-form-should-i-use',
    title: 'Which ITR Form Should I Use?',
    seoTitle: 'Which ITR Form to Use in 2025? ITR-1 to ITR-7 Guide | Ollvy',
    seoDescription: 'Find out which Income Tax Return form applies to you in India for FY 2024-25. ITR-1, ITR-2, ITR-3, ITR-4, ITR-5, ITR-6, ITR-7 - clear eligibility explained.',
    lastReviewed: 'March 2025',
    category: 'Tax',
    tier: 3,

    tool: {
      type: 'comparison',
      title: 'Find Your ITR Form',
      questions: [
        {
          id: 'q1',
          text: 'What type of entity are you filing for?',
          options: [
            { value: 'individual', label: 'An individual or HUF' },
            { value: 'firm_llp', label: 'A partnership firm or LLP' },
            { value: 'company', label: 'A Private Limited or Public Limited company' },
            { value: 'trust_ngo', label: 'A trust, society, NGO, AOP, or BOI' },
          ],
          evaluatorLogic: 'If firm_llp: return mandatory ITR-5. If company: return mandatory ITR-6. If trust_ngo: return mandatory ITR-7. If individual: continue to q2.',
        },
        {
          id: 'q2',
          text: 'Where does your income come from?',
          options: [
            { value: 'salary_only', label: 'Salary or pension - that is mostly it' },
            { value: 'salary_capital', label: 'Salary plus capital gains from shares, mutual funds, or property' },
            { value: 'business_professional', label: 'Business income or professional fees (freelancer, doctor, consultant, trader)' },
            { value: 'presumptive', label: 'A small business where I want to declare income as a flat percentage (Section 44AD/44ADA)' },
          ],
          evaluatorLogic: 'If presumptive: return recommended ITR-4 (Sugam) - for individuals, HUFs, and firms (not LLP) using presumptive taxation. Cannot use if you have capital gains, more than one house property, or foreign income. If business_professional: continue to q3. If salary_capital: return mandatory ITR-2. If salary_only: continue to q3.',
        },
        {
          id: 'q3',
          text: 'Does any of this apply to you?',
          options: [
            { value: 'director_unlisted_shares', label: 'I am a director in any company, or I hold unlisted shares' },
            { value: 'foreign_assets', label: 'I have foreign assets, a foreign bank account, or income from outside India' },
            { value: 'above_50l', label: 'My total income from all sources is above Rs. 50 lakh' },
            { value: 'simple_salary', label: 'None of these - just salary, one property, and some interest income' },
          ],
          evaluatorLogic: 'If director_unlisted_shares or foreign_assets or above_50l: return mandatory ITR-2. If simple_salary and income below Rs. 50 lakh and no capital gains: return recommended ITR-1 (Sahaj). If business_professional from q2: return recommended ITR-3.',
        },
      ],
      defaultResult: {
        type: 'optional',
        headline: 'When in doubt, use ITR-2',
        body: 'If you are unsure whether to use ITR-1 or ITR-2, go with ITR-2. It covers everything ITR-1 covers, plus more. There is no penalty for filing a more comprehensive form than strictly required. But if you file ITR-1 when you should have used ITR-2, the return is treated as defective.',
      },
    },

    sections: [
      {
        number: '01',
        heading: 'THE FULL PICTURE: ALL 7 ITR FORMS',
        body: 'India has 7 ITR forms and each one is designed for a specific type of taxpayer. Filing the wrong one is treated as a defective return - you will get a notice asking you to re-file in the correct form within 15 days.',
        bullets: [
          'ITR-1 (Sahaj): For resident individuals with total income below Rs. 50 lakh, earned from salary, one house property, and other sources like interest. No capital gains. No directorship. No foreign assets.',
          'ITR-2: For individuals with capital gains, more than one house property, foreign income, total income above Rs. 50 lakh, directorship in a company, or holding of unlisted shares.',
          'ITR-3: For individuals or HUFs with income from business or profession - non-presumptive (you maintain actual books of accounts).',
          'ITR-4 (Sugam): For individuals, HUFs, and firms (not LLPs) using presumptive taxation under Sections 44AD, 44ADA, or 44AE.',
          'ITR-5: For partnership firms, LLPs, AOPs (Association of Persons), and BOIs (Body of Individuals).',
          'ITR-6: For all companies (except those claiming exemption under Section 11).',
          'ITR-7: For trusts, political parties, universities, and scientific research institutions filing under Sections 139(4A), 139(4B), 139(4C), or 139(4D).',
        ],
        note: 'Source: CBDT ITR Notification for AY 2025-26',
      },
      {
        number: '02',
        heading: 'ITR-1 VS ITR-2: THE CONFUSION MOST PEOPLE FACE',
        body: 'Most salaried people file ITR-1 and that is usually right. But ITR-1 cannot be used in a few specific situations - and these are more common than people realise.',
        bullets: [
          'You are a director in any company - even a small startup where you earn nothing yet',
          'You hold unlisted equity shares at any point during the year',
          'You have any capital gains - from selling shares, mutual funds, property, or any other asset',
          'You have income from more than one house property',
          'Your total income from all sources exceeds Rs. 50 lakh',
          'You have a foreign bank account, foreign investments, or any income from outside India',
          'You are a non-resident or not ordinarily resident',
          'Your agricultural income exceeds Rs. 5,000',
        ],
        note: 'If you filed ITR-1 last year but any of these apply this year, you need ITR-2 this time.',
      },
      {
        number: '03',
        heading: 'ITR-3 VS ITR-4: FOR BUSINESS AND PROFESSIONAL INCOME',
        body: 'If you have business or professional income, your choice comes down to one question: are you using the presumptive taxation scheme?',
        bullets: [
          'ITR-4 (Sugam) is for you if you want to keep things simple and declare income as a flat percentage - 8% of turnover for business (or 6% for digital receipts), or 50% of gross receipts for professionals. You cannot use this if your business turnover exceeds Rs. 2 crore or your professional receipts exceed Rs. 50 lakh, or if you also have capital gains.',
          'ITR-3 is for you if you maintain actual accounts, or your turnover exceeds the presumptive limits, or you have capital gains alongside your business income.',
          'One important catch: if you opt out of the presumptive scheme, you cannot re-enter it for the next 5 years (Section 44AD). So think before you switch.',
        ],
        note: 'Source: Sections 44AD, 44ADA, 44AE, Income Tax Act 1961',
      },
      {
        number: '04',
        heading: 'ITR-5 FOR FIRMS AND LLPS',
        body: 'Partnership firms and LLPs always file ITR-5 - regardless of size, profit level, or whether the business was active during the year. The firm files ITR-5 for its own income. Each partner then files their own individual ITR for their personal income.',
        bullets: [
          'The partner\'s share of LLP profit is exempt from tax in their personal ITR (it has already been taxed at the LLP level)',
          'But any salary or interest the partner receives from the LLP is taxable in the partner\'s individual return',
          'Partners typically file ITR-3 (if they also have business income) or ITR-2 (if they have only salary and capital gains)',
        ],
      },
      {
        number: '05',
        heading: 'WHAT HAPPENS IF YOU FILE THE WRONG FORM',
        body: 'It is not the end of the world, but it does create problems.',
        bullets: [
          'Defective return notice under Section 139(9): You will be asked to re-file in the correct form within 15 days',
          'If you do not respond: The return is treated as if you never filed - which triggers late filing fees and interest',
          'Losses cannot be carried forward: If the return ends up being invalid, you lose the ability to carry forward any losses for that year',
          'Increased scrutiny risk: A defective return filing pattern can trigger closer scrutiny of your tax affairs',
        ],
      },
      {
        number: '06',
        heading: 'THE QUICK REFERENCE YOU CAN BOOKMARK',
        body: '',
        bullets: [
          'Pvt Ltd or Public Company = ITR-6',
          'LLP or Partnership Firm = ITR-5',
          'Trust, NGO, political party = ITR-7',
          'Individual: salary + one property + interest + total under Rs. 50 lakh + no capital gains + not a director = ITR-1',
          'Individual: capital gains, director role, foreign assets, above Rs. 50 lakh, or unlisted shares = ITR-2',
          'Individual or firm: business/professional income under presumptive limits = ITR-4',
          'Individual or firm: business income with actual accounts, or with capital gains alongside business income = ITR-3',
        ],
      },
    ],

    faqs: [
      {
        q: 'I am salaried and sold some mutual fund units this year. Which form do I use?',
        a: 'ITR-2. Any capital gains - even from redeeming mutual funds - disqualify you from ITR-1. It does not matter how small the amount is.',
      },
      {
        q: 'I am a freelancer getting paid in foreign currency. Which form applies to me?',
        a: 'ITR-3 if you maintain actual books of accounts and declare actual profit. ITR-4 if your gross receipts are below Rs. 50 lakh and you want to use the 50% flat deduction under Section 44ADA (which applies to professionals - designers, writers, consultants, etc.). If you also have a foreign bank account, ITR-2 requirements may apply - check with a CA.',
      },
      {
        q: 'I filed ITR-1 last year. This year I joined a startup as a co-founder and hold shares. Same form?',
        a: 'No. If you hold unlisted shares or are a director in any company, you must use ITR-2. This is one of the most common reasons people get a defective return notice.',
      },
      {
        q: 'Can I switch from ITR-1 to ITR-2 if I realise I filed the wrong one?',
        a: 'Yes. File a revised return (revised ITR) using the correct form by December 31 of the assessment year. A revised return replaces the original completely.',
      },
      {
        q: 'My LLP partner also has salaried income from another job. What does their return look like?',
        a: 'They file one ITR that covers both their salary income and their share of the LLP. Their LLP profit share goes in as exempt income. Any salary or interest they receive from the LLP itself is reported as taxable. Most partners with both salary and LLP income use ITR-3.',
      },
    ],

    cta: {
      primary: { label: 'File My ITR - Expert Assisted', href: '/checkout/itr-filing' },
      secondary: { label: 'Check If I Need to File at All', href: '/learn/do-i-need-to-file-itr' },
    },

    relatedLearn: ['do-i-need-to-file-itr', 'pvt-ltd-vs-llp', 'do-i-need-gst-registration'],
    relatedTools: ['/tools/penalty-calculator/itr', '/tools/documents/itr-filing-individual', '/tools/documents/itr-filing-business'],
  },

];

export default learnPages;
