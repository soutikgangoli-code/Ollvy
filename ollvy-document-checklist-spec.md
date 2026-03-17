# Ollvy — Document Checklist Suite
## Complete Data + SEO Specification for Claude Code
**Version 2.0 · March 2026 · 8 Checklists · All Documents with Full Rich Data**

---

## How to Use This Document

This is the authoritative data source for `lib/data/document-checklists.tsx` and all 8 checklist pages. Every document across every checklist has full `whatIsIt`, `howToGet`, `usualIssues`, and `details[]` fields written out. For the 3 pages currently using inline data (Individual ITR, Business ITR, Trademark), migrate them to use `DocumentChecklistContent` and the data exports defined here.

> **RULE:** Do not abbreviate or trim any field. Every word of `whatIsIt`, `howToGet`, and `usualIssues` is intentional — these appear to the user when they click a document card and are the primary trust signal on the page.

> **ACCURACY NOTE:** All documents, requirements, and descriptions have been verified against MCA, Income Tax Department, and Trademark Registry sources as of March 2026. Do not modify the legal details without re-verifying.

---

## Section 1 — What Changed and Why

### Documents Added Across Checklists (Research Findings)

| Checklist | Document Added | Reason |
|---|---|---|
| Pvt Ltd | INC-9 Declaration | Statutory requirement under Companies Act 2013 — Ollvy drafts this |
| Pvt Ltd | Email ID + Mobile Number | Mandatory for SPICe+ MCA authentication — commonly missed |
| Pvt Ltd | Voter ID / Driving License | Valid address proof options not shown |
| Individual ITR | PAN Card | Was completely missing from the list |
| Individual ITR | Aadhaar Card | Was completely missing |
| Individual ITR | Salary Slips (3 months) | Needed when employer hasn't issued Form 16 yet |
| Individual ITR | Bank Interest Certificates | Very common income source — missing |
| Individual ITR | Previous Year ITR | Needed for carry-forward losses and AO matching |
| Business ITR | PAN Card + Aadhaar | Were completely missing |
| Business ITR | Books of Accounts | Cash book, ledger — foundational requirement |
| Business ITR | Tax Audit Report (3CA/3CB + 3CD) | Critical for audit-required businesses — mentioned vaguely |
| Business ITR | Depreciation Schedule | Required for capital assets calculation |
| Business ITR | Digital Signature Certificate | Mandatory for business ITR filing |
| Trademark | Form TM-48 | This is the correct form name for PoA — more specific than "Power of Attorney" |
| Trademark | DSC (Digital Signature) | Required for online e-filing on IP India portal |
| Trademark | User Affidavit | Required if claiming prior use date |
| Trademark | MSME/Udyam Certificate | Halves the filing fee from ₹9,000 to ₹4,500 |
| GST Registration | Email ID + Mobile | Mandatory for GST portal OTP verification |
| GST Registration | HSN/SAC Code Details | Needed for business activity declaration |

### Documents Corrected

| Checklist | Document | Correction |
|---|---|---|
| Trademark | "Power of Attorney" | Renamed to "Form TM-48 (Power of Attorney)" — the Indian TM Registry uses specific Form TM-48, not a general PoA |
| Business ITR | "Tax Computation" listed as Ollvy Provides | Corrected — we prepare the computation but client provides the underlying data |
| Pvt Ltd | "Specimen Signature" note | Clarified it must be on white paper, scanned at 300 DPI |

---

## Section 2 — Component Architecture (No Changes)

```
DocumentChecklistContent component:
- Side-by-side layout: document list (left) + detail panel (right)
- Click document card → detail panel shows whatIsIt, howToGet, usualIssues, details[]
- Auto-opens first card on load
- All 8 pages must use this component — migrate ITR + Trademark pages

Data file: lib/data/document-checklists.tsx
Exports: pvtLtdDocuments, llpDocuments, partnershipDocuments, gstDocuments,
         individualITRDocuments, businessITRDocuments, trademarkDocuments
         (soleProprietorDocuments reuses gstDocuments — no change needed)
```

---

## Section 3 — Pvt Ltd Documents (`pvtLtdDocuments`)

**5 categories · 19 documents (was 17 — added INC-9, Email+Mobile)**

### Category 1: Identity Documents

---

**PAN Card** `required: true`

```
note: 'of all directors and shareholders (minimum 2 directors, 2 shareholders)'

whatIsIt: 'PAN (Permanent Account Number) is a 10-character alphanumeric code issued by the Income Tax Department. It is your tax identity — every financial transaction, company filing, and bank account in India is linked to it. For company incorporation, PAN of every director and shareholder is mandatory. If a shareholder is a corporate entity (another company), that company\'s PAN is required instead.'

howToGet: 'Most Indian founders already have a PAN. If you have it, just take a clear, well-lit photo of the physical card — front side only. The scan must show all 10 characters clearly. If you need to apply for a new PAN, do it via the NSDL or UTIITSL portals — it takes 5–7 working days and costs ₹107 (Indian address) or ₹1,017 (foreign address). For foreign nationals acting as directors, a passport serves in lieu of PAN.'

usualIssues: 'Name mismatch is the single most common rejection reason. Your PAN says "Rajesh Kumar Singh" but your Aadhaar says "R K Singh" — MCA will reject this. Check that the exact name matches across PAN, Aadhaar, and the incorporation form. Also check that your PAN is active and not inoperative (PAN becomes inoperative if not linked with Aadhaar — link at incometax.gov.in before submitting).'

details: [
  'Clear, coloured scan of original PAN card — not a photocopy of a photocopy',
  'All 10 characters of PAN number must be legible in the scan',
  'Name on PAN must exactly match name on Aadhaar card',
  'For foreign nationals: passport is accepted in lieu of PAN',
  'If PAN is not linked with Aadhaar, link it before submission — inoperative PAN causes rejection',
  'Corporate shareholders must provide the company PAN, not a director\'s personal PAN',
]
```

---

**Aadhaar Card** `required: true`

```
note: 'of all directors and shareholders — must be linked with mobile number for OTP verification'

whatIsIt: 'Aadhaar is a 12-digit unique identification number issued by UIDAI (Unique Identification Authority of India). For company incorporation, Aadhaar is mandatory for Indian directors because the SPICe+ form on the MCA portal uses Aadhaar-based OTP verification to authenticate the director\'s identity. The mobile number linked to your Aadhaar must be active — MCA sends an OTP to it during DSC application.'

howToGet: 'Take a clear scan of your Aadhaar card, both front and back. Check your mobile is linked to Aadhaar — you can verify and update it at the nearest Aadhaar enrolment centre or via myAadhaar.uidai.gov.in. If your mobile is not linked, it is a 7–10 day process at an enrolment centre. Do this before starting incorporation — it will block the entire process if not done. Foreign nationals are not required to provide Aadhaar.'

usualIssues: 'Expired or different address on Aadhaar vs the registered office address is fine — they don\'t need to match. The #1 issue is an unlinked or deactivated mobile number. If the OTP doesn\'t arrive, the DSC application fails. Also check that Aadhaar is not locked (you can lock/unlock biometrics at myAadhaar.uidai.gov.in). Never share masked Aadhaar for official filings — provide the full Aadhaar number.'

details: [
  'Scan both front and back sides of the Aadhaar card',
  'Mobile number linked to Aadhaar must be active for OTP during DSC process',
  'Address on Aadhaar does not need to match the registered office address',
  'Masked Aadhaar (showing only last 4 digits) is NOT accepted for company registration',
  'Foreign nationals are exempt from Aadhaar requirement',
  'Verify your mobile is linked at myAadhaar.uidai.gov.in before starting',
]
```

---

**Passport-Size Photographs** `required: true`

```
note: 'recent photo of each director, JPEG format, white background preferred'

whatIsIt: 'A recent passport-size photograph of each director is required for DSC (Digital Signature Certificate) application. DSC is the electronic signature used to sign all MCA forms. The photograph is part of the identity verification process with the DSC-issuing authority.'

howToGet: 'Take a standard passport-size photo (35mm x 45mm) against a white or light background. A clean, recent mobile phone selfie against a white wall works fine — no studio required. Save it as a JPEG file. The DSC authority typically wants it as a digital file (under 1MB), not a physical photo.'

usualIssues: 'Sunglasses, heavy shadows, or blurry photos get rejected by DSC authorities. Make sure the face is clearly visible. Some DSC providers are strict about white backgrounds — check before submitting. Old photos from 5+ years ago are generally fine as long as the resemblance is clear.'

details: [
  'Digital JPEG format, under 1MB file size',
  'White or light background preferred by most DSC authorities',
  'Face must be fully visible, no sunglasses or head coverings (unless religious)',
  'A clear mobile selfie works — no studio needed',
  'One photograph per director required',
]
```

---

**Specimen Signature** `required: true`

```
note: 'for DSC application — signature on plain white paper, scanned clearly'

whatIsIt: 'A specimen signature is your usual signature placed on a plain white sheet of paper, scanned cleanly. It is required during DSC (Digital Signature Certificate) application to verify your signature matches across documents. The DSC authority uses this to cross-check the signature on declaration forms you submit.'

howToGet: 'Sign your name in black or blue ink on a plain white A4 sheet. Sign once, clearly. Scan at 300 DPI minimum. Save as a JPEG or PDF. Do not sign on lined paper or paper with any background — plain white only. The signature should be your consistent banking signature, not a casual one.'

usualIssues: 'Pencil signatures are rejected outright. Signatures on coloured, textured, or lined paper are sometimes rejected. Make sure the signature is not cut off at the edges of the scan. A very faint signature (light ink, poor scan) is a common cause of DSC rejection.'

details: [
  'Sign in black or blue ink on plain white paper',
  'Scan at minimum 300 DPI, save as JPEG',
  'Signature must match your signatures on declaration forms',
  'Do not use pencil — only pen ink',
  'No lined, coloured, or textured paper',
  'One specimen per director required',
]
```

---

### Category 2: Director Address Proof (any one)

---

**Utility Bill** `required: false`

```
note: 'electricity, gas, water, or telephone bill — not older than 60 days'

whatIsIt: 'A utility bill showing your current residential address serves as address proof for each director and shareholder. Accepted bills: electricity, gas, water, landline telephone, postpaid mobile. The bill must clearly show your name, address, and be dated within the last 60 days.'

howToGet: 'Download the latest bill PDF from your electricity/gas/mobile provider\'s app or website. Or photograph the physical bill clearly. Most providers (BSES, MSEDCL, Tata Power, Jio etc.) allow digital download of bills in PDF format from their apps. Make sure the bill is addressed to you personally or to a family member at the same address.'

usualIssues: 'Bills older than 60 days are rejected. If the bill is in a parent\'s or spouse\'s name at your address, it is generally accepted with a note that you reside there — but some ROC offices prefer it to be in your own name. Prepaid mobile bills are not accepted — only postpaid. Screenshot of a bill in the provider\'s app is not accepted — download the proper PDF or photograph the physical bill.'

details: [
  'Must be dated within the last 60 days from date of submission',
  'Accepted: electricity, gas, water, landline telephone, postpaid mobile',
  'NOT accepted: prepaid mobile bills, screenshots from apps',
  'Bill does not need to be in the director\'s name — family member at same address is acceptable',
  'Full address including PIN code must be clearly visible',
]
```

---

**Bank Statement** `required: false`

```
note: 'savings or current account — first page showing name and address, not older than 60 days'

whatIsIt: 'A bank account statement (typically the first page) showing your name and current residential address is accepted as address proof. This is often the most convenient option as everyone has an active bank account and statements are easily downloadable.'

howToGet: 'Log in to your internet banking portal or mobile app. Download the account statement for the last 1–3 months. The first page (or cover page) showing your name, address, and account number is what\'s needed — you don\'t need to share all your transactions. Alternatively, ask the bank for a signed and stamped letter confirming your address.'

usualIssues: 'Statement must show your address. If your bank account address is your old address (a common issue when you\'ve moved), this won\'t work — update your address at the bank first, which takes 1–2 days. The statement must not be older than 60 days.'

details: [
  'Download from internet banking — first page showing name and address is sufficient',
  'Must not be older than 60 days',
  'The full statement with transactions is not needed — just the page showing your name and address',
  'Address must match the address declared in the incorporation form',
  'Savings account, current account, or NRI account statements all accepted',
]
```

---

**Passport** `required: false`

```
note: 'valid passport — mandatory for foreign directors, optional alternative for Indian directors'

whatIsIt: 'A valid Indian or foreign passport serves as combined identity and address proof for directors. For foreign nationals acting as directors in an Indian company, a passport is mandatory (in lieu of PAN and Aadhaar). For Indian directors, it is an optional alternative to the utility bill or bank statement as address proof.'

howToGet: 'Scan the bio-data page (the page with your photo) and the last page (showing address, if printed). For foreign nationals, the documents must be apostilled or notarised by a notary public in the country of issue before submission. If the passport is not in English, a certified English translation must also be submitted.'

usualIssues: 'Expired passports are not accepted. Foreign director documents not apostilled is the most common foreign director issue — check whether the country of issue is a Hague Convention country (apostille) or not (requires notarisation from Indian embassy/consulate). Passport address pages are sometimes blank — if so, use a utility bill or bank statement for address proof separately.'

details: [
  'Scan bio-data page clearly — all details must be legible',
  'Passport must be valid (not expired)',
  'For Indian directors: optional, use only if other address proofs are unavailable',
  'For foreign directors: mandatory, must be apostilled or notarised',
  'Foreign language passports need certified English translation',
  'If address page is blank, submit a separate address proof alongside',
]
```

---

### Category 3: Registered Office Documents

---

**Registered Office Address Proof** `required: true`

```
note: 'utility bill for the office address — electricity, telephone, gas — not older than 60 days'

whatIsIt: 'Proof of the registered office address is distinct from the director\'s personal address proof. This is a utility bill (electricity, gas, water, telephone) in the name of the property owner showing the address where the company will be registered. Every company must have a registered office address in India — this can be a home address, a rented commercial space, or a virtual office.'

howToGet: 'Get the utility bill for the office/home address where you want to register the company. If the office is rented, ask the landlord for a recent utility bill for the property. If you are using your own home, use your personal utility bill. Virtual office providers supply a utility bill for their address as part of their service. Digital download from the electricity/gas provider\'s portal is fine.'

usualIssues: 'Using your home address is perfectly legal and common for startups — do not pay for office space just for this. The address must exist physically — P.O. box addresses are not accepted. The bill must be dated within 60 days. If the bill is in the property owner\'s name (not yours), you also need the NOC from the property owner (see below).'

details: [
  'Must show the exact address where the company will be registered',
  'Accepted: electricity, gas, water, telephone bill for the property',
  'Must be dated within 60 days',
  'Home address is 100% legal and acceptable as registered office',
  'The bill can be in the property owner\'s name — just also provide the NOC',
  'Virtual office provider\'s utility bill is accepted',
]
```

---

**Rent Agreement** `required: false`

```
note: 'only if office premises are rented — not required for own property'

whatIsIt: 'If the registered office is a rented property (commercial or residential), a rent/leave-and-licence agreement is required to prove the company has the right to use that address. This is not needed if you own the property or are using a virtual office (the virtual office agreement takes its place).'

howToGet: 'If you have a lease or rent agreement already, submit a scanned copy. A registered rent agreement (registered at the sub-registrar office) is stronger than an unregistered one, but both are accepted. For home-based setups where you are paying rent, use your existing rent agreement. If you own the property, skip this — just submit the utility bill.'

usualIssues: 'Rent agreement expired? An expired agreement combined with a recent utility bill is sometimes accepted at MCA\'s discretion, but to be safe, renew it or get a fresh notarised letter from the landlord confirming your continued occupancy. Agreement must cover the current date of filing.'

details: [
  'Only required if office premises are rented or leased',
  'Both registered and unregistered agreements are accepted',
  'Agreement must be current — not expired at the time of filing',
  'For home-based startups using their own property: skip this document',
  'Virtual office agreement from the provider replaces this',
]
```

---

**NOC from Property Owner** `required: true` `ollyProvides: true`

```
note: 'No Objection Certificate from property owner — Ollvy prepares this for you'

whatIsIt: 'An NOC (No Objection Certificate) is a short letter from the property owner giving permission for the company to use their property as the registered office. MCA requires this whenever the registered office utility bill is in someone else\'s name — which is almost always the case for rented offices or when directors use their family home. Ollvy prepares the standard NOC template — the property owner just needs to sign it.'

howToGet: 'Ollvy provides you the standard NOC letter with the correct legal language. Print it, have the property owner (parent, landlord, or yourself if you own it but the bill is in a relative\'s name) sign it, and scan it back to us. The NOC does not need to be notarised or stamped — a plain paper signed letter is sufficient for MCA purposes.'

usualIssues: 'People think this is complex — it is not. It is literally 5 lines: "I, [property owner name], owner of [address], hereby consent to the use of the above property as the registered office of [company name]." If the landlord is reluctant to sign, reassure them it does not affect their ownership or create any liability for them.'

details: [
  'Ollvy provides the standard NOC template — nothing to draft yourself',
  'Property owner signs the letter — no notarisation or stamp paper required',
  'One page, simple format — takes 5 minutes for the owner to review and sign',
  'Required whenever the utility bill is in someone else\'s name',
  'Landlord signing the NOC does not give the company any ownership rights',
]
```

---

### Category 4: Company Details

---

**Proposed Company Names (3 options)** `required: true`

```
note: 'in order of preference — first available name is reserved by MCA'

whatIsIt: 'Before a company can be incorporated, its name must be approved by MCA (Ministry of Corporate Affairs). You propose up to 3 names in order of preference through SPICe+ Part-A (RUN — Reserve Unique Name). MCA checks availability against existing company names, trademarks, and prohibited names, then reserves your first available name for 20 days within which you must complete Part-B filing.'

howToGet: 'Think of 3 options that: (a) end in "Private Limited" (mandatory), (b) reflect your business, (c) are not identical or deceptively similar to an existing company or trademark. Check availability at mca.gov.in/mcafoportal/viewCompanyMasterData.do before proposing. Your 1st choice should be the name you want most. Ollvy guides you through the name search and checks availability before submission.'

usualIssues: 'Vague names like "India Digital Private Limited" or "Global Tech Private Limited" are rejected because they are too generic or too similar to existing names. Names containing words like "National", "Bank", "Insurance", "Government", "Bharat" etc. require special government approval — avoid these for faster processing. A trademark search alongside MCA search is recommended — if you are planning to trademark your name later, ensure it is available on the IP India database too.'

details: [
  'Submit 3 names in order of preference — MCA checks each in sequence',
  'Name must end with "Private Limited" — this cannot be abbreviated at incorporation stage',
  'Check availability at mca.gov.in before submitting to avoid rejection',
  'Avoid generic, prohibited, or government-associated words in the name',
  'Ollvy performs a preliminary name availability check before submission',
  'Reserved name is valid for 20 days — Part-B must be filed within this window',
]
```

---

**Business Activity Description** `required: true`

```
note: 'what your company will do — must match an MCA NIC code'

whatIsIt: 'You must declare what your company will do — its main business activity. This is mapped to NIC (National Industry Classification) codes, which MCA uses to classify companies. The description goes into the Memorandum of Association (MOA) as the "Objects" clause. What you put here determines what business your company is legally authorised to do — so it should be broad enough to cover current and near-future activities.'

howToGet: 'Write 2–3 sentences describing your core business: what you sell or provide, to whom, and how. Ollvy maps this to the appropriate NIC codes and drafts the Objects clause for your MOA. You do not need to know the NIC codes yourself — just describe your business in plain language. Example: "We provide software as a service to small businesses for accounting and invoicing."'

usualIssues: 'Making it too narrow is a common mistake — "selling handmade wooden furniture" is too narrow, but "manufacturing and trading in furniture and home furnishings" covers you better. If you want to raise investment, include "investment in securities and financial instruments" in the ancillary objects. Changing the Objects clause later requires an EGM (Extraordinary General Meeting) and ROC filing — get it right now.'

details: [
  'Describe in plain language — Ollvy converts it to the correct MCA Objects format',
  'Be broad enough to cover current and near-future business activities',
  'NIC code is assigned by Ollvy based on your description',
  'Consider including ancillary objects if investment or IP licensing is planned',
  'Objects clause is legally binding — company cannot do business outside its objects',
]
```

---

**Authorized Capital Details** `required: true`

```
note: 'minimum ₹1 authorised capital — no minimum paid-up capital required'

whatIsIt: 'Authorised capital is the maximum share capital your company is permitted to issue under its MOA. Paid-up capital is the actual amount shareholders have paid in. As of 2020, there is NO minimum paid-up capital requirement for Pvt Ltd companies. You can incorporate with ₹1 as both authorised and paid-up capital. Most startups incorporate with ₹1,00,000 authorised capital (₹10/share × 10,000 shares) to keep costs manageable — higher authorised capital means higher ROC stamp duty.'

howToGet: 'Decide: (a) Total authorised capital amount — typically ₹1 lakh for startups. (b) Face value per share — ₹1, ₹10, or ₹100 (₹10 is most common). (c) Number of shares = authorised capital / face value. (d) How many shares each promoter gets (share allocation). Ollvy walks you through this with a simple form — you don\'t need to know the legal structure.'

usualIssues: 'Setting authorised capital too high in the beginning means paying higher ROC fees. ₹1 lakh authorised capital costs ₹1,000 in ROC stamp duty. ₹10 lakh costs ₹4,000. Match your authorised capital to what you need now — you can always increase it later through Form SH-7. Unequal share splits between founders (51:49 instead of 50:50) matter a lot for future control — think this through.'

details: [
  'No minimum authorised capital — ₹1 is legally valid',
  'Most startups use ₹1 lakh authorised capital with ₹10 face value = 10,000 shares',
  'Higher authorised capital = higher ROC stamp duty at incorporation',
  'You can increase authorised capital later via Form SH-7',
  'Decide on founder share split before submitting — it is harder to change later',
  'Ollvy provides a simple form to capture this — no legal knowledge needed',
]
```

---

**Shareholder Details** `required: false`

```
note: 'name, address, PAN, and number of shares for each shareholder'

whatIsIt: 'Details of all subscribers to the Memorandum of Association — the initial shareholders. This includes their full name (as per PAN), address, PAN number, number of shares subscribed, and the amount paid. For most founder-run startups, the directors and shareholders are the same people. Minimum 2 shareholders required for Pvt Ltd.'

howToGet: 'Provide the PAN and Aadhaar of each shareholder (already collected above) and decide how shares are split. If a corporate entity (another company or an investment vehicle) is a shareholder, you need that entity\'s PAN, incorporation certificate, and board resolution authorising the subscription. Ollvy creates the subscriber sheet based on your inputs.'

usualIssues: 'If an investor is a shareholder at incorporation, they need to provide KYC documents before filing. A common mistake is adding shareholders informally and not reflecting them in MCA filings — all shareholders must be listed in the subscriber sheet at incorporation. Foreign shareholders require FIRC (Foreign Inward Remittance Certificate) and FC-GPR filing within 30 days of allotment.'

details: [
  'Minimum 2 shareholders required — can be same persons as directors',
  'For corporate shareholders: company PAN + incorporation certificate + board resolution',
  'Foreign shareholders: additional FEMA compliance (FC-GPR) required after incorporation',
  'Share split must total 100% of paid-up capital',
  'Ollvy creates the subscriber sheet based on your inputs',
]
```

---

### Category 5: Digital & Legal

---

**Digital Signature Certificate (DSC)** `required: true` `ollyvyProvides: true`

```
note: 'Class 3 DSC — mandatory for all directors and subscribers to MOA and AOA'

whatIsIt: 'A DSC is a secure digital key (a small USB token or virtual certificate) that enables directors to sign MCA e-forms electronically. Without a DSC, you cannot submit a single form on the MCA portal. Class 3 DSC is mandatory for all directors, shareholders who are subscribers to the MOA/AOA, and the professional (CA/CS/CMA) who certifies the SPICe+ form. Ollvy procures DSCs for all directors as part of the incorporation package.'

howToGet: 'Ollvy handles the entire DSC procurement process. You provide your PAN, Aadhaar, photograph, and specimen signature — Ollvy applies to a government-certified DSC issuing authority (eMudhra, Sify, NSDL etc.). The process involves Aadhaar OTP and a brief video verification call. DSC is typically issued within 1–2 working days. The DSC is valid for 2 years and can be renewed thereafter.'

usualIssues: 'DSC application fails if your Aadhaar mobile is not active. Video KYC for DSC is done via a live call with the DSC authority — ensure the director is available for a 5-minute call during business hours. If you have a very old DSC from a previous company, check if it is still valid — expired DSCs cause filing rejections at MCA with unclear error messages.'

details: [
  'Class 3 DSC required — Class 1 and 2 are no longer accepted for MCA filings',
  'Ollvy procures DSC for all directors as part of the incorporation package',
  'Requires: PAN, Aadhaar (with active mobile), photograph, specimen signature',
  'Issued within 1–2 working days via Aadhaar OTP and video verification',
  'Valid for 2 years — renewal costs approximately ₹1,000 per DSC',
  'One DSC per director — each director needs their own, they are not transferable',
]
```

---

**Director Identification Number (DIN)** `required: true` `ollyvyProvides: true`

```
note: 'unique 8-digit number for every director — obtained as part of SPICe+ filing'

whatIsIt: 'A DIN (Director Identification Number) is a unique 8-digit number that identifies a director across all MCA filings. Every individual who wants to become a director of any Indian company must have a DIN. If you are incorporating your first company, you will not have a DIN yet — it is applied for as part of the SPICe+ incorporation form (up to 3 new DINs can be applied for simultaneously in SPICe+ Part-B). Ollvy handles this as part of the incorporation process.'

howToGet: 'You do not need to apply for a DIN separately. Ollvy includes DIN application for up to 3 directors in the SPICe+ form. The DIN is generated automatically when ROC approves the incorporation. If a director already has a DIN from a previous company, that existing DIN is used — just provide the existing DIN number. Existing directors must file DIR-3 KYC annually by September 30 to keep the DIN active.'

usualIssues: 'If a director already has a DIN but it is deactivated (due to non-filing of DIR-3 KYC), the incorporation will be blocked. Check DIN status at mca.gov.in before filing. A person cannot hold more than 20 DINs simultaneously — but in practice this is rarely an issue for founders.'

details: [
  'Ollvy applies for DIN as part of the SPICe+ filing — no separate application needed',
  'Up to 3 DINs can be applied for in a single SPICe+ form',
  'Existing directors must provide their existing DIN number',
  'DIN becomes deactivated if DIR-3 KYC is not filed by September 30 each year',
  'Check DIN status at mca.gov.in if unsure whether an existing DIN is active',
  'DIN is permanent and follows you across all company directorships',
]
```

---

**MOA and AOA** `required: true` `ollyvyProvides: true`

```
note: 'Memorandum and Articles of Association — Ollvy drafts both'

whatIsIt: 'The MOA (Memorandum of Association) defines the company\'s relationship with the outside world — its name, registered state, objects (what it will do), liability of members, and authorised capital. The AOA (Articles of Association) is the internal rulebook — governance structure, director powers, shareholder rights, meeting procedures, share transfer rules. Together they are the constitution of the company. Both must be digitally signed by all subscribers and filed with MCA. Ollvy drafts both documents tailored to your business.'

howToGet: 'You provide the business activity description, authorised capital details, and founder/shareholder information. Ollvy drafts MOA and AOA in the prescribed SPICe+ format (INC-33 and INC-34). You review and digitally sign using your DSC. No need to print, notarise, or physically sign — the entire process is online. Ollvy\'s templates cover standard governance for Pvt Ltd companies suitable for startups, SMEs, and investor-ready structures.'

usualIssues: 'A generic MOA that doesn\'t cover ancillary activities causes problems when the company wants to do something not in its objects — for example, an e-commerce company that wants to raise a loan from a promoter needs "lending and borrowing" in the objects. Review the objects clause carefully before signing. AOA clauses on share transfers matter most for companies planning external investment — Ollvy\'s investor-ready AOA templates are pre-built for common VC scenarios.'

details: [
  'Ollvy drafts both MOA and AOA in prescribed format',
  'MOA covers: company name, state, objects, liability, authorised capital',
  'AOA covers: director powers, shareholder rights, meeting procedures, share transfers',
  'Both are digitally signed by all subscribers using their DSCs — no physical signing',
  'Filed electronically as INC-33 (MOA) and INC-34 (AOA) via SPICe+',
  'Ollvy\'s templates include standard provisions suitable for startup structures',
]
```

---

**Director Consent Forms** `required: true` `ollyvyProvides: true`

```
note: 'DIR-2 consent to act as director + INC-9 declaration — Ollvy prepares both'

whatIsIt: 'Two statutory declarations are required from each director: (1) DIR-2: Consent to act as director — a formal statement that the person is willing to be a director and is not disqualified. (2) INC-9: Declaration by subscribers and first directors confirming they are not disqualified and have not been convicted of any offence involving moral turpitude. Both are prescribed forms under the Companies Act 2013. Ollvy prepares the draft — directors sign using their DSC.'

howToGet: 'Ollvy generates these forms pre-filled with your details. You review and sign digitally using your DSC via the MCA portal. No need to print, physically sign, or notarise. If signing manually (for some edge cases), they must be notarised. The online DSC-signed version is preferred and faster.'

usualIssues: 'Directors sometimes worry about the "not disqualified" declaration — it is a standard compliance statement. If a director has a pending court case, criminal conviction, or is an undischarged insolvent, they may be disqualified. For the vast majority of startup founders, this is a non-issue. Provide accurate details — false declarations are a criminal offence under Companies Act 2013.'

details: [
  'DIR-2: Consent to act as director — standard for every new director',
  'INC-9: Declaration by first directors and subscribers — statutory requirement',
  'Both prepared by Ollvy and signed by directors using their DSC',
  'No physical printing or notarisation required for the online process',
  'False declarations in these forms are a criminal offence — provide accurate information',
  'One set per director',
]
```

---

**Email ID and Mobile Number** `required: true`

```
note: 'unique email and mobile for each director — used for MCA OTP authentication'

whatIsIt: 'MCA requires a unique email address and mobile number for each director and subscriber to MOA/AOA. These are used for: OTP-based e-verification during DSC application, communication from MCA and the Registrar of Companies, and authentication during SPICe+ filing. Each person must provide their own — two directors cannot share the same email or mobile number on the same filing.'

howToGet: 'Use your regular personal email (Gmail, professional domain etc.) and your active Indian mobile number. These do not need to be new or dedicated — your existing personal email and mobile are fine. Just ensure they are active and you have access to receive OTPs. Note: these details become part of the company\'s MCA filings and are partially visible in the public company master data.'

usualIssues: 'Two directors using the same email or mobile causes SPICe+ form rejection. Foreign directors need an Indian mobile number for OTP purposes — they can use a family member\'s Indian number as a temporary solution or purchase an Indian SIM before filing. Post-incorporation, always keep MCA email and mobile updated if they change — update via DIR-3 KYC annual form.'

details: [
  'Each director must provide a unique email and unique mobile number',
  'Two directors cannot share the same email or mobile on the same filing',
  'Must be active — OTPs will be sent to these during DSC and filing process',
  'Foreign directors: an Indian mobile number is required for OTP',
  'These details are partially visible in public MCA company records',
  'Update via DIR-3 KYC annually if email or mobile changes',
]
```

---

## Section 4 — LLP Documents (`llpDocuments`)

**5 categories · 16 documents — existing data is accurate, rich fields below are the corrected/enhanced version**

> The existing 16 documents are correct. The `whatIsIt`, `howToGet`, and `usualIssues` content from the current `llpDocuments` export is well-written and accurate. The enhancements below are additive — update the specific documents noted.

### Corrections and Additions

**DPIN — update `whatIsIt`:**

```
whatIsIt: 'A DPIN (Designated Partner Identification Number) is the LLP equivalent of a DIN. Every designated partner of an LLP must have a DPIN before the LLP can be registered. Unlike a Pvt Ltd where only directors need a DIN, in an LLP, only the designated partners (not regular partners) need DPINs. A Pvt Ltd director\'s existing DIN is accepted as DPIN — same number, same system. Ollvy applies for DPINs for all designated partners as part of the LLP filing via Form FiLLiP.'
```

**LLP Agreement — update `usualIssues`:**

```
usualIssues: 'The LLP Agreement must be filed within 30 days of LLP incorporation via Form 3 on the MCA portal. If not filed on time, a penalty of ₹100 per day applies. Ensure profit/loss sharing ratios are explicitly stated — vague ratios ("equally between partners") create disputes. If any partner is contributing intellectual property or services (instead of cash) as their contribution, this must be explicitly valued and mentioned in the agreement. Ollvy\'s LLP Agreement templates cover standard startup scenarios.'
```

**Add Email ID and Mobile to LLP — same as Pvt Ltd:**

```
'Email ID and Mobile Number' — same specification as Pvt Ltd Section 3.
required: true
note: 'unique email and mobile for each designated partner'
```

---

## Section 5 — Partnership Documents (`partnershipDocuments`)

**5 categories · 15 documents — existing data is accurate**

### Corrections and Additions

**Partnership Deed — update `usualIssues`:**

```
usualIssues: 'The most common issue is a vague profit-sharing clause. "Equally among partners" is fine when things are good. When they go wrong, "equally" leads to disputes. Specify exact percentages. Also specify: what happens if a partner wants to exit, what happens on death of a partner, and what the decision-making process is for major business decisions. Stamp duty on partnership deeds varies by state — in Maharashtra it is ₹500, in Delhi it is ₹100. Ollvy prepares the deed on appropriate stamp paper for your state.'
```

**Add Partnership PAN — update `howToGet`:**

```
howToGet: 'The partnership firm\'s PAN is separate from the individual partners\' PANs. Apply for the firm PAN at NSDL/UTIITSL using Form 49A after the partnership deed is executed. Ollvy handles this as part of the registration package. The firm\'s PAN is required to open a bank account, file GST, and file ITR for the firm. Allow 5–7 working days after deed execution.'
```

---

## Section 6 — GST Registration Documents (`gstDocuments`)

**4 categories · 14 documents (was 12 — added Email+Mobile, HSN/SAC details)**

### Category 1: Identity Documents

*(Existing PAN, Aadhaar, Photograph data — enhance with specifics below)*

**PAN Card — update `note` and `usualIssues`:**

```
note: 'of the proprietor / all directors (for companies) / all partners (for firms)'

usualIssues: 'For a company, the company\'s PAN is required (not the director\'s personal PAN) for GST registration. The company gets its PAN automatically at incorporation. For a sole proprietor, your personal PAN is used. PAN must be linked with Aadhaar for the Aadhaar authentication step in GST registration. Check linkage at incometax.gov.in before starting.'
```

**Add Email ID and Mobile:**

```
'Email ID and Mobile Number'
required: true
note: 'active email and mobile for OTP verification on GST portal — must be in India'

whatIsIt: 'GST registration requires email and mobile verification via OTP on the GST portal (gst.gov.in). These become the primary credentials for your GST account — you will receive return filing reminders, GSTIN details, and tax authority communications on these. Unlike MCA, where each director needs separate credentials, GST registration uses one email and one mobile for the entire business.'

howToGet: 'Use your active personal or business email address and Indian mobile number. These should be numbers you check regularly — GST deadlines and notices are sent here. They do not need to be a new or dedicated account. Post-registration, these can be updated by logging into the GST portal under My Profile.'

usualIssues: 'If the mobile or email is not immediately accessible for OTP, registration stalls. Foreign proprietors / directors must use an Indian mobile — a family member\'s number is acceptable temporarily, but update to a dedicated business number post-registration. Two separate GST registrations (for two different businesses) can use the same email but should ideally have different mobile numbers to avoid confusion.'

details: [
  'One email and one mobile for the entire GST registration',
  'Must be active and accessible for real-time OTP',
  'Indian mobile number required — foreign numbers not accepted by GST portal',
  'You will receive GST filing reminders and notices on these contact details',
  'Update post-registration via GST portal if they change',
]
```

---

**Add HSN/SAC Code Details:**

```
'Business Activity and HSN/SAC Codes'
required: true
note: 'description of goods or services and their HSN/SAC codes — needed for GST registration'

whatIsIt: 'When registering for GST, you must declare what goods or services you sell and their corresponding HSN (Harmonised System of Nomenclature) codes for goods or SAC (Services Accounting Code) codes for services. These codes determine your GST rate. Ollvy helps identify the correct codes for your business — you just describe what you sell in plain language.'

howToGet: 'Write out in simple terms what your business sells. For example: "I provide software development services to Indian clients", "I sell handmade leather bags online", "I run a restaurant". Ollvy maps this to the correct HSN/SAC code. You can also look up codes at gst.gov.in/informationSearch. Most service businesses use 4-digit SAC codes; goods use 4–8 digit HSN codes.'

usualIssues: 'Getting the HSN/SAC code wrong means your invoices show the wrong GST rate — leading to mismatches in GSTR-2A reconciliation and potential notices. If you sell both goods and services (common for tech companies selling software + implementation), you need to declare all relevant codes. Code 998314 (IT services) is different from 998315 (website development) — small differences matter for tax rate.'

details: [
  'Required for declaring your principal place of business and business activity',
  'SAC code for services (e.g., 998314 for IT consulting, 9963 for restaurant)',
  'HSN code for goods (e.g., 6403 for leather footwear, 8471 for computers)',
  'Multiple codes can be added if you sell diverse products/services',
  'Ollvy identifies the correct codes — just describe your business',
  'Correct code ensures correct GST rate on your invoices',
]
```

---

### Category 2: Business Address Proof (corrections)

**Utility Bill — update `usualIssues`:**

```
usualIssues: 'For GST, the electricity bill is the most commonly accepted document. Unlike MCA, the GST authority sometimes asks for the latest bill specifically — ensure it is the most recent month. If you are registering at a coworking space or virtual office, get the utility bill from the coworking provider in the format they normally supply for GST — most professional coworking spaces have a standard package for this. The address on the bill must exactly match the address entered in the GST registration form — even minor differences (Road vs Rd, Block vs B) can cause a mismatch flag.'
```

---

## Section 7 — Individual ITR Documents (`individualITRDocuments`) — NEW EXPORT

**3 categories · 15 documents (was 11 — added PAN, Aadhaar, Salary Slips, Bank Interest Certificate, Previous Year ITR)**

> This is a new data export. Migrate the Individual ITR page from inline data to use `DocumentChecklistContent` with this export.

### Category 1: Income Documents

---

**PAN Card** `required: true`

```
note: 'mandatory for filing — and must be linked with Aadhaar'

whatIsIt: 'PAN is your taxpayer ID — it is how the Income Tax Department tracks every rupee of income, TDS deducted on your behalf, and taxes paid. ITR filing is done under your PAN. From AY 2024-25, the new tax regime is the default — you choose whether to stick with it or switch to the old regime each year when filing. If you file via a CA (like Ollvy\'s CA), your PAN is used to log in to the Income Tax portal and file.'

howToGet: 'You almost certainly already have a PAN. If not, apply at NSDL or UTIITSL — takes 5–7 days and costs ₹107. Before filing, ensure PAN is linked with Aadhaar at incometax.gov.in/iec/foportal — unlinked PANs became inoperative from July 2023 and you cannot file a return with an inoperative PAN. Linking takes 2–3 days if not already done.'

usualIssues: 'PAN-Aadhaar linkage is the #1 issue that stops people from filing. Check it early. A common issue is PAN showing up as inoperative even after paying the ₹1,000 linkage fee — the portal takes 3–5 days to update after payment. If you have changed your name (after marriage, for example), update your PAN records before filing to avoid mismatches with bank and employer records.'

details: [
  'Mandatory for all ITR filings — filing is not possible without PAN',
  'PAN must be linked with Aadhaar — check at incometax.gov.in before filing',
  'Inoperative PAN (not linked with Aadhaar) cannot be used for filing from July 2023',
  'Linking PAN with Aadhaar costs ₹1,000 late fee if done after June 30, 2023',
  'Name change after marriage: update PAN name to match bank and employer records',
]
```

---

**Aadhaar Card** `required: true`

```
note: 'for e-verification of return — Aadhaar OTP is the fastest way to verify'

whatIsIt: 'Aadhaar is used for e-verification of your filed ITR. After filing, you must verify the return within 30 days or it is considered invalid. The fastest way is Aadhaar OTP — a one-time password sent to the mobile linked to your Aadhaar. Alternatively, you can verify via net banking, bank ATM, or by sending a physical signed ITR-V to CPC Bengaluru (takes 3–4 weeks). Aadhaar OTP is instant and is the recommended method.'

howToGet: 'Keep your Aadhaar and the mobile number linked to it ready. You do not need to submit a scan of Aadhaar to the tax department — just have it accessible for the OTP step. The OTP is sent to the mobile registered with UIDAI for your Aadhaar.'

usualIssues: 'If the mobile linked to Aadhaar is an old number you no longer use, the e-verification via OTP will fail. In this case, use net banking-based e-verification instead (requires access to your bank\'s net banking). Physical ITR-V submission is also an option but takes much longer to process.'

details: [
  'Not submitted as a document — used for e-verification only',
  'Mobile number linked to Aadhaar must be active for OTP',
  'If Aadhaar OTP method unavailable, use net banking EVC (Electronic Verification Code) as alternative',
  'Return must be e-verified within 30 days of filing — otherwise treated as non-filed',
  'Physical ITR-V (alternative to e-verification) must be sent to CPC Bengaluru',
]
```

---

**Form 16** `required: true`

```
note: 'TDS certificate from employer — issued annually by June 15 for the previous financial year'

whatIsIt: 'Form 16 is a TDS certificate issued by your employer showing: (a) your total salary paid during the financial year, (b) total TDS deducted, (c) a breakdown of all exemptions and deductions considered when computing TDS. It has two parts: Part A (generated by employer from TRACES portal — shows quarterly TDS details) and Part B (employer-generated — shows salary breakup, perquisites, deductions). It is the single most important document for a salaried ITR filing.'

howToGet: 'Your employer must issue Form 16 by June 15 every year (for the preceding FY). Ask your HR or payroll team if you haven\'t received it. If you changed jobs in the year, you need Form 16 from each employer separately. If your employer hasn\'t deducted TDS (because your income is below taxable threshold), they are not required to issue Form 16 — in this case, use salary slips and bank statements instead.'

usualIssues: 'Part A of Form 16 must be downloaded from TRACES and digitally signed by the employer — a printed/scanned version is less reliable and sometimes shows wrong figures. If your Form 16 amounts don\'t match your Form 26AS, get the discrepancy corrected with your employer before filing — mismatches trigger IT department notices. If you changed jobs and one employer didn\'t issue Form 16, you can reconstruct the income figure from salary slips.'

details: [
  'Part A: generated from TRACES portal, shows quarterly TDS deposits',
  'Part B: employer-generated, shows salary breakup and deductions',
  'Employer must issue Form 16 by June 15 for the previous financial year',
  'Changed jobs? Get Form 16 from each employer separately',
  'Cross-verify amounts with Form 26AS — mismatches must be resolved before filing',
  'Not mandatory if no TDS was deducted (income below threshold) — use salary slips instead',
]
```

---

**Salary Slips (Last 3 Months)** `required: false`

```
note: 'useful if Form 16 is not yet received or if perquisites need verification'

whatIsIt: 'Monthly salary slips from your employer show your gross salary, deductions (PF, professional tax, TDS), and net take-home for each month. They are needed when Form 16 is not yet available, when verifying perquisites (company car, accommodation, ESOPs etc.), or when you have changed jobs and the new employer\'s Form 16 doesn\'t cover the whole year. Salary slips also help reconcile if the Form 16 gross salary figure seems different from what you received.'

howToGet: 'Download from your company\'s HRMS portal (Workday, Darwinbox, Keka, Greythr etc.) or request from your HR/payroll team. For freelancers and consultants receiving consolidated payments, bank statements + invoices serve the same purpose. Salary slips are not officially submitted to the IT department — they are reference documents for your CA to compute income accurately.'

usualIssues: 'Slips from March (the last month of the financial year) sometimes don\'t reflect final TDS adjustments — use Form 16 to reconcile. If you have received any arrears or bonus payments that were not part of regular monthly slips, ensure these are captured — they often appear in Form 26AS and trigger notices if not declared.'

details: [
  'Last 3 months is sufficient for verification purposes',
  'Download from your company HRMS portal or request from payroll',
  'Not officially submitted to IT department — reference document for filing',
  'Needed when Form 16 not yet available or for verifying specific perquisites',
  'Cross-check variable pay, bonuses, and arrears against Form 26AS',
]
```

---

**Bank Statements (All Accounts)** `required: true`

```
note: 'all savings and current accounts active during the financial year — for interest income and reconciliation'

whatIsIt: 'Bank statements are needed to: (a) declare interest income from savings accounts (taxable above ₹10,000/year), (b) verify all salary credits, (c) reconcile any unexplained credits that AIS or 26AS might flag, (d) compute capital gains if mutual fund/equity redemptions went through the account. AY 2025-26 onwards, you must disclose all active bank accounts — not just the one you want refund to.'

howToGet: 'Download 12-month statements (April–March) from each bank\'s net banking portal. Most banks allow PDF download of the full year in one go. You need statements from every bank account that was active, even if you barely used it. Only exception: accounts with zero activity throughout the year can typically be omitted.'

usualIssues: 'Savings account interest (even from multiple small accounts) is often overlooked and not declared — the IT department now cross-checks this via AIS. FD interest is sometimes counted when the FD matures (not when credited annually) — check whether your bank adds FD interest annually to your savings account. All accounts must be declared including NRE/NRO accounts for residents who have not changed their account type after returning to India.'

details: [
  'Include all savings, current, salary, and NRE/NRO accounts active during the year',
  '12-month statement April to March for the relevant financial year',
  'Savings account interest above ₹10,000 is taxable — declare it',
  'FD interest must be declared even if not withdrawn',
  'Download from net banking — most banks provide annual PDF statement in one click',
  'Accounts with zero transactions can be skipped — all others must be included',
]
```

---

**Bank Interest Certificate / Form 16A** `required: false`

```
note: 'for FD interest and TDS deducted on deposits — issued by your bank'

whatIsIt: 'If your bank has deducted TDS on fixed deposit interest (when FD interest exceeds ₹40,000/year for individuals, ₹50,000 for senior citizens), the bank issues Form 16A as a TDS certificate. For savings account interest where no TDS is deducted, banks issue an "Interest Certificate" or "Certificate of Interest" showing total interest earned during the year. Both are needed to accurately declare interest income and claim TDS credit.'

howToGet: 'Download from your bank\'s internet banking portal under "Tax" or "Certificates" section. Most large banks (SBI, HDFC, ICICI, Axis, Kotak) now offer these as downloadable PDFs from the app or net banking. For smaller banks or cooperative banks, visit the branch and request it. Form 16A is also available on the TRACES portal (taxdeductor.gov.in) if you know your TAN.'

usualIssues: 'Many people overlook interest certificates for small FDs or recurring deposits — even ₹5,000 of unreported interest can trigger a notice. Check your AIS (Annual Information Statement) on the IT portal — it now pre-populates all interest income reported by your banks to the IT department. If a bank has not reported in AIS, it doesn\'t mean you don\'t need to declare it.'

details: [
  'Form 16A: issued by bank when TDS was deducted on FD interest',
  'Interest Certificate: issued by bank for savings/FD interest (when no TDS deducted)',
  'Download from net banking under Tax/Certificates section',
  'Available on TRACES portal using bank\'s TAN',
  'Cross-check with AIS on IT portal — AIS pre-populates bank-reported interest',
  'Senior citizens (age 60+): TDS on FD starts above ₹50,000 interest (not ₹40,000)',
]
```

---

**Form 26AS and Annual Information Statement (AIS)** `required: true`

```
note: 'download both from incometax.gov.in — cross-verify with all other documents before filing'

whatIsIt: 'Form 26AS is a tax passbook showing all TDS deducted on your behalf by employers, banks, and other deductors, plus advance tax paid, self-assessment tax paid, and any refunds received. AIS (Annual Information Statement) is the newer, more comprehensive version — it shows everything in 26AS plus stock market transactions, mutual fund redemptions, property sale, dividend income, interest from savings accounts, foreign remittances, and more. Both are freely downloadable from the IT portal. Your ITR must match these — any discrepancy is flagged for scrutiny.'

howToGet: 'Log in to incometax.gov.in using your PAN. Form 26AS: go to e-File > Income Tax Returns > View Form 26AS. AIS: go to Services > Annual Information Statement. Download both as PDFs. AIS also has a mobile app (AIS App) for easy access. If you see entries in AIS that you don\'t recognise, you can submit feedback to mark them as correct or incorrect before filing.'

usualIssues: 'The most common issue: an employer has deducted TDS but not deposited it with the government — it won\'t appear in 26AS, so you can\'t claim that credit. Follow up with your employer\'s payroll team immediately if this happens. AIS sometimes shows inflated figures for property sales (stamp duty value instead of sale value) — submit feedback to correct before filing. Crypto income, if any, is now tracked in AIS via exchange-reported data.'

details: [
  'Download from incometax.gov.in — completely free, no third party needed',
  'Form 26AS: TDS, advance tax, refunds — traditional tax summary',
  'AIS: adds mutual funds, stocks, dividends, property, bank interest, crypto',
  'Submit AIS feedback for incorrect entries before filing — don\'t file a return that contradicts uncorrected AIS',
  'If TDS in 26AS is lower than TDS on your Form 16 — employer has not deposited — contact them immediately',
  'Cross-verify 26AS figures with each Form 16 before handing to CA',
]
```

---

**Rental Income Proof** `required: false`

```
note: 'rent receipts or agreement — if you receive rent from any property'

whatIsIt: 'If you own a property and rent it out, the rental income must be declared under "Income from House Property." You need to show the annual rent received and the rental agreement to substantiate it. You can claim a standard 30% deduction on net annual value and deduct home loan interest (up to ₹2 lakh for self-occupied, unlimited for let-out property). Municipal taxes paid on the property are also deductible.'

howToGet: 'Collect rent receipts from tenants or the rent agreement showing the monthly rent. If your tenant has deducted TDS on rent (required if rent exceeds ₹50,000/month under Section 194IB), obtain Form 16C from them. For rental income from outside India, additional FEMA compliance may apply.'

usualIssues: 'Rental income declared by you must match what appears in your tenant\'s Form 26QC (TDS filing). If tenants are companies paying rent above ₹2.4 lakh/year and have deducted TDS, make sure it reflects in your Form 26AS — chase the tenant to deposit TDS if it doesn\'t. Claiming "nil" rental income for a property that\'s clearly rented (visible in AIS via tenant-filed TDS) is a common notice trigger.'

details: [
  'Rent receipts or rental agreement showing monthly rent amount',
  'If tenant deducts TDS on rent: obtain Form 16C from the tenant',
  'Municipal tax paid receipts (for deduction against rental income)',
  'Home loan statement if claiming interest deduction on let-out property',
  'TDS on rent applies when rent exceeds ₹50,000/month (tenant obligation under Section 194IB)',
]
```

---

### Category 2: Deduction Proofs

---

**80C Investment Proofs** `required: false`

```
note: 'up to ₹1.5 lakh deduction — only available if you choose old tax regime'

whatIsIt: 'Section 80C allows a deduction of up to ₹1.5 lakh per year from taxable income for investments in specified instruments: ELSS mutual funds, PPF, EPF (employer\'s portion + your own), NSC, 5-year FD, life insurance premium, principal repayment on home loan, children\'s school fees (tuition only), Sukanya Samriddhi, NPS Tier-2 (certain conditions). This deduction is available ONLY if you opt for the old tax regime. From AY 2024-25, the new tax regime is the default — you must explicitly choose the old regime to claim 80C.'

howToGet: 'Collect statements for whatever 80C investments you have made: ELSS statement from the fund house, PPF passbook (April–March pages), EPF statement from EPFO unified portal, NSC certificates, life insurance premium receipts, home loan principal certificate from bank, school fee receipts. Your employer typically collects these via Form 12BB for computing TDS.'

usualIssues: 'The most common mistake is assuming EPF contributions automatically count toward 80C even in the new regime — they do not. In the new tax regime, 80C deductions are not available. People switch to old regime without calculating if the tax saving from 80C actually exceeds the benefit of the new regime\'s lower slabs — Ollvy\'s CA compares both for you. ELSS lock-in is 3 years — you cannot claim 80C deduction if you redeem within 3 years.'

details: [
  'Maximum ₹1.5 lakh per year across all 80C investments combined',
  'Available ONLY in old tax regime — not available in new tax regime (default from AY 2024-25)',
  'ELSS: mutual fund statement from fund house or CAMS/KFintech',
  'PPF: passbook or statement showing deposits made April–March',
  'EPF: your own contribution (not employer\'s) shown in EPFO statement',
  'Life insurance premium: annual premium receipts',
  'Home loan principal: bank certificate showing principal repaid in the year',
]
```

---

**Home Loan Statement** `required: false`

```
note: 'interest certificate from lender — for Section 24(b) deduction on home loan interest'

whatIsIt: 'If you have a home loan on a self-occupied or let-out property, you can deduct the interest paid under Section 24(b): up to ₹2 lakh per year for self-occupied property (old and new tax regime), unlimited for let-out property. Your bank or NBFC issues an annual "Home Loan Interest Certificate" or "Repayment Certificate" showing the principal repaid and interest paid during the financial year. Both amounts are relevant — interest for Section 24(b), principal for Section 80C.'

howToGet: 'Download from your bank\'s home loan section on net banking, or request from the loan branch. Most banks issue these around April–May for the previous financial year. Also obtain a provisional certificate for any loan taken during the current year (for planned investments). If the loan is from a housing finance company (HDFC, LIC Housing, Bajaj Housing Finance etc.), download from their customer portal.'

usualIssues: 'For under-construction properties, interest during the construction period (pre-EMI interest) can be claimed in 5 equal installments after possession — many people miss this. If both spouses have the home loan, each can claim deduction proportionate to their loan ownership. If you rented out the property and claimed unlimited interest deduction, the IT department now limits set-off of house property loss against other income to ₹2 lakh per year (excess is carried forward).'

details: [
  'Get "Home Loan Interest Certificate" from your bank — shows principal and interest for the FY',
  'Section 24(b): deduct interest paid — ₹2 lakh limit for self-occupied, unlimited for let-out',
  'Section 80C: deduct principal repaid — within the ₹1.5 lakh overall limit (old regime only)',
  'Pre-EMI interest (during construction): claim in 5 equal installments after possession',
  'Joint home loan: each co-borrower can claim deduction proportional to their ownership',
  'Available in both old and new tax regimes for self-occupied property (Section 24(b))',
]
```

---

**Health Insurance Premium (Section 80D)** `required: false`

```
note: 'for self, spouse, children, and parents — premium receipts from insurer'

whatIsIt: 'Section 80D allows deduction of health insurance premium paid for yourself (and family): up to ₹25,000 per year for self, spouse, and dependent children; additional ₹25,000 for parents (₹50,000 if parents are senior citizens). Available in the old tax regime only. Preventive health check-up expenses up to ₹5,000 (within the overall limit) are also deductible. This is separate from any employer-provided medical reimbursement.'

howToGet: 'Get the annual premium receipt from your health insurance company. Alternatively, if your employer buys a group health policy and deducts the premium from salary, get a certificate from your employer showing the premium amount. Digital receipts via email or insurer app are accepted.'

usualIssues: 'Premium paid in cash is not eligible for 80D deduction — must be paid digitally or by cheque. Parents\' coverage must be specifically mentioned in the policy to claim the additional ₹25,000/₹50,000. Critical illness or top-up insurance premiums are also eligible. Check AIS for any health insurance transactions pre-populated — sometimes tax-exempt employer contributions are visible here and might create confusion.'

details: [
  'Maximum deduction: ₹25,000 for self+family + ₹25,000/₹50,000 for parents',
  'Premium must be paid digitally — cash payment not eligible for 80D deduction',
  'Preventive health check-up: up to ₹5,000 (included within the overall limit)',
  'Old tax regime only — not available in new tax regime',
  'Get premium receipt from insurer or employer certificate for group policy',
  'Parents must be separately covered under the policy to claim the additional limit',
]
```

---

**Donation Receipts (Section 80G)** `required: false`

```
note: '50% or 100% deduction depending on recipient — retain receipt and Form 10BE'

whatIsIt: 'Donations to approved charitable organisations are deductible under Section 80G. The deduction is either 50% or 100% of the donation depending on the organisation. Donations to PM Relief Fund, National Defence Fund, etc. give 100% deduction with no limit. Donations to other approved NGOs typically give 50% deduction subject to a limit (10% of adjusted gross total income). From AY 2021-22, donors must provide PAN to the NGO — the NGO reports it in Form 10BD and issues Form 10BE to the donor.'

howToGet: 'Get Form 10BE from the NGO — this is the official donor certificate. The NGO files Form 10BD on the IT portal and it auto-populates in your AIS. If you donated before the Form 10BE system, retain the receipt showing: amount, date, organisation\'s PAN, and their 80G registration number. Only donations via cheque/NEFT/UPI are eligible — cash donations above ₹2,000 are not.'

usualIssues: 'Donations in cash above ₹2,000 are not eligible. Many small NGOs have not updated their 80G registration or it has expired — check validity at incometax.gov.in > Income Tax Laws > Approved Organisations. Without a valid Form 10BE, the IT department may disallow the deduction during scrutiny. Donation to family members or relatives is not eligible even if they run a registered trust.'

details: [
  'Get Form 10BE from the NGO — it is now the mandatory donor certificate',
  'Donation must be via cheque, NEFT, or UPI — cash above ₹2,000 not eligible',
  'Check NGO\'s 80G registration validity at incometax.gov.in before claiming',
  '100% deduction: PM Relief Fund, National Defence Fund, etc. (no cap)',
  '50% deduction: most other approved NGOs (capped at 10% of adjusted gross income)',
  'Old tax regime only — donations are not deductible in new tax regime',
]
```

---

### Category 3: Capital Gains Documents

---

**Stock Trading Statements (Capital Gains)** `required: false`

```
note: 'Profit and Loss statement from your broker — not the portfolio statement'

whatIsIt: 'If you have traded in stocks, ETFs, or derivatives during the year, you need a Capital Gains Statement from your broker showing: each transaction, acquisition date, sale date, cost of acquisition, sale price, short-term or long-term classification, and total gain/loss. Gains on equity shares and equity mutual funds held for more than 12 months are Long-Term Capital Gains (LTCG) — taxable at 12.5% above ₹1.25 lakh per year (from Budget 2024). Gains on shares held less than 12 months are STCG at 20%.'

howToGet: 'Download the Capital Gains / P&L Report from your broker\'s platform: Zerodha (Console → Reports → P&L), Groww, Upstox, Angel One etc. All major brokers provide this. Download the relevant financial year (April–March) report as PDF or Excel. For ESOP stock options, get a statement from your employer\'s ESOP administrator (Morgan Stanley Smith Barney, Carta etc.) showing exercise and vesting details.'

usualIssues: 'Brokers show capital gains in calendar year — ensure you download the financial year (April–March) version, not the calendar year. F&O (futures and options) losses can be carried forward 8 years but require a CA-filed ITR-3 (not ITR-1 or ITR-2). If you lost money on stocks and want to carry forward the loss, you must file ITR before the due date — missing the deadline means the loss lapses. ESOP income has two tax events: perquisite income at exercise (TDS by employer) and capital gain at sale.'

details: [
  'Download P&L or Capital Gains Statement from your broker for the financial year (Apr–Mar)',
  'Major brokers: Zerodha (Console), Groww (Reports), Upstox, Angel One all provide this',
  'LTCG (>12 months): 12.5% above ₹1.25 lakh per year (Budget 2024 rate)',
  'STCG (<12 months): 20% flat rate on equity/equity mutual funds',
  'F&O losses: carry forward for 8 years, requires ITR-3 filing',
  'ESOP: separate statement from employer\'s equity admin platform',
]
```

---

**Mutual Fund Statements (Capital Gains)** `required: false`

```
note: 'consolidated statement from CAMS or KFintech — for equity and debt fund redemptions'

whatIsIt: 'If you redeemed any mutual funds during the year, capital gains (or losses) need to be declared. For equity mutual funds, holding period determines LTCG vs STCG (as above). For debt mutual funds, all gains are now taxed at slab rate as short-term capital gains regardless of holding period (change from Budget 2023). You need a Consolidated Account Statement (CAS) from CAMS or KFintech covering the full financial year with all transactions.'

howToGet: 'Go to camsonline.com or kfintech.com, enter your PAN, and download the CAS for the financial year with transaction details. Alternatively, get it from your fund house\'s portal. ELSS redemptions (after 3-year lock-in) appear here too — they are LTCG. Liquid fund redemptions are also taxable at slab rate now (for units purchased after April 1, 2023).'

usualIssues: 'Many people confuse "SIP dividend" with redemption — dividends from mutual funds are now taxable at slab rates under "Income from Other Sources" and are pre-populated in AIS. If you are investing via a third-party app (Paytm Money, ET Money, Kuvera), the underlying custodian is still CAMS or KFintech — the CAS will show all your funds regardless of platform.'

details: [
  'Download CAS from CAMS (camsonline.com) or KFintech (kfintech.com) using your PAN',
  'Includes all mutual fund transactions across all AMCs in one statement',
  'Equity/equity-hybrid MF: LTCG at 12.5% (>12 months), STCG at 20% (<12 months)',
  'Debt MF (units bought after April 1, 2023): taxed at slab rate regardless of holding',
  'Dividend income from MF: taxable at slab rate, pre-populated in AIS',
  'ELSS redemption after 3-year lock-in: LTCG',
]
```

---

**Property Sale Documents** `required: false`

```
note: 'sale deed, cost of acquisition, and stamp duty value — for property capital gains'

whatIsIt: 'If you sold a property (residential, commercial, plot) during the financial year, capital gains arise. Residential property held for more than 24 months is LTCG — taxable at 12.5% without indexation benefit (Budget 2024 change). Alternatively, you can choose 20% with indexation if the property was acquired before July 23, 2024. STCG (held less than 24 months) is taxable at slab rates. You can save tax by investing gains in another residential property (Section 54) or in specified bonds (Section 54EC) within specific timeframes.'

howToGet: 'Gather the original purchase deed (showing cost of acquisition and date of purchase), the sale deed (showing sale price and date), and the stamp duty circle rate for the property (available from the state registration website). Your CA needs these to compute the gain and check if the sale value is below stamp duty value (in which case stamp duty value is used as the deemed sale consideration).'

usualIssues: 'If you inherited the property, cost of acquisition is the Fair Market Value as of April 1, 2001 — you need a registered valuer\'s certificate. TDS of 1% (Section 194IA) is deducted by the buyer if property sold for ₹50 lakh or above — get Form 16B from the buyer and ensure it reflects in your 26AS. Failure to declare property sale when it appears in AIS (via SFT reporting by registrar) is a very common notice trigger.'

details: [
  'Original purchase deed with date and cost — needed to compute acquisition cost',
  'Sale deed with date and sale price',
  'TDS certificate Form 16B from buyer (if sale value ≥ ₹50 lakh)',
  'Stamp duty circle rate at time of sale — from state registration portal',
  'For inherited property: registered valuer\'s certificate of FMV as of April 1, 2001',
  'Tax saving options: Section 54 (invest in another home), Section 54EC (bonds)',
]
```

---

**Previous Year ITR Acknowledgment** `required: false`

```
note: 'ITR-V from last year — for carry-forward losses and continuity'

whatIsIt: 'The ITR-V (acknowledgment) from your previous year\'s filing is useful for: (a) carrying forward capital losses from the previous year to set off against this year\'s gains, (b) verifying that last year\'s return was filed and e-verified, (c) pre-filling some details that auto-populate in this year\'s form. If you have carried-forward losses (capital or business), you cannot claim them unless last year\'s return was filed before the due date.'

howToGet: 'Log in to incometax.gov.in, go to e-File > Income Tax Returns > View Filed Returns. Download the ITR-V acknowledgment for the previous year. If you used a CA or tax filing service, they should have it on file. It is a short PDF generated by the IT portal after your return is processed.'

usualIssues: 'A common issue: you filed last year with a CA but they sent you a screenshot — not the actual ITR-V PDF. The ITR-V from the IT portal is what matters, not the CA\'s own computation. If last year\'s return was not e-verified (you just filed but forgot to verify), it is treated as not filed — carried-forward losses are lost.'

details: [
  'Download ITR-V from incometax.gov.in > e-File > View Filed Returns',
  'Required for claiming carried-forward capital or business losses',
  'Confirms last year\'s return was successfully filed and verified',
  'Carry-forward losses are forfeited if the loss year return was not filed before due date',
  'Also useful for cross-checking last year\'s figures if income patterns are similar',
]
```

---

## Section 8 — Business ITR Documents (`businessITRDocuments`) — UPGRADED

**4 categories · 17 documents (was 14 — added PAN Card+Aadhaar, Books of Accounts, DSC; enhanced Tax Audit Report spec)**

### Category 1: Identity and Basic Documents — NEW

---

**PAN Card** `required: true`

```
note: 'of the business entity (separate from owners\' personal PANs) + promoters\' PANs'

whatIsIt: 'A business entity (Pvt Ltd, LLP, Partnership, Proprietorship) has its own PAN — separate from the owners\' personal PANs. Business ITR is filed under the entity\'s PAN. For proprietorships, the proprietor\'s personal PAN is used as the business PAN. The company PAN is issued automatically when a Pvt Ltd is incorporated. For LLPs, it is applied via Form 4 along with LLP registration. Partnership firms apply separately via Form 49A after executing the partnership deed.'

howToGet: 'The entity PAN should already be in your possession since it is issued at registration. If you cannot find it, look at previous ITR filings, the incorporation certificate, or check at incometax.gov.in/iec/foportal using the entity name. If genuinely lost, apply for a PAN reprint at NSDL. For promoters who are signing directors/partners, their personal PANs are also required for the ITR signing process.'

usualIssues: 'Company PAN starting with "F" indicates a "firm" — ensure you are using the correct entity PAN. After conversion (Pvt Ltd to LLP, or similar), the entity may have a new PAN — check that the correct current PAN is used. Business PAN must be linked with the entity\'s email/mobile on the IT portal for DSC-based filing.'

details: [
  'Entity\'s own PAN (not promoter personal PAN) for companies, LLPs, and partnership firms',
  'Proprietorships use proprietor\'s personal PAN as business PAN',
  'Company PAN issued automatically at ROC incorporation',
  'If entity PAN unknown: check on incometax.gov.in using entity name',
  'Promoter/director PANs are also required for signing the ITR',
]
```

---

**Aadhaar Card of Signing Director/Partner** `required: true`

```
note: 'of the director or partner who will sign the ITR digitally using DSC'

whatIsIt: 'The individual who signs the business ITR using their DSC (Digital Signature Certificate) must have their Aadhaar verified on the IT portal. For companies, this is typically a director. For LLPs, a designated partner. For partnership firms, a partner. The Aadhaar is not submitted as a document but is required for e-verification and portal authentication. The entity\'s ITR is signed digitally using the signing person\'s personal DSC.'

howToGet: 'Ensure the signing director/partner has their Aadhaar linked to their PAN and their Aadhaar mobile is active. The PAN-Aadhaar linkage check is at incometax.gov.in. The entity must also add the CA to their e-filing portal as "My Chartered Accountant" before the CA can file the return on their behalf.'

usualIssues: 'If the designated signing director has recently changed mobile or email, the portal authentication may fail. Ensure portal contact details are updated under My Profile. Company ITRs filed after October 31 face a ₹5,000 late fee — the signing director must be available for DSC-based e-verification before the deadline.'

details: [
  'Personal Aadhaar of the signing director/partner — not the entity\'s Aadhaar',
  'Required for DSC-based portal authentication, not submitted as a physical document',
  'PAN-Aadhaar linkage of the signing individual must be active',
  'Signing director must add CA to portal as "My Chartered Accountant" for CA-filed ITRs',
]
```

---

**Digital Signature Certificate (DSC)** `required: true`

```
note: 'Class 3 DSC of the signing director or designated partner — mandatory for company ITR'

whatIsIt: 'Business ITR for companies and LLPs must be filed with a DSC — e-Aadhaar OTP verification is not available for non-individual entities. The DSC must belong to the director or designated partner authorised to sign the ITR. If the company already has a DSC from incorporation (procured by Ollvy), it can be reused for ITR filing provided it has not expired (DSCs are valid for 2 years).'

howToGet: 'Check if your DSC from incorporation is still valid. If yes, use it. If expired, Ollvy procures a renewal. The DSC USB token is used to sign the ITR digitally on the IT portal. If filing through Ollvy\'s CA, the CA will guide the director through the DSC signing step — it takes about 5 minutes and requires installing the DSC utility software on a Windows or Mac computer.'

usualIssues: 'DSC USB tokens sometimes fail due to driver issues, especially on newer operating systems. Ensure the DSC driver software is up to date before filing deadline. Expired DSC: do not leave renewal to the last minute — procurement takes 1–2 days. If the signing director has changed since last year, a new DSC for the new director is required.'

details: [
  'Mandatory for Pvt Ltd, Public Ltd, and LLP ITR filing',
  'Class 3 DSC (same used for MCA filings at incorporation)',
  'DSC valid for 2 years — check expiry before filing deadline',
  'Requires DSC utility software installed on computer — available from DSC provider',
  'If DSC expired: Ollvy renews it — allow 1–2 working days for renewal',
  'Partnership firms may use DSC or EVC (Electronic Verification Code via net banking) — company/LLP must use DSC',
]
```

---

### Category 2: Financial Statements

---

**Audited Balance Sheet** `required: true`

```
note: 'signed by the statutory auditor and approved by the board'

whatIsIt: 'The Balance Sheet shows the company\'s financial position on March 31 — assets, liabilities, equity, and reserves. For companies, this must be audited by a statutory auditor (Chartered Accountant) before ITR filing. The audited Balance Sheet must be approved by the board and adopted at the Annual General Meeting (AGM) before being filed with MCA (AOC-4). The same audited figures are used for ITR filing.'

howToGet: 'Your statutory auditor prepares the Balance Sheet after reviewing your books of accounts. Ensure it is signed by the auditor with their membership number and firm registration number. It should be on the company\'s letterhead and signed by at least one director. Provide Ollvy with the auditor-signed PDF — do not alter or reformat it after the auditor signs.'

usualIssues: 'Provisional (unaudited) Balance Sheets are not acceptable for filing. If the audit is delayed, the ITR filing date will be missed — plan the audit to complete by September 30 for a October 31 ITR deadline. For the first year of operation (partial year), ensure the Balance Sheet covers from the incorporation date to March 31.'

details: [
  'Must be audited and signed by statutory auditor (CA with COP — Certificate of Practice)',
  'Auditor must include their membership number, firm registration number, and UDIN',
  'UDIN (Unique Document Identification Number) is mandatory for all CA-certified documents from 2019',
  'Board approval and one director\'s signature required on the Balance Sheet',
  'Same figures used for both MCA filing (AOC-4) and ITR filing',
  'Provisional/management accounts not acceptable — must be auditor-certified',
]
```

---

**Profit and Loss Statement** `required: true`

```
note: 'full P&L for April 1 to March 31 — audited, matching the Balance Sheet'

whatIsIt: 'The P&L (Profit and Loss Statement) or Income Statement shows revenues, expenses, and net profit or loss for the financial year. For ITR, the CA needs the P&L to: compute taxable profit (which may differ from accounting profit after add-backs and disallowances), verify turnover for GST/audit threshold purposes, and complete Form 3CD (Statement of Particulars in Tax Audit Report). The P&L must reconcile with GST returns — a GST reconciliation is mandatory for audit-required businesses.'

howToGet: 'Your statutory auditor prepares this. Provide it as a signed auditor PDF. Also provide the detailed notes to accounts that explain major line items — Ollvy\'s CA needs these for Form 3CD preparation. If your company uses accounting software (Tally, Zoho Books, QuickBooks), export the P&L report for the full financial year.'

usualIssues: 'Revenue per P&L must reconcile with GSTR-3B turnover. A common discrepancy: GST on advances received in March included in GST returns but not in P&L until service is rendered. Disallowed expenses (cash payments above ₹10,000 per day, Section 37 disallowances, Section 40A(3) cash payments) must be added back to compute taxable income.'

details: [
  'Full year P&L: April 1 to March 31',
  'Auditor-signed with UDIN mandatory',
  'Revenue in P&L must reconcile with GSTR turnover — explain differences',
  'Cash expenses above ₹10,000 per transaction are disallowed under Section 40A(3)',
  'Notes to accounts are required alongside the main P&L statement',
  'Export from accounting software as PDF — do not submit Excel without audit certification',
]
```

---

**Notes to Accounts** `required: true`

```
note: 'detailed notes explaining significant line items in the Balance Sheet and P&L'

whatIsIt: 'Notes to Accounts (also called Notes to Financial Statements) provide the context behind the numbers. They explain significant accounting policies, details of fixed assets, loan terms, provisions, contingent liabilities, related party transactions, and other material items. These notes are a mandatory part of audited financial statements under the Companies Act and Indian Accounting Standards. For ITR and Form 3CD, the notes help the CA identify related party transactions, loans from directors, and items needing special treatment.'

howToGet: 'Your auditor prepares the notes as part of the financial statements package. Do not separate the notes from the Balance Sheet and P&L — provide the complete financial statements document (all three together with the auditor\'s report at the front).'

usualIssues: 'Related party transactions without disclosure in notes are the most common audit finding. If the company has taken loans from directors, shareholders, or related entities, these must be disclosed at specific interest rates or flagged. Contingent liabilities (pending lawsuits, pending tax demands) must be noted — omitting these creates problems during due diligence for future investment.'

details: [
  'Do not separate from the Balance Sheet and P&L — provide complete financial statements',
  'Must disclose related party transactions under AS 18 / Ind AS 24',
  'Director loans and shareholder loans must be disclosed with interest terms',
  'Contingent liabilities (pending litigation, tax demands) must be noted',
  'Accounting policies note should explain revenue recognition, depreciation method',
]
```

---

**Trial Balance** `required: true`

```
note: 'ledger-level detail for the full year — provided by your accountant from Tally/accounting software'

whatIsIt: 'The Trial Balance is a complete listing of all ledger accounts with their debit/credit balances as of March 31. It is the raw data behind the summarized Balance Sheet and P&L. Ollvy\'s CA uses it to: verify major expense heads, check unusually large entries, ensure consistency with GST filings, and complete Form 3CD clauses. It does not need to be audited but must reconcile with the audited financials.'

howToGet: 'Export from your accounting software: Tally (Display > Account Books > Trial Balance), Zoho Books (Reports > Trial Balance), QuickBooks (Reports > Trial Balance). Export for the period April 1–March 31. Save as PDF or Excel. If you maintain accounts manually, have your accountant prepare it.'

usualIssues: 'Trial balances exported from software often include sub-ledger details — the summarised version (showing only primary accounts) is fine for ITR purposes. If the Trial Balance does not match the audited figures (because some year-end adjustments were made after export), provide both — the pre-audit trial balance and the final audited figures.'

details: [
  'Export from Tally, Zoho Books, QuickBooks, or other accounting software',
  'Full financial year April 1 to March 31',
  'Summarised (major accounts only) version is acceptable',
  'Must reconcile with audited Balance Sheet and P&L',
  'Required for CA to complete Form 3CD — do not omit',
]
```

---

### Category 3: Tax Documents

---

**Form 26AS and AIS** `required: true`

```
note: 'download from incometax.gov.in — cross-verify against GST returns and financial statements'

whatIsIt: 'Same as individual ITR but for the business entity. The entity\'s PAN-linked Form 26AS and AIS show: TDS deducted on business receipts (by clients who deduct TDS on professional payments), advance tax paid, self-assessment tax paid, and high-value transactions. AIS is particularly important for businesses — it captures GST returns reported data, foreign remittances, property sale, and other financial transactions that the IT department cross-references with the ITR.'

howToGet: 'Log in to incometax.gov.in using the entity\'s PAN credentials. Go to e-File > View Form 26AS and Services > Annual Information Statement. Download both for the relevant AY. Ensure all advance tax challans and TDS on receipts are reflected — if clients have deducted TDS on payments to you, it must show in 26AS for you to claim the credit.'

usualIssues: 'Large companies deduct TDS on payments to vendors. If a client has deducted TDS but not deposited it, it won\'t appear in 26AS — chase the client\'s accounts team to ensure challan is deposited and Form 26Q is filed. The AIS for businesses often shows SFT (Statement of Financial Transactions) entries from banks — large cash deposits or withdrawals that need to be reconciled with books.'

details: [
  'Download under entity\'s PAN (not promoter personal PAN)',
  'All client-deducted TDS must appear in 26AS for claiming credit in ITR',
  'Check for any TDS mismatch with invoices raised — mismatches cause assessment issues',
  'AIS: check for SFT (Statement of Financial Transactions) entries — high-value cash transactions and property sales reported by banks and registrars that need reconciliation with your books',
  'Advance tax challans paid must match 26AS — verify challan numbers',
]
```

---

**TDS Certificates (Form 16A)** `required: false`

```
note: 'from clients who deducted TDS on payments to your business'

whatIsIt: 'When a company or individual pays you for services above ₹30,000 per year, they are required to deduct TDS (usually at 10% under Section 194J for professionals, 1–2% for contractors under 194C). They then issue Form 16A (a TDS certificate) to you. Collecting these ensures you can claim TDS credit in your ITR. Form 16A is also available directly from the TRACES portal using the deductor\'s TAN.'

howToGet: 'Chase your top clients for Form 16A in May–June after year-end. Most large clients use TRACES for TDS certificates — they should be able to download and email you the certificate. Alternatively, verify TDS on your 26AS — if it appears there, you don\'t strictly need the physical Form 16A but it is good to have for reconciliation.'

usualIssues: 'Some clients issue Form 16A with incorrect PAN of your company — this means the TDS credit does not appear in your 26AS. If you notice a TDS entry in your 26AS with "unmatched" or different PAN, contact the client to file a correction in their TDS return (Form 26Q).'

details: [
  'Issued by clients who deducted TDS on payments to your business',
  'Must show your entity\'s correct PAN — wrong PAN means no credit in 26AS',
  'Available from TRACES portal (tracesdeductor.gov.in) using deductor\'s TAN',
  'Cross-check against 26AS — if 26AS shows TDS entry, Form 16A is optional',
  'Request from all clients in May–June for the previous financial year',
]
```

---

**Advance Tax Challans** `required: false`

```
note: 'proof of advance tax payments made during the year — keep all payment receipts'

whatIsIt: 'Businesses with tax liability above ₹10,000 per year must pay advance tax in quarterly instalments (by June 15, September 15, December 15, March 15). The IT portal generates a Challan 280 payment receipt for each payment. These challans confirm advance tax was paid on time — late payment attracts Section 234B and 234C interest. Ollvy\'s CA verifies these when computing final tax liability.'

howToGet: 'Each advance tax payment via the IT portal generates a challan receipt — save all four. Download from your IT portal account under Pending Actions > e-Pay Tax. If tax was paid offline (bank counter), keep the physical challan stamped by the bank. Challans also appear in Form 26AS under the "Details of Tax Paid" section.'

usualIssues: 'A common error is paying advance tax under the wrong head (paying under individual PAN instead of company PAN or vice versa). If advance tax was paid under the wrong PAN, it is a complex correction process — always double-check PAN before payment. First-year companies sometimes miss advance tax entirely — if liable, pay by March 15 at the latest to limit 234B interest to one month.'

details: [
  'Four quarterly installments: June 15, September 15, December 15, March 15',
  'Challan 280 receipt generated for each payment — save all receipts',
  'Also visible in Form 26AS — cross-verify against challans held',
  'Ensure payment is under entity PAN, not promoter personal PAN',
  'Late payment: Section 234C interest at 1% per month on shortfall',
]
```

---

**Tax Computation (CA Prepared)** `required: false` — *Note: This was incorrectly listed as "Ollvy Provides" — corrected below*

```
note: 'prepared by Ollvy\'s CA based on financial statements provided — not a document you need to supply'

whatIsIt: 'Tax computation is the working prepared by the CA that bridges accounting profit and taxable income. It adds back disallowed expenses (cash payments, personal expenditure in books, Section 40A(3) violations), removes exempt income, applies depreciation under Income Tax rules (different from accounting depreciation), and arrives at taxable income. The final tax computation determines the ITR figures and ensures the return matches the audited accounts. Ollvy\'s CA prepares this entirely — you provide the financials, we handle the computation.'

howToGet: 'Nothing to provide for this — Ollvy prepares the tax computation using all the documents you have supplied. After preparation, we share it with you for review before filing. Retain a copy for your records — it is useful for future audits and for explaining ITR figures.'

usualIssues: 'Businesses sometimes submit accounts to their chartered accountant and assume the computation is being done correctly — review the computation yourself or have a second CA verify it once. Key items to check: depreciation rates per IT rules (not Companies Act), Section 40A(3) cash disallowances, and MSME payment deduction under Section 43B(h).'

details: [
  'Prepared entirely by Ollvy\'s CA — nothing to supply',
  'Bridges accounting profit and taxable income',
  'Key adjustments: IT depreciation vs accounting depreciation, Section 40A(3), exempt income',
  'Shared with you for review before ITR is filed',
  'Retain copy for at least 7 years — needed during IT assessments',
]
```

---

### Category 4: Books of Accounts (NEW CATEGORY)

---

**Books of Accounts (Cash Book, Ledger)** `required: true`

```
note: 'maintained mandatorily under Section 44AA — digital or physical'

whatIsIt: 'Section 44AA of the Income Tax Act requires businesses and professionals above certain income/turnover thresholds to maintain specified books of accounts: cash book, ledger, journal, copies of bills and receipts. In practice, most businesses maintain their accounts in Tally, Zoho Books, or QuickBooks — these digital records satisfy the requirement. The books must be retained for at least 6 years from the end of the relevant assessment year. For tax audit purposes (turnover > ₹1 Crore), the books must be audited by a CA.'

howToGet: 'Export your books from your accounting software for the financial year. Provide: (a) cash book / bank book for the year, (b) trial balance (covered above), (c) copies of major invoices if requested. If you maintain accounts manually, provide the physical books or a digitised copy. For presumptive taxation schemes (Section 44AD, 44ADA), full books are not mandatory — just bank statements and income receipts.'

usualIssues: 'Businesses that maintain no books and reconstruct them only for ITR are at high risk during scrutiny assessment. The IT department can estimate income using Section 144 (best judgment assessment) if books are inadequate or not maintained. Cash-intensive businesses: cash purchases above ₹10,000 per day per person are disallowed under Section 40A(3) — ensure books reflect digital payment modes.'

details: [
  'Mandatory under Section 44AA above specified income/turnover thresholds',
  'Digital records (Tally, Zoho Books, QuickBooks) satisfy the requirement',
  'Must be retained for 6 years from end of assessment year',
  'For presumptive taxation (Section 44AD/44ADA): full books not mandatory',
  'Cash transactions above ₹10,000 per day per person are disallowed — use digital payments',
  'Tax audit required when turnover > ₹1 Crore (or ₹10 Crore if 95%+ digital)',
]
```

---

**Tax Audit Report (Form 3CA/3CB + Form 3CD)** `required: false`

```
note: 'mandatory when turnover exceeds ₹1 Crore (business) or ₹50 lakh (profession) — prepared by CA'

whatIsIt: 'The Tax Audit Report is a mandatory document under Section 44AB when business turnover exceeds ₹1 Crore (₹10 Crore if 95%+ receipts are digital). It consists of: Form 3CA (auditor\'s report, if already audited under Companies Act or other law — typically for Pvt Ltd companies) OR Form 3CB (for entities not audited under other laws — typically partnerships, proprietorships), AND Form 3CD (a detailed 44-clause statement of particulars covering turnover, deductions, disallowances, GST compliance, loans, and more). Ollvy\'s CA prepares and files this. The deadline is September 30 for the financial year (one month before the ITR deadline).'

howToGet: 'Ollvy\'s CA prepares Forms 3CA/3CB and 3CD based on the audited financial statements, books of accounts, and GST returns you provide. The report is uploaded by the CA to the IT portal using their DSC. You then approve it from your entity\'s IT portal login. The CA also uses a UDIN (Unique Document Identification Number) for each Form 3CD — this makes the report verifiable by anyone on the ICAI website.'

usualIssues: 'Clause 44 of Form 3CD requires a detailed GST reconciliation — sales per books must match GSTR-3B filed for the year. Any mismatch needs an explanation. A common issue is reporting cash payments in Form 3CD (Clause 21) that exceed limits — this auto-flags for potential disallowance. Prepare financial statements and GST reconciliation by August to allow time for the CA to complete Form 3CD before the September 30 deadline.'

details: [
  'Mandatory: business turnover > ₹1 Crore, or profession gross receipts > ₹50 lakh',
  'Optional 44AB threshold: ₹10 Crore if 95%+ receipts and payments are digital',
  'Form 3CA: used when entity is already audited under another law (Pvt Ltd → Companies Act)',
  'Form 3CB: used for entities not audited under any other law (partnership, proprietorship)',
  'Form 3CD: mandatory with both — 44 clauses of detailed financial particulars',
  'UDIN mandatory for every Form 3CD — verifiable on ICAI (Institute of Chartered Accountants of India) website',
  'Deadline: September 30 (one month before ITR deadline of October 31)',
  'Ollvy\'s CA prepares and files — you approve on IT portal',
]
```

---

**Depreciation Schedule** `required: false`

```
note: 'for businesses with capital assets — depreciation under IT rules is different from companies act rates'

whatIsIt: 'Businesses claim depreciation on fixed assets (machinery, computers, vehicles, furniture, software) as an allowable deduction under Section 32 of the Income Tax Act. Income Tax depreciation rates are different from Companies Act (accounting) depreciation rates — for example, computers are depreciated at 40% per year under IT rules vs 33.33% or straight-line under accounting. The depreciation schedule tracks each asset block, its written-down value, additions, disposals, and the IT depreciation for the year.'

howToGet: 'Your accountant or CA prepares the IT depreciation schedule based on the list of assets and their purchase dates. Provide a list of all significant fixed assets with: purchase date, cost, and whether they are new additions this year. Ollvy\'s CA prepares the IT depreciation computation — you provide the asset register or the fixed asset schedule from your audited accounts.'

usualIssues: 'Assets put to use for less than 180 days in the year of purchase get only 50% of the full-year depreciation rate — missing this rule is a common error. If assets are sold during the year, the excess of sale value over Written Down Value creates a taxable capital gain (short-term, always). Software purchased is depreciated at 40% (same as computers). GST on capital assets can be claimed as ITC (Input Tax Credit) — ensure this is tracked separately from depreciation.'

details: [
  'IT depreciation rates differ from accounting rates — a separate IT depreciation schedule is needed',
  'Block-based depreciation: group assets by type (computers at 40%, furniture at 10%, etc.)',
  'New asset put to use < 180 days in the year: only 50% of the normal rate applies',
  'Sale of asset: excess sale value over WDV creates a taxable gain',
  'Computers and peripherals: 40% per year, software: 40%',
  'Ollvy\'s CA prepares the IT depreciation computation from your asset register',
]
```

---

### Category 5: GST Records (Existing category — corrections)

**GSTR-3B Summary — update `whatIsIt`:**

```
whatIsIt: 'GSTR-3B is the monthly (or quarterly under QRMP) summary GST return showing your turnover, output tax liability, ITC (Input Tax Credit) claimed, and net tax paid. The GST turnover per GSTR-3B must reconcile with the revenue per P&L for Clause 44 of Form 3CD. Ollvy\'s CA performs this reconciliation and explains any differences. Download annual GSTR-3B data from the GST portal: Reports > Return Filing Status > GSTR-3B, and then export each month.'
```

**GSTR-9 Annual Return — update `note` and `usualIssues`:**

```
note: 'annual GST return — mandatory for businesses with turnover above ₹2 Crore'

usualIssues: 'GSTR-9 is due by December 31 (for the previous FY). It consolidates all monthly GSTR-3B data and reconciles with GSTR-1. Differences between GSTR-9 and GSTR-3B figures require explanation. For FY 2024-25, GSTR-9 is optional (not mandatory) for taxpayers with turnover up to ₹2 Crore — check current notification before filing unnecessarily.'
```

---

**Add GST Reconciliation Statement:**

```
'GST Reconciliation Statement (GSTR-9C)'
required: false
note: 'mandatory for turnover above ₹5 Crore — reconciles audited P&L with GST returns'

whatIsIt: 'GSTR-9C is a reconciliation statement filed alongside GSTR-9 for businesses with turnover above ₹5 Crore. It reconciles: (a) turnover as per audited P&L vs turnover per GSTR-9, (b) ITC (Input Tax Credit) as per books vs ITC claimed in GSTR-3B, (c) taxes paid per books vs taxes deposited. From FY 2020-21, GSTR-9C is self-certified by the taxpayer (no mandatory auditor certification required, though CA certification is still best practice). Ollvy prepares GSTR-9C using your audited accounts and GST data.'

howToGet: 'Ollvy\'s CA prepares GSTR-9C based on your audited financial statements and GST portal data. You review and file it from your GST portal login. It is filed alongside GSTR-9 by the December 31 deadline.'

usualIssues: 'The most common reconciliation difference is timing — invoices raised but payment not yet received might be in P&L but not in GSTR (or vice versa). Advances received: GST is payable on advance for services, but P&L recognises revenue on delivery. These legitimate differences need documentation. Unexplained differences risk notice from GST authorities.'

details: [
  'Mandatory only for turnover above ₹5 Crore',
  'Reconciles audited turnover with GSTR turnover',
  'Filed alongside GSTR-9 by December 31',
  'Self-certification from FY 2020-21 — auditor sign optional but recommended',
  'Ollvy prepares based on your audited financials and GST portal data',
  'Legitimate differences (timing, advances) must be documented and explained',
]
```

---

## Section 9 — Trademark Documents (`trademarkDocuments`) — UPGRADED

**4 categories · 16 documents (was 13 — added Form TM-48, DSC, User Affidavit, MSME/Udyam Certificate)**

### Category 1: Applicant Identity

---

**PAN Card** `required: true`

```
note: 'of the individual / all directors (company) / all partners (firm) — must match name on application'

whatIsIt: 'PAN is required to establish the identity of the trademark applicant. For individuals filing in their personal name: their personal PAN. For companies: the signing director\'s PAN (or the company PAN for entity-level verification). For partnership firms: the authorised signatory\'s PAN. Name on PAN must exactly match the applicant name entered in Form TM-A — mismatches are a common cause of objection.'

howToGet: 'Photocopy or scan of PAN card. For online e-filing (which Ollvy uses), a clear scanned JPEG or PDF is needed. PAN is not formally "submitted" to the Trademark Registry in the same way as MCA — it is mainly used for identity verification if the Registry asks for further information. However, it must be ready and match application details.'

usualIssues: 'If you are filing as a company (e.g., "Ollvy Technologies Private Limited"), the applicant name must exactly match the company name on the incorporation certificate. If the company name has changed since incorporation, the name change must be completed and reflected in MCA records before filing — using the old company name is invalid. Individual filers: if your PAN says "Rajesh" but you commonly go by "Raj", file under your PAN name to avoid discrepancy.'

details: [
  'Individual/proprietor: personal PAN',
  'Company: signing director\'s PAN plus company PAN',
  'Partnership/LLP: authorised signatory\'s PAN',
  'Must match applicant name exactly in Form TM-A',
  'Scan as clear JPEG or PDF',
]
```

---

**Aadhaar Card** `required: true`

```
note: 'of the applicant or authorised signatory — for identity verification'

whatIsIt: 'Aadhaar is used as a secondary identity proof for trademark registration, especially during IP India portal registration and for DSC application (if not already held). For online filing, Aadhaar-based OTP can be used as authentication on the IP India portal. It is not formally filed as part of the TM-A application but is needed for portal account creation and DSC procurement if required.'

howToGet: 'Standard Aadhaar card scan (front and back). Active mobile linked to Aadhaar is needed if Aadhaar OTP is used for authentication.'

usualIssues: 'Foreign nationals without Aadhaar: a passport and local address proof are accepted substitutes. Ensure your IP India portal account is registered under the correct identity — discrepancies between portal identity and application identity can cause problems during examination.'

details: [
  'Scan front and back sides',
  'Active mobile linked to Aadhaar needed for OTP authentication on IP India portal',
  'Foreign nationals: passport in lieu of Aadhaar',
  'Not formally attached to TM-A but required for portal account and DSC',
]
```

---

**Address Proof** `required: true`

```
note: 'of the applicant — utility bill, bank statement, or Aadhaar (which also serves as address proof)'

whatIsIt: 'The trademark application requires the applicant\'s address, and the Registry may ask for address proof during examination. Accepted proofs: Aadhaar (which doubles as address proof), utility bill (not older than 60 days), bank statement (not older than 60 days), voter ID, driving license, or company incorporation certificate (for company applicants — the registered office address on the COI serves as address proof).'

howToGet: 'The same address proof gathered for GST or company registration works here. For company applicants, the COI and the registered office address declared to MCA is sufficient.'

usualIssues: 'If the applicant\'s address on the application differs from the address proof, the Registry may raise an examination report. Use the same address consistently across all documents.'

details: [
  'Accepted: Aadhaar, utility bill (<60 days), bank statement (<60 days), voter ID, driving license',
  'Company applicants: COI (Certificate of Incorporation) serves as address proof',
  'Address must match the address on Form TM-A',
  'Aadhaar is the most convenient — it serves as both identity and address proof',
]
```

---

### Category 2: Business Entity Documents

---

**Certificate of Incorporation** `required: false`

```
note: 'for company or LLP applicants — establishes legal existence of the entity'

whatIsIt: 'If a company or LLP is the trademark applicant (as opposed to an individual), the Certificate of Incorporation (COI) proves the entity legally exists and is authorised to apply for a trademark. The COI shows: company name, CIN (Corporate Identity Number), date of incorporation, and registered state. The applicant name on Form TM-A must exactly match the name on the COI. If the company name has changed, provide the COI showing the current name.'

howToGet: 'The COI is issued by MCA at the time of company/LLP incorporation. Download from MCA portal (mca.gov.in > MCA Services > Get Documents > Download e-Documents). If you incorporated with Ollvy, the COI is in your Ollvy dashboard. Scan or download as PDF — the digital COI from MCA portal is accepted.'

usualIssues: 'Company names change — ensure the COI reflects the current company name. If the trademark application is filed in the old name and the company has since changed its name, an objection will be raised. The COI must be submitted for all entity-type applicants (company, LLP, partnership with registration) — optional only for unregistered sole proprietors.'

details: [
  'Required for companies, LLPs, and registered entities',
  'Download from MCA portal as PDF',
  'Company name on COI must exactly match applicant name in Form TM-A',
  'If company name recently changed: use latest COI reflecting new name',
  'Unregistered sole proprietors: not required — use proprietor identity documents',
]
```

---

**Form TM-48 (Power of Attorney to Trademark Agent)** `required: true` `ollyvyProvides: true`

```
note: 'authorises your trademark attorney or Ollvy to file on your behalf — Ollvy prepares and executes this'

whatIsIt: 'Form TM-48 is the official Power of Attorney form prescribed by the Indian Trademark Rules. It authorises a trademark agent or attorney to file Form TM-A and represent the applicant before the Trademark Registry. This is mandatory for all applicants using a representative (including Ollvy). It must be signed by the applicant (not the agent) and is submitted along with the trademark application. Note: this is a specific prescribed form (not a general PoA letter) — using a generic PoA is incorrect and may be rejected.'

howToGet: 'Ollvy prepares Form TM-48 pre-filled with your details and Ollvy\'s trademark agent\'s details. You sign and return it (physical signature or DSC). It is filed as part of the TM-A application. The form is available on the IP India portal (ipindia.gov.in). It is a ₹1 stamp paper affair but for online filing, it is executed on plain paper with applicant signature.'

usualIssues: 'Using a generic "Power of Attorney" letter instead of Form TM-48 may be questioned during examination. Always use the prescribed TM-48. The applicant\'s signature on TM-48 must match the identity documents submitted. For company applicants, TM-48 must be signed by an authorised signatory (director with board authority).'

details: [
  'Prescribed form under Trademark Rules — not a general PoA',
  'Ollvy prepares and you sign — simple, 1-page document',
  'Authorises Ollvy\'s trademark agent to file and represent you before the Registry',
  'Mandatory when filing through an agent or attorney',
  'For companies: signed by authorised director, attach board resolution authorising them',
  'Submitted with TM-A as part of the same filing',
]
```

---

**Board Resolution** `required: false` `ollyvyProvides: true`

```
note: 'for company applicants — authorises specific director to file trademark on company\'s behalf'

whatIsIt: 'A board resolution is a formal decision by the company\'s board of directors authorising: (a) the company to apply for trademark registration, (b) a specific director to sign Form TM-48 and Form TM-A on the company\'s behalf. This is not required if the company is a sole director company (the director\'s authority is implicit) or if you are an individual applicant. Ollvy prepares the standard board resolution — the board needs to pass it (can be done by circular resolution).'

howToGet: 'Ollvy provides the draft board resolution. Directors pass it at a board meeting or by circulation (all directors sign a written resolution). It needs to be signed by the company secretary (if appointed) or by all directors if no CS. No ROC filing is required for this resolution — it is an internal resolution retained in the company\'s statutory register.'

usualIssues: 'For startups where both founders are directors, a circular resolution signed by both is the fastest approach — no need to call a formal board meeting. The resolution must specifically authorise trademark filing — a general "authorise director for all matters" resolution is less clean but usually accepted.'

details: [
  'Ollvy provides the standard board resolution draft',
  'Passed at board meeting or by circular resolution (all directors sign)',
  'Must authorise the company to apply for trademark and the specific director to sign',
  'No ROC filing required — internal corporate record',
  'For companies with CS (Company Secretary): CS attests the resolution',
  'Not required for sole director companies or individual applicants',
]
```

---

**Partnership Deed** `required: false`

```
note: 'only for partnership firms applying as trademark applicant — establishes firm\'s existence'

whatIsIt: 'If a partnership firm (not an LLP) is the trademark applicant, the partnership deed establishes the firm\'s legal identity and lists its authorised signatories. An unregistered partnership deed is accepted for trademark purposes (unlike some other filings that require a registered deed). The deed must show the firm name (which must match the applicant name in TM-A) and list the authorised partner who will sign the application.'

howToGet: 'Use the existing partnership deed. If the firm is unregistered with ROC, a notarised copy of the deed is acceptable. If the firm is registered under the Partnership Act (with the Registrar of Firms), provide the registration certificate.'

usualIssues: 'Unregistered firms are a very common applicant type in India. The lack of formal registration does not bar a trademark application — the deed itself is sufficient. Ensure the firm name on the deed matches the applicant name exactly in TM-A.'

details: [
  'Required for partnership firm applicants only',
  'Both registered and unregistered partnership deeds are accepted',
  'Must show firm name matching applicant name in TM-A',
  'Identify the authorised partner who will sign the application',
  'Notarised copy acceptable for unregistered firms',
]
```

---

**MSME / Udyam Registration Certificate** `required: false`

```
note: 'halves the trademark filing fee from ₹9,000 to ₹4,500 per class — provide if available'

whatIsIt: 'If your business is registered as an MSME under the Udyam portal (udyam.msme.gov.in), you pay half the trademark filing fee: ₹4,500 per class online (vs ₹9,000 for other entities). The same reduced fee applies to startups with DPIIT recognition (₹4,500 per class) and individual applicants. The savings are significant if filing for multiple trademark classes. The Udyam Certificate (a one-page document available from the Udyam portal) is submitted with the application to claim the reduced fee.'

howToGet: 'Download your Udyam Registration Certificate from udyamregistration.gov.in > Forgot Registration Number or enter the Udyam number directly. If you don\'t have an MSME registration and your business qualifies (turnover < ₹250 Crore, investment < ₹50 Crore for medium enterprise), register at udyamregistration.gov.in — it is free and takes under an hour. Also see if your business qualifies for DPIIT startup recognition (dpiit.gov.in) which also provides the ₹4,500 fee.'

usualIssues: 'The Udyam certificate must show the applicant entity as the MSME — if the trademark is being filed in an individual\'s name but the MSME certificate is in the company name, the reduced fee cannot be claimed. Also ensure the Udyam certificate is not expired (they are now permanent but older Udyog Aadhaar certificates may need migration to Udyam).'

details: [
  'Reduces filing fee from ₹9,000 to ₹4,500 per class — significant savings for multi-class filings',
  'Download from udyamregistration.gov.in using your Udyam number',
  'Free to register if business qualifies (MSMEs and startups)',
  'DPIIT startup recognition certificate provides the same fee benefit',
  'Entity on Udyam certificate must match trademark applicant name',
  'Old Udyog Aadhaar certificates: migrate to Udyam at udyamregistration.gov.in',
]
```

---

### Category 3: Trademark Details

---

**Brand Name (Word Mark)** `required: true`

```
note: 'the exact word or phrase you want to protect — spelling, capitalisation, and spaces matter'

whatIsIt: 'The word mark is the text you want to register as a trademark — your brand name, company name, product name, or tagline. A word mark protects the words themselves regardless of font or design. This is the strongest form of trademark because it covers the name in any visual representation. Common examples: "TATA", "ZOMATO", "SWIGGY". You can also register a combination of words — like "Ollvy Compliance" as a single mark.'

howToGet: 'Simply provide the exact text you want to protect. Make sure the spelling is exactly as you want it protected. Do not add ™ or ® symbols to the submission. Capitalisation matters — "OLLVY" and "Ollvy" are registered as separate marks, though in practice both give you protection. Ollvy performs a trademark search before filing to check for conflicting marks.'

usualIssues: 'Filing a mark that is too descriptive or generic results in objection or rejection. "Best Software" for a software company is likely to be rejected as descriptive. "Ollvy" for a compliance marketplace is distinctive and registrable. Check availability: search at ipindiaonline.gov.in before filing. If a similar mark exists in the same class, the Registry will object and the applicant must respond within 30 days or appeal.'

details: [
  'Exact text to protect — spell it precisely, capitalisation as intended',
  'No ™ or ® symbols in the submission text',
  'Protects the words in any font, color, or style',
  'Ollvy performs trademark search before filing to check for conflicts',
  'Too-descriptive marks may be objected — "Best Compliance" would face objection',
  'A TM symbol can be used immediately after application is filed (before registration)',
]
```

---

**Logo File** `required: false`

```
note: 'if registering a logo or device mark — JPEG format, 8×8 cm, high resolution'

whatIsIt: 'If you want to protect your logo (a design, symbol, or stylised text), you can file a device mark or a combination mark (logo + text). Registering both the word mark and the logo separately gives maximum protection. A logo trademark protects that specific visual representation — if your brand uses a unique visual identity, filing both the word mark and the device mark is recommended. The logo file must be in JPEG format, 8×8 cm at minimum, high resolution.'

howToGet: 'Export your logo from Figma, Illustrator, Canva, or wherever it was designed as a high-resolution JPEG (minimum 300 DPI, 8×8 cm). Black and white version is preferred if you want protection regardless of color — a color mark is only protected in those specific colors. A black and white (grayscale) mark covers you for all colors.'

usualIssues: 'Low-resolution logos (pixelated or blurry) are rejected by the Registry. The logo must be a clean, clear representation. If you file a color logo, only that exact color combination is protected — if competitors use a different color of the same shape, you may have limited recourse. Recommend filing in black and white unless color is a distinctive brand element (like Cadbury\'s distinctive purple).'

details: [
  'JPEG format, 8×8 cm, minimum 300 DPI',
  'Black and white (grayscale) preferred — covers all color versions',
  'Color mark: protects only those specific colors',
  'Export from design software at high resolution — avoid saving from a website (low quality)',
  'Can file both word mark and logo as separate applications for dual protection',
  'A separate application + fee is required for each mark (word mark ≠ logo)',
]
```

---

**Business Description and Trademark Class** `required: true` `ollyvyProvides: true` (for class selection)

```
note: 'describe your goods/services — Ollvy selects the correct Nice Classification class(es)'

whatIsIt: 'India follows the Nice Classification system (45 classes: 1–34 for goods, 35–45 for services) to categorise what a trademark covers. A trademark registered in Class 42 (IT services) does not protect you in Class 9 (software products) — they are different classes. You must describe what your business does and Ollvy selects the appropriate class(es). The class determines the fee (₹4,500 or ₹9,000 per class per application). Filing in the wrong class means your mark is not protected for your actual business.'

howToGet: 'Describe in plain language: what you sell and to whom. "We are a B2B SaaS compliance management platform for Indian SMEs" → Ollvy maps this to Class 42 (software as a service), Class 35 (business management services), and possibly Class 45 (legal services). Ollvy provides the official Nice Class description that goes into the Form TM-A application.'

usualIssues: 'Filing in too few classes is a common mistake — a food brand registering only in Class 30 (coffee, tea, rice) but not in Class 43 (restaurants) leaves their restaurant business unprotected. Conversely, filing in too many classes unnecessarily increases cost. Ollvy recommends the minimum necessary classes for comprehensive protection.'

details: [
  'Classes 1–34: goods. Classes 35–45: services.',
  'One fee per class per application',
  'Common tech/service company classes: 42 (SaaS/IT), 35 (business services), 45 (legal)',
  'Ollvy selects classes and writes the official Nice Classification description',
  'Wrong class = unprotected for that category of goods/services',
  'At minimum, file in the class most central to your primary business',
]
```

---

### Category 4: Legal and Filing

---

**DSC (Digital Signature Certificate)** `required: true` `ollyvyProvides: true`

```
note: 'Class 3 DSC required for online trademark e-filing on IP India portal'

whatIsIt: 'For online trademark applications filed on the IP India portal (ipindiaonline.gov.in), a Class 3 DSC is required to authenticate the filing. Without a DSC, you must file the application in person at one of the Trademark Registry offices in Delhi, Mumbai, Kolkata, Ahmedabad, or Chennai (which adds 15–20 days to get the acknowledgment). E-filing with DSC gets you an instant acknowledgment number, after which you can use the ™ symbol immediately. Ollvy handles DSC procurement if you don\'t already have one.'

howToGet: 'If you already have a DSC from Pvt Ltd incorporation (procured by Ollvy), the same DSC is reused — no new DSC needed. If you are an individual without a DSC, Ollvy procures one as part of the trademark package. DSC must be in the name of the applicant (individual) or the authorised signatory (for company applications).'

usualIssues: 'Expired DSCs cause e-filing to fail. Check DSC validity before filing (DSCs are valid for 2 years). If the DSC belongs to a director who has since left the company, a new DSC for the current authorised signatory is required. Some DSC USB tokens have compatibility issues with certain browsers — Ollvy guides you through the DSC signing step.'

details: [
  'Required for e-filing on IP India portal — avoids in-person filing at Registry',
  'E-filing gives instant acknowledgment and ™ usage right immediately',
  'If you already have a DSC from Pvt Ltd registration: reuse the same DSC',
  'DSC must be in applicant\'s name (individual) or authorised signatory (company)',
  'Valid for 2 years — check expiry before filing',
  'Ollvy procures DSC if you don\'t have one',
]
```

---

**User Affidavit (Claim of Prior Use)** `required: false`

```
note: 'only if claiming prior use of the mark — establishes earlier date of use'

whatIsIt: 'If you have been using your trademark in commerce before filing the application, you can claim a "prior use" date in Form TM-A. This is important because trademark rights in India arise partly from use, not just from registration. To support a prior use claim, you file a User Affidavit stating when you first used the mark, in what territory, and for what goods/services. This is a sworn affidavit before a Notary Public or First Class Magistrate.'

howToGet: 'Collect evidence of first use: earliest invoice with the brand name, product packaging with the mark, website screenshots with earliest archive dates (via Wayback Machine), advertisements, or delivery receipts. Ollvy prepares the User Affidavit draft — you swear it before a Notary. Attach supporting documents as exhibits to the affidavit.'

usualIssues: 'Claiming a prior use date without adequate evidence is risky — if someone opposes your application and disputes your use claim, you need to produce documentary evidence. Weak or unsubstantiated use claims may be struck down during opposition. If you genuinely have early use evidence, file it — it strengthens your position significantly against opponents.'

details: [
  'File only if you have actual documentary evidence of prior use',
  'Evidence: invoices, packaging, website screenshots, advertisements with the brand name',
  'Affidavit must be sworn before a Notary Public — notarisation required',
  'Ollvy prepares the affidavit draft — you sign before a Notary',
  'Prior use claim helps in opposition proceedings if a competitor files a similar mark',
  'Do not fabricate use dates — this is perjury and grounds for trademark cancellation',
]
```

---

**Trademark Search Report** `required: false` `ollyvyProvides: true`

```
note: 'Ollvy performs this before filing — identifies conflicting marks in the same class'

whatIsIt: 'Before filing a trademark application, Ollvy performs a comprehensive search on the IP India database to check for: (a) identical marks in the same class, (b) similar marks (phonetically or visually) in the same class, (c) well-known marks that may block registration across classes. This search is not submitted to the Registry — it is an internal diligence step to assess the risk of objection or opposition before investing in the filing fee.'

howToGet: 'Ollvy conducts this search automatically as part of the trademark filing process. We share the search results report with you along with a risk assessment. You decide whether to proceed based on the search results. The search covers the official IP India trademark database (ipindiaonline.gov.in) and takes 30–60 minutes.'

usualIssues: 'A search showing no identical marks is reassuring but not a guarantee — similar marks can still cause objection, and the Registry has discretion. Marks that appear abandoned in search results might still have pending renewals. For high-value brand names (company-wide marks, large product launches), consider a comprehensive trademark clearance opinion from a senior trademark attorney beyond the standard search.'

details: [
  'Ollvy performs this as part of the filing process — no action needed from you',
  'Searches for identical and similar marks in your target class(es)',
  'Not submitted to Registry — internal pre-filing diligence',
  'Clean search does not guarantee registration — Registry retains discretion',
  'Ollvy shares the search report and risk assessment before you approve the filing',
]
```

---

**Power of Attorney / Form TM-48** *(This is now listed as a primary document under Category 2 — do not duplicate here)*

---

## Section 10 — SEO: Page Titles, Meta Descriptions, FAQs, Schema

### 10.1 Meta Tags — All 8 Pages

| Page | Title Tag | Meta Description |
|---|---|---|
| Pvt Ltd | Documents Required for Pvt Ltd Company Registration India 2025 \| Ollvy | Complete checklist of documents needed to register a Private Limited Company in India. PAN, Aadhaar, MOA, AOA, DSC, DIN — everything explained with how-to and common issues. |
| LLP | Documents Required for LLP Registration India 2025 \| Ollvy | Full document checklist for LLP registration: PAN, Aadhaar, DPIN, DSC, LLP Agreement explained. See what Ollvy provides vs what you supply. |
| Partnership | Documents for Partnership Firm Registration India 2025 \| Ollvy | Complete documents list for registering a partnership firm. Partnership deed, PAN, address proofs — all explained with common pitfalls. |
| GST Registration | Documents Required for GST Registration India 2025 \| Ollvy | GST registration document checklist: PAN, Aadhaar, address proof, bank statements, business details. What's mandatory, what Ollvy provides. |
| Sole Proprietor | Documents for Sole Proprietorship Registration India 2025 \| Ollvy | Document checklist for sole proprietorship and GST registration. Proprietor identity, address, bank proof — all explained simply. |
| Individual ITR | Documents Required to File Individual ITR India FY 2024-25 \| Ollvy | Complete document checklist for salaried ITR filing: Form 16, 26AS, AIS, investment proofs, capital gains documents. Free checklist with step-by-step guidance. |
| Business ITR | Documents for Business ITR Filing India FY 2024-25 \| Ollvy | Full document checklist for business income tax return: audited accounts, Form 3CA/3CD, GST returns, TDS certificates — everything your CA needs. |
| Trademark | Documents Required for Trademark Registration India 2025 \| Ollvy | Complete trademark registration document checklist: Form TM-A, TM-48, logo, identity proof, business entity documents. Class selection and fee guide included. |

### 10.2 H2 Editorial Structure (SEO — Visible HTML, not hidden)

**Pvt Ltd:**
- H2: What documents are needed to register a Private Limited Company in India?
- H2: Which documents does Ollvy prepare for you?
- H2: Documents for foreign directors and NRI shareholders
- H2: How long does company registration take once documents are ready?
- H2: Common reasons for MCA rejection and how to avoid them

**Individual ITR:**
- H2: What documents do I need to file my ITR for FY 2024-25?
- H2: How to get Form 16 from your employer
- H2: What is the difference between Form 26AS and AIS?
- H2: Documents needed if you have capital gains from stocks or mutual funds
- H2: Which deductions can you claim and what proof do you need?

**Business ITR:**
- H2: What documents does a business need to file its ITR?
- H2: When is a tax audit mandatory for your business?
- H2: What is Form 3CA, 3CB, and 3CD?
- H2: GST reconciliation for ITR filing — what it means and why it matters
- H2: Deadlines for business ITR and tax audit report

**Trademark:**
- H2: What documents are needed to register a trademark in India?
- H2: What is Form TM-A and Form TM-48?
- H2: How to choose the right trademark class for your business
- H2: How to reduce trademark filing fees with MSME registration
- H2: How long does trademark registration take in India?

### 10.3 FAQs — Individual ITR Page (minimum 6)

**Q: What is the most important document for filing an individual ITR?**
A: Form 16 (issued by your employer) is the most important for salaried individuals — it summarises your salary income and TDS deducted for the year. Cross-check it with Form 26AS downloaded from the Income Tax portal before filing. If amounts differ, resolve the discrepancy with your employer before submission.

**Q: What is the difference between Form 26AS and Annual Information Statement (AIS)?**
A: Form 26AS shows TDS deducted on your behalf, advance tax paid, and refunds received. AIS is a much more comprehensive version added from FY 2020-21 — it includes everything in 26AS plus your mutual fund transactions, stock trades, savings account interest, dividend income, property sales, and foreign remittances. The IT department uses AIS to cross-check your ITR — ensure your return accounts for all entries in AIS.

**Q: Do I need to submit physical documents when filing ITR?**
A: No. ITR is an annexure-less form — you do not attach any documents when filing. However, you must retain all documents (Form 16, bank statements, investment proofs) for at least 6 years in case of assessment or scrutiny. The IT department may ask for them later.

**Q: What if I don't have Form 16 from my employer?**
A: You can file without Form 16 using salary slips, Form 26AS, and bank statements showing salary credits. Calculate gross salary from slips, note TDS from 26AS, and proceed. Contact your employer for Form 16 — they are legally required to issue it by June 15.

**Q: What documents do I need to claim 80C deduction?**
A: ELSS mutual fund statement from CAMS/KFintech, PPF passbook showing deposits, life insurance premium receipt, home loan principal certificate from your bank, and school fee receipts for children. 80C deductions are only available in the old tax regime — compare both regimes before deciding.

**Q: I sold mutual funds this year. What capital gains documents do I need?**
A: Download the Capital Gains / P&L Report from your broker or fund house for the financial year. For mutual funds, download the Consolidated Account Statement (CAS) from CAMS (camsonline.com) or KFintech (kfintech.com) using your PAN. This covers all fund houses in one statement.

### 10.4 FAQs — Trademark Page (minimum 6)

**Q: What is Form TM-A and Form TM-48?**
A: Form TM-A is the trademark application form — the main filing that registers your brand. Form TM-48 is the Power of Attorney that authorises a trademark agent (like Ollvy) to file on your behalf. Both are prescribed forms under the Trade Marks Rules, 2017 and must be submitted together.

**Q: How much does trademark registration cost in India?**
A: ₹4,500 per class for individuals, sole proprietors, small enterprises (MSMEs), and DPIIT-recognised startups. ₹9,000 per class for all other entities (companies without MSME registration). These are the e-filing fees. Physical filing costs ₹5,000 or ₹10,000 respectively. Ollvy's service fee is separate from the government fee.

**Q: Do I need to register a trademark for each class separately?**
A: Yes. A trademark is registered per class — Class 42 (IT services) does not protect you in Class 35 (business services). If you operate across multiple categories, file in each relevant class. One application can cover multiple classes, but each class is charged separately.

**Q: How long does trademark registration take?**
A: 6–24 months. After filing, you receive an acknowledgment number and can use the ™ symbol immediately. The Registry examines the application and may raise an objection (within 3–6 months). If no objection or opposition, the trademark is registered. If objected, you have 30 days to respond. Total time varies based on Registry workload and whether objections arise.

**Q: Can I use the ® symbol after filing the application?**
A: No. The ® symbol can only be used after the trademark is officially registered. After filing (but before registration), you may use the ™ symbol. Using ® before registration is illegal under the Trade Marks Act, 1999.

**Q: What happens if someone files a similar trademark before mine?**
A: India is a first-to-file system — the applicant who filed first generally gets priority. If your mark is already in use but not registered, the other party may still obtain registration before you. This is why filing early is important. If you have evidence of prior use, file a User Affidavit — prior use is considered by the Registry even in first-to-file systems.

### 10.5 JSON-LD Schema (FAQPage) — Add to All 8 Pages

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What documents are needed to register a Private Limited Company in India?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "PAN card and Aadhaar of all directors, passport-size photos, address proof (utility bill or bank statement), registered office proof, NOC from property owner, 3 proposed company names, business activity description, and authorized capital details. Ollvy provides the MOA, AOA, DSC, DIN, and declaration forms."
      }
    }
  ]
}
```

*(Add 5–6 page-specific FAQs per page — use the FAQs written in Section 10.4 and 10.3)*

### 10.6 BreadcrumbList Schema

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://ollvy.com" },
    { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://ollvy.com/services" },
    { "@type": "ListItem", "position": 3, "name": "Pvt Ltd Registration", "item": "https://ollvy.com/services/pvt-ltd-incorporation" },
    { "@type": "ListItem", "position": 4, "name": "Document Checklist", "item": "https://ollvy.com/services/pvt-ltd-incorporation/documents" }
  ]
}
```

---

## Section 11 — Component Migration for ITR + Trademark Pages

```
Pages that need migration from inline data to DocumentChecklistContent:
1. app/services/individual-itr/documents/page.tsx
2. app/services/business-itr/documents/page.tsx
3. app/services/trademark/documents/page.tsx

Steps for each:
1. Add the new data export to lib/data/document-checklists.tsx using the data in this spec
2. Import DocumentChecklistContent component
3. Replace the custom inline rendering with:
   <DocumentChecklistContent documents={individualITRDocuments} />
   (or the relevant export for each page)
4. Ensure auto-open first card behavior (already in component — just confirm it fires on mount)
5. Add FAQ section below the checklist component (visible HTML, not accordion)
6. Add SEO meta tags, OG tags, and JSON-LD from Section 10
```

---

## Section 12 — Test Cases

| Page | Test | Expected Result |
|---|---|---|
| All pages | Click first document card on load | Detail panel opens automatically showing whatIsIt, howToGet, usualIssues |
| All pages | Click any document card | Detail panel updates to show that document's rich data |
| All pages | Search for document name | Card highlights or filters to matching document |
| Pvt Ltd | "NOC from Property Owner" | Shows ollyvyProvides badge + Ollvy prepares this text in detail panel |
| Individual ITR | "Form 26AS and AIS" | Shows correct download instruction (incometax.gov.in, not a third party) |
| Business ITR | "Tax Audit Report" | Shows Form 3CA vs 3CB distinction, UDIN requirement, September 30 deadline |
| Trademark | "Form TM-48" | Shows it is a prescribed form, not a generic PoA, Ollvy prepares it |
| Trademark | "MSME/Udyam Certificate" | Shows ₹4,500 vs ₹9,000 fee saving clearly |
| Trademark | "User Affidavit" | Shows it is optional (only for prior use claims), not required |
| All ITR pages | "Tax Computation" | Shows "Ollvy prepares this — not a document you supply" |

---

## Section 13 — Implementation Order

1. Update `lib/data/document-checklists.tsx` with corrected/new documents for Pvt Ltd, LLP, Partnership, GST using enhanced rich data from this spec
2. Add new exports: `individualITRDocuments`, `businessITRDocuments`, `trademarkDocuments`
3. Migrate Individual ITR page from inline to `DocumentChecklistContent` with `individualITRDocuments`
4. Migrate Business ITR page — `businessITRDocuments`
5. Migrate Trademark page — `trademarkDocuments`
6. Add SEO meta tags, OG cards, JSON-LD to all 8 pages
7. Add FAQ sections (visible HTML) below checklist on all 8 pages
8. Run test cases from Section 12

---

*End of Specification*
*Ollvy · Compliance Infrastructure for Indian Businesses · ollvy.com*
