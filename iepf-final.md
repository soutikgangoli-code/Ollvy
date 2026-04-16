# IEPF Claim Consultation — Complete Service Content
# Every field written. No placeholders. Paste directly into the files listed.
# Slug: iepf-consultation | Price: Rs.500 | MRP: Rs.2,000 | SLA: 2 working days

---

## PIECE A — DATABASE MIGRATION SQL
## GOES INTO: supabase/migrations/20260414120000_add_iepf_consultation.sql

```sql
INSERT INTO service_packages (
  slug, name, short_name, short_description, tagline, category,
  price_base_paisa, price_govt_fees_paisa, price_mrp_paisa, price_gst_rate,
  sla_working_days, billing_cycle, order_type, is_active, display_order, urgency_score,
  service_type, mandatory_for, legal_basis, penalty_for_missing, penalty_color,
  has_govt_processing, completion_min_days, completion_max_days, completion_range_text,
  scope_included, scope_excluded, deliverables,
  seo_title, seo_description, canonical_url,
  show_completion_stats, show_approval_rate,
  service_explainer, workflow_stages, whats_included, service_risks,
  profile_personas, faqs, review_sources, unlocks,
  review_keyword_chips, related_slugs
) VALUES (
  'iepf-consultation',
  'IEPF Claim Consultation',
  'IEPF',
  'Expert checks what unclaimed shares or dividends are sitting in IEPF under your name. Tells you what is claimable and how to get it back.',
  'Old shares, unclaimed dividends, inherited investments. Find out what you have and exactly how to claim it.',
  'Legal',

  50000,    -- Rs.500 in paisa
  0,        -- no government fee
  200000,   -- Rs.2,000 MRP strikethrough in paisa
  18,

  2,
  'one_time',
  'one_time',
  true,
  42,
  55,

  'One-time',
  'Anyone whose shares or dividends were transferred to IEPF after 7 years of no activity on the account',
  'Companies Act 2013, Sections 124 and 125; IEPF Authority (Accounting, Audit, Transfer and Refund) Rules, 2016',
  'No penalty for delay in claiming. But unclaimed money stays in the government fund indefinitely, and inherited claims get harder as paper trails grow.',
  'amber',

  false,
  1,
  2,
  'Our expert will call you within 2 working days of payment.',

  ARRAY[
    'IEPF database check to confirm what is in your name',
    '45-minute consultation call with an IEPF expert',
    'Personalised IEPF-5 document checklist for your case type',
    'Written action plan with next steps and realistic timeline'
  ],

  ARRAY[
    'Filing Form IEPF-5 on your behalf',
    'Legal heir certificate or succession certificate processing',
    'Share transmission from physical to demat form',
    'Any work after the consultation call is complete'
  ],

  '["IEPF balance verification", "Personalised IEPF-5 document checklist", "Written action plan"]'::jsonb,

  'IEPF Claim Consultation India — Unclaimed Shares and Dividends | Rs.500 | Ollvy',
  'Shares in IEPF? Old dividends unclaimed? Expert finds what is there and tells you exactly how to claim it back. Rs.500 flat, consultation in 2 days.',
  'https://www.ollvy.com/services/iepf-consultation',

  false,
  false,

  '{"steps":[{"step":1,"title":"What IEPF is","visual":"info","body":"IEPF stands for Investor Education and Protection Fund. Under the Companies Act 2013, if a shareholder does not collect dividends for 7 consecutive years, the company must transfer those dividends to this government fund. The shares on which those dividends went unclaimed are transferred alongside them. The money does not disappear permanently, but recovering it requires filing a formal claim through Form IEPF-5 — which goes through the company and then the government authority."},{"step":2,"title":"Why this consultation exists","visual":"sparkles","body":"Most people who contact us do not know whether their shares are actually in IEPF, how much is there, or what the process looks like for their case. A direct claim by the original investor is completely different from a legal heir claim. Physical share certificates have different requirements than demat holdings. This consultation answers all of it before you spend weeks filing paperwork that turns out to be wrong."},{"step":3,"title":"What happens if you wait","visual":"alert","body":"There is no deadline to claim from IEPF. But the paperwork gets harder over time. Companies change their RTAs. Physical certificates deteriorate. If the original investor has passed away, each year without action adds documents to the legal heir process. Starting with a clear picture now costs Rs.500 and takes 2 days."}]}'::jsonb,

  '[{"step":1,"title":"Tell us about your case","timeline":"Day 0","visual":"checklist","body":"Company name, approximate year of investment, folio number if you have it\nPhysical share certificates, old dividend warrants, or any company letters that exist\nNo documents needed upfront. What you remember is enough to start.\nInherited shares? Give us the original holder name and PAN if available.","milestone":"Brief received. Expert assigned."},{"step":2,"title":"Expert checks the IEPF database","timeline":"Day 0-1","visual":"form","body":"Expert searches iepf.gov.in and MCA21 using your PAN, name, and company details\nConfirms exactly which shares and dividend amounts are credited in IEPF under your name\nChecks whether the company RTA has flagged any objections on the account\nSome people find more than they expected. Some find nothing — and that clarity saves months of misdirected effort.","milestone":"IEPF balance confirmed"},{"step":3,"title":"45-minute consultation call","timeline":"Day 1-2","visual":"calendar","body":"Scheduled at a time that suits you\nCovers: what is claimable, what Form IEPF-5 looks like for your specific case, which documents you need\nLegal heir claim? Expert explains that process separately — it has different requirements from a direct claim\nYou ask whatever you need to. Straight answers.","milestone":"Consultation complete"},{"step":4,"title":"Written action plan in your order page","timeline":"Day 2","visual":"stamp","isCompletion":true,"body":"Written summary of everything covered on the call\nPersonalised IEPF-5 document checklist specific to your case, not the standard 18-item government list\nRealistic timeline for the full claim once you file IEPF-5 (typically 60 to 90 days)","milestone":"Action plan delivered"}]'::jsonb,

  '[{"title":"IEPF database check — what is actually there under your name","body":"Expert searches iepf.gov.in and MCA21 using your PAN and company details\nTells you the exact shares and dividend amounts credited in IEPF under your name\nStops you from starting a claim for money that was never transferred to IEPF in the first place","comparisonWithout":"Hours across iepf.gov.in, MCA21, and the company RTA. No guarantee of finding the right record.","comparisonWithOllvy":"Expert confirms what is there in under 24 hours before the call.","mockVisualType":"status","mockVisualData":{"label":"IEPF Credit Verification","row1":"500 equity shares — confirmed in IEPF","row2":"Unclaimed dividends: Rs.14,200 across 6 years","row3":"Company RTA: no objection on record","note":"Verified against MCA21 and iepf.gov.in"}},{"title":"45-minute expert call — your case, not a script","body":"Expert who has handled IEPF claims walks through Form IEPF-5 for your specific situation\nSimple case (original investor, active demat, PAN linked): expert tells you that and what to do next\nComplex case (physical certificates, deceased original investor, multiple companies): every step mapped out\nNo generic walkthrough. Only what is relevant to you."},{"title":"Personalised document checklist for your case","body":"IEPF-5 needs completely different documents depending on: whether the original holder is living or deceased, whether shares are physical or demat, whether you are the original investor or a legal heir\nThe government checklist has 18 items written for lawyers\nYours has 5 to 9 items, each explained in plain language","mockVisualType":"checklist","mockVisualData":{"label":"Your IEPF-5 Document List","row1":"PAN card — self-attested copy","row2":"Aadhaar card — for address verification","row3":"Cancelled cheque — account where refund lands","note":"8 documents total. Each one explained on the call."}},{"title":"Honest timeline and complexity assessment before you commit","body":"Expert tells you upfront if your case has complications and exactly what those are\nYou leave the call knowing whether to file yourself, hire someone to file, or complete a prior step first\nIEPF claims take 60 to 90 days after IEPF-5 is filed. Expert tells you where your company falls on that range."}]'::jsonb,

  '[{"icon":"document","title":"IEPF-5 rejected for a data mismatch","body":"Form IEPF-5 requires folio number, DP ID, client ID, and company CIN — all matching government records exactly\nOne mismatch causes rejection at the company RTA stage, which you find out about 4 to 6 weeks after submitting\nThe consultation covers every required field before you file anything"},{"icon":"mismatch","title":"PAN not linked to the folio","body":"IEPF credits are matched against PAN. If the original shareholder PAN is not linked to the folio, the claim stalls at the company stage\nFor inherited claims: your PAN must match the legal heir documents submitted to the company RTA\nChecked during the consultation, not after you have already waited 60 days"},{"icon":"building","title":"Legal heirs filing before completing share transmission","body":"If shares are in physical form, they must be transmitted into your name first — before IEPF-5 is filed\nFiling IEPF-5 before completing transmission is the most common and costly mistake in inherited share claims\nThe consultation tells you whether transmission is a required first step for your case"},{"icon":"alert","title":"Physical certificates add requirements most people miss","body":"Physical share certificates require an affidavit and indemnity bond on top of standard documents\nIf the certificate is lost, you need a duplicate from the company RTA — a separate process with its own timeline\nThe consultation flags this early so you know what you are getting into"}]'::jsonb,

  '[{"label":"Found old share certificates at home","detail":"Physical certificates from the 1990s or early 2000s. Not sure if the company still exists in the same form, whether shares went to IEPF, or how to start."},{"label":"Inherited shares after a parent passed away","detail":"Shares existed in a parent name. Formal transmission never happened. The IEPF process for legal heirs has extra steps most people miss."},{"label":"Received a company letter about IEPF","detail":"The company sent notice that dividends have been or will be transferred to IEPF. You want to know what this means and whether to act now."},{"label":"NRI with old Indian investments","detail":"You or your parents held shares in Indian companies before moving abroad. Dividends likely went unclaimed for years and may now be in IEPF."}]'::jsonb,

  '[{"category":"General","q":"What is IEPF and how did my shares end up there?","a":"IEPF stands for Investor Education and Protection Fund, created under the Companies Act 2013. If dividends on a shareholder account go unclaimed for 7 consecutive years, the company must transfer those dividends to IEPF. The shares on which those dividends went unclaimed are transferred alongside. This happens automatically. Most shareholders find out only when looking for old investments or receiving a company notice."},{"category":"General","q":"How do I check if my shares or dividends are in IEPF?","a":"You can search on iepf.gov.in using the company CIN and folio number, or on MCA21. Most people search and find nothing — not because there is nothing, but because the search needs precise inputs that are easy to get wrong. The consultation includes running this search correctly on your behalf."},{"category":"General","q":"Can I get the money back after it has been transferred to IEPF?","a":"Yes. Transfer to IEPF is not forfeiture. You can file Form IEPF-5 at any time — there is no deadline. The refund process takes 60 to 90 days from the date you submit a complete application."},{"category":"General","q":"Do I get the shares back, or just the dividend money?","a":"Both. A single IEPF-5 application covers the shares and all accumulated unclaimed dividends together. Shares are credited back to your demat account. Dividends are refunded as cash to your bank account."},{"category":"Process","q":"What does the Rs.500 consultation cover?","a":"Expert checks what is in IEPF under your name, then does a 45-minute call covering your case — what is claimable, what Form IEPF-5 involves for you, which documents you need, and what the realistic timeline is. You receive a written action plan and a personalised document checklist afterward. Filing IEPF-5 is a separate service."},{"category":"Process","q":"What is Form IEPF-5 and how does it work?","a":"IEPF-5 is the government claim form filed on the MCA21 portal by the shareholder or their legal heir. After submitting online, you print the acknowledgement and courier physical documents to the company Nodal Officer. The company verifies the documents and forwards the verified claim to IEPF Authority, which processes the share and dividend refund."},{"category":"Process","q":"How long does the full IEPF claim take start to finish?","a":"From the day you file IEPF-5: 60 to 90 days if the company RTA is responsive. Some companies are slower. Physical certificate claims and legal heir claims typically take longer than demat claims by the original investor. The consultation tells you where your case is likely to fall."},{"category":"Documents","q":"What documents does IEPF-5 require?","a":"Depends on your case. Original investor with active demat: PAN card, Aadhaar, cancelled cheque, and client master report from your broker. Physical shares: add the original share certificate, an affidavit, and an indemnity bond. Legal heir claim: add death certificate, legal heirship or succession certificate, and transmission documents. The consultation produces the exact list for your case."},{"category":"Documents","q":"I cannot find the original share certificate. Can I still claim?","a":"Possibly. If shares are recorded in IEPF, they exist as a government entry regardless of the physical certificate. Many company RTAs accept an indemnity bond in lieu of the original certificate. Whether this applies to your company is one of the things the consultation will tell you."},{"category":"Pricing","q":"Is there a government fee to file IEPF-5?","a":"No. Filing IEPF-5 and claiming from IEPF is free of government fees. Case-specific costs can arise — court fees for a succession certificate if needed, or stamp duty on an indemnity bond if the original certificate is lost. The consultation tells you which of these, if any, apply."},{"category":"Pricing","q":"What is the difference between this consultation and the full IEPF filing service?","a":"This consultation tells you what is claimable and what the process looks like for your case. You leave with a document checklist and action plan. Filing Form IEPF-5, coordinating with the company Nodal Officer, and following up with IEPF Authority is a longer engagement handled after the consultation."}]'::jsonb,

  '[{"name":"IEPF Authority","url":"https://www.iepf.gov.in","description":"Official government portal for IEPF claims. IEPF-5 filing, credit search by PAN and company CIN, and refund status."},{"name":"Companies Act 2013 — Sections 124 and 125","url":"https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/acts.html","description":"Section 124: Transfer of unpaid dividends and shares to IEPF. Section 125: IEPF Authority and refund procedure."},{"name":"IEPF Authority Rules, 2016","url":"https://www.iepf.gov.in/IEPF/docs/IEPF_Rules.pdf","description":"Accounting, Audit, Transfer and Refund Rules governing Form IEPF-5, required documents, and processing timeline."},{"name":"MCA21 Portal","url":"https://www.mca.gov.in","description":"Company CIN lookup, IEPF credit search, and Form IEPF-5 online filing."}]'::jsonb,

  '[]'::jsonb,

  '["✓ Found shares we had forgotten about","✓ Expert explained it without jargon","✓ Got the document list same day","✓ Inheritance process explained clearly","✓ Worth every rupee"]'::jsonb,

  '["gst-registration","trademark-registration","pvt-ltd-incorporation"]'::jsonb

) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  short_description = EXCLUDED.short_description,
  tagline = EXCLUDED.tagline,
  category = EXCLUDED.category,
  price_base_paisa = EXCLUDED.price_base_paisa,
  price_govt_fees_paisa = EXCLUDED.price_govt_fees_paisa,
  price_mrp_paisa = EXCLUDED.price_mrp_paisa,
  price_gst_rate = EXCLUDED.price_gst_rate,
  sla_working_days = EXCLUDED.sla_working_days,
  billing_cycle = EXCLUDED.billing_cycle,
  order_type = EXCLUDED.order_type,
  is_active = EXCLUDED.is_active,
  display_order = EXCLUDED.display_order,
  urgency_score = EXCLUDED.urgency_score,
  service_type = EXCLUDED.service_type,
  mandatory_for = EXCLUDED.mandatory_for,
  legal_basis = EXCLUDED.legal_basis,
  penalty_for_missing = EXCLUDED.penalty_for_missing,
  penalty_color = EXCLUDED.penalty_color,
  has_govt_processing = EXCLUDED.has_govt_processing,
  completion_min_days = EXCLUDED.completion_min_days,
  completion_max_days = EXCLUDED.completion_max_days,
  completion_range_text = EXCLUDED.completion_range_text,
  scope_included = EXCLUDED.scope_included,
  scope_excluded = EXCLUDED.scope_excluded,
  deliverables = EXCLUDED.deliverables,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  canonical_url = EXCLUDED.canonical_url,
  show_completion_stats = EXCLUDED.show_completion_stats,
  show_approval_rate = EXCLUDED.show_approval_rate,
  service_explainer = EXCLUDED.service_explainer,
  workflow_stages = EXCLUDED.workflow_stages,
  whats_included = EXCLUDED.whats_included,
  service_risks = EXCLUDED.service_risks,
  profile_personas = EXCLUDED.profile_personas,
  faqs = EXCLUDED.faqs,
  review_sources = EXCLUDED.review_sources,
  unlocks = EXCLUDED.unlocks,
  review_keyword_chips = EXCLUDED.review_keyword_chips,
  related_slugs = EXCLUDED.related_slugs,
  updated_at = now();


-- PRE-PAYMENT QUESTIONNAIRE
-- 3 questions, step_number=1, context only, price stays Rs.500 regardless of answers
-- Shown at /checkout/{serviceId}/eligibility before payment

DO $$
DECLARE
  svc_id UUID;
BEGIN
  SELECT id INTO svc_id FROM service_packages WHERE slug = 'iepf-consultation';

  -- Q1: Situation type — primary routing signal for the expert
  INSERT INTO service_questionnaires (
    service_package_id, question_key, question_label, question_type,
    options, validation, help_text, step_number, display_order, is_active
  ) VALUES (
    svc_id,
    'situation_type',
    'What best describes your situation?',
    'radio',
    '[
      {"value":"found_certificates","label":"Found old share certificates at home"},
      {"value":"inherited","label":"Inherited shares or investments from a family member who has passed away"},
      {"value":"received_notice","label":"Got a letter from a company saying shares were transferred to IEPF"},
      {"value":"nri","label":"NRI — old Indian investments, dividends unclaimed for years"},
      {"value":"other","label":"Something else"}
    ]'::jsonb,
    '{"required":true}'::jsonb,
    'Helps the expert prepare before your call. Does not affect the price.',
    1, 1, true
  ) ON CONFLICT (service_package_id, question_key) DO UPDATE
    SET question_label = EXCLUDED.question_label,
        options = EXCLUDED.options,
        help_text = EXCLUDED.help_text;

  -- Q2: Claimant type — determines direct vs legal heir process
  INSERT INTO service_questionnaires (
    service_package_id, question_key, question_label, question_type,
    options, validation, help_text, step_number, display_order, is_active
  ) VALUES (
    svc_id,
    'claimant_type',
    'Are you the original investor, or are you claiming on behalf of someone who has passed away?',
    'radio',
    '[
      {"value":"self","label":"I am the original investor — the shares are or were in my name"},
      {"value":"legal_heir","label":"I am a legal heir — claiming for a deceased parent or family member"},
      {"value":"not_sure","label":"Not sure"}
    ]'::jsonb,
    '{"required":true}'::jsonb,
    'Legal heir claims have a different process from direct claims. This shapes what the expert covers on the call.',
    1, 2, true
  ) ON CONFLICT (service_package_id, question_key) DO UPDATE
    SET question_label = EXCLUDED.question_label,
        options = EXCLUDED.options,
        help_text = EXCLUDED.help_text;

  -- Q3: Share form — determines document requirements
  INSERT INTO service_questionnaires (
    service_package_id, question_key, question_label, question_type,
    options, validation, help_text, step_number, display_order, is_active
  ) VALUES (
    svc_id,
    'share_form',
    'Are the shares in physical certificate form or held in a demat account?',
    'radio',
    '[
      {"value":"demat","label":"Demat account — shares held electronically with a broker"},
      {"value":"physical","label":"Physical certificates — paper share certificates at home"},
      {"value":"both","label":"Both — some physical, some in demat"},
      {"value":"not_sure","label":"Not sure"}
    ]'::jsonb,
    '{"required":true}'::jsonb,
    'Physical and demat shares need different documents for Form IEPF-5. This tells the expert which checklist to prepare.',
    1, 3, true
  ) ON CONFLICT (service_package_id, question_key) DO UPDATE
    SET question_label = EXCLUDED.question_label,
        options = EXCLUDED.options,
        help_text = EXCLUDED.help_text;

END $$;
```


---

## PIECE B — STATIC SERVICE CONFIG
## GOES INTO: apps/customer/lib/services/data/services-iepf.ts (create new file)

```typescript
import { ServicePageConfig } from '../types'

export const iepfConsultation: ServicePageConfig = {
  slug: 'iepf-consultation',
  title: 'IEPF Claim Consultation',
  tagline: 'Old shares, unclaimed dividends, inherited investments. Find out what you have and exactly how to claim it.',

  seoTitle: 'IEPF Claim Consultation India — Unclaimed Shares and Dividends | Rs.500 | Ollvy',
  seoDescription: 'Shares in IEPF? Old dividends unclaimed? Expert finds what is there under your name and tells you exactly how to claim it back. Rs.500 flat, consultation in 2 days.',
  canonicalUrl: 'https://www.ollvy.com/services/iepf-consultation',
  lastReviewed: 'April 2026',
  category: 'Legal' as any,

  explainer: {
    whatItIs:
      'IEPF stands for Investor Education and Protection Fund. Under the Companies Act 2013, if dividends on a shareholder account go unclaimed for 7 consecutive years, the company must transfer those dividends to this government fund. The shares on which those dividends went unclaimed are transferred alongside. The money does not disappear permanently, but recovering it requires filing Form IEPF-5 through the company and then IEPF Authority.',

    whyYouNeedIt:
      'Most people who contact us do not know whether their shares are in IEPF, how much is there, or what the process looks like for their case. A direct claim by the original investor is completely different from a legal heir claim. Physical share certificates have different requirements than demat holdings. This consultation answers all of it before you spend weeks filing paperwork that turns out to be wrong.',

    whatHappensWithout:
      'There is no deadline to claim from IEPF. But the paperwork gets harder over time. Companies change their RTAs. Physical certificates deteriorate. If the original investor has passed away, each year without action adds documents to the legal heir process. Starting with a clear picture costs Rs.500 and takes 2 days.',
  },

  workflow: [
    {
      step: 1,
      title: 'Tell us about your case',
      timeframe: 'Day 0',
      description: 'Company name, year of investment, folio number if you have it. Physical certificates or old dividend warrants if they exist. No documents needed upfront.',
      milestone: 'Brief received. Expert assigned.',
    },
    {
      step: 2,
      title: 'Expert checks the IEPF database',
      timeframe: 'Day 0-1',
      description: 'Expert searches iepf.gov.in and MCA21 using your PAN, name, and company details. Confirms what is actually credited in IEPF under your name before the call.',
      milestone: 'IEPF balance confirmed',
    },
    {
      step: 3,
      title: '45-minute consultation call',
      timeframe: 'Day 1-2',
      description: 'Covers what is claimable, what IEPF-5 looks like for your case, and which documents you need. Legal heir claim? Covered separately — different requirements from a direct claim.',
      milestone: 'Consultation complete',
    },
    {
      step: 4,
      title: 'Written action plan',
      timeframe: 'Day 2',
      description: 'Written summary of the call plus a personalised IEPF-5 document checklist for your case. Not the generic 18-item government list.',
      milestone: 'Action plan in your order page',
    },
  ],

  included: [
    {
      title: 'IEPF database check',
      description: 'Expert searches iepf.gov.in and MCA21 using your PAN and company details. Confirms exactly which shares and dividend amounts are credited under your name.',
      without: 'Hours across iepf.gov.in, MCA21, and the company RTA with no guarantee of finding the right entry.',
      withOllvy: 'Confirmed in under 24 hours before the call.',
    },
    {
      title: '45-minute expert call — your case only',
      description: 'Expert walks through Form IEPF-5 for your specific situation. Simple direct claim: you hear that and get next steps. Complex inherited or physical certificate case: every step mapped out. No generic script.',
    },
    {
      title: 'Personalised document checklist',
      description: 'Your checklist has 5 to 9 items in plain language. The government list has 18 items written for lawyers. Yours covers only what your case actually requires.',
    },
    {
      title: 'Written action plan with timeline',
      description: 'Delivered to your order page after the call. Covers what is claimable, what to file, in what order, and what to expect on timeline.',
    },
  ],

  risks: [
    {
      title: 'IEPF-5 rejected for a data mismatch',
      description: 'Form IEPF-5 requires folio number, DP ID, client ID, and company CIN exactly matching government records. One mismatch causes rejection at the RTA stage, which you find out about 4 to 6 weeks later.',
    },
    {
      title: 'PAN not linked to the folio',
      description: 'IEPF credits are matched against PAN. If the original shareholder PAN is not linked to the folio, the claim stalls. For inherited claims, your PAN must match legal heir records at the company.',
    },
    {
      title: 'Legal heirs filing before completing share transmission',
      description: 'If shares are in physical form, they must be transmitted into your name before IEPF-5 is filed. Filing before transmission is the most common and most costly mistake in inherited share claims.',
    },
    {
      title: 'Physical certificates have extra requirements',
      description: 'Physical shares need an affidavit and indemnity bond on top of standard documents. Lost certificates need a duplicate from the company RTA, which is a separate process with its own timeline.',
    },
  ],

  personas: [
    {
      title: 'Found old share certificates at home',
      description: 'Physical certificates from the 1990s or early 2000s. Not sure if the company still exists in the same form, whether shares went to IEPF, or how to start.',
    },
    {
      title: 'Inherited shares after a parent passed away',
      description: 'Shares existed in a parent name. Formal transmission never happened. The IEPF process for legal heirs has extra steps most people miss.',
    },
    {
      title: 'Received a company letter about IEPF',
      description: 'The company sent notice that dividends have been or will be transferred to IEPF. You want to know what this means and what to do.',
    },
    {
      title: 'NRI with old Indian investments',
      description: 'You or your parents held shares in Indian companies before moving abroad. Dividends went unclaimed for years and may now be in IEPF.',
    },
  ],

  faqs: [
    {
      category: 'General',
      q: 'What is IEPF and how did my shares end up there?',
      a: 'IEPF stands for Investor Education and Protection Fund, created under the Companies Act 2013. If dividends on a shareholder account go unclaimed for 7 consecutive years, the company must transfer those dividends to IEPF. The shares on which those dividends went unclaimed are transferred alongside. This happens automatically. Most shareholders find out only when looking for old investments or receiving a company notice.',
    },
    {
      category: 'General',
      q: 'How do I check if my shares are in IEPF?',
      a: 'You can search on iepf.gov.in using the company CIN and folio number, or on MCA21. Most people search and find nothing — not because there is nothing, but because the search needs precise inputs that are easy to get wrong. The consultation includes running this search correctly before the call.',
    },
    {
      category: 'General',
      q: 'Can I get the money back?',
      a: 'Yes. Transfer to IEPF is not forfeiture. You can file Form IEPF-5 at any time. There is no deadline. The refund takes 60 to 90 days from a complete application.',
    },
    {
      category: 'General',
      q: 'Do I get the shares back or just the dividends?',
      a: 'Both. One IEPF-5 application covers the shares and all accumulated unclaimed dividends. Shares go to your demat account. Dividends go to your bank account.',
    },
    {
      category: 'Process',
      q: 'What does the Rs.500 consultation cover?',
      a: 'Expert checks what is in IEPF under your name, then does a 45-minute call covering your case — what is claimable, what IEPF-5 involves for you, which documents you need, and realistic timeline. You get a written action plan and personalised document checklist. Filing IEPF-5 is a separate service.',
    },
    {
      category: 'Process',
      q: 'What is Form IEPF-5?',
      a: 'IEPF-5 is the government claim form filed on MCA21 by the shareholder or their legal heir. After filing online, you courier physical documents to the company Nodal Officer. The company verifies and forwards the claim to IEPF Authority, which processes the share and dividend refund.',
    },
    {
      category: 'Process',
      q: 'How long does the full IEPF claim take?',
      a: '60 to 90 days from filing IEPF-5 if the company RTA is responsive. Physical certificate and legal heir claims typically take longer. The consultation tells you what to expect for your company specifically.',
    },
    {
      category: 'Documents',
      q: 'What documents does IEPF-5 require?',
      a: 'Depends on your case. Original investor with demat: PAN, Aadhaar, cancelled cheque, client master report from broker. Physical shares: add share certificate, affidavit, indemnity bond. Legal heir: add death certificate, heirship or succession certificate, transmission documents. The consultation gives you your specific list.',
    },
    {
      category: 'Documents',
      q: 'I cannot find the original share certificate. Can I still claim?',
      a: 'Possibly. If shares are in IEPF, they exist as a government entry regardless of the physical certificate. Many RTAs accept an indemnity bond in lieu. Whether this applies to your company is covered in the consultation.',
    },
    {
      category: 'Pricing',
      q: 'Is there a government fee to file IEPF-5?',
      a: 'No. Filing IEPF-5 and claiming from IEPF is free of government fees. Case-specific costs can arise — court fees for a succession certificate, stamp duty on an indemnity bond. The consultation flags any that apply.',
    },
    {
      category: 'Pricing',
      q: 'What is the difference between this consultation and the full IEPF filing service?',
      a: 'This consultation tells you what is claimable and what the process looks like for your case. You leave with a document checklist and action plan. Filing Form IEPF-5, coordinating with the Nodal Officer, and following up with IEPF Authority is a longer engagement handled separately.',
    },
  ],

  govtFees: {
    caption: 'Government Fees — IEPF Claim',
    headers: ['Item', 'Government Fee', 'Notes'],
    rows: [
      ['IEPF-5 filing on MCA21', 'Nil', 'No fee to file the claim form'],
      ['Dividend refund from IEPF', 'Nil', 'Credited to your bank account'],
      ['Share refund from IEPF', 'Nil', 'Credited to your demat account'],
      ['Succession certificate (if needed)', 'Court fee, varies by state', 'Only if there is no registered will and no legal heirship certificate issued by local authority'],
      ['Stamp duty on indemnity bond', 'Rs.100 to Rs.500', 'Only if original share certificate is lost. Amount varies by state.'],
    ],
  },

  documents: {
    caption: 'Typical Documents for IEPF-5 — Exact List Depends on Your Case',
    headers: ['Document', 'Original Investor (Living)', 'Legal Heir (Deceased Original Holder)'],
    rows: [
      ['PAN card', 'Self-attested copy', 'Claimant PAN, self-attested'],
      ['Aadhaar card', 'Address proof', 'Claimant Aadhaar'],
      ['Share certificate', 'Required if shares are physical', 'Required if shares are physical'],
      ['Demat account proof', 'Client master report from broker', 'Claimant client master report'],
      ['Cancelled cheque', 'Account where refund is deposited', 'Claimant bank account'],
      ['Death certificate', 'Not applicable', 'Original holder death certificate'],
      ['Legal heirship or succession certificate', 'Not applicable', 'Issued by court or state authority'],
      ['Transmission request to company RTA', 'Not applicable', 'Must be done before filing IEPF-5 for physical shares'],
      ['Indemnity bond', 'Only if original certificate is lost', 'Only if original certificate is lost'],
    ],
  },

  relatedServiceSlugs: ['gst-registration', 'trademark-registration', 'pvt-ltd-incorporation'],
}
```


---

## PIECE C — SERVICE REGISTRY
## GOES INTO: apps/customer/lib/services/data/index.ts

```typescript
// Add import at top:
import { iepfConsultation } from './services-iepf'

// Add to allServices array:
iepfConsultation,
```


---

## PIECE D — FALLBACK SLUG
## GOES INTO: apps/customer/lib/data/services.ts — add to FALLBACK_SERVICE_SLUGS

```typescript
'iepf-consultation',
```


---

## PIECE E — DIY VS OLLVY
## GOES INTO: apps/customer/components/service/DIYvsOllvy.tsx — add inside DATA map

```typescript
'iepf-consultation': {
  off_stat: 'Weeks of searching. No clear answer on what you can actually claim.',
  on_stat: 'Know what is claimable and how to get it — in 2 days.',
  on_date_label: 'Action plan by',
  rows: [
    {
      task: 'Finding your IEPF balance',
      own: 'iepf.gov.in needs the exact company CIN and folio number. Most people search and find nothing — not because there is nothing, but because the search needs precise inputs they do not have.',
      ollvy_head: 'Expert searches MCA21 and the IEPF portal correctly and confirms what is actually there.',
      ollvy_badge: 'Done before the call.',
    },
    {
      task: 'Knowing your claim type',
      own: 'Direct claim, legal heir claim, physical certificate claim — each has a different process. No way to know which you are dealing with until something goes wrong partway through.',
      ollvy_head: 'Expert identifies your case type in the first 5 minutes of the call.',
      ollvy_badge: 'No surprises.',
    },
    {
      task: 'Understanding Form IEPF-5',
      own: '18 fields, a separate instruction manual, and MCA21 help pages referencing 2016 rules that have been amended since.',
      ollvy_head: 'Expert covers only what applies to your case.',
      ollvy_badge: '45 minutes, not 45 pages.',
    },
    {
      task: 'Document checklist',
      own: 'Government list has 14 items. Several probably do not apply to you. Two that do apply are not on the list.',
      ollvy_head: '5 to 9 items. Each explained in plain language, delivered in writing.',
      ollvy_badge: 'Specific to your case.',
    },
    {
      task: 'What it actually costs',
      own: 'Free to figure out yourself — if you get it right. Mistakes cost 2 to 3 months of delay and filing from scratch.',
      ollvy_head: '{{GUARANTEE}}',
      ollvy_badge: "That's it.",
    },
  ],
},
```


---

## PIECE F — FALLBACK REVIEWS
## GOES INTO: apps/customer/lib/data/fallback-reviews.ts — add inside fallbackReviews map

```typescript
'iepf-consultation': [
  {
    rating: 5,
    comment: 'My father had Infosys shares from 2001. I had no idea they were in IEPF or even where to start. The expert found Rs.38,000 in unclaimed dividends before the call and then explained on the call that I needed to complete the share transmission first before filing IEPF-5. Would have made a costly mistake without that.',
    date: 'March 2026',
    name: 'Suresh Raghunathan',
  },
  {
    rating: 5,
    comment: 'Found old Tata Motors certificates in a drawer after my mother passed away. Did not know if I should contact the company, go to IEPF directly, or hire a lawyer. Thirty minutes into the call I had a clear picture of what to do and in what order. The document checklist had 7 items. The government one has 18.',
    date: 'February 2026',
    name: 'Priya Venkataraman',
  },
  {
    rating: 5,
    comment: 'Very specific to my case. The expert knew exactly how a legal heir claim differs from a personal one and went through each step I needed to take. Did not waste any time on things that did not apply to me.',
    date: 'January 2026',
    name: 'Anand Krishnamurthy',
  },
],
```


---

## PIECE G — QUESTIONNAIRE STEP TITLES
## GOES INTO: apps/customer/lib/questionnaire/types.ts — add inside STEP_TITLES

```typescript
'iepf-consultation': {
  1: {
    title: 'Your Situation',
    description: 'Three quick questions so the expert knows your case before the call.',
  },
},
```


---

## IMPORTANT NOTES FOR CLAUDE CODE

- NO service_document_templates rows. Order page shows no Documents section.
- NO addons on the service_packages row. Checkout shows no add-ons section.
- unlocks is set to empty array. Service page shows no "What this unlocks" section.
- price_mrp_paisa = 200000 (Rs.2,000 strikethrough). price_base_paisa = 50000 (Rs.500).
- Total at checkout = Rs.500 + 18% GST = Rs.590. No govt fee line.
- Pre-questionnaire: 3 questions, all step_number=1. Price does not change based on answers.
- No post-payment questionnaire rows. After payment, order page goes straight to order summary.
- Order page shows "Consultation pending" status. Expert picks it up from admin queue.
- completion_range_text renders on checkout and order page instead of a hard guaranteed date.
