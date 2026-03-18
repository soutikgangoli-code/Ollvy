-- =============================================================================
-- Migration: Add Cloud Kitchen Setup Service
-- Converts the pack page to standard service page with variant pricing
-- =============================================================================

-- First, add all new columns before using them in INSERT

-- Add variants column to service_packages if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'service_packages' AND column_name = 'variants'
  ) THEN
    ALTER TABLE service_packages ADD COLUMN variants jsonb DEFAULT NULL;
    COMMENT ON COLUMN service_packages.variants IS 'Service variants for pricing options (e.g., FSSAI Basic vs State)';
  END IF;
END $$;

-- Add default_variant_id column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'service_packages' AND column_name = 'default_variant_id'
  ) THEN
    ALTER TABLE service_packages ADD COLUMN default_variant_id text DEFAULT NULL;
    COMMENT ON COLUMN service_packages.default_variant_id IS 'Default variant ID to pre-select';
  END IF;
END $$;

-- Add comparison columns to service_packages if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'service_packages' AND column_name = 'comparison_without'
  ) THEN
    ALTER TABLE service_packages ADD COLUMN comparison_without jsonb DEFAULT NULL;
    COMMENT ON COLUMN service_packages.comparison_without IS 'List of pain points without Ollvy (for Why Ollvy section)';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'service_packages' AND column_name = 'comparison_with'
  ) THEN
    ALTER TABLE service_packages ADD COLUMN comparison_with jsonb DEFAULT NULL;
    COMMENT ON COLUMN service_packages.comparison_with IS 'List of benefits with Ollvy (for Why Ollvy section)';
  END IF;
END $$;

-- Now insert the cloud kitchen service data
INSERT INTO service_packages (
  slug,
  name,
  short_name,
  short_description,
  tagline,
  category,
  service_type,
  mandatory_for,
  legal_basis,
  penalty_for_missing,
  penalty_color,
  price_base_paisa,
  price_govt_fees_paisa,
  govt_fee_label,
  govt_fee_note,
  sla_working_days,
  billing_cycle,
  is_active,
  display_order,
  seo_title,
  seo_description,
  canonical_url,
  workflow_stages,
  whats_included,
  service_risks,
  profile_personas,
  faqs,
  review_sources,
  unlocks,
  review_keyword_chips,
  related_slugs,
  show_completion_stats,
  show_approval_rate,
  variants,
  default_variant_id,
  comparison_without,
  comparison_with
) VALUES (
  'cloud-kitchen-setup',
  'Cloud Kitchen Setup',
  'Cloud Kitchen',
  'Everything required to list on Swiggy and Zomato. FSSAI, GST, Shop & Establishment, and Trade License - filed simultaneously.',
  'Everything required to list on Swiggy and Zomato. 4 licenses, filed simultaneously, one contact.',
  'Licensing',
  'One-time',
  'Cloud kitchens, dark kitchens, home bakers going commercial',
  'Food Safety and Standards Act, 2006; CGST Act 2017; Shops and Establishments Act',
  '₹10,000 + ₹100/day FSSAI penalty + platform rejection',
  'red',
  3359900,  -- ₹33,599 (FSSAI State variant)
  210000,   -- ₹2,100 FSSAI govt fee
  'FSSAI license fee',
  'Paid to FSSAI. Fee varies by license type and validity.',
  45,
  'one_time',
  true,
  10,
  'FSSAI License + GST Registration for Cloud Kitchens India | Ollvy',
  'Get FSSAI, GST, Shop & Establishment, and Trade License filed simultaneously for your cloud kitchen. Guaranteed FSSAI application in 24 hours. List on Swiggy and Zomato in 30-45 days.',
  'https://ollvy.com/services/cloud-kitchen-setup',
  -- workflow_stages (5 steps)
  '[
    {
      "step": 1,
      "title": "Upload documents - work starts same day",
      "timeline": "Day 0",
      "body": "Answer questions about your kitchen location, food categories, and turnover. Upload Aadhaar, PAN, address proof, and kitchen layout. Your assigned professional reviews everything within 2 hours.",
      "milestone": "Personalised checklist sent, all document gaps identified",
      "visual": "checklist"
    },
    {
      "step": 2,
      "title": "All 4 applications filed simultaneously",
      "timeline": "Day 1",
      "body": "FSSAI, GST, Shop & Establishment, and Trade License applications filed on their respective portals. Not sequentially - simultaneously. You track progress in one dashboard.",
      "milestone": "Application reference numbers issued for all 4 services",
      "visual": "form"
    },
    {
      "step": 3,
      "title": "GST Registration live",
      "timeline": "Day 7",
      "body": "GSTIN issued. You can now legally invoice, start Swiggy/Zomato onboarding paperwork, and claim TCS credits.",
      "milestone": "GSTIN certificate issued",
      "visual": "stamp"
    },
    {
      "step": 4,
      "title": "FSSAI inspection",
      "timeline": "Day 15-20",
      "body": "Officer visits your kitchen. Ollvy sends you a pre-inspection checklist 7 days before - layout, cleanliness, labelling, document display. If improvement notice issued, we respond through FoSCoS portal.",
      "milestone": "Inspection passed or improvement notice response filed",
      "visual": "calendar"
    },
    {
      "step": 5,
      "title": "FSSAI certificate issued - go live on Swiggy",
      "timeline": "Day 30-45",
      "body": "FSSAI certificate issued. Submit to Swiggy and Zomato immediately. Go live within 3-5 days of submission.",
      "milestone": "All 4 licenses obtained. Ready for aggregator onboarding.",
      "isCompletion": true,
      "visual": "stamp"
    }
  ]'::jsonb,
  -- whats_included (4 service blocks)
  '[
    {
      "title": "FSSAI State License - application to certificate",
      "body": "Application filed on FoSCoS portal. Document review before submission. Pre-inspection checklist sent 7 days before officer visit. Response to improvement notices handled through portal.",
      "comparisonWithout": "Wrong license type filed. Application rejected. Swiggy will not onboard.",
      "comparisonWithOllvy": "License type confirmed before filing based on your turnover.",
      "mockVisualType": "status",
      "mockVisualData": {
        "label": "FSSAI APPLICATION",
        "row1": "License type: State ✓",
        "row2": "Document review: complete ✓",
        "row3": "Application: submitted ✓",
        "note": "Inspection scheduled within 14 days"
      }
    },
    {
      "title": "GST Registration - GSTIN in 7 working days",
      "body": "Application filed on GST portal. HSN/SAC codes selected for food categories. Invoice format guidance included. First GSTR-3B walkthrough if self-filing.",
      "comparisonWithout": "GST at wrong address. GSTIN does not match kitchen location.",
      "comparisonWithOllvy": "GST and FSSAI addresses verified to match before filing.",
      "mockVisualType": "arn",
      "mockVisualData": {
        "label": "GSTIN",
        "value": "29AABCU9603R1ZM",
        "status": "Active ✓",
        "filed": "Issued within 7 working days"
      }
    },
    {
      "title": "Shop & Establishment Registration",
      "body": "Application to state labour department. Certificate issued within 5-7 working days. Required before you can legally employ kitchen staff.",
      "comparisonWithout": "Operating without S&E registration is an offence in most states.",
      "comparisonWithOllvy": "Certificate obtained before you start hiring."
    },
    {
      "title": "Trade License / Eating House License",
      "body": "Application to municipal corporation and police (where applicable). Document preparation and follow-up until issued. Timeline: 15-30 working days.",
      "comparisonWithout": "Missing Eating House License in Delhi - police clearance required separately.",
      "comparisonWithOllvy": "Both Trade License and Eating House License covered."
    }
  ]'::jsonb,
  -- service_risks (4 risks)
  '[
    {
      "icon": "clock",
      "title": "FSSAI inspection failure",
      "body": "Officer visits and finds the kitchen does not match the submitted layout, or hygiene standards are not met. This adds 2-4 weeks while an improvement notice is issued and resolved. Ollvy sends a pre-inspection checklist 7 days before the visit."
    },
    {
      "icon": "document",
      "title": "GST portal rejection",
      "body": "GST applications are rejected when document names do not match (PAN vs Aadhaar), address is unclear, or bank details are incorrect. Ollvy reviews all documents for consistency before filing. Our rejection rate is under 5%."
    },
    {
      "icon": "building",
      "title": "Trade License delays in specific cities",
      "body": "Municipal corporations in Delhi, Mumbai, and Bengaluru have different processes and timelines. Some require physical visits. Your professional is city-specific - we do not assign a Bengaluru agent to a Delhi application."
    },
    {
      "icon": "alert",
      "title": "FSSAI inspection not scheduled",
      "body": "In some states, inspection officers are backlogged. The application sits pending inspection for weeks with no response. Ollvy follows up directly with the state FSSAI office and escalates to the District Officer if no inspection is scheduled within 14 days."
    }
  ]'::jsonb,
  -- profile_personas (4 personas)
  '[
    {
      "label": "Residential kitchen - society NOC issue",
      "detail": "Our client''s society refused to give an NOC. We drafted a legal notice format for the RWA, explained the FSSAI legal position, and resolved it within a week."
    },
    {
      "label": "Existing restaurant adding a cloud brand",
      "detail": "They already had FSSAI but it did not cover their new food categories. We filed a KoB modification, not a new license - saved them 30 days."
    },
    {
      "label": "FSSAI inspection failed first time",
      "detail": "Officer found the kitchen layout did not match the submitted drawing. We revised the layout document and secured re-inspection within 7 days."
    },
    {
      "label": "GST address different from kitchen address",
      "detail": "They''d registered GST for their home earlier. We filed an Additional Place of Business amendment so both addresses were covered under one GSTIN."
    }
  ]'::jsonb,
  -- faqs (5 FAQs)
  '[
    {
      "category": "Eligibility",
      "q": "My cloud kitchen is in a residential flat. Can I get FSSAI?",
      "a": "Yes. FSSAI registration is based on the premises where food is prepared, not the property''s zoning. Thousands of cloud kitchens in India operate from residential addresses. You need the flat''s utility bill and a NOC from your society or landlord. Ollvy provides the NOC template - the landlord just needs to sign it."
    },
    {
      "category": "GST",
      "q": "Do I need GST if my cloud kitchen earns under ₹40 lakh per year?",
      "a": "Yes, if you''re listing on Swiggy or Zomato. These platforms are classified as e-commerce operators under GST law and deduct 0.5% TCS from every payout. To claim that TCS credit back, you must file GST returns - and to file returns, you must be GST registered. There is no turnover threshold exemption for aggregator sellers."
    },
    {
      "category": "Process",
      "q": "Can I start taking orders while waiting for FSSAI?",
      "a": "No. Operating without FSSAI is an offence under the Food Safety and Standards Act, 2006. Swiggy and Zomato both require a valid FSSAI number before onboarding. You can use the application acknowledgment number as a reference internally, but formal operations and platform listing require the actual certificate."
    },
    {
      "category": "FSSAI",
      "q": "I have 3 brands - do I need 3 FSSAI licenses?",
      "a": "No. FSSAI is premises-based. All brands operating from the same kitchen are covered under one license, as long as their food categories are all listed under the license''s Kinds of Business (KoB). You list all brand names on the one certificate. If you open a second kitchen at a different address, that address needs its own license."
    },
    {
      "category": "Support",
      "q": "What if the FSSAI inspection officer has issues?",
      "a": "Ollvy sends you a pre-inspection checklist 7 days before the visit covering kitchen layout, cleanliness, labelling, and documentation. If the officer issues an improvement notice, we respond through the FoSCoS portal and schedule re-inspection. This is included in the pack - no additional charge."
    }
  ]'::jsonb,
  -- review_sources
  '[
    {
      "name": "FSSAI FoSCoS Portal",
      "url": "https://foscos.fssai.gov.in",
      "description": "Food licensing and registration portal"
    },
    {
      "name": "GST Portal",
      "url": "https://www.gst.gov.in",
      "description": "Official GST registration and filing"
    },
    {
      "name": "Food Safety and Standards Act, 2006",
      "url": "https://www.fssai.gov.in/cms/food-safety-and-standards-act-2006.php",
      "description": "FSSAI licensing requirements"
    }
  ]'::jsonb,
  -- unlocks
  '[
    {
      "name": "List on Swiggy and Zomato",
      "explanation": "Both platforms require FSSAI number during onboarding. Submit immediately after certificate is issued.",
      "price": "Free",
      "type": "required",
      "slug": ""
    },
    {
      "name": "GST Monthly Filing",
      "explanation": "Once GST is registered, monthly returns are due by the 20th. Missing one means TCS deducted by Swiggy stays stuck.",
      "price": "₹2,999/month",
      "type": "required",
      "slug": "gst-monthly-filing"
    },
    {
      "name": "Trademark Registration",
      "explanation": "Competitors can register your cloud kitchen brand name on Swiggy once you scale. File early.",
      "price": "₹14,999",
      "type": "beneficial",
      "slug": "trademark-word-mark"
    },
    {
      "name": "FSSAI Annual Return",
      "explanation": "FSSAI-licensed businesses must file an annual return every May 31. Penalty: ₹100/day for late filing.",
      "price": "₹2,999/yr",
      "type": "required",
      "slug": "fssai-annual-return"
    }
  ]'::jsonb,
  -- review_keyword_chips
  ARRAY['Quick', 'Transparent', 'Professional', 'No surprises', 'Single contact'],
  -- related_slugs
  ARRAY['fssai-license', 'gst-registration', 'trademark-word-mark'],
  -- show_completion_stats
  true,
  -- show_approval_rate
  true,
  -- variants (FSSAI Basic vs State)
  '[
    {
      "id": "fssai-basic",
      "label": "Under ₹12L/year",
      "sublabel": "FSSAI Basic Registration",
      "priceAdjustment": -1000000,
      "govtFeeAdjustment": -110000
    },
    {
      "id": "fssai-state",
      "label": "₹12L - ₹20Cr/year",
      "sublabel": "FSSAI State License",
      "priceAdjustment": 0,
      "govtFeeAdjustment": 0
    }
  ]'::jsonb,
  -- default_variant_id
  'fssai-state',
  -- comparison_without
  '[
    "Wrong FSSAI license type - Basic when State is needed. Swiggy rejects it on onboarding.",
    "GST registration at wrong address - GSTIN must match your kitchen address.",
    "FSSAI inspection failed - no prep. Dirty kitchen, missing layout, wrong documents.",
    "Missing Eating House License - Delhi requires police clearance separately.",
    "3 months of back and forth. No single point of contact."
  ]'::jsonb,
  -- comparison_with
  '[
    "Correct license type confirmed before filing. Turnover question determines Basic vs State.",
    "GST address cross-checked with FSSAI address. Both applications use the same address.",
    "Premises checklist sent before inspection. 7 days before: layout, cleanliness, document display.",
    "Eating House + Trade License both covered. City-specific requirements mapped.",
    "One professional, one WhatsApp. Direct contact throughout."
  ]'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  short_description = EXCLUDED.short_description,
  tagline = EXCLUDED.tagline,
  category = EXCLUDED.category,
  service_type = EXCLUDED.service_type,
  mandatory_for = EXCLUDED.mandatory_for,
  legal_basis = EXCLUDED.legal_basis,
  penalty_for_missing = EXCLUDED.penalty_for_missing,
  penalty_color = EXCLUDED.penalty_color,
  price_base_paisa = EXCLUDED.price_base_paisa,
  price_govt_fees_paisa = EXCLUDED.price_govt_fees_paisa,
  govt_fee_label = EXCLUDED.govt_fee_label,
  govt_fee_note = EXCLUDED.govt_fee_note,
  sla_working_days = EXCLUDED.sla_working_days,
  billing_cycle = EXCLUDED.billing_cycle,
  is_active = EXCLUDED.is_active,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  canonical_url = EXCLUDED.canonical_url,
  workflow_stages = EXCLUDED.workflow_stages,
  whats_included = EXCLUDED.whats_included,
  service_risks = EXCLUDED.service_risks,
  profile_personas = EXCLUDED.profile_personas,
  faqs = EXCLUDED.faqs,
  review_sources = EXCLUDED.review_sources,
  unlocks = EXCLUDED.unlocks,
  review_keyword_chips = EXCLUDED.review_keyword_chips,
  related_slugs = EXCLUDED.related_slugs,
  show_completion_stats = EXCLUDED.show_completion_stats,
  show_approval_rate = EXCLUDED.show_approval_rate,
  variants = EXCLUDED.variants,
  default_variant_id = EXCLUDED.default_variant_id,
  comparison_without = EXCLUDED.comparison_without,
  comparison_with = EXCLUDED.comparison_with;
