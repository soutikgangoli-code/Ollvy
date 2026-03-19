-- Restore milestone fields to workflow_stages
-- Migration 20260320500000 shortened titles but accidentally removed milestones
-- This restores milestones while keeping the shortened titles

-- GST Registration
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Answer 5 questions", "timeline": "Day 0", "body": "Business type, trade name, address. We build your checklist.", "visual": "checklist", "milestone": "CA assigned, checklist sent"},
  {"step": 2, "title": "Upload documents", "timeline": "Day 0-1", "body": "PAN, Aadhaar, address proof. Your CA verifies each.", "visual": "upload", "milestone": "Documents verified by CA"},
  {"step": 3, "title": "Application filed", "timeline": "Day 1-2", "body": "GST REG-01 submitted. ARN generated in 24 hours.", "visual": "form", "milestone": "ARN generated"},
  {"step": 4, "title": "Officer query handled", "timeline": "Day 3-5", "body": "If clarification needed, your CA responds same day.", "visual": "form", "milestone": "Query responded"},
  {"step": 5, "title": "GSTIN issued", "timeline": "Day 5-7", "body": "15-digit GSTIN certificate delivered to you.", "visual": "stamp", "isCompletion": true, "milestone": "GSTIN active"}
]'::jsonb
WHERE slug = 'gst-registration';

-- Pvt Ltd Incorporation
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Answer 5 questions", "timeline": "Day 0", "body": "Directors, shareholders, company name options.", "visual": "checklist", "milestone": "CS assigned, checklist sent"},
  {"step": 2, "title": "Upload documents", "timeline": "Day 0-2", "body": "PAN, Aadhaar, photo, address proof for all directors.", "visual": "upload", "milestone": "Documents verified by CS"},
  {"step": 3, "title": "DSC & DIN ready", "timeline": "Day 2-4", "body": "Digital signatures and Director IDs obtained.", "visual": "form", "milestone": "DSC and DIN ready"},
  {"step": 4, "title": "Name approved", "timeline": "Day 4-6", "body": "RUN form approved by MCA.", "visual": "form", "milestone": "Company name approved"},
  {"step": 5, "title": "SPICe+ filed", "timeline": "Day 6-10", "body": "Incorporation form with MOA/AOA submitted.", "visual": "form", "milestone": "SPICe+ submitted to MCA"},
  {"step": 6, "title": "Certificate issued", "timeline": "Day 10-14", "body": "CIN, PAN, TAN all generated.", "visual": "stamp", "isCompletion": true, "milestone": "Company incorporated"}
]'::jsonb
WHERE slug = 'pvt-ltd-incorporation';

-- OPC Incorporation
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Answer 5 questions", "timeline": "Day 0", "body": "Business activity, name options, nominee details.", "visual": "checklist", "milestone": "CS assigned"},
  {"step": 2, "title": "Upload documents", "timeline": "Day 0-2", "body": "PAN, Aadhaar, address proof, passport photo.", "visual": "upload", "milestone": "Documents verified"},
  {"step": 3, "title": "DSC & DIN ready", "timeline": "Day 2-4", "body": "Digital signature via video verification.", "visual": "form", "milestone": "DSC ready"},
  {"step": 4, "title": "Name approved", "timeline": "Day 4-7", "body": "RUN form approved by MCA.", "visual": "form", "milestone": "Name approved"},
  {"step": 5, "title": "SPICe+ filed", "timeline": "Day 7-10", "body": "MOA, AOA, INC-3 nominee consent filed.", "visual": "form", "milestone": "SPICe+ submitted"},
  {"step": 6, "title": "Certificate issued", "timeline": "Day 10-12", "body": "CIN with PAN/TAN delivered.", "visual": "stamp", "isCompletion": true, "milestone": "OPC incorporated"}
]'::jsonb
WHERE slug = 'opc-incorporation';

-- LLP Registration
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Partner details", "timeline": "Day 0", "body": "Names, contribution, profit sharing ratio.", "visual": "checklist", "milestone": "Company secretary assigned"},
  {"step": 2, "title": "Upload documents", "timeline": "Day 0-2", "body": "PAN, Aadhaar, photo for all partners.", "visual": "upload", "milestone": "Documents verified by CS"},
  {"step": 3, "title": "DSC obtained", "timeline": "Day 2-4", "body": "Digital signatures for designated partners.", "visual": "form", "milestone": "DPIN applications filed"},
  {"step": 4, "title": "Name approved", "timeline": "Day 4-6", "body": "RUN-LLP approved by MCA.", "visual": "form", "milestone": "LLP name approved"},
  {"step": 5, "title": "FiLLiP filed", "timeline": "Day 6-10", "body": "Incorporation form with LLP agreement.", "visual": "form", "milestone": "FiLLiP submitted to MCA"},
  {"step": 6, "title": "Certificate issued", "timeline": "Day 10-14", "body": "LLPIN and PAN generated.", "visual": "stamp", "isCompletion": true, "milestone": "Certificate of Incorporation issued"}
]'::jsonb
WHERE slug = 'llp-registration';

-- Also update llp-incorporation if it exists (some references use this slug)
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Partner details", "timeline": "Day 0", "body": "Names, contribution, profit sharing ratio.", "visual": "checklist", "milestone": "Company secretary assigned"},
  {"step": 2, "title": "Upload documents", "timeline": "Day 0-2", "body": "PAN, Aadhaar, photo for all partners.", "visual": "upload", "milestone": "Documents verified by CS"},
  {"step": 3, "title": "DSC obtained", "timeline": "Day 2-4", "body": "Digital signatures for designated partners.", "visual": "form", "milestone": "DPIN applications filed"},
  {"step": 4, "title": "Name approved", "timeline": "Day 4-6", "body": "RUN-LLP approved by MCA.", "visual": "form", "milestone": "LLP name approved"},
  {"step": 5, "title": "FiLLiP filed", "timeline": "Day 6-10", "body": "Incorporation form with LLP agreement.", "visual": "form", "milestone": "FiLLiP submitted to MCA"},
  {"step": 6, "title": "Certificate issued", "timeline": "Day 10-14", "body": "LLPIN and PAN generated.", "visual": "stamp", "isCompletion": true, "milestone": "Certificate of Incorporation issued"}
]'::jsonb
WHERE slug = 'llp-incorporation';

-- Partnership Registration
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Partner details", "timeline": "Day 0-1", "body": "Names, capital, profit ratio, roles.", "visual": "checklist", "milestone": "Details received"},
  {"step": 2, "title": "Deed drafted", "timeline": "Day 1-3", "body": "Custom deed with all clauses.", "visual": "form", "milestone": "Deed ready"},
  {"step": 3, "title": "Review & approve", "timeline": "Day 3-4", "body": "You review and request changes.", "visual": "checklist", "milestone": "Deed approved"},
  {"step": 4, "title": "Stamp paper", "timeline": "Day 4-5", "body": "Appropriate value arranged.", "visual": "form", "milestone": "Deed signed"},
  {"step": 5, "title": "Firm registered", "timeline": "Day 5-7", "body": "Certificate from Registrar.", "visual": "stamp", "isCompletion": true, "milestone": "Firm registered"}
]'::jsonb
WHERE slug = 'partnership-registration';

-- Udyam Registration
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Share Aadhaar & PAN", "timeline": "Day 0", "body": "Owner Aadhaar for OTP, business PAN.", "visual": "upload", "milestone": "Details received"},
  {"step": 2, "title": "Verify eligibility", "timeline": "Day 0", "body": "Check investment and turnover limits.", "visual": "checklist", "milestone": "Eligibility verified"},
  {"step": 3, "title": "Application filed", "timeline": "Day 1", "body": "Submitted on Udyam portal.", "visual": "form", "milestone": "Application submitted"},
  {"step": 4, "title": "Certificate issued", "timeline": "Day 1-2", "body": "URN generated instantly.", "visual": "stamp", "isCompletion": true, "milestone": "MSME registered"}
]'::jsonb
WHERE slug = 'udyam-registration';

-- Also update msme-registration if it exists
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Share Aadhaar & PAN", "timeline": "Day 0", "body": "Owner Aadhaar for OTP, business PAN.", "visual": "upload", "milestone": "Details received"},
  {"step": 2, "title": "Verify eligibility", "timeline": "Day 0", "body": "Check investment and turnover limits.", "visual": "checklist", "milestone": "Eligibility verified"},
  {"step": 3, "title": "Application filed", "timeline": "Day 1", "body": "Submitted on Udyam portal.", "visual": "form", "milestone": "Application submitted"},
  {"step": 4, "title": "Certificate issued", "timeline": "Day 1-2", "body": "URN generated instantly.", "visual": "stamp", "isCompletion": true, "milestone": "MSME registered"}
]'::jsonb
WHERE slug = 'msme-registration';

-- GST Cancellation
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Liability review", "timeline": "Day 0-2", "body": "Check ITC balance and pending dues.", "visual": "checklist", "milestone": "Liability reviewed"},
  {"step": 2, "title": "Pending returns", "timeline": "Day 2-5", "body": "All GSTR-1 and 3B filed.", "visual": "form", "milestone": "Returns cleared"},
  {"step": 3, "title": "GSTR-10 prepared", "timeline": "Day 5-8", "body": "Final return with ITC reversal.", "visual": "form", "milestone": "Final return ready"},
  {"step": 4, "title": "REG-16 filed", "timeline": "Day 8-12", "body": "Cancellation application submitted.", "visual": "form", "milestone": "Cancellation filed"},
  {"step": 5, "title": "GSTIN cancelled", "timeline": "Day 12-15", "body": "Cancellation order issued.", "visual": "stamp", "isCompletion": true, "milestone": "GST cancelled"}
]'::jsonb
WHERE slug = 'gst-cancellation';

-- GST Revocation
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Review order", "timeline": "Day 0-1", "body": "Understand cancellation reason.", "visual": "checklist", "milestone": "Order reviewed"},
  {"step": 2, "title": "Check eligibility", "timeline": "Day 1", "body": "Must be within 30 days.", "visual": "checklist", "milestone": "Eligibility confirmed"},
  {"step": 3, "title": "File returns", "timeline": "Day 1-5", "body": "All pending GSTR-1, 3B filed.", "visual": "form", "milestone": "Returns filed"},
  {"step": 4, "title": "REG-21 filed", "timeline": "Day 5-8", "body": "Revocation application.", "visual": "form", "milestone": "Revocation filed"},
  {"step": 5, "title": "GSTIN restored", "timeline": "Day 8-10", "body": "Account reactivated.", "visual": "stamp", "isCompletion": true, "milestone": "GST active again"}
]'::jsonb
WHERE slug = 'gst-revocation';

-- Import Export Code
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Share details", "timeline": "Day 0", "body": "Business PAN, bank account, address.", "visual": "checklist", "milestone": "Expert assigned"},
  {"step": 2, "title": "Upload documents", "timeline": "Day 0-1", "body": "PAN, cancelled cheque, GST cert.", "visual": "upload", "milestone": "Documents verified"},
  {"step": 3, "title": "Application filed", "timeline": "Day 1-2", "body": "DGFT application submitted.", "visual": "form", "milestone": "Application submitted"},
  {"step": 4, "title": "IEC issued", "timeline": "Day 2-3", "body": "10-digit code delivered.", "visual": "stamp", "isCompletion": true, "milestone": "IEC certificate issued"}
]'::jsonb
WHERE slug = 'import-export-code';

-- Also update iec-code if it exists
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Share details", "timeline": "Day 0", "body": "Business PAN, bank account, address.", "visual": "checklist", "milestone": "Expert assigned"},
  {"step": 2, "title": "Upload documents", "timeline": "Day 0-1", "body": "PAN, cancelled cheque, GST cert.", "visual": "upload", "milestone": "Documents verified"},
  {"step": 3, "title": "Application filed", "timeline": "Day 1-2", "body": "DGFT application submitted.", "visual": "form", "milestone": "Application submitted"},
  {"step": 4, "title": "IEC issued", "timeline": "Day 2-3", "body": "10-digit code delivered.", "visual": "stamp", "isCompletion": true, "milestone": "IEC certificate issued"}
]'::jsonb
WHERE slug = 'iec-code';

-- Startup India Registration
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Share details", "timeline": "Day 0", "body": "Incorporation cert, pitch deck.", "visual": "checklist", "milestone": "Details received"},
  {"step": 2, "title": "Upload documents", "timeline": "Day 0-2", "body": "All required startup proofs.", "visual": "upload", "milestone": "Application ready"},
  {"step": 3, "title": "Application filed", "timeline": "Day 2-3", "body": "DPIIT portal submission.", "visual": "form", "milestone": "Application filed"},
  {"step": 4, "title": "DPIIT review", "timeline": "Day 3-7", "body": "Department processes.", "visual": "form", "milestone": "Under review"},
  {"step": 5, "title": "Recognition", "timeline": "Day 7-10", "body": "Startup India certificate.", "visual": "stamp", "isCompletion": true, "milestone": "Startup recognized"}
]'::jsonb
WHERE slug = 'startup-india-registration';

-- Also update startup-india if it exists
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Share details", "timeline": "Day 0", "body": "Incorporation cert, pitch deck.", "visual": "checklist", "milestone": "Details received"},
  {"step": 2, "title": "Upload documents", "timeline": "Day 0-2", "body": "All required startup proofs.", "visual": "upload", "milestone": "Application ready"},
  {"step": 3, "title": "Application filed", "timeline": "Day 2-3", "body": "DPIIT portal submission.", "visual": "form", "milestone": "Application filed"},
  {"step": 4, "title": "DPIIT review", "timeline": "Day 3-7", "body": "Department processes.", "visual": "form", "milestone": "Under review"},
  {"step": 5, "title": "Recognition", "timeline": "Day 7-10", "body": "Startup India certificate.", "visual": "stamp", "isCompletion": true, "milestone": "Startup recognized"}
]'::jsonb
WHERE slug = 'startup-india';

-- Trademark Registration
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Search conflicts", "timeline": "Day 0-1", "body": "Check existing trademarks.", "visual": "checklist", "milestone": "Attorney assigned, search started"},
  {"step": 2, "title": "Application filed", "timeline": "Day 1-3", "body": "TM-A form submitted.", "visual": "form", "milestone": "Application filed, receipt received"},
  {"step": 3, "title": "Examination", "timeline": "Day 30-90", "body": "Registrar reviews.", "visual": "form", "milestone": "Under examination"},
  {"step": 4, "title": "Publication", "timeline": "Day 90-120", "body": "4-month opposition period.", "visual": "form", "milestone": "Published for opposition"},
  {"step": 5, "title": "Registered", "timeline": "Day 180+", "body": "TM certificate issued.", "visual": "stamp", "isCompletion": true, "milestone": "Trademark registered"}
]'::jsonb
WHERE slug = 'trademark-registration';

-- FSSAI Basic
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Share details", "timeline": "Day 0", "body": "Business type, food category.", "visual": "checklist", "milestone": "License type determined"},
  {"step": 2, "title": "Upload documents", "timeline": "Day 0-1", "body": "ID proof, address proof.", "visual": "upload", "milestone": "Documents verified"},
  {"step": 3, "title": "Application filed", "timeline": "Day 1-2", "body": "FoSCoS portal submission.", "visual": "form", "milestone": "Application submitted"},
  {"step": 4, "title": "License issued", "timeline": "Day 2-7", "body": "14-digit FSSAI number.", "visual": "stamp", "isCompletion": true, "milestone": "FSSAI license active"}
]'::jsonb
WHERE slug = 'fssai-basic';

-- FSSAI State
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Share details", "timeline": "Day 0", "body": "Business scale, food types.", "visual": "checklist", "milestone": "License type determined"},
  {"step": 2, "title": "Upload documents", "timeline": "Day 0-2", "body": "All compliance documents.", "visual": "upload", "milestone": "Documents verified"},
  {"step": 3, "title": "Application filed", "timeline": "Day 2-3", "body": "FoSCoS submission.", "visual": "form", "milestone": "Application submitted"},
  {"step": 4, "title": "Processing", "timeline": "Day 3-20", "body": "State authority review.", "visual": "form", "milestone": "Inspection scheduled"},
  {"step": 5, "title": "License issued", "timeline": "Day 20-30", "body": "State FSSAI license.", "visual": "stamp", "isCompletion": true, "milestone": "FSSAI license active"}
]'::jsonb
WHERE slug = 'fssai-state';

-- FSSAI Central
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Share details", "timeline": "Day 0", "body": "Multi-state operations info.", "visual": "checklist", "milestone": "License type determined"},
  {"step": 2, "title": "Upload documents", "timeline": "Day 0-3", "body": "Detailed compliance docs.", "visual": "upload", "milestone": "Documents verified"},
  {"step": 3, "title": "Application filed", "timeline": "Day 3-5", "body": "Central FSSAI submission.", "visual": "form", "milestone": "Application submitted"},
  {"step": 4, "title": "Processing", "timeline": "Day 5-45", "body": "Central authority review.", "visual": "form", "milestone": "Inspection scheduled"},
  {"step": 5, "title": "License issued", "timeline": "Day 45-60", "body": "Central FSSAI license.", "visual": "stamp", "isCompletion": true, "milestone": "FSSAI license active"}
]'::jsonb
WHERE slug = 'fssai-central';

-- Also update fssai-license if it exists
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Share details", "timeline": "Day 0", "body": "Business type, food category.", "visual": "checklist", "milestone": "License type determined"},
  {"step": 2, "title": "Upload documents", "timeline": "Day 0-1", "body": "ID proof, address proof.", "visual": "upload", "milestone": "Documents verified"},
  {"step": 3, "title": "Application filed", "timeline": "Day 2-4", "body": "FoSCoS portal submission.", "visual": "form", "milestone": "Application submitted"},
  {"step": 4, "title": "Inspection", "timeline": "Day 5-8", "body": "If required for State/Central.", "visual": "calendar", "milestone": "Inspection scheduled"},
  {"step": 5, "title": "License issued", "timeline": "Day 8-10", "body": "14-digit FSSAI number.", "visual": "stamp", "isCompletion": true, "milestone": "FSSAI license active"}
]'::jsonb
WHERE slug = 'fssai-license';

-- GST Monthly Filing packages
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Share invoices", "timeline": "By 5th", "body": "Sales and purchase data.", "visual": "upload", "milestone": "Data received for the month"},
  {"step": 2, "title": "GSTR-1 filed", "timeline": "By 11th", "body": "Outward supplies return.", "visual": "form", "milestone": "GSTR-1 filed and acknowledged"},
  {"step": 3, "title": "GSTR-3B filed", "timeline": "By 20th", "body": "Summary return with tax payment.", "visual": "form", "milestone": "GSTR-3B filed and acknowledged"},
  {"step": 4, "title": "Report delivered", "timeline": "By 25th", "body": "Monthly compliance summary.", "visual": "stamp", "isCompletion": true, "milestone": "Monthly report delivered"}
]'::jsonb
WHERE slug LIKE 'gst-monthly%';

-- Business ITR
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Share documents", "timeline": "Day 0-2", "body": "P&L, balance sheet, bank.", "visual": "upload", "milestone": "Documents received and assigned to CA"},
  {"step": 2, "title": "Tax computed", "timeline": "Day 2-5", "body": "Calculate liability.", "visual": "form", "milestone": "Draft computation shared"},
  {"step": 3, "title": "Review draft", "timeline": "Day 5-7", "body": "You approve return.", "visual": "checklist", "milestone": "Draft approved"},
  {"step": 4, "title": "ITR filed", "timeline": "Day 7-10", "body": "Submitted with e-verify.", "visual": "form", "milestone": "ITR submitted to Income Tax portal"},
  {"step": 5, "title": "Acknowledgment", "timeline": "Day 10", "body": "ITR-V delivered.", "visual": "stamp", "isCompletion": true, "milestone": "ITR-V acknowledgement delivered"}
]'::jsonb
WHERE slug = 'business-itr';

-- Personal ITR
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Share documents", "timeline": "Day 0-1", "body": "Form 16, investments.", "visual": "upload", "milestone": "Documents received"},
  {"step": 2, "title": "Tax computed", "timeline": "Day 1-2", "body": "Optimize deductions.", "visual": "form", "milestone": "Tax computation ready"},
  {"step": 3, "title": "ITR filed", "timeline": "Day 2-3", "body": "e-Filed and verified.", "visual": "stamp", "isCompletion": true, "milestone": "ITR-V delivered"}
]'::jsonb
WHERE slug = 'personal-itr';

-- TDS Return packages
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Share challans", "timeline": "Day 0-2", "body": "TDS payments and deductee info.", "visual": "upload", "milestone": "Data received"},
  {"step": 2, "title": "Return prepared", "timeline": "Day 2-4", "body": "Form 24Q/26Q drafted.", "visual": "form", "milestone": "Return ready for review"},
  {"step": 3, "title": "Return filed", "timeline": "Day 4-5", "body": "Submitted on TRACES.", "visual": "stamp", "isCompletion": true, "milestone": "TDS return filed"}
]'::jsonb
WHERE slug LIKE 'tds-return%';

-- TDS Monthly Compliance
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Share payment register", "timeline": "Day 1-5", "body": "Upload salary, vendor, rent payments.", "visual": "upload", "milestone": "Data received"},
  {"step": 2, "title": "TDS calculated", "timeline": "Day 5-6", "body": "TDS for each category calculated.", "visual": "form", "milestone": "Challans ready"},
  {"step": 3, "title": "Challans paid", "timeline": "Day 6-7", "body": "You pay through net banking.", "visual": "stamp", "milestone": "TDS deposited"},
  {"step": 4, "title": "Quarterly return", "timeline": "Quarter end", "body": "Form 24Q, 26Q filed.", "visual": "form", "isCompletion": true, "milestone": "TDS return filed"}
]'::jsonb
WHERE slug = 'tds-monthly-compliance';

-- Payroll packages
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Share attendance", "timeline": "By 25th", "body": "Employee hours and leaves.", "visual": "upload", "milestone": "Payroll specialist assigned"},
  {"step": 2, "title": "Payroll processed", "timeline": "By 28th", "body": "Salaries calculated.", "visual": "form", "milestone": "Salary calculation ready"},
  {"step": 3, "title": "Salaries disbursed", "timeline": "By 30th", "body": "Transfers and challans.", "visual": "stamp", "milestone": "Salaries disbursed"},
  {"step": 4, "title": "Statutory filed", "timeline": "By 15th", "body": "PF, ESIC, PT submitted.", "visual": "stamp", "isCompletion": true, "milestone": "Month-end complete"}
]'::jsonb
WHERE slug LIKE 'payroll%';

-- Annual Compliance Pvt Ltd
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Collect records", "timeline": "Day 0-5", "body": "All company documents.", "visual": "upload", "milestone": "CS assigned"},
  {"step": 2, "title": "Financials ready", "timeline": "Day 5-15", "body": "Balance sheet, P&L.", "visual": "form", "milestone": "Documents reviewed by CS"},
  {"step": 3, "title": "AOC-4 filed", "timeline": "Day 15-20", "body": "Financials to MCA.", "visual": "form", "milestone": "Draft forms sent for approval"},
  {"step": 4, "title": "MGT-7 filed", "timeline": "Day 20-25", "body": "Annual return to MCA.", "visual": "form", "milestone": "Forms filed with MCA"},
  {"step": 5, "title": "Compliance done", "timeline": "Day 25-30", "body": "All filings complete.", "visual": "stamp", "isCompletion": true, "milestone": "AOC-4 and MGT-7 filed"}
]'::jsonb
WHERE slug = 'annual-compliance-pvt-ltd';

-- MCA Annual Filing
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Collect records", "timeline": "Day 0-2", "body": "Company CIN, AGM date, audited financials.", "visual": "checklist", "milestone": "CS assigned"},
  {"step": 2, "title": "Upload financials", "timeline": "Day 0-2", "body": "Balance sheet, P&L, director report.", "visual": "upload", "milestone": "Documents reviewed by CS"},
  {"step": 3, "title": "Forms drafted", "timeline": "Day 2-4", "body": "AOC-4 and MGT-7 prepared.", "visual": "form", "milestone": "Draft forms sent for approval"},
  {"step": 4, "title": "Filed on MCA21", "timeline": "Day 5-7", "body": "Both forms submitted.", "visual": "stamp", "isCompletion": true, "milestone": "AOC-4 and MGT-7 filed"}
]'::jsonb
WHERE slug = 'mca-annual-filing';

-- Director KYC
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Upload PAN & Aadhaar", "timeline": "Day 0", "body": "Two documents, CS assigned in 4 hours.", "visual": "upload", "milestone": "Documents received, DIN status checked"},
  {"step": 2, "title": "DIR-3 KYC filed", "timeline": "Day 1", "body": "Form filed on MCA21 portal.", "visual": "form", "milestone": "DIR-3 KYC submitted to MCA"},
  {"step": 3, "title": "Acknowledgement", "timeline": "Day 1-2", "body": "MCA processes within 24 hours.", "visual": "stamp", "isCompletion": true, "milestone": "DIN verified and active"}
]'::jsonb
WHERE slug = 'director-kyc';

-- GST Annual Return
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Share GST data", "timeline": "Day 0-3", "body": "Monthly GSTR-1 and GSTR-3B data.", "visual": "upload", "milestone": "Data received"},
  {"step": 2, "title": "Reconciliation", "timeline": "Day 3-8", "body": "Monthly returns reconciled.", "visual": "form", "milestone": "Reconciliation complete"},
  {"step": 3, "title": "Draft GSTR-9", "timeline": "Day 8-12", "body": "Annual return prepared.", "visual": "checklist", "milestone": "Draft approved"},
  {"step": 4, "title": "GSTR-9 filed", "timeline": "Day 12-14", "body": "Filed on GST portal.", "visual": "stamp", "isCompletion": true, "milestone": "GSTR-9 filed"}
]'::jsonb
WHERE slug = 'gst-annual-return';

-- GST LUT
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Share GST details", "timeline": "Day 0", "body": "GSTIN and export data.", "visual": "upload", "milestone": "Details received"},
  {"step": 2, "title": "LUT filed", "timeline": "Day 1-2", "body": "Form GST RFD-11 submitted.", "visual": "form", "milestone": "LUT filed"},
  {"step": 3, "title": "ARN received", "timeline": "Day 2", "body": "Acknowledgement received.", "visual": "stamp", "isCompletion": true, "milestone": "LUT active"}
]'::jsonb
WHERE slug = 'gst-lut';

-- Company Closure/Strike-Off
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Pre-closure compliance", "timeline": "Day 0-15", "body": "Clear pending returns and KYC.", "visual": "checklist", "milestone": "Compliance up to date"},
  {"step": 2, "title": "Board resolution", "timeline": "Day 15-25", "body": "Resolution for strike-off.", "visual": "form", "milestone": "Resolutions passed"},
  {"step": 3, "title": "Affidavit prepared", "timeline": "Day 25-35", "body": "Indemnity bond and statements.", "visual": "form", "milestone": "Documents ready"},
  {"step": 4, "title": "STK-2 filed", "timeline": "Day 35-45", "body": "Strike-off application to MCA.", "visual": "form", "milestone": "STK-2 filed"},
  {"step": 5, "title": "Strike-off order", "timeline": "Day 45-90", "body": "ROC issues order.", "visual": "stamp", "isCompletion": true, "milestone": "Company closed"}
]'::jsonb
WHERE slug = 'company-closure';

-- LLP Closure
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Clear compliance", "timeline": "Day 0-15", "body": "Form 11, Form 8, Partner KYC.", "visual": "checklist", "milestone": "Compliance done"},
  {"step": 2, "title": "Partner consent", "timeline": "Day 15-20", "body": "All partners agree.", "visual": "form", "milestone": "Consent obtained"},
  {"step": 3, "title": "Form 24 filed", "timeline": "Day 20-30", "body": "Strike-off application.", "visual": "form", "milestone": "Form 24 filed"},
  {"step": 4, "title": "Strike-off order", "timeline": "Day 30-60", "body": "ROC issues order.", "visual": "stamp", "isCompletion": true, "milestone": "LLP closed"}
]'::jsonb
WHERE slug = 'llp-closure';

-- ROC Changes
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Identify change", "timeline": "Day 0-1", "body": "Director, address, shares, etc.", "visual": "checklist", "milestone": "Change identified"},
  {"step": 2, "title": "Resolution drafted", "timeline": "Day 1-3", "body": "Board/shareholder resolution.", "visual": "form", "milestone": "Documents ready"},
  {"step": 3, "title": "Form filed", "timeline": "Day 3-5", "body": "DIR-12, INC-22, SH-4, etc.", "visual": "form", "milestone": "Form filed"},
  {"step": 4, "title": "Confirmation", "timeline": "Day 5-7", "body": "ROC acknowledges.", "visual": "stamp", "isCompletion": true, "milestone": "Change registered"}
]'::jsonb
WHERE slug = 'roc-changes';

-- Accounting & Bookkeeping
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Share data", "timeline": "Day 1-5", "body": "Bank statement, invoices, bills.", "visual": "upload", "milestone": "Data received"},
  {"step": 2, "title": "Entries recorded", "timeline": "Day 5-8", "body": "All transactions posted.", "visual": "form", "milestone": "Books updated"},
  {"step": 3, "title": "Reconciliation", "timeline": "Day 8-10", "body": "Bank and GST matched.", "visual": "checklist", "milestone": "GST matched"},
  {"step": 4, "title": "Reports shared", "timeline": "Day 10", "body": "P&L and Balance Sheet.", "visual": "stamp", "isCompletion": true, "milestone": "Month closed"}
]'::jsonb
WHERE slug = 'accounting-bookkeeping';

-- Statutory Audit
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Engagement", "timeline": "Day 0-5", "body": "Audit planning and materiality.", "visual": "checklist", "milestone": "Audit planned"},
  {"step": 2, "title": "Fieldwork", "timeline": "Day 5-20", "body": "Testing and verification.", "visual": "form", "milestone": "Testing done"},
  {"step": 3, "title": "Draft report", "timeline": "Day 20-25", "body": "Findings shared.", "visual": "form", "milestone": "Draft ready"},
  {"step": 4, "title": "Final report", "timeline": "Day 25-30", "body": "Signed audit report.", "visual": "stamp", "isCompletion": true, "milestone": "Audit complete"}
]'::jsonb
WHERE slug = 'statutory-audit';

-- DIN Reactivation
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Check reason", "timeline": "Day 0-1", "body": "DIN deactivation cause.", "visual": "checklist", "milestone": "Reason identified"},
  {"step": 2, "title": "File pending KYC", "timeline": "Day 1-5", "body": "DIR-3 KYC for all years.", "visual": "form", "milestone": "KYC filed"},
  {"step": 3, "title": "Reactivation", "timeline": "Day 5-7", "body": "DIR-3C with fee paid.", "visual": "form", "milestone": "Application filed"},
  {"step": 4, "title": "DIN active", "timeline": "Day 7-10", "body": "Status changed to Active.", "visual": "stamp", "isCompletion": true, "milestone": "DIN active"}
]'::jsonb
WHERE slug = 'din-reactivation';

-- Company Name Change
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Name check", "timeline": "Day 0-2", "body": "MCA and trademark search.", "visual": "checklist", "milestone": "Name available"},
  {"step": 2, "title": "Resolutions", "timeline": "Day 2-7", "body": "Special resolution passed.", "visual": "form", "milestone": "Resolutions passed"},
  {"step": 3, "title": "RUN filed", "timeline": "Day 7-12", "body": "Reserve Unique Name.", "visual": "form", "milestone": "Name reserved"},
  {"step": 4, "title": "INC-24 filed", "timeline": "Day 12-18", "body": "Name change application.", "visual": "form", "milestone": "INC-24 filed"},
  {"step": 5, "title": "Certificate", "timeline": "Day 18-20", "body": "New certificate issued.", "visual": "stamp", "isCompletion": true, "milestone": "Name changed"}
]'::jsonb
WHERE slug = 'company-name-change';

-- Copyright Registration
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Work details", "timeline": "Day 0-2", "body": "Nature, date, author info.", "visual": "checklist", "milestone": "Details received"},
  {"step": 2, "title": "Application", "timeline": "Day 2-5", "body": "Form XIV prepared.", "visual": "form", "milestone": "Application ready"},
  {"step": 3, "title": "Filed", "timeline": "Day 5-10", "body": "Copyright Office submission.", "visual": "form", "milestone": "Application filed"},
  {"step": 4, "title": "Certificate", "timeline": "Day 10-30", "body": "Registration certificate.", "visual": "stamp", "isCompletion": true, "milestone": "Copyright registered"}
]'::jsonb
WHERE slug = 'copyright-registration';

-- ESI Registration
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Employee list", "timeline": "Day 0-1", "body": "Details with Aadhaar.", "visual": "upload", "milestone": "Details received"},
  {"step": 2, "title": "Application ready", "timeline": "Day 1-3", "body": "ESIC portal form.", "visual": "form", "milestone": "Application ready"},
  {"step": 3, "title": "Filed on ESIC", "timeline": "Day 3-5", "body": "Application submitted.", "visual": "form", "milestone": "Filed"},
  {"step": 4, "title": "Code issued", "timeline": "Day 5-7", "body": "Employer code received.", "visual": "stamp", "isCompletion": true, "milestone": "ESI registered"}
]'::jsonb
WHERE slug = 'esi-registration';

-- PF Registration
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Employee details", "timeline": "Day 0-2", "body": "List with Aadhaar and bank.", "visual": "upload", "milestone": "Details received"},
  {"step": 2, "title": "DSC obtained", "timeline": "Day 2-4", "body": "Signatory DSC for EPFO.", "visual": "form", "milestone": "DSC ready"},
  {"step": 3, "title": "Application filed", "timeline": "Day 4-7", "body": "EPFO registration.", "visual": "form", "milestone": "Filed"},
  {"step": 4, "title": "PF code issued", "timeline": "Day 7-10", "body": "Establishment code received.", "visual": "stamp", "isCompletion": true, "milestone": "PF registered"}
]'::jsonb
WHERE slug = 'pf-registration';

-- Shop and Establishment
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Premises details", "timeline": "Day 0-1", "body": "Shop name, address, employees.", "visual": "checklist", "milestone": "Details received"},
  {"step": 2, "title": "Application ready", "timeline": "Day 1-3", "body": "State portal form filled.", "visual": "form", "milestone": "Application ready"},
  {"step": 3, "title": "Filed", "timeline": "Day 3-8", "body": "Labour Department submission.", "visual": "form", "milestone": "Application filed"},
  {"step": 4, "title": "License issued", "timeline": "Day 8-10", "body": "Registration certificate.", "visual": "stamp", "isCompletion": true, "milestone": "License issued"}
]'::jsonb
WHERE slug = 'shop-establishment';

-- Professional Tax
UPDATE service_packages SET workflow_stages = '[
  {"step": 1, "title": "Business details", "timeline": "Day 0-1", "body": "Entity type, employee count.", "visual": "checklist", "milestone": "Details received"},
  {"step": 2, "title": "Application filed", "timeline": "Day 1-3", "body": "State commercial tax portal.", "visual": "form", "milestone": "Application submitted"},
  {"step": 3, "title": "Certificate issued", "timeline": "Day 3-5", "body": "PTEC/PTRC received.", "visual": "stamp", "isCompletion": true, "milestone": "PT registered"}
]'::jsonb
WHERE slug = 'professional-tax';
