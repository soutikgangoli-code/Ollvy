# OLLVY — COMPLETE SERVICE CONFIGURATIONS
## Document for Claude Code Implementation

**Version**: 1.1  
**Services**: 19 total across 5 groups  
**Purpose**: Definitive data spec for platform order flow, questionnaire, documents, workflow stages, and deliverables per service

---

## SECTION 1: PLATFORM ORDER FLOW — CANONICAL MODEL

This is the single source of truth for how every order on Ollvy works, end to end. Build the customer-facing app exactly against this model.

---

### ORDER LIFECYCLE (applies to every service)

**Step 1 — Payment**
Customer pays for the service. Order is created in the system.

**Step 2 — Questionnaire**
Customer answers service-specific questions. All questions are defined in Part 1 of this document per service. Conditional fields show/hide based on prior answers. Repeater sections handle multiple directors, partners, etc.

**Step 3 — Initial Document Upload**
Customer uploads all documents listed under `initial_documents` in Part 2 of this document. These are collected upfront before any work begins.

**Step 4 — Admin Works / Stage Progression**
From this point, the order moves through service-specific workflow stages. Each stage is defined in Part 1 under WORKFLOW STAGES per service.

- The admin works within each stage — filing applications, drafting documents, communicating with government portals.
- When the admin is satisfied that a stage is complete, they click an **Approve** button on the admin panel. This approval trigger automatically advances the order to the next stage.
- **The admin Approve button UI is not yet built. Claude Code should build the customer-facing flow assuming stage advancement happens as a system event — do not build admin approval UI.**

**Step 5 — Document Exchange During Stages (Work Documents)**
At any stage, the admin may need to send documents to the customer (for download and signing) or request documents from the customer (additional proofs, signed forms, etc.).

- All work documents per stage are defined under `work_documents` in Part 2 per service.
- `direction: to_customer` = admin uploads a document → customer sees it in that stage and downloads it.
- `direction: from_customer` = customer is expected to upload a document at that stage → admin receives it.

**How customer handles sign-and-return documents:**
- Admin uploads draft document(s) to a stage (e.g., MOA draft, DIR-2 consent, INC-9 declaration).
- Customer opens the app, opens that stage, and sees the document(s) waiting.
- Customer downloads each document individually, OR downloads all documents for that stage as a **ZIP file** (ZIP download button is inside the stage view, not on the order summary page).
- Customer signs and scans offline, then uploads the signed copies back within the same stage in the app — one by one or together.
- Multiple documents at the same stage go out to the customer simultaneously. Customer handles them at their own pace and uploads back individually or in bulk.
- If documents at a stage must come back before the next stage can begin, the admin waits for all uploads before approving.

**Step 6 — Government Queries (handled as stages)**
If a government officer raises a query post-filing (e.g., GST REG-03, RoC objection, FSSAI inspection deficiency):
- The admin adds this as a **stage in the process timeline** — it is not a separate system or parallel thread.
- Admin uploads the query document (what the officer asked for) to that stage.
- Customer sees it in the timeline, uploads their response document.
- Admin picks it up, responds to the government.
- Same document flow model as every other stage — no special handling needed.

**Step 7 — Final Deliverables**
When the service is complete, admin uploads the final certificates, registration documents, and deliverables to the final stage. Customer downloads them from within that stage.

---

### NOTIFICATIONS

**For now: none.**
No push notifications, no WhatsApp notifications, no email triggers on stage updates or document uploads. The customer sees updates passively — the next time they open the app, they see the current state of their order and any new documents waiting for them.

*This is intentional for V1. Do not build notification infrastructure.*

---

### OTP HANDLING

Services that require Aadhaar OTP authentication (GST Registration, MSME/Udyam Registration, and others) handle OTP entirely **outside the app**. The CA contacts the customer directly via **WhatsApp** to request the OTP at the moment it is needed on the government portal. The app has zero involvement in OTP flow — no OTP input field, no OTP step, no prompt. The Aadhaar card tip in the initial documents for relevant services simply informs the customer to keep their Aadhaar-linked mobile available.

---

### KEY RULES FOR CLAUDE CODE

- All timelines already include a realistic buffer. Do NOT add further buffer to displayed timelines.
- "Conditional" fields: render only when the triggering condition is met. Condition is stated in the Required column in Part 1.
- "Repeater" sections: render as a dynamic add/remove UI block with the stated min/max constraints.
- For selects with `[All 28 States + 8 UTs]` — implement a standard Indian state/UT dropdown.
- For selects with `[Auto-populate based on state]` — filter district list by selected state.
- Validation patterns: PAN = `/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/`, GSTIN = 15-char, Aadhaar = 12 digits numeric, Pincode = 6 digits numeric, IFSC = 11-char alphanumeric.
- All document uploads: max file size 10MB per file unless otherwise specified.
- All timelines are working days unless stated otherwise.
- ZIP download of stage documents: available inside each stage view. Not on the order summary page.
- No document editing inside the app. Download → sign offline → upload back. No in-app editor.
- Admin approval UI: do not build. Assume stage advancement is triggered by a system event.
- No notification system of any kind in V1.

---

---

# GROUP 1: REGISTRATIONS

---

## SERVICE: GST Registration
## SLUG: `gst-registration`

### QUESTIONNAIRE

**Step 1: Business Entity**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | What type of business entity are you registering? | entity_type | select | Sole Proprietorship, Partnership Firm, Private Limited Company, One Person Company, LLP, Hindu Undivided Family (HUF), Trust / Society / Club, Government Entity | Yes | Select entity type | — |
| 2 | What is the legal name of the business? | legal_name | text | — | Yes | As per PAN card | Must match PAN exactly |
| 3 | Do you have a trade name different from the legal name? | has_trade_name | radio | Yes, No | Yes | — | — |
| 4 | Trade name (if different) | trade_name | text | — | Conditional: has_trade_name = Yes | e.g., Sharma Electronics | — |
| 5 | PAN of the business / proprietor | pan_number | text | — | Yes | e.g., ABCDE1234F | PAN format |
| 6 | Is your annual turnover likely to exceed ₹40 lakhs (goods) or ₹20 lakhs (services)? | turnover_threshold | radio | Yes, No, Not Sure | Yes | — | — |
| 7 | Are you registering voluntarily (below threshold)? | voluntary_registration | radio | Yes, No | Conditional: turnover_threshold = No | — | — |
| 8 | Is this registration required for inter-state supply? | interstate_supply | radio | Yes, No | Yes | — | — |

**Step 2: Business Address (Principal Place of Business)**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | State | state | select | [All 28 States + 8 UTs] | Yes | Select state | — |
| 2 | District | district | select | [Auto-populate based on state] | Yes | Select district | — |
| 3 | Pincode | pincode | text | — | Yes | e.g., 110001 | 6 digits, valid for selected state |
| 4 | Full address (Building / Street / Area) | address_line | textarea | — | Yes | Flat No., Building Name, Street, Area | Min 20 chars |
| 5 | Nature of premises | premises_type | select | Own, Rented, Leased, Shared / Consent, SEZ | Yes | Select premises type | — |
| 6 | Do you have any additional places of business in India? | has_additional_premises | radio | Yes, No | Yes | — | — |
| 7 | Additional place of business — State | add_premises_state | select | [All 28 States + 8 UTs] | Conditional: has_additional_premises = Yes | Select state | — |
| 8 | Additional place of business — Address | add_premises_address | textarea | — | Conditional: has_additional_premises = Yes | Full address | — |

**Step 3: Business Activity**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Nature of business (select all that apply) | nature_of_business | multiselect | Manufacturer, Trader / Reseller, Service Provider, Works Contractor, E-Commerce Operator, E-Commerce Seller, Importer, Exporter, Leasing / Rental | Yes | — | At least 1 |
| 2 | Describe your main business activity in detail | business_description | textarea | — | Yes | e.g., Retail sale of readymade garments | Min 50 chars |
| 3 | Primary goods/services you deal in | primary_goods_services | text | — | Yes | e.g., Men's clothing, accounting software | — |
| 4 | Do you know your HSN/SAC code? | knows_hsn | radio | Yes, No | Yes | — | — |
| 5 | HSN / SAC Code (if known) | hsn_sac_code | text | — | Conditional: knows_hsn = Yes | e.g., 6203, 998311 | — |
| 6 | Expected annual turnover (approx.) | expected_turnover | select | Below ₹20 lakhs, ₹20L – ₹40L, ₹40L – ₹1.5Cr, ₹1.5Cr – ₹5Cr, Above ₹5Cr | Yes | — | — |

**Step 4: Authorized Signatory**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Name of authorized signatory | signatory_name | text | — | Yes | Full name as per PAN | — |
| 2 | Designation / Title | signatory_designation | text | — | Yes | e.g., Proprietor, Director, Partner | — |
| 3 | PAN of authorized signatory | signatory_pan | text | — | Yes | e.g., ABCDE1234F | Valid PAN; if Sole Proprietorship must match business PAN |
| 4 | Aadhaar number of authorized signatory | signatory_aadhaar | text | — | Yes | 12-digit Aadhaar number | 12 digits numeric |
| 5 | Mobile number of authorized signatory | signatory_mobile | tel | — | Yes | Linked to Aadhaar | 10 digits |
| 6 | Email of authorized signatory | signatory_email | email | — | Yes | — | Valid email |

**Step 5: Bank Account Details**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Account holder name | bank_account_name | text | — | Yes | As per bank records | — |
| 2 | Bank name | bank_name | text | — | Yes | e.g., HDFC Bank | — |
| 3 | Account number | bank_account_number | text | — | Yes | — | 9–18 digits numeric |
| 4 | IFSC code | ifsc_code | text | — | Yes | e.g., HDFC0001234 | 11 chars alphanumeric |
| 5 | Account type | bank_account_type | select | Current, Savings, Cash Credit, Overdraft | Yes | Select account type | — |

---

### DOCUMENTS REQUIRED

| # | Document | Key | Required | Formats | Help Text |
|---|----------|-----|----------|---------|-----------|
| 1 | PAN Card of business / proprietor | pan_card | Yes | PDF, JPG, PNG | Clear legible scan; name must match application |
| 2 | Aadhaar Card of authorized signatory | aadhaar_card | Yes | PDF, JPG, PNG | Both front and back on single file preferred |
| 3 | Photograph of authorized signatory | signatory_photo | Yes | JPG, PNG | Recent passport-size, white background |
| 4 | Proof of principal place of business | premises_proof | Yes | PDF, JPG, PNG | Rent agreement / Lease deed / Electricity bill / Property tax receipt / NOC from owner |
| 5 | Bank account proof | bank_proof | Yes | PDF, JPG, PNG | Cancelled cheque with pre-printed name, or bank statement first page |
| 6 | Certificate of Incorporation / Registration | entity_proof | Conditional: entity_type ≠ Sole Proprietorship | PDF | CoI for companies, Partnership deed for firms, LLP agreement for LLPs |
| 7 | Board Resolution / Authorization letter | authorization_letter | Conditional: entity_type = Pvt Ltd, LLP, or OPC | PDF | Authorizing the signatory to apply for GST |
| 8 | Partnership Deed | partnership_deed | Conditional: entity_type = Partnership Firm | PDF | Registered or unregistered |
| 9 | Memorandum and Articles of Association | moa_aoa | Conditional: entity_type = Pvt Ltd or OPC | PDF | Both MOA and AOA |
| 10 | NOC from property owner | noc_owner | Conditional: premises_type = Shared / Consent | PDF, JPG | Signed letter from property owner |

---

### WORKFLOW STAGES

| Step | Title | Timeline | Description |
|------|-------|----------|-------------|
| 1 | Document Collection & Verification | Day 0–1 | Documents reviewed for completeness and regulatory compliance. Missing or unclear documents flagged immediately. |
| 2 | Application Preparation | Day 1–2 | CA prepares REG-01 application on GST portal, maps HSN/SAC codes, drafts business description. |
| 3 | OTP Verification | Day 2 | OTP sent to Aadhaar-linked mobile of authorized signatory. Required for Aadhaar authentication on GST portal. |
| 4 | Application Filing & ARN Generation | Day 2–3 | Application filed on GST Common Portal. ARN issued immediately upon submission. |
| 5 | Government Processing | Day 3–7 | GST officer reviews. May raise query (REG-03); we respond on your behalf within prescribed time. |
| 6 | GSTIN Allotment | Day 7 | GSTIN allotted automatically if no queries, or after successful query response. |

---

### DELIVERABLES

| Deliverable | Type | When |
|-------------|------|------|
| ARN (Application Reference Number) | Reference Number | Immediately after filing |
| GSTIN (15-digit GST Identification Number) | Reference Number | On approval |
| GST Registration Certificate (REG-06) | PDF Download | On approval |

### VALIDITY & RENEWAL
- **Validity**: Lifetime (no expiry unless cancelled)
- **Renewal Required**: No
- **Compliance Calendar**: GSTR-1 (10th following month or quarterly), GSTR-3B (20th/22nd/24th based on state and turnover), GSTR-9 annual (31st December)

---

## SERVICE: MSME / Udyam Registration
## SLUG: `msme-registration`

### QUESTIONNAIRE

**Step 1: Entity & Owner Details**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Type of enterprise / entity | entity_type | select | Proprietorship, Partnership Firm, Hindu Undivided Family, Company (Pvt/Public/OPC), Co-operative Society, LLP, Trust, Society | Yes | Select entity type | — |
| 2 | Name of enterprise | enterprise_name | text | — | Yes | As per registration / PAN | — |
| 3 | Name of owner / promoter (Aadhaar holder) | owner_name | text | — | Yes | Full name as per Aadhaar | Must match Aadhaar exactly |
| 4 | Aadhaar number of owner / promoter | owner_aadhaar | text | — | Yes | 12-digit Aadhaar | 12 digits numeric |
| 5 | Mobile number linked to Aadhaar | aadhaar_mobile | tel | — | Yes | Aadhaar-linked number | 10 digits; OTP sent here |
| 6 | PAN of the enterprise | entity_pan | text | — | Yes | e.g., ABCDE1234F | 10-char PAN |
| 7 | Gender of owner | owner_gender | select | Male, Female, Other | Yes | — | — |
| 8 | Social category of owner | owner_category | select | General, SC, ST, OBC | Yes | — | — |
| 9 | Specially abled (PwD)? | is_pwd | radio | Yes, No | Yes | — | — |

**Step 2: Business Details**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Date of commencement of business | commencement_date | date | — | Yes | — | Past date |
| 2 | Is the enterprise already registered under any previous MSME / EM-II / UAM scheme? | has_previous_registration | radio | Yes, No | Yes | — | — |
| 3 | Previous registration number (EM-II / UAM) | previous_reg_number | text | — | Conditional: has_previous_registration = Yes | e.g., DL01E0012345 | — |
| 4 | Primary activity | nic_activity | select | Manufacturing, Service | Yes | Select primary activity | — |
| 5 | Detailed NIC 5-digit code / business activity | nic_code | text | — | Yes | e.g., 10101 – Rice milling | — |
| 6 | Number of persons employed (current) | employee_count | number | — | Yes | e.g., 12 | Positive integer |
| 7 | Investment in plant and machinery / equipment (₹ lakhs) | plant_investment | number | — | Yes | e.g., 50 | Decimal allowed |
| 8 | Turnover for previous financial year (₹ lakhs) | annual_turnover | number | — | Yes | e.g., 250 | Decimal allowed |
| 9 | Does the enterprise have GST registration? | has_gst | radio | Yes, No | Yes | — | — |
| 10 | GSTIN | gstin | text | — | Conditional: has_gst = Yes | e.g., 07ABCDE1234F1Z5 | 15-char GSTIN |

**Step 3: Business Address**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | State | state | select | [All 28 States + 8 UTs] | Yes | — | — |
| 2 | District | district | select | [Auto-populate by state] | Yes | — | — |
| 3 | Pincode | pincode | text | — | Yes | 6-digit PIN | Valid format |
| 4 | Full address | address | textarea | — | Yes | Building, Street, Locality | — |
| 5 | Official email of enterprise | enterprise_email | email | — | Yes | — | Valid email |
| 6 | Official mobile of enterprise | enterprise_mobile | tel | — | Yes | — | 10 digits |

---

### DOCUMENTS REQUIRED

| # | Document | Key | Required | Formats | Help Text |
|---|----------|-----|----------|---------|-----------|
| 1 | Aadhaar Card of owner / proprietor | aadhaar_card | Yes | PDF, JPG, PNG | Used for e-KYC; OTP authentication on Udyam portal |
| 2 | PAN Card of enterprise | pan_card | Yes | PDF, JPG, PNG | Mandatory since April 2021 |
| 3 | GSTIN certificate | gst_certificate | Conditional: has_gst = Yes | PDF, JPG, PNG | Must match entity details |
| 4 | Previous MSME / UAM certificate | previous_msme_cert | Conditional: has_previous_registration = Yes | PDF, JPG, PNG | For migration / update |
| 5 | Bank account proof | bank_proof | Yes | PDF, JPG | Cancelled cheque or first page of passbook |

**Note**: Udyam is largely self-declaration. ITR and GSTN data auto-fetched by government portal. Investment and turnover figures verified against IT/GST records.

---

### WORKFLOW STAGES

| Step | Title | Timeline | Description |
|------|-------|----------|-------------|
| 1 | Document Collection & Verification | Day 0 | Documents reviewed; Aadhaar and PAN verified for consistency. |
| 2 | Aadhaar OTP Authentication | Day 0–1 | OTP sent to Aadhaar-linked mobile. Your confirmation required to proceed. |
| 3 | Application Preparation | Day 1 | Details entered on Udyam Registration portal. |
| 4 | Filing & Certificate Generation | Day 1 | URN generated immediately on successful submission. Certificate issued same day in most cases. |

---

### DELIVERABLES

| Deliverable | Type | When |
|-------------|------|------|
| Udyam Registration Number (URN) | Reference Number | On completion |
| Udyam Registration Certificate | PDF Download | On completion |
| MSME Classification (Micro / Small / Medium) | Status Label | On certificate |

### VALIDITY & RENEWAL
- **Validity**: Lifetime; must be updated when turnover/investment crosses classification thresholds
- **Renewal Required**: No formal renewal; annual ITR and GST data auto-updates classification

---

## SERVICE: Import Export Code
## SLUG: `iec-registration`

### QUESTIONNAIRE

**Step 1: Applicant / Entity Details**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Type of entity applying for IEC | entity_type | select | Individual / Proprietorship, Partnership Firm, LLP, Private Limited Company, Public Limited Company, One Person Company, HUF, Trust / Society, Government Undertaking | Yes | — | — |
| 2 | Legal name of entity / individual | legal_name | text | — | Yes | As per PAN | Must match PAN |
| 3 | PAN of entity | pan_number | text | — | Yes | e.g., ABCDE1234F | 10-char PAN |
| 4 | Date of incorporation / commencement | incorporation_date | date | — | Yes | — | Past date |
| 5 | Nature of export / import activity | trade_nature | select | Merchant Exporter, Manufacturer Exporter, Service Exporter, Trader / Importer, Both Import and Export | Yes | — | — |
| 6 | Type of goods / services to be traded | goods_description | textarea | — | Yes | Describe the main products or services | Min 30 chars |

**Step 2: Registered Office Address**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | State | state | select | [All 28 States + 8 UTs] | Yes | — | — |
| 2 | District | district | select | [Auto-populate] | Yes | — | — |
| 3 | Pincode | pincode | text | — | Yes | 6-digit PIN | — |
| 4 | Full address | address | textarea | — | Yes | — | — |
| 5 | Office phone number | office_phone | tel | — | Yes | — | 10-digit or STD code |
| 6 | Official email | official_email | email | — | Yes | — | Valid email |
| 7 | Fax number (if any) | fax_number | text | — | No | — | — |

**Step 3: Proprietor / Director / Partner Details**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Name of applicant (Proprietor / MD / Designated Partner) | applicant_name | text | — | Yes | Full name as per PAN | — |
| 2 | Designation | applicant_designation | text | — | Yes | e.g., Proprietor, Managing Director | — |
| 3 | Date of birth | applicant_dob | date | — | Yes | — | Must be 18+ |
| 4 | Gender | applicant_gender | select | Male, Female, Other | Yes | — | — |
| 5 | Residential address | applicant_address | textarea | — | Yes | — | — |
| 6 | ID number | applicant_id_number | text | — | Yes | Any one valid ID | — |
| 7 | Type of ID provided | applicant_id_type | select | Aadhaar, Passport, Voter ID, Driving License | Yes | — | — |

**Step 4: Bank Account Details**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Bank name | bank_name | text | — | Yes | — | — |
| 2 | Branch name | branch_name | text | — | Yes | — | — |
| 3 | Account number | account_number | text | — | Yes | — | 9–18 digits |
| 4 | IFSC code | ifsc_code | text | — | Yes | e.g., ICIC0001234 | 11 chars |
| 5 | Account type | account_type | select | Current, Savings | Yes | — | — |
| 6 | Account holder name (as in bank) | account_holder | text | — | Yes | — | Must match entity PAN name |

---

### DOCUMENTS REQUIRED

| # | Document | Key | Required | Formats | Help Text |
|---|----------|-----|----------|---------|-----------|
| 1 | PAN Card of entity | pan_card | Yes | PDF, JPG, PNG | Entity PAN (not individual PAN, except for proprietorship) |
| 2 | Proof of establishment / incorporation | entity_proof | Yes | PDF | CoI for companies, Partnership deed for firms |
| 3 | Proof of registered office address | address_proof | Yes | PDF, JPG, PNG | Electricity bill / telephone bill / bank statement — not older than 2 months |
| 4 | Cancelled cheque of business bank account | cancelled_cheque | Yes | JPG, PNG, PDF | Must show pre-printed entity name, account number, IFSC |
| 5 | Passport-size photograph of applicant | applicant_photo | Yes | JPG, PNG | Of the proprietor / MD / designated partner |
| 6 | ID proof of applicant | applicant_id_proof | Yes | PDF, JPG, PNG | Aadhaar / Passport / Voter ID — front and back |
| 7 | Digital Signature Certificate (Class 3) of applicant | dsc | Yes | — | Required for DGFT portal submission; we assist procurement if unavailable |
| 8 | Board resolution authorizing applicant | board_resolution | Conditional: entity_type = Pvt Ltd, LLP, or Public Ltd | PDF | Authorizes named individual to apply for IEC |

---

### WORKFLOW STAGES

| Step | Title | Timeline | Description |
|------|-------|----------|-------------|
| 1 | Document Collection & Verification | Day 0–1 | Documents checked for DGFT compliance. Entity name consistency across PAN, bank, registration verified. |
| 2 | DGFT Profile Creation | Day 1 | Business entity registered on DGFT portal using DSC of applicant. |
| 3 | Application Preparation (ANF-2A) | Day 1–2 | Form ANF-2A filled with all entity, address, and bank details. |
| 4 | Online Filing & Fee Payment | Day 2 | Application submitted; ₹500 government fee paid online. |
| 5 | IEC Issuance | Day 2–3 | IEC system-generated and issued electronically within 1–2 working days of filing. |

---

### DELIVERABLES

| Deliverable | Type | When |
|-------------|------|------|
| IEC Code (10-digit, same as entity PAN for new registrations) | Reference Number | On completion |
| IEC Certificate | PDF Download | On completion |
| DGFT Portal Login Credentials | Access Credentials | On DGFT profile creation |

### VALIDITY & RENEWAL
- **Validity**: Lifetime; annual updation required on DGFT portal (April–June) even if no changes — failing results in deactivation
- **Renewal Required**: No fee renewal; annual updation mandatory since FY 2021–22

---

## SERVICE: Professional Tax Registration
## SLUG: `professional-tax-registration`

### QUESTIONNAIRE

**Step 1: State & Registration Type**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | State | state | select | Maharashtra, Karnataka, West Bengal, Telangana, Andhra Pradesh, Tamil Nadu, Gujarat, Madhya Pradesh, Odisha, Kerala, Assam, Meghalaya, Bihar, Jharkhand, Sikkim, Tripura | Yes | Select state (PT applicable states only) | — |
| 2 | Type of registration required | registration_type | multiselect | PTEC (Professional Tax Enrollment Certificate — for self/entity), PTRC (Professional Tax Registration Certificate — for employer deducting from employees) | Yes | Select one or both | At least 1 |
| 3 | Type of entity | entity_type | select | Sole Proprietorship, Partnership Firm, Private Limited Company, LLP, One Person Company, HUF | Yes | — | — |

**Step 2: Business Details**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Name of business / firm / company | business_name | text | — | Yes | As per PAN / incorporation | — |
| 2 | PAN of entity | pan_number | text | — | Yes | e.g., ABCDE1234F | Valid PAN |
| 3 | GSTIN (if registered) | gstin | text | — | No | e.g., 27ABCDE1234F1Z5 | Valid GSTIN if provided |
| 4 | Nature of business / profession | business_nature | select | Trading, Manufacturing, IT / Software, Consulting / Professional Services, Financial Services, Healthcare, Education, Hospitality, Other | Yes | — | — |
| 5 | Date of commencement of business | commencement_date | date | — | Yes | — | Past date |
| 6 | Number of employees currently on payroll | employee_count | number | — | Conditional: registration_type includes PTRC | e.g., 25 | Positive integer |

**Step 3: Business Address**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Full registered address | address | textarea | — | Yes | — | — |
| 2 | Pincode | pincode | text | — | Yes | — | 6 digits |
| 3 | District | district | text | — | Yes | — | — |
| 4 | Contact person name | contact_name | text | — | Yes | — | — |
| 5 | Contact mobile | contact_mobile | tel | — | Yes | — | 10 digits |
| 6 | Contact email | contact_email | email | — | Yes | — | Valid email |

**Step 4: Proprietor / Partner / Director Details**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Name of proprietor / director / managing partner | owner_name | text | — | Yes | — | — |
| 2 | PAN of proprietor / director | owner_pan | text | — | Yes | — | Valid PAN |
| 3 | Aadhaar number | owner_aadhaar | text | — | Yes | — | 12 digits |
| 4 | Residential address | owner_address | textarea | — | Yes | — | — |
| 5 | Mobile number | owner_mobile | tel | — | Yes | — | 10 digits |

---

### DOCUMENTS REQUIRED

| # | Document | Key | Required | Formats | Help Text |
|---|----------|-----|----------|---------|-----------|
| 1 | PAN Card of entity | pan_card | Yes | PDF, JPG, PNG | — |
| 2 | PAN Card of proprietor / director / partner | owner_pan_card | Yes | PDF, JPG, PNG | — |
| 3 | Aadhaar Card of proprietor / director | aadhaar_card | Yes | PDF, JPG, PNG | — |
| 4 | Proof of registered address | address_proof | Yes | PDF, JPG, PNG | Electricity bill / rent agreement / bank statement — not older than 3 months |
| 5 | Certificate of incorporation / registration | entity_proof | Conditional: entity_type ≠ Sole Proprietorship | PDF | — |
| 6 | List of employees with salary details | employee_list | Conditional: registration_type includes PTRC | PDF, XLSX | Name, salary bracket, department |
| 7 | Bank account proof | bank_proof | Yes | PDF, JPG, PNG | Cancelled cheque |
| 8 | Photograph of proprietor / director | owner_photo | Yes | JPG, PNG | Passport size |
| 9 | Shop & Establishment Certificate | shop_act_cert | Conditional: state = Maharashtra or Karnataka | PDF | — |
| 10 | DSC of director / proprietor | dsc | Conditional: state = Karnataka | — | Class 2 or 3 DSC |

**State-Specific Notes**:
- **Maharashtra**: Two separate registrations — PTEC (Form II) and PTRC (Form I). Filed on mahagst.gov.in. PTEC fixed at ₹2,500/year.
- **Karnataka**: Filed on pt.kar.nic.in. DSC required.
- **West Bengal**: Filed on wbcomtax.gov.in.
- **Telangana & AP**: Filed on commercial taxes portal. PT on salary > ₹15,000/month.
- **Tamil Nadu**: PT applicable only on salaried employees in specified professions.
- **Gujarat**: PT applicable on professionals and traders.

---

### WORKFLOW STAGES

| Step | Title | Timeline | Description |
|------|-------|----------|-------------|
| 1 | Document Collection & Verification | Day 0–1 | Documents checked; state-specific requirements verified. |
| 2 | Application Preparation | Day 1–2 | Forms prepared per state-specific portal. PTEC and/or PTRC forms drafted. |
| 3 | Portal Submission | Day 2–3 | Application filed on state commercial tax / PT portal. |
| 4 | Government Processing | Day 3–7 | State authority processes application. Some states issue immediately; others require physical verification. |
| 5 | Certificate Issuance | Day 7–14 | PTEC and/or PTRC certificate issued. |

---

### DELIVERABLES

| Deliverable | Type | When |
|-------------|------|------|
| PTEC (Professional Tax Enrollment Certificate) | PDF Download | On approval |
| PTRC (Professional Tax Registration Certificate) | PDF Download | On approval (if applied) |
| PT Registration Number | Reference Number | On completion |

### VALIDITY & RENEWAL
- **Validity**: Lifetime; PTRC requires monthly / annual return filing depending on state
- **Renewal Required**: No; periodic PT payment required
- **Compliance Calendar**: Maharashtra PTRC — monthly return by 31st; Karnataka — monthly challan by 20th

---

## SERVICE: Shop & Establishment Registration
## SLUG: `shop-establishment`

### QUESTIONNAIRE

**Step 1: State & Establishment Type**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | State in which establishment is located | state | select | Maharashtra, Delhi, Karnataka, Uttar Pradesh, Tamil Nadu, Gujarat, Rajasthan, Telangana, Andhra Pradesh, West Bengal, Kerala, Punjab, Haryana, Madhya Pradesh, Others | Yes | — | — |
| 2 | Type of establishment | establishment_type | select | Shop / Retail Store, Commercial Establishment / Office, Restaurant / Food Outlet, Hotel / Hospitality, Cinema / Theatre / Place of Entertainment, Warehouse / Godown, IT Company / BPO, Educational Institute (Private), Others | Yes | — | — |
| 3 | Is this a home-based business? | is_home_based | radio | Yes, No | Yes | — | — |

**Step 2: Establishment Details**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Name of establishment | establishment_name | text | — | Yes | Name displayed on premises | — |
| 2 | Name of employer / owner | employer_name | text | — | Yes | Full legal name | — |
| 3 | PAN of employer | employer_pan | text | — | Yes | — | Valid PAN |
| 4 | Date of commencement of business | commencement_date | date | — | Yes | — | — |
| 5 | Number of employees currently working | employee_count | number | — | Yes | Include full-time and part-time | 0 or positive integer |
| 6 | Category of establishment by employee count | employee_category | select | No employees (proprietor only), 1–9 employees, 10–19 employees, 20–49 employees, 50+ employees | Yes | — | Auto-populate based on employee_count |
| 7 | Normal working hours per day | working_hours | select | 8 hours, 9 hours, 10 hours, Other | Yes | — | — |
| 8 | Weekly holiday | weekly_holiday | select | Sunday, Monday, No fixed holiday | Yes | — | — |
| 9 | Nature of business conducted | business_nature | text | — | Yes | e.g., Retail garments, Software consulting | — |

**Step 3: Premises Address**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Full address of establishment | address | textarea | — | Yes | Building name, floor, street, area | — |
| 2 | Pincode | pincode | text | — | Yes | — | 6 digits |
| 3 | City / Town / Village | city | text | — | Yes | — | — |
| 4 | Ward / Zone (for municipal reference) | ward | text | — | No | If known | — |
| 5 | Nature of premises | premises_nature | select | Owned, Rented, Leased | Yes | — | — |
| 6 | Contact number of establishment | contact_phone | tel | — | Yes | — | 10 digits |
| 7 | Email address | contact_email | email | — | Yes | — | — |

---

### DOCUMENTS REQUIRED

| # | Document | Key | Required | Formats | Help Text |
|---|----------|-----|----------|---------|-----------|
| 1 | PAN Card of proprietor / employer | pan_card | Yes | PDF, JPG, PNG | — |
| 2 | Aadhaar Card of proprietor / employer | aadhaar_card | Yes | PDF, JPG, PNG | — |
| 3 | Proof of business premises | premises_proof | Yes | PDF, JPG, PNG | Rent agreement / lease deed / electricity bill / property tax receipt |
| 4 | Photograph of establishment (exterior with board visible) | premises_photo | Yes | JPG, PNG | Required in Delhi, Maharashtra |
| 5 | Photograph of proprietor / employer | employer_photo | Yes | JPG, PNG | Passport size |
| 6 | Certificate of incorporation (if company / LLP) | entity_proof | Conditional: employer is not an individual | PDF | — |
| 7 | List of employees with designations | employee_list | Conditional: employee_count ≥ 10 | PDF, XLSX | Required in some states for larger establishments |
| 8 | NOC from property owner | noc | Conditional: premises_nature = Rented (state-specific) | PDF, JPG | — |

**State-Specific Notes**:
- **Delhi**: Filed on labour.delhi.gov.in. Required for all establishments employing even 1 person. Renewal every year.
- **Maharashtra**: Filed on aaplesarkar.mahaonline.gov.in. Certificate must be displayed at premises.
- **Karnataka**: No separate Shop Act; use Gumasta license from BBMP/municipality. Annual renewal.
- **Gujarat**: Self-certification model under Gujarat Shops and Establishments Act, 2019.

---

### WORKFLOW STAGES

| Step | Title | Timeline | Description |
|------|-------|----------|-------------|
| 1 | Document Collection & Verification | Day 0–1 | Documents verified; state portal requirements confirmed. |
| 2 | Application Preparation | Day 1–2 | Online application prepared for state labour / municipal portal. |
| 3 | Portal Filing | Day 2–3 | Application and fees submitted on state portal. Acknowledgment generated. |
| 4 | Verification | Day 3–10 | Some states conduct premises inspection; others issue certificate online without inspection. |
| 5 | Certificate Issuance | Day 7–15 | Shop & Establishment Certificate issued and shared. |

---

### DELIVERABLES

| Deliverable | Type | When |
|-------------|------|------|
| Shop & Establishment Registration Certificate | PDF Download | On approval |
| Registration Number | Reference Number | On completion |

### VALIDITY & RENEWAL
- **Validity**: Varies by state — Delhi (1 year), Maharashtra (varies), Gujarat (lifetime under 2019 Act)
- **Renewal Required**: Yes in most states — annually or every 3–5 years
- **Compliance Note**: Certificate must be displayed at the premises at all times

---

# GROUP 2: COMPANY FORMATION

---

## SERVICE: Private Limited Company
## SLUG: `pvt-ltd-company`

### QUESTIONNAIRE

**Step 1: Proposed Company Name**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Proposed company name (1st preference) | name_option_1 | text | — | Yes | e.g., Acme Solutions Private Limited | Must end with "Private Limited" |
| 2 | Proposed company name (2nd preference) | name_option_2 | text | — | Yes | e.g., Acme Tech Private Limited | Must end with "Private Limited" |
| 3 | Significance / rationale for the proposed name | name_rationale | textarea | — | Yes | Why this name? Connection to promoters, products, geography? | Required by MCA for name approval |
| 4 | Does the name include any word requiring special approval? | special_word | radio | Yes, No | Yes | Words like: Bank, Insurance, National, India, Government, Exchange | If Yes, additional regulator approval needed |

**Step 2: Company Structure**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Number of directors | director_count | number | — | Yes | Between 2 and 15 | Min 2, max 15; at least 1 must be Indian resident |
| 2 | Number of shareholders | shareholder_count | number | — | Yes | — | Min 2 |
| 3 | Are any directors also shareholders? | directors_are_shareholders | radio | Yes, No, Partial | Yes | — | — |
| 4 | Authorized share capital (₹) | authorized_capital | select | ₹1,00,000, ₹5,00,000, ₹10,00,000, ₹25,00,000, ₹50,00,000, ₹1,00,00,000, Custom | Yes | — | Min ₹1 lakh |
| 5 | Paid-up share capital (₹) | paidup_capital | number | — | Yes | e.g., 100000 | Cannot exceed authorized capital |
| 6 | Face value per share (₹) | face_value | select | ₹1, ₹5, ₹10, ₹100, Other | Yes | — | — |
| 7 | Is any director a foreign national? | has_foreign_director | radio | Yes, No | Yes | — | Additional documents if Yes |
| 8 | Is any shareholder a foreign entity / NRI? | has_foreign_shareholder | radio | Yes, No | Yes | — | FEMA compliance required |

**Step 3: Business Details**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Main objects of the company | main_objects | textarea | — | Yes | Describe core business activities in detail | Min 100 chars; forms the Main Object Clause of MOA |
| 2 | Other business activities (optional) | other_objects | textarea | — | No | Any additional activities the company may undertake | — |
| 3 | Industry category | industry_category | select | IT / Software / Technology, Manufacturing, Trading, Financial Services, Healthcare, Education, Logistics, E-Commerce, Consulting, Media & Entertainment, Real Estate, Other | Yes | — | — |
| 4 | Expected annual turnover in Year 1 (estimate) | expected_turnover | select | Below ₹40 lakhs, ₹40L – ₹1.5Cr, ₹1.5Cr – ₹5Cr, Above ₹5Cr | Yes | — | For compliance planning only |

**Step 4: Registered Office Address**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | State | state | select | [All 28 States + 8 UTs] | Yes | — | Determines RoC jurisdiction |
| 2 | Full address | address | textarea | — | Yes | Flat/Office no., Building, Street, Area | — |
| 3 | City | city | text | — | Yes | — | — |
| 4 | Pincode | pincode | text | — | Yes | — | 6 digits |
| 5 | Nature of premises | premises_type | select | Owned by promoter, Rented / Leased, Shared / Consent basis | Yes | — | — |
| 6 | Email address of company | company_email | email | — | Yes | Official company email | — |
| 7 | Phone number of company | company_phone | tel | — | Yes | — | — |

**Step 5: Director Details**

**Repeater: Director Details** (min: 2, max: 15)

| Question | Key | Type | Required | Notes |
|----------|-----|------|----------|-------|
| Director's full legal name | director_name | text | Yes | As per PAN |
| Father's name | director_father_name | text | Yes | Required for DIN application |
| Date of birth | director_dob | date | Yes | Must be 18+ |
| Gender | director_gender | select (Male, Female, Other) | Yes | — |
| Nationality | director_nationality | select (Indian, Foreign) | Yes | — |
| Occupation | director_occupation | select (Business, Professional, Service, Retired, Others) | Yes | — |
| Educational qualification | director_education | select (Graduate, Post-Graduate, Professional Degree, Under-Graduate, Others) | Yes | — |
| PAN number | director_pan | text | Yes | Indian directors; 10-char PAN |
| Aadhaar number | director_aadhaar | text | Yes | Indian directors; 12 digits |
| Mobile number (Aadhaar-linked) | director_mobile | tel | Yes | 10-digit Indian mobile |
| Email address | director_email | email | Yes | Unique per director |
| Current residential address | director_address | textarea | Yes | Full address with PIN |
| Has existing DIN? | has_din | radio (Yes, No) | Yes | — |
| Existing DIN (if any) | director_din | text | Conditional: has_din = Yes | 8-digit DIN |
| Is this director also a shareholder? | is_shareholder | radio (Yes, No) | Yes | — |
| Number of shares held | shares_held | number | Conditional: is_shareholder = Yes | — |
| Is this the designated resident director? | is_resident_director | radio (Yes, No) | Yes | At least 1 director must have stayed in India ≥ 182 days in previous calendar year |
| Passport number | director_passport | text | Conditional: director_nationality = Foreign | — |
| Passport expiry date | director_passport_expiry | date | Conditional: director_nationality = Foreign | — |

---

### DOCUMENTS REQUIRED

**Per Director (upload for each director):**

| # | Document | Key | Required | Formats | Help Text |
|---|----------|-----|----------|---------|-----------|
| 1 | PAN Card | director_pan_card | Yes | PDF, JPG, PNG | Indian directors only |
| 2 | Aadhaar Card | director_aadhaar_card | Yes | PDF, JPG, PNG | Both sides |
| 3 | Passport (for foreign directors) | director_passport_doc | Conditional: director_nationality = Foreign | PDF, JPG | Replaces Aadhaar + PAN |
| 4 | Photograph | director_photo | Yes | JPG, PNG | Passport size, white background |
| 5 | Address proof (current residence) | director_address_proof | Yes | PDF, JPG, PNG | Utility bill / bank statement / rent agreement — not older than 2 months |
| 6 | Specimen signature | director_signature | Yes | JPG, PNG | Plain white background |

**For Registered Office:**

| # | Document | Key | Required | Formats | Help Text |
|---|----------|-----|----------|---------|-----------|
| 7 | Proof of registered office address | office_address_proof | Yes | PDF, JPG, PNG | Electricity bill / property tax receipt — not older than 2 months |
| 8 | NOC from property owner | office_noc | Conditional: premises_type = Rented / Consent | PDF | — |
| 9 | Rent agreement | rent_agreement | Conditional: premises_type = Rented / Leased | PDF | — |

---

### WORKFLOW STAGES

| Step | Title | Timeline | Description |
|------|-------|----------|-------------|
| 1 | Document Collection & Verification | Day 0–1 | All director documents reviewed; consistency check across PAN, Aadhaar, address proofs. |
| 2 | DSC Procurement | Day 1–3 | Class 3 DSC obtained for each director without one. Required to sign SPICe+ forms. |
| 3 | DIN Application (for new directors) | Day 2–4 | DIN applied via SPICe+ for directors without existing DIN. |
| 4 | Name Reservation (RUN / SPICe+ Part A) | Day 3–5 | Two proposed names submitted to MCA for approval. |
| 5 | SPICe+ Part B Preparation | Day 5–8 | Full incorporation form prepared: MOA, AOA, INC-9, AGILE-PRO-S (GST + ESIC + EPFO + Bank + PT simultaneously). |
| 6 | Filing with RoC | Day 8–10 | Signed SPICe+ filed with Registrar of Companies. Government stamp duty and fees paid. |
| 7 | RoC Processing & Certificate of Incorporation | Day 10–15 | RoC reviews and issues CoI with CIN, PAN, and TAN. |
| 8 | Post-Incorporation Setup | Day 15–18 | Share certificates issued, statutory registers opened, first board meeting scheduled. |

---

### DELIVERABLES

| Deliverable | Type | When |
|-------------|------|------|
| Certificate of Incorporation (CoI) | PDF Download | On RoC approval |
| Corporate Identification Number (CIN) | Reference Number | On incorporation |
| PAN of Company | Reference Number | Auto-issued with CoI via SPICe+ |
| TAN of Company | Reference Number | Auto-issued with CoI via SPICe+ |
| Memorandum of Association (MOA) | PDF Document | On incorporation |
| Articles of Association (AOA) | PDF Document | On incorporation |
| DIN for new directors | Reference Number | During process |
| DSC for directors (new) | Digital Certificate | During process |

### VALIDITY & RENEWAL
- **Validity**: Lifetime
- **Annual Compliance**: AOC-4 (financials) by 30 days from AGM, MGT-7 (annual return) by 60 days from AGM, DIR-3 KYC annually
- **Board Meetings**: Minimum 4 per year, gap not more than 120 days

---

## SERVICE: One Person Company
## SLUG: `opc-registration`

### QUESTIONNAIRE

**Step 1: Proposed Company Name**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Proposed company name (1st preference) | name_option_1 | text | — | Yes | e.g., Arjun Enterprises (OPC) Private Limited | Must include "(OPC)" before "Private Limited" |
| 2 | Proposed company name (2nd preference) | name_option_2 | text | — | Yes | — | Same format |
| 3 | Rationale for proposed name | name_rationale | textarea | — | Yes | — | — |

**Step 2: Business Details**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Main objects of the company | main_objects | textarea | — | Yes | Core business activities | Min 100 chars |
| 2 | Industry category | industry_category | select | IT / Software, Manufacturing, Trading, Financial Services, Healthcare, Education, Consulting, Others | Yes | — | — |
| 3 | Authorized share capital | authorized_capital | select | ₹1,00,000, ₹5,00,000, ₹10,00,000, Custom | Yes | — | Max ₹50 lakhs for OPC |
| 4 | Paid-up share capital | paidup_capital | number | — | Yes | — | Max ₹50 lakhs |

**Step 3: Registered Office Address**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | State | state | select | [All States] | Yes | — | — |
| 2 | Full address | address | textarea | — | Yes | — | — |
| 3 | City | city | text | — | Yes | — | — |
| 4 | Pincode | pincode | text | — | Yes | — | 6 digits |
| 5 | Nature of premises | premises_type | select | Owned by promoter, Rented / Leased, Consent basis | Yes | — | — |
| 6 | Company email | company_email | email | — | Yes | — | — |

**Step 4: Director Details (Sole Member & Director)**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Full legal name | director_name | text | — | Yes | As per PAN | — |
| 2 | Father's name | director_father_name | text | — | Yes | — | — |
| 3 | Date of birth | director_dob | date | — | Yes | — | Must be 18+; must be Indian citizen |
| 4 | Nationality | director_nationality | select | Indian | Yes | Only Indian citizens can be sole member of OPC | Auto-filled as Indian |
| 5 | PAN number | director_pan | text | — | Yes | — | Valid PAN |
| 6 | Aadhaar number | director_aadhaar | text | — | Yes | — | 12 digits |
| 7 | Mobile (Aadhaar-linked) | director_mobile | tel | — | Yes | — | 10 digits |
| 8 | Email | director_email | email | — | Yes | — | — |
| 9 | Residential address | director_address | textarea | — | Yes | — | — |
| 10 | Has existing DIN? | has_din | radio | Yes, No | Yes | — | — |
| 11 | Existing DIN | director_din | text | Conditional: has_din = Yes | — | 8 digits | — |
| 12 | Occupation | director_occupation | select | Business, Professional, Service, Others | Yes | — | — |

**Step 5: Nominee Director Details**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Nominee's full legal name | nominee_name | text | — | Yes | As per PAN | — |
| 2 | Nominee's date of birth | nominee_dob | date | — | Yes | — | Must be 18+; must be Indian citizen |
| 3 | Nominee's PAN | nominee_pan | text | — | Yes | — | Cannot be same as director PAN |
| 4 | Nominee's Aadhaar | nominee_aadhaar | text | — | Yes | — | 12 digits |
| 5 | Nominee's mobile | nominee_mobile | tel | — | Yes | — | 10 digits |
| 6 | Nominee's email | nominee_email | email | — | Yes | — | — |
| 7 | Relationship with director (optional) | nominee_relation | text | — | No | e.g., Spouse, Parent, Friend | — |
| 8 | Nominee's residential address | nominee_address | textarea | — | Yes | — | — |

---

### DOCUMENTS REQUIRED

| # | Document | Key | Required | Formats | Help Text |
|---|----------|-----|----------|---------|-----------|
| 1 | PAN Card of director | director_pan_card | Yes | PDF, JPG, PNG | — |
| 2 | Aadhaar Card of director | director_aadhaar_card | Yes | PDF, JPG, PNG | — |
| 3 | Photograph of director | director_photo | Yes | JPG, PNG | Passport size |
| 4 | Address proof of director | director_address_proof | Yes | PDF, JPG, PNG | Utility bill / bank statement — not older than 2 months |
| 5 | Specimen signature of director | director_signature | Yes | JPG, PNG | — |
| 6 | PAN Card of nominee | nominee_pan_card | Yes | PDF, JPG, PNG | — |
| 7 | Aadhaar Card of nominee | nominee_aadhaar_card | Yes | PDF, JPG, PNG | — |
| 8 | Photograph of nominee | nominee_photo | Yes | JPG, PNG | Passport size |
| 9 | Address proof of nominee | nominee_address_proof | Yes | PDF, JPG, PNG | — |
| 10 | Consent of nominee (INC-3) | nominee_consent | Yes | PDF | We prepare this; needs nominee signature |
| 11 | Proof of registered office address | office_address_proof | Yes | PDF, JPG, PNG | Electricity bill / property tax receipt — not older than 2 months |
| 12 | NOC from property owner | office_noc | Conditional: premises_type ≠ Owned | PDF | — |
| 13 | Rent agreement | rent_agreement | Conditional: premises_type = Rented | PDF | — |

---

### WORKFLOW STAGES

| Step | Title | Timeline | Description |
|------|-------|----------|-------------|
| 1 | Document Collection & Verification | Day 0–1 | — |
| 2 | DSC Procurement (Director) | Day 1–3 | Class 3 DSC for sole director |
| 3 | Name Reservation | Day 3–5 | SPICe+ Part A or RUN submission |
| 4 | SPICe+ Part B Preparation | Day 5–8 | MOA, AOA, INC-3 (nominee consent), INC-9 |
| 5 | Filing with RoC | Day 8–10 | — |
| 6 | Certificate of Incorporation | Day 10–15 | — |

---

### DELIVERABLES

| Deliverable | Type | When |
|-------------|------|------|
| Certificate of Incorporation | PDF Download | On approval |
| CIN | Reference Number | On incorporation |
| PAN & TAN of Company | Reference Number | On incorporation |
| MOA & AOA | PDF Documents | On incorporation |
| DIN of Director | Reference Number | During process |

### VALIDITY & RENEWAL
- **Auto-Conversion Rule**: If paid-up capital exceeds ₹50 lakhs OR turnover exceeds ₹2 crores in 3 consecutive years, OPC must mandatorily convert to Private Limited Company
- **Annual Compliance**: AOC-4, MGT-7A (simplified), DIR-3 KYC

---

## SERVICE: LLP Registration
## SLUG: `llp-registration`

### QUESTIONNAIRE

**Step 1: Proposed LLP Name**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Proposed LLP name (1st preference) | name_option_1 | text | — | Yes | e.g., Sharma & Singh LLP | Must end with "LLP" or "Limited Liability Partnership" |
| 2 | Proposed LLP name (2nd preference) | name_option_2 | text | — | Yes | — | — |
| 3 | Rationale for name | name_rationale | textarea | — | Yes | — | — |

**Step 2: LLP Business Details**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Main business activity of the LLP | main_activity | textarea | — | Yes | Describe in detail | — |
| 2 | Industry / profession category | industry | select | Legal Services, Accounting / CA Firm, Architecture, Consulting, IT / Technology, Trading, Real Estate, Healthcare, Others | Yes | — | — |
| 3 | Total capital contribution (₹) | total_capital | number | — | Yes | Sum of all partners' contributions | No minimum by law |
| 4 | Number of designated partners | designated_partner_count | number | — | Yes | — | Min 2; at least 1 must be Indian resident |
| 5 | Are there non-designated (contributing) partners in addition? | has_non_designated | radio | Yes, No | Yes | — | — |

**Step 3: Registered Office Address**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | State | state | select | [All States + UTs] | Yes | — | Determines RoC jurisdiction |
| 2 | Full address | address | textarea | — | Yes | — | — |
| 3 | Pincode | pincode | text | — | Yes | — | 6 digits |
| 4 | City | city | text | — | Yes | — | — |
| 5 | Nature of premises | premises_type | select | Owned, Rented, Leased, Consent basis | Yes | — | — |
| 6 | LLP email | llp_email | email | — | Yes | — | — |

**Step 4: Designated Partner Details**

**Repeater: Designated Partner Details** (min: 2, max: unlimited)

| Question | Key | Type | Required | Notes |
|----------|-----|------|----------|-------|
| Full legal name | partner_name | text | Yes | As per PAN |
| Father's name | partner_father_name | text | Yes | Required for DPIN |
| Date of birth | partner_dob | date | Yes | 18+ |
| Gender | partner_gender | select (Male, Female, Other) | Yes | — |
| Nationality | partner_nationality | select (Indian, Foreign) | Yes | — |
| PAN number | partner_pan | text | Yes | Indian partners |
| Aadhaar number | partner_aadhaar | text | Yes | Indian partners; 12 digits |
| Mobile number | partner_mobile | tel | Yes | 10 digits |
| Email address | partner_email | email | Yes | — |
| Residential address | partner_address | textarea | Yes | — |
| Has existing DPIN / DIN? | has_dpin | radio (Yes, No) | Yes | — |
| Existing DPIN / DIN | partner_dpin | text | Conditional: has_dpin = Yes | 8-digit DPIN |
| Capital contribution (₹) | partner_capital | number | Yes | Amount partner is contributing |
| Profit sharing ratio (%) | profit_ratio | number | Yes | Sum across all partners must equal 100 |
| Is this partner designated partner of another LLP? | is_dp_other_llp | radio (Yes, No) | Yes | — |
| Passport number | partner_passport | text | Conditional: nationality = Foreign | — |

---

### DOCUMENTS REQUIRED

**Per Designated Partner:**

| # | Document | Key | Required | Formats | Help Text |
|---|----------|-----|----------|---------|-----------|
| 1 | PAN Card | partner_pan_card | Yes | PDF, JPG, PNG | — |
| 2 | Aadhaar Card | partner_aadhaar_card | Yes | PDF, JPG, PNG | — |
| 3 | Passport (foreign partners) | partner_passport_doc | Conditional: nationality = Foreign | PDF | — |
| 4 | Photograph | partner_photo | Yes | JPG, PNG | Passport size |
| 5 | Address proof (current residence) | partner_address_proof | Yes | PDF, JPG, PNG | Not older than 2 months |
| 6 | Specimen signature | partner_signature | Yes | JPG, PNG | — |

**For Registered Office:**

| # | Document | Key | Required | Formats | Help Text |
|---|----------|-----|----------|---------|-----------|
| 7 | Address proof of registered office | office_address_proof | Yes | PDF, JPG, PNG | Utility bill — not older than 2 months |
| 8 | NOC from property owner | office_noc | Conditional: premises_type ≠ Owned | PDF | — |
| 9 | Rent / lease agreement | rent_agreement | Conditional: premises_type = Rented / Leased | PDF | — |

---

### WORKFLOW STAGES

| Step | Title | Timeline | Description |
|------|-------|----------|-------------|
| 1 | Document Collection & Verification | Day 0–1 | — |
| 2 | DSC & DPIN Procurement | Day 1–4 | DPIN applied for partners without existing DIN/DPIN. Class 3 DSC obtained. |
| 3 | Name Reservation (RUN-LLP) | Day 4–6 | Two names submitted via RUN-LLP on MCA portal. |
| 4 | FiLLiP Form Preparation | Day 6–9 | Form for Incorporation of LLP drafted with all partner and office details. |
| 5 | Filing & RoC Processing | Day 9–12 | FiLLiP filed; stamp duty paid based on capital contribution. |
| 6 | Certificate of Incorporation | Day 12–18 | LLPIN and CoI issued. |
| 7 | LLP Agreement Drafting & Filing | Day 18–25 | LLP Agreement drafted and filed with RoC via Form 3 within 30 days of incorporation. |

---

### DELIVERABLES

| Deliverable | Type | When |
|-------------|------|------|
| Certificate of Incorporation | PDF Download | On approval |
| LLPIN (LLP Identification Number) | Reference Number | On incorporation |
| PAN of LLP | Reference Number | On incorporation |
| TAN of LLP | Reference Number | On incorporation |
| DPIN for new designated partners | Reference Number | During process |
| LLP Agreement | PDF Document | Within 30 days of incorporation |

### VALIDITY & RENEWAL
- **Annual Compliance**: Form 11 (Annual Return) by 30 May; Form 8 (Statement of Account & Solvency) by 30 October

---

## SERVICE: Partnership Firm
## SLUG: `partnership-firm`

### QUESTIONNAIRE

**Step 1: Firm Details**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Name of partnership firm | firm_name | text | — | Yes | e.g., Gupta & Sons | — |
| 2 | Do you want to register the partnership firm? | wants_registration | radio | Yes, No (Deed only) | Yes | Registration gives right to sue; unregistered firms cannot file suits | — |
| 3 | State where firm will be registered (if registering) | registration_state | select | [All States] | Conditional: wants_registration = Yes | — | — |
| 4 | Nature of business | business_nature | textarea | — | Yes | Describe activities | — |
| 5 | Date of commencement of partnership | commencement_date | date | — | Yes | — | Past or future date |
| 6 | Duration of partnership | partnership_duration | select | At Will (no fixed term), Fixed Term — specify years | Yes | — | — |
| 7 | Fixed term in years | fixed_term_years | number | — | Conditional: partnership_duration = Fixed Term | — | Positive integer |
| 8 | Place of business (principal) | principal_place | textarea | — | Yes | Full address | — |

**Step 2: Partner Details**

**Repeater: Partner Details** (min: 2, max: 50)

| Question | Key | Type | Required | Notes |
|----------|-----|------|----------|-------|
| Partner's full name | partner_name | text | Yes | As per PAN |
| Father's / Husband's name | partner_father_name | text | Yes | — |
| Date of birth | partner_dob | date | Yes | 18+ |
| PAN number | partner_pan | text | Yes | — |
| Aadhaar number | partner_aadhaar | text | Yes | — |
| Mobile number | partner_mobile | tel | Yes | 10 digits |
| Email address | partner_email | email | Yes | — |
| Residential address | partner_address | textarea | Yes | — |
| Capital contribution (₹) | partner_capital | number | Yes | Can be 0 if partner contributes only skills / labor |
| Profit sharing ratio (%) | profit_ratio | number | Yes | Across all partners must = 100 |
| Loss sharing ratio (%) | loss_ratio | number | Yes | Usually same as profit ratio; can differ |
| Is this a sleeping / dormant partner? | is_sleeping | radio (Yes, No) | Yes | Sleeping partners contribute capital but do not participate in management |
| Is this an active / working partner? | is_working | radio (Yes, No) | Yes | — |
| Partner's remuneration | partner_remuneration | select (Nil, Fixed monthly amount, % of profit, Both fixed + variable) | Yes | — |
| Fixed remuneration amount (₹/month) | fixed_remuneration | number | Conditional: remuneration includes fixed | — |

**Step 3: Financial & Operational Terms**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Interest on capital (% per annum) | interest_on_capital | number | — | Yes | Standard: 6% p.a. | Max 12% as per IT Act |
| 2 | Interest on drawings (% per annum) | interest_on_drawings | number | — | Yes | Standard: 6% p.a. | — |
| 3 | Financial year end | financial_year_end | select | 31st March (standard), Other | Yes | — | — |
| 4 | Name and address of firm's banker | bank_name_address | text | — | Yes | — | — |
| 5 | Dispute resolution mechanism | dispute_resolution | select | Mutual discussion, Arbitration, Court | Yes | — | — |
| 6 | Arbitrator details (if arbitration) | arbitrator_details | text | Conditional: dispute_resolution = Arbitration | — | — | — |

---

### DOCUMENTS REQUIRED

| # | Document | Key | Required | Formats | Help Text |
|---|----------|-----|----------|---------|-----------|
| 1 | PAN Card of each partner | partner_pan_cards | Yes | PDF, JPG, PNG | Upload separately labeled per partner |
| 2 | Aadhaar Card of each partner | partner_aadhaar_cards | Yes | PDF, JPG, PNG | — |
| 3 | Photograph of each partner | partner_photos | Yes | JPG, PNG | Passport size |
| 4 | Address proof of each partner | partner_address_proofs | Yes | PDF, JPG, PNG | Not older than 3 months |
| 5 | Proof of principal place of business | premises_proof | Yes | PDF, JPG, PNG | Rent agreement / electricity bill / NOC |
| 6 | Stamp paper (for partnership deed) | stamp_paper | Yes | — | Value as per state stamp duty; we procure; varies by capital (₹100–₹500 in most states) |
| 7 | PAN application for firm (if new) | firm_pan_application | Yes | — | Required; we assist |

---

### WORKFLOW STAGES

| Step | Title | Timeline | Description |
|------|-------|----------|-------------|
| 1 | Document Collection & Verification | Day 0–1 | — |
| 2 | Partnership Deed Drafting | Day 1–3 | Comprehensive deed drafted covering all agreed terms. |
| 3 | Review & Partner Approval | Day 3–5 | Draft shared with all partners for review. Amendments incorporated. |
| 4 | Stamp Paper Procurement & Deed Execution | Day 5–7 | Deed printed on stamp paper; signed by all partners before a notary. |
| 5 | Firm Registration (if opted) | Day 7–14 | Form A filed with Registrar of Firms in respective state. |
| 6 | PAN & Bank Account | Day 10–15 | PAN applied for the firm; bank account opened with executed deed. |

---

### DELIVERABLES

| Deliverable | Type | When |
|-------------|------|------|
| Partnership Deed (notarized) | Physical / PDF Document | On deed execution |
| Certificate of Registration of Firm | PDF Download | Conditional: wants_registration = Yes |
| Firm Registration Number | Reference Number | Conditional: wants_registration = Yes |
| PAN of Partnership Firm | Reference Number | On PAN application completion |

### VALIDITY & RENEWAL
- **Validity**: As per deed duration
- **Annual Compliance**: ITR-5; audit mandatory if turnover > ₹1.2 crores

---

## SERVICE: Sole Proprietorship
## SLUG: `sole-proprietorship`

### QUESTIONNAIRE

**Step 1: Proprietor & Business Details**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Proprietor's full legal name | proprietor_name | text | — | Yes | As per PAN | — |
| 2 | PAN of proprietor | proprietor_pan | text | — | Yes | — | Valid PAN |
| 3 | Aadhaar of proprietor | proprietor_aadhaar | text | — | Yes | — | 12 digits |
| 4 | Name under which business will be conducted | business_name | text | — | Yes | Trade name / shop name | Can differ from proprietor name |
| 5 | Nature of business | business_nature | select | Trading / Retail, Manufacturing, Service, Professional (CA / Doctor / Lawyer etc.), E-Commerce, Freelancer / Consultant | Yes | — | — |
| 6 | Brief description of business activity | business_description | textarea | — | Yes | — | Min 50 chars |
| 7 | Date of commencement | commencement_date | date | — | Yes | — | — |
| 8 | Expected annual turnover | expected_turnover | select | Below ₹20 lakhs, ₹20L – ₹40L, ₹40L – ₹1.5Cr, Above ₹1.5Cr | Yes | — | Used to recommend appropriate registrations |

**Step 2: Registrations Required**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Which registrations do you need as part of this package? | registrations_needed | multiselect | GST Registration, MSME / Udyam Registration, Shop & Establishment Registration, FSSAI Registration (if food business), Trade License, Current Account opening support | Yes | Select all that apply | At least 1 |
| 2 | State of business | state | select | [All States] | Yes | — | — |
| 3 | Do you want a dedicated current bank account? | needs_bank_account | radio | Yes, No | Yes | — | — |

**Step 3: Business Address**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Business address | address | textarea | — | Yes | — | — |
| 2 | Pincode | pincode | text | — | Yes | — | 6 digits |
| 3 | City | city | text | — | Yes | — | — |
| 4 | Nature of premises | premises_type | select | Owned, Rented, Home office | Yes | — | — |
| 5 | Contact mobile | mobile | tel | — | Yes | — | 10 digits |
| 6 | Contact email | email | email | — | Yes | — | — |

---

### DOCUMENTS REQUIRED

| # | Document | Key | Required | Formats | Help Text |
|---|----------|-----|----------|---------|-----------|
| 1 | PAN Card of proprietor | pan_card | Yes | PDF, JPG, PNG | — |
| 2 | Aadhaar Card of proprietor | aadhaar_card | Yes | PDF, JPG, PNG | — |
| 3 | Photograph of proprietor | proprietor_photo | Yes | JPG, PNG | Passport size |
| 4 | Proof of business address | address_proof | Yes | PDF, JPG, PNG | Electricity bill / rent agreement / bank statement |
| 5 | Cancelled cheque or bank passbook | bank_proof | Yes | PDF, JPG, PNG | For GST registration; account in proprietor's name acceptable initially |

---

### WORKFLOW STAGES

| Step | Title | Timeline | Description |
|------|-------|----------|-------------|
| 1 | Document Collection & Verification | Day 0–1 | — |
| 2 | Registrations Filed in Sequence | Day 1–10 | GST, MSME, Shop Act filed based on selections; each has its own sub-timeline |
| 3 | Certificates Delivered | Day 7–15 | Each certificate delivered as obtained |
| 4 | Current Account Support | Day 10–15 | If opted — documents compiled for bank submission |

---

### DELIVERABLES

| Deliverable | Type | When |
|-------------|------|------|
| GSTIN (if GST selected) | Reference Number | Per GST workflow |
| Udyam Certificate (if MSME selected) | PDF Download | Per MSME workflow |
| Shop & Establishment Certificate (if selected) | PDF Download | Per Shop Act workflow |
| Package Summary Document | PDF | On completion of all registrations |

### VALIDITY & RENEWAL
- **Annual Compliance**: ITR-3 (business income), GST returns (if registered)

---

# GROUP 3: LICENSES

---

## SERVICE: FSSAI Basic Registration
## SLUG: `fssai-basic`

### QUESTIONNAIRE

**Step 1: Business Type & Eligibility**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Type of food business operator | fbo_type | select | Petty food manufacturer (turnover < ₹12L), Small-scale retailer / hawker / vendor, Temporary / Seasonal food stall, Distributer / Supplier (turnover < ₹12L), Milk producer / dairy (< 500 litres/day) | Yes | — | — |
| 2 | Expected annual turnover (₹) | annual_turnover | select | Below ₹5 lakhs, ₹5L – ₹12L | Yes | — | If > ₹12L, route to FSSAI State |
| 3 | Is the food business seasonal or temporary? | is_seasonal | radio | Yes, No | Yes | — | — |
| 4 | Type of food products dealt in | food_products_type | multiselect | Packaged foods, Fresh / raw foods, Processed foods, Bakery items, Dairy products, Meat / fish / poultry, Fruits & vegetables, Beverages / juices, Sweets & confectionery, Ready-to-eat meals | Yes | — | At least 1 |
| 5 | Specific food products (describe) | food_products_description | textarea | — | Yes | e.g., Homemade pickles, Namkeen snacks | Min 20 chars |

**Step 2: Business Details**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Name of food business | business_name | text | — | Yes | — | — |
| 2 | Name of proprietor / responsible person | owner_name | text | — | Yes | — | — |
| 3 | PAN of proprietor / business | pan_number | text | — | Yes | — | — |
| 4 | Date of commencement of food business | commencement_date | date | — | Yes | — | — |
| 5 | Number of persons involved in food handling | food_handlers_count | number | — | Yes | Include proprietor | — |
| 6 | Does the business operate from a fixed premises? | has_fixed_premises | radio | Yes, No | Yes | — | — |

**Step 3: Premises Details**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | State | state | select | [All States] | Yes | — | Determines FSSAI state authority |
| 2 | District | district | select | [Auto-populate] | Yes | — | — |
| 3 | Full address | address | textarea | — | Yes | — | — |
| 4 | Pincode | pincode | text | — | Yes | — | 6 digits |
| 5 | Nature of premises | premises_type | select | Owned, Rented, Mobile / Cart / Kiosk | Yes | — | — |
| 6 | Contact mobile | mobile | tel | — | Yes | — | 10 digits |
| 7 | Contact email | email | email | — | No | — | — |

---

### DOCUMENTS REQUIRED

| # | Document | Key | Required | Formats | Help Text |
|---|----------|-----|----------|---------|-----------|
| 1 | Photo ID of proprietor / responsible person | id_proof | Yes | PDF, JPG, PNG | Aadhaar / PAN / Voter ID / Passport |
| 2 | Address proof of business premises | premises_proof | Yes | PDF, JPG, PNG | Electricity bill / rent agreement / self-declaration for mobile vendors |
| 3 | Passport-size photograph of applicant | applicant_photo | Yes | JPG, PNG | — |
| 4 | List of food products | food_list | Yes | PDF, DOCX | List of all food products to be manufactured / handled / sold |
| 5 | Self-declaration of food safety compliance | self_declaration | Yes | PDF | We prepare this as part of Form A application |

---

### WORKFLOW STAGES

| Step | Title | Timeline | Description |
|------|-------|----------|-------------|
| 1 | Document Collection & Verification | Day 0–1 | — |
| 2 | Application Preparation (Form A) | Day 1–2 | Form A filled on FoSCoS portal (foscos.fssai.gov.in) |
| 3 | Filing & Fee Payment | Day 2–3 | ₹100 government fee paid online. Application submitted. |
| 4 | Licensing Authority Processing | Day 3–7 | Designated Officer reviews and issues registration. Basic registration does not require physical inspection in most cases. |
| 5 | Certificate Issuance | Day 7 | FSSAI Registration Certificate with 14-digit registration number issued. |

---

### DELIVERABLES

| Deliverable | Type | When |
|-------------|------|------|
| FSSAI Basic Registration Certificate | PDF Download | On approval |
| 14-digit FSSAI Registration Number | Reference Number | On completion |

### VALIDITY & RENEWAL
- **Validity**: 1–5 years (chosen at time of application)
- **Renewal Required**: Yes — must be renewed before expiry; 30-day grace period after expiry
- **Display Requirement**: 14-digit number must be displayed on food packets / premises

---

## SERVICE: FSSAI State License
## SLUG: `fssai-state`

### QUESTIONNAIRE

**Step 1: Business Type & Eligibility**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Category of food business | business_category | select | Manufacturer / Processor, Repacker / Relabeller, Wholesaler, Distributor / Supplier, Transporter / Carrier, Storage (including cold storage), Retailer (turnover ₹12L – ₹20Cr), Caterer / Restaurant / Hotel, Dhaba / Food Stall, Cloud Kitchen, Canteen / Mess (institutional) | Yes | — | — |
| 2 | Annual turnover (₹) | annual_turnover | select | ₹12L – ₹1Cr, ₹1Cr – ₹5Cr, ₹5Cr – ₹20Cr | Yes | — | If > ₹20Cr or multi-state, route to Central |
| 3 | Does the business operate across multiple states? | is_multistate | radio | Yes, No | Yes | — | If Yes, route to Central license |
| 4 | Type of food products | food_products_type | multiselect | Packaged foods, Fresh / raw foods, Processed foods, Bakery items, Dairy products, Meat / fish / poultry, Fruits & vegetables, Beverages / juices, Sweets & confectionery, Ready-to-eat meals, Proprietary food, Health / Nutraceutical products | Yes | — | — |
| 5 | Specific food products | food_products_description | textarea | — | Yes | — | — |
| 6 | Installed production capacity (if manufacturer) | production_capacity | text | — | Conditional: business_category = Manufacturer | e.g., 500 kg/day | — |

**Step 2: Business & Premises Details**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Name of food business | business_name | text | — | Yes | — | — |
| 2 | Legal entity type | entity_type | select | Sole Proprietorship, Partnership, Pvt Ltd, LLP, Public Ltd, HUF, Others | Yes | — | — |
| 3 | CIN / LLPIN / Registration number | entity_reg_number | text | — | Conditional: entity_type ≠ Sole Proprietorship / HUF | — | — |
| 4 | GST Registration Number | gstin | text | — | Yes | — | Valid GSTIN |
| 5 | State of operation | state | select | [All States] | Yes | — | — |
| 6 | Full address of food premises | address | textarea | — | Yes | — | — |
| 7 | Pincode | pincode | text | — | Yes | — | 6 digits |
| 8 | Area of food processing / handling premises (sq. ft.) | premises_area | number | — | Yes | — | Positive integer |
| 9 | Nature of premises | premises_type | select | Owned, Rented, Leased | Yes | — | — |
| 10 | Source of water used in food processing | water_source | select | Municipal / Corporation supply, Borewell / Groundwater, RO-treated water, Packaged water | Yes | — | — |

**Step 3: Infrastructure & Compliance Details**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Do you have a food safety management system in place? | has_fsms | radio | Yes, No (we will provide template) | Yes | — | — |
| 2 | Do you employ food safety supervisors? | has_fss_trained_staff | radio | Yes, No | Yes | — | — |
| 3 | Number of food handlers / employees | food_handlers_count | number | — | Yes | — | — |
| 4 | Do any partners / directors have criminal / food-related convictions? | has_convictions | radio | Yes, No | Yes | — | — |

---

### DOCUMENTS REQUIRED

| # | Document | Key | Required | Formats | Help Text |
|---|----------|-----|----------|---------|-----------|
| 1 | ID proof of proprietor / director / authorized signatory | id_proof | Yes | PDF, JPG, PNG | PAN + Aadhaar preferred |
| 2 | Proof of business premises | premises_proof | Yes | PDF, JPG, PNG | Electricity bill / rent agreement — not older than 3 months |
| 3 | Blueprint / layout plan of food premises | premises_blueprint | Yes | PDF, JPG | Rough sketch acceptable for smaller premises; formal blueprint for manufacturers |
| 4 | List of food products to be manufactured / sold | food_list | Yes | PDF | Detailed list with categories |
| 5 | NOC from municipality / Panchayat | municipal_noc | Yes | PDF | Required from local civic body |
| 6 | Partnership deed / CoI (if applicable) | entity_proof | Conditional: entity_type ≠ Sole Proprietorship | PDF | — |
| 7 | Food safety management plan | fsms_plan | Yes | PDF | Basic plan acceptable; we provide template |
| 8 | Water testing report | water_test_report | Conditional: water_source = Borewell / Groundwater | PDF | From NABL-accredited lab; not older than 6 months |
| 9 | Medical fitness certificates of food handlers | medical_certs | Conditional: business_category = Manufacturer | PDF | From registered medical practitioner |
| 10 | Photograph of food premises (interior showing equipment) | premises_photos | Yes | JPG, PNG | Showing food handling area, storage |
| 11 | GSTIN certificate | gst_certificate | Yes | PDF | — |

---

### WORKFLOW STAGES

| Step | Title | Timeline | Description |
|------|-------|----------|-------------|
| 1 | Document Collection & Verification | Day 0–2 | More documentation intensive than Basic; all items verified. |
| 2 | Application Preparation (Form B) | Day 2–4 | Form B prepared on FoSCoS portal. |
| 3 | Filing & Fee Payment | Day 4–5 | Government fee paid (₹2,000 – ₹5,000 depending on category). |
| 4 | Designated Officer Review | Day 5–20 | State authority may raise queries; physical inspection possible for manufacturing units. |
| 5 | Inspection (if applicable) | Day 15–30 | For manufacturing / processing FBOs, state food inspector may visit premises. |
| 6 | License Issuance | Day 20–45 | FSSAI State License with 14-digit number issued. |

---

### DELIVERABLES

| Deliverable | Type | When |
|-------------|------|------|
| FSSAI State License Certificate | PDF Download | On approval |
| 14-digit FSSAI License Number | Reference Number | On completion |

### VALIDITY & RENEWAL
- **Validity**: 1–5 years (chosen at application)
- **Renewal Required**: Yes — 30 days before expiry; lapse results in penalty + fresh application
- **Compliance**: Annual returns required for certain categories; maintain records of suppliers and buyers

---

## SERVICE: FSSAI Central License
## SLUG: `fssai-central`

### QUESTIONNAIRE

**Step 1: Business Type & Eligibility**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Primary reason for Central License requirement | central_reason | multiselect | Annual turnover > ₹20 Crore, Operations in 2 or more states, Importer of food products, Food business at airport / seaport / railway station, Dairy processing unit > 50,000 litres/day, Slaughterhouse (licensed by Central Govt), Operator under Ministry of Railways / Defence / External Affairs | Yes | — | At least 1 |
| 2 | Category of food business | business_category | select | Manufacturer / Processor, Importer, Exporter, Wholesaler (multi-state), Caterer (operating in 2+ states or at airports), Food Retailer (turnover > ₹20Cr), Cold Chain Operator, Proprietary Food Manufacturer, Others | Yes | — | — |
| 3 | Annual turnover (₹ crores) | annual_turnover | select | ₹20Cr – ₹50Cr, ₹50Cr – ₹100Cr, Above ₹100Cr | Yes | — | — |
| 4 | States of operation | states_of_operation | multiselect | [All 28 States + 8 UTs] | Yes | — | — |
| 5 | Food categories handled | food_categories | multiselect | Cereals & cereal products, Dairy & dairy products, Fats & oils, Fruits & vegetables, Meat & meat products, Fish & seafood, Beverages, Bakery products, Confectionery, Health supplements / Nutraceuticals, Proprietary food, Food additives, Others | Yes | — | — |
| 6 | Is the business involved in import of food? | is_importer | radio | Yes, No | Yes | — | — |
| 7 | Import categories (if importer) | import_categories | multiselect | [Same food categories] | Conditional: is_importer = Yes | — | — |
| 8 | IEC code (if importer) | iec_code | text | — | Conditional: is_importer = Yes | 10-digit IEC | — |

**Step 2: Business & Legal Entity Details**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Legal name of entity | legal_name | text | — | Yes | — | — |
| 2 | Entity type | entity_type | select | Pvt Ltd, Public Ltd, LLP, Partnership, HUF, Trust, Government Undertaking, Others | Yes | — | — |
| 3 | CIN / LLPIN / Registration number | entity_reg_number | text | — | Yes (except proprietorship/HUF) | — | — |
| 4 | PAN of entity | pan_number | text | — | Yes | — | — |
| 5 | GSTIN | gstin | text | — | Yes | — | — |
| 6 | Name of authorized signatory / CEO / MD | signatory_name | text | — | Yes | — | — |
| 7 | Designation of signatory | signatory_designation | text | — | Yes | — | — |

**Step 3: Principal Place of Business & Manufacturing Units**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Registered office / principal place of business address | registered_address | textarea | — | Yes | — | — |
| 2 | Number of manufacturing / processing units | unit_count | number | — | Yes | — | Positive integer |
| 3 | Details of each unit | units_details | repeater | — | Yes | Unit name, address, state, pincode, type of activity, installed capacity | — |
| 4 | Total installed production capacity | total_capacity | text | — | Yes | e.g., 10,000 MT per annum | — |
| 5 | Does any unit have existing FSSAI State License? | has_existing_license | radio | Yes, No | Yes | — | — |
| 6 | Existing FSSAI license numbers | existing_license_numbers | textarea | Conditional: has_existing_license = Yes | — | One per line | — |

**Step 4: Infrastructure & Compliance**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Does the company have an ISO 22000 / HACCP / BRC certification? | has_food_cert | radio | Yes, No | Yes | — | — |
| 2 | Certification type and number | food_cert_details | text | Conditional: has_food_cert = Yes | — | e.g., ISO 22000:2018, Cert No. XYZ | — |
| 3 | Name of food safety officer / supervisor (full-time) | food_safety_officer | text | — | Yes | — | Required for Central License |
| 4 | Qualification of food safety officer | fso_qualification | select | Post-graduate in food science, BSc in food technology, Certified by FSSAI, Others | Yes | — | — |
| 5 | Recall procedure in place? | has_recall_procedure | radio | Yes, No | Yes | — | — |

---

### DOCUMENTS REQUIRED

| # | Document | Key | Required | Formats | Help Text |
|---|----------|-----|----------|---------|-----------|
| 1 | PAN Card of entity | pan_card | Yes | PDF | — |
| 2 | Certificate of Incorporation / Registration | entity_proof | Yes | PDF | — |
| 3 | MOA / AOA or Partnership Deed | moa_aoa | Yes | PDF | — |
| 4 | ID proof + photograph of authorized signatory | signatory_id | Yes | PDF, JPG, PNG | — |
| 5 | Proof of registered office address | address_proof | Yes | PDF, JPG, PNG | — |
| 6 | Blueprint / layout of each manufacturing unit | unit_blueprints | Yes | PDF | Scale drawing showing food handling zones, storage, dispatch |
| 7 | List of food products with categories | food_list | Yes | PDF | Detailed; must match FSSAI food category codes |
| 8 | Equipment list with installed capacities | equipment_list | Yes | PDF, XLSX | For manufacturing units |
| 9 | Water testing report | water_test_report | Yes | PDF | NABL-accredited lab; all units |
| 10 | Medical fitness certificates of food handlers | medical_certs | Yes | PDF | All food handling staff |
| 11 | FSMS / HACCP plan | fsms_plan | Yes | PDF | Detailed plan; mandatory for Central |
| 12 | Photographs of all premises (inside and outside) | premises_photos | Yes | JPG, PNG | — |
| 13 | IEC certificate | iec_certificate | Conditional: is_importer = Yes | PDF | — |
| 14 | NOC from local body | municipal_noc | Yes | PDF | For each unit |
| 15 | Declaration by director / MD / partner | director_declaration | Yes | PDF | We prepare this |
| 16 | Existing FSSAI license copies | existing_licenses | Conditional: has_existing_license = Yes | PDF | For conversion / upgrade |

---

### WORKFLOW STAGES

| Step | Title | Timeline | Description |
|------|-------|----------|-------------|
| 1 | Document Collection & Verification | Day 0–3 | Extensive document set; verified for FSSAI Central requirements. |
| 2 | Application Preparation (Form B — Central) | Day 3–6 | Form B prepared on FoSCoS for Central designation. |
| 3 | Filing & Fee Payment | Day 6–8 | Fee: ₹7,500 – ₹10,000 depending on category. |
| 4 | Central Designated Officer Review | Day 8–30 | FSSAI Central Authority reviews; may seek additional documents. |
| 5 | Physical Inspection | Day 20–45 | Inspector visits all manufacturing / processing units. |
| 6 | Compliance Rectification (if needed) | Day 45–60 | Deficiencies noted during inspection must be rectified. |
| 7 | License Issuance | Day 45–90 | FSSAI Central License issued. |

---

### DELIVERABLES

| Deliverable | Type | When |
|-------------|------|------|
| FSSAI Central License Certificate | PDF Download | On approval |
| 14-digit FSSAI Central License Number | Reference Number | On completion |

### VALIDITY & RENEWAL
- **Validity**: 1–5 years
- **Annual Returns**: Form D1 required; half-yearly return for certain categories
- **Recall**: Mandatory recall procedure and product recall reporting obligations

---

## SERVICE: Trade License
## SLUG: `trade-license`

### QUESTIONNAIRE

**Step 1: Location & Issuing Authority**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | State | state | select | [All States] | Yes | — | — |
| 2 | City / Municipal Area | city | select | [Auto-populate major cities / corporations based on state; Other option available] | Yes | — | — |
| 3 | Name of the issuing authority | issuing_authority | text | — | Yes | Auto-populated based on city (e.g., MCD, BBMP, BMC, GHMC, PCMC) | — |
| 4 | Ward / Zone (if known) | ward | text | — | No | — | — |

**Step 2: Trade & Establishment Details**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Name of establishment / shop | establishment_name | text | — | Yes | Name as displayed on premises | — |
| 2 | Type of trade / business | trade_type | select | General Store / Supermarket, Restaurant / Food Service, Hotel / Lodge, Bakery / Confectionery, Medical Store / Pharmacy, Electronics / Mobile Shop, Garment / Cloth Store, Hardware / Building Material, Auto Workshop / Garage, Salon / Spa / Parlour, Gym / Fitness Centre, Petrol Pump / Fuel Station, Cinema / Multiplex, Event Management, Educational Coaching Centre, E-Commerce Warehouse / Fulfillment Centre, Others | Yes | — | — |
| 3 | Brief description of trade activity | trade_description | textarea | — | Yes | — | — |
| 4 | Area of premises (sq. ft.) | premises_area | number | — | Yes | — | Positive integer |
| 5 | Number of employees | employee_count | number | — | Yes | Include all full-time and part-time | — |
| 6 | Date of commencement of trade | commencement_date | date | — | Yes | — | — |
| 7 | Does the trade involve any hazardous materials / flammable goods? | is_hazardous | radio | Yes, No | Yes | — | If Yes, NOC from Fire Dept required |
| 8 | Does the trade involve food items? | involves_food | radio | Yes, No | Yes | — | If Yes, FSSAI also recommended |

**Step 3: Owner / Applicant Details**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Applicant / owner name | owner_name | text | — | Yes | — | — |
| 2 | Type of entity | entity_type | select | Individual / Proprietor, Partnership Firm, Private Limited Company, LLP, Others | Yes | — | — |
| 3 | PAN of owner / entity | pan_number | text | — | Yes | — | — |
| 4 | Aadhaar of owner (individual / proprietor) | aadhaar_number | text | Conditional: entity_type = Individual | — | 12 digits | — |
| 5 | Mobile number | mobile | tel | — | Yes | — | 10 digits |
| 6 | Email address | email | email | — | Yes | — | — |

---

### DOCUMENTS REQUIRED

| # | Document | Key | Required | Formats | Help Text |
|---|----------|-----|----------|---------|-----------|
| 1 | PAN Card of owner / entity | pan_card | Yes | PDF, JPG, PNG | — |
| 2 | Aadhaar Card of owner | aadhaar_card | Yes | PDF, JPG, PNG | — |
| 3 | Proof of business premises | premises_proof | Yes | PDF, JPG, PNG | Rent agreement / ownership deed / electricity bill |
| 4 | Photograph of establishment (exterior with signboard) | establishment_photo | Yes | JPG, PNG | — |
| 5 | Photograph of applicant | owner_photo | Yes | JPG, PNG | Passport size |
| 6 | NOC from property owner | owner_noc | Conditional: premises is rented | PDF | — |
| 7 | Building plan / completion certificate | building_plan | Conditional: required by some corporations | PDF | — |
| 8 | NOC from Fire Department | fire_noc | Conditional: is_hazardous = Yes or area > 500 sq. ft. in some cities | PDF | Required by Delhi MCD, BMC for certain trade types |
| 9 | FSSAI Registration / License | fssai_proof | Conditional: involves_food = Yes | PDF | — |
| 10 | Certificate of Incorporation / entity proof | entity_proof | Conditional: entity_type ≠ Individual | PDF | — |
| 11 | List of employees | employee_list | Conditional: employee_count ≥ 10 in some municipalities | PDF | — |

---

### WORKFLOW STAGES

| Step | Title | Timeline | Description |
|------|-------|----------|-------------|
| 1 | Document Collection & Verification | Day 0–1 | — |
| 2 | Application Preparation | Day 1–2 | Application form prepared per municipality format. |
| 3 | Application Submission & Fee Payment | Day 2–3 | Filed on municipal portal or submitted physically. Fee varies by trade type, area, and location. |
| 4 | Municipal Verification | Day 3–15 | Inspector may visit premises. |
| 5 | License Issuance | Day 15–30 | Trade License issued by municipal authority. |

---

### DELIVERABLES

| Deliverable | Type | When |
|-------------|------|------|
| Trade License Certificate | PDF / Physical | On approval |
| License Number | Reference Number | On completion |

### VALIDITY & RENEWAL
- **Validity**: 1 year (most municipalities); some cities offer 3-year or 5-year licenses
- **Renewal Required**: Yes — annually in most cities; failure attracts penalties
- **Display**: Must be displayed prominently at the premises at all times

---

# GROUP 4: INTELLECTUAL PROPERTY

---

## SERVICE: Trademark Registration
## SLUG: `trademark-registration`

### QUESTIONNAIRE

**Step 1: Applicant Details**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Type of applicant | applicant_type | select | Individual, Sole Proprietorship, Partnership Firm, Private Limited Company, Public Limited Company, LLP, Trust / Society, HUF | Yes | — | Determines Form TM-A fee category |
| 2 | Legal name of applicant | applicant_name | text | — | Yes | As per PAN / incorporation | — |
| 3 | Nationality | applicant_nationality | select | Indian, Foreign | Yes | — | — |
| 4 | Country of incorporation / domicile | applicant_country | select | [Country list] | Yes | — | — |
| 5 | Address of applicant | applicant_address | textarea | — | Yes | — | — |
| 6 | State | applicant_state | select | [All States] | Yes | — | Determines jurisdictional Trademark Registry office (Mumbai, Delhi, Kolkata, Ahmedabad, Chennai) |
| 7 | Email address | applicant_email | email | — | Yes | — | — |
| 8 | Mobile number | applicant_mobile | tel | — | Yes | — | — |
| 9 | PAN of applicant | applicant_pan | text | — | Yes (for Indian) | — | — |

**Step 2: Trademark Details**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Type of trademark | trademark_type | select | Word Mark (text only), Logo / Device Mark (image only), Composite Mark (word + logo), Series Mark (multiple related marks in one application) | Yes | — | — |
| 2 | Word / Text of the mark | trademark_word | text | — | Conditional: trademark_type = Word Mark or Composite Mark | The word(s) you want to trademark | — |
| 3 | Description of logo / device | trademark_logo_description | textarea | — | Conditional: trademark_type = Logo / Device or Composite | Describe the logo in detail | — |
| 4 | Language of the mark | trademark_language | select | English, Hindi, Both, Other Indian Language, Foreign Language | Yes | — | — |
| 5 | Translation / Transliteration (if non-English) | trademark_translation | text | — | Conditional: trademark_language ≠ English | Provide English meaning / transliteration | — |
| 6 | Does the mark claim any colour(s)? | claims_colour | radio | Yes, No | Yes | — | — |
| 7 | Colours claimed | claimed_colours | text | Conditional: claims_colour = Yes | — | e.g., Red, White, Blue | — |

**Step 3: Nice Classification (Goods & Services)**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Select the class(es) for which trademark is sought | trademark_classes | multiselect | Class 1: Chemicals, Class 2: Paints / Coatings, Class 3: Cosmetics / Cleaning products, Class 4: Lubricants / Fuels, Class 5: Pharmaceuticals, Class 6: Metal goods, Class 7: Machinery, Class 8: Hand tools, Class 9: Scientific / Electronics / Software, Class 10: Medical devices, Class 11: Lighting / HVAC, Class 12: Vehicles, Class 13: Firearms, Class 14: Jewellery / Precious metals, Class 15: Musical instruments, Class 16: Paper / Stationery, Class 17: Rubber / Plastics, Class 18: Leather / Luggage, Class 19: Building materials (non-metal), Class 20: Furniture, Class 21: Household utensils, Class 22: Ropes / Textiles (raw), Class 23: Yarns / Threads, Class 24: Textiles / Bed covers, Class 25: Clothing / Footwear / Headgear, Class 26: Lace / Ribbons / Buttons, Class 27: Carpets / Floor coverings, Class 28: Games / Sporting goods, Class 29: Meat / Fish / Dairy / Processed foods, Class 30: Coffee / Tea / Flour / Baked goods, Class 31: Fresh fruits / Vegetables / Agricultural products, Class 32: Beer / Non-alcoholic beverages, Class 33: Alcoholic beverages (except beer), Class 34: Tobacco, Class 35: Advertising / Business services, Class 36: Insurance / Financial services, Class 37: Construction / Repair services, Class 38: Telecommunication services, Class 39: Transport / Travel, Class 40: Treatment of materials / Manufacturing services, Class 41: Education / Entertainment, Class 42: IT / Scientific / Research services, Class 43: Food and drink services (restaurants/hotels), Class 44: Medical / Veterinary / Beauty services, Class 45: Legal / Security / Personal and social services | Yes | — | At least 1 class required |
| 2 | Specify the exact goods / services within each class | goods_services_description | textarea | — | Yes | e.g., Class 25: T-shirts, jeans, kurtas, footwear | Must match the class selected |
| 3 | Number of classes selected | class_count | auto-calculated | — | — | — | Affects government fee: ₹4,500/class for individuals/startups/MSMEs; ₹9,000/class for others — online filing |

**Step 4: Use of Mark**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Is the mark currently in use? | mark_in_use | radio | Proposed to be Used, Already in Use | Yes | — | — |
| 2 | Date of first use of the mark | first_use_date | date | Conditional: mark_in_use = Already in Use | — | Date you first used this mark commercially | Must be a past date |
| 3 | Date of first use in commerce / exports | first_use_in_commerce | date | Conditional: mark_in_use = Already in Use | — | — | Same or after first_use_date |
| 4 | Do you have evidence of use? | has_use_evidence | radio | Yes, No | Conditional: mark_in_use = Already in Use | — | — |
| 5 | Type of evidence available | use_evidence_type | multiselect | Invoices / bills, Packaging with mark, Advertisements, Website screenshots, Newspaper / magazine advertisements | Conditional: has_use_evidence = Yes | — | — |
| 6 | Is this a convention application (claiming priority from foreign application)? | is_convention | radio | Yes, No | Yes | — | — |
| 7 | Country of convention application | convention_country | select | [Country list] | Conditional: is_convention = Yes | — | — |
| 8 | Convention application number | convention_app_number | text | Conditional: is_convention = Yes | — | — | — |
| 9 | Convention application date | convention_date | date | Conditional: is_convention = Yes | — | — | Within 6 months of filing in India |

---

### DOCUMENTS REQUIRED

| # | Document | Key | Required | Formats | Help Text |
|---|----------|-----|----------|---------|-----------|
| 1 | Logo / device artwork | logo_file | Conditional: trademark_type = Logo or Composite | JPG, PNG, PDF | High resolution (minimum 300 DPI); black & white if no colour claim; size 8cm x 8cm |
| 2 | Power of Attorney (Form TM-M-48) | poa | Yes | PDF | Authorizing us to file on your behalf; we prepare; needs applicant signature |
| 3 | ID proof of applicant | id_proof | Yes | PDF, JPG, PNG | PAN + Aadhaar for individuals; CoI for companies |
| 4 | MSME / Startup registration certificate | msme_cert | Conditional: applicant is MSME or Startup | PDF | 50% fee concession for MSMEs and startups |
| 5 | Certificate of incorporation | coi | Conditional: applicant_type = Pvt Ltd / LLP / OPC etc. | PDF | — |
| 6 | User affidavit (Form TM-M-150) | user_affidavit | Conditional: mark_in_use = Already in Use | PDF | Sworn statement of prior use; we prepare; needs notarization |
| 7 | Evidence of prior use | use_evidence | Conditional: mark_in_use = Already in Use and has_use_evidence = Yes | PDF, JPG | Invoices, packaging, advertisements showing mark use |
| 8 | Priority document | priority_doc | Conditional: is_convention = Yes | PDF | Certified copy of foreign application |

---

### WORKFLOW STAGES

| Step | Title | Timeline | Description |
|------|-------|----------|-------------|
| 1 | Document Collection & Pre-filing Search | Day 0–2 | Documents collected; trademark availability search conducted on IP India database across selected classes. Conflict report shared before filing. |
| 2 | Application Preparation (Form TM-A) | Day 2–4 | Form TM-A prepared with mark details, classes, goods/services, applicant details. |
| 3 | Filing on IP India Portal | Day 4–5 | Filed online; government fee paid per class. |
| 4 | Acknowledgment & Application Number | Day 5 | Filing acknowledgment and application number issued immediately. |
| 5 | Formality Check | Day 5–30 | Trademark Registry checks for formal correctness. |
| 6 | Vienna Codification (for logo marks) | Day 30–90 | Logo marks given a Vienna classification code; no action needed from applicant. |
| 7 | Examination | Day 90–180 | Examiner reviews for distinctiveness, prior conflicting marks, statutory bars. Examination Report may be issued. |
| 8 | Response to Objections (if any) | Day 180–240 | If TM-O raised, we draft and file response with arguments and evidence. |
| 9 | Hearing (if required) | Day 240–360 | If objections not resolved by written response, hearing before the Registrar scheduled. |
| 10 | Publication in Trademark Journal | Day 360–420 | Mark accepted and published in weekly Official Gazette. 4-month opposition window opens. |
| 11 | Opposition Period | Day 420–540 | 4-month window for third parties to oppose. If no opposition, proceeds to registration. |
| 12 | Registration | Day 540–600 | Registration Certificate issued. TM® symbol can now be used. |

---

### DELIVERABLES

| Deliverable | Type | When |
|-------------|------|------|
| Application Filing Acknowledgment | PDF | On filing (Day 5) |
| Application Number | Reference Number | Immediately on filing |
| Trademark Search Report | PDF Report | Before filing |
| Examination Report Response (if applicable) | PDF | If objection raised |
| Trademark Registration Certificate | PDF Download | On final registration |

### VALIDITY & RENEWAL
- **Validity**: 10 years from date of application
- **Renewal**: Every 10 years; renewal application (Form TM-R) filed 6 months before expiry
- **Symbol Usage**: TM™ from filing date; ® only after registration
- **Note**: Registration is backdated to the date of application for all rights

---

## SERVICE: Copyright Registration
## SLUG: `copyright-registration`

### QUESTIONNAIRE

**Step 1: Type of Work**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Category of creative work | work_category | select | Literary Work (books, articles, stories, databases), Dramatic Work (scripts, screenplays), Musical Work (compositions without lyrics), Sound Recording (recorded music, podcasts), Artistic Work (paintings, drawings, sculptures, photographs, logos), Cinematograph Film (movies, short films, animations), Computer Programme / Software, Architecture, Advertisement (artistic element) | Yes | — | Determines form and required documents |
| 2 | Title of the work | work_title | text | — | Yes | — | — |
| 3 | Language of the work | work_language | select | English, Hindi, Tamil, Telugu, Kannada, Malayalam, Bengali, Marathi, Gujarati, Punjabi, Others | Yes | — | — |
| 4 | Brief description of the work | work_description | textarea | — | Yes | Describe the content / subject matter | Min 50 chars |

**Step 2: Authorship & Ownership**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Nature of authorship | authorship_type | select | Single author, Multiple authors (joint work), Work created for hire / by employee, Anonymous, Pseudonymous | Yes | — | — |
| 2 | Is the applicant the same as the author? | applicant_is_author | radio | Yes, No | Yes | — | — |
| 3 | If not, relationship of applicant to work | ownership_basis | select | Employer (work made for hire), Assignee (assignment from author), Licensee, Publisher, Producer | Conditional: applicant_is_author = No | — | — |

**Repeater: Author Details** (if single author: 1 entry; if joint work: multiple)

| Question | Key | Type | Required | Notes |
|----------|-----|------|----------|-------|
| Author's full name | author_name | text | Yes | — |
| Is the author an individual or organization? | author_type | select (Individual, Organization) | Yes | — |
| Author's nationality | author_nationality | select | Yes | — |
| Author's address | author_address | textarea | Yes | — |
| Contribution of this author (for joint works) | author_contribution | text | Conditional: authorship_type = Joint work | — |
| Is this author deceased? | author_deceased | radio (Yes, No) | Yes | — |
| Year of death (if deceased) | author_death_year | number | Conditional: author_deceased = Yes | — |

**Step 3: Publication Details**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Is the work published or unpublished? | publication_status | select | Published, Unpublished | Yes | — | — |
| 2 | Year of publication | publication_year | number | Conditional: publication_status = Published | e.g., 2023 | Must be on or before current year |
| 3 | Country of first publication | publication_country | select | [Country list] | Conditional: publication_status = Published | — | — |
| 4 | Name and address of publisher | publisher_details | textarea | Conditional: publication_status = Published | — | — | — |
| 5 | Year of creation (if unpublished) | creation_year | number | Conditional: publication_status = Unpublished | — | Year the work was completed | — |
| 6 | Is the work registered or protected in any foreign country? | foreign_registration | radio | Yes, No | Yes | — | — |

**Step 4: Applicant Details**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Name of applicant | applicant_name | text | — | Yes | — | — |
| 2 | Type of applicant | applicant_type | select | Individual, Company, Partnership, LLP, Trust / Society, Government | Yes | — | — |
| 3 | Address | applicant_address | textarea | — | Yes | — | — |
| 4 | Nationality | applicant_nationality | select | [Country list] | Yes | — | — |
| 5 | Mobile | applicant_mobile | tel | — | Yes | — | — |
| 6 | Email | applicant_email | email | — | Yes | — | — |

---

### DOCUMENTS REQUIRED

| # | Document | Key | Required | Formats | Help Text |
|---|----------|-----|----------|---------|-----------|
| 1 | Copy of the work | work_copy | Yes | PDF, JPG, PNG, ZIP | Literary: PDF. Artistic: high-res image. Software: source code printout (first and last 10 pages if lengthy). |
| 2 | Power of Attorney (Form XIV) | poa | Yes | PDF | Authorizing us to file; we prepare; needs applicant signature |
| 3 | NOC from author (if applicant ≠ author) | author_noc | Conditional: applicant_is_author = No | PDF | Signed by author authorizing registration in applicant's name |
| 4 | Assignment deed (if assignee) | assignment_deed | Conditional: ownership_basis = Assignee | PDF | Deed of assignment from author to applicant |
| 5 | NOC from original work's owner (if adaptation) | original_work_noc | Conditional: work is an adaptation / derivative | PDF | — |
| 6 | ID proof of applicant | id_proof | Yes | PDF, JPG, PNG | Aadhaar / PAN for individuals; CoI for companies |
| 7 | Publisher's NOC (if published and publisher ≠ applicant) | publisher_noc | Conditional: publication_status = Published and publisher ≠ applicant | PDF | — |

---

### WORKFLOW STAGES

| Step | Title | Timeline | Description |
|------|-------|----------|-------------|
| 1 | Document Collection & Verification | Day 0–2 | — |
| 2 | Application Preparation (Form XIV / Statement of Particulars) | Day 2–4 | Application prepared on copyright.gov.in portal. |
| 3 | Filing & Diary Number Generation | Day 4–5 | Application filed; Diary Number issued immediately. |
| 4 | Mandatory Waiting Period | Day 5–35 | 30-day mandatory waiting period for objections from any third party claiming interest in the work. |
| 5 | Objection Handling (if any) | Day 35–90 | If an objection is filed, both parties are given opportunity to be heard. |
| 6 | Examination | Day 35–90 | Copyright Office examines the application for completeness and compliance. |
| 7 | Registration & Certificate | Day 90–180 | Copyright registered; Registration Certificate issued. |

---

### DELIVERABLES

| Deliverable | Type | When |
|-------------|------|------|
| Diary Number | Reference Number | Immediately on filing |
| Copyright Registration Certificate | PDF Download | On registration (3–6 months) |

### VALIDITY & RENEWAL
- **Literary, Dramatic, Musical, Artistic**: Author's lifetime + 60 years
- **Sound Recording, Cinematograph Film**: 60 years from year of publication
- **Computer Programme**: Author's lifetime + 60 years
- **No Renewal Required**: One-time registration; right exists from creation

---

## SERVICE: Patent Filing
## SLUG: `patent-filing`

### QUESTIONNAIRE

**Step 1: Type of Application**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Type of patent application | application_type | select | Provisional Application (establishes filing date; complete specification filed within 12 months), Complete Application (full specification from the start), Convention Application (claiming priority from foreign application within 12 months), PCT National Phase (entering Indian national phase of PCT application), Patent of Addition (improvement to existing Indian patent) | Yes | — | — |
| 2 | Title of the invention | invention_title | text | — | Yes | Concise technical title | Max 500 chars; avoid trade names |
| 3 | Field of invention | invention_field | select | Biotechnology / Life Sciences, Chemical / Pharmaceutical, Electrical / Electronics, Mechanical / Structural, Computer Science / Software-related, Civil / Construction, Agriculture, Medical Devices, Nanotechnology, Others | Yes | — | — |
| 4 | Is the invention software-related? | is_software_related | radio | Yes, No | Yes | — | Software per se is not patentable in India; technical application may be |
| 5 | Has the invention been publicly disclosed anywhere before this filing? | prior_disclosure | radio | Yes, No | Yes | — | Disclosure before filing may affect patentability |
| 6 | Date of disclosure (if any) | disclosure_date | date | Conditional: prior_disclosure = Yes | — | — | — |
| 7 | Has a foreign patent been filed for this invention? | foreign_filing | radio | Yes, No | Yes | — | — |
| 8 | Country and filing date of foreign application | foreign_filing_details | textarea | Conditional: foreign_filing = Yes | — | Country, application number, date | — |
| 9 | Foreign filing license obtained from Indian Patent Office? | has_ffl | radio | Yes, No, Not Required (invention not originated in India) | Conditional: foreign_filing = Yes | Required if invention originated in India | — |

**Step 2: Inventor Details**

**Repeater: Inventor Details** (min: 1, max: unlimited)

| Question | Key | Type | Required | Notes |
|----------|-----|------|----------|-------|
| Inventor's full name | inventor_name | text | Yes | — |
| Inventor's nationality | inventor_nationality | select | Yes | — |
| Inventor's address | inventor_address | textarea | Yes | — |
| Is this inventor also the applicant? | inventor_is_applicant | radio (Yes, No) | Yes | — |

**Step 3: Applicant Details**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Name of applicant | applicant_name | text | — | Yes | Individual name or company name | — |
| 2 | Type of applicant | applicant_type | select | Natural Person (Individual), Small Entity (MSME), Startup (DPIIT Recognized), Educational Institution, Government, Large Entity / Company | Yes | — | Small entity and startup get 80% fee reduction |
| 3 | Nationality / Country of incorporation | applicant_country | select | [Country list] | Yes | — | — |
| 4 | Address | applicant_address | textarea | Yes | — | — | — |
| 5 | Is the applicant an assignee of the inventor's rights? | is_assignee | radio | Yes, No | Yes | — | — |

**Step 4: Invention Description**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Brief summary of the invention | invention_summary | textarea | — | Yes | In non-technical terms — what problem does it solve? | Min 200 chars |
| 2 | Technical problem the invention solves | technical_problem | textarea | — | Yes | Existing problem / drawback in current art | — |
| 3 | Technical solution offered by the invention | technical_solution | textarea | — | Yes | How the invention overcomes the problem | — |
| 4 | Key novel features / claims (preliminary) | key_claims | textarea | — | Yes | What is new and inventive? | Used to draft claims |
| 5 | Are there drawings / diagrams of the invention? | has_drawings | radio | Yes, No | Yes | — | — |
| 6 | Number of sheets of drawings | drawings_count | number | Conditional: has_drawings = Yes | — | — | Positive integer |
| 7 | Prior art known to inventor | prior_art | textarea | — | No | Known patents, publications, or products in this field | Honesty in disclosure required |

---

### DOCUMENTS REQUIRED

| # | Document | Key | Required | Formats | Help Text |
|---|----------|-----|----------|---------|-----------|
| 1 | Provisional or Complete Specification | specification | Yes | PDF, DOCX | For provisional: brief description sufficient. For complete: must include Abstract, Description, Claims, and Drawings. We help draft this. |
| 2 | Drawings / Diagrams | drawings | Conditional: has_drawings = Yes | PDF | Must follow Patent Office drawing standards: black and white, no shading except for cross-sections |
| 3 | Form 1 (Application for Patent) | form_1 | Yes | — | We prepare this |
| 4 | Form 2 (Provisional / Complete Specification) | form_2 | Yes | — | We prepare this |
| 5 | Form 5 (Declaration of Inventorship) | form_5 | Yes | PDF | Signed by all inventors; we prepare |
| 6 | Form 26 (Power of Attorney) | poa_form_26 | Yes | PDF | Authorizing us as patent agent; needs applicant signature |
| 7 | Priority document (certified copy of foreign application) | priority_doc | Conditional: application_type = Convention Application | PDF | Must be submitted within 3 months of filing |
| 8 | Assignment deed (if applicant ≠ inventor) | assignment_deed | Conditional: is_assignee = Yes | PDF | — |
| 9 | MSME / Startup certificate | small_entity_cert | Conditional: applicant_type = Small Entity or Startup | PDF | Required to avail fee concession |
| 10 | Sequence listing (for biotech / gene-related inventions) | sequence_listing | Conditional: invention_field = Biotechnology | PDF, TXT | As per WIPO standard ST.25 |

---

### WORKFLOW STAGES

| Step | Title | Timeline | Description |
|------|-------|----------|-------------|
| 1 | Document Collection & Prior Art Search | Day 0–5 | Invention details collected; prior art search conducted on Indian Patent Office database, Espacenet, Google Patents. Patentability assessment shared. |
| 2 | Specification Drafting | Day 5–20 | Complete/Provisional specification drafted: Abstract, Background, Description, Claims, Drawings. |
| 3 | Applicant Review & Approval | Day 20–25 | Draft shared for technical review and sign-off by inventors. |
| 4 | Filing on IP India Patent Portal | Day 25–30 | Forms 1, 2, 5, 26 filed online. Application number issued immediately. |
| 5 | Publication | Day 30 + 18 months | Mandatorily published 18 months from filing date. Earlier publication possible on request (Form 9). |
| 6 | Request for Examination (RFE) | Within 48 months of filing | Form 18 (ordinary) or Form 18A (expedited) must be filed to trigger examination. |
| 7 | First Examination Report (FER) | After RFE | Examiner issues FER with objections. Response must be filed within 12 months. |
| 8 | Hearing (if required) | — | If objections persist, hearing scheduled. |
| 9 | Grant | — | Patent granted and published in Patent Office Journal. |

---

### DELIVERABLES

| Deliverable | Type | When |
|-------------|------|------|
| Patent Application Number | Reference Number | On filing |
| Prior Art Search Report | PDF Report | Before filing |
| Drafted Patent Specification | PDF Document | Before filing |
| Publication Notice | PDF | At 18 months |
| First Examination Report Response | PDF Document | When applicable |
| Patent Grant Certificate | PDF Download | On grant |

### VALIDITY & RENEWAL
- **Validity**: 20 years from date of filing (not from grant)
- **Annuity**: Annual maintenance fees payable from 3rd year onwards; non-payment results in lapse
- **Working Statement**: Form 27 must be filed annually by March 31st

---

# GROUP 5: COMPLIANCE & CHANGES

---

## SERVICE: GST Return Filing
## SLUG: `gst-return-filing`

### QUESTIONNAIRE

**Step 1: GSTIN & Filing Period**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | GSTIN | gstin | text | — | Yes | e.g., 07ABCDE1234F1Z5 | 15-char GSTIN format |
| 2 | Registered business name | business_name | text | — | Yes | Auto-fetchable from GSTIN | — |
| 3 | Return type to be filed | return_type | multiselect | GSTR-1 (Outward Supplies), GSTR-3B (Summary return with tax payment), GSTR-9 (Annual Return), GSTR-9C (Reconciliation Statement — if turnover > ₹5Cr), GSTR-4 (Quarterly return for Composition taxpayers), CMP-08 (Quarterly statement for Composition), GSTR-2B Reconciliation | Yes | — | At least 1 |
| 4 | Filing frequency | filing_frequency | select | Monthly (turnover > ₹5Cr), Quarterly under QRMP scheme (turnover < ₹5Cr) | Yes | — | — |
| 5 | Financial year | financial_year | select | [FY options: 2021-22, 2022-23, 2023-24, 2024-25] | Yes | — | — |
| 6 | Month / Quarter for which return is to be filed | filing_period | select | Monthly: Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec, Jan, Feb, Mar / Quarterly: Q1 Apr-Jun, Q2 Jul-Sep, Q3 Oct-Dec, Q4 Jan-Mar | Yes | — | — |
| 7 | Are there any previous periods with pending returns? | pending_returns | radio | Yes, No | Yes | — | — |
| 8 | Periods with pending returns | pending_periods | textarea | Conditional: pending_returns = Yes | — | List month and year for each | — |

**Step 2: Business Activity for the Period**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Did the business have any sales / outward supplies in this period? | has_sales | radio | Yes, No (Nil return) | Yes | — | — |
| 2 | Total taxable outward supply value (₹) | total_outward_value | number | — | Conditional: has_sales = Yes | — | — |
| 3 | Break-up of sales by rate | sales_breakup | multiselect | @ 0% (Nil rated / Exempt), @ 5%, @ 12%, @ 18%, @ 28%, Reverse Charge applicable sales, Export (Zero-rated), SEZ supplies | Conditional: has_sales = Yes | — | At least 1 |
| 4 | Number of B2B invoices raised | b2b_invoice_count | number | Conditional: has_sales = Yes | — | Invoices to GST-registered buyers | — |
| 5 | Number of B2C invoices raised | b2c_invoice_count | number | Conditional: has_sales = Yes | — | Invoices to unregistered buyers | — |
| 6 | Did the business have any credit notes / debit notes? | has_cdn | radio | Yes, No | Yes | — | — |
| 7 | Total input tax credit (ITC) claimed for the period (₹) | total_itc | number | — | Yes | From GSTR-2B | — |
| 8 | ITC break-up (IGST, CGST, SGST) | itc_breakup | text | — | Yes | e.g., IGST: 5000, CGST: 2000, SGST: 2000 | — |
| 9 | Tax payable after ITC set-off (₹) | tax_payable | number | — | Yes | Net tax liability | Non-negative |
| 10 | Mode of tax payment | payment_mode | select | Through Challan (already paid), Yet to be paid (we will generate challan) | Yes | — | — |

---

### DOCUMENTS REQUIRED

| # | Document | Key | Required | Formats | Help Text |
|---|----------|-----|----------|---------|-----------|
| 1 | Sales register / outward supply data | sales_data | Yes | XLSX, CSV, PDF | Invoicewise: buyer GSTIN, invoice number, date, taxable value, GST rate, IGST/CGST/SGST; we can provide template |
| 2 | Purchase register / inward supply data | purchase_data | Yes | XLSX, CSV, PDF | For ITC reconciliation with GSTR-2B |
| 3 | GSTR-2B (auto-generated by GST portal) | gstr_2b | Yes | PDF, XLSX | Download from GST portal for the relevant month |
| 4 | Previous filed returns (if reconciliation needed) | previous_returns | Conditional: pending_returns = Yes or return_type includes GSTR-9 | PDF | Copies of previously filed GSTR-1 and GSTR-3B |
| 5 | Bank statement for the period | bank_statement | Conditional: return_type includes GSTR-9 / GSTR-9C | PDF | — |
| 6 | Export invoices / shipping bills | export_docs | Conditional: sales_breakup includes Export | PDF | Shipping bill number and port code required |
| 7 | E-way bill report | eway_bill_report | Conditional: applicable to business type | PDF, XLSX | — |
| 8 | Audited financial statements | financial_statements | Conditional: return_type includes GSTR-9C | PDF | Required for reconciliation statement |

---

### WORKFLOW STAGES

| Step | Title | Timeline | Description |
|------|-------|----------|-------------|
| 1 | Data Collection & Validation | Day 0–1 | Sales and purchase data received; validated against GSTR-2B for ITC matching. Mismatches flagged. |
| 2 | GSTR-1 Preparation & Filing | Day 1–2 | Invoice-level outward supply data uploaded and GSTR-1 filed before due date. |
| 3 | Tax Computation | Day 2–3 | Tax liability computed after ITC set-off. Challan generated for any balance payable. |
| 4 | GSTR-3B Preparation & Filing | Day 3–4 | Summary return prepared; tax paid via challan if applicable; GSTR-3B filed. |
| 5 | Filing Confirmation | Day 4–5 | Acknowledgment / ARN for both returns shared. Reconciliation summary shared. |

---

### DELIVERABLES

| Deliverable | Type | When |
|-------------|------|------|
| Filed GSTR-1 Acknowledgment (ARN) | PDF | After GSTR-1 filing |
| Filed GSTR-3B Acknowledgment (ARN) | PDF | After GSTR-3B filing |
| Tax Payment Challan (if applicable) | PDF | On payment |
| ITC Reconciliation Summary | PDF Report | With each filing |
| Monthly Filing Summary Report | PDF | On completion |

### VALIDITY & RENEWAL
- **Recurring service**: Monthly / Quarterly as per QRMP scheme
- **Due Dates**: GSTR-1: 10th (monthly) or 13th (QRMP quarterly); GSTR-3B: 20th/22nd/24th based on state category
- **Late Filing Penalty**: ₹50/day (₹20/day for nil returns); maximum ₹5,000 per return; plus interest at 18% p.a. on unpaid tax

---

## SERVICE: Annual ROC Filing
## SLUG: `roc-annual-filing`

### QUESTIONNAIRE

**Step 1: Company / LLP Details**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Entity type | entity_type | select | Private Limited Company, One Person Company, Public Limited Company, Section 8 Company, LLP | Yes | — | Determines applicable forms |
| 2 | CIN / LLPIN | cin | text | — | Yes | e.g., U74999DL2020PTC123456 | Alphanumeric CIN / LLPIN format |
| 3 | Registered name of company / LLP | company_name | text | — | Yes | Auto-fetchable from MCA using CIN | — |
| 4 | Financial year for which filing is to be done | financial_year | select | [FY options] | Yes | — | — |
| 5 | Date of Annual General Meeting (AGM) | agm_date | date | Conditional: entity_type = Company | — | LLPs do not have AGM | Must be within 6 months of financial year end |
| 6 | Was AGM held within the due date? | agm_timely | radio | Yes, No, Not Applicable | Conditional: entity_type = Company | — | — |

**Step 2: Financial Particulars**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Total turnover / revenue for the year (₹) | total_turnover | number | — | Yes | — | Non-negative |
| 2 | Net profit / (loss) after tax (₹) | net_profit_loss | number | — | Yes | Enter negative for loss | — |
| 3 | Paid-up share capital as on 31st March (₹) | paidup_capital | number | Conditional: entity_type = Company | — | — |
| 4 | Total assets as on 31st March (₹) | total_assets | number | — | Yes | — | — |
| 5 | Total liabilities as on 31st March (₹) | total_liabilities | number | — | Yes | — | — |
| 6 | Is the company required to get accounts audited? | is_audit_required | radio | Yes, No | Yes | Mandatory for all companies; LLPs with turnover > ₹40L or contribution > ₹25L | — |
| 7 | Name of auditor / CA firm | auditor_name | text | Conditional: is_audit_required = Yes | — | — | — |
| 8 | ICAI Membership Number of signing CA | auditor_membership | text | Conditional: is_audit_required = Yes | — | 6-digit membership number | — |
| 9 | Date of auditor appointment | auditor_appointment_date | date | Conditional: is_audit_required = Yes | — | — | — |
| 10 | Has the company changed its auditor this year? | auditor_changed | radio | Yes, No | Conditional: is_audit_required = Yes | — | — |

**Step 3: Director / Partner Details for the Year**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Number of directors / designated partners as on 31st March | director_count | number | — | Yes | — | — |
| 2 | Were there any director / partner changes during the year? | director_changes | radio | Yes, No | Yes | — | — |
| 3 | Type of change | director_change_type | multiselect | Appointment, Resignation, Change in details, Change in DIN KYC | Conditional: director_changes = Yes | — | — |
| 4 | Number of board meetings held during the year | board_meetings_count | number | Conditional: entity_type = Company | — | Min 4 required; gap not > 120 days | — |
| 5 | Dates of board meetings | board_meeting_dates | textarea | Conditional: entity_type = Company | — | One date per line | — |

**Step 4: Additional Disclosures**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Is the company a Small Company? | is_small_company | radio | Yes, No | Conditional: entity_type = Pvt Ltd or OPC | Paid-up capital ≤ ₹4Cr AND turnover ≤ ₹40Cr | — |
| 2 | Does the company have any subsidiaries? | has_subsidiaries | radio | Yes, No | Yes | — | — |
| 3 | Does the company have any associate companies? | has_associates | radio | Yes, No | Yes | — | — |
| 4 | Were any loans given to / taken from directors or related parties? | has_related_party_loans | radio | Yes, No | Yes | — | — |
| 5 | Was any CSR applicable this year? | csr_applicable | radio | Yes, No | Yes | CSR mandatory if net profit > ₹5Cr, turnover > ₹1000Cr, or net worth > ₹500Cr | — |
| 6 | CSR amount spent (₹) | csr_amount | number | Conditional: csr_applicable = Yes | — | — | — |
| 7 | Were any deposits accepted from public? | has_public_deposits | radio | Yes, No | Yes | — | — |

---

### DOCUMENTS REQUIRED

| # | Document | Key | Required | Formats | Help Text |
|---|----------|-----|----------|---------|-----------|
| 1 | Audited Financial Statements (Balance Sheet, P&L, Cash Flow, Notes) | financial_statements | Yes | PDF | Signed by directors and auditor; includes schedules |
| 2 | Auditor's Report | auditors_report | Yes | PDF | — |
| 3 | Board's Report | boards_report | Yes | PDF | We help draft this — includes all mandatory disclosures |
| 4 | List of shareholders as on 31st March | shareholder_list | Yes (for MGT-7) | PDF, XLSX | Name, PAN, address, number of shares |
| 5 | List of directors / partners with DIN / DPIN | director_list | Yes | PDF, XLSX | Name, DIN, date of appointment, designation |
| 6 | Minutes of AGM | agm_minutes | Conditional: entity_type = Company | PDF | — |
| 7 | DSC of director / designated partner | dsc | Yes | — | For signing AOC-4, MGT-7 / LLP forms |
| 8 | Previous year filed returns (AOC-4, MGT-7) | previous_filings | Conditional: first time using our service | PDF | To check continuity |
| 9 | LLP Form 11 data (partners, contribution, profit sharing) | llp_form11_data | Conditional: entity_type = LLP | XLSX, PDF | — |

---

### WORKFLOW STAGES

| Step | Title | Timeline | Description |
|------|-------|----------|-------------|
| 1 | Document Collection & Financial Verification | Day 0–3 | Financial statements and supporting documents collected; checked for statutory disclosures. |
| 2 | Board's Report Drafting | Day 3–6 | Board's Report drafted including all mandatory annexures. |
| 3 | AOC-4 Preparation (Financial Filing) | Day 6–10 | Balance Sheet, P&L uploaded on MCA portal. XBRL format if applicable. |
| 4 | MGT-7 / MGT-7A Preparation (Annual Return) | Day 6–10 | Annual return prepared; shareholder and director details populated. |
| 5 | Director Digital Signing | Day 10–12 | AOC-4 and MGT-7 signed digitally by authorized director using DSC. |
| 6 | Filing with MCA | Day 12–15 | Forms filed on MCA V3 portal; government fee paid based on authorized capital. |
| 7 | Filing Confirmation | Day 15 | MCA SRN and acknowledgment shared. |

**For LLP**: Form 8 (Statement of Account & Solvency) — due October 30th; Form 11 (Annual Return) — due May 30th

---

### DELIVERABLES

| Deliverable | Type | When |
|-------------|------|------|
| AOC-4 Filing Acknowledgment (SRN) | Reference Number | On filing |
| MGT-7 / MGT-7A Filing Acknowledgment (SRN) | Reference Number | On filing |
| Board's Report | PDF Document | On completion |
| MCA Filing Receipts | PDF | On filing |
| LLP Form 8 & 11 Acknowledgments (for LLPs) | PDF | On filing |

### VALIDITY & RENEWAL
- **Annual Service**: Must be filed every year
- **Due Dates**: AOC-4: within 30 days from AGM; MGT-7: within 60 days from AGM; default AGM date: 30 September
- **Late Filing Fee**: ₹100/day per form (no cap)
- **Strike-off Risk**: Non-filing for 2+ consecutive years triggers strike-off proceedings by RoC

---

## SERVICE: Director Change
## SLUG: `director-change`

### QUESTIONNAIRE

**Step 1: Company Details**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | CIN of the company | cin | text | — | Yes | e.g., U74999DL2020PTC123456 | Alphanumeric CIN |
| 2 | Registered name of company | company_name | text | — | Yes | Auto-fetchable from MCA | — |
| 3 | Type of change required | change_type | multiselect | Appointment of New Director, Resignation of Existing Director, Change in Director's Personal Details (address / name), Director KYC Update (DIR-3 KYC) | Yes | — | At least 1 |

**Step 2: Director Being Appointed** *(Conditional: change_type includes Appointment)*

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Full legal name of new director | new_director_name | text | — | Yes | As per PAN | — |
| 2 | Father's name | new_director_father | text | — | Yes | — | — |
| 3 | Date of birth | new_director_dob | date | — | Yes | — | 18+ |
| 4 | Nationality | new_director_nationality | select | Indian, Foreign | Yes | — | — |
| 5 | PAN | new_director_pan | text | — | Yes (Indian) | — | — |
| 6 | Aadhaar | new_director_aadhaar | text | — | Yes (Indian) | — | 12 digits |
| 7 | Mobile (Aadhaar-linked) | new_director_mobile | tel | — | Yes | — | 10 digits |
| 8 | Email | new_director_email | email | — | Yes | — | — |
| 9 | Residential address | new_director_address | textarea | — | Yes | — | — |
| 10 | Has existing DIN? | has_din | radio | Yes, No | Yes | — | — |
| 11 | Existing DIN | new_director_din | text | Conditional: has_din = Yes | — | 8 digits | — |
| 12 | Date of board resolution appointing the director | appointment_board_date | date | — | Yes | — | Past date |
| 13 | Date from which director is to be appointed | appointment_effective_date | date | — | Yes | — | On or after board resolution date |
| 14 | Category of director | director_category | select | Executive, Non-Executive, Independent, Nominee, Additional, Alternate | Yes | — | — |

**Step 3: Director Being Removed / Resigned** *(Conditional: change_type includes Resignation)*

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Name of resigning director | resigning_director_name | text | — | Yes | — | — |
| 2 | DIN of resigning director | resigning_director_din | text | — | Yes | 8 digits | — |
| 3 | Date of resignation | resignation_date | date | — | Yes | — | Past date |
| 4 | Has the director submitted a resignation letter? | has_resignation_letter | radio | Yes, No | Yes | DIR-12 filing requires resignation letter | — |
| 5 | Was the resignation accepted by the board? | board_accepted | radio | Yes, No | Yes | — | — |
| 6 | Date of board resolution accepting resignation | acceptance_board_date | date | Conditional: board_accepted = Yes | — | — | — |
| 7 | Is there at least 1 director remaining after this resignation? | min_directors_remaining | radio | Yes, No | Yes | Company must have minimum 2 directors (Pvt Ltd); if No, new director must be appointed simultaneously | — |

**Step 4: Change in Director Details** *(Conditional: change_type includes detail change)*

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | DIN of director whose details are changing | change_director_din | text | — | Yes | 8 digits | — |
| 2 | Type of detail changing | detail_change_type | multiselect | Name, Father's Name, Nationality, Residential Address, Date of Birth, Email, Mobile | Yes | — | — |
| 3 | New value for each changed field | new_detail_values | textarea | — | Yes | Specify each change clearly | — |

---

### DOCUMENTS REQUIRED

**For New Director Appointment:**

| # | Document | Key | Required | Formats | Help Text |
|---|----------|-----|----------|---------|-----------|
| 1 | PAN Card of new director | new_director_pan_doc | Yes | PDF, JPG, PNG | — |
| 2 | Aadhaar Card of new director | new_director_aadhaar_doc | Yes | PDF, JPG, PNG | — |
| 3 | Photograph of new director | new_director_photo | Yes | JPG, PNG | — |
| 4 | Address proof of new director | new_director_address_proof | Yes | PDF, JPG, PNG | Not older than 2 months |
| 5 | Consent to act as director (DIR-2) | dir_2 | Yes | PDF | We prepare; needs new director's signature |
| 6 | Board resolution for appointment | appointment_resolution | Yes | PDF | Signed minutes of board meeting |
| 7 | Declaration by new director (INC-9) | inc_9 | Yes | PDF | We prepare; declaration re: disqualification |
| 8 | DSC of new director | new_director_dsc | Yes | — | Class 3 DSC; we assist procurement if needed |

**For Resignation:**

| # | Document | Key | Required | Formats | Help Text |
|---|----------|-----|----------|---------|-----------|
| 9 | Resignation letter from director | resignation_letter | Yes | PDF | Signed by resigning director; addressed to company |
| 10 | Board resolution accepting resignation | acceptance_resolution | Yes | PDF | — |
| 11 | Notice of cessation (DIR-11) filed by resigning director | dir_11 | Conditional | PDF | Director can file DIR-11 themselves on MCA; not mandatory but recommended |

**For Detail Changes:**

| # | Document | Key | Required | Formats | Help Text |
|---|----------|-----|----------|---------|-----------|
| 12 | Proof of changed detail | change_proof | Yes | PDF, JPG, PNG | New address proof / name change affidavit / gazette notification |
| 13 | DSC of the director | director_dsc | Yes | — | For signing DIR-6 |

---

### WORKFLOW STAGES

| Step | Title | Timeline | Description |
|------|-------|----------|-------------|
| 1 | Document Collection & Verification | Day 0–1 | — |
| 2 | DSC Procurement (if new director) | Day 1–3 | Class 3 DSC for new director without one |
| 3 | DIN Allotment (if new director without DIN) | Day 3–5 | — |
| 4 | Form Preparation (DIR-12 for appointment/resignation; DIR-6 for detail change) | Day 3–5 | — |
| 5 | Digital Signing & MCA Filing | Day 5–7 | Filed within prescribed timeline (30 days from event date for DIR-12; 30 days for DIR-6) |
| 6 | MCA Acknowledgment | Day 7 | SRN received; MCA database updated. |

---

### DELIVERABLES

| Deliverable | Type | When |
|-------------|------|------|
| DIR-12 Filing Acknowledgment (SRN) | Reference Number | On filing |
| DIR-6 Filing Acknowledgment (SRN) | Reference Number | On filing (if detail change) |
| Updated MCA Master Data | Screenshot / PDF | After MCA processes the filing |
| New DIN (if new director without DIN) | Reference Number | During process |

### VALIDITY & RENEWAL
- **One-time service**: Per change event
- **Filing Timeline**: DIR-12 must be filed within 30 days of appointment / cessation; penalties apply for delay
- **DIR-3 KYC**: Every director must complete annual KYC by September 30th (₹5,000 penalty for non-compliance)

---

## SERVICE: Registered Office Address Change
## SLUG: `registered-office-change`

### QUESTIONNAIRE

**Step 1: Company Details & Type of Change**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | CIN of the company | cin | text | — | Yes | — | Valid CIN format |
| 2 | Registered name of company | company_name | text | — | Yes | — | — |
| 3 | Current registered address | current_address | textarea | — | Yes | Full current address as on MCA | — |
| 4 | Current state | current_state | select | [All States] | Yes | — | — |
| 5 | Type of address change | change_scope | select | Within the same city / town / village, Within the same state but different city (same RoC jurisdiction), From one state to another state (different RoC jurisdiction) | Yes | — | Determines forms required and approvals needed |
| 6 | New registered address | new_address | textarea | — | Yes | Full new address | — |
| 7 | New state | new_state | select | [All States] | Conditional: change_scope = From one state to another state | — | — |
| 8 | Nature of new premises | new_premises_type | select | Owned by company, Owned by director / promoter, Rented, Leased, Consent basis | Yes | — | — |

**Step 2: Basis for Change**

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Reason for change of address | change_reason | select | Business expansion, Cost optimization, Operational convenience, Office relocation, Regulatory / compliance reason, Others | Yes | — | — |
| 2 | Date of board resolution approving change | board_resolution_date | date | — | Yes | — | Must be before filing |
| 3 | Was a special resolution required? | special_resolution_required | radio | Yes (inter-state change requires special resolution), No (intra-state change requires ordinary resolution) | Yes | — | Auto-populated based on change_scope |
| 4 | Date of General Meeting / Resolution | gm_date | date | Conditional: special_resolution_required = Yes | — | — | — |
| 5 | MGT-14 filing required? | mgt14_required | radio | Yes, No | Yes | — | Auto-populated based on change_scope |

**Step 3: Inter-State Change — Regional Director Approval** *(Conditional: change_scope = inter-state)*

| # | Question | Key | Type | Options | Required | Placeholder | Validation |
|---|----------|-----|------|---------|----------|-------------|------------|
| 1 | Current RoC jurisdiction | current_roc | text | — | Yes | Auto-populated based on current_state | — |
| 2 | New RoC jurisdiction | new_roc | text | — | Yes | Auto-populated based on new_state | — |
| 3 | Does the company have any pending legal proceedings? | pending_proceedings | radio | Yes, No | Yes | Required disclosure in INC-23 | — |
| 4 | Does the company owe any unpaid taxes or dues? | pending_dues | radio | Yes, No | Yes | Required disclosure | — |
| 5 | Details of pending proceedings / dues | pending_details | textarea | Conditional: pending_proceedings = Yes or pending_dues = Yes | — | — | — |

---

### DOCUMENTS REQUIRED

| # | Document | Key | Required | Formats | Help Text |
|---|----------|-----|----------|---------|-----------|
| 1 | Board resolution for address change | board_resolution | Yes | PDF | Certified true copy of board meeting minutes |
| 2 | Special resolution (EGM minutes) | special_resolution | Conditional: change requires special resolution | PDF | — |
| 3 | MGT-14 (filing of special resolution) | mgt_14 | Conditional: mgt14_required = Yes | — | We file this; signed by director |
| 4 | Proof of new registered office address | new_address_proof | Yes | PDF, JPG, PNG | Electricity bill / property tax receipt at new address — not older than 2 months |
| 5 | NOC from owner of new premises | new_premises_noc | Conditional: new_premises_type ≠ Owned by company | PDF | — |
| 6 | Rent / lease agreement for new premises | rent_agreement | Conditional: new_premises_type = Rented or Leased | PDF | — |
| 7 | DSC of authorized director | director_dsc | Yes | — | For signing INC-22 and other forms |
| 8 | List of creditors and their consent | creditor_list | Conditional: change_scope = inter-state | PDF | For INC-23 — Regional Director may ask for creditor NOC |
| 9 | Advertisement in newspapers | newspaper_ads | Conditional: change_scope = inter-state | PDF | INC-23 requires publication in local newspaper at both old and new address — we coordinate |
| 10 | CA certificate of paid-up capital and reserves | ca_certificate | Conditional: change_scope = inter-state | PDF | — |
| 11 | Altered MOA (after state change) | altered_moa | Conditional: change_scope = inter-state | PDF | We prepare this |

---

### WORKFLOW STAGES

**Intra-City:**

| Step | Title | Timeline | Description |
|------|-------|----------|-------------|
| 1 | Document Collection | Day 0–1 | — |
| 2 | Board Resolution & Form INC-22 Preparation | Day 1–3 | — |
| 3 | Filing INC-22 with RoC | Day 3–5 | Within 15 days of the change |
| 4 | MCA Update | Day 5–7 | — |

**Intra-State (Different City):**

| Step | Title | Timeline | Description |
|------|-------|----------|-------------|
| 1 | Document Collection | Day 0–1 | — |
| 2 | Board / EGM Resolution | Day 1–7 | — |
| 3 | MGT-14 Filing (if required) | Day 7–10 | Within 30 days of resolution |
| 4 | INC-22 Filing | Day 10–15 | — |
| 5 | MCA Update | Day 15–20 | — |

**Inter-State (Different State):**

| Step | Title | Timeline | Description |
|------|-------|----------|-------------|
| 1 | Document Collection | Day 0–3 | Extensive documentation |
| 2 | Special Resolution (EGM) | Day 3–14 | Proper notice period for EGM |
| 3 | MGT-14 Filing | Day 14–20 | Within 30 days of resolution |
| 4 | INC-23 Application to Regional Director | Day 20–30 | Application filed; newspaper advertisements published |
| 5 | Regional Director Processing | Day 30–60 | RD may call for hearing; notice sent to creditors and ROC of new state |
| 6 | RD Order | Day 60–90 | Regional Director issues order confirming change |
| 7 | INC-22 Filing with New RoC | Day 90–97 | Within 30 days of RD order |
| 8 | MOA Amendment & MCA Update | Day 97–105 | Memorandum updated to reflect new state |

---

### DELIVERABLES

| Deliverable | Type | When |
|-------------|------|------|
| INC-22 Filing Acknowledgment (SRN) | Reference Number | On filing |
| MGT-14 Acknowledgment (if applicable) | Reference Number | On filing |
| Regional Director Order (inter-state only) | PDF | On RD approval |
| Updated MCA Master Data (new address) | PDF Screenshot | After processing |
| Amended MOA with new state clause (inter-state only) | PDF Document | On completion |

### VALIDITY & RENEWAL
- **One-time service**: Per address change event
- **Filing Timeline**: INC-22 must be filed within 15 days of shifting the registered office; MGT-14 within 30 days of resolution
- **Post-Change Obligation**: Update address on all other registrations — GST, bank accounts, licenses, MSME, IEC, etc. (advisory included in our service)

---

*Part 1 end. 19 services configured.*

---

# PART 2: DOCUMENT FLOW CONFIGURATIONS

**Purpose**: Defines the complete document exchange lifecycle per service — what the customer uploads initially, what flows back and forth with the CA during work stages, and what the customer receives as final deliverables.

**Stage key convention**: Matches the workflow stage slugs from Part 1. `direction: from_customer` = customer uploads to platform. `direction: to_customer` = CA/platform delivers to customer.

---

```json
[

  {
    "service_slug": "gst-registration",

    "initial_documents": [
      {
        "document_key": "pan_card",
        "document_label": "PAN Card",
        "description": "PAN card of the proprietor / all partners / all directors depending on entity type",
        "is_required": true,
        "tips": [
          "Ensure all four corners are clearly visible",
          "Name on PAN must exactly match the name you entered in the questionnaire",
          "Color scan preferred over black and white"
        ]
      },
      {
        "document_key": "aadhaar_card",
        "document_label": "Aadhaar Card",
        "description": "Aadhaar card of the authorized signatory — front and back",
        "is_required": true,
        "tips": [
          "Must be linked to an active mobile number — our CA will request the Aadhaar OTP via WhatsApp when needed during filing",
          "Upload both front and back in a single file if possible",
          "Masked Aadhaar (last 4 digits visible) is NOT accepted — full number must be visible"
        ]
      },
      {
        "document_key": "premises_proof",
        "document_label": "Business Address Proof",
        "description": "Proof of principal place of business — electricity bill, property tax receipt, rent agreement, or lease deed",
        "is_required": true,
        "tips": [
          "Must not be older than 2 months",
          "Address on document must match the address entered in the questionnaire exactly",
          "For rented premises: submit rent agreement AND electricity bill",
          "For owned premises: electricity bill or property tax receipt is sufficient"
        ]
      },
      {
        "document_key": "signatory_photo",
        "document_label": "Passport Size Photograph",
        "description": "Recent passport-size photograph of the authorized signatory",
        "is_required": true,
        "tips": [
          "Plain white or light background",
          "Face clearly visible, no sunglasses or headwear (except for religious reasons)",
          "Taken within the last 6 months"
        ]
      },
      {
        "document_key": "bank_proof",
        "document_label": "Bank Account Proof",
        "description": "Cancelled cheque with pre-printed name and account number, or first page of bank passbook, or bank statement header",
        "is_required": true,
        "tips": [
          "Account must be in the name of the business or proprietor",
          "IFSC code and account number must be clearly visible",
          "Handwritten account numbers on cheques are not accepted — must be pre-printed"
        ]
      },
      {
        "document_key": "entity_proof",
        "document_label": "Entity Registration Proof",
        "description": "Certificate of Incorporation for companies, Partnership Deed for firms, LLP Agreement for LLPs — not required for Sole Proprietorship",
        "is_required": false,
        "tips": [
          "Not required if you are a sole proprietor",
          "For Pvt Ltd / OPC: upload Certificate of Incorporation",
          "For Partnership: upload the registered or notarized Partnership Deed",
          "For LLP: upload the LLP Agreement and Certificate of Incorporation"
        ]
      },
      {
        "document_key": "noc_owner",
        "document_label": "NOC from Property Owner",
        "description": "Letter from property owner permitting use of address as registered business address — required only if premises is shared or on consent basis",
        "is_required": false,
        "tips": [
          "Only required if premises type selected was 'Shared / Consent'",
          "Must be signed by the actual property owner",
          "Should mention the applicant's name and the address explicitly"
        ]
      }
    ],

    "work_documents": [
      {
        "direction": "to_customer",
        "stage_key": "application_filed",
        "document_key": "gst_application_draft",
        "document_label": "GST Application Draft (REG-01)",
        "description": "Review your complete GST application before it is submitted to the portal. Verify all details — business name, address, HSN/SAC codes, authorized signatory details — before approving."
      },
      {
        "direction": "from_customer",
        "stage_key": "officer_query_handled",
        "document_key": "additional_address_proof",
        "document_label": "Additional Address Proof (if queried)",
        "description": "If the GST officer raises a query (REG-03) requesting additional proof of business address, upload the requested document here. Common requests include utility bills, NOC from landlord, or property ownership documents."
      },
      {
        "direction": "from_customer",
        "stage_key": "officer_query_handled",
        "document_key": "additional_entity_proof",
        "document_label": "Additional Entity Proof (if queried)",
        "description": "If the officer queries the nature of the entity or asks for additional registration documents, upload here. Could include MOA/AOA, partnership deed, trust deed, etc."
      },
      {
        "direction": "to_customer",
        "stage_key": "gstin_issued",
        "document_key": "gst_certificate",
        "document_label": "GST Registration Certificate (REG-06)",
        "description": "Your official GST registration certificate issued by the GST portal. Contains your GSTIN, business details, and list of goods/services. Must be displayed at your place of business."
      },
      {
        "direction": "to_customer",
        "stage_key": "gstin_issued",
        "document_key": "gstin_summary",
        "document_label": "GSTIN Summary Sheet",
        "description": "Summary document prepared by our CA containing your GSTIN, compliance due dates, and first steps to start filing GST returns."
      }
    ],

    "final_deliverables": [
      {
        "document_key": "gst_certificate",
        "document_label": "GST Registration Certificate (REG-06)",
        "description": "Official government certificate with 15-digit GSTIN, valid permanently unless cancelled"
      },
      {
        "document_key": "gstin_summary",
        "document_label": "GSTIN & Compliance Summary",
        "description": "Your GSTIN, return filing schedule, and first compliance steps"
      }
    ]
  },

  {
    "service_slug": "pvt-ltd-company",

    "initial_documents": [
      {
        "document_key": "director_pan_cards",
        "document_label": "PAN Cards of All Directors",
        "description": "PAN card of each director — upload as separate files labeled by director name",
        "is_required": true,
        "tips": [
          "Upload one file per director — label each file with the director's name",
          "Name on PAN must exactly match Aadhaar",
          "Foreign directors: upload passport instead"
        ]
      },
      {
        "document_key": "director_aadhaar_cards",
        "document_label": "Aadhaar Cards of All Directors",
        "description": "Aadhaar card (front and back) of each Indian director",
        "is_required": true,
        "tips": [
          "Both sides in a single file per director",
          "Must be linked to an active mobile number for OTP-based e-signing",
          "Not required for foreign directors — passport replaces this"
        ]
      },
      {
        "document_key": "director_photos",
        "document_label": "Passport Size Photographs of All Directors",
        "description": "Recent passport-size photograph of each director",
        "is_required": true,
        "tips": [
          "Plain white background",
          "One file per director — label by name",
          "Taken within the last 6 months"
        ]
      },
      {
        "document_key": "director_address_proofs",
        "document_label": "Residential Address Proofs of All Directors",
        "description": "Current residential address proof for each director — utility bill, bank statement, or rental agreement",
        "is_required": true,
        "tips": [
          "Must not be older than 2 months",
          "Address must match what was entered in the questionnaire",
          "Upload one file per director — label by name",
          "Acceptable: electricity bill, water bill, telephone bill, bank statement, lease agreement"
        ]
      },
      {
        "document_key": "director_signatures",
        "document_label": "Specimen Signatures of All Directors",
        "description": "Handwritten signature of each director on plain white paper — scanned or photographed clearly",
        "is_required": true,
        "tips": [
          "Sign on plain white A4 paper",
          "No background designs or lines",
          "Signature must match how it appears on PAN card",
          "Upload one file per director"
        ]
      },
      {
        "document_key": "office_address_proof",
        "document_label": "Registered Office Address Proof",
        "description": "Electricity bill or property tax receipt for the proposed registered office address",
        "is_required": true,
        "tips": [
          "Must not be older than 2 months",
          "For director-owned premises: electricity bill sufficient",
          "For rented premises: also upload rent agreement and NOC from owner"
        ]
      },
      {
        "document_key": "office_noc",
        "document_label": "NOC from Office Premises Owner",
        "description": "Letter from property owner allowing use of address as registered office — required if premises is not owned by a director",
        "is_required": false,
        "tips": [
          "Must be signed by the property owner",
          "Should specifically permit use as a registered office",
          "Not required if the office is owned by one of the directors"
        ]
      }
    ],

    "work_documents": [
      {
        "direction": "to_customer",
        "stage_key": "dsc_applied",
        "document_key": "dsc_application_form",
        "document_label": "DSC Application Form",
        "description": "Digital Signature Certificate application form for each director who needs a new DSC. Download, complete, sign, and return for DSC procurement."
      },
      {
        "direction": "from_customer",
        "stage_key": "dsc_applied",
        "document_key": "signed_dsc_form",
        "document_label": "Signed DSC Application Form",
        "description": "Upload the signed DSC application form for each director. Required to issue Class 3 DSC."
      },
      {
        "direction": "to_customer",
        "stage_key": "name_approval",
        "document_key": "name_approval_application",
        "document_label": "Name Reservation Application (RUN/SPICe+ Part A)",
        "description": "Review the two proposed company names and rationale before submission to MCA. Confirm names are acceptable before we file."
      },
      {
        "direction": "from_customer",
        "stage_key": "name_approval",
        "document_key": "name_approval_confirmation",
        "document_label": "Name Confirmation",
        "description": "Confirm your approval of the proposed names and rationale as drafted. Required before we file the name reservation."
      },
      {
        "direction": "to_customer",
        "stage_key": "name_approval",
        "document_key": "name_approval_letter",
        "document_label": "MCA Name Approval Letter",
        "description": "MCA's official name approval or RUN approval confirmation. Valid for 20 days — SPICe+ must be filed within this window."
      },
      {
        "direction": "to_customer",
        "stage_key": "spice_filed",
        "document_key": "moa_draft",
        "document_label": "Draft Memorandum of Association (MOA)",
        "description": "Review the draft MOA — particularly the Main Objects Clause — before digital signing. This defines what your company is authorized to do."
      },
      {
        "direction": "to_customer",
        "stage_key": "spice_filed",
        "document_key": "aoa_draft",
        "document_label": "Draft Articles of Association (AOA)",
        "description": "Review the draft AOA — the internal governance rules for your company — before digital signing."
      },
      {
        "direction": "from_customer",
        "stage_key": "spice_filed",
        "document_key": "inc9_declaration",
        "document_label": "INC-9 Declaration (Signed)",
        "description": "Declaration by each proposed director confirming they are not disqualified. We prepare this — directors must sign and return."
      },
      {
        "direction": "from_customer",
        "stage_key": "spice_filed",
        "document_key": "dir2_consent",
        "document_label": "DIR-2 Consent to Act as Director (Signed)",
        "description": "Consent form signed by each director agreeing to act in that capacity. We prepare this — directors must sign and return."
      },
      {
        "direction": "to_customer",
        "stage_key": "incorporation_certificate",
        "document_key": "certificate_of_incorporation",
        "document_label": "Certificate of Incorporation (CoI)",
        "description": "Official MCA certificate confirming your company is incorporated. Contains CIN, date of incorporation, PAN, and TAN."
      },
      {
        "direction": "to_customer",
        "stage_key": "incorporation_certificate",
        "document_key": "moa_final",
        "document_label": "Certified Memorandum of Association",
        "description": "Final certified MOA as filed with the Registrar of Companies."
      },
      {
        "direction": "to_customer",
        "stage_key": "incorporation_certificate",
        "document_key": "aoa_final",
        "document_label": "Certified Articles of Association",
        "description": "Final certified AOA as filed with the Registrar of Companies."
      },
      {
        "direction": "to_customer",
        "stage_key": "incorporation_certificate",
        "document_key": "company_pan",
        "document_label": "Company PAN Card",
        "description": "PAN issued to the company by Income Tax Department — generated automatically with CoI via SPICe+."
      },
      {
        "direction": "to_customer",
        "stage_key": "incorporation_certificate",
        "document_key": "company_tan",
        "document_label": "Company TAN",
        "description": "Tax Deduction Account Number — required for TDS deduction and filing. Generated automatically with CoI via SPICe+."
      }
    ],

    "final_deliverables": [
      {
        "document_key": "certificate_of_incorporation",
        "document_label": "Certificate of Incorporation (CoI)",
        "description": "Official MCA certificate with CIN — the company's birth certificate"
      },
      {
        "document_key": "moa_final",
        "document_label": "Memorandum of Association (MOA)",
        "description": "Certified copy as registered with RoC"
      },
      {
        "document_key": "aoa_final",
        "document_label": "Articles of Association (AOA)",
        "description": "Certified copy as registered with RoC"
      },
      {
        "document_key": "company_pan",
        "document_label": "Company PAN Card",
        "description": "PAN allotted to the company"
      },
      {
        "document_key": "company_tan",
        "document_label": "Company TAN",
        "description": "TAN allotted to the company"
      },
      {
        "document_key": "din_letters",
        "document_label": "DIN Allotment Letters",
        "description": "DIN allotment confirmations for each director who received a new DIN during the process"
      }
    ]
  },

  {
    "service_slug": "llp-registration",

    "initial_documents": [
      {
        "document_key": "partner_pan_cards",
        "document_label": "PAN Cards of All Designated Partners",
        "description": "PAN card of each designated partner — upload as separate files labeled by partner name",
        "is_required": true,
        "tips": [
          "One file per partner — label each by name",
          "Name on PAN must match Aadhaar exactly",
          "Foreign partners: upload passport instead"
        ]
      },
      {
        "document_key": "partner_aadhaar_cards",
        "document_label": "Aadhaar Cards of All Designated Partners",
        "description": "Aadhaar card (front and back) of each Indian designated partner",
        "is_required": true,
        "tips": [
          "Both sides per partner in a single file",
          "Must be linked to active mobile number for e-signing",
          "Not required for foreign partners"
        ]
      },
      {
        "document_key": "partner_photos",
        "document_label": "Passport Size Photographs of All Partners",
        "description": "Recent passport-size photograph of each designated partner",
        "is_required": true,
        "tips": [
          "Plain white background",
          "One file per partner, labeled by name",
          "Taken within the last 6 months"
        ]
      },
      {
        "document_key": "partner_address_proofs",
        "document_label": "Residential Address Proofs of All Partners",
        "description": "Current residential address proof for each designated partner",
        "is_required": true,
        "tips": [
          "Not older than 2 months",
          "Must match the address entered in questionnaire",
          "Acceptable: electricity bill, bank statement, telephone bill, rental agreement"
        ]
      },
      {
        "document_key": "partner_signatures",
        "document_label": "Specimen Signatures of All Partners",
        "description": "Handwritten specimen signature of each designated partner on plain white paper",
        "is_required": true,
        "tips": [
          "Sign on plain white A4 paper",
          "No lines or background designs",
          "One file per partner"
        ]
      },
      {
        "document_key": "office_address_proof",
        "document_label": "Registered Office Address Proof",
        "description": "Electricity bill or utility bill for the proposed registered office of the LLP",
        "is_required": true,
        "tips": [
          "Must not be older than 2 months",
          "If rented, also upload rent agreement and NOC from property owner"
        ]
      },
      {
        "document_key": "office_noc",
        "document_label": "NOC from Office Premises Owner",
        "description": "Written permission from the property owner allowing use of the address as registered office of the LLP",
        "is_required": false,
        "tips": [
          "Required if the office is not owned by a partner",
          "Must explicitly mention permission to use as registered office"
        ]
      }
    ],

    "work_documents": [
      {
        "direction": "to_customer",
        "stage_key": "dpin_applied",
        "document_key": "dsc_application_form",
        "document_label": "DSC Application Form for Partners",
        "description": "Digital Signature Certificate application form for each partner who needs a new DSC. Download, complete, sign, and return."
      },
      {
        "direction": "from_customer",
        "stage_key": "dpin_applied",
        "document_key": "signed_dsc_form",
        "document_label": "Signed DSC Application Form",
        "description": "Upload the signed DSC application form per partner. Required for Class 3 DSC issuance and DPIN application."
      },
      {
        "direction": "to_customer",
        "stage_key": "name_approval",
        "document_key": "run_llp_draft",
        "document_label": "LLP Name Reservation Application (RUN-LLP)",
        "description": "Review the two proposed LLP names before submission to MCA. Confirm the names before we file."
      },
      {
        "direction": "from_customer",
        "stage_key": "name_approval",
        "document_key": "name_confirmation",
        "document_label": "Name Confirmation",
        "description": "Confirm approval of the proposed LLP names. Required before we file RUN-LLP on MCA."
      },
      {
        "direction": "to_customer",
        "stage_key": "name_approval",
        "document_key": "name_approval_letter",
        "document_label": "MCA LLP Name Approval Letter",
        "description": "Official MCA name approval confirmation for the LLP. Valid for 3 months — FiLLiP must be filed within this window."
      },
      {
        "direction": "to_customer",
        "stage_key": "fillip_filed",
        "document_key": "fillip_draft",
        "document_label": "FiLLiP Form Draft",
        "description": "Review the complete FiLLiP incorporation form before digital signing. Verify all partner details, capital contributions, and office address."
      },
      {
        "direction": "from_customer",
        "stage_key": "fillip_filed",
        "document_key": "partner_consent_signed",
        "document_label": "Partner Consent Forms (Signed)",
        "description": "Consent of each designated partner to act in that capacity. We prepare these — each partner must sign and return."
      },
      {
        "direction": "to_customer",
        "stage_key": "incorporation_certificate",
        "document_key": "llp_certificate_of_incorporation",
        "document_label": "LLP Certificate of Incorporation",
        "description": "Official MCA certificate confirming the LLP is incorporated. Contains LLPIN, date of incorporation, PAN, and TAN."
      },
      {
        "direction": "to_customer",
        "stage_key": "incorporation_certificate",
        "document_key": "llp_agreement_draft",
        "document_label": "Draft LLP Agreement",
        "description": "Draft LLP Agreement defining rights, duties, profit sharing, and capital contributions of partners. Must be reviewed and approved by all partners before filing (Form 3, within 30 days of incorporation)."
      },
      {
        "direction": "from_customer",
        "stage_key": "incorporation_certificate",
        "document_key": "llp_agreement_signed",
        "document_label": "Signed LLP Agreement",
        "description": "LLP Agreement signed by all designated partners on stamp paper of appropriate value. Required for Form 3 filing with MCA within 30 days of incorporation."
      },
      {
        "direction": "to_customer",
        "stage_key": "incorporation_certificate",
        "document_key": "llp_pan",
        "document_label": "LLP PAN Card",
        "description": "PAN issued to the LLP — auto-generated with CoI via FiLLiP."
      },
      {
        "direction": "to_customer",
        "stage_key": "incorporation_certificate",
        "document_key": "llp_tan",
        "document_label": "LLP TAN",
        "description": "TAN allotted to the LLP — auto-generated with CoI via FiLLiP."
      }
    ],

    "final_deliverables": [
      {
        "document_key": "llp_certificate_of_incorporation",
        "document_label": "LLP Certificate of Incorporation",
        "description": "Official MCA certificate with LLPIN"
      },
      {
        "document_key": "llp_agreement_signed",
        "document_label": "Executed LLP Agreement",
        "description": "Signed and filed LLP Agreement"
      },
      {
        "document_key": "llp_pan",
        "document_label": "LLP PAN Card",
        "description": "PAN allotted to the LLP"
      },
      {
        "document_key": "llp_tan",
        "document_label": "LLP TAN",
        "description": "TAN allotted to the LLP"
      },
      {
        "document_key": "dpin_letters",
        "document_label": "DPIN Allotment Letters",
        "description": "DPIN confirmations for each partner who received a new DPIN"
      }
    ]
  },

  {
    "service_slug": "trademark-registration",

    "initial_documents": [
      {
        "document_key": "logo_file",
        "document_label": "Logo / Device Artwork",
        "description": "High-resolution logo or device mark artwork — required only for Logo or Composite marks",
        "is_required": false,
        "tips": [
          "Minimum 300 DPI resolution",
          "Preferred format: PNG with transparent background or JPG",
          "If no colour claim: submit in black and white",
          "Size: 8cm x 8cm as required by IP India",
          "Not required if you are filing a Word Mark only"
        ]
      },
      {
        "document_key": "applicant_id_proof",
        "document_label": "ID Proof of Applicant",
        "description": "PAN card and Aadhaar for individual applicants. Certificate of Incorporation for companies/LLPs.",
        "is_required": true,
        "tips": [
          "Individual / Proprietor: upload PAN + Aadhaar",
          "Company / LLP / Partnership: upload Certificate of Incorporation or Registration Certificate",
          "Ensure the applicant name matches exactly with the trademark application"
        ]
      },
      {
        "document_key": "msme_startup_cert",
        "document_label": "MSME / Startup Certificate",
        "description": "Udyam Registration Certificate or DPIIT Startup Recognition Certificate — required to avail 50% fee concession",
        "is_required": false,
        "tips": [
          "Only required if you are claiming the MSME or Startup fee concession",
          "Without this, full government fee applies (₹9,000/class vs ₹4,500/class)",
          "Must be in the name of the trademark applicant"
        ]
      },
      {
        "document_key": "use_evidence",
        "document_label": "Evidence of Prior Use",
        "description": "Documents proving prior commercial use of the mark — required only if claiming 'Mark already in use'",
        "is_required": false,
        "tips": [
          "Only required if you selected 'Already in Use' in the questionnaire",
          "Acceptable: sales invoices with mark, product packaging, advertisements, website screenshots dated appropriately",
          "Earlier the date of use, stronger the claim — submit oldest available evidence",
          "If not available, we will file as 'Proposed to be Used' instead"
        ]
      },
      {
        "document_key": "priority_document",
        "document_label": "Priority / Convention Document",
        "description": "Certified copy of foreign trademark application — required only for convention applications",
        "is_required": false,
        "tips": [
          "Only required if you are claiming priority from a foreign trademark application",
          "Must be certified by the foreign trademark office",
          "Foreign language documents must be accompanied by a certified English translation"
        ]
      }
    ],

    "work_documents": [
      {
        "direction": "to_customer",
        "stage_key": "tm_application_filed",
        "document_key": "trademark_search_report",
        "document_label": "Trademark Search Report",
        "description": "Pre-filing search report across your selected classes on the IP India database. Review this carefully — it shows existing marks that may conflict with yours. We will advise on whether to proceed, modify, or reconsider."
      },
      {
        "direction": "from_customer",
        "stage_key": "tm_application_filed",
        "document_key": "poa_signed",
        "document_label": "Power of Attorney (Form TM-M-48) — Signed",
        "description": "Power of Attorney authorizing us to file and prosecute the trademark application on your behalf. We prepare this — download, sign (not notarized at this stage), and upload."
      },
      {
        "direction": "to_customer",
        "stage_key": "tm_application_filed",
        "document_key": "tm_filing_acknowledgment",
        "document_label": "Trademark Filing Acknowledgment",
        "description": "Official IP India acknowledgment confirming your trademark application has been filed, with application number and filing date. You may use the TM™ symbol from this date."
      },
      {
        "direction": "to_customer",
        "stage_key": "examination_report",
        "document_key": "examination_report",
        "document_label": "Examination Report (if raised)",
        "description": "Official objection report from the Trademark Examiner citing reasons for objection — usually citing prior similar marks or non-distinctiveness. We will prepare a detailed response."
      },
      {
        "direction": "to_customer",
        "stage_key": "examination_report",
        "document_key": "examination_response_draft",
        "document_label": "Draft Response to Examination Report",
        "description": "Our drafted response to the Examiner's objections — includes legal arguments, evidence of distinctiveness, and differentiation from cited marks. Review and approve before we file."
      },
      {
        "direction": "from_customer",
        "stage_key": "examination_report",
        "document_key": "additional_use_evidence",
        "document_label": "Additional Use Evidence (for examination response)",
        "description": "If the examiner challenges distinctiveness or use, additional evidence of prior use strengthens the response. Upload invoices, advertisements, media coverage, or packaging showing the mark in commercial use."
      },
      {
        "direction": "from_customer",
        "stage_key": "examination_report",
        "document_key": "user_affidavit_signed",
        "document_label": "User Affidavit (Form TM-M-150) — Notarized",
        "description": "Sworn affidavit declaring prior use of the mark. We prepare this — you must sign before a Notary Public and upload the notarized copy."
      },
      {
        "direction": "to_customer",
        "stage_key": "tm_published",
        "document_key": "tm_journal_publication",
        "document_label": "Trademark Journal Publication Notice",
        "description": "Confirmation that your mark has been published in the Official Gazette (Trademark Journal). The 4-month opposition window begins from this date. No action required from you unless an opposition is filed."
      },
      {
        "direction": "to_customer",
        "stage_key": "tm_registered",
        "document_key": "tm_registration_certificate",
        "document_label": "Trademark Registration Certificate",
        "description": "Official trademark registration certificate from IP India. You are now entitled to use the ® symbol for goods/services in the registered classes."
      }
    ],

    "final_deliverables": [
      {
        "document_key": "tm_filing_acknowledgment",
        "document_label": "Trademark Filing Acknowledgment",
        "description": "Filing confirmation with application number — from this date you may use TM™"
      },
      {
        "document_key": "trademark_search_report",
        "document_label": "Trademark Search Report",
        "description": "Pre-filing conflict search across selected classes"
      },
      {
        "document_key": "tm_registration_certificate",
        "document_label": "Trademark Registration Certificate",
        "description": "Official certificate entitling use of ® — issued approximately 12–18 months after filing"
      }
    ]
  },

  {
    "service_slug": "fssai-basic",

    "initial_documents": [
      {
        "document_key": "id_proof",
        "document_label": "Photo ID Proof",
        "description": "Aadhaar card, PAN card, Voter ID, or Passport of the proprietor / responsible person",
        "is_required": true,
        "tips": [
          "Aadhaar preferred — it has address embedded which speeds up verification",
          "All four corners must be visible",
          "Should be self-attested"
        ]
      },
      {
        "document_key": "premises_proof",
        "document_label": "Business Premises Proof",
        "description": "Electricity bill, rent agreement, or NOC from landlord for the food business premises",
        "is_required": true,
        "tips": [
          "Must not be older than 2 months",
          "For mobile vendors / hawkers: self-declaration of business location is acceptable",
          "Address must match what was entered in the questionnaire"
        ]
      },
      {
        "document_key": "applicant_photo",
        "document_label": "Passport Size Photograph",
        "description": "Recent passport-size photograph of the applicant / proprietor",
        "is_required": true,
        "tips": [
          "Plain white or light background",
          "Taken within the last 6 months"
        ]
      },
      {
        "document_key": "food_list",
        "document_label": "List of Food Products",
        "description": "Written list of all food products you manufacture, handle, or sell",
        "is_required": true,
        "tips": [
          "Be as specific as possible — e.g., 'Homemade mango pickle', 'Besan namkeen', not just 'food products'",
          "Include all categories — do not miss out products you sell occasionally",
          "A simple typed or handwritten list on letterhead is acceptable"
        ]
      }
    ],

    "work_documents": [
      {
        "direction": "to_customer",
        "stage_key": "application_filed",
        "document_key": "form_a_draft",
        "document_label": "Form A Draft (FSSAI Basic Registration Application)",
        "description": "Review your FSSAI Basic Registration application (Form A) before submission to the FoSCoS portal. Verify name, address, food categories, and product list."
      },
      {
        "direction": "to_customer",
        "stage_key": "license_issued",
        "document_key": "fssai_registration_certificate",
        "document_label": "FSSAI Basic Registration Certificate",
        "description": "Official FSSAI Basic Registration Certificate with 14-digit registration number. Valid for the period selected (1–5 years)."
      }
    ],

    "final_deliverables": [
      {
        "document_key": "fssai_registration_certificate",
        "document_label": "FSSAI Basic Registration Certificate",
        "description": "Official certificate with 14-digit FSSAI registration number — must be displayed at premises and on packaging"
      }
    ]
  },

  {
    "service_slug": "fssai-state",

    "initial_documents": [
      {
        "document_key": "id_proof",
        "document_label": "ID Proof of Applicant / Authorized Signatory",
        "description": "PAN card and Aadhaar of the proprietor / director / authorized signatory",
        "is_required": true,
        "tips": [
          "Both PAN and Aadhaar preferred for State license",
          "For companies: upload director's PAN + Aadhaar"
        ]
      },
      {
        "document_key": "entity_proof",
        "document_label": "Entity Registration Proof",
        "description": "Certificate of Incorporation, Partnership Deed, or Registration Certificate depending on entity type",
        "is_required": false,
        "tips": [
          "Not required for sole proprietors",
          "For Pvt Ltd / LLP: Certificate of Incorporation",
          "For Partnership: registered Partnership Deed"
        ]
      },
      {
        "document_key": "premises_proof",
        "document_label": "Food Premises Proof",
        "description": "Electricity bill or rent agreement for the food manufacturing / handling / restaurant premises",
        "is_required": true,
        "tips": [
          "Must not be older than 3 months",
          "Must match the address of the food business in the application"
        ]
      },
      {
        "document_key": "premises_blueprint",
        "document_label": "Layout / Blueprint of Premises",
        "description": "Floor plan or rough sketch of the food premises showing entry/exit, food preparation area, storage area, and utilities",
        "is_required": true,
        "tips": [
          "A rough hand-drawn sketch is acceptable for smaller businesses (restaurants, catering)",
          "Manufacturers: formal layout with measurements preferred",
          "Should clearly mark the food handling zone, storage, and wash areas"
        ]
      },
      {
        "document_key": "food_list",
        "document_label": "List of Food Products",
        "description": "Detailed list of all food products manufactured, stored, sold, or handled at the premises",
        "is_required": true,
        "tips": [
          "Group by FSSAI food categories",
          "Include estimated production volume if manufacturer",
          "Be comprehensive — adding new products later requires license amendment"
        ]
      },
      {
        "document_key": "gst_certificate",
        "document_label": "GST Registration Certificate",
        "description": "GSTIN certificate in the name of the food business",
        "is_required": true,
        "tips": [
          "Business name on GST certificate must match the FSSAI application",
          "If GST registration is pending, provide acknowledgment"
        ]
      },
      {
        "document_key": "fsms_plan",
        "document_label": "Food Safety Management Plan",
        "description": "Basic food safety plan covering hygiene practices, pest control, waste disposal, and food safety procedures",
        "is_required": true,
        "tips": [
          "We provide a standard template — you can use it as-is or adapt it",
          "Should be specific to your food business type",
          "Inspectors check this during premises visit"
        ]
      },
      {
        "document_key": "water_test_report",
        "document_label": "Water Testing Report",
        "description": "Water quality test report from a NABL-accredited lab — required only if using borewell or groundwater",
        "is_required": false,
        "tips": [
          "Required only if water source is borewell or groundwater",
          "Must not be older than 6 months",
          "Municipal water supply: not required",
          "Lab must be NABL-accredited"
        ]
      },
      {
        "document_key": "premises_photos",
        "document_label": "Photographs of Food Premises",
        "description": "Clear photographs of the food preparation area, storage area, equipment, and exterior of premises",
        "is_required": true,
        "tips": [
          "Minimum 4–6 photographs covering inside and outside",
          "Should show cleanliness and organization of the food area",
          "Equipment and storage clearly visible"
        ]
      }
    ],

    "work_documents": [
      {
        "direction": "to_customer",
        "stage_key": "application_filed",
        "document_key": "form_b_draft",
        "document_label": "Form B Draft (FSSAI State License Application)",
        "description": "Review your FSSAI State License application (Form B) before portal submission. Verify all food categories, business details, and premises information."
      },
      {
        "direction": "from_customer",
        "stage_key": "inspection_scheduled",
        "document_key": "inspection_readiness_confirmation",
        "document_label": "Inspection Readiness Confirmation",
        "description": "Confirm that your premises is ready for the FSSAI inspector's visit. We will brief you on what to have ready — the inspector checks premises hygiene, equipment, storage, and your FSMS records."
      },
      {
        "direction": "from_customer",
        "stage_key": "inspection_scheduled",
        "document_key": "inspection_query_response",
        "document_label": "Inspection Query / Deficiency Response",
        "description": "If the inspector raises deficiencies or requests additional information post-visit, upload the compliance documents here. Common: pest control records, medical fitness certificates, updated FSMS documents."
      },
      {
        "direction": "to_customer",
        "stage_key": "license_issued",
        "document_key": "fssai_state_license",
        "document_label": "FSSAI State License Certificate",
        "description": "Official FSSAI State License with 14-digit license number. Must be displayed prominently at the premises."
      }
    ],

    "final_deliverables": [
      {
        "document_key": "fssai_state_license",
        "document_label": "FSSAI State License Certificate",
        "description": "Official State License with 14-digit number — must be displayed at premises"
      }
    ]
  },

  {
    "service_slug": "fssai-central",

    "initial_documents": [
      {
        "document_key": "pan_card",
        "document_label": "PAN Card of Entity",
        "description": "PAN of the company / LLP / firm",
        "is_required": true,
        "tips": [
          "Entity PAN, not individual director's PAN",
          "Must match the legal name in the application"
        ]
      },
      {
        "document_key": "entity_proof",
        "document_label": "Certificate of Incorporation / Registration",
        "description": "CoI for companies and LLPs, Partnership Deed for firms",
        "is_required": true,
        "tips": [
          "Must show the legal entity name clearly",
          "For companies: also upload MOA and AOA"
        ]
      },
      {
        "document_key": "signatory_id",
        "document_label": "ID Proof of Authorized Signatory",
        "description": "PAN and Aadhaar of the director / MD / designated partner who will sign the application",
        "is_required": true,
        "tips": [
          "The signatory must be authorized via board resolution or LLP resolution"
        ]
      },
      {
        "document_key": "address_proof",
        "document_label": "Registered Office Address Proof",
        "description": "Electricity bill or utility bill for the entity's registered office",
        "is_required": true,
        "tips": [
          "Not older than 2 months",
          "Address must match the registration documents"
        ]
      },
      {
        "document_key": "unit_blueprints",
        "document_label": "Blueprints / Layout Plans of All Manufacturing Units",
        "description": "Scale drawings of each manufacturing or processing unit showing food handling zones, storage, cold storage, dispatch, and utilities",
        "is_required": true,
        "tips": [
          "One blueprint per unit",
          "Must show all food contact zones clearly",
          "For large units: formal architectural drawings preferred",
          "Label all areas: receiving, processing, packaging, storage, dispatch"
        ]
      },
      {
        "document_key": "food_list",
        "document_label": "Detailed List of Food Products with FSSAI Categories",
        "description": "Comprehensive product list mapped to FSSAI food category codes",
        "is_required": true,
        "tips": [
          "Must align with FSSAI Schedule 1 food categories",
          "Include all variants and sub-categories",
          "Adding products not on this list later requires license amendment"
        ]
      },
      {
        "document_key": "equipment_list",
        "document_label": "Equipment List with Installed Capacities",
        "description": "List of all processing, manufacturing, and packaging equipment with make, model, and installed capacity",
        "is_required": true,
        "tips": [
          "Include equipment at each unit separately",
          "Installed capacity determines production capacity declaration in the application"
        ]
      },
      {
        "document_key": "water_test_reports",
        "document_label": "Water Testing Reports for All Units",
        "description": "NABL-accredited lab water quality reports for all manufacturing units",
        "is_required": true,
        "tips": [
          "One report per unit",
          "Must not be older than 6 months",
          "Municipal supply: still recommended for Central license",
          "Borewell / groundwater: mandatory"
        ]
      },
      {
        "document_key": "medical_certs",
        "document_label": "Medical Fitness Certificates of Food Handlers",
        "description": "Medical fitness certificates from a registered medical practitioner for all food handling staff",
        "is_required": true,
        "tips": [
          "One per food handler",
          "Must certify fitness to handle food — no communicable diseases",
          "Valid for 1 year — must be renewed annually"
        ]
      },
      {
        "document_key": "fsms_plan",
        "document_label": "FSMS / HACCP Plan",
        "description": "Detailed Food Safety Management System plan including HACCP analysis, critical control points, recall procedure, and hygiene SOPs",
        "is_required": true,
        "tips": [
          "Central license requires a comprehensive FSMS — not just a basic plan",
          "Should cover all units",
          "We provide a detailed template to get you started",
          "If you have ISO 22000 / HACCP certification, submit that instead"
        ]
      },
      {
        "document_key": "premises_photos",
        "document_label": "Photographs of All Premises",
        "description": "Comprehensive photographs of each manufacturing unit — exterior, processing area, storage, cold rooms, packaging line, dispatch, washrooms",
        "is_required": true,
        "tips": [
          "Minimum 8–10 photos per unit",
          "Should demonstrate food safety standards",
          "Inspector will cross-verify photos with actual premises"
        ]
      },
      {
        "document_key": "gst_certificate",
        "document_label": "GST Registration Certificate",
        "description": "GSTIN certificate of the entity",
        "is_required": true,
        "tips": [
          "If multi-state, upload the principal GSTIN certificate"
        ]
      },
      {
        "document_key": "iec_certificate",
        "document_label": "IEC Certificate",
        "description": "Import Export Code certificate — required only if the business imports food products",
        "is_required": false,
        "tips": [
          "Required only for food importers",
          "Must be in the name of the applying entity"
        ]
      }
    ],

    "work_documents": [
      {
        "direction": "to_customer",
        "stage_key": "application_filed",
        "document_key": "form_b_central_draft",
        "document_label": "Form B Draft (FSSAI Central License Application)",
        "description": "Review the complete Form B Central application before portal submission. Carefully verify all units, food categories, production capacities, and signatory details."
      },
      {
        "direction": "from_customer",
        "stage_key": "inspection_scheduled",
        "document_key": "inspection_confirmation",
        "document_label": "Inspection Readiness Confirmation",
        "description": "Confirm each unit is ready for FSSAI Central inspector's visit. Inspector will physically verify premises, equipment, FSMS records, and staff certifications. We will brief you unit-by-unit."
      },
      {
        "direction": "from_customer",
        "stage_key": "inspection_scheduled",
        "document_key": "inspection_deficiency_response",
        "document_label": "Inspection Deficiency Response Documents",
        "description": "If the inspector raises deficiencies post-inspection, upload rectification proof here. Central inspections are thorough — common deficiencies include FSMS gaps, equipment compliance issues, and staff certification lapses."
      },
      {
        "direction": "to_customer",
        "stage_key": "license_issued",
        "document_key": "fssai_central_license",
        "document_label": "FSSAI Central License Certificate",
        "description": "Official FSSAI Central License with 14-digit license number covering all registered units and food categories."
      }
    ],

    "final_deliverables": [
      {
        "document_key": "fssai_central_license",
        "document_label": "FSSAI Central License Certificate",
        "description": "Official Central License with 14-digit number, covering all units and food categories"
      }
    ]
  },

  {
    "service_slug": "shop-establishment",

    "initial_documents": [
      {
        "document_key": "pan_card",
        "document_label": "PAN Card of Proprietor / Employer",
        "description": "PAN card of the individual proprietor or the authorized person applying for the certificate",
        "is_required": true,
        "tips": [
          "For companies/LLPs: upload company PAN as well as director's PAN",
          "Name must match the application exactly"
        ]
      },
      {
        "document_key": "aadhaar_card",
        "document_label": "Aadhaar Card of Proprietor / Employer",
        "description": "Aadhaar card of the proprietor or authorized employer",
        "is_required": true,
        "tips": [
          "Both front and back in a single file",
          "Address on Aadhaar may differ from business address — that is acceptable"
        ]
      },
      {
        "document_key": "premises_proof",
        "document_label": "Proof of Business Premises",
        "description": "Rent agreement, lease deed, or electricity bill for the establishment's address",
        "is_required": true,
        "tips": [
          "Address must match the establishment address entered in questionnaire",
          "Electricity bill must not be older than 2 months",
          "For rented premises: rent agreement preferred"
        ]
      },
      {
        "document_key": "premises_photo",
        "document_label": "Photograph of Establishment Exterior",
        "description": "Photograph showing the exterior of the establishment with signboard / name board clearly visible",
        "is_required": true,
        "tips": [
          "Signboard with establishment name must be clearly readable",
          "Required by Delhi, Maharashtra, and most other states",
          "Daytime photograph preferred"
        ]
      },
      {
        "document_key": "employer_photo",
        "document_label": "Passport Size Photograph of Proprietor / Employer",
        "description": "Recent passport-size photograph of the applicant / proprietor",
        "is_required": true,
        "tips": [
          "Plain white background",
          "Taken within the last 6 months"
        ]
      },
      {
        "document_key": "entity_proof",
        "document_label": "Entity Registration Proof",
        "description": "Certificate of Incorporation, Partnership Deed, or Registration Certificate — only for companies, LLPs, or firms",
        "is_required": false,
        "tips": [
          "Not required for individual proprietors",
          "For companies: Certificate of Incorporation",
          "For partnerships: registered Partnership Deed"
        ]
      }
    ],

    "work_documents": [
      {
        "direction": "to_customer",
        "stage_key": "application_filed",
        "document_key": "shop_act_application_draft",
        "document_label": "Shop Act Application Draft",
        "description": "Review the Shop & Establishment application prepared for your state portal before submission. Verify establishment name, address, employee count, and working hours."
      },
      {
        "direction": "from_customer",
        "stage_key": "application_filed",
        "document_key": "additional_state_docs",
        "document_label": "State-Specific Additional Documents",
        "description": "Some states require additional documents after initial submission — e.g., municipal NOC, ward certificate, or additional employee declarations. Upload here if requested."
      },
      {
        "direction": "to_customer",
        "stage_key": "certificate_issued",
        "document_key": "shop_establishment_certificate",
        "document_label": "Shop & Establishment Registration Certificate",
        "description": "Official registration certificate issued by the state labour department or municipal authority. Must be displayed at the premises at all times."
      }
    ],

    "final_deliverables": [
      {
        "document_key": "shop_establishment_certificate",
        "document_label": "Shop & Establishment Registration Certificate",
        "description": "Official certificate — must be displayed at premises at all times"
      }
    ]
  },

  {
    "service_slug": "msme-registration",

    "initial_documents": [
      {
        "document_key": "aadhaar_card",
        "document_label": "Aadhaar Card of Owner / Promoter",
        "description": "Aadhaar card of the proprietor / managing partner / authorized director — the person whose Aadhaar will be used for e-KYC on the Udyam portal",
        "is_required": true,
        "tips": [
          "Must be linked to an active mobile number — our CA will request the Aadhaar OTP via WhatsApp during filing",
          "Full Aadhaar number must be visible — masked versions not accepted",
          "Name on Aadhaar must match the name entered in the questionnaire exactly"
        ]
      },
      {
        "document_key": "pan_card",
        "document_label": "PAN Card of Enterprise",
        "description": "PAN card of the enterprise — entity PAN for companies/LLPs, proprietor's PAN for proprietorships",
        "is_required": true,
        "tips": [
          "Mandatory since April 2021 for all Udyam registrations",
          "PAN is used to auto-fetch ITR data from Income Tax Department for turnover verification",
          "Ensure PAN details are updated with the Income Tax department"
        ]
      },
      {
        "document_key": "gst_certificate",
        "document_label": "GST Registration Certificate",
        "description": "GSTIN certificate of the enterprise — required if the business has GST registration",
        "is_required": false,
        "tips": [
          "Only required if you answered 'Yes' to GST registration in the questionnaire",
          "GSTIN is used to auto-fetch turnover data from the GST portal for classification verification"
        ]
      },
      {
        "document_key": "bank_proof",
        "document_label": "Bank Account Proof",
        "description": "Cancelled cheque or first page of passbook of the enterprise's bank account",
        "is_required": true,
        "tips": [
          "Account should be in the name of the enterprise or proprietor",
          "IFSC and account number must be clearly visible"
        ]
      }
    ],

    "work_documents": [
      {
        "direction": "to_customer",
        "stage_key": "certificate_issued",
        "document_key": "udyam_certificate",
        "document_label": "Udyam Registration Certificate",
        "description": "Official Udyam Registration Certificate with Udyam Registration Number (URN) and QR code. Contains your MSME classification (Micro / Small / Medium)."
      }
    ],

    "final_deliverables": [
      {
        "document_key": "udyam_certificate",
        "document_label": "Udyam Registration Certificate",
        "description": "Official certificate with URN and QR code — use this for government schemes, bank loans, and subsidy applications"
      }
    ]
  },

  {
    "service_slug": "iec-registration",

    "initial_documents": [
      {
        "document_key": "pan_card",
        "document_label": "PAN Card of Entity",
        "description": "PAN card of the business entity — entity PAN for companies/LLPs, proprietor's PAN for proprietorships",
        "is_required": true,
        "tips": [
          "IEC is linked to the entity's PAN — the IEC number is the same as the entity PAN",
          "Name on PAN must match the DGFT application exactly",
          "For proprietorships: proprietor's personal PAN is used"
        ]
      },
      {
        "document_key": "entity_proof",
        "document_label": "Entity Registration Proof",
        "description": "Certificate of Incorporation for companies and LLPs, Partnership Deed for firms, Registration Certificate for trusts/societies",
        "is_required": true,
        "tips": [
          "Not required for sole proprietors",
          "Must be attested or certified copy",
          "Entity name must match PAN card exactly"
        ]
      },
      {
        "document_key": "address_proof",
        "document_label": "Registered Office Address Proof",
        "description": "Electricity bill, telephone bill, or bank statement for the registered office address",
        "is_required": true,
        "tips": [
          "Not older than 2 months",
          "Address must match the DGFT application",
          "For rented premises: rent agreement preferred in addition to utility bill"
        ]
      },
      {
        "document_key": "cancelled_cheque",
        "document_label": "Cancelled Cheque of Business Bank Account",
        "description": "Cancelled cheque with pre-printed entity name, account number, IFSC code, and bank branch",
        "is_required": true,
        "tips": [
          "Account must be in the name of the applying entity",
          "Pre-printed name mandatory — handwritten or stamped name not accepted",
          "IFSC code must be clearly visible",
          "Current account preferred for business entities"
        ]
      },
      {
        "document_key": "applicant_photo",
        "document_label": "Passport Size Photograph of Applicant",
        "description": "Recent passport-size photograph of the proprietor / MD / designated partner who is the primary applicant",
        "is_required": true,
        "tips": [
          "Plain white background",
          "Taken within the last 6 months"
        ]
      },
      {
        "document_key": "applicant_id_proof",
        "document_label": "ID Proof of Applicant",
        "description": "Aadhaar / Passport / Voter ID of the proprietor / MD / designated partner — front and back",
        "is_required": true,
        "tips": [
          "Aadhaar preferred",
          "For foreign nationals: passport mandatory",
          "Must match the name in the application"
        ]
      }
    ],

    "work_documents": [
      {
        "direction": "to_customer",
        "stage_key": "application_filed",
        "document_key": "anf2a_draft",
        "document_label": "IEC Application Draft (ANF-2A)",
        "description": "Review the IEC application form (ANF-2A) prepared for DGFT portal submission. Verify entity details, bank account details, and address before confirming."
      },
      {
        "direction": "from_customer",
        "stage_key": "application_filed",
        "document_key": "board_resolution_signed",
        "document_label": "Board Resolution (Signed)",
        "description": "Board resolution authorizing the named individual to apply for IEC on behalf of the company — required for Pvt Ltd, LLP, and Public Ltd companies. We prepare this — director(s) must sign and upload on company letterhead."
      },
      {
        "direction": "to_customer",
        "stage_key": "iec_issued",
        "document_key": "iec_certificate",
        "document_label": "IEC Certificate",
        "description": "Official IEC certificate issued by DGFT. Contains the 10-digit IEC number (same as entity PAN), entity name, address, and bank account details."
      },
      {
        "direction": "to_customer",
        "stage_key": "iec_issued",
        "document_key": "dgft_login_credentials",
        "document_label": "DGFT Portal Login Details",
        "description": "Your DGFT portal login credentials — required for IEC annual updation (April–June every year) and for applying for Export Promotion schemes."
      }
    ],

    "final_deliverables": [
      {
        "document_key": "iec_certificate",
        "document_label": "IEC Certificate",
        "description": "Official DGFT certificate with 10-digit IEC number — required for all import/export transactions"
      },
      {
        "document_key": "dgft_login_credentials",
        "document_label": "DGFT Portal Login Details",
        "description": "Required for annual IEC updation (April–June) — IEC gets deactivated without annual updation"
      }
    ]
  },

  {
    "service_slug": "professional-tax-registration",

    "initial_documents": [
      {
        "document_key": "pan_card",
        "document_label": "PAN Card of Entity",
        "description": "PAN card of the business entity",
        "is_required": true,
        "tips": [
          "Entity PAN for companies and LLPs",
          "Proprietor's PAN for sole proprietorships",
          "Must match the name in the PT application"
        ]
      },
      {
        "document_key": "owner_pan_card",
        "document_label": "PAN Card of Proprietor / Director / Partner",
        "description": "PAN card of the individual in charge — proprietor, managing director, or managing partner",
        "is_required": true,
        "tips": [
          "Required in addition to entity PAN for companies and firms"
        ]
      },
      {
        "document_key": "aadhaar_card",
        "document_label": "Aadhaar Card of Proprietor / Director",
        "description": "Aadhaar card of the proprietor / director / managing partner",
        "is_required": true,
        "tips": [
          "Both front and back in a single file",
          "Required for identity verification on the state PT portal"
        ]
      },
      {
        "document_key": "address_proof",
        "document_label": "Business Address Proof",
        "description": "Electricity bill, rent agreement, or bank statement for the registered business address",
        "is_required": true,
        "tips": [
          "Not older than 3 months",
          "Must match the business address in the application"
        ]
      },
      {
        "document_key": "entity_proof",
        "document_label": "Entity Registration Proof",
        "description": "Certificate of Incorporation, Partnership Deed, or Shop & Establishment Certificate depending on entity type",
        "is_required": false,
        "tips": [
          "Not required for sole proprietors",
          "Maharashtra: Shop & Establishment certificate may be required",
          "Karnataka: Certificate of Incorporation required for companies"
        ]
      },
      {
        "document_key": "owner_photo",
        "document_label": "Passport Size Photograph of Proprietor / Director",
        "description": "Recent passport-size photograph of the applicant",
        "is_required": true,
        "tips": [
          "Plain white background",
          "Taken within the last 6 months"
        ]
      },
      {
        "document_key": "bank_proof",
        "document_label": "Bank Account Proof",
        "description": "Cancelled cheque of the business bank account",
        "is_required": true,
        "tips": [
          "Account in the name of the business or proprietor",
          "IFSC and account number clearly visible"
        ]
      },
      {
        "document_key": "employee_list",
        "document_label": "Employee List with Salary Details",
        "description": "List of employees with name, designation, and salary bracket — required only if applying for PTRC (employer registration for employee deductions)",
        "is_required": false,
        "tips": [
          "Only required if you selected PTRC in the questionnaire",
          "Format: Name, Designation, Gross Monthly Salary",
          "PT deduction slabs are state-specific — we will calculate the correct deductions"
        ]
      }
    ],

    "work_documents": [
      {
        "direction": "to_customer",
        "stage_key": "application_filed",
        "document_key": "pt_application_draft",
        "document_label": "Professional Tax Application Draft",
        "description": "Review the PTEC and/or PTRC application prepared for your state's professional tax portal. Verify entity details, address, employee count, and registration type before we submit."
      },
      {
        "direction": "to_customer",
        "stage_key": "certificate_issued",
        "document_key": "ptec_certificate",
        "document_label": "PTEC Certificate (Professional Tax Enrollment Certificate)",
        "description": "Certificate confirming enrollment under Professional Tax for the entity itself. Contains PT enrollment number."
      },
      {
        "direction": "to_customer",
        "stage_key": "certificate_issued",
        "document_key": "ptrc_certificate",
        "document_label": "PTRC Certificate (Professional Tax Registration Certificate)",
        "description": "Employer registration certificate for deducting PT from employee salaries. Contains PTRC number and must be referenced in every PT challan filed.",
        "note": "Delivered only if PTRC was applied for"
      }
    ],

    "final_deliverables": [
      {
        "document_key": "ptec_certificate",
        "document_label": "PTEC Certificate",
        "description": "Professional Tax Enrollment Certificate — for the entity's own PT liability"
      },
      {
        "document_key": "ptrc_certificate",
        "document_label": "PTRC Certificate",
        "description": "Professional Tax Registration Certificate — for employer deductions from employee salaries (if applied)"
      }
    ]
  }

  ,

  {
    "service_slug": "esi-pf-registration",

    "initial_documents": [
      {
        "document_key": "pan_card",
        "document_label": "PAN Card of Entity",
        "description": "PAN card of the company / LLP / firm registering for ESI and/or PF",
        "is_required": true,
        "tips": [
          "Entity PAN — not individual director's PAN",
          "Name on PAN must exactly match the name in the application",
          "Required for both ESI and PF registration"
        ]
      },
      {
        "document_key": "entity_proof",
        "document_label": "Certificate of Incorporation / Registration",
        "description": "Certificate of Incorporation for companies and LLPs, Partnership Deed for firms, Registration Certificate for other entities",
        "is_required": true,
        "tips": [
          "Must show the legal entity name and date of incorporation / commencement",
          "For Pvt Ltd / OPC / LLP: Certificate of Incorporation from MCA",
          "For Partnership: registered Partnership Deed",
          "For Proprietorship: GST certificate or Shop Act certificate as entity proof"
        ]
      },
      {
        "document_key": "address_proof",
        "document_label": "Establishment Address Proof",
        "description": "Electricity bill, property tax receipt, or rent agreement for the principal place of business / factory / office",
        "is_required": true,
        "tips": [
          "Must not be older than 2 months",
          "Address must match the registered address being used in the application",
          "For rented premises: submit rent agreement along with utility bill"
        ]
      },
      {
        "document_key": "gst_certificate",
        "document_label": "GST Registration Certificate",
        "description": "GSTIN certificate of the entity — used for identity and address cross-verification",
        "is_required": true,
        "tips": [
          "Business name on GST certificate must match the ESI/PF application",
          "If GST is not yet registered, provide MSME or Shop Act certificate as alternative"
        ]
      },
      {
        "document_key": "employee_list",
        "document_label": "Employee List with Salary Details",
        "description": "List of all current employees with full name, date of joining, designation, and gross monthly salary",
        "is_required": true,
        "tips": [
          "ESI applies to employees earning up to ₹21,000/month gross — include all such employees",
          "PF applies to all employees earning up to ₹15,000/month basic — include all",
          "Employees above the threshold can be included voluntarily — note this separately",
          "Format: Employee Name | DOJ | Designation | Gross Monthly Salary | Basic Salary",
          "Include contract and part-time employees if they meet the wage threshold"
        ]
      },
      {
        "document_key": "salary_register",
        "document_label": "Salary Register / Payroll Statement",
        "description": "Last 3 months' salary register or payroll statement showing salary paid to each employee",
        "is_required": true,
        "tips": [
          "Must show gross salary, basic salary, and take-home components separately",
          "Can be in Excel format — we accept XLSX or PDF",
          "Must be signed by the authorized signatory or HR head",
          "Needed to verify the employee count and wage data at the time of registration"
        ]
      },
      {
        "document_key": "bank_proof",
        "document_label": "Bank Account Proof",
        "description": "Cancelled cheque or first page of passbook of the entity's bank account from which ESI/PF contributions will be remitted",
        "is_required": true,
        "tips": [
          "Account must be in the name of the entity",
          "IFSC code and account number must be clearly visible",
          "Current account preferred"
        ]
      },
      {
        "document_key": "signatory_details",
        "document_label": "Authorized Signatory Details",
        "description": "PAN and Aadhaar of the director / proprietor / managing partner who will be the authorized signatory for ESI/PF compliance",
        "is_required": true,
        "tips": [
          "The signatory will be responsible for monthly ESI/PF challan payments and returns",
          "Must be a principal employer — not a contractor or HR manager",
          "For companies: board resolution authorizing the signatory may be required"
        ]
      },
      {
        "document_key": "commencement_proof",
        "document_label": "Proof of Date of Commencement of Business",
        "description": "Document proving the date from which the business commenced operations — used to determine ESI/PF liability start date",
        "is_required": true,
        "tips": [
          "Acceptable: first GST return filing date, first salary payment record, first invoice date, or incorporation certificate date",
          "For factories: Factory License or first production record",
          "ESI/PF liability commences from the date the employee threshold is crossed — mention that date explicitly"
        ]
      },
      {
        "document_key": "shop_act_certificate",
        "document_label": "Shop & Establishment Certificate",
        "description": "Shop & Establishment registration certificate for the establishment — required for non-factory establishments",
        "is_required": false,
        "tips": [
          "Required for offices, shops, restaurants, hotels, and other commercial establishments",
          "Factory establishments: provide Factory License instead",
          "If not yet obtained, can be applied simultaneously — inform us"
        ]
      }
    ],

    "work_documents": [
      {
        "direction": "to_customer",
        "stage_key": "application_filed",
        "document_key": "esi_application_draft",
        "document_label": "ESI Registration Application Draft",
        "description": "Review the ESI registration application prepared for the ESIC portal before submission. Verify establishment details, employee count, wage data, and signatory details. ESI registration is done online on esic.gov.in."
      },
      {
        "direction": "to_customer",
        "stage_key": "application_filed",
        "document_key": "pf_application_draft",
        "document_label": "PF Registration Application Draft",
        "description": "Review the PF (EPFO) registration application prepared for the Unified Shram Suvidha Portal before submission. Verify establishment details, nature of work, employee count, and authorised signatory."
      },
      {
        "direction": "from_customer",
        "stage_key": "application_filed",
        "document_key": "additional_employee_docs",
        "document_label": "Additional Employee Documents (if queried)",
        "description": "If ESIC or EPFO raises a query requesting additional employee proof — attendance registers, offer letters, appointment letters, or PF opt-in declarations — upload here."
      },
      {
        "direction": "to_customer",
        "stage_key": "registration_certificate",
        "document_key": "esic_registration_letter",
        "document_label": "ESIC Registration Letter / Code",
        "description": "Official ESIC registration confirmation containing your 17-digit ESI Employer Code. This code is used for all future ESI challan payments and employee registrations."
      },
      {
        "direction": "to_customer",
        "stage_key": "registration_certificate",
        "document_key": "epfo_registration_letter",
        "document_label": "EPFO Registration Letter / PF Code",
        "description": "Official EPFO registration confirmation containing your PF Establishment Code. Required for monthly PF challan payments via ECR (Electronic Challan cum Return) on the EPFO Unified Portal."
      },
      {
        "direction": "to_customer",
        "stage_key": "registration_certificate",
        "document_key": "compliance_guide",
        "document_label": "ESI/PF Monthly Compliance Guide",
        "description": "Summary document prepared by our CA covering: monthly contribution rates (ESI: 3.25% employer + 0.75% employee; PF: 12% employer + 12% employee), due dates (ESI: 15th of following month; PF: 15th of following month), ECR filing process, and employee registration steps."
      }
    ],

    "final_deliverables": [
      {
        "document_key": "esic_registration_letter",
        "document_label": "ESIC Registration Letter with Employer Code",
        "description": "17-digit ESI Employer Code — mandatory for monthly ESI contributions and employee IP (Insurance Person) registrations"
      },
      {
        "document_key": "epfo_registration_letter",
        "document_label": "EPFO Registration Letter with PF Code",
        "description": "PF Establishment Code — mandatory for monthly PF ECR filing and contributions"
      },
      {
        "document_key": "compliance_guide",
        "document_label": "ESI/PF Monthly Compliance Guide",
        "description": "Contribution rates, due dates, and step-by-step filing instructions for ongoing compliance"
      }
    ]
  }

]
```

---

*End of document. Part 1: 19 service configurations. Part 2: Document flow for 10 services (GST Registration, Private Limited Company, LLP Registration, Trademark Registration, FSSAI Basic, FSSAI State, FSSAI Central, Shop & Establishment, MSME/Udyam, IEC, Professional Tax, ESI/PF Registration).*

