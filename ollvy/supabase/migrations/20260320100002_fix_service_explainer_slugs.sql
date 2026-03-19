-- Fix service explainer slugs to match actual service slugs
-- The previous migration used incorrect slugs

-- pvt-ltd-registration -> pvt-ltd-incorporation
UPDATE service_packages SET service_explainer = (
  SELECT service_explainer FROM service_packages WHERE slug = 'pvt-ltd-registration'
) WHERE slug = 'pvt-ltd-incorporation' AND service_explainer IS NULL;

-- llp-registration -> llp-incorporation
UPDATE service_packages SET service_explainer = (
  SELECT service_explainer FROM service_packages WHERE slug = 'llp-registration'
) WHERE slug = 'llp-incorporation' AND service_explainer IS NULL;

-- fssai-registration -> fssai-license
UPDATE service_packages SET service_explainer = (
  SELECT service_explainer FROM service_packages WHERE slug = 'fssai-registration'
) WHERE slug = 'fssai-license' AND service_explainer IS NULL;

-- import-export-code -> iec-code
UPDATE service_packages SET service_explainer = (
  SELECT service_explainer FROM service_packages WHERE slug = 'import-export-code'
) WHERE slug = 'iec-code' AND service_explainer IS NULL;

-- gst-monthly-filing -> gst-monthly-50l
UPDATE service_packages SET service_explainer = (
  SELECT service_explainer FROM service_packages WHERE slug = 'gst-monthly-filing'
) WHERE slug = 'gst-monthly-50l' AND service_explainer IS NULL;

-- annual-compliance-pvt-ltd -> mca-annual-filing
UPDATE service_packages SET service_explainer = (
  SELECT service_explainer FROM service_packages WHERE slug = 'annual-compliance-pvt-ltd'
) WHERE slug = 'mca-annual-filing' AND service_explainer IS NULL;

-- tds-filing -> tds-monthly-compliance
UPDATE service_packages SET service_explainer = (
  SELECT service_explainer FROM service_packages WHERE slug = 'tds-filing'
) WHERE slug = 'tds-monthly-compliance' AND service_explainer IS NULL;

-- Now add explainer content directly to the correct slugs

-- Pvt Ltd Incorporation
UPDATE service_packages SET service_explainer = '{
  "steps": [
    {
      "step": 1,
      "title": "What it is",
      "visual": "info",
      "body": "A Private Limited Company is a business entity registered under the Companies Act, 2013. It has a separate legal identity from its owners - it can own property, enter contracts, and sue or be sued in its own name. The private designation means shares cannot be traded publicly - they are held by a limited group of shareholders (max 200)."
    },
    {
      "step": 2,
      "title": "Why it exists",
      "visual": "scale",
      "body": "The Companies Act, 2013 created this structure to encourage entrepreneurship while protecting investors. It provides limited liability - shareholders are only liable up to their share capital, not personal assets. This legal protection enables people to start businesses without risking everything they own."
    },
    {
      "step": 3,
      "title": "How it helps you",
      "visual": "sparkles",
      "body": "Limited liability protects your personal assets if the business fails or faces lawsuits. Perpetual existence means the company continues even if founders leave. Easier to raise investment - VCs and angels prefer Pvt Ltd. Credibility with banks, vendors, and enterprise clients. ESOPs possible for hiring talent."
    },
    {
      "step": 4,
      "title": "Why it is required",
      "visual": "shield",
      "body": "If you plan to raise equity investment, Pvt Ltd is effectively mandatory - investors cannot invest in proprietorships or partnerships. If you have multiple co-founders, share certificates provide clear ownership. If you are building a scalable business, the structure grows with you."
    },
    {
      "step": 5,
      "title": "What happens without it",
      "visual": "alert",
      "body": "Without incorporation, you operate as a proprietorship with unlimited personal liability - creditors can seize personal assets. You cannot raise equity investment. No legal continuity if you step away. Limited credibility with enterprise clients and banks. No ability to issue ESOPs for talent acquisition."
    }
  ]
}'::jsonb WHERE slug = 'pvt-ltd-incorporation';

-- LLP Incorporation
UPDATE service_packages SET service_explainer = '{
  "steps": [
    {
      "step": 1,
      "title": "What it is",
      "visual": "info",
      "body": "A Limited Liability Partnership combines the flexibility of a partnership with the limited liability of a company. Registered under the LLP Act, 2008, it is a separate legal entity where partners have limited liability up to their agreed contribution. No minimum capital requirement."
    },
    {
      "step": 2,
      "title": "Why it exists",
      "visual": "scale",
      "body": "The LLP Act, 2008 was created to provide a modern business structure for professionals and small businesses. It offers limited liability protection without the compliance burden of a private limited company. Ideal for professional services firms, consulting businesses, and startups that do not plan to raise external equity."
    },
    {
      "step": 3,
      "title": "How it helps you",
      "visual": "sparkles",
      "body": "Limited liability protects personal assets from business debts. Lower compliance costs than Pvt Ltd - no board meetings, no statutory audit below threshold. Flexibility in profit sharing - not tied to capital contribution. Tax efficiency for professional income. Partners can be added or removed easily."
    },
    {
      "step": 4,
      "title": "Why it is required",
      "visual": "shield",
      "body": "If you are a professional services firm (CA, CS, lawyers, architects), LLP is often the preferred structure. If you want limited liability without the compliance burden of a company. If you do not plan to raise VC/PE investment. If you want flexibility in profit distribution among partners."
    },
    {
      "step": 5,
      "title": "What happens without it",
      "visual": "alert",
      "body": "Operating as a traditional partnership means unlimited personal liability - each partner is liable for the debts of the firm. No separate legal identity. Difficult to add or remove partners without dissolving the firm. Limited credibility with larger clients who prefer dealing with registered entities."
    }
  ]
}'::jsonb WHERE slug = 'llp-incorporation';

-- FSSAI License
UPDATE service_packages SET service_explainer = '{
  "steps": [
    {
      "step": 1,
      "title": "What it is",
      "visual": "info",
      "body": "FSSAI License is a mandatory registration under the Food Safety and Standards Act, 2006, for any business involved in food production, processing, storage, distribution, or sale. The 14-digit license number must be displayed on all food products and at the business premises."
    },
    {
      "step": 2,
      "title": "Why it exists",
      "visual": "scale",
      "body": "The Food Safety and Standards Authority of India (FSSAI) was established to ensure food safety and regulate the food industry. The licensing system creates accountability - every food business can be traced, inspected, and held responsible for food safety standards."
    },
    {
      "step": 3,
      "title": "How it helps you",
      "visual": "sparkles",
      "body": "Legal compliance protects you from penalties and business closure. Required for selling on food delivery platforms like Swiggy and Zomato. Essential for B2B sales to hotels, restaurants, and retailers. Builds consumer trust. Enables participation in government tenders for food supply."
    },
    {
      "step": 4,
      "title": "Why it is required",
      "visual": "shield",
      "body": "Any business handling food in any capacity must have FSSAI registration or license. Cloud kitchens, restaurants, food manufacturers, packaged food sellers, food importers - all require it. Turnover determines license type - basic registration for under Rs 12 lakh, state license for Rs 12L to Rs 20 crore, central license above that."
    },
    {
      "step": 5,
      "title": "What happens without it",
      "visual": "alert",
      "body": "Operating without FSSAI license is punishable with imprisonment up to 6 months and fine up to Rs 5 lakh. Food delivery platforms will not onboard you. Retailers will not stock your products. In case of any food safety incident, personal liability and criminal prosecution apply."
    }
  ]
}'::jsonb WHERE slug = 'fssai-license';

-- IEC Code
UPDATE service_packages SET service_explainer = '{
  "steps": [
    {
      "step": 1,
      "title": "What it is",
      "visual": "info",
      "body": "Import Export Code (IEC) is a 10-digit code issued by the Directorate General of Foreign Trade (DGFT), required for importing or exporting goods and services from India. It is a lifetime registration with no renewal required."
    },
    {
      "step": 2,
      "title": "Why it exists",
      "visual": "scale",
      "body": "The Foreign Trade (Development and Regulation) Act mandates IEC for tracking international trade. It enables the government to monitor foreign exchange flows, implement trade policies, and provide export incentives. Every import/export shipment requires the IEC for customs clearance."
    },
    {
      "step": 3,
      "title": "How it helps you",
      "visual": "sparkles",
      "body": "Enables legal import and export of goods. Required for receiving foreign remittances for services exported. Access to export incentives and duty drawbacks. Essential for customs clearance at ports. Opens global markets for your business."
    },
    {
      "step": 4,
      "title": "Why it is required",
      "visual": "shield",
      "body": "Mandatory for importing any goods into India. Mandatory for exporting goods from India. Required for receiving payments in foreign currency for services. Banks require IEC for foreign remittance above certain thresholds. Customs will not clear shipments without valid IEC."
    },
    {
      "step": 5,
      "title": "What happens without it",
      "visual": "alert",
      "body": "Goods will be held at customs indefinitely. Foreign currency receipts may be blocked by banks. Penalties for importing/exporting without IEC. Loss of business opportunities in international trade. Cannot claim export incentives or duty benefits."
    }
  ]
}'::jsonb WHERE slug = 'iec-code';

-- GST Monthly Filing (gst-monthly-50l)
UPDATE service_packages SET service_explainer = '{
  "steps": [
    {
      "step": 1,
      "title": "What it is",
      "visual": "info",
      "body": "GST Monthly Filing includes two mandatory returns - GSTR-1 (outward supplies) due by 11th and GSTR-3B (summary return with tax payment) due by 20th of each month. These returns reconcile your sales, purchases, and tax liability with the GST system."
    },
    {
      "step": 2,
      "title": "Why it exists",
      "visual": "scale",
      "body": "Monthly filing ensures real-time tracking of business transactions across India. GSTR-1 data flows to your customers GSTR-2A, enabling them to claim input tax credit. GSTR-3B captures tax payment. The system creates a chain of accountability across the supply chain."
    },
    {
      "step": 3,
      "title": "How it helps you",
      "visual": "sparkles",
      "body": "Timely filing maintains your compliance record - visible to customers who check GST portal. Enables smooth input tax credit for your customers. Avoids late fees and interest accumulation. Clean filing history helps in bank loans and government tenders. Required for e-way bill generation."
    },
    {
      "step": 4,
      "title": "Why it is required",
      "visual": "shield",
      "body": "Every registered GST taxpayer must file monthly returns regardless of turnover or transactions. Even nil returns are mandatory. Missing returns blocks your ability to file subsequent returns. Customers cannot claim ITC on your invoices if you do not file GSTR-1."
    },
    {
      "step": 5,
      "title": "What happens without it",
      "visual": "alert",
      "body": "Late fee of Rs 50 per day (Rs 20 for nil returns) up to Rs 10,000 per return. Interest at 18% per annum on unpaid tax. GSTIN can be suspended or cancelled for non-filing. E-way bill generation blocked. Your customers lose input tax credit on purchases from you."
    }
  ]
}'::jsonb WHERE slug = 'gst-monthly-50l';

-- MCA Annual Filing
UPDATE service_packages SET service_explainer = '{
  "steps": [
    {
      "step": 1,
      "title": "What it is",
      "visual": "info",
      "body": "MCA Annual Filing includes mandatory forms - AOC-4 (financial statements), MGT-7 (annual return), ADT-1 (auditor appointment), and DIR-3 KYC for directors. These filings update the Ministry of Corporate Affairs on your company status, finances, and compliance."
    },
    {
      "step": 2,
      "title": "Why it exists",
      "visual": "scale",
      "body": "The Companies Act, 2013 mandates annual filings to maintain corporate transparency. AOC-4 makes financial health visible. MGT-7 confirms shareholding and director changes. These filings create public records that banks, investors, and partners rely on for due diligence."
    },
    {
      "step": 3,
      "title": "How it helps you",
      "visual": "sparkles",
      "body": "Maintains company in active status - essential for operations. Banks check MCA records before loan approval. Investors verify compliance before funding. Clean filing history demonstrates professional management. Required for government tenders and large contracts."
    },
    {
      "step": 4,
      "title": "Why it is required",
      "visual": "shield",
      "body": "AOC-4 due within 30 days of AGM. MGT-7 due within 60 days of AGM. AGM must be held within 6 months of financial year end. DIR-3 KYC by Sep 30 annually. Missing any filing triggers penalties and can lead to strike-off proceedings."
    },
    {
      "step": 5,
      "title": "What happens without it",
      "visual": "alert",
      "body": "Additional fee of Rs 100 per day of delay, no upper limit. Company marked as default - visible on MCA portal. Directors disqualified from future directorships. Company can be struck off after 2 years of non-filing. Personal liability on directors for company debts during strike-off."
    }
  ]
}'::jsonb WHERE slug = 'mca-annual-filing';

-- TDS Monthly Compliance
UPDATE service_packages SET service_explainer = '{
  "steps": [
    {
      "step": 1,
      "title": "What it is",
      "visual": "info",
      "body": "TDS (Tax Deducted at Source) Monthly Compliance includes deducting tax at specified rates from payments like salaries, contractor fees, rent, professional fees, and depositing with the government by the 7th of the following month. Quarterly returns (24Q, 26Q) summarize all deductions."
    },
    {
      "step": 2,
      "title": "Why it exists",
      "visual": "scale",
      "body": "TDS is the governments mechanism to collect tax at the point of income generation rather than waiting for annual returns. It ensures steady tax collection and reduces evasion. The deductor becomes responsible for withholding and depositing the correct tax amount."
    },
    {
      "step": 3,
      "title": "How it helps you",
      "visual": "sparkles",
      "body": "Timely TDS compliance avoids interest and penalties. Deductees can claim credit in their returns. Builds trust with vendors and employees - they receive Form 16/16A as proof. Clean TDS record required for government contracts. Avoids disallowance of expenses during assessment."
    },
    {
      "step": 4,
      "title": "Why it is required",
      "visual": "shield",
      "body": "Any company or person paying specified expenses must deduct TDS if payments exceed threshold limits. TDS on salary mandatory regardless of amount. Contractor payments above Rs 30,000 single / Rs 1 lakh annual require TDS. Professional fees above Rs 30,000 require TDS."
    },
    {
      "step": 5,
      "title": "What happens without it",
      "visual": "alert",
      "body": "Interest at 1% per month for non-deduction, 1.5% for non-deposit. 30% of expense disallowed if TDS not deducted. Late filing fee up to Rs 200 per day. Penalty equal to TDS amount for willful default. Prosecution possible for large defaults."
    }
  ]
}'::jsonb WHERE slug = 'tds-monthly-compliance';

-- GST Annual Return
UPDATE service_packages SET service_explainer = '{
  "steps": [
    {
      "step": 1,
      "title": "What it is",
      "visual": "info",
      "body": "GSTR-9 is the annual GST return that consolidates all monthly returns filed during the financial year. It reconciles outward supplies, inward supplies, input tax credit, and tax paid. Due by December 31st for the previous financial year."
    },
    {
      "step": 2,
      "title": "Why it exists",
      "visual": "scale",
      "body": "The annual return provides a comprehensive view of a taxpayers GST compliance for the entire year. It helps identify discrepancies between monthly returns and books of accounts. Enables the department to detect mismatches and ensure correct tax payment."
    },
    {
      "step": 3,
      "title": "How it helps you",
      "visual": "sparkles",
      "body": "Reconciliation catches errors before department notice. Opportunity to correct minor discrepancies. Clean annual filing demonstrates compliance maturity. Required for large tender participation. Auditors rely on GSTR-9 for GST audit."
    },
    {
      "step": 4,
      "title": "Why it is required",
      "visual": "shield",
      "body": "Mandatory for all regular taxpayers with turnover above Rs 2 crore. Even below Rs 2 crore, filing is advisable for reconciliation. GSTR-9C (reconciliation statement) mandatory for turnover above Rs 5 crore. Due date is December 31st - no extensions typically granted."
    },
    {
      "step": 5,
      "title": "What happens without it",
      "visual": "alert",
      "body": "Late fee of Rs 200 per day (Rs 100 CGST + Rs 100 SGST) up to 0.5% of turnover. No upper cap makes this extremely expensive for large businesses. Missing GSTR-9 triggers scrutiny. Future return filing may be blocked. Assessment proceedings may be initiated."
    }
  ]
}'::jsonb WHERE slug = 'gst-annual-return';

-- Business ITR
UPDATE service_packages SET service_explainer = '{
  "steps": [
    {
      "step": 1,
      "title": "What it is",
      "visual": "info",
      "body": "Business ITR is the annual income tax return for companies (ITR-6) and LLPs/partnerships (ITR-5). It declares total income, deductions claimed, tax liability, and taxes already paid through TDS/advance tax. Due by October 31st (or November 30th with audit) for the previous financial year."
    },
    {
      "step": 2,
      "title": "Why it exists",
      "visual": "scale",
      "body": "Annual returns enable the government to assess total tax liability and verify taxes paid during the year. It provides a complete picture of business income and expenses. Enables carry forward of losses, claiming deductions, and reconciliation with TDS credits."
    },
    {
      "step": 3,
      "title": "How it helps you",
      "visual": "sparkles",
      "body": "Timely filing avoids penalties and interest. Enables refund claim if excess tax paid. Losses can be carried forward only if ITR filed on time. Required for bank loans and credit facilities. Essential for foreign remittances and FEMA compliance."
    },
    {
      "step": 4,
      "title": "Why it is required",
      "visual": "shield",
      "body": "Every company must file ITR-6 regardless of income or loss. Every LLP must file ITR-5. Partnerships file ITR-5. Even dormant companies must file returns. Tax audit mandatory if turnover exceeds Rs 1 crore (Rs 10 crore for digital transactions above 95%)."
    },
    {
      "step": 5,
      "title": "What happens without it",
      "visual": "alert",
      "body": "Late fee up to Rs 10,000. Interest at 1% per month on unpaid tax. Losses cannot be carried forward. Best judgment assessment by department. Directors may face prosecution for willful default. Bank loans and tenders become difficult without ITR acknowledgment."
    }
  ]
}'::jsonb WHERE slug = 'business-itr';
