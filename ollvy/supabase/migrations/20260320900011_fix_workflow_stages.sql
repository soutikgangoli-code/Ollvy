-- =============================================================================
-- Migration: Update Workflow Stages Text
-- Updates workflow_stages to accurately reflect the questionnaire content
-- =============================================================================

-- Pvt Ltd Incorporation - Update step 1 to reflect actual questionnaire
-- 15 questions across 5 steps: company details, director 1, director 2, office, business
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Share company details", "timeline": "Day 0", "body": "Directors info, company names, registered office, business activity.", "visual": "checklist", "milestone": "CS assigned, checklist sent"},
  {"step": 2, "title": "Upload documents", "timeline": "Day 0-2", "body": "PAN, Aadhaar, photo, address proof for all directors.", "visual": "upload", "milestone": "Documents verified by CS"},
  {"step": 3, "title": "DSC & DIN ready", "timeline": "Day 2-4", "body": "Digital signatures and Director IDs obtained.", "visual": "form", "milestone": "DSC and DIN ready"},
  {"step": 4, "title": "Name approved", "timeline": "Day 4-6", "body": "RUN form approved by MCA.", "visual": "form", "milestone": "Company name approved"},
  {"step": 5, "title": "SPICe+ filed", "timeline": "Day 6-10", "body": "Incorporation form with MOA/AOA submitted.", "visual": "form", "milestone": "SPICe+ submitted to MCA"},
  {"step": 6, "title": "Certificate issued", "timeline": "Day 10-14", "body": "CIN, PAN, TAN all generated.", "visual": "stamp", "isCompletion": true, "milestone": "Company incorporated"}
]'::jsonb
WHERE slug = 'pvt-ltd-incorporation';

-- OPC Incorporation - Update step 1 to reflect actual questionnaire
-- 14 questions across 5 steps: company details, director, nominee, office, business
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Share company details", "timeline": "Day 0", "body": "Your info, nominee details, company names, office address.", "visual": "checklist", "milestone": "CS assigned"},
  {"step": 2, "title": "Upload documents", "timeline": "Day 0-2", "body": "PAN, Aadhaar, address proof, passport photo.", "visual": "upload", "milestone": "Documents verified"},
  {"step": 3, "title": "DSC & DIN ready", "timeline": "Day 2-4", "body": "Digital signature via video verification.", "visual": "form", "milestone": "DSC ready"},
  {"step": 4, "title": "Name approved", "timeline": "Day 4-7", "body": "RUN form approved by MCA.", "visual": "form", "milestone": "Name approved"},
  {"step": 5, "title": "SPICe+ filed", "timeline": "Day 7-10", "body": "MOA, AOA, INC-3 nominee consent filed.", "visual": "form", "milestone": "SPICe+ submitted"},
  {"step": 6, "title": "Certificate issued", "timeline": "Day 10-12", "body": "CIN with PAN/TAN delivered.", "visual": "stamp", "isCompletion": true, "milestone": "OPC incorporated"}
]'::jsonb
WHERE slug = 'opc-incorporation';

-- LLP Registration - Update step 1 to reflect actual questionnaire
-- 15 questions across 5 steps: LLP details, partner 1, partner 2, office, business
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Share partner details", "timeline": "Day 0", "body": "Partner info, LLP names, contribution, office address.", "visual": "checklist", "milestone": "Company secretary assigned"},
  {"step": 2, "title": "Upload documents", "timeline": "Day 0-2", "body": "PAN, Aadhaar, photo for all partners.", "visual": "upload", "milestone": "Documents verified by CS"},
  {"step": 3, "title": "DSC obtained", "timeline": "Day 2-4", "body": "Digital signatures for designated partners.", "visual": "form", "milestone": "DPIN applications filed"},
  {"step": 4, "title": "Name approved", "timeline": "Day 4-6", "body": "RUN-LLP approved by MCA.", "visual": "form", "milestone": "LLP name approved"},
  {"step": 5, "title": "FiLLiP filed", "timeline": "Day 6-10", "body": "Incorporation form with LLP agreement.", "visual": "form", "milestone": "FiLLiP submitted to MCA"},
  {"step": 6, "title": "Certificate issued", "timeline": "Day 10-14", "body": "LLPIN and PAN generated.", "visual": "stamp", "isCompletion": true, "milestone": "Certificate of Incorporation issued"}
]'::jsonb
WHERE slug = 'llp-registration';

-- Also update llp-incorporation if it exists (some references use this slug)
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Share partner details", "timeline": "Day 0", "body": "Partner info, LLP names, contribution, office address.", "visual": "checklist", "milestone": "Company secretary assigned"},
  {"step": 2, "title": "Upload documents", "timeline": "Day 0-2", "body": "PAN, Aadhaar, photo for all partners.", "visual": "upload", "milestone": "Documents verified by CS"},
  {"step": 3, "title": "DSC obtained", "timeline": "Day 2-4", "body": "Digital signatures for designated partners.", "visual": "form", "milestone": "DPIN applications filed"},
  {"step": 4, "title": "Name approved", "timeline": "Day 4-6", "body": "RUN-LLP approved by MCA.", "visual": "form", "milestone": "LLP name approved"},
  {"step": 5, "title": "FiLLiP filed", "timeline": "Day 6-10", "body": "Incorporation form with LLP agreement.", "visual": "form", "milestone": "FiLLiP submitted to MCA"},
  {"step": 6, "title": "Certificate issued", "timeline": "Day 10-14", "body": "LLPIN and PAN generated.", "visual": "stamp", "isCompletion": true, "milestone": "Certificate of Incorporation issued"}
]'::jsonb
WHERE slug = 'llp-incorporation';
