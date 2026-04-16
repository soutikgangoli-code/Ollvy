INSERT INTO service_packages (
  slug, name, short_name, short_description, tagline, category,
  service_type, mandatory_for, legal_basis, penalty_for_missing, penalty_color,
  price_base_paisa, price_govt_fees_paisa, govt_fee_label, govt_fee_note,
  sla_working_days, billing_cycle, is_active, display_order,
  seo_title, seo_description, canonical_url,
  workflow_stages, whats_included, service_risks, profile_personas, faqs,
  review_sources, unlocks, review_keyword_chips, related_slugs,
  scope_included, scope_excluded,
  show_completion_stats, show_approval_rate,
  comparison_without, comparison_with
) VALUES (
  'esop-structuring',
  'ESOP Structuring',
  'ESOP',
  'Complete ESOP scheme for your Pvt Ltd. Board resolution, shareholder approval, grant letters, vesting schedule, FMV valuation note - all in 7 working days.',
  'Give equity to the people building your company. ESOP scheme, board approval, grant letters - 7 working days.',
  'Legal',
  'One-time',
  'Pvt Ltd companies issuing stock options to employees, advisors, or consultants',
  'Companies Act 2013 (Section 62(1)(b)), Companies (Share Capital and Debentures) Rules 2014 (Rule 12), Income Tax Act (Section 17(2)(vi) perquisite valuation)',
  'No ESOP scheme = informal equity promises with no legal standing. Disputes on vesting, exercise price, and ownership surface at funding rounds when investors ask for the cap table.',
  'amber',
  999900,
  0,
  NULL,
  NULL,
  7,
  'one_time',
  true,
  16,
  'ESOP Structuring for Startups India | ₹9,999 | Ollvy',
  'Set up a legally compliant ESOP scheme for your Pvt Ltd in 7 working days. Includes scheme document, board and shareholder resolutions, grant letter templates, vesting schedule, and FMV valuation note. Rs 9,999 all-in.',
  'https://www.ollvy.com/services/esop-structuring',

  -- workflow_stages
  '[
    {
      "step": 1,
      "title": "Share your cap table and hiring plan",
      "timeline": "Day 0",
      "body": "Current shareholding pattern, number of employees/advisors getting options, and how much equity you want to allocate.\nOllvy CS assigned within 4 hours.\nIf you don''t have a cap table yet, Ollvy builds one from your incorporation documents.",
      "milestone": "Cap table confirmed, ESOP pool size decided",
      "visual": "upload"
    },
    {
      "step": 2,
      "title": "ESOP scheme drafted with vesting schedule",
      "timeline": "Day 1-3",
      "body": "Complete ESOP scheme document drafted under Section 62(1)(b) of the Companies Act.\nVesting schedule (typically 4-year with 1-year cliff).\nExercise price set based on FMV or discount structure.\nGrant letter templates for each role.",
      "milestone": "Draft ESOP scheme sent for your review",
      "visual": "form"
    },
    {
      "step": 3,
      "title": "Board resolution and shareholder approval",
      "timeline": "Day 3-5",
      "body": "Board resolution drafted and circulated for signing.\nSpecial resolution for shareholder approval (Section 62(1)(b) requires 75% majority).\nOllvy CS handles the notice, resolution text, and e-voting or written consent process.",
      "milestone": "Board and shareholder resolutions passed",
      "visual": "stamp"
    },
    {
      "step": 4,
      "title": "Grant letters issued + FMV valuation note delivered",
      "timeline": "Day 5-7",
      "body": "Individual grant letters generated for each employee/advisor.\nFMV valuation note documenting the exercise price basis.\nTax implications summary for employees (Section 17(2)(vi) perquisite, capital gains on sale).\nAll documents uploaded to your Ollvy account.",
      "milestone": "ESOP scheme live, grant letters ready to issue",
      "isCompletion": true,
      "visual": "stamp"
    }
  ]'::jsonb,

  -- whats_included
  '[
    {
      "title": "ESOP scheme document - not a template",
      "body": "Drafted for your specific cap table, vesting structure, and employee roles.\nCovers: eligibility, pool size, vesting schedule, exercise price, exercise window, termination clauses, and transfer restrictions.",
      "comparisonWithout": "Generic template from the internet - missing cliff, bad on termination, silent on tax",
      "comparisonWithOllvy": "Custom scheme reflecting your cap table, roles, and funding stage"
    },
    {
      "title": "Board resolution + shareholder special resolution",
      "body": "Section 62(1)(b) requires a special resolution (75% majority) before any ESOP can be granted.\nOllvy CS drafts both resolutions, handles notice period (21 days for postal ballot or shorter for written consent), and files with MCA if required.",
      "comparisonWithout": "Missed shareholder approval - entire ESOP scheme is void, discovered at due diligence",
      "comparisonWithOllvy": "Both resolutions passed and documented before any grants are made"
    },
    {
      "title": "Grant letter templates for each role",
      "body": "Individual grant letters specifying: number of options, exercise price, vesting start date, vesting schedule, cliff period, and exercise window after vesting.\nOne template per role category (employee, advisor, consultant).",
      "comparisonWithout": "Verbal promise of equity - no legal standing, disputes at exit",
      "comparisonWithOllvy": "Signed grant letters with specific terms for each person"
    },
    {
      "title": "Vesting schedule with cliff",
      "body": "Standard 4-year vesting with 1-year cliff, or custom schedule based on your preference.\nMonthly or quarterly vesting after cliff.\nAcceleration clauses for acquisition or IPO if needed.",
      "comparisonWithout": "No cliff - employee leaves after 3 months with 25% of their options",
      "comparisonWithOllvy": "1-year cliff protects you. Monthly vesting after that rewards loyalty."
    },
    {
      "title": "FMV valuation note",
      "body": "Fair Market Value of shares documented at the time of grant.\nBasis for exercise price (at FMV, at discount, or at nominal value).\nRequired for tax computation when employee exercises options (Section 17(2)(vi)).",
      "comparisonWithout": "No valuation record - tax officer disputes the exercise price years later",
      "comparisonWithOllvy": "FMV documented at grant date. Clean record for future tax events."
    },
    {
      "title": "Employee tax implications summary",
      "body": "One-page summary explaining when tax applies (at exercise, not at grant), how perquisite value is calculated (FMV at exercise minus exercise price), and capital gains treatment on eventual sale.\nGiven to each employee alongside their grant letter.",
      "comparisonWithout": "Employee blindsided by tax bill at exercise - blames the company",
      "comparisonWithOllvy": "Employee understands the tax timeline before signing the grant letter"
    }
  ]'::jsonb,

  -- service_risks
  '[
    {
      "icon": "alert",
      "title": "Shareholder resolution not passed before granting",
      "body": "Section 62(1)(b) of the Companies Act requires a special resolution (75% majority) before any ESOP can be granted.\nGranting options without this resolution makes the entire scheme void.\nInvestors catch this during due diligence - it delays funding rounds by 4-8 weeks while you redo everything."
    },
    {
      "icon": "clock",
      "title": "No FMV record at grant date",
      "body": "The Income Tax Act taxes ESOPs as a perquisite at exercise (Section 17(2)(vi)).\nThe taxable amount = FMV at exercise minus exercise price.\nIf you have no FMV record from the grant date, the tax officer can dispute your exercise price.\nOllvy documents FMV at the time of each grant."
    },
    {
      "icon": "document",
      "title": "Vesting terms not in writing",
      "body": "Verbal equity promises are unenforceable.\nWithout signed grant letters specifying vesting schedule, cliff, and exercise window, an employee who leaves can claim they were promised more.\nThis surfaces at the worst time - during a funding round or an exit."
    },
    {
      "icon": "building",
      "title": "ESOP pool too small or too large",
      "body": "Too small: you run out of options before your Series A and need shareholder approval again to expand the pool.\nToo large: investors see unnecessary dilution.\nTypical ESOP pool: 10-15% pre-Series A.\nOllvy reviews your hiring plan and funding timeline before recommending pool size."
    }
  ]'::jsonb,

  -- profile_personas
  '[
    {
      "label": "First ESOP scheme - hiring a CTO with equity",
      "detail": "Never done this before. Ollvy explains the structure, drafts the scheme, and issues the first grant letter - all in 7 days."
    },
    {
      "label": "Pre-funding cleanup - investor due diligence",
      "detail": "Promised equity to 5 people informally. Need to formalise before the term sheet. Ollvy backdates the scheme to the original promise dates where legally possible."
    },
    {
      "label": "Expanding the ESOP pool",
      "detail": "Existing scheme but the pool is exhausted. Need a fresh shareholder resolution to increase the pool before the next hiring round."
    },
    {
      "label": "Advisor ESOP - non-employee grants",
      "detail": "Granting options to advisors or consultants. Different vesting terms, different exercise window. Ollvy drafts advisor-specific grant letters."
    }
  ]'::jsonb,

  -- faqs
  '[
    {
      "category": "General",
      "q": "What is an ESOP and why does my startup need one?",
      "a": "An ESOP (Employee Stock Option Plan) gives employees the right to buy shares in your company at a fixed price after a vesting period. It is the standard way startups attract and retain talent without burning cash on salaries. Every serious investor expects a formal ESOP scheme before funding. Without one, equity promises are legally unenforceable."
    },
    {
      "category": "General",
      "q": "How many shares should I put in the ESOP pool?",
      "a": "10-15% of total equity pre-Series A is standard. If you are pre-revenue and hiring a technical co-founder equivalent, 15% gives you room. If you have a full team already, 10% is enough for future hires. Ollvy reviews your cap table and hiring plan before recommending the pool size."
    },
    {
      "category": "Process",
      "q": "What approvals are needed to set up an ESOP?",
      "a": "Two approvals. First, a board resolution approving the ESOP scheme. Second, a special resolution passed by shareholders with 75% majority (Section 62(1)(b) of the Companies Act). Ollvy CS handles both - drafts the resolutions, manages the notice period, and gets them signed."
    },
    {
      "category": "Process",
      "q": "What is a vesting schedule and what is a cliff?",
      "a": "Vesting is the timeline over which an employee earns their options. Standard is 4 years. A cliff is a minimum period before any options vest - typically 1 year. If the employee leaves before the cliff, they get nothing. After the cliff, options vest monthly or quarterly. This protects you from early departures."
    },
    {
      "category": "Tax",
      "q": "When do employees pay tax on ESOPs?",
      "a": "Tax applies at two points. First, when the employee exercises the option (buys the shares): the difference between FMV at exercise and the exercise price is taxed as a perquisite under Section 17(2)(vi) - added to their salary income for that year. Second, when they sell the shares: capital gains tax applies on the difference between sale price and FMV at exercise. No tax at grant or during vesting."
    },
    {
      "category": "Tax",
      "q": "What is FMV and why does it matter for ESOPs?",
      "a": "Fair Market Value is the assessed value of one share at a given date. For unlisted companies, FMV is determined by a registered valuer using DCF or NAV method. FMV matters because it determines: (1) the exercise price you offer, (2) the taxable perquisite when the employee exercises, and (3) the capital gains base when they sell. Ollvy provides an FMV valuation note at the time of grant."
    },
    {
      "category": "Documents",
      "q": "What documents do I need to provide?",
      "a": "Certificate of Incorporation, current shareholding pattern (Form MGT-7 or share register extract), Articles of Association, and a list of employees/advisors who will receive grants with their roles and proposed option counts. If you do not have a cap table, Ollvy builds one from your incorporation documents."
    },
    {
      "category": "After Completion",
      "q": "What happens after the ESOP scheme is set up?",
      "a": "You issue grant letters to each employee. They sign and return. Options vest per the schedule. When an employee wants to exercise (buy the shares), you process the exercise at the exercise price, allot shares, file PAS-3 with MCA, and update the share register. Ollvy can handle exercise processing as a separate engagement when the time comes."
    }
  ]'::jsonb,

  -- review_sources
  '[
    {
      "name": "Companies Act 2013 - Section 62(1)(b)",
      "url": "https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/acts.html",
      "description": "Legal basis for ESOP issuance by private companies"
    },
    {
      "name": "Companies (Share Capital and Debentures) Rules, 2014 - Rule 12",
      "url": "https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/rules.html",
      "description": "Procedural requirements for ESOP schemes"
    },
    {
      "name": "Income Tax Act - Section 17(2)(vi)",
      "url": "https://incometaxindia.gov.in/Pages/acts/income-tax-act.aspx",
      "description": "ESOP perquisite taxation at exercise"
    }
  ]'::jsonb,

  -- unlocks
  '[
    {
      "name": "Business ITR Filing",
      "slug": "business-itr",
      "type": "required",
      "price": "₹4,999",
      "explanation": "ESOP grants and exercises must be disclosed in the company ITR. Perquisite TDS on exercise needs reconciliation."
    },
    {
      "name": "MCA Annual Filing",
      "slug": "mca-annual-filing",
      "type": "required",
      "price": "₹3,599",
      "explanation": "Share allotment on exercise requires PAS-3 filing with MCA within 30 days."
    }
  ]'::jsonb,

  -- review_keyword_chips
  ARRAY['Clean cap table', 'Investor-ready', 'Tax-compliant', 'Custom scheme', '7-day delivery'],

  -- related_slugs
  ARRAY['pvt-ltd-incorporation', 'business-itr', 'mca-annual-filing', 'trademark-registration'],

  -- scope_included (renders as "What's Included" on checkout page)
  ARRAY[
    'Complete ESOP scheme document drafted for your cap table',
    'Board resolution for ESOP approval',
    'Shareholder special resolution under Section 62(1)(b)',
    'Grant letter templates (employee, advisor, consultant)',
    'Vesting schedule with cliff period',
    'FMV valuation note at grant date',
    'Employee tax implications summary',
    'Exercise price recommendation',
    'Cap table review and ESOP pool sizing'
  ],

  -- scope_excluded (renders as "What's Not Included" on checkout page)
  ARRAY[
    'Registered valuer certification (separate engagement if investor requires formal 409A-equivalent)',
    'Share allotment on exercise (PAS-3 filing - handled as separate order when employees exercise)',
    'Annual ESOP disclosure in board report (covered under MCA Annual Filing service)',
    'Tax return filing for employees (individual ITR is separate)'
  ],

  -- show_completion_stats
  false,
  -- show_approval_rate
  false,

  -- comparison_without
  '[
    "Verbal equity promise - no legal standing. Employee disputes it at exit.",
    "No shareholder resolution - entire scheme is void. Discovered during Series A due diligence.",
    "No FMV record - tax officer disputes exercise price years later. Employee faces unexpected tax bill.",
    "Generic template - missing cliff period. Employee leaves after 3 months with 25% of options.",
    "No grant letters - 5 people think they own different amounts of your company."
  ]'::jsonb,

  -- comparison_with
  '[
    "Signed grant letters with specific terms for each person. Legally enforceable.",
    "Board + shareholder resolutions passed and documented before any grants.",
    "FMV valuation note at grant date. Clean record for all future tax events.",
    "1-year cliff standard. Monthly vesting after that. Customised to your hiring plan.",
    "Complete scheme document covering eligibility, exercise window, termination, and transfer restrictions."
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
  scope_included = EXCLUDED.scope_included,
  scope_excluded = EXCLUDED.scope_excluded,
  show_completion_stats = EXCLUDED.show_completion_stats,
  show_approval_rate = EXCLUDED.show_approval_rate,
  comparison_without = EXCLUDED.comparison_without,
  comparison_with = EXCLUDED.comparison_with;

-- =============================================================================
-- ESOP Structuring Post-Payment Questionnaire
-- =============================================================================

DO $$
DECLARE
  service_id UUID;
BEGIN
  SELECT id INTO service_id FROM service_packages WHERE slug = 'esop-structuring' LIMIT 1;

  IF service_id IS NOT NULL THEN
    DELETE FROM service_questionnaires WHERE service_package_id = service_id;

    -- Step 1: Company Details (4 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (service_id, 'company_name', 'Company name', 'text', NULL, '{"required": true}'::jsonb, 'Registered company name', 'As per Certificate of Incorporation.', 1, 1),
    (service_id, 'company_cin', 'CIN number', 'text', NULL, '{"required": true, "pattern": "^[A-Z][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$"}'::jsonb, 'U12345AB1234ABC123456', 'Find this on your Certificate of Incorporation or MCA portal.', 1, 2),
    (service_id, 'current_shareholders', 'Number of current shareholders', 'number', NULL, '{"required": true, "min": 1}'::jsonb, '2', 'Total shareholders as per latest share register.', 1, 3),
    (service_id, 'total_shares', 'Total issued shares', 'number', NULL, '{"required": true, "min": 1}'::jsonb, '10000', 'Total number of shares currently issued. Check your share register or Form MGT-7.', 1, 4);

    -- Step 2: ESOP Plan Details (5 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (service_id, 'esop_pool_pct', 'ESOP pool size you want (% of total equity)', 'select', '[
      {"value": "5", "label": "5%"},
      {"value": "10", "label": "10% (Common for early-stage)"},
      {"value": "15", "label": "15% (Common pre-Series A)"},
      {"value": "20", "label": "20%"},
      {"value": "unsure", "label": "Not sure - need Ollvy to recommend"}
    ]'::jsonb, '{"required": true}'::jsonb, NULL, 'Typical ESOP pool is 10-15% pre-Series A. Ollvy will recommend based on your hiring plan.', 2, 1),
    (service_id, 'num_recipients', 'How many people will receive ESOPs?', 'number', NULL, '{"required": true, "min": 1}'::jsonb, '3', 'Employees, advisors, or consultants who will get grant letters.', 2, 2),
    (service_id, 'recipient_details', 'List of recipients with roles and proposed option counts', 'textarea', NULL, '{"required": false}'::jsonb, 'e.g. Rajesh (CTO) - 2%, Priya (VP Eng) - 1%, Advisor - 0.5%', 'One per line. If unsure about allocation, Ollvy will help you decide.', 2, 3),
    (service_id, 'vesting_preference', 'Preferred vesting schedule', 'select', '[
      {"value": "4y_1y_cliff", "label": "4 years with 1-year cliff (Standard)"},
      {"value": "3y_1y_cliff", "label": "3 years with 1-year cliff"},
      {"value": "4y_no_cliff", "label": "4 years, no cliff"},
      {"value": "custom", "label": "Custom - I will specify"}
    ]'::jsonb, '{"required": true}'::jsonb, NULL, '4-year vesting with 1-year cliff is industry standard. The cliff means employees get nothing if they leave before 1 year.', 2, 4),
    (service_id, 'funding_stage', 'Current funding stage', 'select', '[
      {"value": "bootstrapped", "label": "Bootstrapped / Self-funded"},
      {"value": "angel", "label": "Angel funded"},
      {"value": "pre_seed", "label": "Pre-seed"},
      {"value": "seed", "label": "Seed"},
      {"value": "series_a_plus", "label": "Series A or later"}
    ]'::jsonb, '{"required": true}'::jsonb, NULL, 'This helps Ollvy set the right exercise price and pool size. Post-funding ESOPs have different valuation considerations.', 2, 5);

    -- Step 3: Additional Info (2 questions)
    INSERT INTO service_questionnaires (service_package_id, question_key, question_label, question_type, options, validation, placeholder, help_text, step_number, display_order)
    VALUES
    (service_id, 'has_existing_esop', 'Do you have an existing ESOP scheme?', 'radio', '[
      {"value": "no", "label": "No - this is our first ESOP"},
      {"value": "yes_informal", "label": "Yes, but informal (verbal promises, no documents)"},
      {"value": "yes_formal", "label": "Yes, formal scheme exists but needs restructuring"}
    ]'::jsonb, '{"required": true}'::jsonb, NULL, 'If you have informal promises, Ollvy will formalise them into the new scheme.', 3, 1),
    (service_id, 'additional_notes', 'Anything else Ollvy should know?', 'textarea', NULL, '{"required": false}'::jsonb, 'Special clauses, accelerated vesting on exit, advisor-specific terms...', 'Any specific requirements for your ESOP scheme.', 3, 2);

  END IF;
END $$;

-- =============================================================================
-- ESOP Structuring Document Templates
-- =============================================================================

INSERT INTO service_document_templates (service_package_id, document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
SELECT
  sp.id,
  dt.document_key,
  dt.document_label,
  dt.description,
  dt.stage_key,
  dt.is_required,
  dt.display_order,
  dt.tips,
  dt.template_url
FROM service_packages sp
CROSS JOIN (VALUES
  ('coi', 'Certificate of Incorporation', 'Confirms Pvt Ltd status and CIN', 'doc_collection', true, 1, ARRAY['Must be a Pvt Ltd company - LLPs cannot issue ESOPs', 'CIN number should match what you entered'], NULL),
  ('aoa', 'Articles of Association (AOA)', 'Checked for share transfer restrictions', 'doc_collection', true, 2, ARRAY['Latest version including any amendments', 'Check if AOA has any ESOP-related clauses already'], NULL),
  ('shareholding_pattern', 'Current Shareholding Pattern', 'Form MGT-7 extract or share register', 'doc_collection', true, 3, ARRAY['Latest annual return or share register extract', 'Should show all shareholders with share counts'], NULL),
  ('cap_table', 'Cap Table', 'Equity split showing all shareholders, SAFEs, convertible notes', 'doc_collection', false, 4, ARRAY['If you don''t have one, Ollvy builds it from incorporation docs', 'Include any SAFEs or convertible notes if applicable'], NULL),
  ('recipient_list', 'List of ESOP Recipients', 'Names, roles, designations, start dates', 'doc_collection', true, 5, ARRAY['Include everyone who will receive options', 'Mention if anyone is an advisor vs full-time employee'], NULL),
  ('valuation_report', 'Latest Valuation Report', 'If available - used for FMV baseline', 'doc_collection', false, 6, ARRAY['Not mandatory - Ollvy prepares FMV note if not available', 'If you have a recent 409A or FMV report from a funding round, upload it'], NULL),
  ('board_minutes', 'Latest Board Meeting Minutes', 'For reference - to confirm current board composition', 'doc_collection', false, 7, ARRAY['Most recent board meeting minutes', 'Helps confirm who signs the board resolution'], NULL)
) AS dt(document_key, document_label, description, stage_key, is_required, display_order, tips, template_url)
WHERE sp.slug = 'esop-structuring'
ON CONFLICT (service_package_id, document_key) DO UPDATE SET
  document_label = EXCLUDED.document_label,
  description = EXCLUDED.description,
  stage_key = EXCLUDED.stage_key,
  is_required = EXCLUDED.is_required,
  display_order = EXCLUDED.display_order,
  tips = EXCLUDED.tips,
  template_url = EXCLUDED.template_url;
