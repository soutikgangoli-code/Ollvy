-- Shorten workflow_stages titles to fit in timeline cards without truncation
-- Each title should be max ~25 characters to display cleanly on 2 lines

-- GST Registration
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Answer 5 questions", "timeline": "Day 0", "body": "Business type, trade name, address. We build your checklist.", "visual": "checklist"},
  {"step": 2, "title": "Upload documents", "timeline": "Day 0-1", "body": "PAN, Aadhaar, address proof. Your CA verifies each.", "visual": "upload"},
  {"step": 3, "title": "Application filed", "timeline": "Day 1-2", "body": "GST REG-01 submitted. ARN generated in 24 hours.", "visual": "form"},
  {"step": 4, "title": "Officer query handled", "timeline": "Day 3-5", "body": "If clarification needed, your CA responds same day.", "visual": "form"},
  {"step": 5, "title": "GSTIN issued", "timeline": "Day 5-7", "body": "15-digit GSTIN certificate delivered to you.", "visual": "stamp", "isCompletion": true}
]'::jsonb
WHERE slug = 'gst-registration';

-- Pvt Ltd Incorporation
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Answer 5 questions", "timeline": "Day 0", "body": "Directors, shareholders, company name options.", "visual": "checklist"},
  {"step": 2, "title": "Upload documents", "timeline": "Day 0-2", "body": "PAN, Aadhaar, photo, address proof for all directors.", "visual": "upload"},
  {"step": 3, "title": "DSC & DIN ready", "timeline": "Day 2-4", "body": "Digital signatures and Director IDs obtained.", "visual": "form"},
  {"step": 4, "title": "Name approved", "timeline": "Day 4-6", "body": "RUN form approved by MCA.", "visual": "form"},
  {"step": 5, "title": "SPICe+ filed", "timeline": "Day 6-10", "body": "Incorporation form with MOA/AOA submitted.", "visual": "form"},
  {"step": 6, "title": "Certificate issued", "timeline": "Day 10-14", "body": "CIN, PAN, TAN all generated.", "visual": "stamp", "isCompletion": true}
]'::jsonb
WHERE slug = 'pvt-ltd-incorporation';

-- OPC Incorporation
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Answer 5 questions", "timeline": "Day 0", "body": "Business activity, name options, nominee details.", "visual": "checklist"},
  {"step": 2, "title": "Upload documents", "timeline": "Day 0-2", "body": "PAN, Aadhaar, address proof, passport photo.", "visual": "upload"},
  {"step": 3, "title": "DSC & DIN ready", "timeline": "Day 2-4", "body": "Digital signature via video verification.", "visual": "form"},
  {"step": 4, "title": "Name approved", "timeline": "Day 4-7", "body": "RUN form approved by MCA.", "visual": "form"},
  {"step": 5, "title": "SPICe+ filed", "timeline": "Day 7-10", "body": "MOA, AOA, INC-3 nominee consent filed.", "visual": "form"},
  {"step": 6, "title": "Certificate issued", "timeline": "Day 10-12", "body": "CIN with PAN/TAN delivered.", "visual": "stamp", "isCompletion": true}
]'::jsonb
WHERE slug = 'opc-incorporation';

-- LLP Registration
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Partner details", "timeline": "Day 0", "body": "Names, contribution, profit sharing ratio.", "visual": "checklist"},
  {"step": 2, "title": "Upload documents", "timeline": "Day 0-2", "body": "PAN, Aadhaar, photo for all partners.", "visual": "upload"},
  {"step": 3, "title": "DSC obtained", "timeline": "Day 2-4", "body": "Digital signatures for designated partners.", "visual": "form"},
  {"step": 4, "title": "Name approved", "timeline": "Day 4-6", "body": "RUN-LLP approved by MCA.", "visual": "form"},
  {"step": 5, "title": "FiLLiP filed", "timeline": "Day 6-10", "body": "Incorporation form with LLP agreement.", "visual": "form"},
  {"step": 6, "title": "Certificate issued", "timeline": "Day 10-14", "body": "LLPIN and PAN generated.", "visual": "stamp", "isCompletion": true}
]'::jsonb
WHERE slug = 'llp-registration';

-- Partnership Registration
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Partner details", "timeline": "Day 0-1", "body": "Names, capital, profit ratio, roles.", "visual": "checklist"},
  {"step": 2, "title": "Deed drafted", "timeline": "Day 1-3", "body": "Custom deed with all clauses.", "visual": "form"},
  {"step": 3, "title": "Review & approve", "timeline": "Day 3-4", "body": "You review and request changes.", "visual": "checklist"},
  {"step": 4, "title": "Stamp paper", "timeline": "Day 4-5", "body": "Appropriate value arranged.", "visual": "form"},
  {"step": 5, "title": "Firm registered", "timeline": "Day 5-7", "body": "Certificate from Registrar.", "visual": "stamp", "isCompletion": true}
]'::jsonb
WHERE slug = 'partnership-registration';

-- Udyam Registration
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Share Aadhaar & PAN", "timeline": "Day 0", "body": "Owner Aadhaar for OTP, business PAN.", "visual": "upload"},
  {"step": 2, "title": "Verify eligibility", "timeline": "Day 0", "body": "Check investment and turnover limits.", "visual": "checklist"},
  {"step": 3, "title": "Application filed", "timeline": "Day 1", "body": "Submitted on Udyam portal.", "visual": "form"},
  {"step": 4, "title": "Certificate issued", "timeline": "Day 1-2", "body": "URN generated instantly.", "visual": "stamp", "isCompletion": true}
]'::jsonb
WHERE slug = 'udyam-registration';

-- GST Cancellation
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Liability review", "timeline": "Day 0-2", "body": "Check ITC balance and pending dues.", "visual": "checklist"},
  {"step": 2, "title": "Pending returns", "timeline": "Day 2-5", "body": "All GSTR-1 and 3B filed.", "visual": "form"},
  {"step": 3, "title": "GSTR-10 prepared", "timeline": "Day 5-8", "body": "Final return with ITC reversal.", "visual": "form"},
  {"step": 4, "title": "REG-16 filed", "timeline": "Day 8-12", "body": "Cancellation application submitted.", "visual": "form"},
  {"step": 5, "title": "GSTIN cancelled", "timeline": "Day 12-15", "body": "Cancellation order issued.", "visual": "stamp", "isCompletion": true}
]'::jsonb
WHERE slug = 'gst-cancellation';

-- GST Revocation
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Review order", "timeline": "Day 0-1", "body": "Understand cancellation reason.", "visual": "checklist"},
  {"step": 2, "title": "Check eligibility", "timeline": "Day 1", "body": "Must be within 30 days.", "visual": "checklist"},
  {"step": 3, "title": "File returns", "timeline": "Day 1-5", "body": "All pending GSTR-1, 3B filed.", "visual": "form"},
  {"step": 4, "title": "REG-21 filed", "timeline": "Day 5-8", "body": "Revocation application.", "visual": "form"},
  {"step": 5, "title": "GSTIN restored", "timeline": "Day 8-10", "body": "Account reactivated.", "visual": "stamp", "isCompletion": true}
]'::jsonb
WHERE slug = 'gst-revocation';

-- Import Export Code
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Share details", "timeline": "Day 0", "body": "Business PAN, bank account, address.", "visual": "checklist"},
  {"step": 2, "title": "Upload documents", "timeline": "Day 0-1", "body": "PAN, cancelled cheque, GST cert.", "visual": "upload"},
  {"step": 3, "title": "Application filed", "timeline": "Day 1-2", "body": "DGFT application submitted.", "visual": "form"},
  {"step": 4, "title": "IEC issued", "timeline": "Day 2-3", "body": "10-digit code delivered.", "visual": "stamp", "isCompletion": true}
]'::jsonb
WHERE slug = 'import-export-code';

-- Startup India
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Share details", "timeline": "Day 0", "body": "Incorporation cert, pitch deck.", "visual": "checklist"},
  {"step": 2, "title": "Upload documents", "timeline": "Day 0-2", "body": "All required startup proofs.", "visual": "upload"},
  {"step": 3, "title": "Application filed", "timeline": "Day 2-3", "body": "DPIIT portal submission.", "visual": "form"},
  {"step": 4, "title": "DPIIT review", "timeline": "Day 3-7", "body": "Department processes.", "visual": "form"},
  {"step": 5, "title": "Recognition", "timeline": "Day 7-10", "body": "Startup India certificate.", "visual": "stamp", "isCompletion": true}
]'::jsonb
WHERE slug = 'startup-india-registration';

-- Trademark Registration
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Search conflicts", "timeline": "Day 0-1", "body": "Check existing trademarks.", "visual": "checklist"},
  {"step": 2, "title": "Application filed", "timeline": "Day 1-3", "body": "TM-A form submitted.", "visual": "form"},
  {"step": 3, "title": "Examination", "timeline": "Day 30-90", "body": "Registrar reviews.", "visual": "form"},
  {"step": 4, "title": "Publication", "timeline": "Day 90-120", "body": "4-month opposition period.", "visual": "form"},
  {"step": 5, "title": "Registered", "timeline": "Day 180+", "body": "TM certificate issued.", "visual": "stamp", "isCompletion": true}
]'::jsonb
WHERE slug = 'trademark-registration';

-- FSSAI Basic
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Share details", "timeline": "Day 0", "body": "Business type, food category.", "visual": "checklist"},
  {"step": 2, "title": "Upload documents", "timeline": "Day 0-1", "body": "ID proof, address proof.", "visual": "upload"},
  {"step": 3, "title": "Application filed", "timeline": "Day 1-2", "body": "FoSCoS portal submission.", "visual": "form"},
  {"step": 4, "title": "License issued", "timeline": "Day 2-7", "body": "14-digit FSSAI number.", "visual": "stamp", "isCompletion": true}
]'::jsonb
WHERE slug = 'fssai-basic';

-- FSSAI State
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Share details", "timeline": "Day 0", "body": "Business scale, food types.", "visual": "checklist"},
  {"step": 2, "title": "Upload documents", "timeline": "Day 0-2", "body": "All compliance documents.", "visual": "upload"},
  {"step": 3, "title": "Application filed", "timeline": "Day 2-3", "body": "FoSCoS submission.", "visual": "form"},
  {"step": 4, "title": "Processing", "timeline": "Day 3-20", "body": "State authority review.", "visual": "form"},
  {"step": 5, "title": "License issued", "timeline": "Day 20-30", "body": "State FSSAI license.", "visual": "stamp", "isCompletion": true}
]'::jsonb
WHERE slug = 'fssai-state';

-- FSSAI Central
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Share details", "timeline": "Day 0", "body": "Multi-state operations info.", "visual": "checklist"},
  {"step": 2, "title": "Upload documents", "timeline": "Day 0-3", "body": "Detailed compliance docs.", "visual": "upload"},
  {"step": 3, "title": "Application filed", "timeline": "Day 3-5", "body": "Central FSSAI submission.", "visual": "form"},
  {"step": 4, "title": "Processing", "timeline": "Day 5-45", "body": "Central authority review.", "visual": "form"},
  {"step": 5, "title": "License issued", "timeline": "Day 45-60", "body": "Central FSSAI license.", "visual": "stamp", "isCompletion": true}
]'::jsonb
WHERE slug = 'fssai-central';

-- GST Monthly Filing packages
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Share invoices", "timeline": "By 5th", "body": "Sales and purchase data.", "visual": "upload"},
  {"step": 2, "title": "Returns prepared", "timeline": "By 8th", "body": "GSTR-1 and 3B drafted.", "visual": "form"},
  {"step": 3, "title": "Returns filed", "timeline": "By 11th", "body": "Submitted before deadline.", "visual": "stamp", "isCompletion": true}
]'::jsonb
WHERE slug LIKE 'gst-monthly%';

-- Business ITR
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Share documents", "timeline": "Day 0-2", "body": "P&L, balance sheet, bank.", "visual": "upload"},
  {"step": 2, "title": "Tax computed", "timeline": "Day 2-5", "body": "Calculate liability.", "visual": "form"},
  {"step": 3, "title": "Review draft", "timeline": "Day 5-7", "body": "You approve return.", "visual": "checklist"},
  {"step": 4, "title": "ITR filed", "timeline": "Day 7-10", "body": "Submitted with e-verify.", "visual": "form"},
  {"step": 5, "title": "Acknowledgment", "timeline": "Day 10", "body": "ITR-V delivered.", "visual": "stamp", "isCompletion": true}
]'::jsonb
WHERE slug = 'business-itr';

-- Personal ITR
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Share documents", "timeline": "Day 0-1", "body": "Form 16, investments.", "visual": "upload"},
  {"step": 2, "title": "Tax computed", "timeline": "Day 1-2", "body": "Optimize deductions.", "visual": "form"},
  {"step": 3, "title": "ITR filed", "timeline": "Day 2-3", "body": "e-Filed and verified.", "visual": "stamp", "isCompletion": true}
]'::jsonb
WHERE slug = 'personal-itr';

-- TDS Return
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Share challans", "timeline": "Day 0-2", "body": "TDS payments and deductee info.", "visual": "upload"},
  {"step": 2, "title": "Return prepared", "timeline": "Day 2-4", "body": "Form 24Q/26Q drafted.", "visual": "form"},
  {"step": 3, "title": "Return filed", "timeline": "Day 4-5", "body": "Submitted on TRACES.", "visual": "stamp", "isCompletion": true}
]'::jsonb
WHERE slug LIKE 'tds-return%';

-- Payroll packages
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Share attendance", "timeline": "By 25th", "body": "Employee hours and leaves.", "visual": "upload"},
  {"step": 2, "title": "Payroll processed", "timeline": "By 28th", "body": "Salaries calculated.", "visual": "form"},
  {"step": 3, "title": "Statutory filed", "timeline": "By 15th", "body": "PF, ESIC, PT submitted.", "visual": "stamp", "isCompletion": true}
]'::jsonb
WHERE slug LIKE 'payroll%';

-- Annual Compliance
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Collect records", "timeline": "Day 0-5", "body": "All company documents.", "visual": "upload"},
  {"step": 2, "title": "Financials ready", "timeline": "Day 5-15", "body": "Balance sheet, P&L.", "visual": "form"},
  {"step": 3, "title": "AOC-4 filed", "timeline": "Day 15-20", "body": "Financials to MCA.", "visual": "form"},
  {"step": 4, "title": "MGT-7 filed", "timeline": "Day 20-25", "body": "Annual return to MCA.", "visual": "form"},
  {"step": 5, "title": "Compliance done", "timeline": "Day 25-30", "body": "All filings complete.", "visual": "stamp", "isCompletion": true}
]'::jsonb
WHERE slug = 'annual-compliance-pvt-ltd';
