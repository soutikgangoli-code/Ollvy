# Guide Pages Content

This document contains all guide page content from the Ollvy codebase for content review and improvement.

---

## Schema Reference

```typescript
export interface LearnPageConfig {
  slug: string;
  title: string;                       // H1 - plain language, specific
  seoTitle: string;                    // <title> tag - includes year + location signal
  seoDescription: string;              // meta description - answer-first
  canonicalUrl: string;
  lastReviewed: string;                // "March 2025" - shown on page, updated manually
  category: LearnCategory;
  relatedServiceSlugs: string[];       // which service pages to link to
  relatedLearnSlugs: string[];         // which other /guides pages to link to

  // Tool config - one tool per page, shown at top
  tool?: LearnToolConfig;

  // Page sections
  sections: LearnSection[];

  // FAQs - shown after sections
  faqs?: LearnFaq[];

  // Service CTA at bottom
  ctaServiceSlug: string;              // primary service to promote
  ctaSecondarySlug?: string;           // secondary CTA if relevant

  // Related external tools (penalty calculators, document checklists)
  relatedTools?: RelatedTools;
}

export interface LearnToolConfig {
  type: 'eligibility' | 'penalty' | 'comparison' | 'deadline';
  title: string;
  questions?: EligibilityQuestion[];
  defaultResult?: EligibilityResult;
}

export interface LearnSection {
  number?: string;
  heading: string;
  body: string;
  bullets?: string[];
  note?: string;
}

export interface LearnFaq {
  q: string;
  a: string;
}

export type LearnCategory =
  | 'GST'
  | 'Incorporation'
  | 'Startup'
  | 'Licensing'
  | 'Tax'
  | 'Compliance'
  | 'Payroll'
  | 'Registration';
```

---

# Tier 1 - Core Business Decisions

---

## 1. GST Registration Guide

**File:** `lib/guides/pages/gst-registration.ts`

- **Slug:** `do-i-need-gst-registration`
- **Title:** Do I Need GST Registration?
- **SEO Title:** Do I Need GST Registration in India 2025? | Ollvy
- **SEO Description:** Find out if GST registration is mandatory for your business in India. Covers turnover thresholds, exemptions, interstate supply rules, and e-commerce.
- **Category:** Tax
- **CTA Service:** gst-registration
- **Related Tools:**
  - Penalty Calculators: gst-late-filing
  - Document Checklists: gst-registration

### Interactive Tool

**Title:** Is GST Registration Mandatory for You?
**Type:** eligibility

**Questions:**
1. What was your turnover in the last 12 months?
   - Below Rs. 20 lakh
   - Rs. 20 lakh to Rs. 40 lakh
   - Above Rs. 40 lakh

2. Do you make any interstate sales - selling goods or services to customers in other states?
   - Yes, I sell to customers in other states
   - No, everything is within my state
   - I am not sure

3. Do you sell through e-commerce platforms like Amazon, Flipkart, or Swiggy?
   - Yes, I sell through e-commerce
   - No, I sell only through my own channels

4. What kind of business do you run?
   - A service-based business (consulting, freelancing, IT services, etc.)
   - Trading goods (buying and selling products)
   - Manufacturing
   - A restaurant or food business
   - Something else

**Default Result:**
- Type: optional
- Headline: GST registration is currently optional for you
- Body: Your turnover is below the threshold and you do not appear to have any mandatory triggers. However, there are benefits to voluntary registration - you can claim input tax credit, you appear more credible to business clients, and you are positioned for growth. Consider registering if you plan to scale.

### Sections

**01. THE SHORT ANSWER**
GST registration becomes mandatory the moment any of these are true:
- Your aggregate turnover in a financial year crosses Rs. 20 lakh (Rs. 10 lakh if you are in a special category state like Manipur, Mizoram, Nagaland, or Tripura)
- For goods-only suppliers in most states, the threshold is Rs. 40 lakh - but this does NOT apply to services
- You make any interstate supply - even a single sale to a customer in another state
- You sell through e-commerce platforms - mandatory regardless of turnover
- You are liable to pay tax under reverse charge mechanism
- You are an agent of a registered supplier
- You supply goods through an e-commerce operator who collects TCS

Note: Source: Section 22, Central Goods and Services Tax Act, 2017

**02. INTERSTATE SUPPLY: THE TRIGGER MOST PEOPLE MISS**
If you provide services or sell goods to customers outside your state - even if your total turnover is Rs. 5 lakh - you need GST registration. There is no threshold for interstate supply.

This catches a lot of freelancers and consultants by surprise. You are based in Mumbai, you build a website for a client in Delhi - that is an interstate supply, and you need GST.

The only exception: if you are making interstate supply of services and your aggregate turnover is below Rs. 20 lakh, you may be exempt under a specific notification. But this exception does not apply to goods at all.

Note: Source: Section 24, CGST Act - Compulsory registration; Notification 10/2017 Central Tax

**03. E-COMMERCE: NO THRESHOLD AT ALL**
If you sell anything through an e-commerce platform - Amazon, Flipkart, Meesho, Swiggy, Zomato, Urban Company - GST registration is mandatory from day one. There is no Rs. 20 lakh threshold.

This applies whether you are selling products or providing services through the platform. The e-commerce operator is required to collect TCS (Tax Collected at Source) from your sales, and that only works if you have a GSTIN.

Note: Source: Section 24(ix), CGST Act 2017; Section 52, TCS provisions

**04. WHEN YOU GENUINELY DO NOT NEED GST**
You are exempt from GST registration if all of these are true at the same time:
- Your aggregate turnover is below Rs. 20 lakh (Rs. 10 lakh in special category states, Rs. 40 lakh for goods-only in normal states)
- You are not making any interstate supply
- You are not selling through any e-commerce platform
- You are not liable to pay reverse charge
- You deal only in GST-exempt goods or services (like fresh vegetables, certain educational services, healthcare services)
- You are engaged exclusively in agriculture (cultivating, harvesting, and selling unprocessed agricultural produce)

Note: Even if you are exempt, voluntary registration is sometimes useful - see below.

**05. WHY SOME EXEMPT BUSINESSES REGISTER ANYWAY**
Voluntary registration exists for a reason.
- Input Tax Credit: If you are registered, you can claim ITC on your purchases and reduce your tax liability. Without registration, GST you pay on inputs is a cost.
- Business credibility: B2B clients often prefer working with GST-registered vendors because they can claim ITC on your invoices.
- Interstate transactions: If you plan to expand to other states, registering now avoids disruption later.
- E-commerce readiness: If you plan to sell on Amazon or Flipkart in the future, you will need GSTIN anyway.
- Tender eligibility: Many government tenders require GSTIN as a basic eligibility condition.

Note: Voluntary registration is under Section 25(3) of the CGST Act. Once you register voluntarily, all provisions of the Act apply to you.

**06. WHAT HAPPENS IF YOU DO NOT REGISTER WHEN YOU SHOULD**
- Penalty: 100% of the tax due or Rs. 10,000, whichever is higher (Section 122)
- Interest: 18% per annum on unpaid tax from the date it was due
- Seizure of goods: If you are caught transporting goods without proper documents
- Prosecution: For serious or repeated offences

Note: Use our penalty calculator for exact amounts: /tools/penalty-calculator/gst-late-filing

### FAQs

**Q: I am a freelancer earning Rs. 15 lakh per year. All my clients are in my state. Do I need GST?**
A: If all your clients are in the same state as you and your aggregate turnover is below Rs. 20 lakh, GST registration is not mandatory. But check carefully - even one client in another state makes you liable.

**Q: What is the difference between aggregate turnover and taxable turnover?**
A: Aggregate turnover includes the total value of all taxable supplies, exempt supplies, exports, and interstate supplies. It is calculated on a PAN-India basis, not state-wise. Taxable turnover is just the part that is subject to GST. For determining registration threshold, aggregate turnover is what matters.

**Q: Can I register for GST even if I am below the threshold?**
A: Yes. Section 25(3) allows voluntary registration. Once registered, you can issue tax invoices, collect GST, and claim input tax credit. Many small businesses register voluntarily for credibility and to work with larger clients.

**Q: I sell on Instagram and WhatsApp. Is that e-commerce?**
A: No - selling directly via social media is not considered e-commerce under GST law. The e-commerce provision applies only when you sell through a platform that facilitates the transaction (like Amazon or Swiggy). Direct social selling is treated like any other direct sale.

**Q: What happens if I cross the threshold mid-year?**
A: You must apply for GST registration within 30 days of crossing the threshold. GST liability starts from the date you became liable, not the date of registration. Late registration means you owe GST on all supplies made after you crossed the threshold.

---

## 2. Pvt Ltd vs LLP Guide

**File:** `lib/guides/pages/pvt-ltd-vs-llp.ts`

- **Slug:** `pvt-ltd-vs-llp`
- **Title:** Private Limited Company vs LLP: Which Should You Choose?
- **SEO Title:** Pvt Ltd vs LLP in India 2025: Which is Better for You? | Ollvy
- **SEO Description:** Compare Private Limited Company and LLP in India. Understand compliance costs, tax implications, liability protection, and which is better for your business.
- **Category:** Incorporation
- **CTA Service:** pvt-ltd-incorporation
- **Related Tools:**
  - Penalty Calculators: mca-annual-filing
  - Document Checklists: private-limited-company, llp

### Interactive Tool

**Title:** Which Structure is Right for Your Business?
**Type:** comparison

**Questions:**
1. Are you planning to raise equity investment from angel investors or VCs?
   - Yes, raising external funding is on the roadmap
   - Maybe in a few years
   - No, I plan to bootstrap or use debt financing

2. How many people will actively run the business day-to-day?
   - Just me (solo founder)
   - 2-3 co-founders or partners
   - More than 3 people involved in operations

3. What is your expected annual turnover in the first 2-3 years?
   - Below Rs. 40 lakh
   - Rs. 40 lakh to Rs. 2 crore
   - Above Rs. 2 crore

4. How do you feel about compliance overhead?
   - I want minimal paperwork and filings
   - I am okay with some compliance if it helps the business
   - Compliance is not a concern - growth matters more

**Default Result:**
- Type: optional
- Headline: Both structures could work for you
- Body: Based on your inputs, you do not have a strong tilt toward either structure. Both Pvt Ltd and LLP offer liability protection and tax efficiency. The decision often comes down to: are you ever going to want external equity investment (even 3-5 years out)? If yes, go Pvt Ltd. If not, LLP may be simpler.

### Sections

**01. THE REAL DIFFERENCE IN ONE LINE**
A Private Limited Company can issue shares and raise equity investment. An LLP cannot. If you ever plan to raise money from angel investors or VCs - even years from now - the Pvt Ltd structure is the only realistic option.

Everything else - compliance, taxation, liability protection - is secondary to this fundamental difference.

Note: Source: Companies Act, 2013; Limited Liability Partnership Act, 2008

**02. WHEN TO CHOOSE A PRIVATE LIMITED COMPANY**
- You plan to raise external equity funding - now or in the future
- You want a structure that scales easily to multiple shareholders and complex cap tables
- You want the credibility that comes with "Pvt Ltd" for B2B sales, government contracts, or hiring
- You are comfortable with higher compliance requirements
- You have a clear separation between ownership (shareholders) and management (directors)

Note: A Pvt Ltd can have up to 200 shareholders. An LLP has no such limit but cannot issue equity.

**03. WHEN TO CHOOSE AN LLP**
- You are bootstrapping and do not plan to raise equity
- You want lower compliance costs - no mandatory audit below Rs. 40 lakh turnover
- You want flexibility in profit distribution among partners
- You are starting a professional services firm (CA, lawyer, architect) where the LLP structure is common
- You want to avoid dividend distribution tax by taking profits as partner remuneration

Note: An LLP must have at least 2 designated partners. There is no concept of a single-person LLP.

**04. COMPLIANCE: THE REAL ANNUAL COST**
Pvt Ltd annual compliance includes:
- Annual return (MGT-7) - mandatory regardless of activity
- Financial statements (AOC-4) - mandatory regardless of activity
- Statutory audit - mandatory for all companies, every year
- Board meetings - minimum 4 per year
- Director KYC (DIR-3 KYC) - once every three years per director
- Income tax return - mandatory every year
- Estimated annual compliance cost: Rs. 25,000 to Rs. 50,000 for a small company with minimal activity

LLP annual compliance includes:
- Annual return (Form 11) - mandatory regardless of activity
- Statement of accounts (Form 8) - mandatory regardless of activity
- No mandatory audit if turnover is below Rs. 40 lakh AND partner contribution is below Rs. 25 lakh
- Partner KYC - once per partner
- Income tax return - mandatory every year
- Estimated annual compliance cost: Rs. 10,000 to Rs. 20,000 for a small LLP with minimal activity

Note: These are professional fees excluding GST and government fees. Actual costs depend on your CA and complexity.

**05. TAXATION: NOT AS DIFFERENT AS YOU THINK**
Both Pvt Ltd and LLP are taxed at a flat 25% (for companies with turnover up to Rs. 400 crore) or 22% under the new tax regime.

The difference is in how profits are distributed:
- Pvt Ltd: Dividends are taxed in the hands of shareholders at their slab rate. There is no deduction for the company.
- LLP: Partner remuneration and interest on capital are deductible expenses for the LLP, reducing taxable profit. Partners pay tax on their share at individual slab rates.

This makes LLP more tax-efficient for profit extraction in many cases - but the benefit reduces as your tax bracket increases.

Note: Source: Section 115BAA, Income Tax Act (new tax regime); Section 40(b), Income Tax Act (LLP deductions)

**06. IF YOU ARE STILL UNSURE**
Ask yourself one question: Will you ever want to raise equity from investors?
- If the answer is yes or maybe - go with Pvt Ltd. Converting an LLP to a Pvt Ltd later is expensive and complicated.
- If the answer is definitely no - LLP is simpler and cheaper to run.

Most tech startups, funded ventures, and companies planning significant scale choose Pvt Ltd. Most bootstrapped service businesses, professional firms, and family businesses prefer LLP.

### FAQs

**Q: Can I convert an LLP to a Pvt Ltd later?**
A: Yes, but it is expensive and complicated. The process involves incorporation of a new company, transfer of assets and liabilities, and stamp duty (which can be significant on property transfers). It is much easier to start as a Pvt Ltd if there is any chance you will want that structure later.

**Q: Which is better for tax savings?**
A: For small, bootstrapped businesses where owners want to extract profits regularly, LLP is often more tax-efficient due to the deductibility of partner remuneration. For businesses reinvesting profits or planning to raise equity, the tax difference is minimal and Pvt Ltd offers more flexibility.

**Q: Can a single person start either structure?**
A: A Pvt Ltd can be started with just one shareholder and one director (One Person Company, or regular Pvt Ltd with a nominee shareholder). An LLP requires at least two designated partners - you cannot have a single-person LLP.

**Q: What about liability protection?**
A: Both structures offer limited liability. Shareholders of a Pvt Ltd are not personally liable beyond their share capital. Partners of an LLP are not personally liable beyond their capital contribution. However, both can be held personally liable for fraud or wrongful acts.

---

## 3. ITR Filing Guide

**File:** `lib/guides/pages/itr-filing.ts`

- **Slug:** `do-i-need-to-file-itr`
- **Title:** Do I Need to File an Income Tax Return?
- **SEO Title:** Do I Need to File ITR in 2025? Mandatory vs Optional | Ollvy
- **SEO Description:** Check if ITR filing is mandatory for you in India. Covers salaried, freelancers, business owners, and NRIs - with 2025-26 thresholds and exemptions.
- **Category:** Tax
- **CTA Service:** business-itr
- **Related Tools:**
  - Penalty Calculators: itr-late-filing
  - Document Checklists: business-itr, individual-itr

### Interactive Tool

**Title:** Is ITR Filing Mandatory for You?
**Type:** eligibility

**Questions:**
1. What was your total income in FY 2024-25 - before any deductions?
   - Below Rs. 2.5 lakh
   - Rs. 2.5 lakh to Rs. 5 lakh
   - Rs. 5 lakh to Rs. 1 crore
   - Above Rs. 1 crore

2. Does any of this apply to you?
   - Tax was deducted at source from my salary, FD interest, or freelance payments
   - I have a foreign bank account, investments abroad, or assets outside India
   - I deposited Rs. 1 crore or more in a bank account, or spent Rs. 2 lakh or more on international travel, or paid electricity bills over Rs. 1 lakh
   - None of these apply to me

3. How old are you?
   - Under 60
   - 60 to 80 (Senior Citizen)
   - Above 80 (Super Senior Citizen)

4. Are you planning to apply for any of these in the next 12 months?
   - A home loan or business loan
   - A US, UK, or Schengen visa
   - A government tender or contract
   - None of these

**Default Result:**
- Type: recommended
- Headline: Not strictly required - but filing anyway is a good idea
- Body: Your income seems to be below the taxable limit. But here is the thing - filing a nil return costs you nothing and takes about 30 minutes. What it gives you is a formal income record that banks, visa offices, and government departments recognise. It also protects you from any future income tax notice asking you to explain where your money came from.

### Sections

**01. WHO HAS TO FILE**
Under Section 139(1) of the Income Tax Act, 1961, you are required to file if your gross income - before any deductions - crosses the basic exemption limit. But income level is not the only reason you might need to file.
- Gross income above Rs. 2.5 lakh if you are under 60, Rs. 3 lakh if you are between 60 and 80, or Rs. 5 lakh if you are above 80
- You deposited cash above Rs. 1 crore in one or more current accounts during the year
- You spent more than Rs. 2 lakh on international travel
- Your electricity bills totalled more than Rs. 1 lakh across the year
- You own property abroad, have a foreign bank account, or earn any income outside India
- You run a company or a firm - all companies and firms must file regardless of profit or loss
- You want to carry forward a loss (from investments, business) to set off against future income
- Tax was deducted from any of your payments and you want that money back

Note: Source: Section 139(1), Income Tax Act 1961; Rule 12AB, Income Tax Rules 1962

**02. NO EXCEPTIONS HERE - THESE ARE HARD MANDATORY**
If any of these apply, you must file. No way around it.
- You are a company or an LLP - mandatory every year, even if no business was done and there was zero income
- Your total income exceeds the basic exemption limit for your age
- You made a high-value transaction - bank deposit above Rs. 1 crore, international travel above Rs. 2 lakh, electricity above Rs. 1 lakh
- You are a director in any Indian company - even if it is a dormant startup you co-founded years ago
- You invested more than Rs. 10 lakh in mutual funds or stocks during the year
- You hold any asset outside India or have an account with a foreign bank
- Tax was deducted at source from any payment and you want to claim it back

Note: Source: CBDT Notification; Rule 12AB added by the Income Tax (6th Amendment) Rules, 2022

**03. REASONS TO FILE EVEN WHEN YOU TECHNICALLY DO NOT HAVE TO**
Sometimes the most practical reason to file has nothing to do with tax.
- Visa applications: US, UK, and Schengen embassies routinely ask for 2-3 years of ITRs as standard income proof
- Home loans and car loans: Banks and NBFCs ask self-employed applicants for ITR copies; increasingly, salaried applicants are asked too
- Government tenders: ITR submission is a standard pre-qualification requirement
- Premium credit cards: Most private banks require ITR for cards above a certain credit limit
- Building a paper trail: If you earn from multiple informal sources - rent, tuition, freelance - an ITR gives you documented proof of income
- Carrying forward losses: If you had capital losses or business losses, you can only use them against future profits if you file by the due date

**04. WHEN YOU GENUINELY DO NOT NEED TO FILE**
You are truly exempt if all of these are true at the same time:
- Your gross income is below Rs. 2.5 lakh (under 60), Rs. 3 lakh (60-80), or Rs. 5 lakh (above 80) - before any deductions
- You have no foreign assets, accounts, or income
- You have not made any high-value transactions
- No tax was deducted from any of your income
- You have no capital or business losses you want to carry forward
- You are not a director in any company
- You have no plans for loans, visas, or government contracts soon

Note: One more thing: Senior citizens above 75 with only pension and interest income from the same bank are exempt from filing if the bank deducts TDS on their behalf under Section 194P.

**05. WHAT MISSING THE DEADLINE ACTUALLY COSTS YOU**
Missing the due date (July 31 for most individuals) has consequences that grow over time.
- Late filing fee: Rs. 5,000 if your total income is above Rs. 5 lakh; Rs. 1,000 if below (Section 234F)
- Interest on tax due: 1% per month from the original due date until you actually file (Section 234A)
- Losses lost permanently: Capital losses, business losses, and speculation losses cannot be carried forward if you miss the due date - that tax benefit is gone for good
- Income tax notice risk: The department can reopen your assessment up to 3 years back, or up to 10 years for larger undisclosed amounts
- Prosecution: Willful failure to file when tax was owed can lead to prosecution under Section 276CC

Note: Use our penalty calculator for exact amounts based on your situation: /tools/penalty-calculator/itr-late-filing

**06. ANSWER YES TO ANY OF THESE - THEN FILE**
- Is your gross income above your age-based exemption limit? YES - mandatory
- Was tax deducted from your salary, FD interest, or any payment to you? YES - file to get your refund
- Do you have any foreign assets or income? YES - mandatory
- Are you a director in any company? YES - mandatory
- Do you need a loan, visa, or government contract in the next year? YES - file now
- Did you make a large bank deposit, international trip, or pay high electricity bills? YES - mandatory
- All NO? You are probably exempt - but consider filing a nil return anyway just for the record

### FAQs

**Q: I am a student with no income. Should I file?**
A: If you have truly zero income and zero assets, there is nothing to file. But if you have a bank account where even small amounts of interest are credited and tax has been deducted on it, you should file to claim that refund. It takes 20 minutes and the money comes back to your account.

**Q: My employer deducts TDS every month. Do I still need to file?**
A: Yes. Your employer's TDS deduction (via Form 24Q) is not a substitute for your own ITR filing. You still need to file to declare all your income, claim any additional deductions you are eligible for (like HRA, home loan interest, 80C investments), and get back any excess TDS that was deducted.

**Q: I live abroad and earn in a foreign country. Do I need to file an ITR in India?**
A: If you are an NRI and you have any income that originates in India - rental income, capital gains on Indian property or shares, interest on an NRO account - and that income crosses the basic exemption limit, you need to file. Also file if tax was deducted from Indian income and you want a refund.

**Q: What is the difference between ITR-1 and ITR-2?**
A: ITR-1 is the simple form - for salaried individuals with income from salary, one house property, and interest income, with total income below Rs. 50 lakh and no capital gains. ITR-2 is for everyone else - if you have capital gains, more than one property, foreign income, or you are a director in a company. Not sure which applies to you? Check our ITR form guide.

**Q: Can I file after the July 31 deadline?**
A: Yes. A belated return can be filed up to December 31 of the assessment year. You will pay a late fee (Rs. 1,000 to Rs. 5,000) and lose the ability to carry forward any losses. After December 31, filing is generally not possible without special circumstances.

---

## 4. Trademark Registration Guide

**File:** `lib/guides/pages/trademark.ts`

- **Slug:** `do-i-need-trademark-registration`
- **Title:** Do I Need Trademark Registration?
- **SEO Title:** Do I Need to Register a Trademark in India 2025? | Ollvy
- **SEO Description:** Find out if trademark registration makes sense for your brand in India. Understand protection, costs, enforcement, and when to prioritise it in 2025.
- **Category:** Registration
- **CTA Service:** trademark-registration
- **Related Tools:**
  - Document Checklists: trademark

### Interactive Tool

**Title:** Should You Register Your Trademark?
**Type:** eligibility

**Questions:**
1. How central is your brand name or logo to your business?
   - It is the product - customers search for us by name
   - It matters, but we also compete on quality and relationships
   - We are a B2B supplier or white-label; the brand is less important

2. Have you spent money building brand awareness in the last 12 months?
   - Yes - significant spend on ads, packaging, or marketing
   - Some - social media and basic content
   - Not yet - we have not started marketing

3. Is anyone else using a similar name in your industry?
   - Yes, there are similar names out there
   - Not sure - I have not checked
   - Our name is unique - nothing similar exists

4. Are any of these in your plans?
   - Expanding internationally or licensing my brand
   - Raising investor funding
   - None of these - staying India-focused and self-funded

**Default Result:**
- Type: recommended
- Headline: Not urgent right now - but register before you scale
- Body: Your brand exposure is moderate at the moment. The cost of registering is Rs. 4,500 (for individuals and small entities) and the process is much better than it used to be. Do it before you invest heavily in marketing - because after that point, if someone else has registered the same name, you have no legal recourse.

### Sections

**01. WHAT A TRADEMARK ACTUALLY DOES FOR YOU**
A trademark is a legally recognised sign - a name, a logo, a tagline, or a combination of these - that identifies your products or services as yours and not someone else's. Once you register it under the Trade Marks Act, 1999, you have the exclusive right to use that mark commercially in India for 10 years (and you can keep renewing it forever). More importantly, you get the legal power to stop others from using the same or a confusingly similar mark in your category of business.

Note: Source: Trade Marks Act, 1999; Trade Marks Rules, 2017

**02. WHEN YOU REALLY CANNOT AFFORD TO WAIT**
In these situations, trademark registration is not a "nice to have" - it is urgent.
- You are spending on ads, packaging, or social media - every rupee you spend is building value in a brand that is currently unprotected. Someone can swoop in and register it.
- You sell on Amazon or Flipkart - both platforms have brand registry programs that require trademark registration. Without it, your listings are vulnerable to hijackers and copycats.
- You run a SaaS or tech product - your product name is your primary asset. A competitor in the same space can register a similar name if you do not act first.
- You plan to franchise or license - legally, you cannot license a brand you do not own as a registered trademark.
- You are raising investor funding - IP due diligence will catch an unregistered brand. This can delay or complicate your round.
- In India, trademark rights generally go to whoever registers first. Waiting means someone else can register your own name and force you to change it.

Note: Source: Section 28, Trade Marks Act, 1999

**03. WHEN YOU CAN TAKE A BIT MORE TIME**
These situations are lower urgency, but you should still set a timeline.
- You are in the early stages and still validating your product - aim to register within 6 months of committing to a name
- You are a B2B service firm that mostly gets work through referrals - the risk of someone copying your brand name is lower, but register before you hit a scale where rebranding would hurt
- You run a local service business (salon, restaurant, regional brand) - register before you open your second location

**04. WHEN IT IS GENUINELY NOT URGENT**
- You are still figuring out your product and have not settled on a name
- You are a pure white-label supplier with no consumer-facing brand
- You work under your own name serving a small local client base
- You have already done a thorough trademark search and the field is clear

Note: A note: even without a registered trademark, you can claim some protection against copycats under the legal concept of "passing off" (Section 27, Trade Marks Act). But proving passing off means demonstrating prior reputation and goodwill in court - which is expensive, slow, and uncertain. Registration is far simpler.

**05. THE REAL RISKS OF SKIPPING REGISTRATION**
This is what actually happens to businesses that delay.
- Someone else registers your name - even in bad faith - and legally demands you stop using it
- You get a cease-and-desist letter from a registered trademark holder, even if you have been using the name longer than them. Without a registration, your protection is limited to expensive and uncertain litigation.
- Without a registered trademark, you cannot enrol in Amazon Brand Registry - leaving your product listings open to unauthorised sellers and piggybackers
- Competitors can file IP infringement complaints against your marketplace listings if they have a registered mark and you do not
- In M&A or funding due diligence, an unregistered brand is flagged as an IP risk that can affect valuation or deal terms

**06. THE COST IS LOW ENOUGH THAT THE QUESTION IS JUST WHEN**
Trademark registration costs Rs. 4,500 per class if you are an individual or small entity, and Rs. 9,000 for other businesses. That is the government fee - not per year, per 10 years.
- You have decided on a name and have started any marketing at all? Register within the next 30 days.
- You are raising funding or planning an M&A? Register today.
- You are expanding to a second city, a new product, or a new category? Register before that expansion.
- Still testing your product-market fit? Do a free search on the IP India portal now, and register the moment you commit to the name.
- Renewal cost: Rs. 9,000-10,000 every 10 years. That is the cost of protecting your brand.

### FAQs

**Q: How long does trademark registration actually take?**
A: Your application is filed and gets a filing date immediately - and your rights are protected from that date, not the final registration date. From filing to receiving your official registration certificate (assuming no objections), the typical timeline is 18-24 months.

**Q: What is a trademark class and which one do I need?**
A: Goods and services are divided into 45 categories called classes. Class 42 is software and tech services; Class 25 is clothing; Class 35 is retail and marketing. You register per class. Using the wrong class means you are unprotected in the category you actually operate in. Most businesses need 1-3 classes.

**Q: Can I trademark a common word like "Fresh" or "Quick"?**
A: Descriptive or generic words are very difficult to register on their own. But a distinctive combination, a stylised logo, or a word used in an unexpected context (think: Apple for computers) can be protected. A trademark attorney can tell you whether your name is protectable before you build a business around it.

**Q: What do TM, R, and C symbols mean?**
A: TM can be used by anyone who claims rights to a mark - even without registration. R can only be used once your trademark is officially registered - using it before registration is an offence. C applies to creative works like art, music, or writing, not to trademarks.

**Q: Do I need a trademark or a copyright for my logo?**
A: Both can apply. Copyright protects the artistic creation automatically from the moment it is made. Trademark protects the logo as a brand identifier in commerce. For a business, trademark registration is usually more important because it gives you enforceable commercial rights and a practical way to stop copycats.

---

# Tier 2 - Compliance Triggers

---

## 5. PF Registration Guide

**File:** `lib/guides/pages/pf-registration.ts`

- **Slug:** `when-does-pf-registration-become-mandatory`
- **Title:** When Does PF Registration Become Mandatory?
- **SEO Title:** PF Registration: When is it Mandatory in India 2025? | Ollvy
- **SEO Description:** Find out when Provident Fund (EPFO) registration becomes mandatory for your business in India. Covers employee threshold, penalties, and voluntary registration.
- **Category:** Compliance
- **CTA Service:** payroll-management

### Interactive Tool

**Title:** Is PF Registration Mandatory for Your Business?
**Type:** eligibility

**Questions:**
1. How many people does your business currently employ?
   - Fewer than 10
   - 10 to 19 employees
   - 20 or more employees
   - Below 20 now, but growing fast

2. What industry is your business in?
   - Cinema/theatre, beedi/tobacco manufacturing, or jute/cotton textile mill
   - IT, BPO, software services, or tech startup
   - Retail, hospitality, food, healthcare, or other services
   - Other manufacturing, construction, or engineering
   - Not sure

3. What do your employees earn?
   - Everyone earns above Rs. 15,000 basic salary per month
   - A mix - some above, some below Rs. 15,000 basic
   - Everyone earns below Rs. 15,000 basic salary per month

4. Do your clients, staffing contracts, or tenders ask for PF registration?
   - Yes, it has come up
   - No, not so far
   - Not sure yet

**Default Result:**
- Type: not_required
- Headline: Not required at your current size
- Body: With fewer than 20 employees and no industry-specific trigger, PF registration is not mandatory for you right now. The important thing is to keep track of your headcount - the moment you cross 20 employees, you have 30 days to register.

### Sections

**01. THE NUMBER THAT CHANGES EVERYTHING: 20**
Under the Employees Provident Funds and Miscellaneous Provisions Act, 1952, PF registration becomes mandatory the moment your business employs 20 or more people. That is the trigger. It does not matter what industry you are in, what city you are in, or how much your employees earn. Once you cross 20, you have 30 days to register.

Who counts toward that 20? More than you might think.
- All direct employees on your payroll
- Contract workers if you are the one directing their work at your premises
- Casual and temporary staff who work regularly
- Directors who draw a regular salary
- Part-time employees

Note: Source: Section 1(3)(b), Employees Provident Funds and Miscellaneous Provisions Act, 1952

**02. SOME INDUSTRIES HAVE A LOWER THRESHOLD**
If your business is in one of these industries, PF registration kicks in at 10 employees - not 20.
- Cinemas and theatres
- Cigarette, beedi, and tobacco product manufacturing
- Textile mills (jute, cotton, or other fibre manufacturing)
- Any establishment specifically notified by the Central Government under Section 1(4) of the EPF Act

Note: If you are in manufacturing and are not sure which category applies, check Schedule I of the EPF Act or ask a labour law advisor.

**03. WHAT PF ACTUALLY COSTS YOUR BUSINESS**
Once you are registered, both you and your employees contribute to the fund every month.
- Your employee contributes 12% of their basic salary plus dearness allowance (DA)
- You as the employer also contribute 12% - of that, 3.67% goes to the EPF (Provident Fund) and 8.33% goes to EPS (Employee Pension Scheme)
- You also pay 0.5% in administrative charges
- For establishments that voluntarily register with fewer than 20 employees, the contribution rate is 10% instead of 12%
- The mandatory PF contribution only applies to employees earning up to Rs. 15,000 basic salary per month
- Payments must be made by the 15th of the following month

Note: Source: EPF Scheme, 1952; Employee Pension Scheme, 1995

**04. WHEN PF DOES NOT APPLY TO YOU**
A few genuine exemptions.
- Fewer than 20 employees in most industries (or below 10 in the scheduled industries listed above)
- Government establishments where employees are already covered under a separate provident fund scheme
- Employees earning above Rs. 15,000 basic salary can choose to opt out - though this does not exempt the employer from registering if the 20-employee threshold is met
- Establishments that have their own superior provident fund scheme and have received specific exemption under Section 17 of the EPF Act

**05. WHAT HAPPENS IF YOU DO NOT REGISTER WHEN YOU SHOULD**
This is not an area where the consequences are light.
- Penalty for not registering: Up to Rs. 5,000 per day
- Interest on unpaid contributions: 12% per annum
- Damages for delayed payment: Between 5% and 25% of arrears, depending on how long you delayed
- Employees can file complaints directly with the EPFO Regional Commissioner
- Criminal prosecution: Wilful non-compliance can lead to imprisonment up to 1 year and/or a fine under Section 14 of the EPF Act
- Labour audits have become more common in IT parks and industrial estates - being unregistered is an easy catch

Note: Use our penalty calculator for specific amounts: /tools/penalty-calculator/pf-esic-penalty

**06. WHERE YOU STAND AND WHAT TO DO NEXT**
- 20 or more employees right now? Register immediately if you have not already.
- 15 to 19 employees? Start preparing your payroll data now. Register before you make your next hire.
- 10 to 14 employees in a scheduled industry? Register now - you have already crossed the threshold.
- Below 10 employees? You are fine - just check again with every new hire.
- Have any employees earning below Rs. 15,000 basic? Once you register, they must be enrolled.

### FAQs

**Q: We went above 20 employees but are now back below 20. Do we still need to be registered?**
A: Yes. Once an establishment has employed 20 or more people at any point in the previous 12 months, it remains covered under the EPF Act - even if headcount later drops. The Act specifically uses the phrase "any day of the preceding 12 months" as the reference point.

**Q: We use contract workers from a staffing agency. Do they count toward our 20-employee limit?**
A: It depends on the contract structure. If the staffing agency employs and pays them, the agency is the employer for PF purposes and should have their own PF registration. If you are directing their work at your premises and are effectively their employer in practice, EPFO may count them toward your threshold. This is a grey area - get clarity on your specific contract structure before assuming.

**Q: Can an employee earning above Rs. 15,000 opt out of PF?**
A: An employee who has never been an EPFO member and is earning above Rs. 15,000 basic salary can opt out when joining a new employer by submitting Form 11. However, once you are an EPFO member, you cannot opt out - even if your salary later crosses Rs. 15,000. You can choose to contribute only on Rs. 15,000 rather than your full salary.

**Q: What is a UAN and does every employee need one?**
A: UAN is a 12-digit Universal Account Number assigned by EPFO to every PF member. It stays the same across all jobs throughout a person's career. As an employer, you need to generate or link a UAN for every covered employee when they join.

**Q: What about part-time or contractual employees?**
A: Yes, they count toward your 20-employee threshold. And once your establishment is registered, contributions are due for all employees earning up to Rs. 15,000 basic - regardless of whether they are full-time, part-time, or contractual.

---

## 6. ESI Registration Guide

**File:** `lib/guides/pages/esi-registration.ts`

- **Slug:** `when-does-esi-registration-become-mandatory`
- **Title:** When Does ESI Registration Become Mandatory?
- **SEO Title:** ESI Registration: When is it Mandatory in India 2025? | Ollvy
- **SEO Description:** Understand when ESIC registration becomes mandatory for your business in India. Employee threshold, salary limit, covered industries, and non-compliance penalties.
- **Category:** Compliance
- **CTA Service:** payroll-management

### Interactive Tool

**Title:** Is ESI Registration Mandatory for Your Business?
**Type:** eligibility

**Questions:**
1. How many employees do you have right now?
   - Fewer than 10
   - 10 or more
   - Fewer than 10, but growing quickly

2. What kind of business do you run?
   - A factory or manufacturing unit with power
   - A factory without power, or a seasonal operation
   - A shop, office, IT company, hotel, restaurant, or cinema
   - Agriculture, construction, or something else

3. What do your employees earn?
   - Some employees earn below Rs. 21,000 per month
   - Everyone earns above Rs. 21,000 per month

**Default Result:**
- Type: not_required
- Headline: ESI does not appear to be mandatory for you right now
- Body: The main triggers are 10 or more employees in a factory, or 10 or more employees in shops, offices, or services in most states. You can revisit this as your team grows.

### Sections

**01. THE ESI THRESHOLD: 10 EMPLOYEES**
The Employees State Insurance Act, 1948 applies to factories with 10 or more employees and to shops, restaurants, hotels, cinemas, IT companies, and other service establishments with 10 or more employees in states where the Act has been extended. As of 2025, ESI coverage has been extended to all states and union territories in India.

Note: Source: Section 1(5), Employees State Insurance Act, 1948; ESIC Circulars on coverage extension

**02. WHO COUNTS AS A COVERED EMPLOYEE**
ESI covers employees earning up to Rs. 21,000 per month (Rs. 25,000 for persons with disabilities). Once your establishment is covered, all eligible employees must be enrolled.
- Employees earning up to Rs. 21,000 per month in total wages
- Persons with disabilities employed at up to Rs. 25,000 per month
- Casual and temporary staff
- Contract workers if you are deploying them at your premises as the principal employer
- Directors who are on your payroll
- Family members working in the business and drawing salary

Note: Employees earning above Rs. 21,000 do not need ESI contributions - but they still count toward your 10-employee threshold for determining whether the establishment is covered.

**03. WHAT ESI CONTRIBUTIONS LOOK LIKE**
Once registered, contributions are calculated as a percentage of each covered employee's gross wages.
- Employer contribution: 3.25% of gross wages
- Employee contribution: 0.75% of gross wages
- Total: 4% of gross wages for each covered employee
- Employees earning below approximately Rs. 176 per day are exempt from their own contribution, but the employer still pays 3.25%
- Contributions are due by the 15th of the following month
- Half-yearly returns must be filed twice a year

Note: Source: ESI (Central) Rules, 1950; ESIC Contribution Rates Notification

**04. WHAT ESI ACTUALLY GIVES YOUR EMPLOYEES**
ESI is a proper social insurance scheme, not just a compliance checkbox. Covered employees and their families get real benefits.
- Medical care: Full treatment for the employee and their family through ESIC dispensaries and hospitals
- Sickness benefit: 70% of wages for up to 91 days during certified illness
- Maternity benefit: Full wages for 26 weeks of maternity leave
- Disability benefit: 90% of wages if permanently or temporarily disabled due to a work injury
- Dependants benefit: 90% of wages paid to family members if the employee dies due to a work injury
- Funeral expenses: Rs. 15,000 lump sum

**05. WHAT HAPPENS IF YOU DO NOT COMPLY**
- Not registering when required: Penalty up to Rs. 10,000 and prosecution under Section 85 of the ESI Act
- Late payment of contributions: 12% per annum interest on unpaid amounts
- Damages for delay: 5% to 25% of arrears depending on how long the delay continues
- ESIC can directly attach bank accounts and property to recover arrears
- Wilful evasion: Imprisonment up to 2 years under Section 85

**06. QUICK SUMMARY OF WHERE YOU STAND**
- 10 or more employees in a covered establishment type? Check if your state's notification covers your industry - if yes, register.
- Any employees earning below Rs. 21,000? They must be enrolled once you are registered.
- All employees above Rs. 21,000? No contributions due, though registration may still technically apply.
- Crossing 10 employees? Register within 15 days of that happening.

### FAQs

**Q: We already have PF registration. Is ESI the same thing?**
A: No - they are completely separate. PF is managed by EPFO under the Employees Provident Funds Act, 1952. ESI is managed by ESIC under the Employees State Insurance Act, 1948. Different laws, different thresholds, different contributions, different registrations. You can be subject to both, one, or neither, depending on your setup.

**Q: Does ESI apply in my state?**
A: Yes - ESI has been extended to all states and union territories. Coverage of specific establishment types (shops, IT companies, hotels) was progressively extended across states and is now essentially nationwide as of 2025.

**Q: Can my employees opt out of ESI if they have private health insurance?**
A: No. Unlike PF, there is no individual opt-out from ESI. If your establishment is covered and an employee falls below the wage ceiling, both their contribution and yours are mandatory. The only exception is if the employer obtains a specific exemption under Section 87 of the ESI Act by demonstrating they provide superior medical benefits - this is a formal government approval process, not a simple opt-out.

**Q: We just crossed 10 employees. How long do we have to register?**
A: You have 15 days from the date you cross the threshold to apply for ESI registration.

---

## 7. Professional Tax Guide

**File:** `lib/guides/pages/professional-tax.ts`

- **Slug:** `do-i-need-professional-tax-registration`
- **Title:** Do I Need Professional Tax Registration?
- **SEO Title:** Professional Tax Registration in India 2025: Do You Need It? | Ollvy
- **SEO Description:** Find out if Professional Tax applies to your business or profession in India. State-wise thresholds, who must register, and employer vs self-employed obligations.
- **Category:** Tax
- **CTA Service:** payroll-management
- **Related Tools:**
  - Penalty Calculators: itr-late-filing
  - Document Checklists: business-itr, individual-itr

### Interactive Tool

**Title:** Does Professional Tax Apply to You?
**Type:** eligibility

**Questions:**
1. Which state is your business based in?
   - Maharashtra, Karnataka, West Bengal, Tamil Nadu, Andhra Pradesh, Telangana, Madhya Pradesh, Odisha, or Kerala
   - Delhi, Uttar Pradesh, Rajasthan, Haryana, Himachal Pradesh, or Punjab
   - Assam, Meghalaya, Manipur, or Tripura
   - Another state or not sure

2. What is your role in this business?
   - I am an employer with salaried staff
   - I am self-employed, a freelancer, or a professional (doctor, CA, lawyer, consultant)
   - Both - I own the business and also draw a salary from it

3. What is the monthly income or salary we are talking about?
   - Below Rs. 7,500 per month
   - Above Rs. 7,500 per month

**Default Result:**
- Type: not_required
- Headline: Professional Tax likely does not apply to you
- Body: Professional Tax is a state-level tax that only exists in specific states. If you are operating in Delhi, UP, Haryana, Rajasthan, Punjab, or Himachal Pradesh, you have no Professional Tax obligation at all.

### Sections

**01. FIRST, THE IMPORTANT THING TO KNOW**
Professional Tax is a state-level tax - it is not collected by the central government. About half the states in India levy it; the other half do not. If your business is in Delhi, Uttar Pradesh, Haryana, Rajasthan, Punjab, or Himachal Pradesh, you have zero Professional Tax obligations. Stop here.

For everyone else, it is governed by the relevant state's Professional Tax Act, under the authority granted by Article 276 of the Constitution. The maximum any state can charge is Rs. 2,500 per year per person.

Note: Source: Article 276, Constitution of India; State Professional Tax Acts

**02. STATES WHERE PROFESSIONAL TAX APPLIES**
Here is where it applies and roughly how much.
- Maharashtra: Up to Rs. 2,500 per year
- Karnataka: Up to Rs. 2,496 per year
- West Bengal: Up to Rs. 2,500 per year
- Tamil Nadu: Up to Rs. 2,400 per year
- Andhra Pradesh and Telangana: Up to Rs. 2,500 per year
- Madhya Pradesh: Up to Rs. 2,100 per year
- Odisha: Up to Rs. 2,500 per year
- Kerala: Up to Rs. 2,400 per year
- Gujarat: Up to Rs. 2,500 per year
- Assam, Meghalaya, Manipur, Tripura, Jharkhand, Sikkim: PT applies with varying slabs

Note: Exact slabs within each state vary by income bracket. Check your state's PT schedule for the current year.

**03. IF YOU HAVE EMPLOYEES: YOU NEED TWO REGISTRATIONS**
If you are a business owner in a PT state with salaried staff, you typically need two separate registrations - not one.
- PTEC (Professional Tax Enrollment Certificate): This is for you - the business owner, proprietor, partner, or director. You pay PT on yourself.
- PTRC (Professional Tax Registration Certificate): This is what lets you deduct PT from your employees' salaries and deposit it with the state government. Without this, you are not authorised to make those deductions or remittances.
- Filing frequency (monthly, quarterly, or annual) and due dates vary by state - check the rules for your specific state.

**04. WHO DOES NOT HAVE TO PAY**
- Individuals earning below the state minimum (typically Rs. 7,500 to Rs. 10,000 per month, depending on the state)
- Women earning below Rs. 10,000 per month in Maharashtra
- Parents or guardians of children with physical or mental disabilities in some states
- Members of the armed forces
- Persons above 65 years of age in certain states
- Everyone in states where PT is simply not levied (Delhi, UP, Haryana, Rajasthan, Punjab, HP)

**05. WHAT NON-COMPLIANCE LOOKS LIKE**
- Late registration penalty: Typically Rs. 5 per day in most states
- Interest on late payment: 1.25% per month in Maharashtra; similar rates in other states
- Penalty for not deducting or not remitting: Up to 10% of unpaid amount plus arrears
- Assessment and prosecution by the state PT authority

**06. THE SHORT ANSWER BASED ON YOUR SITUATION**
- In a PT state + have salaried employees = Get both PTRC and PTEC
- In a PT state + self-employed or proprietor = Get PTEC
- In Delhi, UP, Haryana, Rajasthan, Punjab, or HP = Not applicable, move on
- Operating in multiple states = Register separately in each state where you have employees or a business presence

### FAQs

**Q: Is the Professional Tax I pay deductible anywhere?**
A: Yes. Professional Tax paid on salary income is deductible under Section 16(iii) of the Income Tax Act. For self-employed individuals, it is deductible as a business expense. It partially offsets the cost.

**Q: I work remotely for a Bangalore company but live in Delhi. Does PT apply to me?**
A: Professional Tax typically follows the employer's registered place of business, not your home address. If your employer is in Karnataka, Karnataka's PT rules apply - which means they should be deducting PT from your salary regardless of where you live.

**Q: Does PT apply to a Pvt Ltd company?**
A: Yes. The company must get PTEC and pay PT for each director who draws a salary. It must also get PTRC and deduct PT from all salaried employees. These are two separate obligations and both apply.

---

## 8. Shop and Establishment Guide

**File:** `lib/guides/pages/shop-establishment.ts`

- **Slug:** `do-i-need-shop-establishment-registration`
- **Title:** Do I Need Shop and Establishment Registration?
- **SEO Title:** Shop & Establishment Registration in India 2025 | Ollvy
- **SEO Description:** Find out if your business needs Shop and Establishment registration in India. Covers shops, offices, restaurants, and home-based businesses - state-wise rules 2025.
- **Category:** Registration
- **CTA Service:** gst-registration

### Interactive Tool

**Title:** Do You Need Shop & Establishment Registration?
**Type:** eligibility

**Questions:**
1. Where does your business actually operate from?
   - A commercial office, shop, or retail outlet
   - My home - I work from home
   - A factory or manufacturing unit
   - No fixed premises - I am field-based or entirely online

2. Do you have employees?
   - Yes, one or more employees work with me
   - No, I am the only person

3. Do you need to open a business bank account or apply for a licence soon?
   - Yes - setting up a current account or applying for licences
   - No, I already have what I need

**Default Result:**
- Type: recommended
- Headline: You probably need it - register to be safe
- Body: Shop and Establishment registration is one of the most foundational compliance steps for any commercial business. Most state Acts require it within 30 days of starting. The certificate also serves as your proof of business address for banks, FSSAI, GST, and other government offices.

### Sections

**01. WHAT SHOP & ESTABLISHMENT REGISTRATION ACTUALLY IS**
Shop and Establishment (S&E) registration is a state-level compliance under each state's own Shops and Establishments Act. The Act regulates working hours, leaves, holidays, and employment conditions in non-factory workplaces. Registration is essentially your licence to run a commercial operation.

Every state has its own version of the law with its own rules and timelines. But the core requirement is the same across most states: if you run a commercial establishment, you register.

Note: Source: State-specific Shops and Establishments Acts

**02. WHO NEEDS TO REGISTER**
The definition of "establishment" is broad. Here is who it covers:
- Retail shops, trading businesses, and commercial offices
- Restaurants, cafes, and food establishments
- Hotels, boarding houses, and lodges
- Theatres, cinemas, and entertainment venues
- Warehouses
- IT companies, call centres, and BPOs - these are specifically called out in many state Acts
- Educational institutions, coaching centres, and tutorials
- Home-based businesses where employees come to work (state-specific)

Note: Factories under the Factories Act 1948 are excluded - they have a separate compliance regime. Government establishments are also typically excluded.

**03. WHY IT MATTERS BEYOND JUST COMPLIANCE**
The S&E certificate does a lot of practical work for your business.
- Opening a bank current account: Banks almost always ask for this as proof of business address for sole proprietorships and partnership firms
- GST registration: Accepted as proof of your principal place of business
- FSSAI food licence: Required in most states as a supporting document
- Other state licences: Liquor licence, trade licence, fire NOC - many of these ask for your S&E certificate
- Labour inspections: The certificate must be displayed visibly in your workplace

**04. WHEN YOU MIGHT NOT NEED IT**
- Factories governed by the Factories Act have a separate, more detailed compliance regime
- Purely home-based freelancers with no employees and no commercial activities in states with a narrow S&E definition
- Agricultural businesses
- Government and public sector offices

**05. WHAT HAPPENS WITHOUT REGISTRATION**
- Fine: Rs. 1,000 to Rs. 10,000 depending on the state and how long you have been operating without it
- Repeated violations can lead to prosecution under the state Act
- Practically: You cannot easily open a bank current account, and many licence applications will stall without it
- If you have employees and are found unregistered during a labour inspection, the penalties are compounded

**06. THE STRAIGHTFORWARD DECISION TREE**
- Commercial premises + any employees = Register within 30 days of starting business
- Commercial premises + no employees = Register anyway - most states require it regardless of staff count
- Home address + employees = Register in most states
- Home address + no employees + no commercial activity from home = Check your specific state; you may be exempt
- Factory = Factories Act governs you, not S&E - get a separate compliance review

### FAQs

**Q: How long is the certificate valid? Do I need to renew it?**
A: It depends on your state. Maharashtra made its certificate permanent (lifetime) after a 2017 amendment, so no renewal needed there. Delhi and Karnataka require annual renewal. Most other states require annual or once every three years.

**Q: Can I use the S&E certificate as my business address proof?**
A: Yes - it is a widely accepted proof of business address. Banks, the GST portal, and most licencing authorities accept it.

**Q: I run an online business from home with no physical store. Do I still need this?**
A: If you have employees working with you from that location, almost certainly yes. If you are a solo operator with no employees, it depends on your state. Either way, having the certificate makes your life easier when you need to open bank accounts or apply for other licences.

**Q: Is there a minimum number of employees before registration is required?**
A: No. Most state Acts require registration of any establishment regardless of headcount - even a single-person proprietorship running from a commercial space needs to register.

---

# Tier 3 - Strategic Decisions

---

## 9. MSME / Udyam Registration Guide

**File:** `lib/guides/pages/msme-udyam.ts`

- **Slug:** `is-msme-registration-worth-it`
- **Title:** Is MSME / Udyam Registration Worth It?
- **SEO Title:** Is MSME / Udyam Registration Worth It in 2025? | Ollvy
- **SEO Description:** Find out if Udyam (MSME) registration makes sense for your business. Covers benefits, eligibility, credit access, government tenders, and what you actually get.
- **Category:** Registration
- **CTA Service:** gst-registration

### Interactive Tool

**Title:** Should You Register as an MSME?
**Type:** eligibility

**Questions:**
1. What is your business' annual turnover?
   - Below Rs. 5 crore
   - Rs. 5 crore to Rs. 250 crore
   - Above Rs. 250 crore

2. What is the main reason you are looking at Udyam registration?
   - Getting a business loan or better credit terms
   - Participating in government tenders or GeM
   - Accessing subsidies or government schemes
   - Not sure - I just want to understand if it helps me

3. Do you supply to large companies, listed firms, or government entities?
   - Yes, we sell to corporates, PSUs, or the government
   - No, mostly small businesses or end consumers

**Default Result:**
- Type: recommended
- Headline: Yes - register. It is free and the benefits are real.
- Body: Udyam registration is free, instant, and done entirely online with just your PAN and Aadhaar. There is no cost and practically no downside. What you get in return: better access to credit, exclusive government tender categories, and legal protection if large buyers delay payment. There is almost no reason not to do this.

### Sections

**01. WHAT UDYAM REGISTRATION ACTUALLY IS**
Udyam Registration is the government's official recognition of your business as a Micro, Small, or Medium Enterprise under the MSME Development Act, 2006. It replaced the older Udyog Aadhar system from July 1, 2020. You register on the Udyam portal, it is linked to your PAN and Aadhaar, and it is completely free. No inspection, no verification, no paperwork sent anywhere.

Note: Source: MSMED Act 2006; DPIIT Notification, June 26, 2020

**02. DO YOU QUALIFY?**
Classification is based on two things: investment in equipment or plant and machinery, and annual turnover. Both criteria must be met.
- Micro Enterprise: Investment below Rs. 1 crore AND turnover below Rs. 5 crore
- Small Enterprise: Investment below Rs. 10 crore AND turnover below Rs. 50 crore
- Medium Enterprise: Investment below Rs. 50 crore AND turnover below Rs. 250 crore
- If either number exceeds the limit, you move into the next category
- For service businesses, office equipment, computers, and software count as "equipment"

Note: Source: Ministry of MSME Notification S.O. 2119(E), June 26, 2020

**03. THE BENEFITS THAT ACTUALLY MATTER**
Not everything government schemes promise is real. These ones are.
- Loans without collateral: Through CGTMSE (the Credit Guarantee Fund Trust for Micro and Small Enterprises), you can get loans up to Rs. 2 crore without putting up any collateral or a third-party guarantee. For most small business owners, this is transformative.
- Priority sector lending: Banks have MSME-specific quotas and targets. Your loan application genuinely moves faster through the system.
- Government tender preference: The Government e-Marketplace has MSME-exclusive product and service categories. Government departments are mandated to buy a certain percentage of their procurement from MSMEs.
- Payment protection: If a company above Rs. 250 crore turnover has not paid you within 45 days, compound interest at 3x the RBI bank rate accrues automatically. You can file online through MSME Samadhaan and a Facilitation Council must resolve it within 90 days. This only works if you are registered.
- ISO certification reimbursement: Government reimburses the cost of ISO certification for registered MSMEs.
- Technology upgrade subsidies: Credit Linked Capital Subsidy Scheme (CLSS) provides upfront capital subsidy for technology upgrades.

Note: CGTMSE is managed jointly by SIDBI and the Ministry of MSME.

**04. WHAT IT DOES NOT DO**
Let us clear up some common misconceptions.
- It is not mandatory - it is a voluntary registration
- It does not automatically give you a loan - it makes you eligible for specific schemes; banks still assess your creditworthiness
- It is not the same as DPIIT Startup Recognition - those are different, with different benefits
- It does not replace GST, PF, ESI, or any other compliance - those are separate
- There is no direct income tax exemption just for being an MSME - any tax benefits require separate qualification

**05. THE PAYMENT PROTECTION ANGLE IS UNDERUSED**
If you supply to large companies and have experienced delayed payments, this might be the single most valuable reason to register.
- Under Section 15 of the MSMED Act, buyers must pay MSME suppliers within 45 days of accepting goods or services. If there is no written agreement, the limit is 15 days.
- Delay beyond 45 days = compound interest at 3x RBI bank rate, automatically, without needing a court order
- Large companies (above Rs. 250 crore turnover) now have to disclose MSME payment dues in their MCA filings (MSME Form 1). This creates real corporate governance pressure.
- You can file online through the MSME Samadhaan portal - a formal, quick-resolution mechanism.
- None of this is available to you if you are not registered.

Note: Source: Sections 15-23, Micro, Small and Medium Enterprises Development Act, 2006

**06. THE SIMPLEST CASE FOR REGISTERING**
- Cost: Zero
- Time: 10-15 minutes on udyamregistration.gov.in with your Aadhaar and PAN
- Downside: None in practice - you just need to update if you cross a classification threshold
- Upside: Better credit terms, tender access, payment protection, scheme eligibility
- Verdict: Almost any business below Rs. 250 crore turnover should do this today

### FAQs

**Q: Can a Pvt Ltd company register as an MSME?**
A: Yes. Any business structure - sole proprietorship, partnership, LLP, or Private Limited company - can register under Udyam as long as it meets the investment and turnover criteria.

**Q: I have an old Udyog Aadhar registration. Is that still valid?**
A: No. Udyog Aadhar registrations expired on December 31, 2021. You need to re-register on the new Udyam Registration portal at udyamregistration.gov.in. Old certificates are no longer accepted for scheme benefits.

**Q: Does MSME registration help with my income tax?**
A: Not directly - there is no general income tax exemption for being an MSME. However, registered MSMEs may qualify for specific deductions and state-level concessions. Speak to a CA for what applies to your situation.

**Q: What happens if my turnover grows past the MSME limit?**
A: Your Udyam registration is automatically upgraded to the appropriate category as your business grows. The portal syncs with your income tax return data annually. If you cross the medium enterprise limit altogether, the registration lapses.

---

## 10. DPIIT Startup Recognition Guide

**File:** `lib/guides/pages/dpiit-startup.ts`

- **Slug:** `should-i-get-dpiit-startup-recognition`
- **Title:** Should I Get DPIIT Startup Recognition?
- **SEO Title:** DPIIT Startup India Recognition 2025: Is It Worth It? | Ollvy
- **SEO Description:** Decide if DPIIT Startup Recognition is right for your company. Covers eligibility, 3-year tax holiday, angel tax exemption, labour law exemptions, and how to apply.
- **Category:** Registration
- **CTA Service:** pvt-ltd-incorporation
- **Related Tools:**
  - Penalty Calculators: mca-annual-filing
  - Document Checklists: private-limited-company

### Interactive Tool

**Title:** Does DPIIT Startup Recognition Make Sense for You?
**Type:** eligibility

**Questions:**
1. What type of entity is your business?
   - Private Limited Company
   - LLP
   - Partnership firm or sole proprietorship
   - Not yet incorporated

2. How long has the business been incorporated?
   - Less than 10 years
   - More than 10 years

3. What is your annual turnover?
   - Below Rs. 100 crore
   - Above Rs. 100 crore

4. What does your business do?
   - Technology-driven or innovation-driven product or service with scale potential
   - Traditional business - trading, restaurant, salon, real estate
   - Planning to raise equity funding from investors

**Default Result:**
- Type: recommended
- Headline: Yes - apply if you meet the criteria
- Body: DPIIT Startup Recognition is free to apply for and takes 2-7 working days. The most important benefit for most early-stage companies is angel tax protection - investments above fair market value are not treated as taxable income. If you are raising money from angels, this matters significantly.

### Sections

**01. WHAT THIS RECOGNITION ACTUALLY IS**
DPIIT Startup Recognition is a certificate issued by the Department for Promotion of Industry and Internal Trade under the Startup India initiative. It is not the same as MSME/Udyam registration - these are two completely separate things with different benefits. You apply on the Startup India portal (startupindia.gov.in), it is reviewed and approved within 2-7 working days, and the process involves no physical inspection or audit.

Note: Source: DPIIT Notification No. G.S.R. 127(E) dated February 19, 2019

**02. DO YOU QUALIFY?**
All of these must be true at the same time:
- Entity type: Private Limited Company, LLP, or Registered Partnership Firm
- Age: Less than 10 years from the date of incorporation
- Turnover: Below Rs. 100 crore in every financial year since you started
- Nature of work: You are working towards innovation, development, deployment, or commercialisation of new products, processes, or services - driven by technology or intellectual property
- Not formed by splitting up or reconstructing an existing business
- Your business is headquartered in India

Note: Source: Startup India Definition, DPIIT Notification 2019

**03. THE BENEFITS - AND WHICH ONES ARE ACTUALLY SIGNIFICANT**
Let us be honest about which benefits genuinely move the needle.
- Angel tax exemption (Section 56(2)(viib)): This is the big one. For DPIIT-recognised startups, money received from angel investors above Fair Market Value is not taxed as income from other sources. This was a huge blocker for early-stage funding rounds and removing it matters.
- 3-year income tax holiday (Section 80-IAC): 100% profit deduction for any 3 consecutive years within your first 10 years. Important note: this requires a separate certification from the Inter-Ministerial Board (IMB) - it is not automatic with DPIIT recognition alone.
- Patent filing: 80% rebate on government patent filing fees, plus fast-tracked examination through a dedicated startup IP cell
- Labour law self-certification: For 5 years, you can self-certify compliance under 3 central labour laws instead of being subject to inspections
- Fund of Funds access: Eligible for investment from SIDBI's Fund of Funds via registered AIFs (Alternative Investment Funds)

Note: Source: Section 80-IAC, Income Tax Act; Section 56(2)(viib) proviso

**04. WHEN IT IS NOT WORTH PURSUING**
- Traditional businesses (restaurants, salons, real estate, trading) without a technology angle - approval is unlikely, and even if you get it, the tax holiday requires a further level of certification
- Businesses older than 10 years or above Rs. 100 crore in revenue - you are simply ineligible
- Sole proprietorships and HUFs - not eligible by entity type
- Businesses that have no plans to raise equity funding and are already well past startup stage

**05. THE ANGEL TAX PROTECTION IS THE ONE TO UNDERSTAND**
If you are raising money from angel investors, this protection matters more than almost any other benefit.
- Section 56(2)(viib) of the Income Tax Act used to treat investments received above Fair Market Value as taxable income for the company - at 30%+. This was called "angel tax" and it was a genuine problem for early-stage startups.
- For DPIIT-recognised startups, this provision does not apply. Any investment from eligible investors is not taxed as income.
- This removes a major legal risk from your funding round. Without recognition, a large investment at a high valuation could generate a surprise tax bill.
- Important: This protection applies to investments from resident Indian individuals and eligible AIFs. Foreign investments still require FEMA compliance.

Note: Source: Section 56(2)(viib) proviso; CBDT Circular on startup angel tax exemption

**06. THE DECISION IS SIMPLE IF YOU QUALIFY**
- Pvt Ltd or LLP + under 10 years + under Rs. 100 crore + technology/innovation angle = Apply now. It is free, takes 2-7 days.
- Raising from angels soon = Apply before you close the round. The angel tax protection is only active once you are recognised.
- Want cheaper patents = Apply now.
- Traditional business or above the limits = Skip this; look at Udyam registration instead.

### FAQs

**Q: What is the difference between DPIIT recognition and the 3-year tax holiday?**
A: DPIIT recognition from the Startup India portal is the first step - and it gets you most benefits including angel tax protection. The 3-year income tax holiday under Section 80-IAC is a separate, additional step that requires a certificate from the Inter-Ministerial Board of Certification (IMBC). The Board is more selective - they look for validated innovation. Getting DPIIT recognition does not automatically give you the tax holiday.

**Q: Does DPIIT recognition involve any government inspection?**
A: No. You self-declare on the Startup India portal, upload your incorporation certificate, and describe your product or innovation with supporting evidence (like a website or pitch deck). No physical inspection or audit is triggered.

**Q: Can I have both DPIIT recognition and Udyam registration at the same time?**
A: Yes, and if you qualify for both, you should have both. They serve completely different purposes. DPIIT gives you income tax protection and fundraising benefits. Udyam gives you credit access, tender eligibility, and payment protection from large buyers. Apply for both.

**Q: Does DPIIT recognition need to be renewed?**
A: No. Recognition stays valid until you cross the 10-year age limit or the Rs. 100 crore turnover threshold. There is no renewal. If you no longer qualify, you are expected to inform DPIIT.

---

## 11. FSSAI Licence Guide

**File:** `lib/guides/pages/fssai-license.ts`

- **Slug:** `do-i-need-fssai-license`
- **Title:** Do I Need an FSSAI Licence?
- **SEO Title:** Do I Need an FSSAI Licence in India 2025? | Ollvy
- **SEO Description:** Find out if FSSAI registration or licence is mandatory for your food business in India. Covers restaurants, cloud kitchens, home cooks, manufacturers, and importers.
- **Category:** Licensing
- **CTA Service:** fssai-license

### Interactive Tool

**Title:** What FSSAI Licence Does Your Food Business Need?
**Type:** eligibility

**Questions:**
1. What does your food business do?
   - Restaurant, cafe, dhaba, canteen, or cloud kitchen
   - Manufacturing, processing, or packaging food products
   - Trading, retailing, or distributing food (offline or online)
   - Importing or exporting food

2. What is your annual turnover from food activities?
   - Below Rs. 12 lakh per year
   - Rs. 12 lakh to Rs. 20 crore per year
   - Above Rs. 20 crore per year

**Default Result:**
- Type: mandatory
- Headline: Yes - any food business needs FSSAI
- Body: Under the Food Safety and Standards Act, 2006, anyone involved in the manufacture, processing, distribution, sale, or import of food must be registered or licensed. This applies to every food business - from a home baker selling on Instagram to a national food chain.

### Sections

**01. THREE TIERS, AND WHICH ONE IS YOURS**
The Food Safety and Standards Act, 2006 does not apply a one-size-fits-all approach. There are three tiers depending on the scale of your food operation. The right tier matters - using the wrong one is treated as non-compliance.
- Basic Registration (Form A): For small food businesses - home-based food sellers, petty manufacturers, small canteens, and temporary stall holders - with annual turnover below Rs. 12 lakh. This is the simplest and cheapest option. Issued by the local Food Safety Officer.
- State FSSAI Licence (Form B - State): For food businesses with turnover between Rs. 12 lakh and Rs. 20 crore. Covers restaurants, hotels, distributors, transporters, and manufacturers operating within one state. Issued by the State Food Safety Authority.
- Central FSSAI Licence (Form B - Central): For businesses above Rs. 20 crore turnover, importers, exporters, central government canteens, and businesses operating across multiple states. Issued by the FSSAI central office in New Delhi.

Note: Source: Food Safety and Standards (Licensing and Registration of Food Businesses) Regulations, 2011

**02. IF YOU DEAL WITH FOOD IN ANY COMMERCIAL WAY, THIS APPLIES TO YOU**
"Food business" is defined broadly enough to cover almost every commercial food activity imaginable.
- Restaurants, dhabas, cafes, food courts, canteens
- Cloud kitchens and delivery-only operations
- Home-based food businesses selling through Swiggy, Zomato, social media, or WhatsApp groups
- Bakers, confectioners, and snack makers
- Packaged water and beverage producers
- Meat, fish, and poultry processors
- Oil mills and flour mills
- Retailers, supermarkets, and kirana stores selling packaged food
- Food importers and exporters

**03. A FEW THINGS PEOPLE MISS**
Some business situations that people commonly overlook.
- Home-based food sellers: If you are selling home-cooked food via Instagram, a WhatsApp group, or a food delivery app, you need at minimum a Basic FSSAI Registration. "I sell from home" is not an exemption.
- Cloud kitchens: Even with no dine-in customers, if you are preparing food for delivery, you need a State Licence.
- E-commerce food sellers: Selling packaged food on Amazon or Flipkart requires your FSSAI number to be printed on the packaging and displayed on the platform.
- Multi-state operations: If you run restaurants in more than one state, you need a Central Licence, not separate state licences.

**04. WHO DOES NOT NEED AN FSSAI**
The exemptions are narrow.
- Farmers selling their own unprocessed produce directly at the farm gate - fully exempt
- Pure logistics companies that transport food but do not own, process, or sell it - partially exempt
- Religious or community events distributing free food below state-specific quantity thresholds

Note: If you are charging money for food in any form, assume you need FSSAI. The exemptions are genuinely narrow.

**05. WHAT HAPPENS IF YOU OPERATE WITHOUT FSSAI**
- Penalty for operating without registration or licence: Up to Rs. 5 lakh (Section 63, Food Safety and Standards Act)
- Unsafe or adulterated food: Up to life imprisonment and Rs. 10 lakh fine in severe cases
- Stock seizure: Food safety officers can seize your entire stock without a court order
- Platform removal: Swiggy and Zomato require a valid FSSAI number at onboarding and remove accounts that do not maintain it
- Amazon and Flipkart listings: Products without a valid FSSAI number on packaging are liable to be de-listed

**06. QUICK REFERENCE**
- Any food business at any scale = some form of FSSAI is required
- Turnover below Rs. 12 lakh = Basic Registration (Form A) - simplest and cheapest
- Turnover Rs. 12 lakh to Rs. 20 crore, single state = State FSSAI Licence (Form B)
- Turnover above Rs. 20 crore, multi-state, or importer/exporter = Central FSSAI Licence
- On Swiggy, Zomato, or Amazon = FSSAI number required by the platform

### FAQs

**Q: I sell home-made pickles and chutneys. Do I really need FSSAI?**
A: Yes. If you are receiving payment for food, you are a food business operator in the eyes of the law. Basic Registration (the simplest tier, issued by your local food safety officer) is what you need. It is straightforward and low-cost.

**Q: How long does FSSAI registration or licensing take?**
A: Basic Registration: 7 working days. State Licence: 30 days. Central Licence: 60 days. In most cases, you can display the application acknowledgement number and begin operations while you wait for the actual licence.

**Q: Does my FSSAI licence need to be renewed?**
A: Yes. Registrations and licences are valid for 1 to 5 years depending on what you chose when you applied. You must renew before it expires. Operating with an expired FSSAI is treated the same as operating without one.

**Q: My restaurant is on Swiggy and Zomato. Do they check FSSAI?**
A: Yes. Both platforms require you to upload your FSSAI licence at the time of onboarding and your FSSAI number is displayed on your restaurant profile for customers to see. They periodically verify it against the FSSAI database and can suspend your account if it is expired or invalid.

---

## 12. ITR Form Selection Guide

**File:** `lib/guides/pages/itr-form-selection.ts`

- **Slug:** `which-itr-form-should-i-use`
- **Title:** Which ITR Form Should I Use?
- **SEO Title:** Which ITR Form to Use in 2025? ITR-1 to ITR-7 Guide | Ollvy
- **SEO Description:** Find out which Income Tax Return form applies to you in India for FY 2024-25. ITR-1, ITR-2, ITR-3, ITR-4, ITR-5, ITR-6, ITR-7 - clear eligibility explained.
- **Category:** Tax
- **CTA Service:** business-itr
- **Related Tools:**
  - Penalty Calculators: itr-late-filing
  - Document Checklists: business-itr, individual-itr

### Interactive Tool

**Title:** Find Your ITR Form
**Type:** comparison

**Questions:**
1. What type of entity are you filing for?
   - An individual or HUF
   - A partnership firm or LLP
   - A Private Limited or Public Limited company
   - A trust, society, NGO, AOP, or BOI

2. Where does your income come from?
   - Salary or pension - that is mostly it
   - Salary plus capital gains from shares, mutual funds, or property
   - Business income or professional fees (freelancer, doctor, consultant, trader)
   - A small business where I want to declare income as a flat percentage (Section 44AD/44ADA)

3. Does any of this apply to you?
   - I am a director in any company, or I hold unlisted shares
   - I have foreign assets, a foreign bank account, or income from outside India
   - My total income from all sources is above Rs. 50 lakh
   - None of these - just salary, one property, and some interest income

**Default Result:**
- Type: optional
- Headline: When in doubt, use ITR-2
- Body: If you are unsure whether to use ITR-1 or ITR-2, go with ITR-2. It covers everything ITR-1 covers, plus more. There is no penalty for filing a more comprehensive form than strictly required. But if you file ITR-1 when you should have used ITR-2, the return is treated as defective.

### Sections

**01. THE FULL PICTURE: ALL 7 ITR FORMS**
India has 7 ITR forms and each one is designed for a specific type of taxpayer. Filing the wrong one is treated as a defective return - you will get a notice asking you to re-file in the correct form within 15 days.
- ITR-1 (Sahaj): For resident individuals with total income below Rs. 50 lakh, earned from salary, one house property, and other sources like interest. No capital gains. No directorship. No foreign assets.
- ITR-2: For individuals with capital gains, more than one house property, foreign income, total income above Rs. 50 lakh, directorship in a company, or holding of unlisted shares.
- ITR-3: For individuals or HUFs with income from business or profession - non-presumptive (you maintain actual books of accounts).
- ITR-4 (Sugam): For individuals, HUFs, and firms (not LLPs) using presumptive taxation under Sections 44AD, 44ADA, or 44AE.
- ITR-5: For partnership firms, LLPs, AOPs (Association of Persons), and BOIs (Body of Individuals).
- ITR-6: For all companies (except those claiming exemption under Section 11).
- ITR-7: For trusts, political parties, universities, and scientific research institutions filing under Sections 139(4A), 139(4B), 139(4C), or 139(4D).

Note: Source: CBDT ITR Notification for AY 2025-26

**02. ITR-1 VS ITR-2: THE CONFUSION MOST PEOPLE FACE**
Most salaried people file ITR-1 and that is usually right. But ITR-1 cannot be used in a few specific situations - and these are more common than people realise.
- You are a director in any company - even a small startup where you earn nothing yet
- You hold unlisted equity shares at any point during the year
- You have any capital gains - from selling shares, mutual funds, property, or any other asset
- You have income from more than one house property
- Your total income from all sources exceeds Rs. 50 lakh
- You have a foreign bank account, foreign investments, or any income from outside India
- You are a non-resident or not ordinarily resident
- Your agricultural income exceeds Rs. 5,000

Note: If you filed ITR-1 last year but any of these apply this year, you need ITR-2 this time.

**03. ITR-3 VS ITR-4: FOR BUSINESS AND PROFESSIONAL INCOME**
If you have business or professional income, your choice comes down to one question: are you using the presumptive taxation scheme?
- ITR-4 (Sugam) is for you if you want to keep things simple and declare income as a flat percentage - 8% of turnover for business (or 6% for digital receipts), or 50% of gross receipts for professionals. You cannot use this if your business turnover exceeds Rs. 2 crore or your professional receipts exceed Rs. 50 lakh, or if you also have capital gains.
- ITR-3 is for you if you maintain actual accounts, or your turnover exceeds the presumptive limits, or you have capital gains alongside your business income.
- One important catch: if you opt out of the presumptive scheme, you cannot re-enter it for the next 5 years (Section 44AD). So think before you switch.

Note: Source: Sections 44AD, 44ADA, 44AE, Income Tax Act 1961

**04. ITR-5 FOR FIRMS AND LLPS**
Partnership firms and LLPs always file ITR-5 - regardless of size, profit level, or whether the business was active during the year. The firm files ITR-5 for its own income. Each partner then files their own individual ITR for their personal income.
- The partner's share of LLP profit is exempt from tax in their personal ITR (it has already been taxed at the LLP level)
- But any salary or interest the partner receives from the LLP is taxable in the partner's individual return
- Partners typically file ITR-3 (if they also have business income) or ITR-2 (if they have only salary and capital gains)

**05. WHAT HAPPENS IF YOU FILE THE WRONG FORM**
It is not the end of the world, but it does create problems.
- Defective return notice under Section 139(9): You will be asked to re-file in the correct form within 15 days
- If you do not respond: The return is treated as if you never filed - which triggers late filing fees and interest
- Losses cannot be carried forward: If the return ends up being invalid, you lose the ability to carry forward any losses for that year
- Increased scrutiny risk: A defective return filing pattern can trigger closer scrutiny of your tax affairs

**06. THE QUICK REFERENCE YOU CAN BOOKMARK**
- Pvt Ltd or Public Company = ITR-6
- LLP or Partnership Firm = ITR-5
- Trust, NGO, political party = ITR-7
- Individual: salary + one property + interest + total under Rs. 50 lakh + no capital gains + not a director = ITR-1
- Individual: capital gains, director role, foreign assets, above Rs. 50 lakh, or unlisted shares = ITR-2
- Individual or firm: business/professional income under presumptive limits = ITR-4
- Individual or firm: business income with actual accounts, or with capital gains alongside business income = ITR-3

### FAQs

**Q: I am salaried and sold some mutual fund units this year. Which form do I use?**
A: ITR-2. Any capital gains - even from redeeming mutual funds - disqualify you from ITR-1. It does not matter how small the amount is.

**Q: I am a freelancer getting paid in foreign currency. Which form applies to me?**
A: ITR-3 if you maintain actual books of accounts and declare actual profit. ITR-4 if your gross receipts are below Rs. 50 lakh and you want to use the 50% flat deduction under Section 44ADA (which applies to professionals - designers, writers, consultants, etc.). If you also have a foreign bank account, ITR-2 requirements may apply - check with a CA.

**Q: I filed ITR-1 last year. This year I joined a startup as a co-founder and hold shares. Same form?**
A: No. If you hold unlisted shares or are a director in any company, you must use ITR-2. This is one of the most common reasons people get a defective return notice.

**Q: Can I switch from ITR-1 to ITR-2 if I realise I filed the wrong one?**
A: Yes. File a revised return (revised ITR) using the correct form by December 31 of the assessment year. A revised return replaces the original completely.

**Q: My LLP partner also has salaried income from another job. What does their return look like?**
A: They file one ITR that covers both their salary income and their share of the LLP. Their LLP profit share goes in as exempt income. Any salary or interest they receive from the LLP itself is reported as taxable. Most partners with both salary and LLP income use ITR-3.

---

*End of Guide Pages Content*
