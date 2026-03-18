-- =============================================================================
-- Migration: Add service_explainer column for "What is [Service]?" section
-- Educational stepper explaining what the service is, why it exists, etc.
-- =============================================================================

-- Add the service_explainer JSONB column
ALTER TABLE service_packages ADD COLUMN IF NOT EXISTS service_explainer JSONB;

-- =============================================================================
-- Seed service explainer content for all active services
-- =============================================================================

-- Private Limited Incorporation
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
}'::jsonb WHERE slug = 'pvt-ltd-registration';

-- LLP Registration
UPDATE service_packages SET service_explainer = '{
  "steps": [
    {
      "step": 1,
      "title": "What it is",
      "visual": "info",
      "body": "A Limited Liability Partnership (LLP) is a hybrid business structure combining partnership flexibility with limited liability protection. Registered under the LLP Act, 2008, it allows partners to manage the business directly while protecting personal assets from business liabilities."
    },
    {
      "step": 2,
      "title": "Why it exists",
      "visual": "scale",
      "body": "The LLP Act, 2008 was introduced to bridge the gap between partnerships and companies. Traditional partnerships exposed all partners to unlimited liability. LLPs provide corporate-like protection while maintaining the ease of operation and tax benefits of a partnership structure."
    },
    {
      "step": 3,
      "title": "How it helps you",
      "visual": "sparkles",
      "body": "Limited liability protects partners personal assets from business debts. Lower compliance compared to Pvt Ltd - no mandatory audit below turnover threshold. No minimum capital requirement. Partners can participate in management without losing liability protection. Pass-through taxation means no dividend distribution tax."
    },
    {
      "step": 4,
      "title": "Why it is required",
      "visual": "shield",
      "body": "Professional services firms (CA, lawyers, consultants) prefer LLP for liability protection while maintaining partnership taxation. Service businesses without external funding requirements benefit from simpler compliance. Ideal when partners want direct involvement without board formalities."
    },
    {
      "step": 5,
      "title": "What happens without it",
      "visual": "alert",
      "body": "Operating as an unregistered partnership means unlimited personal liability for all partners. One partner actions can put other partners personal assets at risk. No legal recognition as a separate entity. Cannot own property in the firm name. Difficult to add or remove partners smoothly."
    }
  ]
}'::jsonb WHERE slug = 'llp-registration';

-- GST Registration
UPDATE service_packages SET service_explainer = '{
  "steps": [
    {
      "step": 1,
      "title": "What it is",
      "visual": "info",
      "body": "GST Registration is mandatory registration under the Goods and Services Tax Act, 2017. You receive a 15-digit GSTIN (GST Identification Number) that identifies your business in the GST system. It allows you to collect GST from customers, claim input tax credit on purchases, and file GST returns."
    },
    {
      "step": 2,
      "title": "Why it exists",
      "visual": "scale",
      "body": "GST replaced 17 indirect taxes (VAT, Service Tax, Excise, etc.) with one unified tax in July 2017. Registration creates accountability - the government tracks the tax chain from manufacturer to consumer. It ensures businesses above the threshold contribute to public revenue."
    },
    {
      "step": 3,
      "title": "How it helps you",
      "visual": "sparkles",
      "body": "Claim input tax credit on all business purchases - reduces effective tax burden. Sell to other GST-registered businesses without friction. Access e-way bill system for interstate goods transport. Build credibility with corporate clients who require vendor GSTIN. Participate in government tenders."
    },
    {
      "step": 4,
      "title": "Why it is required",
      "visual": "shield",
      "body": "Mandatory if annual turnover exceeds Rs 40 lakh (Rs 20 lakh for services or special category states). Required for interstate supplies regardless of turnover. E-commerce sellers must register regardless of turnover. Many B2B contracts require GSTIN for vendor onboarding."
    },
    {
      "step": 5,
      "title": "What happens without it",
      "visual": "alert",
      "body": "Operating without mandatory GST registration is tax evasion - penalties up to 100% of tax due plus interest at 18% per annum. Cannot claim input tax credit, increasing costs. Blocked from selling on e-commerce platforms. Cannot generate e-way bills for goods transport. Enterprise clients will not onboard you as vendor."
    }
  ]
}'::jsonb WHERE slug = 'gst-registration';

-- FSSAI License
UPDATE service_packages SET service_explainer = '{
  "steps": [
    {
      "step": 1,
      "title": "What it is",
      "visual": "info",
      "body": "FSSAI License is a permit issued by the Food Safety and Standards Authority of India allowing you to manufacture, store, distribute, or sell food products. Your 14-digit license number must appear on all food packaging. There are three types: Basic Registration (under Rs 12L turnover), State License (Rs 12L-20Cr), and Central License (above Rs 20Cr)."
    },
    {
      "step": 2,
      "title": "Why it exists",
      "visual": "scale",
      "body": "The Food Safety and Standards Act, 2006 established FSSAI to protect consumers from unsafe food. It sets standards for ingredients, additives, packaging, and hygiene. The licensing system ensures traceability - if contaminated food enters the market, authorities can trace it back to the source."
    },
    {
      "step": 3,
      "title": "How it helps you",
      "visual": "sparkles",
      "body": "Legal authorization to operate - avoid seizure and closure. Display the FSSAI logo to build consumer trust. List on food aggregator platforms (Swiggy, Zomato, Amazon). Access institutional buyers (hotels, airlines, corporates). Import or export food products legally."
    },
    {
      "step": 4,
      "title": "Why it is required",
      "visual": "shield",
      "body": "Any business involved in food - restaurants, cloud kitchens, bakeries, caterers, food manufacturers, importers, distributors, retailers - must have FSSAI registration or license. Food aggregator platforms require FSSAI number for onboarding. Government tenders for food supply require license."
    },
    {
      "step": 5,
      "title": "What happens without it",
      "visual": "alert",
      "body": "Operating a food business without FSSAI is illegal - penalty up to Rs 5 lakh. Products can be seized and destroyed. Business premises can be sealed by food safety officers. Criminal prosecution possible for repeat offenders. Food aggregators will delist you. Insurance claims may be rejected if accident occurs."
    }
  ]
}'::jsonb WHERE slug = 'fssai-registration';

-- Trademark Registration
UPDATE service_packages SET service_explainer = '{
  "steps": [
    {
      "step": 1,
      "title": "What it is",
      "visual": "info",
      "body": "Trademark Registration protects your brand identity - name, logo, tagline, or any mark that distinguishes your goods or services. Once registered under the Trade Marks Act, 1999, you get exclusive rights to use that mark in your category across India for 10 years (renewable indefinitely)."
    },
    {
      "step": 2,
      "title": "Why it exists",
      "visual": "scale",
      "body": "The Trade Marks Act, 1999 protects consumers from confusion and protects businesses from unfair competition. It creates a registry where brands can establish ownership. Without this system, anyone could copy your brand name and free-ride on your reputation."
    },
    {
      "step": 3,
      "title": "How it helps you",
      "visual": "sparkles",
      "body": "Use the R symbol - signals genuine brand ownership. Legal right to stop copycats and infringers. Asset value - registered trademarks can be licensed, franchised, or sold. Required for Amazon Brand Registry and other platform brand protections. Strengthens legal position in domain disputes."
    },
    {
      "step": 4,
      "title": "Why it is required",
      "visual": "shield",
      "body": "If you are building a consumer brand, trademark protection is essential - otherwise competitors can legally use your name. E-commerce platforms require registration for brand protection features. Investors and acquirers value registered IP. Franchise models require trademark ownership."
    },
    {
      "step": 5,
      "title": "What happens without it",
      "visual": "alert",
      "body": "Without registration, you have limited legal recourse against copycats - proving passing off is expensive and uncertain. Someone else might register your brand name before you. No access to platform brand protection features. Investors may discount valuation due to unprotected IP. Risk of receiving cease and desist from someone who registered first."
    }
  ]
}'::jsonb WHERE slug = 'trademark-registration';

-- Import Export Code
UPDATE service_packages SET service_explainer = '{
  "steps": [
    {
      "step": 1,
      "title": "What it is",
      "visual": "info",
      "body": "Import Export Code (IEC) is a 10-digit registration number issued by the Directorate General of Foreign Trade (DGFT). It is your identity for all cross-border trade - required for customs clearance, foreign exchange transactions, and availing export incentives."
    },
    {
      "step": 2,
      "title": "Why it exists",
      "visual": "scale",
      "body": "The Foreign Trade (Development and Regulation) Act, 1992 requires IEC to track international trade. It helps government monitor foreign exchange flows, apply trade policies, and provide export incentives. The code links your international transactions to your PAN for tax compliance."
    },
    {
      "step": 3,
      "title": "How it helps you",
      "visual": "sparkles",
      "body": "Clear goods through customs for import or export. Receive foreign currency payments through banking channels. Avail export incentives like duty drawback, RoDTEP, and MEIS. Open foreign currency accounts. Participate in international trade fairs with government support."
    },
    {
      "step": 4,
      "title": "Why it is required",
      "visual": "shield",
      "body": "Any business engaged in import or export of goods or services needs IEC. Service exporters (IT companies, consultants) need it to receive foreign payments through proper channels. Required even for samples or gifts crossing borders. E-commerce sellers on international platforms need IEC."
    },
    {
      "step": 5,
      "title": "What happens without it",
      "visual": "alert",
      "body": "Goods will be held at customs - cannot clear imports or exports. Banks will reject foreign currency transactions without IEC. Lose export incentives and tax benefits. Foreign clients may refuse to work with you due to payment complications. Risk of goods being auctioned at ports."
    }
  ]
}'::jsonb WHERE slug = 'import-export-code';

-- Director KYC
UPDATE service_packages SET service_explainer = '{
  "steps": [
    {
      "step": 1,
      "title": "What it is",
      "visual": "info",
      "body": "Director KYC (DIR-3 KYC) is an annual verification where all company directors confirm their identity and contact details with the Ministry of Corporate Affairs. You verify your personal details using Aadhaar OTP and digital signature to confirm you are still an active director."
    },
    {
      "step": 2,
      "title": "Why it exists",
      "visual": "scale",
      "body": "The Companies Act requires annual director verification to maintain an accurate registry of who controls Indian companies. It helps identify shell companies, track beneficial ownership, and ensure contact details are current for legal notices and compliance communications."
    },
    {
      "step": 3,
      "title": "How it helps you",
      "visual": "sparkles",
      "body": "Keeps your DIN active and valid. Ensures you can continue to act as director, sign filings, and maintain control. Updated contact ensures you receive important notices. Clean compliance record for due diligence by investors or acquirers."
    },
    {
      "step": 4,
      "title": "Why it is required",
      "visual": "shield",
      "body": "Mandatory annual filing for every director holding a DIN. Due date is September 30 each financial year. Required even if you are director of a dormant company. Applies to all directors including nominee and independent directors."
    },
    {
      "step": 5,
      "title": "What happens without it",
      "visual": "alert",
      "body": "DIN is marked as KYC not verified and deactivated. You cannot sign any company filings or resolutions. Penalty of Rs 5,000 for late filing. Multiple missed KYCs lead to DIN disqualification. All companies where you are director face compliance issues."
    }
  ]
}'::jsonb WHERE slug = 'director-kyc';

-- GST Monthly Filing
UPDATE service_packages SET service_explainer = '{
  "steps": [
    {
      "step": 1,
      "title": "What it is",
      "visual": "info",
      "body": "GST Monthly Filing refers to GSTR-1 (sales return due 11th) and GSTR-3B (summary return due 20th) filed every month. GSTR-1 reports your outward supplies (sales invoices). GSTR-3B summarizes your liability, input credit, and tax payment. Together they complete your monthly GST compliance."
    },
    {
      "step": 2,
      "title": "Why it exists",
      "visual": "scale",
      "body": "The GST system relies on invoice matching - your sales become your customer purchase (input credit). Monthly filing ensures timely reporting so the credit chain works. GSTR-3B enables monthly tax payment while GSTR-1 provides detailed transaction data for verification."
    },
    {
      "step": 3,
      "title": "How it helps you",
      "visual": "sparkles",
      "body": "Regular filing keeps your GST account compliant - no blocks on e-way bills or refunds. Customers can claim input credit on your invoices promptly. Maintains clean compliance record for tender eligibility. Avoids penalty accumulation from late filing."
    },
    {
      "step": 4,
      "title": "Why it is required",
      "visual": "shield",
      "body": "All regular GST-registered taxpayers must file monthly (composition dealers file quarterly). Even nil returns must be filed if there is no business. Consecutive missed filings lead to registration suspension or cancellation."
    },
    {
      "step": 5,
      "title": "What happens without it",
      "visual": "alert",
      "body": "Late fee of Rs 50 per day (Rs 20 for nil) per return, capped at Rs 10,000 per return. Interest at 18% on unpaid tax. E-way bill generation blocked after two missed returns. GST registration suo moto cancelled after 6 months of non-filing. Customers cannot claim ITC on your invoices."
    }
  ]
}'::jsonb WHERE slug = 'gst-monthly-filing';

-- Annual Filing (Pvt Ltd)
UPDATE service_packages SET service_explainer = '{
  "steps": [
    {
      "step": 1,
      "title": "What it is",
      "visual": "info",
      "body": "Annual Filing for Private Limited Company includes two mandatory ROC filings: AOC-4 (financial statements) and MGT-7 (annual return). AOC-4 files your audited balance sheet, profit and loss, and auditor report. MGT-7 reports shareholding, directors, and meeting details. Both are filed with the Registrar of Companies."
    },
    {
      "step": 2,
      "title": "Why it exists",
      "visual": "scale",
      "body": "The Companies Act, 2013 requires annual disclosure to maintain transparency. Financial statements inform creditors and stakeholders. Annual returns update the public registry with current shareholding and management. This public record enables due diligence by investors, lenders, and partners."
    },
    {
      "step": 3,
      "title": "How it helps you",
      "visual": "sparkles",
      "body": "Maintains Active company status on MCA portal. Clean compliance record for investor due diligence. Enables director KYC and other filings. Protects directors from personal liability for non-compliance. Banks and lenders check ROC compliance before sanctioning loans."
    },
    {
      "step": 4,
      "title": "Why it is required",
      "visual": "shield",
      "body": "Mandatory for every Pvt Ltd company regardless of business activity. AOC-4 due within 30 days of AGM. MGT-7 due within 60 days of AGM. AGM must be held within 6 months of financial year end. Even dormant companies must file."
    },
    {
      "step": 5,
      "title": "What happens without it",
      "visual": "alert",
      "body": "Penalty of Rs 100-300 per day per form, no cap. Company status marked as Default on MCA - visible in public search. Directors can be disqualified under Section 164(2). Company can be struck off as defunct after 2 years of non-filing. Banks may freeze accounts seeing default status."
    }
  ]
}'::jsonb WHERE slug = 'annual-compliance-pvt-ltd';

-- MSME Registration
UPDATE service_packages SET service_explainer = '{
  "steps": [
    {
      "step": 1,
      "title": "What it is",
      "visual": "info",
      "body": "MSME Registration (now called Udyam Registration) is a free online registration with the Ministry of MSME. Based on your investment and turnover, you are classified as Micro, Small, or Medium Enterprise. You receive a Udyam Registration Number (URN) that identifies your MSME status."
    },
    {
      "step": 2,
      "title": "Why it exists",
      "visual": "scale",
      "body": "The MSME Development Act, 2006 promotes small businesses through targeted benefits. Registration creates an official database for policy targeting. It enables government to channel subsidies, priority lending, and procurement preferences to the right beneficiaries."
    },
    {
      "step": 3,
      "title": "How it helps you",
      "visual": "sparkles",
      "body": "Priority sector lending from banks at lower interest rates. 45-day payment protection from large buyers (MSE Facilitation Council). Government tender preference - 25% procurement reserved for MSMEs. Subsidy schemes for technology, marketing, and credit. ISO/Patent/ZED certification reimbursements."
    },
    {
      "step": 4,
      "title": "Why it is required",
      "visual": "shield",
      "body": "To avail any MSME scheme benefit, you need Udyam Registration. Banks require it for priority sector classification of loans. Government e-marketplace (GeM) requires it for MSME seller benefits. Many state incentives (power subsidy, stamp duty exemption) require MSME status."
    },
    {
      "step": 5,
      "title": "What happens without it",
      "visual": "alert",
      "body": "You miss low-interest bank loans reserved for MSMEs. No legal remedy for delayed payments from large buyers. Cannot access government procurement preference. Miss subsidy schemes worth lakhs (technology upgradation, credit guarantee). Competitors with registration get pricing advantage through lower finance costs."
    }
  ]
}'::jsonb WHERE slug = 'msme-registration';

-- Digital Signature Certificate
UPDATE service_packages SET service_explainer = '{
  "steps": [
    {
      "step": 1,
      "title": "What it is",
      "visual": "info",
      "body": "Digital Signature Certificate (DSC) is the electronic equivalent of a physical signature. Issued by licensed Certifying Authorities, it cryptographically binds your identity to documents you sign. Class 3 DSC with encryption enables you to sign documents and encrypt data for secure submission."
    },
    {
      "step": 2,
      "title": "Why it exists",
      "visual": "scale",
      "body": "The Information Technology Act, 2000 gave legal validity to digital signatures equal to physical signatures. As government moved services online (MCA, Income Tax, GST), a secure identity verification mechanism became necessary. DSC ensures authenticity and non-repudiation of electronic filings."
    },
    {
      "step": 3,
      "title": "How it helps you",
      "visual": "sparkles",
      "body": "File MCA forms (incorporation, annual filings, changes) - mandatory for directors. Sign income tax returns for companies. E-tender participation on government portals. Execute contracts digitally with legal validity. Secure communication with encryption."
    },
    {
      "step": 4,
      "title": "Why it is required",
      "visual": "shield",
      "body": "Every director needs DSC for MCA filings. Tax filings for companies require DSC. E-procurement on government portals mandates DSC for bidding. RBI CERSAI filings for secured loans need DSC. Patent and trademark online filings require DSC."
    },
    {
      "step": 5,
      "title": "What happens without it",
      "visual": "alert",
      "body": "Cannot file any MCA form - company compliance is blocked. Cannot sign ITR for the company. Blocked from e-tender participation - lose government contract opportunities. Delays in time-sensitive filings while obtaining DSC. Must authorize someone else to sign on your behalf."
    }
  ]
}'::jsonb WHERE slug = 'digital-signature';

-- OPC Incorporation
UPDATE service_packages SET service_explainer = '{
  "steps": [
    {
      "step": 1,
      "title": "What it is",
      "visual": "info",
      "body": "One Person Company (OPC) is a company structure under the Companies Act, 2013 that allows a single person to incorporate and run a company. It combines the advantages of sole proprietorship (single ownership, easy decision-making) with limited liability protection of a company."
    },
    {
      "step": 2,
      "title": "Why it exists",
      "visual": "scale",
      "body": "The Companies Act, 2013 introduced OPC to encourage solo entrepreneurs to formalize. Previously, a company needed at least two shareholders. OPC bridges the gap - you get corporate structure benefits without needing a partner or co-founder."
    },
    {
      "step": 3,
      "title": "How it helps you",
      "visual": "sparkles",
      "body": "Limited liability protection for a single-person business. Separate legal entity - business assets distinct from personal assets. Tax benefits compared to proprietorship for higher income brackets. Easier to convert to Pvt Ltd when you add partners or investors. Professional credibility with corporate clients."
    },
    {
      "step": 4,
      "title": "Why it is required",
      "visual": "shield",
      "body": "If you want corporate structure but do not have a co-founder. When personal liability risk is significant for your business type. When dealing with corporate clients who prefer registered entities. If you plan to eventually raise funding or add partners."
    },
    {
      "step": 5,
      "title": "What happens without it",
      "visual": "alert",
      "body": "Operating as proprietorship means unlimited personal liability. No separation between personal and business assets in legal disputes. Limited credibility with enterprise clients. Cannot convert to Pvt Ltd easily - need full incorporation process. Higher tax rates at personal income level compared to corporate tax."
    }
  ]
}'::jsonb WHERE slug = 'opc-incorporation';

-- Partnership Registration
UPDATE service_packages SET service_explainer = '{
  "steps": [
    {
      "step": 1,
      "title": "What it is",
      "visual": "info",
      "body": "Partnership Firm Registration is filing the partnership deed with the Registrar of Firms under the Indian Partnership Act, 1932. While registration is optional, it provides legal rights to sue partners and outsiders. The deed defines profit sharing, capital contribution, roles, and exit terms."
    },
    {
      "step": 2,
      "title": "Why it exists",
      "visual": "scale",
      "body": "The Partnership Act, 1932 governs partnership firms - registration creates official record. A registered partnership can enforce agreements in court. Registration also creates clarity for partners and third parties about the firm existence and partners rights."
    },
    {
      "step": 3,
      "title": "How it helps you",
      "visual": "sparkles",
      "body": "Right to sue third parties for breach of contract. Claim set-off in suits filed against the firm. Clear documentation of partner rights and responsibilities. Easier to open bank accounts and establish business relationships. Creates framework for partner disputes and exit."
    },
    {
      "step": 4,
      "title": "Why it is required",
      "visual": "shield",
      "body": "While not mandatory, unregistered partnerships cannot sue in court. Banks and landlords may require registration certificate. Government contracts often require registration. When partner disputes arise, registered deed provides legal clarity."
    },
    {
      "step": 5,
      "title": "What happens without it",
      "visual": "alert",
      "body": "Cannot file suit against third parties in any court. Cannot claim set-off or relief in suits filed against firm. Partner disputes have no legal framework - leads to costly litigation. Difficulty opening bank accounts and establishing credit. No official record of partner contributions and rights."
    }
  ]
}'::jsonb WHERE slug = 'partnership-registration';

-- Startup India Registration
UPDATE service_packages SET service_explainer = '{
  "steps": [
    {
      "step": 1,
      "title": "What it is",
      "visual": "info",
      "body": "Startup India Registration (DPIIT Recognition) is official certification by the Department for Promotion of Industry and Internal Trade that your company qualifies as a startup under the Startup India initiative. You receive a recognition certificate and access to various benefits."
    },
    {
      "step": 2,
      "title": "Why it exists",
      "visual": "scale",
      "body": "The Startup India initiative launched in 2016 aims to build a strong ecosystem for nurturing innovation and startups. DPIIT recognition creates a filter - only genuine startups (working on innovation, not just any new business) get benefits reserved for the ecosystem."
    },
    {
      "step": 3,
      "title": "How it helps you",
      "visual": "sparkles",
      "body": "3-year tax holiday under Section 80-IAC (post DPIIT approval). Angel Tax exemption under Section 56(2)(viib). Self-certification for labor and environment compliances. Fast-track patent examination at 80% rebate. Access to Fund of Funds, Credit Guarantee, and accelerator programs."
    },
    {
      "step": 4,
      "title": "Why it is required",
      "visual": "shield",
      "body": "To avail any Startup India benefit, DPIIT recognition is the first step. Investors may require it for their investment thesis. Government tenders reserve categories for DPIIT-recognized startups. State startup policies often require DPIIT recognition as eligibility."
    },
    {
      "step": 5,
      "title": "What happens without it",
      "visual": "alert",
      "body": "Cannot claim 3-year tax exemption even if eligible otherwise. Angel tax provisions apply fully - valuation scrutiny on funding rounds. No access to startup-specific government schemes. Miss networking, mentorship, and program opportunities. Competitors with recognition have tax advantage."
    }
  ]
}'::jsonb WHERE slug = 'startup-india';

-- Professional Tax
UPDATE service_packages SET service_explainer = '{
  "steps": [
    {
      "step": 1,
      "title": "What it is",
      "visual": "info",
      "body": "Professional Tax is a state-level tax levied on professions, trades, and employment. Employers must register and deduct professional tax from employee salaries. Professionals and business owners pay directly. Rates vary by state - typically Rs 200-2500 per month based on income slabs."
    },
    {
      "step": 2,
      "title": "Why it exists",
      "visual": "scale",
      "body": "The Constitution (Article 276) allows states to levy professional tax up to Rs 2,500 per year. It provides revenue for state governments and local bodies. The tax is simple to administer through employer deduction, ensuring broad compliance."
    },
    {
      "step": 3,
      "title": "How it helps you",
      "visual": "sparkles",
      "body": "Registration provides compliance status required for government contracts. Professional tax paid is deductible from income tax. Demonstrates employer compliance during labor audits. Clean record for company due diligence by investors or acquirers."
    },
    {
      "step": 4,
      "title": "Why it is required",
      "visual": "shield",
      "body": "Mandatory in most states for employers with employees above threshold. Professional service providers (doctors, lawyers, CAs, architects) must register individually. Companies need registration in each state where they have employees. Renewal is typically annual."
    },
    {
      "step": 5,
      "title": "What happens without it",
      "visual": "alert",
      "body": "Penalty varies by state - typically 10-50% of tax due plus interest. Assessment notices and recovery proceedings. Blocked from government tender participation in some states. Labor department notices during inspections. Non-compliant finding in investor due diligence."
    }
  ]
}'::jsonb WHERE slug = 'professional-tax';

-- Shop and Establishment
UPDATE service_packages SET service_explainer = '{
  "steps": [
    {
      "step": 1,
      "title": "What it is",
      "visual": "info",
      "body": "Shop and Establishment License is registration under the state Shops and Establishments Act. It registers your business premises with the local labor department, covering working hours, wages, holidays, and employment conditions. The license is premise-specific - each location needs separate registration."
    },
    {
      "step": 2,
      "title": "Why it exists",
      "visual": "scale",
      "body": "Shops and Establishments Acts are state laws that regulate working conditions in commercial establishments. The license ensures basic labor protections - weekly off, working hours limits, overtime pay, leave entitlements. It also creates a database of businesses for local administration."
    },
    {
      "step": 3,
      "title": "How it helps you",
      "visual": "sparkles",
      "body": "Legal proof of business establishment for bank accounts and contracts. Required for GST registration in some states. Demonstrates labor compliance during audits. Necessary for FSSAI, trade license, and other permits. Some landlords require it for commercial lease."
    },
    {
      "step": 4,
      "title": "Why it is required",
      "visual": "shield",
      "body": "Mandatory for any commercial establishment with employees - offices, shops, restaurants, warehouses. Some states require it even for home-based businesses. Typically needed within 30 days of starting operations. Renewal is usually annual or upon change."
    },
    {
      "step": 5,
      "title": "What happens without it",
      "visual": "alert",
      "body": "Penalty varies by state - typically Rs 1,000-10,000 plus daily fine for continued violation. Labor inspector can issue closure notice. Other registrations (FSSAI, trade license) may be denied. Bank may refuse business account opening. Landlord liability issues in commercial lease."
    }
  ]
}'::jsonb WHERE slug = 'shop-establishment';

-- Cloud Kitchen License
UPDATE service_packages SET service_explainer = '{
  "steps": [
    {
      "step": 1,
      "title": "What it is",
      "visual": "info",
      "body": "Cloud Kitchen License is a combination of FSSAI State License (or Central License based on turnover) plus local health trade license for delivery-only food operations. Unlike restaurants, cloud kitchens do not need seating permits but must meet food safety standards for commercial food preparation and delivery."
    },
    {
      "step": 2,
      "title": "Why it exists",
      "visual": "scale",
      "body": "Food safety laws apply equally to delivery-only kitchens. FSSAI regulates hygiene, ingredient sourcing, and packaging standards. Local trade licenses ensure premise safety and zoning compliance. Food aggregators enforce these requirements for consumer protection and liability management."
    },
    {
      "step": 3,
      "title": "How it helps you",
      "visual": "sparkles",
      "body": "Onboard on Swiggy, Zomato, and other food aggregators - they mandate FSSAI. Display FSSAI logo on packaging to build customer trust. Legal authorization to operate commercial kitchen. Insurance coverage becomes available with proper licensing. Access institutional catering contracts."
    },
    {
      "step": 4,
      "title": "Why it is required",
      "visual": "shield",
      "body": "Food aggregators will not onboard without FSSAI license number. Local authorities can seal unlicensed food operations. Insurance claims rejected if operating without license. Customers increasingly check FSSAI details. Bank loans for kitchen equipment need business legality proof."
    },
    {
      "step": 5,
      "title": "What happens without it",
      "visual": "alert",
      "body": "Cannot list on food delivery platforms - major revenue channel blocked. Food safety officers can raid and seal premises. Penalty up to Rs 5 lakh under FSSAI Act. Products seized and destroyed. Criminal liability if food safety incident occurs. No insurance coverage for kitchen operations."
    }
  ]
}'::jsonb WHERE slug = 'cloud-kitchen-setup';

-- TDS Filing
UPDATE service_packages SET service_explainer = '{
  "steps": [
    {
      "step": 1,
      "title": "What it is",
      "visual": "info",
      "body": "TDS (Tax Deducted at Source) Filing involves depositing TDS with the government and filing quarterly returns (24Q for salary, 26Q for non-salary). As a deductor, you withhold tax from payments to vendors, contractors, employees and deposit to government within due dates. Returns detail all deductions made."
    },
    {
      "step": 2,
      "title": "Why it exists",
      "visual": "scale",
      "body": "TDS is the government tool for advance tax collection at the point of income generation. Instead of waiting for year-end returns, tax is collected when payment happens. It ensures compliance, reduces evasion, and provides steady government revenue throughout the year."
    },
    {
      "step": 3,
      "title": "How it helps you",
      "visual": "sparkles",
      "body": "Fulfill statutory obligation as a deductor. Enable deductees (vendors, employees) to claim TDS credit in their returns. Avoid penalty notices and prosecution. Generate TDS certificates (Form 16, 16A) for deductees. Maintain clean compliance record for audits."
    },
    {
      "step": 4,
      "title": "Why it is required",
      "visual": "shield",
      "body": "Any business making payments above threshold for rent, professional fees, contractor payments, salary, interest - must deduct and deposit TDS. Quarterly returns are mandatory. Even nil returns must be filed. TDS provisions apply regardless of your own tax liability."
    },
    {
      "step": 5,
      "title": "What happens without it",
      "visual": "alert",
      "body": "Interest at 1.5% per month on late deposit. Penalty up to Rs 200 per day for late filing, capped at TDS amount. Disallowance of expense if TDS not deducted - effective double taxation. Prosecution for willful non-compliance. Lower TDS certificate requests from vendors indicate distrust."
    }
  ]
}'::jsonb WHERE slug = 'tds-filing';

-- LLP Annual Filing
UPDATE service_packages SET service_explainer = '{
  "steps": [
    {
      "step": 1,
      "title": "What it is",
      "visual": "info",
      "body": "LLP Annual Filing includes two mandatory forms: Form 8 (Statement of Account and Solvency) and Form 11 (Annual Return). Form 8 declares that the LLP is solvent and can pay debts. Form 11 reports partner details, business activities, and contribution changes. Both are filed with the Registrar."
    },
    {
      "step": 2,
      "title": "Why it exists",
      "visual": "scale",
      "body": "The LLP Act, 2008 requires annual disclosure to maintain transparency. Form 8 protects creditors by requiring partners to certify solvency. Form 11 updates the public registry with current partnership details. This enables due diligence by lenders, partners, and counterparties."
    },
    {
      "step": 3,
      "title": "How it helps you",
      "visual": "sparkles",
      "body": "Maintains Active LLP status on MCA portal. Clean compliance record for bank loans and credit facilities. Enables partner KYC filings and other compliance. Protects partners from personal liability for non-compliance. Required for conversion or closure procedures."
    },
    {
      "step": 4,
      "title": "Why it is required",
      "visual": "shield",
      "body": "Mandatory for every LLP regardless of business activity. Form 11 due within 60 days of financial year end (May 30). Form 8 due within 30 days of 6 months from FY end (October 30). Even dormant LLPs must file. No exemptions for small LLPs."
    },
    {
      "step": 5,
      "title": "What happens without it",
      "visual": "alert",
      "body": "Penalty of Rs 100 per day per form, no cap - can accumulate to lakhs. LLP status marked as Default on MCA - visible in public search. Designated Partners face personal penalty. LLP can be struck off as defunct. Banks may freeze accounts. Partners may be barred from forming new entities."
    }
  ]
}'::jsonb WHERE slug = 'llp-annual-filing';
